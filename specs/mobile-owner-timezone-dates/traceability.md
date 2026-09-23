---
feature: "mobile-owner-timezone-dates"
status: approved     # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-owner-timezone-dates]] (#90)

> Rutas relativas a `mobile-pet-tracker/`; líneas de HEAD `29689598`. R1-R6 se
> trazan a tests que nombran su R-id (`#90 R<n>` en lo nuevo, sufijo ` (#90 R<n>)`
> en lo editado); R7 es requisito de verificación y se traza a comandos y al
> reporte. R4 y R6 son requisitos de verificación con rojo por **mutación de
> producción** (C4 vía b): su fila registra el par rojo (con mutación) → verde
> (mutación revertida). Codex actualiza esta tabla tras cada commit; el reviewer la
> valida al aprobar (`docs/specs.md`, `CHECKPOINTS.md` C5).

## Requisitos

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/utils/civil-today-iso.test.ts::#90 R1: civilTodayIso devuelve el día civil de una zona y cae al dispositivo` (casos a-e) | rojo `819fa5c9` `test(mobile-owner-timezone-dates): civilTodayIso resolves a civil day per zone and falls back to the device (R1)` → verde `fffd2434` `feat(mobile-owner-timezone-dates): civilTodayIso with Intl formatToParts and device fallback (R1)` |
| R2 | `src/providers/__tests__/language-provider.test.tsx::#90 R2: el catálogo trae weightLog.dateCannotBeAfterToday en los dos idiomas y registrada en la tabla` + candado L1 (`:55`, `+ 1`) | rojo `da18d263` `test(mobile-owner-timezone-dates): the catalog must carry weightLog.dateCannotBeAfterToday (R2)` → verde `60923eef` `feat(mobile-owner-timezone-dates): add weightLog.dateCannotBeAfterToday in both languages (R2)` |
| R3 | `src/app/(tabs)/__tests__/weight-log.test.tsx::#90 R3: la fecha por defecto sale de la zona del perfil` (`it.each` Kiritimati/Pago_Pago) + los cuatro `it` editados con sufijo ` (#90 R3)` (tabla de abajo) | rojo `c8ee54b1` `test(mobile-owner-timezone-dates): the weight log default date must follow the profile zone (R3)` → verde `d79524cc` `feat(mobile-owner-timezone-dates): derive the weight date from the profile zone via userKeys.me (R3)` ← retirado el caso de blur de #63 por #95 (R7, C7) |
| R4 | `src/app/(tabs)/__tests__/weight-log.test.tsx::#90 R4: sin zona del perfil la fecha cae al dispositivo` (a, b×3, c) — rojo por M4-i/M4-ii | rojo `c6914614` `test(mobile-owner-timezone-dates): mutate the zone fallback to prove the device path is locked (R4)` → verde `7964d04c` `feat(mobile-owner-timezone-dates): revert the fallback mutations, device path locked (R4)` |
| R5 | `src/app/(tabs)/__tests__/weight-log.test.tsx::R9 … › joins backend validation messages, translating the future-date one (#90 R5)` y `› keeps a malformed-date validation message raw (#90 R5)` + candado L3 (`src/__tests__/ui-language.test.ts::#65 R5 … › resuelve las 33 ocurrencias normativas`) | rojo `26f6861b` `test(mobile-owner-timezone-dates): the future-date 400 must render translated and the rest raw (R5)` → verde `b9dc4b69` `feat(mobile-owner-timezone-dates): translate the measuredAt future-date validation message (R5)` |
| R6 | `src/screens/add-pet/index.test.tsx::#90 R6: birthDate manda el día civil local del picker, no el UTC` — rojo por M6; backend cubierto por `backend-pet-tracker/test/pets.e2e-spec.ts::R6 (dto-dates-owner-timezone #89)` (ya en `main`) | rojo `48e8206f` `test(mobile-owner-timezone-dates): mutate dateToIso to UTC to prove birthDate keeps the local civil day (R6)` → verde `224a8b5c` `feat(mobile-owner-timezone-dates): revert the dateToIso mutation, birthDate regression locked (R6)` |
| R7 | Sin test nuevo — `bun run typecheck`, `bun run lint`, `bun run test` (`N = S = 74`), `./init.sh`, grep-clean C8, diffs vacíos, delta del catálogo (608 → 610); sección de verificación de `progress/impl_mobile-owner-timezone-dates.md` | Árbol verificado sobre `224a8b5c`; evidencia: este commit, `docs(mobile-owner-timezone-dates): traceability, verification and implementation report (R7)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile-owner-timezone-dates): … (R<n>)` para el rojo,
`feat(mobile-owner-timezone-dates): … (R<n>)` para el verde,
`docs(mobile-owner-timezone-dates): … (R7)` para el cierre — ver [[design]] D8.

## Cobertura de los `acceptance_criteria` de `feature_list.json` #90

| # | Criterio (abreviado) | Requisito(s) |
|---|---|---|
| 1 | Fecha por defecto y enviada en la zona contra la que valida el backend | D-A (a) + R3 (tres puntos), R4 (fallback justificado en [[design]] D2) |
| 2 | Con dispositivo por delante, guardar «hoy» no da 400; si el 400 sigue siendo posible, texto vía `t()` | R3 (default = zona del perfil), R5 (`weightLog.dateCannotBeAfterToday`), smoke pasos 3-4 |
| 3 | Test de regresión de `birthDate` | R6 (móvil, mutación M6) + e2e R6 de #89 citado |
| 4 | Test unitario del helper con fixture de zona distinta | R1 (a): un instante, dos días (Kiritimati / Pago_Pago) |
| 5 | Cero dependencias; suite verde; candados como delta | R7; §Candados de [[requirements]] (L1 `+ 1`, L3 `32 + 1`) |
| 6 | Decisión sobre mascotas compartidas cerrada | D-A (a), sin id de backend, F2 |

## Tests de features anteriores actualizados, no borrados

> Una fila por cada test existente cuyo nombre, reloj o valor esperado cambia. El
> reviewer rechaza si algún `it` de #63, #15/#41 (R9 de weight-log), #72 o #65
> desapareció del árbol sin aparecer aquí.

| Test (HEAD) | Feature dueña | Qué cambia y por qué | Commit |
|---|---|---|---|
| `weight-log.test.tsx:138` `R3 … › 'restaura los cuatro valores visibles tras el blur'` (`:158-160`) | #63 R3 | Reloj fijo + perfil Kiritimati; `toBe(localTodayIso())` → `toBe('2026-09-18')`; sufijo ` (#90 R3)`; fila de `specs/mobile-detail-screens-state-reset/traceability.md` actualizada | rojo `c8ee54b1` → verde `d79524cc` |
| `weight-log.test.tsx:346` `R9 … › 'renders the inline form with the local date prefilled'` (`:355-357`) | R9 de weight-log | Ídem, dentro de `waitFor`; sufijo ` (#90 R3)` | rojo `c8ee54b1` → verde `d79524cc` |
| `weight-log.test.tsx:377` `R9 … › 'submits all fields, clears them, and refetches the list (#72 R2)'` (`:406-408`) | #72 R2 (S7) | Ídem; la espera de `:401-403` se conserva; sufijo ` (#90 R3)`; fila de `specs/mobile-add-pet-photo-test-flake/traceability.md` actualizada | rojo `c8ee54b1` → verde `d79524cc` |
| `weight-log.test.tsx:412` `R9 … › 'omits body condition when its field is blank'` (`:428`) | R9 de weight-log | `measuredAt: '2026-09-18'`; sufijo ` (#90 R3)` | rojo `c8ee54b1` → verde `d79524cc` |
| `weight-log.test.tsx:433` `R9 … › 'joins backend validation messages'` | R9 de weight-log | Reescrito: mezcla crudo + traducido, título nuevo con ` (#90 R5)` | rojo `26f6861b` → verde `b9dc4b69` |
| `weight-log.test.tsx:84-89` `localTodayIso` (copia) | — | Renombrada `deviceTodayIso`; solo la usa R4 | rojo `c8ee54b1` → verde `d79524cc` |
| `language-provider.test.tsx:50,55` (#65 R12) | #65 | `+ 1` al literal y ` + 1 de #90` al comentario | rojo `da18d263` → verde `60923eef` |
| `ui-language.test.ts:132-133` (#65 R5) | #65 | `toHaveLength(32 + 1)`, título `33 ocurrencias` | rojo `26f6861b` → verde `b9dc4b69` |

## Tests que deben quedar verdes SIN editarse

> Si alguno hizo falta tocarlo, el diseño se desvió de la spec.

- `src/screens/add-pet/index.test.tsx`: todos los describes existentes (`R2`, `R6`,
  `R7`, `R1 (mobile-jest-mock-hygiene)`, `#72 R4`, `#61 R10`, `#62 R11`, `#62 R12`),
  incluidas las aserciones de `birthDate` en `:143-149`, `:188-191`, `:243-250` (L11)
  y el `beforeEach` raíz `:101-104` (L13).
- `weight-log.test.tsx`: `R7`, `R8`, `#61 R10`, `#62 R9`, `#87 R10` (solo reciben el
  `beforeEach` raíz de `mockGetMe`, sin cambio de texto).
- `src/__tests__/design-drift.test.ts` (L6, `signOut` = 1 en `weight-log.tsx`),
  `src/__tests__/consistency-classnames.test.ts`, `src/app/(tabs)/__tests__/health.test.tsx`
  (L15), `src/screens/profile/index.test.tsx`, `src/app/(auth)/__tests__/register.test.tsx`,
  `src/screens/home/format.test.ts`, `src/components/__tests__/__snapshots__/*` (L14).
- `language-provider.test.tsx` `:56-61` (paridad y marcadores, L2) y
  `ui-language.test.ts` `:161` (R9 = 42, L4), `:437-448` (literales, L5),
  `:429-430` (paridad).
- Todo `backend-pet-tracker/` (L16): diff vacío.
