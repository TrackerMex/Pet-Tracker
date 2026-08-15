import { z } from 'zod';
import { DeviceIdentifier } from '@/modules/devices/domain/repositories/device.repository';

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

/** El schema garantiza activationCode presente (#26 R1, R3). */
export function toDeviceIdentifier(dto: ClaimDeviceDto): DeviceIdentifier {
  return { field: 'activationCode', value: dto.activationCode };
}
