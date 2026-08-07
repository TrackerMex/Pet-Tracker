import { Injectable, Logger } from '@nestjs/common';
import type { ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { NOTIFIER_SCOPE, redactToken } from './notifier.constants';
import type { PushResult, PushSendInput, PushSender } from './push-sender';

/**
 * Las tres piezas del SDK que R11 usa. La costura existe porque
 * `Expo.isExpoPushToken` es un metodo **estatico**: sin ella no hay forma de
 * probar R11/R12 con un doble, que es justo lo que la spec exige (D2).
 */
export interface ExpoPushClient {
  isExpoPushToken(value: unknown): boolean;
  chunkPushNotifications(messages: ExpoPushMessage[]): ExpoPushMessage[][];
  sendPushNotificationsAsync(
    messages: ExpoPushMessage[],
  ): Promise<ExpoPushTicket[]>;
}

/**
 * Adaptador de `PUSH_ENABLED === 'true'` (R11, R12, D2). Descarta los tokens
 * que Expo no reconoce, trocea con el propio SDK (chunk de 100) y empareja
 * cada ticket con su token de origen — el consumer necesita ese
 * emparejamiento para borrar exactamente la fila del `DeviceNotRegistered`.
 *
 * Un fallo del SDK **se propaga**: R14 exige que el mensaje no se borre y
 * vuelva por redelivery, asi que tragarse la excepcion aqui perderia la
 * notificacion en silencio.
 */
@Injectable()
export class ExpoPushSender implements PushSender {
  private readonly logger = new Logger(ExpoPushSender.name);

  constructor(private client: ExpoPushClient | null = null) {}

  async send(input: PushSendInput): Promise<PushResult[]> {
    const expo = await this.resolveClient();

    const tokens = input.tokens.filter((token) => {
      if (expo.isExpoPushToken(token)) {
        return true;
      }
      this.logger.warn({
        scope: NOTIFIER_SCOPE,
        messageId: input.messageId,
        expoToken: redactToken(token),
        message: 'dropped: not an Expo push token',
      });
      return false;
    });

    if (tokens.length === 0) {
      return [];
    }

    const messages: ExpoPushMessage[] = tokens.map((to) => ({
      to,
      title: input.title,
      body: input.body,
      data: input.data,
    }));

    const results: PushResult[] = [];

    for (const chunk of expo.chunkPushNotifications(messages)) {
      const tickets = await expo.sendPushNotificationsAsync(chunk);

      chunk.forEach((message, index) => {
        results.push(toPushResult(message.to as string, tickets[index]));
      });
    }

    return results;
  }

  /**
   * `expo-server-sdk` es un paquete **ESM-only**: se carga con `import()`
   * dinamico y solo la primera vez que se envia de verdad. Asi el runtime CJS
   * (build de Nest y jest) nunca hace `require()` de un ESM, y en local —donde
   * `PUSH_ENABLED=false` y este adaptador ni se instancia— la dependencia no
   * se carga nunca.
   */
  private async resolveClient(): Promise<ExpoPushClient> {
    if (this.client !== null) {
      return this.client;
    }

    const { Expo } = await import('expo-server-sdk');
    const expo = new Expo();

    this.client = {
      isExpoPushToken: (value) => Expo.isExpoPushToken(value),
      chunkPushNotifications: (messages) =>
        expo.chunkPushNotifications(messages),
      sendPushNotificationsAsync: (messages) =>
        expo.sendPushNotificationsAsync(messages),
    };

    return this.client;
  }
}

/** R12: un ticket `error` con `details.error === 'DeviceNotRegistered'` es la
 * unica señal accionable; cualquier otra solo se reporta. */
function toPushResult(
  expoToken: string,
  ticket: ExpoPushTicket | undefined,
): PushResult {
  if (ticket === undefined || ticket.status !== 'error') {
    return { expoToken, deviceNotRegistered: false, error: null };
  }

  const error = ticket.details?.error ?? ticket.message;

  return {
    expoToken,
    deviceNotRegistered: ticket.details?.error === 'DeviceNotRegistered',
    error,
  };
}
