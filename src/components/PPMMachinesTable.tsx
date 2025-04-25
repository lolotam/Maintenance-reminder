import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { PPMMachine, MachineTableProps } from "@/types/machines";
import { useMachineTable } from "@/hooks/useMachineTable";
import { MachineFilters } from "@/components/machines/MachineFilters";
import { MachineActions } from "@/components/machines/MachineActions";
import { EditPPMMachineForm } from "@/components/machines/EditPPMMachineForm";

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const parsedDate = new Date(dateString);
    return format(parsedDate, 'dd/MM/yyyy');
  };

  const isDueSoon = (dateString: string) => {
    if (!dateString) return false;
    try {
      const today = new Date();
      const dueDate = new Date(dateString);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    } catch (error) {
      console.error("Error checking if date is due soon:", error);
      return false;
    }
  };

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
              <TableHead>Q1_Date</TableHead>
              <TableHead>Q1_Engineer</TableHead>
              <TableHead>Q2_Date</TableHead>
              <TableHead>Q2_Engineer</TableHead>
              <TableHead>Q3_Date</TableHead>
              <TableHead>Q3_Engineer</TableHead>
              <TableHead>Q4_Date</TableHead>
              <TableHead>Q4_Engineer</TableHead>
              <TableHead>ACTION</TableHead>
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
                  <TableCell className={isDueSoon(machine.q1.date) ? "text-amber-600 font-medium" : ""}>
                    {formatDate(machine.q1.date)}
                  </TableCell>
                  <TableCell>{machine.q1.engineer}</TableCell>
                  <TableCell className={isDueSoon(machine.q2.date) ? "text-amber-600 font-medium" : ""}>
                    {formatDate(machine.q2.date)}
                  </TableCell>
                  <TableCell>{machine.q2.engineer}</TableCell>
                  <TableCell className={isDueSoon(machine.q3.date) ? "text-amber-600 font-medium" : ""}>
                    {formatDate(machine.q3.date)}
                  </TableCell>
                  <TableCell>{machine.q3.engineer}</TableCell>
                  <TableCell className={isDueSoon(machine.q4.date) ? "text-amber-600 font-medium" : ""}>
                    {formatDate(machine.q4.date)}
                  </TableCell>
                  <TableCell>{machine.q4.engineer}</TableCell>
                  <TableCell>
                    <MachineActions
                      onReminder={() => setReminder(machine, "Current")}
                      onComplete={() => markCompleted(machine, "Current")}
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
