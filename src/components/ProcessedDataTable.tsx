
import { format, isValid } from "date-fns";
import { FileCheck } from "lucide-react";
import { Machine } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface ProcessedDataTableProps {
  data: Machine[];
  onSave: () => void;
}

export const ProcessedDataTable = ({ data, onSave }: ProcessedDataTableProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-muted flex items-center justify-between">
        <div className="flex items-center">
          <FileCheck className="h-5 w-5 mr-2 text-green-500" />
          <h3 className="font-medium">File Processed Successfully</h3>
        </div>
        <Button onClick={onSave}>
          Save Data
        </Button>
      </div>

      <div className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Machine Name</TableHead>
              <TableHead>Last Maintenance</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Next Maintenance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((machine) => {
              const lastDate = new Date(machine.lastMaintenanceDate);
              const nextDate = machine.nextMaintenanceDate ? new Date(machine.nextMaintenanceDate) : null;
              
              return (
                <TableRow key={machine.id}>
                  <TableCell className="font-medium">{machine.name}</TableCell>
                  <TableCell>{isValid(lastDate) ? format(lastDate, "MMM d, yyyy") : "N/A"}</TableCell>
                  <TableCell>{machine.frequency}</TableCell>
                  <TableCell>{nextDate && isValid(nextDate) ? format(nextDate, "MMM d, yyyy") : "N/A"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
