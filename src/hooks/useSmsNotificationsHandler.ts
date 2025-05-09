
import { useNotificationsBase } from './useNotificationsBase';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useSmsNotificationsHandler() {
  const { user, loading, setLoading } = useNotificationsBase();
  
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
    smsLoading: loading.sms,
    sendTestSmsNotification
  };
}
