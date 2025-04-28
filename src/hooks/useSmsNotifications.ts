
import { useState } from 'react';
import { toast } from "sonner";

export const useSmsNotifications = () => {
  const [sending, setSending] = useState(false);

  const sendTestSms = async (phoneNumber: string) => {
    if (!phoneNumber) {
      toast.error("Please enter a phone number first");
      return;
    }

    try {
      setSending(true);
      
      // In a real implementation with Supabase, you would call your edge function here
      // For now we'll simulate a successful SMS send
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Test SMS notification sent to ${phoneNumber}!`);
      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast.error("Failed to send SMS notification");
      return false;
    } finally {
      setSending(false);
    }
  };

  return {
    sending,
    sendTestSms
  };
};
