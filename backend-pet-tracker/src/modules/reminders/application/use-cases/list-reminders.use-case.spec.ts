import { Reminder } from '@/modules/reminders/domain/entities/reminder.entity';
import type { ReminderRepository } from '@/modules/reminders/domain/repositories/reminder.repository';
import { ListRemindersUseCase } from './list-reminders.use-case';

const PET_ID = '01924a3f-0000-7000-8000-0000000000aa';
const USER_ID = '01924a3f-0000-7000-8000-0000000000bb';

function reminder(id: string, dueAt: string): Reminder {
  return new Reminder({
    id,
    petId: PET_ID,
    type: 'custom',
    title: `Reminder ${id}`,
    dueAt: new Date(dueAt),
    advanceMinutes: 60,
    channel: 'push',
    status: 'scheduled',
    scheduleName: `reminder-${id}`,
    enqueuedAt: null,
    createdBy: USER_ID,
  });
}

describe('R1: ListRemindersUseCase delega en listByPet', () => {
  it('devuelve sin alterar la lista ordenada por el repositorio', async () => {
    const expected = [
      reminder(
        '01924a3f-0000-7000-8000-0000000000c1',
        '2026-08-25T10:00:00.000Z',
      ),
      reminder(
        '01924a3f-0000-7000-8000-0000000000c2',
        '2026-08-25T11:00:00.000Z',
      ),
    ];
    const listByPet = jest.fn().mockResolvedValue(expected);
    const reminders = { listByPet } as unknown as ReminderRepository;

    await expect(
      new ListRemindersUseCase(reminders).execute(PET_ID),
    ).resolves.toBe(expected);
    expect(listByPet).toHaveBeenCalledTimes(1);
    expect(listByPet).toHaveBeenCalledWith(PET_ID);
  });
});
