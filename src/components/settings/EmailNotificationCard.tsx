
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EmailNotificationCardProps {
  email: string;
  setEmail: (email: string) => void;
  emailVerificationStatus: string | null;
}

export const EmailNotificationCard = ({
  email,
  setEmail,
  emailVerificationStatus,
}: EmailNotificationCardProps) => {
  return (
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

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive maintenance reminders via email
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={!!email}
            disabled={!email}
          />
        </div>
      </CardContent>
    </Card>
  );
};
