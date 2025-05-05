export interface BaseMachine {
  id: string;
  equipment: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  logNo: string;
  type?: 'PPM' | 'OCM'; // New field for machine type
  department?: string; // New field for department
}

export interface OCMMachine extends BaseMachine {
  maintenanceDate: string | Date;
  engineer?: string;
  location?: string;
  lastMaintenanceDate?: string | Date;
  nextMaintenanceDate?: string | Date;
  maintenanceIntervalDays?: number;
  notes?: string;
}

export interface PPMMachine extends BaseMachine {
  q1: { date: string; engineer: string };
  q2: { date: string; engineer: string };
  q3: { date: string; engineer: string };
  q4: { date: string; engineer: string };
  location?: string;
  lastMaintenanceDate?: string | Date;
  nextMaintenanceDate?: string | Date;
  notes?: string;
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
  department?: string; // Add department to filters
}

export type NotificationType = 'email' | 'whatsapp' | 'push' | 'sms';

export interface NotificationSettings {
  email: boolean;
  whatsapp: boolean;
  push: boolean;
  sms: boolean;
  reminderDays: number[];
}
