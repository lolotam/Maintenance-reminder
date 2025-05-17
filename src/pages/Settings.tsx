
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AppearanceCard } from "@/components/settings/AppearanceCard";
import { ReminderDaysCard } from "@/components/settings/ReminderDaysCard";
import { EmailNotificationCard } from "@/components/settings/EmailNotificationCard";
import { DesktopNotificationCard } from "@/components/settings/DesktopNotificationCard";
import { WhatsAppNotificationCard } from "@/components/settings/WhatsAppNotificationCard";
import { MessageNotificationCard } from "@/components/settings/MessageNotificationCard";
import { UserRolesCard } from "@/components/settings/UserRolesCard";
import { useRole } from "@/contexts/RoleContext";
import { toast } from "sonner";
import { useSettings } from "@/hooks/useSettings";
import { useNotifications } from "@/hooks/useNotifications";

const Settings = () => {
  const { userRole, hasPermission } = useRole();
  const { settings, updateSettings } = useSettings();
  
  // State for email notification settings
  const [email, setEmail] = useState(settings.defaultEmail || "");
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<string | null>(null);
  
  // State for desktop notification settings
  const [desktopNotifications, setDesktopNotifications] = useState(false);
  const { permission } = useNotifications();
  
  // State for WhatsApp notification settings
  const [whatsappEnabled, setWhatsappEnabled] = useState(settings.whatsappEnabled || false);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || "");
  const [whatsappVerificationStatus, setWhatsappVerificationStatus] = useState<string | null>(null);
  
  // State for SMS notification settings
  const [smsEnabled, setSmsEnabled] = useState(settings.smsEnabled || false);
  const [smsNumber, setSmsNumber] = useState(settings.smsNumber || "");
  const [smsVerificationStatus, setSmsVerificationStatus] = useState<string | null>(null);
  
  // State for reminder days
  const [reminderDays, setReminderDays] = useState<number[]>(
    settings.defaultReminderDays || [7, 3, 1]
  );
  
  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(settings.enableDarkMode || false);
  
  const handleReminderDayChange = (day: number) => {
    setReminderDays(reminderDays => 
      reminderDays.includes(day) 
        ? reminderDays.filter(d => d !== day) 
        : [...reminderDays, day].sort((a, b) => b - a)
    );
    
    // Update settings
    updateSettings({
      defaultReminderDays: reminderDays.includes(day) 
        ? reminderDays.filter(d => d !== day) 
        : [...reminderDays, day].sort((a, b) => b - a)
    });
    
    toast.success(`Reminder ${reminderDays.includes(day) ? "removed" : "added"} for ${day} ${day === 1 ? 'day' : 'days'} before due date`);
  };
  
  const handleEnableNotifications = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          setDesktopNotifications(true);
          toast.success("Desktop notifications enabled");
        }
      });
    }
  };
  
  // Update settings when values change
  const updateEmailSettings = (newEmail: string) => {
    setEmail(newEmail);
    updateSettings({ defaultEmail: newEmail });
  };
  
  const updateDarkMode = (enabled: boolean) => {
    setIsDarkMode(enabled);
    updateSettings({ enableDarkMode: enabled });
  };
  
  const updateWhatsAppSettings = (enabled: boolean) => {
    setWhatsappEnabled(enabled);
    updateSettings({ whatsappEnabled: enabled });
    if (!enabled) {
      setWhatsappNumber("");
      updateSettings({ whatsappNumber: "" });
    }
  };
  
  const updateWhatsAppNumber = (number: string) => {
    setWhatsappNumber(number);
    updateSettings({ whatsappNumber: number });
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            {hasPermission('manageUsers') && (
              <TabsTrigger value="users">User Management</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <AppearanceCard 
              isDarkMode={isDarkMode} 
              setIsDarkMode={updateDarkMode} 
            />
            <ReminderDaysCard 
              reminderDays={reminderDays} 
              onReminderDayChange={handleReminderDayChange} 
            />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  <EmailNotificationCard 
                    email={email} 
                    setEmail={updateEmailSettings}
                    emailVerificationStatus={emailVerificationStatus} 
                  />
                  <DesktopNotificationCard 
                    desktopNotifications={permission === "granted"}
                    onEnableNotifications={handleEnableNotifications} 
                  />
                  <WhatsAppNotificationCard 
                    whatsappEnabled={whatsappEnabled}
                    setWhatsappEnabled={updateWhatsAppSettings}
                    whatsappNumber={whatsappNumber}
                    setWhatsappNumber={updateWhatsAppNumber}
                    whatsappVerificationStatus={whatsappVerificationStatus}
                  />
                  <MessageNotificationCard 
                    whatsappEnabled={whatsappEnabled}
                    setWhatsappEnabled={updateWhatsAppSettings}
                    whatsappNumber={whatsappNumber}
                    setWhatsappNumber={updateWhatsAppNumber}
                    whatsappVerificationStatus={whatsappVerificationStatus}
                    smsEnabled={smsEnabled}
                    setSmsEnabled={setSmsEnabled}
                    smsNumber={smsNumber}
                    setSmsNumber={setSmsNumber}
                    smsVerificationStatus={smsVerificationStatus}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {hasPermission('manageUsers') && (
            <TabsContent value="users" className="space-y-4">
              <UserRolesCard />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
