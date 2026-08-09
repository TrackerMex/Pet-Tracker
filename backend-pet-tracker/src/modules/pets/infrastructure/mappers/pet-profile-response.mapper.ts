import type { DeviceStatusResponse } from '@/modules/devices/infrastructure/mappers/device-status.mapper';
import {
  calculateAgeMonths,
  Pet,
  PetSex,
  PetSize,
  PetSpecies,
} from '@/modules/pets/domain/entities/pet.entity';
import { PetRole } from '@/modules/pets/domain/entities/pet-membership';
import type { NextPetVaccine } from '@/modules/pets/domain/ports/pet-vaccine-reader';

/**
 * Contrato congelado del perfil de mascota (R8): exactamente estas claves,
 * en todas las respuestas del CRUD. Las features posteriores editan ESTE
 * mapper sustituyendo un `null` por un valor — nunca agregan ni renombran
 * claves, asi el contrato HTTP no cambia de forma.
 */
export interface PetProfileResponse {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  sex: PetSex | null;
  birthDate: string | null;
  approxAgeMonths: number | null;
  ageMonths: number;
  currentWeightKg: number | null;
  size: PetSize | null;
  color: string | null;
  sterilized: boolean | null;
  microchip: string | null;
  /** URL GET prefirmada desde photo_key (#6 R6), o null sin foto (R7). */
  photoUrl: string | null;
  lostMode: boolean;
  /** null hasta que el pipeline de ingesta (#8) alimente la cache. */
  lastPosition: unknown;
  /** null hasta que el pipeline de ingesta (#8) alimente la cache. */
  lastCommunicationAt: string | null;
  myRole: PetRole;
  /** Collar activo (devices-claim #7 R12) o null si la mascota no lleva. */
  device: DeviceStatusResponse | null;
  /** null hasta pet-vaccines (#14). */
  nextVaccine: NextPetVaccine | null;
  /** null hasta pet-reminders (#16). */
  nextReminder: null;
  /** null hasta activity-summary (#10). */
  activitySummary: null;
  createdAt: string;
  updatedAt: string;
}

/** Lista explicita de campos — nunca se serializa la entidad completa. */
export function toPetProfileResponse(
  pet: Pet,
  myRole: PetRole,
  now: Date = new Date(),
  device: DeviceStatusResponse | null = null,
  photoUrl: string | null = null,
  nextVaccine: NextPetVaccine | null = null,
): PetProfileResponse {
  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    sex: pet.sex,
    birthDate: pet.birthDate,
    approxAgeMonths: pet.approxAgeMonths,
    ageMonths: calculateAgeMonths(pet, now),
    currentWeightKg: pet.currentWeightKg,
    size: pet.size,
    color: pet.color,
    sterilized: pet.sterilized,
    microchip: pet.microchip,
    photoUrl,
    lostMode: pet.lostMode,
    lastPosition: pet.lastPosition,
    lastCommunicationAt: pet.lastCommunicationAt
      ? pet.lastCommunicationAt.toISOString()
      : null,
    myRole,
    device,
    nextVaccine,
    nextReminder: null,
    activitySummary: null,
    createdAt: pet.createdAt.toISOString(),
    updatedAt: pet.updatedAt.toISOString(),
  };
}
