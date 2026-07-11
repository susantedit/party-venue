import { z } from 'zod';

export const bookingSchema = z
  .object({
    customerName: z.string().min(1).max(100),
    phone: z
      .string()
      .regex(/^[0-9+\-\s]{7,20}$/, 'Phone must be 7–20 digits'),
    email: z.string().email(),
    eventType: z.enum([
      'Wedding', 'Reception', 'Birthday', 'Bratabandha',
      'Pasni', 'Corporate', 'Catering', 'Decoration', 'Other',
    ]),
    eventDate: z.string().refine(
      (s) => {
        const d = new Date(s);
        return !isNaN(d.getTime()) && d >= new Date(new Date().toDateString());
      },
      { message: 'eventDate must be a valid future date' },
    ),
    shift: z.enum(['Morning', 'Evening', 'Whole_Day']).default('Whole_Day'),
    guestCount: z.number().int().min(1, 'Guest count must be at least 1'),
    packageId: z.string().optional(),
    cateringRequired: z.boolean().optional(),
    decorationRequired: z.boolean().optional(),
    notes: z.string().max(1000).optional(),
    estimatedPrice: z.number().optional(),
  })
  .strict();

export type BookingInput = z.infer<typeof bookingSchema>;
