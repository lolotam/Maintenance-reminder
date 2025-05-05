import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MachineFilters } from "@/types/machines";
import { useMachineOperations, Machine } from "@/hooks/useMachineOperations";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationHandler } from "@/hooks/useNotificationHandler";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

export function useOCMMachines() {
  const { user } = useAuth();
  const {
    machines: allMachines,
    loading,
    error,
    fetchMachines,
    updateMachine,
    deleteMachine
  } = useMachineOperations();
  
  const { sendNotification } = useNotificationHandler();
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [filters, setFilters] = useState<MachineFilters>({
    equipment: "",
    model: "",
    serialNumber: "",
    manufacturer: "",
    logNo: "",
    department: "",
  });

  // Fetch OCM machines on load
  useEffect(() => {
    if (user) {
      fetchMachines({ type: 'ocm' });
    }
  }, [user]);

  // Set up real-time updates
  useRealtimeUpdates({
    table: 'machines',
    onData: (payload) => {
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        // Only refresh if the machine is an OCM machine
        if (payload.new && payload.new.maintenance_interval === 'yearly') {
          fetchMachines({ type: 'ocm' });
        }
      } else if (payload.eventType === 'DELETE') {
        // Always refresh on delete to keep the list updated
        fetchMachines({ type: 'ocm' });
      }
    }
  });

  // Safe string lowercase comparison helper
  const safeIncludes = (value: string | null | undefined, term: string) => {
    return value && typeof value === 'string' 
      ? value.toLowerCase().includes(term.toLowerCase()) 
      : false;
  };

  // Filter OCM machines
  const getFilteredMachines = (searchTerm: string) => {
    const ocmMachines = allMachines.filter(machine => machine.maintenance_interval === 'yearly');
    
    return ocmMachines.filter((machine) => {
      const equipmentMatch = safeIncludes(machine.name, searchTerm);
      const modelMatch = safeIncludes(machine.model || '', searchTerm);
      const manufacturerMatch = safeIncludes(machine.manufacturer || '', searchTerm);
      const departmentMatch = safeIncludes(machine.location || '', searchTerm); // Using location field for department
      
      const matchesSearch = equipmentMatch || modelMatch || manufacturerMatch || departmentMatch;

      const matchesEquipmentFilter = !filters.equipment || 
        safeIncludes(machine.name, filters.equipment);
      const matchesModelFilter = !filters.model || 
        safeIncludes(machine.model || '', filters.model);
      const matchesSerialFilter = !filters.serialNumber || 
        safeIncludes(machine.serial_number || '', filters.serialNumber);
      const matchesManufacturerFilter = !filters.manufacturer || 
        safeIncludes(machine.manufacturer || '', filters.manufacturer);
      const matchesLogNoFilter = !filters.logNo || 
        safeIncludes(machine.log_number || '', filters.logNo);
      const matchesDepartmentFilter = !filters.department || 
        safeIncludes(machine.location || '', filters.department); // Using location field for department

      const matchesFilters = matchesEquipmentFilter && matchesModelFilter && 
        matchesSerialFilter && matchesManufacturerFilter && matchesLogNoFilter && matchesDepartmentFilter;

      return matchesSearch && matchesFilters;
    });
  };

  // Handle maintenance actions
  const setReminder = async (machine: Machine) => {
    try {
      const success = await sendNotification(machine, 'email');
      if (success) {
        toast.success(`Reminder set for ${machine.name} annual maintenance`);
      }
    } catch (error) {
      console.error('Error setting reminder:', error);
      toast.error('Failed to set reminder');
    }
  };

  const markCompleted = async (machine: Machine) => {
    try {
      const today = new Date().toISOString();
      
      const success = await updateMachine(machine.id, {
        last_maintenance_date: today,
        // Next maintenance date will be auto-calculated by the database trigger
      });
      
      if (success) {
        toast.success(`Annual maintenance for ${machine.name} marked as completed`);
      }
    } catch (error) {
      console.error('Error marking as completed:', error);
      toast.error('Failed to mark as completed');
    }
  };

  return {
    filteredMachines: (searchTerm: string) => getFilteredMachines(searchTerm),
    allMachines,
    loading,
    error,
    filters,
    setFilters,
    editingMachine,
    setEditingMachine,
    fetchMachines,
    updateMachine,
    deleteMachine,
    setReminder,
    markCompleted
  };
}
