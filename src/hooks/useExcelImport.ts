
import { useCallback } from "react";
import { handleFileUpload } from "./import/importUtils";
import { usePPMImport } from "./import/usePPMImport";
import { useOCMImport } from "./import/useOCMImport";
import { useTrainingImport } from "./import/useTrainingImport";

export type ImportType = 'PPM' | 'OCM' | 'training';

/**
 * Hook for handling Excel import functionality across all import types
 * This is a unified interface that delegates to type-specific import hooks
 */
export const useExcelImport = (type: ImportType) => {
  // Get the appropriate import hook based on type
  const ppmImport = usePPMImport();
  const ocmImport = useOCMImport();
  const trainingImport = useTrainingImport();
  
  // Select the correct import hook based on type
  const importHook = type === 'PPM' 
    ? ppmImport 
    : type === 'OCM' 
      ? ocmImport 
      : trainingImport;
  
  const { 
    parsedData, 
    processingError, 
    isImporting, 
    processFileData, 
    setProcessingError 
  } = importHook;

  /**
   * Handles file upload
   */
  const handleUploadFile = useCallback((file: File) => {
    handleFileUpload(
      file,
      processFileData,
      setProcessingError,
      (importing) => importHook.isImporting = importing
    );
  }, [processFileData, setProcessingError, importHook]);

  return {
    parsedData,
    processingError,
    isImporting,
    processFileData,
    handleFileUpload: handleUploadFile,
    setProcessingError
  };
};
