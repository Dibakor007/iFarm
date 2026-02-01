
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AccessDenied: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl max-w-2xl mx-auto mt-12">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center text-red-600 mb-8"
      >
        <ShieldAlert size={48} />
      </motion.div>
      <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">অ্যাক্সেস অনুমোদিত নয় (Access Denied)</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-md">
        আপনার বর্তমান ইউজার রোল ({localStorage.getItem('ifarm-role')}) এই মডিউলটি দেখার জন্য অনুমোদিত নয়। দয়া করে এডমিনের সাথে যোগাযোগ করুন।
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
        >
          <ArrowLeft size={18} /> পিছনে ফিরে যান
        </button>
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all"
        >
          <Home size={18} /> ড্যাশবোর্ড
        </button>
      </div>
    </div>
  );
};
