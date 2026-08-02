import { CURSOR_VERSION } from '@/modules/positions/positions.constants';
import { InvalidCursorError } from './errors/position.errors';

/**
 * Contenido util de un cursor ya decodificado. `lastSk` es el `sk` del
 * `LastEvaluatedKey` de la pagina anterior; la `pk` **no** viaja en el
 * cursor: se reconstruye desde el `:petId` de la ruta ya autorizada (R14),
 * asi ni un cursor fabricado a mano puede cruzar de particion.
 */
export interface CursorPayload {
  petId: string;
  fingerprint: string;
  lastSk: number;
}

/**
 * Huella determinista de la consulta (R13): dos peticiones con distinto
 * rango o distinto filtro producen huellas distintas, y un cursor emitido
 * para una no sirve para la otra.
 */
export function queryFingerprint(
  fromMs: number,
  toMs: number,
  includeSuspect: boolean,
): string {
  return `${fromMs}:${toMs}:${includeSuspect}`;
}

/**
 * Sobre `{v, p, q, k}` en base64url (D3, sin firma HMAC): base64url no es
 * cifrado y el atacante puede leerlo o fabricarlo, pero eso no le da acceso
 * a nada fuera de la particion que el guard ya le autorizo.
 */
export function encodeCursor(payload: CursorPayload): string {
  const envelope = {
    v: CURSOR_VERSION,
    p: payload.petId,
    q: payload.fingerprint,
    k: payload.lastSk,
  };

  return Buffer.from(JSON.stringify(envelope), 'utf-8').toString('base64url');
}

/**
 * Inversa de `encodeCursor`. Valida forma y version; la validacion cruzada
 * (`p` == petId de la ruta, `q` == huella actual) vive en el caso de uso,
 * que es quien conoce ambos valores.
 */
export function decodeCursor(raw: string): CursorPayload {
  let parsed: unknown;

  try {
    // Buffer.from ignora caracteres fuera del alfabeto en vez de fallar: un
    // cursor basura acaba en JSON.parse('') y cae en el catch igualmente.
    parsed = JSON.parse(
      Buffer.from(raw, 'base64url').toString('utf-8'),
    ) as unknown;
  } catch {
    throw new InvalidCursorError();
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new InvalidCursorError();
  }

  const envelope = parsed as Record<string, unknown>;

  if (
    envelope.v !== CURSOR_VERSION ||
    typeof envelope.p !== 'string' ||
    typeof envelope.q !== 'string' ||
    typeof envelope.k !== 'number' ||
    !Number.isFinite(envelope.k)
  ) {
    throw new InvalidCursorError();
  }

  return { petId: envelope.p, fingerprint: envelope.q, lastSk: envelope.k };
}
