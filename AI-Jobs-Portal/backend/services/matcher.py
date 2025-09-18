import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class JobMatcher:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            max_features=1000
        )
        
        # Skill categories and their weights
        self.skill_categories = {
            'programming_languages': {
                'python': 1.0, 'java': 1.0, 'javascript': 1.0, 'typescript': 1.0,
                'c++': 1.0, 'c#': 1.0, 'php': 1.0, 'ruby': 1.0, 'go': 1.0,
                'rust': 1.0, 'swift': 1.0, 'kotlin': 1.0, 'scala': 1.0
            },
            'web_technologies': {
                'html': 0.8, 'css': 0.8, 'react': 1.0, 'angular': 1.0, 'vue': 1.0,
                'node.js': 1.0, 'express': 0.9, 'django': 1.0, 'flask': 1.0,
                'spring': 1.0, 'laravel': 1.0, 'rails': 1.0, 'bootstrap': 0.7
            },
            'databases': {
                'mysql': 1.0, 'postgresql': 1.0, 'mongodb': 1.0, 'redis': 0.9,
                'sqlite': 0.8, 'oracle': 1.0, 'sql server': 1.0, 'cassandra': 0.9
            },
            'cloud_platforms': {
                'aws': 1.0, 'azure': 1.0, 'google cloud': 1.0, 'docker': 0.9,
                'kubernetes': 0.9, 'terraform': 0.8, 'jenkins': 0.8
            },
            'data_science': {
                'machine learning': 1.0, 'artificial intelligence': 1.0,
                'data science': 1.0, 'pandas': 0.9, 'numpy': 0.9,
                'scikit-learn': 0.9, 'tensorflow': 0.9, 'pytorch': 0.9,
                'r': 0.8, 'matplotlib': 0.7, 'seaborn': 0.7
            },
            'mobile_development': {
                'android': 1.0, 'ios': 1.0, 'react native': 1.0, 'flutter': 1.0,
                'xamarin': 0.8, 'ionic': 0.7
            },
            'soft_skills': {
                'leadership': 0.8, 'communication': 0.8, 'teamwork': 0.7,
                'problem solving': 0.9, 'analytical': 0.8, 'creative': 0.6,
                'time management': 0.7, 'project management': 0.8
            }
        }
    
    def preprocess_text(self, text):
        """Preprocess text for matching"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and digits
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Tokenize and remove stop words
        tokens = word_tokenize(text)
        tokens = [token for token in tokens if token not in self.stop_words]
        
        return ' '.join(tokens)
    
    def extract_skills_from_text(self, text):
        """Extract skills from job description or resume text"""
        if not text:
            return []
        
        text_lower = text.lower()
        found_skills = []
        
        # Extract skills from all categories
        for category, skills in self.skill_categories.items():
            for skill, weight in skills.items():
                if skill.lower() in text_lower:
                    found_skills.append({
                        'skill': skill,
                        'category': category,
                        'weight': weight
                    })
        
        return found_skills
    
    def calculate_skill_match_percentage(self, job_skills, candidate_skills):
        """Calculate skill match percentage between job and candidate"""
        if not job_skills or not candidate_skills:
            return 0
        
        # Convert to dictionaries for easier lookup
        job_skill_dict = {skill['skill'].lower(): skill for skill in job_skills}
        candidate_skill_dict = {skill['skill'].lower(): skill for skill in candidate_skills}
        
        total_weight = 0
        matched_weight = 0
        
        # Calculate weighted match
        for skill_name, job_skill in job_skill_dict.items():
            total_weight += job_skill['weight']
            
            if skill_name in candidate_skill_dict:
                candidate_skill = candidate_skill_dict[skill_name]
                # Use the minimum weight to avoid over-weighting
                matched_weight += min(job_skill['weight'], candidate_skill['weight'])
        
        if total_weight == 0:
            return 0
        
        match_percentage = (matched_weight / total_weight) * 100
        return round(match_percentage, 2)
    
    def calculate_text_similarity(self, job_description, candidate_profile):
        """Calculate text similarity using TF-IDF and cosine similarity"""
        if not job_description or not candidate_profile:
            return 0
        
        # Preprocess texts
        job_text = self.preprocess_text(job_description)
        candidate_text = self.preprocess_text(candidate_profile)
        
        if not job_text or not candidate_text:
            return 0
        
        try:
            # Create TF-IDF vectors
            texts = [job_text, candidate_text]
            tfidf_matrix = self.vectorizer.fit_transform(texts)
            
            # Calculate cosine similarity
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            
            return round(similarity * 100, 2)
        except Exception as e:
            print(f"Error calculating text similarity: {e}")
            return 0
    
    def calculate_experience_match(self, job_requirements, candidate_experience):
        """Calculate experience match based on years and relevance"""
        if not job_requirements or not candidate_experience:
            return 0
        
        # Extract required experience years from job description
        exp_pattern = r'(\d+)\+?\s*years?\s*(?:of\s*)?experience'
        required_years = re.findall(exp_pattern, job_requirements.lower())
        
        if not required_years:
            return 50  # Default score if no specific requirement
        
        required_years = int(required_years[0])
        
        # Calculate candidate's total experience
        candidate_years = 0
        for exp in candidate_experience:
            # Simple extraction of years from duration
            duration = exp.get('duration', '')
            years = re.findall(r'(\d+)\s*years?', duration.lower())
            if years:
                candidate_years += int(years[0])
        
        # Calculate match percentage
        if candidate_years >= required_years:
            return 100
        else:
            return (candidate_years / required_years) * 100
    
    def calculate_education_match(self, job_requirements, candidate_education):
        """Calculate education match"""
        if not job_requirements or not candidate_education:
            return 50  # Default score
        
        job_text = job_requirements.lower()
        education_keywords = ['bachelor', 'master', 'phd', 'degree', 'diploma', 'certification']
        
        # Check if job requires specific education
        requires_education = any(keyword in job_text for keyword in education_keywords)
        
        if not requires_education:
            return 50  # No specific education requirement
        
        # Check candidate's education level
        candidate_degrees = [edu.get('degree', '').lower() for edu in candidate_education]
        candidate_text = ' '.join(candidate_degrees)
        
        # Simple scoring based on degree level
        if 'phd' in candidate_text or 'doctorate' in candidate_text:
            return 100
        elif 'master' in candidate_text:
            return 85
        elif 'bachelor' in candidate_text or 'b.s.' in candidate_text or 'b.a.' in candidate_text:
            return 70
        elif 'diploma' in candidate_text or 'certificate' in candidate_text:
            return 50
        else:
            return 30
    
    def calculate_overall_match(self, job_data, candidate_data):
        """Calculate overall match percentage"""
        # Extract skills
        job_skills = self.extract_skills_from_text(job_data.get('description', ''))
        candidate_skills = self.extract_skills_from_text(candidate_data.get('skills_text', ''))
        
        # Calculate individual scores
        skill_score = self.calculate_skill_match_percentage(job_skills, candidate_skills)
        text_score = self.calculate_text_similarity(
            job_data.get('description', ''),
            candidate_data.get('profile_text', '')
        )
        experience_score = self.calculate_experience_match(
            job_data.get('description', ''),
            candidate_data.get('experience', [])
        )
        education_score = self.calculate_education_match(
            job_data.get('description', ''),
            candidate_data.get('education', [])
        )
        
        # Weighted average
        weights = {
            'skills': 0.4,
            'text': 0.2,
            'experience': 0.25,
            'education': 0.15
        }
        
        overall_score = (
            skill_score * weights['skills'] +
            text_score * weights['text'] +
            experience_score * weights['experience'] +
            education_score * weights['education']
        )
        
        return {
            'overall_match': round(overall_score, 2),
            'skill_match': skill_score,
            'text_similarity': text_score,
            'experience_match': experience_score,
            'education_match': education_score,
            'matched_skills': [skill['skill'] for skill in job_skills 
                             if skill['skill'].lower() in [s['skill'].lower() for s in candidate_skills]]
        }
    
    def get_upskilling_recommendations(self, job_skills, candidate_skills):
        """Get upskilling recommendations based on missing skills"""
        if not job_skills or not candidate_skills:
            return []
        
        candidate_skill_names = [skill['skill'].lower() for skill in candidate_skills]
        missing_skills = []
        
        for skill in job_skills:
            if skill['skill'].lower() not in candidate_skill_names:
                missing_skills.append({
                    'skill': skill['skill'],
                    'category': skill['category'],
                    'priority': 'high' if skill['weight'] >= 0.9 else 'medium' if skill['weight'] >= 0.7 else 'low'
                })
        
        # Sort by priority and weight
        missing_skills.sort(key=lambda x: (x['priority'] == 'high', x['priority'] == 'medium', -job_skills[next(i for i, s in enumerate(job_skills) if s['skill'].lower() == x['skill'].lower())]['weight']))
        
        return missing_skills[:10]  # Return top 10 recommendations