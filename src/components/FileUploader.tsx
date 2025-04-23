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
import { PPM_HEADERS, OCM_HEADERS } from "@/utils/excelTemplates";

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

  const checkDuplicates = (data: any[], existingMachines: Machine[]) => {
    const uniqueCombinations = new Map<string, boolean>();
    const duplicates = new Set<string>();
    
    data.forEach(row => {
      const serialNumber = row.Serial_Number || '';
      const equipmentName = row.Equipment_Name || '';
      const uniqueKey = `${serialNumber}|${equipmentName}`;
      
      if (uniqueCombinations.has(uniqueKey)) {
        duplicates.add(`${equipmentName} (${serialNumber})`);
      } else {
        uniqueCombinations.set(uniqueKey, true);
      }
    });
    
    existingMachines.forEach(machine => {
      const serialNumber = machine.serialNumber || '';
      const equipmentName = machine.name || '';
      const uniqueKey = `${serialNumber}|${equipmentName}`;
      
      if (uniqueCombinations.has(uniqueKey)) {
        duplicates.add(`${equipmentName} (${serialNumber})`);
      }
    });
    
    if (duplicates.size > 0) {
      throw new Error(`Duplicate machines found: ${Array.from(duplicates).join(", ")}`);
    }
  };

  const getExistingMachines = () => {
    try {
      if (type === 'PPM') {
        const stored = localStorage.getItem("ppmMachines");
        return stored ? JSON.parse(stored) : [];
      } else {
        const stored = localStorage.getItem("ocmMachines");
        return stored ? JSON.parse(stored) : [];
      }
    } catch (error) {
      console.error("Error getting existing machines:", error);
      return [];
    }
  };

  const processFileData = (data: any[]) => {
    try {
      if (!data || !data.length) {
        throw new Error("No data found in file");
      }

      const headers = Object.keys(data[0]);
      const expectedHeaders = type === 'PPM' ? PPM_HEADERS : OCM_HEADERS;

      validateHeaders(headers, expectedHeaders);
      
      const existingMachines = getExistingMachines();
      
      checkDuplicates(data, existingMachines);

      const machines: Machine[] = data.map(row => {
        let lastMaintenanceDate: string;
        
        if (type === 'PPM') {
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
            frequency: 'Quarterly' as const,
            lastMaintenanceDate,
            nextMaintenanceDate: calculateNextDate(lastMaintenanceDate, 'Quarterly') || '',
            quarters: {
              q1: { date: row.Q1_Date || '', engineer: row.Q1_Engineer || '' },
              q2: { date: row.Q2_Date || '', engineer: row.Q2_Engineer || '' },
              q3: { date: row.Q3_Date || '', engineer: row.Q3_Engineer || '' },
              q4: { date: row.Q4_Date || '', engineer: row.Q4_Engineer || '' },
            }
          };
        } else {
          const dates = [
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
            frequency: 'Yearly' as const,
            lastMaintenanceDate,
            nextMaintenanceDate: calculateNextDate(lastMaintenanceDate, 'Yearly') || '',
            years: {
              '2025': { date: row['2025_Maintenance_Date'] || '', engineer: row['2025_Engineer'] || '' },
              '2026': { date: row['2026_Maintenance_Date'] || '', engineer: '' },
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

  const saveToApplication = () => {
    try {
      onDataReady(parsedData);
      
      if (type === 'PPM') {
        const ppmMachines = parsedData.map(machine => ({
          id: machine.id,
          equipment: machine.name,
          model: machine.model,
          serialNumber: machine.serialNumber,
          manufacturer: machine.manufacturer,
          logNo: machine.logNo,
          frequency: 'Quarterly',
          lastMaintenanceDate: machine.lastMaintenanceDate,
          nextMaintenanceDate: machine.nextMaintenanceDate,
          q1: machine.quarters?.q1 || { date: '', engineer: '' },
          q2: machine.quarters?.q2 || { date: '', engineer: '' },
          q3: machine.quarters?.q3 || { date: '', engineer: '' },
          q4: machine.quarters?.q4 || { date: '', engineer: '' },
        }));
        
        const existingMachines = JSON.parse(localStorage.getItem("ppmMachines") || "[]");
        const mergedMachines = [...existingMachines];
        
        ppmMachines.forEach(newMachine => {
          const existingIndex = mergedMachines.findIndex(m => 
            m.serialNumber === newMachine.serialNumber && 
            m.equipment === newMachine.equipment
          );
          if (existingIndex >= 0) {
            mergedMachines[existingIndex] = newMachine;
          } else {
            mergedMachines.push(newMachine);
          }
        });
        
        localStorage.setItem("ppmMachines", JSON.stringify(mergedMachines));
      } else {
        const ocmMachines = parsedData.map(machine => ({
          id: machine.id,
          equipment: machine.name,
          model: machine.model,
          serialNumber: machine.serialNumber,
          manufacturer: machine.manufacturer,
          logNo: machine.logNo,
          frequency: 'Yearly',
          lastMaintenanceDate: machine.lastMaintenanceDate,
          nextMaintenanceDate: machine.nextMaintenanceDate,
          maintenanceDate: machine.years?.['2025']?.date || '',
          engineer: machine.years?.['2025']?.engineer || '',
        }));
        
        const existingMachines = JSON.parse(localStorage.getItem("ocmMachines") || "[]");
        const mergedMachines = [...existingMachines];
        
        ocmMachines.forEach(newMachine => {
          const existingIndex = mergedMachines.findIndex(m => 
            m.serialNumber === newMachine.serialNumber && 
            m.equipment === newMachine.equipment
          );
          if (existingIndex >= 0) {
            mergedMachines[existingIndex] = newMachine;
          } else {
            mergedMachines.push(newMachine);
          }
        });
        
        localStorage.setItem("ocmMachines", JSON.stringify(mergedMachines));
      }
    } catch (error: any) {
      console.error("Error saving data:", error);
      setProcessingError(error.message || "Error saving data");
    }
  };

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
            <Button onClick={saveToApplication}>
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
