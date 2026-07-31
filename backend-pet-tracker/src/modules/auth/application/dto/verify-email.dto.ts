import { z } from 'zod';

export const VerifyEmailSchema = z.object({
  token: z.string().trim().min(1).max(256),
});

export type VerifyEmailDto = z.infer<typeof VerifyEmailSchema>;
