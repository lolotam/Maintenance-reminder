
import { differenceInDays, format, parseISO } from "date-fns";
import { Calendar, Clock, AlertCircle, Tool } from "lucide-react";
import { Machine } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface MachineCardProps {
  machine: Machine;
  onMarkComplete: (id: string) => void;
}

export function MachineCard({ machine, onMarkComplete }: MachineCardProps) {
  const nextDate = machine.nextMaintenanceDate ? parseISO(machine.nextMaintenanceDate) : null;
  const today = new Date();
  
  const daysRemaining = nextDate ? differenceInDays(nextDate, today) : 0;
  const [progressValue, setProgressValue] = useState(0);
  
  // Determines urgency based on days remaining
  const getUrgencyColor = () => {
    if (daysRemaining <= 0) return "bg-destructive text-destructive-foreground";
    if (daysRemaining <= 7) return "bg-warning text-warning-foreground";
    if (daysRemaining <= 30) return "bg-yellow-500 text-black dark:text-white";
    return "bg-success text-success-foreground";
  };
  
  // Calculate progress for maintenance cycle
  const getProgress = () => {
    const cycleLength = machine.frequency === 'Quarterly' ? 90 : 365;
    const lastDate = parseISO(machine.lastMaintenanceDate);
    const daysPassed = differenceInDays(today, lastDate);
    const progressPercent = Math.min(100, Math.max(0, (daysPassed / cycleLength) * 100));
    return progressPercent;
  };

  // Animate progress bar
  useEffect(() => {
    const progress = getProgress();
    const timer = setTimeout(() => {
      setProgressValue(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [machine.lastMaintenanceDate]);

  // Format days remaining text
  const getDaysText = () => {
    if (daysRemaining < 0) return `Overdue by ${Math.abs(daysRemaining)} days`;
    if (daysRemaining === 0) return "Due today";
    return `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left`;
  };

  return (
    <Card className="h-full card-hover transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{machine.name}</CardTitle>
          <Badge variant="outline" className={cn(getUrgencyColor(), "ml-2")}>
            {getDaysText()}
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
              <span>{Math.round(progressValue)}%</span>
            </div>
            {/* Animated progress bar */}
            <Progress value={progressValue} className="h-2 transition-all duration-1000 ease-out" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          onClick={() => onMarkComplete(machine.id)}
          className="w-full py-2 flex items-center justify-center gap-2"
        >
          <Tool className="h-4 w-4" />
          <span>Mark as Maintained</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
