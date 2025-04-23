import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface OCMMachine {
  id: string;
  equipment: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  logNo: string;
  maintenanceDate: string;
}

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

interface OCMMachinesTableProps {
  searchTerm: string;
}

export const OCMMachinesTable = ({ searchTerm }: OCMMachinesTableProps) => {
  const [machines, setMachines] = useState<OCMMachine[]>(mockOCMMachines);
  const [filters, setFilters] = useState({
    equipment: "",
    model: "",
    serialNumber: "",
    manufacturer: "",
    logNo: "",
  });

  const filteredMachines = machines.filter((machine) => {
    const matchesSearch = 
      machine.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = 
      machine.equipment.toLowerCase().includes(filters.equipment.toLowerCase()) &&
      machine.model.toLowerCase().includes(filters.model.toLowerCase()) &&
      machine.serialNumber.toLowerCase().includes(filters.serialNumber.toLowerCase()) &&
      machine.manufacturer.toLowerCase().includes(filters.manufacturer.toLowerCase()) &&
      machine.logNo.toLowerCase().includes(filters.logNo.toLowerCase());

    return matchesSearch && matchesFilters;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isDueSoon = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const setReminder = (machine: OCMMachine) => {
    toast.success(`Reminder set for ${machine.equipment} annual maintenance`);
  };

  const markCompleted = (machine: OCMMachine) => {
    toast.success(`Annual maintenance for ${machine.equipment} marked as completed`);
  };

  const handleDelete = (machine: OCMMachine) => {
    if (window.confirm(`Are you sure you want to delete ${machine.equipment}?`)) {
      setMachines(machines.filter(m => m.id !== machine.id));
      toast.success(`${machine.equipment} has been deleted`);
    }
  };

  const handleEdit = (machine: OCMMachine) => {
    toast.info(`Edit functionality for ${machine.equipment} will be implemented soon`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-4">
        <Input
          placeholder="Filter by equipment"
          value={filters.equipment}
          onChange={(e) => setFilters({ ...filters, equipment: e.target.value })}
        />
        <Input
          placeholder="Filter by model"
          value={filters.model}
          onChange={(e) => setFilters({ ...filters, model: e.target.value })}
        />
        <Input
          placeholder="Filter by serial number"
          value={filters.serialNumber}
          onChange={(e) => setFilters({ ...filters, serialNumber: e.target.value })}
        />
        <Input
          placeholder="Filter by manufacturer"
          value={filters.manufacturer}
          onChange={(e) => setFilters({ ...filters, manufacturer: e.target.value })}
        />
        <Input
          placeholder="Filter by log no"
          value={filters.logNo}
          onChange={(e) => setFilters({ ...filters, logNo: e.target.value })}
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Machine</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Serial #</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Log No</TableHead>
              <TableHead>OCM Reminder Date</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead>Edit/Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMachines.length > 0 ? (
              filteredMachines.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>{machine.equipment}</TableCell>
                  <TableCell>{machine.model}</TableCell>
                  <TableCell>{machine.serialNumber}</TableCell>
                  <TableCell>{machine.manufacturer}</TableCell>
                  <TableCell>{machine.logNo}</TableCell>
                  
                  <TableCell>
                    <div className={`${isDueSoon(machine.maintenanceDate) ? "text-amber-600 font-medium" : ""}`}>
                      {formatDate(machine.maintenanceDate)}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex gap-1"
                        onClick={() => setReminder(machine)}
                      >
                        <Bell className="h-4 w-4" />
                        <span>Remind</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex gap-1"
                        onClick={() => markCompleted(machine)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Complete</span>
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(machine)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(machine)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No OCM machines found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
