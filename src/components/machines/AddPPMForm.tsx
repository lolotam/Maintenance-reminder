
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MachineInfoFields } from "./MachineInfoFields";

interface AddPPMFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
}

export function AddPPMForm({ form, onSubmit }: AddPPMFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <MachineInfoFields form={form} />

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 border-t pt-4">
          <FormField
            control={form.control}
            name="q1_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Q1 Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="q1_engineer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Q1 Engineer</FormLabel>
                <FormControl>
                  <Input placeholder="Enter engineer name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {[
          {quarter: 2, dateName: "q2_date", engineerName: "q2_engineer"},
          {quarter: 3, dateName: "q3_date", engineerName: "q3_engineer"},
          {quarter: 4, dateName: "q4_date", engineerName: "q4_engineer"}
        ].map(({quarter, dateName, engineerName}) => (
          <div key={quarter} className="grid gap-4 md:grid-cols-2 border-t pt-4">
            <FormField
              control={form.control}
              name={dateName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Q{quarter} Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      placeholder={`Q${quarter} Date`}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={engineerName}
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
      </div>

      <div className="flex justify-end">
        <Button type="submit">Add Machine</Button>
      </div>
    </form>
  );
}
