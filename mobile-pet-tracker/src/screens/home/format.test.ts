import { calendarDaysUntil, fmtDate, fmtKg } from './format';

describe('#69 R2: fmtKg', () => {
  it('uses a dash when the weight is missing', () => {
    expect(fmtKg(null)).toBe('—');
  });

  it('keeps integer weights free of forced decimals', () => {
    expect(fmtKg(12)).toBe('12 kg');
  });

  it('preserves decimal weights', () => {
    expect(fmtKg(12.4)).toBe('12.4 kg');
  });
});

describe('#70 R4: calendarDaysUntil cuenta días de calendario', () => {
  it('cuenta futuro, mañana, hoy y pasado', () => {
    const now = new Date(2026, 8, 10, 12, 0);

    expect(calendarDaysUntil('2026-09-15', now)).toBe(5);
    expect(calendarDaysUntil('2026-09-11', now)).toBe(1);
    expect(calendarDaysUntil('2026-09-10', now)).toBe(0);
    expect(calendarDaysUntil('2026-09-08', now)).toBe(-2);
  });

  describe('#70 R5: la zona horaria no desplaza fechas', () => {
    it('no se desplaza un día en una zona horaria negativa', () => {
      const previousTimezone = process.env.TZ;

      try {
        process.env.TZ = 'America/Mexico_City';

        expect(
          calendarDaysUntil('2026-09-15', new Date(2026, 8, 10, 23, 30)),
        ).toBe(5);
        expect(
          calendarDaysUntil('2026-09-15', new Date(2026, 8, 10, 0, 30)),
        ).toBe(5);
      } finally {
        if (previousTimezone === undefined) {
          delete process.env.TZ;
        } else {
          process.env.TZ = previousTimezone;
        }
      }
    });

    it('formatea la fecha visible sin desplazarla', () => {
      const previousTimezone = process.env.TZ;

      try {
        process.env.TZ = 'America/Mexico_City';

        const formatted = fmtDate('2026-09-15', 'es-MX');

        expect(formatted).toContain('15');
        expect(formatted).not.toContain('14');
      } finally {
        if (previousTimezone === undefined) {
          delete process.env.TZ;
        } else {
          process.env.TZ = previousTimezone;
        }
      }
    });
  });
});
