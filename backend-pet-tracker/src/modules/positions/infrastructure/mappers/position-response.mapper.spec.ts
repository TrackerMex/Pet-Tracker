import { FLAG_LOW_ACCURACY } from '@/pipeline/constants';
import { toStoredPosition } from './position-response.mapper';

/** Item con los atributos exactos que escribe el consumidor de #8. */
const ITEM: Record<string, unknown> = {
  pk: 'PET#018f5a3e-0000-7000-8000-000000000001',
  sk: 1_754_123_456_789,
  lat: 19.4326,
  lng: -99.1332,
  speed_kmh: 4.5,
  course: 180,
  altitude: 2240,
  sats: 9,
  accuracy_m: 12,
  battery_pct: 88,
  device_ts: 1_754_123_456_789,
  received_ts: 1_754_123_460_000,
  processed_ts: 1_754_123_461_000,
  flags: [FLAG_LOW_ACCURACY],
  expires_at: 1_761_899_456,
};

describe('R11: el mapper traduce el item de DynamoDB a camelCase y omite los atributos internos', () => {
  it('mapea las 10 claves del contrato publico', () => {
    expect(toStoredPosition(ITEM)).toEqual({
      ts: 1_754_123_456_789,
      lat: 19.4326,
      lng: -99.1332,
      speedKmh: 4.5,
      course: 180,
      altitude: 2240,
      sats: 9,
      accuracyM: 12,
      batteryPct: 88,
      flags: [FLAG_LOW_ACCURACY],
    });
  });

  it('no expone received_ts, processed_ts, expires_at ni las claves de la tabla', () => {
    const mapped = toStoredPosition(ITEM) as unknown as Record<string, unknown>;

    expect(Object.keys(mapped).sort()).toEqual([
      'accuracyM',
      'altitude',
      'batteryPct',
      'course',
      'flags',
      'lat',
      'lng',
      'sats',
      'speedKmh',
      'ts',
    ]);
  });

  it('un atributo nuevo en la tabla no se filtra al cliente: la lista de campos es explicita', () => {
    const mapped = toStoredPosition({
      ...ITEM,
      atributo_futuro_del_pipeline: 'secreto',
    }) as unknown as Record<string, unknown>;

    expect(mapped.atributo_futuro_del_pipeline).toBeUndefined();
  });

  it('los opcionales que el pipeline dejo en null llegan como null', () => {
    const mapped = toStoredPosition({
      ...ITEM,
      speed_kmh: null,
      course: null,
      altitude: null,
      sats: null,
      accuracy_m: null,
      battery_pct: null,
    });

    expect(mapped.speedKmh).toBeNull();
    expect(mapped.course).toBeNull();
    expect(mapped.altitude).toBeNull();
    expect(mapped.sats).toBeNull();
    expect(mapped.accuracyM).toBeNull();
    expect(mapped.batteryPct).toBeNull();
  });

  it('un item sin flags se mapea a un array vacio, nunca undefined', () => {
    const { flags, ...withoutFlags } = ITEM;
    void flags;

    expect(toStoredPosition(withoutFlags).flags).toEqual([]);
  });

  it('ts sale del sort key de la tabla', () => {
    expect(toStoredPosition({ ...ITEM, sk: 42 }).ts).toBe(42);
  });
});
