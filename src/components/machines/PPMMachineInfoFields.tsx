
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PPMFormData } from "./PPMFormSchema";

interface PPMMachineInfoFieldsProps {
  form: UseFormReturn<PPMFormData>;
}

export function PPMMachineInfoFields({ form }: PPMMachineInfoFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <FormField
        control={form.control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Department</FormLabel>
            <FormControl>
              <Input placeholder="Department" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
