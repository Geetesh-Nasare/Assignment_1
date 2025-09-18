from datetime import datetime
from bson import ObjectId

class UserModel:
    def __init__(self, db):
        self.db = db
        self.job_seekers = db.job_seekers
        self.recruiters = db.recruiters
        self.admins = db.admins
    
    def create_job_seeker(self, user_data):
        """Create a new job seeker profile"""
        user_data.update({
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'profile_completed': False,
            'skills': [],
            'experience': [],
            'education': [],
            'applications': [],
            'saved_jobs': [],
            'preferences': {
                'job_types': [],
                'locations': [],
                'salary_range': {'min': 0, 'max': 0},
                'remote_work': False
            }
        })
        result = self.job_seekers.insert_one(user_data)
        return str(result.inserted_id)
    
    def create_recruiter(self, user_data):
        """Create a new recruiter profile"""
        user_data.update({
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'company_verified': False,
            'jobs_posted': [],
            'total_applications': 0
        })
        result = self.recruiters.insert_one(user_data)
        return str(result.inserted_id)
    
    def create_admin(self, user_data):
        """Create a new admin profile"""
        user_data.update({
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'permissions': ['manage_users', 'manage_jobs', 'view_analytics']
        })
        result = self.admins.insert_one(user_data)
        return str(result.inserted_id)
    
    def get_user_by_email(self, email, user_type):
        """Get user by email and type"""
        collection = getattr(self, f'{user_type}s')
        return collection.find_one({'email': email})
    
    def get_user_by_id(self, user_id, user_type):
        """Get user by ID and type"""
        collection = getattr(self, f'{user_type}s')
        return collection.find_one({'_id': ObjectId(user_id)})
    
    def update_user(self, user_id, user_type, update_data):
        """Update user profile"""
        collection = getattr(self, f'{user_type}s')
        update_data['updated_at'] = datetime.utcnow()
        result = collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0
    
    def authenticate_user(self, email, password, user_type):
        """Authenticate user login"""
        user = self.get_user_by_email(email, user_type)
        if user and user.get('password') == password:  # In production, use proper password hashing
            return user
        return None
    
    def get_job_seeker_profile(self, user_id):
        """Get complete job seeker profile"""
        return self.job_seekers.find_one({'_id': ObjectId(user_id)})
    
    def get_recruiter_profile(self, user_id):
        """Get complete recruiter profile"""
        return self.recruiters.find_one({'_id': ObjectId(user_id)})
    
    def get_admin_profile(self, user_id):
        """Get complete admin profile"""
        return self.admins.find_one({'_id': ObjectId(user_id)})
    
    def add_application(self, job_seeker_id, job_id, application_data):
        """Add job application to job seeker profile"""
        application_data.update({
            'job_id': job_id,
            'applied_at': datetime.utcnow(),
            'status': 'applied'
        })
        result = self.job_seekers.update_one(
            {'_id': ObjectId(job_seeker_id)},
            {'$push': {'applications': application_data}}
        )
        return result.modified_count > 0
    
    def update_application_status(self, job_seeker_id, job_id, status):
        """Update application status"""
        result = self.job_seekers.update_one(
            {'_id': ObjectId(job_seeker_id), 'applications.job_id': job_id},
            {'$set': {'applications.$.status': status, 'applications.$.updated_at': datetime.utcnow()}}
        )
        return result.modified_count > 0