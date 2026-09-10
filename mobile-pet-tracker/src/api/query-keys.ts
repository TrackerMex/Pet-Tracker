export const petKeys = {
  list: () => ['pets', 'list'] as const,
  detail: (petId: string) => ['pets', 'detail', petId] as const,
};

export const nutritionKeys = {
  plan: (petId: string) => ['nutrition', 'plan', petId] as const,
  profile: (petId: string) => ['nutrition', 'profile', petId] as const,
};

export const healthKeys = {
  vaccines: (petId: string) => ['health', 'vaccines', petId] as const,
  weights: (petId: string, limit: number | undefined) =>
    ['health', 'weights', petId, { limit }] as const,
};

export const positionKeys = {
  'last': (petId: string) => ['positions', 'last', petId] as const,
  list: (petId: string) => ['positions', 'list', petId] as const,
};

export const tripKeys = {
  dayRoute: (petId: string) => ['trips', 'day-route', petId] as const,
};

export const activityKeys = {
  daily: (petId: string) => ['activity', 'daily', petId] as const,
};

export const reminderKeys = {
  list: (petId: string) => ['reminders', 'list', petId] as const,
};

export const deviceKeys = {
  tracking: (petId: string) => ['devices', 'tracking', petId] as const,
};

export const userKeys = {
  me: () => ['users', 'me'] as const,
};

export const mediaKeys = {
  petDocs: (petId: string) => ['media', 'pet-docs', petId] as const,
};
