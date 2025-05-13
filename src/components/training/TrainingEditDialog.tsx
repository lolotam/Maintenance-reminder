
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EmployeeTraining } from "@/types/training";
import { departments } from "@/components/machines/PPMFormSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface TrainingEditDialogProps {
  employee: EmployeeTraining | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (employee: EmployeeTraining) => boolean;
  onAdd: (employee: Omit<EmployeeTraining, 'id'>) => boolean;
  availableMachines: string[];
}

export const TrainingEditDialog: React.FC<TrainingEditDialogProps> = ({
  employee,
  isOpen,
  onOpenChange,
  onSave,
  onAdd,
  availableMachines
}) => {
  const isEditing = !!employee;

  // Initialize form state
  const [formData, setFormData] = useState<Omit<EmployeeTraining, 'id'>>({
    name: "",
    employeeId: "",
    department: "",
    trainer: "",
    machines: availableMachines.map(name => ({ name, trained: false }))
  });

  // Reset form when dialog opens/closes or employee changes
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        employeeId: employee.employeeId,
        department: employee.department,
        trainer: employee.trainer,
        machines: availableMachines.map(name => {
          const existingMachine = employee.machines.find(m => m.name === name);
          return { name, trained: existingMachine?.trained ?? false };
        })
      });
    } else {
      // Reset form for new employee
      setFormData({
        name: "",
        employeeId: "",
        department: "",
        trainer: "",
        machines: availableMachines.map(name => ({ name, trained: false }))
      });
    }
  }, [employee, isOpen, availableMachines]);

  const handleChange = (field: keyof Omit<EmployeeTraining, 'id' | 'machines'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMachineChange = (machineName: string, trained: boolean) => {
    setFormData(prev => ({
      ...prev,
      machines: prev.machines.map(m => 
        m.name === machineName ? { ...m, trained } : m
      )
    }));
  };

  const handleSave = () => {
    if (isEditing && employee) {
      const success = onSave({ 
        id: employee.id, 
        ...formData 
      });
      if (success) {
        onOpenChange(false);
      }
    } else {
      const success = onAdd(formData);
      if (success) {
        onOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Edit ${employee?.name}'s Training` : "Add New Employee Training"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Employee name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) => handleChange("employeeId", e.target.value)}
                placeholder="Employee ID"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select 
                value={formData.department}
                onValueChange={(value) => handleChange("department", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer">Trainer</Label>
              <Input
                id="trainer"
                value={formData.trainer}
                onChange={(e) => handleChange("trainer", e.target.value)}
                placeholder="Trainer name"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Machine Training</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableMachines.map((machineName) => {
                const machine = formData.machines.find(m => m.name === machineName);
                const isTrained = machine?.trained ?? false;
                
                return (
                  <div key={machineName} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`machine-${machineName}`}
                      checked={isTrained}
                      onCheckedChange={(checked) => 
                        handleMachineChange(machineName, checked === true)
                      }
                    />
                    <Label 
                      htmlFor={`machine-${machineName}`}
                      className="capitalize"
                    >
                      {machineName}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
