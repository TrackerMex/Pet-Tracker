import * as formats from '../format';

describe('#199 R11: fmtDayMonth', () => {
  it.each([
    ['2025-12-31', 'es', '31 dic'],
    ['2026-01-01', 'es', '1 ene'],
    ['2026-10-01', 'es', '1 oct'],
    ['2026-01-01', 'en', 'Jan 1'],
  ])('#199 R11 %s en %s se lee %s', (date, locale, expected) => {
    const format = (formats as Record<string, unknown>).fmtDayMonth;
    expect(format).toEqual(expect.any(Function));
    expect((format as (date: string, locale: string) => string)(date, locale)).toBe(expected);
  });
});
