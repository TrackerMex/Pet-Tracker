/**
 * Clave S3 de la foto de una mascota (R1): `pets/<petId>/photo-<epoch-ms>`.
 * Funcion pura, sin I/O — `now` siempre lo pasa el caller (mismo patron de
 * reloj inyectable que `calculateAgeMonths` de pets/domain/entities/pet.entity.ts).
 */
export function buildPhotoKey(petId: string, now: Date): string {
  return `pets/${petId}/photo-${now.getTime()}`;
}
