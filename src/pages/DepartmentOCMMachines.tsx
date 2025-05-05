
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { OCMMachinesTable } from "@/components/OCMMachinesTable";
import { AddMachineDialog } from "@/components/AddMachineDialog";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useOCMMachines } from "@/hooks/useOCMMachines";
import { useMachineOperations } from "@/hooks/useMachineOperations";

const DepartmentOCMMachines = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const { addMachine } = useMachineOperations();
  const ocmMachinesHook = useOCMMachines();
  
  // State for machine selection and search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  
  // Format the department name for display
  const displayName = departmentId 
    ? departmentId.toUpperCase().replace(/-/g, ' ')
    : "";

  // Custom add machine handler to set the department
  const handleAddMachine = (machineData: any) => {
    // Add department information to the machine data
    const machineWithDepartment = {
      ...machineData,
      department: displayName,
      location: displayName // Set location field which is used for department in OCM
    };
    
    // Use the addMachine function from the hook - fixed by passing only one argument
    addMachine(machineWithDepartment);
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
            <h1 className="text-2xl font-bold tracking-tight">{displayName} OCM Machines</h1>
          </div>
          <AddMachineDialog 
            type="ocm" 
            onAddMachine={handleAddMachine}
            defaultDepartment={displayName}
          />
        </div>

        <OCMMachinesTable 
          searchTerm={searchTerm}
          selectedMachines={selectedMachines}
          setSelectedMachines={setSelectedMachines}
          departmentFilter={displayName} // Add department filter
        />
      </div>
    </MainLayout>
  );
};

export default DepartmentOCMMachines;
