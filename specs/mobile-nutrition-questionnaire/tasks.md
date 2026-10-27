---
feature: "mobile-nutrition-questionnaire"
status: approved     # draft | approved
tags: [harness, spec, mobile, nutrition]
---

# #209 mobile-nutrition-questionnaire — Tareas

Cada bloque sigue este orden: (1) test rojo, (2) implementación mínima,
(3) refactor. **Commits test-primero, obligatorio**:

1. `test(mobile): #209 R<n> rojo` lleva solo el test, y el test falla.
2. `feat(mobile): #209 R<n> <qué>` lleva solo la producción, y el test pasa.
3. El refactor, si lo hay, va como `refactor(mobile): #209 R<n> ...`.

Nunca se mezclan test, producción y docs en un commit.

Los grupos contiguos que comparten un commit rojo y uno verde se declaran en
el bloque, como en R7–R8.

Comando base:
`cd /home/claude/sites/Pet-Tracker-wt-209/mobile-pet-tracker && bunx jest <ruta> -t '#209 R<n>:'`.
Todos los `it` nuevos empiezan por `#209 R<n>:`; con los dos puntos,
`-t '#209 R1:'` no recoge `R10`–`R19`. Las rutas con paréntesis se escapan.
Prohibido correr `./init.sh` y e2e.

## R1 — putJson
- [ ] (1) `src/api/__tests__/nutrition.test.ts` › `#209 R1: putJson envía PUT con cuerpo JSON y Bearer`. Rojo porque `putJson` no existe.
- [ ] (2) `putJson` en `src/api/http.ts`, copiado de `patchJson`.
- [ ] (3) Sin refactor.

## R2 — upsertNutritionProfile
- [ ] (1) Los tres `it` `#209 R2:` en `src/api/__tests__/nutrition.test.ts`. El de `ok` aserta la URL `profileEndpoint`.
- [ ] (2) `NutritionProfileInput` en `types.ts`; `UpsertNutritionProfileState` y `upsertNutritionProfile` en `nutrition.ts`.
- [ ] (3) Sin refactor.

## R3 — ruta y Stack
- [ ] (1) En un mismo commit rojo:
  - `src/screens/nutrition-questionnaire/index.test.tsx` › `#209 R3: la ruta nutrition-profile es delgada y está en el Stack`, que lee las fuentes;
  - `src/app/__tests__/layout.test.tsx` › `#209 R3: nutrition-profile es el último hijo protegido, justo tras edit-profile`, nuevo;
  - las cinco enmiendas de `layout.test.tsx` de la tabla de R3 (`+ 1 // #209 R3`, `at(-1 - 1)` y el sufijo ` (enmendado por #209 R3)` en cada `it` tocado).
  Rojo: sin la línea en `_layout.tsx`, las cuentas reciben 15 y esperan 16 (errata ronda 3: base `1dbac74f`, con `vaccines/new` de #208).
- [ ] (2) `src/app/nutrition-profile.tsx` y la línea `Stack.Screen` como último hijo de `Stack.Protected`, justo tras `edit-profile`. La pantalla queda como esqueleto mínimo.
- [ ] (3) Sin refactor.

## R4 — carga
- [ ] (1) Los `it` R4.
- [ ] (2) Las consultas pet y perfil, el esqueleto, el error de carga y `signOut` en `unauthorized`.
- [ ] (3) Sin refactor.

## R5 — cabecera, contador y barra
- [ ] (1) `#209 R5: pinta cabecera, contador «1 de 4» y la barra con un segmento hecho`.
- [ ] (2) `ScreenHeader`, `step-label`, `step-bar` y la burbuja.
- [ ] (3) Sin refactor.

## R6 — Volver entre pasos
- [ ] (1) Los dos `it` R6. Dependen de R7–R9; si es así, el rojo de R6 va después del verde de R9.
- [ ] (2) `prevStep` y `usePreventRemove`.
- [ ] (3) Sin refactor.

## R7 — Actividad
- [ ] (1) Los dos `it` R7, con literales a mano.
- [ ] (2) Las tarjetas, el radio y la CTA desactivada.
- [ ] (3) Sin refactor.

## R8 — Condición
- [ ] (1) `NINE_ROWS`, escrita a mano con 9 filas, y los `it` R8.
- [ ] (2) Las filas BCS y los badges con banda.
- [ ] (3) Sin refactor.

## R9 — rama de BCS ≥ 7
- [ ] (1) `it.each` R9 con 1, 6, 7 y 9.
- [ ] (2) `nextStep`.
- [ ] (3) Sin refactor.

## R10 — Peso objetivo
- [ ] (1) Los cuatro `it` R10.
- [ ] (2) Resumen, Cambiar, campo, peso actual, nota y validación.
- [ ] (3) Sin refactor.

## R11 — Alimento y precargas
- [ ] (1) `FOUR_TYPES`, a mano con 4 filas, y los `it` R11.
- [ ] (2) Chips, campo kcal, precarga y nota por tipo.
- [ ] (3) Sin refactor.

## R12 — cotas de kcal
- [ ] (1) `it.each` R12.
- [ ] (2) Validación entera 80–600.
- [ ] (3) Sin refactor.

## R13 — Salud y Otra
- [ ] (1) Los `it` R13.
- [ ] (2) Las dos listas de chips, el campo «Otra» y el contador.
- [ ] (3) Sin refactor.

## R14 — cuerpo del PUT
- [ ] (1) Los seis `it` R14. Asertan el `JSON.parse` del `body` de la llamada PUT, incluida la ausencia de claves con `not.toHaveProperty`.
- [ ] (2) `buildInput`.
- [ ] (3) Sin refactor.

## R15 — modo edición
- [ ] (1) Los tres `it` R15.
- [ ] (2) `initialFromProfile`.
- [ ] (3) Sin refactor.

## R16 — Generando
- [ ] (1) Los cuatro `it` R16. Usan promesas de `fetch` controladas a mano y nada de timers.
- [ ] (2) `phase`, el componente Generando, las invalidaciones y `router.back()`.
- [ ] (3) Sin refactor.

## R17 — errores
- [ ] (1) `ERROR_ROWS`, con una fila por fila de la tabla de R17, y el `it.each`.
- [ ] (2) La traducción de resultados y la vuelta a Salud.
- [ ] (3) Sin refactor.

## R18 — teclado
- [ ] (1) `#209 R18: la raíz es un KAV con behavior padding y el scroll persiste taps`.
- [ ] (2) La raíz KAV y `keyboardShouldPersistTaps`. Si R5 ya lo dejó así, el test nace verde: entonces se declara en `progress/impl_mobile-nutrition-questionnaire.md` y se hace el commit del test solo.
- [ ] (3) Sin refactor.

## R19 — entrada en Nutrición
- [ ] (1) Los `it` R19 en `src/screens/food/index.test.tsx`.
- [ ] (2) La consulta de perfil y `food-profile-empty`.
- [ ] (3) Sin refactor.

## R20 — enlaces en Horario
- [ ] (1) Los `it` R20 en `src/screens/meal-schedule/index.test.tsx`.
- [ ] (2) `nutrition-profile-edit` y `nutrition-profile-create`, solo para owner.
- [ ] (3) Sin refactor.

## R21 — «Generar plan» solo para owner
- [ ] (1) Los `it` R21.
- [ ] (2) Envolver `generate-plan-button` en `isOwner`.
- [ ] (3) Sin refactor.

## R22 — píldoras en español
- [ ] (1) En un mismo commit rojo:
  - los `it.each` R22;
  - las enmiendas de literales de los cuatro `it` existentes de `src/screens/meal-schedule/index.test.tsx` que lista la tabla «Tests existentes que R22 contradice», cada uno con el sufijo ` (enmendado por #209 R22)`.
  Rojo: la producción aún pinta `dry` y `medium` crudos. Anclas: `grep -cF "'Alimento dry 350 kcal/100 g'"` y `grep -cF "'Actividad medium'"` pasan de 3 a 0, y `grep -cF '(enmendado por #209 R22)'` pasa de 0 a 4, todas en ese fichero.
- [ ] (2) Los mapas de etiquetas.
- [ ] (3) Sin refactor.

## R23 — copy y tabla
- [ ] (1) En un mismo commit rojo:
  - el bloque `R20_NUTRITION_QUESTIONNAIRE` y su registro en `ALL_USES` (tras `...R19_VACCINE_CREATE,`; errata ronda 3), en `blocks` y en el import (tras `  R19_VACCINE_CREATE,`);
  - el `+ 1 // #209 R23: screens/nutrition-questionnaire/index.tsx` de `SCREEN_FILES`, justo después de `+ 1 // #208 R20: screens/vaccine-create/index.tsx` (errata ronda 3);
  - en `src/providers/__tests__/language-provider.test.tsx`, `+ 26 // #208 R19` sin coma y `+ 77, // #209 R23` debajo (errata ronda 3);
  - el sufijo ` (enmendado por #209 R23)` en los `it` `#194 R5` de `ui-copy-table.ts` y de `ui-language.test.ts`, y `#194 R1` de `language-provider.test.tsx`, detrás de los sufijos de #208. `#158 R1` no se toca;
  - el `it` R23, en un `describe` nuevo al final de `ui-language.test.ts`, tras `describe('#208 R20: alta de vacuna')` (errata ronda 3).
  Rojo si alguna clave falta en el catálogo o algún uso no cuadra. Rojo esperado sin las claves (errata ronda 3): `Expected length: 484` / `Received length: 561` en `#194 R1`.
- [ ] (2) Las claves en `en` y `es`, con los literales de la tabla de R23 y en su orden. Codex no traduce: copia la columna `en`.
- [ ] (3) Sin refactor.

## R24 — guardas de carta
- [ ] (1) Correr las siete suites: `design-drift`, `consistency-classnames`, `chunky-cta-canvas-fidelity`, `legibility-classnames`, `alerts-canvas-fidelity` y `profile-canvas-fidelity` (en `src/__tests__/`), más `src/app/__tests__/layout.test.tsx`. Se esperan rojas por los inventarios.
- [ ] (2) Las enmiendas mecánicas que lista R24, con `+ delta // #209 R24` y el sufijo ` (enmendado por #209 R24)` en cada `it` tocado. El `+ 6 // #209 R24` de `#62 R14` y `#98 R10` va justo después de `+ 2 + 7 // #208 R21` (errata ronda 3; `#98 R10`: 62 → 68, `#62 R14`: 64 → 70). Van en un commit `test(mobile): #209 R24 enmiendas de carta`, que deja las siete en verde.
- [ ] (2b) Verificación final, desde `mobile-pet-tracker/` y sin `| tail`: `timeout 580 bunx jest src/__tests__ src/app/__tests__/layout.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/meal-schedule src/screens/food` con exit 0. Cifra derivada (errata ronda 3): 40 suites, 1232 tests en verde (39 y 1220 en la semilla de ronda 2, más la suite y los 12 tests del merge de `1dbac74f`).
- [ ] (3) Sin refactor.

## R25 — recetas de carta
- [ ] (1) `src/__tests__/design-drift.test.ts` › `describe('#209 R25: Cuestionario sin deriva')`, con los tres `it` que fija R24. Si el wizard ya sigue R25, nace verde: se declara en `progress/impl_mobile-nutrition-questionnaire.md` y se hace el commit del test solo.
- [ ] (2) Ajustar las clases a la receta de R25.
- [ ] (3) Sin refactor.

## R26 — enmienda de ui-guidelines
- [ ] (1) Desde `mobile-pet-tracker/`: `grep -cF '## Enmienda #209' ../docs/ui-guidelines.md` = `0`.
- [ ] (2) Commit `docs(ui): #209 R26 enmienda`, con la sección literal y la casilla `- [ ] Enmienda #209 aprobada por humano` sin marcar. Después, `grep -cF '## Enmienda #209' ../docs/ui-guidelines.md` = `1` y `grep -cE -- '- \[[ xX]\] Enmienda #209 aprobada por humano' ../docs/ui-guidelines.md` = `1`. La casilla la marca el humano.
- [ ] (3) Sin refactor.

## Cierre
- [ ] Escribir `progress/impl_mobile-nutrition-questionnaire.md` con la tabla R-id → test → hashes rojo y verde.
- [ ] Rellenar `traceability.md`.
- [ ] Si `origin/dev` avanzó: `git merge origin/dev` (sin rebase) y volver a medir R3, R22, R23 y R24. Si lo que entró es #208, se conservan sus deltas y sufijos junto a los de #209 en cada agregado de la lista de `design.md` §Riesgos. (errata ronda 3) #208 ya entró en `1dbac74f`; sus deltas y sufijos están en las cifras de arriba.
