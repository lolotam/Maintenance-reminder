
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MachineInfoFields } from "./MachineInfoFields";

interface AddOCMFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
}

export function AddOCMForm({ form, onSubmit }: AddOCMFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <MachineInfoFields form={form} />

      <div className="space-y-4">
        {[2024, 2025].map((year) => (
          <div key={year} className="grid gap-4 md:grid-cols-2 border-t pt-4">
            <FormField
              control={form.control}
              name={`maintenance${year}.date`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{year} Maintenance Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`maintenance${year}.engineer`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{year} Engineer</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter engineer name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ))}
        <div className="grid gap-4 md:grid-cols-2 border-t pt-4">
          <FormField
            control={form.control}
            name="maintenance2026.date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>2026 Maintenance Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maintenance2026.engineer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>2026 Engineer</FormLabel>
                <FormControl>
                  <Input placeholder="Enter engineer name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Add Machine</Button>
      </div>
    </form>
  );
}
