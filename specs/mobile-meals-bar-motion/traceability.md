---
feature: "mobile-meals-bar-motion"
status: in_progress
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-meals-bar-motion]] (#106 + #107)

Rutas relativas a `mobile-pet-tracker/`.
Convención de commit: `feat(mobile): <desc> (R1,R2)`.
Codex rellena las dos últimas columnas tras cada commit; el `reviewer` no
aprueba si queda una fila en «pendiente» (CHECKPOINTS C5).

**No rebasear después de rellenar esta tabla**: los hashes dejarían de ser
ancestros y habría que reapuntarlos uno a uno verificando `git merge-base
--is-ancestor`.

| Requisito | Entrada | Test (archivo :: título literal del `describe`) | Commit rojo | Commit verde |
|---|---|---|---|---|
| R1 — `expo-haptics` declarada, sin `babel.config.js`, carta enmendada | #106 | `src/app/(tabs)/__tests__/food.test.tsx` :: `#106 R1: expo-haptics entra declarada y sin configuración de babel` | `91adccde` | `e14dd598` |
| R2 — el relleno `reminders-meals-fill` transiciona su ancho con `withTiming` | #106 | `src/screens/home/index.test.tsx` :: `#106 R2: la barra de comidas transiciona su ancho` | pendiente | pendiente |
| R3 — con reduce motion el ancho se fija sin animar | #106 | `src/screens/home/index.test.tsx` :: `#106 R3: reduce motion deja la barra sin animación` | pendiente | pendiente |
| R4 — háptico de éxito/error al servir y deshacer | #106 | `src/app/(tabs)/__tests__/food.test.tsx` :: `#106 R4: servir y deshacer vibran una vez y distinguen éxito de fallo` | `47945153` | `205d8682` |
| R5 — candado del feedback de pulsado del `meal-toggle` | #107 | `src/app/(tabs)/__tests__/food.test.tsx` :: `#107 R5: el botón por franja conserva su feedback de pulsado` | `8fb833c9` | `83a63821` |

## Notas para quien rellene la tabla

- **R5 es requisito de verificación por la vía (b) de C4**: su commit rojo
  contiene la **mutación de producción** (quitar el `style` de
  `src/app/(tabs)/food.tsx:253-255`) y el verde la revierte. El diff neto de
  `food.tsx` por R5 es **cero**.
- R2, R4 y R5 cierran además con una **sonda de mutación** cuya evidencia va
  en `progress/impl_mobile-meals-bar-motion.md`, no en esta tabla.
- El prefijo `#106` / `#107` en los títulos de `describe` es obligatorio:
  los dos ficheros de test ya acumulan R-ids de varias specs
  (`docs/conventions.md` §Prefijo de feature cuando un fichero acumula R-ids
  de dos specs).
- **Cerrar las dos entradas por separado** en `feature_list.json`: #106 con
  R1–R4, #107 con R5. Ninguna se marca `done` sin veredicto aprobado del
  `reviewer` y sin la prueba de humo del humano en dev build de Android
  ([[requirements]] §Prueba de humo).
