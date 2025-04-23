
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Define the OCM Machine type
interface OCMMachine {
  id: string;
  equipment: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  logNo: string;
  maintenanceDate: string;
}

// Mock data - replace with actual data source
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
  
  // Filter machines based on search term
  const filteredMachines = machines.filter(
    (machine) =>
      machine.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Function to check if maintenance is due soon (within 7 days)
  const isDueSoon = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  // Function to set reminder
  const setReminder = (machine: OCMMachine) => {
    toast.success(`Reminder set for ${machine.equipment} annual maintenance`);
  };

  // Function to mark maintenance as completed
  const markCompleted = (machine: OCMMachine) => {
    toast.success(`Annual maintenance for ${machine.equipment} marked as completed`);
  };

  return (
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
                
                {/* Maintenance Date */}
                <TableCell>
                  <div className={`${isDueSoon(machine.maintenanceDate) ? "text-amber-600 font-medium" : ""}`}>
                    {formatDate(machine.maintenanceDate)}
                  </div>
                </TableCell>
                
                {/* Actions */}
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No OCM machines found matching your search criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
