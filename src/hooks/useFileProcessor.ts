
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

      const headers = Object.keys(data[0]);
      const expectedHeaders = type === 'PPM' ? PPM_HEADERS : OCM_HEADERS;

      validateHeaders(headers, expectedHeaders);
      
      const existingMachines = getExistingMachines();
      checkDuplicates(data, existingMachines);

      const machines: Machine[] = data.map(row => {
        if (type === 'PPM') {
          return processPPMRow(row);
        } else {
          return processOCMRow(row);
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

  const processPPMRow = (row: any): Machine => {
    const q1Date = parseExcelDate(row.Q1_Date);
    const q2Date = parseExcelDate(row.Q2_Date);
    const q3Date = parseExcelDate(row.Q3_Date);
    const q4Date = parseExcelDate(row.Q4_Date);
    
    const dates = [q1Date, q2Date, q3Date, q4Date].filter(date => date);
    
    const lastMaintenanceDate = dates.length > 0 ? 
      dates.reduce((latest, current) => {
        return new Date(current) > new Date(latest) ? current : latest;
      }) : 
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
      nextMaintenanceDate: calculateNextDate(lastMaintenanceDate, 'Quarterly'),
      quarters: {
        q1: { date: q1Date, engineer: row.Q1_Engineer || '' },
        q2: { date: q2Date, engineer: row.Q2_Engineer || '' },
        q3: { date: q3Date, engineer: row.Q3_Engineer || '' },
        q4: { date: q4Date, engineer: row.Q4_Engineer || '' },
      }
    };
  };

  const processOCMRow = (row: any): Machine => {
    const date2025 = parseExcelDate(row['2025_Maintenance_Date']);
    const date2026 = parseExcelDate(row['2026_Maintenance_Date']);
    
    const dates = [date2025, date2026].filter(date => date);
    
    const lastMaintenanceDate = dates.length > 0 ? 
      dates.reduce((latest, current) => {
        return new Date(current) > new Date(latest) ? current : latest;
      }) : 
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
      nextMaintenanceDate: calculateNextDate(lastMaintenanceDate, 'Yearly'),
      years: {
        '2025': { date: date2025, engineer: row['2025_Engineer'] || '' },
        '2026': { date: date2026, engineer: row['2026_Engineer'] || '' },
      }
    };
  };

  return { parsedData, processingError, processFileData, setProcessingError };
};
