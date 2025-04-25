
import { BellRing } from "lucide-react";
import { MachineCard } from "@/components/MachineCard";
import { Machine } from "@/types";

interface MachinesListProps {
  machines: Machine[];
  onMarkComplete: (id: string) => void;
}

export const MachinesList = ({ machines, onMarkComplete }: MachinesListProps) => {
  if (machines.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-lg">
        <BellRing className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No machines found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {machines.map((machine) => (
        <MachineCard
          key={machine.id}
          machine={machine}
          onMarkComplete={onMarkComplete}
        />
      ))}
    </div>
  );
};
