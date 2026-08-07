// Errores de dominio tipados (docs/conventions.md §Manejo de errores): sin
// imports de @nestjs/common. El mapper del controller los traduce a HTTP.

/**
 * Alerta inexistente, de una mascota sin membresia activa, o `:id` que no es
 * un uuid sintactico ⇒ 404 por el MISMO camino de codigo (R21). Mismo criterio
 * de no-filtracion de existencia que el 404 generico de PetAccessGuard.
 */
export class AlertNotFoundError extends Error {
  constructor() {
    super('alert not found');
    this.name = 'AlertNotFoundError';
  }
}

/** `ack` sobre una alerta ya `closed` ⇒ 409 (R21): una alerta resuelta no se
 * "entera". */
export class AlertAlreadyClosedError extends Error {
  constructor() {
    super('alert is already closed');
    this.name = 'AlertAlreadyClosedError';
  }
}

/** Cursor ilegible, de otra version o de otra consulta ⇒ 400 (R18). */
export class InvalidAlertCursorError extends Error {
  constructor() {
    super('cursor is not valid for this request');
    this.name = 'InvalidAlertCursorError';
  }
}
