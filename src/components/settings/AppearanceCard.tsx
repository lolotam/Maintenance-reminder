
import { Moon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

interface AppearanceCardProps {
  isDarkMode: boolean;
  setIsDarkMode: (enabled: boolean) => void;
}

export const AppearanceCard = ({
  isDarkMode,
  setIsDarkMode,
}: AppearanceCardProps) => {
  useEffect(() => {
    // Update the document class when dark mode changes
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    // Ensure the class is immediately applied
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
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
            onCheckedChange={handleToggleDarkMode}
          />
        </div>
      </CardContent>
    </Card>
  );
};
