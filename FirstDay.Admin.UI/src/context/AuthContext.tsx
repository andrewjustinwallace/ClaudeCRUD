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
  const [user, setUser] = useState<LoginResponse | null>(() => {
    const storedUser = getCurrentUser();
    console.log("Initial user state:", storedUser);
    return storedUser;
  });

  useEffect(() => {
    console.log("AuthContext - User state changed:", user);
    const updateStorage = () => {
      if (user) {
        console.log("Updating localStorage with user data");
        localStorage.setItem('adminUser', JSON.stringify(user));
        localStorage.setItem('adminEmployeeName', `${user.firstName} ${user.lastName}`);
      } else {
        console.log("Clearing user data from localStorage");
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminEmployeeName');
      }
    };

    updateStorage();
  }, [user]);

  const login = async (username: string, password: string) => {
    try {
      console.log("AuthContext - Login attempt for:", username);
      const response = await loginService(username, password);
      console.log("AuthContext - Login response:", response);
      
      if (response.authenticated) {
        if (response.userType !== 'Admin') {
          throw new Error('Access denied. Admin privileges required.');
        }

        // If we have companies, add the selectedCompanyId if there's only one
        const userWithCompany = response.companies?.length === 1 
          ? { ...response, selectedCompanyId: response.companies[0].companyId }
          : response;

        console.log("AuthContext - Setting user:", userWithCompany);
        setUser(userWithCompany);
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (error) {
      console.error("AuthContext - Login error:", error);
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("AuthContext - Logout attempt");
      await logoutService();
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

  console.log("AuthContext - Current state:", { isAuthenticated: value.isAuthenticated, hasUser: !!user });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}