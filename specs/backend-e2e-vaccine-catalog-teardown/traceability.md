---
feature: "backend-e2e-vaccine-catalog-teardown"
status: draft        # draft | approved
tags: [harness, spec, backend, e2e, flake]
---

# Trazabilidad — [[backend-e2e-vaccine-catalog-teardown]]

Las filas se rellenan en un único commit al cerrar la cadena ([[tasks]] §Cierre).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts::#237 R1: con una sesion viva, dropDatabase rechaza con 55006, no borra la base y la sesion no recibe 57P01`. Rojo: `1 failed, 7 passed, 8 total`, `exit=1`; verde: `8 passed, 8 total`, `exit=0`. | Rojo `4c93d2c0d8e71225b3bc4859c76939bed9e1a60a` — `test(backend-e2e-vaccine-catalog-teardown): a live session survives dropDatabase (R1)`; verde `5cfbc6a4afe399df3f82312e48f8ab2099b5cc9e` — `fix(backend-e2e-vaccine-catalog-teardown): drop test databases without FORCE (R1,R3)` |
| R2 | `backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts::#237 R2: justo despues de pool.end(), dropDatabase borra la base y el pool no recibe ningun error`. Nace verde: `9 passed, 9 total`, `exit=0`. | `83cca5784fac0cd55e11b8a5f17d6fa4ce0840a0` — `test(backend-e2e-vaccine-catalog-teardown): dropDatabase right after pool.end() (R2, nace verde)` |
| R3 | Las once cuentas `grep -cF` de [[requirements]] R3 coinciden; el diff de `cleanup` contra `5c7c9547` solo cambia las dos funciones de borrado. Suite: `9 passed, 9 total`. M1: R1 falla por `Received promise resolved instead of rejected`, `1 failed, 8 passed, 9 total`, `exit=1`, cuenta FORCE `1`. Restauración: `git diff --quiet HEAD` del e2e, `exit=0`. Evidencia en `progress/impl_backend-e2e-vaccine-catalog-teardown.md` §Sesión 2. | Arreglo `5cfbc6a4afe399df3f82312e48f8ab2099b5cc9e` — `fix(backend-e2e-vaccine-catalog-teardown): drop test databases without FORCE (R1,R3)`; verificado sobre `83cca5784fac0cd55e11b8a5f17d6fa4ce0840a0` — `test(backend-e2e-vaccine-catalog-teardown): dropDatabase right after pool.end() (R2, nace verde)` |
| R4 | `git diff --name-only 5c7c9547...HEAD -- backend-pet-tracker/` lista solo el e2e; `git diff --quiet` de src, package.json y pnpm-lock.yaml, `exit=0`. Unitarios: `198 passed, 198 total` suites y `1650 passed, 1650 total` tests, `exit=0`; `tsc --noEmit` y eslint del fichero, `exit=0`. Evidencia en `progress/impl_backend-e2e-vaccine-catalog-teardown.md` §Sesión 2. | Revisión verificada `83cca5784fac0cd55e11b8a5f17d6fa4ce0840a0` — `test(backend-e2e-vaccine-catalog-teardown): dropDatabase right after pool.end() (R2, nace verde)`. Evidencia documentada en el commit de cierre que contiene esta tabla. |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test|fix|docs(backend-e2e-vaccine-catalog-teardown): <desc> (R1,R2)`.
El implementer rellena esta tabla en el commit de cierre; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
