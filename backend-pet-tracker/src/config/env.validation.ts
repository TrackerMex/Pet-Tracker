import { isProduction } from './environment';
export class EnvValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvValidationError';
  }
}
export function validateEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  if (!isProduction(config.NODE_ENV as string | undefined)) return config;
  const problems: string[] = [];
  const blank = (key: string): boolean => {
    const value = config[key];
    return typeof value !== 'string' || !value.trim();
  };
  if (config.SIM_MODE !== 'true' && config.SIM_MODE !== 'false')
    problems.push('SIM_MODE');
  if (
    config.SIM_MODE === 'false' &&
    (blank('WIALON_TOKEN') || config.WIALON_TOKEN === 'PENDING')
  )
    problems.push('WIALON_TOKEN');
  if (config.EMAIL_ENABLED === 'true')
    for (const key of ['RESEND_API_KEY', 'RESEND_FROM', 'RESET_LINK_HOST'])
      if (blank(key)) problems.push(key);
  if (config.ANTHROPIC_ENABLED === 'true') {
    if (blank('ANTHROPIC_API_KEY') || config.ANTHROPIC_API_KEY === 'PENDING')
      problems.push('ANTHROPIC_API_KEY');
    if (blank('ANTHROPIC_MODEL')) problems.push('ANTHROPIC_MODEL');
  }
  if (blank('JWT_SECRET')) problems.push('JWT_SECRET');
  if (problems.length)
    throw new EnvValidationError(
      `Invalid production environment: ${problems.join(', ')}`,
    );
  return config;
}
