import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  let user = null;
  try {
    if (token) user = jwtDecode(token);
  } catch (error) {
    // If token is invalid, clear it
    console.error("Invalid token:", error);
    localStorage.removeItem('token');
    user = null;
  }
  
  // Centralize logout logic
  const logout = () => {
    setToken('');
  };

  const value = { token, setToken, user, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);