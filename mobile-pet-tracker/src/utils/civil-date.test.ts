import { hhmmToLocalDate, isoToLocalDate, localDateToIso, timeToHhmm } from './civil-date';

describe('#220 R1: utilidades de fecha y hora civiles', () => {
  afterEach(() => jest.useRealTimers());

  it.each([
    [new Date(2026, 0, 5, 23, 59), '2026-01-05'],
    [new Date(2026, 8, 30, 23, 59), '2026-09-30'],
    [new Date(2026, 9, 1), '2026-10-01'],
    [new Date(2026, 11, 31), '2026-12-31'],
    [new Date(2027, 0, 1), '2027-01-01'],
  ])('#220 R1: localDateToIso(%s) devuelve %s', (date, expected) => {
    expect(localDateToIso(date)).toBe(expected);
  });

  it('#220 R1: los formatos leen campos locales aunque UTC sea otro día', () => {
    const date = Object.assign(new Date(2026, 8, 24), {
      getFullYear: () => 2027, getMonth: () => 0, getDate: () => 1,
      getHours: () => 7, getMinutes: () => 5,
    });
    expect(localDateToIso(date)).toBe('2027-01-01');
    expect(timeToHhmm(date)).toBe('07:05');
  });

  it.each([
    ['2026-01-05', 2026, 0, 5], ['2026-10-01', 2026, 9, 1],
    ['2026-12-31', 2026, 11, 31], ['2027-01-01', 2027, 0, 1],
    ['2024-02-29', 2024, 1, 29],
  ])('#220 R1: isoToLocalDate(%s) devuelve medianoche local', (iso, y, m, d) => {
    expect(isoToLocalDate(iso)?.getTime()).toBe(new Date(y, m, d).getTime());
  });

  it.each(['', 'bad', '2026-9-4', '2026-02-30', '2026-13-01', '2026-00-01', '2026-01-00', ' 2026-01-05 '])(
    '#220 R1: isoToLocalDate rechaza %s', (iso) => expect(isoToLocalDate(iso)).toBeNull(),
  );

  it.each([[7, 5, '07:05'], [0, 0, '00:00'], [23, 59, '23:59']])(
    '#220 R1: timeToHhmm rellena %s:%s como %s', (hour, minute, expected) => {
      expect(timeToHhmm(new Date(2026, 8, 24, Number(hour), Number(minute)))).toBe(expected);
    },
  );

  it('#220 R1: hhmmToLocalDate usa hoy y limpia segundos y milisegundos', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 8, 24, 20, 0, 45, 123));
    expect(hhmmToLocalDate('09:05')?.getTime()).toBe(new Date(2026, 8, 24, 9, 5).getTime());
    jest.setSystemTime(new Date(2027, 0, 1, 0, 1));
    expect(hhmmToLocalDate('23:59')?.getTime()).toBe(new Date(2027, 0, 1, 23, 59).getTime());
  });

  it.each(['', '24:00', '9:00', '09:60', '09:05:00', ' 09:05 '])(
    '#220 R1: hhmmToLocalDate rechaza %s', (hhmm) => expect(hhmmToLocalDate(hhmm)).toBeNull(),
  );
});
