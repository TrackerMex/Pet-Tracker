/**
 * Caso borde de R9: el guard confirmo la membresia pero la fila de `pets`
 * desaparecio antes de la consulta del handler (delete concurrente). El
 * controller lo mapea al mismo NotFoundException generico del guard.
 * Sin imports de @nestjs/common — regla de docs/conventions.md.
 */
export class PetNotFoundError extends Error {
  constructor(petId: string) {
    super(`Pet ${petId} not found`);
    this.name = 'PetNotFoundError';
  }
}
