
import { Table, TableBody, TableRow, TableCell, TableHead, TableHeader } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { MachineTableProps } from "@/types/machines";
import { usePPMMachines } from "@/hooks/usePPMMachines";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// List of all departments
const departments = [
  "LDR", "IM", "ENT", "OPTHA", "DERMA", "ENDOSCOPY", "NURSERY", "OB-GYN",
  "X-RAY", "OR", "LABORATORY", "ER", "PT", "IVF", "GENERAL SURGERY", 
  "DENTAL", "CSSD", "5 A", "5 B", "6 A", "6 B", "LAUNDRY", "4A", "4 B", 
  "PEDIA", "PLASTIC"
];

export const PPMMachinesTable = ({ searchTerm, selectedMachines, setSelectedMachines }: MachineTableProps) => {
  const {
    filteredMachines,
    markCompleted,
    setReminder
  } = usePPMMachines();
  
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [machines, setMachines] = useState<any[]>([]);

  // Apply department filter and update machines
  useEffect(() => {
    let filtered = filteredMachines(searchTerm);
    if (departmentFilter) {
      filtered = filtered.filter(machine => 
        machine.department?.toLowerCase() === departmentFilter.toLowerCase()
      );
    }
    setMachines(filtered);
  }, [filteredMachines, searchTerm, departmentFilter]);

  const toggleStatus = (machine: any) => {
    if (!machine.q1?.date) {
      markCompleted(machine, "Current");
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
              <TableHead className="w-[100px]">PPM</TableHead>
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
                  <TableCell>{machine.equipment}</TableCell>
                  <TableCell>{machine.department}</TableCell>
                  <TableCell>{machine.model}</TableCell>
                  <TableCell>{machine.serialNumber}</TableCell>
                  <TableCell>
                    {machine.q1?.date || "Not scheduled"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Label htmlFor={`status-${machine.id}`}>
                        {machine.q1?.date ? "Maintained" : "Pending"}
                      </Label>
                      <Switch
                        id={`status-${machine.id}`}
                        checked={!!machine.q1?.date}
                        onCheckedChange={() => toggleStatus(machine)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
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
