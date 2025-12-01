import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, [token]);

  async function login(email, senha) {
    try {
      const response = await api.post('/login', { email, senha });
      const newToken = response.data.token;
      
      setToken(newToken); 
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  }

  function logout() {
    setToken(null);
    localStorage.removeItem('token');
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}