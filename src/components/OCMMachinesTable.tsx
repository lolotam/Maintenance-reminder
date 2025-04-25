import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OCMMachine, MachineTableProps } from "@/types/machines";
import { useMachineTable } from "@/hooks/useMachineTable";
import { MachineFilters } from "@/components/machines/MachineFilters";
import { MachineActions } from "@/components/machines/MachineActions";
import { format } from "date-fns";
import { EditOCMMachineForm } from "@/components/machines/EditOCMMachineForm";

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

  const filteredMachines = storedMachines.filter((machine) => {
    const equipmentMatch = machine.equipment && 
      machine.equipment.toLowerCase().includes(searchTerm.toLowerCase());
    const modelMatch = machine.model && 
      machine.model.toLowerCase().includes(searchTerm.toLowerCase());
    const manufacturerMatch = machine.manufacturer && 
      machine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSearch = equipmentMatch || modelMatch || manufacturerMatch;

    const matchesEquipmentFilter = !filters.equipment || 
      (machine.equipment && machine.equipment.toLowerCase().includes(filters.equipment.toLowerCase()));
    const matchesModelFilter = !filters.model || 
      (machine.model && machine.model.toLowerCase().includes(filters.model.toLowerCase()));
    const matchesSerialFilter = !filters.serialNumber || 
      (machine.serialNumber && machine.serialNumber.toLowerCase().includes(filters.serialNumber.toLowerCase()));
    const matchesManufacturerFilter = !filters.manufacturer || 
      (machine.manufacturer && machine.manufacturer.toLowerCase().includes(filters.manufacturer.toLowerCase()));
    const matchesLogNoFilter = !filters.logNo || 
      (machine.logNo && machine.logNo.toString().toLowerCase().includes(filters.logNo.toLowerCase()));

    const matchesFilters = matchesEquipmentFilter && matchesModelFilter && 
      matchesSerialFilter && matchesManufacturerFilter && matchesLogNoFilter;

    return matchesSearch && matchesFilters;
  });

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "";
    const parsedDate = new Date(dateString);
    return format(parsedDate, 'dd/MM/yyyy');
  };

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

  return (
    <div className="space-y-4">
      <MachineFilters filters={filters} onFilterChange={setFilters} />
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Select</TableHead>
              <TableHead>Equipment_Name</TableHead>
              <TableHead>Model_Serial Number</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Log_Number</TableHead>
              <TableHead>2025 Maintenance Date</TableHead>
              <TableHead>2025 Engineer</TableHead>
              <TableHead>2026 Maintenance Date</TableHead>
              <TableHead>ACTION</TableHead>
              <TableHead>Edit/Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMachines.length > 0 ? (
              filteredMachines.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedMachines.includes(machine.id)}
                      onCheckedChange={() => toggleMachineSelection(machine.id)}
                    />
                  </TableCell>
                  <TableCell>{machine.equipment}</TableCell>
                  <TableCell>{`${machine.model} - ${machine.serialNumber}`}</TableCell>
                  <TableCell>{machine.manufacturer}</TableCell>
                  <TableCell>{machine.logNo}</TableCell>
                  <TableCell>
                    {formatDate(machine.maintenanceDate)}
                  </TableCell>
                  <TableCell>{machine.engineer || "-"}</TableCell>
                  <TableCell>
                    {formatDate(new Date(machine.maintenanceDate).setFullYear(2026))}
                  </TableCell>
                  <TableCell>
                    <MachineActions
                      onReminder={() => setReminder(machine)}
                      onComplete={() => markCompleted(machine)}
                      onEdit={() => {
                        setEditingMachine(machine);
                        setDialogOpen(true);
                      }}
                      onDelete={() => handleDelete(machine)}
                    />
                  </TableCell>
                </TableRow>
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
