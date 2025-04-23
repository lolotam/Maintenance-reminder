
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

const Upload = () => {
  const { addMachines } = useAppContext();
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleDataReady = (machines: Machine[], type: 'PPM' | 'OCM') => {
    try {
      addMachines(machines);
      setUploadStatus({
        success: true,
        message: `Successfully imported ${machines.length} ${type} machines.`,
      });
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
