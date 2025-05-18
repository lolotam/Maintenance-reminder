export interface Machine {
  id: string;
  equipment: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  logNo?: string;
  department?: string;
  type?: string;
  [key: string]: any; // Allow for additional properties
}
