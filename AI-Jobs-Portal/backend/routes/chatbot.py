from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import openai
import os

chatbot_bp = Blueprint('chatbot', __name__)

# Initialize OpenAI
openai.api_key = os.environ.get('OPENAI_API_KEY')

@chatbot_bp.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        message = data.get('message')
        chat_type = data.get('type', 'general')  # general, interview, career_advice
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Get user context
        from models.user import UserModel
        user_model = UserModel(request.app.db)
        
        user_context = ""
        if current_user['user_type'] == 'job_seeker':
            profile = user_model.get_job_seeker_profile(current_user['user_id'])
            if profile:
                user_context = f"User is a job seeker with skills: {', '.join(profile.get('skills', []))}"
        
        # Create system prompt based on chat type
        if chat_type == 'interview':
            system_prompt = f"""
            You are an AI career coach specializing in mock interviews. {user_context}
            Provide helpful interview tips, answer common interview questions, and give feedback on responses.
            Be encouraging and constructive in your advice.
            """
        elif chat_type == 'career_advice':
            system_prompt = f"""
            You are an AI career advisor. {user_context}
            Provide career guidance, job search tips, skill development advice, and industry insights.
            Be professional and helpful in your responses.
            """
        else:
            system_prompt = f"""
            You are an AI assistant for the AI Jobs Portal. {user_context}
            Help users with general questions about the platform, job searching, and career development.
            Be friendly and informative.
            """
        
        # Call OpenAI API
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content
            
            return jsonify({
                'response': ai_response,
                'type': chat_type
            }), 200
            
        except Exception as e:
            # Fallback response if OpenAI API fails
            fallback_responses = {
                'interview': "I'd be happy to help with interview preparation! What specific interview questions or topics would you like to practice?",
                'career_advice': "I'm here to help with your career development! What career questions do you have?",
                'general': "I'm here to help with your job search and career questions. What would you like to know?"
            }
            
            return jsonify({
                'response': fallback_responses.get(chat_type, "I'm here to help! What can I assist you with?"),
                'type': chat_type
            }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chatbot_bp.route('/interview-questions', methods=['GET'])
@jwt_required()
def get_interview_questions():
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'job_seeker':
            return jsonify({'error': 'Only job seekers can access interview questions'}), 403
        
        # Get job seeker skills for personalized questions
        from models.user import UserModel
        user_model = UserModel(request.app.db)
        profile = user_model.get_job_seeker_profile(current_user['user_id'])
        
        skills = profile.get('skills', []) if profile else []
        
        # Generate interview questions based on skills
        questions = []
        
        # General questions
        general_questions = [
            "Tell me about yourself and your professional background.",
            "What are your greatest strengths and weaknesses?",
            "Why are you interested in this position?",
            "Where do you see yourself in 5 years?",
            "Why should we hire you?",
            "Describe a challenging project you worked on and how you overcame obstacles.",
            "How do you handle stress and pressure?",
            "What is your approach to problem-solving?",
            "Tell me about a time you worked in a team.",
            "What questions do you have for us?"
        ]
        
        questions.extend(general_questions)
        
        # Technical questions based on skills
        technical_questions = {
            'python': [
                "Explain the difference between lists and tuples in Python.",
                "What are decorators in Python?",
                "How do you handle exceptions in Python?",
                "Explain the concept of generators in Python."
            ],
            'javascript': [
                "What is the difference between var, let, and const?",
                "Explain closures in JavaScript.",
                "What is the event loop in JavaScript?",
                "How do you handle asynchronous operations in JavaScript?"
            ],
            'react': [
                "What is the difference between functional and class components?",
                "Explain the concept of hooks in React.",
                "What is the virtual DOM?",
                "How do you handle state management in React?"
            ],
            'sql': [
                "What is the difference between INNER JOIN and LEFT JOIN?",
                "Explain database normalization.",
                "What are indexes and why are they important?",
                "How do you optimize a slow query?"
            ],
            'machine learning': [
                "What is the difference between supervised and unsupervised learning?",
                "Explain overfitting and how to prevent it.",
                "What is cross-validation?",
                "How do you handle missing data in a dataset?"
            ]
        }
        
        for skill in skills:
            skill_lower = skill.lower()
            for tech_skill, tech_questions in technical_questions.items():
                if tech_skill in skill_lower:
                    questions.extend(tech_questions[:2])  # Add 2 questions per matching skill
                    break
        
        return jsonify({
            'questions': questions[:20],  # Return top 20 questions
            'total': len(questions)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chatbot_bp.route('/career-tips', methods=['GET'])
@jwt_required()
def get_career_tips():
    try:
        current_user = get_jwt_identity()
        
        tips = [
            {
                'category': 'Resume',
                'tips': [
                    'Keep your resume concise and relevant to the job',
                    'Use action verbs to describe your achievements',
                    'Include quantifiable results where possible',
                    'Tailor your resume for each job application',
                    'Proofread carefully for spelling and grammar errors'
                ]
            },
            {
                'category': 'Interview',
                'tips': [
                    'Research the company and role thoroughly',
                    'Prepare specific examples using the STAR method',
                    'Practice common interview questions',
                    'Dress professionally and arrive on time',
                    'Ask thoughtful questions about the role and company'
                ]
            },
            {
                'category': 'Networking',
                'tips': [
                    'Attend industry events and conferences',
                    'Connect with professionals on LinkedIn',
                    'Join relevant professional groups',
                    'Follow up with new connections',
                    'Offer help to others in your network'
                ]
            },
            {
                'category': 'Skill Development',
                'tips': [
                    'Stay updated with industry trends',
                    'Take online courses and certifications',
                    'Work on personal projects',
                    'Contribute to open source projects',
                    'Seek feedback and continuously improve'
                ]
            },
            {
                'category': 'Job Search',
                'tips': [
                    'Use multiple job search platforms',
                    'Set up job alerts for relevant positions',
                    'Customize your application for each job',
                    'Follow up on applications appropriately',
                    'Maintain a positive attitude throughout the process'
                ]
            }
        ]
        
        return jsonify({'tips': tips}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chatbot_bp.route('/upskilling-recommendations', methods=['GET'])
@jwt_required()
def get_upskilling_recommendations():
    try:
        current_user = get_jwt_identity()
        if current_user['user_type'] != 'job_seeker':
            return jsonify({'error': 'Only job seekers can get upskilling recommendations'}), 403
        
        # Get job seeker skills
        from models.user import UserModel
        user_model = UserModel(request.app.db)
        profile = user_model.get_job_seeker_profile(current_user['user_id'])
        
        skills = profile.get('skills', []) if profile else []
        
        # Generate recommendations based on current skills
        recommendations = []
        
        # Programming languages
        if 'python' in [skill.lower() for skill in skills]:
            recommendations.append({
                'skill': 'Advanced Python',
                'resources': [
                    {'type': 'YouTube', 'title': 'Python Advanced Concepts', 'url': 'https://youtube.com/watch?v=example1'},
                    {'type': 'Course', 'title': 'Python for Data Science', 'url': 'https://coursera.org/learn/python-data-science'},
                    {'type': 'Documentation', 'title': 'Python Official Docs', 'url': 'https://docs.python.org/3/'}
                ]
            })
        
        if 'javascript' in [skill.lower() for skill in skills]:
            recommendations.append({
                'skill': 'Advanced JavaScript',
                'resources': [
                    {'type': 'YouTube', 'title': 'JavaScript ES6+ Features', 'url': 'https://youtube.com/watch?v=example2'},
                    {'type': 'Course', 'title': 'Modern JavaScript', 'url': 'https://udemy.com/course/modern-javascript'},
                    {'type': 'Book', 'title': 'You Don\'t Know JS', 'url': 'https://github.com/getify/You-Dont-Know-JS'}
                ]
            })
        
        # Add more recommendations based on skills
        if not recommendations:
            recommendations = [
                {
                    'skill': 'Web Development',
                    'resources': [
                        {'type': 'YouTube', 'title': 'Complete Web Development Course', 'url': 'https://youtube.com/watch?v=example3'},
                        {'type': 'Course', 'title': 'Full Stack Web Development', 'url': 'https://freecodecamp.org'},
                        {'type': 'Practice', 'title': 'Frontend Mentor', 'url': 'https://frontendmentor.io'}
                    ]
                },
                {
                    'skill': 'Data Science',
                    'resources': [
                        {'type': 'YouTube', 'title': 'Data Science Tutorial', 'url': 'https://youtube.com/watch?v=example4'},
                        {'type': 'Course', 'title': 'Data Science Specialization', 'url': 'https://coursera.org/specializations/data-science'},
                        {'type': 'Practice', 'title': 'Kaggle Learn', 'url': 'https://kaggle.com/learn'}
                    ]
                }
            ]
        
        return jsonify({'recommendations': recommendations}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500