import { z } from 'zod';
import {
  DEVICE_IDENTIFIER_FIELDS,
  DeviceIdentifier,
} from '@/modules/devices/domain/repositories/device.repository';

/** Identificador de device: string no vacio de hasta 64 chars (R4). */
const IdentifierSchema = z.string().trim().min(1).max(64);

/**
 * POST /v1/devices/claim (R4): petId UUID + exactamente uno de los cuatro
 * identificadores de device — misma tecnica XOR que birthDate/approxAgeMonths
 * de pets-crud-permissions (#5).
 */
export const ClaimDeviceSchema = z
  .object({
    petId: z.uuid(),
    esn: IdentifierSchema.optional(),
    imei: IdentifierSchema.optional(),
    serialNumber: IdentifierSchema.optional(),
    activationCode: IdentifierSchema.optional(),
  })
  .superRefine((data, ctx) => {
    const present = DEVICE_IDENTIFIER_FIELDS.filter(
      (field) => data[field] !== undefined,
    );

    if (present.length !== 1) {
      ctx.addIssue({
        code: 'custom',
        path: ['esn'],
        message:
          'Exactly one of esn, imei, serialNumber or activationCode is required',
      });
    }
  });

export type ClaimDeviceDto = z.infer<typeof ClaimDeviceSchema>;

/** El schema garantiza exactamente un identificador presente (R4). */
export function toDeviceIdentifier(dto: ClaimDeviceDto): DeviceIdentifier {
  for (const field of DEVICE_IDENTIFIER_FIELDS) {
    const value = dto[field];

    if (value !== undefined) {
      return { field, value };
    }
  }

  throw new Error('ClaimDeviceDto without device identifier');
}
