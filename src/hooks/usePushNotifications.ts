
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function usePushNotifications() {
  const { user } = useAuth();
  const [vapidKey, setVapidKey] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(false);
  
  // Check if push notifications are supported
  useEffect(() => {
    const isPushSupported = () => {
      setSupported(
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window
      );
    };

    isPushSupported();
    
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Get VAPID key from server
  const getVapidKey = async () => {
    try {
      // This would come from your Supabase function
      const { data, error } = await supabase.functions.invoke('get-vapid-key');
      
      if (error) throw new Error(error.message);
      
      if (data && data.publicKey) {
        setVapidKey(data.publicKey);
        return data.publicKey;
      }
      
      throw new Error('Failed to get VAPID key');
    } catch (error) {
      console.error('Error getting VAPID key:', error);
      return null;
    }
  };

  // Subscribe to push notifications
  const subscribeToPush = async (): Promise<boolean> => {
    if (!supported || !user) return false;
    if (permissionStatus === 'denied') return false;
    
    setLoading(true);
    
    try {
      // Request permission if needed
      if (permissionStatus !== 'granted') {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        if (permission !== 'granted') {
          throw new Error('Notification permission not granted');
        }
      }
      
      // Register service worker if needed
      const registration = await navigator.serviceWorker.ready;
      
      // Get the VAPID key
      const publicVapidKey = vapidKey || await getVapidKey();
      if (!publicVapidKey) throw new Error('Failed to get VAPID key');
      
      // Create or get existing push subscription
      let sub = await registration.pushManager.getSubscription();
      
      if (!sub) {
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });
      }
      
      setSubscription(sub);
      
      // Send subscription to server
      await saveSubscription(sub);
      
      toast.success('Push notifications enabled');
      return true;
    } catch (error: any) {
      console.error('Error subscribing to push:', error);
      toast.error(`Failed to subscribe: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Save subscription to Supabase
  const saveSubscription = async (sub: PushSubscription) => {
    if (!user) return false;
    
    try {
      const subJSON = sub.toJSON();
      
      const { error } = await supabase.from('push_notification_subscriptions').upsert({
        user_id: user.id,
        endpoint: sub.endpoint,
        p256dh: subJSON.keys?.p256dh || '',
        auth: subJSON.keys?.auth || '',
      }, {
        onConflict: 'user_id,endpoint',
      });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error saving subscription:', error);
      return false;
    }
  };

  // Unsubscribe from push notifications
  const unsubscribeFromPush = async (): Promise<boolean> => {
    if (!supported || !user) return false;
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Remove from database
        if (user) {
          await supabase
            .from('push_notification_subscriptions')
            .delete()
            .eq('user_id', user.id)
            .eq('endpoint', subscription.endpoint);
        }
        
        setSubscription(null);
        toast.success('Push notifications disabled');
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error unsubscribing from push:', error);
      toast.error(`Failed to unsubscribe: ${error.message}`);
      return false;
    }
  };

  // Send a test notification
  const sendTestNotification = async () => {
    if (!user) return;
    
    try {
      await supabase.functions.invoke('send-test-notification', {
        body: { userId: user.id },
      });
      
      toast.success('Test notification sent');
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('Failed to send test notification');
    }
  };

  // Helper to convert base64 to UInt8Array
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  };

  return {
    supported,
    permissionStatus,
    subscription,
    loading,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestNotification,
  };
}
