import type { PetRole } from '@/modules/pets/domain/entities/pet-membership';
export interface PetMember {
  userId: string;
  firstName: string;
  lastName: string;
  role: PetRole;
  joinedAt: Date;
}
