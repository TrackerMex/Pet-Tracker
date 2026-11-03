---
feature: "mobile-food-links-without-profile"
status: draft        # draft | approved
tags: [mobile, nutrition, food, spec]
---

# Trazabilidad — [[mobile-food-links-without-profile]] (#233)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/screens/food/index.test.tsx::#233 R1 a R5: los enlaces de comidas dependen del perfil nutricional › #233 R1 con el rol %s y sin perfil no hay enlaces de comidas` (4 filas) | pendiente |
| R2 | `mobile-pet-tracker/src/screens/food/index.test.tsx::R5: plan del día con horarios y warnings › shows a skeleton and schedule link while the plan is pending (enmendado por #233 R2)` y `::#233 R1 a R5: … › #233 R2 con el plan resuelto y el perfil pendiente no hay enlaces de comidas` | pendiente |
| R3 | `mobile-pet-tracker/src/screens/food/index.test.tsx::#233 R1 a R5: … › #233 R3 con $name no hay enlaces de comidas` (3 filas) | pendiente |
| R4 | `mobile-pet-tracker/src/screens/food/index.test.tsx::#233 R1 a R5: … › #233 R4 con perfil y sin plan los enlaces se pintan sin RiseIn` (nace verde); existentes sin edición: `R5: plan del día con horarios y warnings › shows a graceful empty plan and keeps the schedule link`, `#155 R9: sin plan de comidas, Pingo enseña el cuenco › queda en el sitio del vacío que sustituye (enmendado por #200 R9) (enmendado por #222 R9)`, `#200 R10: entrada escalonada de Nutrición › #200 R10: sin plan los enlaces no entran con RiseIn` | pendiente |
| R5 | `mobile-pet-tracker/src/screens/food/index.test.tsx::#233 R1 a R5: … › #233 R5 con plan cargado los enlaces entran con RiseIn aunque el perfil no responda` (nace verde); existentes sin edición: `#200 R9: enlaces del canvas` (dos `it.each`), `#200 R10: entrada escalonada de Nutrición › #200 R10: cada pieza entra con el retardo del canvas (%s)` (fila `food-links`), `#200 R11: las piezas siguen el orden del canvas`, `#105 R14: Food opens served meals history` | pendiente |
| R6 | sin test nuevo: anclas de grep y `numstat` `2 1` de `mobile-pet-tracker/src/screens/food/index.tsx`; guardas `mobile-pet-tracker/src/__tests__/design-drift.test.ts`, `consistency-classnames.test.ts` y `tab-headers-canvas.test.ts` sin cambio | pendiente |
| R7 | sin test nuevo: anclas de grep y `numstat` de `mobile-pet-tracker/src/screens/food/index.test.tsx` con 2 líneas quitadas | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile): <desc> (R<n>)` para el rojo y
`feat(mobile): <desc> (R<n>)` para el verde, en ese orden (C4). El verde de
#233 es un solo commit `(R1, R2, R3)`; el test de R4 y R5 nace verde y se
commitea antes que él.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
No se rebasea la rama después de rellenar esta tabla: un rebase cambia los
hashes de la columna de commits.
