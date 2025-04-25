
import { useState } from "react";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { Machine } from "@/types";
import { parseExcelDate, calculateNextDate } from "@/utils/dateUtils";
import { PPM_HEADERS, OCM_HEADERS } from "@/utils/excelTemplates";

export const useFileProcessor = (type: 'PPM' | 'OCM') => {
  const [parsedData, setParsedData] = useState<Machine[]>([]);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const validateHeaders = (headers: string[], expectedHeaders: string[]) => {
    const missingColumns = expectedHeaders.filter(expected => 
      !headers.some(header => header && header.toString().toLowerCase() === expected.toLowerCase())
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
      checkDuplicates(data, existingMachines);

      let machines: Machine[] = [];
      if (type === 'PPM') {
        machines = data.map(row => processPPMRow(row));
      } else {
        machines = data.map(row => processOCMRow(row));
      }

      // Now store the processed machines directly in localStorage
      const storageKey = type === 'PPM' ? "ppmMachines" : "ocmMachines";
      const existingData = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const combinedData = [...existingData, ...machines];
      localStorage.setItem(storageKey, JSON.stringify(combinedData));
      
      console.log(`Processed ${machines.length} ${type} machines`, machines);
      setParsedData(machines);
      setProcessingError(null);
    } catch (error: any) {
      console.error("Error processing file:", error);
      setProcessingError(error.message || "Unknown error processing file");
      setParsedData([]);
    }
  };

  const processPPMRow = (row: any): any => {
    const q1Date = parseExcelDate(row.Q1_Date);
    const q2Date = parseExcelDate(row.Q2_Date);
    const q3Date = parseExcelDate(row.Q3_Date);
    const q4Date = parseExcelDate(row.Q4_Date);
    
    return {
      id: uuidv4(),
      equipment: row.Equipment_Name || "",
      manufacturer: row.Manufacturer || "",
      model: row.Model || "",
      serialNumber: row.Serial_Number || "",
      logNo: row.Log_Number || "",
      q1: { 
        date: q1Date || "", 
        engineer: row.Q1_Engineer || "" 
      },
      q2: { 
        date: q2Date || "", 
        engineer: row.Q2_Engineer || "" 
      },
      q3: { 
        date: q3Date || "", 
        engineer: row.Q3_Engineer || "" 
      },
      q4: { 
        date: q4Date || "", 
        engineer: row.Q4_Engineer || "" 
      }
    };
  };

  const processOCMRow = (row: any): any => {
    const maintenance2025 = parseExcelDate(row['2025_Maintenance_Date']);
    const maintenance2026 = parseExcelDate(row['2026_Maintenance_Date']);
    
    return {
      id: uuidv4(),
      equipment: row.Equipment_Name || "",
      manufacturer: row.Manufacturer || "",
      model: row.Model || "",
      serialNumber: row.Serial_Number || "",
      logNo: row.Log_Number || "",
      maintenanceDate: maintenance2025 || "",
      nextMaintenanceDate: maintenance2026 || ""
    };
  };

  return { parsedData, processingError, processFileData, setProcessingError };
};
