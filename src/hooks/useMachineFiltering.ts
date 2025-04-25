
import { Machine } from "@/types";
import { filterMachines } from "@/contexts/machineUtils";

export const useMachineFiltering = () => {
  const filteredMachines = (machines: Machine[], searchTerm: string, filters: any) => {
    return filterMachines(machines, searchTerm, filters);
  };

  return {
    filteredMachines,
  };
};
