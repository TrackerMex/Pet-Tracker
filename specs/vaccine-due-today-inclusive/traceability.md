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
| R1 | `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts::R1 (vaccine-due-today-inclusive #82, sustituye a R13 de #14): el perfil consulta la proxima vacuna desde el dia civil del owner::'pasa a findNextVaccine el dia local del owner calculado desde now, no el dia UTC'` + `src/modules/pets/infrastructure/pets.controller.spec.ts::R8: GET /v1/pets/:petId responde el perfil con el rol de la membresia::'usa el petId y el rol adjuntados por PetAccessGuard'` (aserción `expect.any(Date)`) | rojo `8a17b2a` (`test(vaccine-due-today-inclusive): use case resolves the owner local day from the caller clock (R1)`); verde `bb30e6d` (`feat(vaccine-due-today-inclusive): resolve next vaccine from the owner local day (R1)`) |
| R2 | mismo spec::`R2 (vaccine-due-today-inclusive #82): zona del owner nula o fuera del catalogo IANA degrada a UTC con warn`::`'sin owner activo (null) usa el dia UTC de now y avisa una vez'`, `"con 'Not/A/Zone' usa el dia UTC de now y avisa una vez"`, `'con zona valida no avisa'` | rojo `71723b3` (`test(vaccine-due-today-inclusive): null or non-IANA owner timezone falls back to UTC with warn (R2)`); verde `d0a56bf` (`feat(vaccine-due-today-inclusive): fall back to UTC with warn on invalid owner timezone (R2)`) |
| R3 | `test/health-vaccines.e2e-spec.ts::R3 (vaccine-due-today-inclusive #82): la dosis de hoy en la zona del owner es la proxima::'devuelve la dosis de hoy para owners en Pacific/Kiritimati y Pacific/Pago_Pago (R3)'` | rojo `bcfe7c3` (`test(vaccine-due-today-inclusive): e2e dose due today in the owner zone, family and non-IANA owner (R3,R4,R5)`); verde `7306dff` (`feat(vaccine-due-today-inclusive): include the dose due today and rename the port param to from (R3,R4,R5)`) |
| R4 | mismo describe::`'un family en otra zona ve el nextVaccine del dia del owner (R4)'` | rojo `bcfe7c3`; verde `7306dff` |
| R5 | mismo describe::`'owner con timezone fuera del catalogo IANA responde 200 con el hoy UTC (R5)'` | rojo `bcfe7c3`; verde `7306dff` |
| R6 | Sin test nuevo — `git diff --name-only 7f298f2...HEAD -- backend-pet-tracker/` = los diez archivos de [[design]] (A1); `test/pets.e2e-spec.ts` y el `it` de #14 R13 sin cambios; suite e2e completa + `env -u FORCE_COLOR bash ./init.sh` verdes; sección `## Regresión (R6)` del reporte | Árbol verificado hasta `7306dff`; evidencia: este commit, `docs(vaccine-due-today-inclusive): mutation evidence, regression sweep and traceability (R6,R7)` |
| R7 | Sin test nuevo — M1 (`gte`→`gt`) y M2 (`findOwnerTimezone` → `null`) ponen rojo por aserción el `it` de R3; unitarios verdes bajo M2; sección `## Mutación (R7)` del reporte y reproducción en `progress/review_vaccine-due-today-inclusive.md` | Sujeto: `7306dff`; evidencia Codex: este commit, `docs(vaccine-due-today-inclusive): mutation evidence, regression sweep and traceability (R6,R7)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(vaccine-due-today-inclusive): <desc> (R1)` /
`feat(vaccine-due-today-inclusive): <desc> (R1)` /
`docs(vaccine-due-today-inclusive): <desc> (R6,R7)` — ver [[design]] D11.

## Cobertura de los `acceptance_criteria` de `feature_list.json` #82

| # | Criterio de aceptación (abreviado) | Requisito(s) | Estado |
|---|---|---|---|
| 1 | Salud y Home coinciden el día de la dosis: las dos la enseñan, y la spec dice por qué | R3 (`gte`, [[design]] D1) + D6 (la Home ya pinta «hoy» sin cambio móvil) | Cubierto por `bcfe7c3` → `7306dff` y §Mutación M1 |
| 2 | El corte se evalúa en la zona del dueño, no en UTC del servidor | R1 (zona del owner, D2/D8/D9), R2 + R5 (fallback UTC solo si la zona es nula o no IANA), R4 (owner, no requester) | Cubierto por `8a17b2a` → `bb30e6d`, `71723b3` → `d0a56bf`, R4/R5 y §Mutación M2 |
| 3 | Un e2e fija la frontera: dosis hoy, ayer, mañana | R3 (par de zonas, D10) + R5 (misma frontera en UTC) | Cubierto por los tres `it` de `bcfe7c3`, verdes desde `7306dff` |

## Tests de features anteriores actualizados, no borrados

> Una fila por cada test existente cuyo nombre, llamada o comportamiento
> esperado cambia. El reviewer rechaza si algún `it` de #5, #6, #7 o #14
> desapareció del árbol sin aparecer aquí.

| Test | Feature dueña | Qué cambia y por qué | Commit |
|---|---|---|---|
| `get-pet.use-case.spec.ts::R13 (health-vaccines #14): el perfil consulta la proxima vacuna futura::'devuelve el valor del PET_VACCINE_READER usando la fecha actual'` (líneas 173-199) | #14 | **Reescrito** como el describe R1 de esta feature: sin `jest.useFakeTimers`, `now` inyectado, `findOwnerTimezone` mockeado, día esperado `'2026-08-09'` (día CDMX) en vez del día UTC. La aserción de `profile.nextVaccine` se conserva. | rojo `8a17b2a`; verde `bb30e6d` |
| `get-pet.use-case.spec.ts` — `it` de R8, R9, R12, R6, R7 (#5, #6, #7) | #5, #6, #7 | Solo la llamada: `execute(PET_ID)` → `execute(PET_ID, NOW)`. Nombres y aserciones intactos. | rojo `8a17b2a`; verde `bb30e6d` |
| `pets.controller.spec.ts::R8: GET /v1/pets/:petId responde el perfil con el rol de la membresia::'usa el petId y el rol adjuntados por PetAccessGuard'` (línea 204) | #5 | `toHaveBeenCalledWith(PET_ID)` → `toHaveBeenCalledWith(PET_ID, expect.any(Date))` (D9). | rojo `8a17b2a`; verde `bb30e6d` |
| `test/health-vaccines.e2e-spec.ts` — helper `seedUser` (líneas 36-52) | #14 | Gana `timezone = 'UTC'` como segundo parámetro; los llamadores de #14 no cambian. | `bcfe7c3` (`test(vaccine-due-today-inclusive): e2e dose due today in the owner zone, family and non-IANA owner (R3,R4,R5)`) |

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
