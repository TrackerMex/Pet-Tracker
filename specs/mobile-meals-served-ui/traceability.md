---
feature: "mobile-meals-served-ui"
status: in_progress
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-meals-served-ui]] (#98)

Rutas relativas a `mobile-pet-tracker/` salvo donde se indica.
Convención de commit: `feat(mobile): <desc> (R1,R2)`.
El implementador rellena las dos últimas columnas tras cada commit; el
`reviewer` no aprueba si queda una fila en «pendiente» (CHECKPOINTS C5).

| Requisito | Test (archivo :: título literal del `describe`) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 — tipos `servedToday` / `mealsToday` + 10 fixtures `PetProfile` + 2 fixtures `NutritionPlan` | `src/screens/home/index.test.tsx` :: `#98 R1: los tipos del cliente declaran servedToday y mealsToday` | `189c1406` | pendiente |
| R2 — `serveMeal` / `unserveMeal` | `src/api/__tests__/nutrition.test.ts` :: `#98 R2: serveMeal y unserveMeal mapean la respuesta por kind` | pendiente | pendiente |
| R3 — 4 claves de catálogo (305 → 309) | `src/providers/__tests__/language-provider.test.tsx` :: `#98 R3: el catálogo trae las cuatro claves de comidas servidas` (+ el `it` de longitud de `:51`) | pendiente | pendiente |
| R4 — estado servido desde `servedToday` | `src/app/(tabs)/__tests__/food.test.tsx` :: `#98 R4: el estado servido sale de servedToday, no del reloj` | pendiente | pendiente |
| R5 — botón por franja + refresco | `src/app/(tabs)/__tests__/food.test.tsx` :: `#98 R5: cada franja sirve, deshace y refresca` | pendiente | pendiente |
| R6 — conflicto silencioso / fallo con aviso | `src/app/(tabs)/__tests__/food.test.tsx` :: `#98 R6: el conflicto se resuelve refrescando y el fallo avisa` | pendiente | pendiente |
| R7 — barra de comidas y sus 12 decisiones | `src/screens/home/index.test.tsx` :: `#98 R7: la barra de comidas y todas sus decisiones` | pendiente | pendiente |
| R8 — cardinalidad, orden y cero llamadas nuevas | `src/screens/home/index.test.tsx` :: `#98 R8: la barra de comidas entra sin traerse el cliente de nutrición` (reemplaza a `#70 R3`, `:3459-3475`) | pendiente | pendiente |
| R9 — tabla de uso de copy (R6_FOOD 35→38, R3_HOME 51→53) | `src/__tests__/ui-language.test.ts` :: `#98 R9: el copy de comidas servidas queda registrado` (+ `:85` y `:140`) | pendiente | pendiente |
| R10 — candados de estilo (TABULAR_NUMS 7→8; el resto inmóvil) | `src/__tests__/consistency-classnames.test.ts` :: `#62 R15` (4 sitios) y `#98 R10: los candados que esta feature no mueve`; `src/__tests__/design-drift.test.ts` :: `#98 R10: la barra de comidas no mete drift de estilo` | pendiente | pendiente |
| R11 — enmiendas a la carta y a `mobile-food` | `src/__tests__/consistency-classnames.test.ts` :: `#98 R11: la carta y la spec de Food registran la enmienda` | pendiente | pendiente |

## Candados ajenos que esta feature mueve (delta declarado)

Cada fila es un valor que cambia en un test que **no** es de #98. El `reviewer`
comprueba que no se movió ninguno más.

| Fichero : línea (en `914905b8`) | Viejo | Nuevo | R | Verificado |
|---|---|---|---|---|
| `src/providers/__tests__/language-provider.test.tsx:50` | comentario sin #98 | `+ 4 de #98` | R3 | pendiente |
| `src/providers/__tests__/language-provider.test.tsx:55` | `260+16+1+4+7+14+2+1` = 305 | `… + 4` = 309 | R3 | pendiente |
| `src/__tests__/ui-language.test.ts:85` | `21+15+1+4+7+2+1` = 51 | `… + 2` = 53 | R9 | pendiente |
| `src/__tests__/ui-language.test.ts:140` | `toHaveLength(35)` | `toHaveLength(35 + 3)` = 38 | R9 | pendiente |
| `src/__tests__/consistency-classnames.test.ts:335-338` | 3 constantes de delta | + `HOME_TABULAR_DELTA_98 = 1` | R10 | pendiente |
| `src/__tests__/consistency-classnames.test.ts:342-347` | `4+1+1+1` = 7 | `4+1+1+1+1` = 8 | R10 | pendiente |
| `src/__tests__/consistency-classnames.test.ts:363-367` | `14+4+1+1+1` = 21 | `… + 1` = 22 | R10 | pendiente |
| `src/__tests__/consistency-classnames.test.ts:369-376` | `1+1+1` | `1+1+1+1` | R10 | pendiente |
| `src/__tests__/consistency-classnames.test.ts:378-385` | `1+1` | `1+1+1` | R10 | pendiente |
| `src/app/(tabs)/__tests__/food.test.tsx:263-264, 268-270` | fake timers de D7 (#38) | eliminados | R4 | pendiente |
| `src/app/(tabs)/__tests__/food.test.tsx:301, 310, 315, 327-334` | derivados del reloj | derivados de `servedToday` | R4 | pendiente |
| `src/screens/home/index.test.tsx:3459-3475` (`#70 R3`) | 2 aserciones de ausencia + 1 de import | las 2 invertidas; la 3.ª **literal** | R8 | pendiente |
| `specs/mobile-ui-language/design.md` §2.6 rótulo | `(35 ocurrencias, 29 claves)` | `(38 ocurrencias, 33 claves)` | R3 | pendiente |
| `specs/mobile-food/design.md:185-195` (§D7) | vigente | tachado + remisión a #98 | R11 | pendiente |

## Candados ajenos que esta feature NO mueve (declarado a propósito)

Si alguno de estos se mueve, es un defecto de implementación, no un delta.

| Candado | Sitio | Valor que debe seguir |
|---|---|---|
| `#70 R15` sin llamadas nuevas | `src/screens/home/index.test.tsx:3444-3457` | `{ pets: 1, detail: 1, activity: 1, reminders: 1 }`, **fichero sin tocar** |
| `#70 R2` `nextReminder` / `activitySummary` | `src/screens/home/index.test.tsx:2964-2965` | `unknown` los dos |
| Hijos de `reminders-section-body` sin plan | `:2365`, `:2400`, `:2431`, `:2814-2816`, `:2828`, `:2846`, `:3149`, `:3166-3196` | 0 / 1 / 2 / 3 / 4 según escenario, **sin cambios** |
| `style={CONTINUOUS_CORNER}` | `consistency-classnames.test.ts:273` (home), `:276` (food), suma `:328-330` | 2 / 2 / 35 |
| `rounded-xl bg-accent` | `consistency-classnames.test.ts:97-104` | 13 |
| `bg-accent-soft` | `consistency-classnames.test.ts:437-449` | 16 |
| `text-accent-strong` | `legibility-classnames.test.ts:123` / `:125` / suma `:136-139` | 2 / 1 / 15 |
| Radios fuera de escala | `consistency-classnames.test.ts:149-155` | lista vacía |
| Clases categóricas solo en `category-palette.ts` | `consistency-classnames.test.ts:417-434` | un único fichero |
| `ALL_USES` | `ui-copy-table.ts:435-452` | consistencia interna, sin cifra escrita a mano |

## Gate humano (no lo cierra ninguna IA)

| Ítem | Dónde | Estado |
|---|---|---|
| Aprobación de la spec | `requirements.md` §Aprobación | pendiente |
| Enmienda a `docs/ui-guidelines.md` | §Enmienda #98 de ese fichero | pendiente |
| Enmienda a `specs/mobile-food/requirements.md` | §Enmienda #98 de ese fichero | pendiente |
| Prueba de humo en **dev build de Android** | `requirements.md` §Prueba de humo | pendiente |
| Decisión abierta 1 — título de la barra | `requirements.md` §Decisiones abiertas | pendiente |
| Decisión abierta 2 — `refetchQueries` sobre `petKeys.detail` | ídem | pendiente |
