import { z } from 'zod';
import {
  DEVICE_IDENTIFIER_FIELDS,
  DeviceIdentifier,
} from '@/modules/devices/domain/repositories/device.repository';

/** Codigo de activacion: string no vacio de hasta 64 chars (#26 R1). */
const ActivationCodeSchema = z.string().trim().min(1).max(64);

/**
 * POST /v1/devices/claim: petId UUID + activationCode como unica credencial.
 * Las claves desconocidas se descartan en silencio (#26 R1, D1).
 */
export const ClaimDeviceSchema = z.object({
  petId: z.uuid(),
  activationCode: ActivationCodeSchema,
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
