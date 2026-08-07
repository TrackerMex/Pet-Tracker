import {
  InvalidDateError,
  InvalidTripIndexError,
  TripNotFoundError,
} from '@/modules/activity/domain/errors/activity.errors';
import type { ActivityStore } from '@/modules/activity/domain/repositories/activity-store';
import type { DailyPositionsReader } from '@/modules/activity/domain/repositories/daily-positions.reader';
import type { ProcessedPosition } from '@/pipeline/types';
import { ListTripsUseCase } from './list-trips.use-case';

const PET_A = '018f5a3e-0000-7000-8000-00000000000a';
/** 2026-08-03 12:00 UTC = 06:00 en America/Mexico_City. */
const NOW = new Date('2026-08-03T12:00:00.000Z');

function fakeStore(timeZone: string): ActivityStore {
  return {
    listPetsToAggregate: () => Promise.resolve([]),
    hasFreshRow: () => Promise.resolve(false),
    upsertDailyActivity: () => Promise.resolve(),
    findDailyRange: () => Promise.resolve([]),
    findOwnerTimezone: () => Promise.resolve(timeZone),
    // Puerto ampliado por #13 (R24); este use case no lo usa.
    findAwaySpans: () => Promise.resolve(null),
  };
}

/** Paseo de 12 puntos a 30 s y 5 km/h desde `startMs`. */
function walkAt(startMs: number): ProcessedPosition[] {
  const metersPerStep = (5 / 3.6) * 30;
  const metersPerDegree = (6_371_000 * Math.PI) / 180;

  return Array.from({ length: 12 }, (_, index) => ({
    lat: 19.4326 + (index * metersPerStep) / metersPerDegree,
    lng: -99.1332,
    ts: startMs + index * 30_000,
    speedKmh: 5,
    flags: [],
  }));
}

function fakeReader(positions: ProcessedPosition[]): {
  reader: DailyPositionsReader;
  calls: Array<[string, number, number]>;
} {
  const calls: Array<[string, number, number]> = [];

  return {
    calls,
    reader: {
      readDay: (petId, startMs, endMs) => {
        calls.push([petId, startMs, endMs]);
        return Promise.resolve(
          positions.filter(
            (position) => position.ts >= startMs && position.ts < endMs,
          ),
        );
      },
    },
  };
}

describe('R18: GET /trips devuelve {date, items} del dia local del owner', () => {
  it('resuelve el rango en la tz del owner, no en UTC ni en la del consultante', async () => {
    const { reader, calls } = fakeReader([]);

    const result = await new ListTripsUseCase(
      fakeStore('America/Mexico_City'),
      reader,
    ).execute({ petId: PET_A, date: '2026-08-02' }, NOW);

    expect(result.date).toBe('2026-08-02');
    expect(calls[0]).toEqual([
      PET_A,
      Date.UTC(2026, 7, 2, 6, 0, 0),
      Date.UTC(2026, 7, 3, 6, 0, 0),
    ]);
  });

  it('sin `date` usa el dia local de hoy del owner', async () => {
    const { reader } = fakeReader([]);

    const result = await new ListTripsUseCase(
      fakeStore('America/Mexico_City'),
      reader,
    ).execute({ petId: PET_A }, NOW);

    // 12:00 UTC son las 06:00 del 03 en CDMX: hoy es el 03, no el 02.
    expect(result.date).toBe('2026-08-03');
  });

  it('el objeto tiene exactamente dos claves y los items seis, sin path', async () => {
    const { reader } = fakeReader(walkAt(Date.UTC(2026, 7, 2, 16, 0, 0)));

    const result = await new ListTripsUseCase(
      fakeStore('America/Mexico_City'),
      reader,
    ).execute({ petId: PET_A, date: '2026-08-02' }, NOW);

    expect(Object.keys(result).sort()).toEqual(['date', 'items']);
    expect(result.items).toHaveLength(1);
    expect(Object.keys(result.items[0]).sort()).toEqual([
      'distanceM',
      'durationMin',
      'endTs',
      'index',
      'pointCount',
      'startTs',
    ]);
    expect(result.items[0].index).toBe(0);
    expect(result.items[0].pointCount).toBe(12);
    expect(result.items[0].distanceM).toBeGreaterThan(0);
  });

  it('un dia sin paseos es 200 con items vacios, nunca 404', async () => {
    const { reader } = fakeReader([]);

    const result = await new ListTripsUseCase(fakeStore('UTC'), reader).execute(
      { petId: PET_A, date: '2026-08-02' },
      NOW,
    );

    expect(result).toEqual({ date: '2026-08-02', items: [] });
  });

  it('un `date` que no es una fecha real es InvalidDateError sin tocar I/O', async () => {
    const { reader, calls } = fakeReader([]);
    const useCase = new ListTripsUseCase(fakeStore('UTC'), reader);

    await expect(
      useCase.execute({ petId: PET_A, date: '2026-02-30' }, NOW),
    ).rejects.toBeInstanceOf(InvalidDateError);
    await expect(
      useCase.execute({ petId: PET_A, date: '02/08/2026' }, NOW),
    ).rejects.toBeInstanceOf(InvalidDateError);
    expect(calls).toHaveLength(0);
  });
});

describe('R19: GET /trips/:n devuelve el paseo con path e indice estable', () => {
  it('anade path a las seis claves de R18', async () => {
    const { reader } = fakeReader(walkAt(Date.UTC(2026, 7, 2, 16, 0, 0)));

    const result = await new ListTripsUseCase(
      fakeStore('America/Mexico_City'),
      reader,
    ).executeOne({ petId: PET_A, date: '2026-08-02' }, '0', NOW);

    expect(Object.keys(result.trip).sort()).toEqual([
      'distanceM',
      'durationMin',
      'endTs',
      'index',
      'path',
      'pointCount',
      'startTs',
    ]);
    expect(result.trip.path).toHaveLength(12);
    expect(Object.keys(result.trip.path[0]).sort()).toEqual([
      'lat',
      'lng',
      'ts',
    ]);
    expect(result.trip.path.map((point) => point.ts)).toEqual(
      [...result.trip.path.map((point) => point.ts)].sort((a, b) => a - b),
    );
  });

  it('dos peticiones consecutivas devuelven el mismo paseo para el mismo n', async () => {
    const { reader } = fakeReader(walkAt(Date.UTC(2026, 7, 2, 16, 0, 0)));
    const useCase = new ListTripsUseCase(
      fakeStore('America/Mexico_City'),
      reader,
    );

    const first = await useCase.executeOne(
      { petId: PET_A, date: '2026-08-02' },
      '0',
      NOW,
    );
    const second = await useCase.executeOne(
      { petId: PET_A, date: '2026-08-02' },
      '0',
      NOW,
    );

    expect(second).toEqual(first);
  });

  it('un n fuera de rango es TripNotFoundError', async () => {
    const { reader } = fakeReader(walkAt(Date.UTC(2026, 7, 2, 16, 0, 0)));
    const useCase = new ListTripsUseCase(
      fakeStore('America/Mexico_City'),
      reader,
    );

    await expect(
      useCase.executeOne({ petId: PET_A, date: '2026-08-02' }, '99', NOW),
    ).rejects.toBeInstanceOf(TripNotFoundError);
  });
});

describe('R17: `:n` que no es entero >= 0 es InvalidTripIndexError sin I/O', () => {
  it.each(['-1', '1.5', 'abc', '', '1e3', ' 1'])(
    'rechaza %p antes de leer nada',
    async (rawIndex) => {
      const { reader, calls } = fakeReader([]);

      await expect(
        new ListTripsUseCase(fakeStore('UTC'), reader).executeOne(
          { petId: PET_A },
          rawIndex,
          NOW,
        ),
      ).rejects.toBeInstanceOf(InvalidTripIndexError);
      expect(calls).toHaveLength(0);
    },
  );

  it('acepta 0 y enteros positivos', async () => {
    const { reader } = fakeReader(walkAt(Date.UTC(2026, 7, 2, 16, 0, 0)));
    const useCase = new ListTripsUseCase(
      fakeStore('America/Mexico_City'),
      reader,
    );

    await expect(
      useCase.executeOne({ petId: PET_A, date: '2026-08-02' }, '0', NOW),
    ).resolves.toBeDefined();
    await expect(
      useCase.executeOne({ petId: PET_A, date: '2026-08-02' }, '3', NOW),
    ).rejects.toBeInstanceOf(TripNotFoundError);
  });
});
