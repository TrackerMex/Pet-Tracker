# review: alerts-engine
Fecha: 2026-08-07
Veredicto: APROBADO (alerts-engine, R1-R20 / C2-C7 / D1-D5 / anti-spam+idempotencia
/ pureza R19) — `./init.sh` verde, corrido por mí. Sin bloqueantes.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` en `feature_list.json` (confirmado con
      `node -e` sobre el array completo: únicamente `id:12 alerts-engine`).
- [x] `progress/current.md` describe la sesión activa (feature, plan,
      agentes lanzados). Observación menor no bloqueante: la línea
      `agentes lanzados: spec_author (spec_ready) → implementer (lanzado)`
      no refleja que el implementer ya cerró — mismo tipo de staleness
      menor que se observó y no bloqueó en el review de `geofences-crud`.

## Checklist C3 — Arquitectura
- [x] El worker vive en `src/workers/alerts-engine/**`, fuera de
      domain/application/infrastructure — mismo criterio ya documentado en
      `docs/architecture.md` ("Workers en el mismo proceso NestJS: cron +
      consumidores SQS") y mismo precedente que `src/workers/` existente
      (`positions-consumer.service.ts`, `IngestionStore`). No es una
      violación de capas: los workers de este proyecto nunca estuvieron
      sujetos a la subdivisión domain/application/infrastructure de
      `src/modules/<feature>/`.
- [x] `AlertsEngineStore` (interfaz + token `ALERTS_ENGINE_STORE`) definida
      junto al consumer, implementada por `AlertsEngineDrizzleStore` —
      mismo patrón de puerto/adaptador que `IngestionStore` (#8). El
      consumer depende de la interfaz (`@Inject(ALERTS_ENGINE_STORE)`), no
      de la clase Drizzle.
- [x] `GeofenceRepository` (#11) se deja intacto — confirmado: `git diff
      main --name-only -- backend-pet-tracker/src/modules/geofences/` sin
      salida. El worker lee/escribe `geofences`/`geofence_state`
      directamente desde `alerts-engine.drizzle.store.ts` (puerto propio),
      decisión D2 ya aprobada por humano, no una improvisación del
      implementer.
- [x] `PetRepository` (#5) se reutiliza solo por su contrato público
      (`findById`) vía `PET_REPOSITORY`, sin añadirle métodos — confirmado
      leyendo `alerts-engine-consumer.service.ts::notify()` y `git diff
      main --name-only -- backend-pet-tracker/src/modules/pets/` sin
      salida.
- [x] Sin lógica de negocio filtrada a infraestructura compartida:
      `aws/provisioning.ts` solo gana una función de aprovisionamiento
      (mecánica, sin reglas de negocio de alertas).

## Checklist C4 — TDD
- [x] R1-R19 tienen al menos un test que los nombra explícitamente —
      confirmado leyendo/grepeando `alerts.schema.spec.ts` (`R1`, `R2`
      x2), `provisioning.geofence-events.spec.ts` (`R3`, `R4`),
      `alerts-engine-consumer.service.spec.ts` (`R5`-`R16`, un `describe`
      por requisito), `alerts-engine-scheduler.service.spec.ts` (`R17`),
      `test/alerts-engine.e2e-spec.ts` (`R2`, `R18`, `R14`) y
      `geofence-eval-untouched.spec.ts` (`R19`).
- [x] R20 es una verificación de no-regresión por `git diff --name-only`,
      no un requisito ejercitable con `describe()` — mismo criterio ya
      aceptado para R26 de `geofences-crud`. `traceability.md` lo registra
      como "verificado con git diff..." (no como "pendiente").
- [x] Historial de commits no es un commit gigante: 4 commits `feat`/`test`
      con alcance por bloque de requisitos (`b4448ca`=R1-R2,
      `2ba4502`=R3-R4, `193ff9d`=R5-R17, `df1270f`=R18-R19) + 1 `docs` de
      cierre de trazabilidad — misma granularidad que el precedente ya
      aprobado de `geofences-crud`.

## Checklist C5 — Trazabilidad
- [x] `specs/alerts-engine/traceability.md` existe, 20 filas completas —
      **cero** filas con la palabra "pendiente" (leído el archivo íntegro).
- [x] Cada fila tiene test y commit/verificación registrados; los 4 hashes
      (`b4448ca`, `2ba4502`, `193ff9d`, `df1270f`) existen en `git log` y
      coinciden con lo que sus commits realmente tocan (verificado con
      `git show --stat`).
- [x] Commits siguen `feat(<scope>): <desc> (R-ids)` / `test(<scope>): ...
      (R-ids)`.

## Checklist C6 — Spec aprobada
- [x] `specs/alerts-engine/requirements.md` tiene `status: approved` en el
      frontmatter.
- [x] Casilla "Aprobado por humano" marcada `(fecha: 2026-08-07)`, con
      sección explícita "Confirmación de D1-D5" al final del archivo (las
      5 decisiones confirmadas una por una, ninguna cambió el texto de un
      requisito).
- [x] Ningún requisito tocado después de la aprobación sin re-gate:
      `git log --oneline -- specs/alerts-engine/requirements.md` devuelve
      un único commit (`ae21e51`, el mismo commit de aprobación que
      introduce el archivo completo ya con D1-D5 resueltos) — sin commits
      posteriores.

## Checklist C7 — Sin código huérfano
- [ ] N/A — esta feature no reemplaza ningún componente/módulo existente.
      Es worker net-new (`src/workers/alerts-engine/**`) + tabla nueva. La
      única reubicación (`EVENT_SOURCE`/`DETAIL_TYPE_POSITION_UPDATED`/
      `DETAIL_TYPE_BATTERY_LOW` de `workers/ingestion.constants.ts` a
      `aws/constants.ts`, D2) no deja código huérfano: verifiqué que su
      único importador (`positions-consumer.service.ts`) y el spec de ese
      importador (`positions-consumer.service.spec.ts`) actualizan el
      import en el mismo commit, sin quedar ninguna referencia rota
      (`pnpm exec tsc --noEmit` limpio lo confirma indirectamente).

## Verificación independiente de R1-R20/D1-D5 contra el código real

Leí completos y verifiqué contra el texto EARS/D-id: migración
`0007_narrow_whirlwind.sql`, `alerts.schema.ts`/`.spec.ts`,
`provisioning.ts` (diff completo) y su spec nuevo,
`alerts-engine-consumer.service.ts` completo,
`alerts-engine-consumer.service.spec.ts` completo (fue el archivo con más
peso de la revisión), `alerts-engine.drizzle.store.ts`,
`alerts-engine-store.ts`, `geofence-event-message.schema.ts`,
`alerts-engine-scheduler.service.ts`/`.spec.ts`, `alerts-engine.module.ts`,
`geofence-eval-untouched.spec.ts`, `test/alerts-engine.e2e-spec.ts` completo.

- **R1/D1 (migración)**: el SQL genera `alert_events` con exactamente las
  columnas de R1; FK `pet_id → pets.id ON DELETE cascade`, FK
  `geofence_id → geofences.id ON DELETE set null` (**D1-A confirmado
  literal en el SQL**, línea 16 de la migración); CHECK `type` reducido a
  `('geofence_exit','battery_low')`; CHECK `status` con las 3 del doc;
  índices btree en `pet_id`/`geofence_id`. No crea/altera ninguna otra
  tabla (confirmado también por `alerts.schema.spec.ts` inspeccionando el
  SQL por contenido, mismo patrón robusto que `devices.schema.spec.ts` —
  no depende de ser la última migración del directorio).
- **R2/D4 (índice anti-spam)**: `CREATE UNIQUE INDEX
  "alert_events_open_anti_spam_idx" ... USING btree
  ("pet_id","type",coalesce("geofence_id",
  '00000000-0000-0000-0000-000000000000'::uuid)) WHERE
  "alert_events"."status" = 'open'` — literal exacto de D4, sin
  `uuid_nil()`, confirmado en el SQL crudo y en `alerts.schema.spec.ts`.
  Ejercitado también contra Postgres real en
  `alerts-engine.e2e-spec.ts::R2` (INSERT/23505/INSERT tras cerrar).
- **R3/R4/D2 (infra)**: `provisionGeofenceEventsRoute()` reutiliza
  `ensureQueueWithDlq()` tal cual (cola+DLQ, DLQ primero, verificado por
  test de orden de creación); `PutRuleCommand`/`PutTargetsCommand` con el
  `EventPattern` exacto y un único target sin `InputTransformer`
  (verificado en `provisioning.geofence-events.spec.ts`, 8 tests, incluida
  idempotencia de correr dos veces). `provisionAllResources()` solo gana
  una línea; las 4 funciones existentes quedan con el cuerpo intacto
  (diff completo revisado, sin cambios de lógica, solo imports/comentario).
- **R5-R6 (recepción/despacho)**: `parseBody()` valida el sobre EventBridge
  y el detail específico con zod; JSON inválido o schema incumplido →
  `null` → sin delete (R5). `detail-type` desconocido → log + delete sin
  reintentar (R6, rama defensiva). Verificado en código y en
  `alerts-engine-consumer.service.spec.ts::R5/R6`.
- **R7 (guard de recencia)**: `evaluateGeofences()` calcula
  `previousUpdatedAtMs` y hace `continue` si `updatedAt !== null &&
  position.ts <= previousUpdatedAtMs` — coincide exactamente con "IF
  `position.ts` no es estrictamente mayor... (y `updatedAt` no es null)
  THEN... omitir por completo". 3 tests cubren omitir/no-omitir/updatedAt
  null.
- **R8/D3 (exit)**: `handleExit()` en el orden exacto de la spec: (1)
  `store.openAlert()` → (2) si `opened !== null`, `notify()` → (3)
  **siempre**, `store.updateGeofenceState()`. El test `INSERT exitoso`
  verifica el orden con `invocationCallOrder` (`openOrder <
  stateOrder`), no solo que ambas llamadas ocurrieron. El test `INSERT
  rechazado por anti-spam` confirma que sin notificación igual se
  persiste el estado — exactamente el mecanismo que D3 necesita para ser
  recuperable ante una caída a mitad de camino.
- **R9 (enter)**: `handleEnter()` en el orden de su propio texto EARS:
  `closeOpenAlert()` → `updateGeofenceState()` → notifica solo si
  `closed !== null`. Confirmado en código y en los 2 tests de R9.
- **R10 (event null)**: rama `else` del bucle solo llama
  `updateGeofenceState()`, sin tocar `alert_events` ni notificar —
  confirmado en código y 2 tests (unknown inicial, inside→inside).
- **R11 (cierre battery_low en position.updated)**: `evaluateBatteryRecovery()`
  usa `BATTERY_RECOVERY_THRESHOLD_PCT` (30, importado de
  `pipeline/constants.ts`), corre independiente del bucle de geocercas
  (se invoca aparte en `handleMessage()`), `closeOpenAlert` con
  `geofenceId: null`. 4 tests cubren cierre, independencia del bucle,
  `<30` y ausente.
- **R12 (apertura battery_low)**: `openBatteryLowAlert()` usa el reloj
  inyectado (`now`, param de `drainOnce`), nunca `Date.now()` directo —
  confirmado por lectura del archivo completo (cero `Date.now()`/`new
  Date()` sin argumento fuera de la firma pública). 2 tests (éxito,
  rechazo anti-spam).
- **R13 (exit/exit/enter)**: test único pero completo — dos `openAlert`
  mockeados en secuencia (`{id:'alert-1'}`, luego `null`, simulando el
  comportamiento real del índice único ante una segunda fila) + un
  `closeOpenAlert`. Aserciones: `openAlert` llamado 2 veces,
  `closeOpenAlert` 1 vez, exactamente 1 mensaje `kind:'alert'` y 1
  `kind:'alert_resolved'` en `notifications`. Coincide con el criterio de
  aceptación literal.
- **R14 (idempotencia/redelivery) — ver hallazgo abajo, no bloqueante**:
  test unitario y e2e existen y pasan, pero ambos ejercitan el camino
  "geofence_state ya avanzó → el guard de R7 omite por completo", no el
  caso borde textual de R14 ("el worker se cayó después de escribir
  `alert_events` pero antes de borrar el mensaje" — con `geofence_state`
  **sin avanzar todavía**). Ver detalle en "Hallazgos" más abajo.
- **R15 (shape del mensaje)**: `notify()` arma exactamente
  `{version:1, kind, alertId, petId, title, body, data:{petId, alertId}}`
  — confirmado en código y en los 3 tests de R15 (incluida la cola
  destino correcta).
- **R16 (error no controlado)**: `consumeMessage()` envuelve
  `handleMessage()` + `DeleteMessageCommand` en un único try/catch; el
  catch solo loguea, no relanza — el mensaje fallido queda sin borrar,
  los demás del lote se procesan en iteraciones de `for` independientes.
  Confirmado en código y en el test de R16 (un fallo no envenena el
  resto del lote).
- **R17 (scheduler gateado)**: `shouldSchedule()` exige
  `ALERTS_ENGINE_ENABLED === 'true' && NODE_ENV !== 'test'` — 5 tests
  cubren cada combinación relevante más el tick real con fake timers.
- **R18 (e2e ≤2 ciclos)**: `test/alerts-engine.e2e-spec.ts` corre 2 ciclos
  reales de poller→ingestion-consumer→alerts-consumer con reloj inyectado
  (sin `setTimeout` de espera real), confirma 0 filas open tras ciclo 1
  (unknown→inside silencioso, R10 en vivo), 1 fila open + `geofence_state
  = outside` tras ciclo 2, y DLQ de `geofence-events` en 0 (mensaje
  procesado, no descartado por malformado). Corrí esta suite yo mismo dos
  veces, 3/3 verde ambas veces, sin flakiness.
- **R19 (pureza)**: verificado por **dos vías independientes**, ambas en
  verde: (a) `git diff main HEAD -- backend-pet-tracker/src/pipeline/
  geofence-eval.ts` y `.spec.ts` — **ambos vacíos**, corrido por mí
  directamente; (b) `geofence-eval-untouched.spec.ts` compara sha256 de
  ambos archivos contra un hash congelado y verifica valor exacto de los
  6 exports preexistentes de `constants.ts` más el único añadido
  (`BATTERY_RECOVERY_THRESHOLD_PCT = 30`). `pipeline/constants.ts` diff
  (corrido por mí) confirma **solo líneas `+`, cero `-`**.
- **R20 (no regresión, lista cerrada)**: `git diff main HEAD --name-only`
  coincide con la lista permitida más los 3 archivos declarados por el
  implementer — los tres verificados por mí de forma independiente (ver
  sección siguiente). `git diff main HEAD -- backend-pet-tracker/
  package.json` — **vacío**, corrido por mí: cero dependencias nuevas.
- **D5**: `version: 1` presente en el mensaje — confirmado.

## Verificación de los 3 archivos fuera de la lista literal de R20

Diff/lectura completa corrida por mí, no aceptada del reporte:

1. **`positions-consumer.service.spec.ts`**: `git diff main HEAD` muestra
   únicamente el bloque de import moviéndose de `./ingestion.constants` a
   `@/aws/constants` (mismas 4 constantes, mismo orden de valores en el
   resto del archivo). Cero cambios de aserciones. Justificado: sin este
   fix el spec no compila tras la reubicación D2 de esas constantes.
2. **`provisioning.geofence-events.spec.ts`**: archivo nuevo, prueba
   `provisionGeofenceEventsRoute()` — la única función que R20 sí autoriza
   añadir a `provisioning.ts`. 8 tests, sin lógica de negocio de alertas,
   mismo patrón que `provisioning.sqs.spec.ts` ya existente.
3. **`geofence-eval-untouched.spec.ts`**: archivo nuevo, es el test que
   `tasks.md` pide explícitamente para R19 (verificación estática por
   hash). Vive en `src/pipeline/` porque es lo que verifica, no contiene
   lógica de negocio de alerts-engine.

Confirmado: ningún otro archivo fuera de la lista de R20 aparece en
`git diff main HEAD --name-only`. Los tres son mecánicos, tal como
declara el implementer.

## Verificación independiente de `test/media.e2e-spec.ts` (no aceptada del reporte)

Corrí `pnpm run test:e2e -- media` **dos veces en aislamiento**, sin que la
suite de alerts-engine corriera en absoluto:

- Ambas corridas: `1 failed, 10 passed, 11 total`, mismo test exacto —
  `R8: el bucket nunca es publico... › un GET sin parametros de firma...`,
  `Expected: 403, Received: 200`, misma línea (`media.e2e-spec.ts:317`).
- `git diff main HEAD --name-only -- backend-pet-tracker/src/modules/media/`
  — **vacío**: esta rama no toca ese módulo.
- Confirmé en `STATUS.md` (líneas 295-301) que esta es la limitación ya
  documentada y aceptada humanamente en el cierre de `pet-photos-s3` (#6):
  LocalStack Community 4.14 no aplica ACL/bucket-policy en el plano de
  datos de S3 (`GET` anónimo responde 200 en vez de 403 aunque la config
  sí persiste). Mismo fallo, mismo síntoma, ya visto también en el review
  de `geofences-crud`.
- Conclusión: la explicación del implementer es correcta — fallo
  preexistente, determinista (no intermitente: falla igual las 2 veces),
  ajeno a `alerts-engine`.

## Hallazgos

### 1. R14: los tests etiquetados "R14" no ejercitan el caso borde que su propio texto/comentario describe (no bloqueante)

`alerts-engine-consumer.service.spec.ts::R14` (línea 876) y
`test/alerts-engine.e2e-spec.ts::R14` (línea 374) — ambos pasan, pero
ambos preparan el escenario con `geofence_state.updatedAt` **ya avanzado**
al valor del evento redelivered, de modo que lo que realmente disparan es
el guard de R7 ("omite la geocerca por completo"), confirmado por el
propio comentario del test unitario (línea 878: *"geofence_state ya
avanzo"*) y por la aserción del e2e (línea 442-443: *"R7: el guard...
omite la geocerca por completo"*).

El caso borde que R14 nombra explícitamente —"el worker se haya caído
**después de escribir en `alert_events` pero antes de borrar el mensaje**"
(es decir, con `geofence_state` **todavía sin avanzar**, ya que D3 fija
que `alert_events` se escribe antes)— recorre una rama de código distinta:
el guard de R7 NO dispara (el `updatedAt` persistido sigue siendo el
anterior), `evaluate()` se vuelve a ejecutar, `openAlert()` reintenta el
`INSERT` y choca con `23505` (índice de R2), retorna `null`, no notifica
de nuevo, pero **completa** el `updateGeofenceState()` pendiente. El
comentario del e2e (línea 398-400) dice explícitamente que simula ese
escenario, pero mecánicamente no lo hace: el ciclo 2 previo ya corrió
`drainOnce()` hasta el final, incluida la persistencia del estado, antes
de que el mensaje duplicado se reenvíe.

Ese camino específico sí está cubierto — pero indirectamente, bajo el
`describe` de **R8**, no el de R14: el test `INSERT rechazado por
anti-spam (openAlert -> null): no notifica, pero igual persiste
geofence_state` (línea 565) reproduce exactamente el resultado de un
`openAlert()` rechazado por `23505`, y el test `INSERT exitoso` de ese
mismo bloque (línea 556-558) verifica con `invocationCallOrder` que
`openAlert` ocurre antes que `updateGeofenceState` — que es precisamente
la propiedad que D3 necesita para que ese escenario sea recuperable.

Verifiqué el código manualmente contra ambos escenarios y el
comportamiento real **es correcto** — no es un defecto funcional, es una
imprecisión de dónde/cómo está etiquetada la cobertura: el test que un
lector esperaría encontrar bajo "R14" para el caso borde que su propio
texto EARS describe, en realidad vive bajo "R8" con un mock directo, no
como una redelivery real de dos mensajes. No rechazo por esto — el
mecanismo está probado, solo no está probado *donde su nombre lo promete*.
Recomendación no bloqueante: mover o añadir en el `describe('R14: ...')`
un test que redelivere de verdad un mensaje **antes** de que
`updateGeofenceState` se complete (ej. mockeando `updateGeofenceState`
para que falle en el primer intento y verificando la segunda pasada), o
al menos corregir el comentario del e2e para no afirmar que cubre ese
escenario cuando cubre el otro.

### 2. Flakiness adicional de la suite e2e completa, no mencionada por el implementer (no bloqueante, ajena a esta feature)

Corrí `pnpm run test:e2e` (las 11 suites) dos veces:
- 1ª corrida: **falla una suite distinta a `media`** —
  `pets.e2e-spec.ts` (u otra suite de creación de mascotas) con
  `insert or update on table "pet_users" violates foreign key constraint
  "pet_users_user_id_users_id_fk"` (`23503`, usuario no encontrado en
  `users`). `Tests: 1 failed, 144 passed, 145 total`.
- 2ª corrida: solo falla `media.e2e-spec.ts::R8` (el ya documentado
  arriba). `Tests: 1 failed, 144 passed, 145 total`.

`test/jest-e2e.json` tiene `"maxWorkers": 1` (suites corren en serie, no en
paralelo), así que no es una carrera de workers concurrentes — parece un
problema de orden/limpieza entre suites preexistentes que comparten el
mismo Postgres. No até esto a `alerts-engine`:
`src/modules/pets/**`/`src/modules/users/**` no aparecen en el diff de
esta rama (confirmado arriba), y `alerts-engine.e2e-spec.ts` en
aislamiento fue 3/3 verde en mis dos corridas independientes. Lo reporto
por transparencia — no lo investigué a fondo por estar fuera del alcance
de esta feature — recomiendo que el leader lo trackee como un ticket de
harness separado (mismo espíritu que el bloqueante de `activity.drizzle.
store.spec.ts` que sí bloqueó el cierre de `geofences-crud`; este no
bloquea porque no reproduce en la suite de esta feature ni toca sus
archivos).

## Output de `./init.sh` (corrido por mí, no aceptado del reporte)

```
══════════════════════════════════════════
  INIT — pet-tracker (Harness SDD)
══════════════════════════════════════════

✅ node disponible / ✅ pnpm disponible
✅ .env encontrado / ✅ DATABASE_URL definida
✅ Dependencias instaladas
✅ Archivos del harness presentes
⚠️  Feature en progreso: alerts-engine
✅ STATUS.md sincronizado con feature_list.json

→ Build...
✅ Build exitoso

→ Ejecutando tests...
Test Suites: 97 passed, 97 total
Tests:       699 passed, 699 total
✅ Tests pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
```

`test/alerts-engine.e2e-spec.ts` en aislamiento (corrido por mí):
`Test Suites: 1 passed, 1 total` / `Tests: 3 passed, 3 total`.

## Conclusión

`alerts-engine` (R1-R20, D1-D5, C2-C7) está **aprobado**: código,
migración, tests y trazabilidad verificados de forma independiente línea
por línea contra el texto EARS, no solo leídos del reporte del
implementer. `./init.sh` corrido por mí queda **completamente verde**
(699/699 unitarios, build/lint/typecheck limpios) — sin el bloqueante que
tuvo `geofences-crud`. Los 3 archivos fuera de la lista literal de R20 son
mecánicos, confirmados uno por uno. La explicación de flakiness de
`media.e2e-spec.ts` es correcta y verificada de forma independiente
(2 corridas en aislamiento, mismo fallo determinista, diff vacío en ese
módulo). D1 (`ON DELETE SET NULL`) y D3 (orden `alert_events` antes que
`geofence_state`) están confirmados con evidencia de código directa,
incluida una aserción de orden de invocación explícita. Único hallazgo no
bloqueante: los tests etiquetados "R14" prueban el camino del guard de R7
en vez del caso borde de caída-a-mitad-de-camino que su propio texto
describe — el mecanismo real sí está probado, pero bajo el describe de R8;
recomiendo al leader pedir al implementer una corrección menor (mover/
añadir un test bajo R14 o corregir el comentario del e2e) como seguimiento,
sin que esto bloquee el cierre de la feature.
