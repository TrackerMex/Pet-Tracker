import { z } from 'zod';
export const AcceptInviteSchema = z.object({
  code: z.string().trim().min(1).max(64),
});
