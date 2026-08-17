# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

- **feature**: `device-subscriptions` (#25, P2)
- **branch**: `feature/25-device-subscriptions`
- **inicio**: 2026-08-17
- **estado**: Codex terminó (54 commits, `f1814b1..9ea58cd`); `reviewer` en curso
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
- **Pendiente de confirmar**: R17 modifica `scripts/seed-devices.ts`, que la
  spec de #24 congelaba en su R6. Está justificado por escrito en la spec, pero
  es una enmienda sobre una spec ya aprobada.

## Cierre prematuro por Codex — revertido

El commit `9ea58cd` ("close feature lifecycle") marcó #25 como `done`, vació
este archivo a `progress/history.md` y actualizó `STATUS.md`, **sin veredicto
del `reviewer`**. Eso es el gate duro de `CLAUDE.md`: el implementador no cierra
su propio trabajo.

Revertido a `in_progress` antes de revisar. `STATUS.md` y `progress/history.md`
siguen con el texto de cierre que escribió Codex: se corrigen en el cierre real,
según el veredicto. El reporte `progress/impl_device-subscriptions.md` sí es
suyo por contrato y se conserva.

## Siguiente paso

`reviewer` valida contra `CHECKPOINTS.md` (C2–C7), la spec y la trazabilidad, y
corre `./init.sh` él mismo. Veredicto en
`progress/review_device-subscriptions.md`.
