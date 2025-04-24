
import { useState } from "react";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { Machine } from "@/types";
import { addDays, addMonths, addYears, parseISO, isValid } from "date-fns";
import { PPM_HEADERS, OCM_HEADERS } from "@/utils/excelTemplates";

export const useFileProcessing = (type: 'PPM' | 'OCM') => {
  const [parsedData, setParsedData] = useState<Machine[]>([]);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const parseExcelDate = (value: any): string => {
    if (!value) return '';
    
    try {
      if (typeof value === 'number') {
        const excelEpoch = new Date(1900, 0, 1);
        const date = new Date(excelEpoch);
        date.setDate(excelEpoch.getDate() + value - 1);
        return date.toISOString();
      }
      
      if (typeof value === 'string') {
        const isoDate = new Date(value);
        if (isValid(isoDate)) {
          return isoDate.toISOString();
        }
        
        const parts = value.split(/[-\/]/);
        if (parts.length === 3) {
          const month = parseInt(parts[0]) - 1;
          const day = parseInt(parts[1]);
          const year = parseInt(parts[2]);
          const date = new Date(year, month, day);
          if (isValid(date)) {
            return date.toISOString();
          }
        }
      }
      
      console.warn("Could not parse date value:", value);
      return '';
    } catch (error) {
      console.error("Error parsing date:", error, value);
      return '';
    }
  };

  const calculateNextDate = (lastDate: string, frequency: string) => {
    try {
      if (!lastDate) return '';
      
      const date = parseISO(lastDate);
      if (!isValid(date)) {
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
      return '';
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
        if (type === 'PPM') {
          const q1Date = parseExcelDate(row.Q1_Date);
          const q2Date = parseExcelDate(row.Q2_Date);
          const q3Date = parseExcelDate(row.Q3_Date);
          const q4Date = parseExcelDate(row.Q4_Date);
          
          const dates = [q1Date, q2Date, q3Date, q4Date].filter(date => date);
          const lastMaintenanceDate = dates.length > 0 ? 
            dates.reduce((latest, current) => new Date(current) > new Date(latest) ? current : latest) : 
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
        } else {
          const date2025 = parseExcelDate(row['2025_Maintenance_Date']);
          const date2026 = parseExcelDate(row['2026_Maintenance_Date']);
          
          const dates = [date2025, date2026].filter(date => date);
          const lastMaintenanceDate = dates.length > 0 ? 
            dates.reduce((latest, current) => new Date(current) > new Date(latest) ? current : latest) : 
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

  return {
    parsedData,
    processingError,
    processFileData,
    setProcessingError,
    setParsedData
  };
};
