import { z } from "zod";

export const enquireSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  phone: z
    .string()
    .regex(/^[+0-9\s\-()]{7,}$/, "Enter a valid phone number"),
  business: z.string().max(160).optional().nullable(),
  requirement: z.string().min(1, "Please choose a product").max(160),
  quantity: z.string().max(80).optional().nullable(),
  time: z.string().max(60).optional().nullable(),
  notes: z.string().max(800).optional().nullable(),
});

export type EnquireInput = z.infer<typeof enquireSchema>;
