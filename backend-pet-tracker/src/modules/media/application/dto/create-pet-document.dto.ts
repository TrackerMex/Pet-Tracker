import { z } from 'zod';
import { IsoDateSchema } from '@/modules/health/application/dto/iso-date';

export const CreatePetDocumentSchema = z.object({
  type: z.string().trim().min(1).max(40),
  name: z.string().trim().min(1).max(120),
  date: IsoDateSchema,
  vet: z.string().trim().min(1).max(120).optional(),
});

export type CreatePetDocumentDto = z.infer<typeof CreatePetDocumentSchema>;
