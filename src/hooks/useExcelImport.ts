
import { useState } from "react";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Machine } from "@/types";
import { parseExcelDate } from "@/utils/dateUtils";
import { EmployeeTraining, TrainingMachine } from "@/types/training";

export type ImportType = 'PPM' | 'OCM' | 'training';

// Common headers for each import type
const PPM_HEADERS = [
  'Equipment', 'Model', 'Serial Number', 'Manufacturer', 
  'Log No', 'Department', 'Type', 'Q1 Date', 'Q1 Engineer',
  'Q2 Date', 'Q2 Engineer', 'Q3 Date', 'Q3 Engineer',
  'Q4 Date', 'Q4 Engineer'
];

const OCM_HEADERS = [
  'Equipment', 'Model', 'Serial Number', 'Manufacturer', 
  'Log No', 'Department', 'Type', 'Last Maintenance Date',
  'Next Maintenance Date', 'Engineer'
];

const TRAINING_HEADERS = [
  'Name', 'Employee ID', 'Department', 'Trainer',
  'sonar', 'fmx', 'max', 'box20', 'hex'
];

/**
 * Hook for handling Excel import functionality
 */
export const useExcelImport = (type: ImportType) => {
  const [parsedData, setParsedData] = useState<Machine[] | EmployeeTraining[]>([]);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  /**
   * Validates imported file headers against expected headers
   */
  const validateHeaders = (headers: string[], expectedHeaders: string[]) => {
    const normalizedHeaders = headers.map(h => h.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, ''));
    const normalizedExpected = expectedHeaders.map(h => h.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, ''));
    
    const missingColumns = normalizedExpected.filter(expected => 
      !normalizedHeaders.some(header => header.toLowerCase().includes(expected.toLowerCase()))
    );
    
    if (missingColumns.length) {
      throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
    }
    
    return normalizedHeaders;
  };

  /**
   * Gets existing data from localStorage
   */
  const getExistingData = () => {
    try {
      const key = type === 'PPM' ? "ppmMachines" : type === 'OCM' ? "ocmMachines" : "employeeTraining";
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error getting existing data:", error);
      return [];
    }
  };

  /**
   * Processes imported file data
   */
  const processFileData = (rawData: any[]) => {
    setIsImporting(true);
    try {
      if (!rawData || !rawData.length) {
        throw new Error("No data found in file");
      }

      console.log(`Processing ${type} file data:`, rawData);
      const headers = Object.keys(rawData[0]);
      let expectedHeaders: string[];
      
      if (type === 'PPM') {
        expectedHeaders = PPM_HEADERS;
      } else if (type === 'OCM') {
        expectedHeaders = OCM_HEADERS;
      } else {
        expectedHeaders = TRAINING_HEADERS;
      }

      // Validate and normalize headers
      validateHeaders(headers, expectedHeaders);
      
      const existingData = getExistingData();
      
      let processedData: Machine[] | EmployeeTraining[] = [];
      if (type === 'PPM') {
        processedData = rawData.map(row => processPPMRow(normalizeRowData(row)));
      } else if (type === 'OCM') {
        processedData = rawData.map(row => processOCMRow(normalizeRowData(row)));
      } else {
        processedData = rawData.map(row => processTrainingRow(normalizeRowData(row)));
      }

      // Merge new data with existing data, replacing duplicates
      const mergedData = mergeData(existingData, processedData);
      
      const storageKey = type === 'PPM' ? "ppmMachines" : type === 'OCM' ? "ocmMachines" : "employeeTraining";
      localStorage.setItem(storageKey, JSON.stringify(mergedData));
      
      console.log(`Processed ${processedData.length} ${type} records`, processedData);
      setParsedData(processedData);
      setProcessingError(null);
      
      toast.success(`${processedData.length} ${type.toLowerCase()} records imported successfully!`);
      
      return processedData;
    } catch (error: any) {
      console.error("Error processing file:", error);
      setProcessingError(error.message || "Unknown error processing file");
      toast.error(`Import error: ${error.message || "Unknown error"}`);
      setParsedData([]);
      return [];
    } finally {
      setIsImporting(false);
    }
  };

  /**
   * Normalizes row data by standardizing keys
   */
  const normalizeRowData = (row: any) => {
    const normalized: any = {};
    
    Object.entries(row).forEach(([key, value]) => {
      // Normalize the key by replacing spaces with underscores and removing special chars
      const normalizedKey = key.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      normalized[normalizedKey] = value;
    });
    
    return normalized;
  };

  /**
   * Merges new data with existing data, replacing duplicates
   */
  const mergeData = (existingData: any[], newData: any[]) => {
    const result = [...existingData];
    
    newData.forEach(newItem => {
      const keyField = type === 'training' ? 'name' : 'equipment';
      const secondaryField = type === 'training' ? 'employeeId' : 'serialNumber';
      
      const existingIndex = result.findIndex(
        existing => 
          existing[keyField] === newItem[keyField] && 
          existing[secondaryField] === newItem[secondaryField]
      );
      
      if (existingIndex >= 0) {
        result[existingIndex] = { ...newItem, id: result[existingIndex].id };
      } else {
        result.push(newItem);
      }
    });
    
    return result;
  };

  /**
   * Processes PPM row data
   */
  const processPPMRow = (row: any): Machine => {
    return {
      id: uuidv4(),
      equipment: row.Equipment || "",
      manufacturer: row.Manufacturer || "",
      model: row.Model || "",
      serialNumber: row.Serial_Number || "",
      logNo: row.Log_No || "",
      department: row.Department || "",
      type: row.Type || "PPM",
      q1: { 
        date: parseExcelDate(row.Q1_Date) || "", 
        engineer: row.Q1_Engineer || "" 
      },
      q2: { 
        date: parseExcelDate(row.Q2_Date) || "", 
        engineer: row.Q2_Engineer || "" 
      },
      q3: { 
        date: parseExcelDate(row.Q3_Date) || "", 
        engineer: row.Q3_Engineer || "" 
      },
      q4: { 
        date: parseExcelDate(row.Q4_Date) || "", 
        engineer: row.Q4_Engineer || "" 
      }
    };
  };

  /**
   * Processes OCM row data
   */
  const processOCMRow = (row: any): Machine => {
    return {
      id: uuidv4(),
      equipment: row.Equipment || "",
      manufacturer: row.Manufacturer || "",
      model: row.Model || "",
      serialNumber: row.Serial_Number || "",
      logNo: row.Log_No || "",
      department: row.Department || "",
      type: row.Type || "OCM",
      maintenanceDate: parseExcelDate(row.Last_Maintenance_Date) || "",
      engineer: row.Engineer || "",
      nextMaintenanceDate: parseExcelDate(row.Next_Maintenance_Date) || ""
    };
  };
  
  /**
   * Processes training row data
   */
  const processTrainingRow = (row: any): EmployeeTraining => {
    // Extract machine training statuses
    const machineTraining: TrainingMachine[] = [];
    
    // Process all columns that might be machine names
    Object.keys(row).forEach(key => {
      // Skip columns that are definitely not machine names
      if (['Name', 'Employee_ID', 'Department', 'Trainer'].includes(key)) {
        return;
      }
      
      // For each potential machine column, treat it as a machine name
      const machineName = key.toLowerCase();
      const value = row[key];
      const trained = value?.toString().toLowerCase() === 'yes' || 
                     value?.toString().toLowerCase() === 'true' || 
                     value === true;
                     
      machineTraining.push({
        name: machineName,
        trained
      });
    });
    
    return {
      id: uuidv4(),
      name: row.Name || "",
      employeeId: row.Employee_ID || "",
      department: row.Department || "",
      trainer: row.Trainer || "",
      machines: machineTraining
    };
  };

  /**
   * Handles file upload
   */
  const handleFileUpload = (file: File) => {
    setProcessingError(null);
    setIsImporting(true);
    
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv"
    ];
    
    if (!validTypes.includes(file.type)) {
      setProcessingError("Invalid file type. Please upload Excel or CSV file");
      setIsImporting(false);
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
        toast.error(`Import error: ${error.message || "Error reading file"}`);
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.readAsBinaryString(file);
  };

  return {
    parsedData,
    processingError,
    isImporting,
    processFileData,
    handleFileUpload,
    setProcessingError
  };
};
