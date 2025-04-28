
import { useState } from "react";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { Machine } from "@/types";
import { parseExcelDate } from "@/utils/dateUtils";
import { PPM_HEADERS, OCM_HEADERS } from "@/utils/excelTemplates";

export const useFileProcessor = (type: 'PPM' | 'OCM') => {
  const [parsedData, setParsedData] = useState<Machine[]>([]);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const validateHeaders = (headers: string[], expectedHeaders: string[]) => {
    const normalizedHeaders = headers.map(h => 
      String(h).trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
    );
    
    const normalizedExpected = expectedHeaders.map(h => 
      h.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
    );
    
    console.log("Normalized headers:", normalizedHeaders);
    console.log("Expected headers:", normalizedExpected);
    
    const missingColumns = normalizedExpected.filter(expected => 
      !normalizedHeaders.some(header => header.toLowerCase() === expected.toLowerCase())
    );
    
    if (missingColumns.length) {
      throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
    }
    
    return normalizedHeaders;
  };

  const getExistingMachines = () => {
    try {
      const key = type === 'PPM' ? "ppmMachines" : "ocmMachines";
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
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

      console.log("Raw data from Excel:", data);
      const headers = Object.keys(data[0]);
      const expectedHeaders = type === 'PPM' ? PPM_HEADERS : OCM_HEADERS;

      // Validate and normalize headers
      validateHeaders(headers, expectedHeaders);
      
      const existingMachines = getExistingMachines();
      
      // Process each row separately and ensure all fields are properly mapped
      let machines: Machine[] = [];
      if (type === 'PPM') {
        machines = data.map(row => processPPMRow(normalizeRowData(row)));
      } else {
        machines = data.map(row => processOCMRow(normalizeRowData(row)));
      }

      // Debug the processed machines
      console.log("Processed machines:", machines);

      // Merge new machines with existing ones, replacing duplicates
      const mergedMachines = mergeMachines(existingMachines, machines);
      
      const storageKey = type === 'PPM' ? "ppmMachines" : "ocmMachines";
      localStorage.setItem(storageKey, JSON.stringify(mergedMachines));
      
      console.log(`Processed ${machines.length} ${type} machines`, machines);
      setParsedData(machines);
      setProcessingError(null);
    } catch (error: any) {
      console.error("Error processing file:", error);
      setProcessingError(error.message || "Unknown error processing file");
      setParsedData([]);
    }
  };

  const normalizeRowData = (row: any) => {
    const normalized: any = {};
    
    Object.entries(row).forEach(([key, value]) => {
      // Handle both string and non-string keys
      const normalizedKey = String(key).trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      normalized[normalizedKey] = value;
    });
    
    return normalized;
  };

  const mergeMachines = (existingMachines: any[], newMachines: any[]) => {
    const result = [...existingMachines];
    
    newMachines.forEach(newMachine => {
      const existingIndex = result.findIndex(
        existing => 
          existing.equipment === newMachine.equipment && 
          existing.serialNumber === newMachine.serialNumber
      );
      
      if (existingIndex >= 0) {
        result[existingIndex] = { ...newMachine, id: result[existingIndex].id };
      } else {
        result.push(newMachine);
      }
    });
    
    return result;
  };

  const processPPMRow = (row: any): any => {
    console.log("Processing PPM row:", row);
    return {
      id: uuidv4(),
      equipment: row.Equipment_Name || "",
      manufacturer: row.Manufacturer || "",
      model: row.Model || "", // Ensure Model is taken from the correct column
      serialNumber: row.Serial_Number || "", // Ensure Serial Number is taken from the correct column
      logNo: row.Log_Number || "",
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

  const processOCMRow = (row: any): any => {
    console.log("Processing OCM row:", row);
    return {
      id: uuidv4(),
      equipment: row.Equipment_Name || "",
      manufacturer: row.Manufacturer || "",
      model: row.Model || "", // Ensure Model is taken from the correct column
      serialNumber: row.Serial_Number || "", // Ensure Serial Number is taken from the correct column
      logNo: row.Log_Number || "",
      maintenanceDate: parseExcelDate(row['2025_Maintenance_Date']) || "",
      engineer: row['2025_Engineer'] || "",
      nextMaintenanceDate: parseExcelDate(row['2026_Maintenance_Date']) || ""
    };
  };

  return { parsedData, processingError, processFileData, setProcessingError };
};
