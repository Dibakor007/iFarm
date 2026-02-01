
import { UserRole } from '../constants';

export type Action = 'VIEW' | 'WRITE' | 'APPROVE' | 'MANAGE';

export interface PermissionSet {
  [module: string]: Action[];
}

export const ROLE_PERMISSIONS: Record<UserRole, PermissionSet> = {
  ADMIN: {
    dashboard: ['VIEW', 'WRITE', 'APPROVE', 'MANAGE'],
    harvest: ['VIEW', 'WRITE', 'APPROVE', 'MANAGE'],
    market: ['VIEW', 'WRITE', 'APPROVE', 'MANAGE'],
    cold_storage: ['VIEW', 'WRITE', 'APPROVE', 'MANAGE'],
    transport: ['VIEW', 'WRITE', 'APPROVE', 'MANAGE'],
    weather: ['VIEW', 'WRITE', 'APPROVE', 'MANAGE'],
    reports: ['VIEW', 'WRITE', 'APPROVE', 'MANAGE'],
    transport_reports: ['VIEW', 'WRITE', 'APPROVE', 'MANAGE'],
    settings: ['VIEW', 'WRITE', 'APPROVE', 'MANAGE'],
    audit: ['VIEW', 'WRITE', 'APPROVE', 'MANAGE'],
    optimization: ['VIEW', 'WRITE', 'APPROVE', 'MANAGE'],
  },
  STORAGE_MANAGER: {
    dashboard: ['VIEW'],
    harvest: ['VIEW'],
    market: ['VIEW'],
    cold_storage: ['VIEW', 'WRITE', 'APPROVE'],
    weather: ['VIEW'],
    reports: ['VIEW'],
    settings: ['VIEW'],
  },
  TRANSPORT_MANAGER: {
    dashboard: ['VIEW'],
    transport: ['VIEW', 'WRITE'],
    transport_reports: ['VIEW'],
    weather: ['VIEW'],
    settings: ['VIEW'],
  },
  FARMER: {
    dashboard: ['VIEW'],
    harvest: ['VIEW', 'WRITE'],
    market: ['VIEW'],
    cold_storage: ['VIEW', 'WRITE'],
    weather: ['VIEW'],
    settings: ['VIEW'],
  },
};

export const can = (role: UserRole, module: string, action: Action): boolean => {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions || !permissions[module]) return false;
  return permissions[module].includes(action);
};
