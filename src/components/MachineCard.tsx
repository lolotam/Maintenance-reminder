
import { differenceInDays, format, parseISO } from "date-fns";
import { Calendar, Clock, AlertCircle, Wrench } from "lucide-react";
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
  const [progressValue, setProgressValue] = useState(0);
  
  // Helper function to check if a date is valid
  const isValidDate = (date: Date | null): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  // Safely parse ISO date string
  const safeParseISO = (dateString: string | null | undefined): Date | null => {
    if (!dateString) return null;
    
    try {
      const date = parseISO(dateString);
      return isValidDate(date) ? date : null;
    } catch (e) {
      console.error("Error parsing date:", e, dateString);
      return null;
    }
  };
  
  const nextDate = safeParseISO(machine.nextMaintenanceDate);
  const today = new Date();
  
  const daysRemaining = nextDate ? differenceInDays(nextDate, today) : null;
  
  const getUrgencyColor = () => {
    if (daysRemaining === null) return "bg-gray-500 text-white";
    if (daysRemaining <= 0) return "bg-destructive text-destructive-foreground";
    if (daysRemaining <= 7) return "bg-warning text-warning-foreground";
    if (daysRemaining <= 30) return "bg-yellow-500 text-black dark:text-white";
    return "bg-success text-success-foreground";
  };
  
  const getProgress = () => {
    if (!machine.lastMaintenanceDate) return 0;
    
    try {
      const lastDate = safeParseISO(machine.lastMaintenanceDate);
      if (!lastDate) return 0;
      
      const cycleLength = machine.frequency === 'Quarterly' ? 90 : 365;
      const daysPassed = differenceInDays(today, lastDate);
      
      // Ensure we have valid daysPassed value
      if (isNaN(daysPassed) || daysPassed < 0) return 0;
      
      const progressPercent = Math.min(100, Math.max(0, (daysPassed / cycleLength) * 100));
      return progressPercent;
    } catch (error) {
      console.error("Error calculating progress:", error);
      return 0;
    }
  };

  // Format date safely
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "Not set";
    
    try {
      const date = safeParseISO(dateString);
      if (!date) return "Invalid date";
      return format(date, "MMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Invalid date";
    }
  };

  useEffect(() => {
    const progress = getProgress();
    const timer = setTimeout(() => {
      setProgressValue(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [machine.lastMaintenanceDate]);

  const getDaysText = () => {
    if (daysRemaining === null) return "Date not set";
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
            <span>Last: {formatDate(machine.lastMaintenanceDate)}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>Next: {nextDate ? formatDate(machine.nextMaintenanceDate) : "Not scheduled"}</span>
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
            <Progress value={progressValue} className="h-2 transition-all duration-1000 ease-out" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          onClick={() => onMarkComplete(machine.id)}
          className="w-full py-2 flex items-center justify-center gap-2"
        >
          <Wrench className="h-4 w-4" />
          <span>Mark as Maintained</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
