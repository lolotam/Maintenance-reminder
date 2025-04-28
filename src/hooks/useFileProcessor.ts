import { useState } from "react";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { Machine } from "@/types";
import { parseExcelDate } from "@/utils/dateUtils";
import { PPM_HEADERS, OCM_HEADERS } from "@/utils/excelTemplates";
import { toast } from "sonner";

export const useFileProcessor = (type: 'PPM' | 'OCM') => {
  const [parsedData, setParsedData] = useState<Machine[]>([]);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const validateHeaders = (headers: string[], expectedHeaders: string[]) => {
    const normalizedHeaders = headers.map(h => 
      h.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
    );
    
    const missingColumns = expectedHeaders.filter(expected => 
      !normalizedHeaders.some(header => header === expected)
    );
    
    if (missingColumns.length) {
      const errorMessage = `Invalid headers in your Excel file.\n\nMissing or incorrect columns:\n${missingColumns.join(", ")}\n\nRequired headers:\n${expectedHeaders.join(", ")}`;
      throw new Error(errorMessage);
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

      console.log("Processing file data:", data);
      const headers = Object.keys(data[0]);
      const expectedHeaders = type === 'PPM' ? PPM_HEADERS : OCM_HEADERS;

      validateHeaders(headers, expectedHeaders);
      
      const existingMachines = getExistingMachines();
      
      let machines: Machine[] = [];
      if (type === 'PPM') {
        machines = data.map(row => processPPMRow(normalizeRowData(row)));
      } else {
        machines = data.map(row => processOCMRow(normalizeRowData(row)));
      }

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
      toast.error(error.message || "Error processing file");
    }
  };

  const normalizeRowData = (row: any) => {
    const normalized: any = {};
    
    Object.entries(row).forEach(([key, value]) => {
      const normalizedKey = key.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
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
    return {
      id: uuidv4(),
      equipment: row.Equipment_Name || "",
      manufacturer: row.Manufacturer || "",
      model: row.Model || "",
      serialNumber: row.Serial_Number || "",
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
    return {
      id: uuidv4(),
      equipment: row.Equipment_Name || "",
      manufacturer: row.Manufacturer || "",
      model: row.Model || "",
      serialNumber: row.Serial_Number || "",
      logNo: row.Log_Number || "",
      maintenanceDate: parseExcelDate(row['2025_Maintenance_Date']) || "",
      engineer: row['2025_Engineer'] || "",
      nextMaintenanceDate: parseExcelDate(row['2026_Maintenance_Date']) || ""
    };
  };

  return { parsedData, processingError, processFileData, setProcessingError };
};
