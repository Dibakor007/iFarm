
import React, { useState } from 'react';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';
import { Tabs } from '../components/UI/Tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Truck, Clock, MapPin, TrendingUp, Navigation, Star, 
  Download, Filter, ChevronRight, AlertCircle, Info, Activity 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  TRANSPORT_TREND_DATA, ROUTE_ANALYTICS, DELAY_REASONS, 
  DRIVER_PERFORMANCE, VEHICLE_PERFORMANCE, DELAY_HEATMAP, 
  TRANSPORT_COST_SUMMARY 
} from '../data/dummyData';
import { COLORS } from '../constants';

const TransportReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('performance');

  const tabs = [
    { id: 'performance', label: 'পারফরম্যান্স', icon: <Activity size={16} /> },
    { id: 'delays', label: 'বিলম্ব বিশ্লেষণ', icon: <Clock size={16} /> },
    { id: 'routes', label: 'রুট ইনসাইটস', icon: <MapPin size={16} /> },
    { id: 'drivers', label: 'ড্রাইভার ও যানবাহন', icon: <Truck size={16} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">ট্রান্সপোর্ট রিপোর্ট (Logistics Analytics)</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">লজিস্টিকস দক্ষতা এবং ডেলিভারি পারফরম্যান্স বিশ্লেষণ</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400">
            <Filter size={18} /> ফিল্টার
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-emerald-700 transition-all">
            <Download size={18} /> এক্সপোর্ট
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'মোট ট্রিপ', value: '৫৪২', trend: '+১২%', icon: <Navigation size={20} />, color: 'emerald' },
          { label: 'সময়মতো ডেলিভারি', value: '৮৮%', trend: '+৫%', icon: <Clock size={20} />, color: 'emerald' },
          { label: 'গড় বিলম্ব', value: '১৮ মি.', trend: '-৩ মি.', icon: <AlertCircle size={20} />, color: 'amber' },
          { label: 'মোট দূরত্ব', value: '১২,৪৫০ কিমি', trend: '+৮%', icon: <MapPin size={20} />, color: 'blue' },
        ].map((kpi, idx) => (
          <Card key={idx} hoverable className="border-none shadow-md">
            <div className="flex justify-between items-start">
               <div className={`p-3 rounded-2xl ${
                 kpi.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                 kpi.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
               }`}>
                 {kpi.icon}
               </div>
               <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{kpi.trend}</span>
            </div>
            <div className="mt-4">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
               <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{kpi.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'performance' && <PerformanceTab />}
        {activeTab === 'delays' && <DelaysTab />}
        {activeTab === 'routes' && <RoutesTab />}
        {activeTab === 'drivers' && <DriversTab />}
      </motion.div>
    </div>
  );
};

const PerformanceTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <Card title="ডেলিভারি হেলথ ট্রেন্ড (৭ দিন)" className="lg:col-span-2">
      <div className="h-80 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={TRANSPORT_TREND_DATA}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
            <Legend verticalAlign="top" height={36}/>
            <Bar name="সময়মতো (On-time)" dataKey="onTime" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            <Bar name="বিলম্ব (Delayed)" dataKey="delayed" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>

    <div className="space-y-6">
       <Card title="পরিবহন খরচ সারাংশ (Logistics Cost)">
          <div className="space-y-4">
             <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">গড় খরচ / ট্রিপ</p>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100">৳{TRANSPORT_COST_SUMMARY.costPerTrip}</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                   <p className="text-[9px] font-bold uppercase">জ্বালানি খরচ</p>
                   <p className="text-lg font-black">৳১৮৫কে</p>
                </div>
                <div className="p-4 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
                   <p className="text-[9px] font-bold uppercase">মেইনটেন্যান্স</p>
                   <p className="text-lg font-black">৳৪৫কে</p>
                </div>
             </div>
             <p className="text-[10px] text-slate-400 italic text-center">* এই ডেটাগুলো শুধুমাত্র আনুমানিক হিসাব</p>
          </div>
       </Card>
       <Card className="bg-slate-900 text-white border-none p-6">
          <div className="flex gap-3">
             <div className="p-2 bg-emerald-500 rounded-lg"><TrendingUp size={16} /></div>
             <h4 className="font-bold">সাপ্তাহিক অন্তর্দৃষ্টি</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mt-4">
            বৃহস্পতিবার সবচেয়ে বেশি বিলম্ব রেকর্ড করা হয়েছে (গড় ৪৫ মিনিট)। ঢাকার কারওয়ান বাজার রুটে ট্রাফিক জ্যাম এর প্রধান কারণ।
          </p>
       </Card>
    </div>
  </div>
);

const DelaysTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <Card title="বিলম্বের কারণ বিশ্লেষণ (Delay Reasons)">
       <div className="h-80 mt-4">
         <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DELAY_REASONS}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {[COLORS.primary, COLORS.secondary, COLORS.accent, '#ef4444', '#64748b'].map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" align="center" />
            </PieChart>
         </ResponsiveContainer>
       </div>
    </Card>

    <Card title="ডেলিভারি টাইমলাইন হিটম্যাপ (Week Heatmap)">
       <div className="mt-6 space-y-4">
          <div className="grid grid-cols-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-2">
            <div>দিন</div>
            <div>সকাল</div>
            <div>দুপুর</div>
            <div>বিকাল/সন্ধ্যা</div>
          </div>
          <div className="space-y-1">
            {DELAY_HEATMAP.map(row => (
              <div key={row.day} className="grid grid-cols-4 gap-1 items-center">
                 <div className="text-[10px] font-bold text-slate-500">{row.day}</div>
                 <HeatmapCell value={row.morning} />
                 <HeatmapCell value={row.noon} />
                 <HeatmapCell value={row.evening} />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-6">
             <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500"><div className="w-3 h-3 bg-emerald-100 rounded"></div> Low Risk</div>
             <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500"><div className="w-3 h-3 bg-amber-500 rounded"></div> Medium</div>
             <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500"><div className="w-3 h-3 bg-red-600 rounded"></div> High Delay</div>
          </div>
       </div>
    </Card>
  </div>
);

const HeatmapCell = ({ value }: { value: number }) => {
  const bgColor = value < 20 ? 'bg-emerald-100' : value < 40 ? 'bg-amber-400' : 'bg-red-600';
  const textColor = value > 35 ? 'text-white' : 'text-slate-800';
  return (
    <motion.div 
      whileHover={{ scale: 1.1, zIndex: 10 }}
      className={`h-12 flex items-center justify-center rounded-lg text-[10px] font-bold shadow-sm transition-colors cursor-help ${bgColor} ${textColor}`}
      title={`Delay Rate: ${value}%`}
    >
      {value}%
    </motion.div>
  );
};

const RoutesTab = () => {
  const columns = [
    { header: 'রুট (From → To)', render: (i: any) => <span className="font-bold text-slate-800 dark:text-slate-200">{i.route}</span> },
    { header: 'মোট ট্রিপ', render: (i: any) => <span className="text-sm font-medium">{i.count}</span> },
    { header: 'গড় সময়', render: (i: any) => <span className="text-sm">{i.duration}</span> },
    { header: 'বিলম্ব হার', render: (i: any) => <span className={`font-bold ${i.delayFreq > 30 ? 'text-red-600' : 'text-slate-700'}`}>{i.delayFreq}%</span> },
    { header: 'রিস্ক লেভেল', render: (i: any) => (
      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
        i.risk === 'High' ? 'bg-red-50 text-red-600' : i.risk === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
      }`}>
        {i.risk}
      </span>
    )}
  ];

  return (
    <Card title="রুট এনালিটিক্স ও রিস্ক এসেসমেন্ট">
      <Table data={ROUTE_ANALYTICS} columns={columns} keyExtractor={i => i.id.toString()} searchable exportable />
    </Card>
  );
};

const DriversTab = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <Card title="ড্রাইভার পারফরম্যান্স কার্ড">
        <div className="space-y-4">
           {DRIVER_PERFORMANCE.map(driver => (
             <div key={driver.id} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-between group">
                <div className="flex gap-4">
                   <div className="w-12 h-12 bg-white rounded-xl border flex items-center justify-center text-slate-400">
                     <Star size={24} className={driver.rating > 4.5 ? 'text-amber-400 fill-amber-400' : ''} />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{driver.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{driver.trips} ট্রিপ সম্পন্ন</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-black text-emerald-600">{driver.onTime}% On-time</p>
                   <p className="text-[10px] text-slate-400 mt-1">Rating: {driver.rating}</p>
                </div>
             </div>
           ))}
        </div>
      </Card>

      <Card title="যানবাহন মনিটরিং ডাটা">
         <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
             <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">
                  <th className="pb-3">প্লেট নম্বর</th>
                  <th className="pb-3 text-center">ট্রিপ</th>
                  <th className="pb-3 text-center">ব্রেকডাউন</th>
                  <th className="pb-3 text-right">অবস্থা</th>
                </tr>
             </thead>
             <tbody>
                {VEHICLE_PERFORMANCE.map(v => (
                  <tr key={v.id} className="border-b border-slate-50 dark:border-slate-800 last:border-0">
                    <td className="py-4 font-bold text-slate-700 dark:text-slate-300">{v.plate}</td>
                    <td className="py-4 text-center">{v.trips}</td>
                    <td className="py-4 text-center text-red-500 font-bold">{v.breakdown}</td>
                    <td className="py-4 text-right">
                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                         {v.status}
                       </span>
                    </td>
                  </tr>
                ))}
             </tbody>
           </table>
         </div>
      </Card>
    </div>
  );
};

export default TransportReports;
