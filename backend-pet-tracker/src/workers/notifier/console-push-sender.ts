import { Injectable, Logger } from '@nestjs/common';
import { NOTIFIER_SCOPE, redactToken } from './notifier.constants';
import type { PushResult, PushSendInput, PushSender } from './push-sender';

/**
 * Adaptador de `PUSH_ENABLED != 'true'` (R9, D2) — el que corre en todo el
 * desarrollo local. Escribe UN log estructurado con el payload Expo que se
 * habria enviado y **no construye ni invoca ningun cliente de Expo**: el
 * `expo-server-sdk` ni siquiera se carga por esta via. Mismo idioma de log
 * que el resto de workers (`this.logger.log({scope, ...})`).
 *
 * Devuelve `[]` porque no hay tickets que accionar: R12 (borrado por
 * `DeviceNotRegistered`) solo tiene sentido con envio real.
 */
@Injectable()
export class ConsolePushSender implements PushSender {
  private readonly logger = new Logger(ConsolePushSender.name);

  send(input: PushSendInput): Promise<PushResult[]> {
    this.logger.log({
      scope: NOTIFIER_SCOPE,
      messageId: input.messageId,
      wouldSend: {
        // R13: `to` es un solo token redactado (el primer destinatario);
        // `recipients` da el conteo completo de R8 sin multiplicar los
        // sitios donde un token puede filtrarse a un log.
        to: redactToken(input.tokens[0]),
        title: input.title,
        body: input.body,
        data: input.data,
        recipients: input.tokens.length,
      },
    });

    return Promise.resolve([]);
  }
}
