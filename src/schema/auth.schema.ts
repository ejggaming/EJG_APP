import { z } from "zod";

export const loginSchema = z.object({
  mobile: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(13, "Mobile number is too long")
    .regex(/^(\+?63|0)?9\d{9}$/, "Enter a valid Philippine mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    mobile: z
      .string()
      .min(10, "Mobile number must be at least 10 digits")
      .max(13, "Mobile number is too long")
      .regex(/^(\+?63|0)?9\d{9}$/, "Enter a valid Philippine mobile number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must have at least one uppercase letter")
      .regex(/[0-9]/, "Password must have at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});

export type OtpInput = z.infer<typeof otpSchema>;
