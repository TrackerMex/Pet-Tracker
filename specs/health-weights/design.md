---
feature: "health-weights"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[health-weights]]

> Ver [[requirements]] y [[../../docs/architecture|architecture]].
>
> Esta spec está escrita para ser **autosuficiente**: quien implemente no tiene
> acceso a la conversación que la originó. Toda ruta, símbolo, nombre de tabla
> y de columna que aparece aquí es literal.

## Decisiones técnicas

### D1 — La tabla vive en `health.schema.ts`, la migración es nueva (R1)

`weights` se añade a `backend-pet-tracker/src/db/schema/health.schema.ts`, junto
a `vaccineCatalog` y `petVaccines`: `feature_list.json` #15 declara
`files_affected: ["backend-pet-tracker/src/modules/health/"]` y
`docs/data-model.md` agrupa el peso bajo el plan 008. El barrel
`src/db/schema/index.ts` ya reexporta ese archivo — **no hay que tocarlo**.

Declaración drizzle exacta:

```
export const weights = pgTable('weights', {
  id: uuid('id').primaryKey(),
  petId: uuid('pet_id').notNull().references(() => pets.id, { onDelete: 'cascade' }),
  weightKg: numeric('weight_kg', { precision: 5, scale: 2 }).notNull(),
  bodyCondition: integer('body_condition'),
  measuredAt: date('measured_at').notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id),
}, (table) => [
  check('weights_body_condition_check', sql`${table.bodyCondition} between 1 and 9`),
  index('weights_pet_id_measured_at_idx').on(table.petId, table.measuredAt.desc()),
  index('weights_created_by_idx').on(table.createdBy),
]);
```

La migración se genera con `pnpm -C backend-pet-tracker run db:generate`
(drizzle-kit) y sale como `src/db/migrations/0010_<tag>.sql` + su
`meta/0010_snapshot.json` y la entrada en `meta/_journal.json`.

**Trampa a evitar**: `src/db/schema/health.schema.spec.ts:58-64` (test de #14)
lee la migración que contiene `CREATE TABLE "vaccine_catalog"` — es decir,
`0009_shallow_dust.sql` — y asevera que **no** contiene
`ALTER TABLE "pets"` ni `CREATE TABLE "weights"`. Ese test sigue verde mientras
`weights` viva en un archivo de migración **nuevo**. Si se regenera o se edita
`0009` para meter la tabla ahí, ese test rompe. No editar migraciones ya
aplicadas.

Sin `created_at`: `pet_vaccines` tampoco lo tiene y el id es UUIDv7, que ya
codifica el instante de inserción. Es también el orden de desempate de R5.

### D2 — `weight_kg` es `numeric(5,2)` y se convierte a mano en el repositorio (R2)

Misma precisión y escala que `pets.current_weight_kg`
(`pets.schema.ts:36`, `numeric('current_weight_kg', { precision: 5, scale: 2 })`):
son **la misma magnitud** y copiar entre columnas de distinta escala
introduciría redondeos silenciosos. El tope 999.99 es exactamente el rango que
el DTO de #5 ya valida (`weightKg: z.number().gt(0).lte(999.99)` en
`create-pet.dto.ts:28`, comentado como "tope de numeric(5,2)").

`node-postgres` devuelve `numeric` como **string** y el proyecto **no** toca los
type parsers globales de `pg` ni usa `mode: 'number'` — hay exactamente dos
columnas `numeric` y las dos convierten a mano en el borde de infraestructura:

- `pets.current_weight_kg`: `String(...)` al escribir
  (`pet.drizzle.repository.ts:139` y `:123`), `Number(...)` al leer (`:152`),
  con el comentario `/** numeric(5,2) viaja como string en el driver pg. */`.
- `activity_daily.avg_walk_minutes`: `toFixed(2)` al escribir
  (`activity.drizzle.store.ts:112`), `Number(...)` al leer (`:208-209`).

`WeightDrizzleRepository` sigue el patrón de `pets` por ser la misma columna
lógica: escribe `String(data.weightKg)` y lee `Number(row.weightKg)`. El
redondeo a 2 decimales lo hace **Postgres**, una sola autoridad; como el
`INSERT` usa `.returning()`, la respuesta HTTP siempre refleja el valor
almacenado, no el enviado.

`bodyCondition` es `integer` (no `smallint`): es el tipo entero que usa el resto
del schema (`activity.schema.ts`).

### D3 — Semántica de `variation` (R5)

- **Unidad**: kilogramos. **Signo**: positivo = la mascota ganó peso respecto a
  la medición anterior.
- **Redondeo**: `Math.round((actual - anterior) * 100) / 100`. Sin él,
  `70.2 - 69.8` sale `0.40000000000000568` en JSON.
- **Primera medición → `null`, no `0`.** Un `0` significa "pesó exactamente lo
  mismo que la vez anterior" y es un dato real que la UI dibuja como flecha
  horizontal; colapsarlo con "no hay línea base" haría indistinguibles dos
  situaciones distintas. `null` para "todavía no hay dato" es además el idioma
  ya establecido en el perfil (`nextVaccine`, `nextReminder`,
  `activitySummary`).
- **Orden total**: `(measured_at, id)` ascendente, no solo `measured_at`. Dos
  mediciones del mismo día son legales (R2) y sin desempate la "anterior" sería
  no determinista. Como el id es UUIDv7, el desempate por id equivale al orden
  de inserción.
- **Se calcula sobre el historial completo**, no sobre la página. Implementación:
  el caso de uso pide al repositorio `limit + 1` filas en orden
  `measured_at DESC, id DESC`; la fila extra ("fila de sonda") es solo la línea
  base del último elemento y se descarta antes de responder. Es el mismo truco
  que `ListAlertsUseCase` ya usa (`limit: ALERTS_PAGE_SIZE + 1`,
  `list-alerts.use-case.spec.ts:92`). El último elemento devuelto solo recibe
  `variation: null` cuando **no** vino fila de sonda, es decir cuando es
  genuinamente la medición más antigua de la mascota.
- La lógica vive en una **función pura** en `application/`, sin base de datos,
  para poder testear los casos 0/1/2 mediciones como pide el plan 008
  ("tests de servicio ... variación de peso con 0/1/2 mediciones").

El `POST` devuelve el mismo shape que el `GET`, con la misma regla: shapes
distintos según el verbo obligarían al cliente a dos parsers. Para calcularlo
sobre una medición recién insertada (que puede ser retroactiva y por tanto no
la última) el repositorio expone `findPrevious(petId, measuredAt, id)`.

### D4 — "La más reciente" y el empate (R3)

El predicado es **negativo y estricto**, evaluado por Postgres dentro del mismo
`UPDATE`:

```
UPDATE pets SET current_weight_kg = <nuevo>, updated_at = now()
WHERE id = <petId>
  AND NOT EXISTS (SELECT 1 FROM weights w
                  WHERE w.pet_id = <petId> AND w.measured_at > <measuredAt>)
```

En drizzle: `tx.update(pets).set({...}).where(and(eq(pets.id, ...), notExists(...)))`
con `notExists`, `gt` y `and` de `drizzle-orm`.

- Se ejecuta **después** del `INSERT` y en la misma transacción, así que la fila
  recién creada ya es visible para la subconsulta; como la comparación es
  estricta (`>`), la fila nueva nunca se bloquea a sí misma.
- **Alta retroactiva** (`measuredAt` anterior a una medición existente): existe
  una fila con `measured_at` mayor ⇒ 0 filas actualizadas ⇒
  `current_weight_kg` intacto. Es el criterio de aceptación 2 de
  `feature_list.json`.
- **Empate exacto de `measured_at`**: no hay ninguna fila estrictamente
  posterior ⇒ el `UPDATE` se aplica y la nueva medición gana. Se decide así
  porque pesar dos veces el mismo día es una corrección, y porque deja el
  invariante limpio: *el dueño de `current_weight_kg` es siempre el máximo del
  orden total `(measured_at, id)` de D3*.
- Evaluar el predicado en SQL en vez de con un `SELECT` previo en TypeScript
  evita el read-modify-write: no hay ventana entre "compruebo" y "escribo".

`ponytail:` techo conocido — dos `POST` concurrentes sobre **la misma mascota**
en la misma transacción-ventana pueden, bajo `READ COMMITTED`, ambos ver un
historial sin fila posterior. El bloqueo de fila de Postgres sobre `pets`
serializa los dos `UPDATE` y el segundo reevalúa su `WHERE` con snapshot fresco,
así que el caso realista queda cubierto; una carrera perfecta sigue siendo
teóricamente posible. Se acepta: una mascota la pesa una persona a la vez. Si
alguna vez importa, la subida es `SELECT ... FOR UPDATE` sobre la fila de `pets`
al abrir la transacción.

### D5 — `measuredAt` futuro se rechaza, con un día de tolerancia (R7)

Una medición de peso es la **observación de un hecho pasado**: no se puede haber
pesado a la mascota la semana que viene. Se rechaza con `400`, en la misma línea
que `appliedAt` en #14 (`vaccine.dto.ts:12-15`) y `birthDate` en #5
(`create-pet.dto.ts:9-12`).

Es deliberadamente lo contrario de `reminders.dueAt` (#16), que exige futuro: un
recordatorio es una **intención** sobre el futuro, no una observación.

**Pero el corte no es "hoy en UTC" a secas.** El rango de husos horarios del
planeta es UTC-12..UTC+14, o sea **26 horas**: un usuario en UTC+14 que registre
su fecha local de hoy la envía como *mañana* en UTC y se comería un `400` por
una medición perfectamente legítima. Este repositorio ya cuidó exactamente esa
esquina en `trips-activity` (#10, caso 23:50 `America/Mexico_City`), así que
aplicar aquí el corte crudo sería una asimetría injustificada.

Regla final: se rechaza `measuredAt > hoyUTC + MEASURED_AT_MAX_FUTURE_DAYS`, con
`MEASURED_AT_MAX_FUTURE_DAYS = 1` exportada desde
`src/modules/health/application/dto/weight.dto.ts` (misma casa que
`WEIGHTS_DEFAULT_LIMIT` y `WEIGHTS_MAX_LIMIT`, para que los tests la referencien
en vez de repetir el número). `hoyUTC` sigue siendo
`new Date().toISOString().slice(0, 10)`. Bordes observables: `hoy` → `201`,
`hoy + 1` → `201`, `hoy + 2` → `400`.

**Por qué NO se lee la zona horaria del actor** (esto está escrito para que nadie
lo "arregle" después metiendo la dependencia): existe
`localDayOf()` en `src/pipeline/local-day.ts` y `users.timezone` en la tabla de
usuarios, y con ellos el corte sería exacto. Se descarta a propósito porque
obliga a una consulta extra a `users` y a una dependencia permanente
`health → users` en un `POST` que hoy es autocontenido, todo para blindar un caso
**sin consecuencia real**: una medición fechada mañana no rompe nada — el orden
total `(measured_at, id)` de D3 sigue siendo correcto, `variation` sigue siendo
correcta y `current_weight_kg` acaba en la medición más reciente, que es
exactamente lo que el usuario quería. Un día de tolerancia compra la corrección
de zona horaria a coste cero. Si algún día hace falta el corte exacto, el camino
es `localDayOf(users.timezone)`, no ampliar la tolerancia.

### D6 — `?limit=` plano, con default y tope (R6)

`feature_list.json` #15 pide literalmente `GET .../weights?limit=`, así que aquí
sí se acepta el parámetro. Es una **divergencia consciente** de `GET /v1/alerts`
(#13), que devuelve `400` ante `?limit=` y fija el tamaño de página en
`ALERTS_PAGE_SIZE` con cursor keyset: allí la lista es un feed potencialmente
enorme y global al usuario; aquí es el historial acotado de **una** mascota y el
consumidor (gráfico de peso) pide explícitamente "las últimas N".

- `WEIGHTS_DEFAULT_LIMIT = 50`, `WEIGHTS_MAX_LIMIT = 100`, exportadas desde
  `weight.dto.ts`, para que los tests las referencien en vez de repetir números.
- Validación: `limit: z.coerce.number().int().min(1).max(WEIGHTS_MAX_LIMIT).default(WEIGHTS_DEFAULT_LIMIT)`.
  `z.coerce` es necesario porque la query string llega siempre como texto.
  `?limit=` vacío coerce a `0` y falla `min(1)`; `?limit=abc` coerce a `NaN` y
  falla `int()`. Ambos ⇒ `400`.
- El objeto es `z.strictObject`, como `ListAlertsQuerySchema`
  (`list-alerts.dto.ts:9`): un parámetro desconocido es `400`, no un silencio.
- Sin `nextCursor` en la respuesta: el `GET` devuelve un array desnudo, igual
  que `GET /v1/pets/:petId/vaccines` (#14 R9).

### D7 — Transacción y quién escribe `pets` (R4)

El `INSERT` en `weights` y el `UPDATE` de `pets` van en un único
`db.transaction(async (tx) => { ... })` dentro de `WeightDrizzleRepository.create()`,
mismo patrón que `PetDrizzleRepository.createWithOwner()`
(`pet.drizzle.repository.ts:35`).

Por qué transacción, y no dos escrituras sueltas:

1. Son **un solo hecho de negocio** ("la mascota pesa X"). Un fallo entre las
   dos deja el perfil mostrando un peso que ningún registro del historial
   explica, y no hay proceso que reconcilie.
2. `nutrition-profile-engine` (#17) calcula `RER = 70 × peso^0.75` a partir del
   peso de la mascota: una desincronización no produce un error visible,
   produce un plan de alimentación silenciosamente equivocado.
3. Cierra la carrera read-modify-write junto con el predicado de D4.

Por qué el repositorio de `health` escribe en la tabla `pets` en vez de delegar
en `PetRepository.update()`: delegar rompe la atomicidad (dos instancias de
repositorio, sin transacción compartida) y `PetFieldChanges` no puede expresar
el predicado condicional de D4. Hay precedente exacto y documentado en el
proyecto: `alerts-engine` (#12) escribe `geofences.geofence_state` vía
`AlertsEngineStore.updateGeofenceState()` sin pasar por `GeofenceRepository`
(`docs/data-model.md`, fila `geofences`). Sigue siendo infraestructura
escribiendo infraestructura: ninguna capa interna se entera.

El `UPDATE` refresca también `pets.updated_at`, como hace cualquier otra
escritura sobre esa tabla (`pet.drizzle.repository.ts:124`).

### D8 — Autorización y auditoría reutilizadas tal cual (R8, R9, R10)

`WeightsController` se monta en `pets/:petId/weights` con
`@UseGuards(PetAccessGuard)` a nivel de clase y `@RequirePetRole('owner')` solo
en el `POST` — copia literal del reparto de `VaccinesController`
(`vaccines.controller.ts:47-58`). El guard ya garantiza que el `404` precede al
`403` (`pet-access.guard.ts:49-73`) y que un `:petId` malformado ni siquiera
toca la base. **No se escribe guard, repositorio de mascotas ni chequeo de
membresía nuevo.**

Auditoría: `weight.create` / `entity: 'weight'` / `meta: { petId }`, registrada
por `CreateWeightUseCase` **después** de que la transacción resuelva, igual que
`CreateVaccineUseCase` (`create-vaccine.use-case.ts:61-67`) y por el mismo
motivo que #14 R12: una escritura fallida nunca se audita. `AuditLogger` es el
puerto `@Global()` de `src/audit/audit-log.repository.ts`; la tabla `audit_log`
ya existe, **no se genera migración para ella**.

### D9 — Errores: no hace falta ninguno nuevo

Todos los fallos de esta feature son `400` (zod, en el borde HTTP), `403` o
`404` (guard). Ningún caso produce un error de dominio, así que **no** se crean
`weight.errors.ts` ni `weight-error.mapper.ts` ni bloques `try/catch` alrededor
de los casos de uso. Añadirlos sería andamiaje vacío.

### D10 — `IsoDateSchema` se extrae dentro del módulo `health`

`vaccine.dto.ts:3,43-49` contiene un `IsoDateSchema` + `isIsoDate()` idéntico al
que necesita `measuredAt`. Sería la tercera copia del validador en el repo
(existe otra en `create-pet.dto.ts`), así que se extrae **a un archivo nuevo
dentro del mismo módulo**, `src/modules/health/application/dto/iso-date.ts`, que
exporta `IsoDateSchema` y `todayIsoDateUtc()`; `vaccine.dto.ts` pasa a
importarlo en vez de declararlo.

Es el **único** archivo de #14 que esta feature modifica, y el cambio es un
movimiento mecánico sin cambio de comportamiento: los tests de #14
(`test/health-vaccines.e2e-spec.ts::R8`) son la red de seguridad y deben quedar
verdes sin tocarlos. `create-pet.dto.ts` (módulo `pets`) **no se toca**: el
alcance de la extracción termina en `health`.

## Riesgo sobre contratos existentes (barrido previo, no solo el consumidor obvio)

`pets.current_weight_kg` **ya existe** desde #5 (migración
`0003_pets_crud_tables.sql:20`) y ya tiene escritores y lectores. Esta feature
añade un tercer escritor. Barrido completo de lo que la toca y de qué tests la
aseveran:

| Qué | Dónde | Efecto de #15 |
|---|---|---|
| Columna `numeric(5,2)` nullable, sin default | `src/db/schema/pets.schema.ts:36` | **Sin cambios.** `pets.schema.spec.ts:39/69/88` asevera nombre, nulabilidad y `getSQLType() === 'numeric(5, 2)'`. Tocar tipo, nombre o `notNull` rompe tres tests. |
| Escritor 1: `createWithOwner` (`POST /v1/pets`) | `pet.drizzle.repository.ts:46` + helper `toWeightColumn` `:137-140` | Sin cambios. `pet.drizzle.repository.spec.ts:126` asevera `toBe('25.5')` — **string estricto**. Migrar a `mode: 'number'` o quitar el `String(...)` rompe ese test. |
| Escritor 2: `update` (`PATCH /v1/pets {weightKg}`) | `pet.drizzle.repository.ts:114-127`, `update-pet.use-case.ts:61-71` | Sin cambios. Sigue siendo un camino válido para editar el peso del perfil. Convive con #15: **la última escritura gana**, sin reconciliación. Ver riesgo abierto abajo. |
| Escritor 3 (nuevo): `WeightDrizzleRepository.create()` | esta feature | Escribe solo bajo el predicado de D4. |
| Lector: `toDomain` → `Number(row.currentWeightKg)` | `pet.drizzle.repository.ts:151-152` | Sin cambios. Quitar el `Number(...)` rompe `pet.drizzle.repository.spec.ts:127` y `test/pets.e2e-spec.ts:500` (`expect(body.currentWeightKg).toBe(22.5)`). |
| Lector: entidad `Pet.currentWeightKg: number \| null` | `pet.entity.ts:14,35,55` | Sin cambios. |
| Lector: clave `currentWeightKg` del perfil | `pet-profile-response.mapper.ts:27,70` | **Sin cambios de forma.** Solo cambia el *valor* que ya se exponía. |
| Contrato congelado de 24 claves del perfil | `pet-profile-response.mapper.spec.ts:33-47` (`Object.keys(response).sort()`), `test/pets.e2e-spec.ts:72` (`PROFILE_KEYS`), `test/devices.e2e-spec.ts:617` (segunda copia de `PROFILE_KEYS`) | **Este es el trío que hay que respetar.** Añadir una clave `weightVariation` al perfil rompe los tres. Por eso esa integración está fuera de alcance en [[requirements]]. |
| `expect(sql).not.toContain('CREATE TABLE "weights"')` | `src/db/schema/health.schema.spec.ts:63` | Solo inspecciona la migración que contiene `CREATE TABLE "vaccine_catalog"` (`0009`). Verde mientras `weights` vaya en `0010`. |
| Futuro lector: motor de nutrición (#17) | `feature_list.json` #17 | Consumirá el peso para `RER = 70 × peso^0.75`. Refuerza D7 (atomicidad). |

**Riesgo abierto para el gate humano**: `PATCH /v1/pets/:petId {weightKg}` sigue
pudiendo escribir `current_weight_kg` sin crear fila en `weights`, así que el
perfil y el historial pueden divergir (el perfil muestra 22.5 y la última
medición dice 20.0). Unificarlo —hacer que el `PATCH` cree una medición, o
quitarle el campo `weightKg`— cambiaría el contrato de #5 y rompería
`update-pet.use-case.spec.ts:44-54` y `:88-96` y `test/pets.e2e-spec.ts:486-500`.
Se deja fuera de alcance a propósito; si el humano prefiere cerrarlo, es una
feature aparte con su propio gate.

## Archivos afectados

**Nuevos — persistencia (infraestructura compartida)**

- `backend-pet-tracker/src/db/schema/health.schema.ts` — *(modificado)* añade
  `export const weights` (D1). No se toca `index.ts`.
- `backend-pet-tracker/src/db/migrations/0010_<tag>.sql` + `meta/0010_snapshot.json`
  + entrada en `meta/_journal.json` — generados por `pnpm -C backend-pet-tracker run db:generate`.

**Nuevos — `src/modules/health/domain/`**

- `entities/weight.entity.ts` — `PetWeightProps` (`id`, `petId`,
  `weightKg: number`, `measuredAt: string`, `bodyCondition: number | null`) y la
  clase `PetWeight`, misma forma que `PetVaccine`. Sin imports de framework.
- `repositories/weight.repository.ts` — `export const WEIGHT_REPOSITORY = Symbol('WeightRepository')`,
  `export interface NewPetWeight { petId; weightKg: number; measuredAt: string; bodyCondition: number | null; createdBy: string }`
  y `export interface WeightRepository` con:
  - `create(data: NewPetWeight): Promise<PetWeight>` — inserta y aplica el
    `UPDATE` condicional de D4, en una transacción (D7).
  - `listByPet(petId: string, limit: number): Promise<PetWeight[]>` — orden
    `measured_at DESC, id DESC`.
  - `findPrevious(petId: string, measuredAt: string, id: string): Promise<PetWeight | null>`
    — el máximo de `(measured_at, id)` estrictamente menor que el par dado.

**Nuevos — `src/modules/health/application/`**

- `dto/iso-date.ts` — `IsoDateSchema`, `todayIsoDateUtc()` (D10).
- `dto/weight.dto.ts` — `WEIGHTS_DEFAULT_LIMIT`, `WEIGHTS_MAX_LIMIT`,
  `MEASURED_AT_MAX_FUTURE_DAYS`, `CreateWeightSchema` / `CreateWeightDto`,
  `ListWeightsQuerySchema` / `ListWeightsQueryDto`:
  ```
  export const MEASURED_AT_MAX_FUTURE_DAYS = 1;  // D5: husos UTC-12..UTC+14

  CreateWeightSchema = z.strictObject({
    weightKg: z.number().gt(0).lte(999.99),
    measuredAt: IsoDateSchema.refine(d => d <= maxMeasuredAtIsoDate(), 'measuredAt is too far in the future'),
    bodyCondition: z.number().int().min(1).max(9).optional(),
  })
  // maxMeasuredAtIsoDate() = hoyUTC + MEASURED_AT_MAX_FUTURE_DAYS, en YYYY-MM-DD
  ListWeightsQuerySchema = z.strictObject({
    limit: z.coerce.number().int().min(1).max(WEIGHTS_MAX_LIMIT).default(WEIGHTS_DEFAULT_LIMIT),
  })
  ```
- `weight-variation.ts` — función pura, sin IO:
  `export interface WeightEntry extends PetWeightProps { variation: number | null }`
  y `export function toWeightHistory(rowsNewestFirst: PetWeight[], limit: number): WeightEntry[]`
  (aplica D3 y descarta la fila de sonda), más
  `export function weightDelta(current: number, previous: number | null): number | null`.
- `use-cases/create-weight.use-case.ts` — `CreateWeightUseCase`, inyecta
  `@Inject(WEIGHT_REPOSITORY)` y `@Inject(AUDIT_LOGGER)`;
  `execute(petId: string, dto: CreateWeightDto, userId: string): Promise<WeightEntry>`.
- `use-cases/list-weights.use-case.ts` — `ListWeightsUseCase`, inyecta
  `@Inject(WEIGHT_REPOSITORY)`; `execute(petId: string, limit: number): Promise<WeightEntry[]>`;
  pide `limit + 1` al repositorio.

**Nuevos — `src/modules/health/infrastructure/`**

- `repositories/weight.drizzle.repository.ts` — `WeightDrizzleRepository`,
  `@Inject(DRIZZLE)`, id con `uuidv7()`, conversiones de D2.
- `mappers/weight.mapper.ts` — `WeightResponse`
  (`{ id, petId, weightKg, measuredAt, bodyCondition, variation }`) y
  `toWeightResponse(entry: WeightEntry): WeightResponse`.
- `weights.controller.ts` — `WeightsController` en `@Controller('pets/:petId/weights')`,
  `@UseGuards(PetAccessGuard)`; `@Post() @RequirePetRole('owner')` y `@Get()`.
  Duplica los helpers privados `parseBody` / `parseQuery` / `validationError` del
  patrón ya vigente (`vaccines.controller.ts:125-142`, `alerts.controller.ts:79-94`)
  — el proyecto los repite por controller a propósito; no extraerlos aquí.

**Modificado**

- `backend-pet-tracker/src/modules/health/health.module.ts` — añade
  `WeightsController` a `controllers`, `CreateWeightUseCase` y
  `ListWeightsUseCase` a `providers`, y
  `{ provide: WEIGHT_REPOSITORY, useClass: WeightDrizzleRepository }`. El
  `imports: [PetsModule]` que provee `PET_REPOSITORY` al `PetAccessGuard` ya
  está.
- `backend-pet-tracker/src/modules/health/application/dto/vaccine.dto.ts` — solo
  el movimiento de `IsoDateSchema` a `dto/iso-date.ts` (D10).

**Tests (rutas exactas, R-id → archivo en [[traceability]])**

- `backend-pet-tracker/src/db/schema/weights.schema.spec.ts` (nuevo) — R1.
- `backend-pet-tracker/src/modules/health/application/weight-variation.spec.ts` (nuevo) — R5.
- `backend-pet-tracker/src/modules/health/application/use-cases/create-weight.use-case.spec.ts` (nuevo) — R10.
- `backend-pet-tracker/src/modules/health/infrastructure/repositories/weight.drizzle.repository.spec.ts` (nuevo) — R4.
- `backend-pet-tracker/test/health-weights.e2e-spec.ts` (nuevo) — R2, R3, R5, R6, R7, R8, R9, R10.

Sin variables de entorno nuevas, sin dependencias nuevas, sin cambios en
`app.module.ts`, `.env.example` ni `docs/conventions.md` §Variables de entorno.
`docs/data-model.md` fila `weights` ya describe la tabla; al cerrar la feature
basta con anotar ahí la migración (`0010`), igual que hicieron #12 y #14.

## Alternativas descartadas

- **`real` / `double precision` para `weight_kg`**: peso es una magnitud
  decimal exacta de cara al usuario; `numeric` evita que 70.1 se muestre como
  70.099998. Además desalinearía con `pets.current_weight_kg`.
- **`mode: 'number'` en la columna drizzle o `pg.types.setTypeParser` global**:
  el repo no lo hace en ninguna de sus dos columnas `numeric`, y cambiar el
  parser global afectaría a `activity_daily.avg_walk_minutes` sin que nadie lo
  pida. Un `setTypeParser` global además rompe `bigint`/`numeric` fuera de rango
  de forma silenciosa.
- **`variation: 0` en la primera medición**: colapsa "no hay línea base" con
  "no cambió" (D3).
- **Calcular `variation` sobre la página devuelta**: haría que el mismo dato
  cambiara de valor según el `?limit=` que pidiera el cliente.
- **Un `SELECT MAX(measured_at)` en TypeScript antes de decidir si actualizar
  `pets`**: read-modify-write con ventana de carrera; el predicado en el
  `WHERE` es más corto y no la tiene (D4).
- **Delegar el `UPDATE` de `pets` en `PetRepository.update()`**: pierde la
  atomicidad y `PetFieldChanges` no expresa la condición (D7).
- **Tabla `weights` en un `weights.schema.ts` propio o módulo
  `src/modules/weights/`**: #15 es la continuación del plan 008 dentro del
  módulo `health`; un módulo por tabla multiplicaría el andamiaje NestJS sin
  beneficio.
- **Paginación por cursor keyset como en `GET /v1/alerts`**: historial acotado
  por mascota; el cursor sería complejidad sin consumidor (D6).
- **Añadir `weightVariation` al perfil de mascota**: rompe el contrato
  congelado de 24 claves en tres archivos de test (§Riesgo).
- **Errores de dominio y `weight-error.mapper.ts`**: no hay ningún caso que los
  produzca (D9).
