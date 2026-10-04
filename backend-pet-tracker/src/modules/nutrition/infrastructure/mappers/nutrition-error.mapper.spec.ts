import { BadRequestException } from '@nestjs/common';
import {
  InvalidDateError,
  InvalidRangeError,
  RangeTooLargeError,
} from '@/modules/nutrition/domain/errors/nutrition.errors';
import { MEALS_HISTORY_MAX_RANGE_DAYS } from '@/modules/nutrition/domain/nutrition.constants';
import { mapNutritionError } from './nutrition-error.mapper';

describe('#105 R2: meals history range errors', () => {
  it('limits the window to 31 days', () => {
    expect(MEALS_HISTORY_MAX_RANGE_DAYS).toBe(31);
  });

  it.each([
    [
      () => new InvalidDateError('ayer'),
      'INVALID_DATE',
      'Dates must be calendar days YYYY-MM-DD',
    ],
    [
      () => new InvalidRangeError(),
      'INVALID_RANGE',
      'from must not be after to',
    ],
    [
      () => new RangeTooLargeError(),
      'RANGE_TOO_LARGE',
      'Requested range exceeds the maximum window',
    ],
  ])('maps %s to 400 %s', (makeError, code, message) => {
    const error = mapNutritionError(makeError());
    expect(error).toBeInstanceOf(BadRequestException);
    expect((error as BadRequestException).getResponse()).toEqual({
      statusCode: 400,
      code,
      message,
    });
  });
});
