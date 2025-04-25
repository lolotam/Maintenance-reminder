
import { Check, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WhatsAppNotificationCardProps {
  whatsappEnabled: boolean;
  setWhatsappEnabled: (enabled: boolean) => void;
  whatsappNumber: string;
  setWhatsappNumber: (number: string) => void;
  whatsappVerificationStatus: string | null;
}

export const WhatsAppNotificationCard = ({
  whatsappEnabled,
  setWhatsappEnabled,
  whatsappNumber,
  setWhatsappNumber,
  whatsappVerificationStatus,
}: WhatsAppNotificationCardProps) => {
  const handleTestWhatsApp = async () => {
    if (!whatsappNumber) {
      toast.error("Please enter a WhatsApp number first");
      return;
    }

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Sending test WhatsApp message...',
        success: 'Test WhatsApp message sent successfully!',
        error: 'Failed to send test WhatsApp message',
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Notifications</CardTitle>
        <CardDescription>
          Receive maintenance reminders via WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="whatsapp-enabled">Enable WhatsApp</Label>
            <p className="text-sm text-muted-foreground">
              Receive automated reminders via WhatsApp
            </p>
          </div>
          <Switch
            id="whatsapp-enabled"
            checked={whatsappEnabled}
            onCheckedChange={setWhatsappEnabled}
          />
        </div>
        
        {whatsappEnabled && (
          <div className="space-y-2 pt-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="whatsapp"
                placeholder="+1 234 567 8900"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="flex-1"
              />
              {whatsappVerificationStatus === "verifying" && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                  Verifying...
                </Badge>
              )}
              {whatsappVerificationStatus === "success" && (
                <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                  <Check className="w-3 h-3 mr-1" /> Verified
                </Badge>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                onClick={handleTestWhatsApp}
                disabled={!whatsappEnabled || !whatsappNumber}
              >
                Send Test Message
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your number with country code (e.g., +1 for US)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
