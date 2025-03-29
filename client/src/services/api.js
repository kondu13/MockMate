import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://mockmate-l6fv.onrender.com/api/v1",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    if (error.response?.data?.message) {
      return Promise.reject(error.response.data.message);
    }
    
    if (error.response) {
      return Promise.reject(error);
    }
    
    return Promise.reject(error.message || 'An error occurred');
  }
);

// Appointment Functions
export const getAvailableSlots = async (userId, date) => {
  const response = await api.get(`/users/${userId}/availability/${date}`);
  return response.availableSlots;
};

export const bookAppointment = async (mentorId, data) => {
  const response = await api.post(`/users/${mentorId}/book`, data);
  return response.data.appointment;
};

export const getAppointmentDetails = async (appointmentId) => {
  const response = await api.get(`/appointments/${appointmentId}`);
  return response.data.appointment;
};

export const getScheduledInterviews = async () => {
  const response = await api.get('/scheduled-interviews');
  return response.data.interviews;
};

// User Functions
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response;
};

export const filterUsers = async (filters) => {
  const params = new URLSearchParams();
  
  if (filters.skills?.length > 0) {
    params.append('skills', filters.skills.join(','));
  }
  
  if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
  if (filters.date) params.append('date', filters.date);
  if (filters.time) params.append('time', filters.time);

  const response = await api.get(`/users/filter?${params.toString()}`);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/profile');
  return response;
};

export const updateProfile = async (userData) => {
  const response = await api.patch('/profile', userData);
  return response;
};

// Auth Functions
export const loginUser = async (credentials) => {
  const response = await api.post('/login', credentials);
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  return response.user || response;
};

export const registerUser = async (userData) => {
  const response = await api.post('/register', userData);
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  return response.user || response;
};

export const logoutUser = async () => {
  await api.post('/logout');
  localStorage.removeItem('token');
};