
import { AlertCircle } from "lucide-react";
import { Machine } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFileProcessing } from "@/hooks/useFileProcessing";
import { DropZone } from "@/components/DropZone";
import { ProcessedDataTable } from "@/components/ProcessedDataTable";

interface FileUploaderProps {
  onDataReady: (machines: Machine[]) => void;
  type: 'PPM' | 'OCM';
}

export function FileUploader({ onDataReady, type }: FileUploaderProps) {
  const {
    parsedData,
    processingError,
    processFileData,
    setProcessingError
  } = useFileProcessing(type);

  const saveToApplication = () => {
    try {
      onDataReady(parsedData);
    } catch (error: any) {
      setProcessingError(error.message || "Unknown error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <DropZone 
        onFileProcess={processFileData}
        setError={setProcessingError}
      />

      {processingError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{processingError}</AlertDescription>
        </Alert>
      )}

      {parsedData.length > 0 && (
        <ProcessedDataTable 
          data={parsedData}
          onSave={saveToApplication}
        />
      )}
    </div>
  );
}
