
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { PPMMachinesTable } from "@/components/PPMMachinesTable";
import { AddMachineDialog } from "@/components/AddMachineDialog";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePPMMachines } from "@/hooks/usePPMMachines";
import { useMachineOperations } from "@/hooks/useMachineOperations";
import { TemplateDownloader } from "@/components/machines/TemplateDownloader";
import { Card, CardContent } from "@/components/ui/card";

const DepartmentPPMMachines = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const { addMachine } = useMachineOperations();
  const ppmMachinesHook = usePPMMachines();
  
  // State for machine selection and search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  
  // Format the department name for display
  const displayName = departmentId 
    ? departmentId.toUpperCase().replace(/-/g, ' ')
    : "";

  const handleAddMachine = (machineData: any) => {
    // Generate a unique ID for the new machine
    const newId = crypto.randomUUID();
    const newMachine = { 
      ...machineData, 
      id: newId, 
      department: displayName // Set the department from URL
    };
    
    // Update machines using the setMachines method available from the hook
    const updatedMachines = [...ppmMachinesHook.machines, newMachine];
    ppmMachinesHook.setMachines(updatedMachines);
    
    // Save to local storage
    localStorage.setItem("ppmMachines", JSON.stringify(updatedMachines));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Link to={`/departments/${departmentId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {displayName}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">{displayName} PPM Machines</h1>
          </div>
          <div className="flex gap-2">
            <TemplateDownloader type="PPM" />
            <AddMachineDialog 
              type="ppm" 
              onAddMachine={handleAddMachine} 
              defaultDepartment={displayName}
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <PPMMachinesTable 
              searchTerm={searchTerm}
              selectedMachines={selectedMachines}
              setSelectedMachines={setSelectedMachines}
              departmentFilter={displayName} // Add department filter
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DepartmentPPMMachines;
