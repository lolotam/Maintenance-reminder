
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { EmployeeTraining, TrainingMachine } from "@/types/training";
import { TRAINING_HEADERS, validateHeaders, normalizeRowData, getExistingData, mergeData } from "./importUtils";

/**
 * Hook for handling employee training data import
 */
export const useTrainingImport = () => {
  const [parsedData, setParsedData] = useState<EmployeeTraining[]>([]);
  const [processingError, setProcessingError] = useState<string | null>(null);

  /**
   * Processes training row data
   */
  const processTrainingRow = (row: any): EmployeeTraining => {
    // Extract machine training statuses
    const machineTraining: TrainingMachine[] = [];
    
    // Process all columns that might be machine names
    Object.keys(row).forEach(key => {
      // Skip columns that are definitely not machine names
      if (['Name', 'Employee_ID', 'Department', 'Trainer'].includes(key)) {
        return;
      }
      
      // For each potential machine column, treat it as a machine name
      const machineName = key.toLowerCase();
      const value = row[key];
      const trained = value?.toString().toLowerCase() === 'yes' || 
                     value?.toString().toLowerCase() === 'true' || 
                     value === true;
                     
      machineTraining.push({
        name: machineName,
        trained
      });
    });
    
    return {
      id: uuidv4(),
      name: row.Name || "",
      employeeId: row.Employee_ID || "",
      department: row.Department || "",
      trainer: row.Trainer || "",
      machines: machineTraining
    };
  };

  /**
   * Process file data for employee training
   */
  const processFileData = (data: any[]) => {
    try {
      if (!data || !data.length) {
        throw new Error("No data found in file");
      }

      console.log("Processing training file data:", data);
      const headers = Object.keys(data[0]);
      
      // Validate and normalize headers
      validateHeaders(headers, TRAINING_HEADERS);
      
      const existingData = getExistingData('training');
      
      // Process training rows
      const processedData = data.map(row => processTrainingRow(normalizeRowData(row)));

      // Merge new data with existing one, replacing duplicates
      const mergedData = mergeData(existingData, processedData, 'training');
      
      localStorage.setItem("employeeTraining", JSON.stringify(mergedData));
      
      console.log(`Processed ${processedData.length} training records`, processedData);
      setParsedData(processedData);
      setProcessingError(null);
      return processedData;
    } catch (error: any) {
      console.error("Error processing file:", error);
      setProcessingError(error.message || "Unknown error processing file");
      setParsedData([]);
      return [];
    }
  };

  return { parsedData, processingError, processFileData, setProcessingError };
};
