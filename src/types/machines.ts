
export interface BaseMachine {
  id: string;
  equipment: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  logNo: string;
}

export interface OCMMachine extends BaseMachine {
  maintenanceDate: string | Date;
  engineer?: string;
}

export interface PPMMachine extends BaseMachine {
  q1: { date?: string; engineer?: string };
  q2: { date?: string; engineer?: string };
  q3: { date?: string; engineer?: string };
  q4: { date?: string; engineer?: string };
}

export interface MachineTableProps {
  searchTerm: string;
  selectedMachines: string[];
  setSelectedMachines: (machines: string[]) => void;
}

export interface MachineFilters {
  equipment: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  logNo: string;
}
