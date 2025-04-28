
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PPMMachine } from "@/types/machines";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  equipment: z.string().min(1, "Equipment name is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  logNo: z.string().min(1, "Log number is required"),
  q1_date: z.string().min(1, "Q1 date is required"),
  q1_engineer: z.string().min(1, "Q1 engineer is required"),
  q2_date: z.string().min(1, "Q2 date is required"),
  q2_engineer: z.string().min(1, "Q2 engineer is required"),
  q3_date: z.string().min(1, "Q3 date is required"),
  q3_engineer: z.string().min(1, "Q3 engineer is required"),
  q4_date: z.string().min(1, "Q4 date is required"),
  q4_engineer: z.string().min(1, "Q4 engineer is required"),
});

type FormData = z.infer<typeof formSchema>;

interface EditPPMMachineFormProps {
  machine: PPMMachine | null;
  onSave: (machine: PPMMachine) => void;
  onCancel: () => void;
}

export function EditPPMMachineForm({ machine, onSave, onCancel }: EditPPMMachineFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: machine ? {
      equipment: machine.equipment,
      model: machine.model,
      serialNumber: machine.serialNumber,
      manufacturer: machine.manufacturer,
      logNo: machine.logNo,
      q1_date: machine.q1.date,
      q1_engineer: machine.q1.engineer,
      q2_date: machine.q2.date,
      q2_engineer: machine.q2.engineer,
      q3_date: machine.q3.date,
      q3_engineer: machine.q3.engineer,
      q4_date: machine.q4.date,
      q4_engineer: machine.q4.engineer,
    } : undefined,
  });

  const onSubmit = (data: FormData) => {
    if (!machine) return;
    
    onSave({
      ...machine,
      equipment: data.equipment,
      model: data.model,
      serialNumber: data.serialNumber,
      manufacturer: data.manufacturer,
      logNo: data.logNo,
      q1: { date: data.q1_date, engineer: data.q1_engineer },
      q2: { date: data.q2_date, engineer: data.q2_engineer },
      q3: { date: data.q3_date, engineer: data.q3_engineer },
      q4: { date: data.q4_date, engineer: data.q4_engineer },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            name="serialNumber"
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
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-4">
            <h3 className="font-medium">Q1</h3>
            <FormField
              control={form.control}
              name="q1_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="q1_engineer"
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
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Q2</h3>
            <FormField
              control={form.control}
              name="q2_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="q2_engineer"
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
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Q3</h3>
            <FormField
              control={form.control}
              name="q3_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="q3_engineer"
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
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Q4</h3>
            <FormField
              control={form.control}
              name="q4_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="q4_engineer"
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
          </div>
        </div>

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
