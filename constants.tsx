
import React from 'react';
import { 
  Gauge, 
  Sprout, 
  Warehouse, 
  Truck, 
  CloudSun, 
  BarChart3, 
  Settings,
  ShoppingCart,
  BookOpen,
  ShieldCheck,
  FileText,
  Thermometer,
  Grid,
  Leaf,
  LineChart,
  Navigation,
  Banknote
} from 'lucide-react';

export type UserRole = 'ADMIN' | 'STORAGE_MANAGER' | 'TRANSPORT_MANAGER' | 'FARMER';

export const COLORS = {
  primary: '#059669', // Emerald 600
  secondary: '#0891b2', // Cyan 600
  accent: '#f59e0b', // Amber 500
  background: '#f8fafc',
  text: '#0f172a',
};

export const MENU_ITEMS = [
  { label: 'ড্যাশবোর্ড', path: '/dashboard', icon: <Gauge size={20} />, english: 'Dashboard', roles: ['ADMIN', 'STORAGE_MANAGER', 'TRANSPORT_MANAGER', 'FARMER'] },
  { label: 'ফসল রেকর্ড', path: '/harvest', icon: <Leaf size={20} />, english: 'Harvest Records', roles: ['ADMIN', 'FARMER', 'STORAGE_MANAGER'] },
  { label: 'বাজারদর', path: '/market-prices', icon: <Banknote size={20} />, english: 'Market Prices', roles: ['ADMIN', 'FARMER', 'STORAGE_MANAGER'] },
  { label: 'কোল্ড স্টোরেজ', path: '/cold-storage', icon: <Warehouse size={20} />, english: 'Cold Storage', roles: ['ADMIN', 'STORAGE_MANAGER', 'FARMER'] },
  { label: 'ট্রান্সপোর্ট মনিটরিং', path: '/transport', icon: <Navigation size={20} />, english: 'Transport', roles: ['ADMIN', 'TRANSPORT_MANAGER'] },
  { label: 'আবহাওয়া', path: '/weather', icon: <CloudSun size={20} />, english: 'Weather', roles: ['ADMIN', 'FARMER', 'STORAGE_MANAGER', 'TRANSPORT_MANAGER'] },
  { label: 'রিপোর্ট ও এনালিটিক্স', path: '/reports', icon: <LineChart size={20} />, english: 'Reports', roles: ['ADMIN', 'STORAGE_MANAGER'] },
  { label: 'ট্রান্সপোর্ট রিপোর্ট', path: '/reports/transport', icon: <BarChart3 size={20} />, english: 'Logistics Analytics', roles: ['ADMIN', 'TRANSPORT_MANAGER'] },
  { label: 'সেটিংস', path: '/settings', icon: <Settings size={20} />, english: 'Settings', roles: ['ADMIN', 'STORAGE_MANAGER', 'TRANSPORT_MANAGER', 'FARMER'] },
];

export const COLD_STORAGE_SUBMENU = [
  { label: 'ইনভেন্টরি', id: 'inventory', icon: <ShoppingCart size={16} /> },
  { label: 'বুকিং', id: 'booking', icon: <BookOpen size={16} /> },
  { label: 'চেম্বার ভিউ', id: 'chambers', icon: <Grid size={16} /> },
  { label: 'সেন্সর ও রুলস', id: 'sensors', icon: <Thermometer size={16} /> },
  { label: 'ইনভয়েস', id: 'invoices', icon: <FileText size={16} /> },
  { label: 'কমপ্লায়েন্স', id: 'compliance', icon: <ShieldCheck size={16} /> },
];

export const DUMMY_NOTIFICATIONS = [
  { id: 1, title: 'তাপমাত্রা বৃদ্ধি!', message: 'Zone B তে তাপমাত্রা ৫°C অতিক্রম করেছে।', type: 'warning', time: '২ মিনিট আগে' },
  { id: 2, title: 'স্টক অ্যালার্ট', message: 'লাল আলুর মেয়াদ ৫ দিনের মধ্যে শেষ হচ্ছে।', type: 'danger', time: '১০ মিনিট আগে' },
  { id: 3, title: 'বুকিং আপডেট', message: 'আপনার বুকিংটি অনুমোদিত হয়েছে।', type: 'success', time: '২০ মিনিট আগে' },
];
