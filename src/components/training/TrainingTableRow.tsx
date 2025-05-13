
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2 } from "lucide-react";
import { EmployeeTraining } from "@/types/training";

interface TrainingTableRowProps {
  employee: EmployeeTraining;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  availableMachines: string[];
}

export const TrainingTableRow: React.FC<TrainingTableRowProps> = ({
  employee,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  availableMachines
}) => {
  return (
    <TableRow className={isSelected ? "bg-muted/50" : undefined}>
      <TableCell>
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onSelect(employee.id)}
          aria-label={`Select ${employee.name}`}
        />
      </TableCell>
      <TableCell className="font-medium">{employee.name}</TableCell>
      <TableCell>{employee.employeeId}</TableCell>
      <TableCell>{employee.department}</TableCell>
      <TableCell>{employee.trainer}</TableCell>
      
      {availableMachines.map((machineName) => {
        const machine = employee.machines.find(m => m.name === machineName);
        const isTrained = machine?.trained ?? false;
        
        return (
          <TableCell key={machineName} className="text-center">
            <Checkbox 
              checked={isTrained}
              disabled
              aria-label={`${employee.name} trained on ${machineName}`}
            />
          </TableCell>
        );
      })}
      
      <TableCell className="text-right space-x-1">
        <Button
          variant="outline"
          size="icon"
          onClick={onEdit}
          className="h-7 w-7"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onDelete}
          className="h-7 w-7 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};
