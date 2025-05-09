
import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useAppContext } from "@/contexts/AppContext";
import { differenceInDays, parseISO } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { MachinesList } from "@/components/dashboard/MachinesList";
import { Clock } from "@/components/dashboard/Clock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllMachinesTable } from "@/components/machines/AllMachinesTable";

const Dashboard = () => {
  const { markMachineComplete, filteredMachines, getAllMachines, countMachinesByType } = useAppContext();
  const [allMachines, setAllMachines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    frequency: "",
    status: "",
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Get accurate counts from context
  const ppmCount = countMachinesByType("PPM");
  const ocmCount = countMachinesByType("OCM");
  const totalMachines = ppmCount + ocmCount;

  useEffect(() => {
    const fetchMachines = () => {
      const machines = getAllMachines();
      setAllMachines(machines);
    };
    
    fetchMachines();
    const intervalId = setInterval(fetchMachines, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [getAllMachines]);

  // Safe days difference calculation
  const safeDaysDifference = (dateStr: string | null | undefined): number | null => {
    if (!dateStr) return null;
    try {
      const date = parseISO(dateStr);
      if (isNaN(date.getTime())) return null;
      const today = new Date();
      return differenceInDays(date, today);
    } catch (e) {
      console.error("Error calculating days difference:", e, dateStr);
      return null;
    }
  };

  // Calculate counters from ALL machines, including those from LDR
  const counters = allMachines.reduce(
    (acc, machine) => {
      const daysRemaining = safeDaysDifference(machine.nextMaintenanceDate);
      
      if (daysRemaining !== null) {
        if (daysRemaining < 0) {
          acc.overdue += 1;
        } else {
          if (daysRemaining <= 7) {
            acc.upcoming += 1;
          }
          if (daysRemaining <= 14) {
            acc.upcoming14 += 1;
          }
          if (daysRemaining <= 21) {
            acc.upcoming21 += 1;
          }
          if (daysRemaining <= 30) {
            acc.upcoming30 += 1;
          }
          if (daysRemaining <= 60) {
            acc.upcoming60 += 1;
          }
          if (daysRemaining <= 90) {
            acc.upcoming90 += 1;
          }
        }
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

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and manage your machine maintenance schedule
            </p>
          </div>
          <Clock />
        </div>

        <DashboardStats 
          counters={counters} 
          isMobile={isMobile} 
          totalMachines={totalMachines}
          ppmCount={ppmCount}
          ocmCount={ocmCount}
        />

        <Tabs defaultValue="cards" onValueChange={(value) => setViewMode(value as "cards" | "table")}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="cards">Card View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="cards" className="space-y-4">
            <DashboardFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filters={filters}
              setFilters={setFilters}
              isMobile={isMobile}
              isFiltersOpen={isFiltersOpen}
              setIsFiltersOpen={setIsFiltersOpen}
            />

            <MachinesList
              machines={displayedMachines}
              onMarkComplete={markMachineComplete}
            />
          </TabsContent>
          
          <TabsContent value="table">
            <AllMachinesTable />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
