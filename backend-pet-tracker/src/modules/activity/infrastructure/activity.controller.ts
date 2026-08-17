import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  GetDailyActivityQueryDto,
  GetDailyActivityQuerySchema,
} from '@/modules/activity/application/dto/get-daily-activity.dto';
import { GetDailyActivityUseCase } from '@/modules/activity/application/use-cases/get-daily-activity.use-case';
import type { GetDailyActivityResult } from '@/modules/activity/application/use-cases/get-daily-activity.use-case';
import { PetAccessGuard } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import type { PetAccessRequest } from '@/modules/pets/infrastructure/guards/pet-access.guard';
import { PetTrackingGuard } from '@/modules/subscriptions/infrastructure/guards/pet-tracking.guard';
import { mapActivityError } from './mappers/activity-error.mapper';

/**
 * GET /v1/pets/:petId/activity/daily (R16, R20, R21). Mismo mecanismo de
 * autorizacion que /trips: PetAccessGuard sin @RequirePetRole, y la mascota
 * sale de `request.petMembership`.
 */
@Controller('pets/:petId/activity')
@UseGuards(PetAccessGuard, PetTrackingGuard)
export class ActivityController {
  constructor(private readonly getDailyActivity: GetDailyActivityUseCase) {}

  @Get('daily')
  async daily(
    @Req() request: PetAccessRequest,
  ): Promise<GetDailyActivityResult> {
    const query = parseDailyQuery(request.query);

    try {
      return await this.getDailyActivity.execute({
        petId: request.petMembership.petId,
        ...query,
      });
    } catch (error) {
      throw mapActivityError(error);
    }
  }
}

export function parseDailyQuery(query: unknown): GetDailyActivityQueryDto {
  const result = GetDailyActivityQuerySchema.safeParse(query);

  if (!result.success) {
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      errors: result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  return result.data;
}
