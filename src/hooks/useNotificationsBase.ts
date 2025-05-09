
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Database } from '@/types/supabase';
import { supabase } from '@/lib/supabase';

export type Machine = Database['public']['Tables']['machines']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
export type NotificationType = 'email' | 'whatsapp' | 'push' | 'sms';

export function useNotificationsBase() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<Record<NotificationType, boolean>>({
    email: false,
    whatsapp: false,
    push: false,
    sms: false,
  });

  const getNotificationHistory = async (
    limit = 10,
    type?: NotificationType,
    machineId?: string
  ) => {
    if (!user) return [];
    
    try {
      let query = supabase
        .from('notifications')
        .select('*, machines(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (type) {
        query = query.eq('type', type);
      }
      
      if (machineId) {
        query = query.eq('machine_id', machineId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notification history:', error);
      return [];
    }
  };

  return {
    user,
    loading,
    setLoading,
    getNotificationHistory
  };
}
