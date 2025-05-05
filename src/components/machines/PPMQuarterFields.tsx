
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PPMFormData } from "./PPMFormSchema";

interface PPMQuarterFieldsProps {
  form: UseFormReturn<PPMFormData>;
  quarter: "q1" | "q2" | "q3" | "q4";
  title: string;
}

export function PPMQuarterFields({ form, quarter, title }: PPMQuarterFieldsProps) {
  const dateField = `${quarter}_date` as const;
  const engineerField = `${quarter}_engineer` as const;
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">{title}</h3>
      <FormField
        control={form.control}
        name={dateField}
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
        name={engineerField}
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
  );
}
