
import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { MachineCard } from "@/components/MachineCard";
import { useAppContext } from "@/contexts/AppContext";
import { Search, Filter, Calendar, BellRing, RefreshCw, ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { differenceInDays, parseISO } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Dashboard = () => {
  const { markMachineComplete, filteredMachines, getAllMachines } = useAppContext();
  const [allMachines, setAllMachines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    frequency: "",
    status: "",
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMachines = () => {
      const machines = getAllMachines();
      setAllMachines(machines);
    };
    
    fetchMachines();
    // Set up interval to refresh machines data
    const intervalId = setInterval(fetchMachines, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [getAllMachines]);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!scrollContainerRef.current) return;
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('touchmove', handleTouchMove);
      return () => {
        container.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, []);

  // Helper function to safely check if a date is valid
  const isValidDate = (dateStr: string | null | undefined): boolean => {
    if (!dateStr) return false;
    try {
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    } catch (e) {
      return false;
    }
  };

  // Safe days difference calculation
  const safeDaysDifference = (dateStr: string | null | undefined): number | null => {
    if (!isValidDate(dateStr)) return null;
    try {
      const date = parseISO(dateStr as string);
      const today = new Date();
      return differenceInDays(date, today);
    } catch (e) {
      return null;
    }
  };

  const counters = allMachines.reduce(
    (acc, machine) => {
      const today = new Date();
      const daysRemaining = safeDaysDifference(machine.nextMaintenanceDate);
      
      if (daysRemaining !== null) {
        if (daysRemaining < 0) {
          acc.overdue += 1;
        } else {
          if (daysRemaining <= 7) {
            acc.upcoming += 1;
          } else if (daysRemaining <= 14) {
            acc.upcoming14 += 1;
          } else if (daysRemaining <= 21) {
            acc.upcoming21 += 1;
          } else if (daysRemaining <= 30) {
            acc.upcoming30 += 1;
          } else if (daysRemaining <= 60) {
            acc.upcoming60 += 1;
          } else if (daysRemaining <= 90) {
            acc.upcoming90 += 1;
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
    { 
      overdue: 0, 
      upcoming: 0, 
      upcoming14: 0, 
      upcoming21: 0, 
      upcoming30: 0, 
      upcoming60: 0, 
      upcoming90: 0, 
      quarterly: 0, 
      yearly: 0 
    }
  );

  const displayedMachines = filteredMachines(searchTerm, filters);

  const allDisplayedMachines = [...displayedMachines];
  const regularMachineIds = new Set(displayedMachines.map(m => m.id));
  
  allMachines.forEach(machine => {
    if (!regularMachineIds.has(machine.id)) {
      const matchesSearch = !searchTerm || 
        (machine.name && machine.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFrequency = !filters.frequency || 
        machine.frequency === filters.frequency;
        
      let matchesStatus = true;
      if (filters.status) {
        const daysRemaining = safeDaysDifference(machine.nextMaintenanceDate);
        
        if (daysRemaining !== null) {
          if (filters.status === "overdue") {
            matchesStatus = daysRemaining < 0;
          } else if (filters.status === "upcoming") {
            matchesStatus = daysRemaining >= 0;
          }
        } else {
          matchesStatus = false;
        }
      }
      
      if (matchesSearch && matchesFrequency && matchesStatus) {
        allDisplayedMachines.push(machine);
      }
    }
  });

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your machine maintenance schedule
          </p>
        </div>

        <div ref={scrollContainerRef} className={isMobile ? "mobile-tabs" : "grid gap-4 md:grid-cols-2 lg:grid-cols-4"}>
          <Card className={isMobile ? "mobile-tab-item w-[85vw] max-w-[300px] mr-3" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
              <BellRing className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allMachines.length}</div>
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
          
          <Card className={isMobile ? "mobile-tab-item w-[85vw] max-w-[300px] mr-3" : ""}>
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
          
          <Card className={isMobile ? "mobile-tab-item w-[85vw] max-w-[300px] mr-3" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coming Up (14 days)</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{counters.upcoming14}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Due in 8-14 days
              </p>
            </CardContent>
          </Card>
          
          <Card className={isMobile ? "mobile-tab-item w-[85vw] max-w-[300px] mr-3" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coming Up (21 days)</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{counters.upcoming21}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Due in 15-21 days
              </p>
            </CardContent>
          </Card>
          
          <Card className={isMobile ? "mobile-tab-item w-[85vw] max-w-[300px] mr-3" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coming Up (30 days)</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{counters.upcoming30}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Due in 22-30 days
              </p>
            </CardContent>
          </Card>
          
          <Card className={isMobile ? "mobile-tab-item w-[85vw] max-w-[300px] mr-3" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coming Up (60 days)</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{counters.upcoming60}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Due in 31-60 days
              </p>
            </CardContent>
          </Card>
          
          <Card className={isMobile ? "mobile-tab-item w-[85vw] max-w-[300px] mr-3" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coming Up (90 days)</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{counters.upcoming90}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Due in 61-90 days
              </p>
            </CardContent>
          </Card>
          
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

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search machines..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isMobile ? (
            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </div>
                  <Badge variant={filters.frequency || filters.status ? "default" : "outline"}>
                    {(filters.frequency ? 1 : 0) + (filters.status ? 1 : 0)}
                  </Badge>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 space-y-4">
                <Select
                  value={filters.frequency}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, frequency: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Frequencies</SelectItem>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({ frequency: "", status: "" });
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <div className="flex flex-wrap gap-4">
              <Select
                value={filters.frequency}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, frequency: value }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frequencies</SelectItem>
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
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
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
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          )}
        </div>

        {allDisplayedMachines.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allDisplayedMachines.map((machine) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                onMarkComplete={markMachineComplete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <BellRing className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No machines found</h3>
            <p className="text-muted-foreground mt-1">
              {allMachines.length === 0
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
