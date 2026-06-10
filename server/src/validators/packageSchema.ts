import { z } from 'zod';

export const packageSchema = z
  .object({
    name: z.string().min(1).max(100),
    description: z.string().min(1),
    price: z.number().nonnegative(),
    capacity: z.number().int().min(1),
    features: z.array(z.string().min(1)).min(1, 'At least one feature required'),
    category: z.enum(['silver', 'gold', 'platinum', 'custom']),
    image: z.string().optional(),
    isPopular: z.boolean().optional(),
    isActive: z.boolean().optional(),
    slug: z.string().optional(),
  })
  .strict();

export type PackageInput = z.infer<typeof packageSchema>;
