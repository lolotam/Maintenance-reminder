
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
    <Card className="w-fit">
      <CardContent className="flex items-center gap-2 py-3">
        <ClockIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">
          {format(currentTime, "EEEE, dd MMMM yyyy - hh:mm:ss a")}
        </span>
      </CardContent>
    </Card>
  );
};
