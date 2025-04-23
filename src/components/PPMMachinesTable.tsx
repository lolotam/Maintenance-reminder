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

const formSchema = z.object({
  equipment: z.string().min(1, "Equipment name is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  logNo: z.string().min(1, "Log number is required"),
  q1_date: z.string().min(1, "Q1 date is required"),
  q1_engineer: z.string().min(1, "Q1 engineer is required"),
  q2_date: z.string().min(1, "Q2 date is required"),
  q2_engineer: z.string().min(1, "Q2 engineer is required"),
  q3_date: z.string().min(1, "Q3 date is required"),
  q3_engineer: z.string().min(1, "Q3 engineer is required"),
  q4_date: z.string().min(1, "Q4 date is required"),
  q4_engineer: z.string().min(1, "Q4 engineer is required"),
});

type FormData = z.infer<typeof formSchema>;

interface PPMMachinesTableProps {
  searchTerm: string;
}

export const PPMMachinesTable = ({ searchTerm }: PPMMachinesTableProps) => {
  const [storedMachines, setStoredMachines] = useState<PPMMachine[]>(() => {
    const stored = localStorage.getItem("ppmMachines");
    return stored ? JSON.parse(stored) : mockPPMMachines;
  });
  
  const [filters, setFilters] = useState({
    equipment: "",
    model: "",
    serialNumber: "",
    manufacturer: "",
    logNo: "",
  });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<PPMMachine | null>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipment: "",
      model: "",
      serialNumber: "",
      manufacturer: "",
      logNo: "",
      q1_date: "",
      q1_engineer: "",
      q2_date: "",
      q2_engineer: "",
      q3_date: "",
      q3_engineer: "",
      q4_date: "",
      q4_engineer: "",
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

  const saveToLocalStorage = (machines: PPMMachine[]) => {
    localStorage.setItem("ppmMachines", JSON.stringify(machines));
  };

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
      const newMachines = storedMachines.filter(m => m.id !== machine.id);
      setStoredMachines(newMachines);
      saveToLocalStorage(newMachines);
      toast.success(`${machine.equipment} has been deleted`);
    }
  };

  const handleEdit = (machine: PPMMachine) => {
    setEditingMachine(machine);
    form.reset({
      equipment: machine.equipment,
      model: machine.model,
      serialNumber: machine.serialNumber,
      manufacturer: machine.manufacturer,
      logNo: machine.logNo,
      q1_date: machine.q1.date,
      q1_engineer: machine.q1.engineer,
      q2_date: machine.q2.date,
      q2_engineer: machine.q2.engineer,
      q3_date: machine.q3.date,
      q3_engineer: machine.q3.engineer,
      q4_date: machine.q4.date,
      q4_engineer: machine.q4.engineer,
    });
    setDialogOpen(true);
  };

  const onSubmit = (data: FormData) => {
    if (editingMachine) {
      const updatedMachine = {
        ...editingMachine,
        equipment: data.equipment,
        model: data.model,
        serialNumber: data.serialNumber,
        manufacturer: data.manufacturer,
        logNo: data.logNo,
        q1: { date: data.q1_date, engineer: data.q1_engineer },
        q2: { date: data.q2_date, engineer: data.q2_engineer },
        q3: { date: data.q3_date, engineer: data.q3_engineer },
        q4: { date: data.q4_date, engineer: data.q4_engineer },
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit PPM Machine</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Q1</h3>
                  <FormField
                    control={form.control}
                    name="q1_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="q1_engineer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engineer</FormLabel>
                        <FormControl>
                          <Input placeholder="Engineer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Q2</h3>
                  <FormField
                    control={form.control}
                    name="q2_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="q2_engineer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engineer</FormLabel>
                        <FormControl>
                          <Input placeholder="Engineer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Q3</h3>
                  <FormField
                    control={form.control}
                    name="q3_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="q3_engineer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engineer</FormLabel>
                        <FormControl>
                          <Input placeholder="Engineer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Q4</h3>
                  <FormField
                    control={form.control}
                    name="q4_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="q4_engineer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engineer</FormLabel>
                        <FormControl>
                          <Input placeholder="Engineer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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
