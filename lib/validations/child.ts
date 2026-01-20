import { z } from "zod";

/**
 * Child creation validation schema
 */
export const createChildSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dob: z.string().refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed < new Date();
  }, "Invalid date of birth"),
  medicalNotes: z.string().optional(),
  allergies: z.string().optional(),
  pickupList: z.array(z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string(),
  })).optional(),
});

/**
 * Child update validation schema
 */
export const updateChildSchema = createChildSchema.partial();

export type CreateChildInput = z.infer<typeof createChildSchema>;
export type UpdateChildInput = z.infer<typeof updateChildSchema>;
