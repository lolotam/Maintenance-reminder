import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { FileUploader } from "@/components/FileUploader";
import { useAppContext } from "@/contexts/AppContext";
import { Machine } from "@/types";
import { Check, AlertCircle, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadTemplate } from "@/utils/excelTemplates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { databaseService } from "@/services/databaseService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Upload = () => {
  const navigate = useNavigate();
  const { addMachines } = useAppContext();
  const queryClient = useQueryClient();
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const bulkAddPPMMachinesMutation = useMutation({
    mutationFn: databaseService.bulkAddPPMMachines,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ppmMachines'] });
      setUploadStatus({
        success: true,
        message: `Successfully imported ${data.insertedCount} PPM machines.`,
      });
      
      toast.success(`${data.insertedCount} PPM machines imported successfully!`, {
        description: "The data is now available in the PPM Machines page.",
        action: {
          label: "View Machines",
          onClick: () => navigate("/ldr-machines/ppm"),
        },
      });
      
      setTimeout(() => {
        setUploadStatus(null);
      }, 5000);
    },
    onError: (error: any) => {
      setUploadStatus({
        success: false,
        message: `Error: ${error.message || "Unknown error occurred"}`,
      });
    }
  });

  const bulkAddOCMMachinesMutation = useMutation({
    mutationFn: databaseService.bulkAddOCMMachines,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ocmMachines'] });
      setUploadStatus({
        success: true,
        message: `Successfully imported ${data.insertedCount} OCM machines.`,
      });
      
      toast.success(`${data.insertedCount} OCM machines imported successfully!`, {
        description: "The data is now available in the OCM Machines page.",
        action: {
          label: "View Machines",
          onClick: () => navigate("/ldr-machines/ocm"),
        },
      });
      
      setTimeout(() => {
        setUploadStatus(null);
      }, 5000);
    },
    onError: (error: any) => {
      setUploadStatus({
        success: false,
        message: `Error: ${error.message || "Unknown error occurred"}`,
      });
    }
  });

  const handleDataReady = (machines: Machine[], type: 'PPM' | 'OCM') => {
    try {
      addMachines(machines);
      
      if (type === 'PPM') {
        bulkAddPPMMachinesMutation.mutate(machines);
      } else {
        bulkAddOCMMachinesMutation.mutate(machines);
      }
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
          <h1 className="text-2xl font-bold tracking-tight text-primary">Upload Machine Data</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Import your machine maintenance data from Excel
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
            {uploadStatus.success && (
              <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate("/ldr-machines")}>
                Go to LDR Machines
              </Button>
            )}
          </Alert>
        )}

        <Tabs defaultValue="ppm" className="w-full">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
            <TabsTrigger value="ppm">PPM Machines</TabsTrigger>
            <TabsTrigger value="ocm">OCM Machines</TabsTrigger>
          </TabsList>

          <TabsContent value="ppm" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>PPM Machines Upload</CardTitle>
                  <Button 
                    variant="outline"
                    onClick={() => downloadTemplate('PPM')}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm">
                  Template contains: Equipment_Name, Model, Serial_Number, Manufacturer, Log_Number, Q1_Date, Q1_Engineer, Q2_Date, Q2_Engineer, Q3_Date, Q3_Engineer, Q4_Date, Q4_Engineer
                </p>
              </CardHeader>
              <CardContent>
                <FileUploader 
                  onDataReady={(data) => handleDataReady(data, 'PPM')} 
                  type="PPM"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ocm" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>OCM Machines Upload</CardTitle>
                  <Button 
                    variant="outline"
                    onClick={() => downloadTemplate('OCM')}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm">
                  Template contains: Equipment_Name, Model, Serial_Number, Manufacturer, Log_Number, 2025_Maintenance_Date, 2025_Engineer, 2026_Maintenance_Date
                </p>
              </CardHeader>
              <CardContent>
                <FileUploader 
                  onDataReady={(data) => handleDataReady(data, 'OCM')} 
                  type="OCM"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Upload;
