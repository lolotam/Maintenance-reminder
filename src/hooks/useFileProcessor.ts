
import { useState } from "react";
import * as XLSX from "xlsx";
import { Machine } from "@/types";
import { PPM_HEADERS, OCM_HEADERS } from "@/utils/excelTemplates";
import { toast } from "sonner";
import { validateHeaders } from "@/utils/headerValidation";
import { processPPMDataByIndex, processOCMDataByIndex } from "@/utils/machineDataProcessing";
import { getExistingMachines, mergeMachines } from "@/utils/storageUtils";

export const useFileProcessor = (type: 'PPM' | 'OCM') => {
  const [parsedData, setParsedData] = useState<Machine[]>([]);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const processFileData = (data: any[], worksheetData: XLSX.Sheet) => {
    try {
      if (!data || !data.length) {
        throw new Error("No data found in file");
      }

      console.log("Raw Excel data:", data);
      
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
      
      const existingMachines = getExistingMachines(type);
      
      const machines = type === 'PPM' 
        ? processPPMDataByIndex(worksheetData, headerIndexMap, range)
        : processOCMDataByIndex(worksheetData, headerIndexMap, range);
      
      machines.forEach((machine, index) => {
        console.log(`DEBUG - Processed Row ${index}:`, {
          Name: machine.name,
          Model: machine.model,
          SerialNumber: machine.serialNumber,
          Manufacturer: machine.manufacturer,
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

  return { parsedData, processingError, processFileData, setProcessingError };
};
