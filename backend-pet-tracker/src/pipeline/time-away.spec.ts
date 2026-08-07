import { localDayRange } from './local-day';
import { computeTimeAwayMinutes } from './time-away';

const DAY = '2026-08-02';
const NEXT_DAY = '2026-08-03';
const TZ = 'UTC';

const range = localDayRange(DAY, TZ);
const nextRange = localDayRange(NEXT_DAY, TZ);

/** Instante `hh:mm` del dia local `day` en UTC. */
function at(day: string, hours: number, minutes = 0): number {
  const [year, month, date] = day.split('-').map(Number);
  return Date.UTC(year, month - 1, date, hours, minutes);
}

describe('R25: solape de los geofence_exit con el dia local, sin unir intervalos', () => {
  it('una salida de 09:00 a 11:30 aporta 150 minutos', () => {
    expect(
      computeTimeAwayMinutes(
        [{ openedAtMs: at(DAY, 9), closedAtMs: at(DAY, 11, 30) }],
        range,
      ),
    ).toBe(150);
  });

  it('dos salidas disjuntas de 60 y 30 minutos suman 90', () => {
    expect(
      computeTimeAwayMinutes(
        [
          { openedAtMs: at(DAY, 8), closedAtMs: at(DAY, 9) },
          { openedAtMs: at(DAY, 18), closedAtMs: at(DAY, 18, 30) },
        ],
        range,
      ),
    ).toBe(90);
  });

  it('ninguna salida es 0 — medido y nunca salio, no "no medible"', () => {
    expect(computeTimeAwayMinutes([], range)).toBe(0);
  });

  it('una fila cerrada antes del arranque del dia no aporta nada (nunca negativo)', () => {
    expect(
      computeTimeAwayMinutes(
        [
          {
            openedAtMs: at('2026-08-01', 20),
            closedAtMs: at('2026-08-01', 23),
          },
        ],
        range,
      ),
    ).toBe(0);
  });

  it('el clamp superior absorbe filas solapadas por desorden de timestamps', () => {
    const wholeDay = { openedAtMs: range.startMs, closedAtMs: range.endMs };

    expect(computeTimeAwayMinutes([wholeDay, wholeDay, wholeDay], range)).toBe(
      (range.endMs - range.startMs) / 60_000,
    );
  });
});

describe('R26: cruce de medianoche local y eventos abiertos, sin caso especial', () => {
  const overnight = {
    openedAtMs: at(DAY, 22),
    closedAtMs: at(NEXT_DAY, 2),
  };

  it('una salida 22:00 -> 02:00 aporta 120 a D y 120 a D+1, nunca 240 a uno solo', () => {
    expect(computeTimeAwayMinutes([overnight], range)).toBe(120);
    expect(computeTimeAwayMinutes([overnight], nextRange)).toBe(120);
  });

  it('un evento abierto aporta desde su apertura hasta el cierre del dia', () => {
    expect(
      computeTimeAwayMinutes(
        [{ openedAtMs: at(DAY, 21), closedAtMs: null }],
        range,
      ),
    ).toBe(180);
  });

  it('un evento abierto que empezo antes del dia aporta el dia entero', () => {
    expect(
      computeTimeAwayMinutes(
        [{ openedAtMs: at('2026-07-30', 10), closedAtMs: null }],
        range,
      ),
    ).toBe((range.endMs - range.startMs) / 60_000);
  });

  it('el resultado no depende del reloj: solo de los spans y del rango', () => {
    const first = computeTimeAwayMinutes([overnight], range);
    jest.useFakeTimers().setSystemTime(new Date('2030-01-01T00:00:00.000Z'));
    expect(computeTimeAwayMinutes([overnight], range)).toBe(first);
    jest.useRealTimers();
  });
});
