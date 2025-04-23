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

  const setReminder = (machine: PPMMachine, quarter: string) => {
    toast.success(`Reminder set for ${machine.equipment} ${quarter} maintenance`);
  };

  const markCompleted = (machine: PPMMachine, quarter: string) => {
    toast.success(`${quarter} maintenance for ${machine.equipment} marked as completed`);
  };

  const handleDelete = (machine: PPMMachine) => {
    if (window.confirm(`Are you sure you want to delete ${machine.equipment}?`)) {
      setMachines(machines.filter(m => m.id !== machine.id));
      toast.success(`${machine.equipment} has been deleted`);
    }
  };

  const handleEdit = (machine: PPMMachine) => {
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
                <TableCell colSpan={10} className="text-center py-4">
                  No PPM machines found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
