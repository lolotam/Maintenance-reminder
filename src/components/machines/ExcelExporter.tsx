
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface ExcelExporterProps {
  data: any[];
  filename: string;
  buttonText?: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

export function ExcelExporter({
  data,
  filename,
  buttonText = "Export to Excel",
  variant = "outline",
  size = "sm"
}: ExcelExporterProps) {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = () => {
    setIsExporting(true);
    try {
      if (!data || data.length === 0) {
        toast.error("No data to export");
        setIsExporting(false);
        return;
      }
      
      // Prepare the worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Create a workbook and add the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      
      // Generate file name
      const exportFileName = `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Write the workbook and trigger download
      XLSX.writeFile(wb, exportFileName);
      
      toast.success(`Data exported successfully to ${exportFileName}`);
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      className="flex items-center gap-2"
      onClick={handleExport}
      disabled={isExporting || !data.length}
    >
      <FileDown className="h-4 w-4" />
      {buttonText}
    </Button>
  );
}
