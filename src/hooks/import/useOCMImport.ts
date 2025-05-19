
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Machine } from "@/types";
import { parseExcelDate } from "@/utils/dateUtils";
import { OCM_HEADERS, validateHeaders, normalizeRowData, getExistingData, mergeData } from "./importUtils";
import { toast } from "sonner";

/**
 * Hook for handling OCM machine data import
 */
export const useOCMImport = () => {
  const [parsedData, setParsedData] = useState<Machine[]>([]);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  /**
   * Processes OCM row data
   */
  const processOCMRow = (row: any): Machine => {
    return {
      id: uuidv4(),
      equipment: row.Equipment || "",
      manufacturer: row.Manufacturer || "",
      model: row.Model || "",
      serialNumber: row.Serial_Number || "",
      logNo: row.Log_No || "",
      department: row.Department || "",
      type: row.Type || "OCM",
      maintenanceDate: parseExcelDate(row.Last_Maintenance_Date) || "",
      engineer: row.Engineer || "",
      nextMaintenanceDate: parseExcelDate(row.Next_Maintenance_Date) || ""
    };
  };

  /**
   * Process file data for OCM machines
   */
  const processFileData = (data: any[]) => {
    try {
      if (!data || !data.length) {
        throw new Error("No data found in file");
      }

      console.log("Processing OCM file data:", data);
      const headers = Object.keys(data[0]);
      
      // Validate and normalize headers
      validateHeaders(headers, OCM_HEADERS);
      
      const existingData = getExistingData('OCM');
      
      // Process OCM rows
      const processedData = data.map(row => processOCMRow(normalizeRowData(row)));

      // Merge new data with existing one, replacing duplicates
      const mergedData = mergeData(existingData, processedData, 'OCM');
      
      localStorage.setItem("ocmMachines", JSON.stringify(mergedData));
      
      console.log(`Processed ${processedData.length} OCM records`, processedData);
      setParsedData(processedData);
      setProcessingError(null);
      
      toast.success(`${processedData.length} OCM records imported successfully!`);
      
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
