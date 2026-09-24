import { Platform } from 'react-native';

import { fromPickerValue, toPickerValue } from './date-picker-value';

const originalPlatform = Platform.OS;

function setPlatform(os: string): void {
  Object.defineProperty(Platform, 'OS', { configurable: true, value: os });
}

function wallClock(local: number[], utc: number[]): Date {
  return Object.assign(new Date(local[0], local[1], local[2], local[3], local[4]), {
    getUTCFullYear: () => utc[0],
    getUTCMonth: () => utc[1],
    getUTCDate: () => utc[2],
  });
}

describe('#123 R1: en Android, fromPickerValue convierte el día UTC del diálogo en día local', () => {
  beforeEach(() => setPlatform('android'));
  afterEach(() => setPlatform(originalPlatform));

  it.each([
    ['elegido el 24 de septiembre: en CDMX son las 18:00 del 23', [2026, 8, 23, 18, 0], [2026, 8, 24], [2026, 8, 24]],
    ['elegido el 1 de octubre: en CDMX son las 18:00 del 30 de septiembre (cruce de mes)', [2026, 8, 30, 18, 0], [2026, 9, 1], [2026, 9, 1]],
    ['elegido el 1 de enero de 2027: en CDMX son las 18:00 del 31 de diciembre (cruce de año)', [2026, 11, 31, 18, 0], [2027, 0, 1], [2027, 0, 1]],
    ['elegido el 24 de septiembre: en Honolulu son las 14:00 del 23', [2026, 8, 23, 14, 0], [2026, 8, 24], [2026, 8, 24]],
    ['elegido el 24 de septiembre: en Kiritimati son las 14:00 del 24', [2026, 8, 24, 14, 0], [2026, 8, 24], [2026, 8, 24]],
  ] as [string, number[], number[], number[]][])('%s', (_title, local, utc, esperado) => {
    const r = fromPickerValue(wallClock(local, utc));
    expect([r.getFullYear(), r.getMonth(), r.getDate()]).toEqual(esperado);
  });
});

describe('#123 R2: en Android, toPickerValue abre el diálogo en el día local', () => {
  beforeEach(() => setPlatform('android'));
  afterEach(() => setPlatform(originalPlatform));

  it.each([
    ['24 de septiembre a las 20:00 en CDMX (en UTC ya es el 25)', [2026, 8, 24, 20, 0], [2026, 8, 25], '2026-09-24T00:00:00.000Z'],
    ['30 de septiembre a las 20:00 en CDMX (en UTC ya es 1 de octubre)', [2026, 8, 30, 20, 0], [2026, 9, 1], '2026-09-30T00:00:00.000Z'],
    ['31 de diciembre a las 20:00 en CDMX (en UTC ya es 2027)', [2026, 11, 31, 20, 0], [2027, 0, 1], '2026-12-31T00:00:00.000Z'],
    ['1 de enero de 2027 a medianoche en CDMX (valor ya elegido, al reabrir)', [2027, 0, 1, 0, 0], [2027, 0, 1], '2027-01-01T00:00:00.000Z'],
    ['24 de septiembre a las 00:30 en Madrid (en UTC aún es el 23)', [2026, 8, 24, 0, 30], [2026, 8, 23], '2026-09-24T00:00:00.000Z'],
  ] as [string, number[], number[], string][])('%s', (_title, local, utc, esperado) => {
    expect(toPickerValue(wallClock(local, utc)).toISOString()).toBe(esperado);
  });
});

describe('#123 R3: fuera de Android las dos conversiones devuelven el mismo objeto', () => {
  beforeEach(() => setPlatform('ios'));
  afterEach(() => setPlatform(originalPlatform));

  it('ios: fromPickerValue devuelve el mismo Date', () => {
    const picked = wallClock([2026, 8, 23, 18, 0], [2026, 8, 24]);
    expect(fromPickerValue(picked)).toBe(picked);
  });

  it('ios: toPickerValue devuelve el mismo Date', () => {
    const day = wallClock([2026, 8, 24, 20, 0], [2026, 8, 25]);
    expect(toPickerValue(day)).toBe(day);
  });
});
