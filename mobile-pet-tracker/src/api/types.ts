export interface HealthResponse {
  postgres: 'ok' | 'error';
}

export interface FieldError {
  path: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  country: string;
  timezone?: string;
  termsAccepted: true;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  timezone: string;
  createdAt: string;
}

export interface DeviceStatus {
  model: string | null;
  batteryPct: number | null;
  connectivity: string | null;
  lastMessageAt: string | null;
  esn: string | null;
}

export interface PetProfile {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string | null;
  birthDate: string | null;
  approxAgeMonths: number | null;
  ageMonths: number;
  currentWeightKg: number | null;
  size: string | null;
  color: string | null;
  sterilized: boolean | null;
  microchip: string | null;
  photoUrl: string | null;
  lostMode: boolean;
  lastPosition: unknown;
  lastCommunicationAt: string | null;
  myRole: 'owner' | 'caregiver' | 'viewer';
  device: DeviceStatus | null;
  nextVaccine: unknown;
  nextReminder: unknown;
  activitySummary: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface DayEntry {
  date: string;
  distanceM: number | null;
  activeMinutes: number | null;
  restMinutes: number | null;
  walkCount: number | null;
  avgWalkMinutes: number | null;
  firstWalkAt: string | null;
  lastWalkAt: string | null;
  timeAwayMinutes: number | null;
  source: 'stored' | 'computed' | 'missing';
}

export interface WeekComparison {
  distanceM: number | null;
  activeMinutes: number | null;
  walkCount: number | null;
}
