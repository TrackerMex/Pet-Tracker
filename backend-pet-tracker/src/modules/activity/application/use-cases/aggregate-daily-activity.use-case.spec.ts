import { Logger } from '@nestjs/common';
import type { DailyActivityUpsert } from '@/modules/activity/domain/entities/daily-activity.entity';
import type {
  ActivityStore,
  PetToAggregate,
} from '@/modules/activity/domain/repositories/activity-store';
import type { DailyPositionsReader } from '@/modules/activity/domain/repositories/daily-positions.reader';
import type { ProcessedPosition } from '@/pipeline/types';
import { AggregateDailyActivityUseCase } from './aggregate-daily-activity.use-case';

const PET_A = '018f5a3e-0000-7000-8000-00000000000a';
const PET_B = '018f5a3e-0000-7000-8000-00000000000b';
const PET_C = '018f5a3e-0000-7000-8000-00000000000c';

/** 2026-08-03 12:00 UTC = 06:00 en America/Mexico_City. */
const NOW = new Date('2026-08-03T12:00:00.000Z');

interface StoreCalls {
  fresh: Array<{ petId: string; date: string; notBeforeMs: number }>;
  upserts: DailyActivityUpsert[];
}

function fakeStore(
  pets: PetToAggregate[],
  overrides: Partial<ActivityStore> = {},
): { store: ActivityStore; calls: StoreCalls } {
  const calls: StoreCalls = { fresh: [], upserts: [] };
  const store: ActivityStore = {
    listPetsToAggregate: () => Promise.resolve(pets),
    hasFreshRow: (petId, date, notBeforeMs) => {
      calls.fresh.push({ petId, date, notBeforeMs });
      return Promise.resolve(false);
    },
    upsertDailyActivity: (row) => {
      calls.upserts.push(row);
      return Promise.resolve();
    },
    findDailyRange: () => Promise.resolve([]),
    findOwnerTimezone: () => Promise.resolve('UTC'),
    // Puerto ampliado por #13 (R24): estas mascotas no tienen geocercas, asi
    // que el KPI no es medible. La cobertura de time_away_minutes vive en
    // aggregate-time-away.spec.ts; aqui solo mantiene el fake en sintonia.
    findAwaySpans: () => Promise.resolve(null),
    ...overrides,
  };

  return { store, calls };
}

/** Serie de 12 puntos a 30 s y 5 km/h dentro del dia local pedido. */
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

function fakeReader(
  positionsFor: (petId: string, startMs: number) => ProcessedPosition[],
): { reader: DailyPositionsReader; calls: Array<[string, number, number]> } {
  const calls: Array<[string, number, number]> = [];
  const reader: DailyPositionsReader = {
    readDay: (petId, startMs, endMs) => {
      calls.push([petId, startMs, endMs]);
      return Promise.resolve(positionsFor(petId, startMs));
    },
  };

  return { reader, calls };
}

describe('R14: runOnce procesa el ultimo dia local cerrado de cada mascota', () => {
  it('computa y upsertea el dia anterior en la timezone del owner', async () => {
    const { store, calls } = fakeStore([
      { petId: PET_A, timezone: 'America/Mexico_City' },
    ]);
    const { reader, calls: reads } = fakeReader((_petId, startMs) =>
      walkAt(startMs + 3_600_000),
    );

    const summary = await new AggregateDailyActivityUseCase(
      store,
      reader,
    ).runOnce(NOW);

    expect(summary).toEqual({ processed: 1, skipped: 0, failed: 0 });
    // Hoy local del owner es 2026-08-03 (06:00), asi que el ultimo dia
    // cerrado es 2026-08-02, cuyo rango arranca a las 06:00 UTC.
    expect(calls.upserts[0].date).toBe('2026-08-02');
    expect(reads[0][0]).toBe(PET_A);
    expect(reads[0][1]).toBe(Date.UTC(2026, 7, 2, 6, 0, 0));
    expect(reads[0][2]).toBe(Date.UTC(2026, 7, 3, 6, 0, 0));
    expect(calls.upserts[0].walkCount).toBe(1);
    expect(calls.upserts[0].distanceM).toBeGreaterThan(0);
  });

  it('el dia local cerrado depende de la zona: UTC va un dia por delante de Auckland', async () => {
    const { store, calls } = fakeStore([
      { petId: PET_A, timezone: 'UTC' },
      { petId: PET_B, timezone: 'Pacific/Auckland' },
    ]);
    const { reader } = fakeReader(() => []);

    await new AggregateDailyActivityUseCase(store, reader).runOnce(NOW);

    // 2026-08-03 12:00 UTC es el 04 a las 00:00 en Auckland (UTC+12).
    expect(calls.upserts.map((row) => [row.petId, row.date])).toEqual([
      [PET_A, '2026-08-02'],
      [PET_B, '2026-08-03'],
    ]);
  });

  it('salta la mascota con fila ya computada tras el cierre del dia', async () => {
    const { store, calls } = fakeStore([{ petId: PET_A, timezone: 'UTC' }], {
      hasFreshRow: () => Promise.resolve(true),
    });
    const { reader, calls: reads } = fakeReader(() => []);

    const summary = await new AggregateDailyActivityUseCase(
      store,
      reader,
    ).runOnce(NOW);

    expect(summary).toEqual({ processed: 0, skipped: 1, failed: 0 });
    expect(reads).toHaveLength(0);
    expect(calls.upserts).toHaveLength(0);
  });

  it('el corte de frescura es el endMs del dia, no el reloj', async () => {
    const { store, calls } = fakeStore([{ petId: PET_A, timezone: 'UTC' }]);
    const { reader } = fakeReader(() => []);

    await new AggregateDailyActivityUseCase(store, reader).runOnce(NOW);

    expect(calls.fresh[0]).toEqual({
      petId: PET_A,
      date: '2026-08-02',
      notBeforeMs: Date.UTC(2026, 7, 3, 0, 0, 0),
    });
  });

  it('una mascota que lanza no aborta el barrido y suma a failed', async () => {
    const warn = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
    const { store, calls } = fakeStore([
      { petId: PET_A, timezone: 'UTC' },
      { petId: PET_B, timezone: 'UTC' },
      { petId: PET_C, timezone: 'UTC' },
    ]);
    const { reader } = fakeReader((petId) => {
      if (petId === PET_B) {
        throw new Error('dynamodb unreachable');
      }
      return [];
    });

    const summary = await new AggregateDailyActivityUseCase(
      store,
      reader,
    ).runOnce(NOW);

    expect(summary).toEqual({ processed: 2, skipped: 0, failed: 1 });
    expect(calls.upserts.map((row) => row.petId)).toEqual([PET_A, PET_C]);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatchObject({ petId: PET_B });

    warn.mockRestore();
  });

  it('una timezone invalida que llegue al use case tampoco aborta el barrido', async () => {
    const warn = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
    const { store, calls } = fakeStore([
      { petId: PET_A, timezone: 'Marte/Olympus' },
      { petId: PET_B, timezone: 'UTC' },
    ]);
    const { reader } = fakeReader(() => []);

    const summary = await new AggregateDailyActivityUseCase(
      store,
      reader,
    ).runOnce(NOW);

    expect(summary).toEqual({ processed: 1, skipped: 0, failed: 1 });
    expect(calls.upserts.map((row) => row.petId)).toEqual([PET_B]);

    warn.mockRestore();
  });

  it('una segunda invocacion con la primera en vuelo no hace trabajo', async () => {
    let release: () => void = () => undefined;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const { store, calls } = fakeStore([{ petId: PET_A, timezone: 'UTC' }]);
    const { reader, calls: reads } = fakeReader(() => []);
    const gatedReader: DailyPositionsReader = {
      readDay: async (petId, startMs, endMs) => {
        await gate;
        return reader.readDay(petId, startMs, endMs);
      },
    };

    const useCase = new AggregateDailyActivityUseCase(store, gatedReader);
    const first = useCase.runOnce(NOW);
    const second = await useCase.runOnce(NOW);

    expect(second).toEqual({ processed: 0, skipped: 0, failed: 0 });
    expect(reads).toHaveLength(0);

    release();
    await first;
    expect(reads).toHaveLength(1);
    expect(calls.upserts).toHaveLength(1);
  });

  it('un dia sin posiciones escribe fila de ceros: reposo confirmado, no hueco', async () => {
    const { store, calls } = fakeStore([{ petId: PET_A, timezone: 'UTC' }]);
    const { reader } = fakeReader(() => []);

    await new AggregateDailyActivityUseCase(store, reader).runOnce(NOW);

    expect(calls.upserts[0]).toEqual({
      petId: PET_A,
      date: '2026-08-02',
      distanceM: 0,
      activeMinutes: 0,
      restMinutes: 0,
      walkCount: 0,
      avgWalkMinutes: 0,
      firstWalkAt: null,
      lastWalkAt: null,
      // #13 R28 añadio la clave al payload; `null` = no medible (esta mascota
      // no tiene geocercas). El `coalesce` del ON CONFLICT hace que un null
      // nunca pise un valor ya escrito, asi que R11 de #10 se mantiene.
      timeAwayMinutes: null,
    });
  });
});
