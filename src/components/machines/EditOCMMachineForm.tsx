
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OCMMachine } from "@/types/machines";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  equipment: z.string().min(1, "Equipment name is required"),
  model: z.string().min(1, "Model is required"),
  Serial_Number: z.string().min(1, "Serial number is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  logNo: z.string().min(1, "Log number is required"),
  maintenanceDate: z.string().min(1, "Maintenance date is required"),
  engineer: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditOCMMachineFormProps {
  machine: OCMMachine | null;
  onSave: (machine: OCMMachine) => void;
  onCancel: () => void;
}

export function EditOCMMachineForm({ machine, onSave, onCancel }: EditOCMMachineFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: machine ? {
      equipment: machine.equipment,
      model: machine.model,
      Serial_Number: machine.Serial_Number,
      manufacturer: machine.manufacturer,
      logNo: machine.logNo,
      maintenanceDate: machine.maintenanceDate.toString(),
      engineer: machine.engineer,
    } : undefined,
  });

  const onSubmit = (data: FormData) => {
    if (!machine) return;
    
    onSave({
      ...machine,
      ...data,
      maintenanceDate: new Date(data.maintenanceDate),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="equipment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment</FormLabel>
              <FormControl>
                <Input placeholder="Equipment name" {...field} />
              </FormControl>
              <FormMessage />
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
                <Input placeholder="Model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Serial_Number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serial Number</FormLabel>
              <FormControl>
                <Input placeholder="Serial number" {...field} />
              </FormControl>
              <FormMessage />
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
                <Input placeholder="Manufacturer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Log No</FormLabel>
              <FormControl>
                <Input placeholder="Log number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maintenanceDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maintenance Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="engineer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Engineer</FormLabel>
              <FormControl>
                <Input placeholder="Engineer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
