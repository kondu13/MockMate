// src/services/auth.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true
});

export const register = async (data) => {
  const response = await api.post('/register', data);
  return response.data;
};

export const login = async ({ email, password }) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};