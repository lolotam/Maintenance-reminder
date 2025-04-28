import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Wrench, Settings, Bell } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "sonner";
import { useEffect, useState, useCallback } from "react";
const LdrMachines = () => {
  const {
    countMachinesByType
  } = useAppContext();
  const [ppmMachinesCount, setPpmMachinesCount] = useState(0);
  const [ocmMachinesCount, setOcmMachinesCount] = useState(0);

  // Use useCallback to memoize the update function to avoid infinite re-renders
  const updateCounts = useCallback(() => {
    setPpmMachinesCount(countMachinesByType("PPM"));
    setOcmMachinesCount(countMachinesByType("OCM"));
  }, [countMachinesByType]);
  useEffect(() => {
    // Update counts when the component mounts
    updateCounts();

    // Set up an interval to update counts regularly
    const intervalId = setInterval(updateCounts, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [updateCounts]); // Add updateCounts to dependency array

  const handleDashboardLink = () => {
    // Integration with dashboard will be implemented here
    toast.info("Redirecting to dashboard...");
  };
  const handleNotifications = () => {
    // Integration with notifications will be implemented here
    toast.info("Checking maintenance notifications...");
  };
  return <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">
              LDR Machines 
              <span className="ml-2 text-sm text-muted-foreground">
                ({ppmMachinesCount + ocmMachinesCount} Total)
              </span>
            </h1>
            <p className="text-lg mt-2 text-red-600">
              Maintenance Management Dashboard
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleNotifications}>
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/ldr-machines/ppm" className="block">
            <Button variant="outline" size="lg" className="w-full h-32 text-lg flex flex-col gap-2">
              <Wrench className="h-8 w-8" />
              <span className="text-red-600">PPM Machines ({ppmMachinesCount})</span>
              <span className="text-sm text-muted-foreground">Quarterly Maintenance</span>
            </Button>
          </Link>

          <Link to="/ldr-machines/ocm" className="block">
            <Button variant="outline" size="lg" className="w-full h-32 text-lg flex flex-col gap-2">
              <Settings className="h-8 w-8" />
              <span className="text-red-600">OCM Machines ({ocmMachinesCount})</span>
              <span className="text-sm text-muted-foreground">Yearly Maintenance</span>
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>;
};
export default LdrMachines;