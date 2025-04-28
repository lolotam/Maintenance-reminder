
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { Machine } from "@/types";
import { parseExcelDate } from "@/utils/dateUtils";

export const processPPMDataByIndex = (
  worksheet: XLSX.Sheet, 
  headerMap: Record<string, number>, 
  range: XLSX.Range
): Machine[] => {
  const result: Machine[] = [];
  
  for (let r = range.s.r + 1; r <= range.e.r; r++) {
    const machine: Machine = { 
      id: uuidv4(),
      name: "",
      lastMaintenanceDate: "",
      frequency: 'Quarterly'
    };
    
    const getCellValue = (header: string) => {
      const index = headerMap[header];
      if (index === undefined) return "";
      
      const cellAddress = XLSX.utils.encode_cell({ r, c: index });
      const cell = worksheet[cellAddress];
      return cell ? cell.v : "";
    };
    
    machine.name = getCellValue('Equipment_Name') || "";
    machine.manufacturer = getCellValue('Manufacturer') || "";
    machine.model = getCellValue('Model') || "";
    machine.serialNumber = getCellValue('Serial_Number') || "";
    machine.logNo = getCellValue('Log_Number') || "";
    
    console.log(`DEBUG - PPM Row ${r-1} Cell Values:`, {
      EquipmentCol: headerMap['Equipment_Name'],
      Equipment: machine.name,
      ModelCol: headerMap['Model'], 
      Model: machine.model,
      SerialNumberCol: headerMap['Serial_Number'],
      SerialNumber: machine.serialNumber
    });
    
    // Initialize quarters object with all required fields
    machine.quarters = {
      q1: { 
        date: parseExcelDate(getCellValue('Q1_Date')) || "", 
        engineer: getCellValue('Q1_Engineer') || "" 
      },
      q2: { 
        date: parseExcelDate(getCellValue('Q2_Date')) || "", 
        engineer: getCellValue('Q2_Engineer') || "" 
      },
      q3: { 
        date: parseExcelDate(getCellValue('Q3_Date')) || "", 
        engineer: getCellValue('Q3_Engineer') || "" 
      },
      q4: { 
        date: parseExcelDate(getCellValue('Q4_Date')) || "", 
        engineer: getCellValue('Q4_Engineer') || "" 
      }
    };
    
    machine.lastMaintenanceDate = machine.quarters.q1.date || "";
    
    if (machine.name) {
      result.push(machine);
    }
  }
  
  return result;
};

export const processOCMDataByIndex = (
  worksheet: XLSX.Sheet, 
  headerMap: Record<string, number>, 
  range: XLSX.Range
): Machine[] => {
  const result: Machine[] = [];
  
  for (let r = range.s.r + 1; r <= range.e.r; r++) {
    const machine: Machine = { 
      id: uuidv4(),
      name: "",
      lastMaintenanceDate: "",
      frequency: 'Yearly'
    };
    
    const getCellValue = (header: string) => {
      const index = headerMap[header];
      if (index === undefined) return "";
      
      const cellAddress = XLSX.utils.encode_cell({ r, c: index });
      const cell = worksheet[cellAddress];
      return cell ? cell.v : "";
    };
    
    machine.name = getCellValue('Equipment_Name') || "";
    machine.manufacturer = getCellValue('Manufacturer') || "";
    machine.model = getCellValue('Model') || "";
    machine.serialNumber = getCellValue('Serial_Number') || "";
    machine.logNo = getCellValue('Log_Number') || "";
    
    console.log(`DEBUG - OCM Row ${r-1} Cell Values:`, {
      EquipmentCol: headerMap['Equipment_Name'],
      Equipment: machine.name,
      ModelCol: headerMap['Model'], 
      Model: machine.model,
      SerialNumberCol: headerMap['Serial_Number'],
      SerialNumber: machine.serialNumber
    });
    
    const maintenanceDate = parseExcelDate(getCellValue('2025_Maintenance_Date')) || "";
    const engineer = getCellValue('2025_Engineer') || "";
    const nextMaintenanceDate = parseExcelDate(getCellValue('2026_Maintenance_Date')) || "";
    
    machine.lastMaintenanceDate = maintenanceDate;
    machine.nextMaintenanceDate = nextMaintenanceDate;
    
    machine.years = {
      '2025': { 
        date: maintenanceDate, 
        engineer: engineer 
      },
      '2026': { 
        date: nextMaintenanceDate, 
        engineer: "" 
      }
    };
    
    if (machine.name) {
      result.push(machine);
    }
  }
  
  return result;
};
