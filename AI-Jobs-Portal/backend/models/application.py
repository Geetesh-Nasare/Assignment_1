from datetime import datetime
from bson import ObjectId

class ApplicationModel:
    def __init__(self, db):
        self.db = db
        self.applications = db.applications
    
    def create_application(self, application_data):
        """Create a new job application"""
        application_data.update({
            'applied_at': datetime.utcnow(),
            'status': 'applied',
            'skill_match_percentage': 0,
            'notes': '',
            'interview_scheduled': False,
            'interview_date': None,
            'hiring_stage': 'applied'
        })
        result = self.applications.insert_one(application_data)
        return str(result.inserted_id)
    
    def get_application_by_id(self, application_id):
        """Get application by ID"""
        return self.applications.find_one({'_id': ObjectId(application_id)})
    
    def get_applications_by_job(self, job_id, sort_by='skill_match_percentage'):
        """Get all applications for a specific job, sorted by skill match"""
        return list(self.applications.find({'job_id': ObjectId(job_id)}).sort(sort_by, -1))
    
    def get_applications_by_job_seeker(self, job_seeker_id):
        """Get all applications by a job seeker"""
        return list(self.applications.find({'job_seeker_id': ObjectId(job_seeker_id)}).sort('applied_at', -1))
    
    def update_application_status(self, application_id, status, notes=None):
        """Update application status"""
        update_data = {
            'status': status,
            'updated_at': datetime.utcnow()
        }
        
        if notes:
            update_data['notes'] = notes
        
        # Update hiring stage based on status
        stage_mapping = {
            'applied': 'applied',
            'reviewed': 'under_review',
            'shortlisted': 'shortlisted',
            'interview_scheduled': 'interview',
            'interviewed': 'interviewed',
            'rejected': 'rejected',
            'hired': 'hired'
        }
        
        if status in stage_mapping:
            update_data['hiring_stage'] = stage_mapping[status]
        
        result = self.applications.update_one(
            {'_id': ObjectId(application_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0
    
    def update_skill_match_percentage(self, application_id, percentage):
        """Update skill match percentage"""
        result = self.applications.update_one(
            {'_id': ObjectId(application_id)},
            {'$set': {'skill_match_percentage': percentage}}
        )
        return result.modified_count > 0
    
    def schedule_interview(self, application_id, interview_date, notes=None):
        """Schedule interview for application"""
        update_data = {
            'interview_scheduled': True,
            'interview_date': interview_date,
            'status': 'interview_scheduled',
            'hiring_stage': 'interview',
            'updated_at': datetime.utcnow()
        }
        
        if notes:
            update_data['notes'] = notes
        
        result = self.applications.update_one(
            {'_id': ObjectId(application_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0
    
    def get_application_statistics(self, job_id=None, recruiter_id=None):
        """Get application statistics"""
        match_query = {}
        
        if job_id:
            match_query['job_id'] = ObjectId(job_id)
        
        if recruiter_id:
            # This would require joining with jobs collection
            # For now, we'll implement a simpler version
            pass
        
        pipeline = [
            {'$match': match_query},
            {'$group': {
                '_id': '$status',
                'count': {'$sum': 1}
            }}
        ]
        
        return list(self.applications.aggregate(pipeline))
    
    def get_top_candidates(self, job_id, limit=10):
        """Get top candidates for a job based on skill match"""
        return list(self.applications.find({'job_id': ObjectId(job_id)})
                   .sort('skill_match_percentage', -1)
                   .limit(limit))
    
    def search_applications(self, filters):
        """Search applications with filters"""
        query = {}
        
        if filters.get('job_id'):
            query['job_id'] = ObjectId(filters['job_id'])
        
        if filters.get('status'):
            query['status'] = filters['status']
        
        if filters.get('hiring_stage'):
            query['hiring_stage'] = filters['hiring_stage']
        
        if filters.get('min_skill_match'):
            query['skill_match_percentage'] = {'$gte': filters['min_skill_match']}
        
        return list(self.applications.find(query).sort('skill_match_percentage', -1))