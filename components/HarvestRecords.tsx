
import React, { useEffect, useState } from 'react';
import { Card } from './UI/Card';
import { MOCK_HARVESTS } from '../data/dummyData';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  MapPin,
  Calendar,
  X,
  User,
  Sprout,
  ArrowRight,
  Info,
  Scale,
  Hash,
  Edit,
  Trash2,
  CheckCircle2,
  FileText,
  History,
  TrendingUp
} from 'lucide-react';
import type { HarvestRecord } from '../types';
import { createHarvestRecord, fetchHarvestRecords } from '../lib/apiClient';

// Fix: Cast motion to any to avoid property 'initial', 'animate', etc. errors in this environment
const motion = m as any;

const HarvestRecords: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [harvests, setHarvests] = useState<HarvestRecord[]>(MOCK_HARVESTS);
  const [formData, setFormData] = useState({
    farmerName: '',
    cropType: 'Potato',
    quantity: '',
    unit: 'KG',
    date: new Date().toISOString().split('T')[0],
    location: '',
  });

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const loadHarvests = async () => {
      try {
        const data = await fetchHarvestRecords(100, controller.signal);
        if (!mounted) return;
        if (data && data.length) {
          setHarvests(data);
        }
      } catch (error) {
        console.error('Failed to load harvests from API, using mock data.', error);
      }
    };

    loadHarvests();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const handleSave = async () => {
    if (!formData.farmerName.trim() || !formData.quantity) {
      return;
    }

    const payload = {
      farmerName: formData.farmerName.trim(),
      cropType: formData.cropType,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      date: formData.date,
      location: formData.location,
    };

    try {
      const saved = await createHarvestRecord(payload);
      setHarvests((prev) => [{ ...saved }, ...prev]);
      setShowForm(false);
      setFormData({
        farmerName: '',
        cropType: 'Potato',
        quantity: '',
        unit: 'KG',
        date: new Date().toISOString().split('T')[0],
        location: '',
      });
    } catch (error) {
      console.error('Failed to create harvest record', error);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">ফসল রেকর্ড</h1>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium">সংগৃহীত ফসলের বিস্তারিত তথ্য ও ব্যবস্থাপনা</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all transform active:scale-95"
        >
          <Plus size={20} /> নতুন রেকর্ড যোগ করুন
        </button>
      </div>

      <Card className="border-none shadow-xl p-0 overflow-hidden rounded-[2rem]">
        <div className="p-5 md:p-8 bg-white dark:bg-slate-800 flex flex-col md:flex-row gap-4 border-b border-slate-100 dark:border-slate-700">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="কৃষকের নাম বা এলাকা দিয়ে খুঁজুন..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold focus:border-emerald-500 outline-none transition-all shadow-inner"
            />
          </div>
          <div className="flex gap-3">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:border-emerald-200 transition-all">
              <Filter size={16} /> ফিল্টার
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all">
              <Download size={16} /> এক্সপোর্ট
            </button>
          </div>
        </div>

        <div className="overflow-x-auto relative">
          <table className="w-full text-left border-separate border-spacing-y-3 px-5 md:px-8 pb-6">
            <thead>
              <tr className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] px-4">
                <th className="pb-3 pl-4">কৃষকের নাম</th>
                <th className="pb-3">ফসল</th>
                <th className="pb-3">পরিমান</th>
                <th className="pb-3 hidden sm:table-cell">তারিখ</th>
                <th className="pb-3 hidden md:table-cell">অবস্থান</th>
                <th className="pb-3 text-right pr-4">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {harvests.map((record, index) => (
                <motion.tr 
                  key={record.id} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedRecord(record)}
                  className="bg-white dark:bg-slate-800/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all cursor-pointer shadow-sm rounded-2xl group ring-1 ring-slate-100 dark:ring-slate-700/50"
                >
                  <td className="py-5 pl-4 rounded-l-2xl border-y border-l border-transparent">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center font-black text-emerald-600 dark:text-emerald-400 text-sm group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                        {record.farmerName[0]}
                      </div>
                      <span className="font-black text-slate-800 dark:text-slate-100 text-sm tracking-tight">{record.farmerName}</span>
                    </div>
                  </td>
                  <td className="py-5 border-y border-transparent">
                    <div className="flex items-center gap-2">
                       <Sprout size={14} className="text-emerald-500" />
                       <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{record.cropType}</span>
                    </div>
                  </td>
                  <td className="py-5 border-y border-transparent">
                    <span className="text-base font-black text-slate-800 dark:text-slate-200">{record.quantity.toLocaleString('bn-BD')} কেজি</span>
                  </td>
                  <td className="py-5 border-y border-transparent hidden sm:table-cell">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold">
                      <Calendar size={14} className="text-slate-400" /> {record.date}
                    </div>
                  </td>
                  <td className="py-5 border-y border-transparent hidden md:table-cell">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold">
                      <MapPin size={14} className="text-red-400" /> {record.location}
                    </div>
                  </td>
                  <td className="py-5 pr-4 rounded-r-2xl border-y border-r border-transparent text-right">
                    <button className="p-3 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-xl text-slate-400 hover:text-emerald-600 transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* NEW RECORD MODAL (Logic remains, layout kept compact) */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
              className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-y-auto max-h-[95vh] relative z-10 border border-white/20"
            >
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mt-4 mb-2 md:hidden" />
              <div className="p-8 md:p-10 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
                    <Plus size={24} className="text-emerald-600" /> নতুন রেকর্ড যোগ করুন
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 font-bold uppercase tracking-widest">Harvest Entry System</p>
                </div>
                <button onClick={() => setShowForm(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all"><X size={28} className="text-slate-400" /></button>
              </div>

              <div className="p-8 md:p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">কৃষকের নাম</label>
                    <input
                      type="text"
                      className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-slate-100 outline-none focus:border-emerald-500 transition-all"
                      placeholder="যেমন: আব্দুল করিম"
                      value={formData.farmerName}
                      onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ফসলের ধরন</label>
                    <select
                      className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-slate-100 outline-none focus:border-emerald-500 transition-all"
                      value={formData.cropType}
                      onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                    >
                      <option value="Potato">আলু (Potato)</option>
                      <option value="Onion">পেঁয়াজ (Onion)</option>
                      <option value="Tomato">টমেটো (Tomato)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">পরিমান</label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        className="flex-1 p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-slate-100 outline-none focus:border-emerald-500"
                        placeholder="0.00"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      />
                      <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                        {['KG', 'TON'].map(u => (
                          <button
                            key={u}
                            type="button"
                            onClick={() => setFormData({ ...formData, unit: u as any })}
                            className={`px-5 py-3 rounded-xl text-[10px] font-black transition-all ${formData.unit === u ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">তারিখ</label>
                    <input
                      type="date"
                      className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-slate-100 outline-none focus:border-emerald-500 transition-all"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                   <button onClick={() => setShowForm(false)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">বাতিল</button>
                   <button
                     type="button"
                     onClick={handleSave}
                     className="flex-[2] py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-100 flex items-center justify-center gap-3"
                   >
                     সংরক্ষণ করুন <ArrowRight size={20} />
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAIL VIEW MODAL - Upgraded for "Options Details" */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedRecord(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] relative z-10 overflow-hidden border border-white/10"
            >
              <div className="p-10 md:p-14 bg-emerald-600 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Sprout size={240} />
                </div>
                <div className="relative z-10 flex justify-between items-start">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
                        <CheckCircle2 size={24} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-90">রেকর্ড প্রোফাইল</span>
                    </div>
                    <div>
                      <h2 className="text-4xl md:text-5xl font-black tracking-tighter drop-shadow-sm italic">{selectedRecord.farmerName}</h2>
                      <div className="flex items-center gap-2 mt-2 opacity-90">
                        <Sprout size={18} className="text-emerald-100" />
                        <p className="text-xl font-bold text-emerald-50">{selectedRecord.cropType}</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedRecord(null)} className="p-4 bg-white/10 hover:bg-white/20 rounded-[1.5rem] transition-all shadow-xl border border-white/10 group">
                    <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </div>

              <div className="p-10 md:p-14 space-y-12 bg-white dark:bg-slate-800 max-h-[60vh] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <DetailCard label="পরিমান" value={`${selectedRecord.quantity.toLocaleString('bn-BD')} কেজি`} icon={<Scale size={20} />} theme="emerald" />
                  <DetailCard label="তারিখ" value={selectedRecord.date} icon={<Calendar size={20} />} theme="blue" />
                  <DetailCard label="অবস্থান" value={selectedRecord.location} icon={<MapPin size={20} />} theme="red" />
                  <DetailCard label="রেকর্ড ID" value={`#HR-${selectedRecord.id}`} icon={<Hash size={20} />} theme="slate" />
                </div>

                <div className="space-y-6">
                   <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                     <TrendingUp size={16} className="text-emerald-500" /> স্মার্ট এনালাইটিক্স ও করণীয় (Actions)
                   </h4>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-slate-100 dark:border-slate-700 group hover:border-emerald-500/30 transition-all">
                         <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-emerald-600 shadow-sm"><Info size={20} /></div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">সিস্টেম পরামর্শ</span>
                         </div>
                         <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                           "এই রেকর্ডটি সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে। কোল্ড স্টোরেজ মডিউল থেকে এই লটের জন্য চেম্বার বরাদ্দ করার পরামর্শ দেওয়া হচ্ছে।"
                         </p>
                      </div>

                      <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-slate-100 dark:border-slate-700">
                         <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-blue-600 shadow-sm"><History size={20} /></div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">সাম্প্রতিক অ্যাক্টিভিটি</span>
                         </div>
                         <div className="space-y-3">
                            <ActivityStep label="রেকর্ড তৈরি করা হয়েছে" date="আজ, ১০:৪৫ AM" active />
                            <ActivityStep label="ভেরিফিকেশন সম্পন্ন" date="আজ, ১১:০০ AM" active />
                            <ActivityStep label="স্টোরেজ পেন্ডিং" date="-" />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center justify-center gap-3 py-5 px-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl group">
                    <Download size={18} className="group-hover:translate-y-0.5 transition-transform" /> রশিদ ডাউনলোড
                  </button>
                  <button className="flex items-center justify-center gap-3 py-5 px-6 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all border-2 border-emerald-100">
                    <Edit size={18} /> তথ্য এডিট
                  </button>
                  <button className="flex items-center justify-center gap-3 py-5 px-6 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all border-2 border-red-100">
                    <Trash2 size={18} /> রেকর্ড মুছুন
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailCard = ({ label, value, icon, theme }: { label: string, value: string, icon: any, theme: string }) => {
  const themes: any = {
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100',
    red: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-100',
    slate: 'text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-100',
  };

  return (
    <div className="flex flex-col gap-3 p-6 bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700/50 rounded-[2rem] shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${themes[theme]} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-black text-slate-800 dark:text-slate-100 truncate">{value}</p>
      </div>
    </div>
  );
};

const ActivityStep = ({ label, date, active = false }: { label: string, date: string, active?: boolean }) => (
  <div className={`flex items-center justify-between px-2 ${active ? 'opacity-100' : 'opacity-30'}`}>
     <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{label}</span>
     </div>
     <span className="text-[9px] font-black text-slate-400">{date}</span>
  </div>
);

export default HarvestRecords;
