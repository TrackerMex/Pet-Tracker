# Plan 003: Autenticación y usuarios con Cognito (registro, login, recuperación, /me)

> **Instrucciones para el ejecutor**: sigue el plan paso a paso; verifica cada paso; ante STOP, detente y reporta. Al terminar actualiza `plans/README.md` y `STATUS.md`.
>
> **Chequeo de deriva**: deben existir `docs/api/openapi.yaml`, `apps/api/src/lambda.ts`, el stack `PetTracker-dev` desplegado (outputs en `infra/cdk-outputs.json`) y `curl <ApiUrl>/v1/health` → 200. Si algo falta, STOP: el plan 002 no está completo.

## Estado

- **Prioridad**: P1 · **Esfuerzo**: M · **Riesgo**: MED (toca authorizer y triggers de Cognito)
- **Depende de**: `plans/002-fundaciones-monorepo-infra.md`
- **Categoría**: direction (MVP items 1–2 del brief §20)

## Por qué importa

Sin identidad no hay nada: cada recurso se autoriza por usuario y por mascota (brief §4, §19). Este plan cubre registro con verificación de email, login, recuperación de contraseña y perfil, usando Cognito para no escribir ni una línea de gestión de contraseñas. Deja además el mecanismo (guard + usuario en BD) del que dependen todos los módulos posteriores.

## Estado actual

- Cognito User Pool + App Client creados en 002 (`infra/lib/auth.ts`), con `ALLOW_USER_PASSWORD_AUTH` habilitado para scripts de prueba.
- HTTP API con JWT authorizer en `ANY /v1/{proxy+}`; la Lambda NestJS ya recibe solo peticiones con JWT válido (salvo `/v1/health`).
- Tabla `users` migrada (ver `docs/data-model.md`): fila por usuario con `cognito_sub` UNIQUE.
- La app Expo tiene `aws-amplify` v6 configurado y `app/(auth)/` placeholder.
- Contrato: endpoints `GET/PATCH /v1/me`, `POST/DELETE /v1/me/push-tokens` en `docs/api/openapi.yaml`. Registro/login/recuperación son flujos del SDK contra Cognito, no endpoints propios.

## Comandos

Los de `plans/002` (tabla "Comandos"): `npm run verify`, `npm -w apps/api test`, `npm -w infra run deploy:dev`, `npm -w apps/mobile run start`. Nuevo en este plan: `npm -w apps/api run token:dev -- <email> <password>` (script que imprime un ID token, ver paso 4).

## Alcance

**Dentro**: `infra/lib/auth.ts` (trigger post-confirmation), `infra/lib/api.ts` (solo si hay que pasar nuevas env), `apps/api/src/modules/auth/**` (guard, decorador, tipos de claims), `apps/api/src/modules/users/**` (/me, push-tokens), Lambda `post-confirmation` (`apps/api/src/handlers/post-confirmation.ts` como `NodejsFunction` propia), `apps/api/scripts/get-token.ts`, `apps/mobile/app/(auth)/**` y `apps/mobile/src/auth/**`, `docs/api/openapi.yaml` si algo cambia.

**Fuera**: roles por mascota y `pet_users` (plan 004), pantallas de mascotas, login social/OAuth, SES/emails personalizados (Cognito envía con su remitente por defecto, límite ~50 emails/día — suficiente en dev), MFA.

## Flujo git

`main`. Commits sugeridos: `feat(infra): post-confirmation trigger to provision users`, `feat(api): auth guard and users module (/me, push tokens)`, `feat(mobile): auth screens with cognito flows`.

## Pasos

### Paso 1: Trigger post-confirmation → fila en `users`

Lambda `post-confirmation` (NodejsFunction separada de la API, mismo esquema Drizzle vía import de `apps/api/src/db`): al confirmarse un registro en Cognito, inserta en `users` (`cognito_sub` = `event.request.userAttributes.sub`, email, given_name→first_name, family_name→last_name, phone_number→phone, `custom:country`→country, zoneinfo→timezone con default 'UTC'). Insert idempotente (`onConflictDoNothing` sobre `cognito_sub`). Conectarla al User Pool (`userPool.addTrigger(UserPoolOperation.POST_CONFIRMATION, fn)`) con permisos Data API. Desplegar.

**Verificar**: `npm -w infra run deploy:dev` exit 0; en la consola o vía CLI `aws cognito-idp describe-user-pool` el trigger aparece.

### Paso 2: Guard de autenticación en NestJS

Con HTTP API + JWT authorizer, las claims llegan en el evento de API Gateway, no en el header. En `apps/api/src/modules/auth/`:

- `current-invoke.ts`: usar `getCurrentInvoke()` de `@codegenie/serverless-express` para leer `event.requestContext.authorizer.jwt.claims` (sub, email). En local (sin Lambda), fallback: decodificar el JWT del header `Authorization` **sin verificar firma solo si** `STAGE=local` (en AWS la firma ya la validó el authorizer).
- `auth.guard.ts` (global, excepto rutas marcadas `@Public()` como health): resuelve claims → busca `users` por `cognito_sub` → adjunta `req.user = {id, cognitoSub, email}`. Si no hay fila (usuario confirmado antes del trigger, caso raro), la crea con los datos del token (mismo upsert del paso 1).
- Decorador `@CurrentUser()` para controladores.

**Verificar**: test unitario del guard (claims presentes → user adjunto; sin claims → 401) — `npm -w apps/api test` pasa.

### Paso 3: Módulo users

`GET /v1/me` → fila de `users` (camelCase). `PATCH /v1/me` → DTO con `firstName?`, `lastName?`, `phone?`, `country?`, `timezone?` (validar timezone contra `Intl.supportedValuesOf('timeZone')`). `POST /v1/me/push-tokens` `{expoToken, platform}` → upsert en `push_tokens` (unique por token, actualiza `last_seen_at`). `DELETE /v1/me/push-tokens/:token`. Registrar acciones en `audit_log` (action: 'user.update', 'push_token.add').

**Verificar**: tests de servicio (upsert de token idempotente; patch parcial) pasan.

### Paso 4: Script de token para pruebas

`apps/api/scripts/get-token.ts` (script npm `token:dev`): usa `@aws-sdk/client-cognito-identity-provider` `InitiateAuthCommand` con `USER_PASSWORD_AUTH` (ClientId del output CDK) y también soporta `--signup <email> <pass>` y `--confirm <email> <code>` para crear usuarios de prueba por CLI. Imprime el ID token.

**Verificar** (flujo e2e real, documentar salidas en el reporte):
1. `npm -w apps/api run token:dev -- --signup test1@example.com Passw0rd!` → "confirmation required" (llega código al email si es real; para pruebas usar un email accesible del ejecutor o `aws cognito-idp admin-confirm-sign-up`).
2. Confirmar; luego `token:dev -- test1@example.com Passw0rd!` → imprime token.
3. `curl -H "Authorization: Bearer <token>" <ApiUrl>/v1/me` → 200 con email y nombres (la fila la creó el trigger).
4. `curl -X PATCH ... /v1/me -d '{"country":"MX"}'` → 200, país actualizado.

### Paso 5: Pantallas de auth en Expo

Con Amplify v6 (`signUp`, `confirmSignUp`, `signIn`, `resetPassword`, `confirmResetPassword`, `fetchAuthSession`):

- `app/(auth)/welcome.tsx` (logo/pastel, botones Crear cuenta / Iniciar sesión), `register.tsx` (campos del brief §6: nombres, apellidos, email, teléfono, contraseña×2, país, zona horaria autodetectada con `Intl`, checkbox de términos obligatorio), `confirm.tsx` (código de 6 dígitos), `login.tsx`, `forgot.tsx` (email → código → nueva contraseña).
- Sesión: Amplify persiste tokens; gate en `app/_layout.tsx`: sin sesión → `(auth)`, con sesión → `(tabs)`. Cliente HTTP central (`src/api/client.ts`) que inyecta el ID token de `fetchAuthSession()` en `Authorization` y apunta a `EXPO_PUBLIC_API_URL`.
- Al entrar con sesión: llamar `GET /v1/me` y guardarlo en un store ligero (Context o zustand — elegir zustand solo si ya se quiere store global; Context basta).
- Textos en español; validaciones con mensajes claros (contraseñas no coinciden, email inválido, términos sin aceptar).

**Verificar**: `npm -w apps/mobile run typecheck` exit 0; flujo manual en Expo Go: registro → código → login → se ve la tab Inicio con el nombre del usuario. Si no hay dispositivo/emulador disponible, verificar typecheck + revisar navegación y reportar que la prueba manual queda pendiente.

### Paso 6: Cierre

`docs/api/openapi.yaml` al día. `STATUS.md` + fila 003 DONE. Commits.

**Verificar**: `npm run verify` exit 0; `git status` limpio.

## Plan de pruebas

- Unitarios api: guard (2 casos), users service (patch parcial, upsert token, delete token), post-confirmation handler (insert + conflicto). Patrón: `*.spec.ts` junto al código, como el health test de 002.
- E2E manual del paso 4 (curl con token real) — pegar salidas en el reporte.

## Criterios de done

- [ ] `npm run verify` exit 0; nuevos tests presentes y en verde.
- [ ] Flujo curl del paso 4 completo con 200s reales contra dev.
- [ ] Registro→confirmación→login funcionan desde la app (o typecheck+pendiente manual reportado).
- [ ] `pets` sigue devolviendo 401 sin token (authorizer intacto).
- [ ] OpenAPI, `STATUS.md`, fila 003 actualizados.

## Condiciones de STOP

- El authorizer rechaza tokens válidos (401 con token fresco) tras revisar issuer/audience una vez → STOP con la config exacta del authorizer y del App Client.
- Las claims no llegan vía `getCurrentInvoke()` (estructura del evento distinta) → STOP con un dump del `requestContext` (sin tokens completos) en el reporte.
- El email de confirmación de Cognito no llega en dev → usar `admin-confirm-sign-up` para no bloquear y anotar el tema (SES pendiente, plan 010); solo STOP si tampoco funciona la confirmación admin.
- Cualquier cambio que parezca requerir guardar contraseñas o tokens de refresh en BD propia → STOP: eso contradice el diseño.

## Notas de mantenimiento

- El guard + `@CurrentUser()` es el contrato de identidad de los planes 004–010; no cambiar su firma sin revisarlos.
- El fallback de decodificación sin firma SOLO puede activarse con `STAGE=local`; el revisor debe confirmar que no hay camino a producción con ese flag.
- Post-MVP: SES para emails con marca, MFA opcional, login social — deliberadamente fuera.
