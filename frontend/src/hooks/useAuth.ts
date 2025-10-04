// src/hooks/useAuth.ts
import React, { useState, useEffect, createContext, useContext } from 'react';
import { authService, User } from '@/services/authService';
import { profileService, UserProfile } from '@/services/profileService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (credentials: { email: string; password: string; remember_me: boolean }) => Promise<void>;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      if (authService.isAuthenticated()) {
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
          
          // Try to load full profile
          try {
            const userProfile = await profileService.getProfile();
            setProfile(userProfile);
          } catch (error) {
            console.warn('Could not load user profile:', error);
            // Keep user authenticated even if profile fails to load
          }
        } else {
          // Clear invalid auth state
          authService.signOut();
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      authService.signOut();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string; remember_me: boolean }): Promise<void> => {
    try {
      setLoading(true);
      const authResponse = await authService.signIn(credentials);
      
      setUser(authResponse.user);
      setIsAuthenticated(true);
      
      // Load full profile after login
      try {
        const userProfile = await profileService.getProfile();
        setProfile(userProfile);
      } catch (error) {
        console.warn('Could not load user profile after login:', error);
      }
    } catch (error) {
      throw error; // Re-throw to handle in component
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    authService.signOut();
    setIsAuthenticated(false);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      const userProfile = await profileService.getProfile();
      setProfile(userProfile);
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

  return React.createElement(AuthContext.Provider, { value }, children);
};
