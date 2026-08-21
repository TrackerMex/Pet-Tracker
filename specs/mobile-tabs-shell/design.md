---
feature: "mobile-tabs-shell"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-tabs-shell]]

> Ver [[requirements]] para los requisitos. Autosuficiente para Codex CLI:
> rutas, símbolos y contratos exactos. Aplican las convenciones móviles de
> `docs/conventions.md` (solo `className`/tokens, HeroUI Native, iconos
> reicon, tests que nombran R-ids, bun). Cero dependencias nuevas.

## Decisiones técnicas

- **D1 — `Tabs` JS de expo-router con `tabBar` custom, NO `NativeTabs`.**
  La skill expo-router recomienda `NativeTabs` para look nativo, pero
  NativeTabs renderiza la tab bar del sistema (UITabBar / Material 3) y no
  acepta un componente propio — imposible el diseño flotante estilo
  Dribbble que pide la feature. `Tabs` (export estable de `'expo-router'`,
  verificado en `node_modules/expo-router/build/exports.d.ts`) acepta
  `tabBar={(props) => ...}` y es JS puro → Expo Go sin fricción. Trade-off
  asumido: sin liquid glass iOS 26 ni minimize-on-scroll nativo
  (irrelevante: smoke en Android + Expo Go).

- **D2 — Estructura resultante de `src/app/`** (root `_layout.tsx` NO
  cambia: `GestureHandlerRootView > HeroUINativeProvider > AuthProvider >
  Stack headerShown:false`):

  ```
  src/app/
    _layout.tsx            — sin cambios (#33)
    index.tsx              — splash; SOLO cambia href: /health → /home (R3)
    (auth)/
      _layout.tsx          — NUEVO: guard R2 + <Stack screenOptions={{ headerShown: false }} />
      login.tsx            — SOLO cambia router.replace('/home') (R3)
      register.tsx         — SOLO cambia router.replace('/home') (R3)
      forgot.tsx           — sin cambios
    (tabs)/
      _layout.tsx          — NUEVO: guard R1 + <Tabs> con tabBar custom
      home.tsx             — NUEVO placeholder (R5)
      map.tsx              — NUEVO placeholder (R5)
      health.tsx           — MOVIDO desde src/app/health.tsx, solo imports (R4)
      food.tsx             — NUEVO placeholder (R5)
      profile.tsx          — NUEVO placeholder + Sign out (R5, R6)
  src/components/
    floating-tab-bar.tsx   — NUEVO (R7, R8)
  ```

  Los grupos son transparentes en la URL: las rutas quedan `/home`, `/map`,
  `/health`, `/food`, `/profile` (por eso `/health` sigue funcionando tras
  la mudanza). No hay `index.tsx` dentro de `(tabs)` — chocaría con el
  splash de la raíz.

- **D3 — `src/components/floating-tab-bar.tsx`** (nuevo; nace la carpeta
  `src/components/`). Sin imports de `@react-navigation/*`: props tipadas
  estructuralmente (subset de lo que pasa `Tabs`):

  ```tsx
  import { Pressable, Text, View } from 'react-native';
  import { useSafeAreaInsets } from 'react-native-safe-area-context';
  import { useThemeColor } from 'heroui-native';
  import { ForkKnife, HeartPulse, Home, Map, Profile } from 'reicon-react-native';

  interface TabRoute { key: string; name: string }

  export interface FloatingTabBarProps {
    state: { index: number; routes: TabRoute[] };
    navigation: {
      emit: (event: { type: 'tabPress'; target: string; canPreventDefault: true })
        => { defaultPrevented: boolean };
      navigate: (name: string) => void;
    };
  }

  const TABS = [
    { name: 'home', label: 'Home', Icon: Home },
    { name: 'map', label: 'Map', Icon: Map },
    { name: 'health', label: 'Health', Icon: HeartPulse },
    { name: 'food', label: 'Food', Icon: ForkKnife },
    { name: 'profile', label: 'Profile', Icon: Profile },
  ] as const;

  export function FloatingTabBar({ state, navigation }: FloatingTabBarProps);
  ```

  - Render: itera `TABS` (no `state.routes`, para fijar orden e iconos) y
    resuelve la ruta con `state.routes.find((r) => r.name === tab.name)`;
    activo ⇔ `state.routes[state.index]?.name === tab.name`.
  - Contenedor: `View testID="floating-tab-bar"` con
    `className="absolute left-4 right-4 flex-row items-center justify-around rounded-full border border-border bg-surface px-2 py-3 shadow-lg"`
    y `style={{ bottom: insets.bottom + 12 }}` (única prop de estilo
    inline permitida: valor dinámico de safe-area, mismo criterio que el
    `width` del splash en #33).
  - Ítem: `Pressable testID={`tab-${tab.name}`}
    accessibilityRole="tab" accessibilityState={{ selected: isActive }}
    className="flex-1 items-center gap-1"` con
    `<tab.Icon size={24} weight={isActive ? 'Filled' : 'Outline'}
    color={isActive ? accent : muted} />` y
    `<Text className={isActive ? 'text-xs text-accent' : 'text-xs text-muted'}>{tab.label}</Text>`.
  - Colores: `const [accent, muted] = useThemeColor(['accent', 'muted'])`
    (export de `heroui-native`, verificado; los SVG no aceptan className,
    única vía correcta sin hex hardcodeado).
  - Press (patrón estándar de tab bar custom de React Navigation):

    ```ts
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!isActive && !event.defaultPrevented) navigation.navigate(tab.name);
    ```

  - Iconos verificados el 2026-08-21 en
    `node_modules/reicon-react-native/icons/`: `Home.js`, `Map.js`,
    `HeartPulse.js`, `ForkKnife.js`, `Profile.js`. Props del paquete
    (`createIcon.d.ts`): `size?: number`, `color?: string`,
    `weight?: 'Filled' | 'Outline'`.

- **D4 — Guards por layout de grupo.** Ambos consumen `useAuth()` de
  `../../providers/auth-provider`.

  ```tsx
  // src/app/(tabs)/_layout.tsx
  import { Redirect, Tabs } from 'expo-router';
  import { FloatingTabBar } from '../../components/floating-tab-bar';
  import { useAuth } from '../../providers/auth-provider';

  export default function TabsLayout() {
    const { status } = useAuth();
    if (status === 'loading') return null;
    if (status === 'unauthenticated') return <Redirect href="/login" />;
    return (
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => (
          <FloatingTabBar state={props.state} navigation={props.navigation} />
        )}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="map" />
        <Tabs.Screen name="health" />
        <Tabs.Screen name="food" />
        <Tabs.Screen name="profile" />
      </Tabs>
    );
  }
  ```

  ```tsx
  // src/app/(auth)/_layout.tsx
  import { Redirect, Stack } from 'expo-router';
  import { useAuth } from '../../providers/auth-provider';

  export default function AuthLayout() {
    const { status } = useAuth();
    if (status === 'authenticated') return <Redirect href="/home" />;
    return <Stack screenOptions={{ headerShown: false }} />;
  }
  ```

  Nota: la spec mobile-auth decía "sin `_layout` en `(auth)`" — decisión
  superseded aquí: ahora el layout existe porque carga el guard. En
  `loading`, `(auth)` renderiza el Stack (no hay flash: el splash de `/`
  es la única entrada en frío).

- **D5 — Placeholders** (`home.tsx`, `map.tsx`, `food.tsx`,
  `profile.tsx`), patrón único:

  ```tsx
  import { Text, View } from 'react-native';

  export default function HomeScreen() {
    return (
      <View testID="screen-home" className="flex-1 items-center justify-center bg-background">
        <Text className="text-lg font-semibold text-foreground">Home</Text>
      </View>
    );
  }
  ```

  `profile.tsx` añade debajo del título:
  `<Button testID="profile-sign-out" onPress={() => { void signOut(); }}>Sign out</Button>`
  (`Button` de `heroui-native`, `signOut` de `useAuth()`). Sin navegación
  manual: el guard R1 reacciona al cambio de status.

- **D6 — Cambios R3 exactos** (nada más se toca en estos archivos):
  | Archivo | Antes | Después |
  |---|---|---|
  | `src/app/index.tsx` | `<Redirect href="/health" />` | `<Redirect href="/home" />` |
  | `src/app/(auth)/login.tsx` | `router.replace('/health')` | `router.replace('/home')` |
  | `src/app/(auth)/register.tsx` | `router.replace('/health')` (rama ok) | `router.replace('/home')` |
  + los asserts espejo en `index.test.tsx`, `login.test.tsx`,
  `register.test.tsx` (los `describe` conservan los R-ids de mobile-auth).

- **D7 — Patrón de tests** (jest-expo + RTL, convenciones existentes:
  `describe('R<n>: ...')`, wrapper `HeroUINativeProvider` cuando se
  renderizan componentes HeroUI):
  - `src/app/(tabs)/__tests__/layout.test.tsx` (R1) y
    `src/app/(auth)/__tests__/layout.test.tsx` (R2):
    `jest.mock('../../../providers/auth-provider', () => ({ useAuth: jest.fn() }))`
    y `jest.mock('expo-router', () => ({ Redirect: jest.fn(() => null),
    Tabs: Object.assign(jest.fn(() => null), { Screen: jest.fn(() => null) }),
    Stack: jest.fn(() => null) }))`. Asserts sobre
    `Redirect.mock.calls[0][0].href`, sobre que `Tabs`/`Stack` se renderiza
    en el estado permitido, y `toJSON() === null` en `loading` (R1). Se
    mockea también `../../components/floating-tab-bar` para no arrastrar
    safe-area al test de layout.
  - `src/app/(tabs)/__tests__/screens.test.tsx` (R5, R6): render directo de
    cada pantalla dentro de `HeroUINativeProvider`; para R6,
    `jest.mock('../../../providers/auth-provider')` con
    `signOut: jest.fn()` y `fireEvent.press` sobre `profile-sign-out`.
  - `src/components/__tests__/floating-tab-bar.test.tsx` (R7, R8): props
    fake `{ state: { index: 0, routes: [{key:'home-1',name:'home'}, ...5] },
    navigation: { emit: jest.fn(() => ({ defaultPrevented: false })),
    navigate: jest.fn() } }`;
    `jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 34, left: 0 }) }))`;
    render dentro de `HeroUINativeProvider` (para `useThemeColor`).
    Asserts R7: los 5 testIDs presentes y en orden, `accessibilityState.selected`
    del activo, press en `tab-map` → `emit` + `navigate('map')`, press en
    `tab-home` (activo) → no `navigate`, `emit` devolviendo
    `defaultPrevented: true` → no `navigate`. Assert R8: el style aplanado
    del contenedor `floating-tab-bar` contiene `bottom: 46`.
  - La mudanza R4 replica el patrón R6 de #33: `git mv` + solo imports.

- **D8 — typedRoutes/typecheck.** `experiments.typedRoutes` ya está activo;
  los tipos viven en `.expo/types/router.d.ts` y se regeneran al arrancar
  `bunx expo start` (o `bunx expo customize tsconfig.json` no es necesario:
  ya configurado en #31). Tras crear las rutas nuevas, `bun run typecheck`
  (`tsc --noEmit`) debe salir 0 — si `Href` no reconoce `/home`, regenerar
  tipos arrancando el dev server una vez. `bun run lint` también en 0 (R9).

## Archivos afectados

Todos en la isla móvil salvo `feature_list.json`:

- `mobile-pet-tracker/src/app/(tabs)/_layout.tsx` — nuevo (D4; R1)
- `mobile-pet-tracker/src/app/(auth)/_layout.tsx` — nuevo (D4; R2)
- `mobile-pet-tracker/src/app/index.tsx` — solo href (D6; R3)
- `mobile-pet-tracker/src/app/(auth)/login.tsx` — solo href (D6; R3)
- `mobile-pet-tracker/src/app/(auth)/register.tsx` — solo href (D6; R3)
- `mobile-pet-tracker/src/app/__tests__/index.test.tsx` — solo assert (R3)
- `mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx` — solo assert (R3)
- `mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx` — solo assert (R3)
- `mobile-pet-tracker/src/app/(tabs)/health.tsx` — movido desde `src/app/health.tsx` (R4)
- `mobile-pet-tracker/src/app/(tabs)/__tests__/health.test.tsx` — movido, solo imports (R4)
- `mobile-pet-tracker/src/app/(tabs)/{home,map,food,profile}.tsx` — nuevos (D5; R5, R6)
- `mobile-pet-tracker/src/app/(tabs)/__tests__/{layout,screens}.test.tsx` — nuevos
- `mobile-pet-tracker/src/app/(auth)/__tests__/layout.test.tsx` — nuevo
- `mobile-pet-tracker/src/components/floating-tab-bar.tsx` — nuevo (D3; R7, R8)
- `mobile-pet-tracker/src/components/__tests__/floating-tab-bar.test.tsx` — nuevo
- `feature_list.json` — #34 a `in_progress`/`done` según flujo

Prohibido tocar: `backend-pet-tracker/`, `infra/`, `init.config.sh`,
`.github/workflows/ci.yml` (R10). Sin cambios en `package.json` ni
`bun.lock` (cero dependencias nuevas).

## Alternativas descartadas

- **`NativeTabs`** (preferencia de la skill expo-router): tab bar del
  sistema, no acepta componente custom → incompatible con el requisito
  visual flotante Dribbble. Si algún día se quiere look 100% nativo iOS,
  se migra el `_layout` de (tabs) sin tocar pantallas.
- **`expo-blur`/`expo-glass-effect` como fondo de la barra**: ya
  instalados, pero glass-effect es iOS-only y el smoke es Android/Expo Go;
  `bg-surface` + border + shadow cumple el diseño con tokens. Reevaluar en
  una feature de pulido visual.
- **Guard solo en el splash `/` (statu quo de #33)**: no protege
  deep-links a `/home` etc. ni expulsa de `(auth)` a sesiones activas; con
  5 rutas autenticadas el guard por layout de grupo es el patrón de la
  skill y elimina el problema de raíz.
- **Importar `BottomTabBarProps` de `@react-navigation/bottom-tabs`**:
  import directo de `@react-navigation/*` está desaconsejado en SDK 56+ y
  acopla el componente; el tipo estructural de D3 es el subset exacto que
  la barra usa y simplifica los tests.
- **Mantener `/health` como destino post-login**: ahorraría tocar #33,
  pero deja al usuario aterrizando en una pantalla de diagnóstico como
  "home" y obliga a #35 a hacer el mismo cambio igualmente. Se hace ahora,
  acotado a 3 hrefs + 3 asserts (R3).
- **`state.routes` como fuente del render de la barra**: obligaría a
  mapear icono/label por nombre en runtime; la constante `TABS` fija orden
  e iconos en un solo sitio y falla en typecheck si una ruta se renombra.
- **Sign out como pantalla/menú de settings**: scope de una feature
  propia; un botón en el placeholder Profile cierra la deuda de #33 con
  una línea y hace el guard R1 verificable en el smoke.
