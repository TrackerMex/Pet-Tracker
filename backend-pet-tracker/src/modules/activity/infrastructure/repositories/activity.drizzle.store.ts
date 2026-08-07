import { Inject, Injectable, Logger } from '@nestjs/common';
import { and, asc, eq, gt, gte, isNull, lt, lte, or, sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { activityDaily } from '@/db/schema/activity.schema';
import { alertEvents } from '@/db/schema/alerts.schema';
import { petDevices } from '@/db/schema/devices.schema';
import { geofences } from '@/db/schema/geofences.schema';
import { petUsers } from '@/db/schema/pets.schema';
import { users } from '@/db/schema/users.schema';
import type {
  DailyActivityRow,
  DailyActivityUpsert,
} from '@/modules/activity/domain/entities/daily-activity.entity';
import type {
  ActivityStore,
  PetToAggregate,
} from '@/modules/activity/domain/repositories/activity-store';
import { isSupportedTimeZone } from '@/pipeline/local-day';
import type { LocalDayRange } from '@/pipeline/local-day';
import type { AwaySpan } from '@/pipeline/time-away';

const FALLBACK_TIME_ZONE = 'UTC';
const OWNER_ROLE = 'owner';
const ACTIVE_STATUS = 'active';
const AVG_WALK_MINUTES_SCALE = 2;
const GEOFENCE_EXIT_TYPE = 'geofence_exit';

/**
 * Implementacion Drizzle del puerto de actividad (D8). Cobertura contra
 * Postgres real en test/activity.e2e-spec.ts (R11, R13, R20).
 */
@Injectable()
export class ActivityDrizzleStore implements ActivityStore {
  private readonly logger = new Logger(ActivityDrizzleStore.name);

  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  /**
   * R13: una sola query. `LEFT JOIN` a proposito — una mascota con collar
   * pero sin owner activo debe SALIR en la lista (con 'UTC') en vez de
   * desaparecer del barrido. El desempate por `pet_users.created_at`
   * ascendente cubre el caso de mas de un owner activo, que nada en el
   * schema impide.
   */
  async listPetsToAggregate(): Promise<PetToAggregate[]> {
    const rows = await this.db
      .select({
        petId: petDevices.petId,
        timezone: users.timezone,
      })
      .from(petDevices)
      .leftJoin(
        petUsers,
        and(
          eq(petUsers.petId, petDevices.petId),
          eq(petUsers.role, OWNER_ROLE),
          eq(petUsers.status, ACTIVE_STATUS),
        ),
      )
      .leftJoin(users, eq(users.id, petUsers.userId))
      .where(isNull(petDevices.releasedAt))
      .orderBy(asc(petDevices.petId), asc(petUsers.createdAt));

    const resolved = new Map<string, PetToAggregate>();
    for (const row of rows) {
      if (resolved.has(row.petId)) {
        continue;
      }
      resolved.set(row.petId, {
        petId: row.petId,
        timezone: this.resolveTimeZone(row.petId, row.timezone),
      });
    }

    return [...resolved.values()];
  }

  async hasFreshRow(
    petId: string,
    date: string,
    notBeforeMs: number,
  ): Promise<boolean> {
    const rows = await this.db
      .select({ petId: activityDaily.petId })
      .from(activityDaily)
      .where(
        and(
          eq(activityDaily.petId, petId),
          eq(activityDaily.date, date),
          gt(activityDaily.computedAt, new Date(notBeforeMs)),
        ),
      )
      .limit(1);

    return rows.length > 0;
  }

  /**
   * R11: `DO UPDATE SET` con lista EXPLICITA de columnas. #13 (R28/D4) añadio
   * `time_away_minutes` con `coalesce(excluded, actual)`: un valor calculado
   * NULL (mascota que se quedo sin geocercas) **nunca** pisa un valor
   * historico bueno, asi que R11 sigue siendo literalmente verdadera.
   */
  async upsertDailyActivity(row: DailyActivityUpsert): Promise<void> {
    const computedAt = new Date();
    const values = {
      distanceM: row.distanceM,
      activeMinutes: row.activeMinutes,
      restMinutes: row.restMinutes,
      walkCount: row.walkCount,
      avgWalkMinutes: row.avgWalkMinutes.toFixed(AVG_WALK_MINUTES_SCALE),
      firstWalkAt: row.firstWalkAt,
      lastWalkAt: row.lastWalkAt,
      computedAt,
    };

    await this.db
      .insert(activityDaily)
      .values({
        petId: row.petId,
        date: row.date,
        timeAwayMinutes: row.timeAwayMinutes ?? null,
        ...values,
      })
      .onConflictDoUpdate({
        target: [activityDaily.petId, activityDaily.date],
        set: {
          ...values,
          timeAwayMinutes: sql`coalesce(excluded.time_away_minutes, ${activityDaily.timeAwayMinutes})`,
        },
      });
  }

  /**
   * R24/R25: dos consultas — la geocerca de referencia (la mas antigua, SIN
   * filtrar por `active`, D3) y los `geofence_exit` suyos que solapan el dia.
   * Las filas con `geofence_id IS NULL` (geocerca borrada, ON DELETE SET NULL
   * de #12) y las de `battery_low` quedan fuera por el propio filtro: ya no
   * son atribuibles a esta geocerca.
   */
  async findAwaySpans(
    petId: string,
    range: LocalDayRange,
  ): Promise<AwaySpan[] | null> {
    const [reference] = await this.db
      .select({ id: geofences.id })
      .from(geofences)
      .where(eq(geofences.petId, petId))
      .orderBy(asc(geofences.createdAt), asc(geofences.id))
      .limit(1);

    if (reference === undefined) {
      // R27: sin geocerca de referencia el KPI no es medible (NULL), que es
      // distinto de "medido y nunca salio" (0).
      return null;
    }

    const rows = await this.db
      .select({
        openedAt: alertEvents.openedAt,
        closedAt: alertEvents.closedAt,
      })
      .from(alertEvents)
      .where(
        and(
          eq(alertEvents.petId, petId),
          eq(alertEvents.type, GEOFENCE_EXIT_TYPE),
          eq(alertEvents.geofenceId, reference.id),
          lt(alertEvents.openedAt, new Date(range.endMs)),
          or(
            isNull(alertEvents.closedAt),
            gt(alertEvents.closedAt, new Date(range.startMs)),
          ),
        ),
      );

    return rows.map((row) => ({
      openedAtMs: row.openedAt.getTime(),
      closedAtMs: row.closedAt === null ? null : row.closedAt.getTime(),
    }));
  }

  async findDailyRange(
    petId: string,
    fromDay: string,
    toDay: string,
  ): Promise<DailyActivityRow[]> {
    const rows = await this.db
      .select()
      .from(activityDaily)
      .where(
        and(
          eq(activityDaily.petId, petId),
          gte(activityDaily.date, fromDay),
          lte(activityDaily.date, toDay),
        ),
      )
      .orderBy(asc(activityDaily.date));

    return rows.map((row) => ({
      petId: row.petId,
      date: row.date,
      distanceM: row.distanceM,
      activeMinutes: row.activeMinutes,
      restMinutes: row.restMinutes,
      walkCount: row.walkCount,
      // numeric(6,2) llega como string desde pg: se normaliza en el borde.
      avgWalkMinutes: Number(row.avgWalkMinutes),
      firstWalkAt: row.firstWalkAt,
      lastWalkAt: row.lastWalkAt,
      timeAwayMinutes: row.timeAwayMinutes,
      computedAt: row.computedAt,
    }));
  }

  async findOwnerTimezone(petId: string): Promise<string> {
    const rows = await this.db
      .select({ timezone: users.timezone })
      .from(petUsers)
      .innerJoin(users, eq(users.id, petUsers.userId))
      .where(
        and(
          eq(petUsers.petId, petId),
          eq(petUsers.role, OWNER_ROLE),
          eq(petUsers.status, ACTIVE_STATUS),
        ),
      )
      .orderBy(asc(petUsers.createdAt))
      .limit(1);

    return this.resolveTimeZone(petId, rows[0]?.timezone ?? null);
  }

  /**
   * R13: sin owner activo, o con una `users.timezone` que no pertenece al
   * catalogo IANA (el registro de #3 solo valida longitud), se degrada a
   * 'UTC' con warn — nunca se aborta el barrido ni se propaga el error
   * (precedente R5 de #9).
   */
  private resolveTimeZone(petId: string, timezone: string | null): string {
    if (timezone !== null && isSupportedTimeZone(timezone)) {
      return timezone;
    }

    this.logger.warn({
      scope: 'activity-store',
      petId,
      timezone,
      message: `falling back to ${FALLBACK_TIME_ZONE}: owner timezone missing or not a IANA zone`,
    });

    return FALLBACK_TIME_ZONE;
  }
}
