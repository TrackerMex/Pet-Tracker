# Implementación — mobile-home-reminders-real-data (#85)

## Alcance y baseline

- Branch: `feature/85-mobile-home-reminders-real-data`.
- Base de deltas: `20c7b3c`; implementación retomada sobre `df9b398` tras A7.
- `env -u FORCE_COLOR ./init.sh`: exit 0 antes de escribir código.
- Móvil: 68 suites, 1078 tests y 1 snapshot, todo verde.
- Backend: 163 suites/1243 tests; infra: 2/14; e2e: 25 suites/354 tests
  pasados y 3 suites/8 tests omitidos.
- Alcance respetado: cero cambios en backend, infra, hosting, API móvil,
  componentes compartidos, tema o rutas.

## Implementación por R-id

- **R1**: rojo `5ad5bc6`; verde `41e7a99`. La Home observa la copy restaurada
  en español e inglés; los candados de catálogo y usos quedaron 114/114 verdes
  sin cambiar ningún recuento.
- **R2**: rojo `109cdaa`; verde `2fb06c5`. `localDayOf` construye el instante
  crudo, usa getters locales y rellena mes/día a dos dígitos.

## Prueba de mutación

Todas las mutaciones se plantan en código de producción, de una en una.

| Mutación | Cambio y rojo observado | Restauración |
|---|---|---|
| M1 | Commit `97e06c0`: `localDayOf` cambió a `getUTC*`. `bun run test`, con `TZ` ausente, dejó 1 suite/1 test rojo y 67 suites/1082 tests verdes. Cayó exactamente `#85 R2` → `it('toma el día civil de los getters locales, nunca de los UTC')`: esperaba `2026-09-11`, recibió `2026-09-12`. `3d0ab78` completó el doble de padding para eliminar un `TypeError` secundario antes de registrar la evidencia definitiva. | Getters locales restaurados; `format.test.ts` volvió a 9/9 verde. |
