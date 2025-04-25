
import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useAppContext } from "@/contexts/AppContext";
import { differenceInDays, parseISO } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { MachinesList } from "@/components/dashboard/MachinesList";

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
      return null;
    }
  };

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
      
      if (machine.frequency === "Quarterly") {
        acc.quarterly += 1;
      } else if (machine.frequency === "Yearly") {
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

  // Get accurate total machine count from context
  const ppmCount = countMachinesByType("PPM");
  const ocmCount = countMachinesByType("OCM");
  const totalMachines = ppmCount + ocmCount;

  // Update quarterly and yearly counts if they don't match the PPM/OCM counts
  if (counters.quarterly !== ppmCount) {
    counters.quarterly = ppmCount;
  }
  if (counters.yearly !== ocmCount) {
    counters.yearly = ocmCount;
  }

  const displayedMachines = filteredMachines(searchTerm, filters);

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your machine maintenance schedule
          </p>
        </div>

        <DashboardStats 
          counters={counters} 
          isMobile={isMobile} 
          totalMachines={totalMachines}
        />

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
      </div>
    </MainLayout>
  );
};

export default Dashboard;
