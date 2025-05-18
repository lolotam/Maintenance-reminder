
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FileUp } from "lucide-react";
import { TemplateDownloader } from "@/components/machines/TemplateDownloader";
import { FileUploader } from "@/components/FileUploader";
import { toast } from "sonner";
import { EmployeeTraining } from "@/types/training";

interface TrainingImportProps {
  onImportSuccess?: () => void;
}

export const TrainingImport: React.FC<TrainingImportProps> = ({ onImportSuccess }) => {
  const [importSheetOpen, setImportSheetOpen] = useState(false);

  return (
    <Sheet open={importSheetOpen} onOpenChange={setImportSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
        >
          <FileUp className="h-4 w-4" />
          <span>Import</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[600px]">
        <SheetHeader className="mb-5">
          <SheetTitle>Import Employee Training Data</SheetTitle>
        </SheetHeader>
        <div className="space-y-6">
          <TemplateDownloader 
            type="training" 
            fullWidth 
            buttonText="Download Template" 
          />
          <FileUploader 
            onDataReady={(data) => {
              toast.success(`${(data as EmployeeTraining[]).length} training records imported successfully!`);
              setImportSheetOpen(false);
              if (onImportSuccess) onImportSuccess();
            }} 
            type="training"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
