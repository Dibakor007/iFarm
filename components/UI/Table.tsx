
import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
  accessor?: keyof T;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  searchable?: boolean;
  exportable?: boolean;
  itemsPerPage?: number;
  onRowClick?: (item: T) => void;
}

export function Table<T extends Record<string, any>>({ 
  data, 
  columns, 
  keyExtractor, 
  searchable = false, 
  exportable = false,
  itemsPerPage = 10,
  onRowClick
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    const headers = columns.map(c => c.header).join(',');
    const rows = filteredData.map(item => 
      columns.map(c => {
        return c.accessor ? `"${String(item[c.accessor])}"` : '""';
      }).join(',')
    ).join('\n');
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ifarm_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {(searchable || exportable) && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="সার্চ করুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-200 transition-all shadow-sm"
              />
            </div>
          )}
          {exportable && (
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <Download size={18} /> এক্সপোর্ট (CSV)
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-slate-400 dark:text-slate-500 text-xs uppercase font-black tracking-widest px-4">
              {columns.map((col, idx) => (
                <th key={idx} className={`pb-3 ${idx === 0 ? 'pl-4' : ''} ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr 
                  key={keyExtractor(item)} 
                  onClick={() => onRowClick?.(item)}
                  className={`bg-white dark:bg-slate-800 transition-all group ${onRowClick ? 'cursor-pointer hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                >
                  {columns.map((col, idx) => (
                    <td 
                      key={idx} 
                      className={`py-5 border-y border-slate-100 dark:border-slate-700 text-base ${idx === 0 ? 'pl-4 rounded-l-2xl border-l' : ''} ${idx === columns.length - 1 ? 'pr-4 rounded-r-2xl border-r' : ''} ${col.className || ''}`}
                    >
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Search size={48} className="text-slate-200 dark:text-slate-700" />
                    <p className="text-slate-400 text-lg font-bold">কোনো তথ্য পাওয়া যায়নি</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6">
          <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
            {filteredData.length} এর মধ্যে {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)} দেখাচ্ছে
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors text-slate-500"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors text-slate-500"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
