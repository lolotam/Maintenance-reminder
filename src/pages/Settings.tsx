
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

const Settings = () => {
  const { userRole, hasPermission } = useRole();
  
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
            <AppearanceCard />
            <ReminderDaysCard />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  <EmailNotificationCard />
                  <DesktopNotificationCard />
                  <WhatsAppNotificationCard />
                  <MessageNotificationCard />
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
