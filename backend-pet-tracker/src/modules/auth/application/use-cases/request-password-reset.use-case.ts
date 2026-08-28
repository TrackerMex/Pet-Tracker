import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { normalizeEmail } from '@/modules/auth/domain/entities/user.entity';
import { PASSWORD_RESET_SENDER } from '@/modules/auth/domain/ports/password-reset-sender';
import type { PasswordResetSender } from '@/modules/auth/domain/ports/password-reset-sender';
import { PASSWORD_RESET_TOKEN_REPOSITORY } from '@/modules/auth/domain/repositories/password-reset-token.repository';
import type { PasswordResetTokenRepository } from '@/modules/auth/domain/repositories/password-reset-token.repository';
import { USER_REPOSITORY } from '@/modules/auth/domain/repositories/user.repository';
import type { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import {
  generateVerificationToken,
  hashVerificationToken,
  PASSWORD_RESET_TOKEN_TTL_MS,
} from '../verification-token';

@Injectable()
export class RequestPasswordResetUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    @Inject(PASSWORD_RESET_TOKEN_REPOSITORY)
    private readonly resetTokens: PasswordResetTokenRepository,
    @Inject(PASSWORD_RESET_SENDER)
    private readonly resetSender: PasswordResetSender,
    @Inject(AUDIT_LOGGER)
    private readonly auditLogger: AuditLogger,
  ) {}

  async execute(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.users.findByEmail(normalizeEmail(dto.email));

    if (user === null) {
      return;
    }

    const issuedAt = new Date();
    await this.resetTokens.invalidateAllForUser(user.id, issuedAt);

    const token = generateVerificationToken();
    const expiresAt = new Date(
      issuedAt.getTime() + PASSWORD_RESET_TOKEN_TTL_MS,
    );

    await this.resetTokens.create({
      userId: user.id,
      tokenHash: hashVerificationToken(token),
      expiresAt,
    });

    await this.resetSender.send({
      userId: user.id,
      email: user.email,
      token,
      expiresAt,
    });

    await this.auditLogger.record({
      userId: user.id,
      action: 'user.password_reset_requested',
      entity: 'user',
      entityId: user.id,
    });
  }
}
