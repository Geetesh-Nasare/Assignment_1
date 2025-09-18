from datetime import datetime
from bson import ObjectId

class JobModel:
    def __init__(self, db):
        self.db = db
        self.jobs = db.jobs
        self.applications = db.applications
    
    def create_job(self, job_data):
        """Create a new job posting"""
        job_data.update({
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'is_active': True,
            'applications_count': 0,
            'views_count': 0
        })
        result = self.jobs.insert_one(job_data)
        return str(result.inserted_id)
    
    def get_job_by_id(self, job_id):
        """Get job by ID"""
        return self.jobs.find_one({'_id': ObjectId(job_id)})
    
    def get_all_jobs(self, filters=None, limit=20, skip=0):
        """Get all jobs with optional filters"""
        query = {'is_active': True}
        if filters:
            if filters.get('location'):
                query['location'] = {'$regex': filters['location'], '$options': 'i'}
            if filters.get('job_type'):
                query['job_type'] = filters['job_type']
            if filters.get('company'):
                query['company'] = {'$regex': filters['company'], '$options': 'i'}
            if filters.get('skills'):
                query['required_skills'] = {'$in': filters['skills']}
        
        return list(self.jobs.find(query).skip(skip).limit(limit).sort('created_at', -1))
    
    def get_jobs_by_recruiter(self, recruiter_id):
        """Get jobs posted by specific recruiter"""
        return list(self.jobs.find({'recruiter_id': ObjectId(recruiter_id)}).sort('created_at', -1))
    
    def update_job(self, job_id, update_data):
        """Update job posting"""
        update_data['updated_at'] = datetime.utcnow()
        result = self.jobs.update_one(
            {'_id': ObjectId(job_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0
    
    def delete_job(self, job_id):
        """Soft delete job (mark as inactive)"""
        result = self.jobs.update_one(
            {'_id': ObjectId(job_id)},
            {'$set': {'is_active': False, 'updated_at': datetime.utcnow()}}
        )
        return result.modified_count > 0
    
    def increment_views(self, job_id):
        """Increment job views count"""
        self.jobs.update_one(
            {'_id': ObjectId(job_id)},
            {'$inc': {'views_count': 1}}
        )
    
    def create_application(self, application_data):
        """Create job application"""
        application_data.update({
            'applied_at': datetime.utcnow(),
            'status': 'applied',
            'skill_match_percentage': 0
        })
        result = self.applications.insert_one(application_data)
        
        # Update job applications count
        self.jobs.update_one(
            {'_id': ObjectId(application_data['job_id'])},
            {'$inc': {'applications_count': 1}}
        )
        
        return str(result.inserted_id)
    
    def get_applications_for_job(self, job_id):
        """Get all applications for a specific job"""
        return list(self.applications.find({'job_id': ObjectId(job_id)}).sort('skill_match_percentage', -1))
    
    def get_applications_by_job_seeker(self, job_seeker_id):
        """Get all applications by a job seeker"""
        return list(self.applications.find({'job_seeker_id': ObjectId(job_seeker_id)}).sort('applied_at', -1))
    
    def update_application_status(self, application_id, status):
        """Update application status"""
        result = self.applications.update_one(
            {'_id': ObjectId(application_id)},
            {'$set': {'status': status, 'updated_at': datetime.utcnow()}}
        )
        return result.modified_count > 0
    
    def update_skill_match_percentage(self, application_id, percentage):
        """Update skill match percentage for application"""
        result = self.applications.update_one(
            {'_id': ObjectId(application_id)},
            {'$set': {'skill_match_percentage': percentage}}
        )
        return result.modified_count > 0
    
    def get_job_statistics(self, recruiter_id):
        """Get job statistics for recruiter"""
        pipeline = [
            {'$match': {'recruiter_id': ObjectId(recruiter_id)}},
            {'$group': {
                '_id': None,
                'total_jobs': {'$sum': 1},
                'total_applications': {'$sum': '$applications_count'},
                'total_views': {'$sum': '$views_count'}
            }}
        ]
        result = list(self.jobs.aggregate(pipeline))
        return result[0] if result else {'total_jobs': 0, 'total_applications': 0, 'total_views': 0}