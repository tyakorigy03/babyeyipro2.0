import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../utils/api';

const AuthContext = createContext();

const STORAGE_KEYS = {
  token: 'babyeyipro_auth_token',
  user: 'babyeyipro_auth_user',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.token));
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      const storedUser = localStorage.getItem(STORAGE_KEYS.user);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.warn('Failed to parse stored auth user', err);
        }
      }
    } else {
      setAuthToken(null);
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    if (token && !user) {
      fetchMe();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async ({ identifier, password }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/login', {
        identifier,
        password,
      });

      const { token: authToken, user: authUser } = response.data;

      localStorage.setItem(STORAGE_KEYS.token, authToken);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(authUser));
      setAuthToken(authToken);
      setToken(authToken);
      setUser(authUser);

      return { success: true };
    } catch (err) {
      const message = err?.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setError(null);
  };

  const fetchMe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/api/auth/me');
      const authUser = response.data?.user;
      setUser(authUser);
      if (authUser) {
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(authUser));
      }
    } catch (err) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      error,
      login,
      logout,
      fetchMe,
    }),
    [user, token, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
