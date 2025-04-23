
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
  q1_date: z.string().min(1, "Q1 date is required"),
  q1_engineer: z.string().min(1, "Q1 engineer is required"),
  q2_date: z.string().optional(),
  q2_engineer: z.string().min(1, "Q2 engineer is required"),
  q3_date: z.string().optional(),
  q3_engineer: z.string().min(1, "Q3 engineer is required"),
  q4_date: z.string().optional(),
  q4_engineer: z.string().min(1, "Q4 engineer is required"),
});

// Updated OCM Form schema with multi-year maintenance
const ocmFormSchema = z.object({
  equipment: z.string().min(1, "Equipment name is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  logNo: z.string().min(1, "Log number is required"),
  maintenance2024: z.object({
    date: z.string().min(1, "2024 maintenance date is required"),
    engineer: z.string().min(1, "2024 engineer is required"),
  }),
  maintenance2025: z.object({
    date: z.string().min(1, "2025 maintenance date is required"),
    engineer: z.string().min(1, "2025 engineer is required"),
  }),
  maintenance2026: z.object({
    date: z.string().optional(),
    engineer: z.string().min(1, "2026 engineer is required"),
  }),
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
      toast.success(`${type.toUpperCase()} machine added successfully`);
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
                      name={dateName as any}
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
                      name={engineerName as any}
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
            ) : (
              <div className="space-y-4">
                {[2024, 2025].map((year) => (
                  <div key={year} className="grid gap-4 md:grid-cols-2 border-t pt-4">
                    <FormField
                      control={form.control}
                      name={`maintenance${year}.date` as any}
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
                      name={`maintenance${year}.engineer` as any}
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
                    name="maintenance2026.date" as any
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
                    name="maintenance2026.engineer" as any
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
