
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

// Define the PPM Machine type
interface PPMMachine {
  id: string;
  equipment: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  logNo: string;
  q1: { date: string; engineer: string };
  q2: { date: string; engineer: string };
  q3: { date: string; engineer: string };
  q4: { date: string; engineer: string };
}

// Mock data - replace with actual data source
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

interface PPMMachinesTableProps {
  searchTerm: string;
}

export const PPMMachinesTable = ({ searchTerm }: PPMMachinesTableProps) => {
  const [machines, setMachines] = useState<PPMMachine[]>(mockPPMMachines);
  
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
  const setReminder = (machine: PPMMachine, quarter: string) => {
    toast.success(`Reminder set for ${machine.equipment} ${quarter} maintenance`);
  };

  // Function to mark maintenance as completed
  const markCompleted = (machine: PPMMachine, quarter: string) => {
    toast.success(`${quarter} maintenance for ${machine.equipment} marked as completed`);
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
            <TableHead>Q1</TableHead>
            <TableHead>Q2</TableHead>
            <TableHead>Q3</TableHead>
            <TableHead>Q4</TableHead>
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
                
                {/* Q1 Data */}
                <TableCell>
                  <div className="text-sm">
                    <div className={`${isDueSoon(machine.q1.date) ? "text-amber-600 font-medium" : ""}`}>
                      {formatDate(machine.q1.date)}
                    </div>
                    <div className="text-xs text-muted-foreground">{machine.q1.engineer}</div>
                    <div className="flex mt-1 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => setReminder(machine, "Q1")}
                      >
                        <Bell className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => markCompleted(machine, "Q1")}
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                
                {/* Q2 Data */}
                <TableCell>
                  <div className="text-sm">
                    <div className={`${isDueSoon(machine.q2.date) ? "text-amber-600 font-medium" : ""}`}>
                      {formatDate(machine.q2.date)}
                    </div>
                    <div className="text-xs text-muted-foreground">{machine.q2.engineer}</div>
                    <div className="flex mt-1 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => setReminder(machine, "Q2")}
                      >
                        <Bell className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => markCompleted(machine, "Q2")}
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                
                {/* Q3 Data */}
                <TableCell>
                  <div className="text-sm">
                    <div className={`${isDueSoon(machine.q3.date) ? "text-amber-600 font-medium" : ""}`}>
                      {formatDate(machine.q3.date)}
                    </div>
                    <div className="text-xs text-muted-foreground">{machine.q3.engineer}</div>
                    <div className="flex mt-1 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => setReminder(machine, "Q3")}
                      >
                        <Bell className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => markCompleted(machine, "Q3")}
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                
                {/* Q4 Data */}
                <TableCell>
                  <div className="text-sm">
                    <div className={`${isDueSoon(machine.q4.date) ? "text-amber-600 font-medium" : ""}`}>
                      {formatDate(machine.q4.date)}
                    </div>
                    <div className="text-xs text-muted-foreground">{machine.q4.engineer}</div>
                    <div className="flex mt-1 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => setReminder(machine, "Q4")}
                      >
                        <Bell className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => markCompleted(machine, "Q4")}
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                No PPM machines found matching your search criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
