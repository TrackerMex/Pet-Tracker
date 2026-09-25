import { reminderPushBody } from './reminder-push-body';

describe('#125 R1: el cuerpo del push dice cuándo vence, en la zona del owner', () => {
  it.each([
    [
      '1 de octubre a las 09:00 en Ciudad de México (UTC-6)',
      '2026-10-01T15:00:00.000Z',
      'America/Mexico_City',
      'Recordatorio: Vacuna antirrábica · 1 de octubre a las 09:00',
    ],
    [
      'en UTC ya es 1 de octubre y en Ciudad de México sigue siendo 30 de septiembre (cruce de mes)',
      '2026-10-01T03:30:00.000Z',
      'America/Mexico_City',
      'Recordatorio: Vacuna antirrábica · 30 de septiembre a las 21:30',
    ],
    [
      'en UTC ya es 2027 y en Ciudad de México sigue siendo 31 de diciembre (cruce de año)',
      '2027-01-01T05:30:00.000Z',
      'America/Mexico_City',
      'Recordatorio: Vacuna antirrábica · 31 de diciembre a las 23:30',
    ],
    [
      'el mismo instante en una zona UTC',
      '2027-01-01T05:30:00.000Z',
      'UTC',
      'Recordatorio: Vacuna antirrábica · 1 de enero a las 05:30',
    ],
    [
      'en Kiritimati (UTC+14) ya es 1 de enero a las 00:30 (cruce de año hacia delante)',
      '2026-12-31T10:30:00.000Z',
      'Pacific/Kiritimati',
      'Recordatorio: Vacuna antirrábica · 1 de enero a las 00:30',
    ],
    [
      'sin owner (zona null) cae a UTC',
      '2026-10-01T15:00:00.000Z',
      null,
      'Recordatorio: Vacuna antirrábica · 1 de octubre a las 15:00',
    ],
    [
      'zona que no es IANA cae a UTC',
      '2026-10-01T15:00:00.000Z',
      'Not/A/Zone',
      'Recordatorio: Vacuna antirrábica · 1 de octubre a las 15:00',
    ],
  ] as [string, string, string | null, string][])(
    '%s',
    (_title, dueAt, timeZone, esperado) => {
      expect(
        reminderPushBody('Vacuna antirrábica', new Date(dueAt), timeZone),
      ).toBe(esperado);
    },
  );
});
