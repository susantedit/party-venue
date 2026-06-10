import { z } from 'zod';

export const inquirySchema = z
  .object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().min(7).max(20),
    subject: z.string().max(200).optional(),
    message: z.string().min(1).max(2000),
  })
  .strict();

export type InquiryInput = z.infer<typeof inquirySchema>;
