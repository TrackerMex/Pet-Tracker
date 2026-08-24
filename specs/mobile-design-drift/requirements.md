---
feature: "mobile-design-drift"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-design-drift]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas. Insumo:
> `progress/audit_design-drift_mobile.md` (auditoría 2026-08-24) y
> `docs/conventions.md` §Dimensiones de pantalla uniformes.
> Todas las rutas son relativas a `mobile-pet-tracker/`.
> Restricción global: **sin cambios visuales intencionales**, salvo los que
> introducen R5–R8 (safe area y skeletons).

## Requisitos funcionales

- **R1**: WHEN se compila la app THE SYSTEM SHALL definir los tokens
  `--radius-card: 20px` y `--text-2xs: 10px` dentro del bloque `@theme` de
  `src/theme/global.css` (generando las utilidades `rounded-card` y
  `text-2xs` de Tailwind v4).
  - Test: `src/theme/__tests__/global-css.test.ts`, nuevo
    `describe('R1: tokens rounded-card y text-2xs')` que lee el archivo y
    verifica que ambos tokens con esos valores exactos están dentro del
    bloque `@theme { … }`.

- **R2**: WHEN un componente renderiza `<Card>` de `src/components/card.tsx`
  THE SYSTEM SHALL aplicar la receta de card según la prop
  `variant` (default `'surface'`):
  - `surface` → `rounded-card border border-border bg-surface p-4 shadow-sm`
  - `accent` → `rounded-card bg-accent p-5 shadow-sm`
  - `secondary` → `rounded-card border border-border bg-surface-secondary p-4`

  y SHALL fusionar la prop `className` **después** de las clases del variant
  con `twMerge` (de `tailwind-merge`, dependencia directa), de modo que
  p. ej. `className="p-3"` gana sobre el `p-4` del variant. IF recibe prop
  `onPress` THEN THE SYSTEM SHALL renderizar un `Pressable` con
  `accessibilityRole="button"`; en caso contrario un `View`. El componente
  NO se basa en el `Card` de heroui-native (ver [[design]], bug #46).
  - Test: nuevo `src/components/__tests__/card.test.tsx` (RTL), casos
    nombrando R2: variant por defecto, variant accent, variant secondary
    (sin `shadow-sm`), merge `p-3` sobre `p-4`, y `onPress` disparado con
    `fireEvent.press`.

- **R3**: WHILE existe código bajo `src/` (excluyendo carpetas `__tests__`)
  THE SYSTEM SHALL contener cero ocurrencias de la clase `rounded-[20px]`,
  y las 7 pantallas de tabs (`src/app/(tabs)/{home,food,meal-schedule,health,weight-log,profile,map}.tsx`)
  SHALL importar `Card` desde `../../components/card` para toda card con la
  receta auditada (mapa exacto de reemplazos en [[design]] §Adopción). Los
  `Skeleton` que hoy usan `rounded-[20px]` pasan a `rounded-card`.
  - Test: nuevo `src/__tests__/design-drift.test.ts` (grep check por `fs`):
    cero `rounded-[20px]` en `src/**/*.{ts,tsx}` sin `__tests__`, y las 7
    pantallas contienen `from '../../components/card'`. Además, las suites
    RTL existentes de las 7 pantallas siguen verdes sin cambios de testID.

- **R4**: WHILE existe código bajo `src/` (excluyendo `__tests__`)
  THE SYSTEM SHALL contener cero ocurrencias de la clase `text-[10px]`;
  toda ocurrencia actual (en `src/components/floating-tab-bar.tsx`,
  `src/app/(tabs)/map.tsx`, `home.tsx`, `food.tsx`, `health.tsx` y
  `weight-log.tsx`) se reemplaza por `text-2xs`, sin tocar el resto de
  clases de cada `className`.
  - Test: mismo `src/__tests__/design-drift.test.ts`, assert cero
    `text-[10px]`; suites existentes verdes.

- **R5**: WHEN se renderizan `src/app/(tabs)/health.tsx` o
  `src/app/(tabs)/weight-log.tsx` THE SYSTEM SHALL incluir
  `paddingTop: insets.top + 12` en el `contentContainerStyle` de su
  `ScrollView` raíz (completando la convención `padding: 24`, `gap: 16`,
  `paddingBottom: insets.bottom + 96` ya presente; nada más cambia en esos
  estilos).
  - Test: en `src/app/(tabs)/__tests__/health.test.tsx` y
    `weight-log.test.tsx` (insets mockeados `top: 40, bottom: 24`), nuevo
    `it` nombrando R5 que verifica
    `contentContainerStyle` contiene `paddingTop: 52`.

- **R6**: WHEN se renderiza `src/app/(tabs)/profile.tsx` THE SYSTEM SHALL
  usar como raíz un `ScrollView` con `testID="screen-profile"`,
  `className="flex-1 bg-background"` y `contentContainerStyle`
  `{ padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96 }`
  vía `useSafeAreaInsets` (hoy es un `View` con `p-6 gap-4` y sin insets).
  - Test: `src/app/(tabs)/__tests__/profile.test.tsx`, nuevo `it` nombrando
    R6 con `jest.mock('react-native-safe-area-context', …)` (insets
    `top: 40, bottom: 24`) que verifica el `contentContainerStyle` completo
    (`paddingTop: 52`, `paddingBottom: 120`). `screens.test.tsx` recibe el
    mismo mock para seguir verde.

- **R7**: WHEN `src/app/(tabs)/map.tsx` muestra el overlay "No location data
  yet" (hoy `top: 64` hardcodeado en la línea 208) THE SYSTEM SHALL
  posicionarlo con `top: insets.top + 12` y SHALL exponer
  `testID="map-empty-overlay"` en ese `View`.
  - Test: `src/app/(tabs)/__tests__/map.test.tsx` (insets mockeados
    `top: 40`), nuevo assert nombrando R7:
    `getByTestId('map-empty-overlay').props.style` contiene `top: 52`.

- **R8**: WHILE los datos están pendientes THE SYSTEM SHALL mostrar un
  `Skeleton` (heroui-native) dimensionado en lugar de `Spinner`,
  conservando el mismo `testID`, en exactamente estos tres puntos:
  - `health.tsx` (hoy línea 90): `<Skeleton testID="health-loading" className="h-12 w-full rounded-card" />`
  - `weight-log.tsx` (hoy línea 201): `<Skeleton testID="weight-log-loading" className="h-40 w-full rounded-card" />`
  - `map.tsx` (hoy líneas 142-146, el `View` wrapper incluido):
    `<Skeleton testID="map-loading" className="flex-1" />`

  Los imports de `Spinner` que queden sin uso se eliminan.
  - Test: en `health.test.tsx`, `weight-log.test.tsx` y `map.test.tsx`,
    asserts nombrando R8 de que el elemento `*-loading` tiene `className`
    con su clase de dimensión (`h-12`, `h-40`, `flex-1` respectivamente);
    los asserts existentes `getByTestId('*-loading')` siguen verdes.

## Fuera de alcance

- `src/theme/use-theme-colors.ts:19` (fallback hex `#F7F8FA`/`#0D1117`
  duplicado de `global.css`): **excluido**. El fallback se ejecuta cuando
  `Uniwind.getCSSVariable` devuelve `undefined` (p. ej. en jest) y los
  valores del CSS no son importables en runtime TS; eliminarlo cambiaría el
  comportamiento (fallback `undefined`). Se documenta y no se toca.
- La duplicación `--accent`/`--color-accent` en `global.css` (posible
  requisito de heroui/uniwind) y los `size-[72px]` de avatares (audit §4).
- Los `Spinner` de `home.tsx` (`home-loading`) y `food.tsx` (`food-loading`):
  la auditoría solo señala health/weight-log/map.
- Las cards que NO usan la receta auditada: `pet-card-error` y `collar-card`
  (home), `plan-warning-*` (food), `weight-row-*` (weight-log) y
  `last-position-card` (home, `rounded-2xl bg-default`). Siguen como están.
- Migrar las pantallas de tabs al patrón *route delgado + `src/screens/`*
  (conventions.md §Estructura Expo oficial, en `main`): la convención manda
  migrar solo cuando una feature las "toque de fondo"; estos son reemplazos
  mecánicos de clases.
- Cualquier cambio visual no descrito en R5–R8.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
