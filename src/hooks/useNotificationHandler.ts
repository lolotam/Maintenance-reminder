
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Database } from '@/types/supabase';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export type Machine = Database['public']['Tables']['machines']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
export type NotificationType = 'email' | 'whatsapp' | 'push' | 'sms';

export function useNotificationHandler() {
  const { user } = useAuth();
  const { sendTestNotification } = usePushNotifications();
  const [loading, setLoading] = useState<Record<NotificationType, boolean>>({
    email: false,
    whatsapp: false,
    push: false,
    sms: false,
  });

  // Send a notification
  const sendNotification = async (
    machine: Machine, 
    type: NotificationType,
    content?: Record<string, any>
  ) => {
    if (!user) return false;
    
    setLoading(prev => ({ ...prev, [type]: true }));
    
    try {
      // First, record in notifications table
      const notificationData: NotificationInsert = {
        user_id: user.id,
        machine_id: machine.id,
        type,
        status: 'pending',
        content: content || {
          message: `Maintenance reminder for ${machine.name}`,
          date: machine.next_maintenance_date,
        },
      };
      
      const { data: notification, error: insertError } = await supabase
        .from('notifications')
        .insert(notificationData)
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      // Then, send the actual notification
      const { error } = await supabase.functions.invoke('send-notification', {
        body: { 
          notificationId: notification.id,
          type,
          machineId: machine.id,
        },
      });
      
      if (error) throw new Error(error.message);
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} notification sent`);
      return true;
    } catch (error: any) {
      console.error(`Error sending ${type} notification:`, error);
      toast.error(`Failed to send ${type} notification: ${error.message}`);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  // Get notification history
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
  
  // Send test notifications for each notification type
  const sendTestEmailNotification = async () => {
    if (!user) return false;
    
    setLoading(prev => ({ ...prev, email: true }));
    
    try {
      const { error } = await supabase.functions.invoke('send-test-email', {
        body: { userId: user.id },
      });
      
      if (error) throw new Error(error.message);
      
      toast.success('Test email sent');
      return true;
    } catch (error: any) {
      console.error('Error sending test email:', error);
      toast.error(`Failed to send test email: ${error.message}`);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, email: false }));
    }
  };
  
  const sendTestWhatsAppNotification = async () => {
    if (!user) return false;
    
    setLoading(prev => ({ ...prev, whatsapp: true }));
    
    try {
      const { error } = await supabase.functions.invoke('send-test-whatsapp', {
        body: { userId: user.id },
      });
      
      if (error) throw new Error(error.message);
      
      toast.success('Test WhatsApp message sent');
      return true;
    } catch (error: any) {
      console.error('Error sending test WhatsApp message:', error);
      toast.error(`Failed to send test WhatsApp message: ${error.message}`);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, whatsapp: false }));
    }
  };
  
  const sendTestPushNotification = async () => {
    if (!user) return false;
    
    try {
      await sendTestNotification();
      return true;
    } catch (error: any) {
      console.error('Error sending test push notification:', error);
      toast.error(`Failed to send test push notification: ${error.message}`);
      return false;
    }
  };
  
  const sendTestSmsNotification = async () => {
    if (!user) return false;
    
    setLoading(prev => ({ ...prev, sms: true }));
    
    try {
      const { error } = await supabase.functions.invoke('send-test-sms', {
        body: { userId: user.id },
      });
      
      if (error) throw new Error(error.message);
      
      toast.success('Test SMS sent');
      return true;
    } catch (error: any) {
      console.error('Error sending test SMS:', error);
      toast.error(`Failed to send test SMS: ${error.message}`);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, sms: false }));
    }
  };

  return {
    loading,
    sendNotification,
    getNotificationHistory,
    sendTestEmailNotification,
    sendTestWhatsAppNotification,
    sendTestPushNotification,
    sendTestSmsNotification,
  };
}
