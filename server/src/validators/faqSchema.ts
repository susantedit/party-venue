import { z } from 'zod';

export const faqSchema = z
  .object({
    question: z.string().min(1).max(300),
    answer: z.string().min(1).max(2000),
    order: z.number().int().min(0).optional(),
    isPublished: z.boolean().optional(),
  })
  .strict();

export type FAQInput = z.infer<typeof faqSchema>;
