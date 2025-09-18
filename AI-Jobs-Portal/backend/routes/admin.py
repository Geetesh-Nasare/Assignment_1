from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import UserModel
from models.job import JobModel
from models.application import ApplicationModel
from bson import ObjectId

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'admin':
            return jsonify({'error': 'Access denied'}), 403
        
        # Get statistics
        user_model = UserModel(request.app.db)
        job_model = JobModel(request.app.db)
        application_model = ApplicationModel(request.app.db)
        
        # Count users by type
        job_seekers_count = user_model.job_seekers.count_documents({})
        recruiters_count = user_model.recruiters.count_documents({})
        admins_count = user_model.admins.count_documents({})
        
        # Count jobs
        total_jobs = job_model.jobs.count_documents({})
        active_jobs = job_model.jobs.count_documents({'is_active': True})
        
        # Count applications
        total_applications = application_model.applications.count_documents({})
        
        # Get recent activity
        recent_jobs = list(job_model.jobs.find({'is_active': True})
                          .sort('created_at', -1).limit(5))
        
        recent_applications = list(application_model.applications.find()
                                 .sort('applied_at', -1).limit(5))
        
        # Convert ObjectId to string
        for job in recent_jobs:
            job['_id'] = str(job['_id'])
            job['recruiter_id'] = str(job['recruiter_id'])
        
        for app in recent_applications:
            app['_id'] = str(app['_id'])
            app['job_id'] = str(app['job_id'])
            app['job_seeker_id'] = str(app['job_seeker_id'])
        
        return jsonify({
            'statistics': {
                'job_seekers': job_seekers_count,
                'recruiters': recruiters_count,
                'admins': admins_count,
                'total_jobs': total_jobs,
                'active_jobs': active_jobs,
                'total_applications': total_applications
            },
            'recent_jobs': recent_jobs,
            'recent_applications': recent_applications
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'admin':
            return jsonify({'error': 'Access denied'}), 403
        
        user_type = request.args.get('type', 'all')  # all, job_seekers, recruiters, admins
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        skip = (page - 1) * limit
        
        user_model = UserModel(request.app.db)
        users = []
        
        if user_type == 'all' or user_type == 'job_seekers':
            job_seekers = list(user_model.job_seekers.find().skip(skip).limit(limit))
            for user in job_seekers:
                user['_id'] = str(user['_id'])
                user['user_type'] = 'job_seeker'
                users.extend(job_seekers)
        
        if user_type == 'all' or user_type == 'recruiters':
            recruiters = list(user_model.recruiters.find().skip(skip).limit(limit))
            for user in recruiters:
                user['_id'] = str(user['_id'])
                user['user_type'] = 'recruiter'
                users.extend(recruiters)
        
        if user_type == 'all' or user_type == 'admins':
            admins = list(user_model.admins.find().skip(skip).limit(limit))
            for user in admins:
                user['_id'] = str(user['_id'])
                user['user_type'] = 'admin'
                users.extend(admins)
        
        # Remove sensitive data
        for user in users:
            user.pop('password', None)
        
        return jsonify({
            'users': users,
            'page': page,
            'limit': limit,
            'total': len(users)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'admin':
            return jsonify({'error': 'Access denied'}), 403
        
        user_model = UserModel(request.app.db)
        
        # Try to find user in each collection
        user = None
        user_type = None
        
        for collection_name in ['job_seekers', 'recruiters', 'admins']:
            collection = getattr(user_model, collection_name)
            user = collection.find_one({'_id': ObjectId(user_id)})
            if user:
                user_type = collection_name[:-1]  # Remove 's' from collection name
                break
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user['_id'] = str(user['_id'])
        user['user_type'] = user_type
        user.pop('password', None)
        
        return jsonify({'user': user}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'admin':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        
        # Remove fields that shouldn't be updated
        data.pop('_id', None)
        data.pop('created_at', None)
        data.pop('user_type', None)
        
        user_model = UserModel(request.app.db)
        
        # Try to update user in each collection
        success = False
        for collection_name in ['job_seekers', 'recruiters', 'admins']:
            collection = getattr(user_model, collection_name)
            user = collection.find_one({'_id': ObjectId(user_id)})
            if user:
                success = user_model.update_user(user_id, collection_name[:-1], data)
                break
        
        if not success:
            return jsonify({'error': 'Failed to update user'}), 400
        
        return jsonify({'message': 'User updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'admin':
            return jsonify({'error': 'Access denied'}), 403
        
        user_model = UserModel(request.app.db)
        
        # Try to delete user from each collection
        success = False
        for collection_name in ['job_seekers', 'recruiters', 'admins']:
            collection = getattr(user_model, collection_name)
            result = collection.delete_one({'_id': ObjectId(user_id)})
            if result.deleted_count > 0:
                success = True
                break
        
        if not success:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/jobs', methods=['GET'])
@jwt_required()
def get_all_jobs():
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'admin':
            return jsonify({'error': 'Access denied'}), 403
        
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        skip = (page - 1) * limit
        
        job_model = JobModel(request.app.db)
        jobs = list(job_model.jobs.find().skip(skip).limit(limit).sort('created_at', -1))
        
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

@admin_bp.route('/jobs/<job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'admin':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        
        job_model = JobModel(request.app.db)
        success = job_model.update_job(job_id, data)
        
        if not success:
            return jsonify({'error': 'Failed to update job'}), 400
        
        return jsonify({'message': 'Job updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/jobs/<job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'admin':
            return jsonify({'error': 'Access denied'}), 403
        
        job_model = JobModel(request.app.db)
        success = job_model.delete_job(job_id)
        
        if not success:
            return jsonify({'error': 'Failed to delete job'}), 400
        
        return jsonify({'message': 'Job deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/applications', methods=['GET'])
@jwt_required()
def get_all_applications():
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'admin':
            return jsonify({'error': 'Access denied'}), 403
        
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        skip = (page - 1) * limit
        
        application_model = ApplicationModel(request.app.db)
        applications = list(application_model.applications.find()
                          .skip(skip).limit(limit).sort('applied_at', -1))
        
        # Convert ObjectId to string and add job details
        job_model = JobModel(request.app.db)
        user_model = UserModel(request.app.db)
        
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
                    'location': job.get('location', '')
                }
            
            # Get job seeker details
            job_seeker = user_model.get_job_seeker_profile(app['job_seeker_id'])
            if job_seeker:
                app['job_seeker'] = {
                    'name': f"{job_seeker.get('first_name', '')} {job_seeker.get('last_name', '')}",
                    'email': job_seeker.get('email', '')
                }
        
        return jsonify({
            'applications': applications,
            'page': page,
            'limit': limit,
            'total': len(applications)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'admin':
            return jsonify({'error': 'Access denied'}), 403
        
        # Get analytics data
        user_model = UserModel(request.app.db)
        job_model = JobModel(request.app.db)
        application_model = ApplicationModel(request.app.db)
        
        # User growth over time (simplified)
        user_stats = {
            'job_seekers': user_model.job_seekers.count_documents({}),
            'recruiters': user_model.recruiters.count_documents({}),
            'admins': user_model.admins.count_documents({})
        }
        
        # Job statistics
        job_stats = {
            'total_jobs': job_model.jobs.count_documents({}),
            'active_jobs': job_model.jobs.count_documents({'is_active': True}),
            'total_applications': application_model.applications.count_documents({})
        }
        
        # Application status distribution
        status_pipeline = [
            {'$group': {'_id': '$status', 'count': {'$sum': 1}}}
        ]
        status_distribution = list(application_model.applications.aggregate(status_pipeline))
        
        return jsonify({
            'user_stats': user_stats,
            'job_stats': job_stats,
            'status_distribution': status_distribution
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500