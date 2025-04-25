
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BellRing, Calendar, ArrowRightLeft } from "lucide-react";
import { Machine } from "@/types";

interface StatsProps {
  counters: {
    overdue: number;
    upcoming: number;
    upcoming14: number;
    upcoming21: number;
    upcoming30: number;
    upcoming60: number;
    upcoming90: number;
    quarterly: number;
    yearly: number;
  };
  isMobile: boolean;
}

export const DashboardStats = ({ counters, isMobile }: StatsProps) => {
  return (
    <div ref={null} className={isMobile ? "mobile-tabs" : "grid gap-4 md:grid-cols-2 lg:grid-cols-4"}>
      <Card className={isMobile ? "mobile-tab-item w-[85vw] max-w-[300px] mr-3" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
          <BellRing className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{counters.quarterly + counters.yearly}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Machines under maintenance
          </p>
        </CardContent>
      </Card>
      
      <Card className={isMobile ? "mobile-tab-item w-[85vw] max-w-[300px] mr-3" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          <div className="h-4 w-4 rounded-full bg-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{counters.overdue}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Require immediate attention
          </p>
        </CardContent>
      </Card>
      
      {/* Upcoming maintenance cards */}
      {[
        { title: "Coming Up (7 days)", count: counters.upcoming },
        { title: "Coming Up (14 days)", count: counters.upcoming14 },
        { title: "Coming Up (21 days)", count: counters.upcoming21 },
        { title: "Coming Up (30 days)", count: counters.upcoming30 },
        { title: "Coming Up (60 days)", count: counters.upcoming60 },
        { title: "Coming Up (90 days)", count: counters.upcoming90 },
      ].map((item) => (
        <Card key={item.title} className={isMobile ? "mobile-tab-item w-[85vw] max-w-[300px] mr-3" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.count}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Due for maintenance soon
            </p>
          </CardContent>
        </Card>
      ))}
      
      <Card className={isMobile ? "mobile-tab-item w-[85vw] max-w-[300px]" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Frequency</CardTitle>
          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="bg-primary/10">{counters.quarterly} Quarterly</Badge>
            <Badge variant="outline" className="bg-primary/10">{counters.yearly} Yearly</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
