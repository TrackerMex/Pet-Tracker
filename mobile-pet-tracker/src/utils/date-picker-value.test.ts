import { Platform } from 'react-native';

import { fromPickerValue } from './date-picker-value';

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
