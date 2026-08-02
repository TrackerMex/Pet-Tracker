export type PetRole = 'owner' | 'family' | 'walker' | 'vet';

/**
 * Membresia usuario-mascota (docs/data-model.md, fila `pet_users`): toda
 * autorizacion por mascota se decide con esta fila (PetAccessGuard,
 * R9-R12). `permissions` (jsonb) existe en la tabla pero no se interpreta
 * en el MVP — fuera de alcance de pets-crud-permissions.
 */
export interface PetMembership {
  petId: string;
  userId: string;
  role: PetRole;
  /** `'active'` habilita el acceso; cualquier otro valor lo bloquea (R9). */
  status: string;
}
