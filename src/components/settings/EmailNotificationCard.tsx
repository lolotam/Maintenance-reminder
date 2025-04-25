
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
  const handleTestEmail = async () => {
    if (!email) {
      toast.error("Please enter an email address first");
      return;
    }

    try {
      // Simulate sending a real email - in production this would call an API
      toast.loading("Sending test email...");
      
      // Wait for a second to simulate the email being sent
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would call your backend here
      // For now, we'll just show a success message
      toast.success(`Test email sent to ${email}!`, {
        description: "In production, this would send a real email through your backend.",
      });
      
      console.log("Test email requested for:", email);
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Failed to send test email");
    }
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

        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            onClick={handleTestEmail}
            disabled={!email}
          >
            Send Test Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
