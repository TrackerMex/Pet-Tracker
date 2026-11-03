---
feature: "backend-pg-pool-error-listener"
status: draft        # draft | approved
tags: [harness, spec, backend, db, resiliencia]
---

# Trazabilidad — [[backend-pg-pool-error-listener]]

Las filas se rellenan en un único commit al cerrar la cadena ([[tasks]] §Cierre).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente: `backend-pet-tracker/src/db/drizzle.module.spec.ts::#238 R1: an error emitted by PG_POOL is logged with Logger.error and does not throw`, más las cuentas `grep -cF` de [[requirements]] R1 y las mutaciones M1 y M2 (en `progress/impl_backend-pg-pool-error-listener.md`) | pendiente |
| R2 | pendiente: comandos de [[tasks]] §R2 (`git diff --name-only` y `git diff --quiet` contra `origin/dev...HEAD`, cuentas del `describe('R4: …')`, suite unitaria, `tsc` y `eslint`) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test|fix|docs(backend-pg-pool-error-listener): <desc> (R1,R2)`.
El implementer rellena esta tabla en el commit de cierre; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
