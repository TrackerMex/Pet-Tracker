import { Injectable, Logger } from '@nestjs/common';
import {
  EmailVerificationMessage,
  EmailVerificationSender,
} from '@/modules/auth/domain/ports/email-verification-sender';

/**
 * Entrega local del token: mismo patron que PUSH_ENABLED=false del notifier
 * (docs/architecture.md §Adaptacion local). Sin SES en LocalStack, el token
 * se escribe en un log estructurado del servidor y nunca en la respuesta HTTP.
 */
@Injectable()
export class ConsoleEmailVerificationSender implements EmailVerificationSender {
  private readonly logger = new Logger(ConsoleEmailVerificationSender.name);

  send(message: EmailVerificationMessage): Promise<void> {
    this.logger.log(
      JSON.stringify({
        event: 'auth.email_verification.issued',
        userId: message.userId,
        email: message.email,
        token: message.token,
        expiresAt: message.expiresAt.toISOString(),
      }),
    );

    return Promise.resolve();
  }
}
