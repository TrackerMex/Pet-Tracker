import { addCalendarMonths } from './vaccine-date';

describe('R6: suma de meses calendario', () => {
  it('clampa al ultimo dia valido del mes', () => {
    expect(addCalendarMonths('2024-02-29', 12)).toBe('2025-02-28');
    expect(addCalendarMonths('2025-01-31', 1)).toBe('2025-02-28');
  });
});
