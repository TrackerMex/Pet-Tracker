import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { devices, petDevices } from '@/db/schema/devices.schema';
import {
  Device,
  DeviceStatus,
} from '@/modules/devices/domain/entities/device.entity';
import {
  DeviceAlreadyAssignedError,
  PetAlreadyHasDeviceError,
} from '@/modules/devices/domain/errors/device.errors';
import {
  ActivePetDevice,
  DeviceIdentifier,
  DeviceRepository,
} from '@/modules/devices/domain/repositories/device.repository';

type DeviceRow = typeof devices.$inferSelect;

/** Columna UNIQUE de `devices` para cada identificador del claim (D4). */
const IDENTIFIER_COLUMNS = {
  esn: devices.esn,
  imei: devices.imei,
  serialNumber: devices.serialNumber,
  activationCode: devices.activationCode,
} as const;

@Injectable()
export class DeviceDrizzleRepository implements DeviceRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async findByIdentifier(identifier: DeviceIdentifier): Promise<Device | null> {
    const rows = await this.db
      .select()
      .from(devices)
      .where(eq(IDENTIFIER_COLUMNS[identifier.field], identifier.value))
      .limit(1);

    return rows[0] ? toDomain(rows[0]) : null;
  }

  async hasActiveAssignment(deviceId: string): Promise<boolean> {
    const rows = await this.db
      .select({ id: petDevices.id })
      .from(petDevices)
      .where(
        and(eq(petDevices.deviceId, deviceId), isNull(petDevices.releasedAt)),
      )
      .limit(1);

    return rows.length > 0;
  }

  async findActiveByPetId(petId: string): Promise<ActivePetDevice | null> {
    const rows = await this.db
      .select({ assignment: petDevices, device: devices })
      .from(petDevices)
      .innerJoin(devices, eq(petDevices.deviceId, devices.id))
      .where(and(eq(petDevices.petId, petId), isNull(petDevices.releasedAt)))
      .limit(1);

    const row = rows[0];

    if (!row) {
      return null;
    }

    return { assignmentId: row.assignment.id, device: toDomain(row.device) };
  }

  async claim(
    deviceId: string,
    petId: string,
    ingestWatermark: Date,
  ): Promise<void> {
    try {
      // R3: asignacion + cache de status atomicos — si cualquiera falla,
      // Postgres revierte ambos.
      await this.db.transaction(async (tx) => {
        await tx.insert(petDevices).values({
          id: uuidv7(),
          petId,
          deviceId,
        });

        await tx
          .update(devices)
          .set({ status: 'assigned', ingestWatermark, updatedAt: new Date() })
          .where(eq(devices.id, deviceId));
      });
    } catch (error) {
      // R8: la carrera de claims la decide el indice unico parcial — la
      // violacion 23505 se traduce al mismo error de dominio que el check
      // previo, nunca un 500.
      throw translateUniqueViolation(error, deviceId, petId);
    }
  }

  async release(assignmentId: string, deviceId: string): Promise<void> {
    // R13: cierre del historial + cache de status atomicos.
    await this.db.transaction(async (tx) => {
      await tx
        .update(petDevices)
        .set({ releasedAt: new Date() })
        .where(eq(petDevices.id, assignmentId));

      await tx
        .update(devices)
        .set({ status: 'available', updatedAt: new Date() })
        .where(eq(devices.id, deviceId));
    });
  }
}

function toDomain(row: DeviceRow): Device {
  return new Device({
    id: row.id,
    esn: row.esn ?? null,
    imei: row.imei ?? null,
    serialNumber: row.serialNumber ?? null,
    activationCode: row.activationCode ?? null,
    wialonUnitId: row.wialonUnitId ?? null,
    model: row.model ?? null,
    status: row.status as DeviceStatus,
    batteryPct: row.batteryPct ?? null,
    connectivity: row.connectivity ?? null,
    lastMessageAt: row.lastMessageAt ?? null,
    ingestWatermark: row.ingestWatermark ?? null,
    isSimulated: row.isSimulated,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

/**
 * Desenvuelve el error de pg (drizzle lo anida en `cause`) y traduce la
 * violacion de unicidad de los indices parciales de R1 al error de dominio
 * correspondiente; cualquier otro error se propaga intacto.
 */
function translateUniqueViolation(
  error: unknown,
  deviceId: string,
  petId: string,
): unknown {
  const pgError = findPgError(error);

  if (pgError?.code === '23505') {
    if (pgError.constraint === 'pet_devices_active_device_id_idx') {
      return new DeviceAlreadyAssignedError(deviceId);
    }

    if (pgError.constraint === 'pet_devices_active_pet_id_idx') {
      return new PetAlreadyHasDeviceError(petId);
    }
  }

  return error;
}

function findPgError(
  error: unknown,
): { code: string; constraint?: string } | null {
  let current: unknown = error;

  while (current instanceof Error) {
    const candidate = current as Error & {
      code?: unknown;
      constraint?: unknown;
    };

    if (typeof candidate.code === 'string') {
      return {
        code: candidate.code,
        constraint:
          typeof candidate.constraint === 'string'
            ? candidate.constraint
            : undefined,
      };
    }

    current = candidate.cause;
  }

  return null;
}
