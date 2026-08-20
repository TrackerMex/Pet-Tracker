---
feature: "mobile-auth"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-auth]]

> Ver [[requirements]] para los requisitos. Autosuficiente para Codex CLI:
> rutas, símbolos y contratos exactos. Las capas de `docs/architecture.md`
> son de backend y no aplican aquí; sí aplican las convenciones móviles de
> `docs/conventions.md` (solo `className`/tokens, HeroUI Native, tests que
> nombran R-ids, bun).

## Contratos verificados (2026-08-20, contra el código del backend)

Fuente: `backend-pet-tracker/src/modules/auth/infrastructure/auth.controller.ts`
+ DTOs en `.../application/dto/`. Prefijo global `v1` (`main.ts`), ya
incluido en `EXPO_PUBLIC_API_URL`.

- **POST `/v1/auth/login`** — body `{ email: string, password: string }`.
  - 200 → `{ "access_token": string }` (snake_case a propósito, contrato de
    `auth-login-me`).
  - 401 → Nest `UnauthorizedException` (`{ message: 'Invalid credentials',
    error, statusCode }`) — mismo error para email inexistente y password
    mal (no se distingue).
  - 400 → `{ statusCode: 400, message: 'Validation failed',
    errors: [{ path: string, message: string }] }`.
- **POST `/v1/auth/register`** — body espejo de `RegisterUserSchema`:
  `firstName` (1–120, trim), `lastName` (1–120), `email` (max 320),
  `phone` (7–20), `password` (8–128), `passwordConfirmation` (igual a
  password), `country` (ISO 3166-1 alpha-2 en MAYÚSCULAS, regex
  `^[A-Z]{2}$`), `timezone` (opcional; backend persiste `UTC` si falta),
  `termsAccepted: true` (literal).
  - 201 → `UserResponse`: `{ id, email, firstName, lastName, phone,
    country, timezone, createdAt }` (todos string). **No devuelve token.**
  - 409 → `ConflictException` 'Email already registered'.
  - 400 → mismo shape de validación que login.
- **`forgot-password` no existe** (grep sobre `backend-pet-tracker/src`,
  2026-08-20): no hay controller, use-case ni DTO. → R9 stub + backlog #44.
- **GET `/v1/me`** existe (módulo `users`) pero no se usa en esta feature:
  restaurar sesión = token presente en secure store (ver §D4).

## Decisiones técnicas

- **D1 — Dependencia nueva** (única): desde `mobile-pet-tracker/`:

  ```
  bunx expo install expo-secure-store
  ```

  Queda `expo-secure-store@~57.0.1`, **bundleado en Expo Go SDK 57**
  (verificado en `node_modules/expo/bundledNativeModules.json`). Sin
  cambios en el bloque jest: el patrón `expo(nent)?` del
  `transformIgnorePatterns` ya lo cubre; en tests se mockea el módulo
  entero (§D8). API usada: `getItemAsync`, `setItemAsync`,
  `deleteItemAsync` (import `* as SecureStore from 'expo-secure-store'`).

- **D2 — `src/api/auth.ts`** (nuevo). Mismo patrón que `src/api/health.ts`:
  funciones puras, `fetchFn: typeof fetch = fetch` inyectado, unión
  discriminada por `kind`, **cero imports de storage o de React**. Firmas
  exactas:

  ```ts
  import type { FieldError, LoginRequest, RegisterRequest, UserResponse } from './types';

  export type LoginState =
    | { kind: 'ok'; accessToken: string }
    | { kind: 'invalid-credentials' }
    | { kind: 'validation'; errors: FieldError[] }
    | { kind: 'error' }
    | { kind: 'unreachable'; message: string }
    | { kind: 'missing-config' };

  export type RegisterState =
    | { kind: 'ok'; user: UserResponse }
    | { kind: 'email-taken' }
    | { kind: 'validation'; errors: FieldError[] }
    | { kind: 'error' }
    | { kind: 'unreachable'; message: string }
    | { kind: 'missing-config' };

  export async function login(
    baseUrl: string | undefined,
    body: LoginRequest,
    fetchFn: typeof fetch = fetch,
  ): Promise<LoginState>;

  export async function register(
    baseUrl: string | undefined,
    body: RegisterRequest,
    fetchFn: typeof fetch = fetch,
  ): Promise<RegisterState>;
  ```

  Mapeo de respuesta (tabla normativa de R1/R2):

  | Caso | login | register |
  |---|---|---|
  | `baseUrl` undefined | `missing-config` (sin fetch) | idem |
  | `fetchFn` lanza | `unreachable` + `message` | idem |
  | 200/201 | `ok` + `accessToken` (de `access_token`) | `ok` + `user` |
  | 401 | `invalid-credentials` | — (cae en `error`) |
  | 409 | — (cae en `error`) | `email-taken` |
  | 400 con `errors[]` | `validation` + `errors` | idem |
  | resto / JSON no parseable | `error` | idem |

  URL: helper compartido `apiUrl(baseUrl, path)` que replica el saneo de
  `healthUrl` (`baseUrl.replace(/\/+$/, '') + path`). Request:
  `fetchFn(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })`.

- **D3 — Tipos a mano en `src/api/types.ts`** (se amplía el existente):

  ```ts
  export interface FieldError { path: string; message: string }
  export interface LoginRequest { email: string; password: string }
  export interface RegisterRequest {
    firstName: string; lastName: string; email: string; phone: string;
    password: string; passwordConfirmation: string; country: string;
    timezone?: string; termsAccepted: true;
  }
  export interface UserResponse {
    id: string; email: string; firstName: string; lastName: string;
    phone: string; country: string; timezone: string; createdAt: string;
  }
  ```

  Espejo 1:1 del DTO/mapper del backend. Ver §D10 (decisión codegen).

- **D4 — `src/providers/auth-provider.tsx`** (nuevo; nace la carpeta
  `src/providers/`). Context mínimo — sin reducers, sin librerías de
  estado:

  ```tsx
  import * as SecureStore from 'expo-secure-store';

  const TOKEN_KEY = 'auth_token';

  export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

  export interface AuthContextValue {
    status: AuthStatus;
    token: string | null;
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
  }

  export function AuthProvider({ children }: { children: React.ReactNode });
  export function useAuth(): AuthContextValue; // lanza si no hay provider
  ```

  Comportamiento: en mount, `getItemAsync(TOKEN_KEY)` →
  `authenticated`/`unauthenticated` (catch → `unauthenticated`). `signIn`
  persiste y actualiza estado; `signOut` borra y actualiza estado.
  **Restaurar sesión = token presente.** No se valida contra `/v1/me` ni se
  maneja expiración aquí: el primer consumidor autenticado real (#34/#35)
  añadirá el manejo de 401 → `signOut`. `useAuth` es el único punto de
  acceso; las funciones de `src/api/` jamás importan expo-secure-store
  (R4, reviewer grep).

- **D5 — Navegación** (patrón de la skill expo-router: grupo `(auth)`,
  redirect por sesión en la ruta `/`). Estructura resultante de
  `src/app/`:

  ```
  src/app/
    _layout.tsx          — providers + <Stack screenOptions={{ headerShown: false }} />
    index.tsx            — Splash: gate de sesión (R5)
    health.tsx           — pantalla health de #32, movida tal cual (R6)
    (auth)/
      login.tsx          — R7
      register.tsx       — R8
      forgot.tsx         — R9
  ```

  - Sin `_layout.tsx` propio en `(auth)`: el grupo es solo organización de
    archivos, las rutas cuelgan del Stack raíz y los hrefs son
    transparentes (`/login`, `/register`, `/forgot`).
  - `_layout.tsx` raíz: se conserva el orden de #32
    (`GestureHandlerRootView` > `HeroUINativeProvider`) y se inserta
    `AuthProvider` envolviendo el `<Stack />`:
    `GestureHandlerRootView > HeroUINativeProvider > AuthProvider > Stack`.
    `screenOptions={{ headerShown: false }}` (pantallas full-screen
    minimalistas; ningún test de #31/#32 asertaba headers).
  - Splash (`index.tsx`):

    ```tsx
    const { status } = useAuth();
    if (status === 'authenticated') return <Redirect href="/health" />;
    if (status === 'unauthenticated') return <Redirect href="/login" />;
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Image testID="splash-logo" source={require('../../assets/images/splash-icon.png')} style={{ width: 120, height: 120 }} contentFit="contain" />
      </View>
    );
    ```

    `Image` de `expo-image` (ya instalado). `Redirect` y `router` de
    `'expo-router'`.

- **D6 — Pantalla Login** (`(auth)/login.tsx`). Componentes HeroUI
  verificados contra el tarball instalado (`heroui-native@1.0.8` exporta
  `TextField`, `Label`, `Input`, `FieldError`, `Checkbox`, `LinkButton`,
  `Button`; `Input` extiende `TextInputProps` de RN, así que acepta
  `value`, `onChangeText`, `secureTextEntry`, `autoCapitalize`, `testID`,
  `editable`). Estructura mínima (estilos solo con tokens; layout
  `View className="flex-1 justify-center gap-4 bg-background p-6"`):

  | Elemento | Componente | testID |
  |---|---|---|
  | Título `Sign in` | `Text className="text-2xl font-semibold text-foreground"` | — |
  | Email | `TextField` > `Label` `Email` + `Input autoCapitalize="none" keyboardType="email-address"` | `login-email` (en el Input) |
  | Password | `TextField` > `Label` `Password` + `Input secureTextEntry` | `login-password` |
  | Error de submit | `Text className="text-danger"` (solo si hay error) | `login-error` |
  | Submit | `Button` `Sign in` | `login-submit` |
  | Link register | `LinkButton` `Create account` → `router.push('/register')` | `link-register` |
  | Link forgot | `LinkButton` `Forgot password?` → `router.push('/forgot')` | `link-forgot` |

  Estado: `useState` por campo + `submitting` (deshabilita el Button
  mientras la promesa vuela) + `error: string | null`. Handler: tabla de
  mensajes de R7 (`Invalid credentials` / `Cannot reach server` /
  `Something went wrong` / mensajes de `validation` unidos con `\n`).
  Navegación con `router.replace('/health')` tras `signIn` (import
  `{ router } from 'expo-router'` — singleton, fácil de mockear).

- **D7 — Pantalla Register** (`(auth)/register.tsx`). Dentro de un
  `ScrollView` (formulario largo). Campos espejo del DTO, en este orden,
  cada uno `TextField` > `Label` + `Input` (+ `FieldError` si el 400 trae
  un error cuyo `path` coincide):

  | Campo (state) | Label | Props extra del Input | testID |
  |---|---|---|---|
  | firstName | First name | — | `register-first-name` |
  | lastName | Last name | — | `register-last-name` |
  | email | Email | `autoCapitalize="none" keyboardType="email-address"` | `register-email` |
  | phone | Phone | `keyboardType="phone-pad"` | `register-phone` |
  | password | Password | `secureTextEntry` | `register-password` |
  | passwordConfirmation | Confirm password | `secureTextEntry` | `register-password-confirmation` |
  | country | Country (2-letter code) | `autoCapitalize="characters" maxLength={2}`; el state guarda `.toUpperCase()` | `register-country` |

  - Terms: `Checkbox isSelected={terms} onSelectedChange={setTerms}
    testID="register-terms"` + texto `I accept the terms`. `Button
    testID="register-submit"` con `isDisabled={!terms || submitting}`.
  - Error general en `Text testID="register-error"`; errores de
    `validation` se reparten por `path` al `FieldError` del campo (los
    `path` del backend son exactamente los nombres de campo del DTO); un
    `path` sin campo (p.ej. `termsAccepted`) cae al error general.
  - timezone: `Intl.DateTimeFormat().resolvedOptions().timeZone` en
    try/catch → `undefined` si falla (el backend persiste `UTC`).
  - Submit ok → auto-login encadenado (R8): `register` 201 no devuelve
    token, así que se llama `login(baseUrl, { email, password })` con las
    mismas credenciales; `ok` → `signIn` + `replace('/health')`; cualquier
    otro kind → `replace('/login')` (la cuenta ya existe, entra a mano).
  - País como texto de 2 letras: decisión minimalista (el DTO solo exige
    ISO alpha-2); un picker de países es scope de diseño futuro.

- **D8 — Pantalla Forgot** (`(auth)/forgot.tsx`). Stub estático: título
  `Forgot password`, texto `Password recovery coming soon`
  (`text-muted`), `TextField` > `Input testID="forgot-email"
  editable={false}`, `Button testID="forgot-submit" isDisabled`. `LinkButton`
  de vuelta a `/login`. Cero red, cero estado. Se activará cuando exista el
  endpoint (backlog #44 `auth-forgot-password`).

- **D9 — Patrón de tests** (jest-expo + RTL, convenciones de las suites
  existentes: wrapper `HeroUINativeProvider`, `describe('R<n>: ...')`):
  - `src/api/__tests__/auth.test.ts` (R1, R2): sin render; `fetchFn` stub
    por caso devolviendo `{ status, json: async () => body }` como
    `Response` (mismo estilo que el test de `fetchHealth`).
  - `src/providers/__tests__/auth-provider.test.tsx` (R3, R4):
    `jest.mock('expo-secure-store', () => ({ getItemAsync: jest.fn(),
    setItemAsync: jest.fn(), deleteItemAsync: jest.fn() }))`; se renderiza
    `AuthProvider` con un componente sonda que pinta `status`/`token` y
    botones que llaman `signIn`/`signOut`.
  - Pantallas (R5, R7, R8, R9): `jest.mock` de `../../providers/auth-provider`
    (para `useAuth`), de `../../api/auth` (pantallas) y de `expo-router`
    (`{ Redirect: jest.fn(({ href }) => null), router: { replace: jest.fn(), push: jest.fn() } }`
    — los asserts inspeccionan `Redirect.mock.calls` / `router.replace`).
    Interacción con `fireEvent.changeText` / `fireEvent.press`.

- **D10 — Codegen OpenAPI (deuda #2 de #31) — decisión a ratificar en el
  gate humano de esta spec.** Default que esta spec implementa: **tipos a
  mano** (§D3). Justificación: con auth la app consume 2 dominios del
  backend (health, auth) y ~6 shapes triviales; el backend no publica hoy
  un spec OpenAPI generado (los contratos viven en DTOs zod + mappers), así
  que el codegen exigiría primero generar y versionar el spec — costo
  desproporcionado para 2 dominios. **Umbral de reevaluación: al consumir
  el 3er dominio** (previsiblemente #35 dashboard o #36 mapa, que suman
  pets/positions), quien escriba esa spec debe reabrir esta decisión.
  El humano ratifica o revierte al aprobar; si la revierte, esta spec se
  reajusta antes del handoff.

## Archivos afectados

Todos en la isla móvil salvo `feature_list.json`:

- `mobile-pet-tracker/package.json` + `bun.lock` — expo-secure-store (D1)
- `mobile-pet-tracker/src/api/types.ts` — tipos de D3 (se amplía)
- `mobile-pet-tracker/src/api/auth.ts` — nuevo (D2; R1, R2)
- `mobile-pet-tracker/src/api/__tests__/auth.test.ts` — nuevo
- `mobile-pet-tracker/src/providers/auth-provider.tsx` — nuevo (D4; R3, R4)
- `mobile-pet-tracker/src/providers/__tests__/auth-provider.test.tsx` — nuevo
- `mobile-pet-tracker/src/app/_layout.tsx` — añade AuthProvider + headerShown false (D5)
- `mobile-pet-tracker/src/app/index.tsx` — reescrito como Splash (R5)
- `mobile-pet-tracker/src/app/__tests__/index.test.tsx` — nuevo (splash; el
  actual se muda a health.test.tsx)
- `mobile-pet-tracker/src/app/health.tsx` — movido desde index.tsx (R6)
- `mobile-pet-tracker/src/app/__tests__/health.test.tsx` — movido, solo imports (R6)
- `mobile-pet-tracker/src/app/(auth)/login.tsx` — nuevo (R7)
- `mobile-pet-tracker/src/app/(auth)/register.tsx` — nuevo (R8)
- `mobile-pet-tracker/src/app/(auth)/forgot.tsx` — nuevo (R9)
- `mobile-pet-tracker/src/app/(auth)/__tests__/{login,register,forgot}.test.tsx` — nuevos
- `feature_list.json` — #33 a `in_progress`/`done` según flujo; #44
  `auth-forgot-password` ya añadida al backlog por esta spec

Prohibido tocar: `backend-pet-tracker/`, `infra/`, `init.config.sh`,
`.github/workflows/ci.yml` (R10).

## Alternativas descartadas

- **Validar sesión contra `GET /v1/me` al arrancar**: pospuesto — añade un
  dominio consumido y estados de red al splash sin consumidor autenticado
  real todavía; token presente basta para #33 y el manejo de 401 llegará
  con #34/#35.
- **Cliente HTTP central con interceptores** (axios o wrapper): el patrón
  health.ts (función pura + fetchFn inyectado) escala a 2 endpoints sin
  abstracción nueva; la skill de data-fetching de Expo también prefiere
  fetch. Reevaluar junto con D10 al 3er dominio.
- **Guard de rutas con `Stack.Protected` o layout de grupo**: el gate en
  `/` (splash redirect) cubre el único flujo existente; proteger `/health`
  contra deep-links manuales no aporta nada aún (no hay datos sensibles en
  esa pantalla) y #34 reorganizará el shell de todas formas.
- **AsyncStorage para el token**: descartado — el token es credencial;
  expo-secure-store (Keychain/Keystore) es el estándar y está bundleado en
  Expo Go.
- **Redirigir a Login tras register (sin auto-login)**: UX peor por
  ahorrarse una llamada ya implementada; el fallback a `/login` cubre el
  caso raro de register-ok + login-fail.
- **Picker/select de país**: el DTO solo pide ISO alpha-2; un input de 2
  letras lo cumple. Un picker con lista de países es diseño/UX que puede
  llegar con el Figma en una feature de pulido.
- **Zod client-side espejo del DTO**: duplicaría reglas que el backend ya
  aplica y responde con mensajes por campo; la UI solo necesita pintarlos.
