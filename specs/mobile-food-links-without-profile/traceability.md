---
feature: "mobile-food-links-without-profile"
status: approved      # draft | approved
tags: [mobile, nutrition, food, spec]
---

# Trazabilidad — [[mobile-food-links-without-profile]] (#233)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/screens/food/index.test.tsx::#233 R1 a R5: los enlaces de comidas dependen del perfil nutricional › #233 R1 con el rol %s y sin perfil no hay enlaces de comidas` (4 filas) | Rojo: `b1d0f15f` — `test(mobile): #233 nutrition links hidden without profile (R1)`; verde común: `a774d6b5` — `feat(mobile): #233 nutrition links only with a confirmed profile (R1, R2, R3)` |
| R2 | `mobile-pet-tracker/src/screens/food/index.test.tsx::R5: plan del día con horarios y warnings › shows a skeleton and schedule link while the plan is pending (enmendado por #233 R2)` y `::#233 R1 a R5: … › #233 R2 con el plan resuelto y el perfil pendiente no hay enlaces de comidas` | Rojo (A y B): `43dda06a` — `test(mobile): #233 nutrition links hidden while the profile is unconfirmed (R2)`; verde común: `a774d6b5` — `feat(mobile): #233 nutrition links only with a confirmed profile (R1, R2, R3)` |
| R3 | `mobile-pet-tracker/src/screens/food/index.test.tsx::#233 R1 a R5: … › #233 R3 con $name no hay enlaces de comidas` (3 filas) | Rojo: `7ea49a5b` — `test(mobile): #233 nutrition links hidden on plan or profile errors (R3)`; verde común: `a774d6b5` — `feat(mobile): #233 nutrition links only with a confirmed profile (R1, R2, R3)` |
| R4 | `mobile-pet-tracker/src/screens/food/index.test.tsx::#233 R1 a R5: … › #233 R4 con perfil y sin plan los enlaces se pintan sin RiseIn` (nace verde); existentes sin edición: `R5: plan del día con horarios y warnings › shows a graceful empty plan and keeps the schedule link`, `#155 R9: sin plan de comidas, Pingo enseña el cuenco › queda en el sitio del vacío que sustituye (enmendado por #200 R9) (enmendado por #222 R9)`, `#200 R10: entrada escalonada de Nutrición › #200 R10: sin plan los enlaces no entran con RiseIn` | Nace verde: `cc5d4f0f` — `test(mobile): #233 nutrition links stay with a profile (R4, R5)`; conservado en `a774d6b5` — `feat(mobile): #233 nutrition links only with a confirmed profile (R1, R2, R3)`. M2 lo pone rojo. |
| R5 | `mobile-pet-tracker/src/screens/food/index.test.tsx::#233 R1 a R5: … › #233 R5 con plan cargado los enlaces entran con RiseIn aunque el perfil no responda` (nace verde); existentes sin edición: `#200 R9: enlaces del canvas` (dos `it.each`), `#200 R10: entrada escalonada de Nutrición › #200 R10: cada pieza entra con el retardo del canvas (%s)` (fila `food-links`), `#200 R11: las piezas siguen el orden del canvas`, `#105 R14: Food opens served meals history` | Nace verde: `cc5d4f0f` — `test(mobile): #233 nutrition links stay with a profile (R4, R5)`; conservado en `a774d6b5` — `feat(mobile): #233 nutrition links only with a confirmed profile (R1, R2, R3)`. M7 y M9 lo ponen rojo. |
| R6 | sin test nuevo: anclas de grep y `numstat` `2 1` de `mobile-pet-tracker/src/screens/food/index.tsx`; guardas `mobile-pet-tracker/src/__tests__/design-drift.test.ts`, `consistency-classnames.test.ts` y `tab-headers-canvas.test.ts` sin cambio | `a774d6b5` — `feat(mobile): #233 nutrition links only with a confirmed profile (R1, R2, R3)`; anclas de R6, numstat `2 1` y guardas existentes sin cambios; evidencia en `progress/impl_mobile-food-links-without-profile.md`. |
| R7 | sin test nuevo: anclas de grep y `numstat` de `mobile-pet-tracker/src/screens/food/index.test.tsx` con 2 líneas quitadas | `b1d0f15f`, `43dda06a`, `7ea49a5b`, `cc5d4f0f` — commits `test(mobile)` de R1–R5 descritos arriba; anclas y numstat `138 2`, imports/mocks/helpers intactos; evidencia en `progress/impl_mobile-food-links-without-profile.md`. |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(mobile): <desc> (R<n>)` para el rojo y
`feat(mobile): <desc> (R<n>)` para el verde, en ese orden (C4). El verde de
#233 es un solo commit `(R1, R2, R3)`; el test de R4 y R5 nace verde y se
commitea antes que él.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
No se rebasea la rama después de rellenar esta tabla: un rebase cambia los
hashes de la columna de commits.
