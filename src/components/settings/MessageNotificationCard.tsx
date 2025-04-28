import { Check, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSmsNotifications } from "@/hooks/useSmsNotifications";
import { useWhatsappVerification } from "@/hooks/useWhatsappVerification";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MessageNotificationCardProps {
  whatsappEnabled: boolean;
  setWhatsappEnabled: (enabled: boolean) => void;
  whatsappNumber: string;
  setWhatsappNumber: (number: string) => void;
  whatsappVerificationStatus: string | null;
  smsEnabled: boolean;
  setSmsEnabled: (enabled: boolean) => void;
  smsNumber: string;
  setSmsNumber: (number: string) => void;
  smsVerificationStatus: string | null;
}

export const MessageNotificationCard = ({
  whatsappEnabled,
  setWhatsappEnabled,
  whatsappNumber,
  setWhatsappNumber,
  whatsappVerificationStatus,
  smsEnabled,
  setSmsEnabled,
  smsNumber,
  setSmsNumber,
  smsVerificationStatus,
}: MessageNotificationCardProps) => {
  const { sending, sendTestSms } = useSmsNotifications();
  const { verifying, sendVerification } = useWhatsappVerification();

  const handleTestWhatsApp = async () => {
    if (!whatsappNumber) {
      toast.error("Please enter a WhatsApp number first");
      return;
    }

    await sendVerification(whatsappNumber);
  };

  const handleTestSms = async () => {
    if (!smsNumber) {
      toast.error("Please enter a phone number first");
      return;
    }
    
    await sendTestSms(smsNumber);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Notifications</CardTitle>
        <CardDescription>
          Receive maintenance reminders via messages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="sms">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sms" className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-enabled">Enable SMS</Label>
                <p className="text-sm text-muted-foreground">
                  Receive automated reminders via SMS
                </p>
              </div>
              <Switch
                id="sms-enabled"
                checked={smsEnabled}
                onCheckedChange={setSmsEnabled}
              />
            </div>
            
            {smsEnabled && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="sms">Phone Number</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="sms"
                    placeholder="+1 234 567 8900"
                    value={smsNumber}
                    onChange={(e) => setSmsNumber(e.target.value)}
                    className="flex-1"
                  />
                  {smsVerificationStatus === "verifying" && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                      Verifying...
                    </Badge>
                  )}
                  {smsVerificationStatus === "success" && (
                    <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                      <Check className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleTestSms}
                    disabled={!smsEnabled || !smsNumber || sending}
                  >
                    {sending ? "Sending..." : "Send Test SMS"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your number with country code (e.g., +1 for US)
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="whatsapp" className="space-y-4 pt-2">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
