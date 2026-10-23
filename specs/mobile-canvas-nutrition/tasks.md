---
feature: "mobile-canvas-nutrition"
status: spec_ready
tags: [harness, spec, mobile, canvas-parity]
---

# Tareas — [[mobile-canvas-nutrition]] (#200)

## Orden

Requisito previo: #197 y #199 mergeadas en `dev`; el leader re-mide las filas
marcadas de § Base medida y § Cuentas a re-medir antes del handoff.

R1 (ruta delgada, sin cambio visual) → R2 → R3 → R4 → R5 → R6 → R7 → R8 →
R9 (+ test de R11) → R10 → R12 → R13 → R14 → R15 → R16 → R17.

Cada R son dos commits como mínimo: `test(#200): R<n> …` (rojo, con las
enmiendas de § Candados de ese R) y `feat(#200): R<n> …` (verde). Nada de
implementación y tests en el mismo commit (C4).

- **R11 nace verde** si se escribe tras R9 (el orden ya es el del canvas): su
  `it` va en el commit rojo de R9, donde falla porque `food-links` aún no
  existe. R11 no tiene paso de implementación propio.
- **R16 y R17 nacen verdes** salvo la fila de la carta: en su commit rojo,
  además, el implementador planta una mutación por tipo de fila (p. ej.
  `delayMs={81}` en `$FS`, un `StyleSheet` importado en `$FS`), ve el rojo de
  esa fila, la retira y lo apunta en su informe.

## Bloques por requisito

Cada bloque: (1) test rojo, (2) implementación mínima, (3) refactor. Los
números entre corchetes son los de § Candados de `requirements.md`.

**R1** — (1) DS `#200 R1`; rojo porque `food.tsx` tiene 468 líneas.
(2) `git mv` del test a `src/screens/food/index.test.tsx`, contenido de
`food.tsx` a `src/screens/food/index.tsx` exportando `FoodScreen`, ruta
delgada, enmiendas de ruta [1–8]. (3) Ninguno; la suite FO pasa sin tocar
aserciones.

**R2** — (1) FO `#200 R2` ×3 y [9]. (2) `contentContainerStyle`,
`food-title-row` y `PetSwitcher variant="avatars"`. (3) —.

**R3** — (1) FO `#200 R3` ×2 y [10–12]. (2) `View` héroe con
`useChunkyLip().hero` y clases de texto. (3) Quitar el import de `Card` solo si
ya no queda uso (no antes de R9).

**R4** — (1) MT `#200 R4`, FO `#200 R4` ×2 y [13–16]. (2) Constantes en
`motion.ts`, `withDelay` + `withTiming` en el relleno, `strokeOpacity={0.22}`,
borrar `KCAL_BAR_TIMING`. (3) —.

**R5** — (1) FO `#200 R5`, fila `food-meals-title` de [17], +1 de [18].
(2) `View` de comidas y clases. (3) —.

**R6** — (1) FO `#200 R6` ×4, +1 de [18], [19–20]. (2) Fila, tile, hora con
ración, píldora y botón; renombre de `food.pending` en `catalog.ts` y en la
fila de `R6_FOOD`. (3) —.

**R7** — (1) FO `#200 R7` ×2, +1 de [18], [21]. (2) `food-warnings` y
tarjetas `View`. (3) —.

**R8** — (1) FO `#200 R8`, fila `food-ai-title` de [17], +1 de [18], [22].
(2) Tarjeta violeta con `Sparkles` 22. (3) —.

**R9** — (1) FO `#200 R9` ×2, FO `#200 R11`, fila
`meal-schedule-link-title` de [17], +2 de [18], [23–24]. (2) `food-links` y
`Pressable`; quitar el import de `Card`. (3) —.

**R10** — (1) FO `#200 R10` con el doble de `rise-in`. (2) Envolver las
piezas en `RiseIn`. (3) —.

**R12** — (1) MS `#200 R12`, LY `#200 R12`, [25] y la fila
`meal-schedule` de [27]. (2) `ScreenHeader`, padding y
`<Stack.Screen name="meal-schedule" options={{ headerShown: false }} />`.
(3) —.

**R13** — (1) MH `#200 R13`, LY `#200 R13`, [26] y la parte
`meals-history` de [27]. (2) Igual que R12. (3) —.

**R14** — (1) MS `#200 R14`. (2) `style={chunkyLip.violet}`. (3) —.

**R15** — (1) MS y MH `#200 R15`, [28–30]. (2) `HomeEntrance` → `RiseIn` con
los retardos. (3) —.

**R16** — (1) NC `#200 R16` ×3 (rojo por la carta; mutación plantada para el
resto). (2) Enmienda #200 en `docs/ui-guidelines.md`. (3) —.

**R17** — (1) NC `#200 R17` ×2 con mutación plantada. (2) Ninguna si ya
cumplen. (3) —.

## Cuentas a re-medir

Desde `mobile-pet-tracker/`, tras el merge de #197 y #199 y antes del
handoff. «Base» es `71ff81a1`; si la medida tras el merge difiere, el
esperado es medida + delta.

| Comando | Base | Delta #200 | Esperado |
|---|---|---|---|
| `grep -cF "src/screens/food/index.tsx'" src/__tests__/ui-copy-table.ts` | 0 (`(tabs)/food.tsx'` 25) | +25 / −25 | 25 / 0 |
| `grep -cF 'style={CONTINUOUS_CORNER}' src/screens/food/index.tsx` | 1 (en `food.tsx`) | +5 | 6 |
| `grep -cF 'export const MOTION_RING_' src/theme/motion.ts` | 0 | +2 | 2 |
| claves esperadas en MT `no exporta nada más` | 37 tras #197 (#199: re-medir) | +2 | medida + 2 |
| `grep -cF 'headerShown' src/app/_layout.tsx` | 2 (#199: 3) | +2 | 5 |
| `grep -cF 'food.markServedAction' src/i18n/catalog.ts` | 0 | +2 | 2 |
| `grep -cF 'food.pending' src/i18n/catalog.ts` | 2 | −2 | 0 |
| `grep -cF 'HomeEntrance' src/screens/meal-schedule/index.tsx src/screens/meals-history/index.tsx` | 5 y 5 | −5 y −5 | 0 y 0 |
| longitud de `R6_FOOD` y de `SCREEN_FILES` | la de base | 0 | igual |
| cuenta global de `style={CONTINUOUS_CORNER}` en CN `#98 R10` | la de base (#197/#199: re-medir) | +5 | medida + 5 |
