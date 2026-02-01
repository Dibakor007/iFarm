import type { FarmSummary, HarvestRecord, StockInventoryRecord } from '../types';

const DEFAULT_API_PATH = '/api/v1';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');
const ensureLeadingSlash = (value: string) => (value.startsWith('/') ? value : `/${value}`);

const baseUrlRaw = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL ?? '');
const basePathRaw = ensureLeadingSlash(import.meta.env.VITE_API_BASE_PATH ?? DEFAULT_API_PATH);
const API_ROOT = baseUrlRaw ? `${baseUrlRaw}${basePathRaw}` : basePathRaw;

const buildUrl = (endpoint: string) => {
  const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_ROOT}${normalized}`;
};

const buildQuery = (params?: Record<string, string | number | boolean>) => {
  if (!params) return '';
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    search.set(key, String(value));
  });
  return search.toString();
};

export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 0) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  let payload: any = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (error) {
      throw new ApiError('Invalid JSON payload received from server.', response.status);
    }
  }

  if (!response.ok) {
    const message = payload?.message || response.statusText || 'Request failed';
    throw new ApiError(message, response.status);
  }

  if (payload && payload.status && payload.status !== 'success') {
    throw new ApiError(payload.message || 'Unexpected API response', response.status);
  }

  return (payload?.data ?? null) as T;
};

export const fetchFarmSummaries = async (
  limit?: number,
  signal?: AbortSignal
): Promise<FarmSummary[]> => {
  const query = buildQuery(limit ? { limit } : undefined);
  const url = query ? `${buildUrl('/farms')}?${query}` : buildUrl('/farms');

  const response = await fetch(url, { method: 'GET', signal });
  return handleResponse<FarmSummary[]>(response);
};

export interface CreateHarvestPayload {
  farmerName: string;
  cropType: string;
  quantity: number;
  unit: string;
  date: string;
  location?: string;
}

export const fetchHarvestRecords = async (
  limit?: number,
  signal?: AbortSignal,
): Promise<HarvestRecord[]> => {
  const query = buildQuery(limit ? { limit } : undefined);
  const url = query ? `${buildUrl('/harvests')}?${query}` : buildUrl('/harvests');

  const response = await fetch(url, { method: 'GET', signal });
  return handleResponse<HarvestRecord[]>(response);
};

export const createHarvestRecord = async (
  payload: CreateHarvestPayload,
  signal?: AbortSignal,
): Promise<HarvestRecord> => {
  const response = await fetch(buildUrl('/harvests'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  return handleResponse<HarvestRecord>(response);
};

export interface CreateStockPayload {
  cropType: string;
  quantityKg: number;
  entryDate: string;
  expiryDate?: string;
  storageId?: number;
  farmerId?: number;
  status?: string;
}

export const fetchStockInventory = async (
  limit?: number,
  signal?: AbortSignal,
): Promise<StockInventoryRecord[]> => {
  const query = buildQuery(limit ? { limit } : undefined);
  const url = query ? `${buildUrl('/stock')}?${query}` : buildUrl('/stock');

  const response = await fetch(url, { method: 'GET', signal });
  return handleResponse<StockInventoryRecord[]>(response);
};

export const createStockRecord = async (
  payload: CreateStockPayload,
  signal?: AbortSignal,
): Promise<StockInventoryRecord> => {
  const response = await fetch(buildUrl('/stock'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  return handleResponse<StockInventoryRecord>(response);
};
