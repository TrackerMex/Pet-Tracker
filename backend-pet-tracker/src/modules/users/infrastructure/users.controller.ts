import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { ZodType } from 'zod';
import { CurrentUser } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import type { CurrentUserPayload } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import { UserNotFoundError } from '@/modules/auth/domain/errors/user.errors';
import {
  UpdateProfileDto,
  UpdateProfileSchema,
} from '@/modules/users/application/dto/update-profile.dto';
import { GetProfileUseCase } from '@/modules/users/application/use-cases/get-profile.use-case';
import { UpdateProfileUseCase } from '@/modules/users/application/use-cases/update-profile.use-case';
import {
  ProfileResponse,
  toProfileResponse,
} from './mappers/profile-response.mapper';

@Controller('me')
export class UsersController {
  constructor(
    private readonly getProfile: GetProfileUseCase,
    private readonly updateProfile: UpdateProfileUseCase,
  ) {}

  @Get()
  async me(@CurrentUser() user: CurrentUserPayload): Promise<ProfileResponse> {
    try {
      return toProfileResponse(await this.getProfile.execute(user.id));
    } catch (error) {
      throw mapProfileError(error);
    }
  }

  @Patch()
  async updateMe(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: unknown,
  ): Promise<ProfileResponse> {
    const dto = parseBody<UpdateProfileDto>(UpdateProfileSchema, body);

    try {
      return toProfileResponse(await this.updateProfile.execute(user.id, dto));
    } catch (error) {
      throw mapProfileError(error);
    }
  }
}

/**
 * Caso borde (sin R-id): el usuario del token ya no existe (borrado despues
 * de emitido el JWT). Ningun error de dominio debe llegar crudo al cliente
 * (docs/conventions.md §Manejo de errores).
 */
function mapProfileError(error: unknown): unknown {
  return error instanceof UserNotFoundError ? new NotFoundException() : error;
}

/**
 * Validacion explicita en el borde HTTP (mismo patron que auth.controller.ts):
 * el ZodError se mapea a 400 antes de invocar el use case, garantizando que
 * PATCH /v1/me es atomico (R11, R12).
 */
function parseBody<T>(schema: ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);

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
