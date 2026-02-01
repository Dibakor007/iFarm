
export const MOCK_HARVESTS = [
  { id: '1', farmerName: 'মোঃ আব্দুর রহিম', cropType: 'আলু (Potato)', date: '2024-03-15', quantity: 2500, location: 'মুन्সিগঞ্জ' },
  { id: '2', farmerName: 'করিম শেখ', cropType: 'পেঁয়াজ (Onion)', date: '2024-03-18', quantity: 1200, location: 'রাজবাড়ী' },
  { id: '3', farmerName: 'আব্দুল কাদের', cropType: 'টমেটো (Tomato)', date: '2024-03-20', quantity: 800, location: 'বগুড়া' },
  { id: '4', farmerName: 'হাসান আলী', cropType: 'আলু (Potato)', date: '2024-03-22', quantity: 5000, location: 'রংপুর' },
];

// Helper to get a date relative to today
const offsetDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const MOCK_STOCK = [
  { id: '1', product: 'ডায়মন্ড আলু', quantity: '৫০ টন', entryDate: '2024-01-10', expiryDate: offsetDate(120), status: 'Good', chamber: 'Chamber A', type: 'Crop', storage: 'Normal' },
  { id: '2', product: 'ইলিশ মাছ', quantity: '৫ টন', entryDate: '2024-03-10', expiryDate: offsetDate(180), status: 'Good', chamber: 'Chamber D', type: 'Fish', storage: 'Deep Freeze' },
  { id: '3', product: 'লাল আলু', quantity: '২০ টন', entryDate: '2024-01-15', expiryDate: offsetDate(3), status: 'Warning', chamber: 'Chamber B', type: 'Crop', storage: 'Normal' }, // Expiring soon!
  { id: '4', product: 'রুই মাছ', quantity: '২ টন', entryDate: '2024-03-05', expiryDate: offsetDate(60), status: 'Good', chamber: 'Chamber D', type: 'Fish', storage: 'Deep Freeze' },
];

export const MOCK_BOOKINGS = [
  { id: 'BK-001', client: 'মোঃ আব্দুর রহিম', userType: 'Farmer', product: 'আলু', quantity: '১০ টন', duration: '৯০ দিন', status: 'Approved', date: '2024-03-10', category: 'Crop', storage: 'Normal' },
  { id: 'BK-002', client: 'সী ফুড ডিস্ট্রিবিউশন', userType: 'Small Business', product: 'ইলিশ মাছ', quantity: '৫ টন', duration: '১৮০ দিন', status: 'Pending Approval', date: '2024-03-12', category: 'Fish', storage: 'Deep Freeze' },
  { id: 'BK-003', client: 'করিম শেখ', userType: 'Farmer', product: 'পেঁয়াজ', quantity: '৫ টন', duration: '৩০ দিন', status: 'Pending Approval', date: '2024-03-12', category: 'Crop', storage: 'Normal' },
  { id: 'BK-004', client: 'ঢাকা রেস্টুরেন্ট সাপ্লাই', userType: 'Small Business', product: 'চিংড়ি মাছ', quantity: '২ টন', duration: '৬০ দিন', status: 'Approved', date: '2024-03-14', category: 'Fish', storage: 'Deep Freeze' },
];

export const MOCK_CHAMBERS = [
  { id: 'A', name: 'Chamber A', capacity: 85, totalTons: 100, temp: 4.2, humidity: 88, status: 'OK', type: 'Cold', items: ['ডায়মন্ড আলু', 'দেশী পেঁয়াজ'], productCategory: 'Crop' },
  { id: 'B', name: 'Chamber B', capacity: 40, totalTons: 100, temp: 5.1, humidity: 90, status: 'Warning', type: 'Cold', items: ['লাল আলু'], productCategory: 'Crop' },
  { id: 'C', name: 'Chamber C', capacity: 15, totalTons: 50, temp: 7.8, humidity: 92, status: 'Danger', type: 'Cold', items: ['টমেটো ক্যাশ'], productCategory: 'Crop' },
  { id: 'D', name: 'Chamber D (Freezer)', capacity: 60, totalTons: 20, temp: -18.5, humidity: 40, status: 'OK', type: 'Deep Freeze', items: ['ইলিশ মাছ', 'চিংড়ি মাছ'], productCategory: 'Fish' },
];

export const MOCK_INVOICES = [
  { id: 'INV-2024-001', client: 'মোঃ আব্দুর রহিম', amount: 15500, status: 'Paid', dueDate: '2024-04-01' },
  { id: 'INV-2024-002', client: 'সী ফুড ডিস্ট্রিবিউশন', amount: 45000, status: 'Due', dueDate: '2024-04-15' },
  { id: 'INV-2024-003', client: 'ঢাকা রেস্টুরেন্ট সাপ্লাই', amount: 12000, status: 'Due', dueDate: '2024-03-30' },
];

export const MOCK_SENSORS = [
  { id: '1', name: 'Zone A - Temp', value: 4.2, unit: '°C', status: 'success', lastUpdated: '২ মিনিট আগে' },
  { id: '2', name: 'Zone D - Freezer', value: -18.5, unit: '°C', status: 'success', lastUpdated: '১ মিনিট আগে' },
  { id: '3', name: 'Zone B - Temp', value: 6.8, unit: '°C', status: 'warning', lastUpdated: '৫ মিনিট আগে' },
  { id: '4', name: 'Zone D - Humidity', value: 40, unit: '%', status: 'success', lastUpdated: '১ মিনিট আগে' },
];

export const STOCK_CHART_DATA = [
  { name: 'Jan', stock: 400 },
  { name: 'Feb', stock: 300 },
  { name: 'Mar', stock: 450 },
  { name: 'Apr', stock: 380 },
  { name: 'May', stock: 420 },
  { name: 'Jun', stock: 490 },
];

export const MOCK_TRANSPORTS = [
  { id: '1', from: 'বগুড়া', to: 'ঢাকা (কারওয়ান বাজার)', driver: 'সেলিম মিয়া', vehicle: 'ঢাকা মেট্রো-ট ১২-৩৪৫৬', progress: 75, status: 'On-time', eta: '০২:৩০ PM' },
  { id: '2', from: 'মুন্সিগঞ্জ', to: 'চট্টগ্রাম', driver: 'রফিক আহমেদ', vehicle: 'ঢাকা মেট্রো-ম ৫৬-৭৮৯০', progress: 40, status: 'Delayed', eta: '০৬:০০ PM' },
];

export const MOCK_RULES = [
  { id: 1, sensor: 'Temperature', condition: '>', value: 8, action: 'Notify Admin', severity: 'Danger', active: true },
  { id: 2, sensor: 'Freezer Temp', condition: '>', value: -15, action: 'Siren', severity: 'Danger', active: true },
];

export const MOCK_COMPLIANCE = [
  { id: 1, name: 'Fire Safety Certificate 2024', type: 'PDF', date: '2024-01-01', status: 'Verified' },
  { id: 2, name: 'HACCP Fish Storage License', type: 'PDF', date: '2024-02-15', status: 'Verified' },
];

export const MOCK_MARKET_PRICES = [
  { district: 'মুন্সিগঞ্জ', potato: 35, onion: 60, tomato: 40, trend: 'Rising' },
  { district: 'বগুড়া', potato: 32, onion: 58, tomato: 35, trend: 'Stable' },
  { district: 'ঢাকা', potato: 42, onion: 70, tomato: 55, trend: 'Rising' },
  { district: 'রংপুর', potato: 28, onion: 55, tomato: 30, trend: 'Falling' },
  { district: 'রাজবাড়ী', potato: 34, onion: 65, tomato: 38, trend: 'Stable' },
];

export const MOCK_AUDIT_LOGS = [
  { id: '1', action: 'স্টক আপডেট: ডায়মন্ড আলু', actor: 'ADMIN', time: '১০:৪৫ AM', date: '2024-03-24', type: 'STOCK', metadata: 'Qty: +5 Ton' },
  { id: '2', action: 'নতুন বুকিং রিকোয়েস্ট (BK-552)', actor: 'MANAGER', time: '০৯:৩০ AM', date: '2024-03-24', type: 'BOOKING', metadata: 'Farmer: Rahim' },
  { id: '3', action: 'সিস্টেম এলার্ট: হাই টেম্পারেচার', actor: 'SYSTEM', time: '০২:১৫ AM', date: '2024-03-24', type: 'ALERT', metadata: 'Chamber B' },
  { id: '4', action: 'পেমেন্ট রিসিভড (INV-2024-001)', actor: 'ADMIN', time: '০৪:২০ PM', date: '2024-03-23', type: 'PAYMENT', metadata: '৳১৫,৫০০' },
  { id: '5', action: 'যানবাহন ডেসপ্যাচ (TR-902)', actor: 'TRANSPORT_MANAGER', time: '১১:১০ AM', date: '2024-03-23', type: 'LOGISTICS', metadata: 'To: Dhaka' },
];

export const MOCK_DELIVERY_HISTORY = [
  { 
    id: 'DEL-2024-001', 
    dateTime: '2024-03-22 14:30', 
    suppliedToName: 'আগোরা সুপারশপ', 
    suppliedToType: 'Retailer', 
    productType: 'আলু', 
    quantity: '৫ টন', 
    route: 'বগুড়া → ঢাকা', 
    driverName: 'সেলিম মিয়া', 
    deliveryStatus: 'Delivered', 
    paymentStatus: 'Paid', 
    coldStorageSite: 'বগুড়া মেইন সাইট', 
    chamber: 'A', 
    vehicleNo: 'ঢাকা মেট্রো-ট ১২-৩৪৫৬', 
    handledBy: 'শরিফুল ইসলাম' 
  },
  { 
    id: 'DEL-2024-002', 
    dateTime: '2024-03-23 09:15', 
    suppliedToName: 'ফ্রেশ ফুড লিমিটেড', 
    suppliedToType: 'Processor', 
    productType: 'পেঁয়াজ', 
    quantity: '২ টন', 
    route: 'রাজবাড়ী → মুন্সিগঞ্জ', 
    driverName: 'রফিক আহমেদ', 
    deliveryStatus: 'In Transit', 
    paymentStatus: 'Due', 
    coldStorageSite: 'রাজবাড়ী হাব', 
    chamber: 'C', 
    vehicleNo: 'ঢাকা মেট্রো-ম ৫৬-৭৮৯০', 
    handledBy: 'করিম শেখ' 
  },
];

export const TRANSPORT_TREND_DATA = [
  { name: 'Mon', onTime: 45, delayed: 5 },
  { name: 'Tue', onTime: 52, delayed: 2 },
  { name: 'Wed', onTime: 48, delayed: 8 },
  { name: 'Thu', onTime: 38, delayed: 15 },
  { name: 'Fri', onTime: 55, delayed: 3 },
  { name: 'Sat', onTime: 60, delayed: 1 },
  { name: 'Sun', onTime: 40, delayed: 0 },
];

export const ROUTE_ANALYTICS = [
  { id: 1, route: 'বগুড়া → ঢাকা', count: 145, duration: '৫ ঘণ্টা ৩০ মি.', delayFreq: 12, risk: 'Low' },
  { id: 2, route: 'মুন্সিগঞ্জ → চট্টগ্রাম', count: 82, duration: '৮ ঘণ্টা ১৫ মি.', delayFreq: 28, risk: 'Medium' },
  { id: 3, route: 'রংপুর → ঢাকা', count: 65, duration: '৯ ঘণ্টা', delayFreq: 45, risk: 'High' },
  { id: 4, route: 'রাজবাড়ী → ঢাকা', count: 110, duration: '৪ ঘণ্টা ২০ মি.', delayFreq: 5, risk: 'Low' },
];

export const DELAY_REASONS = [
  { name: 'ট্রাফিক জ্যাম', value: 45 },
  { name: 'আবহাওয়া', value: 20 },
  { name: 'যান্ত্রিক গোলযোগ', value: 15 },
  { name: 'লোডিং বিলম্ব', value: 12 },
  { name: 'অন্যান্য', value: 8 },
];

export const DRIVER_PERFORMANCE = [
  { id: 1, name: 'সেলিম মিয়া', rating: 4.8, trips: 152, onTime: 95 },
  { id: 2, name: 'রফিক আহমেদ', rating: 4.2, trips: 128, onTime: 82 },
  { id: 3, name: 'আব্দুল হক', rating: 4.9, trips: 95, onTime: 98 },
  { id: 4, name: 'মোস্তফা কামাল', rating: 3.5, trips: 88, onTime: 70 },
];

export const VEHICLE_PERFORMANCE = [
  { id: 1, plate: 'ঢাকা মেট্রো-ট ১২-৩৪৫৬', trips: 245, breakdown: 2, status: 'Active' },
  { id: 2, plate: 'ঢাকা মেট্রো-ম ৫৬-৭৮৯০', trips: 188, breakdown: 5, status: 'Maintenance' },
  { id: 3, plate: 'চট্ট মেট্রো-ট ১১-৯৯০০', trips: 156, breakdown: 1, status: 'Active' },
  { id: 4, plate: 'ঢাকা মেট্রো-ট ২২-৩৩৪৪', trips: 92, breakdown: 0, status: 'Active' },
];

export const DELAY_HEATMAP = [
  { day: 'শনি', morning: 10, noon: 25, evening: 45 },
  { day: 'রবি', morning: 15, noon: 20, evening: 35 },
  { day: 'সোম', morning: 12, noon: 30, evening: 55 },
  { day: 'মঙ্গল', morning: 8, noon: 22, evening: 40 },
  { day: 'বুধ', morning: 11, noon: 28, evening: 50 },
  { day: 'বৃহস্পতি', morning: 20, noon: 45, evening: 75 },
  { day: 'শুক্র', morning: 5, noon: 10, evening: 15 },
];

export const TRANSPORT_COST_SUMMARY = {
  costPerTrip: 8500,
  totalFuel: 185000,
  totalMaintenance: 45000,
};
