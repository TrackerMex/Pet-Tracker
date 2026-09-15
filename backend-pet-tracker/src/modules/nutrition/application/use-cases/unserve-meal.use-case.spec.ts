import { MealServing } from '@/modules/nutrition/domain/entities/meal-serving.entity';
import type { MealServingRepository } from '@/modules/nutrition/domain/repositories/meal-serving.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { UnserveMealUseCase } from './unserve-meal.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const SERVING_ID = '0198dead-beef-7c23-d456-789abcdef012';
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

describe('R8 (meals-served-tracking #83): meal.unserve se audita con el id de la fila borrada', () => {
  it('registra actor, id y metadatos de la fila borrada', async () => {
    const deleted = new MealServing({
      id: SERVING_ID,
      petId: PET_ID,
      servedOn: '2026-08-11',
      mealTime: '07:30',
      servedAt: NOW,
      createdBy: USER_ID,
    });
    const deleteOne = jest.fn().mockResolvedValue(deleted);
    const meals = { deleteOne } as unknown as MealServingRepository;
    const pets = {
      findOwnerTimezone: jest.fn().mockResolvedValue('Pacific/Kiritimati'),
    } as unknown as PetRepository;
    const record = jest.fn().mockResolvedValue(undefined);
    const useCase = new UnserveMealUseCase(meals, pets, { record });

    await useCase.execute(PET_ID, '07:30', USER_ID, NOW);

    expect(record).toHaveBeenCalledWith({
      userId: USER_ID,
      action: 'meal.unserve',
      entity: 'meal_serving',
      entityId: SERVING_ID,
      meta: { petId: PET_ID, mealTime: '07:30', servedOn: '2026-08-11' },
    });
  });
});
