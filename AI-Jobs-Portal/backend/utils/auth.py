import jwt
from datetime import datetime, timedelta
from flask import current_app
import os

class AuthUtils:
    @staticmethod
    def generate_token(user_data, expires_delta=None):
        """Generate JWT token"""
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(hours=24)
        
        payload = {
            'user_id': user_data['user_id'],
            'user_type': user_data['user_type'],
            'email': user_data['email'],
            'exp': expire,
            'iat': datetime.utcnow()
        }
        
        secret_key = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string')
        token = jwt.encode(payload, secret_key, algorithm='HS256')
        
        return token
    
    @staticmethod
    def verify_token(token):
        """Verify JWT token"""
        try:
            secret_key = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string')
            payload = jwt.decode(token, secret_key, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    @staticmethod
    def hash_password(password):
        """Hash password using bcrypt"""
        import bcrypt
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    @staticmethod
    def verify_password(password, hashed_password):
        """Verify password against hash"""
        import bcrypt
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    @staticmethod
    def generate_reset_token(user_id):
        """Generate password reset token"""
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(hours=1),
            'type': 'password_reset'
        }
        
        secret_key = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string')
        token = jwt.encode(payload, secret_key, algorithm='HS256')
        
        return token
    
    @staticmethod
    def verify_reset_token(token):
        """Verify password reset token"""
        try:
            secret_key = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string')
            payload = jwt.decode(token, secret_key, algorithms=['HS256'])
            
            if payload.get('type') != 'password_reset':
                return None
            
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_password(password):
        """Validate password strength"""
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        
        if not any(c.isupper() for c in password):
            return False, "Password must contain at least one uppercase letter"
        
        if not any(c.islower() for c in password):
            return False, "Password must contain at least one lowercase letter"
        
        if not any(c.isdigit() for c in password):
            return False, "Password must contain at least one number"
        
        return True, "Password is valid"
    
    @staticmethod
    def sanitize_input(text):
        """Sanitize user input"""
        if not text:
            return ""
        
        # Remove potentially dangerous characters
        import html
        text = html.escape(text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text
    
    @staticmethod
    def check_permissions(user_type, required_permission):
        """Check if user has required permission"""
        permissions = {
            'job_seeker': ['view_jobs', 'apply_jobs', 'view_profile', 'update_profile'],
            'recruiter': ['post_jobs', 'view_applications', 'manage_jobs', 'view_candidates'],
            'admin': ['manage_users', 'manage_jobs', 'view_analytics', 'manage_platform']
        }
        
        user_permissions = permissions.get(user_type, [])
        return required_permission in user_permissions