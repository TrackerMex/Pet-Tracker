---
feature: "test-dev-resource-isolation"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[test-dev-resource-isolation]]

> Ver [[requirements]] y [[../../docs/architecture|architecture]].
>
> Capa: **infrastructure**. `src/aws/` es infraestructura compartida (análoga a
> `src/db/`), sin domain ni application propios. `domain` y `application` no se
> enteran de este cambio: siguen sin saber que existe AWS (C3).
>
> **Codex no ve la conversación que originó esta spec.** Las nueve decisiones de
> abajo son literales, no orientativas.

---

## Decisiones técnicas

### D1 — Sufijo (no prefijo), valor `'test'`, aplicado con el helper que ya existe

El discriminador es un **sufijo** `-test` compuesto con
`resourceName(base, suffix)` de `backend-pet-tracker/src/aws/constants.ts`
(L39-L40), la función que #20 ya introdujo y que
`infra/lib/pet-tracker-dev-stack.ts` ya usa en diez puntos.

Por qué sufijo y no prefijo:

1. **El helper ya compone sufijos** y nada más. Un prefijo obligaría a un
   segundo helper o a cambiar la firma del existente, que la stack CDK consume.
   Rung 2 de la escalera: reusar lo que hay.
2. La constante `BUCKET_MEDIA` **ya es un sufijo compuesto**
   (`resourceName(BUCKET_MEDIA_BASE, 'local')`), y la stack CDK compone
   `resourceName(BUCKET_MEDIA_BASE, 'dev-<accountId>')`. El repo ya decidió que
   el entorno va al final; ir al revés sería una tercera convención.
3. Con sufijo, los nombres ordenan alfabéticamente agrupados por recurso
   (`positions-raw`, `positions-raw-dlq`, `positions-raw-dlq-test`,
   `positions-raw-test`), que es como se leen en la consola de LocalStack.

Valor `'test'` y no `'e2e'` ni `'jest'`: es el valor de `NODE_ENV` que ya
discrimina, y repetirlo evita una tabla de traducción mental.

**Longitudes verificadas contra los límites de AWS** (ninguna queda cerca):

| Recurso | Nombre con sufijo | Longitud | Límite | Reglas |
|---|---|---|---|---|
| SQS | `geofence-events-dlq-test` | 24 | 80 | el más largo de las seis colas |
| SQS | `positions-raw-dlq-test` | 22 | 80 | |
| SQS | `notifications-dlq-test` | 22 | 80 | |
| DynamoDB | `positions-test` | 14 | 3-255 | |
| S3 | `pet-tracker-media-local-test` | **28** | **3-63** | el más apretado; solo `[a-z0-9-]`, empieza y acaba en alfanumérico, sin puntos ⇒ DNS-válido |
| EventBridge bus | `pet-tracker-test` | 16 | 256 | |
| EventBridge rule | `geofence-events-test` | 20 | 64 | |

El bucket es el que menos margen tiene y le sobran 35 caracteres. Ningún nombre
necesita abreviatura.

---

### D2 — Dónde se resuelve: archivo nuevo `src/aws/resource-names.ts`; `constants.ts` **no se toca**

`backend-pet-tracker/src/aws/constants.ts` queda **exactamente como está**
(R5). No lee `process.env`, no importa `@nestjs/config`, no gana funciones.
Dos razones duras, ambas verificadas:

1. **`infra/test/no-duplicated-literals.test.ts` (L66-L84) quedaría verde en
   vacío.** Interpola cada constante en `` `'${valor}'` `` y busca esa subcadena
   en el fuente de `infra/lib`. Si `QUEUE_POSITIONS_RAW` pasara a ser una
   función, la aguja sería el **código fuente de la función**
   (`Function.prototype.toString`), que ningún archivo contiene: el test dejaría
   de fallar nunca y de vigilar nada, sin avisar. Un guard que se rompe en
   silencio dentro de la feature cuyo tema es "los fallos silenciosos son caros"
   sería una ironía cara.
2. **`infra/lib/pet-tracker-dev-stack.ts` dejaría de compilar**: pasa las
   constantes como `string` en L38, L41, L49, L52, L60, L63, L71, L100, L104,
   y como `partitionKey.name` (L77), `sortKey.name` (L82),
   `timeToLiveAttribute` (L84).

`docs/conventions.md` §Variables de entorno prohíbe `process.env` fuera de la
configuración, así que la resolución **no puede** vivir en un módulo importado
por la stack CDK ni leer el entorno por su cuenta. Archivo nuevo:

**`backend-pet-tracker/src/aws/resource-names.ts`** — superficie exportada
exacta (nombres literales, Codex los copia tal cual):

```ts
export const RESOURCE_SUFFIX_TEST = 'test';

/** Sufijos que provision:local materializa siempre, en este orden (D6). */
export const PROVISIONED_SUFFIXES: readonly string[] = ['', RESOURCE_SUFFIX_TEST];

export interface AwsResourceNames {
  positionsRaw: string;
  positionsRawDlq: string;
  notifications: string;
  notificationsDlq: string;
  geofenceEvents: string;
  geofenceEventsDlq: string;
  geofenceEventsRule: string;
  positionsTable: string;
  mediaBucket: string;
  eventBus: string;
}

export function buildResourceNames(suffix: string): AwsResourceNames;
export function resolveResourceSuffix(
  rawMode: string | undefined,
  rawNodeEnv: string | undefined,
): string;
export function resolveResourceNamesFromEnv(
  env: NodeJS.ProcessEnv,
): AwsResourceNames;
export function resolveResourceNamesFromConfigService(
  config: ConfigService,
): AwsResourceNames;
```

- `buildResourceNames(suffix)` es **pura**: diez llamadas a
  `resourceName(CONST, suffix)`. Es la única función que importa los diez
  literales de `./constants` (lista blanca de D8).
- `resolveResourceSuffix(rawMode, rawNodeEnv)` es **pura y no lanza**:
  ```ts
  if (resolveAwsMode(rawMode) === 'aws') return '';
  return (rawNodeEnv ?? '').trim() === 'test' ? RESOURCE_SUFFIX_TEST : '';
  ```
- `resolveAwsMode` está hoy **sin exportar** en
  `backend-pet-tracker/src/aws/aws-clients.ts:62`. Se le añade `export` — una
  palabra, sin cambiar cuerpo ni firma. **No** se reutiliza
  `resolveAwsConfigFromEnv`, porque en modo local lanza
  `MissingAwsEndpointError` si falta `AWS_ENDPOINT_URL` (L82-L85 vía
  `assertEndpoint`) y resolver un **nombre** no debe depender de que haya
  endpoint ni tener ese efecto.
- Las dos vías de resolución replican el patrón de #19/#21 al pie de la letra:
  `…FromEnv(env)` lee `env.AWS_MODE` / `env.NODE_ENV` (script standalone y
  suites e2e, excepción documentada); `…FromConfigService(config)` lee
  `config.get<string>('AWS_MODE')` / `config.get<string>('NODE_ENV')` (runtime
  Nest). Ambas delegan en `resolveResourceSuffix` + `buildResourceNames`: una
  sola regla, dos puertas.

**Inyección.** Token nuevo en
`backend-pet-tracker/src/aws/aws.constants.ts`, junto a los cuatro existentes:

```ts
export const AWS_RESOURCE_NAMES = Symbol('AWS_RESOURCE_NAMES');
```

Proveído en `backend-pet-tracker/src/aws/aws.module.ts` con el mismo patrón que
los cuatro clientes (`useFactory` + `inject: [ConfigService]`) y añadido a
`exports`. `AwsModule` es `@Global()` (L25) y **no** es dinámico, así que el
token queda visible en todo el contenedor sin tocar ni un `imports:` de los
módulos consumidores. Los cinco servicios que hoy resuelven colas ya reciben
inyecciones por constructor (`poller.service.ts:29-33`,
`positions-consumer.service.ts:75-81`, `notifier-consumer.service.ts:47-53`,
`alerts-engine-consumer.service.ts:77-81`,
`reminders-dispatch.service.ts:18-21`): se les añade un parámetro
`@Inject(AWS_RESOURCE_NAMES) private readonly names: AwsResourceNames`.

Imports: desde `src/aws/**` se importa relativo (`./resource-names`); desde
cualquier otro punto de `src/**`, `test/**` o `scripts/**`, con el alias
`@/aws/resource-names` — lo exige `src/aws/relative-import-guard.spec.ts`
(patrón `/from\s+['"]\.\.\/.*aws/`, L11), que fallaría con `../aws/...`.

---

### D3 — Inventario cerrado: qué se aísla y qué no, recurso por recurso

| Recurso | Constante | ¿Aislado? | Razón |
|---|---|---|---|
| Cola `positions-raw` | `QUEUE_POSITIONS_RAW` | **Sí** | Es la cola que se envenenó el 2026-08-14. Vector primario. |
| DLQ `positions-raw-dlq` | `QUEUE_POSITIONS_RAW_DLQ` | **Sí** | `ingestion.e2e-spec.ts:120` la purga; sin aislar, la purga borra evidencia de fallos reales de desarrollo. |
| Cola `notifications` | `QUEUE_NOTIFICATIONS` | **Sí** | `pet-reminders.e2e-spec.ts` la purga cuatro veces (L99, L267, L313, L393, L417). |
| DLQ `notifications-dlq` | `QUEUE_NOTIFICATIONS_DLQ` | **Sí** | Misma razón que su cola. |
| Cola `geofence-events` | `QUEUE_GEOFENCE_EVENTS` | **Sí** | Destino de la regla EventBridge; `alerts-engine.e2e-spec.ts:163` la purga. |
| DLQ `geofence-events-dlq` | `QUEUE_GEOFENCE_EVENTS_DLQ` | **Sí** | Misma razón. |
| Tabla `positions` | `TABLE_POSITIONS` | **Sí** | Los e2e escriben ítems con `petId` reales (`activity.e2e-spec.ts`, `positions.e2e-spec.ts`, `ingestion.e2e-spec.ts`); el criterio de aceptación 2 incluye "sin ítems nuevos" (R10). |
| Bucket `pet-tracker-media-local` | `BUCKET_MEDIA` | **Sí** | `media.e2e-spec.ts` sube objetos; sin aislar quedan mezclados con las fotos de desarrollo y nadie los limpia. |
| Bus `pet-tracker` | `EVENT_BUS_NAME` | **Sí** | Ver D4 — es la decisión no obvia. |
| Regla `geofence-events` | `RULE_GEOFENCE_EVENTS` | **Sí** | Uniformidad, no necesidad: con buses separados el nombre podría repetirse sin colisión (namespaces distintos). Se sufija igual para que la regla sea **una sola** ("todo nombre de recurso lleva el sufijo") y no haya que recordar una excepción; además `PutTargetsCommand` pasa `Rule` y `EventBusName` juntos (`provisioning.ts:307-313`) y verlos con el mismo sufijo hace evidente un desajuste. |
| `TABLE_POSITIONS_PARTITION_KEY` / `_SORT_KEY` / `_TTL_ATTRIBUTE` | — | **No** | Nombres de **atributo dentro** de la tabla, no de recurso. Sufijarlos rompería el schema de los ítems y los readers (`daily-positions.dynamo.reader.ts`, `position-history.dynamo.reader.ts`, `position-response.mapper.ts`). |
| `EVENT_SOURCE`, `DETAIL_TYPE_POSITION_UPDATED`, `DETAIL_TYPE_BATTERY_LOW` | — | **No** | Contrato de eventos congelado desde #8 R16/R17. Sufijarlos cambiaría el `EventPattern` y el despacho por `detail-type` del worker. |
| `SQS_MAX_RECEIVE_COUNT` | — | **No** | Es un número. |
| `BUCKET_MEDIA_BASE` | — | **No** | Es la base de composición, no un nombre final; la stack CDK la consume para `pet-tracker-media-dev-<accountId>`. |
| PostgreSQL | — | **No** | Fuera de alcance con razón y riesgo residual declarado en [[requirements]] §Fuera de alcance. |

**Diez nombres aislados. Ni uno más, ni uno menos.**

---

### D4 — El bus EventBridge **se aísla**; compartirlo con dos reglas no funciona

Es la decisión que parecía opcional y no lo es. Si el bus fuese compartido y
hubiera dos reglas —una apuntando a `geofence-events`, otra a
`geofence-events-test`— **ambas tienen el mismo `EventPattern`**
(`source: ['pet-tracker']`, `detail-type: ['position.updated', 'battery.low']`,
`provisioning.ts:296-305`). EventBridge entrega el evento a **todas** las reglas
que casan, no a una: cada evento de desarrollo se copiaría a la cola de test
**y** cada evento de test a la de desarrollo. El aislamiento no quedaría a
medias — quedaría **invertido**, duplicando exactamente el daño que la feature
existe para impedir.

La alternativa de discriminar dentro del `EventPattern` (añadir un campo al
`detail` y filtrar por él) exige tocar el contrato de eventos congelado en #8
R16/R17 y modificar el sobre que publica `positions-consumer.service.ts`. Se
descarta: más caro y más invasivo que un bus separado, que es gratis en
LocalStack.

Por tanto: bus `pet-tracker-test` propio, con su regla `geofence-events-test`
apuntando a la cola `geofence-events-test`. Los dos triángulos
(bus → regla → cola) quedan completos y disjuntos.

---

### D5 — Con `AWS_MODE=aws` el sufijo es `''` y **no se aborta** (al revés que #21)

`resolveResourceSuffix` comprueba el modo **primero** y devuelve `''` sin mirar
`NODE_ENV`. No hay `TestSuffixInAwsModeError` ni nada equivalente.

Va contra el precedente de #21 —que aborta con `UnexpectedAwsEndpointError`— y
la razón está verificada en el repo: `NODE_ENV=test` + `AWS_MODE=aws` es la
combinación **normal**, no una anomalía. `test/aws-real-smoke.e2e-spec.ts:10` y
`test/aws-real-ingest.e2e-spec.ts:37-38` exigen `AWS_MODE=aws` para no
auto-saltarse, y corren bajo Jest, que fija `NODE_ENV=test` implícitamente
(§Contexto de [[requirements]]). Una guarda que abortase haría **imposible**
verificar AWS real — rompería la única prueba que #20 y #21 dejaron al humano.

El beneficio de esta forma: `test/aws-real-ingest.e2e-spec.ts` pasa a resolver
sus nombres con `resolveResourceNamesFromEnv(process.env)` y **no necesita
ningún caso especial** — obtiene los nombres desnudos porque el modo manda. La
corrección sale de la estructura, no de un `if` en el test.

La red de seguridad económica no se pierde, y no es nueva: `runProvisioning`
aborta con exit 1 si el modo es `aws` (`src/aws/run-provisioning.ts:39-42`,
R8), así que **ningún juego sufijado puede materializarse en la cuenta real**; y
la stack CDK conserva `ENV_SUFFIX = ''` literal y no importa nada de
`resource-names.ts` (R12), así que `cdk deploy` no puede crear un duplicado.
Tres cierres independientes sobre el mismo riesgo.

---

### D6 — `provision:local` crea **siempre** los dos juegos, sin flags

`runProvisioning` recorre `PROVISIONED_SUFFIXES` (`['', 'test']`):

```ts
for (const suffix of PROVISIONED_SUFFIXES) {
  await provisionAllResources(clients, buildResourceNames(suffix));
}
```

y las seis funciones de `src/aws/provisioning.ts` pasan a recibir los nombres
como parámetro en vez de leer los literales del módulo:

| Firma hoy | Firma nueva |
|---|---|
| `provisionQueues(client: SQSClient)` L128 | `provisionQueues(client: SQSClient, names: AwsResourceNames)` |
| `provisionPositionsTable(client: DynamoDBClient)` L178 | `provisionPositionsTable(client: DynamoDBClient, names: AwsResourceNames)` |
| `provisionMediaBucket(client: S3Client)` L235 | `provisionMediaBucket(client: S3Client, names: AwsResourceNames)` |
| `provisionEventBus(client: EventBridgeClient)` L261 | `provisionEventBus(client: EventBridgeClient, names: AwsResourceNames)` |
| `provisionGeofenceEventsRoute(clients: {...})` L285 | `provisionGeofenceEventsRoute(clients: {...}, names: AwsResourceNames)` |
| `provisionAllResources(clients: AwsClientBundle)` L331 | `provisionAllResources(clients: AwsClientBundle, names: AwsResourceNames)` |

`TABLE_POSITIONS_PARTITION_KEY`, `TABLE_POSITIONS_SORT_KEY`,
`TABLE_POSITIONS_TTL_ATTRIBUTE`, `SQS_MAX_RECEIVE_COUNT`, `EVENT_SOURCE` y los
dos `DETAIL_TYPE_*` **se siguen importando de `./constants`** en
`provisioning.ts`: no son nombres de recurso (D3).

**Siempre los dos, y no bajo demanda**, por tres razones:

1. **No hay de dónde sacar la condición.** El script corre por `ts-node` sin
   `NODE_ENV=test` (`package.json:22`), así que derivarla del entorno daría
   siempre el juego de desarrollo. Habría que inventar un flag.
2. **Un flag es una forma nueva de reproducir el bug.** Quien olvide
   `--with-test` corre los e2e contra recursos inexistentes, o —peor— alguien
   "arregla" el fallo devolviendo los tests a las colas de desarrollo. La
   configuración que se puede olvidar acaba olvidándose.
3. **El coste es despreciable.** Son ~20 llamadas idempotentes contra
   LocalStack en el mismo proceso, con los clientes ya construidos. El coste que
   sí importa —rehacer `provision:local` cada vez que LocalStack reinicia y
   pierde los recursos— pasa de un comando a el mismo comando.

La idempotencia (R7) no cambia de mecanismo: sigue siendo *catch-then-recover*
(`QueueNameExists` L70, `ResourceInUseException` L197,
`BucketAlreadyOwnedByYou` L239, `ResourceAlreadyExistsException` L267,
`PutRule`/`PutTargets` como upserts). Al ser el bucle una repetición de la misma
llamada con otros nombres, la segunda pasada del segundo juego se recupera por
las mismas ramas que ya existen — **no hace falta añadir ni un `catch` nuevo**.

---

### D7 — Cómo interactúa con los gates `NODE_ENV=test` de los workers

Los cinco schedulers gatean así (todos con la misma forma, todos vía
`ConfigService`, cero `process.env.NODE_ENV` en `src/`):

| Servicio | file:line del gate | Condición |
|---|---|---|
| `IngestionSchedulerService.shouldSchedule()` | `src/workers/ingestion-scheduler.service.ts:55-56` | `POLLER_ENABLED === 'true' && NODE_ENV !== 'test'` |
| `NotifierSchedulerService.shouldSchedule()` | `src/workers/notifier/notifier-scheduler.service.ts:49-50` | `NOTIFIER_ENABLED === 'true' && NODE_ENV !== 'test'` |
| `AlertsEngineSchedulerService.shouldSchedule()` | `src/workers/alerts-engine/alerts-engine-scheduler.service.ts:49-50` | `ALERTS_ENGINE_ENABLED === 'true' && NODE_ENV !== 'test'` |
| `ActivitySchedulerService.shouldSchedule()` | `src/modules/activity/infrastructure/activity-scheduler.service.ts:57-58` | `ACTIVITY_AGGREGATOR_ENABLED === 'true' && NODE_ENV !== 'test'` |
| `RemindersSchedulerService.shouldSchedule()` | `src/modules/reminders/infrastructure/reminders-scheduler.service.ts:37-38` | `REMINDERS_ENABLED === 'true' && NODE_ENV !== 'test'` |

**Los gates no hacen innecesario el aislamiento, y el aislamiento no hace
innecesarios los gates.** Son ortogonales:

- El gate solo suprime el `SchedulerRegistry.addInterval` en
  `onApplicationBootstrap` (`ingestion-scheduler.service.ts:33-50`). **Los
  workers se instancian siempre**: `IngestionModule`, `AlertsEngineModule` y
  `NotifierModule` se registran incondicionalmente en `app.module.ts` (L43-L45)
  y sus providers no son condicionales
  (`ingestion.module.ts:39-41`, `notifier.module.ts:34-35`,
  `alerts-engine.module.ts:19-20`).
- Los e2e **sacan esos mismos workers del contenedor y los invocan a mano**:
  `ingestion.e2e-spec.ts:113-114` obtiene `PollerService` y
  `PositionsConsumerService` y ejecuta sus `runOnce()`/`drainOnce()`. El gate
  apaga el reloj, no el acceso a la cola. **Sin aislamiento, esas llamadas
  manuales siguen golpeando la cola de desarrollo — que es exactamente lo que
  pasó.**
- Ninguno de los cinco gates se modifica en esta feature. `NODE_ENV` pasa a
  tener **dos** lectores con propósitos distintos: "no agendes cron" (los
  gates, ya existente) y "usa los recursos de test" (`resolveResourceSuffix`,
  nuevo). Es el mismo discriminador para dos decisiones coherentes entre sí.

Nota sobre el incidente: los procesos jest **huérfanos** del 2026-08-14
(`progress/history.md` L1142-L1148) levantaban `AppModule` fuera del ciclo de
vida de una suite y poleaban en bucle. Con el aislamiento, un huérfano así
envenena `positions-raw-test`, que es desechable. La feature no impide el
huérfano (§Fuera de alcance): le quita el daño.

---

### D8 — Lista blanca de la guarda anti-regresión (R11)

El test de R11 recorre los `.ts` de `backend-pet-tracker/src/` y
`backend-pet-tracker/test/` y falla si alguno importa uno de estos diez
símbolos desde `@/aws/constants`, `./constants` o `../src/aws/constants`:

`QUEUE_POSITIONS_RAW`, `QUEUE_POSITIONS_RAW_DLQ`, `QUEUE_NOTIFICATIONS`,
`QUEUE_NOTIFICATIONS_DLQ`, `QUEUE_GEOFENCE_EVENTS`, `QUEUE_GEOFENCE_EVENTS_DLQ`,
`RULE_GEOFENCE_EVENTS`, `TABLE_POSITIONS`, `BUCKET_MEDIA`, `EVENT_BUS_NAME`.

**Lista blanca — exactamente estos archivos pueden importarlos:**

- `backend-pet-tracker/src/aws/resource-names.ts` (los compone)
- `backend-pet-tracker/src/aws/constants.spec.ts` (test propio de #20)
- `backend-pet-tracker/src/aws/resource-names.spec.ts` (test propio de R1/R2/R3)

**Fuera del alcance del escaneo** (no se recorren): `infra/**` —la stack CDK
debe seguir importándolos (R12)— y el propio archivo del test.

`BUCKET_MEDIA_BASE`, `EVENT_SOURCE`, `DETAIL_TYPE_*`, `TABLE_POSITIONS_*_KEY`,
`TABLE_POSITIONS_TTL_ATTRIBUTE` y `SQS_MAX_RECEIVE_COUNT` **no** están
prohibidos: `provisioning.ts` y los workers los siguen importando con toda
legitimidad (D3).

Ubicación del test: `backend-pet-tracker/src/aws/resource-names-guard.spec.ts`,
mismo patrón de escaneo que `src/aws/relative-import-guard.spec.ts` (que ya
recorre `src/**` y `scripts/**` con `readdirSync` recursivo).

---

### D9 — El recuento de colas: mitad automatizada (R10), mitad humana (R13)

El criterio de aceptación 2 —"una corrida completa de e2e deja las colas de
desarrollo con exactamente el mismo número de mensajes que antes de empezar"—
es el más difícil de los cinco porque **ninguna suite puede medir una corrida
completa desde dentro de esa misma corrida**. Se parte en dos:

**(a) Automatizado — `backend-pet-tracker/test/resource-isolation.e2e-spec.ts`
(nuevo).** Mide el camino que de verdad se envenenó, no toda la suite:

1. `beforeAll`: construye clientes con `resolveAwsConfigFromEnv(process.env)`
   (patrón de `localstack-provisioning.e2e-spec.ts:65-74`, sin pasar por Nest),
   resuelve los nombres de desarrollo con `buildResourceNames('')` y los de test
   con `buildResourceNames(RESOURCE_SUFFIX_TEST)`.
2. Captura el recuento base de las tres colas de **desarrollo** con
   `GetQueueAttributesCommand` pidiendo los tres atributos y sumándolos:
   `ApproximateNumberOfMessages` + `ApproximateNumberOfMessagesNotVisible` +
   `ApproximateNumberOfMessagesDelayed`. Se suman los tres y no solo el primero
   porque un mensaje en vuelo o diferido no aparece en
   `ApproximateNumberOfMessages` y colaría sin detectarse.
3. Ejerce la cadena de ingesta con `AppModule` levantado y `SIM_MODE='true'`
   (patrón de `ingestion.e2e-spec.ts:97-121`): `PollerService.runOnce()` →
   `PositionsConsumerService.drainOnce()`.
4. Asserts: (i) los tres recuentos de desarrollo son **idénticos** a los base;
   (ii) la cola de test `positions-raw-test` **sí** se movió (si no, el test
   pasaría en vacío por no haber ejercido nada — el mismo modo de fallo que D2
   describe para `no-duplicated-literals`); (iii)
   `GetQueueUrlCommand` sobre `positions-raw` y sobre `positions-raw-test`
   devuelve `QueueUrl` distintas (R9); (iv) `DescribeTableCommand` sobre
   `positions` y `positions-test` devuelve dos tablas distintas y el `ItemCount`
   de la de desarrollo no crece.

   > La igualdad puede ser **exacta**: LocalStack actualiza estos contadores de
   > forma inmediata, no eventual como SQS real. Si aun así resultara inestable,
   > la reacción correcta es un reintento con espera corta, **nunca** relajar la
   > aserción a "aproximadamente igual" — eso devolvería el fallo silencioso.

**(b) Humano — `docs/verification.md` §`### Feature 28 —
test-dev-resource-isolation` (R13).** Cierra la corrida completa. Texto y
comandos literales que Codex escribe en el doc:

```bash
# 1. Infra levantada y recursos de ambos entornos creados
docker compose up -d
pnpm -C backend-pet-tracker run provision:local

# 2. Recuento ANTES, de las tres colas de desarrollo
for q in positions-raw notifications geofence-events; do
  aws --endpoint-url http://localhost:4566 sqs get-queue-attributes \
    --queue-url "$(aws --endpoint-url http://localhost:4566 sqs get-queue-url \
      --queue-name "$q" --query QueueUrl --output text)" \
    --attribute-names ApproximateNumberOfMessages \
      ApproximateNumberOfMessagesNotVisible ApproximateNumberOfMessagesDelayed
done

# 3. Corrida e2e COMPLETA
pnpm -C backend-pet-tracker run test:e2e

# 4. Recuento DESPUÉS: repetir el paso 2
# Esperado: los tres recuentos idénticos a los del paso 2.
```

Se marca como **verificación humana** porque exige LocalStack levantado, una
corrida e2e completa medida desde fuera y credenciales dummy de LocalStack
(`AWS_ACCESS_KEY_ID=test`, `AWS_SECRET_ACCESS_KEY=test`, ya en el `.env`
raíz). El resultado se registra en
`progress/impl_test-dev-resource-isolation.md` (R14c).

---

## Archivos afectados

Todos en la capa **infrastructure**; `domain` y `application` no se tocan.

### Nuevos

- `backend-pet-tracker/src/aws/resource-names.ts` — resolución de sufijo y
  composición de los diez nombres (D2).
- `backend-pet-tracker/src/aws/resource-names.spec.ts` — R1, R2, R3.
- `backend-pet-tracker/src/aws/resource-names-guard.spec.ts` — R11.
- `backend-pet-tracker/test/resource-isolation.e2e-spec.ts` — R9, R10.

### Modificados — infraestructura AWS

- `backend-pet-tracker/src/aws/aws-clients.ts` — `export` a `resolveAwsMode`
  (L62). **Una palabra**; ni el cuerpo ni la firma cambian.
- `backend-pet-tracker/src/aws/aws.constants.ts` — token `AWS_RESOURCE_NAMES`.
- `backend-pet-tracker/src/aws/aws.module.ts` — provider + `exports`.
- `backend-pet-tracker/src/aws/provisioning.ts` — seis firmas con `names`
  (D6); deja de importar los diez literales, conserva los de atributo/contrato.
- `backend-pet-tracker/src/aws/run-provisioning.ts` — bucle sobre
  `PROVISIONED_SUFFIXES` (D6). La guarda de modo `aws` (L39-L42) **intacta**.
- `backend-pet-tracker/src/aws/constants.ts` — **NO SE TOCA** (R5).

### Modificados — consumidores de producción (inyectan `AWS_RESOURCE_NAMES`)

- `src/workers/poller.service.ts` (import L8, uso en `resolveQueueUrl` L151-157)
- `src/workers/positions-consumer.service.ts` (import L22-32; `QUEUE_POSITIONS_RAW`
  L354, `TABLE_POSITIONS`, `EVENT_BUS_NAME`)
- `src/workers/notifier/notifier-consumer.service.ts` (import L10; L242-248)
- `src/workers/alerts-engine/alerts-engine-consumer.service.ts` (import L10-15;
  `resolveQueueUrl(queueName)` L430, llamado en L86 y L412)
- `src/modules/reminders/infrastructure/reminders-dispatch.service.ts` (import L8; L66-70)
- `src/modules/media/infrastructure/photo-storage.s3.adapter.ts` (import L9, `BUCKET_MEDIA`)
- `src/modules/activity/infrastructure/repositories/daily-positions.dynamo.reader.ts` (L4-8, `TABLE_POSITIONS`)
- `src/modules/positions/infrastructure/repositories/position-history.dynamo.reader.ts` (L4-8, `TABLE_POSITIONS`)

`src/modules/positions/infrastructure/mappers/position-response.mapper.ts` (L1)
importa solo `TABLE_POSITIONS_SORT_KEY` — **no se toca** (D3).

### Modificados — specs unitarios colocados

`src/aws/provisioning.sqs.spec.ts` (L8), `src/aws/provisioning.geofence-events.spec.ts`
(L13), `src/workers/poller.service.spec.ts` (L7),
`src/workers/positions-consumer.service.spec.ts` (L23),
`src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts` (L15),
`src/workers/notifier/notifier-consumer.service.spec.ts` (L9),
`src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts` (L7),
`src/modules/activity/.../daily-positions.dynamo.reader.spec.ts` (L8),
`src/modules/positions/.../position-history.dynamo.reader.spec.ts` (L9) — pasan
a construir sus nombres con `buildResourceNames('')` y a inyectarlos en el
sujeto bajo test. **Las aserciones de comportamiento no se debilitan**: solo
cambia de dónde sale el string esperado.

### Modificados — suites e2e

`test/ingestion.e2e-spec.ts` (L17-21), `test/alerts-engine.e2e-spec.ts` (L16-19),
`test/alerts-center-notifier.e2e-spec.ts` (L16-20), `test/media.e2e-spec.ts` (L15),
`test/pet-reminders.e2e-spec.ts` (L14), `test/activity.e2e-spec.ts` (L10-14),
`test/positions.e2e-spec.ts` (L10-14) — sustituyen el import de los literales por
`const names = resolveResourceNamesFromEnv(process.env);` a nivel de módulo.

`test/localstack-provisioning.e2e-spec.ts` (L29-38) — **caso especial**: debe
verificar **los dos** juegos, así que usa `buildResourceNames('')` y
`buildResourceNames(RESOURCE_SUFFIX_TEST)` explícitamente, no la vía de entorno.

`test/aws-real-ingest.e2e-spec.ts` (L24-34) — usa
`resolveResourceNamesFromEnv(process.env)` y, por D5, obtiene los nombres
desnudos sin ningún caso especial. `test/aws-real-smoke.e2e-spec.ts` no importa
nombres: **no se toca**.

### Modificado — guarda heredada de #20 (cambio de una línea, autorizado aquí)

`backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts` L19 asserta hoy, sobre
el **texto** de `test/media.e2e-spec.ts`:

```ts
expect(mediaE2e).toContain('expect.stringContaining(BUCKET_MEDIA)');
```

Al pasar `media.e2e-spec.ts` a nombres resueltos, esa aserción rompería. Cambia
a:

```ts
expect(mediaE2e).toContain('expect.stringContaining(names.mediaBucket)');
```

y el `describe` de L10 pasa a `'R3: media e2e resuelve el bucket sin literal
local'`. **L18 (`expect(mediaE2e).not.toContain("'pet-tracker-media-local'")`)
no se toca**: es la intención real de #20 R3 —que el literal no reaparezca— y se
conserva íntegra. Ninguna otra línea del archivo cambia.

### Modificados — documentación

- `docs/verification.md` — sección de la Feature 28 (R13, D9).
- `docs/conventions.md` §Variables de entorno — `NODE_ENV` gana un consumidor
  nuevo. Nota: `NODE_ENV` **no está** en la tabla hoy (la tabla la menciona
  dentro de las filas de los cinco `*_ENABLED`); esta feature **no** añade fila
  nueva a la tabla, solo se apoya en el comportamiento existente. No se toca
  `.env.example`: **no se introduce ninguna variable de entorno nueva**.

### No se tocan (verificable con `git diff --name-only`)

`backend-pet-tracker/src/aws/constants.ts`, todo `infra/`, `init.sh`,
`init.config.sh`, `.env.example`, `backend-pet-tracker/package.json`,
`backend-pet-tracker/test/jest-e2e.json`, los cinco `*-scheduler.service.ts`.

---

## Alternativas descartadas

- **Constantes convertidas en funciones `(suffix) => string` en `constants.ts`.**
  Descartada por D2: deja `infra/test/no-duplicated-literals.test.ts` verde en
  vacío y rompe la compilación de la stack. Era la opción "obvia" y es la
  peligrosa.
- **`constants.ts` leyendo `process.env.NODE_ENV` directamente.** Viola
  `docs/conventions.md` §Variables de entorno, y `constants.ts` lo importa la
  stack CDK: `cdk synth` pasaría a depender del entorno del que sintetiza.
- **Prefijo (`test-positions-raw`) en vez de sufijo.** D1: exigiría un helper
  nuevo y contradiría la composición que #20 ya dejó establecida.
- **Guarda que aborta con `AWS_MODE=aws` + `NODE_ENV=test`** (simetría con
  #21). D5: haría imposible correr `aws-real-smoke` y `aws-real-ingest`, que son
  precisamente las suites que verifican AWS real.
- **Bus EventBridge compartido con dos reglas.** D4: EventBridge entrega a
  todas las reglas que casan, así que duplicaría los eventos en ambos sentidos.
- **Discriminar por un campo nuevo en el `detail` del evento.** D4: toca el
  contrato congelado de #8 R16/R17.
- **`provision:local --with-test` (bajo demanda).** D6: un flag que se puede
  olvidar es una forma nueva de reproducir el bug.
- **Sufijo por corrida/PID (`positions-raw-<pid>`) para aislar también las
  suites entre sí.** `test/jest-e2e.json` fija `maxWorkers: 1`, así que las
  suites no compiten; exigiría provisioning dinámico y dejaría recursos
  huérfanos que nadie limpia.
- **Extraer las cinco copias de `resolveQueueUrl` a un resolvedor común**
  (invitación explícita del marcador `ponytail:` en
  `src/workers/notifier/notifier-consumer.service.ts:240-241`). Tentador,
  porque el sufijo se aplicaría en un solo punto, pero es un refactor de otra
  feature: mezclarlo aquí ensancharía el diff y el reviewer no podría separar el
  aislamiento de la deduplicación. Cada worker conserva su copia; **solo cambia
  el nombre que le pasa**. El marcador `ponytail:` se deja donde está.
- **Aislar también PostgreSQL.** [[requirements]] §Fuera de alcance, con el
  riesgo residual declarado.
