---
feature: "mobile-kcal-consumed-bar"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-kcal-consumed-bar]] (#113)

Rutas relativas a `mobile-pet-tracker/`. Todos los tests viven en
`src/app/(tabs)/__tests__/food.test.tsx`.
Convención de commit: `test(kcal-bar): <desc> (Rn)` el rojo,
`feat(kcal-bar): <desc> (Rn)` el verde.
Codex rellena las tres últimas columnas tras cada commit; el `reviewer` no
aprueba si queda una fila de R1-R5 en «pendiente» (CHECKPOINTS C5). R6 la
cierra el humano en su casilla de [[requirements]].

**No rebasear después de rellenar esta tabla**: los hashes dejarían de ser
ancestros y habría que reapuntarlos verificando `git merge-base --is-ancestor`.

| Requisito | Test (título literal del `describe`) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 — `NutritionPlan` + `kcalConsumedToday: number` | `#113 R1: NutritionPlan declara kcalConsumedToday como número y último campo (mobile-kcal-consumed-bar #113)` | `c752795e` | `f4b0c388` |
| R2 — bloque de progreso en `food-plan-card` | `#113 R2: la tarjeta Objetivo diario pinta las kcal servidas contra merKcal (mobile-kcal-consumed-bar #113)` | `a408be18` | `5523cd29` |
| R3 — un único `progressbar` + `food.kcalConsumedOfTarget` | `#113 R3: el progreso es un único elemento accesible con su clave de catálogo (mobile-kcal-consumed-bar #113)` | `59220c29` | pendiente |
| R4 — transición de 250 ms al servir y deshacer | pendiente | pendiente | pendiente |
| R5 — `food-plan-skeleton` a `h-40` | pendiente | pendiente | pendiente |
| R6 — smoke en dev build de Android | humano | — | pendiente del humano |

## Candados ajenos movidos (se rellenan con el hash del commit que los mueve)

| Candado | Delta | Commit |
|---|---|---|
| `src/screens/home/index.test.tsx` · `#98 R1` | `12 + 1`, `.slice(-3, -1)` | `c752795e` |
| fixtures `makePlan` de `food.test.tsx` y `meal-schedule/index.test.tsx` | `kcalConsumedToday: 0` | `f4b0c388` |
| `src/providers/__tests__/language-provider.test.tsx` · `#65 R12` | `+ 1` | `59220c29` |
| `src/__tests__/ui-language.test.ts` · `#65 R6` | `+ 1` y título | `59220c29` |
| `src/__tests__/ui-copy-table.ts` · `R6_FOOD` | + 1 fila | pendiente (verde de R3) |
| `specs/mobile-ui-language/design.md` §2.6 | + 1 fila | pendiente (verde de R3) |
| `food.test.tsx` · `'h-32'` del `it('shows the hub and a loading state while pets are pending'` | `'h-40'` | pendiente (rojo de R5) |
