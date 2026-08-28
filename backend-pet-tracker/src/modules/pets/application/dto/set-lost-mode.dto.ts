import { z } from 'zod';

export const SetLostModeSchema = z.object({
  enabled: z.boolean(),
});

export type SetLostModeDto = z.infer<typeof SetLostModeSchema>;
