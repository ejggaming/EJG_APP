import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Enter a valid email address"),
    userName: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .optional()
      .or(z.literal("")),
    phoneNumber: z
      .string()
      .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128)
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
    role: z.enum(["PLAYER", "AGENT"]).default("PLAYER"),
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine((val) => {
        const dob = new Date(val);
        if (isNaN(dob.getTime())) return false;
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        const actualAge =
          m < 0 || (m === 0 && today.getDate() < dob.getDate()) ? age - 1 : age;
        return actualAge >= 18;
      }, "You must be at least 18 years old"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const verifyOtpSchema = z.object({
  email: z.email(),
  code: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
  type: z.literal("EMAIL_VERIFICATION"),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
