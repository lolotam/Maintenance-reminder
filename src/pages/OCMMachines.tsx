import { MainLayout } from "@/components/MainLayout";
import { OCMMachinesTable } from "@/components/OCMMachinesTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Upload, Download } from "lucide-react";
import { useState } from "react";
import { AddMachineDialog } from "@/components/AddMachineDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/AppContext";
import { addYears } from "date-fns";
import { FileUploader } from "@/components/FileUploader";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { downloadTemplate } from "@/utils/excelTemplates";

const OCMMachines = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const { countMachinesByType } = useAppContext();

  const ocmMachinesCount = countMachinesByType("OCM");

  const handleAddMachine = (machineData: any) => {
    try {
      console.log("Adding new OCM machine:", machineData);
      
      let maintenance2026Date = machineData.maintenance2026?.date;
      if (!maintenance2026Date && machineData.maintenance2025?.date) {
        const date2025 = new Date(machineData.maintenance2025.date);
        maintenance2026Date = addYears(date2025, 1).toISOString().split('T')[0];
      }
      
      const newMachine = {
        id: machineData.id,
        equipment: machineData.equipment,
        model: machineData.model,
        serialNumber: machineData.serialNumber,
        manufacturer: machineData.manufacturer,
        logNo: machineData.logNo,
        maintenance2024: {
          date: machineData.maintenance2024.date,
          engineer: machineData.maintenance2024.engineer,
        },
        maintenance2025: {
          date: machineData.maintenance2025.date,
          engineer: machineData.maintenance2025.engineer,
        },
        maintenance2026: {
          date: maintenance2026Date || "",
          engineer: machineData.maintenance2026?.engineer || "",
        },
      };
      
      const storedMachines = JSON.parse(localStorage.getItem("ocmMachines") || "[]");
      localStorage.setItem("ocmMachines", JSON.stringify([...storedMachines, newMachine]));
      toast.success(`${machineData.equipment} has been added`);
      window.location.reload();
    } catch (error) {
      console.error("Error adding machine:", error);
      toast.error("Failed to add machine");
    }
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
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            OCM Machines 
            <span className="ml-2 text-sm text-muted-foreground">
              ({ocmMachinesCount} Total)
            </span>
          </h1>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadTemplate('OCM')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import Data
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[600px]">
                <SheetHeader className="mb-5">
                  <SheetTitle>Import OCM Machines Data</SheetTitle>
                </SheetHeader>
                <div className="space-y-6">
                  <Button 
                    variant="outline"
                    onClick={() => downloadTemplate('OCM')}
                    className="flex items-center gap-2 w-full"
                  >
                    Download Template
                  </Button>
                  <FileUploader 
                    onDataReady={(machines) => {
                      toast.success(`${machines.length} machines imported successfully!`);
                      window.location.reload();
                    }} 
                    type="OCM"
                  />
                </div>
              </SheetContent>
            </Sheet>

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
