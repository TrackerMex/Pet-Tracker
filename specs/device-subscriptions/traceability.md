---
feature: "device-subscriptions"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[device-subscriptions]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `test/device-subscriptions.e2e-spec.ts::R1 (device-subscriptions #25): device_subscriptions schema` | `ae15c15` red; `d8eb957` schema + migration |
| R2 | `src/modules/subscriptions/infrastructure/entitlement.predicate.spec.ts::R2 (device-subscriptions #25): single entitlement predicate` | `7f75218` red; `238b7df` predicate |
| R3 | `test/device-subscriptions.e2e-spec.ts::R3 (device-subscriptions #25): derive pet and device entitlement` | `fe506d6` red; `1686166` repository |
| R4 | `test/device-subscriptions.e2e-spec.ts::R4 (device-subscriptions #25): poll only entitled assignments` | `07cc06d` red; `c61c729` store join |
| R5 | `test/device-subscriptions.e2e-spec.ts::R5 (device-subscriptions #25): expiration keeps the assignment` | `1a95002` test verde al añadirse; propiedad de ausencia, sin implementación adicional |
| R6 | `test/device-subscriptions.e2e-spec.ts::R6 (device-subscriptions #25): reset watermark on reactivation` | `0341d62` red; `4356417` transition reset |
| R7 | `src/modules/devices/application/use-cases/claim-device.use-case.spec.ts::R7 (device-subscriptions #25): subscription is the last claim check`; `test/devices.e2e-spec.ts::R7 (device-subscriptions #25): claim requires an active subscription last` | `a6bc9ca` red; `a4682cd` claim + 402 mapping |
| R8 | `src/modules/subscriptions/infrastructure/guards/pet-tracking.guard.spec.ts::R8 (device-subscriptions #25): PetTrackingGuard` | `e5bb926` red; `b8df30d` guard |
| R9 | `test/device-subscriptions.e2e-spec.ts::R9 (device-subscriptions #25): exact tracking route gate` | `8256ac4` red; `6a217d4` controller guards |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |
| R13 | `test/device-subscriptions.e2e-spec.ts::R13 (device-subscriptions #25): idempotent subscription:set` | `6b07d89` red; `6ba4350` CLI/upsert |
| R14 | pendiente | pendiente |
| R15 | `test/device-subscriptions.e2e-spec.ts::R15 (device-subscriptions #25): subscriptions module wiring` | `c06fd74` red; `b8bc340` module wiring |
| R16 | pendiente | pendiente |
| R17 | `test/device-subscriptions.e2e-spec.ts::R17 (device-subscriptions #25): grandfather existing devices` | `f171ffa` red; `e86435f` backfill + seed |
| R18 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(device-subscriptions): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Requisitos verificados por `grep` / inspección

R2, R5, R11, R12, R14 y R16 se cierran (total o parcialmente) con comandos, no
con un `describe`. Registrar aquí el **comando exacto y su salida** cuando se
ejecuten:

| Requisito | Comando | Salida registrada |
|---|---|---|
| R2 | `grep -rn "current_period_end\|currentPeriodEnd\|GRACE_DAYS" backend-pet-tracker/src/` | 10 coincidencias: migración/snapshot versionados, schema, constante, predicado y spec; ver salida debajo |
| R5 | `grep -rnE "update\(petDevices\)\|update\(devices\).*status\|set\(\{[^}]*releasedAt" backend-pet-tracker/src/modules/subscriptions backend-pet-tracker/src/workers/ingestion.drizzle.store.ts backend-pet-tracker/scripts/seed-devices.ts` | sin salida (exit 1 de grep); no hay UPDATE de asignación/status |
| R11 | inspección: ninguna columna/parámetro liga `device_subscriptions` a `users` | pendiente |
| R12 | `ls backend-pet-tracker/src/modules/nutrition` + `grep -rn "aiExplanation" backend-pet-tracker/src/` | pendiente |
| R14 | `grep -rni "stripe\|paypal\|mercadopago\|checkout.session\|webhook" backend-pet-tracker/src/` | pendiente |
| R16 | `grep -rn "tracked\|entitled\|planCode\|subscription" backend-pet-tracker/src/modules/*/infrastructure/mappers/` | pendiente |

### Salida R2

```text
backend-pet-tracker/src/db/migrations/0012_absent_black_bolt.sql:5: "current_period_end" timestamp with time zone NOT NULL,
backend-pet-tracker/src/db/migrations/0012_absent_black_bolt.sql:14:INSERT INTO device_subscriptions (device_id, status, plan_code, current_period_end)
backend-pet-tracker/src/db/migrations/meta/0012_snapshot.json:1783: "current_period_end": {
backend-pet-tracker/src/db/migrations/meta/0012_snapshot.json:1784: "name": "current_period_end",
backend-pet-tracker/src/db/schema/subscriptions.schema.ts:15: currentPeriodEnd: timestamp('current_period_end', {
backend-pet-tracker/src/modules/subscriptions/domain/subscription.constants.ts:1:export const DEVICE_SUBSCRIPTION_GRACE_DAYS = 3;
backend-pet-tracker/src/modules/subscriptions/infrastructure/entitlement.predicate.spec.ts:2:import { DEVICE_SUBSCRIPTION_GRACE_DAYS } from '@/modules/subscriptions/domain/subscription.constants';
backend-pet-tracker/src/modules/subscriptions/infrastructure/entitlement.predicate.spec.ts:9: expect(query.params).toContain(DEVICE_SUBSCRIPTION_GRACE_DAYS);
backend-pet-tracker/src/modules/subscriptions/infrastructure/entitlement.predicate.ts:3:import { DEVICE_SUBSCRIPTION_GRACE_DAYS } from '@/modules/subscriptions/domain/subscription.constants';
backend-pet-tracker/src/modules/subscriptions/infrastructure/entitlement.predicate.ts:7-8: and ${deviceSubscriptions.currentPeriodEnd} > now() - (${DEVICE_SUBSCRIPTION_GRACE_DAYS} * interval '1 day')
```

## Verificación manual (la corre el humano, no un agente)

| Qué | Por qué no lo cierra un agente | Estado |
|---|---|---|
| Smoke de GPS real (unidad Wialon `401775970`) tras el backfill de R17 | exige `SIM_MODE=false` + token real y hardware físico (`CLAUDE.md` §Excepciones) | pendiente |
| `subscription:set` contra el collar real | escribe sobre el device que alimenta el smoke | pendiente |
