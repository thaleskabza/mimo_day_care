import { z } from "zod";
import { ApplicationStatus } from "@/generated/prisma";

/**
 * Application creation validation schema
 */
export const createApplicationSchema = z.object({
  childId: z.string().cuid("Invalid child ID"),
  programId: z.string().cuid("Invalid program ID"),
});

/**
 * Application status update validation schema
 */
export const updateApplicationStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
  adminNotes: z.string().optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
