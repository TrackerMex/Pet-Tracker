import { Injectable, Logger } from '@nestjs/common';
import {
  PasswordResetMessage,
  PasswordResetSender,
} from '@/modules/auth/domain/ports/password-reset-sender';

@Injectable()
export class ConsolePasswordResetSender implements PasswordResetSender {
  private readonly logger = new Logger(ConsolePasswordResetSender.name);

  send(message: PasswordResetMessage): Promise<void> {
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
}
