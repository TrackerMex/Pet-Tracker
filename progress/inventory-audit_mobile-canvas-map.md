# Auditoría del inventario de candados — #201 mobile-canvas-map

Estado: COMPLETO. Solo lectura sobre el código; este es el único fichero escrito. Sin jest, tsc, lint ni init.sh (las comprobaciones de regex se hicieron con `grep` y `node -e` sobre ficheros, sin ejecutar la suite).
Base: worktree `/home/claude/sites/Pet-Tracker-wt-201`, rama `feature/201-mobile-canvas-map`, HEAD `ccd5460a` (merge de la spec `fd22ec45` con `origin/dev` `329c613c`, que ya contiene #197, #198 y #200). La spec se escribió contra `origin/dev` `71ff81a1`, antes de #198. Todas las rutas de código son relativas a `mobile-pet-tracker/` salvo indicación.
Abreviaturas (las de la spec): MT = `src/screens/map/index.test.tsx` · CF = `src/__tests__/map-canvas-fidelity.test.ts` (nuevo) · ES = `src/components/__tests__/empty-state.test.tsx` · EH = `src/components/__tests__/empty-state-hero.test.tsx` · PM = `src/components/__tests__/pet-map.test.tsx` · CC = `src/__tests__/chunky-cta-canvas-fidelity.test.ts` · LG = `src/__tests__/legibility-classnames.test.ts` · FN = `src/__tests__/canvas-foundations.test.ts` · DD = `src/__tests__/design-drift.test.ts` · CO = `src/__tests__/consistency-classnames.test.ts` · AF = `src/__tests__/alerts-canvas-fidelity.test.ts`. «Spec» = `specs/mobile-canvas-map/`.

Tipos: **F** = `it` que se pone rojo y no está en el inventario. **M** = fila del inventario o pasaje de la spec mal descrito, con cifra/ruta errónea, o candado nuevo ciego/inalcanzable. **A** = suposición verificada, ancla o veto de la carta.
Severidad: **alta** = rojo seguro que dispara la regla de parada, o fichero/paso que no nace verde; **media** = rojo seguro de lista/cuenta agregada, o candado nuevo que no muerde; **baja** = redacción, higiene o robustez.

## Resumen de hallazgos

17 hallazgos accionables: 5 alta, 5 media, 7 baja. Los tres F son los que paran la implementación: tres `it` agregados que la spec no inventaría.

| Id | Tipo | Severidad | Resumen | R |
|---|---|---|---|---|
| F1 | F | alta | DD `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto` se pone rojo en dos aserciones (lista de `rounded-14` y objeto `rounded16`) y no está en el inventario | R5, R7, R10, R13 |
| F2 | F | alta | CO `#64 R9 › centraliza las diez clases completas…` exige que solo `utils/category-palette.ts` nombre `bg-category-`/`text-category-`; el mapa lo rompe | R7, R11 |
| F3 | F | alta | AF `#174 R12: inventarios › limita text-15 a su inventario de producción` no lista el mapa | R2 |
| M1 | M | alta | R10 pide `animation="pulse"` en `Skeleton`: esa prop no acepta `'pulse'` (es `variant="pulse"`); typecheck rojo, latido de shimmer y tres candados atados al literal erróneo | R10 |
| M2 | M | alta | La prosa de tonos de R2 intercambia «sin señal» y «desactualizado» respecto a producción, a D17 y a `#116 R4`; la fila 10 dice «resto igual» | R2 |
| M3 | M | media | MT no tiene doble de `reicon-react-native` y la spec afirma `size`/`strokeWidth`/`color` de seis iconos: los `it` no pueden leerlos | R7, R9, R11, R12, R13 |
| M4 | M | media | El mecanismo de color en jest no está prescrito (R7 `#D80B34`, R11 `#D92D20`, R9 «leído de global.css»); por defecto el color sale `#0D1117` | R7, R9, R11 |
| M5 | M | media | R14 ya está entregado por #198 R18: seis `it` ES duplicados nacen verdes y la «Base medida» de R14 es falsa | R14 |
| M6 | M | media | CF `#201 R16`: `HEX_LITERAL` es una cadena que el repo usa con flag `i`; la guarda de la guarda planta `'#107148'` (solo dígitos) y no caza `#D80B34` | R16 |
| M7 | M | media | R13 `map-no-tracking-badge` con «`style.boxShadow` no vacío»: el host de `PopIn` lleva `style` en array, y «no vacío» deja pasar cualquier sombra | R13 |
| M8 | M | baja | Fila 26 (FN `#197 R20`) apunta a un candado que ya no existe; `grep -cF '#197 R20'` en FN = 0 | R2 |
| M9 | M | baja | design.md (Premisas, Riesgos, Archivos afectados) y tasks.md (filas R14) describen un `EmptyState` y un #197 anteriores a #198 | R14 |
| M10 | M | baja | R15: el `it` «sin polylineWidth no llevan ancho» admite una aserción `toEqual` que tolera `width: undefined` | R15 |
| M11 | M | baja | R1 (y R11/R13): MT necesita un doble de Reanimated a nivel de módulo con `__esModule: true`; la spec solo dice «mismo mecanismo que HomeEntrance» | R1 |
| M12 | M | baja | La spec dice que midió los literales de canvas con `grep -cF`, que cuenta líneas: `MapaCarga` da 3, no 11 (son ocurrencias) | R10, R2, R5 |
| M13 | M | baja | R13 no prescribe la sentencia literal `const chunkyLip = useChunkyLip();` que CC `#177 R7.4` exige ×1 por consumidor; el título de ese `it` dice «diecisiete» | R13 |
| M14 | M | baja | ES `#159 R9` conserva el título «los estados sin collar no traen movimiento» cuando R13 les añade `PopIn`; título semánticamente falso tras la enmienda | R13 |
| A1–A12 | A | — | Anclas, cuentas y vetos verificados (ver abajo) | — |

## Faltan (F): `it` que se ponen rojos y no están en el inventario

### F1 — DD `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto` (alta)

Fichero y línea: `src/__tests__/design-drift.test.ts` L1118 (título completo con sufijos `(enmendado por #177 R10) (enmendado por #200 R9) (enmendado por #198 R9)`). Dos aserciones de ese `it` se rompen:

1. L1155: `expect(outsideReminders(/\brounded-14\b/)).toEqual([...])` con cinco rutas (`components/segmented-control.tsx`, `screens/geofences`, `screens/meal-schedule`, `screens/meals-history`, `screens/pairing`). `outsideReminders` usa `pattern.test(contenido)` por fichero, así que una sola ocurrencia basta. El mapa gana `rounded-14` con R5 (cuatro tiles), R7 (botón rosa) y R10 (tiles y botón del esqueleto). Valor nuevo: la lista pasa a seis y `join('screens', 'map', 'index.tsx')` se inserta entre `screens/geofences` y `screens/meal-schedule` (`sourceFiles` va ordenado: `geofences` < `map` < `meal-schedule`).
2. L1135-1152: el objeto `rounded16` (`toEqual` sobre todos los ficheros de producción salvo Recordatorios) gana `'screens/map/index.tsx': 1` por el badge de R13 (`rounded-16 bg-accent`). Es el mismo número que la fila 22 de la spec anota para CC, pero DD tiene su propio inventario y no está en la tabla. Medida: el mapa no tiene hoy `rounded-16`; R11 usa `rounded-full` y R12 no añade ninguno, así que el valor nuevo es exactamente 1.

El inventario solo recoge de DD el `it.each` `'map' importa el Card compartido` (que sigue verde, ver A6). La fila 22 cita el objeto `radii` de CC, no el de DD.
Enmienda propuesta: fila 27 `DD › reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto | lista de cinco rutas de rounded-14 y objeto rounded16 sin el mapa | seis rutas (con el mapa entre geofences y meal-schedule) y rounded16 con 'screens/map/index.tsx': 1 | R5, R7, R10, R13`, más sufijo `(enmendado por #201 R5, R13)`.

### F2 — CO `#64 R9 › centraliza las diez clases completas y prohíbe interpolarlas` (alta)

Fichero: `src/__tests__/consistency-classnames.test.ts`, `describe('#64 R9: el color categórico solo se nombra en el módulo de paleta')` (L428). `categoryClassInventory().files = filesMatching(/bg-category-|text-category-/)` y el `it` exige `toEqual([join('utils', 'category-palette.ts')])`. Medido con `grep -rlE "bg-category-|text-category-"` sobre producción: hoy solo `utils/category-palette.ts`.

R7 pinta `bg-category-rose` y `text-category-rose-strong` en el mapa; R11 añade `bg-category-rose` al badge de error. El valor nuevo de `files` es `['screens/map/index.tsx', 'utils/category-palette.ts']`: rojo seguro. Además contradice la intención escrita del lock («el color categórico solo se nombra en el módulo de paleta»).

Hay dos salidas y la elección es del leader (no es una enmienda mecánica: el `it` no compara contra el literal que se quita, sino contra uno que se añade):
- (a) Usar la paleta: `CATEGORY_SLOTS.rose.surface` y `CATEGORY_SLOTS.rose.ink` (`utils/category-palette.ts` L25: `rose: { surface: 'bg-category-rose', ink: 'text-category-rose-strong' }`). El patrón ya existe (`food` usa `CATEGORY_SLOTS.violet.ink`). Consecuencia: los literales `bg-category-rose` ×1/×2 y `text-category-rose-strong` de la spec (R7 `className="h-12.5 gap-2 rounded-14 bg-category-rose"`, R10 y las CF de R7/R11) dejan de ser ocurrencias literales en el mapa y hay que reescribir esos literales y las exactitudes de `className` de los MT.
- (b) Enmendar el candado: fila nueva `CO › #64 R9 › centraliza las diez clases completas… | files [category-palette.ts] | files con el mapa | R7, R11`, a costa de diluir su intención.
Recomendación: (a), porque conserva el candado y la carta.

### F3 — AF `#174 R12: inventarios › limita text-15 a su inventario de producción` (alta)

Fichero: `src/__tests__/alerts-canvas-fidelity.test.ts`, `describe('#174 R12: inventarios')`, fila `token: 'text-15'` (L202-223), `pattern: /(?<![\w-])text-15\b/`, y `expect(filesMatching(pattern)).toEqual(files)` (L247). R2 pinta `text-15 font-extrabold` en `map-pet-pill-name`. El mapa no tiene `text-15` hoy. Valor nuevo: la lista de 16 rutas pasa a 17 con `'screens/map/index.tsx'` entre `'screens/login/index.tsx'` y `'screens/meal-schedule/index.tsx'`.
Las otras filas del `it.each` (`rounded-10`, `border-b-5`, `tracking-caps`, `tracking-title`) no se mueven: el mapa no las usa. `text-11` no tiene inventario de ficheros en ningún test (solo líneas de la carta en DD L29-41 y L127-129).
Enmienda propuesta: fila 28 `AF › #174 R12: inventarios › limita text-15… | lista sin el mapa | con 'screens/map/index.tsx' // #201 R2 | R2`.

## Sobran o mal descritos (M)

### M1 — `animation="pulse"` no es la API de `Skeleton` (alta)

Evidencia: `node_modules/heroui-native/src/components/skeleton/skeleton.types.ts` L112-120: `variant?: SkeletonAnimation` (`'shimmer' | 'pulse' | 'none'`, por defecto shimmer) y `animation?: SkeletonRootAnimation`, cuyo tipo es `boolean | 'disabled' | 'disable-all' | { ... }`. El ejemplo del propio `.d.ts` (L141) es `variant="pulse"`. En el repo no hay `variant="pulse"` ni `animation="pulse"` en `src` (grep = 0).
Dónde está el error en la spec: requirements.md L78 (D14 «`Skeleton animation="pulse"`»), L436-437 («con `animation="pulse"`»), L445-446 (MT «los once bloques laten con pulse»: «todos tienen `animation` `'pulse'`»), L450 (CF «`animation="pulse"` ×11»); tasks.md L40 (`grep -cF 'animation="pulse"' $M` 0 → +11).
Consecuencias: (1) `animation="pulse"` da TS2322, así que el typecheck de `init.sh` queda rojo en el commit de R10; (2) aunque compilase, el runtime sería shimmer, no pulso; (3) CF y la cuenta de tasks.md quedan atados al literal inexistente, y el candado «11 nodos con `animation: 'pulse'`» pediría al implementador compilar código inválido para ponerse verde.
Mecanismo del MT, además, sin resolver: RNTL ^14.0.1 no tiene `UNSAFE_getAllByType` y los hosts de `Skeleton` no exponen `variant` ni `animation`. Opciones: (i) el MT cuenta nodos por `className` dentro de `map-loading` (diez `bg-lip-gray` más un `bg-default` `h-12.5`) y deja el literal `variant="pulse"` ×11 a CF; (ii) doble de `Skeleton` de `heroui-native` que registre props. Elegir una y escribirla.
Enmienda propuesta: `variant="pulse"` en D14, R10, la línea MT y la CF; `grep -cF 'variant="pulse"' $M` 0 → +11 en tasks.md; añadir a CF una mutación plantada `variant="shimmer"` si se quiere que el candado muerda.

### M2 — Prosa de tonos de R2 contra producción (alta)

R2 (requirements.md L253-257) dice: «sin señal → `bg-warning-strong` / `text-warning-strong`; desactualizado, sin collar, detalle pendiente y detalle con error → `bg-muted` / `text-muted`».
Producción (verificado): `MAP_CONNECTION_TONE` (`src/screens/map/index.tsx` L90-96) = `{ none: 'muted', unknown: 'muted', offline: 'warning', online: 'success' }`; `MAP_CONNECTION_LABEL_KEY` (`src/utils/device-connectivity.ts` L14-24): `none` y `unknown` → `map.noSignal` («Sin señal»), `offline` → `map.stale` («Desactualizado»), `online` → `map.live`; `STATUS_TONE_CLASSES` (`src/components/pet-hero-header.tsx` L50-66): warning `dot: 'bg-warning-strong'`, `text: 'text-warning-strong'`; muted `bg-muted`/`text-muted`. El `it.each` actual de `#116 R4` fija `['offline', …, 'Desactualizado', 'bg-warning-strong', 'text-warning-strong']` y `['unknown', …, 'Sin señal', 'bg-muted', 'text-muted']`.
La propia D17 (L81) dice «offline conserva el tono de aviso». O sea: la prosa de R2 invierte las dos etiquetas. Si el implementador sigue la prosa, las filas `offline` y `unknown` del `it.each` de `#116 R4` se ponen rojas con un cambio que la fila 10 no recoge («resto de filas igual»), es decir, rojo seguro fuera del inventario. Si sigue el inventario, contradice a R2.
Enmienda propuesta: reescribir la prosa como «en línea → `bg-accent` / `text-accent-strong` (D17); desactualizado → `bg-warning-strong` / `text-warning-strong`; sin señal, sin collar, detalle pendiente y detalle con error → `bg-muted` / `text-muted`», y dejar la fila 10 como está.

### M3 — MT no tiene doble de `reicon-react-native` (media)

R7 (`size={18} strokeWidth={2.2} color=…`), R9 (`Location`), R11 (`Refresh` y `AlertCircle`), R12 (`Plus`) y R13 (`Link`) hacen que los MT lean `size`, `strokeWidth` y `color` de iconos localizados por `testID`. `node_modules/reicon-react-native/createIcon.js` consume `color`, `size` y `strokeWidth` para construir el XML y renderiza `SvgXml`: esas props no llegan al host, así que `icon.props.strokeWidth` sería `undefined` y los `it` no pueden ponerse verdes sin un doble. MT no mockea `reicon-react-native`, ni `react-native-reanimated`, ni `use-theme-colors`, ni `heroui-native`, ni `react-native-svg` (solo `expo-router`, `expo-maps`, `react-native-safe-area-context` y `uniwind`).
Referencia que ya existe: `src/screens/home/index.test.tsx` L144-175 (`mockIcon(testID)` → `View {testID, ...props}`) y el de EH (L36-40, solo `Plus`). Hay que prescribirlo: `jest.mock('reicon-react-native', …)` con los seis nombres de R16 (`AlertCircle, AlertTriangle, Link, Location, Plus, Refresh`), `...actual`, `__esModule: true` y reenvío de todas las props a un `View`. Sin los seis, un icono ausente del doble da «Element type is invalid» en vez de un rojo legible.
Mutación que se pierde sin esto: cambiar `strokeWidth={2.8}` por `2.4` no se vería en ningún `it` (siempre `undefined`).

### M4 — Mecanismo de color en jest sin prescribir (media)

R7 afirma `color` `'#D80B34'`, R11 `'#D92D20'` y R9 «token `muted` claro leído de `global.css` en el propio test». En jest no hay variables CSS: `src/theme/use-theme-colors.ts` resuelve con `Uniwind.getCSSVariable('--color-' + token)` y cae a `'--' + token` y luego a foreground, y los tests acaban con `#0D1117` salvo que espíen `getCSSVariable` o mockeen el hook (precedente: memoria «Flake de tinte #0D1117 bajo carga»). La spec no dice cuál.
Valores en `src/theme/global.css`: `--color-category-rose-strong: #D80B34` (L116), `--color-danger: #D92D20` (L104), `--color-muted: #667085` (L85). La convención de la spec («colores esperados son los literales claros del canvas, nunca un valor importado») es correcta pero incompleta.
Enmienda propuesta: prescribir en MT un `jest.mock('../../theme/use-theme-colors')` con un mapa token → literal claro (`category-rose-strong` `#D80B34`, `danger` `#D92D20`, `muted` `#667085`, `accent-foreground` el de `global.css`), y para R9 sustituir «leído de `global.css`» por el literal `#667085` (el valor lo candan ya los tests de `global-css`). Si de verdad se quiere el parseo, nombrar la función.

### M5 — R14 ya lo entregó #198 R18 (media)

`src/components/empty-state.tsx` ya tiene `badge`, `actionIcon`, `body?` y `tone`. EH (`src/components/__tests__/empty-state-hero.test.tsx`) ya contiene `#198 R18: API compartida del escenario` con seis `it` equivalentes a los seis `ES #201 R14` (badge último hijo, sin badge, `actionIcon` sustituye al «+», conserva el «+» con `size` 20 y `strokeWidth` `undefined`, sin `body` en hero, sin `body` en por defecto).
Medida de la «Base medida» (requirements.md L113-118): `grep -cF 'badge' empty-state.tsx` = 3 (la spec dice 0), `'actionIcon'` = 3 (dice 0), `'body: string'` = 0 (dice 1 → 0), `'body?: string'` = 1, `'<Plus size={20}'` = 1 (ok).
Consecuencias: (1) los seis `it` de R14 nacen verdes y no hay rojo que mostrar (C4); (2) la nota «R14 amplía `EmptyState`» y las filas de tasks.md `body: string` 1 → 0 y `body?: string` 0 → 1 son falsas; (3) hay que decidir qué hace R14 en el repo: con #198 R18 ya cubierto, o se borra R14 y se re-apunta traceability R14 (`ES #201 R14 ×6`) a `EH #198 R18`, o se deja como requisito de «no regresión» sin tests nuevos. D8 y los R11-R13 siguen válidos (consumen la API ya existente).
Enmienda propuesta: eliminar los seis `it`, la fila de ES y los grep de R14; reescribir R11-R13 citando «API de `EmptyState` entregada por #198 R18».

### M6 — Guarda de la guarda ciega a hex en mayúsculas (media)

DD define `HEX_LITERAL = String.raw\`#(?!\d{2,3} R\d)[\da-f]{3,8}\b\`` (L145) y lo usa siempre dentro de `new RegExp(…, 'i')` (L148-149, `FEATURE_STYLE_ESCAPES`, `PAIRING_STYLE_ESCAPES`). Es una cadena, no una regex. R16 pide copiarla «literalmente»; si CF construye `new RegExp(HEX_LITERAL)` sin `'i'`, `[\da-f]` no ve `#D80B34` ni `#D92D20`. La mutación plantada de R16 es `'#107148'` (solo dígitos): pasa con o sin el flag, así que la guarda de la guarda no detecta el defecto.
Mutación perdida: plantar `'#D80B34'` (el color real de R7) en `src/screens/map/index.tsx`: ni la guarda ni su guarda lo cazan.
Medida: las tres guardas dan hoy 0 en los tres ficheros (ver A8), así que la guarda nace verde, como debe; lo que falla es que no muerde.
Enmienda propuesta: R16 prescribe `new RegExp(HEX_LITERAL, 'i')` y añade `'#D80B34'` a las mutaciones plantadas.

### M7 — R13: `style.boxShadow` del badge de `PopIn` (media)

R13 (L523-526): `map-no-tracking-badge` con `className` exacta y «`style.boxShadow` no vacío». `src/components/pop-in.tsx` renderiza `<Animated.View … style={[style, animatedStyle]}>`: el host tiene `props.style` como array, así que `props.style.boxShadow` es `undefined`. Los tests de PopIn y de EH usan `getAnimatedStyle(…)` (`pop-in.test.tsx` L45-50) o `StyleSheet.flatten(…)` (EH L76). Falta prescribirlo.
Además «no vacío» no muerde: `useChunkyLip().primary` es `{ boxShadow: [{ offsetX: 0, blurRadius: 0, spreadDistance: 0, offsetY: 4, color: lip }] }` (`src/theme/chunky-lip.ts`); `chunkyLip.neutral` (offsetY 4, `lip-gray`) o `shadows.card` también serían «no vacíos». Mutación perdida: `style={chunkyLip.neutral}` en el badge.
Enmienda propuesta: `StyleSheet.flatten(badge.props.style).boxShadow` con longitud 1 y `toMatchObject([{ offsetY: 4, blurRadius: 0 }])` más el `color` del token `lip` claro (que sale del mock de M4).

### M8 — Fila 26 apunta a un candado que no existe (baja)

Fila 26 (requirements.md L671): `FN › #197 R20: nadie monta todavía los cimientos`, `shadows` `[]` → `['screens/map/index.tsx']`. `grep -cF '#197 R20' src/__tests__/canvas-foundations.test.ts` = 0, y no hay `importers`/`consumers`/`nadie` en FN (grep vacío). El lock lo retiraron #198 R1 y #200 R10. Ya figura en design.md «Archivos afectados» y en traceability R2 (`filas 6–11, 26`, L12). Quitar la fila, el Archivo afectado de FN, y dejar `filas 6–11` en traceability R2; el recuento del inventario pasa de 26 a 25 (más las filas nuevas de F1-F3: 28 con F1, F3, y F2(b) si se elige).
Nota sobre la tarea: el recuento total se mueve con las filas nuevas; fijarlo en cuanto el leader decida F2.

### M9 — design.md y tasks.md describen el mundo pre-#198 (baja)

`design.md`: «Premisas» (dice que `body` es obligatorio y que #197 no está en dev), «Riesgos» (predice una colisión con #198 en `empty-state.tsx`, resuelta con M5) y «Archivos afectados» (lista FN, ver M8). `tasks.md`: filas de R14 `body: string` 1 → 0 y `body?: string` 0 → 1 (L28-30 de la tabla de cuentas) y la nota «#197 precondición». Hay que reescribirlos tras decidir M5. `requirements.md` L131-134 también mezcla «verdadero en la base» con «precondición: existe (#197)» para dos `test ! -e`: #197 está en dev, así que son dos ficheros que existen y la línea 131 debe decir `test -e`.

### M10 — R15: `toEqual` tolera `width: undefined` (baja)

`src/components/pet-map.tsx` L38-41 construye `polylines.map(p => ({ ...p, color: polylineColor }))`. El `it` existente `R3` de PM (L137-139) usa `toEqual` con `expect.any(String)`; `toEqual` trata `{ width: undefined }` como `{}`. R15 dice «las polilíneas no llevan la clave `width`» pero el `it` `#201 R15: sin polylineWidth las polilíneas no llevan ancho` solo nombra el título. Mutación perdida: `width: polylineWidth` siempre (queda `undefined` cuando no se pasa) pasa un `toEqual`.
Enmienda propuesta: fijar `expect(polyline).not.toHaveProperty('width')` (falla si la clave existe aunque valga `undefined`) y `Object.keys(polyline)` sin `width`. `expo-maps` declara `width?: number` en la polilínea (verificado, A10).

### M11 — Doble de Reanimated a nivel de módulo en MT (baja)

R1 usa «mismo mecanismo que el test de `HomeEntrance`». `src/screens/home/home-entrance.test.tsx` L1-30 mockea `react-native-reanimated` con `...jest.requireActual(…)`, `__esModule: true` y `useReducedMotion`. MT hoy no mockea Reanimated. Hay que prescribir ese `jest.mock` a nivel de módulo en MT, con `__esModule: true` (si no, el spread pierde la bandera y el import por defecto de `Animated` falla; memoria «Doble de Reanimated sin __esModule») y `useReducedMotion` conmutable por `it`. R11 y R13 (`PopIn` real, con `useAnimatedStyle`) dependen del mismo setup. Mutación que sí muerde con el mock: `entering` incondicional. Sin el mock, el `it` «con movimiento reducido» no tiene cómo forzar `true`.
La fila 15 (`#116 R8: el mapa no estrena animación`, título nuevo `el punto del GPS no anima`) es coherente con esto.

### M12 — `grep -cF` cuenta líneas, no ocurrencias (baja)

requirements.md L137-139 dice que los literales de canvas «se comprobaron con `grep -cF` contra `specs/mobile-canvas-map/canvas/*.dc.html`». En `MapaCarga.dc.html`, `grep -cF 'animation: pulse 1.4s ease-in-out infinite'` = 3 (tres líneas con varias ocurrencias) mientras que `grep -oF … | wc -l` = 11, y `background: var(--lip-gray)` = 10, `width: 72px; height: 22px` = 4, `aria-busy="true"` = 1: los números de la spec son ocurrencias y son correctos. Quien re-mida con `grep -cF` obtiene otras cifras. Cambiar la frase por `grep -oF … | wc -l` (o fijar el contador de CF como `split(literal).length - 1`) y decir qué hace CF.

### M13 — CC `#177 R7.4` pide una sentencia literal (baja)

CC L186-187: `expect(Object.keys(inventory(/useChunkyLip/g)).sort()).toEqual([...consumers, 'theme/chunky-lip.ts'].sort())` y, para cada consumidor, `(source.match(/const chunkyLip = useChunkyLip\(\);/g) ?? []).length` = 1. La fila 23 añade el mapa a `consumers`; R13 solo dice «`chunkyLip` de `useChunkyLip()`». Prescribir la sentencia exacta `const chunkyLip = useChunkyLip();`. El título del `it` dice «solo la definición y los diecisiete consumidores…»: pasa a «dieciocho» y gana el sufijo `(enmendado por #201 R13)`.
`#177 R8.1`, `R8.4` y `R6.2` no se mueven (A6): el mapa no pone `style={chunkyLip.*}` en un `<Button>` (el badge es un `PopIn`), `lost-mode-button` sigue siendo `<Button>` sin lip y con un solo `<Button.Label`.

### M14 — Título de ES `#159 R9` queda falso (baja)

Fila 20: se borran las cuatro filas del mapa (`react-native-reanimated`, `\bAnimated\b`, `entering=`, `MOTION_`) y se queda `LayoutAnimation`. El `it` se llama `los estados sin collar no traen movimiento ni dependencias`; tras R13 el estado sin collar monta `PopIn` (movimiento). La fila 20 añade el sufijo pero no cambia el título; conviene dar «Título nuevo» (p. ej. `…no traen LayoutAnimation`), porque la regla de la spec dice «donde el título nombra el valor viejo, la columna «Título nuevo» da el título completo».

## Observaciones y suposiciones verificadas (A)

- A1. Base de MT: `map-retry` 2, `map-last-retry` 5, `pingo-collar` 1, `'flex-1 items-center justify-center p-6 bg-background'` 2, `'items-center gap-3 py-8'` 1, `'mt-1 text-2xs font-normal text-muted'` 1 y `#201` 0 (comprobadas en la pasada previa con `grep -cF`). `style={TABULAR_NUMS}` ×4 (el `grep -c TABULAR_NUMS` da 5 con el import de L37) y `style={CONTINUOUS_CORNER}` ×4 no cambian: R5 los conserva «escritos en línea como hoy». CO `#62 R14` (`[map, 4]`) y `#62 R15` (`[map, 3 + 1]`) siguen verdes.
- A2. Canvas, por ocurrencias en `MapaCarga.dc.html`: 11 / 10 / 4 / 1 (ver M12). Los demás literales citados se midieron en la pasada previa.
- A3. LG fila 25: `[join('screens', 'map', 'index.tsx'), 2]` en L163 y la cadena de «trece ocurrencias» termina en `+ 1, // #198 R4`; `2 - 1 // #201 R5` es correcto porque `text-accent-strong` en el mapa vive en `stat-speed` y `stat-distance` (L394 y L410) y R5 pasa la distancia a `text-foreground`. El texto de estado de la píldora llega por `STATUS_TONE_CLASSES` (constante, no literal del mapa), así que R2 no mueve el recuento. `requestsAccent` (LG L200) no se dispara: la lista de R-convenciones `useThemeColors(['accent-foreground', 'category-rose-strong', 'danger', 'muted'])` no contiene `'accent'` entre comillas.
- A4. ES `%s pinta %i EmptyState`: mapa 2 → 2 + 2 (fila 19). ES `#155 R10` (L177-193, regex de `map-empty`/`map-empty-overlay`) y `ningún otro fichero usa EmptyState` (L210-226) siguen verdes; R9 conserva ambos `testID`. ES `#159 R9` (L367-381): las cuatro filas del mapa se borran y `LayoutAnimation` se queda.
- A5. `ui-copy-table.ts` / `ui-language`: `R4_MAP` lista `common.somethingWentWrong` (L135 y L143) y `common.retry` (L136 y la fila siguiente); el mapa los usa hoy ×2 y ×2 (`index.tsx` L260, L266, L304, L310). R11 conserva un título y una etiqueta por rama: no se mueve `ALL_USES` ni `SCREEN_FILES`. Claves en `src/i18n/catalog.ts`: `common.somethingWentWrong` (L467), `common.retry` (L511), `map.*` presentes. La spec acierta con «copy: nada».
- A6. DD `'map' importa el Card compartido` (L227-241) sigue verde: el mapa conserva `Card` en el aviso de R9. CC `#177 R8.4` (L215-221): `lost-mode-button` sigue existiendo como `<Button>` sin `chunkyLip`; los `-retry` desaparecen pero la aserción solo exige los cuatro `excluded`. CC `#177 R6.2`: el mapa conserva un solo `<Button.Label` (L467) y ningún `text-17`.
- A7. DD L587 (`'screens/map/index.tsx': 0` en `signOut(`) y L690 (`staleSeconds` ×1) no se mueven si R2 no toca la lectura de frescura. Cualquier refactor de la píldora debe conservar exactamente una lectura de `staleSeconds`.
- A8. Guardas de R16 contra los tres ficheros hoy (regex de DD L145-146, `/\p{Extended_Pictographic}/u`, etc., ejecutadas con `node -e` sin la suite): `HEX_LITERAL` 0, `ARBITRARY_CLASS` 0, `StyleSheet.create` 0, emoji 0, `expo-linear-gradient`/`expo-blur` 0, `text-accent` sin sufijo 0 en `index.tsx`, `empty-state.tsx` y `pet-map.tsx`; `rounded-(2xl|xl|lg|md|sm)` 0 en `empty-state.tsx` y `pet-map.tsx` y 5 en el mapa (`rounded-xl` ×5: cuatro tiles y el botón; R5 y R7 lo dejan en 0). Cualquier comentario con `#151`, `#155`, etc. sin `R<n>` casaría con `HEX_LITERAL` (`#(?!\d{2,3} R\d)[\da-f]{3,8}\b`): la regla de la spec «todo comentario nuevo cita `#201 R<n>`» es necesaria y suficiente.
- A9. Tokens y clases nuevas existen: radios en `global.css` L16-24; `lip-gray`, `glass-surface-strong`, `category-rose`, `category-rose-strong`, `accent-foreground`, `tab-pill`, `text-11`, `text-15` y `text-2xs` están definidos; `variant="danger-soft"` existe en el `Button` de HeroUI (`button.styles.ts` L34, L66) y se usa ya en Perfil; `PopIn` (`src/components/pop-in.tsx`), `homeEntering` (`src/screens/home/home-entrance.tsx` L15) y `MOTION_RISE_OFFSET_Y = 14` (`src/theme/motion.ts` L87) existen. Ningún test hace inventario de `h-12.5`, `rounded-24` (más allá de DD L1258-1262, que lee solo Historial), `bg-glass-surface-strong`, `size-14`, `pt-15`, `pb-30` ni `bg-lip-gray` sobre producción. `rounded-4` no aparece en ningún test.
- A10. Dependencias y costes: ninguno. R15 usa `width` de la polilínea de `expo-maps` (`width?: number`); R10 y R13 usan `heroui-native`, `react-native-svg` y `reicon-react-native` ya instalados; la spec no añade paquetes. `D14` no obliga a `expo-linear-gradient` (vetado).
- A11. Carta: la spec no enmienda `docs/ui-guidelines.md` (requirements.md L745) y no hace falta: `rounded-14` y `rounded-24` ya figuran en la regla 12 (DD L48, L89-90), `rounded-4` y los tamaños `text-11`/`text-15` ya los lee la carta (DD L127-129), y no hay candado de carta que se pueda poner rojo por tamaños de icono. Precedente: #189 y #200 también añadieron clases dentro de la escala sin enmienda.
- A12. R3 es regresión pura («Cero cambio de producción»): sus tres `it` nacen verdes por diseño; la spec lo declara y el tercero («la sonda distingue las dos caras») evita la tautología del segundo. Con M5, los de R14 serían el único caso de «nace verde» sin declarar.

## Anclas

No hay anclas por número de línea en la spec (`grep` de `L\d+`, `línea N` y `:NNN` sobre los cuatro ficheros: sin coincidencias). Las anclas de la «Base medida» son `grep -cF` sobre contenido; las citas a MT son por título de `describe`/`it`. Las cuentas de `Base medida` que ya no son ciertas por el merge con dev: `badge` (L115), `actionIcon` (L116), `body: string` (L117), y el comentario «precondición» de L131-134 (ver M5 y M9). La spec cita el título `R4: map resuelve la mascota seleccionada › R8 (mobile-design-drift): reserva el mapa completo con Skeleton` (L447-448): sigue verde porque solo mira `flex-1`; hay que mantener `flex-1` en `className` de `map-loading` (R10 lo tiene: `flex-1 bg-default`).
Referencias de este informe a líneas (DD L1118/L1155, CC L186-187, AF L202-247, CO L428) son para localizar; al implementar hay que anclar por contenido (memoria «Lo que se desplaza no es ancla»).

## Enmiendas propuestas

Para el leader, en orden de prioridad:

1. F1, F2, F3: añadir al inventario las tres filas (DD `rounded-14`/`rounded16`; CO `#64 R9` o, preferido, pasar R7/R11 por `CATEGORY_SLOTS.rose`; AF `text-15`) y sus sufijos `(enmendado por #201 R<n>)`.
2. M1: cambiar `animation="pulse"` por `variant="pulse"` en D14, R10, CF y tasks.md; decidir el mecanismo del MT para contar los once bloques.
3. M2: reescribir la prosa de tonos de R2.
4. M5: retirar R14 como trabajo (lo cubre #198 R18) y re-apuntar traceability R14.
5. M3, M4, M11: prescribir en MT los tres dobles (iconos con los seis nombres, `use-theme-colors` con mapa de literales, Reanimated con `__esModule: true`).
6. M6, M7, M10: endurecer los candados nuevos (flag `i` y mutación `#D80B34`; `StyleSheet.flatten` y sombra exacta del badge; `not.toHaveProperty('width')`).
7. M8, M9, M12, M13, M14: higiene (quitar fila 26, refrescar design.md y tasks.md, corregir la frase de `grep -cF`, prescribir la sentencia de `useChunkyLip`, dar título nuevo a ES `#159 R9`).

Efecto en cuentas agregadas si se aplican las enmiendas: inventario 26 → 25 (fila 26 fuera) + 2 o 3 nuevas (F1, F3 y, solo si se elige (b), F2) = 27 o 28; tasks.md «Cuentas a re-medir»: `grep -cF 'animation="pulse"' $M` → `grep -cF 'variant="pulse"' $M` 0 → +11; las filas de R14 se eliminan; AF `text-15` 16 → 17 rutas; DD `rounded-14` 5 → 6 rutas y `rounded16` +1 entrada (`'screens/map/index.tsx': 1`); CC `consumers` +1 (el título pasa de «diecisiete» a «dieciocho»).

## Alcance auditado y límites

Auditado: los cuatro ficheros de la spec (R1-R16 completos, las 26 filas del inventario, D1-D21, «Fuera de alcance», «Cierre del humano», traceability con sus 16 filas R1-R16, todas `pendiente`); los siete artboards solo por los literales de `MapaCarga` (11/10/4/1) y, en pasadas previas, por los literales citados; `src/screens/map/index.tsx` y `index.test.tsx` (describes, helpers y mocks); `empty-state.tsx` y sus dos suites; `pet-map.tsx` y PM; `pop-in.tsx`; `home-entrance.tsx` y su test; `chunky-lip.ts`; los tests agregados LG, CO, DD, CC, AF, FN, `ui-copy-table`/`ui-language` y los inventarios de `src/__tests__/*.ts` y `src/components/__tests__/*.tsx` que filtran ficheros de producción por clase (`filesContaining`/`filesMatching`/`inventory`/`outsideReminders`).
No verificado: (1) el contenido del mock de `uniwind` de MT (si expone `getCSSVariable`), que condiciona M4; (2) el comportamiento runtime de `Button variant="danger-soft"` con `className="… bg-category-rose"` (twMerge de HeroUI frente a la variante), que la spec cubre con el smoke S4; (3) los `it` de modo perdido y de error de última posición de MT (L807-1130) más allá de los títulos y de las filas 1-5; (4) el comportamiento de `PopIn` en MT con temporizadores falsos (los `act` pendientes no son rojos, pero conviene comprobarlo en el commit rojo de R11); (5) que la medición `grep -cF` de cada literal de canvas de R2-R13 coincida con las cifras de la spec (se comprobaron por ocurrencias solo los de `MapaCarga`); (6) catálogo `map.*` completo (se comprobaron las claves que usa el mapa hoy, no las que pudiera pedir un copy nuevo, que la spec descarta).
No se ejecutó ninguna suite: las dos aserciones de F1, la de F2 y la de F3 se derivan de leer el código del test y medir los ficheros, no de verlas fallar.
