
import React, { useState, useMemo } from 'react';
import { Card } from '../components/UI/Card';
import { Table } from '../components/UI/Table';
import { MOCK_MARKET_PRICES } from '../data/dummyData';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Info, 
  Sparkles, 
  ShoppingCart, 
  MapPin, 
  Calendar, 
  ArrowUpRight, 
  BarChart3, 
  Filter,
  ArrowRight,
  Target,
  Zap,
  ChevronRight,
  Search
} from 'lucide-react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';

// Fix: Cast motion to any to avoid property 'whileHover' errors in this environment
const motion = m as any;

// Simulated historical data for the trend chart
const HISTORICAL_TRENDS = [
  { month: 'জানু', potato: 28, onion: 45, tomato: 30 },
  { month: 'ফেব্রু', potato: 30, onion: 48, tomato: 35 },
  { month: 'মার্চ', potato: 35, onion: 60, tomato: 40 },
  { month: 'এপ্রিল', potato: 32, onion: 55, tomato: 38 },
  { month: 'মে', potato: 38, onion: 65, tomato: 42 },
  { month: 'জুন', potato: 42, onion: 70, tomato: 55 },
];

const MarketPrices: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<'potato' | 'onion' | 'tomato'>('potato');
  const [searchTerm, setSearchTerm] = useState('');

  const cropConfig = {
    potato: { label: 'আলু', color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    onion: { label: 'পেঁয়াজ', color: '#0ea5e9', bg: 'bg-blue-50', text: 'text-blue-600' },
    tomato: { label: 'টমেটো', color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-600' },
  };

  const filteredMarketData = useMemo(() => {
    if (!searchTerm) return MOCK_MARKET_PRICES;
    return MOCK_MARKET_PRICES.filter(m => 
      m.district.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const columns = [
    { 
      header: 'জেলা (District)', 
      render: (i: any) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors border border-slate-100 dark:border-slate-800">
            <MapPin size={18} />
          </div>
          <span className="font-black text-slate-800 dark:text-slate-100 text-lg tracking-tight">{i.district}</span>
        </div>
      )
    },
    { 
      header: 'আলু (কেজি)', 
      render: (i: any) => (
        <div className="space-y-1">
          <span className={`font-black text-lg ${selectedCrop === 'potato' ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}>৳{i.potato}</span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Wholesale</p>
          </div>
        </div>
      )
    },
    { 
      header: 'পেঁয়াজ', 
      render: (i: any) => (
        <div className="space-y-1">
          <span className={`font-black text-lg ${selectedCrop === 'onion' ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}>৳{i.onion}</span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Wholesale</p>
          </div>
        </div>
      )
    },
    { 
      header: 'টমেটো', 
      render: (i: any) => (
        <div className="space-y-1">
          <span className={`font-black text-lg ${selectedCrop === 'tomato' ? 'text-amber-600' : 'text-slate-700 dark:text-slate-300'}`}>৳{i.tomato}</span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Wholesale</p>
          </div>
        </div>
      )
    },
    { 
      header: 'বাজার ট্রেন্ড', 
      render: (i: any) => (
        <div className={`flex items-center gap-2 font-black text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest border ${
          i.trend === 'Rising' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
          i.trend === 'Falling' ? 'bg-red-50 text-red-700 border-red-100' : 
          'bg-slate-50 text-slate-500 border-slate-100'
        }`}>
          {i.trend === 'Rising' ? <TrendingUp size={14} /> : i.trend === 'Falling' ? <TrendingDown size={14} /> : <Minus size={14} />}
          {i.trend === 'Rising' ? 'ঊর্ধ্বমুখী' : i.trend === 'Falling' ? 'নিম্নমুখী' : 'স্থিতিশীল'}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <ShoppingCart size={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em]">Market Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">বাজারদর (Market Prices)</h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl">দেশের বিভিন্ন জেলার বর্তমান পাইকারি বাজারদর ও ভবিষ্যৎ বিশ্লেষণ</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="px-6 py-4 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-xl flex items-center gap-4 group hover:border-emerald-500 transition-all">
             <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
               <Calendar size={20} />
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">সর্বশেষ আপডেট</p>
               <p className="text-base font-black text-slate-700 dark:text-slate-200">{new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
             </div>
          </div>
          <button className="w-full sm:w-auto px-8 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl hover:bg-black transition-all">
            <Filter size={18} /> কাস্টম ফিল্টার
          </button>
        </div>
      </div>

      {/* KPI Section - Reduced card size */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['potato', 'onion', 'tomato'].map((crop) => (
          <motion.button
            key={crop}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCrop(crop as any)}
            className={`p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${
              selectedCrop === crop 
                ? 'bg-white dark:bg-slate-800 border-emerald-500 shadow-xl ring-4 ring-emerald-500/5' 
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-200'
            }`}
          >
            <div className={`p-3.5 rounded-2xl w-fit mb-4 transition-all ${selectedCrop === crop ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'}`}>
              <Zap size={20} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{cropConfig[crop as keyof typeof cropConfig].label} ইনডেক্স</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">৳৩৯.৫০</h3>
              <div className="flex items-center gap-1.5 text-emerald-600 font-black text-xs">
                <TrendingUp size={14} /> +৪.২%
              </div>
            </div>
            {selectedCrop === crop && (
               <motion.div layoutId="active-dot" className="absolute top-6 right-6 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="xl:col-span-8 space-y-10">
          {/* Trend Chart Area */}
          <Card 
            title={`${cropConfig[selectedCrop].label} এর বাজার ট্রেন্ড (৬ মাস)`} 
            subtitle="বিগত মাসগুলোর মূল্যের তারতম্য ও প্রজেকশন"
            className="border-none shadow-2xl rounded-[3.5rem]"
          >
            <div className="h-[450px] mt-10 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HISTORICAL_TRENDS}>
                  <defs>
                    <linearGradient id="colorCrop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={cropConfig[selectedCrop].color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={cropConfig[selectedCrop].color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={14} tickLine={false} axisLine={false} tick={{fontWeight: 'bold'}} dy={15} />
                  <YAxis stroke="#94a3b8" fontSize={14} tickLine={false} axisLine={false} tick={{fontWeight: 'bold'}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '24px' }}
                    itemStyle={{ fontWeight: 'black', fontSize: '16px' }}
                  />
                  <Area 
                    name={`মূল্য (৳)`}
                    type="monotone" 
                    dataKey={selectedCrop} 
                    stroke={cropConfig[selectedCrop].color} 
                    strokeWidth={6} 
                    fill="url(#colorCrop)" 
                    activeDot={{ r: 10, fill: cropConfig[selectedCrop].color, strokeWidth: 4, stroke: '#fff' }} 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* District Table Area */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
               <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
                 <MapPin className="text-emerald-500" size={24} /> জেলা ভিত্তিক বর্তমান দর
               </h3>
               <div className="relative w-full sm:w-80 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="জেলা খুঁজুন..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all shadow-sm"
                  />
               </div>
            </div>
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden p-0">
              <Table data={filteredMarketData} columns={columns} keyExtractor={(i) => i.district} searchable={false} exportable />
            </Card>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="xl:col-span-4 space-y-10">
          {/* Selling Advice Overhaul */}
          <Card title="স্মার্ট বিক্রয় পরামর্শ" className="bg-emerald-50/20 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 rounded-[3rem] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
               <Sparkles size={180} />
             </div>
             
             <div className="space-y-6 mt-4 relative z-10">
               {[
                 { 
                   id: 'potato', 
                   action: 'Hold', 
                   tag: 'সাজেশন', 
                   desc: 'আগামী ১৫ দিনে মুন্সিগঞ্জ বাজারে আলুর চাহিদা ৫% বাড়ার সম্ভাবনা। এখনই বিক্রি না করে অপেক্ষা করুন।', 
                   color: 'emerald', 
                   icon: <Target size={24} /> 
                 },
                 { 
                   id: 'onion', 
                   action: 'Sell Fast', 
                   tag: 'সতর্কতা', 
                   desc: 'নতুন আমদানি আসার কারণে পেঁয়াজের দাম দ্রুত কমতে পারে। লস এড়াতে দ্রুত স্টক ছাড়ুন।', 
                   color: 'red', 
                   icon: <TrendingDown size={24} /> 
                 }
               ].map((item) => (
                 <motion.div 
                   key={item.id}
                   whileHover={{ x: 8 }} 
                   className="p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-md group cursor-default"
                 >
                   <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 rounded-2xl ${item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {item.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg ${
                        item.color === 'emerald' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {item.tag}
                      </span>
                   </div>
                   <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 italic">
                     {item.id === 'potato' ? 'আলু' : 'পেঁয়াজ'} <ArrowRight size={16} className="text-slate-300" /> <span className={item.color === 'emerald' ? 'text-emerald-600' : 'text-red-600'}>{item.action}</span>
                   </h4>
                   <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 font-bold leading-relaxed line-clamp-3">
                     {item.desc}
                   </p>
                   <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover:gap-3 transition-all cursor-pointer">
                      বিস্তারিত বিশ্লেষণ দেখুন <ChevronRight size={14} />
                   </div>
                 </motion.div>
               ))}
             </div>
             
             <button className="w-full mt-10 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-[0.15em] text-[11px] shadow-2xl shadow-emerald-100 dark:shadow-none flex items-center justify-center gap-4 hover:bg-emerald-700 transition-all hover:scale-[1.02]">
                পূর্ণাঙ্গ রিপোর্ট ডাউনলোড <ArrowUpRight size={20} />
             </button>
          </Card>

          {/* High Gainer / Top Market District */}
          <Card title="টপ ডিমান্ড মার্কেট (Top Markets)" actions={<div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />}>
             <div className="space-y-4">
                {[
                  { district: 'ঢাকা', price: '৳৪২.৫০', change: '+৫%', color: 'emerald' },
                  { district: 'চট্টগ্রাম', price: '৳৩৯.৮০', change: '+২%', color: 'blue' },
                  { district: 'সিলেট', price: '৳৪০.০০', change: '+৩.৫%', color: 'amber' }
                ].map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 shadow-sm border border-slate-50 dark:border-slate-700">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">{m.district} বাজার</p>
                        <div className="flex items-center gap-1.5 mt-1 text-emerald-600 font-black text-[10px] uppercase">
                          <TrendingUp size={12} /> {m.change} ডিমান্ড
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{m.price}</p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Avg Price</p>
                    </div>
                  </div>
                ))}
             </div>
          </Card>

          {/* Info Card */}
          <Card className="bg-slate-900 text-white p-10 border-none relative overflow-hidden rounded-[3rem] shadow-2xl">
             <div className="absolute -bottom-10 -right-10 p-8 opacity-10 pointer-events-none scale-150">
                <Info size={140} />
             </div>
             <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-500/20"><Info size={28} /></div>
                  <h4 className="font-black text-2xl italic tracking-tighter">ডাটা সোর্স গাইডলাইন</h4>
                </div>
                <div className="space-y-4">
                   <p className="text-sm text-slate-400 leading-relaxed font-medium">
                     এই তথ্যগুলো কৃষি বিপণন অধিদপ্তর এবং স্থানীয় পাইকারি আড়ত থেকে প্রতিদিন সকাল ৯টায় সরাসরি সংগ্রহ করা হয়। 
                   </p>
                   <div className="flex items-center gap-3 py-4 border-y border-white/5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">পরবর্তী আপডেট: আগামীকাল ৯:০০ AM</p>
                   </div>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;
