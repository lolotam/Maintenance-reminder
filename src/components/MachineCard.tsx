
import { differenceInDays, format, parseISO } from "date-fns";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { Machine } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MachineCardProps {
  machine: Machine;
  onMarkComplete: (id: string) => void;
}

export function MachineCard({ machine, onMarkComplete }: MachineCardProps) {
  const nextDate = machine.nextMaintenanceDate ? parseISO(machine.nextMaintenanceDate) : null;
  const today = new Date();
  
  const daysRemaining = nextDate ? differenceInDays(nextDate, today) : 0;
  
  // Determines urgency based on days remaining
  const getUrgencyColor = () => {
    if (daysRemaining <= 0) return "bg-destructive text-destructive-foreground";
    if (daysRemaining <= 7) return "bg-orange-500 text-white";
    if (daysRemaining <= 30) return "bg-yellow-500 text-black";
    return "bg-green-500 text-white";
  };
  
  // Calculate progress for maintenance cycle
  const getProgress = () => {
    const cycleLength = machine.frequency === 'Quarterly' ? 90 : 365;
    const lastDate = parseISO(machine.lastMaintenanceDate);
    const daysPassed = differenceInDays(today, lastDate);
    const progressPercent = Math.min(100, Math.max(0, (daysPassed / cycleLength) * 100));
    return progressPercent;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{machine.name}</CardTitle>
          <Badge variant="outline" className={cn(getUrgencyColor(), "ml-2")}>
            {daysRemaining <= 0 ? "Overdue" : `${daysRemaining} days left`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Last: {format(parseISO(machine.lastMaintenanceDate), "MMM d, yyyy")}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>Next: {nextDate ? format(nextDate, "MMM d, yyyy") : "Not scheduled"}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span>Frequency: {machine.frequency}</span>
          </div>
          
          <div className="pt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Maintenance Cycle</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <button
          onClick={() => onMarkComplete(machine.id)}
          className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Mark as Maintained
        </button>
      </CardFooter>
    </Card>
  );
}
