import { SIMULATED_DEVICES } from '@/db/seed/simulated-devices';
import { FakeWialonClient, SIM_STEP_MS } from './fake-wialon.client';

// Intervalo base alineado a slots de 30 s (12:00:00.000 UTC es multiplo).
const T0 = Date.UTC(2026, 7, 1, 12, 0, 0);

function client(seed = 1): FakeWialonClient {
  return new FakeWialonClient({ seed, homeLat: 19.4326, homeLng: -99.1332 });
}

describe('R2: fake determinista — misma semilla+intervalo => mismas posiciones; un punto por slot de 30 s; unitIds del seed', () => {
  it('dos llamadas con la misma semilla y el mismo intervalo devuelven exactamente la misma lista', async () => {
    const interval = [T0, T0 + 100 * SIM_STEP_MS] as const;

    // Instancias distintas: simula un reinicio del proceso — sin estado
    // mutable acumulado entre llamadas.
    const first = await client().getMessages('900001', ...interval);
    const second = await client().getMessages('900001', ...interval);

    expect(first.length).toBeGreaterThan(0);
    expect(second).toEqual(first);
  });

  it('genera un punto por cada slot de 30 s del intervalo (ts distintos consecutivos)', async () => {
    const list = await client().getMessages('900001', T0, T0 + 100 * SIM_STEP_MS);

    const distinctTs = [...new Set(list.map((p) => p.ts))];
    expect(distinctTs).toHaveLength(100);
    distinctTs.forEach((ts, i) => {
      expect(ts).toBe(T0 + (i + 1) * SIM_STEP_MS);
    });
  });

  it('intervalos solapados devuelven posiciones identicas para los slots compartidos', async () => {
    const a = await client().getMessages('900001', T0, T0 + 60 * SIM_STEP_MS);
    const b = await client().getMessages(
      '900001',
      T0 + 30 * SIM_STEP_MS,
      T0 + 90 * SIM_STEP_MS,
    );

    const sharedFromA = a.filter((p) => p.ts > T0 + 30 * SIM_STEP_MS);
    const sharedFromB = b.filter((p) => p.ts <= T0 + 60 * SIM_STEP_MS);
    expect(sharedFromA.length).toBeGreaterThan(0);
    expect(sharedFromB).toEqual(sharedFromA);
  });

  it('semillas o unidades distintas producen paseos distintos', async () => {
    const base = await client(1).getMessages('900001', T0, T0 + 20 * SIM_STEP_MS);
    const otherSeed = await client(2).getMessages(
      '900001',
      T0,
      T0 + 20 * SIM_STEP_MS,
    );
    const otherUnit = await client(1).getMessages(
      '900002',
      T0,
      T0 + 20 * SIM_STEP_MS,
    );

    expect(otherSeed).not.toEqual(base);
    expect(otherUnit).not.toEqual(base);
  });

  it('listUnits devuelve las unidades de SIMULATED_DEVICES (importadas del seed de #7)', async () => {
    const units = await client().listUnits();

    expect(units).toEqual(
      SIMULATED_DEVICES.map((device) => ({
        unitId: device.wialonUnitId,
        name: device.esn,
      })),
    );
  });
});
