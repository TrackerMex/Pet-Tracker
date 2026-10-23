---
feature: "mobile-canvas-map"
status: spec_ready   # draft | spec_ready | approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-canvas-map]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.

La pestaña Mapa (`src/screens/map/index.tsx`) se lleva al canvas aprobado
(2026-10-06; congelado en `specs/mobile-canvas-map/canvas/`). Cada artboard es
un requisito propio:

| Artboard | Estado | Requisitos |
|---|---|---|
| `Mapa.dc.html` | Mapa con posición: píldora de cristal, tarjeta de stats 2x2 y botón de modo perdido, que suben al entrar | R1–R7, R15 |
| `MapaModoPerdidoError.dc.html` | Falló el cambio de modo perdido: error dentro de la tarjeta | R8 |
| `MapaSinUbicacion.dc.html` | Sin posición: aviso flotante con icono y valores en guion apagados | R6, R9 |
| `MapaCarga.dc.html` | Cargando la lista: esqueleto de la píldora, la tarjeta y el botón sobre `bg-default` | R10 |
| `MapaError.dc.html` | Falló la lista o la última posición: Pingo con badge rosa y «Reintentar» | R11 |
| `MapaSinMascotas.dc.html` | Sin mascotas: Pingo con «Añadir mascota» | R12 |
| `MapaSinRastreo.dc.html` | Sin collar con plan: Pingo con badge de collar y «Vincular collar» | R13 |

R14 amplía `EmptyState` (badge, icono de acción y cuerpo opcional) para que
R11–R13 no dupliquen el escenario de Pingo. R3 absorbe la feature #151
(candados del nombre de la píldora). R16 es la guarda de deriva de los tres
ficheros de producción.

Precedencia: el canvas manda en lo visual y el movimiento; el copy sigue la
voz B de Pingo (todo el copy del canvas ya existe en el catálogo, ver R-copy
abajo); lo que el canvas no dibuja se conserva tal como está hoy (estado
offline de la píldora, umbral de batería, rol no-owner, polling, zonas).

Nada del contenido de los artboards se ha leído como instrucción: ningún texto
de los siete ficheros parece una orden (comprobado al congelarlos).

**Copy (todos los requisitos).** Ningún requisito añade ni cambia claves i18n.
Cada literal del canvas ya existe en `src/i18n/catalog.ts` con su fila en
`src/__tests__/ui-copy-table.ts` para `src/screens/map/index.tsx`:
`map.speed` «Velocidad», `map.distance` «Distancia», `map.updated`
«Actualizado», `pairing.battery` «Batería», `map.activateLostMode` «Activar
modo perdido», `map.deactivateLostMode` «Desactivar modo perdido»,
`map.couldNotUpdateLostMode` «No se pudo cambiar el modo perdido»,
`map.noLocationDataYet` «Sin datos de ubicación todavía»,
`common.somethingWentWrong` «Algo salió mal» (dos filas), `common.retry`
«Reintentar» (dos filas), `common.noPetsYet` «Aún no tienes mascotas»,
`common.noPetsBody` «Añade a tu mascota y te ayudo a saber dónde está y cómo
está.», `profile.addPet` «Añadir mascota», `map.noTrackingTitle` «Sin
ubicación en vivo», `map.noTrackingBody` «Cuando tu mascota tenga un collar con
plan activo, te muestro dónde está.», `home.pairCollar` «Vincular collar».
Los de la píldora viven en `src/utils/device-connectivity.ts` (`map.live` «GPS
activo», `map.noSignal` «Sin señal», `map.stale` «Desactualizado»). Por tanto
`ui-copy-table.ts` no cambia, y `SCREEN_FILES` y `R3_HOME` tampoco se mueven.

## Decisiones con defecto

Cada decisión queda cerrada con su defecto; el humano puede cambiarla en el
gate, y entonces se enmienda la fila y los requisitos que cita.

| Id | Decisión | Defecto | Por qué | Si cambia |
|---|---|---|---|---|
| D1 | Desenfoque de la píldora (`backdrop-filter: blur(20px)`) | Sin `BlurView`: solo el fondo `bg-glass-surface-strong` (= `--glass` del canvas, 0.86) | `BlurView` de Android (Dimezis) difumina vistas de React Native; el `GoogleMaps.View` pinta en una superficie nativa propia y el resultado sin probar puede ser negro o transparente. Smoke S2 | Envolver la píldora en `BlurView` como `floating-tab-bar.tsx` y enmendar R2 |
| D2 | Avatar de la píldora | `PetAvatar` de 28 con foto o blobatar, no la inicial sobre ámbar | El canvas no tiene fotos; la app ya muestra la misma cara en Inicio y Perfil (#116) | Inicial sobre `bg-category-amber`, enmendar R2 y R3 |
| D3 | Punto y estado de la píldora | Agrupados en `map-pet-pill-gps` (`gap-1.25`, 5 px): la píldora pasa de 4 a 3 hijos | El canvas los agrupa con su propio hueco de 5 | Cuatro hijos con `gap-2` (8 px entre punto y texto) |
| D4 | Tarjeta de stats | Deja de ser `Card`: `View` `rounded-24 bg-surface p-3` sin borde con `shadows.floating` | La receta de `Card` lleva borde, `rounded-card` y `shadow-sm`; el canvas no tiene borde y lleva su sombra flotante | — |
| D5 | Sombra del aviso sin ubicación | Conserva `Card` y su `shadow-sm` | `#62 R3` exige el `Card` compartido con `style` objeto; sumar `shadows.card` obliga a pelear con la clase | `style={{ …, ...shadows.card }}` y `shadow-none` |
| D6 | Subida (`rise`) | Solo `map-stats` sube, con `homeEntering(0, MOTION_RISE_OFFSET_Y)` importado de `src/screens/home/home-entrance.tsx` (que #197 R12 pasa a `MOTION_RISE_TIMING`); el aviso sin ubicación no sube | Reutiliza la receta existente; el aviso es un `Card` con `style` objeto que `#62 R3` candado y no admite `entering` | Envolver el aviso en un `Animated.View` absoluto y enmendar `#62 R3` |
| D7 | `pop` de los badges | `PopIn` existente (fade + muelle, 250 ms de espera) | Ya es el pop de la app (#171); el keyframe del canvas (400 ms, espera 300) no tiene receta propia | Receta nueva en `theme/motion.ts` |
| D8 | Escenario de Pingo en error, sin mascotas y sin rastreo | `EmptyState variant="hero"`, ampliado por R14; la entrada de título, cuerpo y acción es la de `EmptyState` (muelle escalonado), no el `rise` 100/160/220 ms | El escenario ya coincide con el canvas (disco 240, Pingo 190, sombra) y lo comparte Inicio | Mover `EmptyState` a `rise` (afecta a Inicio: #198) |
| D9 | Pose de Mapa sin rastreo | `talk` (el blob del artboard es el de `InicioVacio`), no `collar` | El canvas dibuja el collar en el badge, no en Pingo | Mantener `collar` y enmendar R13 |
| D10 | TestIDs de las dos ramas de error | `map-error` y `map-last-error` pasan a nombrar la raíz de `EmptyState`; el título es `-title` y la acción `-action` (`map-retry` → `map-error-action`, `map-last-retry` → `map-last-error-action`); el título deja de ser `selectable` | `EmptyState` deriva sus testIDs | — |
| D11 | Ruta y zonas | Ruta de 5 px con la nueva prop opcional `polylineWidth` de `PetMap` (solo Mapa la pasa); relleno de zona sigue en `tab-pill` (0.14 frente a 0.12 del canvas) | Un token nuevo por 0.02 de alfa no compensa | Token `--color-map-zone` |
| D12 | Lo que el canvas dibuja y es de otra feature | Marker, onda `ping`, etiqueta «Casa» y punto de inicio de la ruta → #192; barra de pestañas → #206; la pila conserva `bottom: insets.bottom + 96` (el 104 del canvas depende de la barra de #206) | Reparto del plan de paridad | — |
| D13 | Altura del aviso sin ubicación | Conserva `top: insets.top + 12` | El `top: 60px` del canvas incluye la barra de estado | — |
| D14 | Esqueleto | `Skeleton animation="pulse"` de heroui con sus valores por defecto, bloques `bg-lip-gray`; el bloque de valor (radio 6) usa `rounded-4` | No hay token de radio 6 y `rounded-md` está vetado (`consistency-classnames`) | Token `--radius-6` |
| D15 | Feature #151 | Absorbida como R3 (cero cambio de producción) | Los tests de la píldora se reescriben aquí de todos modos | Dejarla pendiente |
| D16 | Envoltorio de los estados de Pingo | `flex-1 items-center justify-center bg-background px-6 pt-15 pb-30` | Relleno 60/24/120 del canvas: centra por encima de la barra flotante | `p-6` de hoy |
| D17 | Punto del estado activo | `bg-accent` local (el canvas usa `--accent`); el texto sigue `text-accent-strong`; offline conserva el tono de aviso | `STATUS_TONE_CLASSES.success.dot` es `bg-success` y lo comparten otras pantallas | — |
| D18 | Icono «+» de Mapa sin mascotas | Trazo 2.8 pasado por `actionIcon`; el «+» por defecto de `EmptyState` (Inicio) no cambia | Fidelidad sin tocar Inicio | — |
| D19 | Accesibilidad | `lost-mode-error` gana `accessibilityRole="alert"`; `map-loading` gana `accessibilityState={{ busy: true }}`; React Native no tiene rol `status` | Traducción directa de `role`/`aria-busy` del canvas | — |
| D20 | Cabecera | Mapa no adopta `ScreenHeader` y `src/app/_layout.tsx` no cambia | El canvas de Mapa no tiene cabecera (mapa a sangre) | — |
| D21 | Cimientos | Se implementa con #197 ya mergeado en `dev` (`useShadows`, `MOTION_RISE_*`, `homeEntering` con `rise`, colores claros nuevos) | R1, R2, R4, R9, R10 los usan | — |

## Base medida

Base congelada: `origin/dev` en `71ff81a1`. Se mide desde `mobile-pet-tracker/`,
por contenido (nunca por número de línea). Ninguno de estos ficheros lo toca
#197 salvo los marcados `(#197: …)`; los ficheros de #197 que aún no existen en
la base se marcan como precondición.

```bash
cd mobile-pet-tracker
M=src/screens/map/index.tsx
grep -cF '<EmptyState' $M                       # 2  (R11: 2 → 4)
grep -cF 'text-accent-strong' $M                # 2  (R5: 2 → 1)
grep -cF 'style={CONTINUOUS_CORNER}' $M         # 4  (sin cambio)
grep -cF 'react-native-reanimated' $M           # 0  (R1: 0 → 1)
grep -cF 'testID="map-retry"' $M                # 1  (R11: 1 → 0)
grep -cF 'testID="map-last-retry"' $M           # 1  (R11: 1 → 0)
grep -cF 'pose="collar"' $M                     # 1  (R13: 1 → 0)
grep -cF '<Skeleton' $M                         # 1  (R10: 1 → 11)
grep -cF 'useChunkyLip' $M                      # 0  (R13: 0 → 2: import y llamada)
grep -cF "from 'reicon-react-native'" $M        # 0  (R16: 0 → 1)
grep -cF '<Card' $M                             # 2  (R4: 2 → 1)
grep -cF 'rounded-xl' $M                        # 5  (R5, R7: 5 → 0)
grep -cF 'flex-1 items-center justify-center p-6 bg-background' $M   # 2 (R12, R13: 2 → 0)
grep -cF 'useThemeColors' $M                    # 0  (R7, R11–R13: 0 → 2: import y llamada)
grep -cF 'PopIn' $M                             # 0  (R11, R13)
grep -cF 'react-native-svg' $M                  # 0  (R13: 0 → 1)
grep -cF 'polylineWidth' src/components/pet-map.tsx            # 0 (R15)
grep -cF "'accent-strong', 'tab-pill'" src/components/pet-map.tsx  # 1 (sin cambio)
grep -cF 'badge' src/components/empty-state.tsx                # 0 (R14)
grep -cF 'actionIcon' src/components/empty-state.tsx           # 0 (R14)
grep -cF 'body: string' src/components/empty-state.tsx         # 1 (R14: 1 → 0)
grep -cF '<Plus size={20}' src/components/empty-state.tsx      # 1 (sin cambio)
T=src/screens/map/index.test.tsx
grep -cF "'map-retry'" $T                       # 2  (R11: 2 → 0)
grep -cF "'map-last-retry'" $T                  # 5  (R11: 5 → 0)
grep -cF 'pingo-collar' $T                      # 1  (R13: 1 → 0)
grep -cF '#201' $T                              # 0
grep -cF "'flex-1 items-center justify-center p-6 bg-background'" $T  # 2 (R12, R13: 2 → 0)
grep -cF "'items-center gap-3 py-8'" $T         # 1  (R13: 1 → 0)
grep -cF 'mt-1 text-2xs font-normal text-muted' $T   # 1 (R5: 1 → 0)
grep -cF "['src/screens/map/index.tsx', 2]," src/components/__tests__/empty-state.test.tsx           # 1 (R11)
grep -cF "['src/screens/map/index.tsx', 'entering=']," src/components/__tests__/empty-state.test.tsx  # 1 (R1)
grep -cF "[join('screens', 'map', 'index.tsx'), 2]," src/__tests__/legibility-classnames.test.ts     # 1 (R5)
grep -cF 'screens/map/index.tsx' src/__tests__/chunky-cta-canvas-fidelity.test.ts                 # 0 (R13)
test ! -e src/__tests__/map-canvas-fidelity.test.ts    # verdadero (nuevo, CF)
test ! -e src/__tests__/canvas-foundations.test.ts     # verdadero en la base; precondición: existe (#197)
test ! -e src/theme/shadows.ts                         # verdadero en la base; precondición: existe (#197)
grep -cF 'MOTION_RISE' src/theme/motion.ts             # 0 en la base; precondición: ≥ 2 (#197)
```

Todos los literales de canvas que citan los requisitos se comprobaron con
`grep -cF` contra `specs/mobile-canvas-map/canvas/*.dc.html` y aparecen las
veces que dice cada fila de CF (en R1–R15).

Abreviaturas de test:

- MT `src/screens/map/index.test.tsx`
- CF `src/__tests__/map-canvas-fidelity.test.ts` (nuevo). Lee cada artboard con
  `readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-map/canvas/<Artboard>.dc.html'), 'utf8')`
  y la fuente de producción con `readFileSync(join(process.cwd(), 'src', …), 'utf8')`.
  En cada fila afirma las dos mitades: la cuenta del literal del canvas y la
  cuenta del literal de producción. Un `describe` por requisito, titulado `#201 R<n>: …`.
- ES `src/components/__tests__/empty-state.test.tsx`
- PM `src/components/__tests__/pet-map.test.tsx`
- CC `src/__tests__/chunky-cta-canvas-fidelity.test.ts`
- LG `src/__tests__/legibility-classnames.test.ts`
- FN `src/__tests__/canvas-foundations.test.ts` (lo crea #197)

Los `it` nuevos empiezan por `#201 R<n>`. Los `it` existentes que cambian
conservan su título y añaden ` (enmendado por #201 R<n>)`.

## TestIDs

Se conservan: `screen-map`, `map-loading`, `map-last-error-state`, `map-view`,
`map-empty-overlay`, `map-empty`, `map-stats`, `map-pet-pill`,
`map-pet-pill-avatar`, `map-pet-pill-name`, `map-pet-pill-dot`,
`map-pet-pill-status`, `stat-speed`, `stat-distance`, `stat-updated`,
`stat-battery`, `lost-mode-button`, `lost-mode-error`, `map-no-pets*`,
`map-no-tracking*`.

Cambian de sentido (D10): `map-error` y `map-last-error` pasan a ser la raíz de
un `EmptyState`; desaparecen `map-retry` y `map-last-retry`.

Nuevos:

| testID | Nodo | R |
|---|---|---|
| `map-pet-pill-gps` | Grupo punto + estado de la píldora | R2 |
| `map-stats-card` | Tarjeta de stats (hijo 1 de `map-stats`) | R4 |
| `lost-mode-icon` | Icono del botón de modo perdido | R7 |
| `map-empty-icon` | Icono del aviso sin ubicación | R9 |
| `map-loading-stats` | Pila del esqueleto | R10 |
| `map-loading-pill` | Píldora del esqueleto | R10 |
| `map-loading-card` | Tarjeta del esqueleto | R10 |
| `map-error-title`, `map-error-stage`, `map-error-pose`, `map-error-action` | Derivados de `EmptyState` | R11 |
| `map-error-badge`, `map-error-action-icon` | Badge rosa e icono de Reintentar (pasados por R14) | R11 |
| `map-last-error-title`, `map-last-error-stage`, `map-last-error-pose`, `map-last-error-action` | Derivados de `EmptyState` | R11 |
| `map-last-error-badge`, `map-last-error-action-icon` | Badge rosa e icono de Reintentar | R11 |
| `map-no-pets-action-icon` | «+» de trazo 2.8 (pasado por R14; mismo nombre que el de por defecto) | R12 |
| `map-no-tracking-badge`, `map-no-tracking-collar`, `map-no-tracking-action-icon` | Badge del collar, su `Svg` e icono de enlace | R13 |

Comprobado contra los selectores por regex del árbol
(`grep -rnE "TestId\(/" mobile-pet-tracker/src`): `/^pet-chip-/`, `/^meal-row-/`,
`/^plan-warning-/`, `/^meal-pending-/`, `/^meal-served-/`,
`/^register-.+-message(-row)?$/`, `/^doc-/` y el `/^stat-/` de MT (dentro de una
fila). Ningún testID nuevo casa con ninguno: ninguno empieza por `stat-`.

## Requisitos funcionales

Convenciones de todos los requisitos:

- `shadows` es `useShadows()` de `src/theme/shadows.ts` (#197), una sola llamada
  en `MapScreen`. Cada clave es `{ boxShadow: [{ offsetX, offsetY, blurRadius,
  spreadDistance, color }] }`.
- Los colores de icono salen de **una** llamada
  `useThemeColors(['accent-foreground', 'category-rose-strong', 'danger', 'muted'])`
  en `MapScreen` (nombres locales `accentForeground`, `categoryRoseStrong`,
  `danger`, `muted`). La lista no casa con la regex `'accent'` de LG.
- Los iconos son de `reicon-react-native` y van en un solo import:
  `AlertCircle, AlertTriangle, Link, Location, Plus, Refresh`.
- Los MT nuevos van en un `describe('#201 R<n>: …')` por requisito. Los tests
  corren en tema claro: los colores esperados son los literales claros del
  canvas, nunca un valor importado de producción.
- Los `Text` de `map/index.tsx` son los de `react-native`
  (`import { Text, View } from 'react-native'`), así que `text-15` y `text-11`
  no pasan por twMerge. Solo `Button.Label` (R7) es de HeroUI, y lleva
  `text-base`.

### R1 — La pila de stats sube al entrar (`Mapa`)

WHEN la rama con mascota y collar monta `map-stats`, THE SYSTEM SHALL
renderizarlo como `Animated.View` de `react-native-reanimated` con
`className="gap-2.5"`, el mismo `style` objeto de hoy (`position: 'absolute'`,
`left: 16`, `right: 16`, `bottom: insets.bottom + 96`) y
`entering={homeEntering(0, MOTION_RISE_OFFSET_Y)}` (`homeEntering` importado de
`src/screens/home/home-entrance.tsx`, `MOTION_RISE_OFFSET_Y` de
`src/theme/motion.ts`). IF `useReducedMotion()` de Reanimated devuelve `true`,
THEN `entering` SHALL ser `undefined`.

- MT `#201 R1: map-stats sube 14 desde transparente`: `props.className` es
  `'gap-2.5'`; `props.entering` es una función y `props.entering({}).initialValues`
  es `{ opacity: 0, transform: [{ translateY: 14 }] }` (literal 14, no la
  constante).
- MT `#201 R1: con movimiento reducido map-stats no anima la entrada`: con
  `useReducedMotion` forzado a `true` (mismo mecanismo que el test de
  `HomeEntrance`), `props.entering` es `undefined`.
- CF `Mapa`: `animation: rise 400ms ease-out both` ×1 frente a
  `homeEntering(0, MOTION_RISE_OFFSET_Y)` ×1 en el mapa;
  `bottom: 104px; display: flex; flex-direction: column; gap: 10px` ×1 frente a
  `className="gap-2.5"` ×2 en el mapa (pila real y pila del esqueleto, R10).

### R2 — Píldora de cristal (`Mapa`)

WHILE `map-stats` está montado, THE SYSTEM SHALL pintar `map-pet-pill` como su
hijo 0 con `className` exacta
`flex-row items-center gap-2 self-start rounded-full border border-border bg-glass-surface-strong py-1.5 pl-1.5 pr-3.5`
y `style={shadows.card}`, con tres hijos en orden:

1. `PetAvatar` (`map-pet-pill-avatar`) con `size={28}`;
2. `Text testID="map-pet-pill-name" numberOfLines={1}` con
   `className="shrink text-15 font-extrabold text-foreground"`;
3. `View testID="map-pet-pill-gps" className="flex-row items-center gap-1.25"`
   con el punto `map-pet-pill-dot` (`className={\`size-1.75 rounded-full ${dot}\`}`)
   y el estado `map-pet-pill-status` (`numberOfLines={1}`,
   `className={\`text-xs font-bold ${text}\`}`).

Tonos por rama (una fila de test por rama): en línea → `bg-accent` /
`text-accent-strong` (D17); sin señal → `bg-warning-strong` /
`text-warning-strong`; desactualizado, sin collar, detalle pendiente y detalle
con error → `bg-muted` / `text-muted`. El `accessibilityLabel` de la píldora no
cambia.

- MT: los `it` enmendados de `#116 R2`, `#116 R3` y `#116 R4` (inventario abajo).
- MT `#201 R2: la píldora lleva la sombra de tarjeta de dos capas`:
  `props.style.boxShadow` tiene longitud 2 y casa con
  `[{ offsetY: 1, blurRadius: 2 }, { offsetY: 8, blurRadius: 24 }]`
  (`toMatchObject`).
- MT `#201 R2: el punto y el estado van juntos en map-pet-pill-gps`: el grupo
  tiene `className` `'flex-row items-center gap-1.25'` y sus hijos son
  `['map-pet-pill-dot', 'map-pet-pill-status']`.
- CF `Mapa`: `padding: 6px 14px 6px 6px` ×1 / `py-1.5 pl-1.5 pr-3.5` ×2 (píldora y
  esqueleto); `--glass:rgba(255,255,255,0.86)` ×1 / `bg-glass-surface-strong` ×1
  en el mapa y `--color-glass-surface-strong: rgba(255,255,255,0.86)` ×1 en
  `src/theme/global.css`; `width: 28px; height: 28px` ×1 / `size={28}` ×1;
  `font-size: 15px; font-weight: 800` ×1 / `text-15 font-extrabold` ×1;
  `gap: 5px; font-size: 12px; font-weight: 700; color: var(--accent-strong)` ×1 /
  `gap-1.25` ×1 y `text-xs font-bold` ×1;
  `width: 7px; height: 7px; border-radius: 50%; background: var(--accent)` ×1 /
  `size-1.75 rounded-full` ×1; `box-shadow: var(--shadow)` ×1 /
  `shadows.card` ×2 (píldora y esqueleto).

### R3 — La píldora nombra y pinta la mascota de la lista (#151)

WHEN la lista trae la mascota seleccionada con `name: 'Luna'` sin foto y el
detalle de esa misma mascota trae `name: 'Rocky'`, THE SYSTEM SHALL rotular
`map-pet-pill-name` «Luna», dar a `map-pet-pill` el `accessibilityLabel`
`'Luna, GPS activo'` (escenario en línea de la fila online de `#116 R4`) y
pintar en `map-pet-pill-avatar` lo mismo que `<PetAvatar size={28} name="Luna" />`
aislado. Cero cambio de producción.

- MT `#201 R3 (#151): la píldora sigue el nombre de la lista aunque el detalle diga otro`:
  nombre y `accessibilityLabel` como arriba.
- MT `#201 R3 (#151): la cara de la píldora es la de la lista`: el `toJSON()` del
  avatar, sin su `testID`, es igual al de `render(<PetAvatar size={28} name="Luna" />)`
  y distinto del de `name="Rocky"`.
- MT `#201 R3 (#151): la sonda distingue las dos caras`: los dos renders
  aislados (`Luna` y `Rocky`) dan `toJSON()` distintos. Sin este `it`, el
  anterior pasaría también con una cara constante.

### R4 — Tarjeta de stats sin borde con sombra flotante (`Mapa`)

WHILE `map-stats` está montado, THE SYSTEM SHALL pintar como su hijo 1 (y
último) un `View testID="map-stats-card"` con `className="gap-2.5 rounded-24 bg-surface p-3"`
y `style={shadows.floating}`, cuyos hijos son, en orden: la rejilla
`View className="gap-2"` con dos filas `View className="flex-row gap-2"`
(`stat-speed` y `stat-distance`; `stat-updated` y `stat-battery`), y
`lost-mode-button`. `map-stats-card` no es un `Card`.

- MT `#201 R4: la tarjeta de stats es un View sin borde con sombra flotante`:
  `className` exacta; `props.style.boxShadow` tiene longitud 1 y casa con
  `[{ offsetY: 12, blurRadius: 32 }]`; el nodo no tiene `border` en su
  `className`.
- MT `#201 R4: map-stats tiene dos hijos y la tarjeta agrupa rejilla y botón`:
  `elementChild(stats, 1).props.testID` es `'map-stats-card'`, `map-stats` tiene
  2 hijos y los de la tarjeta son `[<rejilla>, 'lost-mode-button']`.
- CF `Mapa`: `border-radius: 24px; background: var(--surface); box-shadow: 0 12px 32px rgba(13,17,23,0.14); padding: 12px`
  ×1 / `gap-2.5 rounded-24 bg-surface p-3` ×2 y `shadows.floating` ×2 (tarjeta
  y esqueleto); `grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px` ×1 /
  `className="gap-2"` ×2 (rejilla y rejilla del esqueleto).

### R5 — Tiles con rótulo arriba (`Mapa`)

WHILE `map-stats-card` está montado, THE SYSTEM SHALL pintar cada uno de los
cuatro tiles, escritos en línea como hoy, como
`View className="flex-1 gap-0.5 rounded-14 bg-default px-3 py-2.5" style={CONTINUOUS_CORNER}`
con primero el rótulo `Text className="text-11 font-semibold text-muted"` y
después el valor (`stat-*`, `numberOfLines={1}`, con `TABULAR_NUMS` como hoy).
WHEN el valor tiene dato, su `className` SHALL ser: velocidad
`text-xl font-black text-accent-strong`; distancia
`text-xl font-black text-foreground`; actualizado
`text-base font-bold text-muted`; batería `text-xl font-black ${batteryTone.text}`
(umbral sin cambio).

- MT: `#116 R5` y las filas de `#116 R6` enmendados (inventario abajo).
- MT `#201 R5: cada valor con dato lleva la tinta del canvas`: `it.each` de tres
  filas (velocidad, distancia, actualizado) con posición, velocidad y ruta.
- LG `#61 R4`: `inkSites` del mapa `2` → `2 - 1 // #201 R5` y el total
  `suma las trece ocurrencias…` con `- 1 // #201 R5`.
- CF `Mapa`: `border-radius: 14px; background: var(--default); padding: 10px 12px`
  ×4 / `flex-1 gap-0.5 rounded-14 bg-default px-3 py-2.5` ×4;
  `font-size: 11px; font-weight: 600; color: var(--muted)` ×4 /
  `text-11 font-semibold text-muted` ×4;
  `font-size: 20px; font-weight: 900; color: var(--accent-strong)` ×2 /
  `text-xl font-black text-accent-strong` ×1 (la batería alta lo toma del tono);
  `font-size: 16px; font-weight: 700; color: var(--muted)` ×1 /
  `text-base font-bold text-muted` ×1.

### R6 — El guion se lee apagado (`MapaSinUbicacion`)

IF el valor de un tile es «—», THEN THE SYSTEM SHALL pintarlo con
`className` `text-xl font-black text-muted`, escrito una vez en el mapa como el
literal `'text-xl font-black text-muted'`. Una rama por causa de guion:

| Tile | Causa | Test |
|---|---|---|
| velocidad | sin posición | MT `#201 R6: velocidad sin posición se apaga` |
| velocidad | posición con `speedKmh` nulo | MT `#201 R6: velocidad sin dato se apaga` |
| distancia | ruta del día en error | MT `#201 R6: distancia sin ruta se apaga` |
| actualizado | sin posición | MT `#201 R6: actualizado sin posición se apaga` |
| batería | detalle pendiente, detalle con error, sin collar, collar sin batería | los cuatro `it` de `#116 R7` enmendados |

- CF `MapaSinUbicacion`: `font-size: 20px; font-weight: 900; color: var(--muted)`
  ×4 / `'text-xl font-black text-muted'` ×1.

### R7 — Botón de modo perdido rosa con icono (`Mapa`)

THE SYSTEM SHALL pintar `lost-mode-button` como `Button variant="danger-soft"`
con `className="h-12.5 gap-2 rounded-14 bg-category-rose"`, sin `style` de
labio, con dos hijos en orden:
`<AlertTriangle size={18} strokeWidth={2.2} color={categoryRoseStrong} testID="lost-mode-icon" />`
y `Button.Label className="text-base font-extrabold text-category-rose-strong"`
con el literal de hoy («Activar modo perdido» / «Desactivar modo perdido»). Rol
no-owner, deshabilitado y mutación no cambian.

- MT `#201 R7: el botón es rosa, sin labio y con el triángulo delante`:
  `className` exacta, `props.style` sin `boxShadow`, hijos
  `['lost-mode-icon', <Button.Label>]`, icono con `size` 18, `strokeWidth` 2.2 y
  `color` `'#D80B34'`, `className` del rótulo exacta.
- MT `#201 R7: el rótulo de desactivar lleva la misma tinta`: con modo perdido
  activo, rótulo «Desactivar modo perdido» con la misma `className`.
- CF `Mapa`: `height: 50px` ×1 / `h-12.5` ×2 (botón y esqueleto);
  `border-radius: 14px; background: var(--rose); color: var(--rose-s)` ×1 /
  `rounded-14 bg-category-rose` ×1; `--rose:#FFF0F3` ×1 /
  `--color-category-rose: #FFF0F3` ×1 en `global.css`; `--rose-s:#D80B34` ×1 /
  `--color-category-rose-strong: #D80B34` ×1 en `global.css`; el `path`
  `M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z`
  ×1 / `<AlertTriangle` ×1; `stroke-width="2.2"` ×1 / `strokeWidth={2.2}` ×4 en el
  mapa (triángulo, aviso R9 y los dos badges R11).

### R8 — El error de modo perdido vive en la tarjeta (`MapaModoPerdidoError`)

WHEN el cambio de modo perdido falla, THE SYSTEM SHALL pintar `lost-mode-error`
(«No se pudo cambiar el modo perdido», `selectable`, `className` sin cambio
`text-center text-xs font-normal text-danger`) como último hijo de
`map-stats-card`, detrás de `lost-mode-button`, con `accessibilityRole="alert"`.

- MT `#201 R8: el error de modo perdido es el último hijo de la tarjeta y se anuncia`:
  hijos de `map-stats-card` `[<rejilla>, 'lost-mode-button', 'lost-mode-error']`
  y `accessibilityRole` `'alert'`.
- CF `MapaModoPerdidoError`: `role="alert"` ×1 / `accessibilityRole="alert"` ×1;
  `font-size: 12px; line-height: 16px; color: var(--danger)` ×1 /
  `text-center text-xs font-normal text-danger` ×1.

### R9 — Aviso sin ubicación con icono (`MapaSinUbicacion`)

WHEN la mascota con collar no tiene posición, THE SYSTEM SHALL pintar
`Card testID="map-empty-overlay"` con `className="flex-row items-center justify-center gap-2 px-4 py-3.5"`
y el mismo `style` objeto de hoy (`position: 'absolute'`,
`top: insets.top + 12`, `left: 16`, `right: 16`), con dos hijos en orden:
`<Location size={18} strokeWidth={2.2} color={muted} testID="map-empty-icon" />`
y `Text testID="map-empty" className="text-sm font-semibold text-muted"`
(«Sin datos de ubicación todavía»).

- MT `#201 R9: el aviso lleva el icono de ubicación delante del texto`: hijos
  `['map-empty-icon', 'map-empty']`, icono 18 / 2.2 / `color` del token `muted`
  claro leído de `global.css` en el propio test, y las dos `className` exactas.
- CF `MapaSinUbicacion`: `padding: 14px 16px; border-radius: 20px` ×1 /
  `gap-2 px-4 py-3.5` ×1; `font-size: 14px; font-weight: 600` ×1 /
  `text-sm font-semibold text-muted` ×1.

### R10 — Esqueleto de la pila (`MapaCarga`)

WHILE la lista de mascotas está pendiente, THE SYSTEM SHALL pintar
`View testID="map-loading" className="flex-1 bg-default" accessibilityState={{ busy: true }}`
con un único hijo `View testID="map-loading-stats" className="gap-2.5"` y el
mismo `style` objeto que `map-stats` (R1), que contenga en orden:

1. `View testID="map-loading-pill"` con `className`
   `flex-row items-center gap-2 self-start rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-3.5`
   y `style={shadows.card}`: `Skeleton` `size-7 rounded-full bg-lip-gray` y
   `Skeleton` `h-3 w-37.5 rounded-full bg-lip-gray`;
2. `View testID="map-loading-card"` con `className="gap-2.5 rounded-24 bg-surface p-3"`
   y `style={shadows.floating}`: rejilla `View className="gap-2"` con dos filas
   `View className="flex-row gap-2"` de dos tiles
   `View className="flex-1 gap-1.5 rounded-14 bg-default px-3 py-2.5"`, cada uno
   con `Skeleton` `h-2.5 w-12 rounded-full bg-lip-gray` y `Skeleton`
   `h-5.5 w-18 rounded-4 bg-lip-gray`; y detrás de la rejilla `Skeleton`
   `h-12.5 rounded-14 bg-default`.

Todos los `Skeleton` (11, escritos en línea) son de `heroui-native` con
`animation="pulse"` y sus valores por defecto (D14).

- MT `#201 R10: la carga se anuncia ocupada sobre bg-default`: `className` y
  `accessibilityState` `{ busy: true }` de `map-loading`.
- MT `#201 R10: la carga dibuja píldora y tarjeta con sus recetas`: `className`
  y `boxShadow` (longitud 2 / 1) de `map-loading-pill` y `map-loading-card`;
  `map-loading-stats` tiene `style.bottom` 120 (con el `insets.bottom` 24 del
  mock) y los hijos `['map-loading-pill', 'map-loading-card']`.
- MT `#201 R10: los once bloques laten con pulse`: dentro de `map-loading` hay
  11 nodos `Skeleton` de `heroui-native` y todos tienen `animation` `'pulse'`.
- MT `R4: map resuelve la mascota seleccionada › R8 (mobile-design-drift): reserva el mapa completo con Skeleton`
  sigue verde sin cambios (`className` contiene `flex-1`).
- CF `MapaCarga`: `aria-busy="true"` ×1 / `accessibilityState={{ busy: true }}`
  ×1; `animation: pulse 1.4s ease-in-out infinite` ×11 / `animation="pulse"` ×11;
  `background: var(--lip-gray)` ×10 / `bg-lip-gray` ×10;
  `width: 150px; height: 12px` ×1 / `h-3 w-37.5` ×1;
  `width: 48px; height: 10px` ×4 / `h-2.5 w-12` ×4;
  `width: 72px; height: 22px` ×4 / `h-5.5 w-18` ×4;
  `width: 28px; height: 28px` ×1 / `size-7 rounded-full bg-lip-gray` ×1.

### R11 — Pingo en las dos ramas de error (`MapaError`)

IF la lista de mascotas falla (testID `map-error`) o la última posición falla
(testID `map-last-error`), THEN THE SYSTEM SHALL pintar un envoltorio
`View className="flex-1 items-center justify-center bg-background px-6 pt-15 pb-30"`
(el de la última posición conserva `testID="map-last-error-state"`) cuyo único
hijo es `EmptyState variant="hero"` con ese `testID`, `pose="talk"`,
`title={t('common.somethingWentWrong')}`, sin `body`,
`action={{ label: t('common.retry'), onPress: <refetch de esa misma consulta> }}`,
`actionIcon={<Refresh size={20} strokeWidth={2.6} color={accentForeground} style={{ marginRight: 8 }} testID="<id>-action-icon" />}`
y
`badge={<PopIn testID="<id>-badge" className="absolute bottom-8.5 right-9 size-14 items-center justify-center rounded-full border-4 border-background bg-category-rose"><AlertCircle size={26} strokeWidth={2.2} color={danger} /></PopIn>}`.
Las dos ramas se escriben en línea (4 `<EmptyState` en el mapa).

Una fila de test por rama (`it.each` sobre `map-error` y `map-last-error`):

- MT `#201 R11: %s pinta a Pingo con badge rosa y Reintentar`: título «Algo salió
  mal», sin `<id>-body`, `<id>-pose` con `pingo-talk.webp`, acción con
  «Reintentar», `<id>-action-icon` con `strokeWidth` 2.6, `<id>-badge` con su
  `className` exacta y un `AlertCircle` 26 / 2.2 / `'#D92D20'` (danger de #197).
- MT `#201 R11: %s centra por encima de la barra`: el padre de `<id>` tiene
  `className` `'flex-1 items-center justify-center bg-background px-6 pt-15 pb-30'`
  y un solo hijo.
- MT: los `it` enmendados de las suites de `mobile-map-last-position-error-state`
  (inventario abajo) siguen probando el refetch de cada rama.
- ES `%s pinta %i EmptyState`: fila del mapa `2` → `2 + 2 // #201 R11`.
- CF `MapaError`:
  `width: 56px; height: 56px; border-radius: 50%; background: var(--rose); color: var(--danger); border: 4px solid var(--bg)`
  ×1 / `size-14 items-center justify-center rounded-full border-4 border-background bg-category-rose`
  ×2; `right: 36px; bottom: 34px` ×1 / `absolute bottom-8.5 right-9` ×2;
  `M20 12a8 8 0 1 1-2.5-5.8` ×1 / `<Refresh` ×2; `M12 8v5M12 16.5h.01` ×1 /
  `<AlertCircle` ×2; `stroke-width="2.6"` ×1 / `strokeWidth={2.6}` ×2;
  `padding: 60px 24px 120px` ×1 / `bg-background px-6 pt-15 pb-30` ×4 (dos
  errores, R12, R13); `animation: pop 400ms ease-out 300ms both` ×1 / `<PopIn`
  ×3 (dos errores y R13).

### R12 — Pingo sin mascotas (`MapaSinMascotas`)

WHEN el usuario no tiene mascotas, THE SYSTEM SHALL pintar, como único hijo del
envoltorio de R11 (sin `testID`), `EmptyState variant="hero" testID="map-no-pets" pose="talk"`
con el copy y la acción de hoy («Aún no tienes mascotas», cuerpo, «Añadir
mascota» → `/pets/add`) y
`actionIcon={<Plus size={20} strokeWidth={2.8} color={accentForeground} style={{ marginRight: 8 }} testID="map-no-pets-action-icon" />}`.

- MT `#201 R12: sin mascotas usa el escenario hero con el «+» de trazo 2.8`:
  existe `map-no-pets-stage`, y `map-no-pets-action-icon` tiene `strokeWidth`
  2.8 y `size` 20.
- MT `#155 R4 › queda en el sitio del vacío que sustituye` enmendado (inventario).
- CF `MapaSinMascotas`: `stroke-width="2.8"` ×1 / `strokeWidth={2.8}` ×1.

### R13 — Pingo sin rastreo con badge de collar (`MapaSinRastreo`)

WHEN la mascota no tiene collar con plan activo, THE SYSTEM SHALL pintar, como
único hijo del envoltorio de R11 (sin `testID`),
`EmptyState variant="hero" testID="map-no-tracking" pose="talk"` con el copy de
hoy, con
`badge={<PopIn testID="map-no-tracking-badge" className="absolute bottom-10 right-7.5 size-13 items-center justify-center rounded-16 bg-accent" style={chunkyLip.primary}>…</PopIn>}`
(`chunkyLip` de `useChunkyLip()`), cuyo hijo es
`<Svg testID="map-no-tracking-collar" width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={accentForeground} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">`
con `<Ellipse cx="12" cy="8.5" rx="8" ry="4" />`, `<Path d="M12 12.5v3" />` y
`<Circle cx="12" cy="18.5" r="2.5" />` de `react-native-svg`. WHEN
`canPairCollar` es verdadero, la acción de hoy («Vincular collar» → `/pairing`)
SHALL llevar
`actionIcon={<Link size={20} strokeWidth={2.4} color={accentForeground} style={{ marginRight: 8 }} testID="map-no-tracking-action-icon" />}`.
IF `canPairCollar` es falso, THEN no hay acción ni icono.

- MT `#201 R13: sin rastreo pinta a Pingo con el badge del collar`: `pose` con
  `pingo-talk.webp`; `map-no-tracking-badge` con `className` exacta y
  `style.boxShadow` no vacío; `map-no-tracking-collar` con `strokeWidth` 2 y sus
  tres hijos `Ellipse`, `Path`, `Circle` en ese orden.
- MT `#201 R13: el dueño sin collar ve el icono de enlace`:
  `map-no-tracking-action-icon` con `strokeWidth` 2.4.
- MT `#201 R13: sin botón no hay icono de enlace`: escenario de `#159 R4` (no
  dueño) y `queryByTestId('map-no-tracking-action-icon')` es `null`.
- MT `#159 R2` enmendados (inventario).
- CC: `#177 R7.2`, `#177 R7.3`, `#177 R7.4` y `#177 R7.5` suman el mapa
  (inventario).
- CF `MapaSinRastreo`:
  `right: 30px; bottom: 40px; width: 52px; height: 52px; border-radius: 16px; background: var(--accent)`
  ×1 / `absolute bottom-10 right-7.5 size-13 items-center justify-center rounded-16 bg-accent`
  ×1; `box-shadow: 0 4px 0 var(--lip)` ×2 / `style={chunkyLip.primary}` ×1 en el
  mapa (el labio del botón vive en `empty-state.tsx`);
  `<ellipse cx="12" cy="8.5" rx="8" ry="4"` ×1 /
  `<Ellipse cx="12" cy="8.5" rx="8" ry="4"` ×1; `<path d="M12 12.5v3"` ×1 /
  `<Path d="M12 12.5v3"` ×1; `<circle cx="12" cy="18.5" r="2.5"` ×1 /
  `<Circle cx="12" cy="18.5" r="2.5"` ×1; `stroke-width="2.4"` ×2 /
  `strokeWidth={2.4}` ×1.

### R14 — `EmptyState` admite badge, icono de acción y cuerpo opcional

THE SYSTEM SHALL ampliar las props de `EmptyState`
(`src/components/empty-state.tsx`) con `badge?: ReactNode` y
`actionIcon?: ReactElement`, y hacer `body?: string` opcional:

- WHERE `variant="hero"` y `badge` está definido, `badge` SHALL renderizarse
  como último hijo de `<testID>-stage`;
- WHERE `variant="hero"`, `action` y `actionIcon` están definidos, el botón
  SHALL pintar `actionIcon` en lugar del `<Plus size={20} …>` por defecto; sin
  `actionIcon` pinta el `<Plus>` de hoy;
- IF `body` no está definido, THEN no SHALL montarse `<testID>-body` ni su
  envoltorio de entrada, en ninguna variante.

Inicio no pasa ninguna prop nueva y no cambia.

- ES `#201 R14: el badge es el último hijo del escenario`: con `badge` el
  escenario tiene un hijo más que sin él y ese hijo es el badge.
- ES `#201 R14: sin badge el escenario no cambia`: sin `badge` no hay nodo con
  el `testID` del badge de prueba.
- ES `#201 R14: actionIcon sustituye al «+» del hero`: el icono pasado está y
  `<id>-action-icon` es él.
- ES `#201 R14: sin actionIcon el hero conserva el «+»`: `<id>-action-icon` tiene
  `size` 20 y `strokeWidth` `undefined`.
- ES `#201 R14: sin body el hero no monta cuerpo` y
  `#201 R14: sin body la variante por defecto no monta cuerpo` (una fila por
  variante).

### R15 — La ruta se dibuja con trazo 5 (`Mapa`)

WHERE `PetMap` recibe la prop opcional `polylineWidth?: number`, THE SYSTEM
SHALL añadir `width: polylineWidth` a cada polilínea de ruta; IF no la recibe,
THEN las polilíneas no llevan la clave `width`. El mapa pasa
`polylineWidth={5}`; las zonas no cambian (D11).

- PM `#201 R15: con polylineWidth cada polilínea lleva ese ancho` y
  `#201 R15: sin polylineWidth las polilíneas no llevan ancho`.
- MT `#201 R15: Mapa pide la ruta de 5`: el `PetMap` montado recibe
  `polylineWidth` 5.
- CF `Mapa`: `stroke="#107148" stroke-width="5"` ×1 / `polylineWidth={5}` ×1 en
  el mapa.

### R16 — Guardas de deriva de los tres ficheros

THE SYSTEM SHALL mantener en `src/screens/map/index.tsx`,
`src/components/empty-state.tsx` y `src/components/pet-map.tsx`, con un `it` por
fichero y guarda (`it.each` sobre el producto):

1. cero coincidencias de `HEX_LITERAL` y de `ARBITRARY_CLASS` (las regex de
   `src/__tests__/design-drift.test.ts`, copiadas literalmente); por eso todo
   comentario nuevo cita `#201 R<n>`, nunca `#201` solo;
2. cero `StyleSheet.create`;
3. cero emoji (`/\p{Extended_Pictographic}/u`);
4. cero imports de `expo-linear-gradient` y de `expo-blur`;
5. cero `rounded-(?:2xl|xl|lg|md|sm)\b`;
6. cero `text-accent` sin sufijo (`/\btext-accent(?![-\w])/`).

Además, el mapa SHALL tener exactamente un import de `reicon-react-native` y
sus nombres, ordenados, SHALL ser `['AlertCircle', 'AlertTriangle', 'Link', 'Location', 'Plus', 'Refresh']`.

- CF `#201 R16: %s respeta la guarda %s` (`it.each`, 18 filas) y
  `#201 R16: el mapa importa solo sus seis iconos`.
- Guarda de la guarda: `#201 R16: las guardas cazan su mutación`, un `it.each`
  que aplica cada regex a una cadena con la mutación plantada
  (`'#107148'`, `'w-[10px]'`, `'StyleSheet.create('`, `'🐾'`,
  `"from 'expo-blur'"`, `'rounded-xl'`, `'text-accent '`) y espera una
  coincidencia.

## Candados que esta feature revierte

Inventario cerrado. Cada `it` conserva su título y añade
` (enmendado por #201 R<n>)`; donde el título nombra el valor viejo, la
columna «Título nuevo» da el título completo. Ningún otro `it` existente cambia
de aserción: si un `it` fuera de esta tabla se pone rojo, es una regresión, no
una enmienda.

**Enmienda mecánica permitida**: si un `it` no inventariado se pone rojo solo porque compara contra el literal exacto que el R-id quita o sustituye (directo o vía constante/helper del test), el implementador lo enmienda en el commit rojo de ese R con el sufijo y lo apunta en la tabla «Enmiendas mecánicas» de su informe. Cualquier otro rojo no inventariado sigue siendo motivo de parada.

Cómo se cerró: por literal, no por título. Cada literal viejo se buscó con
`git grep -cF '<literal>' -- 'src/**/*.test.ts' 'src/**/*.test.tsx' 'src/__tests__/*.ts'`
y cada aparición se siguió hasta su `it` (MT no tiene constantes de fichero
con estos literales; el helper `elementChild` solo indexa hijos). Cuentas en MT
en la base: `map-retry` 2, `map-last-retry` 5, `pingo-collar` 1,
`flex-1 items-center justify-center p-6 bg-background` 2,
`items-center gap-3 py-8` 1, `mt-1 text-2xs font-normal text-muted` 1,
`items-center rounded-xl bg-default p-3` 1, `text-base font-black` 12 (filas 13
y 14), `shrink text-xs font-bold text-foreground` 1, `size-2 rounded-full` 1,
`text-2xs font-semibold` 1, `bg-success` 1, `bg-surface px-3 py-2 shadow-sm` 1,
`width: 24` 1, `toHaveLength(4)` 1 (fila 11). Las apariciones en otros
ficheros (`pingo-collar`, `items-center gap-3 py-8`, `bg-success`,
`text-2xs font-semibold`, `size-2 rounded-full`, `flex-1 items-center justify-center p-6 bg-background`
en `reminders`) son de otras pantallas o de la variante por defecto de
`EmptyState`, que no cambia. Estructura: `map-loading` deja de ser un
`Skeleton` (que trae `entering` propio) y pasa a `View`; ningún test afirma su
tipo ni su `entering` (`R8 (mobile-design-drift)` solo mira `flex-1`).
`map-error` y `map-last-error` cambian de nodo (filas 1–5); el orden de hijos
cambia en las filas 11 y 12. `#61 R11 › conserva los cuatro tiles…` busca los
rótulos con `getByText` y no depende del orden.

| # | fichero › describe › it | Hoy afirma | Pasa a afirmar | R |
|---|---|---|---|---|
| 1 | MT › `R4: map resuelve la mascota seleccionada` › el `it.each` que espera `map-error`, pulsa `map-retry` y acaba en `map-no-pets` | pulsa `map-retry` | pulsa `map-error-action` | R11 |
| 2 | MT › `R1 (mobile-map-last-position-error-state)` › `muestra mensaje y Reintentar cuando last devuelve error` | `map-last-error` con el texto, `selectable` `true`, `map-last-retry` visible, `map-error` nulo | `map-last-error-title` con «Algo salió mal», sin aserción de `selectable`, `map-last-error-action` con «Reintentar», `map-error` nulo | R11 |
| 3 | MT › mismo describe › `Reintentar llama al refetch de last y recupera el mapa` | pulsa `map-last-retry` | pulsa `map-last-error-action` | R11 |
| 4 | MT › `R3 (mobile-map-last-position-error-state): cobertura total y exclusión mutua` › `it.each<LastPositionState>` | `map-last-retry` visible y pulsado | `map-last-error-action` visible y pulsado | R11 |
| 5 | MT › `R4 (mobile-map-last-position-error-state): unauthorized de pets` › `renderiza la rama de error de pets y dispara signOut` | `map-retry` visible | `map-error-action` visible | R11 |
| 6 | MT › `#116 R2` › `compone la cápsula con la receta exacta y sin esquina continua` | `className` `'flex-row items-center gap-2 self-start rounded-full border border-border bg-surface px-3 py-2 shadow-sm'` y `style` `undefined` | la `className` de R2 y `style.boxShadow` de longitud 2 | R2 |
| 7 | MT › `#116 R3` › `pinta el avatar de 24 sin foto` (título nuevo: `pinta el avatar de 28 sin foto`) | ancho y alto 24 | ancho y alto 28 | R2 |
| 8 | MT › `#116 R3` › `pinta la foto de la lista con su cacheKey` | `style` `{ width: 24, height: 24, borderRadius: 12 }` | `{ width: 28, height: 28, borderRadius: 14 }` | R2 |
| 9 | MT › `#116 R3` › `rotula el nombre de la lista en una línea` | `'shrink text-xs font-bold text-foreground'` | `'shrink text-15 font-extrabold text-foreground'` | R2 |
| 10 | MT › `#116 R4` › el `it.each` de tonos (6 filas) | punto `size-2 rounded-full ${dot}` con en línea `bg-success`; estado `text-2xs font-semibold ${text}` | punto `size-1.75 rounded-full ${dot}` con en línea `bg-accent`; estado `text-xs font-bold ${text}`; resto de filas igual | R2 |
| 11 | MT › `#116 R4` › `fija cuatro hijos en orden: avatar, nombre, punto, estado` (título nuevo: `fija tres hijos en orden: avatar, nombre, grupo del GPS`) | 4 hijos | `['map-pet-pill-avatar', 'map-pet-pill-name', 'map-pet-pill-gps']` | R2 |
| 12 | MT › `#116 R5` › `monta el tile de batería con valor y rótulo en ese orden` (título nuevo: `monta el tile de batería con rótulo y valor en ese orden`) | tile `'flex-1 items-center rounded-xl bg-default p-3'`, valor primero, rótulo `'mt-1 text-2xs font-normal text-muted'` | tile `'flex-1 gap-0.5 rounded-14 bg-default px-3 py-2.5'`, rótulo primero `'text-11 font-semibold text-muted'`, valor después | R5 |
| 13 | MT › `#116 R6` › el `it.each` de umbrales (6 filas), y `#116 R7` › `lee la batería del detalle y no de la lista` y `repinta la batería con el poll de 15 segundos` | `'text-base font-black text-accent-strong'` / `'text-base font-black text-warning-strong'` | `text-xl` en lugar de `text-base`, misma tinta | R5 |
| 14 | MT › `#116 R7` › los cuatro `it` (`…pendiente`, `…falla`, `…sin collar`, `ignora la batería de la última posición…`) | `'text-base font-black text-muted'` | `'text-xl font-black text-muted'` | R6 |
| 15 | MT › `#116 R8: el mapa no estrena animación` › `no importa Reanimated ni anima el punto` (título nuevo: `el punto del GPS no anima`) | el mapa no importa `react-native-reanimated` y el punto no anima | solo que `map-pet-pill-dot` es un `View` sin `entering` (la importación la exige R1) | R1 |
| 16 | MT › `#155 R4` › `queda en el sitio del vacío que sustituye` | padre `'flex-1 items-center justify-center p-6 bg-background'` | padre `'flex-1 items-center justify-center bg-background px-6 pt-15 pb-30'` | R12 |
| 17 | MT › `#159 R2` › `pinta la pose del collar, el título y la frase de Pingo` (título nuevo: `pinta la pose de Pingo, el título y la frase`) | `pingo-collar.webp` | `pingo-talk.webp` | R13 |
| 18 | MT › `#159 R2` › `queda en el sitio del texto que sustituye y sin mapa debajo` | hueco `'items-center gap-3 py-8'`, padre `'flex-1 items-center justify-center p-6 bg-background'` | hueco `'w-full items-center gap-3.5'`, padre `'flex-1 items-center justify-center bg-background px-6 pt-15 pb-30'` | R13 |
| 19 | ES › `%s pinta %i EmptyState` | fila `['src/screens/map/index.tsx', 2]` | `2 + 2 // #201 R11` | R11 |
| 20 | ES › `#159 R9: los estados sin collar no traen movimiento ni dependencias` | filas del mapa `'react-native-reanimated'`, `'\\bAnimated\\b'`, `'entering='` y `'MOTION_'` a 0 | esas cuatro filas del mapa se borran; la de `LayoutAnimation` se queda | R1, R13 |
| 21 | CC › `#177 R7.2` (inventario de `/rounded-16 bg-accent(?=[\s'"\`])/`) | sin el mapa | `+ 'screens/map/index.tsx': 1` | R13 |
| 22 | CC › `#177 R7.3` (objeto `radii` y cuenta de `rounded-16`) | sin el mapa | el mapa con 1 | R13 |
| 23 | CC › `#177 R7.4` (`const consumers = [...ctaFiles, 'screens/reminders/index.tsx'].sort()`, enmendado por #197) | sin el mapa | con `'screens/map/index.tsx'` | R13 |
| 24 | CC › `#177 R7.5` (inventarios `style=\{chunkyLip.primary…\}` y `chunkyLip\.primary\b`) | sin el mapa | el mapa con 1 en cada uno | R13 |
| 25 | LG › `#61 R4: el acento como tinta usa accent-strong` | `inkSites` `[join('screens', 'map', 'index.tsx'), 2]` y el total de `suma las trece ocurrencias que enumera la spec` | `2 - 1 // #201 R5` y el total `- 1 // #201 R5` | R5 |
| 26 | FN › `#197 R20: nadie monta todavía los cimientos` | fila `shadows` con importadores `[]` | `['screens/map/index.tsx']` | R2 |

Se comprobó que siguen verdes sin cambios: `#116 R2 › pinta la píldora como
hijo 0 de map-stats y la tarjeta como hijo 1` (busca `stat-speed` dentro del
hijo 1), `#62 R3` (el aviso sigue siendo `Card` con `style` objeto), `#61 R11`,
`#62 R15` (`TABULAR_NUMS` [mapa, 3 + 1]), `consistency-classnames`
(`CONTINUOUS_CORNER` [mapa, 4]), design-drift `'map' importa el Card compartido`,
`R7: no-owner deshabilitado y error visible` (`lost-mode-error` conserva sus
clases), `R2 (…last-position-error-state)` y `R3 › solo la rama de error de pets…`
(usan las raíces `map-error` / `map-last-error`, que siguen existiendo).

## Desviaciones conscientes del canvas

Lo que el canvas dibuja y esta feature no reproduce, cada una con su decisión:

| Canvas | Implementación | Decisión |
|---|---|---|
| `backdrop-filter: blur(20px)` en la píldora (×2 en `Mapa`) | Solo el fondo translúcido `bg-glass-surface-strong` | D1 |
| Inicial sobre ámbar en el avatar | `PetAvatar` 28 con foto o blobatar | D2 |
| Aviso sin ubicación con `box-shadow: var(--shadow)` y `rise` | `Card` con `shadow-sm`, sin subida | D5, D6 |
| Keyframe `pop 400ms ease-out 300ms` de los badges | `PopIn` (fade + muelle, 250 ms de espera) | D7 |
| Título, cuerpo y acción con `rise` a 100/160/220 ms | Entrada escalonada con muelle de `EmptyState` | D8 |
| Relleno de zona `rgba(23,130,85,0.12)` | `tab-pill` (0.14) | D11 |
| Marker, onda `ping`, etiqueta «Casa» y punto de inicio de ruta | Sin cambio (#192) | D12 |
| Barra de pestañas y `bottom: 104px` | `bottom: insets.bottom + 96`, barra sin cambio (#206) | D12 |
| `top: 60px` del aviso | `top: insets.top + 12` | D13 |
| `pulse 1.4s ease-in-out infinite` y bloque de valor de radio 6 | Pulso de `Skeleton` por defecto (1000 ms, opacidad mínima 0.5) y `rounded-4` | D14 |
| `role="status"` implícito de la carga | `accessibilityState={{ busy: true }}` (React Native no tiene rol `status`) | D19 |
| Pose de collar del canvas viejo en sin rastreo | Pose `talk` (el canvas pinta el collar en el badge) | D9 |

## Fuera de alcance

Clasificado viñeta a viñeta: «feature» tiene id en `feature_list.json`;
«decisión» queda cerrada aquí y solo se reabre si el humano cambia su D.

- **Feature #192**: marker, onda `ping`, etiqueta «Casa»
  con `shadows.label` y punto de inicio de la ruta. `pet-map.tsx` solo gana
  `polylineWidth` (R15).
- **Feature #206** (barra de pestañas): la barra flotante y el `bottom: 104px`
  que el canvas mide contra ella.
- **Feature #198** (Inicio): `InicioError` y cualquier cambio de Inicio. R14 no
  cambia nada de lo que Inicio ya pasa a `EmptyState`.
- **Feature #151**: absorbida por R3 (D15). Pasarla a `done` es cierre del
  leader, no de esta spec; aquí solo cambia la línea `status` de #201.
- **Decisión D8**: alinear la entrada de `EmptyState` hero con `rise`. Tocaría
  Inicio.
- **Decisión D1**: desenfoque real de la píldora. Se reabre solo si el smoke S2
  no la ve legible.
- **Decisión D5**: sombra del aviso sin ubicación.
- **Decisión D11**: token propio para el relleno de zona.
- Copy, i18n, backend, AWS y dependencias: nada. `ui-copy-table.ts`,
  `catalog.ts` y `package.json` no cambian.

## Cierre del humano

Smoke en dev build Android en el PC del humano (no Expo Go, no la VPS), con
#197 y #201 instalados, en tema claro y repetido en oscuro. Los tests no ven
nada de esta lista (supuestos en [[design]] § Supuestos).

| Id | R | Qué mirar |
|---|---|---|
| S1 | R1 | Al entrar en Mapa la píldora y la tarjeta suben juntas desde 14 px con fundido; con «Quitar animaciones» de Android aparecen quietas |
| S2 | R2 | La píldora se lee sobre el mapa de Google (calles y zona debajo), con sombra; sin rectángulo negro ni transparente. Si no se lee, D1 se reabre |
| S3 | R4, R5, R6 | Tarjeta sin borde con sombra flotante sobre el mapa; rótulo arriba y valor abajo; los guiones se ven grises |
| S4 | R7 | Botón de modo perdido rosa (`#FFF0F3` / oscuro `#39131A`), triángulo y texto rosa fuerte, esquinas de 14, sin labio y alto 50; la variante `danger-soft` no lo repinta |
| S5 | R8 | Con el teléfono sin red, cambiar el modo perdido: el error sale dentro de la tarjeta y TalkBack lo anuncia |
| S6 | R9 | Mascota con collar y sin posiciones: aviso arriba con icono de ubicación |
| S7 | R10 | Con red lenta, el esqueleto late con el mapa en gris claro; el bloque de valor tiene esquinas de 4 |
| S8 | R11 | Con el backend parado: Pingo con el badge rosa que aparece con pop y «Reintentar» con icono de recarga; al pulsar con el backend arriba, vuelve el mapa |
| S9 | R12, R13 | Cuenta sin mascotas y mascota sin collar: Pingo centrado por encima de la barra; badge verde del collar con labio |
| S10 | R15 | La ruta del día se ve más gruesa que antes (5 px) |

## Aprobación

Esta spec no enmienda `docs/ui-guidelines.md`: no hay casilla de enmienda de
la carta.

- [ ] Aprobado por humano (fecha: ____)

Cierre (no gate de implementación), una casilla por smoke:

- [ ] Smoke de R1 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
- [ ] Smoke de R2 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
- [ ] Smoke de R4, R5 y R6 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
- [ ] Smoke de R7 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
- [ ] Smoke de R8 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
- [ ] Smoke de R9 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
- [ ] Smoke de R10 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
- [ ] Smoke de R11 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
- [ ] Smoke de R12 y R13 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
- [ ] Smoke de R15 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
