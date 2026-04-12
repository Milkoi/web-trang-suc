import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthOpen: boolean;
  authTab: 'login' | 'register';
  openAuth: (tab?: 'login' | 'register') => void;
  closeAuth: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateUser: (data: Partial<Pick<User, 'name' | 'email'>>) => void;
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

  const login = async (email: string, _password: string): Promise<boolean> => {
    // Mock login
    await new Promise(r => setTimeout(r, 800));
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      provider: 'email',
      role: email === 'admin@velmora.com' ? 'admin' : 'customer'
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    closeAuth();
    return true;
  };

  const loginWithGoogle = async () => {
    await new Promise(r => setTimeout(r, 1000));
    const mockUser: User = {
      id: 'g-1',
      name: 'Google User',
      email: 'user@gmail.com',
      avatar: 'https://ui-avatars.com/api/?name=Google+User&background=c9a96e&color=fff',
      provider: 'google',
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    closeAuth();
  };

  const register = async (name: string, email: string, _password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800));
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      provider: 'email',
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    closeAuth();
    return true;
  };

  const updateUser = (data: Partial<Pick<User, 'name' | 'email'>>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
