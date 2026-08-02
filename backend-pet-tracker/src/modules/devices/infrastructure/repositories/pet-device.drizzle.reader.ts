import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { devices, petDevices } from '@/db/schema/devices.schema';
import type {
  ActivePetDeviceStatus,
  PetDeviceReader,
} from '@/modules/pets/domain/ports/pet-device-reader';

/**
 * Implementacion del puerto PET_DEVICE_READER de pets (R12). Vive en
 * devices porque el schema es suyo, pero solo depende de DRIZZLE — se
 * registra en PetDeviceReadModule para que PetsModule la importe sin ciclo.
 */
@Injectable()
export class PetDeviceDrizzleReader implements PetDeviceReader {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async findActiveDevice(petId: string): Promise<ActivePetDeviceStatus | null> {
    const rows = await this.db
      .select({ device: devices })
      .from(petDevices)
      .innerJoin(devices, eq(petDevices.deviceId, devices.id))
      .where(and(eq(petDevices.petId, petId), isNull(petDevices.releasedAt)))
      .limit(1);

    const row = rows[0];

    if (!row) {
      return null;
    }

    return {
      model: row.device.model ?? null,
      batteryPct: row.device.batteryPct ?? null,
      connectivity: row.device.connectivity ?? null,
      lastMessageAt: row.device.lastMessageAt ?? null,
      esn: row.device.esn ?? null,
    };
  }
}
