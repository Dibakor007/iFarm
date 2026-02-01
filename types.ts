
// Import React to provide the React namespace for ReactNode types used in interfaces
import React from 'react';

export type Status = 'success' | 'warning' | 'danger' | 'info';

export interface FarmSummary {
  id: number;
  name: string;
  status: string;
}

export interface KPI {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  status: Status;
}

export interface HarvestRecord {
  id: string | number;
  farmerName: string;
  cropType: string;
  date: string;
  quantity: number;
  unit?: string;
  location: string;
}

export interface StockItem {
  id: string;
  product: string;
  quantity: string;
  entryDate: string;
  expiryDate: string;
  status: 'Good' | 'Warning' | 'Critical';
}

export interface TransportRoute {
  id: string;
  from: string;
  to: string;
  driver: string;
  vehicle: string;
  progress: number;
  status: 'On-time' | 'Delayed' | 'Delivered';
  eta: string;
}

export interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: Status;
  lastUpdated: string;
}

export interface PaymentRecord {
  id: string;
  farmer: string;
  total: number;
  paid: number;
  due: number;
  status: 'Paid' | 'Partial' | 'Pending';
}

export interface StockInventoryRecord {
  stock_id: number;
  storage_id: number | null;
  farmer_id: number | null;
  crop_type: string;
  quantity_kg: number | string;
  entry_date: string;
  expiry_date?: string | null;
  status: string;
}
