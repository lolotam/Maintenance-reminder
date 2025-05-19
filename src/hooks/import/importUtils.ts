
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { parseExcelDate } from "@/utils/dateUtils";
import { ImportType } from "@/hooks/useExcelImport";

// Header definitions for each import type
export const PPM_HEADERS = [
  'Equipment', 'Model', 'Serial Number', 'Manufacturer', 
  'Log No', 'Department', 'Type', 'Q1 Date', 'Q1 Engineer',
  'Q2 Date', 'Q2 Engineer', 'Q3 Date', 'Q3 Engineer',
  'Q4 Date', 'Q4 Engineer'
];

export const OCM_HEADERS = [
  'Equipment', 'Model', 'Serial Number', 'Manufacturer', 
  'Log No', 'Department', 'Type', 'Last Maintenance Date',
  'Next Maintenance Date', 'Engineer'
];

export const TRAINING_HEADERS = [
  'Name', 'Employee ID', 'Department', 'Trainer',
  'sonar', 'fmx', 'max', 'box20', 'hex'
];

/**
 * Validates import headers against expected headers
 */
export const validateHeaders = (headers: string[], expectedHeaders: string[]) => {
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
 * Normalizes row data by standardizing keys
 */
export const normalizeRowData = (row: any) => {
  const normalized: any = {};
  
  Object.entries(row).forEach(([key, value]) => {
    // Normalize the key by replacing spaces with underscores and removing special characters
    const normalizedKey = key.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    normalized[normalizedKey] = value;
  });
  
  return normalized;
};

/**
 * Gets existing data from localStorage based on import type
 */
export const getExistingData = (type: ImportType) => {
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
 * Merges new data with existing data, replacing duplicates
 */
export const mergeData = (existingData: any[], newData: any[], type: ImportType) => {
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
