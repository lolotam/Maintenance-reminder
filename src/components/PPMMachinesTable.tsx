import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { useState } from "react";
import { MachineTableProps } from "@/types/machines";
import { MachineFilters as MachineFiltersComponent } from "@/components/machines/MachineFilters";
import { MachineTableHeader } from "@/components/machines/MachineTableHeader";
import { MachineTableRow } from "@/components/machines/MachineTableRow";
import { usePPMMachines } from "@/hooks/usePPMMachines";
import { PPMEditDialog } from "@/components/machines/PPMEditDialog";

const mockPPMMachines = [
  {
    id: "1",
    equipment: "Ventilator",
    model: "PB840",
    serialNumber: "V123456",
    manufacturer: "Puritan Bennett",
    logNo: "LG001",
    type: "PPM",
    department: "ICU",
    q1: { date: "2025-03-15", engineer: "John Smith" },
    q2: { date: "2025-06-15", engineer: "Emma Davis" },
    q3: { date: "2025-09-15", engineer: "Michael Brown" },
    q4: { date: "2025-12-15", engineer: "Sarah Wilson" },
  },
  {
    id: "2",
    equipment: "Patient Monitor",
    model: "IntelliVue MX450",
    serialNumber: "PM789012",
    manufacturer: "Philips",
    logNo: "LG002",
    type: "PPM",
    department: "Emergency",
    q1: { date: "2025-02-20", engineer: "John Smith" },
    q2: { date: "2025-05-20", engineer: "Emma Davis" },
    q3: { date: "2025-08-20", engineer: "Michael Brown" },
    q4: { date: "2025-11-20", engineer: "Sarah Wilson" },
  },
];

export const PPMMachinesTable = ({ searchTerm, selectedMachines, setSelectedMachines }: MachineTableProps) => {
  const {
    filteredMachines,
    filters,
    setFilters,
    handleDelete,
    editingMachine,
    setEditingMachine,
    updateMachine,
    setReminder,
    markCompleted
  } = usePPMMachines(mockPPMMachines);
  
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleMachineSelection = (machineId: string) => {
    setSelectedMachines(
      selectedMachines.includes(machineId)
        ? selectedMachines.filter(id => id !== machineId)
        : [...selectedMachines, machineId]
    );
  };

  const handleSelectAll = () => {
    const machines = filteredMachines(searchTerm);
    if (selectedMachines.length === machines.length) {
      setSelectedMachines([]);
    } else {
      setSelectedMachines(machines.map(m => m.id));
    }
  };

  const machines = filteredMachines(searchTerm);

  return (
    <div className="space-y-4">
      <MachineFiltersComponent 
        filters={filters} 
        onFilterChange={(newFilters) => setFilters(newFilters)} 
      />
      
      <div className="overflow-x-auto">
        <Table>
          <MachineTableHeader 
            type="ppm"
            onSelectAll={handleSelectAll}
            hasSelectedItems={selectedMachines.length > 0}
          />
          <TableBody>
            {machines.length > 0 ? (
              machines.map((machine) => (
                <MachineTableRow
                  key={machine.id}
                  machine={machine}
                  type="ppm"
                  isSelected={selectedMachines.includes(machine.id)}
                  onSelect={toggleMachineSelection}
                  onReminder={() => setReminder(machine, "Current")}
                  onComplete={() => markCompleted(machine, "Current")}
                  onEdit={() => {
                    setEditingMachine(machine);
                    setDialogOpen(true);
                  }}
                  onDelete={() => handleDelete(machine)}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={16} className="text-center py-4">
                  No PPM machines found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PPMEditDialog
        machine={editingMachine}
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={updateMachine}
      />
    </div>
  );
};
