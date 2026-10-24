---
feature: "mobile-canvas-tab-bar"
status: approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-canvas-tab-bar]]

Feature #206 (plan de paridad con el canvas, ola 2, C16). La barra de pestañas
flotante `mobile-pet-tracker/src/components/floating-tab-bar.tsx` pasa a la
geometría, el velo, la sombra, los iconos y la semántica del `<nav
aria-label="Pestañas">` de los artboards `Inicio`, `Mapa`, `Salud`,
`Nutricion` y `Perfil` (copias congeladas en
`specs/mobile-canvas-tab-bar/canvas/`). El contraste pieza a pieza está en
`design.md` § Contraste con el artboard.

Rige `docs/ui-guidelines.md`. Skills de Claude: `expo:expo-overview`,
`expo:expo-native-ui` y `expo:expo-animation`. El handoff a Codex nombra sus
equivalentes según `.claude/agents/leader.md` § Catálogo real de skills de
Codex.

Rutas de test relativas a `mobile-pet-tracker/`. Todo `it` nuevo empieza por
`#206 R<n>`. Dos ficheros de test:

- **BAR** = `src/components/__tests__/floating-tab-bar.test.tsx` (existe).
- **CF** = `src/__tests__/tab-bar-canvas-fidelity.test.ts` (nuevo). Lee cada
  artboard con
  `readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-tab-bar/canvas/<Artboard>.dc.html'), 'utf8')`
  y la fuente con
  `readFileSync(join(process.cwd(), 'src/components/floating-tab-bar.tsx'), 'utf8')`.
  Cada fila afirma **las dos cosas**: que el literal está en el canvas y que el
  valor está en producción. Ningún esperado se importa de producción.

Geometría de prueba en BAR: `onLayout` de la raíz con `width: 360` da celda
`(360 - 30) / 5 = 66`, paso `66 + 4 = 70` y `translateX` 0 / 70 / 140 / 210 /
280 para `home` / `map` / `health` / `food` / `profile`.

## Decisiones con defecto

Todas cerradas por escrito. Si el firmante elige la alternativa, la spec se
enmienda antes del handoff.

| Id | Decisión | Defecto | Alternativa |
|---|---|---|---|
| D1 | Iconos de la barra | Trazados literales del canvas con `react-native-svg` (ya instalado) y **Enmienda #206** a la carta como excepción nombrada a D-I (R6, R7, R9) | reicon con `weight="Outline"` y `strokeWidth` 2,4 / 2: sin enmienda, pero el trazo solo cambia en `Map` y `Profile` y ninguna silueta es la del canvas; R9 desaparece y R6/R7 se reescriben |
| D2 | Distancia al borde inferior | Se conserva `bottom: insets.bottom + 12` (el canvas dibuja `bottom: 28px` sin inset del sistema) | `bottom: 28` fijo: rompe el `it` de safe area y la banda reservada por las pantallas |
| D3 | Nombre accesible de la fila | Clave nueva `tabs.bar`: `Pestañas` (es, literal del `aria-label` del canvas) y `Tabs` (en) | sin nombre: la fila queda `tablist` anónima |
| D4 | Desenfoque | Se conservan `BlurView intensity={80}` con `blurMethod="dimezisBlurViewSdk31Plus"` y la rama `GlassView` sin overlay; solo el overlay del fallback sube a .86 | quitar el blur («Vidrio plano»): cambio de material fuera del alcance de C16 |
| D5 | Muelle de la píldora | `TAB_INDICATOR_SPRING` se queda en `floating-tab-bar.tsx` con sus valores; la migración a `motion.ts` es de otra feature (`#153 E1`) | moverlo aquí: choca con #199 y #200, que ya suman exportaciones a `motion.ts` |
| D6 | Dobles del test BAR | Sale `jest.mock('reicon-react-native', …)`; entra `jest.mock('react-native-svg', …)` con `default`, `Svg`, `Path` y `Circle` como `View`, y `__esModule: true` | — |
| D7 | Alto de la píldora | `height: 52` explícito con `top: 6` (sale `bottom: 6`) | `top: 6, bottom: 6`: da 50 en Yoga porque el borde de 1 está dentro del alto |
| D8 | testID de la fila | Nuevo `tab-bar-row` (ningún selector por regex lo atrapa) | — |

## Base medida

Medido en 81cb6d6b desde `mobile-pet-tracker/`, con `F=src/components/floating-tab-bar.tsx`
y `T=src/components/__tests__/floating-tab-bar.test.tsx`. Sin números de línea:
cada ancla es un `grep -cF` (o `test ! -e`) con su cifra. «Después» es lo que
debe dar al terminar.

| Ancla | Antes | Después | R |
|---|---|---|---|
| `grep -cF "from 'reicon-react-native'" $F` | 1 | 0 | R6 |
| `grep -cF "from 'react-native-svg'" $F` | 0 | 1 | R6 |
| `grep -cF "shadow-lg" $F` | 1 | 0 | R3 |
| `grep -cF "useShadows" $F` | 0 | 2 (import y llamada) | R3 |
| `grep -cF "px-2 py-3" $F` | 1 | 0 | R1 |
| `grep -cF '"flex-1 bg-glass-surface"' $F` | 1 | 0 | R2 |
| `grep -cF '"flex-1 bg-glass-surface-strong"' $F` | 0 | 1 | R2 |
| `grep -cF "left: 8" $F` | 1 | 0 | R5 |
| `grep -cF "(containerWidth - 16)" $F` | 1 | 0 | R5 |
| `grep -cF "(containerWidth - 30)" $F` | 0 | 1 | R5 |
| `grep -cF "{ name: '" $F` | 5 | 5 | R6 (forma de `TABS`) |
| `grep -cF "weight={" $F` | 1 | 0 | R7 |
| `grep -cF 'accessibilityRole="tablist"' $F` | 0 | 1 | R8 |
| `grep -cF "t('tabs.bar')" $F` | 0 | 1 | R8 |
| `grep -cF "text-accent-strong" $F` | 1 | 1 | R10 (legibility `#61 R4`) |
| `grep -cF "TAB_INDICATOR_SPRING" $F` | 2 | 2 | D5 |
| `grep -cF "StyleSheet" $F` | 0 | 0 | R10 |
| `grep -cF "#" $F` | 0 | 0 | R10 |
| `grep -cF "'tabs.bar'" src/i18n/catalog.ts` | 0 | 2 | R8 |
| `grep -cF "key: 'tabs.bar'" src/__tests__/ui-copy-table.ts` | 0 | 1 | R8 |
| `grep -cF "68.8" $T` | 4 | 0 | R5 |
| `grep -cF "137.6" $T` | 5 | 0 | R5 |
| `grep -cF "jest.mock('reicon-react-native'" $T` | 1 | 0 | D6 |
| `grep -cF "jest.mock('react-native-svg'" $T` | 0 | 1 | D6 |
| `grep -cF "'Outline'" $T` | 1 | 0 | R7 |
| `grep -cF "describe('" $T` | 12 | 12 + los `describe` nuevos que añada el implementador | — |
| `test ! -e src/__tests__/tab-bar-canvas-fidelity.test.ts` | verdadero | falso | R1 |
| `grep -cF "describe('#197 R20: cimientos sin cablear'" src/__tests__/canvas-foundations.test.ts` | 1 | 0 | R3 |
| `grep -c '^## Enmienda' ../docs/ui-guidelines.md` | 24 | 25 | R9 (#198 a #205: cada enmienda paralela que se mergee antes suma 1 a ambas cifras) |
| `grep -cF '#206' ../docs/ui-guidelines.md` | 0 | 3 (encabezado, fecha y casilla) | R9 |
| `grep -cF "+ 7, // #194 R1 (+2); #189 R15 (+5)" src/providers/__tests__/language-provider.test.tsx` | 1 | 0 (pierde la coma) | R8 |
| `grep -cF "expect(R2_TABS).toHaveLength(5);" src/__tests__/ui-language.test.ts` | 1 | 0 (pasa a `5 + 1`) | R8 |

## TestIDs

| testID | Nodo | Estado |
|---|---|---|
| `floating-tab-bar` | raíz | se conserva |
| `tab-bar-glass` / `tab-bar-blur` / `tab-bar-overlay` | backdrop | se conservan |
| `tab-indicator` | píldora | se conserva |
| `tab-<name>` (`home`, `map`, `health`, `food`, `profile`) | `Pressable` de cada pestaña | se conservan |
| `icon-tab-<name>` | hoy lo pone el doble de reicon en el test; pasa a ser el `testID` real del `<Svg>` de producción | se conserva el nombre, cambia el dueño |
| `tab-bar-row` | fila `flex-row` de las cinco pestañas | **nuevo** (D8) |

Contraste con selectores por regex (`grep -rnE "TestId\(/" src` en 81cb6d6b):
ninguno de `^pet-chip-`, `^meal-row-`, `^plan-warning-`, `^meal-pending-`,
`^meal-served-`, `-message-row$`, `^doc-`, `-link$`, `-link-tile$`, `^stat-`,
`-(?:error|retry)$`, `^quick-action-`, `^reminders-item-`, `^home-entrance-`,
`^weekly-activity-day-`, `^summary-…`, `^type-chip-`, `^advance-chip-`,
`^vaccine-row-`, `^meals-history-day-`, `-delete$`, `^reminder-row-` ni los
alternados de login, register, reset, pairing, weight y edit-profile casa con
`tab-bar-row` ni con `icon-tab-<name>`. Además, todas las pantallas cuyo test
usa esos selectores mockean o no montan `FloatingTabBar`.

## Requisitos funcionales

### Barra

**R1. Cápsula de 64 y fila con relleno de 6 y hueco de 4.**
WHEN la barra se renderiza THE SYSTEM SHALL incluir la clase `h-16` en la
raíz `floating-tab-bar` y dar a la fila `tab-bar-row` exactamente la clase
`flex-row gap-1 p-1.5` (sale `items-center justify-around px-2 py-3`).

- BAR › `it('#206 R1: la cápsula mide 64 y la fila lleva el relleno de 6 y el hueco de 4 del canvas')`:
  `root.props.className.split(' ')` contiene `h-16`;
  `expect(screen.getByTestId('tab-bar-row')).toHaveProp('className', 'flex-row gap-1 p-1.5')`.
- CF › `it('#206 R1: la cápsula y la fila copian alto, relleno y hueco del canvas')`:
  tabla `{ canvas, production }` con `height: 64px` ↔ `h-16`, `padding: 6px` ↔
  `p-1.5`, `gap: 4px` ↔ `gap-1`; cada `canvas` está en el `style` del `<nav
  aria-label="Pestañas"` de los cinco artboards y la fuente contiene
  `className="flex-row gap-1 p-1.5"` y la palabra `h-16`.

**R2. Velo .86 del canvas.**
WHILE liquid glass no está disponible THE SYSTEM SHALL pintar sobre el
`BlurView` el overlay `tab-bar-overlay` con la clase exacta
`flex-1 bg-glass-surface-strong`.

- BAR › `it('#206 R2: el velo del fallback es el glass .86 del canvas')`:
  `expect(screen.getByTestId('tab-bar-overlay')).toHaveProp('className', 'flex-1 bg-glass-surface-strong')`
  (igualdad exacta: el `stringContaining('bg-glass-surface')` actual de `R2`
  también casa con la clase vieja).
- CF › `it('#206 R2: el velo copia var(--glass) a .86 en claro y en oscuro')`:
  los artboards contienen `--glass:rgba(255,255,255,0.86)`,
  `--glass:rgba(22,27,34,0.86)` y `background: var(--glass)`;
  `src/theme/global.css` contiene `--glass-surface-strong: rgba(255,255,255,0.86);`
  y `--glass-surface-strong: rgba(22,27,34,0.86);`; la fuente contiene
  `"flex-1 bg-glass-surface-strong"` y no contiene `"flex-1 bg-glass-surface"`.

**R3. Sombra `tabBar` en vez de `shadow-lg`.**
WHEN la barra se renderiza THE SYSTEM SHALL dar a la raíz la clase exacta
`absolute h-16 overflow-hidden rounded-full border border-border` y un `style`
con el `boxShadow` de `useShadows().tabBar` junto a
`bottom: insets.bottom + 12, left: 16, right: 16`.

- BAR › `it('#206 R3: la sombra es la tabBar del canvas y no la clase shadow-lg')`:
  `toHaveProp('className', 'absolute h-16 overflow-hidden rounded-full border border-border')`
  y `toHaveStyle({ boxShadow: [{ offsetX: 0, offsetY: 10, blurRadius: 30, spreadDistance: 0, color: 'shadow-12' }], bottom: 46, left: 16, right: 16 })`
  (literal, no `useShadows()` llamado desde el test).
- CF › `it('#206 R3: la sombra copia 0 10px 30px rgba(13,17,23,0.12)')`: los
  artboards contienen `box-shadow: 0 10px 30px rgba(13,17,23,0.12)`;
  `src/theme/shadows.ts` contiene `tabBar: { boxShadow: [layer(10, 30, 0, twelve)] }`;
  `src/theme/global.css` contiene `--color-shadow-12: rgba(13,17,23,0.12);`; la
  fuente contiene `useShadows()` y `shadows.tabBar` y no contiene `shadow-lg`,
  `shadowColor` ni `elevation`.
- El commit rojo de R3 borra entero `describe('#197 R20: cimientos sin cablear')`
  (ver § Candados que esta feature revierte).

### Celdas y píldora

**R4. Celda de 52 centrada con hueco de 2.**
THE SYSTEM SHALL dar a cada `tab-<name>` (las cinco) la clase exacta
`h-13 flex-1 items-center justify-center gap-0.5`.

- BAR › `it('#206 R4: cada celda mide 52 y centra icono y etiqueta con hueco de 2')`:
  bucle sobre `home`, `map`, `health`, `food`, `profile`, cada uno con
  `toHaveProp('className', 'h-13 flex-1 items-center justify-center gap-0.5')`.
- CF › `it('#206 R4: la celda copia flex 1, alto 52, columna centrada y hueco 2')`:
  cada `<a` del nav de `Inicio` contiene `flex: 1; height: 52px`,
  `flex-direction: column; align-items: center; justify-content: center; gap: 2px`;
  la fuente contiene `"h-13 flex-1 items-center justify-center gap-0.5"`.

**R5. Píldora del alto y el paso de la celda.**
WHEN la raíz recibe su layout con ancho `W` y la ruta activa ocupa el índice
`i` de `TABS` THE SYSTEM SHALL montar `tab-indicator` con
`{ position: 'absolute', width: (W - 30) / 5, left: 6, top: 6, height: 52, borderRadius: 999, backgroundColor: <tab-pill> }`,
sin `bottom`, y llevar su `translateX` a `i · ((W - 30) / 5 + 4)`, con el
muelle y los saltos sin muelle de hoy.

- BAR › `it('#206 R5: la píldora ocupa la celda activa de 52 con el paso de 70')`:
  layout `width: 360`, `renderTabBar(2)`; `toHaveStyle({ width: 66, left: 6, top: 6, height: 52, borderRadius: 999, backgroundColor: 'tab-pill' })`,
  el estilo aplanado (`StyleSheet.flatten`) no tiene la clave `bottom`, y tras
  el muelle `translateX` = 140.
- CF › `it('#206 R5: la píldora copia alto 52, radio 999 y var(--pill)')`: el
  `<a aria-current` de `Inicio` contiene `height: 52px` y `background: var(--pill)`
  y `border-radius: 999px`; los artboards contienen `--pill:rgba(23,130,85,0.14)`
  y `--pill:rgba(23,130,85,0.22)`; la fuente contiene
  `(containerWidth - 30) / TABS.length`, `activeTabIndex * (tabWidth + 4)`,
  `left: 6`, `top: 6`, `height: 52` y no contiene `left: 8` ni `bottom: 6`.
- Más las enmiendas `68.8 → 70` y `137.6 → 140` del inventario.

### Iconos

**R6. Trazados del canvas.**
THE SYSTEM SHALL dibujar el icono de cada pestaña como un `Svg` de
`react-native-svg` con `testID="icon-tab-<name>"`, `width={24}`, `height={24}`,
`viewBox="0 0 24 24"`, `fill="none"`, `strokeLinecap="round"` y
`strokeLinejoin="round"`, cuyos hijos son, en orden, los de la tabla
«Trazados del canvas» de `design.md` (`Path` con `d` literal; en `profile`,
`Circle` con `cx="12" cy="8" r="4"` y luego el `Path`), y
`floating-tab-bar.tsx` SHALL NOT importar `reicon-react-native`.

- BAR › `it.each(ICON_SHAPES)('#206 R6: el icono de %s es el trazado del canvas', …)`
  con `ICON_SHAPES` escrita a mano en el test (cinco filas `[name, shapes]`):
  el nodo `icon-tab-<name>` tiene los seis props de arriba, tantos hijos como
  formas, y `expect(elementChild(icon, k).props).toMatchObject(shape)` para
  cada `k`.
- CF › `it('#206 R6: los cinco iconos copian los trazados del canvas')`: cada
  `d="…"` de la tabla y `<circle cx="12" cy="8" r="4"` están en `Inicio`; la
  fuente contiene cada `d="…"`, `cx="12" cy="8" r="4"`, `viewBox="0 0 24 24"`,
  `strokeLinecap="round"` y `strokeLinejoin="round"`, y no contiene
  `reicon-react-native`.

**R7. Estado de la pestaña activa en cada artboard.**
WHEN la pestaña `<name>` es la ruta activa THE SYSTEM SHALL pintar su icono
con `stroke` `accent-strong` y `strokeWidth` 2.4 y su etiqueta con
`text-2xs font-semibold text-accent-strong`, y las otras cuatro con `stroke`
`muted`, `strokeWidth` 2 y `text-2xs font-semibold text-muted`. Cada artboard
es un caso: `Inicio` = `home`, `Mapa` = `map`, `Salud` = `health`,
`Nutricion` = `food`, `Perfil` = `profile`.

- BAR › `it.each(ARTBOARD_TABS)('#206 R7: en %s la pestaña activa traza 2.4 en accent-strong y las demás 2 en muted', …)`
  (cinco filas `[artboard, name, index]`): con `renderTabBar(index)`, el icono
  activo tiene `stroke: 'accent-strong'` y `strokeWidth: 2.4` y su etiqueta la
  clase activa; cada uno de los otros cuatro tiene `stroke: 'muted'`,
  `strokeWidth: 2` y la clase inactiva.
- CF › `it.each(['Inicio', 'Mapa', 'Salud', 'Nutricion', 'Perfil'])('#206 R7: el artboard %s marca su pestaña con aria-current y trazo 2.4', …)`:
  en el nav del artboard hay un solo `aria-current`, está en el `<a` de la
  etiqueta esperada (`Inicio`, `Mapa`, `Salud`, `Nutrición`, `Perfil`), hay
  exactamente un `stroke-width="2.4"` y cuatro `stroke-width="2"`; la fuente
  contiene `strokeWidth={active ? 2.4 : 2}`. Las cuentas se hacen dentro del
  `<nav aria-label="Pestañas"` … `</nav>` de cada artboard, no sobre el fichero
  entero (los artboards traen más `aria-current` y `stroke-width="2.4"` fuera
  del nav y `Perfil` trae un segundo `<nav`). Medido en los cinco: 1
  `aria-current`, 1 `stroke-width="2.4"`, 4 `stroke-width="2"`, 5 `<svg` y 5
  `<a`.
- La rama «ruta fuera de `TABS`» (las cinco inactivas) la cubre la enmienda de
  `#91 R5` del inventario.

### Accesibilidad y copy

**R8. La fila es una lista de pestañas con nombre.**
THE SYSTEM SHALL dar a `tab-bar-row` `accessibilityRole="tablist"` y
`accessibilityLabel={t('tabs.bar')}`, y cada `tab-<name>` SHALL conservar
`accessibilityRole="tab"` y `accessibilityState={{ selected }}`.

| Clave | es | en | Fila en `src/__tests__/ui-copy-table.ts` |
|---|---|---|---|
| `tabs.bar` | `Pestañas` | `Tabs` | `{ file: 'src/components/floating-tab-bar.tsx', key: 'tabs.bar' }`, última de `R2_TABS` |

Mueve: `R2_TABS` 5 → 6 (`#65 R2`), `ALL_USES` +1 (lo absorbe la suma de
`#194 R5`), catálogo +1 por idioma (`#194 R1`). `SCREEN_FILES` no cambia (el
fichero ya está). `R3_HOME` no cambia.

- BAR › `it('#206 R8: la fila es una lista de pestañas llamada Pestañas')`
  (español): `toHaveProp('accessibilityRole', 'tablist')`,
  `toHaveProp('accessibilityLabel', 'Pestañas')`, y las cinco celdas siguen con
  `accessibilityRole` `tab`.
- BAR › `it('#206 R8: en inglés la lista de pestañas se llama Tabs')`: el mismo
  render con `LanguageProvider initial="en"`; `accessibilityLabel` = `Tabs`.
- CF › `it('#206 R8: el nombre de la fila es el aria-label del canvas')`: los
  artboards contienen `<nav aria-label="Pestañas"`; `src/i18n/catalog.ts`
  contiene `'tabs.bar': 'Tabs'` y `'tabs.bar': 'Pestañas'`; la fuente contiene
  `accessibilityRole="tablist"` y `t('tabs.bar')`.

### Carta y guardas

**R9. Enmienda #206 en la carta.**
THE SYSTEM SHALL contener en `docs/ui-guidelines.md`, una sola vez y al final,
el bloque literal de `design.md` § Enmienda de la carta, con su casilla
`- [ ] Enmienda #206 aprobada por humano`, sin cambiar el párrafo D-I.

- CF › `it('#206 R9: la carta nombra la excepción de iconos de la barra una sola vez y con su casilla')`:
  `charter.match(/## Enmienda #206/g)` mide 1; `toMatch(/- \[[ xX]\] Enmienda #206 aprobada por humano/)`;
  tras normalizar la casilla a `- [ ]`, `split(BLOQUE)` mide 2 (`BLOQUE`
  copiado a mano de design.md); `charter.split('- **Iconos reicon (D-I).**')`
  mide 2.

**R10. Guardas de la barra.**
THE SYSTEM SHALL mantener en `floating-tab-bar.tsx` cero `#` (ni hex ni ids de
feature en comentarios), cero clases arbitrarias (`-[`), cero `StyleSheet`,
cero `shadowColor` y `elevation`, cero `text-13`, `text-15` y `text-17`, y
exactamente una `text-accent-strong`.

- CF › `it('#206 R10: la barra no lleva hex, clases arbitrarias, StyleSheet ni sombras de React Native')`.
  Nace verde (en 81cb6d6b todas sus cifras ya se cumplen): su rojo se demuestra plantando `shadowColor: 'red'` en la
  fuente sin commitearlo, y se anota en el informe.

### Cierre del humano

**R11. Smoke en dev build Android.**
WHEN el humano abre la app en el dev build Android THE SYSTEM SHALL mostrar la
barra según la lista de § Cierre del humano. Sin test automático: lo cierra el
humano, no es gate de implementación.

## Candados que esta feature revierte

Inventario cerrado, buscado por cada literal que cambia (`68.8`, `137.6`,
`left: 8`, `bottom: 6`, `stringContaining('bg-glass-surface')`, `icon-tab-`,
`.props.color`, `'Outline'`, `weight`, `toHaveLength(5)` de `R2_TABS`, la suma
del catálogo y los imports de `/shadows`), siguiendo constantes y helpers. Cada
enmienda va en el commit rojo de su R y añade al título del `it` el sufijo
` (enmendado por #206 R<n>)`. Fichero › describe › it, con títulos literales.

| # | Fichero › describe › it | Hoy afirma | Afirmará | R |
|---|---|---|---|---|
| 1 | BAR › `R3: pill dimensionado y posicionado tras layout (y ausente antes)` › `espera un ancho válido y usa la geometría exacta para el tab activo` | `width: 68.8, left: 8, top: 6, bottom: 6, borderRadius: 999`, `translateX: 137.6` | `width: 66, left: 6, top: 6, height: 52, borderRadius: 999` (sale `bottom`), `translateX: 140` | R5 |
| 2 | BAR › `R4: pill se desliza con TAB_INDICATOR_SPRING y retarget-ea en vuelo` › `retarget-ea un cambio nuevo mientras el primer desplazamiento sigue en vuelo` | `translateX: 68.8` | `translateX: 70` | R5 |
| 3 | BAR › `#91 R1: una ruta fuera de TABS no monta la burbuja` › `desmonta la burbuja al navegar de health a alerts` | `translateX: 137.6` | `translateX: 140` | R5 |
| 4 | BAR › `#91 R2: el primer layout coloca la burbuja por el índice de TABS` › `usa el índice de map en TABS aunque difiera de state.index` | `translateX: 68.8` | `translateX: 70` | R5 |
| 5 | BAR › `#91 R3: el cambio de ruta desliza la burbuja al índice de TABS` › `anima health a su índice en TABS aunque difiera de state.index` | `translateX: 137.6` | `translateX: 140` | R5 |
| 6 | BAR › `#91 R4: al volver de una ruta ajena la burbuja aparece ya colocada` › `reaparece en la pestaña nueva sin animarse desde una ranura invisible` | `translateX: 68.8` y dos `translateX: 137.6` | `translateX: 70` y dos `translateX: 140` | R5 |
| 7 | BAR › `#91 R5: con una ruta ajena las cinco celdas quedan inactivas y siguen navegando` › `conserva el estado inactivo, los dos hijos y la navegación de cada pestaña` | colores leídos de `getByTestId('icon-tab-health').props.color` y `getByTestId('icon-tab-map').props.color`; cada `elementChild(tab, 0)` con `toHaveProp('weight', 'Outline')` y `toHaveProp('color', mutedColor)` | los mismos nodos leídos por `.props.stroke`; cada `elementChild(tab, 0)` con `toHaveProp('strokeWidth', 2)` y `toHaveProp('stroke', mutedColor)`; los dos hijos y la clase `text-2xs font-semibold text-muted` no cambian | R6 (el doble de reicon sale en ese commit rojo; R6 verde pone `strokeWidth={2}` fijo y R7 introduce el 2.4) |
| 8 | `src/__tests__/ui-language.test.ts` › `#65 R2: la barra de pestañas resuelve su copy por clave` › `resuelve las 5 ocurrencias normativas` | `expect(R2_TABS).toHaveLength(5)` | `expect(R2_TABS).toHaveLength(5 + 1)` (título: `resuelve las 5 ocurrencias normativas (enmendado por #206 R8)`) | R8 |
| 9 | `src/providers/__tests__/language-provider.test.tsx` › `#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros` › `#194 R1: mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas (enmendado por #189 R15)` | la suma acaba en `+ 7, // #194 R1 (+2); #189 R15 (+5)` | `+ 7 // #194 R1 (+2); #189 R15 (+5)` seguido de `+ 1, // #206 R8`; el título gana ` (enmendado por #206 R8)` al final | R8 |
| 10 | `src/__tests__/canvas-foundations.test.ts` › `#197 R20: cimientos sin cablear` | nadie importa `toggle-switch`, `screen-header`, `shadows` ni `rise-in`, y el layout raíz no cambia | **se borra el `describe` entero, sin sufijo**, en el primer commit rojo que monte un cimiento o toque `_layout.tsx`: aquí, el commit rojo de R3. Si otra feature ya lo borró al mergear `dev`, este paso no tiene efecto y se anota en el informe; si `dev` trae el `describe` enmendado por #201 (fila shadows con `['screens/map/index.tsx']`), se borra igualmente | R3 |

No son rojos y no se enmiendan:

- BAR › `R2: fallback BlurView con tint por tema, blurMethod y overlay translúcido`
  › `usa el fallback light con intensidad y método exactos`:
  `stringContaining('bg-glass-surface')` también casa con
  `bg-glass-surface-strong`; queda verde. La igualdad exacta la añade R2.
- BAR › `R8: tab bar flota con safe area` › `positions the bar twelve points above the bottom inset and inset 16 from each edge`:
  `bottom: 46, left: 16, right: 16` siguen en el `style` junto al `boxShadow`.
- BAR › `R7: tab bar renderiza y navega` (sus cuatro `it`), `R1`, `R4` ›
  `expone la duración y amortiguación fijadas` y `R5`: no leen ningún literal
  que cambie.
- `src/__tests__/legibility-classnames.test.ts` › `#61 R4: el acento como tinta usa accent-strong`:
  `floating-tab-bar.tsx` sigue con 1 `text-accent-strong`.
- `src/__tests__/alert-detail-canvas-fidelity.test.ts` ›
  `#180 R5.6: solo la barra de pestañas y el detalle importan expo-blur (enmendado por #189 R9)`:
  la barra sigue importando `expo-blur`.
- `src/app/(tabs)/__tests__/alerts.test.tsx` › `mantiene TABS en cinco entradas y sin alerts`:
  `TABS` conserva su forma (cinco `{ name:`).
- `src/__tests__/ui-copy-table.ts` › `#194 R5: cuadra ALL_USES con la suma de sus bloques`:
  se recalcula solo.

**Regla de parada.** Si se pone rojo un `it` que no está en esta tabla, el
implementador para y avisa al leader.

**Enmienda mecánica permitida**: si un `it` no inventariado se pone rojo solo porque compara contra el literal exacto que el R-id quita o sustituye (directo o vía constante/helper del test), el implementador lo enmienda en el commit rojo de ese R con el sufijo y lo apunta en la tabla «Enmiendas mecánicas» de su informe. Cualquier otro rojo no inventariado sigue siendo motivo de parada.

## Candados agregados revisados

Uno a uno, medidos en 81cb6d6b. Solo los tres que dicen una enmienda o un
borrado se mueven (catálogo `#194 R1`, `R2_TABS` `#65 R2` y `#197 R20`) y ya
están en el inventario (filas 9, 8 y 10).

| Candado | Fichero | Efecto de #206 |
|---|---|---|
| Longitud del catálogo `#194 R1` | `src/providers/__tests__/language-provider.test.tsx` | +1 por idioma (`tabs.bar`): fila 9 del inventario |
| `toHaveLength` de `R2_TABS` (`#65 R2`) | `src/__tests__/ui-language.test.ts` | 5 → `5 + 1`: fila 8 del inventario |
| `ALL_USES` (`#194 R5`) | `src/__tests__/ui-copy-table.ts` | se cuadra solo por suma de bloques; sin enmienda |
| `SCREEN_FILES` | `src/__tests__/ui-language.test.ts` (derivado de `ALL_USES`, ficheros únicos) | `floating-tab-bar.tsx` ya está; no cambia |
| `R3_HOME` | `src/__tests__/ui-copy-table.ts` | no se toca |
| chunky-cta `#177 R7.3` (inventario de radios de dieciséis) | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | la barra no usa radio 16 (es `rounded-full`); no mueve |
| Radios de design-drift `#178 R13` | `src/__tests__/design-drift.test.ts` › `#178 R13: Recordatorios sin deriva` | solo mira Recordatorios; no mueve |
| Inventarios de imports de reicon por fichero | `src/__tests__/design-drift.test.ts` (Recordatorios, Añadir recordatorio, `reminder-meta`, Horario e Historial) | no incluyen la barra; quitar su import de reicon no mueve ninguno |
| Párrafo D-I (`toContain`, tres veces) | `src/__tests__/design-drift.test.ts` | el párrafo no se edita; la excepción va en la Enmienda #206 (R9) |
| consistency-classnames (CC `#62 R14`, `#98 R10`, esquina continua por fichero) | `src/__tests__/consistency-classnames.test.ts` | la barra no aparece en sus tablas por fichero y sigue sin esquina continua (cápsula); no mueve |
| legibility-classnames `#61 R4` | `src/__tests__/legibility-classnames.test.ts` | `floating-tab-bar.tsx` sigue en 1 `text-accent-strong`; R10 lo fija |
| HEX_LITERAL (también en comentarios) | `src/__tests__/design-drift.test.ts` | 0 `#` en la barra; R10 lo fija y prohíbe ids de feature en comentarios |
| Clases `[…]` y `StyleSheet.create` | guardas de carta | ninguna clase nueva es arbitraria (`h-16`, `h-13`, `p-1.5`, `gap-1`, `gap-0.5` son escala); R10 lo fija |
| twMerge expulsa `text-13/15/17` en HeroUI | — | ninguna clase de texto nueva; las etiquetas siguen en `text-2xs` |
| LY `#105 R8` / `#194 R4` (`headerShown`) | — | `_layout.tsx` no se toca; no mueve |
| Inventario MT de `src/theme/motion.ts` | — | `motion.ts` no se toca (D5); no mueve. #199 (+7) y #200 (+2) suman ahí por su cuenta |
| `describe('#197 R20: cimientos sin cablear')` | `src/__tests__/canvas-foundations.test.ts` | se borra entero, sin sufijo, en el commit rojo de R3 (primer commit que monta un cimiento: `useShadows`); si otra feature lo borró antes, el paso no tiene efecto y se anota; si `dev` lo trae enmendado por #201, se borra igualmente |
| `#180 R5.6` (importadores de `expo-blur`) | `src/__tests__/alert-detail-canvas-fidelity.test.ts` | la barra sigue importando `expo-blur`; no mueve |
| `TABS` de cinco entradas | `src/app/(tabs)/__tests__/alerts.test.tsx` | forma conservada; no mueve |

Componentes compartidos: esta feature solo cambia `FloatingTabBar` (decisión
fija 4 de la carta), que ninguna de #196, #198 a #205 declara tocar. No toca
`EmptyState` (#198), `motion.ts` (#199, #200) ni `PetSwitcher` (#196).

## Erratas del leader (2026-10-24)

Firmadas por delegación (mandato del humano del 2026-10-23, `progress/plan_canvas-parity-2026-10-23.md` §4).


**Regla de recuentos agregados.** Si al llegar a verde una R se pone rojo un `it` que no está en el inventario y ese `it` solo cuenta usos o ficheros de un literal o token, Codex lo enmienda sin parar. Son de este tipo los inventarios cerrados de radios, de `style={CONTINUOUS_CORNER}`, de `text-NN` o de `<Card`, las sumas de copy y los suelos del escáner HeroUI. La condición es que el delta medido sea exactamente el número de usos que el diff de esa R, tal como esta spec la prescribe, añade o retira. La enmienda:

- da a la cifra o a la entrada su término (`// #206 Rn`, o `; #206 Rn: ±k` dentro de un comentario que ya exista);
- da al título el sufijo ` (enmendado por #206 Rn)`, o añade `Rn` al paréntesis de #206 si ya existe;
- va en el commit rojo de esa R; si ese rojo ya está commiteado, en un commit propio `test(#206): Rn amend the <candado> inventory` antes del siguiente R;
- se apunta en la tabla «Enmiendas mecánicas» del reporte con candado, antes, después y R.

El fichero de test de ese candado entra en la lista cerrada solo para esa enmienda. Sigue siendo PARADA si el delta no coincide, si el `it` afirma comportamiento o estructura y no un recuento, o si la enmienda exigiría cambiar producción.

## Desviaciones conscientes del canvas

| Pieza | Canvas | App tras #206 | Por qué |
|---|---|---|---|
| Distancia inferior | `bottom: 28px` | `insets.bottom + 12` | D2: el canvas no modela el inset del sistema |
| Desenfoque | `backdrop-filter: blur(20px)` | `BlurView intensity={80}` (Android, iOS sin liquid glass) o `GlassView` regular (iOS con liquid glass) | D4: no hay `blur(20px)` en React Native; se conserva el material vigente |
| Velo en liquid glass | `var(--glass)` .86 | sin overlay en la rama `GlassView` | D4: el material nativo ya es el velo |
| Movimiento | estático | la píldora se desliza con `TAB_INDICATOR_SPRING` | D5: comportamiento vigente; respeta Reduce Motion |
| Elemento | `<a>` con `aria-current` | `Pressable` con `accessibilityRole="tab"` y `accessibilityState.selected` | equivalente nativo |

## Fuera de alcance

- Mover `TAB_INDICATOR_SPRING` a `src/theme/motion.ts` (`#153 E1`; D5).
- Cambiar qué pestañas hay, su orden, su copy visible o su navegación.
- `NativeTabs` o cualquier cambio en `src/app/(tabs)/_layout.tsx`.
- Reservar o recalcular la banda inferior que las pantallas dejan a la barra.
- Badges, puntos de aviso o contadores sobre las pestañas (el canvas no los
  dibuja).
- Ningún otro icono de navegación o de acción cambia: siguen siendo de `reicon-react-native`.
- Dependencias nuevas (`expo-linear-gradient` sigue vetado), costes o AWS.
- Deuda que roza: ninguna.

## Cierre del humano

Smoke de R11 en el dev build Android del PC del humano (no Expo Go, no la VPS),
tema claro y oscuro. Cada línea es un supuesto de `design.md` § Supuestos.

1. (S1) Los cinco iconos se ven como trazos huecos redondeados, no como
   siluetas negras rellenas.
2. (S2) La cápsula proyecta una sombra suave hacia abajo.
3. (S3) El velo se lee translúcido y claro (oscuro en tema oscuro), no como
   una cápsula opaca.
4. (S4) La píldora verde coincide con la celda activa, sin asomar ni quedarse
   corta arriba o abajo.
5. (S5) Ninguna etiqueta se recorta con la escala de fuente del sistema al
   100 %.
6. (S6) La pestaña activa se distingue por color, píldora y trazo más grueso.
7. (S7) Al cambiar de pestaña la píldora se desliza y aterriza centrada; con
   «Quitar animaciones» activado salta sin deslizarse.
8. (S8) TalkBack anuncia la fila como «Pestañas» y cada pestaña con su nombre
   y su estado seleccionado.

## Aprobación

La firma la delega el humano en el leader con la checklist del plan
(`progress/plan_canvas-parity-2026-10-23.md` § 4). Cada casilla es un gate
distinto.

- [x] Aprobado por humano (fecha: 2026-10-23)
  Firma delegada en el leader por mandato del humano del 2026-10-23
  (`progress/plan_canvas-parity-2026-10-23.md` §4, checklist de firma pasada).
- [x] Enmienda #206 de `docs/ui-guidelines.md` aprobada (texto en `design.md` § Enmienda de la carta; R9 la escribe en la carta con su propia casilla `- [ ] Enmienda #206 aprobada por humano`)
  Firma delegada, mismo mandato.
- [ ] Smoke de R11 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
