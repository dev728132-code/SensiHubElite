import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: { uid: string; email: string; displayName: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ uid: string; email: string; displayName: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const savedSession = localStorage.getItem('sensihub_session');
      const rememberMe = localStorage.getItem('sensihub_remember') === 'true';

      if (savedSession && (rememberMe || sessionStorage.getItem('sensihub_active') === 'true')) {
        try {
          const userData = JSON.parse(savedSession);
          
          // Fetch accounts to find valid profile
          const accounts = JSON.parse(localStorage.getItem('sensihub_accounts') || '[]');
          const account = accounts.find((a: any) => a.uid === userData.uid);
          
          if (account) {
            setUser(userData);
            setProfile(account.profile);
          } else {
            // Invalid session
            localStorage.removeItem('sensihub_session');
          }
        } catch (e) {
          console.error("Failed to restore session", e);
          localStorage.removeItem('sensihub_session');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (username: string, email: string, password: string) => {
    setError(null);
    try {
      const accounts = JSON.parse(localStorage.getItem('sensihub_accounts') || '[]');
      
      if (accounts.find((a: any) => a.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email already registered');
      }

      if (accounts.find((a: any) => a.username.toLowerCase() === username.toLowerCase())) {
        throw new Error('Username taken');
      }

      const uid = Math.random().toString(36).substring(2, 15);
      const newProfile: UserProfile = {
        userId: uid,
        displayName: username,
        photoURL: '',
        membershipStatus: 'Free Member',
        activePlans: [],
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      const newAccount = {
        uid,
        username,
        email,
        password, // In a real app, this would be hashed
        profile: newProfile
      };

      accounts.push(newAccount);
      localStorage.setItem('sensihub_accounts', JSON.stringify(accounts));

      // Auto login after registration
      await login(email, password, true);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setError(null);
    try {
      const accounts = JSON.parse(localStorage.getItem('sensihub_accounts') || '[]');
      const account = accounts.find((a: any) => 
        a.email.toLowerCase() === email.toLowerCase() || 
        a.username.toLowerCase() === email.toLowerCase()
      );

      if (!account || account.password !== password) {
        throw new Error('Invalid credentials');
      }

      const userData = { 
        uid: account.uid, 
        email: account.email, 
        displayName: account.username 
      };
      
      setUser(userData);
      setProfile(account.profile);

      localStorage.setItem('sensihub_session', JSON.stringify(userData));
      localStorage.setItem('sensihub_remember', rememberMe.toString());
      sessionStorage.setItem('sensihub_active', 'true');

      // Update last login
      account.profile.lastLogin = new Date().toISOString();
      localStorage.setItem('sensihub_accounts', JSON.stringify(accounts));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('sensihub_session');
    localStorage.removeItem('sensihub_remember');
    sessionStorage.removeItem('sensihub_active');
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      error, 
      login, 
      register, 
      logout, 
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
