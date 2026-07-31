export const EMAIL_VERIFICATION_SENDER = Symbol('EmailVerificationSender');

export interface EmailVerificationMessage {
  userId: string;
  email: string;
  /** Token en claro: solo se entrega al destinatario, nunca se persiste. */
  token: string;
  expiresAt: Date;
}

/**
 * Puerto de entrega del token de verificacion. En local lo implementa
 * ConsoleEmailVerificationSender (EMAIL_ENABLED=false → log estructurado);
 * un deploy real cambiaria la implementacion por SES sin tocar el caso de uso.
 */
export interface EmailVerificationSender {
  send(message: EmailVerificationMessage): Promise<void>;
}
