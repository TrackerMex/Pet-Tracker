import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
  email: z.email().max(320),
});

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;
