
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

  const cleanHeaderName = (header: string): string => {
    // Remove invisible Unicode characters, trim spaces, and normalize spaces/underscores
    return header
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');
  };

  const validateHeaders = (worksheetHeaders: string[], expectedHeaders: string[]) => {
    const cleanedHeaders = worksheetHeaders.map(cleanHeaderName);
    
    console.log("DEBUG - Cleaned Headers:", cleanedHeaders);
    console.log("DEBUG - Expected Headers:", expectedHeaders);
    
    // Check for missing required columns
    const missingColumns = expectedHeaders.filter(expected => 
      !cleanedHeaders.some(header => header === expected)
    );
    
    if (missingColumns.length) {
      const errorMessage = `Invalid headers in your Excel file.\n\nMissing or incorrect columns:\n${missingColumns.join(", ")}\n\nRequired headers:\n${expectedHeaders.join(", ")}`;
      throw new Error(errorMessage);
    }
    
    return {
      cleanedHeaders,
      // Create mapping from column index to expected header name
      headerIndexMap: cleanedHeaders.reduce((map, header, index) => {
        if (expectedHeaders.includes(header)) {
          map[header] = index;
        }
        return map;
      }, {} as Record<string, number>)
    };
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

  const processFileData = (data: any[], worksheetData: XLSX.Sheet) => {
    try {
      if (!data || !data.length) {
        throw new Error("No data found in file");
      }

      console.log("Raw Excel data:", data);
      
      // Get the headers from the worksheet directly to preserve precise column order
      const range = XLSX.utils.decode_range(worksheetData['!ref'] || "A1");
      const headerRow: string[] = [];
      
      for (let c = range.s.c; c <= range.e.c; c++) {
        const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c });
        const cell = worksheetData[cellAddress];
        headerRow.push(cell ? String(cell.v) : "");
      }
      
      console.log("DEBUG - Extracted header row:", headerRow);
      console.log("DEBUG - Column count:", headerRow.length);
      
      const expectedHeaders = type === 'PPM' ? PPM_HEADERS : OCM_HEADERS;
      const { headerIndexMap } = validateHeaders(headerRow, expectedHeaders);
      
      console.log("DEBUG - Header to index mapping:", headerIndexMap);
      
      const existingMachines = getExistingMachines();
      
      // Process the data directly from worksheet using indexes instead of object keys
      let machines: Machine[] = [];
      if (type === 'PPM') {
        machines = processPPMDataByIndex(worksheetData, headerIndexMap, range);
      } else {
        machines = processOCMDataByIndex(worksheetData, headerIndexMap, range);
      }
      
      // Debug log - check for correct separation of Model and Serial_Number
      machines.forEach((machine, index) => {
        console.log(`DEBUG - Processed Row ${index}:`, {
          Equipment: machine.equipment,
          Model: machine.model,
          SerialNumber: machine.serialNumber,
          // Full machine for comparison
          FullMachine: machine
        });
      });
      
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

  const processPPMDataByIndex = (
    worksheet: XLSX.Sheet, 
    headerMap: Record<string, number>, 
    range: XLSX.Range
  ): Machine[] => {
    const result: Machine[] = [];
    
    // Start from row 1 (skip header row 0)
    for (let r = range.s.r + 1; r <= range.e.r; r++) {
      const machine: any = { id: uuidv4() };
      
      // Process each expected column using its index from the headerMap
      const getCellValue = (header: string) => {
        const index = headerMap[header];
        if (index === undefined) return "";
        
        const cellAddress = XLSX.utils.encode_cell({ r, c: index });
        const cell = worksheet[cellAddress];
        return cell ? cell.v : "";
      };
      
      machine.equipment = getCellValue('Equipment_Name') || "";
      machine.manufacturer = getCellValue('Manufacturer') || "";
      machine.model = getCellValue('Model') || "";
      machine.serialNumber = getCellValue('Serial_Number') || "";
      machine.logNo = getCellValue('Log_Number') || "";
      
      // Debug log each cell value to see if Model and Serial_Number are correctly separated
      console.log(`DEBUG - PPM Row ${r-1} Cell Values:`, {
        EquipmentCol: headerMap['Equipment_Name'],
        Equipment: machine.equipment,
        ModelCol: headerMap['Model'], 
        Model: machine.model,
        SerialNumberCol: headerMap['Serial_Number'],
        SerialNumber: machine.serialNumber
      });
      
      machine.q1 = { 
        date: parseExcelDate(getCellValue('Q1_Date')) || "", 
        engineer: getCellValue('Q1_Engineer') || "" 
      };
      
      machine.q2 = { 
        date: parseExcelDate(getCellValue('Q2_Date')) || "", 
        engineer: getCellValue('Q2_Engineer') || "" 
      };
      
      machine.q3 = { 
        date: parseExcelDate(getCellValue('Q3_Date')) || "", 
        engineer: getCellValue('Q3_Engineer') || "" 
      };
      
      machine.q4 = { 
        date: parseExcelDate(getCellValue('Q4_Date')) || "", 
        engineer: getCellValue('Q4_Engineer') || "" 
      };
      
      // Only add if we have at least equipment name
      if (machine.equipment) {
        result.push(machine);
      }
    }
    
    return result;
  };

  const processOCMDataByIndex = (
    worksheet: XLSX.Sheet, 
    headerMap: Record<string, number>, 
    range: XLSX.Range
  ): Machine[] => {
    const result: Machine[] = [];
    
    // Start from row 1 (skip header row 0)
    for (let r = range.s.r + 1; r <= range.e.r; r++) {
      const machine: any = { id: uuidv4() };
      
      // Process each expected column using its index from the headerMap
      const getCellValue = (header: string) => {
        const index = headerMap[header];
        if (index === undefined) return "";
        
        const cellAddress = XLSX.utils.encode_cell({ r, c: index });
        const cell = worksheet[cellAddress];
        return cell ? cell.v : "";
      };
      
      machine.equipment = getCellValue('Equipment_Name') || "";
      machine.manufacturer = getCellValue('Manufacturer') || "";
      machine.model = getCellValue('Model') || "";
      machine.serialNumber = getCellValue('Serial_Number') || "";
      machine.logNo = getCellValue('Log_Number') || "";
      
      // Debug log each cell value to see if Model and Serial_Number are correctly separated
      console.log(`DEBUG - OCM Row ${r-1} Cell Values:`, {
        EquipmentCol: headerMap['Equipment_Name'],
        Equipment: machine.equipment,
        ModelCol: headerMap['Model'], 
        Model: machine.model,
        SerialNumberCol: headerMap['Serial_Number'],
        SerialNumber: machine.serialNumber
      });
      
      machine.maintenanceDate = parseExcelDate(getCellValue('2025_Maintenance_Date')) || "";
      machine.engineer = getCellValue('2025_Engineer') || "";
      machine.nextMaintenanceDate = parseExcelDate(getCellValue('2026_Maintenance_Date')) || "";
      
      // Only add if we have at least equipment name
      if (machine.equipment) {
        result.push(machine);
      }
    }
    
    return result;
  };
  
  // These functions are no longer needed as we process directly from the worksheet
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
    // This is kept for backward compatibility but not used in the new implementation
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
    // This is kept for backward compatibility but not used in the new implementation
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
