import { positionUpdatedDetailSchema } from './geofence-event-message.schema';

const POSITION = {
  lat: 19.4326,
  lng: -99.1332,
  ts: Date.UTC(2026, 7, 15, 12),
  speedKmh: null,
  course: null,
  sats: null,
  accuracyM: null,
  batteryPct: null,
  flags: [],
};

function detail(overrides: Record<string, unknown> = {}): unknown {
  return {
    version: 1,
    petId: 'pet-1',
    deviceId: 'device-1',
    position: POSITION,
    batteryPct: null,
    ...overrides,
  };
}

describe('R6 (geofence-eval-full-batch #30): positionUpdatedDetailSchema acepta v1 y v2', () => {
  it('(a) acepta v2 con positions', () => {
    expect(
      positionUpdatedDetailSchema.safeParse(
        detail({
          version: 2,
          positions: [POSITION, { ...POSITION, ts: POSITION.ts + 30_000 }],
        }),
      ).success,
    ).toBe(true);
  });

  it('(b) acepta v1 sin positions', () => {
    expect(positionUpdatedDetailSchema.safeParse(detail()).success).toBe(true);
  });

  it('(c) rechaza positions vacio', () => {
    expect(
      positionUpdatedDetailSchema.safeParse(
        detail({ version: 2, positions: [] }),
      ).success,
    ).toBe(false);
  });

  it('(d) rechaza version 3', () => {
    expect(
      positionUpdatedDetailSchema.safeParse(detail({ version: 3 })).success,
    ).toBe(false);
  });
});
