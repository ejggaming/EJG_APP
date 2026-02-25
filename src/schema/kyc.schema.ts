import { z } from "zod";

const imageFile = z
  .custom<File>((v) => v instanceof File, "File is required")
  .refine((f) => f.size <= 5 * 1024 * 1024, "File must be under 5MB")
  .refine(
    (f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type),
    "Only JPG, PNG, or WebP allowed",
  );

export const kycSubmitSchema = z.object({
  idType: z.string().min(1, "Select an ID type"),
  idNumber: z.string().min(1, "Enter your ID number"),
  idFront: imageFile,
  selfie: imageFile,
});

export type KycSubmitInput = z.infer<typeof kycSubmitSchema>;
