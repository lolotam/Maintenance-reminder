
import { createContext, useContext, ReactNode } from "react";
import { Machine } from "@/types";
import { AppContextType, Settings } from "./types";
import { calculateNextDate, filterMachines } from "./machineUtils";
import { useLocalStorage, PPM_MACHINES_KEY, OCM_MACHINES_KEY } from "./useLocalStorage";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { machines, setMachines, settings, setSettings } = useLocalStorage();

  // Add new machines
  const addMachines = (newMachines: Machine[]) => {
    setMachines((prevMachines) => {
      const updatedMachines = [...prevMachines];
      
      newMachines.forEach(newMachine => {
        const existingIndex = updatedMachines.findIndex(
          m => m.name === newMachine.name && m.serialNumber === newMachine.serialNumber
        );
        
        if (existingIndex >= 0) {
          updatedMachines[existingIndex] = {
            ...updatedMachines[existingIndex],
            lastMaintenanceDate: newMachine.lastMaintenanceDate,
            frequency: newMachine.frequency,
            nextMaintenanceDate: newMachine.nextMaintenanceDate
          };
        } else {
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
    setMachines((prevMachines) => 
      prevMachines.filter((machine) => machine.id !== id)
    );
  };

  // Mark a machine as maintained
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

  // Get all machines, including LDR machines
  const getAllMachines = (): Machine[] => {
    const allMachines = [...machines];
    
    try {
      // Get PPM machines from localStorage
      const storedPPMMachines = JSON.parse(localStorage.getItem(PPM_MACHINES_KEY) || "[]");
      const ppmMachines = storedPPMMachines.map((machine: any) => {
        // Handle null/undefined values safely
        if (!machine) return null;
        
        const dates = [
          machine.q1?.date, 
          machine.q2?.date, 
          machine.q3?.date, 
          machine.q4?.date
        ].filter(Boolean);
        
        let lastMaintenanceDate = "";
        
        if (dates.length > 0) {
          try {
            // Use valid dates only
            const validDates = dates
              .filter(d => d && typeof d === 'string' && !isNaN(new Date(d).getTime()))
              .map(d => new Date(d).getTime());
            
            lastMaintenanceDate = validDates.length > 0 
              ? new Date(Math.max(...validDates)).toISOString()
              : "";
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
            q1: { date: machine.q1?.date || "", engineer: machine.q1?.engineer || "" },
            q2: { date: machine.q2?.date || "", engineer: machine.q2?.engineer || "" },
            q3: { date: machine.q3?.date || "", engineer: machine.q3?.engineer || "" },
            q4: { date: machine.q4?.date || "", engineer: machine.q4?.engineer || "" },
          },
          notificationSettings: {
            email: settings.defaultEmail,
            enableEmailNotifications: !!settings.defaultEmail,
            enableDesktopNotifications: true,
            reminderDays: [...settings.defaultReminderDays],
          },
        };
      }).filter(Boolean); // Filter out null values
      
      // Get OCM machines from localStorage
      const storedOCMMachines = JSON.parse(localStorage.getItem(OCM_MACHINES_KEY) || "[]");
      const ocmMachines = storedOCMMachines.map((machine: any) => {
        // Handle null/undefined values safely
        if (!machine) return null;
        
        let lastMaintenanceDate = machine.lastMaintenanceDate || machine.maintenanceDate || "";
        
        // Validate date
        if (lastMaintenanceDate && typeof lastMaintenanceDate === 'string') {
          try {
            const date = new Date(lastMaintenanceDate);
            if (isNaN(date.getTime())) {
              lastMaintenanceDate = "";
            }
          } catch (e) {
            lastMaintenanceDate = "";
          }
        }
        
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
            '2025': { date: machine.maintenanceDate || "", engineer: machine.engineer || "" },
            '2026': { date: "", engineer: "" },
          },
          notificationSettings: {
            email: settings.defaultEmail,
            enableEmailNotifications: !!settings.defaultEmail,
            enableDesktopNotifications: true,
            reminderDays: [...settings.defaultReminderDays],
          },
        };
      }).filter(Boolean); // Filter out null values
      
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
      let storedMachines = [];
      
      if (type === "OCM") {
        storedMachines = JSON.parse(localStorage.getItem(OCM_MACHINES_KEY) || "[]");
      } else if (type === "PPM") {
        storedMachines = JSON.parse(localStorage.getItem(PPM_MACHINES_KEY) || "[]");
      }
      
      return Array.isArray(storedMachines) ? storedMachines.length : 0;
    } catch (error) {
      console.error("Error counting machines:", error);
      return 0;
    }
  };

  const value = {
    machines,
    settings,
    addMachines,
    updateMachine,
    deleteMachine,
    markMachineComplete,
    updateSettings,
    filteredMachines: (searchTerm: string, filters: any) => 
      filterMachines(machines, searchTerm, filters),
    countMachinesByType,
    getAllMachines,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
