
import React from 'react';
import { format, isValid } from 'date-fns';
import { Machine } from '@/types';
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
  data: Machine[];
  onSave: () => void;
}

export function ParsedDataTable({ data, onSave }: ParsedDataTableProps) {
  if (!data || data.length === 0) return null;

  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return "N/A";
    
    try {
      const date = new Date(dateStr);
      return isValid(date) ? format(date, "MMM d, yyyy") : "N/A";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

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
            {data.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell className="font-medium">{machine.name}</TableCell>
                <TableCell>{formatDate(machine.lastMaintenanceDate)}</TableCell>
                <TableCell>{machine.frequency}</TableCell>
                <TableCell>{formatDate(machine.nextMaintenanceDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
