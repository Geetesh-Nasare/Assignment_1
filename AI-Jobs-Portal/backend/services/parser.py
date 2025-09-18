import PyPDF2
import docx
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class ResumeParser:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.skill_keywords = [
            'python', 'java', 'javascript', 'react', 'node.js', 'angular', 'vue.js',
            'html', 'css', 'bootstrap', 'sql', 'mongodb', 'mysql', 'postgresql',
            'aws', 'azure', 'docker', 'kubernetes', 'git', 'github', 'gitlab',
            'machine learning', 'ai', 'artificial intelligence', 'data science',
            'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch',
            'flask', 'django', 'express.js', 'spring', 'laravel', 'rails',
            'android', 'ios', 'swift', 'kotlin', 'flutter', 'react native',
            'project management', 'agile', 'scrum', 'leadership', 'communication',
            'problem solving', 'analytical', 'creative', 'teamwork', 'time management'
        ]
    
    def extract_text_from_pdf(self, file_path):
        """Extract text from PDF file"""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text()
                return text
        except Exception as e:
            raise Exception(f"Error reading PDF: {str(e)}")
    
    def extract_text_from_docx(self, file_path):
        """Extract text from DOCX file"""
        try:
            doc = docx.Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            raise Exception(f"Error reading DOCX: {str(e)}")
    
    def extract_text_from_txt(self, file_path):
        """Extract text from TXT file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except Exception as e:
            raise Exception(f"Error reading TXT: {str(e)}")
    
    def extract_text(self, file_path, file_type):
        """Extract text based on file type"""
        if file_type.lower() == 'pdf':
            return self.extract_text_from_pdf(file_path)
        elif file_type.lower() in ['doc', 'docx']:
            return self.extract_text_from_docx(file_path)
        elif file_type.lower() == 'txt':
            return self.extract_text_from_txt(file_path)
        else:
            raise Exception("Unsupported file type")
    
    def extract_contact_info(self, text):
        """Extract contact information from resume text"""
        contact_info = {}
        
        # Email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            contact_info['email'] = emails[0]
        
        # Phone
        phone_pattern = r'(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
        phones = re.findall(phone_pattern, text)
        if phones:
            contact_info['phone'] = ''.join(phones[0])
        
        # LinkedIn
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        linkedin = re.search(linkedin_pattern, text, re.IGNORECASE)
        if linkedin:
            contact_info['linkedin'] = linkedin.group()
        
        return contact_info
    
    def extract_skills(self, text):
        """Extract skills from resume text"""
        text_lower = text.lower()
        found_skills = []
        
        for skill in self.skill_keywords:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        
        # Also look for skills mentioned in context
        skill_contexts = [
            r'proficient in ([^,\n]+)',
            r'skilled in ([^,\n]+)',
            r'experience with ([^,\n]+)',
            r'knowledge of ([^,\n]+)',
            r'expertise in ([^,\n]+)'
        ]
        
        for pattern in skill_contexts:
            matches = re.findall(pattern, text_lower)
            for match in matches:
                skills = [s.strip() for s in match.split(',')]
                found_skills.extend(skills)
        
        return list(set(found_skills))
    
    def extract_experience(self, text):
        """Extract work experience from resume text"""
        experience = []
        
        # Look for experience section
        exp_patterns = [
            r'experience[:\s]*(.*?)(?=education|skills|projects|$)', 
            r'work history[:\s]*(.*?)(?=education|skills|projects|$)',
            r'employment[:\s]*(.*?)(?=education|skills|projects|$)'
        ]
        
        exp_text = ""
        for pattern in exp_patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if match:
                exp_text = match.group(1)
                break
        
        if exp_text:
            # Extract individual job entries
            job_pattern = r'([A-Za-z\s&]+)\s*[-–]\s*([A-Za-z\s&]+)\s*[-–]\s*([A-Za-z0-9\s,]+)\s*[-–]\s*([A-Za-z0-9\s,]+)'
            jobs = re.findall(job_pattern, exp_text)
            
            for job in jobs:
                experience.append({
                    'company': job[0].strip(),
                    'position': job[1].strip(),
                    'duration': job[2].strip(),
                    'location': job[3].strip()
                })
        
        return experience
    
    def extract_education(self, text):
        """Extract education information from resume text"""
        education = []
        
        # Look for education section
        edu_patterns = [
            r'education[:\s]*(.*?)(?=experience|skills|projects|$)', 
            r'academic[:\s]*(.*?)(?=experience|skills|projects|$)',
            r'qualifications[:\s]*(.*?)(?=experience|skills|projects|$)'
        ]
        
        edu_text = ""
        for pattern in edu_patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if match:
                edu_text = match.group(1)
                break
        
        if edu_text:
            # Extract degree information
            degree_pattern = r'([A-Za-z\s]+(?:Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.)[A-Za-z\s]*)\s*[-–]\s*([A-Za-z\s&]+)\s*[-–]\s*([A-Za-z0-9\s,]+)'
            degrees = re.findall(degree_pattern, edu_text)
            
            for degree in degrees:
                education.append({
                    'degree': degree[0].strip(),
                    'institution': degree[1].strip(),
                    'year': degree[2].strip()
                })
        
        return education
    
    def parse_resume(self, file_path, file_type):
        """Main method to parse resume and extract all information"""
        try:
            # Extract text
            text = self.extract_text(file_path, file_type)
            
            # Extract information
            contact_info = self.extract_contact_info(text)
            skills = self.extract_skills(text)
            experience = self.extract_experience(text)
            education = self.extract_education(text)
            
            # Extract name (first line usually contains name)
            lines = text.split('\n')
            name = lines[0].strip() if lines else ""
            
            return {
                'name': name,
                'contact_info': contact_info,
                'skills': skills,
                'experience': experience,
                'education': education,
                'raw_text': text
            }
            
        except Exception as e:
            raise Exception(f"Error parsing resume: {str(e)}")
    
    def calculate_skill_match(self, job_skills, candidate_skills):
        """Calculate skill match percentage between job and candidate"""
        if not job_skills or not candidate_skills:
            return 0
        
        # Convert to lowercase for comparison
        job_skills_lower = [skill.lower() for skill in job_skills]
        candidate_skills_lower = [skill.lower() for skill in candidate_skills]
        
        # Calculate intersection
        matched_skills = set(job_skills_lower) & set(candidate_skills_lower)
        
        # Calculate percentage
        match_percentage = (len(matched_skills) / len(job_skills_lower)) * 100
        
        return round(match_percentage, 2)