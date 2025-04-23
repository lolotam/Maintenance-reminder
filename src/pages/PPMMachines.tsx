
import { MainLayout } from "@/components/MainLayout";
import { PPMMachinesTable } from "@/components/PPMMachinesTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { AddMachineDialog } from "@/components/AddMachineDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/AppContext";
import { addMonths } from "date-fns";
import { databaseService } from "@/services/databaseService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const PPMMachines = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const { countMachinesByType } = useAppContext();
  const queryClient = useQueryClient();

  // Use React Query for data fetching
  const { data: ppmMachines, isLoading } = useQuery({
    queryKey: ['ppmMachines'],
    queryFn: databaseService.getPPMMachines,
  });

  const ppmMachinesCount = ppmMachines?.length || 0;

  // Use mutations for data modifications
  const addMachineMutation = useMutation({
    mutationFn: databaseService.addPPMMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ppmMachines'] });
      toast.success("Machine added successfully");
    },
    onError: () => {
      toast.error("Failed to add machine");
    }
  });
  
  const deleteMachineMutation = useMutation({
    mutationFn: (id: string) => databaseService.deletePPMMachine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ppmMachines'] });
      toast.success("Machines deleted successfully");
      setSelectedMachines([]);
    },
    onError: () => {
      toast.error("Failed to delete machines");
    }
  });

  const handleAddMachine = (machineData: any) => {
    try {
      console.log("Adding new PPM machine:", machineData);
      
      // Calculate other quarterly dates if not provided
      const q1Date = new Date(machineData.q1_date || new Date());
      
      // Use provided dates or calculate them if not available
      const q2Date = machineData.q2_date ? new Date(machineData.q2_date) : addMonths(q1Date, 3);
      const q3Date = machineData.q3_date ? new Date(machineData.q3_date) : addMonths(q1Date, 6);
      const q4Date = machineData.q4_date ? new Date(machineData.q4_date) : addMonths(q1Date, 9);
      
      const newMachine = {
        id: machineData.id,
        equipment: machineData.equipment,
        model: machineData.model,
        serialNumber: machineData.serialNumber,
        manufacturer: machineData.manufacturer,
        logNo: machineData.logNo,
        q1: { 
          date: q1Date.toISOString().split('T')[0], 
          engineer: machineData.q1_engineer 
        },
        q2: { 
          date: q2Date.toISOString().split('T')[0], 
          engineer: machineData.q2_engineer 
        },
        q3: { 
          date: q3Date.toISOString().split('T')[0], 
          engineer: machineData.q3_engineer 
        },
        q4: { 
          date: q4Date.toISOString().split('T')[0], 
          engineer: machineData.q4_engineer 
        },
      };
      
      // Use mutation to add machine to database
      addMachineMutation.mutate(newMachine);
    } catch (error) {
      console.error("Error adding machine:", error);
      toast.error("Failed to add machine");
    }
  };

  const handleSelectAll = () => {
    if (!ppmMachines) return;
    
    if (selectedMachines.length === ppmMachines.length) {
      setSelectedMachines([]);
    } else {
      setSelectedMachines(ppmMachines.map((m: any) => m.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedMachines.length === 0) {
      toast.error("Please select machines to delete");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedMachines.length} machines?`)) {
      // Delete each selected machine
      selectedMachines.forEach(id => {
        deleteMachineMutation.mutate(id);
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            PPM Machines 
            <span className="ml-2 text-sm text-muted-foreground">
              ({ppmMachinesCount} Total)
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Quarterly Maintenance Schedule
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search machines..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            {selectedMachines.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedMachines.length})
              </Button>
            )}
            <AddMachineDialog type="ppm" onAddMachine={handleAddMachine} />
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>PPM Machines</CardTitle>
            <Checkbox
              checked={selectedMachines.length > 0}
              onClick={handleSelectAll}
              aria-label="Select all machines"
            />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading machines...</div>
            ) : (
              <PPMMachinesTable 
                searchTerm={searchTerm}
                selectedMachines={selectedMachines}
                setSelectedMachines={setSelectedMachines}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PPMMachines;
