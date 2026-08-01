import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import {
  DEFAULT_TIMEZONE,
  normalizeEmail,
  User,
} from '@/modules/auth/domain/entities/user.entity';
import { EmailAlreadyRegisteredError } from '@/modules/auth/domain/errors/user.errors';
import { EMAIL_VERIFICATION_SENDER } from '@/modules/auth/domain/ports/email-verification-sender';
import type { EmailVerificationSender } from '@/modules/auth/domain/ports/email-verification-sender';
import { PASSWORD_HASHER } from '@/modules/auth/domain/ports/password-hasher';
import type { PasswordHasher } from '@/modules/auth/domain/ports/password-hasher';
import { EMAIL_VERIFICATION_TOKEN_REPOSITORY } from '@/modules/auth/domain/repositories/email-verification-token.repository';
import type { EmailVerificationTokenRepository } from '@/modules/auth/domain/repositories/email-verification-token.repository';
import { USER_REPOSITORY } from '@/modules/auth/domain/repositories/user.repository';
import type { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { RegisterUserDto } from '../dto/register-user.dto';
import {
  generateVerificationToken,
  hashVerificationToken,
  VERIFICATION_TOKEN_TTL_MS,
} from '../verification-token';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(EMAIL_VERIFICATION_TOKEN_REPOSITORY)
    private readonly verificationTokens: EmailVerificationTokenRepository,
    @Inject(EMAIL_VERIFICATION_SENDER)
    private readonly verificationSender: EmailVerificationSender,
    @Inject(AUDIT_LOGGER)
    private readonly auditLogger: AuditLogger,
  ) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    const email = normalizeEmail(dto.email);

    if (await this.users.existsByEmail(email)) {
      throw new EmailAlreadyRegisteredError(email);
    }

    const registeredAt = new Date();
    const user = await this.users.create({
      email,
      passwordHash: await this.passwordHasher.hash(dto.password),
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      country: dto.country,
      timezone: dto.timezone ?? DEFAULT_TIMEZONE,
      termsAcceptedAt: registeredAt,
    });

    await this.issueVerificationToken(user, registeredAt);

    await this.auditLogger.record({
      userId: user.id,
      action: 'user.register',
      entity: 'user',
      entityId: user.id,
    });

    return user;
  }

  /** El token en claro solo viaja al sender; en la base queda su hash. */
  private async issueVerificationToken(
    user: User,
    issuedAt: Date,
  ): Promise<void> {
    const token = generateVerificationToken();
    const expiresAt = new Date(issuedAt.getTime() + VERIFICATION_TOKEN_TTL_MS);

    await this.verificationTokens.create({
      userId: user.id,
      tokenHash: hashVerificationToken(token),
      expiresAt,
    });

    await this.verificationSender.send({
      userId: user.id,
      email: user.email,
      token,
      expiresAt,
    });
  }
}
