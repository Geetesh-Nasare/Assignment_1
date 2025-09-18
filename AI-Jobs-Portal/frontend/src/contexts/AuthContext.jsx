import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verify token and get user data
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data.user);
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, userType) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        user_type: userType
      });

      const { access_token, user_id, user_type, user_data } = response.data;
      
      // Store token
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Set user data
      setUser({
        id: user_id,
        type: user_type,
        email: user_data.email,
        first_name: user_data.first_name,
        last_name: user_data.last_name
      });

      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      const { access_token, user_id, user_type } = response.data;
      
      // Store token
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Set user data
      setUser({
        id: user_id,
        type: user_type,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name
      });

      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    toast.info('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      
      // Update user data
      setUser(prev => ({
        ...prev,
        ...profileData
      }));

      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });

      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isJobSeeker: user?.type === 'job_seeker',
    isRecruiter: user?.type === 'recruiter',
    isAdmin: user?.type === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};