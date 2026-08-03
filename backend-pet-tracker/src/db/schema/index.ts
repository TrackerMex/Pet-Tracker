// Barrel de schema Drizzle — punto de entrada único para drizzle-kit
// (ver drizzle.config.ts y docs/architecture.md). Cada feature de datos
// futura agrega su propio `<module>.schema.ts` en este directorio y lo
// re-exporta aquí; el barrel en sí nunca contiene tablas de dominio.
//
// El placeholder técnico `schemaBootstrap` de db-setup-drizzle (#1) se
// eliminó aquí: auth-registration (#3) es la primera feature con tablas de
// dominio reales, que es la condición que su propio comentario fijaba para
// borrarlo.
export * from './activity.schema';
export * from './audit-log.schema';
export * from './devices.schema';
export * from './email-verification-tokens.schema';
export * from './pets.schema';
export * from './users.schema';
