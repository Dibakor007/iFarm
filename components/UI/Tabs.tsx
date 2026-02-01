
import React from 'react';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex bg-white dark:bg-slate-800 p-1 md:p-1.5 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-700 w-fit max-w-full overflow-x-auto scrollbar-hide ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-4 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl font-black text-xs md:text-base transition-all whitespace-nowrap ${
            activeTab === tab.id 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          {tab.icon && React.cloneElement(tab.icon as React.ReactElement<any>, { size: window.innerWidth < 768 ? 14 : 18 })}
          {tab.label}
        </button>
      ))}
    </div>
  );
};
