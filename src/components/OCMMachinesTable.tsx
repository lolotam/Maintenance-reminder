
import { Table, TableBody, TableRow, TableCell, TableHead, TableHeader } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { MachineTableProps } from "@/types/machines";
import { useOCMMachines } from "@/hooks/useOCMMachines";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format, parseISO } from "date-fns";

// List of all departments
const departments = [
  "LDR", "IM", "ENT", "OPTHA", "DERMA", "ENDOSCOPY", "NURSERY", "OB-GYN",
  "X-RAY", "OR", "LABORATORY", "ER", "PT", "IVF", "GENERAL SURGERY", 
  "DENTAL", "CSSD", "5 A", "5 B", "6 A", "6 B", "LAUNDRY", "4A", "4 B", 
  "PEDIA", "PLASTIC"
];

export const OCMMachinesTable = ({ searchTerm, selectedMachines, setSelectedMachines }: MachineTableProps) => {
  const {
    filteredMachines,
    markCompleted
  } = useOCMMachines();
  
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [machines, setMachines] = useState<any[]>([]);

  // Apply department filter and update machines
  useEffect(() => {
    let filtered = filteredMachines(searchTerm);
    if (departmentFilter) {
      filtered = filtered.filter(machine => 
        (machine.location?.toLowerCase() === departmentFilter.toLowerCase()) || 
        (machine.department?.toLowerCase() === departmentFilter.toLowerCase())
      );
    }
    setMachines(filtered);
  }, [filteredMachines, searchTerm, departmentFilter]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not scheduled";
    try {
      return format(parseISO(dateStr), 'MMM d, yyyy');
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateStr;
    }
  };

  const toggleStatus = (machine: any) => {
    if (!machine.last_maintenance_date) {
      markCompleted(machine);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select 
          value={departmentFilter} 
          onValueChange={setDepartmentFilter}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept.toLowerCase()}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">OCM</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-[150px] text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machines.length > 0 ? (
              machines.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>Yes</TableCell>
                  <TableCell>{machine.name || machine.equipment}</TableCell>
                  <TableCell>{machine.location || machine.department}</TableCell>
                  <TableCell>{machine.model}</TableCell>
                  <TableCell>{machine.serial_number || machine.serialNumber}</TableCell>
                  <TableCell>
                    {formatDate(machine.next_maintenance_date)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Label htmlFor={`status-${machine.id}`}>
                        {machine.last_maintenance_date ? "Maintained" : "Pending"}
                      </Label>
                      <Switch
                        id={`status-${machine.id}`}
                        checked={!!machine.last_maintenance_date}
                        onCheckedChange={() => toggleStatus(machine)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
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
