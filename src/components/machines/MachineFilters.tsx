
import { Input } from "@/components/ui/input";

export interface MachineFilters {
  equipment: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  logNo: string;
}

interface MachineFiltersProps {
  filters: MachineFilters;
  onFilterChange: (filters: MachineFilters) => void;
}

export function MachineFilters({ filters, onFilterChange }: MachineFiltersProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <Input
        placeholder="Filter by equipment"
        value={filters.equipment}
        onChange={(e) => onFilterChange({ ...filters, equipment: e.target.value })}
      />
      <Input
        placeholder="Filter by model"
        value={filters.model}
        onChange={(e) => onFilterChange({ ...filters, model: e.target.value })}
      />
      <Input
        placeholder="Filter by serial number"
        value={filters.serialNumber}
        onChange={(e) => onFilterChange({ ...filters, serialNumber: e.target.value })}
      />
      <Input
        placeholder="Filter by manufacturer"
        value={filters.manufacturer}
        onChange={(e) => onFilterChange({ ...filters, manufacturer: e.target.value })}
      />
      <Input
        placeholder="Filter by log no"
        value={filters.logNo}
        onChange={(e) => onFilterChange({ ...filters, logNo: e.target.value })}
      />
    </div>
  );
}
