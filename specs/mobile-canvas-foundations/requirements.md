---
feature: "mobile-canvas-foundations"
status: approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-canvas-foundations]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.

## Alcance

Ola 1 del plan `progress/plan_canvas-parity-2026-10-23.md`: los cimientos que
las specs de la ola 2 citarán por nombre. Cubre C01, C02, C03, C05 y C07 de
`progress/explore_canvas-parity-2026-10-21.md` §7 completos, y de C04
(interruptor) y C06 (cabecera en contenido) **solo el componente, sus tests y la
enmienda de la carta**: ninguna pantalla los monta y `app/_layout.tsx` no se
toca (plan §2, «Cablear es de cada pantalla»). Ninguna pantalla cambia de
maquetación; las únicas pantallas tocadas son las tres que pierden su
`border-b-N` (C03) y los cuatro ficheros del barrido de `tracking-tight` (C02).

Canvas: https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j. Manda la copia
congelada en `specs/mobile-canvas-foundations/canvas/` (18 artboards
`*.dc.html`, solo los que esta spec cita). Los tests de esta spec leen esa copia,
no el artefacto vivo.

Todas las rutas de código son relativas a `mobile-pet-tracker/` salvo que digan
otra cosa. Herramientas: `bun` y `bunx`, nunca `npm` ni `npx`. **Sin
dependencias nuevas** (`expo-linear-gradient` sigue vetado): todo sale de
`heroui-native`, `react-native-reanimated`, `reicon-react-native` y uniwind, ya
instalados.

## Decisiones

Ninguna decisión queda abierta. Las que el explore dejaba al humano se toman
aquí con su porqué; si el humano cambia alguna en el gate, la columna «Si cambia»
dice qué R-ids se reescriben.

| Id | Decisión | Defecto | Por qué | Si cambia |
|----|----------|---------|---------|-----------|
| D1 | Colores claros (C01) | Tema claro: `--border` y `--separator` pasan a `rgba(13,17,23,0.08)`; `--danger` y `--color-danger` a `#D92D20`; `--warning` y `--color-warning` a `#B54708`; `--warning-strong` a `#93370D`. El tema oscuro y `--success` no cambian. | Son los literales de los 18 artboards congelados. `--warning-strong` no está en el canvas, pero no puede quedarse: `#92610A` sobre el nuevo `warning-soft` compuesto (`#F4E3DA`) da 4.28:1 y rompe el AA de #61 R5. `#93370D` da 7.52 sobre `surface` y 6.03 sobre `#F4E3DA`. `--success` ya es el del canvas. | R1, R2 |
| D2 | Tipografía (C02) | Seis tokens nuevos en `@theme`: `--leading-body: 1.4`, `--leading-note: 1.45`, `--tracking-display: -0.5px`, `--tracking-section: 1.5px`, `--tracking-mono: 0.04em`, `--tracking-dialog: -0.01em`. `tracking-tight` se barre a `tracking-title` en los 4 ficheros de producción. Los interlineados en píxeles del canvas (14, 21, 32, 34) ya tienen utilidad (`leading-3.5`, `leading-5.25`, `leading-8`, `leading-8.5`) y 1.5 es `leading-normal`: no llevan token. | Un token por valor del canvas que la escala de Tailwind no tiene, con nombres que no chocan con los integrados (`tight`, `snug`, `normal`, `relaxed`, `loose`, `wide*`). `tracking-tight` es -0.025em y el canvas pide -0.02em en todos los títulos. Ninguno de los seis tokens se consume en #197: los consume la ola 2. | R3, R4, R21 |
| D3 | Catálogo de labios (C03) | `useChunkyLip()` crece de 3 a 11 claves (tabla de R6) y pide 7 tokens. Los 5 tokens nuevos (`lip-danger`, `lip-violet`, `lip-tile-violet`, `lip-tile-amber`, `lip-tile-blue`) valen lo mismo en los dos temas y solo existen en forma `--color-`. Los 5 `border-b-N` restantes migran a `boxShadow` y el cuerpo del botón toma el alto del canvas: «Editar» 36 (`h-9`), «Añadir comida» 50 (`h-12.5`). «Generar plan» sigue tonal y sin labio. | El labio dentro del alto (`border-b-N`) es lo que el canvas no hace: allí el labio cuelga fuera del cuerpo. El canvas no da un labio oscuro propio, así que los colores son los literales de los artboards en los dos temas, igual que #177 hizo con `lip` antes de tener variante oscura. «Generar plan» es pantalla de #200; `chunkyLip.violet` queda listo para ella. | R5 a R10 |
| D4 | Interruptor (C04) | Componente `ToggleSwitch` en `src/components/toggle-switch.tsx` que envuelve el `Switch` de `heroui-native`: raíz `h-7 w-12` (48x28), pulgar `h-5.5 w-5.5` (22) a 3 de cada borde, fondo `lip-gray` apagado y `accent` encendido. El pulgar conserva el blanco por defecto de heroui y pierde su sombra (`shadow-none`). No se cablea. | Envolver conserva la accesibilidad, el gesto y la animación de heroui, que #189 ya usa; un tema global del `Switch` cambiaría los 3 usos de golpe y eso es trabajo de cada pantalla. `accent-foreground` es `#FFFFFF` en los dos temas, así que el blanco por defecto ya es el del canvas. | R16, R17, R20 |
| D5 | Movimiento `rise` (C05) | `MOTION_RISE_OFFSET_Y = 14` y `MOTION_RISE_TIMING` (400 ms, `Easing.bezier(0, 0, 0.58, 1)`, `ReduceMotion.System`) en `theme/motion.ts`. `homeEntering` anima opacidad y `translateY` con ese timing; `HomeEntrance` no pasa `entering` bajo reduce motion. El escalonado sigue en 60 ms. | Es la curva literal del canvas (`rise 400ms ease-out`, 14 px). El canvas apaga toda animación bajo reduce motion (`animation:none`), así que se apaga también el fundido. La carta pide springs para lo que entra; el `rise` es una excepción nombrada en la Enmienda #197 porque el canvas es un timing. | R11, R12, R13, R21 |
| D6 | Cabecera en contenido (C06) | Componente `ScreenHeader` en `src/components/screen-header.tsx`: fila con `BackButton` (trazo 2.4, margen -10), eyebrow opcional, título de 26 (o 24) y accesorio opcional. `BackButton` gana `strokeWidth?: number`. No se cablea y `headerShown` no se toca. La línea D-H de la carta se conserva literal. | Es la cabecera literal de 14 artboards (`margin-left: -10px`, trazo 2.4, h1 26/900/-0.02em). Las pantallas que la adopten pondrán `headerShown: false` en su ruta en la ola 2; mientras, D-H y A11 siguen gobernando las demás. | R18, R19, R20, R21 |
| D7 | Sombras (C07) | Hook `useShadows()` en `src/theme/shadows.ts` con 10 claves `boxShadow` (tabla de R15) y 6 tokens `--color-shadow-*`. Solo `shadow-near` y `shadow-far` cambian con el tema (la sombra oscura del canvas es una sola capa). Se excluye el degradado inferior de NuevaMascota (`0 -10px 20px var(--bg)`). | `boxShadow` es lo que ya usa `useChunkyLip` y pasa los guards de la carta (no es `shadow*`/`elevation`). El degradado es un recurso de scroll de una sola pantalla, no una sombra. Meal-schedule y meals-history no importan `shadows.ts` (guard de #179 R13). | R14, R15, R20 |
| D8 | Candados contra el canvas | Un test nuevo, `src/__tests__/canvas-foundations.test.ts`, lee los artboards congelados y comprueba cada literal del canvas junto al valor de producción que lo traduce. | Un candado que solo compara producción con una constante copiada del propio código es tautológico; leer el `.dc.html` congelado lo ata al diseño. | R1, R3, R5, R11, R14, R16 |
| D9 | Smoke | Un único smoke humano en dev build Android al cierre (R23), sin bloquear la implementación. | Labios fuera del cuerpo, sombras y pulgar no se ven en jest. Interruptor y cabecera no están montados: el smoke los mira en Perfil y Zonas cuando la ola 2 los cablee, y en #197 solo verifica lo montado. | R23 |

## Base medida

Medida sobre `origin/main` 922a4036 desde `mobile-pet-tracker/`. Anclas por
contenido, nunca por número de línea. Si un valor no coincide antes de empezar,
la spec ha caducado: parar y avisar al leader.

```bash
cd mobile-pet-tracker
G=src/theme/global.css
grep -cF 'rgba(13,17,23,0.07)' $G            # 2  (--border y --separator claros)
grep -cF -- '--danger: #EF4444;' $G          # 1
grep -cF -- '--color-danger: #EF4444;' $G    # 1
grep -cF -- '--warning: #F59E0B;' $G         # 1
grep -cF -- '--color-warning: #F59E0B;' $G   # 1
grep -cF -- '--warning-strong: #92610A;' $G  # 1
grep -cF -- '--color-lip-' $G                # 2  (lip-gray claro y oscuro)
grep -cF -- '--color-shadow-' $G             # 0
grep -cF -- '--leading-' $G                  # 0
grep -cF -- '--tracking-' $G                 # 4  (title, caps, eyebrow, code)
grep -cF '#D92D20' $G                        # 0
grep -cF '#B54708' $G                        # 0
grep -cF '#93370D' $G                        # 0
git grep -c 'tracking-tight' -- src ':!**/__tests__/**' ':!*.test.ts' ':!*.test.tsx'
#   src/app/(tabs)/food.tsx:1  src/components/celebration.tsx:1
#   src/screens/health/index.tsx:1  src/screens/profile/index.tsx:1
git grep -c 'tracking-tight' -- ':(glob)src/**/__tests__/**' ':(glob)src/**/*.test.tsx'
#   src/__tests__/tab-headers-canvas.test.ts:2  src/app/(tabs)/__tests__/food.test.tsx:1
#   src/components/__tests__/celebration.test.tsx:1  src/screens/health/index.test.tsx:1
#   src/screens/profile/index.test.tsx:1
grep -cF 'border-b-3' src/screens/add-reminder/index.tsx       # 1
grep -cF 'border-black/25' src/screens/add-reminder/index.tsx  # 1
grep -cF 'border-b-5' src/screens/alerts/index.tsx             # 1
grep -cF 'border-b-5' src/screens/meal-schedule/index.tsx      # 2
grep -cF 'border-b-6' src/screens/meal-schedule/index.tsx      # 1
grep -cF 'border-black/25' src/screens/meal-schedule/index.tsx # 1
grep -cF 'useChunkyLip' src/screens/add-reminder/index.tsx     # 2  (import y llamada)
grep -cF 'useChunkyLip' src/screens/alerts/index.tsx           # 0
grep -cF 'useChunkyLip' src/screens/meal-schedule/index.tsx    # 0
grep -cF 'CONTINUOUS_CORNER' src/screens/meal-schedule/index.tsx # 3
grep -cF "'lip', 'lip-gray'" src/theme/chunky-lip.ts           # 1
grep -cF 'MOTION_RISE' src/theme/motion.ts                     # 0
grep -cF 'MOTION_SETTLE_SPRING' src/screens/home/home-entrance.tsx     # 2
grep -cF 'MOTION_ENTRANCE_OFFSET_Y' src/screens/home/home-entrance.tsx # 2
grep -cF 'MOTION_FADE_TIMING' src/screens/home/home-entrance.tsx       # 2
grep -cF 'strokeWidth' src/components/back-button.tsx          # 0
grep -cF 'headerShown' src/app/_layout.tsx                     # 2
grep -cF '## Enmienda #197' ../docs/ui-guidelines.md           # 0
grep -cF 'Título en contenido (D-H)' ../docs/ui-guidelines.md  # 1
node -e 'const p=require("./package.json");console.log(Object.keys(p.dependencies).length, Object.keys(p.devDependencies).length)'  # 44 8
test ! -e src/components/toggle-switch.tsx
test ! -e src/components/screen-header.tsx
test ! -e src/theme/shadows.ts
test ! -e src/__tests__/canvas-foundations.test.ts
test ! -e src/theme/__tests__/shadows.test.tsx
test ! -e src/components/__tests__/toggle-switch.test.tsx
test ! -e src/components/__tests__/screen-header.test.tsx
```

**Lo que no debe moverse:** el tema oscuro de `global.css` salvo los tokens
nuevos de R5 y R14; `--success`; `--color-lip` y `--color-lip-gray`;
`MOTION_ENTRANCE_OFFSET_Y`, `MOTION_SETTLE_SPRING`, `MOTION_FADE_TIMING` y las
constantes `MOTION_CELEBRATION_*` (las usan bienvenida, estado vacío y
celebración); `app/_layout.tsx` entero (`headerShown` sigue en 2); los
consumidores actuales de `BackButton` (login, registro, recuperar) y su icono sin
`strokeWidth`; la línea D-H de la carta, byte a byte;
`package.json` (44 dependencias, 8 de desarrollo).

## TestIDs

Nuevos (los fija el componente a partir del `testID` que recibe; la ola 2 los
cita):

- `ToggleSwitch`: `${testID}` en la raíz `Switch` y `${testID}-thumb` en
  `Switch.Thumb`.
- `ScreenHeader`: `${testID}` en la fila, `${testID}-back` en el `BackButton`,
  `${testID}-eyebrow` en el eyebrow (solo si hay `eyebrow`) y `${testID}-title`
  en el título (solo si hay `title`).

Se conservan sin cambios todos los `testID` de las pantallas tocadas:
`type-chip-<tipo>` y `advance-chip-<minutos>` (NuevoRecordatorio),
`<rowId>-ack` (Alertas), `meal-schedule-summary` y `add-meal-time-button`
(Horario).

## Requisitos funcionales

Abreviaturas de test (rutas bajo `mobile-pet-tracker/src/`):
CF `__tests__/canvas-foundations.test.ts` (nuevo) ·
GC `theme/__tests__/global-css.test.ts` ·
CL `theme/__tests__/chunky-lip.test.tsx` ·
MT `theme/__tests__/motion.test.ts` ·
SW `theme/__tests__/shadows.test.tsx` (nuevo) ·
TS `components/__tests__/toggle-switch.test.tsx` (nuevo) ·
HD `components/__tests__/screen-header.test.tsx` (nuevo) ·
BB `components/__tests__/back-button.test.tsx` ·
HE `screens/home/home-entrance.test.tsx` ·
HI `screens/home/index.test.tsx` ·
AR `screens/add-reminder/index.test.tsx` ·
AL `screens/alerts/index.test.tsx` ·
MS `screens/meal-schedule/index.test.tsx` ·
CC `__tests__/chunky-cta-canvas-fidelity.test.ts` ·
CN `__tests__/consistency-classnames.test.ts` ·
AC `__tests__/alerts-canvas-fidelity.test.ts` ·
TH `__tests__/tab-headers-canvas.test.ts`.

Cada `describe` nuevo se titula `#197 R<n>: …` y cada `it` nuevo empieza por
`#197 R<n>`. Un `it` existente que cambia de aserción conserva su nombre y
añade el sufijo ` (enmendado por #197 R<n>)`. CF lee los artboards con
`readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-foundations/canvas/<Artboard>.dc.html'), 'utf8')`
y, en cada fila, comprueba **las dos cosas**: que el artboard contiene el
literal del canvas y que producción declara el valor que lo traduce. Una fila
que solo mire producción no cumple su requisito.

### C01 — Colores claros

- **R1**: THE SYSTEM SHALL declarar en el bloque `@variant light` de
  `src/theme/global.css` exactamente: `--border: rgba(13,17,23,0.08);`,
  `--separator: rgba(13,17,23,0.08);`, `--danger: #D92D20;`,
  `--color-danger: #D92D20;`, `--warning: #B54708;`, `--color-warning: #B54708;`
  y `--warning-strong: #93370D;`, cada clave una sola vez en el bloque, y
  SHALL dejar el bloque `@variant dark` con los mismos valores que hoy
  (`--danger` y `--color-danger` `#F87171`, `--warning`, `--color-warning` y
  `--warning-strong` `#FBBF24`, `--border` y `--separator` `rgba(255,255,255,0.08)`).
  - Test: CF › `#197 R1` (`#197 R1: cada color claro es el literal del canvas`,
    `it.each` con las filas `--border:rgba(13,17,23,0.08)`,
    `--danger:#D92D20`, `--warning:#B54708` contra `Alertas.dc.html`, y
    producción `border`, `separator`, `danger`, `color-danger`, `warning`,
    `color-warning` del bloque claro) y `#197 R1: el tema oscuro no cambia`.
    GC › `R1: global.css define los tokens light exactos del diseño` ›
    `mapea la paleta Figma Make a los tokens de heroui-native` y
    `R2: global.css define la paleta dark derivada del diseño` ›
    `materializa los colores semánticos para el resolver JS en %s`, ambos
    enmendados.
- **R2**: THE SYSTEM SHALL mantener el AA de #61 R5 con los nuevos valores:
  `--warning-strong` claro `#93370D` da ≥ 7.5:1 sobre `#FFFFFF` y ≥ 6.0:1
  sobre el `warning-soft` compuesto, que pasa a `#F4E3DA`
  (`#B54708` al 15 % sobre blanco); `--danger` claro `#D92D20` da ≥ 4.5:1 sobre
  `#FFFFFF`; y los mínimos claros de #64 R4 (`expectedStateSurfaceMinima.light`)
  pasan a ámbar 5.7, violeta 10.5 y rosa 5.0, con azul 9.4, verde 3.5 y neutro
  8.5 sin cambio.
  - Test: GC › `composedSurfaces.light.warningSoft` pasa de `'#FEF0DA'` a
    `'#F4E3DA'`; `#61 R5: token warning-strong con AA sobre surface y warning-soft` ›
    `define la variante AA del ámbar en %s`, `pasa AA sobre bg-surface y bg-warning-soft en %s`
    y `conserva el ámbar puro de iconos y rellenos en %s` (fila clara
    `#93370D`, `#93370D`, `#B54708`), y `#64 R4: ninguna categoría se confunde con otra ni con un token de estado` ›
    `separa superficies y tintas de los tokens de estado en %s`, todos
    enmendados. CF › `#197 R2: el ámbar fuerte pasa AA sobre surface y sobre el warning-soft compuesto`
    (calcula el contraste con los valores leídos de `global.css`).

### C02 — Tracking e interlineado

- **R3**: THE SYSTEM SHALL declarar dentro de `@theme` de `global.css`, cada uno
  una sola vez y a continuación de `--tracking-code: 0.14em;`:
  `--tracking-display: -0.5px;`, `--tracking-section: 1.5px;`,
  `--tracking-mono: 0.04em;`, `--tracking-dialog: -0.01em;`,
  `--leading-body: 1.4;` y `--leading-note: 1.45;`, sin tocar
  `--tracking-title`, `--tracking-caps`, `--tracking-eyebrow` ni
  `--tracking-code`, y sin declarar ningún `--text-*--line-height`.
  - Test: CF › `#197 R3: cada tracking e interlineado nuevo es el literal del canvas`
    (`it.each`: `letter-spacing: -0.5px` en `Inicio`, `letter-spacing: 1.5px`
    en `Inicio`, `letter-spacing: .04em` en `VincularVinculado`,
    `letter-spacing: -0.01em` en `ZonasEliminar`, `line-height: 1.4` en
    `EditorZona`, `line-height: 1.45` en `Zonas`, cada uno contra su token de
    `@theme`). GC › `#197 R3: declara cada token de tipografía una sola vez`
    (cuenta `--tracking-display:` … `--leading-note:` = 1 cada uno en todo el
    fichero; `#173 R2.3` y `#174 R1` siguen verdes sin tocarse).
- **R4**: THE SYSTEM SHALL no contener `tracking-tight` en ningún fichero de
  producción de `src/`, y SHALL usar `tracking-title` en el mismo `className`
  donde estaba, en `app/(tabs)/food.tsx`, `components/celebration.tsx`,
  `screens/health/index.tsx` y `screens/profile/index.tsx` (el resto del
  `className` intacto; el título de pestaña queda
  `text-3xl font-black tracking-title text-foreground`).
  - Test: CF › `#197 R4: ningún fichero de producción usa tracking-tight`.
    TH › `TAB_TITLE_168` pasa a `'text-3xl font-black tracking-title text-foreground'`
    y su regex hermana cambia `tracking-tight` por `tracking-title`;
    `#168 R1` › `pinta una ocurrencia del literal en cada fichero de pestaña`
    y `limita el literal a las tres pestañas y a la celebración` enmendados.
    `#168 R1` › `pinta el título grande ($name)` de
    `app/(tabs)/__tests__/food.test.tsx`, `screens/profile/index.test.tsx` y
    `screens/health/index.test.tsx`, y
    `components/__tests__/celebration.test.tsx` › `#171 R20` ›
    `R20.4 el título lleva el tracking y el margen del artboard`, enmendados.
    AC › `#174 R12: inventarios` › la fila `tracking-title` añade
    `app/(tabs)/food.tsx`, `components/celebration.tsx`,
    `screens/health/index.tsx`, `screens/profile/index.tsx` y
    `components/screen-header.tsx` (R19), en orden de `.sort()`.

### C03 — Labios

- **R5**: THE SYSTEM SHALL declarar en **los dos** bloques `@variant` de
  `global.css`, justo después de `--color-lip-gray:`, y solo en forma
  `--color-`: `--color-lip-danger: #9F1F15;`,
  `--color-lip-violet: rgba(91,63,163,0.35);`,
  `--color-lip-tile-violet: rgba(117,73,247,0.18);`,
  `--color-lip-tile-amber: rgba(165,94,7,0.16);` y
  `--color-lip-tile-blue: rgba(7,104,224,0.16);`, con el mismo valor en los dos
  temas y una sola vez por bloque.
  - Test: CF › `#197 R5: cada labio nuevo es el literal del canvas`
    (`it.each`: `0 4px 0 #9F1F15` en `Recordatorios`,
    `0 4px 0 rgba(91,63,163,0.35)` en `HorarioComidas`,
    `inset 0 -4px 0 rgba(117,73,247,0.18)`, `inset 0 -4px 0 rgba(165,94,7,0.16)`
    e `inset 0 -4px 0 rgba(7,104,224,0.16)` en `Inicio`). GC ›
    `#197 R5: declara los labios nuevos en los dos temas` (`it.each` light y
    dark; `toMatchObject` con los cinco valores, `split` = 2 por clave y
    `not.toHaveProperty` de cada forma corta, p. ej. `'lip-danger'`).
- **R6**: WHEN una pantalla llama a `useChunkyLip()` THE SYSTEM SHALL pedir
  `useThemeColors(['lip', 'lip-gray', 'lip-danger', 'lip-violet', 'lip-tile-violet', 'lip-tile-amber', 'lip-tile-blue'])`
  en ese orden y SHALL devolver, memorizado con `useMemo` sobre los siete
  colores, un objeto con exactamente estas 11 claves (tipo exportado
  `ChunkyLip = Record<'danger' | 'hero' | 'neutral' | 'neutralCompact' | 'primary' | 'primaryCompact' | 'summary' | 'tileAmber' | 'tileBlue' | 'tileViolet' | 'violet', ViewStyle>`),
  cada una `{ boxShadow: [{ offsetX: 0, offsetY, blurRadius: 0, spreadDistance: 0, color }] }`
  y, en las tres `tile*`, con `inset: true` como última clave del objeto de sombra:

  | Clave | `offsetY` | `color` | Literal del canvas (artboard) |
  |-------|-----------|---------|-------------------------------|
  | `danger` | 4 | `lip-danger` | `0 4px 0 #9F1F15` (Recordatorios) |
  | `hero` | 6 | `lip` | `0 6px 0 var(--lip)` (Nutricion) |
  | `neutral` | 4 | `lip-gray` | `0 4px 0 var(--lip-gray)` (HorarioComidas) |
  | `neutralCompact` | 3 | `lip-gray` | `0 3px 0 var(--lip-gray)` (Alertas) |
  | `primary` | 4 | `lip` | `0 4px 0 var(--lip)` (Inicio) |
  | `primaryCompact` | 3 | `lip` | `0 3px 0 var(--lip)` (NuevoRecordatorio) |
  | `summary` | 5 | `lip` | `0 5px 0 var(--lip)` (HorarioComidas) |
  | `tileAmber` | -4, `inset` | `lip-tile-amber` | `inset 0 -4px 0 rgba(165,94,7,0.16)` (Inicio) |
  | `tileBlue` | -4, `inset` | `lip-tile-blue` | `inset 0 -4px 0 rgba(7,104,224,0.16)` (Inicio) |
  | `tileViolet` | -4, `inset` | `lip-tile-violet` | `inset 0 -4px 0 rgba(117,73,247,0.18)` (Inicio) |
  | `violet` | 4 | `lip-violet` | `0 4px 0 rgba(91,63,163,0.35)` (HorarioComidas) |

  `primary`, `primaryCompact` y `neutral` conservan su forma actual.
  - Test: CL › `#177 R2.1: pide los dos tokens del labio (enmendado por #197 R6)`
    (la lista de siete y las 11 claves en orden de `.sort()`; el tipo
    `LipStyles` del test pasa a las 11 claves). CL ›
    `#197 R6: forma de %s` (`it.each` con las 8 claves nuevas y la forma
    literal de la tabla con colores `--color-<token>` del doble). CF ›
    `#197 R6: cada variante de labio sale de su artboard` (`it.each` con las
    11 filas de la tabla: el artboard contiene el literal y `chunky-lip.ts`
    contiene `offsetY: <n>` para esa clave; se lee el fuente, sin renderizar).
    `#177 R2.5`, `R2.6` y `R2.7` siguen verdes.
- **R7**: WHILE un chip de tipo o de antelación de NuevoRecordatorio está
  seleccionado THE SYSTEM SHALL pintarlo con
  `SELECTED_CHIP = 'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent'`
  y `style={chunkyLip.primaryCompact}`; WHILE no está seleccionado SHALL pasarle
  `style={undefined}`. Afecta a los `Pressable` `type-chip-${reminderType}` y
  `advance-chip-${option.minutes}` de `src/screens/add-reminder/index.tsx`,
  que ya llama a `useChunkyLip()`.
  - Test: AR › `#178 R10` › `pinta Vacuna seleccionada con cápsula, labio y texto sin emoji`
    e `invierte las recetas al seleccionar Otro`, y `#123 R5` ›
    `abre en el 24, con el mínimo en el instante actual y la hora a las 09:00`,
    enmendados (el seleccionado lleva el `style` del doble de `useChunkyLip`
    para `primaryCompact`; el no seleccionado, `style` indefinido; ningún
    `className` contiene `border-b-3` ni `border-black/25`).
- **R8**: WHILE una fila de Alertas está abierta THE SYSTEM SHALL pintar su
  `Button` `${rowId}-ack` con
  `className="h-8.5 rounded-10 border-2 border-lip-gray bg-surface px-3"` y
  `style={chunkyLip.neutralCompact}`, conservando `variant="secondary"`,
  `hitSlop={TOUCH_SLOP}`, `isDisabled` y `onPress`. `src/screens/alerts/index.tsx`
  importa `useChunkyLip` de `../../theme/chunky-lip` y lo llama una vez en el
  componente de pantalla.
  - Test: AL › `#78 R6` › el `it.each` del ack y
    `alterna el tercer hijo entre ack y la píldora traducida (enmendado por #174 R7) (enmendado por #174 R8)`,
    enmendados. CN › `#174 R8: el ack de fila es el secundario compacto`
    enmendado.
- **R9**: THE SYSTEM SHALL pintar en `src/screens/meal-schedule/index.tsx`,
  que importa y llama a `useChunkyLip()`:
  - el `View` `meal-schedule-summary` con
    `className="gap-2 rounded-24 bg-accent p-4"` y
    `style={[CONTINUOUS_CORNER, chunkyLip.summary]}`;
  - cada `Button` `meal-time-edit-${index}` con
    `className="h-9 rounded-10 border-2 border-lip-gray bg-surface px-3.5"` y
    `style={chunkyLip.neutralCompact}`;
  - el `Button` `add-meal-time-button` con
    `className="h-12.5 flex-1 rounded-14 border-2 border-lip-gray bg-surface"` y
    `style={chunkyLip.neutral}`;
  - `generate-plan-button` sin cambios.
  - Test: MS › `#147 R4` › `el owner ve Editar en cada fila y Añadir comida bajo la lista`,
    `#179 R5` › `compone el resumen con eyebrow y tres columnas de valor y etiqueta`,
    `#179 R6` › `pinta los valores del segundo plan en sus propias columnas` y
    `#179 R7` › `el dueño ve Añadir y Generar en ese orden fuera de los horarios`,
    enmendados. CN › `#62 R14` › `%s importa y aplica sus %i esquinas …`
    (fila de Horario: el literal `style={CONTINUOUS_CORNER}` pierde 1),
    `fusiona la esquina una vez y la entrega a las dos ramas de Card …` y
    `#62 R15` › `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban …`,
    enmendados con el mismo `- 1`.
- **R10**: THE SYSTEM SHALL no contener `border-b-3`, `border-b-5`,
  `border-b-6` ni `border-black/25` en ningún fichero de producción de `src/`,
  y SHALL listar `screens/alerts/index.tsx` y `screens/meal-schedule/index.tsx`
  entre los consumidores de `useChunkyLip`.
  - Test: CF › `#197 R10: ningún labio vive dentro del alto` (cuenta 0 para
    las cuatro clases con `(?<![\w-])<clase>\b`). CC › `#177 R7.1`, `R7.4`,
    `R7.5`, `R8.1`, `R8.2`, `R8.3`, `R11.1` y `R12.1/R12.2/R12.3`; CN ›
    `#166 R2` y `#166 R3`; AC › `#174 R12` (fila `border-b-5` → `[]`) y
    `declara border-b-5 una sola vez` (→ 0); detalle en «Candados que esta
    feature revierte».

### C05 — Movimiento `rise`

- **R11**: THE SYSTEM SHALL exportar de `src/theme/motion.ts`
  `MOTION_RISE_OFFSET_Y = 14` y
  `MOTION_RISE_TIMING = { duration: MOTION_SURFACE_MS, easing: Easing.bezier(0, 0, 0.58, 1), reduceMotion: ReduceMotion.System }`,
  sin cambiar ninguna otra exportación.
  - Test: MT › `#197 R11: declara el rise del canvas: 14 px y 400 ms ease-out`
    (`toBe(14)`; `toEqual({ duration: 400, easing: { bezier: [0, 0, 0.58, 1] }, reduceMotion: ReduceMotion.System })`,
    con literales en el test). MT › `#152 R1` ›
    `no exporta nada más (enmendado por #195 R13) (enmendado por #197 R11)`
    (37 claves: `MOTION_RISE_OFFSET_Y` y `MOTION_RISE_TIMING` entre
    `MOTION_POP_SPRING` y `MOTION_SETTLE_SPRING`). CF ›
    `#197 R11: el rise es el del canvas` (`Inicio.dc.html` contiene
    `@keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`
    y `animation: rise 400ms ease-out`).
- **R12**: WHEN `homeEntering(delayMs, offsetY)` construye la entrada THE SYSTEM
  SHALL partir de `{ opacity: 0, transform: [{ translateY: offsetY }] }` y
  animar `opacity` a 1 y `translateY` a 0 con
  `withDelay(delayMs, withTiming(<valor>, MOTION_RISE_TIMING), ReduceMotion.System)`;
  `src/screens/home/home-entrance.tsx` deja de importar `MOTION_SETTLE_SPRING`,
  `MOTION_FADE_TIMING` y `MOTION_ENTRANCE_OFFSET_Y`.
  - Test: HE › `#152 R3` › `parte invisible y desplazada y llega opaca y en su sitio`
    y `no anima nada hasta que se invoca`; `#152 R4` ›
    `el índice 0 entra sin espera y desplazado 12` (renombrado a
    `… desplazado 14`) y `el índice 5 espera 300 ms`, enmendados.
- **R13**: WHILE reduce motion está activo THE SYSTEM SHALL renderizar
  `HomeEntrance` con `entering={undefined}`; WHILE no lo está SHALL pasar
  `entering={homeEntering(index * MOTION_STAGGER_MS, MOTION_RISE_OFFSET_Y)}`.
  - Test: HE › `#152 R4` ›
    `bajo reduce motion conserva el fundido y el escalonado y no desplaza`
    (renombrado a `bajo reduce motion no anima la entrada`, enmendado). HI ›
    `#190 R1` › `pinta la entrada y su único hijo con actividad $kind`
    (`translateY` 14), `#190 R7` ›
    `parte de translateY cero, conserva el fundido y no añade escala a la burbuja (enmendado por #195 R16)`
    (`entering` indefinido bajo reduce motion) y `#152 R7` ›
    `funde igual bajo reduce motion` (renombrado a
    `no anima la entrada bajo reduce motion`; asierta
    `expect.objectContaining({ duration: 400, reduceMotion: ReduceMotion.System })`
    sin reduce motion), enmendados.

### C07 — Sombras

- **R14**: THE SYSTEM SHALL declarar en los dos bloques `@variant` de
  `global.css`, después de los labios de R5 y solo en forma `--color-`:
  `--color-shadow-near` (claro `rgba(13,17,23,0.04)`, oscuro `rgba(0,0,0,0.4)`),
  `--color-shadow-far` (claro `rgba(13,17,23,0.06)`, oscuro `rgba(0,0,0,0)`),
  y con el mismo valor en los dos temas `--color-shadow-10: rgba(13,17,23,0.10);`,
  `--color-shadow-12: rgba(13,17,23,0.12);`, `--color-shadow-14: rgba(13,17,23,0.14);`
  y `--color-shadow-25: rgba(13,17,23,0.25);`, una vez por bloque.
  - Test: GC › `#197 R14: declara las sombras en los dos temas` (`it.each`
    light y dark). CF › `#197 R14: cada color de sombra es el del canvas`
    (`--shadow:0 1px 2px rgba(13,17,23,0.04),0 8px 24px rgba(13,17,23,0.06)` y
    `0 1px 2px rgba(0,0,0,0.4)` en `Inicio`; `0 -8px 24px rgba(13,17,23,0.10)`
    en `EditorZona`; `0 10px 30px rgba(13,17,23,0.12)` en `Inicio`;
    `0 12px 32px rgba(13,17,23,0.14)` en `Mapa`;
    `0 12px 40px rgba(13,17,23,0.25)` en `ZonasEliminar`).
- **R15**: WHEN un componente llama a `useShadows()` (exportado de
  `src/theme/shadows.ts` junto con el tipo `Shadows`) THE SYSTEM SHALL pedir
  `useThemeColors(['shadow-near', 'shadow-far', 'shadow-10', 'shadow-12', 'shadow-14', 'shadow-25', 'background', 'accent'])`
  y SHALL devolver, memorizado con `useMemo` sobre esos ocho colores, estas 10
  claves, cada una `{ boxShadow: [...] }` con objetos
  `{ offsetX: 0, offsetY, blurRadius, spreadDistance, color }`:

  | Clave | Capas (`offsetY`, `blurRadius`, `spreadDistance`, `color`) | Literal del canvas (artboard) |
  |-------|------------------------------------------------------------|-------------------------------|
  | `card` | (1, 2, 0, `shadow-near`), (8, 24, 0, `shadow-far`) | `--shadow` (todos) |
  | `dialog` | (12, 40, 0, `shadow-25`) | `0 12px 40px rgba(13,17,23,0.25)` (ZonasEliminar) |
  | `floating` | (12, 32, 0, `shadow-14`) | `0 12px 32px rgba(13,17,23,0.14)` (Mapa) |
  | `label` | (2, 8, 0, `shadow-12`) | `0 2px 8px rgba(13,17,23,0.12)` (Mapa) |
  | `marker` | (4, 12, 0, `shadow-25`) | `0 4px 12px rgba(13,17,23,0.25)` (Mapa) |
  | `ring` | (0, 0, 3, `background`), (0, 0, 5, `accent`) | `0 0 0 3px var(--bg), 0 0 0 5px var(--accent)` (Nutricion) |
  | `segment` | (2, 6, 0, `shadow-10`) | `0 2px 6px rgba(13,17,23,0.10)` (NuevaMascota) |
  | `sheet` | (-8, 24, 0, `shadow-10`) | `0 -8px 24px rgba(13,17,23,0.10)` (EditorZona) |
  | `tabBar` | (10, 30, 0, `shadow-12`) | `0 10px 30px rgba(13,17,23,0.12)` (Inicio) |
  | `toast` | (2, 8, 0, `shadow-10`) | `0 2px 8px rgba(13,17,23,0.10)` (PesoRegistrado) |

  - Test: SW (mismo patrón que CL: doble de `../use-theme-colors` que devuelve
    `--color-<token>`) › `#197 R15: pide los ocho colores`, `#197 R15: forma de %s`
    (`it.each` de las 10 filas con la forma literal),
    `#197 R15: conserva la referencia aunque la lista de colores sea nueva` y
    `#197 R15: re-resuelve las sombras cuando cambian los colores`. CF ›
    `#197 R15: cada sombra sale de su artboard` (`it.each` de las 10 filas:
    el artboard contiene el literal).

### C04 — Interruptor (sin cablear)

- **R16**: THE SYSTEM SHALL exportar `ToggleSwitch` de
  `src/components/toggle-switch.tsx` con props
  `{ testID: string; isSelected: boolean; onSelectedChange: (isSelected: boolean) => void }`
  más `isDisabled`, `accessibilityLabel`, `hitSlop` y `style` opcionales
  (tipados con `Pick<ComponentProps<typeof Switch>, 'isDisabled' | 'accessibilityLabel' | 'hitSlop' | 'style'>`),
  y SHALL renderizar `<Switch>` de `heroui-native` con esos props pasados uno a
  uno (sin atributo spread: #187 R1 lo cuenta como `className` opaco),
  `className="h-7 w-12"` y
  `animation={{ backgroundColor: { value: [lipGray, accent] } }}` con
  `const [lipGray, accent] = useThemeColors(['lip-gray', 'accent'])`; y, como
  único hijo,
  `<Switch.Thumb testID={`${testID}-thumb`} className="h-5.5 w-5.5 rounded-full shadow-none" animation={{ left: { value: 3 } }} />`.
  - Test: TS › `#197 R16: pinta la raíz de 48x28 con lip-gray y accent`
    (props de la raíz por `testID`: `className`, `animation`, `isSelected`,
    `accessibilityLabel`, `hitSlop`, `style`, `isDisabled`) y
    `#197 R16: pinta el pulgar de 22 a 3 del borde y sin sombra` (props de
    `${testID}-thumb`). CF › `#197 R16: el interruptor es el del canvas`
    (`Zonas.dc.html` contiene
    `width: 48px; height: 28px; border-radius: 999px; background: var(--lip-gray)`,
    `left: 3px; top: 3px; width: 22px; height: 22px; border-radius: 50%; background: #FFFFFF`
    y `background: var(--accent)`; `toggle-switch.tsx` contiene `h-7 w-12`,
    `h-5.5 w-5.5` y `left: { value: 3 }`).
- **R17**: WHEN el usuario pulsa un `ToggleSwitch` habilitado THE SYSTEM SHALL
  llamar a `onSelectedChange` una vez con `!isSelected`; IF `isDisabled` es
  `true` THEN THE SYSTEM SHALL no llamarlo. El componente no guarda estado:
  `isSelected` manda.
  - Test: TS › `#197 R17: al pulsar apagado llama con true`,
    `#197 R17: al pulsar encendido llama con false` y
    `#197 R17: deshabilitado no llama` (`await fireEvent.press` sobre el
    `testID` raíz; RNTL 14 asíncrono).

### C06 — Cabecera en contenido (sin cablear)

- **R18**: THE SYSTEM SHALL aceptar en `BackButton`
  (`src/components/back-button.tsx`) un prop opcional `strokeWidth?: number`
  que pasa tal cual a `ChevronLeft`; sin el prop, el icono recibe
  `strokeWidth` indefinido (el defecto de reicon) y nada más cambia.
  - Test: BB › `#197 R18: pasa el trazo al chevron` (con `strokeWidth={2.4}` el
    icono recibe 2.4) y `#197 R18: sin trazo no lo fija` (indefinido). Los
    `#172 R2` siguen verdes sin tocarse.
- **R19**: THE SYSTEM SHALL exportar `ScreenHeader` de
  `src/components/screen-header.tsx` con props
  `{ testID: string; backFallback: Href; title?: string; eyebrow?: string; size?: 24 | 26; accessory?: ReactNode }`
  (`size` por defecto 26) y SHALL renderizar, en este orden:
  - `<View testID={testID} className="flex-row items-center gap-2">`;
  - `<View className="-ml-2.5"><BackButton testID={`${testID}-back`} fallback={backFallback} strokeWidth={2.4} /></View>`;
  - `<View className="flex-1">` con, si hay `eyebrow`, un `Text` de React Native
    `testID={`${testID}-eyebrow`}` y
    `className="text-11 font-extrabold uppercase tracking-eyebrow text-muted"`,
    y, si hay `title`, un `Text` de React Native `testID={`${testID}-title`}`,
    `accessibilityRole="header"` y `className` igual a
    `'text-26 font-black tracking-title text-foreground'` (26) o
    `'text-24 font-black tracking-title text-foreground'` (24), elegido de un
    mapa literal `{ 24: …, 26: … }` (nada de plantillas: uniwind no ve
    clases compuestas);
  - `accessory` tal cual, si existe, como último hijo de la fila.
  - Test: HD › `#197 R19: pinta volver, título de 26 y nada más`,
    `#197 R19: añade el eyebrow encima del título`,
    `#197 R19: el título de 24 cambia solo el tamaño`,
    `#197 R19: coloca el accesorio al final de la fila`,
    `#197 R19: volver usa el fallback y el trazo 2.4` (doble de
    `../back-button` que expone `fallback` y `strokeWidth`) y
    `#197 R19: sin título ni eyebrow solo queda volver`. CF ›
    `#197 R19: la cabecera es la del canvas` (`Documentos.dc.html` contiene
    `margin-left: -10px`, `stroke-width="2.4"`,
    `font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--muted)`
    y `font-size: 26px; font-weight: 900; letter-spacing: -0.02em`;
    `screen-header.tsx` contiene `-ml-2.5` y `strokeWidth={2.4}`).
    `profile-canvas-fidelity.test.ts` › `#173 R2.4` ›
    `reserva text-26 al nombre de la mascota en Perfil …` enmendado: añade
    `components/screen-header.tsx`.
- **R20**: THE SYSTEM SHALL no importar `toggle-switch`, `screen-header` ni
  `theme/shadows` desde ningún fichero de producción de `src/` salvo su propia
  definición, y SHALL dejar `src/app/_layout.tsx` sin cambios.
  - Test: CF › `#197 R20: nadie monta todavía los cimientos` (`it.each` de los
    tres módulos: los ficheros de producción que contienen
    `from '<…>/toggle-switch'`, `from '<…>/screen-header'` o
    `from '<…>/shadows'` son `[]`) y
    `#197 R20: el layout raíz no cambia` (`app/_layout.tsx` contiene
    `headerShown` exactamente 2 veces y no contiene `ScreenHeader`).
    `legibility-classnames.test.ts` ›
    `reserva las peticiones de accent a las huellas de EmptyState (enmendado por #176 R5)`
    enmendado: la lista pasa a
    `['components/empty-state.tsx', 'components/toggle-switch.tsx', 'theme/shadows.ts']`.

### Carta, grep-limpio y smoke

- **R21**: THE SYSTEM SHALL enmendar `docs/ui-guidelines.md` así:
  - la línea que empieza por `Tracking fuera de la escala de Tailwind` añade,
    tras `` `--tracking-eyebrow: 0.08em` ``, el texto
    `` , `--tracking-code: 0.14em`, `--tracking-display: -0.5px`, `--tracking-section: 1.5px`, `--tracking-mono: 0.04em`, `--tracking-dialog: -0.01em` (#197) ``
    y conserva el resto;
  - justo debajo, una línea nueva que empieza por
    `   Interlineado fuera de la escala de Tailwind (fidelidad al canvas, #197):`
    con el texto de design.md § «Texto canónico de la Enmienda #197», bloque
    «Línea de interlineado»;
  - en el punto 13, las líneas del **Chip seleccionado**, los
    **Secundarios de Horario** y el **Secundario compacto de fila** se
    sustituyen por las de design.md (bloque «Punto 13»), sin ningún
    `border-b-N` ni `border-black/25`;
  - al final del fichero, tras la Enmienda #195, la sección
    `## Enmienda #197 — cimientos del canvas` con el texto canónico de
    design.md, una sola vez, y su casilla
    `- [ ] Enmienda #197 aprobada por humano`;
  - la línea D-H (`- **Título en contenido (D-H).** …`) queda byte a byte igual.
  - Test: CF › `#197 R21: la carta declara los tokens de tipografía`,
    `#197 R21: la carta declara el interlineado`,
    `#197 R21: el punto 13 describe los labios por estilo`,
    `#197 R21: la enmienda está una sola vez y con su casilla` (regex tolerante
    `/- \[[ xX]\] Enmienda #197 aprobada por humano/`) y
    `#197 R21: D-H sigue intacta`. AC › `#174 R11` ›
    `declara el secundario compacto y el reintento sin labio (enmendado por #180 R12)`,
    design-drift `#178 R2` › `C: coloca la receta del chip seleccionado antes de Sin labio`
    y `#179 R2` › `sitúa la receta de secundarios de Horario antes de Sin labio`,
    y la constante `preservedLines` de CC, enmendados con las líneas nuevas.
- **R22**: THE SYSTEM SHALL dejar grep-limpios los ficheros nuevos y tocados
  (`toggle-switch.tsx`, `screen-header.tsx`, `shadows.ts`, `chunky-lip.ts`,
  `motion.ts`, `home-entrance.tsx`, `back-button.tsx` y las tres pantallas de
  R7 a R9): sin hex fuera de `src/theme/` (los comentarios citan
  `#197 R<n>`), sin `StyleSheet.create`, sin emoji, sin clases arbitrarias
  `[…]`, sin `shadow*`/`elevation` de React Native fuera de `boxShadow`, y sin
  cambiar `package.json` ni `bun.lock`.
  - Test: CF › `#197 R22: %s es grep-limpio` (`it.each` de los ficheros) y
    `#197 R22: no añade dependencias` (44 y 8). Los guards existentes de
    design-drift (`#167 R14`) y de #179 R13 siguen verdes.
- **R23**: WHEN la implementación está aprobada por el reviewer THE SYSTEM SHALL
  pasar un smoke humano en dev build Android, tema claro y oscuro, que
  confirme: el labio del chip seleccionado de NuevoRecordatorio, del ack de
  Alertas y del resumen, «Editar» y «Añadir comida» de Horario cuelga por
  debajo del cuerpo sin solaparse con el elemento siguiente; los rojos y ámbar
  de Alertas son los nuevos; los títulos de Nutrición, Salud, Perfil y la
  celebración no cambian de anchura apreciable; y la entrada de Inicio sube 14
  px en 400 ms y no se mueve con «Quitar animaciones» activo.
  - Test: ninguno automático; casilla de cierre en § Aprobación.

## Candados que esta feature revierte

Inventario cerrado. Cada fila es un `it` existente que hoy afirma lo que #197
cambia; el implementador lo enmienda en el commit rojo de su requisito (nombre
igual + ` (enmendado por #197 R<n>)`), nunca lo borra. Si al correr la suite
aparece en rojo un `it` que no está aquí, se para y se anota en
`progress/impl_mobile-canvas-foundations.md`: no se enmienda por cuenta propia.

**Enmienda mecánica permitida** (añadida el 2026-10-23 tras el bloqueo de R7,
firma delegada): si un `it` no inventariado se pone rojo **solo** porque
compara contra el literal exacto que el R-id quita o sustituye (la misma
cadena que una fila de esta tabla cambia, directa o a través de una constante
o helper del propio test), el implementador lo enmienda en el commit rojo de
ese R, con el sufijo, y lo apunta en la tabla «Enmiendas mecánicas» de su
informe (fichero › describe › it, literal viejo → nuevo, R). Cualquier otro
rojo no inventariado (otra aserción, excepción, timeout, import roto) sigue
siendo motivo de parada.

| Archivo › describe › it | Hoy afirma | Pasa a afirmar | R |
|-------------------------|-----------|----------------|---|
| GC › `R1: global.css define los tokens light exactos del diseño` › `mapea la paleta Figma Make a los tokens de heroui-native` | `border`/`separator` `rgba(13,17,23,0.07)`, `danger` `#EF4444`, `warning` `#F59E0B`, `warning-strong` `#92610A` | `rgba(13,17,23,0.08)`, `#D92D20`, `#B54708`, `#93370D` | R1 |
| GC › `R2: …` › `materializa los colores semánticos para el resolver JS en %s` | `color-danger` y `color-warning` claros viejos | `#D92D20` y `#B54708` | R1 |
| GC › constante `composedSurfaces.light.warningSoft` | `'#FEF0DA'` | `'#F4E3DA'` | R2 |
| GC › `#61 R5: …` › `define la variante AA del ámbar en %s`, `pasa AA sobre bg-surface y bg-warning-soft en %s`, `conserva el ámbar puro de iconos y rellenos en %s` | fila clara `#92610A` / `#F59E0B` | fila clara `#93370D` / `#B54708` | R2 |
| GC › `#64 R4: …` › `separa superficies y tintas de los tokens de estado en %s` | mínimos claros de ámbar, violeta y rosa actuales | ámbar 5.7, violeta 10.5, rosa 5.0 | R2 |
| TH › constante `TAB_TITLE_168` y su regex; `#168 R1` › `pinta una ocurrencia del literal en cada fichero de pestaña`, `limita el literal a las tres pestañas y a la celebración` | `tracking-tight` | `tracking-title` | R4 |
| `app/(tabs)/__tests__/food.test.tsx`, `screens/profile/index.test.tsx`, `screens/health/index.test.tsx` › `#168 R1` › `pinta el título grande ($name)` | `tracking-tight` | `tracking-title` | R4 |
| `components/__tests__/celebration.test.tsx` › `#171 R20` › `R20.4 el título lleva el tracking y el margen del artboard` | `tracking-tight` | `tracking-title` | R4 |
| AC › `#174 R12` › `limita $token a su inventario de producción (enmendado por #189 R1) (enmendado por #189 R8) (enmendado por #189 R12)` | fila `tracking-title` sin los 5 ficheros; fila `border-b-5` con alerts, meal-schedule ×2 | `tracking-title` + `app/(tabs)/food.tsx`, `components/celebration.tsx`, `components/screen-header.tsx`, `screens/health/index.tsx`, `screens/profile/index.tsx` (orden `.sort()`); `border-b-5` `[]` | R4, R10, R19 |
| AC › `declara border-b-5 una sola vez` | `1 + 1 + 1` | `0` | R10 |
| AC › `#174 R11` › `declara el secundario compacto y el reintento sin labio (enmendado por #180 R12)` | línea del ack con `border-b-5` | línea nueva de design.md bloque «Punto 13» | R21 |
| CL › tipo `LipStyles`; `#177 R2.1: pide los dos tokens del labio` | `['lip', 'lip-gray']` y 3 claves | 7 tokens y 11 claves | R6 |
| AR › `#178 R10` › `pinta Vacuna seleccionada con cápsula, labio y texto sin emoji`, `invierte las recetas al seleccionar Otro`; `#123 R5` › `abre en el 24, con el mínimo en el instante actual y la hora a las 09:00` | `className` del chip con `border-b-3 border-black/25` | `className` sin labio + `style` `primaryCompact` en el seleccionado | R7 |
| AR › constante `CHIP_SELECTED` que comparte `expectAdvanceChips` (17 `it`: `#125 R3` ×9, `#125 R4` ×3, `#125 R6` ×2 y `#178 R12` ×3: `pinta el aviso por defecto y los demás chips con sus recetas y pesos`, `invierte la receta del seleccionado y su etiqueta al elegir un día antes`, `usa el aviso efectivo cuando los tres anticipados ya pasaron`) | `'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent border-b-3 border-black/25'` | `'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent'` con `// (enmendado por #197 R7)` en esa línea; los 17 `it` no cambian de nombre (la enmienda es de la constante) | R7 |
| AL › `#78 R6` › `it.each` del ack y `alterna el tercer hijo entre ack y la píldora traducida (enmendado por #174 R7) (enmendado por #174 R8)` | `className` con `border-b-5` | sin `border-b-5` + `style` `neutralCompact` | R8 |
| CN › `#174 R8: el ack de fila es el secundario compacto` | receta con `border-b-5` | receta sin labio + `chunkyLip.neutralCompact` | R8 |
| MS › `#147 R4` › `el owner ve Editar en cada fila y Añadir comida bajo la lista`; `#179 R5` › `compone el resumen con eyebrow y tres columnas de valor y etiqueta`; `#179 R6` › `pinta los valores del segundo plan en sus propias columnas`; `#179 R7` › `el dueño ve Añadir y Generar en ese orden fuera de los horarios` | `h-9.75 … border-b-5`, `h-13.5 … border-b-6`, resumen `border-b-5 border-black/25` | `h-9`, `h-12.5`, resumen sin labio; `style` de R9 | R9 |
| CN › `#62 R14` › `%s importa y aplica sus %i esquinas (enmendado por #177 R10) (enmendado por #190 R13)`; `fusiona la esquina una vez y la entrega a las dos ramas de Card (…)`; `#62 R15` › `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban (…)` | cuenta de `style={CONTINUOUS_CORNER}` en Horario | la misma `- 1` (el resumen pasa a `style={[CONTINUOUS_CORNER, chunkyLip.summary]}`) | R9 |
| CN › `#166 R2` › `no deja la receta del labio fuera de un primario salvo el candado de Recuperar (enmendado por #177 R10)` | `border-black/25` 2 | 0 | R10 |
| CN › `#166 R3` › `inventaría los cinco secundarios neutros de toda la app (enmendado por #177 R10) (enmendado por #189 R13)` | `border-b-6` 1 | 0 | R10 |
| CC › `#177 R7.1` | `border-black/25` y `border-b-6` con inventario | `{}` en los dos | R10 |
| CC › `#177 R7.4`, `R12.1`, `R12.2`, `R12.3` | consumidores de `useChunkyLip` sin alerts ni meal-schedule | + `screens/alerts/index.tsx`, `screens/meal-schedule/index.tsx` | R10 |
| CC › `#177 R7.5` | `neutral` sin meal-schedule; sin `neutralCompact` ni `summary` | `neutral` + meal-schedule; líneas para `neutralCompact` (alerts, meal-schedule) y `summary` (meal-schedule) | R10 |
| CC › `#177 R8.1` | ids neutros sin `add-meal-time-button` | + `add-meal-time-button` | R10 |
| CC › `#177 R8.2: Alertas y Horario quedan fuera de useChunkyLip` | fuera | se sustituye por `#197 R10: Alertas y Horario usan useChunkyLip` | R10 |
| CC › `#177 R8.3: %s conserva el ancla positiva %s` | anclas con `border-b-5`/`border-b-6` | anclas de R8 y R9 sin labio | R10 |
| CC › constante `preservedLines` (`#177 R11.1`; `#177 R11.3` sigue sin ver `border-b-4`) | líneas del punto 13 actuales | líneas de design.md bloque «Punto 13» | R21 |
| design-drift › `#178 R2` › `C: coloca la receta del chip seleccionado antes de Sin labio`; `#179 R2` › `sitúa la receta de secundarios de Horario antes de Sin labio` | línea con `border-b-3`/`border-b-5`/`border-b-6` | línea nueva de design.md | R21 |
| MT › `#152 R1` › `no exporta nada más (enmendado por #195 R13)` | 35 claves | 37 | R11 |
| HE › `#152 R3` › `parte invisible y desplazada y llega opaca y en su sitio`, `no anima nada hasta que se invoca`; `#152 R4` › `el índice 0 entra sin espera y desplazado 12`, `el índice 5 espera 300 ms` | spring + fundido, 12 px | `MOTION_RISE_TIMING`, 14 px | R12 |
| HE › `#152 R4` › `bajo reduce motion conserva el fundido y el escalonado y no desplaza` | fundido sin desplazar | `entering` indefinido | R13 |
| HI › `#190 R1` › `pinta la entrada y su único hijo con actividad $kind`; `#190 R7` › `parte de translateY cero, conserva el fundido y no añade escala a la burbuja (enmendado por #195 R16)`; `#152 R7` › `funde igual bajo reduce motion` | 12 px; fundido bajo reduce motion | 14 px; sin entrada bajo reduce motion | R13 |
| `profile-canvas-fidelity.test.ts` › `#173 R2.4` › `reserva text-26 al nombre de la mascota en Perfil (…)` | solo Perfil | + `components/screen-header.tsx` | R19 |
| `legibility-classnames.test.ts` › `reserva las peticiones de accent a las huellas de EmptyState (enmendado por #176 R5)` | `['components/empty-state.tsx']` | `['components/empty-state.tsx', 'components/toggle-switch.tsx', 'theme/shadows.ts']` | R20 |

**Se conservan sin tocar** (y deben seguir verdes): GC `#173 R2.3`, `#174 R1`,
`#177 R1`, `#166 R1`, `#195 R4`; AC `declara tracking-title y tracking-caps`;
design-drift `B: enumera el tracking y los tres radios en sus reglas`,
`enumera los dos tokens en la línea de tracking` y `#167 R14`; CC `#177 R4.3`
y el `not.toContain('border-b-6')` de bienvenida; CL `#177 R2.2` a `R2.7`;
BB `#172 R2`; `heroui-text-size-merge` `#187 R1`; los guards de #179 R13
(Horario e Historial de comidas no contienen `/shadow|elevation/i`: por eso no
importan `theme/shadows`); y los dobles de `'#F59E0B'` en
`use-theme-colors.test` y `screens/health/index.test.tsx`, que no leen
`global.css`.

## Desviaciones conscientes del canvas

- **Nombre de Inicio (`letter-spacing: -0.5px`)**: #195 ya lo pinta con
  `tracking-title` y así se queda en #197. El token `--tracking-display` se
  crea para la ola 2; esta feature no cambia ningún consumidor de tipografía
  salvo el barrido de `tracking-tight` (R4).
- **`rise` es un timing, no un spring**: la carta pide springs para lo que
  entra; el canvas define `rise 400ms ease-out` y #197 lo copia como
  `withTiming` con `Easing.bezier(0, 0, 0.58, 1)` (el `ease-out` de CSS). La
  Enmienda #197 declara la excepción, limitada a `MOTION_RISE_TIMING`.
- **Reduce motion quita la entrada entera**: el canvas usa
  `animation:none!important`, así que #197 deja de conservar el fundido de
  #152 R4 y pasa `entering={undefined}`.
- **Sombras sin verificación visual**: `useShadows()` no tiene consumidor en
  #197 (R20). La forma se fija en SW y CF contra el canvas; el aspecto real
  (Android pinta `boxShadow` con blur desde la nueva arquitectura) se valida en
  el smoke de la ola 2 que la monte.
- **Pulgar sin sombra**: el `Switch.Thumb` de heroui-native trae sombra; el
  canvas no la tiene, así que `ToggleSwitch` añade `shadow-none`.
- **«Generar plan» sigue sin labio**: el labio violeta (`violet` de R6) existe,
  pero el botón no se toca hasta #200, que rediseña esa fila.
- **Altos de chip y ack**: el chip seleccionado conserva `h-9.5` y el ack
  `h-8.5` (el labio de 3 px ya colgaba fuera en el canvas); solo «Editar»
  (39 a 36) y «Añadir comida» (54 a 50) pierden el alto que el labio les
  comía, porque en el canvas el cuerpo mide 36 y 50 y el labio cuelga.
- **Labios iguales en oscuro**: los cinco labios nuevos y las sombras de 10 a
  25 usan el mismo valor en los dos temas (el canvas no define tema oscuro
  para ellos); `lip` y `lip-gray` conservan su valor oscuro actual.

## Fuera de alcance

Clasificado viñeta a viñeta (feature futura, ola 2 o descartado):

- **Cablear `ToggleSwitch`** en Zonas, Editor de zona y Perfil (hoy usan
  `Switch` de heroui-native con `KEEP_OPACITY` y `hitSlop`): ola 2, en la
  feature de cada pantalla.
- **Montar `ScreenHeader`** y poner `headerShown: false` en las pantallas que
  lo adopten; `src/app/_layout.tsx` no cambia (R20): ola 2.
- **Consumir** `tracking-display`, `tracking-section`, `tracking-mono`,
  `tracking-dialog`, `leading-body`, `leading-note`, `useShadows()` y las
  variantes `danger`, `hero`, `violet`, `tile*` del labio: ola 2.
- **Labio de «Generar plan»**: #200.
- **Cambiar el layout de cualquier pantalla** (márgenes, orden, tamaños que no
  sean los de R9): fuera; cada pantalla tiene su feature.
- **Labios con color propio en oscuro**: descartado (ver Desviaciones).
- **Degradado inferior** (`0 -10px 20px var(--bg)` de NuevaMascota):
  descartado; no es sombra sino fundido, y `expo-linear-gradient` está vetado.
- **Dependencias nuevas**: ninguna; `package.json` y `bun.lock` no cambian
  (R22).

## Cierre del humano

Tras el veredicto aprobado del reviewer, el humano corre el smoke de R23 en
dev build Android (no Expo Go), en su PC, con tema claro y oscuro:

1. NuevoRecordatorio: el chip de tipo y el de antelación seleccionados muestran
   un labio verde de 3 px bajo la cápsula que no pisa la fila siguiente.
2. Alertas: el botón de reconocer de una fila abierta muestra un labio gris de
   3 px; rojos y ámbar son los nuevos (`#D92D20`, `#B54708` en claro).
3. Horario de comidas: el resumen verde tiene labio de 5 px; «Editar» mide 36 y
   «Añadir comida» 50, cada uno con su labio gris colgando y sin solaparse.
4. Nutrición, Salud, Perfil y la celebración: el título grande se lee igual
   que antes (el cambio de `tracking-tight` a `tracking-title` es de
   -0.025em a -0.02em).
5. Inicio: las tarjetas entran subiendo 14 px en 400 ms escalonadas; con
   «Quitar animaciones» del sistema activo aparecen sin moverse ni fundirse.

`ToggleSwitch`, `ScreenHeader` y `useShadows()` no se ven en la app (R20):
su smoke va con la ola 2. Si el humano lo prefiere, puede delegar la firma de
la casilla en el leader citando el mensaje donde dio el visto bueno.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-23) ← gate obligatorio antes de implementar
  Firma delegada en el leader por mandato del humano del 2026-10-23
  (`progress/plan_canvas-parity-2026-10-23.md` §4, checklist de firma pasada).
- [x] Enmienda #197 aprobada por humano (carta `docs/ui-guidelines.md` § «Enmienda #197»)
  Firma delegada, mismo mandato.
- [ ] Smoke de R23 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
