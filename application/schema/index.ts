import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string(),
});

export const appraisalTemplateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string(),
});

export const employeeFormSchema = z.object({
  name: z.string().min(1, {
    message: "Required",
  }),
  email: z.string().email(),
  role: z.string().min(1, {
    message: "Required",
  }),
  departmentName: z.string().min(1, {
    message: "Required",
  }),
  managerId: z.string(),
});

export const automationSchema = z.object({
  name: z.string().min(1, {
    message: "Automation name is required",
  }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
  templateId: z.string().min(1, { message: "Template is required" }),
  department: z.array(z.string()).min(1, {
    message: "At least one department must be selected",
  }),
  startDate: z.date().min(new Date()),
});
