Worktree: /home/claude/sites/Pet-Tracker-wt-153

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-153
$ git branch --show-current
feature/153-mobile-welcome-pingo
$ git rev-parse --short HEAD
c03ddc09
$ git status --short
```

H0: `c03ddc09` (HEAD del handoff, T0 y R13). Árbol limpio al arrancar.

## T0 — Anclas en H0

```text
A1. $ test -f mobile-pet-tracker/src/theme/motion.ts && echo ok
ok
A2. $ grep -cE '^export const MOTION_(FEEDBACK_MS|TRANSITION_MS|SURFACE_MS|STAGGER_MS|ENTRANCE_OFFSET_Y|SETTLE_SPRING|FADE_TIMING|FILL_TIMING)\b' mobile-pet-tracker/src/theme/motion.ts
8
A3. $ grep -cF "it('no exporta nada más'" mobile-pet-tracker/src/theme/__tests__/motion.test.ts
1
A4. $ test ! -e mobile-pet-tracker/.expo/types/router.d.ts && echo ok
ok
A5. $ grep -cF "+ 8, // #118 R1" mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
1
A6. $ grep -cF "{ file: 'src/screens/welcome/index.tsx', key: 'welcome.legalNotice' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
1
A7. $ grep -cF "it('resuelve las 8 ocurrencias de welcome'" mobile-pet-tracker/src/__tests__/ui-language.test.ts
1
A8. $ grep -cF "'welcome.legalNotice':" mobile-pet-tracker/src/i18n/catalog.ts
2
A9. $ grep -cF "**6. Idioma:" docs/ui-guidelines.md
1
A10. $ grep -cF "## Checklist de autocrítica (cierra toda pantalla nueva o modificada)" docs/ui-guidelines.md
1
A11. $ grep -cF "**7. " docs/ui-guidelines.md
0
A12. $ grep -cF "### §2.19" specs/mobile-ui-language/design.md
1
A13. $ grep -cF "## 3. La infraestructura" specs/mobile-ui-language/design.md
1
A14. $ grep -cF "describe('R10', () => {" mobile-pet-tracker/src/screens/welcome/index.test.tsx
1
A15. $ grep -cF "it('apila los siete bloques en orden'" mobile-pet-tracker/src/screens/welcome/index.test.tsx
1
A16. $ grep -cF "it('pinta hero, marca, tagline y legal con sus clases'" mobile-pet-tracker/src/screens/welcome/index.test.tsx
1
A17. $ grep -cF "'w-full rounded-xl bg-accent'" mobile-pet-tracker/src/screens/welcome/index.test.tsx
1
A18. $ ls /home/claude/pet-tracker-mascot/webp/ | tr '\n' ' '
pingo-wave-blink.webp pingo-wave.webp A19. $ ls mobile-pet-tracker/assets/images | grep -cE '^(pingo|mascot)-'
0
A20. $ grep -ciP '#(?!\d{2,3} R\d)[\da-f]{3,8}\b|[A-Za-z0-9_-]+-\[[^\]]+\]|StyleSheet|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:' mobile-pet-tracker/src/theme/motion.ts
0
A21. $ grep -cF 'Las constantes anteriores a #152 (' docs/ui-guidelines.md
1
A22. $ grep -cF '`WELCOME_ENTRANCE_MS`, `BAR_ENTRY_*`, `METRIC_TAB_SPRING` y' docs/ui-guidelines.md
1
A23. $ grep -cF '## Enmienda #152 — el movimiento vive en src/theme/motion.ts' docs/ui-guidelines.md
1
G1. $ grep -ciP '#(?!\d{2,3} R\d)[\da-f]{3,8}\b' mobile-pet-tracker/src/screens/welcome/index.tsx
0
G2. $ grep -cP '[A-Za-z0-9_-]+-\[[^\]]+\]' mobile-pet-tracker/src/screens/welcome/index.tsx
0
G3. $ grep -ciP 'StyleSheet|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:' mobile-pet-tracker/src/screens/welcome/index.tsx
0
G4. $ grep -cP '\brounded-(?:2xl|lg|md|sm)\b|text-accent(?![-\w])' mobile-pet-tracker/src/screens/welcome/index.tsx
0
G5. $ grep -cP 'expo-linear-gradient|expo-symbols|\buseThemeColor\b' mobile-pet-tracker/src/screens/welcome/index.tsx
0
G6. $ grep -oP 'text-accent-strong\b' mobile-pet-tracker/src/screens/welcome/index.tsx | wc -l
2
G7. $ grep -oP '[\x27"`]/(?:\(auth\)/)?login\b' mobile-pet-tracker/src/screens/welcome/index.tsx | wc -l
1
G8. $ grep -oP 'rounded-xl bg-accent(?=[\s\x27"`])' mobile-pet-tracker/src/screens/welcome/index.tsx | wc -l
1
G9. $ grep -cP '[A-Za-z0-9_-]+-\[[^\]]+\]' mobile-pet-tracker/src/screens/welcome/index.test.tsx
0
G10. $ grep -cP 'use-api|useApi' mobile-pet-tracker/src/screens/welcome/index.test.tsx
0
G11. $ grep -ciP '#(?!\d{2,3} R\d)[\da-f]{3,8}\b|[A-Za-z0-9_-]+-\[[^\]]+\]|StyleSheet|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:' mobile-pet-tracker/src/theme/motion.ts
0
H1. $ grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-07)' specs/mobile-welcome-pingo/requirements.md
1
H2. $ grep -cF -- '- [x] Enmienda E1 aprobada por humano (fecha: 2026-10-08)' specs/mobile-welcome-pingo/requirements.md
1
H3. $ grep -cF -- '- [ ] Smoke R14 superado' specs/mobile-welcome-pingo/requirements.md
1
H4. $ grep -cF "describe('#153" mobile-pet-tracker/src/screens/welcome/index.test.tsx
0
H5. $ grep -cF "describe('#153" mobile-pet-tracker/src/theme/__tests__/motion.test.ts
0
H6. $ grep -cF 'WELCOME_ENTRANCE_' mobile-pet-tracker/src/screens/welcome/index.tsx
6
H7. $ grep -cF 'WELCOME_ENTRANCE_' mobile-pet-tracker/src/screens/welcome/index.test.tsx
6
H8. $ grep -cF 'splash-icon' mobile-pet-tracker/src/screens/welcome/index.tsx
1
H9. $ grep -cF 'testID="welcome-hero"' mobile-pet-tracker/src/screens/welcome/index.tsx
1
H10. $ grep -cw Easing mobile-pet-tracker/src/screens/welcome/index.tsx
2
H11. $ grep -cF "from '../../theme/motion'" mobile-pet-tracker/src/screens/welcome/index.tsx
0
H12. $ grep -cF '<Card' mobile-pet-tracker/src/screens/welcome/index.tsx
0
H13. $ grep -cF 'border-b-4' mobile-pet-tracker/src/screens/welcome/index.tsx
0
H14. $ grep -cF 'cancelAnimation' mobile-pet-tracker/src/screens/welcome/index.tsx
0
H15. $ grep -cF 'return () =>' mobile-pet-tracker/src/screens/welcome/index.tsx
0
H16. $ grep -cF 'withRepeat' mobile-pet-tracker/src/screens/welcome/index.test.tsx
0
H17. $ grep -cF 'readdirSync' mobile-pet-tracker/src/screens/welcome/index.test.tsx
0
H18. $ grep -cF 'declare function require' mobile-pet-tracker/src/screens/welcome/index.test.tsx
0
H19. $ grep -cF 'StyleSheet.flatten' mobile-pet-tracker/src/screens/welcome/index.test.tsx
1
H20. $ grep -cF "'welcome.pingoGreeting'" mobile-pet-tracker/src/i18n/catalog.ts
0
H21. $ grep -cF 'welcome.pingoGreeting' mobile-pet-tracker/src/__tests__/ui-copy-table.ts
0
H22. $ grep -cF '### §2.20' specs/mobile-ui-language/design.md
0
H23. $ grep -cF 'export const MOTION_' mobile-pet-tracker/src/theme/motion.ts
8
H24. $ grep -cE 'testID="welcome-(brand|chips)"' mobile-pet-tracker/src/screens/welcome/index.tsx
2
```

58 anclas coinciden con H0.

`git rev-parse HEAD`: c03ddc09d344f0de6b36f7d8cbcffbedaf115897.
`git fetch origin`: exit=0.
`git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`: exit=0.
`test -d node_modules && echo presente`: presente.
`test ! -e .expo/types/router.d.ts; echo "exit=$?"`: exit=0.

Skills cargadas:
- `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`
- `.agents/skills/appllama-app-design-skill/SKILL.md` y `references/motion.md`
- `.agents/skills/animate-expo/SKILL.md`
- `.agents/skills/animation-vocabulary/SKILL.md`
- `.agents/skills/review-animations/SKILL.md`
- `.agents/skills/emil-design-eng/SKILL.md`
- `/home/claude/.codex/plugins/cache/ponytail/ponytail/4.13.0/skills/ponytail/SKILL.md`

Prevalecen la spec firmada, E1 y la carta, con sus tres límites sobre Appllama.
La investigación pertenece al leader y la validación visual al smoke humano Android.
Se usa Reanimated con transform/opacity en UI thread para el deleite de bienvenida;
valores y técnica son los cerrados por la spec. No se ejecuta init.sh ni infraestructura.
Trazabilidad se rellena una sola vez al cierre, conforme al handoff.

## T0 — Base medida

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-base-1.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts > /tmp/153-base-2.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/providers/__tests__/language-provider.test.tsx > /tmp/153-base-3.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       24 passed, 24 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/153-base-4.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       30 passed, 30 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts > /tmp/153-base-5.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       62 passed, 62 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/consistency-classnames.test.ts > /tmp/153-base-6.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       55 passed, 55 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/legibility-classnames.test.ts > /tmp/153-base-7.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       27 passed, 27 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/ui-language.test.ts 'src/app/\(tabs\)/__tests__/food.test.tsx' src/__tests__/hero-header-amendments.test.ts > /tmp/153-base-8.txt 2>&1; echo "exit=$?"
Test Suites: 6 passed, 6 total
Tests:       216 passed, 216 total
exit=0
```

Base: los siete ficheros y CARTA coinciden, todos exit=0.
Documentación versionada consultada antes del código, como pide mobile-pet-tracker/AGENTS.md: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) y [expo-image SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/image/).

## T1 rojo

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r1.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       3 failed, 28 passed, 31 total
exit=1
```

Detalle de cada it rojo (matcher y Expected/Received, consulta o ENOENT):

```text
  ● #153 R2: la carta escribe la voz de Pingo › declara el punto 7 tras el punto 6 y antes del checklist

    expect(received).toBeGreaterThan(expected)

    Expected: > 16919
    Received:   -1

      366 |     const language = '**6. Idioma:';
      367 |     const checklist = '## Checklist de autocrítica';
    > 368 |     expect(charter.indexOf(voice)).toBeGreaterThan(charter.indexOf(language));
          |                                    ^
      369 |     expect(charter.indexOf(voice)).toBeLessThan(charter.indexOf(checklist));
      370 |     for (const text of [voice, language, checklist]) {
      371 |       expect(charter.split(text).length).toBe(2);

      at Object.toBeGreaterThan (src/screens/welcome/index.test.tsx:368:36)

  ● #153 R2: la carta escribe la voz de Pingo › fija las reglas de la voz

    expect(received).toContain(expected) // indexOf

    Expected substring: "- **Sin emoji**, en ningún idioma."
    Received string:    "# Carta de UI — mobile-pet-tracker·
    > Fuente de verdad de UI/UX móvil para TODOS los agentes (Claude, subagentes,
    > Codex CLI). Toda spec, implementación y review de trabajo móvil se valida
    > contra este documento. Complementa `docs/conventions.md` §Convenciones de
    > la app móvil; ante conflicto, gana el más específico.·
    ## Skills: quién carga qué·
    Las guías genéricas viven en las skills oficiales de Expo — instaladas en
    Claude Code (plugin `expo`) y en Codex CLI (`codex plugin add
    expo@openai-curated`, mismo contenido v1.12+). Este doc NO las duplica:
    fija las decisiones ya tomadas en ESTE repo.·
    | Tarea móvil | Skill a cargar antes de trabajar |
    |---|---|
    | Cualquiera (routing/entrada) | `expo-overview` → deriva a la específica |
    | Tokens, tema, componentes reusables | `expo-design-system` |
    | Estilo nativo, safe areas, HIG | `expo-native-ui` |
    | Sheets, pickers, menus, toggles | `expo-ui` |
    | Animaciones, gestos, haptics | `expo-animation` (en Claude: `animate-expo`) |
    | Tailwind/uniwind | `expo-tailwind-setup` |
    | Diseñar/mejorar una pantalla o flujo completo | `appllama-app-design-skill` (obligatoria, ver abajo) |·
    Subagentes y handoffs a Codex deben instruir explícitamente la carga de la
    skill pertinente (regla ya en memoria de sesión; aquí queda oficial).·
    ### `appllama-app-design-skill`: cuándo y con qué límites·
    Instalada en `.agents/skills/` (universal: Claude Code y Codex CLI la ven).
    Se carga en **toda** tarea de UI móvil — pantalla nueva, rediseño, flujo,
    onboarding, estados vacíos, jerarquía visual, semántica de navegación
    (push vs replace, sheet vs modal, puertas de un solo sentido). Aporta el
    listón de \"se siente nativa\" y la disciplina anti-slop.·
    Tres límites, no negociables:·
    1. **La carta gana siempre sobre la skill.** La skill asume colores
       semánticos nativos (`Color.ios.label`) y su propio sistema de estilos;
       este repo usa Tailwind v4 + uniwind + heroui-native con tokens en
       `global.css` (§Decisiones fijas 1-3). De la skill se toma el **patrón**
       (esqueleto, jerarquía, motion, navegación), nunca el sistema de estilos.
       Cualquier sugerencia suya que meta hex, `StyleSheet.create` o clases
       arbitrarias se descarta: rompe el grep-clean.
    2. **Su \"simulator loop\" no aplica tal cual.** Pide iOS Simulator en macOS
       (`xcrun simctl io recordVideo`); aquí la verificación es la prueba de
       humo que corre el humano en Android (dev build o Expo Go según la
       feature). El checklist de la skill sirve como guion de esa prueba, no
       como comando a ejecutar.
    3. **`appllama-usage` sí está disponible, pero solo en Claude Code.** El
       MCP `mcp.appllama.io` se contrató el 2026-10-04 (plan Pro: 1500 créditos
       al mes, cada llamada gasta uno, `get_credits` es gratis) y la skill
       `appllama-usage` está instalada en Claude. La fase «estudiar 20-30
       pantallas reales antes de diseñar» la corre el **leader** antes de
       lanzar al `spec_author` y deja el resultado en
       `progress/explore_<tema>.md` con ids durables de app y pantalla (las URL
       de imagen caducan en una hora, así que nunca se enlazan). Del material se
       toma el patrón, no los píxeles; se ignora la marca de agua y no se barre
       el catálogo. **Codex no tiene el MCP** (mismo hueco que B5): el handoff
       le pasa el fichero de explore y la spec, nunca le pide que investigue.
       El primer explore de este tipo es `progress/explore_ui-appllama.md`
       (#115-#119).·
    ## Decisiones fijas de este repo (no re-litigar)·
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
       top fijo. `contentInsetAdjustmentBehavior=\"automatic\"` NO sustituye el
       paddingTop (no-op en Android).
       **Excepción nombrada, enmienda A9 de #67**: si el primer hijo del scroll es
       una **cabecera a sangre**, el `contentContainerStyle` conserva `gap` y
       `paddingBottom`, el padding horizontal de 24 baja a un envoltorio interior,
       y el `paddingTop: insets.top + 12` lo asume la cabecera vía su slot. Las
       ramas de estado sin cabecera llevan su propio envoltorio con ese
       `paddingTop`.·
       **Excepción nombrada (enmienda A11 de #95, 2026-09-23)**: una pantalla empujada
       sobre el Stack raíz con cabecera nativa (`headerShown: true`) —hoy
       `add-reminder`, `pets/add`, `pets/[petId]/docs`, `weight-log`,
       `meal-schedule`, `pairing`, `reminders`, `alerts` (estas dos por la enmienda A13 de #114, 2026-09-23), `alerts/[alertId]` (por la enmienda A15 de #100, 2026-09-28), `pets/[petId]/geofences` (por la enmienda A18 de #41, 2026-10-02) y `pets/[petId]/geofence-editor` (por la enmienda A19 de #146, 2026-10-02) y `meals-history` (por la enmienda A20 de #105, 2026-10-04)— no lleva `paddingTop: insets.top + 12`, porque
       el inset superior lo consume la cabecera, ni `paddingBottom: insets.bottom +
       96`, porque sobre ella no flota el `FloatingTabBar`. Su
       `contentContainerStyle` es `padding: 24`, `gap: 16` y `paddingBottom:
       insets.bottom + 24`, la misma holgura inferior que `(auth)` y
       `reset-password`.
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
    10. **Composición de mapas nativos**: ningún ancestro de una vista nativa de
        mapa puede declarar fondo opaco (`bg-*`). El mapa se compone por detrás de
        la ventana y un fondo encima lo tapa sin producir ningún error. Los estados
        sin mapa declaran su fondo cada uno.
    11. **Desviación declarada del Figma en el acento** (feature #61,
        2026-09-03). `--accent` vale **`#178255`**, no el `#2AB87C` que #46 R1
        tomó del Make. El verde del diseño da 2,55:1 con etiqueta blanca encima y
        no hay forma de pasar AA conservándolo: o se oscurece el relleno o se
        oscurece la letra, y el humano eligió lo primero para que el CTA siga
        siendo verde con letra blanca. Se conserva el hue (154,7°, el mismo del
        Make) y se baja la luminancia hasta **4,82:1** con blanco. Consecuencia
        asumida: los rellenos ya **no** coinciden 1:1 con el Make y el smoke lado
        a lado lo verá; es esperado, no un defecto. El acento como **tinta**
        (texto, enlaces, iconos, trazos) es `--accent-strong`, que en dark
        recupera el `#2AB87C` original porque sobre fondo oscuro un verde oscuro
        es ilegible. Regla mecánica: **fondo ⇒ `--accent`; encima de otra cosa ⇒
        `--accent-strong`.**
    12. **Escala de radios** (feature #62, 2026-09-04). Tres radios, uno por rol,
        y ninguno más:
        - **Superficie de card** → `rounded-card` (token `--radius-card`, 20 px).
          Se obtiene usando `src/components/card.tsx`, no repitiendo la clase.
        - **Control, tile, input, botón y píldora de dato** → `rounded-xl`
          (12 px), que es el mismo valor que `--field-radius: 0.75rem`, de modo
          que botón e input comparten esquina dentro de un formulario.
        - **Cápsula** (chip, avatar, píldora de pestaña, botón circular de
          volver) → `rounded-full`.·
        `rounded-2xl`, `rounded-lg`, `rounded-md` y `rounded-sm` quedan
        **prohibidos en `mobile-pet-tracker/src/`**: no son un cuarto rol, son
        drift. El grep que lo verifica vive en
        `src/__tests__/consistency-classnames.test.ts`.·
        Dos corolarios mecánicos: todo `Skeleton` lleva el radio del contenido
        que sustituye (card ⇒ `rounded-card`, control ⇒ `rounded-xl`), y toda
        esquina no-cápsula **que el repo dibuja por su cuenta** (`View`,
        `Pressable`, `TextInput`, el `Card` compartido) declara
        `style={CONTINUOUS_CORNER}` de `src/theme/native-styles.ts` — los
        componentes de heroui-native ya lo traen de fábrica y no se envuelven
        para añadírselo.·
    ## Animación (decisiones por defecto)·
    - Reanimated 4 en UI thread; nada que dependa de JS thread para gestos.
    - Springs sobre timings para elementos que entran/salen o responden a
      gesto; timings solo para opacidad/color. Duraciones: 150ms feedback,
      250ms transición, 400ms superficies grandes — viven en
      `src/theme/motion.ts` (enmienda A21 de #152).
    - Entering/exiting de Reanimated para cambios de estado visibles
      (aparición de cards, resultados de fetch).
    - Nunca pasar valores `Color`/`PlatformColor`/var CSS a estilos de
      Reanimated — color estático resuelto con `useThemeColors`.
    - Interrumpible siempre: un gesto puede cortar cualquier animación en curso.
    - `prefers-reduced-motion` respetado (Reanimated `ReducedMotionConfig` o
      guard equivalente).
    - expo-haptics está instalado desde #106 (2026-09-21), autorizado por el
      humano en el gate de specs/mobile-meals-bar-motion/. Se usa con la tabla de
      la skill expo-animation §8: selectionAsync para un detent, impactAsync para
      un commit de gesto, notificationAsync(Success|Error) para una operación que
      termina bien o mal. Tres reglas absolutas: mismo frame que el visual, uno
      por acción del usuario, y nunca el único feedback.
    - El runtime de smoke del humano es el dev build de Android desde 2026-08-27;
      `expo-maps` no está disponible en Expo Go.
    - Backlog priorizado con valores exactos: `progress/audit_animations_mobile.md`.·
    ## Micro-reglas de pulido (de expo-native-ui, adoptadas)·
    - `borderCurve: 'continuous'` en toda esquina redondeada no-cápsula.
    - `gap` sobre margin; padding sobre margin.
    - `<Text selectable />` en datos copiables y mensajes de error.
    - Contadores/números alineados: `fontVariant: ['tabular-nums']`.
    - Números grandes formateados (1.4M, 38k).
    - Feedback pressed en TODO elemento tappable (Pressable style function o
      componente heroui que ya lo trae); touch target ≥ 44pt.
    - Títulos de pantalla: header del stack cuando exista, no Text suelto.·
    ## Dirección de arte·
    > Añadida el 2026-09-04 tras `progress/explore_design-gap-vs-make.md`. Hasta
    > aquí esta carta era un sistema de estilos —tokens, radios, componentes— y no
    > decía nada sobre qué debe *parecer* ni qué debe *responder* una pantalla. El
    > brief del producto sí lo dice, y las specs no lo estaban leyendo.·
    **1. Paleta pastel categórica.** El brief pide un producto \"amigable, lúdico,
    con colores pastel\". Cuando una pantalla distingue **categorías** —tipos de
    recordatorio, tipos de documento, destinos de acceso rápido— cada categoría
    lleva su propio fondo pastel, no el mismo `accent-soft` para todas. Esos
    fondos son **tokens de `global.css`**, nunca hex sueltos ni clases arbitrarias:
    la regla de §Decisiones fijas 3 no tiene excepción por ser \"un color de
    adorno\". Los valores del Make son de tema claro y no traen equivalente
    oscuro: el dark se diseña, no se copia, y cada par texto/superficie se
    verifica AA con contraste **calculado**, como fijó #61.·
    Los seis huecos, cerrados (feature #64, 2026-09-04). Toda sección categórica
    consume estos tokens; ninguna inventa un hex ni una clase arbitraria:·
    | Hueco | Superficie | Tinta | Tipos que lo ocupan |
    |---|---|---|---|
    | azul | `bg-category-blue` | `text-category-blue-strong` | recordatorio `vaccine`; documento de vacunación |
    | ámbar | `bg-category-amber` | `text-category-amber-strong` | recordatorio `medication`; documento de desparasitación |
    | verde | `bg-category-green` | `text-category-green-strong` | recordatorio `appointment`; documento de consulta |
    | violeta | `bg-category-violet` | `text-category-violet-strong` | recordatorio `deworming`; documento de análisis |
    | rosa | `bg-category-rose` | `text-category-rose-strong` | recordatorio `food` |
    | neutral | `bg-default` | `text-muted` | recordatorio `weight` y `custom`; cualquier tipo de documento desconocido |·
    El reparto vive en `src/utils/category-palette.ts` y es el **único** sitio donde
    se escriben esos nombres de clase. El color nunca es el único portador de la
    categoría: la superficie siempre acompaña a un emoji y a un texto.·
    **2. Fotografía y su respaldo.** Las cabeceras fotográficas asumen que la
    mascota tiene foto. Cuando no la tiene, el respaldo es el **blobatar**
    determinista de la mascota, que es lo que `pet-avatar` pinta de verdad. Ni
    ilustración por especie ni foto obligatoria en el alta. Y sea cual sea la
    imagen, **el texto que va encima pasa AA**.·
    > **Enmendado por #67 (A8) — corrección de un hecho falso.** Hasta el
    > 2026-09-06 este punto decía *\"el respaldo es degradado con la inicial —el
    > patrón que ya usa `pet-avatar`—, decidido por el humano el 2026-09-04\"*.
    > Era falso de origen: `src/components/pet-avatar.tsx` pinta `blobatar(name)`
    > con `SvgXml` y nunca una inicial, y la R5 aprobada de #40 (2026-08-21)
    > sustituyó explícitamente el fallback de inicial por el blobatar. El error
    > venía de `progress/explore_design-gap-vs-make.md` y se propagó también al
    > enunciado de #67 en `feature_list.json`. Y la garantía de AA no la da el
    > degradado: la da la **banda opaca** bajo el texto (#67 R3), porque ningún
    > velo sobre una foto arbitraria llega a 4,5:1.·
    **3. Las siete preguntas de la Home.** El brief fija qué debe responder la
    pantalla principal: ¿está segura?, ¿dónde está?, ¿el collar está conectado?,
    ¿tiene batería?, ¿tiene algún recordatorio pendiente?, ¿cómo fue su actividad
    hoy?, ¿hay alguna alerta? Toda spec que toque la Home **declara cuáles de las
    siete responde y cuáles no**, y por qué. No es decoración: es el criterio de
    aceptación de la pantalla.·
    **4. Nada de jerga del proveedor.** El brief lo prohíbe explícitamente: los
    términos técnicos de Wialon no se muestran al usuario final. Si un dato solo
    se puede explicar con vocabulario de la integración, se traduce o no se
    enseña.·
    **5. Fidelidad no es pérdida de información.** El diseño oculta datos que la
    app ya sirve (la rejilla del mapa, el perfil nutricional, los avisos de plan)
    y no dibuja estados que existen de verdad, como el 402 de \"sin suscripción\".
    Parecerse al diseño **no** autoriza a borrar un dato útil: la spec que se
    encuentre con uno o lo conserva, o escribe por qué se va.·
    **6. Idioma: catálogo de dos idiomas, español por defecto.** Decidido por el
    humano el 2026-09-04 (español) y el 2026-09-05 (catálogo + interruptor), y
    ejecutado por la feature #65. **Ninguna pantalla escribe texto**: todo lo que
    ve el usuario —títulos, etiquetas, placeholders, `accessibilityLabel`,
    mensajes de error, botones de `Alert`— se resuelve con `t('<ámbito>.<clave>')`
    contra `mobile-pet-tracker/src/i18n/catalog.ts`. Toda spec que introduzca copy
    nueva **añade su clave en los dos idiomas** en el mismo gate y la registra en
    la tabla de `specs/mobile-ui-language/design.md` §2; una clave que exista en un
    idioma y no en el otro no compila. Donde el diseño del Make da la palabra en
    español se usa **la del diseño**. **No hay librería de i18n y no se instala
    una**, ni `expo-localization`: el idioma es elección explícita del usuario en
    Profile, no detección del idioma del teléfono. Las fechas y las horas siguen al
    idioma elegido (`es-MX` / `en-US`), no al locale del sistema.·
    Tres corolarios que nadie debe confundir con lo anterior:·
    - **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
      ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
      los mensajes de commit también (`docs/conventions.md` §Commits).
    - **El backend sigue devolviendo validaciones en inglés, en los dos idiomas.**
      Se ve en `login-error`, `register-*-error`, `weight-form-error` y
      `reset-error`, porque son mensajes de Zod de `backend-pet-tracker/`.
      Traducirlos es una feature de backend. Al revés, las advertencias
      nutricionales del backend ya llegan en español y se muestran tal cual — y en
      inglés también, porque tampoco se traducen.
    - **Los valores de enum que la API devuelve se pintan crudos**: `pet.sex`,
      `document.type`, `foodType`, `activityLevel`. Siguen en inglés en los dos
      idiomas. Mapearlos es cambio de conducta y va a feature propia.
      `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
      resuelve por catálogo en `src/utils/device-connectivity.ts`.·
    ## Checklist de autocrítica (cierra toda pantalla nueva o modificada)·
    Screenshot mental (o real en smoke) contra: jerarquía (lo importante
    primero), proximidad (relacionado más cerca), repetición (esquinas/sombras/
    acentos iguales = tokens), alineación (bordes comparten ejes). Si una
    pantalla falla el mismo check dos veces, el fix va al theme o a un
    componente — no a la pantalla.·
    ## Enmienda #67 — cabecera fotográfica compartida·
    `mobile-pet-hero-header` (#67) modifica una decisión que esta spec dejó
    aprobada. La spec de origen es `specs/mobile-pet-hero-header/`; el detalle de
    la enmienda está en su `requirements.md` §R10.·
    - Spec enmendada: `docs/ui-guidelines.md`
    - Qué cambia: `enmiendas A8 y A9 de la tabla de #67 §R10`
    - Qué NO cambia: ningún otro requisito de esta spec, ni su estado de
      aprobación, ni los tests que ya la cubren.·
    - [X] Enmienda aprobada por humano·
    ## Enmienda #70 — elementos repetidos: qué hay que candar·
    > Añadida el 2026-09-09. Tres features seguidas —#69, #71, #70— cerraron con el
    > mismo patrón: la revisión destapa una dimensión sin vigilar, se cierra, y la
    > siguiente revisión destapa otra por el mismo mecanismo. Cuatro rondas, cuatro
    > dimensiones. Esta lista existe para que la quinta no haga falta.·
    Cuando una pantalla pinta un **elemento repetido** —una celda de una tira, un
    tile de una rejilla, una fila de una lista— la spec enumera **todas** las
    decisiones que ese elemento toma, y el criterio de aceptación es siempre el
    mismo: **cruzar cualquiera de ellas entre dos elementos pone la suite roja**,
    observado con `within(elemento)`.·
    **Decisiones de conducta, una por elemento:**·
    1. el **dato que muestra** — el más olvidado;
    2. componente de icono;
    3. etiqueta visible / clave de copy;
    4. **nombre accesible** — se cruza igual en un elemento solo-icono, donde
       ninguna aserción de texto lo ve;
    5. color o hueco de fondo;
    6. **tinta del icono**;
    7. **color y receta tipográfica de cada texto** — no solo del principal;
    8. destino de navegación;
    9. **condición de render** — mueve la cardinalidad, así que el recuento se
       verifica en más de un escenario;
    10. **forma del contenedor** (`flex-row items-center gap-*`) — y en **todas** sus
        ramas, no solo la cargada: si el estado vacío promete \"la misma anatomía de
        fila\", eso es una aserción, no una frase del título del test;
    11. **envoltorios de agrupación** (`flex-1` y equivalentes) que reparten el
        espacio;
    12. **orden de los hijos**. `within(row).getByTestId(...)` es **agnóstico al
        orden**: intercambiar dos textos deja la suite entera verde. Se cierra
        fijando la posición, p. ej.
        `expect(row.children[1]).toHaveProperty('props.className', 'flex-1')`.·
    **Estructurales, del contenedor:** identidad, orden y cardinalidad. El recuento
    se cierra con `children.length`, **nunca contando coincidencias de `testID`** —
    un recuento por prefijo deja pasar cualquier hijo sin `testID`.·
    **Invariantes compartidos, a inventariar aparte:** tamaño de icono, objetivo
    táctil y reparto, radio, rol y agrupación accesible, sitio de render, y feedback
    de pulsado.·
    > **Inventariar no es candar.** Añadido el 2026-09-09 tras #85: la spec copió
    > esta lista en prosa —incluido \"tamaño de icono\"— y aun así el `size={20}` del
    > icono de fila quedó sin una sola aserción: ponerlo a `28` dejó la suite móvil
    > completa verde. Cada invariante de esta lista necesita **un `expect`**, no una
    > mención. Y ojo con el caso que lo produjo: un `size` renderizado **por
    > variable** no lo ve ningún recuento de literales en el fuente.·
    **Método**: cada candado se demuestra con una sonda —cruzar el valor en
    producción, ver el rojo, restaurar con `git diff` vacío— y la evidencia se
    escribe. Un candado que nadie vio fallar no es un candado.·
    ## Enmienda #98 — la barra de comidas de la Home·
    `mobile-meals-served-ui` (#98) añade a la sección de recordatorios una barra
    informativa de las comidas servidas hoy. Se pinta solo con detalle cargado y
    `mealsToday !== null`, inmediatamente después de la próxima vacuna y antes del
    estado vacío o de las filas de recordatorio.·
    **Decisiones de conducta de la barra:**·
    1. el dato es `mealsToday.served` de `mealsToday.total`;
    2. el icono es `ForkKnife`, con `size={20}`;
    3. el título usa la clave `food.mealsToday`;
    4. el contador usa como nombre accesible la clave
       `food.mealsServedOfTotal`, con `served` y `total`;
    5. el disco del icono ocupa el hueco **rosa** de la paleta categórica:
       `bg-category-rose`, asignado al tipo `food`;
    6. la tinta del icono es `category-rose-strong` resuelta por
       `useThemeColors`;
    7. el título usa `text-sm font-semibold text-foreground` y el contador
       `text-xs font-normal text-muted` con cifras tabulares;
    8. no navega ni lleva `onPress`;
    9. solo se renderiza cuando el detalle es `ok` y `mealsToday !== null`;
    10. el `Card` compone una fila `flex-row items-center gap-3`;
    11. el contenido se agrupa en una columna `flex-1 gap-1.5`, con cabecera y
        carril;
    12. el orden es disco del icono y columna; dentro de la columna, cabecera y
        carril; dentro de la cabecera, título y contador.·
    **Estructura e invariantes:** la fila tiene dos hijos, igual que la columna y
    la cabecera; el carril tiene un único relleno. El disco es una cápsula de
    36 px, el carril usa `h-1.5 overflow-hidden rounded-full bg-default` y el
    relleno usa `h-full rounded-full bg-accent`. Esto último aplica la regla fija
    **fondo ⇒ `bg-accent`**; `bg-accent-strong` sería tinta, no fondo. El ancho se
    calcula como el porcentaje redondeado de `served / total`, o `0%` si el total
    es cero.·
    - [X] Enmienda aprobada por humano··
    ## Enmienda #152 — el movimiento vive en src/theme/motion.ts·
    Enmienda A21: Reanimated consume números y §Animación prohíbe pasarle
    variables CSS. Las duraciones y configuraciones compartidas de movimiento
    viven en `src/theme/motion.ts`.·
    `motion.ts` no es un segundo sistema de estilos en el sentido de
    §Decisiones fijas 1: no contiene colores, espaciados, radios ni clases,
    solo duraciones y configuraciones de Reanimated. Tiene los precedentes
    `native-styles.ts` y `touch-target.ts` en la misma carpeta.·
    Las constantes anteriores a #152 (`MEALS_BAR_TIMING`, `KCAL_BAR_TIMING`,
    `WELCOME_ENTRANCE_MS`, `BAR_ENTRY_*`, `METRIC_TAB_SPRING` y
    `TAB_INDICATOR_SPRING`) migran a `motion.ts` en una feature posterior,
    fuera del alcance de esta.·
    - [X] Enmienda aprobada por humano
    "

      381 |       'con el marcador `{{petName}}`',
      382 |     ]) {
    > 383 |       expect(charter).toContain(text);
          |                       ^
      384 |     }
      385 |   });
      386 |

      at Object.toContain (src/screens/welcome/index.test.tsx:383:23)

  ● #153 R2: la carta escribe la voz de Pingo › declara la excepción de los bucles de reposo

    expect(received).toContain(expected) // indexOf

    Expected substring: "- **Bucles de reposo.**"
    Received string:    "# Carta de UI — mobile-pet-tracker·
    > Fuente de verdad de UI/UX móvil para TODOS los agentes (Claude, subagentes,
    > Codex CLI). Toda spec, implementación y review de trabajo móvil se valida
    > contra este documento. Complementa `docs/conventions.md` §Convenciones de
    > la app móvil; ante conflicto, gana el más específico.·
    ## Skills: quién carga qué·
    Las guías genéricas viven en las skills oficiales de Expo — instaladas en
    Claude Code (plugin `expo`) y en Codex CLI (`codex plugin add
    expo@openai-curated`, mismo contenido v1.12+). Este doc NO las duplica:
    fija las decisiones ya tomadas en ESTE repo.·
    | Tarea móvil | Skill a cargar antes de trabajar |
    |---|---|
    | Cualquiera (routing/entrada) | `expo-overview` → deriva a la específica |
    | Tokens, tema, componentes reusables | `expo-design-system` |
    | Estilo nativo, safe areas, HIG | `expo-native-ui` |
    | Sheets, pickers, menus, toggles | `expo-ui` |
    | Animaciones, gestos, haptics | `expo-animation` (en Claude: `animate-expo`) |
    | Tailwind/uniwind | `expo-tailwind-setup` |
    | Diseñar/mejorar una pantalla o flujo completo | `appllama-app-design-skill` (obligatoria, ver abajo) |·
    Subagentes y handoffs a Codex deben instruir explícitamente la carga de la
    skill pertinente (regla ya en memoria de sesión; aquí queda oficial).·
    ### `appllama-app-design-skill`: cuándo y con qué límites·
    Instalada en `.agents/skills/` (universal: Claude Code y Codex CLI la ven).
    Se carga en **toda** tarea de UI móvil — pantalla nueva, rediseño, flujo,
    onboarding, estados vacíos, jerarquía visual, semántica de navegación
    (push vs replace, sheet vs modal, puertas de un solo sentido). Aporta el
    listón de \"se siente nativa\" y la disciplina anti-slop.·
    Tres límites, no negociables:·
    1. **La carta gana siempre sobre la skill.** La skill asume colores
       semánticos nativos (`Color.ios.label`) y su propio sistema de estilos;
       este repo usa Tailwind v4 + uniwind + heroui-native con tokens en
       `global.css` (§Decisiones fijas 1-3). De la skill se toma el **patrón**
       (esqueleto, jerarquía, motion, navegación), nunca el sistema de estilos.
       Cualquier sugerencia suya que meta hex, `StyleSheet.create` o clases
       arbitrarias se descarta: rompe el grep-clean.
    2. **Su \"simulator loop\" no aplica tal cual.** Pide iOS Simulator en macOS
       (`xcrun simctl io recordVideo`); aquí la verificación es la prueba de
       humo que corre el humano en Android (dev build o Expo Go según la
       feature). El checklist de la skill sirve como guion de esa prueba, no
       como comando a ejecutar.
    3. **`appllama-usage` sí está disponible, pero solo en Claude Code.** El
       MCP `mcp.appllama.io` se contrató el 2026-10-04 (plan Pro: 1500 créditos
       al mes, cada llamada gasta uno, `get_credits` es gratis) y la skill
       `appllama-usage` está instalada en Claude. La fase «estudiar 20-30
       pantallas reales antes de diseñar» la corre el **leader** antes de
       lanzar al `spec_author` y deja el resultado en
       `progress/explore_<tema>.md` con ids durables de app y pantalla (las URL
       de imagen caducan en una hora, así que nunca se enlazan). Del material se
       toma el patrón, no los píxeles; se ignora la marca de agua y no se barre
       el catálogo. **Codex no tiene el MCP** (mismo hueco que B5): el handoff
       le pasa el fichero de explore y la spec, nunca le pide que investigue.
       El primer explore de este tipo es `progress/explore_ui-appllama.md`
       (#115-#119).·
    ## Decisiones fijas de este repo (no re-litigar)·
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
       top fijo. `contentInsetAdjustmentBehavior=\"automatic\"` NO sustituye el
       paddingTop (no-op en Android).
       **Excepción nombrada, enmienda A9 de #67**: si el primer hijo del scroll es
       una **cabecera a sangre**, el `contentContainerStyle` conserva `gap` y
       `paddingBottom`, el padding horizontal de 24 baja a un envoltorio interior,
       y el `paddingTop: insets.top + 12` lo asume la cabecera vía su slot. Las
       ramas de estado sin cabecera llevan su propio envoltorio con ese
       `paddingTop`.·
       **Excepción nombrada (enmienda A11 de #95, 2026-09-23)**: una pantalla empujada
       sobre el Stack raíz con cabecera nativa (`headerShown: true`) —hoy
       `add-reminder`, `pets/add`, `pets/[petId]/docs`, `weight-log`,
       `meal-schedule`, `pairing`, `reminders`, `alerts` (estas dos por la enmienda A13 de #114, 2026-09-23), `alerts/[alertId]` (por la enmienda A15 de #100, 2026-09-28), `pets/[petId]/geofences` (por la enmienda A18 de #41, 2026-10-02) y `pets/[petId]/geofence-editor` (por la enmienda A19 de #146, 2026-10-02) y `meals-history` (por la enmienda A20 de #105, 2026-10-04)— no lleva `paddingTop: insets.top + 12`, porque
       el inset superior lo consume la cabecera, ni `paddingBottom: insets.bottom +
       96`, porque sobre ella no flota el `FloatingTabBar`. Su
       `contentContainerStyle` es `padding: 24`, `gap: 16` y `paddingBottom:
       insets.bottom + 24`, la misma holgura inferior que `(auth)` y
       `reset-password`.
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
    10. **Composición de mapas nativos**: ningún ancestro de una vista nativa de
        mapa puede declarar fondo opaco (`bg-*`). El mapa se compone por detrás de
        la ventana y un fondo encima lo tapa sin producir ningún error. Los estados
        sin mapa declaran su fondo cada uno.
    11. **Desviación declarada del Figma en el acento** (feature #61,
        2026-09-03). `--accent` vale **`#178255`**, no el `#2AB87C` que #46 R1
        tomó del Make. El verde del diseño da 2,55:1 con etiqueta blanca encima y
        no hay forma de pasar AA conservándolo: o se oscurece el relleno o se
        oscurece la letra, y el humano eligió lo primero para que el CTA siga
        siendo verde con letra blanca. Se conserva el hue (154,7°, el mismo del
        Make) y se baja la luminancia hasta **4,82:1** con blanco. Consecuencia
        asumida: los rellenos ya **no** coinciden 1:1 con el Make y el smoke lado
        a lado lo verá; es esperado, no un defecto. El acento como **tinta**
        (texto, enlaces, iconos, trazos) es `--accent-strong`, que en dark
        recupera el `#2AB87C` original porque sobre fondo oscuro un verde oscuro
        es ilegible. Regla mecánica: **fondo ⇒ `--accent`; encima de otra cosa ⇒
        `--accent-strong`.**
    12. **Escala de radios** (feature #62, 2026-09-04). Tres radios, uno por rol,
        y ninguno más:
        - **Superficie de card** → `rounded-card` (token `--radius-card`, 20 px).
          Se obtiene usando `src/components/card.tsx`, no repitiendo la clase.
        - **Control, tile, input, botón y píldora de dato** → `rounded-xl`
          (12 px), que es el mismo valor que `--field-radius: 0.75rem`, de modo
          que botón e input comparten esquina dentro de un formulario.
        - **Cápsula** (chip, avatar, píldora de pestaña, botón circular de
          volver) → `rounded-full`.·
        `rounded-2xl`, `rounded-lg`, `rounded-md` y `rounded-sm` quedan
        **prohibidos en `mobile-pet-tracker/src/`**: no son un cuarto rol, son
        drift. El grep que lo verifica vive en
        `src/__tests__/consistency-classnames.test.ts`.·
        Dos corolarios mecánicos: todo `Skeleton` lleva el radio del contenido
        que sustituye (card ⇒ `rounded-card`, control ⇒ `rounded-xl`), y toda
        esquina no-cápsula **que el repo dibuja por su cuenta** (`View`,
        `Pressable`, `TextInput`, el `Card` compartido) declara
        `style={CONTINUOUS_CORNER}` de `src/theme/native-styles.ts` — los
        componentes de heroui-native ya lo traen de fábrica y no se envuelven
        para añadírselo.·
    ## Animación (decisiones por defecto)·
    - Reanimated 4 en UI thread; nada que dependa de JS thread para gestos.
    - Springs sobre timings para elementos que entran/salen o responden a
      gesto; timings solo para opacidad/color. Duraciones: 150ms feedback,
      250ms transición, 400ms superficies grandes — viven en
      `src/theme/motion.ts` (enmienda A21 de #152).
    - Entering/exiting de Reanimated para cambios de estado visibles
      (aparición de cards, resultados de fetch).
    - Nunca pasar valores `Color`/`PlatformColor`/var CSS a estilos de
      Reanimated — color estático resuelto con `useThemeColors`.
    - Interrumpible siempre: un gesto puede cortar cualquier animación en curso.
    - `prefers-reduced-motion` respetado (Reanimated `ReducedMotionConfig` o
      guard equivalente).
    - expo-haptics está instalado desde #106 (2026-09-21), autorizado por el
      humano en el gate de specs/mobile-meals-bar-motion/. Se usa con la tabla de
      la skill expo-animation §8: selectionAsync para un detent, impactAsync para
      un commit de gesto, notificationAsync(Success|Error) para una operación que
      termina bien o mal. Tres reglas absolutas: mismo frame que el visual, uno
      por acción del usuario, y nunca el único feedback.
    - El runtime de smoke del humano es el dev build de Android desde 2026-08-27;
      `expo-maps` no está disponible en Expo Go.
    - Backlog priorizado con valores exactos: `progress/audit_animations_mobile.md`.·
    ## Micro-reglas de pulido (de expo-native-ui, adoptadas)·
    - `borderCurve: 'continuous'` en toda esquina redondeada no-cápsula.
    - `gap` sobre margin; padding sobre margin.
    - `<Text selectable />` en datos copiables y mensajes de error.
    - Contadores/números alineados: `fontVariant: ['tabular-nums']`.
    - Números grandes formateados (1.4M, 38k).
    - Feedback pressed en TODO elemento tappable (Pressable style function o
      componente heroui que ya lo trae); touch target ≥ 44pt.
    - Títulos de pantalla: header del stack cuando exista, no Text suelto.·
    ## Dirección de arte·
    > Añadida el 2026-09-04 tras `progress/explore_design-gap-vs-make.md`. Hasta
    > aquí esta carta era un sistema de estilos —tokens, radios, componentes— y no
    > decía nada sobre qué debe *parecer* ni qué debe *responder* una pantalla. El
    > brief del producto sí lo dice, y las specs no lo estaban leyendo.·
    **1. Paleta pastel categórica.** El brief pide un producto \"amigable, lúdico,
    con colores pastel\". Cuando una pantalla distingue **categorías** —tipos de
    recordatorio, tipos de documento, destinos de acceso rápido— cada categoría
    lleva su propio fondo pastel, no el mismo `accent-soft` para todas. Esos
    fondos son **tokens de `global.css`**, nunca hex sueltos ni clases arbitrarias:
    la regla de §Decisiones fijas 3 no tiene excepción por ser \"un color de
    adorno\". Los valores del Make son de tema claro y no traen equivalente
    oscuro: el dark se diseña, no se copia, y cada par texto/superficie se
    verifica AA con contraste **calculado**, como fijó #61.·
    Los seis huecos, cerrados (feature #64, 2026-09-04). Toda sección categórica
    consume estos tokens; ninguna inventa un hex ni una clase arbitraria:·
    | Hueco | Superficie | Tinta | Tipos que lo ocupan |
    |---|---|---|---|
    | azul | `bg-category-blue` | `text-category-blue-strong` | recordatorio `vaccine`; documento de vacunación |
    | ámbar | `bg-category-amber` | `text-category-amber-strong` | recordatorio `medication`; documento de desparasitación |
    | verde | `bg-category-green` | `text-category-green-strong` | recordatorio `appointment`; documento de consulta |
    | violeta | `bg-category-violet` | `text-category-violet-strong` | recordatorio `deworming`; documento de análisis |
    | rosa | `bg-category-rose` | `text-category-rose-strong` | recordatorio `food` |
    | neutral | `bg-default` | `text-muted` | recordatorio `weight` y `custom`; cualquier tipo de documento desconocido |·
    El reparto vive en `src/utils/category-palette.ts` y es el **único** sitio donde
    se escriben esos nombres de clase. El color nunca es el único portador de la
    categoría: la superficie siempre acompaña a un emoji y a un texto.·
    **2. Fotografía y su respaldo.** Las cabeceras fotográficas asumen que la
    mascota tiene foto. Cuando no la tiene, el respaldo es el **blobatar**
    determinista de la mascota, que es lo que `pet-avatar` pinta de verdad. Ni
    ilustración por especie ni foto obligatoria en el alta. Y sea cual sea la
    imagen, **el texto que va encima pasa AA**.·
    > **Enmendado por #67 (A8) — corrección de un hecho falso.** Hasta el
    > 2026-09-06 este punto decía *\"el respaldo es degradado con la inicial —el
    > patrón que ya usa `pet-avatar`—, decidido por el humano el 2026-09-04\"*.
    > Era falso de origen: `src/components/pet-avatar.tsx` pinta `blobatar(name)`
    > con `SvgXml` y nunca una inicial, y la R5 aprobada de #40 (2026-08-21)
    > sustituyó explícitamente el fallback de inicial por el blobatar. El error
    > venía de `progress/explore_design-gap-vs-make.md` y se propagó también al
    > enunciado de #67 en `feature_list.json`. Y la garantía de AA no la da el
    > degradado: la da la **banda opaca** bajo el texto (#67 R3), porque ningún
    > velo sobre una foto arbitraria llega a 4,5:1.·
    **3. Las siete preguntas de la Home.** El brief fija qué debe responder la
    pantalla principal: ¿está segura?, ¿dónde está?, ¿el collar está conectado?,
    ¿tiene batería?, ¿tiene algún recordatorio pendiente?, ¿cómo fue su actividad
    hoy?, ¿hay alguna alerta? Toda spec que toque la Home **declara cuáles de las
    siete responde y cuáles no**, y por qué. No es decoración: es el criterio de
    aceptación de la pantalla.·
    **4. Nada de jerga del proveedor.** El brief lo prohíbe explícitamente: los
    términos técnicos de Wialon no se muestran al usuario final. Si un dato solo
    se puede explicar con vocabulario de la integración, se traduce o no se
    enseña.·
    **5. Fidelidad no es pérdida de información.** El diseño oculta datos que la
    app ya sirve (la rejilla del mapa, el perfil nutricional, los avisos de plan)
    y no dibuja estados que existen de verdad, como el 402 de \"sin suscripción\".
    Parecerse al diseño **no** autoriza a borrar un dato útil: la spec que se
    encuentre con uno o lo conserva, o escribe por qué se va.·
    **6. Idioma: catálogo de dos idiomas, español por defecto.** Decidido por el
    humano el 2026-09-04 (español) y el 2026-09-05 (catálogo + interruptor), y
    ejecutado por la feature #65. **Ninguna pantalla escribe texto**: todo lo que
    ve el usuario —títulos, etiquetas, placeholders, `accessibilityLabel`,
    mensajes de error, botones de `Alert`— se resuelve con `t('<ámbito>.<clave>')`
    contra `mobile-pet-tracker/src/i18n/catalog.ts`. Toda spec que introduzca copy
    nueva **añade su clave en los dos idiomas** en el mismo gate y la registra en
    la tabla de `specs/mobile-ui-language/design.md` §2; una clave que exista en un
    idioma y no en el otro no compila. Donde el diseño del Make da la palabra en
    español se usa **la del diseño**. **No hay librería de i18n y no se instala
    una**, ni `expo-localization`: el idioma es elección explícita del usuario en
    Profile, no detección del idioma del teléfono. Las fechas y las horas siguen al
    idioma elegido (`es-MX` / `en-US`), no al locale del sistema.·
    Tres corolarios que nadie debe confundir con lo anterior:·
    - **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
      ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
      los mensajes de commit también (`docs/conventions.md` §Commits).
    - **El backend sigue devolviendo validaciones en inglés, en los dos idiomas.**
      Se ve en `login-error`, `register-*-error`, `weight-form-error` y
      `reset-error`, porque son mensajes de Zod de `backend-pet-tracker/`.
      Traducirlos es una feature de backend. Al revés, las advertencias
      nutricionales del backend ya llegan en español y se muestran tal cual — y en
      inglés también, porque tampoco se traducen.
    - **Los valores de enum que la API devuelve se pintan crudos**: `pet.sex`,
      `document.type`, `foodType`, `activityLevel`. Siguen en inglés en los dos
      idiomas. Mapearlos es cambio de conducta y va a feature propia.
      `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
      resuelve por catálogo en `src/utils/device-connectivity.ts`.·
    ## Checklist de autocrítica (cierra toda pantalla nueva o modificada)·
    Screenshot mental (o real en smoke) contra: jerarquía (lo importante
    primero), proximidad (relacionado más cerca), repetición (esquinas/sombras/
    acentos iguales = tokens), alineación (bordes comparten ejes). Si una
    pantalla falla el mismo check dos veces, el fix va al theme o a un
    componente — no a la pantalla.·
    ## Enmienda #67 — cabecera fotográfica compartida·
    `mobile-pet-hero-header` (#67) modifica una decisión que esta spec dejó
    aprobada. La spec de origen es `specs/mobile-pet-hero-header/`; el detalle de
    la enmienda está en su `requirements.md` §R10.·
    - Spec enmendada: `docs/ui-guidelines.md`
    - Qué cambia: `enmiendas A8 y A9 de la tabla de #67 §R10`
    - Qué NO cambia: ningún otro requisito de esta spec, ni su estado de
      aprobación, ni los tests que ya la cubren.·
    - [X] Enmienda aprobada por humano·
    ## Enmienda #70 — elementos repetidos: qué hay que candar·
    > Añadida el 2026-09-09. Tres features seguidas —#69, #71, #70— cerraron con el
    > mismo patrón: la revisión destapa una dimensión sin vigilar, se cierra, y la
    > siguiente revisión destapa otra por el mismo mecanismo. Cuatro rondas, cuatro
    > dimensiones. Esta lista existe para que la quinta no haga falta.·
    Cuando una pantalla pinta un **elemento repetido** —una celda de una tira, un
    tile de una rejilla, una fila de una lista— la spec enumera **todas** las
    decisiones que ese elemento toma, y el criterio de aceptación es siempre el
    mismo: **cruzar cualquiera de ellas entre dos elementos pone la suite roja**,
    observado con `within(elemento)`.·
    **Decisiones de conducta, una por elemento:**·
    1. el **dato que muestra** — el más olvidado;
    2. componente de icono;
    3. etiqueta visible / clave de copy;
    4. **nombre accesible** — se cruza igual en un elemento solo-icono, donde
       ninguna aserción de texto lo ve;
    5. color o hueco de fondo;
    6. **tinta del icono**;
    7. **color y receta tipográfica de cada texto** — no solo del principal;
    8. destino de navegación;
    9. **condición de render** — mueve la cardinalidad, así que el recuento se
       verifica en más de un escenario;
    10. **forma del contenedor** (`flex-row items-center gap-*`) — y en **todas** sus
        ramas, no solo la cargada: si el estado vacío promete \"la misma anatomía de
        fila\", eso es una aserción, no una frase del título del test;
    11. **envoltorios de agrupación** (`flex-1` y equivalentes) que reparten el
        espacio;
    12. **orden de los hijos**. `within(row).getByTestId(...)` es **agnóstico al
        orden**: intercambiar dos textos deja la suite entera verde. Se cierra
        fijando la posición, p. ej.
        `expect(row.children[1]).toHaveProperty('props.className', 'flex-1')`.·
    **Estructurales, del contenedor:** identidad, orden y cardinalidad. El recuento
    se cierra con `children.length`, **nunca contando coincidencias de `testID`** —
    un recuento por prefijo deja pasar cualquier hijo sin `testID`.·
    **Invariantes compartidos, a inventariar aparte:** tamaño de icono, objetivo
    táctil y reparto, radio, rol y agrupación accesible, sitio de render, y feedback
    de pulsado.·
    > **Inventariar no es candar.** Añadido el 2026-09-09 tras #85: la spec copió
    > esta lista en prosa —incluido \"tamaño de icono\"— y aun así el `size={20}` del
    > icono de fila quedó sin una sola aserción: ponerlo a `28` dejó la suite móvil
    > completa verde. Cada invariante de esta lista necesita **un `expect`**, no una
    > mención. Y ojo con el caso que lo produjo: un `size` renderizado **por
    > variable** no lo ve ningún recuento de literales en el fuente.·
    **Método**: cada candado se demuestra con una sonda —cruzar el valor en
    producción, ver el rojo, restaurar con `git diff` vacío— y la evidencia se
    escribe. Un candado que nadie vio fallar no es un candado.·
    ## Enmienda #98 — la barra de comidas de la Home·
    `mobile-meals-served-ui` (#98) añade a la sección de recordatorios una barra
    informativa de las comidas servidas hoy. Se pinta solo con detalle cargado y
    `mealsToday !== null`, inmediatamente después de la próxima vacuna y antes del
    estado vacío o de las filas de recordatorio.·
    **Decisiones de conducta de la barra:**·
    1. el dato es `mealsToday.served` de `mealsToday.total`;
    2. el icono es `ForkKnife`, con `size={20}`;
    3. el título usa la clave `food.mealsToday`;
    4. el contador usa como nombre accesible la clave
       `food.mealsServedOfTotal`, con `served` y `total`;
    5. el disco del icono ocupa el hueco **rosa** de la paleta categórica:
       `bg-category-rose`, asignado al tipo `food`;
    6. la tinta del icono es `category-rose-strong` resuelta por
       `useThemeColors`;
    7. el título usa `text-sm font-semibold text-foreground` y el contador
       `text-xs font-normal text-muted` con cifras tabulares;
    8. no navega ni lleva `onPress`;
    9. solo se renderiza cuando el detalle es `ok` y `mealsToday !== null`;
    10. el `Card` compone una fila `flex-row items-center gap-3`;
    11. el contenido se agrupa en una columna `flex-1 gap-1.5`, con cabecera y
        carril;
    12. el orden es disco del icono y columna; dentro de la columna, cabecera y
        carril; dentro de la cabecera, título y contador.·
    **Estructura e invariantes:** la fila tiene dos hijos, igual que la columna y
    la cabecera; el carril tiene un único relleno. El disco es una cápsula de
    36 px, el carril usa `h-1.5 overflow-hidden rounded-full bg-default` y el
    relleno usa `h-full rounded-full bg-accent`. Esto último aplica la regla fija
    **fondo ⇒ `bg-accent`**; `bg-accent-strong` sería tinta, no fondo. El ancho se
    calcula como el porcentaje redondeado de `served / total`, o `0%` si el total
    es cero.·
    - [X] Enmienda aprobada por humano··
    ## Enmienda #152 — el movimiento vive en src/theme/motion.ts·
    Enmienda A21: Reanimated consume números y §Animación prohíbe pasarle
    variables CSS. Las duraciones y configuraciones compartidas de movimiento
    viven en `src/theme/motion.ts`.·
    `motion.ts` no es un segundo sistema de estilos en el sentido de
    §Decisiones fijas 1: no contiene colores, espaciados, radios ni clases,
    solo duraciones y configuraciones de Reanimated. Tiene los precedentes
    `native-styles.ts` y `touch-target.ts` en la misma carpeta.·
    Las constantes anteriores a #152 (`MEALS_BAR_TIMING`, `KCAL_BAR_TIMING`,
    `WELCOME_ENTRANCE_MS`, `BAR_ENTRY_*`, `METRIC_TAB_SPRING` y
    `TAB_INDICATOR_SPRING`) migran a `motion.ts` en una feature posterior,
    fuera del alcance de esta.·
    - [X] Enmienda aprobada por humano
    "

      386 |
      387 |   it('declara la excepción de los bucles de reposo', () => {
    > 388 |     expect(charter).toContain('- **Bucles de reposo.**');
          |                     ^
      389 |     expect(charter).toContain('`src/theme/motion.ts` y no arrancan con reduce motion.');
      390 |   });
      391 | });

      at Object.toContain (src/screens/welcome/index.test.tsx:388:21)

```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +3 failed, 28 passed, 31 total$' /tmp/153-r1.txt \
&& ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r1.txt \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.test.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
&& git commit -m 'test(mobile-welcome): #153 R2 red pingo voice in the charter'
```

```text
[feature/153-mobile-welcome-pingo a9064d8a] test(mobile-welcome): #153 R2 red pingo voice in the charter
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 32 insertions(+)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `a9064d8a test(mobile-welcome): #153 R2 red pingo voice in the charter`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T1 verde

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g1.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       31 passed, 31 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/ui-language.test.ts 'src/app/\(tabs\)/__tests__/food.test.tsx' src/__tests__/hero-header-amendments.test.ts > /tmp/153-g1-carta.txt 2>&1; echo "exit=$?"
Test Suites: 6 passed, 6 total
Tests:       216 passed, 216 total
exit=0
```

Detalle de cada it rojo (matcher y Expected/Received, consulta o ENOENT):

```text
  ● Console

    console.warn
      Uniwind - We couldn't find your variable --color-accent. Make sure it's used at least once in your className, or define it in a static theme as described in the docs: https://docs.uniwind.dev/api/use-css-variable

      at Function.warn (node_modules/uniwind/src/core/logger.ts:11:17)
      at warn (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:20:12)
      at logDevError (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:33:17)
          at Array.forEach (<anonymous>)
      at forEach (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:31:15)
      at getCSSVariable (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:62:46)
      at mountStateImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:5941:24)
      at mountState (node_modules/react-reconciler/cjs/react-reconciler.development.js:5962:22)
      at Object.useState (node_modules/react-reconciler/cjs/react-reconciler.development.js:17940:18)
      at Object.<anonymous>.process.env.NODE_ENV.exports.useState (node_modules/react/cjs/react.development.js:1263:34)
      at useCSSVariable (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:62:39)
      at useThemeColor (node_modules/heroui-native/src/helpers/external/hooks/use-theme-color.ts:146:40)
      at HeroUINative.Spinner.Indicator (node_modules/heroui-native/src/components/spinner/spinner.tsx:124:22)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17596:20)
      at renderWithHooks (node_modules/react-reconciler/cjs/react-reconciler.development.js:5335:22)
      at updateForwardRef (node_modules/react-reconciler/cjs/react-reconciler.development.js:7278:19)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9602:18)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      An update to FoodScreen inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "0%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "invalid" is not a valid color or "100%" is not a valid offset

      at warn (node_modules/react-native-svg/src/lib/extract/extractGradient.ts:78:15)
      at LinearGradient.render (node_modules/react-native-svg/src/elements/LinearGradient.tsx:40:28)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)


```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +31 passed, 31 total$' /tmp/153-g1.txt \
&& grep -qE '^Tests: +216 passed, 216 total$' /tmp/153-g1-carta.txt \
&& test "$(grep -cF '**7. Voz de Pingo: guardián sereno.**' ../docs/ui-guidelines.md)" = 1 \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add ../docs/ui-guidelines.md \
&& test "$(git diff --cached --name-only)" = 'docs/ui-guidelines.md' \
&& git commit -m 'feat(mobile-welcome): #153 R2 pingo voice in the charter'
```

```text
[feature/153-mobile-welcome-pingo 6f0e54f8] feat(mobile-welcome): #153 R2 pingo voice in the charter
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 21 insertions(+)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `6f0e54f8 feat(mobile-welcome): #153 R2 pingo voice in the charter`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T2 rojo

```text
$ FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts > /tmp/153-r2.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       4 failed, 8 passed, 12 total
exit=1
```

Detalle de cada it rojo (matcher y Expected/Received, consulta o ENOENT):

```text
  ● #152 R1: las duraciones y el preset de movimiento viven en un solo sitio › no exporta nada más

    expect(received).toEqual(expected) // deep equality

    - Expected  - 5
    + Received  + 0

      Array [
    -   "MOTION_BLINK_INTERVAL_MS",
    -   "MOTION_BLINK_TIMING",
        "MOTION_ENTRANCE_OFFSET_Y",
    -   "MOTION_ENTRANCE_SCALE",
        "MOTION_FADE_TIMING",
        "MOTION_FEEDBACK_MS",
        "MOTION_FILL_TIMING",
    -   "MOTION_FLOAT_OFFSET_Y",
    -   "MOTION_FLOAT_TIMING",
        "MOTION_SETTLE_SPRING",
        "MOTION_STAGGER_MS",
        "MOTION_SURFACE_MS",
        "MOTION_TRANSITION_MS",
      ]

      68 |
      69 |   it('no exporta nada más', () => {
    > 70 |     expect(Object.keys(require('../motion')).sort()).toEqual([
         |                                                      ^
      71 |       'MOTION_BLINK_INTERVAL_MS',
      72 |       'MOTION_BLINK_TIMING',
      73 |       'MOTION_ENTRANCE_OFFSET_Y',

      at Object.toEqual (src/theme/__tests__/motion.test.ts:70:54)

  ● #153 R4: las constantes de Pingo viven en motion.ts › declara la escala de entrada y el recorrido de la flotación

    expect(received).toBe(expected) // Object.is equality

    Expected: 0.9
    Received: undefined

      117 | describe('#153 R4: las constantes de Pingo viven en motion.ts', () => {
      118 |   it('declara la escala de entrada y el recorrido de la flotación', () => {
    > 119 |     expect(MOTION_ENTRANCE_SCALE).toBe(0.9);
          |                                   ^
      120 |     expect(MOTION_FLOAT_OFFSET_Y).toBe(4);
      121 |   });
      122 |

      at Object.toBe (src/theme/__tests__/motion.test.ts:119:35)

  ● #153 R4: las constantes de Pingo viven en motion.ts › declara medio ciclo de flotación ease-in-out

    expect(received).toEqual(expected) // deep equality

    Expected: {"duration": 1200, "easing": {"bezier": [0.37, 0, 0.63, 1]}, "reduceMotion": "system"}
    Received: undefined

      122 |
      123 |   it('declara medio ciclo de flotación ease-in-out', () => {
    > 124 |     expect(MOTION_FLOAT_TIMING).toEqual({
          |                                 ^
      125 |       duration: 1200,
      126 |       easing: { bezier: [0.37, 0, 0.63, 1] },
      127 |       reduceMotion: ReduceMotion.System,

      at Object.toEqual (src/theme/__tests__/motion.test.ts:124:33)

  ● #153 R4: las constantes de Pingo viven en motion.ts › declara el intervalo y el cambio instantáneo del parpadeo

    expect(received).toBe(expected) // Object.is equality

    Expected: 4000
    Received: undefined

      130 |
      131 |   it('declara el intervalo y el cambio instantáneo del parpadeo', () => {
    > 132 |     expect(MOTION_BLINK_INTERVAL_MS).toBe(4000);
          |                                      ^
      133 |     expect(MOTION_BLINK_TIMING).toEqual({ duration: 0, reduceMotion: ReduceMotion.System });
      134 |   });
      135 | });

      at Object.toBe (src/theme/__tests__/motion.test.ts:132:38)

```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +4 failed, 8 passed, 12 total$' /tmp/153-r2.txt \
&& ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r2.txt \
&& test ! -e .expo/types/router.d.ts \
&& { bun run typecheck > /tmp/153-r2-tsc.txt 2>&1 || true; } \
&& test "$(grep -c 'error TS' /tmp/153-r2-tsc.txt)" = "$(grep -cE '^src/theme/__tests__/motion\.test\.ts\([0-9]+,[0-9]+\): error TS2305:' /tmp/153-r2-tsc.txt)" \
&& bun run lint \
&& git add src/theme/__tests__/motion.test.ts \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/theme/__tests__/motion.test.ts' \
&& git commit -m 'test(mobile-welcome): #153 R4 red pingo motion constants'
```

```text
cadena exit=1
```

Typecheck rojo: salida del comando del handoff (su exit individual queda enmascarado por `|| true`; errores comprobados por la cadena):

```text
$ tsc --noEmit
src/theme/__tests__/motion.test.ts(11,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_ENTRANCE_SCALE'.
src/theme/__tests__/motion.test.ts(12,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_FLOAT_OFFSET_Y'.
src/theme/__tests__/motion.test.ts(13,3): error TS2724: '"../motion"' has no exported member named 'MOTION_FLOAT_TIMING'. Did you mean 'MOTION_FADE_TIMING'?
src/theme/__tests__/motion.test.ts(14,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_BLINK_INTERVAL_MS'.
src/theme/__tests__/motion.test.ts(15,3): error TS2724: '"../motion"' has no exported member named 'MOTION_BLINK_TIMING'. Did you mean 'MOTION_FILL_TIMING'?

```

PARADA: la cadena anterior falló; no se continúa.

## PARADA obligatoria — T2 rojo

El eslabón que falló fue:

```bash
test "$(grep -c 'error TS' /tmp/153-r2-tsc.txt)" = "$(grep -cE '^src/theme/__tests__/motion\.test\.ts\([0-9]+,[0-9]+\): error TS2305:' /tmp/153-r2-tsc.txt)"
```

Salida de los contadores: todos los `error TS` = 5; TS2305 admitidos = 3.
El `test` da exit=1. La cadena completa da exit=1 y no alcanza lint,
`git add` ni `git commit`. Los dos errores restantes son TS2724:
`MOTION_FLOAT_TIMING` sugiere `MOTION_FADE_TIMING` y `MOTION_BLINK_TIMING`
sugiere `MOTION_FILL_TIMING`. El log completo de TypeScript está copiado arriba.

No se modifica la cadena ni se escribe el verde de T2. No hay commit de T2.
Quedan los dos commits de T1, en orden:
- `a9064d8a test(mobile-welcome): #153 R2 red pingo voice in the charter`
- `6f0e54f8 feat(mobile-welcome): #153 R2 pingo voice in the charter`

Pendiente de resolución del leader/humano: el handoff permite únicamente
TS2305 para T2, pero el compilador instalado emite también TS2724 con los
imports nombrados prescritos. Se necesita corregir ese contrato antes de
continuar. No se han ejecutado T2 verde ni T3-T13 ni el cierre, y la
trazabilidad permanece intacta.

Estado al parar:

```text
$ grep -c 'error TS' /tmp/153-r2-tsc.txt
5
exit=0
$ grep -cE '^src/theme/__tests__/motion\.test\.ts\([0-9]+,[0-9]+\): error TS2305:' /tmp/153-r2-tsc.txt
3
exit=0
$ git status --short
 M mobile-pet-tracker/src/theme/__tests__/motion.test.ts
?? progress/impl_mobile-welcome-pingo.md
exit=0
$ git log -2 --format='%h %s'
6f0e54f8 feat(mobile-welcome): #153 R2 pingo voice in the charter
a9064d8a test(mobile-welcome): #153 R2 red pingo voice in the charter
exit=0
$ git diff --name-only c03ddc09 HEAD
docs/ui-guidelines.md
mobile-pet-tracker/src/screens/welcome/index.test.tsx
exit=0
$ git diff --stat c03ddc09 -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/app.json
exit=0
```

R14: pendiente del smoke humano

## Reanudación — resolución de la parada de T2

El leader corrigió el contrato en `1f18d037`. El humano autoriza repetir
el rojo íntegro con la cadena nueva: exactamente cinco errores TS2305 o TS2724,
todos de motion.test.ts. No se modifica el test que quedó pendiente.
H0 sigue siendo `c03ddc09`; la corrección no cambia la base de los diffs.
Skills y decisiones cargadas en T0 siguen vigentes.

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-153
$ git branch --show-current
feature/153-mobile-welcome-pingo
$ git log -1 --format=%h
1f18d037
$ git status --short
 M mobile-pet-tracker/src/theme/__tests__/motion.test.ts
?? progress/impl_mobile-welcome-pingo.md
$ git show --stat --oneline 1f18d037
1f18d037 chore(harness): #153 handoff admite TS2724 en el rojo de T2
 progress/handoff_mobile-welcome-pingo.md | 10 +++++++---
 1 file changed, 7 insertions(+), 3 deletions(-)
```

## T2 rojo

```text
$ FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts > /tmp/153-r2.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       4 failed, 8 passed, 12 total
exit=1
```

Detalle de cada it rojo (matcher y Expected/Received, consulta o ENOENT):

```text
  ● #152 R1: las duraciones y el preset de movimiento viven en un solo sitio › no exporta nada más

    expect(received).toEqual(expected) // deep equality

    - Expected  - 5
    + Received  + 0

      Array [
    -   "MOTION_BLINK_INTERVAL_MS",
    -   "MOTION_BLINK_TIMING",
        "MOTION_ENTRANCE_OFFSET_Y",
    -   "MOTION_ENTRANCE_SCALE",
        "MOTION_FADE_TIMING",
        "MOTION_FEEDBACK_MS",
        "MOTION_FILL_TIMING",
    -   "MOTION_FLOAT_OFFSET_Y",
    -   "MOTION_FLOAT_TIMING",
        "MOTION_SETTLE_SPRING",
        "MOTION_STAGGER_MS",
        "MOTION_SURFACE_MS",
        "MOTION_TRANSITION_MS",
      ]

      68 |
      69 |   it('no exporta nada más', () => {
    > 70 |     expect(Object.keys(require('../motion')).sort()).toEqual([
         |                                                      ^
      71 |       'MOTION_BLINK_INTERVAL_MS',
      72 |       'MOTION_BLINK_TIMING',
      73 |       'MOTION_ENTRANCE_OFFSET_Y',

      at Object.toEqual (src/theme/__tests__/motion.test.ts:70:54)

  ● #153 R4: las constantes de Pingo viven en motion.ts › declara la escala de entrada y el recorrido de la flotación

    expect(received).toBe(expected) // Object.is equality

    Expected: 0.9
    Received: undefined

      117 | describe('#153 R4: las constantes de Pingo viven en motion.ts', () => {
      118 |   it('declara la escala de entrada y el recorrido de la flotación', () => {
    > 119 |     expect(MOTION_ENTRANCE_SCALE).toBe(0.9);
          |                                   ^
      120 |     expect(MOTION_FLOAT_OFFSET_Y).toBe(4);
      121 |   });
      122 |

      at Object.toBe (src/theme/__tests__/motion.test.ts:119:35)

  ● #153 R4: las constantes de Pingo viven en motion.ts › declara medio ciclo de flotación ease-in-out

    expect(received).toEqual(expected) // deep equality

    Expected: {"duration": 1200, "easing": {"bezier": [0.37, 0, 0.63, 1]}, "reduceMotion": "system"}
    Received: undefined

      122 |
      123 |   it('declara medio ciclo de flotación ease-in-out', () => {
    > 124 |     expect(MOTION_FLOAT_TIMING).toEqual({
          |                                 ^
      125 |       duration: 1200,
      126 |       easing: { bezier: [0.37, 0, 0.63, 1] },
      127 |       reduceMotion: ReduceMotion.System,

      at Object.toEqual (src/theme/__tests__/motion.test.ts:124:33)

  ● #153 R4: las constantes de Pingo viven en motion.ts › declara el intervalo y el cambio instantáneo del parpadeo

    expect(received).toBe(expected) // Object.is equality

    Expected: 4000
    Received: undefined

      130 |
      131 |   it('declara el intervalo y el cambio instantáneo del parpadeo', () => {
    > 132 |     expect(MOTION_BLINK_INTERVAL_MS).toBe(4000);
          |                                      ^
      133 |     expect(MOTION_BLINK_TIMING).toEqual({ duration: 0, reduceMotion: ReduceMotion.System });
      134 |   });
      135 | });

      at Object.toBe (src/theme/__tests__/motion.test.ts:132:38)

```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +4 failed, 8 passed, 12 total$' /tmp/153-r2.txt \
&& ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r2.txt \
&& test ! -e .expo/types/router.d.ts \
&& { bun run typecheck > /tmp/153-r2-tsc.txt 2>&1 || true; } \
&& test "$(grep -c 'error TS' /tmp/153-r2-tsc.txt)" = 5 \
&& test "$(grep -cE '^src/theme/__tests__/motion\.test\.ts\([0-9]+,[0-9]+\): error TS(2305|2724):' /tmp/153-r2-tsc.txt)" = 5 \
&& bun run lint \
&& git add src/theme/__tests__/motion.test.ts \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/theme/__tests__/motion.test.ts' \
&& git commit -m 'test(mobile-welcome): #153 R4 red pingo motion constants'
```

```text
[feature/153-mobile-welcome-pingo f7943c81] test(mobile-welcome): #153 R4 red pingo motion constants
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 32 insertions(+)
$ expo lint
cadena exit=0
```

Typecheck rojo acotado (salida del comando del handoff con || true):

```text
$ tsc --noEmit
src/theme/__tests__/motion.test.ts(11,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_ENTRANCE_SCALE'.
src/theme/__tests__/motion.test.ts(12,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_FLOAT_OFFSET_Y'.
src/theme/__tests__/motion.test.ts(13,3): error TS2724: '"../motion"' has no exported member named 'MOTION_FLOAT_TIMING'. Did you mean 'MOTION_FADE_TIMING'?
src/theme/__tests__/motion.test.ts(14,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_BLINK_INTERVAL_MS'.
src/theme/__tests__/motion.test.ts(15,3): error TS2724: '"../motion"' has no exported member named 'MOTION_BLINK_TIMING'. Did you mean 'MOTION_FILL_TIMING'?

```

Commit: `f7943c81 test(mobile-welcome): #153 R4 red pingo motion constants`.

Typecheck: solo errores permitidos arriba. Lint: exit=0. Guard router.d.ts: exit=0.

## T2 verde

```text
$ FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts > /tmp/153-g2.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
exit=0
```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +12 passed, 12 total$' /tmp/153-g2.txt \
&& test "$(grep -cF 'export const MOTION_' src/theme/motion.ts)" = 13 \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/theme/motion.ts \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/theme/motion.ts' \
&& git commit -m 'feat(mobile-welcome): #153 R4 pingo motion constants'
```

```text
[feature/153-mobile-welcome-pingo 3083d34d] feat(mobile-welcome): #153 R4 pingo motion constants
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 18 insertions(+)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `3083d34d feat(mobile-welcome): #153 R4 pingo motion constants`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T3 rojo

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r3.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       3 failed, 31 passed, 34 total
exit=1
```

Detalle de cada it rojo (matcher y Expected/Received, consulta o ENOENT):

```text
  ● #153 R3: las poses entran como WebP › pingo-wave.webp es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes

    ENOENT: no such file or directory, open '/home/claude/sites/Pet-Tracker-wt-153/mobile-pet-tracker/assets/images/pingo-wave.webp'

      394 | describe('#153 R3: las poses entran como WebP', () => {
      395 |   it.each(['pingo-wave.webp', 'pingo-wave-blink.webp'])('%s es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes', (name) => {
    > 396 |     const bytes = readFileSync(join(process.cwd(), 'assets', 'images', name));
          |                   ^
      397 |     expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
      398 |     expect(bytes.toString('ascii', 8, 12)).toBe('WEBP');
      399 |     expect(bytes.toString('ascii', 12, 16)).toBe('VP8X');

      at readFileSync (src/screens/welcome/index.test.tsx:396:19)

  ● #153 R3: las poses entran como WebP › pingo-wave-blink.webp es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes

    ENOENT: no such file or directory, open '/home/claude/sites/Pet-Tracker-wt-153/mobile-pet-tracker/assets/images/pingo-wave-blink.webp'

      394 | describe('#153 R3: las poses entran como WebP', () => {
      395 |   it.each(['pingo-wave.webp', 'pingo-wave-blink.webp'])('%s es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes', (name) => {
    > 396 |     const bytes = readFileSync(join(process.cwd(), 'assets', 'images', name));
          |                   ^
      397 |     expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
      398 |     expect(bytes.toString('ascii', 8, 12)).toBe('WEBP');
      399 |     expect(bytes.toString('ascii', 12, 16)).toBe('VP8X');

      at readFileSync (src/screens/welcome/index.test.tsx:396:19)

  ● #153 R3: las poses entran como WebP › no mete otras poses de Pingo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 4
    + Received  + 1

    - Array [
    -   "pingo-wave-blink.webp",
    -   "pingo-wave.webp",
    - ]
    + Array []

      406 |   it('no mete otras poses de Pingo', () => {
      407 |     expect(readdirSync(join(process.cwd(), 'assets', 'images')).filter((name) => /^(pingo|mascot)-/.test(name)).sort())
    > 408 |       .toEqual(['pingo-wave-blink.webp', 'pingo-wave.webp']);
          |        ^
      409 |   });
      410 | });
      411 |

      at Object.toEqual (src/screens/welcome/index.test.tsx:408:8)

```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +3 failed, 31 passed, 34 total$' /tmp/153-r3.txt \
&& test "$(grep -cE 'ENOENT: no such file or directory.*pingo-wave(-blink)?\.webp' /tmp/153-r3.txt)" -ge 2 \
&& ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r3.txt \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.test.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
&& git commit -m 'test(mobile-welcome): #153 R3 red pingo webp poses'
```

```text
[feature/153-mobile-welcome-pingo 3f974134] test(mobile-welcome): #153 R3 red pingo webp poses
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 20 insertions(+), 1 deletion(-)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `3f974134 test(mobile-welcome): #153 R3 red pingo webp poses`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

T3 copia sin reconvertir: `cp /home/claude/pet-tracker-mascot/webp/pingo-wave.webp /home/claude/pet-tracker-mascot/webp/pingo-wave-blink.webp assets/images/; echo "exit=$?"`: exit=0.

## T3 verde

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g3.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       34 passed, 34 total
exit=0
```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +34 passed, 34 total$' /tmp/153-g3.txt \
&& cmp -s assets/images/pingo-wave.webp /home/claude/pet-tracker-mascot/webp/pingo-wave.webp \
&& cmp -s assets/images/pingo-wave-blink.webp /home/claude/pet-tracker-mascot/webp/pingo-wave-blink.webp \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add assets/images/pingo-wave.webp assets/images/pingo-wave-blink.webp \
&& test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/assets/images/pingo-wave-blink.webp mobile-pet-tracker/assets/images/pingo-wave.webp ' \
&& git commit -m 'feat(mobile-welcome): #153 R3 pingo webp poses'
```

```text
[feature/153-mobile-welcome-pingo be10ffef] feat(mobile-welcome): #153 R3 pingo webp poses
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 mobile-pet-tracker/assets/images/pingo-wave-blink.webp
 create mode 100644 mobile-pet-tracker/assets/images/pingo-wave.webp
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `be10ffef feat(mobile-welcome): #153 R3 pingo webp poses`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T4 rojo

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r4.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       3 failed, 34 passed, 37 total
exit=1
```

Detalle de cada it rojo (matcher y Expected/Received, consulta o ENOENT):

```text
  ● #153 R1: el saludo de Pingo existe en los dos idiomas › declara el saludo en inglés y en español

    expect(received).toBe(expected) // Object.is equality

    Expected: "Hi, I'm Pingo. I'll help you know where your pet is and how they're doing."
    Received: undefined

      414 | describe('#153 R1: el saludo de Pingo existe en los dos idiomas', () => {
      415 |   it('declara el saludo en inglés y en español', () => {
    > 416 |     expect(en['welcome.pingoGreeting']).toBe('Hi, I\'m Pingo. I\'ll help you know where your pet is and how they\'re doing.');
          |                                         ^
      417 |     expect(es['welcome.pingoGreeting']).toBe('Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.');
      418 |   });
      419 |

      at Object.toBe (src/screens/welcome/index.test.tsx:416:41)

  ● #153 R1: el saludo de Pingo existe en los dos idiomas › no exclama ni lleva emoji en ningún idioma

    expect(received).not.toMatch(expected)

    Matcher error: received value must be a string

    Received has value: undefined

      420 |   it('no exclama ni lleva emoji en ningún idioma', () => {
      421 |     for (const value of [en['welcome.pingoGreeting'], es['welcome.pingoGreeting']]) {
    > 422 |       expect(value).not.toMatch(/[!¡]/);
          |                         ^
      423 |       expect(value).not.toMatch(/\p{Extended_Pictographic}/u);
      424 |     }
      425 |   });

      at Object.toMatch (src/screens/welcome/index.test.tsx:422:25)

  ● #153 R1: el saludo de Pingo existe en los dos idiomas › registra la clave en la tabla de mobile-ui-language

    expect(received).toContain(expected) // indexOf

    Expected substring: "### §2.20 — Añadidos por #153 — Pingo en la bienvenida"
    Received string:    "---
    feature: \"mobile-ui-language\"
    status: approved     # draft | approved
    tags: [harness, spec]
    ---·
    # Diseño — [[mobile-ui-language]]·
    > Ver [[requirements]] para los requisitos que este diseño implementa,
    > [[copy-review]] para la hoja de revisión humana de la copy (no normativa),
    > [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI) y
    > [[../../docs/conventions|conventions]] para las reglas que la implementación
    > debe respetar. Fuente del alcance: `progress/explore_design-gap-vs-make.md`
    > §4 y su ampliación del 2026-09-05. Fuente del vocabulario español:
    > `specs/mobile-figma-polish/design-src/App.tsx` (el export del Figma Make ya
    > versionado en el repo).·
    Esta spec es **autosuficiente**: Codex CLI no ve la conversación que la
    originó. Todo el copy y todas las claves están en §2. **Codex no redacta texto
    de producto y no inventa claves**: si encuentra una cadena visible que no está
    en la tabla, para y lo anota en `progress/impl_mobile-ui-language.md`.·
    ---·
    ## 1. El inventario·
    ### 1.1 Método (el reviewer lo repite)·
    Se leyó **entero** cada uno de los 37 ficheros `.ts`/`.tsx` no-test de
    `mobile-pet-tracker/src/` y se anotó cada literal que el usuario ve: hijos de
    `<Text>`, `label=`, `placeholder=`, `accessibilityLabel=`, los argumentos de
    `Alert.alert`, las etiquetas de las tablas `REMINDER_TYPE_META`,
    `ADVANCE_OPTIONS` y `TABS`, y las cadenas que pasan por
    `setError`/`setFormError`/`setActionError`/`setGeneralError`/`setPhotoError`/
    `setGenerateError` para acabar en un `<Text>`. **Excluidos**: `className`,
    `testID`, rutas, estilos, claves de objeto, valores de dominio (`'dog'`,
    `'female'`, `'online'`) y los `throw new Error` de los providers, que solo ve
    un desarrollador.·
    Cada fila de §2 se verificó con un script que abre el archivo y comprueba que
    el literal está **realmente** en la línea declarada (o en el par de líneas que
    ocupa un texto JSX partido). **320 de 320 filas verifican** contra `a44925f`.·
    ### 1.2 Resultado·
    | Métrica | Informe §4 | **Esta spec** | Nota |
    |---|---|---|---|
    | Cadenas inglesas **distintas** | ~214 | **213** | El informe daba un «~»; `· in ${days} days` se cuenta como **una** plantilla, no dos fragmentos |
    | Ocurrencias **inglesas** | — | **309** | |
    | Ocurrencias **ya en español** | 10 | **11** | 8 en `profile`, 2 en `add-pet`, 1 en `docs`. El informe contó 7 en `profile` y se dejó el `'No registrado'` de `InfoRow` (`profile/index.tsx:49`) |
    | **Ocurrencias de copy totales** | — | **320** | Lo que el catálogo tiene que cubrir |
    | **Claves** del catálogo | — | **255** | 241 de la copy inglesa + 11 de la ya española + 3 del interruptor (§3.3) |
    | Ficheros de fuente afectados | — | **19** | De 37 no-test; los 13 de `src/api/` y los 5 de `src/theme/` están limpios |
    | Puntos de test anclados a copy | 166 | **178** en **19** ficheros | Conteo por **literal**: cada string o regex de un fichero de test que contiene una cadena de la tabla, descontando a mano (a) títulos de `describe`/`it`, (b) `className`/`testID`, (c) **10** literales que son mensajes de validación **del backend** y se quedan en inglés, (d) **4** de `auth-provider.test.tsx` que rotulan botones del propio arnés, y (e) el directorio `src/api/__tests__/` entero, que no renderiza UI |
    | Consultas por `testID` | 796 | **796** | Confirmado |
    | Llamadas `*ByText(`/`toHaveTextContent(` | — | **246** (102 + 144) | |
    | Plantillas con `${}` en texto visible | 31 (leader) | **33 sitios**, **11 son copy** | Enumeradas en §2.12 |
    | Snapshots con copy | 0 | **0** | El único `.snap` es la ruta SVG de blobatar |
    | Cadenas de usuario en `src/api/` | 0 | **0** | Los 13 módulos devuelven uniones por `kind` |·
    ### 1.3 Reparto por archivo (320 ocurrencias, 19 archivos)·
    | Archivo | Ocurrencias | R-id |
    |---|---:|---|
    | `src/screens/pairing/index.tsx` | 40 | R10 |
    | `src/screens/add-pet/index.tsx` | 40 | R9 |
    | `src/screens/profile/index.tsx` | 28 | R7 |
    | `src/screens/add-reminder/index.tsx` | 22 | R8 |
    | `src/screens/reminders/index.tsx` | 21 | R8 |
    | `src/app/(tabs)/home.tsx` | 20 | R3 |
    | `src/app/(tabs)/map.tsx` | 19 | R4 |
    | `src/app/(tabs)/meal-schedule.tsx` | 19 | R6 |
    | `src/app/(tabs)/weight-log.tsx` | 18 | R5 |
    | `src/app/(tabs)/food.tsx` | 16 | R6 |
    | `src/screens/reset-password/index.tsx` | 15 | R11 |
    | `src/app/(auth)/register.tsx` | 14 | R1 |
    | `src/app/(tabs)/health.tsx` | 13 | R5 |
    | `src/app/(auth)/login.tsx` | 10 | R1 |
    | `src/screens/docs/index.tsx` | 7 | R7 |
    | `src/utils/reminder-meta.ts` | 7 | R8 |
    | `src/screens/forgot/index.tsx` (movida por #117) | 12 | R1 |
    | `src/components/floating-tab-bar.tsx` | 5 | R2 |
    | `src/components/weight-chart.tsx` | 1 | R5 |·
    ### 1.4 Reparto por fichero de test (178 anclas, 19 ficheros)·
    | Fichero de test | Anclas |
    |---|---:|
    | `src/screens/pairing/index.test.tsx` | 36 |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 21 |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 16 |
    | `src/app/(tabs)/__tests__/home.test.tsx` | 14 |
    | `src/screens/reminders/index.test.tsx` | 14 |
    | `src/screens/add-reminder/index.test.tsx` | 13 |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 12 |
    | `src/app/(tabs)/__tests__/health.test.tsx` | 10 |
    | `src/app/(tabs)/__tests__/weight-log.test.tsx` | 10 |
    | `src/screens/reset-password/index.test.tsx` | 7 |
    | `src/app/(auth)/__tests__/register.test.tsx` | 5 |
    | `src/components/__tests__/floating-tab-bar.test.tsx` | 5 |
    | `src/app/(auth)/__tests__/login.test.tsx` | 4 |
    | `src/screens/add-pet/index.test.tsx` | 4 |
    | `src/screens/profile/index.test.tsx` | 3 |
    | `src/__tests__/legibility-classnames.test.ts` | 1 |
    | `src/screens/forgot/index.test.tsx` (movida por #117) | 1 |
    | `src/app/(tabs)/__tests__/screens.test.tsx` | 1 |
    | `src/components/__tests__/weight-chart.test.tsx` | 1 |·
    `src/screens/docs/index.test.tsx` no aparece: sus aserciones de texto ya son
    españolas o de fixture, y **siguen valiendo** porque el idioma por defecto es
    español.·
    ---·
    ## 2. El catálogo (normativo)·
    ### 2.0 Decisiones de catálogo·
    - **D1 — Esquema de claves: `<ámbito>.<nombreEnCamelCase>`, ámbito por
      pantalla.** El ámbito es el slug de la pantalla o del módulo
      (`login`, `forgot`, `register`, `tabs`, `home`, `map`, `health`, `weightLog`,
      `weightChart`, `food`, `mealSchedule`, `profile`, `docs`, `reminders`,
      `reminderType`, `addReminder`, `addPet`, `pairing`, `resetPassword`), más un
      ámbito `common` (D3). El nombre se deriva del **inglés**, no del español, en
      camelCase, con un máximo de cuatro palabras. Dos razones: el inglés es el
      idioma del código en este repo (`docs/conventions.md` §Commits), y **el
      español es lo que puede cambiar** en la revisión del humano — una clave
      derivada del español obligaría a renombrar claves cada vez que el humano
      ajuste una palabra.
      Es legible en el sitio de uso: `t('login.signIn')`, `t('pairing.unpairAlertTitle')`,
      `t('home.summaryTitle')`. No hay anidamiento (`login.form.email`): un solo
      nivel, porque dos niveles no aportan nada con 255 claves y complican el tipo.·
    - **D2 — El ámbito es por pantalla incluso cuando el texto coincide, y por eso
      hay 255 claves y no 213.** 213 es el número de **cadenas inglesas
      distintas**; las claves están acotadas, así que la misma cadena con dos
      significados son dos claves. **Y tiene que serlo**: `Food` es `Nutrición` en
      la pestaña (`tabs.food`) y `Comida` como tipo de recordatorio
      (`reminderType.food`); un catálogo plano por cadena las colisionaría y
      obligaría a elegir una sola traducción para las dos. El precio de duplicar
      una cadena de tres palabras en un objeto es cero; el precio de no poder
      divergir después es un refactor.·
    - **D3 — `common` solo para lo que se repite mucho, con umbral numérico.** Una
      cadena sube a `common` si aparece **≥5 veces en ≥5 archivos**. Cumplen
      exactamente cuatro, y son las cuatro genéricas de estado que nadie va a
      querer que diverjan por pantalla:·
      | Clave | `en` | `es` | Usos / archivos |
      |---|---|---|---:|
      | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` | 31 / 13 |
      | `common.retry` | `Retry` | `Reintentar` | 14 / 10 |
      | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` | 10 / 9 |
      | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` | 5 / 5 |·
      Cubren **60 de las 320** ocurrencias. La siguiente candidata (`Email`, 3/3)
      no llega al umbral y se queda acotada. El umbral es una regla, no un gusto:
      si mañana una quinta cadena llega a 5/5, sube.·
    - **D4 — Manda la palabra del diseño.** Donde el Make ya da la palabra en
      español se usa **ésa**: `En línea` (`design-src/App.tsx:358`), `Nutrición`
      (`:758`, etiqueta de la pestaña `food`), `Objetivo diario` (`:607`),
      `kcal / día` (`:609`), `Comidas hoy` (`:626`), `Servido` (`:639`),
      `Recomendación IA` (`:645`), `Cambiar foto` (`:683`), `Horarios y porciones`
      (`:1465`), `Activos`/`Esta semana`/`Inactivos` (`:933-935`), `¡Próximo!`
      (`:955`), `Agregar recordatorio` (`:1013`),
      `Vacuna`/`Medicamento`/`Consulta`/`Otro` (`:979-983`), `Nueva mascota`
      (`:1145`), `Tipo de mascota` (`:1194`), `Raza`/`Sexo`/`Tamaño`
      (`:1210, 1222, 1238`), `Esterilizado/a` (`:1262`), `Guardar mascota`
      (`:1304`), `Peso (kg)` (`:1573`), `Fecha` (`:1582`),
      `Batería`/`Conexión` (`:1639-1640`),
      `Nombres`/`Apellidos`/`Correo electrónico`/`País` (`:309-313`), `Contraseña`
      (`:227`), `Iniciar sesión` (`:224`), `¿Olvidaste tu contraseña?` (`:231`),
      `Crear cuenta` (`:290`), `Recuperar contraseña` (`:258`),
      `Volver al inicio de sesión` (`:270`, sin la flecha).·
    - **D5 — Tuteo, imperativo, sin punto final en botones y etiquetas.** Los
      mensajes y las frases completas conservan el punto si ya lo llevaban en
      inglés; ninguna cadena gana o pierde puntuación por su cuenta.·
    - **D6 — Las 11 cadenas que ya estaban en español entran al catálogo con su
      texto intacto en `es`**, y su columna `en` es traducción inversa que fija
      esta tabla (`Documentos` → `Documents`, `Datos básicos` →
      `Basic details`…). No se re-redactan para parecerse al Make: `Dispositivo
      GPS` se queda, aunque el diseño diga `Collar GPS`. Van marcadas
      *(ya en español)* en las tablas.·
    - **D7 — Las unidades no entran al catálogo.** `kg`, `km`, `km/h`, `kcal`,
      `g`, `%` y la `h`/`m` de `fmtMinutes` (`1h 35m`) son símbolos y siguen
      siendo literales en su formateador. Sí entra `ago`, que es una palabra
      (§2.12). La asimetría `m` (duración) frente a `min` (tiempo transcurrido) es
      deliberada: `hace 2 m` no se lee.·
    - **D8 — Las máscaras de fecha se traducen, el parseo no.** `YYYY-MM-DD` →
      `AAAA-MM-DD` es texto de ayuda; el valor que `weight-log` envía sigue siendo
      ISO y `localTodayIso()` no se toca. Igual con `BC n/9` → `CC n/9`.·
    - **D9 — Los emoji no son copy.** Los 7 de `REMINDER_TYPE_META` y el `📄` de
      `docs` se quedan como están: #62 ya declaró que sustituirlos es feature
      aparte. Lo que sale de `REMINDER_TYPE_META` al catálogo es **solo el
      `label`** (§3.5).·
    ### 2.x — Cómo leer las tablas·
    `Línea` es la del commit base `a44925f`; si #64 entra antes, la línea se
    desplaza y **la cadena sigue siendo el ancla**. `Clave` es normativa: es lo que
    Codex escribe en el `t(...)`. `(param)` marca las 11 entradas con
    interpolación (§2.12); *(ya en español)* marca las 11 de D6. Las claves
    `common.*` aparecen repetidas en varios grupos: el recuento de «claves» de cada
    cabecera las incluye, así que **la suma de los grupos es mayor que 252**; el
    total sin repetir es 252 + 3 del interruptor = **255**.··
    ### §2.1 — R1 — grupo `(auth)` (36 ocurrencias, 28 claves)·
    **`mobile-pet-tracker/src/app/(auth)/login.tsx`** — 10 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 31 | `login.invalidCredentials` | `Invalid credentials` | `Credenciales inválidas` |
    | 34 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 41 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 44 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 66 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 70 | `login.email` | `Email` | `Correo electrónico` |
    | 83 | `login.password` | `Password` | `Contraseña` |
    | 107 | `login.signIn` | `Sign in` | `Iniciar sesión` |
    | 117 | `login.createAccount` | `Create account` | `Crear cuenta` |
    | 126 | `login.forgotPassword` | `Forgot password?` | `¿Olvidaste tu contraseña?` |·
    **`mobile-pet-tracker/src/screens/forgot/index.tsx`** — 12 ocurrencias (movido por #117 desde src/app/(auth)/forgot.tsx)·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `forgot.forgotPassword` | `Forgot password` | `Recuperar contraseña` |
    | — | `forgot.comingSoon` ← retirada por #117 (R1) | `Password recovery coming soon` | `La recuperación de contraseña estará disponible pronto` |
    | — | `forgot.email` | `Email` | `Correo electrónico` |
    | — | `forgot.sendRecoveryLink` | `Send recovery link` | `Enviar enlace de recuperación` |
    | — | `forgot.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | — | `forgot.instructions` ← añadida por #117 (R1) | `Enter the email linked to your account and we'll send you a link to reset your password.` | `Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.` |
    | — | `forgot.checkYourEmail` ← añadida por #117 (R1) | `Check your email` | `Revisa tu correo` |
    | — | `forgot.sentTo` ← añadida por #117 (R1) | `If an account exists for {{email}}, we sent a link to reset your password. Check your inbox and spam folder.` | `Si existe una cuenta para {{email}}, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.` |
    | — | `forgot.resend` ← añadida por #117 (R1) | `Resend` | `Reenviar` |
    | — | `forgot.invalidEmail` ← añadida por #117 (R1) | `Enter a valid email address` | `Ingresa un correo electrónico válido` |
    | — | `forgot.tooManyAttempts` ← añadida por #117 (R1) | `Too many attempts. Try again later.` | `Demasiados intentos. Inténtalo más tarde.` |
    | — | `common.cannotReachServer` ← uso añadido por #117 (R7) | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | — | `common.somethingWentWrong` ← uso añadido por #117 (R7) | `Something went wrong` | `Algo salió mal` |·
    **`mobile-pet-tracker/src/app/(auth)/register.tsx`** — 14 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 120 | `register.emailAlreadyRegistered` | `Email already registered` | `Ese correo ya está registrado` |
    | 129 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 133 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 156 | `register.createAccount` | `Create account` | `Crear cuenta` |
    | 161 | `register.firstName` | `First name` | `Nombres` |
    | 176 | `register.lastName` | `Last name` | `Apellidos` |
    | 188 | `register.email` | `Email` | `Correo electrónico` |
    | 201 | `register.phone` | `Phone` | `Teléfono` |
    | 214 | `register.password` | `Password` | `Contraseña` |
    | 228 | `register.confirmPassword` | `Confirm password` | `Confirmar contraseña` |
    | 244 | `register.country` | `Country (2-letter code)` | `País (código de 2 letras)` |
    | 263 | `register.iAcceptTerms` | `I accept the terms` | `Acepto los términos` |
    | 279 | `register.createAccount` | `Create account` | `Crear cuenta` |··
    ### §2.2 — R2 — barra de pestañas (5 ocurrencias, 5 claves)·
    **`mobile-pet-tracker/src/components/floating-tab-bar.tsx`** — 5 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `tabs.home` | `Home` | `Inicio` |
    | 50 | `tabs.map` | `Map` | `Mapa` |
    | 51 | `tabs.health` | `Health` | `Salud` |
    | 52 | `tabs.food` | `Food` | `Nutrición` |
    | 53 | `tabs.profile` | `Profile` | `Perfil` |··
    ### §2.3 — R3 — Home (20 ocurrencias, 18 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/home.tsx`** — 20 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 47 | `home.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 48 | `home.lastSeen` **(param)** | `Last seen {{date}}` | `Última señal {{date}}` |
    | 110 | `home.home` | `Home` | `Inicio` |
    | 119 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `common.retry` | `Retry` | `Reintentar` |
    | 129 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 147 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 149 | `common.retry` | `Retry` | `Reintentar` |
    | 197 | `home.free` | `Free` | `Sin collar` |
    | 199 | `home.online` | `Online` | `En línea` |
    | 200 | `home.offline` | `Offline` | `Sin conexión` |
    | — | `home.unknown` | `Awaiting signal` | `Esperando señal` | ← añadida por #73 (R5)
    | 233 | `home.noCollar` | `No collar — health only` | `Sin collar — solo salud` |
    | 245 | `home.pairCollar` | `Pair a collar` | `Vincular collar` |
    | 256 | `home.summaryTitle` | `Today&apos;s Summary` | `Resumen de hoy` |
    | 265 | `home.activityNeedsCollar` | `Activity tracking requires a collar` | `La actividad requiere un collar` |
    | 273 | `home.couldNotLoadActivity` | `Could not load activity` | `No se pudo cargar la actividad` |
    | 289 | `home.activity` | `Activity` | `Actividad` |
    | 301 | `home.sleep` | `Sleep` | `Descanso` |
    | 313 | `home.distance` | `Distance` | `Distancia` |
    | — | `home.weight` | `Weight` | `Peso` | ← añadida por #69 (R11)
    | 332 | `home.viewOnMap` | `View on map` | `Ver en el mapa` |
    | — | `home.walks` | `Walks` | `Paseos` | ← añadida por #67 (R7b)
    | — | `home.quickActions` | `Quick actions` | `Accesos rápidos` | ← añadida por #71 (R11)
    | — | `home.quickActionWeight` | `Weight` | `Peso` | ← añadida por #71 (R11)
    | — | `home.quickActionReminder` | `Reminder` | `Recordatorio` | ← añadida por #71 (R11)
    | — | `home.quickActionDocuments` | `Documents` | `Documentos` | ← añadida por #71 (R11)·
    **`mobile-pet-tracker/src/screens/home/index.tsx`** — claves de la sección de
    recordatorios añadidas por #70·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `home.reminders` | `Reminders` | `Recordatorios` | ← añadida por #70 (R16)
    | — | `home.remindersSeeAll` | `See all` | `Ver todos` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDays` **(param)** | `{{days}} d` | `{{days}} d` | ← añadida por #70 (R16)
    | — | `home.nextVaccineDaysLeft` **(param)** | `In {{days}} days` | `Faltan {{days}} días` | ← añadida por #70 (R16)
    | — | `home.nextVaccineToday` | `Today` | `Hoy` | ← añadida por #70 (R16)
    | — | `home.nextVaccineOverdue` | `Overdue` | `Vencida` | ← añadida por #70 (R16)
    | — | `home.noUpcomingVaccine` | `No upcoming vaccine` | `Sin vacuna próxima` | ← añadida por #70 (R16)·
    **`mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`** — claves
    añadidas por #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `weeklyActivity.title` | `Weekly activity` | `Actividad semanal` |
    | — | `weeklyActivity.lastSevenDays` | `last 7 days` | `últimos 7 días` |
    | — | `weeklyActivity.noDataYet` | `No activity recorded yet` | `Aún no hay actividad registrada` |
    | — | `weeklyActivity.noDataForDay` | `No data for this day` | `Sin datos de este día` |
    | — | `weeklyActivity.metricActiveMinutes` | `Active minutes` | `Minutos activos` |
    | — | `weeklyActivity.metricDistance` | `Distance` | `Distancia recorrida` |
    | — | `weeklyActivity.metricWalks` | `Walks` | `Paseos` |
    | — | `weeklyActivity.dayLabelActiveMinutes` **(param)** | `{{day}}: {{value}} active minutes` | `{{day}}: {{value}} minutos activos` |
    | — | `weeklyActivity.dayLabelDistance` **(param)** | `{{day}}: {{value}} travelled` | `{{day}}: {{value}} de recorrido` |
    | — | `weeklyActivity.dayLabelWalks` **(param)** | `{{day}}: {{value}} walks` | `{{day}}: {{value}} paseos` |
    | — | `weeklyActivity.dayLabelMissing` **(param)** | `{{day}}: no data` | `{{day}}: sin datos` |
    | — | `weeklyActivity.chartSummary` **(param)** | `Chart of {{metric}} over the last 7 days` | `Gráfica de {{metric}} de los últimos 7 días` |
    | — | `weeklyActivity.average` **(param)** | `Average {{value}}` | `Media {{value}}` |
    | — | `weeklyActivity.trend` **(param)** | `{{percent}}% vs. previous week` | `{{percent}} % frente a la semana previa` |··
    ### §2.4 — R4 — Map (19 ocurrencias, 17 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/map.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 60 | `map.justNow` | `Just now` | `Justo ahora` |
    | 61 | `map.agoMinutes` **(param)** | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 62 | `map.agoHours` **(param)** | `{{hours}}h ago` | `hace {{hours}} h` |
    | 196 | `map.noSignal` | `No signal` | `Sin señal` |
    | 198 | `map.live` | `GPS active` | `GPS activo` ← literal cambiado por #116 (R1); antes `Live` / `En vivo` |
    | 199 | `map.stale` | `Stale` | `Desactualizado` |
    | 210 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 213 | `common.retry` | `Retry` | `Reintentar` |
    | 221 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 229 | `map.trackingNeedsCollar` | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |
    | 240 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 243 | `common.retry` | `Retry` | `Reintentar` |
    | 269 | `map.noLocationDataYet` | `No location data yet` | `Sin datos de ubicación todavía` |
    | 299 | `map.speed` | `Speed` | `Velocidad` |
    | 315 | `map.distance` | `Distance` | `Distancia` |
    | 333 | `map.updated` | `Updated` | `Actualizado` |
    | 366 | `map.deactivateLostMode` | `Deactivate Lost Mode` | `Desactivar modo perdido` |
    | 367 | `map.activateLostMode` | `Activate Lost Mode` | `Activar modo perdido` |
    | 376 | `map.couldNotUpdateLostMode` | `Could not update Lost Mode` | `No se pudo cambiar el modo perdido` |··
    ### §2.5 — R5 — Health, log de peso y gráfica (32 ocurrencias, 27 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/health.tsx`** — 13 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 91 | `health.health` | `Health` | `Salud` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 103 | `common.retry` | `Retry` | `Reintentar` |
    | 110 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 127 | `health.vaccines` | `Vaccines` | `Vacunas` |
    | 151 | `health.nextDue` | `Next due` | `Próxima dosis` |
    | 165 | `health.noVaccinesYet` | `No vaccines yet` | `Aún no hay vacunas` |
    | 173 | `health.couldNotLoadVaccines` | `Could not load vaccines` | `No se pudieron cargar las vacunas` |
    | 176 | `common.retry` | `Retry` | `Reintentar` |
    | 217 | `health.weight` | `Weight` | `Peso` |
    | 243 | `health.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 249 | `health.couldNotLoadWeight` | `Could not load weight` | `No se pudo cargar el peso` |
    | 261 | `health.weightLog` | `Weight log` | `Registro de peso` |·
    **`mobile-pet-tracker/src/app/(tabs)/weight-log.tsx`** — 18 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 72 | `weightLog.enterValidWeight` | `Enter a valid weight` | `Introduce un peso válido` |
    | 99 | `weightLog.errorForbidden` | `Only the owner can log weights` | `Solo el dueño puede registrar pesos` |
    | 102 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 109 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 112 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 133 | `weightLog.backToHealth` | `Back to health` | `Volver a Salud` ← retirada por #95 (R5) |
    | 141 | `weightLog.weightLog` | `Weight log` | `Registro de peso` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 154 | `weightLog.weight` | `Weight` | `Peso` |
    | 160 | `weightLog.weightKg` | `Weight (kg)` | `Peso (kg)` |
    | 167 | `weightLog.measuredAt` | `Measured at` | `Fecha de medición` |
    | 172 | `weightLog.yyyyMmDd` | `YYYY-MM-DD` | `AAAA-MM-DD` |
    | 179 | `weightLog.bodyCondition` | `Body condition` | `Condición corporal` |
    | 185 | `weightLog.bodyConditionPlaceholder` | `Body condition 1-9 (optional)` | `Condición corporal 1-9 (opcional)` |
    | 204 | `weightLog.logWeight` | `Log weight` | `Registrar peso` |
    | 220 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 223 | `common.retry` | `Retry` | `Reintentar` |
    | 230 | `weightLog.noWeightEntriesYet` | `No weight entries yet` | `Aún no hay registros de peso` |
    | 284 | `weightLog.bodyConditionValue` **(param)** | `BC {{value}}/9` | `CC {{value}}/9` |
    | — | `weightLog.dateCannotBeAfterToday` | `Date cannot be after today` | `La fecha no puede ser posterior a hoy` | ← añadida por #90 (R2) |·
    **`mobile-pet-tracker/src/components/weight-chart.tsx`** — 1 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 20 | `weightChart.notEnoughDataYet` | `Not enough data yet` | `Aún no hay datos suficientes` |··
    ### §2.6 — R6 — Food y Meal schedule (38 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/app/(tabs)/food.tsx`** — 16 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 80 | `food.food` | `Food` | `Nutrición` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 94 | `common.retry` | `Retry` | `Reintentar` |
    | 101 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 144 | `food.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 150 | `food.dailyKcal` **(param)** | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 156 | `food.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 174 | `food.mealsToday` | `Meals today` | `Comidas hoy` |
    | — | `food.markServed` | `Mark {{time}} as served` | `Marcar {{time}} como servida` | ← añadida por #98 (R3)
    | — | `food.undoServed` | `Undo {{time}}` | `Deshacer {{time}}` | ← añadida por #98 (R3)
    | — | `food.couldNotUpdateMeal` | `Could not update the meal` | `No se pudo actualizar la comida` | ← añadida por #98 (R3)
    | — | `food.mealsServedOfTotal` | `{{served}} of {{total}} meals served` | `{{served}} de {{total}} comidas servidas` | ← añadida por #98 (R3)
    | — | `food.kcalConsumedOfTarget` **(param)** | `{{consumed}} of {{target}} kcal served today` | `{{consumed}} de {{target}} kcal servidas hoy` | ← añadida por #113 (R3)
    | 224 | `food.pending` | `Pending` | `Pendiente` |
    | 224 | `food.served` | `Served` | `Servido` |
    | 259 | `food.aiRecommendation` | `AI recommendation` | `Recomendación IA` |
    | 272 | `food.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 281 | `food.couldNotLoadPlan` | `Could not load meal plan` | `No se pudo cargar el plan de alimentación` |
    | 284 | `common.retry` | `Retry` | `Reintentar` |
    | 296 | `food.mealSchedule` | `Meal schedule` | `Horario de comidas` |
    | 299 | `food.mealScheduleLinkSubtitle` | `View nutrition profile and times` | `Ver el perfil nutricional y los horarios` |·
    **`mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx`** — 19 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 83 | `mealSchedule.errorForbidden` | `Only the owner can generate the plan` | `Solo el dueño puede generar el plan` |
    | 87 | `mealSchedule.errorProfileRequired` | `Create a nutrition profile first` | `Primero crea un perfil nutricional` |
    | 89 | `mealSchedule.registerWeightFirst` | `Register a weight first` | `Primero registra un peso` |
    | 91 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 95 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 105 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 126 | `mealSchedule.backToFood` | `Back to food` | `Volver a Nutrición` ← retirada por #95 (R5) |
    | 135 | `mealSchedule.mealSchedule` | `Meal schedule` | `Horario de comidas` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 160 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 163 | `common.retry` | `Retry` | `Reintentar` |
    | 178 | `mealSchedule.dailyTarget` | `Daily target` | `Objetivo diario` |
    | 184 | `mealSchedule.dailyGrams` **(param)** | `{{grams}} g / day` | `{{grams}} g / día` |
    | 190 | `mealSchedule.mealsPerDay` **(param)** | `{{meals}} meals / day` | `{{meals}} comidas / día` |
    | 198 | `mealSchedule.timesAndPortions` | `Times and portions` | `Horarios y porciones` |
    | 232 | `mealSchedule.noMealPlanYet` | `No meal plan yet` | `Aún no hay plan de alimentación` |
    | 250 | `mealSchedule.generatePlan` | `Generate plan` | `Generar plan` |
    | 269 | `mealSchedule.nutritionProfile` | `Nutrition profile` | `Perfil nutricional` |
    | 297 | `mealSchedule.noNutritionProfileYet` | `No nutrition profile yet` | `Aún no hay perfil nutricional` |··
    ### §2.7 — R7 — Profile y Documentos (35 ocurrencias, 32 claves)·
    **`mobile-pet-tracker/src/screens/profile/index.tsx`** — 28 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 49 | `profile.notRegistered` *(ya en español)* | `Not registered` | `No registrado` |
    | 85 | `profile.sterilized` | `Sterilized` | `Esterilizado` |
    | 86 | `profile.notSterilized` | `Not sterilized` | `Sin esterilizar` |
    | 87 | `profile.ageMonths` **(param)** | `{{months}} months` | `{{months}} meses` |
    | 157 | `profile.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 174 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 186 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 192 | `profile.couldNotUploadPhoto` | `Could not upload photo` | `No se pudo subir la foto` |
    | 211 | `profile.profile` | `Profile` | `Perfil` |
    | 219 | `profile.addPet` | `Add pet` | `Añadir mascota` |
    | — | `profile.notificationsBlocked` | `Notifications are turned off. Turn them on in your phone settings to receive alerts and reminders.` | `Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.` | ← añadida por #99 (R3)
    | — | `profile.openSettings` | `Open settings` | `Abrir configuración` | ← añadida por #99 (R3)
    | 234 | `common.noPetsYet` | `No pets yet` | `Aún no tienes mascotas` |
    | 240 | `profile.couldNotLoadPets` | `Could not load pets` | `No se pudieron cargar las mascotas` |
    | 253 | `profile.couldNotLoadPet` | `Could not load pet profile` | `No se pudo cargar el perfil de la mascota` |
    | 255 | `common.retry` | `Retry` | `Reintentar` |
    | 272 | `profile.changePhoto` | `Change photo` | `Cambiar foto` |
    | 283 | `profile.information` *(ya en español)* | `Information` | `Información` |
    | 285 | `profile.breed` *(ya en español)* | `Breed` | `Raza` |
    | 286 | `profile.microchip` *(ya en español)* | `Microchip` | `Microchip` |
    | 287 | `profile.gpsDevice` *(ya en español)* | `GPS device` | `Dispositivo GPS` |
    | 290 | `profile.lastSignal` *(ya en español)* | `Last signal` | `Última señal` |
    | 307 | `profile.documents` *(ya en español)* | `Documents` | `Documentos` |
    | 319 | `profile.gpsSettings` *(ya en español)* | `GPS device settings` | `Configuración del Dispositivo GPS` |
    | 334 | `profile.reminders` | `Reminders` | `Recordatorios` |
    | 340 | `profile.account` | `Account` | `Cuenta` |
    | 355 | `profile.accountUnavailable` | `Account unavailable` | `Cuenta no disponible` |
    | 365 | `profile.useDarkTheme` | `Use dark theme` | `Usar tema oscuro` |
    | 365 | `profile.useLightTheme` | `Use light theme` | `Usar tema claro` |
    | 376 | `profile.signOut` | `Sign out` | `Cerrar sesión` |·
    **`mobile-pet-tracker/src/screens/docs/index.tsx`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 68 | `docs.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 79 | `docs.documentsOf` *(ya en español)* | `Documents of` | `Documentos de` |
    | 85 | `docs.pet` | `Pet` | `Mascota` |
    | 101 | `docs.noDocumentsYet` | `No documents yet` | `Aún no hay documentos` |
    | 103 | `docs.emptyBody` | `Medical documents will appear here.` | `Los documentos médicos aparecerán aquí.` |
    | 116 | `docs.couldNotLoadDocuments` | `Could not load documents` | `No se pudieron cargar los documentos` |
    | 118 | `common.retry` | `Retry` | `Reintentar` |··
    ### §2.8 — R8 — Recordatorios y su alta (50 ocurrencias, 43 claves)·
    **`mobile-pet-tracker/src/screens/reminders/index.tsx`** — 21 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 87 | `reminders.errorForbidden` | `Only the owner can delete` | `Solo el dueño puede eliminar` |
    | 90 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 97 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 100 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 136 | `reminders.reminders` | `Reminders` | `Recordatorios` ← se pinta desde `src/app/_layout.tsx` por #114 (R4) |
    | 143 | `reminders.new` | `New` | `Nuevo` |
    | 171 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 174 | `common.retry` | `Retry` | `Reintentar` |
    | 182 | `reminders.noRemindersYet` | `No reminders yet` | `Aún no hay recordatorios` |
    | 211 | `reminders.active` | `Active` | `Activos` |
    | 236 | `reminders.thisWeek` | `This week` | `Esta semana` |
    | 253 | `reminders.inactive` | `Inactive` | `Inactivos` |
    | 285 | `reminders.upcoming` | `Upcoming!` | `¡Próximo!` |
    | 301 | `reminders.cancelled` | `Cancelled` | `Cancelado` |
    | 301 | `reminders.sent` | `Sent` | `Enviado` |
    | 305 | `reminders.dueInDays` **(param)** | `· in {{days}} days` | `· en {{days}} días` |
    | 319 | `reminders.delete` | `Delete` | `Eliminar` |
    | 342 | `reminders.deleteReminder` | `Delete reminder?` | `¿Eliminar recordatorio?` |
    | 351 | `reminders.deleteSheetBody` | `This action cannot be undone.` | `Esta acción no se puede deshacer.` |
    | 361 | `reminders.delete` | `Delete` | `Eliminar` |
    | 370 | `reminders.cancel` | `Cancel` | `Cancelar` |·
    **`mobile-pet-tracker/src/utils/reminder-meta.ts`** — 7 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 7 | `reminderType.vaccine` | `Vaccine` | `Vacuna` |
    | 8 | `reminderType.deworming` | `Deworming` | `Desparasitación` |
    | 9 | `reminderType.medication` | `Medication` | `Medicamento` |
    | 10 | `reminderType.appointment` | `Appointment` | `Consulta` |
    | 11 | `reminderType.weight` | `Weight` | `Peso` |
    | 12 | `reminderType.food` | `Food` | `Comida` |
    | 13 | `reminderType.other` | `Other` | `Otro` |·
    **`mobile-pet-tracker/src/screens/add-reminder/index.tsx`** — 22 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 21 | `addReminder.advanceSameDay` | `Same day` | `El mismo día` |
    | 22 | `addReminder.advance1Day` | `1 day before` | `1 día antes` |
    | 23 | `addReminder.advance3Days` | `3 days before` | `3 días antes` |
    | 24 | `addReminder.advance7Days` | `7 days before` | `7 días antes` |
    | 56 | `addReminder.titleIsRequired` | `Title is required` | `El título es obligatorio` |
    | 60 | `addReminder.pickDate` | `Pick a date` | `Elige una fecha` |
    | 66 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 86 | `addReminder.errorForbidden` | `Only the owner can create reminders` | `Solo el dueño puede crear recordatorios` |
    | 89 | `addReminder.dateMustBeFuture` | `Date must be in the future` | `La fecha debe ser futura` |
    | 92 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 99 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 102 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 122 | `addReminder.backToReminders` | `Back to reminders` | `Volver a Recordatorios` ← retirada por #95 (R5) |
    | 132 | `addReminder.addReminder` | `Add reminder` | `Agregar recordatorio` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 138 | `addReminder.type` | `Type` | `Tipo` |
    | 169 | `addReminder.title` | `Title` | `Título` |
    | 176 | `addReminder.reminderTitle` | `Reminder title` | `Título del recordatorio` |
    | 186 | `addReminder.date` | `Date` | `Fecha` |
    | 196 | `addReminder.selectDate` | `Select a date` | `Elige una fecha` |
    | 202 | `addReminder.time` | `Time` | `Hora` |
    | 256 | `addReminder.alert` | `Alert` | `Aviso` |
    | 292 | `addReminder.saveReminder` | `Save reminder` | `Guardar recordatorio` |··
    ### §2.9 — R9 — Alta de mascota (40 ocurrencias, 38 claves)·
    **`mobile-pet-tracker/src/screens/add-pet/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 114 | `addPet.errorPhotoFormat` | `Choose a JPEG, PNG, or WebP image` | `Elige una imagen JPEG, PNG o WebP` |
    | 148 | `addPet.nameIsRequired` | `Name is required` | `El nombre es obligatorio` |
    | 155 | `addPet.chooseBirthDate` | `Choose a birth date` | `Elige una fecha de nacimiento` |
    | 162 | `addPet.errorAgeRange` | `Enter an age from 0 to 480 months` | `Introduce una edad de 0 a 480 meses` |
    | 189 | `addPet.errorPhotoAfterCreate` | `Pet created, but the photo could not be uploaded` | `Se creó la mascota, pero no se pudo subir la foto` |
    | 198 | `addPet.checkPetDetails` | `Check the pet details` | `Revisa los datos de la mascota` |
    | 201 | `addPet.youCannotCreatePet` | `You cannot create a pet` | `No puedes crear una mascota` |
    | 204 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 208 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 211 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 231 | `addPet.backToProfile` | `Back to profile` | `Volver a Perfil` ← retirada por #95 (R5) |
    | 240 | `addPet.addPet` | `Add pet` | `Nueva mascota` ← se pinta desde `src/app/_layout.tsx` por #95 (R4) |
    | 245 | `addPet.pet` | `Pet` | `Mascota` |
    | 250 | `addPet.avatarPreview` | `Avatar preview` | `Vista previa del avatar` |
    | 259 | `addPet.choosePhoto` | `Choose photo` | `Elegir foto` |
    | 269 | `addPet.basicDetails` *(ya en español)* | `Basic details` | `Datos básicos` |
    | 272 | `addPet.species` | `Species` | `Tipo de mascota` |
    | 289 | `addPet.cat` | `Cat` | `Gato` |
    | 289 | `addPet.dog` | `Dog` | `Perro` |
    | 297 | `addPet.name` | `Name` | `Nombre` |
    | 303 | `addPet.petName` | `Pet name` | `Nombre de la mascota` |
    | 311 | `addPet.breed` | `Breed` | `Raza` |
    | 317 | `addPet.optional` | `Optional` | `Opcional` |
    | 325 | `addPet.sex` | `Sex` | `Sexo` |
    | 327 | `addPet.female` | `Female` | `Hembra` |
    | 328 | `addPet.male` | `Male` | `Macho` |
    | 333 | `addPet.size` | `Size` | `Tamaño` |
    | 335 | `addPet.small` | `Small` | `Pequeño` |
    | 336 | `addPet.medium` | `Medium` | `Mediano` |
    | 337 | `addPet.large` | `Large` | `Grande` |
    | 341 | `addPet.medicalDetails` *(ya en español)* | `Medical details` | `Datos médicos` |
    | 344 | `addPet.age` | `Age` | `Edad` |
    | 347 | `addPet.birthDate` | `Birth date` | `Fecha de nacimiento` |
    | 348 | `addPet.approxMonths` | `Approx. months` | `Meses aprox.` |
    | 376 | `addPet.selectBirthDate` | `Select a birth date` | `Elige una fecha de nacimiento` |
    | 386 | `addPet.months` | `Months` | `Meses` |
    | 412 | `addPet.sterilized` | `Sterilized` | `Esterilizado/a` |
    | 414 | `addPet.yes` | `Yes` | `Sí` |
    | 426 | `addPet.optional` | `Optional` | `Opcional` |
    | 440 | `addPet.savePet` | `Save pet` | `Guardar mascota` |··
    ### §2.10 — R10 — Emparejado del collar (40 ocurrencias, 33 claves)·
    **`mobile-pet-tracker/src/screens/pairing/index.tsx`** — 40 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 126 | `pairing.errorInvalidCode` | `Invalid activation code. Check the code printed on the box.` | `Código de activación no válido. Revisa el código impreso en la caja.` |
    | 130 | `pairing.errorAlreadyClaimed` | `This collar is already paired to another pet.` | `Este collar ya está vinculado a otra mascota.` |
    | 133 | `pairing.errorPetHasDevice` | `This pet already has a collar. Unpair it first.` | `Esta mascota ya tiene un collar. Desvincúlalo primero.` |
    | 137 | `pairing.errorNoSubscription` | `This collar has no active plan. Contact support to activate it.` | `Este collar no tiene un plan activo. Contacta con soporte para activarlo.` |
    | 141 | `pairing.errorForbiddenClaim` | `Only the owner can pair a collar.` | `Solo el dueño puede vincular un collar.` |
    | 147 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 151 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 155 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 189 | `pairing.errorForbiddenRelease` | `Only the owner can unpair the collar.` | `Solo el dueño puede desvincular el collar.` |
    | 195 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 199 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 203 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 212 | `pairing.unpairAlertTitle` | `Unpair collar?` | `¿Desvincular collar?` |
    | 213 | `pairing.unpairAlertBody` | `Location history stays, but live tracking stops until you pair a collar again.` | `El historial de ubicaciones se conserva, pero el rastreo en vivo se detiene hasta que vincules otro collar.` |
    | 215 | `pairing.cancel` | `Cancel` | `Cancelar` |
    | 217 | `pairing.unpair` | `Unpair` | `Desvincular` |
    | 238 | `pairing.back` | `Back` | `Volver` ← retirada por #95 (R5) |
    | 267 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 270 | `common.retry` | `Retry` | `Reintentar` |
    | 277 | `pairing.addPetFirst` | `Add a pet first` | `Primero añade una mascota` |
    | 302 | `pairing.trackerIsReady` | `Tracker is ready` | `El collar está listo` |
    | 305 | `pairing.readySubtitle` **(param)** | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 312 | `pairing.model` | `Model` | `Modelo` |
    | 330 | `pairing.viewOnMap` | `View on map` | `Ver en el mapa` |
    | 340 | `pairing.done` | `Done` | `Listo` |
    | 348 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 357 | `pairing.freePlanPairPrompt` | `Free plan — health only. Pair a collar with an active plan to see the map.` | `Plan gratuito — solo salud. Vincula un collar con plan activo para ver el mapa.` |
    | 364 | `pairing.activationCode` | `Activation code` | `Código de activación` |
    | 377 | `pairing.printedOnCollarBox` | `Printed on the collar box` | `Impreso en la caja del collar` |
    | 388 | `pairing.pairCollar` | `Pair collar` | `Vincular collar` |
    | 397 | `pairing.gpsDevice` | `GPS device` | `Dispositivo GPS` |
    | 403 | `pairing.model` | `Model` | `Modelo` |
    | 408 | `pairing.battery` | `Battery` | `Batería` |
    | 417 | `pairing.connection` | `Connection` | `Conexión` |
    | 422 | `pairing.lastMessage` | `Last message` | `Último mensaje` |
    | 429 | `pairing.noMessagesYet` | `No messages yet` | `Sin mensajes todavía` |
    | 453 | `pairing.gpsTrackingActive` | `GPS tracking active` | `Rastreo GPS activo` |
    | 461 | `pairing.freePlanNoActivePlan` | `Free plan — health only. This collar has no active plan.` | `Plan gratuito — solo salud. Este collar no tiene plan activo.` |
    | 468 | `pairing.planStatusUnavailable` | `Plan status unavailable` | `Estado del plan no disponible` |
    | 479 | `pairing.unpairCollar` | `Unpair collar` | `Desvincular collar` |·
    **`mobile-pet-tracker/src/utils/device-connectivity.ts`** — claves añadidas por
    #68, registradas como delta sobre la tabla existente·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `deviceConnectivity.online` | `Online` | `En línea` |
    | — | `deviceConnectivity.unknown` | `Unknown` | `Desconocida` |
    | — | `deviceConnectivity.offline` | `Offline` | `Sin conexión` | ← añadida por #73 (R5)··
    ### §2.11 — R11 — Restablecer contraseña (15 ocurrencias, 11 claves)·
    **`mobile-pet-tracker/src/screens/reset-password/index.tsx`** — 15 ocurrencias·
    | Línea | Clave | `en` | `es` |
    |---|---|---|---|
    | 36 | `resetPassword.errorInvalidToken` | `Reset link is invalid or already used. Request a new one.` | `El enlace no es válido o ya se usó. Solicita uno nuevo.` |
    | 40 | `resetPassword.errorExpiredToken` | `Reset link expired. Request a new one.` | `El enlace caducó. Solicita uno nuevo.` |
    | 46 | `common.cannotReachServer` | `Cannot reach server` | `No se pudo conectar con el servidor` |
    | 50 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 53 | `common.somethingWentWrong` | `Something went wrong` | `Algo salió mal` |
    | 77 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 84 | `resetPassword.errorMissingToken` | `This reset link is incomplete. Open the link from your email again.` | `Este enlace está incompleto. Ábrelo de nuevo desde tu correo.` |
    | 88 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 113 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 120 | `resetPassword.passwordUpdated` | `Password updated` | `Contraseña actualizada` |
    | 128 | `resetPassword.backToSignIn` | `Back to sign in` | `Volver al inicio de sesión` |
    | 151 | `resetPassword.resetPassword` | `Reset password` | `Restablecer contraseña` |
    | 156 | `resetPassword.newPassword` | `New password` | `Nueva contraseña` |
    | 171 | `resetPassword.confirmNewPassword` | `Confirm new password` | `Confirmar nueva contraseña` |
    | 197 | `resetPassword.updatePassword` | `Update password` | `Actualizar contraseña` |··
    **Suma de control**: 29 + 5 + 20 + 19 + 32 + 35 + 35 + 50 + 40 + 40 + 15 = **320** ocurrencias y **252** claves distintas; con las 3 del interruptor (§3.3), **255**.·
    ### §2.12 — La interpolación: los 33 sitios, y cuáles son copy·
    El conteo previo del leader dio **31 plantillas con `${}` en texto visible**.
    El barrido completo —plantillas con `${}` **y** llaves JSX dentro de un nodo de
    texto, que el grep de backticks no ve— da **33 sitios**. De esos, **11 son
    copy** y necesitan una entrada con parámetro; los otros **22 son formateadores
    de unidades o datos** y no entran al catálogo. Enumerados, no estimados:·
    **Los 11 que son copy → entrada con parámetro**·
    | # | Sitio | Hoy | Clave | `en` | `es` |
    |---|---|---|---|---|---|
    | 1 | `home.tsx:48` | `` `Last seen ${new Date(iso).toLocaleString()}` `` | `home.lastSeen` | `Last seen {{date}}` | `Última señal {{date}}` |
    | 2 | `map.tsx:61` | `` `${Math.floor(seconds / 60)}m ago` `` | `map.agoMinutes` | `{{minutes}}m ago` | `hace {{minutes}} min` |
    | 3 | `map.tsx:62` | `` `${Math.floor(seconds / 3600)}h ago` `` | `map.agoHours` | `{{hours}}h ago` | `hace {{hours}} h` |
    | 4 | `profile/index.tsx:87` | `` `${pet.ageMonths} months` `` | `profile.ageMonths` | `{{months}} months` | `{{months}} meses` |
    | 5 | `reminders/index.tsx:305` | `` `· in ${days} days` `` | `reminders.dueInDays` | `· in {{days}} days` | `· en {{days}} días` |
    | 6 | `weight-log.tsx:284` | JSX `BC {entry.bodyCondition}/9` | `weightLog.bodyConditionValue` | `BC {{value}}/9` | `CC {{value}}/9` |
    | 7 | `pairing/index.tsx:305` | JSX `{selectedPet.name}&apos;s collar is paired. GPS tracking is on.` | `pairing.readySubtitle` | `{{petName}}'s collar is paired. GPS tracking is on.` | `El collar de {{petName}} está vinculado. El rastreo GPS está activo.` |
    | 8 | `food.tsx:150` | JSX `{loadedPlan.merKcal} kcal / day` | `food.dailyKcal` | `{{kcal}} kcal / day` | `{{kcal}} kcal / día` |
    | 9 | `food.tsx:156` | JSX `{loadedPlan.dailyGrams} g / day` | `food.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 10 | `meal-schedule.tsx:184` | JSX `{loadedPlan.dailyGrams} g / day` | `mealSchedule.dailyGrams` | `{{grams}} g / day` | `{{grams}} g / día` |
    | 11 | `meal-schedule.tsx:190` | JSX `{loadedPlan.mealsPerDay} meals / day` | `mealSchedule.mealsPerDay` | `{{meals}} meals / day` | `{{meals}} comidas / día` |·
    Los 7 primeros son evidentes: llevan una palabra pegada al número (`ago`,
    `months`, `days`, el genitivo sajón, `Last seen`, `BC`). Los cuatro últimos son
    menos obvios y por eso van explicados: `day` **es una palabra**, no un símbolo.
    Dejarlos como sufijo fijo (`t('food.dayUnit')` pegado detrás del número)
    funcionaría hoy y se rompería el día que un idioma ponga la unidad delante o
    use un separador distinto, y además deja en el catálogo entradas ilegibles
    (` kcal / día` como valor suelto). Se parametrizan: mismo número de entradas y
    copy completa en cada una.·
    > **Validación cruzada de esta lista.** El escaneo de R18 comprueba la
    > ausencia de cada valor del catálogo como **literal entero** en su archivo.
    > Sobre el commit base, ese escaneo encuentra **exactamente estas 11** filas
    > donde el literal entero no existe (porque están partidas por una
    > interpolación) y **ninguna más**. La enumeración de arriba no es una
    > estimación: es la salida de esa comprobación.·
    **Los 22 que no son copy → siguen siendo literales en su formateador**·
    | Sitio | Qué es |
    |---|---|
    | `home.tsx:37, 38` | `` `${minutes}m` `` y `` `${h}h ${m}m` `` — duración, símbolos |
    | `home.tsx:42`, `map.tsx:52` | `` `${km} km` `` — unidad |
    | `home.tsx:228`, `pairing/index.tsx:413` | `` `${pct}%` `` — unidad |
    | `map.tsx:56` | `` `${kmh} km/h` `` — unidad |
    | `health.tsx:36`, `weight-log.tsx:34` | `` `+${v} kg` `` / `` `${v} kg` `` — signo + unidad |
    | `health.tsx:31`, `weight-log.tsx:41`, `add-pet/index.tsx:34` | ISO `YYYY-MM-DD` — **valor**, no texto |
    | `food.tsx:27` | `` `${hh}:${mm}` `` — hora, valor |
    | `health.tsx:224`, `weight-log.tsx:273`, `profile/index.tsx:88` | JSX `{n} kg` — unidad |
    | `food.tsx:209`, `meal-schedule.tsx:221` | JSX `{n} g` — unidad |
    | `meal-schedule.tsx:181` | JSX `{n} kcal` — unidad |
    | `meal-schedule.tsx:276` | JSX `{n} kcal / 100 g` — unidad |
    | `food.tsx:180` | JSX `{servidas}/{total}` — números |
    | `profile/index.tsx:348` | `` `${firstName} ${lastName}` `` — datos del usuario |
    | `add-reminder/index.tsx:159` | `` `${meta.emoji} ${meta.label}` `` — **composición**: el emoji es iconografía (D9) y el `label` ya sale del catálogo |
    | `register.tsx:53` | `` `${a}\\n${b}` `` — concatena mensajes **del backend**; el `\\n` es separador |
    | `weight-chart.tsx:36, 37` | coordenadas SVG |·
    ---·
    ### §2.13 — Añadidos por #78 — Centro de alertas móvil·
    | Línea | Clave | `en` | `es` | Nota |
    |---|---|---|---|---|
    | — | `alerts.title` | `Alerts` | `Alertas` | ← añadida por #78 (R3) · se pinta desde `src/app/_layout.tsx` por #114 (R4)
    | — | `alerts.empty` | `No alerts` | `No hay alertas` | ← añadida por #78 (R3)
    | — | `alerts.ack` | `Mark as read` | `Marcar leída` | ← añadida por #78 (R3)
    | — | `alerts.typeGeofenceExit` | `Left the safe zone` | `Salió de la zona` | ← añadida por #78 (R3)
    | — | `alerts.typeBatteryLow` | `Low battery` | `Batería baja` | ← añadida por #78 (R3)
    | — | `alerts.typeUnknown` | `Notice` | `Aviso` | ← añadida por #78 (R3)
    | — | `alerts.statusAcked` | `Read` | `Leída` | ← añadida por #78 (R3)
    | — | `alerts.statusClosed` | `Resolved` | `Resuelta` | ← añadida por #78 (R3)
    | — | `alerts.justNow` | `Just now` | `Ahora mismo` | ← añadida por #78 (R3)
    | — | `alerts.minutesAgo` **(param)** | `{{minutes}} min ago` | `Hace {{minutes}} min` | ← añadida por #78 (R3)
    | — | `alerts.hoursAgo` **(param)** | `{{hours}} h ago` | `Hace {{hours}} h` | ← añadida por #78 (R3)
    | — | `alerts.daysAgo` **(param)** | `{{days}} d ago` | `Hace {{days}} d` | ← añadida por #78 (R3)
    | — | `home.alertsBell` | `Alerts` | `Alertas` | ← añadida por #78 (R3)
    | — | `home.alertsBellUnread` | `Unread alerts` | `Alertas sin leer` | ← añadida por #78 (R3)·
    ### §2.14 — Añadidos por #100 — Detalle de alerta·
    | — | `alerts.detailTitle` | `Alert` | `Alerta` | ← añadida por #100 (R1)
    | — | `alerts.statusOpen` | `Unread` | `Sin leer` | ← añadida por #100 (R1)
    | — | `alerts.openedAt` **(param)** | `Detected {{date}}` | `Detectada el {{date}}` | ← añadida por #100 (R1)·
    ### §2.15 — Añadidos por #41 — Zonas seguras·
    | Literal | Clave | `en` | `es` |
    |---|---|---|---|
    | — | `geofences.title` | `Safe zones` | `Zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.empty` | `No safe zones yet` | `Aún no hay zonas seguras` | ← añadida por #41 (R1)
    | — | `geofences.needsCollar` | `Safe zones require a collar` | `Las zonas seguras requieren un collar` | ← añadida por #41 (R1)
    | — | `geofences.radius` **(param)** | `{{meters}} m radius` | `Radio de {{meters}} m` | ← añadida por #41 (R1)
    | — | `geofences.activeLabel` **(param)** | `{{name}} zone active` | `Zona {{name}} activa` | ← añadida por #41 (R1)
    | — | `geofences.statusActive` | `Active` | `Activa` | ← añadida por #41 (R1)
    | — | `geofences.statusInactive` | `Inactive` | `Inactiva` | ← añadida por #41 (R1)
    | — | `geofences.delete` | `Delete` | `Eliminar` | ← añadida por #41 (R1)
    | — | `geofences.cancel` | `Cancel` | `Cancelar` | ← añadida por #41 (R1)
    | — | `geofences.deleteTitle` **(param)** | `Delete {{name}}?` | `¿Eliminar {{name}}?` | ← añadida por #41 (R1)
    | — | `geofences.deleteBody` | `You'll stop getting alerts for this zone. This can't be undone.` | `Dejarás de recibir alertas de esta zona. Esta acción no se puede deshacer.` | ← añadida por #41 (R1)·
    ### §2.16 — Añadidos por #146 — Editor de zonas seguras·
    | Pantalla | Clave | en | es | Origen |
    |---|---|---|---|---|
    | — | `geofenceEditor.title` | Safe zone | Zona segura | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameLabel` | Name | Nombre | ← añadida por #146 (R1) |
    | — | `geofenceEditor.mapHint` | Tap the map to move the zone's center. | Toca el mapa para mover el centro de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.radiusLabel` | Zone radius | Radio de la zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.resetNote` | Saving a new center or radius re-evaluates the zone and closes its open alerts. | Al guardar un centro o radio nuevos, la zona se vuelve a evaluar y se cierran sus alertas abiertas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.save` | Save | Guardar | ← añadida por #146 (R1) |
    | — | `geofenceEditor.nameTaken` | You already have a zone with that name. | Ya tienes una zona con ese nombre. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitReached` | This pet already has the maximum number of zones. | Esta mascota ya tiene el máximo de zonas. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.invalid` | Check the zone name and radius. | Revisa el nombre y el radio de la zona. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.notFound` | This pet or zone is no longer available. | La mascota o la zona ya no están disponibles. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.add` | Add zone | Añadir zona | ← añadida por #146 (R1) |
    | — | `geofenceEditor.editLabel` | Edit {{name}} zone | Editar zona {{name}} | ← añadida por #146 (R1) |
    | — | `geofenceEditor.limitNotice` | This pet already has {{max}} zones, the maximum. Delete one to add another. | Esta mascota ya tiene {{max}} zonas, el máximo. Elimina una para añadir otra. | ← añadida por #146 (R1) |
    | — | `geofenceEditor.ownerOnly` | Only the pet's owner can create or edit zones. | Solo el dueño de la mascota puede crear o editar zonas. | ← añadida por #146 (R1) |·
    ### §2.17 — Añadidos por #147 — Horario de comidas editable·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `mealSchedule.addMeal` | `Add meal` | `Añadir comida` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTime` | `Edit` | `Editar` | ← añadida por #147 (R1)
    | — | `mealSchedule.editTimeLabel` **(param)** | `Edit {{time}} meal time` | `Editar horario de las {{time}}` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorInvalidTime` | `That time is not valid` | `La hora no es válida` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorEditForbidden` | `Only the owner can change meal times` | `Solo el dueño puede cambiar los horarios` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorPlanRequired` | `Generate a meal plan first` | `Primero genera un plan de alimentación` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorTimeNotInPlan` | `That meal time is no longer in the plan` | `Ese horario ya no está en el plan` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorDuplicateTime` | `There is already a meal at that time` | `Ya hay una comida a esa hora` | ← añadida por #147 (R1)
    | — | `mealSchedule.errorMealLimit` | `The plan already has the maximum of 6 meals` | `El plan ya tiene el máximo de 6 comidas` | ← añadida por #147 (R1)·
    ### §2.18 — Añadidos por #105 — Historial de comidas·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `food.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `food.mealsHistoryLinkSubtitle` | `See which days meals were served` | `Ver qué días se sirvieron comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.mealsHistory` | `Meals history` | `Historial de comidas` | ← añadida por #105 (R5) |
    | — | `mealsHistory.previousMonth` | `Previous month` | `Mes anterior` | ← añadida por #105 (R5) |
    | — | `mealsHistory.nextMonth` | `Next month` | `Mes siguiente` | ← añadida por #105 (R5) |
    | — | `mealsHistory.emptyMonth` | `No meals were served this month` | `Este mes no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.noMealsOnDay` | `No meals were served this day` | `Ese día no se sirvió ninguna comida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedOne` | `1 meal served` | `1 comida servida` | ← añadida por #105 (R5) |
    | — | `mealsHistory.servedMany` | `{{count}} meals served` | `{{count}} comidas servidas` | ← añadida por #105 (R5) |·
    ### §2.19 — Añadidos por #118 — Bienvenida·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `welcome.brand` | `Pet Tracker` | `Pet Tracker` | ← añadida por #118 (R1) |
    | — | `welcome.chipGps` | `GPS` | `GPS` | ← añadida por #118 (R1) |
    | — | `welcome.chipHealth` | `Health` | `Salud` | ← añadida por #118 (R1) |
    | — | `welcome.chipNutrition` | `Nutrition` | `Nutrición` | ← añadida por #118 (R1) |
    | — | `welcome.tagline` | `Your smart hub for canine wellness, tracking and nutrition` | `Tu centro inteligente de bienestar, rastreo y nutrición canina profesional` | ← añadida por #118 (R1) |
    | — | `welcome.getStarted` | `Get started` | `Comenzar ahora` | ← añadida por #118 (R1) |
    | — | `welcome.haveAccount` | `I already have an account` | `Ya tengo una cuenta` | ← añadida por #118 (R1) |
    | — | `welcome.legalNotice` | `By continuing you accept our Terms and Privacy Policy` | `Al continuar aceptas nuestros Términos y Política de privacidad` | ← añadida por #118 (R1) |·
    ## 3. La infraestructura·
    ### 3.1 Decisiones·
    - **D1 — Sin librería de i18n.** Ni `i18next`, ni `react-intl`, ni `lingui`.
      255 claves × 2 idiomas es un objeto TypeScript; lo que hace falta de una
      librería —resolver una clave, sustituir un parámetro y repintar al cambiar—
      son quince líneas y un contexto de React. El repo ya tiene los dos patrones:
      `src/theme/use-theme-colors.ts` (hook que resuelve por token) y
      `src/providers/selected-pet-provider.tsx` (contexto + `useMemo` + hook que
      lanza fuera del provider). Una librería traería negociación de locale,
      plurales ICU, carga asíncrona de bundles y un `Suspense` que aquí no tienen
      usuario.
    - **D2 — Sin `expo-localization`, y por tanto sin detección del idioma del
      teléfono.** El idioma es **elección explícita** del usuario. Un teléfono en
      inglés en México no dice nada sobre en qué idioma quiere la app, y arrancar
      en inglés a un usuario que espera español es peor que arrancar siempre igual.
      Consecuencia asumida: un usuario anglófono ve la primera pantalla en español
      y tiene que ir a Profile. Si algún día se quiere detectar, **ésa** es la
      decisión que se reabre, y es una feature de tres líneas sobre esta base.
    - **D3 — Español por defecto**, sin pregunta, sin pantalla de bienvenida (R16).
    - **D4 — La persistencia copia `theme-preference.ts` tal cual**: mismo
      `expo-secure-store` (ya instalado, `~57.0.1`), misma forma de dos funciones,
      mismo `try/catch` que traga, misma validación del valor leído. Si el
      almacenamiento falla, `getStoredLanguage()` devuelve `undefined` y la app
      arranca en español (R13). **No se añade ninguna dependencia.**
    - **D5 — El idioma vive en un contexto de React, el tema no.** El tema usa
      `Uniwind.setTheme`, un store fuera de React con su propio repintado nativo;
      el idioma no puede usar eso porque no es CSS. Contexto + `useState` es lo
      correcto y además da gratis lo que pide R14: repintar sin desmontar.·
    ### 3.2 Los tres módulos nuevos·
    ```
    mobile-pet-tracker/src/i18n/catalog.ts               ← las 255 claves × 2
    mobile-pet-tracker/src/providers/language-provider.tsx ← contexto + t + locale
    mobile-pet-tracker/src/utils/language-preference.ts  ← persistencia (clon de theme-preference)
    ```·
    **`src/i18n/catalog.ts`** — el `en` es la fuente del tipo, y `es` se declara
    como `Record<TranslationKey, string>`, de modo que **falta o sobra una clave y
    TypeScript rompe la compilación antes que el test**:·
    ```ts
    export const en = {
      'common.somethingWentWrong': 'Something went wrong',
      'login.signIn': 'Sign in',
      'home.lastSeen': 'Last seen {{date}}',
      // … 255
    } as const;·
    export type TranslationKey = keyof typeof en;
    export const es: Record<TranslationKey, string> = {
      'common.somethingWentWrong': 'Algo salió mal',
      'login.signIn': 'Iniciar sesión',
      'home.lastSeen': 'Última señal {{date}}',
      // … 255
    };
    export const LOCALES = { es: 'es-MX', en: 'en-US' } as const;
    export type Language = keyof typeof LOCALES;
    export const DEFAULT_LANGUAGE: Language = 'es';
    ```·
    El tipo cubre la paridad de **claves**; el test de R12 cubre lo que el tipo no
    puede: la paridad de **marcadores `{{…}}`** por clave (que `es` no se deje un
    `{{date}}` que `en` sí tiene, lo que dejaría un hueco en pantalla).·
    **`src/providers/language-provider.tsx`** — mismo esqueleto que
    `selected-pet-provider.tsx`:·
    ```ts
    export function LanguageProvider({ initial, children }: { initial: Language; children: ReactNode })
    export function useLanguage(): { language: Language; setLanguage: (l: Language) => void }
    export function useTranslate(): (key: TranslationKey, params?: Record<string, string | number>) => string
    export function useLocale(): string   // LOCALES[language]
    ```·
    `t` resuelve `catalog[language][key]` y sustituye cada `{{nombre}}` por
    `params[nombre]`. **Si falta un parámetro deja el marcador tal cual** en vez de
    lanzar: un descuido debe verse feo, no tumbar la pantalla. `setLanguage`
    actualiza el estado **y** llama a `setStoredLanguage` sin esperarlo (`void`),
    igual que `useThemeTransition` hace con `setStoredTheme`.·
    **`src/utils/language-preference.ts`** — clon literal de
    `theme-preference.ts` con `LANGUAGE_PREFERENCE_KEY = 'language_preference'` y
    `value === 'es' || value === 'en'`.·
    **Montaje en `src/app/_layout.tsx`** — el layout **ya** espera a
    `getStoredTheme()` antes de renderizar nada (`if (!themeReady) return <></>`).
    El idioma se lee **en ese mismo `useEffect`**, con un `Promise.all`, y se
    guarda en un estado que alimenta el `initial` del provider. **No se añade un
    segundo gate ni un segundo render en blanco**: la app ya no pinta nada hasta
    que el tema está listo, y leer una clave más de SecureStore es del mismo orden.·
    ### 3.3 Las 3 claves del interruptor (copy nueva, no está en `copy-review`)·
    | Clave | `en` | `es` | Dónde |
    |---|---|---|---|
    | `profile.languageSpanish` | `Español` | `Español` | etiqueta del botón cuando el idioma vigente es `en` |
    | `profile.languageEnglish` | `English` | `English` | etiqueta del botón cuando el idioma vigente es `es` |
    | `profile.changeLanguage` | `Change language` | `Cambiar idioma` | `accessibilityLabel` del botón |·
    Las dos primeras **valen lo mismo en los dos idiomas a propósito**: son
    endónimos. Un menú de idiomas que traduce los nombres de los idiomas
    («Spanish» / «Español» según dónde estés) es justo lo que impide a alguien
    salir de un idioma que no entiende. Entran igualmente al catálogo para que la
    regla «cero copy suelta» de R18 no tenga excepciones.·
    **La forma del control es la del `theme-toggle`, no una lista.** El
    `theme-toggle` es un `Button` cuya etiqueta nombra el estado al que iría
    (`Use dark theme`). El de idioma hace lo mismo: con dos idiomas, un botón que
    dice `English` y te lleva a inglés es más corto de entender que un selector, y
    son cero componentes nuevos. Si algún día hay un tercer idioma, **ahí** se
    cambia a un `Picker` de `@expo/ui/community/picker`, y no antes.·
    ### 3.4 Repintar sin reiniciar, y qué pasa con las pantallas abiertas·
    `setLanguage` es un `setState` del provider. React vuelve a renderizar el
    árbol; **no lo desmonta**. Consecuencias, todas queridas:·
    - **El estado local sobrevive**: el formulario a medio llenar de
      `add-reminder` (sus nueve `useState`), el código escrito en `pairing`, la
      mascota seleccionada, la posición del scroll y los datos ya cargados por
      `useApi`. Nada se refetchea.
    - **Los textos ya renderizados cambian** porque todos salen de `t`, que depende
      del contexto. Los que **no** cambian son los que ya estaban fuera del
      catálogo: los mensajes de error del backend que hay en pantalla en ese
      momento (siguen en inglés, §7.1) y los valores de enum de la API (§7.2).
    - **Una `Alert.alert` abierta no cambia**: su texto se resolvió al abrirla.
      Es correcto —el diálogo nativo ya está en pantalla— y por eso R10 exige que
      los textos de la alerta se resuelvan **en el momento de la llamada**, no en
      una constante de módulo.
    - **Sin animación.** El tema tiene un *fade* nativo opcional
      (`withThemeTransition`, #58); el idioma **no lo lleva**: cambiar el idioma no
      es un cambio de superficie y meter Reanimated aquí sería añadir motion no
      pedido, contra el invariante de [[requirements]].·
    ### 3.5 Las tres tablas de constantes que hoy guardan texto·
    Son el único sitio donde el texto se congela en tiempo de import y por eso no
    bastaría con envolverlas en `t`. Dejan de guardar texto y guardan **la clave**:·
    | Constante | Archivo | Hoy | Después |
    |---|---|---|---|
    | `TABS` | `src/components/floating-tab-bar.tsx:48-54` | `{ name, label: 'Home', Icon }` | `{ name, labelKey: 'tabs.home', Icon }`, y el `<Text>` renderiza `t(labelKey)` |
    | `REMINDER_TYPE_META` | `src/utils/reminder-meta.ts:3-14` | `{ label: 'Vaccine', emoji: '💉' }` | `{ labelKey: 'reminderType.vaccine', emoji: '💉' }` — **las 7 claves del `Record<ReminderType, …>` y los 7 emoji no se tocan** |
    | `ADVANCE_OPTIONS` | `src/screens/add-reminder/index.tsx:20-25` | `{ minutes: 0, label: 'Same day' }` | `{ minutes: 0, labelKey: 'addReminder.advanceSameDay' }` — **los 4 valores de `minutes` no se tocan** |·
    Los dos consumidores de `REMINDER_TYPE_META` (`reminders/index.tsx:278` y
    `add-reminder/index.tsx:159`) pasan de `meta.label` a `t(meta.labelKey)`. En
    `add-reminder:159` la plantilla `` `${meta.emoji} ${meta.label}` `` pasa a
    `` `${meta.emoji} ${t(meta.labelKey)}` ``: sigue siendo composición, no copy
    (§2.12).·
    ### 3.6 Fechas y números: se atan al idioma elegido·
    **Decisión: sí.** Hoy las 7 llamadas a `toLocale*` van sin argumento, así que
    siguen el locale **del sistema**, que puede no coincidir con el idioma elegido:
    un teléfono en inglés con la app en español pinta `9/4/2026` junto a
    `Última señal`. Eso se ve, y es exactamente el tipo de mezcla que esta feature
    viene a eliminar. Se pasa el locale explícito de `useLocale()`
    (`es-MX` / `en-US`):·
    | Archivo | Línea | Llamada |
    |---|---:|---|
    | `src/app/(tabs)/home.tsx` | 48 | `new Date(iso).toLocaleString()` — dentro de `fmtLastSeen`, que pasa a recibir el locale |
    | `src/screens/profile/index.tsx` | 293 | `new Date(pet.lastCommunicationAt).toLocaleString()` |
    | `src/screens/pairing/index.tsx` | 428 | `new Date(...lastMessageAt).toLocaleString()` |
    | `src/screens/reminders/index.tsx` | 294 | `new Date(reminder.dueAt).toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 196 | `date.toLocaleDateString()` |
    | `src/screens/add-reminder/index.tsx` | 212 | `time.toLocaleTimeString([], { hour, minute })` — el `[]` pasa a ser el locale |
    | `src/screens/add-pet/index.tsx` | 376 | `birthDate.toLocaleDateString()` |·
    `es-MX` porque el mercado del brief es Perú/México/Colombia y México es el
    mayor de los tres (el diseño usa prefijos `+52`); `en-US` como su contrapartida
    natural. Son dos constantes en `catalog.ts`, no una tabla de países.·
    **Riesgo declarado**: si el motor no tiene datos de ese locale, `Intl` degrada
    al locale por defecto **sin lanzar** — el comportamiento es exactamente el de
    hoy, así que el peor caso de este cambio es «no mejora», nunca «rompe». Hermes
    en RN 0.86 (Expo SDK 57) trae `Intl` con datos, así que se espera que mejore.·
    **Los tests no se rompen por esto**: los que asertan fechas las recalculan con
    la misma llamada (`home.test.tsx:583`), así que basta con que pasen el mismo
    locale. Los formatos numéricos de la app (`toFixed`, `%`, `kg`) no usan `Intl`
    y no cambian: `toLocaleString` de números **no se introduce aquí** — eso sería
    cambiar cómo se ven todas las cifras, y no lo pide nadie.·
    ---·
    ## 4. Los tests·
    ### 4.1 El fixture y el escaneo·
    Dos ficheros nuevos del lado de test:·
    - `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` — la **tabla de uso**:
      qué clave se usa en qué archivo, transcrita de §2.·
      ```ts
      export type UseRow = { file: string; key: TranslationKey };
      export const R1_AUTH: UseRow[] = [ /* 29 */ ];
      // … R2 5, R3 20, R4 19, R5 32, R6 35, R7 35, R8 50, R9 40, R10 40, R11 15
      export const ALL_USES: UseRow[] = [...]; // 320
      ```·
    - `mobile-pet-tracker/src/__tests__/ui-language.test.ts` — un `describe` por
      R-id, todos sobre el mismo helper:·
      ```ts
      const norm = (s: string) => s.replace(/\\s+/g, ' ').trim();
      function checkUses(uses: UseRow[]) {
        for (const { file, key } of uses) {
          const src = readFileSync(join(SRC, file), 'utf8');
          expect(src).toContain(`t('${key}'`);          // (a) resuelve por clave
        }
      }
      function checkNoLooseCopy(files: string[]) {      // (b) cero copy suelta
        for (const file of files) {
          const src = readFileSync(join(SRC, file), 'utf8');
          for (const value of [...Object.values(en), ...Object.values(es)]) {
            if (value.includes('{{')) continue;         // (c) las 11 con parámetro
            expect(wholeLiterals(src)).not.toContain(norm(value));
          }
        }
      }
      ```·
      `wholeLiterals(src)` extrae **cadenas entrecomilladas completas** y **nodos
      de texto JSX completos**, normaliza espacios y devuelve la lista. La
      comparación es de **igualdad**, no de subcadena, y eso es lo que hace que
      **no haga falta ninguna lista de excepciones**: `className` no es igual a
      `Name`, `\"email-address\"` no es igual a `Email`, `WeightChart` no es igual a
      `Weight`. Verificado sobre las 274 parejas *(archivo, cadena)* del commit
      base: la igualdad por literal entero coincide con el conteo de copy en
      **todas** salvo las 11 con interpolación, que quedan cubiertas por (a).·
      Patrón de escaneo de fuente ya usado en el repo:
      `src/__tests__/design-drift.test.ts`,
      `src/__tests__/consistency-classnames.test.ts`,
      `src/__tests__/legibility-classnames.test.ts` y
      `src/__tests__/hosting-artifacts.test.ts` (este último ya asevera sobre
      archivos de fuera de `mobile-pet-tracker/`, que es lo que necesita R19).·
    ### 4.2 En qué idioma corren los tests: en **español**, el de por defecto·
    **Decisión: los ~178 tests de pantalla corren en español** y siguen aseverando
    la cadena visible tal cual (`getByText('Iniciar sesión')`), sin envolver nada.·
    Tres razones:·
    1. **El español es lo que ve el usuario por defecto.** La suite prueba lo que
       se envía, no una configuración que casi nadie tendrá.
    2. **Repetir los 178 asserts en inglés no descubre nada nuevo.** Lo que puede
       romperse del inglés es *que falte una clave o un parámetro*, y eso lo
       demuestra el test de R12 —paridad de claves por tipo, paridad de marcadores
       por test— sobre las 255 entradas de golpe, no 178 renders.
    3. **El coste del alternativo es real**: los 19 ficheros de test tienen su
       propio `renderX()`, así que correr en dos idiomas pide un parámetro de
       idioma en 19 helpers, ~178 aserciones duplicadas y un fixture con las dos
       columnas por ancla. Es más de la mitad del trabajo de la feature para
       confirmar lo que el tipo ya garantiza.·
    **Lo que sí se prueba en inglés**, para que la columna no sea decorativa: el
    test de R14 cambia el idioma y comprueba que **la pantalla se repinta en
    inglés**, con al menos **seis** aserciones que cubren los seis tipos de copy —
    título de pantalla, etiqueta de pestaña, botón, mensaje de error, estado vacío
    y `placeholder`—. Seis renders en inglés, no 178.·
    > Si el humano prefiere la suite en los dos idiomas, es una enmienda a esta
    > spec antes del handoff, y el coste está arriba, medido.·
    ### 4.3 Los 6 `testID` nuevos de R17·
    Los `describe('#62 R5: el título de card usa un único tratamiento')` localizan
    un nodo **por su texto** para después aseverar su `props.className`. El texto
    ahí es un *localizador*, no lo que se prueba: anclarlo a la copy es el
    acoplamiento que encarece esta feature.·
    | Archivo de fuente | Línea | Nodo | `testID` nuevo | Test que lo consume |
    |---|---:|---|---|---|
    | `src/app/(tabs)/home.tsx` | 255 | título `home.summaryTitle` | `summary-card-title` | `home.test.tsx:771` |
    | `src/app/(tabs)/health.tsx` | 217 | título `health.weight` | `weight-card-title` | `health.test.tsx:612` |
    | `src/app/(tabs)/food.tsx` | 174 | título `food.mealsToday` | `food-meals-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 259 | título `food.aiRecommendation` | `food-ai-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/food.tsx` | 296 | título `food.mealSchedule` | `meal-schedule-link-title` | `food.test.tsx:521` |
    | `src/app/(tabs)/meal-schedule.tsx` | 269 | título `mealSchedule.nutritionProfile` | `nutrition-profile-title` | `meal-schedule.test.tsx:460` |·
    Cambios exactos: `home.test.tsx:771`, `health.test.tsx:612` y
    `meal-schedule.test.tsx:460` pasan de `findByText('…')` a
    `findByTestId('<id>')`, con la aserción de `className` **idéntica byte a
    byte**; `food.test.tsx:521-522` cambia su `it.each` de las tres cadenas a los
    tres `testID`, `findByText(title)` a `findByTestId(testID)`, y el título del
    `it` de `'aplica la receta canónica a %s'` a
    `'aplica la receta canónica al título %s'`.·
    **No se pierde ni una aserción de copy.** Cuatro de las seis cadenas siguen
    asertadas en otro sitio (`Resumen de hoy` en `home.test.tsx:453`, `Peso` en
    `health.test.tsx:460`, `Recomendación IA` en `food.test.tsx:426`,
    `Perfil nutricional` en `meal-schedule.test.tsx:240`); las **2** que se
    quedarían sin cubrir —`Comidas hoy` y `Horario de comidas`— se reponen con dos
    `getByText` en el test que ya renderiza el plan de `food`. Neto: **246 → 244**
    llamadas de texto (−4 migradas, +2 nuevas) y **796 → ≥800** consultas por
    `testID` (+4 migradas, +1 `language-toggle`, y `≥` porque los tests de R14 y
    R17 añaden alguna más).·
    **Ningún otro ancla se migra.** Las otras 172 comprueban *el texto que se
    muestra*, que es justo lo que esta feature cambia. Convertirlas a `testID`
    borraría la aserción, no la desacoplaría.·
    ### 4.4 Los 6 títulos de test que citan copy y hay que actualizar·
    | Fichero | Línea | Actual | Nuevo |
    |---|---:|---|---|
    | `src/app/(tabs)/__tests__/health.test.tsx` | 609 | `aplica la receta canónica a Weight` | `… a Peso` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 919 | `muestra mensaje y Retry cuando last devuelve error` | `… y Reintentar …` |
    | `src/app/(tabs)/__tests__/map.test.tsx` | 935 | `Retry llama al refetch de last y recupera el mapa` | `Reintentar llama al refetch …` |
    | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` | 450 | `aplica la receta canónica a Nutrition profile` | `… a Perfil nutricional` |
    | `src/app/(tabs)/__tests__/food.test.tsx` | 522 | `aplica la receta canónica a %s` | `aplica la receta canónica al título %s` |
    | `src/screens/pairing/index.test.tsx` | 413 | `R7: … muestra \"Tracker is ready\" …` | `… muestra \"El collar está listo\" …` |·
    Los otros ~44 títulos en inglés se quedan: [[requirements]] §Fuera de alcance 10.·
    ---·
    ## 5. Archivos afectados·
    Todo es capa de **presentación** de la app móvil. `backend-pet-tracker/` **no
    se abre en ningún commit**.·
    **Fuente, nuevos (3)** — `src/i18n/catalog.ts`,
    `src/providers/language-provider.tsx`, `src/utils/language-preference.ts`.·
    **Fuente, modificados (21)** — los 19 de §1.3, más `src/app/_layout.tsx`
    (montaje del provider, §3.2) y `src/utils/reminder-meta.ts` ya contado en los
    19. En total: los 19 con copy + `_layout.tsx`.·
    **Tests nuevos (3)** — `src/__tests__/ui-copy-table.ts` (fixture),
    `src/__tests__/ui-language.test.ts`,
    `src/providers/__tests__/language-provider.test.tsx`,
    `src/utils/language-preference.test.ts`.·
    **Tests que se actualizan (19 + 2)** — los 19 de §1.4, más
    `src/app/__tests__/layout.test.tsx` (R16) y
    `src/screens/profile/index.test.tsx` (R14, además de sus 3 anclas).·
    **Docs y specs (10)** — `docs/ui-guidelines.md` (R20) y las 9 specs de §6.1
    (R19).·
    **No se tocan**: `mobile-pet-tracker/src/theme/` (incluido `global.css`),
    `src/api/`, `src/hooks/`, `app.json`, `package.json`, `hosting/`,
    `backend-pet-tracker/`, `infra/`.·
    ---·
    ## 6. Gobernanza·
    ### 6.1 Las 9 specs aprobadas que ratificaron el inglés·
    El informe nombraba **6**. El barrido de `specs/` encuentra **9**: las 6 más 3
    que el informe no listó, en las listas de «decisiones menores objetables en
    este gate» de #35, #36 y #37, que son ratificación igual.·
    | # | Fichero | Línea | Frase que ratifica el inglés |
    |---|---|---:|---|
    | 1 | `specs/mobile-auth/requirements.md` | 248 | «Decisiones menores objetables en este gate: … **copy en inglés**, `headerShown: false` global (§D5).» |
    | 2 | `specs/mobile-home-dashboard/requirements.md` | 309 | «… **textos en inglés** (`Free`, `No pets yet`, etc.) …» |
    | 3 | `specs/mobile-map-live/requirements.md` | 285 | «Menores objetables: … **textos en inglés**, botón Lost Mode con `Coming soon` …» |
    | 4 | `specs/mobile-health/requirements.md` | 379-380 | «Menores objetables: … **textos en inglés**, vencidas en `text-danger` sin badge.» |
    | 5 | `specs/mobile-food/design.md` | 197-200 | «**D8 — Idiomas.** Textos de UI **en inglés** (consistencia con Home/Map/Health). Los `warnings[].message` del backend llegan en español y se muestran tal cual …» |
    | 6 | `specs/mobile-food/requirements.md` | 332 | «Menores (… **UI en inglés** con warnings del backend en español tal cual …): sin objeción, quedan como están.» |
    | 7 | `specs/mobile-reminders/requirements.md` | 64-65 | «**UI en inglés** (decisión de #38 vigente); el diseño está en español, los literales de esta spec son los normativos.» |
    | 8 | `specs/auth-reset-deep-link/design.md` | 182-183 | «**Copy de la app en inglés**, como el resto de pantallas.» |
    | 9 | `specs/mobile-device-pairing/design.md` | 202-228 | «**### D7 — Copy: inglés, strings exactos**» + una tabla de **18 filas** de «Texto exacto» que fija literalmente `Pair collar`, `Free plan — health only…`, `Activation code`, `Tracker is ready`, `Unpair collar?`… Es la ratificación más fuerte: no dice «en inglés», enumera los strings |·
    **Dos notas de aplazamiento que NO son ratificación y no necesitan gate**:
    `specs/mobile-ui-legibility-polish/requirements.md:286` (#61) y
    `specs/mobile-ui-consistency-polish/requirements.md:343` (#62) listan «unificar
    el idioma de la UI» como **fuera de alcance**. Aplazar no es ratificar, y esta
    feature es la que cierra el aplazamiento.·
    ### 6.2 La enmienda concreta (texto literal a insertar)·
    **El tono cambia respecto de una traducción a secas, y es importante**: con el
    catálogo, **el literal inglés que esas specs fijaron no desaparece**. Se mueve
    a la columna `en` y sigue siendo lo que ve un usuario que elija inglés. La
    enmienda no revoca sus strings: los **reubica** y cambia el idioma **por
    defecto**.·
    **(a)** En la línea que ratifica el inglés (columna «Línea» de §6.1), marcar la
    frase y apuntar al bloque. Una forma por caso:·
    - #1, #2, #3, #4, #6 (listas de menores): `copy en inglés` →
      `~~copy en inglés~~ copy en los dos idiomas desde #65, español por defecto (ver §Enmienda #65)`
      — y equivalentes para `textos en inglés` / `UI en inglés`.
    - #5: `- **D8 — Idiomas.**` →
      `- **D8 — Idiomas.** ~~Textos de UI en inglés (consistencia con Home/Map/Health).~~ **Enmendado por #65: los textos de UI viven en el catálogo de dos idiomas; el inglés de esta spec es la columna `en` y el español por defecto es la `es` (ver §Enmienda #65).**`
      El resto de D8 —los `warnings[].message` del backend en español, mostrados
      tal cual— **sigue vigente y no se toca**: es justo lo que R6 conserva, y en
      los dos idiomas.
    - #7: `UI en inglés (decisión de #38 vigente)` →
      `~~UI en inglés (decisión de #38 vigente)~~ **UI en catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65)**; los literales de esta spec pasan a ser la columna `en` de su clave.`
    - #8: `Copy de la app en inglés, como el resto de pantallas.` →
      `~~Copy de la app en inglés, como el resto de pantallas.~~ **Copy de la app en el catálogo de dos idiomas desde #65, español por defecto (ver §Enmienda #65).**`
    - #9 (la que más cambia de tono): el encabezado
      `### D7 — Copy: inglés, strings exactos` pasa a
      `### D7 — Copy: strings exactos, ahora en dos idiomas (enmendado por #65)` y,
      justo debajo de la tabla de 18 filas, se inserta:
      `> **Enmendada por #65.** Los 18 «Texto exacto» de esta tabla **siguen siendo normativos**: son la columna `en` de su clave en `specs/mobile-ui-language/design.md` §2.10, y un usuario que elija inglés los sigue viendo palabra por palabra. Lo que cambia es que ya no son el único idioma y que el idioma por defecto es español; el texto que ve ese usuario está en la columna `es` de la misma fila. Los testID de esta tabla no cambian.`·
    **(b)** Al final de cada uno de los 9 ficheros, antes de `## Aprobación` si lo
    hay, insertar **este bloque, literal**, sustituyendo `<FEATURE>` por el nombre
    de la carpeta de esa spec:·
    ```markdown
    ## Enmienda #65 — idioma de la UI·
    El 2026-09-04 el humano decidió que la UI móvil va en español, y el 2026-09-05
    que la feature sea un **catálogo de dos idiomas con interruptor en Profile y
    español por defecto** (`progress/explore_design-gap-vs-make.md` §4, decisión A
    y su ampliación). Esta spec ratificó el inglés en su día; esa parte queda
    **enmendada**.·
    - **Qué cambia**: el literal de UI que esta spec fija deja de estar escrito en
      la pantalla y pasa a resolverse por clave contra el catálogo. El idioma por
      defecto es el español.
    - **Qué NO cambia**: **el literal inglés de esta spec sigue siendo normativo**
      como columna `en` de su clave — un usuario que elija inglés lo sigue viendo
      palabra por palabra. Y no cambia ningún requisito `R<n>`, ningún `testID`,
      ninguna conducta, ningún contrato de API ni ninguna decisión visual. La
      trazabilidad `R-id ↔ test` de `<FEATURE>` sigue siendo válida.
    - **Fuente única del literal y de la clave**:
      `specs/mobile-ui-language/design.md` §2. Si esta spec y esa tabla discrepan,
      **manda la tabla**.
    - **Los mensajes de validación del backend siguen en inglés en los dos
      idiomas** y esta enmienda no los toca
      (`specs/mobile-ui-language/requirements.md` §Fuera de alcance 1).·
    - [ ] Enmienda aprobada por humano (fecha: ____)
    ```·
    La casilla la marca **el humano**, en el mismo gate que aprueba esta spec.
    Ningún agente la marca (`AGENTS.md` §3).·
    ### 6.3 Texto literal para `docs/ui-guidelines.md` (lo escribe R20)·
    Se añade como punto **6** de §Dirección de arte, después de «5. Fidelidad no es
    pérdida de información»:·
    ```markdown
    **6. Idioma: catálogo de dos idiomas, español por defecto.** Decidido por el
    humano el 2026-09-04 (español) y el 2026-09-05 (catálogo + interruptor), y
    ejecutado por la feature #65. **Ninguna pantalla escribe texto**: todo lo que
    ve el usuario —títulos, etiquetas, placeholders, `accessibilityLabel`,
    mensajes de error, botones de `Alert`— se resuelve con `t('<ámbito>.<clave>')`
    contra `mobile-pet-tracker/src/i18n/catalog.ts`. Toda spec que introduzca copy
    nueva **añade su clave en los dos idiomas** en el mismo gate y la registra en
    la tabla de `specs/mobile-ui-language/design.md` §2; una clave que exista en un
    idioma y no en el otro no compila. Donde el diseño del Make da la palabra en
    español se usa **la del diseño**. **No hay librería de i18n y no se instala
    una**, ni `expo-localization`: el idioma es elección explícita del usuario en
    Profile, no detección del idioma del teléfono. Las fechas y las horas siguen al
    idioma elegido (`es-MX` / `en-US`), no al locale del sistema.·
    Tres corolarios que nadie debe confundir con lo anterior:·
    - **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
      ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
      los mensajes de commit también (`docs/conventions.md` §Commits).
    - **El backend sigue devolviendo validaciones en inglés, en los dos idiomas.**
      Se ve en `login-error`, `register-*-error`, `weight-form-error` y
      `reset-error`, porque son mensajes de Zod de `backend-pet-tracker/`.
      Traducirlos es una feature de backend. Al revés, las advertencias
      nutricionales del backend ya llegan en español y se muestran tal cual — y en
      inglés también, porque tampoco se traducen.
    - **Los valores de enum que la API devuelve se pintan crudos**: `pet.sex`,
      `document.type`, `foodType`, `activityLevel`. Siguen en inglés en los dos
      idiomas. Mapearlos es cambio de conducta y va a feature propia.
      `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
      resuelve por catálogo en `src/utils/device-connectivity.ts`.
    ```·
    ---·
    ## 7. Alternativas descartadas·
    - **Traducir los 309 literales en el sitio ahora y añadir el interruptor
      después.** Descartado por el humano el 2026-09-05 con la cuenta hecha: son
      los mismos 309 sitios y las mismas 178 anclas **dos veces**. Metido dentro,
      el número de ediciones es idéntico y solo cambia con qué se sustituye.
    - **Instalar `i18next` / `react-intl` / `lingui`.** §3.1 D1: 255 claves × 2
      idiomas es un objeto y un contexto, y el repo ya tiene los dos patrones.
    - **`expo-localization` para detectar el idioma del teléfono.** §3.1 D2: el
      idioma es elección explícita. Es la decisión que se reabre si algún día se
      quiere, y son tres líneas sobre esta base.
    - **Catálogo plano, una clave por cadena inglesa (213 claves).** Descartado en
      §2.0 D2: colisiona `Food` (pestaña `Nutrición`) con `Food` (tipo de
      recordatorio `Comida`) y obliga a elegir una sola traducción para dos cosas
      distintas.
    - **Claves derivadas del español.** Descartado en §2.0 D1: el español es lo que
      el humano puede cambiar en la revisión, y renombrar claves cada vez que se
      ajusta una palabra es churn puro. Además el idioma del código es el inglés.
    - **Claves anidadas (`login.form.email`).** Dos niveles no aportan nada con 255
      claves y complican el tipo `TranslationKey`.
    - **Un selector de idioma con lista o `Picker`.** Descartado en §3.3: con dos
      idiomas, un botón que dice `English` es más corto de entender y son cero
      componentes nuevos. El `Picker` entra cuando entre el tercer idioma.
    - **Una pantalla de ajustes.** No existe hoy; crearla no entra aquí (decisión
      del humano del 2026-09-05).
    - **Correr la suite en los dos idiomas.** §4.2, con el coste medido: parámetro
      de idioma en 19 helpers, ~178 aserciones duplicadas, fixture con dos
      columnas por ancla. Lo que descubriría —que falta una clave o un parámetro—
      lo demuestra el tipo y el test de R12 sobre las 255 entradas de golpe.
    - **Dejar las fechas con el locale del sistema.** §3.6: se ve, y es la misma
      mezcla que la feature elimina. El peor caso del cambio es «no mejora».
    - **Motor de plurales / ICU.** No hay ni un plural que se rompa en el catálogo
      (`{{days}} días` funciona con 1 y con 5). Infraestructura sin usuario.
    - **Animar el cambio de idioma** con `withThemeTransition`. §3.4: no es un
      cambio de superficie y sería motion no pedido.
    - **Reescribir los literales dentro de las 9 specs aprobadas.** §6.2:
      duplicaría el catálogo en nueve sitios y garantizaría la deriva. El bloque de
      enmienda deja **una** fuente de verdad — y además, con el catálogo, esos
      literales **siguen siendo válidos** como columna `en`.
    - **Migrar a `testID` todas las anclas de texto.** §4.3: 172 de las 178
      comprueban *el texto que se muestra*. Cambiarlas borraría la aserción.
    - **Mapear los 5 enums de la API de paso.** Cambio de conducta sobre datos.
      Declarado en [[requirements]] §Fuera de alcance 2 con sus 5 sitios exactos,
      para que la brecha se vea y no se descubra en el smoke.
    "

      427 |   it('registra la clave en la tabla de mobile-ui-language', () => {
      428 |     const design = readFileSync(join(process.cwd(), '..', 'specs', 'mobile-ui-language', 'design.md'), 'utf8');
    > 429 |     expect(design).toContain('### §2.20 — Añadidos por #153 — Pingo en la bienvenida');
          |                    ^
      430 |     expect(design).toMatch(new RegExp('\\| — \\| `welcome\\.pingoGreeting`[^\\n]*← añadida por #153 \\(R1\\)'));
      431 |   });
      432 | });

      at Object.toContain (src/screens/welcome/index.test.tsx:429:20)

```

```text
$ FORCE_COLOR=0 bunx jest src/providers/__tests__/language-provider.test.tsx > /tmp/153-r4-lp.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 23 passed, 24 total
exit=1
```

Detalle de cada it rojo (matcher y Expected/Received, consulta o ENOENT):

```text
  ● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas

    expect(received).toHaveLength(expected)

    Expected length: 366
    Received length: 365
    Received array:  ["addPet.addPet", "addPet.age", "addPet.approxMonths", "addPet.avatarPreview", "addPet.basicDetails", "addPet.birthDate", "addPet.breed", "addPet.cat", "addPet.checkPetDetails", "addPet.chooseBirthDate", …]

      53 |     const spanishKeys = Object.keys(es).sort();
      54 |
    > 55 |     expect(englishKeys).toHaveLength(
         |                         ^
      56 |       260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11 + 12 + 2 + 9 + 9 // #105 R5
      57 |         + 6 - 1 // #117 R1
      58 |         + 8 // #118 R1

      at Object.toHaveLength (src/providers/__tests__/language-provider.test.tsx:55:25)

```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +3 failed, 34 passed, 37 total$' /tmp/153-r4.txt \
&& grep -qE '^Tests: +1 failed, 23 passed, 24 total$' /tmp/153-r4-lp.txt \
&& ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r4.txt /tmp/153-r4-lp.txt \
&& test ! -e .expo/types/router.d.ts \
&& { bun run typecheck > /tmp/153-r4-tsc.txt 2>&1 || true; } \
&& test "$(grep -c 'error TS' /tmp/153-r4-tsc.txt)" = "$(grep -cE '^src/screens/welcome/index\.test\.tsx\([0-9]+,[0-9]+\): error TS7053:' /tmp/153-r4-tsc.txt)" \
&& bun run lint \
&& git add src/screens/welcome/index.test.tsx src/providers/__tests__/language-provider.test.tsx \
&& test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/welcome/index.test.tsx ' \
&& git commit -m 'test(mobile-welcome): #153 R1 red pingo greeting copy'
```

```text
[feature/153-mobile-welcome-pingo 1a363846] test(mobile-welcome): #153 R1 red pingo greeting copy
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 24 insertions(+), 1 deletion(-)
$ expo lint
cadena exit=0
```

Typecheck rojo acotado (salida del comando del handoff con || true):

```text
$ tsc --noEmit
src/screens/welcome/index.test.tsx(416,12): error TS7053: Element implicitly has an 'any' type because expression of type '"welcome.pingoGreeting"' can't be used to index type '{ readonly 'login.invalidCredentials': "Invalid credentials"; readonly 'common.cannotReachServer': "Cannot reach server"; readonly 'common.somethingWentWrong': "Something went wrong"; ... 361 more ...; readonly 'welcome.legalNotice': "By continuing you accept our Terms and Privacy Policy"; }'.
  Property 'welcome.pingoGreeting' does not exist on type '{ readonly 'login.invalidCredentials': "Invalid credentials"; readonly 'common.cannotReachServer': "Cannot reach server"; readonly 'common.somethingWentWrong': "Something went wrong"; ... 361 more ...; readonly 'welcome.legalNotice': "By continuing you accept our Terms and Privacy Policy"; }'.
src/screens/welcome/index.test.tsx(417,12): error TS7053: Element implicitly has an 'any' type because expression of type '"welcome.pingoGreeting"' can't be used to index type 'Record<"login.invalidCredentials" | "common.cannotReachServer" | "common.somethingWentWrong" | "login.signIn" | "login.email" | "login.password" | "login.createAccount" | "login.forgotPassword" | ... 356 more ... | "welcome.legalNotice", string>'.
  Property 'welcome.pingoGreeting' does not exist on type 'Record<"login.invalidCredentials" | "common.cannotReachServer" | "common.somethingWentWrong" | "login.signIn" | "login.email" | "login.password" | "login.createAccount" | "login.forgotPassword" | ... 356 more ... | "welcome.legalNotice", string>'.
src/screens/welcome/index.test.tsx(421,26): error TS7053: Element implicitly has an 'any' type because expression of type '"welcome.pingoGreeting"' can't be used to index type '{ readonly 'login.invalidCredentials': "Invalid credentials"; readonly 'common.cannotReachServer': "Cannot reach server"; readonly 'common.somethingWentWrong': "Something went wrong"; ... 361 more ...; readonly 'welcome.legalNotice': "By continuing you accept our Terms and Privacy Policy"; }'.
  Property 'welcome.pingoGreeting' does not exist on type '{ readonly 'login.invalidCredentials': "Invalid credentials"; readonly 'common.cannotReachServer': "Cannot reach server"; readonly 'common.somethingWentWrong': "Something went wrong"; ... 361 more ...; readonly 'welcome.legalNotice': "By continuing you accept our Terms and Privacy Policy"; }'.
src/screens/welcome/index.test.tsx(421,55): error TS7053: Element implicitly has an 'any' type because expression of type '"welcome.pingoGreeting"' can't be used to index type 'Record<"login.invalidCredentials" | "common.cannotReachServer" | "common.somethingWentWrong" | "login.signIn" | "login.email" | "login.password" | "login.createAccount" | "login.forgotPassword" | ... 356 more ... | "welcome.legalNotice", string>'.
  Property 'welcome.pingoGreeting' does not exist on type 'Record<"login.invalidCredentials" | "common.cannotReachServer" | "common.somethingWentWrong" | "login.signIn" | "login.email" | "login.password" | "login.createAccount" | "login.forgotPassword" | ... 356 more ... | "welcome.legalNotice", string>'.

```

Commit: `1a363846 test(mobile-welcome): #153 R1 red pingo greeting copy`.

Typecheck: solo errores permitidos arriba. Lint: exit=0. Guard router.d.ts: exit=0.

## T4 verde

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g4.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       37 passed, 37 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/providers/__tests__/language-provider.test.tsx > /tmp/153-g4-lp.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       24 passed, 24 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/153-g4-ul.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       30 passed, 30 total
exit=0
```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +37 passed, 37 total$' /tmp/153-g4.txt \
&& grep -qE '^Tests: +24 passed, 24 total$' /tmp/153-g4-lp.txt \
&& grep -qE '^Tests: +30 passed, 30 total$' /tmp/153-g4-ul.txt \
&& test "$(grep -cF "'welcome.pingoGreeting'" src/i18n/catalog.ts)" = 2 \
&& test "$(grep -cF '### §2.20' ../specs/mobile-ui-language/design.md)" = 1 \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md \
&& test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts specs/mobile-ui-language/design.md ' \
&& git commit -m 'feat(mobile-welcome): #153 R1 pingo greeting copy'
```

T4 verde: corregido antes del commit el recorte del encabezado de §2.20 para insertar solo el título literal y la tabla de R1.

```text
[feature/153-mobile-welcome-pingo be5a716e] feat(mobile-welcome): #153 R1 pingo greeting copy
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 8 insertions(+)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `be5a716e feat(mobile-welcome): #153 R1 pingo greeting copy`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T5 rojo

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r5.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       7 failed, 36 passed, 43 total
exit=1
```

Detalle de cada it rojo (matcher y Expected/Received, consulta o ENOENT):

```text
  ● R5 › apila los siete bloques en orden

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      Array [
    -   "welcome-scene",
    -   "welcome-chips",
    +   "welcome-hero",
        "welcome-brand",
    +   "welcome-chips",
        "welcome-tagline",
        "welcome-get-started",
        "welcome-have-account",
        "welcome-legal",
      ]

      131 |     const children = screen.getByTestId('welcome-content').children as TestInstance[];
      132 |     expect(children).toHaveLength(7);
    > 133 |     expect(children.map((child) => child.props.testID)).toEqual([
          |                                                         ^
      134 |       'welcome-scene', 'welcome-chips', 'welcome-brand', 'welcome-tagline',
      135 |       'welcome-get-started', 'welcome-have-account', 'welcome-legal',
      136 |     ]);

      at Object.toEqual (src/screens/welcome/index.test.tsx:133:57)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R1: el saludo de Pingo existe en los dos idiomas › pinta el saludo en el bocadillo en español

    Unable to find an element with text: Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.

    [36m<RNCSafeAreaProvider>[39m
      [36m<RCTScrollView[39m
        [33mtestID[39m=[32m"screen-welcome"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<View[39m
            [33mstyle[39m=[32m{
              {
                "opacity": 0,
              }
            }[39m
            [33mtestID[39m=[32m"welcome-content"[39m
          [36m>[39m
            [36m<ViewManagerAdapter_ExpoImage[39m
              [33mplaceholder[39m=[32m{[]}[39m
              [33mtestID[39m=[32m"welcome-hero"[39m
            [36m/>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-brand"[39m
            [36m>[39m
              [0mPet Tracker[0m
            [36m</Text>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-chips"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-gps"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-map"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mGPS[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-health"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-stethoscope"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mSalud[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-nutrition"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-fork-knife"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mNutrición[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-tagline"[39m
            [36m>[39m
              [0mTu centro inteligente de bienestar, rastreo y nutrición canina profesional[0m
            [36m</Text>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-get-started"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mComenzar ahora[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-have-account"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mYa tengo una cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-legal"[39m
            [36m>[39m
              [0mAl continuar aceptas nuestros Términos y Política de privacidad[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</View>[39m
      [36m</RCTScrollView>[39m
    [36m</RNCSafeAreaProvider>[39m

      424 |   it('pinta el saludo en el bocadillo en español', async () => {
      425 |     await renderWelcome('es');
    > 426 |     expect(screen.getByText('Hola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.').props.testID).toBe('welcome-bubble-text');
          |                   ^
      427 |   });
      428 |
      429 |   it('pinta el saludo en el bocadillo en inglés', async () => {

      at Object.getByText (src/screens/welcome/index.test.tsx:426:19)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R1: el saludo de Pingo existe en los dos idiomas › pinta el saludo en el bocadillo en inglés

    Unable to find an element with text: Hi, I'm Pingo. I'll help you know where your pet is and how they're doing.

    [36m<RNCSafeAreaProvider>[39m
      [36m<RCTScrollView[39m
        [33mtestID[39m=[32m"screen-welcome"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<View[39m
            [33mstyle[39m=[32m{
              {
                "opacity": 0,
              }
            }[39m
            [33mtestID[39m=[32m"welcome-content"[39m
          [36m>[39m
            [36m<ViewManagerAdapter_ExpoImage[39m
              [33mplaceholder[39m=[32m{[]}[39m
              [33mtestID[39m=[32m"welcome-hero"[39m
            [36m/>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-brand"[39m
            [36m>[39m
              [0mPet Tracker[0m
            [36m</Text>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-chips"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-gps"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-map"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mGPS[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-health"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-stethoscope"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mHealth[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-nutrition"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-fork-knife"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mNutrition[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-tagline"[39m
            [36m>[39m
              [0mYour smart hub for canine wellness, tracking and nutrition[0m
            [36m</Text>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-get-started"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mGet started[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-have-account"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mI already have an account[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-legal"[39m
            [36m>[39m
              [0mBy continuing you accept our Terms and Privacy Policy[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</View>[39m
      [36m</RCTScrollView>[39m
    [36m</RNCSafeAreaProvider>[39m

      429 |   it('pinta el saludo en el bocadillo en inglés', async () => {
      430 |     await renderWelcome('en');
    > 431 |     expect(screen.getByText('Hi, I\'m Pingo. I\'ll help you know where your pet is and how they\'re doing.').props.testID).toBe('welcome-bubble-text');
          |                   ^
      432 |   });
      433 |
      434 |   it('registra la clave en la tabla de mobile-ui-language', () => {

      at Object.getByText (src/screens/welcome/index.test.tsx:431:19)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R5: la escena de Pingo sustituye al logo › apila la escena y los seis bloques de #118 en orden

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      Array [
    -   "welcome-scene",
    -   "welcome-chips",
    +   "welcome-hero",
        "welcome-brand",
    +   "welcome-chips",
        "welcome-tagline",
        "welcome-get-started",
        "welcome-have-account",
        "welcome-legal",
      ]

      445 |     const children = screen.getByTestId('welcome-content').children as TestInstance[];
      446 |     expect(children).toHaveLength(7);
    > 447 |     expect(children.map((child) => child.props.testID)).toEqual([
          |                                                         ^
      448 |       'welcome-scene', 'welcome-chips', 'welcome-brand', 'welcome-tagline',
      449 |       'welcome-get-started', 'welcome-have-account', 'welcome-legal',
      450 |     ]);

      at Object.toEqual (src/screens/welcome/index.test.tsx:447:57)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R5: la escena de Pingo sustituye al logo › ya no pinta el logo

    expect(received).toBeNull()

    Received: <ViewManagerAdapter_ExpoImage containerViewRef={"[React.ref]"} contentFit="contain" contentPosition={{"left": "50%", "top": "50%"}} height={160} nativeViewRef={"[React.ref]"} onError={[Function anonymous]} onLoad={[Function anonymous]} onLoadStart={[Function anonymous]} onProgress={[Function anonymous]} placeholder={[]} sfEffect={null} source={[{"testUri": "../../../assets/images/splash-icon.png"}]} style={{"height": 160, "width": 160}} symbolSize={null} symbolWeight={null} testID="welcome-hero" transition={null} width={160} />

      454 |     await renderWelcome();
      455 |     expect(screen.getByTestId('welcome-content')).toBeOnTheScreen();
    > 456 |     expect(screen.queryByTestId('welcome-hero')).toBeNull();
          |                                                  ^
      457 |     expect(readSource('screens/welcome/index.tsx')).not.toContain('splash-icon');
      458 |   });
      459 |

      at Object.toBeNull (src/screens/welcome/index.test.tsx:456:50)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R5: la escena de Pingo sustituye al logo › pinta la escena como card secundaria con el bocadillo y Pingo

    Unable to find an element with testID: welcome-scene

    [36m<RNCSafeAreaProvider>[39m
      [36m<RCTScrollView[39m
        [33mtestID[39m=[32m"screen-welcome"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<View[39m
            [33mstyle[39m=[32m{
              {
                "opacity": 0,
              }
            }[39m
            [33mtestID[39m=[32m"welcome-content"[39m
          [36m>[39m
            [36m<ViewManagerAdapter_ExpoImage[39m
              [33mplaceholder[39m=[32m{[]}[39m
              [33mtestID[39m=[32m"welcome-hero"[39m
            [36m/>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-brand"[39m
            [36m>[39m
              [0mPet Tracker[0m
            [36m</Text>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-chips"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-gps"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-map"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mGPS[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-health"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-stethoscope"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mSalud[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-nutrition"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-fork-knife"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mNutrición[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-tagline"[39m
            [36m>[39m
              [0mTu centro inteligente de bienestar, rastreo y nutrición canina profesional[0m
            [36m</Text>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-get-started"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mComenzar ahora[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-have-account"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mYa tengo una cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-legal"[39m
            [36m>[39m
              [0mAl continuar aceptas nuestros Términos y Política de privacidad[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</View>[39m
      [36m</RCTScrollView>[39m
    [36m</RNCSafeAreaProvider>[39m

      460 |   it('pinta la escena como card secundaria con el bocadillo y Pingo', async () => {
      461 |     await renderWelcome();
    > 462 |     const scene = screen.getByTestId('welcome-scene');
          |                          ^
      463 |     expect(scene.props.className.split(' ')).toEqual(expect.arrayContaining([
      464 |       'rounded-card', 'bg-surface-secondary', 'w-full', 'items-center', 'gap-3', 'py-6',
      465 |     ]));

      at Object.getByTestId (src/screens/welcome/index.test.tsx:462:26)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R5: la escena de Pingo sustituye al logo › pinta el bocadillo como card de superficie con el saludo

    Unable to find an element with testID: welcome-bubble

    [36m<RNCSafeAreaProvider>[39m
      [36m<RCTScrollView[39m
        [33mtestID[39m=[32m"screen-welcome"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<View[39m
            [33mstyle[39m=[32m{
              {
                "opacity": 0,
              }
            }[39m
            [33mtestID[39m=[32m"welcome-content"[39m
          [36m>[39m
            [36m<ViewManagerAdapter_ExpoImage[39m
              [33mplaceholder[39m=[32m{[]}[39m
              [33mtestID[39m=[32m"welcome-hero"[39m
            [36m/>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-brand"[39m
            [36m>[39m
              [0mPet Tracker[0m
            [36m</Text>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-chips"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-gps"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-map"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mGPS[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-health"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-stethoscope"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mSalud[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-nutrition"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-fork-knife"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mNutrición[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-tagline"[39m
            [36m>[39m
              [0mTu centro inteligente de bienestar, rastreo y nutrición canina profesional[0m
            [36m</Text>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-get-started"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mComenzar ahora[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-have-account"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mYa tengo una cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-legal"[39m
            [36m>[39m
              [0mAl continuar aceptas nuestros Términos y Política de privacidad[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</View>[39m
      [36m</RCTScrollView>[39m
    [36m</RNCSafeAreaProvider>[39m

      469 |   it('pinta el bocadillo como card de superficie con el saludo', async () => {
      470 |     await renderWelcome();
    > 471 |     const bubble = screen.getByTestId('welcome-bubble');
          |                           ^
      472 |     expect(bubble.props.className.split(' ')).toEqual(expect.arrayContaining([
      473 |       'rounded-card', 'bg-surface', 'shadow-sm', 'px-4', 'py-3',
      474 |     ]));

      at Object.getByTestId (src/screens/welcome/index.test.tsx:471:27)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/153-r5-ul.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
exit=1
```

Detalle de cada it rojo (matcher y Expected/Received, consulta o ENOENT):

```text
  ● #118 R1: welcome resuelve su copy por clave › resuelve las 9 ocurrencias de welcome (#153 R1)

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/welcome/index.tsx",
        "key": "welcome.pingoGreeting",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:279:63)

  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/welcome/index.tsx",
        "key": "welcome.pingoGreeting",
    -   "uses": 1,
    +   "uses": 0,
      }

      60 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      61 |
    > 62 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      63 |       file,
      64 |       key,
      65 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:62:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:491:5)

```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +7 failed, 36 passed, 43 total$' /tmp/153-r5.txt \
&& test "$(grep -cE 'Unable to find an element with (testID: welcome-(scene|bubble)|text: (Hola|Hi), )' /tmp/153-r5.txt)" -ge 4 \
&& grep -qE '^Tests: +2 failed, 28 passed, 30 total$' /tmp/153-r5-ul.txt \
&& ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r5.txt /tmp/153-r5-ul.txt \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.test.tsx src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts \
&& test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/welcome/index.test.tsx ' \
&& git commit -m 'test(mobile-welcome): #153 R5 red pingo scene replaces the logo'
```

```text
[feature/153-mobile-welcome-pingo 59b13cbf] test(mobile-welcome): #153 R5 red pingo scene replaces the logo
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 3 files changed, 54 insertions(+), 6 deletions(-)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `59b13cbf test(mobile-welcome): #153 R5 red pingo scene replaces the logo`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T5 verde

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g5.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       43 passed, 43 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/153-g5-ul.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       30 passed, 30 total
exit=0
```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +43 passed, 43 total$' /tmp/153-g5.txt \
&& grep -qE '^Tests: +30 passed, 30 total$' /tmp/153-g5-ul.txt \
&& test "$(grep -cF 'splash-icon' src/screens/welcome/index.tsx)" = 0 \
&& test "$(grep -cF "t('welcome.pingoGreeting')" src/screens/welcome/index.tsx)" = 1 \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.tsx' \
&& git commit -m 'feat(mobile-welcome): #153 R5 pingo scene replaces the logo'
```

```text
[feature/153-mobile-welcome-pingo 2e677522] feat(mobile-welcome): #153 R5 pingo scene replaces the logo
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 8 insertions(+), 8 deletions(-)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `2e677522 feat(mobile-welcome): #153 R5 pingo scene replaces the logo`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T6 rojo

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r6.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       4 failed, 43 passed, 47 total
exit=1
```

Detalle de cada it rojo (matcher y Expected/Received, consulta o ENOENT):

```text
  ● #153 R6: Pingo se pinta con su pose y su capa de parpadeo › deja en Pingo la pose y la capa de parpadeo, en ese orden

    expect(received).toEqual(expected) // deep equality

    - Expected  - 4
    + Received  + 1

    - Array [
    -   "welcome-pingo-wave",
    -   "welcome-pingo-blink",
    - ]
    + Array []

      485 |     await renderWelcome();
      486 |     expect((screen.getByTestId('welcome-pingo').children as TestInstance[]).map((child) => child.props.testID))
    > 487 |       .toEqual(['welcome-pingo-wave', 'welcome-pingo-blink']);
          |        ^
      488 |     expect((screen.getByTestId('welcome-pingo-blink').children as TestInstance[]).map((child) => child.props.testID))
      489 |       .toEqual(['welcome-pingo-blink-image']);
      490 |   });

      at Object.toEqual (src/screens/welcome/index.test.tsx:487:8)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R6: Pingo se pinta con su pose y su capa de parpadeo › welcome-pingo-wave pinta su pose a 200×200, sin etiqueta de accesibilidad

    Unable to find an element with testID: welcome-pingo-wave

    [36m<RNCSafeAreaProvider>[39m
      [36m<RCTScrollView[39m
        [33mtestID[39m=[32m"screen-welcome"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<View[39m
            [33mstyle[39m=[32m{
              {
                "opacity": 0,
              }
            }[39m
            [33mtestID[39m=[32m"welcome-content"[39m
          [36m>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-scene"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-bubble"[39m
              [36m>[39m
                [36m<Text[39m
                  [33mtestID[39m=[32m"welcome-bubble-text"[39m
                [36m>[39m
                  [0mHola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-pingo"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-chips"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-gps"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-map"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mGPS[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-health"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-stethoscope"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mSalud[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-nutrition"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-fork-knife"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mNutrición[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-brand"[39m
            [36m>[39m
              [0mPet Tracker[0m
            [36m</Text>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-tagline"[39m
            [36m>[39m
              [0mTu centro inteligente de bienestar, rastreo y nutrición canina profesional[0m
            [36m</Text>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-get-started"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mComenzar ahora[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-have-account"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mYa tengo una cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-legal"[39m
            [36m>[39m
              [0mAl continuar aceptas nuestros Términos y Política de privacidad[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</View>[39m
      [36m</RCTScrollView>[39m
    [36m</RNCSafeAreaProvider>[39m

      495 |   ] as const)('%s pinta su pose a 200×200, sin etiqueta de accesibilidad', async (testID, pattern) => {
      496 |     await renderWelcome();
    > 497 |     const image = screen.getByTestId(testID);
          |                          ^
      498 |     expect(image.props.style).toEqual({ width: 200, height: 200 });
      499 |     expect(image.props.contentFit).toBe('contain');
      500 |     expect(image.props.source).toEqual([expect.objectContaining({ testUri: expect.stringMatching(pattern) })]);

      at getByTestId (src/screens/welcome/index.test.tsx:497:26)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R6: Pingo se pinta con su pose y su capa de parpadeo › welcome-pingo-blink-image pinta su pose a 200×200, sin etiqueta de accesibilidad

    Unable to find an element with testID: welcome-pingo-blink-image

    [36m<RNCSafeAreaProvider>[39m
      [36m<RCTScrollView[39m
        [33mtestID[39m=[32m"screen-welcome"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<View[39m
            [33mstyle[39m=[32m{
              {
                "opacity": 0,
              }
            }[39m
            [33mtestID[39m=[32m"welcome-content"[39m
          [36m>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-scene"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-bubble"[39m
              [36m>[39m
                [36m<Text[39m
                  [33mtestID[39m=[32m"welcome-bubble-text"[39m
                [36m>[39m
                  [0mHola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-pingo"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-chips"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-gps"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-map"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mGPS[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-health"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-stethoscope"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mSalud[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-nutrition"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-fork-knife"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mNutrición[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-brand"[39m
            [36m>[39m
              [0mPet Tracker[0m
            [36m</Text>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-tagline"[39m
            [36m>[39m
              [0mTu centro inteligente de bienestar, rastreo y nutrición canina profesional[0m
            [36m</Text>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-get-started"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mComenzar ahora[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-have-account"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mYa tengo una cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-legal"[39m
            [36m>[39m
              [0mAl continuar aceptas nuestros Términos y Política de privacidad[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</View>[39m
      [36m</RCTScrollView>[39m
    [36m</RNCSafeAreaProvider>[39m

      495 |   ] as const)('%s pinta su pose a 200×200, sin etiqueta de accesibilidad', async (testID, pattern) => {
      496 |     await renderWelcome();
    > 497 |     const image = screen.getByTestId(testID);
          |                          ^
      498 |     expect(image.props.style).toEqual({ width: 200, height: 200 });
      499 |     expect(image.props.contentFit).toBe('contain');
      500 |     expect(image.props.source).toEqual([expect.objectContaining({ testUri: expect.stringMatching(pattern) })]);

      at getByTestId (src/screens/welcome/index.test.tsx:497:26)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R6: Pingo se pinta con su pose y su capa de parpadeo › coloca la capa de parpadeo encima de Pingo, cerrada

    Unable to find an element with testID: welcome-pingo-blink

    [36m<RNCSafeAreaProvider>[39m
      [36m<RCTScrollView[39m
        [33mtestID[39m=[32m"screen-welcome"[39m
      [36m>[39m
        [36m<View>[39m
          [36m<View[39m
            [33mstyle[39m=[32m{
              {
                "opacity": 0,
              }
            }[39m
            [33mtestID[39m=[32m"welcome-content"[39m
          [36m>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-scene"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-bubble"[39m
              [36m>[39m
                [36m<Text[39m
                  [33mtestID[39m=[32m"welcome-bubble-text"[39m
                [36m>[39m
                  [0mHola, soy Pingo. Te ayudo a saber dónde está y cómo está tu mascota.[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-pingo"[39m
              [36m/>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-chips"[39m
            [36m>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-gps"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-map"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mGPS[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-health"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-stethoscope"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mSalud[0m
                [36m</Text>[39m
              [36m</View>[39m
              [36m<View[39m
                [33mtestID[39m=[32m"welcome-chip-nutrition"[39m
              [36m>[39m
                [36m<View[39m
                  [33mtestID[39m=[32m"icon-fork-knife"[39m
                [36m/>[39m
                [36m<Text>[39m
                  [0mNutrición[0m
                [36m</Text>[39m
              [36m</View>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-brand"[39m
            [36m>[39m
              [0mPet Tracker[0m
            [36m</Text>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-tagline"[39m
            [36m>[39m
              [0mTu centro inteligente de bienestar, rastreo y nutrición canina profesional[0m
            [36m</Text>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-get-started"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mComenzar ahora[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<View[39m
              [33mtestID[39m=[32m"welcome-have-account"[39m
            [36m>[39m
              [36m<Text>[39m
                [0mYa tengo una cuenta[0m
              [36m</Text>[39m
            [36m</View>[39m
            [36m<Text[39m
              [33mtestID[39m=[32m"welcome-legal"[39m
            [36m>[39m
              [0mAl continuar aceptas nuestros Términos y Política de privacidad[0m
            [36m</Text>[39m
          [36m</View>[39m
        [36m</View>[39m
      [36m</RCTScrollView>[39m
    [36m</RNCSafeAreaProvider>[39m

      504 |   it('coloca la capa de parpadeo encima de Pingo, cerrada', async () => {
      505 |     await renderWelcome();
    > 506 |     expect(getAnimatedStyle(screen.getByTestId('welcome-pingo-blink'))).toEqual({ position: 'absolute', top: 0, left: 0, opacity: 0 });
          |                                    ^
      507 |   });
      508 | });
      509 |

      at Object.getByTestId (src/screens/welcome/index.test.tsx:506:36)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +4 failed, 43 passed, 47 total$' /tmp/153-r6.txt \
&& test "$(grep -cF 'Unable to find an element with testID: welcome-pingo-' /tmp/153-r6.txt)" -ge 3 \
&& ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r6.txt \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.test.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
&& git commit -m 'test(mobile-welcome): #153 R6 red pingo pose and blink layer'
```

```text
[feature/153-mobile-welcome-pingo 78ad2489] test(mobile-welcome): #153 R6 red pingo pose and blink layer
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 29 insertions(+)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `78ad2489 test(mobile-welcome): #153 R6 red pingo pose and blink layer`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T6 verde

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g6.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       47 passed, 47 total
exit=0
```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +47 passed, 47 total$' /tmp/153-g6.txt \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.tsx' \
&& git commit -m 'feat(mobile-welcome): #153 R6 pingo pose and blink layer'
```

```text
[feature/153-mobile-welcome-pingo 69780061] feat(mobile-welcome): #153 R6 pingo pose and blink layer
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 9 insertions(+), 1 deletion(-)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `69780061 feat(mobile-welcome): #153 R6 pingo pose and blink layer`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T7 rojo

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r7.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 47 passed, 49 total
exit=1
```

Detalle de cada it rojo (matcher y Expected/Received, consulta o ENOENT):

```text
  ● R7 › es el botón primario del repo

    expect(received).toBe(expected) // Object.is equality

    Expected: "w-full rounded-xl bg-accent border-b-4 border-black/25"
    Received: "w-full rounded-xl bg-accent"

      276 |   it('es el botón primario del repo', async () => {
      277 |     await renderWelcome();
    > 278 |     expect(screen.getByTestId('welcome-get-started').props.className).toBe('w-full rounded-xl bg-accent border-b-4 border-black/25');
          |                                                                       ^
      279 |     expect(screen.getByText('Comenzar ahora')).toBeOnTheScreen();
      280 |     expect(screen.getByText('Comenzar ahora').props.className).toBe('font-bold text-accent-foreground');
      281 |   });

      at Object.toBe (src/screens/welcome/index.test.tsx:278:71)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R7: el CTA primario tiene cuerpo › declara el labio en el CTA primario

    expect(received).toBe(expected) // Object.is equality

    Expected: "w-full rounded-xl bg-accent border-b-4 border-black/25"
    Received: "w-full rounded-xl bg-accent"

      512 |   it('declara el labio en el CTA primario', async () => {
      513 |     await renderWelcome('es');
    > 514 |     expect(screen.getByTestId('welcome-get-started').props.className).toBe('w-full rounded-xl bg-accent border-b-4 border-black/25');
          |                                                                       ^
      515 |     expect(screen.getByText('Comenzar ahora').props.className).toBe('font-bold text-accent-foreground');
      516 |   });
      517 |

      at Object.toBe (src/screens/welcome/index.test.tsx:514:71)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +2 failed, 47 passed, 49 total$' /tmp/153-r7.txt \
&& ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r7.txt \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.test.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
&& git commit -m 'test(mobile-welcome): #153 R7 red primary cta lip'
```

```text
[feature/153-mobile-welcome-pingo d6cade3d] test(mobile-welcome): #153 R7 red primary cta lip
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 17 insertions(+), 1 deletion(-)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `d6cade3d test(mobile-welcome): #153 R7 red primary cta lip`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T7 verde

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g7.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       49 passed, 49 total
exit=0
```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +49 passed, 49 total$' /tmp/153-g7.txt \
&& test "$(grep -cF 'border-b-4' src/screens/welcome/index.tsx)" = 1 \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.tsx' \
&& git commit -m 'feat(mobile-welcome): #153 R7 primary cta lip'
```

```text
[feature/153-mobile-welcome-pingo 2caff4fe] feat(mobile-welcome): #153 R7 primary cta lip
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 1 insertion(+), 1 deletion(-)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `2caff4fe feat(mobile-welcome): #153 R7 primary cta lip`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T8 rojo

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r8.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       3 failed, 47 passed, 50 total
exit=1
```

Detalle de cada it rojo (matcher y Expected/Received, consulta o ENOENT):

```text
  ● #153 R8: el contenido entra con las constantes de motion.ts › exporta solo la pantalla

    expect(received).toEqual(expected) // deep equality

    - Expected  - 0
    + Received  + 2

      Array [
    +   "WELCOME_ENTRANCE_EASING",
    +   "WELCOME_ENTRANCE_MS",
        "WelcomeScreen",
      ]

      478 |     await renderWelcome();
      479 |     expect(screen.getByTestId('welcome-content')).toBeOnTheScreen();
    > 480 |     expect(Object.keys(require('./index'))).toEqual(['WelcomeScreen']);
          |                                             ^
      481 |   });
      482 |
      483 |   it('usa el fundido y el muelle de motion.ts', async () => {

      at Object.toEqual (src/screens/welcome/index.test.tsx:480:45)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R8: el contenido entra con las constantes de motion.ts › usa el fundido y el muelle de motion.ts

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      491 |       /from '\.\.\/\.\.\/theme\/motion'/g,
      492 |     ]) {
    > 493 |       expect((source.match(re) ?? []).length).toBe(1);
          |                                               ^
      494 |     }
      495 |     for (const re of [/\b(?:duration|easing|reduceMotion):/g, /WELCOME_ENTRANCE_/g]) {
      496 |       expect((source.match(re) ?? []).length).toBe(0);

      at Object.toBe (src/screens/welcome/index.test.tsx:493:47)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R8: el contenido entra con las constantes de motion.ts › arranca invisible y desplazado 12 puntos sin reduce motion

    Expected: {"alignItems":"center","gap":16,"opacity":0,"transform":[{"translateY":12}]}
    Received: {"opacity":0,"transform":[{"translateY":16}],"alignItems":"center","gap":16}

    Differences:
    - 'transform' should be [{"translateY":12}], but is [{"translateY":16}]

      500 |   it('arranca invisible y desplazado 12 puntos sin reduce motion', async () => {
      501 |     await renderWelcome();
    > 502 |     expect(screen.getByTestId('welcome-content')).toHaveAnimatedStyle({
          |                                                   ^
      503 |       alignItems: 'center', gap: 16, opacity: 0, transform: [{ translateY: 12 }],
      504 |     }, { shouldMatchAllProps: true });
      505 |   });

      at Object.toHaveAnimatedStyle (src/screens/welcome/index.test.tsx:502:51)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +3 failed, 47 passed, 50 total$' /tmp/153-r8.txt \
&& ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r8.txt \
&& test "$(grep -cF "describe('R10', () => {" src/screens/welcome/index.test.tsx)" = 0 \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.test.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
&& git commit -m 'test(mobile-welcome): #153 R8 red entrance from motion.ts'
```

```text

/home/claude/sites/Pet-Tracker-wt-153/mobile-pet-tracker/src/screens/welcome/index.test.tsx
  17:7  warning  'mockWithRepeat' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 1 problem (0 errors, 1 warning)

[feature/153-mobile-welcome-pingo ac731b91] test(mobile-welcome): #153 R8 red entrance from motion.ts
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 67 insertions(+), 61 deletions(-)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `ac731b91 test(mobile-welcome): #153 R8 red entrance from motion.ts`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T8 verde

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g8.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       50 passed, 50 total
exit=0
```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +50 passed, 50 total$' /tmp/153-g8.txt \
&& test "$(grep -cF 'WELCOME_ENTRANCE_' src/screens/welcome/index.tsx)" = 0 \
&& test "$(grep -cw Easing src/screens/welcome/index.tsx)" = 0 \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.tsx' \
&& git commit -m 'feat(mobile-welcome): #153 R8 entrance from motion.ts'
```

```text

/home/claude/sites/Pet-Tracker-wt-153/mobile-pet-tracker/src/screens/welcome/index.test.tsx
  17:7  warning  'mockWithRepeat' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 1 problem (0 errors, 1 warning)

[feature/153-mobile-welcome-pingo 4a41eabc] feat(mobile-welcome): #153 R8 entrance from motion.ts
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 5 insertions(+), 16 deletions(-)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `4a41eabc feat(mobile-welcome): #153 R8 entrance from motion.ts`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T8b rojo

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-re1.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 50 passed, 51 total
exit=1
```

Detalle de cada it rojo (matcher y Expected/Received, consulta o ENOENT):

```text
  ● #153 E1: la carta retira WELCOME_ENTRANCE_MS de la migración pendiente › deja en la lista solo las cinco constantes pendientes

    expect(received).toContain(expected) // indexOf

    Expected substring: "Las constantes anteriores a #152 (`MEALS_BAR_TIMING`, `KCAL_BAR_TIMING`,
    `BAR_ENTRY_*`, `METRIC_TAB_SPRING` y `TAB_INDICATOR_SPRING`) migran a
    `motion.ts` en una feature posterior, fuera del alcance de esta.
    `WELCOME_ENTRANCE_MS` no está en la lista: la retiró #153, cuya bienvenida
    usa `MOTION_FADE_TIMING` y `MOTION_SETTLE_SPRING` (enmienda E1 de #153)."
    Received string:    "## Enmienda #152 — el movimiento vive en src/theme/motion.ts·
    Enmienda A21: Reanimated consume números y §Animación prohíbe pasarle
    variables CSS. Las duraciones y configuraciones compartidas de movimiento
    viven en `src/theme/motion.ts`.·
    `motion.ts` no es un segundo sistema de estilos en el sentido de
    §Decisiones fijas 1: no contiene colores, espaciados, radios ni clases,
    solo duraciones y configuraciones de Reanimated. Tiene los precedentes
    `native-styles.ts` y `touch-target.ts` en la misma carpeta.·
    Las constantes anteriores a #152 (`MEALS_BAR_TIMING`, `KCAL_BAR_TIMING`,
    `WELCOME_ENTRANCE_MS`, `BAR_ENTRY_*`, `METRIC_TAB_SPRING` y
    `TAB_INDICATOR_SPRING`) migran a `motion.ts` en una feature posterior,
    fuera del alcance de esta.·
    - [X] Enmienda aprobada por humano
    "

      538 |     const amendment = charter.slice(start, next === -1 ? undefined : next);
      539 |     expect(start).toBeGreaterThan(-1);
    > 540 |     expect(amendment).toContain([
          |                       ^
      541 |       'Las constantes anteriores a #152 (`MEALS_BAR_TIMING`, `KCAL_BAR_TIMING`,',
      542 |       '`BAR_ENTRY_*`, `METRIC_TAB_SPRING` y `TAB_INDICATOR_SPRING`) migran a',
      543 |       '`motion.ts` en una feature posterior, fuera del alcance de esta.',

      at Object.toContain (src/screens/welcome/index.test.tsx:540:23)

```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +1 failed, 50 passed, 51 total$' /tmp/153-re1.txt \
&& ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-re1.txt \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.test.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
&& git commit -m 'test(mobile-welcome): #153 E1 red charter retires WELCOME_ENTRANCE_MS'
```

```text

/home/claude/sites/Pet-Tracker-wt-153/mobile-pet-tracker/src/screens/welcome/index.test.tsx
  17:7  warning  'mockWithRepeat' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 1 problem (0 errors, 1 warning)

[feature/153-mobile-welcome-pingo 8b8bd35e] test(mobile-welcome): #153 E1 red charter retires WELCOME_ENTRANCE_MS
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 19 insertions(+)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `8b8bd35e test(mobile-welcome): #153 E1 red charter retires WELCOME_ENTRANCE_MS`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T8b verde

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-ge1.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       51 passed, 51 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/ui-language.test.ts 'src/app/\(tabs\)/__tests__/food.test.tsx' src/__tests__/hero-header-amendments.test.ts > /tmp/153-ge1-carta.txt 2>&1; echo "exit=$?"
Test Suites: 6 passed, 6 total
Tests:       219 passed, 219 total
exit=0
```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +51 passed, 51 total$' /tmp/153-ge1.txt \
&& grep -qE '^Tests: +219 passed, 219 total$' /tmp/153-ge1-carta.txt \
&& test "$(grep -cF 'Las constantes anteriores a #152 (' ../docs/ui-guidelines.md)" = 1 \
&& test "$(grep -cF '`WELCOME_ENTRANCE_MS`, `BAR_ENTRY_*`, `METRIC_TAB_SPRING` y' ../docs/ui-guidelines.md)" = 0 \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add ../docs/ui-guidelines.md \
&& test "$(git diff --cached --name-only)" = 'docs/ui-guidelines.md' \
&& git commit -m 'feat(mobile-welcome): #153 E1 charter retires WELCOME_ENTRANCE_MS'
```

```text

/home/claude/sites/Pet-Tracker-wt-153/mobile-pet-tracker/src/screens/welcome/index.test.tsx
  17:7  warning  'mockWithRepeat' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 1 problem (0 errors, 1 warning)

[feature/153-mobile-welcome-pingo b273cf52] feat(mobile-welcome): #153 E1 charter retires WELCOME_ENTRANCE_MS
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 4 insertions(+), 3 deletions(-)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `b273cf52 feat(mobile-welcome): #153 E1 charter retires WELCOME_ENTRANCE_MS`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T9 rojo

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r9.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       4 failed, 51 passed, 55 total
exit=1
```

Detalle de cada it rojo (matcher y Expected/Received, consulta o ENOENT):

```text
  ● #153 R9: Pingo entra con un muelle de escala › arranca al 90 % sin reduce motion

    expect(received).toEqual(expected) // deep equality

    - Expected  - 8
    + Received  + 0

      Object {
        "height": 200,
    -   "transform": Array [
    -     Object {
    -       "translateY": 0,
    -     },
    -     Object {
    -       "scale": 0.9,
    -     },
    -   ],
        "width": 200,
      }

      555 |   it('arranca al 90 % sin reduce motion', async () => {
      556 |     await renderWelcome();
    > 557 |     expect(getAnimatedStyle(screen.getByTestId('welcome-pingo'))).toEqual({
          |                                                                   ^
      558 |       width: 200, height: 200, transform: [{ translateY: 0 }, { scale: 0.9 }],
      559 |     });
      560 |   });

      at Object.toEqual (src/screens/welcome/index.test.tsx:557:67)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R9: Pingo entra con un muelle de escala › termina a tamaño completo sin reduce motion

    expect(received).toEqual(expected) // deep equality

    - Expected  - 8
    + Received  + 0

      Object {
        "height": 200,
    -   "transform": Array [
    -     Object {
    -       "translateY": Any<Number>,
    -     },
    -     Object {
    -       "scale": 1,
    -     },
    -   ],
        "width": 200,
      }

      565 |     // Unas 1,5 × 250 ms de asentamiento; 1000 ms deja más del doble.
      566 |     await act(async () => { jest.advanceTimersByTime(1000); });
    > 567 |     expect(getAnimatedStyle(screen.getByTestId('welcome-pingo'))).toEqual({
          |                                                                   ^
      568 |       width: 200, height: 200, transform: [{ translateY: expect.any(Number) }, { scale: 1 }],
      569 |     });
      570 |   });

      at Object.toEqual (src/screens/welcome/index.test.tsx:567:67)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R9: Pingo entra con un muelle de escala › con reduce motion nace a tamaño completo y no escala

    expect(received).toEqual(expected) // deep equality

    - Expected  - 8
    + Received  + 0

      Object {
        "height": 200,
    -   "transform": Array [
    -     Object {
    -       "translateY": 0,
    -     },
    -     Object {
    -       "scale": 1,
    -     },
    -   ],
        "width": 200,
      }

      573 |     mockUseReducedMotion.mockReturnValue(true);
      574 |     await renderWelcome();
    > 575 |     expect(getAnimatedStyle(screen.getByTestId('welcome-pingo'))).toEqual({
          |                                                                   ^
      576 |       width: 200, height: 200, transform: [{ translateY: 0 }, { scale: 1 }],
      577 |     });
      578 |     // 5000 ms supera el asentamiento y el primer parpadeo de 4000 ms.

      at Object.toEqual (src/screens/welcome/index.test.tsx:575:67)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R9: Pingo entra con un muelle de escala › usa el muelle de motion.ts

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      592 |       /useSharedValue\(\s*reduceMotion \? 1 : MOTION_ENTRANCE_SCALE,?\s*\)/g,
      593 |     ]) {
    > 594 |       expect((source.match(re) ?? []).length).toBe(1);
          |                                               ^
      595 |     }
      596 |   });
      597 | });

      at Object.toBe (src/screens/welcome/index.test.tsx:594:47)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +4 failed, 51 passed, 55 total$' /tmp/153-r9.txt \
&& ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r9.txt \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.test.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
&& git commit -m 'test(mobile-welcome): #153 R9 red pingo entrance scale'
```

```text

/home/claude/sites/Pet-Tracker-wt-153/mobile-pet-tracker/src/screens/welcome/index.test.tsx
  17:7  warning  'mockWithRepeat' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 1 problem (0 errors, 1 warning)

[feature/153-mobile-welcome-pingo 5545b4ae] test(mobile-welcome): #153 R9 red pingo entrance scale
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 48 insertions(+)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `5545b4ae test(mobile-welcome): #153 R9 red pingo entrance scale`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T9 verde

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g9.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       55 passed, 55 total
exit=0
```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +55 passed, 55 total$' /tmp/153-g9.txt \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.tsx' \
&& git commit -m 'feat(mobile-welcome): #153 R9 pingo entrance scale'
```

```text

/home/claude/sites/Pet-Tracker-wt-153/mobile-pet-tracker/src/screens/welcome/index.test.tsx
  17:7  warning  'mockWithRepeat' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 1 problem (0 errors, 1 warning)

[feature/153-mobile-welcome-pingo 9c1a1450] feat(mobile-welcome): #153 R9 pingo entrance scale
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 9 insertions(+), 3 deletions(-)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `9c1a1450 feat(mobile-welcome): #153 R9 pingo entrance scale`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T10 rojo

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r10.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       3 failed, 56 passed, 59 total
exit=1
```

Detalle de cada it rojo (matcher y Expected/Received, consulta o ENOENT):

```text
  ● #153 R10: Pingo flota en bucle › sube 4 puntos en medio ciclo sin reduce motion

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

    @@ -1,10 +1,10 @@
      Object {
        "height": 200,
        "transform": Array [
          Object {
    -       "translateY": -4,
    +       "translateY": 0,
          },
          Object {
            "scale": 1,
          },
        ],

      606 |     // Medio ciclo dura 1200 ms; 2000 ms deja 800 ms de margen.
      607 |     await act(async () => { jest.advanceTimersByTime(2000); });
    > 608 |     expect(getAnimatedStyle(screen.getByTestId('welcome-pingo'))).toEqual({
          |                                                                   ^
      609 |       width: 200, height: 200, transform: [{ translateY: -4 }, { scale: 1 }],
      610 |     });
      611 |   });

      at Object.toEqual (src/screens/welcome/index.test.tsx:608:67)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R10: Pingo flota en bucle › repite la flotación sin fin y en vaivén

    expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 1

    - Array [
    -   Array [
    -     -1,
    -     true,
    -   ],
    - ]
    + Array []

      615 |     expect(screen.getByTestId('welcome-pingo')).toBeOnTheScreen();
      616 |     const args = mockWithRepeat.mock.calls.map((call) => call.slice(1));
    > 617 |     expect(args.filter((values) => values.length === 2 && values[0] === -1 && values[1] === true)).toEqual([[-1, true]]);
          |                                                                                                    ^
      618 |   });
      619 |
      620 |   it('con reduce motion no flota', async () => {

      at Object.toEqual (src/screens/welcome/index.test.tsx:617:100)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R10: Pingo flota en bucle › usa la flotación de motion.ts

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      636 |     const source = readSource('screens/welcome/index.tsx');
      637 |     const re = /pingoFloatY\.set\(\s*withRepeat\(\s*withTiming\(\s*-MOTION_FLOAT_OFFSET_Y,\s*MOTION_FLOAT_TIMING,?\s*\),\s*-1,\s*true,?\s*\),?\s*\)/g;
    > 638 |     expect((source.match(re) ?? []).length).toBe(1);
          |                                             ^
      639 |   });
      640 | });
      641 |

      at Object.toBe (src/screens/welcome/index.test.tsx:638:45)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +3 failed, 56 passed, 59 total$' /tmp/153-r10.txt \
&& ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r10.txt \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.test.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
&& git commit -m 'test(mobile-welcome): #153 R10 red pingo idle float'
```

```text
[feature/153-mobile-welcome-pingo 5cacd60a] test(mobile-welcome): #153 R10 red pingo idle float
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 43 insertions(+)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `5cacd60a test(mobile-welcome): #153 R10 red pingo idle float`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T10 verde

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g10.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       59 passed, 59 total
exit=0
```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +59 passed, 59 total$' /tmp/153-g10.txt \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.tsx' \
&& git commit -m 'feat(mobile-welcome): #153 R10 pingo idle float'
```

```text
[feature/153-mobile-welcome-pingo 4c2f54af] feat(mobile-welcome): #153 R10 pingo idle float
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 4 insertions(+), 2 deletions(-)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `4c2f54af feat(mobile-welcome): #153 R10 pingo idle float`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T11 rojo

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r11.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       3 failed, 60 passed, 63 total
exit=1
```

Detalle de cada it rojo (matcher y Expected/Received, consulta o ENOENT):

```text
  ● #153 R11: Pingo parpadea cada cuatro segundos › cierra los ojos a los 4 s y los abre 150 ms después

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "left": 0,
    -   "opacity": 1,
    +   "opacity": 0,
        "position": "absolute",
        "top": 0,
      }

      651 |     expect(getAnimatedStyle(screen.getByTestId('welcome-pingo-blink'))).toEqual({ position: 'absolute', top: 0, left: 0, opacity: 0 });
      652 |     await act(async () => { jest.advanceTimersByTime(200); });
    > 653 |     expect(getAnimatedStyle(screen.getByTestId('welcome-pingo-blink'))).toEqual({ position: 'absolute', top: 0, left: 0, opacity: 1 });
          |                                                                         ^
      654 |     await act(async () => { jest.advanceTimersByTime(200); });
      655 |     expect(getAnimatedStyle(screen.getByTestId('welcome-pingo-blink'))).toEqual({ position: 'absolute', top: 0, left: 0, opacity: 0 });
      656 |   });

      at Object.toEqual (src/screens/welcome/index.test.tsx:653:73)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R11: Pingo parpadea cada cuatro segundos › repite el parpadeo sin fin

    expect(received).toEqual(expected) // deep equality

    - Expected  - 5
    + Received  + 1

    - Array [
    -   Array [
    -     -1,
    -   ],
    - ]
    + Array []

      660 |     expect(screen.getByTestId('welcome-pingo-blink')).toBeOnTheScreen();
      661 |     const args = mockWithRepeat.mock.calls.map((call) => call.slice(1));
    > 662 |     expect(args.filter((values) => values.length === 1 && values[0] === -1)).toEqual([[-1]]);
          |                                                                              ^
      663 |   });
      664 |
      665 |   it('con reduce motion no parpadea', async () => {

      at Object.toEqual (src/screens/welcome/index.test.tsx:662:78)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #153 R11: Pingo parpadea cada cuatro segundos › usa el intervalo y el cambio de motion.ts

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      682 |       /withDelay\(\s*MOTION_FEEDBACK_MS,\s*withTiming\(\s*0,\s*MOTION_BLINK_TIMING,?\s*\),?\s*\)/g,
      683 |     ]) {
    > 684 |       expect((source.match(re) ?? []).length).toBe(1);
          |                                               ^
      685 |     }
      686 |   });
      687 | });

      at Object.toBe (src/screens/welcome/index.test.tsx:684:47)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +3 failed, 60 passed, 63 total$' /tmp/153-r11.txt \
&& ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r11.txt \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.test.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
&& git commit -m 'test(mobile-welcome): #153 R11 red pingo blink'
```

```text
[feature/153-mobile-welcome-pingo 8c48d8a8] test(mobile-welcome): #153 R11 red pingo blink
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 47 insertions(+)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `8c48d8a8 test(mobile-welcome): #153 R11 red pingo blink`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T11 verde

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g11.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       63 passed, 63 total
exit=0
```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +63 passed, 63 total$' /tmp/153-g11.txt \
&& test "$(grep -cF 'cancelAnimation' src/screens/welcome/index.tsx)" = 0 \
&& test "$(grep -cF 'return () =>' src/screens/welcome/index.tsx)" = 0 \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.tsx' \
&& git commit -m 'feat(mobile-welcome): #153 R11 pingo blink'
```

```text
[feature/153-mobile-welcome-pingo 23be4df3] feat(mobile-welcome): #153 R11 pingo blink
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 13 insertions(+), 2 deletions(-)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `23be4df3 feat(mobile-welcome): #153 R11 pingo blink`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T12

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g12.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       64 passed, 64 total
exit=0
```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +64 passed, 64 total$' /tmp/153-g12.txt \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.test.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
&& git commit -m 'test(mobile-welcome): #153 R12 lock no manual loop cleanup'
```

```text
[feature/153-mobile-welcome-pingo cd87dcb1] test(mobile-welcome): #153 R12 lock no manual loop cleanup
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 11 insertions(+)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `cd87dcb1 test(mobile-welcome): #153 R12 lock no manual loop cleanup`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## T13

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g13.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       65 passed, 65 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx src/theme/__tests__/motion.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/153-seven.txt 2>&1; echo "exit=$?"
Test Suites: 7 passed, 7 total
Tests:       275 passed, 275 total
exit=0
```

Cadena de verificación y commit:

```bash
grep -qE '^Tests: +65 passed, 65 total$' /tmp/153-g13.txt \
&& test -z "$(git diff --stat c03ddc09 -- package.json bun.lock)" \
&& test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
&& git add src/screens/welcome/index.test.tsx \
&& test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
&& git commit -m 'test(mobile-welcome): #153 R13 lock no new animation deps'
```

```text
[feature/153-mobile-welcome-pingo 21b60da6] test(mobile-welcome): #153 R13 lock no new animation deps
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 8 insertions(+)
$ tsc --noEmit
$ expo lint
cadena exit=0
```

Commit: `21b60da6 test(mobile-welcome): #153 R13 lock no new animation deps`.

Typecheck: exit=0. Lint: exit=0. Guard router.d.ts: exit=0.

## Cierre técnico

Los siete ficheros se midieron con el árbol final de T13 antes de su commit: 7 suites y 275 tests, todos verdes; salida y exit arriba en T13. Reparto: welcome 65, motion 12, language-provider 24, ui-language 30, design-drift 62, consistency 55 y legibility 27.

```text
$ FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/ui-language.test.ts 'src/app/\(tabs\)/__tests__/food.test.tsx' src/__tests__/hero-header-amendments.test.ts > /tmp/153-close-carta.txt 2>&1; echo "exit=$?"
Test Suites: 6 passed, 6 total
Tests:       219 passed, 219 total
exit=0
```

`pgrep -af '[i]nit\.sh'`: salida vacía, exit=1 (ningún proceso). Se inicia solo Jest móvil completo, sin otro trabajo concurrente.

```text
$ FORCE_COLOR=0 bunx jest > /tmp/153-all.txt 2>&1; echo "exit=$?"
Test Suites: 96 passed, 96 total
Tests:       2275 passed, 2275 total
exit=0
```

Aclaración del cierre por el humano: «si continua», confirmando A5=0 y A7=0 por C1/C3. Los demás A1-A10 conservan su valor inicial.

```text
$ bun run typecheck; echo "exit=$?"
exit=0
$ tsc --noEmit
```

```text
$ bun run lint; echo "exit=$?"
exit=0
$ expo lint
```

## Anclas de cierre: A1-A23, G1-G11, H1-H24 y P1-P8

### A1

```text
$ test -f mobile-pet-tracker/src/theme/motion.ts && echo ok
ok
exit=0
```

### A2

```text
$ grep -cE '^export const MOTION_(FEEDBACK_MS|TRANSITION_MS|SURFACE_MS|STAGGER_MS|ENTRANCE_OFFSET_Y|SETTLE_SPRING|FADE_TIMING|FILL_TIMING)\b' mobile-pet-tracker/src/theme/motion.ts
8
exit=0
```

### A3

```text
$ grep -cF "it('no exporta nada más'" mobile-pet-tracker/src/theme/__tests__/motion.test.ts
1
exit=0
```

### A4

```text
$ test ! -e mobile-pet-tracker/.expo/types/router.d.ts && echo ok
ok
exit=0
```

### A5

```text
$ grep -cF "+ 8, // #118 R1" mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
0
exit=1
```

### A6

```text
$ grep -cF "{ file: 'src/screens/welcome/index.tsx', key: 'welcome.legalNotice' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
1
exit=0
```

### A7

```text
$ grep -cF "it('resuelve las 8 ocurrencias de welcome'" mobile-pet-tracker/src/__tests__/ui-language.test.ts
0
exit=1
```

### A8

```text
$ grep -cF "'welcome.legalNotice':" mobile-pet-tracker/src/i18n/catalog.ts
2
exit=0
```

### A9

```text
$ grep -cF "**6. Idioma:" docs/ui-guidelines.md
1
exit=0
```

### A10

```text
$ grep -cF "## Checklist de autocrítica (cierra toda pantalla nueva o modificada)" docs/ui-guidelines.md
1
exit=0
```

### A11

```text
$ grep -cF "**7. " docs/ui-guidelines.md
1
exit=0
```

### A12

```text
$ grep -cF "### §2.19" specs/mobile-ui-language/design.md
1
exit=0
```

### A13

```text
$ grep -cF "## 3. La infraestructura" specs/mobile-ui-language/design.md
1
exit=0
```

### A14

```text
$ grep -cF "describe('R10', () => {" mobile-pet-tracker/src/screens/welcome/index.test.tsx
0
exit=1
```

### A15

```text
$ grep -cF "it('apila los siete bloques en orden'" mobile-pet-tracker/src/screens/welcome/index.test.tsx
1
exit=0
```

### A16

```text
$ grep -cF "it('pinta hero, marca, tagline y legal con sus clases'" mobile-pet-tracker/src/screens/welcome/index.test.tsx
0
exit=1
```

### A17

```text
$ grep -cF "'w-full rounded-xl bg-accent'" mobile-pet-tracker/src/screens/welcome/index.test.tsx
0
exit=1
```

### A18

```text
$ ls /home/claude/pet-tracker-mascot/webp/ | tr '\n' ' '
pingo-wave-blink.webp pingo-wave.webp 
exit=0
```

### A19

```text
$ ls mobile-pet-tracker/assets/images | grep -cE '^(pingo|mascot)-'
2
exit=0
```

### A20

```text
$ grep -ciP '#(?!\d{2,3} R\d)[\da-f]{3,8}\b|[A-Za-z0-9_-]+-\[[^\]]+\]|StyleSheet|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:' mobile-pet-tracker/src/theme/motion.ts
0
exit=1
```

### A21

```text
$ grep -cF 'Las constantes anteriores a #152 (' docs/ui-guidelines.md
1
exit=0
```

### A22

```text
$ grep -cF '`WELCOME_ENTRANCE_MS`, `BAR_ENTRY_*`, `METRIC_TAB_SPRING` y' docs/ui-guidelines.md
0
exit=1
```

### A23

```text
$ grep -cF '## Enmienda #152 — el movimiento vive en src/theme/motion.ts' docs/ui-guidelines.md
1
exit=0
```

### G1

```text
$ grep -ciP '#(?!\d{2,3} R\d)[\da-f]{3,8}\b' mobile-pet-tracker/src/screens/welcome/index.tsx
0
exit=1
```

### G2

```text
$ grep -cP '[A-Za-z0-9_-]+-\[[^\]]+\]' mobile-pet-tracker/src/screens/welcome/index.tsx
0
exit=1
```

### G3

```text
$ grep -ciP 'StyleSheet|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:' mobile-pet-tracker/src/screens/welcome/index.tsx
0
exit=1
```

### G4

```text
$ grep -cP '\brounded-(?:2xl|lg|md|sm)\b|text-accent(?![-\w])' mobile-pet-tracker/src/screens/welcome/index.tsx
0
exit=1
```

### G5

```text
$ grep -cP 'expo-linear-gradient|expo-symbols|\buseThemeColor\b' mobile-pet-tracker/src/screens/welcome/index.tsx
0
exit=1
```

### G6

```text
$ grep -oP 'text-accent-strong\b' mobile-pet-tracker/src/screens/welcome/index.tsx | wc -l
2
exit=0
```

### G7

```text
$ grep -oP '[\x27"`]/(?:\(auth\)/)?login\b' mobile-pet-tracker/src/screens/welcome/index.tsx | wc -l
1
exit=0
```

### G8

```text
$ grep -oP 'rounded-xl bg-accent(?=[\s\x27"`])' mobile-pet-tracker/src/screens/welcome/index.tsx | wc -l
1
exit=0
```

### G9

```text
$ grep -cP '[A-Za-z0-9_-]+-\[[^\]]+\]' mobile-pet-tracker/src/screens/welcome/index.test.tsx
0
exit=1
```

### G10

```text
$ grep -cP 'use-api|useApi' mobile-pet-tracker/src/screens/welcome/index.test.tsx
0
exit=1
```

### G11

```text
$ grep -ciP '#(?!\d{2,3} R\d)[\da-f]{3,8}\b|[A-Za-z0-9_-]+-\[[^\]]+\]|StyleSheet|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:' mobile-pet-tracker/src/theme/motion.ts
0
exit=1
```

### H1

```text
$ grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-07)' specs/mobile-welcome-pingo/requirements.md
1
exit=0
```

### H2

```text
$ grep -cF -- '- [x] Enmienda E1 aprobada por humano (fecha: 2026-10-08)' specs/mobile-welcome-pingo/requirements.md
1
exit=0
```

### H3

```text
$ grep -cF -- '- [ ] Smoke R14 superado' specs/mobile-welcome-pingo/requirements.md
1
exit=0
```

### H4

```text
$ grep -cF "describe('#153" mobile-pet-tracker/src/screens/welcome/index.test.tsx
13
exit=0
```

### H5

```text
$ grep -cF "describe('#153" mobile-pet-tracker/src/theme/__tests__/motion.test.ts
1
exit=0
```

### H6

```text
$ grep -cF 'WELCOME_ENTRANCE_' mobile-pet-tracker/src/screens/welcome/index.tsx
0
exit=1
```

### H7

```text
$ grep -cF 'WELCOME_ENTRANCE_' mobile-pet-tracker/src/screens/welcome/index.test.tsx
4
exit=0
```

### H8

```text
$ grep -cF 'splash-icon' mobile-pet-tracker/src/screens/welcome/index.tsx
0
exit=1
```

### H9

```text
$ grep -cF 'testID="welcome-hero"' mobile-pet-tracker/src/screens/welcome/index.tsx
0
exit=1
```

### H10

```text
$ grep -cw Easing mobile-pet-tracker/src/screens/welcome/index.tsx
0
exit=1
```

### H11

```text
$ grep -cF "from '../../theme/motion'" mobile-pet-tracker/src/screens/welcome/index.tsx
1
exit=0
```

### H12

```text
$ grep -cF '<Card' mobile-pet-tracker/src/screens/welcome/index.tsx
2
exit=0
```

### H13

```text
$ grep -cF 'border-b-4' mobile-pet-tracker/src/screens/welcome/index.tsx
1
exit=0
```

### H14

```text
$ grep -cF 'cancelAnimation' mobile-pet-tracker/src/screens/welcome/index.tsx
0
exit=1
```

### H15

```text
$ grep -cF 'return () =>' mobile-pet-tracker/src/screens/welcome/index.tsx
0
exit=1
```

### H16

```text
$ grep -cF 'withRepeat' mobile-pet-tracker/src/screens/welcome/index.test.tsx
4
exit=0
```

### H17

```text
$ grep -cF 'readdirSync' mobile-pet-tracker/src/screens/welcome/index.test.tsx
2
exit=0
```

### H18

```text
$ grep -cF 'declare function require' mobile-pet-tracker/src/screens/welcome/index.test.tsx
1
exit=0
```

### H19

```text
$ grep -cF 'StyleSheet.flatten' mobile-pet-tracker/src/screens/welcome/index.test.tsx
1
exit=0
```

### H20

```text
$ grep -cF "'welcome.pingoGreeting'" mobile-pet-tracker/src/i18n/catalog.ts
2
exit=0
```

### H21

```text
$ grep -cF 'welcome.pingoGreeting' mobile-pet-tracker/src/__tests__/ui-copy-table.ts
1
exit=0
```

### H22

```text
$ grep -cF '### §2.20' specs/mobile-ui-language/design.md
1
exit=0
```

### H23

```text
$ grep -cF 'export const MOTION_' mobile-pet-tracker/src/theme/motion.ts
13
exit=0
```

### H24

```text
$ grep -cE 'testID="welcome-(brand|chips)"' mobile-pet-tracker/src/screens/welcome/index.tsx
2
exit=0
```

### P1

```text
$ grep -cF "it('pinta marca, tagline y legal con sus clases'" mobile-pet-tracker/src/screens/welcome/index.test.tsx
1
exit=0
```

### P2

```text
$ grep -cF "'w-full rounded-xl bg-accent border-b-4 border-black/25'" mobile-pet-tracker/src/screens/welcome/index.test.tsx
2
exit=0
```

### P3

```text
$ grep -cF "t('welcome.pingoGreeting')" mobile-pet-tracker/src/screens/welcome/index.tsx
1
exit=0
```

### P4

```text
$ grep -cF '**7. Voz de Pingo: guardián sereno.**' docs/ui-guidelines.md
1
exit=0
```

### P5

```text
$ grep -cF '`WELCOME_ENTRANCE_MS` no está en la lista: la retiró #153, cuya bienvenida' docs/ui-guidelines.md
1
exit=0
```

### P6

```text
$ grep -cF "it('resuelve las 9 ocurrencias de welcome (#153 R1)'" mobile-pet-tracker/src/__tests__/ui-language.test.ts
1
exit=0
```

### P7

```text
$ grep -cF '+ 1, // #153 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
1
exit=0
```

### P8

```text
$ grep -cF "describe('R10', () => {" mobile-pet-tracker/src/screens/welcome/index.test.tsx
0
exit=1
```

Las 66 anclas coinciden con los valores de cierre, incluida la corrección humana A5=0/A7=0. H7 se registra sin valor fijado; H16/H17 cumplen sus mínimos.

## Diffs de cierre contra H0 literal c03ddc09

```text
Directorio: /home/claude/sites/Pet-Tracker-wt-153/mobile-pet-tracker
$ git diff --stat c03ddc09 -- package.json bun.lock app.json src/components src/theme/global.css
(salida vacía)
exit=0
```

```text
Directorio: /home/claude/sites/Pet-Tracker-wt-153
$ git diff --stat c03ddc09 -- backend-pet-tracker/ infra-pet-tracker/
(salida vacía)
exit=0
```

```text
Directorio: /home/claude/sites/Pet-Tracker-wt-153
$ git diff --name-only c03ddc09 HEAD -- mobile-pet-tracker/ | LC_ALL=C sort
mobile-pet-tracker/assets/images/pingo-wave-blink.webp
mobile-pet-tracker/assets/images/pingo-wave.webp
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/welcome/index.test.tsx
mobile-pet-tracker/src/screens/welcome/index.tsx
mobile-pet-tracker/src/theme/__tests__/motion.test.ts
mobile-pet-tracker/src/theme/motion.ts
exit=0
```

Dependencias, configuración Expo, componentes compartidos, tokens, backend e infra sin cambios; exactamente los diez ficheros móviles autorizados.

## Registro de los 27 commits propios

La corrección del leader `1f18d037` queda fuera de los 27 commits propios. El orden rojo/verde se conserva; T12 y T13 nacen verdes. Trazabilidad se rellena una sola vez ahora, solo su columna de commits.

| Nº | Tarea | Requisito | Hash + mensaje |
|---|---|---|---|
| 1 | T1 | R2 | `a9064d8a test(mobile-welcome): #153 R2 red pingo voice in the charter` |
| 2 | T1 | R2 | `6f0e54f8 feat(mobile-welcome): #153 R2 pingo voice in the charter` |
| 3 | T2 | R4 | `f7943c81 test(mobile-welcome): #153 R4 red pingo motion constants` |
| 4 | T2 | R4 | `3083d34d feat(mobile-welcome): #153 R4 pingo motion constants` |
| 5 | T3 | R3 | `3f974134 test(mobile-welcome): #153 R3 red pingo webp poses` |
| 6 | T3 | R3 | `be10ffef feat(mobile-welcome): #153 R3 pingo webp poses` |
| 7 | T4 | R1 | `1a363846 test(mobile-welcome): #153 R1 red pingo greeting copy` |
| 8 | T4 | R1 | `be5a716e feat(mobile-welcome): #153 R1 pingo greeting copy` |
| 9 | T5 | R5 | `59b13cbf test(mobile-welcome): #153 R5 red pingo scene replaces the logo` |
| 10 | T5 | R5 | `2e677522 feat(mobile-welcome): #153 R5 pingo scene replaces the logo` |
| 11 | T6 | R6 | `78ad2489 test(mobile-welcome): #153 R6 red pingo pose and blink layer` |
| 12 | T6 | R6 | `69780061 feat(mobile-welcome): #153 R6 pingo pose and blink layer` |
| 13 | T7 | R7 | `d6cade3d test(mobile-welcome): #153 R7 red primary cta lip` |
| 14 | T7 | R7 | `2caff4fe feat(mobile-welcome): #153 R7 primary cta lip` |
| 15 | T8 | R8 | `ac731b91 test(mobile-welcome): #153 R8 red entrance from motion.ts` |
| 16 | T8 | R8 | `4a41eabc feat(mobile-welcome): #153 R8 entrance from motion.ts` |
| 17 | T8b | E1 | `8b8bd35e test(mobile-welcome): #153 E1 red charter retires WELCOME_ENTRANCE_MS` |
| 18 | T8b | E1 | `b273cf52 feat(mobile-welcome): #153 E1 charter retires WELCOME_ENTRANCE_MS` |
| 19 | T9 | R9 | `5545b4ae test(mobile-welcome): #153 R9 red pingo entrance scale` |
| 20 | T9 | R9 | `9c1a1450 feat(mobile-welcome): #153 R9 pingo entrance scale` |
| 21 | T10 | R10 | `5cacd60a test(mobile-welcome): #153 R10 red pingo idle float` |
| 22 | T10 | R10 | `4c2f54af feat(mobile-welcome): #153 R10 pingo idle float` |
| 23 | T11 | R11 | `8c48d8a8 test(mobile-welcome): #153 R11 red pingo blink` |
| 24 | T11 | R11 | `23be4df3 feat(mobile-welcome): #153 R11 pingo blink` |
| 25 | T12 | R12 | `cd87dcb1 test(mobile-welcome): #153 R12 lock no manual loop cleanup` |
| 26 | T13 | R13 | `21b60da6 test(mobile-welcome): #153 R13 lock no new animation deps` |
| 27 | Cierre | R1-R13, E1 | `HEAD docs(mobile-welcome-pingo): #153 traceability` |

El commit 27 contiene este registro: se identifica como `HEAD` para evitar autorreferenciar su hash. Su hash literal se obtiene con `git log -1 --format=%h` y se comunica en el cierre al humano. No se modifica el historial después de registrar los hashes.

R1 cita T4 y T5; R5 cita T5; E1 cita T8b; R12 y R13 citan un commit cada uno. Frontmatter, columnas de tests y fila R14 conservados.

## Lista cerrada y commit final de trazabilidad

La lista se mide en el índice preparado para el commit final: exactamente los 14 ficheros autorizados. Tras el commit se comprobará la misma lista contra HEAD; no se añade otro commit para registrar el resultado de un documento que se contiene a sí mismo.

```text
$ git diff --cached --name-only c03ddc09 -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-welcome-pingo.md' ':!specs/mobile-welcome-pingo/requirements.md' ':!specs/mobile-welcome-pingo/design.md' ':!specs/mobile-welcome-pingo/tasks.md' ':!progress/review_mobile-welcome-pingo.md'
docs/ui-guidelines.md
mobile-pet-tracker/assets/images/pingo-wave-blink.webp
mobile-pet-tracker/assets/images/pingo-wave.webp
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/welcome/index.test.tsx
mobile-pet-tracker/src/screens/welcome/index.tsx
mobile-pet-tracker/src/theme/__tests__/motion.test.ts
mobile-pet-tracker/src/theme/motion.ts
progress/impl_mobile-welcome-pingo.md
specs/mobile-ui-language/design.md
specs/mobile-welcome-pingo/traceability.md
exit=0
```

Cadena final autorizada, desde la raíz:

```bash
git add specs/mobile-welcome-pingo/traceability.md progress/impl_mobile-welcome-pingo.md \
  && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-welcome-pingo.md specs/mobile-welcome-pingo/traceability.md ' \
  && git commit -m 'docs(mobile-welcome-pingo): #153 traceability'
```

Verificación posterior del mismo árbol, sin modificar ficheros:

```bash
git diff --name-only c03ddc09 HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-welcome-pingo.md' ':!specs/mobile-welcome-pingo/requirements.md' ':!specs/mobile-welcome-pingo/design.md' ':!specs/mobile-welcome-pingo/tasks.md' ':!progress/review_mobile-welcome-pingo.md'
git log -1 --format=%h
git status --short
```

R1-R13 y E1 implementados. Carta, tokens y componentes compartidos respetados; dependencia nueva: ninguna. Ninguna decisión de producto o movimiento reabierta. La única aclaración del cierre fue A5=0/A7=0, confirmada por el humano; la excepción de TypeScript se resolvió con el handoff del leader 1f18d037. No se ejecutó init.sh, no se cambió infraestructura y no se hizo push ni PR.

R14: pendiente del smoke humano
