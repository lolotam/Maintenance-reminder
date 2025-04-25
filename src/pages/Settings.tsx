
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import { EmailNotificationCard } from "@/components/settings/EmailNotificationCard";
import { WhatsAppNotificationCard } from "@/components/settings/WhatsAppNotificationCard";
import { DesktopNotificationCard } from "@/components/settings/DesktopNotificationCard";
import { ReminderDaysCard } from "@/components/settings/ReminderDaysCard";
import { AppearanceCard } from "@/components/settings/AppearanceCard";

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

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === "granted") {
          setDesktopNotifications(true);
          new Notification("Maintenance Reminder", {
            body: "Desktop notifications are now enabled!",
            icon: "/favicon.ico"
          });
          toast.success("Desktop notifications enabled successfully");
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
        toast.error("Could not enable desktop notifications");
      }
    } else {
      toast.error("Your browser doesn't support desktop notifications");
    }
  };

  const handleReminderDayChange = (day: number) => {
    if (reminderDays.includes(day)) {
      setReminderDays(reminderDays.filter((d) => d !== day));
    } else {
      setReminderDays([...reminderDays, day]);
    }
  };

  const handleSaveSettings = () => {
    updateSettings({
      defaultEmail: email,
      enableDarkMode: isDarkMode,
      defaultReminderDays: reminderDays.sort((a, b) => b - a),
      whatsappEnabled,
      whatsappNumber,
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

    if (desktopNotifications && notificationPermission !== "granted") {
      requestNotificationPermission();
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
            
            <WhatsAppNotificationCard
              whatsappEnabled={whatsappEnabled}
              setWhatsappEnabled={setWhatsappEnabled}
              whatsappNumber={whatsappNumber}
              setWhatsappNumber={setWhatsappNumber}
              whatsappVerificationStatus={whatsappVerificationStatus}
            />

            <DesktopNotificationCard
              desktopNotifications={desktopNotifications}
              notificationPermission={notificationPermission}
              onEnableNotifications={requestNotificationPermission}
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
