
import { Bell } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DesktopNotificationCardProps {
  desktopNotifications: boolean;
  notificationPermission: NotificationPermission;
  onEnableNotifications: () => void;
}

export const DesktopNotificationCard = ({
  desktopNotifications,
  notificationPermission,
  onEnableNotifications,
}: DesktopNotificationCardProps) => {
  const handleTestNotification = () => {
    if (notificationPermission === "granted") {
      new Notification("Test Notification", {
        body: "This is a test notification from your maintenance app!",
        icon: "/favicon.ico"
      });
      toast.success("Test notification sent!");
    } else {
      toast.error("Please enable notifications first");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desktop Notifications</CardTitle>
        <CardDescription>
          Get notified on your desktop when maintenance is due
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="desktop-notifications">Desktop Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Receive browser notifications for maintenance reminders
            </p>
          </div>
          <Switch
            id="desktop-notifications"
            checked={desktopNotifications || notificationPermission === "granted"}
            onCheckedChange={(checked) => {
              if (checked) onEnableNotifications();
            }}
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            onClick={handleTestNotification}
            disabled={notificationPermission !== "granted"}
          >
            Send Test Notification
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
