import { Inject, Injectable } from '@nestjs/common';
import type { RegisterPushTokenDto } from '@/modules/users/application/dto/register-push-token.dto';
import { PUSH_TOKEN_REPOSITORY } from '@/modules/users/domain/repositories/push-token.repository';
import type {
  PushTokenRepository,
  PushTokenRow,
} from '@/modules/users/domain/repositories/push-token.repository';

/**
 * POST /v1/me/push-tokens (R3). El upsert por `expo_token` (UNIQUE global)
 * resuelve en una sola sentencia los tres casos: alta, refresco del mismo
 * usuario y reasignacion desde otro usuario (D5-iv) — sin consultar antes
 * quien lo tenia, que seria una carrera.
 */
@Injectable()
export class RegisterPushTokenUseCase {
  constructor(
    @Inject(PUSH_TOKEN_REPOSITORY)
    private readonly tokens: PushTokenRepository,
  ) {}

  execute(
    userId: string,
    dto: RegisterPushTokenDto,
    // El reloj entra por parametro para que el test fije `last_seen_at`.
    now: Date = new Date(),
  ): Promise<PushTokenRow> {
    return this.tokens.upsert({
      userId,
      expoToken: dto.expoToken,
      platform: dto.platform,
      lastSeenAt: now,
    });
  }
}
