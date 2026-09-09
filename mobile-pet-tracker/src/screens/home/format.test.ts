import type { Reminder } from '../../api/types';
import {
  calendarDaysUntil,
  fmtDate,
  fmtKg,
  localDayOf,
  upcomingReminders,
} from './format';

function localIso(year: number, monthIndex: number, day: number): string {
  return new Date(year, monthIndex, day, 12, 0).toISOString();
}

function makeReminder(
  id: string,
  dueAt: string,
  status: Reminder['status'] = 'scheduled',
): Reminder {
  return {
    id,
    petId: 'pet-1',
    type: 'custom',
    title: id,
    dueAt,
    advanceMinutes: 60,
    status,
  };
}

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

describe('#85 R2: localDayOf reduce el instante a día civil local', () => {
  it('pasa el instante crudo al constructor y no a Date.parse ni a Date.UTC', () => {
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
      localDayOf('2026-09-12T12:00:00.000Z');

      expect(dateConstructor.mock.calls).toEqual([
        ['2026-09-12T12:00:00.000Z'],
      ]);
      expect(dateParse).not.toHaveBeenCalled();
      expect(dateUtc).not.toHaveBeenCalled();
    } finally {
      dateConstructor.mockRestore();
      dateParse.mockRestore();
      dateUtc.mockRestore();
    }
  });

  it('toma el día civil de los getters locales, nunca de los UTC', () => {
    const skewed = {
      getFullYear: () => 2026,
      getMonth: () => 8,
      getDate: () => 11,
      getUTCFullYear: () => 2026,
      getUTCMonth: () => 8,
      getUTCDate: () => 12,
    } as unknown as Date;
    const dateConstructor = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => skewed);

    try {
      expect(localDayOf('2026-09-12T02:00:00.000Z')).toBe('2026-09-11');
    } finally {
      dateConstructor.mockRestore();
    }
  });

  it('rellena mes y día a dos dígitos', () => {
    const skewed = {
      getFullYear: () => 2026,
      getMonth: () => 0,
      getDate: () => 5,
      getUTCFullYear: () => 2026,
      getUTCMonth: () => 0,
      getUTCDate: () => 5,
    } as unknown as Date;
    const dateConstructor = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => skewed);

    try {
      expect(localDayOf('2026-01-05T12:00:00.000Z')).toBe('2026-01-05');
    } finally {
      dateConstructor.mockRestore();
    }
  });
});

describe('#85 R3: upcomingReminders filtra, ordena y acota', () => {
  const now = new Date(2026, 8, 10, 12, 0);

  it('descarta enviados, cancelados y pasados, y conserva el de hoy', () => {
    const reminders = [
      makeReminder('rem-sent', localIso(2026, 8, 12), 'sent'),
      makeReminder('rem-cancelled', localIso(2026, 8, 13), 'cancelled'),
      makeReminder('rem-past', localIso(2026, 8, 9)),
      makeReminder('rem-today', localIso(2026, 8, 10)),
      makeReminder('rem-next', localIso(2026, 8, 11)),
    ];

    expect(upcomingReminders(reminders, now).map(({ id }) => id)).toEqual([
      'rem-today',
      'rem-next',
    ]);
  });

  it('ordena por fecha ascendente', () => {
    const reminders = [
      makeReminder('rem-plus-3', localIso(2026, 8, 13)),
      makeReminder('rem-plus-6', localIso(2026, 8, 16)),
      makeReminder('rem-plus-1', localIso(2026, 8, 11)),
    ];

    expect(upcomingReminders(reminders, now).map(({ id }) => id)).toEqual([
      'rem-plus-1',
      'rem-plus-3',
      'rem-plus-6',
    ]);
  });

  it('desempata por id ascendente', () => {
    const tiedDueAt = localIso(2026, 8, 14);
    const reminders = [
      makeReminder('rem-z', tiedDueAt),
      makeReminder('rem-a', tiedDueAt),
    ];

    expect(upcomingReminders(reminders, now).map(({ id }) => id)).toEqual([
      'rem-a',
      'rem-z',
    ]);
  });

  it('devuelve como mucho tres', () => {
    const reminders = [1, 2, 3, 4, 5].map((days) =>
      makeReminder(`rem-plus-${days}`, localIso(2026, 8, 10 + days)),
    );

    expect(upcomingReminders(reminders, now).map(({ id }) => id)).toEqual([
      'rem-plus-1',
      'rem-plus-2',
      'rem-plus-3',
    ]);
  });
});
