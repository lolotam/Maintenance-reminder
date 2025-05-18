
import { useState } from "react";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { useEmployeeTraining } from "@/hooks/useEmployeeTraining";
import { TrainingFiltersComponent } from "@/components/training/TrainingFilters";
import { TrainingTableHeader } from "@/components/training/TrainingTableHeader";
import { TrainingTableRow } from "@/components/training/TrainingTableRow";
import { TrainingEditDialog } from "@/components/training/TrainingEditDialog";
import { useTrainingSelection } from "@/components/training/TrainingSelectionManager";
import { TrainingToolbar } from "@/components/training/TrainingToolbar";

interface EmployeeTrainingTableProps {
  searchTerm?: string;
}

export const EmployeeTrainingTable = ({ searchTerm: externalSearchTerm }: EmployeeTrainingTableProps = {}) => {
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

  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const {
    selectedEmployees,
    toggleEmployeeSelection,
    handleSelectAll,
    clearSelection,
    isSelected
  } = useTrainingSelection();

  // Get filtered employees
  const employees = filteredEmployees(searchTerm);

  const openAddDialog = () => {
    setEditingEmployee(null);
    setDialogOpen(true);
  };

  const handleDeleteSelected = () => {
    bulkDelete(selectedEmployees);
    clearSelection();
  };
  
  const handleImportSuccess = () => {
    // Refresh data or perform other actions after successful import
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      <TrainingToolbar 
        searchTerm={searchTerm}
        onSearchChange={setInternalSearchTerm}
        selectedEmployees={selectedEmployees}
        onClearSelection={clearSelection}
        onBulkDelete={handleDeleteSelected}
        onAddEmployee={openAddDialog}
        onImportSuccess={handleImportSuccess}
      />
      
      <TrainingFiltersComponent 
        filters={filters} 
        onFilterChange={(newFilters) => setFilters(newFilters)} 
      />

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TrainingTableHeader 
              onSelectAll={() => handleSelectAll(employees)}
              hasSelectedItems={selectedEmployees.length > 0 && selectedEmployees.length === employees.length}
              availableMachines={availableMachines}
            />
            <TableBody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <TrainingTableRow
                    key={employee.id}
                    employee={employee}
                    isSelected={isSelected(employee.id)}
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
