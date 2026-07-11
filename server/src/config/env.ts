import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  CLOUDINARY_NAME: z.string().min(1, 'CLOUDINARY_NAME is required'),
  CLOUDINARY_KEY: z.string().min(1, 'CLOUDINARY_KEY is required'),
  CLOUDINARY_SECRET: z.string().min(1, 'CLOUDINARY_SECRET is required'),
  // Resend (replaces Nodemailer)
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  EMAIL_FROM: z.string().default('Shree Ganesh Venue <noreply@shreeganeshsharma.com>'),
  ADMIN_NOTIFICATION_EMAIL: z.string().email('ADMIN_NOTIFICATION_EMAIL must be valid'),
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL'),
  FIREBASE_PROJECT_ID: z.string().min(1, 'FIREBASE_PROJECT_ID is required'),
  FIREBASE_CLIENT_EMAIL: z.string().email('FIREBASE_CLIENT_EMAIL must be valid'),
  FIREBASE_PRIVATE_KEY: z.string().min(1, 'FIREBASE_PRIVATE_KEY is required'),
  ADMIN_WHATSAPP_NUMBER: z.string().regex(/^977\d{9,10}$/, 'ADMIN_WHATSAPP_NUMBER must match ^977\\d{9,10}$').optional(),
  GOOGLE_PLACES_API_KEY: z.string().optional(),
  GOOGLE_PLACE_ID: z.string().optional(),
});

export const env = envSchema.parse(process.env);

if (!env.ADMIN_WHATSAPP_NUMBER) {
  console.warn('[env] ADMIN_WHATSAPP_NUMBER is not set — WhatsApp link generation is disabled');
}

export type Env = z.infer<typeof envSchema>;

if (!env.GOOGLE_PLACES_API_KEY) {
  console.warn('[env] GOOGLE_PLACES_API_KEY is not set — Google Reviews proxy will be disabled');
}
