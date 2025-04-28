
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock as ClockIcon } from "lucide-react";
import { format } from "date-fns";

export const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="w-fit bg-card/50 backdrop-blur-sm border-muted">
      <CardContent className="flex items-center gap-3 py-3">
        <ClockIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground/90">
          {format(currentTime, "EEEE, dd MMMM yyyy - hh:mm:ss a")}
        </span>
      </CardContent>
    </Card>
  );
};
