from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
import os
from config import Config

# Import routes
from routes.auth import auth_bp
from routes.jobs import jobs_bp
from routes.resume import resume_bp
from routes.chatbot import chatbot_bp
from routes.admin import admin_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app)
    jwt = JWTManager(app)
    
    # MongoDB connection
    client = MongoClient(app.config['MONGODB_URI'])
    db = client[app.config['DATABASE_NAME']]
    app.db = db
    
    # Create upload directory
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    app.register_blueprint(resume_bp, url_prefix='/api/resume')
    app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    @app.route('/api/health')
    def health_check():
        return jsonify({'status': 'healthy', 'message': 'AI Jobs Portal API is running'})
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)