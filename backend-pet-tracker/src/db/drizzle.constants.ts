// Token de inyección para el cliente Drizzle (drizzle-orm/node-postgres)
// expuesto por DrizzleModule. Se define UNA vez aquí y se importa tanto en
// los @Inject() de repositorios Drizzle como en el provide: de
// drizzle.module.ts (ver docs/conventions.md §Tokens de inyección).
export const DRIZZLE = Symbol('DRIZZLE');

// Token del pg.Pool crudo, separado de DRIZZLE, únicamente para poder
// cerrarlo de forma ordenada en OnModuleDestroy (evita handles de socket
// colgados, sobre todo en tests e2e que abren/cierran la app varias veces).
// No se inyecta en código de negocio: los repositorios usan DRIZZLE.
export const PG_POOL = Symbol('PG_POOL');
