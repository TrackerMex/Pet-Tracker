// Interface pura de domain — sin imports de Drizzle, pg ni @nestjs/common.
// El token se define aquí, junto a la interface (ver docs/conventions.md
// §Tokens de inyección), y se importa tanto en el @Inject() del use case
// como en el provide: de health.module.ts.
export const DATABASE_HEALTH_CHECKER = Symbol('DATABASE_HEALTH_CHECKER');

export interface DatabaseHealthChecker {
  ping(): Promise<boolean>;
}
