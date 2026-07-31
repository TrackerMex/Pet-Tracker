import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { UserNotFoundError } from '@/modules/auth/domain/errors/user.errors';
import { USER_REPOSITORY } from '@/modules/auth/domain/repositories/user.repository';
import type {
  ProfileFieldChanges,
  UserRepository,
} from '@/modules/auth/domain/repositories/user.repository';

/**
 * PATCH /v1/me (auth-login-me R10, R13, R14). La validacion de `changes`
 * (timezone IANA, country ISO) ya corrio completa en el borde HTTP
 * (UpdateProfileSchema) antes de llegar aca: este use case nunca ve un
 * campo invalido a medio persistir.
 */
@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    @Inject(AUDIT_LOGGER)
    private readonly auditLogger: AuditLogger,
  ) {}

  async execute(userId: string, changes: ProfileFieldChanges): Promise<User> {
    const fieldsPresent = Object.keys(changes) as (keyof ProfileFieldChanges)[];

    if (fieldsPresent.length === 0) {
      // R13: body vacio (o sin campos reconocidos) es un no-op explicito:
      // ni se escribe en users, ni se audita.
      const user = await this.users.findById(userId);

      if (!user) {
        throw new UserNotFoundError(userId);
      }

      return user;
    }

    const updated = await this.users.updateProfile(userId, changes);

    await this.auditLogger.record({
      userId,
      action: 'user.update',
      entity: 'user',
      entityId: userId,
      // Solo nombres de campo (R14): nunca los valores, para no duplicar
      // PII fuera de `users`.
      meta: { fields: fieldsPresent },
    });

    return updated;
  }
}
