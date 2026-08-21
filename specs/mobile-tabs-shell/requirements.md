---
feature: "mobile-tabs-shell"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-tabs-shell]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (D1–D8). Las capas de
> `docs/architecture.md` son de backend y NO aplican a esta app; sí aplican
> kebab-case, tests que nombran su R-id y conventional commits
> (`docs/conventions.md` §Convenciones de la app móvil).

## Contexto fijo (no reabrir)

- Base: estado tras #33 — grupo `(auth)` sin `_layout` propio (rutas
  `/login`, `/register`, `/forgot`), splash en `src/app/index.tsx` que
  redirige por sesión (`/health` o `/login`), `AuthProvider` en
  `src/providers/auth-provider.tsx` con `useAuth()` →
  `{ status, token, signIn, signOut }`.
- **Cero dependencias nuevas.** Todo lo necesario ya está instalado:
  `expo-router ~57.0.14` (exporta `Tabs`), `reicon-react-native` (iconos
  `Home`, `Map`, `HeartPulse`, `ForkKnife`, `Profile` verificados en
  `node_modules/reicon-react-native/icons/` el 2026-08-21),
  `react-native-safe-area-context ~5.7.0` (el provider lo monta expo-router),
  y `useThemeColor` exportado por `heroui-native@1.0.8` (verificado en
  `lib/typescript/src/helpers/external/hooks/use-theme-color.d.ts`).
- `typedRoutes` y `reactCompiler` ya activos en `app.json` → `experiments`.
- La tab bar es un componente JS puro (View + Pressable + SVG) → funciona
  100% en Expo Go SDK 57 (`bunx expo start --go`), sin builds.
- Decisión D1 ([[design]]): `Tabs` JS de expo-router con `tabBar` custom,
  NO `NativeTabs` — la skill expo-router prefiere NativeTabs pero no admite
  el diseño flotante custom estilo Dribbble que pide esta feature.

## Excepción a C4 (cambios sobre código de #33)

R3 (cambio de destino `/health` → `/home` en 3 hrefs) y R4 (mudanza de la
pantalla health a `(tabs)/` sin cambio de comportamiento) no nacen por TDD:
los verifican las suites existentes de #33 actualizadas/mudadas y el reviewer
con `git diff`. Todo código nuevo (R1, R2, R5–R8) sigue TDD estricto con
test rojo primero.

## Requisitos funcionales

### Guards de sesión

- **R1**: WHEN un usuario con `status === 'unauthenticated'` monta cualquier
  ruta del grupo `(tabs)` THE SYSTEM SHALL devolver
  `<Redirect href="/login" />` desde el nuevo
  `mobile-pet-tracker/src/app/(tabs)/_layout.tsx`; WHILE
  `status === 'loading'` SHALL devolver `null` (el splash de `/` cubre el
  arranque); WHEN `status === 'authenticated'` SHALL renderizar `<Tabs>`
  con la tab bar custom de R7 y los 5 `Tabs.Screen` en orden
  `home, map, health, food, profile` ([[design]] §D4).
  *Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/layout.test.tsx` →
  `describe('R1: (tabs) exige sesión', ...)` mockeando
  `../../providers/auth-provider` y `expo-router` (§D7). ROJO primero.*

- **R2**: WHEN un usuario con `status === 'authenticated'` monta cualquier
  ruta del grupo `(auth)` THE SYSTEM SHALL devolver
  `<Redirect href="/home" />` desde el nuevo
  `mobile-pet-tracker/src/app/(auth)/_layout.tsx`; WHEN `unauthenticated` o
  `loading` SHALL renderizar
  `<Stack screenOptions={{ headerShown: false }} />` (las pantallas de #33
  quedan intactas).
  *Test: `mobile-pet-tracker/src/app/(auth)/__tests__/layout.test.tsx` →
  `describe('R2: (auth) expulsa sesiones activas', ...)`. ROJO primero.*

### Destino post-sesión

- **R3**: WHEN la sesión queda activa THE SYSTEM SHALL usar `/home` como
  destino en los tres puntos existentes de #33 (antes `/health`):
  - `src/app/index.tsx`: `<Redirect href="/home" />` si `authenticated`;
  - `src/app/(auth)/login.tsx`: `router.replace('/home')` tras `signIn`;
  - `src/app/(auth)/register.tsx`: `router.replace('/home')` tras el
    auto-login encadenado (el fallback `replace('/login')` no cambia).
  Los asserts de las suites de #33 (`src/app/__tests__/index.test.tsx`,
  `src/app/(auth)/__tests__/login.test.tsx`,
  `src/app/(auth)/__tests__/register.test.tsx`) se actualizan de `/health`
  a `/home` **sin tocar nada más**; sus `describe` conservan los R-ids de
  la spec mobile-auth.
  *Verificación: esas 3 suites verdes + reviewer confirma con `git diff`
  que solo cambian los hrefs y sus asserts.*

### Pantallas del grupo (tabs)

- **R4**: WHEN la app navega a `/health` THE SYSTEM SHALL renderizar la
  pantalla health de #32 sin cambio de comportamiento:
  `src/app/health.tsx` se muda a
  `mobile-pet-tracker/src/app/(tabs)/health.tsx` (la URL `/health` no
  cambia — los grupos son transparentes) y su suite
  `src/app/__tests__/health.test.tsx` se muda a
  `mobile-pet-tracker/src/app/(tabs)/__tests__/health.test.tsx` cambiando
  SOLO imports/paths, sin tocar asserts.
  *Verificación: suite `health.test.tsx` verde + reviewer confirma con
  `git diff` que solo cambian imports/paths.*

- **R5**: WHEN la app navega a `/home`, `/map`, `/food` o `/profile` THE
  SYSTEM SHALL renderizar el placeholder correspondiente ([[design]] §D5):
  `View className="flex-1 items-center justify-center bg-background"` con
  un `Text` con el título (`Home` / `Map` / `Food` / `Profile`) y testID
  `screen-home` | `screen-map` | `screen-food` | `screen-profile`.
  *Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/screens.test.tsx` →
  `describe('R5: placeholders de tabs', ...)`. ROJO primero.*

- **R6**: WHEN el usuario pulsa el botón `testID="profile-sign-out"`
  (`Button` de HeroUI con label `Sign out`, único elemento interactivo del
  placeholder Profile) THE SYSTEM SHALL llamar `signOut()` de `useAuth()`
  — al cambiar el status, el guard R1 redirige a `/login` (cierra la deuda
  "logout en UI" anotada en la spec mobile-auth §Fuera de alcance).
  *Test: mismo archivo → `describe('R6: profile permite cerrar sesión', ...)`
  mockeando `useAuth`. ROJO primero.*

### Tab bar flotante

- **R7**: WHEN `FloatingTabBar` (nuevo,
  `mobile-pet-tracker/src/components/floating-tab-bar.tsx`, contrato exacto
  en [[design]] §D3) renderiza THE SYSTEM SHALL mostrar los 5 tabs en orden
  Home, Map, Health, Food, Profile — cada uno un `Pressable` con testID
  `tab-home` | `tab-map` | `tab-health` | `tab-food` | `tab-profile`, su
  icono reicon (`Home`, `Map`, `HeartPulse`, `ForkKnife`, `Profile`) y su
  label. El tab activo SHALL exponer
  `accessibilityState={{ selected: true }}` y renderizar su icono
  `weight="Filled"` con color `accent`; los inactivos `weight="Outline"`
  con color `muted` (colores resueltos con `useThemeColor`, §D3). WHEN se
  pulsa un tab inactivo THE SYSTEM SHALL emitir
  `navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })`
  y, si no fue prevenido, llamar `navigation.navigate(route.name)`; WHEN se
  pulsa el tab activo SHALL NOT navegar.
  *Test: `mobile-pet-tracker/src/components/__tests__/floating-tab-bar.test.tsx`
  → `describe('R7: tab bar renderiza y navega', ...)` con props fake (§D7):
  asserts de los 5 testIDs en orden, `selected` del activo, `navigate` al
  pulsar inactivo, no-navegación al pulsar activo y respeto de
  `defaultPrevented`. El weight/color del icono lo verifica el reviewer en
  código y el humano en R11. ROJO primero.*

- **R8**: WHILE `FloatingTabBar` está montada THE SYSTEM SHALL flotar sobre
  el contenido: contenedor `testID="floating-tab-bar"` con
  `className="absolute left-4 right-4 flex-row items-center justify-around rounded-full border border-border bg-surface px-2 py-3 shadow-lg"`
  (solo tokens, cero hex) y `style={{ bottom: insets.bottom + 12 }}` con
  `insets` de `useSafeAreaInsets()` de `react-native-safe-area-context`.
  *Test: mismo archivo → `describe('R8: tab bar flota con safe area', ...)`
  mockeando `react-native-safe-area-context` con `bottom: 34` y asertando
  `bottom === 46` en el style del contenedor. ROJO primero.*

### Tipado y contención

- **R9**: WHEN se ejecuta `bun run typecheck` en `mobile-pet-tracker/` tras
  los cambios THE SYSTEM SHALL salir con exit 0, con `typedRoutes` activo y
  los hrefs `/home`, `/login`, etc. tipados (los tipos de rutas se
  regeneran con `bunx expo start`; mismo mecanismo ya usado en #32/#33).
  AND `bun run lint` SHALL salir con exit 0.
  *Verificación: implementer ejecuta ambos comandos y lo anota en
  `progress/impl_mobile-tabs-shell.md`; el reviewer los re-ejecuta.*

- **R10**: WHILE la feature #34 esté en curso THE SYSTEM SHALL NOT
  modificar archivos bajo `backend-pet-tracker/`, `infra/`,
  `init.config.sh` ni `.github/workflows/ci.yml`; WHEN se ejecuta
  `./init.sh` tras los cambios THE SYSTEM SHALL terminar con exit 0; AND
  la suite móvil completa (`bun run test` en `mobile-pet-tracker/`) SHALL
  quedar verde.
  *Verificación: reviewer ejecuta `./init.sh`, `bun run test` y
  `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/`
  (vacío).*

### Prueba de humo del humano

- **R11**: WHEN el humano ejecuta la prueba de humo **en Expo Go** THE
  SYSTEM SHALL completar el flujo del shell en Android físico. Pasos
  (misma WiFi, `.env` con IP LAN, backend local arriba con
  `docker compose up -d` + `pnpm -C backend-pet-tracker run start:dev`):

  1. Desde `mobile-pet-tracker/`: `bunx expo start --go` y escanear el QR.
  2. Sin sesión: splash → Login (guard R1 impide entrar a tabs).
  3. Login con cuenta válida → aterriza en el tab **Home** con la tab bar
     flotante visible por encima del gesto/barra de navegación de Android
     (safe-area, R8).
  4. Navegar por los 5 tabs: iconos reicon, activo en accent/filled,
     inactivos en muted/outline; Health muestra la pantalla de estado de
     #32 (toggle de tema incluido, útil para ver la barra en dark).
  5. Matar la app y reabrir: splash → directo a Home (sesión restaurada).
  6. Profile → `Sign out` → vuelve a Login; intentar volver atrás no
     re-entra a tabs.
  7. Verificar que la estética de la barra respeta el estilo flotante
     minimalista (Dribbble como referencia; el veredicto visual es humano).

  - [ ] Smoke ejecutado por el humano (fecha: ____)

## Fuera de alcance

- Contenido real de Home/Map/Food/Profile (dashboard #35, mapa, etc.) —
  aquí son placeholders.
- Manejo global de 401 → `signOut` (llega con el primer fetch autenticado
  real, previsiblemente #35; deuda ya anotada en la spec mobile-auth).
- Animaciones de la tab bar (indicador deslizante con Reanimated, haptics,
  ocultar al hacer scroll) — pulido posterior con la skill de animación si
  el humano lo pide.
- Badges en tabs, deep links, stacks anidados por tab (cada tab es una
  pantalla plana; se anidarán Stacks cuando exista una pantalla de detalle).
- Padding inferior de contenido bajo la barra flotante en pantallas con
  scroll (los placeholders van centrados; la pantalla real que lo necesite
  lo resolverá con `useSafeAreaInsets` + altura de la barra).
- Cambios a `backend-pet-tracker/`, `infra/`, `init.config.sh`, CI (R10).

## Decisiones a ratificar en el gate humano

- **D1 — `Tabs` JS + tab bar custom en vez de `NativeTabs`** ([[design]]):
  la skill expo-router prefiere NativeTabs, pero no admite un diseño
  flotante custom; ratificar el trade-off (se pierde liquid glass iOS 26,
  irrelevante hoy: el smoke es Android + Expo Go).
- Destino post-login `/home` con actualización de asserts de #33 (R3).
- `Sign out` dentro del placeholder Profile (R6).
- Health tab = pantalla de estado de #32 movida tal cual (R4); el contenido
  real de salud llegará con las features de health.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-21) ← gate obligatorio antes de implementar
