import { z } from "zod";

/**
 * User registration validation schema
 */
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

/**
 * User login validation schema
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Email validation
 */
export const emailSchema = z.string().email("Invalid email address");

/**
 * ID validation (CUID format)
 */
export const idSchema = z.string().cuid("Invalid ID format");

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
