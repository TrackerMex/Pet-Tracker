import { currentMonth, longDayLabel, monthGrid, monthOf, monthRange, monthTitle, shiftMonth, weekdayHeaders } from '../month-grid';

describe('#105 R10: pure Monday-first month arithmetic', () => {
  it('extracts the month from a civil day', () => {
    expect(monthOf('2026-01-15')).toBe('2026-01');
  });
  it('shifts across months and years in both directions', () => {
    expect(shiftMonth('2026-01', -1)).toBe('2025-12');
    expect(shiftMonth('2025-12', 1)).toBe('2026-01');
    expect(shiftMonth('2026-01', -13)).toBe('2024-12');
  });
  it('returns the natural month range including leap days', () => {
    expect(monthRange('2026-02')).toEqual({ from: '2026-02-01', to: '2026-02-28' });
    expect(monthRange('2028-02')).toEqual({ from: '2028-02-01', to: '2028-02-29' });
    expect(monthRange('2025-12')).toEqual({ from: '2025-12-01', to: '2025-12-31' });
  });
  it.each([
    ['2025-12', 35, 0, 31, 4],
    ['2026-01', 35, 3, 31, 1],
    ['2026-02', 35, 6, 28, 1],
    ['2028-02', 35, 1, 29, 5],
    ['2026-08', 42, 5, 31, 6],
  ] as const)('fills the Monday-first grid for %s', (month, length, leading, days, trailing) => {
    const grid = monthGrid(month);
    expect(grid).toHaveLength(length);
    expect(grid.slice(0, leading)).toEqual(Array(leading).fill(null));
    expect(grid.slice(leading, leading + days)).toEqual(Array.from({ length: days }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`));
    expect(grid.slice(-trailing)).toEqual(Array(trailing).fill(null));
  });
  it('labels seven weekdays Monday first using UTC in either locale', () => {
    for (const locale of ['es-MX', 'en-US']) {
      expect(weekdayHeaders(locale)).toEqual(Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(2024, 0, 1 + i)).toLocaleDateString(locale, { weekday: 'short', timeZone: 'UTC' })));
    }
  });
  it('formats a localized month title', () => {
    expect(monthTitle('2025-12', 'es-MX')).toBe('diciembre de 2025');
    expect(monthTitle('2026-01', 'en-US')).toBe('January 2026');
  });
  it('formats a localized long day label', () => {
    expect(longDayLabel('2026-01-05', 'es-MX')).toBe('lunes, 5 de enero');
  });
  it('seeds the month from the device clock', () => {
    expect(currentMonth(new Date(2026, 0, 15, 12))).toBe('2026-01');
  });
});
