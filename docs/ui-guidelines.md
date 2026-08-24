# Carta de UI — mobile-pet-tracker

> Fuente de verdad de UI/UX móvil para TODOS los agentes (Claude, subagentes,
> Codex CLI). Toda spec, implementación y review de trabajo móvil se valida
> contra este documento. Complementa `docs/conventions.md` §Convenciones de
> la app móvil; ante conflicto, gana el más específico.

## Skills: quién carga qué

Las guías genéricas viven en las skills oficiales de Expo — instaladas en
Claude Code (plugin `expo`) y en Codex CLI (`codex plugin add
expo@openai-curated`, mismo contenido v1.12+). Este doc NO las duplica:
fija las decisiones ya tomadas en ESTE repo.

| Tarea móvil | Skill a cargar antes de trabajar |
|---|---|
| Cualquiera (routing/entrada) | `expo-overview` → deriva a la específica |
| Tokens, tema, componentes reusables | `expo-design-system` |
| Estilo nativo, safe areas, HIG | `expo-native-ui` |
| Sheets, pickers, menus, toggles | `expo-ui` |
| Animaciones, gestos, haptics | `expo-animation` (en Claude: `animate-expo`) |
| Tailwind/uniwind | `expo-tailwind-setup` |

Subagentes y handoffs a Codex deben instruir explícitamente la carga de la
skill pertinente (regla ya en memoria de sesión; aquí queda oficial).

## Decisiones fijas de este repo (no re-litigar)

1. **Sistema de estilos**: Tailwind v4 + uniwind + heroui-native. Tokens en
   `mobile-pet-tracker/src/theme/global.css` — ÚNICA entrada. Prohibido
   crear un segundo sistema (theme.ts paralelo, StyleSheet.create,
   styled-components).
2. **Tokens obligatorios**: todo valor visual repetido es un token en
   `@theme` de global.css. Existentes: colores semánticos light/dark,
   fuentes Inter, `--radius-card: 20px`, `--text-2xs: 10px`. Si un valor
   nuevo se repite 2+, se añade token — no clase arbitraria.
3. **Grep-clean permanente** (criterio de aceptación de toda feature móvil):
   - cero hex fuera de `src/theme/`
   - cero clases arbitrarias `[...]` (`rounded-[20px]`, `text-[10px]`,
     `p-[13px]`...) — usar el token; si no existe, crearlo primero
   - cero `StyleSheet.create`, cero shadow/elevation legacy (solo `boxShadow`)
4. **Componentes compartidos** (`src/components/`): `card.tsx`
   (surface|accent|secondary — usa `--radius-card`, NUNCA heredar `--radius`
   de heroui/shadcn, bug #46), `pet-switcher.tsx` (selector de mascota,
   siempre este), `floating-tab-bar.tsx`, `weight-chart.tsx`. Regla de
   extracción: ≥2 pantallas + rol nombrable + API menor que implementación.
   Promoción: inline → `src/screens/<x>/` → `src/components/`.
5. **Base de componentes**: heroui-native (Button, Skeleton, TextField,
   Avatar, Chip...). `@expo/ui` por defecto para lo que heroui no cubre:
   BottomSheet (`isPresented`/`onDismiss`, envuelto en `Host`), DateTimePicker
   (`@expo/ui/community/datetimepicker`), Menu, Slider, `List`+`ListItem`
   (solo filas agrupadas cortas estilo Settings — NO es virtualizada). Listas
   de datos de longitud desconocida: FlatList/FlashList. Prohibido:
   @gorhom/bottom-sheet, Reanimated para sheets, Picker/SafeAreaView/WebView
   de RN (removidos).
6. **Dimensiones de pantalla**: conventions.md §Dimensiones — `paddingTop:
   insets.top + 12`, `padding: 24`, `gap: 16`, `paddingBottom: insets.bottom
   + 96` vía `useSafeAreaInsets` en `contentContainerStyle` (nunca en el
   ScrollView mismo). Overlays absolutos usan `insets.top + 12`, jamás
   top fijo. `contentInsetAdjustmentBehavior="automatic"` NO sustituye el
   paddingTop (no-op en Android).
7. **Estados de carga**: Skeleton de heroui dimensionado como el contenido
   final. Prohibido Spinner suelto que salte el layout.
8. **Estructura**: route delgado en `src/app/` + pantalla en `src/screens/`
   (conventions.md §estructura Expo oficial, desde #39). Archivos kebab-case.
   Rutas con extensión de plataforma jamás dentro de `src/app/`.
9. **Tema**: light/dark vía uniwind; colores para código imperativo (mapas,
   iconos) SIEMPRE vía `useThemeColors` de `src/theme/use-theme-colors.ts`
   (reactivo; bug de resolución stale ya visto en #46). Mapa dark:
   `customMapStyle` con `src/theme/map-style-dark.json`.

## Animación (decisiones por defecto)

- Reanimated 4 en UI thread; nada que dependa de JS thread para gestos.
- Springs sobre timings para elementos que entran/salen o responden a
  gesto; timings solo para opacidad/color. Duraciones: 150ms feedback,
  250ms transición, 400ms superficies grandes — si se repiten, se
  promueven a tokens `--motion-*` en global.css.
- Entering/exiting de Reanimated para cambios de estado visibles
  (aparición de cards, resultados de fetch).
- Nunca pasar valores `Color`/`PlatformColor`/var CSS a estilos de
  Reanimated — color estático resuelto con `useThemeColors`.
- Interrumpible siempre: un gesto puede cortar cualquier animación en curso.
- `prefers-reduced-motion` respetado (Reanimated `ReducedMotionConfig` o
  guard equivalente).
- expo-haptics NO está instalado; toda propuesta que lo requiera lo declara
  como dependencia nueva en su spec.
- Todo debe correr en Expo Go SDK 57 (runtime de smoke del humano) — nada
  que exija dev build.
- Backlog priorizado con valores exactos: `progress/audit_animations_mobile.md`.

## Micro-reglas de pulido (de expo-native-ui, adoptadas)

- `borderCurve: 'continuous'` en toda esquina redondeada no-cápsula.
- `gap` sobre margin; padding sobre margin.
- `<Text selectable />` en datos copiables y mensajes de error.
- Contadores/números alineados: `fontVariant: ['tabular-nums']`.
- Números grandes formateados (1.4M, 38k).
- Feedback pressed en TODO elemento tappable (Pressable style function o
  componente heroui que ya lo trae); touch target ≥ 44pt.
- Títulos de pantalla: header del stack cuando exista, no Text suelto.

## Checklist de autocrítica (cierra toda pantalla nueva o modificada)

Screenshot mental (o real en smoke) contra: jerarquía (lo importante
primero), proximidad (relacionado más cerca), repetición (esquinas/sombras/
acentos iguales = tokens), alineación (bordes comparten ejes). Si una
pantalla falla el mismo check dos veces, el fix va al theme o a un
componente — no a la pantalla.
