---
feature: "test-dev-resource-isolation"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[test-dev-resource-isolation]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] y [[../../docs/architecture|architecture]].
>
> Fuente: `feature_list.json` #28 (5 criterios de aceptación) + el incidente
> registrado en `progress/history.md` L1139-L1155 (sesión 2026-08-14, smoke con
> hardware real) + los checkpoints C2-C7 de [[../../CHECKPOINTS|CHECKPOINTS]].
>
> **Esta spec la implementa un agente sin acceso a la conversación que la
> originó.** Todo lo decidible está decidido aquí y en [[design]]. Rutas,
> nombres de símbolos y valores son literales, no ejemplos. Si algo parece
> ambiguo, la respuesta está en [[design]]; si no está ahí, **para y pregunta**
> en vez de improvisar.

---

## Por qué existe esta feature (defecto, no mejora)

Los e2e y el entorno de desarrollo comparten **los mismos** recursos de
LocalStack. Los nombres salen de `backend-pet-tracker/src/aws/constants.ts` como
literales fijos, sin distinción de entorno, y tanto el runtime de la app como
las suites e2e los resuelven por nombre con `GetQueueUrlCommand`.

Daño observado en la sesión del 2026-08-14 (`progress/history.md` L1139-L1148),
probando un collar físico JT808 en la unidad Wialon `401775970`:

1. **Datos falsos que parecen legítimos.** Mensajes generados por el
   `FakeWialonClient` de los tests aparecieron en `positions-raw` a nombre del
   device **real** — `deviceId` y `petId` reales, coordenadas del simulador,
   `ts` en el futuro. El diagnóstico fue caro precisamente porque nada en el
   mensaje delata su origen.
2. **Backlog cruzado.** Los miles de mensajes acumulados por los tests dejaban a
   las suites siguientes drenando cola ajena hasta morir por timeout. Resistió
   purgas, liberar el device y reiniciar LocalStack; solo cayó al matar los PID
   de jest huérfanos.

`#27 reject-future-positions` cerró la mitad del incidente (el watermark
envenenado por un `ts` futuro). Esta feature cierra la otra mitad: mientras los
dos entornos compartan cola, cualquiera de los dos puede envenenar al otro.

**El agravante es que hoy la única defensa de los e2e es `PurgeQueueCommand`**
(`test/ingestion.e2e-spec.ts:119-121`, `test/alerts-engine.e2e-spec.ts:163-164`,
`test/alerts-center-notifier.e2e-spec.ts:192-193`,
`test/pet-reminders.e2e-spec.ts:99`): la suite **borra la cola de desarrollo**
para poder medir su propia corrida. La defensa de un entorno es la agresión al
otro.

---

## Contexto mínimo (estado actual, verificado 2026-08-17)

### Los nombres, hoy

`backend-pet-tracker/src/aws/constants.ts` (55 líneas) exporta los nombres como
literales `const`, y desde #20 exporta además el helper de composición:

| Símbolo | Línea | Valor hoy |
|---|---|---|
| `QUEUE_POSITIONS_RAW` | L9 | `'positions-raw'` |
| `QUEUE_POSITIONS_RAW_DLQ` | L10 | `'positions-raw-dlq'` |
| `QUEUE_NOTIFICATIONS` | L11 | `'notifications'` |
| `QUEUE_NOTIFICATIONS_DLQ` | L12 | `'notifications-dlq'` |
| `QUEUE_GEOFENCE_EVENTS` | L16 | `'geofence-events'` |
| `QUEUE_GEOFENCE_EVENTS_DLQ` | L17 | `'geofence-events-dlq'` |
| `RULE_GEOFENCE_EVENTS` | L21 | `'geofence-events'` |
| `TABLE_POSITIONS` | L29 | `'positions'` |
| `BUCKET_MEDIA_BASE` | L36 | `'pet-tracker-media'` |
| `resourceName(base, suffix)` | L39-L40 | `suffix === '' ? base : `${base}-${suffix}`` |
| `BUCKET_MEDIA` | L42 | `resourceName(BUCKET_MEDIA_BASE, 'local')` ⇒ `'pet-tracker-media-local'` |
| `EVENT_BUS_NAME` | L45 | `'pet-tracker'` |

No hay ni un solo punto en el que un nombre dependa del entorno.

### El mecanismo de sufijo ya existe y está probado

`infra/lib/pet-tracker-dev-stack.ts` (#20) **ya** compone todos sus nombres con
el helper y un sufijo constante:

```ts
const ENV_NAME = 'dev';        // L30
const ENV_SUFFIX = '';         // L31
…
queueName: resourceName(QUEUE_POSITIONS_RAW_DLQ, ENV_SUFFIX),   // L38
```

Esta feature **no inventa un mecanismo**: aplica al runtime local el mismo que
la stack CDK ya usa, con el sufijo resuelto en vez de constante.

### `NODE_ENV` nunca se fija explícitamente

No hay `NODE_ENV=` en ningún script de `backend-pet-tracker/package.json`
(L16-L27), ni `cross-env` en dependencias, ni `globalSetup`/`setupFiles` en
`backend-pet-tracker/test/jest-e2e.json` (13 líneas, sin ninguna de esas
claves), ni `NODE_ENV` en `init.sh`/`init.config.sh`. El valor `'test'` lo pone
**Jest implícitamente**. Consecuencias que esta spec da por ciertas:

- `pnpm test` (unitarios) y `pnpm run test:e2e` corren con `NODE_ENV=test`.
- `pnpm run provision:local` (`package.json:22`,
  `ts-node -r tsconfig-paths/register scripts/provision-local.ts`) corre **sin**
  `NODE_ENV=test`. Por eso el provisioning **no puede** derivar qué crear de
  `NODE_ENV` (R6).
- `test/aws-real-smoke.e2e-spec.ts:10` y `test/aws-real-ingest.e2e-spec.ts:37-38`
  corren bajo Jest (`NODE_ENV=test`) **y** con `AWS_MODE=aws`. La combinación
  `NODE_ENV=test` + `AWS_MODE=aws` es **legítima y frecuente**, no un error: es
  la única forma de verificar AWS real. Esto decide R3 (ver [[design]] §D5).

### Los gates de los workers no sustituyen al aislamiento

Los cinco schedulers (`POLLER_ENABLED`, `ACTIVITY_AGGREGATOR_ENABLED`,
`ALERTS_ENGINE_ENABLED`, `NOTIFIER_ENABLED`, `REMINDERS_ENABLED`, tabla de
`docs/conventions.md` L230-L234) no **agendan** su cron con `NODE_ENV=test`,
pero los e2e **instancian los mismos workers y los invocan a mano**
(`test/ingestion.e2e-spec.ts:113-114` obtiene `PollerService` y
`PositionsConsumerService` del contenedor Nest y los ejecuta). El gate apaga el
reloj, no el acceso a la cola: los recursos aislados hacen falta igual.

### Provisioning, hoy

`backend-pet-tracker/src/aws/provisioning.ts` (384 líneas) crea 6 colas + tabla
+ bucket + bus + regla; ningún `provision*` acepta parámetro de nombre — todos
leen los literales del módulo. `runProvisioning(env, logger)`
(`src/aws/run-provisioning.ts:27-30`) ya **aborta con exit 1** si
`config.mode === 'aws'` (L39-L42). La idempotencia es *catch-then-recover*
(`QueueNameExists` L70, `ResourceInUseException` L197,
`BucketAlreadyOwnedByYou` L239, `ResourceAlreadyExistsException` L267), sin
ningún pre-check; `PutRule`/`PutTargets` son upserts nativos.

---

## Requisitos funcionales

### Bloque A — resolución de nombres

- **R1**: WHEN se resuelven los nombres de recurso AWS, THE SYSTEM SHALL
  derivarlos de un **sufijo de entorno** aplicado con el helper ya existente
  `resourceName(base, suffix)` de `backend-pet-tracker/src/aws/constants.ts`
  (L39-L40), de forma que con sufijo `'test'` los diez nombres aislados valgan
  **exactamente**:

  | Nombre lógico | Desarrollo (sufijo `''`) | Test (sufijo `'test'`) |
  |---|---|---|
  | cola posiciones | `positions-raw` | `positions-raw-test` |
  | DLQ posiciones | `positions-raw-dlq` | `positions-raw-dlq-test` |
  | cola notificaciones | `notifications` | `notifications-test` |
  | DLQ notificaciones | `notifications-dlq` | `notifications-dlq-test` |
  | cola geofence | `geofence-events` | `geofence-events-test` |
  | DLQ geofence | `geofence-events-dlq` | `geofence-events-dlq-test` |
  | tabla DynamoDB | `positions` | `positions-test` |
  | bucket S3 | `pet-tracker-media-local` | `pet-tracker-media-local-test` |
  | bus EventBridge | `pet-tracker` | `pet-tracker-test` |
  | regla EventBridge | `geofence-events` | `geofence-events-test` |

  El conjunto aislado es **exactamente** esos diez y ninguno más: la lista
  cerrada, con el sí/no razonado recurso por recurso, está en [[design]] §D3.
  `EVENT_SOURCE`, `DETAIL_TYPE_POSITION_UPDATED`, `DETAIL_TYPE_BATTERY_LOW`,
  `TABLE_POSITIONS_PARTITION_KEY`, `TABLE_POSITIONS_SORT_KEY`,
  `TABLE_POSITIONS_TTL_ATTRIBUTE` y `SQS_MAX_RECEIVE_COUNT` **SHALL NOT**
  llevar sufijo: no son nombres de recurso.

- **R2**: WHEN se resuelve el sufijo de entorno, THE SYSTEM SHALL devolver
  `RESOURCE_SUFFIX_TEST` (constante exportada, valor `'test'`) IF el modo AWS
  resuelto es `local` AND `NODE_ENV` con `.trim()` vale exactamente `'test'`; y
  la cadena vacía `''` en **cualquier otro caso** (`NODE_ENV` ausente, vacía,
  `'development'`, `'production'`, o cualquier otro valor). La función SHALL
  ser pura respecto de su argumento: recibe el origen de configuración, no lee
  `process.env` por su cuenta.

- **R3**: IF el modo AWS resuelto es `aws`, THEN THE SYSTEM SHALL devolver
  sufijo `''` **incondicionalmente**, ignorando por completo el valor de
  `NODE_ENV`, y SHALL **no lanzar ningún error**. Con `AWS_MODE=aws` y
  `NODE_ENV=test` simultáneos, los diez nombres SHALL ser byte a byte los de la
  columna "Desarrollo" de R1.

  > Esta es la decisión con consecuencia económica y va **al revés** del
  > precedente de #21. Razón, fijada en [[design]] §D5: `AWS_MODE=aws` +
  > `NODE_ENV=test` es la combinación **normal** de
  > `test/aws-real-smoke.e2e-spec.ts` y `test/aws-real-ingest.e2e-spec.ts`
  > (ambos bajo Jest, ambos exigiendo `AWS_MODE=aws`). Una guarda que abortase
  > —como `UnexpectedAwsEndpointError` de #21— haría **imposible** verificar
  > AWS real. Y un sufijo que se filtrase pediría a la cuenta real colas
  > `positions-raw-test` que no existen, o peor, un `cdk deploy` crearía un
  > juego duplicado de recursos que cuestan dinero.

- **R4**: WHEN el runtime de NestJS necesita un nombre de recurso, THE SYSTEM
  SHALL obtenerlo de un proveedor inyectable registrado en
  `backend-pet-tracker/src/aws/aws.module.ts` bajo el token
  `AWS_RESOURCE_NAMES` (exportado desde
  `backend-pet-tracker/src/aws/aws.constants.ts`, junto a los cuatro tokens de
  cliente ya existentes), resuelto vía `ConfigService`. Ningún archivo bajo
  `backend-pet-tracker/src/` **SHALL** leer `process.env.NODE_ENV` ni
  `process.env.AWS_MODE` directamente para este fin: `docs/conventions.md`
  §Variables de entorno lo prohíbe fuera de la configuración. La excepción
  documentada (script standalone y suites e2e, que usan la vía `process.env`,
  igual que `resolveAwsConfigFromEnv` de #19) SHALL limitarse a
  `backend-pet-tracker/scripts/`, `backend-pet-tracker/test/` y a la propia
  función de resolución desde entorno.

- **R5**: WHEN se lee `backend-pet-tracker/src/aws/constants.ts`, THE SYSTEM
  SHALL encontrar los diecisiete símbolos de la tabla §Contexto **sin cambio de
  tipo**: los nombres siguen siendo literales `const` de tipo `string`, no
  funciones y no getters, y el archivo SHALL seguir sin importar
  `@nestjs/config`, sin leer `process.env` y sin importar ningún otro módulo del
  repo. Motivo verificado, no estético: `infra/test/no-duplicated-literals.test.ts`
  (L66-L84) interpola cada constante en `` `'${valor}'` `` y busca esa subcadena
  en el fuente de `infra/lib`; si una constante pasara a ser función, la aguja
  sería el **código fuente de la función** y el test quedaría **verde en vacío**,
  dejando de vigilar nada — un fallo silencioso, que es exactamente la clase de
  defecto que esta feature combate. Además `infra/lib/pet-tracker-dev-stack.ts`
  las pasa como `string` en nueve puntos (L38, L41, L49, L52, L60, L63, L71,
  L100, L104) y dejaría de compilar.

### Bloque B — provisioning

- **R6**: WHEN se ejecuta `pnpm -C backend-pet-tracker run provision:local` una
  vez, THE SYSTEM SHALL dejar creados y utilizables **los dos juegos completos**
  de recursos —los diez con sufijo `''` y los diez con sufijo `'test'`, veinte
  recursos en total— en la misma invocación y sin ningún argumento, flag ni
  variable de entorno adicional. El juego a crear **SHALL NOT** derivarse de
  `NODE_ENV`: el script corre por `ts-node` sin `NODE_ENV=test` (§Contexto), así
  que la lista de sufijos SHALL estar fijada en el código como
  `PROVISIONED_SUFFIXES` (ver [[design]] §D6).

- **R7**: WHEN `runProvisioning` se ejecuta **dos veces seguidas** sobre el mismo
  LocalStack, THE SYSTEM SHALL devolver exit code `0` en ambas y no lanzar:
  la idempotencia actual SHALL extenderse a los dos juegos sin cambiar de
  mecanismo (sigue siendo *catch-then-recover*, sin pre-checks de existencia).
  `backend-pet-tracker/test/localstack-provisioning.e2e-spec.ts:112-115` ya
  ejerce la doble corrida y SHALL seguir verde.

- **R8**: WHILE el modo AWS resuelto es `aws`, `runProvisioning` SHALL seguir
  abortando con exit code `1` **antes** de crear ningún recurso, exactamente
  como hoy (`src/aws/run-provisioning.ts:39-42`), de modo que ningún juego
  sufijado pueda materializarse jamás en la cuenta AWS real. Esa guarda
  **SHALL NOT** modificarse ni relajarse.

### Bloque C — aislamiento efectivo

- **R9**: WHEN una suite e2e resuelve un nombre de recurso, THE SYSTEM SHALL
  darle el nombre con sufijo `'test'`, de forma que
  `GetQueueUrlCommand({ QueueName: <cola de desarrollo> })` y
  `GetQueueUrlCommand({ QueueName: <cola de test> })` devuelvan `QueueUrl`
  **distintas**, y que todo `PurgeQueueCommand` de las suites actuales
  (`test/ingestion.e2e-spec.ts:119-121`,
  `test/alerts-engine.e2e-spec.ts:163-164`,
  `test/alerts-center-notifier.e2e-spec.ts:192-193`,
  `test/pet-reminders.e2e-spec.ts:99`) opere sobre la cola de **test**. Ninguna
  suite SHALL purgar, leer ni escribir una cola de desarrollo.

- **R10**: WHEN se ejerce el camino de ingesta completo bajo `NODE_ENV=test`
  (poller → `positions-raw` → consumer → DynamoDB → EventBridge →
  `geofence-events`), THE SYSTEM SHALL dejar las **tres colas de desarrollo**
  (`positions-raw`, `notifications`, `geofence-events`) con exactamente el mismo
  recuento de mensajes que antes de empezar, medido como la suma de
  `ApproximateNumberOfMessages` + `ApproximateNumberOfMessagesNotVisible` +
  `ApproximateNumberOfMessagesDelayed` de `GetQueueAttributesCommand`, y la
  tabla `positions` de desarrollo sin ningún ítem nuevo. Este es el criterio de
  aceptación 2 de `feature_list.json` reducido a su mitad **automatizable**; la
  corrida completa la cierra R13.

- **R11**: WHEN se recorren todos los `.ts` bajo `backend-pet-tracker/src/` y
  `backend-pet-tracker/test/`, THE SYSTEM SHALL no encontrar ninguna importación
  de los diez símbolos de nombre de recurso de `@/aws/constants`
  (`QUEUE_POSITIONS_RAW`, `QUEUE_POSITIONS_RAW_DLQ`, `QUEUE_NOTIFICATIONS`,
  `QUEUE_NOTIFICATIONS_DLQ`, `QUEUE_GEOFENCE_EVENTS`, `QUEUE_GEOFENCE_EVENTS_DLQ`,
  `RULE_GEOFENCE_EVENTS`, `TABLE_POSITIONS`, `BUCKET_MEDIA`, `EVENT_BUS_NAME`)
  fuera de la lista blanca exacta de [[design]] §D8. Es el equivalente de la
  guarda R4 de #20 aplicado al backend: sin él, el primer worker o e2e nuevo
  vuelve a importar el literal desnudo y el aislamiento se pudre en silencio.
  `BUCKET_MEDIA_BASE` **SHALL** quedar fuera de la prohibición (lo consume la
  stack CDK y la propia resolución).

- **R12**: WHEN se sintetiza el stack CDK, THE SYSTEM SHALL producir un template
  **byte a byte idéntico** al actual: los seis `QueueName`, el `TableName`, el
  `Name` del bus, el `Name` de la regla y el `BucketName`
  (`Fn::Join` con `pet-tracker-media-dev-` + `Ref: AWS::AccountId`) SHALL no
  cambiar. Ningún archivo bajo `infra/` SHALL modificarse (verificable con
  `git diff --name-only` al cerrar la feature), y `infra/lib/pet-tracker-dev-stack.ts`
  **SHALL NOT** importar la resolución de sufijo: la stack conserva su
  `ENV_SUFFIX = ''` literal (L31). Los 20 tests de `infra/test/` SHALL seguir
  verdes sin una sola línea modificada.

### Bloque D — verificación y evidencia

- **R13**: WHEN la feature queda cerrada, `docs/verification.md` SHALL contener
  una sección `### Feature 28 — test-dev-resource-isolation` con el
  procedimiento **manual** (verificación humana) que cierra la corrida completa
  del criterio de aceptación 2: recuento de las tres colas de desarrollo con
  `aws sqs get-queue-attributes` **antes** de `pnpm -C backend-pet-tracker run
  test:e2e`, la corrida completa, y el recuento **después**, con el resultado
  esperado "idéntico". El texto exacto, con los comandos literales, está en
  [[design]] §D9. Se marca como verificación humana porque exige LocalStack
  levantado y una corrida e2e completa desde fuera de la propia suite —
  ningún test puede medirse a sí mismo mientras corre.

- **R14**: WHEN la feature se implementa, THE SYSTEM SHALL dejar evidencia de
  proceso conforme a C2/C4/C5: (a) el historial de la branch
  `feature/28-test-dev-resource-isolation` SHALL mostrar, por cada R-id de R1 a
  R13, al menos un commit con el test en rojo **anterior** al commit con la
  implementación que lo pone en verde —nunca test + implementación + docs en un
  solo commit—; (b) `specs/test-dev-resource-isolation/traceability.md` SHALL
  quedar sin ninguna fila "pendiente"; (c)
  `progress/impl_test-dev-resource-isolation.md` SHALL registrar la corrida
  final de `./init.sh` con su exit code y el recuento de suites, y el resultado
  del procedimiento manual de R13; (d) `./init.sh` SHALL terminar con exit
  code 0.

---

## Fuera de alcance

- **PostgreSQL no se aísla.** Los e2e seguirán escribiendo en la **misma** base
  de datos de desarrollo que la app. Razón: los recursos de LocalStack son
  efímeros y se recrean con un comando idempotente, mientras que una segunda
  Postgres exigiría otra `DATABASE_URL`, otra corrida de migraciones de Drizzle,
  otro pool en `src/db/drizzle.module.ts` y decidir qué pasa con los seeds
  (`seed:devices`, `seed:vaccines`) — una feature entera, no un sufijo. Además
  el daño observado el 2026-08-14 fue **de cola**, no de tabla: las suites ya
  limpian sus filas por los repositorios Drizzle. **Riesgo residual aceptado y
  declarado**: un e2e sigue pudiendo dejar filas huérfanas en la Postgres de
  desarrollo. Si eso llega a doler, es otra feature.
- **La stack CDK de #20 y el modo `AWS_MODE=aws` no cambian** (R12, R3). No se
  toca `infra/`, no se ejecuta `cdk synth` con otro sufijo, no se ejecuta
  `cdk bootstrap` ni `cdk deploy`, y no se crea ningún recurso en la cuenta AWS
  real. La stack `PetTrackerDev` lleva desplegada desde 2026-08-10 con los
  nombres desnudos y sigue igual.
- **No se cambia el mecanismo de idempotencia del provisioning** a check-then-create
  (R7): sigue siendo catch-then-recover.
- **No se aísla por corrida ni por worker de jest.** El sufijo es uno solo
  (`'test'`), compartido por todas las suites. `test/jest-e2e.json` fija
  `maxWorkers: 1`, así que las suites no compiten entre sí; un sufijo por PID o
  por suite añadiría provisioning dinámico y basura que nadie limpia.
- **No se añade limpieza automática de los recursos de test** (ni TTL, ni
  `docker compose down -v` forzado). `PurgeQueueCommand` de las suites, ahora
  apuntando a las colas de test, sigue siendo la limpieza.
- **No se toca el contrato de eventos** (`EVENT_SOURCE`,
  `DETAIL_TYPE_POSITION_UPDATED`, `DETAIL_TYPE_BATTERY_LOW`), congelado desde #8
  R16/R17.
- **No se corrige que `init.sh` no llame a `provision:local`.** Es un hueco real
  (`init.sh` corre los e2e contra recursos posiblemente inexistentes), pero es
  anterior a esta feature y ortogonal a ella.
- **No se añaden `NODE_ENV=test` explícitos** a los scripts de
  `package.json`: Jest ya lo pone y la feature se apoya en eso (§Contexto).
- **No se ataca el modo de fallo de los procesos jest huérfanos** (matar PID
  zombies). Con el aislamiento, un huérfano envenena la cola de **test**, que es
  desechable — el daño deja de ser caro, pero el huérfano sigue existiendo.

---

## Decisiones abiertas

Ninguna. Los ocho puntos que podrían haber quedado abiertos están cerrados en
[[design]]: forma del discriminador (§D1), dónde se resuelve (§D2), inventario
de recursos aislados y no aislados (§D3), aislamiento del bus EventBridge y por
qué no basta compartirlo (§D4), comportamiento en `AWS_MODE=aws` (§D5),
alcance de `provision:local` (§D6), interacción con los gates `NODE_ENV=test`
de los workers (§D7), lista blanca de la guarda anti-regresión (§D8) y
procedimiento manual del recuento de colas (§D9).

---

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-17) ← gate obligatorio antes de implementar
