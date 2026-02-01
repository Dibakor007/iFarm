
export type BookingStatus = 'Pending' | 'Approved' | 'Rejected' | 'Stock In' | 'Needs Information';

export interface BookingRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  crop: string;
  quantity: number;
  unit: 'KG' | 'TON';
  packaging: string;
  entryDate: string;
  releaseDate?: string;
  duration: number;
  envDemand: {
    mode: string;
    temp: string;
    humidity: string;
  };
  logistics: {
    transport: string;
    location: string;
  };
  status: BookingStatus;
  createdAt: string;
  assignedChamber?: string;
  rejectionReason?: string;
  infoRequest?: string;
}

export interface TransportTrip {
  id: string;
  from: string;
  to: string;
  driver: string;
  driverPhone: string;
  vehicle: string;
  progress: number;
  status: 'On-time' | 'Delayed' | 'Delivered';
  eta: string;
  startTime: string;
  loadType?: string;
  loadWeight?: string;
}

export interface AppNotification {
  id: string;
  type: 'BOOKING_REQUEST' | 'BOOKING_UPDATE' | 'ALERT' | 'EXPIRY' | 'TRANSPORT_UPDATE' | 'STOCK_IN';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  targetRole: string;
  metadata?: any;
  link?: string; // Route to navigate when clicked
}

const STORAGE_KEY_BOOKINGS = 'ifarm_bookings_v1';
const STORAGE_KEY_NOTIFS = 'ifarm_notifications_v1';
const STORAGE_KEY_TRANSPORTS = 'ifarm_transports_v1';

export const mockDb = {
  // Bookings
  getBookings: (): BookingRequest[] => {
    const data = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    return data ? JSON.parse(data) : [];
  },
  
  saveBooking: (booking: BookingRequest) => {
    const bookings = mockDb.getBookings();
    bookings.unshift(booking);
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    
    // Notify Storage Manager
    mockDb.pushNotification({
      type: 'BOOKING_REQUEST',
      title: 'নতুন বুকিং রিকোয়েস্ট',
      message: `${booking.farmerName} ${booking.crop} (${booking.quantity}${booking.unit}) এর জন্য রিকোয়েস্ট পাঠিয়েছেন।`,
      targetRole: 'STORAGE_MANAGER',
      link: `/cold-storage?tab=booking&bookingId=${booking.id}`,
      metadata: { bookingId: booking.id }
    });
  },
  
  updateBookingStatus: (id: string, status: BookingStatus, extra: any = {}) => {
    const bookings = mockDb.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      const booking = bookings[index];
      booking.status = status;
      if (extra.assignedChamber) booking.assignedChamber = extra.assignedChamber;
      if (extra.rejectionReason) booking.rejectionReason = extra.rejectionReason;
      if (extra.infoRequest) booking.infoRequest = extra.infoRequest;
      
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
      
      // Notify Farmer
      let title = '';
      if (status === 'Approved') title = 'বুকিং অনুমোদিত হয়েছে';
      else if (status === 'Rejected') title = 'বুকিং প্রত্যাখ্যাত হয়েছে';
      else if (status === 'Needs Information') title = 'অতিরিক্ত তথ্য প্রয়োজন';

      mockDb.pushNotification({
        type: 'BOOKING_UPDATE',
        title,
        message: `আপনার ${booking.crop} এর বুকিং রিকোয়েস্ট (${id}) এর জন্য ${status === 'Approved' ? 'অনুমোদন দেওয়া হয়েছে।' : status === 'Rejected' ? 'প্রত্যাখ্যান করা হয়েছে।' : 'ম্যানেজার তথ্য চেয়েছেন।'}`,
        targetRole: 'FARMER',
        link: `/cold-storage?tab=booking&bookingId=${id}`,
        metadata: { bookingId: id }
      });
    }
  },

  // Transports
  getTransports: (): TransportTrip[] => {
    const data = localStorage.getItem(STORAGE_KEY_TRANSPORTS);
    const initial = [
      { id: 'TR-101', from: 'বগুড়া', to: 'ঢাকা (কারওয়ান বাজার)', driver: 'সেলিম মিয়া', driverPhone: '01711223344', vehicle: 'ঢাকা মেট্রো-ট ১২-৩৪৫৬', progress: 75, status: 'On-time', eta: '০২:৩০ PM', startTime: '০৯:০০ AM', loadType: 'আলু', loadWeight: '৫ টন' },
      { id: 'TR-102', from: 'মুন্সিগঞ্জ', to: 'চট্টগ্রাম', driver: 'রফিক আহমেদ', driverPhone: '01822334455', vehicle: 'ঢাকা মেট্রো-ম ৫৬-৭৮৯০', progress: 40, status: 'Delayed', eta: '০৬:০০ PM', startTime: '১১:০০ AM', loadType: 'পেঁয়াজ', loadWeight: '৩ টন' },
    ];
    return data ? JSON.parse(data) : initial;
  },

  saveTransport: (trip: TransportTrip) => {
    const trips = mockDb.getTransports();
    trips.unshift(trip);
    localStorage.setItem(STORAGE_KEY_TRANSPORTS, JSON.stringify(trips));
    
    mockDb.pushNotification({
      type: 'TRANSPORT_UPDATE',
      title: 'নতুন ট্রিপ শুরু',
      message: `${trip.id} রুট: ${trip.from} -> ${trip.to} শুরু হয়েছে।`,
      targetRole: 'TRANSPORT_MANAGER',
      link: '/transport',
      metadata: { tripId: trip.id }
    });
  },

  updateTransportStatus: (id: string, updates: Partial<TransportTrip>) => {
    const trips = mockDb.getTransports();
    const idx = trips.findIndex(t => t.id === id);
    if (idx !== -1) {
      trips[idx] = { ...trips[idx], ...updates };
      localStorage.setItem(STORAGE_KEY_TRANSPORTS, JSON.stringify(trips));
      
      if (updates.status === 'Delivered') {
        mockDb.pushNotification({
          type: 'TRANSPORT_UPDATE',
          title: 'ডেলিভারি সম্পন্ন',
          message: `ট্রিপ ${id} গন্তব্যে পৌঁছেছে।`,
          targetRole: 'ADMIN',
          link: '/transport',
          metadata: { tripId: id }
        });
      }
    }
  },

  // Notifications
  getNotifications: (): AppNotification[] => {
    const data = localStorage.getItem(STORAGE_KEY_NOTIFS);
    return data ? JSON.parse(data) : [];
  },
  
  pushNotification: (n: Partial<AppNotification>) => {
    const notifs = mockDb.getNotifications();
    
    // Prevent duplicate expiry notifications for the same item today
    if (n.type === 'EXPIRY' && n.metadata?.stockId) {
      const today = new Date().toISOString().split('T')[0];
      const duplicate = notifs.find(existing => 
        existing.type === 'EXPIRY' && 
        existing.metadata?.stockId === n.metadata.stockId &&
        existing.createdAt.startsWith(today) &&
        existing.targetRole === n.targetRole
      );
      if (duplicate) return;
    }

    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      isRead: false,
      createdAt: new Date().toISOString(),
      type: n.type || 'ALERT',
      title: n.title || '',
      message: n.message || '',
      targetRole: n.targetRole || 'ADMIN',
      metadata: n.metadata,
      link: n.link
    };
    notifs.unshift(newNotif);
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifs));
    window.dispatchEvent(new Event('ifarm_notification_update'));
  },

  markNotifsRead: () => {
    const notifs = mockDb.getNotifications().map(n => ({ ...n, isRead: true }));
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifs));
    window.dispatchEvent(new Event('ifarm_notification_update'));
  },

  // Expiry Checker
  checkStockExpiries: (stockItems: any[], alertDays: number) => {
    const today = new Date();
    stockItems.forEach(item => {
      const expiry = new Date(item.expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= alertDays && diffDays > 0) {
        const message = `${item.product} (Chamber ${item.chamber}) এর মেয়াদ আগামী ${diffDays} দিনের মধ্যে শেষ হবে।`;
        
        // Notify Manager
        mockDb.pushNotification({
          type: 'EXPIRY',
          title: 'স্টক এক্সপায়ারি অ্যালার্ট',
          message,
          targetRole: 'STORAGE_MANAGER',
          link: `/cold-storage?tab=inventory&stockId=${item.id}`,
          metadata: { stockId: item.id }
        });

        // Notify Farmer (In this mock we assume Manager also sees farmer's alerts or we push to farmer role)
        mockDb.pushNotification({
          type: 'EXPIRY',
          title: 'আপনার পণ্যের মেয়াদ সতর্কতা',
          message: `আপনার রক্ষিত ${item.product} এর মেয়াদ ${item.expiryDate} তারিখে শেষ হবে। দ্রুত ব্যবস্থা নিন।`,
          targetRole: 'FARMER',
          link: `/cold-storage?tab=inventory&stockId=${item.id}`,
          metadata: { stockId: item.id }
        });
      }
    });
  }
};
