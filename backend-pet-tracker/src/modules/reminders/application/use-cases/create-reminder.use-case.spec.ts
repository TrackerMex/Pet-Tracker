import { CreateReminderUseCase } from './create-reminder.use-case';
import type { ReminderRepository } from '@/modules/reminders/domain/repositories/reminder.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';

const PET_ID = '01924a3f-0000-7000-8000-0000000000aa';
const USER_ID = '01924a3f-0000-7000-8000-0000000000bb';
const dueAt = new Date('2031-01-01T10:00:00.000Z');
function stubs() {
  const create = jest.fn().mockResolvedValue(undefined);
  const findOwnerTimezone = jest.fn().mockResolvedValue('UTC');
  const reminders = { create } as unknown as ReminderRepository;
  const pets = { findOwnerTimezone } as unknown as PetRepository;
  return {
    create,
    findOwnerTimezone,
    useCase: new CreateReminderUseCase(reminders, pets),
  };
}
const expected = {
  petId: PET_ID,
  type: 'custom',
  title: 'Serie',
  dueAt,
  advanceMinutes: 60,
  channel: 'push',
  status: 'scheduled',
  scheduleName: expect.stringMatching(/^reminder-[0-9a-f-]{36}$/) as unknown,
  enqueuedAt: null,
  createdBy: USER_ID,
};
describe('#210 R4: POST persiste la serie', () => {
  it('#210 R4: crea la serie con anchorAt igual a dueAt', async () => {
    const { create, useCase } = stubs();
    await useCase.execute(
      PET_ID,
      {
        type: 'custom',
        title: 'Serie',
        dueAt: dueAt.toISOString(),
        recurrence: { unit: 'week', every: 2 },
      },
      USER_ID,
    );
    expect(create).toHaveBeenCalledWith({
      ...expected,
      recurrence: { unit: 'week', every: 2, anchorAt: dueAt, until: null },
    });
  });
  it('#210 R4: sin recurrence crea recurrence null y no consulta la zona', async () => {
    const { create, useCase, findOwnerTimezone } = stubs();
    await useCase.execute(
      PET_ID,
      { type: 'custom', title: 'Serie', dueAt: dueAt.toISOString() },
      USER_ID,
    );
    expect(create).toHaveBeenCalledWith({ ...expected, recurrence: null });
    expect(findOwnerTimezone).not.toHaveBeenCalled();
  });
});
