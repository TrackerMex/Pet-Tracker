---
feature: "nutrition-profile-engine"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[nutrition-profile-engine]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Esta spec está escrita para ser **autosuficiente**: quien implemente no tiene
> acceso a la conversación que la originó ni lee `plans/`. Toda ruta, símbolo,
> nombre de tabla y de columna que aparece aquí es literal.
>
> **Deriva de rutas del plan 009**: el plan habla de `apps/api/src/...` (un
> monorepo que nunca existió aquí) y de actualizar "OpenAPI". La ruta real es
> `backend-pet-tracker/src/...` y **no hay ningún artefacto OpenAPI en el repo**.
> Ignorar ambas referencias.

## Origen de las decisiones

- **Cerradas por el humano el 2026-08-17** (OV1, OV2, OV3 de [[requirements]]):
  D3+D17 (gana la edad), D15 (`kcalPer100g` obligatorio, sin defaults en
  backend), D12 (sin `PetTrackingGuard`). **No se re-abren.**
- **Cerradas por el `spec_author`** adoptando la recomendación de
  `progress/explore_nutrition-profile-engine.md` §5: D1, D2, D4, D5, D6, D7, D8,
  D9, D10, D11, D13, D14, D16, D18, D19. Las que se documentan abajo son las que
  tienen consecuencia visible en el código; el resto se transcribió directamente
  a las constantes C-1..C-10 de [[requirements]].
- **Derivadas** de las anteriores: D-A (peso base del RER en crecimiento),
  D-B (`sterilized: null`). Ninguna recomendación del explorer se descartó.

---

## Decisiones técnicas

### D1 — El motor vive en `domain/`, con sus constantes al lado (R1)

```
backend-pet-tracker/src/modules/nutrition/domain/nutrition-engine.ts
backend-pet-tracker/src/modules/nutrition/domain/nutrition.constants.ts
```

`src/pipeline/` es el hogar de la lógica pura que consumen los **workers**
(ingesta, geocercas, actividad) y su justificación escrita
(`docs/architecture.md` §"Adaptación local") es la portabilidad a Lambdas. El
motor de nutrición lo consume un use-case HTTP síncrono, y
`feature_list.json` #17 `files_affected` apunta a `src/modules/nutrition/`.
`docs/architecture.md` define la capa `domain` exactamente como *"sin imports de
ningún framework, ORM ni librería de infraestructura"*, que es la propiedad que
se quiere.

El contrato de pureza es el mismo que la cabecera de
`backend-pet-tracker/src/pipeline/geofence-eval.ts`: *"sin imports de
NestJS/SDK/ORM, sin reloj y sin red — los umbrales entran por `./constants`,
nunca como literal"*. Copiar esa cabecera adaptada. `ageMonths` entra ya
calculado en el input (el use-case llama a `calculateAgeMonths(pet, new Date())`),
para que el motor siga sin reloj.

Tipos exportados por `nutrition-engine.ts`:

```
export interface NutritionEngineInput {
  species: 'dog' | 'cat';
  weightKg: number;
  targetWeightKg: number | null;
  ageMonths: number;
  sterilized: boolean;
  activityLevel: 'low' | 'medium' | 'high';
  bodyCondition: number | null;
  kcalPer100g: number;
  allergies: string[];
  diseases: string[];
}

export type NutritionObjective = 'maintenance' | 'weight_loss' | 'growth';
export type NutritionWarningCode =
  | 'weight_loss_plan' | 'underweight_vet' | 'chronic_disease_vet'
  | 'check_food_allergens' | 'too_young_vet';

export interface NutritionWarning { code: NutritionWarningCode; message: string }

export interface NutritionPlanResult {
  rerKcal: number;
  merKcal: number;
  dailyGrams: number;
  mealsPerDay: number;
  mealTimes: string[];
  objective: NutritionObjective;
  warnings: NutritionWarning[];
}

export function computePlan(input: NutritionEngineInput): NutritionPlanResult;
```

Nombres exactos de las constantes de `nutrition.constants.ts` (R1 asevera que el
engine no lleva literales):

```
RER_COEFFICIENT = 70
RER_EXPONENT = 0.75
GRAMS_ROUNDING_STEP = 5

MER_FACTOR_PUPPY_DOG = 3.0
MER_FACTOR_YOUNG_DOG = 2.0
MER_FACTOR_GROWTH_CAT = 2.5          // cubre <4 y 4..11 meses: el plan da 2.5 en ambas filas
MER_FACTOR_ADULT_DOG_STERILIZED = 1.6
MER_FACTOR_ADULT_DOG_INTACT = 1.8
MER_FACTOR_ADULT_CAT_STERILIZED = 1.2
MER_FACTOR_ADULT_CAT_INTACT = 1.4
MER_FACTOR_WEIGHT_LOSS_DOG = 1.0
MER_FACTOR_WEIGHT_LOSS_CAT = 0.8
ACTIVITY_MODIFIER_DOG_HIGH = 0.2
ACTIVITY_MODIFIER_DOG_LOW = -0.2
ACTIVITY_MODIFIER_CAT_HIGH = 0.1
ACTIVITY_MODIFIER_CAT_LOW = -0.1

AGE_MONTHS_PUPPY_MAX = 4
AGE_MONTHS_ADULT_MIN = 12
AGE_MONTHS_TOO_YOUNG_MAX = 2
BODY_CONDITION_OVERWEIGHT_MIN = 7
BODY_CONDITION_UNDERWEIGHT_MAX = 3

MEALS_PUPPY = 4
MEALS_YOUNG = 3
MEALS_ADULT = 2
MEALS_ADULT_CAT_HIGH_ACTIVITY = 3

MEAL_TIMES_BY_COUNT: Readonly<Record<2 | 3 | 4, readonly string[]>>
NUTRITION_WARNING_ORDER: readonly NutritionWarningCode[]
NUTRITION_WARNING_MESSAGES: Readonly<Record<NutritionWarningCode, string>>
```

El plan 009 pide *"documentar en JSDoc con estas mismas cifras"*. Ese JSDoc va en
**`nutrition.constants.ts`**, encima de cada bloque de constantes, no en
`nutrition-engine.ts`: R1 asevera por `readFileSync` que el fuente del engine no
contiene ningún literal de C-1..C-10, y esa lectura es texto plano — un JSDoc con
`3.0` o `07:30` dentro del engine **rompe el test de R1**. El JSDoc de
`computePlan` documenta el algoritmo y remite a las constantes por nombre
(*"factor MER según `MER_FACTOR_*`, ver `nutrition.constants.ts`"*), sin
transcribir cifras.

### D2 — Pseudocódigo normativo del motor (R2, R3, R4, R5, R6, R7, R13)

Esta es la única definición del orden de operaciones. Cualquier refactor debe
preservarla observable a observable.

```
function computePlan(input):
  # 1. objetivo (C-8) — se decide ANTES del peso base y del factor
  if input.ageMonths < AGE_MONTHS_ADULT_MIN:            objective = 'growth'
  elif input.bodyCondition != null
       and input.bodyCondition >= BODY_CONDITION_OVERWEIGHT_MIN:
                                                        objective = 'weight_loss'
  else:                                                 objective = 'maintenance'

  # 2. peso base del RER (C-9)
  baseWeightKg = (objective == 'weight_loss' and input.targetWeightKg != null)
                 ? input.targetWeightKg
                 : input.weightKg

  # 3. RER (C-1)
  rerRaw  = RER_COEFFICIENT * Math.pow(baseWeightKg, RER_EXPONENT)
  rerKcal = Math.round(rerRaw)

  # 4. factor MER (C-2) — precedencia: crecimiento > pérdida > adulto+actividad
  if objective == 'growth':
     if input.species == 'dog':
        factor = (input.ageMonths < AGE_MONTHS_PUPPY_MAX)
                 ? MER_FACTOR_PUPPY_DOG : MER_FACTOR_YOUNG_DOG
     else:
        factor = MER_FACTOR_GROWTH_CAT
  elif objective == 'weight_loss':
     factor = (input.species == 'dog')
              ? MER_FACTOR_WEIGHT_LOSS_DOG : MER_FACTOR_WEIGHT_LOSS_CAT
  else:
     base = input.species == 'dog'
            ? (input.sterilized ? MER_FACTOR_ADULT_DOG_STERILIZED
                                : MER_FACTOR_ADULT_DOG_INTACT)
            : (input.sterilized ? MER_FACTOR_ADULT_CAT_STERILIZED
                                : MER_FACTOR_ADULT_CAT_INTACT)
     modifier = 0
     if input.activityLevel == 'high':
        modifier = (input.species == 'dog') ? ACTIVITY_MODIFIER_DOG_HIGH
                                            : ACTIVITY_MODIFIER_CAT_HIGH
     elif input.activityLevel == 'low':
        modifier = (input.species == 'dog') ? ACTIVITY_MODIFIER_DOG_LOW
                                            : ACTIVITY_MODIFIER_CAT_LOW
     factor = base + modifier

  # 5. MER y gramos (C-10) — merKcal desde rerRaw, gramos desde merKcal
  merKcal    = Math.round(rerRaw * factor)
  dailyGrams = Math.round((merKcal / (input.kcalPer100g / 100)) / GRAMS_ROUNDING_STEP)
               * GRAMS_ROUNDING_STEP

  # 6. comidas y horarios (C-5, C-6)
  if   input.ageMonths <  AGE_MONTHS_PUPPY_MAX: mealsPerDay = MEALS_PUPPY
  elif input.ageMonths <  AGE_MONTHS_ADULT_MIN: mealsPerDay = MEALS_YOUNG
  elif input.species == 'cat' and input.activityLevel == 'high':
                                                mealsPerDay = MEALS_ADULT_CAT_HIGH_ACTIVITY
  else:                                         mealsPerDay = MEALS_ADULT
  mealTimes = [...MEAL_TIMES_BY_COUNT[mealsPerDay]]

  # 7. warnings (C-7) — recorrer NUTRITION_WARNING_ORDER, no el orden de las condiciones
  warnings = []
  for code in NUTRITION_WARNING_ORDER:
     if conditionHolds(code, input):
        warnings.push({ code, message: NUTRITION_WARNING_MESSAGES[code] })

  return { rerKcal, merKcal, dailyGrams, mealsPerDay, mealTimes, objective, warnings }
```

Recorrer `NUTRITION_WARNING_ORDER` (paso 7) en vez de encadenar `if`s hace que el
orden fijo de R13 sea estructural y no un accidente del orden de escritura.

**Ruido de coma flotante — no "arreglarlo".** `1.2 + (-0.1)` en IEEE-754 da
`1.0999999999999999`, y `1.6 - 0.2` da `1.4000000000000001`. Verificado: no
cambia ninguno de los cuatro casos ancla (el gato de R14 da 218 kcal con el
literal `1.1` y con la resta). `Math.round(merCrudo)` absorbe el ruido. **No**
introducir `toFixed`, `Number.EPSILON` ni redondeos intermedios del factor: se
saldría del pseudocódigo normativo y podría mover un caso de frontera.

### D3 — Umbrales de edad exclusivos por arriba (R3, R5, R12)

`ageMonths < 4` cachorro · `4 <= ageMonths < 12` joven · `ageMonths >= 12`
adulto. El plan escribe "< 4 meses", "4–12 meses", "adulto", que a los 12 meses
exactos solapa dos filas. Se elige la lectura estándar de rangos semiabiertos:
es determinista, documentable y no deja huecos. Consecuencia asumida: un gato de
12.0 meses pasa de factor 2.5 a 1.2 de golpe. Igual criterio para
`too_young_vet` (`ageMonths < 2`: a los 2 meses exactos ya no se emite).

### D4 — El modificador de actividad solo toca a adultos en mantenimiento (R3)

El plan lo dice entre paréntesis — "(adultos, no pérdida)" — y esa forma es fácil
de perder al implementar. En el pseudocódigo de D2 queda estructural: el
modificador vive **solo** dentro de la rama `else` (mantenimiento). Los casos 3 y
4 de R14 lo prueban por invariancia (mismo resultado con `medium` y con `high`),
que es más fuerte que un caso positivo suelto.

### D-A — En crecimiento, el RER usa `weightKg` aunque haya `targetWeightKg` (R2)

**Derivada de OV2.** El plan dice *"Peso usado: targetWeightKg si bodyCondition
≥ 7, si no weightKg"*. Aplicado literalmente, un cachorro con BCS 8 y un objetivo
de peso inferior calcularía su RER sobre el peso objetivo: una **restricción
calórica por la puerta de atrás** justo en el caso que OV2 prohíbe restringir.
Por eso C-9 condiciona la sustitución a `objective === 'weight_loss'`, que por
C-8 solo ocurre en adultos. El warning `weight_loss_plan` sigue emitiéndose (R8):
el caso va al veterinario, no a una dieta automática.

### D-B — `sterilized: null` cuenta como entero (R3)

`pets.sterilized` es `boolean | null` (`pet.entity.ts`) y la tabla MER solo
contempla "esterilizado" / "entero". Se normaliza con `pet.sterilized === true`,
es decir `false` y `null` ⇒ **entero** (factor más alto). Es la lectura literal de
un booleano y evita una tercera rama. Queda marcada como **P2** en
[[requirements]] porque elige cuál de los dos errores se prefiere, y eso es
criterio humano.

### D5 — Un solo repositorio para las dos tablas (R15..R24)

```
backend-pet-tracker/src/modules/nutrition/domain/repositories/nutrition.repository.ts
  export const NUTRITION_REPOSITORY = Symbol('NutritionRepository');
  export interface NutritionRepository {
    findProfile(petId: string): Promise<NutritionProfile | null>;
    upsertProfile(petId: string, data: NutritionProfileData): Promise<NutritionProfile>;
    findLatestPlan(petId: string): Promise<NutritionPlan | null>;
    insertPlan(plan: NewNutritionPlan): Promise<NutritionPlan>;
  }
```

Dos tablas, un solo puerto: son el mismo agregado (el perfil es el input, el plan
el output) y siempre se consumen juntas. Partirlo en dos interfaces, dos tokens y
dos clases Drizzle serían seis archivos más sin ningún consumidor que quiera una
sola mitad. Patrón de token idéntico a
`src/modules/health/domain/repositories/weight.repository.ts`
(`WEIGHT_REPOSITORY`), inyectado con `@Inject(NUTRITION_REPOSITORY)`.

### D6 — Un solo controller con base `pets/:petId` (R16, R17, R19, R24, R25)

```
backend-pet-tracker/src/modules/nutrition/infrastructure/nutrition.controller.ts

@Controller('pets/:petId')
@UseGuards(PetAccessGuard)
export class NutritionController {
  @Put('nutrition-profile')          @RequirePetRole('owner')   -> 200
  @Get('nutrition-profile')                                     -> 200 | 404
  @Post('nutrition-plan/generate')   @RequirePetRole('owner')
                                     @HttpCode(HttpStatus.OK)   -> 200 | 422
  @Get('nutrition-plan')                                        -> 200 | 404
}
```

El prefijo `v1` **no** se repite en el decorador: se aplica globalmente (los
controllers del repo dicen `'pets/:petId/weights'`, no `'v1/...'`). El
`PetAccessGuard` ya da gratis: `:petId` no-UUID ⇒ 404 sin tocar la base, sin
membresía activa ⇒ 404 (nunca 403, para no filtrar existencia), rol insuficiente
⇒ 403, y `request.petMembership.petId` / `request.user.id` ya poblados. Copiar
literal el encabezado de
`src/modules/health/infrastructure/weights.controller.ts`.

**`generate` responde `200`, no `201`**, tanto si inserta como si es hash hit
(R19/R21): un status dinámico obligaría a inyectar `@Res()` y romper el estilo
del repo, y un `201` fijo mentiría en el hash hit. La idempotencia se observa por
`id` repetido y por el count de filas, no por el status.

**`parseBody` se copia local en el controller.** Está duplicada tal cual en
`weights.controller.ts` y `reminders.controller.ts`; no hay helper compartido y
esta feature no es el sitio para inventarlo. Copiar también `validationError`,
que produce el `{statusCode, message: 'Validation failed', errors: [{path,
message}]}` que R18 asevera.

### D7 — `PUT` es reemplazo total, no merge (R16)

`ON CONFLICT (pet_id) DO UPDATE SET` de **todas** las columnas del body más
`updated_at`. Es lo que `PUT` significa y evita la pregunta "¿cómo borro una
alergia?". El repo no tiene precedente de upsert por HTTP (`PATCH /v1/pets/:id` y
`PATCH /v1/reminders/:id` son merges parciales explícitos), así que queda escrito
aquí: una clave ausente en el body **borra** el valor anterior.

`GET` sin perfil devuelve **404 `NUTRITION_PROFILE_NOT_FOUND`**, no `200 null`:
es lo que hace el resto del repo con recursos ausentes. El `422
NUTRITION_PROFILE_REQUIRED` queda reservado para `generate`, que es donde el
criterio de aceptación de #17 lo exige. Mismo criterio para `GET
/v1/pets/:petId/nutrition-plan` ⇒ `404 NUTRITION_PLAN_NOT_FOUND`.

### D8 — El BCS del perfil manda; `weights.body_condition` se ignora (R19)

`weights.body_condition` (de #15) y `nutrition_profiles.body_condition` son dos
fuentes del mismo dato clínico. Para #17 manda el **perfil**, que es lo que
`docs/data-model.md` ya declara: no requiere método nuevo en `WeightRepository`
(hoy expone solo `create`, `listByPet`, `findPrevious`; no hay forma de pedir "el
último BCS no nulo"), no añade una lectura ni un acoplamiento entre módulos, y
deja el input del motor único y explícito.

Consecuencia a asumir y escrita en [[requirements]] §Fuera de alcance: **sin
`bodyCondition` en el perfil, el motor no puede emitir `weight_loss_plan` ni
`underweight_vet`**, y usa el factor de adulto por esterilización. La caída al
último `weights.body_condition` no nulo queda como mejora futura.

### D9 — El primer `422` del repositorio, y los errores de dominio (R17, R22, R23, R24)

`grep -rn "UnprocessableEntity" src` ⇒ 0 resultados: `NUTRITION_PROFILE_REQUIRED`
es el primer 422 del proyecto. Nest **sí** tiene clase para 422, así que se usa
`UnprocessableEntityException` (a diferencia del 402 de `PetTrackingGuard`, que
tuvo que usar `new HttpException({...}, HttpStatus.PAYMENT_REQUIRED)` porque Nest
no tiene clase para 402).

Patrón en dos piezas, idéntico a `geofences`, `alerts`, `devices` y `health`:

```
domain/errors/nutrition.errors.ts        clases Error puras, sin @nestjs/common
  NutritionProfileNotFoundError
  NutritionProfileRequiredError
  NutritionPlanNotFoundError
  PetWeightRequiredError

infrastructure/mappers/nutrition-error.mapper.ts
  export function mapNutritionError(error: unknown): HttpException
```

El mapper **devuelve** la excepción; el controller la lanza
(`throw mapNutritionError(error)`) — misma forma que
`src/modules/geofences/infrastructure/mappers/geofence-error.mapper.ts`. Cuerpo
exacto: `{ statusCode, code, message }` con `code` en SCREAMING_SNAKE.

Códigos nuevos, verificados libres contra los ya usados en el repo
(`TRIP_NOT_FOUND`, `ALERT_NOT_FOUND`, `DEVICE_NOT_FOUND`, `GEOFENCE_NOT_FOUND`,
`VACCINE_NOT_FOUND`, `DEVICE_SUBSCRIPTION_REQUIRED`, …):

| código | status | cuándo |
|---|---|---|
| `NUTRITION_PROFILE_NOT_FOUND` | 404 | `GET` de perfil sin fila |
| `NUTRITION_PLAN_NOT_FOUND` | 404 | `GET` de plan sin fila |
| `NUTRITION_PROFILE_REQUIRED` | 422 | `generate` sin perfil |
| `PET_WEIGHT_REQUIRED` | 422 | `generate` con perfil pero sin `current_weight_kg` |

`PET_WEIGHT_REQUIRED` es código propio y no reutiliza el anterior porque le dice
a la app a qué pantalla mandar al usuario: registrar una pesada ≠ crear un
perfil. Reusar `NUTRITION_PROFILE_REQUIRED` mentiría, y pedir `weightKg` en el
perfil crearía una tercera fuente de verdad del peso, contra la nota de
`docs/data-model.md` sobre el escritor único de `pets.current_weight_kg`.

### D10 — Hash canónico: input del motor, ni un campo más (R20)

No hay precedente de canonicalización de JSON en el repo: el único `sha256` es
`src/modules/auth/application/verification-token.ts` (`createHash('sha256')
.update(token).digest('hex')` sobre un string opaco). Hay que escribirla.

```
backend-pet-tracker/src/modules/nutrition/application/nutrition-input-hash.ts
  export function nutritionInputHash(input: NutritionEngineInput): string
```

Vive en `application/` y no en `domain/` por el mismo criterio que
`verification-token.ts`: importa `node:crypto`. Construye un **objeto literal
escrito a mano** con las diez claves en el orden de R20 —no `Object.keys().sort()`
genérico, que sería más código y menos auditable—, ordena `allergies` y
`diseases` con `.sort()`, normaliza opcionales ausentes a `null` explícito
(`undefined` desaparece de `JSON.stringify` y colapsaría dos inputs distintos), y
hashea el `JSON.stringify`.

**`ageMonths` entra en el hash** (la decisión más sutil de la feature). Las dos
opciones son malas de formas distintas:

| | incluir `ageMonths` | excluirlo |
|---|---|---|
| coste | el plan se regenera al cambiar de mes: una fila más en #17, una llamada a OpenAI pagada al mes por mascota en #18 | un cachorro que cumple 4 meses **sigue comiendo con factor 3.0** hasta que alguien toque el perfil |

Se elige incluirlo: el coste es dinero, el de excluirlo es un plan clínicamente
incorrecto servido como fresco — exactamente el fallo que la nota de
mantenimiento del plan 009 advierte (*"o habrá planes obsoletos servidos como
frescos"*). El ahorro de tokens de #18 no vale servir calorías de cachorro a un
perro adulto.

**Sin campo de versión del hash.** Añadir una clave al input canónico ya cambia
por sí solo la cadena serializada y por tanto todos los hashes, así que la
invalidación es automática; un `HASH_VERSION` sería redundante.

**Nota para #18**: el input canónico es, por construcción, exactamente el input
del motor, de forma que "mismo hash ⇒ mismo output del motor" es una equivalencia
real. Si #18 alimenta el prompt de OpenAI con algo que **no** entra al motor
(p. ej. `foodType`, o el nombre de la mascota), debe añadirlo al input canónico
en esa feature, o servirá explicaciones obsoletas.

### D11 — Idempotencia contra el **último** plan, sin índice único (R21)

`SELECT ... WHERE pet_id = $1 ORDER BY generated_at DESC, id DESC LIMIT 1` y
comparar `inputs_hash`. La alternativa `UNIQUE (pet_id, inputs_hash)` tiene un
comportamiento raro: si el dueño cambia de pienso y luego vuelve al anterior, le
devolvería el plan viejo con su `generated_at` de hace meses, mientras que
comparar contra el último genera uno fresco. El desempate por `id DESC` cubre dos
planes con el mismo `generated_at` (UUIDv7 es monótono).

**Sin auditoría (`AuditLogger`)** para `nutrition_profile.upsert` ni
`nutrition_plan.generate`: no la piden ni el plan 009 ni los criterios de
aceptación de #17, y `nutrition_plans` ya es su propio historial inmutable
(cada generate deja fila con `generated_at`). Si se quiere después, el puerto
`AUDIT_LOGGER` de `@/audit/audit-log.repository` está listo y son seis líneas.

### D12 — `numeric` viaja como string: convertir en el borde (R27)

`node-postgres` devuelve `numeric` como `string` y el proyecto **no** toca los
type parsers globales de `pg`. Las columnas afectadas aquí son
`nutrition_profiles.kcal_per_100g` (`numeric(6,1)`) y `target_weight_kg`
(`numeric(5,2)`). El repositorio Drizzle convierte a mano, igual que
`pet.drizzle.repository.ts` con `pets.current_weight_kg`:

```
lectura:   kcalPer100g: Number(row.kcalPer100g),
           targetWeightKg: row.targetWeightKg == null ? null : Number(row.targetWeightKg)
escritura: kcalPer100g: String(data.kcalPer100g)
```

Es un riesgo silencioso: `"350.0"` no rompe `merKcal / (kcalPer100g / 100)` por
coerción, pero sí rompe el hash canónico (`"350.0"` ≠ `350` en `JSON.stringify`)
y cualquier `Number.isFinite`. `target_weight_kg` usa `numeric(5,2)`, la misma
precisión que `pets.current_weight_kg` y `weights.weight_kg`: son la misma
magnitud y mezclar escalas introduce redondeos silenciosos.

### D13 — Sin `PetTrackingGuard`, sin dependencia `openai` (R25, R26)

OV3: la nutrición es parte de la app de salud gratuita (#25: *free = salud sin
GPS*) y no consume nada del collar. Poner el muro de pago aquí y quitarlo después
sería un cambio incompatible para los usuarios existentes; ponerlo después de
publicar el endpoint sin muro, también. Se decide ahora y se asevera con un test
(R25: mascota sin suscripción activa ⇒ `200` en `generate`, nunca
`402 DEVICE_SUBSCRIPTION_REQUIRED`).

`ai_explanation` se crea en la migración de #17 y nace `NULL` para que #18 no
necesite migración propia — mismo criterio ya usado con `alert_events.status`
('acked' entró en el CHECK antes de que #13 lo escribiera). #17 no añade la
dependencia `openai` ni ninguna env `OPENAI_*`; como no añade env, **no** hay que
tocar `.env.example` ni `scripts/env-drift.mjs`.

---

## Archivos afectados

Rutas relativas a la raíz del repo.

**Nuevos — `domain`**
- `backend-pet-tracker/src/modules/nutrition/domain/nutrition-engine.ts` — motor puro `computePlan` (R1–R14)
- `backend-pet-tracker/src/modules/nutrition/domain/nutrition.constants.ts` — todas las cifras y textos (R1)
- `backend-pet-tracker/src/modules/nutrition/domain/entities/nutrition-profile.entity.ts` — `NutritionProfile`, `NutritionProfileData`
- `backend-pet-tracker/src/modules/nutrition/domain/entities/nutrition-plan.entity.ts` — `NutritionPlan`, `NewNutritionPlan`
- `backend-pet-tracker/src/modules/nutrition/domain/errors/nutrition.errors.ts` — las 4 clases de D9
- `backend-pet-tracker/src/modules/nutrition/domain/repositories/nutrition.repository.ts` — `NUTRITION_REPOSITORY` + interface (D5)

**Nuevos — `application`**
- `backend-pet-tracker/src/modules/nutrition/application/dto/nutrition-profile.dto.ts` — `UpsertNutritionProfileSchema` (Zod `strictObject`), `KCAL_PER_100G_MIN/MAX` (R18)
- `backend-pet-tracker/src/modules/nutrition/application/nutrition-input-hash.ts` — `nutritionInputHash` (R20)
- `backend-pet-tracker/src/modules/nutrition/application/use-cases/upsert-nutrition-profile.use-case.ts` (R16)
- `backend-pet-tracker/src/modules/nutrition/application/use-cases/get-nutrition-profile.use-case.ts` (R17)
- `backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts` (R19–R23; llama a `calculateAgeMonths(pet, new Date())`)
- `backend-pet-tracker/src/modules/nutrition/application/use-cases/get-nutrition-plan.use-case.ts` (R24)

**Nuevos — `infrastructure`**
- `backend-pet-tracker/src/modules/nutrition/infrastructure/nutrition.controller.ts` (D6)
- `backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts` — `toNutritionProfileResponse`, `toNutritionPlanResponse` (R16, R19)
- `backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition-error.mapper.ts` (D9)
- `backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts` (D5, D12)
- `backend-pet-tracker/src/modules/nutrition/nutrition.module.ts` — `imports: [PetsModule]`, provider `{ provide: NUTRITION_REPOSITORY, useClass: NutritionDrizzleRepository }`

**Nuevos — datos y tests**
- `backend-pet-tracker/src/db/schema/nutrition.schema.ts` — `nutritionProfiles`, `nutritionPlans` (R15)
- `backend-pet-tracker/src/db/migrations/0013_*.sql` + `meta/0013_snapshot.json` + entrada en `meta/_journal.json` — generados por `pnpm -C backend-pet-tracker run db:generate`, **los tres van al commit**
- `backend-pet-tracker/src/db/schema/nutrition.schema.spec.ts` (R15)
- `backend-pet-tracker/src/modules/nutrition/domain/nutrition-engine.spec.ts` (R1–R14)
- `backend-pet-tracker/src/modules/nutrition/application/nutrition-input-hash.spec.ts` (R20)
- `backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts` (R26)
- `backend-pet-tracker/test/nutrition.e2e-spec.ts` (R16–R19, R21–R27) — necesita Docker levantado

**Modificados**
- `backend-pet-tracker/src/db/schema/index.ts` — añadir `export * from './nutrition.schema';` entre `health.schema` y `pets.schema` (el barrel está en orden alfabético)
- `backend-pet-tracker/src/app.module.ts` — añadir `NutritionModule` a `imports`, junto a los demás módulos de dominio
- `docs/data-model.md` — completar las filas `nutrition_profiles` y `nutrition_plans` del catálogo con los tipos, CHECKs, `ON DELETE CASCADE` e índice de R15; el doc se declara "referencia viva" y hoy esas dos filas están sin tipar

**No se toca**: `plans/`, `.env.example`, `scripts/env-drift.mjs`,
`backend-pet-tracker/package.json` (sin dependencias nuevas), ni ningún archivo
de `src/modules/pets/`, `src/modules/health/` o `src/modules/subscriptions/`.

---

## Alternativas descartadas

- **`nutrition-engine.ts` en `src/pipeline/`** (junto a `geofence-eval.ts`): ese
  directorio es para lógica que consumen los **workers** y su razón documentada
  es la portabilidad a Lambdas. El motor lo consume un use-case HTTP. Ver D1.
- **`kcalPer100g` opcional con defaults por `foodType`** (dry 350, wet 100,
  mixed ?, homemade ?): descartada por OV1. `mixed` y `homemade` no tienen
  default en ninguna fuente, y un casero de "150 kcal/100 g" inventado por
  nosotros no describe la comida de nadie.
- **`UNIQUE (pet_id, inputs_hash)`** para la idempotencia: devolvería planes de
  hace meses al volver a un pienso anterior. Ver D11.
- **Excluir `ageMonths` del hash** para ahorrar llamadas a OpenAI en #18: serviría
  factores de cachorro a un animal que ya no lo es. Ver D10.
- **Calcular los horarios por reparto uniforme entre 07:00 y 20:00**: más código y
  **no** reproduce la tabla del plan (2 comidas uniformes darían 07:00/20:00, no
  07:30/19:30). Es una tabla de tres entradas; se deja como tabla.
- **Persistir solo los códigos de warning y resolver el texto en el mapper**:
  ahorra bytes pero pierde el snapshot clínico. Un plan es el documento que se le
  dio al dueño en una fecha; se guarda `{code, message}` tal como se mostró.
- **Dos repositorios/tokens separados** (perfil y plan): seis archivos más sin
  ningún consumidor que quiera una sola mitad. Ver D5.
- **Extraer `parseBody` a un helper compartido**: está duplicada en todos los
  controllers del repo; unificarla es un refactor transversal ajeno a #17.
- **Auditar con `AuditLogger`**: no lo piden el plan ni los criterios, y
  `nutrition_plans` ya es historial. Ver D11.
- **Exponer `inputsHash` en la respuesta HTTP**: superficie de contrato para un
  detalle interno; los tests lo verifican por `id` y por count de filas.
- **`201` en `generate`**: mentiría en el hash hit, y un status dinámico obligaría
  a inyectar `@Res()`. Ver D6.
