---
feature: "mobile-profile-photo-hero-canvas"
status: approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-profile-photo-hero-canvas]]

Perfil reutiliza el hero a sangre de Inicio (`PetHeroHeader variant="bleed"`)
en vez de su tarjeta hero propia. Todo lo demás es receta de clases sobre
piezas que ya existen o que trae #197. Un solo cambio en un componente
compartido: el prop aditivo `caption` de `PetHeroHeader` (D1).

## Premisas contrastadas

Medidas contra el árbol en `71ff81a1`, no tomadas del explore:

- `PetHeroHeader` ya tiene `variant: 'bleed' | 'card'`, slot superior
  (`pet-hero-slot` en `insets.top + 12`, `inset-x-4`), scrim superior solo con
  `children`, degradado inferior, skeleton con `pet` nulo y
  `PET_HERO_MEDIA_HEIGHT = 430` (= `height: 430px` del artboard).
- `PetSwitcher` ya tiene `variant="glass"` (seleccionada 44 con borde de 2 en
  `accent` y fondo `background`; no seleccionadas en `GlassCircle`), igual que
  los avatares del artboard.
- `BubblePop` existe en `src/screens/home/bubble-pop.tsx` con
  `{ testID, className, style, children }` y retraso fijo de 450 ms.
- `HomeEntrance` (`src/screens/home/home-entrance.tsx`) ya envuelve info,
  accesos y cuenta en Perfil con índices 1, 2 y 3.
- Tokens presentes hoy: `--radius-card: 20px`, `--radius-14`, `--text-15`,
  `--tracking-title: -0.02em`, `--color-accent-foreground: #FFFFFF` (claro y
  oscuro), `--color-glass-surface-strong` (`rgba(255,255,255,0.86)` en claro),
  `--color-category-amber: #FFF7ED` y `--color-category-rose: #FFF0F3` (los
  `--amber` y `--rose` del artboard).
- Ausentes hoy y traídos por #197: `--tracking-display`, `--leading-note`,
  `ToggleSwitch`, `useChunkyLip().primary` con `0 4px 0 var(--lip)` y
  `--color-danger: #D92D20` en claro (hoy `#EF4444`). Firma de `ToggleSwitch`
  en `feature/197-mobile-canvas-foundations` (`src/components/toggle-switch.tsx`):
  `ToggleSwitch({ testID, isSelected, onSelectedChange, isDisabled, accessibilityLabel, hitSlop, style })`,
  con `testID: string`, `isSelected: boolean`,
  `onSelectedChange: (isSelected: boolean) => void` y el resto tomado con
  `Pick<ComponentProps<typeof Switch>, …>` del `Switch` de HeroUI; envuelve
  ese `Switch` con `testID` en la raíz y pinta el pulgar con testID
  `${testID}-thumb`.
- `useChunkyLip` vive en `src/theme/chunky-lip.ts`, que no es uno de los
  cuatro cimientos que `#197 R20` vigila (`toggle-switch`, `screen-header`,
  `shadows`, `rise-in`). El único cimiento que #196 monta es `ToggleSwitch` (R7).
- `src/screens/home/bubble-pop.tsx` importa `Animated` por defecto de
  `react-native-reanimated` y pinta `<Animated.View>`; `PetHeroHeader` usa
  `Animated.createAnimatedComponent(View)`. `T` no dobla reanimated hoy.
- Los cinco literales de copy del artboard coinciden con `src/i18n/catalog.ts`.
- `PetSwitcher` está doblado en `src/screens/profile/index.test.tsx`
  (`mockPetSwitcher`), así que la variante `glass` no se renderiza en esos tests.

## Supuestos

Lo que los tests no ven; se cierra en el smoke de requirements.md §Cierre del humano.

- **S1** El vidrio sin `backdrop-filter` (blanco al 86 %) basta para leer la
  píldora y los avatares sobre cualquier foto.
- **S2** El labio de `useChunkyLip().primary` (sombra dura por `boxShadow`)
  se pinta en Android bajo un círculo con `border-3`.
- **S3** `leading-note` (1.45) resuelto por uniwind con `text-sm` da unos
  20.3 px de interlineado en el aviso.
- **S4** El título en `text-accent-foreground` se lee sobre la foto con el
  scrim superior que `PetHeroHeader` pinta al recibir `children`.
- **S5** `BubblePop` y `HomeEntrance` respetan «Quitar animaciones» de Android
  (ya lo hacen en Inicio).
- **S6** El dev build Android tiene `ToggleSwitch` de #197 ya probado por su
  propio smoke.

## Contraste con el artboard

| Elemento | Artboard | Producción |
|---|---|---|
| Raíz | `padding: 0 20px 120px`, `gap: 14px` | `contentContainerStyle={{ gap: 14, paddingBottom: insets.bottom + 96 }}` + `profile-content` `gap-3.5 px-5` |
| Hero | `margin: 0 -20px; height: 430px`, `fade 500ms` | `PetHeroHeader variant="bleed"` (430, `MOTION_HERO_FADE_MS`) |
| Fila superior | `top: 60px; left/right: 20px`, `rise 400ms` | `pet-hero-slot` (`insets.top + 12`, `inset-x-4`) + `px-1` |
| Título | 30/900/`-0.02em`/`#FFFFFF` | `text-3xl font-black tracking-title text-accent-foreground` |
| Píldora | 44, `padding: 0 16px`, 999, `--glass`, gap 6, 800 14px, svg 16/2.6 | `h-11 … gap-1.5 rounded-full bg-glass-surface-strong px-4`, `text-sm font-extrabold`, `Plus` 16/2.6 |
| Avatares | `top: 116px`, gap 8, seleccionado 44 con borde de 2 | `PetSwitcher variant="glass"` bajo la fila, `gap-3` (60 + 44 + 12 = 116) |
| Cámara | 44, `right: 20px; bottom: 96px`, borde 3 `--bg`, `--accent`, labio, `pop … 300ms`, svg 18/2.4 | `BubblePop` `absolute bottom-24 right-5` + `size-11 … border-3 border-background bg-accent` + `chunkyLip.primary`, `Camera` 18/2.4 |
| Pie | `bottom: 6px`, gap 10, `rise … 80ms` | `pet-hero-caption` (`bottom-1.5`, retraso 80) + `caption` `gap-2.5 px-1` |
| Nombre | 30/34/900/`-0.5px` | `text-3xl font-black leading-8.5 tracking-display text-foreground` |
| Chips | `padding: 5px 10px`, 12/800, gap 6, wrap | sin cambios + `flex-row flex-wrap gap-1.5` |
| Accesos | svg 22/2.2 | `size={22}` + `strokeWidth={2.2}` |
| Tema | checkbox 20 px | `ToggleSwitch` (V5) |
| Cerrar sesión | 52, radio 14, `--rose`, `--danger`, 800 15px | `h-13 rounded-14 bg-category-rose` + `Text` `text-15 font-extrabold text-danger` |
| Aviso | radio 20, `--amber`, padding 14, gap 12; texto 14/1.45; botón 44, `0 18px`, radio 14, `--accent`, labio, 800 14px | `rounded-card p-3.5 bg-category-amber gap-3`; `text-sm leading-note`; `h-11 rounded-14 px-4.5` + `chunkyLip.primary` + `text-sm font-extrabold` |

## Dependencias y precondiciones

- **#197 mergeada en `dev`** antes del handoff (tokens, `ToggleSwitch`,
  `useChunkyLip().primary`, `--color-danger` claro). El leader re-mide las
  anclas `(#197: …)` de requirements.md §Base medida tras ese merge.
- **Enmienda #196 aprobada** (casilla de §Aprobación) antes de R11 y de
  montar `PetHeroHeader` en Perfil (bloque R1+R4).
- #198 se mergea antes: si toca `pet-hero-header.tsx`, el prop `caption` se
  añade sobre su versión (D1). `RiseIn` lo crea #197 R24 y Perfil no lo
  consume (D13); #196 no añade exports a `src/theme/motion.ts`.
- **Regla uniforme de `#197 R20`** (toda la ola 2): la primera feature que
  monta un cimiento o toca `src/app/_layout.tsx` borra entero
  `describe('#197 R20: cimientos sin cablear')` de
  `src/__tests__/canvas-foundations.test.ts`, con sus dos `it`, sin sufijo y
  sin sustituto. En #196 eso pasa en el rojo de R7 (K35).
- Ninguna dependencia npm nueva, ningún coste, nada de AWS.

## Decisiones técnicas

Las decisiones con defecto D1–D15 están en requirements.md. Detalle técnico:

- **Bloques de commits** (D14): R1+R4 y R2+R5. Entre el verde de R1+R4 y el
  de R2+R5 la fila de título sigue como primer hijo de `profile-content` en
  las dos ramas (el slot del hero aún no tiene `children`), así que `#99 R3`
  (K9 paso 1) y `#168 R1` siguen verdes.

- **Una sola fila de título**: se define una vez como elemento JSX y se pinta
  en `profile-hero-top` (con hero) o al principio de `profile-content` (sin
  hero). Solo cambian dos className por ternario sobre `showHero`; así el
  literal claro del título (`TAB_TITLE_168`, tras #197 con `tracking-title`)
  sigue apareciendo una vez en el fichero.
- `showHero = pets pendiente || (pets ok && pets.length > 0)`.
- `caption` en `PetHeroHeader`: dentro de `pet-hero-caption`,
  `pet ? (caption ?? <lo de hoy>) : <skeletons de hoy>`. Sin tocar slot,
  scrim, degradado ni animaciones.
- La cámara vive en `profile-hero`, no en el slot ni en el pie, para quedar a
  `bottom: 96` del borde inferior de la foto como en el artboard.
- **Cruce de clases nuevas con las guardas**: ninguna lleva `[…]` ni hex
  (`HEX_LITERAL` de `design-drift` y `tab-headers-canvas` › `veta hex`); ninguna
  usa `StyleSheet.create` (`#173 R15`); `text-accent-foreground` y
  `text-accent-strong` no son `text-accent` suelto (`tab-headers-canvas`);
  `bg-category-amber` y `bg-category-rose` se escriben solo vía
  `CATEGORY_SLOTS.*.surface` (guarda de `category-palette`); `text-15` va en un
  `Text` de RN y nunca en `Button.Label` (enmienda #187: `twMerge` expulsa
  `text-13/15/17` en HeroUI); `Button.Label` lleva `text-sm`, que `twMerge`
  no confunde con color; `text-accent-strong` sigue con tres usos en Perfil
  (`legibility` › `#61 R4` espera `1 + 1 - 1 + 1 + 1` = 3; la fila de título
  única los mantiene). Tokens usados: todos existen hoy o los trae #197
  (`tracking-display`, `leading-note`).
- `style` nuevo en `P`: `chunkyLip.primary` (dos veces) y
  `{ paddingTop: insets.top + 12 }` en `profile-content` sin hero; ninguno es
  `StyleSheet.create` ni valor arbitrario.
- **`#173 R15` lee el fuente entero de `P`**, comentarios incluidos, y veta
  `/#[0-9a-fA-F]{3,8}\b/` sin la exención `#NNN R<n>` que sí tienen
  `design-drift`, `tab-headers-canvas` › `veta hex` y `alerts-canvas-fidelity`.
  Por eso `P` no lleva comentarios `#196 R<n>` ni ningún otro `#NNN` (R1.5).
  `H` sí puede llevar `// #196 R3`: `home-photo-hero-canvas` › `#195 R19` quita
  los comentarios antes de medir y `design-drift` exime `#NNN R<n>`.
- **Doble de reanimated en los tests de Perfil** (D15, K38, K39): las
  funciones del doble de `pet-hero-header.test.tsx` (`useReducedMotion`,
  `withTiming` identidad, `withDelay`, `withSequence` con el último paso,
  `withRepeat`, `cancelAnimation`) con la forma de módulo del de
  `src/screens/home/index.test.tsx` (`...actual` y `__esModule: true`, sin
  sobrescribir `default`). El doble de `pet-hero-header.test.tsx` no lleva
  `__esModule` y sobrescribe `default`: vale para `H` (usa
  `createAnimatedComponent`) pero no para `BubblePop`, cuyo `Animated.View`
  sale del import por defecto; el de Inicio ya monta `PetHeroHeader` y
  `BubblePop` juntos con esa forma.
- **Marcador de la carta en `hero-header-amendments`** (K41, auditoría F5):
  de las dos opciones (reescribir la fila 4 de `AMENDED_DOCS_168` o conservar
  la prosa B4 y añadir la N1 detrás) se elige **reescribir**: R11.2 sustituye
  entera la línea B4, así que conservarla contradiría la carta. El `marker`
  pasa a ser el texto exacto de §Texto de la Enmienda #196; `file`, `feature`
  y `change` no cambian. Va en el verde de R11, el mismo commit que edita la
  carta.
- **Piso de `Card` en `heroui-text-size-merge`** (K40, auditoría F4): hoy 41
  medido y piso 41. Perfil pierde dos `<Card>` (la tarjeta hero en R1+R4 y el
  aviso en R2+R5): el piso baja a 39 en el rojo de R1+R4, con el comentario
  `// #196 R1, R5: 41 - 2 (la tarjeta hero y el aviso de Perfil dejan de ser Card)`.

## Archivos afectados

- **Presentación** (`mobile-pet-tracker/src/`):
  - `screens/profile/index.tsx`: R1, R2 y R4–R9 (sin comentarios `#NNN`, R1.5).
  - `components/pet-hero-header.tsx`: prop `caption` (R3).
- **Tests**:
  - `screens/profile/index.test.tsx`: `it` nuevos de R1, R2 y R4–R9, K1,
    K2, K4–K24 y las cabeceras K36–K38.
  - `components/__tests__/pet-hero-header.test.tsx`: R3.
  - `__tests__/profile-photo-hero-canvas.test.ts` (nuevo): R10.
  - `__tests__/tab-headers-canvas.test.ts`: R11 y K25.
  - `__tests__/profile-canvas-fidelity.test.ts`: K26–K29.
  - `__tests__/chunky-cta-canvas-fidelity.test.ts`: K30–K33.
  - `__tests__/alerts-canvas-fidelity.test.ts`: K34.
  - `__tests__/canvas-foundations.test.ts` (#197): K35, se borra el
    `describe('#197 R20: cimientos sin cablear')` entero.
  - `app/(tabs)/__tests__/screens.test.tsx`: cabecera K39.
  - `__tests__/heroui-text-size-merge.test.ts`: K40.
  - `__tests__/hero-header-amendments.test.ts`: K41.
- **Docs**: `docs/ui-guidelines.md`, regla N1 (R11), solo con la casilla de la
  enmienda marcada.
- No se tocan dominio, aplicación, infraestructura, `src/app/_layout.tsx`,
  `src/i18n/catalog.ts` ni `src/__tests__/ui-copy-table.ts`.

## Alternativas descartadas

- **Copiar el hero dentro de Perfil**: duplicaría foto, scrim, degradado y
  animaciones; `PetHeroHeader` ya hace todo.
- **Pasar nombre y chips como `children`**: el slot está arriba; el pie del
  artboard pide el hueco de `pet-hero-caption`.
- **Ampliar `BubblePop` con un `delayMs`**: tocaría un fichero de Inicio (#198).
- **`RiseIn` de #197 R24**: D13.
- **Doblar `PetHeroHeader` o `BubblePop` en `T`**: los `it` de R1, R4 y K13,
  K14 leen el componente real (`pet-hero-media`, `pet-hero-caption`); se
  dobla solo reanimated (D15).
- **Conservar la prosa B4 en la carta y añadir la N1 de #196 detrás** (F5):
  dos reglas N1 contradictorias en el mismo documento.
- **`ScreenHeader` de #197**: el título va sobre la foto, no en una cabecera.
- **Mantener `Card` en el aviso**: el artboard no tiene borde ni sombra, y la
  receta de `Card` los trae.

## Riesgos

- **Choque con #198** en `components/pet-hero-header.tsx` (D1). Mitigación:
  cambio aditivo y candado propio en `pet-hero-header.test.tsx`.
- **Dependencia de #197**: R5, R6, R7, R10 (filas 3, 11, 14, 19, 21) y K28,
  K30–K35 dan rojo sin #197. No se hace handoff antes de su merge.
- **K35 ya aplicado por otra feature**: si al llegar al rojo de R7 el
  `describe('#197 R20: cimientos sin cablear')` no existe (otra feature de la
  ola 2 lo borró al montar su cimiento), K35 queda sin efecto y se anota en
  el informe; no es parada.
- **Doble de reanimated en `T`** (K38): pasa a identidad todas las
  animaciones de `T`. Si un `it` previo de `T` se pone rojo por eso, es
  parada (no está inventariado).
- **Rendimiento**: una foto de 430 más en Perfil. `PetAvatar` ya cachea por
  `cacheKey`; se ve en el smoke.

## Texto de la Enmienda #196

En `docs/ui-guidelines.md`, la línea que hoy empieza por
`**Regla N1 (enmienda B4 de #168)**` se sustituye entera por:

> **Regla N1 (enmienda #196)**: Inicio y Perfil abren con PetHeroHeader a sangre; Salud y Nutrición abren con el título grande. En Perfil el título «Perfil» y «Añadir mascota» van en el slot superior del hero y el nombre con los chips en su pie. Devolver el hero a Salud o a Nutrición, o quitárselo a Inicio o a Perfil, es una enmienda a #196.

Se aplica en el commit verde de R11, solo con la casilla
`Enmienda #196 aprobada por humano` marcada.
