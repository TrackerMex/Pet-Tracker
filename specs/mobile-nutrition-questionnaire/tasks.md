---
feature: "mobile-nutrition-questionnaire"
status: draft        # draft | approved
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
`cd /home/claude/sites/Pet-Tracker-wt-209/mobile-pet-tracker && bunx jest <ruta> -t 'R<n>'`.
Prohibido correr `./init.sh` y e2e.

## R1 — putJson
- [ ] (1) `src/api/__tests__/nutrition.test.ts` › `R1: putJson envía PUT con cuerpo JSON y Bearer`. Rojo porque `putJson` no existe.
- [ ] (2) `putJson` en `src/api/http.ts`, copiado de `patchJson`.
- [ ] (3) Sin refactor.

## R2 — upsertNutritionProfile
- [ ] (1) Los tres `it` R2 en `src/api/__tests__/nutrition.test.ts`.
- [ ] (2) `NutritionProfileInput` en `types.ts`; `UpsertNutritionProfileState` y `upsertNutritionProfile` en `nutrition.ts`.
- [ ] (3) Sin refactor.

## R3 — ruta y Stack
- [ ] (1) `src/screens/nutrition-questionnaire/index.test.tsx` › `R3: ...`, que lee las fuentes.
- [ ] (2) `src/app/nutrition-profile.tsx` y la línea `Stack.Screen` en `_layout.tsx`. La pantalla queda como esqueleto mínimo.
- [ ] (3) Sin refactor.

## R4 — carga
- [ ] (1) Los `it` R4.
- [ ] (2) Las consultas pet y perfil, el esqueleto, el error de carga y `signOut` en `unauthorized`.
- [ ] (3) Sin refactor.

## R5 — cabecera, contador y barra
- [ ] (1) `R5: ...`.
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
- [ ] (1) `R18: ...`.
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
- [ ] (1) Los `it.each` R22.
- [ ] (2) Los mapas de etiquetas.
- [ ] (3) Sin refactor.

## R23 — copy y tabla
- [ ] (1) El bloque `R20_NUTRITION_QUESTIONNAIRE`, su registro en `ALL_USES`, `blocks` e import, y el `it` R23. Rojo si alguna clave falta en el catálogo o algún uso no cuadra.
- [ ] (2) Las claves en `en` y `es`.
- [ ] (3) Sin refactor.

## R24 — guardas de carta
- [ ] (1) Correr las cinco suites. Se esperan rojas por los inventarios.
- [ ] (2) Enmiendas mecánicas `+ delta // #209 R24`, más el `describe` nuevo de design-drift.
- [ ] (3) Sin refactor.

## R25 — recetas de carta
- [ ] (1) El `describe('#209 R24: Cuestionario sin deriva')` cubre hex, clases arbitrarias y StyleSheet.
- [ ] (2) Ajustar las clases a la receta de R25.
- [ ] (3) Sin refactor.

## R26 — enmienda de ui-guidelines
- [ ] (1) Ancla `grep -cF '## Enmienda #209' docs/ui-guidelines.md` = `0`.
- [ ] (2) Commit `docs(ui): #209 R26 enmienda`, con la sección literal y la casilla G4 sin marcar.
- [ ] (3) Sin refactor.

## Cierre
- [ ] Escribir `progress/impl_mobile-nutrition-questionnaire.md` con la tabla R-id → test → hashes rojo y verde.
- [ ] Rellenar `traceability.md`.
- [ ] Si `origin/dev` avanzó: `git merge origin/dev` (sin rebase) y volver a medir R23 y R24.
