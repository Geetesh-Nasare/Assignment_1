# AI Jobs Portal

A comprehensive AI-powered job recommendation platform that connects job seekers with companies through intelligent matching technology. The platform leverages Artificial Intelligence (AI), Machine Learning (ML), and Natural Language Processing (NLP) to provide personalized job recommendations and streamline the hiring process.

## 🚀 Features

### For Job Seekers
- **Resume Upload & Auto Profile Creation**: Upload your resume and let AI extract your skills, experience, and education automatically
- **AI-Powered Job Recommendations**: Get personalized job suggestions based on your skills and preferences
- **One-Click Applications**: Apply to multiple jobs with pre-filled information
- **Learning Library**: Access free upskilling resources, courses, and tutorials
- **Application Tracking**: Monitor your application status from applied to hired
- **AI Career Assistant**: Chat with an AI bot for career advice and mock interviews
- **Email Notifications**: Get notified about new job matches and application updates

### For Recruiters/Companies
- **Job Posting Management**: Create and manage job postings easily
- **AI-Ranked Candidate Lists**: Get candidates sorted by skill match percentage
- **Application Management**: Track and manage all applications in one place
- **Company Profile**: Showcase your company and attract top talent
- **Analytics Dashboard**: Monitor job performance and application metrics

### For Platform Admins
- **User Management**: Manage job seekers, recruiters, and admin accounts
- **Job Moderation**: Oversee job postings and ensure quality
- **Platform Analytics**: Monitor platform usage and performance
- **Content Management**: Manage learning resources and platform content

## 🛠️ Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **AI/ML**: scikit-learn, NLTK, OpenAI API
- **File Processing**: PyPDF2, python-docx
- **Email**: SMTP integration

### Frontend
- **Framework**: React 18
- **Styling**: Styled Components
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Notifications**: React Toastify

### AI Services
- **Resume Parsing**: NLP-based extraction of skills, experience, and education
- **Job Matching**: TF-IDF and cosine similarity for skill matching
- **Chatbot**: OpenAI GPT integration for career advice
- **Recommendations**: Machine learning algorithms for personalized suggestions

## 📁 Project Structure

```
AI-Jobs-Portal/
│
├── backend/                     # Flask API Backend
│   ├── app.py                   # Main Flask application
│   ├── requirements.txt         # Python dependencies
│   ├── config.py               # Configuration settings
│   ├── models/                 # Database models
│   │   ├── user.py            # User management models
│   │   ├── job.py             # Job posting models
│   │   └── application.py     # Application models
│   ├── routes/                 # API routes
│   │   ├── auth.py            # Authentication routes
│   │   ├── jobs.py            # Job management routes
│   │   ├── resume.py          # Resume processing routes
│   │   ├── chatbot.py         # AI chatbot routes
│   │   └── admin.py           # Admin panel routes
│   ├── services/              # AI and business logic
│   │   ├── parser.py          # Resume parsing service
│   │   └── matcher.py         # Job matching algorithms
│   └── utils/                 # Utility functions
│       ├── emailer.py         # Email service
│       └── auth.py            # Authentication utilities
│
├── frontend/                   # React Frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts
│   │   ├── services/         # API services
│   │   └── styles/           # Global styles
│   └── package.json          # Frontend dependencies
│
├── database/                  # Database scripts
│   └── seed.js               # Sample data seeding
│
└── README.md                 # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB
- OpenAI API key (optional, for chatbot)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run the Flask application**:
   ```bash
   python app.py
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

### Database Setup

1. **Start MongoDB**:
   ```bash
   mongod
   ```

2. **Seed sample data** (optional):
   ```bash
   mongo ai_jobs_portal database/seed.js
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Flask Configuration
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/
DATABASE_NAME=ai_jobs_portal

# Email Configuration
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# OpenAI Configuration (Optional)
OPENAI_API_KEY=your-openai-api-key
```

## 📱 Usage

### For Job Seekers

1. **Register/Login**: Create an account as a job seeker
2. **Upload Resume**: Upload your resume for automatic profile creation
3. **Complete Profile**: Add additional skills, experience, and education
4. **Browse Jobs**: View recommended jobs or search manually
5. **Apply**: Apply to jobs with one click
6. **Track Applications**: Monitor your application status
7. **Learn**: Access free learning resources and courses

### For Recruiters

1. **Register/Login**: Create an account as a recruiter
2. **Complete Company Profile**: Add company information
3. **Post Jobs**: Create detailed job postings
4. **Review Applications**: View AI-ranked candidate applications
5. **Manage Candidates**: Update application status and communicate

### For Admins

1. **Access Admin Panel**: Login with admin credentials
2. **Manage Users**: View and manage all platform users
3. **Moderate Content**: Review and manage job postings
4. **View Analytics**: Monitor platform performance

## 🤖 AI Features

### Resume Parsing
- Extracts personal information, skills, experience, and education
- Supports PDF, DOC, DOCX, and TXT formats
- Uses NLP techniques for accurate data extraction

### Job Matching Algorithm
- Calculates skill match percentage between job requirements and candidate skills
- Uses TF-IDF vectorization and cosine similarity
- Considers experience level, education, and location preferences

### AI Chatbot
- Provides career advice and interview tips
- Conducts mock interviews
- Answers questions about the platform and job search

### Personalized Recommendations
- Suggests relevant jobs based on profile and preferences
- Recommends upskilling resources
- Provides career guidance

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- File upload security

## 📊 Database Schema

### Users Collection
- **job_seekers**: Personal profiles, skills, applications
- **recruiters**: Company information, job postings
- **admins**: Platform administrators

### Jobs Collection
- Job postings with requirements and metadata
- Application tracking and analytics

### Applications Collection
- Job applications with status tracking
- Skill match calculations
- Communication history

## 🚀 Deployment

### Backend Deployment
1. Set up a production server (AWS, DigitalOcean, etc.)
2. Install Python and MongoDB
3. Configure environment variables
4. Use a WSGI server like Gunicorn
5. Set up reverse proxy with Nginx

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to a static hosting service (Netlify, Vercel, etc.)
3. Configure API endpoints

### Database Deployment
- Use MongoDB Atlas for cloud database
- Set up proper backup and monitoring
- Configure security groups and access controls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: support@aijobsportal.com

## 🔮 Future Enhancements

- Video interview scheduling
- Advanced analytics dashboard
- Mobile app development
- Integration with LinkedIn and other platforms
- Advanced AI features for candidate assessment
- Multi-language support
- Advanced search and filtering options

## 📈 Performance Optimization

- Implement caching for frequently accessed data
- Use CDN for static assets
- Optimize database queries
- Implement pagination for large datasets
- Add image optimization for resumes

## 🧪 Testing

- Unit tests for backend services
- Integration tests for API endpoints
- Frontend component testing
- End-to-end testing for critical user flows

---

**Built with ❤️ for job seekers and employers worldwide**