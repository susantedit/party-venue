import { z } from 'zod';

export const blogSchema = z
  .object({
    title: z.string().min(1).max(200),
    content: z.string().min(1),
    excerpt: z.string().min(1).max(300),
    featuredImage: z.string().url('featuredImage must be a valid URL'),
    category: z.string().min(1),
    author: z.string().min(1),
    seoTitle: z.string().max(60).optional(),
    seoDescription: z.string().max(160).optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional(),
    slug: z.string().optional(), // Auto-generated if not provided
  })
  .strict();

export type BlogInput = z.infer<typeof blogSchema>;
