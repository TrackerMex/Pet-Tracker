import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PasswordResetMessage,
  PasswordResetSender,
} from '@/modules/auth/domain/ports/password-reset-sender';

@Injectable()
export class ConsolePasswordResetSender implements PasswordResetSender {
  constructor(private readonly _config: ConfigService) {}

  send(message: PasswordResetMessage): Promise<void> {
    // R10 anadira la entrega por log estructurado y el aviso del gate.
    void message;
    return Promise.resolve();
  }
}
