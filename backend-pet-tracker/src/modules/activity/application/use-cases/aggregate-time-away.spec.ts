import type { DailyActivityUpsert } from '@/modules/activity/domain/entities/daily-activity.entity';
import type { ActivityStore } from '@/modules/activity/domain/repositories/activity-store';
import type { DailyPositionsReader } from '@/modules/activity/domain/repositories/daily-positions.reader';
import type { AwaySpan } from '@/pipeline/time-away';
import { AggregateDailyActivityUseCase } from './aggregate-daily-activity.use-case';

const PET_WITH_GEOFENCE = '018f5a3e-0000-7000-8000-00000000000a';
const PET_WITHOUT_GEOFENCE = '018f5a3e-0000-7000-8000-00000000000b';

/** 2026-08-03 12:00 UTC ⇒ el ultimo dia local cerrado en UTC es 2026-08-02. */
const NOW = new Date('2026-08-03T12:00:00.000Z');
const TARGET_DAY = '2026-08-02';

function at(hours: number, minutes = 0): number {
  return Date.UTC(2026, 7, 2, hours, minutes);
}

interface Harness {
  store: ActivityStore;
  upserts: DailyActivityUpsert[];
  spanCalls: Array<{ petId: string; startMs: number; endMs: number }>;
}

function harness(spansByPet: Record<string, AwaySpan[] | null>): Harness {
  const upserts: DailyActivityUpsert[] = [];
  const spanCalls: Harness['spanCalls'] = [];

  const store: ActivityStore = {
    listPetsToAggregate: () =>
      Promise.resolve(
        Object.keys(spansByPet).map((petId) => ({ petId, timezone: 'UTC' })),
      ),
    hasFreshRow: () => Promise.resolve(false),
    upsertDailyActivity: (row) => {
      upserts.push(row);
      return Promise.resolve();
    },
    findDailyRange: () => Promise.resolve([]),
    findOwnerTimezone: () => Promise.resolve('UTC'),
    findAwaySpans: (petId, range) => {
      spanCalls.push({ petId, startMs: range.startMs, endMs: range.endMs });
      return Promise.resolve(spansByPet[petId]);
    },
  };

  return { store, upserts, spanCalls };
}

const emptyReader: DailyPositionsReader = {
  readDay: () => Promise.resolve([]),
};

describe('R24: geocerca de referencia y NULL si la mascota no tiene ninguna', () => {
  it('pide los spans del MISMO rango de dia local que ya computa el agregador', async () => {
    const { store, spanCalls } = harness({ [PET_WITH_GEOFENCE]: [] });

    await new AggregateDailyActivityUseCase(store, emptyReader).runOnce(NOW);

    expect(spanCalls).toEqual([
      {
        petId: PET_WITH_GEOFENCE,
        startMs: Date.UTC(2026, 7, 2),
        endMs: Date.UTC(2026, 7, 3),
      },
    ]);
  });

  it('sin ninguna geocerca (el store devuelve null) escribe time_away_minutes = NULL', async () => {
    const { store, upserts } = harness({ [PET_WITHOUT_GEOFENCE]: null });

    await new AggregateDailyActivityUseCase(store, emptyReader).runOnce(NOW);

    expect(upserts[0].date).toBe(TARGET_DAY);
    expect(upserts[0].timeAwayMinutes).toBeNull();
  });
});

describe('R27: NULL (no medible) es distinto de 0 (medido y nunca salio)', () => {
  it('mascota sin geocercas ⇒ NULL; mascota con geocerca y sin salidas ⇒ 0', async () => {
    const { store, upserts } = harness({
      [PET_WITH_GEOFENCE]: [],
      [PET_WITHOUT_GEOFENCE]: null,
    });

    await new AggregateDailyActivityUseCase(store, emptyReader).runOnce(NOW);

    const byPet = new Map(upserts.map((row) => [row.petId, row]));
    expect(byPet.get(PET_WITH_GEOFENCE)?.timeAwayMinutes).toBe(0);
    expect(byPet.get(PET_WITHOUT_GEOFENCE)?.timeAwayMinutes).toBeNull();
  });
});

describe('R28: el upsert lleva time_away_minutes calculado con la formula de R25', () => {
  it('una salida de 09:00 a 11:30 acaba en el payload como 150', async () => {
    const { store, upserts } = harness({
      [PET_WITH_GEOFENCE]: [{ openedAtMs: at(9), closedAtMs: at(11, 30) }],
    });

    await new AggregateDailyActivityUseCase(store, emptyReader).runOnce(NOW);

    expect(upserts[0].timeAwayMinutes).toBe(150);
  });

  it('no altera ninguna otra columna del payload de #10', async () => {
    const { store, upserts } = harness({ [PET_WITH_GEOFENCE]: [] });

    await new AggregateDailyActivityUseCase(store, emptyReader).runOnce(NOW);

    expect(upserts[0]).toEqual({
      petId: PET_WITH_GEOFENCE,
      date: TARGET_DAY,
      distanceM: 0,
      activeMinutes: 0,
      restMinutes: 0,
      walkCount: 0,
      avgWalkMinutes: 0,
      firstWalkAt: null,
      lastWalkAt: null,
      timeAwayMinutes: 0,
    });
  });

  it('un fallo leyendo los spans cuenta como mascota fallida, no tumba el barrido', async () => {
    const { store, upserts } = harness({
      [PET_WITH_GEOFENCE]: [],
      [PET_WITHOUT_GEOFENCE]: null,
    });
    const failing: ActivityStore = {
      ...store,
      findAwaySpans: (petId, range) =>
        petId === PET_WITH_GEOFENCE
          ? Promise.reject(new Error('postgres unreachable'))
          : store.findAwaySpans(petId, range),
    };

    const summary = await new AggregateDailyActivityUseCase(
      failing,
      emptyReader,
    ).runOnce(NOW);

    expect(summary).toEqual({ processed: 1, skipped: 0, failed: 1 });
    expect(upserts.map((row) => row.petId)).toEqual([PET_WITHOUT_GEOFENCE]);
  });
});
