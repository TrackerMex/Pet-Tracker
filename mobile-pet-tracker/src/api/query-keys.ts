function notImplemented(): never {
  throw new Error('not implemented');
}

export const petKeys = {
  list: () => notImplemented(),
  detail: (_petId: string) => notImplemented(),
};

export const nutritionKeys = {
  plan: (_petId: string) => notImplemented(),
  profile: (_petId: string) => notImplemented(),
};

export const healthKeys = {
  vaccines: (_petId: string) => notImplemented(),
  weights: (_petId: string, _limit: number | undefined) => notImplemented(),
};

export const positionKeys = {
  last: (_petId: string) => notImplemented(),
  list: (_petId: string) => notImplemented(),
};

export const tripKeys = {
  dayRoute: (_petId: string) => notImplemented(),
};

export const activityKeys = {
  daily: (_petId: string) => notImplemented(),
};

export const reminderKeys = {
  list: (_petId: string) => notImplemented(),
};

export const deviceKeys = {
  tracking: (_petId: string) => notImplemented(),
};

export const userKeys = {
  me: () => notImplemented(),
};

export const mediaKeys = {
  petDocs: (_petId: string) => notImplemented(),
};
