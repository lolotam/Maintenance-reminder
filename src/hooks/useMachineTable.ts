
import { useState } from 'react';
import { toast } from 'sonner';
import { MachineFilters } from '@/types/machines';

export function useMachineTable<T extends { id: string; equipment: string }>(
  type: 'ocm' | 'ppm',
  initialData: T[]
) {
  const [machines, setMachines] = useState<T[]>(() => {
    const stored = localStorage.getItem(`${type}Machines`);
    return stored ? JSON.parse(stored) : initialData;
  });

  const [filters, setFilters] = useState<MachineFilters>({
    equipment: "",
    model: "",
    serialNumber: "",
    manufacturer: "",
    logNo: "",
    department: "", // Added department filter
  });

  const saveToLocalStorage = (updatedMachines: T[]) => {
    localStorage.setItem(`${type}Machines`, JSON.stringify(updatedMachines));
  };

  const handleDelete = (machine: T) => {
    if (window.confirm(`Are you sure you want to delete ${machine.equipment}?`)) {
      const newMachines = machines.filter(m => m.id !== machine.id);
      setMachines(newMachines);
      saveToLocalStorage(newMachines);
      toast.success(`${machine.equipment} has been deleted`);
    }
  };

  return {
    machines,
    setMachines,
    filters,
    setFilters,
    saveToLocalStorage,
    handleDelete,
  };
}
