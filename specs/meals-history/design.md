---
feature: "meals-history"
tags: [harness, spec, design]
---

# Diseño — [[meals-history]]

> Decisiones de alto nivel. Sin código. Los R-ids son los de [[requirements]].
> Base congelada `origin/main d29d49d5`; anclas por contenido grepeable.

## Decisiones técnicas

| # | Decisión | Razón |
|---|---|---|
| D1 | Rango por días civiles `YYYY-MM-DD` (`from`/`to`), validado con `isCalendarDate`, desplazado con `shiftDay`, enumerado con `listDays` (`src/pipeline/local-day.ts`) | Mismo contrato que `GET /v1/pets/:petId/activity/daily`; `servedOn` ya es un día civil del dueño |
| D2 | `MEALS_HISTORY_MAX_RANGE_DAYS = 31` en `src/modules/nutrition/domain/nutrition.constants.ts`; el móvil pide el mes natural y rellena la rejilla con celdas vacías deshabilitadas | Un mes nunca supera 31 días; los rellenos no se piden al backend |
| D3 | Respuesta `{ from, to, today, days: [{ date, mealTimes }] }`, huecos rellenos, `mealTimes` ascendente, `today` = día civil del dueño (`ownerLocalDay`, el mismo helper que `ServeMealUseCase`); defaults `to = today`, `from = to - 30` | El cliente no recorre huecos; `today` del backend es coherente con el `servedOn` que se guardó al servir |
| D4 | El detalle muestra horas servidas + recuento; no compara con `mealsPerDay` | El horario no tiene historial (ver Fuera de alcance) |
| D5 | Punto si ≥ 1 servicio; sin colores ni números en la celda | Densidad mínima legible en 44 pt |
| D6 | Sin futuro: el mes de `today` es el tope del botón "siguiente"; los días posteriores a `today` dentro del mes van `disabled`. Sin límite inferior | El backend acepta `to` futuro (lo necesita el mes en curso) y devuelve `[]` |
| D7 | Cuatro estados (Skeleton, error + reintentar, mes vacío, sin mascota → `Redirect /food`), `placeholderData: keepPreviousData`, skeleton solo en la primera carga | "Every Screen Has Four States" (skill `expo-data-fetching`); el estado vacío conserva la rejilla para poder navegar |
| D8 | Nueve claves en/es desde R5, §2.18 en `specs/mobile-ui-language/design.md`, 11 filas en `ui-copy-table.ts` (E1: incluida la de `src/app/_layout.tsx`; E2: `#65 R18` sube `SCREEN_FILES` en `+ 1` y sus dos `it` quedan en rojo transitorio con `#65 R6`); error y reintento reutilizan `common.*` | Lección #146 R9: el literal va en la spec, no lo inventa Codex |
| D9 | Entrada = `Card` nuevo en `src/app/(tabs)/food.tsx` tras `meal-schedule-link`, `router.push('/meals-history')` | Caso de uso cerrado: pantalla de pila, no pestaña |
| D10 | Detalle inline con `useState<string | null>` | Un panel de 1–6 líneas no justifica ruta ni sheet |
| D11 | `describe('#105 R<n>: …')` propio por fichero; nunca se renombra un `it` ajeno; cada candado de inventario se sube con `+ N // #105 R<n>` (tabla abajo) | Lecciones #147 E1 y #65 |
| D12 | `src/app/meals-history.tsx` (route delgado) + `src/screens/meals-history/index.tsx` (`MealsHistoryScreen`) + `index.test.tsx`; registro en `_layout.tsx` con `{ ...headerOptions, title: t('mealsHistory.mealsHistory') }` | Convención Expo oficial desde #39 |
| D13 (enmienda) | La ruta se registra como **último hijo** de `Stack.Protected`, no tras `pairing` | `layout.test.tsx` candadea `slice(0, 6)`, `slice(6, 8)` y los ordinales noveno/décimo/undécimo; insertar en medio los rompe todos |
| D14 | Toda la aritmética de calendario vive en `src/utils/month-grid.ts` sobre cadenas y `Date.UTC` | `process.env.TZ` es ciego en jest; no hay `new Date()` local salvo `currentMonth(now)` para el mes inicial |
| D15 | Celda y punto son cápsulas (`rounded-full`); la selección usa `bg-accent-soft` | Evita mover `#62 R14 directUses` y `count(/style=\{CONTINUOUS_CORNER\}/g)`; solo mueve los dos contadores de `bg-accent-soft` |
| D16 | Lunes-primero fijo para `es` y `en` | Una sola rejilla que probar; es-MX es el mercado |
| D17 | La query devuelve una unión discriminada (`MealsHistoryState`) y nunca lanza; la pantalla hace `switch (data.kind)` | Idéntico a `getNutritionPlan` / `meal-schedule`; `isLoading` ⇔ `data === undefined` |

### `today`: backend manda, dispositivo siembra

El mes visible inicial sale del reloj del dispositivo (`currentMonth(new Date())`);
el tope de navegación y la desactivación de días futuros salen de
`history.today` en cuanto llega la respuesta. Si el dueño está en otra zona
horaria y el dispositivo ya pasó de mes, la rejilla del mes "adelantado" sale
con todos sus días deshabilitados y "siguiente" bloqueado: coherente, no un
bug.

## Archivos afectados

### Backend (`backend-pet-tracker/`)

| Capa | Fichero | Cambio | R-id |
|---|---|---|---|
| domain | `src/modules/nutrition/domain/nutrition.constants.ts` | `+ export const MEALS_HISTORY_MAX_RANGE_DAYS = 31` | R2 |
| domain | `src/modules/nutrition/domain/errors/nutrition.errors.ts` | `+ InvalidDateError`, `InvalidRangeError`, `RangeTooLargeError` (copia de `activity.errors.ts`) | R2 |
| domain | `src/modules/nutrition/domain/repositories/meal-serving.repository.ts` | `+ listServedBetween(petId, fromDay, toDay)` | R1 |
| application | `src/modules/nutrition/application/dto/meal.dto.ts` | `+ ListMealsQuerySchema`, `ListMealsQueryDto` | R4 |
| application | `src/modules/nutrition/application/use-cases/get-meals-history.use-case.ts` (nuevo) | `GetMealsHistoryUseCase`, `MealsHistoryResult`, helpers privados `assertCalendarDate`/`assertRange` | R3 |
| application | `src/modules/nutrition/application/use-cases/get-meals-history.use-case.spec.ts` (nuevo) | `describe('#105 R3: …')` | R3 |
| infrastructure | `src/modules/nutrition/infrastructure/repositories/meal-serving.drizzle.repository.ts` | `+ listServedBetween` con `and/eq/gte/lte` + `orderBy(asc, asc)` (añadir `gte, lte, asc` al import de `drizzle-orm`) | R1 |
| infrastructure | `src/modules/nutrition/infrastructure/mappers/nutrition-error.mapper.ts` | tres `instanceof` nuevos → `BadRequestException` (helper local `badRequest` como en `activity-error.mapper.ts`) | R2 |
| infrastructure | `src/modules/nutrition/infrastructure/mappers/nutrition-error.mapper.spec.ts` (nuevo) | `describe('#105 R2: …')` | R2 |
| infrastructure | `src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts` | `+ export type MealsHistoryResponse` | R4 |
| infrastructure | `src/modules/nutrition/infrastructure/meals.controller.ts` | `+ @Get()` + helper `parseQuery`; inyecta `GetMealsHistoryUseCase` | R4 |
| infrastructure | `src/modules/nutrition/nutrition.module.ts` | `GetMealsHistoryUseCase` en `providers` | R4 |
| test | `test/meals-history.e2e-spec.ts` (nuevo) | `describe('Meals history (e2e)')` con `#105 R1/R2/R4` | R1, R2, R4 |

No se tocan: `PetMealsReader`, `pet-meals.drizzle-reader.ts`, `GetNutritionPlanUseCase`,
`src/db/schema/*`, `drizzle/` (migraciones), `nutrition.controller.ts`.

### Móvil (`mobile-pet-tracker/`)

| Capa | Fichero | Cambio | R-id |
|---|---|---|---|
| i18n | `src/i18n/catalog.ts` | 9 claves en `en` y `es` | R5 |
| i18n | `src/__tests__/ui-copy-table.ts` | 11 filas en `R6_FOOD` (E1) | R5 |
| api | `src/api/types.ts` | `MealsHistoryDay`, `MealsHistory` | R6 |
| api | `src/api/nutrition.ts` | `getMealsHistory`, `MealsHistoryState` | R6 |
| api | `src/api/query-keys.ts` | `nutritionKeys.mealsHistory` | R7 |
| utils | `src/utils/month-grid.ts` (nuevo) | `monthOf`, `shiftMonth`, `monthRange`, `monthGrid`, `weekdayHeaders`, `monthTitle`, `longDayLabel`, `currentMonth` | R10, R12 |
| utils | `src/utils/__tests__/month-grid.test.ts` (nuevo) | `describe('#105 R10: …')` | R10 |
| app | `src/app/meals-history.tsx` (nuevo) | route delgado | R8 |
| app | `src/app/_layout.tsx` | `Stack.Screen name="meals-history"` último en `Stack.Protected` | R8 |
| app | `src/app/(tabs)/food.tsx` | `Card testID="meals-history-link"` | R14 |
| screens | `src/screens/meals-history/index.tsx` (nuevo) | `MealsHistoryScreen` | R9, R11, R12, R13 |
| screens | `src/screens/meals-history/index.test.tsx` (nuevo) | `describe('#105 R9/R11/R12/R13: …')` | R9, R11–R13 |
| tests | `src/app/__tests__/layout.test.tsx` | 4 candados `+ 1`; `describe('#105 R8')` | R8 |
| tests | `src/app/__tests__/detail-stack.test.tsx`, `detail-stack.navigation.test.tsx`, `detail-stack.guard.test.tsx` | `describe('#105 R8')` cada uno | R8 |
| tests | `src/api/__tests__/nutrition.test.ts`, `src/api/__tests__/query-keys.test.ts` | `describe('#105 R6')`, `describe('#105 R7')` | R6, R7 |
| tests | `src/app/(tabs)/__tests__/food.test.tsx` | `describe('#105 R14')` | R14 |
| tests | `src/providers/__tests__/language-provider.test.tsx` | candado `+ 9`; `describe('#105 R5')` | R5 |
| tests | `src/__tests__/ui-language.test.ts` | candado `+ 11` (E1) | R5 |
| tests | `src/__tests__/consistency-classnames.test.ts` | fila en `counters` + total `+ 2`; `bg-accent-soft` `+ 1` (dos sitios) | R11 |
| tests | `src/__tests__/design-drift.test.ts` | `'meals-history'` en `R3`; fila en `screenSignOutCalls`; `describe('#105 R15')` | R15 |
| docs | `specs/mobile-ui-language/design.md` | `### §2.18 — Añadidos por #105 — Historial de comidas` | R5 |

## Candados de inventario que #105 mueve

Cada fila: fichero, `it` ajeno (título literal), expresión actual (grep) y
delta. El delta se escribe al final de la suma con `// #105 R<n>`.

| Fichero | `it` / símbolo | Expresión actual | Δ #105 |
|---|---|---|---|
| `src/app/__tests__/layout.test.tsx` | `#114 R1` 'declara ocho rutas protegidas y alerts singular' | `toHaveLength(8 + 1 + 1 + 1)` | `+ 1 // #105 R8` |
| `src/app/__tests__/layout.test.tsx` | `#100 R2` 'declara alerts/[alertId] como noveno hijo y singular' | `toHaveLength(9 + 1 + 1)` | `+ 1 // #105 R8` |
| `src/app/__tests__/layout.test.tsx` | `#41 R4` 'décimo hijo' | `toHaveLength(10 + 1)` | `+ 1 // #105 R8` |
| `src/app/__tests__/layout.test.tsx` | `#146 R5` 'undécimo hijo' | `toHaveLength(11)` | `+ 1 // #105 R8` |
| `src/providers/__tests__/language-provider.test.tsx` | `#65 R12` `expect(englishKeys).toHaveLength(260 + 16 + …)` | termina en `+ 9)` (#147) | `+ 9 // #105 R5` |
| `src/__tests__/ui-language.test.ts` | `#65 R6` `expect(R6_FOOD).toHaveLength(35 + 3 + 1 - 2 + 1 + 3 + 9)` | 11 filas nuevas en `ui-copy-table.ts` (E1) | `+ 11 // #105 R5` |
| `src/__tests__/ui-language.test.ts` | `#65 R18` 'no deja ningún valor fijo del catálogo como literal entero en las pantallas' | `expect(SCREEN_FILES).toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1)` | `+ 1 // #105 R5` (E2; su bucle `readFileSync` da ENOENT hasta que R8 cree la pantalla) |
| `src/__tests__/ui-language.test.ts` | `#65 R18` 'resuelve cada ocurrencia de la tabla contra la clave exacta' | `checkUses(ALL_USES)` | sin delta (E2; rojo transitorio con `#65 R6` de R5 a R14) |
| `src/__tests__/consistency-classnames.test.ts` | `#62 R15` `counters` + total `toBe(14 + 4 + 1 + 1 + 1 + 1 + 1, // #146 R18)` | fila `[join('screens', 'meals-history', 'index.tsx'), 2]` | `+ 2 // #105 R11` |
| `src/__tests__/consistency-classnames.test.ts` | `#98 R10` 'deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban' | `count(/bg-accent-soft/g)).toBe(16 + 2)` | `+ 1 // #105 R11` |
| `src/__tests__/consistency-classnames.test.ts` | `#64 R9` `accentSoftCount` | `toBe(16 + 2)` | `+ 1 // #105 R11` |
| `src/__tests__/design-drift.test.ts` | `R3` it.each '%s importa el Card compartido' | lista `['home', 'food', 'meal-schedule', …]` | `+ 'meals-history'` |
| `src/__tests__/design-drift.test.ts` | `#87 R19` `screenSignOutCalls` | mapa `'screens/meal-schedule/index.tsx': 2`, … | `+ 'screens/meals-history/index.tsx': 1` |

Candados **verificados como no afectados** (el reviewer lo comprueba igual):
`#62 R14 directUses` y `count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1)`
(sin esquinas dibujadas, D15); `count(/rounded-xl bg-accent(?=…)/g)` (el punto
es `rounded-full bg-accent`); `#114 R1` '(tabs) conserva solo las cinco
pestañas' (`food.tsx` se edita, no se añade); 'keeps the four Expo Router
entrypoints thin' (lista cerrada); `#62 R2` forma de skeletons (solo los
testIDs listados); `#95 R2/R4/R7` tablas de las seis rutas de #95 (no se
amplían: #105 tiene su propio `describe`).

Si al arrancar la implementación alguno de los números base ya cambió por
otra feature mergeada, **la base se mide de nuevo y el delta de #105 se mantiene**
(lección "constantes congeladas en specs").

## Alternativas descartadas

- **Query `?month=YYYY-MM`.** Segundo contrato de rango distinto al de
  `activity`; `from`/`to` lo copia y permite una vista semanal futura sin
  tocar backend.
- **Pedir 42 días (mes + rellenos).** Supera 31 y los rellenos van vacíos y
  deshabilitados de todas formas.
- **Ampliar `PetMealsReader` con rango.** Ese lector sirve "hoy" al plan; el
  I/O de `meal_servings` ya es del puerto `MealServingRepository`.
- **Detalle como ruta `/meals-history/[date]` o `@expo/ui` BottomSheet.**
  Navegación extra y estado compartido para 1–6 líneas; inline basta.
- **Registrar la ruta tras `pairing`** (recomendación de
  `progress/explore_meals-history.md`). Rompe los candados indexados; se
  registra al final.
- **Reutilizar `weekdayLabel` de `src/screens/home/weekly-activity-chart.tsx`.**
  Import entre pantallas; `docs/conventions.md` manda helpers a `src/utils/`,
  y la rejilla necesita además título de mes y etiqueta larga de día.
- **Atenuar la rejilla con `isPlaceholderData` al cambiar de mes.** Los
  puntos del mes anterior ya desaparecen (no coinciden las fechas); nada que
  atenuar.
- **Preseleccionar hoy al abrir.** Abriría siempre el detalle; la rejilla es
  el héroe de la pantalla y el panel aparece al tocar.
- **Rechazar `to` futuro en backend.** El mes en curso lo necesita; el móvil
  ya deshabilita los días futuros.
- **Dependencias nuevas (p. ej. `react-native-calendars`).** Veto genérico de
  la carta y de `acceptance_criteria`; la rejilla son 40 líneas de util.

## Premisas de `explore_meals-history.md` que esta spec NO hereda

Verificadas falsas contra `d29d49d5`: "dos implementaciones del puerto" (solo
`MealServingDrizzleRepository`); `nutrition-scope.spec.ts` como test de scope
por `petId` (no aplica); existencia de `get-nutrition-plan.use-case.spec.ts`
(no existe); registro "detrás de `pairing`" (ver D13);
`src/modules/nutrition/nutrition.constants.ts` (la ruta real es
`src/modules/nutrition/domain/nutrition.constants.ts`).
