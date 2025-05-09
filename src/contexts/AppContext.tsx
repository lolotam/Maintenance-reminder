
import { createContext, useContext, ReactNode } from "react";
import { AppContextType } from "./types";
import { useLocalStorage } from "./useLocalStorage";
import { useMachineManagement } from "@/hooks/useMachineManagement";
import { useSettings } from "@/hooks/useSettings";
import { useMachineFiltering } from "@/hooks/useMachineFiltering";
import { useMachineStats } from "@/hooks/useMachineStats";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { machines: initialMachines, setMachines: setStoredMachines, settings: initialSettings, setSettings: setStoredSettings } = useLocalStorage();
  const { machines, setMachines, addMachines, updateMachine, deleteMachine, markMachineComplete } = useMachineManagement(initialMachines);
  const { settings, updateSettings } = useSettings(initialSettings);
  const { filteredMachines } = useMachineFiltering();
  
  // Pass machines directly to useMachineStats
  const machineStats = useMachineStats(machines);
  const { countMachinesByType } = machineStats;

  const getAllMachines = () => machines;

  const value = {
    machines,
    settings,
    addMachines,
    updateMachine,
    deleteMachine,
    markMachineComplete,
    updateSettings,
    filteredMachines: (searchTerm: string, filters: any) => 
      filteredMachines(machines, searchTerm, filters),
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
