
import { TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface TrainingTableHeaderProps {
  onSelectAll: () => void;
  hasSelectedItems: boolean;
  availableMachines: string[];
}

export const TrainingTableHeader: React.FC<TrainingTableHeaderProps> = ({ 
  onSelectAll, 
  hasSelectedItems,
  availableMachines
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">
          <Checkbox 
            checked={hasSelectedItems} 
            onCheckedChange={onSelectAll}
            aria-label="Select all"
          />
        </TableHead>
        <TableHead className="min-w-[150px]">Name</TableHead>
        <TableHead className="min-w-[100px]">Employee ID</TableHead>
        <TableHead className="min-w-[120px]">Department</TableHead>
        <TableHead className="min-w-[120px]">Trainer</TableHead>
        <TableHead colSpan={availableMachines.length} className="text-center">
          Machine Training Status
        </TableHead>
        <TableHead className="w-[100px] text-right">Actions</TableHead>
      </TableRow>
      <TableRow>
        <TableHead colSpan={5}></TableHead>
        {availableMachines.map((machine) => (
          <TableHead key={machine} className="text-center font-medium">
            {machine}
          </TableHead>
        ))}
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
  );
};
