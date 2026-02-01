
import React, { useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

// Fix: Cast motion to any to avoid property 'initial', 'animate', etc. errors in this environment
const motion = m as any;

export type ToastType = 'success' | 'warning' | 'error' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  const colors = {
    success: 'border-emerald-100 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800',
    warning: 'border-amber-100 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800',
    error: 'border-red-100 bg-red-50 dark:bg-red-900/20 dark:border-red-800',
    info: 'border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: 50 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`flex items-center gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md min-w-[300px] ${colors[type]}`}
    >
      {icons[type]}
      <p className="flex-1 text-sm font-bold text-slate-800 dark:text-slate-100">{message}</p>
      <button onClick={() => onClose(id)} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
        <X size={16} className="text-slate-400" />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC<{ toasts: any[], removeToast: (id: string) => void }> = ({ toasts, removeToast }) => (
  <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </AnimatePresence>
  </div>
);
