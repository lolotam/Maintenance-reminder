
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FileUp } from "lucide-react";
import { TemplateDownloader } from "@/components/machines/TemplateDownloader";
import { FileUploader } from "@/components/FileUploader";
import { ImportType } from "@/hooks/useExcelImport";

interface MachineImportProps {
  type: ImportType;
  onImportSuccess?: () => void;
  buttonText?: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

export const MachineImport: React.FC<MachineImportProps> = ({ 
  type,
  onImportSuccess,
  buttonText = "Import Data",
  variant = "outline",
  size = "sm"
}) => {
  const [importSheetOpen, setImportSheetOpen] = useState(false);
  
  const displayType = type === 'PPM' ? 'PPM' : type === 'OCM' ? 'OCM' : type;

  return (
    <Sheet open={importSheetOpen} onOpenChange={setImportSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="gap-1"
        >
          <FileUp className="h-4 w-4" />
          <span>{buttonText}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[600px]">
        <SheetHeader className="mb-5">
          <SheetTitle>Import {displayType} Machines Data</SheetTitle>
        </SheetHeader>
        <div className="space-y-6">
          <TemplateDownloader 
            type={type} 
            fullWidth 
            buttonText="Download Template" 
          />
          <FileUploader 
            onDataReady={(data) => {
              setImportSheetOpen(false);
              if (onImportSuccess) onImportSuccess();
            }} 
            type={type}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
