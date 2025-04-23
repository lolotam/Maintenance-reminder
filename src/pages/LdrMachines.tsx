
import { useState } from "react";
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

const LdrMachines = () => {
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <MainLayout>
      <div className="space-y-8">
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

        <Tabs defaultValue="ppm" className="w-full">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
            <TabsTrigger value="ppm">PPM Machines</TabsTrigger>
            <TabsTrigger value="ocm">OCM Machines</TabsTrigger>
          </TabsList>
          <TabsContent value="ppm">
            <Card>
              <CardHeader>
                <CardTitle>PPM Machines (Quarterly Maintenance)</CardTitle>
              </CardHeader>
              <CardContent>
                <PPMMachinesTable searchTerm={searchTerm} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ocm">
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
    </MainLayout>
  );
};

export default LdrMachines;
