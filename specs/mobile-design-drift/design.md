---
feature: "mobile-design-drift"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-design-drift]]

> Ver [[requirements]]. Rutas relativas a `mobile-pet-tracker/`.
> Feature de limpieza: cero cambios de comportamiento de datos/navegación.

## Decisiones técnicas

- **Tokens en `@theme`** (R1): Tailwind v4 genera utilidades por namespace —
  `--radius-card: 20px` → clase `rounded-card`; `--text-2xs: 10px` →
  clase `text-2xs`. Van en el bloque `@theme` existente de
  `src/theme/global.css` (líneas 8-14, junto a las fuentes), NO en
  `@layer theme`.
- **`Card` propio sobre `View`/`Pressable`, NO sobre el `Card` de
  heroui-native** (R2): bug conocido de #46 (commit `e370daa`): heroui
  deriva su radius de la escala shadcn `--radius`, que no coincide con los
  20px del diseño. El componente compartido aplica sus clases sobre
  primitivas de react-native y no hereda nada de heroui. **Codex: no
  definir `--radius` ni tocar la escala de heroui.**
- **Merge de clases con `twMerge`** (R2): `tailwind-merge@^3.6.0` es
  dependencia directa (package.json); resuelve conflictos como `p-3` de un
  uso contra `p-4` del variant sin lógica propia. `tailwind-variants` se
  descarta (más API de la necesaria para 3 variantes).
- **Firma exacta de `src/components/card.tsx`**:

  ```tsx
  import { Pressable, View, type ViewProps } from 'react-native';
  import { twMerge } from 'tailwind-merge';

  const variantClassNames = {
    surface: 'rounded-card border border-border bg-surface p-4 shadow-sm',
    accent: 'rounded-card bg-accent p-5 shadow-sm',
    secondary: 'rounded-card border border-border bg-surface-secondary p-4',
  } as const;

  export type CardVariant = keyof typeof variantClassNames;

  export type CardProps = ViewProps & {
    variant?: CardVariant;
    onPress?: () => void;
  };

  export function Card({ variant = 'surface', onPress, className, ...rest }: CardProps)
  ```

  (`className` llega vía uniwind sobre `ViewProps`; si el tipo no lo trae,
  declararlo como `className?: string` en `CardProps`). Con `onPress` →
  `Pressable accessibilityRole="button"`; sin él → `View`. `testID`,
  `children` y el resto de props se pasan tal cual (`{...rest}`).
- **Overlay de map con `insets.top + 12`** (R7): el `+12` replica el
  respiro de la convención §Dimensiones (`insets.top + 12`); `insets` ya
  existe en `map.tsx` (línea 48). Se añade `testID="map-empty-overlay"`
  al `View` para poder testear el estilo (el testID `map-empty` del `Text`
  interior no cambia).
- **Skeletons con el mismo `testID` que el Spinner que reemplazan** (R8):
  los tests existentes (`health-loading`, `weight-log-loading`,
  `map-loading`) quedan verdes sin editar sus asserts actuales.
- **`profile.tsx` pasa a `ScrollView`** (R6): es la única forma de aplicar
  `contentContainerStyle` de la convención; el contenido actual (una card +
  botón sign out) no cambia. `gap-4 p-6` del `View` actual se sustituye por
  el `contentContainerStyle` estándar (`gap: 16, padding: 24` — el salto
  gap 16px/padding 24px es el cierre de convención pedido, no un rediseño).
- **Grep checks como test jest** (R3/R4): `src/__tests__/design-drift.test.ts`
  recorre `src/` con `fs` (recursivo), filtra `*.ts`/`*.tsx` excluyendo
  rutas que contengan `__tests__`, y falla si algún archivo matchea
  `rounded-[20px]` o `text-[10px]` (usar `String.raw`/concatenación para no
  auto-matchear literales). Mismo archivo verifica que las 7 pantallas de
  tabs importan `from '../../components/card'`.

## Adopción del Card (mapa exacto de reemplazos, R3)

Receta actual → `<Card>` compartido. El resto de clases de cada uso (gap,
flex, overflow) se conserva en `className`; los `testID` no cambian.

| Archivo:línea (hoy) | testID | Reemplazo |
|---|---|---|
| `src/app/(tabs)/home.tsx:144` | `pet-card` | `<Card testID="pet-card">` |
| `src/app/(tabs)/home.tsx:242` | `summary-card` | `<Card testID="summary-card" className="gap-4">` |
| `src/app/(tabs)/food.tsx:138` | `food-plan-card` | `<Card testID="food-plan-card" variant="accent" className="gap-4">` |
| `src/app/(tabs)/food.tsx:166` | `food-meals-section` | `<Card testID="food-meals-section" className="gap-3">` |
| `src/app/(tabs)/food.tsx:245` | `food-ai-card` | `<Card testID="food-ai-card" variant="secondary" className="gap-3">` |
| `src/app/(tabs)/food.tsx:282` (Pressable) | `meal-schedule-link` | `<Card testID="meal-schedule-link" className="flex-row items-center justify-between" onPress={() => router.push('/meal-schedule' as Href)}>` |
| `src/app/(tabs)/meal-schedule.tsx:166` | `meal-schedule-summary` | `<Card testID="meal-schedule-summary" variant="accent" className="gap-4">` |
| `src/app/(tabs)/meal-schedule.tsx:201` | `meal-time-row-${index}` | `<Card testID={…} className="flex-row items-center gap-3">` |
| `src/app/(tabs)/meal-schedule.tsx:256` | `nutrition-profile-section` | `<Card testID="nutrition-profile-section" className="gap-3">` |
| `src/app/(tabs)/health.tsx:134` | `next-vaccine-card` | `<Card testID="next-vaccine-card" className="flex-row items-center gap-3">` |
| `src/app/(tabs)/health.tsx:175` | `vaccine-row-${id}` | `<Card testID={…} className="gap-1">` |
| `src/app/(tabs)/health.tsx:204` | `weight-card` | `<Card testID="weight-card" className="gap-3">` |
| `src/app/(tabs)/weight-log.tsx:141` | — | `<Card className="gap-4">` (card del formulario) |
| `src/app/(tabs)/profile.tsx:33` | — | `<Card className="overflow-hidden">` |
| `src/app/(tabs)/map.tsx:226` | — | `<Card className="p-3">` |

Skeletons `rounded-[20px]` → `rounded-card` (misma clase, resto igual):
`food.tsx:119,123,128` y `meal-schedule.tsx:140,144,251`.

Imports tras la adopción:

- `health.tsx`, `meal-schedule.tsx`, `profile.tsx`, `map.tsx`: `Card` sale
  del import de `heroui-native` (ya no se usa) y entra
  `import { Card } from '../../components/card'`.
- `home.tsx`, `food.tsx`, `weight-log.tsx`: conservan usos del Card de
  heroui NO incluidos en la receta (ver [[requirements]] §Fuera de
  alcance) → alias `import { Card as HeroUICard, … } from 'heroui-native'`
  en esos usos, y `import { Card } from '../../components/card'` para los
  de la tabla.

## Archivos afectados

Todo es capa de presentación (app Expo, sin capas domain/application).

- `src/theme/global.css` — R1: dos tokens en `@theme`
- `src/components/card.tsx` — R2: nuevo
- `src/components/__tests__/card.test.tsx` — R2: nuevo
- `src/__tests__/design-drift.test.ts` — R3/R4: nuevo (grep checks)
- `src/app/(tabs)/home.tsx` — R3, R4
- `src/app/(tabs)/food.tsx` — R3, R4
- `src/app/(tabs)/meal-schedule.tsx` — R3
- `src/app/(tabs)/health.tsx` — R3, R4, R5, R8
- `src/app/(tabs)/weight-log.tsx` — R3, R4, R5, R8
- `src/app/(tabs)/profile.tsx` — R3, R6
- `src/app/(tabs)/map.tsx` — R3, R4, R7, R8
- `src/components/floating-tab-bar.tsx` — R4 (líneas 88-89)
- `src/theme/__tests__/global-css.test.ts` — R1: nuevo describe
- `src/app/(tabs)/__tests__/{health,weight-log,profile,map,screens}.test.tsx`
  — R5–R8: asserts nuevos + mock de insets en profile/screens

## Alternativas descartadas

- **Basar `card.tsx` en el `Card` de heroui-native**: hereda `--radius`
  shadcn (bug #46, `e370daa`); el radius no sería 20px.
- **`tailwind-variants` para los variantes**: sobra para un mapa de 3
  strings; `twMerge` basta.
- **Script shell de grep en CI en vez de test jest**: el test jest corre
  con la suite existente (`bun run test`) sin tocar init.sh ni CI.
- **Eliminar el fallback hex de `use-theme-colors.ts`**: imposible sin
  cambiar comportamiento (ver [[requirements]] §Fuera de alcance).
- **Migrar pantallas a `src/screens/`**: la convención lo reserva para
  features que toquen las pantallas de fondo; esto es limpieza mecánica.
