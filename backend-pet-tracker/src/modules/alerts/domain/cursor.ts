import { ALERTS_CURSOR_VERSION } from '@/modules/alerts/alerts.constants';
import type { AlertStatus } from './entities/alert-event.entity';
import { InvalidAlertCursorError } from './errors/alert.errors';

/**
 * Contenido util de un cursor ya decodificado (R18). El **usuario no viaja**
 * en el sobre: se toma siempre del JWT, asi que un cursor fabricado a mano
 * solo puede mover el punto de arranque dentro del conjunto que el `INNER
 * JOIN pet_users` ya restringio — nunca cruzar de usuario.
 */
export interface AlertCursorPayload {
  openedAtMs: number;
  id: string;
  /** Filtro `?status=` con el que se emitio; `null` si no habia. */
  status: AlertStatus | null;
}

/**
 * Sobre `{v, o, i, s}` en base64url, **sin firma HMAC** — mismo razonamiento
 * que #9: base64url no es cifrado y el atacante puede leerlo o fabricarlo,
 * pero eso no le da acceso a nada fuera de sus propias mascotas.
 */
export function encodeAlertCursor(payload: AlertCursorPayload): string {
  return Buffer.from(
    JSON.stringify({
      v: ALERTS_CURSOR_VERSION,
      o: payload.openedAtMs,
      i: payload.id,
      s: payload.status,
    }),
    'utf-8',
  ).toString('base64url');
}

/**
 * Inversa de `encodeAlertCursor`. Valida forma y version; la validacion
 * cruzada (`s` == filtro actual) vive en el caso de uso, que es quien conoce
 * ambos valores.
 */
export function decodeAlertCursor(raw: string): AlertCursorPayload {
  let parsed: unknown;

  try {
    // Buffer.from ignora los caracteres fuera del alfabeto en vez de fallar:
    // un cursor basura acaba en JSON.parse('') y cae en el catch igualmente.
    parsed = JSON.parse(
      Buffer.from(raw, 'base64url').toString('utf-8'),
    ) as unknown;
  } catch {
    throw new InvalidAlertCursorError();
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new InvalidAlertCursorError();
  }

  const envelope = parsed as Record<string, unknown>;

  if (
    envelope.v !== ALERTS_CURSOR_VERSION ||
    typeof envelope.o !== 'number' ||
    !Number.isFinite(envelope.o) ||
    typeof envelope.i !== 'string' ||
    !isStatusOrNull(envelope.s)
  ) {
    throw new InvalidAlertCursorError();
  }

  return { openedAtMs: envelope.o, id: envelope.i, status: envelope.s };
}

function isStatusOrNull(value: unknown): value is AlertStatus | null {
  return (
    value === null ||
    value === 'open' ||
    value === 'acked' ||
    value === 'closed'
  );
}
