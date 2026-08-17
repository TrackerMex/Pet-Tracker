// Errores de dominio tipados de la integracion Wialon (R4). Regla de
// docs/conventions.md §Manejo de errores. Nunca se
// deja pasar un error crudo de HTTP/fetch al llamador.

/**
 * Códigos de Wialon que significan "la sesión ya no vale, vuelve a loguear":
 * 1 "Invalid session", 1011 "Your IP has changed, or the session has expired".
 * https://help.wialon.com/en/api/user-guide/error-codes
 */
export const WIALON_INVALID_SESSION_CODES: readonly number[] = [1, 1011];

export function isInvalidSessionError(error: unknown): boolean {
  return (
    error instanceof WialonApiError &&
    WIALON_INVALID_SESSION_CODES.includes(error.code)
  );
}

/** La API de Wialon respondio `{error: N}` — codigo del protocolo Wialon. */
export class WialonApiError extends Error {
  constructor(
    public readonly code: number,
    public readonly svc: string,
  ) {
    super(`Wialon API error ${code} on ${svc}`);
    this.name = 'WialonApiError';
  }
}

/** Fallo de transporte (red caida, status HTTP no-ok, body no-JSON). */
export class WialonTransportError extends Error {
  constructor(svc: string, cause: unknown) {
    super(
      `Wialon transport failure on ${svc}: ${
        cause instanceof Error ? cause.message : String(cause)
      }`,
    );
    this.name = 'WialonTransportError';
  }
}
