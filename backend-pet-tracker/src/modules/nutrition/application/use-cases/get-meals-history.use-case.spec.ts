import {
  InvalidDateError,
  InvalidRangeError,
  RangeTooLargeError,
} from '@/modules/nutrition/domain/errors/nutrition.errors';
import type { MealServingRepository } from '@/modules/nutrition/domain/repositories/meal-serving.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { GetMealsHistoryUseCase } from './get-meals-history.use-case';

const NOW = new Date('2026-03-15T12:00:00Z');
function build(timezone = 'UTC') {
  const listServedBetween = jest.fn().mockResolvedValue([]);
  const findOwnerTimezone = jest.fn().mockResolvedValue(timezone);
  const useCase = new GetMealsHistoryUseCase(
    { listServedBetween } as unknown as MealServingRepository,
    { findOwnerTimezone } as unknown as PetRepository,
  );
  return { useCase, listServedBetween, findOwnerTimezone };
}

describe('#105 R3: validate and fill meals history by owner civil day', () => {
  it('defaults to 31 days crossing a month', async () => {
    const { useCase, listServedBetween } = build();
    const result = await useCase.execute({ petId: 'p1' }, NOW);
    expect(result).toMatchObject({
      from: '2026-02-13',
      to: '2026-03-15',
      today: '2026-03-15',
    });
    expect(result.days).toHaveLength(31);
    expect(result.days[0].date).toBe('2026-02-13');
    expect(result.days[30].date).toBe('2026-03-15');
    expect(listServedBetween).toHaveBeenCalledTimes(1);
    expect(listServedBetween).toHaveBeenCalledWith(
      'p1',
      '2026-02-13',
      '2026-03-15',
    );
  });
  it('resolves owner today across a year', async () => {
    const { useCase } = build('America/Mexico_City');
    const result = await useCase.execute(
      { petId: 'p1' },
      new Date('2026-01-01T03:00:00Z'),
    );
    expect(result.today).toBe('2025-12-31');
    expect(result.to).toBe('2025-12-31');
  });
  it('fills gaps and sorts hours across month and year', async () => {
    const { useCase, listServedBetween } = build();
    listServedBetween.mockResolvedValue([
      { servedOn: '2025-12-30', mealTime: '12:00' },
      { servedOn: '2025-12-30', mealTime: '08:00' },
      { servedOn: '2026-01-02', mealTime: '07:30' },
    ]);
    const result = await useCase.execute(
      { petId: 'p1', from: '2025-12-29', to: '2026-01-03' },
      NOW,
    );
    expect(result.days).toEqual([
      { date: '2025-12-29', mealTimes: [] },
      { date: '2025-12-30', mealTimes: ['08:00', '12:00'] },
      { date: '2025-12-31', mealTimes: [] },
      { date: '2026-01-01', mealTimes: [] },
      { date: '2026-01-02', mealTimes: ['07:30'] },
      { date: '2026-01-03', mealTimes: [] },
    ]);
  });
  it('rejects 32 days before IO and accepts 31', async () => {
    const { useCase, findOwnerTimezone, listServedBetween } = build();
    await expect(
      useCase.execute(
        { petId: 'p1', from: '2025-12-01', to: '2026-01-01' },
        NOW,
      ),
    ).rejects.toBeInstanceOf(RangeTooLargeError);
    expect(findOwnerTimezone).toHaveBeenCalledTimes(0);
    expect(listServedBetween).toHaveBeenCalledTimes(0);
    const result = await useCase.execute(
      { petId: 'p1', from: '2025-12-02', to: '2026-01-01' },
      NOW,
    );
    expect(result.days).toHaveLength(31);
  });
  it.each([
    [{ from: '2026-01-02', to: '2026-01-01' }, InvalidRangeError],
    [{ from: 'ayer' }, InvalidDateError],
    [{ to: '2026-02-30' }, InvalidDateError],
  ])('rejects %j before IO', async (range, ErrorClass) => {
    const { useCase, findOwnerTimezone, listServedBetween } = build();
    await expect(
      useCase.execute({ petId: 'p1', ...range }, NOW),
    ).rejects.toBeInstanceOf(ErrorClass);
    expect(findOwnerTimezone).toHaveBeenCalledTimes(0);
    expect(listServedBetween).toHaveBeenCalledTimes(0);
  });
  it('validates a defaulted range after resolving owner today', async () => {
    const { useCase, findOwnerTimezone, listServedBetween } = build();
    await expect(
      useCase.execute({ petId: 'p1', from: '2026-03-16' }, NOW),
    ).rejects.toBeInstanceOf(InvalidRangeError);
    expect(findOwnerTimezone).toHaveBeenCalledTimes(1);
    expect(listServedBetween).toHaveBeenCalledTimes(0);
  });
  it('accepts future days and fills them with empty hours', async () => {
    const { useCase } = build();
    const result = await useCase.execute(
      { petId: 'p1', from: '2026-03-14', to: '2026-03-17' },
      NOW,
    );
    expect(result.days).toHaveLength(4);
    expect(result.days.slice(2)).toEqual([
      { date: '2026-03-16', mealTimes: [] },
      { date: '2026-03-17', mealTimes: [] },
    ]);
  });
});
