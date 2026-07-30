// Token de inyección para el cliente Drizzle (drizzle-orm/node-postgres)
// expuesto por DrizzleModule. Se define UNA vez aquí y se importa tanto en
// los @Inject() de repositorios Drizzle como en el provide: de
// drizzle.module.ts (ver docs/conventions.md §Tokens de inyección).
export const DRIZZLE = Symbol('DRIZZLE');
