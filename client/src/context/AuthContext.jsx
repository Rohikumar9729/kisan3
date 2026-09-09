import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('kisan_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('kisan_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and verify user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('kisan_token');
      if (!storedToken) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/api/users/me');
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('kisan_user', JSON.stringify(data.user));
        }
      } catch (err) {
        console.error('Failed to restore user session:', err);
        // If token is invalid/expired, clear it
        localStorage.removeItem('kisan_token');
        localStorage.removeItem('kisan_user');
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();

    // Listen to token expiry event from axios interceptor
    const handleLogoutEvent = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('kisan-auth-logout', handleLogoutEvent);
    return () => window.removeEventListener('kisan-auth-logout', handleLogoutEvent);
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/users/login', { email, password });
      if (data.success) {
        localStorage.setItem('kisan_token', data.token);
        localStorage.setItem('kisan_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! 🌾`);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || (err.code === 'ERR_NETWORK' ? 'Server is offline. Please make sure backend is running on port 4000.' : err.message) || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Register handler (creates account without auto-logging in)
  const register = async (userData) => {
    try {
      const { data } = await api.post('/api/users/register', userData);
      if (data.success) {
        toast.success(data.message || 'Account created successfully! Please sign in.');
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err) {
      const msg = err.response?.data?.message || (err.code === 'ERR_NETWORK' ? 'Server is offline. Please make sure backend is running on port 4000.' : err.message) || 'Registration failed. Please try again.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('kisan_token');
    localStorage.removeItem('kisan_user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Update user state
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('kisan_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === 'admin' || user?.email?.toLowerCase() === 'admin@kisan.com',
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
