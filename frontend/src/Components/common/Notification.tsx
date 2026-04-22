import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useNotification } from '../../store/NotificationContext';
import './Notification.css';

const Notification: React.FC = () => {
  const { notification, hideNotification } = useNotification();

  const getIcon = () => {
    switch (notification?.type) {
      case 'success':
        return <CheckCircle size={32} />;
      case 'error':
        return <XCircle size={32} />;
      case 'warning':
        return <AlertTriangle size={32} />;
      case 'info':
        return <Info size={32} />;
      default:
        return <CheckCircle size={32} />;
    }
  };

  return (
    <AnimatePresence>
      {notification && (
        <div className="notification-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="notification-card"
          >
            <button className="notification-close" onClick={hideNotification}>
              <X size={18} />
            </button>
            
            <div className={`notification-icon ${notification.type}`}>
              {getIcon()}
            </div>
            
            <p className="notification-message">
              {notification.message}
            </p>
            
            <motion.div 
              style={{ 
                height: '3px', 
                background: 'var(--color-gold)', 
                position: 'absolute', 
                bottom: 0, 
                left: 0,
                borderBottomLeftRadius: '12px'
              }}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3, ease: 'linear' }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
