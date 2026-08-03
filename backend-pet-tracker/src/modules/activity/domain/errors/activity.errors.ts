// Errores de dominio tipados (docs/conventions.md §Manejo de errores): sin
// imports de @nestjs/common. activity-error.mapper.ts los traduce a HTTP con
// su `code` en el body.

/** `date`, `from` o `to` que no es una fecha real ⇒ 400 INVALID_DATE (R17). */
export class InvalidDateError extends Error {
  constructor(value: string) {
    super(`not a calendar date (YYYY-MM-DD): ${value}`);
    this.name = 'InvalidDateError';
  }
}

/** `from` posterior a `to` ⇒ 400 INVALID_RANGE (R17). */
export class InvalidRangeError extends Error {
  constructor() {
    super('from must not be after to');
    this.name = 'InvalidRangeError';
  }
}

/** Rango de mas de ACTIVITY_MAX_RANGE_DAYS dias ⇒ 400 RANGE_TOO_LARGE (R17). */
export class RangeTooLargeError extends Error {
  constructor() {
    super('requested range exceeds the maximum allowed window');
    this.name = 'RangeTooLargeError';
  }
}

/** `:n` que no es entero >= 0 ⇒ 400 INVALID_TRIP_INDEX (R17). */
export class InvalidTripIndexError extends Error {
  constructor(value: string) {
    super(`trip index must be an integer >= 0, received: ${value}`);
    this.name = 'InvalidTripIndexError';
  }
}

/**
 * `:n` sintacticamente valido pero sin paseo ⇒ 404 TRIP_NOT_FOUND (R19).
 * Unico 404 de la feature que no produce PetAccessGuard; el del guard no
 * lleva `code`, asi el cliente distingue los dos.
 */
export class TripNotFoundError extends Error {
  constructor(index: number) {
    super(`no trip with index ${index} on that day`);
    this.name = 'TripNotFoundError';
  }
}
