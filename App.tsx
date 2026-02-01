
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion as m } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import Dashboard from './components/Dashboard';
import HarvestRecords from './components/HarvestRecords';
import ColdStorage from './components/ColdStorage';
import TransportMonitoring from './components/TransportMonitoring';
import WeatherPage from './components/WeatherPage';
import ReportsPage from './components/ReportsPage';
import TransportReports from './pages/TransportReports';
import Settings from './pages/Settings';
import MarketPrices from './pages/MarketPrices';
import OptimizationPage from './pages/OptimizationPage';
import AuditLogsPage from './pages/AuditLogsPage';
import { UserRole } from './constants';
import { ToastContainer } from './components/UI/Toast';
import { WifiOff } from 'lucide-react';
import { ProtectedRoute } from './security/ProtectedRoute';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { mockDb } from './data/mockDb';
import { MOCK_STOCK } from './data/dummyData';

// Fix: Cast motion to any to avoid property 'initial', 'animate', etc. errors in this environment
const motion = m as any;

const RoleContext = createContext({ role: 'ADMIN' as UserRole, setRole: (r: UserRole) => {} });
export const useRole = () => useContext(RoleContext);

const AppContent: React.FC = () => {
  const VALID_ROLES: UserRole[] = ['ADMIN', 'STORAGE_MANAGER', 'TRANSPORT_MANAGER', 'FARMER'];
  const [role, setRoleState] = useState<UserRole>(() => {
    const stored = localStorage.getItem('ifarm-role') as UserRole | null;
    return stored && VALID_ROLES.includes(stored) ? stored : 'ADMIN';
  });
  const [toasts, setToasts] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    mockDb.checkStockExpiries(MOCK_STOCK, settings.storageConfig.alertDays);

    const handleOnline = () => {
      setIsOnline(true);
      addToast('আপনি পুনরায় অনলাইনে যুক্ত হয়েছেন', 'success');
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Dynamic sidebar state based on screen size
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('resize', handleResize);
    };
  }, [settings.storageConfig.alertDays]);

  const setRole = useCallback((next: UserRole) => {
    setRoleState(next);
    localStorage.setItem('ifarm-role', next);
  }, []);

  const addToast = (message: string, type: any = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      <div className={`flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden font-['Hind_Siliguri',_sans-serif] ${settings.enableAnimations ? '' : 'no-animate'}`}>
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {!isOnline && (
            <motion.div 
              initial={{ y: -50 }} animate={{ y: 0 }}
              className="bg-amber-600 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 flex items-center justify-center gap-2 z-[60]"
            >
              <WifiOff size={14} /> আপনি এখন অফলাইনে আছেন — সীমাবদ্ধ ফিচার
            </motion.div>
          )}
          
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} addToast={addToast} />

          <div className="flex-1 overflow-y-auto relative scroll-smooth">
            <div className={`max-w-[1600px] mx-auto p-4 sm:p-6 md:p-8 ${settings.compactMode ? 'p-2 md:p-4' : ''}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: settings.enableAnimations ? 0.3 : 0 }}
                >
                  <Routes location={location}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<ProtectedRoute module="dashboard"><Dashboard /></ProtectedRoute>} />
                    <Route path="/harvest" element={<ProtectedRoute module="harvest"><HarvestRecords /></ProtectedRoute>} />
                    <Route path="/market-prices" element={<ProtectedRoute module="market"><MarketPrices /></ProtectedRoute>} />
                    <Route path="/cold-storage" element={<ProtectedRoute module="cold_storage"><ColdStorage /></ProtectedRoute>} />
                    <Route path="/transport" element={<ProtectedRoute module="transport"><TransportMonitoring /></ProtectedRoute>} />
                    <Route path="/weather" element={<ProtectedRoute module="weather"><WeatherPage /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute module="reports"><ReportsPage /></ProtectedRoute>} />
                    <Route path="/reports/transport" element={<ProtectedRoute module="transport_reports"><TransportReports /></ProtectedRoute>} />
                    <Route path="/reports/optimization" element={<ProtectedRoute module="optimization"><OptimizationPage /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute module="settings"><Settings /></ProtectedRoute>} />
                    <Route path="/settings/audit-logs" element={<ProtectedRoute module="audit"><AuditLogsPage /></ProtectedRoute>} />
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </RoleContext.Provider>
  );
};

const App: React.FC = () => (
  <SettingsProvider>
    <AppContent />
  </SettingsProvider>
);

export default App;
