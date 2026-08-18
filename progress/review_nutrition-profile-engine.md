# review: nutrition-profile-engine (#17)

Fecha: 2026-08-18
Branch: `feature/17-nutrition-profile-engine`
Rango revisado: `ae6c6aa..HEAD` (83 commits de Codex CLI)
Veredicto: **APROBADO**

> Con dos defectos menores de documentación/bookkeeping listados en
> §Observaciones. Ninguno toca código, tests ni cifras clínicas, y ninguno
> cae en las causales duras de rechazo del `reviewer`. Se corrigen en esta
> misma branch antes del PR.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#17, verificado por conteo)
- [x] `progress/current.md` describe la sesión activa de #17, con su bitácora al día
- [x] `progress/history.md` sin sesión previa sin cerrar

## Checklist C3 — Arquitectura

- [x] `domain` sin imports de infrastructure: los únicos imports no relativos del
      árbol `domain/` apuntan a `@/modules/nutrition/domain/...`. Cero `@nestjs/*`,
      cero `drizzle-orm`, cero `pg`, cero `zod`
- [x] `nutrition.repository.ts` es interfaz pura + token `Symbol('NutritionRepository')`,
      sin implementación
- [x] `application` depende del token `NUTRITION_REPOSITORY`, nunca de
      `NutritionDrizzleRepository`. El binding vive en `nutrition.module.ts`
      (`{ provide: NUTRITION_REPOSITORY, useClass: NutritionDrizzleRepository }`)
- [x] `infrastructure` implementa la interfaz de domain; el reloj (`new Date()`)
      lo inyecta el use-case a `calculateAgeMonths`, nunca el motor

## Checklist C4 — TDD

- [x] Los 27 requisitos R1..R27 tienen test que los nombra con el sufijo obligatorio
      `R<n> (nutrition-profile-engine #17)`. Grep sobre los cuatro archivos de test
      devuelve exactamente 27 R-ids únicos, sin huecos
- [x] Historial test-primero real, no reconstruido: **ningún** commit `test(...)`
      del rango toca un archivo que no sea `*.spec.ts`/`*.test.ts` (verificado
      recorriendo los 27 commits de test con `git show --name-only`). El patrón
      rojo→verde→docs se repite por R-id
- [x] Excepciones declaradas y verificadas por mutación (ver punto 2): R14 y R27
      nacieron verdes; están documentadas como tal en la trazabilidad y en el
      reporte del implementador

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin ninguna fila "pendiente" — 27 filas, todas pobladas
- [x] Las 27 filas traen **dos** hashes (rojo/verde); R15 trae tres
- [x] Los **54 hashes** citados resuelven a commits reales y todos caen dentro de
      `ae6c6aa..HEAD` (verificado uno a uno con `git cat-file -e`)
- [x] Commits en formato `feat(nutrition-profile-engine): <desc> (R<n>)`

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` en el frontmatter
- [x] `[X] Aprobado por humano (fecha: 2026-08-18)` marcado
- [x] Ningún requisito modificado después de la aprobación: el rango de Codex no
      toca `requirements.md`, `design.md` ni `tasks.md` (solo `traceability.md`)

## Checklist C7 — Sin código huérfano

- [ ] N/A — `nutrition` es un módulo nuevo. No reemplaza ni deja obsoleto ningún
      componente anterior; no hay código ni tests que eliminar

---

## Auditoría de los seis puntos específicos

### 1. El commit `b0ef38f` "satisfy quality gates" — LEGÍTIMO

La premisa del encargo ("saldo neto de -63 líneas, -32 en `nutrition-engine.spec.ts`")
viene de leer la columna de `--stat`, que suma líneas *cambiadas*, no el saldo.
El `--numstat` real es **59 inserciones / 63 supresiones = neto -4**, y en
`nutrition-engine.spec.ts` **13 / 19 = neto -6**.

Revisado línea a línea. **No se aflojó ninguna aserción, no se borró ningún caso,
no se convirtió ninguna comprobación exacta en laxa.** El contenido es de tres
tipos, todos mecánicos:

1. **Reformateo de Prettier** — colapso de llamadas multilínea a una línea. Ej.
   `expect(...).toContainEqual({...})` reindentado en R12; el argumento es idéntico.
2. **Corrección de tipo en `it.each`** — `it.each<Array<[A,B,C]>>` → `it.each<[A,B,C]>`.
   El genérico correcto de `it.each` es la tupla del caso, no un array de tuplas.
   Es un arreglo de corrección, no un aflojamiento; las tablas de casos conservan
   todas sus filas.
3. **Tipado explícito de `response.body`** — `expect(response.body.id)` →
   `const body = response.body as {...}; expect(body.id)`. Satisface
   `no-unsafe-member-access` de ESLint sin cambiar qué se asevera.

Contraprueba cuantitativa, antes vs. después del commit, en los cinco archivos de test:

| archivo | `it`/`test` antes→después | `expect(` antes→después |
|---|---|---|
| `nutrition-engine.spec.ts` | 29 → 29 | 47 → 47 |
| `test/nutrition.e2e-spec.ts` | 19 → 19 | 97 → 97 |
| `nutrition.schema.spec.ts` | 3 → 3 | 30 → 30 |
| `nutrition-input-hash.spec.ts` | 3 → 3 | 3 → 3 |
| `nutrition-scope.spec.ts` | 1 → 1 | 5 → 5 |

Ni un caso ni una aserción perdidos. El e2e además **crece** (+35/-21).

Los dos archivos de producción que toca son igual de inocuos:

- `nutrition-plan.entity.ts`: reformateo de un `Omit<>`.
- `nutrition.drizzle.repository.ts`: elimina los casts redundantes
  `as NutritionObjective`, `as NutritionWarning[]`, `as NutritionActivityLevel`,
  `as NutritionFoodType`. **Comprobado que no ensanchan el tipo**: el schema ya
  declara esas columnas con `.$type<...>()` (`activityLevel`, `foodType`,
  `objective`, `warnings`), así que el tipo sigue siendo el estrecho. Las
  conversiones `Number(row.kcalPer100g)` y `Number(row.targetWeightKg)` de R27
  siguen intactas.

**Veredicto del punto: legítimo. No es rechazo.**

### 2. R14 y R27 "nacen verdes" — el par ancla SÍ discrimina

No me basté con que pasen. Ejecuté las tres mutaciones sobre mi copia
(`npx jest nutrition-engine.spec.ts` tras cada una) y **revertí con
`git checkout --`; el árbol quedó limpio** (`git status --porcelain` vacío al
terminar, verificado).

| mutación en `nutrition-engine.ts` | resultado esperado | resultado real |
|---|---|---|
| `Math.round` → `Math.floor` en `round5` | muere el perro 20 kg (305 g) | **ROJO**: caso 1 `dailyGrams 305 → 300`; también cae el caso 4 (`225 → 220`). 2 failed / 48 passed |
| `Math.round` → `Math.ceil` en `round5` | muere el gato 4 kg (60 g) | **ROJO**: caso 2 `dailyGrams 60 → 65`; también caen R4 (`25 → 30`) y el caso 3 (`200 → 205`). 3 failed / 47 passed |
| gramos derivados del MER **sin** redondear (`rerRaw * factor` en vez de `merKcal`) | muere el gato 1.2 kg (25 g, no 30) | **ROJO**: solo R4 `dailyGrams 25 → 30`. 1 failed / 49 passed |

Los dos anclas de R14 hacen exactamente el trabajo que la spec les asigna: el
del perro elimina `floor`, el del gato elimina `ceil`, ninguno sobrevive a su
mutación. Y la tercera mutación confirma el diseño de la spec al pie de la letra:
**solo el caso discriminante de R4 la detecta** — los cuatro anclas de R14
sobreviven a ella, que es precisamente la razón por la que R4 necesitaba su
propio caso sintético.

Las cuatro aserciones de R14 son `toEqual` sobre el objeto completo (los siete
campos), no `toMatchObject`, así que ninguna deriva silenciosa pasa.

### 3. Las ocho guardas de seguridad clínica — las ocho con anti-vacío

Verificado en el estado actual del código, **después** de `b0ef38f`:

| guarda | test | aserción anti-vacío presente |
|---|---|---|
| R8 `weight_loss_plan` | `nutrition-engine.spec.ts:329` | `hasWarning(5) === false` y `hasWarning(null) === false` |
| R9 `underweight_vet` | `:352` | `hasWarning(5) === false` y `hasWarning(null) === false` |
| R10 `chronic_disease_vet` | `:368` | `diseases: []` ⇒ `.some(...) === false` |
| R11 `check_food_allergens` | `:387` | `allergies: []` ⇒ `.some(...) === false` |
| R12 `too_young_vet` | `:411` | `ageMonths: 2` (frontera exclusiva) y `24` ⇒ `false` |
| R22 `NUTRITION_PROFILE_REQUIRED` (422) | `nutrition.e2e-spec.ts:386` | con perfil, `JSON.stringify(body)` `not.toContain` el código |
| R23 `PET_WEIGHT_REQUIRED` (422) | `:431` | con peso registrado, `not.toContain` el código |
| R25 guard sin muro de pago | `:564` | `not.toContain('DEVICE_SUBSCRIPTION_REQUIRED')` + `'Forbidden'` + `'Not Found'` |

Ocho de ocho. Ninguna pasaría con un array que siempre trajera los cinco warnings.
R13 refuerza con un `toEqual` del array completo y en orden, y con
`warnings toEqual([])` en el caso sin condiciones.

### 4. La migración `0013_wet_may_parker.sql` contra la tabla normativa de R15

Contrastada columna por columna. **Coincide exactamente**, incluidos tipos,
nullability, nombres de CHECK, CASCADE e índice:

- `nutrition_profiles`: `pet_id uuid PK` FK→`pets(id)` `ON DELETE cascade`;
  `activity_level varchar(10) NOT NULL`; `body_condition integer` NULL;
  `target_weight_kg numeric(5,2)` NULL; `food_type varchar(10) NOT NULL`;
  `kcal_per_100g numeric(6,1) NOT NULL` (OV1); `allergies`/`diseases jsonb NOT NULL
  DEFAULT '[]'::jsonb`; `created_at`/`updated_at timestamptz NOT NULL DEFAULT now()`.
- `nutrition_plans`: `id uuid PK`; `pet_id uuid NOT NULL` FK cascade;
  `rer_kcal`/`mer_kcal`/`daily_grams`/`meals_per_day integer NOT NULL`;
  `meal_times jsonb NOT NULL`; `objective varchar(20) NOT NULL`;
  `warnings jsonb NOT NULL DEFAULT '[]'::jsonb`; `ai_explanation text` NULL;
  `inputs_hash char(64) NOT NULL`; `generated_at timestamptz NOT NULL DEFAULT now()`.

**Los seis CHECKs, por nombre**, todos presentes:
`nutrition_profiles_activity_level_check`, `..._body_condition_check`,
`..._food_type_check`, `..._kcal_per_100g_check`,
`nutrition_plans_meals_per_day_check`, `nutrition_plans_objective_check`.

**Codex tiene razón en su nota**: R15 (tabla normativa de `requirements.md`)
define seis CHECKs con nombre; la frase de `tasks.md:176` dice "los cinco CHECKs".
El desfase es un lapsus de redacción de la spec, no un defecto de implementación —
`requirements.md` es la fuente normativa y la migración la cumple.

- [x] Índice `nutrition_plans_pet_id_generated_at_idx` sobre
      `("pet_id","generated_at" DESC NULLS LAST)`
- [x] **No** existe `UNIQUE (pet_id, inputs_hash)` (además aseverado por
      `not.toMatch(/UNIQUE\s*\(\s*"pet_id"\s*,\s*"inputs_hash"/i)`)
- [x] Archivo **nuevo** `0013_*.sql`; ninguna migración previa editada
- [x] Los tres artefactos van al **mismo** commit `89efb95`: `.sql`,
      `meta/0013_snapshot.json` y la entrada `idx: 13` en `meta/_journal.json`
- [x] La migración **no** contiene `ALTER TABLE "pets"` ni `ALTER TABLE "weights"`
      (sus únicos `ALTER TABLE` son sobre las dos tablas nuevas, para añadir sus FKs)

### 5. Las 2 suites y 6 tests omitidos en e2e — ninguno es de nutrición

Identificados:

- `test/aws-real-ingest.e2e-spec.ts` — `(runAwsIngest ? describe : describe.skip)`,
  con `runAwsIngest = process.env.AWS_MODE === 'aws'`
- `test/aws-real-smoke.e2e-spec.ts` — `(runSmoke ? describe : describe.skip)`,
  mismo gate

Son las suites contra la cuenta AWS real, que `CLAUDE.md` reserva explícitamente
al humano ("lo que no se delega a ninguna IA"). Se omiten porque la corrida es
local (`AWS_MODE` no es `aws`), no porque alguien las apagara.

`backend-pet-tracker/test/nutrition.e2e-spec.ts` tiene **cero** marcadores
`.skip`/`xit`/`xdescribe`/`.todo` (grep -c = 0): sus 19 tests corrieron y pasaron.

### 6. Los tres overrides humanos, en el código

**OV1 — `kcalPer100g` obligatorio, sin default 350/100.**
`nutrition-profile.dto.ts` declara `kcalPer100g: z.number().min(KCAL_PER_100G_MIN)
.max(KCAL_PER_100G_MAX)` — sin `.optional()`, sin `.default()`, dentro de un
`z.strictObject`. Grep de `350`/`100` como default en todo
`src/modules/nutrition/` (excluyendo tests): **cero coincidencias**. El e2e de R18
cubre el caso `['dry sin kcal', { activityLevel: 'medium', foodType: 'dry' }]` ⇒
`400`, y el `kcal 900` ⇒ `400`. La columna es `NOT NULL` en la migración.

**OV2 — la edad gana a la pérdida de peso.** En `computePlan`:
`isWeightLoss = !isGrowth && bodyCondition >= 7`, así que `ageMonths < 12` fuerza
`objective: 'growth'` y el factor de crecimiento; el modificador de actividad vive
solo en la rama adulta-no-pérdida. `baseWeightKg` usa `targetWeightKg` únicamente
si `objective === 'weight_loss'`, de modo que el RER de un animal en crecimiento
se calcula **siempre sobre `weightKg`**. Y el warning se emite igual: la condición
de `weight_loss_plan` en `warningConditions` depende solo de `bodyCondition >= 7`,
sin mirar `isGrowth`. Cubierto por tres tests independientes:

- R2 `'OV2 usa weightKg en crecimiento aunque BCS y target esten informados'`
  (weightKg 5 / target 4 / ageMonths 3 / BCS 8 ⇒ RER sobre 5)
- R7 `'edad sobre BCS'` (ageMonths 3, BCS 8 ⇒ `'growth'`)
- R8 caso cachorro-con-BCS-8 ⇒ warning presente **y** `objective === 'growth'`

**OV3 — sin `PetTrackingGuard`.** `nutrition.controller.ts` lleva un único
`@UseGuards(PetAccessGuard)` a nivel de clase; las cuatro rutas solo añaden
`@RequirePetRole('owner')` en las dos de escritura. Grep de `PetTrackingGuard`
en todo `src/modules/nutrition/` y en el e2e: **ninguna coincidencia**. El e2e de
R25 `'anti-vacio: el owner genera sin suscripcion y sin errores de acceso'` crea
mascota sin `device_subscriptions` y asevera `200` en `generate` más la ausencia
de `DEVICE_SUBSCRIPTION_REQUIRED`.

---

## Verificaciones adicionales del protocolo

- **R1, aserción por texto plano**: `nutrition-engine.spec.ts` lee el fuente con
  `readFileSync(join(__dirname, 'nutrition-engine.ts'))` y asevera
  `not.toContain` sobre `'3.0'`, `'1.6'`, `'0.75'`, `'70'`, `'07:30'`,
  `'La condicion corporal'`, `'Plan general; tu veterinario'`,
  `'Registraste alergias'`, `'Es una mascota de menos'`, más `'@nestjs/'`,
  `'drizzle-orm'`, `"from 'pg'"`, `"from 'zod'"`, `'Date.now'`, `'new Date'`;
  y `toContain("from './nutrition.constants'")`. Comprobado además a mano que el
  JSDoc de `computePlan` no transcribe ninguna cifra: remite a las constantes por
  nombre, como exige R1.
- **Alcance**: el diff `ae6c6aa..HEAD` toca 31 archivos y **todos** están
  declarados en `design.md` §Archivos afectados. En particular, cero cambios en
  `src/modules/pets/`, `src/modules/health/`, `src/modules/subscriptions/`,
  `package.json`, `.env.example`, `scripts/env-drift.mjs` y `plans/`.
  `PetProfileResponse` queda intacto por construcción.
- **`docs/data-model.md`**: las dos filas del catálogo quedaron completadas con
  tipos, nullability, los seis CHECKs, `ON DELETE CASCADE`, el índice y la nota
  "sin UNIQUE por hash". (Con el defecto de formato de §Observaciones.)
- **R20**: `nutritionInputHash` escribe las diez claves a mano en el orden exacto
  de la spec, normaliza con `Number(...)`, colapsa `undefined`/`null` a `null`
  con `== null`, y ordena copias (`[...input.allergies].sort()`) sin mutar el input.
- **R21/R22/R23**: `generate-nutrition-plan.use-case.ts` evalúa el perfil **antes**
  que el peso (precedencia de R23 respetada), compara contra `findLatestPlan`
  únicamente, y retorna el plan existente sin insertar en el hash hit.

## Output de `./init.sh` (corrida propia, no la del implementador)

Precondición verificada antes de correr: Postgres publica puerto de verdad —
`docker ps` muestra `0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp` en
`pet-tracker-postgres` (`Up 2 hours (healthy)`), de modo que los e2e **no** se
saltaron en silencio. Infra caliente desde el arranque, sin necesidad de repetir.

```
→ Verificando entorno...
→ Verificando variables de entorno...
→ Instalando dependencias...
→ Verificando coherencia del harness...
→ Build...
→ Ejecutando tests...
Test Suites: 143 passed, 143 total
Tests:       1111 passed, 1111 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
✅ Tests pasados

→ Tests e2e...
Test Suites: 2 skipped, 20 passed, 20 of 22 total
Tests:       6 skipped, 319 passed, 325 total
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 28/30 completadas | 1 pendientes
```

Exit code: **0**. Sin regresiones: 1111 unitarios + 14 de infra + 319 e2e en verde.

El log incluye el `FK 23503` en `pet_users` (`pet_users_user_id_users_id_fk`,
desde `CreatePetUseCase`), pero **Jest terminó verde y ningún test falló**: es el
ruido conocido ya registrado en `progress/current.md` al arrancar la sesión, no
una regresión de #17 (la traza no pasa por nutrición).

---

## Observaciones

Ninguna bloqueante. Dos defectos menores a corregir en esta branch antes del PR;
ambos son de documentación/bookkeeping y no requieren tocar código ni tests:

1. **`docs/data-model.md` — tabla markdown partida en dos.** El commit insertó
   una línea en blanco más el párrafo
   "Las tablas de nutricion se crean en la migracion `0013_wet_may_parker.sql`."
   **dentro** de la tabla del catálogo, entre la fila `nutrition_plans` y la fila
   `push_tokens` (líneas 63-65). Eso corta la tabla: las tres filas siguientes
   (`push_tokens`, `audit_log`, `activity_daily`) quedan huérfanas fuera de ella y
   renderizan como texto con pipes, sin cabecera. El doc se declara "referencia
   viva", así que conviene arreglarlo.
   *Corrección*: mover ese párrafo **debajo** de la última fila de la tabla
   (después de `activity_daily`), dejando las filas contiguas.

2. **`traceability.md` — mensaje de commit mal citado en la fila R27.** La fila
   cita `45e9f24 feat(nutrition-profile-engine): implement profile replacement
   upsert (R16)`, pero el mensaje real de `45e9f24` es
   `feat(nutrition-profile-engine): add profile replacement endpoint (R16)`
   (que es justamente como lo cita, bien, la fila R16). El hash es correcto y
   resuelve a un commit real, así que la traza no se rompe; es solo el texto
   citado.
   *Corrección*: alinear el texto de la fila R27 con el mensaje real.

Ninguna de las dos cae en las causales de rechazo: `init.sh` termina en 0, no hay
regresiones, no hay filas "pendiente" y los 27 R-ids están nombrados por sus tests.

## Nota para el leader

- La feature queda **abierta**: no toqué `feature_list.json`, `STATUS.md` ni
  `progress/history.md`, y no abrí PR. Codex respetó la prohibición de cerrarla
  él mismo (a diferencia de #29).
- No edité código de la aplicación. Las tres mutaciones del punto 2 se revirtieron
  con `git checkout --` y el árbol quedó limpio.
