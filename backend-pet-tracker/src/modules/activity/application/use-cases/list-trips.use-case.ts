import { Inject, Injectable } from '@nestjs/common';
import type {
  TripDetail,
  TripSummary,
} from '@/modules/activity/domain/entities/daily-activity.entity';
import {
  InvalidDateError,
  InvalidTripIndexError,
  TripNotFoundError,
} from '@/modules/activity/domain/errors/activity.errors';
import { ACTIVITY_STORE } from '@/modules/activity/domain/repositories/activity-store';
import type { ActivityStore } from '@/modules/activity/domain/repositories/activity-store';
import { DAILY_POSITIONS_READER } from '@/modules/activity/domain/repositories/daily-positions.reader';
import type { DailyPositionsReader } from '@/modules/activity/domain/repositories/daily-positions.reader';
import {
  isCalendarDate,
  localDayOf,
  localDayRange,
} from '@/pipeline/local-day';
import { groupTrips } from '@/pipeline/trips';
import type { Trip } from '@/pipeline/trips';

export interface ListTripsInput {
  /** Mascota ya autorizada por PetAccessGuard (R16): nunca del cliente. */
  petId: string;
  date?: string;
}

export interface ListTripsResult {
  date: string;
  items: TripSummary[];
}

export interface GetTripResult {
  date: string;
  trip: TripDetail;
}

/**
 * GET /v1/pets/:petId/trips y /trips/:n (R18, R19). El dia se resuelve
 * SIEMPRE en la timezone del owner de la mascota, no en la del usuario que
 * consulta ni en UTC: si no, un `family` en otra zona veria otro dia y las
 * filas persistidas dejarian de casar con el calculo al vuelo.
 */
@Injectable()
export class ListTripsUseCase {
  constructor(
    @Inject(ACTIVITY_STORE) private readonly store: ActivityStore,
    @Inject(DAILY_POSITIONS_READER)
    private readonly positions: DailyPositionsReader,
  ) {}

  async execute(
    input: ListTripsInput,
    now: Date = new Date(),
  ): Promise<ListTripsResult> {
    const { day, trips } = await this.tripsOfDay(input, now);

    return {
      date: day,
      // R18: la lista NO lleva `path` — el plan lo reserva a /trips/:n.
      items: trips.map((trip, index) => toTripSummary(trip, index)),
    };
  }

  async executeOne(
    input: ListTripsInput,
    rawIndex: string,
    now: Date = new Date(),
  ): Promise<GetTripResult> {
    // R17: el indice se valida antes de cualquier I/O.
    const index = parseTripIndex(rawIndex);
    const { day, trips } = await this.tripsOfDay(input, now);

    if (index >= trips.length) {
      // R19: unico 404 de la feature con `code` en el body; el del guard no
      // lo lleva, y asi el cliente distingue los dos.
      throw new TripNotFoundError(index);
    }

    return {
      date: day,
      trip: { ...toTripSummary(trips[index], index), path: trips[index].path },
    };
  }

  /** Recomputa los paseos del dia; el determinismo de R6 fija el indice. */
  private async tripsOfDay(
    input: ListTripsInput,
    now: Date,
  ): Promise<{ day: string; trips: Trip[] }> {
    if (input.date !== undefined && !isCalendarDate(input.date)) {
      throw new InvalidDateError(input.date);
    }

    const timeZone = await this.store.findOwnerTimezone(input.petId);
    // R18: `date` ausente ⇒ hoy del OWNER (precedente `to = now` de #9).
    const day = input.date ?? localDayOf(now.getTime(), timeZone);
    const range = localDayRange(day, timeZone);

    const positions = await this.positions.readDay(
      input.petId,
      range.startMs,
      range.endMs,
    );

    return { day, trips: groupTrips(positions) };
  }
}

/** R17: `:n` entero >= 0; cualquier otra cosa es 400 INVALID_TRIP_INDEX. */
export function parseTripIndex(rawIndex: string): number {
  if (!/^\d+$/.test(rawIndex)) {
    throw new InvalidTripIndexError(rawIndex);
  }

  const index = Number(rawIndex);
  if (!Number.isSafeInteger(index)) {
    throw new InvalidTripIndexError(rawIndex);
  }

  return index;
}

function toTripSummary(trip: Trip, index: number): TripSummary {
  // Lista explicita de campos, sin spread del Trip: `path` no puede
  // colarse en la respuesta de /trips por accidente (R18).
  return {
    index,
    startTs: trip.startTs,
    endTs: trip.endTs,
    distanceM: trip.distanceM,
    durationMin: trip.durationMin,
    pointCount: trip.path.length,
  };
}
