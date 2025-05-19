import { useState } from "react";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { Machine } from "@/types";
import { parseExcelDate } from "@/utils/dateUtils";
import { EmployeeTraining, TrainingMachine } from "@/types/training";
import { ImportType } from "@/hooks/useExcelImport";

// Define the headers directly in this file since they're no longer available from excelTemplates
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

export const useFileProcessor = (type: ImportType) => {
  const [parsedData, setParsedData] = useState<Machine[] | EmployeeTraining[]>([]);
  const [processingError, setProcessingError] = useState<string | null>(null);

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

  const getExistingMachines = () => {
    try {
      const key = type === 'PPM' ? "ppmMachines" : type === 'OCM' ? "ocmMachines" : "employeeTraining";
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error getting existing data:", error);
      return [];
    }
  };

  const processFileData = (data: any[]) => {
    try {
      if (!data || !data.length) {
        throw new Error("No data found in file");
      }

      console.log(`Processing ${type} file data:`, data);
      const headers = Object.keys(data[0]);
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
      
      const existingData = getExistingMachines();
      
      let processedData: Machine[] | EmployeeTraining[] = [];
      if (type === 'PPM') {
        processedData = data.map(row => processPPMRow(normalizeRowData(row)));
      } else if (type === 'OCM') {
        processedData = data.map(row => processOCMRow(normalizeRowData(row)));
      } else {
        processedData = data.map(row => processTrainingRow(normalizeRowData(row)));
      }

      // Merge new data with existing one, replacing duplicates
      const mergedData = mergeData(existingData, processedData);
      
      const storageKey = type === 'PPM' ? "ppmMachines" : type === 'OCM' ? "ocmMachines" : "employeeTraining";
      localStorage.setItem(storageKey, JSON.stringify(mergedData));
      
      console.log(`Processed ${processedData.length} ${type} records`, processedData);
      setParsedData(processedData);
      setProcessingError(null);
      return processedData;
    } catch (error: any) {
      console.error("Error processing file:", error);
      setProcessingError(error.message || "Unknown error processing file");
      setParsedData([]);
      return [];
    }
  };

  const normalizeRowData = (row: any) => {
    const normalized: any = {};
    
    Object.entries(row).forEach(([key, value]) => {
      // Normalize the key by replacing spaces with underscores and removing special characters
      const normalizedKey = key.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      normalized[normalizedKey] = value;
    });
    
    return normalized;
  };

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

  const processPPMRow = (row: any): Machine => {
    return {
      id: uuidv4(),
      equipment: row.Equipment || "",
      manufacturer: row.Manufacturer || "",
      model: row.Model || "",
      serialNumber: row.Serial_Number || "",
      logNo: row.Log_No || "",
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

  const processOCMRow = (row: any): Machine => {
    return {
      id: uuidv4(),
      equipment: row.Equipment || "",
      manufacturer: row.Manufacturer || "",
      model: row.Model || "",
      serialNumber: row.Serial_Number || "",
      logNo: row.Log_No || "",
      maintenanceDate: parseExcelDate(row.Last_Maintenance_Date) || "",
      engineer: row.Engineer || "",
      nextMaintenanceDate: parseExcelDate(row.Next_Maintenance_Date) || ""
    };
  };
  
  const processTrainingRow = (row: any): EmployeeTraining => {
    // Extract machine training statuses
    // Check for common machine names in the app
    const commonMachines = ['sonar', 'fmx', 'max', 'box20', 'hex'];
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

  return { parsedData, processingError, processFileData, setProcessingError };
};
