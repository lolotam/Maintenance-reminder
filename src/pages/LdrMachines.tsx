
import { useState, useRef } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PPMMachinesTable } from "@/components/PPMMachinesTable";
import { OCMMachinesTable } from "@/components/OCMMachinesTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AddMachineDialog } from "@/components/AddMachineDialog";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useIsMobile } from "@/hooks/use-mobile";

const LdrMachines = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ppm");
  const isMobile = useIsMobile();
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const handleAddPPMMachine = (data: any) => {
    console.log("Adding PPM machine:", data);
    
    // Create new machine object with ID
    const newMachine = {
      id: uuidv4(),
      equipment: data.equipment,
      model: data.model,
      serialNumber: data.serialNumber,
      manufacturer: data.manufacturer,
      logNo: data.logNo,
      q1: { date: data.q1_date, engineer: data.q1_engineer },
      q2: { date: data.q2_date, engineer: data.q2_engineer },
      q3: { date: data.q3_date, engineer: data.q3_engineer },
      q4: { date: data.q4_date, engineer: data.q4_engineer },
    };
    
    // Get existing machines
    const existingMachines = JSON.parse(localStorage.getItem("ppmMachines") || "[]");
    
    // Add new machine
    const updatedMachines = [...existingMachines, newMachine];
    
    // Save to localStorage
    localStorage.setItem("ppmMachines", JSON.stringify(updatedMachines));
    
    toast.success(`${data.equipment} has been added`);
    
    // Force refresh of the component
    window.location.reload();
  };

  const handleAddOCMMachine = (data: any) => {
    console.log("Adding OCM machine:", data);
    
    // Create new machine object with ID
    const newMachine = {
      id: uuidv4(),
      equipment: data.equipment,
      model: data.model,
      serialNumber: data.serialNumber,
      manufacturer: data.manufacturer,
      logNo: data.logNo,
      maintenanceDate: data.maintenanceDate,
    };
    
    // Get existing machines
    const existingMachines = JSON.parse(localStorage.getItem("ocmMachines") || "[]");
    
    // Add new machine
    const updatedMachines = [...existingMachines, newMachine];
    
    // Save to localStorage
    localStorage.setItem("ocmMachines", JSON.stringify(updatedMachines));
    
    toast.success(`${data.equipment} has been added`);
    
    // Force refresh of the component
    window.location.reload();
  };

  // Setup touch swipe for mobile tabs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    const difference = touchStartX.current - touchEndX.current;
    if (Math.abs(difference) < 50) return; // Minimum swipe distance
    
    if (difference > 0 && activeTab === 'ppm') {
      // Swipe left: ppm -> ocm
      setActiveTab('ocm');
    } else if (difference < 0 && activeTab === 'ocm') {
      // Swipe right: ocm -> ppm
      setActiveTab('ppm');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">LDR Machines</h1>
          <p className="text-muted-foreground mt-2">
            Maintenance schedule for PPM and OCM machines
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search machines by name, model, or manufacturer..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <AddMachineDialog type="ppm" onAddMachine={handleAddPPMMachine} />
            <AddMachineDialog type="ocm" onAddMachine={handleAddOCMMachine} />
          </div>
        </div>

        <div 
          ref={tabsContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="touch-pan-y"
        >
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className={cn(
              "grid w-full max-w-md mb-4", 
              isMobile ? "sticky top-[70px] z-20 bg-background/80 backdrop-blur-sm" : ""
            )}>
              <TabsTrigger value="ppm" className="relative">
                PPM Machines
                <span className="absolute -bottom-1 h-[2px] left-0 right-0 bg-primary scale-x-0 transition-transform group-data-[state=active]:scale-x-100" />
              </TabsTrigger>
              <TabsTrigger value="ocm" className="relative">
                OCM Machines
                <span className="absolute -bottom-1 h-[2px] left-0 right-0 bg-primary scale-x-0 transition-transform group-data-[state=active]:scale-x-100" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ppm" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>PPM Machines (Quarterly Maintenance)</CardTitle>
                </CardHeader>
                <CardContent>
                  <PPMMachinesTable searchTerm={searchTerm} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ocm" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>OCM Machines (Yearly Maintenance)</CardTitle>
                </CardHeader>
                <CardContent>
                  <OCMMachinesTable searchTerm={searchTerm} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default LdrMachines;

// Helper function for conditional class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
