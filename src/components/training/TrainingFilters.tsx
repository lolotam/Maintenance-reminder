
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TrainingFilters } from "@/types/training";

interface TrainingFiltersProps {
  filters: TrainingFilters;
  onFilterChange: (filters: TrainingFilters) => void;
}

export const TrainingFiltersComponent: React.FC<TrainingFiltersProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  const clearFilters = () => {
    onFilterChange({
      name: "",
      employeeId: "",
      department: "",
      trainer: ""
    });
  };
  
  const updateFilter = (key: keyof TrainingFilters, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };
  
  const hasActiveFilters = Object.values(filters).some(value => value !== "");
  
  return (
    <div className="bg-card border rounded-md p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            <span>Clear</span>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label htmlFor="name-filter" className="text-sm font-medium">
            Employee Name
          </label>
          <Input 
            id="name-filter"
            placeholder="Filter by name"
            value={filters.name}
            onChange={(e) => updateFilter("name", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="id-filter" className="text-sm font-medium">
            Employee ID
          </label>
          <Input 
            id="id-filter"
            placeholder="Filter by ID"
            value={filters.employeeId}
            onChange={(e) => updateFilter("employeeId", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="dept-filter" className="text-sm font-medium">
            Department
          </label>
          <Input 
            id="dept-filter"
            placeholder="Filter by department"
            value={filters.department}
            onChange={(e) => updateFilter("department", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="trainer-filter" className="text-sm font-medium">
            Trainer
          </label>
          <Input 
            id="trainer-filter"
            placeholder="Filter by trainer"
            value={filters.trainer}
            onChange={(e) => updateFilter("trainer", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
