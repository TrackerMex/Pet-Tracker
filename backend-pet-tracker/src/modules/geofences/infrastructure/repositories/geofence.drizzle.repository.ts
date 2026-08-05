import { Inject, Injectable } from '@nestjs/common';
import { and, asc, count, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { GeofenceCircleColumn, geofences } from '@/db/schema/geofences.schema';
import {
  Geofence,
  GeofenceType,
} from '@/modules/geofences/domain/entities/geofence.entity';
import { GeofenceNameTakenError } from '@/modules/geofences/domain/errors/geofence.errors';
import {
  GeofenceFieldChanges,
  GeofenceRepository,
  NewGeofence,
} from '@/modules/geofences/domain/repositories/geofence.repository';

type GeofenceRow = typeof geofences.$inferSelect;

const NAME_UNIQUE_CONSTRAINT = 'geofences_pet_id_name_idx';

@Injectable()
export class GeofenceDrizzleRepository implements GeofenceRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async countByPet(petId: string): Promise<number> {
    const [row] = await this.db
      .select({ value: count() })
      .from(geofences)
      .where(eq(geofences.petId, petId));

    return row?.value ?? 0;
  }

  async findByNameAndPet(
    petId: string,
    name: string,
  ): Promise<Geofence | null> {
    const rows = await this.db
      .select()
      .from(geofences)
      .where(and(eq(geofences.petId, petId), eq(geofences.name, name)))
      .limit(1);

    return rows[0] ? toDomain(rows[0]) : null;
  }

  async create(data: NewGeofence): Promise<Geofence> {
    try {
      const [row] = await this.db
        .insert(geofences)
        .values({
          id: uuidv7(),
          petId: data.petId,
          name: data.name,
          type: data.type,
          geometry: {
            shape: 'circle',
            centerLat: data.centerLat,
            centerLng: data.centerLng,
            radiusM: data.radiusM,
          },
          active: data.active,
        })
        .returning();

      return toDomain(row);
    } catch (error) {
      throw translateUniqueViolation(error, data.petId, data.name);
    }
  }

  async findAllByPet(petId: string): Promise<Geofence[]> {
    const rows = await this.db
      .select()
      .from(geofences)
      .where(eq(geofences.petId, petId))
      .orderBy(asc(geofences.createdAt));

    return rows.map(toDomain);
  }

  async findByIdAndPet(id: string, petId: string): Promise<Geofence | null> {
    const rows = await this.db
      .select()
      .from(geofences)
      .where(and(eq(geofences.id, id), eq(geofences.petId, petId)))
      .limit(1);

    return rows[0] ? toDomain(rows[0]) : null;
  }

  async update(id: string, changes: GeofenceFieldChanges): Promise<Geofence> {
    const { centerLat, centerLng, radiusM, ...columns } = changes;
    const geometryChanges =
      centerLat !== undefined ||
      centerLng !== undefined ||
      radiusM !== undefined;

    // centerLat/centerLng/radiusM comparten el jsonb `geometry`: si el
    // caller toca cualquiera, se lee el geometry actual para mergear los
    // campos ausentes — el resto de la fila no necesita este paso extra.
    const geometry = geometryChanges
      ? await this.mergedGeometry(id, { centerLat, centerLng, radiusM })
      : undefined;

    try {
      const [row] = await this.db
        .update(geofences)
        .set({
          ...columns,
          ...(geometry ? { geometry } : {}),
          updatedAt: new Date(),
        })
        .where(eq(geofences.id, id))
        .returning();

      return toDomain(row);
    } catch (error) {
      throw translateUniqueViolation(error, undefined, columns.name);
    }
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(geofences).where(eq(geofences.id, id));
  }

  private async mergedGeometry(
    id: string,
    partial: Partial<
      Pick<GeofenceCircleColumn, 'centerLat' | 'centerLng' | 'radiusM'>
    >,
  ): Promise<GeofenceCircleColumn> {
    const [row] = await this.db
      .select({ geometry: geofences.geometry })
      .from(geofences)
      .where(eq(geofences.id, id));

    return {
      shape: 'circle',
      centerLat: partial.centerLat ?? row.geometry.centerLat,
      centerLng: partial.centerLng ?? row.geometry.centerLng,
      radiusM: partial.radiusM ?? row.geometry.radiusM,
    };
  }
}

function toDomain(row: GeofenceRow): Geofence {
  return new Geofence({
    id: row.id,
    petId: row.petId,
    name: row.name,
    type: row.type as GeofenceType,
    centerLat: row.geometry.centerLat,
    centerLng: row.geometry.centerLng,
    radiusM: row.geometry.radiusM,
    active: row.active,
    state: {
      state: row.geofenceState.state,
      updatedAt: row.geofenceState.updatedAt,
    },
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

/**
 * Desenvuelve el error de pg (drizzle lo anida en `cause`) y traduce la
 * violacion de unicidad del indice (pet_id, name) al error de dominio de R7
 * — mismo patron que device.drizzle.repository.ts. `petId` puede faltar en
 * el flujo de update() (no forma parte de GeofenceFieldChanges); el mensaje
 * de error solo lo usa si esta disponible.
 */
function translateUniqueViolation(
  error: unknown,
  petId: string | undefined,
  name: string | undefined,
): unknown {
  const pgError = findPgError(error);

  if (
    pgError?.code === '23505' &&
    pgError.constraint === NAME_UNIQUE_CONSTRAINT
  ) {
    return new GeofenceNameTakenError(petId ?? 'unknown', name ?? 'unknown');
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
