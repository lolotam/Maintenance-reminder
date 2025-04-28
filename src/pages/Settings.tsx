
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import { EmailNotificationCard } from "@/components/settings/EmailNotificationCard";
import { MessageNotificationCard } from "@/components/settings/MessageNotificationCard";
import { DesktopNotificationCard } from "@/components/settings/DesktopNotificationCard";
import { ReminderDaysCard } from "@/components/settings/ReminderDaysCard";
import { AppearanceCard } from "@/components/settings/AppearanceCard";
import { useNotifications } from "@/hooks/useNotifications";

const Settings = () => {
  const { settings, updateSettings } = useAppContext();
  const [email, setEmail] = useState(settings.defaultEmail || "");
  const [isDarkMode, setIsDarkMode] = useState(settings.enableDarkMode);
  const [reminderDays, setReminderDays] = useState<number[]>(settings.defaultReminderDays || []);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<string | null>(null);
  const [desktopNotifications, setDesktopNotifications] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [whatsappEnabled, setWhatsappEnabled] = useState(settings.whatsappEnabled || false);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || "");
  const [whatsappVerificationStatus, setWhatsappVerificationStatus] = useState<string | null>(null);
  const [smsEnabled, setSmsEnabled] = useState(settings.smsEnabled || false);
  const [smsNumber, setSmsNumber] = useState(settings.smsNumber || "");
  const [smsVerificationStatus, setSmsVerificationStatus] = useState<string | null>(null);

  const { requestPermission } = useNotifications();

  // Load notification permission status on component mount only
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
      setDesktopNotifications(Notification.permission === "granted");
    }
  }, []);

  const handleReminderDayChange = (day: number) => {
    if (reminderDays.includes(day)) {
      setReminderDays(reminderDays.filter((d) => d !== day));
    } else {
      setReminderDays([...reminderDays, day]);
    }
  };

  const handleSaveSettings = () => {
    // Save all settings at once to prevent multiple state updates
    updateSettings({
      defaultEmail: email,
      enableDarkMode: isDarkMode,
      defaultReminderDays: reminderDays.sort((a, b) => a - b),
      whatsappEnabled,
      whatsappNumber,
      smsEnabled,
      smsNumber,
    });

    if (email) {
      setEmailVerificationStatus("verifying");
      setTimeout(() => {
        setEmailVerificationStatus("success");
        toast.success("Settings saved successfully");
      }, 1500);
    }
    
    if (whatsappEnabled && whatsappNumber) {
      setWhatsappVerificationStatus("verifying");
      setTimeout(() => {
        setWhatsappVerificationStatus("success");
      }, 1800);
    }

    if (smsEnabled && smsNumber) {
      setSmsVerificationStatus("verifying");
      setTimeout(() => {
        setSmsVerificationStatus("success");
      }, 1600);
    }

    if (desktopNotifications && notificationPermission !== "granted") {
      requestPermission();
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
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <EmailNotificationCard
              email={email}
              setEmail={setEmail}
              emailVerificationStatus={emailVerificationStatus}
            />
            
            <MessageNotificationCard
              whatsappEnabled={whatsappEnabled}
              setWhatsappEnabled={setWhatsappEnabled}
              whatsappNumber={whatsappNumber}
              setWhatsappNumber={setWhatsappNumber}
              whatsappVerificationStatus={whatsappVerificationStatus}
              smsEnabled={smsEnabled}
              setSmsEnabled={setSmsEnabled}
              smsNumber={smsNumber}
              setSmsNumber={setSmsNumber}
              smsVerificationStatus={smsVerificationStatus}
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

          <TabsContent value="appearance">
            <AppearanceCard
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
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
