
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useAppContext } from "@/contexts/AppContext";
import { Check, Mail, Bell, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
  const { settings, updateSettings } = useAppContext();
  const [email, setEmail] = useState(settings.defaultEmail);
  const [isDarkMode, setIsDarkMode] = useState(settings.enableDarkMode);
  const [reminderDays, setReminderDays] = useState<number[]>(settings.defaultReminderDays);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<string | null>(null);

  const handleSaveSettings = () => {
    updateSettings({
      defaultEmail: email,
      enableDarkMode: isDarkMode,
      defaultReminderDays: reminderDays.sort((a, b) => b - a), // Sort descending
    });

    if (email) {
      // Simulate email verification - in a real app, this would be an API call
      setEmailVerificationStatus("verifying");
      setTimeout(() => {
        setEmailVerificationStatus("success");
      }, 1500);
    }
  };

  const handleReminderDayChange = (day: number) => {
    if (reminderDays.includes(day)) {
      setReminderDays(reminderDays.filter((d) => d !== day));
    } else {
      setReminderDays([...reminderDays, day]);
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
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Configure your email settings for maintenance reminders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                    />
                    {emailVerificationStatus === "verifying" && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                        Verifying...
                      </Badge>
                    )}
                    {emailVerificationStatus === "success" && (
                      <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                        <Check className="w-3 h-3 mr-1" /> Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reminder Settings</CardTitle>
                <CardDescription>
                  Choose when you want to receive maintenance reminders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Days before due date</Label>
                  <p className="text-sm text-muted-foreground">
                    Select when you want to receive reminders before maintenance is due
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[30, 14, 7, 3, 1].map((day) => (
                      <Button
                        key={day}
                        variant={reminderDays.includes(day) ? "default" : "outline"}
                        onClick={() => handleReminderDayChange(day)}
                        className={reminderDays.includes(day) ? "bg-primary" : ""}
                      >
                        {day} {day === 1 ? "day" : "days"}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable dark mode for the application
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={setIsDarkMode}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Account management features will be available in a future update.
                </p>
              </CardContent>
            </Card>
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
