import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Simple request interceptor for auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Simplified response interceptor
api.interceptors.response.use(
  response => response.data,
  error => {
    // Handle 401 errors by clearing token and redirecting
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data?.message || error.message);
  }
);

// Appointment Functions
export const getAvailableSlots = async (userId, date) => {
  const response = await api.get(`/users/${userId}/availability/${date}`);
  return response.availableSlots;
};

export const bookAppointment = async (mentorId, data) => {
  const response = await api.post(`/users/${mentorId}/book`, data);
  return response.appointment;
};

export const getAppointmentDetails = async (id) => {
  const response = await api.get(`/appointments/${id}`);
  return response.appointment;
};

export const getScheduledInterviews = async () => {
  const response = await api.get('/scheduled-interviews');
  return response.interviews;
};

// User Functions
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response;
};

export const filterUsers = async (filters) => {
  const response = await api.get('/users/filter', { params: filters });
  return response;
};

export const getUserProfile = async () => {
  const response = await api.get('/profile');
  return response;
};

export const updateProfile = async (userData) => {
  try {
    const response = await api.patch('/profile', userData);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Auth Functions
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response.user || response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response.user || response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const logoutUser = async () => {
  try {
    await api.post('/logout');
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Logout error:', error);
    localStorage.removeItem('token');
  }
};