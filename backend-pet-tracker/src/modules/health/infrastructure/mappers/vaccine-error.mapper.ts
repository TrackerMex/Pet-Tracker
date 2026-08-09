import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  VaccineCatalogNotFoundError,
  VaccineNotFoundError,
  VaccineSpeciesMismatchError,
} from '@/modules/health/domain/errors/vaccine.errors';

export function mapVaccineError(error: unknown): unknown {
  if (error instanceof VaccineCatalogNotFoundError) {
    return new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      code: 'VACCINE_CATALOG_NOT_FOUND',
      message: 'Vaccine catalog entry not found',
    });
  }
  if (error instanceof VaccineSpeciesMismatchError) {
    return new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      code: 'VACCINE_SPECIES_MISMATCH',
      message: error.message,
    });
  }
  if (error instanceof VaccineNotFoundError) {
    return new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      code: 'VACCINE_NOT_FOUND',
      message: 'Vaccine not found',
    });
  }
  return error;
}
