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
import { useAppContext } from "@/contexts/AppContext";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";

interface OCMMachine {
  id: string;
  equipment: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  logNo: string;
  maintenanceDate: string | Date;
  engineer?: string;
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

const formSchema = z.object({
  equipment: z.string().min(1, "Equipment name is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  logNo: z.string().min(1, "Log number is required"),
  maintenanceDate: z.string().min(1, "Maintenance date is required"),
});

type FormData = z.infer<typeof formSchema>;

interface OCMMachinesTableProps {
  searchTerm: string;
  selectedMachines: string[];
  setSelectedMachines: (machines: string[]) => void;
}

export const OCMMachinesTable = ({ searchTerm, selectedMachines, setSelectedMachines }: OCMMachinesTableProps) => {
  const { machines, addMachines, updateMachine, deleteMachine } = useAppContext();
  const [storedMachines, setStoredMachines] = useState<OCMMachine[]>(() => {
    const stored = localStorage.getItem("ocmMachines");
    return stored ? JSON.parse(stored) : mockOCMMachines;
  });
  
  const [filters, setFilters] = useState({
    equipment: "",
    model: "",
    serialNumber: "",
    manufacturer: "",
    logNo: "",
  });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<OCMMachine | null>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipment: "",
      model: "",
      serialNumber: "",
      manufacturer: "",
      logNo: "",
      maintenanceDate: "",
    },
  });
  
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

  const saveToLocalStorage = (machines: OCMMachine[]) => {
    localStorage.setItem("ocmMachines", JSON.stringify(machines));
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const isDueSoon = (dateString: string | Date) => {
    if (!dateString) return false;
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
      const newMachines = storedMachines.filter(m => m.id !== machine.id);
      setStoredMachines(newMachines);
      saveToLocalStorage(newMachines);
      toast.success(`${machine.equipment} has been deleted`);
    }
  };

  const handleEdit = (machine: OCMMachine) => {
    setEditingMachine(machine);
    form.reset({
      equipment: machine.equipment,
      model: machine.model,
      serialNumber: machine.serialNumber,
      manufacturer: machine.manufacturer,
      logNo: machine.logNo,
      maintenanceDate: typeof machine.maintenanceDate === 'string' ? machine.maintenanceDate : '',
    });
    setDialogOpen(true);
  };

  const calculateYearlyDate = (maintenanceDate: string) => {
    const currentDate = new Date(maintenanceDate);
    const nextYear = new Date(currentDate);
    nextYear.setDate(nextYear.getDate() + 365); // Add 365 days for next year
    
    return {
      currentYear: currentDate.toISOString().split('T')[0],
      nextYear: nextYear.toISOString().split('T')[0]
    };
  };

  const onSubmit = (data: FormData) => {
    if (editingMachine) {
      const dates = calculateYearlyDate(data.maintenanceDate);
      const updatedMachine = {
        ...editingMachine,
        equipment: data.equipment,
        model: data.model,
        serialNumber: data.serialNumber,
        manufacturer: data.manufacturer,
        logNo: data.logNo,
        maintenanceDate: dates.currentYear,
        nextYearDate: dates.nextYear
      };
      
      const updatedMachines = storedMachines.map(machine => 
        machine.id === editingMachine.id ? updatedMachine : machine
      );
      
      setStoredMachines(updatedMachines);
      saveToLocalStorage(updatedMachines);
      toast.success(`${data.equipment} has been updated`);
    }
    setDialogOpen(false);
    setEditingMachine(null);
    form.reset();
  };

  const formatYearlyDate = (dateString: string | Date, targetYear: number) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      const formattedDate = new Date(date);
      formattedDate.setFullYear(targetYear);
      
      return formatDate(formattedDate);
    } catch (e) {
      console.error("Error formatting date:", e);
      return "";
    }
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
              <TableHead className="w-12">Select</TableHead>
              <TableHead>Equipment_Name</TableHead>
              <TableHead>Model_Serial Number</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Log_Number</TableHead>
              <TableHead>2024 Maintenance Date</TableHead>
              <TableHead>2024 Engineer</TableHead>
              <TableHead>2025 Maintenance Date</TableHead>
              <TableHead>2025 Engineer</TableHead>
              <TableHead>2026 Maintenance Date</TableHead>
              <TableHead>2026 Engineer</TableHead>
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
                  <TableCell className={isDueSoon(machine.maintenanceDate) ? "text-amber-600 font-medium" : ""}>
                    {formatYearlyDate(machine.maintenanceDate, 2024)}
                  </TableCell>
                  <TableCell>{machine.engineer || "-"}</TableCell>
                  <TableCell>
                    {formatYearlyDate(machine.maintenanceDate, 2025)}
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    {formatYearlyDate(machine.maintenanceDate, 2026)}
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReminder(machine)}
                      >
                        <Bell className="h-4 w-4 mr-1" />
                        Remind
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markCompleted(machine)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
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
                <TableCell colSpan={12} className="text-center py-4">
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="equipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment</FormLabel>
                    <FormControl>
                      <Input placeholder="Equipment name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Model" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Serial number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input placeholder="Manufacturer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Log No</FormLabel>
                    <FormControl>
                      <Input placeholder="Log number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maintenanceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maintenance Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
