
import { useNotificationsBase } from './useNotificationsBase';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useWhatsAppNotifications() {
  const { user, loading, setLoading } = useNotificationsBase();
  
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

  return {
    whatsappLoading: loading.whatsapp,
    sendTestWhatsAppNotification
  };
}
