import { InvalidRecurrenceError } from '@/modules/reminders/domain/errors/reminder.errors';
import { Reminder } from '@/modules/reminders/domain/entities/reminder.entity';
import type { ReminderRepository } from '@/modules/reminders/domain/repositories/reminder.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { UpdateReminderUseCase } from './update-reminder.use-case';

const REMINDER_ID = '01924a3f-0000-7000-8000-0000000000cc';
const PET_ID = '01924a3f-0000-7000-8000-0000000000aa';
const USER_ID = '01924a3f-0000-7000-8000-0000000000bb';

function reminder(): Reminder {
  return new Reminder({
    recurrence: null,
    id: REMINDER_ID,
    petId: PET_ID,
    type: 'custom',
    title: 'Original',
    dueAt: new Date('2026-08-14T00:00:00.000Z'),
    advanceMinutes: 60,
    channel: 'push',
    status: 'scheduled',
    scheduleName: `reminder-${REMINDER_ID}`,
    enqueuedAt: null,
    createdBy: USER_ID,
  });
}

function reminderWithStatus(status: Reminder['status']): Reminder {
  return new Reminder({
    ...reminder(),
    recurrence: null,
    status,
  });
}

function repositoryStubs() {
  const findById = jest.fn();
  const reschedule = jest.fn().mockResolvedValue(reminder());
  const cancel = jest.fn();
  const reminders = {
    create: jest.fn(),
    findById,
    reschedule,
    cancel,
    findDue: jest.fn(),
    markEnqueued: jest.fn(),
    markSent: jest.fn(),
  } as unknown as ReminderRepository;
  const findMembership = jest.fn();
  const findOwnerTimezone = jest.fn().mockResolvedValue('UTC');
  const pets = {
    findMembership,
    findOwnerTimezone,
  } as unknown as PetRepository;
  return {
    reminders,
    findById,
    reschedule,
    cancel,
    pets,
    findMembership,
    findOwnerTimezone,
  };
}

describe('R10: UpdateReminderUseCase autoriza via reminder.petId', () => {
  it('reminder inexistente produce ReminderNotFoundError sin consultar membresia', async () => {
    const stubs = repositoryStubs();
    stubs.findById.mockResolvedValue(null);

    await expect(
      new UpdateReminderUseCase(stubs.reminders, stubs.pets).execute(
        REMINDER_ID,
        { title: 'Nuevo' },
        USER_ID,
      ),
    ).rejects.toMatchObject({ name: 'ReminderNotFoundError' });
    expect(stubs.findMembership).not.toHaveBeenCalled();
  });

  it.each([null, { role: 'owner', status: 'inactive' }])(
    'membresia ausente/inactiva produce el mismo ReminderNotFoundError',
    async (membership) => {
      const stubs = repositoryStubs();
      stubs.findById.mockResolvedValue(reminder());
      stubs.findMembership.mockResolvedValue(
        membership && { petId: PET_ID, userId: USER_ID, ...membership },
      );

      await expect(
        new UpdateReminderUseCase(stubs.reminders, stubs.pets).execute(
          REMINDER_ID,
          { title: 'Nuevo' },
          USER_ID,
        ),
      ).rejects.toMatchObject({ name: 'ReminderNotFoundError' });
      expect(stubs.findMembership).toHaveBeenCalledWith(PET_ID, USER_ID);
      expect(stubs.reschedule).not.toHaveBeenCalled();
    },
  );

  it('miembro activo no-owner produce NotReminderOwnerError', async () => {
    const stubs = repositoryStubs();
    stubs.findById.mockResolvedValue(reminder());
    stubs.findMembership.mockResolvedValue({
      petId: PET_ID,
      userId: USER_ID,
      role: 'family',
      status: 'active',
    });

    await expect(
      new UpdateReminderUseCase(stubs.reminders, stubs.pets).execute(
        REMINDER_ID,
        { title: 'Nuevo' },
        USER_ID,
      ),
    ).rejects.toMatchObject({ name: 'NotReminderOwnerError' });
    expect(stubs.reschedule).not.toHaveBeenCalled();
  });
});

describe('R11: UpdateReminderUseCase rechaza reminders no editables', () => {
  it.each(['sent', 'cancelled'] as const)(
    'status=%s produce ReminderNotEditableError sin mutar',
    async (status) => {
      const stubs = repositoryStubs();
      stubs.findById.mockResolvedValue(reminderWithStatus(status));
      stubs.findMembership.mockResolvedValue({
        petId: PET_ID,
        userId: USER_ID,
        role: 'owner',
        status: 'active',
      });

      await expect(
        new UpdateReminderUseCase(stubs.reminders, stubs.pets).execute(
          REMINDER_ID,
          { title: 'Nuevo' },
          USER_ID,
        ),
      ).rejects.toMatchObject({ name: 'ReminderNotEditableError' });
      expect(stubs.reschedule).not.toHaveBeenCalled();
      expect(stubs.cancel).not.toHaveBeenCalled();
    },
  );
});

describe('#210 R6: edicion de la serie', () => {
  const dueAt = new Date('2026-11-01T15:00:00.000Z');
  const nextDueAt = new Date('2026-12-01T15:00:00.000Z');
  const original = {
    unit: 'day' as const,
    every: 1,
    anchorAt: dueAt,
    until: '2027-01-01',
  };
  it.each([
    [
      'recurrence nueva',
      { recurrence: { unit: 'week', every: 2 } },
      false,
      { unit: 'week', every: 2, anchorAt: dueAt, until: original.until },
    ],
    ['recurrence null', { recurrence: null }, false, null],
    [
      'recurrenceUntil fecha',
      { recurrenceUntil: '2027-02-01' },
      false,
      { ...original, until: '2027-02-01' },
    ],
    [
      'recurrenceUntil null',
      { recurrenceUntil: null },
      false,
      { ...original, until: null },
    ],
    [
      'dueAt reancla',
      { dueAt: nextDueAt.toISOString() },
      false,
      { ...original, anchorAt: nextDueAt },
    ],
    ['solo title', { title: 'Nuevo' }, false, undefined],
    ['until sobre one-shot', { recurrenceUntil: '2027-02-01' }, true, 'error'],
    [
      'recurrence null con until',
      { recurrence: null, recurrenceUntil: '2027-02-01' },
      false,
      'error',
    ],
  ] as const)('#210 R6: PATCH %s', async (_label, body, oneShot, expected) => {
    const stubs = repositoryStubs();
    stubs.findById.mockResolvedValue(
      new Reminder({
        ...reminder(),
        dueAt,
        recurrence: oneShot ? null : original,
      }),
    );
    stubs.findMembership.mockResolvedValue({ role: 'owner', status: 'active' });
    const result = new UpdateReminderUseCase(
      stubs.reminders,
      stubs.pets,
    ).execute(REMINDER_ID, body, USER_ID);
    if (expected === 'error') {
      await expect(result).rejects.toThrow(InvalidRecurrenceError);
      expect(stubs.reschedule).not.toHaveBeenCalled();
    } else {
      await result;
      const changes: Record<string, unknown> = {};
      if ('dueAt' in body) changes.dueAt = new Date(body.dueAt);
      if ('title' in body) changes.title = body.title;
      if (expected !== undefined) changes.recurrence = expected;
      expect(stubs.reschedule).toHaveBeenCalledWith(
        REMINDER_ID,
        changes,
        expect.stringMatching(/^reminder-[0-9a-f-]{36}$/),
      );
      if (expected === undefined)
        expect(
          (stubs.reschedule.mock.calls[0] as unknown[])[1],
        ).not.toHaveProperty('recurrence');
    }
  });
});
