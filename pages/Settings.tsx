
import React, { useState } from 'react';
import { Card } from '../components/UI/Card';
import { Tabs } from '../components/UI/Tabs';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Warehouse, 
  ShieldCheck, 
  RotateCcw, 
  Upload, 
  MapPin, 
  Info,
  Smartphone,
  Moon,
  Sun,
  Database,
  Trash2,
  ShieldAlert,
  Save,
  Shield,
  Truck,
  Sprout,
  CheckCircle2
} from 'lucide-react';
import { useRole } from '../App';
import { useSettings } from '../context/SettingsContext';
import { motion as m, AnimatePresence } from 'framer-motion';
import { MOCK_CHAMBERS } from '../data/dummyData';
import { useNavigate } from 'react-router-dom';

// Fix: Cast motion to any to avoid property 'initial', 'animate', etc. errors in this environment
const motion = m as any;

type SettingsTab = 'profile' | 'preferences' | 'notifications' | 'storage' | 'security';

const Settings: React.FC = () => {
  const { role, setRole } = useRole();
  const { settings, updateSetting, resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin = role === 'ADMIN';
  const isManager = role === 'STORAGE_MANAGER' || isAdmin;

  const tabs = [
    { id: 'profile', label: 'প্রোফাইল', icon: <User size={20} /> },
    { id: 'preferences', label: 'পছন্দসমূহ', icon: <SettingsIcon size={20} /> },
    { id: 'notifications', label: 'নোটিফিকেশন', icon: <Bell size={20} /> },
    ...(isManager ? [{ id: 'storage', label: 'স্টোরেজ কনফিগ', icon: <Warehouse size={20} /> }] : []),
    ...(isAdmin ? [{ id: 'security', label: 'নিরাপত্তা', icon: <ShieldCheck size={20} /> }] : []),
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">সেটিংস (Settings)</h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium mt-2">আপনার অ্যাপ্লিকেশন কাস্টমাইজ এবং অ্যাকাউন্ট ব্যবস্থাপনা করুন</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={resetSettings}
             className="flex items-center gap-3 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
           >
             <RotateCcw size={18} /> রিসেট
           </button>
           <button 
             onClick={handleSave}
             className="flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all"
           >
             {isSaving ? <RotateCcw size={18} className="animate-spin" /> : <Save size={18} />} 
             সেভ করুন
           </button>
        </div>
      </div>

      <div className="flex justify-center md:justify-start">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as SettingsTab)} className="overflow-x-auto max-w-full" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'profile' && <ProfileTab role={role} setRole={setRole} />}
          {activeTab === 'preferences' && <PreferencesTab settings={settings} updateSetting={updateSetting} />}
          {activeTab === 'notifications' && <NotificationsTab settings={settings} updateSetting={updateSetting} />}
          {activeTab === 'storage' && <StorageConfigTab settings={settings} updateSetting={updateSetting} isAdmin={isAdmin} />}
          {activeTab === 'security' && <SecurityTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ProfileTab = ({ role, setRole }: { role: string, setRole: any }) => {
  const roles_data = [
    { id: 'ADMIN', label: 'এডমিনিস্ট্রেটর', sub: 'Full System Access', icon: <Shield size={22} />, color: 'emerald' },
    { id: 'STORAGE_MANAGER', label: 'স্টোরেজ ম্যানেজার', sub: 'Warehouse Control', icon: <Warehouse size={22} />, color: 'teal' },
    { id: 'TRANSPORT_MANAGER', label: 'ট্রান্সপোর্ট ম্যানেজার', sub: 'Logistics Tracking', icon: <Truck size={22} />, color: 'blue' },
    { id: 'FARMER', label: 'কৃষক (Farmer)', sub: 'Harvest & Booking', icon: <Sprout size={22} />, color: 'emerald' },
  ];

  const roleForms: Record<string, { fields: { label: string; placeholder: string; key: string }[], note?: string }> = {
    ADMIN: {
      fields: [
        { key: 'adminName', label: 'অ্যাডমিন নাম', placeholder: 'যেমন: নওশাদ করিম' },
        { key: 'adminEmail', label: 'অ্যাডমিন ইমেইল', placeholder: 'admin@ifarm.com' },
        { key: 'adminPhone', label: 'যোগাযোগ নম্বর', placeholder: '+8801XXXXXXXXX' }
      ],
      note: 'এডমিনরা সিস্টেম কনফিগারেশন, ইউজার অ্যান্ড ডাটা অডিট ম্যানেজ করেন।'
    },
    STORAGE_MANAGER: {
      fields: [
        { key: 'managerName', label: 'ম্যানেজার নাম', placeholder: 'যেমন: সায়মন আলী' },
        { key: 'managerShift', label: 'দায়িত্বের সময়সূচি', placeholder: 'উদা: সকাল ৮টা - রাত ৮টা' },
        { key: 'managerDesk', label: 'স্টোরেজ সাইট / ডেস্ক', placeholder: 'বগুড়া কোল্ড স্টোরেজ' }
      ],
      note: 'স্টোরেজ ম্যানেজার স্টক-ইন রিকোয়েস্ট অনুমোদন ও চেম্বার বরাদ্দ করেন।'
    },
    TRANSPORT_MANAGER: {
      fields: [
        { key: 'transportLead', label: 'ট্রান্সপোর্ট হেড', placeholder: 'যেমন: লিমন মিয়া' },
        { key: 'fleetCount', label: 'ফ্লিট সংখ্যা', placeholder: '৫টি ট্রাক' },
        { key: 'hubLocation', label: 'হাব অবস্থান', placeholder: 'ঢাকা, কারওয়ান বাজার' }
      ],
      note: 'ট্রান্সপোর্ট ম্যানেজার ডেলিভারি রুট, ETA ও অবস্থা নজরদারি করেন।'
    },
    FARMER: {
      fields: [
        { key: 'farmerVillage', label: 'গ্রামের নাম', placeholder: 'উদা: শিবগঞ্জ, বগুড়া' },
        { key: 'farmerAssociation', label: 'কৃষক সমিতি', placeholder: 'মহাস্থান কৃষক সমবায়' },
        { key: 'farmerAcre', label: 'আবাদকৃত জমি', placeholder: '৪ একর' }
      ],
      note: 'কৃষকরা ফসল সংগ্রহ, বুকিং ও স্টক অবস্থার তথ্য এখানে আপডেট রাখতে পারেন।'
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
      <div className="md:col-span-1 space-y-8">
        <Card className="text-center overflow-hidden">
          <div className="relative w-36 h-36 mx-auto mb-8 group">
            <div className="w-full h-full rounded-[3rem] bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-5xl font-black text-white shadow-2xl border-4 border-white dark:border-slate-800 transition-transform group-hover:scale-105 duration-500">
              {role[0]}
            </div>
            <button className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-700 shadow-xl rounded-2xl text-emerald-600 border border-slate-100 dark:border-slate-600 hover:bg-emerald-50 transition-colors">
              <Upload size={22} />
            </button>
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter mb-2">
            {roles_data.find(r => r.id === role)?.label || role}
          </h3>
          <p className="text-xs text-slate-400 font-black tracking-[0.2em] uppercase mb-8">ID: IF-99420-BD</p>
          
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-700">
             <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
               <span>অ্যাকাউন্ট স্ট্যাটাস</span>
               <span className="text-emerald-600">Active</span>
             </div>
             <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full">
                <div className="w-full h-full bg-emerald-500 rounded-full"></div>
             </div>
          </div>
        </Card>
      </div>

      <Card title="ইউজার রোল সিমুলেশন" subtitle="টেস্টিং এর জন্য বিভিন্ন রোলের অ্যাক্সেস পরিবর্তন করুন" className="md:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {roles_data.map((r) => {
            const isActive = role === r.id;
            return (
              <motion.button
                key={r.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRole(r.id)}
                className={`relative flex items-center gap-6 p-6 rounded-[2rem] border-2 text-left transition-all ${
                  isActive 
                    ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 shadow-xl' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-emerald-200'
                }`}
              >
                <div className={`p-4 rounded-2xl ${
                  isActive ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500'
                }`}>
                  {r.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`text-lg font-black ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    {r.label}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight mt-1">{r.sub}</p>
                </div>
                {isActive && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 text-emerald-600">
                    <CheckCircle2 size={24} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-700">
          <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8">প্রোফাইল তথ্য ({roles_data.find(r => r.id === role)?.label})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {roleForms[role]?.fields.map(field => (
              <div className="space-y-3" key={field.key}>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{field.label}</label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-base font-black text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <textarea
                placeholder="বিশদ বিবরণ / মন্তব্য"
                className="w-full h-32 p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-base font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 transition-all"
              ></textarea>
              {roleForms[role]?.note && (
                <p className="text-xs text-slate-400 font-bold mt-2">{roleForms[role]?.note}</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const PreferencesTab = ({ settings, updateSetting }: { settings: any, updateSetting: any }) => (
  <div className="space-y-10">
     <Card title="অ্যাপ্লিকেশন ভিজ্যুয়াল ও ভাষা">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-6">
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">ভাষা (Language)</p>
              <div className="flex gap-4">
                 {['BN', 'EN'].map(l => (
                   <button 
                     key={l}
                     onClick={() => updateSetting('language', l)}
                     className={`flex-1 py-5 rounded-2xl text-sm font-black border-2 transition-all ${settings.language === l ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-700'}`}
                   >
                     {l === 'BN' ? 'বাংলা' : 'English'}
                   </button>
                 ))}
              </div>
           </div>
           <div className="space-y-6">
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">থিম (Theme)</p>
              <div className="flex gap-4">
                 {[
                   { id: 'light', icon: <Sun size={20} />, label: 'Light' },
                   { id: 'dark', icon: <Moon size={20} />, label: 'Dark' }
                 ].map(t => (
                   <button 
                     key={t.id}
                     onClick={() => updateSetting('theme', t.id)}
                     className={`flex-1 py-5 flex items-center justify-center gap-3 rounded-2xl text-sm font-black border-2 transition-all ${settings.theme === t.id ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-700'}`}
                   >
                     {t.icon} {t.label}
                   </button>
                 ))}
              </div>
           </div>
        </div>
     </Card>

     <Card title="আঞ্চলিক ফরম্যাট ও পরিমাপ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">তারিখ ফরম্যাট</label>
              <select 
                value={settings.dateFormat}
                onChange={(e) => updateSetting('dateFormat', e.target.value)}
                className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-base font-black text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500"
              >
                 <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                 <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
           </div>
           <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">ওজন ইউনিট</label>
              <select 
                value={settings.weightUnit}
                onChange={(e) => updateSetting('weightUnit', e.target.value)}
                className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-base font-black text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500"
              >
                 <option value="KG">কেজি (KG)</option>
                 <option value="TON">টন (TON)</option>
              </select>
           </div>
           <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">তাপমাত্রা ইউনিট</label>
              <select 
                value={settings.tempUnit}
                onChange={(e) => updateSetting('tempUnit', e.target.value)}
                className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-base font-black text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500"
              >
                 <option value="°C">সেলসিয়াস (°C)</option>
                 <option value="°F">ফারেনহাইট (°F)</option>
              </select>
           </div>
        </div>
     </Card>
  </div>
);

const NotificationsTab = ({ settings, updateSetting }: { settings: any, updateSetting: any }) => (
  <div className="space-y-8">
    <Card title="পুশ নোটিফিকেশন সেটিংস">
      <div className="space-y-6 mt-4">
        {[
          { id: 'expiry', label: 'মেয়াদ শেষ হওয়ার সতর্কতা', desc: 'পণ্যের মেয়াদ শেষ হওয়ার ৭ দিন আগে জানানো হবে।' },
          { id: 'sensor', label: 'সেন্সর অ্যালার্ট', desc: 'তাপমাত্রা বা আর্দ্রতা অস্বাভাবিক হলে সাথে সাথে জানানো হবে।' },
          { id: 'transport', label: 'ট্রান্সপোর্ট আপডেট', desc: 'যানবাহন গন্তব্যে পৌঁছালে বা বিলম্বিত হলে আপডেট পাবেন।' },
          { id: 'booking', label: 'বুকিং কনফার্মেশন', desc: 'আপনার বুকিং রিকোয়েস্টের অবস্থা পরিবর্তিত হলে জানানো হবে।' },
          { id: 'payment', label: 'পেমেন্ট রিমাইন্ডার', desc: 'বকেয়া পেমেন্ট এবং ইনভয়েস সংক্রান্ত তথ্য।' },
        ].map(item => (
          <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
            <div>
              <p className="text-lg font-black text-slate-800 dark:text-slate-100">{item.label}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-1.5 leading-relaxed">{item.desc}</p>
            </div>
            <button 
              onClick={() => updateSetting(`notifications.${item.id}`, !settings.notifications[item.id])}
              className={`w-16 h-8 rounded-full relative transition-all duration-500 ${settings.notifications[item.id] ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all ${settings.notifications[item.id] ? 'left-9' : 'left-1.5'}`}></div>
            </button>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const StorageConfigTab = ({ settings, updateSetting, isAdmin }: { settings: any, updateSetting: any, isAdmin: boolean }) => (
  <div className="space-y-10">
    <Card title="ভাড়া ও রেট কনফিগারেশন" subtitle={!isAdmin ? "শুধুমাত্র এডমিন রেট পরিবর্তন করতে পারবেন" : "স্টোরেজ ও মেইনটেন্যান্স রেট ম্যানেজমেন্ট"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
        <div className="space-y-4">
          <label className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">সাধারণ ভাড়া (৳ প্রতি কেজি/দিন)</label>
          <input 
            type="number" 
            disabled={!isAdmin}
            value={settings.storageConfig.rentRate}
            onChange={(e) => updateSetting('storageConfig.rentRate', Number(e.target.value))}
            className="w-full p-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-[1.5rem] font-black text-2xl text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 disabled:opacity-40" 
          />
        </div>
        <div className="space-y-4">
          <label className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">অ্যালার্ট দিন (মেয়াদ শেষ হওয়ার আগে)</label>
          <input 
            type="number" 
            value={settings.storageConfig.alertDays}
            onChange={(e) => updateSetting('storageConfig.alertDays', Number(e.target.value))}
            className="w-full p-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-[1.5rem] font-black text-2xl text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500" 
          />
        </div>
      </div>
    </Card>

    <Card title="ফসল অনুযায়ী বিশেষ রেট (৳)">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
         {Object.entries(settings.storageConfig.specialRates).map(([crop, rate]: [string, any]) => (
           <div key={crop} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-700">
             <span className="text-lg font-black text-slate-700 dark:text-slate-300">{crop}</span>
             <div className="flex items-center gap-4">
               <input 
                 type="number" 
                 disabled={!isAdmin}
                 value={rate}
                 onChange={(e) => updateSetting(`storageConfig.specialRates.${crop}`, Number(e.target.value))}
                 className="w-32 p-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-black text-xl text-right text-emerald-600 outline-none focus:border-emerald-500 disabled:opacity-40"
               />
               <span className="text-sm font-black text-slate-400 uppercase tracking-widest">৳</span>
             </div>
           </div>
         ))}
       </div>
    </Card>
  </div>
);

const SecurityTab = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <Card title="নিরাপত্তা সেটিংস">
        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 transition-all hover:shadow-lg">
             <div className="flex items-center gap-6">
               <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-md text-slate-400"><ShieldAlert size={32} /></div>
               <div>
                 <p className="text-xl font-black text-slate-800 dark:text-slate-100">অডিট লগ (Audit Logs)</p>
                 <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-2">সিস্টেমের সকল কার্যক্রমের বিস্তারিত ইতিহাস দেখুন।</p>
               </div>
             </div>
             <button 
               onClick={() => navigate('/settings/audit-logs')}
               className="px-10 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all"
             >
               দেখুন
             </button>
          </div>

          <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 transition-all opacity-60">
             <div className="flex items-center gap-6">
               <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-md text-slate-400"><Shield size={32} /></div>
               <div>
                 <p className="text-xl font-black text-slate-800 dark:text-slate-100">টু-ফ্যাক্টর অথেনটিকেশন</p>
                 <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-2">আপনার অ্যাকাউন্টের নিরাপত্তা আরও বাড়ান।</p>
               </div>
             </div>
             <button className="px-10 py-4 bg-slate-200 dark:bg-slate-700 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-slate-500 cursor-not-allowed">
               শীঘ্রই আসছে
             </button>
          </div>
        </div>
      </Card>

      <Card title="বিপজ্জনক অঞ্চল (Danger Zone)" className="border-red-100 dark:border-red-900/30">
        <div className="mt-4">
          <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-red-50/50 dark:bg-red-900/10 rounded-[2.5rem] border border-red-100 dark:border-red-900/20 gap-6">
             <div>
                <p className="text-xl font-black text-red-800 dark:text-red-400">অ্যাকাউন্ট মুছুন</p>
                <p className="text-sm text-red-600/70 dark:text-red-500/70 mt-2 font-bold leading-relaxed">একবার মুছে ফেললে আপনার সকল ডেটা চিরতরে হারিয়ে যাবে। এই কাজটি আর ফিরিয়ে আনা সম্ভব হবে না।</p>
             </div>
             <button className="w-full md:w-auto flex items-center justify-center gap-4 px-12 py-5 bg-red-600 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-2xl shadow-red-100">
               <Trash2 size={22} /> অ্যাকাউন্ট মুছুন
             </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
