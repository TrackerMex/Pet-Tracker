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

export interface LastPosition {
  lat: number;
  lng: number;
  ts: number;
  accuracy: number | null;
  battery: number | null;
  staleSeconds: number;
}

export interface StoredPosition {
  ts: number;
  lat: number;
  lng: number;
  speedKmh: number | null;
  course: number | null;
  altitude: number | null;
  sats: number | null;
  accuracyM: number | null;
  batteryPct: number | null;
  flags: string[];
}

export interface TripPoint {
  lat: number;
  lng: number;
  ts: number;
}

export interface TripSummary {
  index: number;
  startTs: number;
  endTs: number;
  distanceM: number;
  durationMin: number;
  pointCount: number;
}

export interface TripDetail extends TripSummary {
  path: TripPoint[];
}

export interface Vaccine {
  id: string;
  petId: string;
  catalogId: string | null;
  name: string;
  appliedAt: string;
  nextDoseAt: string | null;
  vetName: string | null;
  clinic: string | null;
  notes: string | null;
  documentKey: string | null;
}

export interface WeightEntry {
  id: string;
  petId: string;
  weightKg: number;
  measuredAt: string;
  bodyCondition: number | null;
  variation: number | null;
}

export interface NutritionProfile {
  petId: string;
  activityLevel: string;
  bodyCondition: number | null;
  targetWeightKg: number | null;
  foodType: string;
  kcalPer100g: number;
  allergies: string[];
  diseases: string[];
  updatedAt: string;
}

export interface NutritionWarning {
  code: string;
  message: string;
}

export interface NutritionPlan {
  id: string;
  petId: string;
  rerKcal: number;
  merKcal: number;
  dailyGrams: number;
  mealsPerDay: number;
  mealTimes: string[];
  objective: string;
  warnings: NutritionWarning[];
  aiExplanation: string | null;
  generatedAt: string;
}
