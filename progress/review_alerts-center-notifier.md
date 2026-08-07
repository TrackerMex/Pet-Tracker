# review: alerts-center-notifier
Fecha: 2026-08-07
Branch: `feature/13-alerts-center-notifier`
Veredicto: **APROBADO**

> Revisión hecha desde cero (el reviewer anterior fue cancelado sin veredicto).
> `./init.sh` ejecutado por el reviewer, no aceptado del reporte del implementer.
> Los cuatro puntos ya verificados por el leader (alcance de `users.controller.spec.ts`,
> traceability de R11 de #10, corrida de e2e 164/165, `init.sh` no corre e2e) se
> dan por hechos y no se repiten.

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` — `#13`; `done: [1..12]`.
      Correcto que siga `in_progress`: marcar `done` es del leader, tras esta aprobación.
- [x] `progress/current.md` describe la sesión activa (`progress/current.md:19-25`),
      con las decisiones del gate D1-D6 y los pendientes abiertos anotados.
- [x] Toda feature `done` sigue teniendo tests que la cubren — 832 tests verdes,
      0 tests existentes reescritos para que pasen.

## Checklist C3 — Arquitectura

- [x] `domain` sin imports de `infrastructure`. Verificado archivo por archivo:
      `modules/alerts/domain/**`, `modules/users/domain/repositories/push-token.repository.ts`
      (cero imports), `workers/notifier/push-sender.ts` (cero imports).
      `modules/activity/domain/repositories/activity-store.ts:5-6` importa
      `LocalDayRange` y `AwaySpan` de `@/pipeline/**` — tipos de funciones puras,
      sin IO; mismo patrón preexistente de #10.
- [x] Repositorios/contratos en domain son interfaces puras —
      `alert.repository.ts`, `push-token.repository.ts`, `push-sender.ts`: solo
      `interface` + `Symbol` de token, sin implementación.
- [x] `application` depende de interfaces, nunca de implementaciones.
      `ack-alert.use-case.ts:9-10` y `list-alerts.use-case.ts:12-13` inyectan
      `ALERT_REPOSITORY` (símbolo) + `import type { AlertRepository }`; idem
      `register-push-token.use-case.ts:3-4` y `delete-push-token.use-case.ts:3-4`.
      Ningún `*.drizzle.*` importado desde application.
- [x] `infrastructure` sin lógica de negocio — los mappers son proyección pura
      (`push-token-response.mapper.ts`, `alert-response.mapper.ts`), y la rama de
      `PUSH_ENABLED` vive **solo** en el `useFactory` (`notifier.module.ts:29`);
      `notifier-consumer.service.ts` no inyecta `ConfigService`, comprobado además
      por test (`notifier-env.spec.ts:93-94`).

## Checklist C4 — TDD

- [x] Cada `R<n>` tiene al menos un test que lo nombra: **29 de 30** con test
      unitario y/o e2e nombrando el R-id exacto, sin ningún archivo equivocado y
      sin deriva de wording respecto a `traceability.md`.
      Excepción declarada: **R30** (ver hallazgo #2) — la propia spec fija su método
      de verificación como `git diff main --name-only` (requirements.md:452), no
      como test; el reviewer lo ejecutó (ver hallazgo #2).
- [x] El historial no está "todo en un commit": 8 commits agrupados por bloque de
      requisitos siguiendo el orden de `tasks.md`, cada uno con sus specs y su
      implementación (`7652ff0` 1 spec/3 impl, `dea4631` 3/8, `4cb2578` 7/10,
      `76be277` 4/14, `0e5cc3c` 1/2, `cd3e9c2` 6/5, más 2 de docs).
      Mismo granulado aceptado en #12.
- [x] Ningún test silenciado: cero `.skip` / `.only` / `.todo` / `xit` / `xdescribe`
      en todo `backend-pet-tracker`.

## Checklist C5 — Trazabilidad

- [x] `specs/alerts-center-notifier/traceability.md` sin ninguna fila "pendiente"
      (30 filas, todas con test y commit).
- [x] Los 7 hashes citados existen y sus mensajes coinciden literalmente con la tabla.
- [x] Commits en formato `feat(<scope>): <desc> (R-ids)` —
      p.ej. `feat(alerts-center-notifier): closeOpenAlert covers acked so the return still closes (R23)`.
- [x] Las afirmaciones "sigue verde **sin editarlo**" son ciertas:
      `git diff main --name-only -- backend-pet-tracker/test/` devuelve **solo**
      `alerts-center-notifier.e2e-spec.ts`. `alerts-engine.e2e-spec.ts` (R2) y
      `activity.e2e-spec.ts` (R11) intactos.

## Checklist C6 — Spec aprobada

- [x] `requirements.md:3` → `status: approved`.
- [x] `requirements.md:582` → casilla marcada **con fecha** (2026-08-07), y
      D1-D6 rellenas por el humano (`requirements.md:590-595`).
      La incidencia de proceso (el `spec_author` premarcó la casilla con fecha
      vacía) queda anotada en la propia spec y en `current.md:31-34`. La aprobación
      válida es la del humano en sesión.
- [x] Ningún requisito modificado después de la aprobación:
      `git diff main -- specs/alerts-center-notifier/requirements.md` no aparece
      en commits posteriores al gate salvo la propia creación de la spec.

## Checklist C7 — Sin código huérfano

- [x] Lo único que esta feature reemplaza es el índice único parcial anti-spam de
      #12. Se sustituye **en la misma migración**: `0008_stormy_moira_mactaggert.sql`
      hace `DROP INDEX alert_events_open_anti_spam_idx` seguido de
      `CREATE UNIQUE INDEX ... WHERE "alert_events"."status" <> 'closed'`.
      No queda definición vieja: `alerts.schema.ts:64` tiene ya el predicado nuevo.
- [x] No hay tests huérfanos — ningún archivo fue eliminado por esta feature.
- [x] El predicado antiguo `status = 'open'` no sobrevive en ningún sitio ejecutable:
      la única coincidencia restante es un comentario explicativo
      (`alerts.schema.ts:27`).

---

## Verificación específica de los puntos de riesgo

### D1 — código de #12 (ya mergeado a `main`)

Los **tres** sitios de D1 están aplicados y son coherentes entre sí:

1. `src/db/migrations/0008_stormy_moira_mactaggert.sql` — `DROP INDEX` + `CREATE
   UNIQUE INDEX` con las **mismas tres columnas**
   (`pet_id`, `type`, `coalesce(geofence_id, '000...0'::uuid)`) y predicado
   `WHERE "alert_events"."status" <> 'closed'`. La migración no crea ni modifica
   ninguna otra tabla, columna, CHECK ni índice más allá de `push_tokens` (R1).
   **Anti-spam sigue efectivo**: una fila `acked` cae dentro de `<> 'closed'`, así
   que un `INSERT` duplicado choca con el único → `23505`. Correcto.
2. `src/db/schema/alerts.schema.ts:64` — `.where(sql\`${table.status} <> 'closed'\`)`,
   consistente con el SQL migrado.
3. `src/workers/alerts-engine/alerts-engine.drizzle.store.ts:99` —
   `inArray(alertEvents.status, ['open', 'acked'])`. **El regreso cierra una alerta
   `acked`**. Firma y contrato de retorno intactos (`alerts-engine-store.ts:51`,
   solo cambió el JSDoc, como R30 permite).

**Ningún test de #12 cambió de significado.** `alerts-engine.drizzle.store.spec.ts`
es un archivo **nuevo** (`git diff` lo reporta como `new file mode`), no una
modificación: `git diff main -- backend-pet-tracker/test/` confirma que la suite e2e
de #12 está intacta. Ninguno de sus tests ackea, así que ninguno cambia de premisa.

### `expo-server-sdk@7` (ESM-only)

- **No se degrada a `require` en el build.** `tsconfig.json` usa `"module": "nodenext"`,
  que preserva el `import()` dinámico en salida CJS. Verificado en el artefacto real:
  `dist/src/workers/notifier/expo-push-sender.js:58` emite
  `const { Expo } = await import('expo-server-sdk');`. Es la **única** aparición del
  paquete en el archivo compilado.
- **Sin import estático residual.** La única referencia estática en `src/` es
  `expo-push-sender.ts:2` → `import type { ExpoPushMessage, ExpoPushTicket }`, un
  import **de solo tipos**, borrado por completo en el emit (por eso no aparece en el `.js`).
- **Con `PUSH_ENABLED=false` no se carga nunca.** `notifier.module.ts:29-31` solo
  construye `ExpoPushSender` si `config.get<string>('PUSH_ENABLED') === 'true'`; y
  aun instanciándolo, el constructor no toca el SDK (`client = null`) — la carga
  ocurre en `resolveClient()` (`expo-push-sender.ts:82-99`), es decir en el primer
  envío real. R9 ("SHALL NOT construir ni invocar ningún cliente de Expo") se cumple.

### `messageId` en `PushSendInput` — justificado

`push-sender.ts:10`. `design.md` no lo tenía, pero **R9 lo exige literalmente** en el
log: "un log estructurado — objeto literal con `{scope, messageId, wouldSend}`"
(requirements.md:172-174). El puerto lo necesita porque quien emite ese log es el
adaptador, no el consumer. No acopla de más: es un `string` opaco, se usa solo para
correlacionar logs (`expo-push-sender.ts:45`, y en el `ConsolePushSender` para R9),
y ningún adaptador toma decisiones con él. Documentado en el JSDoc del puerto
(`push-sender.ts:3-8`).

### R13 — sin `expo_token` completo

- **Bodies de respuesta**: limpio. `push-token-response.mapper.ts:17-24` usa lista
  explícita de 4 claves; `expoToken` y `userId` quedan fuera. `DELETE` es `204` sin
  body (`users.controller.ts:91`).
- **Logs**: limpio en todas las rutas normales. Único punto de redacción centralizado
  en `redactToken()` (`notifier.constants.ts:27-29`), `…` + 6 últimos caracteres, tal
  como pide R13. Usado en `notifier-consumer.service.ts:177` y `expo-push-sender.ts:45`.
- **Una vía residual**, ver hallazgo #1.

### R29 — variables de entorno

- [x] `PUSH_ENABLED` y `NOTIFIER_ENABLED` en la tabla "Variables de entorno" de
      `docs/conventions.md:226-227`.
- [x] Ambas en `.env.example` (`NOTIFIER_ENABLED=true`, `PUSH_ENABLED=false`), con
      el comentario de por qué.
- [x] Leídas **solo** vía `ConfigService`: cero `process.env` en las 29 fuentes nuevas
      (la única aparición del literal en el diff es el test que comprueba su ausencia,
      `notifier-env.spec.ts:71`). Lectura confinada a
      `notifier-scheduler.service.ts` (`NOTIFIER_ENABLED`) y `notifier.module.ts`
      (`PUSH_ENABLED`), verificado por test (`notifier-env.spec.ts:74-95`).

### R30 — alcance, verificado sobre `git diff main --name-only`

- [x] **Una sola dependencia nueva**: `git diff main -- backend-pet-tracker/package.json`
      añade exactamente una línea, `"expo-server-sdk": "^7.0.0"`.
- [x] **Una sola migración**: `0008_stormy_moira_mactaggert.sql`, con una única
      entrada nueva en `meta/_journal.json` (`"idx": 8`).
- [x] **Cero cambios en provisioning AWS** (`src/aws/**`), `pipeline/geofence-eval.ts`,
      `modules/geofences/**`, `modules/positions/**` ni `workers/ingestion*` —
      el grep sobre la lista de archivos cambiados no devuelve ninguno.
- [x] `src/pipeline/activity.ts` y `src/pipeline/local-day.ts` sin cambios, como exige R30.
- Dos archivos nuevos quedan fuera de la lista literal de R30 — ver hallazgo #3.

### Higiene

- [x] Sin `console.log` de debug en ningún archivo de la feature (el único hit de
      "TODO" es la palabra española "TODOS" dentro de un JSDoc,
      `push-token.repository.ts:47`).
- [x] Sin archivos temporales, sin `.skip`/`.only`.
- [x] La deuda deliberada está marcada como pide la convención:
      `notifier-consumer.service.ts:185-186` lleva un comentario `ponytail:` con su
      ceiling y upgrade path (cuarta copia de `resolveQueueUrl`).

---

## Observaciones

Ninguna bloqueante. Se listan por severidad para que el leader decida qué recoger
como deuda.

### 1. MEDIA — R13: un `expo_token` completo puede acabar en un log de error

`backend-pet-tracker/src/workers/notifier/notifier-consumer.service.ts:169`

```ts
await this.pushTokens.deleteByToken(result.expoToken);
```

Si esa consulta lanza (Postgres caído, deadlock…), drizzle construye un
`DrizzleQueryError` cuyo `message` es —confirmado en
`node_modules/.pnpm/drizzle-orm@0.45.2_*/node_modules/drizzle-orm/errors.cjs`—:

```js
super(`Failed query: ${query}\nparams: ${params}`);
```

es decir, **incluye los parámetros**, y el parámetro de `deleteByToken` es el
`expo_token` completo. Ese error se captura en `notifier-consumer.service.ts:102`
y se loguea en `:108` como `message: describeError(error)`, que devuelve
`error.message` tal cual → token completo en un log de nivel `error`.

R13 dice "jamás el valor completo". **No es bloqueante** porque (a) exige un fallo
de infraestructura *dentro* de la rama `DeviceNotRegistered`, no es camino feliz, y
(b) el criterio "Verificable" que la propia R13 define (un test que busca el token
como subcadena en los argumentos del `Logger`) pasa: los tests cubren las rutas
normales, donde la redacción es correcta. Pero la vía existe.

Arreglo mínimo si se recoge: redactar en el `catch` de `consumeMessage`, o envolver
la llamada de `:169` en su propio try/catch que loguee con `redactToken()`.

### 2. BAJA — R30 es el único requisito sin ningún test que lo nombre

`specs/alerts-center-notifier/traceability.md:40` lo declara abiertamente
("sin commit de test", misma vía que R20 de #12). No hay ningún `describe`/`it`
con `R30` en todo el backend; la única aparición del token es un comentario
(`notifier-env.spec.ts:9`).

No es un hueco oculto sino declarado, y **la propia spec fija `git diff` como su
método de verificación** (requirements.md:452), no un test. El reviewer ejecutó esa
verificación a mano y las tres condiciones se cumplen (ver §R30 arriba). Se anota
porque C4 pide, literalmente, un test por requisito.

### 3. BAJA — dos archivos nuevos fuera de la lista literal de R30

- `backend-pet-tracker/src/workers/alerts-engine/alerts-engine.drizzle.store.spec.ts` (nuevo)
- `backend-pet-tracker/src/pipeline/time-away.ts` + `time-away.spec.ts` (nuevos)

R30 enumera `alerts-engine.drizzle.store.ts` ("**solo** el filtro") y prohíbe tocar
`src/pipeline/activity.ts` y `local-day.ts` —ambos intactos—, pero no contempla
archivos **nuevos** en esas dos carpetas.

Ambos están justificados y no contradicen la intención de R30 (congelar el
comportamiento de #12 y no tocar el pipeline existente):
- el spec de `alerts-engine.drizzle.store` es el test que **C4 exige** para R23; sin
  él, R23 no tendría cobertura en la suite que `init.sh` corre;
- `time-away.ts` es la función pura que R25/R26 necesitan, y R26 exige explícitamente
  documentar la aproximación "en el JSDoc de la función que la implementa".

Informativo. Si se quiere rigor formal, la lista de R30 se quedó corta, no la
implementación.

### 4. BAJA — la aserción borrada del unit test de #10 es reemplazo equivalente

`backend-pet-tracker/src/modules/activity/application/use-cases/aggregate-daily-activity.use-case.spec.ts`

El implementer borró, del `describe('R14: ...')`:

```ts
// El payload del upsert nunca lleva time_away_minutes (R11).
expect(Object.keys(calls.upserts[0])).not.toContain('timeAwayMinutes');
```

y la sustituyó por `timeAwayMinutes: null` dentro del objeto esperado.

**El borrado era obligado**: esa aserción contradice frontalmente a R28, que exige
que el payload **gane** la clave `timeAwayMinutes`. Mantenerla era imposible.

**Y no se pierde cobertura en la suite que `init.sh` sí corre.** Lo que R11 de #10
garantizaba de verdad —que el `ON CONFLICT` *preserva* `time_away_minutes`— ahora lo
cubre `activity-time-away.drizzle.spec.ts::R28`, que asserta el
`coalesce(excluded.time_away_minutes, ...)` real
(`activity.drizzle.store.ts:130`), y ese spec vive en `src/`, así que `init.sh` lo
ejecuta. Más `test/activity.e2e-spec.ts::R11`, intacto. Reemplazo equivalente y
mejor situado.

### 5. INFO — el anti-spam de R2/R23 solo se prueba de verdad en e2e

Los specs unitarios verifican el **texto SQL** de la migración
(`push-tokens.schema.spec.ts:115`) y la **cláusula WHERE** de `closeOpenAlert`
(`alerts-engine.drizzle.store.spec.ts:30`, con cliente pg falso). El comportamiento
observable que R2 exige —una fila `acked` hace fallar un `INSERT` duplicado con
`23505`— vive en `test/alerts-engine.e2e-spec.ts:229` y en
`test/alerts-center-notifier.e2e-spec.ts:447`, que `init.sh` **no ejecuta**.

El leader los corrió a mano y pasan, así que el comportamiento está verificado en
esta entrega. Se anota solo porque, tal como está el harness, una futura regresión
del anti-spam no la detectaría CI. Es el pendiente #1 de `current.md`, ajeno a #13.

### 6. INFO — corrección sobre el `DrizzleQueryError` de los e2e

La hipótesis de "carrera entre suites e2e" **queda descartada**:
`backend-pet-tracker/test/jest-e2e.json` fija `"maxWorkers": 1`, así que las suites
e2e corren en serie, nunca en paralelo.

El `DrizzleQueryError` con FK `pet_users_user_id_users_id_fk`
("Key (user_id)=… is not present in table users") lanzado desde `CreatePetUseCase`
apunta entonces a algo **dentro de una sola suite**: una promesa no esperada que
sobrevive al `afterAll` que limpia `users`, o un orden de limpieza que borra el
usuario antes de que termine una operación en vuelo. Ajeno a #13 (no toca
`CreatePetUseCase` ni `pet_users`) y no tumba ningún test. Para el pendiente #3 de
`current.md`.

### 7. TRIVIAL — el reporte del implementer dice "7 commits", la rama tiene 8

`progress/impl_alerts-center-notifier.md:11`. El octavo (`9adcf56`,
`docs(alerts-center-notifier): correct commit hash in traceability`) es posterior a
la redacción del reporte y solo corrige un hash en la tabla. Sin impacto.

---

## Contraste del reporte del implementer

Verificado contra el código real, no aceptado por escrito. Todo lo comprobable
resultó cierto:

| Afirmación del reporte | Verificado |
|---|---|
| "832 tests, 0 fallos" | Sí — `init.sh` del reviewer: 832 passed, 113 suites |
| "0 tests existentes reescritos para que pasen" | Sí, con el matiz del hallazgo #4 (una aserción de #10 que R28 dejaba imposible) |
| "e2e de #12 y #10 verdes **sin editar una línea**" | Sí — `git diff main -- test/` solo devuelve el e2e nuevo |
| "la migración contiene exactamente CREATE TABLE + FK/índice + DROP/CREATE INDEX" | Sí, leída línea a línea |
| "`notifier.module.ts` es el **único** sitio que lee `PUSH_ENABLED`" | Sí, y hay test que lo fija |
| "`redactToken()` único sitio donde un token se prepara para un log" | Sí (con la salvedad del hallazgo #1, que no pasa por `redactToken`) |
| Los 7 hashes y sus mensajes | Sí, existen y coinciden literalmente |

## Output de `./init.sh`

Ejecutado por el reviewer el 2026-08-07. Exit code **0**.

```
> backend-pet-tracker@0.0.1 build
> nest build && tsc-alias -p tsconfig.build.json

✅ Build exitoso

→ Ejecutando tests...

> backend-pet-tracker@0.0.1 test
> jest "--passWithNoTests"

[Nest] LOG [AlertsEngineSchedulerService] alerts-engine worker scheduled (consumer 60000 ms)
[Nest] LOG [ActivitySchedulerService] activity aggregator scheduled (tick 3600000 ms)
[Nest] ERROR [PositionsConsumerService] { scope: 'consumer', messageId: 'bad', message: 'malformed message body: [...]' }
[Nest] LOG [IngestionSchedulerService] ingestion workers scheduled (poller 60000 ms, consumer 15000 ms)
[Nest] LOG [NotifierSchedulerService] notifier worker scheduled (consumer 60000 ms)
[Nest] ERROR [PollerService] { scope: 'poller', message: 'cycle skipped, cannot resolve queue url: connect ECONNREFUSED 127.0.0.1:4566' }
[Nest] ERROR [AlertsEngineConsumerService] { scope: 'alerts-engine-consumer', messageId: 'bad', message: 'malformed message body: invalid JSON' }
[Nest] WARN [AggregateDailyActivityUseCase] { scope: 'activity-aggregator', petId: '018f5a3e-...', message: 'postgres unreachable' }

Test Suites: 113 passed, 113 total
Tests:       832 passed, 832 total
Snapshots:   0 total
Time:        7.039 s
Ran all test suites.
✅ Tests pasados

→ Lint...
> eslint "{src,apps,libs,test}/**/*.ts" --fix
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 12/18 completadas | 5 pendientes

  Próxima feature:
  [#14] health-vaccines (P2)
```

Los `ERROR`/`WARN` del output son **salida esperada de tests que ejercitan rutas de
fallo** (mensaje SQS malformado, SQS/Postgres inalcanzables): las 113 suites pasan.
El `[NotifierSchedulerService] notifier worker scheduled` es el test de R15
comprobando que **sí** agenda cuando `NOTIFIER_ENABLED=true`.
