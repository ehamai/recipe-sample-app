import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(true); // Assume configured until we check

  useEffect(() => {
    checkConfigAndAuth();
  }, []);

  const checkConfigAndAuth = async () => {
    try {
      // First check if OAuth is configured
      const configResponse = await axios.get('/api/config/status');
      const configured = configResponse.data.configured;
      setIsConfigured(configured);

      // Only check auth if configured
      if (configured) {
        try {
          const response = await axios.get('/api/auth/user');
          setUser(response.data);
        } catch {
          setUser(null);
        }
      }
    } catch {
      // If config check fails, assume configured and try auth
      setIsConfigured(true);
      try {
        const response = await axios.get('/api/auth/user');
        setUser(response.data);
      } catch {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    window.location.href = '/api/auth/login';
  };

  const logout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isConfigured, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
