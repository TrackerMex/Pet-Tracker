export const DATABASE_HEALTH_CHECKER = Symbol('DATABASE_HEALTH_CHECKER');

export interface DatabaseHealthChecker {
  ping(): Promise<boolean>;
}
