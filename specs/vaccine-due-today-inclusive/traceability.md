---
feature: "vaccine-due-today-inclusive"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[vaccine-due-today-inclusive]]

> Rutas relativas a `backend-pet-tracker/`; líneas del commit base `7f298f2`.
> R1-R5 se trazan a tests que nombran su R-id; R6 y R7 son requisitos de
> verificación y se trazan a comandos y a las secciones del reporte de
> implementación / revisión. Codex actualiza esta tabla tras cada commit; el
> reviewer la valida al aprobar (ver [[../../docs/specs|specs]] y
> [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Requisitos

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts::R1 (vaccine-due-today-inclusive #82, sustituye a R13 de #14): el perfil consulta la proxima vacuna desde el dia civil del owner::'pasa a findNextVaccine el dia local del owner calculado desde now, no el dia UTC'` + `src/modules/pets/infrastructure/pets.controller.spec.ts::R8: GET /v1/pets/:petId responde el perfil con el rol de la membresia::'usa el petId y el rol adjuntados por PetAccessGuard'` (aserción `expect.any(Date)`) | pendiente |
| R2 | mismo spec::`R2 (vaccine-due-today-inclusive #82): zona del owner nula o fuera del catalogo IANA degrada a UTC con warn`::`'sin owner activo (null) usa el dia UTC de now y avisa una vez'`, `"con 'Not/A/Zone' usa el dia UTC de now y avisa una vez"`, `'con zona valida no avisa'` | pendiente |
| R3 | `test/health-vaccines.e2e-spec.ts::R3 (vaccine-due-today-inclusive #82): la dosis de hoy en la zona del owner es la proxima::'devuelve la dosis de hoy para owners en Pacific/Kiritimati y Pacific/Pago_Pago (R3)'` | pendiente |
| R4 | mismo describe::`'un family en otra zona ve el nextVaccine del dia del owner (R4)'` | pendiente |
| R5 | mismo describe::`'owner con timezone fuera del catalogo IANA responde 200 con el hoy UTC (R5)'` | pendiente |
| R6 | Sin test nuevo — `git diff --name-only 7f298f2...HEAD -- backend-pet-tracker/` = los nueve archivos de [[design]]; `test/pets.e2e-spec.ts` y el `it` de #14 R13 sin cambios; suite e2e completa + `env -u FORCE_COLOR bash ./init.sh` verdes; sección `## Regresión (R6)` del reporte | pendiente |
| R7 | Sin test nuevo — M1 (`gte`→`gt`) y M2 (`findOwnerTimezone` → `null`) ponen rojo por aserción el `it` de R3; unitarios verdes bajo M2; sección `## Mutación (R7)` del reporte y reproducción en `progress/review_vaccine-due-today-inclusive.md` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(vaccine-due-today-inclusive): <desc> (R1)` /
`feat(vaccine-due-today-inclusive): <desc> (R1)` /
`docs(vaccine-due-today-inclusive): <desc> (R6,R7)` — ver [[design]] D11.

## Cobertura de los `acceptance_criteria` de `feature_list.json` #82

| # | Criterio de aceptación (abreviado) | Requisito(s) | Estado |
|---|---|---|---|
| 1 | Salud y Home coinciden el día de la dosis: las dos la enseñan, y la spec dice por qué | R3 (`gte`, [[design]] D1) + D6 (la Home ya pinta «hoy» sin cambio móvil) | pendiente |
| 2 | El corte se evalúa en la zona del dueño, no en UTC del servidor | R1 (zona del owner, D2/D8/D9), R2 + R5 (fallback UTC solo si la zona es nula o no IANA), R4 (owner, no requester) | pendiente |
| 3 | Un e2e fija la frontera: dosis hoy, ayer, mañana | R3 (par de zonas, D10) + R5 (misma frontera en UTC) | pendiente |

## Tests de features anteriores actualizados, no borrados

> Una fila por cada test existente cuyo nombre, llamada o comportamiento
> esperado cambia. El reviewer rechaza si algún `it` de #5, #6, #7 o #14
> desapareció del árbol sin aparecer aquí.

| Test | Feature dueña | Qué cambia y por qué | Commit |
|---|---|---|---|
| `get-pet.use-case.spec.ts::R13 (health-vaccines #14): el perfil consulta la proxima vacuna futura::'devuelve el valor del PET_VACCINE_READER usando la fecha actual'` (líneas 173-199) | #14 | **Reescrito** como el describe R1 de esta feature: sin `jest.useFakeTimers`, `now` inyectado, `findOwnerTimezone` mockeado, día esperado `'2026-08-09'` (día CDMX) en vez del día UTC. La aserción de `profile.nextVaccine` se conserva. | pendiente |
| `get-pet.use-case.spec.ts` — `it` de R8, R9, R12, R6, R7 (#5, #6, #7) | #5, #6, #7 | Solo la llamada: `execute(PET_ID)` → `execute(PET_ID, NOW)`. Nombres y aserciones intactos. | pendiente |
| `pets.controller.spec.ts::R8: GET /v1/pets/:petId responde el perfil con el rol de la membresia::'usa el petId y el rol adjuntados por PetAccessGuard'` (línea 204) | #5 | `toHaveBeenCalledWith(PET_ID)` → `toHaveBeenCalledWith(PET_ID, expect.any(Date))` (D9). | pendiente |
| `test/health-vaccines.e2e-spec.ts` — helper `seedUser` (líneas 36-52) | #14 | Gana `timezone = 'UTC'` como segundo parámetro; los llamadores de #14 no cambian. | pendiente |

## Tests que deben quedar verdes SIN editarse

> Comprobación explícita del reviewer: si alguno de estos hizo falta tocarlo,
> el diseño se desvió de la spec.

- `test/health-vaccines.e2e-spec.ts`: los describes `R2`-`R13` de #14 (incluido
  el `it` de R13, líneas 510-556, que siembra `dateOffset(-1|1|2)` y sigue
  verde con `gte`), `beforeAll`/`afterAll`, `dateOffset`, `seedPet`.
- `test/pets.e2e-spec.ts` (`PROFILE_KEYS` 63-88; `nextVaccine: null` en 358)
  y el resto de e2e que replican la lista de claves (`pet-lost-mode`,
  `devices`, `device-subscriptions`).
- `src/modules/pets/application/use-cases/list-pets.use-case.spec.ts`
  (candado de fuente, línea 200) y `list-pets.use-case.ts`.
- `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.spec.ts`.
- `test/activity.e2e-spec.ts` y `activity.drizzle.store.ts` (el store de #10
  no se toca; D8).
- `src/pipeline/local-day.spec.ts` (se reutiliza, no se edita).
