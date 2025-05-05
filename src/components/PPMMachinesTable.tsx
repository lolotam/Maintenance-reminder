
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { PPMMachine, MachineTableProps } from "@/types/machines";
import { useMachineTable } from "@/hooks/useMachineTable";
import { MachineFilters } from "@/components/machines/MachineFilters";
import { EditPPMMachineForm } from "@/components/machines/EditPPMMachineForm";
import { MachineTableHeader } from "@/components/machines/MachineTableHeader";
import { MachineTableRow } from "@/components/machines/MachineTableRow";

const mockPPMMachines: PPMMachine[] = [
  {
    id: "1",
    equipment: "Ventilator",
    model: "PB840",
    serialNumber: "V123456",
    manufacturer: "Puritan Bennett",
    logNo: "LG001",
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
    q1: { date: "2025-02-20", engineer: "John Smith" },
    q2: { date: "2025-05-20", engineer: "Emma Davis" },
    q3: { date: "2025-08-20", engineer: "Michael Brown" },
    q4: { date: "2025-11-20", engineer: "Sarah Wilson" },
  },
];

export const PPMMachinesTable = ({ searchTerm, selectedMachines, setSelectedMachines }: MachineTableProps) => {
  const {
    machines: storedMachines,
    setMachines,
    filters,
    setFilters,
    handleDelete,
  } = useMachineTable<PPMMachine>("ppm", mockPPMMachines);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<PPMMachine | null>(null);

  // Safe string lowercase comparison helper
  const safeIncludes = (value: string | null | undefined, term: string) => {
    return value && typeof value === 'string' 
      ? value.toLowerCase().includes(term.toLowerCase()) 
      : false;
  };
  
  const filteredMachines = storedMachines.filter((machine) => {
    const equipmentMatch = safeIncludes(machine.equipment, searchTerm);
    const modelMatch = safeIncludes(machine.model, searchTerm);
    const manufacturerMatch = safeIncludes(machine.manufacturer, searchTerm);
    
    const matchesSearch = equipmentMatch || modelMatch || manufacturerMatch;

    const matchesEquipmentFilter = !filters.equipment || 
      safeIncludes(machine.equipment, filters.equipment);
    const matchesModelFilter = !filters.model || 
      safeIncludes(machine.model, filters.model);
    const matchesSerialFilter = !filters.serialNumber || 
      safeIncludes(machine.serialNumber, filters.serialNumber);
    const matchesManufacturerFilter = !filters.manufacturer || 
      safeIncludes(machine.manufacturer, filters.manufacturer);
    const matchesLogNoFilter = !filters.logNo || 
      (machine.logNo && safeIncludes(machine.logNo.toString(), filters.logNo));

    const matchesFilters = matchesEquipmentFilter && matchesModelFilter && 
      matchesSerialFilter && matchesManufacturerFilter && matchesLogNoFilter;

    return matchesSearch && matchesFilters;
  });

  const setReminder = (machine: PPMMachine, quarter: string) => {
    toast.success(`Reminder set for ${machine.equipment} ${quarter} maintenance`);
  };

  const markCompleted = (machine: PPMMachine, quarter: string) => {
    toast.success(`${quarter} maintenance for ${machine.equipment} marked as completed`);
  };

  const toggleMachineSelection = (machineId: string) => {
    setSelectedMachines(
      selectedMachines.includes(machineId)
        ? selectedMachines.filter(id => id !== machineId)
        : [...selectedMachines, machineId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMachines.length === filteredMachines.length) {
      setSelectedMachines([]);
    } else {
      setSelectedMachines(filteredMachines.map(m => m.id));
    }
  };

  return (
    <div className="space-y-4">
      <MachineFilters filters={filters} onFilterChange={setFilters} />
      
      <div className="overflow-x-auto">
        <Table>
          <MachineTableHeader 
            type="ppm"
            onSelectAll={handleSelectAll}
            hasSelectedItems={selectedMachines.length > 0}
          />
          <TableBody>
            {filteredMachines.length > 0 ? (
              filteredMachines.map((machine) => (
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
                <TableCell colSpan={14} className="text-center py-4">
                  No PPM machines found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit PPM Machine</DialogTitle>
          </DialogHeader>
          <EditPPMMachineForm
            machine={editingMachine}
            onSave={(updatedMachine) => {
              const updatedMachines = storedMachines.map(m =>
                m.id === updatedMachine.id ? updatedMachine : m
              );
              setMachines(updatedMachines);
              localStorage.setItem("ppmMachines", JSON.stringify(updatedMachines));
              setDialogOpen(false);
              setEditingMachine(null);
              toast.success(`${updatedMachine.equipment} has been updated`);
            }}
            onCancel={() => {
              setDialogOpen(false);
              setEditingMachine(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
