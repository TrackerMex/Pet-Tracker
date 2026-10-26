import {
  CreateReminderSchema,
  EditReminderSchema,
  REMINDER_MAX_ADVANCE_MINUTES,
  REMINDER_TITLE_MAX_LENGTH,
  UpdateReminderSchema,
} from './reminder.dto';

const futureDueAt = () => new Date(Date.now() + 60_000).toISOString();

describe('R3: validacion estricta del POST de reminders', () => {
  it('exporta los limites aprobados', () => {
    expect(REMINDER_TITLE_MAX_LENGTH).toBe(120);
    expect(REMINDER_MAX_ADVANCE_MINUTES).toBe(10_080);
  });

  it.each([
    'vaccine',
    'deworming',
    'medication',
    'appointment',
    'weight',
    'food',
    'custom',
  ])('acepta type=%s, recorta title y usa limites inclusivos', (type) => {
    expect(
      CreateReminderSchema.parse({
        type,
        title: '  Recordatorio valido  ',
        dueAt: futureDueAt(),
        advanceMinutes: REMINDER_MAX_ADVANCE_MINUTES,
      }),
    ).toMatchObject({ title: 'Recordatorio valido' });
  });

  it.each([
    ['type fuera del enum', { type: 'other' }],
    ['title vacio', { title: '   ' }],
    ['title demasiado largo', { title: 'x'.repeat(121) }],
    ['dueAt sin offset', { dueAt: '2099-01-01T00:00:00' }],
    ['dueAt pasado', { dueAt: new Date(Date.now() - 1_000).toISOString() }],
    ['advanceMinutes decimal', { advanceMinutes: 1.5 }],
    ['advanceMinutes negativo', { advanceMinutes: -1 }],
    ['advanceMinutes sobre el maximo', { advanceMinutes: 10_081 }],
    ['clave desconocida', { extra: true }],
  ])('rechaza %s', (_label, changes) => {
    expect(
      CreateReminderSchema.safeParse({
        type: 'custom',
        title: 'Valido',
        dueAt: futureDueAt(),
        ...changes,
      }).success,
    ).toBe(false);
  });
});

describe('R11: validacion estricta del PATCH de reminders', () => {
  it.each([
    { status: 'cancelled' },
    { dueAt: futureDueAt() },
    { advanceMinutes: 0 },
    { title: '  Nuevo titulo  ' },
  ])('acepta %o', (body) => {
    expect(UpdateReminderSchema.safeParse(body).success).toBe(true);
  });

  it.each([
    {},
    { status: 'cancelled', title: 'No permitido' },
    { status: 'scheduled' },
    { extra: true },
    { dueAt: new Date(Date.now() - 1_000).toISOString() },
    { advanceMinutes: 1.5 },
    { advanceMinutes: -1 },
    { advanceMinutes: REMINDER_MAX_ADVANCE_MINUTES + 1 },
    { title: '   ' },
    { title: 'x'.repeat(REMINDER_TITLE_MAX_LENGTH + 1) },
  ])('rechaza %o', (body) => {
    expect(UpdateReminderSchema.safeParse(body).success).toBe(false);
  });
});

describe('#210 R2: validacion zod de recurrencia', () => {
  const limits = [
    ['hour', 24],
    ['day', 365],
    ['week', 52],
    ['month', 12],
    ['year', 10],
  ] as const;
  const invalid: [string, string, Record<string, unknown>][] = [
    ...limits.map(([unit]): [string, string, Record<string, unknown>] => [
      `${unit} bajo minimo`,
      'recurrence.every',
      { recurrence: { unit, every: 0 } },
    ]),
    ...limits.map(([unit, max]): [string, string, Record<string, unknown>] => [
      `${unit} sobre maximo`,
      'recurrence.every',
      { recurrence: { unit, every: max + 1 } },
    ]),
    [
      'every decimal',
      'recurrence.every',
      { recurrence: { unit: 'day', every: 1.5 } },
    ],
    [
      'unit desconocida',
      'recurrence.unit',
      { recurrence: { unit: 'minute', every: 1 } },
    ],
    ['every ausente', 'recurrence.every', { recurrence: { unit: 'day' } }],
    [
      'clave extra',
      'recurrence',
      { recurrence: { unit: 'day', every: 1, until: '2027-01-01' } },
    ],
    ['recurrence string', 'recurrence', { recurrence: 'day' }],
    ['dia inexistente', 'recurrenceUntil', { recurrenceUntil: '2026-02-30' }],
    [
      'fecha con hora',
      'recurrenceUntil',
      { recurrenceUntil: '2026-11-01T00:00:00Z' },
    ],
  ];
  const valid = () => ({
    type: 'custom',
    title: 'Serie',
    dueAt: futureDueAt(),
  });

  it.each(invalid)('#210 R2: POST rechaza %s en %s', (_label, path, body) => {
    const parsed = CreateReminderSchema.safeParse({ ...valid(), ...body });
    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
      path,
    );
  });

  it.each(
    limits.flatMap(
      ([unit, max]) =>
        [
          [unit, 1],
          [unit, max],
        ] as const,
    ),
  )('#210 R2: POST acepta every en el limite %s', (unit, every) => {
    expect(
      CreateReminderSchema.safeParse({
        ...valid(),
        recurrence: { unit, every },
      }).success,
    ).toBe(true);
  });

  it('#210 R2: POST trata recurrence null como ausente', () => {
    const body = valid();
    const absent = CreateReminderSchema.safeParse(body);
    const withNull = CreateReminderSchema.safeParse({
      ...body,
      recurrence: null,
    });
    expect(absent.success).toBe(true);
    expect(withNull.success).toBe(true);
    if (absent.success && withNull.success)
      expect(withNull.data).toEqual({ ...absent.data, recurrence: null });
  });

  it.each(invalid)(
    '#210 R2: PATCH de edicion rechaza %s en %s',
    (_label, path, body) => {
      const parsed = EditReminderSchema.safeParse(body);
      expect(parsed.success).toBe(false);
      expect(
        parsed.error?.issues.map((issue) => issue.path.join('.')),
      ).toContain(path);
    },
  );

  it('#210 R2: PATCH acepta recurrence y recurrenceUntil null y validos', () => {
    for (const body of [
      { recurrence: null },
      { recurrenceUntil: null },
      { recurrence: { unit: 'week', every: 2 }, recurrenceUntil: '2027-01-01' },
    ]) {
      expect(UpdateReminderSchema.safeParse(body).success).toBe(true);
    }
  });
});
