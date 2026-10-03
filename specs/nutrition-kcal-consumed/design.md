---
feature: "nutrition-kcal-consumed"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[nutrition-kcal-consumed]] (#104)

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
>
> Escrita para ser **autosuficiente**: quien implemente (Codex CLI) no tiene
> acceso a la conversación que la originó. Todo símbolo, clave y valor que
> aparece aquí es literal. Commit base `2be1b023`; rutas relativas a
> `backend-pet-tracker/` salvo `docs/`, `specs/`, `progress/`,
> `mobile-pet-tracker/`. Anclas por contenido grepeable, nunca por número de
> línea.

## Decisiones técnicas

### D1 — Backend aquí, tarjeta móvil en #113 — **FIRMADA POR EL HUMANO el 2026-09-23 (Notion)**

Sirve a los criterios 1 y 2 (se quedan) y saca de #104 los criterios 3 y 4
(tarjeta «Objetivo diario», cero dependencias, suite móvil verde).

Mismo corte que firmó el humano para #83/#98 el 2026-09-15
(`specs/meals-served-tracking/design.md`, «D1 — Backend aquí, móvil en
#98»): las dos pilas viven en sesiones y worktrees distintos (`CLAUDE.md`
§Un solo escritor), el backend cierra con e2e y el móvil con un smoke en dev
build de Android, y la mitad móvil arrastra candados propios (catálogo i18n,
fixtures tipadas, carta de UI) que no tienen nada que ver con el cálculo.

La mitad móvil es la entrada nueva **#113** `mobile-kcal-consumed-bar`
(`pending`, P3), ya escrita en `feature_list.json` por esta spec. Su
descripción dice que está **bloqueada hasta que #104 esté mergeada en
`main`**, que añade claves a `src/i18n/catalog.ts` (así que su spec tiene que
recontar el candado de longitud del catálogo en
`src/providers/__tests__/language-provider.test.tsx`), que su gate humano es
un smoke en **dev build de Android, no Expo Go**, y que el Make pinta
**barra y anillo** (corrección C1): su spec elige y lo justifica.

Si el humano **no** firma D1, #104 recupera los criterios 3 y 4, #113 se
borra de `feature_list.json` y esta spec se reabre para añadir la parte
móvil.

### D2 — Reparto uniforme, un solo redondeo sobre el agregado (R1; criterio 1)

```ts
// src/modules/nutrition/domain/entities/meal-serving.entity.ts (se añade tras servedInPlan)
/**
 * #104 D2: cada franja vale merKcal / mealsPerDay; se redondea una sola vez
 * el agregado, así todas servidas = merKcal exacto.
 */
export function kcalConsumed(
  merKcal: number,
  mealsPerDay: number,
  servedCount: number,
): number {
  return Math.round((merKcal * servedCount) / mealsPerDay);
}
```

Por qué uniforme:

- **Es lo que la app ya enseña.** `food.tsx` y `meal-schedule/index.tsx`
  pintan la ración de cada fila como `dailyGrams / mealsPerDay` (P6). Un
  reparto de kcal distinto contradiría los gramos que el usuario ve en la
  misma pantalla.
- **No hay base clínica para otro.** `MEAL_TIMES_BY_COUNT` son horas fijas
  "no repartidas algorítmicamente" (P2); el engine no produce ningún peso por
  franja.
- **Cero migración, cero columna, cero backfill** de los planes existentes.

Por qué redondear el agregado y no cada franja: con enteros por franja
(1000/3 → 334 + 333 + 333) hay que elegir quién se lleva el resto, y entonces
servir una franja da 334 o 333 según **cuál** se sirva; el usuario ve
cantidades distintas para "1 de 3 comidas". Con el redondeo único el valor
solo depende del **número** servido (333, 667, 1000), y todas servidas da
`merKcal` exacto por construcción (`merKcal · n / n`). La precisión de coma
flotante no es problema: `merKcal · servedCount` es entero y una división
IEEE cuyo resultado exacto es representable (como x,5 con divisor 2, 4 o 6)
es exacta, así que `Math.round` ve la mitad real.

Invariantes que dan gratis P3/P4: `0 ≤ kcalConsumed ≤ merKcal`, entero,
`mealsPerDay ≥ 1`. **No** se añade guarda de `mealsPerDay = 0` ni recorte a
`merKcal`: el `check` de la tabla y el engine ya lo impiden.

Vive en `meal-serving.entity.ts`, junto a `servedInPlan`, porque es la otra
mitad de la misma pregunta ("qué cuenta hoy"): un fichero de dominio, sin
imports.

### D3 — Un solo campo, `kcalConsumedToday: number` (R2; criterio 2)

- **Nombre**: `kcalConsumedToday`, paralelo a `servedToday` (sufijo `Today`
  = día civil del owner, #83) y al vocabulario del Make y de la feature
  (`caloriesConsumed`, `nutrition-kcal-consumed`). **Semántica**: kcal de las
  franjas **servidas** hoy, suponiendo la ración entera. El backend no sabe
  si la mascota dejó comida; se escribe aquí para que nadie lea "consumed"
  como una medición.
- **Tipo**: entero ≥ 0 (`number` en TS). Nunca `null`: si hay plan hay
  número; si no hay plan el `GET` ya responde `404` y no hay cuerpo.
- **Posición**: última clave del objeto, tras `servedToday`.
- **Solo en el `GET` del plan.** Ni en `generate` (R19 de #17, igual que
  `servedToday` por #83 C5), ni en el perfil (la Home del Make no pinta kcal),
  ni como lista por franja (C2: nadie la lee).

Cambios exactos, application + infrastructure:

```ts
// src/modules/nutrition/application/use-cases/get-nutrition-plan.use-case.ts
export interface NutritionPlanToday {
  plan: NutritionPlan;
  servedToday: string[];
  kcalConsumedToday: number;
}
// en execute(), en lugar de `return { plan, servedToday: servedInPlan(plan.mealTimes, served) };`
const servedToday = servedInPlan(plan.mealTimes, served);
return {
  plan,
  servedToday,
  kcalConsumedToday: kcalConsumed(plan.merKcal, plan.mealsPerDay, servedToday.length),
};
```

```ts
// src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts
export interface NutritionPlanTodayResponse extends NutritionPlanResponse {
  servedToday: string[];
  kcalConsumedToday: number;
}
export function toNutritionPlanTodayResponse({
  plan,
  servedToday,
  kcalConsumedToday,
}: NutritionPlanToday): NutritionPlanTodayResponse {
  return { ...toNutritionPlanResponse(plan), servedToday, kcalConsumedToday };
}
```

El cálculo va en el use case (application llama a dominio), no en el mapper
(infraestructura no decide negocio). `nutrition.controller.ts` **no cambia**:
ya devuelve `toNutritionPlanTodayResponse(await this.getPlan.execute(…))`.
El constructor de `GetNutritionPlanUseCase` no cambia; no hay spec unitario
del use case y no se crea (el cableado lo prueban los e2e R2-R4; la
aritmética, R1).

### D4 — Derivado al leer, con el plan vigente (R4; decisión 4 del encargo)

`kcalConsumedToday` no se guarda en ningún sitio: cada `GET` lo recalcula con
el plan que devuelve `findLatestPlan` y con `servedToday`, que ya aplica D4
de #83 (solo cuentan las franjas presentes en `mealTimes` del plan vigente).
Consecuencias, escritas para que nadie las lea como bug:

| Qué cambia a mitad de día | Qué pasa con `kcalConsumedToday` |
|---|---|
| Se sirve o se deshace una franja | el siguiente `GET` sube o baja (R2) |
| Plan nuevo, **mismas** franjas, otro `merKcal` (p. ej. otro peso) | las franjas servidas se **revalúan** al `merKcal` nuevo (R4 a: 530 → 400) |
| Plan nuevo con **otro** `mealsPerDay` (otras horas) | las servidas del plan anterior dejan de contar; el reparto usa el `mealsPerDay` nuevo (R4 b: 0 → 333 → 667 → 1000) |
| El owner cambia de zona horaria | igual que #83: `served_on` no se recalcula; el "hoy" de la lectura es el de la zona nueva |

Por qué revaluar en vez de congelar las kcal al servir: la tarjeta compara
consumidas **contra el objetivo del plan vigente** (`merKcal`). Con el valor
congelado del plan viejo, el porcentaje mezclaría dos objetivos y podría
pasar de 100 %. Revaluando, `kcalConsumedToday / merKcal` ≈
`servedToday.length / mealsPerDay`, que es exactamente lo que ya dice el
contador de comidas (`mealsToday`, `food-meals-progress`): la barra y el
contador nunca se contradicen.

### D5 — "El día" es el de #83 (R3; premisa P5)

No se define un día nuevo. `kcalConsumedToday` sale de la **misma** lista
`servedToday` y en la **misma** llamada a `execute(petId, now)` de
`GetNutritionPlanUseCase`, cuyo `day` es
`await ownerLocalDay(this.pets, petId, now)` con `now = new Date()` del
controller: día civil del owner en su zona IANA (`users.timezone`), UTC si
falta o no es válida, sin fecha del cliente. Es la misma función con la que
`ServeMealUseCase` y `UnserveMealUseCase` fijan `served_on`. **Prohibido**
hacer una segunda consulta a `meal_servings` o calcular otro `day` para las
kcal: R3 lo vigila en los dos extremos de zona.

## Verificación de premisas: qué se comprobó y cómo

Detalle en [[requirements]] §0. Resumen de las cuatro que pidió el leader:

| Premisa del encargo | Resultado | Comando |
|---|---|---|
| El Make pinta una **barra** (no un anillo) en «Objetivo diario», alimentada por `caloriesConsumed` | **Falsa a medias (C1)**: pinta barra **y** anillo, los dos con el mismo `pct`; sí se alimenta de `caloriesConsumed` | `grep -n -e caloriesConsumed -e "Objetivo diario" -e kcal specs/mobile-figma-polish/design-src/App.tsx` y `grep -n -e strokeDasharray -e "<circle" specs/mobile-figma-polish/design-src/App.tsx` (el anillo es el par de `<circle` dentro de `FoodScreen`) |
| Hoy el backend no calcula kcal consumidas | **Cierta (P1)** | `grep -rniE "consumed" backend-pet-tracker/src backend-pet-tracker/test` → 0 |
| El plan no desglosa kcal por franja | **Cierta (P2)**; y para el dato que pinta el Make no hace falta (C2) | lectura de `nutrition-engine.ts`, `nutrition-plan.entity.ts`, `nutrition.schema.ts`, `get-nutrition-plan.use-case.ts`; `grep -rn -e mealKcal -e kcalPerMeal backend-pet-tracker/src` → 0 |
| Cómo define #83 "el día" | **`ownerLocalDay(pets, petId, new Date())`**, fallback UTC, sin fecha del cliente, fijado al escribir (P5) | `grep -rn -e ownerLocalDay -e "new Date()" backend-pet-tracker/src/modules/nutrition` |

## Archivos afectados (lista cerrada; nada fuera de ella)

| Fichero | Capa | Cambio | R |
|---|---|---|---|
| `src/modules/nutrition/domain/entities/meal-serving.entity.ts` | domain | + `export function kcalConsumed` (D2) | R1 |
| `src/modules/nutrition/domain/entities/meal-serving.entity.spec.ts` | test unit | + `describe('R1 (nutrition-kcal-consumed #104): …')` | R1 |
| `src/modules/nutrition/application/use-cases/get-nutrition-plan.use-case.ts` | application | `NutritionPlanToday` + `kcalConsumedToday`; `execute` lo calcula (D3) | R2 |
| `src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts` | infrastructure | `NutritionPlanTodayResponse` + `kcalConsumedToday`; `toNutritionPlanTodayResponse` lo copia (D3) | R2 |
| `test/meals.e2e-spec.ts` | test e2e | + `describe` R2, R3, R4 al final; delta 1 en la lista de claves de R9 de #83 | R2-R4 |
| `test/nutrition.e2e-spec.ts` | test e2e | delta 2 en el `toEqual` de R24 de #17 | R2 |
| `specs/nutrition-kcal-consumed/traceability.md` | spec | filas con test y commit | todos |
| `progress/impl_nutrition-kcal-consumed.md` | progress | reporte de Codex | todos |

**No cambian** (y un diff en ellos es un hallazgo del reviewer):
`nutrition.controller.ts`, `meals.controller.ts`, `nutrition.module.ts`,
`pet-meals-read.module.ts`, los tres repositorios/lectores Drizzle y sus
puertos (`meal-serving.repository.ts`, `nutrition.repository.ts`,
`pet-meals-reader.ts`), `nutrition-engine.ts`, `nutrition.constants.ts`,
`src/db/**`, todo `src/modules/pets/**`, `docs/**`, `mobile-pet-tracker/**`,
`package.json`/lockfile, `.env.example`, `init.sh`.

**Dobles de puertos**: ninguno que actualizar. No se añade ni cambia ningún
método de puerto o repositorio (P9: el `grep -rn -e "implements …" -e "MockOf<…>"` de [[requirements]] §0
→ solo las tres clases Drizzle). Los dobles parciales de `serve-meal.use-case.spec.ts` y
`unserve-meal.use-case.spec.ts` no ven `GetNutritionPlanUseCase`.

## Alternativas descartadas

- **Enteros por franja con el resto a las primeras** (1000/3 → `[334, 333,
  333]`): mismo número servido, kcal distintas según la franja; obliga a
  exponer o documentar el orden del resto. Descartada por D2.
- **Persistir kcal por franja** (columna `meal_kcal jsonb` en
  `nutrition_plans`): migración, backfill de planes existentes, y el
  `inputs_hash` de `generate` no cambiaría aunque cambie el reparto. Sin
  fuente clínica que lo justifique (P2). Descartada.
- **Congelar las kcal al servir** (columna `kcal` en `meal_servings`):
  migración y porcentaje incoherente con el objetivo vigente tras regenerar
  (D4). Descartada.
- **Exponer `mealKcal: number[]` paralelo a `mealTimes`**: ningún consumidor
  (C2). Si una pantalla lo pide, se deriva con la misma D2.
- **Calcularlo en el móvil** (`merKcal · servedToday.length / mealsPerDay`):
  el móvil tiene los tres datos, pero el criterio 2 pide que lo devuelva el
  `GET` con e2e, y así la regla de reparto vive en un solo sitio (dominio)
  en vez de copiarse en cada cliente.
- **Añadirlo a `mealsToday` del perfil**: la Home no lo pinta; añadir una
  clave al perfil movería seis listas de claves (#83 C1) sin consumidor.
- **Un spec unitario nuevo para `GetNutritionPlanUseCase`**: el use case solo
  cablea R1 con `servedToday`; los e2e R2-R4 lo cubren de punta a punta con
  la base real. Un unitario con dobles duplicaría esos casos sin vigilar nada
  más.
- **Un fichero e2e nuevo** (`test/nutrition-kcal.e2e-spec.ts`): duplicaría los
  helpers de `test/meals.e2e-spec.ts` y movería el recuento de suites de
  `docs/conventions.md`. Se amplía el existente.
- **Ruta nueva** (`GET …/nutrition-plan/today`): el móvil ya refresca el
  `GET` del plan tras cada servir/deshacer (#98); un campo más en esa
  respuesta no cuesta ninguna llamada.
