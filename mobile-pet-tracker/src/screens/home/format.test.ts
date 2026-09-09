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
    it('normaliza ambos días por componentes sin parsear la cadena cruda', () => {
      const late = new Date(2026, 8, 10, 23, 30);
      const early = new Date(2026, 8, 10, 0, 30);
      const skewed = {
        getFullYear: () => 2026,
        getMonth: () => 8,
        getDate: () => 10,
        getUTCFullYear: () => 2026,
        getUTCMonth: () => 8,
        getUTCDate: () => 11,
      } as unknown as Date;
      const RealDate = Date;
      const dateParse = jest.spyOn(RealDate, 'parse');
      const dateUtc = jest.spyOn(RealDate, 'UTC');
      const dateConstructor = jest
        .spyOn(global, 'Date')
        .mockImplementation(
          (value: string | number | Date, ...dateParts: number[]) =>
            Reflect.construct(RealDate, [value, ...dateParts]) as Date,
        );
      Object.assign(dateConstructor, { parse: dateParse, UTC: dateUtc });

      try {
        expect(calendarDaysUntil('2026-09-15', late)).toBe(5);
        expect(calendarDaysUntil('2026-09-15', early)).toBe(5);
        expect(calendarDaysUntil('2026-09-15', skewed)).toBe(5);

        expect(dateConstructor).not.toHaveBeenCalled();
        expect(dateParse).not.toHaveBeenCalled();
        expect(dateUtc.mock.calls).toEqual([
          [2026, 8, 15],
          [2026, 8, 10],
          [2026, 8, 15],
          [2026, 8, 10],
          [2026, 8, 15],
          [2026, 8, 10],
        ]);
      } finally {
        dateConstructor.mockRestore();
        dateParse.mockRestore();
        dateUtc.mockRestore();
      }
    });

    it('formatea la fecha visible sin desplazarla', () => {
      const RealDate = Date;
      const dateConstructor = jest
        .spyOn(global, 'Date')
        .mockImplementation(
          (value: string | number | Date, ...dateParts: number[]) =>
            Reflect.construct(RealDate, [value, ...dateParts]) as Date,
        );

      try {
        const formatted = fmtDate('2026-09-15', 'es-MX');

        expect(formatted).toContain('15');
        expect(formatted).not.toContain('14');
        expect(dateConstructor.mock.calls).toEqual([[2026, 8, 15]]);
        expect(dateConstructor).not.toHaveBeenCalledWith('2026-09-15');
      } finally {
        dateConstructor.mockRestore();
      }
    });
  });
});
