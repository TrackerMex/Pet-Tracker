---
feature: "device-subscriptions"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[device-subscriptions]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente | pendiente |
| R2 | pendiente | pendiente |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |
| R13 | pendiente | pendiente |
| R14 | pendiente | pendiente |
| R15 | pendiente | pendiente |
| R16 | pendiente | pendiente |
| R17 | pendiente | pendiente |
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
| R2 | `grep -rn "current_period_end\|currentPeriodEnd\|GRACE_DAYS" backend-pet-tracker/src/` | pendiente |
| R5 | `grep -rn "releasedAt" <archivos nuevos/modificados de la feature>` | pendiente |
| R11 | inspección: ninguna columna/parámetro liga `device_subscriptions` a `users` | pendiente |
| R12 | `ls backend-pet-tracker/src/modules/nutrition` + `grep -rn "aiExplanation" backend-pet-tracker/src/` | pendiente |
| R14 | `grep -rni "stripe\|paypal\|mercadopago\|checkout.session\|webhook" backend-pet-tracker/src/` | pendiente |
| R16 | `grep -rn "tracked\|entitled\|planCode\|subscription" backend-pet-tracker/src/modules/*/infrastructure/mappers/` | pendiente |

## Verificación manual (la corre el humano, no un agente)

| Qué | Por qué no lo cierra un agente | Estado |
|---|---|---|
| Smoke de GPS real (unidad Wialon `401775970`) tras el backfill de R17 | exige `SIM_MODE=false` + token real y hardware físico (`CLAUDE.md` §Excepciones) | pendiente |
| `subscription:set` contra el collar real | escribe sobre el device que alimenta el smoke | pendiente |
