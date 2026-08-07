import { Inject, Injectable } from '@nestjs/common';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { alertEvents } from '@/db/schema/alerts.schema';
import { geofences } from '@/db/schema/geofences.schema';
import type { GeofenceState } from '@/pipeline/geofence-eval';
import type {
  ActiveGeofenceForEval,
  AlertsEngineStore,
  CloseOpenAlertInput,
  OpenAlertInput,
} from './alerts-engine-store';

const ANTI_SPAM_CONSTRAINT = 'alert_events_open_anti_spam_idx';

/**
 * Implementacion Drizzle del puerto del worker (D2). `openAlert()` traduce
 * 23505 del mismo patron que translateUniqueViolation() de
 * device.drizzle.repository.ts (#7) — reutiliza el patron, no la funcion
 * (vive en otro modulo, sin exportar). Cobertura contra Postgres real en
 * test/alerts-engine.e2e-spec.ts (R18), mismo criterio que
 * IngestionDrizzleStore (#8): sin spec unitario propio.
 */
@Injectable()
export class AlertsEngineDrizzleStore implements AlertsEngineStore {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async listActiveGeofencesForPet(
    petId: string,
  ): Promise<ActiveGeofenceForEval[]> {
    const rows = await this.db
      .select()
      .from(geofences)
      .where(and(eq(geofences.petId, petId), eq(geofences.active, true)));

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      centerLat: row.geometry.centerLat,
      centerLng: row.geometry.centerLng,
      radiusM: row.geometry.radiusM,
      state: {
        state: row.geofenceState.state,
        updatedAt: row.geofenceState.updatedAt,
      },
    }));
  }

  async updateGeofenceState(
    geofenceId: string,
    state: GeofenceState,
  ): Promise<void> {
    await this.db
      .update(geofences)
      .set({ geofenceState: state, updatedAt: new Date() })
      .where(eq(geofences.id, geofenceId));
  }

  async openAlert(input: OpenAlertInput): Promise<{ id: string } | null> {
    try {
      const [row] = await this.db
        .insert(alertEvents)
        .values({
          id: uuidv7(),
          petId: input.petId,
          geofenceId: input.geofenceId,
          type: input.type,
          payload: input.payload,
          openedAt: input.openedAt,
        })
        .returning({ id: alertEvents.id });

      return row ?? null;
    } catch (error) {
      if (isAntiSpamViolation(error)) {
        return null;
      }
      throw error;
    }
  }

  async closeOpenAlert(
    input: CloseOpenAlertInput,
  ): Promise<{ id: string } | null> {
    const geofenceCondition =
      input.geofenceId === null
        ? isNull(alertEvents.geofenceId)
        : eq(alertEvents.geofenceId, input.geofenceId);

    const rows = await this.db
      .update(alertEvents)
      .set({ status: 'closed', closedAt: input.closedAt })
      .where(
        and(
          eq(alertEvents.petId, input.petId),
          eq(alertEvents.type, input.type),
          // #13 R23/D1: "activa" = "no cerrada". Sin `acked` en el filtro, la
          // alerta que el usuario acuso quedaria colgada para siempre y su
          // `alert_resolved` no se encolaria nunca.
          inArray(alertEvents.status, ['open', 'acked']),
          geofenceCondition,
        ),
      )
      .returning({ id: alertEvents.id });

    return rows[0] ?? null;
  }
}

/**
 * Desenvuelve el error de pg (drizzle lo anida en `cause`) y confirma que
 * la violacion de unicidad es la del indice anti-spam de R2 — mismo patron
 * que findPgError() de device.drizzle.repository.ts / geofence.drizzle.
 * repository.ts.
 */
function isAntiSpamViolation(error: unknown): boolean {
  const pgError = findPgError(error);
  return (
    pgError?.code === '23505' && pgError.constraint === ANTI_SPAM_CONSTRAINT
  );
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
