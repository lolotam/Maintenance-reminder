
import { BellRing } from "lucide-react";
import { MachineCard } from "@/components/MachineCard";
import { Machine } from "@/types";
import { useState } from "react";
import { motion } from "framer-motion";

interface MachinesListProps {
  machines: Machine[];
  onMarkComplete: (id: string) => void;
}

export const MachinesList = ({ machines, onMarkComplete }: MachinesListProps) => {
  if (machines.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/10 rounded-lg border border-border shadow-sm">
        <BellRing className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-75" />
        <h3 className="text-xl font-medium mb-2">No machines found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {machines.map((machine, index) => (
        <motion.div
          key={machine.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <MachineCard
            machine={machine}
            onMarkComplete={onMarkComplete}
          />
        </motion.div>
      ))}
    </div>
  );
};
