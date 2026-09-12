import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long")
      .trim()
      .optional(),

    email: z
      .email("Invalid email address")
      .transform((email) => email.toLowerCase().trim())
      .optional(),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(8, "Please confirm your password"),

    role: z.enum(["user", "admin"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim(),

  email: z
    .email("Invalid email address")
    .transform((email) => email.toLowerCase().trim())
    .optional(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),

  role: z.enum(["user", "admin"]).optional(),
});
