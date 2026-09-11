---
feature: "dto-dates-owner-timezone"
status: spec_ready     # draft | spec_ready | approved
tags: [harness, spec]
---

# Trazabilidad — [[dto-dates-owner-timezone]]

> Rutas relativas a `backend-pet-tracker/`; líneas del commit base `381d1e36`.
> R1-R6 se trazan a tests que nombran su R-id; R7 y R8 son requisitos de
> verificación y se trazan a comandos y a las secciones del reporte de
> implementación / revisión. Codex actualiza esta tabla tras cada commit; el
> reviewer la valida al aprobar (ver [[../../docs/specs|specs]] y
> [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Requisitos

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/modules/health/application/use-cases/create-weight.use-case.spec.ts::R1 (dto-dates-owner-timezone #89): create compara measuredAt con el dia civil del owner, sin margen::'acepta hoy local aunque UTC ya sea manana (America/Mexico_City, 20:00)'`, `'rechaza manana local aunque UTC ya sea ese dia (America/Mexico_City, 20:00)'`, `'acepta hoy local aunque UTC todavia sea ayer (Pacific/Kiritimati, 10:00)'` | pendiente (rojo: commit 1 `test(...) (R1)`; verde: commit 2 `feat(...) (R1)`) |
| R2 | `src/modules/pets/application/use-cases/create-pet.use-case.spec.ts::R2 (dto-dates-owner-timezone #89): create compara birthDate con el dia civil del requester, no con el dia UTC::'acepta hoy local aunque UTC ya sea manana (America/Mexico_City, 20:00)'`, `'rechaza manana local aunque UTC ya sea ese dia (America/Mexico_City, 20:00)'`, `'acepta hoy local aunque UTC todavia sea ayer (Pacific/Kiritimati, 10:00)'`, `'sin birthDate (approxAgeMonths) no consulta la zona del requester'` | pendiente (rojo: commit 3; verde: commit 4) |
| R3 | `src/modules/pets/application/requester-local-day.spec.ts::R3 (dto-dates-owner-timezone #89): requesterLocalDay resuelve el dia civil del requester y degrada a UTC con un warn::'con zona IANA valida devuelve el dia local de now sin avisar'`, `'sin usuario (null) devuelve el dia UTC de now y avisa una vez'`, `"con 'Not/A/Zone' devuelve el dia UTC de now y avisa una vez"` + candado sin editar `owner-local-day.spec.ts` (#88 R3), `get-pet.use-case.spec.ts` (#82 R1/R2), `vaccine-mutations.use-cases.spec.ts` (#88 R1/R2) | pendiente (rojo: commit 5; verde: commit 6) |
| R4 | `src/modules/pets/application/use-cases/update-pet.use-case.spec.ts::R4 (dto-dates-owner-timezone #89): update compara birthDate con el dia civil del owner solo cuando el body lo trae::'acepta hoy local aunque UTC ya sea manana (America/Mexico_City, 20:00)'`, `'rechaza manana local aunque UTC ya sea ese dia (America/Mexico_City, 20:00)'`, `'acepta hoy local aunque UTC todavia sea ayer (Pacific/Kiritimati, 10:00)'`, `'sin birthDate en el body no consulta la zona del owner'` | pendiente (rojo: commit 7; verde: commit 8) |
| R5 | `test/health-weights.e2e-spec.ts::R5 (dto-dates-owner-timezone #89): measuredAt se compara con el dia civil del owner, sin margen::'POST acepta hoy y rechaza manana en la zona del owner para Pacific/Kiritimati y Pacific/Pago_Pago (R5)'` + heredado adaptado `R7 (health-weights #15)::'acepta hoy y rechaza manana (owner en UTC; sin margen desde #89)'` | pendiente (rojo: commit 9; verde: commit 10) |
| R6 | `test/pets.e2e-spec.ts::R6 (dto-dates-owner-timezone #89): birthDate se compara con el dia civil del requester en POST y del owner en PATCH::'POST acepta hoy y rechaza manana en la zona del requester para Pacific/Kiritimati y Pacific/Pago_Pago (R6)'`, `'PATCH acepta hoy y rechaza manana en la zona del owner para Pacific/Kiritimati y Pacific/Pago_Pago (R6)'` | pendiente (rojo: commit 11; verde: commit 12) |
| R7 | Sin test nuevo — `git diff --name-only 381d1e36...HEAD -- backend-pet-tracker/` = los veintidós archivos de [[design]]; diff vacío en `mobile-pet-tracker/` y en los archivos de R7-(d)/(e); los cuatro `grep` del barrido (b) y los dos de (c); suite e2e completa + `env -u FORCE_COLOR bash ./init.sh` verdes; sección `## Regresión (R7)` del reporte | pendiente (commit 13 `docs(...) (R7,R8)`) |
| R8 | Sin test nuevo — M1 (margen `+1` en `create-weight.use-case.ts`) pone rojo R1(2), R5 en Pago_Pago y el heredado de #15 R7; M2 (UTC en `create-pet.use-case.ts`) pone rojos R2(1)(2)(3) y el POST de R6 en al menos una zona; M3 (`localDayInZone` devuelve el día UTC) pone rojos R1(2)(3), R4(2)(3), R3(1), #88 R3(1), #82 R1, #88 R1(2)(3)/R2(2)(3), R5, R6 y #88 R4; sección `## Mutación (R8)` del reporte y reproducción en `progress/review_dto-dates-owner-timezone.md` | pendiente (commit 13) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(dto-dates-owner-timezone): <desc> (R1)` /
`feat(dto-dates-owner-timezone): <desc> (R1)` /
`docs(dto-dates-owner-timezone): <desc> (R7,R8)` — ver [[design]] D12.

## Cobertura de los `acceptance_criteria` de `feature_list.json` #89

| # | Criterio de aceptación (abreviado) | Requisito(s) | Estado |
|---|---|---|---|
| 1 | Peso con `measuredAt` = hoy en la zona del owner → 2xx a cualquier hora; mañana → 400 (desaparece el margen) | R1(1)(2)(3) (unitario con instantes fijos), R5 (e2e, par de zonas, [[design]] D9), M1/M3 de R8 | pendiente |
| 2 | Mascota con `birthDate` = hoy en la zona del requester → 201 a cualquier hora; mañana → 400 | R2(1)(2)(3), R4 (PATCH, [[design]] D7), R6 (e2e POST y PATCH), M2/M3 de R8 | pendiente |
| 3 | Los dos DTOs dejan de comparar fechas; validación en el use case con `now` inyectado, reutilizando `ownerLocalDay` o un equivalente por requester sin duplicar IANA + warn | [[design]] D1 (justificación), R1/R2/R4 (use cases + `now` del controller), R3 (`localDayInZone` compartida + los dos `grep` de R7-c), R5/R6 (los `refine` fuera; el 400 ya no lo produce zod) | pendiente |
| 4 | Un e2e por caso con Kiritimati / Pago_Pago; el barrido de `src` no deja ningún otro comparador contra hoy UTC | R5, R6 (e2e); R7-(b) (barrido con resultado esperado por símbolo; `todayIsoDateUtc` y `MEASURED_AT_MAX_FUTURE_DAYS` borrados) | pendiente |

## Tests de features anteriores actualizados, no borrados

> Una fila por cada test existente cuyo nombre, llamada o comportamiento
> esperado cambia. El reviewer rechaza si algún `it` de #5, #15 o de los DTO
> specs desapareció del árbol sin aparecer aquí.

| Test | Feature dueña | Qué cambia y por qué | Commit |
|---|---|---|---|
| `create-weight.use-case.spec.ts::R10 (health-weights #15)::'no audita cuando la escritura falla'` (`:29-46`) | #15 | Constructor gana `pets = { findOwnerTimezone: jest.fn().mockResolvedValue('UTC') }` como segundo argumento; `execute` gana `NOW_CDMX_EVENING`. Nombre y aserciones intactos (R1 consulta la zona antes del `create`). | pendiente (commit 1) |
| `create-weight.use-case.spec.ts::R10::'audita el id creado con actor y petId tras resolver la escritura'` (`:48-72`) | #15 | Igual que la fila anterior. Queda rojo en el commit 1 por la aridad del constructor viejo (llega a `audit.record`) y verde en el 2. | pendiente (commit 1) |
| `create-pet.use-case.spec.ts::R2::'delega en createWithOwner con los campos mapeados y el ownerId'` (`:61-76`), `::R3::'registra la entrada despues de confirmar la transaccion'` (`:80-93`), `::R3::'no audita nada si la transaccion falla'` (`:95-106`) | #5 | `buildDeps` gana `users` (`findById` → `{ timezone: 'UTC' } as User`); construcción `(pets, users, auditLogger)`; `execute` gana `NOW_CDMX_EVENING`. Nombres y aserciones intactos. Los dos primeros quedan rojos en el commit 3 por la aridad vieja; el tercero sigue verde. | pendiente (commit 3) |
| `pets.controller.spec.ts::R2::'delega el dto validado y el usuario autenticado al use case'` (`:80-93`) | #5 | `toHaveBeenCalledWith(dto, USER.id, expect.any(Date))` (R2: el controller iza `now`). | pendiente (commit 3) |
| `update-pet.use-case.spec.ts::R13/R14/R15` — siete `execute` (`:52,72,84,98,115,128,140`) | #5 | Ganan `NOW_CDMX_EVENING` como cuarto argumento; `buildDeps` gana `findOwnerTimezone` → `'UTC'`. Nombres y aserciones intactos (R4 solo consulta la zona si viene `birthDate`; `'2024-01-15'` es pasado). | pendiente (commit 7) |
| `pets.controller.spec.ts::R13::'pasa petId, usuario y dto al use case y responde el perfil'` (`:284-295`) | #5 | `toHaveBeenCalledWith(PET_ID, USER.id, { name: 'Firu' }, expect.any(Date))`. | pendiente (commit 7) |
| `test/health-weights.e2e-spec.ts::R7 (health-weights #15)::'acepta hoy y hoy mas un dia, pero rechaza hoy mas dos'` (`:380-401`) | #15 | Pasa a `'acepta hoy y rechaza manana (owner en UTC; sin margen desde #89)'`: `isoDateOffset(1)` → `400`, sin tercera petición, `toHaveLength(1)`, `currentWeight === 20`. Único test del repo que dependía de `MEASURED_AT_MAX_FUTURE_DAYS` (import `:15` retirado). | pendiente (commit 9) |
| `test/health-weights.e2e-spec.ts::seedUser` (`:40-56`) y `test/pets.e2e-spec.ts::seedUser` (`:103-121`) | #15 / #5 | Ganan el parámetro `timezone = 'UTC'`; todos los llamadores heredados siguen sembrando en UTC. | pendiente (commits 9 y 11) |
| `create-pet.dto.spec.ts::R4::'rechaza birthDate posterior a hoy'` (fila `:56` del `it.each`) | #5 | Fila retirada: la regla «no posterior a hoy» sale del DTO (criterio 3) y la cubren R2(2) y R6. `'acepta birthDate de hoy…'` (`:79-85`) no cambia. | pendiente (commit 11) |
| `update-pet.dto.spec.ts::R13::'rechaza birthDate futura (mismas reglas que R4)'` (fila `:16` del `it.each`) | #5 | Fila retirada: misma razón; la cubren R4(2) y R6 (PATCH). | pendiente (commit 11) |

## Tests que deben quedar verdes SIN editarse

> Comprobación explícita del reviewer: si alguno de estos hizo falta tocarlo,
> el diseño se desvió de la spec.

- `src/modules/pets/application/owner-local-day.spec.ts` (#88 R3): candado
  de la extracción de `localDayInZone` (R3).
- `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts` (#82
  R1/R2 y R8/R9/R12/R6/R7): candado de `ownerLocalDay` tras el refactor.
- `src/modules/health/application/use-cases/vaccine-mutations.use-cases.spec.ts`
  (#14 R12, #88 R1/R2): candado de `ownerLocalDay` en vacunas.
- `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts`
  (`MockOf<PetRepository>` exhaustivo): ningún puerto gana métodos.
- `src/pipeline/local-day.spec.ts`, `src/modules/health/application/vaccine-date.spec.ts`,
  `weight-variation.spec.ts`, `src/modules/pets/application/dto/set-lost-mode.dto.spec.ts`.
- `pets.controller.spec.ts`: todos los describes salvo las dos aserciones
  listadas arriba (R2 y R13).
- `create-pet.dto.spec.ts` y `update-pet.dto.spec.ts`: todas las filas
  salvo las dos retiradas.
- `test/health-vaccines.e2e-spec.ts` (#14, #82, #88 completos),
  `test/nutrition.e2e-spec.ts` (`postWeight` con hoy UTC y owner UTC sigue
  `201`), `test/backfill-weights.e2e-spec.ts`, `test/device-subscriptions.e2e-spec.ts`.
- `test/health-weights.e2e-spec.ts`: describes R2, R3, R5, R6, R8, R9, R10
  de #15 y el `it.each` de R7 (incluido `'2026-02-30'` → `400` por
  formato); `test/pets.e2e-spec.ts`: describes R2-R16 de #5 y R3 de #66.
- `src/modules/health/application/dto/vaccine.dto.ts`,
  `src/modules/pets/application/dto/update-pet.dto.ts`,
  `src/modules/health/health.module.ts`, `src/modules/auth/auth.module.ts`,
  `src/modules/pets/domain/repositories/pet.repository.ts`,
  `src/modules/auth/domain/repositories/user.repository.ts`,
  `src/modules/health/infrastructure/mappers/vaccine-error.mapper.ts`
  (sin cambio).
