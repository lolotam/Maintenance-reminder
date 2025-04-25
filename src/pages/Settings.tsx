
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

import { EmailNotificationCard } from "@/components/settings/EmailNotificationCard";
import { WhatsAppNotificationCard } from "@/components/settings/WhatsAppNotificationCard";
import { DesktopNotificationCard } from "@/components/settings/DesktopNotificationCard";
import { ReminderDaysCard } from "@/components/settings/ReminderDaysCard";
import { useNotifications } from "@/hooks/useNotifications";

const Settings = () => {
  const { settings, updateSettings } = useAppContext();
  const { user } = useAuth();
  const [email, setEmail] = useState(settings.defaultEmail || "");
  const [reminderDays, setReminderDays] = useState<number[]>(settings.defaultReminderDays || []);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<string | null>(null);
  const [desktopNotifications, setDesktopNotifications] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [whatsappEnabled, setWhatsappEnabled] = useState(settings.whatsappEnabled || false);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || "");
  const [whatsappVerificationStatus, setWhatsappVerificationStatus] = useState<string | null>(null);

  const { requestPermission, sendTestNotification } = useNotifications();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setEmail(data.email || '');
          setReminderDays(data.reminder_days || []);
          setWhatsappEnabled(data.whatsapp_enabled || false);
          setWhatsappNumber(data.whatsapp_number || '');
          setDesktopNotifications(data.desktop_notifications_enabled || false);
        }
      } catch (error: any) {
        toast.error("Error loading settings");
        console.error('Error:', error);
      }
    };

    loadProfile();
  }, [user]);

  const handleReminderDayChange = (day: number) => {
    if (reminderDays.includes(day)) {
      setReminderDays(reminderDays.filter((d) => d !== day));
    } else {
      setReminderDays([...reminderDays, day]);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    toast.loading("Saving settings...");
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email,
          reminder_days: reminderDays,
          whatsapp_enabled: whatsappEnabled,
          whatsapp_number: whatsappNumber,
          desktop_notifications_enabled: desktopNotifications,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local settings
      updateSettings({
        defaultEmail: email,
        defaultReminderDays: reminderDays,
        whatsappEnabled,
        whatsappNumber,
      });

      toast.success("Settings saved successfully", {
        description: "Your notification preferences have been updated.",
      });
      
      // Update verification statuses
      if (email) setEmailVerificationStatus("success");
      if (whatsappEnabled && whatsappNumber) setWhatsappVerificationStatus("success");
      
      // Request desktop notification permissions if needed
      if (desktopNotifications && notificationPermission !== "granted") {
        requestPermission();
      }
    } catch (error: any) {
      toast.error("Error saving settings");
      console.error('Error:', error);
    }
  };

  const handleEnableNotifications = async () => {
    const success = await requestPermission();
    if (success) {
      setDesktopNotifications(true);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure your notification preferences and app settings
          </p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="notifications">Notification Settings</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <EmailNotificationCard
              email={email}
              setEmail={setEmail}
              emailVerificationStatus={emailVerificationStatus}
            />
            
            <WhatsAppNotificationCard
              whatsappEnabled={whatsappEnabled}
              setWhatsappEnabled={setWhatsappEnabled}
              whatsappNumber={whatsappNumber}
              setWhatsappNumber={setWhatsappNumber}
              whatsappVerificationStatus={whatsappVerificationStatus}
            />

            <DesktopNotificationCard
              desktopNotifications={desktopNotifications}
              onEnableNotifications={handleEnableNotifications}
            />

            <ReminderDaysCard
              reminderDays={reminderDays}
              onReminderDayChange={handleReminderDayChange}
            />
          </TabsContent>

          <TabsContent value="account">
            <div className="text-sm text-muted-foreground">
              Account management features will be available in a future update.
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="w-full sm:w-auto">
            Save Settings
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
