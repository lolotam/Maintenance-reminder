
import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEmailNotifications } from "@/hooks/useEmailNotifications";

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
  const { emailLoading, sendTestEmailNotification } = useEmailNotifications();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTestEmail = async () => {
    if (!email) {
      setErrorMessage("Please provide a valid email address");
      return;
    }

    setErrorMessage(null);
    const success = await sendTestEmailNotification(email);
    if (!success) {
      setErrorMessage("Failed to send test email. Please check your email address and try again.");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage(null); // Clear error when user changes input
  };

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
              onChange={handleEmailChange}
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

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

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

        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            onClick={handleTestEmail}
            disabled={!email || emailLoading}
          >
            {emailLoading ? "Sending..." : "Send Test Email"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
