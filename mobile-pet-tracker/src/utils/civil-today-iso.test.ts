import { civilTodayIso } from './civil-today-iso';

const instant = new Date('2026-09-17T23:30:00Z');

function deviceDayIso(now: Date): string {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

describe('#90 R1: civilTodayIso devuelve el día civil de una zona y cae al dispositivo', () => {
  afterEach(() => jest.useRealTimers());

  it.each([
    ['Pacific/Kiritimati', '2026-09-18'],
    ['Pacific/Pago_Pago', '2026-09-17'],
  ])('resuelve el mismo instante en %s como %s', (timeZone, expected) => {
    expect(civilTodayIso(timeZone, instant)).toBe(expected);
  });

  it('rellena mes y día con cero', () => {
    expect(civilTodayIso('UTC', new Date('2026-01-05T12:00:00Z'))).toBe(
      '2026-01-05',
    );
  });

  it('usa el día del dispositivo sin zona', () => {
    expect(civilTodayIso(undefined, instant)).toBe(deviceDayIso(instant));
  });

  it('usa el día del dispositivo sin lanzar para una zona inválida', () => {
    expect(() => civilTodayIso('Not/A/Zone', instant)).not.toThrow();
    expect(civilTodayIso('Not/A/Zone', instant)).toBe(deviceDayIso(instant));
  });

  it('usa new Date() cuando now no se proporciona', () => {
    jest.useFakeTimers();
    jest.setSystemTime(instant);

    expect(civilTodayIso('Pacific/Kiritimati')).toBe('2026-09-18');
  });
});
