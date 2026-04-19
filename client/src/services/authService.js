import { apiClient } from './apiClient';

export const authService = {
  // --- STUDENT AUTH ---
  studentRegister: async (userData) => {
    // userData expects: name, email, password, level, dailyHours, target
    return apiClient('/auth/user/register', {
      method: 'POST',
      body: userData,
    });
  },

  studentLogin: async (credentials) => {
    // credentials expects: email, password
    const data = await apiClient('/auth/user/login', {
      method: 'POST',
      body: credentials,
    });
    // Save token and user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  },

  // --- TEACHER AUTH ---
  teacherRegister: async (teacherData) => {
    // teacherData expects: name, email, password
    return apiClient('/auth/teacher/register', {
      method: 'POST',
      body: teacherData,
    });
  },

  teacherLogin: async (credentials) => {
    const data = await apiClient('/auth/teacher/login', {
      method: 'POST',
      body: credentials,
    });
    // Save token and teacher info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  },

  // --- UTILS ---
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Redirect to login
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};