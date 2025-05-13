
import * as z from "zod";

export const ppmMachineFormSchema = z.object({
  equipment: z.string().min(1, "Equipment name is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  logNo: z.string().min(1, "Log number is required"),
  department: z.string().optional(),
  type: z.enum(["PPM", "OCM"]).default("PPM"),
  q1_date: z.string().min(1, "Q1 date is required"),
  q1_engineer: z.string().min(1, "Q1 engineer is required"),
  q2_date: z.string().min(1, "Q2 date is required"),
  q2_engineer: z.string().min(1, "Q2 engineer is required"),
  q3_date: z.string().min(1, "Q3 date is required"),
  q3_engineer: z.string().min(1, "Q3 engineer is required"),
  q4_date: z.string().min(1, "Q4 date is required"),
  q4_engineer: z.string().min(1, "Q4 engineer is required"),
});

export type PPMFormData = z.infer<typeof ppmMachineFormSchema>;

// Updated department list in the requested order
export const departments = [
  "LDR",
  "IM",
  "ENT",
  "OPTHA",
  "DERMA",
  "ENDOSCOPY", 
  "NURSERY",
  "OB-GYN",
  "X-RAY",
  "OR",
  "ER",
  "PT",
  "IVF",
  "CSSD",
  "5 A",
  "5 B",
  "6 A",
  "6 B",
  "4A",
  "4 B",
  "DENTAL",
  "PEDIA",
  "PLASTIC",
  "LAUNDRY",
  "LABORATORY",
  "GENERAL SURGERY"
];
