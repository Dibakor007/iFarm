
import React, { useState } from 'react';
import { Card } from '../components/UI/Card';
import { TrendingUp, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const OptimizationPage: React.FC = () => {
  const [capacity, setCapacity] = useState(85);
  const [spoilage, setSpoilage] = useState(5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">প্রফিট অপ্টিমাইজেশন (Profit Analysis)</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">এআই চালিত পরামর্শ এবং ভবিষ্যৎ মুনাফা বিশ্লেষণ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card title="ভবিষ্যৎ মুনাফা সিমুলেটর (What-if Analysis)">
             <div className="space-y-8 py-4">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300">
                    <span>স্টোরেজ ক্যাপাসিটি ব্যবহার</span>
                    <span className="text-emerald-600">{capacity}%</span>
                  </div>
                  <input type="range" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full appearance-none accent-emerald-600" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300">
                    <span>প্রত্যাশিত অপচয় (Spoilage Risk)</span>
                    <span className="text-red-600">{spoilage}%</span>
                  </div>
                  <input type="range" value={spoilage} onChange={(e) => setSpoilage(Number(e.target.value))} className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full appearance-none accent-amber-600" />
                </div>
                
                <div className="pt-8 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-4">
                   <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">প্রত্যাশিত মুনাফা</p>
                      <p className="text-3xl font-black text-emerald-600">৳{Math.round((capacity * 1000) - (spoilage * 2000))}ক</p>
                   </div>
                   <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ব্রেকিং ইভেন (দিন)</p>
                      <p className="text-3xl font-black text-slate-800 dark:text-slate-100">৮৫ দিন</p>
                   </div>
                </div>
             </div>
          </Card>

          <Card title="মজুদ রাখার পরামর্শ (Storage Advice)">
             <div className="space-y-4">
               {[
                 { crop: 'পেঁয়াজ (Onion)', confidence: 92, action: 'সংরক্ষণ বাড়িয়ে দিন', reason: 'আগামী ৩ মাসে বাজারে আমদানির ঘাটতি হতে পারে।' },
                 { crop: 'আলু (Potato)', confidence: 78, action: 'স্থিতিশীল রাখুন', reason: 'দাম বর্তমানে সর্বোচ্চ পর্যায়ে রয়েছে।' }
               ].map((item, idx) => (
                 <div key={idx} className="p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl flex items-center justify-between group hover:border-emerald-200 transition-colors">
                    <div className="flex gap-4">
                       <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl"><TrendingUp size={24} /></div>
                       <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.crop}</p>
                          <p className="text-xs text-emerald-600 font-bold mt-1">{item.action}</p>
                          <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.reason}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">কনফিডেন্স</p>
                       <p className="text-xl font-black text-slate-800 dark:text-slate-100">{item.confidence}%</p>
                    </div>
                 </div>
               ))}
             </div>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none p-8">
              <Sparkles className="text-emerald-200 mb-4" size={32} />
              <h3 className="text-xl font-black mb-2 leading-tight">আই-ফার্ম সুপার এআই এনালিটিক্স</h3>
              <p className="text-sm text-emerald-100 leading-relaxed mb-8">আমাদের এআই আপনার কোল্ড স্টোরেজের স্পেস ম্যানেজমেন্ট অপ্টিমাইজ করে মুনাফা ১৫% পর্যন্ত বাড়িয়ে দিতে সক্ষম।</p>
              <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-200 hover:text-white transition-colors">
                 বিস্তারিত পড়ুন <ArrowRight size={14} />
              </button>
           </Card>

           <Card title="সহায়তা প্রয়োজন?">
              <div className="space-y-4">
                 <div className="flex gap-3 items-start">
                    <HelpCircle className="text-slate-400 mt-1 shrink-0" size={18} />
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                       সিমুলেটরটি গত ৩ বছরের বাজার ডেটা এবং আপনার স্টোরেজের পূর্ববর্তী পারফরম্যান্সের ওপর ভিত্তি করে তৈরি।
                    </p>
                 </div>
                 <button className="w-full py-3 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-2xl border border-slate-100 dark:border-slate-700 hover:bg-slate-100">টিউটোরিয়াল দেখুন</button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default OptimizationPage;
