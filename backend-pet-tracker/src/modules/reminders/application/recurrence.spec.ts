import { InvalidRecurrenceError } from '@/modules/reminders/domain/errors/reminder.errors';
import { assertValidRecurrence, nextOccurrence } from './recurrence';

describe('#210 R3: reglas cruzadas', () => {
  it.each([
    [
      'until sin recurrence',
      '2026-11-01T15:00:00.000Z',
      null,
      '2026-12-01',
      'UTC',
      true,
    ],
    [
      'until el día anterior',
      '2026-11-01T15:00:00.000Z',
      { unit: 'day', every: 1 },
      '2026-10-31',
      'UTC',
      true,
    ],
    [
      'until el mismo día local',
      '2026-11-01T15:00:00.000Z',
      { unit: 'day', every: 1 },
      '2026-11-01',
      'UTC',
      false,
    ],
    [
      'zona del dueño decide (MX)',
      '2026-11-02T03:00:00.000Z',
      { unit: 'day', every: 1 },
      '2026-11-01',
      'America/Mexico_City',
      false,
    ],
    [
      'zona del dueño decide (UTC)',
      '2026-11-02T03:00:00.000Z',
      { unit: 'day', every: 1 },
      '2026-11-01',
      'UTC',
      true,
    ],
    [
      'serie sin until',
      '2026-11-01T15:00:00.000Z',
      { unit: 'day', every: 1 },
      null,
      'UTC',
      false,
    ],
  ] as const)(
    '#210 R3: assertValidRecurrence %s',
    (_label, due, recurrence, until, zone, throws) => {
      const validate = () =>
        assertValidRecurrence(new Date(due), recurrence, until, zone);
      if (throws) expect(validate).toThrow(InvalidRecurrenceError);
      else expect(validate).not.toThrow();
    },
  );
});

describe('#210 R7: ocurrencias desde el ancla', () => {
  it.each([
    [
      'hour',
      8,
      'UTC',
      '2026-12-31T20:00:00.000Z',
      '2026-12-31T20:00:00.000Z',
      '2027-01-01T04:00:00.000Z',
    ],
    [
      'day',
      1,
      'UTC',
      '2026-12-31T09:00:00.000Z',
      '2026-12-31T09:00:00.000Z',
      '2027-01-01T09:00:00.000Z',
    ],
    [
      'day',
      3,
      'America/Mexico_City',
      '2026-01-30T15:00:00.000Z',
      '2026-01-30T15:00:00.000Z',
      '2026-02-02T15:00:00.000Z',
    ],
    [
      'week',
      2,
      'UTC',
      '2026-12-24T15:00:00.000Z',
      '2026-12-24T15:00:00.000Z',
      '2027-01-07T15:00:00.000Z',
    ],
    [
      'month',
      1,
      'UTC',
      '2026-01-31T15:00:00.000Z',
      '2026-01-31T15:00:00.000Z',
      '2026-02-28T15:00:00.000Z',
    ],
    [
      'month',
      1,
      'UTC',
      '2026-01-31T15:00:00.000Z',
      '2026-02-28T15:00:00.000Z',
      '2026-03-31T15:00:00.000Z',
    ],
    [
      'month',
      1,
      'UTC',
      '2026-01-31T15:00:00.000Z',
      '2026-03-31T15:00:00.000Z',
      '2026-04-30T15:00:00.000Z',
    ],
    [
      'month',
      2,
      'UTC',
      '2026-12-31T15:00:00.000Z',
      '2026-12-31T15:00:00.000Z',
      '2027-02-28T15:00:00.000Z',
    ],
    [
      'year',
      1,
      'UTC',
      '2028-02-29T15:00:00.000Z',
      '2028-02-29T15:00:00.000Z',
      '2029-02-28T15:00:00.000Z',
    ],
    [
      'year',
      1,
      'UTC',
      '2028-02-29T15:00:00.000Z',
      '2031-02-28T15:00:00.000Z',
      '2032-02-29T15:00:00.000Z',
    ],
    [
      'year',
      3,
      'UTC',
      '2026-12-31T15:00:00.000Z',
      '2026-12-31T15:00:00.000Z',
      '2029-12-31T15:00:00.000Z',
    ],
  ] as const)(
    '#210 R7: %s %s desde %s da %s',
    (unit, every, zone, anchor, due, expected) => {
      const dueAt = new Date(due);
      expect(
        nextOccurrence(
          {
            dueAt,
            advanceMinutes: 60,
            recurrence: {
              unit,
              every,
              anchorAt: new Date(anchor),
              until: null,
            },
          },
          new Date(dueAt.getTime() - 3_600_000),
          zone,
        )?.toISOString(),
      ).toBe(expected);
    },
  );
});

describe('#210 R8: ocurrencias desde el ancla', () => {
  it.each([
    [
      'day',
      1,
      'America/New_York',
      '2026-03-07T15:00:00.000Z',
      '2026-03-07T15:00:00.000Z',
      '2026-03-08T14:00:00.000Z',
    ],
    [
      'day',
      1,
      'America/New_York',
      '2026-10-31T14:00:00.000Z',
      '2026-10-31T14:00:00.000Z',
      '2026-11-01T15:00:00.000Z',
    ],
    [
      'day',
      1,
      'America/Mexico_City',
      '2026-03-07T16:00:00.000Z',
      '2026-03-07T16:00:00.000Z',
      '2026-03-08T16:00:00.000Z',
    ],
    [
      'day',
      1,
      'America/New_York',
      '2026-03-07T07:30:00.000Z',
      '2026-03-07T07:30:00.000Z',
      '2026-03-08T07:30:00.000Z',
    ],
    [
      'day',
      1,
      'America/New_York',
      '2026-03-07T07:30:00.000Z',
      '2026-03-08T07:30:00.000Z',
      '2026-03-09T06:30:00.000Z',
    ],
    [
      'day',
      1,
      'America/New_York',
      '2026-10-31T05:30:00.000Z',
      '2026-10-31T05:30:00.000Z',
      '2026-11-01T05:30:00.000Z',
    ],
    [
      'hour',
      1,
      'America/New_York',
      '2026-11-01T05:30:00.000Z',
      '2026-11-01T05:30:00.000Z',
      '2026-11-01T06:30:00.000Z',
    ],
    [
      'hour',
      24,
      'America/New_York',
      '2026-03-07T15:00:00.000Z',
      '2026-03-07T15:00:00.000Z',
      '2026-03-08T15:00:00.000Z',
    ],
    [
      'month',
      1,
      'America/Mexico_City',
      '2026-01-31T05:30:00.000Z',
      '2026-01-31T05:30:00.000Z',
      '2026-03-01T05:30:00.000Z',
    ],
  ] as const)(
    '#210 R8: %s %s en %s desde %s da %s',
    (unit, every, zone, anchor, due, expected) => {
      const dueAt = new Date(due);
      expect(
        nextOccurrence(
          {
            dueAt,
            advanceMinutes: 60,
            recurrence: {
              unit,
              every,
              anchorAt: new Date(anchor),
              until: null,
            },
          },
          new Date(dueAt.getTime() - 3_600_000),
          zone,
        )?.toISOString(),
      ).toBe(expected);
    },
  );
});

describe('#210 R9: primera ocurrencia con aviso futuro', () => {
  it.each([
    [
      'day 1 aviso 60 now 2027-01-04T12:00:00.000Z',
      'day',
      1,
      60,
      '2026-12-25T09:00:00.000Z',
      '2027-01-04T12:00:00.000Z',
      '2027-01-05T09:00:00.000Z',
    ],
    [
      'hour 1 aviso 30 now 2027-01-01T00:40:00.000Z',
      'hour',
      1,
      30,
      '2026-12-31T22:00:00.000Z',
      '2027-01-01T00:40:00.000Z',
      '2027-01-01T02:00:00.000Z',
    ],
    [
      'hour 1 aviso 30 now 2026-12-31T22:30:00.000Z',
      'hour',
      1,
      30,
      '2026-12-31T22:00:00.000Z',
      '2026-12-31T22:30:00.000Z',
      '2027-01-01T00:00:00.000Z',
    ],
    [
      'day 1 aviso 10080 now 2026-12-18T09:00:00.000Z',
      'day',
      1,
      10080,
      '2026-12-25T09:00:00.000Z',
      '2026-12-18T09:00:00.000Z',
      '2026-12-26T09:00:00.000Z',
    ],
  ] as const)(
    '#210 R9: %s',
    (_label, unit, every, advanceMinutes, anchor, now, expected) => {
      expect(
        nextOccurrence(
          {
            dueAt: new Date(anchor),
            advanceMinutes,
            recurrence: {
              unit,
              every,
              anchorAt: new Date(anchor),
              until: null,
            },
          },
          new Date(now),
          'UTC',
        )?.toISOString(),
      ).toBe(expected);
    },
  );
});

describe('#210 R10: until inclusivo', () => {
  it.each([
    ['2026-11-01', 'America/Mexico_City', '2026-11-02T03:00:00.000Z'],
    ['2026-10-31', 'America/Mexico_City', null],
    ['2026-11-01', 'UTC', null],
    [null, 'America/Mexico_City', '2026-11-02T03:00:00.000Z'],
  ] as const)('#210 R10: until %s en %s da %s', (until, zone, expected) => {
    const dueAt = new Date('2026-10-31T03:00:00.000Z');
    const result = nextOccurrence(
      {
        dueAt,
        advanceMinutes: 60,
        recurrence: {
          unit: 'day',
          every: 2,
          anchorAt: dueAt,
          until,
        },
      },
      new Date(dueAt.getTime() - 3_600_000),
      zone,
    );
    if (expected === null) expect(result).toBeNull();
    else expect(result?.toISOString()).toBe(expected);
  });
});
