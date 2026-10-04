---
feature: "meals-history"
tags: [harness, spec, traceability]
---

# Trazabilidad — [[meals-history]]

> La rellena quien implementa (Codex CLI), fila a fila, con el hash del commit
> **verde** de cada requisito (el rojo va en el mensaje). Convención:
> `test(<scope>): … (#105 R<n>)` y `feat(<scope>): … (#105 R<n>)`.
> El reviewer no aprueba si alguna fila queda pendiente. Tras un rebase los
> hashes caducan: reapuntar y verificar `git merge-base --is-ancestor`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `backend-pet-tracker/test/meals-history.e2e-spec.ts::#105 R1` | `46c18d51 feat(nutrition): list served meals in an inclusive range (#105 R1)` — tsc y e2e verdes en `929465c7` (R4) |
| R2 | `backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition-error.mapper.spec.ts::#105 R2` | `059aa339 feat(nutrition): map meals history range errors (#105 R2)` — 4/4 unit y HTTP verde en `929465c7` (R4) |
| R3 | `backend-pet-tracker/src/modules/nutrition/application/use-cases/get-meals-history.use-case.spec.ts::#105 R3` | `0fe5f788 feat(nutrition): return meals history by owner civil day (#105 R3)` — 9/9 verde |
| R4 | `backend-pet-tracker/test/meals-history.e2e-spec.ts::#105 R4` | `929465c7 feat(nutrition): expose strict meals history endpoint (#105 R4)` — 15/15 e2e verde (R1/R2/R4) |
| R5 | `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx::#105 R5` (+ candados `#65 R12`, `#65 R6`, `#65 R18`) | `edc990e4 feat(mobile): add approved meals history copy in both languages (#105 R5)` — 9/9 propios; todos los candados E1/E2 verdes desde `ab693851` (R14) |
| R6 | `mobile-pet-tracker/src/api/__tests__/nutrition.test.ts::#105 R6` | `cec4a93a feat(mobile): fetch served meals history for a civil range (#105 R6)` — 71/71 API (9 nuevos) |
| R7 | `mobile-pet-tracker/src/api/__tests__/query-keys.test.ts::#105 R7` | `41c66b8a feat(mobile): key meals history by pet and civil range (#105 R7)` — 22/22 (2 nuevos) |
| R8 | `mobile-pet-tracker/src/app/__tests__/layout.test.tsx::#105 R8`, `detail-stack.test.tsx::#105 R8`, `detail-stack.navigation.test.tsx::#105 R8`, `detail-stack.guard.test.tsx::#105 R8` | `1ca5a8da feat(mobile): register the protected meals history screen (#105 R8)` — 47/47 en cuatro suites; SCREEN_FILES verde |
| R9 | `mobile-pet-tracker/src/screens/meals-history/index.test.tsx::#105 R9` | `a7cdeef8 feat(mobile): render meals history loading error and data states (#105 R9)` — 9/9 propios; harness tipado en `0864d891` (R15) |
| R10 | `mobile-pet-tracker/src/utils/__tests__/month-grid.test.ts::#105 R10` | `ed5c370e feat(mobile): complete the civil day formatter (#105 R10)` — 12/12; corrige el candidato `5a19d59a` que se commiteó con SyntaxError (desviación documentada, sin reescritura). `2a5919cd refactor(mobile): use array type notation without behavior change (#105 R10)` — 12/12 y lint sin errores ni advertencias en Reanudacion 3 |
| R11 | `mobile-pet-tracker/src/screens/meals-history/index.test.tsx::#105 R11` (+ candados `#62 R15`, `#98 R10`, `#64 R9`, `#61 R4` sin delta E3) | `b1ea49a2 feat(mobile): render the Monday-first served meals calendar (#105 R11)`; corrección E3 `621035c4 feat(mobile): render today with strong accent ink (#105 R11)` tras rojo `c487b14e` — 109/109 en tres suites (pantalla, legibilidad y consistencia), incluido #61 R4; cierre completo verde |
| R12 | `mobile-pet-tracker/src/screens/meals-history/index.test.tsx::#105 R12` | `f9be482c feat(mobile): navigate civil months within the owner current month (#105 R12)` — 21/21 pantalla |
| R13 | `mobile-pet-tracker/src/screens/meals-history/index.test.tsx::#105 R13` | `39d5759b feat(mobile): show and toggle the inline served day detail (#105 R13)` — 83/83 pantalla + clases; refactor verde `77935e16` |
| R14 | `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx::#105 R14` | `ab693851 feat(mobile): open served meals history from Food (#105 R14)` — 57/57 Food y 51/51 idioma; cero rojos E2 |
| R15 | `mobile-pet-tracker/src/__tests__/design-drift.test.ts::#105 R15` (+ `R3` Card, `#87 R19`) y comandos de cierre | `ef3a2a85 test(mobile): candados de drift para meals-history (#105 R15)` nace verde (59/59); `0864d891` corrige tipos de dobles; `40bb583f style(mobile): trim trailing blank lines without behavior change (#105 R15)` limpia EOF. Cierre en `2a5919cd`: mobile 92/1981/1 snapshot, typecheck, lint (0 errores/advertencias) y diff-check exit=0; backend sin cambios respecto a `f43c8487`, cierre Reanudacion 2 reutilizado (tsc/unit/e2e exit=0) |
| H1 | Prueba de humo en dev build Android (gate humano, `requirements.md` § Entorno de la prueba de humo) | pendiente (humano) |

Sesión detenida al descubrir el ancla R5 discrepante (9 usos `_layout` en H0 frente a 0 declarado); ver `progress/impl_meals-history.md`. R4 conserva el rojo `430b232a`, sin implementación. No hay cierre de R15 ni H1.

Reanudación 1: E1 corrige el ancla de R5; R4 se cierra en verde, incluido el bloque backend completo (176 suites / 1348 unit; 29 suites / 438 e2e passed, mismos 3 suites / 8 tests skipped que la base). Se vuelve a parar en R5 por dos it ajenos #65 R18: ALL_USES usa las nuevas filas y SCREEN_FILES pasa de 27 a 28. El humano mantiene la parada para corregir la spec. Tests R5 sin commit, restaurados; parche y evidencia en progress/impl_meals-history.md. R5–R15 y H1 siguen pendientes.

Reanudación 2: E2 aplicada en R5 con exactamente 13 it rojos iniciales. R5–R14 implementados en el orden aprobado; todos sus tests y los candados E1/E2 terminan verdes. R15 drift nace verde. Cierre: mobile 92 suites / 1981 tests / 1 snapshot, con un it ajeno rojo (`legibility-classnames.test.ts::#61 R4: no deja ningún text-accent suelto en las fuentes`). Conflicto entre la clase de hoy exigida en R11 (`text-accent`) y el guard global de tinta (`text-accent-strong`). Se detiene sin ajustar la aserción ajena ni reescribir la spec. Backend 176 suites / 1348 unit y 29 suites / 438 e2e passed, con los mismos 3 suites / 8 tests skipped; ambos exit=0. H1 humano sigue pendiente. Evidencia completa en progress/impl_meals-history.md.

Reanudacion 3: E3 aplicada como par de corrección R11 sin reescribir commits. El rojo `c487b14e` tuvo exactamente un it propio (clase de hoy); verde `621035c4` con `text-accent-strong`, punto `bg-accent` e `inkSites` intactos. Se cerraron los dos pendientes de formato en `40bb583f` (R15) y `2a5919cd` (R10), sin cambios de comportamiento ni tests nuevos. Cierre móvil: 92 suites / 1981 tests / 1 snapshot, todos verdes; typecheck y lint exit=0 (0 errores, 0 advertencias), diff-check desde H0 exit=0 y diff de dependencias vacío. `git diff --name-only f43c8487 HEAD -- backend-pet-tracker/` está vacío: se reutiliza el cierre backend de Reanudacion 2 (176 suites / 1348 unit; 29 suites / 438 e2e passed; mismos 3 suites / 8 tests skipped; tsc, unit y e2e exit=0). Delta total sobre la base: mobile +2 suites / +68 tests; backend unit +2 / +13; e2e +1 / +15; 0 skipped nuevos. Se mantiene el it extra de R3 para el reviewer. H1 humano sigue pendiente. Comandos, bloques de rojo, commits y diffs completos en progress/impl_meals-history.md.
