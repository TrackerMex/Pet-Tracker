```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-152
$ git branch --show-current
feature/152-mobile-home-motion-foundations
$ git rev-parse --short HEAD
36f91e6e
$ git status --short
```

H0: `36f91e6e`. Estado inicial vacío; branch correcta.

## Anclas iniciales (árbol H0)

```text
0. $ grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-06, vía Notion' ../specs/mobile-home-motion-foundations/requirements.md
1
1. $ grep -rlF 'entering=' src | wc -l
0
2. $ test -e src/theme/motion.ts; echo $?
1
3. $ grep -cF -- '--motion' src/theme/global.css
0
4. $ grep -rlF 'home-entrance' src | wc -l
0
5. $ grep -cF 'promueven a tokens `--motion-*` en global.css' ../docs/ui-guidelines.md
1
6. $ grep -cF 'unmountOnBlur' 'src/app/(tabs)/_layout.tsx'
0
7. $ grep -cF "expect(mockWithTiming).not.toHaveBeenCalled()" src/screens/home/index.test.tsx
1
8. $ grep -cF '.children.flatMap((child) =>' src/screens/home/index.test.tsx
4
9. $ grep -cF 'BAR_ENTRY_STAGGER_MS = 40' src/screens/home/weekly-activity-chart.tsx
1
10. $ grep -cF "dot: 'bg-success'" src/components/pet-hero-header.tsx
1
11. $ grep -cF "dot: 'bg-warning-strong'" src/components/pet-hero-header.tsx
1
12. $ test -e src/screens/home/home-entrance.tsx; echo $?
1
13. $ test -e src/screens/home/home-entrance.test.tsx; echo $?
1
14. $ test -e src/screens/home/collar-battery-bar.tsx; echo $?
1
15. $ test -e src/theme/__tests__/motion.test.ts; echo $?
1
16. $ grep -cF 'testID="home-content"' src/screens/home/index.tsx
1
17. $ grep -cF 'className="flex-row"' src/screens/home/index.tsx
1
18. $ grep -cF 'testID="summary-skeleton"' src/screens/home/index.tsx
1
19. $ grep -cF 'testID="collar-battery"' src/screens/home/index.tsx
1
20. $ grep -cF "t('home.noCollar')" src/screens/home/index.tsx
1
21. $ grep -cF 'const detail = useQuery({' src/screens/home/index.tsx
1
22. $ grep -cF 'const { selectedPetId, selectPet } = useSelectedPet();' src/screens/home/index.tsx
1
23. $ grep -cF 'MEALS_BAR_TIMING' src/screens/home/index.tsx
2
24. $ grep -cF "describe('R10: refetch al foco'" src/screens/home/index.test.tsx
1
25. $ grep -cF "it('selects a pressed pet and reloads its detail and activity'" src/screens/home/index.test.tsx
1
26. $ grep -cF "it('queda entre el resumen y la última posición en el árbol'" src/screens/home/index.test.tsx
1
27. $ grep -cF "it('coloca la tira sobre la tarjeta del collar'" src/screens/home/index.test.tsx
1
28. $ grep -cF "it('coloca la rejilla entre el collar y la actividad semanal'" src/screens/home/index.test.tsx
1
29. $ grep -cF "it('coloca la sección entre la actividad semanal y la última posición'" src/screens/home/index.test.tsx
1
30. $ grep -cF 'const mockWithTiming = jest.fn(' src/screens/home/index.test.tsx
1
31. $ grep -cF 'const mockUseReducedMotion = jest.fn' src/screens/home/index.test.tsx
1
32. $ grep -cF 'withDelay: jest.fn(' src/screens/home/index.test.tsx
1
33. $ grep -cF "describe('#152" src/screens/home/index.test.tsx
0
34. $ grep -cF "describe('#152" src/__tests__/design-drift.test.ts
0
35. $ grep -cF 'const MEALS_BAR_STYLE_ESCAPES = new RegExp(' src/__tests__/design-drift.test.ts
1
36. $ grep -cF "describe('#98 R10: la barra de comidas no mete drift de estilo'" src/__tests__/design-drift.test.ts
2
37. $ grep -cF '## Enmienda #152' ../docs/ui-guidelines.md
0
38. $ grep -cF 'Enmienda aprobada por humano' ../docs/ui-guidelines.md
2
39. $ grep -cF -- '- [ ] Enmienda aprobada por humano' ../docs/ui-guidelines.md
0
40. $ test ! -e .expo/types/router.d.ts; echo $?
0
```

## Arranque y skills

`git fetch origin`: exit=0. `git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`: `exit=0`.
`test -d node_modules && echo presente`: `presente` (sin instalación).
`test ! -e .expo/types/router.d.ts; echo "exit=$?"`: `exit=0`.

Skills leídas: `building-native-ui` del plugin Expo (`/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`), `.agents/skills/animate-expo/SKILL.md`, `.agents/skills/animation-vocabulary/SKILL.md`, `.agents/skills/review-animations/SKILL.md`, `.agents/skills/emil-design-eng/SKILL.md` y `ponytail:ponytail`. La spec aprobada prevalece sobre las sugerencias de estilos, presets, Expo Go y valores de las skills. D1-D6 no se reabren. R10 y las firmas de la carta quedan para el humano; init.sh y PR para el leader.

Base medida sin pipe:
```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx src/__tests__/design-drift.test.ts src/theme/__tests__/global-css.test.ts > /tmp/152-base.txt 2>&1; echo "exit=$?"
Test Suites: 3 passed, 3 total
Tests:       281 passed, 281 total
exit=0
```


```text
$ FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts > /tmp/152-r1.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       6 failed, 6 total
exit=1

#152 R1: las duraciones y el preset de movimiento viven en un solo sitio › declara las tres duraciones de la carta
expect(received).toEqual(expected) // deep equality

    - Expected  - 3
    + Received  + 3

      Array [
    -   150,
    -   250,
    -   400,
    +   undefined,
    +   undefined,
    +   undefined,
      ]

#152 R1: las duraciones y el preset de movimiento viven en un solo sitio › declara el escalonado y el desplazamiento de la entrada
expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      Array [
    -   60,
    -   12,
    +   undefined,
    +   undefined,
      ]

#152 R1: las duraciones y el preset de movimiento viven en un solo sitio › declara un muelle de asentamiento sin rebote
expect(received).toEqual(expected) // deep equality

    Expected: {"dampingRatio": 1, "duration": 250, "reduceMotion": "system"}
    Received: undefined

#152 R1: las duraciones y el preset de movimiento viven en un solo sitio › declara un fundido ease-out que sobrevive a reduce motion
expect(received).toEqual(expected) // deep equality

    Expected: {"duration": 250, "easing": {"bezier": [0.23, 1, 0.32, 1]}, "reduceMotion": "never"}
    Received: undefined

#152 R1: las duraciones y el preset de movimiento viven en un solo sitio › declara el relleno de barra ease-in-out
expect(received).toEqual(expected) // deep equality

    Expected: {"duration": 250, "easing": {"bezier": [0.77, 0, 0.175, 1]}, "reduceMotion": "system"}
    Received: undefined

#152 R1: las duraciones y el preset de movimiento viven en un solo sitio › no exporta nada más
expect(received).toEqual(expected) // deep equality

    - Expected  - 10
    + Received  +  1

    - Array [
    -   "MOTION_ENTRANCE_OFFSET_Y",
    -   "MOTION_FADE_TIMING",
    -   "MOTION_FEEDBACK_MS",
    -   "MOTION_FILL_TIMING",
    -   "MOTION_SETTLE_SPRING",
    -   "MOTION_STAGGER_MS",
    -   "MOTION_SURFACE_MS",
    -   "MOTION_TRANSITION_MS",
    - ]
    + Array []
```

```text
$ FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts > /tmp/152-r1.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       6 failed, 6 total
exit=1

#152 R1: las duraciones y el preset de movimiento viven en un solo sitio › declara las tres duraciones de la carta
expect(received).toBe(expected) // Object.is equality

    Expected: 150
    Received: undefined

#152 R1: las duraciones y el preset de movimiento viven en un solo sitio › declara el escalonado y el desplazamiento de la entrada
expect(received).toBe(expected) // Object.is equality

    Expected: 60
    Received: undefined

#152 R1: las duraciones y el preset de movimiento viven en un solo sitio › declara un muelle de asentamiento sin rebote
expect(received).toEqual(expected) // deep equality

    Expected: {"dampingRatio": 1, "duration": 250, "reduceMotion": "system"}
    Received: undefined

#152 R1: las duraciones y el preset de movimiento viven en un solo sitio › declara un fundido ease-out que sobrevive a reduce motion
expect(received).toEqual(expected) // deep equality

    Expected: {"duration": 250, "easing": {"bezier": [0.23, 1, 0.32, 1]}, "reduceMotion": "never"}
    Received: undefined

#152 R1: las duraciones y el preset de movimiento viven en un solo sitio › declara el relleno de barra ease-in-out
expect(received).toEqual(expected) // deep equality

    Expected: {"duration": 250, "easing": {"bezier": [0.77, 0, 0.175, 1]}, "reduceMotion": "system"}
    Received: undefined

#152 R1: las duraciones y el preset de movimiento viven en un solo sitio › no exporta nada más
expect(received).toEqual(expected) // deep equality

    - Expected  - 10
    + Received  +  1

    - Array [
    -   "MOTION_ENTRANCE_OFFSET_Y",
    -   "MOTION_FADE_TIMING",
    -   "MOTION_FEEDBACK_MS",
    -   "MOTION_FILL_TIMING",
    -   "MOTION_SETTLE_SPRING",
    -   "MOTION_STAGGER_MS",
    -   "MOTION_SURFACE_MS",
    -   "MOTION_TRANSITION_MS",
    - ]
    + Array []
```

Cadena de verificación y commit (R1 rojo ():
```bash
grep -qE '^Tests: +6 failed, 6 total$' /tmp/152-r1.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r1.txt \
    && test ! -e .expo/types/router.d.ts \
    && { bun run typecheck > /tmp/152-r1-tsc.txt 2>&1 || true; } \
    && test "$(grep -c 'error TS' /tmp/152-r1-tsc.txt)" = "$(grep -cE '^src/theme/__tests__/motion\.test\.ts\([0-9]+,[0-9]+\): error TS2305:' /tmp/152-r1-tsc.txt)" \
    && bun run lint \
    && git add src/theme/__tests__/motion.test.ts src/theme/motion.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/theme/__tests__/motion.test.ts mobile-pet-tracker/src/theme/motion.ts ' \
    && git commit -m 'test(mobile-home): #152 R1 red, motion constants'
```
```text
[feature/152-mobile-home-motion-foundations f110abac] test(mobile-home): #152 R1 red, motion constants
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 70 insertions(+)
 create mode 100644 mobile-pet-tracker/src/theme/__tests__/motion.test.ts
 create mode 100644 mobile-pet-tracker/src/theme/motion.ts
$ expo lint
exit=0
```

Commit: `f110abac test(mobile-home): #152 R1 red, motion constants`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

```text
$ FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts > /tmp/152-g1.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
exit=0


```

Cadena de verificación y commit (R1 verde:):
```bash
grep -qE '^Tests: +6 passed, 6 total$' /tmp/152-g1.txt \
    && test "$(grep -cF 'export const MOTION_' src/theme/motion.ts)" = 8 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/theme/motion.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/theme/motion.ts' \
    && git commit -m 'feat(mobile-home): #152 R1 motion constants in theme/motion.ts'
```
```text
[feature/152-mobile-home-motion-foundations a588f1d8] feat(mobile-home): #152 R1 motion constants in theme/motion.ts
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 22 insertions(+), 1 deletion(-)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `a588f1d8 feat(mobile-home): #152 R1 motion constants in theme/motion.ts`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

```text
$ FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts > /tmp/152-r2.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       3 failed, 6 passed, 9 total
exit=1

#152 R2: la carta apunta a motion.ts › la carta nombra motion.ts en §Animación y ya no promete tokens --motion-*
expect(received).toContain(expected) // indexOf

    Expected substring: "`src/theme/motion.ts` (enmienda A21 de #152)"
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
      250ms transición, 400ms superficies grandes — si se repiten, se
      promueven a tokens `--motion-*` en global.css.
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
    - [X] Enmienda aprobada por humano
    "

#152 R2: la carta apunta a motion.ts › la carta declara la enmienda #152 con su casilla
expect(received).toContain(expected) // indexOf

    Expected substring: "## Enmienda #152 — el movimiento vive en src/theme/motion.ts"
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
      250ms transición, 400ms superficies grandes — si se repiten, se
      promueven a tokens `--motion-*` en global.css.
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
    - [X] Enmienda aprobada por humano
    "

#152 R2: la carta apunta a motion.ts › global.css no declara tokens de movimiento
expect(received).not.toContain(expected) // indexOf

    Expected substring: not "--motion"
    Received string:        "@import 'tailwindcss';
    @import 'uniwind';
    @import 'heroui-native/styles';

    @source '../../node_modules/heroui-native/lib';
    @source '../';

    @theme {
      --font-normal: 'Inter-Regular';
      --font-medium: 'Inter-Medium';
      --font-semibold: 'Inter-SemiBold';
      --font-bold: 'Inter-Bold';
      --font-black: 'Inter-Black';
      --radius-card: 20px;
      --text-2xs: 10px;
    }

    @theme inline {
      --color-accent-strong: var(--accent-strong);
      --color-warning-strong: var(--warning-strong);
    }

    @layer theme {
      :root {
        @variant light {
          --background: #FFFFFF;
          --foreground: #0D1117;
          --surface: #FFFFFF;
          --surface-foreground: #0D1117;
          --glass-surface: rgba(255,255,255,0.60);
          --tab-pill: rgba(23,130,85,0.14);
          --surface-secondary: #F0FBF6;
          --surface-secondary-foreground: #0D1117;
          --default: #F5F6F8;
          --default-foreground: #0D1117;
          --muted: #667085;
          --border: rgba(13,17,23,0.07);
          --separator: rgba(13,17,23,0.07);
          --accent: #178255;
          --accent-strong: #107148;
          --accent-foreground: #FFFFFF;
          --danger: #EF4444;
          --warning: #F59E0B;
          --warning-strong: #92610A;
          --success: #0F9B5A;
          --color-accent: #178255;
          --color-accent-strong: #107148;
          --color-accent-foreground: #FFFFFF;
          --color-muted: #667085;
          --color-glass-surface: rgba(255,255,255,0.60);
          --color-tab-pill: rgba(23,130,85,0.14);
          --color-danger: #EF4444;
          --color-warning: #F59E0B;
          --color-success: #0F9B5A;
          --color-category-blue: #EFF6FF;
          --color-category-blue-strong: #0768E0;
          --color-category-amber: #FFF7ED;
          --color-category-amber-strong: #A55E07;
          --color-category-green: #F0FBF6;
          --color-category-green-strong: #107148;
          --color-category-violet: #F5F3FF;
          --color-category-violet-strong: #7549F7;
          --color-category-rose: #FFF0F3;
          --color-category-rose-strong: #D80B34;
          --focus: #178255;
          --field-background: var(--default);
          --field-foreground: var(--foreground);
          --field-placeholder: var(--muted);
          --field-border: transparent;
          --field-radius: 0.75rem;
        }

        @variant dark {
          --background: #0D1117;
          --foreground: #F7F8FA;
          --surface: #161B22;
          --surface-foreground: #F7F8FA;
          --glass-surface: rgba(22,27,34,0.60);
          --tab-pill: rgba(23,130,85,0.22);
          --surface-secondary: #12231B;
          --surface-secondary-foreground: #F7F8FA;
          --default: #1F242B;
          --default-foreground: #F7F8FA;
          --muted: #9CA3AF;
          --border: rgba(255,255,255,0.08);
          --separator: rgba(255,255,255,0.08);
          --accent: #178255;
          --accent-strong: #2AB87C;
          --accent-foreground: #FFFFFF;
          --danger: #F87171;
          --warning: #FBBF24;
          --warning-strong: #FBBF24;
          --success: #34D399;
          --color-accent: #178255;
          --color-accent-strong: #2AB87C;
          --color-accent-foreground: #FFFFFF;
          --color-muted: #9CA3AF;
          --color-glass-surface: rgba(22,27,34,0.60);
          --color-tab-pill: rgba(23,130,85,0.22);
          --color-danger: #F87171;
          --color-warning: #FBBF24;
          --color-success: #34D399;
          --color-category-blue: #0B203A;
          --color-category-blue-strong: #4A8DDF;
          --color-category-amber: #271E14;
          --color-category-amber-strong: #C17B22;
          --color-category-green: #12231B;
          --color-category-green-strong: #2AB87C;
          --color-category-violet: #221C33;
          --color-category-violet-strong: #9579E7;
          --color-category-rose: #39131A;
          --color-category-rose-strong: #E35E78;
          --focus: #178255;
          --field-background: var(--default);
          --field-foreground: var(--foreground);
          --field-placeholder: var(--muted);
          --field-border: transparent;
          --field-radius: 0.75rem;
        }
      }
    }
    /* --motion */
    "
```

```text
$ FORCE_COLOR=0 bunx jest src/theme/__tests__/global-css.test.ts src/__tests__/design-drift.test.ts > /tmp/152-r2-info.txt 2>&1; echo "exit=$?"
Test Suites: 2 passed, 2 total
Tests:       112 passed, 112 total
exit=0


```

Cadena de verificación y commit (R2 rojo ():
```bash
grep -qE '^Tests: +3 failed, 6 passed, 9 total$' /tmp/152-r2.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r2.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/theme/__tests__/motion.test.ts src/theme/global.css \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/theme/__tests__/motion.test.ts mobile-pet-tracker/src/theme/global.css ' \
    && git commit -m 'test(mobile-home): #152 R2 red, charter points to motion.ts'
```
```text
[feature/152-mobile-home-motion-foundations 595665b3] test(mobile-home): #152 R2 red, charter points to motion.ts
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 35 insertions(+)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `595665b3 test(mobile-home): #152 R2 red, charter points to motion.ts`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

Informativo R2: global-css y design-drift, 112/112 verdes; ningún it adicional cayó con la mutación.

```text
$ FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts > /tmp/152-g2.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
exit=0


```

Cadena de verificación y commit (R2 verde ():
```bash
grep -qE '^Tests: +9 passed, 9 total$' /tmp/152-g2.txt \
    && test "$(grep -cF '`src/theme/motion.ts` (enmienda A21 de #152)' ../docs/ui-guidelines.md)" = 1 \
    && test "$(grep -cF 'promueven a tokens' ../docs/ui-guidelines.md)" = 0 \
    && test "$(grep -cF -- '--motion' src/theme/global.css)" = 0 \
    && test "$(grep -cF -- '- [ ] Enmienda aprobada por humano' ../docs/ui-guidelines.md)" = 1 \
    && test -z "$(git diff --stat 36f91e6e -- src/theme/global.css)" \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add ../docs/ui-guidelines.md src/theme/global.css \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'docs/ui-guidelines.md mobile-pet-tracker/src/theme/global.css ' \
    && git commit -m 'docs(mobile-home): #152 R2 charter amendment A21 for motion.ts'
```
```text
[feature/152-mobile-home-motion-foundations 40ef31a7] docs(mobile-home): #152 R2 charter amendment A21 for motion.ts
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 21 insertions(+), 3 deletions(-)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `40ef31a7 docs(mobile-home): #152 R2 charter amendment A21 for motion.ts`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/home-entrance.test.tsx > /tmp/152-r3.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 2 total
exit=1

#152 R3: la receta de entrada de la Home › parte invisible y desplazada y llega opaca y en su sitio
TypeError: (0 , _homeEntrance.homeEntering) is not a function

#152 R3: la receta de entrada de la Home › no anima nada hasta que se invoca
TypeError: (0 , _homeEntrance.homeEntering) is not a function
```

Cadena de verificación y commit (R3 rojo ():
```bash
grep -qE '^Tests: +2 failed, 2 total$' /tmp/152-r3.txt \
    && test "$(grep -cE 'TypeError: .*homeEntering\)? is not a function' /tmp/152-r3.txt)" -ge 2 \
    && test "$(grep -c 'TypeError' /tmp/152-r3.txt)" = "$(grep -cE 'TypeError: .*homeEntering\)? is not a function' /tmp/152-r3.txt)" \
    && ! grep -qE 'ReferenceError|SyntaxError|Cannot find module' /tmp/152-r3.txt \
    && test ! -e .expo/types/router.d.ts \
    && { bun run typecheck > /tmp/152-r3-tsc.txt 2>&1 || true; } \
    && test "$(grep -c 'error TS' /tmp/152-r3-tsc.txt)" = "$(grep -cE '^src/screens/home/home-entrance\.test\.tsx\([0-9]+,[0-9]+\): error TS2305:' /tmp/152-r3-tsc.txt)" \
    && bun run lint \
    && git add src/screens/home/home-entrance.test.tsx src/screens/home/home-entrance.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/home/home-entrance.test.tsx mobile-pet-tracker/src/screens/home/home-entrance.tsx ' \
    && git commit -m 'test(mobile-home): #152 R3 red, home entrance recipe'
```
```text
[feature/152-mobile-home-motion-foundations de2bab96] test(mobile-home): #152 R3 red, home entrance recipe
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 65 insertions(+)
 create mode 100644 mobile-pet-tracker/src/screens/home/home-entrance.test.tsx
 create mode 100644 mobile-pet-tracker/src/screens/home/home-entrance.tsx
$ expo lint
exit=0
```

Commit: `de2bab96 test(mobile-home): #152 R3 red, home entrance recipe`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/home-entrance.test.tsx > /tmp/152-g3.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
exit=0


```

Cadena de verificación y commit (R3 verde:):
```bash
grep -qE '^Tests: +2 passed, 2 total$' /tmp/152-g3.txt \
    && test "$(grep -cF "'worklet'" src/screens/home/home-entrance.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/home-entrance.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/home-entrance.tsx' \
    && git commit -m 'feat(mobile-home): #152 R3 homeEntering worklet'
```
```text
[feature/152-mobile-home-motion-foundations 0b2ba0da] feat(mobile-home): #152 R3 homeEntering worklet
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 18 insertions(+), 1 deletion(-)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `0b2ba0da feat(mobile-home): #152 R3 homeEntering worklet`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/home-entrance.test.tsx > /tmp/152-r4.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       4 failed, 2 passed, 6 total
exit=1

#152 R4: HomeEntrance escalona por índice y respeta reduce motion › el índice 0 entra sin espera y desplazado 12
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

#152 R4: HomeEntrance escalona por índice y respeta reduce motion › el índice 5 espera 300 ms
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

#152 R4: HomeEntrance escalona por índice y respeta reduce motion › bajo reduce motion conserva el fundido y el escalonado y no desplaza
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

#152 R4: HomeEntrance escalona por índice y respeta reduce motion › no añade estilo propio
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
```

Cadena de verificación y commit (R4 rojo ():
```bash
grep -qE '^Tests: +4 failed, 2 passed, 6 total$' /tmp/152-r4.txt \
    && test "$(grep -cF 'Element type is invalid' /tmp/152-r4.txt)" -ge 4 \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r4.txt \
    && test ! -e .expo/types/router.d.ts \
    && { bun run typecheck > /tmp/152-r4-tsc.txt 2>&1 || true; } \
    && test "$(grep -c 'error TS' /tmp/152-r4-tsc.txt)" = "$(grep -cE '^src/screens/home/home-entrance\.test\.tsx\([0-9]+,[0-9]+\): error TS2305:' /tmp/152-r4-tsc.txt)" \
    && bun run lint \
    && git add src/screens/home/home-entrance.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/home-entrance.test.tsx' \
    && git commit -m 'test(mobile-home): #152 R4 red, staggered HomeEntrance'
```
```text
[feature/152-mobile-home-motion-foundations 3f42c163] test(mobile-home): #152 R4 red, staggered HomeEntrance
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 65 insertions(+), 1 deletion(-)
$ expo lint
exit=0
```

Commit: `3f42c163 test(mobile-home): #152 R4 red, staggered HomeEntrance`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/home-entrance.test.tsx > /tmp/152-g4.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       4 failed, 2 passed, 6 total
exit=1

#152 R4: HomeEntrance escalona por índice y respeta reduce motion › el índice 0 entra sin espera y desplazado 12
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

#152 R4: HomeEntrance escalona por índice y respeta reduce motion › el índice 5 espera 300 ms
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

#152 R4: HomeEntrance escalona por índice y respeta reduce motion › bajo reduce motion conserva el fundido y el escalonado y no desplaza
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

#152 R4: HomeEntrance escalona por índice y respeta reduce motion › no añade estilo propio
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
```

Cadena de verificación y commit (R4 verde:):
```bash
grep -qE '^Tests: +6 passed, 6 total$' /tmp/152-g4.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/home-entrance.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/home-entrance.tsx' \
    && git commit -m 'feat(mobile-home): #152 R4 HomeEntrance wrapper'
```
```text
exit=1
```

PARADA: cadena no llegó al commit. Salida anterior; no se continúa.

## PARADA — verde de R4 no registrado

La cadena de R4 verde no llegó al commit. Falló su primer eslabón:

```bash
grep -qE '^Tests: +6 passed, 6 total$' /tmp/152-g4.txt
```

Salida del eslabón: vacía; exit=1. La medición previa produjo:

```text
Test Suites: 1 failed, 1 total
Tests:       4 failed, 2 passed, 6 total
exit=1
```

Los cuatro it de R4 fallaron con `Element type is invalid ... got: undefined`,
ahora con `Check the render method of HomeEntrance`. Sus nombres y errores
están copiados arriba. El componente `HomeEntrance` sí está exportado en el
árbol de trabajo. El doble de Reanimated que escribí en R3 omite
`__esModule: true`, mientras que el doble existente de `index.test.tsx`
sí lo declara. La causa probable es esa omisión: el import default de
`Animated` no conserva la forma esperada y `Animated.View` queda indefinido.
Es un error de preparación mío, no una diferencia en las decisiones D1-D6.
No se modificó el doble ni se introdujo un workaround de producción.

Se cumple la parada exigida por el handoff. No se intentó de nuevo la cadena;
typecheck y lint de R4 verde no llegaron a ejecutarse. No se inició R5,
no se rellenó traceability ni se ejecutó el Cierre. R10 sigue pendiente del
humano. La implementación de R4 queda sin commit para inspección del leader;
el reporte también queda sin commit, porque el commit final está reservado
para después del Cierre. No hubo push, PR, merge, rebase, init.sh ni acceso a
Postgres/LocalStack.

Commits registrados, en orden:

```text
f110abac test(mobile-home): #152 R1 red, motion constants
a588f1d8 feat(mobile-home): #152 R1 motion constants in theme/motion.ts
595665b3 test(mobile-home): #152 R2 red, charter points to motion.ts
40ef31a7 docs(mobile-home): #152 R2 charter amendment A21 for motion.ts
de2bab96 test(mobile-home): #152 R3 red, home entrance recipe
0b2ba0da feat(mobile-home): #152 R3 homeEntering worklet
3f42c163 test(mobile-home): #152 R4 red, staggered HomeEntrance
```

Estado al parar:
```text
 M mobile-pet-tracker/src/screens/home/home-entrance.tsx
?? progress/impl_mobile-home-motion-foundations.md
```

Typecheck de los rojos con TS2305 (salidas completas):

```text
/tmp/152-r1-tsc.txt
$ tsc --noEmit
src/theme/__tests__/motion.test.ts(2,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_FEEDBACK_MS'.
src/theme/__tests__/motion.test.ts(3,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_TRANSITION_MS'.
src/theme/__tests__/motion.test.ts(4,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_SURFACE_MS'.
src/theme/__tests__/motion.test.ts(5,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_STAGGER_MS'.
src/theme/__tests__/motion.test.ts(6,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_ENTRANCE_OFFSET_Y'.
src/theme/__tests__/motion.test.ts(7,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_SETTLE_SPRING'.
src/theme/__tests__/motion.test.ts(8,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_FADE_TIMING'.
src/theme/__tests__/motion.test.ts(9,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_FILL_TIMING'.
```

```text
/tmp/152-r3-tsc.txt
$ tsc --noEmit
src/screens/home/home-entrance.test.tsx(3,10): error TS2305: Module '"./home-entrance"' has no exported member 'homeEntering'.
```

```text
/tmp/152-r4-tsc.txt
$ tsc --noEmit
src/screens/home/home-entrance.test.tsx(5,24): error TS2305: Module '"./home-entrance"' has no exported member 'HomeEntrance'.
```

## Reanudacion E1

E1.1 Estado:
```text
$ git status --short
 M mobile-pet-tracker/src/screens/home/home-entrance.tsx
?? progress/impl_mobile-home-motion-foundations.md
$ git log -1 --format=%s
docs(mobile-home-motion-foundations): #152 handoff amendment E1
$ git branch --show-current
feature/152-mobile-home-motion-foundations
```

H0 permanece `36f91e6e`; la enmienda del leader es `c0bf53cb`. Las skills ya cargadas y D1-D6 siguen vigentes.

E1.2:
```text
$ git stash push -- src/screens/home/home-entrance.tsx && git diff --quiet HEAD -- src/screens/home/home-entrance.tsx; echo "exit=$?"
Saved working directory and index state WIP on feature/152-mobile-home-motion-foundations: c0bf53cb docs(mobile-home-motion-foundations): #152 handoff amendment E1
exit=0
```

E1.3: única línea añadida al factory del doble, inmediatamente después del spread: `__esModule: true,`.
```text
$ grep -cF '__esModule: true,' src/screens/home/home-entrance.test.tsx
1
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/home-entrance.test.tsx > /tmp/152-r4e1.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       4 failed, 2 passed, 6 total
exit=1

#152 R4: HomeEntrance escalona por índice y respeta reduce motion › el índice 0 entra sin espera y desplazado 12
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

#152 R4: HomeEntrance escalona por índice y respeta reduce motion › el índice 5 espera 300 ms
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

#152 R4: HomeEntrance escalona por índice y respeta reduce motion › bajo reduce motion conserva el fundido y el escalonado y no desplaza
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

#152 R4: HomeEntrance escalona por índice y respeta reduce motion › no añade estilo propio
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
```

Cadena de verificación y commit (E1.4 Rojo E1):
```bash
grep -qE '^Tests: +4 failed, 2 passed, 6 total$' /tmp/152-r4e1.txt \
    && test "$(grep -cF 'Element type is invalid' /tmp/152-r4e1.txt)" -ge 4 \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r4e1.txt \
    && test "$(git diff --numstat -- src/screens/home/home-entrance.test.tsx | cut -f1,2)" = "$(printf '1\t0')" \
    && test ! -e .expo/types/router.d.ts \
    && { bun run typecheck > /tmp/152-r4e1-tsc.txt 2>&1 || true; } \
    && test "$(grep -c 'error TS' /tmp/152-r4e1-tsc.txt)" = "$(grep -cE '^src/screens/home/home-entrance\.test\.tsx\([0-9]+,[0-9]+\): error TS2305:' /tmp/152-r4e1-tsc.txt)" \
    && bun run lint \
    && git add src/screens/home/home-entrance.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/home-entrance.test.tsx' \
    && git commit -m 'test(mobile-home): #152 R4 red, reanimated double declares __esModule'
```
```text
[feature/152-mobile-home-motion-foundations 891bc4f6] test(mobile-home): #152 R4 red, reanimated double declares __esModule
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 1 insertion(+)
$ expo lint
exit=0
```

Commit: `891bc4f6 test(mobile-home): #152 R4 red, reanimated double declares __esModule`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

E1.5:
```text
$ git stash pop && git status --short
On branch feature/152-mobile-home-motion-foundations
Your branch is ahead of 'origin/feature/152-mobile-home-motion-foundations' by 9 commits.
  (use "git push" to publish your local commits)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   src/screens/home/home-entrance.tsx

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	../progress/impl_mobile-home-motion-foundations.md

no changes added to commit (use "git add" and/or "git commit -a")
Dropped refs/stash@{0} (1889d3d9376a28655600d61bee7fa35245cc02de)
 M src/screens/home/home-entrance.tsx
?? ../progress/impl_mobile-home-motion-foundations.md
exit=0
$ git stash list
stash@{0}: On feature/45-pet-lost-mode: codex-preserve-before-feature-52-checkout
```

Typecheck E1 rojo: únicamente TS2305 del test, salida completa:
```text
$ tsc --noEmit
src/screens/home/home-entrance.test.tsx(5,24): error TS2305: Module '"./home-entrance"' has no exported member 'HomeEntrance'.
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/home-entrance.test.tsx > /tmp/152-g4.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
exit=0


```

E1.5, verificación de las rutas desde la raíz:
```text
$ git -C .. status --short
 M mobile-pet-tracker/src/screens/home/home-entrance.tsx
?? progress/impl_mobile-home-motion-foundations.md
```
El stash E1 fue eliminado al hacer pop. Se conserva intacto el stash preexistente de feature/45. Una comprobación auxiliar comparó por error las rutas relativas de git status desde mobile con las rutas desde la raíz y lanzó AssertionError; la comprobación desde la raíz confirma los dos mismos ficheros. No falló ninguna cadena de commit.

Cadena de verificación y commit (R4 verde:):
```bash
grep -qE '^Tests: +6 passed, 6 total$' /tmp/152-g4.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/home-entrance.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/home-entrance.tsx' \
    && git commit -m 'feat(mobile-home): #152 R4 HomeEntrance wrapper'
```
```text
[feature/152-mobile-home-motion-foundations a34c2712] feat(mobile-home): #152 R4 HomeEntrance wrapper
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 31 insertions(+), 2 deletions(-)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `a34c2712 feat(mobile-home): #152 R4 HomeEntrance wrapper`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R5' > /tmp/152-r5.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       7 failed, 169 skipped, 176 total
exit=1

#152 R5: la Home envuelve cada bloque en su entrada escalonada › pinta los seis envoltorios como hijos directos y en orden
Unable to find an element with testID: summary-weight

#152 R5: la Home envuelve cada bloque en su entrada escalonada › cada envoltorio contiene su bloque
Unable to find an element with testID: summary-weight

#152 R5: la Home envuelve cada bloque en su entrada escalonada › escalona las entradas cada 60 ms en el orden de los bloques
Unable to find an element with testID: summary-weight

#152 R5: la Home envuelve cada bloque en su entrada escalonada › el envoltorio de la actividad envuelve también su skeleton
Unable to find an element with testID: home-entrance-weekly

#152 R5: la Home envuelve cada bloque en su entrada escalonada › no pinta los envoltorios del collar ni de la última posición si el detalle falla
Unable to find an element with testID: pet-hero-error

#152 R5: la Home envuelve cada bloque en su entrada escalonada › no pinta el envoltorio de la última posición sin collar
Unable to find an element with testID: collar-status

#152 R5: la Home envuelve cada bloque en su entrada escalonada › no pinta el envoltorio de la actividad si la actividad falla
Unable to find an element with testID: home-entrance-reminders
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t 'queda entre el resumen y la última posición|coloca la tira sobre la tarjeta del collar|coloca la rejilla entre el collar y la actividad semanal|coloca la sección entre la actividad semanal y la última posición' > /tmp/152-r5-order.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       4 failed, 172 skipped, 176 total
exit=1

R14: la Home monta la actividad semanal sin pedir nada nuevo › queda entre el resumen y la última posición en el árbol
expect(received).toEqual(expected) // deep equality

    - Expected  - 5
    + Received  + 1

    - Array [
    -   "home-entrance-summary",
    -   "home-entrance-weekly",
    -   "home-entrance-last-position",
    - ]
    + Array []

#69 R1: la tira de hoy tiene cuatro celdas con tres divisores › coloca la tira sobre la tarjeta del collar
expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 1

    - Array [
    -   "home-entrance-summary",
    -   "home-entrance-collar",
    -   "home-entrance-weekly",
    -   "home-entrance-last-position",
    - ]
    + Array []

#71 R1: la Home dibuja la rejilla de accesos rápidos › coloca la rejilla entre el collar y la actividad semanal
expect(received).toEqual(expected) // deep equality

    - Expected  - 7
    + Received  + 1

    - Array [
    -   "home-entrance-summary",
    -   "home-entrance-collar",
    -   "home-entrance-quick-actions",
    -   "home-entrance-weekly",
    -   "home-entrance-last-position",
    - ]
    + Array []

#70 R1: la Home dibuja la sección de recordatorios › #70 R14: posición y condición de la sección › coloca la sección entre la actividad semanal y la última posición
expect(received).toEqual(expected) // deep equality

    - Expected  - 8
    + Received  + 1

    - Array [
    -   "home-entrance-summary",
    -   "home-entrance-collar",
    -   "home-entrance-quick-actions",
    -   "home-entrance-weekly",
    -   "home-entrance-reminders",
    -   "home-entrance-last-position",
    - ]
    + Array []
```

Preparación R5: la primera medición usó por error weekComparison: null (el contrato exige un objeto); la gráfica lanzó TypeError al leer activeMinutes y varias consultas fallaron antes del sujeto. Se corrigió únicamente el fixture a sus tres campos null antes de ejecutar ninguna cadena de commit. Esa medición preliminar no es el rojo registrado; se repiten los comandos con el fixture válido.

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R5' > /tmp/152-r5.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       7 failed, 169 skipped, 176 total
exit=1

#152 R5: la Home envuelve cada bloque en su entrada escalonada › pinta los seis envoltorios como hijos directos y en orden
expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 6

      Array [
    -   "home-entrance-summary",
    -   "home-entrance-collar",
    -   "home-entrance-quick-actions",
    -   "home-entrance-weekly",
    -   "home-entrance-reminders",
    -   "home-entrance-last-position",
    +   "summary-card",
    +   "collar-card",
    +   "quick-actions",
    +   "weekly-activity-card",
    +   "reminders-section",
    +   "last-position-card",
      ]

#152 R5: la Home envuelve cada bloque en su entrada escalonada › cada envoltorio contiene su bloque
Unable to find an element with testID: home-entrance-summary

#152 R5: la Home envuelve cada bloque en su entrada escalonada › escalona las entradas cada 60 ms en el orden de los bloques
Unable to find an element with testID: home-entrance-summary

#152 R5: la Home envuelve cada bloque en su entrada escalonada › el envoltorio de la actividad envuelve también su skeleton
Unable to find an element with testID: home-entrance-weekly

#152 R5: la Home envuelve cada bloque en su entrada escalonada › no pinta los envoltorios del collar ni de la última posición si el detalle falla
Unable to find an element with testID: home-entrance-summary

#152 R5: la Home envuelve cada bloque en su entrada escalonada › no pinta el envoltorio de la última posición sin collar
Unable to find an element with testID: home-entrance-collar

#152 R5: la Home envuelve cada bloque en su entrada escalonada › no pinta el envoltorio de la actividad si la actividad falla
Unable to find an element with testID: home-entrance-reminders
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t 'queda entre el resumen y la última posición|coloca la tira sobre la tarjeta del collar|coloca la rejilla entre el collar y la actividad semanal|coloca la sección entre la actividad semanal y la última posición' > /tmp/152-r5-order.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       4 failed, 172 skipped, 176 total
exit=1

R14: la Home monta la actividad semanal sin pedir nada nuevo › queda entre el resumen y la última posición en el árbol
expect(received).toEqual(expected) // deep equality

    - Expected  - 5
    + Received  + 1

    - Array [
    -   "home-entrance-summary",
    -   "home-entrance-weekly",
    -   "home-entrance-last-position",
    - ]
    + Array []

#69 R1: la tira de hoy tiene cuatro celdas con tres divisores › coloca la tira sobre la tarjeta del collar
expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 1

    - Array [
    -   "home-entrance-summary",
    -   "home-entrance-collar",
    -   "home-entrance-weekly",
    -   "home-entrance-last-position",
    - ]
    + Array []

#71 R1: la Home dibuja la rejilla de accesos rápidos › coloca la rejilla entre el collar y la actividad semanal
expect(received).toEqual(expected) // deep equality

    - Expected  - 7
    + Received  + 1

    - Array [
    -   "home-entrance-summary",
    -   "home-entrance-collar",
    -   "home-entrance-quick-actions",
    -   "home-entrance-weekly",
    -   "home-entrance-last-position",
    - ]
    + Array []

#70 R1: la Home dibuja la sección de recordatorios › #70 R14: posición y condición de la sección › coloca la sección entre la actividad semanal y la última posición
expect(received).toEqual(expected) // deep equality

    - Expected  - 8
    + Received  + 1

    - Array [
    -   "home-entrance-summary",
    -   "home-entrance-collar",
    -   "home-entrance-quick-actions",
    -   "home-entrance-weekly",
    -   "home-entrance-reminders",
    -   "home-entrance-last-position",
    - ]
    + Array []
```

Cadena de verificación y commit (R5 rojo ():
```bash
grep -qE '^Tests: +7 failed, 169 skipped, 176 total$' /tmp/152-r5.txt \
    && test "$(grep -cF 'Unable to find an element with testID: home-entrance-' /tmp/152-r5.txt)" -ge 6 \
    && grep -qE '^Tests: +4 failed, 172 skipped, 176 total$' /tmp/152-r5-order.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r5.txt /tmp/152-r5-order.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.test.tsx' \
    && git commit -m 'test(mobile-home): #152 R5 red, staggered Home blocks'
```
```text
[feature/152-mobile-home-motion-foundations 557ce704] test(mobile-home): #152 R5 red, staggered Home blocks
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 162 insertions(+), 37 deletions(-)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `557ce704 test(mobile-home): #152 R5 red, staggered Home blocks`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R6' > /tmp/152-r6.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 176 skipped, 178 total
exit=1

#152 R6: la entrada se reproduce una vez por montaje › no repite la entrada al volver al foco
Unable to find an element with testID: home-entrance-summary

#152 R6: la entrada se reproduce una vez por montaje › al cambiar de mascota solo repiten los bloques que se vuelven a montar
Unable to find an element with testID: home-entrance-summary
```

Cadena de verificación y commit (R6 rojo ():
```bash
grep -qE '^Tests: +2 failed, 176 skipped, 178 total$' /tmp/152-r6.txt \
    && test "$(grep -cF 'Unable to find an element with testID: ' /tmp/152-r6.txt)" -ge 2 \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r6.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.test.tsx' \
    && git commit -m 'test(mobile-home): #152 R6 red, entrance plays once per mount'
```
```text
[feature/152-mobile-home-motion-foundations 29eba7b1] test(mobile-home): #152 R6 red, entrance plays once per mount
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 83 insertions(+)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `29eba7b1 test(mobile-home): #152 R6 red, entrance plays once per mount`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R5' > /tmp/152-g5.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       0 total
exit=1

Test suite failed to run
Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    SyntaxError: /home/claude/sites/Pet-Tracker-wt-152/mobile-pet-tracker/src/screens/home/index.tsx: Expected corresponding JSX closing tag for <HomeEntrance>. (579:10)
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t 'queda entre el resumen y la última posición|coloca la tira sobre la tarjeta del collar|coloca la rejilla entre el collar y la actividad semanal|coloca la sección entre la actividad semanal y la última posición' > /tmp/152-g5-order.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       0 total
exit=1

Test suite failed to run
Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    SyntaxError: /home/claude/sites/Pet-Tracker-wt-152/mobile-pet-tracker/src/screens/home/index.tsx: Expected corresponding JSX closing tag for <HomeEntrance>. (579:10)
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R6' > /tmp/152-g5-r6.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       0 total
exit=1

Test suite failed to run
Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    SyntaxError: /home/claude/sites/Pet-Tracker-wt-152/mobile-pet-tracker/src/screens/home/index.tsx: Expected corresponding JSX closing tag for <HomeEntrance>. (579:10)
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-g5-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       0 total
exit=1

Test suite failed to run
Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    SyntaxError: /home/claude/sites/Pet-Tracker-wt-152/mobile-pet-tracker/src/screens/home/index.tsx: Expected corresponding JSX closing tag for <HomeEntrance>. (579:10)
```

Preparación del verde R5: el primer borrador cerró dos envoltorios en un cierre View interior y produjo SyntaxError (0 tests). Se corrigieron los límites del JSX antes de la cadena de commit y se repiten todas las mediciones; ningún commit contiene ese borrador.

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R5' > /tmp/152-g5.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       0 total
exit=1

Test suite failed to run
Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    SyntaxError: /home/claude/sites/Pet-Tracker-wt-152/mobile-pet-tracker/src/screens/home/index.tsx: Expected corresponding JSX closing tag for <HomeEntrance>. (579:10)
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t 'queda entre el resumen y la última posición|coloca la tira sobre la tarjeta del collar|coloca la rejilla entre el collar y la actividad semanal|coloca la sección entre la actividad semanal y la última posición' > /tmp/152-g5-order.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       0 total
exit=1

Test suite failed to run
Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    SyntaxError: /home/claude/sites/Pet-Tracker-wt-152/mobile-pet-tracker/src/screens/home/index.tsx: Expected corresponding JSX closing tag for <HomeEntrance>. (579:10)
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R6' > /tmp/152-g5-r6.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       0 total
exit=1

Test suite failed to run
Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    SyntaxError: /home/claude/sites/Pet-Tracker-wt-152/mobile-pet-tracker/src/screens/home/index.tsx: Expected corresponding JSX closing tag for <HomeEntrance>. (579:10)
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-g5-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       0 total
exit=1

Test suite failed to run
Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    SyntaxError: /home/claude/sites/Pet-Tracker-wt-152/mobile-pet-tracker/src/screens/home/index.tsx: Expected corresponding JSX closing tag for <HomeEntrance>. (579:10)
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R5' > /tmp/152-g5.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       171 skipped, 7 passed, 178 total
exit=0


```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t 'queda entre el resumen y la última posición|coloca la tira sobre la tarjeta del collar|coloca la rejilla entre el collar y la actividad semanal|coloca la sección entre la actividad semanal y la última posición' > /tmp/152-g5-order.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       174 skipped, 4 passed, 178 total
exit=0


```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R6' > /tmp/152-g5-r6.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 176 skipped, 178 total
exit=1

#152 R6: la entrada se reproduce una vez por montaje › no repite la entrada al volver al foco
Unable to find an element with testID: summary-reveal

#152 R6: la entrada se reproduce una vez por montaje › al cambiar de mascota solo repiten los bloques que se vuelven a montar
Unable to find an element with testID: summary-reveal
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-g5-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 176 passed, 178 total
exit=1

#152 R6: la entrada se reproduce una vez por montaje › no repite la entrada al volver al foco
Unable to find an element with testID: summary-reveal

#152 R6: la entrada se reproduce una vez por montaje › al cambiar de mascota solo repiten los bloques que se vuelven a montar
Unable to find an element with testID: summary-reveal
```

Cadena de verificación y commit (R5 verde ():
```bash
grep -qE '^Tests: +171 skipped, 7 passed, 178 total$' /tmp/152-g5.txt \
    && grep -qE '^Tests: +174 skipped, 4 passed, 178 total$' /tmp/152-g5-order.txt \
    && grep -qE '^Tests: +2 failed, 176 skipped, 178 total$' /tmp/152-g5-r6.txt \
    && test "$(grep -cF 'Unable to find an element with testID: summary-reveal' /tmp/152-g5-r6.txt)" -ge 2 \
    && grep -qE '^Tests: +2 failed, 176 passed, 178 total$' /tmp/152-g5-all.txt \
    && test "$(grep -cF '<HomeEntrance' src/screens/home/index.tsx)" = 6 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.tsx' \
    && git commit -m 'feat(mobile-home): #152 R5 wrap Home blocks in HomeEntrance'
```
```text
[feature/152-mobile-home-motion-foundations 60371e0a] feat(mobile-home): #152 R5 wrap Home blocks in HomeEntrance
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 318 insertions(+), 307 deletions(-)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `60371e0a feat(mobile-home): #152 R5 wrap Home blocks in HomeEntrance`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R7' > /tmp/152-r7a.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 178 skipped, 180 total
exit=1

#152 R7: las cifras del resumen aparecen con un fundido › envuelve la fila del resumen sin tocarla
Unable to find an element with testID: summary-reveal

#152 R7: las cifras del resumen aparecen con un fundido › funde sin espera ni desplazamiento
Unable to find an element with testID: summary-reveal
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-r7a-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       4 failed, 176 passed, 180 total
exit=1

#152 R6: la entrada se reproduce una vez por montaje › no repite la entrada al volver al foco
Unable to find an element with testID: summary-reveal

#152 R6: la entrada se reproduce una vez por montaje › al cambiar de mascota solo repiten los bloques que se vuelven a montar
Unable to find an element with testID: summary-reveal

#152 R7: las cifras del resumen aparecen con un fundido › envuelve la fila del resumen sin tocarla
Unable to find an element with testID: summary-reveal

#152 R7: las cifras del resumen aparecen con un fundido › funde sin espera ni desplazamiento
Unable to find an element with testID: summary-reveal
```

Cadena de verificación y commit (R7 rojo A ():
```bash
grep -qE '^Tests: +2 failed, 178 skipped, 180 total$' /tmp/152-r7a.txt \
    && test "$(grep -cF 'Unable to find an element with testID: summary-reveal' /tmp/152-r7a.txt)" -ge 2 \
    && grep -qE '^Tests: +4 failed, 176 passed, 180 total$' /tmp/152-r7a-all.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r7a.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.test.tsx' \
    && git commit -m 'test(mobile-home): #152 R7 red, summary reveal fade'
```
```text
[feature/152-mobile-home-motion-foundations a7cbd7d7] test(mobile-home): #152 R7 red, summary reveal fade
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 25 insertions(+)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `a7cbd7d7 test(mobile-home): #152 R7 red, summary reveal fade`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R(6|7)' > /tmp/152-g7a.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 176 skipped, 3 passed, 180 total
exit=1

#152 R6: la entrada se reproduce una vez por montaje › al cambiar de mascota solo repiten los bloques que se vuelven a montar
expect(instance).toHaveTextContent()

    Expected instance to have text content:
      15
    Received:
      15 kg
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-g7a-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 179 passed, 180 total
exit=1

#152 R6: la entrada se reproduce una vez por montaje › al cambiar de mascota solo repiten los bloques que se vuelven a montar
expect(instance).toHaveTextContent()

    Expected instance to have text content:
      15
    Received:
      15 kg
```

## PARADA — espera literal de R6 antes del verde R7 A

E1 queda completada: rojo E1 `891bc4f6` y verde R4 `a34c2712`.
R5 rojo `557ce704`, R6 rojo `29eba7b1` y R5 verde `60371e0a`
están registrados en el orden prescrito. R7 rojo A es `a7cbd7d7`.

La medición previa al verde R7 A dejó R7 verde, pero uno de los tests de
R6 falla en su espera por el peso. Es un error mío en el test ya registrado:
`toHaveTextContent('15')` exige el texto completo con esta versión de RNTL;
la UI muestra correctamente `15 kg`. El texto esperado debe ser `'15 kg'`.
La documentación local de RNTL 14 declara la opción `exact` de este matcher;
el error observado confirma la comparación exacta. No cambia D1-D6 ni el
comportamiento pedido.

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R(6|7)' > /tmp/152-g7a.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 176 skipped, 3 passed, 180 total
exit=1

#152 R6: la entrada se reproduce una vez por montaje › al cambiar de mascota solo repiten los bloques que se vuelven a montar
expect(instance).toHaveTextContent()
Expected instance to have text content: 15
Received: 15 kg

$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-g7a-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 179 passed, 180 total
exit=1
```

No se ejecutó la cadena de commit R7 verde A: su primer grep no puede
cumplirse y la cadena solo permite stagear `index.tsx`, mientras que la
corrección pertenece a `index.test.tsx`. No se modifica un test fuera de
su commit permitido, no se registra un verde con tests sin commit y no se
reescribe el historial con hashes ya registrados. Para proseguir hace falta
una enmienda del leader que autorice registrar esa corrección del test antes
del verde R7 A (análoga a E1), manteniendo el rojo previo.

`index.tsx` contiene la implementación de R7 A sin commit. No se inició
R7 B ni R8/R9, ni se ejecutó el Cierre. Traceability sigue sin editar.
No se hizo push/PR, merge/rebase, init.sh ni acceso a Postgres/LocalStack.

Estado al parar:
```text
 M mobile-pet-tracker/src/screens/home/index.tsx
?? progress/impl_mobile-home-motion-foundations.md
```

## Reanudacion E2

E2.1 Estado:
```text
$ git status --short
 M mobile-pet-tracker/src/screens/home/index.tsx
?? progress/impl_mobile-home-motion-foundations.md
$ git log -1 --format=%s
docs(mobile-home-motion-foundations): #152 handoff amendment E2
$ git branch --show-current
feature/152-mobile-home-motion-foundations
```

H0 sigue siendo `36f91e6e`; la enmienda E2 del leader es `03274b2c`. Las skills y D1-D6 siguen vigentes. E2 fija el literal de peso que la spec no daba: `15 kg`.

E2.2:
```text
$ git stash push -m 'e2-152' -- src/screens/home/index.tsx && git diff --quiet HEAD -- src/screens/home/index.tsx; echo "exit=$?"
Saved working directory and index state On feature/152-mobile-home-motion-foundations: e2-152
exit=0
```

E2.3: solo se cambia el literal autorizado en el segundo it de R6.
```text
$ grep -cF "toHaveTextContent('15');" src/screens/home/index.test.tsx
0
$ grep -cF "toHaveTextContent('15 kg');" src/screens/home/index.test.tsx
1
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R6' > /tmp/152-r6e2.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 178 skipped, 180 total
exit=1

#152 R6: la entrada se reproduce una vez por montaje › no repite la entrada al volver al foco
Unable to find an element with testID: summary-reveal

#152 R6: la entrada se reproduce una vez por montaje › al cambiar de mascota solo repiten los bloques que se vuelven a montar
Unable to find an element with testID: summary-reveal
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-r6e2-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       4 failed, 176 passed, 180 total
exit=1

#152 R6: la entrada se reproduce una vez por montaje › no repite la entrada al volver al foco
Unable to find an element with testID: summary-reveal

#152 R6: la entrada se reproduce una vez por montaje › al cambiar de mascota solo repiten los bloques que se vuelven a montar
Unable to find an element with testID: summary-reveal

#152 R7: las cifras del resumen aparecen con un fundido › envuelve la fila del resumen sin tocarla
Unable to find an element with testID: summary-reveal

#152 R7: las cifras del resumen aparecen con un fundido › funde sin espera ni desplazamiento
Unable to find an element with testID: summary-reveal
```

Cadena de verificación y commit (E2.4 Rojo E2):
```bash
grep -qE '^Tests: +2 failed, 178 skipped, 180 total$' /tmp/152-r6e2.txt \
    && test "$(grep -cF 'Unable to find an element with testID: summary-reveal' /tmp/152-r6e2.txt)" -ge 2 \
    && grep -qE '^Tests: +4 failed, 176 passed, 180 total$' /tmp/152-r6e2-all.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r6e2.txt \
    && test "$(git diff --numstat -- src/screens/home/index.test.tsx | cut -f1,2)" = "$(printf '1\t1')" \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.test.tsx' \
    && git commit -m 'test(mobile-home): #152 R6 red, weight wait matches the full text'
```
```text
[feature/152-mobile-home-motion-foundations bb7f3194] test(mobile-home): #152 R6 red, weight wait matches the full text
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
exit=0
```

Commit: `bb7f3194 test(mobile-home): #152 R6 red, weight wait matches the full text`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

E2.5:
```text
$ git stash pop "$(git stash list | grep -F ': e2-152' | cut -d: -f1)" && git status --short
On branch feature/152-mobile-home-motion-foundations
Your branch is ahead of 'origin/feature/152-mobile-home-motion-foundations' by 16 commits.
  (use "git push" to publish your local commits)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   src/screens/home/index.tsx

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	../progress/impl_mobile-home-motion-foundations.md

no changes added to commit (use "git add" and/or "git commit -a")
Dropped stash@{0} (8c043a8d2235a6dfc28f9eb2fb0cf23ee98f05d6)
 M src/screens/home/index.tsx
?? ../progress/impl_mobile-home-motion-foundations.md
exit=0
$ git stash list | grep -cF 'e2-152'
0
$ git -C .. status --short
 M mobile-pet-tracker/src/screens/home/index.tsx
?? progress/impl_mobile-home-motion-foundations.md
$ git stash list
stash@{0}: On feature/45-pet-lost-mode: codex-preserve-before-feature-52-checkout
```
La entrada ajena se mantiene intacta; el stash e2-152 fue eliminado.

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R(6|7)' > /tmp/152-g7a.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       176 skipped, 4 passed, 180 total
exit=0


```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-g7a-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       180 passed, 180 total
exit=0


```

Cadena de verificación y commit (R7 verde A ():
```bash
grep -qE '^Tests: +176 skipped, 4 passed, 180 total$' /tmp/152-g7a.txt \
    && grep -qE '^Tests: +180 passed, 180 total$' /tmp/152-g7a-all.txt \
    && test "$(grep -cF 'testID="summary-reveal"' src/screens/home/index.tsx)" = 1 \
    && test "$(grep -cF 'homeEntering(0, 0)' src/screens/home/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.tsx' \
    && git commit -m 'feat(mobile-home): #152 R7 fade in the summary row'
```
```text
[feature/152-mobile-home-motion-foundations 630a611e] feat(mobile-home): #152 R7 fade in the summary row
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 73 insertions(+), 71 deletions(-)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `630a611e feat(mobile-home): #152 R7 fade in the summary row`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R7' > /tmp/152-r7b.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 178 skipped, 2 passed, 181 total
exit=1

#152 R7: las cifras del resumen aparecen con un fundido › no monta el fundido mientras el skeleton ocupa su sitio
expect(received).toBeNull()

    Received: <View collapsable={false} entering={[Function homeEntranceTsx1]} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {}}} testID="summary-reveal"><View className="skeleton__root h-16 w-full rounded-xl" collapsable={false} entering={[Function FadeIn]} exiting={[Function FadeOut]} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {}}} jestInlineStyle={[{"borderCurve": "continuous"}, undefined]} onLayout={[Function anonymous]} style={[{"borderCurve": "continuous"}, undefined]} testID="summary-skeleton" /></View>
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-r7b-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 180 passed, 181 total
exit=1

#152 R7: las cifras del resumen aparecen con un fundido › no monta el fundido mientras el skeleton ocupa su sitio
expect(received).toBeNull()

    Received: <View collapsable={false} entering={[Function homeEntranceTsx1]} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {}}} testID="summary-reveal"><View className="skeleton__root h-16 w-full rounded-xl" collapsable={false} entering={[Function FadeIn]} exiting={[Function FadeOut]} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {}}} jestInlineStyle={[{"borderCurve": "continuous"}, undefined]} onLayout={[Function anonymous]} style={[{"borderCurve": "continuous"}, undefined]} testID="summary-skeleton" /></View>
```

Informativo R7 B: fichero entero `1 failed, 180 passed, 181 total`, exit=1. Solo cae el nuevo it `no monta el fundido mientras el skeleton ocupa su sitio`; ningún it adicional cae con la mutación. Matcher toBeNull: Expected null; Received el View summary-reveal que contiene summary-skeleton (salida copiada arriba).

Cadena de verificación y commit (R7 rojo B ():
```bash
grep -qE '^Tests: +1 failed, 178 skipped, 2 passed, 181 total$' /tmp/152-r7b.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r7b.txt \
    && test "$(grep -cF 'testID="summary-reveal"' src/screens/home/index.tsx)" = 2 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx src/screens/home/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/screens/home/index.tsx ' \
    && git commit -m 'test(mobile-home): #152 R7 red, no fade over the skeleton'
```
```text
[feature/152-mobile-home-motion-foundations c872a3e1] test(mobile-home): #152 R7 red, no fade over the skeleton
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 10 insertions(+), 1 deletion(-)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `c872a3e1 test(mobile-home): #152 R7 red, no fade over the skeleton`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R7' > /tmp/152-g7b.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       178 skipped, 3 passed, 181 total
exit=0


```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-g7b-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       181 passed, 181 total
exit=0


```

Cadena de verificación y commit (R7 verde B ():
```bash
grep -qE '^Tests: +178 skipped, 3 passed, 181 total$' /tmp/152-g7b.txt \
    && grep -qE '^Tests: +181 passed, 181 total$' /tmp/152-g7b-all.txt \
    && test "$(grep -cF 'testID="summary-reveal"' src/screens/home/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.tsx' \
    && git commit -m 'feat(mobile-home): #152 R7 keep the skeleton without fade'
```
```text
[feature/152-mobile-home-motion-foundations b25535eb] feat(mobile-home): #152 R7 keep the skeleton without fade
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 1 insertion(+), 3 deletions(-)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `b25535eb feat(mobile-home): #152 R7 keep the skeleton without fade`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R8' > /tmp/152-r8a.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       9 failed, 181 skipped, 190 total
exit=1

#152 R8: la batería del collar se dibuja como barra › pinta 82% con bg-success
Unable to find an element with testID: collar-battery-track

#152 R8: la batería del collar se dibuja como barra › pinta 61% con bg-success
Unable to find an element with testID: collar-battery-track

#152 R8: la batería del collar se dibuja como barra › pinta 60% con bg-warning-strong
Unable to find an element with testID: collar-battery-track

#152 R8: la batería del collar se dibuja como barra › pinta 12% con bg-warning-strong
Unable to find an element with testID: collar-battery-track

#152 R8: la batería del collar se dibuja como barra › pone la barra detrás del porcentaje en su fila
Unable to find an element with testID: collar-battery-track

#152 R8: la batería del collar se dibuja como barra › llena la barra desde vacía con el preset de barra
Unable to find an element with testID: collar-battery-fill

#152 R8: la batería del collar se dibuja como barra › bajo reduce motion fija el ancho sin animar
Unable to find an element with testID: collar-battery-fill

#152 R8: la batería del collar se dibuja como barra › anima del valor anterior al nuevo al refrescar
Unable to find an element with testID: collar-battery-fill

#152 R8: la batería del collar se dibuja como barra › bajo reduce motion salta al nuevo valor al refrescar
Unable to find an element with testID: collar-battery-fill
```

Cadena de verificación y commit (R8 rojo A ():
```bash
grep -qE '^Tests: +9 failed, 181 skipped, 190 total$' /tmp/152-r8a.txt \
    && test "$(grep -cE 'Unable to find an element with testID: collar-battery-(track|fill)' /tmp/152-r8a.txt)" -ge 9 \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r8a.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.test.tsx' \
    && git commit -m 'test(mobile-home): #152 R8 red, collar battery bar'
```
```text
[feature/152-mobile-home-motion-foundations 5606d328] test(mobile-home): #152 R8 red, collar battery bar
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 84 insertions(+)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `5606d328 test(mobile-home): #152 R8 red, collar battery bar`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

R8, detalle de implementación no fijado literalmente por la spec: se usan `get()`/`set()` del valor compartido (API existente en Reanimated 4.5.1, recomendada por animate-expo), con el mismo nacimiento 0/pct y efecto por cambio de pct prescrito. El tipo de width se acota a `${number}%`, como la barra existente. No se añade lógica, copy ni dependencias.

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R8' > /tmp/152-g8a.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       181 skipped, 9 passed, 190 total
exit=0


```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#106' > /tmp/152-g8a-106.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       188 skipped, 2 passed, 190 total
exit=0


```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-g8a-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       190 passed, 190 total
exit=0


```

Cadena de verificación y commit (R8 verde A ():
```bash
grep -qE '^Tests: +181 skipped, 9 passed, 190 total$' /tmp/152-g8a.txt \
    && grep -qE '^Tests: +188 skipped, 2 passed, 190 total$' /tmp/152-g8a-106.txt \
    && grep -qE '^Tests: +190 passed, 190 total$' /tmp/152-g8a-all.txt \
    && test "$(grep -cF '<CollarBatteryBar' src/screens/home/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/collar-battery-bar.tsx src/screens/home/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx mobile-pet-tracker/src/screens/home/index.tsx ' \
    && git commit -m 'feat(mobile-home): #152 R8 collar battery bar'
```
```text
[feature/152-mobile-home-motion-foundations 6da3a9c7] feat(mobile-home): #152 R8 collar battery bar
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 41 insertions(+)
 create mode 100644 mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `6da3a9c7 feat(mobile-home): #152 R8 collar battery bar`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

## R8 rojo B — ramas de ausencia

Se añaden los dos it literales de ausencia y las mutaciones (a) y (b) de producción exigidas por tasks.md. Las ausencias esperan primero al porcentaje «—» o al nodo visible collar-status del mismo render.

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R8' > /tmp/152-r8b.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 181 skipped, 9 passed, 192 total
exit=1

#152 R8: la batería del collar se dibuja como barra › no pinta la barra sin porcentaje
expect(received).toBeNull()

    Received: <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface" testID="collar-battery-track"><View className="h-full rounded-full bg-warning-strong" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"width": "0%"}}} jestInlineStyle={{}} style={[{"width": "0%"}]} testID="collar-battery-fill" /></View>

#152 R8: la batería del collar se dibuja como barra › no pinta la barra sin collar
expect(received).toBeNull()

    Received: <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface" testID="collar-battery-track"><View className="h-full rounded-full bg-warning-strong" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"width": "0%"}}} jestInlineStyle={{}} style={[{"width": "0%"}]} testID="collar-battery-fill" /></View>
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-r8b-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 190 passed, 192 total
exit=1

#152 R8: la batería del collar se dibuja como barra › no pinta la barra sin porcentaje
expect(received).toBeNull()

    Received: <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface" testID="collar-battery-track"><View className="h-full rounded-full bg-warning-strong" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"width": "0%"}}} jestInlineStyle={{}} style={[{"width": "0%"}]} testID="collar-battery-fill" /></View>

#152 R8: la batería del collar se dibuja como barra › no pinta la barra sin collar
expect(received).toBeNull()

    Received: <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface" testID="collar-battery-track"><View className="h-full rounded-full bg-warning-strong" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"width": "0%"}}} jestInlineStyle={{}} style={[{"width": "0%"}]} testID="collar-battery-fill" /></View>
```

Informativo R8 B: fichero entero, 2 failed y 190 passed; ningún it adicional cae con las mutaciones. En ambos it rojos el matcher es toBeNull(), Expected: null; Received: View collar-battery-track (detalle anterior).

Cadena de verificación y commit (R8 rojo B ():
```bash
grep -qE '^Tests: +2 failed, 181 skipped, 9 passed, 192 total$' /tmp/152-r8b.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r8b.txt \
    && test "$(grep -cF '<CollarBatteryBar' src/screens/home/index.tsx)" = 2 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx src/screens/home/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/screens/home/index.tsx ' \
    && git commit -m 'test(mobile-home): #152 R8 red, no bar without percentage or collar'
```
```text
[feature/152-mobile-home-motion-foundations 26092abf] test(mobile-home): #152 R8 red, no bar without percentage or collar
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 21 insertions(+), 6 deletions(-)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `26092abf test(mobile-home): #152 R8 red, no bar without percentage or collar`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

## R8 verde B

Se revierten exclusivamente las dos mutaciones de producción de R8 B.

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R8' > /tmp/152-g8b.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       181 skipped, 11 passed, 192 total
exit=0


```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/152-g8b-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       192 passed, 192 total
exit=0


```

Cadena de verificación y commit (R8 verde B ():
```bash
grep -qE '^Tests: +181 skipped, 11 passed, 192 total$' /tmp/152-g8b.txt \
    && grep -qE '^Tests: +192 passed, 192 total$' /tmp/152-g8b-all.txt \
    && test "$(grep -cF '<CollarBatteryBar' src/screens/home/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.tsx' \
    && git commit -m 'feat(mobile-home): #152 R8 bar only with a numeric percentage'
```
```text
[feature/152-mobile-home-motion-foundations b0ab47fc] feat(mobile-home): #152 R8 bar only with a numeric percentage
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 6 insertions(+), 7 deletions(-)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `b0ab47fc feat(mobile-home): #152 R8 bar only with a numeric percentage`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

## R9 rojo — drift de estilo

Se copia la forma del guard #98 R10 con los cuatro ficheros de R9, reutilizando MEALS_BAR_STYLE_ESCAPES sin patrones nuevos. La primera línea de collar-battery-bar.tsx se muta a `// #152 barra de batería del collar`, como prescribe tasks.md.

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts -t '#152 R9' > /tmp/152-r9.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 61 skipped, 62 total
exit=1

#152 R9: el movimiento de la Home no mete drift de estilo › mantiene sus ficheros sin escapes de estilo literales
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "screens/home/collar-battery-bar.tsx",
    + ]
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts > /tmp/152-r9-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       6 failed, 56 passed, 62 total
exit=1

#68 R18: la actividad semanal no mete drift de estilo › keeps arbitrary text, hex colors, and StyleSheet out of feature sources
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "screens/home/index.test.tsx",
    + ]

#69 R13: la tira de estadísticas no mete drift de estilo › mantiene sus cinco ficheros sin escapes de estilo literales
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "screens/home/index.test.tsx",
    + ]

#71 R13: la rejilla de accesos rápidos no mete drift de estilo › mantiene sus tres ficheros sin escapes de estilo literales
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "screens/home/index.test.tsx",
    + ]

#70 R17: la sección de recordatorios no mete drift de estilo › mantiene sus ficheros sin escapes de estilo literales
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "screens/home/index.test.tsx",
    + ]

#85 R12: la sección de recordatorios reales no mete drift de estilo › mantiene sus ficheros sin escapes de estilo literales
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "screens/home/index.test.tsx",
    + ]

#152 R9: el movimiento de la Home no mete drift de estilo › mantiene sus ficheros sin escapes de estilo literales
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "screens/home/collar-battery-bar.tsx",
    + ]
```

Informativo R9: 6 failed, 56 passed, 62 total. Además del it de R9, caen cinco guards con Received: ["screens/home/index.test.tsx"]:

- #68 R18 › keeps arbitrary text, hex colors, and StyleSheet out of feature sources.
- #69 R13 › mantiene sus cinco ficheros sin escapes de estilo literales.
- #71 R13 › mantiene sus tres ficheros sin escapes de estilo literales.
- #70 R17 › mantiene sus ficheros sin escapes de estilo literales.
- #85 R12 › mantiene sus ficheros sin escapes de estilo literales.

Los cinco aplican FEATURE_STYLE_ESCAPES a index.test.tsx; ese patrón rechaza cualquier aparición de StyleSheet. R8.3 y R8.4 prescriben StyleSheet.flatten(fill.props.style).width para comprobar el primer render. El comentario mutado de R9 solo está en collar-battery-bar.tsx, por lo que estos cinco fallos parecen independientes de esa mutación. No se modifica ningún guard ni se altera el test de R8; el verde R9 comprobará si persisten.

Cadena de verificación y commit (R9 rojo ():
```bash
grep -qE '^Tests: +1 failed, 61 skipped, 62 total$' /tmp/152-r9.txt \
    && grep -qF '"screens/home/collar-battery-bar.tsx"' /tmp/152-r9.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r9.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/__tests__/design-drift.test.ts src/screens/home/collar-battery-bar.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/design-drift.test.ts mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx ' \
    && git commit -m 'test(mobile-home): #152 R9 red, no style drift in Home motion'
```
```text
[feature/152-mobile-home-motion-foundations 4daff5ff] test(mobile-home): #152 R9 red, no style drift in Home motion
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 22 insertions(+)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `4daff5ff test(mobile-home): #152 R9 red, no style drift in Home motion`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

## R9 verde — corrección del comentario

La única modificación de producción es el cambio del comentario a `// #152 R8: barra de batería del collar`.

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts -t '#152 R9' > /tmp/152-g9.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       61 skipped, 1 passed, 62 total
exit=0


```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts > /tmp/152-g9-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       5 failed, 57 passed, 62 total
exit=1

#68 R18: la actividad semanal no mete drift de estilo › keeps arbitrary text, hex colors, and StyleSheet out of feature sources
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "screens/home/index.test.tsx",
    + ]

#69 R13: la tira de estadísticas no mete drift de estilo › mantiene sus cinco ficheros sin escapes de estilo literales
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "screens/home/index.test.tsx",
    + ]

#71 R13: la rejilla de accesos rápidos no mete drift de estilo › mantiene sus tres ficheros sin escapes de estilo literales
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "screens/home/index.test.tsx",
    + ]

#70 R17: la sección de recordatorios no mete drift de estilo › mantiene sus ficheros sin escapes de estilo literales
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "screens/home/index.test.tsx",
    + ]

#85 R12: la sección de recordatorios reales no mete drift de estilo › mantiene sus ficheros sin escapes de estilo literales
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "screens/home/index.test.tsx",
    + ]
```

Cadena de verificación y commit (R9 verde ():
```bash
grep -qE '^Tests: +61 skipped, 1 passed, 62 total$' /tmp/152-g9.txt \
    && grep -qE '^Tests: +62 passed, 62 total$' /tmp/152-g9-all.txt \
    && test "$(grep -cF "describe('#152 R9" src/__tests__/design-drift.test.ts)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/collar-battery-bar.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx' \
    && git commit -m 'fix(mobile-home): #152 R9 cite the feature with its R-id'
```
```text
exit=1
```

PARADA: cadena no llegó al commit. Salida anterior; no se continúa.

## PARADA — R9 verde: guards históricos rechazan StyleSheet.flatten en los tests de R8

La cadena literal de R9 verde devuelve exit=1. El primer eslabón pasa:

```bash
grep -qE '^Tests: +61 skipped, 1 passed, 62 total$' /tmp/152-g9.txt
```

El segundo eslabón falla (exit=1), y por el encadenado && no se ejecutan los restantes, incluidos typecheck, lint, git add y git commit:

```bash
grep -qE '^Tests: +62 passed, 62 total$' /tmp/152-g9-all.txt
```

Salida real de la medición completa:

```text
Test Suites: 1 failed, 1 total
Tests:       5 failed, 57 passed, 62 total
exit=1
```

El it de R9 ya pasa con el comentario corregido. Los otros cinco it fallan por aserción toEqual([]), Expected: [], Received: ["screens/home/index.test.tsx"], con los nombres y detalles copiados arriba. La causa es el término StyleSheet del patrón FEATURE_STYLE_ESCAPES usado por esos guards históricos. R8.3 y R8.4 de requirements.md exigen StyleSheet.flatten(fill.props.style).width; el import nombrado y sus dos usos introducen ese término en index.test.tsx. No es un fallo de sintaxis, import, helper, ni de la mutación del comentario.

Se cumple la orden del handoff «Si una cadena no llega al commit, PARA y reporta en el impl el eslabon que fallo y la salida» y la orden de no arreglar otros it del informativo. No se modifican guards ni se oculta el término mediante cadenas partidas o aliases para esquivar el guard. Hace falta una enmienda del leader que resuelva el conflicto entre R8 y estos guards antes de continuar.

Estado de entrega: R1-R8 tienen sus commits rojos y verdes; el rojo de R9 es 4daff5ff, con typecheck y lint verdes. La corrección verde de R9 queda exclusivamente en el árbol de trabajo, sin commit. Quedan pendientes el commit verde R9, todo el Cierre y el commit final de trazabilidad. R10 sigue siendo del humano. No se ejecuta la suite entera ni se alteran traceability.md o los ficheros del leader.

Diagnóstico y estado al parar (solo lectura):

```text
$ git status --short
 M mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx
?? progress/impl_mobile-home-motion-foundations.md
exit=0
```

```text
$ git log -1 --format="%h %s"
4daff5ff test(mobile-home): #152 R9 red, no style drift in Home motion
exit=0
```

```text
$ git diff --cached --name-only
exit=0
```

```text
$ git diff 36f91e6e -- mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx
diff --git a/mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx b/mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx
new file mode 100644
index 00000000..491ab401
--- /dev/null
+++ b/mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx
@@ -0,0 +1,38 @@
+// #152 R8: barra de batería del collar
+import { useEffect } from 'react';
+import { View } from 'react-native';
+import Animated, {
+  useAnimatedStyle,
+  useReducedMotion,
+  useSharedValue,
+  withTiming,
+} from 'react-native-reanimated';
+
+import { MOTION_FILL_TIMING } from '../../theme/motion';
+
+export function CollarBatteryBar({ pct }: { pct: number }) {
+  const reducedMotion = useReducedMotion();
+  const fillPct = useSharedValue(reducedMotion ? pct : 0);
+  const fillStyle = useAnimatedStyle(() => ({
+    width: `${fillPct.get()}%` as `${number}%`,
+  }));
+
+  useEffect(() => {
+    fillPct.set(reducedMotion ? pct : withTiming(pct, MOTION_FILL_TIMING));
+  }, [fillPct, pct, reducedMotion]);
+
+  return (
+    <View
+      testID="collar-battery-track"
+      className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface"
+    >
+      <Animated.View
+        testID="collar-battery-fill"
+        className={pct > 60
+          ? 'h-full rounded-full bg-success'
+          : 'h-full rounded-full bg-warning-strong'}
+        style={fillStyle}
+      />
+    </View>
+  );
+}
exit=0
```

```text
$ rg -n 'StyleSheet' mobile-pet-tracker/src/screens/home/index.test.tsx
11:import { StyleSheet } from 'react-native';
4960:    expect(StyleSheet.flatten(fill.props.style).width).toBe('0%');
4972:      expect(StyleSheet.flatten(fill.props.style).width).toBe('82%');
exit=0
```

```text
$ rg -n -A 4 'const FEATURE_STYLE_ESCAPES' mobile-pet-tracker/src/__tests__/design-drift.test.ts
28:const FEATURE_STYLE_ESCAPES = new RegExp(
29-  String.raw`text-\[10px\]|${HEX_LITERAL}|StyleSheet`,
30-  'i',
31-);
32-const PAIRING_STYLE_ESCAPES = new RegExp(
exit=0
```

## Reanudacion E3

E3.1 coincide exactamente con el estado y mensaje exigidos. H0 sigue siendo `36f91e6e`; `8ea0cf5e` es el commit del leader que añade E3, no cambia la base de los diffs.

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-152
exit=0
$ git branch --show-current
feature/152-mobile-home-motion-foundations
exit=0
$ git rev-parse --short HEAD
8ea0cf5e
exit=0
$ git status --short
 M mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx
?? progress/impl_mobile-home-motion-foundations.md
exit=0
$ git log -1 --format=%s
docs(mobile-home-motion-foundations): #152 handoff amendment E3
exit=0
$ git stash list
stash@{0}: On feature/45-pet-lost-mode: codex-preserve-before-feature-52-checkout
exit=0
```

E3.2:
```text
$ git stash push -m 'e3-152' -- src/screens/home/collar-battery-bar.tsx && git diff --quiet HEAD -- src/screens/home/collar-battery-bar.tsx; echo "exit=$?"
Saved working directory and index state On feature/152-mobile-home-motion-foundations: e3-152
exit=0
```

E3.3: se aplican solo los tres cambios indicados.

```text
$ grep -cF 'StyleSheet' src/screens/home/index.test.tsx
0
$ grep -cF "expect(fill).toHaveStyle({ width: '0%' });" src/screens/home/index.test.tsx
1
$ grep -cF "expect(fill).toHaveStyle({ width: '82%' });" src/screens/home/index.test.tsx
1
$ git diff --numstat -- src/screens/home/index.test.tsx
2	3	mobile-pet-tracker/src/screens/home/index.test.tsx
```

E3.4, mediciones del rojo:

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts -t '#152 R9' > /tmp/152-r9e3.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 61 skipped, 62 total
exit=1

#152 R9: el movimiento de la Home no mete drift de estilo › mantiene sus ficheros sin escapes de estilo literales
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "screens/home/collar-battery-bar.tsx",
    + ]
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts > /tmp/152-r9e3-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 61 passed, 62 total
exit=1

#152 R9: el movimiento de la Home no mete drift de estilo › mantiene sus ficheros sin escapes de estilo literales
expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 3

    - Array []
    + Array [
    +   "screens/home/collar-battery-bar.tsx",
    + ]
```

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx -t '#152 R8' > /tmp/152-r9e3-r8.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       181 skipped, 11 passed, 192 total
exit=0


```

Cadena de verificación y commit (E3.4 Rojo E3 ():
```bash
grep -qE '^Tests: +1 failed, 61 skipped, 62 total$' /tmp/152-r9e3.txt \
    && grep -qF '"screens/home/collar-battery-bar.tsx"' /tmp/152-r9e3.txt \
    && grep -qE '^Tests: +1 failed, 61 passed, 62 total$' /tmp/152-r9e3-all.txt \
    && ! grep -qF '"screens/home/index.test.tsx"' /tmp/152-r9e3-all.txt \
    && grep -qE '^Tests: +181 skipped, 11 passed, 192 total$' /tmp/152-r9e3-r8.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/152-r9e3.txt /tmp/152-r9e3-all.txt \
    && test "$(git diff --numstat -- src/screens/home/index.test.tsx | cut -f1,2)" = "$(printf '2\t3')" \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/index.test.tsx' \
    && git commit -m 'test(mobile-home): #152 R9 red, R8 reads the fill width without StyleSheet'
```
```text
[feature/152-mobile-home-motion-foundations 11dffcf4] test(mobile-home): #152 R9 red, R8 reads the fill width without StyleSheet
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 2 insertions(+), 3 deletions(-)
$ tsc --noEmit
$ expo lint
exit=0
```

Commit: `11dffcf4 test(mobile-home): #152 R9 red, R8 reads the fill width without StyleSheet`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

E3.5:
```text
$ git stash pop "$(git stash list | grep -F ': e3-152' | cut -d: -f1)" && git status --short
On branch feature/152-mobile-home-motion-foundations
Your branch is ahead of 'origin/feature/152-mobile-home-motion-foundations' by 26 commits.
  (use "git push" to publish your local commits)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   src/screens/home/collar-battery-bar.tsx

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	../progress/impl_mobile-home-motion-foundations.md

no changes added to commit (use "git add" and/or "git commit -a")
Dropped stash@{0} (369ebad8e9cc4c2990253d4f732030b038104cc5)
 M src/screens/home/collar-battery-bar.tsx
?? ../progress/impl_mobile-home-motion-foundations.md
exit=0
```

```text
$ git stash list | grep -cF 'e3-152'
0
$ git stash list
stash@{0}: On feature/45-pet-lost-mode: codex-preserve-before-feature-52-checkout
$ git status --short
 M src/screens/home/collar-battery-bar.tsx
?? ../progress/impl_mobile-home-motion-foundations.md
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts -t '#152 R9' > /tmp/152-g9.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       61 skipped, 1 passed, 62 total
exit=0


```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts > /tmp/152-g9-all.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       62 passed, 62 total
exit=0


```

Comprobación E3.5 desde la raíz:
```text
$ git status --short
 M mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx
?? progress/impl_mobile-home-motion-foundations.md
```

La aserción auxiliar anterior comparó incorrectamente las rutas relativas emitidas desde mobile-pet-tracker/ con las rutas de raíz del handoff. El comando E3.5 sí terminó con exit=0: el stash propio se recuperó y se eliminó; el ajeno permanece. Desde la raíz, las dos líneas coinciden exactamente. No falló ninguna cadena de commit ni hubo cambio de estado inesperado.

E3.6: se repiten las dos mediciones originales del verde R9. E3 añade un commit (25 en total, según la enmienda), sin tests adicionales. No cambian requisitos ni guards.

Cadena de verificación y commit (R9 verde ():
```bash
grep -qE '^Tests: +61 skipped, 1 passed, 62 total$' /tmp/152-g9.txt \
    && grep -qE '^Tests: +62 passed, 62 total$' /tmp/152-g9-all.txt \
    && test "$(grep -cF "describe('#152 R9" src/__tests__/design-drift.test.ts)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/home/collar-battery-bar.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx' \
    && git commit -m 'fix(mobile-home): #152 R9 cite the feature with its R-id'
```
```text
[feature/152-mobile-home-motion-foundations 86f4b6ed] fix(mobile-home): #152 R9 cite the feature with its R-id
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
exit=0
```

Commit: `86f4b6ed fix(mobile-home): #152 R9 cite the feature with its R-id`. Typecheck y lint de la cadena: exit=0 (en R1/R3/R4 rojos, únicamente TS2305 del test nuevo, como prescribe el handoff).

## Cierre — comparación con la base

Se comparan los tres ficheros de la base y los dos ficheros nuevos, con FORCE_COLOR=0 y sin pipe.

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx src/__tests__/design-drift.test.ts src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts src/screens/home/home-entrance.test.tsx > /tmp/152-five.txt 2>&1; echo "exit=$?"
Test Suites: 5 passed, 5 total
Tests:       320 passed, 320 total
exit=0

Console
console.warn
      Uniwind - We couldn't find your variable --color-foreground. Make sure it's used at least once in your className, or define it in a static theme as described in the docs: https://docs.uniwind.dev/api/use-css-variable
```

Resultado: 320 frente a 281 de la base, +39 tests. Reparto: home/index 192; design-drift 62; global-css 51; motion 9; home-entrance 6. Las enmiendas E1-E3 no añaden casos.

## Cierre — suite completa

```text
$ pgrep -af '[i]nit\.sh'
3912725 /bin/bash -lc python3 - <<'PY' import subprocess from pathlib import Path command="pgrep -af '[i]nit\\.sh'" r=subprocess.run(command,shell=True,executable='/bin/bash',capture_output=True,text=True) with Path('../progress/impl_mobile-home-motion-foundations.md').open('a') as f:  f.write('\n## Cierre — suite completa\n\n```text\n$ '+command+'\n'+r.stdout+r.stderr+'exit='+str(r.returncode)+'\n```\n')  if r.returncode==1 and not r.stdout:   f.write('\npgrep vacío (exit=1 de pgrep significa ninguna coincidencia). Se ejecuta Jest completo sin otros comandos concurrentes.\n') print(r.stdout+r.stderr+'exit='+str(r.returncode)) assert r.returncode==1 and not r.stdout, 'Hay init.sh activo o pgrep falló; esperar sin lanzar suite completa.' PY
exit=0
```

El primer envoltorio auxiliar de pgrep se encontró a sí mismo porque su mensaje de aserción contenía el nombre del script. Se repitió el comando literal directamente, sin envoltorio ni pipe:

```text
$ pgrep -af '[i]nit\.sh'
exit=1
```

Salida vacía confirmada; el resultado anterior era un falso positivo del envoltorio, no otro proceso de arranque. Se inicia exclusivamente Jest completo.

```text
$ FORCE_COLOR=0 bunx jest > /tmp/152-all.txt 2>&1; echo "exit=$?"
Test Suites: 96 passed, 96 total
Tests:       2209 passed, 2209 total
exit=0
```

## Cierre — typecheck y lint

```text
$ bun run typecheck; echo "exit=$?"
$ tsc --noEmit
exit=0
```

```text
$ bun run lint; echo "exit=$?"
$ expo lint
exit=0
```

## Cierre — anclas 0-40 y ocho positivas

Todas se ejecutan desde mobile-pet-tracker/. En grep -cF, salida 0 lleva exit=1 por definición; el ancla compara el valor impreso, como en H0.

```text
0. $ grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-06, vía Notion' ../specs/mobile-home-motion-foundations/requirements.md
1
1. $ grep -rlF 'entering=' src | wc -l
2
2. $ test -e src/theme/motion.ts; echo $?
0
3. $ grep -cF -- '--motion' src/theme/global.css
0
4. $ grep -rlF 'home-entrance' src | wc -l
4
5. $ grep -cF 'promueven a tokens `--motion-*` en global.css' ../docs/ui-guidelines.md
0
6. $ grep -cF 'unmountOnBlur' 'src/app/(tabs)/_layout.tsx'
0
7. $ grep -cF "expect(mockWithTiming).not.toHaveBeenCalled()" src/screens/home/index.test.tsx
1
8. $ grep -cF '.children.flatMap((child) =>' src/screens/home/index.test.tsx
4
9. $ grep -cF 'BAR_ENTRY_STAGGER_MS = 40' src/screens/home/weekly-activity-chart.tsx
1
10. $ grep -cF "dot: 'bg-success'" src/components/pet-hero-header.tsx
1
11. $ grep -cF "dot: 'bg-warning-strong'" src/components/pet-hero-header.tsx
1
12. $ test -e src/screens/home/home-entrance.tsx; echo $?
0
13. $ test -e src/screens/home/home-entrance.test.tsx; echo $?
0
14. $ test -e src/screens/home/collar-battery-bar.tsx; echo $?
0
15. $ test -e src/theme/__tests__/motion.test.ts; echo $?
0
16. $ grep -cF 'testID="home-content"' src/screens/home/index.tsx
1
17. $ grep -cF 'className="flex-row"' src/screens/home/index.tsx
1
18. $ grep -cF 'testID="summary-skeleton"' src/screens/home/index.tsx
1
19. $ grep -cF 'testID="collar-battery"' src/screens/home/index.tsx
1
20. $ grep -cF "t('home.noCollar')" src/screens/home/index.tsx
1
21. $ grep -cF 'const detail = useQuery({' src/screens/home/index.tsx
1
22. $ grep -cF 'const { selectedPetId, selectPet } = useSelectedPet();' src/screens/home/index.tsx
1
23. $ grep -cF 'MEALS_BAR_TIMING' src/screens/home/index.tsx
2
24. $ grep -cF "describe('R10: refetch al foco'" src/screens/home/index.test.tsx
1
25. $ grep -cF "it('selects a pressed pet and reloads its detail and activity'" src/screens/home/index.test.tsx
1
26. $ grep -cF "it('queda entre el resumen y la última posición en el árbol'" src/screens/home/index.test.tsx
1
27. $ grep -cF "it('coloca la tira sobre la tarjeta del collar'" src/screens/home/index.test.tsx
1
28. $ grep -cF "it('coloca la rejilla entre el collar y la actividad semanal'" src/screens/home/index.test.tsx
1
29. $ grep -cF "it('coloca la sección entre la actividad semanal y la última posición'" src/screens/home/index.test.tsx
1
30. $ grep -cF 'const mockWithTiming = jest.fn(' src/screens/home/index.test.tsx
1
31. $ grep -cF 'const mockUseReducedMotion = jest.fn' src/screens/home/index.test.tsx
1
32. $ grep -cF 'withDelay: jest.fn(' src/screens/home/index.test.tsx
1
33. $ grep -cF "describe('#152" src/screens/home/index.test.tsx
4
34. $ grep -cF "describe('#152" src/__tests__/design-drift.test.ts
1
35. $ grep -cF 'const MEALS_BAR_STYLE_ESCAPES = new RegExp(' src/__tests__/design-drift.test.ts
1
36. $ grep -cF "describe('#98 R10: la barra de comidas no mete drift de estilo'" src/__tests__/design-drift.test.ts
2
37. $ grep -cF '## Enmienda #152' ../docs/ui-guidelines.md
1
38. $ grep -cF 'Enmienda aprobada por humano' ../docs/ui-guidelines.md
3
39. $ grep -cF -- '- [ ] Enmienda aprobada por humano' ../docs/ui-guidelines.md
1
40. $ test ! -e .expo/types/router.d.ts; echo $?
0
positiva 1. $ grep -cF 'export const MOTION_' src/theme/motion.ts
8
positiva 2. $ grep -cF "'worklet'" src/screens/home/home-entrance.tsx
1
positiva 3. $ grep -cF '<HomeEntrance' src/screens/home/index.tsx
6
positiva 4. $ grep -cF 'testID="summary-reveal"' src/screens/home/index.tsx
1
positiva 5. $ grep -cF 'homeEntering(0, 0)' src/screens/home/index.tsx
1
positiva 6. $ grep -cF '<CollarBatteryBar' src/screens/home/index.tsx
1
positiva 7. $ grep -cF '`src/theme/motion.ts` (enmienda A21 de #152)' ../docs/ui-guidelines.md
1
positiva 8. $ grep -cF "describe('#152 R9" src/__tests__/design-drift.test.ts
1
```

Resultado: las 41 anclas y las ocho positivas cumplen sus valores de cierre. Ancla 4 (valor no fijado): 4.

## Cierre — entering, no regresión y alcance

Desde mobile-pet-tracker:
```text
$ grep -rlF 'entering=' src --include='*.tsx' | LC_ALL=C sort
src/screens/home/home-entrance.tsx
src/screens/home/index.tsx
exit=0
```

Desde mobile-pet-tracker:
```text
$ git diff --stat 36f91e6e -- src/i18n src/theme/global.css src/components src/screens/home/weekly-activity-chart.tsx src/__tests__/ui-copy-table.ts package.json bun.lock
exit=0
```

Desde .:
```text
$ git diff --stat 36f91e6e -- backend-pet-tracker/ infra-pet-tracker/
exit=0
```

Desde .:
```text
$ git diff --name-only 36f91e6e HEAD -- mobile-pet-tracker/
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx
mobile-pet-tracker/src/screens/home/home-entrance.test.tsx
mobile-pet-tracker/src/screens/home/home-entrance.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/home/index.tsx
mobile-pet-tracker/src/theme/__tests__/motion.test.ts
mobile-pet-tracker/src/theme/motion.ts
exit=0
```

Desde .:
```text
$ git diff --name-only 36f91e6e HEAD
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx
mobile-pet-tracker/src/screens/home/home-entrance.test.tsx
mobile-pet-tracker/src/screens/home/home-entrance.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/home/index.tsx
mobile-pet-tracker/src/theme/__tests__/motion.test.ts
mobile-pet-tracker/src/theme/motion.ts
progress/handoff_mobile-home-motion-foundations.md
exit=0
```

Desde .:
```text
$ git status --short
?? progress/impl_mobile-home-motion-foundations.md
exit=0
```

Desde .:
```text
$ git log --reverse --format="%h %s" 36f91e6e..HEAD
f110abac test(mobile-home): #152 R1 red, motion constants
a588f1d8 feat(mobile-home): #152 R1 motion constants in theme/motion.ts
595665b3 test(mobile-home): #152 R2 red, charter points to motion.ts
40ef31a7 docs(mobile-home): #152 R2 charter amendment A21 for motion.ts
de2bab96 test(mobile-home): #152 R3 red, home entrance recipe
0b2ba0da feat(mobile-home): #152 R3 homeEntering worklet
3f42c163 test(mobile-home): #152 R4 red, staggered HomeEntrance
c0bf53cb docs(mobile-home-motion-foundations): #152 handoff amendment E1
891bc4f6 test(mobile-home): #152 R4 red, reanimated double declares __esModule
a34c2712 feat(mobile-home): #152 R4 HomeEntrance wrapper
557ce704 test(mobile-home): #152 R5 red, staggered Home blocks
29eba7b1 test(mobile-home): #152 R6 red, entrance plays once per mount
60371e0a feat(mobile-home): #152 R5 wrap Home blocks in HomeEntrance
a7cbd7d7 test(mobile-home): #152 R7 red, summary reveal fade
03274b2c docs(mobile-home-motion-foundations): #152 handoff amendment E2
bb7f3194 test(mobile-home): #152 R6 red, weight wait matches the full text
630a611e feat(mobile-home): #152 R7 fade in the summary row
c872a3e1 test(mobile-home): #152 R7 red, no fade over the skeleton
b25535eb feat(mobile-home): #152 R7 keep the skeleton without fade
5606d328 test(mobile-home): #152 R8 red, collar battery bar
6da3a9c7 feat(mobile-home): #152 R8 collar battery bar
26092abf test(mobile-home): #152 R8 red, no bar without percentage or collar
b0ab47fc feat(mobile-home): #152 R8 bar only with a numeric percentage
4daff5ff test(mobile-home): #152 R9 red, no style drift in Home motion
8ea0cf5e docs(mobile-home-motion-foundations): #152 handoff amendment E3
11dffcf4 test(mobile-home): #152 R9 red, R8 reads the fill width without StyleSheet
86f4b6ed fix(mobile-home): #152 R9 cite the feature with its R-id
exit=0
```

Resultado: entering solo en los dos ficheros exigidos; NR y backend/infra vacíos; exactamente ocho ficheros mobile versionados contra H0. Los 24 commits propios hasta aquí siguen el orden del handoff con E1/E2/E3; el commit documental final será el número 25. Los tres commits del leader (c0bf53cb, 03274b2c, 8ea0cf5e) cambian exclusivamente el handoff excluido. No hay ficheros ajenos.

## Cierre — trazabilidad y detalles de implementación

Se rellenan R1-R9 con archivo/describe, todos los hashes y mensajes de rojo/verde. R4 cita su rojo original y E1; R6 cita su rojo original, E2 y el verde de R7 A; R8 documenta el ajuste de lectura del primer render de E3 y su commit; R9 cita los dos rojos y el verde. R5 también cita el verde compartido de R7 A. R10 se mantiene literalmente `pendiente (humano)`; no se marca la aprobación de la carta ni ningún gate humano.

Las tres paradas anteriores quedan resueltas exclusivamente mediante E1, E2 y E3 autorizadas por el humano. No se reabren D1-D6 ni se alteran requirements.md, design.md o tasks.md.

Detalles que la spec no fijaba literalmente:

- El argumento de layout que homeEntering no usa se tipa como `unknown`.
- La barra usa `.get()`/`.set()` del valor compartido y el ancho se tipa como porcentaje `${number}%`; sigue el mismo flujo fijado de 0→pct o asignación directa bajo reduce motion.
- Los helpers locales de pruebas reutilizan todos los dobles existentes. Para observar el desmontaje al seleccionar otra mascota en R6 se retienen y resuelven las promesas de detalle/actividad después de ver summary-skeleton. Las esperas se hacen sobre nodos/textos visibles; no sobre contadores de mocks.
- E2 fija la espera literal de peso en `15 kg`; E3 fija `toHaveStyle` para el ancho inicial. Son decisiones del leader autorizadas por el humano, documentadas en sus enmiendas, no cambios de diseño del implementer.

Aclaración de las entradas históricas «Typecheck y lint de la cadena: exit=0»: ese exit es el de la cadena de registro. En los rojos R1, R3 y R4, tsc falla de forma esperada solo con TS2305 en el test nuevo, y la cadena valida esa excepción; lint sí pasa. Se conservan a continuación los diagnósticos TS capturados durante esos rojos, sin repetir tsc:

```text
/tmp/152-r1-tsc.txt
src/theme/__tests__/motion.test.ts(2,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_FEEDBACK_MS'.
src/theme/__tests__/motion.test.ts(3,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_TRANSITION_MS'.
src/theme/__tests__/motion.test.ts(4,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_SURFACE_MS'.
src/theme/__tests__/motion.test.ts(5,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_STAGGER_MS'.
src/theme/__tests__/motion.test.ts(6,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_ENTRANCE_OFFSET_Y'.
src/theme/__tests__/motion.test.ts(7,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_SETTLE_SPRING'.
src/theme/__tests__/motion.test.ts(8,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_FADE_TIMING'.
src/theme/__tests__/motion.test.ts(9,3): error TS2305: Module '"../motion"' has no exported member 'MOTION_FILL_TIMING'.
```

```text
/tmp/152-r3-tsc.txt
src/screens/home/home-entrance.test.tsx(3,10): error TS2305: Module '"./home-entrance"' has no exported member 'homeEntering'.
```

```text
/tmp/152-r4-tsc.txt
src/screens/home/home-entrance.test.tsx(5,24): error TS2305: Module '"./home-entrance"' has no exported member 'HomeEntrance'.
```

```text
/tmp/152-r4e1-tsc.txt
src/screens/home/home-entrance.test.tsx(5,24): error TS2305: Module '"./home-entrance"' has no exported member 'HomeEntrance'.
```

Resultado de cierre antes del commit documental: R1-R9 implementados y verificados; comparación de base 5 suites/320 tests (281 + 39), suite completa 96 suites/2209 tests; typecheck y lint exit=0. Anclas y alcance correctos. Quedan para el humano R10 y la casilla de aprobación de la enmienda A21; para el leader, el gate con init.sh, push y PR.

## Cierre — lista cerrada del commit documental

Orden de los 24 commits propios de R1-R9 comprobado por hash; el siguiente es el commit documental número 25 de E3. No se rebasea ni se reescribe ninguno de esos hashes.

Para incluir este mismo reporte y la trazabilidad en la lista sin crear un commit adicional, se prepara el índice y se mide contra H0. Esta es la salida real del árbol preparado para el commit final:

```text
$ git diff --cached --name-only 36f91e6e -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-home-motion-foundations.md' ':!specs/mobile-home-motion-foundations/requirements.md' ':!specs/mobile-home-motion-foundations/design.md' ':!specs/mobile-home-motion-foundations/tasks.md'
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx
mobile-pet-tracker/src/screens/home/home-entrance.test.tsx
mobile-pet-tracker/src/screens/home/home-entrance.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/home/index.tsx
mobile-pet-tracker/src/theme/__tests__/motion.test.ts
mobile-pet-tracker/src/theme/motion.ts
progress/impl_mobile-home-motion-foundations.md
specs/mobile-home-motion-foundations/traceability.md
exit=0
```

La verificación posterior al commit usa el comando literal del handoff y exige exactamente esta misma lista de once ficheros:

```bash
git diff --name-only 36f91e6e HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-home-motion-foundations.md' ':!specs/mobile-home-motion-foundations/requirements.md' ':!specs/mobile-home-motion-foundations/design.md' ':!specs/mobile-home-motion-foundations/tasks.md'
```

La comprobación de HEAD y del estado limpio se realiza después del commit sin reescribir este reporte, sin añadir otro commit ni alterar hashes.

Cadena final desde la raíz (se añade al principio el control de ausencia de router.d.ts requerido en cada cadena):

```bash
test ! -e mobile-pet-tracker/.expo/types/router.d.ts \
  && git add specs/mobile-home-motion-foundations/traceability.md progress/impl_mobile-home-motion-foundations.md \
  && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-home-motion-foundations.md specs/mobile-home-motion-foundations/traceability.md ' \
  && git commit -m 'docs(mobile-home-motion-foundations): #152 traceability'
```

R1-R9 completos. R10 y la aprobación de la enmienda A21 permanecen reservados al humano. Este cierre no ejecuta init.sh ni hace push o PR.
