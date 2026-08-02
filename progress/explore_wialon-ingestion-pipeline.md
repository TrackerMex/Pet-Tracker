# explore: wialon-ingestion-pipeline
Fecha: 2026-08-02

Feature #8 (`pending`, P1). Fuentes revisadas: `feature_list.json` (id 8),
`plans/005-collar-wialon-ingesta.md`, `docs/architecture.md`,
`docs/conventions.md`, `docs/data-model.md`, `src/aws/`, `src/audit/`,
`src/modules/devices/`, `src/db/schema/`, `scripts/seed-devices.ts`,
`package.json`, `.env.example`, `test/devices.e2e-spec.ts`. Orientación previa
con graphify (query sobre pipeline, pets.schema, puertos y devices).

---

## 1. Plan de origen (plans/005-collar-wialon-ingesta.md)

Esta feature cubre los pasos 1, 3 y 4 del plan (el paso 2 ya lo hizo #7
devices-claim; los pasos 5-6 son #9 positions-api y móvil, fuera de alcance).

**Paso 1 — Tipos y clientes Wialon** (`src/integrations/wialon/`):
- Interfaz `WialonClient`: `listUnits(): Promise<{unitId, name}[]>` y
  `getMessages(unitId, fromTs, toTs): Promise<RawPosition[]>`.
- `WialonHttpClient` real: base `https://hst-api.wialon.com/wialon/ajax.html`;
  login por token en cada ejecución (`svc=token/login` → `sid`);
  `svc=core/search_items` (`itemsType: 'avl_unit'`) para unidades;
  `svc=messages/load_interval` con `{itemId, timeFrom, timeTo, flags: 1,
  flagsMask: 65281, loadCount: 500}`; mapeo `pos.y→lat, pos.x→lng,
  pos.s→speed, pos.c→course, pos.sc→sats`, batería desde params si existe.
  Respuesta `{error: N}` → excepción tipada con el código.
- `FakeWialonClient`: determinista por semilla; unidades fake `900001…`
  (coinciden con el seed de #7); paseo desde "casa" (`SIM_HOME_LAT/LNG`,
  default CDMX 19.4326, -99.1332); caminata suave 0-8 km/h con pausas; ruido
  gaussiano ~10 m; cada ~50 puntos un salto absurdo y un duplicado (para
  probar `suspect_jump` y dedupe); batería -1 % cada ~30 min; un punto por
  cada 30 s del intervalo pedido.
- `wialonClientFactory`: `SIM_MODE=true` o token ausente/`PENDING` → fake;
  si no → real. **Default dev: fake.**
- Tipos `RawPosition`/`ProcessedPosition` (el plan los ponía en
  `packages/shared/` — aquí no hay monorepo compartido: vivirán en el backend,
  probablemente en `src/pipeline/` o `src/integrations/wialon/`).

**Paso 3 — Pipeline puro** (`src/pipeline/`):
- `normalize(raw: RawPosition[]): {accepted: ProcessedPosition[], discarded:
  DiscardedStat[]}`, aplicando en orden: rango lat/lng y (0,0) → descartar;
  sin ts → descartar; duplicados exactos por device_ts → descartar; orden
  cronológico; velocidad implícita entre consecutivos > 60 km/h → flag
  `suspect_jump` (se marca, NO se descarta); accuracy > 100 m o sats < 4 →
  flag `low_accuracy`. Haversine en `pipeline/geo.ts` (lo reutiliza #10
  trips-activity, que además asume `pipeline/constants.ts` para umbrales).
- Sin I/O. Fixture `pipeline/__fixtures__/walk.json` (~200 puntos generados
  con el fake): descarta (0,0) y duplicado, marca salto, conserva orden.
  Bordes: lista vacía, un punto, todos inválidos.

**Paso 4 — Ingesta** (adaptado: Lambda+Scheduler → local según
`docs/architecture.md` §Adaptación local — cron de `@nestjs/schedule` +
consumidores SQS en `src/workers/`, mismo proceso NestJS; la lógica pura vive
en `src/pipeline/` para que portarla a Lambdas sea solo empaquetado):
- **Poller** (cada 1 min): lista devices con asignación activa (Postgres),
  agrupa por unitId, `getMessages(unitId, watermark, now)` vía factory,
  publica lotes de ≤100 posiciones crudas a SQS `positions-raw` con body
  `{deviceId, petId, unitId, positions}`, avanza `devices.ingest_watermark`
  al ts del último mensaje **solo si hubo mensajes**.
- **Processor** (consumidor de `positions-raw`, batch 10 en el plan): por
  mensaje — `normalize()`, escribe DynamoDB `positions` (`pk=PET#<petId>`,
  `sk=device_ts`, `expires_at = device_ts/1000 + 90*86400`; PutItem idéntico
  ⇒ idempotente), actualiza `devices` (battery_pct, connectivity 'online',
  last_message_at) y `pets.last_position` jsonb `{lat,lng,ts,accuracy,battery}`
  + `last_communication_at`, y emite a EventBridge `source: 'pet-tracker'`:
  `position.updated` con detail `{petId, deviceId, position: <última
  aceptada>, batteryPct}` y `detail.version: 1`; si batería < 20 →
  `battery.low`. Hoy nadie escucha esos eventos (los consume #12) — el bus
  tolera eventos sin reglas.
- Notas del plan: el contrato de `position.updated` lo consumen los planes
  006/007/010 (cambiarlo rompe tres planes → versionar); el revisor debe
  confirmar idempotencia (PutItem por sk) y que un mensaje venenoso no
  reprocese el lote entero.

**⚠️ Drift detectado**: el plan cita `docs/wialon-module.md` como fuente
canónica del diseño (interfaz, API real, simulador, watermark, umbrales) y su
chequeo de deriva exige que exista — **ese archivo NO existe en este repo**
(solo hay brief/architecture/conventions/data-model/specs/verification/obsidian
en `docs/`). El contenido está resumido en el plan §Estado actual y §Paso 1.
Ver decisión abierta (a).

Otras adaptaciones locales ya decididas que difieren del texto del plan:
- Bus local se llama `pet-tracker` (constante `EVENT_BUS_NAME`), no
  `pet-tracker-dev`.
- No hay SSM en el flujo local: el token Wialon vendrá de env (`WIALON_*`),
  no de `/pet-tracker/dev/wialon-token`.
- No hay `reportBatchItemFailures` (eso es del event source mapping de
  Lambda): en local el equivalente es no-borrar el mensaje fallido y dejar
  que la RedrivePolicy (maxReceiveCount=3, ya provisionada) lo mueva a la DLQ.

## 2. Patrones reutilizables existentes

- **Clientes AWS (feature #2, `src/aws/`)**: `AwsModule` es `@Global()` y
  exporta los 4 clientes SDK v3 bajo tokens Symbol
  (`SQS_CLIENT`, `DYNAMODB_CLIENT`, `EVENTBRIDGE_CLIENT`, `S3_CLIENT` en
  `src/aws/aws.constants.ts`) — los workers solo hacen
  `@Inject(SQS_CLIENT)` etc., sin construir nada. Config vía
  `resolveAwsConfigFromConfigService` (nunca `process.env`; excepción
  documentada solo para scripts standalone).
- **Constantes de recursos** (`src/aws/constants.ts`): `QUEUE_POSITIONS_RAW =
  'positions-raw'`, `QUEUE_POSITIONS_RAW_DLQ`, `TABLE_POSITIONS =
  'positions'`, `TABLE_POSITIONS_PARTITION_KEY/SORT_KEY/TTL_ATTRIBUTE`
  (`pk`/`sk`/`expires_at`), `EVENT_BUS_NAME = 'pet-tracker'`,
  `SQS_MAX_RECEIVE_COUNT = 3`. El comentario del archivo dice explícitamente
  que #8 debe importar estos nombres, no re-teclearlos.
- **Audit (`src/audit/`)**: puerto `AuditLogger` + Symbol `AUDIT_LOGGER`,
  módulo `@Global()`; admite `userId: null` para acciones de sistema. Nota:
  auditar cada posición sería ruido/volumen — probablemente el pipeline no
  audita (decisión de spec; el claim/release ya auditan en #7).
- **Devices (#7)**: el schema ya trae TODO lo que el pipeline escribe:
  `devices.battery_pct`, `connectivity`, `last_message_at`,
  `ingest_watermark` (timestamptz, NULL hasta #8) y `wialon_unit_id` (text
  UNIQUE). El claim inicializa watermark = now − 10 min
  (`CLAIM_WATERMARK_LOOKBACK_MINUTES = 10` en `claim-device.use-case.ts`).
  El `DeviceRepository` actual NO tiene métodos para el poller (listar
  asignaciones activas con petId+unitId+watermark, avanzar watermark,
  actualizar batería/conectividad) — la spec debe decidir si extiende ese
  puerto o define un puerto propio del worker (ver (n)).
- **Seed (#7, `scripts/seed-devices.ts`)**: exporta `SIMULATED_DEVICES`
  (SIM-001..003 / ACT-001..003 / wialonUnitId `'900001'..'900003'` como
  string) — el fake debe alinear sus unitIds con estos valores; reutilizar la
  constante evita divergencia.
- **`pets.last_position` YA EXISTE** — no hay migración pendiente:
  `pets.schema.ts` define `lastPosition: jsonb('last_position')` y
  `lastCommunicationAt` timestamptz desde #5, comentadas como "cache
  desnormalizada que alimenta el pipeline de ingesta (#8)". La condición de
  STOP del plan ("last_position requiere migración no prevista") no aplica.
- **Patrón puerto+factory (auth #3/#4)**: `PasswordHasher`/`TokenService` en
  `modules/auth/domain/ports/` con token Symbol junto a la interface e
  implementación en `infrastructure/security/` — molde directo para
  `WialonClient`: interface + `WIALON_CLIENT` Symbol, y un provider
  `useFactory(ConfigService)` que elige `FakeWialonClient` o
  `WialonHttpClient` (mismo estilo que los providers de `AwsModule`).
- **Config**: `AppConfigModule.forRoot()` global con `envFilePath:
  ['../.env']`. Regla dura: toda var nueva entra a la tabla de
  `docs/conventions.md` y a `.env.example` en el mismo commit.
- **3 capas**: los módulos de negocio siguen
  domain/application/infrastructure. Pero `files_affected` de #8 pone el
  código en `src/integrations/wialon/`, `src/pipeline/` y `src/workers/` —
  fuera de `src/modules/` — coherente con architecture.md (pipeline puro sin
  framework ≈ capa domain; workers/integrations ≈ infraestructura). Ninguna
  de las 3 carpetas existe aún.
- **e2e harness**: `test/devices.e2e-spec.ts` siembra usuarios directo en DB,
  firma tokens con el `TokenService` real y usa `RUN_ID` para no chocar entre
  corridas — patrón replicable para el e2e de la cadena de ingesta.

## 3. Infra local ya provisionada (feature #2)

`provisionAllResources()` (`src/aws/provisioning.ts`, corre con `pnpm run
provision:local`, idempotente):
- Colas `positions-raw` + `positions-raw-dlq` (y `notifications` + DLQ), con
  RedrivePolicy `maxReceiveCount: 3` y DLQ creada primero.
- Tabla DynamoDB `positions`: `pk` String HASH, `sk` Number RANGE,
  PAY_PER_REQUEST, TTL habilitado sobre `expires_at`.
- Bus EventBridge `pet-tracker`; bucket S3 de media (no lo usa #8).

Shape del item según `docs/data-model.md` §DynamoDB:
- `pk = PET#<petId>`, `sk` = epoch ms del dispositivo (number).
- Atributos: `lat, lng, speed_kmh, course, altitude, sats, accuracy_m,
  battery_pct, device_ts, received_ts, processed_ts, flags
  (['suspect_jump','low_accuracy',…])`.
- `expires_at = device_ts + 90 días` (en segundos, para TTL).
- Idempotencia declarada: "PutItem sobre el mismo sk sobrescribe —
  reintentos seguros".

Detalles operativos que la spec debe cubrir:
- Los workers necesitan la **QueueUrl** (el provisioning la devuelve pero no
  la persiste): resolver por nombre con `GetQueueUrlCommand` al arrancar
  (recomendado; nombre desde `constants.ts`) o exigir env `QUEUE_URL`.
- Solo está instalado `@aws-sdk/client-dynamodb` (low-level): escribir items
  requiere marshalling manual o añadir `@aws-sdk/lib-dynamodb`
  (DocumentClient) — dependencia nueva probable.

## 4. @nestjs/schedule

**No está instalado** (`backend-pet-tracker/package.json` no lo lista) y no
hay ningún cron/`ScheduleModule`/`@Cron` en `src/` ni `scripts/`. La feature
introduce la dependencia y el primer `ScheduleModule.forRoot()`. Tampoco hay
ningún consumidor SQS previo — el patrón de consumo (loop de
`ReceiveMessage`) es nuevo en el repo (ver decisión (e)). #10 y #16 reusarán
el patrón de cron que esta feature establezca.

## 5. Riesgos y decisiones abiertas para la spec

a) **Fuente canónica del diseño Wialon**: `docs/wialon-module.md` no existe.
   Opciones: (1) la spec absorbe el contenido resumido del plan §Estado
   actual/§Paso 1 (rápido; pero los planes 006/007 también citan ese doc);
   (2) crear `docs/wialon-module.md` durante la fase de spec (es `docs/`, el
   leader/spec_author puede escribirlo). Decide leader/spec_author.

b) **Determinismo del fake (semilla)**: el criterio "misma semilla+intervalo
   ⇒ mismas posiciones" implica que la posición debe ser **función pura de
   (seed, unitId, ts)** — un fake con estado mutable acumulado divergiría
   tras un reinicio o entre dos llamadas solapadas. Abierto: (i) de dónde
   sale la semilla (env `SIM_SEED` con default fijo vs derivada del unitId);
   (ii) PRNG: no usar `Math.random` (no seedable) — un mulberry32/LCG propio
   de ~10 líneas evita dependencia nueva. Recomendación: generador stateless
   indexado por slot de 30 s.

c) **Formato del mensaje SQS**: el plan fija body `{deviceId, petId, unitId,
   positions}` (≤100 crudas). Abierto: (i) ¿campo `version` en el body (bajo
   costo, misma filosofía que detail.version)?; (ii) validación del mensaje
   en el consumidor con zod — malformado: ¿no-borrar y dejar que el redrive
   (3 recepciones) lo lleve a la DLQ (simple, usa la infra existente, retrasa
   ~3 ciclos) o reenviarlo directo a la DLQ y borrarlo (inmediato, pero el
   worker escribe en la DLQ a mano)? El acceptance solo exige "mensajes
   malformados van a DLQ".

d) **Estado del poller**: vive en `devices.ingest_watermark` (ya existe; el
   claim la inicializa a now−10min). Puntos a fijar en la spec: (i) avanzar
   watermark **después** de publicar a SQS y solo si hubo mensajes
   (at-least-once; los duplicados los absorbe el PutItem idempotente) —
   avanzar antes puede perder datos; (ii) solape de ejecuciones del cron si
   una corrida tarda >1 min: flag en memoria (suficiente en proceso único
   local) vs lock en DB (over-engineering local); (iii) error de un device no
   debe abortar el ciclo de los demás (log y continuar).

e) **Cómo consumir SQS sin Lambda**: no hay patrón previo. Opciones:
   (1) loop propio con `ReceiveMessageCommand` (long-polling, batch ≤10,
   delete explícito por mensaje procesado) disparado por `@Interval`/`@Cron`
   o un bucle en `OnModuleInit` — sin dependencia nueva, control total,
   más código; (2) librería `@ssut/nestjs-sqs` — menos código, dependencia
   extra. Dado que `@nestjs/schedule` entra de todos modos, (1) con un
   `@Interval` corto o drenado tras cada poll parece el menor riesgo.

f) **Idempotencia del consumidor**: PutItem por `sk` sobrescribe — OK para
   redelivery. Matices: (i) si se usa `BatchWriteItem` (lotes de 25), dos
   items con el mismo `sk` EN EL MISMO batch es `ValidationException` — el
   pipeline ya dedupea por device_ts antes, pero conviene requisito explícito
   de dedupe por sk intra-batch; (ii) `devices.*` y `pets.last_position`
   deben actualizarse **solo si el ts entrante es más reciente** que el
   cacheado, para tolerar redelivery/llegadas fuera de orden.

g) **Device sin pet activo (liberado a mitad del flujo)**: el poller solo ve
   asignaciones activas, así que un release congela el polling (watermark
   queda parada — si se re-reclama, el claim la resetea a now−10min: sin
   hueco infinito). Pero un mensaje ya encolado puede procesarse tras el
   release. Opciones: (1) escribir igual a `PET#<petId>` del mensaje (el dato
   era del periodo de asignación — histórico legítimo) actualizando o no la
   caché; (2) descartar con log. Enumerarlo en la spec; (1) sin actualizar
   `pets.last_position` si ya no hay asignación activa parece lo más honesto.

h) **Umbrales**: 60 km/h (`suspect_jump`), accuracy > 100 m o sats < 4
   (`low_accuracy`), batería < 20 (`battery.low`) — fijados por el plan.
   #10 ya asume que los umbrales viven en `pipeline/constants.ts`:
   centralizarlos ahí desde #8. Nota de coherencia: #12 cierra battery.low
   con batería ≥ 30 — histéresis 20/30 entre features, documentarla.
   Decisión abierta: ¿emitir `battery.low` en cada mensaje con batería < 20
   (simple; #12 dedupea con su índice anti-spam, pero hoy nadie dedupea) o
   solo en el cruce del umbral (requiere comparar con `devices.battery_pct`
   previo, que está disponible)? Enumerar pros/contras en la spec.

i) **Contrato de eventos**: `source: 'pet-tracker'`, `detailType:
   'position.updated'`, detail `{version: 1, petId, deviceId, position:
   <última aceptada>, batteryPct}` — un evento por mensaje SQS procesado (no
   por posición), según el plan. Congelarlo en la spec: lo consumen 006/007/
   010. Definir también el detail de `battery.low` (el plan no lo detalla:
   proponer `{version: 1, petId, deviceId, batteryPct}`).

j) **Testeo de la cadena e2e local**: el acceptance pide "claim ACT-001 +
   SIM_MODE=true → ~2 min → items en DynamoDB y last_position actualizado".
   Opciones: (1) e2e Jest contra Postgres+LocalStack invocando
   `poller.runOnce()` / `consumer.drainOnce()` directamente (determinista,
   sin esperas de reloj — requiere diseñar los workers como servicios
   invocables, que además es lo que facilita portarlos a Lambda); (2) esperar
   al cron real con timeouts largos (frágil); (3) verificación manual
   documentada en el reporte (patrón evidencia de #7) + unit tests. 
   Recomendación: (1) para CI + (3) como evidencia de los "~2 min" reales.
   Riesgo asociado: los e2e existentes (#5, #7) instancian `AppModule`
   completo — si el cron arranca solo, contaminará esos tests y CI sin
   LocalStack de DynamoDB activo. La spec debe exigir un flag de habilitación
   (p.ej. el poller solo se agenda si `SIM_MODE`/`POLLER_ENABLED` lo activa;
   default apagado en tests).

k) **Variables de entorno nuevas** (todas vía ConfigService, a
   `conventions.md` + `.env.example` en el mismo commit): `SIM_MODE`,
   `SIM_HOME_LAT`, `SIM_HOME_LNG`, probable `SIM_SEED`, `WIALON_TOKEN`
   (sustituye al SSM del plan; `PENDING`/vacío → fake), quizá
   `WIALON_BASE_URL` y el intervalo del poller si se hace configurable para
   tests. La spec fija la lista definitiva.

l) **Resiliencia del cron**: si LocalStack está caído, el poller/consumer no
   deben tumbar el proceso NestJS ni spamear stack traces cada minuto — log
   estructurado y reintento en el siguiente tick (hay precedente de mensajes
   de error amables en `describeProvisioningError`).

m) **Dependencias nuevas a declarar en la spec**: `@nestjs/schedule`,
   probable `@aws-sdk/lib-dynamodb`; PRNG propio para evitar una tercera.

n) **Forma del módulo NestJS**: `files_affected` no incluye un
   `<feature>.module.ts` explícito. Hará falta al menos un módulo (p.ej.
   `WorkersModule` o `IngestionModule`) registrado en `app.module.ts` que
   provea el factory de WialonClient, el poller y el consumer, y un puerto
   para las escrituras Postgres del pipeline (asignaciones activas +
   watermark + battery/last_position) — decidir si se extiende
   `DeviceRepository`/`PetRepository` o se crea un puerto propio del worker
   (más limpio: los repos actuales tienen contratos cerrados por specs
   previas).

## 6. Convenciones aplicables (docs/conventions.md)

- Kebab-case con sufijo por rol; en pipeline puro no hay controller/DTO pero
  los specs unitarios van junto al archivo (`*.spec.ts`) y nombran su R-id
  (`describe('R1: …')`).
- Imports con alias `@/…` para todo cruce de módulo/capa (regla endurecida
  2026-08-01); relativo solo intra-capa.
- Tokens de inyección: Symbol definido UNA vez junto a la interface.
- Errores de dominio tipados sin `@nestjs/common` (p.ej. error tipado de
  Wialon `{error: N}`); nunca un error crudo del SDK al borde.
- Validación con **zod** (aplicable al body del mensaje SQS en el consumidor).
- Branch `feature/8-wialon-ingestion-pipeline`; commits conventional en
  inglés con R-ids; PR con `gh pr create`; el humano mergea.
- Toda env var nueva: tabla de conventions + `.env.example` mismo commit;
  acceso solo vía ConfigService (excepción solo scripts standalone).

## Recomendación

- Enfoque sugerido (sin implementarlo): puerto `WialonClient` + Symbol en
  `src/integrations/wialon/` con provider `useFactory(ConfigService)` (molde
  TokenService/AwsModule); funciones puras y umbrales en `src/pipeline/`
  (`normalize`, `geo.ts` haversine, `constants.ts` — #10/#11 ya cuentan con
  ellos); `src/workers/` con poller `@Cron` de 1 min y consumer de SQS como
  servicios con `runOnce()` invocable, tras un flag de habilitación apagado
  por default en tests.
- La spec debe resolver explícitamente las decisiones (a) doc wialon-module,
  (b) semilla/PRNG, (c) DLQ directa vs redrive, (e) loop SQS propio vs
  librería, (h) battery.low continuo vs flanco, (j) estrategia e2e, y
  congelar el contrato de eventos (i) — es API pública inter-features.
- No hay migraciones pendientes: `pets.last_position`,
  `devices.ingest_watermark/battery_pct/connectivity/last_message_at` y toda
  la infra LocalStack ya existen. El grueso del riesgo es de diseño de
  workers (nuevo patrón en el repo), no de datos.
