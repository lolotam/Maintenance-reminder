
export interface Machine {
  id: string;
  equipment: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  logNo?: string;
  department?: string;
  type?: string;
  name?: string;
  location?: string;
  serial_number?: string;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  maintenanceDate?: string;
  nextMaintenanceDate?: string;
  engineer?: string;
  q1?: {
    date: string;
    engineer: string;
  };
  q2?: {
    date: string;
    engineer: string;
  };
  q3?: {
    date: string;
    engineer: string;
  };
  q4?: {
    date: string;
    engineer: string;
  };
  [key: string]: any; // Allow for additional properties
}
