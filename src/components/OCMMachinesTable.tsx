
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { OCMMachine, MachineTableProps } from "@/types/machines";
import { useMachineTable } from "@/hooks/useMachineTable";
import { MachineFilters } from "@/components/machines/MachineFilters";
import { EditOCMMachineForm } from "@/components/machines/EditOCMMachineForm";
import { MachineTableHeader } from "@/components/machines/MachineTableHeader";
import { MachineTableRow } from "@/components/machines/MachineTableRow";

const mockOCMMachines: OCMMachine[] = [
  {
    id: "1",
    equipment: "CT Scanner",
    model: "Revolution CT",
    serialNumber: "CT123456",
    manufacturer: "GE Healthcare",
    logNo: "LG101",
    maintenanceDate: "2025-04-15",
  },
  {
    id: "2",
    equipment: "MRI",
    model: "Magnetom Sola",
    serialNumber: "MR789012",
    manufacturer: "Siemens",
    logNo: "LG102",
    maintenanceDate: "2025-07-20",
  },
];

export const OCMMachinesTable = ({ searchTerm, selectedMachines, setSelectedMachines }: MachineTableProps) => {
  const {
    machines: storedMachines,
    setMachines,
    filters,
    setFilters,
    handleDelete,
  } = useMachineTable<OCMMachine>("ocm", mockOCMMachines);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<OCMMachine | null>(null);

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

  const setReminder = (machine: OCMMachine) => {
    toast.success(`Reminder set for ${machine.equipment} annual maintenance`);
  };

  const markCompleted = (machine: OCMMachine) => {
    toast.success(`Annual maintenance for ${machine.equipment} marked as completed`);
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
            type="ocm"
            onSelectAll={handleSelectAll}
            hasSelectedItems={selectedMachines.length > 0}
          />
          <TableBody>
            {filteredMachines.length > 0 ? (
              filteredMachines.map((machine) => (
                <MachineTableRow
                  key={machine.id}
                  machine={machine}
                  type="ocm"
                  isSelected={selectedMachines.includes(machine.id)}
                  onSelect={toggleMachineSelection}
                  onReminder={() => setReminder(machine)}
                  onComplete={() => markCompleted(machine)}
                  onEdit={() => {
                    setEditingMachine(machine);
                    setDialogOpen(true);
                  }}
                  onDelete={() => handleDelete(machine)}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">
                  No OCM machines found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit OCM Machine</DialogTitle>
          </DialogHeader>
          <EditOCMMachineForm
            machine={editingMachine}
            onSave={(updatedMachine) => {
              const updatedMachines = storedMachines.map(m =>
                m.id === updatedMachine.id ? updatedMachine : m
              );
              setMachines(updatedMachines);
              localStorage.setItem("ocmMachines", JSON.stringify(updatedMachines));
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
