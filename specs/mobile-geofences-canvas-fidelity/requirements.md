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

> **Enmendado por E4 (§4.4, 2026-10-21):** R1.1, R1.2, R3, R5.5, R7.1/R7.2, R8.2, R9 (teclado y capas del
> mapa), R12, R13.1/R13.2 y R16.1 quedan sustituidos en los puntos que lista la tabla «Texto que E4
> sustituye» de §4.4 (los R-ids no cambian; los requisitos nuevos son R19-R24). Donde el texto de abajo
> choque con esa tabla, manda §4.4.
>
> **Enmendado por E5 (§4.5, 2026-10-22):** solo la aserción del estilo aplanado de `geofences-add` en el
> límite y de Guardar vacío (R19.2 (E), R20.1 y su Test (F)); la producción de R19/R20 no cambia. Donde el
> texto de E4 diga `{ opacity: 1 }` exacto para esos nodos, manda §4.5.
>
> **Enmendado por E6 (§4.6, 2026-10-22):** el «delta cero» de `consistency-classnames.test.ts` era falso para un
> `it` (import del Editor con `KEEP_OPACITY` y `keyboardVerticalOffset={0}`); ese fichero entra en la lista
> de E4 solo para ese `it`. Toda referencia a «enmienda E5» por geometría fuera de ±8 dp (R23.2, DE4-2) se
> lee **«enmienda E7»**. Donde el texto de E4 diga que ningún candado fija por texto esas importaciones,
> manda §4.6.

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
    curso) conserva la receta primaria con `isDisabled` y, **desde E4, sin atenuado** (heroui lo
    atenuaba al 50 %; `style` lo cancela). La frase original «`busy` **no** cambia el aspecto» era falsa
    (`enmendado por #189 E4 R20`).
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

### §4.2 Enmienda E2 (2026-10-21): recuentos de etiquetas de `chunky-cta` y regla ampliada

Origen: segunda parada de Codex, esta vez en `chunky-cta-canvas-fidelity.test.ts`, `#177 R6.2` («recuentos
de etiquetas»). R5.6 sustituye el `Button.Label` de la papelera de cada fila por el icono `Trash` en un
`Pressable`, y R13.1 sustituye el `Button.Label` de «Eliminar» del Editor por un `Text` plano. Cada
sustitución resta **1** a `<Button.Label` y **2** a `Button.Label` (apertura y cierre). Codex midió el
delta de R5 (19→18 y 50→48); el de R13 es idéntico y aún no ejecutado.

| Candado (fichero, ancla) | Qué mide | Qué se mueve | R |
|---|---|---|---|
| `__tests__/chunky-cta-canvas-fidelity.test.ts`, `#177 R6.2`, `count(/<Button\.Label/g)` | aperturas de `Button.Label` | `35 - 15 - 1` pasa a `35 - 15 - 1 - 1 - 1` (`// #189 R5`, `// #189 R13`): 19 → 17 al cierre; 18 tras R5 **(enmienda)** | R5, R13 |
| ídem, `count(/Button\.Label/g)` | menciones de `Button.Label` | `82 - 30 - 2` pasa a `82 - 30 - 2 - 2 - 2`: 50 → 46 al cierre; 48 tras R5 **(enmienda)** | R5, R13 |
| ídem, `count(/text-17/g)` y los tres recuentos de `<Text className="text-17 …">` | etiquetas `text-17` | **medir**: R7.2 y R13.2 prescriben una etiqueta `text-17 font-extrabold text-muted` en la receta deshabilitada, que puede sumar menciones de `text-17` o dejar de casar con el literal `<Text className="text-17 font-extrabold text-accent-foreground">` si la clase pasa a ternario. El delta se explica por R7/R13 y se enmienda con la regla de abajo | R7, R13 |

**Regla residual ampliada (sustituye a la de §4.1).** Cuando al cerrar un R un candado agregado por fichero o
por recuento se pone rojo, Codex lo enmienda en su mismo fichero (que ya esté en la lista cerrada del
handoff) con el sufijo `(enmendado por #189 R<n>)` **si y solo si** el delta medido se explica por completo
por lo que R1-R18 prescriben: sumar o quitar `screens/geofences/index.tsx` o `screens/geofence-editor/index.tsx`
de un inventario, o sumar/restar menciones de una clase o componente que ese R añade o quita (p. ej.
`Button.Label` → `Text`, ternario de clase). Debe anotar en el reporte, por candado: la aserción, la cifra
antes/después, el delta por fichero (`git diff 4204530e`) y el R que lo causa. PARA y reporta solo si el delta
**no** se explica por un R (otra pantalla que se mueve, un fichero fuera de la lista, una cifra que no cuadra
con lo prescrito) o si el candado es de otra naturaleza (copy, anclas de `isDisabled`/`onPress`, `401`).
La sonda de mutación sigue aplicando: el candado enmendado tiene que seguir poniéndose rojo si se revierte.

### §4.3 Enmienda E3 (2026-10-21): dos candados fuera de la lista cerrada

Origen: tercera parada de Codex, en R18 (`heroui-text-size-merge.test.ts` no estaba en la lista cerrada del
handoff, y §4.2 manda PARA ante un fichero fuera de la lista). El leader corrió la suite móvil completa sobre
el árbol de `0896a843` más la restauración de R18 (131 suites, 4398 tests): **solo fallan estos dos candados**,
ambos consecuencia de lo que R5, R10, R13 y R9 ya prescriben. No hay más rojos.

| Candado (fichero, ancla) | Qué mide | Qué se mueve | R |
|---|---|---|---|
| `__tests__/heroui-text-size-merge.test.ts`, `#187 R1: el escáner cubre al menos el universo medido` | pisos de nodos HeroUI y de nodos con `className` | `toBeGreaterThanOrEqual(199)` pasa a `197` (R5.6 -2 por Button y Button.Label de la papelera; R10 +1 por `Label.Text`; R13.1 -1 por el `Button.Label` de «Eliminar»); `toBeGreaterThanOrEqual(166)` pasa a `163` (R5.6 -2, R10 0, R13.1 -1). Los pisos de ficheros con HeroUI (28) y de `Card` (41) **no cambian**. Comentario `// #189 R5, R10, R13: -2, +1, -1` **(enmienda)** | R5, R10, R13 |
| `__tests__/alert-detail-canvas-fidelity.test.ts`, `#180 R5.6: solo la barra de pestañas y el detalle importan expo-blur` | quién importa `expo-blur` | añadir `'screens/geofence-editor/index.tsx'` tras `'screens/alert-detail/index.tsx'` (R9 prescribe `BlurView` solo en el Editor); título del `it` con sufijo `(enmendado por #189 R9)` **(enmienda)** | R9 |

La lista cerrada del handoff se amplía con **ambos** ficheros. El candado de `heroui-text-size-merge` que
prohíbe `text-NN` sobre HeroUI y `Card` **no se toca**: solo se bajan los dos pisos de cobertura, que son
mínimos de «al menos el universo medido», y bajan por componentes que la spec quita, no por relajar la
guarda. Tras enmendar, `heroui-text-size-merge`, `alert-detail-canvas-fidelity` y la suite completa deben
quedar verdes; la suite completa mide el total de tests en 4398 al cierre de R18 más los `it` que añada su
commit verde.

### §4.4 Enmienda E4 (2026-10-21): hallazgos del smoke Android (parpadeo, «Añadir zona» en el límite y cabeceras)

Base de medida de la enmienda: `18f86849` (HEAD de la branch al redactar). Los recuentos y las líneas
**caducan**: todo se ancla por contenido y se **re-mide en el H0 de la enmienda** (H0-E4 = commit del
handoff de E4); el total de cierre es base + delta. Los R-ids son inmutables: E4 añade **R19-R24** y
enmienda por sufijo los R anteriores (tabla «Texto que E4 sustituye»).

**Decisiones del humano ya tomadas (2026-10-21, cerradas, no se reabren)**

| # | Decisión | Dónde se cumple |
|---|---|---|
| H1 | **Parpadeo**: mientras `busy`, los `Switch` de las filas y «Añadir zona» **conservan el aspecto**. Siguen bloqueados (`isDisabled`, `accessibilityState.disabled`; el bloqueo de R17 no se toca). Solo se cancela el atenuado de heroui `disabled:element-disabled` (opacidad 0.5). Opción A de las tres propuestas. | R19, R20 |
| H1b | **«Añadir zona» en el límite (5 zonas)**: como el artboard, gris `bg-default`, texto `text-muted`, **sin** el 50 % de opacidad. | R20 |
| H2 | **Editor**: cabecera nativa **transparente** solo en la rama del formulario (`headerTransparent: true`, botón de volver nativo). El mapa sube a `y = 0`; la píldora «Zona segura» va en la misma fila que la flecha, a su derecha; `keyboardVerticalOffset` pasa a `0`. Las demás ramas conservan la cabecera opaca y el `Text` 26/900 del ScrollView. | R22 |
| H3 | **Zonas**: cabecera transparente en la ruta `pets/[petId]/geofences`; título 26/900 y contador `n/5` **en la fila de la flecha**, a su derecha; el contenido empieza bajo la cabecera. | R21 |

**Decisión humana pendiente** (cada fila trae un valor por defecto razonado; el humano las cierra al
firmar la casilla E4 o las cambia, y entonces se enmienda §4.4 antes del handoff. Codex no empieza hasta
la firma):

| # | Decisión humana pendiente | Por defecto propuesto (y por qué) | Toca |
|---|---|---|---|
| DE4-1 | **Alcance de H1 en el Editor.** H1 nombra las filas de Zonas y «Añadir zona». El Editor tiene la misma causa (`Switch` `geofence-editor-active`, `Button` `geofence-editor-delete` y `geofence-editor-save` con `isDisabled`) y el mismo parpadeo al guardar o eliminar. ¿Se incluye? Y dentro de eso: «Guardar» con el **nombre vacío** también es `isDisabled` (receta gris de la carta §13, que dice que la aplican «Añadir zona» en el límite y «Guardar» con nombre vacío); incluirlo sin atenuado es una inferencia de la decisión de «Añadir zona» en el límite. | **Se incluyen los tres elementos del Editor, también Guardar con nombre vacío.** La carta define **una** receta deshabilitada para los dos botones; si Zonas va sin atenuado y el Editor con él, el gris del mismo botón saldría distinto entre pantallas. Alternativa: limitar E4 a Zonas y abrir otra feature para el Editor. | R19 |
| DE4-2 | **Tolerancia N de la geometría de las cabeceras.** La flecha nativa de Android no es la de 44 × 44 del artboard y su posición exacta solo se mide en dispositivo. ¿Cuánto se puede ajustar sin volver a firmar? | **N = 8 dp** sobre cada una de las dos constantes de offset (`ZONES_TITLE_OFFSET` 42, `EDITOR_PILL_LEFT` 70). Dentro de ±8 el humano mide en el smoke y se ajusta **solo** `src/theme/header-layout.ts` (un fichero, un commit) sin enmienda. **Fuera de ±8 se necesita enmienda E5 y nueva firma.** Alternativa: N = 0 (cualquier ajuste firma de nuevo). | R23 |
| DE4-3 | **iOS.** Las cabeceras transparentes y los offsets se redactan para las dos plataformas, pero el smoke es Android (dev build del PC del humano) y `contentInsetAdjustmentBehavior` desaparece de Zonas. | **iOS no se verifica en E4.** Los tests de jest corren igual en ambas; la comprobación visual en iOS queda fuera de alcance (§5). Alternativa: añadir un paso de smoke en iOS (requiere dispositivo o simulador). | R21, R22 |
| DE4-4 | **El contenido que se desplaza pasa bajo la flecha de Zonas.** Con la cabecera transparente (H3) la flecha queda fija encima de un `ScrollView` que llega hasta `y = 0`: con 5 zonas, aviso y botón en un móvil bajo, las filas pasan por debajo de la flecha al desplazar. El artboard no desplaza. | **Se acepta** (consecuencia directa de H3; la flecha sigue legible sobre `bg-background`/filas y el título sale del campo al desplazar). Alternativa: cabecera con fondo al desplazar (`scrollEdgeEffects`/título grande), que es otra feature. | R21 |
| DE4-5 | **El mismo atenuado en el resto de la app.** Todos los `Switch`/`Button` de heroui con `isDisabled` de las demás pantallas tienen el mismo 50 %. | **Fuera de alcance de E4**: solo las dos pantallas de #189. Se anota en §5 como candidato a una feature propia (una constante `KEEP_OPACITY` ya existiría). | §5 |

**Origen.** Tras el verde de E3 el humano corrió el smoke §6 en el dev build Android y halló tres
defectos que jest no puede ver porque no resuelve `className` ni dibuja el atenuado de heroui:

1. **Parpadeo en las filas de Zonas.** heroui añade la clase `disabled:element-disabled` (opacidad 0.5) a
   `Switch` (`switch.styles.ts`) y a `Button` (`button.styles.ts`) cuando `isDisabled`. Al escribir
   (`busy`) las filas se atenúan y vuelven. R7.2 afirmaba que `busy` «**no** cambia el aspecto»: es
   **falso**, y por eso ningún test lo vio. Esta enmienda corrige esa frase (R20).
2. **«Añadir zona» en el límite, demasiado apagado.** La receta gris (`bg-default`, `text-muted`) ya
   casa con el artboard, pero el 50 % de heroui se multiplica por encima. El artboard
   (`canvas/Zonas.dc.html`, botón `disabled`) pinta solo `background: var(--default); color:
   var(--muted)`, sin opacidad.
3. **Posición de los títulos.** En Zonas el título cuelga bajo la flecha y en el Editor la píldora
   cuelga bajo la cabecera. El artboard de Zonas los pone en la fila de la flecha (cabecera `display:
   flex; align-items: center; gap: 8px`; flecha 44 × 44 con `margin-left: -10px`; `h1` `flex: 1`;
   contador 14/800 en la misma fila; contenedor `padding: 56px 20px 40px`, `gap: 12`) y el del Editor
   pone flecha y píldora en una cabecera `position: absolute; top: 52px; left: 16px; right: 16px;
   align-items: center; gap: 10px` (flecha 44 × 44; píldora `padding: 10px 16px`, `border-radius: 999px`,
   `font: 800 16px`).

**Premisas verificadas contra el árbol y las dependencias (no se reabren)**

- `style` **gana** a `className`: uniwind compone `[estilos de className, props.style]` en `View` y
  `Pressable`; el `Switch` de heroui pone `style` **último** en su estilo raíz (`[switchStyleSheet.borderCurve,
  rContainerStyle, style]`) y el `Button` también (`[buttonStyleSheet.buttonRoot, style]`). Por eso
  `style={KEEP_OPACITY}` cancela el 0.5 de forma determinista mientras `isDisabled`,
  `accessibilityState.disabled` y la clase `disabled:element-disabled` siguen presentes. Se **descarta**
  la clase `disabled:opacity-100`: el orden entre utilidades en conflicto no está garantizado.
- En `@react-navigation/native-stack`, `headerStyle.backgroundColor` **gana** a `headerTransparent`
  (`headerBackgroundColor = headerStyle.backgroundColor ?? (headerBackground || headerTransparent ?
  'transparent' : colors.card)`): una cabecera transparente exige **las dos** opciones,
  `headerTransparent: true` y `headerStyle: { backgroundColor: 'transparent' }`. Los `headerOptions` de
  `_layout.tsx` traen `headerStyle: { backgroundColor: background }`, que hay que pisar.
- Con `headerTransparent` (`translucent`) react-native-screens en Android **no** aplica
  `ScrollingViewBehavior`: el contenido empieza en `y = 0`, bajo la cabecera; `contentInsetAdjustmentBehavior`
  no hace nada en Android y en iOS añadiría un segundo desplazamiento. La barra de Android mide 56 dp
  (`ANDROID_DEFAULT_HEADER_HEIGHT`) bajo el inset superior.
- Bajo cabecera **opaca** `useSafeAreaInsets().top` ya está consumido por la cabecera (por eso la carta
  A11 no lleva `insets.top`); bajo cabecera **transparente** vale el inset de la barra de estado. Los tests
  de las dos pantallas fijan `insets.top = 40`.
- `Stack.Screen` de expo-router llama a `navigation.setOptions` en un efecto y **no restaura** las
  opciones al desmontarse: si el formulario del Editor pone la cabecera transparente y la pantalla pasa
  después a una rama de estado, la cabecera seguiría transparente. Por eso **cada rama del Editor
  declara su `Stack.Screen`** (R22) y las opciones tienen identidad estable entre renders.
- `KeyboardAvoidingView` en Android: `paddingBottom = max(frame.y + frame.height − (keyboardScreenY −
  keyboardVerticalOffset), 0)`. Con el candado actual (`layout` y 700, teclado en 500, offset 91) da 291; con
  offset 0 da **200**.

**Mapa de `testID` nuevo**: `geofence-editor-title-row` (Editor): `View` absoluto sobre el mapa que aloja
la píldora (R22.4). No cambia ningún otro `testID`; `geofences-header`, `geofences-title` y
`geofences-counter` conservan los suyos.

**Medidas en H0-E4** (la base se mide; el delta lo da cada R; total = base + delta; comandos desde
`mobile-pet-tracker/`, por contenido):

| # | Orden | Base en `18f86849` | Total esperado | R |
|---|---|---|---|---|
| M10 | `grep -cF "isDisabled" src/screens/geofences/index.tsx src/screens/geofence-editor/index.tsx` | 2 y 3 | 2 y 3 (no se quita ningún `isDisabled`) | R19, R20 |
| M11 | `grep -o "KEEP_OPACITY" <fichero> \| wc -l` en `src/screens/geofences/index.tsx`, `src/screens/geofence-editor/index.tsx`, `src/theme/native-styles.ts` | 0, 0 y 0 | 4 (import + Switch + 2 en Añadir), 5 (import + Switch + Eliminar + 2 en Guardar) y 1 (definición) | R19, R20 |
| M12 | `grep -cF "HeaderHeightContext" src/screens/geofence-editor/index.tsx` | 2 | **0** (ancla negativa, probada con mutación: P-E4-9) | R22 |
| M13 | `grep -cF "keyboardVerticalOffset={headerHeight}" src/screens/geofence-editor/index.tsx` y `grep -cF "keyboardVerticalOffset={0}" src/screens/geofence-editor/index.tsx` | 1 y 0 | 0 y 1 | R22 |
| M14 | `grep -cF "contentInsetAdjustmentBehavior" src/screens/geofences/index.tsx src/screens/geofence-editor/index.tsx` | 1 y 1 | **0** y 1 (el Editor lo conserva solo en la rama de estados) | R21 |
| M15 | `grep -cF "Stack.Screen" src/screens/geofence-editor/index.tsx src/screens/geofences/index.tsx` | 0 y 0 | 2 (una por rama) y 0 (Zonas lo declara en `_layout.tsx`) | R22 |
| M16 | `test ! -e src/theme/header-layout.ts` (base) y `grep -cF "export const" src/theme/header-layout.ts` | existe: no / n.a. | existe; 6 `export const` (R23.1) | R23 |
| M17 | `grep -cF "TRANSPARENT_HEADER_OPTIONS" src/app/_layout.tsx src/screens/geofence-editor/index.tsx` | 0 y 0 | 2 (import + uso) y 2 (import + uso) | R21, R22 |
| M18 | `grep -c "title: t('geofences.title')\|title: t('geofenceEditor.title')" src/app/_layout.tsx` (M9 re-medida) | **0** (E1 ya lo aplicó; M9 «2 líneas» caducó) | 0 | R1.1 |
| M19 | `grep -c "chunkyLip" src/screens/geofences/index.tsx src/screens/geofence-editor/index.tsx src/__tests__/design-drift.test.ts` | 2, 3 y 0 | 2, 3 y 0 (los usos de `chunkyLip` no cambian de número: solo cambia la forma del `style`) | R19, R20 |

#### Requisitos de E4

- **R19 — Bloqueado no es atenuado (H1, DE4-1).**
  - **R19.1** THE SYSTEM SHALL exportar de `src/theme/native-styles.ts` `export const KEEP_OPACITY = {
    opacity: 1 } as const;`, con comentario de por qué existe (cancela el atenuado `disabled:element-disabled`
    de heroui; el elemento sigue bloqueado), junto a `CONTINUOUS_CORNER` y `TABULAR_NUMS` (mismo motivo y
    precedente que ellos: prop de estilo sin utilidad CSS equivalente).
  - **R19.2** WHILE un elemento de heroui con `isDisabled` de las dos pantallas está bloqueado THE SYSTEM
    SHALL conservar su aspecto: lleva `KEEP_OPACITY` en `style` y **conserva** `isDisabled`, su expresión y
    su `className` completo (la clase `disabled:element-disabled` **no se quita**: se cancela, no se
    elimina). Los **cinco** elementos y su literal exacto:
    - Zonas, `Switch testID={`geofence-${geofence.id}-active`}`: `style={KEEP_OPACITY}`.
    - Zonas, `Button testID="geofences-add"`: ver R20.
    - Editor, `Switch testID="geofence-editor-active"`: `style={KEEP_OPACITY}`.
    - Editor, `Button testID="geofence-editor-delete"`: `style={[chunkyLip.neutral, KEEP_OPACITY]}`
      (sustituye a `style={chunkyLip.neutral}`).
    - Editor, `Button testID="geofence-editor-save"`: `style={name.trim() === '' ? KEEP_OPACITY :
      [chunkyLip.primary, KEEP_OPACITY]}` (sustituye a `style={name.trim() === '' ? undefined :
      chunkyLip.primary}`; la ternaria de `className` y la de la etiqueta no cambian).
  - **R19.3** Los `Pressable` de React Native de la fila (`geofence-<id>-edit`, `geofence-<id>-delete`)
    y los que pinte el Editor no son de heroui, usan `disabled={busy}` y no pintan opacidad: **no se
    tocan**. Los demás elementos de heroui sin `isDisabled` (p. ej. `geofences-retry`) tampoco.
  - **Test (F, E, C)**:
    - **(F)** `describe('#189 R19: …')` en `screens/geofences/index.test.tsx`: con una escritura en vuelo
      (patrón del `it` existente «bloquea los dos interruptores mientras escribe»), cada `Switch`
      `geofence-<id>-active` tiene `accessibilityState.disabled === true` **y** `StyleSheet.flatten(node.props.style).opacity === 1`.
      Si el nodo anfitrión del `Switch` de heroui no expone el estilo de su raíz en jest, esa aserción se
      sustituye por el candado de fuente (C) para el `Switch` y el reporte lo anota; **no es motivo de PARA**.
    - **(E)** `describe('#189 R19: …')` en `screens/geofence-editor/index.test.tsx`: con `busy` y con el
      nombre vacío, `geofence-editor-active`, `geofence-editor-delete` y `geofence-editor-save` están
      bloqueados (`accessibilityState.disabled === true`) y su estilo aplanado tiene `opacity === 1`;
      con el nombre vacío y sin `busy` Guardar también (`opacity === 1`; **enmendado por E5**: en este
      `it`, que aserta el estilo aplanado completo, la igualdad exacta es la de §4.5 y no `{ opacity: 1 }`).
    - **(C)** `geofences-canvas-fidelity.test.ts`, `#189 R19.1/R19.2`: `native-styles.ts` contiene
      `export const KEEP_OPACITY = { opacity: 1 } as const;`; en cada una de las dos pantallas, **toda
      etiqueta de apertura** de `<Switch` y `<Button` que contiene `isDisabled=` contiene también
      `KEEP_OPACITY`, y el número de etiquetas con `isDisabled=` es 2 (Zonas) y 3 (Editor), que es M10 (el
      candado barre **todas** las etiquetas, no una lista de `testID`, para que un elemento nuevo con
      `isDisabled` y sin `KEEP_OPACITY` ponga en rojo el candado: P-E4-2).
    - **Límite de jest, dicho en voz alta**: jest no resuelve `disabled:element-disabled`, así que estos
      tests prueban la **forma** (el `style` cancelador está y el bloqueo sigue). La comprobación real de
      que el 0.5 ya no se ve es el **smoke del humano** (§6, pasos 6 y 7).
  - **Fuera de R19**: quitar `isDisabled` para evitar el atenuado (cambia el comportamiento de R17).
- **R20 — «Añadir zona» en el límite y bajo `busy` (H1, H1b).** THE SYSTEM SHALL pintar `geofences-add`
  con **exactamente** esta etiqueta de apertura (solo cambia `style`):
  `<Button testID="geofences-add" className={atLimit ? 'mt-auto h-14 rounded-16 bg-default' : 'mt-auto h-14
  rounded-16 bg-accent'} style={atLimit ? KEEP_OPACITY : [chunkyLip.primary, KEEP_OPACITY]}
  isDisabled={busy || atLimit} …>`, con la etiqueta `<Text className={atLimit ? 'text-17 font-extrabold
  text-muted' : 'text-17 font-extrabold text-accent-foreground'}>` **sin cambios**.
  - **R20.1** WHILE `zonas >= 5`: gris del artboard (`bg-default`, texto `text-muted`), sin labio y **sin
    atenuado**: `StyleSheet.flatten(add.props.style)` es exactamente `{ borderCurve: 'continuous', transform:
    [{ scale: 1 }], opacity: 1 }` (las dos primeras claves las pone el `Button`/`PressableFeedback` de
    heroui, no la pantalla; en particular `opacity === 1` y **no** tiene `boxShadow`),
    `accessibilityState.disabled === true`, y el `className` renderizado **conserva**
    `disabled:element-disabled` (la clase de heroui sigue ahí; la cancela el `style`). *(Redacción
    sustituida por E5: la de E4 decía «exactamente `{ opacity: 1 }`», premisa falsa; ver §4.5.)*
  - **R20.2** WHILE `busy` con menos de 5 zonas: receta primaria completa (`bg-accent`, labio
    `chunkyLip.primary`) **y** `opacity: 1`, con `accessibilityState.disabled === true`. Es la
    corrección de R7.2: `busy` **sí** cambiaba el aspecto (lo atenuaba heroui); ahora no.
  - **R20.3** WHILE `zonas < 5` y no `busy` (también con la lista vacía): receta primaria con labio; el
    `opacity: 1` no tiene efecto visible.
  - **Test (F)**: el `it` «#189 R7» (clases por conteo) se enmienda (`(enmendado por E4 R20)`): para
    `count === 5` el estilo aplanado `toEqual({ borderCurve: 'continuous', transform: [{ scale: 1 }],
    opacity: 1 })` (E5; cualquier clave extra, p. ej. `boxShadow`, lo pone en rojo), para
    `count < 5` `toHaveStyle` del labio **y** `opacity: 1`; el `it` «busy» (hoy `toContain('mt-auto h-14
    rounded-16 bg-accent')` + labio) añade `opacity: 1`; nuevo `it` que con 5 zonas comprueba
    `className` `toContain('disabled:element-disabled')`. Sondas: P-E4-3 y P-E4-4.
- **R21 — Zonas: cabecera transparente y título en la fila de la flecha (H3, DE4-3, DE4-4).**
  - **R21.1 Ruta.** THE SYSTEM SHALL declarar en `src/app/_layout.tsx` la ruta `pets/[petId]/geofences`
    con `options={{ ...headerOptions, title: '', ...TRANSPARENT_HEADER_OPTIONS }}`, donde
    `TRANSPARENT_HEADER_OPTIONS` (R23.1) es `{ headerTransparent: true, headerStyle: { backgroundColor:
    'transparent' } }` y el spread va **después** de `headerOptions` para pisar su `headerStyle`. La ruta
    `pets/[petId]/geofence-editor` **no cambia** (sigue `{ ...headerOptions, title: '' }`, opaca: la
    transparencia del formulario la declara el propio formulario, R22). Se elige `_layout.tsx` y no
    `Stack.Screen` en la pantalla porque Zonas tiene **un solo régimen** (sin ramas con cabecera distinta),
    el candado de `layout.test.tsx` ya fija las opciones por ruta y no hay efecto que restaurar.
  - **R21.2 Contenedor.** THE SYSTEM SHALL pintar el `ScrollView` `screen-geofences` con
    `className="flex-1 bg-background"`, **sin** `contentInsetAdjustmentBehavior` (con la cabecera
    transparente el contenido ya empieza bajo ella; en iOS el ajuste automático sumaría un segundo
    desplazamiento) y `contentContainerStyle` exactamente `{ paddingHorizontal: 20, paddingTop: insets.top
    + HEADER_ROW_TOP, paddingBottom: insets.bottom + 40, gap: 12, flexGrow: 1 }` (con `insets.top = 40` y
    `HEADER_ROW_TOP = 6` del test: `paddingTop: 46`; el resto igual que R3).
  - **R21.3 Fila de título.** THE SYSTEM SHALL pintar `geofences-header` con `className="h-11
    flex-row items-center gap-2"` y `style={{ paddingLeft: ZONES_TITLE_OFFSET }}` (R23.1: 42 = 44 − 10 + 8,
    el inicio del título del artboard: flecha 44 con `margin-left: -10`, hueco 8). Altura 44 (`h-11`) para
    que, con `gap: 12` del contenedor, la barra de progreso quede a la misma distancia que en el artboard.
    El título (`geofences-title`, mismas clases y rol) y el contador (`geofences-counter`) **no cambian**,
    ni su orden, ni R1.3 (un hijo / dos hijos). El resto de hijos del scroll (R3) no cambia.
  - **R21.4 Fila en la altura de la flecha.** El centro de la fila queda a `insets.top + 28` (fila de 44
    en `HEADER_ROW_TOP = 6` dentro de la barra de 56): el título comparte eje con la flecha nativa.
  - **Test (L, F)**:
    - **(L)** el `it` «declara pets/[petId]/geofences como undécimo hijo y no singular» se enmienda
      (`(enmendado por E4 R21)`): su `toEqual` de opciones pasa de `{ headerShown: true, title: '',
      headerStyle: { backgroundColor: 'token:background' }, headerTintColor: 'token:foreground',
      headerTitleStyle: { fontFamily: 'Inter-Bold' }, headerShadowVisible: false }` a `{ headerShown: true,
      title: '', headerStyle: { backgroundColor: 'transparent' }, headerTintColor: 'token:foreground',
      headerTitleStyle: { fontFamily: 'Inter-Bold' }, headerShadowVisible: false, headerTransparent:
      true }`; la posición (undécimo hijo) y que no es singular no cambian. El `it` del **Editor** no se
      toca (sigue opaco).
    - **(F)** el `it` «respeta las métricas A11 bajo cabecera nativa» (`#189 R3`) se enmienda
      (`(enmendado por E4 R21)`): `contentInsetAdjustmentBehavior` pasa de `'automatic'` a `undefined` y el
      `contentContainerStyle` de `{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 64, gap: 12,
      flexGrow: 1 }` a `{ paddingHorizontal: 20, paddingTop: 46, paddingBottom: 64, gap: 12, flexGrow: 1
      }`. El `it` de R1.2 (`#189 R1`, clase del encabezado) se enmienda: `className` pasa de
      `'flex-row items-center gap-2'` a `'h-11 flex-row items-center gap-2'` y se añade que el estilo
      aplanado tiene `paddingLeft` igual a `ZONES_TITLE_OFFSET` (R23.2). Los `childTestIds`, los textos y
      R1.3 se conservan tal cual.
- **R22 — Editor: cabecera transparente en el formulario y píldora en la fila de la flecha (H2, DE4-3).**
  - **R22.1 Formulario.** WHEN el Editor pinta la rama `GeofenceEditorForm` THE SYSTEM SHALL devolver un
    fragmento con dos hijos, en este orden: `<Stack.Screen options={TRANSPARENT_HEADER_OPTIONS} />` (de
    `expo-router`) y el `KeyboardAvoidingView testID="screen-geofence-editor"`. El `Stack.Screen` es
    **hermano** del `KeyboardAvoidingView` (no hijo), para que R9 (`childTestIds(root)` =
    `[geofence-editor-map, geofence-editor-form]`) siga valiendo.
  - **R22.2 Ramas de estado.** WHEN el Editor pinta cualquier rama de R8.3 (esqueleto, `no-tracking`,
    error de carga, no encontrada, solo dueño) THE SYSTEM SHALL devolver un fragmento `[Stack.Screen,
    ScrollView]` con `<Stack.Screen options={opaqueHeader} />`, donde `opaqueHeader = useMemo(() => ({
    headerTransparent: false, headerStyle: { backgroundColor: background } }), [background])` y
    `const [background] = useThemeColors(['background'])`, ambos **al principio** de `GeofenceEditorScreen`
    (antes de cualquier retorno temprano: hooks nunca bajo una rama condicional). Así el paso formulario →
    estado restaura la cabecera opaca. R8.3 y R14 no cambian (el título sigue siendo el primer hijo del
    `ScrollView`; el `Stack.Screen` es su hermano).
  - **R22.3 Teclado.** THE SYSTEM SHALL pasar `keyboardVerticalOffset` de `{headerHeight}` a `{0}`
    (el `KeyboardAvoidingView` empieza ahora en `y = 0`, no bajo la cabecera) y **eliminar** de
    `geofence-editor/index.tsx` la importación `HeaderHeightContext` y el `useContext`. Con `layout` (y 0,
    alto 700) y `keyboardWillShow` con `screenY` 500: `paddingBottom` **200** (`700 − (500 − 0)`), y `0`
    antes del teclado. **El texto de R9 «el bloque del teclado `paddingBottom: 291` se conserva idéntico»
    queda sustituido por este**: la regresión de edge-to-edge se sigue candando, con el valor nuevo.
  - **R22.4 Píldora en la fila de la flecha.** THE SYSTEM SHALL pintar, dentro de `View
    testID="geofence-editor-map"`, **después** de `PetMap`, un `View testID="geofence-editor-title-row"`
    con `className="absolute justify-center"`, `pointerEvents="box-none"` y `style={{ top: insets.top,
    left: EDITOR_PILL_LEFT, height: HEADER_BAR_HEIGHT }}` (R23.1: 70 = 16 + 44 + 10, la posición de la
    píldora del artboard; 56 = barra nativa), que contiene el `BlurView testID="geofence-editor-title-blur"`
    de R8.2 con el `className` cambiado de `absolute left-4 top-3 overflow-hidden rounded-full` a
    `self-start overflow-hidden rounded-full` (`intensity={48}`, `blurMethod`, `tint` y el `Text
    geofence-editor-title` interior **sin cambios**). El mapa llega a `y = 0`. La cadena de padres es
    `geofence-editor-title` → `geofence-editor-title-blur` → `geofence-editor-title-row` →
    `geofence-editor-map`; el orden de hijos de `geofence-editor-map` es `[map-view, geofence-editor-title-row,
    (geofence-editor-map-hint-blur)]`. El botón de volver sigue siendo el nativo (el de cristal sigue fuera
    de alcance, §5): su contraste sobre el mapa se comprueba en el smoke.
  - **Test (E)**: 
    - El `jest.mock('expo-router', …)` del test (hoy `({ router: { back: jest.fn() } })`, **sin** `Stack`)
      pasa a incluir `Stack: { Screen: <jest.fn que devuelve null> }` (nombre con prefijo `mock` por el
      alzado de jest). Se **verifica contra el fichero** antes de escribirlo (regla de mocks por intención).
    - `describe('#189 R22: …')`: en la rama del formulario (editar, crear, solo lectura) la última llamada
      a `Stack.Screen` recibe `options` `toEqual({ headerTransparent: true, headerStyle: { backgroundColor:
      'transparent' } })`; en **cada una de las cinco ramas de estado** recibe `{ headerTransparent: false,
      headerStyle: { backgroundColor: 'background' } }` (el mock de `useThemeColors` del test devuelve el
      nombre del token); `it` de transición formulario → estado (montar el formulario y forzar con
      `queryClient.setQueryData` en la clave de la lista un `kind: 'no-tracking'` o `'not-found'`): la
      última llamada pasa a opaca; `it` de identidad: tras un `rerender` sin cambios, `Object.is(opciones
      previas, opciones nuevas)` es `true` en las dos ramas (sin objetos nuevos por render).
    - `#189 R9` enmendado (`(enmendado por E4 R22)`): el `it` «compone mapa y formulario…» cambia
      `paddingBottom: 291` por `paddingBottom: 200` (la fila `#146 R6` del traceability se actualiza); el
      `Provider value={91}` del `wrapper` se **conserva** como guarda inerte (si alguien restaura
      `keyboardVerticalOffset={headerHeight}` el valor vuelve a 291 y el test se pone rojo).
    - `#189 R8` / `#189 R9` enmendados: `geofence-editor-title-blur` ya no es hijo directo del mapa; los
      `childTestIds(map)` pasan de `['map-view', 'geofence-editor-title-blur', …]` a `['map-view',
      'geofence-editor-title-row', …]`; `blur.parent === map` pasa a `blur.parent` = la fila y la fila
      con `parent === map`; la clase del blur y los `style` de la fila (`top: 40`, `left: 70`, `height:
      56` con el `insets.top = 40` del test) se asertan con literales (ver R23.2 para su ventana).
    - Candado de fuente (C): `grep -cF HeaderHeightContext` = **0** en `geofence-editor/index.tsx`
      (ancla negativa, probada con mutación: P-E4-9).
- **R23 — Geometría de las cabeceras en un solo sitio y tolerancia N (DE4-2).**
  - **R23.1** THE SYSTEM SHALL crear `src/theme/header-layout.ts` (precedente: `touch-target.ts`) con
    **seis** `export const` y un comentario que explica que la geometría deriva de los artboards y que la
    flecha nativa se mide en dispositivo:
    `HEADER_BAR_HEIGHT = 56`, `BACK_BUTTON_SIZE = 44`, `HEADER_ROW_TOP = (HEADER_BAR_HEIGHT -
    BACK_BUTTON_SIZE) / 2` (= 6), `ZONES_TITLE_OFFSET = BACK_BUTTON_SIZE - 10 + 8` (= 42),
    `EDITOR_PILL_LEFT = 16 + BACK_BUTTON_SIZE + 10` (= 70) y `TRANSPARENT_HEADER_OPTIONS = {
    headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }` (sin `as const` si el tipo de
    `options` lo rechaza). Ninguna otra pieza escribe estos números: Zonas, el Editor y `_layout.tsx` los
    importan.
  - **R23.2 Tolerancia N = 8 dp (DE4-2).** El humano mide en el smoke la posición real de la flecha
    nativa. Si el título de Zonas o la píldora del Editor se desvían **hasta 8 dp** del artboard, se
    ajustan **solo** `ZONES_TITLE_OFFSET` y/o `EDITOR_PILL_LEFT` en `header-layout.ts` (un commit, sin
    enmienda ni firma). **Fuera de 8 dp se necesita enmienda E5 con nueva firma.**
  - **Test (C)**: `#189 R23` en `geofences-canvas-fidelity.test.ts` con **dos** familias de aserción, para
    que no sea tautología: (a) **cableado**: el estilo aplanado de `geofences-header` tiene `paddingLeft`
    igual a `ZONES_TITLE_OFFSET` importado, el de `geofence-editor-title-row` tiene `left` igual a
    `EDITOR_PILL_LEFT`, y `top`/`height`/`paddingTop` salen de `HEADER_BAR_HEIGHT`/`HEADER_ROW_TOP` (en los
    tests de pantalla F y E, que importan las constantes); (b) **ventana** con literales **propios del
    test**, independientes de producción: `ZONES_TITLE_OFFSET` ∈ [34, 50] y `EDITOR_PILL_LEFT` ∈ [62, 78]
    (42 ± 8 y 70 ± 8), y `HEADER_BAR_HEIGHT` = 56, `BACK_BUTTON_SIZE` = 44. Las dos pantallas **no**
    escriben `42`, `70` ni `56` como literal de estilo (barrido de fuente: P-E4-8).
- **R24 — Carta y candados de E4.**
  - **R24.1** THE SYSTEM SHALL enmendar `docs/ui-guidelines.md` en el mismo PR, **sin** añadir casilla a la
    carta (la firma de la casilla E4 de este fichero autoriza estas ediciones y nada más; Codex **no**
    escribe `[X]` en ninguna parte):
    - **A11 (línea de Zonas)**: la frase «Zonas seguras (#189): `paddingHorizontal: 20`, `paddingTop: 24`,
      `gap: 12`, `paddingBottom: insets.bottom + 40`.» pasa a «Zonas seguras (#189): `paddingHorizontal: 20`,
      `paddingTop: insets.top + 6`, `gap: 12`, `paddingBottom: insets.bottom + 40`.», en la regla 6 y en el
      bloque «Enmienda #189» (las dos apariciones).
    - **Frase nueva en la misma excepción de fidelidad al canvas** (regla 6): «Cabecera nativa transparente
      (#189 E4): Zonas seguras y la rama de formulario del Editor usan `headerTransparent: true` con
      `headerStyle: { backgroundColor: 'transparent' }`; el contenido empieza bajo la cabecera, el título
      comparte fila con la flecha, el `paddingTop` suma `insets.top` y no se usa
      `contentInsetAdjustmentBehavior`. Las ramas de estado del Editor conservan la cabecera opaca.»
    - **Excepción A11 de cabecera opaca** (la frase que lista `pets/[petId]/geofences` entre las pantallas
      cuya cabecera consume el inset superior): se añade al final «`pets/[petId]/geofences` queda fuera de
      esta excepción desde #189 E4 (cabecera transparente, ver más abajo)». La misma nota de una línea va en
      `docs/conventions.md` (frase equivalente de §Dimensiones).
    - **Regla 13 (receta deshabilitada)**: frase nueva «El bloqueo (`isDisabled`) no atenúa: en #189 los
      `Switch` y `Button` de heroui cancelan el 50 % de `disabled:element-disabled` con `KEEP_OPACITY`, y la
      receta gris del límite no lleva opacidad.»; las frases existentes de R16.3 **no se tocan**.
    - Las líneas «título en contenido y cabecera nativa con `title: ''`» (regla de títulos), «Título en
      contenido (D-H)» y «El botón atrás pertenece a la cabecera nativa con `title: ''`» **siguen siendo
      ciertas** (el botón nativo y `title: ''` se conservan) y **no se tocan**.
  - **R24.2 Test (C)**: `#189 R16.1` se enmienda (`(enmendado por E4 R24)`): la frase de Zonas pasa a la
    nueva con `insets.top + 6`; nuevos `it` `#189 R24.1/R24.2/R24.3` con un `toContain` de la frase fija
    de transparencia, de la nota de la excepción opaca y de la frase de `KEEP_OPACITY`. Los candados de la
    carta de `design-drift` y #177 R10 siguen verdes.

#### Texto que E4 sustituye (antes → después)

| Cláusula | Antes | Después | R |
|---|---|---|---|
| R1.1 (opciones de la ruta de Zonas) | `{ ...headerOptions, title: '' }` | `{ ...headerOptions, title: '', ...TRANSPARENT_HEADER_OPTIONS }` (el Editor no cambia) | R21.1 |
| R1.2 (`geofences-header`) | `className="flex-row items-center gap-2"` | `className="h-11 flex-row items-center gap-2"` y `style={{ paddingLeft: ZONES_TITLE_OFFSET }}` | R21.3 |
| R3 (contenedor de Zonas) | `contentInsetAdjustmentBehavior="automatic"`, `paddingTop: 24` | sin `contentInsetAdjustmentBehavior`; `paddingTop: insets.top + HEADER_ROW_TOP` (46 con el mock) | R21.2 |
| R5.5 (`Switch` de la fila «sin cambios») | sin `style` | `style={KEEP_OPACITY}` (resto sin cambios) | R19.2 |
| R7.2 (frase falsa) | «`busy` (escritura en curso) **no** cambia el aspecto: conserva la receta primaria con `isDisabled`» | «`busy` conserva la receta primaria con `isDisabled` y, **desde E4, sin atenuado**: heroui lo atenuaba al 50 % y `style` lo cancela» | R20.2 |
| R7.1/R7.2 (`style` del botón) | `style={atLimit ? undefined : chunkyLip.primary}` | `style={atLimit ? KEEP_OPACITY : [chunkyLip.primary, KEEP_OPACITY]}` | R20 |
| R8.2 (píldora) | `className="absolute left-4 top-3 overflow-hidden rounded-full"`, hijo directo de `geofence-editor-map` | `className="self-start overflow-hidden rounded-full"` dentro de `geofence-editor-title-row` (R22.4) | R22.4 |
| R9 (teclado) | `keyboardVerticalOffset={headerHeight}`; «`paddingBottom: 291` se conserva idéntico» | `keyboardVerticalOffset={0}`; `paddingBottom: 200` | R22.3 |
| R12 (`Switch` Activa «sin cambios») | sin `style` | `style={KEEP_OPACITY}` | R19.2 |
| R13.1 (`style` de Eliminar) | `style={chunkyLip.neutral}` | `style={[chunkyLip.neutral, KEEP_OPACITY]}` | R19.2 |
| R13.2 (`style` de Guardar y «`busy` mantiene … la receta primaria») | `style={name.trim() === '' ? undefined : chunkyLip.primary}` | `style={name.trim() === '' ? KEEP_OPACITY : [chunkyLip.primary, KEEP_OPACITY]}`; `busy` mantiene la receta primaria y la opacidad 1 | R19.2 |
| R16.1 (Zonas) | `paddingTop: 24` | `paddingTop: insets.top + 6` | R24.1 |
| M9 | «2 líneas, delta −2» | base real 0 (E1 lo aplicó); no se re-mide a 2 | M18 |

#### Candados agregados que se mueven (E4: antes → después)

Todas las cifras se miden en H0-E4 (la base de abajo es la de `18f86849`); el total es base + delta. Los
ficheros de la lista cerrada se lanzan solos y completos tras el verde de su R.

| Candado (fichero, ancla) | Qué mide | Antes → después | R |
|---|---|---|---|
| `chunky-cta-canvas-fidelity.test.ts`, `#177 R3.1` (`it.each(CTA_ROWS)`), filas `geofences-add` y `geofence-editor-save` | el `style` de la etiqueta de apertura | `style={${condition} ? undefined : chunkyLip.primary}` → `style={${condition} ? KEEP_OPACITY : [chunkyLip.primary, KEEP_OPACITY]}` **(enmienda)**; las otras 15 filas conservan `style={chunkyLip.primary}`; `className`, anclas `isDisabled`/`onPress` y los prohibidos no cambian | R19 (Guardar), R20 (Añadir) |
| ídem, `#177 R4.1` (`it.each(NEUTRAL_ROWS)`), fila `geofence-editor-delete` | el `style` neutro | `'style={chunkyLip.neutral}'` → `'style={[chunkyLip.neutral, KEEP_OPACITY]}'` **solo para esa fila**; las demás filas neutras conservan la forma vieja **(enmienda)** | R19 |
| ídem, `#177 R7.5` | inventario de `style=…` por fichero | primario `style=\{(?:…)? chunkyLip\.primary\}`: la expresión regular se amplía para casar las dos formas nuevas; **recuentos sin cambio** (`geofences` 1 → 1, `geofence-editor` 1 → 1, `add-pet` 2 → 2, el resto 1 → 1); neutro `style=\{chunkyLip\.neutral\}`: se amplía para casar `style={[chunkyLip.neutral, KEEP_OPACITY]}`, recuentos 1 → 1 por fila de `NEUTRAL_ROWS`; `primaryCompact` y `chunkyLip\.primary\b` sin cambio **(enmienda)** | R19, R20 |
| ídem, `#177 R8.1` | quién recibe cada estilo | el predicado se amplía igual que `R7.5`; `primaryIds`, `neutralIds` y `['reminders-add-link']` **sin cambio** **(enmienda)** | R19, R20 |
| ídem, `radii` / `#177 R7.3` (`rounded-16`) | radios por fichero | **sin cambio** (`geofences` 2, `geofence-editor` 3; total `26 + 1 + 1 + 2`) | - |
| ídem, `#177 R3.2`, `#177 R6.2` | etiquetas `Text` y `Button.Label` | **sin cambio** (la etiqueta y el número de `Button.Label` no se mueven) | - |
| `consistency-classnames.test.ts`, `style={CONTINUOUS_CORNER}` global y por fichero, `TABULAR_NUMS` | usos de los estilos nativos | **sin cambio** (E4 no añade usos); las importaciones de las pantallas pasan a `import { CONTINUOUS_CORNER, KEEP_OPACITY } from '../../theme/native-styles';` (Zonas) y `import { CONTINUOUS_CORNER, KEEP_OPACITY, TABULAR_NUMS } from '../../theme/native-styles';` (Editor), que ningún candado fija por texto (los únicos candados de import exacto son los de `history`) | R19 |
| `heroui-text-size-merge.test.ts`, pisos 197 y 163 | nodos HeroUI / con `className` | **sin cambio** (E4 no añade ni quita componentes de heroui) | - |
| `ui-language.test.ts`, `ui-copy-table.ts`, `language-provider.test.tsx` | copy y catálogo | **sin cambio** (E4 no añade ni cambia ninguna `t('…')` ni clave) | - |
| `geofences-canvas-fidelity.test.ts`, `#189 R16.1` | frase de la carta de Zonas | `paddingTop: 24` → `paddingTop: insets.top + 6` **(enmienda)** + `it` nuevos `#189 R19`, `#189 R23`, `#189 R24.1/2/3` | R23, R24 |
| `geofences-canvas-fidelity.test.ts`, `#189 R18` (candados de fuente) | hex, corchetes, `StyleSheet.create`, `text-NN` | **sin cambio de comportamiento**; `'transparent'` no es hex y `style={{ … }}` en línea no está vetado; se **re-mide** que siguen verdes con el estilo en línea de la fila de Zonas | R21, R22 |
| `app/__tests__/layout.test.tsx` | opciones de la ruta de Zonas | `toEqual` con `headerStyle: { backgroundColor: 'token:background' }` → `{ backgroundColor: 'transparent' }` y `+ headerTransparent: true`; la ruta del Editor sin cambio; `title: ''` de las dos sin cambio | R21 |
| `screens/geofences/index.test.tsx`, métricas A11 y R1.2 | `contentContainerStyle` y clase del encabezado | `paddingTop: 24` → `46`; `contentInsetAdjustmentBehavior: 'automatic'` → `undefined`; `'flex-row items-center gap-2'` → `'h-11 flex-row items-center gap-2'` | R21 |
| `screens/geofence-editor/index.test.tsx`, `#146 R6` / `#189 R9` (teclado) | `paddingBottom` con el teclado | `291` → `200` (`700 − (500 − 0)`) | R22 |

Regla de H0-E4 (guardas de cadena en estado intermedio): **mide la base de cada fila antes de tocarla**,
escríbela en `progress/impl_mobile-geofences-canvas-fidelity.md` y rehace la suma al cerrar cada R. Un 0 medido
al final de la cadena puede ser falso a mitad de ella: las anclas negativas (M12, M14) se miden **tras** el
verde de su R. Un candado agregado que se queda verde cuando debía moverse es una alerta. La regla residual
de §4.2 sigue en vigor para los tres ficheros de candados agregados (`consistency-classnames`,
`design-drift`, `heroui-text-size-merge`), que **no** están en la lista de edición de E4: si alguno se pone
rojo, PARA y reporta (el delta esperado es cero).

#### Sondas de mutación (cada candado, en su zona ciega)

| # | Mutación plantada | Debe poner en rojo |
|---|---|---|
| P-E4-1 | quitar `style={KEEP_OPACITY}` del `Switch` `geofence-<id>-active` | el candado de fuente R19.2 (y, si el nodo lo expone, el `it` (F) de opacidad bajo `busy`) |
| P-E4-2 | añadir un `Button`/`Switch` con `isDisabled` y sin `KEEP_OPACITY` (p. ej. `isDisabled={busy}` en `geofences-retry`) | el barrido de **todas** las etiquetas de R19.2 (y el conteo 2 / 3 de M10) |
| P-E4-3 | `geofences-add` con `style={atLimit ? undefined : chunkyLip.primary}` (forma vieja) | el `it` de R20 (`opacity` bajo `busy` y con 5) y `#177 R3.1` |
| P-E4-4 | `geofences-add` con `style={chunkyLip.primary}` también en el límite | R20.1 (el `toEqual` del flatten, §4.5, falla porque aparece la clave `boxShadow`) |
| P-E4-5 | quitar `isDisabled` de `geofences-add` o del `Switch` «para arreglar el parpadeo» | `accessibilityState.disabled` y los bloqueos de R17 (`bloquea los dos interruptores mientras escribe`, `no abre el editor mientras una escritura está en vuelo`) |
| P-E4-6 | la ruta de Zonas con `headerTransparent: true` pero **sin** `headerStyle: { backgroundColor: 'transparent' }` | `layout.test.tsx` (`toEqual`) |
| P-E4-7 | restaurar `contentInsetAdjustmentBehavior="automatic"` o `paddingTop: 24` en Zonas | el `it` de métricas (F) y la ancla M14 |
| P-E4-8 | `ZONES_TITLE_OFFSET = 60` (fuera de ventana); `geofences-header` sin `paddingLeft`; `paddingLeft: 50` literal en la pantalla (dentro de ventana pero sin constante) | la ventana (R23.2 b); el cableado (R23.2 a); el barrido de literales de R23.2 |
| P-E4-9 | `keyboardVerticalOffset={headerHeight}` restaurado; o solo el `import { HeaderHeightContext }` restaurado | el `it` de teclado (291 ≠ 200); la ancla negativa M12 (`grep -cF HeaderHeightContext` ≠ 0) |
| P-E4-10 | la fila de la píldora con `left: 16` (valor viejo) o el `BlurView` con `absolute left-4 top-3` | el `it` de R22.4 (clase y `left`) y los `childTestIds` del mapa |
| P-E4-11 | la rama de estados sin `Stack.Screen`, o el formulario sin `Stack.Screen` | el `it` de transición y el de las cinco ramas de R22.2 |
| P-E4-12 | `options` como objeto en línea nuevo en cada render | el `it` de identidad de R22 |
| P-E4-13 | quitar `h-11` de `geofences-header` | el `it` de R1.2 enmendado |

Las anclas negativas (M12: `HeaderHeightContext` = 0; M14: `contentInsetAdjustmentBehavior` = 0 en Zonas;
la forma vieja `? undefined : chunkyLip.primary` = 0 en las dos pantallas) se **prueban contra la mutación
plantada** (P-E4-9, P-E4-7, P-E4-3): un `grep = 0` que nunca se ha visto fallar no es un candado.

#### Lista cerrada de ficheros que E4 puede tocar

Producción (`mobile-pet-tracker/`): `src/theme/native-styles.ts`, `src/theme/header-layout.ts` (nuevo),
`src/screens/geofences/index.tsx`, `src/screens/geofence-editor/index.tsx`, `src/app/_layout.tsx`.
Tests: `src/screens/geofences/index.test.tsx`, `src/screens/geofence-editor/index.test.tsx`,
`src/app/__tests__/layout.test.tsx`, `src/__tests__/chunky-cta-canvas-fidelity.test.ts`,
`src/__tests__/geofences-canvas-fidelity.test.ts`. Docs: `docs/ui-guidelines.md`, `docs/conventions.md`
(una frase, R24.1). Registro: `progress/impl_mobile-geofences-canvas-fidelity.md` y
`specs/mobile-geofences-canvas-fidelity/traceability.md`. **Fuera de la lista** (PARA y reporta si hace
falta tocarlos): cualquier otra pantalla, `feature_list.json`, `init.sh`, `src/__tests__/design-drift.test.ts`,
`consistency-classnames.test.ts`, `heroui-text-size-merge.test.ts`, el backend, `global.css`.

#### Orden rojo → verde de E4 y regla de commits

Un commit rojo (solo tests) y un commit verde (solo producción y docs) por requisito; **nunca**
implementación y tests en el mismo commit (en #19 Codex los mezcló en uno y se incumplió C4 de
`CHECKPOINTS.md`). Convención: `test(mobile): #189 E4 R<n> rojo — <desc>` y `feat(mobile): #189 E4 R<n>
<desc>`. Esperas: seguir `.claude/agents/leader.md` §Esperas (sin esperar al contador de mock; jest de un
fichero con `bunx jest <ruta> --testTimeout=30000`, solo con `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'`
y `pgrep -f '[i]nit.sh'` vacíos; **no** `./init.sh`; RNTL 14 con `await` en `fireEvent`, `render` y `act`).
Orden, porque cada paso usa el anterior:

1. **R23** (constantes y ventana): rojo = el test importa un módulo que no existe; verde = `header-layout.ts`.
2. **R19** (`KEEP_OPACITY`, los dos `Switch`, Eliminar y Guardar del Editor) con la enmienda de `#177 R3.1`
   (fila de Guardar), `R4.1`, `R7.5` y `R8.1` del lado del Editor.
3. **R20** («Añadir zona») con la enmienda de `#177 R3.1` (fila de Añadir) y de `R7.5`/`R8.1` del lado de Zonas.
4. **R21** (ruta, contenedor y fila de título de Zonas) con `layout.test.tsx`.
5. **R22** (Editor: `Stack.Screen` por rama, teclado, píldora).
6. **R24** (carta y sus candados) y, al final, el barrido de M10-M19 con base + delta.

**Smoke de E4**: los pasos 6-10 de §6 los corre el humano; el 0.5 real y la posición real de la flecha nativa
**no** los puede ver ningún test.

### §4.5 Enmienda E5 (2026-10-22): premisa falsa sobre el estilo aplanado de un `Button` de heroui (R20.1)

Base de medida: `eace0652` (HEAD de la branch al redactar; rojo versionado de R20). Los recuentos y las
líneas caducan: se anclan por contenido y se re-miden en el H0 de la enmienda.

**Origen.** Al pasar a verde R19 y R20, Codex midió que el `it` de R20.1 y el `it` (F) de «Añadir zona» en
el límite no pueden pasar con producción correcta, y el leader lo verificó contra la fuente de heroui. R20.1
y Test (F)/P-E4-4 de E4 prescribían que `StyleSheet.flatten(add.props.style)` fuese exactamente
`{ opacity: 1 }`. Es falso: el `Button` de heroui compone `[buttonStyleSheet.buttonRoot, style]`
(`node_modules/heroui-native/src/components/button/button.tsx`, ~l. 294) con `buttonRoot = { borderCurve:
'continuous' }` (`button.styles.ts`, ~l. 106), y `PressableFeedback` añade `transform: [{ scale: 1 }]`. El
flatten real en el límite (5 zonas) es `{ borderCurve: 'continuous', transform: [{ scale: 1 }], opacity: 1 }`,
**sin** `boxShadow`. **La producción literal de R20 no cambia** (`style={atLimit ? KEEP_OPACITY :
[chunkyLip.primary, KEEP_OPACITY]}` es correcta); cambia **solo la aserción**. La intención se conserva: sin
labio, sin atenuado y detectar claves coladas.

**Medido por el spec_author (no de memoria)** sobre el árbol de `eace0652` más el WIP de Codex: la misma
igualdad exacta aparece en **tres** sitios, todos sobre un `Button` de heroui:

| Fichero (desde `mobile-pet-tracker/`) | Aserción actual | Nodo |
|---|---|---|
| `src/screens/geofences/index.test.tsx`, `it.each` «#189 R7: receta y navegación…», rama `count === 5` | `expect(StyleSheet.flatten(add.props.style)).toEqual({ opacity: 1 })` | `geofences-add` |
| ídem, `it` «#189 R20.1: el límite conserva disabled:element-disabled…» | ídem | `geofences-add` |
| `src/screens/geofence-editor/index.test.tsx`, `it` «#189 R19.2: Guardar vacío permanece gris, bloqueado y con opacidad 1 sin busy» | `expect(StyleSheet.flatten(save.props.style)).toEqual({ opacity: 1 })` | `geofence-editor-save` (Guardar, `style={KEEP_OPACITY}` con el nombre vacío); la ejecución del `it` muestra recibido `{ borderCurve: 'continuous', opacity: 1, transform: [{ scale: 1 }] }` |

**No tienen el defecto** (aserciones parciales sobre `opacity`, que no se tocan): los `Switch`
`geofence-<id>-active` (`StyleSheet.flatten(node.props.style)?.opacity` `toBe(1)`) y `geofence-editor-active`,
`geofence-editor-delete` y `geofence-editor-save` bajo `busy` (el mismo `?.opacity` `toBe(1)` del bucle de
R19.2 (E)); Añadir zona con `count < 5` y bajo `busy` (`toHaveStyle`, parcial); y
`StyleSheet.flatten(save.props.style)?.boxShadow` `toBeUndefined()` del Editor (parcial). Los candados de
fuente (`geofences-canvas-fidelity.test.ts` l. ~93, `toContain` del texto de `KEEP_OPACITY`) y
`chunky-cta-canvas-fidelity.test.ts` no contienen igualdad de flatten (grep de `flatten` y `opacity`): no se
tocan. Las ocurrencias de `toHaveStyle({ opacity: 1 })` sobre otros nodos (p. ej. `column` en Zonas) son
ajenas a `geofences-add` y no se tocan.

**Texto que E5 sustituye (antes → después)**

| Cláusula | Antes (E4) | Después | R |
|---|---|---|---|
| R20.1 | `StyleSheet.flatten(add.props.style)` es exactamente `{ opacity: 1 }` (no contiene `boxShadow`) | es exactamente `{ borderCurve: 'continuous', transform: [{ scale: 1 }], opacity: 1 }` (las dos primeras claves las pone heroui, no la pantalla); `opacity === 1` y **sin** `boxShadow` | R20.1 |
| R20 Test (F), `count === 5` | `toEqual({ opacity: 1 })` | `expect(StyleSheet.flatten(add.props.style)).toEqual({ borderCurve: 'continuous', transform: [{ scale: 1 }], opacity: 1 })` (conserva el cierre de claves: cualquier clave extra, p. ej. `boxShadow`, lo pone en rojo). Los `toHaveStyle` de `count < 5` y de `busy` **no cambian** | R20 |
| `it` «#189 R20.1» | `toEqual({ opacity: 1 })` | el mismo `toEqual` de la fila anterior | R20.1 |
| R19 Test (E), «Guardar vacío» sin `busy` | `toEqual({ opacity: 1 })` | `expect(StyleSheet.flatten(save.props.style)).toEqual({ borderCurve: 'continuous', transform: [{ scale: 1 }], opacity: 1 })` (el mismo cierre: sin labio, sin atenuado) | R19.2 |
| P-E4-4 | el `toEqual` «falla por `boxShadow`» | sigue poniendo en rojo R20.1, ahora porque aparece la clave `boxShadow` en el flatten (recibido `{ borderCurve, transform, boxShadow, opacity }` ≠ esperado) | R20.1 |

Las claves `borderCurve` y `transform` son de heroui: si una actualización de `heroui-native` las cambia,
el `toEqual` se pone rojo y la enmienda es de aserción, no de producción. Es el precio de conservar el
cierre de claves, que es lo que detecta un `boxShadow` o una opacidad colados.

**Lección.** Premisa de composición de estilos de un componente de terceros **no verificada contra su
fuente al especificar** (R20.1): E4 verificó el *orden* (`[buttonRoot, style]`, que `style` gana) pero no
*qué claves* aporta el componente al estilo aplanado, y prescribió una igualdad exacta sobre ese resultado.
Regla para futuras specs: una aserción de igualdad exacta sobre el estilo aplanado de un nodo de heroui
(`Button`, `Switch`, `Card`…) enumera **también** las claves que pone el componente, medidas contra su
fuente o con una ejecución real, no solo las que pone la pantalla.

**Sin cambio de producción ni de otros R.** `KEEP_OPACITY`, `isDisabled`, la clase
`disabled:element-disabled`, M10-M19, las sondas P-E4-1..3 y P-E4-5..13, los candados agregados y la
lista de E4 no se mueven. Una referencia de R23.2 / DE4-2 a «enmienda E5» (geometría fuera de ±8 dp) se
lee ahora «enmienda posterior» (E6 si hace falta): E5 ya es esta.

**Orden rojo → verde (E5 solo toca la aserción; el orden de E4 no cambia).** Los rojos de R19 (`297b9f4b`)
y R20 (`eace0652`) ya están versionados con la aserción defectuosa. Antes del verde conjunto `feat(mobile):
#189 E4 R19 R20 …` se añaden **dos commits de test** (solo tests, sin producción):

1. `test(mobile): #189 E5 R20 rojo-corrección — flatten real de Añadir zona en el límite`: los dos `toEqual`
   de `geofences/index.test.tsx` (**«R20 rojo-corrección (E5)»**).
2. `test(mobile): #189 E5 R19 rojo-corrección — flatten real de Guardar vacío`: el `toEqual` de
   `geofence-editor/index.test.tsx`.

Ambos siguen **rojos** hasta el verde conjunto (la producción de R19/R20 aún no está commiteada): se
verifica que el rojo es por la ausencia de `KEEP_OPACITY` y no por el literal del `toEqual`; el verde
conjunto de R19 y R20 sigue siendo uno solo (aclaración de `tasks.md`). La probe P-E4-4 se vuelve a plantar
tras el verde para confirmar que el `toEqual` corregido sigue cerrando claves.

**Lista cerrada de ficheros que Codex puede tocar para E5** (desde `mobile-pet-tracker/`):
`src/screens/geofences/index.test.tsx` y `src/screens/geofence-editor/index.test.tsx`, únicamente las
aserciones de la tabla de arriba. **No** hay que tocar `chunky-cta-canvas-fidelity.test.ts` ni
`geofences-canvas-fidelity.test.ts` (el grep no muestra la misma igualdad). Producción, docs y el resto de la
lista de E4 no cambian. Registro: `progress/impl_mobile-geofences-canvas-fidelity.md` y
`specs/mobile-geofences-canvas-fidelity/traceability.md`.

### §4.6 Enmienda E6 (2026-10-22): premisa falsa «delta cero» sobre `consistency-classnames` (R19, R22.3)

Base de medida: `31b7a082` (HEAD de la branch al redactar) más el WIP sin commitear de Codex (producción de
R19/R20 en el árbol: `KEEP_OPACITY` y sus importaciones). Los números de línea caducan: se anclan por
contenido y se re-miden en el H0 de la enmienda.

**Origen.** En el verde conjunto de R19 y R20, la ejecución de `consistency-classnames.test.ts`
(`progress/e7-r19-r20-green-consistency-classnames.log`: 1 fallo de 75) puso en rojo un `it` que E4
declaró «delta cero» y dejó **fuera** de su lista de edición. La premisa estaba en tres sitios de E4: la fila
«Candados agregados que se mueven» de `consistency-classnames.test.ts` (las importaciones de las pantallas
cambian «que ningún candado fija por texto (los únicos candados de import exacto son los de `history`)»), la
«Regla de H0-E4» («los tres ficheros de candados agregados … **no** están en la lista de edición … el delta
esperado es cero») y la «Lista cerrada» («Fuera de la lista: … `consistency-classnames.test.ts`»). Es falsa
para **un** `it` y **dos** aserciones. **La producción de R19/R20/R22 no cambia**; cambian solo dos
literales de un test de fuente.

**Medido por el spec_author (no de memoria)**: barrido M20 (comandos abajo) sobre el árbol de `31b7a082` más
el WIP, más lectura de cada `it` que casó. El único `it` que choca está en
`src/__tests__/consistency-classnames.test.ts`: «#189 R9: la hoja del Editor combina esquina continua y flex
sin perderlos» (l. ~696-703):

| # | Aserción (ancla por contenido) | Literal actual | Literal nuevo | Causa | Estado hoy |
|---|---|---|---|---|---|
| C1 | `expect(source).toContain("import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../../theme/native-styles';")` (l. ~698) | `import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../../theme/native-styles';` | `import { CONTINUOUS_CORNER, KEEP_OPACITY, TABULAR_NUMS } from '../../theme/native-styles';` | R19 (el Editor importa `KEEP_OPACITY`, en orden alfabético) | **rojo medido** contra el WIP de R19 (el log) |
| C2 | `expect(source).toContain('<KeyboardAvoidingView testID="screen-geofence-editor" className="flex-1" behavior="padding" keyboardVerticalOffset={headerHeight}>')` (l. ~701) | `… keyboardVerticalOffset={headerHeight}>` | `… keyboardVerticalOffset={0}>` (resto de la etiqueta idéntico) | R22.3 | verde hoy; **rojo previsto** al aterrizar R22 (predicho por lectura de R22.3 y M13, no medido: R22 aún no está en el árbol) |

Sin cambio en el mismo `it`: `style={[CONTINUOUS_CORNER, { flexGrow: 0, flexShrink: 1 }]}` (l. ~699) y
`source.match(/\bCONTINUOUS_CORNER\b/g)` con longitud 2 (l. ~700): R19 y R22 no añaden usos de
`CONTINUOUS_CORNER` (el recuento sigue en import + un uso).

**Barrido M20 (obligatorio en el H0 de E6 y de nuevo al cerrar R22; los comandos se ejecutan, no se
recuerdan).** Desde `mobile-pet-tracker/`:

```
grep -rlE "native-styles|HeaderHeightContext|useContext|useHeaderHeight|keyboardVerticalOffset|contentInsetAdjustmentBehavior|paddingTop: 24|left-4 top-3|left: 16|TRANSPARENT_HEADER_OPTIONS|header-layout|headerShown|geofence-editor-title|chunkyLip|readFileSync" src --include=*.test.ts --include=*.test.tsx | sort
grep -rnE "native-styles|HeaderHeightContext|useContext|useHeaderHeight|keyboardVerticalOffset|contentInsetAdjustmentBehavior|paddingTop: 24|left-4 top-3|left: 16|headerShown|Stack\.Screen|TRANSPARENT_HEADER|header-layout|h-11|self-start|justify-center|pointerEvents|box-none" src --include=*.test.ts --include=*.test.tsx | grep -v "screens/geofence"
```

El segundo comando excluye los dos tests de pantalla (en la lista de E4). Cada línea que case se clasifica
en las tablas de esta enmienda; **si una línea nueva casa contra un literal que algún R de E4 cambia y no está
clasificada aquí, PARA y reporta** (no se enmienda dentro del verde). Resultado en `31b7a082` + WIP: 45 tests
leen fuente (`readFileSync`/`readSource`), 16 de ellos casan algún literal de arriba. Los que fijan un literal
de los ficheros de E4 son los de C1/C2, los de la lista de E4 y los siguientes, que **no** chocan:

| Fichero (ancla) | Qué fija | Por qué no choca |
|---|---|---|
| `consistency-classnames.test.ts`, `declara las dos constantes nativas compartidas` (l. ~278) | `toContain` de `export const CONTINUOUS_CORNER = …` y del bloque `TABULAR_NUMS` | `KEEP_OPACITY` se **añade** a `native-styles.ts` sin tocar esos dos bloques; `toContain` no ve el añadido |
| ídem, `directUses` / `style={CONTINUOUS_CORNER}` global y por fichero, `TABULAR_NUMS` (l. ~289-310, ~346-360, ~392-407) | recuentos de usos y regex `import \{[^}]*\bCONTINUOUS_CORNER\b[^}]*\} from …native-styles` | la regex de import tolera más miembros; R19/R22 no añaden usos (recuentos intactos) |
| ídem, `card.tsx` `import { CONTINUOUS_CORNER } from '../theme/native-styles';` (l. ~312) | import exacto del `Card` | `card.tsx` no es fichero de E4 |
| ídem, `rounded-full` ausente en una etiqueta (l. ~304) | `not.toContain('rounded-full')` en una etiqueta de otra pantalla | ajena a las dos pantallas |
| ídem, labios y neutros (l. ~555-556, ~566-645, ~659) | inventarios de `border-b-*`, `chunkyLip` y neutros | E4 no cambia clases ni recuentos de labio; los `style=` los fija `chunky-cta` (en la lista de E4) |
| `design-drift.test.ts` (import de `history`, l. ~1197; frases de la carta; `it` de #185 R10) | import exacto de `history`; frases de la carta | `history` no es de E4; las frases de la carta no se tocan salvo lo que añade R24, que va **después** de la mención de docs-upload del `it` de #185 R10 |
| `heroui-text-size-merge.test.ts` (pisos 197 y 163), `legibility-classnames.test.ts` | nodos HeroUI / `className` por fichero | E4 no añade ni quita componentes de heroui ni clases `text-NN` (R21 añade `h-11`, R22 `self-start`/`absolute`: no son `text-NN`) |
| `ui-language.test.ts` + `ui-copy-table.ts`, `language-provider.test.tsx` | recuento de `t('geofenceEditor.title')` (exactamente 2 en el Editor) y claves | R22 **no** añade ni quita llamadas `t(…)`: la píldora y las ramas de estado conservan las 2 existentes |
| `alert-detail-canvas-fidelity.test.ts` (`expo-blur`, l. ~24) | ficheros que importan `expo-blur` (3, con el Editor desde E3) | R22 conserva el `BlurView` de la píldora; el conjunto no cambia |
| `profile-canvas-fidelity.test.ts` (`rounded-tile`, `text-26`, `text-13`), `alerts-canvas-fidelity.test.ts` (`text-15`, `tracking-title`, `border-b-5`) | inventarios por clase | R21/R22 añaden `h-11`, `gap-2`, `justify-center`, `self-start`, `absolute`, `overflow-hidden`, `rounded-full`: ninguna inventariada |
| `empty-state.test.tsx` (`<EmptyState` ×2 en Zonas; prohibidos `reanimated`/`MOTION_`, l. ~204, ~219, ~373-377) | recuentos y ausencias en Zonas | R21/R22 no tocan los `EmptyState` ni añaden movimiento |
| `app/__tests__/layout.test.tsx`, `chunky-cta-canvas-fidelity.test.ts`, `geofences-canvas-fidelity.test.ts` | opciones de ruta, `style=` de los CTA, candados de la carta | **ya en la lista de E4** (R21, R19/R20, R23/R24): E6 no los toca |
| `detail-stack.test.tsx`, `detail-stack.guard.test.tsx`, `font-registration.test.ts`, `welcome`/`docs`/`docs-upload-form`/`pairing`/`home`/`map` `index.test.tsx` y el resto de la salida de M20 | rutas declaradas, `_layout.tsx` leído por texto, copy y recuentos | ninguno fija un literal que E4 cambie |

**Cambios de contrato: ninguno.** Los dos literales son valores de producción que E4 ya prescribe (R19 importa
`KEEP_OPACITY`; R22.3 fija `keyboardVerticalOffset={0}`); el test solo los sigue. Si el barrido del H0 de E6
encontrara algo que **no** sea una actualización de literal, no entra en esta enmienda: PARA y reporta al leader.

**Texto que E6 sustituye (antes → después)**

| Cláusula | Antes (E4) | Después | R |
|---|---|---|---|
| E4 §4.4, fila de `consistency-classnames.test.ts` («Candados agregados que se mueven») | «sin cambio … que ningún candado fija por texto (los únicos candados de import exacto son los de `history`)» | **Falsa para un `it`**: `consistency-classnames.test.ts`, «#189 R9: la hoja del Editor combina esquina continua y flex sin perderlos», fija el import exacto del Editor (C1) y la etiqueta del `KeyboardAvoidingView` (C2). Los candados de `style={CONTINUOUS_CORNER}`, `TABULAR_NUMS` y la declaración de las constantes sí quedan sin cambio | R19, R22 |
| E4 §4.4, «Regla de H0-E4» (regla residual de §4.2) | los tres ficheros de candados agregados no están en la lista de edición; delta esperado cero | `consistency-classnames.test.ts` entra en la lista **solo para ese `it`** (C1, C2). `design-drift.test.ts` y `heroui-text-size-merge.test.ts` siguen fuera con delta esperado cero; si alguno se pone rojo, PARA. **Nueva regla**: el «delta cero» de un fichero de candados agregados se afirma con el barrido M20 ejecutado, no con una lectura de la lista | R19, R22 |
| E4 §4.4, «Lista cerrada de ficheros que E4 puede tocar», «Fuera de la lista» | `consistency-classnames.test.ts` fuera | dentro, únicamente C1 y C2 (lista de E6, abajo) | R19, R22 |
| E4 R22.3 y M13 | `keyboardVerticalOffset={0}` en la etiqueta | además, la **etiqueta de apertura** del `KeyboardAvoidingView` conserva su forma: una sola línea, atributos `testID`, `className`, `behavior`, `keyboardVerticalOffset` en ese orden y sin otro atributo (C2 la fija como texto). Si R22 necesitara otro atributo, es una enmienda de C2 | R22 |

**Colisión de nombre.** La tolerancia de geometría de R23.2 / DE4-2 («Fuera de 8 dp se necesita enmienda E5
con nueva firma» en R23.2 y en la tabla DE4-2; «fuera, enmienda E5 (DE4-2)» en `design.md`) ya se leía
«enmienda posterior (E6 si hace falta)» desde E5, porque E5 pasó a ser la corrección del `toEqual` de
heroui. **E6 es esta enmienda**: esa referencia se lee ahora **«enmienda E7»** (la siguiente que haga
falta, con nueva firma). No se edita el texto firmado de E4/E5 en su sitio: manda esta nota, igual que la
de E5.

**Lección.** La premisa «delta cero» sobre candados agregados se afirmó **sin barrer** todas las aserciones de
fuente del repo contra los literales que cada R cambia: E4 buscó los candados de *uso* (`style={…}`,
recuentos) y no los de *texto exacto* de una importación o de una etiqueta. Regla para futuras specs: antes
de escribir «sin cambio» o «delta esperado cero» sobre un candado agregado, enumerar con `grep` (comando y
resultado en la spec) **cada** `toContain`/`toMatch`/`toEqual` de fuente que mencione un literal de un
fichero que el R toca (importaciones, etiquetas de apertura con atributos, `export const`, opciones de
ruta) y clasificarlo; una importación de un fichero de producción cuyos miembros cambian es un literal
fijado hasta que el grep demuestre lo contrario.

**Sin cambio de producción ni de otros R.** `KEEP_OPACITY`, `header-layout.ts`, las pantallas, `_layout.tsx`,
M10-M19, las sondas P-E4-1..13 y los demás candados agregados de E4 no se mueven. La única restricción nueva
es la forma de la etiqueta del `KeyboardAvoidingView` (fila R22.3 de arriba), que el texto de E4 ya cumple.

**Orden rojo → verde (C4: ningún test en el mismo commit que su producción).** La enmienda no altera el
orden de E4 (R23, R19+R20 con un verde conjunto, R21, R22, R24); añade dos movimientos de test:

1. **C1 (R19)**: un commit de test aparte, **antes** del verde conjunto `feat(mobile): #189 E4 R19 R20 …` y
   después de los dos commits de E5: `test(mobile): #189 E6 R19 rojo-corrección — import de KEEP_OPACITY en
   el candado de la hoja del Editor`. Cambia solo la línea del import (C1) y añade al nombre del `it` el
   sufijo `(enmendado por E4 R19)`. Es rojo de verdad contra la producción commiteada (el `HEAD` del Editor
   aún importa `{ CONTINUOUS_CORNER, TABULAR_NUMS }`), pero con el WIP de Codex en el árbol sale verde: el
   rojo se demuestra apartando solo la producción (`git stash push -m "189-E6-wip" -- mobile-pet-tracker/src/screens
   mobile-pet-tracker/src/theme`, ejecutar el `it`, comprobar que falla por el literal del import y
   `git stash pop`; mirar `git stash list` y el mensaje antes de soltar: el stash es del repo, no del
   worktree). Frente a «en el mismo commit que el verde» (mezcla test y producción, incumple C4) y a «un
   commit ya verde con la producción presente» (nace verde, sin historial rojo→verde), este orden deja a R19
   y R20 con su rojo propio (`297b9f4b`, `eace0652`, más este) y el verde conjunto sigue siendo uno solo; el
   `it` pasa a verde con ese commit.
2. **C2 (R22)**: **dentro del commit rojo de R22** (`test(mobile): #189 E4 R22 rojo — …`), no en el verde.
   Cambia solo la línea de la etiqueta (C2) y añade el sufijo `(enmendado por E4 R22)`. Es rojo por la razón
   correcta (la producción conserva `{headerHeight}` hasta el verde de R22) y pasa a verde con
   `feat(mobile): #189 E4 R22 …`. R22 conserva su rojo propio (C4). *(La instrucción de partida situaba C2
   «con el verde de R22»; se coloca en su rojo porque el commit verde es solo producción y docs por regla
   de E4. El efecto es el mismo: C2 y la producción de R22 cambian a la vez desde el punto de vista del
   verde, y el rojo precede.)*

Sondas (candados no tautológicos; se plantan tras el verde y se registran en el informe):

| # | Mutación plantada | Debe poner en rojo |
|---|---|---|
| P-E6-1 | el import del Editor con los miembros en otro orden (`{ KEEP_OPACITY, CONTINUOUS_CORNER, TABULAR_NUMS }`) | C1 (el `toContain` exacto) |
| P-E6-2 | tras R22, `keyboardVerticalOffset={headerHeight}` restaurado | C2 (y el `it` de teclado de P-E4-9) |
| P-E6-3 | tras R22, la etiqueta del `KeyboardAvoidingView` partida en varias líneas (formato de prettier) con `{0}` | C2: demuestra que la restricción de forma es real y no una frase |

**Lista cerrada de ficheros que Codex puede tocar para E6** (desde `mobile-pet-tracker/`):
`src/__tests__/consistency-classnames.test.ts`, únicamente el `it` «#189 R9: la hoja del Editor combina
esquina continua y flex sin perderlos» (C1, C2 y el sufijo del nombre; **no** se tocan las líneas de
`style={[CONTINUOUS_CORNER, …]}` ni del recuento 2). Se **suma** a la lista cerrada de E4. **No** hay que
tocar `design-drift.test.ts`, `heroui-text-size-merge.test.ts` ni los demás tests de la tabla de no-choque.
Producción, docs y el resto de la lista de E4 no cambian. Registro:
`progress/impl_mobile-geofences-canvas-fidelity.md` (resultado de M20, base + delta) y
`specs/mobile-geofences-canvas-fidelity/traceability.md`.

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
- **El mismo atenuado `disabled:element-disabled` en el resto de la app** (DE4-5): los `Switch`/`Button`
  de heroui con `isDisabled` de otras pantallas siguen al 50 %; E4 solo cubre las dos pantallas de #189.
  Candidato a una feature propia (`KEEP_OPACITY` ya existiría).
- **iOS** (DE4-3): el smoke de #189 es Android; las cabeceras transparentes y los offsets de E4 no se
  verifican visualmente en iOS.
- **Cabecera con fondo al desplazar** en Zonas (DE4-4): el contenido pasa bajo la flecha; es otra feature.
- **Botón de volver de cristal** sobre el mapa del Editor: sigue fuera (su contraste sobre el mapa se
  comprueba en el smoke de E4).

## §6. Prueba de humo (humano)

En el dev build Android del PC del humano, claro y oscuro, con dueño y con un rol `family`:
1. Zonas con 0, 3 y 5 zonas: título 26/900, contador y barra, colores de tile por posición, aviso ámbar y
   botón gris solo con 5.
2. Pulsar el tile abre el Editor; el interruptor y la papelera de la fila funcionan.
3. Editor: píldora de título sobre el mapa, hoja con esquinas de 28, solapa de 26 sobre el mapa,
   Radio con 20 m y 2000 m, Eliminar (neutro) y Guardar (primario), Guardar gris con el nombre vacío.
4. Abrir el teclado en el campo Nombre: la hoja sube y no tapa el campo; el mapa se encoge.
5. Reduce motion activo: las filas aparecen sin movimiento.

Pasos añadidos por E4 (§4.4), mismo dev build Android, claro y oscuro:
6. **Sin parpadeo ni atenuado.** Zonas: activar y desactivar un interruptor, y borrar una zona: ni los
   interruptores ni «Añadir zona» se atenúan mientras escribe. Editor: escribir en Nombre y pulsar Guardar,
   Eliminar y el interruptor Activa: ninguno se atenúa mientras `busy`. (R19; jest no ve el 0.5.)
7. **«Añadir zona» con 5 zonas** se ve gris `bg-default` con texto apagado, como el botón `disabled` del
   artboard, y no más oscuro. (R20)
8. **Zonas, cabecera**: flecha, título 26/900 y contador «n/5» en **una** fila; el título empieza a unos
   62 dp del borde (artboard, ±8 dp); el contenido no queda tapado por la cabecera; al desplazar, las filas
   pasan bajo la flecha (aceptado, DE4-4). (R21, R23)
9. **Editor, cabecera**: el mapa llega al borde superior; la píldora «Zona segura» queda a la derecha de
   la flecha en el mismo eje, a unos 70 dp del borde (±8 dp); la flecha se lee sobre el mapa en claro y
   oscuro; al abrir el Editor **no** hay destello de cabecera opaca a transparente (si lo hay: fallback
   de design.md, otra enmienda); las ramas de estado (esqueleto, error, no encontrada) conservan la
   cabecera opaca y el título 26/900. (R22, R23)
10. **Teclado con offset 0**: abrir el teclado en Nombre; el campo no queda tapado y la hoja sube
    (equivale a `paddingBottom` 200 del test). (R22.3)

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-19) ← gate obligatorio antes de implementar
- [X] Enmienda E1 (§4.1) aprobada por humano (fecha: 2026-10-21) ← gate obligatorio antes de reanudar desde R6
- [X] Enmienda E2 (§4.2) aprobada por humano (fecha: 2026-10-21) ← gate obligatorio antes de reanudar la comprobación previa
- [X] Enmienda E3 (§4.3) aprobada por humano (fecha: 2026-10-21) ← gate obligatorio antes de reanudar R18
- [X] Enmienda E4 (§4.4) aprobada por humano (fecha: 2026-10-22) ← gate obligatorio antes de reanudar R23 (y resolver DE4-1..DE4-5)
- [X] Enmienda E5 (§4.5) aprobada por humano (fecha: 2026-10-22) ← gate obligatorio antes de reanudar el verde de R19 y R20 (corrección de la aserción de R20.1)
- [ ] Enmienda E6 (§4.6) aprobada por humano (fecha: ____) ← gate obligatorio antes de reanudar el verde de R19 y R20 (el candado de consistency-classnames cambia con la producción)
