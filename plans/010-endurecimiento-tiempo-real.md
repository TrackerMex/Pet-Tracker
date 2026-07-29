# Plan 010: Endurecimiento, tiempo real (WebSocket) y observabilidad

> **Instrucciones para el ejecutor**: paso a paso, verificando cada paso; ante STOP, detente y reporta. Al terminar actualiza `plans/README.md` y `STATUS.md`.
>
> **Chequeo de deriva**: MVP funcional completo (planes 003–009 DONE en `plans/README.md`; si 008/009 siguen TODO este plan puede ejecutarse igual, salvo el paso 5 que audita todo el API). El bus emite `position.updated` y el centro de alertas funciona (plan 007).

## Estado

- **Prioridad**: P2 · **Esfuerzo**: M · **Riesgo**: MED (toca autenticación de un canal nuevo y límites globales)
- **Depende de**: `plans/007-geocercas-alertas-push.md`
- **Categoría**: security + perf + dx
- **Planeado en**: sin repo (2026-07-28)

## Por qué importa

Cierra los requisitos transversales del brief §19 (límites de solicitudes, historial de accesos, protección de claves y coordenadas) y sustituye el polling de 15 s del mapa por el "tiempo real" prometido en §9, con la variante serverless elegida en el diseño: API Gateway WebSocket API. Añade la observabilidad mínima para operar: alarmas sobre DLQs y errores, y presupuesto ya existente.

## Estado actual

- Mapa móvil refresca por polling cada 15 s (plan 005). Eventos `position.updated` y alertas ya fluyen por EventBridge (plan 007).
- Tabla DynamoDB `ws_connections` diseñada en `docs/data-model.md` pero NO desplegada.
- HTTP API sin throttling explícito; Lambdas sin alarmas; `audit_log` se escribe pero no se consulta.
- Fotos huérfanas en S3 (deuda del plan 004).

## Comandos

Los de `plans/002` + `token:dev`. Nuevo: `npx wscat -c "<WsUrl>?token=<idToken>"` para probar el WebSocket (dev-dep `wscat` en la raíz o `npx -y`).

## Alcance

**Dentro**: `infra/lib/realtime.ts` (WebSocket API, tabla `ws_connections`, Lambdas connect/disconnect/authorizer, broadcaster), `apps/api/src/handlers/ws-connect.ts`, `ws-disconnect.ts`, `ws-authorizer.ts`, `ws-broadcaster.ts`, throttling en `infra/lib/api.ts`, alarmas en `infra/lib/observability.ts` (nuevo), lifecycle S3 en `lib/data.ts`, `apps/mobile/src/realtime/useLivePosition.ts` (hook WS con fallback a polling), `docs/architecture.md` (sección tiempo real actualizada), `SECURITY-REVIEW.md` (paso 5).

**Fuera**: entorno prod, dominios custom, SES, CI/CD en la nube (deuda declarada; scripts `npm run verify` siguen siendo el gate), X-Ray, provisioned concurrency, exportación/eliminación de cuenta (§19 — queda como issue documentado en STATUS, requiere decisión de producto sobre retención).

## Flujo git

`main`. Commits: `feat(infra): websocket api with authorized connections`, `feat(api): position broadcaster`, `feat(mobile): live position over websocket with polling fallback`, `feat(infra): throttling, alarms and s3 lifecycle`, `docs: security review checklist`.

## Pasos

### Paso 1: WebSocket API + conexiones

`infra/lib/realtime.ts`: `WebSocketApi` (aws-apigatewayv2) con rutas `$connect` (authorizer Lambda REQUEST que valida el JWT de Cognito pasado como query `?token=` — verificar firma contra el JWKS del User Pool con `aws-jwt-verify`), `$disconnect`, `$default` (no-op). Tabla `ws_connections` (PK user_id, SK connection_id, TTL 2 h). `ws-connect.ts`: guarda conexión; `ws-disconnect.ts`: la borra. Stage `dev` con auto-deploy. Output `WsUrl`.

**Verificar**: `npx -y wscat -c "<WsUrl>?token=<idToken válido>"` → conecta (101) y aparece item en la tabla; con token inválido → rechazo 401/403; al cerrar, el item desaparece.

### Paso 2: Broadcaster

`ws-broadcaster.ts`: regla EventBridge sobre `position.updated` y sobre los mensajes de alerta (reutilizar detalle emitido en 007 — si las alertas solo van por SQS, añadir en el geofence-engine un `PutEvents` `alert.created`; anotarlo). Por evento: usuarios con acceso a la mascota (`pet_users`) → conexiones en `ws_connections` → `PostToConnection` (`@aws-sdk/client-apigatewaymanagementapi`) con `{type:'position'|'alert', petId, payload}`; `GoneException` → borrar conexión. Cuidado con fan-out: máx 2 llamadas a BD por evento (una a Postgres, un BatchGet/Query a la tabla de conexiones).

**Verificar**: test unitario con mocks (envía a 2 conexiones, borra la Gone); e2e: wscat conectado + simulador activo → llegan frames `position` cada ~1 min.

### Paso 3: Hook móvil con fallback

`useLivePosition(petId)`: abre WS con el idToken (`fetchAuthSession`), escucha frames de esa mascota, actualiza el marcador; reconexión con backoff (1 s→30 s); si el WS falla 3 veces seguidas → degradar a polling 15 s (código del plan 005) y reintentar WS a los 2 min. Reemplazar el polling directo en `location.tsx` y el badge de alertas por frames `alert`.

**Verificar**: typecheck exit 0; manual: mapa se mueve sin pull-to-refresh; modo avión 10 s → reconecta o cae a polling (log visible en consola de desarrollo).

### Paso 4: Límites, alarmas y limpieza

- Throttling HTTP API: `defaultRouteSettings` rate 50 rps / burst 100 (dev); WebSocket igual. (Brief §19 "límites de solicitudes".)
- `infra/lib/observability.ts`: alarmas CloudWatch — `ApproximateNumberOfMessagesVisible > 0` durante 10 min en cada DLQ; `Errors > 5/5 min` en api-handler, position-processor, notifier, broadcaster; acción: SNS topic `pet-tracker-alarms-dev` con suscripción email `alexfdgf32@gmail.com` (confirmar suscripción manualmente, anotar en reporte).
- S3 lifecycle: prefijo `pets/` — abortar multipart a 7 días; expirar versiones no actuales si versioning se activó (si no, regla de limpieza queda solo para huérfanas vía inventario — documentar como deuda si no hay versioning).
- Logs: confirmar que ningún log imprime tokens, claves SSM ni coordenadas junto a identificadores de usuario en nivel info (grep dirigido, paso 5).

**Verificar**: `npm -w infra run deploy:dev` exit 0; alarmas visibles (`aws cloudwatch describe-alarms` → ≥6); throttling responde 429 con `hey`/curl en ráfaga (o documentar el ajuste probado).

### Paso 5: Revisión de seguridad contra el brief §19

Crear `SECURITY-REVIEW.md` con la checklist verificada punto por punto, cada una con evidencia (comando o referencia de código): HTTPS extremo a extremo (API GW/WS) · contraseñas solo en Cognito · JWT verificado en HTTP (authorizer) y WS (paso 1) · permisos por mascota (`PetAccessGuard`, test IDOR del plan 004) · validación de propiedad del dispositivo (claim 005) · `audit_log` escribiéndose en todas las mutaciones (grep de `audit` por módulo; huecos → arreglarlos aquí) · enlaces temporales = URLs prefirmadas con expiración · claves solo en SSM/backend (`grep -rn "sk-\|AKIA\|SecureString" apps/mobile/` → sin hallazgos; grep de `EXPO_PUBLIC_` → solo ApiUrl/WsUrl/PoolIds, nunca claves) · rate limits (paso 4) · coordenadas nunca en respuestas de mascotas sin membresía (revisión de DTOs). Los puntos §19 no cubiertos (exportación/eliminación, historial de accesos consultable en UI) → sección "Pendientes post-MVP" con justificación.

**Verificar**: `SECURITY-REVIEW.md` existe con evidencia por punto; los greps citados devuelven lo esperado.

### Paso 6: Cierre

`docs/architecture.md` (tiempo real real), `STATUS.md` (MVP completo + WsUrl), fila 010 DONE, commits.

**Verificar**: `npm run verify` exit 0; `git status` limpio.

## Plan de pruebas

- Unitarios: ws-authorizer (token válido/expirado/ausente), broadcaster (fan-out + Gone), hook móvil (reducer de reconexión si es testeable sin dispositivo).
- E2E con evidencia: wscat autorizado recibiendo frames del simulador; 401 con token malo.

## Criterios de done

- [ ] `npm run verify` exit 0.
- [ ] Evidencia wscat: conexión autenticada + frames `position` reales; token inválido rechazado.
- [ ] Mapa móvil en vivo sin polling (o fallback demostrado).
- [ ] ≥6 alarmas creadas y suscripción de email confirmada.
- [ ] 429 demostrado bajo ráfaga.
- [ ] `SECURITY-REVIEW.md` completo, con los greps de claves limpios.
- [ ] `STATUS.md`, `docs/architecture.md`, fila 010 al día.

## Condiciones de STOP

- El authorizer de `$connect` no puede validar el JWT (JWKS inaccesible, clock skew) tras una revisión → STOP; NO abrir el WebSocket sin auth "temporalmente".
- `PostToConnection` requiere permisos sobre un ARN de stage distinto al desplegado (error 403 persistente) → STOP con el ARN exacto probado.
- El grep de claves en `apps/mobile` encuentra algo → STOP inmediato y repórtalo (sin pegar el valor), aunque el hallazgo venga de planes anteriores.
- Si el fan-out del broadcaster necesitara consultar Postgres por conexión (N+1) → STOP y propone cache; no lo implementes sin reportar.

## Notas de mantenimiento

- El WS reduce el polling pero la app debe conservar el fallback para siempre (redes hostiles, App Gateway caído): no eliminar el código de polling.
- Con usuarios reales, la tabla `ws_connections` necesitará GSI por connection_id para el disconnect (hoy se resuelve con scan pequeño o clave compuesta — revisar coste al crecer).
- Siguientes pasos naturales tras este plan (no incluidos): stage prod con retención/backup de Aurora, CI en GitHub Actions ejecutando `npm run verify` + `cdk diff`, SES para emails de Cognito, modo mascota perdida (§13).
