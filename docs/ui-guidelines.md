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
| Diseñar/mejorar una pantalla o flujo completo | `appllama-app-design-skill` (obligatoria, ver abajo) |

Subagentes y handoffs a Codex deben instruir explícitamente la carga de la
skill pertinente (regla ya en memoria de sesión; aquí queda oficial).

### `appllama-app-design-skill`: cuándo y con qué límites

Instalada en `.agents/skills/` (universal: Claude Code y Codex CLI la ven).
Se carga en **toda** tarea de UI móvil — pantalla nueva, rediseño, flujo,
onboarding, estados vacíos, jerarquía visual, semántica de navegación
(push vs replace, sheet vs modal, puertas de un solo sentido). Aporta el
listón de "se siente nativa" y la disciplina anti-slop.

Tres límites, no negociables:

1. **La carta gana siempre sobre la skill.** La skill asume colores
   semánticos nativos (`Color.ios.label`) y su propio sistema de estilos;
   este repo usa Tailwind v4 + uniwind + heroui-native con tokens en
   `global.css` (§Decisiones fijas 1-3). De la skill se toma el **patrón**
   (esqueleto, jerarquía, motion, navegación), nunca el sistema de estilos.
   Cualquier sugerencia suya que meta hex, `StyleSheet.create` o clases
   arbitrarias se descarta: rompe el grep-clean.
2. **Su "simulator loop" no aplica tal cual.** Pide iOS Simulator en macOS
   (`xcrun simctl io recordVideo`); aquí la verificación es la prueba de
   humo que corre el humano en Android (dev build o Expo Go según la
   feature). El checklist de la skill sirve como guion de esa prueba, no
   como comando a ejecutar.
3. **`appllama-usage` no se instala.** Depende del MCP de pago
   `mcp.appllama.io`. Si algún día se contrata, la fase "estudiar 20-30
   pantallas reales antes de diseñar" pasa a estar disponible; hasta
   entonces esa fase se sustituye por el diseño de Figma del proyecto y las
   decisiones fijas de abajo.

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
   siempre este), `floating-tab-bar.tsx`, `weight-chart.tsx`, `pet-map.tsx`
   (adapta el contrato del tab Map a la API nativa de `expo-maps`). Regla de
   extracción: ≥2 pantallas + rol nombrable + API menor que implementación.
   Promoción: inline → `src/screens/<x>/` → `src/components/`.
5. **Base de componentes**: heroui-native (Button, Skeleton, TextField,
   Avatar, Chip...). `@expo/ui` para lo que heroui no cubre, PERO con esta
   distinción (aprendida por crash real en el smoke de #39, Android + Expo
   Go): **la capa root/universal de `@expo/ui` (SwiftUI/Jetpack) crashea en
   Expo Go Android**. El default se mantiene en la capa
   **`@expo/ui/community/*`** porque sus wrappers funcionan tanto en Expo Go
   como en dev builds:
   `community/bottom-sheet` (montado sobre @gorhom/bottom-sheet — esa dep es
   peer del wrapper, NO removerla), `community/datetime-picker`,
   `community/menu`, `community/picker`, `community/slider`,
   `community/segmented-control`. Adoptar la capa root de `@expo/ui`, aunque
   el smoke use dev build desde #54, requiere una feature separada; esta
   decisión no se cambia de paso. `List`+`ListItem` solo para filas agrupadas
   cortas estilo Settings — NO es virtualizada; listas de datos de longitud
   desconocida: FlatList/FlashList. Prohibido: importar @gorhom directamente
   (siempre vía el wrapper community), Reanimated para sheets,
   Picker/SafeAreaView/WebView de RN (removidos).
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
   (reactivo; bug de resolución stale ya visto en #46). El mapa traduce la
   preferencia guardada a `colorScheme` de `expo-maps` mediante
   `src/components/pet-map.tsx`.

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
- El runtime de smoke del humano es el dev build de Android desde 2026-08-27;
  `expo-maps` no está disponible en Expo Go.
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
