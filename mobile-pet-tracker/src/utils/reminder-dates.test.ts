import type { Reminder } from '../api/types';

import { combineDateAndTime, daysUntil, splitReminders } from './reminder-dates';

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
    ['zero', new Date(2026, 7, 24, 9, 0, 0), 0],
    ['positive', new Date(2026, 7, 25, 9, 0, 1), 1],
    ['negative', new Date(2026, 7, 23, 8, 59, 59), -1],
  ])('returns a %s integer', (_case, to, expected) => {
    const from = new Date(2026, 7, 24, 9, 0, 0);

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

describe('#84 R5: el día civil incluye el mes y el año (Enmienda E1)', () => {
  function skewed(localYear: number, localMonth: number, localDay: number, iso: string): Date {
    const instant = new Date(iso);
    return {
      getFullYear: () => localYear,
      getMonth: () => localMonth,
      getDate: () => localDay,
      getUTCFullYear: () => instant.getUTCFullYear(),
      getUTCMonth: () => instant.getUTCMonth(),
      getUTCDate: () => instant.getUTCDate(),
      getTime: () => instant.getTime(),
    } as unknown as Date;
  }

  it.each([
    ['fin de mes: 30 de septiembre 20:00 → 1 de octubre 09:00 = 1', new Date(2026, 8, 30, 20, 0), new Date(2026, 9, 1, 9, 0), 1],
    ['fin de año: 31 de diciembre 23:30 → 1 de enero 00:30 = 1', new Date(2026, 11, 31, 23, 30), new Date(2027, 0, 1, 0, 30), 1],
    ['Ciudad de México, 31 de diciembre 20:00 → 1 de enero 09:00 = 1', skewed(2026, 11, 31, '2027-01-01T02:00:00.000Z'), skewed(2027, 0, 1, '2027-01-01T15:00:00.000Z'), 1],
  ])('%s', (_title, from, to, expected) => {
    expect(daysUntil(from, to)).toBe(expected);
  });
});


function reminder(id: string, status: Reminder['status'], due: Date): Reminder {
  return { id, petId: 'pet-1', type: 'vaccine', title: id, status,
    dueAt: due.toISOString(), advanceMinutes: 0, recurrence: null, recurrenceUntil: null };
}

describe('#227 R2: partición por día civil y status', () => {
  beforeEach(() => { jest.useFakeTimers({ now: new Date(2026, 11, 30, 8, 0) }); });
  afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

  it.each([
    ['programado hoy más tarde es próximo', new Date(2026, 11, 30, 8, 0), 'scheduled', new Date(2026, 11, 30, 23, 0), 'upcoming'],
    ['programado hoy más temprano sigue siendo próximo', new Date(2026, 11, 30, 10, 0), 'scheduled', new Date(2026, 11, 30, 7, 0), 'upcoming'],
    ['programado ayer es pasado', new Date(2026, 11, 30, 8, 0), 'scheduled', new Date(2026, 11, 29, 9, 0), 'past'],
    ['el 31 de diciembre es pasado el 1 de enero', new Date(2027, 0, 1, 8, 0), 'scheduled', new Date(2026, 11, 31, 23, 0), 'past'],
    ['el 1 de enero es próximo el 31 de diciembre', new Date(2026, 11, 31, 22, 0), 'scheduled', new Date(2027, 0, 1, 0, 30), 'upcoming'],
    ['enviado el 30 de septiembre es pasado el 1 de octubre', new Date(2026, 9, 1, 8, 0), 'sent', new Date(2026, 8, 30, 20, 0), 'past'],
    ['cancelado mañana es pasado', new Date(2026, 11, 30, 8, 0), 'cancelled', new Date(2026, 11, 31, 9, 0), 'past'],
    ['cancelado hoy es pasado', new Date(2026, 11, 30, 8, 0), 'cancelled', new Date(2026, 11, 30, 23, 0), 'past'],
    ['enviado con fecha de mañana es próximo', new Date(2026, 11, 30, 8, 0), 'sent', new Date(2026, 11, 31, 9, 0), 'upcoming'],
  ] as const)('#227 R2: %s', (_title, now, status, due, section) => {
    expect(splitReminders).toEqual(expect.any(Function));
    const r = reminder('r', status, due);
    const result = splitReminders([r], now);
    expect(result.upcoming.map(({ id }) => id)).toEqual(section === 'upcoming' ? ['r'] : []);
    expect(result.past.map(({ id }) => id)).toEqual(section === 'past' ? ['r'] : []);
  });
});

describe('#227 R3: orden de las secciones', () => {
  beforeEach(() => { jest.useFakeTimers({ now: new Date(2026, 11, 30, 8, 0) }); });
  afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

  it('#227 R3: ordena próximos ascendente y pasados descendente, con empate por id', () => {
    const input = [
      reminder('p-c', 'scheduled', new Date(2026, 11, 29, 9, 0)),
      reminder('u-b', 'scheduled', new Date(2027, 0, 2, 9, 0)),
      reminder('p-a', 'sent', new Date(2026, 11, 3, 9, 0)),
      reminder('u-c', 'sent', new Date(2027, 0, 1, 0, 30)),
      reminder('p-b', 'cancelled', new Date(2027, 0, 21, 9, 0)),
      reminder('u-a2', 'scheduled', new Date(2027, 0, 2, 9, 0)),
      reminder('p-0', 'scheduled', new Date(2026, 11, 29, 9, 0)),
      reminder('u-a', 'scheduled', new Date(2026, 11, 30, 23, 0)),
    ];
    const original = [...input];
    const { upcoming, past } = splitReminders(input, new Date(2026, 11, 30, 8, 0));
    expect(upcoming.map(({ id }) => id)).toEqual(['u-a', 'u-c', 'u-a2', 'u-b']);
    expect(past.map(({ id }) => id)).toEqual(['p-b', 'p-0', 'p-c', 'p-a']);
    expect(input).toEqual(original);
  });
});
