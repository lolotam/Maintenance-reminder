
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface MachineTableHeaderProps {
  type: 'ocm' | 'ppm';
  onSelectAll: () => void;
  hasSelectedItems: boolean;
}

export function MachineTableHeader({ type, onSelectAll, hasSelectedItems }: MachineTableHeaderProps) {
  if (type === 'ocm') {
    return (
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox checked={hasSelectedItems} onClick={onSelectAll} />
          </TableHead>
          <TableHead>Equipment_Name</TableHead>
          <TableHead>Model_Serial Number</TableHead>
          <TableHead>Manufacturer</TableHead>
          <TableHead>Log_Number</TableHead>
          <TableHead>2025 Maintenance Date</TableHead>
          <TableHead>2025 Engineer</TableHead>
          <TableHead>2026 Maintenance Date</TableHead>
          <TableHead>ACTION</TableHead>
          <TableHead>Edit/Delete</TableHead>
        </TableRow>
      </TableHeader>
    );
  }

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">
          <Checkbox checked={hasSelectedItems} onClick={onSelectAll} />
        </TableHead>
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
  );
}
