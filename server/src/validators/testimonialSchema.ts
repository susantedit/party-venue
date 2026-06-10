import { z } from 'zod';

export const testimonialSchema = z
  .object({
    customerName: z.string().min(1).max(100),
    designation: z.string().max(100).optional(),
    rating: z
      .number()
      .int('Rating must be an integer')
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
    review: z.string().min(1).max(2000),
    image: z.string().optional(),
    featured: z.boolean().optional(),
  })
  .strict();

export type TestimonialInput = z.infer<typeof testimonialSchema>;
