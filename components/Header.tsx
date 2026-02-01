
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Globe, Bell, ChevronDown, Menu, Moon, Sun, Trash2, ExternalLink, Package, Truck, AlertTriangle, Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useRole } from '../App';
import { useSettings } from '../context/SettingsContext';
import { mockDb, AppNotification } from '../data/mockDb';
import { motion as m, AnimatePresence } from 'framer-motion';

// Fix: Cast motion to any to avoid property 'initial', 'animate', etc. errors in this environment
const motion = m as any;

// Helper function to get notification icon and colors based on type
const getNotificationStyle = (type: string) => {
  switch (type) {
    case 'BOOKING_REQUEST':
      return {
        icon: <Package size={18} />,
        bgColor: 'bg-amber-100 dark:bg-amber-900/30',
        iconColor: 'text-amber-600 dark:text-amber-400',
        borderColor: 'border-amber-200 dark:border-amber-800',
        label: 'বুকিং রিকোয়েস্ট',
        labelEn: 'Booking Request'
      };
    case 'BOOKING_UPDATE':
      return {
        icon: <CheckCircle size={18} />,
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
        label: 'বুকিং আপডেট',
        labelEn: 'Booking Update'
      };
    case 'TRANSPORT_UPDATE':
      return {
        icon: <Truck size={18} />,
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        borderColor: 'border-blue-200 dark:border-blue-800',
        label: 'ট্রান্সপোর্ট',
        labelEn: 'Transport'
      };
    case 'EXPIRY':
      return {
        icon: <Clock size={18} />,
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        iconColor: 'text-red-600 dark:text-red-400',
        borderColor: 'border-red-200 dark:border-red-800',
        label: 'মেয়াদ সতর্কতা',
        labelEn: 'Expiry Alert'
      };
    case 'ALERT':
      return {
        icon: <AlertTriangle size={18} />,
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        iconColor: 'text-red-600 dark:text-red-400',
        borderColor: 'border-red-200 dark:border-red-800',
        label: 'সতর্কতা',
        labelEn: 'Alert'
      };
    default:
      return {
        icon: <Bell size={18} />,
        bgColor: 'bg-slate-100 dark:bg-slate-700',
        iconColor: 'text-slate-600 dark:text-slate-400',
        borderColor: 'border-slate-200 dark:border-slate-600',
        label: 'নোটিফিকেশন',
        labelEn: 'Notification'
      };
  }
};

// Helper to format time ago
const getTimeAgo = (dateStr: string, lang: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (lang === 'BN') {
    if (diffMins < 1) return 'এইমাত্র';
    if (diffMins < 60) return `${diffMins} মিনিট আগে`;
    if (diffHours < 24) return `${diffHours} ঘন্টা আগে`;
    if (diffDays === 1) return 'গতকাল';
    return `${diffDays} দিন আগে`;
  } else {
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  }
};

interface HeaderProps {
  onToggleSidebar: () => void;
  addToast: (msg: string, type?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, addToast }) => {
  const { role } = useRole();
  const { settings, updateSetting } = useSettings();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const refreshNotifs = () => {
    const all = mockDb.getNotifications();
    setNotifications(all.filter(n => n.targetRole === role || n.targetRole === 'ADMIN'));
  };

  useEffect(() => {
    refreshNotifs();
    window.addEventListener('ifarm_notification_update', refreshNotifs);
    return () => window.removeEventListener('ifarm_notification_update', refreshNotifs);
  }, [role]);

  const handleNotificationClick = (notification: AppNotification) => {
    // Mark this notification as read
    const notifs = mockDb.getNotifications().map(n => 
      n.id === notification.id ? { ...n, isRead: true } : n
    );
    localStorage.setItem('ifarm_notifications_v1', JSON.stringify(notifs));
    window.dispatchEvent(new Event('ifarm_notification_update'));

    // Navigate if link exists
    if (notification.link) {
      setShowNotifs(false);
      navigate(notification.link);
    }
  };

  const clearNotifs = () => {
    mockDb.markNotifsRead();
    addToast('সব নোটিফিকেশন পড়া হিসেবে চিহ্নিত করা হয়েছে', 'info');
  };

  const toggleTheme = () => {
    updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLang = () => {
    updateSetting('language', settings.language === 'BN' ? 'EN' : 'BN');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 md:h-18 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-3 md:px-8 shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={onToggleSidebar} 
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl lg:hidden"
        >
          <Menu size={22} />
        </button>
        <div className="hidden sm:block">
           <h2 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">iFarm Smart Management</h2>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 md:p-2.5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
        >
          {settings.theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
        </button>

        <button 
          onClick={toggleLang}
          className="hidden xs:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400 font-bold text-[10px]"
        >
          <Globe size={14} />
          {settings.language}
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className={`relative p-2 md:p-2.5 rounded-xl transition-all ${unreadCount > 0 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] text-white flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800 font-black shadow-lg"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </button>
          
          <AnimatePresence>
            {showNotifs && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-[min(22rem,calc(100vw-3rem))] sm:w-80 md:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
                >
                  <div className="px-2.5 py-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <h4 className="font-bold text-[12px] text-slate-800 dark:text-slate-100">{settings.language === 'BN' ? 'নোটিফিকেশন' : 'Notifications'}</h4>
                    <button onClick={clearNotifs} className="text-[10px] text-slate-400 hover:text-emerald-600 font-bold flex items-center gap-1 uppercase tracking-widest transition-colors">
                      <Trash2 size={11} /> {settings.language === 'BN' ? 'পড়া হয়েছে' : 'Mark all read'}
                    </button>
                  </div>
                  <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto px-2 py-1 space-y-1">
                    {notifications.length > 0 ? (
                      notifications.map(n => {
                        const style = getNotificationStyle(n.type);
                        return (
                          <motion.div 
                            key={n.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer group border ${!n.isRead ? style.bgColor + ' ' + style.borderColor : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600'} ${n.link ? 'hover:scale-[1.005] hover:shadow-md' : ''}`}
                          >
                            <div className="flex gap-3">
                              {/* Icon with colored background */}
                              <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${style.bgColor} ${style.iconColor}`}>
                                {style.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                {/* Type label */}
                                <div className="flex items-center gap-1 mb-0.5">
                                  <span className={`text-[9px] font-bold uppercase tracking-[0.12em] ${style.iconColor}`}>
                                    {settings.language === 'BN' ? style.label : style.labelEn}
                                  </span>
                                  {!n.isRead && (
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                  )}
                                </div>
                                {/* Title */}
                                <div className="flex items-start justify-between gap-1.5">
                                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">{n.title}</p>
                                  {n.link && (
                                    <ArrowRight size={11} className="text-emerald-500 shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                  )}
                                </div>
                                {/* Message */}
                                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                                {/* Footer with time and action */}
                                <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100 dark:border-slate-700/50">
                                  <div className="flex items-center gap-1.5 text-slate-400">
                                    <Clock size={10} />
                                    <span className="text-[10px]">{getTimeAgo(n.createdAt, settings.language)}</span>
                                  </div>
                                  {n.link && (
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                      {settings.language === 'BN' ? 'বিস্তারিত দেখুন' : 'View Details'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center">
                        <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
                          <Bell className="text-slate-300 dark:text-slate-500" size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                          {settings.language === 'BN' ? 'কোনো নোটিফিকেশন নেই' : 'No notifications'}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {settings.language === 'BN' ? 'নতুন আপডেট এখানে দেখা যাবে' : 'New updates will appear here'}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="h-6 md:h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 md:mx-1"></div>

        <button className="flex items-center gap-2 md:gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 p-1 md:p-1.5 md:pr-4 rounded-2xl transition-colors group">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-[10px] md:text-xs border border-white/20 shadow-lg uppercase">
            {role[0]}
          </div>
          <div className="hidden lg:flex flex-col items-start leading-tight">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{settings.language === 'BN' ? 'ইউজার প্রোফাইল' : 'Profile'}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">{role}</span>
          </div>
          <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-y-0.5" />
        </button>
      </div>
    </header>
  );
};
