// src/hooks/useAuth.tsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import { profileService, UserProfile } from '@/services/profileService';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      if (isAuthenticated && user) {
        // Load full profile data
        try {
          const profileData = await profileService.getProfile();
          setProfile(profileData);
        } catch (error) {
          console.warn('Could not load profile:', error);
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Load profile data after login
    refreshProfile();
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  const refreshProfile = async () => {
    if (!isAuthenticated) return;
    
    try {
      const profileData = await profileService.getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    profile,
    loading,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
