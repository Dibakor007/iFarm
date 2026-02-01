
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Menu, Sprout } from 'lucide-react';
import { MENU_ITEMS } from '../constants';
import { useRole } from '../App';
import { useSettings } from '../context/SettingsContext';
import { motion as m, AnimatePresence } from 'framer-motion';

// Fix: Cast motion to any to avoid property 'initial', 'animate', 'layoutId', etc. errors in this environment
const motion = m as any;

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useRole();
  const { settings } = useSettings();

  const filteredMenu = MENU_ITEMS.filter(item => item.roles.includes(role));

  const handleNav = (path: string) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && window.innerWidth < 1024 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55]"
          />
        )}
      </AnimatePresence>

      <aside 
        className={`
          fixed inset-y-0 left-0 z-[60] md:relative
          ${isOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'}
          transition-all duration-300 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col
        `}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 shrink-0">
          <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-100 dark:shadow-none">
            <motion.div whileHover={{ rotate: 15 }}>
              <Sprout size={24} />
            </motion.div>
          </div>
          {(isOpen || window.innerWidth < 1024) && (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tighter italic"
            >
              iFarm
            </motion.span>
          )}
          <button 
            onClick={() => setIsOpen(false)}
            className="ml-auto p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group relative overflow-hidden ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 dark:shadow-none' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}`}>
                  {/* Fix: Cast React.ReactNode to any to allow cloneElement props like 'size' */}
                  {React.cloneElement(item.icon as any, { size: 18 })}
                </span>
                {(isOpen || window.innerWidth < 1024) && (
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-bold tracking-tight">
                      {settings.language === 'BN' ? item.label : item.english}
                    </span>
                    <span className={`text-[9px] uppercase tracking-widest font-black opacity-60 ${isActive ? 'text-emerald-100' : ''}`}>
                      {settings.language === 'BN' ? item.english : item.label}
                    </span>
                  </div>
                )}
                {isActive && isOpen && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-emerald-200 rounded-r-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700 hidden lg:block">
           <button 
             onClick={() => setIsOpen(!isOpen)}
             className="w-full flex items-center justify-center p-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-slate-400 transition-colors"
           >
             {isOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
        </div>
      </aside>
    </>
  );
};
