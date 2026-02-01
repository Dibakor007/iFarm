
import React, { useState, useMemo } from 'react';
import { Card } from '../../UI/Card';
import { Table } from '../../UI/Table';
import { StatusChip } from '../../StatusChip';
import { BookingRequest, mockDb } from '../../../data/mockDb';
import { MOCK_CHAMBERS } from '../../../data/dummyData';
import { 
  CheckCircle, XCircle, User, Package, Thermometer, 
  MapPin, Clock, Search, Filter, Info, X, MessageSquare, Send,
  Zap, Snowflake, Grid, AlertTriangle, TrendingUp, TrendingDown,
  Droplets, Activity, ChevronRight, BarChart3, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ManagerApprovalQueue: React.FC<{ bookings: BookingRequest[], onUpdate: () => void }> = ({ bookings, onUpdate }) => {
  const [filter, setFilter] = useState<'Pending' | 'Approved' | 'Rejected' | 'Needs Information' | 'All'>('Pending');
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [assignedChamber, setAssignedChamber] = useState('Chamber A');
  const [infoMessage, setInfoMessage] = useState('');

  const filtered = bookings.filter(b => filter === 'All' ? true : b.status === filter);

  const handleApprove = () => {
    if (selectedBooking) {
      mockDb.updateBookingStatus(selectedBooking.id, 'Approved', { assignedChamber });
      setShowApproveModal(false);
      setSelectedBooking(null);
      onUpdate();
    }
  };

  const handleReject = () => {
    if (selectedBooking) {
      mockDb.updateBookingStatus(selectedBooking.id, 'Rejected', { rejectionReason: 'Capacity full' });
      setSelectedBooking(null);
      onUpdate();
    }
  };

  const handleRequestInfo = () => {
    if (selectedBooking && infoMessage.trim()) {
      mockDb.updateBookingStatus(selectedBooking.id, 'Needs Information', { infoRequest: infoMessage });
      setShowInfoModal(false);
      setInfoMessage('');
      setSelectedBooking(null);
      onUpdate();
    }
  };

  const columns = [
    { header: 'কৃষক ও রিকোয়েস্ট ID', render: (i: any) => (
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-slate-500 font-black border border-slate-200 dark:border-slate-700 shadow-sm">
          {i.farmerName[0]}
        </div>
        <div>
          <p className="font-black text-slate-800 dark:text-slate-200 text-base leading-tight">{i.farmerName}</p>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">ID: {i.id}</p>
        </div>
      </div>
    )},
    { header: 'পণ্য (পরিমান)', render: (i: any) => (
      <div>
        <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${i.crop.includes('Fish') ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {i.crop}
            </span>
        </div>
        <p className="text-base font-black text-slate-700 dark:text-slate-300 mt-1">{i.quantity.toLocaleString('bn-BD')} {i.unit}</p>
      </div>
    )},
    { header: 'পরিবেশ ডিমান্ড', render: (i: any) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
            <Thermometer size={12} className="text-amber-500" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{i.envDemand.temp}</span>
        </div>
        <div className="flex items-center gap-1.5">
            <Droplets size={12} className="text-blue-500" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{i.envDemand.humidity}</span>
        </div>
      </div>
    )},
    { header: 'সময়কাল', render: (i: any) => (
      <div className="text-sm font-bold text-slate-500">
        <p className="text-slate-800 dark:text-slate-300">{i.entryDate}</p>
        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">{i.duration} দিন (Duration)</p>
      </div>
    )},
    { header: 'স্ট্যাটাস', render: (i: any) => (
        <StatusChip 
            label={i.status === 'Needs Information' ? 'তথ্য প্রয়োজন' : i.status} 
            type={
                i.status === 'Approved' ? 'success' : 
                i.status === 'Pending' ? 'warning' : 
                i.status === 'Needs Information' ? 'info' : 'danger'
            } 
        />
    )},
    { header: 'অ্যাকশন', render: (i: any) => (
      <div className="flex gap-2">
        {i.status === 'Pending' || i.status === 'Needs Information' ? (
          <>
            <button 
              onClick={() => { setSelectedBooking(i); setShowApproveModal(true); }}
              className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-none"
              title="Approve"
            >
              <CheckCircle size={18} />
            </button>
            <button 
              onClick={() => { setSelectedBooking(i); setShowInfoModal(true); }}
              className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 rounded-xl hover:bg-blue-50 transition-all shadow-sm"
              title="Request Info"
            >
              <MessageSquare size={18} />
            </button>
            <button 
              onClick={() => { setSelectedBooking(i); handleReject(); }}
              className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-red-500 rounded-xl hover:bg-red-50 transition-all shadow-sm"
              title="Reject"
            >
              <XCircle size={18} />
            </button>
          </>
        ) : (
          <button className="flex items-center gap-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Info size={14} /> Details
          </button>
        )}
      </div>
    )}
  ];

  return (
    <div className="space-y-8">
      {/* Filtering Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit">
            {[
                { id: 'Pending', label: 'পেন্ডিং রিকোয়েস্ট' },
                { id: 'Needs Information', label: 'অপেক্ষিত তথ্য' },
                { id: 'Approved', label: 'অনুমোদিত' },
                { id: 'Rejected', label: 'প্রত্যাখ্যাত' },
                { id: 'All', label: 'সবগুলো' }
            ].map(f => (
            <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${filter === f.id ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-md border border-slate-100 dark:border-slate-700' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
                {f.label}
            </button>
            ))}
        </div>
        <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Queue Status</p>
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">{filtered.length} টি আইটেম পাওয়া গেছে</p>
        </div>
      </div>

      <Card className="border-none shadow-xl">
        <Table data={filtered} columns={columns} keyExtractor={i => i.id} searchable />
      </Card>

      {/* Approve & Allocate Modal */}
      <AnimatePresence>
        {showApproveModal && selectedBooking && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowApproveModal(false)} className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 30 }} 
                className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] relative z-10 overflow-hidden border border-white/20"
            >
               {/* Modal Header */}
               <div className="p-10 border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center">
                 <div className="flex items-center gap-6">
                    <div className={`p-5 rounded-[1.5rem] shadow-xl ${selectedBooking.crop.includes('Fish') ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>
                        {selectedBooking.crop.includes('Fish') ? <Snowflake size={32} /> : <Package size={32} />}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">চেম্বার বরাদ্দ করুন</h3>
                            <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {selectedBooking.id}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
                            {selectedBooking.farmerName} • {selectedBooking.quantity} {selectedBooking.unit} {selectedBooking.crop}
                        </p>
                    </div>
                 </div>
                 <button onClick={() => setShowApproveModal(false)} className="p-4 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all"><X size={32} className="text-slate-400" /></button>
               </div>
               
               <div className="flex flex-col lg:flex-row h-[550px]">
                  {/* Left Sidebar: Allocation Logic */}
                  <div className="lg:w-80 border-r border-slate-100 dark:border-slate-700 p-8 space-y-8 overflow-y-auto scrollbar-hide bg-slate-50/30 dark:bg-slate-900/30">
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Zap size={14} className="text-amber-500" /> আই-ফার্ম স্মার্ট ইনসাইট
                        </h4>
                        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-3">
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                                পণ্যের জন্য রিকমেন্ডেড তাপমাত্রা: <span className="text-emerald-600">{selectedBooking.envDemand.temp}</span>
                            </p>
                            <div className="h-px bg-slate-100 dark:bg-slate-700 w-full" />
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                                বর্তমান ক্যাপাসিটি এনালাইসিস অনুযায়ী <span className="font-black text-slate-800 dark:text-slate-200">Chamber A</span> সবচেয়ে বেশি উপযোগী।
                            </p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">লজিস্টিকস সামারি</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400"><Clock size={14} /></div>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">ভবিষ্যৎ মেয়াদ: {selectedBooking.duration} দিন</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400"><MapPin size={14} /></div>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{selectedBooking.logistics.location}</span>
                            </div>
                        </div>
                     </div>

                     <div className="pt-8">
                        <div className="p-6 bg-emerald-600 rounded-[2rem] text-white shadow-xl shadow-emerald-100 dark:shadow-none">
                            <BarChart3 size={24} className="mb-3 opacity-80" />
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">সম্ভাব্য মুনাফা</p>
                            <h4 className="text-2xl font-black">৳৪,৫০০.০০</h4>
                            <p className="text-[9px] mt-2 font-bold opacity-70">ভিত্তিক: {selectedBooking.duration} দিন স্টোরেজ</p>
                        </div>
                     </div>
                  </div>

                  {/* Right Content: Chamber Selection Grid */}
                  <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       {MOCK_CHAMBERS.map(c => {
                         const bookingQtyInTons = selectedBooking.unit === 'TON' ? selectedBooking.quantity : selectedBooking.quantity / 1000;
                         const projectedAddPercent = (bookingQtyInTons / (c.totalTons || 100)) * 100;
                         const finalCapacity = c.capacity + projectedAddPercent;
                         const isFull = c.capacity >= 98;
                         
                         const bookingIsFish = selectedBooking.crop.toLowerCase().includes('fish') || selectedBooking.crop.toLowerCase().includes('shrimp');
                         const chamberIsFish = (c as any).productCategory === 'Fish';
                         const isIncompatible = bookingIsFish !== chamberIsFish;
                         const isRecommended = !isIncompatible && ((bookingIsFish && c.type === 'Deep Freeze') || (!bookingIsFish && c.type !== 'Deep Freeze'));

                         return (
                           <button 
                             key={c.id}
                             disabled={isFull}
                             onClick={() => setAssignedChamber(c.name)}
                             className={`p-6 rounded-[2.5rem] border-2 text-left transition-all relative overflow-hidden flex flex-col group ${
                               assignedChamber === c.name 
                                 ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10 ring-8 ring-emerald-500/5' 
                                 : isIncompatible 
                                    ? 'border-red-100 dark:border-red-900/30 bg-red-50/10 grayscale-[0.5]' 
                                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                             } ${isFull ? 'opacity-40 cursor-not-allowed' : ''}`}
                           >
                             <div className="flex justify-between items-start mb-6">
                               <div>
                                  <div className="flex items-center gap-2">
                                    <h5 className={`text-xl font-black ${assignedChamber === c.name ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>{c.name}</h5>
                                    {c.type === 'Deep Freeze' ? <Snowflake size={14} className="text-blue-500" /> : <Grid size={14} className="text-emerald-500" />}
                                  </div>
                                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{c.type} Storage</p>
                               </div>

                               {isIncompatible ? (
                                  <div className="bg-red-500 text-white px-3 py-1 rounded-xl flex items-center gap-1.5 animate-pulse">
                                     <ShieldAlert size={12} />
                                     <span className="text-[9px] font-black uppercase">Conflict</span>
                                  </div>
                               ) : isRecommended && (
                                  <div className="bg-emerald-600 text-white px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-100">
                                     <Zap size={12} />
                                     <span className="text-[9px] font-black uppercase">Match</span>
                                  </div>
                               )}
                             </div>

                             <div className="space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                   <span className="text-slate-400">অকুপেন্সি প্রজেকশন</span>
                                   <span className={finalCapacity > 90 ? 'text-red-500' : 'text-emerald-600'}>{finalCapacity.toFixed(1)}%</span>
                                </div>
                                
                                <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex border border-slate-200 dark:border-slate-700">
                                   <div className="h-full bg-slate-400/30" style={{ width: `${c.capacity}%` }} />
                                   <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${projectedAddPercent}%` }}
                                      className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                                   />
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                   <div className="flex flex-col">
                                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">তাপমাত্রা</span>
                                      <span className="text-sm font-black text-slate-800 dark:text-slate-200">{c.temp}°C</span>
                                   </div>
                                   <div className="flex flex-col items-end">
                                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">ফাঁকা স্পেস</span>
                                      <span className="text-sm font-black text-slate-800 dark:text-slate-200">{(c.totalTons || 100) - ((c.capacity/100)*(c.totalTons || 100))}T</span>
                                   </div>
                                </div>
                             </div>

                             {assignedChamber === c.name && (
                                <motion.div layoutId="chamber-check" className="absolute top-0 right-0 p-3 bg-emerald-600 text-white rounded-bl-3xl">
                                    <CheckCircle size={24} />
                                </motion.div>
                             )}
                           </button>
                         );
                       })}
                    </div>
                  </div>
               </div>

               {/* Modal Footer */}
               <div className="p-8 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-slate-400"><Info size={20} /></div>
                     <p className="text-xs font-bold text-slate-500 dark:text-slate-400 max-w-xs">
                        এপ্রুভ করার সাথে সাথে কৃষককে একটি নোটিফিকেশন পাঠানো হবে এবং ইনভয়েস জেনারেট হবে।
                     </p>
                  </div>
                  <div className="flex gap-4 w-full sm:w-auto">
                     <button onClick={() => setShowApproveModal(false)} className="flex-1 sm:flex-none px-10 py-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:bg-slate-100">বাতিল</button>
                     <button onClick={handleApprove} className="flex-1 sm:flex-none px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
                        অনুমোদন কনফার্ম করুন <ChevronRight size={18} />
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
