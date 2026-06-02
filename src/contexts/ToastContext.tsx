import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle } from '@phosphor-icons/react';

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl animate-fade-in-up">
          <CheckCircle size={24} className="text-emerald-400" weight="fill" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
