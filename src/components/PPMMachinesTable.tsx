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
import { DEPARTMENT_OPTIONS } from "@/utils/constants";
import { ExcelExporter } from "@/components/machines/ExcelExporter";
import { useExcelExport } from "@/hooks/useExcelExport";

export const PPMMachinesTable = ({ searchTerm, selectedMachines, setSelectedMachines }: MachineTableProps) => {
  const {
    filteredMachines,
    markCompleted,
    setReminder
  } = usePPMMachines();
  
  const { formatPPMDataForExport } = useExcelExport();
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [machines, setMachines] = useState<any[]>([]);

  // Apply department filter and update machines
  useEffect(() => {
    let filtered = filteredMachines(searchTerm);
    if (departmentFilter && departmentFilter !== "all") {
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

  // Prepare data for export
  const exportData = formatPPMDataForExport(machines);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <Select 
          value={departmentFilter} 
          onValueChange={setDepartmentFilter}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENT_OPTIONS.map((dept) => (
              <SelectItem key={dept.value} value={dept.value.toLowerCase()}>
                {dept.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ExcelExporter 
          data={exportData}
          filename="ppm_machines"
          buttonText="Export PPM Data"
        />
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
