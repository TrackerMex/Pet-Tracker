import { Inject, Injectable } from '@nestjs/common';
import {
  InvalidDateError,
  InvalidRangeError,
  RangeTooLargeError,
} from '@/modules/nutrition/domain/errors/nutrition.errors';
import { MEALS_HISTORY_MAX_RANGE_DAYS } from '@/modules/nutrition/domain/nutrition.constants';
import {
  MEAL_SERVING_REPOSITORY,
  type MealServingRepository,
} from '@/modules/nutrition/domain/repositories/meal-serving.repository';
import { ownerLocalDay } from '@/modules/pets/application/owner-local-day';
import {
  PET_REPOSITORY,
  type PetRepository,
} from '@/modules/pets/domain/repositories/pet.repository';
import { isCalendarDate, listDays, shiftDay } from '@/pipeline/local-day';

export interface MealsHistoryResult {
  from: string;
  to: string;
  today: string;
  days: Array<{ date: string; mealTimes: string[] }>;
}

@Injectable()
export class GetMealsHistoryUseCase {
  constructor(
    @Inject(MEAL_SERVING_REPOSITORY)
    private readonly meals: MealServingRepository,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
  ) {}

  async execute(
    input: { petId: string; from?: string; to?: string },
    now: Date,
  ): Promise<MealsHistoryResult> {
    assertCalendarDate(input.from);
    assertCalendarDate(input.to);
    if (input.from !== undefined && input.to !== undefined) {
      assertRange(input.from, input.to);
    }
    const today = await ownerLocalDay(this.pets, input.petId, now);
    const to = input.to ?? today;
    const from =
      input.from ?? shiftDay(to, -(MEALS_HISTORY_MAX_RANGE_DAYS - 1));
    assertRange(from, to);
    const served = await this.meals.listServedBetween(input.petId, from, to);
    const timesByDay = new Map<string, string[]>();
    for (const row of served) {
      const times = timesByDay.get(row.servedOn) ?? [];
      times.push(row.mealTime);
      timesByDay.set(row.servedOn, times);
    }
    return {
      from,
      to,
      today,
      days: listDays(from, to).map((date) => ({
        date,
        mealTimes: [...(timesByDay.get(date) ?? [])].sort(),
      })),
    };
  }
}

function assertCalendarDate(value: string | undefined): void {
  if (value !== undefined && !isCalendarDate(value))
    throw new InvalidDateError(value);
}

function assertRange(fromDay: string, toDay: string): void {
  if (fromDay > toDay) throw new InvalidRangeError();
  if (listDays(fromDay, toDay).length > MEALS_HISTORY_MAX_RANGE_DAYS)
    throw new RangeTooLargeError();
}
