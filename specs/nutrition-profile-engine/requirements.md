---
feature: "nutrition-profile-engine"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[nutrition-profile-engine]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de capas.
>
> Fuente: `feature_list.json` #17, `plans/009-alimentacion-ia.md` pasos 1–2 (y la
> mitad no-IA del paso 3), `progress/explore_nutrition-profile-engine.md`.
>
> **Esta spec es autosuficiente.** Toda cifra clínica, tabla, umbral, horario y
> texto de warning está transcrito aquí. Quien implemente **no** debe abrir
> `plans/009-alimentacion-ia.md` ni ningún otro documento para conocer un número:
> si un número no está en esta spec, es un bug de la spec, no una invitación a
> inventarlo. Toda ruta y símbolo es literal.
>
> **Convención de nombre de test**: cada test nombra su requisito como
> `R<n> (nutrition-profile-engine #17): ...`. El módulo `nutrition` es nuevo, pero
> `nutrition-ai-explainer` (#18) escribirá R-ids en los mismos archivos; sin el
> sufijo, C4 de `CHECKPOINTS.md` deja de ser verificable por grep (precedente:
> colisión R1..R13 entre `health-vaccines` #14 y `health-weights` #15).
>
> **Feature clínica.** Un plan de alimentación mal calculado hace daño físico a un
> animal. Los warnings y el disclaimer no son adorno: son el control de seguridad
> (brief §16: las reglas determinísticas calculan, nunca sustituyen al
> veterinario). Ningún requisito de warning puede "simplificarse" ni consolidarse.

---

## Overrides humanos vigentes (fechados) — no revertir

Estas decisiones las cerró el humano el **2026-08-17** y **prevalecen sobre
cualquier otra fuente**, incluido `plans/009-alimentacion-ia.md` y la
`description` de `feature_list.json` #17. Si al implementar aparece una frase
contradictoria en esas fuentes, la frase está obsoleta.

- **OV1 — `kcalPer100g` es obligatorio siempre**, para los cuatro `foodType`
  (`dry`, `wet`, `mixed`, `homemade`). El backend **no** aplica ningún default,
  ni siquiera `dry 350` / `wet 100`. Esos dos valores son **precarga de la UI**,
  fuera del backend. La columna `kcal_per_100g` es `NOT NULL`.
  Esto **anula** la frase *"defaults sugeridos si null: dry 350, wet 100"* del
  plan 009 §Paso 1 y *"defaults dry 350 / wet 100"* de la descripción de #17.
  Siguen vigentes: el rango `80–600` y el criterio `kcalPer100g 900 → 400`.
- **OV2 — gana la edad sobre la pérdida de peso.** Una mascota con
  `ageMonths < 12` conserva su factor de crecimiento (perro 3.0 / 2.0, gato 2.5)
  aunque tenga `bodyCondition >= 7`, su `objective` es `growth`, y **aun así se
  emite el warning `weight_loss_plan`**. Nunca se restringen calorías a un animal
  en crecimiento; el warning manda el caso al veterinario.
- **OV3 — sin `PetTrackingGuard`.** La nutrición es parte de la app de salud
  gratuita (modelo de membresías de #25: *free = salud sin GPS*). Las rutas de
  nutrición llevan solo `PetAccessGuard` (ownership/rol), como el resto del repo.

---

## Constantes clínicas (transcritas — fuente única para la implementación)

### C-1 · RER

```
RER = RER_COEFFICIENT × (pesoBaseKg ^ RER_EXPONENT)
RER_COEFFICIENT = 70
RER_EXPONENT    = 0.75
```

### C-2 · Tabla de factores MER

| Caso | Perro | Gato |
|---|---|---|
| Cachorro `ageMonths < 4` | **3.0** | **2.5** |
| Joven `4 <= ageMonths < 12` | **2.0** | **2.5** |
| Adulto (`ageMonths >= 12`) esterilizado | **1.6** | **1.2** |
| Adulto (`ageMonths >= 12`) entero | **1.8** | **1.4** |
| Pérdida de peso (adulto con `bodyCondition >= 7`) | **1.0** | **0.8** |
| Modificador actividad `high` (solo adultos, no pérdida) | **+0.2** | **+0.1** |
| Modificador actividad `low` (solo adultos, no pérdida) | **−0.2** | **−0.1** |
| Modificador actividad `medium` | **0** | **0** |

Para el gato, cualquier edad `< 12` meses da 2.5 (las dos primeras filas
coinciden). Los modificadores de actividad **no** se aplican a cachorros, ni a
jóvenes, ni a planes de pérdida de peso.

### C-3 · Umbrales de edad (inclusivo/exclusivo, sin solape)

```
AGE_MONTHS_PUPPY_MAX      = 4    // cachorro: ageMonths <  4
AGE_MONTHS_ADULT_MIN      = 12   // joven:    4 <= ageMonths < 12
                                 // adulto:   ageMonths >= 12
AGE_MONTHS_TOO_YOUNG_MAX  = 2    // warning too_young_vet: ageMonths < 2
```

### C-4 · Umbrales de condición corporal (BCS, escala 1–9)

```
BODY_CONDITION_OVERWEIGHT_MIN  = 7   // bodyCondition >= 7
BODY_CONDITION_UNDERWEIGHT_MAX = 3   // bodyCondition <= 3
```

### C-5 · Comidas por día

```
ageMonths <  4                              -> 4 comidas
4 <= ageMonths < 12                         -> 3 comidas
ageMonths >= 12                             -> 2 comidas
ageMonths >= 12 && species='cat' && activityLevel='high' -> 3 comidas
```

### C-6 · Horarios por número de comidas (tabla fija, no algoritmo)

```
2 comidas -> ["07:30", "19:30"]
3 comidas -> ["07:30", "14:00", "19:30"]
4 comidas -> ["07:00", "11:00", "15:00", "19:00"]
```

Formato `"HH:mm"`, 24 h, **hora local del dueño**. #17 no hace ninguna
conversión de zona horaria.

### C-7 · Warnings (código, condición y texto en español)

| # | código | condición | texto |
|---|---|---|---|
| 1 | `weight_loss_plan` | `bodyCondition !== null && bodyCondition >= 7` | "La condición corporal indicada está por encima del rango ideal. Revisa con tu veterinario el peso objetivo y el ritmo de pérdida antes de ajustar la ración." |
| 2 | `underweight_vet` | `bodyCondition !== null && bodyCondition <= 3` | "La condición corporal indicada está por debajo del rango ideal. Consulta a tu veterinario antes de cambiar la alimentación: un peso bajo puede tener causas que este plan no evalúa." |
| 3 | `chronic_disease_vet` | `diseases.length > 0` | "Plan general; tu veterinario debe ajustarlo." |
| 4 | `check_food_allergens` | `allergies.length > 0` | "Registraste alergias alimentarias. Revisa la etiqueta del alimento y confirma con tu veterinario que ninguno de sus ingredientes está en esa lista." |
| 5 | `too_young_vet` | `ageMonths < 2` | "Es una mascota de menos de 2 meses. A esta edad la alimentación la debe indicar tu veterinario; este plan no sustituye esa indicación." |

El texto de `chronic_disease_vet` es **literal del plan 009**. Los otros cuatro
los redactó el `spec_author`; se aprueban (o corrigen) en el gate humano de abajo.
Ninguno de los cinco es diagnóstico y los cinco remiten al veterinario.

El orden `1..5` de esta tabla es el **orden fijo** de la lista `warnings` (R13).

### C-8 · Objetivo (`objective`)

```
if (ageMonths < 12)                                      -> 'growth'
else if (bodyCondition !== null && bodyCondition >= 7)   -> 'weight_loss'
else                                                     -> 'maintenance'
```

### C-9 · Peso base del RER

```
usarTarget = (objective === 'weight_loss') && (targetWeightKg !== null)
pesoBaseKg = usarTarget ? targetWeightKg : weightKg
```

Consecuencia de OV2: como `objective` solo vale `'weight_loss'` en adultos, un
cachorro o joven con BCS >= 7 y `targetWeightKg` informado **calcula igualmente
sobre `weightKg`**. Sustituir el peso por el objetivo en un animal en
crecimiento sería una restricción calórica por la puerta de atrás, que OV2
prohíbe.

### C-10 · Redondeos (fórmula única, sin ambigüedad)

```
round5(x)   = Math.round(x / 5) * 5
rerKcal     = Math.round(RER_COEFFICIENT * Math.pow(pesoBaseKg, RER_EXPONENT))
merCrudo    = RER_COEFFICIENT * Math.pow(pesoBaseKg, RER_EXPONENT) * factor
merKcal     = Math.round(merCrudo)
dailyGrams  = round5(merKcal / (kcalPer100g / 100))
```

Reglas que fija esta fórmula, y que ningún test puede contradecir:

1. `merCrudo` se calcula sobre el **RER sin redondear**, no sobre `rerKcal`.
2. `dailyGrams` se deriva del **`merKcal` ya redondeado**, no del `merCrudo`
   (así el usuario que divida las kcal/día que ve entre los kcal/100 g de su
   pienso llega a los gramos/día que ve).
3. `Math.round` de JavaScript es half-up hacia +∞ (`Math.round(12.5) === 13`).
   Con gramos y kcal siempre positivos, el desempate del `.5` es **half-up**.
4. `GRAMS_ROUNDING_STEP = 5`. La regla es **`round` al múltiplo de 5 más
   cercano**, ni `floor` ni `ceil` (ver R14).

---

## Requisitos funcionales

### Motor determinístico puro (R1–R14)

- **R1**: WHEN se importa
  `backend-pet-tracker/src/modules/nutrition/domain/nutrition-engine.ts`, THE
  SYSTEM SHALL exponer la función pura `computePlan(input: NutritionEngineInput):
  NutritionPlanResult` sin ningún `import` de `@nestjs/*`, `drizzle-orm`, `pg`,
  `zod`, ni acceso a `Date`/`Date.now()`/red/filesystem — el `ageMonths` entra ya
  calculado en el input. Todos los valores numéricos de C-1..C-6 y todos los
  textos de C-7 SHALL vivir como constantes exportadas y nombradas en
  `backend-pet-tracker/src/modules/nutrition/domain/nutrition.constants.ts`
  (`RER_COEFFICIENT`, `RER_EXPONENT`, `MER_FACTOR_*`, `ACTIVITY_MODIFIER_*`,
  `AGE_MONTHS_*`, `BODY_CONDITION_*`, `MEALS_*`, `GRAMS_ROUNDING_STEP`,
  `MEAL_TIMES_BY_COUNT`, `NUTRITION_WARNING_MESSAGES`, `NUTRITION_WARNING_ORDER`);
  `nutrition-engine.ts` SHALL no contener ningún literal numérico de la tabla MER
  ni ninguna cadena `"HH:mm"` ni ningún texto de warning.
  *Test*: `src/modules/nutrition/domain/nutrition-engine.spec.ts` (aserción sobre
  el texto fuente del engine leído con `readFileSync`: no aparece `3.0`, `1.6`,
  `07:30`, etc., y sí `import ... from './nutrition.constants'`) — mismo espíritu
  que la cabecera de `src/pipeline/geofence-eval.ts`.

- **R2**: WHEN `computePlan` recibe un input válido, THE SYSTEM SHALL calcular
  `rerKcal` según C-1 y C-10, usando como `pesoBaseKg` el valor que define C-9
  (`targetWeightKg` solo si `objective === 'weight_loss'` y `targetWeightKg !==
  null`; en cualquier otro caso `weightKg`); IF `bodyCondition >= 7` pero
  `ageMonths < 12`, THEN THE SYSTEM SHALL usar `weightKg` aunque
  `targetWeightKg` esté informado (OV2).
  *Test*: `nutrition-engine.spec.ts`.

- **R3**: WHEN `computePlan` determina el factor MER, THE SYSTEM SHALL aplicar
  exactamente la tabla C-2 con los umbrales de C-3, en este orden de precedencia:
  (1) `ageMonths < 12` ⇒ factor de crecimiento por especie y edad, **sin**
  modificador de actividad y **sin** entrar en pérdida de peso (OV2);
  (2) en otro caso, `bodyCondition !== null && bodyCondition >= 7` ⇒ factor de
  pérdida de peso, **sin** modificador de actividad;
  (3) en otro caso, factor de adulto por especie y `sterilized`, **más** el
  modificador de actividad de C-2.
  IF `sterilized` no es `true` (es `false` o `null`) THEN THE SYSTEM SHALL usar el
  factor de adulto **entero**.
  *Test*: `nutrition-engine.spec.ts` — un caso por fila de C-2 (10 filas) más los
  dos casos negativos del modificador: cachorro `high` ≡ cachorro `medium`, y
  adulto en pérdida `high` ≡ adulto en pérdida `medium`.

- **R4**: WHEN `computePlan` produce `rerKcal`, `merKcal` y `dailyGrams`, THE
  SYSTEM SHALL aplicar exactamente la cadena de C-10: `merKcal` redondeado desde
  el RER **sin** redondear, y `dailyGrams` derivado del `merKcal` **ya**
  redondeado, con `round5(x) = Math.round(x / 5) * 5`. Los tres valores SHALL ser
  enteros de JavaScript (`Number.isInteger` verdadero).
  *Test*: `nutrition-engine.spec.ts` — incluye el **caso discriminante** de la
  regla 2 de C-10 (los cuatro casos ancla de R14 dan el mismo resultado por los
  dos caminos y por tanto no la prueban):
  ```
  input:  { species: 'cat', weightKg: 1.2, targetWeightKg: null, ageMonths: 24,
            sterilized: true, activityLevel: 'medium', bodyCondition: null,
            kcalPer100g: 350, allergies: [], diseases: [] }
  salida: rerKcal 80, merKcal 96, dailyGrams 25
  (RER crudo 80.2572 · factor 1.2 · MER crudo 96.3086 ·
   96 / 3.5 = 27.4286 -> 25 g  ✅   96.3086 / 3.5 = 27.5168 -> 30 g  ❌)
  ```
  Caso sintético (un gato adulto de 1.2 kg no es realista): su único propósito es
  fijar que los gramos se derivan del `merKcal` **redondeado**.

- **R5**: WHEN `computePlan` determina `mealsPerDay`, THE SYSTEM SHALL aplicar
  C-5, incluida la excepción del **gato adulto con `activityLevel: 'high'` ⇒ 3
  comidas**; un perro adulto con `activityLevel: 'high'` SHALL seguir en 2.
  *Test*: `nutrition-engine.spec.ts`.

- **R6**: WHEN `computePlan` determina `mealTimes`, THE SYSTEM SHALL devolver
  exactamente el array de C-6 correspondiente a `mealsPerDay`, en ese orden, como
  strings `"HH:mm"`, sin conversión de zona horaria y sin calcularlos por reparto
  uniforme. `mealTimes.length` SHALL ser siempre igual a `mealsPerDay`.
  *Test*: `nutrition-engine.spec.ts` — los tres casos (2, 3 y 4 comidas).

- **R7**: WHEN `computePlan` determina `objective`, THE SYSTEM SHALL aplicar
  exactamente C-8, con la edad ganando a la condición corporal (OV2): una mascota
  con `ageMonths < 12` SHALL recibir `objective: 'growth'` aunque
  `bodyCondition >= 7`.
  *Test*: `nutrition-engine.spec.ts` — los tres valores más el caso cruzado
  (`ageMonths: 3`, `bodyCondition: 8` ⇒ `'growth'`).

- **R8**: WHEN `bodyCondition !== null && bodyCondition >= 7`, THE SYSTEM SHALL
  incluir en `warnings` el elemento
  `{ code: 'weight_loss_plan', message: <texto 1 de C-7> }`, **también** cuando
  `ageMonths < 12` (OV2); IF `bodyCondition` es `null` o `< 7` THEN THE SYSTEM
  SHALL no incluir ningún elemento con `code: 'weight_loss_plan'`.
  *Test*: `nutrition-engine.spec.ts` — caso positivo, caso cachorro-con-BCS-8 y
  **aserción anti-vacío** (`bodyCondition: 5` y `bodyCondition: null` ⇒ el array
  no contiene el código).

- **R9**: WHEN `bodyCondition !== null && bodyCondition <= 3`, THE SYSTEM SHALL
  incluir `{ code: 'underweight_vet', message: <texto 2 de C-7> }`; IF
  `bodyCondition` es `null` o `> 3` THEN THE SYSTEM SHALL no incluirlo.
  *Test*: `nutrition-engine.spec.ts` — positivo + **anti-vacío**
  (`bodyCondition: 5` y `null`).

- **R10**: WHEN `diseases.length > 0`, THE SYSTEM SHALL incluir
  `{ code: 'chronic_disease_vet', message: 'Plan general; tu veterinario debe
  ajustarlo.' }`; IF `diseases` está vacío THEN THE SYSTEM SHALL no incluirlo.
  *Test*: `nutrition-engine.spec.ts` — positivo + **anti-vacío** (`diseases: []`).

- **R11**: WHEN `allergies.length > 0`, THE SYSTEM SHALL incluir
  `{ code: 'check_food_allergens', message: <texto 4 de C-7> }`; IF `allergies`
  está vacío THEN THE SYSTEM SHALL no incluirlo.
  *Test*: `nutrition-engine.spec.ts` — positivo + **anti-vacío** (`allergies: []`).

- **R12**: WHEN `ageMonths < 2`, THE SYSTEM SHALL incluir
  `{ code: 'too_young_vet', message: <texto 5 de C-7> }`; IF `ageMonths >= 2`
  THEN THE SYSTEM SHALL no incluirlo. En concreto: `ageMonths: 1` ⇒ presente,
  `ageMonths: 2` ⇒ ausente (umbral exclusivo).
  *Test*: `nutrition-engine.spec.ts` — positivo, frontera `=== 2` y
  **anti-vacío** (`ageMonths: 24`).

- **R13**: WHEN `computePlan` construye `warnings`, THE SYSTEM SHALL devolver un
  array de objetos `{ code, message }` **acumulable** (todas las condiciones que
  se cumplan producen su elemento) y ordenado siempre según
  `NUTRITION_WARNING_ORDER` = `['weight_loss_plan', 'underweight_vet',
  'chronic_disease_vet', 'check_food_allergens', 'too_young_vet']`,
  independientemente del orden en que se evalúen; `warnings` SHALL ser `[]`
  (array vacío, nunca `null`) cuando no se cumple ninguna condición.
  *Test*: `nutrition-engine.spec.ts` — un caso con tres warnings simultáneos
  (`bodyCondition: 8`, `diseases: ['diabetes']`, `allergies: ['pollo']`) que
  asevera el array **completo y en orden**, y un caso sin ninguno que asevera
  `warnings` `toEqual([])`.

- **R14**: WHEN se ejecuta la suite del motor, THE SYSTEM SHALL reproducir los
  **cuatro** casos ancla de abajo con sus valores exactos. Los casos 1 y 2 son un
  **par mínimo indivisible**: el caso 1 elimina `floor` (302.57 g → 305) y el
  caso 2 elimina `ceil` (62.29 g → 60); solo `round` sobrevive a los dos. **Ninguno
  de los dos puede consolidarse con el otro, reescribirse a un valor aproximado ni
  caerse de la suite** — juntos son la única prueba de la regla de redondeo de
  C-10.4, y por separado no prueban nada.

  **Caso 1 — perro adulto esterilizado, ancla `floor`**
  ```
  input:  { species: 'dog', weightKg: 20, targetWeightKg: null, ageMonths: 60,
            sterilized: true, activityLevel: 'medium', bodyCondition: null,
            kcalPer100g: 350, allergies: [], diseases: [] }
  salida: rerKcal 662, merKcal 1059, dailyGrams 305, mealsPerDay 2,
          mealTimes ['07:30','19:30'], objective 'maintenance', warnings []
  (RER crudo 662.0191 · factor 1.6 · MER crudo 1059.2306 · gramos crudos 302.5714)
  ```

  **Caso 2 — gato adulto esterilizado, ancla `ceil`**
  ```
  input:  { species: 'cat', weightKg: 4, targetWeightKg: null, ageMonths: 36,
            sterilized: true, activityLevel: 'low', bodyCondition: null,
            kcalPer100g: 350, allergies: [], diseases: [] }
  salida: rerKcal 198, merKcal 218, dailyGrams 60, mealsPerDay 2,
          mealTimes ['07:30','19:30'], objective 'maintenance', warnings []
  (RER crudo 197.9899 · factor 1.2 − 0.1 = 1.1 · MER crudo 217.7889 · gramos crudos 62.2857)
  ```
  **`sterilized: true` es load-bearing en este caso**: un gato entero daría
  1.4 − 0.1 = 1.3 ⇒ 257 kcal, no 218. La `description` de `feature_list.json` #17
  lo omite; el input correcto es el de arriba.

  **Caso 3 — cachorro de 3 meses**
  ```
  input:  { species: 'dog', weightKg: 5, targetWeightKg: null, ageMonths: 3,
            sterilized: false, activityLevel: 'medium', bodyCondition: null,
            kcalPer100g: 350, allergies: [], diseases: [] }
  salida: rerKcal 234, merKcal 702, dailyGrams 200, mealsPerDay 4,
          mealTimes ['07:00','11:00','15:00','19:00'], objective 'growth',
          warnings []
  (RER crudo 234.0591 · factor 3.0 · MER crudo 702.1773 · gramos crudos 200.5714)
  ```
  `warnings` vacío porque `ageMonths: 3 >= 2`. El mismo input con
  `activityLevel: 'high'` SHALL dar **idénticos** `merKcal` y `dailyGrams`
  (prueba de que el modificador de actividad no toca a cachorros, R3).

  **Caso 4 — perro adulto en pérdida de peso**
  ```
  input:  { species: 'dog', weightKg: 30, targetWeightKg: 25, ageMonths: 72,
            sterilized: true, activityLevel: 'medium', bodyCondition: 8,
            kcalPer100g: 350, allergies: [], diseases: [] }
  salida: rerKcal 783, merKcal 783, dailyGrams 225, mealsPerDay 2,
          mealTimes ['07:30','19:30'], objective 'weight_loss',
          warnings [{ code: 'weight_loss_plan', message: <texto 1 de C-7> }]
  (RER sobre 25 kg = 782.6238 · factor 1.0 · gramos crudos 223.7143)
  ```
  El mismo input con `activityLevel: 'high'` SHALL dar **idénticos** `merKcal` y
  `dailyGrams` (prueba de que el modificador no toca a los planes de pérdida, R3).

  *Test*: `src/modules/nutrition/domain/nutrition-engine.spec.ts::R14
  (nutrition-profile-engine #17): los cuatro casos ancla con valores exactos`.

### Persistencia (R15)

- **R15**: WHEN se aplican las migraciones Drizzle sobre una base al día, THE
  SYSTEM SHALL crear en un **archivo de migración nuevo** (`0013_*.sql`, generado
  con `pnpm -C backend-pet-tracker run db:generate`, sin editar ninguna migración
  ya existente) las dos tablas siguientes, declaradas en
  `backend-pet-tracker/src/db/schema/nutrition.schema.ts` y re-exportadas desde
  `backend-pet-tracker/src/db/schema/index.ts`:

  `nutrition_profiles` (1:1 con la mascota)

  | columna | tipo | null |
  |---|---|---|
  | `pet_id` | `uuid` PRIMARY KEY, FK → `pets(id)` ON DELETE CASCADE | NOT NULL |
  | `activity_level` | `varchar(10)` + CHECK `nutrition_profiles_activity_level_check` (`in ('low','medium','high')`) | NOT NULL |
  | `body_condition` | `integer` + CHECK `nutrition_profiles_body_condition_check` (`between 1 and 9`) | NULL |
  | `target_weight_kg` | `numeric(5,2)` | NULL |
  | `food_type` | `varchar(10)` + CHECK `nutrition_profiles_food_type_check` (`in ('dry','wet','mixed','homemade')`) | NOT NULL |
  | `kcal_per_100g` | `numeric(6,1)` + CHECK `nutrition_profiles_kcal_per_100g_check` (`between 80 and 600`) | NOT NULL (OV1) |
  | `allergies` | `jsonb` DEFAULT `'[]'` | NOT NULL |
  | `diseases` | `jsonb` DEFAULT `'[]'` | NOT NULL |
  | `created_at` | `timestamptz` DEFAULT now() | NOT NULL |
  | `updated_at` | `timestamptz` DEFAULT now() | NOT NULL |

  `nutrition_plans` (historial)

  | columna | tipo | null |
  |---|---|---|
  | `id` | `uuid` PRIMARY KEY (UUIDv7 generado en la app con `uuidv7()`) | NOT NULL |
  | `pet_id` | `uuid` FK → `pets(id)` ON DELETE CASCADE | NOT NULL |
  | `rer_kcal` | `integer` | NOT NULL |
  | `mer_kcal` | `integer` | NOT NULL |
  | `daily_grams` | `integer` | NOT NULL |
  | `meals_per_day` | `integer` + CHECK `nutrition_plans_meals_per_day_check` (`between 1 and 6`) | NOT NULL |
  | `meal_times` | `jsonb` (array de `"HH:mm"`) | NOT NULL |
  | `objective` | `varchar(20)` + CHECK `nutrition_plans_objective_check` (`in ('maintenance','weight_loss','growth')`) | NOT NULL |
  | `warnings` | `jsonb` DEFAULT `'[]'` (array de `{code, message}`) | NOT NULL |
  | `ai_explanation` | `text` | NULL (siempre `null` en #17, R26) |
  | `inputs_hash` | `char(64)` (sha256 hex) | NOT NULL |
  | `generated_at` | `timestamptz` DEFAULT now() | NOT NULL |

  Índice: `nutrition_plans_pet_id_generated_at_idx` sobre
  `(pet_id, generated_at DESC)` (regla de historial de `docs/data-model.md`).
  `nutrition_profiles` **no** lleva índice adicional: su PK ya cubre la FK.
  **No** SHALL existir `UNIQUE (pet_id, inputs_hash)` (ver R21).
  *Test*: `src/db/schema/nutrition.schema.spec.ts` (`getTableConfig`: columnas,
  CHECKs por nombre, índice; y que la migración que contiene
  `CREATE TABLE "nutrition_profiles"` no contiene `ALTER TABLE "pets"` ni
  `ALTER TABLE "weights"`).

### Perfil nutricional (R16–R18)

- **R16**: WHEN un usuario con rol `owner` envía
  `PUT /v1/pets/:petId/nutrition-profile` con un body válido, THE SYSTEM SHALL
  hacer un **upsert de reemplazo total** sobre `nutrition_profiles`
  (`ON CONFLICT (pet_id) DO UPDATE` de todas las columnas del body y refresco de
  `updated_at`) — nunca un merge parcial: una clave ausente en el body borra el
  valor anterior — y responder `200` con exactamente las claves
  `{petId, activityLevel, bodyCondition, targetWeightKg, foodType, kcalPer100g,
  allergies, diseases, updatedAt}`, donde `targetWeightKg` es `number | null`,
  `kcalPer100g` es un `number` (nunca el string del driver `pg`, R27),
  `bodyCondition` es `number | null`, `allergies`/`diseases` son `string[]` y
  `updatedAt` es ISO-8601. El status SHALL ser `200` tanto en el primer PUT
  (creación) como en los siguientes (actualización).
  *Test*: `test/nutrition.e2e-spec.ts`.

- **R17**: WHEN un miembro activo de cualquier rol solicita
  `GET /v1/pets/:petId/nutrition-profile` y la mascota tiene perfil, THE SYSTEM
  SHALL responder `200` con el mismo shape de R16; IF la mascota no tiene perfil
  THEN THE SYSTEM SHALL responder `404` con el cuerpo
  `{statusCode: 404, code: 'NUTRITION_PROFILE_NOT_FOUND', message: <texto>}`.
  *Test*: `test/nutrition.e2e-spec.ts`.

- **R18**: IF el body del `PUT` incluye `kcalPer100g` ausente, no numérico o fuera
  de `[KCAL_PER_100G_MIN = 80, KCAL_PER_100G_MAX = 600]` (**en concreto:
  `kcalPer100g: 900` ⇒ `400`**), un `activityLevel` fuera de
  `('low','medium','high')`, un `foodType` fuera de
  `('dry','wet','mixed','homemade')`, un `bodyCondition` no entero o fuera de
  `1..9`, un `targetWeightKg <= 0` o `> 999.99`, un elemento no-string en
  `allergies`/`diseases`, o **cualquier clave desconocida** (`z.strictObject`),
  THEN THE SYSTEM SHALL responder `400` con el cuerpo
  `{statusCode, message: 'Validation failed', errors: [{path, message}]}` sin
  escribir ninguna fila. `kcalPer100g` SHALL ser obligatorio para los cuatro
  `foodType` y el backend SHALL **no** aplicar ningún default (OV1): un PUT con
  `foodType: 'dry'` y sin `kcalPer100g` SHALL responder `400`, no `200` con 350.
  `allergies` y `diseases` SHALL ser opcionales con `.default([])`.
  Las constantes `KCAL_PER_100G_MIN` y `KCAL_PER_100G_MAX` SHALL exportarse desde
  `src/modules/nutrition/application/dto/nutrition-profile.dto.ts`.
  *Test*: `test/nutrition.e2e-spec.ts` (incluye el caso `900 → 400` y el caso
  `dry` sin `kcalPer100g` → `400`).

### Generación del plan (R19–R24)

- **R19**: WHEN un usuario con rol `owner` envía
  `POST /v1/pets/:petId/nutrition-plan/generate` y la mascota tiene perfil y
  `current_weight_kg` no nulo, THE SYSTEM SHALL construir el input del motor
  combinando la mascota y el perfil así:
  ```
  species        <- pets.species
  weightKg       <- pets.current_weight_kg           (Number, R27)
  targetWeightKg <- nutrition_profiles.target_weight_kg (Number | null, R27)
  ageMonths      <- calculateAgeMonths(pet, now) de
                    '@/modules/pets/domain/entities/pet.entity'   (el reloj lo
                    pasa el use-case, nunca el motor)
  sterilized     <- pets.sterilized === true
  activityLevel  <- nutrition_profiles.activity_level
  bodyCondition  <- nutrition_profiles.body_condition   (nunca weights.body_condition)
  kcalPer100g    <- nutrition_profiles.kcal_per_100g  (Number, R27)
  allergies      <- nutrition_profiles.allergies
  diseases       <- nutrition_profiles.diseases
  ```
  ejecutar `computePlan`, y responder `200` con exactamente las claves
  `{id, petId, rerKcal, merKcal, dailyGrams, mealsPerDay, mealTimes, objective,
  warnings, aiExplanation, generatedAt}`, donde `warnings` es
  `{code, message}[]`, `aiExplanation` es `null` (R26) y `generatedAt` es
  ISO-8601. La respuesta SHALL **no** incluir `inputsHash`. El status SHALL ser
  `200` tanto cuando se inserta fila nueva como en el hash hit de R21.
  *Test*: `test/nutrition.e2e-spec.ts` — con una mascota de 20 kg, adulta,
  esterilizada y perfil `medium`/`dry`/`350`, la respuesta SHALL traer
  `merKcal: 1059` y `dailyGrams: 305` (el caso ancla 1 recorrido end-to-end).

- **R20**: WHEN el sistema calcula `inputs_hash`, THE SYSTEM SHALL producir el
  sha256 hexadecimal (`createHash('sha256').update(json).digest('hex')` de
  `node:crypto`, como `src/modules/auth/application/verification-token.ts`) de
  `JSON.stringify` de un objeto construido con **estas diez claves, escritas a
  mano en este orden exacto**:
  ```
  1. species          string 'dog' | 'cat'
  2. weightKg         number
  3. targetWeightKg   number | null   (nunca undefined)
  4. ageMonths        number entero
  5. sterilized       boolean
  6. activityLevel    string
  7. bodyCondition    number | null   (nunca undefined)
  8. kcalPer100g      number
  9. allergies        string[] ordenado con .sort() ascendente
  10. diseases        string[] ordenado con .sort() ascendente
  ```
  Normalización obligatoria antes de serializar: todo numérico pasa por
  `Number(...)` (nunca el string del driver `pg`, R27); todo opcional ausente se
  normaliza a `null` explícito (nunca `undefined`, que `JSON.stringify` elimina y
  colapsaría dos inputs distintos); `allergies` y `diseases` se ordenan
  alfabéticamente porque el mismo conjunto de alérgenos en otro orden **no** es
  un input distinto. El input canónico SHALL ser exactamente el input del motor —
  ni un campo más ni uno menos —, de forma que `mismo hash ⇒ mismo output del
  motor` sea una equivalencia real. `ageMonths` **entra** en el hash: un plan que
  caduca al cambiar de mes es preferible a servir calorías de cachorro a un perro
  adulto como si fueran frescas.
  *Test*: `src/modules/nutrition/application/nutrition-input-hash.spec.ts` — dos
  objetos con las mismas claves en distinto orden de escritura y con
  `allergies: ['pollo','res']` vs `['res','pollo']` SHALL producir el **mismo**
  hash; cambiar cualquiera de las diez claves SHALL producir uno **distinto**
  (una aserción por clave).

- **R21**: WHEN llega un `generate` y el **último** plan de esa mascota
  (`ORDER BY generated_at DESC, id DESC LIMIT 1`) tiene el mismo `inputs_hash`
  que el recién calculado, THE SYSTEM SHALL devolver ese plan existente sin
  insertar ninguna fila nueva; IF el hash difiere o no hay ningún plan previo
  THEN THE SYSTEM SHALL insertar una fila nueva. La comparación SHALL ser contra
  el **último** plan, no contra el historial completo, y **no** SHALL existir
  restricción `UNIQUE (pet_id, inputs_hash)`.
  *Test*: `test/nutrition.e2e-spec.ts` — dos `generate` consecutivos sin cambios
  devuelven el **mismo `id`** y `SELECT count(*) FROM nutrition_plans WHERE
  pet_id = ...` sigue en `1`; tras un `PUT` de perfil que cambia `kcalPer100g`,
  el tercer `generate` devuelve un `id` **distinto** y el count sube a `2`.

- **R22**: IF llega un `generate` sobre una mascota **sin fila en
  `nutrition_profiles`**, THEN THE SYSTEM SHALL responder `422` con el cuerpo
  `{statusCode: 422, code: 'NUTRITION_PROFILE_REQUIRED', message: <texto>}`
  (`UnprocessableEntityException` de `@nestjs/common`) sin insertar ninguna fila
  en `nutrition_plans` y sin ejecutar el motor; IF la mascota **sí** tiene perfil
  THEN THE SYSTEM SHALL no responder nunca ese código.
  *Test*: `test/nutrition.e2e-spec.ts` — caso positivo (`422` + count de
  `nutrition_plans` en `0`) y **aserción anti-vacío**: con perfil creado, el
  cuerpo de la respuesta `200` no contiene `NUTRITION_PROFILE_REQUIRED`.

- **R23**: IF llega un `generate` sobre una mascota con perfil pero con
  `pets.current_weight_kg IS NULL`, THEN THE SYSTEM SHALL responder `422` con
  `{statusCode: 422, code: 'PET_WEIGHT_REQUIRED', message: <texto>}` sin insertar
  fila y sin ejecutar el motor; IF la mascota tiene peso THEN THE SYSTEM SHALL no
  emitir nunca ese código. (Toda mascota nace sin peso: `POST/PATCH /v1/pets` ya
  no acepta `weightKg` desde #15, el peso solo llega por
  `POST /v1/pets/:petId/weights`.) El `422` de R22 SHALL evaluarse **antes** que
  este: sin perfil y sin peso ⇒ `NUTRITION_PROFILE_REQUIRED`.
  *Test*: `test/nutrition.e2e-spec.ts` — positivo, precedencia sobre R22 y
  **aserción anti-vacío** (con peso registrado, el código no aparece).

- **R24**: WHEN un miembro activo de cualquier rol solicita
  `GET /v1/pets/:petId/nutrition-plan` y existe al menos un plan, THE SYSTEM
  SHALL responder `200` con el **último** plan (`ORDER BY generated_at DESC,
  id DESC LIMIT 1`) en el shape de R19; IF no existe ninguno THEN THE SYSTEM
  SHALL responder `404` con
  `{statusCode: 404, code: 'NUTRITION_PLAN_NOT_FOUND', message: <texto>}`.
  *Test*: `test/nutrition.e2e-spec.ts`.

### Transversal (R25–R27)

- **R25**: IF `:petId` no existe, es sintácticamente inválido o no tiene
  membresía `active` para el actor, THEN THE SYSTEM SHALL responder `404`
  genérico mediante el `PetAccessGuard` existente
  (`@/modules/pets/infrastructure/guards/pet-access.guard`), antes de leer o
  escribir nada de nutrición, en las **cuatro** rutas; WHEN el actor es miembro
  activo con `role != 'owner'`, THE SYSTEM SHALL responder `403` en
  `PUT /v1/pets/:petId/nutrition-profile` y en
  `POST /v1/pets/:petId/nutrition-plan/generate` (ambas con
  `@RequirePetRole('owner')`) y `200`/`404` según R17/R24 en los dos `GET` (sin
  decorador de rol). El `404` SHALL preceder siempre al `403`. Las rutas de
  nutrición SHALL **no** llevar `PetTrackingGuard` ni exigir suscripción de
  dispositivo (OV3): un usuario sin collar ni suscripción SHALL poder crear su
  perfil y generar su plan.
  *Test*: `test/nutrition.e2e-spec.ts` — usuario B sobre mascota de A ⇒ `404` en
  las cuatro rutas; miembro `viewer` ⇒ `403` en las dos de escritura y `200` en
  las de lectura; mascota **sin** `device_subscriptions` activa ⇒ `200` en
  `generate` (nunca `402 DEVICE_SUBSCRIPTION_REQUIRED`).

- **R26**: WHILE #17 esté vigente, THE SYSTEM SHALL persistir y devolver
  `ai_explanation` / `aiExplanation` siempre `null`, y el árbol
  `backend-pet-tracker/` SHALL no contener la dependencia `openai` en
  `package.json`, ni ninguna variable de entorno `OPENAI_*` en `.env.example`,
  `docs/conventions.md` ni el código, ni ningún literal `gpt-`.
  *Test*: `test/nutrition.e2e-spec.ts` (`aiExplanation` es `null` en `generate` y
  en `GET`) + `src/modules/nutrition/nutrition-scope.spec.ts` (lee
  `backend-pet-tracker/package.json` y `.env.example`: sin `openai`, sin
  `OPENAI_`).

- **R27**: WHEN el repositorio Drizzle lee `nutrition_profiles`, THE SYSTEM SHALL
  convertir `kcal_per_100g` y `target_weight_kg` de `string` a `number` con
  `Number(...)` en el borde de infraestructura (el driver `pg` devuelve `numeric`
  como string; precedente: `pet.drizzle.repository.ts` con
  `pets.current_weight_kg`), y SHALL escribirlos con `String(...)`; el motor y la
  función de hash SHALL recibir siempre `number`.
  *Test*: `test/nutrition.e2e-spec.ts` — `typeof body.kcalPer100g === 'number'` y
  `typeof body.targetWeightKg === 'number'` en el `GET` de perfil tras un `PUT`.

---

## Fuera de alcance

- **Toda la IA** — es `nutrition-ai-explainer` (#18): `ai-explainer.ts`, el SDK
  `openai`, las env `OPENAI_ENABLED`/`OPENAI_MODEL`, el system prompt y la
  degradación con clave ausente. La columna `ai_explanation` **sí** se crea en la
  migración de #17 (nace `NULL`) para que #18 no necesite migración propia —
  mismo criterio ya usado con `alert_events.status`.
- **Pantallas móviles** (`plans/009` paso 4, `apps/mobile/`): este repo es solo
  backend y no existe app móvil.
- **Catálogo de alimentos comerciales** (post-MVP): `kcalPer100g` sigue siendo
  manual.
- **Defaults de `kcalPer100g` en el backend** (OV1): `dry 350` / `wet 100` son
  precarga de UI. El backend no inventa energía de un alimento que no conoce.
- **`weights.body_condition` como fuente del BCS**: #17 lee exclusivamente
  `nutrition_profiles.body_condition`. Consecuencia a asumir: si el perfil no
  trae `bodyCondition`, el motor **no** puede emitir `weight_loss_plan` ni
  `underweight_vet` y usa el factor de adulto por esterilización. Unificar ambas
  fuentes queda para una feature futura (ver [[design]] D8).
- **`PATCH` y `DELETE` de perfil o de planes**, e historización más allá de
  conservar las filas anteriores de `nutrition_plans`.
- **Auditoría (`AuditLogger`)** de la creación de perfil o de plan: ni el plan 009
  ni los criterios de aceptación de #17 la piden. Ver [[design]] D11.
- **Exponer `inputsHash` en la respuesta HTTP**: es un detalle interno de
  idempotencia; el cliente no lo necesita y los tests lo verifican por `id` y por
  count de filas.
- **Modificar cualquier contrato existente**: `PetProfileResponse`,
  `pets.current_weight_kg`, `weights`, el `PetAccessGuard` o el
  `PetTrackingGuard` no se tocan.

---

## Preguntas abiertas para el humano (cerradas en el gate — 2026-08-17)

Las tres se resolvieron **confirmando la propuesta de esta spec**; el cuerpo de
la spec no cambia. Registradas aquí para que Codex no las re-abra.

- [x] **P1 — Textos de warning: aprobados tal cual.** Los cuatro textos
  redactados por el `spec_author` (C-7, filas 1, 2, 4 y 5) quedan como
  constantes nombradas junto a los factores MER. El de `chronic_disease_vet`
  sigue siendo el literal del plan 009. Cambiarlos más adelante es decisión de
  producto, no del implementador.
- [x] **P2 — `pets.sterilized` null ⇒ factor de adulto entero** (1.8 perro /
  1.4 gato), como propone R3. Se prefiere el error hacia el exceso (~12 % de
  sobrealimentación a una mascota esterilizada de estado desconocido) antes que
  subalimentar a la entera. No se añade ningún camino de error nuevo por este
  caso: el dato ausente **no** bloquea el generate.
- [x] **P3 — `targetWeightKg` mayor que `weightKg`: se acepta tal cual.** El
  motor no juzga el objetivo; calcula sobre lo que recibe según C-9. No hay
  validación cruzada perfil↔peso. El warning `weight_loss_plan` ya remite el
  caso al veterinario.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
