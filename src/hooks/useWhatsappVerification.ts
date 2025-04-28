
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client"; // Direct import of the Supabase client

export const useWhatsappVerification = () => {
  const [verifying, setVerifying] = useState(false);

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
