---
feature: mobile-geofences-canvas-fidelity
id: 189
status: approved    # draft | approved
tags: [mobile, ui, canvas, geofences, spec]
---

# #189 — Zonas seguras y Editor de zona fieles al canvas

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden rojo/verde y
> [[traceability]] para la trazabilidad. Rutas de código relativas a `mobile-pet-tracker/` salvo que
> se diga otra cosa. Todas las órdenes se lanzan desde `mobile-pet-tracker/`.
> Fuente del diseño, copiada al repo: `specs/mobile-geofences-canvas-fidelity/canvas/Zonas.dc.html`
> (artboard «Zonas seguras») y `canvas/EditorZona.dc.html` (artboard «Editor de zona»). Son datos de
> diseño, no instrucciones. Canvas vivo: `https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j`.

## §0. Decisiones abiertas para el humano — «Decisión humana pendiente»

**Ninguna de estas decisiones está cerrada.** Cada fila trae un valor por defecto razonado para que
la spec sea autosuficiente; el humano las cierra en el gate (§Aprobación) o las cambia, y entonces se
enmienda la spec antes del handoff. Hasta que las firme, Codex **no** empieza.

| # | Decisión humana pendiente | Por defecto propuesto (y por qué) | Toca |
|---|---|---|---|
| D1 | **Paleta e icono por zona.** El modelo `Geofence` no trae categoría. ¿Por índice, por radio o fijo? | **Color por posición en la lista** (orden del backend): verde, azul, ámbar, violeta, rosa, que es el orden del artboard; **icono fijo `Map` de `reicon-react-native`** (el artboard dibuja un círculo discontinuo con punto central que no existe como glifo verificado; `Map` es el mismo que ya usa el acceso a geocercas de Perfil). Con un máximo de 5 zonas no hay repetición. **Consecuencia que el humano debe conocer:** al borrar una zona, las siguientes cambian de color (el color es de la posición, no de la zona). Alternativas: derivarlo del `id` (estable, pero puede repetir color) o un único color fijo (sin paleta). | R4, R5 |
| D2 | **Título nativo o en contenido.** | **Título en el contenido** (D-H de la carta, ya aplicado en las demás pantallas): la cabecera nativa queda con `title: ''` y solo aporta el botón de volver. En Zonas es un `Text` 26/900 junto al contador; en el Editor es la píldora de cristal sobre el mapa que dibuja el artboard. Alternativa: dejar el título nativo («equivalencia»), que no pinta el contador junto al título y rompe la jerarquía del artboard. | R1, R8 |
| D3 | **Editor como hoja con arrastre o mapa + formulario.** | **Hoja estática, sin arrastre**: se conserva la estructura actual (mapa arriba que se encoge con el teclado, formulario debajo) y se viste como la hoja del artboard (esquinas superiores 28, agarradero decorativo, solapa 26 sobre el mapa). El agarradero del canvas es decorativo (no hay gesto dibujado) y un arrastre real exigiría un módulo de hoja y un spike de teclado que esta feature no tiene. Se pierden dos cosas del artboard: el botón de volver de cristal (queda el de la cabecera nativa) y la sombra de la hoja (no hay token). | R9 |
| D4 | **Borrar desde la lista.** El artboard de Zonas no dibuja botón de borrar por fila; el código lo tiene hoy (#41 R7). | **Se conserva**, como botón solo-icono (papelera) de 44 × 44 a la derecha del interruptor, para no quitarle una capacidad al dueño. Alternativa: quitarlo y dejar el borrado solo en el Editor (que ya tiene «Eliminar»), que deja la fila idéntica al artboard pero añade un paso al dueño que quiere liberar cupo con el límite alcanzado. | R5 |
| D5 | **Alto de los botones del Editor.** El artboard dibuja 54; la receta global de la carta (#177) es 56. | **56 (`h-14`)**, la receta de la carta: 2 px de diferencia, y mantener `h-14` deja intactos los candados de la receta primaria. Alternativa: `h-13.5` (54 exactos) en el Editor, que obliga a enmendar #166/#177. | R13 |
| D6 | **«Eliminar» del Editor.** El artboard lo dibuja como secundario neutro con labio gris y texto rojo; hoy es tonal `danger-soft` sin labio. | **Se sigue el artboard**: secundario neutro (`border-2 border-lip-gray bg-surface`, `chunkyLip.neutral`) con la etiqueta `text-base font-extrabold text-danger`. Obliga a enmendar la carta (§13 «Sin labio» lo listaba) y los candados #177 R8.4. Alternativa: conservar el tonal. | R13 |
| D7 | **Entrada animada.** El artboard anima `rise` con escalón de 60 ms en las filas y el aviso (hoy no hay animación). | **`HomeEntrance` en las filas (índice = posición) y en el aviso (índice = nº de filas)**, 60 ms, con el reduce-motion que ya respeta el componente. El Editor no anima la hoja. Alternativa: sin animación. | R5, R6 |
| D8 | **Contador y barra para todos los roles.** | **Se pintan para cualquier rol cuando la lista carga bien** (también con 0 zonas: `0/5`, 5 segmentos vacíos): es información, no una acción. Alternativa: solo el dueño. | R1, R2 |
| D9 | **Color del segmento vacío.** El artboard solo dibuja el caso 5/5 (todo relleno). | **`bg-default`** (el neutro de las superficies de apoyo). Alternativa: `bg-lip-gray`. | R2 |
| D10 | **«Añadir zona» anclado abajo.** El artboard lo ancla al pie (`margin-top:auto`). | **Se ancla** con `mt-auto` y `flexGrow: 1` en el contenedor, como #180 (patrón de `forgot`). Alternativa: a continuación de la lista. | R3, R7 |

## §1. Base, fuente y premisas (no se reabren)

- **Base de redacción**: `origin/main` `14ec7307`. Branch `feature/189-mobile-geofences-canvas-fidelity`.
  Worktree `Pet-Tracker-wt-189`.
- **Directiva del humano** (2026-10-13): «el diseño final debe de quedar como el artifact» y «Píxel
  exacto con los tokens existentes»: ningún valor entre corchetes ni hex fuera de `src/theme/` (C8).
- **«Sin el breathe»** (descripción de la feature): el círculo del mapa del artboard del Editor late
  (`animation: breathe`). Esa animación **queda fuera** (necesita un spike sobre `GoogleMaps`, ver
  `progress/explore_canvas-parity-2026-10-16.md` N2/N3b). El círculo se sigue dibujando como hoy.
- **Piezas ya mergeadas en `14ec7307`** (P1-P9 de §2): #177 (receta global de botón, `chunkyLip`),
  #181, #186 (`FieldErrorMessage`, no toca `geofence-editor-name`), #187 (Enmienda: `text-<n>` a medida
  nunca sobre componentes de heroui), `bg-glass-surface-strong` y `BlurView` de `expo-blur` (#180),
  `HomeEntrance`, `CATEGORY_SLOTS`, `--radius-tile/14/16/hero`, `--text-11/13/17/26`.
- **Alcance**: `src/screens/geofences/index.tsx`, `src/screens/geofence-editor/index.tsx`, las dos
  `Stack.Screen` de `src/app/_layout.tsx`, `src/utils/category-palette.ts`, `src/i18n/catalog.ts`,
  `src/__tests__/ui-copy-table.ts`, los tests que cada uno mueve, la carta (`docs/ui-guidelines.md`) y los
  candados agregados de §4. **Sin cambios de backend ni de comportamiento**: lectura, escritura, borrado,
  roles, límites de 5 y de radio 20-2000, `401`, confirmación de borrado y navegación quedan como hoy.
- **Estados que el canvas no dibuja y que se conservan** (no se pierde información): carga, vacío,
  `no-tracking`, error con Reintentar, error de acción, no encontrada, solo dueño, solo lectura, nota de
  reinicio del Editor, error de guardado, chip Activa/Inactiva del no dueño.
- **Skill**: todo trabajo móvil carga `expo:expo-overview`; en el handoff a Codex se nombran las del
  catálogo de Codex (`leader.md` §Catálogo real de skills de Codex), no las nuestras.

### Mapa de `testID` (contrato; los que no aparecen no cambian)

| testID | Pantalla | Estado |
|---|---|---|
| `geofences-header`, `geofences-title`, `geofences-counter` | Zonas | nuevos |
| `geofences-progress`, `geofences-progress-segment-<0..4>` | Zonas | nuevos |
| `geofence-<id>-entrance`, `geofence-<id>-tile` | Zonas | nuevos |
| `geofences-limit-entrance`, `geofences-limit-text` | Zonas | nuevos; `geofences-limit` pasa a ser el contenedor del aviso |
| `geofence-editor-title`, `geofence-editor-grabber`, `geofence-editor-radius-label`, `geofence-editor-radius-min`, `geofence-editor-radius-max`, `geofence-editor-actions` | Editor | nuevos |
| `geofence-editor-map-hint` | Editor | **se mueve** de la hoja a la capa sobre el mapa |

## §2. Precondición y medidas en H0

«H0» es el commit del handoff a Codex. **Precondición** (si una falla, PARA y avisa al leader). Todas las
órdenes se lanzan desde `mobile-pet-tracker/`:

| # | Orden | Debe dar |
|---|---|---|
| P1 | `grep -cF -- '--radius-tile: 18px;' src/theme/global.css` | `1` |
| P2 | `grep -cF -- '--radius-14: 14px;' src/theme/global.css` | `1` |
| P3 | `grep -cF -- '--radius-hero: 28px;' src/theme/global.css` | `1` |
| P4 | `grep -cF -- '--text-13: 13px;' src/theme/global.css` | `1` |
| P5 | `grep -cF -- '--text-11: 11px;' src/theme/global.css` | `1` |
| P6 | `grep -cF -- '--glass-surface-strong: rgba(255,255,255,0.86);' src/theme/global.css` | `1` |
| P7 | `grep -cF "export function HomeEntrance" src/screens/home/home-entrance.tsx` | `1` |
| P8 | `grep -cF "from 'expo-blur'" src/screens/alert-detail/index.tsx` | `1` |
| P9 | `grep -cF "export const CATEGORY_SLOTS" src/utils/category-palette.ts` | `1` |
| P10 | `grep -cF "export const GEOFENCE_MAX_PER_PET = 5;" src/api/geofences.ts` | `1` |
| P11 | `test ! -d node_modules/reicon-react-native \|\| node -e "const r=require('reicon-react-native');for (const n of ['Map','AlertCircle','Trash']) if(!r[n]) process.exit(1)"` | exit `0` (los tres iconos existen; si falta `node_modules`, `bun install --frozen-lockfile` antes) |

**Medidas en H0** (la base se mide; el delta lo da cada R; el total esperado es base + delta; los
recuentos caducan al mergear otra feature, así que se **re-miden** al arrancar):

| # | Orden | Base al redactar | Delta | R |
|---|---|---|---|---|
| M1 | `grep -c "" src/screens/geofences/index.tsx` | 164 | informativo | - |
| M2 | `grep -cF "reicon-react-native" src/screens/geofences/index.tsx src/screens/geofence-editor/index.tsx` | 0 y 0 | +1 y 0 | R5, R6 |
| M3 | `grep -cF "category-palette" src/screens/geofences/index.tsx` | 0 | +1 | R4 |
| M4 | `grep -cF "HomeEntrance" src/screens/geofences/index.tsx` | 0 | ≥ 1 | R5 |
| M5 | `grep -cF "BlurView" src/screens/geofence-editor/index.tsx` | 0 | ≥ 1 | R8 |
| M6 | `grep -c "rounded-16" src/screens/geofences/index.tsx src/screens/geofence-editor/index.tsx` | 1 y 1 | +1 y +2 | R7, R13 |
| M7 | `grep -c "chunkyLip" src/screens/geofences/index.tsx src/screens/geofence-editor/index.tsx` | 2 y 2 | +0 y +1 | R13 |
| M8 | `grep -n "R14_GEOFENCES\|R15_GEOFENCE_EDITOR" src/__tests__/ui-language.test.ts` y las longitudes de esas dos tablas | 20 y 27 | ver §4 | R15 |
| M9 | `grep -n "title: t('geofences.title')\|title: t('geofenceEditor.title')" src/app/_layout.tsx` | 2 líneas | -2 (pasan a `title: ''`) | R1.1, R8.1 |

## §3. Requisitos funcionales

Convención de etiquetas de test (R-id → fichero), todos desde `src/`:

- **F** `screens/geofences/index.test.tsx` · **E** `screens/geofence-editor/index.test.tsx`
- **P** `utils/__tests__/category-palette.test.ts` · **L** `app/__tests__/layout.test.tsx`
- **C** `__tests__/geofences-canvas-fidelity.test.ts` (nuevo: candados de fuente y de carta)
- **I** `__tests__/ui-language.test.ts` y `providers/__tests__/language-provider.test.tsx`
- **X** candados agregados que se mueven (§4)

Los `it` nuevos van en `describe` llamados `#189 R<n>: ...` y los `it` viejos que se enmiendan llevan el
sufijo `(enmendado por #189 R<n>)`; design-drift solo tolera citas `#NNN R<n>`. Cada decisión de §0
que un `it` cierra lleva su `expect` propio (Enmienda #70, decisiones por elemento repetido: en las
filas, **un `expect` por decisión**: dato, icono, etiqueta, nombre accesible, ranura de fondo, tinta
del icono, tipografía, destino, condición de pintado, forma del contenedor, orden de hijos; la
identidad, el orden y la cardinalidad de hijos se miden con `children.length` y `childTestIds`).

### Zonas seguras (`src/screens/geofences/index.tsx`)

- **R1 — Título en el contenido y contador.**
  - **R1.1** THE SYSTEM SHALL declarar las dos `Stack.Screen` de `src/app/_layout.tsx`
    `pets/[petId]/geofences` y `pets/[petId]/geofence-editor` con `{ ...headerOptions, title: '' }`.
    **Test (L)**: `it` enmendados «declara pets/[petId]/geofences / geofence-editor … (enmendado por
    #189 R1.1)»: `title` pasa de `'t:geofences.title'` / `'t:geofenceEditor.title'` a `''`; el resto de
    opciones y la posición (undécimo y duodécimo hijo) no cambian.
  - **R1.2** THE SYSTEM SHALL pintar, como **primer hijo** del `ScrollView` `screen-geofences` y en
    **todas** las ramas (cargando, lista, vacío, no-tracking, error, 401), un `View`
    `testID="geofences-header"` con `className="flex-row items-center gap-2"` cuyo primer hijo es
    `Text testID="geofences-title" accessibilityRole="header"
    className="flex-1 text-26 font-black tracking-title text-foreground"` con el texto
    `t('geofences.title')` (EN `Safe zones`, ES `Zonas seguras`). **Test (F)**: la clase exacta, el rol,
    el texto en los dos idiomas, y que es `children[0]` del scroll en las seis ramas.
  - **R1.3** WHEN la lista llega con `kind: 'ok'` (cualquier rol, también con 0 zonas) THE SYSTEM SHALL
    pintar como **segundo hijo** de `geofences-header` `Text testID="geofences-counter"
    className="text-sm font-extrabold text-muted"` con `t('geofences.counter', { count: <nº de zonas>,
    max: GEOFENCE_MAX_PER_PET })`, que da `n/5` en los dos idiomas; en cualquier otra rama el
    encabezado tiene **un solo hijo** (`children.length === 1`). **Test (F)**: con 0, 3 y 5 zonas el
    texto es `0/5`, `3/5`, `5/5`; con `no-tracking`, error, carga y 401 el contador no existe; con
    rol `family` sí existe. Sonda de mutación: pintarlo también en `no-tracking` ⇒ rojo.
- **R2 — Barra de progreso de cinco segmentos.** WHEN la lista llega con `kind: 'ok'` THE SYSTEM SHALL
  pintar justo después de `geofences-header` un `View testID="geofences-progress"
  accessibilityRole="progressbar" className="flex-row gap-1"` con
  `accessibilityLabel={t('geofences.progressLabel', { count: n, max: GEOFENCE_MAX_PER_PET })}` y
  `accessibilityValue={{ min: 0, max: GEOFENCE_MAX_PER_PET, now: n }}`, con exactamente
  `GEOFENCE_MAX_PER_PET` hijos `testID="geofences-progress-segment-<i>"` (`i` de 0 a 4) con
  `className="h-1.5 flex-1 rounded-full bg-accent"` si `i < n` y `"h-1.5 flex-1 rounded-full
  bg-default"` si no (D9). **Test (F)**: con `n` = 0, 2 y 5, para cada segmento su clase de relleno
  (un `expect` por segmento), `children.length === 5`, el `accessibilityValue` y la etiqueta en los dos
  idiomas; con carga, `no-tracking` y error no existe. Sonda: `i <= n` ⇒ rojo con `n = 2`.
- **R3 — Métricas del contenedor y orden.** THE SYSTEM SHALL pintar el `ScrollView` `screen-geofences` con
  `className="flex-1 bg-background"`, `contentInsetAdjustmentBehavior="automatic"` y
  `contentContainerStyle` exactamente
  `{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: insets.bottom + 40, gap: 12, flexGrow: 1 }`
  (excepción de fidelidad al canvas de la carta; con `insets.bottom = 24` del test, `paddingBottom: 64`).
  El orden de hijos con la lista cargada es: `geofences-header`, `geofences-progress`, las filas (o el
  vacío), `geofences-limit-entrance` (si procede), `geofences-add` (si procede),
  `geofences-action-error` (si procede). **Test (F)**: `it` «respeta las métricas A11 bajo cabecera
  nativa» enmendado (`#189 R3`) con el `toEqual` nuevo, y un `it` nuevo con `childTestIds` del scroll
  en cuatro escenarios (dueño con 3 zonas; dueño con 5 y error de acción; `family` con 3; vacío).
- **R4 — Paleta por posición.** THE SYSTEM SHALL exportar de `src/utils/category-palette.ts`
  `ZONE_SLOT_ORDER: readonly CategorySlot[] = ['green', 'blue', 'amber', 'violet', 'rose']` y
  `zoneCategory(index: number): CategorySlot` que devuelve `ZONE_SLOT_ORDER[index % 5]` (índice entero
  ≥ 0; nunca `'neutral'`). Los nombres de clase siguen únicamente en `CATEGORY_SLOTS` (literales
  enteros). **Test (P)**: `describe('#189 R4: …')`: `zoneCategory(0..4)` devuelve `green, blue,
  amber, violet, rose` (un `expect` por índice), `zoneCategory(5)` vuelve a `green`, y ninguno de los
  seis primeros es `'neutral'`; la constante tiene `length` 5 y las cinco ranuras distintas. Sonda:
  intercambiar dos ranuras ⇒ rojo.
- **R5 — Fila de zona.** WHILE la lista está cargada y tiene zonas THE SYSTEM SHALL pintar cada zona (en
  el orden del backend, `position` 0-based) así:
  - **R5.1 Contenedor.** `HomeEntrance testID="geofence-<id>-entrance" index={position}` envolviendo
    `Card testID="geofence-<id>"` (variante `surface`) con
    `className="flex-row items-center gap-3 px-3.5 py-3 shadow-none"`: tras `twMerge` la lista de clases
    contiene `rounded-card border border-border bg-surface flex-row items-center gap-3 px-3.5 py-3
    shadow-none` (asertar con `arrayContaining`, como en Documentos) y el estilo `borderCurve:
    'continuous'`. Los hijos de la fila son, para el dueño, `[geofence-<id>-edit,
    geofence-<id>-active, geofence-<id>-delete]` y, para el no dueño, `[geofence-<id>-text-row,
    geofence-<id>-status]` donde `-text-row` es el `View` equivalente al `Pressable` de editar.
  - **R5.2 Zona editable (dueño).** `Pressable testID="geofence-<id>-edit" accessibilityRole="button"
    accessibilityLabel={t('geofenceEditor.editLabel', { name })} disabled={busy}
    className="min-h-11 min-w-0 flex-1 flex-row items-center gap-3"` (el estilo `opacity` de pulsado
    y el destino `router.push({ pathname: '/pets/[petId]/geofence-editor', params: { petId,
    geofenceId } })` no cambian), con dos hijos: el tile y la columna de textos.
  - **R5.3 Tile.** `View testID="geofence-<id>-tile" className="size-11 items-center justify-center
    rounded-14 <CATEGORY_SLOTS[zoneCategory(position)].surface>"` con `style={CONTINUOUS_CORNER}`, oculto
    a la accesibilidad (`importantForAccessibility="no-hide-descendants"` y
    `accessibilityElementsHidden`), con un único hijo `Map` de `reicon-react-native` con `size={22}` y
    `color` igual a la variable `--color-category-<slot>-strong` resuelta con `useThemeColors` (una sola
    llamada en la pantalla con los cinco tokens `category-green-strong`, `category-blue-strong`,
    `category-amber-strong`, `category-violet-strong`, `category-rose-strong`; **sin** hex).
  - **R5.4 Textos.** Columna `View className="min-w-0 flex-1"` (sin `gap`) con el nombre
    `Text testID="geofence-<id>-name" className="text-base font-extrabold text-foreground"`
    (`selectable={false}` para el dueño, `true` para el resto, como hoy) y el radio
    `Text testID="geofence-<id>-radius" className="text-xs font-normal text-muted"` con
    `t('geofences.radius', { meters: Math.round(radiusM) })` (EN `{n} m radius`, ES `Radio de {n} m`).
    Orden: nombre y luego radio.
  - **R5.5 Interruptor.** `Switch` `geofence-<id>-active` sin cambios (estado, `hitSlop`, `isDisabled`,
    etiqueta `geofences.activeLabel`, escritura `setGeofenceActive`).
  - **R5.6 Borrar (D4).** `Pressable testID="geofence-<id>-delete" accessibilityRole="button"
    accessibilityLabel={t('geofences.deleteLabel', { name })} disabled={busy}` (sin `hitSlop`: el
    objetivo ya mide 44) `className="size-11 items-center justify-center rounded-xl bg-danger-soft"`
    con `style={CONTINUOUS_CORNER}`, hijo único `Trash` de `reicon-react-native` `size={20}` con
    `color` de `useThemeColors(['danger'])`; al pulsarlo abre el `Alert.alert` de confirmación **sin
    cambios** (`geofences.deleteTitle`, `deleteBody`, `cancel`, `delete`) y confirmar llama a
    `deleteGeofence`. Ya no hay etiqueta visible «Eliminar» en la fila.
  - **R5.7 No dueño.** El chip `geofence-<id>-status` conserva su clase
    (`self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted`) y su texto
    `Activa` / `Inactiva`; el nombre es seleccionable y no hay edición, interruptor ni borrar.
  - **Test (F)**, `describe('#189 R5: …')`: con tres zonas (orden `[Casa, Parque, Veterinaria]`, la
    segunda inactiva) **un `expect` por decisión y por fila**: `children.length` del `Card`, ids de
    hijos, clase del tile (`bg-category-green`, `bg-category-blue`, `bg-category-amber`), que el
    hijo del tile es el `Map` (`type`) y su `color` es el del token `-strong` (mockear
    `useThemeColors` o resolver con `Uniwind.getCSSVariable`), tipografía de nombre y radio, nombre
    accesible del `Pressable`, destino de `router.push`, escritura del interruptor, apertura del
    `Alert` al pulsar la papelera y su `deleteGeofence`, la forma `borderCurve`, el
    `HomeEntrance` con su `index`. Las filas se barren con un `for` por **fila**, no por testID. Las
    cinco ranuras se prueban con 5 zonas (una por ranura). Los `it` de #41 R5-R8 y #146 R9 que fijan
    la clase vieja del `Card`, la columna `gap-1` y el `Button` «Eliminar» se enmiendan
    (`(enmendado por #189 R5)`); los que fijan comportamiento (interruptor, confirmación, roles,
    bloqueo mientras escribe) se conservan tal cual.
- **R6 — Aviso de límite.** WHEN el rol es dueño, la lista está `ok` y `zonas >= GEOFENCE_MAX_PER_PET`
  THE SYSTEM SHALL pintar, entre las filas y `geofences-add`, `HomeEntrance
  testID="geofences-limit-entrance" index={nº de filas}` que envuelve `View testID="geofences-limit"
  className="flex-row items-start gap-2.5 rounded-tile px-3.5 py-3 <CATEGORY_SLOTS.amber.surface>"` con
  `style={CONTINUOUS_CORNER}` y dos hijos, en este orden: el icono `AlertCircle` de
  `reicon-react-native` `size={20}` con `color` del token `warning` (`useThemeColors(['warning'])`) y
  `Text testID="geofences-limit-text" className="flex-1 text-13 <CATEGORY_SLOTS.amber.ink>"` con
  `t('geofenceEditor.limitNotice', { max: GEOFENCE_MAX_PER_PET })` (ES `Esta mascota ya tiene 5 zonas, el
  máximo. Elimina una para añadir otra.`; EN `This pet already has 5 zones, the maximum. Delete one to
  add another.`). Con menos de 5 zonas, para un no dueño o con la lista no `ok`, no se pinta. **Test
  (F)**: `describe('#146 R12 …')` enmendado: cinco zonas ⇒ aviso con su texto en los dos idiomas, sus
  clases exactas, el orden `[…filas, geofences-limit-entrance, geofences-add]`, hijos del contenedor
  `[Icon, geofences-limit-text]`; cuatro zonas, `family` y error ⇒ no existe. El texto ya no cae
  en `text-sm font-normal text-muted`.
- **R7 — «Añadir zona».** WHEN el rol es dueño y la lista está `ok` THE SYSTEM SHALL pintar
  `geofences-add` como **último hijo antes del error de acción**, con `onPress` →
  `router.push({ pathname: '/pets/[petId]/geofence-editor', params: { petId } })` y etiqueta
  `t('geofenceEditor.add')` (`Añadir zona` / `Add zone`) en `Text` plano `text-17 font-extrabold`, y:
  - **R7.1** si `zonas < 5`: receta primaria de la carta §13 con `mt-auto`:
    `className="mt-auto h-14 rounded-16 bg-accent"`, `style={chunkyLip.primary}`, etiqueta
    `text-17 font-extrabold text-accent-foreground`, `isDisabled={busy}`.
  - **R7.2** si `zonas >= 5` (con `isDisabled`): receta **deshabilitada** de la carta §13 (la que
    «aplica #189»): `className="mt-auto h-14 rounded-16 bg-default"`, **sin** `style` de labio, etiqueta
    `text-17 font-extrabold text-muted`, `accessibilityState.disabled === true`. `busy` (escritura en
    curso) **no** cambia el aspecto: conserva la receta primaria con `isDisabled`.
  - Con la lista vacía el botón se pinta primario (R7.1). Un único `Button` con `testID="geofences-add"`
    (no dos ramas con el mismo id); la receta cambia por ternario de dos literales de clase.
  - **Test (F)**: enmienda de `#146 R12` y `#41 R8` (`(enmendado por #189 R7)`): clases y estilo
    en los tres casos (4 zonas, 5 zonas, vacío), etiqueta en los dos idiomas, estado deshabilitado,
    destino de `router.push` al pulsar (con 4 zonas), que con 5 no navega al pulsar, y que
    `style` de la receta deshabilitada **no** contiene `chunkyLip`. Sonda: aplicar `bg-default` con 4
    zonas ⇒ rojo.

### Editor de zona (`src/screens/geofence-editor/index.tsx`)

- **R8 — Título en el contenido.**
  - **R8.1** Ver R1.1 (la cabecera nativa del Editor queda con `title: ''`).
  - **R8.2** WHEN el Editor pinta el formulario (rama `GeofenceEditorForm`) THE SYSTEM SHALL pintar sobre
    el mapa, dentro de `View testID="geofence-editor-map"`, **después** de `PetMap`, una píldora de
    cristal `BlurView testID="geofence-editor-title-blur" intensity={48}
    blurMethod="dimezisBlurViewSdk31Plus" tint={claro|oscuro según useUniwind().theme}
    className="absolute left-4 top-3 overflow-hidden rounded-full"` (mismo patrón que
    `alert-detail-distance-blur`) con un hijo `Text testID="geofence-editor-title"
    accessibilityRole="header" className="bg-glass-surface-strong px-4 py-2.5 text-base font-extrabold
    text-foreground"` y el texto `t('geofenceEditor.title')` (`Zona segura` / `Safe zone`).
  - **R8.3** WHEN el Editor pinta cualquier otra rama (esqueleto, `no-tracking`, error de carga,
    no encontrada, solo dueño) THE SYSTEM SHALL pintar como **primer hijo** del `ScrollView`
    `screen-geofence-editor` `Text testID="geofence-editor-title" accessibilityRole="header"
    className="text-26 font-black tracking-title text-foreground"` con el mismo texto.
  - **Test (E)**: R8.2 con el formulario (editar, crear, solo lectura): existe, clase exacta,
    texto en los dos idiomas, padre `BlurView` con su `className`, y es hijo de `geofence-editor-map`
    **después** del mapa; R8.3 en las cinco ramas: primer hijo con la clase exacta. Sonda: pintar la
    píldora antes del mapa ⇒ rojo.
- **R9 — Hoja sobre el mapa (D3).** THE SYSTEM SHALL conservar la estructura `KeyboardAvoidingView
  testID="screen-geofence-editor"` (`className="flex-1"`, `behavior="padding"`,
  `keyboardVerticalOffset={headerHeight}`) con hijos `[geofence-editor-map, geofence-editor-form]` y:
  - **R9.1** el mapa `View testID="geofence-editor-map" className="flex-1"` (sin fondo opaco: ningún
    ancestro de `PetMap` lleva `bg-*`) con `PetMap` sin cambios de props, la píldora de R8.2 y, cuando
    **no** es solo lectura, `BlurView testID="geofence-editor-map-hint-blur" intensity={48}
    blurMethod="dimezisBlurViewSdk31Plus" tint=… className="absolute bottom-9 self-center
    overflow-hidden rounded-full"` con `Text testID="geofence-editor-map-hint"
    className="bg-glass-surface-strong px-3 py-1.5 text-xs font-bold text-foreground"` y
    `t('geofenceEditor.mapHint')` (sin cambios de copy). En solo lectura la sugerencia no existe.
  - **R9.2** la hoja `ScrollView testID="geofence-editor-form"` con
    `className="-mt-6.5 rounded-t-hero bg-surface"`, `style` que contiene `{ flexGrow: 0, flexShrink: 1 }` y
    `CONTINUOUS_CORNER`, `keyboardShouldPersistTaps="handled"` y `contentContainerStyle` exactamente
    `{ paddingHorizontal: 20, paddingTop: 12, gap: 14, paddingBottom: insets.bottom + 36 }` (con
    `insets.bottom = 24`: `paddingBottom: 60`). Es la excepción de fidelidad al canvas de la carta.
  - **R9.3** primer hijo del contenido de la hoja: `View testID="geofence-editor-grabber"
    className="h-1.25 w-10 self-center rounded-full bg-lip-gray"`, decorativo
    (`importantForAccessibility="no-hide-descendants"`, `accessibilityElementsHidden`).
  - **Test (E)**, `describe('#189 R9: …')`: `it` «compone mapa y formulario sin fondo sobre el mapa y con
    las métricas A11 en el formulario» **enmendado** (clase y `contentContainerStyle` nuevos; el
    bloque del teclado `paddingBottom: 291` **se conserva idéntico**: es el candado de la regresión de
    edge-to-edge) y `it` nuevos: ningún ancestro de `PetMap` con `bg-`; grabber primer hijo, oculto a la
    accesibilidad; sugerencia presente solo para dueño. Sonda: dar `bg-surface` al `View` del mapa ⇒
    rojo.
- **R10 — Campo Nombre.** WHEN el rol es dueño THE SYSTEM SHALL pintar (tras el agarradero) el
  `TextField` con `Label` cuya etiqueta es `Label.Text className="text-sm font-extrabold
  text-foreground"` (`t('geofenceEditor.nameLabel')`, `Nombre` / `Name`; el `className` va en
  `Label.Text` porque en el `Label` de heroui es inerte) y `Input testID="geofence-editor-name"
  className="h-12.5 rounded-xl bg-default px-3.5"` con `maxLength={120}`, `value`, `onChangeText` sin
  cambios. Para el no dueño sigue `Text testID="geofence-editor-name-text"` seleccionable con
  `className="text-base font-extrabold text-foreground"`. **Test (E)**: la etiqueta existe como
  `Label.Text` con la clase y el texto en los dos idiomas, la clase del `Input`, `maxLength`, escribir
  actualiza el campo (el `it` existente se conserva), y la clase del nombre de solo lectura.
- **R11 — Bloque Radio.** THE SYSTEM SHALL pintar tras el campo Nombre un `View
  testID="geofence-editor-radius-block" className="gap-2"` con, en orden:
  - fila `View className="flex-row justify-between"` con `Text testID="geofence-editor-radius-label"
    className="text-sm font-extrabold text-foreground"` = `t('geofenceEditor.radiusTitle')`
    (`Radio` / `Radius`) y `Text testID="geofence-editor-radius-value" selectable style={TABULAR_NUMS}
    className="text-sm font-extrabold text-accent-strong"` = `t('geofences.radius', { meters })`
    (sin cambios de copy, se pinta como hoy el redondeo del radio);
  - el `Slider testID="geofence-editor-radius"` **sin cambios de comportamiento** (rango 20-2000, paso
    10, `onChange`, `onChangeEnd` y las acciones de TalkBack `increment`/`decrement` de
    `geofence-editor-radius-thumb` con `accessibilityLabel` `geofenceEditor.radiusLabel`);
  - fila `View className="flex-row justify-between"` con `Text testID="geofence-editor-radius-min"
    className="text-11 font-semibold text-muted"` = `t('geofenceEditor.meters', { meters: 20 })` y
    `Text testID="geofence-editor-radius-max"` de la misma clase = `t('geofenceEditor.meters',
    { meters: 2000 })` (`20 m` / `2000 m` en los dos idiomas).
  En solo lectura el bloque no existe: se pinta `geofence-editor-radius-value` suelto como hoy
  (clase `font-bold text-foreground`, sin cambios) y `geofence-editor-read-only`. **Test (E)**:
  `#146 R7` se conserva (los toques y el slider siguen moviendo el borrador); nuevos: orden y clases
  del bloque, que `radius-min`/`radius-max` coinciden con `minValue`/`maxValue` del `Slider` (no
  literales repetidos en el test: se leen de las props), que el valor se actualiza al mover el slider y
  que el bloque no existe en solo lectura. Sonda: `maxValue={2001}` ⇒ rojo por el candado de
  coincidencia.
- **R12 — Fila «Activa».** WHEN se edita una zona existente como dueño THE SYSTEM SHALL pintar tras el
  bloque Radio `View testID="geofence-editor-active-row" className="flex-row items-center
  justify-between gap-3"` con `Text className="text-15 font-bold text-foreground"` =
  `t('geofences.statusActive')` y el `Switch geofence-editor-active` sin cambios (`isSelected`,
  `hitSlop`, `isDisabled={busy}`, etiqueta, escritura). Al crear no existe. **Test (E)**: `#146 R13`
  se conserva y se enmienda solo el orden de hijos; nuevo `expect` de la clase de la etiqueta.
- **R13 — Acciones (D5, D6).** THE SYSTEM SHALL pintar al final de la hoja (tras la nota de reinicio, que se
  conserva sin cambios, y antes del error) `View testID="geofence-editor-actions"
  className="flex-row gap-2.5"` con, en este orden y en este `View`:
  - **R13.1** «Eliminar» (solo al editar como dueño): `Button testID="geofence-editor-delete"
    variant="outline" className="flex-1 h-14 rounded-16 border-2 border-lip-gray bg-surface"
    style={chunkyLip.neutral}` `isDisabled={busy}`, con etiqueta `Text className="text-base
    font-extrabold text-danger"` = `t('geofences.delete')` (`Eliminar` / `Delete`); mantiene la
    confirmación (`Alert.alert` con `geofences.deleteTitle`, `deleteBody`, `cancel`, `delete`) y la
    llamada a `deleteGeofence` + `leave()`. La clase **empieza por `flex-1` y no la
    interrumpe** para que el ancla `h-14 rounded-16 border-2 border-lip-gray bg-surface` de los
    candados siga contigua.
  - **R13.2** «Guardar»: `Button testID="geofence-editor-save"`, con `onPress={() => void save()}`
    y etiqueta `t('geofenceEditor.save')` (`Guardar` / `Save`) en `Text` plano. Con nombre válido
    (`name.trim() !== ''`): receta primaria `className="flex-2 h-14 rounded-16 bg-accent"`,
    `style={chunkyLip.primary}`, etiqueta `text-17 font-extrabold text-accent-foreground`. Con nombre
    vacío o de solo espacios: receta **deshabilitada** `className="flex-2 h-14 rounded-16 bg-default"`,
    sin labio, etiqueta `text-17 font-extrabold text-muted`, `accessibilityState.disabled === true`.
    `busy` mantiene `isDisabled` y la receta primaria. `isDisabled={busy || name.trim() === ''}` no
    cambia.
  - **Test (E)**: `#146 R8` y `#146 R14` enmendados (`(enmendado por #189 R13)`): clases y estilos de
    los dos botones en cada estado (nombre válido, vacío, solo espacios, ocupado), orden
    `[geofence-editor-delete, geofence-editor-save]` al editar y solo `[geofence-editor-save]` al
    crear (`children.length`), `geofence-editor-actions` sigue a la nota de reinicio, confirmación,
    borrado, 401 y bloqueo mientras escribe **sin cambios**. Sonda: `bg-default` en Guardar con nombre
    válido ⇒ rojo.
- **R14 — Estados y avisos que se conservan.** THE SYSTEM SHALL conservar sin cambios de copy ni de
  lógica: `geofence-editor-loading`, `-no-tracking`, `-load-error` + `-retry`, `-not-found`,
  `-owner-only`, `-read-only`, `-reset-note` (`text-sm font-normal text-muted`) y `-error`
  (`text-danger`); y las ramas de estado (R8.3) usan las métricas
  `{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: insets.bottom + 40, gap: 12 }` en su
  `ScrollView` `screen-geofence-editor` con `className="flex-1 bg-background"` y
  `contentInsetAdjustmentBehavior="automatic"`. **Test (E)**: `#146 R6` y `#146 R16` se conservan; un `it`
  nuevo mide las métricas de las ramas de estado y que el título (R8.3) las precede.

### Compartidos

- **R15 — Catálogo y tabla de copia.** THE SYSTEM SHALL añadir a `src/i18n/catalog.ts`, en `en` y en
  `es`, cinco claves:

  | Clave | EN | ES |
  |---|---|---|
  | `geofences.counter` | `{{count}}/{{max}}` | `{{count}}/{{max}}` |
  | `geofences.progressLabel` | `{{count}} of {{max}} zones used` | `{{count}} de {{max}} zonas usadas` |
  | `geofences.deleteLabel` | `Delete {{name}} zone` | `Eliminar zona {{name}}` |
  | `geofenceEditor.radiusTitle` | `Radius` | `Radio` |
  | `geofenceEditor.meters` | `{{meters}} m` | `{{meters}} m` |

  y mover en `src/__tests__/ui-copy-table.ts` las filas de título de `src/app/_layout.tsx` a su pantalla
  (`R14_GEOFENCES`: `geofences.title` en `src/screens/geofences/index.tsx`; `R15_GEOFENCE_EDITOR`:
  `geofenceEditor.title` en `src/screens/geofence-editor/index.tsx`) y añadir una fila por **cada
  llamada literal `t('<clave>'` nueva** en las pantallas (`geofences.counter`, `geofences.progressLabel`,
  `geofences.deleteLabel` en R14; `geofenceEditor.radiusTitle` y `geofenceEditor.meters` (una fila por
  llamada) en R15), y quitar las filas de usos que desaparecen. **Test (I)**: la longitud del
  catálogo (`language-provider.test.tsx` ~línea 50) sube en 5; la tabla de claves (~289-338) añade las
  cinco filas con su EN y ES; `ui-language.test.ts` (líneas ~262 y ~272) recalcula
  `R14_GEOFENCES` y `R15_GEOFENCE_EDITOR`: **se mide, no se asume** (la tabla cuenta llamadas
  literales `t('…'` por fichero; el recuento del cierre es el de las llamadas realmente escritas).
- **R16 — Carta y dimensiones.** THE SYSTEM SHALL enmendar `docs/ui-guidelines.md` (y, si lo exige un
  candado, `docs/conventions.md`) en el mismo PR:
  - **R16.1** §A11: añadir a las excepciones de fidelidad al canvas las dos pantallas con sus métricas:
    Zonas `paddingHorizontal 20, paddingTop 24, gap 12, paddingBottom insets.bottom + 40`; hoja del Editor
    `paddingHorizontal 20, paddingTop 12, gap 14, paddingBottom insets.bottom + 36`.
  - **R16.2** §12 radios: línea «Fuera de la escala, por fidelidad al canvas (#189)»: `rounded-14`
    (tile de la zona), `rounded-tile` (aviso de límite), `rounded-t-hero` (hoja del Editor),
    `rounded-16` (botones). Las líneas de #175-#180 no se tocan.
  - **R16.3** §13: la receta **deshabilitada** pasa de «lo aplica #189» a «la aplican #189: Añadir zona
    en el límite y Guardar con nombre vacío»; «Eliminar» del Editor sale de «Sin labio» y se documenta
    como secundario neutro con etiqueta `text-base font-extrabold text-danger` (excepción a la etiqueta
    `text-17 … text-foreground` del neutro); la papelera de la fila es una excepción solo-icono
    (`size-11 rounded-xl bg-danger-soft`).
  - **R16.4** §Paleta categórica: `zoneCategory` (orden `green, blue, amber, violet, rose`) como el único
    reparto categoría → ranura de las zonas.
  - **Test (C)**: `describe('#189 R16: …')` con un `expect` por línea de la carta (`toContain` de la
    frase fija) y los candados existentes de la carta (`design-drift`, #177 R10) siguen verdes.
- **R17 — Invariantes de comportamiento.** THE SYSTEM SHALL conservar sin cambios: las llamadas a
  `listGeofences`, `getPet`, `setGeofenceActive`, `deleteGeofence`, `createGeofence`, `updateGeofence`,
  `getLastPosition`; el rol `owner` como único que edita (`family`, `walker`, `vet` y error al leer el rol
  solo leen); `GEOFENCE_MAX_PER_PET = 5`; el `401` que llama a `signOut` una vez; el bloqueo mientras
  `busy`; el `Alert` de confirmación de borrado; la navegación (`router.push` al editor, `router.back()`
  tras guardar y borrar); `zoomForRadius` y la cámara del mapa. **Test (F, E)**: los `describe` que ya
  los fijan (`#41 R5-R8`, `#146 R6-R16`, `#155 R8`, `#159 R5/R6`) **no se borran**: solo se enmiendan
  las aserciones de clase, orden y copy que R1-R14 mueven, con el sufijo de enmienda; el resto queda
  verde sin tocarse.
- **R18 — Candados de fuente.** THE SYSTEM SHALL añadir `src/__tests__/geofences-canvas-fidelity.test.ts`
  (**C**) que lee las dos pantallas y fija: ningún hex fuera de `src/theme/`, ningún valor entre
  corchetes en `className`, ningún `StyleSheet.create`, ningún emoji; `Map`, `AlertCircle` y `Trash` se
  importan de `reicon-react-native` y de ningún otro paquete de iconos; las pantallas importan
  `CATEGORY_SLOTS`/`zoneCategory` de `category-palette` y no escriben `bg-category-` ni
  `text-category-` (solo la paleta los escribe); `BlurView` de `expo-blur` solo en el Editor; ningún
  `text-<n>` a medida (`text-11/13/15/17/26`) como `className` de un componente de heroui (`Button`,
  `Button.Label`, `Label`, `Card`; Enmienda #187) y solo sobre `Text` de React Native. **Test (C)**:
  cada candado con su sonda de mutación plantada en la zona ciega (p. ej. `text-17` en `Button.Label`
  de `geofences-add` ⇒ rojo; un `bg-category-green` literal en la pantalla ⇒ rojo).

## §4. Candados agregados que se mueven (base medida en H0 + delta)

Los recuentos y los números de línea **caducan**: las líneas de abajo son anclas por contenido, no por
número, y cada cifra se **mide en H0** (orden de cada fila) y el total de cierre es base + delta. Las
filas marcadas **(enmienda)** cambian de contenido; las demás solo de recuento. Cada fichero se lanza
solo y completo tras el verde de su R.

| Candado (fichero, ancla) | Qué mide | Qué se mueve | R |
|---|---|---|---|
| `__tests__/chunky-cta-canvas-fidelity.test.ts`, `const radii` y su `describe` | `rounded-16` por fichero | `screens/geofences/index.tsx` 1 → 2; `screens/geofence-editor/index.tsx` 1 → 3 | R7, R13 |
| ídem, `CTA_ROWS` fila `geofence-editor-save` | anclas de `isDisabled` y `onPress` | ancla `isDisabled={busy \|\| name.trim() === ''}` y `onPress={() => void save()}` se conservan; la clase pasa a `flex-2 h-14 rounded-16 bg-accent` (la ancla contigua `h-14 rounded-16 bg-accent` sigue una sola vez) **(enmienda)** | R13 |
| ídem, `CTA_ROWS` fila `geofences-add` | ancla `isDisabled={busy \|\| atLimit}` | se sustituye por la expresión real (`isDisabled={busy \|\| atLimit}` se conserva; la clase pasa a `mt-auto h-14 rounded-16 bg-accent`) **(enmienda)** | R7 |
| ídem, `NEUTRAL_ROWS` y `neutralInventory` | secundarios neutros con labio | + fila `geofence-editor-delete` (`h-14 rounded-16 border-2 border-lip-gray bg-surface`, `outline`, `Text`, `text-base font-extrabold text-danger`); + `'geofence-editor-delete'` al inventario | R13 |
| ídem, `#177 R8.4` (`excluded`) | destructivos sin labio | quitar `'geofence-editor-delete'` de `excluded` **(enmienda)** | R13 |
| `__tests__/design-drift.test.ts`, `#166 R2` (`expected` de `chunkyLip.primary`) y sus `rounded16` | primarios con labio | recuento de `rounded-16` por fichero (mismo delta que arriba); el labio primario por fichero sigue en 1 (un solo `style` con ternario) | R7, R13 |
| ídem, `outsideReminders(/\brounded-14\b/)` | quién más usa `rounded-14` | añadir `join('screens', 'geofences', 'index.tsx')` (orden alfabético: antes de `meal-schedule`) **(enmienda)** | R5 |
| `__tests__/profile-canvas-fidelity.test.ts`, `rounded-tile` | reparto de `rounded-tile` | añadir `'screens/geofences/index.tsx'` entre `add-reminder` y `profile` **(enmienda)** | R6 |
| ídem, `rounded-hero` | reparto de `rounded-hero` | `rounded-t-hero` no casa con `\brounded-hero\b`: **medir**; si el candado sigue verde, no se toca | R9 |
| `__tests__/consistency-classnames.test.ts`, `style={CONTINUOUS_CORNER}` (global y por fichero) | usos del radio continuo | + usos en las dos pantallas (tile, aviso, papelera, hoja): medir base y sumar | R5, R6, R9 |
| ídem, contadores tabulares (`TABULAR_NUMS`) | cifras tabulares | el Editor conserva su uso; Zonas **no** añade (el contador `n/5` es texto, sin cifras tabulares: si se quiere, es otra decisión) | R1 |
| `__tests__/ui-language.test.ts`, longitudes `R14_GEOFENCES` y `R15_GEOFENCE_EDITOR` | filas de uso por clave | medir tras R15 | R15 |
| `providers/__tests__/language-provider.test.tsx`, longitud del catálogo (~línea 50) y tabla de claves | claves por idioma | + 5 y + 5 filas | R15 |
| `app/__tests__/layout.test.tsx` | `title` de las dos pantallas | `''` | R1.1 |
| `__tests__/legibility-classnames.test.ts` | legibilidad de textos | medir: puede contar `text-xs`/`text-11`; si se mueve, anotar | R5, R11 |

Regla para Codex: **mide la base de cada fila en H0 antes de tocarla**, escribe la cifra en
`progress/impl_mobile-geofences-canvas-fidelity.md` y rehace la suma al cerrar cada R; un candado agregado
que se queda verde sin tocarlo cuando debía moverse es una alerta (Enmienda de guardas de cadena).

### §4.1 Enmienda E1 (2026-10-21): inventarios por clase que la tabla omitió

Origen: Codex paró en R6 (con razón) al verificar que `profile-canvas-fidelity.test.ts` tiene dos
inventarios por fichero que la tabla de §4 no listaba (`text-26`, `text-13`), y el leader halló dos más
en `alerts-canvas-fidelity.test.ts` y uno de recuento en `consistency-classnames.test.ts`. Son consecuencia
directa de clases que R1, R6, R8, R12 y R13 ya prescriben. La enmienda **añade estas filas a §4** y amplía
el alcance del handoff con `alerts-canvas-fidelity.test.ts`. Las cifras de recuento se miden en el H0 de la
enmienda y el cierre es base + delta; el reparto por fichero va en orden alfabético de ruta (`sort()`).

| Candado (fichero, ancla) | Qué mide | Qué se mueve | R |
|---|---|---|---|
| `__tests__/profile-canvas-fidelity.test.ts`, `#173 R2.4` `text-26` | consumidores de `text-26` | añadir `'screens/geofence-editor/index.tsx'` y `'screens/geofences/index.tsx'` (en ese orden, tras `screens/docs/index.tsx` y antes de `screens/profile/index.tsx`) **(enmienda)** | R1, R8 |
| ídem, `text-13` | consumidores de `text-13` | añadir `'screens/geofences/index.tsx'` (tras `screens/forgot/index.tsx`, antes de `screens/login/index.tsx`) **(enmienda)** | R6 |
| `__tests__/alerts-canvas-fidelity.test.ts`, `#174 R12` `text-15` | consumidores de `text-15` | añadir `'screens/geofence-editor/index.tsx'` (tras `screens/forgot/index.tsx`, antes de `screens/home/index.tsx`) **(enmienda)** | R12 |
| ídem, `tracking-title` | consumidores de `tracking-title` | añadir `'screens/geofence-editor/index.tsx'` y `'screens/geofences/index.tsx'` (tras `screens/docs/index.tsx`, antes de `screens/meal-schedule/index.tsx`) **(enmienda)** | R1, R8 |
| `__tests__/consistency-classnames.test.ts`, `count(/border-lip-gray/g)` | usos totales de `border-lip-gray` | `4+1+1+1+1+1+1` pasa a sumar `+ 1` (el «Eliminar» neutro del Editor, `geofence-editor-delete`); medir la base y anotar el origen en el comentario `#189 R13` **(enmienda)** | R13 |

Regla para el hueco que aún pueda quedar: si al cerrar un R **otro** candado agregado por fichero o por
recuento falla porque la clase que el R prescribe ya la usan otras pantallas y el **único** delta es sumar
`screens/geofences/index.tsx` o `screens/geofence-editor/index.tsx` (o `+1` por ese uso), Codex lo enmienda en
el mismo fichero de candado con el sufijo `(enmendado por #189 R<n>)`, **solo si ese fichero ya está en la lista
cerrada del handoff**, y anota en su reporte el candado, la cifra antes/después y el R. Cualquier otro
motivo de rojo (otra pantalla que se mueve, un delta distinto, un fichero fuera de la lista) sigue siendo
PARA y reporta.

## §5. Fuera de alcance

- **La animación `breathe`** del círculo del mapa (explícita en la descripción; spike N2/N3b).
- **Arrastre de la hoja** (D3) y su módulo; **botón de volver de cristal** sobre el mapa: queda el de la
  cabecera nativa; **sombra de la hoja** (no hay token).
- **Cambios de backend**, del modelo `Geofence` (no se añade categoría ni icono al servidor) o de los
  límites (5 zonas, radio 20-2000).
- **Mensajes de campo en vivo** del nombre del Editor: lo cubre #186 para las demás pantallas y deja
  `geofence-editor-name` a esta feature, que **no** añade mensaje: el botón Guardar sigue deshabilitado
  hasta que el nombre es válido (R13.2), como decía #186 P4.
- **Otros artboards** del canvas y la unificación del patrón de cristal con #180 (extraer un componente
  `GlassPill` es una feature de refactor).
- **Dark mode propio**: los tokens ya resuelven los dos temas; no hay requisitos nuevos por tema.

## §6. Prueba de humo (humano)

En el dev build Android del PC del humano, claro y oscuro, con dueño y con un rol `family`:
1. Zonas con 0, 3 y 5 zonas: título 26/900, contador y barra, colores de tile por posición, aviso ámbar y
   botón gris solo con 5.
2. Pulsar el tile abre el Editor; el interruptor y la papelera de la fila funcionan.
3. Editor: píldora de título sobre el mapa, hoja con esquinas de 28, solapa de 26 sobre el mapa,
   Radio con 20 m y 2000 m, Eliminar (neutro) y Guardar (primario), Guardar gris con el nombre vacío.
4. Abrir el teclado en el campo Nombre: la hoja sube y no tapa el campo; el mapa se encoge.
5. Reduce motion activo: las filas aparecen sin movimiento.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-19) ← gate obligatorio antes de implementar
- [ ] Enmienda E1 (§4.1) aprobada por humano (fecha: ____) ← gate obligatorio antes de reanudar desde R6
