
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { UserPermissions } from '@/types/users';

interface PermissionRouteProps {
  requiredPermission?: keyof UserPermissions;
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({ 
  requiredPermission 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { hasPermission, loading: roleLoading } = useRole();
  const location = useLocation();

  if (authLoading || roleLoading) {
    return <LoadingScreen />;
  }

  // First check if user is authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Then check if user has the required permission (if specified)
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
