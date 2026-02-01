
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './UI/Card';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  MapPin, 
  CloudRain, 
  Sun,
  AlertCircle,
  ArrowRight,
  Navigation,
  Cloud,
  Zap,
  SunMedium,
  RefreshCw,
  Sparkles,
  Calendar,
  ChevronDown,
  Waves,
  Sprout,
  ArrowUpRight,
  Bug,
  Info,
  CheckCircle2
} from 'lucide-react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { getAgriInsights } from '../lib/ai';

// Fix: Cast motion to any to avoid property 'layout', 'initial', 'animate', etc. errors in this environment
const motion = m as any;

interface WeatherData {
  temp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  visibility: number;
  rainChance: number;
  description: string;
  soilTemp: number;
  rainfall: number;
  dewPoint: number;
  evap: number;
}

const DISTRICT_DATA: Record<string, Partial<WeatherData>> = {
  'মুন্সিগঞ্জ': { temp: 34, humidity: 65, windSpeed: 12, condition: 'Cloudy Sun' },
  'ঢাকা': { temp: 36, humidity: 55, windSpeed: 10, condition: 'Sunny' },
  'বগুড়া': { temp: 31, humidity: 75, windSpeed: 15, condition: 'Rainy' },
  'রংপুর': { temp: 28, humidity: 80, windSpeed: 18, condition: 'Cloudy' },
  'রাজশাহী': { temp: 38, humidity: 40, windSpeed: 8, condition: 'Sunny' },
};

const CROP_WEATHER_PROFILE = [
  { 
    id: 'potato', 
    name: 'আলু (Potato)', 
    optTemp: [15, 25], 
    optHum: [70, 85], 
    risk: 'Late Blight', 
    riskIcon: <Bug size={14} />,
    desc: 'ঠান্ডা ও শুষ্ক আবহাওয়া ভালো' 
  },
  { 
    id: 'onion', 
    name: 'পেঁয়াজ (Onion)', 
    optTemp: [13, 24], 
    optHum: [60, 70], 
    risk: 'Thrips', 
    riskIcon: <Bug size={14} />,
    desc: 'অতিরিক্ত আর্দ্রতায় পচন ঝুঁকি' 
  },
  { 
    id: 'paddy', 
    name: 'ধান (Rice)', 
    optTemp: [20, 35], 
    optHum: [60, 90], 
    risk: 'Blast Disease', 
    riskIcon: <Bug size={14} />,
    desc: 'উষ্ণ ও আর্দ্র আবহাওয়া উপযোগী' 
  },
  { 
    id: 'tomato', 
    name: 'টমেটো (Tomato)', 
    optTemp: [18, 28], 
    optHum: [60, 80], 
    risk: 'Fruit Borer', 
    riskIcon: <Bug size={14} />,
    desc: 'পরিষ্কার আকাশ ও মাঝারি রোদ' 
  },
];

const WeatherPage: React.FC = () => {
  const [location, setLocation] = useState('মুন্সিগঞ্জ');
  const [weather, setWeather] = useState<WeatherData>({
    temp: 34,
    feelsLike: 37,
    condition: 'Cloudy Sun',
    humidity: 65,
    windSpeed: 12,
    uvIndex: 6,
    visibility: 10,
    rainChance: 20,
    description: 'আংশিক মেঘলা আকাশ',
    soilTemp: 28,
    rainfall: 2.4,
    dewPoint: 22,
    evap: 5.1
  });
  
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const trendData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = (i * 2);
      return {
        time: `${hour === 0 ? '12' : hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`,
        temp: weather.temp + Math.sin(i / 2) * 3,
        humidity: weather.humidity + Math.cos(i / 2) * 8,
      };
    });
  }, [weather]);

  const fetchWeather = (loc: string) => {
    setIsRefreshing(true);
    const base = DISTRICT_DATA[loc] || DISTRICT_DATA['মুন্সিগঞ্জ'];
    
    setTimeout(() => {
      const newWeather: WeatherData = {
        temp: (base.temp || 30) + (Math.floor(Math.random() * 2) - 1),
        feelsLike: (base.temp || 30) + 2,
        condition: base.condition || 'Sunny',
        humidity: (base.humidity || 60) + (Math.floor(Math.random() * 8) - 4),
        windSpeed: (base.windSpeed || 10) + Math.floor(Math.random() * 3),
        uvIndex: Math.floor(Math.random() * 8) + 1,
        visibility: 9 + Math.floor(Math.random() * 2),
        rainChance: base.condition === 'Rainy' ? 80 : base.condition === 'Cloudy' ? 40 : 15,
        description: base.condition === 'Sunny' ? 'পরিষ্কার আকাশ' : base.condition === 'Rainy' ? 'বৃষ্টির সম্ভাবনা' : 'আংশিক মেঘলা',
        soilTemp: (base.temp || 30) - 4,
        rainfall: base.condition === 'Rainy' ? 10.5 : 0.2,
        dewPoint: (base.temp || 30) - 7,
        evap: base.condition === 'Sunny' ? 6.8 : 3.4
      };
      setWeather(newWeather);
      setIsRefreshing(false);
      generateAdvice(loc, newWeather);
    }, 600);
  };

  const generateAdvice = async (loc: string, data: WeatherData) => {
    setLoadingAdvice(true);
    const prompt = `Current weather in ${loc}, Bangladesh: ${data.temp}°C, ${data.description}, Humidity ${data.humidity}%. Give 3 specific agricultural advice for Potato and Rice. Professional Bangla.`;
    const result = await getAgriInsights(prompt);
    setAiAdvice(result);
    setLoadingAdvice(false);
  };

  useEffect(() => {
    fetchWeather(location);
  }, [location]);

  const getWeatherIcon = (condition: string, size = 24) => {
    switch (condition) {
      case 'Sunny': return <Sun className="text-amber-400" size={size} />;
      case 'Rainy': return <CloudRain className="text-blue-400" size={size} />;
      case 'Cloudy': return <Cloud className="text-slate-400" size={size} />;
      default: return <CloudSun className="text-amber-300" size={size} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HEADER: Standardized sizing with larger fonts */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
            <CloudSun className="text-emerald-600" size={32} />
            আবহাওয়া ও কৃষি বুদ্ধিমত্তা
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium mt-1">সঠিক আবহাওয়া বার্তায় স্মার্ট কৃষি সিদ্ধান্ত গ্রহণ</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 z-10" />
            <select 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-base text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer shadow-sm"
            >
              {Object.keys(DISTRICT_DATA).map(d => <option key={d} value={d}>{d}, বাংলাদেশ</option>)}
            </select>
            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button 
            onClick={() => fetchWeather(location)}
            className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center"
          >
            <RefreshCw size={22} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* MAIN WEATHER CARD: Optimized visual hierarchy and larger text */}
        <div className="xl:col-span-8 space-y-8">
          <motion.div 
            layout
            className={`rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl transition-all duration-700 ${
              weather.condition === 'Rainy' ? 'bg-indigo-600' :
              weather.condition === 'Sunny' ? 'bg-amber-500' :
              'bg-emerald-600'
            }`}
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              {getWeatherIcon(weather.condition, 240)}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest border border-white/20 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                  লাইভ আপডেট
                </span>
                <span className="text-xs font-bold opacity-80 uppercase tracking-widest">{location} এর আবহাওয়া</span>
              </div>
              
              <div className="mt-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="flex items-center gap-8">
                  <motion.span 
                    key={weather.temp}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-7xl md:text-8xl font-black tracking-tighter"
                  >
                    {weather.temp}°
                  </motion.span>
                  <div className="space-y-1">
                    <p className="text-2xl md:text-4xl font-black italic">{weather.description}</p>
                    <p className="text-sm md:text-lg font-bold opacity-80 flex items-center gap-2">
                      <Thermometer size={18} /> অনুভূত তাপমাত্রা {weather.feelsLike}°C
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 min-w-[280px]">
                  <MiniMetric icon={<Wind size={18} />} label="বাতাস" value={`${weather.windSpeed} km/h`} />
                  <MiniMetric icon={<Droplets size={18} />} label="আর্দ্রতা" value={`${weather.humidity}%`} />
                  <MiniMetric icon={<Thermometer size={18} />} label="মাটির তাপ" value={`${weather.soilTemp}°C`} />
                  <MiniMetric icon={<Waves size={18} />} label="শিশিরাঙ্ক" value={`${weather.dewPoint}°C`} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* GRID: Unified Agricultural Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card title="২৪ ঘণ্টার বিশ্লেষণ" subtitle="তাপমাত্রা ও আর্দ্রতা ট্রেন্ড">
              <div className="h-[280px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" fontSize={11} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                    <YAxis fontSize={11} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="temp" stroke="#fbbf24" strokeWidth={3} fill="url(#tempGrad)" name="তাপমাত্রা" />
                    <Area type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={3} fill="url(#humGrad)" name="আর্দ্রতা" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="কৃষি জলবায়ু ডাটা" actions={<Info size={18} className="text-slate-300" />}>
               <div className="space-y-6 mt-4">
                  <AgriBar label="বৃষ্টির সম্ভাবনা" value={weather.rainChance} unit="%" color="bg-blue-500" subText={`${weather.rainfall}mm ভলিউম রেকর্ড হতে পারে`} />
                  <AgriBar label="বাষ্পীভবন (Evap)" value={Math.min(100, weather.evap * 10)} unit="" color="bg-orange-500" subText={`${weather.evap}mm প্রতিদিন`} />
                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">UV ইনডেক্স</p>
                      <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-2">{weather.uvIndex} <span className="text-xs font-bold text-amber-600 uppercase ml-1">মাঝারি</span></p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">দৃশ্যমানতা</p>
                      <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-2">{weather.visibility} km</p>
                    </div>
                  </div>
               </div>
            </Card>
          </div>

          {/* CROP MONITOR: List of crop profiles with larger text */}
          <div className="space-y-6">
            <h3 className="text-base font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-3">
              <Sprout size={20} className="text-emerald-500" /> ফসল ভিত্তিক আবহাওয়া পর্যবেক্ষণ
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {CROP_WEATHER_PROFILE.map((crop) => {
                 const tempMatch = weather.temp >= crop.optTemp[0] && weather.temp <= crop.optTemp[1];
                 const humMatch = weather.humidity >= crop.optHum[0] && weather.humidity <= crop.optHum[1];
                 const overallMatch = tempMatch && humMatch;

                 return (
                   <div key={crop.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-6 group hover:border-emerald-500 hover:shadow-xl transition-all duration-300">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${overallMatch ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {overallMatch ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                           <h4 className="text-base md:text-lg font-black text-slate-800 dark:text-slate-100 truncate">{crop.name}</h4>
                           <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${overallMatch ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                             {overallMatch ? 'Optimal' : 'Caution'}
                           </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-1 leading-relaxed">{crop.desc}</p>
                        <div className="flex items-center gap-2 mt-3">
                           <div className="flex items-center gap-1.5 text-red-500 text-xs font-black uppercase">
                             {crop.riskIcon} {crop.risk} ঝুঁকি
                           </div>
                        </div>
                     </div>
                   </div>
                 );
               })}
            </div>
          </div>
        </div>

        {/* SIDEBAR: Advisory & Forecast with improved font sizes */}
        <div className="xl:col-span-4 space-y-8">
          <Card className="bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 p-8">
             <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 mb-6">
               <Sparkles size={24} className="animate-pulse" />
               <h4 className="text-sm font-black uppercase tracking-widest">স্মার্ট কৃষি পরামর্শ</h4>
             </div>

             <div className="space-y-6">
               <AnimatePresence mode="wait">
                 {loadingAdvice ? (
                   <div className="space-y-4">
                     {[1, 2, 3].map(i => <div key={i} className="h-5 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg w-full" />)}
                   </div>
                 ) : (
                   <div className="space-y-6">
                      {aiAdvice ? (
                        aiAdvice.split('\n').filter(l => l.trim()).map((line, i) => (
                          <div key={i} className="flex gap-4 items-start group">
                             <div className="w-6 h-6 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-emerald-500 shadow-md shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                <ArrowUpRight size={14} />
                             </div>
                             <p className="text-base text-slate-700 dark:text-slate-300 font-bold leading-relaxed">{line.replace(/^\d+\.\s*/, '').replace(/^- \s*/, '')}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400 italic">পরামর্শ লোড হচ্ছে...</p>
                      )}
                   </div>
                 )}
               </AnimatePresence>
               
               <button className="w-full mt-6 py-4 bg-white dark:bg-slate-800 border border-emerald-600 text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-md flex items-center justify-center gap-3">
                  <Calendar size={18} /> পূর্ণাঙ্গ কৃষি ক্যালেন্ডার দেখুন
               </button>
             </div>
          </Card>

          {/* 5-DAY FORECAST: Standardized list with larger font */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-3">৫ দিনের পূর্বাভাস</h4>
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700 shadow-sm">
              {[
                { day: 'আগামীকাল', temp: '৩২°', status: 'মেঘলা', icon: <CloudSun className="text-slate-400" size={20} /> },
                { day: 'মঙ্গলবার', temp: '৩৪°', status: 'রৌদ্রোজ্জ্বল', icon: <Sun className="text-amber-500" size={20} /> },
                { day: 'বুধবার', temp: '৩০°', status: 'বৃষ্টি', icon: <CloudRain className="text-blue-500" size={20} /> },
                { day: 'বৃহস্পতিবার', temp: '২৯°', status: 'বজ্রবৃষ্টি', icon: <Zap className="text-indigo-500" size={20} /> },
                { day: 'শুক্রবার', temp: '৩১°', status: 'মেঘলা', icon: <Cloud className="text-slate-500" size={20} /> },
              ].map((item, idx) => (
                <div key={idx} className="p-5 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 dark:text-slate-200">{item.day}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase mt-0.5 tracking-tight">{item.status}</p>
                    </div>
                  </div>
                  <p className="text-xl font-black text-slate-900 dark:text-slate-100">{item.temp}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
             <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                <Navigation size={140} />
             </div>
             <div className="relative z-10">
                <h4 className="text-lg font-black italic mb-2 tracking-tight">অফিসার সাপোর্ট</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  আপনার এলাকার ব্লক অফিসারের সরাসরি পরামর্শ নিতে যোগাযোগ করুন।
                </p>
                <button className="mt-6 flex items-center gap-3 text-sm font-black text-emerald-400 hover:text-emerald-300 transition-all uppercase tracking-widest underline decoration-2 underline-offset-8">
                   সহায়তা নিন <ArrowRight size={18} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MiniMetric = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col gap-1 transition-transform hover:scale-105">
    <div className="flex items-center gap-2 text-white/60 mb-0.5">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-lg font-black">{value}</p>
  </div>
);

const AgriBar = ({ label, value, unit, color, subText }: { label: string, value: number, unit: string, color: string, subText: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="text-right">
        <span className="text-sm font-black text-slate-800 dark:text-slate-100">{value}{unit}</span>
      </div>
    </div>
    <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.2, ease: "easeOut" }} className={`h-full ${color} shadow-sm`} />
    </div>
    <p className="text-xs text-slate-400 font-bold italic">{subText}</p>
  </div>
);

export default WeatherPage;
