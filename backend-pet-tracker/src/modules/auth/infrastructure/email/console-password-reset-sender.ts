import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PasswordResetMessage,
  PasswordResetSender,
} from '@/modules/auth/domain/ports/password-reset-sender';

@Injectable()
export class ConsolePasswordResetSender implements PasswordResetSender {
  private readonly logger = new Logger(ConsolePasswordResetSender.name);

  constructor(private readonly config: ConfigService) {}

  send(message: PasswordResetMessage): Promise<void> {
    if (this.isEmailEnabled()) {
      this.logger.warn(
        'EMAIL_ENABLED=true but no real email provider is wired yet; the password reset token is only written to the log',
      );
    }

    this.logger.log(
      JSON.stringify({
        event: 'auth.password_reset.issued',
        userId: message.userId,
        email: message.email,
        token: message.token,
        expiresAt: message.expiresAt.toISOString(),
      }),
    );

    return Promise.resolve();
  }

  private isEmailEnabled(): boolean {
    return this.config.get<string>('EMAIL_ENABLED') === 'true';
  }
}
