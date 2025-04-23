import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Machine, AppSettings, NotificationSettings } from "@/types";
import { addMonths, addYears } from "date-fns";

interface AppContextType {
  machines: Machine[];
  settings: AppSettings;
  addMachines: (newMachines: Machine[]) => void;
  updateMachine: (id: string, data: Partial<Machine>) => void;
  deleteMachine: (id: string) => void;
  markMachineComplete: (id: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  filteredMachines: (searchTerm: string, filters: any) => Machine[];
  countMachinesByType: (type: "PPM" | "OCM") => number;
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

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
    const date = new Date(lastDate);
    if (frequency === "Quarterly") {
      return addMonths(date, 3).toISOString();
    } else {
      return addYears(date, 1).toISOString();
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
  const updateSettings = (newSettings: Partial<AppSettings>) => {
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

  // New method to count machines by type
  const countMachinesByType = (type: "PPM" | "OCM") => {
    const storedOCMMachines = JSON.parse(localStorage.getItem("ocmMachines") || "[]");
    const storedPPMMachines = JSON.parse(localStorage.getItem("ppmMachines") || "[]");
    
    if (type === "OCM") {
      return storedOCMMachines.length;
    } else if (type === "PPM") {
      return storedPPMMachines.length;
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
