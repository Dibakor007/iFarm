
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './UI/Card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart as RePieChart,
  Pie,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  Download, 
  ChevronDown, 
  FileText, 
  Activity, 
  DollarSign, 
  Zap, 
  RotateCw,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Layers,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { motion as m, AnimatePresence } from 'framer-motion';

// Fix: Cast motion to any to avoid property 'initial', 'animate', etc. errors in this environment
const motion = m as any;

type TimeRange = 'today' | 'week' | 'month' | 'year';

const ReportsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [isLoading, setIsLoading] = useState(false);

  // Advanced Analytics Data Simulation Logic
  const analyticsData = useMemo(() => {
    const isYear = timeRange === 'year';
    const isWeek = timeRange === 'week';
    const isToday = timeRange === 'today';
    
    // Scale factors for simulation
    const multiplier = isYear ? 12 : isWeek ? 0.25 : isToday ? 0.05 : 1;

    return {
      kpis: [
        { label: 'মোট আয়', value: `৳${(92.5 * multiplier).toFixed(1)} লাখ`, trend: '+১৮.২%', status: 'success', icon: <DollarSign size={26} /> },
        { label: 'মোট ব্যয়', value: `৳${(50.2 * multiplier).toFixed(1)} লাখ`, trend: '+৪.৫%', status: 'danger', icon: <Zap size={26} /> },
        { label: 'অপারেটিং মার্জিন', value: '৪২.৮%', trend: '+১২.১%', status: 'success', icon: <TrendingUp size={26} /> },
        { label: 'ক্যাপাসিটি ব্যবহার', value: '৮২.৪%', trend: '-১.২%', status: 'info', icon: <Target size={26} /> },
      ],
      performanceHistory: [
        { name: 'জানু', revenue: 4500, expense: 2100, profit: 2400 },
        { name: 'ফেব্রু', revenue: 5200, expense: 2300, profit: 2900 },
        { name: 'মার্চ', revenue: 4800, expense: 3100, profit: 1700 },
        { name: 'এপ্রিল', revenue: 6100, expense: 2800, profit: 3300 },
        { name: 'মে', revenue: 5900, expense: 2400, profit: 3500 },
        { name: 'জুন', revenue: 7200, expense: 3200, profit: 4000 },
      ],
      chamberEfficiency: [
        { chamber: 'Chamber A', efficiency: 94, load: 85 },
        { chamber: 'Chamber B', efficiency: 82, load: 40 },
        { chamber: 'Chamber C', efficiency: 65, load: 15 },
        { chamber: 'Chamber D', efficiency: 91, load: 60 },
      ],
      cropMix: [
        { name: 'আলু', value: 450, fill: '#10b981' },
        { name: 'পেঁয়াজ', value: 300, fill: '#0ea5e9' },
        { name: 'টমেটো', value: 150, fill: '#f59e0b' },
        { name: 'অন্যান্য', value: 100, fill: '#94a3b8' },
      ]
    };
  }, [timeRange]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [timeRange]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24 max-w-[1600px] mx-auto">
      {/* Header with high-level controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-xl">
              <Activity size={32} />
            </div>
            রিপোর্ট ও এনালিটিক্স
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium mt-3">ব্যবসায়িক কর্মদক্ষতা এবং স্টোরেজ অপারেশনাল ইন্টেলিজেন্স</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-72 group">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="w-full pl-6 pr-12 py-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-base text-slate-700 dark:text-slate-200 outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer shadow-sm group-hover:border-slate-200"
            >
              <option value="today">আজ (Today)</option>
              <option value="week">এই সপ্তাহ (Week)</option>
              <option value="month">এই মাস (Month)</option>
              <option value="year">এই বছর (Year)</option>
            </select>
            <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform group-hover:translate-y-[-40%]" />
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-base uppercase tracking-widest shadow-2xl shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all active:scale-95 group">
            <Download size={22} className="group-hover:translate-y-0.5 transition-transform" /> এক্সপোর্ট রিপোর্ট
          </button>
        </div>
      </div>

      {/* KPI Cards: Dynamic Scaling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {analyticsData.kpis.map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-md relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
          >
             <div className="flex justify-between items-start mb-8">
               <div className={`p-5 rounded-2xl transition-transform group-hover:scale-110 duration-500 ${
                 kpi.status === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 
                 kpi.status === 'danger' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
               }`}>
                 {kpi.icon}
               </div>
               <div className={`flex items-center gap-1.5 text-sm font-black px-3 py-1 rounded-full ${
                 kpi.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
               }`}>
                 {kpi.trend.startsWith('+') ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                 {kpi.trend}
               </div>
             </div>
             <div className="space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{kpi.label}</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                  {isLoading ? <RotateCw className="animate-spin text-slate-200" size={32} /> : kpi.value}
                </h3>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8 space-y-10">
          <Card title="ব্যবসায়িক কার্যক্রম বিশ্লেষণ" subtitle="রাজস্ব, ব্যয় এবং মুনাফা প্রবণতা" className="border-none shadow-2xl rounded-[3rem]">
             <div className="h-[480px] w-full mt-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.performanceHistory}>
                    <defs>
                      <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={14} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                    <YAxis fontSize={14} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)', padding: '24px' }}
                      itemStyle={{ fontWeight: 'black', fontSize: '16px' }}
                    />
                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '40px', fontWeight: 'black', fontSize: '15px' }} />
                    <Area name="রাজস্ব (Income)" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={5} fill="url(#gradRevenue)" />
                    <Area name="পরিচালন ব্যয়" type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={5} strokeDasharray="10 10" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card title="চেম্বার ভিত্তিক দক্ষতা" subtitle="স্টোরেজ কন্ডিশন ও ব্যবহারের হার (%)">
              <div className="h-[350px] w-full mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.chamberEfficiency} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="chamber" type="category" fontSize={14} axisLine={false} tickLine={false} tick={{fontWeight: 'black', fill: '#64748b'}} />
                    <Tooltip contentStyle={{ borderRadius: '24px', fontSize: '14px' }} />
                    <Bar name="দক্ষতা (Efficiency)" dataKey="efficiency" radius={[0, 15, 15, 0]} barSize={32}>
                      {analyticsData.chamberEfficiency.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.efficiency < 70 ? '#f59e0b' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="পণ্য ডিস্ট্রিবিউশন" subtitle="মোট স্টকের ক্যাটাগরি ভিত্তিক ভাগ">
              <div className="h-[350px] w-full mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={analyticsData.cropMix}
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={10}
                      dataKey="value"
                      stroke="none"
                    >
                      {analyticsData.cropMix.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '30px', fontWeight: 'black', fontSize: '14px' }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="xl:col-span-4 space-y-10">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-10 bg-slate-900 text-white rounded-[3rem] border-none relative overflow-hidden group shadow-2xl"
          >
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                   <div className="p-4 bg-emerald-500 rounded-2xl"><Target size={28} /></div>
                   <h4 className="text-2xl font-black italic tracking-tighter">লক্ষ্যমাত্রা অর্জন</h4>
                </div>
                <div className="space-y-8">
                   <div className="space-y-4">
                      <div className="flex justify-between text-sm font-black uppercase tracking-widest text-slate-400">
                         <span>মাসিক রাজস্ব লক্ষ্য (৳১০ লাখ)</span>
                         <span className="text-emerald-400">৭৫%</span>
                      </div>
                      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                         <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1.5 }} className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]" />
                      </div>
                   </div>
                   <p className="text-base text-slate-400 leading-relaxed font-medium">
                     আপনার বর্তমান পারফরম্যান্স অনুযায়ী মাসের শেষে লক্ষ্যমাত্রার <span className="text-white font-bold text-lg">৯২%</span> অর্জিত হওয়ার প্রবল সম্ভাবনা রয়েছে।
                   </p>
                </div>
             </div>
          </motion.div>

          <div className="space-y-6">
             <div className="flex items-center justify-between px-4">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                   <Sparkles size={20} className="text-amber-500" /> স্মার্ট রিকমেন্ডেশন
                </h4>
             </div>
             <div className="space-y-6">
                <InsightItem 
                   icon={<Zap size={22} />} 
                   color="bg-amber-500" 
                   title="বিদ্যুৎ সাশ্রয়" 
                   desc="চেম্বার সি এর আর্দ্রতা কন্ট্রোল অপ্টিমাইজ করলে আগামী মাসে ৫% বিদ্যুৎ সাশ্রয় সম্ভব।" 
                />
                <InsightItem 
                   icon={<TrendingUp size={22} />} 
                   color="bg-emerald-500" 
                   title="বাজার বিশ্লেষণ" 
                   desc="আলুর বাজারদর আগামী ১৫ দিনে ১০% বাড়ার সম্ভাবনা। স্টক ছাড়তে অপেক্ষা করুন।" 
                />
             </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center justify-between px-4">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">সাম্প্রতিক রিপোর্টসমূহ</h4>
             </div>
             <div className="space-y-4">
               {[
                 { title: 'মার্চ ২০২৪ - মাসিক স্টক রিপোর্ট', date: '২১ মার্চ', type: 'PDF', color: 'text-red-500' },
                 { title: 'ত্রৈমাসিক ফিনান্সিয়াল ডাটা', date: '১৫ মার্চ', type: 'XLS', color: 'text-emerald-600' },
                 { title: 'ডেলিভারি এনালাইটিক্স লগ', date: '১০ মার্চ', type: 'DOC', color: 'text-blue-500' },
               ].map((doc, idx) => (
                 <motion.div 
                    key={idx} 
                    whileHover={{ x: 8 }}
                    className="flex items-center justify-between p-6 rounded-[2.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all cursor-pointer group"
                 >
                   <div className="flex items-center gap-5">
                     <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 shadow-sm transition-colors border border-slate-100 dark:border-slate-700">
                       <FileText size={28} />
                     </div>
                     <div>
                       <p className="text-base font-black text-slate-800 dark:text-slate-200 line-clamp-1">{doc.title}</p>
                       <div className="flex items-center gap-3 mt-2">
                          <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 ${doc.color}`}>{doc.type}</span>
                          <span className="text-sm text-slate-400 font-bold uppercase">{doc.date}</span>
                       </div>
                     </div>
                   </div>
                   <Download size={24} className="text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0" />
                 </motion.div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InsightItem = ({ icon, color, title, desc }: { icon: any, color: string, title: string, desc: string }) => (
  <div className="flex gap-5 p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 hover:border-emerald-100 transition-colors shadow-md">
     <div className={`p-4 rounded-xl text-white shadow-xl ${color} shrink-0 h-fit`}>
        {icon}
     </div>
     <div>
        <h5 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-2">{title}</h5>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{desc}</p>
     </div>
  </div>
);

export default ReportsPage;
