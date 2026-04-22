import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationState {
  message: string;
  type: NotificationType;
  id: number;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
  notification: NotificationState | null;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
    const id = Date.now();
    setNotification({ message, type, id });
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => prev?.id === id ? null : prev);
    }, 3000);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, notification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
