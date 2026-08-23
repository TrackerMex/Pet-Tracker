# explore: mobile-figma-polish (#46)
Fecha: 2026-08-23

## BLOQUEO PARCIAL: fuente del Figma Make no accesible desde este subagente

El MCP de Figma respondió al Make `K3GsL0HHUCW3AaFj3osx0B` con **resource links**
(no contenido inline), y el entorno del subagente **no expone ninguna herramienta
para dereferenciar recursos MCP** (`ReadMcpResourceTool`/`ListMcpResourcesTool`
no existen vía ToolSearch; `read_skill_uri` rechaza URIs que no sean `skill://`;
`get_screenshot`/`get_metadata`/`download_assets` rechazan archivos `/make/`;
`forceCode: true` devuelve los mismos links). Por tanto la sección 1 y 2
(tokens y estructura por pantalla del diseño) quedan **pendientes de un paso
del leader**, no de más investigación.

### Qué sí se confirmó del Make (del listado completo de 63 archivos fuente)

- **Toda la app del diseño vive en `src/app/App.tsx`** — el listado es exhaustivo
  ("63 of 63 source files") y no hay ningún otro componente propio salvo
  `src/app/components/figma/ImageWithFallback.tsx`; el resto es shadcn genérico
  (`src/app/components/ui/*`, ignorable). Es decir: **solo hay que leer ~6 archivos**.
- Archivos que contienen todo lo que pide la spec, en orden de prioridad:
  1. `file://figma/make/source/K3GsL0HHUCW3AaFj3osx0B/src/app/App.tsx` (todas las pantallas)
  2. `file://figma/make/source/K3GsL0HHUCW3AaFj3osx0B/src/styles/theme.css` (tokens)
  3. `file://figma/make/source/K3GsL0HHUCW3AaFj3osx0B/src/styles/globals.css`
  4. `file://figma/make/source/K3GsL0HHUCW3AaFj3osx0B/src/styles/fonts.css`
  5. `file://figma/make/source/K3GsL0HHUCW3AaFj3osx0B/guidelines/Guidelines.md`
  6. `file://figma/make/source/K3GsL0HHUCW3AaFj3osx0B/src/imports/pasted_text/pet-tracker-brief.md` (brief original)
  (secundarios: `src/styles/index.css`, `src/styles/tailwind.css`,
  `default_shadcn_theme.css` — este último es el tema por defecto, útil solo
  para saber qué tokens fueron sobreescritos en theme.css)

### Cómo desbloquear (elige el leader)

- **Opción A (recomendada)**: el leader —que sí tiene `ReadMcpResourceTool` en su
  sesión— lee esas 6 URIs y guarda el contenido tal cual en
  `specs/mobile-figma-polish/design-src/` (App.tsx, theme.css, globals.css,
  fonts.css, Guidelines.md, brief.md). Con eso en disco, spec_author completa
  tokens + estructura sin depender del MCP.
- **Opción B**: el humano descarga el zip del Make (opción "Download" en la UI de
  Figma Make) y lo deja en el repo; mismo resultado.

## Contexto encontrado (app actual — completo)

### Stack de estilo actual

- Tailwind v4 + `uniwind` (className en RN) + **heroui-native 1.0.8** como
  librería de componentes (`Button`, `Card`, `Chip`, `Input`, `Label`,
  `TextField`, `Skeleton`, `Spinner`, `LinkButton`).
- Tokens actuales: `mobile-pet-tracker/src/theme/global.css` define **solo un
  override**: `--accent: #208AEF` (igual en light y dark) sobre el tema de
  heroui-native. Todo lo demás (`background`, `surface`, `foreground`, `muted`,
  `border`, `danger`, `success`, `warning`) viene del tema por defecto de
  heroui-native. No hay archivo de tipografía ni fuentes custom cargadas
  (no hay `useFonts`/`expo-font` en código, aunque `expo-font ~57.0.1` ya está
  en package.json — cargar una fuente de Google no requiere deps nuevas).
- Dark mode: ya existe, toggle manual en Profile vía `Uniwind.setTheme`.
- Tab bar: componente propio `src/components/floating-tab-bar.tsx` — pill
  flotante (`rounded-full bg-surface border-border shadow-lg`, bottom
  insets+12, márgenes 16), iconos `reicon-react-native` 24px con peso
  Filled/Outline y label 12px, activo en `accent`.

### Estructura por pantalla actual (para el gap análisis cuando haya diseño)

- `src/app/(tabs)/home.tsx`: título "Home" (text-2xl semibold) → chips de
  mascotas (pill `bg-accent`/`bg-surface`, px-4 py-2) → Card mascota (foto
  72px circular + nombre/raza) → Card collar (Wifi/Battery) → Card "Today's
  Summary" (3 columnas Activity/Sleep/Distance) → Pressable "View on map".
  Padding global 24, gap 16.
- `src/app/(tabs)/map.tsx`: MapView fullscreen + Card de stats flotante
  (4 columnas Speed/Distance/Updated/GPS) + botón "Activate Lost Mode"
  deshabilitado + estados empty/no-tracking centrados.
- `src/app/(tabs)/health.tsx`: título → chips mascotas (duplicados de home,
  patrón copy-paste) → sección Vaccines (card "Next due" + lista de cards) →
  Card Weight (peso actual + variación + link a weight-log).
- `src/app/(tabs)/weight-log.tsx`: back pill + título → `WeightChart`
  (polyline SVG 120px alto, stroke accent) → Card formulario (3 TextField +
  Button) → lista de cards de entradas.
- `src/app/(tabs)/food.tsx`: **placeholder** (solo texto centrado).
- `src/app/(tabs)/profile.tsx`: Card "App" (chip salud backend, API url,
  toggle tema, retry) + botón Sign out. No muestra datos del usuario.
- `src/app/(auth)/login.tsx` (y register/forgot con el mismo patrón):
  formulario centrado plano sobre `bg-background`, sin logo, sin ilustración,
  sin card contenedora.
- Layout: `src/app/(tabs)/_layout.tsx` inyecta FloatingTabBar; headers nativos
  ocultos en todas partes (`headerShown: false`).

### Patrón de tests que limita el pulido

Los tests de conducta (#33-#37) en `src/app/(tabs)/__tests__/` y
`src/app/(auth)/__tests__/` se anclan a **testID** (`screen-home`,
`pet-chip-*`, `summary-card`, `stat-speed`, `weight-row-*`, `tab-*`, etc.) y a
textos visibles ("No pets yet", "Today's Summary", "Activate Lost Mode"…).
Cambiar `className`/`style` es seguro; cambiar copy visible o quitar/renombrar
testIDs rompe la suite.

## Riesgos / ambigüedades

- **R1 — Traducción shadcn→heroui-native**: el diseño está escrito en React
  web + Tailwind + shadcn. La spec debe mapear tokens del theme.css del Make a
  los nombres de token de heroui-native (`--accent`, `--surface`, …) en
  `src/theme/global.css`, no importar el CSS del Make tal cual (variables
  shadcn como `--primary`/`--card` no existen en heroui-native).
- **R2 — Fuentes custom**: si fonts.css trae una familia custom, cargarla vía
  `expo-font` (ya instalado, funciona en Expo Go). Decisión abierta: ¿se
  acepta la fuente del sistema como fallback si la fuente no es de Google Fonts?
- **R3 — Pantallas del diseño sin equivalente real**: el Make casi seguro trae
  pantallas (onboarding, food completo, detalle de mascota…) que la app no
  tiene; #46 es solo re-estilizar las existentes. La spec debe listar
  explícitamente qué pantallas del diseño quedan fuera.
- **R4 — Copy**: si el diseño usa textos distintos ("Mi manada" vs "Home"),
  cambiarlos rompe asserts. Decisión abierta: ¿el pulido incluye copy (y
  entonces se tocan los asserts de texto, contra el criterio de "sin reescribir
  asserts") o solo estilo? Recomendación: solo estilo en #46.
- **R5 — Capturas para la spec**: `get_screenshot` no funciona en archivos
  Make. Las "capturas versionadas" del acceptance criteria deben salir de la
  UI del Make (humano) o de las imágenes exportadas del propio Make (abajo).
- **R6 — Cero deps nuevas / Expo Go**: cualquier cosa del diseño que pida
  blur/gradientes ya está cubierta (`expo-blur`, `expo-glass-effect`
  instalados); nada del pulido debería requerir módulos nativos nuevos.

## Recomendación

1. Leader ejecuta la Opción A (leer las 6 URIs y volcarlas a
   `specs/mobile-figma-polish/design-src/`) — es un paso de minutos y deja la
   fuente versionada, cumpliendo el criterio "no descripciones de memoria".
2. spec_author deriva de theme.css/App.tsx: (a) tabla de mapeo token Make →
   token heroui-native en `global.css`, (b) por pantalla, lista concreta de
   diffs de className, (c) lista de exclusiones (pantallas del Make fuera de
   alcance), (d) regla dura: ni testIDs ni copy cambian.
3. Extraer los chips de mascota duplicados (home/health) a un componente común
   solo si el pulido los toca en ambos sitios; si no, no refactorizar.

## Assets

El Make expone 139 imágenes PNG (137 listadas) bajo
`file://figma/make/image/K3GsL0HHUCW3AaFj3osx0B/<hash>.png`. Sin App.tsx no se
puede saber cuál es logo/ilustración vs. foto de relleno; al leer App.tsx
(Opción A) los hashes referenciados desde el código indican los que importan.
La app actual solo tiene `mobile-pet-tracker/assets/images` (icono Expo).
