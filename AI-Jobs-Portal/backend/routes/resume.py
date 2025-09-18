from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from services.parser import ResumeParser
from models.user import UserModel

resume_bp = Blueprint('resume', __name__)

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@resume_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_resume():
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'job_seeker':
            return jsonify({'error': 'Only job seekers can upload resumes'}), 403
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed: PDF, DOC, DOCX, TXT'}), 400
        
        # Save file
        filename = secure_filename(file.filename)
        file_path = os.path.join('uploads', f"{current_user['user_id']}_{filename}")
        file.save(file_path)
        
        # Parse resume
        parser = ResumeParser()
        file_extension = filename.rsplit('.', 1)[1].lower()
        
        try:
            parsed_data = parser.parse_resume(file_path, file_extension)
            
            # Update user profile with parsed data
            user_model = UserModel(request.app.db)
            update_data = {
                'resume_url': file_path,
                'first_name': parsed_data['name'].split()[0] if parsed_data['name'] else '',
                'last_name': ' '.join(parsed_data['name'].split()[1:]) if len(parsed_data['name'].split()) > 1 else '',
                'skills': parsed_data['skills'],
                'experience': parsed_data['experience'],
                'education': parsed_data['education'],
                'profile_completed': True
            }
            
            # Add contact info if available
            if parsed_data['contact_info'].get('phone'):
                update_data['phone'] = parsed_data['contact_info']['phone']
            
            success = user_model.update_user(current_user['user_id'], 'job_seeker', update_data)
            
            if not success:
                return jsonify({'error': 'Failed to update profile'}), 500
            
            # Clean up file
            os.remove(file_path)
            
            return jsonify({
                'message': 'Resume parsed and profile updated successfully',
                'parsed_data': parsed_data
            }), 200
            
        except Exception as e:
            # Clean up file on error
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({'error': f'Failed to parse resume: {str(e)}'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/parse-text', methods=['POST'])
@jwt_required()
def parse_resume_text():
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'job_seeker':
            return jsonify({'error': 'Only job seekers can parse resumes'}), 403
        
        data = request.get_json()
        resume_text = data.get('resume_text')
        
        if not resume_text:
            return jsonify({'error': 'No resume text provided'}), 400
        
        # Parse resume text
        parser = ResumeParser()
        
        # Extract information from text
        contact_info = parser.extract_contact_info(resume_text)
        skills = parser.extract_skills(resume_text)
        experience = parser.extract_experience(resume_text)
        education = parser.extract_education(resume_text)
        
        # Extract name (first line usually contains name)
        lines = resume_text.split('\n')
        name = lines[0].strip() if lines else ""
        
        parsed_data = {
            'name': name,
            'contact_info': contact_info,
            'skills': skills,
            'experience': experience,
            'education': education
        }
        
        return jsonify({
            'message': 'Resume text parsed successfully',
            'parsed_data': parsed_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/update-skills', methods=['PUT'])
@jwt_required()
def update_skills():
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'job_seeker':
            return jsonify({'error': 'Only job seekers can update skills'}), 403
        
        data = request.get_json()
        skills = data.get('skills', [])
        
        if not isinstance(skills, list):
            return jsonify({'error': 'Skills must be a list'}), 400
        
        # Update user skills
        user_model = UserModel(request.app.db)
        success = user_model.update_user(current_user['user_id'], 'job_seeker', {'skills': skills})
        
        if not success:
            return jsonify({'error': 'Failed to update skills'}), 500
        
        return jsonify({'message': 'Skills updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/update-experience', methods=['PUT'])
@jwt_required()
def update_experience():
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'job_seeker':
            return jsonify({'error': 'Only job seekers can update experience'}), 403
        
        data = request.get_json()
        experience = data.get('experience', [])
        
        if not isinstance(experience, list):
            return jsonify({'error': 'Experience must be a list'}), 400
        
        # Update user experience
        user_model = UserModel(request.app.db)
        success = user_model.update_user(current_user['user_id'], 'job_seeker', {'experience': experience})
        
        if not success:
            return jsonify({'error': 'Failed to update experience'}), 500
        
        return jsonify({'message': 'Experience updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/update-education', methods=['PUT'])
@jwt_required()
def update_education():
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'job_seeker':
            return jsonify({'error': 'Only job seekers can update education'}), 403
        
        data = request.get_json()
        education = data.get('education', [])
        
        if not isinstance(education, list):
            return jsonify({'error': 'Education must be a list'}), 400
        
        # Update user education
        user_model = UserModel(request.app.db)
        success = user_model.update_user(current_user['user_id'], 'job_seeker', {'education': education})
        
        if not success:
            return jsonify({'error': 'Failed to update education'}), 500
        
        return jsonify({'message': 'Education updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'job_seeker':
            return jsonify({'error': 'Only job seekers can view profile'}), 403
        
        # Get job seeker profile
        user_model = UserModel(request.app.db)
        profile = user_model.get_job_seeker_profile(current_user['user_id'])
        
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        # Remove sensitive data
        profile.pop('password', None)
        profile['_id'] = str(profile['_id'])
        
        return jsonify({'profile': profile}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500