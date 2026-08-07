# impl: alerts-center-notifier
Fecha: 2026-08-07
Branch: `feature/13-alerts-center-notifier`
Spec: `specs/alerts-center-notifier/` (aprobada por humano el 2026-08-07, D1-D6 confirmadas)

## Resumen

Los 30 requisitos implementados con TDD requisito por requisito (test rojo que
nombra el R-id → verde → refactor), en 7 commits que siguen el orden de
`tasks.md`. `traceability.md` no tiene ninguna fila "pendiente".

- Suite unitaria: **699 → 832** tests, 0 fallos, 0 tests existentes reescritos
  para que pasen.
- e2e nuevo: `test/alerts-center-notifier.e2e-spec.ts`, **20/20 verde** contra
  Postgres + LocalStack reales.
- e2e de #12 (`alerts-engine`) y #10 (`activity`): **30/30 verde sin editar
  ni una línea de sus tests** — es la verificación de que D1 y D4 no rompen
  nada.

## Archivos creados

### Persistencia (R1, R2)
- `backend-pet-tracker/src/db/schema/push-tokens.schema.ts` — tabla
  `push_tokens`: `expo_token` UNIQUE global (habilita el upsert idempotente y
  la reasignación de D5-iv), CHECK `platform in ('ios','android')`.
- `backend-pet-tracker/src/db/migrations/0008_stormy_moira_mactaggert.sql` +
  `meta/` — generada con `pnpm run db:generate`. Contiene exactamente:
  `CREATE TABLE push_tokens`, su FK/índice, y el par
  `DROP INDEX alert_events_open_anti_spam_idx` /
  `CREATE UNIQUE INDEX ... WHERE "alert_events"."status" <> 'closed'`.
- `src/db/schema/push-tokens.schema.spec.ts` — R1 y R2. R2 vive aquí y no en
  `alerts.schema.spec.ts` (de #12) porque describe la **misma migración 0008**
  y así el spec de #12 no se toca.

### Push tokens HTTP (R3-R6)
- `src/modules/users/domain/repositories/push-token.repository.ts` — puerto
  único de `push_tokens`, compartido por los endpoints y el notifier.
- `src/modules/users/application/dto/register-push-token.dto.ts` — schemas zod
  (`z.strictObject`, regex `^Expo(nent)?PushToken\[[^\]]+\]$`).
- `src/modules/users/application/use-cases/register-push-token.use-case.ts`,
  `delete-push-token.use-case.ts`
- `src/modules/users/infrastructure/repositories/push-token.drizzle.repository.ts`
- `src/modules/users/infrastructure/mappers/push-token-response.mapper.ts` —
  omite `expoToken` y `userId` del body (R13).
- Specs: `push-token.dto.spec.ts`, `push-token.use-cases.spec.ts`,
  `users.controller.spec.ts`.

### Worker notifier (R7-R15)
- `src/workers/notifier/notifier.constants.ts` — intervalo, batch,
  `redactToken()` (único sitio donde un token se prepara para un log).
- `src/workers/notifier/notification-message.schema.ts` — contrato v1 congelado
  de #12.
- `src/workers/notifier/push-sender.ts` — puerto `PushSender` + `PUSH_SENDER`.
- `src/workers/notifier/console-push-sender.ts` — R9/R13.
- `src/workers/notifier/expo-push-sender.ts` — R11/R12.
- `src/workers/notifier/notifier-consumer.service.ts` — R7, R8, R10, R12, R14.
- `src/workers/notifier/notifier-scheduler.service.ts` — R15.
- `src/workers/notifier/notifier.module.ts` — **único** sitio que lee
  `PUSH_ENABLED`.
- Specs: `notifier-consumer.service.spec.ts`, `console-push-sender.spec.ts`,
  `expo-push-sender.spec.ts`, `notifier-scheduler.service.spec.ts`,
  `notifier-env.spec.ts`.

### Centro de alertas (R16-R22)
- `src/modules/alerts/` completo: `alerts.constants.ts`, `domain/cursor.ts`,
  `domain/entities/alert-event.entity.ts`, `domain/errors/alert.errors.ts`,
  `domain/repositories/alert.repository.ts`,
  `application/dto/list-alerts.dto.ts`,
  `application/use-cases/{list-alerts,ack-alert}.use-case.ts`,
  `infrastructure/repositories/alert.drizzle.repository.ts`,
  `infrastructure/mappers/{alert-response,alert-error}.mapper.ts`,
  `infrastructure/alerts.controller.ts`, `alerts.module.ts`.
- Specs: `list-alerts.use-case.spec.ts`, `ack-alert.use-case.spec.ts`,
  `list-alerts.dto.spec.ts`, `cursor.spec.ts`.

### time_away_minutes (R24-R28)
- `src/pipeline/time-away.ts` — `computeTimeAwayMinutes(spans, range)`, función
  pura, con el JSDoc que documenta la aproximación del evento abierto (exigido
  por el plan 007).
- Specs: `src/pipeline/time-away.spec.ts`,
  `src/modules/activity/application/use-cases/aggregate-time-away.spec.ts`,
  `src/modules/activity/infrastructure/repositories/activity-time-away.drizzle.spec.ts`.

### R23 y e2e
- `src/workers/alerts-engine/alerts-engine.drizzle.store.spec.ts` — **nuevo
  spec de #13 sobre un archivo de #12** (ver §Desviaciones).
- `backend-pet-tracker/test/alerts-center-notifier.e2e-spec.ts`.

## Archivos modificados

- `src/db/schema/alerts.schema.ts` — el `.where()` del índice anti-spam pasa a
  `<> 'closed'` (D1) y se corrige el comentario que decía "un `open` por
  (pet_id, type, geofence_id)", que ya era falso.
- `src/db/schema/index.ts` — una línea de re-export.
- `src/workers/alerts-engine/alerts-engine.drizzle.store.ts` — **una** condición:
  `eq(status,'open')` → `inArray(status, ['open','acked'])` (D1). Firma, nombre
  y contrato de retorno intactos.
- `src/workers/alerts-engine/alerts-engine-store.ts` — solo el JSDoc de
  `closeOpenAlert()`, para que no mienta.
- `src/modules/users/infrastructure/users.controller.ts` — +2 rutas.
  `GET`/`PATCH /v1/me` sin tocar.
- `src/modules/users/users.module.ts` — providers + `exports:
  [PUSH_TOKEN_REPOSITORY]` para que `NotifierModule` lo inyecte.
- `src/modules/activity/domain/entities/daily-activity.entity.ts` —
  `DailyActivityUpsert` gana `timeAwayMinutes?: number | null`.
- `src/modules/activity/domain/repositories/activity-store.ts` — método
  `findAwaySpans()`.
- `src/modules/activity/infrastructure/repositories/activity.drizzle.store.ts` —
  `findAwaySpans()` + el `coalesce` del `onConflictDoUpdate`.
- `src/modules/activity/application/use-cases/aggregate-daily-activity.use-case.ts`
  — 5 líneas: una lectura más por mascota dentro del `try/catch` que ya existía.
- `src/app.module.ts` — dos líneas (`AlertsModule`, `NotifierModule`).
- `backend-pet-tracker/package.json` — **una** dependencia: `expo-server-sdk`.
- `docs/conventions.md` + `.env.example` — `NOTIFIER_ENABLED` y `PUSH_ENABLED`
  (R29, mismo cierre).
- Tres specs de #10 (ver §Desviaciones).

## Requisitos cubiertos

Ver `specs/alerts-center-notifier/traceability.md` — 30/30 filas con test y
commit, ninguna "pendiente".

| Commit | R-ids |
|---|---|
| `7652ff0` | R1, R2 |
| `dea4631` | R3, R4, R5, R6 |
| `4cb2578` | R7-R15 |
| `76be277` | R16-R22 |
| `0e5cc3c` | R23 |
| `cd3e9c2` | R24-R28 |
| final | R29, R30 |

## Decisiones dentro del margen de la spec

1. **`expo-server-sdk` se carga con `import()` dinámico, no estático.** No es
   preferencia: la versión 7.0.0 es **ESM-only** (`"type": "module"`) y un
   `import { Expo } from 'expo-server-sdk'` estático **rompe jest**, que corre
   en CommonJS (comprobado con una prueba desechable antes de decidir). La
   solución: solo tipos en el import de nivel de módulo (se borran al compilar)
   y `await import('expo-server-sdk')` dentro de `resolveClient()`, que solo se
   invoca al enviar de verdad. Verificado que `tsc` **no** la degrada a
   `require` en el build (`dist/src/workers/notifier/expo-push-sender.js:58`
   conserva el `await import(...)`), así que `PUSH_ENABLED=true` funciona en
   Node 24. En local, con `PUSH_ENABLED=false`, el paquete no se carga nunca.

2. **`PushSendInput` lleva `messageId`.** El sketch de `design.md` no lo tenía,
   pero R9 exige que el log sea `{scope, messageId, wouldSend}` y quien emite
   ese log es `ConsolePushSender`. La alternativa era emitir el log desde el
   consumer con un `if (pushEnabled)`, que es exactamente lo que `design.md`
   prohíbe. `messageId` es un id de correlación de logs, nada más.

3. **`ExpoPushClient` como costura para el doble del SDK (R11).**
   `Expo.isExpoPushToken` es un método **estático**: sin una costura no hay
   forma de probar R11/R12 con un doble, que es lo que D2 exige. Es la única
   abstracción nueva de la feature y la pide un requisito.

4. **`wouldSend.to` es UN token redactado (el primero) + `recipients` con el
   conteo.** Lectura literal de R9, que enumera las dos claves por separado.

5. **`notificationMessageSchema` usa `z.object`, no `z.strictObject`.** R4 y
   R17 piden `strictObject` explícitamente; R7 no. La asimetría es deliberada:
   allí el input es de un cliente, aquí de otro worker del mismo repo, y una
   clave extra añadida por #12 no debe mandar la cola entera a la DLQ.
   `version: z.literal(1)` ya cierra la puerta a un contrato incompatible.

6. **Si el SDK de Expo lanza, `ExpoPushSender` propaga.** Escribí primero un
   test que lo tragaba y lo **borré** al releer R14, que menciona literalmente
   "el SDK de Expo lanza" como caso que **no** debe borrar el mensaje.
   Tragárselo habría perdido la notificación en silencio.

7. **`AckAlertUseCase` trata la carrera `open → closed` entre el SELECT y el
   UPDATE como 409.** No está en R21, pero es el mismo resultado observable que
   si la alerta hubiera llegado ya cerrada, y `ack()` devolviendo `null` no
   podía quedar sin rama.

8. **Los stores Drizzle nuevos se testean capturando el SQL con un cliente `pg`
   falso** (`drizzle(client)`), en vez de reimplementar el `where` en el test.
   Ejercita el constructor de consultas real; el comportamiento va al e2e.

## Desviaciones de la lista de R30 (todas de test, ninguna funcional)

R30 fija la lista de archivos tocables. Estas cuatro entradas no están
literalmente en ella y el reviewer debe validarlas:

1. **`src/workers/alerts-engine/alerts-engine.drizzle.store.spec.ts` (nuevo).**
   R30 permite editar `alerts-engine.drizzle.store.ts` pero no nombra un spec
   junto a él. Es la convención del repo (`<archivo>.spec.ts` junto al archivo)
   y es el único test de R23 que corre en `init.sh` — el e2e no. No modifica
   ningún test de #12.
2. **`aggregate-daily-activity.use-case.spec.ts` (de #10, dentro de
   `src/modules/activity/**`, que R30 sí permite).** Dos cambios mínimos:
   (a) su `fakeStore` gana `findAwaySpans: () => Promise.resolve(null)` para
   seguir compilando contra el puerto ampliado;
   (b) en el test de R14 "un dia sin posiciones escribe fila de ceros", el
   objeto esperado gana `timeAwayMinutes: null` y **desaparecen** las dos líneas
   `expect(Object.keys(...)).not.toContain('timeAwayMinutes')`.
   **Esa aserción y R28 de #13 son directamente incompatibles**: R28 ordena que
   el payload lleve la clave. No es "el test de R11 de #10" — ese vive en
   `test/activity.e2e-spec.ts::R11` y **sigue verde sin tocarlo**, como exigía
   la instrucción. Lo que R14 verifica (que un día sin posiciones escribe fila
   de ceros) no cambia.
3. **`get-daily-activity.use-case.spec.ts` y `list-trips.use-case.spec.ts` (de
   #10).** Una línea cada uno: `findAwaySpans` en su fake de `ActivityStore`.
   Sin ella `tsc --noEmit` falla (no jest, que no tipa esos literales). Ninguna
   aserción cambia.
4. **`test/alerts-center-notifier.e2e-spec.ts`** sí está en la lista de R30.

## Deuda marcada con `ponytail:`

- `src/workers/notifier/notifier-consumer.service.ts` — `ponytail: cuarta copia
  de resolveQueueUrl — upgrade path: extraer a src/aws/ cuando alguien toque
  los cuatro workers por otro motivo`. Es la decisión que `design.md` ya había
  tomado: no refactorizar código de tres specs cerradas sin que ninguna lo pida.
- La limitación de los *receipts* diferidos de Expo ya está declarada con su
  `ponytail:` en `requirements.md` §Fuera de alcance; R12 actúa solo sobre los
  tickets de respuesta inmediata.

## Donde la spec resultó ambigua o incorrecta

1. **R28 vs. una aserción de #10 (lo más importante de esta sección).** La spec
   dice "el test de R11 de #10 debe seguir pasando sin editarlo" y eso se
   cumple. Pero R11 de #10 dejó además una aserción **incidental** dentro del
   test de R14 (`not.toContain('timeAwayMinutes')`) que R28 vuelve falsa por
   diseño. La spec no lo anticipó. Resuelto como está descrito arriba; queda
   señalado porque es el único punto donde #13 edita un test de una feature
   cerrada.
2. **`design.md` sitúa `PushSender.send()` sin `messageId`, pero R9 exige
   `messageId` en el log del adaptador de consola.** Contradicción menor entre
   diseño y requisito; ganó el requisito (ver decisión 2).
3. **`design.md` da por hecho que `expo-server-sdk` se puede importar como
   cualquier otra dependencia.** No: es ESM-only y el repo compila a CJS. La
   spec no podía saberlo porque la dependencia no estaba instalada al
   escribirla.
4. **R9 no dice qué token va en `wouldSend.to` cuando hay N destinatarios.**
   Interpretado literalmente (uno redactado + `recipients`).

## Output de build

```
> backend-pet-tracker@0.0.1 build
> nest build && tsc-alias -p tsconfig.build.json
(sin errores)
```

## Output de tests

Ver la sección "Output de init.sh" al final del reporte; el resumen es:

```
Test Suites: 113 passed, 113 total
Tests:       832 passed, 832 total
```

e2e (no lo corre `init.sh`; ejecutado a mano contra Postgres + LocalStack):

```
test/alerts-center-notifier.e2e-spec.ts   20 passed
test/activity.e2e-spec.ts + test/alerts-engine.e2e-spec.ts   30 passed
```

## Verificación de R30

```
$ git diff main -- backend-pet-tracker/package.json
+    "expo-server-sdk": "^7.0.0",
```

Una sola dependencia nueva. `git diff main --name-only` confirma que **no** se
tocó ninguno de los prohibidos: `src/aws/**`, `src/pipeline/geofence-eval.ts`,
`src/pipeline/activity.ts`, `src/pipeline/local-day.ts`,
`src/modules/geofences/**`, `src/modules/positions/**`, `src/workers/ingestion*`.
Una sola migración nueva (`0008_*`).

## Notas para el reviewer

1. **El fallo pre-existente de `media.e2e-spec.ts` R8 no es de esta feature.**
   Un GET sin firma al objeto de LocalStack devuelve 200 en vez de 403.
   Verificado en un worktree limpio de `main` (66fd9e5, sin ninguno de mis
   cambios): **falla idéntico**. Es estado del contenedor LocalStack, no una
   regresión; `pnpm run provision:local` no lo arregla. Candidato a tarea
   propia.
2. **Mirar con lupa la §Desviaciones punto 2** — es el único sitio donde toco
   un test de una feature cerrada, y quiero que alguien confirme que la lectura
   de "el test de R11 de #10" (el e2e, no la aserción incidental de R14) es
   correcta.
3. **`expo-push-sender.ts` nunca se ejercita contra la red**, y su `import()`
   dinámico es la única forma de que jest y el build CJS convivan con un
   paquete ESM-only. Si alguien lo "arregla" a un import estático, la suite
   entera deja de arrancar.
4. **La migración 0008 ya está aplicada** en la Postgres local
   (`pnpm exec drizzle-kit migrate` con `DATABASE_URL`); no hay script
   `db:migrate` en `package.json` (deuda anotada en `STATUS.md` desde antes).
