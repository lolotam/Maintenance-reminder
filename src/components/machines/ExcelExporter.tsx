
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useExcelExport, ExportableData } from "@/hooks/useExcelExport";

interface ExcelExporterProps {
  data: ExportableData;
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
  const { isExporting, exportToExcel } = useExcelExport();
  
  return (
    <Button
      variant={variant}
      size={size}
      className="flex items-center gap-2"
      onClick={() => exportToExcel(data, filename)}
      disabled={isExporting || !data.length}
    >
      <FileDown className="h-4 w-4" />
      {buttonText}
    </Button>
  );
}
