
import React from 'react';
import { format, isValid, parseISO } from 'date-fns';
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
  if (data.length === 0) return null;
  
  // Helper function to format dates nicely
  const formatDate = (dateStr: string | Date | null | undefined) => {
    if (!dateStr) return 'N/A';
    
    try {
      const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
      return isValid(date) ? format(date, "dd/MM/yyyy") : 'N/A';
    } catch (error) {
      console.warn("Invalid date format:", dateStr);
      return 'N/A';
    }
  };

  // Check the structure of the data to determine if it's PPM or OCM
  const isPPM = data[0].quarters !== undefined;

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
              <TableHead>Equipment Name</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Log Number</TableHead>
              {isPPM ? (
                <>
                  <TableHead>Q1 Date</TableHead>
                  <TableHead>Q1 Engineer</TableHead>
                </>
              ) : (
                <>
                  <TableHead>2025 Maintenance</TableHead>
                  <TableHead>2025 Engineer</TableHead>
                  <TableHead>2026 Maintenance</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell className="font-medium">{machine.name}</TableCell>
                <TableCell>{machine.model}</TableCell>
                <TableCell>{machine.serialNumber}</TableCell>
                <TableCell>{machine.manufacturer}</TableCell>
                <TableCell>{machine.logNo}</TableCell>
                
                {isPPM ? (
                  <>
                    <TableCell>{formatDate(machine.quarters?.q1?.date)}</TableCell>
                    <TableCell>{machine.quarters?.q1?.engineer || ''}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{formatDate(machine.years?.['2025']?.date)}</TableCell>
                    <TableCell>{machine.years?.['2025']?.engineer || ''}</TableCell>
                    <TableCell>{formatDate(machine.years?.['2026']?.date)}</TableCell>
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
