# Implementación — feature #47 reminders-api

Fecha: 2026-08-24
Branch: `feature/47-reminders-api`
Estado: implementación terminada; lista para reviewer, aún `in_progress`.

## Resultado

- `GET /v1/pets/:petId/reminders` devuelve todos los estados ordenados por
  `dueAt` ascendente, `[]` sin filas y permite cualquier membresía activa bajo
  `PetAccessGuard`.
- `DELETE /v1/pets/:petId/reminders/:id` hace borrado real y responde 204 sin
  body para owner; devuelve 404 para UUID inválido, fila inexistente, reminder
  de otra mascota o no-miembro, y 403 para un miembro activo no-owner.
- Se añadieron los puertos `listByPet` y `deleteByPetAndId`, sus implementaciones
  Drizzle, casos de uso y providers NestJS sin cambiar schema, dependencias ni
  variables de entorno.
- POST, PATCH, dispatcher y scheduler existentes no se modificaron.

## TDD y trazabilidad

| Requisito | Rojo | Verde |
|---|---|---|
| R1 | `b469cf9 test(reminders-api): define reminder listing in red (R1)` | `c2fa98c feat(reminders-api): list reminders by pet (R1)` |
| R2 | `b4e1f90 test(reminders-api): define reminder deletion in red (R2)` | `5595a31 feat(reminders-api): delete reminders by pet (R2)` |

Los rojos se comprobaron antes de producción: R1 falló por caso de uso ausente
y GET 404; R2 falló por caso de uso ausente y DELETE 404. Tras cada verde se
actualizaron `tasks.md` y `traceability.md`.

## Verificación R3

- `pnpm -C backend-pet-tracker run lint`: exit 0.
- `pnpm -C backend-pet-tracker test`: 145/145 suites y 1114/1114 tests.
- `pnpm -C backend-pet-tracker run test:e2e`: exit 0; 20 suites pasadas,
  327 tests pasados. Se omitieron 2 suites/6 tests de smoke AWS real por su
  gate de entorno, ajenos a esta feature.
- Suite enfocada `test/pet-reminders.e2e-spec.ts`: 33/33 tests; incluye R1 y
  R2 con Postgres y LocalStack reales.
- `./init.sh`: exit 0 y mensaje `Todo verde`; ejecutó build, tests backend
  (1114), infra (14), harness (28), móvil (357), e2e (327), lint y typecheck.
- Contención comprobada con `git diff --name-only main...HEAD` filtrado por
  rutas permitidas: salida vacía. No hay cambios en `mobile-pet-tracker/`,
  `infra/`, schemas ni otros módulos backend.

Warnings no bloqueantes ya presentes: AWS SDK anuncia el futuro requisito de
Node >=22; las suites móviles imprimen avisos de tokens de tema. Ninguno cambia
el exit code. `STATUS.md` conserva el aviso 37/46 vs 38/47 porque el cierre de
bookkeeping corresponde al reviewer cuando marque #47 `done`.
