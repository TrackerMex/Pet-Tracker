---
feature: "mobile-canvas-nutrition"
status: approved
tags: [harness, spec, mobile, canvas-parity]
---

# Tareas — [[mobile-canvas-nutrition]] (#200)

## Orden

Requisito previo: solo #197 mergeada en `dev`. #199 corre en paralelo y #200
no espera por ella; el leader re-mide las filas marcadas de § Base medida y
§ Cuentas a re-medir antes del handoff (si #199 ya está en `dev`, súmale su
delta donde la fila lo diga).

R1 (ruta delgada, sin cambio visual) → R2 → R3 → R4 → R5 → R6 → R7 → R8 →
R9 (+ test de R11) → R10 → R12 → R13 → R14 → R15 → R16 → R17.

Cada R son dos commits como mínimo: `test(#200): R<n> …` (rojo, con las
enmiendas de § Candados de ese R) y `feat(#200): R<n> …` (verde). Nada de
implementación y tests en el mismo commit (C4).

- **R11 nace verde** si se escribe tras R9 (el orden ya es el del canvas): su
  `it` va en el commit rojo de R9, donde falla porque `food-links` aún no
  existe. R11 no tiene paso de implementación propio.
- **R16 y R17 nacen verdes** salvo las filas de la carta: en su commit rojo,
  además, el implementador planta una mutación por tipo de fila (p. ej.
  `delayMs={81}` en `$FS`, un `StyleSheet` importado en `$FS`), ve el rojo de
  esa fila, la retira y lo apunta en su informe.
- **FO `#200 R10: sin plan los enlaces no entran con RiseIn` nace verde**
  (antes de R10 nada usa `RiseIn`): en el commit rojo de R10 el implementador
  planta la mutación «envolver `food-links` en `RiseIn` también sin plan», ve
  el rojo, la retira y lo apunta en su informe.

## Bloques por requisito

Cada bloque: (1) test rojo, (2) implementación mínima, (3) refactor. Los
números entre corchetes son los de § Candados de `requirements.md`.

**R1** — (1) DS `#200 R1`; rojo porque `food.tsx` tiene 468 líneas.
(2) `git mv` del test a `src/screens/food/index.test.tsx`, contenido de
`food.tsx` a `src/screens/food/index.tsx` exportando `FoodScreen`, ruta
delgada, enmiendas de ruta [1–8], [42] (AC `tracking-title`) y [43] (CF
`#197 R4`). (3) Ninguno; la suite FO pasa sin tocar aserciones.

**R2** — (1) FO `#200 R2` ×4, [9], [31] y [44]. (2) `contentContainerStyle`,
`food-title-row`, `PetSwitcher variant="avatars"` y `gap-3.5` en el `View`
del contenido de la mascota. (3) —.

**R3** — (1) FO `#200 R3` ×2, [10–12], [33], [39] y [45]. (2) `View` héroe
con `useChunkyLip().hero` y clases de texto. (3) Quitar el import de `Card`
solo si ya no queda uso (no antes de R9).

**R4** — (1) MT `#200 R4`, FO `#200 R4` ×2, [13], [15] y [16] ([14] está
retirado). (2) Constantes en `motion.ts`, `withDelay` + `withTiming` en el
relleno, `strokeOpacity={0.22}`, borrar `KCAL_BAR_TIMING`. (3) —.

**R5** — (1) FO `#200 R5`, fila `food-meals-title` de [17], +1 de [18],
[36], [38], [40] y la parte R5 de [47] (CN y fila de food de LG a `1 + 1`,
suma de LG `+ 1`). (2) `View` de comidas y clases. (3) —.

**R6** — (1) FO `#200 R6` ×4, [19–20], [34] y la parte R6 de [47] (CN y
fila de food de LG a `1 + 1 - 1`, suma de LG `- 1`); [18] no cambia (R6 neto
0). (2) Fila, tile, hora con ración, píldora y botón; retirar la insignia
«servida» vieja; renombre de `food.pending` en `catalog.ts` y en la fila de
`R6_FOOD`. (3) —.

**R7** — (1) FO `#200 R7` ×2, +1 de [18], [21]. (2) `food-warnings` y
tarjetas `View`. (3) —.

**R8** — (1) FO `#200 R8`, fila `food-ai-title` de [17], +1 de [18] y [46]
([22] está retirado). (2) Tarjeta violeta con `Sparkles` 22. (3) —.

**R9** — (1) FO `#200 R9` ×2, FO `#200 R11`, fila
`meal-schedule-link-title` de [17], +2 de [18], [23–24], [32] y [35].
(2) `food-links` y los dos `Pressable` con sus literales propios; quitar el
import de `Card`. (3) —.

**R10** — (1) FO `#200 R10` ×2 con el doble local de `rise-in` y
`riseDelayOf`; borrar entero el `describe('#197 R20: cimientos sin cablear')`
de CF ([49]) en este mismo commit rojo. (2) Envolver las piezas del plan
cargado en `RiseIn`; `food-links` sin plan queda sin envolver. (3) —.

**R12** — (1) MS `#200 R12`, LY `#200 R12`, [25], la fila `meal-schedule` de
[27]/[50], [37] y la parte `meal-schedule` de [41]. (2) `ScreenHeader`,
padding y `<Stack.Screen name="meal-schedule" options={{ headerShown: false }} />`.
(3) —.

**R13** — (1) MH `#200 R13`, LY `#200 R13`, [26], la parte `meals-history`
de [27] (LY `#105 R8` retitulado) y la parte `meals-history` de [41].
(2) Igual que R12. (3) —.

**R14** — (1) MS `#200 R14`. (2) `style={chunkyLip.violet}`. (3) —.

**R15** — (1) MS y MH `#200 R15`, [28–30]. (2) `HomeEntrance` → `RiseIn` con
los retardos. (3) —.

**R16** — (1) NC `#200 R16` ×4 (rojo por la carta; mutación plantada para el
resto) y [48]. (2) Enmienda #200 en `docs/ui-guidelines.md` y cola nueva de
la línea «Secundarios de Horario» del punto 13. (3) —.

**R17** — (1) NC `#200 R17` ×3 (errata: hex solo en producción) con mutación plantada. (2) Ninguna si ya
cumplen. (3) —.

## Cuentas a re-medir

Desde `mobile-pet-tracker/`, tras el merge de #197 y antes del handoff.
«Base» es `71ff81a1`; el esperado es «base tras #197 + delta de #200». Si
#199 ya está en `dev` cuando se mide, súmale su delta donde la fila lo diga.

| Comando | Base | Tras #197 | Delta #200 | Esperado |
|---|---|---|---|---|
| `grep -cF "src/screens/food/index.tsx'" src/__tests__/ui-copy-table.ts` | 0 (`(tabs)/food.tsx'` 25) | igual | +25 / −25 | 25 / 0 |
| `grep -cF 'style={CONTINUOUS_CORNER}' src/screens/food/index.tsx` | 1 (en `food.tsx`) | igual | +5 (escalera 1, 2, 2, 3, 4, 6) | 6 |
| `grep -cF 'export const MOTION_RING_' src/theme/motion.ts` | 0 | 0 | +2 | 2 |
| `grep -cF 'export const MOTION_' src/theme/motion.ts` | 35 | 37 | +2 | 39 (46 si #199 ya está en `dev`: +7) |
| claves esperadas en MT `no exporta nada más` | 35 | 37 | +2 | 39 (46 si #199 ya está en `dev`) |
| `grep -cF 'headerShown' src/app/_layout.tsx` | 2 | 2 | +2 | 4 (5 si #199 ya está en `dev`: +1) |
| `grep -cF 'food.markServedAction' src/i18n/catalog.ts` | 0 | 0 | +2 | 2 |
| `grep -cF 'food.pending' src/i18n/catalog.ts` | 2 | 2 | −2 | 0 |
| `grep -cF 'HomeEntrance' src/screens/meal-schedule/index.tsx src/screens/meals-history/index.tsx` | 5 y 5 | igual | −5 y −5 | 0 y 0 |
| `cat src/__tests__/canvas-foundations.test.ts 2>/dev/null \| grep -cF '#197 R20: cimientos sin cablear'` | 0 | 1 | −1 | 0 |
| `cat src/__tests__/canvas-foundations.test.ts 2>/dev/null \| grep -cF "'app/(tabs)/food.tsx'"` | 0 | 1 | −1 | 0 |
| `grep -cF "'app/(tabs)/food.tsx'," src/__tests__/alerts-canvas-fidelity.test.ts` | 0 | 1 | −1 | 0 |
| `grep -cF 'sigue sin labio hasta #200' ../docs/ui-guidelines.md` | 0 | 1 | −1 | 0 |
| longitud de `R6_FOOD` y de `SCREEN_FILES` | la de base | igual | 0 | igual |
| cuenta global de `style={CONTINUOUS_CORNER}` en CN `#98 R10` | la de base | re-medir | +5 | medida + 5 |
