"use client";
import React, { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle } from 'lucide-react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      {typeof document !== 'undefined' && notifications.length > 0 && createPortal(
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`${
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              } text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-down pointer-events-auto`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {notification.type === 'success' ? (
                <CheckCircle size={24} />
              ) : (
                <XCircle size={24} />
              )}
              <span className="text-base font-semibold">{notification.message}</span>
            </div>
          ))}
        </div>,
        document.body
      )}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe usarse dentro de NotificationProvider');
  }
  return context;
};