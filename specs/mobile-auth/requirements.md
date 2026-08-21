---
feature: "mobile-auth"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-auth]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (D1–D10). Las capas de
> `docs/architecture.md` son de backend y NO aplican a esta app; sí aplican
> kebab-case, tests que nombran su R-id y conventional commits
> (`docs/conventions.md` §Convenciones de la app móvil).
> Contratos del backend verificados contra el código real el 2026-08-20
> (ver [[design]] §Contratos verificados).

## Contexto fijo (no reabrir)

- Base: stack de #32 ya implementado (HeroUI Native 1.0.8 + uniwind +
  expo-router, providers en `src/app/_layout.tsx`, jest-expo + RTL con el
  bloque jest de `mobile-pet-tracker/package.json`).
- Backend: `POST /v1/auth/login` y `POST /v1/auth/register` existen
  (`backend-pet-tracker/src/modules/auth/infrastructure/auth.controller.ts`).
  **`forgot-password` NO existe en el backend** (verificado 2026-08-20 con
  grep sobre `backend-pet-tracker/src`): la pantalla Forgot va como stub
  deshabilitado (R9) y la feature backend queda anotada en el backlog
  (`feature_list.json` #44 `auth-forgot-password`).
- `EXPO_PUBLIC_API_URL` ya incluye el prefijo `/v1`
  (`mobile-pet-tracker/.env.example`: `http://192.168.x.x:3000/v1`); las
  rutas se componen como `${baseUrl}/auth/login`, igual que hace
  `src/api/health.ts` con `/health`.
- Decisión de la descripción de #33 (cerrada): las funciones de `src/api/`
  reciben `token`/`fetchFn` por parámetro y **nunca leen storage**; el
  storage (expo-secure-store) es exclusivo del `AuthProvider` (context
  mínimo).
- `expo-secure-store` está bundleado en Expo Go SDK 57 (verificado en
  `mobile-pet-tracker/node_modules/expo/bundledNativeModules.json`:
  `"expo-secure-store": "~57.0.1"`) — el smoke humano sigue siendo 100%
  Expo Go (`bunx expo start --go`), sin builds.
- **Diseño Figma**: no hay URL de Figma versionada en el repo. Esta spec
  fija estructura, testIDs y comportamiento; la fidelidad visual al diseño
  minimalista la juzga el humano en el gate R11 (puede adjuntar el link de
  Figma al aprobar esta spec si quiere que el implementador lo consulte).

## Excepción a C4 (configuración)

Instalar `expo-secure-store` (D1) y el archivo movido `src/app/health.tsx`
(R6, mudanza sin cambio de comportamiento) no nacen por TDD: los verifica la
suite existente en verde y el reviewer. Todo código nuevo (R1–R5, R7–R9)
sigue TDD estricto con test rojo primero.

## Requisitos funcionales

### Cliente API (`src/api/auth.ts`)

- **R1**: WHEN se llama `login(baseUrl, body, fetchFn)` de
  `mobile-pet-tracker/src/api/auth.ts` (firma exacta en [[design]] §D2)
  THE SYSTEM SHALL hacer `POST ${baseUrl}/auth/login` (mismo saneo de `/`
  final que `healthUrl`) con header `Content-Type: application/json` y body
  `JSON.stringify({ email, password })`, y devolver un
  `LoginState` discriminado por `kind`:
  - HTTP 200 → `{ kind: 'ok', accessToken }` (del campo `access_token` de
    la respuesta);
  - HTTP 401 → `{ kind: 'invalid-credentials' }`;
  - HTTP 400 con array `errors` → `{ kind: 'validation', errors }`
    (`{ path, message }[]` tal como los emite el backend);
  - cualquier otro status o body no parseable → `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }` sin llamar a
    `fetchFn`.
  *Test: `mobile-pet-tracker/src/api/__tests__/auth.test.ts` →
  `describe('R1: login mapea la respuesta por kind', ...)` con `fetchFn`
  stub por caso (mismo patrón que la suite de `fetchHealth`). ROJO primero.*

- **R2**: WHEN se llama `register(baseUrl, body, fetchFn)` de
  `mobile-pet-tracker/src/api/auth.ts` THE SYSTEM SHALL hacer
  `POST ${baseUrl}/auth/register` con el body JSON de `RegisterRequest`
  ([[design]] §D3) y devolver un `RegisterState`:
  - HTTP 201 → `{ kind: 'ok', user }` (shape `UserResponse` de [[design]]);
  - HTTP 409 → `{ kind: 'email-taken' }`;
  - HTTP 400 con array `errors` → `{ kind: 'validation', errors }`;
  - otro status / body no parseable → `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }`.
  *Test: mismo archivo → `describe('R2: register mapea la respuesta por kind', ...)`.
  ROJO primero.*

### Sesión (`src/providers/auth-provider.tsx`)

- **R3**: WHEN `AuthProvider` (nuevo,
  `mobile-pet-tracker/src/providers/auth-provider.tsx`, contrato exacto en
  [[design]] §D4) monta THE SYSTEM SHALL exponer vía `useAuth()`
  `status: 'loading'` mientras lee
  `SecureStore.getItemAsync('auth_token')`, y al resolver SHALL pasar a
  `{ status: 'authenticated', token }` si había token guardado o a
  `{ status: 'unauthenticated', token: null }` si no (o si la lectura
  lanza).
  *Test: `mobile-pet-tracker/src/providers/__tests__/auth-provider.test.tsx`
  → `describe('R3: restaura la sesión desde secure store', ...)` con
  `jest.mock('expo-secure-store')` y un componente consumidor de `useAuth`.
  ROJO primero.*

- **R4**: WHEN se llama `signIn(token)` del context THE SYSTEM SHALL
  persistir con `SecureStore.setItemAsync('auth_token', token)` y pasar a
  `authenticated`; WHEN se llama `signOut()` THE SYSTEM SHALL borrar con
  `SecureStore.deleteItemAsync('auth_token')` y pasar a `unauthenticated`.
  AND THE SYSTEM SHALL NOT importar `expo-secure-store` en ningún archivo
  bajo `mobile-pet-tracker/src/api/` (las funciones de api reciben
  token/fetchFn por parámetro).
  *Test: mismo archivo → `describe('R4: signIn y signOut', ...)` (ROJO
  primero). El aislamiento del storage lo verifica el reviewer:
  `grep -r "expo-secure-store" mobile-pet-tracker/src/api/` vacío.*

### Navegación por sesión

- **R5**: WHEN la ruta `/` (`mobile-pet-tracker/src/app/index.tsx`,
  reescrita como Splash) renderiza THE SYSTEM SHALL mostrar el splash
  minimalista ([[design]] §D5: logo `splash-icon.png` centrado sobre
  `bg-background`, `testID="splash-logo"`) WHILE `useAuth().status ===
  'loading'`, y al resolver SHALL devolver `<Redirect href="/health" />` si
  `authenticated` o `<Redirect href="/login" />` si `unauthenticated`.
  *Test: `mobile-pet-tracker/src/app/__tests__/index.test.tsx` (archivo
  nuevo; el actual se muda con la pantalla health, R6) →
  `describe('R5: splash navega según sesión', ...)` mockeando `useAuth` y
  `expo-router` ([[design]] §D9). ROJO primero.*

- **R6**: WHEN la app navega a `/health` THE SYSTEM SHALL renderizar la
  pantalla health de #32 sin cambio de comportamiento: el contenido actual
  de `src/app/index.tsx` se muda a `mobile-pet-tracker/src/app/health.tsx`
  y su suite (`describe('R7: ...')` de #31 y `describe('R6: theme toggle')`
  de #32 — R-ids de aquellas specs, no de esta) se muda a
  `mobile-pet-tracker/src/app/__tests__/health.test.tsx` cambiando SOLO los
  imports, sin tocar asserts.
  *Verificación: suite `health.test.tsx` verde + reviewer confirma con
  `git diff` que solo cambian imports/paths.*

### Pantallas de autenticación (`src/app/(auth)/`)

- **R7**: WHEN el usuario envía el formulario de Login
  (`mobile-pet-tracker/src/app/(auth)/login.tsx`, estructura y testIDs
  exactos en [[design]] §D6) con email y password THE SYSTEM SHALL llamar
  `login(process.env.EXPO_PUBLIC_API_URL, { email, password })` y:
  - IF `kind === 'ok'` THEN SHALL llamar `signIn(accessToken)` y
    `router.replace('/health')`;
  - IF `kind === 'invalid-credentials'` THEN SHALL mostrar
    `Invalid credentials` en el elemento `testID="login-error"`;
  - IF `kind === 'unreachable'` THEN SHALL mostrar `Cannot reach server`;
  - IF `kind === 'error' | 'missing-config'` THEN SHALL mostrar
    `Something went wrong`;
  - IF `kind === 'validation'` THEN SHALL mostrar los `message` recibidos.
  AND la pantalla SHALL enlazar a `/register` (`testID="link-register"`) y
  `/forgot` (`testID="link-forgot"`).
  *Test: `mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx` →
  `describe('R7: login llama a la api y navega', ...)` mockeando
  `../../api/auth`, `useAuth` y `expo-router`. ROJO primero.*

- **R8**: WHEN el usuario envía el formulario de Register
  (`mobile-pet-tracker/src/app/(auth)/register.tsx`, campos y testIDs
  exactos en [[design]] §D7 — espejo del DTO real del backend) THE SYSTEM
  SHALL llamar `register(...)` con
  `{ firstName, lastName, email, phone, password, passwordConfirmation,
  country, timezone, termsAccepted: true }` (timezone del dispositivo vía
  `Intl`, [[design]] §D7) y:
  - IF `kind === 'ok'` THEN SHALL encadenar `login(...)` con las mismas
    credenciales y, si este devuelve `ok`, `signIn(accessToken)` +
    `router.replace('/health')`; si el login encadenado no devuelve `ok`
    SHALL hacer `router.replace('/login')` (cuenta creada, entra a mano);
  - IF `kind === 'email-taken'` THEN SHALL mostrar
    `Email already registered` en `testID="register-error"`;
  - IF `kind === 'validation'` THEN SHALL mostrar cada `message` bajo su
    campo (mapeo por `path`, [[design]] §D7);
  - IF `kind === 'unreachable' | 'error' | 'missing-config'` THEN SHALL
    mostrar el mensaje genérico correspondiente (mismos textos que R7).
  AND el botón `register-submit` SHALL estar `isDisabled` mientras el
  checkbox `register-terms` no esté marcado (el DTO exige
  `termsAccepted: true`).
  *Test: `mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx` →
  `describe('R8: register llama a la api y navega', ...)`. ROJO primero.*

- **R9**: WHEN el usuario navega a `/forgot`
  (`mobile-pet-tracker/src/app/(auth)/forgot.tsx`) THE SYSTEM SHALL mostrar
  un stub deshabilitado: texto `Password recovery coming soon`, un
  `Input testID="forgot-email"` con `editable={false}` y un
  `Button testID="forgot-submit"` con `isDisabled` — sin ninguna llamada de
  red (el endpoint no existe en el backend; feature backlog #44).
  *Test: `mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx` →
  `describe('R9: forgot es un stub deshabilitado', ...)`. ROJO primero.*

### Contención e integración

- **R10**: WHILE la feature #33 esté en curso THE SYSTEM SHALL NOT
  modificar archivos bajo `backend-pet-tracker/`, `infra/`,
  `init.config.sh` ni `.github/workflows/ci.yml`, y WHEN se ejecuta
  `./init.sh` tras los cambios THE SYSTEM SHALL terminar con exit 0.
  *Verificación: reviewer ejecuta `./init.sh` y
  `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/`
  (vacío).*

### Prueba de humo del humano

- **R11**: WHEN el humano ejecuta la prueba de humo **en Expo Go** THE
  SYSTEM SHALL completar el flujo de auth en Android físico. Pasos (misma
  WiFi, `.env` con IP LAN, backend local arriba con `docker compose up -d`
  + `pnpm -C backend-pet-tracker run start:dev`):

  1. Desde `mobile-pet-tracker/`: `bunx expo start --go` (el `--go` sigue
     siendo obligatorio con expo-dev-client instalado) y escanear el QR.
  2. Primera apertura sin sesión: splash → pantalla Login.
  3. Register: crear una cuenta nueva → entra directo a `/health`
     (auto-login encadenado).
  4. Matar la app y reabrir: splash → directo a `/health` (sesión
     restaurada desde secure store, sin pasar por Login).
  5. Login con password incorrecto: mensaje `Invalid credentials`.
  6. Forgot: pantalla stub deshabilitada visible desde el link de Login.
  7. Verificar que el conjunto respeta el diseño minimalista (tokens de
     #32; Figma como referencia si el humano lo tiene a mano).

  - [ ] Smoke ejecutado por el humano (fecha: ____)

## Fuera de alcance

- Endpoint y flujo real de forgot-password → feature backend #44
  `auth-forgot-password` (backlog) y una futura feature móvil que active el
  stub.
- Validar el token contra `GET /v1/me` al restaurar sesión, refresh de
  token y manejo global de 401 en llamadas autenticadas → entra cuando
  exista un consumidor autenticado real (#34 tabs / #35 dashboard).
- Logout en UI (no hay pantalla de settings todavía; `signOut()` queda
  expuesto en el context para #34+).
- Validación client-side con zod duplicando el DTO del backend (los errores
  de validación se muestran a partir del 400 del servidor; única excepción:
  el gate de `termsAccepted` en R8).
- Flujo de verificación de email (`POST /v1/auth/verify-email` existe pero
  el login no lo exige; UI de verificación cuando una feature lo pida).
- Codegen OpenAPI (decisión registrada en [[design]] §D10 — a ratificar en
  el gate; el default "tipos a mano" es lo que implementa esta spec).
- Deep links, biometría, "remember me", social login.
- Cambios a `backend-pet-tracker/`, `infra/`, `init.config.sh`, CI (R10).

## Decisiones pendientes de humano

- **D10 (codegen OpenAPI, deuda #2 de #31) — a ratificar en este gate**:
  default "tipos a mano hasta consumir 3+ dominios del backend" (con auth
  serían 2: health + auth). Ratificar o revertir al aprobar; no bloquea la
  implementación porque el default es lo que esta spec ya especifica.
- Decisiones menores objetables en este gate: auto-login encadenado tras
  register (R8), país como input de texto de 2 letras mayúsculas (§D7),
  copy en inglés, `headerShown: false` global (§D5).

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-20) ← gate obligatorio antes de implementar
