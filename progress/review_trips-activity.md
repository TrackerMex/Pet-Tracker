# review: trips-activity
Fecha: 2026-08-02
Veredicto: APROBADO

Feature #10, branch `feature/10-trips-activity` (6 commits sobre `7d00fd9`,
HEAD `33c2e8e`, árbol limpio verificado con `git status --porcelain` vacío).
Verificación independiente: el reviewer ejecutó `./init.sh`, `drizzle-kit
migrate` y `pnpm run test:e2e` contra Docker real (Postgres 17 + LocalStack)
él mismo, y **reprodujo con su propio código** los tres casos DST de R7, los
cuatro fixtures del plan 006 y el hecho de Node sobre `Intl` — no se aceptó
ningún número del reporte del implementer como evidencia.

---

## 0. DICTAMEN DE LA DESVIACIÓN DEL `'UTC'` (punto 1 del reporte)

**La reconciliación es CORRECTA y NO exige tocar la spec.** Es lo primero que
debe leerse de este review.

### El hecho, comprobado por el reviewer (no asumido)

```
$ node -e "const z=Intl.supportedValuesOf('timeZone'); ..."
count 418
UTC?     false
Etc/UTC? false
Etc/GMT? false
node     v24.16.0
```

Confirmado además `users.timezone` con **default `'UTC'`**
(`src/db/schema/users.schema.ts:21`):

```ts
timezone: varchar('timezone', { length: 64 }).notNull().default('UTC'),
```

### La contradicción era real y bloqueante

Leídos al pie de la letra, R7 y R13 son **literalmente incompatibles**:

- R7 manda lanzar `InvalidTimeZoneError` si la zona no pertenece a
  `Intl.supportedValuesOf('timeZone')`.
- R13 manda degradar a `'UTC'` cuando la timezone del owner no pertenece a ese
  mismo catálogo.
- `'UTC'` no pertenece al catálogo. Luego el propio valor de rescate de R13 es
  rechazado por R7.

El agravante no es teórico. La cadena real es
`ActivityDrizzleStore.resolveTimeZone()` → devuelve `FALLBACK_TIME_ZONE =
'UTC'` → `localDayOf`/`localDayRange` → `assertTimeZone`. Sin la
reconciliación, **toda mascota cuyo owner tenga la timezone por defecto del
schema de #3 reventaría** en cada `runOnce()` y en cada petición a las tres
rutas. No es una esquina: es el camino por defecto.

### Por qué la reconciliación es la correcta, y no un parche

El reviewer caracterizó la omisión en vez de darla por buena:

```
Intl.DateTimeFormat acepta 'UTC' nativamente:            1970-01-01
resolvedOptions({timeZone:'UTC'}).timeZone             = 'UTC'
Intl rechaza 'Marte/Olympus':                            RangeError
```

`'UTC'` **es** una zona válida para `Intl`, y canonicaliza a sí misma. Lo que
ocurre es que `supportedValuesOf('timeZone')` enumera solo nombres canónicos de
la base IANA y omite `'UTC'` (igual que omite `Etc/UTC`, `GMT`, `US/Pacific`,
todos ellos aceptados por `Intl.DateTimeFormat`). Es decir: la línea

```ts
const SUPPORTED_TIME_ZONES = new Set<string>([
  ...Intl.supportedValuesOf('timeZone'),
  'UTC',
]);
```

**no amplía el catálogo, corrige un artefacto de enumeración.** Añade
exactamente el único valor que R13 exige y que el schema pone por defecto, ni
uno más.

### Comprobaciones exigidas, todas superadas

| Comprobación | Resultado |
|---|---|
| `'Marte/Olympus'` sigue rechazado | `InvalidTimeZoneError` en `localDayOf` **y** en `localDayRange` |
| `isSupportedTimeZone('Marte/Olympus')` | `false` |
| `isSupportedTimeZone('utc')` (minúscula) | `false` — no se relajó a case-insensitive |
| `isSupportedTimeZone('')` | `false` |
| `isSupportedTimeZone('Etc/UTC')` | `false` — la reconciliación es de **un** elemento, no de la familia de alias |
| `isSupportedTimeZone('UTC')` | `true` |
| `localDayRange('2026-03-29','UTC')` | 86 400 000 ms, arranca en `2026-03-29T00:00:00.000Z` |

**Veredicto: aceptable, correcta y mínima.** No exige reabrir el gate. La
alternativa literal —dejar la spec intacta— no produce un sistema conforme,
produce un sistema roto: no existe implementación que satisfaga R7 y R13
simultáneamente al pie de la letra. La decisión está documentada en el propio
`local-day.ts:32-39` y declarada en el impl report. Se registra como
**INFO-4** para que la próxima spec que toque timezones no reintroduzca la
contradicción.

Efecto lateral aceptado (**INFO-5**): un `users.timezone` con un alias válido
pero no canónico (`Etc/UTC`, `GMT`, `US/Pacific`) se degrada a `'UTC'` con
`warn` en vez de usarse. Es exactamente la rama de rescate de R13, es seguro y
es más estricto, no menos. No es un hallazgo.

---

## Checklist C2 — Estado coherente
- [x] Máximo una feature `in_progress` — `feature_list.json` tiene **0**
      `in_progress`, 1 `spec_ready` (la #10), 8 `done`, 9 `pending`
- [x] Toda feature `done` tiene test que la cubre — sin cambios en features
      previas; las 7 suites e2e anteriores siguen verdes
- [x] `progress/current.md` describe una sesión — existe y nombra la #10
- [x] `progress/history.md` intacto — el volcado es del leader al cierre
- [ ] **Bookkeeping pendiente del leader** (ver PEND-1): `feature_list.json`
      sigue en `spec_ready` y `current.md` sigue diciendo *"estado: spec_ready
      — PARADO en el gate humano. Nadie escribe código hasta que el humano
      apruebe"*, cuando la feature está implementada y verificada. **No es
      falta del implementer**: `AGENTS.md` §6 asigna ese cambio de estado al
      leader, y el impl report declara explícitamente que no tocó ninguno de
      los dos archivos. Correcto por su parte. Queda como acción del leader
      antes de marcar `done`.

## Checklist C3 — Arquitectura
- [x] `domain/` sin imports de infrastructure — los 6 archivos de
      `src/modules/activity/domain/**` no importan `drizzle-orm`, `@aws-sdk/*`
      ni ninguna ruta `infrastructure/` (0 hits). `daily-activity.entity.ts`,
      `activity.errors.ts` y `week-comparison.ts` no tienen **ningún** import
- [x] Repositorios/contratos en domain son interfaces puras — `ActivityStore` y
      `DailyPositionsReader` son `interface` + token `Symbol`, sin implementación
- [x] `application/` depende de interfaces, no de implementaciones — los tres
      casos de uso inyectan `ACTIVITY_STORE` / `DAILY_POSITIONS_READER`;
      ninguno referencia `ActivityDrizzleStore` ni `DailyPositionsDynamoReader`,
      que solo se ligan en `activity.module.ts:38-39`
- [x] `application/` sin ORM ni SDK — 0 hits de `drizzle-orm` y `@aws-sdk/*`.
      El único `@nestjs/common` es `Inject`/`Injectable`/`Logger`, **idéntico
      al precedente de #9** (`list-positions.use-case.ts:1`,
      `get-last-position.use-case.ts:1`). Sin divergencia
- [x] `infrastructure/` implementa las interfaces de domain — `ActivityDrizzleStore
      implements ActivityStore`, `DailyPositionsDynamoReader implements
      DailyPositionsReader`
- [x] Núcleo puro verificado import a import — `trips.ts` solo `./constants`,
      `./geo`, `./types`; `activity.ts` solo `./trips` y `./types`;
      `local-day.ts` y `week-comparison.ts` **cero imports**
- [x] `activity.constants.ts` en la raíz del módulo, no en `infrastructure/`,
      porque `application` y `domain` lo consumen — mismo criterio ya aceptado
      en `positions.constants.ts` de #9, y documentado en la cabecera

## Checklist C4 — TDD
- [x] Cada `R<n>` tiene al menos un test que lo nombra — R1-R22 tienen
      `describe('R<n>: ...')` real. Las **32 referencias** `archivo::describe`
      de `traceability.md` coinciden **carácter a carácter** con un `describe`
      existente (verificado por match de cadena fija, no regex). Ni una sola
      discrepancia de redacción
- [x] R23 sin test, por mandato de la propia spec aprobada ("Verificable con
      `git diff main --name-only` y con `./init.sh` verde"), no por omisión —
      mismo tratamiento aceptado para R6/R16 en #9
- [x] Los describes no son decorativos — ejecución selectiva por el reviewer:
      `jest -t "R7:"` → 45 passed, `-t "R12:"` → 24, `-t "R14:"` → 34,
      `-t "R20:"` → 8, `-t "R21:"` → 10
- [x] Los tests cubren de verdad lo que el requisito dice — muestreo profundo
      (ver §Verificación de sustancia). R12 asserta `ScanIndexForward: true`,
      `Limit = 1000`, `sk BETWEEN :from AND :to` con `:to = endMs - 1`, tres
      páginas concatenadas sin duplicados y **exactamente 10** `Query` + 1
      `warn` al tope. R14 asserta `{processed: 2, skipped: 0, failed: 1}` con
      la 3.ª mascota igualmente procesada, más re-entrada con el reader sin
      invocar. R21 asserta 1 000 → 1 120 ⇒ `12`, base vacía ⇒ `null`, base
      `0` ⇒ `null`
- [x] Historial de commits granular — 6 commits (`00d64ab` núcleo puro R1-R9,
      `850ba74` schema R10, `1702864` puertos/adaptadores R11-R15+R21+R22,
      `8a2e247` HTTP R16-R21, `2a1ab72` e2e, `33c2e8e` docs). Cada commit lleva
      su `.spec.ts` junto a la implementación
- [x] Desviación TDD del punto 9 declarada y aceptada — en R18-R21 el caso de
      uso y su spec se escribieron en el mismo paso. Es el **mismo patrón que
      #8 y #9 declararon y que se les aprobó**; el contrato de extremo a
      extremo lo fija el e2e posterior. Declararlo en vez de disfrazarlo es lo
      que pide `docs/verification.md`

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" — **23/23** filas con test y
      commit. Cero apariciones de la palabra "pendiente"
- [x] Ningún test citado es inexistente — las 32 referencias verificadas una a
      una contra el archivo real
- [x] Cada commit citado existe y contiene lo que la fila dice
- [x] Formato de commits — los 6 siguen `<tipo>(trips-activity): <desc>
      (R1,R2,...)`. `2a1ab72` usa `test(...)` y `33c2e8e` usa `docs(...)`,
      correcto para su contenido

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` en el frontmatter (línea 3)
- [x] Casilla humana marcada con fecha — `- [X] Aprobado por humano (fecha:
      2026-08-02)`, con la nota "D1-D15 confirmadas íntegras"
- [x] Ningún requisito modificado después de la aprobación —
      `git log 7d00fd9..HEAD -- specs/trips-activity/requirements.md
      specs/trips-activity/design.md` devuelve **vacío**. Ni R1-R23 ni D1-D15
      se tocaron tras el gate. Solo `tasks.md` y `traceability.md`, que es el
      registro de avance, no la spec

## Checklist C7 — Sin código huérfano
- [x] N/A — esta feature **no reemplaza ni deja obsoleto** ningún componente.
      Es aditiva: módulo nuevo `src/modules/activity/**`, tres archivos nuevos
      en `src/pipeline/`, una tabla nueva. Ningún archivo borrado en todo el
      diff (51 archivos, todos añadidos o con adiciones)
- [x] `PositionsModule` de #9 no fue vaciado ni sustituido — sigue intacto y
      sigue sirviendo sus rutas

---

## Verificación independiente de los puntos exigidos

### D1 — puerto propio, `PositionsModule` intacto — **RESPETADA**
- `DailyPositionsReader` es puerto propio del dominio de #10
  (`domain/repositories/daily-positions.reader.ts`), con token
  `DAILY_POSITIONS_READER`.
- `positions.module.ts` **no tiene array `exports`** en absoluto. Sin cambios
  respecto a `main` (0 archivos de `src/modules/positions/**` en el diff).
- `ListPositionsUseCase` no se importa en ninguna parte de
  `src/modules/activity/**`. La única aparición textual es el comentario de
  `daily-positions.reader.ts:6` que explica la no-reutilización.
- `ActivityModule` construye su propio `DynamoDBDocumentClient` desde
  `DYNAMODB_CLIENT` (`ACTIVITY_DAILY_DOC_CLIENT`), calco de lo que #9 hizo con
  `POSITIONS_READ_DOC_CLIENT`.

### D2 — tick horario, gating y env var — **RESPETADA**
- `runOnce(now)` invocable: `AggregateDailyActivityUseCase.runOnce(now: Date)`,
  llamado a mano por el e2e y por el tick.
- Gating correcto y por `ConfigService`, nunca `process.env`
  (`activity-scheduler.service.ts:55-60`):
  ```ts
  this.config.get<string>('ACTIVITY_AGGREGATOR_ENABLED') === 'true' &&
  this.config.get<string>('NODE_ENV') !== 'test'
  ```
- Registro dinámico vía `SchedulerRegistry.addInterval` en
  `onApplicationBootstrap`, **sin decorador `@Cron`/`@Interval`**. Cadencia por
  constante nombrada `ACTIVITY_TICK_INTERVAL_MS = 3_600_000`, no por env.
- **Regla dura de `AGENTS.md` §4 cumplida**: el commit `1702864` que introduce
  la lectura de la variable contiene **en el mismo commit** `.env.example` (+6),
  `docs/conventions.md` (+1) y el servicio. Verificado con
  `git log 7d00fd9..HEAD -- .env.example docs/conventions.md ...` → un solo
  commit, `1702864`. `.env.example:44` = `ACTIVITY_AGGREGATOR_ENABLED=true`;
  `docs/conventions.md:224` tiene la fila de la tabla.
- El test de R22 **lee los dos archivos de disco de verdad** (no es un
  placeholder): `readFileSync(join(REPO_ROOT, '.env.example'))` con
  `toMatch(/^ACTIVITY_AGGREGATOR_ENABLED=true$/m)` y
  `readFileSync(join(REPO_ROOT,'docs','conventions.md'))` con
  ``toMatch(/\| `ACTIVITY_AGGREGATOR_ENABLED` \|/)``. Un tercer `it` asserta
  `not.toMatch(/process\.env/)` sobre el fuente del servicio.

### D12 — `activitySummary` sigue `null` — **RESPETADA**
- `git diff main --name-only -- 'backend-pet-tracker/src/modules/pets/**'` →
  **vacío**.
- Los tres tests que lo afirman siguen en su sitio y verdes:
  `pet-profile-response.mapper.spec.ts:73` (`expect(response.activitySummary)
  .toBeNull()`), `test/pets.e2e-spec.ts:360` (`expect(body.activitySummary)
  .toBeNull()`), `test/devices.e2e-spec.ts:630` (la clave en la lista de 24).
- `pet-profile-response.mapper.ts:46,82` sigue con `activitySummary: null`.

### R23 — no regresión — **CUMPLIDA**
`git diff main --name-only` = **51 archivos**, todos dentro de la lista de R23.
Verificado por el reviewer:

```
$ git diff main --name-only -- \
    'src/modules/pets/**' 'src/modules/positions/**' 'src/modules/devices/**' \
    'src/modules/users/**' 'src/modules/auth/**' 'src/workers/**' \
    'src/integrations/**' 'src/aws/**' 'package.json' 'pnpm-lock.yaml' \
    'tsconfig*.json'
→ (vacío)

$ git diff main --name-only -- 'src/db/migrations/*.sql'
→ backend-pet-tracker/src/db/migrations/0005_activity_daily.sql   (exactamente una)
```

- **Cero** archivos fuera de la lista. Cero dependencias nuevas.
- `src/db/schema/index.ts`: exactamente **+1 línea**.
- `src/pipeline/constants.ts`: **solo adiciones**; los 5 exports previos
  conservan nombre y valor (verificado en el diff).
- `src/app.module.ts`: **+2 líneas** (import + registro). R23 dice "una línea
  de import" — la línea de `import` es literalmente una; el registro en
  `imports:` es la segunda. Registrado como **INFO-3**, idéntico a lo que hizo
  #9 con `PositionsModule` y sin el cual el módulo no se carga.

### R10 — migración — **CUMPLIDA**
Una sola migración, un solo `CREATE TABLE`, DDL exacto al de R10: 11 columnas
con los tipos pedidos, `PRIMARY KEY("pet_id","date")`, los **4** `CHECK` de no
negatividad y FK `ON DELETE cascade`. `meta/_journal.json` con `tag:
"0005_activity_daily"`, coherente con `0003_pets_crud_tables` y
`0004_devices_claim_tables` (punto 6 del reporte: renombrado correcto).

### R11 — upsert que preserva `time_away_minutes` — **CUMPLIDA**
`activity.drizzle.store.ts:99-118`: el `set:` del `onConflictDoUpdate` usa el
objeto `values`, que contiene **exactamente** las 8 columnas que R11 exige
(`distance_m`, `active_minutes`, `rest_minutes`, `walk_count`,
`avg_walk_minutes`, `first_walk_at`, `last_walk_at`, `computed_at`) y
**excluye `time_away_minutes`**, `pet_id` y `date`. No hay ninguna ruta de
código de #10 que escriba `timeAwayMinutes`.

### R7 con rigor — **CUMPLIDA, reproducida por el reviewer**

Ejecutado por el reviewer contra el `local-day.js` compilado:

```
R7(a) 23:50 America/Mexico_City  => 2026-08-02        (esperado 2026-08-02)
R7(b) Europe/Madrid 2026-03-29   => 82 800 000 ms     (23 h)
R7(c) Europe/Madrid 2026-10-25   => 90 000 000 ms     (25 h)
  endMs === startMs del día siguiente?          true / true
  naive startMs+86 400 000 = 1774825200000
  endMs real               = 1774821600000     => NO es el naive
SWEEP zones=419 days=8 checks=3352 violations=0 distinct spans(h)=22,23,24,25,26
```

- `endMs` **es** el `startMs` del día siguiente, y se demuestra que **no** es
  `startMs + 86_400_000`: difieren en 3 600 000 ms en el día DST.
- El barrido de 419 zonas × 8 días (incluidos 2026-03-08, 2026-03-29,
  2026-09-06, 2026-10-25, cambio de año) da **0 infracciones** del invariante
  (`startMs` pertenece al día, `startMs − 1` no, `endMs` no, duración 22-26 h,
  y `endMs` coincide con el `startMs` del día siguiente).
- Medianoche local inexistente: `America/Santiago` 2026-09-06 arranca en
  `04:00Z` (01:00 local), el día dura 23 h y `startMs − 1` cae en 2026-09-05.
  Correcto.
- No hay ningún `+ 86_400_000` en `local-day.ts`. Confirmado por lectura.

### Los 4 fixtures del plan — **CUMPLIDOS, reproducidos por el reviewer**

Ejecutado por el reviewer sobre `walk.json` real pasado por `normalize()`:

| Fixture del plan 006 §Paso 2 | Medido por el reviewer | Veredicto |
|---|---|---|
| `walk.json` → ≥ 1 paseo | 204 crudos → 199 aceptados → **1 paseo**, `distanceM = 3 182`, `durationMin = 98`, `path = 196` | ✅ |
| reposo total → 0 | 241 puntos a 30 s, `speedKmh = 0`, ~0,2 m entre puntos → **0 paseos** | ✅ |
| salto absurdo fuera de la distancia | 8 puntos `suspect_jump`; a nivel de paseo naive **11 358 m** vs `distanceM` **3 182 m** ⇒ delta **8 176 m** (R5 pide ≥ 900) | ✅ |
| gap de 20 min parte dos paseos | dos tramos de 6 min / 500 m separados por 20 min → **2 paseos**, `trips[0].endTs` = `ts` del último punto antes del gap. Control sin gap → **1 paseo**, lo que prueba que es el gap quien parte | ✅ |

Los números coinciden exactamente con los declarados en el impl report.
Comprobaciones adicionales del reviewer sobre R3/R4/R6, no exigidas pero
hechas:

```
R3 cierre por inactividad -> endTs === ts del ÚLTIMO PUNTO EN MOVIMIENTO: true
   (endTs = 08:06:00Z, no 08:16:00Z que es el punto que dispara el cierre)
R3 gap de exactamente 15 min -> 1 paseo   (R3 dice "supera", no "alcanza")
R3 gap de 15 min + 1 ms      -> 2 paseos
R4 tramo de 4 min a 6 km/h   -> 0 paseos  (descartado por duración)
R6 determinismo: true | claves: distanceM,durationMin,endTs,path,startTs
R6 ascendente y sin solapes: true
R9 serie vacía y serie de 1 punto -> todas las métricas 0, firstWalkAt/lastWalkAt null
```

### Seguridad y calidad — **LIMPIA**
- **Secretos**: 0 hits de credencial/token/clave/connection-string en
  `src/modules/activity/**` y en el núcleo puro. Lo único con forma de
  credencial son fixtures obviamente falsos del e2e
  (`passwordHash: '$argon2id$...$e2e$dummy'`) y `Bearer ${owner.token}` con
  token firmado en runtime.
- **`process.env` directo**: **0 hits en código de producción**. El único hit en
  todo el módulo es `activity-scheduler.service.spec.ts:143`, que es el test
  que *prohíbe* su uso (`expect(source).not.toMatch(/process\.env/)`).
- **Códigos de error**: los cinco de R17/R19 existen y mapean al status
  correcto en `activity-error.mapper.ts`: `INVALID_DATE`, `INVALID_RANGE`,
  `RANGE_TOO_LARGE`, `INVALID_TRIP_INDEX` → 400 vía `badRequest()`;
  `TRIP_NOT_FOUND` → `NotFoundException` 404 con `code` en el body (el único
  404 con `code`, distinguible del genérico del guard, como exige R19). Los
  errores desconocidos se re-lanzan sin tocar.
- `domain/errors/activity.errors.ts` tiene **cero imports**: ni
  `@nestjs/common` ni nada. Las 5 clases extienden `Error` nativo.
- **`petId` siempre de `request.petMembership`**: los tres handlers lo derivan
  de `request.petMembership.petId` (`trips.controller.ts:42,59`,
  `activity.controller.ts:37`). El único `@Param` del módulo es
  `@Param('n')` (índice de paseo). No hay `@Query` ni `@Body` en ninguna parte.
- **Guards**: `@UseGuards(PetAccessGuard)` a nivel de clase en ambos
  controllers, **sin** `@RequirePetRole` y **sin** `@Public()`. Tres rutas GET:
  `/v1/pets/:petId/trips`, `/v1/pets/:petId/trips/:n`,
  `/v1/pets/:petId/activity/daily`.
- **Restos de depuración**: 0 hits de `console.log`, `TODO`, `FIXME`,
  `it.skip`, `describe.skip`, `.only(` en todo el código nuevo.
- **Árbol limpio**: `git status --porcelain` vacío. El
  `backend-pet-tracker/scripts/r6-evidence.tmp.ts` de #9 ya no está.

---

## Dictamen de las 9 desviaciones declaradas

| # | Desviación | Dictamen |
|---|---|---|
| 1 | `SUPPORTED_TIME_ZONES` añade `'UTC'` al catálogo de `Intl` | **ACEPTABLE — correcta y necesaria.** Ver §0. Reconciliación mínima (un elemento) de dos requisitos literalmente incompatibles; corrige un artefacto de enumeración, no amplía el catálogo. `'Marte/Olympus'`, `'utc'`, `''` y `'Etc/UTC'` siguen rechazados. **No exige tocar la spec.** Registrada como INFO-4 |
| 2 | R1 dice "importar los umbrales en `trips.ts` y `activity.ts`"; `activity.ts` los consume vía `./trips` | **ACEPTABLE — INFO-1.** Desviación de la letra, no de la sustancia. La segunda mitad de R1 (la verificable) es "fuente única en `constants.ts`" y "cero literales de umbral fuera de `constants.ts`": ambas se cumplen — `activity.ts` no contiene ninguno de los siete valores. Importarlos allí solo para satisfacer la letra produciría imports sin uso que el lint marcaría, o una segunda copia de las reglas de R2/R5, que es precisamente lo que R1 quiere evitar. El reviewer inspeccionó los cuatro valores ambiguos (3, 10, 15, 5) que R1 delega: no aparecen como umbral en ninguno de los dos archivos |
| 3 | R10 se testea desde `activity.drizzle.store.spec.ts`, no desde un `activity.schema.spec.ts` | **ACEPTABLE.** R23 no autoriza ese segundo archivo y el módulo sí es territorio permitido. El describe de R10 tiene 7 `it` y cubre lo que R10 exige: shape de tabla, PK compuesta, FK CASCADE, tipos, CHECKs y una sola migración con un único `CREATE TABLE` |
| 4 | R11 y R14 se reparten la verificación del upsert | **ACEPTABLE.** El reparto es forzado por la propia spec: R14 manda saltar la fila fresca, así que un segundo `runOnce()` no puede probar idempotencia del `ON CONFLICT`. Probarla llamando dos veces a `upsertDailyActivity()` (con `time_away_minutes = 42` preservado) y probar el skip con dos `runOnce()` es la única descomposición correcta. Ambas en el e2e, ambas verdes |
| 5 | El `warn` de R12 loguea la fecha UTC de `startMs` | **ACEPTABLE.** El payload lleva las tres claves que R12 pide (`petId`, `date`, `pagesRead`) y la firma `readDay(petId, startMs, endMs)` es la que fija R12 — el reader literalmente no recibe la timezone. La limitación está comentada en el propio sitio (`daily-positions.dynamo.reader.ts:74-76`) |
| 6 | Migración renombrada `0005_past_dagger` → `0005_activity_daily` | **ACEPTABLE.** `meta/_journal.json` actualizado coherentemente; mismo criterio que `0003_pets_crud_tables` y `0004_devices_claim_tables`. `drizzle-kit migrate` corrió limpio en la verificación del reviewer |
| 7 | `app.module.ts` son +2 líneas, no una | **ACEPTABLE — INFO-3.** La línea de `import` es una; el registro en `imports:` es la segunda y sin ella el módulo no se carga. Idéntico a #9. Literalismo de R23 sin consecuencia |
| 8 | R20 dice "las nueve claves métricas"; son 8 | **ACEPTABLE — INFO-2. El error aritmético está en la spec, no en el código.** La entrada tiene 10 claves; `date` y `source` no son métricas, luego son 8. `missingEntry()` (`get-daily-activity.use-case.ts:194-207`) pone a `null` las **8**: `distanceM`, `activeMinutes`, `restMinutes`, `walkCount`, `avgWalkMinutes`, `firstWalkAt`, `lastWalkAt`, `timeAwayMinutes`. Es la interpretación máxima y respeta la intención literal ("nunca ceros"). Ninguna clave métrica se quedó fuera |
| 9 | En R18-R21 el caso de uso y su spec se escribieron en el mismo paso | **ACEPTABLE.** Mismo patrón declarado y aprobado en #8 y #9. El contrato de extremo a extremo lo fija el e2e posterior (`2a1ab72`, 27 tests). Declararlo en vez de disfrazarlo es lo correcto |

**Las 9 desviaciones son aceptables. Ninguna es un hallazgo bloqueante.**

---

## Hallazgos

Ninguno bloqueante. Ninguno exige rechazar.

### BAJA-1 — orden del spread en los tres handlers
`trips.controller.ts:42`, `trips.controller.ts:59` y `activity.controller.ts:37`
construyen el input como `{ petId: request.petMembership.petId, ...query }`,
con el spread **después** del `petId`. Hoy es inofensivo porque
`ListTripsQuerySchema` y `GetDailyActivityQuerySchema` son `z.strictObject`, que
responde 400 ante cualquier clave desconocida, `petId` incluida. Pero la
seguridad depende **enteramente** de ese `strictObject`: relajarlo a un objeto
laxo convertiría esto en una escalada horizontal (el cliente elegiría la
mascota). Endurecimiento de una línea: poner el spread primero. **No se exige
para aprobar**; se registra para que quede en el radar.

### BAJA-2 — el borde exacto de R19 (`n === trips.length`) no está cubierto
El código es **correcto** (`list-trips.use-case.ts:75`: `if (index >=
trips.length) throw new TripNotFoundError(index)`) — el reviewer lo verificó
por lectura. Pero ningún test ejercita el off-by-one real: el fixture produce
1 paseo y los tests usan `n = 99` (unit y e2e) y `n = 3`, nunca `n = 1`.
Cobertura, no defecto.

### BAJA-3 — `RANGE_TOO_LARGE` con un solo extremo toca Postgres una vez
R17 pide responder `RANGE_TOO_LARGE` "sin consultar Postgres ni DynamoDB".
`get-daily-activity.use-case.ts` valida antes de todo I/O **solo cuando el
cliente da `from` y `to`** (líneas 67-71). Si manda uno solo, el `assertRange`
efectivo es el de la línea 79, **después** de `findOwnerTimezone()` — una
consulta a Postgres. Es inevitable: el extremo que falta se rellena con "hoy en
la tz del owner", que no se puede conocer sin esa consulta. DynamoDB y
`activity_daily` no se tocan en ningún caso, y el caso verificable que la
propia R17 enuncia (rango de 32 días con ambos extremos) sí corta antes de todo
I/O. Consecuencia inherente de los defaults de R20, no descuido.

### INFO-1 … INFO-5
Ver la tabla de desviaciones (INFO-1 = punto 2, INFO-2 = punto 8,
INFO-3 = punto 7, INFO-4 = punto 1) y §0 (INFO-5: los alias no canónicos
`Etc/UTC`, `GMT`, `US/Pacific` se degradan a `'UTC'` con `warn`; es la rama de
rescate de R13 y es segura).

### INFO-6 — colisión de nombres de describe entre features
`src/pipeline/validate-positions.spec.ts` (de #8) tiene describes `R5:`, `R6:` y
`R7:` que colisionan por nombre con los de `trips.spec.ts` y `local-day.spec.ts`
(de #10), en el mismo directorio. La trazabilidad **no** se equivoca porque cita
rutas explícitas, pero un `jest -t "R7:"` cruza features (por eso el conteo del
reviewer da 45 y no 13). Preexistente al implementer; conviene tenerlo presente
al crecer `src/pipeline/`.

### PEND-1 — bookkeeping del leader (no es del implementer)
`feature_list.json` mantiene la #10 en `spec_ready` y `progress/current.md`
sigue describiendo la sesión como *"PARADO en el gate humano"*. El implementer
hizo lo correcto al no tocarlos (`AGENTS.md` §6 y §7 asignan ese trabajo al
leader, y así lo declara el impl report). Acciones pendientes del leader antes
de cerrar: poner la #10 en `done`, actualizar `STATUS.md` ("Features
completadas: 9/18"), volcar `current.md` a `history.md` y abrir el PR. **El
reviewer no ha tocado ninguno de esos archivos.**

---

## Veredicto

**APROBADO.**

- `./init.sh` verde, ejecutado por el reviewer: **88 suites / 606 tests**,
  build, lint y typecheck sin errores. Coincide con el reporte.
- `pnpm run test:e2e` verde contra Postgres 17 + LocalStack reales, ejecutado
  por el reviewer tras aplicar la 0005: **8 suites / 111 tests**, exit 0.
  Coincide con el reporte.
- Trazabilidad **23/23**, sin filas "pendiente", sin un solo test citado
  inexistente y sin una sola discrepancia de nombre en 32 referencias.
- Spec aprobada por humano y **no modificada** tras el gate.
- R23 sin una sola regresión: 0 archivos fuera de la lista, exactamente una
  migración, cero dependencias nuevas, `activitySummary` sigue `null`.
- Las 9 desviaciones declaradas son aceptables; la del `'UTC'` es correcta y
  necesaria, y no exige reabrir el gate.
- 3 hallazgos de severidad **baja** y 6 informativos, ninguno bloqueante.

Correcciones exigidas para aprobar: **ninguna.**

Recomendaciones para una feature futura (no bloquean): BAJA-1 (spread primero
en los tres handlers) y BAJA-2 (un caso de test con `n === trips.length`).

---

## Output de `./init.sh` (reviewer)

```
→ Verificando entorno...
✅ node disponible (/c/Program Files/nodejs/node)
✅ pnpm disponible (/c/Users/alex/AppData/Local/pnpm/pnpm)
→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
→ Instalando dependencias...
✅ Dependencias instaladas
→ Verificando coherencia del harness...
✅ Archivos del harness presentes
✅ STATUS.md sincronizado con feature_list.json
→ Build...
✅ Build exitoso
→ Ejecutando tests...
Test Suites: 88 passed, 88 total
Tests:       606 passed, 606 total
Snapshots:   0 total
Time:        8.688 s
Ran all test suites.
✅ Tests pasados
→ Lint...
✅ Lint sin errores
→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 8/18 completadas | 9 pendientes
```

## Output de `pnpm run test:e2e` (reviewer, contra Docker real)

```
Test Suites: 8 passed, 8 total
Tests:       111 passed, 111 total
Snapshots:   0 total
Time:        35.216 s, estimated 37 s
Ran all test suites.
```

## Comprobación del hecho de Node (reviewer)

```
$ node -e "const z=Intl.supportedValuesOf('timeZone'); console.log('count',z.length);
           console.log('UTC?',z.includes('UTC')); console.log('node',process.version)"
count 418
UTC? false
node v24.16.0

$ node -e "console.log(new Intl.DateTimeFormat('en-CA',{timeZone:'UTC'}).format(new Date(0)))"
1970-01-01          # 'UTC' ES válida para Intl; solo falta en la enumeración
```
