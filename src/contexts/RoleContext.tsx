
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { User, UserPermissions, UserRole, DEFAULT_PERMISSIONS } from '@/types/users';

interface RoleContextType {
  userRole: UserRole;
  permissions: UserPermissions;
  loading: boolean;
  setUserRole: (role: UserRole) => Promise<void>;
  updatePermissions: (permissions: Partial<UserPermissions>) => Promise<void>;
  hasPermission: (permission: keyof UserPermissions) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [userRole, setRole] = useState<UserRole>('data_entry');
  const [permissions, setPermissions] = useState<UserPermissions>(DEFAULT_PERMISSIONS.data_entry);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // In a real app, fetch role from database
        // For now, use localStorage for demo purposes
        const storedRole = localStorage.getItem(`user_role_${user.id}`);
        const storedPermissions = localStorage.getItem(`user_permissions_${user.id}`);
        
        // Default to data_entry if no role is found
        const role = (storedRole as UserRole) || 'data_entry';
        setRole(role);
        
        // Set permissions based on role or use custom permissions if available
        if (storedPermissions) {
          setPermissions(JSON.parse(storedPermissions));
        } else {
          setPermissions(DEFAULT_PERMISSIONS[role]);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const setUserRole = async (role: UserRole) => {
    if (!user) return;
    
    setRole(role);
    const newPermissions = DEFAULT_PERMISSIONS[role];
    setPermissions(newPermissions);
    
    // In a real app, save to database
    // For now, use localStorage for demo purposes
    localStorage.setItem(`user_role_${user.id}`, role);
    localStorage.setItem(`user_permissions_${user.id}`, JSON.stringify(newPermissions));
  };

  const updatePermissions = async (newPermissions: Partial<UserPermissions>) => {
    if (!user) return;
    
    const updatedPermissions = { ...permissions, ...newPermissions };
    setPermissions(updatedPermissions);
    
    // In a real app, save to database
    // For now, use localStorage for demo purposes
    localStorage.setItem(`user_permissions_${user.id}`, JSON.stringify(updatedPermissions));
  };

  const hasPermission = (permission: keyof UserPermissions) => {
    return !!permissions[permission];
  };

  return (
    <RoleContext.Provider
      value={{
        userRole,
        permissions,
        loading,
        setUserRole,
        updatePermissions,
        hasPermission
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};
