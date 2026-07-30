// Barrel de schema Drizzle — punto de entrada único para drizzle-kit
// (ver drizzle.config.ts y docs/architecture.md). Cada feature de datos
// futura agrega su propio `<module>.schema.ts` en este directorio y lo
// re-exporta aquí; el barrel en sí nunca contiene tablas de dominio.
//
// `schemaBootstrap` es un placeholder técnico (no representa ningún
// concepto de negocio) que existe únicamente para que `drizzle-kit
// generate` tenga al menos una migración versionada desde esta feature
// (R3 de specs/db-setup-drizzle/requirements.md) — un schema totalmente
// vacío no produce ningún archivo .sql. Elimínalo (con su migración de
// down correspondiente) en cuanto la primera feature con tablas de
// dominio reales (auth-registration, id=3, users.schema.ts) se implemente.
export * from './bootstrap.schema';
