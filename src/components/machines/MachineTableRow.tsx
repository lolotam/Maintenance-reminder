
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { OCMMachine, PPMMachine } from "@/types/machines";
import { MachineActions } from "./MachineActions";

interface MachineTableRowProps {
  machine: OCMMachine | PPMMachine;
  type: 'ocm' | 'ppm';
  isSelected: boolean;
  onSelect: (id: string) => void;
  onReminder: () => void;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function MachineTableRow({
  machine,
  type,
  isSelected,
  onSelect,
  onReminder,
  onComplete,
  onEdit,
  onDelete
}: MachineTableRowProps) {
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "";
    const parsedDate = new Date(dateString);
    return format(parsedDate, 'dd/MM/yyyy');
  };

  const isDueSoon = (dateString: string) => {
    if (!dateString) return false;
    try {
      const today = new Date();
      const dueDate = new Date(dateString);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    } catch (error) {
      return false;
    }
  };

  if (type === 'ocm') {
    const ocmMachine = machine as OCMMachine;
    return (
      <TableRow>
        <TableCell>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(machine.id)}
          />
        </TableCell>
        <TableCell>{machine.equipment}</TableCell>
        <TableCell>{`${machine.model} - ${machine.Serial_Number}`}</TableCell>
        <TableCell>{machine.manufacturer}</TableCell>
        <TableCell>{machine.logNo}</TableCell>
        <TableCell>{formatDate(ocmMachine.maintenanceDate)}</TableCell>
        <TableCell>{ocmMachine.engineer || "-"}</TableCell>
        <TableCell>
          {formatDate(new Date(
            // Create a new Date object from the maintenance date string before using setFullYear
            new Date(ocmMachine.maintenanceDate).setFullYear(2026)
          ))}
        </TableCell>
        <TableCell>
          <MachineActions
            onReminder={onReminder}
            onComplete={onComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </TableCell>
      </TableRow>
    );
  }

  const ppmMachine = machine as PPMMachine;
  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(machine.id)}
        />
      </TableCell>
      <TableCell>{machine.equipment}</TableCell>
      <TableCell>{`${machine.model} - ${machine.Serial_Number}`}</TableCell>
      <TableCell>{machine.manufacturer}</TableCell>
      <TableCell>{machine.logNo}</TableCell>
      <TableCell className={isDueSoon(ppmMachine.q1.date) ? "text-amber-600 font-medium" : ""}>
        {formatDate(ppmMachine.q1.date)}
      </TableCell>
      <TableCell>{ppmMachine.q1.engineer}</TableCell>
      <TableCell className={isDueSoon(ppmMachine.q2.date) ? "text-amber-600 font-medium" : ""}>
        {formatDate(ppmMachine.q2.date)}
      </TableCell>
      <TableCell>{ppmMachine.q2.engineer}</TableCell>
      <TableCell className={isDueSoon(ppmMachine.q3.date) ? "text-amber-600 font-medium" : ""}>
        {formatDate(ppmMachine.q3.date)}
      </TableCell>
      <TableCell>{ppmMachine.q3.engineer}</TableCell>
      <TableCell className={isDueSoon(ppmMachine.q4.date) ? "text-amber-600 font-medium" : ""}>
        {formatDate(ppmMachine.q4.date)}
      </TableCell>
      <TableCell>{ppmMachine.q4.engineer}</TableCell>
      <TableCell>
        <MachineActions
          onReminder={onReminder}
          onComplete={onComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}
