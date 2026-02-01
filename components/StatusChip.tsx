
import React from 'react';

type StatusType = 'success' | 'warning' | 'danger' | 'info';

interface StatusChipProps {
  label: string;
  type: StatusType;
}

export const StatusChip: React.FC<StatusChipProps> = ({ label, type }) => {
  const styles = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-tight ${styles[type]}`}>
      {label}
    </span>
  );
};
