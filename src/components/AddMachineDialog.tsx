
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

interface AddMachineDialogProps {
  type: "ppm" | "ocm";
  onAddMachine: (data: any) => void;
}

// Form schema for PPM machines
const ppmFormSchema = z.object({
  equipment: z.string().min(1, "Equipment name is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  logNo: z.string().min(1, "Log number is required"),
  q1: z.object({
    date: z.string().min(1, "Q1 date is required"),
    engineer: z.string().min(1, "Q1 engineer is required"),
  }),
  q2: z.object({
    date: z.string().min(1, "Q2 date is required"),
    engineer: z.string().min(1, "Q2 engineer is required"),
  }),
  q3: z.object({
    date: z.string().min(1, "Q3 date is required"),
    engineer: z.string().min(1, "Q3 engineer is required"),
  }),
  q4: z.object({
    date: z.string().min(1, "Q4 date is required"),
    engineer: z.string().min(1, "Q4 engineer is required"),
  }),
});

// Form schema for OCM machines
const ocmFormSchema = z.object({
  equipment: z.string().min(1, "Equipment name is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  logNo: z.string().min(1, "Log number is required"),
  maintenanceDate: z.string().min(1, "Maintenance date is required"),
});

export const AddMachineDialog = ({ type, onAddMachine }: AddMachineDialogProps) => {
  const formSchema = type === "ppm" ? ppmFormSchema : ocmFormSchema;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: type === "ppm" ? {
      equipment: "",
      model: "",
      serialNumber: "",
      manufacturer: "",
      logNo: "",
      q1: { date: "", engineer: "" },
      q2: { date: "", engineer: "" },
      q3: { date: "", engineer: "" },
      q4: { date: "", engineer: "" },
    } : {
      equipment: "",
      model: "",
      serialNumber: "",
      manufacturer: "",
      logNo: "",
      maintenanceDate: "",
    },
  });

  const onSubmit = (data: any) => {
    try {
      onAddMachine(data);
      toast.success(`${type.toUpperCase()} machine added successfully`);
    } catch (error) {
      toast.error("Failed to add machine");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-4">
          <Plus className="mr-2 h-4 w-4" />
          Add {type.toUpperCase()} Machine
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New {type.toUpperCase()} Machine</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="equipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter equipment name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter model" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter serial number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter manufacturer" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="logNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Log Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter log number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {type === "ppm" ? (
              <>
                {[1, 2, 3, 4].map((quarter) => (
                  <div key={quarter} className="grid gap-4 md:grid-cols-2 border-t pt-4">
                    <FormField
                      control={form.control}
                      name={`q${quarter}.date` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Q{quarter} Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`q${quarter}.engineer` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Q{quarter} Engineer</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter engineer name" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </>
            ) : (
              <FormField
                control={form.control}
                name="maintenanceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maintenance Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end">
              <Button type="submit">Add Machine</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
