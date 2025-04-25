
import { useState, useEffect } from 'react';
import { toast } from "sonner";

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    // Check if the browser supports notifications and service workers
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  };

  const requestPermission = async () => {
    if (!supported) {
      toast.error("Your browser doesn't support notifications");
      return false;
    }

    try {
      // Register service worker first
      await registerServiceWorker();
      
      // Request notification permission
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === "granted") {
        toast.success("Notifications enabled successfully");
        return true;
      } else {
        toast.error("Notification permission denied");
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error("Could not enable notifications");
      return false;
    }
  };

  const sendTestNotification = async () => {
    if (permission !== "granted") {
      toast.error("Please enable notifications first");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Remove the problematic 'vibrate' property and use standard Notification options
      const notificationOptions: NotificationOptions = {
        body: "Test notification from your maintenance app!",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        requireInteraction: true
      };

      await registration.showNotification("Test Notification", notificationOptions);
      
      toast.success("Test notification sent!");
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error("Failed to send notification");
    }
  };

  return {
    permission,
    supported,
    requestPermission,
    sendTestNotification
  };
};

