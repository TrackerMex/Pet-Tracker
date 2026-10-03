---
feature: "mobile-meals-served-ui"
status: spec_ready
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-meals-served-ui]] (#98)

> Decisiones técnicas de alto nivel. Los requisitos están en [[requirements]];
> las reglas de capas, en [[../../docs/architecture|architecture]]; las de UI
> móvil, en [[../../docs/ui-guidelines|ui-guidelines]] (la carta manda sobre
> cualquier skill).
>
> Ancla: commit **`914905b8`**.

## 0. Skills cargadas y qué aportaron

| Skill | Lo relevante para esta feature | Dónde manda la carta en su lugar |
|---|---|---|
| `expo:expo-overview` | Router. Confirma leer los docs **pinchados** del SDK (`https://docs.expo.dev/versions/v57.0.0/`, nunca `latest`) y detectar el SDK en `package.json` (`expo ~57.0.14`) | Su «instala con `npx expo install`» **no** aplica: `docs/conventions.md` §Convenciones de la app móvil fija `bun`/`bunx`. Y aquí no se instala nada |
| `expo:expo-data-fetching` | (a) «Every screen has four states»: cargando / error / vacío / contenido, y **un refetch fallido conserva el contenido en caché** con un error no bloqueante → R6 pinta el aviso **junto** a las filas, no en lugar de ellas. (b) «Saves preserve work: while a mutation is pending, disable repeat submission» → el `disabled` y el `pendingMealTime` único de R5. (c) «Avoid axios, prefer fetch» → `src/api/http.ts` ya lo cumple | Su receta canónica es `useMutation` + `invalidateQueries`; el repo tiene **decisión propia** en contra (weight-log + `refetch`), tomada por el humano. Gana el repo |
| `expo:expo-native-ui` | (a) «Counters should use `{ fontVariant: 'tabular-nums' }`» → R10 y el `TABULAR_NUMS` del contador. (b) «`borderCurve: 'continuous'` para toda esquina redondeada **salvo cápsula**» → por eso el carril y el relleno (`rounded-full`) **no** llevan `CONTINUOUS_CORNER` y el candado de `consistency-classnames.test.ts:273` no se mueve. (c) «`<Text selectable />` en mensajes de error» → R6. (d) «Every enabled control must perform its advertised action» → el botón de R5 | Su «CSS and Tailwind are not supported — use inline styles» y su `Color` de `expo-router` **se descartan**: carta §Decisiones fijas 1 y 9 (Tailwind v4 + uniwind + heroui-native, color imperativo por `useThemeColors`). El ancho porcentual del relleno sí va por `style`, porque una clase arbitraria `w-[NN%]` está prohibida |

`expo:expo-ui` no se carga: la carta §Decisiones fijas 5 fija la capa
`@expo/ui/community/*` y esta feature no añade ningún control de esa familia
(el control nuevo es un `Pressable` sobre un badge que ya existía).

## 1. Contrato del backend — literal, leído del código mergeado de #83

Prefijo global `v1` (`backend-pet-tracker/src/main.ts:6`,
`app.setGlobalPrefix('v1')`). Controlador:
`src/modules/nutrition/infrastructure/meals.controller.ts:28-29` →
`@Controller('pets/:petId/meals')` con `@UseGuards(PetAccessGuard)`.

### 1.1 `POST /v1/pets/:petId/meals`

- Cuerpo, `application/dto/meal.dto.ts:3-9`:
  `z.strictObject({ mealTime: z.string().regex(/^\d{2}:\d{2}$/, 'mealTime must be HH:MM') })`.
  **Estricto**: una clave de más es `400`. `'7:30'` (sin cero a la izquierda) es `400`.
- `201` → `MealServingResponse`, seis claves
  (`infrastructure/mappers/nutrition.mapper.ts:40-47`):

```json
{ "id": "…", "petId": "…", "servedOn": "2026-09-21", "mealTime": "07:30",
  "servedAt": "2026-09-21T13:00:00.000Z", "createdBy": "…" }
```

- Errores (`mappers/nutrition-error.mapper.ts`, confirmados uno a uno en
  `test/meals.e2e-spec.ts`):

| HTTP | Cuerpo exacto | Origen |
|---|---|---|
| `400` | `{ "statusCode": 400, "message": "Validation failed", "errors": [{ "path": "…", "message": "…" }] }` | `meals.controller.ts:83-94`; e2e `:198-226` |
| `404` | el del `PetAccessGuard`, **sin** clave `code` | e2e `:413-422` (outsider y `petId` no-UUID) |
| `409` | `{ "statusCode": 409, "code": "MEAL_ALREADY_SERVED", "message": "Meal already served today" }` | mapper `:35-41`; e2e `:293-297` |
| `422` | `{ "statusCode": 422, "code": "NUTRITION_PLAN_REQUIRED", "message": "Generate a nutrition plan before serving meals" }` | mapper `:19-25`; e2e `:236-240` |
| `422` | `{ "statusCode": 422, "code": "MEAL_TIME_NOT_IN_PLAN", "message": "mealTime is not part of the current nutrition plan" }` | mapper `:27-33`; e2e `:257-261` |

### 1.2 `DELETE /v1/pets/:petId/meals/:mealTime`

- `meals.controller.ts:57-58`: `@Delete(':mealTime')` + `@HttpCode(HttpStatus.NO_CONTENT)`.
- `204` con cuerpo **vacío** (`expect(deleted.text).toBe('')`, e2e `:347-348`).
- `404` → `{ "statusCode": 404, "code": "MEAL_SERVING_NOT_FOUND", "message": "Meal serving not found for today" }`
  (mapper `:43-49`; e2e `:358-363`). Un `404` **sin** `code` es el del guard.
- La franja va **cruda en la ruta**: `/v1/pets/<id>/meals/07:30`. Los dos puntos
  no se codifican en el e2e (`:116-117`), así que el cliente tampoco los
  codifica.

### 1.3 `GET /v1/pets/:petId/nutrition-plan` — clave nueva `servedToday`

R9 de #83. Responde las **11** claves de `NutritionPlanResponse`
(`nutrition.mapper.ts:22-34`) **más** `servedToday: string[]`
(`NutritionPlanTodayResponse`, `:36-38`). Contenido: las franjas servidas hoy
—día civil del **owner**— que pertenecen a `mealTimes` del plan vigente, **en el
orden de `mealTimes`**, `[]` si ninguna (e2e `:469-506`). Una franja servida hoy
que el plan regenerado ya no contiene **no aparece** (D4 de #83).
`POST …/nutrition-plan/generate` sigue **sin** `servedToday`.

### 1.4 `GET /v1/pets/:petId` — clave nueva `mealsToday`

R10 de #83. `mealsToday: { served: number; total: number } | null`:
`null` si la mascota no tiene plan; con plan, `total = mealsPerDay` y
`served` = filas de `meal_servings` de hoy cuyo `meal_time` está en `mealTimes`
del plan vigente. `served ≤ total` **siempre** (P2 de #83).
`GET /v1/pets` devuelve `mealsToday: null` en **cada** elemento, clave presente
(e2e `:508-546`). Por eso la Home, que lee el **detalle**, tiene el dato sin
pedir nada nuevo, y el **listado** nunca lo tendrá.

## 2. Tipos nuevos en el cliente (`src/api/types.ts`)

```
interface NutritionPlan  { … ; generatedAt: string; servedToday: string[]; }   // 11 → 12 campos
interface MealsToday     { served: number; total: number; }                    // nueva
interface PetProfile     { … ; activitySummary: unknown; mealsToday: MealsToday | null; }  // 24 → 25
```

`nextReminder` y `activitySummary` **siguen `unknown`**: el candado de
`src/screens/home/index.test.tsx:2964-2965` no se toca. Y el guard
`isPetProfile` (`src/api/pets.ts:48-55`) sigue comprobando solo `id` y `name`
— P16 de #83: los clientes no validan exhaustivamente, y por eso #83 pudo
añadir claves sin romper al móvil desplegado.

## 3. Flujo de refresco — sin estado optimista

```
pulsación en meal-toggle-<i>
   │
   ├─ pendingMealTime !== null ?  ──► return (una sola llamada en vuelo, D8)
   │
   ├─ setPendingMealTime(mealTime) ; setMealError(null)
   │
   ├─ served ? unserveMeal(...) : serveMeal(...)
   │
   ├─ kind ∈ {ok, already-served, not-served}  ──► sin aviso
   │  kind ∈ {unauthorized, error, unreachable, missing-config}
   │        ──► setMealError(t('food.couldNotUpdateMeal'))
   │
   ├─ await plan.refetch()                                     ← nutritionKeys.plan(petId)
   ├─ await queryClient.refetchQueries({ queryKey: petKeys.detail(petId) })
   │
   └─ setPendingMealTime(null)
```

El refresco corre **siempre**, también tras un fallo: es lo único que puede
devolver la UI a la verdad del servidor. El `409` y el `404` de franja no son
errores para el usuario — significan que el servidor **ya** está donde el
usuario quería llegar; se resuelven con el propio refresco.

**Por qué no `useMutation` + `invalidateQueries`:** la skill
`expo-data-fetching` los recomienda, pero el repo tiene el patrón contrario
decidido y verificado en `src/app/(tabs)/weight-log.tsx:87-111` (`createWeight`
→ `switch (result.kind)` → `weights.refetch()`), y la entrada de #98 lo repite
como decisión cerrada. `useQueryClient` entra con **un solo** uso de producción
en todo `src/`, para la query que esta pantalla no monta.

**Red de seguridad ya existente:** `src/screens/home/index.tsx:247-252` refresca
`pets`, `detail` y `openAlerts` en `useFocusEffect`. Volver a la Home desde Food
refetchea el detalle aunque el `refetchQueries` no haya alcanzado una query
inactiva. El candado es `describe('R10: refetch al foco')`
(`index.test.tsx:1049`).

## 4. La barra de comidas: del Make a los tokens del repo

El Make vive en `specs/mobile-figma-polish/design-src/App.tsx:437-445`
(la entrada de #98 dice `:438-446`; corregido). Traducción decisión a decisión:

| Make (`:437-445`) | Repo | Por qué |
|---|---|---|
| `p-3.5 bg-white border border-border rounded-2xl shadow-sm` | `src/components/card.tsx` → `rounded-card border border-border bg-surface p-4 shadow-sm` | `rounded-2xl` está **prohibido** (carta §Decisiones fijas 12, candado `consistency-classnames.test.ts:149-155`); `Card` ya trae el radio y la esquina continua |
| `<div className="text-xl">🍽️</div>` | `<ForkKnife size={20} color={mealsInk} />` dentro de `size-9 … rounded-full bg-category-rose` | «Ningún glifo tipográfico hace de icono» (#62 R7); el disco de 36 px y el icono de 20 igualan a los hermanos (`index.tsx:640-642`, `:703-705`) |
| `text-sm font-semibold text-foreground` («Alimentación») | `text-sm font-semibold text-foreground` con `t('food.mealsToday')` | misma receta que `reminders-next-vaccine-name`; el copy se reutiliza (D7 de [[requirements]]) |
| `text-xs text-muted-foreground` (`{meals}/{totalMeals}`) | `text-xs font-normal text-muted` + `style={TABULAR_NUMS}` | misma receta que `reminders-next-vaccine-date`; el `fontVariant` lo pide la carta para contadores |
| `h-1.5 bg-muted rounded-full overflow-hidden` | `h-1.5 overflow-hidden rounded-full bg-default` | en este repo `--muted` (`#667085` / `#9CA3AF`) es **tinta de texto**, no superficie; la superficie neutra es `bg-default` (`#F5F6F8` / `#1F242B`), la misma que la carta asigna al hueco `neutral` |
| `background: "#2AB87C"` en el relleno | `bg-accent` | **token confirmado en el árbol**: `src/theme/global.css:39` (`--accent: #178255`) y `:46` (`--color-accent`). Regla mecánica de la carta §Decisiones fijas 11: *fondo ⇒ `--accent`*. El `#2AB87C` del Make es `--accent-strong` **solo en dark** (`:88`); usarlo como relleno en claro daría 2,55:1 y #61 ya lo rechazó. Consecuencia asumida: el verde no coincide 1:1 con el Make en el smoke |
| `width: (meals/totalMeals)*100 %` | `style={{ width: \`${pct}%\` }}` con `pct = total > 0 ? Math.round((served/total)*100) : 0` | `w-[50%]` es clase arbitraria, prohibida por el grep-clean; el porcentaje va por `style`, como `weekly-activity-chart.tsx` ya hace con sus anchos |

### Anatomía exacta (la que candan R7 y la §Enmienda #98 de la carta)

```
<Card testID="reminders-meals" className="flex-row items-center gap-3">      children: 2
  [0] <View className="size-9 items-center justify-center rounded-full bg-category-rose">
        <ForkKnife size={20} color={mealsInk} />
      </View>
  [1] <View className="flex-1 gap-1.5">                                      children: 2
        [0] <View className="flex-row items-center justify-between">         children: 2
              [0] <Text testID="reminders-meals-title"
                        className="text-sm font-semibold text-foreground">
              [1] <Text testID="reminders-meals-count"
                        accessibilityLabel={t('food.mealsServedOfTotal', { served, total })}
                        style={TABULAR_NUMS}
                        className="text-xs font-normal text-muted">{served}/{total}</Text>
            </View>
        [1] <View testID="reminders-meals-track"
                  className="h-1.5 overflow-hidden rounded-full bg-default">  children: 1
              [0] <View testID="reminders-meals-fill"
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${pct}%` }} />
            </View>
      </View>
</Card>
```

`mealsInk` sale de ampliar la llamada que ya existe en
`src/screens/home/index.tsx:167-173`:
`useThemeColors(['accent-strong','success','warning','muted','category-blue-strong','category-rose-strong'])`
→ un sexto destructurado. No se crea una segunda llamada.

**Sin `CONTINUOUS_CORNER`**: el disco, el carril y el relleno son cápsulas
(`rounded-full`) y la esquina de la card la pone `Card`. Por eso
`consistency-classnames.test.ts:269-332` (2 en `home/index.tsx`, suma 35) no se
mueve. El candado de ese test además asevera que **ningún** uso de
`CONTINUOUS_CORNER` convive con `rounded-full` en la misma etiqueta, así que
añadirlo sería directamente rojo.

## 5. El control de Food

`src/app/(tabs)/food.tsx:220-233` pinta hoy un `<Text>` badge. Se le antepone
un padre pulsable y se conserva todo lo demás:

```
<Pressable
  testID={`meal-toggle-${index}`}
  accessibilityRole="button"
  accessibilityLabel={t(served ? 'food.undoServed' : 'food.markServed', { time: mealTime })}
  disabled={pendingMealTime === mealTime}
  className="min-h-11 justify-center"
  style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
  onPress={() => void toggleMeal(mealTime, served)}
>
  <Text testID={served ? `meal-served-${index}` : `meal-pending-${index}`}
        className={…sin cambios…}>{served ? t('food.served') : t('food.pending')}</Text>
</Pressable>
```

La receta de pulsado (`min-h-11 justify-center` +
`style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}`) es **literalmente**
la de `reminders-see-all` en `src/screens/home/index.tsx:613-618`, ya candada
por `src/screens/home/index.test.tsx:188-190`. No se inventa una receta nueva.

`meal-row-<index>` pasa de 3 a **3** hijos: el badge sigue siendo el tercero,
ahora envuelto. Si alguna aserción de posición se apoyaba en que el tercer hijo
fuese el `Text`, se reapunta al `Pressable` y el `Text` se busca con
`within(toggle)`.

**Alternativa descartada — `Button` de heroui**: habría metido
`rounded-xl bg-accent` y movido el candado de 13
(`consistency-classnames.test.ts:97-104`), habría añadido un segundo
tratamiento visual a una fila que ya tiene su píldora, y habría obligado a
`bg-accent` como fondo de un control de 44 px dentro de una fila de 3 px de
padding. El badge ascendido es menos diff y menos ruido visual.

## 6. Archivos afectados

Todo es **cliente**: `mobile-pet-tracker/` es la capa de presentación del
sistema; no hay `domain`/`application`/`infrastructure` que tocar
(`docs/architecture.md` describe el backend). El backend de esta funcionalidad
ya está mergeado (#83) y **no se toca**.

| Fichero | Qué cambia | R |
|---|---|---|
| `mobile-pet-tracker/src/api/types.ts` | `NutritionPlan.servedToday`, `MealsToday`, `PetProfile.mealsToday` | R1 |
| `mobile-pet-tracker/src/api/nutrition.ts` | `ServeMealState`, `UnserveMealState`, `serveMeal`, `unserveMeal` | R2 |
| `mobile-pet-tracker/src/api/__tests__/nutrition.test.ts` | `#98 R2` | R2 |
| `mobile-pet-tracker/src/i18n/catalog.ts` | 4 claves × 2 idiomas | R3 |
| `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` | `:50` comentario, `:55` 305 → 309, `#98 R3` | R3 |
| `specs/mobile-ui-language/design.md` | 4 filas en §2.6 + rótulo de sección | R3 |
| `mobile-pet-tracker/src/app/(tabs)/food.tsx` | reloj fuera; `servedToday`; `useQueryClient`; `pendingMealTime`; `mealError`; `Pressable` por franja; `food-meal-error` | R4, R5, R6 |
| `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx` | fixture `mealsToday: null` y `servedToday: []`; fuera los fake timers; deltas `:301/:310/:315/:327-334`; `#98 R4/R5/R6` | R1, R4, R5, R6 |
| `mobile-pet-tracker/src/app/(tabs)/__tests__/meal-schedule.test.tsx` | `servedToday: []` en `makePlan` (corrección de alcance autorizada por el humano el 2026-09-21) | R1 |
| `mobile-pet-tracker/src/screens/home/index.tsx` | `mealsInk`; `ForkKnife`; `reminders-meals` tras `reminders-next-vaccine` | R7, R10 |
| `mobile-pet-tracker/src/screens/home/index.test.tsx` | fixture; mock de `ForkKnife`; `#98 R1/R7/R8`; reescritura de `#70 R3` (`:3459-3474`) | R1, R7, R8 |
| `mobile-pet-tracker/src/app/(tabs)/__tests__/health.test.tsx` · `map.test.tsx` · `src/screens/{profile,reminders,pairing,docs}/index.test.tsx` · `src/components/__tests__/{pet-switcher,pet-hero-header}.test.tsx` | `mealsToday: null` en `makePet` (8 ficheros) | R1 |
| `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | +3 en `R6_FOOD`, +2 en `R3_HOME` | R9 |
| `mobile-pet-tracker/src/__tests__/ui-language.test.ts` | `:85` +2, `:140` 35 → 38, `#98 R9` | R9 |
| `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` | `#62 R15` ×5 sitios, `#98 R10`, `#98 R11` | R10, R11 |
| `mobile-pet-tracker/src/__tests__/design-drift.test.ts` | `#98 R10` (lista de ficheros de la feature) | R10 |
| `docs/ui-guidelines.md` | §Enmienda #98 | R11 |
| `specs/mobile-food/requirements.md` · `design.md` | §Enmienda #98; D7 tachado | R11 |

**No se toca** `src/hooks/use-pet-selection.test.tsx` (usa `as PetProfile`),
ni `src/api/pets.ts`, ni `src/api/query-keys.ts` (`nutritionKeys.plan` y
`petKeys.detail` ya existen), ni `package.json`.

## 7. Cómo correr los tests (paréntesis escapados)

`(tabs)` sin escapar es una regex: casa con `src/app/tabs/`, que no existe, y
**salta el fichero en silencio con exit 0** (`docs/conventions.md` §Filtros de
jest). Todas las invocaciones de esta spec usan `--runTestsByPath`:

```bash
cd mobile-pet-tracker

# suite de la feature
bunx jest --runTestsByPath \
  'src/api/__tests__/nutrition.test.ts' \
  'src/app/(tabs)/__tests__/food.test.tsx' \
  'src/screens/home/index.test.tsx' \
  'src/providers/__tests__/language-provider.test.tsx' \
  'src/__tests__/ui-language.test.ts' \
  'src/__tests__/consistency-classnames.test.ts' \
  'src/__tests__/legibility-classnames.test.ts' \
  'src/__tests__/design-drift.test.ts'

# las ocho fixtures restantes de R1
bunx jest --runTestsByPath \
  'src/app/(tabs)/__tests__/health.test.tsx' \
  'src/app/(tabs)/__tests__/map.test.tsx' \
  'src/screens/profile/index.test.tsx' \
  'src/screens/reminders/index.test.tsx' \
  'src/screens/pairing/index.test.tsx' \
  'src/screens/docs/index.test.tsx' \
  'src/components/__tests__/pet-switcher.test.tsx' \
  'src/components/__tests__/pet-hero-header.test.tsx'

bunx tsc --noEmit
```

**Comprueba que el número de suites que imprime jest coincide con el de rutas
del filtro** (8 y 8). Antes de tocar nada, borra
`mobile-pet-tracker/.expo/types/router.d.ts` si existe: está gitignorado y sus
rutas fantasma rompen el typecheck.

Un `./init.sh` completo lo corre el reviewer. **No lo lances mientras haya otra
sesión en un worktree vecino**: Postgres y LocalStack son compartidos
(`docs/conventions.md` §Sesiones en paralelo).

## 8. Alternativas descartadas

- **Estado optimista (`acked` de alerts).** Descartada por el humano el
  2026-09-15: en alertas el servidor solo *supera* la acción; en comidas la
  *invalida* si el plan se regenera sin esa franja (D4 de #83). Un overlay
  local afirmaría algo falso.
- **`useMutation` + `invalidateQueries`.** La receta de la skill; contradice el
  patrón del repo y la entrada de #98. Se descarta por decisión, no por técnica.
- **Montar `useQuery(petKeys.detail(...))` en Food** para poder llamar a su
  `refetch()`. Añadiría una llamada de red en cada carga de Food a cambio de
  evitar un `useQueryClient`. Descartada: más red, no menos.
- **`queryClient.invalidateQueries`** — prohibido explícitamente.
- **Extraer un `<MealsBar />` a `src/components/`.** La regla de extracción de
  la carta pide ≥2 pantallas; hoy hay una. Queda inline en
  `src/screens/home/index.tsx`, donde ya viven los demás hijos del cuerpo.
- **Reestructurar `food.tsx` a route delgado + `src/screens/food/`.** Sería lo
  correcto según la convención de #39, pero esa misma convención prohíbe migrar
  en frío. Declarado fuera de alcance en [[requirements]].
- **Usar `bg-accent-soft` para el disco del icono.** Habría movido el candado de
  16 (`consistency-classnames.test.ts:437-449`) y habría roto la regla de que el
  hueco categórico lo decide `src/utils/category-palette.ts`. Se usa `rose`, que
  es el hueco que la carta ya asigna a `food`.
- **`Bone` como icono.** Es el icono de los **recordatorios** de tipo `food`
  (`index.tsx:83`); reutilizarlo cruzaría la decisión 2 de la §Enmienda #70
  entre dos elementos de la misma sección. Se usa `ForkKnife`, el que Food ya
  usa para su propio plan.
- **Animar la barra con Reanimated.** Fuera de alcance de #98; registrado el
  2026-09-21 como **#106 `mobile-meals-bar-motion`**. `react-native-reanimated`
  4.5.1 ya está instalado (`package.json:37`), así que esa feature no arrastra
  dependencia nueva salvo que incluya `expo-haptics`.
