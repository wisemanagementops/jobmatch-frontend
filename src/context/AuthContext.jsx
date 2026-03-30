/**
 * Authentication Context
 * With JobMatch Chrome Extension auto-sync
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

/**
 * Notify JobMatch Chrome Extension of auth changes
 * This allows the extension to automatically sync with the web app
 */
function notifyExtension(type, token = null, email = null) {
  try {
    window.postMessage({ type, token, email }, '*');
    console.log('JobMatch: Extension notified -', type);
  } catch (e) {
    // Extension not installed or not on supported page - ignore silently
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.setToken(token);
      loadUser();
      
      // Sync existing token to Chrome extension on page load
      const email = localStorage.getItem('userEmail');
      notifyExtension('JOBMATCH_AUTH_SUCCESS', token, email);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await api.getMe();
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load user:', err);
      api.setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.login(email, password);
      setUser(response.data.user);
      
      // Notify Chrome extension of successful login
      const token = localStorage.getItem('token');
      notifyExtension('JOBMATCH_AUTH_SUCCESS', token, email);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, fullName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.register(email, password, fullName);
      setUser(response.data.user);
      
      // Notify Chrome extension of successful registration
      const token = localStorage.getItem('token');
      notifyExtension('JOBMATCH_AUTH_SUCCESS', token, email);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    // Notify Chrome extension of logout (before clearing data)
    notifyExtension('JOBMATCH_LOGOUT');
    
    await api.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.getMe();
      setUser(response.data);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isPro: user?.subscription?.status === 'pro' || user?.subscription?.status === 'lifetime',
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
