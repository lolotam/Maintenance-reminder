
import { useState } from 'react';
import { toast } from 'sonner';
import { PPMMachine, MachineFilters } from '@/types/machines';

export function usePPMMachines(initialMachines: PPMMachine[] = []) {
  const [machines, setMachines] = useState<PPMMachine[]>(() => {
    const stored = localStorage.getItem("ppmMachines");
    return stored ? JSON.parse(stored) : initialMachines;
  });
  
  const [editingMachine, setEditingMachine] = useState<PPMMachine | null>(null);
  const [filters, setFilters] = useState<MachineFilters>({
    equipment: "",
    model: "",
    serialNumber: "",
    manufacturer: "",
    logNo: "",
    department: "",
  });

  const saveToLocalStorage = (updatedMachines: PPMMachine[]) => {
    localStorage.setItem("ppmMachines", JSON.stringify(updatedMachines));
  };

  const handleDelete = (machine: PPMMachine) => {
    if (window.confirm(`Are you sure you want to delete ${machine.equipment}?`)) {
      const newMachines = machines.filter(m => m.id !== machine.id);
      setMachines(newMachines);
      saveToLocalStorage(newMachines);
      toast.success(`${machine.equipment} has been deleted`);
    }
  };
  
  const updateMachine = (updatedMachine: PPMMachine) => {
    const updatedMachines = machines.map(m =>
      m.id === updatedMachine.id ? updatedMachine : m
    );
    setMachines(updatedMachines);
    saveToLocalStorage(updatedMachines);
    toast.success(`${updatedMachine.equipment} has been updated`);
    return true;
  };
  
  // Safe string lowercase comparison helper
  const safeIncludes = (value: string | null | undefined, term: string) => {
    return value && typeof value === 'string' 
      ? value.toLowerCase().includes(term.toLowerCase()) 
      : false;
  };
  
  const getFilteredMachines = (searchTerm: string) => {
    return machines.filter((machine) => {
      const equipmentMatch = safeIncludes(machine.equipment, searchTerm);
      const modelMatch = safeIncludes(machine.model, searchTerm);
      const manufacturerMatch = safeIncludes(machine.manufacturer, searchTerm);
      const departmentMatch = safeIncludes(machine.department, searchTerm);
      
      const matchesSearch = equipmentMatch || modelMatch || manufacturerMatch || departmentMatch;

      const matchesEquipmentFilter = !filters.equipment || 
        safeIncludes(machine.equipment, filters.equipment);
      const matchesModelFilter = !filters.model || 
        safeIncludes(machine.model, filters.model);
      const matchesSerialFilter = !filters.serialNumber || 
        safeIncludes(machine.serialNumber, filters.serialNumber);
      const matchesManufacturerFilter = !filters.manufacturer || 
        safeIncludes(machine.manufacturer, filters.manufacturer);
      const matchesLogNoFilter = !filters.logNo || 
        (machine.logNo && safeIncludes(machine.logNo.toString(), filters.logNo));
      const matchesDepartmentFilter = !filters.department || 
        safeIncludes(machine.department || '', filters.department);

      const matchesFilters = matchesEquipmentFilter && matchesModelFilter && 
        matchesSerialFilter && matchesManufacturerFilter && matchesLogNoFilter && matchesDepartmentFilter;

      return matchesSearch && matchesFilters;
    });
  };

  const setReminder = (machine: PPMMachine, quarter: string) => {
    toast.success(`Reminder set for ${machine.equipment} ${quarter} maintenance`);
  };

  const markCompleted = (machine: PPMMachine, quarter: string) => {
    toast.success(`${quarter} maintenance for ${machine.equipment} marked as completed`);
  };

  return {
    machines,
    setMachines,
    filters,
    setFilters,
    editingMachine,
    setEditingMachine,
    filteredMachines: (searchTerm: string) => getFilteredMachines(searchTerm),
    handleDelete,
    updateMachine,
    setReminder,
    markCompleted
  };
}
