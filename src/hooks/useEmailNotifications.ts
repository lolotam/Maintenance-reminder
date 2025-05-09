
import { useNotificationsBase } from './useNotificationsBase';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useEmailNotifications() {
  const { user, loading, setLoading } = useNotificationsBase();
  
  // Send test email notification
  const sendTestEmailNotification = async (email: string) => {
    if (!email) return false;
    
    setLoading(prev => ({ ...prev, email: true }));
    
    try {
      const { error } = await supabase.functions.invoke('send-test-email', {
        body: { email, name: user?.user_metadata?.name || "User" },
      });
      
      if (error) throw new Error(error.message);
      
      toast.success('Test email sent successfully!');
      return true;
    } catch (error: any) {
      console.error('Error sending test email:', error);
      toast.error(`Failed to send test email: ${error.message}`);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, email: false }));
    }
  };

  return {
    emailLoading: loading.email,
    sendTestEmailNotification
  };
}
