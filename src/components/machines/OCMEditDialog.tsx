
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { EditOCMMachineForm } from "@/components/machines/EditOCMMachineForm";
import { Machine } from "@/hooks/useMachineOperations";

interface OCMEditDialogProps {
  machine: Machine | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: any) => Promise<boolean>;
}

export function OCMEditDialog({ machine, isOpen, onOpenChange, onUpdate }: OCMEditDialogProps) {
  if (!machine) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit OCM Machine</DialogTitle>
        </DialogHeader>
        <EditOCMMachineForm
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
            notes: machine.notes || '',
            type: 'OCM',
            department: machine.location || '',
          }}
          onSave={async (updatedMachine) => {
            const success = await onUpdate(machine.id, {
              name: updatedMachine.equipment,
              model: updatedMachine.model,
              serial_number: updatedMachine.serialNumber,
              manufacturer: updatedMachine.manufacturer,
              log_number: updatedMachine.logNo,
              next_maintenance_date: updatedMachine.maintenanceDate?.toString(),
              engineer_id: updatedMachine.engineer,
              location: updatedMachine.department || updatedMachine.location, // Use department if provided
              notes: updatedMachine.notes,
            });
            
            if (success) {
              onOpenChange(false);
              toast.success(`${updatedMachine.equipment} has been updated`);
            }
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
