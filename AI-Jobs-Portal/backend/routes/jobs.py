from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.job import JobModel
from models.application import ApplicationModel
from services.matcher import JobMatcher
from bson import ObjectId

jobs_bp = Blueprint('jobs', __name__)

def init_job_routes(app):
    job_model = JobModel(app.db)
    application_model = ApplicationModel(app.db)
    matcher = JobMatcher()

@jobs_bp.route('/post', methods=['POST'])
@jwt_required()
def post_job():
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'recruiter':
            return jsonify({'error': 'Only recruiters can post jobs'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'company', 'location', 'job_type', 'required_skills']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Add recruiter information
        data['recruiter_id'] = current_user['user_id']
        
        # Create job
        job_id = job_model.create_job(data)
        
        return jsonify({
            'message': 'Job posted successfully',
            'job_id': job_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@jobs_bp.route('/', methods=['GET'])
def get_jobs():
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        skip = (page - 1) * limit
        
        # Get filters
        filters = {}
        if request.args.get('location'):
            filters['location'] = request.args.get('location')
        if request.args.get('job_type'):
            filters['job_type'] = request.args.get('job_type')
        if request.args.get('company'):
            filters['company'] = request.args.get('company')
        if request.args.get('skills'):
            filters['skills'] = request.args.get('skills').split(',')
        
        # Get jobs
        jobs = job_model.get_all_jobs(filters, limit, skip)
        
        # Convert ObjectId to string
        for job in jobs:
            job['_id'] = str(job['_id'])
            job['recruiter_id'] = str(job['recruiter_id'])
        
        return jsonify({
            'jobs': jobs,
            'page': page,
            'limit': limit,
            'total': len(jobs)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@jobs_bp.route('/<job_id>', methods=['GET'])
def get_job(job_id):
    try:
        job = job_model.get_job_by_id(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        # Increment views
        job_model.increment_views(job_id)
        
        # Convert ObjectId to string
        job['_id'] = str(job['_id'])
        job['recruiter_id'] = str(job['recruiter_id'])
        
        return jsonify({'job': job}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@jobs_bp.route('/<job_id>/apply', methods=['POST'])
@jwt_required()
def apply_job(job_id):
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'job_seeker':
            return jsonify({'error': 'Only job seekers can apply for jobs'}), 403
        
        # Check if job exists
        job = job_model.get_job_by_id(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        # Check if already applied
        existing_application = application_model.get_applications_by_job_seeker(current_user['user_id'])
        for app in existing_application:
            if str(app['job_id']) == job_id:
                return jsonify({'error': 'Already applied for this job'}), 400
        
        data = request.get_json()
        
        # Create application data
        application_data = {
            'job_id': ObjectId(job_id),
            'job_seeker_id': ObjectId(current_user['user_id']),
            'cover_letter': data.get('cover_letter', ''),
            'resume_url': data.get('resume_url', ''),
            'additional_info': data.get('additional_info', '')
        }
        
        # Create application
        application_id = application_model.create_application(application_data)
        
        # Calculate skill match (this would be done asynchronously in production)
        # For now, we'll calculate it synchronously
        from models.user import UserModel
        user_model = UserModel(job_model.db)
        job_seeker = user_model.get_job_seeker_profile(current_user['user_id'])
        
        if job_seeker:
            # Calculate match percentage
            candidate_data = {
                'skills_text': ', '.join(job_seeker.get('skills', [])),
                'profile_text': f"{job_seeker.get('first_name', '')} {job_seeker.get('last_name', '')}",
                'experience': job_seeker.get('experience', []),
                'education': job_seeker.get('education', [])
            }
            
            match_result = matcher.calculate_overall_match(job, candidate_data)
            application_model.update_skill_match_percentage(application_id, match_result['overall_match'])
        
        return jsonify({
            'message': 'Application submitted successfully',
            'application_id': application_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@jobs_bp.route('/<job_id>/applications', methods=['GET'])
@jwt_required()
def get_job_applications(job_id):
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] not in ['recruiter', 'admin']:
            return jsonify({'error': 'Access denied'}), 403
        
        # Check if user owns the job (for recruiters)
        if current_user['user_type'] == 'recruiter':
            job = job_model.get_job_by_id(job_id)
            if not job or str(job['recruiter_id']) != current_user['user_id']:
                return jsonify({'error': 'Access denied'}), 403
        
        # Get applications
        applications = job_model.get_applications_for_job(job_id)
        
        # Convert ObjectId to string and add job seeker details
        from models.user import UserModel
        user_model = UserModel(job_model.db)
        
        for app in applications:
            app['_id'] = str(app['_id'])
            app['job_id'] = str(app['job_id'])
            app['job_seeker_id'] = str(app['job_seeker_id'])
            
            # Get job seeker details
            job_seeker = user_model.get_job_seeker_profile(app['job_seeker_id'])
            if job_seeker:
                app['job_seeker'] = {
                    'name': f"{job_seeker.get('first_name', '')} {job_seeker.get('last_name', '')}",
                    'email': job_seeker.get('email', ''),
                    'skills': job_seeker.get('skills', []),
                    'experience': job_seeker.get('experience', [])
                }
        
        return jsonify({'applications': applications}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@jobs_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_job_recommendations():
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'job_seeker':
            return jsonify({'error': 'Only job seekers can get recommendations'}), 403
        
        # Get job seeker profile
        from models.user import UserModel
        user_model = UserModel(job_model.db)
        job_seeker = user_model.get_job_seeker_profile(current_user['user_id'])
        
        if not job_seeker:
            return jsonify({'error': 'Job seeker profile not found'}), 404
        
        # Get all active jobs
        all_jobs = job_model.get_all_jobs(limit=100)
        
        # Calculate matches for each job
        recommendations = []
        matcher = JobMatcher()
        
        for job in all_jobs:
            candidate_data = {
                'skills_text': ', '.join(job_seeker.get('skills', [])),
                'profile_text': f"{job_seeker.get('first_name', '')} {job_seeker.get('last_name', '')}",
                'experience': job_seeker.get('experience', []),
                'education': job_seeker.get('education', [])
            }
            
            match_result = matcher.calculate_overall_match(job, candidate_data)
            
            if match_result['overall_match'] >= 30:  # Only recommend jobs with 30%+ match
                job['_id'] = str(job['_id'])
                job['recruiter_id'] = str(job['recruiter_id'])
                job['match_percentage'] = match_result['overall_match']
                job['matched_skills'] = match_result['matched_skills']
                recommendations.append(job)
        
        # Sort by match percentage
        recommendations.sort(key=lambda x: x['match_percentage'], reverse=True)
        
        return jsonify({
            'recommendations': recommendations[:20],  # Return top 20
            'total': len(recommendations)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@jobs_bp.route('/my-applications', methods=['GET'])
@jwt_required()
def get_my_applications():
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'job_seeker':
            return jsonify({'error': 'Only job seekers can view applications'}), 403
        
        # Get applications
        applications = job_model.get_applications_by_job_seeker(current_user['user_id'])
        
        # Convert ObjectId to string and add job details
        for app in applications:
            app['_id'] = str(app['_id'])
            app['job_id'] = str(app['job_id'])
            app['job_seeker_id'] = str(app['job_seeker_id'])
            
            # Get job details
            job = job_model.get_job_by_id(app['job_id'])
            if job:
                app['job'] = {
                    'title': job.get('title', ''),
                    'company': job.get('company', ''),
                    'location': job.get('location', ''),
                    'job_type': job.get('job_type', '')
                }
        
        return jsonify({'applications': applications}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@jobs_bp.route('/<job_id>/update-status', methods=['PUT'])
@jwt_required()
def update_application_status(job_id):
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] not in ['recruiter', 'admin']:
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        application_id = data.get('application_id')
        status = data.get('status')
        notes = data.get('notes', '')
        
        if not all([application_id, status]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Update application status
        success = application_model.update_application_status(application_id, status, notes)
        
        if not success:
            return jsonify({'error': 'Failed to update application status'}), 400
        
        return jsonify({'message': 'Application status updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500