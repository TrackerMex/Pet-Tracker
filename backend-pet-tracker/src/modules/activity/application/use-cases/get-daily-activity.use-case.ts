import { Inject, Injectable } from '@nestjs/common';
import {
  ACTIVITY_BASELINE_DAYS,
  ACTIVITY_DEFAULT_RANGE_DAYS,
  ACTIVITY_MAX_RANGE_DAYS,
} from '@/modules/activity/activity.constants';
import type {
  DailyActivityRow,
  DayEntry,
} from '@/modules/activity/domain/entities/daily-activity.entity';
import {
  InvalidDateError,
  InvalidRangeError,
  RangeTooLargeError,
} from '@/modules/activity/domain/errors/activity.errors';
import { ACTIVITY_STORE } from '@/modules/activity/domain/repositories/activity-store';
import type { ActivityStore } from '@/modules/activity/domain/repositories/activity-store';
import { DAILY_POSITIONS_READER } from '@/modules/activity/domain/repositories/daily-positions.reader';
import type { DailyPositionsReader } from '@/modules/activity/domain/repositories/daily-positions.reader';
import { compareWeek } from '@/modules/activity/domain/week-comparison';
import type {
  ComparableMetrics,
  WeekComparison,
} from '@/modules/activity/domain/week-comparison';
import { computeDailyActivity } from '@/pipeline/activity';
import {
  isCalendarDate,
  listDays,
  localDayOf,
  localDayRange,
  shiftDay,
} from '@/pipeline/local-day';

export interface GetDailyActivityInput {
  /** Mascota ya autorizada por PetAccessGuard (R16): nunca del cliente. */
  petId: string;
  from?: string;
  to?: string;
}

export interface GetDailyActivityResult {
  days: DayEntry[];
  weekComparison: WeekComparison;
}

/**
 * GET /v1/pets/:petId/activity/daily (R20, R21). Devuelve una entrada por
 * cada dia del rango, sin huecos, y computa al vuelo COMO MAXIMO un dia (el
 * de hoy en la tz del owner): sin ese tope, un rango de 31 dias sin filas
 * dispararia hasta 93 Query de DynamoDB en una sola peticion HTTP (D13).
 */
@Injectable()
export class GetDailyActivityUseCase {
  constructor(
    @Inject(ACTIVITY_STORE) private readonly store: ActivityStore,
    @Inject(DAILY_POSITIONS_READER)
    private readonly positions: DailyPositionsReader,
  ) {}

  async execute(
    input: GetDailyActivityInput,
    now: Date = new Date(),
  ): Promise<GetDailyActivityResult> {
    // R17: formato, orden y tamaño se validan ANTES de cualquier I/O cuando
    // el cliente da los dos extremos — un rango de 32 dias no llega a tocar
    // Postgres ni DynamoDB.
    assertCalendarDate(input.from);
    assertCalendarDate(input.to);
    if (input.from !== undefined && input.to !== undefined) {
      assertRange(input.from, input.to);
    }

    const timeZone = await this.store.findOwnerTimezone(input.petId);
    const today = localDayOf(now.getTime(), timeZone);
    // R20: sin `to` es hoy del owner; sin `from`, los 7 dias que acaban en `to`.
    const toDay = input.to ?? today;
    const fromDay =
      input.from ?? shiftDay(toDay, -(ACTIVITY_DEFAULT_RANGE_DAYS - 1));
    assertRange(fromDay, toDay);

    const stored = await this.store.findDailyRange(input.petId, fromDay, toDay);
    const rowsByDate = new Map(stored.map((row) => [row.date, row]));

    const days: DayEntry[] = [];
    for (const day of listDays(fromDay, toDay)) {
      const row = rowsByDate.get(day);
      if (row !== undefined) {
        days.push(toStoredEntry(row));
        continue;
      }
      if (day === today) {
        days.push(await this.computeToday(input.petId, day, timeZone, now));
        continue;
      }
      // R20: un dia pasado sin fila es `missing` con metricas null, nunca
      // ceros — un cero significa "reposo confirmado" y mentiria.
      days.push(missingEntry(day));
    }

    return {
      days,
      weekComparison: await this.buildWeekComparison(
        input.petId,
        fromDay,
        days,
      ),
    };
  }

  /** Dia en curso: ventana [startMs, min(now, endMs)) y NO se persiste. */
  private async computeToday(
    petId: string,
    day: string,
    timeZone: string,
    now: Date,
  ): Promise<DayEntry> {
    const range = localDayRange(day, timeZone);
    const window = {
      startMs: range.startMs,
      endMs: Math.min(now.getTime(), range.endMs),
    };
    const positions = await this.positions.readDay(
      petId,
      window.startMs,
      window.endMs,
    );
    const activity = computeDailyActivity(positions, window);

    return {
      date: day,
      distanceM: activity.distanceM,
      activeMinutes: activity.activeMinutes,
      restMinutes: activity.restMinutes,
      walkCount: activity.walkCount,
      avgWalkMinutes: activity.avgWalkMinutes,
      firstWalkAt: toIso(activity.firstWalkAt),
      lastWalkAt: toIso(activity.lastWalkAt),
      // La rellena #13; el dia en curso ni siquiera tiene fila donde leerla.
      timeAwayMinutes: null,
      source: 'computed',
    };
  }

  /** R21: base = los 7 dias naturales inmediatamente anteriores a `from`. */
  private async buildWeekComparison(
    petId: string,
    fromDay: string,
    days: DayEntry[],
  ): Promise<WeekComparison> {
    const baselineRows = await this.store.findDailyRange(
      petId,
      shiftDay(fromDay, -ACTIVITY_BASELINE_DAYS),
      shiftDay(fromDay, -1),
    );

    return compareWeek(samplesOfRange(days), samplesOfBaseline(baselineRows));
  }
}

function assertCalendarDate(value: string | undefined): void {
  if (value !== undefined && !isCalendarDate(value)) {
    throw new InvalidDateError(value);
  }
}

function assertRange(fromDay: string, toDay: string): void {
  if (fromDay > toDay) {
    throw new InvalidRangeError();
  }
  if (listDays(fromDay, toDay).length > ACTIVITY_MAX_RANGE_DAYS) {
    throw new RangeTooLargeError();
  }
}

/** Mapper explicito de la fila a la entrada publica (R20). `computed_at` y
 * `pet_id` nunca salen, y una columna nueva no se filtra por accidente. */
function toStoredEntry(row: DailyActivityRow): DayEntry {
  return {
    date: row.date,
    distanceM: row.distanceM,
    activeMinutes: row.activeMinutes,
    restMinutes: row.restMinutes,
    walkCount: row.walkCount,
    avgWalkMinutes: row.avgWalkMinutes,
    // timestamptz ⇒ ISO-8601, coherente con `lastCommunicationAt` de #7.
    firstWalkAt:
      row.firstWalkAt === null ? null : row.firstWalkAt.toISOString(),
    lastWalkAt: row.lastWalkAt === null ? null : row.lastWalkAt.toISOString(),
    timeAwayMinutes: row.timeAwayMinutes,
    source: 'stored',
  };
}

function missingEntry(day: string): DayEntry {
  return {
    date: day,
    distanceM: null,
    activeMinutes: null,
    restMinutes: null,
    walkCount: null,
    avgWalkMinutes: null,
    firstWalkAt: null,
    lastWalkAt: null,
    timeAwayMinutes: null,
    source: 'missing',
  };
}

function samplesOfRange(days: DayEntry[]): ComparableMetrics {
  const measured = days.filter((day) => day.source !== 'missing');

  return {
    distanceM: measured.map((day) => day.distanceM ?? 0),
    activeMinutes: measured.map((day) => day.activeMinutes ?? 0),
    walkCount: measured.map((day) => day.walkCount ?? 0),
  };
}

function samplesOfBaseline(rows: DailyActivityRow[]): ComparableMetrics {
  return {
    distanceM: rows.map((row) => row.distanceM),
    activeMinutes: rows.map((row) => row.activeMinutes),
    walkCount: rows.map((row) => row.walkCount),
  };
}

function toIso(epochMs: number | null): string | null {
  return epochMs === null ? null : new Date(epochMs).toISOString();
}
