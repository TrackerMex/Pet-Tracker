import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import {
  InvalidPasswordResetTokenError,
  PasswordResetTokenExpiredError,
} from '@/modules/auth/domain/errors/password-reset.errors';
import { PASSWORD_HASHER } from '@/modules/auth/domain/ports/password-hasher';
import type { PasswordHasher } from '@/modules/auth/domain/ports/password-hasher';
import { PASSWORD_RESET_TOKEN_REPOSITORY } from '@/modules/auth/domain/repositories/password-reset-token.repository';
import type { PasswordResetTokenRepository } from '@/modules/auth/domain/repositories/password-reset-token.repository';
import { USER_REPOSITORY } from '@/modules/auth/domain/repositories/user.repository';
import type { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { hashVerificationToken } from '../verification-token';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    @Inject(PASSWORD_RESET_TOKEN_REPOSITORY)
    private readonly resetTokens: PasswordResetTokenRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(AUDIT_LOGGER)
    private readonly auditLogger: AuditLogger,
  ) {}

  async execute(dto: ResetPasswordDto): Promise<void> {
    const token = await this.resetTokens.findByTokenHash(
      hashVerificationToken(dto.token),
    );

    if (token === null || token.isUsed()) {
      throw new InvalidPasswordResetTokenError();
    }

    const changedAt = new Date();
    if (token.isExpired(changedAt)) {
      throw new PasswordResetTokenExpiredError();
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);

    await this.users.updatePasswordHash(token.userId, passwordHash, changedAt);
    await this.resetTokens.invalidateAllForUser(token.userId, changedAt);

    await this.auditLogger.record({
      userId: token.userId,
      action: 'user.password_reset',
      entity: 'user',
      entityId: token.userId,
    });
  }
}
