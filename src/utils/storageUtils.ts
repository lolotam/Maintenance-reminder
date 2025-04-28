
import { Machine } from "@/types";

export const getExistingMachines = (type: 'PPM' | 'OCM') => {
  try {
    const key = type === 'PPM' ? "ppmMachines" : "ocmMachines";
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error getting existing machines:", error);
    return [];
  }
};

export const mergeMachines = (existingMachines: Machine[], newMachines: Machine[]) => {
  const result = [...existingMachines];
  
  newMachines.forEach(newMachine => {
    const existingIndex = result.findIndex(
      existing => 
        existing.name === newMachine.name && 
        existing.serialNumber === newMachine.serialNumber
    );
    
    if (existingIndex >= 0) {
      result[existingIndex] = { ...newMachine, id: result[existingIndex].id };
    } else {
      result.push(newMachine);
    }
  });
  
  return result;
};
