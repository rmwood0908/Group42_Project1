import { useEffect, useState } from 'react';
import * as authApi from '../api/authApi';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const persistSession = (tokenValue, userValue) => {
    setToken(tokenValue);
    setUser(userValue);
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('user', JSON.stringify(userValue));
  };

  const login = async (email, password) => {
    setLoading(true);
    setError('');

    try {
      const data = await authApi.login(email, password);
      persistSession(data.token, data.user);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError('');

    try {
      const data = await authApi.register(username, email, password);
      persistSession(data.token, data.user);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return {
    user,
    token,
    page,
    setPage,
    error,
    setError,
    loading,
    login,
    register,
    logout
  };
}