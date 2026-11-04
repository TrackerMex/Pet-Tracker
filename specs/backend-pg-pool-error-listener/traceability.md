---
feature: "backend-pg-pool-error-listener"
status: draft        # draft | approved
tags: [harness, spec, backend, db, resiliencia]
---

# Trazabilidad — [[backend-pg-pool-error-listener]]

Las filas se rellenan en un único commit al cerrar la cadena ([[tasks]] §Cierre).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `backend-pet-tracker/src/db/drizzle.module.spec.ts::#238 R1: an error emitted by PG_POOL is logged with Logger.error and does not throw`; cuentas `grep -cF` de [[requirements]] R1 conformes; M1 y M2 fallan por su aserción y se restauran con `exit=0`. Evidencia en `progress/impl_backend-pg-pool-error-listener.md` §Sesión 2 (tras la enmienda E1). | Rojo: `51c72df3e0d94551d491535af079c8a834c14539` — `test(backend-pg-pool-error-listener): PG_POOL error is logged and does not throw (R1)`. Verde: `eb45daf82910795e608283a462a5a9ec2d6748e6` — `fix(backend-pg-pool-error-listener): log idle client errors on PG_POOL instead of crashing (R1)`. |
| R2 | `backend-pet-tracker/src/db/drizzle.module.spec.ts::resolves a drizzle-orm/node-postgres client under DRIZZLE`, cuyo bloque R4 coincide íntegro con H0; comandos de [[tasks]] §R2: diff contra `origin/dev...HEAD` limitado a los dos archivos previstos, rutas protegidas sin cambios (`exit=0`), anclas R4 `1` y `1`; suite unitaria `198 passed`, `1651 passed`, tsc y eslint con `exit=0`. Cada suite completa estuvo precedida de `espera=1`. Evidencia en `progress/impl_backend-pg-pool-error-listener.md` §Sesión 2 (tras la enmienda E1). | Cadena verificada: `51c72df3e0d94551d491535af079c8a834c14539` — `test(backend-pg-pool-error-listener): PG_POOL error is logged and does not throw (R1)`; `eb45daf82910795e608283a462a5a9ec2d6748e6` — `fix(backend-pg-pool-error-listener): log idle client errors on PG_POOL instead of crashing (R1)`. R2 verifica el alcance de esos commits; no añade implementación. |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test|fix|docs(backend-pg-pool-error-listener): <desc> (R1,R2)`.
El implementer rellena esta tabla en el commit de cierre; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
