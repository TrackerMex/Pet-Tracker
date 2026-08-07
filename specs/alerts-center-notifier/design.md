---
feature: "alerts-center-notifier"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[alerts-center-notifier]]

> Ver [[requirements]] para los requisitos que este diseño implementa
> (incluidas las decisiones abiertas **D1-D6**, todas pendientes de
> confirmación humana en el gate) y
> [[../../docs/architecture|architecture]] para las reglas de capas del
> proyecto.

## Decisiones técnicas

- **`push_tokens` en `src/db/schema/push-tokens.schema.ts` propio, migración
  `0008`** — sirve a R1 (**D5**). Convención de `docs/conventions.md`: un
  `<module>.schema.ts` por concepto, re-export en el barrel `index.ts`,
  migración generada con `pnpm run db:generate`. `expo_token` es `text` y no
  `varchar(n)`: Expo no publica una longitud máxima, y el UNIQUE global sobre
  `text` cuesta lo mismo. El UNIQUE es **sobre `expo_token` solo**, no sobre
  `(user_id, expo_token)`: un token de Expo identifica una instalación en un
  dispositivo físico, así que dos usuarios no pueden tenerlo a la vez — es
  justo lo que hace posible el upsert idempotente de R3 y la reasignación de
  **D5**(iv). `id` uuid sin default, generado en app con `uuidv7` (mismo
  criterio que todas las tablas del proyecto).

- **La migración `0008` también redefine el índice anti-spam de #12** — sirve
  a R2, R23 (**D1**). Es la corrección de raíz de un solo concepto: "alerta
  activa" dejó de ser sinónimo de `status = 'open'` en cuanto existe `acked`.
  Los dos sitios que lo codificaban a mano se corrigen a la vez:

  ```typescript
  // src/db/schema/alerts.schema.ts — única línea que cambia del schema de #12
  uniqueIndex('alert_events_open_anti_spam_idx')
    .on(table.petId, table.type, sql`coalesce(...)`)
    .where(sql`${table.status} <> 'closed'`)   // antes: = 'open'
  ```

  ```typescript
  // src/workers/alerts-engine/alerts-engine.drizzle.store.ts — closeOpenAlert()
  //   ... and eq(alertEvents.status, 'open')
  //   ->  and inArray(alertEvents.status, ['open', 'acked'])
  ```

  Drizzle genera el par `DROP INDEX` / `CREATE UNIQUE INDEX` al cambiar el
  `.where()`; no hay pérdida de datos ni reescritura de tabla. Ningún test de
  #12 cambia (ninguno acka). El nombre del índice se conserva
  (`alert_events_open_anti_spam_idx`) aunque su predicado se amplíe: renombrarlo
  añadiría ruido al diff de la migración sin ganar nada.

- **`PushSender` como puerto con dos adaptadores, seleccionado por
  `PUSH_ENABLED`** — sirve a R9, R11, R12 (**D2**). Es literalmente el patrón
  que `auth-registration` (#3) ya estableció para `EMAIL_ENABLED`
  (`EmailVerificationSender` + `ConsoleEmailVerificationSender`), y el que
  `docs/architecture.md` §"Adaptación local" anticipa en su propia tabla
  ("Expo Push real → `PUSH_ENABLED=false` (log estructurado)"). Cero
  abstracción inventada: se reutiliza un patrón vigente del repo.

  ```typescript
  // src/workers/notifier/push-sender.ts
  export const PUSH_SENDER = Symbol('PushSender');

  /** Un envío por token, con el ticket emparejado a su token de origen. */
  export interface PushResult {
    expoToken: string;
    deviceNotRegistered: boolean;   // R12: única señal que el consumer accionará
    error: string | null;           // R12: cualquier otro error de ticket, para log
  }

  export interface PushSender {
    send(input: {
      tokens: string[];
      title: string;
      body: string;
      data: { petId: string; alertId: string };
    }): Promise<PushResult[]>;
  }
  ```

  `ConsolePushSender` emite el log `{wouldSend}` de R9 y devuelve `[]`;
  `ExpoPushSender` hace `isExpoPushToken` → `chunkPushNotifications` →
  `sendPushNotificationsAsync` y traduce los tickets a `PushResult[]`. El
  consumer no sabe cuál de los dos tiene inyectado — no hay ningún `if
  (pushEnabled)` en su lógica; la rama vive **solo** en el `useFactory` del
  módulo. Así R12 (borrado por `DeviceNotRegistered`) se testea sin tocar el
  SDK y R9/R10 sin tocar Expo en absoluto.

- **Worker notifier en `src/workers/notifier/`, clonando la forma de
  `src/workers/alerts-engine/`** — sirve a R7-R15. Misma familia de archivos,
  mismos nombres de rol, misma disciplina: `drainOnce(now = new Date())` con
  toda la lógica, scheduler como cáscara aparte, `resolveQueueUrl()` privado y
  cacheado (el repo tiene tres copias de esa función — `poller`,
  `positions-consumer`, `alerts-engine-consumer` — y **no** existe helper
  compartido; esta feature sigue el precedente en vez de inventar la
  extracción). Como el notifier solo resuelve **una** cola, usa la variante de
  campo único `string | null` de `PositionsConsumerService`, no el `Map` de
  `AlertsEngineConsumerService`. `ReceiveMessageCommand` con
  `MaxNumberOfMessages: 10` / `WaitTimeSeconds: 1`, sin `VisibilityTimeout`
  explícito — idéntico a los dos consumidores existentes.

- **Tres caminos distintos ante un mensaje problemático, copiados de #12** —
  sirve a R7, R14. (1) `Body` no parseable / no cumple el schema → log de error
  y **sin delete** (redelivery → DLQ vía la `RedrivePolicy` ya existente);
  (2) mensaje válido cuyo procesamiento lanza → log de error y **sin delete**,
  sin envenenar el resto del lote; (3) procesado con éxito (incluido "sin
  destinatarios", R10) → `DeleteMessageCommand`. Jamás se escribe a la DLQ a
  mano.

- **Autorización sin `PetAccessGuard`, resuelta dentro de la consulta** —
  sirve a R16, R19, R21. `PetAccessGuard` lee literalmente
  `request.params.petId`; en `GET /v1/alerts` no existe ese segmento y en
  `POST /v1/alerts/:id/ack` el segmento es `:id` (el id de la **alerta**) — en
  ambos casos el guard leería `undefined`, fallaría su `UUID_PATTERN` y
  devolvería 404 a todo el mundo. Por eso:
  - **Listado (R16/R19)**: el `WHERE` incluye el `INNER JOIN pet_users ON
    pet_users.pet_id = alert_events.pet_id AND pet_users.user_id = :me AND
    pet_users.status = 'active'`. La autorización **es** la consulta: no hay un
    camino de código donde una alerta ajena pueda colarse, y un usuario sin
    membresías obtiene la lista vacía, no un error.
  - **Ack (R21)**: el use case hace `findById(alertId)` + `findMembership(petId,
    userId)` reutilizando `PET_REPOSITORY` (#5) tal cual, sin añadirle métodos —
    misma consulta que el guard usa internamente. Los tres fallos (id
    malformado, alerta inexistente, sin membresía) salen por el **mismo** 404
    genérico, mismo criterio de no-filtración de existencia del guard.

- **Paginación por keyset `(opened_at, id)` con cursor base64url versionado** —
  sirve a R18. Se copia la forma de `positions-api` (#9): respuesta
  `{items, nextCursor}`, tamaño de página en una constante nombrada
  (`ALERTS_PAGE_SIZE = 50` en `alerts.constants.ts`) y **sin** parámetro
  `?limit=` de cliente — por eso `z.strictObject` en R17 lo rechaza con 400 en
  vez de ignorarlo. El cursor es un envelope JSON `{v, o, i, s}` (versión,
  `opened_at` en epoch ms, `id`, `status` filtrado) en base64url, **sin firma**
  — mismo razonamiento que #9: el cursor solo mueve el punto de inicio dentro
  de un conjunto que la consulta ya restringió a las mascotas del usuario, así
  que un cursor forjado no puede cruzar de usuario. `OFFSET` se descarta: con
  alertas llegando en tiempo real, desplaza filas entre páginas.

- **`time_away_minutes` dentro del upsert existente, con `coalesce`** — sirve a
  R28 (**D4**). `AggregateDailyActivityUseCase.aggregatePet()` ya calcula
  `range = localDayRange(targetDay, tz)`; el cálculo de R25 necesita
  exactamente eso y las filas de `alert_events` de la mascota — una lectura más
  por mascota, en el mismo bucle que ya existe, con su `try/catch` por mascota
  ya montado. `DailyActivityUpsert` gana un campo opcional y el `set:` del
  `onConflictDoUpdate` gana una entrada:

  ```typescript
  timeAwayMinutes: sql`coalesce(excluded.time_away_minutes,
                               ${activityDaily.timeAwayMinutes})`,
  ```

  El cómputo en sí es una **función pura nueva** en `src/pipeline/time-away.ts`
  (`computeTimeAwayMinutes(spans, range)`), testeable sin base ni reloj — mismo
  criterio que `computeDailyActivity`/`groupTrips` de #10. `computeDailyActivity`
  no se toca: `time_away_minutes` no sale de posiciones GPS.

- **Módulo HTTP nuevo `src/modules/alerts/`, con las 3 capas completas** —
  sirve a R16-R22. `files_affected` de la feature ya lo anticipa y hoy no
  existe. Estructura estándar de `docs/architecture.md`: `domain/` (entidad
  `AlertEvent`, errores `AlertNotFoundError`/`AlertAlreadyClosedError`, puerto
  `AlertRepository` + token), `application/` (dto zod, `ListAlertsUseCase`,
  `AckAlertUseCase`), `infrastructure/` (repositorio Drizzle, controller,
  `alert-response.mapper.ts`, `alert-error.mapper.ts`). No se reutiliza
  `AlertsEngineStore` de #12: es un puerto de escritura interno del worker
  (`openAlert`/`closeOpenAlert`/`updateGeofenceState`), sin ninguna operación
  de lectura ni de `ack`, y su contrato lo cerró una spec aprobada — mismo
  criterio D14 de #8 y D2 de #12.

- **Endpoints de push tokens colgados del `UsersController` existente** — sirve
  a R3-R6. `@Controller('me')` + `@Post('push-tokens')`/`@Delete('push-tokens')`
  da las rutas exactas sin un controller nuevo ni un módulo nuevo; el
  `AuthGuard` global ya las protege (R6) y `@CurrentUser()` da el `user.id` sin
  consultar la base. El repositorio `PushTokenRepository` vive en
  `src/modules/users/domain/repositories/` con los cuatro métodos que hacen
  falta entre HTTP y worker (`upsert`, `deleteOwnedByUser`,
  `findActiveMembersTokens(petId)`, `deleteByToken`), y `UsersModule` exporta su
  token para que `NotifierModule` lo inyecte — el mismo mecanismo por el que
  `AlertsEngineModule` importa `PetsModule` para leer `PET_REPOSITORY`. Un
  puerto en vez de dos evita duplicar la tabla en dos contratos; nada aquí es
  un contrato cerrado que haya que respetar (lo crea esta misma feature).

- **Redacción de tokens en un único helper** — sirve a R13. `redactToken(t)`
  exportado desde `src/workers/notifier/notifier.constants.ts`, usado por los
  dos adaptadores y por el consumer. Un solo lugar donde equivocarse, y el test
  de R13 busca el token completo como subcadena en todo lo que pasó por el
  `Logger`, así que una ruta que se salte el helper falla.

- **`NOTIFIER_ENABLED` como cuarto gate de worker** — sirve a R15 (**D6**).
  Mismo patrón exacto y sin desviación: `OnApplicationBootstrap` +
  `SchedulerRegistry.addInterval()`, intervalo como constante nombrada
  (`NOTIFIER_INTERVAL_MS = 60_000`, no env), `ConfigService.get<string>(...)
  === 'true'` sin default (cierra por defecto) y `NODE_ENV !== 'test'`.

## Estructura de capas

```
backend-pet-tracker/src/
├── pipeline/
│   └── time-away.ts                       [nuevo: computeTimeAwayMinutes(), función pura]
│
├── db/
│   ├── schema/push-tokens.schema.ts        [nuevo: tabla push_tokens]
│   ├── schema/alerts.schema.ts             [EDITADO: 1 línea, .where() del índice — D1]
│   ├── schema/index.ts                     [editado: +1 línea de re-export]
│   └── migrations/0008_*.sql               [generado: CREATE push_tokens + DROP/CREATE índice]
│
├── modules/
│   ├── users/                              [endpoints de push tokens]
│   │   ├── domain/repositories/push-token.repository.ts   ← interface + PUSH_TOKEN_REPOSITORY
│   │   ├── application/dto/register-push-token.dto.ts     ← zod strictObject (R4)
│   │   ├── application/dto/delete-push-token.dto.ts
│   │   ├── application/use-cases/register-push-token.use-case.ts
│   │   ├── application/use-cases/delete-push-token.use-case.ts
│   │   ├── infrastructure/repositories/push-token.drizzle.repository.ts
│   │   ├── infrastructure/mappers/push-token-response.mapper.ts  ← redacta (R13)
│   │   ├── infrastructure/users.controller.ts             [EDITADO: +2 rutas]
│   │   └── users.module.ts                 [EDITADO: +providers, exporta el token]
│   │
│   ├── alerts/                             [módulo nuevo completo — centro de alertas]
│   │   ├── domain/entities/alert-event.entity.ts
│   │   ├── domain/errors/alert.errors.ts   ← AlertNotFoundError, AlertAlreadyClosedError
│   │   ├── domain/repositories/alert.repository.ts        ← interface + ALERT_REPOSITORY
│   │   ├── domain/cursor.ts                ← encode/decodeAlertCursor (R18)
│   │   ├── application/dto/list-alerts.dto.ts             ← zod strictObject (R17)
│   │   ├── application/use-cases/list-alerts.use-case.ts  ← R16, R18, R19
│   │   ├── application/use-cases/ack-alert.use-case.ts    ← R20, R21, R22
│   │   ├── infrastructure/repositories/alert.drizzle.repository.ts
│   │   ├── infrastructure/mappers/alert-response.mapper.ts
│   │   ├── infrastructure/mappers/alert-error.mapper.ts
│   │   ├── infrastructure/alerts.controller.ts            ← @Controller('alerts')
│   │   ├── alerts.constants.ts             ← ALERTS_PAGE_SIZE, CURSOR_VERSION
│   │   └── alerts.module.ts
│   │
│   └── activity/                           [R24-R28]
│       ├── domain/entities/daily-activity.entity.ts       [EDITADO: +timeAwayMinutes opcional]
│       ├── domain/repositories/activity-store.ts          [EDITADO: +1 método de lectura]
│       ├── application/use-cases/aggregate-daily-activity.use-case.ts [EDITADO]
│       └── infrastructure/repositories/activity.drizzle.store.ts      [EDITADO: coalesce]
│
└── workers/
    ├── alerts-engine/
    │   └── alerts-engine.drizzle.store.ts  [EDITADO: 1 filtro, closeOpenAlert — D1]
    │
    └── notifier/                           [worker nuevo completo]
        ├── notifier.constants.ts           ← intervalo, batch, redactToken()
        ├── notification-message.schema.ts  ← zod del contrato v1 congelado de #12 (R7)
        ├── push-sender.ts                  ← puerto PushSender + PUSH_SENDER
        ├── console-push-sender.ts          ← R9/R10/R13 (PUSH_ENABLED != 'true')
        ├── expo-push-sender.ts             ← R11/R12 (PUSH_ENABLED === 'true')
        ├── notifier-consumer.service.ts    ← drainOnce(), R7-R14
        ├── notifier-scheduler.service.ts   ← R15, gateado por NOTIFIER_ENABLED
        └── notifier.module.ts              ← useFactory que elige el adaptador
```

## Archivos afectados

- `backend-pet-tracker/src/db/schema/push-tokens.schema.ts` — nuevo (R1);
  `src/db/schema/index.ts` — **una línea** de re-export.
- `backend-pet-tracker/src/db/schema/alerts.schema.ts` — editado: **solo** el
  `.where()` del índice anti-spam (R2, **D1**); columnas, CHECKs y demás
  índices intactos.
- `backend-pet-tracker/src/db/migrations/0008_*.sql` + `meta/` — generados por
  `pnpm run db:generate`: `CREATE TABLE push_tokens` + `DROP INDEX` /
  `CREATE UNIQUE INDEX` del anti-spam. Ninguna otra sentencia.
- `backend-pet-tracker/src/modules/users/**` — R3-R6: dto, dos use cases, el
  puerto `PushTokenRepository` + su implementación Drizzle, el mapper de
  respuesta (redacta, R13), **+2 rutas** en `users.controller.ts`, providers y
  `exports` en `users.module.ts`. `GET`/`PATCH /v1/me` no se tocan.
- `backend-pet-tracker/src/modules/alerts/**` — módulo nuevo completo
  (R16-R22); `src/app.module.ts` — **una línea**.
- `backend-pet-tracker/src/workers/notifier/**` — worker nuevo completo
  (R7-R15); `src/app.module.ts` — **una línea**.
- `backend-pet-tracker/src/workers/alerts-engine/alerts-engine.drizzle.store.ts`
  — editado: **solo** el filtro de estado de `closeOpenAlert()` (R23, **D1**).
  Su firma, su token y su interfaz no cambian; el JSDoc del método en
  `alerts-engine-store.ts` se actualiza para no mentir.
- `backend-pet-tracker/src/pipeline/time-away.ts` — nuevo: la función pura de
  R25/R26, con el JSDoc que documenta la aproximación (exigido por el plan
  007). `src/pipeline/activity.ts` y `src/pipeline/local-day.ts` no cambian.
- `backend-pet-tracker/src/modules/activity/**` — R24-R28: `timeAwayMinutes`
  opcional en `DailyActivityUpsert`, un método de lectura nuevo en
  `ActivityStore` (spans de `alert_events` + geocerca de referencia), su
  implementación Drizzle, el `coalesce` del `onConflictDoUpdate` y las ~6
  líneas del use case del agregador. `computeDailyActivity()`,
  `findDailyRange()` y `GET /v1/pets/:petId/activity/daily` no cambian.
- `backend-pet-tracker/test/alerts-center-notifier.e2e-spec.ts` — nuevo:
  ciclo `open → GET → ack → GET` (R16/R20), aislamiento entre usuarios (R19),
  upsert/delete de tokens contra Postgres (R3/R5), notifier con
  `PUSH_ENABLED=false` sobre LocalStack (R9/R10) y el escenario
  `exit → ack → exit → enter` de R23.
- `backend-pet-tracker/package.json` — **una** dependencia nueva:
  `expo-server-sdk` (**D2**).
- `docs/data-model.md` — fila `push_tokens` afinada con el shape real de R1,
  fila `alert_events` con el predicado nuevo del índice y la máquina de estados
  de R21, fila `activity_daily` con la fórmula de R25.
- `docs/conventions.md` — tabla de variables de entorno: `PUSH_ENABLED` y
  `NOTIFIER_ENABLED`. `.env.example` — las mismas dos.
- `progress/impl_alerts-center-notifier.md` — reporte del implementer;
  `specs/alerts-center-notifier/traceability.md` — completado por el
  implementer.

Sin cambios en `src/aws/**`: la cola `notifications` y su DLQ ya las provisiona
`provisionQueues()` desde #2, con `RedrivePolicy` y `maxReceiveCount = 3`.

## Alternativas descartadas

- **No tocar nada de `alerts-engine` (#12) y aceptar que `ack` rompa el
  anti-spam y el cierre**: descartada (**D1**, opción A) — contradice el brief
  §12 y el criterio de aceptación de #12 "el regreso cierra el evento". Un
  usuario que se entera de una alerta acabaría recibiendo *más*
  notificaciones que uno que la ignora.
- **Modelar `acked` como "`acked_at` no nulo" sin cambiar `status`**:
  descartada (**D1**, opción D) — contradice `docs/data-model.md`, el CHECK ya
  migrado en `0007` y el criterio de aceptación literal de esta feature
  ("ack → 200 y **status acked**").
- **`UPDATE activity_daily SET time_away_minutes = ...` como sentencia
  separada tras el upsert**: descartada (**D4**) — añade un segundo viaje a
  Postgres por mascota y una ventana en la que la fila puede no existir todavía
  (el `UPDATE` afectaría cero filas y la métrica se perdería en silencio).
  Incluirla en el `INSERT ... ON CONFLICT` que ya existe es atómico y son dos
  líneas.
- **`SET time_away_minutes = excluded.time_away_minutes` sin `coalesce`**:
  descartada (**D4**) — un `NULL` calculado (mascota que se quedó sin
  geocercas) borraría un valor histórico bueno, y rompería el test de R11 de
  #10 sin necesidad.
- **Unir los intervalos de *todas* las geocercas de la mascota**: descartada
  (**D3**) — obliga a fusionar intervalos solapados (código nuevo, casos borde
  propios) y responde a otra pregunta que la del brief §14, que habla del
  tiempo fuera de la geocerca **del hogar**, no de todas.
- **Un puerto propio del notifier para leer `push_tokens`**, separado del que
  usan los endpoints: descartado — duplicaría el contrato de la misma tabla en
  dos interfaces. La razón que llevó a #12 a crear `AlertsEngineStore` (no
  reabrir un repositorio cerrado por una spec aprobada) no aplica aquí:
  `PushTokenRepository` lo crea esta misma feature.
- **Reutilizar `AlertsEngineStore` (#12) para el centro de alertas**:
  descartado — es un puerto de escritura del worker sin ninguna lectura ni
  `ack`, y su contrato está cerrado por una spec aprobada.
- **`PetAccessGuard` en `/v1/alerts`**: imposible, no descartado por gusto —
  lee `request.params.petId`, que en estas rutas no existe; devolvería 404 a
  todas las peticiones.
- **Paginación por `OFFSET`**: descartada (R18) — con alertas llegando en
  tiempo real, una fila nueva desplaza el offset y el cliente ve duplicados o
  se salta alertas. El keyset sobre `(opened_at, id)` es inmune.
- **Firmar el cursor (HMAC)**: descartada — mismo razonamiento que #9: el
  cursor solo mueve el punto de inicio dentro de un conjunto que el `INNER
  JOIN pet_users` ya restringió al usuario; un cursor forjado no cruza de
  usuario.
- **Un `?limit=` configurable por el cliente**: descartado — #9 ya fijó
  "tamaño de página en constante, `?limit=` es 400" y no hay motivo para que
  este endpoint diverja.
- **Extraer `resolveQueueUrl()` a un helper compartido** ahora que sería la
  cuarta copia: descartado en esta feature — es refactor de código de tres
  specs cerradas (#8, #12) y ninguna la pidió; se limita a seguir el
  precedente
  (`ponytail: cuarta copia de resolveQueueUrl — upgrade path: extraer a
  src/aws/ cuando alguien toque los cuatro workers por otro motivo`).
- **Procesar los *receipts* diferidos de Expo**: descartado por ahora — ver
  §Fuera de alcance de `requirements.md`, con su `ponytail` y su upgrade path.
- **Notificar solo al `owner` en vez de a todos los miembros**: descartada —
  el plan 007 paso 4 dice literalmente "MVP: todos los miembros"; filtrar por
  rol es la feature de preferencias del brief §17, diferida entera.
