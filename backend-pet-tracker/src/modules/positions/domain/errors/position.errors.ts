// Errores de dominio tipados (docs/conventions.md §Manejo de errores): sin
// imports de @nestjs/common. El controller los traduce a 400 con su codigo.

/** `from >= to` tras aplicar los defaults de R8 ⇒ 400 INVALID_RANGE. */
export class InvalidRangeError extends Error {
  constructor() {
    super('from must be strictly before to');
    this.name = 'InvalidRangeError';
  }
}

/** Rango mayor que MAX_RANGE_HOURS ⇒ 400 RANGE_TOO_LARGE (R9). */
export class RangeTooLargeError extends Error {
  constructor() {
    super('requested range exceeds the maximum allowed window');
    this.name = 'RangeTooLargeError';
  }
}

/**
 * Cursor ilegible, de otra version, de otra mascota o de otra consulta ⇒
 * 400 INVALID_CURSOR sin ejecutar Query alguna (R14).
 */
export class InvalidCursorError extends Error {
  constructor() {
    super('cursor is not valid for this request');
    this.name = 'InvalidCursorError';
  }
}
