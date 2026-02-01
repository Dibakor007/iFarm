
import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { getAgriInsights } from '../lib/ai';

interface SmartAssistantProps {
  context: string;
}

export const SmartAssistant: React.FC<SmartAssistantProps> = ({ context }) => {
  const [insight, setInsight] = useState<string>('লোড হচ্ছে...');
  const [loading, setLoading] = useState(true);

  const fetchInsight = async () => {
    setLoading(true);
    const result = await getAgriInsights(`Based on this context: ${context}, give 3 short bullet points of advice for a Bangladeshi farmer or warehouse manager.`);
    setInsight(result || 'কোনো পরামর্শ পাওয়া যায়নি।');
    setLoading(false);
  };

  useEffect(() => {
    fetchInsight();
  }, [context]);

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-emerald-700">
          <Sparkles size={20} className="animate-pulse" />
          <h4 className="font-bold text-sm uppercase tracking-wider">আই-ফার্ম স্মার্ট পরামর্শ (AI Insights)</h4>
        </div>
        <button 
          onClick={fetchInsight}
          disabled={loading}
          className="p-1.5 hover:bg-white rounded-lg transition-colors text-emerald-600 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="text-sm text-slate-700 leading-relaxed min-h-[60px]">
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-emerald-100/50 animate-pulse rounded w-3/4"></div>
            <div className="h-4 bg-emerald-100/50 animate-pulse rounded w-1/2"></div>
          </div>
        ) : (
          <p className="whitespace-pre-line">{insight}</p>
        )}
      </div>
    </div>
  );
};
