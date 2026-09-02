import { Injectable } from '@nestjs/common';
import {
  PasswordResetMessage,
  PasswordResetSender,
} from '@/modules/auth/domain/ports/password-reset-sender';
import { buildPasswordResetUrl } from './password-reset-link';
import {
  MissingResendConfigError,
  PASSWORD_RESET_SUBJECT,
  ResendClient,
} from './resend-client';

@Injectable()
export class ResendPasswordResetSender implements PasswordResetSender {
  private readonly resetLinkHost: string;

  constructor(
    private readonly client: ResendClient,
    resetLinkHost: string,
  ) {
    this.resetLinkHost = resetLinkHost.trim();
    if (!this.resetLinkHost) {
      throw new MissingResendConfigError(['RESET_LINK_HOST']);
    }
  }

  send(message: PasswordResetMessage): Promise<void> {
    return this.client.deliver({
      event: 'auth.password_reset.issued',
      userId: message.userId,
      to: message.email,
      subject: PASSWORD_RESET_SUBJECT,
      text: [
        'Tu código para restablecer la contraseña de Pet Tracker es:',
        '',
        message.token,
        '',
        'O toca este enlace en tu teléfono para abrir la app y restablecerla:',
        '',
        buildPasswordResetUrl(this.resetLinkHost, message.token),
        '',
        `Caduca el ${message.expiresAt.toISOString()}. Si no has pedido este cambio, ignora este correo.`,
      ].join('\n'),
    });
  }
}
