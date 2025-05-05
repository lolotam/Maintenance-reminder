
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { PPMMachinesTable } from "@/components/PPMMachinesTable";
import { AddMachineDialog } from "@/components/AddMachineDialog";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePPMMachines } from "@/hooks/usePPMMachines";

const DepartmentPPMMachines = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
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
    ppmMachinesHook.machines.push({ ...machineData, id: newId });
    ppmMachinesHook.saveToLocalStorage(ppmMachinesHook.machines);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to={`/departments/${departmentId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {displayName}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">{displayName} PPM Machines</h1>
          </div>
          <AddMachineDialog type="ppm" onAddMachine={handleAddMachine} />
        </div>

        <PPMMachinesTable 
          searchTerm={searchTerm}
          selectedMachines={selectedMachines}
          setSelectedMachines={setSelectedMachines}
        />
      </div>
    </MainLayout>
  );
};

export default DepartmentPPMMachines;
