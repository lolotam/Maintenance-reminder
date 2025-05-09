
import { useNotificationsBase } from './useNotificationsBase';
import { usePushNotifications } from './usePushNotifications';
import { toast } from 'sonner';

export function usePushNotificationsHandler() {
  const { loading } = useNotificationsBase();
  const { sendTestNotification } = usePushNotifications();
  
  const sendTestPushNotification = async () => {
    try {
      await sendTestNotification();
      return true;
    } catch (error: any) {
      console.error('Error sending test push notification:', error);
      toast.error(`Failed to send test push notification: ${error.message}`);
      return false;
    }
  };

  return {
    pushLoading: loading.push,
    sendTestPushNotification
  };
}
