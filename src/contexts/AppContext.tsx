import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Machine, AppSettings, NotificationSettings } from "@/types";
import { addMonths, addYears } from "date-fns";

interface Settings {
  defaultEmail: string;
  enableDarkMode: boolean;
  defaultReminderDays: number[];
  whatsappEnabled: boolean;
  whatsappNumber: string;
}

interface AppContextType {
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

const defaultSettings: AppSettings = {
  defaultEmail: "",
  enableDarkMode: false,
  defaultReminderDays: [7, 3, 1],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// LocalStorage keys
const MACHINES_STORAGE_KEY = "maintenance-machines";
const SETTINGS_STORAGE_KEY = "maintenance-settings";
const PPM_MACHINES_KEY = "ppmMachines";
const OCM_MACHINES_KEY = "ocmMachines";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [settings, setSettings] = useState<Settings>({
    defaultEmail: "",
    enableDarkMode: true,
    defaultReminderDays: [7, 3, 1],
    whatsappEnabled: false,
    whatsappNumber: "",
  });

  // Load data from localStorage on initial load
  useEffect(() => {
    try {
      const storedMachines = localStorage.getItem(MACHINES_STORAGE_KEY);
      if (storedMachines) {
        setMachines(JSON.parse(storedMachines));
      }

      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(MACHINES_STORAGE_KEY, JSON.stringify(machines));
  }, [machines]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Calculate next maintenance date based on last date and frequency
  const calculateNextDate = (lastDate: string, frequency: "Quarterly" | "Yearly"): string => {
    try {
      const date = new Date(lastDate);
      if (isNaN(date.getTime())) {
        console.error("Invalid date in calculateNextDate:", lastDate);
        return "";
      }
      
      if (frequency === "Quarterly") {
        return addMonths(date, 3).toISOString();
      } else {
        return addYears(date, 1).toISOString();
      }
    } catch (error) {
      console.error("Error in calculateNextDate:", error);
      return "";
    }
  };

  // Add new machines
  const addMachines = (newMachines: Machine[]) => {
    setMachines((prevMachines) => {
      // Process new machines - update existing or add new
      const updatedMachines = [...prevMachines];
      
      newMachines.forEach(newMachine => {
        // Check for duplicates based on both name AND serial number
        const existingIndex = updatedMachines.findIndex(
          m => m.name === newMachine.name && m.serialNumber === newMachine.serialNumber
        );
        
        if (existingIndex >= 0) {
          // Update existing machine
          updatedMachines[existingIndex] = {
            ...updatedMachines[existingIndex],
            lastMaintenanceDate: newMachine.lastMaintenanceDate,
            frequency: newMachine.frequency,
            nextMaintenanceDate: newMachine.nextMaintenanceDate
          };
        } else {
          // Add new machine
          updatedMachines.push({
            ...newMachine,
            notificationSettings: {
              email: settings.defaultEmail,
              enableEmailNotifications: !!settings.defaultEmail,
              enableDesktopNotifications: true,
              reminderDays: [...settings.defaultReminderDays],
            },
          });
        }
      });
      
      return updatedMachines;
    });
  };

  // Update a single machine
  const updateMachine = (id: string, data: Partial<Machine>) => {
    setMachines((prevMachines) =>
      prevMachines.map((machine) =>
        machine.id === id ? { ...machine, ...data } : machine
      )
    );
  };

  // Delete a machine
  const deleteMachine = (id: string) => {
    setMachines((prevMachines) => prevMachines.filter((machine) => machine.id !== id));
  };

  // Mark a machine as maintained (reset its maintenance cycle)
  const markMachineComplete = (id: string) => {
    setMachines((prevMachines) =>
      prevMachines.map((machine) => {
        if (machine.id === id) {
          const today = new Date().toISOString();
          const nextMaintenanceDate = calculateNextDate(
            today,
            machine.frequency
          );
          return {
            ...machine,
            lastMaintenanceDate: today,
            nextMaintenanceDate,
          };
        }
        return machine;
      })
    );
  };

  // Update app settings
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  // Filter and search machines
  const filteredMachines = (searchTerm: string, filters: any) => {
    return machines.filter((machine) => {
      // Search term filtering (case insensitive)
      const matchesSearch = !searchTerm ||
        machine.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Frequency filtering
      const matchesFrequency = !filters.frequency || 
        machine.frequency === filters.frequency;
        
      // Status filtering (overdue, upcoming, all)
      let matchesStatus = true;
      if (filters.status) {
        const today = new Date();
        const nextDate = new Date(machine.nextMaintenanceDate || "");
        
        if (filters.status === "overdue") {
          matchesStatus = nextDate < today;
        } else if (filters.status === "upcoming") {
          matchesStatus = nextDate > today;
        }
      }
      
      return matchesSearch && matchesFrequency && matchesStatus;
    });
  };

  // Get all machines, including LDR machines
  const getAllMachines = (): Machine[] => {
    const allMachines = [...machines];
    
    try {
      // Get PPM machines from localStorage
      const storedPPMMachines = JSON.parse(localStorage.getItem(PPM_MACHINES_KEY) || "[]");
      const ppmMachines = storedPPMMachines.map((machine: any) => {
        // Find the most recent maintenance date
        const dates = [
          machine.q1?.date, 
          machine.q2?.date, 
          machine.q3?.date, 
          machine.q4?.date
        ].filter(Boolean);
        
        let lastMaintenanceDate = "";
        
        if (dates.length > 0) {
          try {
            lastMaintenanceDate = new Date(Math.max(...dates.map(d => new Date(d).getTime()))).toISOString();
          } catch (error) {
            console.error("Error processing PPM dates:", error, dates);
            lastMaintenanceDate = machine.lastMaintenanceDate || new Date().toISOString();
          }
        } else {
          lastMaintenanceDate = machine.lastMaintenanceDate || new Date().toISOString();
        }
        
        const nextDate = machine.nextMaintenanceDate || 
          (lastMaintenanceDate ? calculateNextDate(lastMaintenanceDate, "Quarterly") : "");
        
        return {
          id: machine.id || `ppm-${Math.random().toString(36).substring(2, 9)}`,
          name: machine.equipment || "Unknown PPM Machine",
          serialNumber: machine.serialNumber || "",
          manufacturer: machine.manufacturer || "",
          model: machine.model || "",
          logNo: machine.logNo || "",
          frequency: "Quarterly" as const,
          lastMaintenanceDate: lastMaintenanceDate,
          nextMaintenanceDate: nextDate,
          quarters: {
            q1: { 
              date: machine.q1?.date || "", 
              engineer: machine.q1?.engineer || "" 
            },
            q2: { 
              date: machine.q2?.date || "", 
              engineer: machine.q2?.engineer || "" 
            },
            q3: { 
              date: machine.q3?.date || "", 
              engineer: machine.q3?.engineer || "" 
            },
            q4: { 
              date: machine.q4?.date || "", 
              engineer: machine.q4?.engineer || "" 
            },
          },
          notificationSettings: {
            email: settings.defaultEmail,
            enableEmailNotifications: !!settings.defaultEmail,
            enableDesktopNotifications: true,
            reminderDays: [...settings.defaultReminderDays],
          },
        };
      });
      
      // Get OCM machines from localStorage
      const storedOCMMachines = JSON.parse(localStorage.getItem(OCM_MACHINES_KEY) || "[]");
      const ocmMachines = storedOCMMachines.map((machine: any) => {
        let lastMaintenanceDate = machine.lastMaintenanceDate || machine.maintenanceDate || "";
        const nextDate = machine.nextMaintenanceDate || 
          (lastMaintenanceDate ? calculateNextDate(lastMaintenanceDate, "Yearly") : "");
          
        return {
          id: machine.id || `ocm-${Math.random().toString(36).substring(2, 9)}`,
          name: machine.equipment || "Unknown OCM Machine",
          serialNumber: machine.serialNumber || "",
          manufacturer: machine.manufacturer || "",
          model: machine.model || "",
          logNo: machine.logNo || "",
          frequency: "Yearly" as const,
          lastMaintenanceDate: lastMaintenanceDate,
          nextMaintenanceDate: nextDate,
          years: {
            '2025': { 
              date: machine.maintenanceDate || "", 
              engineer: machine.engineer || "" 
            },
            '2026': { 
              date: "", 
              engineer: "" 
            },
          },
          notificationSettings: {
            email: settings.defaultEmail,
            enableEmailNotifications: !!settings.defaultEmail,
            enableDesktopNotifications: true,
            reminderDays: [...settings.defaultReminderDays],
          },
        };
      });
      
      // Combine all machines, avoiding duplicates based on id
      const allIds = new Set(allMachines.map(m => m.id));
      
      for (const machine of [...ppmMachines, ...ocmMachines]) {
        if (!allIds.has(machine.id)) {
          allMachines.push(machine);
          allIds.add(machine.id);
        }
      }
    } catch (error) {
      console.error("Error processing LDR machines:", error);
    }
    
    return allMachines;
  };
  
  // Count machines by type
  const countMachinesByType = (type: "PPM" | "OCM") => {
    try {
      const storedOCMMachines = JSON.parse(localStorage.getItem(OCM_MACHINES_KEY) || "[]");
      const storedPPMMachines = JSON.parse(localStorage.getItem(PPM_MACHINES_KEY) || "[]");
      
      if (type === "OCM") {
        return storedOCMMachines.length;
      } else if (type === "PPM") {
        return storedPPMMachines.length;
      }
    } catch (error) {
      console.error("Error counting machines:", error);
    }
    return 0;
  };

  const value = {
    machines,
    settings,
    addMachines,
    updateMachine,
    deleteMachine,
    markMachineComplete,
    updateSettings,
    filteredMachines,
    countMachinesByType,
    getAllMachines,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
