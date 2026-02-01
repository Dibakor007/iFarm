
import React, { useState, useEffect } from 'react';
import { useRole } from '../../App';
import { mockDb, BookingRequest } from '../../data/mockDb';
import { BookingRequestForm } from './Booking/BookingRequestForm';
import { ManagerApprovalQueue } from './Booking/ManagerApprovalQueue';
import { BookingList } from './Booking/BookingList';
import { Plus, LayoutGrid, ListFilter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BookingSystem: React.FC = () => {
  const { role } = useRole();
  const [view, setView] = useState<'list' | 'create'>('list');
  const [bookings, setBookings] = useState<BookingRequest[]>([]);

  const isFarmer = role === 'FARMER';
  const isManager = role === 'STORAGE_MANAGER' || role === 'ADMIN';

  const refresh = () => {
    setBookings(mockDb.getBookings());
  };

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('ifarm_notification_update', handler);
    return () => window.removeEventListener('ifarm_notification_update', handler);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-100">
             <LayoutGrid size={20} />
          </div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {isFarmer ? 'আমার বুকিং ম্যানেজমেন্ট' : 'বুকিং এপ্রুভাল কিউ'}
          </h2>
        </div>

        {isFarmer && view === 'list' && (
          <button 
            onClick={() => setView('create')}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-100 hover:scale-105 transition-all"
          >
            <Plus size={18} /> নতুন বুকিং রিকোয়েস্ট
          </button>
        )}
        
        {isFarmer && view === 'create' && (
          <button 
            onClick={() => setView('list')}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold text-sm"
          >
             ফিরে যান
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {isFarmer ? (
            view === 'create' ? (
              <BookingRequestForm onSuccess={() => { setView('list'); refresh(); }} />
            ) : (
              <BookingList bookings={bookings.filter(b => b.farmerName === 'মোঃ আব্দুর রহিম')} />
            )
          ) : isManager ? (
            <ManagerApprovalQueue bookings={bookings} onUpdate={refresh} />
          ) : (
            <div className="p-20 text-center text-slate-400">আপনার এই মডিউলে প্রবেশাধিকার নেই।</div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BookingSystem;
