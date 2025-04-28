
import React from 'react';
import { format, isValid } from 'date-fns';
import { FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface ParsedDataTableProps {
  data: any[];
  onSave: () => void;
}

export function ParsedDataTable({ data, onSave }: ParsedDataTableProps) {
  if (data.length === 0) return null;

  // Determine if we're dealing with PPM or OCM machines
  // Check if the first machine has quarters property which would indicate a PPM machine
  const isPPM = data[0].q1 !== undefined;

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
              <TableHead>Equipment</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Serial_Number</TableHead>
              <TableHead>Manufacturer</TableHead>
              {isPPM ? (
                <>
                  <TableHead>Q1 Date</TableHead>
                  <TableHead>Q2 Date</TableHead>
                  <TableHead>Q3 Date</TableHead>
                  <TableHead>Q4 Date</TableHead>
                </>
              ) : (
                <>
                  <TableHead>Maintenance Date</TableHead>
                  <TableHead>Engineer</TableHead>
                  <TableHead>Next Maintenance</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell className="font-medium">{machine.equipment || "N/A"}</TableCell>
                <TableCell>{machine.model || "N/A"}</TableCell>
                <TableCell>{machine.Serial_Number || "N/A"}</TableCell>
                <TableCell>{machine.manufacturer || "N/A"}</TableCell>
                
                {isPPM ? (
                  <>
                    <TableCell>
                      {machine.q1?.date && isValid(new Date(machine.q1.date)) 
                        ? format(new Date(machine.q1.date), "MMM d, yyyy") 
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {machine.q2?.date && isValid(new Date(machine.q2.date)) 
                        ? format(new Date(machine.q2.date), "MMM d, yyyy") 
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {machine.q3?.date && isValid(new Date(machine.q3.date)) 
                        ? format(new Date(machine.q3.date), "MMM d, yyyy") 
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {machine.q4?.date && isValid(new Date(machine.q4.date)) 
                        ? format(new Date(machine.q4.date), "MMM d, yyyy") 
                        : "N/A"}
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>
                      {machine.maintenanceDate && isValid(new Date(machine.maintenanceDate)) 
                        ? format(new Date(machine.maintenanceDate), "MMM d, yyyy") 
                        : "N/A"}
                    </TableCell>
                    <TableCell>{machine.engineer || "N/A"}</TableCell>
                    <TableCell>
                      {machine.nextMaintenanceDate && isValid(new Date(machine.nextMaintenanceDate)) 
                        ? format(new Date(machine.nextMaintenanceDate), "MMM d, yyyy") 
                        : "N/A"}
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
