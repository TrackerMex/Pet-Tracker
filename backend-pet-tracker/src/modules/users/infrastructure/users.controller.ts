import { Controller, Get, NotFoundException } from '@nestjs/common';
import { CurrentUser } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import type { CurrentUserPayload } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import { UserNotFoundError } from '@/modules/auth/domain/errors/user.errors';
import { GetProfileUseCase } from '../application/use-cases/get-profile.use-case';
import {
  ProfileResponse,
  toProfileResponse,
} from './mappers/profile-response.mapper';

@Controller('me')
export class UsersController {
  constructor(private readonly getProfile: GetProfileUseCase) {}

  @Get()
  async me(@CurrentUser() user: CurrentUserPayload): Promise<ProfileResponse> {
    try {
      return toProfileResponse(await this.getProfile.execute(user.id));
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        // Caso borde: el usuario del token ya no existe (borrado despues de
        // emitido el JWT). No cubierto por un R explicito de la spec, pero
        // ningun error de dominio debe llegar crudo al cliente
        // (docs/conventions.md §Manejo de errores).
        throw new NotFoundException();
      }
      throw error;
    }
  }
}
