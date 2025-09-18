import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password, userType) =>
    api.post('/auth/login', { email, password, user_type: userType }),
  
  register: (userData) =>
    api.post('/auth/register', userData),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (profileData) =>
    api.put('/auth/profile', profileData),
  
  changePassword: (currentPassword, newPassword) =>
    api.post('/auth/change-password', { current_password: currentPassword, new_password: newPassword }),
  
  logout: () =>
    api.post('/auth/logout'),
};

// Jobs API
export const jobsAPI = {
  getJobs: (params = {}) =>
    api.get('/jobs', { params }),
  
  getJob: (id) =>
    api.get(`/jobs/${id}`),
  
  postJob: (jobData) =>
    api.post('/jobs/post', jobData),
  
  applyJob: (jobId, applicationData) =>
    api.post(`/jobs/${jobId}/apply`, applicationData),
  
  getJobApplications: (jobId) =>
    api.get(`/jobs/${jobId}/applications`),
  
  getJobRecommendations: () =>
    api.get('/jobs/recommendations'),
  
  getMyApplications: () =>
    api.get('/jobs/my-applications'),
  
  updateApplicationStatus: (jobId, applicationId, status, notes) =>
    api.put(`/jobs/${jobId}/update-status`, { application_id: applicationId, status, notes }),
};

// Resume API
export const resumeAPI = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  parseResumeText: (resumeText) =>
    api.post('/resume/parse-text', { resume_text: resumeText }),
  
  updateSkills: (skills) =>
    api.put('/resume/update-skills', { skills }),
  
  updateExperience: (experience) =>
    api.put('/resume/update-experience', { experience }),
  
  updateEducation: (education) =>
    api.put('/resume/update-education', { education }),
  
  getProfile: () =>
    api.get('/resume/profile'),
};

// Chatbot API
export const chatbotAPI = {
  chat: (message, type = 'general') =>
    api.post('/chatbot/chat', { message, type }),
  
  getInterviewQuestions: () =>
    api.get('/chatbot/interview-questions'),
  
  getCareerTips: () =>
    api.get('/chatbot/career-tips'),
  
  getUpskillingRecommendations: () =>
    api.get('/chatbot/upskilling-recommendations'),
};

// Admin API
export const adminAPI = {
  getDashboard: () =>
    api.get('/admin/dashboard'),
  
  getUsers: (params = {}) =>
    api.get('/admin/users', { params }),
  
  getUser: (userId) =>
    api.get(`/admin/users/${userId}`),
  
  updateUser: (userId, userData) =>
    api.put(`/admin/users/${userId}`, userData),
  
  deleteUser: (userId) =>
    api.delete(`/admin/users/${userId}`),
  
  getAllJobs: (params = {}) =>
    api.get('/admin/jobs', { params }),
  
  updateJob: (jobId, jobData) =>
    api.put(`/admin/jobs/${jobId}`, jobData),
  
  deleteJob: (jobId) =>
    api.delete(`/admin/jobs/${jobId}`),
  
  getAllApplications: (params = {}) =>
    api.get('/admin/applications', { params }),
  
  getAnalytics: () =>
    api.get('/admin/analytics'),
};

export default api;