export interface PetInvite {
  id: string;
  petId: string;
  role: 'family';
  createdBy: string;
  expiresAt: Date;
  acceptedBy: string | null;
  acceptedAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
}
