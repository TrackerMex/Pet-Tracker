import { alertSection } from './alert-sections';

const tabla = [
  { id: 'A1', tz: 'America/Mexico_City', now: '2027-01-01T05:30:00.000Z', openedAt: '2027-01-01T05:00:00.000Z', expected: 'today' },
  { id: 'A2', tz: 'America/Mexico_City', now: '2027-01-01T05:30:00.000Z', openedAt: '2026-12-31T06:30:00.000Z', expected: 'today' },
  { id: 'A3', tz: 'America/Mexico_City', now: '2027-01-01T05:30:00.000Z', openedAt: '2026-12-31T05:59:59.999Z', expected: 'week' },
  { id: 'A4', tz: 'America/Mexico_City', now: '2027-01-01T05:30:00.000Z', openedAt: '2026-12-25T06:00:00.000Z', expected: 'week' },
  { id: 'A5', tz: 'America/Mexico_City', now: '2027-01-01T05:30:00.000Z', openedAt: '2026-12-25T05:59:59.999Z', expected: 'earlier' },
  { id: 'B1', tz: 'America/Mexico_City', now: '2027-01-02T16:00:00.000Z', openedAt: '2027-01-02T06:00:00.000Z', expected: 'today' },
  { id: 'B2', tz: 'America/Mexico_City', now: '2027-01-02T16:00:00.000Z', openedAt: '2027-01-02T05:59:59.999Z', expected: 'week' },
  { id: 'B3', tz: 'America/Mexico_City', now: '2027-01-02T16:00:00.000Z', openedAt: '2026-12-27T06:00:00.000Z', expected: 'week' },
  { id: 'B4', tz: 'America/Mexico_City', now: '2027-01-02T16:00:00.000Z', openedAt: '2026-12-27T05:59:59.999Z', expected: 'earlier' },
  { id: 'C1', tz: 'America/Mexico_City', now: '2026-03-03T16:00:00.000Z', openedAt: '2026-02-25T06:00:00.000Z', expected: 'week' },
  { id: 'C2', tz: 'America/Mexico_City', now: '2026-03-03T16:00:00.000Z', openedAt: '2026-02-25T05:59:59.999Z', expected: 'earlier' },
  { id: 'D1', tz: 'America/New_York', now: '2026-03-10T14:00:00.000Z', openedAt: '2026-03-04T04:30:00.000Z', expected: 'earlier' },
  { id: 'D2', tz: 'America/New_York', now: '2026-03-10T14:00:00.000Z', openedAt: '2026-03-04T05:00:00.000Z', expected: 'week' },
  { id: 'F1', tz: 'America/Mexico_City', now: '2026-03-03T16:00:00.000Z', openedAt: '2026-03-03T18:00:00.000Z', expected: 'today' },
  { id: 'N1', tz: 'America/Mexico_City', now: '2026-03-03T16:00:00.000Z', openedAt: 'no-es-fecha', expected: 'earlier' },
] as const;

describe('#170 R2: alertSection en hora local', () => {
  it.each(tabla)('$id: $tz, ahora $now, abierta $openedAt → $expected', ({ tz, now, openedAt, expected }) => {
    const hostProcess = process.getBuiltinModule('process');
    const previous = hostProcess.env.TZ;
    try {
      hostProcess.env.TZ = tz;
      expect(alertSection(openedAt, new Date(now))).toBe(expected);
    } finally {
      if (previous === undefined) delete hostProcess.env.TZ;
      else hostProcess.env.TZ = previous;
    }
  });
});
