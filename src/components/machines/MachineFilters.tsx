
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MachineFilters as FiltersType } from "@/types/machines";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MachineFiltersProps {
  filters: FiltersType;
  onFilterChange: (filters: FiltersType) => void;
}

export function MachineFilters({ filters, onFilterChange }: MachineFiltersProps) {
  const handleChange = (key: keyof FiltersType, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      equipment: "",
      model: "",
      serialNumber: "",
      manufacturer: "",
      logNo: "",
      department: "",
    });
  };

  const hasFilters = Object.values(filters).some((val) => val !== "");

  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-xs"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="space-y-2">
          <Label htmlFor="equipment-filter">Equipment</Label>
          <Input
            id="equipment-filter"
            placeholder="Filter by equipment"
            value={filters.equipment}
            onChange={(e) => handleChange("equipment", e.target.value)}
            className="h-8"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model-filter">Model</Label>
          <Input
            id="model-filter"
            placeholder="Filter by model"
            value={filters.model}
            onChange={(e) => handleChange("model", e.target.value)}
            className="h-8"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serial-filter">Serial Number</Label>
          <Input
            id="serial-filter"
            placeholder="Filter by serial"
            value={filters.serialNumber}
            onChange={(e) => handleChange("serialNumber", e.target.value)}
            className="h-8"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="manufacturer-filter">Manufacturer</Label>
          <Input
            id="manufacturer-filter"
            placeholder="Filter by manufacturer"
            value={filters.manufacturer}
            onChange={(e) => handleChange("manufacturer", e.target.value)}
            className="h-8"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logno-filter">Log Number</Label>
          <Input
            id="logno-filter"
            placeholder="Filter by log number"
            value={filters.logNo}
            onChange={(e) => handleChange("logNo", e.target.value)}
            className="h-8"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department-filter">Department</Label>
          <Input
            id="department-filter"
            placeholder="Filter by department"
            value={filters.department || ""}
            onChange={(e) => handleChange("department", e.target.value)}
            className="h-8"
          />
        </div>
      </div>
    </div>
  );
}
