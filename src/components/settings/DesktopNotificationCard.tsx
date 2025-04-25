
import { Bell } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DesktopNotificationCardProps {
  desktopNotifications: boolean;
  onEnableNotifications: () => void;
}

export const DesktopNotificationCard = ({
  desktopNotifications,
  onEnableNotifications,
}: DesktopNotificationCardProps) => {
  const { permission, supported, sendTestNotification } = useNotifications();

  const isEnabled = permission === "granted";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Desktop Notifications
        </CardTitle>
        <CardDescription>
          Get notified on your desktop when maintenance is due
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="desktop-notifications">Desktop Alerts</Label>
            <p className="text-sm text-muted-foreground">
              {supported 
                ? "Receive browser notifications for maintenance reminders" 
                : "Your browser doesn't support notifications"}
            </p>
          </div>
          <Switch
            id="desktop-notifications"
            checked={isEnabled}
            onCheckedChange={(checked) => {
              if (checked) onEnableNotifications();
            }}
            disabled={!supported}
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            onClick={sendTestNotification}
            disabled={!isEnabled}
          >
            Send Test Notification
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
