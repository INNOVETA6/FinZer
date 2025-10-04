// src/hooks/useAuth.ts (Fixed - Simple Version)
import { useState, useEffect } from 'react';

interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
}

interface UserProfile {
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  careerInfo?: {
    currentRole?: string;
    experience?: string;
  };
  academicBackground?: {
    degree?: string;
    fieldOfStudy?: string;
  };
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Create a simple state management for auth
class AuthManager {
  private state: AuthState = {
    user: null,
    profile: null,
    isAuthenticated: false,
    loading: true,
  };

  private listeners: Array<(state: AuthState) => void> = [];

  constructor() {
    this.initializeAuth();
  }

  // Subscribe to state changes
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Get current state
  getState(): AuthState {
    return { ...this.state };
  }

  // Notify all listeners of state change
  private notify() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  // Set state and notify
  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  // Initialize authentication from localStorage
  private async initializeAuth() {
    try {
      this.setState({ loading: true });

      const savedAuth = localStorage.getItem('isAuthenticated');
      const savedUser = localStorage.getItem('user');
      const savedProfile = localStorage.getItem('userProfile'); // 🔥 Get profile from localStorage

      if (savedAuth === 'true' && savedUser) {
        try {
          const user = JSON.parse(savedUser);
          this.setState({ 
            user, 
            isAuthenticated: true 
          });

          console.log('🔄 Loading profile for:', user.email || user.name);

          // 🔥 Load profile from localStorage first
          if (savedProfile) {
            try {
              const profile = JSON.parse(savedProfile);
              this.setState({ profile });
              console.log('✅ Profile loaded from localStorage:', profile?.personalInfo?.name || user.name);
            } catch (error) {
              console.warn('⚠️ Error parsing saved profile:', error);
            }
          }

          // 🔥 Create a basic profile if none exists
          if (!this.state.profile) {
            const basicProfile: UserProfile = {
              personalInfo: {
                name: user.name || `${user.firstName} ${user.lastName}`.trim() || user.email?.split('@')[0] || 'User',
                email: user.email,
                phone: user.phone || undefined
              },
              careerInfo: {
                currentRole: undefined,
                experience: undefined
              },
              academicBackground: {
                degree: undefined,
                fieldOfStudy: undefined
              }
            };

            this.setState({ profile: basicProfile });
            // Save to localStorage for future use
            localStorage.setItem('userProfile', JSON.stringify(basicProfile));
            console.log('✅ Basic profile created for navbar:', basicProfile.personalInfo.name);
          }

        } catch (error) {
          console.error('Error parsing saved user:', error);
          this.clearAuth();
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      this.clearAuth();
    } finally {
      this.setState({ loading: false });
    }
  }

  // Login method
  async login(userData: User): Promise<void> {
    try {
      console.log('🚀 Logging in user:', userData.email);

      this.setState({
        user: userData,
        isAuthenticated: true
      });

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));

      // 🔥 Create profile from user data
      const profile: UserProfile = {
        personalInfo: {
          name: userData.name || `${userData.firstName} ${userData.lastName}`.trim() || userData.email?.split('@')[0] || 'User',
          email: userData.email
        },
        careerInfo: {},
        academicBackground: {}
      };

      this.setState({ profile });
      localStorage.setItem('userProfile', JSON.stringify(profile));

      console.log('✅ Login successful');
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

  // Logout method
  logout(): void {
    console.log('👋 Logging out user');
    this.clearAuth();
  }

  // Clear authentication data
  private clearAuth(): void {
    this.setState({
      user: null,
      profile: null,
      isAuthenticated: false
    });
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile'); // 🔥 Clear profile too
  }

  // Refresh profile data
  async refreshProfile(): Promise<void> {
    const { isAuthenticated, user } = this.state;
    
    if (!isAuthenticated || !user?.email) {
      console.warn('⚠️ Cannot refresh profile: user not authenticated');
      return;
    }

    try {
      console.log('🔄 Refreshing profile...');

      // 🔥 Get profile from localStorage or create basic one
      const savedProfile = localStorage.getItem('userProfile');
      let profile: UserProfile;

      if (savedProfile) {
        profile = JSON.parse(savedProfile);
      } else {
        // Create basic profile
        profile = {
          personalInfo: {
            name: user.name || `${user.firstName} ${user.lastName}`.trim() || user.email?.split('@')[0] || 'User',
            email: user.email
          },
          careerInfo: {},
          academicBackground: {}
        };
        localStorage.setItem('userProfile', JSON.stringify(profile));
      }

      this.setState({ profile });
      console.log('✅ Profile refreshed for navbar');
    } catch (error) {
      console.error('❌ Failed to refresh profile:', error);
    }
  }
}

// Create singleton instance
const authManager = new AuthManager();

// Custom hook to use auth
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(authManager.getState());

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authManager.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  return {
    ...authState,
    login: authManager.login.bind(authManager),
    logout: authManager.logout.bind(authManager),
    refreshProfile: authManager.refreshProfile.bind(authManager),
  };
};

// Export types
export type { User, UserProfile };
