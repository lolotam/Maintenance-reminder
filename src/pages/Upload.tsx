
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { FileUploader } from "@/components/FileUploader";
import { useAppContext } from "@/contexts/AppContext";
import { Machine } from "@/types";
import { Check, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const { addMachines } = useAppContext();
  const navigate = useNavigate();
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleDataReady = (machines: Machine[]) => {
    try {
      addMachines(machines);
      setUploadStatus({
        success: true,
        message: `Successfully imported ${machines.length} machines.`,
      });
      
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      setUploadStatus({
        success: false,
        message: `Error: ${error.message || "Unknown error occurred"}`,
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Machine Data</h1>
          <p className="text-muted-foreground mt-2">
            Import your machine maintenance data from Excel or CSV
          </p>
        </div>

        {uploadStatus && (
          <Alert
            variant={uploadStatus.success ? "default" : "destructive"}
            className={uploadStatus.success ? "bg-green-50 text-green-800 border-green-200" : ""}
          >
            {uploadStatus.success ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {uploadStatus.success ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{uploadStatus.message}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-lg border p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium">File Format Requirements</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Your Excel or CSV file should contain the following columns:
            </p>
            <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
              <li>
                <strong>Machine Name</strong> - Name or identifier of the machine
              </li>
              <li>
                <strong>Last Maintenance Date</strong> - Date of the most recent maintenance
                (in any standard date format)
              </li>
              <li>
                <strong>Frequency</strong> - Maintenance interval (must be "Quarterly" or "Yearly")
              </li>
            </ul>
          </div>

          <FileUploader onDataReady={handleDataReady} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Upload;
