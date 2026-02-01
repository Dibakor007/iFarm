
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from './UI/Card';
import { Tabs } from './UI/Tabs';
import { Table } from './UI/Table';
import { StatusChip } from './StatusChip';
import { MOCK_STOCK, MOCK_SENSORS, MOCK_CHAMBERS, MOCK_RULES, MOCK_INVOICES, MOCK_COMPLIANCE } from '../data/dummyData';
import { mockDb } from '../data/mockDb';
import type { BookingRequest } from '../data/mockDb';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Thermometer,
  AlertTriangle,
  FileText,
  Grid,
  Calendar,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Info,
  ArrowRight,
  User,
  Package,
  Snowflake,
  Activity,
  X,
  PlusCircle,
  Zap,
  Wallet,
  TrendingUp,
  ShieldAlert,
  FilterX,
  HeartPulse,
  Coins,
  Check,
  Layers,
  Wind,
  MessageCircle,
  Send,
  Droplets,
  ArrowUp,
  ArrowDown,
  Fan,
  Power,
  RotateCw,
  Sparkles,
  BarChart3,
  QrCode,
  ArrowRightCircle,
  TrendingDown,
  LayoutGrid
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ReferenceArea,
  BarChart,
  Bar,
  Cell,
  Legend as ReLegend
} from 'recharts';
import { useRole } from '../App';
import { can } from '../security/permissions';
import { useSettings } from '../context/SettingsContext';
import BookingSystem from './ColdStorage/BookingSystem';

// Fix: Cast motion to any to avoid property 'initial', 'animate', etc. errors in this environment
const motion = m as any;
// Fix: Recharts ReferenceArea typing mismatch in this environment
const ReferenceAreaAny = ReferenceArea as any;

type TabId = 'inventory' | 'booking' | 'chambers' | 'sensors' | 'humidity' | 'invoices' | 'compliance';

const HUMIDITY_THRESHOLDS: Record<string, { min: number, max: number, label: string, color: string }> = {
  'Potato': { min: 85, max: 92, label: 'আলু (Potato)', color: '#10b981' },
  'Onion': { min: 65, max: 75, label: 'পেঁয়াজ (Onion)', color: '#f59e0b' },
  'Tomato': { min: 85, max: 90, label: 'টমেটো (Tomato)', color: '#ef4444' },
  'Fish': { min: 40, max: 55, label: 'মাছ (Fish/Deep Freeze)', color: '#3b82f6' },
  'General': { min: 60, max: 90, label: 'সাধারণ', color: '#64748b' }
};

const ColdStorage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('inventory');
  const [showStockInForm, setShowStockInForm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [chamberFilter, setChamberFilter] = useState<string | null>(null);
  const { role } = useRole();
  const location = useLocation();

  const tabs = useMemo(() => ([
    { id: 'inventory', label: 'ইনভেন্টরি', icon: <Search size={18} /> },
    { id: 'booking', label: 'বুকিং ও রিকোয়েস্ট', icon: <Calendar size={18} /> },
    { id: 'chambers', label: 'চেম্বার ভিউ', icon: <Grid size={18} /> },
    { id: 'humidity', label: 'আর্দ্রতা মনিটরিং', icon: <Droplets size={18} /> },
    { id: 'sensors', label: 'সেন্সর ও রুলস', icon: <Thermometer size={18} /> },
    { id: 'invoices', label: 'ইনভয়েস', icon: <FileText size={18} /> },
    { id: 'compliance', label: 'কমপ্লায়েন্স', icon: <ShieldCheck size={18} /> },
  ].filter(t => {
    if (role === 'FARMER' && ['sensors', 'compliance', 'invoices', 'humidity'].includes(t.id)) return false;
    if (role === 'TRANSPORT_MANAGER') return false;
    return true;
  })), [role]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab') as TabId | null;
    const chamberParam = params.get('chamber');

    const allowedTabs = tabs.map(t => t.id);
    if (tabParam && allowedTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }

    if (chamberParam) {
      setChamberFilter(chamberParam);
      setActiveTab('inventory');
    }
  }, [location.search, tabs]);

  const handleViewChamberInventory = (chamberName: string) => {
    setChamberFilter(chamberName);
    setActiveTab('inventory');
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">কোল্ড স্টোরেজ ম্যানেজমেন্ট</h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium tracking-tight mt-2">সাপ্লাই চেইন লজিস্টিকস এবং স্টোরেজ কন্ট্রোল</p>
        </div>
        
        {role === 'FARMER' && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowContactModal(true)}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 border-2 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-base uppercase tracking-widest shadow-lg shadow-emerald-50/50 dark:shadow-none transition-all"
          >
            <MessageCircle size={22} /> ম্যানেজারের সাথে কথা বলুন
          </motion.button>
        )}
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'inventory' && (
            <InventoryView 
              onNewStock={() => setShowStockInForm(true)} 
              chamberFilter={chamberFilter}
              onClearFilter={() => setChamberFilter(null)}
            />
          )}
          {activeTab === 'booking' && <BookingSystem />}
          {activeTab === 'chambers' && <ChambersView onViewInventory={handleViewChamberInventory} />}
          {activeTab === 'humidity' && <HumidityMonitoringView />}
          {activeTab === 'sensors' && <SensorsAndRulesView />}
          {activeTab === 'invoices' && <InvoicesView />}
          {activeTab === 'compliance' && <ComplianceView />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showStockInForm && (
          <StockInModal onClose={() => setShowStockInForm(false)} />
        )}
        {showContactModal && (
          <ContactManagerModal onClose={() => setShowContactModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const InventoryView = ({ onNewStock, chamberFilter, onClearFilter }: { onNewStock: () => void, chamberFilter: string | null, onClearFilter: () => void }) => {
  const { role } = useRole();
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const isManager = role === 'ADMIN' || role === 'STORAGE_MANAGER';
  const hasWrite = can(role, 'cold_storage', 'WRITE');

  const calculateCalculations = (item: any) => {
    const entry = new Date(item.entryDate);
    const today = new Date();
    const expiry = new Date(item.expiryDate);
    
    // Core timing logic
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysSoFar = Math.max(1, Math.ceil((today.getTime() - entry.getTime()) / msPerDay));
    const totalDays = Math.max(1, Math.ceil((expiry.getTime() - entry.getTime()) / msPerDay));
    const daysRemaining = Math.max(0, Math.ceil((expiry.getTime() - today.getTime()) / msPerDay));
    
    // Freshness decay (simple linear for demo)
    let freshness = Math.max(0, Math.round(100 - (daysSoFar / totalDays * 100)));
    
    const chamberInfo = MOCK_CHAMBERS.find(c => c.name === item.chamber);
    const liveHumidity = chamberInfo ? chamberInfo.humidity : 0;
    const liveTemp = chamberInfo ? chamberInfo.temp : 0;

    // RENT CALCULATION - Robust Parsing
    const qtyParts = item.quantity.split(' ');
    const qtyNumeric = parseFloat(qtyParts[0]) || 0;
    const qtyKg = item.quantity.includes('টন') ? qtyNumeric * 1000 : qtyNumeric;
    
    // Rate logic with fallback to ensure no NaN
    const cropType = item.product.includes('আলু') ? 'Potato' : item.product.includes('পেঁয়াজ') ? 'Onion' : 'General';
    const baseRate = settings?.storageConfig?.rentRate || 2.5;
    const ratePerDay = (settings?.storageConfig?.specialRates?.[cropType]) || baseRate;
    
    const accruedRent = qtyKg * ratePerDay * daysSoFar;
    const totalProjectedRent = qtyKg * ratePerDay * totalDays;

    // Status logic
    let autoStatus: 'Good' | 'Warning' | 'Critical' = 'Good';
    if (freshness < 40 || daysRemaining < 7) autoStatus = 'Critical';
    else if (freshness < 70 || liveHumidity > 95) autoStatus = 'Warning';

    return {
      freshness,
      daysSoFar,
      daysRemaining,
      liveHumidity,
      liveTemp,
      isExpiringSoon: daysRemaining <= settings.storageConfig.alertDays && daysRemaining > 0,
      autoStatus,
      accruedRent,
      totalProjectedRent,
      ratePerDay,
      qtyKg
    };
  };

  const STOCK_OWNERS: Record<string, string> = {
    '1': 'মোঃ আব্দুর রহিম',
    '2': 'করিম শেখ',
    '3': 'মোঃ আব্দুর রহিম',
    '4': 'আব্দুল কাদের'
  };

  const inventoryFiltered = useMemo(() => {
    let filtered = MOCK_STOCK.map(item => ({
      ...item,
      owner: STOCK_OWNERS[item.id] || 'অজানা মালিক'
    }));
    
    if (role === 'FARMER') filtered = filtered.filter(item => item.owner === 'মোঃ আব্দুর রহিম');
    if (chamberFilter) filtered = filtered.filter(item => item.chamber === chamberFilter);
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.product.toLowerCase().includes(lowerSearch) || 
        (isManager && item.owner.toLowerCase().includes(lowerSearch))
      );
    }
    return filtered.map(item => ({ ...item, ...calculateCalculations(item) }));
  }, [settings, chamberFilter, role, searchTerm, isManager]);

  const columns = [
    { header: 'পণ্য (Product)', render: (i: any) => (
      <div className="flex items-center gap-4 md:gap-5 min-w-[240px]">
        <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 shadow-sm ${i.type === 'Fish' ? 'text-blue-500' : 'text-emerald-600'}`}>
          {i.type === 'Fish' ? <Snowflake size={24} /> : <Package size={24} />}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-black text-slate-800 dark:text-slate-100 text-lg leading-none">{i.product}</p>
            {i.isExpiringSoon && (
              <div className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>{i.type}</span>
            <span className="h-1 w-1 rounded-full bg-slate-200" />
            <span className="text-emerald-600">{i.chamber}</span>
          </div>
        </div>
      </div>
    )},
    ...(isManager ? [{
      header: 'মালিক / কৃষক',
      render: (i: any) => (
        <div className="flex items-center gap-3 min-w-[160px]">
          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
            <User size={16} className="text-slate-500" />
          </div>
          <span className="text-sm font-black text-slate-700 dark:text-slate-300 truncate">{i.owner}</span>
        </div>
      )
    }] : []),
    { header: 'পরিমান', render: (i: any) => (
      <div className="min-w-[100px]">
        <p className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">{i.quantity.split(' ')[0]}</p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{i.quantity.split(' ')[1]}</p>
      </div>
    )},
    { header: 'আর্দ্রতা', render: (i: any) => (
      <div className="flex flex-col min-w-[120px] space-y-2">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <Droplets size={14} />
            <span className="text-lg font-black tracking-tighter">{i.liveHumidity}%</span>
          </div>
        </div>
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${i.liveHumidity}%` }} className={`h-full ${i.liveHumidity > 60 && i.liveHumidity < 90 ? 'bg-blue-500' : 'bg-amber-500'}`} />
        </div>
      </div>
    )},
    { header: 'সজীবতা', render: (i: any) => (
      <div className="flex flex-col min-w-[120px] space-y-2">
        <div className="flex items-center justify-between">
           <div className={`flex items-center gap-1.5 ${i.freshness > 70 ? 'text-emerald-600' : i.freshness > 40 ? 'text-amber-600' : 'text-red-600'}`}>
             <HeartPulse size={14} />
             <span className="text-lg font-black tracking-tighter">{i.freshness}%</span>
           </div>
        </div>
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${i.freshness}%` }} className={`h-full ${i.freshness > 70 ? 'bg-emerald-500' : i.freshness > 40 ? 'bg-amber-500' : 'bg-red-500'}`} />
        </div>
      </div>
    )},
    { header: 'অবস্থা', render: (i: any) => (
      <div className="flex flex-col gap-2 min-w-[120px]">
         <StatusChip label={i.autoStatus} type={i.autoStatus === 'Good' ? 'success' : i.autoStatus === 'Warning' ? 'warning' : 'danger'} />
      </div>
    ) }
  ];

  return (
    <div className="space-y-10 md:space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
        <Card className="border-none shadow-lg bg-white dark:bg-slate-800 p-6">
           <div className="flex items-center gap-5">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl">
                <HeartPulse size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">গড় ইনভেন্টরি সজীবতা</p>
                <h3 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 mt-1 tracking-tighter">৮২.৫%</h3>
              </div>
           </div>
        </Card>
        <Card className="border-none shadow-lg bg-white dark:bg-slate-800 p-6">
           <div className="flex items-center gap-5">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl">
                <ShieldAlert size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ঝুঁকিপূর্ণ স্টক (Risk)</p>
                <h3 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 mt-1 tracking-tighter">০৩ টি</h3>
              </div>
           </div>
        </Card>
      </div>

      <div className="space-y-6 md:space-y-10">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 group">
            <div className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
              <Search size={24} />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isManager ? "পণ্য বা কৃষকের নাম..." : "আপনার পণ্য..."}
              className="w-full pl-16 md:pl-20 pr-12 md:pr-16 py-6 md:py-8 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2.5rem] md:rounded-[3.5rem] font-bold text-lg md:text-2xl text-slate-900 dark:text-slate-100 shadow-sm outline-none focus:border-emerald-500 transition-all"
            />
          </div>
          
          <div className="flex gap-4 flex-wrap">
            {chamberFilter && (
              <button 
                onClick={onClearFilter}
                className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-black uppercase tracking-widest transition-all border-2 border-red-100 dark:border-red-900/40"
              >
                <FilterX size={20} /> {chamberFilter} মুছুন
              </button>
            )}
            {hasWrite && (
              <button 
                onClick={onNewStock}
                className="flex-1 lg:flex-none flex items-center justify-center gap-4 px-12 py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2.5rem] text-base font-black uppercase tracking-[0.15em] transition-all shadow-2xl shadow-emerald-100 dark:shadow-none"
              >
                <PlusCircle size={24} /> স্টক ইন
              </button>
            )}
          </div>
        </div>

        <Card title={role === 'FARMER' ? 'আমার পণ্য তালিকা' : 'স্টক ইনভেন্টরি ট্র্যাকিং'} subtitle="যেকোনো সারিতে ক্লিক করে বিস্তারিত এবং ভাড়া (Rent) দেখুন">
          <Table 
            data={inventoryFiltered} 
            columns={columns} 
            keyExtractor={i => i.id} 
            exportable 
            searchable={false} 
            onRowClick={(item) => setSelectedItem(item)}
          />
        </Card>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <InventoryDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} isManager={isManager} />
        )}
      </AnimatePresence>
    </div>
  );
};

const InventoryDetailModal = ({ item, onClose, isManager }: { item: any, onClose: () => void, isManager: boolean }) => {
  const freshnessStatus = useMemo(() => {
    if (item.freshness > 80) return { label: 'Excellent', color: 'emerald', message: 'পণ্যটি বর্তমানে সেরা অবস্থায় আছে। আগামী ৪৫ দিনের মধ্যে বাজারজাত করার পরামর্শ দেওয়া হচ্ছে।' };
    if (item.freshness > 50) return { label: 'Good', color: 'blue', message: 'পণ্যটির সজীবতা সন্তোষজনক। তবে পরবর্তী ৩০ দিনের মধ্যে স্টক ছাড়ার ব্যবস্থা নিন।' };
    if (item.freshness > 20) return { label: 'Caution', color: 'amber', message: 'পণ্যটির মান কমতে শুরু করেছে। ১৫ দিনের মধ্যে লোড-アウト করা জরুরি।' };
    return { label: 'Risk', color: 'red', message: 'পণ্যটি পচনের উচ্চ ঝুঁকিতে রয়েছে! এখনই প্রয়োজনীয় ব্যবস্থা গ্রহণ করুন।' };
  }, [item.freshness]);

  // Ensure accruedRent and totalProjectedRent are numbers
  const currentRent = parseFloat(item.accruedRent) || 0;
  const projectedRent = parseFloat(item.totalProjectedRent) || 0;
  const progressRatio = projectedRent > 0 ? (currentRent / projectedRent) : 0;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="bg-white dark:bg-slate-800 w-full max-w-6xl rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] relative z-10 overflow-hidden border border-white/10"
      >
        {/* Header Section */}
        <div className={`p-10 md:p-14 flex justify-between items-start text-white relative overflow-hidden ${item.type === 'Fish' ? 'bg-gradient-to-r from-blue-700 to-blue-500' : 'bg-gradient-to-r from-emerald-700 to-emerald-500'}`}>
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            {item.type === 'Fish' ? <Snowflake size={250} /> : <Package size={250} />}
          </div>
          <div className="relative z-10 flex flex-col gap-4">
             <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">ID: {item.id}</span>
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" /> Live Tracker Active
                </span>
             </div>
             <div className="space-y-1">
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic drop-shadow-sm">{item.product}</h2>
               <p className="text-lg md:text-2xl font-bold opacity-90 flex items-center gap-3">
                 <User size={24} className="opacity-70" /> {item.owner} এর মজুদকৃত পণ্য
               </p>
             </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white/10 hover:bg-white/20 rounded-[1.75rem] transition-all relative z-10 shadow-lg border border-white/10 group">
            <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-10 md:p-14 max-h-[70vh] overflow-y-auto scrollbar-hide bg-white dark:bg-slate-800">
           {/* Left Content Area */}
           <div className="lg:col-span-8 space-y-10">
              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 <QuickInfo label="পরিমান" value={item.quantity} icon={<Package size={20} />} />
                 <QuickInfo label="চেম্বার" value={item.chamber} icon={<LayoutGrid size={20} />} />
                 <QuickInfo label="প্রবেশ" value={item.entryDate} icon={<Calendar size={20} />} />
                 <QuickInfo label="মেয়াদ শেষ" value={item.expiryDate} icon={<Clock size={20} />} />
              </div>

              {/* Rent Summary Card */}
              <div className="p-10 md:p-12 bg-slate-50 dark:bg-slate-900/60 rounded-[3rem] border border-slate-100 dark:border-slate-800 relative group">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Wallet size={120} />
                 </div>
                 
                 <div className="flex items-center justify-between mb-10">
                    <div className="space-y-2">
                       <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3 italic">
                          <Wallet className="text-emerald-500" size={28} /> ভাড়া সামারি (Rent Summary)
                       </h4>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">আজ পর্যন্ত অটোমেটেড হিসাব</p>
                    </div>
                    <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl shadow-xl text-emerald-600 border border-slate-100 dark:border-slate-700">
                       <Coins size={36} />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                       <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Activity size={12} /> মোট অর্জিত ভাড়া
                          </p>
                          <h3 className="text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tighter tabular-nums flex items-baseline gap-2">
                            <span className="text-3xl text-slate-300">৳</span>
                            {currentRent.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </h3>
                       </div>
                       <div className="flex gap-4">
                          <div className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">স্টোরেজ দিন</p>
                             <p className="text-lg font-black text-emerald-600">{item.daysSoFar || 0} দিন</p>
                          </div>
                          <div className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">রেট (কেজি/দিন)</p>
                             <p className="text-lg font-black text-emerald-600">৳{item.ratePerDay || 0}</p>
                          </div>
                       </div>
                    </div>

                    <div className="p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-2xl space-y-6 relative overflow-hidden">
                       <div className="flex justify-between items-center relative z-10">
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ভবিষ্যৎ প্রজেকশন</h5>
                          <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-900 text-[8px] font-black text-slate-400 rounded border border-slate-100">Estimated</span>
                       </div>
                       
                       <div className="relative z-10">
                          <p className="text-sm font-bold text-slate-500 mb-2">মেয়াদ পর্যন্ত মোট ভাড়া হতে পারে:</p>
                          <p className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">৳{projectedRent.toLocaleString('bn-BD')}</p>
                       </div>

                       <div className="space-y-2 relative z-10">
                          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-50">
                             <motion.div 
                               initial={{ width: 0 }} 
                               animate={{ width: `${Math.min(100, progressRatio * 100)}%` }} 
                               className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" 
                             />
                          </div>
                          <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                             <span>Current: {Math.round(progressRatio * 100)}%</span>
                             <span>Target: 100%</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Sensors Monitoring */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-8 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">লাইভ এনভায়রনমেন্ট</h5>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-700/50">
                          <div className="flex items-center gap-3">
                             <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl"><Thermometer size={20} /></div>
                             <span className="text-sm font-bold text-slate-600 dark:text-slate-300">তাপমাত্রা</span>
                          </div>
                          <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{item.liveTemp}°C</span>
                       </div>
                       <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-700/50">
                          <div className="flex items-center gap-3">
                             <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl"><Droplets size={20} /></div>
                             <span className="text-sm font-bold text-slate-600 dark:text-slate-300">আর্দ্রতা</span>
                          </div>
                          <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{item.liveHumidity}%</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="p-8 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl mb-6 group border border-slate-100 dark:border-slate-700 transition-all hover:scale-105">
                       <QrCode size={72} className="text-slate-800 dark:text-slate-100" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Digital Stock Tag</p>
                    <p className="text-xs font-bold text-slate-500 max-w-[180px] leading-relaxed">এই কোডটি স্ক্যান করে যেকোনো সময় স্টক ভেরিফিকেশন বা মুভমেন্ট সম্পন্ন করুন।</p>
                 </div>
              </div>
           </div>

           {/* Right Sidebar - Freshness Index & Actions */}
           <div className="lg:col-span-4 space-y-10">
              <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-xl text-center flex flex-col items-center">
                 <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">সজীবতা ইনডেক্স</h4>
                 <div className="relative mb-10">
                    <svg className="w-48 h-48 transform -rotate-90">
                       <circle cx="96" cy="96" r="84" className="stroke-slate-100 dark:stroke-slate-900 fill-none" strokeWidth="18" />
                       {/* Corrected duplicate className attribute by merging them into one template literal */}
                       <motion.circle 
                         cx="96" cy="96" r="84" 
                         className={`fill-none shadow-lg stroke-${freshnessStatus.color}-500`}
                         strokeWidth={18} 
                         strokeDasharray="528" 
                         initial={{ strokeDashoffset: 528 }} 
                         animate={{ strokeDashoffset: 528 - (528 * (item.freshness/100)) }}
                         transition={{ duration: 2, ease: "easeOut" }} 
                         strokeLinecap="round"
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center rotate-90">
                       <span className="text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">{item.freshness}%</span>
                       <span className={`text-[10px] font-black uppercase tracking-widest mt-1 text-${freshnessStatus.color}-500`}>{freshnessStatus.label}</span>
                    </div>
                 </div>
                 <div className={`p-6 rounded-3xl bg-${freshnessStatus.color}-50 dark:bg-${freshnessStatus.color}-900/10 border-2 border-${freshnessStatus.color}-100 dark:border-${freshnessStatus.color}-900/30`}>
                   <p className={`text-sm font-bold leading-relaxed text-${freshnessStatus.color}-700 dark:text-${freshnessStatus.color}-400 italic`}>
                    "{freshnessStatus.message}"
                   </p>
                 </div>
              </div>

              <div className="space-y-5">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">অ্যাকশন সেন্টার (Actions)</h4>
                 <div className="grid grid-cols-1 gap-4">
                    <ActionButton icon={<Download size={20} />} label="ইনভয়েস ডাউনলোড" theme="dark" />
                    <ActionButton icon={<ArrowRightCircle size={20} />} label="রিলিজ রিকোয়েস্ট পাঠান" theme="emerald" />
                    <ActionButton icon={<ShieldAlert size={20} />} label="সমস্যা রিপোর্ট করুন" theme="danger" />
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

const QuickInfo = ({ label, value, icon }: { label: string, value: string, icon: any }) => (
  <div className="p-6 bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700/50 rounded-[2rem] shadow-sm flex flex-col gap-3 transition-all hover:border-emerald-500/40 hover:shadow-lg">
     <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400">
        {icon}
     </div>
     <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-base font-black text-slate-800 dark:text-slate-100 truncate tracking-tight">{value}</p>
     </div>
  </div>
);

const ActionButton = ({ icon, label, theme }: { icon: any, label: string, theme: 'dark' | 'emerald' | 'danger' }) => {
  const styles = {
    dark: 'bg-slate-900 text-white hover:bg-black',
    emerald: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
  };

  return (
    <button className={`w-full p-6 rounded-[2rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-between transition-all group ${styles[theme]}`}>
      {label} <span className="group-hover:translate-x-1 transition-transform">{icon}</span>
    </button>
  );
};

const HumidityMonitoringView = () => {
  const [selectedChamber, setSelectedChamber] = useState(MOCK_CHAMBERS[0]);
  
  // Generating synthetic historical data for all chambers to show in the chart
  const [humidityHistory, setHumidityHistory] = useState(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = (new Date().getHours() - (23 - i) + 24) % 24;
      const data: any = { time: `${hour}:00` };
      MOCK_CHAMBERS.forEach(c => {
        // Base humidity with some random historical variation
        data[c.name] = c.humidity + (Math.random() * 8 - 4);
      });
      return data;
    });
  });

  // Effect to simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHumidityHistory(prev => {
        const newData = [...prev];
        const lastRow = { ...newData[newData.length - 1] };
        
        MOCK_CHAMBERS.forEach(c => {
          const jitter = (Math.random() * 1.5 - 0.75);
          lastRow[c.name] = Math.min(100, Math.max(20, Number(lastRow[c.name] + jitter)));
        });
        
        newData[newData.length - 1] = lastRow;
        return newData;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentReading = Number(humidityHistory[humidityHistory.length - 1][selectedChamber.name]).toFixed(1);

  const currentThreshold = useMemo(() => {
    const chamberItems = selectedChamber.items.join(' ');
    if (chamberItems.includes('মাছ')) return HUMIDITY_THRESHOLDS['Fish'];
    if (chamberItems.includes('আলু')) return HUMIDITY_THRESHOLDS['Potato'];
    if (chamberItems.includes('পেঁয়াজ')) return HUMIDITY_THRESHOLDS['Onion'];
    if (chamberItems.includes('টমেটো')) return HUMIDITY_THRESHOLDS['Tomato'];
    return HUMIDITY_THRESHOLDS['General'];
  }, [selectedChamber]);

  const chamberColors: Record<string, string> = {
    'Chamber A': '#10b981',
    'Chamber B': '#3b82f6',
    'Chamber C': '#f59e0b',
    'Chamber D (Freezer)': '#ef4444'
  };

  const isOutOfRange = Number(currentReading) < currentThreshold.min || Number(currentReading) > currentThreshold.max;

  return (
    <div className="space-y-10 md:space-y-14">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 md:gap-10">
        <div className="xl:col-span-3 space-y-8 md:space-y-10">
           {/* Summary Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none shadow-lg bg-white dark:bg-slate-800 p-8">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">বর্তমান আর্দ্রতা (Selected)</p>
                 <div className="flex items-end gap-3">
                    <h3 className={`text-5xl font-black tracking-tighter ${isOutOfRange ? 'text-red-500' : 'text-emerald-600'}`}>{currentReading}%</h3>
                    <div className={`mb-2 px-2 py-0.5 rounded text-[10px] font-black uppercase ${isOutOfRange ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                       {isOutOfRange ? 'Warning' : 'Stable'}
                    </div>
                 </div>
              </Card>
              <Card className="border-none shadow-lg bg-white dark:bg-slate-800 p-8">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">আদর্শ সীমা (Target)</p>
                 <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">{currentThreshold.min}-{currentThreshold.max}%</h3>
                 <p className="text-xs font-bold text-slate-500 mt-2">{currentThreshold.label} এর জন্য নির্ধারিত</p>
              </Card>
              <Card className="border-none shadow-lg bg-white dark:bg-slate-800 p-8">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">গড় আর্দ্রতা (২৪ ঘণ্টা)</p>
                 <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">৮৬.৪%</h3>
                 <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase mt-2">
                    <ArrowDown size={12} /> ১.২% হ্রাস পেয়েছে
                 </div>
              </Card>
           </div>

           {/* Trend Chart */}
           <Card 
             title="আর্দ্রতা ট্রেন্ড বিশ্লেষণ (Spline Area Analysis)" 
             subtitle="গত ২৪ ঘণ্টার চেম্বার ভিত্তিক আর্দ্রতার ওঠানামা"
             actions={
                <div className="flex items-center gap-4">
                   <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center gap-3 border border-blue-100">
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Live Streaming</span>
                   </div>
                </div>
             }
           >
              <div className="h-[450px] w-full mt-8 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={humidityHistory} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                       <defs>
                          {MOCK_CHAMBERS.map(c => (
                            <linearGradient key={`grad-${c.id}`} id={`color-${c.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={chamberColors[c.name]} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={chamberColors[c.name]} stopOpacity={0}/>
                            </linearGradient>
                          ))}
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis 
                         dataKey="time" 
                         stroke="#94a3b8" 
                         fontSize={12} 
                         tickLine={false} 
                         axisLine={false}
                         interval={2} 
                         tick={{fontWeight: 'bold'}}
                       />
                       <YAxis 
                         stroke="#94a3b8" 
                         domain={[20, 100]} 
                         fontSize={12} 
                         tickLine={false} 
                         axisLine={false} 
                         tick={{fontWeight: 'bold'}}
                       />
                       <Tooltip 
                         contentStyle={{ 
                           borderRadius: '24px', 
                           border: 'none', 
                           boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                           padding: '16px 24px'
                         }} 
                         itemStyle={{ fontWeight: 'black', fontSize: '14px' }}
                         labelStyle={{ fontWeight: 'black', marginBottom: '8px', fontSize: '14px' }}
                       />
                       <ReLegend 
                         verticalAlign="top" 
                         align="right" 
                         iconType="circle" 
                         wrapperStyle={{ paddingBottom: '20px', fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px' }} 
                       />
                       
                       {/* Selected Threshold Reference Area */}
                       <ReferenceAreaAny 
                         y1={currentThreshold.min} 
                         y2={currentThreshold.max} 
                         stroke={currentThreshold.color}
                         strokeOpacity={0.3}
                         fillOpacity={0.08} 
                         label={{ position: 'insideTopRight', value: 'Optimal Zone', fill: currentThreshold.color, fontSize: 10, fontWeight: 'black' }}
                       />

                       {MOCK_CHAMBERS.map((c) => (
                         <Area 
                           key={c.id}
                           name={c.name}
                           type="monotone" 
                           dataKey={c.name} 
                           stroke={chamberColors[c.name]} 
                           strokeWidth={selectedChamber.name === c.name ? 5 : 2} 
                           fillOpacity={1} 
                           fill={`url(#color-${c.id})`} 
                           animationDuration={1500} 
                           hide={selectedChamber.name !== c.name && false} // Show all by default
                           strokeOpacity={selectedChamber.name === c.name ? 1 : 0.3}
                         />
                       ))}
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>
        </div>

        <div className="space-y-8">
           <Card title="স্মার্ট কন্ট্রোল স্ট্যাটাস">
              <div className="space-y-6">
                 <div className={`p-6 rounded-[2.5rem] border-2 transition-all flex items-start gap-5 ${Number(currentReading) > currentThreshold.max ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-50 dark:border-slate-800 opacity-60'}`}>
                    <div className={`p-4 rounded-xl ${Number(currentReading) > currentThreshold.max ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-slate-200 text-slate-400'}`}>
                       <Fan size={24} className={Number(currentReading) > currentThreshold.max ? 'animate-spin' : ''} />
                    </div>
                    <div>
                       <h5 className="font-black text-slate-800 dark:text-slate-100 text-sm uppercase">Dehumidifier</h5>
                       <p className="text-[10px] text-slate-500 mt-2 leading-relaxed font-bold italic">
                         {Number(currentReading) > currentThreshold.max ? 'আর্দ্রতা কমাতে অটো-ফ্যান সক্রিয়।' : 'চেম্বার আর্দ্রতা স্বাভাবিক আছে।'}
                       </p>
                    </div>
                 </div>

                 <div className={`p-6 rounded-[2.5rem] border-2 transition-all flex items-start gap-5 ${Number(currentReading) < currentThreshold.min ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-slate-50 dark:border-slate-800 opacity-60'}`}>
                    <div className={`p-4 rounded-xl ${Number(currentReading) < currentThreshold.min ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-200 text-slate-400'}`}>
                       <Droplets size={24} />
                    </div>
                    <div>
                       <h5 className="font-black text-slate-800 dark:text-slate-100 text-sm uppercase">Humidifier</h5>
                       <p className="text-[10px] text-slate-500 mt-2 leading-relaxed font-bold italic">
                         {Number(currentReading) < currentThreshold.min ? 'আর্দ্রতা বাড়াতে অটো-স্প্রে সক্রিয়।' : 'আর্দ্রতা কমে গেলে সক্রিয় হবে।'}
                       </p>
                    </div>
                 </div>
              </div>
           </Card>

           <Card title="চেম্বার নির্বাচন করুন">
              <div className="space-y-4">
                 {MOCK_CHAMBERS.map((chamber) => {
                   const isSelected = selectedChamber.id === chamber.id;
                   const color = chamberColors[chamber.name];
                   const liveVal = Number(humidityHistory[humidityHistory.length-1][chamber.name]).toFixed(0);
                   return (
                     <button 
                       key={chamber.id}
                       onClick={() => setSelectedChamber(chamber)}
                       className={`w-full p-5 rounded-[2.25rem] border-2 text-left transition-all group ${
                         isSelected 
                           ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 shadow-lg' 
                           : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 shadow-sm'
                       }`}
                     >
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                             <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: color }} />
                             <div>
                                <h5 className="font-black text-base text-slate-800 dark:text-slate-100">{chamber.name}</h5>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">{chamber.items[0]}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <span className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">{liveVal}%</span>
                          </div>
                       </div>
                     </button>
                   );
                 })}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

const SensorsAndRulesView = () => {
  const tempHistory = [
    { time: '১২ AM', val: 4.1 }, { time: '০২ AM', val: 4.2 }, { time: '০৪ AM', val: 4.0 },
    { time: '০৬ AM', val: 4.3 }, { time: '০৮ AM', val: 4.5 }, { time: '১০ AM', val: 4.2 },
    { time: '১২ PM', val: 4.1 }, { time: '০২ PM', val: 4.0 }, { time: '০৪ PM', val: 4.2 },
    { time: '০৬ PM', val: 4.4 }, { time: '০৮ PM', val: 4.3 }, { time: '১০ PM', val: 4.2 },
  ];

  return (
    <div className="space-y-10">
      <Card title="তাপমাত্রা বিশ্লেষণ (২৪ ঘণ্টা)">
         <div className="h-[350px] w-full mt-6 px-2">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={tempHistory}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tick={{fontWeight: 'bold'}} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} tick={{fontWeight: 'bold'}} />
                  <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', padding: '20px 24px' }} formatter={(value: any) => [`${value}°C`, 'তাপমাত্রা']} />
                  <Line type="monotone" dataKey="val" stroke="#10b981" strokeWidth={5} dot={{ fill: '#10b981', r: 6 }} animationDuration={2000} />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        <Card title="লাইভ সেন্সর ডাটা">
           <div className="space-y-6">
             {MOCK_SENSORS.map(s => (
               <div key={s.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-6">
                     <div className={`p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-md ${s.name.includes('Freezer') ? 'text-blue-500' : 'text-emerald-500'}`}>
                       {s.name.includes('Humidity') ? <Droplets size={24} /> : s.name.includes('Freezer') ? <Snowflake size={24} /> : <Thermometer size={24} />}
                     </div>
                     <div>
                       <p className="text-lg font-black text-slate-700 dark:text-slate-300">{s.name}</p>
                       <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1.5">আপডেট: {s.lastUpdated}</p>
                     </div>
                  </div>
                  <p className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">{s.value}{s.unit}</p>
               </div>
             ))}
           </div>
        </Card>
        <Card title="স্মার্ট রুলস">
          <div className="space-y-5">
            {MOCK_RULES.map(rule => (
              <div key={rule.id} className="p-6 md:p-8 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] flex items-center justify-between group hover:shadow-lg transition-all duration-300">
                <div className="flex gap-6 items-center">
                   <div className={`p-4 rounded-2xl ${rule.severity === 'Danger' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                      <AlertTriangle size={28} />
                   </div>
                   <div>
                      <p className="text-sm md:text-lg font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">IF {rule.sensor} {rule.condition} {rule.value}</p>
                      <p className="text-xs md:text-sm text-slate-500 font-black uppercase tracking-widest mt-2">ACTION: {rule.action}</p>
                   </div>
                </div>
                <div className={`w-14 h-7 rounded-full relative cursor-pointer transition-colors ${rule.active ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                   <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${rule.active ? 'left-8' : 'left-1'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const ChambersView = ({ onViewInventory }: { onViewInventory: (name: string) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {MOCK_CHAMBERS.map((c) => (
      <Card key={c.id} title={c.name} subtitle={c.type}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Occupancy</span>
            <span className={`text-lg font-black ${c.capacity > 80 ? 'text-red-500' : 'text-emerald-600'}`}>{c.capacity}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full ${c.capacity > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${c.capacity}%` }} />
          </div>
          <div className="flex items-center gap-2 pt-4">
            <button 
              onClick={() => onViewInventory(c.name)}
              className="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all"
            >
              ইনভেন্টরি দেখুন
            </button>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

const InvoicesView = () => (
  <Card title="সাম্প্রতিক ইনভয়েসসমূহ">
    <Table 
      data={MOCK_INVOICES} 
      columns={[
        { header: 'ইনভয়েস ID', render: (i) => <span className="font-bold">{i.id}</span> },
        { header: 'গ্রাহক', render: (i) => <span>{i.client}</span> },
        { header: 'পরিমান', render: (i) => <span className="font-black text-emerald-600">৳{i.amount.toLocaleString('bn-BD')}</span> },
        { header: 'অবস্থা', render: (i) => <StatusChip label={i.status} type={i.status === 'Paid' ? 'success' : 'danger'} /> }
      ]} 
      keyExtractor={i => i.id} 
    />
  </Card>
);

const ComplianceView = () => (
  <Card title="কমপ্লায়েন্স এবং সার্টিফিকেশন">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {MOCK_COMPLIANCE.map(doc => (
        <div key={doc.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-400">
              <ShieldCheck size={24} className="text-emerald-500" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">{doc.name}</p>
              <p className="text-xs text-slate-400 font-bold uppercase mt-1">{doc.date}</p>
            </div>
          </div>
          <StatusChip label={doc.status} type="success" />
        </div>
      ))}
    </div>
  </Card>
);

const StockInModal = ({ onClose }: { onClose: () => void }) => {
  const { role } = useRole();
  const isManager = role === 'ADMIN' || role === 'STORAGE_MANAGER';
  const defaultChamber = isManager ? (MOCK_CHAMBERS[0]?.name || '') : 'Manager to assign';
  const [formData, setFormData] = useState({
    productName: '',
    ownerName: '',
    quantity: '',
    unit: 'KG' as 'KG' | 'TON',
    chamber: defaultChamber,
    entryDate: new Date().toISOString().split('T')[0],
    expiryDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.quantity || !formData.entryDate) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add to mock stock data
      const assignedChamber = isManager ? formData.chamber : 'Manager to assign';

      const newStock = {
        id: `STK-${Date.now()}`,
        crop: formData.productName,
        owner: formData.ownerName || 'অজানা মালিক',
        qty: formData.unit === 'TON' ? `${formData.quantity} টন` : `${formData.quantity} কেজি`,
        chamber: assignedChamber,
        entryDate: formData.entryDate,
        expiryDate: formData.expiryDate || null,
        status: 'Fresh'
      };
      
      console.log('New stock added:', newStock);

      // If farmer submitted, create a manager approval request via booking queue and notify storage manager
      if (!isManager) {
        const durationDays = formData.expiryDate
          ? Math.max(1, Math.ceil((new Date(formData.expiryDate).getTime() - new Date(formData.entryDate).getTime()) / (1000 * 60 * 60 * 24)))
          : 90;

        const bookingLike: BookingRequest = {
          id: `BK-STK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          farmerId: 'F-101',
          farmerName: formData.ownerName || 'কৃষক',
          crop: formData.productName || 'অজানা পণ্য',
          quantity: Number(formData.quantity) || 0,
          unit: formData.unit,
          packaging: 'Sack',
          entryDate: formData.entryDate,
          releaseDate: formData.expiryDate || formData.entryDate,
          duration: durationDays,
          envDemand: {
            mode: 'Normal Cold',
            temp: '4°C',
            humidity: '85%'
          },
          logistics: {
            transport: 'Farmer arranged',
            location: formData.ownerName ? `${formData.ownerName} pickup` : 'অপেক্ষমান'
          },
          status: 'Pending',
          createdAt: new Date().toISOString()
        };

        mockDb.saveBooking(bookingLike);

        mockDb.pushNotification({
          type: 'STOCK_IN',
          title: 'নতুন স্টক ইন রিকোয়েস্ট',
          message: `${bookingLike.farmerName} ${bookingLike.crop} (${bookingLike.quantity}${bookingLike.unit}) যুক্ত করতে চান।`,
          targetRole: 'STORAGE_MANAGER',
          link: `/cold-storage?tab=booking&bookingId=${bookingLike.id}`,
          metadata: { bookingId: bookingLike.id }
        });
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to add stock:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const successTitle = isManager ? 'সফলভাবে যোগ হয়েছে!' : 'Request Sent';
  const successSubtitle = isManager
    ? 'আপনার স্টক সফলভাবে সিস্টেমে এন্ট্রি হয়েছে।'
    : 'স্টোরেজ ম্যানেজারের অনুমোদনের জন্য আপনার স্টক ইন রিকোয়েস্ট পাঠানো হয়েছে।';

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] p-10 relative z-10 shadow-2xl text-center"
        >
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <CheckCircle size={48} className="text-emerald-600" />
            </motion.div>
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-3"
          >
            {successTitle}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-slate-500 dark:text-slate-400 font-medium"
          >
            {successSubtitle}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
        className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-[2.5rem] p-8 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
            <PlusCircle size={24} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">নতুন স্টক ইন</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">কোল্ড স্টোরেজে নতুন পণ্য যোগ করুন</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              পণ্যের নাম (PRODUCT)
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              placeholder="যেমন: লাল আলু"
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-slate-100 placeholder:text-emerald-400/60 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
              required
            />
          </div>

          {/* Owner Name */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              মালিকের নাম (OWNER)
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              placeholder="যেমন: মোঃ আব্দুর রহিম"
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-slate-100 placeholder:text-emerald-400/60 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
            />
          </div>

          {/* Quantity & Unit */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              পরিমাণ ও ইউনিট (QUANTITY)
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0.00"
                className="flex-1 p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                required
              />
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value as 'KG' | 'TON' })}
                className="w-36 p-4 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-800 rounded-2xl font-black text-emerald-600 dark:text-emerald-400 focus:border-emerald-500 transition-all outline-none cursor-pointer"
              >
                <option value="KG">কেজি (KG)</option>
                <option value="TON">টন (TON)</option>
              </select>
            </div>
          </div>

          {/* Chamber Selection (managers only) */}
          {isManager && (
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                চেম্বার নির্বাচন (CHAMBER)
              </label>
              <select
                value={formData.chamber}
                onChange={(e) => setFormData({ ...formData, chamber: e.target.value })}
                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none cursor-pointer"
              >
                {MOCK_CHAMBERS.map(chamber => (
                  <option key={chamber.id} value={chamber.name}>
                    {`${chamber.name} • Occupied ${chamber.capacity}% of ${chamber.totalTons}t • ${chamber.temp}°C / ${chamber.humidity}% RH`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Entry Date */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={12} />
              প্রবেশের তারিখ (ENTRY DATE)
            </label>
            <input
              type="date"
              value={formData.entryDate}
              onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
              required
            />
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Clock size={12} />
              মেয়াদ শেষ (EXPIRY DATE)
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest transition-all hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RotateCw size={18} />
                  </motion.div>
                  প্রসেসিং...
                </>
              ) : (
                <>
                  স্টক যোগ করুন
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ContactManagerModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900 backdrop-blur-sm" />
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] p-10 relative z-10 shadow-2xl text-center">
      <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
        <MessageCircle size={36} className="text-emerald-600" />
      </div>
      <h3 className="text-2xl font-black mb-4">ম্যানেজারের সাথে যোগাযোগ</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">সরাসরি কথা বলতে অনুগ্রহ করে কল বা মেসেজ করুন।</p>
      <div className="space-y-4">
        <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-100">+৮৮০ ১৭০০-০০০০০০</button>
        <button onClick={onClose} className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-2xl font-black uppercase tracking-widest transition-all">বাতিল</button>
      </div>
    </motion.div>
  </div>
);

export default ColdStorage;
