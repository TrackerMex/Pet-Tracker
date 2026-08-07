// Cadencia como constante nombrada, no env (mismo criterio D11 de #8 y R17
// de #12): los tests y el e2e invocan drainOnce() directamente.
export const NOTIFIER_INTERVAL_MS = 60_000;
export const NOTIFIER_INTERVAL_NAME = 'notifier-consumer';

/** Batch maximo por ReceiveMessage (R7), mismo patron que los otros dos consumidores. */
export const CONSUMER_RECEIVE_MAX_MESSAGES = 10;

/** Long-polling corto: drena rapido en tests y evita busy-loop (R7). */
export const CONSUMER_WAIT_TIME_SECONDS = 1;

/** Tope de iteraciones por drenado — mismo criterio que positions-consumer. */
export const MAX_DRAIN_ITERATIONS = 50;

/** `scope` de todos los logs del worker, para filtrar por el en produccion. */
export const NOTIFIER_SCOPE = 'notifier-consumer';

/** Caracteres del token que sobreviven a la redaccion (R13). */
const REDACTED_TAIL_LENGTH = 6;

/**
 * Forma redactada de un `expo_token` (R13): los 6 ultimos caracteres
 * precedidos de `…`, ej. `…xY9kQ]`. Unico lugar del proyecto donde un token
 * se prepara para salir a un log — el notifier nunca loguea uno completo
 * (nota de mantenimiento del plan 007).
 */
export function redactToken(token: string): string {
  return `…${token.slice(-REDACTED_TAIL_LENGTH)}`;
}
