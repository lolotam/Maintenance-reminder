
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Machine } from "@/types";
import { parseExcelDate } from "@/utils/dateUtils";
import { PPM_HEADERS, validateHeaders, normalizeRowData, getExistingData, mergeData } from "./importUtils";
import { toast } from "sonner";

/**
 * Hook for handling PPM machine data import
 */
export const usePPMImport = () => {
  const [parsedData, setParsedData] = useState<Machine[]>([]);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  /**
   * Processes PPM row data
   */
  const processPPMRow = (row: any): Machine => {
    return {
      id: uuidv4(),
      equipment: row.Equipment || "",
      manufacturer: row.Manufacturer || "",
      model: row.Model || "",
      serialNumber: row.Serial_Number || "",
      logNo: row.Log_No || "",
      department: row.Department || "",
      type: row.Type || "PPM",
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

  /**
   * Process file data for PPM machines
   */
  const processFileData = (data: any[]) => {
    try {
      if (!data || !data.length) {
        throw new Error("No data found in file");
      }

      console.log("Processing PPM file data:", data);
      const headers = Object.keys(data[0]);
      
      // Validate and normalize headers
      validateHeaders(headers, PPM_HEADERS);
      
      const existingData = getExistingData('PPM');
      
      // Process PPM rows
      const processedData = data.map(row => processPPMRow(normalizeRowData(row)));

      // Merge new data with existing one, replacing duplicates
      const mergedData = mergeData(existingData, processedData, 'PPM');
      
      localStorage.setItem("ppmMachines", JSON.stringify(mergedData));
      
      console.log(`Processed ${processedData.length} PPM records`, processedData);
      setParsedData(processedData);
      setProcessingError(null);
      
      toast.success(`${processedData.length} PPM records imported successfully!`);
      
      return processedData;
    } catch (error: any) {
      console.error("Error processing file:", error);
      setProcessingError(error.message || "Unknown error processing file");
      toast.error(`Import error: ${error.message || "Unknown error"}`);
      setParsedData([]);
      return [];
    } finally {
      setIsImporting(false);
    }
  };

  return { parsedData, processingError, isImporting, processFileData, setProcessingError };
};
