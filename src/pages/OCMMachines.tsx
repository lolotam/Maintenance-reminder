
import { MainLayout } from "@/components/MainLayout";
import { OCMMachinesTable } from "@/components/OCMMachinesTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddMachineDialog } from "@/components/AddMachineDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const OCMMachines = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);

  const handleAddMachine = (machineData: any) => {
    console.log("Adding new OCM machine:", machineData);
  };

  const handleSelectAll = () => {
    const storedMachines = JSON.parse(localStorage.getItem("ocmMachines") || "[]");
    if (selectedMachines.length === storedMachines.length) {
      setSelectedMachines([]);
    } else {
      setSelectedMachines(storedMachines.map((m: any) => m.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedMachines.length === 0) {
      toast.error("Please select machines to delete");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedMachines.length} machines?`)) {
      const storedMachines = JSON.parse(localStorage.getItem("ocmMachines") || "[]");
      const updatedMachines = storedMachines.filter((m: any) => !selectedMachines.includes(m.id));
      localStorage.setItem("ocmMachines", JSON.stringify(updatedMachines));
      setSelectedMachines([]);
      toast.success(`${selectedMachines.length} machines deleted successfully`);
      window.location.reload();
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">OCM Machines</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Yearly Maintenance Schedule
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
            <AddMachineDialog type="ocm" onAddMachine={handleAddMachine} />
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>OCM Machines</CardTitle>
            <Checkbox
              checked={selectedMachines.length > 0}
              onClick={handleSelectAll}
              aria-label="Select all machines"
            />
          </CardHeader>
          <CardContent>
            <OCMMachinesTable 
              searchTerm={searchTerm}
              selectedMachines={selectedMachines}
              setSelectedMachines={setSelectedMachines} 
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default OCMMachines;
