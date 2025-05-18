
import React, { useCallback } from "react";
import { Machine } from "@/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useExcelImport, ImportType } from "@/hooks/useExcelImport";
import { DropZone } from "./upload/DropZone";
import { ParsedDataTable } from "./upload/ParsedDataTable";
import { EmployeeTraining } from "@/types/training";

interface FileUploaderProps {
  onDataReady: (data: Machine[] | EmployeeTraining[]) => void;
  type: ImportType;
}

export function FileUploader({ onDataReady, type }: FileUploaderProps) {
  const { parsedData, processingError, setProcessingError, handleFileUpload } = useExcelImport(type);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setProcessingError(null);
    
    if (acceptedFiles.length === 0) {
      setProcessingError("No file selected");
      return;
    }
    
    const file = acceptedFiles[0];
    handleFileUpload(file);
  }, [handleFileUpload, setProcessingError]);

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
