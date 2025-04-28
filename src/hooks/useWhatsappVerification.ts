
import { useState } from 'react';
import { toast } from "sonner";
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export const useWhatsappVerification = () => {
  const [verifying, setVerifying] = useState(false);
  const supabase = useSupabaseClient();

  const sendVerification = async (phoneNumber: string) => {
    if (!phoneNumber) {
      toast.error("Please enter a phone number first");
      return;
    }

    try {
      setVerifying(true);
      
      const { data, error } = await supabase.functions.invoke('verify-whatsapp', {
        body: { phoneNumber }
      });

      if (error) throw error;

      toast.success(`Verification message sent to ${phoneNumber}!`);
      return true;
    } catch (error) {
      console.error('Error sending verification:', error);
      toast.error("Failed to send verification message");
      return false;
    } finally {
      setVerifying(false);
    }
  };

  return {
    verifying,
    sendVerification
  };
};
