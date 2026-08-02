// Errores de dominio tipados de la integracion Wialon (R4) — sin
// @nestjs/common, regla de docs/conventions.md §Manejo de errores. Nunca se
// deja pasar un error crudo de HTTP/fetch al llamador.

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
