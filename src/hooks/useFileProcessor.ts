
import { ImportType } from "@/hooks/useExcelImport";
import { usePPMImport } from "./import/usePPMImport";
import { useOCMImport } from "./import/useOCMImport";
import { useTrainingImport } from "./import/useTrainingImport";

/**
 * A unified hook that delegates to specific import hooks based on type
 * Maintains backward compatibility with existing code
 */
export const useFileProcessor = (type: ImportType) => {
  // Use appropriate hook based on import type
  const ppmImport = usePPMImport();
  const ocmImport = useOCMImport();
  const trainingImport = useTrainingImport();
  
  // Return the appropriate hook based on type
  if (type === 'PPM') {
    return ppmImport;
  } else if (type === 'OCM') {
    return ocmImport;
  } else {
    return trainingImport;
  }
};
