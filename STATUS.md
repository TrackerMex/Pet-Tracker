# pet-tracker — Status

**Última actualización**: 2026-08-07
**Features completadas**: 12/18 (`feature_list.json`)
**Pendientes**: 6 — backlog backend derivado de `plans/` 002–009 (alertas, salud, nutrición). **Sin P1 pendientes**: el resto es P2/P3.
**En producción**: no

---

## Qué es este proyecto

Backend de Pet Tracker (brief completo en `docs/brief.md`): plataforma de
cuidado de mascotas con 3 pilares — (1) localización y actividad vía collar
GPS (Wialon, con simulador `SIM_MODE` mientras no hay hardware), (2) salud
(vacunas con catálogo, peso, recordatorios), (3) alimentación (motor
calórico determinístico + explicación IA opcional). Multi-usuario con
permisos por mascota (`pet_users`), geocercas con alertas anti-spam y push.
La app móvil (Expo) queda fuera de este repo/backlog — solo backend.

---

## Cómo arrancar

```bash
docker compose up -d   # Postgres + LocalStack (solo si la sesión toca DB/AWS)
./init.sh
```

`init.sh` copia `.env.example` → `.env` si falta. Docker no arranca solo:
levántalo manualmente cuando la feature lo necesite.

### Aprovisionar los recursos de LocalStack (`localstack-provisioning`, #2)

Con `docker compose up -d` levantado (Postgres + LocalStack), desde
`backend-pet-tracker/`:

```bash
docker compose up -d          # si no estaba levantado ya
pnpm run provision:local
```

`provision:local` crea de forma idempotente (correrlo dos veces no falla ni
duplica nada): las colas SQS `positions-raw` + `positions-raw-dlq` +
`notifications` + `notifications-dlq` (con RedrivePolicy DLQ), la tabla
DynamoDB `positions` (pk/sk + TTL sobre `expires_at`), el bucket S3
`pet-tracker-media-local` (sin acceso público) y el bus EventBridge
`pet-tracker`.

Verificación manual:

```bash
aws --endpoint-url=http://localhost:4566 sqs list-queues
```

debe listar las 4 URLs de cola.

---

## Estado actual

- Harness SDD configurado y verde (`init.sh` pasa completo).
- Scaffold NestJS en `backend-pet-tracker/` — sin features todavía.
- Backlog reconciliado con `plans/` (002–009, solo backend): 18 features.
- Datos: **Postgres 17 (Docker) para dominio + DynamoDB (LocalStack) para
  telemetría GPS** + Drizzle — ver `docs/data-model.md` (modelo del plan 001
  adaptado). Auth propia (JWT) porque Cognito no existe en LocalStack
  community; mapa completo de adaptaciones locales en `docs/architecture.md`.
- Infra local: `docker-compose.yml` (Postgres 17 + LocalStack),
  `.env.example` en raíz, `DATABASE_URL` verificada por `init.sh`.
- CI: GitHub Actions (`.github/workflows/ci.yml`) corre `init.sh` en cada PR
  y push a main — verde. Flujo por feature: branch `feature/<id>-<nombre>` +
  PR que el humano mergea (`docs/conventions.md` §Branches y Pull Requests).
- Brief maestro copiado a `docs/brief.md`.
- Knowledge graph con graphify (`pip install graphifyy`): grafo local en
  `graphify-out/` (gitignored) sobre código + plans + docs, sin LLM.
  Hooks PreToolUse activos (consultar grafo antes de grep/read);
  refrescar con `graphify update .` tras cambios de código.
- **`db-setup-drizzle` (#1) done**: Drizzle ORM cableado (drizzle-orm/pg/
  drizzle-kit, `drizzle.config.ts`, `src/db/` con schema barrel +
  `DrizzleModule` bajo token `DRIZZLE`), `AppConfigModule` global (`../.env`),
  `GET /v1/health` público. Revisado, aprobado por el `reviewer` y mergeado
  a `main` (PR #1).
- **`localstack-provisioning` (#2) done**: `src/aws/` (clientes AWS SDK v3
  vía ConfigService, `AwsModule` con tokens de inyección, `provisioning.ts`
  idempotente para las 4 colas SQS + tabla `positions` con TTL + bucket S3 +
  bus EventBridge) y `scripts/provision-local.ts` (`pnpm run
  provision:local`). Branch `feature/2-localstack-provisioning`, revisado y
  aprobado por el `reviewer` (rechazo inicial por R4 sin test nombrado,
  corregido en `2bd5de2` y re-aprobado), mergeado a `main` (`71efa13`).
  **Seguimiento cerrado (2026-08-01)**: el e2e
  `test/localstack-provisioning.e2e-spec.ts` corrió contra LocalStack real
  (imagen pineada a `4.14`, ver sesión 2026-08-01) — 10/10 verdes, con lo
  que R4-R8 y R10-R14 quedan verificados y los 19/19 requisitos ejecutados.
  Ver `progress/impl_localstack-provisioning.md` y
  `progress/review_localstack-provisioning.md`.
- **`auth-registration` (#3) done**: primera feature con tablas de dominio
  reales. `src/db/schema/` con `users`, `email_verification_tokens` y
  `audit_log` (+ migraciones `0001` CREATE y `0002` DROP del placeholder
  `schema_bootstrap` de #1, que queda eliminado); `src/audit/` como módulo
  `@Global()` compartido (puerto `AuditLogger` + token `AUDIT_LOGGER`) que
  reutilizarán #5 y #7; `src/modules/auth/` en 3 capas con `POST
  /v1/auth/register` (201) y `POST /v1/auth/verify-email` (200). argon2id tras
  el puerto `PasswordHasher`, UUIDv7 generado en el repositorio Drizzle, token
  opaco de un solo uso persistido solo como SHA-256, `EMAIL_ENABLED=false` →
  log estructurado en vez de SES. Branch `feature/3-auth-registration`,
  revisado y **aprobado** por el `reviewer`, mergeado a `main` (PR #4,
  `1c7a9fe`). **Seguimiento cerrado (2026-08-01)**: migraciones `0001`/`0002`
  aplicadas contra Postgres 17 real (Docker) — las 3 tablas creadas y
  `schema_bootstrap` eliminado. Sin ejecutar en runtime real quedan solo el
  `returning()` del insert de `users` y los `update ... where` de
  `markEmailVerified`/`markUsed` (no hay e2e de auth versionado — deuda
  menor, candidato a e2e cuando `auth-login-me` #4 toque el mismo módulo).
  Ver `progress/impl_auth-registration.md` y
  `progress/review_auth-registration.md`.
- **`auth-login-me` (#4) done**: `POST /v1/auth/login` (JWT HS256, 24h TTL)
  detrás de un puerto `TokenService` nuevo (`JwtTokenService`, único archivo
  que importa `jsonwebtoken`); `AuthGuard` global vía `APP_GUARD` +
  `@Public()`/`@CurrentUser()` (cubre `/v1/health`,
  `/v1/auth/{register,verify-email,login}` como públicas, todo lo demás
  protegido); módulo nuevo `src/modules/users/` con `GET`/`PATCH /v1/me`
  (update parcial atómico, `timezone` validada con
  `Intl.supportedValuesOf('timeZone')`, auditoría `user.update` con solo
  nombres de campo). Reutiliza `UserRepository`/`PasswordHasher`/
  `AuditLogger` de #3 sin duplicar dominio. Branch `feature/4-auth-login-me`,
  revisado y **aprobado** por el `reviewer` (sin observaciones bloqueantes
  ni no bloqueantes) — PR #5 tuvo CI rojo por un test de
  `auth.module.spec.ts` que intentaba recuperar `APP_GUARD` vía
  `moduleRef.get()` (imposible en un TestingModule: Nest reempaqueta esos
  providers bajo tokens internos), corregido en el rebase del 2026-08-01.
  **Mergeado a `main` por el humano (PR #5, `86dbcd5`)**. Ver
  `progress/impl_auth-login-me.md` y `progress/review_auth-login-me.md`.
- **Hallazgo de entorno (2026-07-31, propio de AQUEL sandbox — resuelto)**:
  en el sandbox Linux donde se trabajó #4, `pnpm test` (vía `init.sh`) daba
  **segfault** — el binding nativo de `argon2` (usado tras el puerto
  `PasswordHasher`, #3) no cargaba: el prebuild
  `linux-x64/argon2.glibc.node` segfaulteaba al hacer `require('argon2')`, y
  compilarlo desde fuente fallaba porque no había `make` instalado (sin sudo
  para instalarlo). Nunca fue un problema del código — CI en GitHub Actions
  siempre estuvo verde en ese aspecto, y en la máquina actual (Windows,
  2026-08-01) los 2 archivos afectados (`argon2-password-hasher.spec.ts` y
  `auth.module.spec.ts`) corren y pasan con normalidad. Se conserva la nota
  solo como registro: si se vuelve a trabajar en un sandbox sin toolchain
  nativo, el patrón de acotar con `npx jest --testPathIgnorePatterns=...`
  sigue siendo válido.
- **`pets-crud-permissions` (#5) done**: tablas `pets` + `pet_users`
  (migración `0003`), `PetAccessGuard` + `@RequirePetRole` — sin membresía
  activa → 404 (IDOR bloqueado, e2e obligatorio verificado), rol
  insuficiente → 403; CRUD `/v1/pets` (POST transaccional pets +
  pet_users(owner) con audit `pet.create` post-commit vía puerto
  `AuditLogger` de #3; GET lista solo membresías con `myRole`; GET detalle
  con shape completo y `device`/`nextVaccine`/`nextReminder`/
  `activitySummary` en `null` para features posteriores; PATCH con
  birthDate XOR approxAgeMonths; DELETE cascade solo owner). Spec 16 EARS
  aprobada por humano 2026-08-01. `reviewer` rechazó primero por B1
  (frontmatter de spec en `draft`), fix del leader, resto aprobado a la
  primera: init.sh verde, 275 unit (56 suites), e2e 19/19 contra Postgres
  real. Branch `feature/5-pets-crud-permissions` (14 commits), **mergeado
  por el humano (PR #8, `ebc3d59`)**. Ver
  `progress/impl_pets-crud-permissions.md` y
  `progress/review_pets-crud-permissions.md`.
- **`devices-claim` (#7) done**: tablas `devices` + `pet_devices`
  (migración `0004`: índice único parcial por `device_id` activo y por
  `pet_id` activo, UNIQUE en `esn`/`imei`/`wialon_unit_id`/
  `activation_code`/`serial_number`); `POST /v1/devices/claim` con
  membresía en el use case vía `PET_REPOSITORY.findMembership()` (D1 —
  guard de #5 intacto), 404/403/404/409/409; disponibilidad derivada de
  la fila activa (D3, self-healing tras borrar mascota); `GET`/`DELETE
  /v1/pets/:petId/device` con `PetAccessGuard`; seed idempotente
  `pnpm run seed:devices` (SIM-001..003/ACT-001..003); auditoría
  `device.claim`/`device.release`. Spec 15 EARS aprobada por humano
  2026-08-01 (D1-D4). `reviewer` aprobó a la primera sin bloqueantes:
  init.sh verde (319 unit), e2e 55/55 contra Postgres real (devices
  21/21: IDOR R5, carrera R8, self-healing R15), trazabilidad 15/15.
  Branch `feature/7-devices-claim` (15 commits), **PR #11 mergeado a
  main** (2026-08-01, merge `eff7361`); init.sh verde en main
  post-merge. Ver `progress/impl_devices-claim.md` y
  `progress/review_devices-claim.md`.
- Deuda menor detectada en #3 (sigue abierta, reviewer de #7 la
  re-señaló como NB): no existe script `db:migrate` en `package.json`
  (solo `db:generate`), aplicar migraciones exige hoy
  `exec drizzle-kit migrate` a mano. Candidato a tarea propia.
- **`wialon-ingestion-pipeline` (#8) done**: cadena GPS completa en local —
  `src/integrations/wialon/` (puerto `WialonClient` + factory por
  ConfigService: `FakeWialonClient` determinista con `SIM_SEED`/mulberry32
  por slot, `WialonHttpClient` real mapeado pero sin conectar),
  `src/pipeline/` (núcleo puro sin I/O: `normalize`, haversine, umbrales
  60/100/4/20 en `constants.ts` que #10-#12 importarán), `src/workers/`
  (poller cron 1 min vía `@nestjs/schedule` → SQS `positions-raw` →
  consumidor: BatchWrite idempotente a DynamoDB `positions`, update
  condicionado por ts de `devices` + `pets.last_position`, eventos
  `position.updated`/`battery.low` detail.version=1 a EventBridge;
  malformados vía redrive a DLQ). Workers apagados con `NODE_ENV=test` o
  sin `POLLER_ENABLED` — e2e previos intactos. Cero migraciones; deps
  nuevas `@nestjs/schedule` + `@aws-sdk/lib-dynamodb`; 7 env vars nuevas
  documentadas; `docs/wialon-module.md` creado (cierra drift del plan 005).
  Spec 19 EARS + D1-D14 aprobada por humano 2026-08-02. `reviewer` aprobó
  (C2-C7, init.sh + e2e ejecutados por él mismo, trazabilidad 19/19
  muestreada; NB1/NB2 corregidos). init.sh verde: 397 unit / 69 suites;
  e2e 58/58 contra Docker real. **PR #13 mergeado a `main`** (2026-08-02,
  merge `77d530f`). Ver `progress/impl_wialon-ingestion-pipeline.md` y
  `progress/review_wialon-ingestion-pipeline.md`.
- **`positions-api` (#9) done**: cierra la cadena GPS por el lado de
  lectura. Módulo nuevo `src/modules/positions/` en 3 capas con dos rutas
  bajo `PetAccessGuard` de #5 sin `@RequirePetRole` (mascota ajena → 404,
  `petId` siempre desde `request.petMembership`): `GET
  /v1/pets/:petId/positions/last` sirve desde la caché `pets.last_position`
  sin tocar DynamoDB (+ `staleSeconds` con reloj inyectado; caché NULL o
  corrupta → `200` con body `null`), y `GET /v1/pets/:petId/positions`
  pagina el historial con una `Query` por página (`pk = PET#<petId>` +
  `sk BETWEEN`, ascendente, `Limit 1000`), query string zod `.strict()`
  (defaults `to = now` / `from = to − 60 min`, `INVALID_RANGE` y
  `RANGE_TOO_LARGE` a 400), filtro de `low_accuracy` por defecto
  (`?includeSuspect=true` no filtra) y cursor opaco base64url `{v,p,q,k}`
  que rechaza cursores corruptos, de otra mascota o de otra consulta sin
  llegar a hacer la Query. **Feature de solo lectura: cero migraciones,
  cero env vars nuevas, cero dependencias nuevas**; único cambio fuera del
  módulo, el registro en `app.module.ts`. Spec 16 EARS + D1-D6 aprobada
  por humano 2026-08-02 (D6: `DocumentClient` propio desde
  `DYNAMODB_CLIENT` en vez de importar `IngestionModule`, que habría
  obligado a editar `src/workers/`). `reviewer` **aprobó sin
  bloqueantes**: init.sh verde (482 unit), e2e 84 contra Postgres +
  LocalStack reales, trazabilidad 16/16. Evidencia manual R6 con la cadena
  real (claim `ACT-002` → poller → SQS → consumidor → Postgres): `200`,
  `staleSeconds: 47`, 24 items de historial. Branch
  `feature/9-positions-api` (12 commits), **PR #15 mergeado a `main`**
  (2026-08-02, merge `c833956`). Ver `progress/impl_positions-api.md` y
  `progress/review_positions-api.md`.
- Deuda menor abierta de #9 (NB del reviewer, no bloqueante): la
  paginación sin `from`/`to` explícitos usa la ventana por defecto de
  60 min, así que un cursor emitido en esa llamada sigue anclado a la
  ventana original — correcto pero poco obvio; candidato a documentar en
  el contrato del endpoint cuando la app móvil lo consuma.
- **`trips-activity` (#10) done**: cierra la cadena GPS (#8 escribe, #9 lee,
  #10 agrega). Núcleo puro nuevo en `src/pipeline/` — `trips.ts`
  (`groupTrips`: apertura con 3 puntos consecutivos > 1,8 km/h, cierre por
  10 min sin movimiento o gap > 15 min, descarte de paseos < 5 min o
  < 100 m, distancia que excluye pares con `suspect_jump`), `local-day.ts`
  (`localDayOf`/`localDayRange` con `Intl`, **sin dependencia nueva**: el
  `endMs` de un día es el `startMs` del siguiente, así los días DST de 23 h
  y 25 h salen correctos por construcción) y `activity.ts`
  (`computeDailyActivity`, 7 métricas sobre la ventana observada). Módulo
  `src/modules/activity/` con migración `0005_activity_daily` (PK
  `(pet_id, date)`, upsert `ON CONFLICT` idempotente que **preserva
  `time_away_minutes`** para #13), agregador de tick horario que procesa por
  owner el último día local **cerrado** (`runOnce(now)` invocable, gating
  `ACTIVITY_AGGREGATOR_ENABLED` + `NODE_ENV !== 'test'`, patrón de #8) y tres
  rutas tras el `PetAccessGuard` de #5: `GET /trips?date`, `GET /trips/:n`
  (índice estable, `path` completo) y `GET /activity/daily?from&to`
  (`source: stored | computed | missing`, hoy al vuelo sin persistir,
  `weekComparison` contra los 7 días previos). Spec 23 EARS + D1-D15
  aprobada por humano 2026-08-02, precedida de `explorer`. `reviewer`
  **aprobó**: init.sh verde (88 suites / 606 tests), e2e 111 contra Postgres
  + LocalStack, trazabilidad 23/23, 0 bloqueantes. Branch
  `feature/10-trips-activity` (10 commits), **PR #17 mergeado a `main`**
  (2026-08-02, merge `a503f36`). Ver `progress/explore_trips-activity.md`,
  `progress/impl_trips-activity.md` y `progress/review_trips-activity.md`.
- **Desviación de plan documentada en #10 (D2)**: el `cron(15 2 * * *)` que
  proponía el plan 006 §Paso 3 es un bug latente — 02:15 UTC son las 20:15
  del día anterior en `America/Mexico_City`, así que el agregador habría
  persistido una fila de un día local **aún sin cerrar**, que además nunca se
  recomputaba. Sustituido por un tick horario que procesa, por owner, el
  último día local cerrado. Vale para cualquier zona y no necesita aritmética
  de offsets.
- **Hallazgo de entorno de #10, verificado por el reviewer**:
  `Intl.supportedValuesOf('timeZone')` **no incluye `'UTC'`** en Node
  v24.16.0 (devuelve 418 zonas canónicas; tampoco `Etc/UTC`), pese a que
  `Intl.DateTimeFormat` sí acepta `'UTC'`. Como `users.timezone` tiene
  default `'UTC'` desde #3, validar contra ese catálogo a secas habría hecho
  reventar a toda mascota con el default. El código usa
  `new Set([...Intl.supportedValuesOf('timeZone'), 'UTC'])` — corrige un
  artefacto de enumeración, no amplía el catálogo (`'Marte/Olympus'`,
  `'utc'`, `''` y `'Etc/UTC'` siguen rechazados). A tener en cuenta en
  cualquier feature futura que valide timezones.
- Deuda menor abierta de #10 (3 NB bajos del reviewer, ninguno bloqueante):
  el spread `{petId, ...query}` del controller está a salvo solo gracias a
  `strictObject`; el borde `n === trips.length` de `GET /trips/:n` no tiene
  test aunque el código es correcto; `RANGE_TOO_LARGE` con un solo extremo
  toca Postgres una vez antes de rechazar.
- **`pet-photos-s3` (#6) done**: módulo nuevo `src/modules/media/` — `POST
  /v1/pets/:petId/photo-upload-url` (owner-only vía `PetAccessGuard` +
  `@RequirePetRole('owner')`, D1) valida `contentType` (zod,
  `image/jpeg|png|webp`), persiste `pets.photo_key` y emite un PUT S3
  prefirmado de 10 min; `GET /v1/pets/:petId` resuelve `photoUrl` a un GET
  prefirmado de 1 h cuando `photo_key` no es nulo (D2: solo detalle, mismo
  alcance que `device` en #7). Reutiliza `PetAccessGuard`, `PET_REPOSITORY`,
  `S3_CLIENT`/bucket y `AUDIT_LOGGER` sin mecanismos nuevos; cero migración
  (`pets.photo_key` ya existía desde #5). Spec 9 EARS + D1-D3 aprobada por
  humano 2026-08-05. `reviewer` aprobó condicional a R8 (verificó código e
  init.sh/e2e de forma independiente): init.sh verde (91 suites / 623
  unit), e2e 10/11 contra Postgres + LocalStack reales, trazabilidad 9/9.
  Branch `feature/6-pet-photos-s3` (8 commits), **PR #19 mergeado por el
  humano** (`1aede70`). Ver `progress/impl_pet-photos-s3.md` y
  `progress/review_pet-photos-s3.md`.
- **Hallazgo de entorno de #6, verificado por implementer y reviewer por
  separado (R8)**: LocalStack Community 4.14 no aplica
  `PutPublicAccessBlock`/ACLs/bucket-policy en el plano de datos de S3 — un
  `GET` anónimo sobre un objeto existente responde `200`, no `403`, aunque
  la config sí persiste (mismo patrón que `localstack-provisioning` #2
  R13). No es un defecto de código: el único puerto de acceso
  (`PHOTO_STORAGE`) solo expone URLs firmadas. **Decisión humana: aceptado
  como limitación documentada**, no bloquea el cierre.
- **`geofences-crud` (#11) done**: núcleo puro nuevo `src/pipeline/
  geofence-eval.ts` (`isInside` círculo haversine + polígono ray-casting;
  `evaluate` máquina de estados con histéresis anti-parpadeo — salida
  radio×1.1 con accuracy ≤50 m, entrada radio×0.9 sin exigencia de
  accuracy, low_accuracy corta-circuita devolviendo el estado previo
  intacto; sin I/O, sin reloj de sistema, `nowMs` siempre del caller) +
  módulo `src/modules/geofences/` (CRUD de 5 rutas tras `PetAccessGuard`
  de #5, mutaciones owner-only vía `@RequirePetRole`, lectura abierta a
  cualquier rol activo). Migración `0006` (tabla `geofences`: `type` CHECK
  restringido a `'safe_circle'` — MVP solo círculo aunque `isInside` ya
  soporta polígono para cuando exista CRUD que lo produzca —, único
  `(pet_id, name)`, tope de 5 por mascota vía `COUNT` en el use case,
  carrera documentada como `ponytail`). `geofence_state` (`{state,
  updatedAt}`) vive como columna jsonb en la propia fila, congelado desde
  el primer commit para que `alerts-engine` (#12) lo reutilice sin
  migración nueva — ningún caso de uso de esta feature llama a
  `evaluate()` todavía, es núcleo puro sin conectar. Spec 26 EARS + D1-D5
  aprobada por humano 2026-08-05. `reviewer` **aprobó** verificando C2-C7
  y R1-R26 línea por línea contra el código real, IDOR entre mascotas del
  mismo owner incluido; init.sh + e2e corridos por él mismo (642 unit,
  20/20 e2e de la feature). Branch `feature/11-geofences-crud`.
- **Bloqueante de cierre encontrado y resuelto (2026-08-05)**: el
  `reviewer` de #11 detectó que `./init.sh` no cerraba en verde por una
  aserción preexistente y ajena en
  `activity.drizzle.store.spec.ts` (`trips-activity` #10, ya mergeada) que
  afirmaba "0005 es la última migración del repo" — una propiedad global
  y temporal que revienta con la primera migración de cualquier feature
  futura (la propia `0006` de #11 la disparó). Corregido en branch aparte
  `fix/activity-migration-assertion` (mismo precedente que
  `fix/jest-e2e-alias`, 2026-08-01): la aserción ahora localiza la
  migración `0005` por contenido (`CREATE TABLE "activity_daily"`) y
  verifica que no crea otras tablas, mismo patrón que
  `devices.schema.spec.ts`/`pets.schema.spec.ts` — inmune a migraciones
  posteriores. `implementer` + `reviewer` en ciclo corto (sin spec, bugfix
  de 1 archivo), **PR #22 mergeado por el humano**; `feature/11-geofences-
  crud` rebaseado sobre `main` post-merge, `init.sh` verde completo
  (92 suites / 642 tests) y e2e 141/142 (único fallo:
  `media.e2e-spec.ts`, flakiness de LocalStack ya aceptada en el cierre de
  `pet-photos-s3` #6, no relacionada). Relevante para el futuro: la
  próxima migración (candidata: `alert_events` de `alerts-engine` #12) ya
  no debería repetir este bloqueante.
- **`alerts-engine` (#12) done**: worker nuevo `src/workers/alerts-engine/`
  que consume `position.updated`/`battery.low` desde la cola nueva
  `geofence-events` (+ DLQ, regla EventBridge sin `RawMessageDelivery` —
  infra que #2 no había previsto, `provisionAllResources()` extendido);
  despacha por `detail-type`, evalúa geocercas con `evaluate()` de #11
  (**intacta, sin tocar**, primer consumidor real), abre/cierra
  `alert_events` (migración `0007`, índice único parcial anti-spam
  `(pet_id, type, coalesce(geofence_id, '00000000-…'::uuid)) WHERE
  status='open'` — D1 `geofence_id` con `ON DELETE SET NULL`, D4 literal
  fijo en vez de `uuid_nil()` sin extensión `uuid-ossp`); orden de
  escritura a prueba de caídas (`alert_events` antes que `geofence_state`,
  D3, con aserción de `invocationCallOrder`); cierra `battery_low` con
  batería ≥30 (`BATTERY_RECOVERY_THRESHOLD_PCT`, nueva constante en
  `pipeline/constants.ts`, único añadido a ese archivo); encola en SQS
  `notifications` con shape versionado (`version: 1`, D5) que consumirá
  `alerts-center-notifier` (#13). Reubicadas 3 constantes de contrato
  (`EVENT_SOURCE`/`DETAIL_TYPE_POSITION_UPDATED`/`DETAIL_TYPE_BATTERY_LOW`)
  de `workers/ingestion.constants.ts` a `aws/constants.ts` (D2, mismo
  valor, sin romper el contrato R16/R17 de #8). Spec 20 EARS + D1-D5
  aprobada por humano 2026-08-07 vía `AskUserQuestion` (bloqueado hasta
  confirmación explícita — un "listo" de chat no bastaba, la spec exigía
  confirmar D1-D5 uno por uno). `reviewer` **aprobó** verificando código
  real, corriendo `init.sh` y el e2e él mismo (699 tests, e2e propio 3/3
  ×3 corridas anti-flake), trazabilidad 20/20. **Bug B1 repetido** (mismo
  que #5): frontmatter `draft` en 3 de los 4 archivos de spec pese al
  gate humano cerrado — corregido por el leader antes de marcar `done`.
  NB no bloqueante: los tests "R14" ejercitan el guard de R7, no el caso
  borde de caída-a-mitad-de-camino que describen — mecanismo sí probado,
  rótulo a corregir. Branch `feature/12-alerts-engine` (6 commits). Ver
  `progress/impl_alerts-engine.md` y `progress/review_alerts-engine.md`.
- **Hallazgo de seguridad ajeno a esta feature (2026-08-07, sin tocar,
  pendiente de decisión humana)**: `.mcp.json` tiene un PAT de GitHub en
  texto plano en un cambio que ya estaba sin commitear en el working tree
  **antes** de esta sesión — no lo trackea `.gitignore` (el patrón nuevo
  `./.mcp.json` no es sintaxis válida y el archivo de todas formas ya
  está trackeado). Posible intento de resolver el bloqueo conocido de
  `GITHUB_TOKEN` con scope insuficiente para crear PRs. Pendiente: rotar
  el token, sacarlo a variable de entorno, corregir `.gitignore`.
- Próximo paso SDD: **no quedan features P1**. `alerts-center-notifier`
  (#13) es la continuación natural — consume la cola `notifications` que
  #12 ya llena (push simulado con `PUSH_ENABLED=false`) y añade el centro
  de alertas (`GET /v1/alerts`, `POST /v1/alerts/:id/ack`); también
  rellena `time_away_minutes` de `activity_daily` (#10) desde
  `alert_events`. Integración Wialon real: diferida hasta tener hardware
  en mano (SIM_MODE es el camino; conectar real será smoke test de
  config, no feature).

---

## Última sesión

- **2026-08-07** — Ciclo SDD completo de `alerts-engine` (#12):
  `spec_author` (20 EARS, D1-D5 con propuesta explícita cada una) →
  **gate humano** vía `AskUserQuestion` (D1: opción A `ON DELETE SET
  NULL`; D2-D5 confirmados íntegros) — bloqueado hasta esa confirmación
  explícita porque el checkbox llegó marcado sin fecha, el frontmatter
  seguía en `draft` y un "listo, continúa" de chat no cubría lo que la
  spec pedía confirmar → `implementer` (5 commits TDD por R-id: schema+
  índice R1-R2, provisioning cola/regla R3-R4, consumer+scheduler
  R5-R17, e2e+guarda de pureza R18-R19, trazabilidad R20) → `reviewer`
  **aprobó** verificando código real (no el reporte a ciegas), corriendo
  `init.sh` y el e2e él mismo (699 tests, e2e propio 3/3 ×3 corridas), y
  reproduciendo en aislamiento el fallo ajeno de `media.e2e-spec.ts`
  antes de aceptarlo como flakiness ya conocido. **Bug B1 repetido**
  (mismo que `pets-crud-permissions` #5): frontmatter `draft` en 3 de los
  4 archivos de spec pese al gate humano — corregido por el leader.
  Feature marcada `done`, branch `feature/12-alerts-engine` (6 commits),
  espera push + PR. Hallazgo de seguridad ajeno reportado al humano sin
  tocar: PAT de GitHub en texto plano en `.mcp.json` (cambio preexistente
  a la sesión, no commiteado). Próximo: `alerts-center-notifier` (#13).

- **2026-08-05 (2)** — Ciclo SDD completo de `geofences-crud` (#11):
  `spec_author` (26 EARS, D1-D5 con propuesta explícita cada una) →
  **gate humano aprobado** (D1-D5 íntegras) → `implementer` (4 commits:
  núcleo puro R16-R25, módulo CRUD R1-R15, docs/trazabilidad) → `reviewer`
  **aprobó** verificando código real y corriendo `init.sh`/e2e él mismo,
  pero encontró que el cierre a `done` quedaba bloqueado por un test
  ajeno y preexistente de `activity` que rompe con cualquier migración
  nueva (diagnóstico y fix ya propuestos por el propio reviewer). Ciclo
  corto aparte para ese bloqueante: branch `fix/activity-migration-
  assertion` → `implementer` (repro rojo→verde con migración de prueba
  descartable) → `reviewer` **aprobó** → **PR #22 mergeado por el
  humano**. `feature/11-geofences-crud` rebaseado sobre `main`, `init.sh`
  verde completo confirmado por el leader, feature marcada `done`.
  Lo que trasciende a la feature: el patrón "localizar migración por
  contenido, no por posición" (`devices.schema.spec.ts`/
  `pets.schema.spec.ts`) evita que la próxima migración de cualquier
  feature repita el mismo bloqueante. Próximo: `alerts-engine` (#12).

- **2026-08-05** — Ciclo SDD completo de `pet-photos-s3` (#6): `spec_author`
  (9 EARS, D1-D3 con propuesta explícita cada una) → **gate humano
  aprobado** (D1-D3 confirmadas tal como las proponía la spec vía
  `AskUserQuestion`) → `implementer` (7 commits TDD por R-id) → `reviewer`
  **aprobó condicional a R8** (verificó código real de forma independiente,
  corrió `init.sh` y el e2e él mismo: 623 unit / 10 de 11 e2e) → decisión
  humana sobre R8 (aceptado como limitación documentada de LocalStack
  Community, no bloqueante) → **PR #19 mergeado por el humano** (`1aede70`).
  Lo que trasciende a la feature: LocalStack Community no aplica ACL/
  bucket-policy/Block-Public-Access en el plano de datos de S3, solo
  persiste la config (documentado arriba). Próximo: elegir entre
  `geofences-crud` (#11) y `alerts-engine` (#12).

- **2026-08-02 (3)** — Ciclo SDD completo de `trips-activity` (#10), la
  feature más grande hasta ahora: `explorer` (775 líneas, 15 decisiones
  abiertas detectadas, incluido el bug del cron del plan 006) →
  `spec_author` (23 EARS, D1-D15 con propuesta explícita cada una) → **gate
  humano aprobado** (D1-D15 íntegras) → `implementer` (6 commits TDD, una
  migración, cero dependencias nuevas) → `reviewer` **aprobó** sin
  bloqueantes (init.sh y e2e ejecutados por él mismo: 606 unit / 111 e2e;
  dictaminó las 9 desviaciones declaradas una por una) → **PR #17 mergeado
  por el humano** (`a503f36`). Lo que salió de aquí y trasciende a la
  feature: la desviación D2 del cron nocturno y el hallazgo de que
  `Intl.supportedValuesOf('timeZone')` no enumera `'UTC'` en Node v24.16.0
  (ambos documentados arriba). Incidente de harness: el primer intento de
  lanzar el `implementer` lo cortó el clasificador de auto mode; el humano
  cambió de modo y se relanzó sin consecuencias. Próximo: elegir entre #11
  (geocercas) y #6 (fotos S3).

- **2026-08-02 (2)** — Cierre de `positions-api` (#9). La sesión arrancó con
  la feature a medias: el `implementer` de la sesión anterior había
  commiteado R1-R5 y R7-R15 pero murió sin cerrar (trazabilidad en blanco,
  sin reporte, R6 y R16 sin verificar, guion temporal
  `scripts/r6-evidence.tmp.ts` sin correr). Se relanzó el `implementer`
  acotado a lo que faltaba: ejecutó la evidencia real de R6 (docker compose
  + poller `SIM_MODE` + claim `ACT-002`, 150 s de ciclos de cron →
  `staleSeconds: 47`), verificó R16 (cero migraciones, `workers/` y
  `pipeline/` intactos, init.sh 482 unit y e2e 84 en verde), rellenó las 16
  filas de trazabilidad y escribió el reporte (`72d8c94`). El `reviewer`
  **aprobó sin bloqueantes** con 3 NB (uno medio: `feature_list.json` fuera
  de la lista literal de R16, dictaminado bookkeeping aceptable; dos bajos:
  DX de paginación sin `from`/`to` y `graphify-out/` desactualizado, ya
  refrescado a 2361 nodos). **PR #15 mergeado por el humano** (`c833956`).
  Lección del arranque: cuando un `implementer` no deja
  `progress/impl_<feature>.md`, la trazabilidad en blanco es la señal fiable
  de que la feature no está cerrada aunque los commits de código estén.
  Próximo: elegir entre #6 (fotos S3) y #10 (recorridos) — ya no hay P1.

- **2026-08-02** — Ciclo SDD completo de `wialon-ingestion-pipeline` (#8):
  `explorer` → `spec_author` (19 EARS, D1-D14) → gate humano (aprobó spec
  y las 14 decisiones íntegras) → `implementer` (21 commits TDD, cero
  migraciones) → `reviewer` **aprobó** (397 unit + 58/58 e2e verificados
  por él mismo contra Docker real; NB1 frontmatter `125685b`, NB2
  comentario huérfano `a2fb802`, ambos corregidos) → **PR #13 abierto** y
  mergeado por el humano el mismo día (`77d530f`). Feature marcada `done`. Incidente menor: primer
  intento de reviewer murió por límite de sesión del API, relanzado sin
  consecuencias. Próximo: merge de PR #13, luego ciclo de `positions-api`
  (#9).

- **2026-08-01 (5)** — Sin ciclo SDD (consulta + cierre). Se explicó el
  diseño de la integración Wialon de #8 (fake determinista vs
  `WialonHttpClient` real por factory) y se acordó diferir la conexión
  real hasta #9 done + collar físico. El humano mergeó **PR #11**
  (`eff7361`); validado: main sincronizado, branch local borrada,
  init.sh verde 6/18. Próximo: ciclo #8 con `explorer` previo.

- **2026-08-01 (4)** — Ciclo SDD completo de `devices-claim` (#7) en una
  sesión: `spec_author` (15 EARS, 4 decisiones abiertas D1-D4) → **gate
  humano aprobado** (D1-D4 aceptadas como propone la spec: membresía en
  use case, doble índice único parcial, disponibilidad derivada de fila
  activa, UNIQUE en los 4 identificadores) → `implementer` (13 commits
  TDD por R-id, `docs/data-model.md` actualizado por D2/D4) → `reviewer`
  **aprobó a la primera** sin bloqueantes (4 NB: ruido de consola de un
  test de #5, cita cosmética en traceability R1, `db:migrate` sigue
  manual, cierre del leader pendiente en ese momento) → **PR #11
  abierto**, espera merge humano. Verificación independiente del
  reviewer: init.sh verde (319 unit), e2e 55/55 contra Postgres real.
  Próximo: merge humano de PR #11, luego spec de
  `wialon-ingestion-pipeline` (#8, siguiente P1).

- **2026-08-01 (3)** — Ciclo SDD completo de `pets-crud-permissions` (#5)
  en una sola sesión: `spec_author` (16 EARS, 5 decisiones abiertas) →
  **gate humano aprobado** (se aclaró de paso que `microchip` en pets es el
  chip veterinario de identificación, no el collar GPS — eso es #7/#8) →
  `implementer` (13 commits TDD por R-id) → `reviewer` **rechazó** por B1
  (frontmatter `draft` en los 4 archivos de spec pese a aprobación humana;
  único bloqueante, fix del leader `3a0b481`) con todo lo demás verde:
  init.sh completo (275 unit / 56 suites), e2e 19/19 contra Postgres real
  con IDOR verificado, C2-C7, main y auth intactos → PR #8 → **merge
  humano** (`ebc3d59`; PR #9 del humano registró el arranque de sesión).
  Próximo: spec de `devices-claim` (#7, siguiente P1) + gate humano.

- **2026-08-01 (2)** — Sesión corta de cierre: confirmado el merge humano
  del PR #5 (`auth-login-me`, #4) a `main` (`86dbcd5`) — working tree limpio,
  4/18 features done. Sin trabajo de features. Próximo: `spec_author` para
  `pets-crud-permissions` (#5) + gate humano.

- **2026-08-01** — Primera sesión con Docker real: cerrados los seguimientos
  de entorno que venían arrastrándose desde #1. Migraciones de #3 aplicadas
  contra Postgres 17 (3 tablas creadas, `schema_bootstrap` eliminado) y e2e
  de #2 ejecutado contra LocalStack real — 10/10, 19/19 requisitos de esa
  feature ya ejecutados. Dos bugs de entorno encontrados y corregidos en
  branch `fix/jest-e2e-alias`: (1) `localstack/localstack:latest` ahora exige
  `LOCALSTACK_AUTH_TOKEN` (serie CalVer 2026.x, exit 55) → imagen pineada a
  `4.14`, última community (leader, `7b0e492`); (2) `test/jest-e2e.json`
  mapeaba `@/` a `test/src/*` (inexistente) y rompía todo e2e que cargara
  `app.module.ts` — nunca visto porque los e2e jamás habían corrido con
  Docker → fix de una línea vía `implementer` (`1edcd38`), `reviewer` aprobó.
  Suite completa contra infra real: e2e 3/3 (15 tests), unit 30/30 (99
  tests), `init.sh` verde. Además, por decisión humana: convención de
  imports endurecida (`docs/conventions.md` §Imports, `25ee4ae`) — alias
  `@/` obligatorio también para saltos de capa dentro del mismo módulo — y
  refactor mecánico de `src/modules/auth/` para cumplirla (46 imports en 14
  archivos, `626bb10`, vía `implementer`, `reviewer` aprobó). Próximo: merge
  humano del PR del fix, luego spec de `auth-login-me` (#4).

- **2026-07-31 (2)** — Ciclo SDD completo de `auth-login-me` (#4) en el
  mismo sandbox: `spec_author` escribió R1-R15 → **gate humano aprobado** →
  `implementer` (10 commits, TDD por requisito, reutiliza
  `PasswordHasher`/`UserRepository`/`AuditLogger` de #3) → `reviewer`
  verificó código real de forma independiente (no solo el reporte) y
  **aprobó** sin observaciones. 41/41 suites, 161/161 tests (baseline
  28/96), sin regresiones. De paso se acotó el hallazgo de argon2 de la
  sesión anterior: solo 2 archivos afectados (no 3) —
  `auth.controller.spec.ts` corre normal. Feature marcada `done`, PR #5
  abierto. Próximo: merge humano, luego spec de `pets-crud-permissions` (#5).

- **2026-07-31** — Sesión de sandbox nuevo: confirmado merge humano del PR #4
  (`auth-registration`, #3) a `main` — `feature_list.json` ya reflejaba
  `done` desde el close-out de la sesión anterior. Se intentó validar la
  deuda de Docker pendiente (migraciones/e2e reales de #2 y #3); el sandbox
  actual bloquea Docker por permisos (`claude` no está en el grupo `docker`,
  sin password para `sudo`). Al intentar `init.sh` igual se encontró un
  segfault nuevo y no relacionado con Docker: el binding nativo de `argon2`
  no carga en este sandbox (prebuild segfaultea, build desde fuente falla
  por falta de `make`) — documentado arriba, no bloquea specs, CI remoto
  sigue verde. Decisión: no perseguir el entorno, avanzar con
  `spec_author` para `auth-login-me` (#4).

- **2026-07-30 (3)** — Ciclo SDD de `auth-registration` (#3): spec R1-R15
  escrita en la sesión anterior → **gate humano aprobado** (frontmatter
  `approved`) → `implementer` (6 commits, `aa584e4`..`b2131a1`, TDD por
  requisito) → `reviewer` **aprobó** en la primera pasada, verificando C2-C7
  contra el código real y corriendo `init.sh` él mismo. 30 suites / 99 tests
  (baseline 19 / 33), sin regresiones. Desviación de entorno, tercera sesión
  consecutiva con el mismo patrón: sin Docker, las migraciones no se aplicaron
  contra Postgres real; a diferencia de #2 aquí **no** se versionó un e2e sin
  ejecutar. Trabajo de harness de la misma sesión: los cuatro agentes
  delegables (`spec_author`, `explorer`, `implementer`, `reviewer`) no tenían
  frontmatter YAML, así que Claude Code nunca los registró como subagentes
  reales — añadido `name`/`description` en `b79ac5c`, ahora son invocables por
  nombre; `leader.md` queda sin frontmatter a propósito (es el rol del hilo
  principal). Añadida `permissions.allow` explícita en `.claude/settings.json`
  para que el flujo no dependa del clasificador de auto mode. Feature marcada
  `done`. Próximo: PR + merge humano, luego spec de `auth-login-me` (#4).

- **2026-07-30 (2)** — Ciclo SDD de `localstack-provisioning` (#2): spec
  (R1-R19, ampliada con R18/R19 tras feedback humano sobre la convención del
  alias `@/*`) → aprobación humana → `implementer` (12 commits) →
  `reviewer` **rechazó** primero por R4 sin test nombrado (solo vivía en un
  `beforeAll`, violando CHECKPOINTS C4) → `implementer` aplicó fix
  quirúrgico (`2bd5de2`) → `reviewer` re-revisó y **aprobó**. Antes de esto,
  también por feedback humano: se instaló `zod` (class-validator nunca se
  instaló pese a estar documentado) y se resolvió el alias `@/*` en las 3
  rutas de ejecución (`tsc-alias` para build, `moduleNameMapper` en Jest,
  `tsconfig-paths/register` para scripts standalone), documentado en
  `docs/conventions.md`. Desviación de entorno (igual patrón que #1, más
  amplia): sandbox sin Docker → 10/19 requisitos (creación real de
  recursos AWS) implementados y testeados pero sin ejecutar contra
  LocalStack real; sin alternativa nativa posible a diferencia de Postgres.
  Feature marcada `done`. Próximo: PR + merge humano, luego spec de
  `auth-registration` (#3).

- **2026-07-30** — Ciclo SDD completo de `db-setup-drizzle` (#1): spec (R1-R9)
  → aprobación humana → `implementer` (TDD estricto, 9 commits) → limpieza de
  comentarios por el humano → `reviewer` (verificación independiente:
  `init.sh` verde + e2e 5/5, aprobado con una observación no bloqueante ya
  corregida). Desviación de entorno: sandbox sin acceso al socket de Docker,
  se usó Postgres 16 local (`:5544`) para e2e en vez de Postgres 17 vía
  Docker — `.env`/`docker-compose.yml` sin modificar, pendiente validar 1:1
  contra Docker real. Feature marcada `done`. Próximo: PR + merge humano,
  luego spec de `localstack-provisioning` (#2).

- **2026-07-29 (2)** — Sesión de tooling: instalado graphify 0.9.30
  (paquete PyPI `graphifyy`, verificado contra PyPI y GitHub antes de
  instalar). Grafo construido 100% local (tree-sitter, sin LLM): 703
  nodos / 638 edges / 85 comunidades sobre código + plans + docs.
  Integración Claude Code (`graphify claude install`): sección en
  CLAUDE.md + hooks PreToolUse — commit `c4219a7`; `graphify-out/` y
  `*.graphify-bak` al .gitignore. Alias `@/*` en tsconfig por el humano
  (`16f7d45`). Sin trabajo de features. Próximo sin cambio: spec de
  `db-setup-drizzle` (#1).

- **2026-07-29** — Skills instaladas bajo convención del harness. Harness
  configurado: Postgres+Drizzle, conventions, estructura de módulo, infra
  local (docker-compose + .env.example). Backlog inicial de 7 features
  **reemplazado** tras reconciliar con `plans/` (002–009, solo backend):
  18 features alineadas al brief. Decisiones: auth propia (sin Cognito en
  LocalStack), posiciones GPS en DynamoDB LocalStack (fiel al plan),
  workers como cron+SQS en el mismo proceso NestJS. `docs/data-model.md`
  reescrito con el modelo del plan 001; brief → `docs/brief.md`.
  Después: CI con GitHub Actions (init.sh en cada PR/push, verde en
  25s) y flujo PR-por-feature documentado en conventions/AGENTS/CLAUDE —
  el humano aprueba mergeando cada PR.
  Resultado: verde. Próximo: spec de `db-setup-drizzle` (#1) vía
  `spec_author` + aprobación humana.

---

## Stack

- **Backend**: NestJS 11 + TypeScript, pnpm (código en `backend-pet-tracker/`)
- **Datos**: PostgreSQL 17 (Docker) dominio + DynamoDB (LocalStack) telemetría GPS; Drizzle ORM
- **Mensajería local**: SQS + EventBridge en LocalStack (positions-raw, notifications, bus pet-tracker)
- **Infra local**: LocalStack community — **sin AWS real**; arquitectura objetivo serverless en `plans/README.md`
- **Tests**: Jest + supertest
