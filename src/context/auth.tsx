import React, { createContext, useContext, useEffect, useState } from 'react';
import { Login } from '@/services/userService';

interface AuthContextProps {
  token: string | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async () => {
    try {
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
        return;
      }

      const data = await Login(process.env.NEXT_PUBLIC_API_USERNAME || '', process.env.NEXT_PUBLIC_API_PWD || '');

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setIsAuthenticated(true);
      console.info(`✅ Você está logado como ${data.user_display_name} (${data.user_email})`);
    } catch (error: unknown) {
      console.error('❌ Login Error:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};