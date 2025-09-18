import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app
import os

class EmailService:
    def __init__(self):
        self.smtp_server = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.environ.get('MAIL_PORT', 587))
        self.username = os.environ.get('MAIL_USERNAME')
        self.password = os.environ.get('MAIL_PASSWORD')
        self.use_tls = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
    
    def send_email(self, to_email, subject, body, is_html=False):
        """Send email to recipient"""
        try:
            if not self.username or not self.password:
                print("Email credentials not configured")
                return False
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['From'] = self.username
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Add body
            if is_html:
                msg.attach(MIMEText(body, 'html'))
            else:
                msg.attach(MIMEText(body, 'plain'))
            
            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            if self.use_tls:
                server.starttls()
            server.login(self.username, self.password)
            server.send_message(msg)
            server.quit()
            
            return True
            
        except Exception as e:
            print(f"Error sending email: {e}")
            return False
    
    def send_job_alert(self, to_email, job_data, match_percentage):
        """Send job alert email"""
        subject = f"New Job Match: {job_data['title']} at {job_data['company']}"
        
        body = f"""
        Hi there!
        
        We found a new job that matches your profile with {match_percentage}% compatibility:
        
        Job Title: {job_data['title']}
        Company: {job_data['company']}
        Location: {job_data['location']}
        Job Type: {job_data['job_type']}
        
        Description:
        {job_data['description'][:200]}...
        
        Required Skills: {', '.join(job_data.get('required_skills', []))}
        
        Click here to apply: [Application Link]
        
        Best regards,
        AI Jobs Portal Team
        """
        
        return self.send_email(to_email, subject, body)
    
    def send_application_received(self, to_email, job_data, application_id):
        """Send application received confirmation"""
        subject = f"Application Received: {job_data['title']} at {job_data['company']}"
        
        body = f"""
        Hi there!
        
        Thank you for applying to the {job_data['title']} position at {job_data['company']}.
        
        Your application has been received and is being reviewed by our AI system.
        You will be notified once the recruiter reviews your application.
        
        Application ID: {application_id}
        
        Best regards,
        AI Jobs Portal Team
        """
        
        return self.send_email(to_email, subject, body)
    
    def send_application_status_update(self, to_email, job_data, status, notes=""):
        """Send application status update"""
        status_messages = {
            'reviewed': 'Your application has been reviewed and is under consideration.',
            'shortlisted': 'Congratulations! You have been shortlisted for the next round.',
            'interview_scheduled': 'Great news! An interview has been scheduled for you.',
            'interviewed': 'Your interview has been completed and is being evaluated.',
            'rejected': 'Unfortunately, your application was not selected for this position.',
            'hired': 'Congratulations! You have been selected for this position!'
        }
        
        subject = f"Application Update: {job_data['title']} at {job_data['company']}"
        
        body = f"""
        Hi there!
        
        Your application status for {job_data['title']} at {job_data['company']} has been updated.
        
        Status: {status.replace('_', ' ').title()}
        Message: {status_messages.get(status, 'Your application status has been updated.')}
        
        {f'Notes: {notes}' if notes else ''}
        
        Best regards,
        AI Jobs Portal Team
        """
        
        return self.send_email(to_email, subject, body)
    
    def send_new_application_notification(self, to_email, job_data, candidate_data):
        """Send notification to recruiter about new application"""
        subject = f"New Application: {job_data['title']}"
        
        body = f"""
        Hi there!
        
        You have received a new application for the {job_data['title']} position.
        
        Candidate: {candidate_data['name']}
        Email: {candidate_data['email']}
        Skills: {', '.join(candidate_data.get('skills', []))}
        
        Please review the application in your dashboard.
        
        Best regards,
        AI Jobs Portal Team
        """
        
        return self.send_email(to_email, subject, body)
    
    def send_welcome_email(self, to_email, user_type, name):
        """Send welcome email to new user"""
        subject = f"Welcome to AI Jobs Portal!"
        
        if user_type == 'job_seeker':
            body = f"""
            Hi {name}!
            
            Welcome to AI Jobs Portal! We're excited to help you find your dream job.
            
            Here's what you can do:
            - Upload your resume for automatic profile creation
            - Get AI-powered job recommendations
            - Apply to jobs with one click
            - Access free upskilling resources
            - Chat with our AI career advisor
            
            Get started by completing your profile!
            
            Best regards,
            AI Jobs Portal Team
            """
        elif user_type == 'recruiter':
            body = f"""
            Hi {name}!
            
            Welcome to AI Jobs Portal! We're excited to help you find the best talent.
            
            Here's what you can do:
            - Post job openings
            - Get AI-ranked candidate lists
            - Manage applications efficiently
            - Access detailed candidate profiles
            
            Get started by posting your first job!
            
            Best regards,
            AI Jobs Portal Team
            """
        else:  # admin
            body = f"""
            Hi {name}!
            
            Welcome to AI Jobs Portal Admin Panel!
            
            You can now manage users, jobs, and monitor platform activity.
            
            Best regards,
            AI Jobs Portal Team
            """
        
        return self.send_email(to_email, subject, body)
    
    def send_password_reset(self, to_email, reset_token):
        """Send password reset email"""
        subject = "Password Reset - AI Jobs Portal"
        
        reset_url = f"https://your-domain.com/reset-password?token={reset_token}"
        
        body = f"""
        Hi there!
        
        You requested a password reset for your AI Jobs Portal account.
        
        Click the link below to reset your password:
        {reset_url}
        
        This link will expire in 1 hour.
        
        If you didn't request this reset, please ignore this email.
        
        Best regards,
        AI Jobs Portal Team
        """
        
        return self.send_email(to_email, subject, body)