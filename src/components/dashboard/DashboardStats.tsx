
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BellRing, Calendar, ArrowRightLeft, AlertTriangle } from "lucide-react";

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
  totalMachines: number;
  ppmCount: number;
  ocmCount: number;
}

export const DashboardStats = ({ counters, isMobile, totalMachines, ppmCount, ocmCount }: StatsProps) => {
  return (
    <div ref={null} className={isMobile ? "mobile-tabs" : "grid gap-6 md:grid-cols-2 lg:grid-cols-4"}>
      <Card className={cn(
        "shadow-sm border border-border hover:shadow-md transition-all duration-200",
        isMobile ? "mobile-tab-item w-[85vw] max-w-[300px] mr-3" : ""
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">Total Machines</CardTitle>
          <BellRing className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalMachines}</div>
          <p className="text-sm text-muted-foreground mt-1">
            Machines under maintenance
          </p>
        </CardContent>
      </Card>
      
      <Card className={cn(
        "shadow-sm border border-border hover:shadow-md transition-all duration-200",
        isMobile ? "mobile-tab-item w-[85vw] max-w-[300px] mr-3" : ""
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">Overdue</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-destructive">{counters.overdue}</div>
          <p className="text-sm text-muted-foreground mt-1">
            Require immediate attention
          </p>
        </CardContent>
      </Card>
      
      {/* Upcoming maintenance cards */}
      {[
        { title: "Coming Up (7 days)", count: counters.upcoming, icon: Calendar, urgent: true },
        { title: "Coming Up (14 days)", count: counters.upcoming14, icon: Calendar },
        { title: "Coming Up (30 days)", count: counters.upcoming30, icon: Calendar },
        { title: "Coming Up (90 days)", count: counters.upcoming90, icon: Calendar },
      ].map((item) => (
        <Card key={item.title} className={cn(
          "shadow-sm border border-border hover:shadow-md transition-all duration-200",
          isMobile ? "mobile-tab-item w-[85vw] max-w-[300px] mr-3" : ""
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
            <item.icon className={cn("h-4 w-4", item.urgent ? "text-warning" : "text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div className={cn("text-3xl font-bold", item.urgent ? "text-warning" : "")}>{item.count}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Due for maintenance soon
            </p>
          </CardContent>
        </Card>
      ))}
      
      <Card className={cn(
        "shadow-sm border border-border hover:shadow-md transition-all duration-200",
        isMobile ? "mobile-tab-item w-[85vw] max-w-[300px]" : ""
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">Frequency</CardTitle>
          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="bg-primary/10 py-1 px-3">{ppmCount} Quarterly</Badge>
            <Badge variant="outline" className="bg-primary/10 py-1 px-3">{ocmCount} Yearly</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}
