import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import {
  InvalidVerificationTokenError,
  VerificationTokenExpiredError,
} from '@/modules/auth/domain/errors/email-verification.errors';
import { EMAIL_VERIFICATION_TOKEN_REPOSITORY } from '@/modules/auth/domain/repositories/email-verification-token.repository';
import type { EmailVerificationTokenRepository } from '@/modules/auth/domain/repositories/email-verification-token.repository';
import { USER_REPOSITORY } from '@/modules/auth/domain/repositories/user.repository';
import type { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { hashVerificationToken } from '../verification-token';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    @Inject(EMAIL_VERIFICATION_TOKEN_REPOSITORY)
    private readonly verificationTokens: EmailVerificationTokenRepository,
    @Inject(AUDIT_LOGGER)
    private readonly auditLogger: AuditLogger,
  ) {}

  async execute(dto: VerifyEmailDto): Promise<void> {
    const token = await this.verificationTokens.findByTokenHash(
      hashVerificationToken(dto.token),
    );

    // Un token consumido se trata igual que uno inexistente: el cliente no
    // distingue entre ambos casos (R9, R11).
    if (token === null || token.isUsed()) {
      throw new InvalidVerificationTokenError();
    }

    const verifiedAt = new Date();

    if (token.isExpired(verifiedAt)) {
      throw new VerificationTokenExpiredError();
    }

    await this.users.markEmailVerified(token.userId, verifiedAt);
    await this.verificationTokens.markUsed(token.id, verifiedAt);

    await this.auditLogger.record({
      userId: token.userId,
      action: 'user.email_verified',
      entity: 'user',
      entityId: token.userId,
    });
  }
}
