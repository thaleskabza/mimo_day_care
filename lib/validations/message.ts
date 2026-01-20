import { z } from "zod";

export const createThreadSchema = z.object({
  childId: z.string().cuid("Invalid child ID"),
  classId: z.string().cuid("Invalid class ID"),
});

export const createMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(5000, "Message too long"),
});

export type CreateThreadInput = z.infer<typeof createThreadSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
