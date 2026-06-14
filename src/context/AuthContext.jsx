// =========================================
// EternalVow — Auth Context
// =========================================

import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(api.getStoredUser());
  const [weddingId, setWeddingId] = useState(api.getStoredWeddingId());
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    if (api.isAuthenticated()) {
      api.getMe()
        .then(data => {
          setUser(data.user);
          setWeddingId(data.weddingId);
        })
        .catch(() => {
          // Token expired or invalid
          api.logout();
          setUser(null);
          setWeddingId(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data.user);
    setWeddingId(data.weddingId);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await api.register(name, email, password);
    setUser(data.user);
    setWeddingId(data.weddingId);
    return data;
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setWeddingId(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      weddingId,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;
