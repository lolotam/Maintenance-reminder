import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MachineTableProps } from "@/types/machines";
import { MachineFilters } from "@/components/machines/MachineFilters";
import { EditOCMMachineForm } from "@/components/machines/EditOCMMachineForm";
import { MachineTableHeader } from "@/components/machines/MachineTableHeader";
import { MachineTableRow } from "@/components/machines/MachineTableRow";
import { useMachineOperations, Machine } from "@/hooks/useMachineOperations";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationHandler } from "@/hooks/useNotificationHandler";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export const OCMMachinesTable = ({ searchTerm, selectedMachines, setSelectedMachines }: MachineTableProps) => {
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [filters, setFilters] = useState<MachineFilters>({
    equipment: "",
    model: "",
    serialNumber: "",
    manufacturer: "",
    logNo: "",
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
  const ocmMachines = allMachines.filter(machine => machine.maintenance_interval === 'yearly');
  
  const filteredMachines = ocmMachines.filter((machine) => {
    const equipmentMatch = safeIncludes(machine.name, searchTerm);
    const modelMatch = safeIncludes(machine.model || '', searchTerm);
    const manufacturerMatch = safeIncludes(machine.manufacturer || '', searchTerm);
    
    const matchesSearch = equipmentMatch || modelMatch || manufacturerMatch;

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

    const matchesFilters = matchesEquipmentFilter && matchesModelFilter && 
      matchesSerialFilter && matchesManufacturerFilter && matchesLogNoFilter;

    return matchesSearch && matchesFilters;
  });

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
      const maintInterval = machine.maintenance_interval_days || 365;
      
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

  // Toggle machine selection
  const toggleMachineSelection = (machineId: string) => {
    setSelectedMachines(
      selectedMachines.includes(machineId)
        ? selectedMachines.filter(id => id !== machineId)
        : [...selectedMachines, machineId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedMachines.length === filteredMachines.length) {
      setSelectedMachines([]);
    } else {
      setSelectedMachines(filteredMachines.map(m => m.id));
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading machines: {error.message}</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
          onClick={() => fetchMachines({ type: 'ocm' })}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <MachineFilters filters={filters} onFilterChange={setFilters} />
        
        <div className="overflow-x-auto">
          <Table>
            <MachineTableHeader 
              type="ocm"
              onSelectAll={handleSelectAll}
              hasSelectedItems={selectedMachines.length > 0}
            />
            <TableBody>
              {filteredMachines.length > 0 ? (
                filteredMachines.map((machine) => (
                  <MachineTableRow
                    key={machine.id}
                    machine={{
                      id: machine.id,
                      equipment: machine.name,
                      model: machine.model || '',
                      serialNumber: machine.serial_number || '',
                      manufacturer: machine.manufacturer || '',
                      logNo: machine.log_number || '',
                      maintenanceDate: machine.next_maintenance_date || '',
                      engineer: machine.engineer_id || '',
                      location: machine.location || '',
                      lastMaintenanceDate: machine.last_maintenance_date,
                      nextMaintenanceDate: machine.next_maintenance_date,
                    }}
                    type="ocm"
                    isSelected={selectedMachines.includes(machine.id)}
                    onSelect={toggleMachineSelection}
                    onReminder={() => setReminder(machine)}
                    onComplete={() => markCompleted(machine)}
                    onEdit={() => {
                      setEditingMachine(machine);
                      setDialogOpen(true);
                    }}
                    onDelete={() => {
                      if (window.confirm(`Are you sure you want to delete ${machine.name}?`)) {
                        deleteMachine(machine.id);
                      }
                    }}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-4">
                    No OCM machines found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit OCM Machine</DialogTitle>
            </DialogHeader>
            {editingMachine && (
              <EditOCMMachineForm
                machine={{
                  id: editingMachine.id,
                  equipment: editingMachine.name,
                  model: editingMachine.model || '',
                  serialNumber: editingMachine.serial_number || '',
                  manufacturer: editingMachine.manufacturer || '',
                  logNo: editingMachine.log_number || '',
                  maintenanceDate: editingMachine.next_maintenance_date || '',
                  engineer: editingMachine.engineer_id || '',
                  location: editingMachine.location || '',
                  notes: editingMachine.notes || '',
                }}
                onSave={async (updatedMachine) => {
                  const success = await updateMachine(editingMachine.id, {
                    name: updatedMachine.equipment,
                    model: updatedMachine.model,
                    serial_number: updatedMachine.serialNumber,
                    manufacturer: updatedMachine.manufacturer,
                    log_number: updatedMachine.logNo,
                    next_maintenance_date: updatedMachine.maintenanceDate?.toString(),
                    engineer_id: updatedMachine.engineer,
                    location: updatedMachine.location,
                    notes: updatedMachine.notes,
                  });
                  
                  if (success) {
                    setDialogOpen(false);
                    setEditingMachine(null);
                    toast.success(`${updatedMachine.equipment} has been updated`);
                  }
                }}
                onCancel={() => {
                  setDialogOpen(false);
                  setEditingMachine(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
};
