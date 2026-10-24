---
feature: "mobile-canvas-tab-bar"
status: approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-canvas-tab-bar]]

Feature #206 del plan de paridad con el canvas (ola 2, cubre C16). Lleva la
barra de pestañas flotante (`mobile-pet-tracker/src/components/floating-tab-bar.tsx`)
a la geometría, el velo, la sombra, los iconos y la semántica del `<nav
aria-label="Pestañas">` del canvas. No cambia qué pestañas hay, ni su orden, ni
su copy visible, ni cómo navega, ni el muelle de la píldora. La única pieza
nueva fuera de la barra es una clave de catálogo (`tabs.bar`) y una enmienda de
la carta (`docs/ui-guidelines.md`, «Enmienda #206») que nombra la excepción a
D-I para los iconos de la barra.

Base congelada: worktree `/home/claude/sites/Pet-Tracker-wt-206`, branch
`feature/206-mobile-canvas-tab-bar`, `origin/dev` 81cb6d6b (trae #197).

## Premisas contrastadas

Cada premisa se midió contra el árbol de 81cb6d6b (rutas relativas a
`mobile-pet-tracker/`), no contra el plan ni contra un explore.

| Premisa | Medida | Resultado |
|---|---|---|
| Los tokens que pide el canvas ya existen | `src/theme/global.css`: `--color-glass-surface-strong` `rgba(255,255,255,0.86)` / oscuro `rgba(22,27,34,0.86)`; `--color-tab-pill` `rgba(23,130,85,0.14)` / `.22`; `--text-2xs: 10px`; `--color-shadow-12` `rgba(13,17,23,0.12)` | cierto: ningún token nuevo |
| La sombra del canvas ya está en el hook de #197 | `src/theme/shadows.ts`: `useShadows().tabBar = { boxShadow: [layer(10, 30, 0, twelve)] }` | cierto: `0 10px 30px` con `shadow-12` |
| `react-native-svg` ya es dependencia y se usa en producción | importado por `components/pet-avatar.tsx`, `components/empty-state.tsx`, `components/celebration.tsx`, `components/weight-chart.tsx`, `app/(tabs)/food.tsx`, `screens/home/weekly-activity-chart.tsx` | cierto: ninguna dependencia nueva |
| reicon puede reproducir el trazo 2 / 2,4 del canvas | `node_modules/reicon-react-native`: `strokeWidth` solo sustituye un `stroke-width` que ya exista en el SVG; en `Outline`, `Home`, `HeartPulse` y `ForkKnife` son trazados rellenos sin `stroke-width` (solo `Map` y `Profile` llevan `stroke-width="1.5"`) | **falso**: 3 de 5 iconos ignoran `strokeWidth`, y ninguno tiene la silueta del canvas |
| La carta obliga a reicon para los iconos | `docs/ui-guidelines.md` D-I: «Los iconos de la interfaz son componentes de `reicon-react-native` coloreados con un token vía `useThemeColors`»; candado de texto en `src/__tests__/design-drift.test.ts` (tres `toContain` del párrafo D-I) | cierto: dibujar con `react-native-svg` pide enmienda (D1) |
| `TABS` debe conservar su forma | `src/app/(tabs)/__tests__/alerts.test.tsx` › `mantiene TABS en cinco entradas y sin alerts` lee `/const TABS = \[([\s\S]*?)\] as const;/` y cuenta 5 `{ name:` | cierto: `TABS` sigue siendo `[{ name, labelKey }…] as const` |
| El layout de pestañas no necesita cambios | `src/app/(tabs)/__tests__/layout.test.tsx` afirma `tabBar` = `FloatingTabBar`; detail-stack, alert-detail y reminders-alerts mockean la barra a `null` | cierto: ni `_layout.tsx` ni esos tests se tocan |
| Importar `useShadows` rompe el candado de #197 | `src/__tests__/canvas-foundations.test.ts` › `describe('#197 R20: cimientos sin cablear')` falla si algún fichero importa `/shadows` | cierto: el primer commit rojo lo borra entero (ver requirements § Candados) |
| `TAB_INDICATOR_SPRING` no se mueve aquí | `src/screens/welcome/index.test.tsx` `#153 E1` y la carta dicen que migra a `motion.ts` «en una feature posterior»; #199 y #200 ya suman exportaciones a `motion.ts` | cierto: queda fuera de alcance (D5) |
| Ningún selector por regex atrapa los testID nuevos | `grep -rnE "TestId\(/" src`: los patrones son `^pet-chip-`, `^meal-row-`, `-message-row$`, `-link$`, `^stat-`, `-(?:error\|retry)$`, `^quick-action-`, etc.; ninguno casa con `tab-bar-row` ni con `icon-tab-` | cierto |

## Supuestos

Supuestos de entorno que ningún test de jest ve (jest mockea `react-native-svg`,
`expo-blur`, `expo-glass-effect` y el layout). Cada uno es una casilla del smoke
en dev build Android de requirements § Cierre del humano.

| # | Supuesto | Por qué jest no lo ve | Si falla |
|---|---|---|---|
| S1 | `stroke`, `strokeWidth`, `strokeLinecap`, `strokeLinejoin` y `fill="none"` puestos en el `<Svg>` raíz los heredan sus `<Path>` y `<Circle>` (react-native-svg 15 los envuelve en un `G` implícito) | el doble de `react-native-svg` es un `View` | iconos negros y rellenos: mover esos props a cada hijo (cambio de una línea por forma, sin tocar la spec) |
| S2 | `boxShadow` en la raíz con `overflow-hidden` y `rounded-full` sigue pintando la sombra fuera del borde en Android (Fabric pinta el box-shadow exterior aunque el contenido se recorte) | jest no pinta | barra sin sombra visible: se apunta como desviación en el smoke; no bloquea |
| S3 | `bg-glass-surface-strong` (.86) sobre `BlurView intensity={80}` se lee como el velo del canvas y no como una cápsula opaca | jest no compone | se apunta; la carta («Vidrio plano») ya da por hecho que con .86 el desenfoque apenas se aprecia |
| S4 | Con `h-16` (64) y `p-1.5` el borde de 1 queda dentro del alto (Yoga es `border-box`): celda de 52 y píldora `top: 6` alineadas con la celda | jest no ejecuta Yoga | píldora 1 px desalineada: se apunta como desviación |
| S5 | La etiqueta de 10 con `allowFontScaling` cabe en la celda de 52 junto al icono de 24 y el hueco de 2 a escala de fuente del sistema 100 % | jest no mide texto | se apunta; con escala grande el texto puede recortarse (ya pasaba con `py-3`) |
| S6 | El trazo 2,4 activo frente a 2 inactivo se distingue a simple vista junto al cambio de color | jest no pinta | se apunta; no bloquea |
| S7 | El muelle de la píldora con el paso nuevo (`ancho + 4`) aterriza centrado en cada celda y respeta Reduce Motion | jest usa timers falsos y no mide | se apunta como fallo de R5/R9 |
| S8 | TalkBack anuncia la fila como lista de pestañas con el nombre «Pestañas» y cada pestaña con su etiqueta y su estado seleccionado | jest no ejecuta el lector | se apunta como fallo de R8 |

## Contraste con el artboard

Fuente: el `<nav aria-label="Pestañas">` de las cinco copias congeladas en
`specs/mobile-canvas-tab-bar/canvas/` (`Inicio`, `Mapa`, `Salud`, `Nutricion`,
`Perfil`, versión 1792777983-cd94). Medido con un script: los cinco `nav` miden
3005 caracteres y son **idénticos** salvo la pestaña activa (`aria-current`,
`background: var(--pill)`, `color: var(--accent-strong)` y
`stroke-width="2.4"` se mueven juntos). Ningún otro artboard de las 55 se
cuenta aquí: los demás que traen la barra son estados de esas cinco pestañas y
la dibujan igual.

| Pieza | Canvas (literal) | App hoy (`components/floating-tab-bar.tsx`, 81cb6d6b) | Requisito |
|---|---|---|---|
| Posición | `left: 16px; right: 16px; bottom: 28px` | `bottom: insets.bottom + 12, left: 16, right: 16` | se conserva (D2) |
| Alto | `height: 64px; box-sizing: border-box` | sin alto: `py-3` + icono + `gap-1` + etiqueta | R1 `h-16` |
| Relleno y hueco | `padding: 6px; … gap: 4px` | fila `px-2 py-3`, `justify-around` | R1 fila `flex-row gap-1 p-1.5` |
| Radio y borde | `border-radius: 999px; … border: 1px solid var(--border)` | `rounded-full border border-border` | se conserva |
| Velo | `background: var(--glass)` = `rgba(255,255,255,0.86)` claro, `rgba(22,27,34,0.86)` oscuro | `bg-glass-surface` (.60) | R2 `bg-glass-surface-strong` |
| Desenfoque | `backdrop-filter: blur(20px)` | `BlurView intensity={80}` / `GlassView` | se conserva (D4) |
| Sombra | `box-shadow: 0 10px 30px rgba(13,17,23,0.12)` | clase `shadow-lg` | R3 `useShadows().tabBar` |
| Celda | `flex: 1; height: 52px; … flex-direction: column; align-items: center; justify-content: center; gap: 2px` | `flex-1 items-center gap-1` | R4 `h-13 flex-1 items-center justify-center gap-0.5` |
| Píldora | fondo `var(--pill)` de la celda activa: 52 de alto, ancho de celda, `border-radius: 999px` | `Animated.View` absoluto `left: 8, top: 6, bottom: 6`, ancho `(W - 16) / 5` | R5 `left: 6, top: 6, height: 52`, ancho `(W - 30) / 5`, paso `ancho + 4` |
| Icono | `svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"`, `stroke-linecap="round" stroke-linejoin="round"`, trazo `2.4` activo y `2` inactivo | `reicon-react-native` `Home`/`Map`/`HeartPulse`/`ForkKnife`/`Profile`, `weight` `Filled`/`Outline` | R6 y R7 trazados del canvas con `react-native-svg` |
| Etiqueta | `font-size: 10px; font-weight: 600`; activa `var(--accent-strong)`, inactiva `var(--muted)` | `text-2xs font-semibold text-accent-strong` / `text-muted` | se conserva |
| Copy | `Inicio`, `Mapa`, `Salud`, `Nutrición`, `Perfil` | `tabs.home|map|health|food|profile` = los mismos cinco | se conserva |
| Accesibilidad | `<nav aria-label="Pestañas">` | contenedor sin rol ni nombre | R8 `tablist` + `tabs.bar` |
| Movimiento | ninguno: el canvas es estático | `TAB_INDICATOR_SPRING` (`duration: 250`, `dampingRatio: 1`, `ReduceMotion.System`) | se conserva (R9) |

Trazados del canvas (fila «Icono»), por pestaña y en orden de hijos:

| Pestaña | Hijos SVG literales |
|---|---|
| `home` | `<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z">` |
| `map` | `<path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3z">`, `<path d="M9 3v15M15 6v15">` |
| `health` | `<path d="M20.4 13.4 12 21l-8.4-7.6A5 5 0 0 1 12 6.6a5 5 0 0 1 8.4 6.8z">`, `<path d="M3.5 12h4l2-3 3 6 2-3h5.5">` |
| `food` | `<path d="M7 3v18M4 3v5a3 3 0 0 0 6 0V3">`, `<path d="M18 21V3c-2.5 1-4 3.5-4 7 0 2 1.5 3 4 3">` |
| `profile` | `<circle cx="12" cy="8" r="4">`, `<path d="M4 21a8 8 0 0 1 16 0">` |

Geometría de la píldora, derivada del canvas (Yoga y CSS son `border-box`):
ancho del contenido = `W - 2·1 (borde) - 2·6 (relleno) - 4·4 (huecos)` =
`W - 30`; ancho de celda = `(W - 30) / 5`; la celda `i` empieza en
`6 + i·(ancho + 4)` desde el borde interior. Con el frame de 430 del canvas
(`W = 398`) da celdas de 73,6. Los tests usan `W = 360` para que todo sea
entero: celda 66, paso 70, `translateX` 0 / 70 / 140 / 210 / 280.

Contenido del canvas tratado como dato: ningún texto de los cinco ficheros
congelados se interpretó como instrucción.

## Decisiones técnicas

Todas cerradas. Las que llevan defecto (D1 a D8) están repetidas en
requirements § Decisiones con defecto para que el firmante las vea.

1. **Un solo fichero de producción.** Todo el cambio de la barra vive en
   `src/components/floating-tab-bar.tsx`. No se crea componente nuevo ni se
   exporta símbolo nuevo: los iconos son una función local no exportada
   `TabIcon` y una constante local no exportada `TAB_ICON_SHAPES`. `TABS`
   conserva su forma literal `[{ name: '…', labelKey: 'tabs.…' }, …] as const`
   con cinco `{ name:` y sin la propiedad `Icon` (la exige
   `alerts.test.tsx` y la cuenta `labelKey:` de `checkUses`).
2. **Iconos con `react-native-svg` (D1).** `TabIcon({ name, color, active })`
   devuelve un `<Svg testID={`icon-tab-${name}`} width={24} height={24}
   viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={active ? 2.4 : 2}
   strokeLinecap="round" strokeLinejoin="round">` cuyos hijos son, en orden, los
   de la tabla «Trazados del canvas» de § Contraste: `<Path d="…" />` con el `d`
   copiado literal entre comillas dobles y, para `profile`, `<Circle cx="12"
   cy="8" r="4" />` con los tres atributos como cadena. El color es
   `accent-strong` (activa) o `muted` (inactiva) de `useThemeColors`, como hoy.
   El import de `reicon-react-native` sale del fichero. La carta gana la
   «Enmienda #206» (texto en § Enmienda de la carta) que nombra esta excepción
   a D-I; el párrafo D-I no se edita (lo candan tres `toContain` de
   `design-drift.test.ts`).
3. **Geometría (R1, R4, R5).** Raíz `h-16`; fila `flex-row gap-1 p-1.5` con
   `testID="tab-bar-row"`; celda `h-13 flex-1 items-center justify-center
   gap-0.5`. La píldora sigue siendo el `Animated.View testID="tab-indicator"`
   absoluto y sin hijos, con `width: tabWidth, left: 6, top: 6, height: 52,
   borderRadius: 999, backgroundColor: tabPill` (sale `bottom: 6`), donde
   `tabWidth = (containerWidth - 30) / TABS.length` y el destino del muelle es
   `activeTabIndex * (tabWidth + 4)`. `containerWidth` sigue saliendo del
   `onLayout` de la raíz (ancho exterior, borde incluido), por eso se resta 30
   (`2·1 + 2·6 + 4·4`). Animar `translateX` de un absoluto sin hijos es la
   excepción que admite la skill `expo-animation`.
4. **Velo (R2).** Solo la rama `BlurView` lleva overlay; su clase pasa de
   `flex-1 bg-glass-surface` a `flex-1 bg-glass-surface-strong` (.86 del
   canvas). La rama `GlassView` (iOS con liquid glass) sigue sin overlay (D4).
5. **Sombra (R3).** La raíz pierde la clase `shadow-lg` y gana
   `style={{ ...shadows.tabBar, bottom: insets.bottom + 12, left: 16, right: 16 }}`
   con `const shadows = useShadows()` (Enmienda #197, punto 5). Nada de
   `shadowColor` ni `elevation`.
6. **Accesibilidad (R8).** La fila gana `accessibilityRole="tablist"` y
   `accessibilityLabel={t('tabs.bar')}`. Clave nueva en `src/i18n/catalog.ts`:
   `'tabs.bar': 'Tabs'` (inglés, tras `'tabs.profile': 'Profile'`) y
   `'tabs.bar': 'Pestañas'` (español, tras `'tabs.profile': 'Perfil'`). Las
   pestañas conservan `accessibilityRole="tab"` y `accessibilityState`.
7. **Movimiento sin cambios (D5).** `TAB_INDICATOR_SPRING`
   (`duration: 250, dampingRatio: 1, reduceMotion: ReduceMotion.System`), el
   salto sin muelle del primer layout y del regreso desde una ruta ajena, y el
   retarget en vuelo se conservan; solo cambia el destino numérico.
8. **Tests.** El doble de `reicon-react-native` sale de
   `src/components/__tests__/floating-tab-bar.test.tsx` y entra un doble de
   `react-native-svg` con el patrón de `components/__tests__/celebration.test.tsx`
   (cada forma es un `View` que recibe todos sus props) que exporta `default`
   (Svg), `Svg`, `Path` y `Circle`, con `__esModule: true`. El test de
   fidelidad nuevo `src/__tests__/tab-bar-canvas-fidelity.test.ts` lee las cinco
   copias congeladas con
   `readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-tab-bar/canvas/<Artboard>.dc.html'), 'utf8')`
   y la fuente de producción con
   `readFileSync(join(process.cwd(), 'src/components/floating-tab-bar.tsx'), 'utf8')`,
   y en cada fila afirma a la vez el literal del canvas y el valor de producción
   (patrón CF de #197). Ningún valor esperado se importa de producción.

### Enmienda de la carta

Texto literal que R9 añade al final de `docs/ui-guidelines.md` (tras la
«Enmienda #197»), con una línea en blanco antes del encabezado:

```markdown
## Enmienda #206 — barra de pestañas fiel al canvas

Fecha: 2026-10-23. Feature #206 `mobile-canvas-tab-bar`. Excepción nombrada a D-I.

1. **Iconos de la barra.** Los cinco iconos de `FloatingTabBar` se dibujan con `react-native-svg` copiando los trazados del `<nav aria-label="Pestañas">` del canvas (24 x 24, `fill="none"`, trazo redondeado de 2,4 en la pestaña activa y de 2 en las demás) y se colorean con `accent-strong` o `muted` vía `useThemeColors`. Excepción a D-I limitada a los iconos de esta barra: ningún otro icono de navegación o de acción cambia, y siguen siendo de `reicon-react-native`.
2. **Barra.** Cápsula de 64 con relleno de 6 y hueco de 4, celdas de 52, velo `bg-glass-surface-strong` y sombra `useShadows().tabBar`. Flota a 16 de cada lado y a 12 por encima del inset inferior.

Detalle y tests en `specs/mobile-canvas-tab-bar/requirements.md` (R1 a R10).

- [ ] Enmienda #206 aprobada por humano
```

## Archivos afectados

La app sigue en una sola capa de presentación (`docs/architecture.md`: la UI
móvil no toca dominio ni infraestructura). Rutas relativas a la raíz del repo.

| Fichero | Cambio | R |
|---|---|---|
| `mobile-pet-tracker/src/components/floating-tab-bar.tsx` | geometría, velo, sombra, iconos SVG, `tablist`; sale el import de reicon | R1 a R8, R10 |
| `mobile-pet-tracker/src/i18n/catalog.ts` | `'tabs.bar'` en inglés (`Tabs`) y en español (`Pestañas`) | R8 |
| `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | fila `{ file: 'src/components/floating-tab-bar.tsx', key: 'tabs.bar' }` al final de `R2_TABS` | R8 |
| `docs/ui-guidelines.md` | «Enmienda #206» al final | R9 |
| `mobile-pet-tracker/src/components/__tests__/floating-tab-bar.test.tsx` | dobles (`react-native-svg` entra, reicon sale), its `#206 R1` a `#206 R8` y enmiendas del inventario | R1 a R8 |
| `mobile-pet-tracker/src/__tests__/tab-bar-canvas-fidelity.test.ts` | **nuevo**: filas de fidelidad canvas ↔ producción, candado de la enmienda y grep-clean | R1 a R10 |
| `mobile-pet-tracker/src/__tests__/canvas-foundations.test.ts` | se borra entero `describe('#197 R20: cimientos sin cablear')` | R3 (primer commit rojo) |
| `mobile-pet-tracker/src/__tests__/ui-language.test.ts` | `toHaveLength(5)` de `R2_TABS` pasa a `5 + 1` con sufijo | R8 |
| `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` | sumando `+ 1 // #206 R8` y sufijo en el título de `#194 R1` | R8 |
| `specs/mobile-canvas-tab-bar/canvas/*.dc.html` | ya copiados por esta spec; el implementador **no** los toca | — |

No se tocan: `src/app/(tabs)/_layout.tsx`, `src/theme/*`, `src/theme/motion.ts`,
`src/components/pet-switcher.tsx`, `src/components/empty-state.tsx` ni ninguna
pantalla de #196 y #198 a #205.

## Alternativas descartadas

- **Conservar reicon con `weight="Outline"` y `strokeWidth`.** Descartada como
  defecto de D1: `strokeWidth` no tiene efecto en `Home`, `HeartPulse` ni
  `ForkKnife` (trazados rellenos) y ninguna silueta coincide con el canvas. Es
  la alternativa que el firmante puede elegir si prefiere no enmendar D-I
  (ver requirements § Decisiones con defecto, D1).
- **`NativeTabs` de `expo-router/unstable-native-tabs`** (la skill
  `expo-animation` lo recomienda para barras de pestañas). Descartada: la barra
  nativa no puede dibujar la cápsula flotante, el velo ni la píldora del
  canvas, y reharía `_layout.tsx` y sus tests.
- **Componente compartido `TabIcon` en `src/components/`.** Descartado: un solo
  consumidor; nace local y no exportado.
- **Medir la fila con su propio `onLayout`** en vez de restar 30 al ancho de la
  raíz. Descartado: un segundo `onLayout` reabre la carrera del primer layout
  que #91 cerró; la resta es exacta porque borde, relleno y huecos son
  constantes.
- **Animar el ancho o `left` de la píldora.** Descartado: el ancho solo cambia
  con el layout; el desplazamiento sigue siendo `translateX`.
- **Mover `bottom` a 28 como el canvas.** Descartado (D2): el canvas no modela
  el inset del sistema; `insets.bottom + 12` es la regla vigente (describe
  `R8: tab bar flota con safe area` del test actual) y la comparte la banda
  reservada por otras pantallas.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Choque de merge con features paralelas que también añaden claves (`src/i18n/catalog.ts`), filas de copy (`src/__tests__/ui-copy-table.ts`), sumandos (`language-provider.test.tsx`) o enmiendas al final de `docs/ui-guidelines.md` | son añadidos al final de listas: se resuelve conservando ambos lados; tras el merge se re-miden las cuentas de tasks.md § Cuentas a re-medir |
| Otra feature borra antes `describe('#197 R20: cimientos sin cablear')` | el paso del primer commit rojo de R3 no tiene efecto y se anota en el informe |
| Otra feature cambia `floating-tab-bar.tsx` (componente compartido, decisión fija 4 de la carta) | medido en 81cb6d6b: ninguna de #196, #198 a #205 lo declara; si aparece un cambio al mergear `dev`, para y avisa al leader |
| S1 falla en dispositivo (props de trazo no heredados) | ajuste local en `TabIcon` sin cambiar ningún test |
| El firmante rechaza la enmienda de D-I | aplicar la alternativa de D1: R6 y R7 se reescriben con reicon y R9 desaparece; el resto de la spec no cambia |
| Doble de Reanimated o de svg sin `__esModule` | el doble de svg declara `__esModule: true` (patrón de `celebration.test.tsx`) |
