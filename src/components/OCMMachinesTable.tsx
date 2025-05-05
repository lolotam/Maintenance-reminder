
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { MachineTableProps } from "@/types/machines";
import { MachineFilters as MachineFiltersComponent } from "@/components/machines/MachineFilters";
import { MachineTableHeader } from "@/components/machines/MachineTableHeader";
import { MachineTableRow } from "@/components/machines/MachineTableRow";
import { useOCMMachines } from "@/hooks/useOCMMachines";
import { OCMEditDialog } from "@/components/machines/OCMEditDialog";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export const OCMMachinesTable = ({ searchTerm, selectedMachines, setSelectedMachines, departmentFilter }: MachineTableProps) => {
  const {
    filteredMachines,
    loading,
    error,
    filters,
    setFilters,
    editingMachine,
    setEditingMachine,
    fetchMachines,
    updateMachine,
    deleteMachine,
    setReminder,
    markCompleted
  } = useOCMMachines();
  
  const [dialogOpen, setDialogOpen] = useState(false);

  // Apply department filter if provided
  const applyDepartmentFilter = (machines: any[]) => {
    if (!departmentFilter) return machines;
    return machines.filter(machine => 
      (machine.location?.toLowerCase() === departmentFilter.toLowerCase()) ||
      (machine.department?.toLowerCase() === departmentFilter.toLowerCase())
    );
  };

  // Set department filter in filters if provided
  useEffect(() => {
    if (departmentFilter && (!filters.department || filters.department !== departmentFilter)) {
      setFilters({
        ...filters,
        department: departmentFilter
      });
    }
  }, [departmentFilter, filters]);

  // Toggle machine selection
  const toggleMachineSelection = (machineId: string) => {
    setSelectedMachines(
      selectedMachines.includes(machineId)
        ? selectedMachines.filter(id => id !== machineId)
        : [...selectedMachines, machineId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    const machines = applyDepartmentFilter(filteredMachines(searchTerm));
    if (selectedMachines.length === machines.length) {
      setSelectedMachines([]);
    } else {
      setSelectedMachines(machines.map(m => m.id));
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading machines: {error.message}</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
          onClick={() => fetchMachines({ type: 'ocm' })}
        >
          Retry
        </button>
      </div>
    );
  }

  // Apply both filters
  const machines = applyDepartmentFilter(filteredMachines(searchTerm));

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <MachineFiltersComponent 
          filters={filters} 
          onFilterChange={(newFilters) => setFilters(newFilters)} 
        />
        
        <div className="overflow-x-auto">
          <Table>
            <MachineTableHeader 
              type="ocm"
              onSelectAll={handleSelectAll}
              hasSelectedItems={selectedMachines.length > 0}
            />
            <TableBody>
              {machines.length > 0 ? (
                machines.map((machine) => (
                  <MachineTableRow
                    key={machine.id}
                    machine={{
                      id: machine.id,
                      equipment: machine.name,
                      model: machine.model || '',
                      serialNumber: machine.serial_number || '',
                      manufacturer: machine.manufacturer || '',
                      logNo: machine.log_number || '',
                      type: 'OCM', // Add machine type
                      department: machine.location || '', // Use location field for department
                      maintenanceDate: machine.next_maintenance_date || '',
                      engineer: machine.engineer_id || '',
                      location: machine.location || '',
                      lastMaintenanceDate: machine.last_maintenance_date,
                      nextMaintenanceDate: machine.next_maintenance_date,
                    }}
                    type="ocm"
                    isSelected={selectedMachines.includes(machine.id)}
                    onSelect={toggleMachineSelection}
                    onReminder={() => setReminder(machine)}
                    onComplete={() => markCompleted(machine)}
                    onEdit={() => {
                      setEditingMachine(machine);
                      setDialogOpen(true);
                    }}
                    onDelete={() => {
                      if (window.confirm(`Are you sure you want to delete ${machine.name}?`)) {
                        deleteMachine(machine.id);
                      }
                    }}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-4">
                    No OCM machines found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <OCMEditDialog
          machine={editingMachine}
          isOpen={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingMachine(null);
          }}
          onUpdate={updateMachine}
        />
      </div>
    </ErrorBoundary>
  );
};
