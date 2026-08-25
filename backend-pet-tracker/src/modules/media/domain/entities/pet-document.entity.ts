export interface PetDocument {
  id: string;
  petId: string;
  type: string;
  name: string;
  date: string;
  vet: string | null;
  key: string;
  createdBy: string;
}
