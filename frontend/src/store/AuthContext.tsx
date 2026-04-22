import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import api from '../services/api';
import { authValidator } from '../services/authValidator';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthOpen: boolean;
  authTab: 'login' | 'register';
  openAuth: (tab?: 'login' | 'register') => void;
  closeAuth: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (token: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateUser: (data: Partial<Pick<User, 'name' | 'email' | 'phone' | 'address'>>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  const openAuth = (tab: 'login' | 'register' = 'login') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };
  const closeAuth = () => setIsAuthOpen(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    const validation = authValidator.validateLogin(email, password);
    if (!validation.success) {
      console.error(validation.message);
      return false;
    }

    try {
      const response = await api.post('/account/login', { email, password });
      const { token, user: userData } = response.data;
      
      const userName = userData.name || userData.fullName || 'User';
      const formattedUser: User = {
        id: userData.id.toString(),
        name: userName,
        email: userData.email,
        avatar: userData.avatar || userData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=c9a96e&color=fff`,
        provider: 'email',
        role: userData.role ? userData.role.toLowerCase() as 'admin' | 'customer' : 'customer',
        phone: userData.phone,
        address: userData.address
      };

      setUser(formattedUser);
      localStorage.setItem('user', JSON.stringify(formattedUser));
      localStorage.setItem('token', token);
      closeAuth();
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const loginWithGoogle = async (token: string): Promise<boolean> => {
    try {
      const response = await api.post('/account/google-login', { token });
      const { token: jwtToken, user: userData } = response.data;
      
      const userName = userData.name || userData.fullName || 'Google User';
      const formattedUser: User = {
        id: userData.id.toString(),
        name: userName,
        email: userData.email,
        avatar: userData.avatar || userData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=c9a96e&color=fff`,
        provider: 'google',
        role: userData.role ? userData.role.toLowerCase() as 'admin' | 'customer' : 'customer',
        phone: userData.phone,
        address: userData.address
      };

      setUser(formattedUser);
      localStorage.setItem('user', JSON.stringify(formattedUser));
      localStorage.setItem('token', jwtToken);
      closeAuth();
      return true;
    } catch (err) {
      console.error('Google login error:', err);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const validation = authValidator.validateRegister({ name, email, password, confirmPassword: password }); // Simplified confirmPassword for now as it's usually handled by the form component
    if (!validation.success) {
      console.error(validation.message);
      return false;
    }

    try {
      const response = await api.post('/account/register', { fullName: name, email, password });
      const { token, user: userData } = response.data;

      const userName = userData.name || userData.fullName || 'User';
      const formattedUser: User = {
        id: userData.id.toString(),
        name: userName,
        email: userData.email,
        provider: 'email',
        role: userData.role ? userData.role.toLowerCase() as 'admin' | 'customer' : 'customer',
        phone: userData.phone,
        address: userData.address
      };

      setUser(formattedUser);
      localStorage.setItem('user', JSON.stringify(formattedUser));
      localStorage.setItem('token', token);
      closeAuth();
      return true;
    } catch (err) {
      console.error('Register error:', err);
      return false;
    }
  };

  const updateUser = (data: Partial<Pick<User, 'name' | 'email' | 'phone' | 'address'>>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAuthOpen, authTab, openAuth, closeAuth, login, loginWithGoogle, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
