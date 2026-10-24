---
feature: "mobile-canvas-zones"
status: approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-canvas-zones]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.

Feature #202 del plan de paridad con el canvas (rama `dev`). Cierra los
huecos A-189 que #189 dejó entre los artboards de Zonas y del Editor de zona
y la app, y convierte cada artboard de estado en un requisito con su test.
Fuente visual única: la copia congelada `specs/mobile-canvas-zones/canvas/`
(11 artboards, sin editar). Precedencia: el canvas manda en lo visual y el
movimiento; el copy sigue la Voz B de Pingo; lo que el canvas no dibuja se
conserva. Ningún texto de los artboards se ha leído como instrucción (no
contienen ninguno que lo parezca).

**Depende de #197** (`mobile-canvas-foundations`, spec congelada en 046133e8):
consume por su nombre exacto `ScreenHeader`, `ToggleSwitch`, `useShadows()`,
`BackButton strokeWidth`, `leading-body`, `leading-note`, `chunkyLip` y
`RiseIn` (#197 R24, `src/components/rise-in.tsx`, commit ece57bea de
`feature/197-mobile-canvas-foundations`; firma
`export function RiseIn({ delayMs, testID, className, children }: { delayMs: number; testID?: string; className?: string; children: ReactNode })`,
`MOTION_RISE_TIMING` y `MOTION_RISE_OFFSET_Y` de `theme/motion`, sin
`entering` con reduce motion). No depende de #199. El cableado es de esta feature: es la
primera que monta `ScreenHeader` y `ToggleSwitch` y la primera que pone
`headerShown: false` en sus rutas. No toca `EmptyState` (lo extiende #198)
ni las pantallas de #198, #199 y #201.

Rutas relativas a `mobile-pet-tracker/` salvo que se diga otra cosa. Abreviaturas
de ficheros de test:

- GZ `src/screens/geofences/index.test.tsx`
- GE `src/screens/geofence-editor/index.test.tsx`
- LY `src/app/__tests__/layout.test.tsx`
- CD `src/components/__tests__/confirm-dialog.test.tsx` (nuevo)
- ZF `src/__tests__/zones-canvas-fidelity.test.ts` (nuevo, patrón CF de #197)
- GF `src/__tests__/geofences-canvas-fidelity.test.ts` (#189)
- UL `src/__tests__/ui-language.test.ts`

## Decisiones con defecto

Cada decisión está cerrada con su defecto. El leader las revisa al firmar.

| Id | Decisión | Defecto | Riesgo de colisión |
|----|----------|---------|--------------------|
| D1 | Cabecera de Zonas y de las ramas de estado del Editor | `ScreenHeader` de #197 en el contenido; las dos rutas pasan a `headerShown: false` | `_layout.tsx` lo pueden tocar #198/#199/#201 en paralelo: el cambio son dos líneas de `options`, sin reordenar hijos |
| D2 | `src/theme/header-layout.ts` | Se borra: sus 6 exportaciones se quedan sin consumidor de producción | Ninguno fuera de las dos pantallas, `_layout.tsx` y sus tests (medido) |
| D3 | Volver del formulario del Editor | `BackButton` de 24 (no 22) dentro de un círculo de cristal 44; `BackButton` no gana `size` | No se toca un componente compartido |
| D4 | Glifo del tile de zona | Glifo propio con `react-native-svg` (ya instalado), local a `geofences/index.tsx` | Ninguno |
| D5 | Fondo de la papelera | `CATEGORY_SLOTS.rose.surface` (el `--rose` del canvas) en vez de `bg-danger-soft` | Ninguno; `bg-danger-soft` sigue en Perfil y Peso |
| D6 | Trazo del círculo del mapa (3 en el canvas, 2 hoy) | Fuera de alcance: `PetMap` lo comparten #201 y #192 | Evita tocar `pet-map.tsx` |
| D7 | Confirmación de borrado | Diálogo propio `ConfirmDialog` en `src/components/confirm-dialog.tsx` (nuevo, sobre `Modal` de React Native) que sustituye a `Alert.alert` en Zonas y en el Editor | Fichero nuevo, sin consumidores previos. Si otra feature en vuelo crea un diálogo, el leader decide cuál queda |
| D8 | Entrada de la tarjeta del diálogo y de la hoja del Editor | `RiseIn` de #197 R24 con `delayMs={0}` (`rise` 14 / 400 ms) en vez de los 300 ms del artboard; #202 no crea entrada propia | Depende de que #197 (con su R24) esté en `dev` antes (Base medida) |
| D9 | «Reintentar» en Zonas y en el Editor | Conserva la receta de hoy (`Button` primario `min-h-11`); solo cambia el texto de error | La receta de reintentar es global; cambiarla en una pantalla rompe la consistencia |
| D10 | Etiqueta accesible de la carga | Claves nuevas `geofences.loadingLabel` («Cargando zonas») y `geofenceEditor.loadingLabel` («Cargando zona»), del `aria-label` de ZonasEstados y EditorZonaEstados | Dos filas en `ui-copy-table.ts` |
| D11 | Hacia dónde vuelve Zonas sin historial | `backFallback="/profile"` (Zonas se abre desde el tile de Perfil, #41 R9); el Editor vuelve a `{ pathname: '/pets/[petId]/geofences', params: { petId } }` | Ninguno |
| D12 | Carta | Se enmiendan las frases de #189 que fijan la cabecera nativa transparente, `insets.top + 6` y `bg-danger-soft` (R20) | Las líneas son exclusivas de Zonas |

## Base medida

Medida en `origin/dev` 71ff81a1 desde `mobile-pet-tracker/`. Anclas por
contenido (`grep -cF`, `test ! -e`), nunca por línea. «(#197: antes → después)»
marca lo que #197 mueve antes de esta feature. Ninguna ancla depende de #198
(esta feature no toca `EmptyState`).

```bash
# Zonas: src/screens/geofences/index.tsx
grep -cF "header-layout" src/screens/geofences/index.tsx            # 1 → 0
grep -cF "HEADER_ROW_TOP" src/screens/geofences/index.tsx           # 2 → 0
grep -cF "ZONES_TITLE_OFFSET" src/screens/geofences/index.tsx       # 2 → 0
grep -cF "AlertCircle" src/screens/geofences/index.tsx              # 2 → 0
grep -cF "<Map " src/screens/geofences/index.tsx                    # 1 → 0
grep -cF "<Switch" src/screens/geofences/index.tsx                  # 1 → 0
grep -cF "bg-danger-soft" src/screens/geofences/index.tsx           # 1 → 0
grep -cF "Alert.alert" src/screens/geofences/index.tsx              # 1 → 0
grep -cF 'testID="geofences-title"' src/screens/geofences/index.tsx # 1 → 0
grep -cF "text-26" src/screens/geofences/index.tsx                  # 1 → 0
grep -oF "<Skeleton" src/screens/geofences/index.tsx | wc -l       # 1 → 5 (escritos una vez dentro de [0, 1].map)
grep -oF "<Skeleton" src/screens/geofence-editor/index.tsx | wc -l # 1 → 3
grep -cF "ScreenHeader" src/screens/geofences/index.tsx             # 0 → 2 (import + uso)
grep -cF "ToggleSwitch" src/screens/geofences/index.tsx             # 0 → 2
grep -cF "ConfirmDialog" src/screens/geofences/index.tsx            # 0 → 2
grep -cF "leading-note" src/screens/geofences/index.tsx             # 0 → 1
grep -cF "react-native-svg" src/screens/geofences/index.tsx         # 0 → 1
# Editor: src/screens/geofence-editor/index.tsx
grep -cF "header-layout" src/screens/geofence-editor/index.tsx              # 1 → 0
grep -cF "Stack.Screen" src/screens/geofence-editor/index.tsx               # 2 → 0
grep -cF "TRANSPARENT_HEADER_OPTIONS" src/screens/geofence-editor/index.tsx # 2 → 0
grep -cF "EDITOR_PILL_LEFT" src/screens/geofence-editor/index.tsx           # 2 → 0
grep -cF "<Switch" src/screens/geofence-editor/index.tsx                    # 1 → 0
grep -cF "Alert.alert" src/screens/geofence-editor/index.tsx                # 1 → 0
grep -cF "h-14" src/screens/geofence-editor/index.tsx                       # 2 → 0
grep -cF "text-26" src/screens/geofence-editor/index.tsx                    # 1 → 0
grep -cF "rounded-16" src/screens/geofence-editor/index.tsx                 # 2 → 3 (barra de carga)
grep -cF "ScreenHeader" src/screens/geofence-editor/index.tsx               # 0 → 2
grep -cF "useShadows" src/screens/geofence-editor/index.tsx                 # 0 → 2
grep -cF "RiseIn" src/screens/geofence-editor/index.tsx                     # 0 → 2
grep -cF "leading-body" src/screens/geofence-editor/index.tsx               # 0 → 5
# Layout y catálogo
grep -cF "headerShown" src/app/_layout.tsx                  # 2 → 4
grep -cF "TRANSPARENT_HEADER_OPTIONS" src/app/_layout.tsx   # 2 → 0
grep -cF "header-layout" src/app/_layout.tsx                # 1 → 0
grep -cF "'geofences.loadingLabel'" src/i18n/catalog.ts     # 0 → 2
grep -cF "'geofenceEditor.loadingLabel'" src/i18n/catalog.ts # 0 → 2
grep -rlF "theme/header-layout" src | wc -l                 # 6 → 0 (ZF no lleva el literal, R2)
# Usos de copy que fija checkUses de UL (#65 R18): no cambian
grep -oF "t('geofences.title'" src/screens/geofences/index.tsx | wc -l              # 1 → 1 (R1)
grep -oF "t('geofenceEditor.title'" src/screens/geofence-editor/index.tsx | wc -l   # 2 → 2 (R17)
grep -oF "t('geofences.deleteTitle'" src/screens/geofences/index.tsx | wc -l       # 1 → 1 (R8)
grep -oF "t('geofences.deleteBody'" src/screens/geofences/index.tsx | wc -l        # 1 → 1 (R8)
grep -oF "t('geofences.cancel'" src/screens/geofences/index.tsx | wc -l            # 1 → 1 (R8)
grep -oF "t('geofences.delete'" src/screens/geofences/index.tsx | wc -l            # 1 → 1 (R8)
grep -oF "t('geofences.deleteTitle'" src/screens/geofence-editor/index.tsx | wc -l # 1 → 1 (R9)
grep -oF "t('geofences.deleteBody'" src/screens/geofence-editor/index.tsx | wc -l  # 1 → 1 (R9)
grep -oF "t('geofences.cancel'" src/screens/geofence-editor/index.tsx | wc -l      # 1 → 1 (R9)
grep -oF "t('geofences.delete'" src/screens/geofence-editor/index.tsx | wc -l      # 2 → 2 (R9: botón y diálogo)
# Esquinas que fija CC (#62 R14, #98 R10, #189 R9): no cambian
grep -oF "style={CONTINUOUS_CORNER}" src/screens/geofences/index.tsx | wc -l       # 3 → 3
grep -oE "\bCONTINUOUS_CORNER\b" src/screens/geofence-editor/index.tsx | wc -l     # 2 → 2
# Ficheros
test -e src/theme/header-layout.ts                          # existe → test ! -e
test ! -e src/components/confirm-dialog.tsx                 # → existe
test ! -e src/components/__tests__/confirm-dialog.test.tsx  # → existe
test ! -e src/__tests__/zones-canvas-fidelity.test.ts       # → existe
test ! -e src/components/toggle-switch.tsx   # (#197: ausente → existe)
test ! -e src/components/screen-header.tsx   # (#197: ausente → existe)
test ! -e src/theme/shadows.ts               # (#197: ausente → existe)
test ! -e src/components/rise-in.tsx         # (#197: ausente → existe)
```

Las cuatro anclas `(#197: …)` (`toggle-switch.tsx`, `screen-header.tsx`,
`shadows.ts`, `rise-in.tsx`) se comprueban hoy contra la branch de #197, p. ej.:
`git show feature/197-mobile-canvas-foundations:mobile-pet-tracker/src/components/rise-in.tsx | grep -cF 'export function RiseIn({ delayMs, testID, className, children }'`
→ `1`. Las anclas de copy y de esquinas se re-midieron en la enmienda de
auditoría sobre el árbol de la branch (`feature/202-mobile-canvas-zones`).

Las cifras «después» de `leading-body` (5) son: error de carga, error al
guardar, nota de reinicio, nota de solo lectura y texto de las tarjetas de
estado (una sola receta compartida por las tres tarjetas, R17). Si la
implementación las expresa con otra cuenta sin cambiar las clases de cada
nodo, el test manda y la cifra se re-mide en tasks.md.

## TestIDs

Nuevos (comprobados contra los selectores por regex de
`grep -rnE "TestId\(/" src`: ninguno casa con `/^geofence-geofence-\d$/` de GZ
ni con `/-delete$/` de GZ, por eso las acciones del diálogo terminan en
`-cancel` y `-confirm`, no en `-delete`):

- Zonas, cabecera (`ScreenHeader testID="geofences-header"`):
  `geofences-header` (conserva el id), `geofences-header-back`,
  `geofences-header-title` (sustituye a `geofences-title`); el contador
  conserva `geofences-counter` como `accessory`.
- Zonas, glifo: `geofence-${id}-glyph` (el `Svg` dentro del tile).
- Zonas, carga: `geofences-loading` pasa de `Skeleton` a `View` contenedor;
  filas `geofences-loading-row-0` y `geofences-loading-row-1`.
- Diálogo (`ConfirmDialog testID={X}`): `X`, `X-scrim`, `X-card`, `X-title`,
  `X-body`, `X-cancel`, `X-confirm`. Zonas usa
  `X = geofences-delete-dialog`; el Editor `X = geofence-editor-delete-dialog`.
- Editor, formulario: `geofence-editor-back-blur` (círculo de cristal) y
  `geofence-editor-back` (el `BackButton`); `geofence-editor-title-row`,
  `geofence-editor-title-blur` y `geofence-editor-title` se conservan;
  `geofence-editor-form-entrance` (el `RiseIn` de la hoja).
- Editor, estados (`ScreenHeader testID="geofence-editor-header"`):
  `geofence-editor-header`, `geofence-editor-header-back`,
  `geofence-editor-header-title` (sustituye al `geofence-editor-title` plano
  de las ramas de estado; en el formulario `geofence-editor-title` sigue
  siendo la píldora).
- Editor, carga: `geofence-editor-loading` pasa de `Skeleton` a `View`
  contenedor; barras `geofence-editor-loading-bar-0`..`-2`.
- `ToggleSwitch` conserva los ids de hoy (`geofence-${id}-active`,
  `geofence-editor-active`) y añade su `-thumb` (#197 R16).

Desaparecen: `geofences-title` y, en las ramas de estado del Editor, el
`geofence-editor-title` plano.

## Requisitos funcionales

Convenciones: cada `it` nuevo empieza por `#202 R<n>`. Los literales del canvas
se copian al test (nunca se importan de producción). «Doble de insets» = el
`top` que ya devuelve el doble de `useSafeAreaInsets` en ese fichero de test
(`40` en GZ y GE hoy); el test escribe la suma literal (`40 + 12`).

### R1 — Cabecera de Zonas en contenido (Z02)

WHEN Zonas seguras se monta en cualquiera de sus ramas (carga, error de carga,
sin collar, vacía, con zonas), THE SYSTEM SHALL pintar en lugar del `View`
`geofences-header` de hoy un `ScreenHeader` (#197 R19) con
`testID="geofences-header"`, `backFallback="/profile"` y
`title={t('geofences.title')}` («Zonas seguras» / «Safe zones»), con
`accessory` = el `Text testID="geofences-counter"` de hoy (mismas clases y
copy) solo cuando `geofences.data?.kind === 'ok'`; y el contenido de
`screen-geofences` SHALL arrancar en `paddingTop: insets.top + 12`
(canvas `padding: 56px 20px 40px` con `insets.top` 44), conservando
`paddingHorizontal: 20`, `gap: 12` y `paddingBottom: insets.bottom + 40`.
El `ScreenHeader` SHALL escribirse una sola vez en el fichero (compartido por
las cinco ramas), de modo que `t('geofences.title'` siga apareciendo 1 vez:
UL `#41 R10` › `registra cada ocurrencia de la pantalla y de su cabecera`
cuenta los usos exactos y no se enmienda.

- GZ `#202 R1: %s monta ScreenHeader con título y volver` (it.each sobre las
  cinco ramas): `geofences-header-back` existe con `accessibilityLabel`
  «Volver»; `geofences-header-title` dice «Zonas seguras»;
  `geofences-counter` está dentro de `geofences-header` solo en «vacía»
  (`0/5`) y «con zonas» (la cuenta del fixture), y no existe en las otras
  tres.
- GZ `#202 R1: el contenido arranca en insets.top + 12`: el estilo de
  contenido de `screen-geofences` (el mismo objeto que afirma `#41 R5`) tiene
  `paddingTop: 40 + 12`.

### R2 — Fuera la cabecera nativa de Zonas y del Editor

THE SYSTEM SHALL declarar en `src/app/_layout.tsx` las dos `Stack.Screen`
`pets/[petId]/geofences` (hoy
`options={{ ...headerOptions, title: '', ...TRANSPARENT_HEADER_OPTIONS }}`) y
`pets/[petId]/geofence-editor` (hoy `options={{ ...headerOptions, title: '' }}`;
la transparencia la pone hoy el Editor con su propio `Stack.Screen`) con
`options={{ headerShown: false }}` exactamente; el Editor SHALL dejar de
montar `Stack.Screen` dentro de la pantalla; y `src/theme/header-layout.ts`
SHALL dejar de existir sin que ningún fichero de `src/` lo importe.

- LY `#202 R2: Zonas seguras y el editor de zonas ocultan la cabecera nativa`:
  las `options` de ambas rutas `toEqual({ headerShown: false })`.
- ZF `#202 R2: header-layout.ts no existe ni se importa`:
  `existsSync(join(process.cwd(), 'src/theme/header-layout.ts')) === false` y
  ningún `.ts`/`.tsx` bajo `src/` contiene la cadena
  `const needle = ['theme', 'header-layout'].join('/')`. La aguja se construye
  así para que el propio `zones-canvas-fidelity.test.ts` no contenga el
  literal (si lo contuviera, el candado fallaría contra sí mismo o habría que
  excluirlo y dejaría de ser cerrado); no se excluye ningún fichero. Tras R2,
  `grep -rlF "theme/header-layout" src | wc -l` da `0`.

### R3 — Glifo de zona en el tile (Z06)

WHILE la lista tiene zonas, THE SYSTEM SHALL pintar dentro de cada
`geofence-${id}-tile`, en lugar del `Map` de reicon, un `Svg` de
`react-native-svg` con `testID={`geofence-${id}-glyph`}`, `width={22}`,
`height={22}`, `viewBox="0 0 24 24"`, `fill="none"`, `strokeWidth={2.2}`,
`strokeLinecap="round"`, `strokeLinejoin="round"` y `stroke` = el color que
hoy recibe `Map` en esa fila, con exactamente dos `Circle`: el primero
`cx={12} cy={12} r={9} strokeDasharray="3 3"`, el segundo
`cx={12} cy={12} r={2.5}`. El glifo vive en `src/screens/geofences/index.tsx`
(sin fichero nuevo) y `Map` deja de importarse.

- GZ `#202 R3: el tile de cada fila pinta el glifo de zona del canvas`: para
  cada fila del fixture, las props de `geofence-${id}-glyph` y de sus dos
  `Circle` (localizados dentro del glifo como hacen los tests de
  `components/empty-state.tsx`) son las de arriba, con el color literal de la
  categoría de cada fila.
- ZF `#202 R3: el canvas dibuja el glifo de zona`: `Zonas.dc.html` contiene
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"`
  y cinco veces cada uno de `<circle cx="12" cy="12" r="9" stroke-dasharray="3 3">`
  y `<circle cx="12" cy="12" r="2.5">`.

### R4 — Interruptores del canvas (Z08, E13)

WHEN se pinta el interruptor de una fila de Zonas (dueño) o
`geofence-editor-active` (dueño, editando), THE SYSTEM SHALL usar
`ToggleSwitch` (#197 R16) con el mismo `testID`, `isSelected`,
`onSelectedChange`, `isDisabled`, `accessibilityLabel`, `hitSlop={10}` y
`style={KEEP_OPACITY}` que hoy recibe `Switch`; `Switch` de `heroui-native`
deja de importarse en las dos pantallas.

- GZ `#202 R4: el interruptor de cada fila es ToggleSwitch`: existe
  `geofence-${id}-active-thumb` en cada fila del dueño y pulsar
  `geofence-${id}-active` llama una vez a la actualización con `active`
  invertido (mismo doble que `#41 R6`).
- GE `#202 R4: «Activa» es ToggleSwitch`: existe
  `geofence-editor-active-thumb` y pulsar `geofence-editor-active` invierte
  su `accessibilityState.checked`.
- ZF `#202 R4: el canvas dibuja el interruptor 48x28`: `Zonas.dc.html`
  contiene 5 veces `width: 48px; height: 28px` y `EditorZona.dc.html` 1 vez.

### R5 — Aviso de límite (Z11, Z13)

WHEN se pinta `geofences-limit`, THE SYSTEM SHALL usar como icono
`AlertTriangle` de `reicon-react-native` con `size={20}` y el color `warning`
de hoy (en lugar de `AlertCircle`), y `geofences-limit-text` SHALL tener
`className` exacta `flex-1 text-13 leading-note ${CATEGORY_SLOTS.amber.ink}`.

- GZ `#202 R5: el aviso de límite usa AlertTriangle y 13/1.45`: con el doble
  de reicon enmendado (`AlertTriangle: icon('alert')`, sin `AlertCircle`),
  `geofences-icon-alert` existe dentro de `geofences-limit` con `size` 20 y el
  color `warning` de hoy; `geofences-limit-text` lleva la clase de arriba con
  el `ink` literal de amber. Que `AlertCircle` ya no se importe lo fija GF
  `#189 R18` enmendado (el doble no puede distinguirlo: ambos pintan
  `geofences-icon-alert`).
- ZF `#202 R5: el canvas pinta el aviso a 13/1.45`: `Zonas.dc.html` contiene
  `font-size: 13px; line-height: 1.45`.

### R6 — Papelera rose (Z15)

WHILE la persona es dueña y la lista tiene zonas, THE SYSTEM SHALL pintar
`geofence-${id}-delete` con la `className` de hoy cambiando `bg-danger-soft`
por `${CATEGORY_SLOTS.rose.surface}` (`bg-category-rose`), conservando
`Trash` `size={20}` en color `danger`, `accessibilityLabel`
(`geofences.deleteLabel`) y `style={CONTINUOUS_CORNER}`, y sin `hitSlop`
(hoy no lo tiene: el `hitSlop={10}` de la fila es del interruptor, y
`size-11` ya da 44). Decisión de la auditoría (M3): R6 no añade `hitSlop`, así
que GZ `#189 R5`, que afirma `trash.props.hitSlop` indefinido, sigue verde en
ese punto; y como el `style={CONTINUOUS_CORNER}` se conserva, CC `#62 R14` y
`#98 R10` no se mueven (F6).

- GZ `#202 R6: la papelera de cada fila usa el fondo rose`: la `className`
  contiene `bg-category-rose` y no contiene `bg-danger-soft`, en cada fila.
- ZF `#202 R6: el canvas pinta la papelera sobre rose`: `Zonas.dc.html`
  contiene 5 veces `var(--rose)`.

### R7 — `ConfirmDialog` compartido (Z17)

THE SYSTEM SHALL ofrecer `ConfirmDialog` en `src/components/confirm-dialog.tsx`
con props `{ testID: string; visible: boolean; title: string; body: string;
cancelLabel: string; confirmLabel: string; onCancel: () => void;
onConfirm: () => void }` que, WHILE `visible`, monte un `Modal` de React
Native `transparent`, `animationType="none"`, `statusBarTranslucent` y
`onRequestClose={onCancel}` con:

1. `View testID={testID} className="flex-1 justify-center px-6"`;
2. velo `Pressable testID={`${testID}-scrim`}` a pantalla completa
   (`absolute inset-0`), `accessibilityLabel={cancelLabel}`,
   `onPress={onCancel}`, envuelto en `Animated.View` con
   `entering={reduceMotion ? undefined : FadeIn.duration(MOTION_TRANSITION_MS)}`
   (`useReducedMotion` de Reanimated) y `style={{ backgroundColor: SCRIM }}`,
   con `const SCRIM = 'rgba(13,17,23,0.4)'` en el propio fichero;
3. `RiseIn delayMs={0}` (`src/components/rise-in.tsx`, #197 R24) envolviendo la tarjeta
   `Card testID={`${testID}-card`} role="alertdialog"`
   `className="gap-3 rounded-hero px-6 pt-6 pb-3 shadow-none"`
   `style={shadows.dialog}` (`useShadows()`, #197 R15);
4. dentro, en orden: `Text testID={`${testID}-title`} role="header"`
   `className="text-xl font-black tracking-dialog text-foreground"`;
   `Text testID={`${testID}-body`}` `className="text-sm leading-normal text-muted"`;
   `View className="mt-1 flex-row justify-end gap-1"` con dos `Pressable`
   `role="button"` `className="min-h-12 justify-center px-4"`:
   `${testID}-cancel` (`Text className="text-15 font-extrabold text-accent-strong"`,
   `onPress={onCancel}`) y `${testID}-confirm`
   (`Text className="text-15 font-extrabold text-danger"`, `onPress={onConfirm}`).

WHILE `visible` es `false`, THE SYSTEM SHALL no pintar nada.

- CD `#202 R7: monta velo, tarjeta y acciones con las recetas del canvas`.
- CD `#202 R7: %s llama a onCancel una vez y nunca a onConfirm` (it.each, un
  candado por rama: `-cancel`, `-scrim` y `onRequestClose` del `Modal`).
- CD `#202 R7: confirmar llama a onConfirm una vez y nunca a onCancel`.
- CD `#202 R7: invisible no pinta el diálogo`.
- ZF `#202 R7: el canvas dibuja el diálogo de borrado`: `ZonasEliminar.dc.html`
  contiene `role="alertdialog"`, `border-radius: 28px;`,
  `0 12px 40px rgba(13,17,23,0.25)`, `rgba(13,17,23,0.4)`,
  `@keyframes fade{from{opacity:0}to{opacity:1}` y 2 veces `height: 48px`; y
  `confirm-dialog.tsx` contiene `FadeIn.duration(MOTION_TRANSITION_MS)`,
  `'rgba(13,17,23,0.4)'` y `RiseIn`.

### R8 — Borrado de Zonas con diálogo (Z17)

WHEN la persona dueña pulsa `geofence-${id}-delete`, THE SYSTEM SHALL abrir
`ConfirmDialog testID="geofences-delete-dialog"` con
`title={t('geofences.deleteTitle', { name })}`,
`body={t('geofences.deleteBody')}`, `cancelLabel={t('geofences.cancel')}` y
`confirmLabel={t('geofences.delete')}`; WHEN cancela (botón, velo o atrás de
Android), THE SYSTEM SHALL cerrarlo sin llamar a `deleteGeofence`; WHEN
confirma, THE SYSTEM SHALL cerrarlo y llamar una vez a
`deleteGeofence(baseUrl, token, petId, id)` a través del `write` de hoy (mismo
bloqueo, recarga y manejo de `unauthorized`). `Alert` deja de importarse en
`geofences/index.tsx`. Sin copy nuevo.

- GZ `#202 R8: la papelera abre el diálogo con el copy exacto`: título
  «¿Eliminar <nombre del fixture>?», cuerpo «Dejarás de recibir alertas de
  esta zona. Esta acción no se puede deshacer.», «Cancelar», «Eliminar».
- GZ `#202 R8: %s cierra sin borrar` (it.each: `-cancel`, `-scrim`).
- GZ `#202 R8: confirmar borra una vez y cierra el diálogo`.

### R9 — Borrado del Editor con diálogo

WHEN la persona dueña pulsa `geofence-editor-delete`, THE SYSTEM SHALL abrir
`ConfirmDialog testID="geofence-editor-delete-dialog"` con las mismas claves
de R8 y el nombre de la zona; cancelar SHALL cerrarlo sin borrar; confirmar
SHALL cerrarlo y ejecutar el borrado de hoy una vez (con su `busy`, que
deshabilita Eliminar, Guardar y «Activa», y su vuelta a la lista recargada).
`Alert` deja de importarse en `geofence-editor/index.tsx`.

- GE `#202 R9: Eliminar abre el diálogo con el copy exacto` (literales de R8).
- GE `#202 R9: %s cierra sin borrar` (it.each: `-cancel`, `-scrim`).
- GE `#202 R9: confirmar borra una vez y vuelve a la lista`.
- GE `#202 R9: Eliminar abre el diálogo en inglés`: «Delete <nombre>?»,
  «You'll stop getting alerts for this zone. This can't be undone.»,
  «Cancel», «Delete».

### R10 — Esqueleto de Zonas (Z21)

WHILE la lista de Zonas carga, THE SYSTEM SHALL pintar
`View testID="geofences-loading" className="gap-3"` con
`accessibilityLabel={t('geofences.loadingLabel')}` y
`accessibilityState={{ busy: true }}`, con exactamente dos
`Card testID={`geofences-loading-row-${i}`}` (`i` = 0, 1)
`className="flex-row items-center gap-3 px-3.5 py-3 shadow-none"` cuyos hijos
en orden son: `Skeleton className="size-11 rounded-14"`;
`View className="flex-1 gap-1.5"` con `Skeleton className="h-3.5 rounded-full"`
`style={{ width: '55%' }}` y `Skeleton className="h-2.5 rounded-full"`
`style={{ width: '35%' }}`; `Skeleton className="h-7 w-12 rounded-full"`; y
`Skeleton className="size-11 rounded-xl"`. Las filas se escriben una vez
dentro de `[0, 1].map`.

Copy nuevo: `geofences.loadingLabel` = «Cargando zonas» (es) / «Loading
zones» (en), fila nueva en `R14_GEOFENCES` de `ui-copy-table.ts` (22 → 23).

- GZ `#202 R10: la carga pinta dos filas con la forma de la fila`: dos filas y
  las `className` de sus hijos terminan en las clases de arriba (el
  `skeleton__root` de heroui va delante), con los dos `width` literales.
- GZ `#202 R10: la carga se anuncia como «Cargando zonas»`.
- ZF `#202 R10: el canvas dibuja la fila esqueleto`: `ZonasEstados.dc.html`
  contiene `width: 55%; height: 14px; border-radius: 7px` y `width: 35%`.

### R11 — Errores de Zonas a 15/1.4 (Z22, Z23)

WHEN Zonas pinta `geofences-error` o `geofences-action-error`, THE SYSTEM
SHALL darles `className` exacta `text-15 leading-body text-danger`,
conservando copy, `selectable` y posición; «Reintentar» no cambia (D9).

- GZ `#202 R11: %s usa 15/1.4 en danger` (it.each, un candado por rama:
  `geofences-error` con `unreachable`, `geofences-error` con otro fallo y
  `geofences-action-error`).
- ZF `#202 R11: el canvas pinta los errores a 15/1.4`: `ZonasEstados.dc.html`
  contiene 2 veces `font-size: 15px; line-height: 1.4`.

### R12 — Cabecera flotante del formulario del Editor (E02, E03)

WHILE el Editor pinta el formulario (crear, editar o solo lectura), THE SYSTEM
SHALL pintar `geofence-editor-title-row` con
`className="absolute left-4 right-4 flex-row items-center gap-2.5"`,
`pointerEvents="box-none"` y `style={{ top: insets.top + 8 }}`, cuyos hijos en
orden son:

1. `BlurView testID="geofence-editor-back-blur"` con la misma `intensity`,
   `blurMethod` y `tint` que la píldora,
   `className="size-11 items-center justify-center overflow-hidden rounded-full bg-glass-surface-strong"`
   y `style={shadows.card}`, que contiene
   `BackButton testID="geofence-editor-back" strokeWidth={2.4}`
   `fallback={{ pathname: '/pets/[petId]/geofences', params: { petId } }}`;
2. `geofence-editor-title-blur` (la píldora de hoy, con su
   `geofence-editor-title` y sus clases) con `style={shadows.card}` añadido.

- GE `#202 R12: la fila flotante pinta volver de cristal y píldora con sombra en %s`
  (it.each: crear, editar, solo lectura): `style.top === 40 + 8`, hijos
  `['geofence-editor-back-blur', 'geofence-editor-title-blur']`,
  `geofence-editor-back` dentro del primero con «Volver», y la sombra de ambos
  igual al literal de `card` de #197 R15 copiado en el test.
- ZF `#202 R12: el canvas dibuja la fila flotante`: `EditorZona.dc.html`
  contiene `top: 52px` y `stroke-width="2.4"`.

### R13 — Hoja del formulario con sombra y entrada (E09)

WHILE el Editor pinta el formulario, THE SYSTEM SHALL envolver
`geofence-editor-form` en
`RiseIn testID="geofence-editor-form-entrance" delayMs={0} className="-mt-6.5 shrink"`
(#197 R24: rise 14/400, sin animación con reduce motion), con la
`className` de la hoja exacta `rounded-t-hero bg-surface` (el `-mt-6.5` pasa
al envoltorio) y su `style` exacto
`style={[CONTINUOUS_CORNER, { flexGrow: 0, flexShrink: 1 }, shadows.sheet]}`
(hoy `style={[CONTINUOUS_CORNER, { flexGrow: 0, flexShrink: 1 }]}`, que CC
`#189 R9` afirma literal: se enmienda en el rojo de R13). El `shrink` del
envoltorio no viene de la auditoría: en React Native `flexShrink` vale 0 por
defecto y, sin él, el `Animated.View` de `RiseIn` no cede altura cuando el
`KeyboardAvoidingView` (`behavior="padding"`) la resta, y la hoja deja de
encoger bajo el teclado (Cierre del humano, punto 7). Si el leader lo
descarta, se quita de aquí y del test sin tocar nada más.

- GE `#202 R13: la hoja entra con rise y lleva la sombra de hoja en %s`
  (it.each: crear, editar, solo lectura): `geofence-editor-form` está dentro
  de `geofence-editor-form-entrance` (`className` `-mt-6.5 shrink`), su `className`
  es `rounded-t-hero bg-surface` y su estilo contiene el literal de `sheet` de
  #197 R15 copiado en el test.
- ZF `#202 R13: el canvas dibuja la hoja con sombra y rise`: `EditorZona.dc.html`
  contiene `0 -8px 24px rgba(13,17,23,0.10)` y
  `@keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}`.

### R14 — Nombre a 16/600 (E11)

WHILE el dueño edita o crea, THE SYSTEM SHALL dar a `geofence-editor-name` la
`className` exacta `text-base font-semibold h-12.5 rounded-xl bg-default px-3.5`
(las clases nuevas delante: el sufijo de hoy se conserva y `#189 R10` sigue
verde; ninguna es `text-13/15/17`, que `twMerge` de HeroUI expulsaría).

- GE `#202 R14: el nombre usa 16/600 del canvas en %s` (it.each: crear,
  editar): la `className` contiene `text-base` y `font-semibold` y termina en
  `h-12.5 rounded-xl bg-default px-3.5`.
- ZF `#202 R14: el canvas pinta el nombre a 600 16px`: `EditorZona.dc.html`
  contiene `600 16px`.

### R15 — Acciones de 54 (E14)

WHILE el Editor pinta sus acciones, THE SYSTEM SHALL dar a
`geofence-editor-delete` y a las dos ramas de `geofence-editor-save` la
`className` de hoy con `h-14` sustituido por `h-13.5`
(`flex-1 h-13.5 rounded-16 border-2 border-lip-gray bg-surface`,
`flex-2 h-13.5 rounded-16 bg-default`, `flex-2 h-13.5 rounded-16 bg-accent`).

- GE `#202 R15: Eliminar y Guardar miden 54 en %s` (it.each: crear con nombre
  vacío, crear con nombre, editar): cada botón presente tiene la cadena exacta
  de arriba.
- ZF `#202 R15: el canvas dibuja las acciones a 54`: `EditorZona.dc.html`
  contiene 2 veces `height: 54px`.

### R16 — Textos del formulario a la escala del canvas (E16, E17, E18)

WHEN el Editor pinta estos nodos, THE SYSTEM SHALL darles la `className`
exacta indicada:

| testID | Hoy | Pasa a |
|---|---|---|
| `geofence-editor-reset-note` | `text-sm font-normal text-muted` | `text-sm font-normal leading-body text-muted` |
| `geofence-editor-read-only` | `text-sm font-normal text-muted` | `text-sm font-normal leading-body text-muted` |
| `geofence-editor-error` | `text-danger` | `text-sm leading-body text-danger` |
| `geofence-editor-radius-value` (solo lectura) | `font-bold text-foreground` | `text-15 font-bold text-foreground` |

- GE `#202 R16: %s usa la receta del canvas` (it.each, una fila por nodo de la
  tabla).
- ZF `#202 R16: el canvas pinta las notas a 14/1.4`: `EditorZona.dc.html` y
  `EditorZonaSoloLectura.dc.html` contienen `font-size: 14px; line-height: 1.4`.

### R17 — Ramas de estado del Editor (E20)

WHILE el Editor está en una rama de estado (carga, error de carga, sin collar
`geofence-editor-no-tracking`, zona no encontrada `geofence-editor-not-found`
o solo dueño `geofence-editor-owner-only`), THE SYSTEM SHALL pintar como
primer hijo del contenido de `screen-geofence-editor`
`ScreenHeader testID="geofence-editor-header"`
`backFallback={{ pathname: '/pets/[petId]/geofences', params: { petId } }}`
`title={t('geofenceEditor.title')}` («Zona segura» / «Safe zone») en lugar
del `Text geofence-editor-title`; el contenido SHALL arrancar en
`paddingTop: insets.top + 12` sin `contentInsetAdjustmentBehavior`; las tres
tarjetas SHALL conservar su componente y su `className` salvo `py-8`, que
pasa a `px-4 py-6`; y su texto SHALL usar la constante local
`STATE_TEXT = 'text-center text-15 leading-body text-muted'`.
El `ScreenHeader` de estado SHALL escribirse una sola vez (donde hoy se
escribe el título plano compartido por las ramas de estado), de modo que
`t('geofenceEditor.title'` siga apareciendo 2 veces (esa y la píldora del
formulario): UL `#146 R10` › `registra cada ocurrencia del editor y de sus
entradas` cuenta los usos exactos y no se enmienda por R17.

- GE `#202 R17: %s monta ScreenHeader con «Zona segura» y volver` (it.each,
  una fila por rama: carga, error de carga, sin collar, no encontrada, solo
  dueño): `geofence-editor-header-title` dice «Zona segura»,
  `geofence-editor-header-back` dice «Volver», no existe
  `geofence-editor-title` y el contenido tiene `paddingTop: 40 + 12`.
- GE `#202 R17: la tarjeta de %s usa 24/16 y 15/1.4` (it.each: sin collar, no
  encontrada, solo dueño).
- ZF `#202 R17: el canvas dibuja las tarjetas de estado`:
  `EditorZonaEstados.dc.html` contiene 3 veces `padding: 24px 16px` y 4 veces
  `font-size: 15px; line-height: 1.4`.

### R18 — Esqueleto del Editor (E20)

WHILE el Editor carga, THE SYSTEM SHALL pintar
`View testID="geofence-editor-loading" className="gap-2.5"` con
`accessibilityLabel={t('geofenceEditor.loadingLabel')}` y
`accessibilityState={{ busy: true }}`, con exactamente tres `Skeleton`:
`geofence-editor-loading-bar-0` `className="h-12 w-full rounded-xl"`,
`geofence-editor-loading-bar-1` `className="h-2 w-full rounded-full"` y
`geofence-editor-loading-bar-2` `className="h-12 w-full rounded-16"`.

Copy nuevo: `geofenceEditor.loadingLabel` = «Cargando zona» (es) / «Loading
zone» (en), fila nueva en `R15_GEOFENCE_EDITOR` de `ui-copy-table.ts`.

- GE `#202 R18: la carga pinta las tres barras del canvas`: las `className`
  terminan en las de arriba.
- GE `#202 R18: la carga se anuncia como «Cargando zona»`.
- ZF `#202 R18: el canvas dibuja las tres barras`: `EditorZonaEstados.dc.html`
  contiene `height: 48px` y `height: 8px`.

### R19 — Error de carga del Editor a 15/1.4 (E20)

WHEN el Editor no puede cargar la lista, THE SYSTEM SHALL dar a
`geofence-editor-load-error` la `className` exacta
`text-15 leading-body text-danger`, con el mismo copy y el mismo
«Reintentar» de hoy.

- GE `#202 R19: el error de carga usa 15/1.4 en %s` (it.each: `unreachable`,
  otro fallo).

### R20 — Enmienda de la carta

THE SYSTEM SHALL sustituir en `docs/ui-guidelines.md` (y, donde se repite, en
`docs/conventions.md`) estas frases por su texto nuevo literal:

| Frase de hoy (#189) | Texto nuevo |
|---|---|
| «`pets/[petId]/geofences` queda fuera de esta excepción desde #189 E4 (cabecera transparente, ver más abajo).» (carta y conventions) | «Zonas seguras y el editor de zonas quedan fuera de esta excepción desde #202 (`headerShown: false`, cabecera en contenido; ver más abajo).» |
| «Zonas seguras (#189): `paddingHorizontal: 20`, `paddingTop: insets.top + 6`, `gap: 12`, `paddingBottom: insets.bottom + 40`.» | «Zonas seguras (#189, #202): `paddingHorizontal: 20`, `paddingTop: insets.top + 12`, `gap: 12`, `paddingBottom: insets.bottom + 40`.» |
| El párrafo «Cabecera nativa transparente (#189 E4): …» completo | «Cabecera en contenido (#202): Zonas seguras y el editor de zonas declaran `headerShown: false`. Zonas y las ramas de estado del Editor montan `ScreenHeader` como primer hijo del contenido; el formulario del Editor flota sobre el mapa una fila en `top: insets.top + 8` con el volver de cristal (44, `BackButton` con `strokeWidth={2.4}`) y la píldora del título, ambos con `shadows.card`.» |
| «La papelera de la fila de zona es una excepción solo-icono (`size-11 rounded-xl bg-danger-soft`).» (las dos apariciones) | «La papelera de la fila de zona es una excepción solo-icono (`size-11 rounded-xl` sobre `CATEGORY_SLOTS.rose.surface`, #202).» |
| En «**Métricas por fidelidad al canvas (A11).**», `paddingTop: insets.top + 6` | `paddingTop: insets.top + 12` |

- Los `it` de GF `#189 R16.1`, `#189 R16.3`, `#189 R24.1` y `#189 R24.2`
  enmendados (ver Candados) son sus candados.
- ZF `#202 R20: la carta ya no describe la cabecera transparente de Zonas`:
  `readFileSync(join(process.cwd(), '..', 'docs/ui-guidelines.md'), 'utf8')`
  no contiene `Cabecera nativa transparente (#189 E4)` ni `bg-danger-soft\`)`
  y contiene `Cabecera en contenido (#202)`.

### R21 — ZonasVacio se conserva (Z18)

WHILE la persona dueña tiene la lista vacía, THE SYSTEM SHALL conservar el
`EmptyState` de hoy, `geofences-counter` «0/5» (ahora dentro de la cabecera),
`geofences-progress` con sus 5 segmentos sin rellenar y `geofences-add` con su
receta de hoy.

- GZ `#202 R21: vacía conserva EmptyState, 0/5, barra vacía y «Añadir zona»`.

### R22 — ZonasSinCollar se conserva (Z19)

WHILE la mascota no tiene collar, THE SYSTEM SHALL pintar
`geofences-no-tracking` sin `geofences-counter`, `geofences-progress` ni
`geofences-add`.

- GZ `#202 R22: sin collar pinta solo la cabecera y el estado vacío`.

### R23 — ZonasSoloLectura se conserva (Z20)

WHILE la persona no es dueña, THE SYSTEM SHALL pintar cada fila sin
`geofence-${id}-active` ni `geofence-${id}-delete`, con
`geofence-${id}-status` y su receta de hoy, y SHALL no montar nunca
`geofences-delete-dialog`.

- GZ `#202 R23: solo lectura no tiene interruptor, papelera ni diálogo`.

### R24 — EditorZonaNueva se conserva (E19)

WHEN el dueño crea una zona, THE SYSTEM SHALL pintar el formulario sin
`geofence-editor-active-row`, `geofence-editor-reset-note` ni
`geofence-editor-delete`, con `geofence-editor-save` en la rama
`bg-default` mientras el nombre está vacío.

- GE `#202 R24: crear no tiene «Activa», nota ni Eliminar`.

R21-R24 son candados de conservación: nacen verdes y no tienen commit rojo
propio (tasks.md lo dice en su bloque).

### R25 — Fidelidad agregada y cartas limpias

THE SYSTEM SHALL mantener, en `src/screens/geofences/index.tsx`,
`src/screens/geofence-editor/index.tsx` y `src/components/confirm-dialog.tsx`:
cero `StyleSheet.create`, cero clases arbitrarias (`/\b[\w-]+-\[[^\]]+\]/`),
cero literales hex (`/#[0-9a-fA-F]{3,8}\b/`) y ninguna clase de interlineado
o tamaño fuera de la escala del tema; y `package.json` SHALL no ganar
dependencias (sin `expo-linear-gradient`).

- ZF `#202 R25: %s no usa StyleSheet.create, clases arbitrarias ni hex`
  (it.each, una fila por fichero).
- ZF `#202 R25: package.json no añade dependencias`: no contiene
  `expo-linear-gradient` y el número de claves de `dependencies` es el de la
  base (re-medido en tasks.md).

En ZF, «contiene N veces» se comprueba como «al menos N apariciones»
(`content.split(literal).length - 1 >= N`): las cifras se midieron con
`grep -cF`, que cuenta líneas. Todas las lecturas del canvas usan
`readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-zones/canvas/<Artboard>.dc.html'), 'utf8')`.

### R26 — Smoke en dev build Android (cierre humano)

WHEN la implementación esté aprobada por el `reviewer`, THE SYSTEM SHALL
superar la lista de «Cierre del humano» en el dev build Android. No es gate
de implementación.

## Candados que esta feature revierte

Inventario cerrado, buscado por el literal que cambia (`git grep -nF` sobre
`src/**/__tests__` y los `*.test.ts(x)` de las dos pantallas y de los candados
agregados), no por el nombre del `it`. Rutas bajo `mobile-pet-tracker/src/`.
Un `it` enmendado conserva su nombre y añade el sufijo
` (enmendado por #202 R<n>)`; uno borrado se lista como «se borra».

### `__tests__/geofences-canvas-fidelity.test.ts` (#189)

| describe › it | Hoy afirma | Pasa a afirmar | R |
|---|---|---|---|
| `#189 R16` › `#189 R16.1: métricas nominales de las dos pantallas bajo A11 (enmendado por E4 R24)` | carta: Zonas `paddingTop: insets.top + 6` (dos frases) | las dos frases con `paddingTop: insets.top + 12` (texto de design.md § Enmienda #202) | R20 |
| `#189 R16` › `#189 R16.3: receta gris, Eliminar neutro y papelera solo-icono` | carta: papelera `size-11 rounded-xl bg-danger-soft` | `size-11 rounded-xl` + `CATEGORY_SLOTS.rose.surface` (frase de la Enmienda #202) | R6, R20 |
| `#189 R23` › `#189 R23.1: exporta las seis constantes y las opciones transparentes` | `header-layout.ts` exporta 6 constantes | se borra (el fichero se borra, D2) | R2 |
| `#189 R23` › `#189 R23.2: los offsets quedan en las ventanas propias del test` | ventanas de `ZONES_TITLE_OFFSET` y `EDITOR_PILL_LEFT` | se borra (D2) | R2 |
| `#189 R23` › `#189 R23.2: $name no repite los literales de geometría` (`it.each`, 2 filas) | ninguna `PropertyAssignment` numérica 42/70/56 | se borra (D2); la línea 2 del fichero deja de importar `header-layout` | R2 |
| `#189 R19` › `#189 R19.2: $name cancela la opacidad en todas sus etiquetas con isDisabled` (`it.each`, 2 filas) | etiquetas `['Switch', 'Button']` con `isDisabled`: 2 / 3 | etiquetas `['Switch', 'ToggleSwitch', 'Button']`: 2 / 3 (las cifras no cambian; cambia la lista) | R4 |
| `#189 R18` › `#189 R18: Map, AlertCircle y Trash solo se importan de reicon` | importa `AlertCircle`, `Map`, `Trash` de reicon | filtra `['Map', 'AlertCircle', 'AlertTriangle', 'Trash']` y espera `[{ AlertTriangle, reicon }, { Trash, reicon }]` (renombrado a `#189 R18: AlertTriangle y Trash solo se importan de reicon`) | R3, R5 |
| `#189 R24` › `#189 R24.1: fija la transparencia y distingue las ramas opacas del Editor` | carta: «Cabecera nativa transparente (#189 E4) …» | carta: la frase de la Enmienda #202 que la sustituye (cabecera en contenido, `headerShown: false`) | R20 |
| `#189 R24` › `#189 R24.2: excluye Zonas de la excepción de cabecera opaca en ambos documentos` | carta y `docs/conventions.md` contienen «`pets/[petId]/geofences` queda fuera de esta excepción desde #189 E4 …» | carta y conventions contienen la frase de la Enmienda #202 (las dos rutas fuera de la excepción, `headerShown: false`) | R20 |

### `screens/geofences/index.test.tsx` (GZ)

| describe › it | Hoy afirma | Pasa a afirmar | R |
|---|---|---|---|
| (cabecera del fichero) import de `HEADER_ROW_TOP`/`ZONES_TITLE_OFFSET` desde `@/theme/header-layout` | el import existe | se borra el import (en el commit rojo de R1) | R1, R2 |
| (cabecera del fichero) doble de `reicon-react-native` | `{ ...actual, __esModule: true, Map: icon('map'), Trash: icon('trash'), AlertCircle: icon('alert') }` | R3 quita `Map: icon('map')`; R5 cambia `AlertCircle: icon('alert')` por `AlertTriangle: icon('alert')` (el testID `geofences-icon-alert` se conserva) | R3, R5 |
| `#41 R5` › `respeta las métricas A11 bajo cabecera nativa (enmendado por #189 R3) (enmendado por E4 R21)` | el `toEqual` del estilo de contenido con `paddingTop: 46` y el `toBe(40 + HEADER_ROW_TOP)` | `paddingTop: 52` en el `toEqual` y `toBe(40 + 12)` (M2) | R1 |
| `#41 R5` › `pinta el esqueleto mientras carga la lista` | `geofences-loading` con `skeleton__root h-24 w-full rounded-card` | `geofences-loading` es `View` con dos `geofences-loading-row-*` | R10 |
| `#41 R5` › `pinta %p y Reintentar vuelve a pedir solo la lista` (`it.each` del error de carga) | `geofences-error` con `text-danger` | `text-15 leading-body text-danger` | R11 |
| `#41 R6` › `pinta %s sin recargar y limpia el error al siguiente intento` (`it.each`, 4 filas: error, missing-config, unreachable, rejection) | `geofences-action-error` con `text-danger` | `text-15 leading-body text-danger` (M1) | R11 |
| `#41 R7` › `pinta los dos borrados con sus recetas y como tercer hijo (enmendado por #189 R5)` | papelera con `bg-danger-soft` | papelera con `bg-category-rose` | R6 |
| `#41 R7` › `deshabilita los dos borrados mientras el interruptor escribe y no abre Alert` | espía de `Alert.alert` sin llamadas | `geofences-delete-dialog` no existe | R8 |
| `#41 R7` › `abre la confirmación nativa exacta y Cancelar no borra` | `Alert.alert` con título, cuerpo y botones | pulsa `geofences-delete-dialog-cancel`; mismos literales en `-title`, `-body`, `-cancel`, `-confirm` | R8 |
| `#41 R7` › `confirmar borra una vez y quita la tarjeta con la lista recargada` | invoca el `onPress` destructivo del espía | pulsa `geofences-delete-dialog-confirm` | R8 |
| `#41 R7` › el `it.each` de errores del borrado | confirma vía espía de `Alert` | confirma vía `-confirm` | R8 |
| `#41 R7` › `cierra la sesión una vez ante unauthorized del borrado` | confirma vía espía de `Alert` | confirma vía `-confirm` | R8 |
| `#189 R1` › `#189 R1.2: el título de %s tiene clase, rol y posición exactos (enmendado por #189 R3) (enmendado por E4 R21)` | `geofences-title` primer hijo de `geofences-header` con `paddingLeft` | `geofences-header-title` (clase de #197 R19) dentro de `geofences-header` | R1 |
| `#189 R1` › `#189 R1.3: cuenta %i zonas con la lista cargada` | `geofences-header` con 2 hijos | `geofences-counter` es el último hijo de la fila de `ScreenHeader` | R1 |
| `#189 R1` › `#189 R1.2/R1.3: %s conserva solo el título` | `geofences-header` con 1 hijo (`geofences-title`) | sin `geofences-counter`; título `geofences-header-title` | R1 |
| `#189 R5` › `#189 R5: cada fila conserva su dato, icono, tinta, tipografía, destino y acciones` | icono `Map`, papelera `bg-danger-soft`, borrado vía `Alert` | `geofence-${id}-glyph`, `bg-category-rose`, borrado vía diálogo; `trash.props.hitSlop` sigue `undefined` (R6 no añade `hitSlop`, M3) | R3, R6, R8 |
| `#189 R5: filas con tile pastel, textos y controles` › `las cinco posiciones usan verde, azul, ámbar, violeta y rosa en inglés` | `getByTestId('geofences-icon-map', …).props.color` = `category-${slot}-strong` por posición | `props.stroke` de `geofence-${id}-glyph` = el mismo color literal por posición (F1) | R3 |
| `#189 R5: filas con tile pastel, textos y controles` › `family conserva tile y columna, nombre seleccionable y chip sin controles` | `props.color` de `geofences-icon-map` por fila | `props.stroke` de `geofence-${id}-glyph` por fila (F2) | R3 |
| `#189 R6` › `#189 R6: compone el aviso de %s tras las cinco filas` | icono `AlertCircle`; texto `flex-1 text-13 <ink>` | `AlertTriangle`; `flex-1 text-13 leading-note <ink>` | R5 |

### `screens/geofence-editor/index.test.tsx` (GE)

| describe › it | Hoy afirma | Pasa a afirmar | R |
|---|---|---|---|
| (cabecera) import de `EDITOR_PILL_LEFT`/`HEADER_BAR_HEIGHT` y doble de `Stack.Screen` | existen | se borran (commit rojo de R12; el doble de `Stack.Screen` en el de R17) | R12, R17 |
| `#146 R6` › `pinta el esqueleto mientras carga la lista al editar (enmendado por #189 R14)` | `contentInsetAdjustmentBehavior: 'automatic'` y `paddingTop: 24`; `skeleton__root h-24 w-full rounded-card` | R17: sin `contentInsetAdjustmentBehavior` y `paddingTop: 40 + 12`; R18: las tres barras (M6) | R17, R18 |
| `#146 R6` › `pinta %s con Reintentar, que vuelve a pedir solo la lista` | `geofence-editor-load-error` `text-danger` | `text-15 leading-body text-danger` | R19 |
| `#146 R6` › `compone mapa y formulario sin fondo sobre el mapa y con las métricas A11 en el formulario (enmendado por #189 R9) (enmendado por E4 R22)` | hijos `['geofence-editor-map', 'geofence-editor-form']`; hoja `-mt-6.5 rounded-t-hero bg-surface` | hijos `['geofence-editor-map', 'geofence-editor-form-entrance']`; hoja `rounded-t-hero bg-surface` | R13 |
| `#189 R9: hoja estática solapada y capas del mapa` › `#189 R9: compone la hoja al %s sin fondo que tape el mapa (enmendado por E4 R22)` (`it.each`, 3 filas) | `childTestIds(root)` = `['geofence-editor-map', 'geofence-editor-form']`; `form.props.className` = `'-mt-6.5 rounded-t-hero bg-surface'` | `['geofence-editor-map', 'geofence-editor-form-entrance']`; `'rounded-t-hero bg-surface'` (F5) | R13 |
| `#146 R8` › `pinta Guardar con la receta primaria tras la nota de reinicio (enmendado por #189 R13)` | `flex-2 h-14 rounded-16 bg-accent` | `flex-2 h-13.5 rounded-16 bg-accent` | R15 |
| `#146 R8` › `pinta %s bajo Guardar y conserva el borrador (enmendado por #189 R13)` (`it.each`, 8 filas) | `geofence-editor-error` `text-danger` | `text-sm leading-body text-danger` (M5) | R16 |
| `#146 R14` › `pinta Eliminar con la receta de peligro justo después de Guardar (enmendado por #189 R13)` | `h-14` | `h-13.5` | R15 |
| `#146 R14` › `pide confirmación con el nombre de la zona y Cancelar no borra` | espía de `Alert.alert` | `geofence-editor-delete-dialog` y `-cancel` | R9 |
| `#146 R14` › `al confirmar borra una vez y vuelve a la lista recargada` | `onPress` destructivo del espía | `-confirm` | R9 |
| `#146 R14` › `deshabilita Eliminar, Guardar y el interruptor mientras borra` | confirma vía espía | confirma vía `-confirm` | R9 |
| `#146 R14` › `pinta Eliminar en inglés` | `Alert.alert` en inglés | diálogo en inglés | R9 |
| `#146 R14: Eliminar en el editor borra la zona y vuelve a la lista` › `un fallo al borrar pinta el error y no vuelve` | confirma con `alertButton(catalog.es['geofences.delete']).onPress?.()` | confirma pulsando `geofence-editor-delete-dialog-confirm` (F3) | R9 |
| `#146 R14: Eliminar en el editor borra la zona y vuelve a la lista` › `un 401 al borrar cierra sesión una vez` | confirma con `alertButton(…)` | confirma pulsando `geofence-editor-delete-dialog-confirm` (F4) | R9 |
| (helper del describe `#146 R14`) `alertButton`, que lee `Alert.alert.mock.calls.at(-1)?.[2]` | existe | se borra en el rojo de R9, cuando ningún `it` lo usa | R9 |
| `#146 R16` › `al editar como %s pinta la zona en solo lectura (enmendado por #189 R9) (enmendado por #189 R10)` | nota `text-sm font-normal text-muted` | `text-sm font-normal leading-body text-muted` | R16 |
| `#146 R16` › `al crear sin ser dueño pinta la tarjeta de solo dueño` | `… items-center py-8` | `… items-center px-4 py-6`; texto `STATE_TEXT` | R17 |
| `#189 R8` › `#189 R8: título del formulario al %s en %s (%s) (enmendado por E4 R22)` | fila `absolute justify-center`, `{ top: 40, left: 70, height: 56 }`, hijos `['geofence-editor-title-blur']` | fila de R12 con `top: 40 + 8` e hijos `['geofence-editor-back-blur', 'geofence-editor-title-blur']` | R12 |
| `#189 R8` › `#189 R8: título plano primero en %s` | `geofence-editor-title` plano primer hijo | `geofence-editor-header` primer hijo con `geofence-editor-header-title` | R17 |
| `#189 R11` › `#189 R11: en lectura conserva solo el valor sin bloque editable` | `font-bold text-foreground` | `text-15 font-bold text-foreground` | R16 |
| `#189 R13` › el `it.each` de recetas de acciones y `#189 R13: busy bloquea ambos botones conservando las recetas` | `h-14` | `h-13.5` | R15 |
| `#189 R14` › `#189 R14: título y aviso con métricas de canvas en %s` | `contentInsetAdjustmentBehavior: 'automatic'`, `paddingTop: 24`, título plano | sin `contentInsetAdjustmentBehavior`, `paddingTop: 40 + 12`, `ScreenHeader` | R17 |
| `#189 R19.2` › `#189 R19.2: bloquea los tres controles sin atenuarlos al %s, incluso al vaciar el nombre` | rama `eliminar` confirma vía espía de `Alert` | confirma vía `-confirm` | R9 |
| `#189 R22` › los cuatro `it` (`#189 R22.1: cabecera transparente al %s`, `#189 R22.2: cabecera opaca en %s`, `#189 R22.2: restaura la cabecera opaca al pasar del formulario a estado`, `#189 R22.1/R22.2: identidad estable de opciones en %s`) | opciones de `Stack.Screen` por rama | se borran con su `describe` (no hay `Stack.Screen`) | R2, R17 |

### `app/__tests__/layout.test.tsx` (LY)

| describe › it | Hoy afirma | Pasa a afirmar | R |
|---|---|---|---|
| `le da la cabecera nativa de #95 R4 con el título de zonas seguras (enmendado por E4 R21)` | `TRANSPARENT_HEADER_OPTIONS` | `{ headerShown: false }` | R2 |
| `le da la cabecera nativa de #95 R4 con el título del editor de zonas` | cabecera nativa con título | `{ headerShown: false }` | R2 |

### Candados agregados

| fichero › it | Hoy afirma | Pasa a afirmar | R |
|---|---|---|---|
| `__tests__/profile-canvas-fidelity.test.ts` › `#173 R2.4: inventario de tamaños nuevos` › `reserva text-26 al nombre de la mascota en Perfil (enmendado por #176 R8) (enmendado por #189 R1) (enmendado por #189 R8) (enmendado por #197 R19)` | la lista incluye `screens/geofences/index.tsx` y `screens/geofence-editor/index.tsx` (y `components/screen-header.tsx`, #197 R19) | R1 quita `screens/geofences/index.tsx`; R17 quita `screens/geofence-editor/index.tsx` | R1, R17 |
| `__tests__/profile-canvas-fidelity.test.ts` › `#173 R2: inventario de radios nuevos` › `reserva rounded-hero al Card compartido y el skeleton de Perfil` | `['components/card.tsx', 'screens/alert-detail/index.tsx', 'screens/profile/index.tsx']` | `['components/card.tsx', 'components/confirm-dialog.tsx', 'screens/alert-detail/index.tsx', 'screens/profile/index.tsx']` | R7 |
| `__tests__/alerts-canvas-fidelity.test.ts` › `#174 R12: inventarios` › `limita $token a su inventario de producción (enmendado por #189 R1) (enmendado por #189 R8) (enmendado por #189 R12) (enmendado por #197 R4) (enmendado por #197 R10) (enmendado por #197 R19)`, fila `tracking-title` | incluye las dos pantallas de zonas | R1 quita `screens/geofences/index.tsx`; R17 quita `screens/geofence-editor/index.tsx` (el título vive en `ScreenHeader`) | R1, R17 |
| el mismo `it.each`, fila `text-15` | sin `components/confirm-dialog.tsx` ni `screens/geofences/index.tsx` | R7 añade `components/confirm-dialog.tsx` tras `components/celebration.tsx`; R11 añade `screens/geofences/index.tsx` tras `screens/geofence-editor/index.tsx` | R7, R11 |
| `__tests__/design-drift.test.ts` › `#178 R13: Recordatorios sin deriva` › `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto (enmendado por #177 R10)`, mapa `rounded16` | `'screens/geofence-editor/index.tsx': 3, // #189 R13` | `4` (barra 2 de R18); la lista de `rounded-14` es por fichero y Zonas ya está | R18 |
| `__tests__/chunky-cta-canvas-fidelity.test.ts` › `#177 R3.1: %s pinta la receta cta de %s (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por E4 R19) (enmendado por E4 R20)` (`CTA_ROWS`) | `flex-2 h-14 rounded-16 bg-accent` | `flex-2 h-13.5 rounded-16 bg-accent` | R15 |
| `__tests__/chunky-cta-canvas-fidelity.test.ts` › `#177 R4.1: %s pinta la receta neutra de %s (enmendado por E4 R19)` (`NEUTRAL_ROWS`) | `flex-1 h-14 rounded-16 border-2 border-lip-gray bg-surface` | `flex-1 h-13.5 rounded-16 border-2 border-lip-gray bg-surface` | R15 |
| `__tests__/chunky-cta-canvas-fidelity.test.ts` › `#177 R7.3: inventario de los veintisiete radios de dieciséis (enmendado por #191 R11) (enmendado por #189 R7) (enmendado por #189 R13)` | mapa `radii` editor 3; total `26 + 1 + 1 + 1 + 2` | editor 4; total `26 + 1 + 1 + 1 + 2 + 1 // #202 R18` | R18 |
| `__tests__/consistency-classnames.test.ts` › `#189 R9: la hoja del Editor combina esquina continua y flex sin perderlos (enmendado por E4 R19) (enmendado por E4 R22)` (`it` de nivel raíz) | `toContain('style={[CONTINUOUS_CORNER, { flexGrow: 0, flexShrink: 1 }]}')` | `toContain('style={[CONTINUOUS_CORNER, { flexGrow: 0, flexShrink: 1 }, shadows.sheet]}')`; el import `{ CONTINUOUS_CORNER, KEEP_OPACITY, TABULAR_NUMS }`, `\bCONTINUOUS_CORNER\b` ×2 y la línea del `KeyboardAvoidingView` no cambian (M8) | R13 |
| `__tests__/ui-language.test.ts` › `#41 R10: las zonas seguras resuelven su copy por clave` › `registra cada ocurrencia de la pantalla y de su cabecera (enmendado por #189 R1) (enmendado por #189 R2)` | `R14_GEOFENCES` `toHaveLength(18 + 1 + 1 + 1 + 1)`; `checkUses` con la cuenta exacta de `t('clave'` por fichero | `toHaveLength(18 + 1 + 1 + 1 + 1 + 1)` por la fila de `geofences.loadingLabel` (1 uso); `geofences.title` y las cuatro claves del borrado conservan su cuenta (Base medida) | R10 |
| `__tests__/ui-language.test.ts` › `#146 R10: el editor de zonas resuelve su copy por clave` › `registra cada ocurrencia del editor y de sus entradas (enmendado por #189 R1)` | `R15_GEOFENCE_EDITOR` `toHaveLength(27 - 1 + 2 + 3)`; `checkUses` por fichero | `toHaveLength(27 - 1 + 2 + 3 + 1)` por la fila de `geofenceEditor.loadingLabel` (1 uso); `geofenceEditor.title` sigue en 2 y las claves del borrado en 1/1/1/2 (Base medida) | R18 |
| `providers/__tests__/language-provider.test.tsx` › `#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros` › `#194 R1: mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas (enmendado por #189 R15)` | último sumando `+ 7, // #194 R1 (+2); #189 R15 (+5)` | R10 añade `+ 1 // #202 R10` y R18 `+ 1 // #202 R18` sobre la cifra de la base re-basada | R10, R18 |
| `__tests__/canvas-foundations.test.ts` (#197) › `describe('#197 R20: cimientos sin cablear')` entero: `#197 R20: nadie monta todavía los cimientos %s` (4 casos: toggle-switch, screen-header, shadows, rise-in) y `#197 R20: el layout raíz no cambia` | nadie importa los cimientos; `headerShown` 2 veces y sin `ScreenHeader` en `_layout.tsx` | se borra el `describe` entero, sin sufijo ni reemplazo, en el primer commit rojo de #202 que monta un cimiento o toca `src/app/_layout.tsx`: el de R7 (`ConfirmDialog` es el primero que importa `rise-in` y `shadows`) | R7 |

Sin fila, verificados contra R1-R18: CC `#62 R14` › `%s importa y aplica sus %i esquinas (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9)` y CC `#98 R10` › `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban (enmendado por #177 R10) (enmendado por #190 R13)` (Zonas conserva sus 3 `style={CONTINUOUS_CORNER}`: tile, papelera y aviso; el esqueleto de R10 usa `Card`, que pone su esquina dentro; F6 y A6 resueltos así); `legibility-classnames` (`inkSites` cerrado; `requestsAccent` = `empty-state`, `toggle-switch`, `theme/shadows`, y #202 no llama `useThemeColors` con `'accent'`); `tab-headers-canvas`; `theme/__tests__/motion.test.ts` › `#152 R1` › `no exporta nada más (enmendado por #195 R13) (enmendado por #197 R11)` (#202 no añade exportaciones a `theme/motion.ts`, solo consume `MOTION_TRANSITION_MS`); `theme/__tests__/global-css.test.ts` `#197 R3` (cuenta declaraciones, no usos); design-drift `limita text-22 a Horario y text-17 al inventario de E1.2` (las dos pantallas conservan `text-17` en Añadir y Guardar); `heroui-text-size-merge` (A5); `empty-state` (A7); CC `#166 R2`/`R3`; UL
`#65 R18: los sitios resuelven por clave y no queda copy suelta` (`checkUses(ALL_USES)`
verde con las dos filas nuevas; `SCREEN_FILES` no cambia porque las filas
caen en ficheros que ya están y `ConfirmDialog` no llama a `t`).

**Enmienda mecánica permitida**: si un `it` no inventariado se pone rojo solo porque compara contra el literal exacto que el R-id quita o sustituye (directo o vía constante/helper del test), el implementador lo enmienda en el commit rojo de ese R con el sufijo y lo apunta en la tabla «Enmiendas mecánicas» de su informe. Cualquier otro rojo no inventariado sigue siendo motivo de parada.

## Erratas del leader (2026-10-24)

Firmadas por delegación (mandato del humano del 2026-10-23, `progress/plan_canvas-parity-2026-10-23.md` §4).

**R7.1, margen del velo (parada de Codex tras el verde de R1).** El velo de `canvas/ZonasEliminar.dc.html` centra la tarjeta con `padding: 0 28px`, no con 24 px. R7.1 pasa a ser `View testID={testID} className="flex-1 justify-center px-7"` (`--spacing` es `0.25rem`, así que `px-7` mide 28 px). El resto de R7 coincide con el artboard y no cambia. Tests:

- CD `#202 R7: monta velo, tarjeta y acciones con las recetas del canvas` espera `flex-1 justify-center px-7` en el `View` raíz.
- ZF `#202 R7: el canvas dibuja el diálogo de borrado` añade a lo que ya afirma de `ZonasEliminar.dc.html` el literal `padding: 0 28px`.

Como los commits de R7 ya existen, van en dos commits propios antes del siguiente R pendiente: `test(#202): R7 align the dialog inset with the frozen canvas` (rojo: CD falla porque recibe `px-6`) y `feat(#202): R7 inset the dialog 28 px like the canvas` (solo cambia `px-6` por `px-7` en `src/components/confirm-dialog.tsx`). No se reescriben los commits anteriores.

**Errata R7.4 (rol del título, a posteriori del reviewer, N3).** R7.4 prescribe `role="header"` en el título del diálogo. En RN 0.86 esa prop da TS2769 en `Text`, así que la implementación usa `accessibilityRole="header"` (par rojo/verde `1842bba0` → `1ca6234f`), y CD lo bloquea con `getByRole('header')`. La receta de R7.4 queda `Text testID={`${testID}-title`} accessibilityRole="header"`. El comportamiento accesible es el mismo y no hay cambio de código.

**Regla de recuentos agregados.** Si al llegar a verde una R se pone rojo un `it` que no está en el inventario y ese `it` solo cuenta usos o ficheros de un literal o token, Codex lo enmienda sin parar. Son de este tipo los inventarios cerrados de radios, de `style={CONTINUOUS_CORNER}`, de `text-NN` o de `<Card`, las sumas de copy y los suelos del escáner HeroUI. La condición es que el delta medido sea exactamente el número de usos que el diff de esa R, tal como esta spec la prescribe, añade o retira. La enmienda:

- da a la cifra o a la entrada su término (`// #202 Rn`, o `; #202 Rn: ±k` dentro de un comentario que ya exista);
- da al título el sufijo ` (enmendado por #202 Rn)`, o añade `Rn` al paréntesis de #202 si ya existe;
- va en el commit rojo de esa R; si ese rojo ya está commiteado, en un commit propio `test(#202): Rn amend the <candado> inventory` antes del siguiente R;
- se apunta en la tabla «Enmiendas mecánicas» del reporte con candado, antes, después y R.

El fichero de test de ese candado entra en la lista cerrada solo para esa enmienda. Sigue siendo PARADA si el delta no coincide, si el `it` afirma comportamiento o estructura y no un recuento, o si la enmienda exigiría cambiar producción.

## Desviaciones conscientes del canvas

- Volver del formulario del Editor: chevron 24 de `BackButton` (canvas 22); no se añade prop `size` (D3).
- Entrada de la tarjeta del diálogo: 400 ms de `RiseIn` (canvas 300 ms) (D8).
- Radio 14 de los enlaces del diálogo: se omite; no tienen fondo y el radio no se ve.
- «Reintentar» conserva la receta de hoy (`Button` `min-h-11`); el canvas pide 44 de alto, `padding: 0 20px`, radio 14 y labio (D9).
- Pulso de los esqueletos: el de `Skeleton` de heroui, no el del artboard.
- Trazo 3 del círculo, centro, asa y `breathe` del mapa: fuera (D6).
- Sombras de cristal en el Editor: `BlurView` con `overflow-hidden` puede recortarlas en iOS; el smoke es solo Android.

## Fuera de alcance

- `PetMap` (trazo 3, centro r9, asa r10, `breathe`): #192 y #201 (D6).
- Receta global de «Reintentar»: se queda la de hoy en todas las pantallas (D9).
- `EmptyState` (imagen 160, tipografía): no se extiende; lo lleva #198.
- Pantallas de #198, #199 y #201: no se tocan.
- Otros `Alert.alert` de la app (recordatorios, documentos): siguen nativos; `ConfirmDialog` solo se monta en Zonas y Editor.
- Backend, AWS y dependencias nuevas: ninguno.

## Cierre del humano

Smoke en dev build Android (R26), tras el veredicto del `reviewer`:

1. Zonas: el volver de la cabecera vuelve a Perfil (y sin historial a `/profile`); título y contador en la misma fila; no aparece cabecera nativa.
2. Editor, formulario: círculo de cristal y píldora con sombra visibles sobre el mapa, en claro y oscuro; volver regresa a Zonas.
3. Editor, ramas de estado: cabecera en contenido con volver, sin cabecera nativa duplicada.
4. Diálogo de borrado en Zonas y Editor: el velo entra con fade y la tarjeta con rise; atrás de Android y el velo cierran sin borrar; «Eliminar» borra.
5. Interruptores 48x28 en las filas y en «Activa».
6. Esqueletos de Zonas y del Editor con la red lenta.
7. Teclado con la hoja: el nombre sigue visible al escribir.
8. Con «Reducir movimiento» activo: sin animaciones de entrada.

## Aprobación

Las casillas se comprueban con `[ xX]`.

- [x] Aprobado por humano (fecha: 2026-10-23)
  Firma delegada en el leader por mandato del humano del 2026-10-23
  (`progress/plan_canvas-parity-2026-10-23.md` §4, checklist de firma pasada).
  Decisiones del leader: se mantiene la constante local `SCRIM = 'rgba(13,17,23,0.4)'` en R7 (sin
  `bg-scrim`) y se acepta el `shrink` del envoltorio `RiseIn` de R13. Anclas re-medidas tras el
  merge de #197 en `dev` (81cb6d6b), 56/56; catálogo `+ 7` y `rounded-16` de chunky-cta sin mover.
  Si otra feature de la ola 2 entra antes en `dev`, el handoff re-mide esas cifras.
- [x] Enmienda de la carta (R20, `docs/ui-guidelines.md` y `docs/conventions.md`) aprobada por humano (fecha: 2026-10-23)
  Firma delegada, mismo mandato.
- [ ] Smoke de R26 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
  Va en el lote `progress/smoke_canvas-parity.md` (plan §6); el `done` no espera al smoke.
