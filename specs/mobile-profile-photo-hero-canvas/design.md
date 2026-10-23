---
feature: "mobile-profile-photo-hero-canvas"
status: spec_ready     # draft | spec_ready | approved
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
  `--color-danger: #D92D20` en claro (hoy `#EF4444`).
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
  montar `PetHeroHeader` en Perfil (R1).
- #198 se mergea antes: si toca `pet-hero-header.tsx`, el prop `caption` se
  añade sobre su versión (D1). #199 crea `RiseIn`, que Perfil no consume (D13).
- Ninguna dependencia npm nueva, ningún coste, nada de AWS.

## Decisiones técnicas

Las decisiones con defecto D1–D13 están en requirements.md. Detalle técnico:

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
  no confunde con color; `text-accent-strong` sigue con dos usos en Perfil
  (`legibility` › `#61 R4`). Tokens usados: todos existen hoy o los trae #197
  (`tracking-display`, `leading-note`).
- `style` nuevo en `P`: `chunkyLip.primary` (dos veces) y
  `{ paddingTop: insets.top + 12 }` en `profile-content` sin hero. `#173 R15`
  solo mira `className`, así que no le afecta.

## Archivos afectados

- **Presentación** (`mobile-pet-tracker/src/`):
  - `screens/profile/index.tsx`: R1–R9.
  - `components/pet-hero-header.tsx`: prop `caption` (R3).
- **Tests**:
  - `screens/profile/index.test.tsx`: `it` nuevos de R1–R9 y K1–K24.
  - `components/__tests__/pet-hero-header.test.tsx`: R3.
  - `__tests__/profile-photo-hero-canvas.test.ts` (nuevo): R10.
  - `__tests__/tab-headers-canvas.test.ts`: R11 y K25.
  - `__tests__/profile-canvas-fidelity.test.ts`: K26–K29.
  - `__tests__/chunky-cta-canvas-fidelity.test.ts`: K30–K33.
  - `__tests__/alerts-canvas-fidelity.test.ts`: K34.
  - el fichero de #197 con `#197 R20: nadie monta todavía los cimientos`: K35.
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
- **`RiseIn` de #199**: D13.
- **`ScreenHeader` de #197**: el título va sobre la foto, no en una cabecera.
- **Mantener `Card` en el aviso**: el artboard no tiene borde ni sombra, y la
  receta de `Card` los trae.

## Riesgos

- **Choque con #198** en `components/pet-hero-header.tsx` (D1). Mitigación:
  cambio aditivo y candado propio en `pet-hero-header.test.tsx`.
- **Dependencia de #197**: R5, R6, R7, R10 (filas 3, 11, 14, 19, 21) y K28,
  K30–K35 dan rojo sin #197. No se hace handoff antes de su merge.
- **K35** depende de cómo nombre #197 el fichero de su candado; si otra
  feature de la ola 2 ya montó `ToggleSwitch`, la lista se suma.
- **Rendimiento**: una foto de 430 más en Perfil. `PetAvatar` ya cachea por
  `cacheKey`; se ve en el smoke.

## Texto de la Enmienda #196

En `docs/ui-guidelines.md`, la línea que hoy empieza por
`**Regla N1 (enmienda B4 de #168)**` se sustituye entera por:

> **Regla N1 (enmienda #196)**: Inicio y Perfil abren con PetHeroHeader a sangre; Salud y Nutrición abren con el título grande. En Perfil el título «Perfil» y «Añadir mascota» van en el slot superior del hero y el nombre con los chips en su pie. Devolver el hero a Salud o a Nutrición, o quitárselo a Inicio o a Perfil, es una enmienda a #196.

Se aplica en el commit verde de R11, solo con la casilla
`Enmienda #196 aprobada por humano` marcada.
