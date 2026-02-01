
import React from 'react';
import { useRole } from '../App';
import { AccessDenied } from '../components/AccessDenied';
import { UserRole } from '../constants';
// Fix: Use static import instead of dynamic require to avoid 'require is not defined' error in browser environments
import { ROLE_PERMISSIONS } from './permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  module: string;
  action?: 'VIEW' | 'WRITE' | 'APPROVE' | 'MANAGE';
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  module, 
  action = 'VIEW',
  allowedRoles 
}) => {
  const { role } = useRole();

  // If specific roles are provided, check those
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <AccessDenied />;
  }

  // Otherwise check generic permissions mapping
  // Fix: Removed dynamic require call which caused the compilation error
  const permissions = ROLE_PERMISSIONS[role];

  if (!permissions || !permissions[module] || !permissions[module].includes(action)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};
