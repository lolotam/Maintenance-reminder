
import { useState, useEffect } from "react";
import { Machine } from "@/types";
import { calculateNextDate } from "@/contexts/machineUtils";

export const useMachineManagement = (initialMachines: Machine[] = []) => {
  const [machines, setMachines] = useState<Machine[]>(initialMachines);

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
          updatedMachines.push(newMachine);
        }
      });
      
      return updatedMachines;
    });
  };

  const updateMachine = (id: string, data: Partial<Machine>) => {
    setMachines((prevMachines) =>
      prevMachines.map((machine) =>
        machine.id === id ? { ...machine, ...data } : machine
      )
    );
  };

  const deleteMachine = (id: string) => {
    setMachines((prevMachines) => 
      prevMachines.filter((machine) => machine.id !== id)
    );
  };

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

  return {
    machines,
    setMachines,
    addMachines,
    updateMachine,
    deleteMachine,
    markMachineComplete,
  };
};
