import { z } from 'zod';
import { PetFieldsSchema } from './create-pet.dto';

/**
 * PATCH /v1/pets/:petId (R13, R14): todos los campos opcionales con las
 * mismas reglas que el alta (R4); un body vacio valida (no-op de R15).
 * A diferencia del POST, cero campos de edad es valido ("no toco la
 * edad") — solo se rechaza enviar birthDate y approxAgeMonths a la vez.
 */
export const UpdatePetSchema = PetFieldsSchema.partial().superRefine(
  (data, ctx) => {
    if (data.birthDate !== undefined && data.approxAgeMonths !== undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['birthDate'],
        message: 'birthDate and approxAgeMonths are mutually exclusive',
      });
    }
  },
);

export type UpdatePetDto = z.infer<typeof UpdatePetSchema>;
