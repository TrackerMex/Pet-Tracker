---
feature: "meals-history"
tags: [harness, spec, tasks]
---

# Tareas — [[meals-history]]

> Un bloque por requisito, en el orden en que se ejecutan. Cada bloque:
> (1) test rojo que nombra el R-id y falla por la razón indicada,
> (2) implementación mínima que lo pone en verde, (3) refactor sin cambiar
> tests. **Dos commits por bloque como mínimo** (`test(...)` y luego
> `feat(...)`, ambos con `(#105 R<n>)`): es C4 de `CHECKPOINTS.md`.
> El orden está pensado para que **el sujeto de cada aserción exista antes de
> asertarlo** (lección "sujeto ausente en tasks.md").

## Preparación

- Branch `feature/105-meals-history` desde `origin/main` actualizado.
- Backend: `cd backend-pet-tracker && pnpm install --frozen-lockfile` (sin
  cambios en el lockfile). Los e2e necesitan Postgres levantado (`./init.sh`
  desde la raíz, o el compose del repo); `pnpm test` unitario no.
- Móvil: `cd mobile-pet-tracker && bun install --frozen-lockfile`;
  `test ! -e .expo/types/router.d.ts` antes de cualquier `bun run typecheck`
  (si existe, pedir al humano que lo borre; nunca `rm -f`).
- Leer `docs/ui-guidelines.md` y `docs/conventions.md` §Tests y §Esperas antes
  del primer test móvil.

## Backend

### R2 — constante, errores de dominio y mapper

1. Rojo: `src/modules/nutrition/infrastructure/mappers/nutrition-error.mapper.spec.ts`
   nuevo, `describe('#105 R2: …')`; importa `InvalidDateError`,
   `InvalidRangeError`, `RangeTooLargeError` de `../../domain/errors/nutrition.errors`
   y `MEALS_HISTORY_MAX_RANGE_DAYS` de `../../domain/nutrition.constants`.
   Falla por export inexistente (`is not a constructor` / `undefined`).
   `pnpm test -- src/modules/nutrition/infrastructure/mappers/nutrition-error.mapper.spec.ts`
2. Mínimo: constante, tres clases (copia de `activity.errors.ts`), tres
   `instanceof` en `mapNutritionError` con los literales de R2.
3. Refactor: helper local `badRequest(code, message)` si evita repetir el
   cuerpo tres veces.

### R1 — puerto y repositorio Drizzle

1. Rojo: añadir la firma `listServedBetween` al puerto y correr
   `pnpm exec tsc --noEmit` → `Property 'listServedBetween' is missing in type 'MealServingDrizzleRepository'`.
   (Las observaciones de comportamiento de R1 viven en el e2e de R4, que
   queda rojo por 404 hasta que exista el `@Get()`.) Commit `test(nutrition): declara listServedBetween en el puerto (#105 R1)`.
2. Mínimo: implementación en `meal-serving.drizzle.repository.ts` con
   `and(eq(mealServings.petId, petId), gte(mealServings.servedOn, fromDay), lte(mealServings.servedOn, toDay))`
   y `orderBy(asc(mealServings.servedOn), asc(mealServings.mealTime))`,
   seleccionando solo `servedOn` y `mealTime`.
3. Refactor: ninguno previsto.

### R3 — caso de uso

1. Rojo: `src/modules/nutrition/application/use-cases/get-meals-history.use-case.spec.ts`
   nuevo, `describe('#105 R3: …')`, un `it` por viñeta de R3 (defaults,
   "hoy" del dueño cruza año, relleno y orden, 32/31 días, `from > to`,
   `'ayer'`, `'2026-02-30'`, validación antes de I/O, `to` futuro). Falla por
   `Cannot find module './get-meals-history.use-case'`.
   `pnpm test -- src/modules/nutrition/application/use-cases/get-meals-history.use-case.spec.ts`
2. Mínimo: clase con el orden exacto de R3 (1→7), `@Injectable()`,
   `@Inject(MEAL_SERVING_REPOSITORY)` y `@Inject(PET_REPOSITORY)`.
3. Refactor: extraer `groupByDay` si la función `execute` pasa de ~40 líneas.

### R4 — endpoint, DTO estricto, módulo (cierra también R1 y R2 en e2e)

1. Rojo: `test/meals-history.e2e-spec.ts` nuevo, `describe('Meals history (e2e)')`
   con `describe('#105 R1 …')`, `describe('#105 R2 …')`, `describe('#105 R4 …')`
   y los casos de R4 en `requirements.md`. Helpers copiados de
   `test/meals.e2e-spec.ts` (`seedUser`, `seedPet`, `addMember`, `auth`,
   inserción directa en `mealServings` con `uuidv7()` y `createdBy`). Falla
   con `404` del router en todos los casos (no hay `@Get()`).
   `pnpm test:e2e -- test/meals-history.e2e-spec.ts`
2. Mínimo: `ListMealsQuerySchema`/`ListMealsQueryDto`, `parseQuery` y `@Get()`
   en `MealsController`, `MealsHistoryResponse` en `nutrition.mapper.ts`,
   provider en `nutrition.module.ts`.
3. Refactor: mover `parseBody`/`parseQuery` a un helper común **solo si**
   `activity.controller.ts` no lo tiene ya equivalente (no duplicar).

Comprobación del bloque backend: `pnpm test` y `pnpm test:e2e` verdes;
`git diff --stat origin/main -- pnpm-lock.yaml` vacío.

## Móvil

### R5 — copy

1. Rojo: `describe('#105 R5: …')` en `src/providers/__tests__/language-provider.test.tsx`
   (patrón `#147 R1`): `english[key]`/`spanish[key]` iguales a los literales de
   la tabla de R5 y `languageDesign` contiene la fila `← añadida por #105 (R5)`.
   Falla por `undefined` vs literal. Sube en el mismo commit el candado
   `#65 R12` en `+ 9 // #105 R5` (queda rojo hasta añadir las claves) y el de
   `#65 R6` en `+ 10 // #105 R5` con las 10 filas nuevas en `ui-copy-table.ts`
   (rojo hasta que existan las llamadas `t('…')` de R9–R14: **se acepta** ese
   rojo transitorio porque `checkUses` grepea los ficheros destino).
   `bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts`
2. Mínimo: 9 claves en `catalog.ts` (`en` y `es`), §2.18 en
   `specs/mobile-ui-language/design.md`.
3. Refactor: ninguno.

### R10 — util de calendario (antes que la pantalla: es su sujeto)

1. Rojo: `src/utils/__tests__/month-grid.test.ts` nuevo, `describe('#105 R10: …')`,
   un `it` por viñeta (incluye `currentMonth(new Date(2026, 0, 15, 12))` ⇒
   `'2026-01'`). Falla por `Cannot find module '../month-grid'`.
   `bunx jest src/utils/__tests__/month-grid.test.ts`
2. Mínimo: `src/utils/month-grid.ts` con las ocho funciones, solo cadenas y
   `Date.UTC` (excepto `currentMonth`).
3. Refactor: ninguno.

### R6 — cliente de API

1. Rojo: `describe('#105 R6: …')` en `src/api/__tests__/nutrition.test.ts`
   con los helpers `response`/`invalidJsonResponse`. Falla por
   `getMealsHistory is not a function`.
   `bunx jest src/api/__tests__/nutrition.test.ts`
2. Mínimo: tipos en `types.ts`, `getMealsHistory` + `MealsHistoryState` en
   `nutrition.ts` replicando `getNutritionPlan`.
3. Refactor: compartir el `switch` de estados con `getNutritionPlan` solo si
   queda más corto.

### R7 — clave de query

1. Rojo: `describe('#105 R7: …')` en `src/api/__tests__/query-keys.test.ts`.
   Falla por `nutritionKeys.mealsHistory is not a function`.
   `bunx jest src/api/__tests__/query-keys.test.ts`
2. Mínimo: `mealsHistory: (petId, from, to) => ['nutrition', 'meals-history', petId, { from, to }] as const`.
3. Refactor: ninguno.

### R8 — route delgado, registro en la pila, navegación y guarda

1. Rojo: en el mismo commit, (a) `describe('#105 R8')` en `layout.test.tsx`
   ('declara meals-history como duodécimo hijo con cabecera nativa') y los
   cuatro candados `+ 1 // #105 R8`; (b) `describe('#105 R8')` en
   `detail-stack.test.tsx` (route delgado); (c) en
   `detail-stack.navigation.test.tsx` (pila `['(tabs)', 'meals-history']`);
   (d) en `detail-stack.guard.test.tsx` (`/login`). Fallan por
   `children[11]` undefined, `ENOENT` del route y `+not-found`.
   `bunx jest src/app/__tests__/layout.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/detail-stack.navigation.test.tsx src/app/__tests__/detail-stack.guard.test.tsx`
2. Mínimo: `src/app/meals-history.tsx`; `Stack.Screen` último en
   `Stack.Protected`; `src/screens/meals-history/index.tsx` con un
   `MealsHistoryScreen` **esqueleto** que solo devuelve `<Redirect href="/food" />`
   sin mascota y, con mascota, el `ScrollView testID="screen-meals-history"`
   vacío (lo llena R9).
3. Refactor: ninguno.

### R9 — estados de pantalla

1. Rojo: `src/screens/meals-history/index.test.tsx` nuevo, harness de
   `meal-schedule/index.test.tsx`, reloj `jest.useFakeTimers({ now: Date.UTC(2026, 0, 15, 12) })`,
   `describe('#105 R9: …')` con los casos de R9 **salvo** "datos previos al
   cambiar de mes" (va en R12). Fallan por `Unable to find an element with
   testID meals-history-skeleton` etc.
   `bunx jest src/screens/meals-history/index.test.tsx`
2. Mínimo: `useQuery` con `nutritionKeys.mealsHistory` + `getMealsHistory` +
   `placeholderData: keepPreviousData`; `Skeleton`; error + `Button` retry;
   `signOut()` en `unauthorized`; en `ok`, un `Card` con el contenedor
   `<View testID="meals-history-grid">` **vacío** (sujeto de R11) y el texto
   `meals-history-empty` cuando todos los días están vacíos.
3. Refactor: ninguno.

### R11 — rejilla y celdas

1. Rojo: `describe('#105 R11: …')` en el mismo test, casos de R11 (cabecera
   de 7, filas 5×7, rellenos 4, celdas con 1 o 2 hijos, 16 futuras
   `toBeDisabled`, `meals-history-today` único, `accessibilityLabel`,
   candados de clases por grep del fuente). Fallan por conteos `0` y
   `Unable to find an element with testID meals-history-weekdays`.
   Sube en el mismo commit `#62 R15` (fila + `+ 2 // #105 R11`), `#98 R10`
   `bg-accent-soft` `+ 1 // #105 R11` y `#64 R9` `+ 1 // #105 R11` en
   `consistency-classnames.test.ts`.
   `bunx jest src/screens/meals-history/index.test.tsx src/__tests__/consistency-classnames.test.ts`
2. Mínimo: cabecera de mes (título + dos `Pressable` aún sin lógica de
   navegación), fila de días de la semana, filas de celdas con las seis
   decisiones (a–f) de R11; `selectedDay` existe pero nada lo cambia todavía.
3. Refactor: extraer `DayCell` como función local **en el mismo fichero** si
   la celda supera ~25 líneas (sin fichero nuevo: no mover inventarios).

### R12 — navegación de meses y tope

1. Rojo: `describe('#105 R12: …')` con los casos de R12, incluido "datos
   previos al cambiar de mes" (R9) y **sin** el caso del detalle que se oculta
   (va en R13). Fallan por `getMealsHistory` llamado 1 vez vs 2 y título que
   no cambia.
2. Mínimo: `visibleMonth` con `currentMonth(new Date())`, `shiftMonth` en los
   botones, `capMonth` y `disabled` en "siguiente", reset de `selectedDay`.
3. Refactor: ninguno.

### R13 — detalle inline

1. Rojo: `describe('#105 R13: …')` con los casos de R13 (incluido "con el día
   5 seleccionado, pulsar prev oculta el detalle"). Fallan por
   `Unable to find an element with testID meals-history-detail`.
2. Mínimo: `onPress` de la celda (toggle), panel con título, horas (una
   `Text` por hora con `style={TABULAR_NUMS}`), recuento `servedOne`/`servedMany`
   o `noMealsOnDay`.
3. Refactor: ninguno.

### R14 — card de entrada en Food

1. Rojo: `describe('#105 R14: …')` en `src/app/(tabs)/__tests__/food.test.tsx`.
   Falla por `Unable to find an element with testID meals-history-link`.
   `bunx jest 'src/app/\(tabs\)/__tests__/food.test.tsx'`
2. Mínimo: el `Card` de R14 tras `meal-schedule-link`.
3. Refactor: ninguno.

### R15 — grep-clean, inventarios, cierre

1. Rojo: `describe('#105 R15: …')` en `src/__tests__/design-drift.test.ts`
   (patrón `featureFiles` + `MEALS_BAR_STYLE_ESCAPES`) para los tres ficheros
   nuevos; `'meals-history'` en la lista `R3`; fila
   `'screens/meals-history/index.tsx': 1` en `screenSignOutCalls`. Si todo ya
   está limpio, este test nace verde: documentarlo en el commit (`test(mobile):
   candados de drift para meals-history (#105 R15)`), es un candado, no un
   requisito de comportamiento.
   `bunx jest src/__tests__/design-drift.test.ts`
2. Verificación final (no es implementación):
   `test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint && bunx jest`
   en `mobile-pet-tracker/`; `pnpm test && pnpm test:e2e` en `backend-pet-tracker/`;
   `git diff --stat origin/main -- '*package.json' '*bun.lock' '*pnpm-lock.yaml'`
   vacío.
3. `progress/impl_meals-history.md` con: hash por commit y R-id, salida
   resumida de los comandos anteriores, y los números base medidos de cada
   candado de la tabla de `design.md` si difieren de los escritos.

## Comandos por fichero de test (resumen)

| Fichero | Comando |
|---|---|
| `nutrition-error.mapper.spec.ts` | `pnpm test -- src/modules/nutrition/infrastructure/mappers/nutrition-error.mapper.spec.ts` |
| `get-meals-history.use-case.spec.ts` | `pnpm test -- src/modules/nutrition/application/use-cases/get-meals-history.use-case.spec.ts` |
| `test/meals-history.e2e-spec.ts` | `pnpm test:e2e -- test/meals-history.e2e-spec.ts` |
| `month-grid.test.ts` | `bunx jest src/utils/__tests__/month-grid.test.ts` |
| `nutrition.test.ts`, `query-keys.test.ts` | `bunx jest src/api/__tests__/nutrition.test.ts src/api/__tests__/query-keys.test.ts` |
| `layout.test.tsx` + 3 `detail-stack.*` | `bunx jest src/app/__tests__/layout.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/detail-stack.navigation.test.tsx src/app/__tests__/detail-stack.guard.test.tsx` |
| `screens/meals-history/index.test.tsx` | `bunx jest src/screens/meals-history/index.test.tsx` |
| `food.test.tsx` | `bunx jest 'src/app/\(tabs\)/__tests__/food.test.tsx'` |
| candados globales | `bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts` |

Esperas: siempre `waitFor` sobre el árbol (`docs/conventions.md` §Esperas),
nunca sobre el contador del mock. Sin `UNSAFE_*`. Sin `process.env.TZ`.
