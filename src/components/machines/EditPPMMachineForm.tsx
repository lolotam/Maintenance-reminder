
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PPMMachine } from "@/types/machines";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PPMMachineInfoFields } from "./PPMMachineInfoFields";
import { PPMQuarterFields } from "./PPMQuarterFields";
import { ppmMachineFormSchema, PPMFormData } from "./PPMFormSchema";

interface EditPPMMachineFormProps {
  machine: PPMMachine | null;
  onSave: (machine: PPMMachine) => void;
  onCancel: () => void;
}

export function EditPPMMachineForm({ machine, onSave, onCancel }: EditPPMMachineFormProps) {
  const form = useForm<PPMFormData>({
    resolver: zodResolver(ppmMachineFormSchema),
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

  const onSubmit = (data: PPMFormData) => {
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
        <PPMMachineInfoFields form={form} />

        <div className="grid grid-cols-4 gap-4">
          <PPMQuarterFields form={form} quarter="q1" title="Q1" />
          <PPMQuarterFields form={form} quarter="q2" title="Q2" />
          <PPMQuarterFields form={form} quarter="q3" title="Q3" />
          <PPMQuarterFields form={form} quarter="q4" title="Q4" />
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
