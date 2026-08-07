export const PUSH_SENDER = Symbol('PushSender');

/**
 * Un envio ya resuelto: los destinatarios de R8 mas el copy que #12 dejo
 * redactado en el mensaje. `messageId` viaja para que los logs de los dos
 * adaptadores (R9, R12) se puedan correlacionar con el mensaje SQS — es la
 * unica razon por la que el puerto lo conoce.
 */
export interface PushSendInput {
  messageId: string;
  tokens: string[];
  title: string;
  body: string;
  data: { petId: string; alertId: string };
}

/** Un ticket de Expo emparejado con su token de origen (R12). */
export interface PushResult {
  expoToken: string;
  /** Unica señal que el consumer acciona: borra esa fila de `push_tokens`. */
  deviceNotRegistered: boolean;
  /** Cualquier otro error de ticket, solo para log. */
  error: string | null;
}

/**
 * Puerto de envio push (D2), mismo patron que `EmailVerificationSender` de
 * #3: dos adaptadores (`ConsolePushSender` / `ExpoPushSender`) elegidos por
 * `PUSH_ENABLED` en el `useFactory` del modulo. El consumer no sabe cual
 * tiene inyectado — no hay ningun `if (pushEnabled)` en su logica.
 */
export interface PushSender {
  send(input: PushSendInput): Promise<PushResult[]>;
}
