
import { useState } from "react";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, FileUp, FileDown } from "lucide-react";
import { useEmployeeTraining } from "@/hooks/useEmployeeTraining";
import { TrainingFiltersComponent } from "@/components/training/TrainingFilters";
import { TrainingTableHeader } from "@/components/training/TrainingTableHeader";
import { TrainingTableRow } from "@/components/training/TrainingTableRow";
import { TrainingEditDialog } from "@/components/training/TrainingEditDialog";
import { EmployeeTraining } from "@/types/training";
import { TemplateDownloader } from "@/components/machines/TemplateDownloader";
import { ExcelExporter } from "@/components/machines/ExcelExporter";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FileUploader } from "@/components/FileUploader";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";

export const EmployeeTrainingTable = () => {
  const {
    filters,
    setFilters,
    editingEmployee,
    setEditingEmployee,
    filteredEmployees,
    handleDelete,
    bulkDelete,
    addEmployee,
    updateEmployee,
    availableMachines,
    importEmployees
  } = useEmployeeTraining();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importSheetOpen, setImportSheetOpen] = useState(false);

  const employees = filteredEmployees(searchTerm);

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(
      selectedEmployees.includes(employeeId)
        ? selectedEmployees.filter(id => id !== employeeId)
        : [...selectedEmployees, employeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(e => e.id));
    }
  };

  const openAddDialog = () => {
    setEditingEmployee(null);
    setDialogOpen(true);
  };

  const handleDeleteSelected = () => {
    bulkDelete(selectedEmployees);
    setSelectedEmployees([]);
  };

  // Function to handle file import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("No data read from file");
        
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log("Raw imported training data:", jsonData);
        
        if (jsonData.length === 0) {
          toast.error("No data found in the file");
          return;
        }

        // Process and import the data
        const processedData = processTrainingData(jsonData);
        importEmployees(processedData);
        
        toast.success(`${processedData.length} employees imported successfully`);
      } catch (error: any) {
        console.error("Error reading file:", error);
        toast.error(error.message || "Error reading file");
      }
    };
    
    reader.readAsBinaryString(file);
  };

  // Process imported training data
  const processTrainingData = (data: any[]) => {
    return data.map(row => {
      // Extract machine training status
      const machineTraining = availableMachines.map(machineName => ({
        name: machineName,
        trained: (row[machineName]?.toString().toLowerCase() === 'yes' || 
                 row[machineName]?.toString().toLowerCase() === 'true')
      }));

      return {
        id: uuidv4(),
        name: row.Name || row.name || '',
        employeeId: row['Employee ID'] || row.employeeId || '',
        department: row.Department || row.department || '',
        trainer: row.Trainer || row.trainer || '',
        machines: machineTraining
      };
    });
  };

  // Prepare data for export
  const exportData = employees.map(employee => {
    const baseData = {
      Name: employee.name,
      'Employee ID': employee.employeeId,
      Department: employee.department,
      Trainer: employee.trainer
    };
    
    // Add machine training status
    const machineData: {[key: string]: string} = {};
    employee.machines.forEach(machine => {
      machineData[machine.name] = machine.trained ? 'Yes' : 'No';
    });
    
    return { ...baseData, ...machineData };
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedEmployees.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
              className="gap-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete ({selectedEmployees.length})</span>
            </Button>
          )}
          <div className="flex items-center gap-2">
            <TemplateDownloader type="training" variant="outline" />
            
            <Sheet open={importSheetOpen} onOpenChange={setImportSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <FileUp className="h-4 w-4" />
                  <span>Import</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[600px]">
                <SheetHeader className="mb-5">
                  <SheetTitle>Import Employee Training Data</SheetTitle>
                </SheetHeader>
                <div className="space-y-6">
                  <TemplateDownloader 
                    type="training" 
                    fullWidth 
                    buttonText="Download Template" 
                  />
                  <div className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors hover:border-primary/50">
                    <Input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleImport}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
                      <FileUp className="h-10 w-10 text-gray-400" />
                      <p className="text-lg font-medium">
                        Drag & drop your Excel file here
                      </p>
                      <p className="text-sm text-gray-500">
                        or click to select a file (xlsx, xls, csv)
                      </p>
                    </label>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <ExcelExporter
              data={exportData}
              filename="employee_training"
              buttonText="Export"
            />
          </div>
          <Button
            onClick={openAddDialog}
            size="sm"
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Employee</span>
          </Button>
        </div>
      </div>
      
      <TrainingFiltersComponent 
        filters={filters} 
        onFilterChange={(newFilters) => setFilters(newFilters)} 
      />

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TrainingTableHeader 
              onSelectAll={handleSelectAll}
              hasSelectedItems={selectedEmployees.length > 0 && selectedEmployees.length === employees.length}
              availableMachines={availableMachines}
            />
            <TableBody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <TrainingTableRow
                    key={employee.id}
                    employee={employee}
                    isSelected={selectedEmployees.includes(employee.id)}
                    onSelect={toggleEmployeeSelection}
                    onEdit={() => {
                      setEditingEmployee(employee);
                      setDialogOpen(true);
                    }}
                    onDelete={() => handleDelete(employee)}
                    availableMachines={availableMachines}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6 + availableMachines.length} className="text-center py-4">
                    No employees found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <TrainingEditDialog
        employee={editingEmployee}
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={updateEmployee}
        onAdd={addEmployee}
        availableMachines={availableMachines}
      />
    </div>
  );
};
