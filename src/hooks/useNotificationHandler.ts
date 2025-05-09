
import { useNotificationsBase } from './useNotificationsBase';
import { useSendNotification } from './useSendNotification';
import { useEmailNotifications } from './useEmailNotifications';
import { useWhatsAppNotifications } from './useWhatsAppNotifications';
import { useSmsNotificationsHandler } from './useSmsNotificationsHandler';
import { usePushNotificationsHandler } from './usePushNotificationsHandler';

export type { 
  Machine, 
  Notification, 
  NotificationInsert, 
  NotificationType 
} from './useNotificationsBase';

export function useNotificationHandler() {
  const { loading, getNotificationHistory } = useNotificationsBase();
  const { sendNotification } = useSendNotification();
  const { sendTestEmailNotification } = useEmailNotifications();
  const { sendTestWhatsAppNotification } = useWhatsAppNotifications();
  const { sendTestSmsNotification } = useSmsNotificationsHandler();
  const { sendTestPushNotification } = usePushNotificationsHandler();

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
