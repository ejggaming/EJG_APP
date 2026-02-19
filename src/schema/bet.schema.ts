import { z } from "zod";

export const betSchema = z.object({
  numbers: z
    .tuple([z.number().min(1).max(37), z.number().min(1).max(37)])
    .refine(([a, b]) => a !== b, { message: "Numbers must be different" }),
  amount: z.number().min(5, "Minimum bet is ₱5"),
  drawScheduleId: z.string().min(1, "Select a draw schedule"),
});

export type BetInput = z.infer<typeof betSchema>;
