export const PASSWORD_RESET_SENDER = Symbol('PasswordResetSender');

export interface PasswordResetMessage {
  userId: string;
  email: string;
  /** Token en claro: solo se entrega al destinatario, nunca se persiste. */
  token: string;
  expiresAt: Date;
}

export interface PasswordResetSender {
  send(message: PasswordResetMessage): Promise<void>;
}
