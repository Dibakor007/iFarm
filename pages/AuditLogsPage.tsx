
import React, { useState, useMemo } from 'react';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';
import { Tabs } from '../components/UI/Tabs';
import { StatusChip } from '../components/StatusChip';
import { MOCK_AUDIT_LOGS, MOCK_DELIVERY_HISTORY } from '../data/dummyData';
import { 
  Clock, Shield, Filter, Search, X, Calendar as CalendarIcon, Tag, User, 
  Database, Truck, MapPin, Package, CreditCard, ChevronRight, Info, CheckCircle, 
  ArrowRight, Download, Eye, FileText, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '../App';

const AuditLogsPage: React.FC = () => {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState('activity');
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);

  const tabs = [
    { id: 'activity', label: 'অ্যাক্টিভিটি লগ', icon: <Database size={16} /> },
    { id: 'delivery', label: 'ডেলিভারি ইতিহাস', icon: <Truck size={16} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">অডিট ও সাপ্লাই চেইন লগ</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">সিস্টেম কার্যক্রম এবং ডেলিভারি ট্র্যাকিং ডাটাবেজ</p>
        </div>
      </div>

      <div className="flex justify-center md:justify-start">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'activity' ? (
            <ActivityLogsTab role={role} />
          ) : (
            <DeliveryHistoryTab 
              role={role} 
              onViewDetails={setSelectedDelivery} 
            />
          )}
        </motion.div>
      </AnimatePresence>

      <DeliveryDetailModal 
        delivery={selectedDelivery} 
        onClose={() => setSelectedDelivery(null)} 
        role={role}
      />
    </div>
  );
};

const ActivityLogsTab = ({ role }: { role: string }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    role: '',
    type: ''
  });

  const eventTypes = ['STOCK', 'BOOKING', 'ALERT', 'PAYMENT', 'SYSTEM', 'LOGISTICS'];
  const roles = ['ADMIN', 'MANAGER', 'TRANSPORT_MANAGER', 'SYSTEM'];

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  const filteredLogs = useMemo(() => {
    return MOCK_AUDIT_LOGS.filter(log => {
      // Role-based visibility logic
      if (role === 'TRANSPORT_MANAGER' && log.type !== 'LOGISTICS') return false;

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        log.action.toLowerCase().includes(searchLower) || 
        log.actor.toLowerCase().includes(searchLower) ||
        (log as any).metadata?.toLowerCase().includes(searchLower);
      
      const matchesRoleFilter = filters.role ? log.actor === filters.role : true;
      const matchesTypeFilter = filters.type ? (log as any).type === filters.type : true;
      
      const logDate = new Date(log.date).getTime();
      const matchesStartDate = filters.startDate ? logDate >= new Date(filters.startDate).getTime() : true;
      const matchesEndDate = filters.endDate ? logDate <= new Date(filters.endDate).getTime() : true;

      return matchesSearch && matchesRoleFilter && matchesTypeFilter && matchesStartDate && matchesEndDate;
    });
  }, [searchTerm, filters, role]);

  const resetFilters = () => {
    setFilters({ startDate: '', endDate: '', role: '', type: '' });
    setSearchTerm('');
  };

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="একশন, ইউজার বা মেটাডাটা দিয়ে খুঁজুন..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-base outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-100 transition-all shadow-sm" 
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${
              activeFilterCount > 0 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
          >
            <Filter size={18} /> 
            ফিল্টার {activeFilterCount > 0 && <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{activeFilterCount}</span>}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }} 
              className="overflow-hidden"
            >
               <div className="p-6 mt-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6 shadow-inner">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">শুরুর তারিখ</label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input 
                          type="date" 
                          value={filters.startDate} 
                          onChange={e => setFilters({...filters, startDate: e.target.value})} 
                          className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">শেষ তারিখ</label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input 
                          type="date" 
                          value={filters.endDate} 
                          onChange={e => setFilters({...filters, endDate: e.target.value})} 
                          className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ইউজার রোল</label>
                      <select 
                        value={filters.role} 
                        onChange={e => setFilters({...filters, role: e.target.value})} 
                        className="w-full px-3 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                      >
                        <option value="">সব রোল</option>
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ইভেন্ট টাইপ</label>
                      <select 
                        value={filters.type} 
                        onChange={e => setFilters({...filters, type: e.target.value})} 
                        className="w-full px-3 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                      >
                        <option value="">সব টাইপ</option>
                        {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={resetFilters}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <RotateCcw size={14} /> ফিল্টার রিসেট করুন
                    </button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-4 mt-8">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, index) => (
            <motion.div 
              key={log.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-colors"
            >
               <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl text-emerald-600 shadow-sm border border-slate-100 dark:border-slate-700"><Shield size={18} /></div>
               <div className="flex-1">
                  <div className="flex justify-between items-start gap-4">
                     <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{log.action}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">{log.time} • {log.date}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                     <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-black uppercase tracking-widest">{log.actor}</span>
                     <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[9px] font-black uppercase tracking-widest">{log.type}</span>
                     {log.metadata && (
                       <span className="flex items-center gap-1 text-[10px] text-slate-400 italic font-medium ml-2">
                         <Info size={10} /> {log.metadata}
                       </span>
                     )}
                  </div>
               </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center space-y-4">
            <Database size={48} className="mx-auto text-slate-200 dark:text-slate-700" />
            <p className="text-slate-400 font-bold">এই ফিল্টার অনুযায়ী কোনো লগ পাওয়া যায়নি</p>
            <button onClick={resetFilters} className="text-emerald-600 text-sm font-bold underline">সব ফিল্টার মুছে ফেলুন</button>
          </div>
        )}
      </div>
    </Card>
  );
};

const DeliveryHistoryTab = ({ role, onViewDetails }: { role: string, onViewDetails: (d: any) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredDeliveries = useMemo(() => {
    return MOCK_DELIVERY_HISTORY.filter(d => {
      // Role-based visibility
      if (role === 'STORAGE_MANAGER' && !d.coldStorageSite.includes('বগুড়া')) return false;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        d.id.toLowerCase().includes(searchLower) ||
        d.suppliedToName.toLowerCase().includes(searchLower) ||
        d.productType.toLowerCase().includes(searchLower)
      );
    });
  }, [searchTerm, role]);

  const columns = [
    { header: 'ID / তারিখ', render: (i: any) => (
      <div>
        <p className="font-mono text-xs font-black text-slate-800 dark:text-slate-100">{i.id}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{i.dateTime.split(' ')[0]}</p>
      </div>
    )},
    { header: 'বায়ার (Supplied To)', render: (i: any) => (
      <div>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{i.suppliedToName}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase">{i.suppliedToType}</p>
      </div>
    )},
    { header: 'পণ্য ও পরিমান', render: (i: any) => (
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">{i.productType}</span>
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{i.quantity}</span>
      </div>
    )},
    { header: 'রুট / ড্রাইভার', render: (i: any) => (
      <div>
        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1"><MapPin size={10} /> {i.route}</p>
        <p className="text-[10px] text-slate-400 mt-1">{i.driverName}</p>
      </div>
    )},
    { header: 'স্ট্যাটাস', render: (i: any) => <StatusChip label={i.deliveryStatus} type={i.deliveryStatus === 'Delivered' ? 'success' : i.deliveryStatus === 'In Transit' ? 'warning' : 'info'} /> },
    { header: 'পেমেন্ট', render: (i: any) => (
      role === 'TRANSPORT_MANAGER' ? <span className="text-[10px] text-slate-300 italic">Protected</span> :
      <StatusChip label={i.paymentStatus} type={i.paymentStatus === 'Paid' ? 'success' : i.paymentStatus === 'Due' ? 'danger' : 'warning'} />
    )},
    { header: 'অ্যাকশন', render: (i: any) => (
      <button 
        onClick={() => onViewDetails(i)}
        className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
      >
        <Eye size={16} />
      </button>
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'মোট ডেলিভারি', value: filteredDeliveries.length, icon: <Package size={20} /> },
           { label: 'ডেলিভারড %', value: '৮৫%', icon: <CheckCircle size={20} /> },
           { label: 'মোট পরিমান', value: '১৬.৫ টন', icon: <Database size={20} /> },
           { label: 'বকেয়া পেমেন্ট', value: '৳৮৫,০০০', icon: <CreditCard size={20} /> },
         ].map((stat, idx) => (
           <Card key={idx} className="border-none shadow-sm bg-white dark:bg-slate-800">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl">{stat.icon}</div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-100">{stat.value}</p>
                 </div>
              </div>
           </Card>
         ))}
      </div>

      <Card title="সাপ্লাই চেইন ডেলিভারি ইতিহাস">
        <div className="mb-6 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="ডেলিভারি ID বা বায়ার দিয়ে খুঁজুন..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <Table 
          data={filteredDeliveries} 
          columns={columns} 
          keyExtractor={i => i.id} 
          exportable 
        />
      </Card>
    </div>
  );
};

const DeliveryDetailModal = ({ delivery, onClose, role }: { delivery: any, onClose: () => void, role: string }) => {
  if (!delivery) return null;

  const isTransport = role === 'TRANSPORT_MANAGER';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
        >
          <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-emerald-600 text-white flex justify-between items-start">
             <div>
                <div className="flex items-center gap-2 mb-2">
                   <div className="p-2 bg-white/10 rounded-xl"><Package size={18} /></div>
                   <h3 className="text-2xl font-black italic">{delivery.id}</h3>
                </div>
                <p className="text-xs text-emerald-100 font-bold uppercase tracking-widest">{delivery.dateTime}</p>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-8">
                <div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">ডেলিভারি টাইমলাইন (Tracking)</h4>
                   <div className="space-y-6 relative">
                      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-700" />
                      {[
                        { label: 'ডেসপ্যাচ (Dispatched)', status: true, time: '১০:৩০ AM' },
                        { label: 'ট্রানজিট (In Transit)', status: delivery.deliveryStatus !== 'Dispatched', time: '১১:১৫ AM' },
                        { label: 'ডেলিভারি (Delivered)', status: delivery.deliveryStatus === 'Delivered', time: '০৩:৩০ PM' }
                      ].map((step, idx) => (
                        <div key={idx} className="flex gap-4 items-center relative z-10">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 ${step.status ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                             {step.status ? <CheckCircle size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                           </div>
                           <div>
                              <p className={`text-sm font-bold ${step.status ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400'}`}>{step.label}</p>
                              {step.status && <p className="text-[10px] text-emerald-600 font-bold">{step.time}</p>}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                   <div className="flex items-center gap-3 mb-3">
                      <Info size={16} className="text-slate-400" />
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">অডিট ইনফরমেশন</h4>
                   </div>
                   <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                     এই ডেলিভারিটি সিস্টেম ম্যানেজার <span className="font-bold text-emerald-600">{delivery.handledBy}</span> দ্বারা সম্পন্ন হয়েছে। অডিট ট্রেইল অনুযায়ী {delivery.id} এ কোনো পরিবর্তন রেকর্ড করা হয়নি।
                   </p>
                </div>
             </div>

             <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                   <DetailCard label="বায়ার প্রোফাইল" value={delivery.suppliedToName} subValue={delivery.suppliedToType} icon={<User size={16} />} />
                   <DetailCard label="স্টোরেজ অরিজিন" value={delivery.coldStorageSite} subValue={`চেম্বার ${delivery.chamber}`} icon={<MapPin size={16} />} />
                   <DetailCard label="ট্রান্সপোর্ট ডিটেইলস" value={delivery.vehicleNo} subValue={delivery.driverName} icon={<Truck size={16} />} />
                </div>

                {!isTransport && (
                  <div className={`p-6 rounded-[2rem] border flex items-center justify-between ${delivery.paymentStatus === 'Paid' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">পেমেন্ট অবস্থা</p>
                        <p className="text-lg font-black mt-1">Status: {delivery.paymentStatus}</p>
                     </div>
                     <FileText size={32} className="opacity-20" />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                   <button className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
                     <Download size={14} /> শিপিং স্লিপ
                   </button>
                   <button className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
                     ইনভয়েস দেখুন <ArrowRight size={14} />
                   </button>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const DetailCard = ({ label, value, subValue, icon }: { label: string, value: string, subValue: string, icon: any }) => (
  <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center gap-4">
     <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl text-slate-400 shadow-sm">{icon}</div>
     <div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{value}</p>
        <p className="text-[10px] text-slate-500 font-medium">{subValue}</p>
     </div>
  </div>
);

export default AuditLogsPage;
