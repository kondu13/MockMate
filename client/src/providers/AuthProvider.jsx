// src/providers/AuthProvider.jsx
import { useState, useEffect } from 'react';
import {AuthContext} from '../contexts/AuthContext';
import { getUserProfile } from '../services/api';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if there's a token in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Only make the profile API call if we have a token
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        setUser(null);
        localStorage.removeItem('token'); // Clear invalid token
        console.error('Authentication failed:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value = {
    user,
    isLoading,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}