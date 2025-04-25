
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ReminderDaysCardProps {
  reminderDays: number[];
  onReminderDayChange: (day: number) => void;
}

export const ReminderDaysCard = ({
  reminderDays,
  onReminderDayChange,
}: ReminderDaysCardProps) => {
  return (
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
                onClick={() => onReminderDayChange(day)}
                className={reminderDays.includes(day) ? "bg-primary" : ""}
              >
                {day} {day === 1 ? "day" : "days"}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
