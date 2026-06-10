import { z } from 'zod';

export const setRoleSchema = z
  .object({
    uid: z.string().min(1, 'Firebase UID is required'),
    role: z.enum(['super-admin', 'admin', 'editor']),
  })
  .strict();

export type SetRoleInput = z.infer<typeof setRoleSchema>;
