import type { ReminderRepository } from '@/modules/reminders/domain/repositories/reminder.repository';
import { DeleteReminderUseCase } from './delete-reminder.use-case';

const PET_ID = '01924a3f-0000-7000-8000-0000000000aa';
const REMINDER_ID = '01924a3f-0000-7000-8000-0000000000cc';

describe('R2: DeleteReminderUseCase borra o lanza not-found', () => {
  it('termina sin valor cuando el repositorio borra la fila', async () => {
    const deleteByPetAndId = jest.fn().mockResolvedValue(true);
    const reminders = { deleteByPetAndId } as unknown as ReminderRepository;

    await expect(
      new DeleteReminderUseCase(reminders).execute(PET_ID, REMINDER_ID),
    ).resolves.toBeUndefined();
    expect(deleteByPetAndId).toHaveBeenCalledWith(PET_ID, REMINDER_ID);
  });

  it('lanza ReminderNotFoundError cuando ninguna fila coincide', async () => {
    const deleteByPetAndId = jest.fn().mockResolvedValue(false);
    const reminders = { deleteByPetAndId } as unknown as ReminderRepository;

    await expect(
      new DeleteReminderUseCase(reminders).execute(PET_ID, REMINDER_ID),
    ).rejects.toMatchObject({
      name: 'ReminderNotFoundError',
      message: `Reminder ${REMINDER_ID} not found`,
    });
  });
});
