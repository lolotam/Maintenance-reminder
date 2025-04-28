
import React, { useCallback } from "react";
import * as XLSX from "xlsx";
import { Machine } from "@/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import { DropZone } from "./upload/DropZone";
import { ParsedDataTable } from "./upload/ParsedDataTable";

interface FileUploaderProps {
  onDataReady: (machines: Machine[]) => void;
  type: 'PPM' | 'OCM';
}

export function FileUploader({ onDataReady, type }: FileUploaderProps) {
  const { parsedData, processingError, processFileData, setProcessingError } = useFileProcessor(type);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setProcessingError(null);
    
    if (acceptedFiles.length === 0) {
      setProcessingError("No file selected");
      return;
    }
    
    const file = acceptedFiles[0];
    
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv"
    ];
    
    if (!validTypes.includes(file.type)) {
      setProcessingError("Invalid file type. Please upload Excel or CSV file");
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("No data read from file");
        
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Raw parsing of Excel data
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: "" });
        console.log("Raw imported data:", jsonData);
        
        // Log the headers to debug
        if (jsonData.length > 0) {
          console.log("Excel headers:", Object.keys(jsonData[0]));
        }
        
        processFileData(jsonData);
      } catch (error: any) {
        console.error("Error reading file:", error);
        setProcessingError(error.message || "Error reading file");
      }
    };
    
    reader.readAsBinaryString(file);
  }, [processFileData, setProcessingError]);

  const saveToApplication = () => {
    try {
      console.log("Saving data to application:", parsedData);
      onDataReady(parsedData);
    } catch (error: any) {
      console.error("Error saving data:", error);
      setProcessingError(error.message || "Error saving data");
    }
  };

  return (
    <div className="space-y-6">
      <DropZone onDrop={onDrop} type={type} />

      {processingError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{processingError}</AlertDescription>
        </Alert>
      )}

      <ParsedDataTable data={parsedData} onSave={saveToApplication} />
    </div>
  );
}
