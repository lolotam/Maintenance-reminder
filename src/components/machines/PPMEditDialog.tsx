
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { EditPPMMachineForm } from "@/components/machines/EditPPMMachineForm";
import { PPMMachine } from "@/types/machines";

interface PPMEditDialogProps {
  machine: PPMMachine | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (machine: PPMMachine) => boolean;
}

export function PPMEditDialog({ machine, isOpen, onOpenChange, onSave }: PPMEditDialogProps) {
  if (!machine) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit PPM Machine</DialogTitle>
        </DialogHeader>
        <EditPPMMachineForm
          machine={machine}
          onSave={(updatedMachine) => {
            const success = onSave(updatedMachine);
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
