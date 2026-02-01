
import React, { useEffect, useState, useMemo } from 'react';
import { Card } from './UI/Card';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  ArrowUpRight, 
  Locate, 
  Activity, 
  Thermometer, 
  Droplets,
  AlertCircle,
  Plus,
  Clock,
  LayoutDashboard,
  Calendar,
  Zap,
  ArrowRight,
  TrendingUp,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Snowflake,
  ShieldAlert,
  Repeat,
  DollarSign,
  User,
  Truck,
  BarChart3,
  Waves,
  Users,
  Cpu,
  Navigation2,
  Wallet,
  ArrowDownRight
} from 'lucide-react';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { STOCK_CHART_DATA, MOCK_SENSORS, MOCK_STOCK, MOCK_CHAMBERS } from '../data/dummyData';
import { COLORS } from '../constants';
import { SmartAssistant } from './SmartAssistant';
import { mockDb, AppNotification } from '../data/mockDb';
import { fetchFarmSummaries } from '../lib/apiClient';
import { useSettings } from '../context/SettingsContext';
import { useRole } from '../App';
import type { FarmSummary } from '../types';

const motion = m as any;

const Dashboard: React.FC = () => {
  const { settings } = useSettings();
  const { role } = useRole();
  const [alerts, setAlerts] = useState<AppNotification[]>([]);
  const [liveSensors, setLiveSensors] = useState(MOCK_SENSORS);
  const [liveMetrics, setLiveMetrics] = useState({
    revenue: 92450,
    occupancy: 82.4,
    power: 12.8,
    efficiency: 94,
    activeGateways: 14,
    systemUsers: 152,
    payoutSoon: 12500
  });
  const [farms, setFarms] = useState<FarmSummary[]>([]);
  const [farmLoading, setFarmLoading] = useState(true);
  const [farmError, setFarmError] = useState<string | null>(null);

  const today = new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // 1. Live Data Simulation Engine
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSensors(prev => prev.map(s => ({
        ...s,
        value: Number((s.value + (Math.random() * 0.4 - 0.2)).toFixed(1))
      })));
      
      setLiveMetrics(prev => ({
        ...prev,
        power: Number((prev.power + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        revenue: prev.revenue + Math.floor(Math.random() * 50),
        occupancy: Number(Math.min(100, Math.max(0, prev.occupancy + (Math.random() * 0.05 - 0.025))).toFixed(1))
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // 2. Role-based Alerts
  useEffect(() => {
    mockDb.checkStockExpiries(MOCK_STOCK, settings.storageConfig.alertDays);
    const refreshAlerts = () => {
      const allNotifs = mockDb.getNotifications();
      const relevantAlerts = allNotifs.filter(n => 
        (n.type === 'ALERT' || n.type === 'EXPIRY') && 
        (n.targetRole === role || n.targetRole === 'ADMIN')
      ).slice(0, 4);
      setAlerts(relevantAlerts);
    };
    refreshAlerts();
    window.addEventListener('ifarm_notification_update', refreshAlerts);
    return () => window.removeEventListener('ifarm_notification_update', refreshAlerts);
  }, [role, settings.storageConfig.alertDays]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const loadFarms = async () => {
      setFarmLoading(true);
      try {
        const data = await fetchFarmSummaries(30, controller.signal);
        if (!mounted) return;
        setFarms(data ?? []);
        setFarmError(null);
      } catch (error) {
        if (!mounted) return;
        const message = error instanceof Error ? error.message : 'ফার্ম ডেটা লোড করতে পারছি না';
        setFarmError(message);
        setFarms([]);
      } finally {
        if (mounted) setFarmLoading(false);
      }
    };

    loadFarms();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  // 3. Dynamic KPIs based on Role
  const getRoleKPIs = () => {
    switch(role) {
      case 'ADMIN':
        return [
          { label: 'মোট আয় (Revenue)', value: `৳${liveMetrics.revenue.toLocaleString('bn-BD')}`, icon: <DollarSign size={28} />, status: 'success', color: 'emerald' },
          { label: 'সক্রিয় ট্রিপস', value: '১২ টি', icon: <Truck size={28} />, status: 'info', color: 'blue' },
          { label: 'স্টোরেজ ব্যবহার', value: `${liveMetrics.occupancy}%`, icon: <Database size={28} />, status: 'warning', color: 'amber' },
          { label: 'সিস্টেম হেলথ', value: '৯৯.৯%', icon: <Activity size={28} />, status: 'success', color: 'teal' },
        ];
      case 'FARMER':
        return [
          { label: 'আমার বর্তমান মজুদ', value: '১৫.৫ টন', icon: <Database size={28} />, status: 'info', color: 'blue' },
          { label: 'প্রত্যাশিত প্রফিট', value: '৳৮৫,০০০', icon: <TrendingUp size={28} />, status: 'success', color: 'emerald' },
          { label: 'স্টক হেলথ', value: '৮৮%', icon: <Sparkles size={28} />, status: 'success', color: 'teal' },
          { label: 'বুকিং স্ট্যাটাস', value: '১টি পেন্ডিং', icon: <Clock size={28} />, status: 'warning', color: 'amber' },
        ];
      case 'STORAGE_MANAGER':
        return [
          { label: 'লাইভ অকুপেন্সি', value: `${liveMetrics.occupancy}%`, icon: <Database size={28} />, status: 'warning', color: 'amber' },
          { label: 'পাওয়ার লোড', value: `${liveMetrics.power} kW`, icon: <Zap size={28} />, status: 'info', color: 'blue' },
          { label: 'চেম্বার এফিসিয়েন্সি', value: `${liveMetrics.efficiency}%`, icon: <Activity size={28} />, status: 'success', color: 'emerald' },
          { label: 'অ্যালার্ট কিউ', value: '০৩ টি', icon: <AlertCircle size={28} />, status: 'danger', color: 'red' },
        ];
      case 'TRANSPORT_MANAGER':
        return [
          { label: 'চলমান ট্রাক', value: '০৮ টি', icon: <Truck size={28} />, status: 'info', color: 'blue' },
          { label: 'সময়মতো ডেলিভারি', value: '৯২%', icon: <CheckCircle2 size={28} />, status: 'success', color: 'emerald' },
          { label: 'গড় বিলম্ব', value: '১৫ মি.', icon: <Clock size={28} />, status: 'warning', color: 'amber' },
          { label: 'রুট কাভারেজ', value: '৮৫%', icon: <Locate size={28} />, status: 'info', color: 'teal' },
        ];
      default: return [];
    }
  };

  // 4. Role-based Intelligence Bar Content
  const getIntelligenceSummary = () => {
    switch(role) {
      case 'ADMIN':
        return [
          { label: 'মোট ইউজার', value: liveMetrics.systemUsers, icon: <Users size={16} />, trend: '+৪' },
          { label: 'সক্রিয় গেটওয়ে', value: liveMetrics.activeGateways, icon: <Cpu size={16} />, trend: 'Healthy' },
          { label: 'লজিস্টিক কস্ট', value: '৳৪.২ লাখ', icon: <Wallet size={16} />, trend: '-২%' },
          { label: 'গড় ফ্রেশনেস', value: '৮৬%', icon: <Sparkles size={16} />, trend: 'Stable' }
        ];
      case 'FARMER':
        return [
          { label: 'বাজার ট্রেন্ড', value: '+৫%', icon: <TrendingUp size={16} />, trend: 'Potato' },
          { label: 'আসন্ন পেমেন্ট', value: `৳${liveMetrics.payoutSoon}`, icon: <Wallet size={16} />, trend: 'Due in 3d' },
          { label: 'স্টোরেজ দিন', value: '৪৫ দিন', icon: <Clock size={16} />, trend: 'Avg' },
          { label: 'সজীবতা স্কোর', value: '৯২/১০০', icon: <Activity size={16} />, trend: 'High' }
        ];
      case 'STORAGE_MANAGER':
        return [
          { label: 'ফাঁকা চেম্বার', value: '০২ টি', icon: <Database size={16} />, trend: 'Zone C, D' },
          { label: 'পাওয়ার সেভিংস', value: '৳৮,৫০০', icon: <Zap size={16} />, trend: 'This Mo.' },
          { label: 'সেন্সর ড্রাউট', value: '০.৫%', icon: <Cpu size={16} />, trend: 'Low' },
          { label: 'রক্ষণাবেক্ষণ', value: '১০ দিন পর', icon: <ShieldAlert size={16} />, trend: 'Next' }
        ];
      default: return [];
    }
  };

  const kpis = getRoleKPIs();
  const summary = getIntelligenceSummary();
  const farmStatusCounts = useMemo(() => {
    return farms.reduce<Record<string, number>>((acc, farm) => {
      const key = (farm.status ?? 'UNKNOWN').toUpperCase();
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  }, [farms]);
  const farmStatusEntries = useMemo(() => Object.entries(farmStatusCounts), [farmStatusCounts]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <LayoutDashboard size={20} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              {role === 'ADMIN' ? 'Full Control' : role === 'FARMER' ? 'My Farm' : 'System Pulse'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            স্বাগতম, {role === 'ADMIN' ? 'এডমিন' : role === 'STORAGE_MANAGER' ? 'ম্যানেজার' : role === 'FARMER' ? 'কৃষক ভাই' : 'অফিসার'}
          </h1>
          <div className="flex items-center gap-3 mt-3 text-slate-500 dark:text-slate-400">
            <Calendar size={18} className="text-emerald-500" />
            <p className="text-lg font-medium">{today}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-base shadow-xl shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all group"
          >
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" /> 
            {role === 'FARMER' ? 'নতুন বুকিং রিকোয়েস্ট' : 'নতুন রেকর্ড যোগ করুন'}
          </motion.button>
        </div>
      </div>

      {/* Intelligence Summary Row - Role Based */}
      {summary.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summary.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all"
            >
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 group-hover:text-emerald-500 transition-colors">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <span className="text-[8px] font-black text-emerald-600 uppercase">{item.trend}</span>
                </div>
                <p className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5 tabular-nums">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {kpis.map((kpi, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-700 shadow-md relative overflow-hidden group transition-all duration-500 hover:shadow-2xl"
          >
            <div className={`absolute -top-4 -right-4 w-24 h-24 bg-${kpi.color}-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
            <div className="relative z-10">
              <div className={`p-4 rounded-2xl w-fit shadow-lg ${
                  kpi.status === 'success' ? 'bg-emerald-600 text-white' :
                  kpi.status === 'warning' ? 'bg-amber-500 text-white' :
                  kpi.status === 'danger' ? 'bg-red-500 text-white' :
                  'bg-blue-600 text-white'
                }`}>
                  {kpi.icon}
              </div>
              <div className="mt-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tighter tabular-nums">
                    {kpi.value}
                  </h3>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mb-2" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Card
        title="ফার্ম নেটওয়ার্ক স্ন্যাপশট"
        subtitle="ব্যাকএন্ড থেকে সরাসরি প্রাপ্ত স্ট্যাটাস"
        className="border-none shadow-2xl rounded-[3rem]"
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
              মোট রেজিস্ট্রেশন
            </p>
            <p className="text-4xl font-black text-slate-900 dark:text-slate-50 mt-2">
              {farmLoading ? '...' : farms.length}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {farmLoading ? 'ফার্ম গোনা হচ্ছে...' : `${farms.length} টি রেকর্ড পাওয়া গেছে`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
              স্টেটাস ক্যাটাগরি
            </p>
            <p className="text-sm font-black text-emerald-600 mt-1">
              {farmStatusEntries.length ? `${farmStatusEntries.length} টি` : 'আপডেট লোড হচ্ছে'}
            </p>
          </div>
        </div>

        <div className="mt-5">
          {farmStatusEntries.length === 0 ? (
            <p className="text-sm text-slate-500">
              {farmLoading ? 'স্ট্যাটাস সংগ্রহ করা হচ্ছে...' : 'কোনো ক্যাটাগরি পাওয়া যায়নি।'}
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {farmStatusEntries.map(([status, count]) => (
                <div
                  key={status}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 shadow-sm"
                >
                  <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400">{status}</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2 tabular-nums">{count}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          {farmError ? (
            <p className="text-sm text-amber-600 font-semibold">{farmError}</p>
          ) : (
            farms.length > 0 && (
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {farms.slice(0, 4).map((farm) => (
                  <div
                    key={farm.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{farm.name}</p>
                      <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">ID {farm.id}</p>
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">
                      {farm.status ?? 'UNKNOWN'}
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </Card>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8 space-y-10">
          {/* Main Visualizations - Selective */}
          {(role === 'ADMIN' || role === 'STORAGE_MANAGER' || role === 'TRANSPORT_MANAGER') && (
            <Card 
              title={role === 'TRANSPORT_MANAGER' ? "লজিস্টিকস ভলিউম" : "স্টক মুভমেন্ট এনালাইটিক্স"} 
              subtitle="রিয়েল-টাইম ডাটা ট্র্যাকিং"
              className="border-none shadow-2xl rounded-[3.5rem]"
            >
              <div className="h-[450px] mt-10 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={STOCK_CHART_DATA}>
                    <defs>
                      <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={14} tickLine={false} axisLine={false} tick={{fontWeight: 'bold'}} dy={15} />
                    <YAxis stroke="#94a3b8" fontSize={14} tickLine={false} axisLine={false} tick={{fontWeight: 'bold'}} />
                    <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)', padding: '24px' }} />
                    <Area 
                      name="মজুদ (Stock)"
                      type="monotone" 
                      dataKey="stock" 
                      stroke={COLORS.primary} 
                      strokeWidth={6} 
                      fill="url(#chartColor)" 
                      activeDot={{ r: 10, fill: COLORS.primary }} 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {role === 'FARMER' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card title="পণ্যের স্বাস্থ্য (Stock Health)" subtitle="লাইভ ডিটেকশন">
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="relative">
                    <svg className="w-48 h-48">
                      <circle cx="96" cy="96" r="80" className="stroke-slate-100 dark:stroke-slate-800 fill-none" strokeWidth="12" />
                      <motion.circle 
                        cx="96" cy="96" r="80" 
                        className="stroke-emerald-500 fill-none" 
                        strokeWidth="12" 
                        strokeDasharray="502" 
                        initial={{ strokeDashoffset: 502 }}
                        animate={{ strokeDashoffset: 502 - (502 * 0.88) }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">৮৮%</span>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Excellent</span>
                    </div>
                  </div>
                  <div className="mt-10 grid grid-cols-2 gap-8 w-full px-6">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">শুকনো ভাব</p>
                      <p className="text-lg font-black text-slate-800 dark:text-slate-100">৯২%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">পচন ঝুঁকি</p>
                      <p className="text-lg font-black text-red-500">০.২%</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="বাজারদর ইনসাইটস" subtitle="টপ ৩ জেলা">
                <div className="space-y-4 mt-6">
                  {['ঢাকা', 'মুন্সিগঞ্জ', 'বগুড়া'].map((city, idx) => (
                    <div key={city} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-emerald-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                          <TrendingUp size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{city} বাজার</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">পরিবর্তন: +৫%</p>
                        </div>
                      </div>
                      <p className="text-lg font-black text-slate-900 dark:text-slate-100">৳৩৫.৫০</p>
                    </div>
                  ))}
                  <button className="w-full py-3 text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center justify-center gap-2">
                    বিস্তারিত বাজারদর <ArrowRight size={12} />
                  </button>
                </div>
              </Card>
            </div>
          )}

          <div className="relative overflow-hidden rounded-[3rem]">
            <SmartAssistant context={`Role: ${role}. Live Power: ${liveMetrics.power}kW. Alerts: ${alerts.length}. Efficiency: ${liveMetrics.efficiency}%.`} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-4 space-y-10">
          {/* Live Sensor Meters */}
          <Card title="লাইভ মিটার (Sensors)" actions={<div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}>
            <div className="grid grid-cols-1 gap-6">
              {(role === 'FARMER' ? liveSensors.slice(0, 2) : liveSensors).map((sensor) => (
                <div 
                  key={sensor.id} 
                  className="group flex items-center justify-between p-6 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 transition-all hover:border-emerald-500/40 hover:shadow-xl"
                >
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${
                      sensor.name.includes('Temp') ? 'bg-amber-100 text-amber-600' : 
                      sensor.name.includes('Freezer') ? 'bg-blue-600 text-white shadow-lg' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {sensor.name.includes('Temp') ? <Thermometer size={28} /> : 
                       sensor.name.includes('Freezer') ? <Snowflake size={28} /> : 
                       <Droplets size={28} />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">{sensor.name}</p>
                      <p className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1 tabular-nums">
                        {sensor.value}{sensor.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                     <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-lg border border-emerald-100">Live</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Power Utilization for Managers/Admins */}
            {(role === 'ADMIN' || role === 'STORAGE_MANAGER') && (
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between px-2 mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">পাওয়ার ইউজ (Current Load)</p>
                  <Zap size={16} className="text-blue-500 animate-pulse" />
                </div>
                <div className="flex items-end justify-between px-2">
                  <h4 className="text-4xl font-black text-slate-800 dark:text-slate-100 tabular-nums">{liveMetrics.power} <span className="text-sm text-slate-400">kW</span></h4>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-600 uppercase">৮% সাশ্রয় হচ্ছে</p>
                    <p className="text-[9px] text-slate-400 font-bold">vs last hour</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
          
          {/* Alerts Panel */}
          <Card title="সিস্টেম অ্যালার্টস" className="bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <ShieldAlert size={180} />
             </div>
             
             <div className="space-y-6 relative z-10 mt-4">
               {alerts.length > 0 ? (
                 alerts.map((alert) => (
                   <motion.div 
                     key={alert.id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                     className={`flex gap-5 items-start p-6 rounded-[2rem] border transition-all hover:bg-white/5 cursor-pointer ${
                        alert.type === 'EXPIRY' 
                        ? 'bg-red-500/10 border-red-500/30' 
                        : 'bg-amber-500/10 border-amber-500/30'
                     }`}
                   >
                     <div className={`mt-1 shrink-0 p-3 rounded-xl ${alert.type === 'EXPIRY' ? 'bg-red-500 text-white shadow-lg' : 'bg-amber-500 text-white shadow-lg'}`}>
                        {alert.type === 'EXPIRY' ? <ShieldAlert size={20} /> : <AlertCircle size={20} />}
                     </div>
                     <div className="flex-1">
                       <div className="flex justify-between items-start">
                         <p className="text-sm font-black leading-tight uppercase tracking-tight text-white">{alert.title}</p>
                         <ChevronRight size={16} className="text-white/20" />
                       </div>
                       <p className="text-xs font-bold text-slate-400 mt-2 leading-relaxed line-clamp-2">{alert.message}</p>
                     </div>
                   </motion.div>
                 ))
               ) : (
                 <div className="py-12 text-center bg-white/5 rounded-[2.5rem] border border-white/5">
                   <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4" />
                   <p className="text-sm text-slate-400 font-black uppercase tracking-widest">সবকিছু স্বাভাবিক আছে</p>
                 </div>
               )}
             </div>
          </Card>

          {/* Quick Stats for Admin Only */}
          {role === 'ADMIN' && (
            <Card title="অপারেশনাল হেলথ">
              <div className="space-y-4">
                 {[
                   { label: 'ট্রান্সপোর্ট অন-টাইম', val: '৯২%', color: 'emerald' },
                   { label: 'গেটওয়ে আপটাইম', val: '৯৯.৯%', color: 'blue' },
                   { label: 'পেমেন্ট রিকভারি', val: '৮৫%', color: 'teal' }
                 ].map(item => (
                   <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>{item.label}</span>
                        <span>{item.val}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: item.val }}
                          className={`h-full bg-${item.color}-500`}
                        />
                      </div>
                   </div>
                 ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
