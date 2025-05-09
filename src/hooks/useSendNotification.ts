
import { useNotificationsBase, Machine, NotificationType } from './useNotificationsBase';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useSendNotification() {
  const { user, loading, setLoading } = useNotificationsBase();

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
      const notificationData = {
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

  return {
    loading,
    sendNotification
  };
}
