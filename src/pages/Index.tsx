
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useAppContext } from "@/contexts/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PPMMachinesTable } from "@/components/PPMMachinesTable";
import { OCMMachinesTable } from "@/components/OCMMachinesTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "@/components/dashboard/Clock";
import { differenceInDays, parseISO } from "date-fns";

const Dashboard = () => {
  const { getAllMachines, countMachinesByType } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPPMMachines, setSelectedPPMMachines] = useState<string[]>([]);
  const [selectedOCMMachines, setSelectedOCMMachines] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("ppm");
  
  // Get accurate counts from context
  const ppmCount = countMachinesByType("PPM");
  const ocmCount = countMachinesByType("OCM");
  const totalMachines = ppmCount + ocmCount;

  // Calculate statistics for dashboard
  const [stats, setStats] = useState({
    total: totalMachines,
    ppm: ppmCount,
    ocm: ocmCount,
    pending: 0,
    maintained: 0,
    dueThisWeek: 0,
    overdue: 0,
  });

  useEffect(() => {
    const machines = getAllMachines();
    let pendingCount = 0;
    let maintainedCount = 0;
    let dueThisWeekCount = 0;
    let overdueCount = 0;

    machines.forEach(machine => {
      if (!machine.lastMaintenanceDate) {
        pendingCount++;
      } else {
        maintainedCount++;
      }

      if (machine.nextMaintenanceDate) {
        try {
          const daysRemaining = differenceInDays(
            parseISO(machine.nextMaintenanceDate),
            new Date()
          );
          
          if (daysRemaining < 0) {
            overdueCount++;
          } else if (daysRemaining <= 7) {
            dueThisWeekCount++;
          }
        } catch (e) {
          console.error("Error calculating days difference:", e);
        }
      }
    });

    setStats({
      total: totalMachines,
      ppm: ppmCount,
      ocm: ocmCount,
      pending: pendingCount,
      maintained: maintainedCount,
      dueThisWeek: dueThisWeekCount,
      overdue: overdueCount,
    });
  }, [getAllMachines, totalMachines, ppmCount, ocmCount]);

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Maintenance Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and manage your machine maintenance schedule
            </p>
          </div>
          <Clock />
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-2">
                PPM: {stats.ppm} • OCM: {stats.ocm}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pending Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Machines awaiting maintenance
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.dueThisWeek}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Machines due within 7 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.overdue}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Machines past their maintenance date
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs for PPM and OCM */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 w-full md:w-[400px]">
            <TabsTrigger value="ppm">PPM Machines</TabsTrigger>
            <TabsTrigger value="ocm">OCM Machines</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ppm" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Preventive Maintenance Machines</h2>
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
              >
                Clear Filters
              </Button>
            </div>
            <PPMMachinesTable
              searchTerm={searchTerm}
              selectedMachines={selectedPPMMachines}
              setSelectedMachines={setSelectedPPMMachines}
            />
          </TabsContent>
          
          <TabsContent value="ocm" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">On-Call Maintenance Machines</h2>
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
              >
                Clear Filters
              </Button>
            </div>
            <OCMMachinesTable
              searchTerm={searchTerm}
              selectedMachines={selectedOCMMachines}
              setSelectedMachines={setSelectedOCMMachines}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
