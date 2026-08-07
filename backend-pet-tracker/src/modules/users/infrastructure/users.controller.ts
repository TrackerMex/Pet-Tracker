import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
} from '@nestjs/common';
import { ZodType } from 'zod';
import { CurrentUser } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import type { CurrentUserPayload } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import { UserNotFoundError } from '@/modules/auth/domain/errors/user.errors';
import {
  DeletePushTokenDto,
  DeletePushTokenSchema,
  RegisterPushTokenDto,
  RegisterPushTokenSchema,
} from '@/modules/users/application/dto/register-push-token.dto';
import {
  UpdateProfileDto,
  UpdateProfileSchema,
} from '@/modules/users/application/dto/update-profile.dto';
import { DeletePushTokenUseCase } from '@/modules/users/application/use-cases/delete-push-token.use-case';
import { GetProfileUseCase } from '@/modules/users/application/use-cases/get-profile.use-case';
import { RegisterPushTokenUseCase } from '@/modules/users/application/use-cases/register-push-token.use-case';
import { UpdateProfileUseCase } from '@/modules/users/application/use-cases/update-profile.use-case';
import {
  ProfileResponse,
  toProfileResponse,
} from './mappers/profile-response.mapper';
import {
  PushTokenResponse,
  toPushTokenResponse,
} from './mappers/push-token-response.mapper';

@Controller('me')
export class UsersController {
  constructor(
    private readonly getProfile: GetProfileUseCase,
    private readonly updateProfile: UpdateProfileUseCase,
    private readonly registerPushTokenUseCase: RegisterPushTokenUseCase,
    private readonly deletePushTokenUseCase: DeletePushTokenUseCase,
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

  /**
   * R3 (D5-i): 200 y no 201 — el upsert es idempotente y la segunda llamada
   * con el mismo `expoToken` no crea nada.
   */
  @Post('push-tokens')
  @HttpCode(HttpStatus.OK)
  async registerPushToken(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: unknown,
  ): Promise<PushTokenResponse> {
    const dto = parseBody<RegisterPushTokenDto>(RegisterPushTokenSchema, body);

    return toPushTokenResponse(
      await this.registerPushTokenUseCase.execute(user.id, dto),
    );
  }

  /** R5 (D5-ii): 204 siempre, incluso si el token no existia o es ajeno. */
  @Delete('push-tokens')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePushToken(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: unknown,
  ): Promise<void> {
    const dto = parseBody<DeletePushTokenDto>(DeletePushTokenSchema, body);

    await this.deletePushTokenUseCase.execute(user.id, dto);
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
