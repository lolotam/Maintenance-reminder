
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { MachineCard } from "@/components/MachineCard";
import { useAppContext } from "@/contexts/AppContext";
import { Search, Filter, Calendar, BellRing } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { differenceInDays, parseISO } from "date-fns";

const Dashboard = () => {
  const { machines, markMachineComplete, filteredMachines } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    frequency: "",
    status: "",
  });

  // Count machines by status
  const counters = machines.reduce(
    (acc, machine) => {
      const today = new Date();
      const nextDate = machine.nextMaintenanceDate ? new Date(machine.nextMaintenanceDate) : null;
      
      if (nextDate) {
        if (nextDate < today) {
          acc.overdue += 1;
        } else {
          const daysRemaining = differenceInDays(nextDate, today);
          if (daysRemaining <= 7) {
            acc.upcoming += 1;
          }
        }
      }
      
      if (machine.frequency === "Quarterly") {
        acc.quarterly += 1;
      } else {
        acc.yearly += 1;
      }
      
      return acc;
    },
    { overdue: 0, upcoming: 0, quarterly: 0, yearly: 0 }
  );

  // Filter machines based on search term and filters
  const displayedMachines = filteredMachines(searchTerm, filters);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage your machine maintenance schedule
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
              <BellRing className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{machines.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Machines under maintenance
              </p>
            </CardContent>
          </Card>
          
          <Card>
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
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coming Up (7 days)</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{counters.upcoming}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Due for maintenance soon
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frequency</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="outline">{counters.quarterly} Quarterly</Badge>
                <Badge variant="outline">{counters.yearly} Yearly</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search machines..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select
            value={filters.frequency}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, frequency: value }))
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Frequencies</SelectItem>
              <SelectItem value="Quarterly">Quarterly</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setFilters({ frequency: "", status: "" });
            }}
          >
            Reset
          </Button>
        </div>

        {/* Machine cards */}
        {displayedMachines.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedMachines.map((machine) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                onMarkComplete={markMachineComplete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No machines found</h3>
            <p className="text-muted-foreground mt-1">
              {machines.length === 0
                ? "Upload your machine data to get started"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
