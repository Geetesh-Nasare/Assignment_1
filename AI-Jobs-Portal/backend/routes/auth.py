from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import UserModel
import bcrypt

auth_bp = Blueprint('auth', __name__)

def init_auth_routes(app):
    user_model = UserModel(app.db)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        user_type = data.get('user_type')  # 'job_seeker', 'recruiter', 'admin'
        
        if not user_type or user_type not in ['job_seeker', 'recruiter', 'admin']:
            return jsonify({'error': 'Invalid user type'}), 400
        
        # Check if user already exists
        existing_user = user_model.get_user_by_email(data['email'], user_type)
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400
        
        # Hash password
        password = data['password']
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Prepare user data
        user_data = {
            'email': data['email'],
            'password': hashed_password.decode('utf-8'),
            'first_name': data.get('first_name', ''),
            'last_name': data.get('last_name', ''),
            'phone': data.get('phone', ''),
            'user_type': user_type
        }
        
        # Add role-specific data
        if user_type == 'job_seeker':
            user_data.update({
                'resume_url': '',
                'skills': [],
                'experience': [],
                'education': []
            })
        elif user_type == 'recruiter':
            user_data.update({
                'company_name': data.get('company_name', ''),
                'company_size': data.get('company_size', ''),
                'industry': data.get('industry', ''),
                'website': data.get('website', '')
            })
        elif user_type == 'admin':
            user_data.update({
                'admin_level': data.get('admin_level', 'basic'),
                'permissions': ['manage_users', 'manage_jobs']
            })
        
        # Create user
        user_id = user_model.create_user(user_data, user_type)
        
        # Create JWT token
        access_token = create_access_token(identity={
            'user_id': user_id,
            'user_type': user_type,
            'email': data['email']
        })
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user_id': user_id,
            'user_type': user_type
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        user_type = data.get('user_type')
        
        if not all([email, password, user_type]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Authenticate user
        user = user_model.authenticate_user(email, password, user_type)
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create JWT token
        access_token = create_access_token(identity={
            'user_id': str(user['_id']),
            'user_type': user_type,
            'email': email
        })
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user_id': str(user['_id']),
            'user_type': user_type,
            'user_data': {
                'first_name': user.get('first_name', ''),
                'last_name': user.get('last_name', ''),
                'email': user['email']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user = get_jwt_identity()
        user_id = current_user['user_id']
        user_type = current_user['user_type']
        
        user = user_model.get_user_by_id(user_id, user_type)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Remove sensitive data
        user.pop('password', None)
        user['_id'] = str(user['_id'])
        
        return jsonify({'user': user}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        current_user = get_jwt_identity()
        user_id = current_user['user_id']
        user_type = current_user['user_type']
        
        data = request.get_json()
        
        # Remove fields that shouldn't be updated directly
        data.pop('_id', None)
        data.pop('created_at', None)
        data.pop('user_type', None)
        
        success = user_model.update_user(user_id, user_type, data)
        if not success:
            return jsonify({'error': 'Failed to update profile'}), 400
        
        return jsonify({'message': 'Profile updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    try:
        current_user = get_jwt_identity()
        user_id = current_user['user_id']
        user_type = current_user['user_type']
        
        data = request.get_json()
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        if not all([current_password, new_password]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Get user and verify current password
        user = user_model.get_user_by_id(user_id, user_type)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if not bcrypt.checkpw(current_password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify({'error': 'Current password is incorrect'}), 400
        
        # Hash new password
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        
        # Update password
        success = user_model.update_user(user_id, user_type, {'password': hashed_password.decode('utf-8')})
        if not success:
            return jsonify({'error': 'Failed to update password'}), 400
        
        return jsonify({'message': 'Password updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # In a real application, you would add the token to a blacklist
    return jsonify({'message': 'Logged out successfully'}), 200