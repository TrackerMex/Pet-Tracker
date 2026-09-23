import { combineDateAndTime, daysUntil } from './reminder-dates';

describe('R4: reminder-dates combina y cuenta días', () => {
  it('combines the local calendar date and local time without seconds', () => {
    const date = new Date(2026, 7, 30, 22, 45, 33, 456);
    const time = new Date(2020, 1, 2, 9, 15, 58, 999);

    const combined = combineDateAndTime(date, time);

    expect(combined.getFullYear()).toBe(2026);
    expect(combined.getMonth()).toBe(7);
    expect(combined.getDate()).toBe(30);
    expect(combined.getHours()).toBe(9);
    expect(combined.getMinutes()).toBe(15);
    expect(combined.getSeconds()).toBe(0);
    expect(combined.getMilliseconds()).toBe(0);
  });

  it.each([
    ['zero', new Date('2026-08-24T09:00:00.000Z'), 0],
    ['positive', new Date('2026-08-25T09:00:01.000Z'), 1],
    ['negative', new Date('2026-08-23T08:59:59.000Z'), -1],
  ])('returns a %s integer', (_case, to, expected) => {
    const from = new Date('2026-08-24T09:00:00.000Z');

    expect(daysUntil(from, to)).toBe(expected);
  });
});

describe('#84 R1: daysUntil cuenta días de calendario locales, no bloques de 24 h', () => {
  it.each([
    ['mismo día, hora posterior = 0', new Date(2026, 8, 10, 8, 0), new Date(2026, 8, 10, 9, 0), 0],
    ['mismo día, hora anterior = 0 positivo', new Date(2026, 8, 10, 9, 0), new Date(2026, 8, 10, 8, 0), 0],
    ['de 00:00 a 23:59 del mismo día = 0', new Date(2026, 8, 10, 0, 0), new Date(2026, 8, 10, 23, 59), 0],
    ['de 23:30 a 00:30 del día siguiente = 1', new Date(2026, 8, 10, 23, 30), new Date(2026, 8, 11, 0, 30), 1],
    ['de 08:00 a 07:00 del día siguiente = 1', new Date(2026, 8, 10, 8, 0), new Date(2026, 8, 11, 7, 0), 1],
    ['de 08:00 a 09:00 del día siguiente = 1', new Date(2026, 8, 10, 8, 0), new Date(2026, 8, 11, 9, 0), 1],
    ['ayer a hora posterior = -1', new Date(2026, 8, 10, 9, 0), new Date(2026, 8, 9, 10, 0), -1],
    ['ayer a hora anterior = -1', new Date(2026, 8, 10, 9, 0), new Date(2026, 8, 9, 8, 0), -1],
    ['borde de la semana: +7 días a hora posterior = 7', new Date(2026, 8, 10, 8, 0), new Date(2026, 8, 17, 9, 0), 7],
    ['borde del badge: +10 días a hora posterior = 10', new Date(2026, 8, 10, 8, 0), new Date(2026, 8, 20, 9, 0), 10],
  ])('%s', (_title, from, to, expected) => {
    expect(daysUntil(from, to)).toBe(expected);
  });
});

describe('#84 R2: la zona horaria no desplaza la cuenta de días', () => {
  function skewed(localDay: number, iso: string): Date {
    const instant = new Date(iso);
    return {
      getFullYear: () => 2026,
      getMonth: () => 8,
      getDate: () => localDay,
      getUTCFullYear: () => instant.getUTCFullYear(),
      getUTCMonth: () => instant.getUTCMonth(),
      getUTCDate: () => instant.getUTCDate(),
      getTime: () => instant.getTime(),
    } as unknown as Date;
  }

  const a = skewed(10, '2026-09-10T14:00:00.000Z');
  const b = skewed(10, '2026-09-11T02:00:00.000Z');
  const c = skewed(11, '2026-09-11T15:00:00.000Z');

  it.each([
    ['Ciudad de México, 08:00 → 20:00 del mismo día = 0', a, b, 0],
    ['Ciudad de México, 20:00 → 09:00 del día siguiente = 1', b, c, 1],
    ['Ciudad de México, 20:00 → 08:00 del mismo día = 0', b, a, 0],
  ])('%s', (_title, from, to, expected) => {
    expect(daysUntil(from, to)).toBe(expected);
  });
});
