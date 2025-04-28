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
        machines = data.map(row => processPPMRow(row));
      } else {
        machines = data.map(row => processOCMRow(row));
      }

      // Merge new machines with existing ones, replacing duplicates
      const mergedMachines = mergeMachines(existingMachines, machines);
      
      // Store the processed machines in localStorage
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

  // Function to merge machines, replacing duplicates based on name and serial number
  const mergeMachines = (existingMachines: any[], newMachines: any[]) => {
    const result = [...existingMachines];
    
    newMachines.forEach(newMachine => {
      const existingIndex = result.findIndex(
        existing => 
          (existing.equipment && existing.equipment === newMachine.equipment && 
           existing.serialNumber && existing.serialNumber === newMachine.serialNumber) ||
          (existing.name && existing.name === newMachine.name && 
           existing.serialNumber && existing.serialNumber === newMachine.serialNumber)
      );
      
      if (existingIndex >= 0) {
        // Replace the existing machine with the new one, but keep the same ID
        result[existingIndex] = { ...newMachine, id: result[existingIndex].id };
        console.log(`Replaced existing machine: ${newMachine.equipment || newMachine.name} (${newMachine.serialNumber})`);
      } else {
        // Add the new machine
        result.push(newMachine);
      }
    });
    
    return result;
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
