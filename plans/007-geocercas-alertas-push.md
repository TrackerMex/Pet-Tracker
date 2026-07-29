# Plan 007: Geocercas, motor de alertas y notificaciones push

> **Instrucciones para el ejecutor**: paso a paso, verificando cada paso; ante STOP, detente y reporta. Al terminar actualiza `plans/README.md` y `STATUS.md`.
>
> **Chequeo de deriva**: el evento `position.updated` debe estar emitiéndose al bus `pet-tracker-dev` (logs del position-processor, plan 005), la cola SQS `notifications` + DLQ debe existir (plan 002) y `alert_events` + `geofences` deben estar migradas con el índice único parcial anti-spam (plan 002, según `docs/data-model.md`). Si no, STOP.

## Estado

- **Prioridad**: P1 · **Esfuerzo**: L · **Riesgo**: MED (motor de estados + push en dispositivo real)
- **Depende de**: `plans/006-recorridos-actividad.md`
- **Categoría**: direction (MVP items 10–11 y 20 del brief §20)

## Por qué importa

Es la promesa central de seguridad del producto: "¿mi mascota está segura?" (brief §18). Implementa la geocerca segura, el motor de eventos entrada/salida con la regla anti-spam del brief §12 (un evento abierto no re-alerta hasta cambio relevante o regreso), y el canal push completo (EventBridge → SQS → Lambda notificadora → Expo Push → centro de alertas en la app). Con esto el patrón serverless del PDF queda ejercitado de punta a punta.

## Estado actual

- Bus con `position.updated` (detail: `{version:1, petId, deviceId, position:{lat,lng,ts,accuracy,battery}, batteryPct}`) y `battery.low` emitidos por el processor (plan 005). Nadie los consume aún.
- `geofences` (geometry jsonb circular/poligonal) y `alert_events` (índice único parcial: un 'open' por (pet, type, geofence)) migradas. `push_tokens` con upsert desde el plan 003.
- Cola `notifications` + DLQ sin consumidor.
- OpenAPI: CRUD de geofences, `GET /v1/alerts`, `POST /v1/alerts/{id}/ack` (plan 001). MVP: `type=safe_circle` únicamente.
- App: registro de push tokens pendiente de UI (endpoint listo del plan 003); mapa operativo (plan 005).

## Comandos

Los de `plans/002` + `token:dev`. Push real requiere **development build** (EAS) en Android — Expo Go ya no soporta push Android; ver paso 5.

## Alcance

**Dentro**: `apps/api/src/modules/geofences/**` (CRUD, MVP circular), `apps/api/src/pipeline/geofence-eval.ts` (matemática pura + máquina de estados), `apps/api/src/handlers/geofence-engine.ts`, `apps/api/src/handlers/notifier.ts`, `infra/lib/alerts.ts` (reglas EventBridge → targets), `apps/api/src/modules/alerts/**` (centro de alertas + ack), dependencia `expo-server-sdk` en la api, `apps/mobile`: pantalla crear/editar geocerca sobre el mapa, centro de alertas (tab o campana), registro del push token al iniciar sesión, `eas.json` mínimo para development build.

**Fuera**: geocercas múltiples avanzadas/polígonos en UI (el backend acepta polígono por contrato; la UI MVP solo círculo — brief §20.10 pide UNA geocerca segura), modo mascota perdida (post-MVP §21), horarios inusuales y `device_offline`/`position_stale` (post-MVP; dejar los `type` definidos), escalaciones, canal email/SMS, preferencias finas de notificación (§17 completo) — solo on/off por tipo en `users` no se toca: se difiere entero.

## Flujo git

`main`. Commits: `feat(api): geofence crud and evaluation engine`, `feat(infra): eventbridge rules and notifier`, `feat(api): alerts center`, `feat(mobile): geofence editor, alert center and push registration`.

## Pasos

### Paso 1: CRUD de geocercas

`geofences.controller/service` (PetAccessGuard; crear/editar owner): `POST /v1/pets/:petId/geofences` `{name, type:'safe_circle', geometry:{lat,lng,radiusM}}` — validar radiusM entre 20 y 2000; máx 5 geocercas por mascota (MVP); `GET`, `PATCH`, `DELETE`. Audit.

**Verificar**: curls 201/200; radio 10 → 400; mascota ajena → 404.

### Paso 2: Evaluación pura (`pipeline/geofence-eval.ts`)

- `isInside(position, geometry): boolean` — círculo: haversine(centro, punto) ≤ radiusM; polígono: ray-casting (implementarlo ya: 15 líneas, lo usa post-MVP).
- **Histéresis anti-parpadeo**: para disparar "salida" el punto debe estar fuera de radio × 1.1 y con accuracy ≤ 50 m; para "entrada", dentro de radio × 0.9. Puntos `low_accuracy` no cambian estado.
- `evaluate(current: 'inside'|'outside'|'unknown', position, geometry): {next, event: 'exit'|'enter'|null}` — máquina de estados pura; `unknown` se resuelve sin emitir evento (primera posición solo fija estado).

**Verificar**: tests unitarios: dentro→fuera emite exit; fuera→fuera no re-emite; borde con histéresis (fuera a radio×1.05 no dispara); low_accuracy ignorado; unknown inicial silencioso; polígono cuadrado con punto dentro/fuera.

### Paso 3: Motor de geocercas (Lambda `geofence-engine`)

Regla EventBridge (`source: pet-tracker`, `detailType: position.updated`) → Lambda: carga geocercas activas de la mascota + estado actual (persistir estado por (pet, geofence) — usar `alert_events` abierto como "está fuera" y una columna nueva NO: mantenerlo simple, guardar estado en atributo `geofence_state` jsonb en `geofences` `{state, updatedAt}`); ejecuta `evaluate` por geocerca:

- `exit` → intenta `INSERT` en `alert_events` (type 'geofence_exit', geofence_id, payload con posición); si el índice único parcial rechaza (ya hay open) → **no notificar** (regla anti-spam §12). Si insertó → mensaje a SQS `notifications`: `{kind:'alert', alertId, petId, title:'⚠ <nombre> salió de <geocerca>', body:'Última posición hace X', data:{petId, alertId}}`.
- `enter` con open existente → cierra el evento (status 'closed', closed_at) y notifica "regresó a <geocerca>" (kind 'alert_resolved').
- Actualiza `geofence_state`.
- Consumir también `battery.low` (regla propia): mismo flujo con type 'battery_low' (anti-spam idéntico; se cierra cuando batería ≥ 30 en un `position.updated` — chequeo barato en el mismo handler).

La columna `geofence_state` es una migración menor: añadirla al esquema + `docs/data-model.md` (anotar en STATUS como en plan 006).

**Verificar**: tests del handler con mocks (exit inserta y encola; exit repetido no encola; enter cierra y encola resolved). Deploy + simulador: mover `SIM_HOME_LAT/LNG` o crear la geocerca lejos del paseo simulado → en ≤2 min: fila open en `alert_events`, mensaje consumido, log del notifier.

### Paso 4: Notificadora (Lambda `notifier`) + centro de alertas

- `notifier.ts` (event source SQS `notifications`, batch 10): por mensaje → `push_tokens` de los usuarios con acceso a la mascota (join `pet_users`; MVP: todos los miembros) → `expo-server-sdk`: chunks, envío, procesar tickets (token `DeviceNotRegistered` → borrar fila). Sin tokens → log y fin (no error). `PUSH_ENABLED=false` (env) → solo log estructurado `{wouldSend: payload}` (modo usado hasta probar el build).
- Alerts API: `GET /v1/alerts?status=open|acked|closed` (todas mis mascotas, orden desc, paginado), `POST /v1/alerts/:id/ack` (miembro de la mascota del alert; open→acked; audit). Nota: ack ≠ closed — closed solo lo pone el motor al resolverse (regreso/batería ok).
- Rellenar `time_away_minutes` en el agregador del plan 006: minutos del día con estado 'outside' de la geocerca type 'home' o la primera safe_circle (leer `geofence_state` histórico es imposible — calcular desde `alert_events` open/closed del día; documentar la aproximación en JSDoc).

**Verificar**: tests del notifier (chunking, token muerto borrado, sin tokens no falla); curls del centro de alertas (open visible tras la salida simulada; ack → 200 y status cambia).

### Paso 5: App — geocerca, alertas y push

- **Editor de geocerca** (`pets/[petId]/geofence.tsx`, acceso desde perfil/mapa): mapa con círculo arrastrable (centro = pin, radio con slider 20–2000 m, visual pastel translúcido), nombre con sugerencias ("Casa", "Parque"), guardar → POST. Lista simple si ya existen (máx 5).
- **Centro de alertas**: campana con badge (count open) en el header de tabs → lista (icono por tipo, título, hace cuánto, estado) → detalle con mini-mapa de la posición del payload → botón "Enterado" (ack).
- **Push**: al iniciar sesión, pedir permiso (`expo-notifications`), obtener `ExpoPushToken` (necesita `projectId` de EAS en `app.config.ts`) y `POST /v1/me/push-tokens`. Handler de notificación en primer plano (banner in-app) y tap → navegar a la alerta (`data.alertId`). Configurar `eas.json` (profile development) y documentar en el README móvil: `npx eas build --profile development --platform android` para probar push real (Expo Go Android no sirve); en iOS sin cuenta de developer, push queda pendiente y se anota.
- Al activar push real: poner `PUSH_ENABLED=true` en la Lambda notifier (env vía CDK) y redeploy.

**Verificar**: typecheck exit 0. Manual mínimo (evidencia): con `PUSH_ENABLED=false`, el log del notifier muestra el payload correcto tras una salida simulada. Manual completo (si hay Android + EAS): push real recibido, tap abre la alerta. Reportar cuál de los dos niveles se alcanzó.

### Paso 6: Cierre

OpenAPI, `docs/data-model.md` (geofence_state), `STATUS.md`, fila 007 DONE, commits.

**Verificar**: `npm run verify` exit 0; `git status` limpio; DLQ de notifications en 0.

## Plan de pruebas

- Unitarios (núcleo): geofence-eval (7 casos del paso 2), engine handler (anti-spam: exit/exit/enter → 1 open, 1 resolved), notifier (3 casos).
- Integración con evidencia: salida simulada → alerta open → notificación (log o push real) → ack por API.

## Criterios de done

- [ ] `npm run verify` exit 0 con las suites nuevas.
- [ ] Evidencia end-to-end: salida de geocerca simulada produce exactamente UNA alerta open y una notificación; el regreso la cierra.
- [ ] Segundo cruce sin regreso NO re-notifica (anti-spam probado y en el reporte).
- [ ] Centro de alertas y ack funcionando por API y visibles en app.
- [ ] Push: payload correcto en log (mínimo) o push real en Android (ideal); nivel alcanzado reportado.
- [ ] OpenAPI, data-model, `STATUS.md`, fila 007 al día.

## Condiciones de STOP

- El estado inside/outside oscila con el simulador pese a la histéresis → STOP con una traza de posiciones y estados; ajustar umbrales es decisión de producto.
- Expo push devuelve `InvalidCredentials`/error de proyecto → revisar `projectId` una vez; si persiste, STOP (falta configuración EAS del usuario) y deja `PUSH_ENABLED=false`.
- La regla EventBridge no invoca la Lambda (0 invocaciones con eventos fluyendo) → revisar el pattern una vez (source/detailType exactos); si persiste, STOP con el pattern desplegado.
- Cualquier necesidad de que la app consulte Wialon o reciba pushes con coordenadas de otra mascota → STOP: violación del modelo de permisos.

## Notas de mantenimiento

- El motor lee estado de `geofences.geofence_state`: si en el futuro hay procesamiento concurrente por mascota, hará falta lock optimista (version) — anotado como riesgo conocido, no MVP.
- 'device_offline' y 'position_stale' (§12) encajan como regla Scheduler cada 5 min sobre `last_message_at` — post-MVP, los `type` ya existen.
- El modo mascota perdida (§13) reutiliza este motor (frecuencia + enlace temporal): no duplicar canal de notificaciones cuando llegue.
- Revisor: comprobar el índice único parcial en la migración real (es la garantía anti-spam) y que el notifier nunca loguea tokens completos.
