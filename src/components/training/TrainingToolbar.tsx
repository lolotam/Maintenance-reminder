
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Trash2 } from "lucide-react";
import { TemplateDownloader } from "@/components/machines/TemplateDownloader";
import { ExcelExporter } from "@/components/machines/ExcelExporter";
import { TrainingImport } from "@/components/training/TrainingImport";
import { useEmployeeTraining } from "@/hooks/useEmployeeTraining";
import { useExcelExport } from "@/hooks/useExcelExport";

interface TrainingToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedEmployees: string[];
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onAddEmployee: () => void;
  onImportSuccess?: () => void;
}

export const TrainingToolbar: React.FC<TrainingToolbarProps> = ({
  searchTerm,
  onSearchChange,
  selectedEmployees,
  onClearSelection,
  onBulkDelete,
  onAddEmployee,
  onImportSuccess
}) => {
  const { employees } = useEmployeeTraining();
  const { formatTrainingDataForExport } = useExcelExport();
  
  // Prepare data for export
  const exportData = formatTrainingDataForExport(employees);
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {selectedEmployees.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            className="gap-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete ({selectedEmployees.length})</span>
          </Button>
        )}
        <div className="flex items-center gap-2">
          <TemplateDownloader type="training" variant="outline" />
          
          <TrainingImport onImportSuccess={onImportSuccess} />
          
          <ExcelExporter
            data={exportData}
            filename="employee_training"
            buttonText="Export"
          />
        </div>
        <Button
          onClick={onAddEmployee}
          size="sm"
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Employee</span>
        </Button>
      </div>
    </div>
  );
};
