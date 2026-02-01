
import React from 'react';
import { Card } from '../../UI/Card';
import { BookingRequest } from '../../../data/mockDb';
import { 
  Package, Calendar, CheckCircle2, Clock, 
  XCircle, Thermometer, Warehouse, Info, MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const BookingList: React.FC<{ bookings: BookingRequest[] }> = ({ bookings }) => {
  if (bookings.length === 0) {
    return (
      <div className="p-20 text-center bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
        <Package size={48} className="mx-auto text-slate-200 mb-4" />
        <p className="text-slate-400 font-bold">আপনার কোনো বুকিং রিকোয়েস্ট পাওয়া যায়নি।</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <Card key={booking.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8">
             <div className="md:w-64 space-y-4 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Package size={18} /></div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">{booking.crop}</h3>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">পরিমান</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{booking.quantity} {booking.unit}</p>
                   </div>
                   <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">তারিখ</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{booking.entryDate}</p>
                   </div>
                </div>
                {booking.assignedChamber && (
                  <div className="flex items-center gap-2 text-emerald-600">
                     <Warehouse size={14} />
                     <span className="text-xs font-black uppercase tracking-tight">বরাদ্দ: {booking.assignedChamber}</span>
                  </div>
                )}
             </div>

             <div className="flex-1 flex flex-col justify-center">
                <div className="relative flex justify-between w-full">
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-700 -z-10" />
                  
                  {[
                    { label: 'Requested', icon: <Clock size={14} />, active: true },
                    { 
                      label: booking.status === 'Rejected' ? 'Rejected' : booking.status === 'Needs Information' ? 'Needs Info' : 'Approved', 
                      icon: booking.status === 'Rejected' ? <XCircle size={14} /> : booking.status === 'Needs Information' ? <Info size={14} /> : <CheckCircle2 size={14} />, 
                      active: booking.status !== 'Pending',
                      error: booking.status === 'Rejected',
                      info: booking.status === 'Needs Information'
                    },
                    { label: 'Stock In', icon: <Warehouse size={14} />, active: booking.status === 'Stock In' }
                  ].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 transition-all ${
                         step.active 
                           ? step.error ? 'bg-red-500 text-white' : step.info ? 'bg-blue-500 text-white' : 'bg-emerald-600 text-white' 
                           : 'bg-slate-100 dark:bg-slate-700 text-slate-300'
                       }`}>
                         {step.icon}
                       </div>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${step.active ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
                         {step.label}
                       </span>
                    </div>
                  ))}
                </div>
                
                {booking.status === 'Needs Information' && booking.infoRequest && (
                   <div className="mt-8 p-5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-3xl border border-blue-100 dark:border-blue-800 flex gap-4">
                     <div className="p-2 bg-white dark:bg-slate-800 rounded-xl h-fit shadow-sm"><MessageCircle size={18} className="text-blue-600" /></div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">ম্যানেজারের তথ্য রিকোয়েস্ট:</p>
                        <p className="text-xs font-bold leading-relaxed italic">{booking.infoRequest}</p>
                        <button className="mt-3 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">তথ্য প্রদান করুন →</button>
                     </div>
                   </div>
                )}

                {booking.rejectionReason && (
                   <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-800 text-xs font-bold">
                     প্রত্যাখ্যানের কারণ: {booking.rejectionReason}
                   </div>
                )}
             </div>

             <div className="md:w-48 flex items-center justify-end shrink-0">
                <button className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-200">
                  বিস্তারিত দেখুন
                </button>
             </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
