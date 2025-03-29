// src/hooks/useAxios.js
import axios from 'axios';
import { useAuth } from './useAuth';

export default function useAxios() {
  const { user } = useAuth();

  const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    withCredentials: true
  });

  // Add auth token to requests
  api.interceptors.request.use(config => {
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  });

  return api;
}