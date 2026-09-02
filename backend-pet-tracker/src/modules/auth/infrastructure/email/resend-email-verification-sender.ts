import { Injectable } from '@nestjs/common';
import {
  EmailVerificationMessage,
  EmailVerificationSender,
} from '@/modules/auth/domain/ports/email-verification-sender';
import { EMAIL_VERIFICATION_SUBJECT, ResendClient } from './resend-client';

@Injectable()
export class ResendEmailVerificationSender implements EmailVerificationSender {
  constructor(private readonly client: ResendClient) {}

  send(message: EmailVerificationMessage): Promise<void> {
    return this.client.deliver({
      event: 'auth.email_verification.issued',
      userId: message.userId,
      to: message.email,
      subject: EMAIL_VERIFICATION_SUBJECT,
      text: [
        'Tu código para verificar tu email de Pet Tracker es:',
        '',
        message.token,
        '',
        `Caduca el ${message.expiresAt.toISOString()}. Si no has creado esta cuenta, ignora este correo.`,
      ].join('\n'),
    });
  }
}
