import { z } from 'zod';

export const DeleteAccountSchema = z.strictObject({
  password: z.string().min(1),
});
export type DeleteAccountDto = z.infer<typeof DeleteAccountSchema>;
