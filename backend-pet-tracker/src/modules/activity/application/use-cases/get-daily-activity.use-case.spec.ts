import { ACTIVITY_MAX_RANGE_DAYS } from '@/modules/activity/activity.constants';
import type { DailyActivityRow } from '@/modules/activity/domain/entities/daily-activity.entity';
import {
  InvalidDateError,
  InvalidRangeError,
  RangeTooLargeError,
} from '@/modules/activity/domain/errors/activity.errors';
import type { ActivityStore } from '@/modules/activity/domain/repositories/activity-store';
import type { DailyPositionsReader } from '@/modules/activity/domain/repositories/daily-positions.reader';
import type { ProcessedPosition } from '@/pipeline/types';
import { GetDailyActivityUseCase } from './get-daily-activity.use-case';

const PET_A = '018f5a3e-0000-7000-8000-00000000000a';
/** 2026-08-03 20:00 UTC = 14:00 en America/Mexico_City. */
const NOW = new Date('2026-08-03T20:00:00.000Z');

function row(
  date: string,
  overrides: Partial<DailyActivityRow> = {},
): DailyActivityRow {
  return {
    petId: PET_A,
    date,
    distanceM: 1_000,
    activeMinutes: 40,
    restMinutes: 300,
    walkCount: 2,
    avgWalkMinutes: 12.5,
    firstWalkAt: new Date(`${date}T14:00:00.000Z`),
    lastWalkAt: new Date(`${date}T15:00:00.000Z`),
    timeAwayMinutes: null,
    computedAt: new Date(`${date}T23:59:00.000Z`),
    ...overrides,
  };
}

interface StoreCalls {
  ranges: Array<[string, string, string]>;
}

function fakeStore(
  rows: DailyActivityRow[],
  timeZone = 'America/Mexico_City',
): { store: ActivityStore; calls: StoreCalls } {
  const calls: StoreCalls = { ranges: [] };
  const store: ActivityStore = {
    listPetsToAggregate: () => Promise.resolve([]),
    hasFreshRow: () => Promise.resolve(false),
    upsertDailyActivity: () => Promise.resolve(),
    findDailyRange: (petId, fromDay, toDay) => {
      calls.ranges.push([petId, fromDay, toDay]);
      return Promise.resolve(
        rows.filter((item) => item.date >= fromDay && item.date <= toDay),
      );
    },
    findOwnerTimezone: () => Promise.resolve(timeZone),
    // Puerto ampliado por #13 (R24); este use case no lo usa.
    findAwaySpans: () => Promise.resolve(null),
  };

  return { store, calls };
}

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

describe('R20: days trae una entrada por dia con su source', () => {
  it('missing / stored / computed en un rango de tres dias', async () => {
    const { store } = fakeStore([row('2026-08-02')]);
    const { reader, calls } = fakeReader(
      walkAt(Date.UTC(2026, 7, 3, 16, 0, 0)),
    );

    const result = await new GetDailyActivityUseCase(store, reader).execute(
      { petId: PET_A, from: '2026-08-01', to: '2026-08-03' },
      NOW,
    );

    expect(Object.keys(result).sort()).toEqual(['days', 'weekComparison']);
    expect(result.days.map((day) => [day.date, day.source])).toEqual([
      ['2026-08-01', 'missing'],
      ['2026-08-02', 'stored'],
      ['2026-08-03', 'computed'],
    ]);
    // Un solo dia al vuelo por peticion: el de hoy.
    expect(calls).toHaveLength(1);
  });

  it('cada entrada tiene exactamente las diez claves de R20', async () => {
    const { store } = fakeStore([row('2026-08-02')]);
    const { reader } = fakeReader([]);

    const result = await new GetDailyActivityUseCase(store, reader).execute(
      { petId: PET_A, from: '2026-08-01', to: '2026-08-03' },
      NOW,
    );

    for (const day of result.days) {
      expect(Object.keys(day).sort()).toEqual([
        'activeMinutes',
        'avgWalkMinutes',
        'date',
        'distanceM',
        'firstWalkAt',
        'lastWalkAt',
        'restMinutes',
        'source',
        'timeAwayMinutes',
        'walkCount',
      ]);
    }
  });

  it('un dia missing lleva todas las metricas a null, nunca ceros', async () => {
    const { store } = fakeStore([]);
    const { reader } = fakeReader([]);

    const result = await new GetDailyActivityUseCase(store, reader).execute(
      { petId: PET_A, from: '2026-08-01', to: '2026-08-01' },
      NOW,
    );

    expect(result.days[0]).toEqual({
      date: '2026-08-01',
      distanceM: null,
      activeMinutes: null,
      restMinutes: null,
      walkCount: null,
      avgWalkMinutes: null,
      firstWalkAt: null,
      lastWalkAt: null,
      timeAwayMinutes: null,
      source: 'missing',
    });
  });

  it('un dia stored sale de la fila, con los hitos en ISO-8601', async () => {
    const { store } = fakeStore([
      row('2026-08-02', { timeAwayMinutes: 42, avgWalkMinutes: 12.5 }),
    ]);
    const { reader } = fakeReader([]);

    const result = await new GetDailyActivityUseCase(store, reader).execute(
      { petId: PET_A, from: '2026-08-02', to: '2026-08-02' },
      NOW,
    );

    expect(result.days[0]).toEqual({
      date: '2026-08-02',
      distanceM: 1_000,
      activeMinutes: 40,
      restMinutes: 300,
      walkCount: 2,
      avgWalkMinutes: 12.5,
      firstWalkAt: '2026-08-02T14:00:00.000Z',
      lastWalkAt: '2026-08-02T15:00:00.000Z',
      timeAwayMinutes: 42,
      source: 'stored',
    });
  });

  it('hoy se computa al vuelo sobre [inicio, now) y con timeAwayMinutes null', async () => {
    const { store } = fakeStore([]);
    const { reader, calls } = fakeReader(
      walkAt(Date.UTC(2026, 7, 3, 16, 0, 0)),
    );

    const result = await new GetDailyActivityUseCase(store, reader).execute(
      { petId: PET_A, from: '2026-08-03', to: '2026-08-03' },
      NOW,
    );

    expect(calls[0]).toEqual([
      PET_A,
      Date.UTC(2026, 7, 3, 6, 0, 0),
      NOW.getTime(),
    ]);
    expect(result.days[0].source).toBe('computed');
    expect(result.days[0].walkCount).toBe(1);
    expect(result.days[0].timeAwayMinutes).toBeNull();
    expect(result.days[0].firstWalkAt).toBe('2026-08-03T16:00:00.000Z');
  });

  it('una fila persistida gana al computo al vuelo aunque el dia sea hoy', async () => {
    const { store } = fakeStore([row('2026-08-03')]);
    const { reader, calls } = fakeReader(
      walkAt(Date.UTC(2026, 7, 3, 16, 0, 0)),
    );

    const result = await new GetDailyActivityUseCase(store, reader).execute(
      { petId: PET_A, from: '2026-08-03', to: '2026-08-03' },
      NOW,
    );

    expect(result.days[0].source).toBe('stored');
    expect(calls).toHaveLength(0);
  });

  it('sin from ni to devuelve la ventana de 7 dias que acaba hoy', async () => {
    const { store, calls } = fakeStore([]);
    const { reader } = fakeReader([]);

    const result = await new GetDailyActivityUseCase(store, reader).execute(
      { petId: PET_A },
      NOW,
    );

    expect(result.days.map((day) => day.date)).toEqual([
      '2026-07-28',
      '2026-07-29',
      '2026-07-30',
      '2026-07-31',
      '2026-08-01',
      '2026-08-02',
      '2026-08-03',
    ]);
    expect(calls.ranges[0]).toEqual([PET_A, '2026-07-28', '2026-08-03']);
  });

  it('el rango se devuelve sin huecos aunque cruce fin de mes', async () => {
    const { store } = fakeStore([]);
    const { reader } = fakeReader([]);

    const result = await new GetDailyActivityUseCase(store, reader).execute(
      { petId: PET_A, from: '2026-07-30', to: '2026-08-02' },
      NOW,
    );

    expect(result.days.map((day) => day.date)).toEqual([
      '2026-07-30',
      '2026-07-31',
      '2026-08-01',
      '2026-08-02',
    ]);
  });
});

describe('R17: los rangos invalidos de /activity/daily no llegan a la base', () => {
  it('una fecha que no existe es InvalidDateError', async () => {
    const { store, calls } = fakeStore([]);
    const { reader } = fakeReader([]);

    await expect(
      new GetDailyActivityUseCase(store, reader).execute(
        { petId: PET_A, from: '2026-02-30', to: '2026-03-01' },
        NOW,
      ),
    ).rejects.toBeInstanceOf(InvalidDateError);
    expect(calls.ranges).toHaveLength(0);
  });

  it('from posterior a to es InvalidRangeError', async () => {
    const { store, calls } = fakeStore([]);
    const { reader } = fakeReader([]);

    await expect(
      new GetDailyActivityUseCase(store, reader).execute(
        { petId: PET_A, from: '2026-08-03', to: '2026-08-01' },
        NOW,
      ),
    ).rejects.toBeInstanceOf(InvalidRangeError);
    expect(calls.ranges).toHaveLength(0);
  });

  it('32 dias es RangeTooLargeError y 31 no', async () => {
    const { store, calls } = fakeStore([]);
    const { reader } = fakeReader([]);
    const useCase = new GetDailyActivityUseCase(store, reader);

    expect(ACTIVITY_MAX_RANGE_DAYS).toBe(31);
    await expect(
      useCase.execute(
        { petId: PET_A, from: '2026-07-03', to: '2026-08-03' },
        NOW,
      ),
    ).rejects.toBeInstanceOf(RangeTooLargeError);
    expect(calls.ranges).toHaveLength(0);

    const exact = await useCase.execute(
      { petId: PET_A, from: '2026-07-04', to: '2026-08-03' },
      NOW,
    );
    expect(exact.days).toHaveLength(31);
  });
});

describe('R21: weekComparison compara contra los 7 dias previos a `from`', () => {
  it('consulta la ventana base [from - 7, from) y devuelve el delta', async () => {
    const rows = [
      row('2026-07-26', { distanceM: 900, activeMinutes: 50, walkCount: 2 }),
      row('2026-07-27', { distanceM: 1_100, activeMinutes: 50, walkCount: 2 }),
      row('2026-08-02', { distanceM: 1_120, activeMinutes: 60, walkCount: 2 }),
    ];
    const { store, calls } = fakeStore(rows);
    const { reader } = fakeReader([]);

    const result = await new GetDailyActivityUseCase(store, reader).execute(
      { petId: PET_A, from: '2026-08-02', to: '2026-08-02' },
      NOW,
    );

    expect(calls.ranges).toContainEqual([PET_A, '2026-07-26', '2026-08-01']);
    expect(result.weekComparison).toEqual({
      distanceM: 12,
      activeMinutes: 20,
      walkCount: 0,
    });
  });

  it('sin historial las tres claves son null', async () => {
    const { store } = fakeStore([row('2026-08-02')]);
    const { reader } = fakeReader([]);

    const result = await new GetDailyActivityUseCase(store, reader).execute(
      { petId: PET_A, from: '2026-08-02', to: '2026-08-02' },
      NOW,
    );

    expect(result.weekComparison).toEqual({
      distanceM: null,
      activeMinutes: null,
      walkCount: null,
    });
  });

  it('los dias missing no entran en la media del rango', async () => {
    const rows = [
      row('2026-07-27', { distanceM: 1_000, activeMinutes: 50, walkCount: 2 }),
      row('2026-08-02', { distanceM: 1_500, activeMinutes: 50, walkCount: 2 }),
    ];
    const { store } = fakeStore(rows);
    const { reader } = fakeReader([]);

    const result = await new GetDailyActivityUseCase(store, reader).execute(
      { petId: PET_A, from: '2026-08-01', to: '2026-08-02' },
      NOW,
    );

    // 2026-08-01 es missing: la media del rango es 1 500, no 750.
    expect(result.days[0].source).toBe('missing');
    expect(result.weekComparison.distanceM).toBe(50);
  });
});
