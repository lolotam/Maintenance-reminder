
import React, { ReactNode } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { UserPermissions } from '@/types/users';

interface PermissionGuardProps {
  requiredPermission: keyof UserPermissions;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  requiredPermission, 
  children, 
  fallback = null 
}) => {
  const { hasPermission } = useRole();
  
  if (hasPermission(requiredPermission)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};
