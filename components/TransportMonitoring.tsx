
import React, { useState, useEffect } from 'react';
import { Card } from './UI/Card';
import { mockDb, TransportTrip } from '../data/mockDb';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Navigation, 
  Phone, 
  User,
  ArrowRight,
  Maximize2,
  X,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  PhoneCall,
  Search,
  CheckCircle,
  LocateFixed
} from 'lucide-react';
import { motion as m, AnimatePresence } from 'framer-motion';

// Fix: Cast motion to any to avoid property 'animate', 'layout', 'initial', etc. errors in this environment
const motion = m as any;

const TransportMonitoring: React.FC = () => {
  const [trips, setTrips] = useState<TransportTrip[]>([]);
  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<TransportTrip | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const refreshTrips = () => {
    setTrips(mockDb.getTransports());
  };

  useEffect(() => {
    refreshTrips();
    const interval = setInterval(refreshTrips, 10000); 
    return () => clearInterval(interval);
  }, []);

  const filteredTrips = trips.filter(t => 
    t.from.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeTripsCount = trips.filter(t => t.status !== 'Delivered').length;
  const delayedTripsCount = trips.filter(t => t.status === 'Delayed').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header Section: Standardized Font Sizes */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Truck className="text-emerald-600" size={28} />
            ট্রান্সপোর্ট মনিটরিং
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">লাইভ অবস্থান ও সাপ্লাই চেইন লজিস্টিকস</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setShowNewTripModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all transform active:scale-95"
          >
            <Navigation size={16} /> নতুন ট্রিপ শুরু
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Map & Stats Column */}
        <div className="xl:col-span-8 space-y-6">
          <Card className="h-[400px] md:h-[480px] p-0 relative overflow-hidden group border-none shadow-xl rounded-[2.5rem]">
             <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/90.35,23.81,7,0/1200x800?access_token=pk.placeholder')] bg-cover opacity-70 dark:opacity-40" />
             
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-slate-900/10 pointer-events-none" />
             
             <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                <div className="px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">লাইভ ট্র্যাকিং সক্রিয়</span>
                </div>
                <div className="px-4 py-2 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center gap-2">
                   <LocateFixed size={14} />
                   <span className="text-[10px] font-black uppercase tracking-widest">iFarm গ্লোবাল নেটওয়ার্ক</span>
                </div>
             </div>

             <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                   <motion.div 
                     animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.05, 0.3] }}
                     transition={{ duration: 4, repeat: Infinity }}
                     className="absolute -inset-12 bg-emerald-500 rounded-full blur-3xl"
                   />
                   <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl text-emerald-600 relative z-10 border-4 border-white">
                      <MapPin size={24} />
                   </div>
                </div>
             </div>

             <div className="absolute bottom-6 right-6 flex gap-2">
                <button className="p-3 bg-white dark:bg-slate-800 shadow-xl rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors border border-white/10">
                  <Maximize2 size={18} />
                </button>
             </div>
          </Card>

          {/* Quick Stats: Simplified UX */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="চলমান ট্রাক" value={activeTripsCount.toString()} unit="টি" color="text-blue-600" bg="bg-blue-50" />
            <StatBox label="সময়মতো" value={(activeTripsCount - delayedTripsCount).toString()} unit="টি" color="text-emerald-600" bg="bg-emerald-50" />
            <StatBox label="বিলম্বিত" value={delayedTripsCount.toString()} unit="টি" color="text-amber-600" bg="bg-amber-50" />
            <StatBox label="ডেলিভারি সম্পন্ন" value="০৫" unit="টি" color="text-slate-600" bg="bg-slate-50" />
          </div>
        </div>

        {/* Trip List Sidebar: Refined Scannability */}
        <div className="xl:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">চলমান ট্রিপসমূহ</h3>
            <span className="text-[10px] font-black text-slate-300 uppercase">{filteredTrips.length} Total</span>
          </div>

          <div className="relative">
             <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="রুট বা ড্রাইভার..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
             />
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide pr-1 pb-4">
            <AnimatePresence mode="popLayout">
              {filteredTrips.map((trip) => (
                <motion.div 
                  key={trip.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setEditingTrip(trip)}
                  className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 hover:shadow-xl hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-all cursor-pointer group relative overflow-hidden"
                >
                   <div className="flex justify-between items-start mb-4">
                     <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                       trip.status === 'On-time' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                       trip.status === 'Delayed' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                       'bg-blue-50 text-blue-700 border-blue-100'
                     }`}>
                       {trip.status === 'On-time' ? 'In Time' : trip.status === 'Delayed' ? 'Delayed' : 'Delivered'}
                     </span>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {trip.id}</span>
                   </div>

                   <div className="flex items-center gap-2 mb-5">
                     <div className="flex-1 text-slate-800 dark:text-slate-200 font-black text-xs truncate">{trip.from}</div>
                     <ArrowRight className="text-slate-300" size={14} />
                     <div className="flex-1 text-emerald-600 dark:text-emerald-400 font-black text-xs truncate">{trip.to}</div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Activity size={10} /> Progress</span>
                        <span className="text-slate-700 dark:text-slate-200">{trip.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${trip.progress}%` }}
                          className={`h-full rounded-full ${
                            trip.status === 'Delayed' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          }`}
                        />
                      </div>

                      <div className="pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                           <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 font-black border border-slate-100 dark:border-slate-800 text-[10px]">
                             {trip.driver[0]}
                           </div>
                           <div>
                             <p className="text-[11px] font-black text-slate-800 dark:text-slate-100 leading-tight">{trip.driver}</p>
                             <p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">{trip.vehicle}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <span className="text-[8px] font-black text-slate-400 uppercase block mb-0.5">ETA</span>
                           <span className="text-[10px] font-black text-slate-700 dark:text-slate-200 flex items-center gap-1 justify-end">
                             <Clock size={10} className="text-emerald-500" /> {trip.eta}
                           </span>
                        </div>
                      </div>
                   </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredTrips.length === 0 && (
              <div className="text-center py-10 opacity-40">
                <Truck size={32} className="mx-auto mb-2" />
                <p className="text-xs font-bold uppercase">কোনো ট্রিপ খুঁজে পাওয়া যায়নি</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showNewTripModal && (
          <NewTripModal onClose={() => setShowNewTripModal(false)} onSuccess={refreshTrips} />
        )}
        {editingTrip && (
          <UpdateTripModal trip={editingTrip} onClose={() => setEditingTrip(null)} onSuccess={refreshTrips} />
        )}
      </AnimatePresence>
    </div>
  );
};

const StatBox = ({ label, value, unit, color, bg }: { label: string, value: string, unit: string, color: string, bg: string }) => (
  <div className={`p-5 rounded-[1.75rem] border border-slate-100 dark:border-slate-800 ${bg} dark:bg-slate-800/50 shadow-sm`}>
    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-baseline gap-1">
      <span className={`text-xl font-black ${color} dark:text-slate-100`}>{value}</span>
      <span className="text-[10px] font-bold text-slate-400">{unit}</span>
    </div>
  </div>
);

const NewTripModal = ({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    driver: '',
    driverPhone: '',
    vehicle: '',
    loadType: 'আলু',
    loadWeight: '',
    eta: '০৬:০০ PM'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      mockDb.saveTransport({
        id: `TR-${Math.floor(100 + Math.random() * 900)}`,
        ...formData,
        progress: 0,
        status: 'On-time',
        startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setIsSubmitting(false);
      onSuccess();
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
        className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl relative z-10 overflow-y-auto max-h-[90vh] md:max-h-none border border-white/20"
      >
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <Zap size={16} />
              <span className="text-[9px] font-black uppercase tracking-widest">iFarm ডেসপ্যাচ</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">নতুন ট্রিপ অ্যাসাইন</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X size={24} className="text-slate-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">শুরুর স্থান</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input required type="text" placeholder="যেমন: বগুড়া হাব" className="w-full p-3.5 pl-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm dark:text-slate-100 outline-none focus:border-emerald-500 transition-all" value={formData.from} onChange={e => setFormData({...formData, from: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">গন্তব্য</label>
              <div className="relative">
                <Navigation size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                <input required type="text" placeholder=" যেমন: কারওয়ান বাজার" className="w-full p-3.5 pl-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm dark:text-slate-100 outline-none focus:border-emerald-500 transition-all" value={formData.to} onChange={e => setFormData({...formData, to: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ড্রাইভার</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input required type="text" placeholder="নাম লিখুন" className="w-full p-3.5 pl-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm dark:text-slate-100 outline-none focus:border-emerald-500 transition-all" value={formData.driver} onChange={e => setFormData({...formData, driver: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">যানবাহন নম্বর</label>
              <div className="relative">
                <Truck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input required type="text" placeholder="ঢাকা মেট্রো-ট ১২-৩৪৫৬" className="w-full p-3.5 pl-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm dark:text-slate-100 outline-none focus:border-emerald-500 transition-all" value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">বাতিল</button>
            <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all">
               {isSubmitting ? <RotateCw className="animate-spin" /> : <><CheckCircle2 size={18} /> ট্রিপ কনফার্ম</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const UpdateTripModal = ({ trip, onClose, onSuccess }: { trip: TransportTrip, onClose: () => void, onSuccess: () => void }) => {
  const [progress, setProgress] = useState(trip.progress);
  const [status, setStatus] = useState(trip.status);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = () => {
    setIsSaving(true);
    setTimeout(() => {
      mockDb.updateTransportStatus(trip.id, { progress, status });
      setIsSaving(false);
      onSuccess();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2rem] shadow-2xl relative z-10 overflow-hidden border border-white/20"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-emerald-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/20 rounded-xl"><Truck size={20} /></div>
             <div>
                <h3 className="text-xl font-black italic">ট্রিপ আপডেট: {trip.id}</h3>
                <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-widest">{trip.from} → {trip.to}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">প্রগ্রেস ({progress}%)</label>
             </div>
             <input 
               type="range" 
               min="0" max="100" 
               value={progress} 
               onChange={(e) => setProgress(Number(e.target.value))}
               className="w-full h-2.5 bg-slate-100 dark:bg-slate-900 rounded-full appearance-none accent-emerald-600 cursor-pointer" 
             />
             <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase">
                <span>Origin</span>
                <span>Destination</span>
             </div>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">স্ট্যাটাস পরিবর্তন</label>
             <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'On-time', label: 'সময়মতো', color: 'emerald' },
                  { id: 'Delayed', label: 'বিলম্বিত', color: 'amber' },
                  { id: 'Delivered', label: 'পৌঁছেছে', color: 'blue' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setStatus(s.id as any)}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                      status === s.id 
                        ? `bg-${s.color}-50 dark:bg-${s.color}-900/20 border-${s.color}-500 text-${s.color}-600` 
                        : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-tight">{s.label}</span>
                  </button>
                ))}
             </div>
          </div>

          <div className="flex gap-3 pt-2">
             <button className="flex items-center justify-center gap-2 flex-1 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
                <PhoneCall size={14} /> কল
             </button>
             <button onClick={handleUpdate} disabled={isSaving} className="flex-[2] py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 dark:shadow-none flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all">
                {isSaving ? <RotateCw className="animate-spin" /> : 'আপডেট সেভ'}
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TransportMonitoring;
