import { Injectable, Logger } from '@nestjs/common';
import {
  PasswordResetMessage,
  PasswordResetSender,
} from '@/modules/auth/domain/ports/password-reset-sender';
import { buildPasswordResetUrl } from './password-reset-link';

@Injectable()
export class ConsolePasswordResetSender implements PasswordResetSender {
  private readonly logger = new Logger(ConsolePasswordResetSender.name);

  constructor(private readonly resetLinkHost: string | null = null) {}

  send(message: PasswordResetMessage): Promise<void> {
    this.logger.log(
      JSON.stringify({
        event: 'auth.password_reset.issued',
        userId: message.userId,
        email: message.email,
        token: message.token,
        expiresAt: message.expiresAt.toISOString(),
        ...(this.resetLinkHost
          ? {
              resetUrl: buildPasswordResetUrl(
                this.resetLinkHost,
                message.token,
              ),
            }
          : {}),
      }),
    );

    return Promise.resolve();
  }
}
