
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

// List of departments from the provided image
export const departments = [
  "IM",
  "Sheet1",
  "ENT",
  "OPTHA",
  "DERMA",
  "ENDOSCOPY",
  "NURSERY",
  "OB-GYN",
  "X-RAY",
  "OR",
  "LABORATORY",
  "ER",
  "PT",
  "IVF",
  "GENERAL SURGERY",
  "DENTAL",
  "CSSD",
  "LDR",
  "5 A",
  "5 B",
  "6 A",
  "6 B",
  "LAUNDRY",
  "4A",
  "4 B",
  "PEDIA",
  "PLASTIC"
];
