import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { FileUploader } from "@/components/FileUploader";
import { useAppContext } from "@/contexts/AppContext";
import { Machine } from "@/types";
import { Check, AlertCircle, Download, RefreshCcw } from "lucide-react";
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
  const [serverStatus, setServerStatus] = useState<{
    checking: boolean;
    online: boolean;
    message: string;
  }>({
    checking: false,
    online: false,
    message: ""
  });

  const checkServerStatus = async () => {
    setServerStatus(prev => ({ ...prev, checking: true }));
    try {
      const API_URL = import.meta.env.DEV 
        ? "http://localhost:3001/api" 
        : "/api";
      
      const response = await fetch(`${API_URL}/health`);
      
      if (response.ok) {
        setServerStatus({
          checking: false,
          online: true,
          message: "Server is online and ready"
        });
        toast.success("Connected to server successfully");
      } else {
        throw new Error("Server responded with an error");
      }
    } catch (error) {
      console.error("Server connectivity error:", error);
      setServerStatus({
        checking: false,
        online: false,
        message: "Cannot connect to server. Please ensure the server is running."
      });
      toast.error("Failed to connect to server", {
        description: "Make sure the server is running with 'node server.js'"
      });
    }
  };

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
      toast.error("Failed to upload PPM machines", {
        description: error.message || "Connection to server failed"
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
      
      if (!serverStatus.online) {
        toast.warning("Attempting upload, but server connection hasn't been verified", {
          description: "Click 'Check Server Connection' first for best results"
        });
      }
      
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
      toast.error("Upload error", { 
        description: error.message || "Failed to process upload" 
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">Upload Machine Data</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Import your machine maintenance data from Excel
            </p>
          </div>
          
          <Button 
            variant="outline"
            onClick={checkServerStatus}
            disabled={serverStatus.checking}
            className="flex items-center gap-2"
          >
            {serverStatus.checking ? (
              <>Checking... <RefreshCcw className="h-4 w-4 animate-spin" /></>
            ) : (
              <>Check Server Connection <RefreshCcw className="h-4 w-4" /></>
            )}
          </Button>
        </div>

        {!serverStatus.online && serverStatus.message && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Server Connection Issue</AlertTitle>
            <AlertDescription>
              {serverStatus.message}
              <div className="mt-2">
                <p className="text-sm font-medium">Troubleshooting:</p>
                <ol className="text-sm list-decimal list-inside ml-2 mt-1">
                  <li>Ensure MongoDB connection string is correct in .env file</li>
                  <li>Run the server with: <code className="bg-muted p-1 rounded">node server.js</code></li>
                  <li>Check that the server is running on port 3001</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        )}

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
