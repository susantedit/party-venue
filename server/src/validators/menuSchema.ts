import { z } from 'zod'

export const menuSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['nepali','newari','indian','chinese','bbq','dessert','beverage']),
  description: z.string().optional(),
  image: z.string().optional(),
  price: z.number().optional(),
  available: z.boolean().optional()
}).strict()
