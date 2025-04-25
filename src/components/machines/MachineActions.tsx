
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Edit, Trash2 } from "lucide-react";

interface MachineActionsProps {
  onReminder: () => void;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function MachineActions({ onReminder, onComplete, onEdit, onDelete }: MachineActionsProps) {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={onReminder}>
        <Bell className="h-4 w-4 mr-1" />
        Remind
      </Button>
      <Button size="sm" variant="outline" onClick={onComplete}>
        <CheckCircle className="h-4 w-4 mr-1" />
        Complete
      </Button>
      <Button size="sm" variant="ghost" onClick={onEdit}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="ghost" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
