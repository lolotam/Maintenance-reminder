
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
    availableMachines
  } = useEmployeeTraining();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  // Mock function for importing
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = () => {
      // This would be where file processing happens
      if (input.files?.length) {
        console.log("File selected:", input.files[0].name);
        // You'd process the file here
      }
    };
    input.click();
  };

  // Mock function for exporting
  const handleExport = () => {
    console.log("Exporting data");
    // Here you would generate and download the file
  };

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
          <TemplateDownloader 
            type="training" 
            variant="outline"
          />
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleImport}
              className="gap-1"
            >
              <FileUp className="h-4 w-4" />
              <span>Import</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-1"
            >
              <FileDown className="h-4 w-4" />
              <span>Export</span>
            </Button>
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
