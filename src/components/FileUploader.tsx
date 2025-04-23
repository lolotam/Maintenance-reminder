
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
}

export function FileUploader({ onDataReady }: FileUploaderProps) {
  const [parsedData, setParsedData] = useState<Machine[]>([]);
  const [processingError, setProcessingError] = useState<string | null>(null);
  
  // Calculate next maintenance date based on frequency and last date
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
  
  const processFileData = (data: any[]) => {
    try {
      // Basic validation
      if (!data || !data.length) {
        throw new Error("No data found in file");
      }
      
      // Check required columns
      const requiredColumns = ["Machine Name", "Last Maintenance Date", "Frequency"];
      const headers = Object.keys(data[0]);
      
      const missingColumns = requiredColumns.filter(col => 
        !headers.some(header => header.toLowerCase() === col.toLowerCase())
      );
      
      if (missingColumns.length) {
        throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
      }
      
      // Process rows
      const machines: Machine[] = data.map(row => {
        // Get values with case-insensitive column names
        const getName = () => {
          const key = headers.find(h => h.toLowerCase() === "machine name".toLowerCase());
          return key ? row[key] : null;
        };
        
        const getDate = () => {
          const key = headers.find(h => h.toLowerCase() === "last maintenance date".toLowerCase());
          return key ? row[key] : null;
        };
        
        const getFrequency = () => {
          const key = headers.find(h => h.toLowerCase() === "frequency".toLowerCase());
          return key ? row[key] : null;
        };
        
        const name = getName();
        const lastDate = getDate();
        const frequency = getFrequency();
        
        // Validate values
        if (!name) throw new Error("Missing machine name in row");
        if (!lastDate) throw new Error(`Missing last maintenance date for ${name}`);
        if (!frequency) throw new Error(`Missing frequency for ${name}`);
        
        const normalizedFrequency = frequency.toLowerCase() === "quarterly" ? "Quarterly" : "Yearly";
        
        // Calculate next date
        const nextDate = calculateNextDate(lastDate, frequency);
        
        if (!nextDate) throw new Error(`Could not calculate next date for ${name}`);
        
        return {
          id: uuidv4(),
          name,
          lastMaintenanceDate: new Date(lastDate).toISOString(),
          frequency: normalizedFrequency as "Quarterly" | "Yearly",
          nextMaintenanceDate: nextDate
        };
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
    
    // Validate file type
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
        
        // Convert to JSON with headers
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
          <p className="text-lg font-medium">Drag & drop your Excel file here</p>
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
                {parsedData.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell className="font-medium">{machine.name}</TableCell>
                    <TableCell>{format(new Date(machine.lastMaintenanceDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>{machine.frequency}</TableCell>
                    <TableCell>{format(new Date(machine.nextMaintenanceDate!), "MMM d, yyyy")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
