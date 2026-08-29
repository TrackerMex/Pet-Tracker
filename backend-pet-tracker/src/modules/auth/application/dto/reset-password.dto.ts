import { z } from 'zod';

const passwordSchema = z.string().min(8).max(128);

export const ResetPasswordSchema = z
  .object({
    token: z.string().trim().min(1).max(256),
    password: passwordSchema,
    passwordConfirmation: passwordSchema,
  })
  .refine((payload) => payload.password === payload.passwordConfirmation, {
    message: 'passwordConfirmation must match password',
    path: ['passwordConfirmation'],
  });

export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
