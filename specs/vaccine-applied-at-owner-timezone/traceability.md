---
feature: "vaccine-applied-at-owner-timezone"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[vaccine-applied-at-owner-timezone]]

> Rutas relativas a `backend-pet-tracker/`; líneas del commit base `f3e3280`.
> R1-R4 se trazan a tests que nombran su R-id; R5 y R6 son requisitos de
> verificación y se trazan a comandos y a las secciones del reporte de
> implementación / revisión. Codex actualiza esta tabla tras cada commit; el
> reviewer la valida al aprobar (ver [[../../docs/specs|specs]] y
> [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Requisitos

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/modules/health/application/use-cases/vaccine-mutations.use-cases.spec.ts::R1 (vaccine-applied-at-owner-timezone #88): create compara appliedAt con el dia civil del owner, no con el dia UTC::'acepta hoy local aunque UTC ya sea manana (America/Mexico_City, 20:00)'`, `'rechaza manana local aunque UTC ya sea ese dia (America/Mexico_City, 20:00)'`, `'acepta hoy local aunque UTC todavia sea ayer (Pacific/Kiritimati, 10:00)'` | pendiente — rojo `test(vaccine-applied-at-owner-timezone): create compares appliedAt with the owner local day (R1)`; verde `feat(vaccine-applied-at-owner-timezone): validate appliedAt against the owner local day on create (R1)` |
| R2 | mismo spec::`R2 (vaccine-applied-at-owner-timezone #88): update compara appliedAt con el dia civil del owner solo cuando el body lo trae`::`'acepta hoy local aunque UTC ya sea manana (America/Mexico_City, 20:00)'`, `'rechaza manana local aunque UTC ya sea ese dia (America/Mexico_City, 20:00)'`, `'acepta hoy local aunque UTC todavia sea ayer (Pacific/Kiritimati, 10:00)'`, `'sin appliedAt en el body no consulta la zona del owner'` | pendiente — rojo `test(...): update compares appliedAt with the owner local day only when present (R2)`; verde `feat(...): validate appliedAt against the owner local day on update (R2)` |
| R3 | `src/modules/pets/application/owner-local-day.spec.ts::R3 (vaccine-applied-at-owner-timezone #88): ownerLocalDay resuelve el dia civil del owner y degrada a UTC con un warn::'con zona IANA valida devuelve el dia local de now sin avisar'`, `'sin owner activo (null) devuelve el dia UTC de now y avisa una vez'`, `"con 'Not/A/Zone' devuelve el dia UTC de now y avisa una vez"` + candado sin editar `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts` (R1/R2 de #82) | pendiente — rojo `test(...): ownerLocalDay falls back to UTC with a warn on null or non-IANA zone (R3)`; verde `feat(...): ownerLocalDay falls back to UTC with a warn (R3)`; refactor `refactor(...): GetPetUseCase delegates the owner day to ownerLocalDay (R3)` |
| R4 | `test/health-vaccines.e2e-spec.ts::R4 (vaccine-applied-at-owner-timezone #88): appliedAt se compara con el dia civil del owner en POST y PATCH::'POST acepta hoy y rechaza manana en la zona del owner para Pacific/Kiritimati y Pacific/Pago_Pago (R4)'`, `'PATCH acepta hoy y rechaza manana en la zona del owner para Pacific/Kiritimati y Pacific/Pago_Pago (R4)'` | pendiente — rojo `test(...): e2e appliedAt today and tomorrow in the owner zone for POST and PATCH (R4)`; verde `feat(...): drop the UTC refine from the vaccine DTO and map VaccineAppliedInFutureError to the validation 400 (R4)` |
| R5 | Sin test nuevo — `git diff --name-only f3e3280...HEAD -- backend-pet-tracker/` = los once archivos de [[design]]; diff vacío en `mobile-pet-tracker/` y en los archivos de R5-(b)/(c); `grep todayIsoDateUtc vaccine.dto.ts` vacío; suite e2e completa + `env -u FORCE_COLOR bash ./init.sh` verdes; sección `## Regresión (R5)` del reporte | pendiente — evidencia en `docs(...): mutation evidence, regression sweep and traceability (R5,R6)` |
| R6 | Sin test nuevo — M1 (helper devuelve el día UTC) pone rojos R1(2)(3), R2(2)(3), R3(1), el R1 de #82 y al menos una zona de R4; M2 (`>` → `>=`) pone rojos R1(1)(3), R2(1)(3) y «hoy» de R4 en las dos zonas; sección `## Mutación (R6)` del reporte y reproducción en `progress/review_vaccine-applied-at-owner-timezone.md` | pendiente — evidencia en el mismo commit `docs(...)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(vaccine-applied-at-owner-timezone): <desc> (R1)` /
`feat(vaccine-applied-at-owner-timezone): <desc> (R1)` /
`refactor(vaccine-applied-at-owner-timezone): <desc> (R3)` /
`docs(vaccine-applied-at-owner-timezone): <desc> (R5,R6)` — ver [[design]] D10.

## Cobertura de los `acceptance_criteria` de `feature_list.json` #88

| # | Criterio de aceptación (abreviado) | Requisito(s) | Estado |
|---|---|---|---|
| 1 | Crear o editar con `appliedAt` = hoy en la zona del owner responde 2xx a cualquier hora, incluidas las horas en que UTC todavía es ayer | R1(1)(3), R2(1)(3) (unitario con instantes fijos), R4 (e2e, par de zonas, [[design]] D8) | pendiente |
| 2 | `appliedAt` = mañana en la zona del owner sigue respondiendo 400 con el mismo mensaje | R1(2), R2(2) (unitario), R4 (`toEqual` del body completo, [[design]] D5) | pendiente |
| 3 | Un e2e fija el límite con Kiritimati/Pago_Pago y un unitario cubre la zona nula o no IANA con fallback a UTC | R4 (e2e) + R3 (unitario del helper) | pendiente |
| 4 | La validación sale del DTO solo si la spec lo justifica por escrito; el DTO deja de comparar fechas | [[design]] D1 (justificación) + R5-(d) (`grep todayIsoDateUtc vaccine.dto.ts` vacío) + R4 (el 400 ya no lo produce zod) | pendiente |

## Tests de features anteriores actualizados, no borrados

> Una fila por cada test existente cuyo nombre, llamada o comportamiento
> esperado cambia. El reviewer rechaza si algún `it` de #14 o #82
> desapareció del árbol sin aparecer aquí.

| Test | Feature dueña | Qué cambia y por qué | Commit |
|---|---|---|---|
| `vaccine-mutations.use-cases.spec.ts::R12: una escritura fallida nunca se audita::'create no audita si el INSERT falla'` (`:28-45`) | #14 | El mock `pets` pasa de `{} as PetRepository` a `{ findOwnerTimezone: jest.fn().mockResolvedValue('UTC') } as unknown as PetRepository`; `execute` gana `NOW_CDMX_EVENING`. Nombre y aserciones intactos (R1 consulta la zona antes del `create`). | pendiente — commit 1 |
| `vaccine-mutations.use-cases.spec.ts::R12::'update no audita si el UPDATE falla'` (`:47-62`) | #14 | El constructor gana `{} as PetRepository` como segundo argumento; `execute` gana `NOW_CDMX_EVENING` (sin `appliedAt`, la zona no se consulta). Nombre y aserciones intactos (D3). | pendiente — commit 3 |

## Tests que deben quedar verdes SIN editarse

> Comprobación explícita del reviewer: si alguno de estos hizo falta tocarlo,
> el diseño se desvió de la spec.

- `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts` (R1/R2
  de #82, `:179-270`, y R8/R9/R12/R6/R7): candado del refactor de R3.
- `src/modules/pets/infrastructure/pets.controller.spec.ts` y
  `src/modules/pets/infrastructure/pets.controller.ts` (no cambian).
- `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts`
  (`MockOf<PetRepository>` exhaustivo, `:109-118`): ningún puerto gana
  métodos.
- `src/pipeline/local-day.spec.ts` (se reutiliza, no se edita).
- `src/modules/health/application/use-cases/create-weight.use-case.spec.ts`,
  `vaccine-date.spec.ts`, `weight-variation.spec.ts`.
- `test/health-vaccines.e2e-spec.ts`: los describes `R2`-`R13` de #14
  (incluido el `'2999-01-01'` → `400` de R8, `:313`) y `R3`-`R5` de #82
  (`:562-720`); `seedUser`, `seedPet`, `postVaccine`, `dateOffset`.
- `test/health-weights.e2e-spec.ts`, `test/pets.e2e-spec.ts`,
  `test/device-subscriptions.e2e-spec.ts` (`GET` de vacunas, `:245`).
- `src/modules/health/application/dto/iso-date.ts`, `weight.dto.ts`,
  `src/modules/pets/application/dto/create-pet.dto.ts`,
  `src/modules/health/health.module.ts`,
  `src/modules/pets/domain/repositories/pet.repository.ts` (fuera de
  alcance / sin cambio).
