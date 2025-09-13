import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeMLModel } from '../utils/mlPreferenceLearning';

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: string[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePreferences: (preferences: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('eventhub_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call - in real app, this would be an actual API
    if (email && password) {
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        preferences: [],
        createdAt: new Date().toISOString(),
      };
      
      setUser(mockUser);
      localStorage.setItem('eventhub_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call - in real app, this would be an actual API
    if (name && email && password) {
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        preferences: [],
        createdAt: new Date().toISOString(),
      };
      
      setUser(mockUser);
      localStorage.setItem('eventhub_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eventhub_user');
  };

  const updatePreferences = (preferences: string[]) => {
    if (user) {
      const updatedUser = { ...user, preferences };
      setUser(updatedUser);
      localStorage.setItem('eventhub_user', JSON.stringify(updatedUser));
      
      // Initialize ML model with user preferences
      initializeMLModel(user.id, preferences);
      console.log(`ML Model initialized for user ${user.id} with preferences:`, preferences);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updatePreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};