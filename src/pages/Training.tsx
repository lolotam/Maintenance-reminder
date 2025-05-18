
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { EmployeeTrainingTable } from "@/components/EmployeeTrainingTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileUp, FileDown } from "lucide-react";
import { TemplateDownloader } from "@/components/machines/TemplateDownloader";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FileUploader } from "@/components/FileUploader";
import { toast } from "sonner";
import { ExcelExporter } from "@/components/machines/ExcelExporter";
import { useEmployeeTraining } from "@/hooks/useEmployeeTraining";

const Training = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [importSheetOpen, setImportSheetOpen] = useState(false);
  const { trainingRecords } = useEmployeeTraining();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employee Training</h1>
          <p className="text-muted-foreground">
            Manage employee training records and machine proficiencies.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setSearchTerm("")}
            >
              Clear
            </Button>
            
            <ExcelExporter 
              data={trainingRecords} 
              filename="training_records"
              buttonText="Export to Excel"
            />
            
            <TemplateDownloader type="training" />
            
            <Sheet open={importSheetOpen} onOpenChange={setImportSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <FileUp className="h-4 w-4" />
                  Import Data
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[600px]">
                <SheetHeader className="mb-5">
                  <SheetTitle>Import Training Records</SheetTitle>
                </SheetHeader>
                <div className="space-y-6">
                  <TemplateDownloader type="training" fullWidth buttonText="Download Template" />
                  <FileUploader 
                    onDataReady={(records) => {
                      toast.success(`${records.length} training records imported successfully!`);
                      window.location.reload();
                    }} 
                    type="training"
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <EmployeeTrainingTable searchTerm={searchTerm} />
      </div>
    </MainLayout>
  );
};

export default Training;
