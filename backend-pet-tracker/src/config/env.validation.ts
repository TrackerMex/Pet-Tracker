export class EnvValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvValidationError';
  }
}
export function validateEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  return config;
}
