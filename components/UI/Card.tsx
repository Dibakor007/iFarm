
import React from 'react';
import { motion as m } from 'framer-motion';

// Fix: Cast motion to any to avoid property 'initial', 'animate', etc. errors in this environment
const motion = m as any;

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  actions?: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, title, subtitle, className = '', actions, hoverable = false }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={hoverable ? { y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" } : {}}
    className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden ${className}`}
  >
    {(title || actions) && (
      <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div>
          {title && <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{title}</h3>}
          {subtitle && <p className="text-base text-slate-500 dark:text-slate-400 font-medium mt-1">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    )}
    <div className="p-8">
      {children}
    </div>
  </motion.div>
);
