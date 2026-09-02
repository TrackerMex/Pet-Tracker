# pet-tracker — Status

**Última actualización**: 2026-08-29
**Features completadas**: 51/57 (`feature_list.json`)
**En progreso**: #54 `android-map-never-ready` (spec aprobada 2026-08-28, en manos de Codex CLI)

**Pendientes**: 4 (#18, #41, #42, #53). #54 migra el tab Map de `react-native-maps` a `expo-maps`: el discriminador en dispositivo (`progress/discriminador_android-map-never-ready.md`) probó que el mapa solo pinta el watermark porque su `SurfaceView` no se compone bajo Fabric, no por la clave ni por el ciclo de vida. Su R8 es un smoke humano en dev build de Android que exige tiles + marker + polyline en ambos temas. Fuente del diseño Figma versionada en
`specs/mobile-figma-polish/design-src/`.
**En producción**: no
**Infra AWS real**: la stack `PetTrackerDev` está **desplegada** en `us-east-1`
desde 2026-08-10. Hay recursos vivos en la cuenta, aunque hoy sin coste.

---

## Qué es este proyecto

Backend de Pet Tracker (brief completo en `docs/brief.md`): plataforma de
cuidado de mascotas con 3 pilares — (1) localización y actividad vía collar
GPS (Wialon, con simulador `SIM_MODE` mientras no hay hardware), (2) salud
(vacunas con catálogo, peso, recordatorios), (3) alimentación (motor
calórico determinístico + explicación IA opcional). Multi-usuario con
permisos por mascota (`pet_users`), geocercas con alertas anti-spam y push.
Desde 2026-08-19 el repo es un monorepo: la app móvil (Expo, package
manager bun) vive en `mobile-pet-tracker/` como carpeta isla — sin workspace
raíz, backend sigue con pnpm — y sus features entran en `feature_list.json`
con la convención de nombre `mobile-*` (la primera es #31
`mobile-app-scaffold`).

---

## Cómo arrancar

```bash
docker compose up -d   # Postgres + LocalStack (solo si la sesión toca DB/AWS)
./init.sh
```

`init.sh` copia `.env.example` → `.env` si falta. Docker no arranca solo:
levántalo manualmente cuando la feature lo necesite.

Desde `init-env-drift-warning` (#23), `init.sh` compara además las **claves**
de `.env` contra las de `.env.example` y avisa de las que faltan, destacando
aparte los gates `*_ENABLED` porque son los que apagan features enteras en
silencio. Solo avisa: nunca modifica `.env` ni aborta. Si ves ese warning,
copia a mano las claves que necesites — es la deriva que costó las sesiones de
#16 y #24.

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

- **`auth-forgot-password` (#44) done** (2026-08-28): endpoints públicos de
  solicitud/reset con respuesta uniforme, token opaco SHA-256 de un solo uso
  y TTL de una hora, invalidación de hermanos, Argon2, auditoría y entrega por
  log estructurado detrás del puerto `PasswordResetSender`. Implementación
  R1–R13 con commit rojo anterior a cada verde y trazabilidad completa. Gate
  final: backend 156 suites/1198 tests, infra 2/14, móvil 50/561 y e2e backend
  23 suites/349 tests; lint/typecheck verdes. Sin cambios mobile/infra/env ni
  deploy AWS. Informe: `progress/impl_auth-forgot-password.md`.

- **`mobile-pets-profile` (#40) done** (2026-08-25): Profile reescrito según
  Figma (screens/ + route delgado), users/me real, AddPet, foto vía URL
  presignada, Docs contra contrato #49, blobatar determinista, tema
  persistente. Saga de selección resuelta con hook compartido
  `use-pet-selection` (guard useIsFocused+isRefreshing). Review final
  aprobado; smoke humano R10 completo (fde2648). Docs smoke real bloqueado
  hasta #49 `media-docs-api`. PR pendiente de merge.

- **`mobile-tab-glass` (#50) in_progress** (2026-08-25): barra flotante con
  Liquid Glass en iOS compatible y fallback BlurView temático, indicador pill
  con spring interruptible y reduced motion del sistema, y crossfade de
  escenas. Codex implementó R1–R6 con commits test-rojo→verde separados y
  conservó la regresión R7; trazabilidad completa y C8 grep-clean. Suite móvil
  39/39 (458 tests) y `./init.sh` exit 0. Pendiente de review independiente;
  no se abrió PR. Informe: `progress/impl_mobile-tab-glass.md`.

- **`mobile-design-drift` (#48) done** (2026-08-24): implementación
  R1-R8 completa con TDD rojo→verde por requisito. Añade tokens dedicados
  `rounded-card`/`text-2xs`, un `Card` compartido adoptado por las siete tabs,
  safe areas uniformes y skeletons dimensionados. Greps de drift limpios;
  suite móvil 34/34 (379 tests) y `./init.sh` verde. El reviewer aprobó la
  implementación (`53d4dd7`) y el cambio se integró mediante el PR #72.
  Informe: `progress/impl_mobile-design-drift.md`.

- **`mobile-map-live` (#36) done** (2026-08-22): tab Map fullscreen —
  `src/api/positions.ts` (last + history) y `trips.ts` (`getDayRoute` compone
  lista + detalles porque la lista no trae `path`), MapView/Marker/Polylines
  con **react-native-maps 1.27.2** (única dep nueva, pin SDK 57, corre en
  Expo Go; expo-maps descartado por alpha/no-Go), stats
  speed/distance/lastUpdate/GPS, polling 15 s con `useFocusEffect` que para
  sin foco (cleanup verificado por el reviewer), mascota free (402) sin mapa
  ni polling, botón Lost Mode stub deshabilitado — backend sin endpoint,
  **#45 `pet-lost-mode` al backlog**. Sin react-query (umbral de adopción
  documentado en design §D2). Codex R1-R12 TDD rojo→verde; reviewer aprobó a
  la primera (init.sh exit 0 propio, 21 suites/193 tests, contención vacía).
  R13 smoke humano en Expo Go 2026-08-22: mascota premium (ACT-002,
  SIM_MODE) con mapa/ruta/stats y mascota free sin mapa (`ce75f03`). API key
  Google Maps propia = tarea humana diferida a builds (Expo Go usa la de
  Expo). Ver `progress/impl_mobile-map-live.md` y
  `progress/review_mobile-map-live.md`.

- **`mobile-home-dashboard` (#35) done** (2026-08-21): Home real — clientes
  `src/api/pets.ts` y `activity.ts` con `fetchFn` inyectado y tipos a mano
  (D11 ratificada: sin codegen, el backend no publica OpenAPI), hook `useApi`
  con 401 → `signOut()` global y stale-while-revalidate, `SelectedPetProvider`,
  pet card, collar card (estado free con `device: null` / 402 `no-tracking`),
  Today's Summary degradando con `—` (nunca 0) y card de última posición que
  enlaza al tab Map. Sin mini-mapa (v1) y sin react-query (se reevalúa en #36).
  Codex R1-R12 TDD rojo→verde; `reviewer` aprobó a la primera (init.sh exit 0
  propio, contención vacía). Dos fixes post-smoke por fallback `implementer`:
  `paddingTop: insets.top` (título bajo la barra del sistema) y conservación
  del data anterior en `useApi` (flash al cambiar de mascota). R13 smoke
  humano con backend real: mascota por API, claim ACT-001, posiciones del
  simulador llegando (`3ee6815`). Suite móvil 18 suites / 132 tests. Ver
  `progress/impl_mobile-home-dashboard.md` y
  `progress/review_mobile-home-dashboard.md`.

- **`mobile-tabs-shell` (#34) done** (2026-08-21): shell de navegación móvil —
  layout groups `(auth)`/`(tabs)` con guard de sesión en ambos sentidos,
  `FloatingTabBar` custom (5 tabs con iconos reicon, safe-area
  `insets.bottom + 12`), placeholders Home/Map/Food/Profile con `Sign out`
  (salda la deuda de logout de #33), health mudado a `(tabs)/` conservando URL
  y destino post-login `/home` (excepción C4 documentada, 3 hrefs + 3 asserts
  de #33). Cero dependencias nuevas, 100% Expo Go. Codex R1-R10 con TDD
  rojo→verde; `reviewer` rechazó una vez por C6 (frontmatter `draft`, fix
  documental del leader) y aprobó en re-revisión. Fix post-smoke: la tab bar
  salía pegada a la izquierda en Android físico — uniwind no aplicaba
  `left-4 right-4` en runtime; posicionamiento horizontal movido a style
  inline (`761f2ae`→`c434ed9`, fallback `implementer` por cambio trivial).
  R11 (smoke Expo Go) aprobado por el humano con el fix verificado
  (`cb45907`). Suite móvil 13 suites / 75 tests. Ver
  `progress/impl_mobile-tabs-shell.md` y `progress/review_mobile-tabs-shell.md`.

- **`mobile-auth` (#33) done** (2026-08-21): cliente auth tipado a mano con
  `fetchFn` inyectable, token exclusivo en SecureStore desde `AuthProvider`,
  splash por sesión, pantallas Login/Register/Forgot (stub deshabilitado —
  backend sin forgot-password, #44 al backlog), health movido a `/health`.
  Codex R1-R10 TDD rojo→verde (59 tests), `reviewer` aprobó, R11 smoke Expo Go
  aprobado por el humano. PR #63 mergeado. Ver `progress/impl_mobile-auth.md`
  y `progress/review_mobile-auth.md`.

- **`device-subscriptions` (#25) done** (2026-08-17): el entitlement cuelga del
  collar mediante `device_subscriptions`; un único predicado SQL alimenta
  repositorio, poller, claim, las 10 rutas de tracking y el filtro de alertas.
  La gracia es de 3 días, vencer no libera la asignación y reactivar restablece
  la ingesta sin re-claim. `PetAccessGuard` conserva precedencia sobre el 402,
  el contrato HTTP permanece intacto y `src/` no contiene proveedores de pago.
  `init.sh` completo verde. Siguiente feature elegible: #28
  `test-dev-resource-isolation`.

- **`reject-future-positions` (#27) done** (2026-08-16): cierra un **fallo
  permanente disparable por hardware ordinario**, destapado el 2026-08-14
  durante el smoke de #24 con el collar real. Nada validaba que el `ts` de una
  posición estuviera en el pasado, y el `ts` lo pone el collar
  (`wialon-http.client.ts:166`, `message.t * 1000`), no el servidor.
  `poller.service.ts:126` avanzaba el watermark a `Math.max(...)` sin tope, así
  que **una sola** posición con `ts` futuro dejaba `devices.ingest_watermark` en
  el futuro; a partir de ahí el poller pedía `getMessages(unitId, fromTs, now)`
  con `fromTs > toTs`, un rango invertido que devuelve lista vacía, y la guarda
  de la línea 97 hacía `return` sin tocar el watermark. **El device dejaba de
  reportar para siempre, en silencio, sin excepción, sin log y sin alerta**, y
  la única salida era un `UPDATE` manual sobre `devices`. Un collar con el RTC
  mal configurado o con el GPS aún sin fijar la hora se autodestruía solo.
  Arreglo deliberadamente redundante en dos capas: `normalize()` descarta con
  razón `future_ts` lo que exceda `nowMs + FUTURE_TS_TOLERANCE_MS` (5 min,
  constante justificada en `pipeline/constants.ts`) conservando el borde
  inclusivo para no cobrarse telemetría real por un desfase de reloj legítimo,
  **y** el poller topa el watermark en la escritura (`Math.min(lastTs, now)`)
  además de ignorarlo en la **lectura** si ya está envenenado, cayendo al suelo
  de `CLAIM_WATERMARK_LOOKBACK_MINUTES`. Esa segunda mitad es la que recupera a
  los devices ya rotos: un envenenado nunca llega a `advanceWatermark` porque
  el rango invertido corta antes, así que topar solo en la escritura no habría
  arreglado a nadie. Al reingestar, la escritura de `min(lastTs, now)` **hace
  retroceder** el watermark y repara la fila en disco — verificado por el
  reviewer contra el `UPDATE` real de `IngestionDrizzleStore`, que no tiene
  guarda de monotonía. `normalize()` mantiene la pureza del núcleo: `nowMs` es
  opcional y viene siempre del caller, nunca `Date.now()`. Los descartes dejan
  de desaparecer: el consumidor emite un `warn` por mensaje con el conteo
  agrupado por razón. Cero migraciones, cero env vars, cero deps. `reviewer`
  **aprobó sin bloqueantes**. Ver `progress/impl_reject-future-positions.md` y
  `progress/review_reject-future-positions.md`.
- **La regla dura de #27 funcionó, y por eso la spec cambió** (2026-08-16):
  `tasks.md` prohibía editar un test existente para ponerlo verde, obligando a
  parar y reportar. Codex paró en R4 — dos `it` de lote largo del spec del
  consumidor construían sus posiciones como `BASE_TS + index * 30_000` y
  terminaban en `NOW + 28,5 min` y `NOW + 48,5 min`, así que R4 les descartaba
  47 de 60 y 87 de 100. El fallo era de la spec: su inventario de riesgo auditó
  `BASE_TS` pero no el incremento acumulado. Se **enmendó la spec** con gate
  humano reabierto (`479ee7d`, precedente #21): R9(f) autoriza editar solo la
  expresión que construye esos `ts`, desplazando la ventana al pasado —
  telemetría del futuro es justo lo que la feature rechaza, y un lote real de
  100 posiciones es una descarga de búfer que cubre una hora **pasada**. El
  reviewer lo verificó con la prueba más fuerte disponible: en todo el branch
  el spec del consumidor tiene **solo dos líneas suprimidas**, las dos
  autorizadas. Conteos, espaciado, orden y assertions (`batchSizes [25,25,10]`,
  `detail.positions` de 100) intactos. La alternativa —subir la tolerancia a
  más de 50 min para acomodar un fixture— habría vaciado la feature de sentido.
- **`geofence-eval-full-batch` (#30) done** (2026-08-15): el motor de geocercas
  evaluaba **una sola posición por ciclo**, no el lote entero — efecto colateral
  de R16 de #8, que emite un `position.updated` por mensaje SQS y no por posición
  para abaratar EventBridge. `evaluate()` es una máquina de estados escrita para
  consumir un stream ordenado (el consumidor de #12 tiene hasta el guard
  monotónico `previousUpdatedAtMs`) pero solo recibía la más reciente del
  mensaje. En régimen estable se perdía la mitad de las muestras; el daño real
  estaba en los lotes de hasta `POSITIONS_PER_MESSAGE_MAX=100` —descarga del
  búfer del collar tras perder cobertura, reinicio del poller, lookback del
  claim—, donde toda la ventana colapsaba en una evaluación y **una salida con
  regreso dentro del lote no generaba ninguna alerta**: justo la ventana donde es
  más probable que la mascota se haya perdido de verdad, porque el dispositivo
  estuvo sin señal. Ahora el `detail` va en `version: 2` con `positions[]`
  (todas las aceptadas, ascendente por `ts`) conservando `position` con la última
  para no tocar a los consumidores de 006/007/010, y el alerts-engine ordena
  sobre una copia e itera encadenando el estado en memoria. **Prerrequisito
  dentro de la misma feature (R1)**: `evaluate()` cortaba solo con
  `FLAG_LOW_ACCURACY`, así que una posición `suspect_jump` con buena precisión
  disparaba un `exit` falso; la histéresis es espacial (1.1R/0.9R), no temporal,
  y una sola muestra mala basta — multiplicar por ~100 las muestras sin filtrar
  el salto habría multiplicado la falsa alarma de fuga. Un lote de 100 mantiene
  **un solo evento EventBridge** (R5, con `Detail` < 256 KB) y **una sola
  escritura de estado** por geocerca (R11, plegado en memoria, orden a prueba de
  caídas de #12 D3 conservado); la alerta lleva el `ts` de la posición que cruzó
  (R8) y un `detail` v1 legado se procesa como lote de uno sin ir a la DLQ (R10).
  Cero migraciones, cero env vars, cero deps y **nada que desplegar**: la regla de
  EventBridge filtra solo por `source` y `detail-type`, no por `detail.version`.
  Implementada por Codex CLI en 22 commits con rojo→verde por R-id; `reviewer`
  **aprobó sin bloqueantes** tras correr `init.sh` él mismo con infra verificada
  por `docker port` (977 unit, 14 infra, 260 e2e), recalcular los dos sha256 de
  R2 por su cuenta e inspeccionar los commits con `git show --stat` para
  confirmar que los "rojos" tocan solo `.spec.ts`. Ver
  `progress/impl_geofence-eval-full-batch.md` y
  `progress/review_geofence-eval-full-batch.md`.
- **El guard de hash de #12 R19 se re-congeló a propósito** (#30 R2):
  `geofence-eval-untouched.spec.ts` congela por sha256 `geofence-eval.ts` y su
  suite, y R1 lo invalida por construcción. Se recalcularon los hashes
  normalizando BOM y CRLF→LF —la lección de la corrección post-cierre de #12, CI
  Linux vs. checkout Windows— **sin borrar el guard**: sigue impidiendo que una
  feature futura toque el motor sin spec. Si vuelve a tocarse `evaluate()`, el
  camino es el mismo: spec primero, hashes después.
- **Hueco del harness abierto, detectado en #30 (no bloqueante)**: `init.sh:250`
  y `:270` eligen y cuentan la próxima feature con `x.status === 'pending'`, así
  que **la feature en curso desaparece del anuncio** en cuanto pasa a
  `spec_ready` o `in_progress` — la sesión siguiente ve una menos y anuncia la
  equivocada. Además `docs/specs.md` se contradice consigo mismo: §Estados exige
  la marca humana para `spec_ready`, §86 manda al `spec_author` ponerlo antes del
  gate. Candidato natural a plegarse en #23 `init-env-drift-warning`.
- **`claim-activation-code-only` (#26) done** (2026-08-15): cierra el hueco de
  autorización que #7 dejó abierto y que se destapó al escribir la spec de #24.
  `DEVICE_IDENTIFIER_FIELDS` listaba `esn`/`imei`/`serialNumber`/
  `activationCode` y el `superRefine` del DTO solo exigía **exactamente uno** de
  los cuatro: un IMEI adivinado reclamaba el collar igual que el código secreto.
  Con collares simulados era teórico; con hardware real es explotable, porque
  los IMEI de un lote de fábrica son casi consecutivos — quien tuviera uno
  válido enumeraba vecinos y se quedaba con la ubicación GPS de mascotas ajenas
  en la ventana entre la venta y la activación legítima. Ahora `activationCode`
  es **obligatorio y única credencial**; los otros tres salen del schema y se
  ignoran en silencio (D1, precedente `weightKg` de #22 — el repo no tiene
  `z.strictObject` ni `forbidNonWhitelisted`, así que un 400 por campo
  desconocido habría sido asimetría nueva y habría roto un claim legítimo que
  mande `imei` de más). `DEVICE_IDENTIFIER_FIELDS` se **borra** en vez de
  reducirse a un elemento y `DeviceIdentifierField` pasa a unión literal
  explícita de los cuatro valores (D2): `IDENTIFIER_COLUMNS` y
  `findByIdentifier({field:'imei'})` conservan su capacidad para búsquedas
  internas — lo que se retira es su uso como credencial en el borde HTTP, no
  del repositorio. Cero migraciones: `esn`, `imei` y `serial_number` siguen
  siendo columnas `UNIQUE`, y `esn` sigue en la respuesta de
  `DeviceStatusResponse` (es salida, nunca credencial). Implementada por Codex
  CLI en 12 commits con rojo→verde por requisito; `reviewer` **aprobó sin
  bloqueantes** tras correr `init.sh` él mismo con infra publicada verificada
  por `docker port`: 260 e2e passed contra el baseline de 255 de la sesión,
  delta +5 que cuadra exactamente con los tests nuevos, cero regresiones. Ver
  `progress/impl_claim-activation-code-only.md` y
  `progress/review_claim-activation-code-only.md`.
- **La propiedad de seguridad está probada, no solo implementada**: el e2e de R2
  siembra un device con los cuatro identificadores poblados, `available` y sin
  fila en `pet_devices` — o sea perfectamente reclamable — y por cada uno de
  `imei`/`esn`/`serialNumber` verifica `400`, cero filas en `pet_devices`,
  `status` intacto en `available` y cero entradas `device.claim` en `audit_log`;
  **acto seguido** reclama el mismo device con su `activationCode` y espera
  `201`. Ese último paso es el que cierra el argumento: el `400` es por
  credencial rechazada, no por un device en mal estado.
- **`device-provisioning-admin` (#24) done** (2026-08-14): CLI interno
  `provision:device`, verificación por `WialonClient.listUnits()`, idempotencia
  por `wialon_unit_id` y secreto Crockford de aridad cero. TDD R1-R8 trazado;
  `init.sh` verde con 956 unit y 254 e2e; sin migración ni cambios en claim,
  seed, poller o controllers. `reviewer` aprobado sin bloqueantes, PR #49
  mergeada (`dd71fae`). Ver `progress/impl_device-provisioning-admin.md`.
- **`health-weights` (#15) done** (2026-08-11): historial de peso extendiendo el
  módulo `src/modules/health/` de #14 — migración nueva `0010` con la tabla
  `weights`, `POST /v1/pets/:petId/weights` (owner-only) y
  `GET .../weights?limit=` con `variation`. Tres puntos que la spec cerró por
  escrito y el `reviewer` verificó uno a uno: la proyección a
  `pets.current_weight_kg` va con `notExists(gt(measured_at, nueva))` dentro del
  `UPDATE`, así que una medición **retroactiva no pisa** el perfil y un empate
  exacto de fecha sí (la última escrita gana); `variation` se calcula sobre el
  **historial completo** con una fila sonda `limit + 1`, de modo que con dos
  mediciones y `?limit=1` el único elemento devuelto trae variación no nula; y
  la validación de fecha futura usa una tolerancia de un día
  (`MEASURED_AT_MAX_FUTURE_DAYS`) en vez de la tz del owner, porque el planeta
  abarca UTC-12..UTC+14 y leer `users.timezone` habría metido una dependencia
  health→users permanente en un POST autocontenido (razonado en `design.md` D5).
  Implementada por Codex CLI con **historial rojo→verde impecable**: 10 tríos
  `test → feat → docs`, uno por R-id — el C4 que #19 incumplió. `reviewer`
  **aprobó sin bloqueantes**, verificando cada commit rojo en un worktree
  aparte. Branch `feature/15-health-weights` (33 commits). Ver
  `progress/impl_health-weights.md` y `progress/review_health-weights.md`.
- **Deuda de test declarada en #15 (NB-3 del reviewer, no bloqueante)**: el
  `variation` **no nulo en la respuesta del `POST`** no tiene ningún test, así
  que `WeightDrizzleRepository.findPrevious` —con su desempate
  `or(lt(measured_at), and(eq(measured_at), lt(id)))`— no tiene una sola línea
  ejecutada contra Postgres. Todas las aserciones de `variation != null` van por
  el `GET`, que usa el camino de la fila sonda, **código distinto**. La lógica se
  revisó a mano y es correcta, pero una regresión ahí saldría verde. Lo cierra un
  `it` que haga dos POST y asevere el `variation` del segundo.
- **`aws-cdk-dev-stack` (#20) done** (2026-08-10): implementada por Codex CLI
  (R1-R16 + R21 mitad A) con veredicto aprobado del `reviewer`, y R17-R21
  cerrados por el humano el mismo día. La stack está desplegada en `us-east-1`
  con los 11 recursos de R13, `CDKToolkit` tiene termination protection y el
  segundo deploy dio `no changes`. El deploy corrió con **PowerUserAccess**;
  el admin solo hizo falta para el bootstrap. Ver
  `progress/impl_aws-cdk-dev-stack.md` y `progress/review_aws-cdk-dev-stack.md`.
- **`aws-mode-endpoint-guard` (#21) done** (2026-08-10): cierra el defecto que
  destapó #20 R21 — el SDK v3 lee `AWS_ENDPOINT_URL` del entorno por su cuenta,
  así que `AWS_MODE=aws` **no aislaba de LocalStack** y la suite de ingest real
  pasó en verde contra LocalStack fingiendo haber verificado AWS. Ahora los dos
  resolvers de `src/aws/aws-clients.ts` lanzan `UnexpectedAwsEndpointError` en
  modo `aws` si la variable tiene valor, antes de construir ningún cliente:
  la guarda simétrica a `assertNoStaticAccessKey` que faltaba. El modo `local`
  no cambia. **No cubre la CLI de CDK**, que no pasa por `aws-clients.ts`: antes
  de un `cdk deploy` sigue habiendo que comentar las variables a mano
  (`docs/verification.md`). El `reviewer` ejecutó el escenario contaminado él
  mismo — 4 tests rojos, 0 en verde, sin construir clientes. Implementada por
  Codex CLI, que **paró a mitad** al topar con una contradicción real de la
  spec (R4 exigía `aws-mode.spec.ts` intacto y R1 lo rompía por diseño) en vez
  de inventar una excepción por `NODE_ENV`; el gate humano se reabrió y R4 se
  enmendó. Ver `progress/impl_aws-mode-endpoint-guard.md` y
  `progress/review_aws-mode-endpoint-guard.md`.
- **Coste de la infra desplegada** (verificado con el Price List API y
  `freetier get-account-plan-state`, no estimado): la tabla `positions` está en
  25 RCU / 25 WCU, el tramo de `$0.00/hora`. SQS, S3 y EventBridge cobran por
  uso y hoy no tienen tráfico. La cuenta es `PAID` con 120 USD de crédito. El
  techo lo pone `BillingMode PROVISIONED` sin auto-scaling: exceso = throttling,
  no factura. **Ese techo desaparece si alguien activa auto-scaling o pasa la
  tabla a on-demand.**
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
  y push a main — verde, **pero sin e2e**: el runner no levanta Postgres ni
  LocalStack, así que ese paso se salta con aviso (ver el pendiente abierto
  más abajo). Flujo por feature: branch `feature/<id>-<nombre>` + PR que el
  humano mergea (`docs/conventions.md` §Branches y Pull Requests).
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
  rótulo a corregir. Branch `feature/12-alerts-engine` (8 commits). Ver
  `progress/impl_alerts-engine.md` y `progress/review_alerts-engine.md`.
- **Corrección post-cierre (2026-08-07, mismo día)**: el humano abrió la PR
  (#25) y CI (GitHub Actions, runner Linux) salió **roja** en
  `geofence-eval-untouched.spec.ts` pese a que `init.sh` local (Windows) y
  el `reviewer` habían dado verde — la guarda de R19 hasheaba el archivo
  con line endings crudos; CRLF en el checkout Windows donde se implementó
  vs. LF en CI, mismo blob de git, hash distinto sin que
  `geofence-eval.ts` cambiara de verdad (diff contra `main` seguía vacío).
  Feature reabierta a `in_progress` puntualmente (CI es el gate de verdad,
  no el `init.sh` local — regla ya vigente, esta vez hizo falta
  ejercerla) → `implementer` normalizó BOM+CRLF→LF antes de hashear
  (`c4f09e5`) → `reviewer` re-verificó, incluido comparar los hashes
  recalculados contra el log real de la corrida de CI que había fallado
  (coinciden byte a byte) → push → **CI confirmado verde en el runner
  real** (`gh pr checks --watch`, 50s). Recién entonces vuelta a `done`.
  Lección: un `init.sh` verde en Windows no certifica CI verde en Linux
  cuando hay una guarda que hashea contenido de archivo sin normalizar
  line endings — candidato a revisar si aparece un patrón similar en
  `no-hardcoded-credentials.spec.ts`/`relative-import-guard.spec.ts`
  (mismo criterio de hash citado en el comentario de la guarda de R19,
  ninguna de las dos falló esta vez pero comparten la técnica).
- **Hallazgo de seguridad ajeno a esta feature (2026-08-07, sin tocar,
  pendiente de decisión humana)**: `.mcp.json` tiene un PAT de GitHub en
  texto plano en un cambio que ya estaba sin commitear en el working tree
  **antes** de esta sesión — no lo trackea `.gitignore` (el patrón nuevo
  `./.mcp.json` no es sintaxis válida y el archivo de todas formas ya
  está trackeado). Posible intento de resolver el bloqueo conocido de
  `GITHUB_TOKEN` con scope insuficiente para crear PRs. Pendiente: rotar
  el token, sacarlo a variable de entorno, corregir `.gitignore`.
- **`alerts-center-notifier` (#13) done**: worker nuevo
  `src/workers/notifier/` que consume la cola `notifications` que llena #12,
  resuelve los `push_tokens` de todos los miembros activos de la mascota y
  despacha por el puerto `PushSender` con dos adaptadores —
  `ConsolePushSender` (el que corre en local con `PUSH_ENABLED=false`, log
  `{wouldSend}`) y `ExpoPushSender` (`expo-server-sdk`, borra tokens
  `DeviceNotRegistered`). Tabla `push_tokens` + `POST/DELETE
  /v1/me/push-tokens` (upsert idempotente por `expo_token`, `200`/`204`,
  reasigna al re-registrar un token de otro usuario). Centro de alertas
  `src/modules/alerts/`: `GET /v1/alerts?status=` paginado por cursor sobre
  todas mis mascotas + `POST /v1/alerts/:id/ack` (autorización dentro del
  caso de uso, no por `PetAccessGuard` — la ruta no lleva `:petId`).
  `time_away_minutes` de `activity_daily` (#10) por fin se rellena, desde
  los `alert_events` del día contra la geocerca más antigua de la mascota.
  **D1 tocó código de #12, ya mergeado**: migración `0008` reemplaza el
  índice anti-spam por `WHERE status <> 'closed'` y `closeOpenAlert()` pasa
  a `status IN ('open','acked')` — sin eso un `ack` reabría el spam y dejaba
  la alerta sin cerrar al regresar. Spec 30 EARS + D1-D6, `reviewer`
  **aprobó** sin bloqueantes (832 unit tests + e2e propio verde).
  Branch `feature/13-alerts-center-notifier`. Ver
  `progress/impl_alerts-center-notifier.md` y
  `progress/review_alerts-center-notifier.md`.
- **Agujero de verificación descubierto y cerrado (2026-08-07, PR #29)**:
  `init.sh` **nunca había corrido los e2e**. `TEST_CMD` lanza jest con
  `rootDir: "src"` y `testRegex: ".*\.spec\.ts$"`, y los e2e viven en `test/`
  como `*.e2e-spec.ts` con config aparte (`test/jest-e2e.json`). CI corre
  `init.sh`, así que tampoco los corría: los criterios de aceptación e2e de
  las 12 features anteriores se habían dado por buenos sin ejecutarse en
  ningún gate automático. **Arreglado**: `init.config.sh` define `E2E_CMD` y
  `E2E_REQUIRED_PORTS`, e `init.sh` los ejecuta cuando los puertos 5432 y
  4566 responden; si la infra no está, avisa y continúa (para no romper
  `init.sh` en máquinas sin Docker), y con infra levantada un e2e rojo sí
  aborta con exit 1. `main` verde con **832 unit + 166 e2e**.
- **`media.e2e-spec.ts::R8`: no había vulnerabilidad** (2026-08-07, PR #29).
  El test esperaba 403 en un `GET` sin firma sobre el bucket y recibía 200 —
  criterio de aceptación literal de `pet-photos-s3` (#6): "Bucket jamás
  público". Diagnóstico: `GetPublicAccessBlock` devuelve los cuatro flags en
  `true`, o sea `provisionMediaBucket()` hace lo correcto y el bucket **no
  está expuesto**; LocalStack almacena los flags pero **no los hace cumplir**,
  y en AWS real ese GET daría 403. El test verificaba algo que el emulador no
  emula. R8 pasa a comprobar los cuatro flags + ausencia de bucket policy
  pública, sin tocar `src/`. Que el GET anónimo responda 403 queda **sin
  verificar hasta un despliegue AWS real**, dicho explícitamente en el test,
  en R8 de `specs/pet-photos-s3/requirements.md`, en su `traceability.md` y
  en `docs/architecture.md`. Corrige de paso el registro de la sesión de #12,
  que lo archivó como "flakiness ya conocido": era determinista, solo que
  nadie lo ejecutaba.
- **`health-vaccines` (#14) done**: migración `0009` con
  `vaccine_catalog`/`pet_vaccines`, seed canónico idempotente (4 dog/3 cat),
  catálogo por especie, CRUD owner-only bajo `PetAccessGuard`, cálculo de
  próxima dosis con meses calendario, auditoría y `nextVaccine` en el perfil.
  El primer review rechazó tres huecos R2/R8 (fecha inválida → 500, filas extra
  del catálogo y `documentKey` escribible); corregidos con commits rojo/verde
  y aprobados en la segunda revisión. Gate final verde: 117 suites/843 unit y
  13 suites/181 e2e contra Postgres + LocalStack locales. Branch
  `feature/14-health-vaccines`, **PR #32 mergeado por el humano**
  (2026-08-09).
- **`aws-real-credentials` (#19) done — primera feature que habla con AWS
  real**: `AWS_MODE=local|aws` en `src/aws/aws-clients.ts`. En `local` todo
  queda idéntico (endpoint de LocalStack, par estático de credenciales,
  `forcePathStyle`, `MissingAwsEndpointError`); en `aws` los cuatro clientes
  se construyen **sin `endpoint` y sin `credentials`**, dejando que el SDK v3
  resuelva por su cadena por defecto — necesario porque las credenciales de
  `aws login` son de sesión y rotan, no un par fijo. `AWS_MODE` es exact-match
  sobre `aws` tras `.trim().toLowerCase()`: **cualquier otro valor cae a
  `local`**, así que un typo no puede dirigir tráfico a la cuenta real.
  Extra defensivo fuera de los criterios originales: `run-provisioning.ts`
  aborta con exit 1 si detecta `AWS_MODE=aws` **antes** de construir ningún
  cliente — sin esa guarda, un `.env` mal puesto crearía los 8 recursos del
  provisioning en la cuenta real. Cero migraciones, cero deps nuevas,
  `provisioning.ts` sin tocar. Spec 12 EARS aprobada por humano 2026-08-09.
  **Primera feature implementada por Codex CLI** en vez de por el subagente
  `implementer` (reparto: Claude spec+review+PR, Codex implementación);
  `reviewer` **aprobó** R1-R10 con infraestructura levantada por él mismo —
  `init.sh` exit 0, 119 suites/869 unit y 13 suites/181 e2e, y el criterio
  clave R2 verificado con `localstack-provisioning.e2e-spec.ts` 10/10 **sin
  modificar el archivo**. R11/R12 los cerró el humano con la prueba de humo
  real (ver abajo). Branch `feature/19-aws-real-credentials`. Ver
  `progress/impl_aws-real-credentials.md` y
  `progress/review_aws-real-credentials.md`.
- **Prueba de humo contra la cuenta real ejecutada (2026-08-09)**: con sesión
  de `aws login` y `AWS_MODE=aws`, `test/aws-real-smoke.e2e-spec.ts` pasó 2/2
  — un `ListQueues` de solo lectura, sin crear ni modificar nada. **Gotcha que
  costará repetir**: el `.env` raíz trae el par dummy de LocalStack y la
  cadena del SDK prioriza `AWS_ACCESS_KEY_ID` del entorno sobre la sesión de
  `aws login`, así que hay que comentar esas dos líneas antes de correrla (y
  restaurarlas después, o LocalStack deja de funcionar). La suite falla con
  mensaje explícito si se olvidan. Procedimiento en `docs/verification.md`
  §"Feature 19"; el `--` antes de `--runInBand` es obligatorio o pnpm no
  reenvía los flags a jest.
- **Pendiente abierto — CI no levanta infra para los e2e**: `ci.yml:27` dejó
  anotado hace tiempo "cuando existan tests e2e contra Postgres/LocalStack,
  anadir services aqui", y sigue sin hacerse. Tras la PR #29, en el runner
  los puertos están cerrados y el paso e2e **se salta con aviso**: CI sale
  verde habiendo verificado solo los unit tests. Cerrarlo del todo pide
  `services` de Postgres + LocalStack, migraciones y `provision:local` en el
  workflow. Mientras tanto, los e2e solo se verifican en local — y conviene
  correrlos a mano antes de dar una feature por cerrada.
- Próximo paso SDD: **no quedan features P1**. Con #19 cerrada, la candidata
  natural es `aws-cdk-dev-stack` (#20) — declara en AWS real los mismos
  recursos que hoy crea `provisioning.ts` por SDK. Ojo con el orden: hacer #20
  antes que `pet-reminders` (#16) evita escribir el workaround de cron local
  que #16 arrastra por no existir EventBridge Scheduler en LocalStack
  community. `cdk bootstrap` y `cdk deploy` los corre el humano: crean
  recursos con costo. Alternativa si se prefiere seguir por orden numérico:
  `health-weights` (#15), historial de peso y actualización segura de
  `pets.current_weight_kg`.
  Integración Wialon real: diferida hasta tener hardware en mano (SIM_MODE
  es el camino; conectar real será smoke test de config, no feature).

---

## Última sesión

- **2026-08-28** — #44 `auth-forgot-password` **cerrada** (49/54). Codex
  implementó R1–R13 con TDD estricto por requisito, migración 0015, entrega
  local por evento `auth.password_reset.issued`, aislamiento de verify-email
  y login viejo 401/nuevo 200. `./init.sh` terminó verde (backend 156/1198,
  infra 2/14, móvil 50/561, e2e 23 suites/349 tests). No se tocó mobile,
  infraestructura, variables de entorno ni proveedores externos; no hubo
  deploy AWS. Informe: `progress/impl_auth-forgot-password.md`.

- **2026-08-25** — #50 `mobile-tab-glass`: Codex implementó R1–R7 con TDD
  estricto (test rojo commiteado antes de cada implementación R1–R6), cerró
  trazabilidad y añadió un guard C8 genérico. `./init.sh` terminó verde:
  backend 145/1114, infra 2/14, móvil 39/458, e2e 20 suites/327 tests,
  build/lint/typecheck sin errores. La feature permanece `in_progress` hasta
  review; no se abrió PR por instrucción del humano.

- **2026-08-24** — #47 `mobile-design-drift`: Codex implementó R1-R8 con
  commits rojos antes de cada verde y trazabilidad completa. Suite móvil:
  34 suites/379 tests; `./init.sh`: build, 143 suites backend/1111 tests,
  2 suites infra/14 tests, harness 28 tests, 20 suites e2e/319 tests, lint y
  typecheck verdes. Se conserva `in_progress` hasta review y no se abrió PR,
  según el handoff.

- **2026-08-22** — #36 `mobile-map-live` **cerrada** (35/45). Spec con dos
  decisiones fuertes verificadas con evidencia: react-native-maps 1.27.2
  (bundleada en Expo Go, sin API key para el smoke) sobre expo-maps
  (alpha, exige dev build), y sin react-query (polling 15 s sobre el
  `useApi` de #35). Lost Mode sin endpoint backend → stub + **#45
  `pet-lost-mode`** nueva en backlog. Codex R1-R12, review aprobado a la
  primera, R13 smoke humano con SIM_MODE (premium con mapa, free sin mapa;
  durante el smoke se reaprovisionó LocalStack —
  `ResourceNotFoundException`, recursos no sobreviven reinicios del
  contenedor). Siguiente: #37 `mobile-health` (P2).

- **2026-08-21 (3)** — #35 `mobile-home-dashboard` **cerrada** (34/44). Ciclo
  en un día: spec (fetch en dos niveles lista+detail, `useApi` ≤30 líneas,
  estado free por 402, D11 sin codegen) → gate humano (`06f12df`) → Codex
  R1-R12 → review aprobado a la primera → smoke R13 con backend real (el
  humano creó mascota por API, reclamó ACT-001 y vio posiciones del
  simulador). Dos fixes post-smoke (fallback `implementer`): safe-area top y
  stale-while-revalidate contra el flash del selector, verificados por el
  humano en Expo Go. Decisión humana del día: avatar fallback con `blobatar`
  core (web wrapper descartado) anotado en #40. Siguiente: #36
  `mobile-map-live` (P1).

- **2026-08-21 (2)** — #34 `mobile-tabs-shell` **cerrada** (33/44). Ciclo
  completo en un día: spec (`Tabs` de expo-router + tab bar custom, cero deps
  nuevas) → gate humano (`ae852b7`) → handoff a Codex CLI → TDD rojo→verde
  R1-R10 → review (un rechazo documental C6, frontmatter `draft`; re-revisión
  aprobada) → smoke R11 del humano en Expo Go. Durante el smoke: sesión de
  debugging de entorno en máquina nueva del humano (Postgres nativo de Windows
  compitiendo por el puerto 5432 → 28P01, y volumen Docker vacío → 42P01;
  fixes: detener servicio nativo + `drizzle-kit migrate` con `DATABASE_URL`
  exportada a mano porque drizzle-kit no lee `../.env`) y fix post-smoke del
  centrado de la tab bar (uniwind no aplicaba `left-4 right-4` en runtime;
  style inline, fallback `implementer` documentado). Siguiente: #35
  `mobile-home-dashboard` (P1).

- **2026-08-21** — Implementación de #33 `mobile-auth` completada por Codex
  para R1-R10, review aprobado, smoke R11 aprobado y **cerrada** (32/44);
  PR #63 mergeado por el humano. Informe: `progress/impl_mobile-auth.md`.

- **2026-08-19** — #31 `mobile-app-scaffold` **cerrada** (30/31) — primera
  feature móvil del monorepo. Decisión humana: la app vive en
  `mobile-pet-tracker/` (Expo SDK 57, TypeScript + expo-router) como carpeta
  isla con **bun** (backend sigue con pnpm, sin workspace raíz). Ciclo
  completo en un día: explorer → spec → enmienda al layout `src/` real de la
  plantilla 57.0.16 (destapado por un intento de instalación manual del
  humano que además pisó un EPERM transitorio de Windows) → gate humano →
  handoff a Codex CLI → TDD rojo→verde por requisito → review aprobado
  (rojos de R2/R7 verificados empíricamente, `init.sh` exit 0) → smoke R13
  del humano en Expo Go con los tres estados. Harness integrado en el mismo
  PR: bun en `REQUIRED_TOOLS`, comandos `--cwd` en `init.config.sh`,
  `oven-sh/setup-bun` en CI, fila nueva en `AGENTS.md` §2.

- **2026-08-18** — #17 `nutrition-profile-engine` **cerrada** (29/30). Ciclo
  completo en un día: revisión de la spec antes de aprobarla, gate humano,
  handoff a Codex CLI, implementación y revisión aprobada.
  - **Revisión previa a la aprobación**: la aritmética de los cinco casos
    numéricos de la spec se verificó en `node` (los cuatro anclas de R14 y el
    discriminante de R4 dan exactamente los valores escritos, ruido IEEE-754
    incluido). Aparecieron dos defectos: R1 aseveraba por `readFileSync` que
    `nutrition-engine.ts` no contiene las cifras clínicas, mientras el paso (3)
    de su propia tarea pedía un JSDoc con esas mismas cifras en ese archivo —
    el refactor habría puesto rojo el test del paso (1) del mismo requisito; y
    R3 pedía "un caso por fila de C-2 (10 filas)" sobre una tabla de 8. Ambos
    corregidos antes del gate (`b506a22`, `b1e0e5d`).
  - **Implementación (Codex CLI)**: 83 commits, patrón test-primero rojo→verde
    por cada uno de los 27 requisitos, migración nueva `0013_wet_may_parker.sql`.
    Esta vez **no cerró la feature él mismo** — el handoff se lo prohibía
    explícitamente tras lo ocurrido en #29.
  - **Revisión (`reviewer`)**: **aprobado**. `./init.sh` verde en corrida propia
    con Postgres publicando puerto y e2e no saltados. Verificó por mutación que
    el par ancla de R14 discrimina de verdad: el perro de 305 g muere con
    `floor`, el gato de 60 g con `ceil` y el caso de R4 con el MER sin redondear.
    Las ocho guardas clínicas conservan su aserción anti-vacío; el commit final
    `b0ef38f` resultó ser solo Prettier y tipos, sin aflojar ninguna aserción.
    Dos defectos menores de documentación corregidos por el `leader` antes del
    PR: la tabla de `docs/data-model.md` había quedado partida por un párrafo
    intercalado, y la fila R27 de `traceability.md` citaba mal el mensaje de un
    commit (el hash era correcto).
  - Detalle en `progress/history.md`, `progress/impl_nutrition-profile-engine.md`
    y `progress/review_nutrition-profile-engine.md`.

- **2026-08-17 (5)** — Spec de `nutrition-profile-engine` (#17) escrita y
  detenida en el gate humano: `pending` -> `spec_ready`, sin tocar
  `backend-pet-tracker/`. El `explorer` corrigió la premisa del encargo
  (`plans/009-alimentacion-ia.md` sí existe y es la fuente normativa de las
  cifras clínicas) y dejó 19 decisiones D1..D19 en
  `progress/explore_nutrition-profile-engine.md`, con un hallazgo que la spec
  blinda en R14: los dos anclajes del criterio de aceptación (perro 20 kg ->
  1059 kcal / 305 g, gato 4 kg -> 218 kcal / 60 g) son un **par mínimo
  indivisible** — el del perro elimina `floor`, el del gato elimina `ceil`, y
  solo juntos prueban que el redondeo a múltiplo de 5 es `round`. Seis
  decisiones de producto/clínica las cerró el humano (condición de STOP
  declarada por el propio plan 009): la edad gana sobre la pérdida de peso en
  menores de 12 meses (con el warning igualmente), `kcalPer100g` obligatorio
  siempre — anula los defaults dry 350 / wet 100 del plan —, nutrición sin
  `PetTrackingGuard` (app de salud gratuita, coherente con #25), `sterilized`
  null tratado como adulto entero, `targetWeightKg` por encima del peso actual
  aceptado sin juicio, y los cuatro textos de warning nuevos aprobados. Spec en
  `specs/nutrition-profile-engine/` (14 R-ids, tabla MER transcrita para que
  Codex no la invente), commit `c04da20` en `feature/17-nutrition-profile-engine`.
  `./init.sh` verde al arrancar. **Siguiente**: el humano marca la casilla de
  aprobación y entonces se escribe el handoff a Codex CLI.

- **2026-08-17 (4)** — Cerrada `wialon-session-reuse` (#29): el `sid` de Wialon
  se cachea por instancia con `WIALON_SID_TTL_MS = 4 * 60_000` (por debajo de
  los 5 min de inactividad documentados) y lo comparten `listUnits()` y
  `getMessages()`, así que un ciclo del poller sobre N collares hace **un solo**
  `token/login` en vez de N. Ante `{error: 1}` / `{error: 1011}` el cliente
  re-loguea una vez y reintenta de forma transparente, con techo duro de dos
  logins y sin recursión. `FakeWialonClient`, el puerto y el gate `SIM_MODE`
  quedaron congelados. La primera revisión **rechazó** por dos defectos de R7
  (aserciones de `console.*` inertes tras `mockRestore()`, y el fuente editado
  para poner verde una aserción); la segunda **aprobó** tras verificar el
  `reviewer` por su cuenta que la guarda muerde. `./init.sh` verde a la primera:
  exit 0, 1045 unit + 14 infra + 296 e2e (6 skipped, 19 suites), lint y
  typecheck limpios. Sin P1 ni P2 abiertas: solo quedan #17 y #18, ambas P3.

- **2026-08-17 (3)** — Corregidos los dos bloqueantes R7 de la primera revisión
  de `wialon-session-reuse` (#29): las cinco aserciones de `console.*` ahora
  corren antes de `mockRestore()` y se verificaron fallando ante un
  `console.error(this.token)` temporal; el comentario original de
  `wialon.errors.ts` se restauró en un commit rojo y la guarda pasó después a
  detectar solo imports reales de `@nestjs/common`. También se corrigieron el
  JSDoc obsoleto y el import duplicado. `./init.sh` final: exit 0, 139 suites
  unit backend, 2 infra, 11 del harness y 19 e2e pasadas (2 omitidas). Feature
  sigue `in_progress`; próximo paso: nueva revisión.

- **2026-08-17 (2)** — Ciclo SDD completo de `test-dev-resource-isolation`
  (#28), reparto Claude/Codex. Los e2e y el entorno de desarrollo dejan de
  compartir recursos de LocalStack: los diez nombres se derivan con un sufijo
  `-test` bajo `NODE_ENV=test`, viajan por el token inyectable
  `AWS_RESOURCE_NAMES` y `provision:local` crea los dos juegos en una
  invocación. `constants.ts` sigue siendo literales `const` a propósito —
  convertirlos en funciones habría dejado el guard de literales duplicados de
  #20 verde en vacío. Con `AWS_MODE=aws` el sufijo es siempre `''` y no se
  aborta: es la combinación normal de los dos e2e de AWS real, que corren bajo
  Jest. El riesgo de duplicar recursos en `us-east-1` queda cerrado por tres
  vías independientes (el modo manda sobre `NODE_ENV`, el provisioning rechaza
  `AWS_MODE=aws`, y el stack CDK no importa nada de `resource-names.ts`).
  La implementación paró **tres veces** (R7, R10, R11) por el mismo defecto de
  la spec —las guardas de regresión iban ordenadas después de los requisitos
  que las vuelven verdes— y las tres se resolvieron por gate en vez de
  fabricando un fallo. Verificación: `init.sh` exit 0 con los e2e corriendo de
  verdad; el reviewer ejecutó además el recuento manual de colas y midió que el
  `ItemCount` de DynamoDB en LocalStack es exacto e inmediato. Aprobado en
  `progress/review_test-dev-resource-isolation.md`.

- **2026-08-17** — Implementación completa de `device-subscriptions` (#25),
  R1–R18 en el orden obligatorio de la spec y con historial TDD rojo→verde por
  requisito aplicable. Se añadió el modelo `device_subscriptions`, el predicado
  único de entitlement, los gates de poller/claim/tracking, el filtro de alertas,
  el CLI manual y el backfill de grandfathering. La precedencia 404 de
  `PetAccessGuard` sobre el 402 queda fijada por test; no se tocaron el guard de
  acceso ni los mappers de respuesta. Verificación final: build y synth verdes,
  1,000 tests backend, 14 de infra, 28 del harness y 292 e2e pasados; lint y
  typecheck verdes. No se crearon recursos AWS ni se usaron proveedores de pago.
  Los smokes sobre el collar Wialon real quedan reservados al humano.

- **2026-08-16** — Ciclo SDD completo de `init-env-drift-warning` (#23),
  reparto Claude/Codex, sin ninguna parada: `spec_author` escribió la spec
  (R1-R12, `b843d5a`) → gate humano (`f24e1c6`) → handoff (`7de0445`) → Codex
  implementó los 12 requisitos en 21 commits con historial rojo→verde
  separado por R-id → `reviewer` **aprobado sin bloqueantes**.
  Queda cerrado el tercer modo de fallo silencioso del entorno local: un `.env`
  viejo al que le faltan claves de `.env.example` ahora se ve. `init.sh` imprime
  el diff de claves con los gates `*_ENABLED` en lista aparte, y en la primera
  corrida real destapó **8 claves faltantes en el `.env` de la máquina, 4 de
  ellas gates** (`ACTIVITY_AGGREGATOR_ENABLED`, `ALERTS_ENGINE_ENABLED`,
  `EMAIL_ENABLED`, `PUSH_ENABLED`) — exactamente el defecto que costó los smokes
  de #16 y #24. El diff de `init.sh` es puramente aditivo: 13 líneas insertadas,
  cero suprimidas; `check_env()` y `REQUIRED_ENV_VARS` intactos.
  **Verificación independiente**: el reviewer no se fió del reporte de Codex.
  Auditó C4 commit a commit en un worktree desechable y confirmó que **los 11
  commits `test(...)` fallan de verdad en su propio commit** — ninguno era un
  rojo que ya pasaba en verde, que es justo lo que falló en #19. Rehízo desde
  cero el diff de R9 montando dos árboles (uno con el `init.sh` de `main`, otro
  con el de HEAD), los dos con `.env` completo: la §2 queda byte a byte
  idéntica. Verificó CRLF/BOM de forma funcional y no solo leyendo el regex
  (`.env.example` es CRLF, `.env` es LF: si el parser tropezara con el `\r`
  reportaría las 21 claves en vez de 8). El `.env` real no se tocó — mismo
  mtime y tamaño (`1786743239 895`) antes y después, y nunca entró en el diff:
  R9(4) se resolvió con una copia temporal.
  Nit conocido no corregido a propósito: el comentario de `init.sh:78` cita "la
  linea 115" y el `node -e` quedó en la 128 tras insertar el bloque. El texto lo
  dictó la spec verbatim y el test de R7 asevera ese literal, así que tocarlo
  exigiría enmendar una spec ya aprobada por un comentario. No compensa.

- **2026-08-16** — Ciclo SDD completo de `reject-future-positions` (#27),
  reparto Claude/Codex, con **una parada a mitad que salió bien**:
  `spec_author` escribió la spec (R1-R9, `243c639`) → gate humano
  (`ae0dfc2`) → Codex implementó R1-R3 y R6-R8 → **paró en R4** en vez de
  editar dos tests existentes que lo contradecían, como le exigía la regla
  dura → se comprobó que el error era de la spec (el inventario de riesgo
  auditó `BASE_TS` pero no el incremento acumulado de 30 s por posición) →
  **enmienda con gate humano reabierto** (`479ee7d`, R9(f), precedente #21) →
  Codex retomó, movió las dos ventanas al pasado en un commit aislado
  (`5396c55`) y cerró R4, R5 y R9 → `reviewer` **aprobado sin bloqueantes**.
  Queda cerrado un fallo permanente que un collar con el reloj mal puesto
  disparaba solo: `ts` futuro → watermark en el futuro → rango invertido →
  device mudo para siempre, sin log ni excepción. La protección es doble a
  propósito (filtro puro con tolerancia de 5 min **y** tope del watermark en
  lectura y escritura), de modo que el device envenenado se recupera solo y la
  fila queda reparada al retroceder el watermark.
  **Verificación independiente**: el reviewer corrió `init.sh` dos veces con
  5432 y 4566 comprobados por `docker port` — 993 unitarios (977 + 16, que son
  exactamente los tests nuevos) y 260 e2e ejecutados de verdad; los 8 commits
  rojos tocan solo `.spec.ts`; en todo el branch el spec del consumidor tiene
  **solo dos líneas suprimidas**, las dos autorizadas por R9(f); ninguno de los
  siete archivos prohibidos aparece en el diff y los sha256 del guard de #30 no
  se recalcularon. Confirmó además R7(b) más allá del mock: `advanceWatermark()`
  es un `UPDATE` sin guarda de monotonía, así que el watermark retrocede de
  verdad en Postgres.
  Nota menor: Codex editó `STATUS.md` (`e1ff5bc`), fuera de su alcance, aunque
  sin reclamar `done` ni tocar el conteo que valida `init.sh`. Corregido en el
  cierre.

- **2026-08-15 (2)** — Ciclo SDD completo de `geofence-eval-full-batch` (#30),
  reparto Claude/Codex: `spec_author` escribió la spec (R1-R11, `19da1f9`) →
  gate humano el mismo día (`a9d81d1`) → handoff por disco a Codex CLI → 22
  commits con el test rojo antes de su implementación por R-id → `reviewer`
  **aprobado sin bloqueantes**. El motor de geocercas pasa de evaluar una sola
  posición por ciclo a evaluar el lote entero: `detail.version: 2` con
  `positions[]` ascendente, `position` conservada como la última para no tocar a
  los consumidores de 006/007/010, e iteración encadenando el estado en memoria.
  R1 fue primero por ser prerrequisito duro — sin filtrar `suspect_jump`, subir
  el muestreo ~100× habría multiplicado la falsa alarma de fuga, que es lo que
  hace que el usuario silencie las notificaciones. Un lote de 100 sigue costando
  un solo evento EventBridge y una sola escritura de estado. Cero migraciones,
  env vars, deps y nada que desplegar.
  **Verificación independiente, no declarada**: el reviewer corrió `init.sh` él
  mismo con `docker port` comprobado antes (los e2e se saltan en silencio sin
  Postgres, y un verde sin e2e no es evidencia) — 977 unit, 14 infra, 260 e2e;
  recalculó los dos sha256 de R2 y coinciden; inspeccionó los 19 commits con
  `git show --stat` confirmando que los "rojos" tocan solo `.spec.ts`. Los tests
  congelados de #8 y #12 quedaron intactos: hunks de inserción pura, diff vacío
  en los dos e2e, y solo el `it` autorizado de la línea 463 editado.
  **Dos notas no bloqueantes**: R2 y R10 no tienen rojo clásico (imposible en un
  test de congelación; R10 es regresión escrita antes del commit que podía
  romperla), y `init.sh:250/:270` oculta del anuncio la feature en curso — ajeno
  a #30, candidato a #23.

- **2026-08-15** — Ciclo SDD completo de `claim-activation-code-only` (#26),
  reparto Claude/Codex: `spec_author` escribió la spec (R1-R8, D1-D5, commit
  `572fdda`) → gate humano el mismo día → handoff por disco a Codex CLI → 12
  commits con el test rojo antes de su implementación en R1 y R3 → `reviewer`
  **aprobado sin bloqueantes**. `activationCode` queda como única credencial de
  `POST /v1/devices/claim`; `DEVICE_IDENTIFIER_FIELDS` eliminado y el tipo
  `DeviceIdentifierField` conservando sus cuatro miembros para que
  `findByIdentifier` no pierda capacidad. Cero migraciones, cero env vars, cero
  deps. Los cinco archivos que la spec declaró intocables —
  `claim-device.use-case.ts`, `device.drizzle.repository.ts`,
  `devices.controller.ts` y los dos mappers — **no aparecen en el diff**, y el
  reviewer lo verificó con `git diff --stat`; `CLAIM_KEYS` y el bloque
  `R2: seed:devices` de los e2e quedaron byte a byte iguales (md5 idéntico).
  Los 13 tests de #7 inventariados en `design.md` D5 se actualizaron sin borrar
  ninguno, con saldo neto positivo de `it` y una fila de justificación por cada
  cambio de comportamiento en `traceability.md`.
  **Dos verdes que no probaban nada, evitados a propósito**: la primera corrida
  de `init.sh` de la sesión saltó los e2e con Docker apagado, y la primera con
  Docker recién levantado dio 77 fallos por la carrera de arranque conocida de
  la FK `pet_users_user_id_users_id_fk`. Se estableció un **baseline explícito
  pre-implementación con infra caliente (255 passed, 6 skipped, 0 fallos)**
  antes del handoff, precisamente para que un rojo durante la implementación no
  se pudiera confundir con infra fría. El reviewer cerró con 260 passed: +5, que
  son los 3 del `it.each` de R2 más R1c más R4.
  Observación no bloqueante del reviewer, útil para la próxima spec de
  seguridad: los e2e de R2/R4 se commitearon después de la implementación de R1
  —tal y como prescribía `tasks.md`—, así que nacieron verdes. Siguen fallando
  contra el commit previo, pero **el e2e que prueba el agujero merece ir
  primero**, aunque lo cierre la misma implementación que el requisito unitario.

- **2026-08-14 (2)** — Implementación TDD de `device-provisioning-admin`
  (#24) en `feature/24-device-provisioning-admin`: R1-R8 completos y
  trazabilidad sin pendientes. Nuevo CLI interno `provision:device` para
  registrar hardware real, validando la unidad con `listUnits()` antes del
  INSERT; reprovisionar conserva el secreto; `generateActivationCode()` usa
  `randomBytes()` y tiene aridad cero. `init.sh` exit 0 (956 unit, 254 e2e,
  build/lint/typecheck), `drizzle-kit generate` sin cambios. No se tocó #7,
  #8, seed, schema, migraciones ni controllers.
  `reviewer` **aprobado sin bloqueantes**; PR #49 mergeada (`dd71fae`),
  feature `done`.
  Se corrigió después un defecto de R1 que ningún test cubría: la invocación
  documentada `pnpm run provision:device -- --unit-id <id>` fallaba porque
  pnpm reenvía el separador `--` literal y `parseArgs` lo tomaba como fin de
  opciones.
  **Hito: primera verificación de la cadena completa con hardware real** —
  collar JT808 en la unidad Wialon `401775970`, aprovisionado, reclamado
  desde la app y con 35 posiciones GPS reales ingestadas a DynamoDB.
  El smoke destapó tres fallos silenciosos de entorno, ninguno del código:
  `POLLER_ENABLED` ausente del `.env`; LocalStack pierde sus recursos al
  reiniciar el contenedor (hay que rehacer `provision:local`); y **procesos
  de jest huérfanos** de corridas de `init.sh` interrumpidas, que siguieron
  poleando en bucle hasta llenar `positions-raw` con miles de mensajes y
  timestamps de 2027. De ahí salieron #27 (P1, un `ts` futuro envenena el
  watermark y el device deja de reportar para siempre), #28 (e2e y dev
  comparten las colas de LocalStack) y #29 (un `token/login` por collar por
  ciclo no escala).

- **2026-08-14** — Ciclo SDD de `weight-single-source-of-truth` (#22), reparto
  Claude/Codex: `spec_author` escribió la spec (R1-R6) sobre la deuda destapada
  al especificar #15 → gate humano → handoff por disco a Codex CLI → Codex
  implementó con 3 tripletas test-primero rojo→verde → `reviewer` **aprobado
  sin bloqueantes** (`./init.sh` independiente con infra caliente, exit 0: 245
  e2e, lint, typecheck). PR #47 mergeada (`2157cc1`). `weightKg` sale del
  contrato de `POST`/`PATCH /v1/pets` (descarte silencioso, no 400) y
  `WeightDrizzleRepository.create()` de #15 queda como **único escritor** de
  `pets.current_weight_kg`; nuevo `pnpm run backfill:weights` idempotente para
  el historial faltante. El contrato de lectura no cambia: las 24 claves de
  `PetProfileResponse` verificadas por diff vacío contra `afc522e`.
  **Integración Wialon real: el humano ya integró el token de la cuenta.**
  Decidido el modelo de membresías: la suscripción cuelga del **dispositivo**,
  no del usuario, porque el costo real es por collar (SIM + licencia de unidad
  + polling + writes); efecto secundario deseado, la mascota compartida se
  resuelve sola. Plan free = la app de salud **sin GPS** (perfil, vacunas,
  peso, recordatorios, plan nutricional determinístico de #17), que es el
  embudo de adquisición y no un pro capado; la IA de #18 es de pago. Backlog
  ampliado con #24 `device-provisioning-admin` (no hay camino para dar de alta
  un collar físico: `devices` solo se llena con simulados) y #25
  `device-subscriptions` (tabla + `isPetTracked()` + 4 gates, sin Stripe),
  ambas P2 y por delante de #17/#18. Aviso operativo:
  `wialon.factory.ts` cae al `FakeWialonClient` **en silencio** si `SIM_MODE`
  no es exactamente `'false'` — verificar el `.env` antes de probar hardware.

- **2026-08-13** — Ciclo SDD de `pet-reminders` (#16), reparto Claude/Codex:
  `spec_author` escribió la spec (R1-R12, D1-D11) el 2026-08-11 → gate humano
  (PR #44 mergeada) → handoff por disco a Codex CLI → Codex implementó con 12
  tripletas test-primero rojo→verde más un fix de compatibilidad (`4f20037`)
  para los tests alert congelados de #13 → `reviewer` **aprobado sin
  bloqueantes** (C2-C7, trazabilidad 1:1 con `git log`, rama alert del
  notifier con 0 borrados). `./init.sh` corrido por el reviewer: primera
  pasada roja por las dos fallas de entorno conocidas (LocalStack recién
  reiniciado pierde recursos + carrera de arranque de Postgres), segunda
  pasada con infra caliente **exit 0** (238 e2e, lint, typecheck; `docker
  port` verificado). Diseño clave: cron 60s `RemindersDispatchService` gated
  por `REMINDERS_ENABLED` encola a SQS `notifications`; idempotencia por
  `enqueued_at` + `schedule_name` como token vigente; notifier con
  `discriminatedUnion kind alert|reminder`; camino de vuelta a EventBridge
  Scheduler en D9. PR #45 mergeada por el humano. Smoke de reloj real
  (humano): primer intento sin envío — **`.env` viejo sin
  `REMINDERS_ENABLED`** (init.sh solo copia `.env.example` si `.env` falta,
  cuarto fallo silencioso del entorno local); añadidos
  `REMINDERS_ENABLED`/`NOTIFIER_ENABLED`, reinicio, y el reminder pasó a
  `status=sent` con push logueado. **#16 `done`**; deuda registrada como
  #23 `init-env-drift-warning`. Próximo: #22 o #17.

- **2026-08-11** — Ciclo SDD completo de `health-weights` (#15): `spec_author`
  (10 EARS) → enmienda de R7 antes del gate → gate humano → Codex CLI (33
  commits) → `reviewer` **aprobado sin bloqueantes** → `done`. `./init.sh` exit
  0 corrido por el reviewer: 127 suites / 901 unit, 14 de infra, 213 e2e.
  **Hallazgo de entorno que invalidaba el gate**: el contenedor
  `pet-tracker-postgres` llevaba desde el 2026-08-01 con un port binding
  malformado (`PortBindings: map[5432/tcp:[{invalid IP 5432}]]`), así que el
  5432 no estaba publicado al host. `docker compose ps` lo daba por `healthy` e
  `init.sh` **saltaba los e2e con un warning y terminaba verde igualmente** —
  el mismo modo de fallo que #21: un verde que no prueba lo que aparenta.
  Recreado el contenedor (`--force-recreate`, volumen intacto), los e2e vuelven
  a correr: +32 tests que cuadran uno a uno con los `it` de la feature. **Antes
  de fiarse de un `init.sh` verde conviene comprobar `docker port
  pet-tracker-postgres`**, no el estado `healthy`. Enmienda de spec previa al
  gate: R7 rechazaba `measuredAt > hoy_UTC`, lo que daba un 400 falso a usuarios
  en husos adelantados; se sustituyó por tolerancia de un día. Abierta la #22
  `weight-single-source-of-truth` (P3) al descubrir que
  `pets.current_weight_kg` tiene **tres** escritores y solo uno crea historial.
  Próximo: `pet-reminders` (#16).

- **2026-08-10** — Implementación de `aws-cdk-dev-stack` (#20) en
  `feature/20-aws-cdk-dev-stack`: R1-R16 y R21 mitad A completados siguiendo
  el orden de `tasks.md`, con un commit rojo anterior a cada implementación y
  trazabilidad actualizada. Se creó `infra/` con el stack CDK de 11 recursos,
  se integró su gate en `init.config.sh`, se actualizaron arquitectura y
  verificación, y se añadió el e2e AWS-only de tres tramos. `init.sh` final
  verde: 879 unitarios backend, 14 tests de infraestructura y 181 e2e; la
  suite nueva aportó 3 tests omitidos. No se ejecutó `cdk bootstrap` ni
  `cdk deploy`. Próximo: el humano completa R17-R20 y R21 mitad B con el
  procedimiento de `docs/verification.md`; después corresponde reviewer.

- **2026-08-09 (2)** — Ciclo SDD de `aws-real-credentials` (#19) con **reparto
  multi-IA estrenado**: Claude Code como `leader` (spec, review, bookkeeping,
  PR) y **Codex CLI en terminal aparte como implementador**, con handoff por
  disco — Codex lee `specs/aws-real-credentials/` y escribe
  `progress/impl_aws-real-credentials.md`; nada de contenido viajando por chat
  entre las dos IAs. El valor real del reparto es que **quien implementa no
  revisa**: `spec_author` (12 EARS, spec deliberadamente autosuficiente porque
  el implementador no tiene acceso a la conversación) → gate humano →
  Codex (2 commits) → `reviewer` de Claude **aprobó** R1-R10 tras levantar
  `docker compose` y provisionar LocalStack él mismo (`init.sh` exit 0,
  119 suites/869 unit, 13 suites/181 e2e) → prueba de humo del humano contra
  la cuenta real, 2/2 verdes → `done`.
  **Incidente de git**: el commit de la spec cayó en `main` en vez de en la
  feature branch — el humano hizo `checkout main` + `pull` en otra terminal
  entre que Claude creó la branch y commiteó, y el working tree es uno solo y
  compartido. Recuperado sin pérdida (`merge --ff-only` + `cherry-pick` +
  `git branch -f main origin/main`; los dos `reset --hard` los bloqueó el
  clasificador). Lección para el reparto multi-IA: **un solo escritor sobre el
  working tree a la vez**, o `git worktree` para que cada agente tenga su HEAD.
  Hallazgo de proceso, no bloqueante: Codex metió implementación + tests +
  docs en un único commit (`d884dad`), sin historial test-primero — el próximo
  prompt de handoff debe exigir granularidad de commits. Choque de reglas
  detectado: `CLAUDE.md` prohíbe al leader marcar `done` mientras `AGENTS.md`
  §7.2 se lo pide; resuelto por decisión humana explícita esta vez, conviene
  redactarlo como "no marcar `done` sin veredicto aprobado del reviewer".
  Próximo: `aws-cdk-dev-stack` (#20) o `health-weights` (#15).

- **2026-08-09** — Ciclo SDD completo de `health-vaccines` (#14): spec de 13
  requisitos aprobada por humano → implementación TDD de migración `0009`,
  seed 4 dog/3 cat, catálogo, CRUD con guard/auditoría y `nextVaccine` → primer
  reviewer **rechazó** R8 (fecha calendario inválida devolvía 500) y detectó
  que el seed no purgaba extras y POST aceptaba `documentKey`; regresiones
  comprometidas primero (`5d53ac3`) y fixes después (`eb9c67b`) → segunda
  revisión **APROBADA**. Verificación independiente: 117 suites/843 unit y
  13 suites/181 e2e, build/lint/typecheck verdes. Feature marcada `done`;
  branch `feature/14-health-vaccines`, sigue PR + merge humano. Próximo: #15.

- **2026-08-07 (3)** — Ciclo corto de fix, sin id: **los e2e entran en el
  gate**. Al cerrar #13 se descubrió que `init.sh` nunca había ejecutado los
  e2e y que CI, que corre `init.sh`, tampoco — 12 features cerradas con sus
  criterios e2e nunca verificados automáticamente. Branch
  `fix/media-r8-localstack`: `E2E_CMD` + `E2E_REQUIRED_PORTS` en
  `init.config.sh` y un bloque en `init.sh` que comprueba los puertos 5432 y
  4566 antes de lanzarlos (infra ausente ⇒ aviso y sigue; infra presente y
  e2e rojo ⇒ exit 1). Al activarlos saltó `media.e2e-spec.ts::R8`, que
  resultó **no ser una vulnerabilidad**: el bucket tiene los cuatro flags de
  `PublicAccessBlock` en `true` y es LocalStack quien no los hace cumplir, así
  que el test comprobaba algo que el emulador no emula. `implementer`
  reescribió R8 contra la configuración efectiva sin tocar `src/` →
  `reviewer` **aprobó** tras reproducir él mismo la regresión en tres
  variantes (config borrada, 3 de 4 flags, policy pública: las tres rojas) más
  un caso de control que se mantiene verde, y tras verificar el gate de
  `init.sh` en ambas direcciones. Gate humano de #6 re-confirmado con fecha
  de hoy: la cláusula `THE SYSTEM SHALL` de R8 no cambió, solo su criterio de
  verificación. PR #29 mergeada. `main` verde con **832 unit + 166 e2e** — la
  primera vez que el harness verifica ambas cosas. Queda abierto que CI monte
  la infra para que esos e2e corran también en el runner.

- **2026-08-07 (2)** — Ciclo SDD completo de `alerts-center-notifier` (#13):
  `spec_author` (30 EARS, D1-D6 con propuesta explícita cada una) → **gate
  humano** aprobado en chat con las seis propuestas confirmadas → `implementer`
  (TDD por R-id: `push_tokens` + endpoints, worker `notifier` con puerto
  `PushSender` y sus dos adaptadores, módulo `alerts`, `time_away_minutes`,
  migración `0008`) → primer `reviewer` **cancelado por el humano** a mitad de
  camino (sin veredicto, no llegó a escribir su archivo; el harness no permite
  reanudar un agente detenido) → el leader verificó a mano los dos puntos que
  ese reviewer había dejado señalados → `reviewer` nuevo **aprobó** sin
  bloqueantes. 832 unit tests verdes, e2e propio verde, trazabilidad 30/30.
  **Bug B1 no se repitió**: los 4 archivos de spec quedaron en `approved`.
  **Pero el checkbox del gate volvió a llegar marcado por el `spec_author`**
  (con la fecha vacía) — tercera vez que un agente toca el gate que no le
  corresponde; queda anotado en `requirements.md` §Aprobación. A diferencia de
  #12, esta vez el leader aceptó un "listo, puedes continuar" de chat como
  aprobación en vez de exigir confirmación D-por-D vía `AskUserQuestion`; las
  D1-D6 se registraron por escrito antes de lanzar al `implementer`.
  **Hallazgo mayor, ajeno a la feature**: `init.sh` nunca ha ejecutado los e2e
  (detalle y consecuencias en "Estado actual"), lo que a su vez desmiente el
  diagnóstico de "flakiness" que la sesión de #12 dio al fallo de
  `media.e2e-spec.ts::R8` — es determinista y apunta a un bucket S3 accesible
  sin firma, criterio de aceptación de #6. Ambos quedan pendientes de decisión
  humana, ninguno bloquea #13. Anotado también un `DrizzleQueryError` (FK
  `pet_users_user_id_users_id_fk`) que aparece durante los e2e sin tumbar
  ningún test: el reviewer descartó carrera entre suites
  (`test/jest-e2e.json` fija `maxWorkers: 1`), queda como promesa no esperada
  u orden de `afterAll` dentro de una sola suite. Deuda declarada en la spec:
  `DeviceNotRegistered` solo se atiende vía tickets inmediatos, no vía
  receipts diferidos de Expo. Feature marcada `done`, branch
  `feature/13-alerts-center-notifier`. Próximo: `health-vaccines` (#14).

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
  Feature marcada `done`, branch `feature/12-alerts-engine` pusheada, PR
  #25 abierta por el humano. Hallazgo de seguridad ajeno reportado al
  humano sin tocar: PAT de GitHub en texto plano en `.mcp.json` (cambio
  preexistente a la sesión, no commiteado). **Continuación same-day**: CI
  de la PR #25 salió roja (guarda R19 sensible a CRLF/LF, ver bullet
  "Corrección post-cierre" arriba) — reabierta a `in_progress`,
  `implementer` fix (`c4f09e5`) → `reviewer` re-aprobó verificando contra
  el log real de CI → push → **CI verde confirmado en el runner real**,
  vuelta a `done`. 8 commits en total en la branch. Próximo:
  `alerts-center-notifier` (#13).

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
- **Infra local**: LocalStack community por defecto (`AWS_MODE=local`). Desde #19 el backend habla con AWS real vía `AWS_MODE=aws` + cadena de credenciales del SDK, con los recursos que despliega la stack de #20; desde #21 ese modo **aborta** si `AWS_ENDPOINT_URL` sigue definida, en vez de caer en LocalStack sin avisar. Arquitectura objetivo serverless en `plans/README.md`
- **Tests**: Jest + supertest
