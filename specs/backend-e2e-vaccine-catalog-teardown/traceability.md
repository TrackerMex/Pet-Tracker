---
feature: "backend-e2e-vaccine-catalog-teardown"
status: draft        # draft | approved
tags: [harness, spec, backend, e2e, flake]
---

# Trazabilidad — [[backend-e2e-vaccine-catalog-teardown]]

Las filas se rellenan en un único commit al cerrar la cadena ([[tasks]] §Cierre).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente: `backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts::#237 R1: con una sesion viva, dropDatabase rechaza con 55006, no borra la base y la sesion no recibe 57P01` | pendiente |
| R2 | pendiente: `backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts::#237 R2: justo despues de pool.end(), dropDatabase borra la base y el pool no recibe ningun error` | pendiente |
| R3 | pendiente: cuentas `grep -cF` de [[requirements]] R3, mutación M1 y `Tests: 9 passed, 9 total` del fichero (en `progress/impl_backend-e2e-vaccine-catalog-teardown.md`) | pendiente |
| R4 | pendiente: comandos de [[tasks]] §R4 (`git diff --name-only` y `git diff --quiet` contra `5c7c9547`, suite unitaria, `tsc` y `eslint`) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test|fix|docs(backend-e2e-vaccine-catalog-teardown): <desc> (R1,R2)`.
El implementer rellena esta tabla en el commit de cierre; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
