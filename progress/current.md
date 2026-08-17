# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

- **feature**: `device-subscriptions` (#25, P2)
- **branch**: `feature/25-device-subscriptions`
- **inicio**: 2026-08-17
- **estado**: implementación en curso; R1-R8 y R15 verdes, iniciando R9
- **spec**: `specs/device-subscriptions/requirements.md` (18 requisitos, R1–R18)
- **implementador**: Codex CLI en terminal aparte (no el subagente `implementer`)

## Plan que implementa Codex

Tabla `device_subscriptions` (una fila por device) más un único derivador de
entitlement, y los gates que lo consumen:

1. **R1, R17** — schema + migración + backfill de grandfathering de los devices
   preexistentes, para que el entorno local y el smoke de GPS real no se apaguen
   al aplicar la migración.
2. **R2, R3** — la regla de "suscripción vigente" en UN solo predicado SQL,
   detrás de `SubscriptionRepository.isPetTracked()` / `isDeviceEntitled()`.
   Gracia derivada de `current_period_end + DEVICE_SUBSCRIPTION_GRACE_DAYS`.
3. **R4, R5, R6, R13** — el poller deja de encolar devices sin suscripción
   vigente (el 90% del ahorro), vencer **nunca** libera el device, y el
   watermark solo se resetea en la transición no-vigente → vigente. Script
   `subscription:set` para administrar el status a mano en esta fase.
4. **R7, R8, R15** — el claim exige suscripción activa en el ÚLTIMO lugar del
   orden de validación, y `PetTrackingGuard` compuesto **después** de
   `PetAccessGuard`.
5. **R9, R10, R11** — las 10 rutas de tracking gateadas y ninguna más;
   `/v1/alerts` filtra en vez de responder 402; el no-owner de una mascota con
   collar suscrito ve el mapa sin suscripción propia.
6. **R12, R14, R16, R18** — contrato heredado por #18, cero acoplamiento a
   proveedores de pago, forma del contrato HTTP intacta, `docs/data-model.md`.

El orden de ejecución vive en `specs/device-subscriptions/tasks.md` y no es el
orden numérico de los R-ids.

## Riesgo de seguridad a vigilar en la revisión

El `402` **nunca** puede adelantarse al `404` de membresía: un 402 sobre una
mascota ajena revelaría que existe (brief §4). `PetTrackingGuard` va después de
`PetAccessGuard`, y R8 lo fija con test.

## Decisiones del gate humano (2026-08-17)

- **Opción A**: el criterio del ai-explainer se trasladó a
  `acceptance_criteria` de la entrada #18 de `feature_list.json`. #25 cierra sin
  ese runtime porque #17 y #18 siguen `pending`.

## Siguiente paso

Implementar R9: gatear exactamente los cuatro controllers y sus 10 rutas.

## Entorno local

- `drizzle-kit migrate` encontró las tablas de `0009`–`0011` presentes pero
  sin sus filas de journal (drift ya documentado en
  `progress/impl_pet-reminders.md`). Se validaron columnas, constraints e
  índices, se reconciliaron solo esas tres filas en el Postgres Docker y el
  comando aplicó `0012` correctamente.
- R1/R17: 3/3 e2e verdes. Suite e2e completa: 18 suites / 263 tests verdes,
  2 suites / 6 tests omitidos por sus gates existentes.
- R2-R7: predicado, repositorio, poller, retención, CLI/reset y claim verdes.
  R7: 14 unitarios y 27 e2e de devices verdes.
- R8: 3 unitarios del guard verdes; build verde.
- R15: AppModule resuelve repositorio y guard; 23 e2e de suscripciones y build verdes.
