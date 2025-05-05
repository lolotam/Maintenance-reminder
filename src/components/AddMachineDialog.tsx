
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ppmFormSchema, ocmFormSchema } from "./machines/MachineFormSchemas";
import { AddPPMForm } from "./machines/AddPPMForm";
import { AddOCMForm } from "./machines/AddOCMForm";

interface AddMachineDialogProps {
  type: "ppm" | "ocm";
  onAddMachine: (data: any) => void;
  defaultDepartment?: string; // Make department optional
}

export const AddMachineDialog = ({ type, onAddMachine, defaultDepartment }: AddMachineDialogProps) => {
  const formSchema = type === "ppm" ? ppmFormSchema : ocmFormSchema;
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: type === "ppm" ? {
      equipment: "",
      model: "",
      serialNumber: "",
      manufacturer: "",
      logNo: "",
      department: defaultDepartment || "", // Set default department if provided
      type: "PPM",
      q1_date: "",
      q1_engineer: "",
      q2_date: "",
      q2_engineer: "",
      q3_date: "",
      q3_engineer: "",
      q4_date: "",
      q4_engineer: "",
    } : {
      equipment: "",
      model: "",
      serialNumber: "",
      manufacturer: "",
      logNo: "",
      department: defaultDepartment || "", // Set default department if provided
      type: "OCM",
      maintenance2024: { date: "", engineer: "" },
      maintenance2025: { date: "", engineer: "" },
      maintenance2026: { date: "", engineer: "" },
    },
  });

  const onSubmit = (data: any) => {
    try {
      // Generate a unique ID for the new machine
      const newId = crypto.randomUUID();
      onAddMachine({ ...data, id: newId });
      toast.success(`${data.type} machine added successfully`);
    } catch (error) {
      toast.error("Failed to add machine");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add {type.toUpperCase()} Machine
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New {type.toUpperCase()} Machine</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          {type === "ppm" ? (
            <AddPPMForm form={form} onSubmit={onSubmit} />
          ) : (
            <AddOCMForm form={form} onSubmit={onSubmit} />
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
