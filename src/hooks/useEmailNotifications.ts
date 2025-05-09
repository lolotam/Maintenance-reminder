
import { useNotificationsBase } from './useNotificationsBase';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useEmailNotifications() {
  const { user, loading, setLoading } = useNotificationsBase();
  
  // Send test email notification
  const sendTestEmailNotification = async (email: string) => {
    if (!email) {
      toast.error('Please provide a valid email address');
      return false;
    }
    
    setLoading(prev => ({ ...prev, email: true }));
    
    try {
      console.log(`Sending test email to: ${email}`);
      
      const { data, error } = await supabase.functions.invoke('send-test-email', {
        body: { email, name: user?.user_metadata?.name || "User" },
      });
      
      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error('Failed to send email');
      
      console.log('Test email response:', data);
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
