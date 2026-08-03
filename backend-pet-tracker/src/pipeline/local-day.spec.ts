import { readFileSync } from 'fs';
import { join } from 'path';
import {
  InvalidTimeZoneError,
  isCalendarDate,
  listDays,
  localDayOf,
  localDayRange,
  shiftDay,
} from './local-day';

const HOUR_MS = 3_600_000;

describe('R7: localDayOf / localDayRange con Intl, sin dependencia nueva', () => {
  it('una posicion de las 23:50 en America/Mexico_City cae en su dia local', () => {
    expect(
      localDayOf(Date.parse('2026-08-03T05:50:00.000Z'), 'America/Mexico_City'),
    ).toBe('2026-08-02');
  });

  it('el mismo instante en UTC cae en el dia siguiente', () => {
    expect(localDayOf(Date.parse('2026-08-03T05:50:00.000Z'), 'UTC')).toBe(
      '2026-08-03',
    );
  });

  it('el dia del cambio de horario de primavera dura 23 h', () => {
    const { startMs, endMs } = localDayRange('2026-03-29', 'Europe/Madrid');

    expect(endMs - startMs).toBe(82_800_000);
  });

  it('el dia del cambio de horario de otoño dura 25 h', () => {
    const { startMs, endMs } = localDayRange('2026-10-25', 'Europe/Madrid');

    expect(endMs - startMs).toBe(90_000_000);
  });

  it('endMs es el startMs del dia siguiente, nunca startMs + 86_400_000', () => {
    for (const day of ['2026-03-29', '2026-10-25', '2026-08-02']) {
      const range = localDayRange(day, 'Europe/Madrid');
      const next = localDayRange(nextDay(day), 'Europe/Madrid');

      expect(range.endMs).toBe(next.startMs);
    }
  });

  it('el rango es semiabierto: startMs pertenece al dia y endMs ya no', () => {
    const day = '2026-10-25';
    const { startMs, endMs } = localDayRange(day, 'Europe/Madrid');

    expect(localDayOf(startMs, 'Europe/Madrid')).toBe(day);
    expect(localDayOf(startMs - 1, 'Europe/Madrid')).toBe('2026-10-24');
    expect(localDayOf(endMs, 'Europe/Madrid')).toBe('2026-10-26');
    expect(localDayOf(endMs - 1, 'Europe/Madrid')).toBe(day);
  });

  it('una medianoche local inexistente (salto de primavera) arranca en el salto', () => {
    // America/Santiago adelanta a las 00:00: el dia local empieza a la 01:00.
    const day = '2026-09-06';
    const { startMs, endMs } = localDayRange(day, 'America/Santiago');

    expect(localDayOf(startMs, 'America/Santiago')).toBe(day);
    expect(localDayOf(startMs - 1, 'America/Santiago')).toBe('2026-09-05');
    expect(endMs - startMs).toBe(23 * HOUR_MS);
  });

  it('UTC es una zona valida: es el fallback de R13 y el default del schema', () => {
    const { startMs, endMs } = localDayRange('2026-08-02', 'UTC');

    expect(startMs).toBe(Date.parse('2026-08-02T00:00:00.000Z'));
    expect(endMs).toBe(Date.parse('2026-08-03T00:00:00.000Z'));
  });

  it('una zona fuera del catalogo IANA lanza InvalidTimeZoneError', () => {
    expect(() => localDayOf(Date.now(), 'Marte/Olympus')).toThrow(
      InvalidTimeZoneError,
    );
    expect(() => localDayRange('2026-08-02', 'Marte/Olympus')).toThrow(
      InvalidTimeZoneError,
    );
  });

  it('el invariante se sostiene en las 418 zonas del catalogo y en los 4 dias de cambio', () => {
    const days = ['2026-03-08', '2026-03-29', '2026-10-25', '2026-11-01'];
    const offenders: string[] = [];

    for (const timeZone of Intl.supportedValuesOf('timeZone')) {
      for (const day of days) {
        const { startMs, endMs } = localDayRange(day, timeZone);
        const duration = endMs - startMs;

        if (
          localDayOf(startMs, timeZone) !== day ||
          localDayOf(startMs - 1, timeZone) === day ||
          localDayOf(endMs, timeZone) === day ||
          localDayOf(endMs - 1, timeZone) !== day ||
          duration < 22 * HOUR_MS ||
          duration > 26 * HOUR_MS
        ) {
          offenders.push(`${timeZone} ${day} (${duration} ms)`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it('isCalendarDate rechaza formatos y fechas que no existen', () => {
    expect(isCalendarDate('2026-08-02')).toBe(true);
    expect(isCalendarDate('2026-02-28')).toBe(true);
    expect(isCalendarDate('2026-02-30')).toBe(false);
    expect(isCalendarDate('2026-13-01')).toBe(false);
    expect(isCalendarDate('2026-8-2')).toBe(false);
    expect(isCalendarDate('02/08/2026')).toBe(false);
    expect(isCalendarDate('2026-08-02T00:00:00Z')).toBe(false);
  });

  it('shiftDay y listDays hacen aritmetica de calendario sin huecos', () => {
    expect(shiftDay('2026-03-01', -1)).toBe('2026-02-28');
    expect(shiftDay('2026-12-31', 1)).toBe('2027-01-01');
    expect(shiftDay('2026-08-02', -7)).toBe('2026-07-26');
    expect(listDays('2026-02-27', '2026-03-02')).toEqual([
      '2026-02-27',
      '2026-02-28',
      '2026-03-01',
      '2026-03-02',
    ]);
    expect(listDays('2026-08-02', '2026-08-02')).toEqual(['2026-08-02']);
    expect(listDays('2026-08-03', '2026-08-02')).toEqual([]);
  });

  it('local-day.ts no importa nada: nucleo puro sin @nestjs/common', () => {
    const source = readFileSync(join(__dirname, 'local-day.ts'), 'utf-8');

    expect(source).not.toMatch(/^import\s/m);
    expect(source).not.toMatch(/require\(/);
  });
});

function nextDay(day: string): string {
  const [year, month, date] = day.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, date + 1))
    .toISOString()
    .slice(0, 10);
}
