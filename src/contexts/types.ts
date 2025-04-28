import { Machine } from "@/types";

export interface Settings {
  defaultEmail: string;
  enableDarkMode: boolean;
  defaultReminderDays: number[];
  whatsappEnabled: boolean;
  whatsappNumber: string;
  smsEnabled?: boolean;
  smsNumber?: string;
}

export interface AppContextType {
  machines: Machine[];
  settings: Settings;
  addMachines: (newMachines: Machine[]) => void;
  updateMachine: (id: string, data: Partial<Machine>) => void;
  deleteMachine: (id: string) => void;
  markMachineComplete: (id: string) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  filteredMachines: (searchTerm: string, filters: any) => Machine[];
  countMachinesByType: (type: "PPM" | "OCM") => number;
  getAllMachines: () => Machine[];
}

export const defaultSettings: Settings = {
  defaultEmail: "",
  enableDarkMode: false, // Set default to false for light mode
  defaultReminderDays: [7, 3, 1],
  whatsappEnabled: false,
  whatsappNumber: "",
  smsEnabled: false,
  smsNumber: "",
};
