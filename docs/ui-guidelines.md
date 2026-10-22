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
   (#115-#119).

## Decisiones fijas de este repo (no re-litigar)

1. **Sistema de estilos**: Tailwind v4 + uniwind + heroui-native. Tokens en
   `mobile-pet-tracker/src/theme/global.css` — ÚNICA entrada. Prohibido
   crear un segundo sistema (theme.ts paralelo, StyleSheet.create,
   styled-components).
2. **Tokens obligatorios**: todo valor visual repetido es un token en
   `@theme` de global.css. Existentes: colores semánticos light/dark,
   fuentes Inter, `--radius-card: 20px`, `--text-2xs: 10px`. Si un valor
   nuevo se repite 2+, se añade token — no clase arbitraria.
   Tamaños de letra fuera de la escala de Tailwind (fidelidad al canvas, #173): `--text-13: 13px`, `--text-26: 26px`, `--text-11: 11px`, `--text-15: 15px`, `--text-17: 17px`, `--text-22: 22px`; cada uno es token aunque se use una vez, porque la clase arbitraria está prohibida.
   Tracking fuera de la escala de Tailwind (fidelidad al canvas, #174): `--tracking-title: -0.02em`, `--tracking-caps: 0.06em`, `--tracking-eyebrow: 0.08em`; la clase `tracking-*` va con una clase `text-*` en el mismo elemento, porque uniwind multiplica el `em` por su tamaño.
3. **Grep-clean permanente** (criterio de aceptación de toda feature móvil):
   - cero hex fuera de `src/theme/`
   - cero clases arbitrarias `[...]` (`rounded-[20px]`, `text-[10px]`,
     `p-[13px]`...) — usar el token; si no existe, crearlo primero
   - cero `StyleSheet.create`, cero shadow/elevation legacy (solo `boxShadow`)
4. **Componentes compartidos** (`src/components/`): `card.tsx`
   (surface | accent | secondary | hero | flat — usa `--radius-card`, NUNCA heredar `--radius`
   de heroui/shadcn, bug #46), `pet-switcher.tsx` (selector de mascota,
   siempre este), `floating-tab-bar.tsx`, `weight-chart.tsx`, `pet-map.tsx`
   (adapta el contrato del tab Map a la API nativa de `expo-maps`), y
   `field-error-message.tsx` (`FieldErrorMessage({ testID, issue })`,
   `testID: string`, `issue?: RuleIssue | null`; testIDs `<base>-error`,
   `<base>-message` y `<base>-message-row`). Regla de
   extracción: ≥2 pantallas + rol nombrable + API menor que implementación.
   Promoción: inline → `src/screens/<x>/` → `src/components/`.
   Las variantes `hero` y `flat` no llevan sombra y solo las usa Perfil (#173).
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
   **Excepción nombrada, enmienda A9 de #67**: si el primer hijo del scroll es
   una **cabecera a sangre**, el `contentContainerStyle` conserva `gap` y
   `paddingBottom`, el padding horizontal de 24 baja a un envoltorio interior,
   y el `paddingTop: insets.top + 12` lo asume la cabecera vía su slot. Las
   ramas de estado sin cabecera llevan su propio envoltorio con ese
   `paddingTop`.

   **Excepción nombrada (enmienda A11 de #95, 2026-09-23)**: una pantalla empujada
   sobre el Stack raíz con cabecera nativa (`headerShown: true`) —hoy
   `add-reminder`, `pets/add`, `pets/[petId]/docs`, `pets/[petId]/docs-upload` (por #185), `weight-log`,
   `meal-schedule`, `pairing`, `reminders`, `alerts` (estas dos por la enmienda A13 de #114, 2026-09-23), `alerts/[alertId]` (por la enmienda A15 de #100, 2026-09-28), `pets/[petId]/geofences` (por la enmienda A18 de #41, 2026-10-02) y `pets/[petId]/geofence-editor` (por la enmienda A19 de #146, 2026-10-02) y `meals-history` (por la enmienda A20 de #105, 2026-10-04)— no lleva `paddingTop: insets.top + 12`, porque
   el inset superior lo consume la cabecera, ni `paddingBottom: insets.bottom +
   96`, porque sobre ella no flota el `FloatingTabBar`. Su
   `contentContainerStyle` es `padding: 24`, `gap: 16` y `paddingBottom:
   insets.bottom + 24`, la misma holgura inferior que `(auth)` y
   `reset-password`.
   `pets/[petId]/geofences` queda fuera de esta excepción desde #189 E4 (cabecera transparente, ver más abajo).

   **Excepción nombrada (fidelidad al canvas, 2026-10-13)**: una pantalla llevada al canvas aprobado usa padding lateral 20 y el `gap` de su artboard; ver conventions.md §Dimensiones, misma excepción.
   Zonas seguras (#189): `paddingHorizontal: 20`, `paddingTop: insets.top + 6`, `gap: 12`, `paddingBottom: insets.bottom + 40`.
   Hoja del Editor (#189): `paddingHorizontal: 20`, `paddingTop: 12`, `gap: 14`, `paddingBottom: insets.bottom + 36`.
   Cabecera nativa transparente (#189 E4): Zonas seguras y la rama de formulario del Editor usan `headerTransparent: true` con `headerStyle: { backgroundColor: 'transparent' }`; el contenido empieza bajo la cabecera, el título comparte fila con la flecha, el `paddingTop` suma `insets.top` y no se usa `contentInsetAdjustmentBehavior`. Las ramas de estado del Editor conservan la cabecera opaca.
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
      volver) → `rounded-full`.

    **Enmienda #173**: la escala suma dos radios para Perfil y queda en cinco:
    - `rounded-hero` (28 px): tarjeta hero de Perfil, vía `Card variant="hero"`.
    - `rounded-tile` (18 px): tiles de acceso de Perfil, excepción al control anterior.
    También son cápsulas la acción de cabecera «Añadir mascota» y el botón de cámara.

    `rounded-2xl`, `rounded-lg`, `rounded-md` y `rounded-sm` quedan
    **prohibidos en `mobile-pet-tracker/src/`**: no son un cuarto rol, son
    drift. El grep que lo verifica vive en
    `src/__tests__/consistency-classnames.test.ts`.

    Dos corolarios mecánicos: todo `Skeleton` lleva el radio del contenido
    que sustituye (card ⇒ `rounded-card`, control ⇒ `rounded-xl`), y toda
    esquina no-cápsula **que el repo dibuja por su cuenta** (`View`,
    `Pressable`, `TextInput`, el `Card` compartido) declara
    `style={CONTINUOUS_CORNER}` de `src/theme/native-styles.ts` — los
    componentes de heroui-native ya lo traen de fábrica y no se envuelven
    para añadírselo.

    Fuera de la escala, por fidelidad al canvas (#174): `rounded-10` (10 px), ack compacto de fila de Alertas.
    Fuera de la escala, por fidelidad al canvas (#175): `rounded-24` (24 px), zona de subida de Documentos.
    Fuera de la escala, por fidelidad al canvas (#178): `rounded-14` (14 px), mosaico del icono de la fila de Recordatorios; `rounded-16` (16 px), píldoras de resumen de Recordatorios; `rounded-22` (22 px), fila de Recordatorios, que es un `View` y no un `Card` porque `twMerge` no sustituye `rounded-card` por un radio con nombre de valor.
    Fuera de la escala, por fidelidad al canvas (#179): `rounded-10` (10 px), «Editar» de la fila de Horario; `rounded-14` (14 px), mosaico de la fila y botones de acción de Horario y horas del panel del día de Historial; `rounded-24` (24 px), resumen de Horario y calendario y panel del día de Historial, que son `View` y no `Card` porque `twMerge` no sustituye `rounded-card` por un radio con nombre de valor.
    Fuera de la escala, por fidelidad al canvas (#180): `rounded-24` (24 px), mapa del detalle de alerta, que es un View y no un Card; `rounded-16` (16 px), ack y «Ver en el mapa» del detalle de alerta.

    Fuera de la escala, por fidelidad al canvas (#189): `rounded-14` (tile de la zona), `rounded-tile` (aviso de límite), `rounded-t-hero` (hoja del Editor) y `rounded-16` (botones).

    Fuera de la escala, por fidelidad al canvas (#177): `rounded-16` es el radio de todo botón de 56 de alto y del tile del candado; el compacto de 40 conserva `rounded-xl`.

    Fuera de la escala, por fidelidad al canvas (#191): `rounded-10` (10 px) y `rounded-14` (14 px), segmentos y contenedor del selector segmentado de Nueva mascota; `rounded-tile` (18 px) de la burbuja de Pingo, que es un `View` y no un `Card`.

13. **Botón con cuerpo** (feature #166, 2026-10-11). Los botones de acción
    llevan un labio inferior: una sombra sólida sin desenfoque en `--lip`
    (`--color-lip`, `--color-lip-gray`) que cuelga fuera del cuerpo. El hook
    `useChunkyLip()` resuelve los tokens de cada tema y entrega los estilos.
    - **Primario sólido**: `h-14 rounded-16 bg-accent`, con
      `style={chunkyLip.primary}` y etiqueta `Text`
      `text-17 font-extrabold text-accent-foreground`; cuerpo de 56 y labio de 4.
    - **Secundario neutro** (`variant="outline"` o `variant="secondary"`
      sin relleno tonal, y el secundario de Bienvenida):
      `h-14 rounded-16 border-2 border-lip-gray bg-surface`, con
      `style={chunkyLip.neutral}` y labio gris de 4. La etiqueta es `Text`
      `text-17 font-extrabold text-foreground`; «Ya tengo cuenta» conserva
      `text-17 font-bold text-accent-strong`. «Ver en el mapa» del detalle
      conserva `h-13` y su `Button.Label` `text-base font-extrabold text-foreground`.
    «Eliminar» del Editor es secundario neutro con etiqueta `text-base font-extrabold text-danger`, excepción a `text-17 … text-foreground` del neutro; sale de «Sin labio».
    La papelera de la fila de zona es una excepción solo-icono (`size-11 rounded-xl bg-danger-soft`).
    - **Compacto**: `reminders-add-link` conserva `h-10`, `rounded-xl`,
      `gap-1.5 px-3.5`, su icono y `Button.Label` `text-sm font-extrabold text-accent-foreground`;
      usa `style={chunkyLip.primaryCompact}` (`chunkyLip.primaryCompact`, labio de 3).
    - **Tile con labio**: `forgot-lock-tile` conserva su tamaño y lleva
      `bg-accent rounded-16`, con `style={[CONTINUOUS_CORNER, chunkyLip.primary]}`.
      El tile del candado lleva `bg-accent` antes de `rounded-16` para no contar como primario.
    - **Deshabilitado**: `h-14 rounded-16 bg-default`, etiqueta
      `text-17 font-extrabold text-muted`, sin labio; la aplican #189: Añadir zona en el límite y Guardar con nombre vacío.
    El tamaño 17 se pinta con `Text` plano de React Native por la regla de la
    Enmienda #187; no se pasa `text-17` a `Button.Label`.
    El bloqueo (`isDisabled`) no atenúa: en #189 los `Switch` y `Button` de heroui cancelan el 50 % de `disabled:element-disabled` con `KEEP_OPACITY`, y la receta gris del límite no lleva opacidad.
    - **Chip seleccionado** (fidelidad al canvas, #178): cápsula `rounded-full bg-accent border-b-3 border-black/25`; el chip sin seleccionar no lleva labio.
    - **Secundarios de Horario** (fidelidad al canvas, #179): «Editar» `h-9.75 rounded-10 border-2 border-b-5 border-lip-gray bg-surface` y «Añadir comida» `h-13.5 rounded-14 border-2 border-b-6 border-lip-gray bg-surface`, con el labio dentro del alto; «Generar plan» es tonal de la categoría violeta y sin labio, porque el labio del artboard (`rgba(91,63,163,0.35)`) no tiene token.
    - **Sin labio**: los tonales (`bg-accent-soft`, `bg-default`), los
      destructivos (`bg-danger`, `variant="danger-soft"`) y las primarias
      de heroui sin color en `className` (reintentos).
    - **Secundario compacto de fila** (#174): el ack de cada fila abierta de Alertas lleva `h-8.5 rounded-10 border-2 border-b-5 border-lip-gray bg-surface px-3`, etiqueta `text-xs font-extrabold text-foreground` y `hitSlop={TOUCH_SLOP}` (34 + 12 = 46 de diana). Es la única excepción a la receta del secundario neutro; el inventario de #166 R3 lo lista por su `testID`.
    - Primario del detalle de alerta (#180): ack con labio, h-14 rounded-16, etiqueta text-17 font-extrabold; el secundario «Ver en el mapa» es h-13 rounded-16 con el icono Map.
    La cápsula «Añadir mascota» con `bg-tab-pill` es tonal y no lleva labio (#173).
    Los inventarios que lo verifican viven en
    `src/__tests__/consistency-classnames.test.ts`.

## Animación (decisiones por defecto)

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
- Backlog priorizado con valores exactos: `progress/audit_animations_mobile.md`.

## Micro-reglas de pulido (de expo-native-ui, adoptadas)

- `borderCurve: 'continuous'` en toda esquina redondeada no-cápsula.
- `gap` sobre margin; padding sobre margin.
- `<Text selectable />` en datos copiables y mensajes de error.
- Contadores/números alineados: `fontVariant: ['tabular-nums']`.
- Números grandes formateados (1.4M, 38k).
- Feedback pressed en TODO elemento tappable (Pressable style function o
  componente heroui que ya lo trae); touch target ≥ 44pt.
- Títulos de pantalla: título en contenido y cabecera nativa con `title: ''` (Enmienda de fidelidad al canvas).

## Dirección de arte

> Añadida el 2026-09-04 tras `progress/explore_design-gap-vs-make.md`. Hasta
> aquí esta carta era un sistema de estilos —tokens, radios, componentes— y no
> decía nada sobre qué debe *parecer* ni qué debe *responder* una pantalla. El
> brief del producto sí lo dice, y las specs no lo estaban leyendo.

**1. Paleta pastel categórica.** El brief pide un producto "amigable, lúdico,
con colores pastel". Cuando una pantalla distingue **categorías** —tipos de
recordatorio, tipos de documento, destinos de acceso rápido— cada categoría
lleva su propio fondo pastel, no el mismo `accent-soft` para todas. Esos
fondos son **tokens de `global.css`**, nunca hex sueltos ni clases arbitrarias:
la regla de §Decisiones fijas 3 no tiene excepción por ser "un color de
adorno". Los valores del Make son de tema claro y no traen equivalente
oscuro: el dark se diseña, no se copia, y cada par texto/superficie se
verifica AA con contraste **calculado**, como fijó #61.

Los seis huecos, cerrados (feature #64, 2026-09-04). Toda sección categórica
consume estos tokens; ninguna inventa un hex ni una clase arbitraria:

| Hueco | Superficie | Tinta | Tipos que lo ocupan |
|---|---|---|---|
| azul | `bg-category-blue` | `text-category-blue-strong` | recordatorio `vaccine`; documento de vacunación |
| ámbar | `bg-category-amber` | `text-category-amber-strong` | recordatorio `medication`; documento de desparasitación |
| verde | `bg-category-green` | `text-category-green-strong` | recordatorio `appointment`; documento de consulta |
| violeta | `bg-category-violet` | `text-category-violet-strong` | recordatorio `deworming`; documento de análisis |
| rosa | `bg-category-rose` | `text-category-rose-strong` | recordatorio `food` |
| neutral | `bg-default` | `text-muted` | recordatorio `weight` y `custom`; cualquier tipo de documento desconocido |

El reparto vive en `src/utils/category-palette.ts` y es el **único** sitio donde
se escriben esos nombres de clase. El color nunca es el único portador de la
categoría: la superficie siempre acompaña a un icono de reicon-react-native y a un texto.

`zoneCategory` (orden `green, blue, amber, violet, rose`) es el único reparto categoría → ranura de las zonas; el color es de la posición en la lista, no de la zona.

**2. Fotografía y su respaldo.** Las cabeceras fotográficas asumen que la
mascota tiene foto. Cuando no la tiene, el respaldo es el **blobatar**
determinista de la mascota, que es lo que `pet-avatar` pinta de verdad. Ni
ilustración por especie ni foto obligatoria en el alta. Y sea cual sea la
imagen, **el texto que va encima pasa AA**.

> **Enmendado por #67 (A8) — corrección de un hecho falso.** Hasta el
> 2026-09-06 este punto decía *"el respaldo es degradado con la inicial —el
> patrón que ya usa `pet-avatar`—, decidido por el humano el 2026-09-04"*.
> Era falso de origen: `src/components/pet-avatar.tsx` pinta `blobatar(name)`
> con `SvgXml` y nunca una inicial, y la R5 aprobada de #40 (2026-08-21)
> sustituyó explícitamente el fallback de inicial por el blobatar. El error
> venía de `progress/explore_design-gap-vs-make.md` y se propagó también al
> enunciado de #67 en `feature_list.json`. Y la garantía de AA no la da el
> degradado: la da la **banda opaca** bajo el texto (#67 R3), porque ningún
> velo sobre una foto arbitraria llega a 4,5:1.

**3. Las siete preguntas de la Home.** El brief fija qué debe responder la
pantalla principal: ¿está segura?, ¿dónde está?, ¿el collar está conectado?,
¿tiene batería?, ¿tiene algún recordatorio pendiente?, ¿cómo fue su actividad
hoy?, ¿hay alguna alerta? Toda spec que toque la Home **declara cuáles de las
siete responde y cuáles no**, y por qué. No es decoración: es el criterio de
aceptación de la pantalla.

**4. Nada de jerga del proveedor.** El brief lo prohíbe explícitamente: los
términos técnicos de Wialon no se muestran al usuario final. Si un dato solo
se puede explicar con vocabulario de la integración, se traduce o no se
enseña.

**5. Fidelidad no es pérdida de información.** El diseño oculta datos que la
app ya sirve (la rejilla del mapa, el perfil nutricional, los avisos de plan)
y no dibuja estados que existen de verdad, como el 402 de "sin suscripción".
Parecerse al diseño **no** autoriza a borrar un dato útil: la spec que se
encuentre con uno o lo conserva, o escribe por qué se va.

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
idioma elegido (`es-MX` / `en-US`), no al locale del sistema.

Tres corolarios que nadie debe confundir con lo anterior:

- **El idioma del código no cambia.** Nombres de variables, funciones, tipos,
  ficheros, `testID`, rutas y **las claves del catálogo** siguen en inglés, y
  los mensajes de commit también (`docs/conventions.md` §Commits).
- **Los formularios muestran sus validaciones en el idioma de la app.**
  Los mensajes de validación del servidor se resuelven mediante el catálogo móvil,
  como aviso genérico o mensaje de campo, sin mostrar texto crudo.
  Las advertencias nutricionales del backend ya llegan en español y se muestran
  tal cual — y en inglés también, porque tampoco se traducen.
- **Los valores de enum que la API devuelve se pintan crudos**: `document.type`,
  `foodType`, `activityLevel`. Siguen en inglés en los dos
  idiomas. Mapearlos es cambio de conducta y va a feature propia.
  `device.connectivity` dejó de pintarse crudo en la feature #68 (R16): se
  resuelve por catálogo en `src/utils/device-connectivity.ts`.
  `pet.sex` se localiza desde #173 con `addPet.male` / `addPet.female`.

**7. Voz de Pingo: guardián sereno.** Decidido por el humano el 2026-10-07
(D1 de la feature #153): la mascota se llama **Pingo** y habla con la voz B,
«guardián sereno». Rige todo texto que la app pone en boca de Pingo
(bocadillos, estados vacíos, celebraciones, avisos); el resto del copy sigue el
punto 6 sin más. Cada frase nueva de Pingo entra con su clave en los dos
idiomas, como cualquier otra copy.

- **Tono:** tranquilo y cálido; da seguridad. En español, tutea.
- **Persona:** Pingo habla en primera persona («te ayudo», «te recomiendo») y
  llama a la mascota del usuario por su nombre, con el marcador `{{petName}}`.
- **Sin emoji**, en ningún idioma.
- **Exclamaciones solo para celebrar.** Un saludo, un aviso o un estado vacío
  terminan en punto.
- **Sin bromas en las alertas.** Una alerta de Pingo dice qué pasa y qué hacer.
- **En inglés, registro neutro.**
- **Bucles de reposo.** Flotar, parpadear y los tres anillos de ping que
  rodean a Pingo en la bienvenida son las únicas animaciones continuas de
  Pingo, y una excepción declarada a §Animación: animan `translateY`,
  `scale` y `opacity` con timing y duraciones fuera de 150/250/400,
  porque no entran, ni salen, ni responden a un gesto. Sus constantes viven en
  `src/theme/motion.ts` y no arrancan con reduce motion.
  La enmienda #171 suma a esta lista la flotación y el anillo de ping de
  Pingo en la celebración, y la lluvia de confeti que la acompaña: los tres
  se repiten mientras la celebración está abierta.

## Checklist de autocrítica (cierra toda pantalla nueva o modificada)

Screenshot mental (o real en smoke) contra: jerarquía (lo importante
primero), proximidad (relacionado más cerca), repetición (esquinas/sombras/
acentos iguales = tokens), alineación (bordes comparten ejes). Si una
pantalla falla el mismo check dos veces, el fix va al theme o a un
componente — no a la pantalla.

## Enmienda #67 — cabecera fotográfica compartida

`mobile-pet-hero-header` (#67) modifica una decisión que esta spec dejó
aprobada. La spec de origen es `specs/mobile-pet-hero-header/`; el detalle de
la enmienda está en su `requirements.md` §R10.

- Spec enmendada: `docs/ui-guidelines.md`
- Qué cambia: `enmiendas A8 y A9 de la tabla de #67 §R10`
- Qué NO cambia: ningún otro requisito de esta spec, ni su estado de
  aprobación, ni los tests que ya la cubren.

- [X] Enmienda aprobada por humano

## Enmienda #70 — elementos repetidos: qué hay que candar

> Añadida el 2026-09-09. Tres features seguidas —#69, #71, #70— cerraron con el
> mismo patrón: la revisión destapa una dimensión sin vigilar, se cierra, y la
> siguiente revisión destapa otra por el mismo mecanismo. Cuatro rondas, cuatro
> dimensiones. Esta lista existe para que la quinta no haga falta.

Cuando una pantalla pinta un **elemento repetido** —una celda de una tira, un
tile de una rejilla, una fila de una lista— la spec enumera **todas** las
decisiones que ese elemento toma, y el criterio de aceptación es siempre el
mismo: **cruzar cualquiera de ellas entre dos elementos pone la suite roja**,
observado con `within(elemento)`.

**Decisiones de conducta, una por elemento:**

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
    ramas, no solo la cargada: si el estado vacío promete "la misma anatomía de
    fila", eso es una aserción, no una frase del título del test;
11. **envoltorios de agrupación** (`flex-1` y equivalentes) que reparten el
    espacio;
12. **orden de los hijos**. `within(row).getByTestId(...)` es **agnóstico al
    orden**: intercambiar dos textos deja la suite entera verde. Se cierra
    fijando la posición, p. ej.
    `expect(row.children[1]).toHaveProperty('props.className', 'flex-1')`.

**Estructurales, del contenedor:** identidad, orden y cardinalidad. El recuento
se cierra con `children.length`, **nunca contando coincidencias de `testID`** —
un recuento por prefijo deja pasar cualquier hijo sin `testID`.

**Invariantes compartidos, a inventariar aparte:** tamaño de icono, objetivo
táctil y reparto, radio, rol y agrupación accesible, sitio de render, y feedback
de pulsado.

> **Inventariar no es candar.** Añadido el 2026-09-09 tras #85: la spec copió
> esta lista en prosa —incluido "tamaño de icono"— y aun así el `size={20}` del
> icono de fila quedó sin una sola aserción: ponerlo a `28` dejó la suite móvil
> completa verde. Cada invariante de esta lista necesita **un `expect`**, no una
> mención. Y ojo con el caso que lo produjo: un `size` renderizado **por
> variable** no lo ve ningún recuento de literales en el fuente.

**Método**: cada candado se demuestra con una sonda —cruzar el valor en
producción, ver el rojo, restaurar con `git diff` vacío— y la evidencia se
escribe. Un candado que nadie vio fallar no es un candado.

## Enmienda #98 — la barra de comidas de la Home

`mobile-meals-served-ui` (#98) añade a la sección de recordatorios una barra
informativa de las comidas servidas hoy. Se pinta solo con detalle cargado y
`mealsToday !== null`, inmediatamente después de la próxima vacuna y antes del
estado vacío o de las filas de recordatorio.

**Decisiones de conducta de la barra:**

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
    carril; dentro de la cabecera, título y contador.

**Estructura e invariantes:** la fila tiene dos hijos, igual que la columna y
la cabecera; el carril tiene un único relleno. El disco es una cápsula de
36 px, el carril usa `h-1.5 overflow-hidden rounded-full bg-default` y el
relleno usa `h-full rounded-full bg-accent`. Esto último aplica la regla fija
**fondo ⇒ `bg-accent`**; `bg-accent-strong` sería tinta, no fondo. El ancho se
calcula como el porcentaje redondeado de `served / total`, o `0%` si el total
es cero.

- [X] Enmienda aprobada por humano


## Enmienda #152 — el movimiento vive en src/theme/motion.ts

Enmienda A21: Reanimated consume números y §Animación prohíbe pasarle
variables CSS. Las duraciones y configuraciones compartidas de movimiento
viven en `src/theme/motion.ts`.

`motion.ts` no es un segundo sistema de estilos en el sentido de
§Decisiones fijas 1: no contiene colores, espaciados, radios ni clases,
solo duraciones y configuraciones de Reanimated. Tiene los precedentes
`native-styles.ts` y `touch-target.ts` en la misma carpeta.

Las constantes anteriores a #152 (`MEALS_BAR_TIMING`, `KCAL_BAR_TIMING`,
`BAR_ENTRY_*`, `METRIC_TAB_SPRING` y `TAB_INDICATOR_SPRING`) migran a
`motion.ts` en una feature posterior, fuera del alcance de esta.
`WELCOME_ENTRANCE_MS` no está en la lista: la retiró #153, cuya bienvenida
usa `MOTION_FADE_TIMING` y `MOTION_SETTLE_SPRING` (enmienda E1 de #153).

- [X] Enmienda aprobada por humano

## Enmienda #167 — anillos de ping de la bienvenida

Los tres anillos de ping de la bienvenida amplían los bucles de reposo de
§Animación punto 7. Cada anillo es un círculo de borde `border-accent` que
crece de `MOTION_PING_FROM` a `MOTION_PING_TO_SCALE` mientras su opacidad cae
de `MOTION_PING_FROM` a 0, con `MOTION_PING_TIMING`, en bucle infinito y sin
invertir. Los anillos arrancan escalonados un tercio de la duración. Con
reduce motion no se pintan.

Ninguna otra pantalla usa anillos de ping sin una enmienda propia.

- [X] Enmienda aprobada por humano

## Enmienda #168 — título grande en Salud, Nutrición y Perfil

`mobile-tab-headers-canvas` (#168) modifica una decisión que esta spec dejó
aprobada. La spec de origen es `specs/mobile-tab-headers-canvas/`; el detalle
de la enmienda está en su `requirements.md` §R11.

- Spec enmendada: `docs/ui-guidelines.md`
- Qué cambia: `regla N1: título grande en Salud, Nutrición y Perfil; hero solo en Inicio`
- Qué NO cambia: ningún otro requisito de esta spec ni su estado de
  aprobación. Los tests que cubren lo enmendado se reescriben en #168 (lista
  en su `tasks.md`).

- [X] Enmienda #168 aprobada por humano

**Regla N1 (enmienda B4 de #168)**: Salud, Nutrición y Perfil abren con el título grande; Inicio es la única pestaña con PetHeroHeader. Devolver el hero a una de las tres es una enmienda a #168.

## Enmienda #171 — confeti, ping y flotación de la celebración

`Celebration` (`src/components/celebration.tsx`) se mueve como su artboard,
`specs/mobile-welcome-pingo/design-src/celebration.dc.html`:

- **Confeti.** 36 piezas que caen en bucle con `withRepeat` mientras la
  celebración está abierta. La tabla de posición, forma, color, duración y
  retardo vive en `celebration.tsx`; la curva, en
  `MOTION_CONFETTI_FALL_TIMING` de `motion.ts`. Los colores son `bg-accent` y
  los cinco tokens `confetti-*` de `global.css`, que ninguna otra pantalla
  usa. `rounded-xs` (2 px) es una excepción a la escala de radios del
  punto 12 que solo vale para las piezas del confeti. Esas piezas tampoco
  declaran `CONTINUOUS_CORNER`: con 2 px el squircle no se distingue.
- **Ping.** Un anillo `bg-accent` detrás de Pingo crece de 0.55 a 1.5 y se
  apaga de 0.55 a 0 en 2200 ms ease-out, en bucle.
- **Pop y flotación.** Pingo entra con un pop de 600 ms que pasa por 1.08 y
  después flota 10 px arriba y abajo, 1500 ms por tramo, en bucle. La
  insignia hace un pop de 500 ms con 450 ms de retardo.
- **Entrada.** Título, cuerpo, fichas y acciones suben 14 px y aparecen en
  400 ms ease-out, desde los 500 ms y cada 80 ms.
- Solo se animan `transform` y `opacity`, sin `entering`, `exiting` ni
  `LayoutAnimation`. Al desmontar sin reduce motion, `cancelAnimation`
  para los bucles.
- Con reduce motion no se montan el confeti ni el anillo, Pingo no flota y el
  texto aparece sin subir; Pingo y la insignia conservan su fundido.
- El confeti es de tier «raro»: solo lo monta `Celebration`, y
  `Celebration` solo cierra el alta de una mascota o la vinculación de un
  collar.

- [x] Aprobada por humano (fecha: 2026-10-14)

## Enmienda #172 — Las pantallas de cuenta como el canvas

Iniciar sesión, Crear cuenta, Recuperar contraseña y Nueva contraseña siguen
el canvas de #172 (`specs/mobile-account-screens-polish/canvas/`).

**Pingo flota.** Los bucles de reposo de §Animación se amplían a tres
pantallas de cuenta: en Crear cuenta, Recuperar contraseña y Nueva contraseña,
Pingo flota con el componente compartido `PingoFloat`
(`src/components/pingo-float.tsx`). Anima `translateY` hasta
`-MOTION_PINGO_FLOAT_OFFSET_Y` (10) con `MOTION_PINGO_FLOAT_TIMING` (1500 ms
por tramo, `ease-in-out`), en bucle infinito e invertido, y lo cancela al
desmontar. Con reduce motion no arranca. La bienvenida conserva su flotación
de 4 px. Iniciar sesión no flota: Pingo saluda con su burbuja. Ninguna otra
pantalla usa `PingoFloat` sin una enmienda propia.

**El candado lleva labio.** El tile del candado de Recuperar
(`forgot-lock-tile`) es un tile acento con labio: `bg-accent rounded-16`, con
`style={[CONTINUOUS_CORNER, chunkyLip.primary]}`. Es la única excepción a la
regla de que solo los botones llevan labio. El tile del candado lleva
`bg-accent` antes de `rounded-16` para no contar como primario.

**La CTA va al pie.** En las cuatro pantallas, la CTA se ancla al pie con un
espaciador `flex-1` y el contenido deja de centrarse en vertical. Esto revierte
el centrado de `#61 R8` en esas pantallas. El `ScrollView`,
`keyboardShouldPersistTaps` y el comportamiento de teclado no cambian. La rama
sin token de Nueva contraseña sigue centrada.

**Alturas.** La CTA de cuenta mide 56 (`h-14`) y los inputs de cuenta 52
(`h-13`).

**Peso 800.** `font-extrabold` (Inter ExtraBold) se usa solo en la etiqueta de
la CTA de cuenta y en la de `forgot-resend`, que ocupa su sitio.

**Ojo de contraseña.** Todo campo de contraseña de cuenta usa `PasswordInput`
(`src/components/password-input.tsx`), con un botón de 44 que alterna
«Mostrar contraseña» y «Ocultar contraseña».

- [x] Enmienda aprobada por humano

## Enmienda #173 — Perfil fiel al canvas

`mobile-tab-screens-canvas-fidelity` (#173) modifica una decisión que esta spec
dejó aprobada. La spec de origen es `specs/mobile-tab-screens-canvas-fidelity/`;
el detalle de la enmienda está en su `requirements.md` §R14.

- Spec enmendada: `ui-guidelines`
- Qué cambia: `ver «Cambios en la carta»`
- Qué NO cambia: ningún otro requisito de esta spec ni su estado de
  aprobación. Los tests que cubren lo enmendado se reescriben en #173 (lista
  en su `tasks.md`).

- [X] Enmienda #173 aprobada por humano

## Enmienda de fidelidad al canvas (2026-10-13)

Directiva del humano del 2026-10-13: «el diseño final debe de quedar como el artifact» (canvas aprobado, https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j). Rige para toda pantalla que una spec lleve al canvas; la spec de cada pantalla nombra sus valores y los candados que revierte.

- **Título en contenido (D-H).** El título de pantalla va dentro del contenido (eyebrow opcional y título); la cabecera nativa del stack queda con `title: ''` y solo aporta el botón de volver.
- **Iconos reicon (D-I).** Los iconos de la interfaz son componentes de `reicon-react-native` coloreados con un token vía `useThemeColors`; ningún emoji hace de icono. La superficie de categoría acompaña a un icono y a un texto.
- **Medidas del artboard.** Donde la escala no llega al valor del artboard se usa un token del `@theme` nombrado por su valor y listado en la regla 2 (tamaños y tracking) o en la regla 12 (radios); las clases con corchetes (regla 3) y los radios `2xl`, `lg`, `md` y `sm` (regla 12) siguen prohibidos, y las esquinas que no son cápsula siguen llevando `CONTINUOUS_CORNER`.

- [X] Enmienda de fidelidad al canvas aprobada por humano (fecha: 2026-10-15)

## Enmienda #174 — Alertas fieles al canvas

> Enmienda de `ui-guidelines` por `mobile-alerts-canvas-fidelity` (#174, 2026-10-13). Directiva del humano:
> «el diseño final debe de quedar como el artifact».

**Qué cambia**: ver «Cambios en la carta» de #174 R11.2.

Detalle y tests en `specs/mobile-alerts-canvas-fidelity/requirements.md`. Los `it` citados se reescriben en
su sitio con el sufijo `(enmendado por #174 Rn)`.

- [X] Enmienda #174 aprobada por humano

## Enmienda #180 — Detalle de alerta fiel al canvas

> Enmienda de `ui-guidelines` por `mobile-alert-detail-canvas-fidelity` (#180, 2026-10-16). Directiva del humano:
> «el diseño final debe de quedar como el artifact».

**Qué cambia**: §13: el ack del detalle de alerta es primario con labio, h-14 rounded-16 (sale de «Sin labio»); §12: línea nominal de rounded-24 para el mapa y de rounded-16 para los botones del detalle (#180).

Detalle y tests en `specs/mobile-alert-detail-canvas-fidelity/requirements.md`. Los `it` citados se reescriben en
su sitio con el sufijo `(enmendado por #180 Rn)`.

- [ ] Enmienda #180 aprobada por humano

## Enmienda #187 — Tamaños de letra sobre componentes de HeroUI

1. **Un `text-<n>` de la escala propia (`text-11`, `text-13`, `text-15`, `text-17`, `text-22`, `text-26`) no se pasa nunca a un componente de `heroui-native` ni a `Card`.** `tailwind-merge` toma esas clases por color y las descarta si detrás va otra clase de color (`text-muted`, `text-accent-foreground`...), así que el texto cae a `text-base` (16 px) sin avisar. Medido con `heroui-native` 1.0.8.
2. **El texto con uno de esos tamaños se pinta con `Text` de `react-native`, como hijo del componente:** `<Label><Text className="text-13 font-semibold text-muted">...</Text></Label>` y `<Button><Text className="text-17 font-extrabold text-accent-foreground">...</Text></Button>`.
3. Las tallas de Tailwind (`text-xs`, `text-sm`, `text-2xs`...) no se ven afectadas y siguen valiendo sobre `Label.Text` y `Button.Label`.
4. El candado no ve una clase fabricada en ejecución (`text-${n}`): no se construyen tamaños así.
5. El candado es `src/__tests__/heroui-text-size-merge.test.ts` (#187 R1).


## Enmienda #177 — Receta global de botones

> Enmienda de `ui-guidelines` por `mobile-chunky-cta-canvas-fidelity` (#177).
> Directiva del humano: «el diseño final debe de quedar como el artifact».

**Qué cambia**: §12 y §13 fijan cuerpo de 56, radio 16, etiqueta Text 17/800 y
labio externo sólido mediante `useChunkyLip()`; Bienvenida «Ya tengo cuenta»
usa 17/700. El compacto conserva 40 y labio de 3, y el tile adopta el labio de 4.
Chip, ack compacto de fila, Horario, tarjeta de resumen, tonales, destructivos
y reintentos conservan sus recetas. La variante deshabilitada se documenta
para #189; la hoja de eliminar recordatorio conserva el par asimétrico.

Detalle y tests en `specs/mobile-chunky-cta-canvas-fidelity/requirements.md`.
Los candados anteriores se reescriben en su sitio.

- [X] Enmienda #177 aprobada por humano

## Enmienda #176 — Inicio sin mascota como el canvas

> Enmienda de `ui-guidelines` por `mobile-home-empty-canvas-fidelity` (#176).
> Directiva del humano: «el Inicio sin mascota debe de quedar como el artifact».

**Pingo flota en el vacío de Inicio.** El estado sin mascota de Inicio
(variante `hero` de `EmptyState`) usa `PingoFloat`
(`src/components/pingo-float.tsx`) con `MOTION_PINGO_FLOAT_OFFSET_Y` (10 px) y
`MOTION_PINGO_FLOAT_TIMING` (1500 ms por tramo). Con reduce motion no arranca.
Esta enmienda no autoriza `PingoFloat` en ninguna otra pantalla, y la variante
`default` de `EmptyState` conserva su flotación de 4 px (`MOTION_FLOAT_*`).

**Reduce motion en la entrada.** La entrada escalonada de la variante `hero`
(escenario, título, cuerpo y CTA) tampoco arranca con reduce motion: cada
elemento nace en su posición y opacidad finales.

Detalle y tests en `specs/mobile-home-empty-canvas-fidelity/requirements.md`.

- [X] Enmienda #176 aprobada por humano

## Enmienda #186 — Errores de validación de formularios

El componente compartido `src/components/field-error-message.tsx` ofrece
`FieldErrorMessage({ testID, issue })`, con `testID: string` e
`issue?: RuleIssue | null`. La base de testID es la del control: el componente
deriva `<base>-error`, `<base>-message` y `<base>-message-row` (contenedor, texto
traducido y fila con icono). Sin issue no deja nodos. La pantalla conserva el
control y pasa isInvalid al TextField cuando corresponde.

- todo campo de texto que valide en cliente pinta su mensaje con
  `FieldErrorMessage`, debajo del control, y la validación se hace al pulsar
  enviar con reglas puras de `src/utils/`.
- el texto crudo de un error del servidor no se muestra nunca en pantalla:
  un 400 cae en `validation.checkDetails` o en un mensaje de campo traducido.

Cada envío reemplaza los errores de campo; corregir el texto los retira en el
siguiente envío. Los errores de red conservan su aviso de formulario.

- [X] Enmienda #186 aprobada por humano


## Enmienda #191 — Nueva mascota en dos pasos

Nueva mascota conserva una sola ruta con cabecera nativa de título vacío y dos
pasos que se desmontan al cambiar. Atrás desde el segundo vuelve al primero
con todos los valores; la salida después de guardar respeta la celebración.

- **Indicador**: título `text-2xl font-black tracking-title text-foreground` y
  progreso `text-13 font-extrabold text-muted`. Barra `flex-row gap-1.5` con dos
  segmentos `h-1.5 flex-1 rounded-full`; el primero usa `bg-accent` y el segundo
  `bg-lip-gray` hasta llegar al paso 2, cuando ambos usan `bg-accent`.
  Declara `accessibilityRole="progressbar"` y valor de 1 a 2.
- **Foto y burbuja**: fila `flex-row items-center gap-3.5`. La foto es un
  `Pressable` `size-22 items-center justify-center rounded-full border-2
  border-dashed border-accent bg-surface-secondary`, con cámara de 26 y etiqueta
  `text-11 font-extrabold text-accent-strong`; muestra el avatar de 88 solo
  cuando hay foto. La burbuja es un `View` `flex-1 rounded-tile
  bg-surface-secondary px-3 py-2.5`, con `CONTINUOUS_CORNER`, cola `absolute
  -left-1.5 top-5.5 size-3 rotate-45 bg-surface-secondary` y texto `text-13
  font-semibold text-foreground`.
- **Selector segmentado**: `SegmentedControl` compartido para Tipo, Sexo y
  Tamaño. Contenedor `flex-row gap-1 rounded-14 bg-default p-1`; opciones
  `Pressable` `h-9.5 flex-1 items-center justify-center rounded-10`, ambos con
  `CONTINUOUS_CORNER`. El activo añade `bg-surface shadow-sm`; etiqueta
  `text-sm font-extrabold text-accent-strong`, o `text-muted` si está inactivo.
  Declara `TOUCH_SLOP`, rol botón y estado seleccionado. Tipo siempre conserva
  una selección; Sexo y Tamaño permiten deseleccionar.
- **Métricas por fidelidad al canvas**: contenido con `paddingHorizontal: 20`,
  `paddingTop: 12`, `gap: 12` y `paddingBottom: insets.bottom + 24`. Cada campo
  usa `gap-1.5`, etiqueta `text-13 font-extrabold text-foreground` e input
  `h-12 rounded-xl border-2 border-transparent bg-default px-3.5`, esquina
  continua y `text-15 font-semibold text-foreground` en los `TextInput`.
  Los límites siguen siendo 120, 120, 3 y 32. `ScrollView key={step}` devuelve
  el scroll arriba al cambiar de paso. Continuar y Guardar usan la receta
  primaria con labio de la regla 13 al final del contenido.

Desviaciones conscientes del canvas aprobadas en la spec:

- El CTA termina el `ScrollView`; no hay pie fijo con degradado ni dependencia nueva.
- El segmento activo usa `shadow-sm`, el token de sombra disponible.
- La burbuja conserva el interlineado de `text-13`; no se añade un valor arbitrario de 1.4.
- Los pasos cambian sin animación nueva.
- El botón atrás pertenece a la cabecera nativa con `title: ''`.
- `paddingTop: 12` sustituye los 56 del canvas porque la cabecera consume el inset superior.

Los candados de `src/__tests__/add-pet-two-steps.test.ts` verifican esta
ampliación y los inventarios de la pantalla y el selector.

- [X] Enmienda #191 aprobada por humano

## Enmienda #190 — Burbuja de Pingo en Inicio

> Enmienda de `ui-guidelines` por `mobile-home-pingo-phrase` (#190). Directiva del humano: «el diseño final como el artifact».

**Pingo flota en la burbuja de Inicio.** Con mascota seleccionada, la pose de la burbuja de Pingo de Inicio (`home-pingo`) usa `PingoFloat` (`src/components/pingo-float.tsx`) con `MOTION_PINGO_FLOAT_OFFSET_Y` (10 px) y `MOTION_PINGO_FLOAT_TIMING` (1500 ms por tramo). Con reduce motion no arranca. Esta enmienda no autoriza `PingoFloat` en ninguna otra pantalla.

**Escala de radios.** Se añade `--radius-4: 4px` (`rounded-br-4`), la esquina de la «cola» de la burbuja. Un solo uso hoy.

**La burbuja de Pingo.** `View` de superficie con radio 18 px (`rounded-tile`) y 4 px en la esquina inferior derecha, texto `text-15 font-semibold leading-5.25`. La frase sale de claves `home.pingoPhrase*`, en voz B.

- [X] Enmienda #190 aprobada por humano

## Enmienda #188 — Anillos de la vinculación de collar

> Enmienda de `ui-guidelines` por `mobile-pairing-pingo-canvas-fidelity` (#188, 2026-10-19).
> Directiva del humano: «el diseño final como el artifact» y «Píxel exacto».

**Qué cambia**: la vista de vinculación sin dispositivo de `pairing` usa dos anillos con `PingRing` (`src/components/ping-ring.tsx`): escala de 0.55 a 1.5, opacidad de 0.55 a 0, 2400 ms, retardo de 1200 ms en el segundo, borde de 3 px en `accent`, 150 px. Bajo reduce motion, los anillos quedan en reposo (escala 1, opacidad 0.3). Esta enmienda cubre solo esa vista: la regla de #167, «Ninguna otra pantalla usa anillos de ping sin una enmienda propia», sigue vigente para el resto de pantallas.

Detalle y tests en `specs/mobile-pairing-pingo-canvas-fidelity/requirements.md`.

- [X] Enmienda #188 aprobada por humano

## Enmienda #188 (E2) — Geometría de la vinculación de collar

> Enmienda de `ui-guidelines` por `mobile-pairing-pingo-canvas-fidelity` (#188, E2, 2026-10-20).
> Directiva del humano: «aplicalas tal cual como en artboard».

**Qué cambia**: el input del código de activación de `pairing` usa `rounded-14` (14 px, `--radius-14`) con `h-15`, `border-2 border-accent` y `bg-default`, como el artboard «Vincular collar (19)». El avatar de la mascota de la fila superior usa el anillo de 2 px en `accent` con 3 px de separación (`border-2 border-accent p-0.75`), el mismo que el selector de avatares, y no es interactivo. El código se muestra en `font-mono` (`--font-mono: monospace`, familia genérica de Android) con `tracking-code` (0.14 em); no combina con `font-black` porque los pesos del proyecto son familias de fuente. Esta enmienda cubre solo esta pantalla: `rounded-14` sigue nombrado como excepción solo para las pantallas que ya lo citan.

Detalle y tests en `specs/mobile-pairing-pingo-canvas-fidelity/requirements.md` (R15 a R20).

- [X] Enmienda #188 (E2) aprobada por humano

## Enmienda #189 — Zonas seguras y Editor de zona

> Enmienda de `ui-guidelines` por `mobile-geofences-canvas-fidelity` (#189). Directiva del humano: «el diseño final como el artifact». La firma de esta casilla autoriza las ediciones de R16 de `specs/mobile-geofences-canvas-fidelity/requirements.md`; nada más.

- **Métricas por fidelidad al canvas (A11).** Zonas: `paddingHorizontal: 20`, `paddingTop: insets.top + 6`, `gap: 12`, `paddingBottom: insets.bottom + 40`. Hoja del Editor: `paddingHorizontal: 20`, `paddingTop: 12`, `gap: 14`, `paddingBottom: insets.bottom + 36`.
- **Radios fuera de la escala (regla 12).** `rounded-14` (tile de la zona), `rounded-tile` (aviso de límite), `rounded-t-hero` (hoja del Editor) y `rounded-16` (botones). Las líneas de #175 a #180 no se tocan.
- **Botón (regla 13).** La receta deshabilitada (`h-14 rounded-16 bg-default`, etiqueta `text-17 font-extrabold text-muted`, sin labio) la aplican «Añadir zona» en el límite y «Guardar» con el nombre vacío. «Eliminar» del Editor sale de «Sin labio»: es secundario neutro con etiqueta `text-base font-extrabold text-danger`, excepción a la etiqueta `text-17 … text-foreground` del neutro. La papelera de la fila de zona es una excepción solo-icono (`size-11 rounded-xl bg-danger-soft`).
- **Paleta categórica.** `zoneCategory` (orden `green, blue, amber, violet, rose`) es el único reparto categoría → ranura de las zonas; el color es de la posición en la lista, no de la zona.

- [X] Enmienda #189 aprobada por humano
