import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser, LoginResponse } from '@/services/authService';

interface AuthContextType {
  user: LoginResponse | null;
  setUser: (user: LoginResponse | null) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(() => getCurrentUser());

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (username: string, password: string) => {
    try {
      const response = await loginService(username, password);
      if (response.authenticated && response.userType === 'Admin') {
        setUser(response);
      } else {
        throw new Error('Access denied. Admin privileges required.');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      logoutService();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}