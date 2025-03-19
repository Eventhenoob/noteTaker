import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

export const createUserValidator = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must not exceed 30 characters")
    .trim(),
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  password: passwordSchema,
});

export const updateUserValidator = createUserValidator.partial();

export type CreateUserInput = z.infer<typeof createUserValidator>;
export type UpdateUserInput = z.infer<typeof updateUserValidator>;
