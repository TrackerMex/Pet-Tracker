# explore: nutrition-profile-engine

Fecha: 2026-08-17
Feature: #17 `nutrition-profile-engine` (P3, `pending`)
Branch: `feature/17-nutrition-profile-engine`
Alcance: solo lectura. No se escribió código, spec ni se tocó `feature_list.json`.

---

## 0. Corrección de la premisa del encargo

**El plan 009 SÍ existe en este repositorio**: `plans/009-alimentacion-ia.md`
(119 líneas). Contiene, textualmente y completa:

- la tabla de factores MER (perro × gato × edad × esterilizado × actividad),
- la regla de comidas por edad,
- los horarios exactos para 2, 3 y 4 comidas,
- las cinco condiciones de warning,
- los tres valores de `objective`,
- la regla de redondeo ("kcal a entero, gramos a múltiplo de 5"),
- los 4 casos de test con valores exactos (los 2 anclajes de
  `feature_list.json` son los 2 primeros, recortados),
- el system prompt de la IA y las condiciones de STOP.

Esto **reduce drásticamente** la lista de decisiones abiertas respecto de lo
que asumía el encargo: casi todo lo que se pedía "reconstruir desde los
criterios de aceptación" está escrito. Lo que queda abierto es de segundo
orden (precedencias, límites inclusivos/exclusivos, casos nulos) — sección 5.

**Advertencia de deriva de rutas**: el plan 009 habla de `apps/api/src/...`
(monorepo que nunca existió aquí). La ruta real es
`backend-pet-tracker/src/...`. También pide actualizar "OpenAPI": **no hay
ningún artefacto OpenAPI en el repo** (`find . -iname "*openapi*"` → vacío).
El paso 4 (pantallas `apps/mobile/`) y el paso 3 (IA) están fuera de #17: el
paso 3 es la feature #18 `nutrition-ai-explainer` y el móvil no existe.

---

## 1. Modelo de datos ya decidido vs. lo que pide #17

### 1.1 Lo que dice `docs/architecture.md` / `docs/data-model.md`

`docs/data-model.md` líneas 61–62 (tabla "Catálogo de tablas"):

| `nutrition_profiles` | pet_id PK FK, activity_level ('low','medium','high'), body_condition, target_weight_kg, food_type, kcal_per_100g numeric(6,1), allergies jsonb, diseases jsonb, updated_at | 1:1 con mascota |
| `nutrition_plans` | id PK, pet_id FK, rer_kcal, mer_kcal, daily_grams, meals_per_day, meal_times jsonb, objective, warnings jsonb, ai_explanation NULL, inputs_hash, generated_at | `inputs_hash` = idempotencia |

Ninguna de las dos tablas está migrada todavía. El ERD (línea 36–37) ya las
declara: `pets ||--|| nutrition_profiles` y `pets ||--o{ nutrition_plans`.

### 1.2 Huecos y contradicciones detectados

**H1 — `nutrition_profiles.body_condition` duplica `weights.body_condition`.**
Este es el hueco más serio. `weights` (#15, migración `0010`) ya tiene
`body_condition integer` con `CHECK between 1 and 9`
(`backend-pet-tracker/src/db/schema/health.schema.ts`, tabla `weights`), y el
DTO `CreateWeightSchema` lo acepta como `bodyCondition` opcional
(`.../health/application/dto/weight.dto.ts`). El perfil nutricional volvería a
pedirlo. Dos fuentes de verdad para el mismo dato clínico → un BCS 8 en la
última pesada y un BCS 5 en el perfil producen planes contradictorios según
quién lea. Decisión abierta D8.

**H2 — Sin tipos declarados.** `docs/data-model.md` solo tipa
`kcal_per_100g numeric(6,1)`. Todo lo demás (`rer_kcal`, `mer_kcal`,
`daily_grams`, `meals_per_day`, `target_weight_kg`, `objective`,
`inputs_hash`) va sin tipo ni nullability. Decisión abierta D9.

**H3 — Sin CHECKs declarados.** El repo es sistemáticamente CHECK-first:
`pets_species_check`, `weights_body_condition_check`, `reminders_type_check`,
`device_subscriptions_status_check`… Los enums de #17 (`activity_level`,
`food_type`, `objective`) deben llevar CHECK igual que sus hermanos. No están
escritos en `data-model.md`.

**H4 — Sin índices declarados.** La regla del propio `data-model.md` es
explícita: *"toda columna FK lleva índice manual (Postgres no indexa FKs),
compuestos `(pet_id, <fecha> DESC)` en historial"*. `nutrition_plans.pet_id`
es FK y la tabla es historial → falta `(pet_id, generated_at DESC)`.
`nutrition_profiles.pet_id` es PK y FK a la vez: la PK ya cubre la FK, no
necesita índice extra (mismo razonamiento documentado para
`device_subscriptions.device_id` y para `activity_daily`).

**H5 — `inputs_hash`: sin unicidad ni forma.** El criterio "mismo input →
mismo plan (hash hit, sin fila nueva)" se puede implementar como
`SELECT ... ORDER BY generated_at DESC LIMIT 1` y comparar (lo que el plan 009
dice: *"si el **último** plan tiene el mismo hash"*), o con un
`UNIQUE (pet_id, inputs_hash)`. **No son equivalentes**: con UNIQUE, un plan
antiguo con el mismo hash también sería hit; con "último", no. El plan 009
elige "último". Decisión abierta D10.

**H6 — ON DELETE.** Todas las tablas hijas de `pets` usan
`onDelete: 'cascade'` (`weights`, `pet_vaccines`, `reminders`, `geofences`,
`alert_events`, `activity_daily`). `nutrition_profiles` y `nutrition_plans`
deben seguirlo; `data-model.md` no lo dice.

**H7 — `updated_at` sí, `created_at` no.** `nutrition_profiles` lista
`updated_at` pero no `created_at`. Todas las demás tablas con `updated_at`
(`pets`, `geofences`, `device_subscriptions`) llevan las dos. Es probable
omisión, no decisión.

**H8 — `numeric` en Drizzle devuelve `string`.** `kcal_per_100g numeric(6,1)`
llega como `"350.0"`, no como `350`. El repo ya lo maneja a mano:
`pet.drizzle.repository.ts:140-141` (`row.currentWeightKg == null ? null :
Number(row.currentWeightKg)`) y `weight.drizzle.repository.ts:26`
(`weightKg: String(data.weightKg)`). El mapper de nutrición debe hacer lo
mismo, o el motor recibirá strings y `70 * Math.pow("20", 0.75)` colará por
coerción silenciosa hasta que una comparación falle.

### 1.3 Número de migración siguiente

**`0013`.** Estado verificado:

- `backend-pet-tracker/src/db/migrations/` llega a `0012_absent_black_bolt.sql`
  (device-subscriptions, #25).
- `migrations/meta/_journal.json` cierra en `"idx": 12`.

Las migraciones se generan con `pnpm db:generate` →
`drizzle-kit generate` (`package.json`, script `db:generate`), es decir el
nombre (`0013_<dos_palabras>`) **lo inventa drizzle-kit**, no el
implementador. El `_journal.json` y el snapshot `0013_snapshot.json` se
generan junto al `.sql` y **los tres van al commit**. `src/db/migrations.spec.ts`
solo comprueba que exista ≥1 `.sql`; no valida numeración.

Excepción observada: `0012` lleva SQL escrito a mano al final (el
`INSERT ... SELECT` de backfill) añadido tras el `generate`. Si #17 necesita
backfill (no debería: tablas nuevas y vacías), ese es el precedente.

---

## 2. Patrones reutilizables (rutas y símbolos exactos)

### 2.1 Módulo NestJS Clean Architecture — referencia a copiar

`health` (#15) y `reminders` (#16) son los dos ejemplares más cercanos. La
estructura que #17 debe replicar en
`backend-pet-tracker/src/modules/nutrition/`:

```
domain/entities/<n>.entity.ts          clase/interface pura, sin framework
domain/errors/<n>.errors.ts            clases Error de dominio
domain/repositories/<n>.repository.ts  interface + Symbol token
application/dto/<n>.dto.ts             esquemas Zod + tipos inferidos
application/use-cases/<verbo>-<n>.use-case.ts
infrastructure/<n>.controller.ts
infrastructure/mappers/<n>.mapper.ts        entidad → response HTTP
infrastructure/mappers/<n>-error.mapper.ts  error dominio → HttpException
infrastructure/repositories/<n>.drizzle.repository.ts
<n>.module.ts
```

Ejemplares concretos:

- Módulo completo y pequeño:
  `backend-pet-tracker/src/modules/reminders/reminders.module.ts`
  (import de `PetsModule`, provider por token
  `{ provide: REMINDER_REPOSITORY, useClass: ReminderDrizzleRepository }`,
  `exports`).
- Token de repositorio:
  `backend-pet-tracker/src/modules/health/domain/repositories/weight.repository.ts`
  → `export const WEIGHT_REPOSITORY = Symbol('WeightRepository');` +
  `export interface WeightRepository { ... }`. El use-case lo recibe con
  `@Inject(WEIGHT_REPOSITORY)`.
- El módulo nuevo debe registrarse en
  `backend-pet-tracker/src/app.module.ts` (lista de `imports`, líneas 26-45).
  Orden observado: los módulos de dominio van juntos antes de los workers.
- `DRIZZLE` y `AUDIT_LOGGER` son `@Global()` (`DrizzleModule`, `AuditModule`);
  no hay que importarlos.

### 2.2 Peso actual y BCS: fuente de verdad

**Verificado end-to-end.** La fuente de verdad del **peso** es la tabla
`weights`; `pets.current_weight_kg` es una **proyección desnormalizada** con
un único escritor.

- `backend-pet-tracker/src/modules/health/infrastructure/repositories/weight.drizzle.repository.ts`,
  método `create()`: dentro de una `db.transaction`, inserta en `weights` y
  luego hace `tx.update(pets).set({ currentWeightKg: String(data.weightKg) })`
  **condicionado** a `notExists(... weights.measuredAt > data.measuredAt)` —
  es decir, solo si la medición nueva es la más reciente. Una pesada
  retroactiva no pisa la proyección.
- `docs/data-model.md`, fila `pets`, lo declara explícito: *"`current_weight_kg`
  tiene un único escritor: `WeightDrizzleRepository.create()` de
  `health-weights` (#15); POST/PATCH `/v1/pets` ya no aceptan `weightKg`"*.

**Consecuencia práctica para #17**: leer `pets.current_weight_kg` (vía
`PetRepository.findById()` → `Pet.currentWeightKg: number | null`) es correcto
y barato, **una lectura menos** que ir a `weights`. Es la opción recomendada.
Pero `pets.current_weight_kg` **es nullable** y nace `null`: una mascota dada
de alta sin ninguna pesada registrada no tiene peso. Ver D7.

El **BCS** es harina de otro costal: `weights.body_condition` es también
nullable, y **no** se proyecta a `pets`. No hay hoy ningún método de
repositorio que devuelva "el último BCS conocido":
`WeightRepository` expone `create`, `listByPet(petId, limit)` y
`findPrevious(petId, measuredAt, id)`. Obtener el último BCS requeriría o bien
`listByPet(petId, 1)` (y aun así puede venir con `bodyCondition: null`), o un
método nuevo. De ahí que `nutrition_profiles.body_condition` exista en el
modelo — pero eso reabre H1. Ver D8.

### 2.3 Edad en meses: **el helper YA EXISTE**

`backend-pet-tracker/src/modules/pets/domain/entities/pet.entity.ts`:

```ts
export interface AgeSource {
  birthDate: string | null;
  approxAgeMonths: number | null;
  createdAt: Date;
}

export function calculateAgeMonths(source: AgeSource, now: Date): number
```

Función pura, sin reloj propio (`now` siempre lo pasa el caller), documentada
como R6 de pets-crud-permissions. Con `birthDate` cuenta meses de calendario
completos; sin ella, `approxAgeMonths` + meses completos desde `createdAt`
(la edad aproximada queda anclada al alta y avanza sola). Helper privado
`completeMonthsSince()` en el mismo archivo.

**#17 no debe escribir su propia aritmética de edad.** Debe importar
`calculateAgeMonths` y pasarle `now`. Nota de pureza: `nutrition-engine.ts`
recibe `ageMonths` **ya calculado** en su input (así lo define el plan 009), lo
que mantiene el motor sin reloj — el use-case es quien llama a
`calculateAgeMonths(pet, new Date())`.

Borde: el DTO de alta garantiza XOR entre `birthDate` y `approxAgeMonths`
(`create-pet.dto.ts:39-46`), pero la base admite ambos `null` como *"estado
transitorio imposible vía API"* (comentario en `pets.schema.ts`). Si ambos son
null, `calculateAgeMonths` devuelve meses desde `createdAt` + 0.

### 2.4 Ownership de `:petId`

Patrón único y consistente en todo el repo:

- Guard: `backend-pet-tracker/src/modules/pets/infrastructure/guards/pet-access.guard.ts`
  → `export class PetAccessGuard implements CanActivate` y
  `export interface PetAccessRequest extends AuthenticatedRequest { petMembership: { petId: string; role: PetRole } }`.
- Decorador: `backend-pet-tracker/src/modules/pets/infrastructure/decorators/require-pet-role.decorator.ts`
  → `export const RequirePetRole = (...roles: PetRole[]) => SetMetadata(PET_ROLES_KEY, roles)`.
- Uso (copiar literal de
  `backend-pet-tracker/src/modules/health/infrastructure/weights.controller.ts`):

```ts
@Controller('pets/:petId/weights')
@UseGuards(PetAccessGuard)
export class WeightsController {
  @Post()
  @RequirePetRole('owner')
  async create(@Req() request: PetAccessRequest, @Body() body: unknown) {
    ... request.petMembership.petId ... request.user.id
  }
}
```

Semántica ya fijada por el guard, que #17 hereda gratis: `:petId` no-UUID →
404 sin tocar la base; sin membresía o membresía no `active` → 404 (nunca 403,
para no filtrar existencia); rol insuficiente → 403; sin decorador, cualquier
rol activo pasa. El AuthGuard global (`APP_GUARD`) ya pobló `request.user`.

El prefijo `v1` no se repite en el `@Controller` — se aplica globalmente
(los controllers dicen `'pets/:petId/weights'`, no `'v1/...'`).

`PetsModule` exporta `PET_REPOSITORY` y `PetAccessGuard`; basta con
`imports: [PetsModule]` en `NutritionModule`.

### 2.5 Errores de dominio con código — y el hueco del 422

Patrón en dos piezas, idéntico en `geofences`, `alerts`, `devices`, `health`,
`activity`:

1. Clases `Error` puras en `domain/errors/<n>.errors.ts`
   (ej. `backend-pet-tracker/src/modules/geofences/domain/errors/geofence.errors.ts`).
2. Un mapper en `infrastructure/mappers/<n>-error.mapper.ts` que devuelve la
   `HttpException`; el controller lo aplica en `catch`.

Forma exacta del cuerpo (de
`backend-pet-tracker/src/modules/geofences/infrastructure/mappers/geofence-error.mapper.ts`):

```ts
return new NotFoundException({
  statusCode: HttpStatus.NOT_FOUND,
  code: 'GEOFENCE_NOT_FOUND',
  message: 'Geofence not found',
});
```

Es decir: `{ statusCode, code, message }` con `code` en SCREAMING_SNAKE. El
mapper **devuelve** la excepción (`return`), el controller la lanza
(`throw mapXError(error)`).

Códigos ya en uso, para no colisionar: `TRIP_NOT_FOUND`, `INVALID_DATE`,
`ALERT_NOT_FOUND`, `ALERT_ALREADY_CLOSED`, `INVALID_CURSOR`,
`DEVICE_NOT_FOUND`, `DEVICE_ALREADY_ASSIGNED`, `PET_ALREADY_HAS_DEVICE`,
`DEVICE_NOT_ASSIGNED`, `MAX_GEOFENCES_REACHED`, `GEOFENCE_NAME_TAKEN`,
`GEOFENCE_NOT_FOUND`, `VACCINE_CATALOG_NOT_FOUND`, `VACCINE_SPECIES_MISMATCH`,
`VACCINE_NOT_FOUND`, `DEVICE_SUBSCRIPTION_REQUIRED`.
`NUTRITION_PROFILE_REQUIRED` está libre.

**Hueco: no existe ningún 422 en el código.**
`grep -rn "UnprocessableEntity\|HttpStatus.UNPROCESSABLE" src` → 0 resultados.
`NUTRITION_PROFILE_REQUIRED` sería el primero. Nest tiene
`UnprocessableEntityException`, así que basta con:

```ts
new UnprocessableEntityException({
  statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  code: 'NUTRITION_PROFILE_REQUIRED',
  message: '...',
});
```

Precedente para un status "raro": `PetTrackingGuard`
(`backend-pet-tracker/src/modules/subscriptions/infrastructure/guards/pet-tracking.guard.ts`)
usa `new HttpException({...}, HttpStatus.PAYMENT_REQUIRED)` porque Nest no
tiene clase para 402. Para 422 sí la hay; usar la clase.

Validación de DTO (el `kcalPer100g 900 → 400` del criterio) va por otro
camino, no por el error mapper: Zod + `parseBody()` local en el controller,
que lanza `BadRequestException({ statusCode, message: 'Validation failed',
errors: [{ path, message }] })`. Ver `weights.controller.ts:64-88` y
`reminders.controller.ts:78-91` — **la función `parseBody` está duplicada en
cada controller**, no hay helper compartido. Copiar el patrón (es lo que hacen
todos) en vez de inventar una abstracción nueva.

Esquemas Zod: `z.strictObject({...})` con constantes exportadas para los
límites, ver `backend-pet-tracker/src/modules/health/application/dto/weight.dto.ts`
(`WEIGHTS_DEFAULT_LIMIT`, `WEIGHTS_MAX_LIMIT`, `MEASURED_AT_MAX_FUTURE_DAYS`).
Ese es el precedente directo para `KCAL_PER_100G_MIN = 80` /
`KCAL_PER_100G_MAX = 600` / `DEFAULT_KCAL_PER_100G_DRY = 350` / `..._WET = 100`.

### 2.6 Idempotencia por hash: **no existe ningún precedente**

`grep -rn "createHash\|sha256\|inputs_hash\|inputsHash" src` devuelve **un solo
sitio**: `backend-pet-tracker/src/modules/auth/application/verification-token.ts:23`

```ts
return createHash('sha256').update(token).digest('hex');
```

(`import { createHash, randomBytes } from 'node:crypto'`). Es un hash de un
string opaco, no de un objeto — **no hay canonicalización de JSON en ningún
sitio del repo**.

Ni `wialon` ni `alerts` usan hashes. La idempotencia en esas features es de
otra naturaleza: `alert_events` usa un **índice único parcial** anti-spam
(`(pet_id, type, coalesce(geofence_id, uuid_cero)) WHERE status='open'`), y
DynamoDB `positions` usa `PutItem` sobre el mismo `sk`. Ninguno es reutilizable
aquí.

Conclusión: `inputs_hash` requiere escribir la canonicalización desde cero.
`JSON.stringify` de un objeto literal **no** es canónico (el orden de claves
depende del orden de inserción, y `undefined` desaparece mientras `null` se
queda). La nota de mantenimiento del plan 009 avisa del riesgo exacto: *"si se
añaden campos al input, incluirlos en el hash canónico o habrá planes
obsoletos servidos como frescos"*. Ver D11.

### 2.7 `SubscriptionRepository.isPetTracked()` — para #18 y para decidir si #17 la usa

Ruta y firma exactas:

`backend-pet-tracker/src/modules/subscriptions/domain/repositories/subscription.repository.ts`

```ts
export const SUBSCRIPTION_REPOSITORY = Symbol('SubscriptionRepository');

export interface SubscriptionRepository {
  isPetTracked(petId: string): Promise<boolean>;
  isDeviceEntitled(deviceId: string): Promise<boolean>;
}
```

Implementación: `backend-pet-tracker/src/modules/subscriptions/infrastructure/repositories/subscription.drizzle.repository.ts:14`.
Consumidor actual: `PetTrackingGuard`
(`.../subscriptions/infrastructure/guards/pet-tracking.guard.ts:33`), que ante
`false` lanza 402 con `code: DEVICE_SUBSCRIPTION_REQUIRED`.
`SubscriptionsModule` exporta `SUBSCRIPTION_REPOSITORY` **y** `PetTrackingGuard`.

**Nota de producto relevante**: según el modelo de membresías de #25 (la
suscripción cuelga del **collar**, y *"free = app de salud sin GPS"*), la
nutrición es parte de la app de salud → **#17 NO debería llevar
`PetTrackingGuard`**. Ponerlo dejaría la nutrición detrás del muro de pago del
GPS, contradiciendo la decisión de #25. Ver D12 — conviene que el humano lo
confirme explícitamente, porque es una decisión de producto, no técnica.

### 2.8 Motores puros: el molde para `nutrition-engine.ts`

Dos ejemplares, ambos con el mismo contrato "función pura + constantes
nombradas en archivo aparte":

- `backend-pet-tracker/src/pipeline/geofence-eval.ts` — cabecera literal:
  *"Evaluacion pura de geocercas: sin imports de NestJS/SDK/ORM, sin reloj y
  sin red — misma regla de pureza que trips.ts/activity.ts. **Los umbrales
  entran por ./constants, nunca como literal.**"* Exporta `isInside()` y
  `evaluate()`, con interfaces de entrada/salida declaradas en el mismo
  archivo (`EvaluateResult`, `GeofenceState`, `GeofenceEvent`).
  Sus constantes viven en `backend-pet-tracker/src/pipeline/constants.ts`
  (`GEOFENCE_ENTER_RADIUS_MULTIPLIER`, `GEOFENCE_EXIT_MAX_ACCURACY_M`, …).
- `backend-pet-tracker/src/workers/alerts-engine/alerts-engine.constants.ts` —
  constantes nombradas de un worker (`ALERT_TYPE_GEOFENCE_EXIT`,
  `CONSUMER_RECEIVE_MAX_MESSAGES`), con comentario justificando cada una.

`docs/architecture.md:104` lo eleva a regla: *"La lógica vive en funciones
puras (`src/pipeline/`) — portarla a Lambdas después es empaquetado, no
reescritura"*.

**Dónde va `nutrition-engine.ts`**: hay dos ubicaciones defendibles y el repo
no las distingue por regla escrita. `src/pipeline/` alberga lo que consumen
los *workers* (ingesta, geocercas). El motor de nutrición lo consume un
*use-case HTTP*, no un worker. `feature_list.json` §files_affected apunta a
`backend-pet-tracker/src/modules/nutrition/`. Recomendación: **`domain/`** del
propio módulo —
`backend-pet-tracker/src/modules/nutrition/domain/nutrition-engine.ts` con
`.../domain/nutrition.constants.ts` al lado —, que es exactamente lo que la
capa `domain` significa en `docs/architecture.md:21` ("sin imports de ningún
framework, ORM ni librería"). Precedente de lógica pura dentro de un módulo:
`backend-pet-tracker/src/modules/health/application/weight-variation.ts`
(`weightDelta`) y `.../health/application/vaccine-date.ts`. Ver D13.

El criterio de aceptación *"los factores MER son constantes nombradas, no
números mágicos dispersos"* es literalmente la regla de `geofence-eval.ts`.
El plan 009 añade: *"documentar en JSDoc con estas mismas cifras"*.

### 2.9 Otros detalles del repo que la spec debe fijar

- **IDs**: `uuidv7()` del paquete `uuidv7`, generado **en la aplicación**, no
  en la base (`weight.drizzle.repository.ts:26`, `id: uuidv7()`). Ninguna PK
  uuid tiene `defaultRandom()`.
- **Auditoría**: `AUDIT_LOGGER` / `AuditLogger` de `@/audit/audit-log.repository`,
  usado por `CreateWeightUseCase` con
  `{ userId, action: 'weight.create', entity: 'weight', entityId, meta: { petId } }`.
  Si #17 debe auditar (`nutrition_profile.upsert`, `nutrition_plan.generate`),
  el patrón está listo. `data-model.md` cita brief §19 para `audit_log`.
- **Barrel de schema**: añadir `export * from './nutrition.schema';` a
  `backend-pet-tracker/src/db/schema/index.ts` (alfabético; va entre
  `geofences.schema` y `pets.schema`... el barrel actual está ordenado
  alfabéticamente, `nutrition` cae entre `health` y `pets`).
- **Tests e2e**: `backend-pet-tracker/test/<feature>.e2e-spec.ts`, config
  `test/jest-e2e.json`, script `pnpm test:e2e`. Precedente más cercano:
  `test/health-weights.e2e-spec.ts` y `test/pet-reminders.e2e-spec.ts`.
- **Alias de imports**: `@/` → `src/`. Se usa en imports cruzados entre
  módulos; dentro del mismo módulo se ven ambos estilos (`./mappers/...` y
  `@/modules/...`).

---

## 3. Aritmética: qué fijan los anclajes y qué no

Verificado numéricamente con Node (doble precisión IEEE 754).

### 3.1 Anclaje perro — 20 kg, esterilizado, medium, dry 350

```
20^0.75             = 9.457416
RER = 70 × 9.457416 = 662.0191 kcal
factor              = 1.6   (perro adulto esterilizado; medium → sin modificador)
MER = 662.0191×1.6  = 1059.2306  → round → 1059 kcal   ✅ coincide con "~1059"
gramos crudos       = 1059.2306 / 3.5 = 302.6373 g
302.6373 / 5        = 60.5275
  → round(60.5275)×5 = 305 g   ✅
  → ceil (60.5275)×5 = 305 g   ✅
  → floor(60.5275)×5 = 300 g   ❌
comidas: adulto → 2   ✅
```

### 3.2 Anclaje gato — 4 kg, esterilizado, low, dry 350

```
4^0.75              = 2.828427
RER = 70 × 2.828427 = 197.9899 kcal
factor              = 1.2 − 0.1 = 1.1   (gato adulto esterilizado + low)
MER = 197.9899×1.1  = 217.7889  → round → 218 kcal   ✅ coincide con "~218"
gramos crudos       = 217.7889 / 3.5 = 62.2254 g
62.2254 / 5         = 12.4451
  → round(12.4451)×5 = 60 g   ✅
  → ceil (12.4451)×5 = 65 g   ❌
  → floor(12.4451)×5 = 60 g   ✅
```

### 3.3 Lo que queda DETERMINADO

**R1 — La regla de redondeo de gramos es `round` (a múltiplo de 5 más
cercano), y los dos anclajes juntos son necesarios para probarlo.**
El anclaje del perro elimina `floor`; el del gato elimina `ceil`; solo `round`
sobrevive a los dos. Ninguno de los dos por separado lo determina. **Esto
significa que los dos casos de test del criterio de aceptación no son
redundantes: son un par mínimo que fija la regla. Ninguno de los dos puede
caerse de la suite.**

**R2 — El factor del gato es exactamente 1.1.** Barrido de alternativas:

| factor gato | kcal resultante |
|---|---|
| 1.0 | 198 |
| **1.1** | **218** ✅ |
| 1.2 | 238 |
| 1.3 | 257 |
| 1.4 | 277 |

Solo 1.1 da 218. Y 1.1 = 1.2 (adulto esterilizado) − 0.1 (actividad low).
**Corolario importante: el gato del anclaje TIENE que estar esterilizado.**
La descripción de `feature_list.json` dice solo *"gato 4 kg, actividad low"* y
**omite `sterilized: true`**, que es load-bearing: un gato entero daría
1.4 − 0.1 = 1.3 → 257 kcal, no 218. El plan 009 sí lo dice
(*"Gato adulto esterilizado 4 kg"*). La spec debe escribir el input completo.

**R3 — El factor del perro es exactamente 1.6** (adulto esterilizado, medium
sin modificador). Con `high` sería 1.8 → 1192 kcal; con `low`, 1.4 → 927.

**R4 — `kcalPer100g` del gato = 350.** El anclaje admite el rango
[348.5, 378.8] (fuera de él los gramos no caen en 60), y el default `dry 350`
del plan 009 está dentro. Determinado por la combinación anclaje + plan, no
por el anclaje solo.

**R5 — RER = 70 × peso^0.75** reproduce ambos anclajes al kcal exacto. No hay
ambigüedad de exponente ni de constante.

**R6 — Los otros dos casos de test del plan 009** también cuadran:
cachorro 3 meses / 5 kg → RER 234.06 × 3.0 = **702 kcal**, 4 comidas,
objective `growth`. Perro BCS 8, 30 kg, target 25 → RER sobre 25 kg = 782.62
× 1.0 = **783 kcal**, objective `weight_loss`. (El plan no da estos números;
los calculé yo — conviene que la spec los escriba para que Codex no los
re-derive.)

### 3.4 Lo que NO queda determinado

**U1 — Orden de redondeo: ¿los gramos se calculan desde el MER redondeado o
desde el MER crudo?** Ambos anclajes dan el mismo resultado por los dos
caminos (305 y 60 en los cuatro casos), así que **no discriminan**. Pero
**sí divergen en casos reales**: barrido sobre pesos 1–60 kg × factores de la
tabla × kcal/100g 80–600 encuentra divergencias con facilidad, p. ej.

| caso | MER | gramos desde MER redondeado | gramos desde MER crudo |
|---|---|---|---|
| 1.2 kg, factor 1.2, 350 kcal/100g | 96.3086 | **25 g** | **30 g** |
| 1.3 kg, factor 1.1, 150 kcal/100g | 93.7450 | **65 g** | **60 g** |

Son gatitos y cachorros muy pequeños, pero son mascotas reales. Hay que
elegir. Ver D14.

**U2 — Desempate de `round` en el `.5` exacto.** Ninguno de los dos anclajes
cae en un empate (60.5275 y 12.4451). `Math.round` de JS es half-up hacia
+∞ (`Math.round(12.5) === 13`, `Math.round(-0.5) === -0`). Con gramos siempre
positivos esto es half-up y basta con decirlo. Ver D14.

**U3 — Qué se redondea de `rer_kcal`.** El criterio solo ancla el MER. ¿Se
persiste `rer_kcal` redondeado a entero (662) o crudo (662.0191)? El plan dice
*"kcal a entero"* en plural genérico. Afecta al tipo de la columna (D9) y, si
`rer_kcal` entra en el hash, a la idempotencia. Ver D9/D11.

---

## 4. Riesgos

- **RG1 — El plan 009 es una condición de STOP declarada.** Su sección
  §"Condiciones de STOP" dice literal: *"Los factores MER de la tabla parecen
  requerir cambio → STOP: los valores son decisión de producto validable por
  veterinario, no del ejecutor."* Cualquier decisión abierta de esta lista que
  toque una cifra clínica (D1, D2, D3, D5) **es del humano, no de Codex ni del
  spec_author**. Si llegan al handoff sin cerrar, Codex las inventará.
- **RG2 — Superficie clínica.** Un plan de alimentación mal calculado hace
  daño físico a un animal. El brief §16 (citado por el plan) es explícito: las
  reglas calculan, la IA solo explica, y nunca sustituye al veterinario. El
  disclaimer y los warnings no son adorno: son el control de seguridad. **No
  simplificar los warnings** aunque parezcan ruido.
- **RG3 — Guardas nacidas verdes.** Los cinco warnings y el 422 son guardas.
  Precedente doloroso registrado en memoria del proyecto: una guarda que nace
  verde nunca se vio fallar. El handoff debe exigir el ciclo rojo→verde por
  R-id (C4 de `CHECKPOINTS.md`) y, para cada warning, una aserción
  anti-vacío (que la lista **no** contenga el código cuando la condición no
  se cumple), no solo que lo contenga cuando sí.
- **RG4 — `numeric` → `string`.** Ver H8. Un `kcalPer100g` que llega como
  `"350.0"` no rompe `MER / (kcalPer100g/100)` (coerción), pero sí rompe
  `Number.isFinite`, comparaciones y el hash canónico. Riesgo silencioso.
- **RG5 — Contaminación del hash por campos derivados.** Si el input canónico
  incluye `ageMonths` (que avanza con el calendario), **todo plan caduca al
  cambiar de mes** y el hash nunca acierta. Si lo excluye, un cachorro que
  cumple 4 meses seguirá comiendo con factor 3.0. Ambas opciones son malas de
  formas distintas. Ver D11 — esta es la decisión abierta más sutil de la lista.
- **RG6 — Un solo escritor sobre el working tree.** Mientras Codex implementa
  #17, nadie más toca `backend-pet-tracker/`. #18 (`nutrition-ai-explainer`)
  toca los mismos archivos y **no debe solaparse**.

---

## 5. Decisiones abiertas

Cada una con opciones y recomendación. Marcar la elegida antes del handoff.

Notación: **[P]** = lo fija el plan 009 y solo hace falta confirmarlo;
**[A]** = genuinamente abierta, el plan no la cubre.

---

**D1 [P] — Tabla completa de factores MER.**
El plan 009 la da entera. Transcrita para que la spec no tenga que abrir el plan:

| Caso | Perro | Gato |
|---|---|---|
| Cachorro < 4 meses | 3.0 | 2.5 |
| Joven 4–12 meses | 2.0 | 2.5 |
| Adulto esterilizado | 1.6 | 1.2 |
| Adulto entero | 1.8 | 1.4 |
| Pérdida de peso (BCS ≥ 7) | 1.0 | 0.8 |
| Modificador actividad `high` (adultos, no pérdida) | +0.2 | +0.1 |
| Modificador actividad `low` (adultos, no pérdida) | −0.2 | −0.1 |

(El gato tiene 2.5 tanto en <4 meses como en 4–12: para gatos, cualquier edad
<12 meses es 2.5.)
→ **Recomendación: confirmar tal cual.** Reproduce los dos anclajes exactos.
Cambiarla es la condición de STOP RG1.

---

**D2 [A] — Umbrales de edad: ¿inclusivos o exclusivos?**
El plan escribe "< 4 meses", "4–12 meses", "adulto". A los **12 meses exactos**
la mascota cae en dos filas a la vez ("4–12" y "adulto"), y a los 4 meses
exactos también hay solape con la lectura naive.
- (a) `ageMonths < 4` → cachorro; `4 ≤ ageMonths < 12` → joven; `≥ 12` → adulto.
- (b) `< 4`; `4 ≤ x ≤ 12`; `> 12`.
→ **Recomendación: (a).** Es la lectura estándar de rangos en el resto del
repo (`weights_body_condition_check between 1 and 9` es el único inclusivo, y
es un dominio discreto cerrado). Con (a) un gato de 12.0 meses ya es adulto y
baja de 2.5 a 1.2 — un salto grande, pero determinista y documentable.

---

**D3 [A] — Precedencia entre "pérdida de peso" y "cachorro/joven".**
Un cachorro de 3 meses con BCS 8: ¿factor 3.0 (crecimiento) o 1.0 (pérdida)?
El plan lista ambos como filas paralelas sin decir cuál gana.
- (a) La edad gana: cachorros y jóvenes nunca entran en plan de pérdida.
- (b) La pérdida gana siempre.
→ **Recomendación: (a), y emitir igualmente el warning `weight_loss_plan`.**
Restringir calorías a un animal en crecimiento es la opción con daño real; el
warning manda el caso al veterinario, que es exactamente lo que el brief §16
quiere. Marcar en la spec que `objective` en ese caso es `growth`.
**Esta es decisión clínica → la cierra el humano (RG1).**

---

**D4 [A] — El modificador de actividad, ¿solo a adultos?**
El plan dice "(adultos, no pérdida)", luego cachorros y jóvenes no lo reciben
y los planes de pérdida tampoco.
→ **Recomendación: confirmar literal.** Sin margen de interpretación; solo hay
que escribirlo como condición explícita en la spec para que Codex no lo aplique
a todos.

---

**D5 [P] — Comidas por edad.**
Plan 009: `< 4 meses → 4`; `4–12 → 3`; `adulto → 2`; **gato adulto con
`activityLevel = 'high'` → 3**.
→ **Recomendación: confirmar.** Es la única regla donde especie y actividad
cruzan en el conteo de comidas; conviene un test dedicado (gato adulto high →
3 comidas + los 3 horarios de 3 comidas).

---

**D6 [P] — Horarios de comida.**
Plan 009, tabla fija (no calculada):
- 2 comidas → `07:30`, `19:30`
- 3 comidas → `07:30`, `14:00`, `19:30`
- 4 comidas → `07:00`, `11:00`, `15:00`, `19:00`
→ **Recomendación: confirmar como constante nombrada**
(`MEAL_TIMES_BY_COUNT: Record<2|3|4, string[]>`), no como algoritmo de reparto.
Es una tabla de 3 entradas: cualquier "reparto uniforme entre 07:00 y 20:00"
sería más código y no reproduce estos valores (2 comidas uniformes darían
07:00/20:00, no 07:30/19:30).
Sub-decisión menor: formato `"07:30"` (string `HH:mm`, hora local del dueño,
sin zona). El repo no tiene precedente de columna de hora-del-día;
`meal_times` es `jsonb` según `data-model.md`, así que un array de strings
encaja. Confirmar que son horas locales y que #17 no hace conversión de zona.

---

**D7 [A] — Mascota sin peso (`pets.current_weight_kg IS NULL`).**
No hay criterio de aceptación para esto y es un caso muy alcanzable (mascota
recién dada de alta, sin ninguna pesada — `weightKg` ya no se acepta en
POST/PATCH `/v1/pets`, así que **toda mascota nace sin peso**).
- (a) 422 con código nuevo, p. ej. `PET_WEIGHT_REQUIRED`.
- (b) 422 reusando `NUTRITION_PROFILE_REQUIRED`.
- (c) Pedir `weightKg` en el propio perfil nutricional.
→ **Recomendación: (a).** Es el mismo status y la misma forma de error, con un
código distinto que le dice a la app a qué pantalla mandar al usuario
(registrar peso ≠ crear perfil). (b) mentiría. (c) crearía una tercera fuente
de verdad de peso y contradice la nota de `data-model.md` sobre el escritor
único.

---

**D8 [A] — BCS: ¿`nutrition_profiles.body_condition` o `weights.body_condition`?**
Ver hueco H1. Duplicación real entre #15 y #17.
- (a) El perfil manda; `weights.body_condition` se ignora en nutrición.
- (b) El último `weights.body_condition` no nulo manda; quitar la columna del
  perfil (desviación de `data-model.md`, requiere actualizar el doc).
- (c) El perfil manda si está informado; si es `null`, caer al último
  `weights.body_condition` no nulo.
→ **Recomendación: (a) para #17.** Es lo que `docs/data-model.md` ya declara,
no requiere método nuevo en `WeightRepository`, y mantiene el motor con un
input único y explícito. (c) es "más correcto" pero mete una lectura extra,
una regla de precedencia que hay que testear y un acoplamiento nuevo entre
módulos, para un caso que hoy nadie puede producir (`bodyCondition` es
opcional en `CreateWeightSchema` y probablemente esté casi siempre nulo).
Dejar (c) anotado como mejora futura.
**Consecuencia a escribir en la spec: si el perfil no trae `bodyCondition`, el
motor no puede emitir `weight_loss_plan` ni `underweight_vet` y usa el factor
de adulto por esterilización.**

---

**D9 [A] — Tipos y nullability de las columnas nuevas.**
`data-model.md` solo tipa `kcal_per_100g numeric(6,1)`. Propuesta completa,
alineada con los tipos ya usados en el repo:

`nutrition_profiles`
| columna | tipo propuesto | null |
|---|---|---|
| `pet_id` | `uuid` PK, FK → `pets.id` ON DELETE CASCADE | NOT NULL |
| `activity_level` | `varchar(10)` + CHECK in ('low','medium','high') | NOT NULL |
| `body_condition` | `integer` + CHECK between 1 and 9 | NULL |
| `target_weight_kg` | `numeric(5,2)` (igual que `pets.current_weight_kg` y `weights.weight_kg`) | NULL |
| `food_type` | `varchar(10)` + CHECK in ('dry','wet','mixed','homemade') | NOT NULL |
| `kcal_per_100g` | `numeric(6,1)` + CHECK between 80 and 600 | NOT NULL (ver D15) |
| `allergies` | `jsonb` | NOT NULL default `'[]'` |
| `diseases` | `jsonb` | NOT NULL default `'[]'` |
| `created_at` | `timestamptz` defaultNow | NOT NULL |
| `updated_at` | `timestamptz` defaultNow | NOT NULL |

`nutrition_plans`
| columna | tipo propuesto | null |
|---|---|---|
| `id` | `uuid` PK (UUIDv7 en app) | NOT NULL |
| `pet_id` | `uuid` FK → `pets.id` ON DELETE CASCADE | NOT NULL |
| `rer_kcal` | `integer` | NOT NULL |
| `mer_kcal` | `integer` | NOT NULL |
| `daily_grams` | `integer` | NOT NULL |
| `meals_per_day` | `integer` + CHECK between 1 and 6 | NOT NULL |
| `meal_times` | `jsonb` (array de `"HH:mm"`) | NOT NULL |
| `objective` | `varchar(20)` + CHECK in ('maintenance','weight_loss','growth') | NOT NULL |
| `warnings` | `jsonb` | NOT NULL default `'[]'` |
| `ai_explanation` | `text` | NULL (siempre null en #17) |
| `inputs_hash` | `char(64)` (sha256 hex; mismo tipo que `email_verification_tokens.token_hash`) | NOT NULL |
| `generated_at` | `timestamptz` defaultNow | NOT NULL |

Índices: `nutrition_plans_pet_id_generated_at_idx` on `(pet_id, generated_at DESC)`
(regla de historial de `data-model.md`). `nutrition_profiles` no necesita
índice extra (PK = FK).
→ **Recomendación: adoptar tal cual y actualizar `docs/data-model.md`** en la
misma spec, porque hoy esas dos filas del catálogo están sin tipar y el doc se
declara "referencia viva".
Nota: `rer_kcal`/`mer_kcal` como `integer` fija U3 (se persisten redondeados).

---

**D10 [A] — Semántica exacta del hash hit.**
- (a) Comparar solo contra el **último** plan de la mascota
  (`ORDER BY generated_at DESC LIMIT 1`) — literal del plan 009.
- (b) `UNIQUE (pet_id, inputs_hash)` + `ON CONFLICT DO NOTHING` y devolver el
  existente, sea cual sea su antigüedad.
→ **Recomendación: (a).** Es lo que el plan dice, y (b) tiene un
comportamiento raro: si el dueño cambia el pienso y luego vuelve al anterior,
(b) le devolvería el plan viejo con su `generated_at` de hace meses, mientras
(a) genera uno fresco. El criterio de aceptación *"mismo input → mismo plan
(hash hit, **sin fila nueva**)"* se cumple con (a) porque el test hace dos
generates consecutivos.
El test debe aserta **las dos cosas**: mismo `id` devuelto **y**
`SELECT count(*) FROM nutrition_plans WHERE pet_id = ...` sigue en 1.

---

**D11 [A] — Composición del input canónico del hash. (la más sutil)**
Ver RG5. El input del motor incluye `ageMonths`, que avanza solo con el
calendario aunque nada cambie.
- (a) Hashear el input completo del motor, `ageMonths` incluido. Consecuencia:
  el plan se regenera al cambiar de mes. En #17 (sin IA) eso es una fila más y
  ya; en #18 es una llamada a OpenAI pagada cada mes por mascota.
- (b) Excluir `ageMonths` y hashear solo lo que el usuario controla
  (perfil + peso + esterilizado + especie). Consecuencia: un cachorro que
  cumple 4 meses sigue con factor 3.0 hasta que alguien toque el perfil.
- (c) Hashear el input completo **más** el output del motor. Redundante:
  el motor es determinista, mismo input ⇒ mismo output.
→ **Recomendación: (a).** El coste de (a) es una regeneración mensual; el de
(b) es un plan clínicamente incorrecto servido como fresco, que es
exactamente el fallo que la nota de mantenimiento del plan 009 advierte
(*"o habrá planes obsoletos servidos como frescos"*). El ahorro de tokens de
#18 no vale servir calorías de cachorro a un perro adulto.
Sub-decisión de implementación (técnica, no de producto): **canonicalización**.
No hay precedente en el repo (§2.6). Recomendación: construir un objeto con
claves ordenadas explícitamente — no `Object.keys().sort()` genérico, sino un
literal escrito a mano en un orden fijo y documentado —, números normalizados
(`Number(x)`, no strings de `numeric`), arrays de `allergies`/`diseases`
ordenados alfabéticamente (el usuario puede mandar los mismos alérgenos en
otro orden y no es un input distinto), `JSON.stringify` y
`createHash('sha256').update(...).digest('hex')` como en
`verification-token.ts:23`. Test dedicado: mismo input con claves y arrays en
otro orden ⇒ mismo hash.

---

**D12 [A] — ¿`PetTrackingGuard` en las rutas de nutrición?**
Ver §2.7. Decisión de producto derivada del modelo de membresías de #25.
- (a) No: nutrición es parte de la app de salud gratuita.
- (b) Sí: nutrición requiere collar con suscripción activa.
→ **Recomendación: (a), sin guard.** *"free = app de salud sin GPS"* es la
decisión registrada de #25, y la nutrición no consume nada del collar. Pero
**el humano debe confirmarlo explícitamente**: es dinero, y una vez publicado
el endpoint sin muro, ponerlo después es un cambio incompatible para los
usuarios existentes.

---

**D13 [A] — Ubicación de `nutrition-engine.ts`.**
- (a) `backend-pet-tracker/src/modules/nutrition/domain/nutrition-engine.ts`
  + `.../domain/nutrition.constants.ts`.
- (b) `backend-pet-tracker/src/pipeline/nutrition-engine.ts`
  + constantes en `src/pipeline/constants.ts`.
→ **Recomendación: (a).** `src/pipeline/` es el hogar de la lógica pura que
consumen los **workers** (ingesta, geocercas, actividad) y su justificación
escrita en `architecture.md:104` es la portabilidad a Lambdas. El motor de
nutrición lo consume un use-case HTTP síncrono. Además
`feature_list.json` §files_affected ya apunta a `src/modules/nutrition/`, y
`docs/architecture.md:21` define `domain` exactamente como "sin imports de
ningún framework, ORM ni librería" — que es la propiedad que se quiere.
Precedentes de lógica pura dentro de un módulo:
`modules/health/application/weight-variation.ts`,
`modules/health/application/vaccine-date.ts`.
Ojo: esos dos están en `application/`, no en `domain/`. Si se prefiere
consistencia estricta con health, `application/nutrition-engine.ts` también
vale. Lo importante es que no importe NestJS, Drizzle ni el reloj.

---

**D14 [A] — Orden de redondeo y desempate.** Ver U1/U2.
- (a) `mer = Math.round(rer × factor)`; `grams = round5(mer / (kcal100/100))`.
  (redondear MER primero — es lo que se persiste, y derivar los gramos de lo
  que el usuario ve es coherente)
- (b) `grams = round5((rer × factor) / (kcal100/100))` con el MER crudo, y
  redondear el MER solo para persistirlo.
→ **Recomendación: (a).** Los dos anclajes dan idéntico resultado por ambos
caminos, así que ninguno es "más correcto" numéricamente; (a) gana porque hace
que el plan sea **internamente consistente**: un usuario que divida los
`mer_kcal` que ve entre los kcal/100 g de su pienso llega a los `daily_grams`
que ve. Con (b), en los casos divergentes (gatito de 1.2 kg: 25 g vs 30 g) la
cuenta del usuario no cuadra con la pantalla.
Desempate: `Math.round` de JS (half-up hacia +∞); con gramos positivos es
half-up. Escribirlo en la spec y en el JSDoc.
`round5(x) = Math.round(x / 5) * 5`.

---

**D15 [A] — Campos obligatorios vs opcionales del perfil, y defaults de
`kcalPer100g`.**
El plan 009 marca en su DTO: `activityLevel` obligatorio, `bodyCondition?`,
`targetWeightKg?`, `foodType` obligatorio, `kcalPer100g (80–600; defaults
sugeridos si null: dry 350, wet 100)`, `allergies` y `diseases` arrays.
**Hueco real: `food_type` admite 4 valores (`dry`,`wet`,`mixed`,`homemade`) y
el plan solo da default para 2.**
- (a) `kcalPer100g` opcional en el DTO; si falta, aplicar default por
  `foodType`: dry 350, wet 100, **mixed ?**, **homemade ?**.
- (b) `kcalPer100g` obligatorio siempre; los defaults 350/100 son solo un
  valor precargado en la UI, no lógica de backend.
→ **Recomendación: (a) con `mixed = 250` y `homemade = 150` como valores a
validar por el humano**, resolviendo la columna como NOT NULL en base (el
default se aplica en el use-case, no en la base, para que quede auditable qué
se guardó). Alternativa defendible y más honesta: **rechazar con 400 si
`foodType` es `mixed` u `homemade` y no viene `kcalPer100g`**, porque un
casero de 150 kcal/100 g inventado por nosotros no describe la comida de
nadie. **Los dos números nuevos son decisión clínica → humano (RG1).**
Sub-decisión: `allergies`/`diseases` — ¿obligatorios como `[]` o ausentes
permitidos? Recomendación: opcionales en el DTO con `.default([])` en Zod
(precedente: `ListWeightsQuerySchema` usa `.default()`), NOT NULL con default
`'[]'` en base. Así el motor nunca recibe `undefined`.
Sub-decisión: ¿`z.strictObject` rechaza claves extra? Sí en todos los DTOs del
repo; mantener.

---

**D16 [P] — Condiciones exactas de los warnings.**
Plan 009, literal:

| código | condición |
|---|---|
| `weight_loss_plan` | `bodyCondition >= 7` |
| `underweight_vet` | `bodyCondition <= 3` |
| `chronic_disease_vet` | `diseases` no vacío |
| `check_food_allergens` | `allergies` no vacío |
| `too_young_vet` | `ageMonths < 2` |

→ **Recomendación: confirmar tal cual.** Tres puntos que la spec debe cerrar y
el plan no dice:
1. `bodyCondition` es opcional (D8/D15): si es `null`, ni `weight_loss_plan` ni
   `underweight_vet` se emiten. Escribirlo.
2. Los warnings son **acumulables** (un perro con BCS 8, diabetes y alergia
   emite tres). El plan dice "lista de códigos + texto es", luego sí.
3. **Orden de la lista.** Si `warnings` entra en el hash o se compara en un
   test, el orden importa. Recomendación: orden fijo = el de la tabla de
   arriba, documentado como constante.
4. El plan pide *"lista de códigos + texto es"* → cada warning lleva su
   mensaje en español. Recomendación: `{ code, message }[]` con los textos
   como constantes nombradas junto a los factores. El único texto que el plan
   da literal es el de `chronic_disease_vet`: *"plan general; tu veterinario
   debe ajustarlo"*. **Los otros cuatro textos hay que redactarlos → producto.**

---

**D17 [A] — Definición de `objective`.**
El plan enumera los tres valores (`maintenance` | `weight_loss` | `growth`) y
los usa en los casos de test, pero **no da la regla**.
- (a) `weight_loss` si `bodyCondition >= 7`; si no, `growth` si `ageMonths < 12`;
  si no, `maintenance`.
- (b) `growth` si `ageMonths < 12` (gana la edad); si no, `weight_loss` si
  BCS ≥ 7; si no, `maintenance`.
→ **Recomendación: (b), para que sea coherente con D3.** Si en D3 la edad gana
y un cachopo con BCS 8 conserva el factor 3.0, su `objective` no puede decir
`weight_loss` — el plan que se le entrega es de crecimiento. Los dos casos de
test del plan 009 son compatibles con (a) y (b) por igual (el cachorro de 3
meses no tiene BCS; el perro BCS 8 de 30 kg es adulto), así que **no
discriminan** — de ahí que sea decisión abierta. **D3 y D17 deben cerrarse
juntas y con el mismo criterio.**

---

**D18 [A] — Alcance de #17 vs #18.**
El plan 009 §Paso 3 mezcla la generación del plan (que es #17) con la
llamada a OpenAI (que es #18). En #17, `ai_explanation` es siempre `null`
(así lo dice `feature_list.json`: *"Sin IA todavía (ai_explanation null)"*).
→ **Recomendación: confirmar que #17 no introduce ninguna variable de entorno
`OPENAI_*` ni la dependencia `openai`** (son de #18 según su descripción).
La columna `ai_explanation` sí se crea en la migración `0013` de #17, para que
#18 no necesite migración propia — mismo criterio ya usado con
`alert_events.status` ('acked' se crea en el CHECK aunque lo escriba #13).
Nota operativa: `env-drift.mjs` / `env-drift.test.mjs` vigilan la deriva de
`.env.example`; si #17 no añade env, no hay que tocarlos.

---

**D19 [A] — Verbo y semántica del upsert del perfil.**
`PUT /v1/pets/:petId/nutrition-profile` es upsert según el plan.
→ **Recomendación: `PUT` con reemplazo total** (no merge parcial): el cuerpo
completo sustituye la fila, `ON CONFLICT (pet_id) DO UPDATE`. Es lo que `PUT`
significa y evita la pregunta "¿cómo borro una alergia?". El repo no tiene
precedente de upsert por HTTP (`PATCH /v1/reminders/:id` y
`PATCH /v1/pets/:id` son merges parciales explícitos), así que hay que
escribirlo. Rol requerido: `@RequirePetRole('owner')` en `PUT` (igual que
`POST /weights`); `GET` sin decorador (cualquier miembro activo).
Sub-decisión: ¿`GET` sin perfil devuelve 404 o 200 con `null`?
Recomendación: **404** — es lo que hace el resto del repo para recursos
ausentes, y el 422 con `NUTRITION_PROFILE_REQUIRED` queda reservado para el
`generate`, que es donde el criterio de aceptación lo exige.

---

## 6. Recomendación de enfoque (sin implementarlo)

1. **Antes de la spec**: el humano cierra D3, D15 (los dos kcal nuevos), D16
   (los cuatro textos de warning) y D12. Son producto/clínica, condición de
   STOP declarada por el plan 009 (RG1). El resto puede cerrarlo el
   `spec_author` adoptando las recomendaciones de arriba.
2. **La spec debe transcribir el plan 009**, no referenciarlo. Codex no lee
   `plans/`; si la tabla MER no está en `specs/nutrition-profile-engine/`, la
   inventará.
3. **Orden de implementación sugerido** (test-primero, un commit rojo→verde por
   R-id, C4 de `CHECKPOINTS.md`):
   1. `nutrition.constants.ts` + `nutrition-engine.ts` puro, con los **cuatro**
      casos del plan 009 como tests unitarios. Los dos anclajes del criterio de
      aceptación son un par mínimo indivisible (§3.3 R1) — la spec debe decirlo
      para que nadie los "consolide" en uno.
   2. Migración `0013` (`pnpm db:generate`) + `nutrition.schema.ts` + barrel.
   3. Perfil: DTO Zod, repositorio, use-cases, controller `PUT`/`GET`.
      Test del `kcalPer100g 900 → 400`.
   4. Hash canónico + `POST .../nutrition-plan/generate` + `GET .../nutrition-plan`.
      Tests: 422 sin perfil, hash hit sin fila nueva, orden de claves
      irrelevante.
   5. e2e en `backend-pet-tracker/test/nutrition.e2e-spec.ts`.
   6. Actualizar `docs/data-model.md` con los tipos de D9.
4. **No crear abstracciones nuevas**: copiar `parseBody` local en el controller
   (está duplicado en todos), copiar la forma del error mapper, copiar la
   estructura de `reminders`. Lo único genuinamente nuevo en este repo es la
   canonicalización del hash (§2.6) y el primer 422 (§2.5).
5. **No** meter `PetTrackingGuard` salvo que D12 diga lo contrario.
6. `#18` empieza cuando `#17` esté mergeada — comparten archivos (RG6).
