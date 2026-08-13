import {
  CreateReminderSchema,
  REMINDER_MAX_ADVANCE_MINUTES,
  REMINDER_TITLE_MAX_LENGTH,
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
