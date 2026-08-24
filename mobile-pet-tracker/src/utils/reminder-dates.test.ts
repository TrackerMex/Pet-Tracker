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
    ['positive', new Date('2026-08-25T09:00:01.000Z'), 2],
    ['negative', new Date('2026-08-23T08:59:59.000Z'), -1],
  ])('returns a %s integer', (_case, to, expected) => {
    const from = new Date('2026-08-24T09:00:00.000Z');

    expect(daysUntil(from, to)).toBe(expected);
  });
});
