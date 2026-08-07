import { Inject, Injectable } from '@nestjs/common';
import type { DeletePushTokenDto } from '@/modules/users/application/dto/register-push-token.dto';
import { PUSH_TOKEN_REPOSITORY } from '@/modules/users/domain/repositories/push-token.repository';
import type { PushTokenRepository } from '@/modules/users/domain/repositories/push-token.repository';

/**
 * DELETE /v1/me/push-tokens (R5). Idempotente por construccion: el filtro
 * `(expo_token, user_id)` deja el borrado en cero filas cuando el token no
 * existe o es de otro usuario, y la respuesta es 204 en los tres casos —
 * mismo criterio de no-filtracion de existencia que el 404 de PetAccessGuard.
 */
@Injectable()
export class DeletePushTokenUseCase {
  constructor(
    @Inject(PUSH_TOKEN_REPOSITORY)
    private readonly tokens: PushTokenRepository,
  ) {}

  execute(userId: string, dto: DeletePushTokenDto): Promise<void> {
    return this.tokens.deleteOwnedByUser(userId, dto.expoToken);
  }
}
