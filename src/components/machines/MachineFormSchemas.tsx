
import { z } from "zod";

// Form schema for PPM machines
export const ppmFormSchema = z.object({
  equipment: z.string().min(1, "Equipment name is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  logNo: z.string().min(1, "Log number is required"),
  department: z.string().min(1, "Department is required"),
  type: z.enum(["PPM", "OCM"]).default("PPM"),
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
export const ocmFormSchema = z.object({
  equipment: z.string().min(1, "Equipment name is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  logNo: z.string().min(1, "Log number is required"),
  department: z.string().min(1, "Department is required"),
  type: z.enum(["PPM", "OCM"]).default("OCM"),
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

export type PPMFormData = z.infer<typeof ppmFormSchema>;
export type OCMFormData = z.infer<typeof ocmFormSchema>;
