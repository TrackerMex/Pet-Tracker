import type { MealServingRepository } from '@/modules/nutrition/domain/repositories/meal-serving.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { UnserveMealUseCase } from './unserve-meal.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const NOW = new Date('2026-08-10T20:00:00.000Z');

describe('R7 (meals-served-tracking #83): sin fila de hoy el use case lanza MealServingNotFoundError sin auditar', () => {
  it('calcula el dia del owner y no audita cuando deleteOne devuelve null', async () => {
    const deleteOne = jest.fn().mockResolvedValue(null);
    const meals = { deleteOne } as unknown as MealServingRepository;
    const pets = {
      findOwnerTimezone: jest.fn().mockResolvedValue('Pacific/Kiritimati'),
    } as unknown as PetRepository;
    const record = jest.fn().mockResolvedValue(undefined);
    const useCase = new UnserveMealUseCase(meals, pets, { record });

    await expect(
      useCase.execute(PET_ID, '07:30', USER_ID, NOW),
    ).rejects.toMatchObject({ name: 'MealServingNotFoundError' });
    expect(deleteOne).toHaveBeenCalledWith(PET_ID, '2026-08-11', '07:30');
    expect(record).not.toHaveBeenCalled();
  });
});
