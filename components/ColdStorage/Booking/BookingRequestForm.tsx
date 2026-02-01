
import React, { useState, useMemo } from 'react';
import { Card } from '../../UI/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Thermometer, Truck, Calendar, Info, 
  AlertCircle, ChevronRight, CheckCircle2, Sparkles,
  Box, Inbox, Archive, Snowflake, Wind, Droplets,
  ArrowRight, MapPin, ClipboardList, HelpCircle
} from 'lucide-react';
import { mockDb } from '../../../data/mockDb';
import { createStockRecord } from '../../../lib/apiClient';

const CROP_PRESETS: Record<string, { temp: string, humidity: string, mode: string }> = {
  'Potato': { temp: '2-4°C', humidity: '85-90%', mode: 'Normal Cold' },
  'Onion': { temp: '0-2°C', humidity: '70-75%', mode: 'Normal Cold' },
  'Tomato': { temp: '10-12°C', humidity: '85-90%', mode: 'Controlled Humidity' },
  'Fish': { temp: '-18°C', humidity: '40-50%', mode: 'Deep Freeze' },
};

export const BookingRequestForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    crop: 'Potato',
    quantity: '',
    unit: 'TON' as 'KG' | 'TON',
    packaging: 'Sack',
    entryDate: '',
    releaseDate: '',
    mode: 'Normal Cold',
    temp: '2-4°C',
    humidity: '85-90%',
    transport: 'Farmer arranged',
    location: '',
    notes: ''
  });

  const preset = useMemo(() => CROP_PRESETS[formData.crop] || null, [formData.crop]);

  const handleCropChange = (crop: string) => {
    const p = CROP_PRESETS[crop];
    setFormData({
      ...formData,
      crop,
      mode: p?.mode || formData.mode,
      temp: p?.temp || formData.temp,
      humidity: p?.humidity || formData.humidity
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Convert quantity to KG if unit is TON
      const quantityKg = formData.unit === 'TON' 
        ? Number(formData.quantity) * 1000 
        : Number(formData.quantity);

      // Call backend API to create stock record
      await createStockRecord({
        cropType: formData.crop,
        quantityKg,
        entryDate: formData.entryDate,
        expiryDate: formData.releaseDate || undefined,
        status: 'pending'
      });

      // Also save to mockDb for local UI state
      const booking = {
        id: `BK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        farmerId: 'F-101',
        farmerName: 'মোঃ আব্দুর রহিম',
        crop: formData.crop,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        packaging: formData.packaging,
        entryDate: formData.entryDate,
        duration: 90,
        envDemand: {
          mode: formData.mode,
          temp: formData.temp,
          humidity: formData.humidity
        },
        logistics: {
          transport: formData.transport,
          location: formData.location
        },
        status: 'Pending' as const,
        createdAt: new Date().toISOString()
      };

      mockDb.saveBooking(booking);
      onSuccess();
    } catch (error) {
      console.error('Failed to submit stock request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const packagingTypes = [
    { id: 'Sack', label: 'বস্তা (Sack)', icon: <Inbox size={18} /> },
    { id: 'Crate', label: 'ক্রেট (Crate)', icon: <Box size={18} /> },
    { id: 'Carton', label: 'কার্টন (Carton)', icon: <Archive size={18} /> },
  ];

  const storageModes = [
    { id: 'Normal Cold', label: 'Normal Cold', desc: '0°C to 10°C', icon: <Thermometer size={20} /> },
    { id: 'Deep Freeze', label: 'Deep Freeze', desc: '-18°C or below', icon: <Snowflake size={20} /> },
    { id: 'Controlled Humidity', label: 'Humidity Control', desc: 'Regulated moisture', icon: <Droplets size={20} /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-900">
           <motion.div 
             className="h-full bg-emerald-500" 
             animate={{ width: `${(step / 3) * 100}%` }}
             transition={{ type: 'spring', stiffness: 50 }}
           />
        </div>
        <div className="flex justify-between items-center relative z-10">
          {[
            { s: 1, label: 'পণ্যের তথ্য', icon: <Package size={16} /> },
            { s: 2, label: 'পরিবেশ', icon: <Wind size={16} /> },
            { s: 3, label: 'লজিস্টিক', icon: <Truck size={16} /> }
          ].map((item) => (
            <div key={item.s} className="flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 ${
                step === item.s ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100 scale-110' : 
                step > item.s ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'
              }`}>
                {step > item.s ? <CheckCircle2 size={20} /> : item.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${step === item.s ? 'text-emerald-600' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <Card title="সেকশন ১: পণ্যের তথ্য (Product Info)" className="border-none shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      ফসল/পণ্য <HelpCircle size={10} className="text-slate-300" />
                    </label>
                  </div>
                  <select 
                    value={formData.crop}
                    onChange={(e) => handleCropChange(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                  >
                    <option value="Potato">আলু (Potato)</option>
                    <option value="Onion">পেঁয়াজ (Onion)</option>
                    <option value="Tomato">টমেটো (Tomato)</option>
                    <option value="Fish">মাছ (Fish)</option>
                    <option value="Other">অন্যান্য</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">পরিমান</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={formData.quantity}
                      onChange={e => setFormData({...formData, quantity: e.target.value})}
                      placeholder="যেমন: ১০"
                      className="flex-1 p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 transition-all outline-none" 
                    />
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                       {['KG', 'TON'].map(u => (
                         <button 
                           key={u}
                           onClick={() => setFormData({...formData, unit: u as any})}
                           className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${formData.unit === u ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}
                         >
                           {u === 'KG' ? 'কেজি' : 'টন'}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">প্যাকেজিং ধরন</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {packagingTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setFormData({...formData, packaging: type.id})}
                        className={`p-5 rounded-[2rem] border-2 transition-all flex items-center gap-4 text-left ${
                          formData.packaging === type.id 
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' 
                            : 'border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 hover:border-slate-200'
                        }`}
                      >
                        <div className={`p-3 rounded-2xl ${formData.packaging === type.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'}`}>
                          {type.icon}
                        </div>
                        <span className={`text-sm font-bold ${formData.packaging === type.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">সম্ভাব্য প্রবেশের তারিখ</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="date" 
                      value={formData.entryDate}
                      onChange={e => setFormData({...formData, entryDate: e.target.value})}
                      className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-slate-900 dark:text-slate-100 focus:border-emerald-500 transition-all outline-none" 
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card title="সেকশন ২: পরিবেশের চাহিদা (Environment Demand)" className="border-none shadow-xl">
              <div className="space-y-10">
                <div className="p-8 bg-emerald-600 rounded-[2.5rem] text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Sparkles size={120} />
                  </div>
                  <div className="relative z-10 flex items-center gap-6">
                    <div className="p-4 bg-white/20 backdrop-blur-md rounded-[2rem] border border-white/20">
                      <Sparkles size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black italic">formData.crop স্মার্ট সেটিংস সক্রিয়</h4>
                      <p className="text-xs text-emerald-100 mt-2 font-medium leading-relaxed max-w-md">
                        আমাদের এআই আপনার ফসলের জন্য {preset?.temp} তাপমাত্রা এবং {preset?.humidity} আর্দ্রতা রিকমেন্ড করছে যা পণ্যের ফ্রেশনেস দীর্ঘস্থায়ী করবে।
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">স্টোরেজ মোড নির্বাচন</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {storageModes.map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setFormData({...formData, mode: mode.id})}
                        className={`p-6 rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden group ${
                          formData.mode === mode.id 
                            ? 'border-emerald-500 bg-emerald-50/30' 
                            : 'border-slate-50 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-all ${
                          formData.mode === mode.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-300'
                        }`}>
                          {mode.icon}
                        </div>
                        <p className={`text-sm font-black ${formData.mode === mode.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{mode.label}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{mode.desc}</p>
                        {formData.mode === mode.id && preset?.mode === mode.id && (
                          <div className="absolute top-4 right-4 text-emerald-500">
                            <Sparkles size={16} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-between">
                      তাপমাত্রা ডিমান্ড
                      {preset && <span className="text-[8px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-black uppercase">AI Recommended: {preset.temp}</span>}
                    </label>
                    <input 
                      type="text" 
                      value={formData.temp}
                      onChange={e => setFormData({...formData, temp: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-between">
                      আর্দ্রতা ডিমান্ড
                      {preset && <span className="text-[8px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-black uppercase">AI Recommended: {preset.humidity}</span>}
                    </label>
                    <input 
                      type="text" 
                      value={formData.humidity}
                      onChange={e => setFormData({...formData, humidity: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 transition-all" 
                    />
                  </div>
                </div>

                {formData.crop === 'Onion' && formData.mode === 'Controlled Humidity' && (
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-6 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 rounded-[2rem] border border-amber-100 dark:border-amber-900/30 flex gap-4 text-xs font-bold leading-relaxed shadow-sm">
                    <AlertCircle size={24} className="shrink-0" />
                    সতর্কতা: পেঁয়াজের জন্য উচ্চ-আর্দ্রতা পচনের ঝুঁকি বাড়াতে পারে। আমরা নরমাল কোল্ড (০-২°C) মোড ব্যবহারের পরামর্শ দিচ্ছি।
                  </motion.div>
                )}
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card title="সেকশন ৩: লজিস্টিক ও নোট" className="border-none shadow-xl">
              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">ট্রান্সপোর্ট অপশন</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'Farmer arranged', label: 'কৃষক নিজে আনবেন', icon: <Truck size={20} /> },
                      { id: 'Company provides', label: 'কোম্পানি ট্রান্সপোর্ট', icon: <Sparkles size={20} /> }
                    ].map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => setFormData({...formData, transport: opt.id})}
                        className={`p-6 rounded-[2.5rem] border-2 font-bold text-sm transition-all flex flex-col items-center gap-4 text-center ${
                          formData.transport === opt.id 
                            ? 'bg-emerald-50/50 border-emerald-500 text-emerald-700 dark:text-emerald-400' 
                            : 'bg-slate-50/20 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        <div className={`p-4 rounded-2xl ${formData.transport === opt.id ? 'bg-emerald-600 text-white shadow-xl' : 'bg-white dark:bg-slate-800 text-slate-200 dark:text-slate-700'}`}>
                           {opt.icon}
                        </div>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    পিকআপ অবস্থান <MapPin size={12} className="text-emerald-500" />
                  </label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    placeholder="যেমন: বগুড়া সদর, মহাস্থানগড় সংলগ্ন"
                    className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 transition-all shadow-inner" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    অতিরিক্ত নোট (ঐচ্ছিক) <ClipboardList size={12} className="text-slate-300" />
                  </label>
                  <textarea 
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    placeholder="পণ্য সম্পর্কে বিশেষ কোনো তথ্য থাকলে এখানে লিখুন..."
                    className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl font-bold text-slate-900 dark:text-slate-100 h-32 outline-none focus:border-emerald-500 transition-all resize-none shadow-inner" 
                  />
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center pt-8 border-t border-slate-100 dark:border-slate-800">
        <button 
          disabled={step === 1 || isSubmitting}
          onClick={() => setStep(step - 1)}
          className="px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-all"
        >
          আগে যান
        </button>
        {step < 3 ? (
          <button 
            onClick={() => setStep(step + 1)}
            className="group flex items-center gap-3 px-12 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:scale-105 transition-all"
          >
            পরবর্তী ধাপ <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-3 px-14 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-black hover:scale-105 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">প্রসেসিং হচ্ছে <Sparkles size={18} className="animate-pulse" /></span>
            ) : (
              <>বুকিং রিকোয়েস্ট পাঠান <CheckCircle2 size={18} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
