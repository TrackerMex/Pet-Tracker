---
feature: "mobile-canvas-home"
status: approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-canvas-home]]

## Premisas contrastadas

Medidas en el árbol de 71ff81a1 (anclas en requirements.md §Base medida). Premisas del explore (C13, C14, filas I) re-medidas, no copiadas:

- La Home ya usa `Card`, `CATEGORY_SLOTS`, `HomeEntrance`, `CollarBatteryBar`, `WeeklyActivityChart` y `EmptyState variant="hero"`:
  la feature re-viste, no crea pantallas ni componentes.
- `useShadows`, `useChunkyLip().tile*`, `--tracking-section` y `MOTION_RISE_*` **no existen** en 71ff81a1: llegan con #197.
- Tokens que usan las clases nuevas, comprobados en `src/theme/global.css`: `--text-11`, `--text-13`, `--text-15`, `--text-22`,
  `--text-26`, `--radius-16`, `--radius-card`, `--color-tab-pill`. `bg-background`, `border-background`, `bg-danger` y
  `danger-foreground` vienen del tema de heroui-native y ya se usan en la app (`danger-foreground` 9 veces en `src/**/*.tsx`).
- `reicon-react-native` exporta `Alert` y `Refresh` (comprobado en su `index.d.ts`).
- `EmptyState` no llama a `t`: el copy entra por props, así que `SCREEN_FILES` no cambia.
- Instrucciones en el canvas: ninguna. Las únicas coincidencias de la búsqueda son el copy «Ver todos» (requirements §Contexto).

## Supuestos

Lo que los tests no ven y se cierra en el smoke del humano (requirements §Cierre del humano):

- `boxShadow` de React Native (nueva arquitectura) pinta la sombra doble de `useShadows().card` y el `inset` de los labios en
  Android; jest solo ve el objeto de estilo.
- `bg-background` dentro de una `Card` `bg-default` se distingue a simple vista en claro y en oscuro.
- `withDelay` con 120..420 ms no se percibe lento en un dispositivo real; con «Quitar animaciones» no hay movimiento (#197 R12).
- El esqueleto de R14 mide lo mismo que el contenido real en un teléfono de 360 dp de ancho (sin salto al cargar).
- El icono `Alert` de reicon se lee como «!» dentro del badge de 44.

## Contraste con los artboards

Tabla de R17. Cada fila: el artboard congelado en `specs/mobile-canvas-home/canvas/` **contiene** el literal del canvas y el fichero
de producción **contiene** el literal de producción. Rutas de producción relativas a `mobile-pet-tracker/`. Los literales del canvas
están comprobados con `grep -cF` (≥ 1) sobre la copia congelada; los de producción existen tras R1–R16.

| Artboard | Literal del canvas | Fichero | Literal de producción | R |
|---|---|---|---|---|
| Inicio | `border-radius: 20px; background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow); padding: 14px 8px` | `src/screens/home/index.tsx` | `gap-3 px-2 py-3.5 shadow-none` | R1 |
| Inicio | `padding: 0 8px; font-size: 16px; font-weight: 800` | `src/screens/home/index.tsx` | `px-2 text-base font-extrabold text-foreground` | R1 |
| Inicio | `width: 36px; height: 36px; border-radius: 12px` | `src/screens/home/index.tsx` | `size-9 items-center justify-center rounded-xl ${CATEGORY_SLOTS[` | R2 |
| Inicio | `font-size: 11px; font-weight: 600; color: var(--muted)` | `src/screens/home/index.tsx` | `text-11 font-semibold text-muted` | R2 |
| Inicio | `border-radius: 20px; background: var(--default); padding: 12px 14px` | `src/screens/home/index.tsx` | `flex-row items-center gap-3 border-0 bg-default px-3.5 py-3 shadow-none` | R3 |
| Inicio | `width: 40px; height: 40px; border-radius: 50%; background: var(--pill)` | `src/screens/home/index.tsx` | `size-10 items-center justify-center rounded-full bg-tab-pill` | R3 |
| Inicio | `font-size: 15px; font-weight: 800; color: var(--accent-strong)` | `src/screens/home/index.tsx` | `text-15 font-extrabold` | R3 |
| Inicio | `height: 8px; border-radius: 999px; background: var(--bg)` | `src/screens/home/collar-battery-bar.tsx` | `h-2 w-full overflow-hidden rounded-full bg-background` | R4 |
| Inicio | `letter-spacing: 1.5px; text-transform: uppercase` | `src/screens/home/index.tsx` | `text-xs font-bold uppercase tracking-section text-muted` | R5 |
| Inicio | `height: 92px; border-radius: 20px` | `src/screens/home/index.tsx` | `h-23 flex-1 items-center justify-center gap-2 rounded-card ${CATEGORY_SLOTS[` | R5 |
| Inicio | `inset 0 -4px 0 rgba(117,73,247,0.18)` | `src/screens/home/index.tsx` | `'tileViolet'` | R5 |
| Inicio | `inset 0 -4px 0 rgba(165,94,7,0.16)` | `src/screens/home/index.tsx` | `'tileAmber'` | R5 |
| Inicio | `inset 0 -4px 0 rgba(7,104,224,0.16)` | `src/screens/home/index.tsx` | `'tileBlue'` | R5 |
| Inicio | `animation: rise 400ms ease-out 120ms both` | `src/screens/home/index.tsx` | `<HomeEntrance index={2}` | R6 |
| Inicio | `animation: rise 400ms ease-out 180ms both` | `src/screens/home/index.tsx` | `<HomeEntrance index={3}` | R6 |
| Inicio | `animation: rise 400ms ease-out 240ms both` | `src/screens/home/index.tsx` | `<HomeEntrance index={4}` | R6 |
| Inicio | `animation: rise 400ms ease-out 300ms both` | `src/screens/home/index.tsx` | `<HomeEntrance index={5}` | R6 |
| Inicio | `animation: rise 400ms ease-out 360ms both` | `src/screens/home/index.tsx` | `<HomeEntrance index={6}` | R6 |
| Inicio | `animation: rise 400ms ease-out 420ms both` | `src/screens/home/index.tsx` | `<HomeEntrance index={7}` | R6 |
| Inicio | `box-shadow: var(--shadow); padding: 14px 16px` | `src/screens/home/weekly-activity-chart.tsx` | `gap-2 px-4 py-3.5 shadow-none` | R7 |
| Inicio | `font-size: 11px; color: var(--muted)">últimos 7 días` | `src/screens/home/weekly-activity-chart.tsx` | `text-11 text-muted` | R7 |
| Inicio | `border-radius: 6px` | `src/screens/home/weekly-activity-chart.tsx` | `Math.min(6, height / 2)` | R9 |
| Inicio | `opacity: .35` | `src/screens/home/weekly-activity-chart.tsx` | `0.35` | R9 |
| Inicio | `padding: 12px; border-radius: 16px; border: 1px solid var(--border); background: var(--default)` | `src/screens/home/weekly-activity-chart.tsx` | `gap-3 rounded-16 border border-border bg-default p-3` | R9 |
| Inicio | `font-size: 15px; font-weight: 800">Miércoles` | `src/screens/home/weekly-activity-chart.tsx` | `text-15 font-extrabold text-foreground` | R9 |
| Inicio | `box-shadow: var(--shadow); padding: 12px 14px` | `src/screens/home/index.tsx` | `flex-row items-center gap-3 px-3.5 py-3 shadow-none` | R10 |
| Inicio | `font-size: 12px; font-weight: 700; color: var(--accent-strong)">Ver todos` | `src/screens/home/index.tsx` | `text-xs font-bold text-accent-strong` | R10 |
| Inicio | `border-radius: 20px; background: var(--default); padding: 14px 16px` | `src/screens/home/index.tsx` | `gap-2 border-0 bg-default px-4 py-3.5 shadow-none` | R11 |
| Inicio | `font-size: 15px; font-weight: 700; color: var(--accent-strong)">Ver en el mapa` | `src/screens/home/index.tsx` | `text-15 font-bold text-accent-strong` | R11 |
| Inicio | `font-size: 13px; color: var(--muted)">Última señal` | `src/screens/home/index.tsx` | `text-13 font-normal text-muted` | R11 |
| InicioActividad | `margin-top: -751px` | `src/screens/home/weekly-activity-chart.tsx` | `gap-2 px-4 py-3.5 shadow-none` | R7 |
| InicioRecordatorios | `margin-top: -1064px` | `src/screens/home/index.tsx` | `flex-row items-center gap-3 px-3.5 py-3 shadow-none` | R10 |
| InicioSinCollar | `align-self: center; padding-left: 12px; font-size: 14px; line-height: 20px; color: var(--muted)` | `src/screens/home/index.tsx` | `flex-3 self-center pl-3 text-sm leading-5 font-normal text-muted` | R13 |
| InicioSinCollar | `font-size: 16px; font-weight: 800">Sin collar` | `src/screens/home/index.tsx` | `text-base font-extrabold text-foreground` | R13 |
| InicioSinCollar | `font-size: 14px; color: var(--muted)">Sin collar — solo salud` | `src/screens/home/index.tsx` | `text-sm font-normal text-muted` | R13 |
| InicioSinCollar | `height: 44px; border-radius: 12px; background: var(--pill)` | `src/screens/home/index.tsx` | `h-11 items-center justify-center rounded-xl bg-tab-pill` | R13 |
| InicioCarga | `height: 64px` | `src/screens/home/index.tsx` | `h-16 w-full rounded-card` | R14 |
| InicioCarga | `height: 92px; border-radius: 20px` | `src/screens/home/index.tsx` | `h-23 flex-1 rounded-card` | R14 |
| InicioCarga | `height: 408px` | `src/screens/home/index.tsx` | `h-102 w-full rounded-card` | R14 |
| InicioError | `font-size: 26px; font-weight: 900; letter-spacing: -0.02em` | `src/screens/home/index.tsx` | `text-26 font-black tracking-title text-foreground` | R15 |
| InicioError | `background: var(--rose)` | `src/components/empty-state.tsx` | `CATEGORY_SLOTS.rose.surface` | R15 |
| InicioError | `top: 26px; right: 42px; width: 44px; height: 44px` | `src/components/empty-state.tsx` | `absolute right-10.5 top-6.5 size-11` | R15 |
| InicioError | `font-size: 22px; font-weight: 900; letter-spacing: -0.02em` | `src/components/empty-state.tsx` | `text-center text-22 font-black tracking-title text-foreground` | R15 |
| InicioError | `No pude cargar a tus mascotas` | `src/i18n/catalog.ts` | `No pude cargar a tus mascotas` | R15 |
| InicioError | `Revisa tu conexión y vuelve a intentarlo.` | `src/i18n/catalog.ts` | `Revisa tu conexión y vuelve a intentarlo.` | R15 |
| InicioVacio | `Aún no tienes mascotas` | `src/i18n/catalog.ts` | `Aún no tienes mascotas` | R16 |

El test escribe las dos columnas de literales a mano; no importa nada de producción (anti-tautología).

## Dependencias y precondiciones

- **#197 `mobile-canvas-foundations` mergeada en `dev`** y `dev` mergeado en esta branch antes del handoff: `test -e
  mobile-pet-tracker/src/theme/shadows.ts && test -e mobile-pet-tracker/src/__tests__/canvas-foundations.test.ts`. Tras ese merge el
  leader re-mide las anclas marcadas `(#197: …)` en requirements §Base medida y, si alguna cifra de §Candados cambió, enmienda
  solo esa fila (memoria «spec aprobada caduca al mergear su dependencia»).
- Ninguna dependencia nueva (`expo-linear-gradient` vetado), ningún coste, nada de AWS.

## Decisiones técnicas

Las decisiones con defecto D1–D14 están en requirements §Decisiones; aquí, cómo se aplican y su cruce con las guardas:

- **Sombras**: `const shadows = useShadows();` en `HomeScreen` y en `WeeklyActivityChart`; `style={shadows.card}` sobre `Card` con
  `shadow-none` en `className` (D2). `components/card.tsx` no cambia.
- **Labios**: `const chunkyLip = useChunkyLip();` en `HomeScreen`; `QUICK_ACTIONS` gana `lip: 'tileViolet' | 'tileAmber' | 'tileBlue'`.
- **Mosaicos del resumen**: constante `SUMMARY_TILES` (métrica → hueco) junto a `QUICK_ACTIONS`; tintas con un segundo
  `useThemeColors` como `quickActionInks`. Las clases de color salen solo de `CATEGORY_SLOTS` (#64 R9).
- **Error**: `EmptyState` gana `tone?: 'default' | 'danger'`; la rama `danger` añade `danger` y `danger-foreground` al
  `useThemeColors` que ya existe (orden: los nuevos al final), usa `CATEGORY_SLOTS.rose.surface` para el disco, `Alert` en el badge
  y `Refresh` en `-action-icon`. La rama `default` no cambia ni un nodo.
- **Cruce con las guardas de la carta** (cada clase nueva):
  - `HEX_LITERAL` de design-drift: ninguna clase ni estilo nuevo lleva hex; los colores son tokens o `CATEGORY_SLOTS`.
  - Clases arbitrarias `[…]`: ninguna. `h-23`, `h-102`, `w-13`, `w-27.5`, `w-30`, `right-10.5`, `top-6.5`, `size-11`,
    `border-3`, `py-3.5`, `px-3.5` son de la escala numérica de uniwind.
  - `StyleSheet.create`: cero en ficheros tocados; los estilos van en `style={…}` con objetos de `useShadows`/`useChunkyLip`.
  - `twMerge` y `text-13/15/17` en HeroUI o `Card`: ningún `text-<n>` de la escala propia va a un componente de heroui-native ni a
    `Card`; todos van a `Text` de `react-native` (las `Card` llevan solo layout, fondo, borde y sombra).
  - Radios vetados (`rounded-2xl/lg/md/sm`, #62 R4): no se usan; solo `rounded-xl`, `rounded-16`, `rounded-card`, `rounded-full`.
  - `legibility-classnames` (#61 R4) y `consistency-classnames` (#98 R10, #64 R9): sus recuentos se mueven con delta escrito (K26,
    K27). `design-drift` veta `uppercase|tracking-widest` en otras pantallas, no en la Home; `tracking-widest` desaparece de
    `index.tsx`.
  - Comentarios: ningún `#198` suelto en código de producción (`HEX_LITERAL` solo exime `#NNN R<n>`): si hace falta citar, `#198 R<n>`.

## Archivos afectados

Producción (`mobile-pet-tracker/`):
- `src/screens/home/index.tsx` — R1–R6, R10, R11, R13–R16.
- `src/screens/home/collar-battery-bar.tsx` — R4.
- `src/screens/home/weekly-activity-chart.tsx` — R7–R9.
- `src/components/empty-state.tsx` — R15 (`tone`, badge, iconos).
- `src/i18n/catalog.ts` — R15 (dos claves, es y en).

Tests:
- `src/screens/home/index.test.tsx`, `src/screens/home/weekly-activity-chart.test.tsx`,
  `src/components/__tests__/empty-state-hero.test.tsx`, `src/components/__tests__/empty-state.test.tsx`.
- `src/__tests__/home-canvas-fidelity.test.ts` (nuevo), `src/__tests__/ui-copy-table.ts`,
  `src/__tests__/legibility-classnames.test.ts`, `src/__tests__/consistency-classnames.test.ts`,
  `src/__tests__/canvas-foundations.test.ts`.

No se tocan: `components/card.tsx`, `utils/category-palette.ts`, `theme/*`, `src/app/_layout.tsx`, backend.

## Alternativas descartadas

- Añadir una variante `elevated` a `Card`: mueve todas las pantallas que usan `Card` y sus candados; `shadow-none` + `style` es local.
- Sombra con clases `shadow-*` de uniwind: no reproduce la sombra doble del canvas; `useShadows` existe para eso (#197).
- Un `ErrorState` nuevo para el error de Inicio: duplica el escenario de `EmptyState`; una prop `tone` cuesta menos.
- Un `ScreenHeader` en Inicio: la cabecera es de #195 y el artboard no lo dibuja (D11).
- Degradado en la carga: requiere `expo-linear-gradient`, vetado (V6).

## Riesgos

- **Ficheros compartidos con #199 y #201** (misma ola): `ui-copy-table.ts`, `src/i18n/catalog.ts` y el `it` CF `#197 R20`. Quien
  mergee segundo resuelve el conflicto conservando las dos filas; la cifra de importadores de `shadows` es la unión.
- **Rebase tras la trazabilidad** invalida los hashes de traceability.md: no rebasear; mergear `dev`.
- **#154** re-ancla sus filas por contenido tras K16.
- **Retardos**: si #197 cambia `MOTION_STAGGER_MS`, los ms de R6 cambian; el test de R6 escribe los ms literales y se pondría rojo
  (deseado).

