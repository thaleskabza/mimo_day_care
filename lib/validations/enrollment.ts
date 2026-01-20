import { z } from "zod";

export const createEnrollmentSchema = z.object({
  applicationId: z.string().cuid("Invalid application ID"),
  classId: z.string().cuid("Invalid class ID"),
  startDate: z.string().refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, "Invalid start date"),
  endDate: z.string().refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, "Invalid end date").optional(),
});

export const updateEnrollmentStatusSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "PAUSED", "ENDED"]),
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollmentStatusInput = z.infer<typeof updateEnrollmentStatusSchema>;
