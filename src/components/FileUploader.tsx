
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { addDays, addMonths, addYears, format } from "date-fns";
import { Machine } from "@/types";
import { Upload, FileCheck, AlertCircle } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FileUploaderProps {
  onDataReady: (machines: Machine[]) => void;
  type: 'PPM' | 'OCM';
}

export function FileUploader({ onDataReady, type }: FileUploaderProps) {
  const [parsedData, setParsedData] = useState<Machine[]>([]);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const calculateNextDate = (lastDate: string, frequency: string) => {
    try {
      const date = new Date(lastDate);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      
      if (frequency.toLowerCase() === "quarterly") {
        return addMonths(date, 3).toISOString();
      } else if (frequency.toLowerCase() === "yearly") {
        return addYears(date, 1).toISOString();
      } else {
        throw new Error(`Unknown frequency: ${frequency}`);
      }
    } catch (error) {
      console.error("Error calculating next date:", error);
      return null;
    }
  };

  const validateHeaders = (headers: string[], expectedHeaders: string[]) => {
    const missingColumns = expectedHeaders.filter(expected => 
      !headers.some(header => header.toLowerCase() === expected.toLowerCase())
    );
    
    if (missingColumns.length) {
      throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
    }
  };

  const processFileData = (data: any[]) => {
    try {
      if (!data || !data.length) {
        throw new Error("No data found in file");
      }

      const headers = Object.keys(data[0]);
      const expectedHeaders = type === 'PPM' ? [
        'Equipment_Name',
        'Model',
        'Serial_Number',
        'Manufacturer',
        'Log_Number',
        'Q1_Date',
        'Q1_Engineer',
        'Q2_Date',
        'Q2_Engineer',
        'Q3_Date',
        'Q3_Engineer',
        'Q4_Date',
        'Q4_Engineer'
      ] : [
        'Equipment_Name',
        'Model',
        'Serial_Number',
        'Manufacturer',
        'Log_Number',
        '2024_Maintenance_Date',
        '2024_Engineer',
        '2025_Maintenance_Date',
        '2025_Engineer',
        '2026_Maintenance_Date',
        '2026_Engineer'
      ];

      validateHeaders(headers, expectedHeaders);

      const machines: Machine[] = data.map(row => {
        // Determine the last maintenance date based on the machine type
        let lastMaintenanceDate: string;
        
        if (type === 'PPM') {
          // For PPM, use the most recent quarter date that has a value
          const dates = [row.Q1_Date, row.Q2_Date, row.Q3_Date, row.Q4_Date].filter(Boolean);
          lastMaintenanceDate = dates.length > 0 ? 
            new Date(Math.max(...dates.map(d => new Date(d).getTime()))).toISOString() :
            new Date().toISOString();

          return {
            id: uuidv4(),
            name: row.Equipment_Name,
            manufacturer: row.Manufacturer,
            model: row.Model,
            serialNumber: row.Serial_Number,
            logNo: row.Log_Number,
            frequency: 'Quarterly',
            lastMaintenanceDate,
            nextMaintenanceDate: calculateNextDate(lastMaintenanceDate, 'Quarterly'),
            quarters: {
              q1: { date: row.Q1_Date || '', engineer: row.Q1_Engineer || '' },
              q2: { date: row.Q2_Date || '', engineer: row.Q2_Engineer || '' },
              q3: { date: row.Q3_Date || '', engineer: row.Q3_Engineer || '' },
              q4: { date: row.Q4_Date || '', engineer: row.Q4_Engineer || '' },
            }
          };
        } else {
          // For OCM, use the most recent year date that has a value
          const dates = [
            row['2024_Maintenance_Date'], 
            row['2025_Maintenance_Date'], 
            row['2026_Maintenance_Date']
          ].filter(Boolean);
          
          lastMaintenanceDate = dates.length > 0 ? 
            new Date(Math.max(...dates.map(d => new Date(d).getTime()))).toISOString() :
            new Date().toISOString();

          return {
            id: uuidv4(),
            name: row.Equipment_Name,
            manufacturer: row.Manufacturer,
            model: row.Model,
            serialNumber: row.Serial_Number,
            logNo: row.Log_Number,
            frequency: 'Yearly',
            lastMaintenanceDate,
            nextMaintenanceDate: calculateNextDate(lastMaintenanceDate, 'Yearly'),
            years: {
              '2024': { date: row['2024_Maintenance_Date'] || '', engineer: row['2024_Engineer'] || '' },
              '2025': { date: row['2025_Maintenance_Date'] || '', engineer: row['2025_Engineer'] || '' },
              '2026': { date: row['2026_Maintenance_Date'] || '', engineer: row['2026_Engineer'] || '' },
            }
          };
        }
      });

      setParsedData(machines);
      setProcessingError(null);
    } catch (error: any) {
      console.error("Error processing file:", error);
      setProcessingError(error.message || "Unknown error processing file");
      setParsedData([]);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setProcessingError(null);
    
    if (acceptedFiles.length === 0) {
      setProcessingError("No file selected");
      return;
    }
    
    const file = acceptedFiles[0];
    
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
      "application/vnd.ms-excel", // xls
      "text/csv" // csv
    ];
    
    if (!validTypes.includes(file.type)) {
      setProcessingError("Invalid file type. Please upload Excel or CSV file");
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("No data read from file");
        
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        processFileData(jsonData);
      } catch (error: any) {
        console.error("Error reading file:", error);
        setProcessingError(error.message || "Error reading file");
      }
    };
    
    reader.readAsBinaryString(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    }
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="text-lg font-medium">
            Drag & drop your {type} Excel file here
          </p>
          <p className="text-sm text-gray-500">
            or click to select a file (xlsx, xls, csv)
          </p>
        </div>
      </div>

      {processingError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{processingError}</AlertDescription>
        </Alert>
      )}

      {parsedData.length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-4 bg-muted flex items-center justify-between">
            <div className="flex items-center">
              <FileCheck className="h-5 w-5 mr-2 text-green-500" />
              <h3 className="font-medium">File Processed Successfully</h3>
            </div>
            <Button onClick={() => onDataReady(parsedData)}>
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
                {parsedData.map((machine) => {
                  const lastDate = new Date(machine.lastMaintenanceDate);
                  const nextDate = machine.nextMaintenanceDate ? new Date(machine.nextMaintenanceDate) : null;
                  
                  return (
                    <TableRow key={machine.id}>
                      <TableCell className="font-medium">{machine.name}</TableCell>
                      <TableCell>{!isNaN(lastDate.getTime()) ? format(lastDate, "MMM d, yyyy") : "N/A"}</TableCell>
                      <TableCell>{machine.frequency}</TableCell>
                      <TableCell>{nextDate && !isNaN(nextDate.getTime()) ? format(nextDate, "MMM d, yyyy") : "N/A"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
