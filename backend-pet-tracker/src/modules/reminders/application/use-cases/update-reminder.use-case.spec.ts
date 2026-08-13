import { Reminder } from '@/modules/reminders/domain/entities/reminder.entity';
import type { ReminderRepository } from '@/modules/reminders/domain/repositories/reminder.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { UpdateReminderUseCase } from './update-reminder.use-case';

const REMINDER_ID = '01924a3f-0000-7000-8000-0000000000cc';
const PET_ID = '01924a3f-0000-7000-8000-0000000000aa';
const USER_ID = '01924a3f-0000-7000-8000-0000000000bb';

function reminder(): Reminder {
  return new Reminder({
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
  return new Reminder({ ...reminder(), status });
}

function repositoryStubs() {
  const findById = jest.fn();
  const reschedule = jest.fn().mockResolvedValue(reminder());
  const reminders = {
    create: jest.fn(),
    findById,
    reschedule,
    cancel: jest.fn(),
    findDue: jest.fn(),
    markEnqueued: jest.fn(),
    markSent: jest.fn(),
  } as unknown as ReminderRepository;
  const findMembership = jest.fn();
  const pets = { findMembership } as unknown as PetRepository;
  return { reminders, findById, reschedule, pets, findMembership };
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
      expect(stubs.reminders.cancel).not.toHaveBeenCalled();
    },
  );
});
