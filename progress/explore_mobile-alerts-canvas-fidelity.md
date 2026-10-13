# explore: mobile-alerts-canvas-fidelity (#174)
Fecha: 2026-10-13


## §0 Base, método y artboards

- Worktree `/home/claude/sites/Pet-Tracker-wt-174`, branch `feature/174-mobile-alerts-canvas-fidelity`.
  HEAD `84f83949` = origin/main `788d1f89` + un commit del leader que solo toca
  `feature_list.json` y `progress/current.md` (`git diff --stat 788d1f89..HEAD` → 2 ficheros).
  Todo el código citado es, por tanto, el de `788d1f89` (#170 dentro, PR #213).
- Rutas relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.
- Método: lectura estática + `grep`. **No** se corrió jest, tsc, lint ni init.sh.
  Las anclas son contenido grepeable, nunca números de línea.
- `node_modules` no está instalado en el worktree. Las definiciones de heroui-native
  (`danger-soft`, `warning-soft`) se leyeron del `node_modules` del árbol principal;
  la versión coincide con el `package.json` del worktree (`"heroui-native": "1.0.8"` en ambos).
- Artboards (canvas https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j, versión 1791913045-37f1),
  descargados por el leader en el scratchpad de la sesión:
  - `Alertas.dc.html` sha256 `e1e546de02b86e7cc0ba847ea27489e4ec3ef6c174fdbc478d6e017490ebe0b0` (9241 B)
  - `DetalleAlerta.dc.html` sha256 `994a775c1f575009720c82512625672bc75a1793b94c7e97db2dd1ce7d6cdf89` (6369 B)
  - Frame de ambos: 390×844, `padding: 56px 20px 32px` (Detalle `56px 20px 40px`), `gap: 12px`
    (Detalle `gap: 14px`), fuente Inter, `@media (prefers-reduced-motion: reduce){*{animation:none!important}}`.
- Directiva del humano (2026-10-13, literal): «si, dale aclara en las otras sesiones que el diseño
  final debe de quedar como el artifac». Autoriza cambiar clases, componentes y candados donde el
  artboard lo pida; cada candado revertido se nombra (§4).

## §1 Alertas: inventario y tabla de huecos

Pantalla: `src/screens/alerts/index.tsx` (ancla `export function AlertsScreen`), ruta delgada
`src/app/alerts.tsx`, cabecera nativa declarada en `src/app/_layout.tsx`
(ancla `<Stack.Screen name="alerts" dangerouslySingular`; `headerOptions` = `headerTitleStyle: { fontFamily: 'Inter-Bold' }`,
`headerShadowVisible: false`, fondo `background`). Metadatos por tipo en `src/utils/alert-meta.ts`
(`ALERT_TYPE_META`, `UNKNOWN_ALERT_META`). Tarjeta compartida `src/components/card.tsx` (variante por defecto
`surface` = `'rounded-card border border-border bg-surface p-4 shadow-sm'`).

### Inventario del artboard (orden visual)

1. Cabecera: chevron atrás 24 px (trazo 2.4) en caja 44×44 con `margin-left:-10px`; `h1` «Alertas» 26 px/900,
   `letter-spacing:-0.02em`, `flex:1`; píldora «2 nuevas» a la derecha (fondo `--danger`, texto blanco 13 px/800,
   `padding:4px 10px`, radio 999, animación `pop 500ms ease-out 300ms`).
2. Encabezado de sección «Hoy»: 13 px/800, mayúsculas, `letter-spacing:.06em`, `--muted`, `margin-top:6px`.
3. Fila sin leer «Salió de la zona» (rosa): radio 20, fondo `--surface`, **borde 2 px `--danger`**, `padding:12px 14px`,
   `gap:12px`; disco 44 px `--rose` con icono 22 px `--danger`; columna con título 15 px/800 y una sola línea
   «Rocky · Hace 5 min» 12 px `--muted` (gap 2 px); botón «Marcar leída» chunky secundario: alto 34, `padding:0 12px`,
   radio 10, fondo `--surface`, borde 2 px `--lip-gray` + `box-shadow:0 3px 0 --lip-gray`, 12 px/800. `rise 400ms 0ms`.
4. Fila sin leer «Batería baja» (ámbar): igual con borde 2 px `--warning`, disco `--amber`, icono `--warning`. `rise 70ms`.
5. Encabezado «Esta semana».
6. Fila resuelta «Salió de la zona»: borde 1 px `--border`; chip «Resuelta» `padding:4px 10px`, radio 999,
   fondo `--green`, tinta `--green-s`, 12 px/**800**. `rise 140ms`.
7. Fila leída «Aviso»: disco `--default`, icono `--muted`; chip «Leída» fondo `--default`, tinta `--muted`, 12 px/**700**.
   **Fuera de alcance** (sin tipo de backend, ya excluida en #170); la app la pinta como tipo desconocido. `rise 200ms`.
8. Fila leída «Batería baja»: chip «Leída». `rise 260ms`.
- Marco: `padding:56px 20px 32px`, `gap:12px` entre todos los bloques (cabecera, encabezados y filas).
- No hay sección «Anteriores» en el artboard (la añadió #170 R3; se conserva, ver P-Q3).

### Tabla de huecos (A = Alertas)

| # | Elemento | Canvas | App hoy (fichero · ancla grepeable) | Acción | Candados afectados |
|---|---|---|---|---|---|
| A1 | Marco/lista | `padding 56/20/32`, `gap 12` | `alerts/index.tsx` · `padding: 24,` / `gap: 16,` / `paddingBottom: insets.bottom + 24` | `paddingHorizontal: 20`, `gap: 12` (el 56 superior lo pone la cabecera nativa) | `alerts/index.test.tsx` · `it('respeta las dimensiones bajo cabecera nativa, el inset automático y los safe areas (#114 R6)'` (`toEqual({ padding: 24, gap: 16, paddingBottom: 48 })`). Choca con la convención de dimensiones uniformes (`docs/conventions.md`, patrón home): ver P-Q2 |
| A2 | Título (P-Q1) | 26 px / 900 / `-0.02em`, alineado a la izquierda | Cabecera nativa: `_layout.tsx` · `name="alerts" dangerouslySingular options={{ ...headerOptions, title: t('alerts.title') }}`, `Inter-Bold`, tamaño por defecto de la plataforma | Opción ligera: mantener cabecera nativa y, solo en esta ruta, `headerTitleStyle: { fontFamily: 'Inter-Black', fontSize: 26 }` + `headerTitleAlign: 'left'` (el `letterSpacing` no lo admite `headerTitleStyle`; no verificado en la versión instalada). Opción pesada: `headerShown: false` + cabecera propia en pantalla (reutilizar el literal `text-3xl font-black tracking-tight text-foreground` de #168, que es 30 px) | `alerts/index.test.tsx` · `describe('#114 R5: el título vive en la cabecera nativa'` (solo con la opción pesada); `ui-copy-table.ts` · `{ file: 'src/app/_layout.tsx', key: 'alerts.title' }, // #114 R4` (solo si el título sale de `_layout`); `tab-headers-canvas.test.ts` · `it('limita el literal a los tres ficheros de producción'` (si se reutiliza el literal de #168) |
| A3 | Chevron atrás | SVG 24 px, trazo 2.4, caja 44 | Back nativo de `expo-router` Stack (`headerTintColor: foreground`) | Ninguna con la opción ligera (el back nativo ya existe y conserva el gesto). Con la pesada, `ChevronLeft` de reicon (ya importado en `screens/meals-history/index.tsx`) + `router.back()` | — |
| A4 | Píldora «N nuevas» | En la cabecera, a la derecha; 13 px/800, `px 10 py 4`, `bg --danger`, texto blanco; `pop` 500 ms con 300 ms de retardo | `alerts/index.tsx` · `testID="alerts-new-count" className="mx-6 mt-6 self-start rounded-full bg-danger px-3 py-1"`, texto `text-xs font-bold text-danger-foreground` + `TABULAR_NUMS`; sin animación | Mover a `headerRight` (opción ligera) o a la fila de cabecera propia; `px-2.5 py-1`, `text-[13px]` no existe: `text-xs` (12) o `text-sm` (14) → P-Q4; peso 800 = `font-extrabold` de #173 R1; envolver en `PopIn` (`src/components/pop-in.tsx`) | `alerts/index.test.tsx` · `it('pinta el contador como hermano anterior de la lista con su anatomía'` (posición y `className` exactos); `consistency-classnames.test.ts` · `[join('screens', 'alerts', 'index.tsx'), 1], // #170 R16` (`TABULAR_NUMS`: si la píldora sale a `_layout.tsx` el recuento se mueve de fichero) |
| A5 | Encabezado de sección | 13 px/800, `uppercase`, `tracking .06em`, `--muted`, `mt 6` | `alerts/index.tsx` · `className="text-xs font-bold uppercase text-muted"` dentro de `<View className="gap-4">` | `text-xs font-extrabold uppercase tracking-wider text-muted` (12 px; `tracking-wider` = 0.05em, el más cercano; el resto de la app usa `tracking-widest`), `gap-3` en el envoltorio y `mt-1.5` | `alerts/index.test.tsx` · `expect(headers[0].props.className).toBe('text-xs font-bold uppercase text-muted')` (#170 R3) y `expect(parent.props.className).toBe('gap-4')` |
| A6 | Tarjeta de fila | radio 20, `bg surface`, `padding 12/14`, `gap 12`, **sin sombra**; sin leer: borde 2 px de severidad; leída: borde 1 px `--border` | `alerts/index.tsx` · `className={'min-h-20 flex-row items-center gap-3' + (item.status === 'open' ? \` border-2 ${meta.border}\` : '')}` sobre `Card` `surface` (`p-4 shadow-sm`) | `px-3.5 py-3` y `shadow-none` (o la variante `flat` de #173 R3, que ya es `rounded-card border border-border bg-surface px-3.5 py-1` sin sombra: habría que pisar `py-1` con `py-3`) | `alerts/index.test.tsx` · `expect(row.props.className).toContain('min-h-20 flex-row items-center gap-3')` (sobrevive si solo se añade); `describe('#170 R5: la fila abierta lleva el borde de su tipo'` (sobrevive). Si se usa `variant="flat"`: `#173 R3.3` (`variant="flat"` exactamente 2 veces, solo Perfil) |
| A7 | Color del borde sin leer | rosa: `--danger` (#D92D20 claro); ámbar: `--warning` (#B54708 claro) | `alert-meta.ts` · `border: 'border-danger'` (#EF4444) / `border: 'border-warning-strong'` (#92610A) | Se mantienen las clases; la diferencia es de valor de token (§3, T1/T2) | — |
| A8 | Disco del icono | 44 px, `--rose` / `--amber` / `--default` | `alert-meta.ts` · `surface: 'bg-danger-soft'` / `surface: 'bg-warning-soft'` / `surface: 'bg-default'`; clase `size-11 items-center justify-center rounded-full` | `bg-category-rose` / `bg-category-amber` (coinciden al hex con `--rose`/`--amber` en claro y oscuro). **Pero** #64 R9 solo permite nombrar clases categóricas en `src/utils/category-palette.ts` → añadir allí las dos (o un slot `alert`) y que `alert-meta.ts` las lea | `alerts/index.test.tsx` · tabla con `surface: 'bg-danger-soft'` / `'bg-warning-soft'` y la de `#170 R5`; `alert-detail/index.test.tsx` · `['geofence_exit', 'LocationSlash', 'bg-danger-soft', …]`. `consistency-classnames.test.ts` · `it('centraliza las diez clases completas y prohíbe interpolarlas'` **no se mueve** si `alert-meta.ts` lee `CATEGORY_SLOTS.rose.surface` / `CATEGORY_SLOTS.amber.surface` de `src/utils/category-palette.ts` (las diez clases ya existen; el candado exige que el único fichero con `bg-category-` sea la paleta y prohíbe interpolar `bg-category-${…}`) |
| A9 | Icono | geocerca: pin con guion (SVG propio); batería: rectángulo; 22 px, trazo 2.2 | `LocationSlash` / `BatteryLow` / `Bell` de reicon, `size={20}` | `size={22}`. Mantener los glifos de reicon (sin SVG propio, carta) → P-Q5 | `alerts/index.test.tsx` y `alert-detail/index.test.tsx` (`iconName`); ninguno fija `size` (`grep -nF 'size).toBe' …` → 0, no verificado a fondo) |
| A10 | Título de la fila | 15 px / 800 | `className="text-sm font-bold text-foreground"` (14/700) | `text-[15px]` está vetado (C8): `text-base` (16) o `text-sm` (14) + `font-extrabold` → P-Q4 | `alerts/index.test.tsx` · `expect(typeText.props.className).toBe('text-sm font-bold text-foreground')` (#78 R6) |
| A11 | Subtítulo | una línea «Rocky · Hace 5 min», 12 px, `--muted`, gap 2 | Dos `Text`: `${rowId}-pet` `text-xs font-semibold text-muted` y `${rowId}-time` `text-xs font-normal text-muted`, `gap-1` | Fusionar en un `Text` (o dos `Text` anidados) con separador «·»; `gap-0.5`. #170 lo excluyó expresamente («la línea combinada "mascota · hora"») | `#78 R6` (tres hijos de la columna, `petText`/`timeText` con `className` exacto); `alerts/index.test.tsx` · `expect(elementChild(row, 1).props.className).toBe('min-h-11 min-w-0 flex-1 gap-1')` (tres veces); `it('formatea ahora, minutos, horas y días por la clave correspondiente'` si cambia el testID. Copy: §6 |
| A12 | «Marcar leída» en fila sin leer | chunky **secundario**: 34 alto, radio 10, `surface` + borde 2 `--lip-gray` + labio 3 px; 12 px/800 | `alerts/index.tsx` · `testID={\`${rowId}-ack\`}` `className="min-h-11"`, primario heroui sin color (la carta §13 lo pone en «Sin labio: … confirmar alerta») | Receta de secundario neutro de la carta §13 `rounded-xl border-2 border-b-6 border-lip-gray bg-surface` con `variant="secondary"` y tamaño `sm`; alto visible 34 + `TOUCH_SLOP` (`src/theme/touch-target.ts`) o `min-h-11` | `consistency-classnames.test.ts` · `describe('#166 R3: el secundario neutro lleva el labio gris'` (`rows`, inventario por `testID="…"`, `toBe(4 + 1)` de `border-lip-gray` y `border-b-6`). **Trampa**: el inventario extrae `testID="([^"]+)"` y aquí el `testID` es plantilla (`{\`${rowId}-ack\`}`) → saldría `undefined` en la lista; el candado necesita una regla para plantillas. `alerts/index.test.tsx` · `expect(ack.props.className).toContain('min-h-11')`. Carta §13 «Sin labio» |
| A13 | Chip «Resuelta» | fondo `--green`, tinta `--green-s`, 12 px/800, `px 10 py 4` | `className="rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted"` (gris para ambas) | `CATEGORY_SLOTS.green.surface` + `CATEGORY_SLOTS.green.ink` (sin nombrar la clase fuera de la paleta, #64 R9 intacto), `px-2.5 py-1 text-xs font-extrabold` | `alerts/index.test.tsx` · `expect(pill.props.className).toBe('rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted')` (#78 R6) |
| A14 | Chip «Leída» | fondo `--default`, tinta `--muted`, 12 px/700, `px 10 py 4` | mismo literal que A13 | `rounded-full bg-default px-2.5 py-1 text-xs font-bold text-muted` | idem A13 |
| A15 | Orden de secciones | Hoy, Esta semana | Hoy / Esta semana / Anteriores (`alertSection` de `src/utils/alert-sections.ts`) | Sin cambio | — |
| A16 | Entrada | `rise 400ms`, `translateY 14px → 0`, escalonado 0/70/140/200/260 ms | Sin animación | `HomeEntrance` (`src/screens/home/home-entrance.tsx`, `MOTION_STAGGER_MS = 60`, `MOTION_ENTRANCE_OFFSET_Y = 12`, respeta reduce motion) por fila visible de la primera página; ver riesgo R-1 (FlatList + `entering`) | Nuevo; ningún `toHaveAnimatedStyle` en estos tests (`grep -c toHaveAnimatedStyle` → 0 y 0, §4) |
| A17 | Carga | — (no dibujado) | `testID="alerts-loading"`: tres `Skeleton` `h-20 w-full rounded-card` | Sin cambio (alto 80 ≈ fila de 68 del canvas; opcional `h-17`) | `it('pinta tres esqueletos mientras espera la primera página'` |
| A18 | Error | — | `alerts-error` `text-danger` + `alerts-retry` primario heroui sin color | Sin cambio (la carta §13 deja «reintentos» sin labio) | `#72 R1` |
| A19 | Vacío | — | `EmptyState` `pose="sleep"` (`alerts.empty` / `alerts.emptyBody`) | Sin cambio; #171 añade flotar a `EmptyState` (§7) | `describe('#155 R5: sin alertas, Pingo duerme'` |
| A20 | Oscuro | tokens `.pt.dark` | tokens `@variant dark` de `global.css` | Ver §3 (rosa/ámbar/verde categóricos coinciden; `--danger` oscuro coincide) | — |

## §2 Detalle de alerta: inventario y tabla de huecos

Pantalla: `src/screens/alert-detail/index.tsx` (anclas `export function AlertDetailScreen`,
`function AlertDetailMap(`), ruta delgada `src/app/alerts/[alertId].tsx` (el título nativo es
`t('alerts.detailTitle')` en `_layout.tsx`). El artboard solo dibuja `geofence_exit` sin leer.

### Inventario del artboard (orden visual)

1. Cabecera: chevron + `h1` «Alerta» 26/900/`-0.02em`; sin píldora.
2. Héroe `<section>`: radio **28**, fondo `--rose`, `padding:22px 18px`, columna centrada, `gap:8px`, `rise 400ms`.
   - Icono 72 px: anillo `ping` en `inset:-10px` (92 px), `rgba(217,45,32,0.18)`, `ping 1.8s ease-out infinite`
     (escala .55→1.5, opacidad .55→0); círculo `--danger` con icono blanco 34 px.
   - Chip «Sin leer»: `padding:3px 10px`, `--danger`, texto blanco 12/800.
   - Título «Salió de la zona» 22/900; «Rocky» 15/700 `--rose-s`; «Detectada el 6 oct 2026, 16:42» 13 px `--rose-s`.
3. Mapa: alto **210**, radio **24**, `overflow:hidden`, `rise` con 80 ms; SVG con `aria-label="Ubicación al salir de la zona Casa"`;
   píldora de cristal absoluta `left:12 bottom:12`, `padding:6px 10px`, radio 999, `--glass` + `backdrop-filter: blur(12px)`,
   12/700, «A 85 m de Casa».
4. CTA «Ver en el mapa»: alto 52, radio 16, `surface` + borde 2 `--lip-gray` + labio 4 px, `gap:8px`, 16/800, icono mapa plegado 18 px.
5. Primario «Marcar leída»: `margin-top:auto` (anclado abajo), alto 56, radio 16, `--accent`, blanco, labio 4 px `--lip`, 17/800.
- Marco: `padding:56px 20px 40px`, `gap:14px`.

### Tabla de huecos (D = Detalle)

| # | Elemento | Canvas | App hoy (fichero · ancla grepeable) | Acción | Candados afectados |
|---|---|---|---|---|---|
| D1 | Marco | `padding 56/20/40`, `gap 14` | `alert-detail/index.tsx` · `contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}` | `paddingHorizontal: 20`, `gap: 14`, `flexGrow: 1` (para D13); P-Q2 | `alert-detail/index.test.tsx` · `it('respeta las métricas A11 bajo cabecera nativa'` (`padding 24 / gap 16 / paddingBottom 48`) |
| D2 | Título «Alerta» | 26/900 | cabecera nativa `title: t('alerts.detailTitle')`, `Inter-Bold` | Igual que A2 (misma decisión para las dos pantallas) | Igual que A2; `ui-copy-table.ts` fila `alerts.detailTitle` en `_layout.tsx` solo con la opción pesada |
| D3 | Contenedor héroe | radio 28, `--rose`, `padding 22/18`, centrado, `gap 8`, sin borde ni sombra | `testID="alert-detail-card"` `className={'min-h-44 gap-3' + (alert.status === 'open' ? \` border-2 ${meta.border}\` : '')}` sobre `Card` `surface` (`p-4 shadow-sm`, radio 20) | `Card variant="hero"` de #173 R3 (`rounded-hero bg-surface-secondary p-4.5`) con `className` que pise el fondo por `CATEGORY_SLOTS.rose.surface` (ámbar para batería; ver P-Q9), `items-center gap-2 px-4.5 py-5.5`; sin borde de severidad. Si #173 no firma: `rounded-card` (20) y P-Q7 | `alert-detail/index.test.tsx` · métricas A11 (`'rounded-card bg-surface p-4 shadow-sm min-h-44 gap-3 border-2 border-danger'`); `describe('#170 R6`… (literal por tipo y variante cerrada `'rounded-card border border-border bg-surface p-4 shadow-sm min-h-44 gap-3'`). Con #173: `R2.2` (`rounded-hero` solo en `card.tsx` + `screens/profile/index.tsx`) y `R3.3` (`variant="hero"` exactamente 1 vez) en `profile-canvas-fidelity.test.ts` |
| D4 | Disposición del héroe | columna centrada: icono, chip, título, mascota, fecha | fila `testID="alert-detail-header"` `className="flex-row items-center gap-3"` (icono + tipo), luego mascota, fecha, píldora (orden 0..3) | Columna: icono, chip estado, tipo, mascota, fecha; borrar `alert-detail-header` o dejarlo como columna | `alert-detail/index.test.tsx` · `expect(elementChild(card, 1).props.testID).toBe('alert-detail-pet')` / `'alert-detail-opened-at'` / `'alert-detail-status'` y `toBe('flex-row items-center gap-3')` (#100 R3) |
| D5 | Icono 72 + ping | círculo 72 `--danger`, icono blanco 34; anillo 92 `rgba(217,45,32,.18)` con `ping` 1.8 s infinito | disco `size-11` `bg-danger-soft` con `Icon size={20}` tinta `danger` | Círculo `size-18 rounded-full bg-danger` + icono 34 en `danger-foreground`; anillo `absolute size-23 rounded-full bg-danger/20` animado con `MOTION_PING_FROM` / `MOTION_PING_TO_SCALE` / `MOTION_PING_TIMING` (`src/theme/motion.ts`; 2400 ms vs 1.8 s del canvas, P-Q12). `PingRing` es local y no exportado en `src/screens/welcome/index.tsx` (borde acento, `size-65`): extraer a `src/components/` con color/tamaño por prop, o duplicar el bucle. Solo si `status === 'open'` (P-Q10) y nulo con reduce motion (patrón Welcome `{reduceMotion ? null : …}`). Batería: `bg-warning-strong` + icono blanco (P-Q9) | `alert-detail/index.test.tsx` · `it.each([['geofence_exit', 'LocationSlash', 'bg-danger-soft', …` (`surface` del disco). Si se extrae `PingRing`: `src/screens/welcome/index.test.tsx` (`welcome-ring-${index}`, `MOTION_PING_*`) debe seguir verde sin cambios. `bg-danger/20`: opacidad por barra, no corchete, C8 intacto |
| D6 | Chip «Sin leer» | `--danger`, blanco 12/800, `px 10 py 3` | `testID="alert-detail-status"` `className="self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted"` (mismo gris para los tres estados) | Abierta: `rounded-full bg-danger px-2.5 py-0.75 text-xs font-extrabold text-danger-foreground` (`py-0.75` = 3 px, no verificado que uniwind lo genere; si no, `py-1`). Leída/Resuelta: los chips de A13/A14 | `alert-detail/index.test.tsx` · `expect(pill.props.className).toBe('self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted')` |
| D7 | Tipo | 22/900 centrado | `alert-detail-type` `text-lg font-bold text-foreground` (18/700) | `text-2xl font-black text-foreground text-center` (24; 22 no existe en la escala; P-Q4) | `expect(cardScope.getByTestId('alert-detail-type').props.className).toBe('text-lg font-bold text-foreground')` |
| D8 | Mascota | 15/700 `--rose-s` | `alert-detail-pet` `text-sm font-semibold text-muted` | `text-sm font-bold` + `CATEGORY_SLOTS.rose.ink` (`text-category-rose-strong`) | `expect(cardScope.getByTestId('alert-detail-pet').props.className).toBe('text-sm font-semibold text-muted')` |
| D9 | Fecha | «Detectada el 6 oct 2026, 16:42», 13 px `--rose-s` | `alert-detail-opened-at` `text-sm font-normal text-muted`, valor `new Date(alert.openedAt).toLocaleString(locale)` («31/12/2026, 13:00:00») | `toLocaleString(locale, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })` (patrón `fmtDate` de `src/screens/home/format.ts`, que solo acepta `YYYY-MM-DD`); `text-xs` (12) o `text-sm` + `CATEGORY_SLOTS.rose.ink`. Hermes puede emitir «6 oct 2026» o «6 oct. 2026» (no verificado) | `it.each(… /^Detectada el 31\/12\/2026,/ … /^Detected 1\/2\/2027,/` `'formatea la apertura en $language con el locale del idioma'` (regex y `className`) |
| D10 | Mapa | alto 210, radio 24, `rise` +80 ms | `testID="alert-detail-map" className="h-52 overflow-hidden rounded-card" style={CONTINUOUS_CORNER}` (208, radio 20) | `h-52.5` (210; sin corchete). Radio 24 = `rounded-3xl`, fuera de la escala de la carta §12 y vetado por #62 R4 sólo para `2xl/lg/md/sm` (no verificado si `3xl` está vetado; ver §4); alternativas `rounded-card` (20) o `rounded-hero` (28) → P-Q7 | `alert-detail/index.test.tsx` · `expect(map.props.className).toBe('h-52 overflow-hidden rounded-card')` (#170 R8). `#170 R9` (ningún ancestro del mapa con fondo) sigue válido |
| D11 | Etiqueta a11y del mapa | `aria-label="Ubicación al salir de la zona Casa"` | Ninguna; `PetMap` (`src/components/pet-map.tsx`, `export type PetMapProps`) no acepta `accessibilityLabel` | `accessible` + `accessibilityLabel` en el `View` envoltorio (sin tocar `pet-map.tsx`, excluido por #170); nombre de zona desde `alert.payload.geofenceName` (§5) o `zone.name` | Copy nueva (§6): `ui-copy-table.ts` R13 + `ui-language.test.ts` `toHaveLength(11 - 3 + 2)` + `language-provider.test.tsx` longitud |
| D12 | Distancia | píldora de cristal **dentro** del mapa, `left 12 bottom 12`, `--glass` 0.86 + blur 12, 12/700 | `testID="alert-detail-distance"` hermano **debajo** del mapa, `text-sm font-semibold text-foreground` + `TABULAR_NUMS` | Mover dentro del `View` del mapa: `absolute bottom-3 left-3 rounded-full bg-glass-surface px-2.5 py-1.5` + texto `text-xs font-bold text-foreground` + `TABULAR_NUMS`. `bg-glass-surface` (solo lo usa `floating-tab-bar.tsx`) vale 0.60 frente a 0.86; sin blur salvo `expo-blur` (P-Q11) | `alert-detail/index.test.tsx` · `'pinta la distancia bajo el mapa'` (#170 R10), `expect(distance.props.className).toBe('text-sm font-semibold text-foreground')`, `'ordena tarjeta, mapa, distancia, CTA y ack'` (#170 R15: con `within(child).queryByTestId` los índices de mapa y distancia coincidirían y el orden falla). `consistency-classnames` `TABULAR_NUMS` de alert-detail (`// #170 R16`) no cambia si se conserva el `style` |
| D13 | CTA «Ver en el mapa» | alto 52, radio 16, secundario con labio, icono mapa 18 px, 16/800 | `testID="alert-detail-view-map"` `variant="secondary"` `className="min-h-11 rounded-xl border-2 border-b-6 border-lip-gray bg-surface"`, sin icono | Añadir `Map` de reicon (ya importado en 2 ficheros) `size={18}` antes de `Button.Label`; `min-h-13`; radio se queda `rounded-xl` (carta §12, P-Q8) | `consistency-classnames.test.ts` · `describe('#166 R3` fila `alert-detail-view-map` (literal de receta, no cambia si solo se añade `min-h-13`; no verificado si la fila compara el `className` completo) |
| D14 | «Marcar leída» | primario chunky anclado abajo (`margin-top:auto`), alto 56, radio 16, labio `--lip` 4 px, 17/800 | `testID="alert-detail-ack"` `className="min-h-11"` (primario heroui sin color, carta §13 «Sin labio … confirmar alerta»), en el flujo tras el CTA | Receta primaria de la carta `rounded-xl bg-accent border-b-4 border-black/25` + `min-h-14`; anclaje con `flexGrow: 1` en el contenedor y un `View className="flex-1"` espaciador (o `mt-auto`), patrón `flexGrow: 1` de `screens/forgot/index.tsx` | `consistency-classnames.test.ts` · `#62 R1` `toHaveLength(13+1+1+1+1+1+1)` (19→20), `#166 R2` `toBe(19)` de `border-b-4` y `border-black/25` (19→20) y su mapa `expected` por fichero (sin fila de alert-detail: +1 fila). Con #173 ya mergeada la base pasa a 18 (§7). Carta §13 «Sin labio» nombra «confirmar alerta» → enmienda (P-Q13). `alert-detail/index.test.tsx` · `'ordena tarjeta, mapa, distancia, CTA y ack'` sigue si el espaciador no lleva `testID` |
| D15 | Error de acción | — | `alert-detail-action-error` `text-danger` tras el ack | Sin cambio; queda bajo el primario anclado (o encima, P-Q10) | — |
| D16 | Entrada | héroe `rise` 0 ms, mapa `rise` 80 ms, ping infinito | sin animación | `HomeEntrance` índices 0 (héroe) y 1 (mapa); ver A16 | Nuevo |
| D17 | Carga / error | — | `Skeleton testID="alert-detail-loading" className="h-44 w-full rounded-card"`; `alert-detail-error` + `alert-detail-retry` | Esqueleto al radio del héroe (`rounded-hero` si #173) y alto del héroe (~`h-60`, no medido); resto sin cambio | `alert-detail/index.test.tsx` · `#100 R4` `'h-44 w-full rounded-card'` |
| D18 | Leída / resuelta | no dibujado | misma tarjeta sin borde, píldora gris, sin ack | Héroe con fondo neutro o rosa atenuado y sin ping (P-Q10) | `#170 R6` variante cerrada |
| D19 | Batería | no dibujado | mismo layout, `BatteryLow`, `bg-warning-soft`, sin mapa (payload sin `position`) | Héroe ámbar (`CATEGORY_SLOTS.amber`), círculo `bg-warning-strong`; sin mapa ni CTA de distancia (P-Q9) | `#170 R6` fila `battery_low` |
| D20 | Oscuro | `.pt.dark` | `@variant dark` | §3; `--rose` oscuro `#39131A` = `category-rose` oscuro | — |

## §3 Mapeo de tokens claro/oscuro

Fuente app: `src/theme/global.css` (bloques `@theme`, raíz clara y `@variant dark`) y
`node_modules/heroui-native/…/theme.css` 1.0.8 (`--color-danger-soft: color-mix(in oklab, var(--danger) 15%, transparent)`).
Fuente canvas: `:root` y `.pt.dark` de los dos artboards (idénticos entre sí).

| # | Canvas | Claro canvas / app | Oscuro canvas / app | Clase o vía en la app | Estado |
|---|---|---|---|---|---|
| T1 | `--danger` | `#D92D20` / `#EF4444` | `#F87171` / `#F87171` | `bg-danger`, `border-danger`, `text-danger`, `useThemeColors(['danger'])` | **Difiere en claro.** Cambiarlo es global (errores, contador, borrar…): P-Q6 |
| T2 | `--warning` (ámbar de severidad) | `#B54708` / `--warning-strong` `#92610A` (`--warning` `#F59E0B`) | `#FBBF24` / `#FBBF24` | `border-warning-strong`, tinta `warning-strong` en `alert-meta.ts` | **Difiere en claro.** Global (salud, recordatorios): P-Q6. #61 R5 prohíbe `text-warning` suelto: seguir con `-strong` |
| T3 | `--rose` | `#FFF0F3` / `category-rose` `#FFF0F3` | `#39131A` / `#39131A` | `CATEGORY_SLOTS.rose.surface` | Coincide. Hoy se usa `bg-danger-soft` (mezcla 15 %), otro color |
| T4 | `--rose-s` | `#D80B34` / `category-rose-strong` `#D80B34` | `#E35E78` / `#E35E78` | `CATEGORY_SLOTS.rose.ink` o `useThemeColors(['category-rose-strong'])` | Coincide |
| T5 | `--amber` | `#FFF7ED` / `category-amber` `#FFF7ED` | `#271E14` / `#271E14` | `CATEGORY_SLOTS.amber.surface` | Coincide. Hoy `bg-warning-soft` |
| T6 | `--amber-s` | `#A55E07` / `category-amber-strong` `#A55E07` | `#C17B22` / `#C17B22` | `CATEGORY_SLOTS.amber.ink` | Coincide. El artboard no lo usa en ningún nodo visible (la tinta ámbar es `--warning`) |
| T7 | `--green` / `--green-s` | `#F0FBF6` / `#107148` = `category-green` / `-strong` | `#12231B` / `#2AB87C` = app | `CATEGORY_SLOTS.green` | Coincide |
| T8 | `--default` | `#F5F6F8` / `#F5F6F8` | `#1F242B` / `#1F242B` | `bg-default` | Coincide |
| T9 | `--muted` | `#667085` / `#667085` | `#9CA3AF` / `#9CA3AF` | `text-muted` | Coincide |
| T10 | `--border` | `rgba(13,17,23,0.08)` / `0.07` | `rgba(255,255,255,0.08)` / `0.08` | `border-border` | Diferencia de 1 punto en claro; despreciable, no tocar (global) |
| T11 | `--lip-gray` | `#E4E7EC` / `#E4E7EC` | `#0A0D12` / `#0A0D12` | `border-lip-gray` (`--color-lip-gray`) | Coincide |
| T12 | `--lip` (labio del primario) | `#0E5E3C` / sin token | `#0B4D31` / sin token | `border-black/25` sobre `bg-accent` (carta §13) | Aproximación decidida por #166; no se propone token nuevo |
| T13 | `--accent` | `#178255` / `#178255` | `#178255` (el canvas no lo redefine) / `#178255` | `bg-accent` | Coincide |
| T14 | `--glass` | `rgba(255,255,255,0.86)` + blur 12 / `--glass-surface` `0.60`, sin blur | `rgba(22,27,34,0.86)` / `0.60` | `bg-glass-surface` (solo `src/components/floating-tab-bar.tsx`) | **Difiere** opacidad y blur. Subir el token afecta a la barra flotante: P-Q11 |
| T15 | peso 800 | — | — | `font-extrabold` (`--font-extrabold` Inter-ExtraBold) **no existe** (`grep -l font-extrabold` → 0); lo propone #173 R1 | Depende de #173; si no, `font-black` (900) o `font-bold` (700) |
| T16 | peso 900 | — | — | `font-black` (Inter-Black, existe) | Coincide |
| T17 | radio 28 | — | — | `rounded-hero` de #173 R2 (`grep -l rounded-hero` → 0 hoy) | Depende de #173 |
| T18 | radio 24 (mapa) | — | — | sin token; `rounded-3xl` fuera de carta §12 | P-Q7 |
| T19 | radio 20 (fila) | — | — | `rounded-card` | Coincide |
| T20 | radios 16 / 10 (botones) | — | — | `rounded-xl` (12) único radio de control (carta §12, #62 R1) | P-Q8 |
| T21 | alto 210 | — | — | `h-52.5` (`grep -l 'h-52\.5'` → 0, nuevo pero sin corchete, C8 intacto) | — |
| T22 | tamaños 13/15/22/26 px | — | — | escala Tailwind: 12 `text-xs`, 14 `text-sm`, 16 `text-base`, 24 `text-2xl`, 30 `text-3xl`; `text-[15px]` vetado por C8 (`design-drift.test.ts`, también en tests colocados) | P-Q4 |
| T23 | movimiento | `rise` 400 ms / 14 px / paso 70; `pop` 500 ms escala .6→1.08→1; `ping` 1.8 s | — | `MOTION_SURFACE_MS 400`, `MOTION_ENTRANCE_OFFSET_Y 12`, `MOTION_STAGGER_MS 60`, `MOTION_POP_SPRING {duration 400, dampingRatio 0.6}` (#167 R2), `MOTION_PING_FROM 0.55`, `MOTION_PING_TO_SCALE 1.5`, `MOTION_PING_TIMING` 2400 ms | Reutilizar tokens; no crear nuevos salvo decisión (P-Q12) |

## §4 Candados a revertir o mover

Medidas sobre `788d1f89` (+ commit del leader, sin cambios de código), desde `mobile-pet-tracker/`, con
`P=$(find src -name '*.ts*' ! -name '*.test.*' ! -path '*__tests__*')` (equivalente a `sourceFiles()` de los candados):

| Medida | Comando | Salida |
|---|---|---|
| M1 primarios | `grep -oP 'rounded-xl bg-accent(?=[\s'"'"'"\x60])' $P \| wc -l` | `19` |
| M2 labio primario | `grep -oP '\bborder-b-4\b' $P \| wc -l` · `grep -oF 'border-black/25' $P \| wc -l` | `19` · `19` |
| M3 secundario neutro | `grep -oF 'border-lip-gray' $P \| wc -l` · `grep -oP '\bborder-b-6\b' $P \| wc -l` | `5` · `5` |
| M4 esquina continua | `grep -oF 'style={CONTINUOUS_CORNER}' $P \| wc -l` | `37` |
| M5 cifras tabulares | `grep -oF 'style={TABULAR_NUMS}' $P \| wc -l` | `34` |
| M6 radio héroe | `grep -l 'rounded-hero' $P \| wc -l` | `0` |
| M7 peso 800 | `grep -l 'font-extrabold' $P \| wc -l` | `0` |
| M8 animaciones en tests de alertas | `grep -c toHaveAnimatedStyle src/screens/alerts/index.test.tsx` · `… alert-detail/index.test.tsx` | `0` · `0` |
| M9 casos de test | `grep -cE '^\s*(it\|test)\(' src/screens/alerts/index.test.tsx` · `… alert-detail/index.test.tsx` | `51` · `30` (sin contar filas de `it.each`) |
| M10 claves de catálogo | `grep -cE "^\s+'[a-zA-Z]+\.[a-zA-Z.]+':" src/i18n/catalog.ts` | `768` |
| M11 `PingRing` | `grep -rn 'function PingRing' src \| wc -l` | `1` (local en `screens/welcome/index.tsx`) |
| M12 `MOTION_PING_` | `grep -rlF 'MOTION_PING_' src` | `motion.ts`, `motion.test.ts`, `welcome/index.tsx`, `welcome/index.test.tsx` |
| M13 clases categóricas | `grep -lE 'bg-category-\|text-category-' $P` | solo `src/utils/category-palette.ts` (los usos en home/health/profile son nombres de token para `useThemeColors`, no clases) |
| M14 `bg-glass-surface` | `grep -l 'bg-glass-surface' $P` | `src/components/floating-tab-bar.tsx` |

### 4.1 Candados en los tests de pantalla (se reescriben dentro de #174)

Todos son literales exactos que el artboard cambia; la directiva humana autoriza revertirlos. Se nombran por título grepeable.

Alertas (`src/screens/alerts/index.test.tsx`):
- `#114 R6` · `'respeta las dimensiones bajo cabecera nativa, el inset automático y los safe areas (#114 R6)'` (A1).
- `#114 R5` · `describe('#114 R5: el título vive en la cabecera nativa'` (solo con la opción pesada de cabecera, A2).
- `#170 R4` · `'pinta el contador como hermano anterior de la lista con su anatomía'` (A4).
- `#170 R3` · `toBe('text-xs font-bold uppercase text-muted')` y `toBe('gap-4')` (A5).
- `#78 R6` · literales de icono, tipo, mascota, hora, columna `min-h-11 min-w-0 flex-1 gap-1` y píldora `rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted` (A8–A14).
- `'alterna el tercer hijo entre ack y la píldora traducida'` (A12–A14: el ack cambia de variante).
- `#170 R5` · bordes por tipo: sobreviven (no cambian clases de borde).
- `#78 R4` · esqueletos `h-20 w-full rounded-card`: sobreviven salvo decisión.

Detalle (`src/screens/alert-detail/index.test.tsx`):
- `#100 R3` · `toBe('flex-row items-center gap-3')`, `'text-lg font-bold text-foreground'`, `'text-sm font-semibold text-muted'`, orden `elementChild(card, 1..3)` (D4, D7, D8).
- `'formatea la apertura en $language con el locale del idioma'` · regex `/^Detectada el 31\/12\/2026,/` y `/^Detected 1\/2\/2027,/` (D9).
- `'respeta las métricas A11 bajo cabecera nativa'` · `padding 24 / gap 16` y `'rounded-card bg-surface p-4 shadow-sm min-h-44 gap-3 border-2 border-danger'` (D1, D3).
- `#170 R6` · literal de tarjeta por tipo y variante cerrada (D3, D18, D19).
- `#100 R4` · `'h-44 w-full rounded-card'` (D17).
- `#170 R8` · `toBe('h-52 overflow-hidden rounded-card')` (D10).
- `#170 R10` · `'pinta la distancia bajo el mapa'` y `toBe('text-sm font-semibold text-foreground')` (D12).
- `#170 R15` · `'ordena tarjeta, mapa, distancia, CTA y ack'` (D12: la distancia pasa a ser descendiente del mapa; `within(child).queryByTestId` da el mismo índice a ambos).
- `#170 R9` · `'ningún ancestro del mapa declara fondo'`: sobrevive (el héroe no es ancestro del mapa).

### 4.2 Candados agregados (cambian de cifra o de lista)

| Candado (fichero · ancla) | Hoy | Tras #174 (sin #173) | Motivo |
|---|---|---|---|
| `consistency-classnames.test.ts` · `#62 R1` `toHaveLength(13+1+1+1+1+1+1)` | 19 | 20 | D14 primario con labio |
| `consistency-classnames.test.ts` · `#166 R2` mapa `expected` (`'inventaría los diecinueve primarios con labio, fichero a fichero'`) | sin fila alert-detail | `[join('screens', 'alert-detail', 'index.tsx')]: 1` y título «veinte» | D14 |
| `consistency-classnames.test.ts` · `#166 R2` `expect(count(/\bborder-b-4\b/g)).toBe(19)` y `border-black\/25` | 19 / 19 | 20 / 20 | D14 |
| `consistency-classnames.test.ts` · `#166 R3` `rows` + inventario `toEqual([… 'alert-detail-view-map', …])` + `toBe(4 + 1)` ×2 | 5 filas / 5 / 5 | +1 fila (fichero alerts) / 6 / 6 | A12. **Trampa**: `tag.match(/testID="([^"]+)"/)?.[1]` da `undefined` con `testID={\`${rowId}-ack\`}`; y `openingTagWithTestId(readSource(path), testId)` busca el literal. El spec_author debe prescribir cómo inventariar un `testID` de plantilla (p. ej. ancla `${rowId}-ack` o regex de plantilla) |
| `consistency-classnames.test.ts` · `#62 R14` / `#98 R10` `style={CONTINUOUS_CORNER}` `toBe(31 + 1 + 4 + 1)` | 37 | 37 si se conserva el `View` del mapa; +1 si el héroe lleva `CONTINUOUS_CORNER` propio (`Card` ya lo aplica, no suma) | D3, D10 |
| `consistency-classnames.test.ts` · `#62 R15` / `#69 R10` `TABULAR_NUMS` (filas `// #170 R16`) | alerts 1, detail 1 | igual si la píldora sigue en `alerts/index.tsx`; si va a `_layout.tsx` (`headerRight`) cambia de fichero | A4, D12 |
| `consistency-classnames.test.ts` · `#64 R9` `'centraliza las diez clases completas y prohíbe interpolarlas'` | 10 clases, 1 fichero | igual si se usa `CATEGORY_SLOTS` | A8, A13, D3, D8 |
| `ui-copy-table.ts` · `R13_ALERT_DETAIL` + `ui-language.test.ts` `toHaveLength(11 - 3 + 2); // #170 R16` | 10 | +1 por clave nueva (D11) | §6 |
| `ui-copy-table.ts` · `R12_ALERTS` (`// #170 R16`) | — | +1 si se crea clave de subtítulo (A11) | §6 |
| `language-provider.test.tsx` · `expect(englishKeys).toHaveLength(260 + 16 + …)` | 768 claves (M10) | +N claves nuevas | §6 |
| `ui-language.test.ts` · `#78 R3` (claves en `specs/mobile-ui-language/design.md`) | §2.26 última | nueva sección (§7: §2.28 previsto) | §6 |
| `tab-headers-canvas.test.ts` · `it('limita el literal a los tres ficheros de producción'` (`TAB_TITLE_168`) | 3 ficheros | +2 solo si se reutiliza el literal en cabecera propia | A2, D2 |
| `design-drift.test.ts` · C8 corchetes (incluye tests colocados) | 0 | 0: no usar `h-[210px]`, `text-[15px]`, `rounded-[28px]` ni en tests | todo |
| `design-drift.test.ts` · `#134 R6/R7` (sin `queryClient`/`invalidateQueries`/`setQueryData`/`alertKeys` en pantallas de alertas) | — | sin cambio: nada de lo propuesto toca datos | — |
| `legibility-classnames.test.ts` · `#61 R4` `filesMatching(/text-accent(?![-\w])/)` → `[]`; `#61 R5` sin `text-warning` suelto | — | sin cambio si no se usa `text-accent` ni `text-warning` | T2 |
| Carta `docs/ui-guidelines.md` §13 «**Sin labio**: … (reintentos, confirmar alerta)» | — | quitar «confirmar alerta» (`#166 R4` solo asevera `'**Sin labio**'`, no la lista: no se rompe) | A12, D14 |
| Carta §12 escala de radios + `#62 R1` (texto de §12) | 3 radios | sin cambio si se usa `rounded-hero` de #173 (que ya enmienda §12, R14); con radio 24 propio, enmienda | D3, D10 |

### 4.3 Candados que deben seguir verdes sin tocarse

- `src/screens/welcome/index.test.tsx` (`welcome-ring-${index}`, `MOTION_PING_*`) si se extrae `PingRing`.
- `src/theme/__tests__/motion.test.ts` (valores de `MOTION_*`) si no se crean tokens nuevos.
- `src/app/(tabs)/__tests__/alerts.test.tsx` (#78 R5), `src/app/__tests__/detail-stack.test.tsx` (#114 R1, #100 R2),
  `alert-detail.navigation.test.tsx` (#100 R8), `reminders-alerts-stack.navigation.test.tsx` (#114 R2):
  rutas delgadas y navegación; solo cambian si se toca `_layout.tsx` (opción pesada de cabecera). En specs y
  handoffs, escapar `\(tabs\)` en rutas de jest (memoria «Jest y paths con paréntesis»).
- `src/components/__tests__/empty-state.test.tsx`.

## §5 Datos / backend

Conclusión: **#174 no necesita backend ni cambios de API.** Todo lo que pinta el artboard ya llega en `Alert`.

- Tipo cliente `src/api/types.ts` · `interface Alert` (`id`, `petId`, `petName`, `type`, `status: string`,
  `geofenceId: string | null`, `payload: Record<string, unknown>`, `openedAt`, `ackedAt`, `closedAt`).
- Estados (backend `backend-pet-tracker/src/modules/alerts/domain/entities/alert-event.entity.ts` ·
  `export type AlertStatus = 'open' | 'acked' | 'closed';`):
  - `open` = «Sin leer» (borde de severidad, botón «Marcar leída»).
  - `acked` = «Leída» (`ack-alert.use-case.ts`: `open` + ack → `acked`, 200; `closed` + ack → 409).
  - `closed` = «Resuelta»: lo escribe el motor (`workers/alerts-engine/alerts-engine.drizzle.store.ts` ·
    `.set({ status: 'closed', closedAt: input.closedAt })`) cuando la condición se resuelve. El chip verde del canvas
    encaja con este significado.
- Hora del héroe: `openedAt` («Detectada el …»). La fila usa `fmtOpenedAt` (`alerts.justNow/minutesAgo/hoursAgo/daysAgo`).
- `payload` por tipo (`workers/alerts-engine/alerts-engine-consumer.service.ts`):
  - geocerca: `payload: { position, geofenceName: geofence.name }`. El nombre de zona para la etiqueta a11y del
    mapa (D11) y para la píldora (D12) puede salir de `payload.geofenceName` sin esperar a `listGeofences`; hoy la
    distancia usa `zone.name` de la consulta `geofenceKeys.list(alert.petId)` (necesaria igualmente para centro y radio).
  - batería: `payload: { batteryPct: detail.batteryPct }`; sin `position`, luego sin mapa (D19). El artboard no
    dibuja el detalle de batería; `batteryPct` no se pinta hoy (fuera de alcance salvo P-Q9).
- Contador «N nuevas»: hoy cuenta filas `open` cargadas en el cliente (ancla `alerts-new-count`); el artboard no
  cambia la semántica.
- «Aviso» (`typeUnknown`): no existe en backend; fuera de alcance (directiva del leader y #170 §Fuera de alcance).
- Paginación: `FlatList` con páginas por cursor (`nextCursor`); afecta a la entrada escalonada (R-1 en §8).

## §6 Copy

El i18n no tiene plurales (`grep -n "_one\|_other\|plural" src/i18n/*.ts` → sin salida); las claves con número usan
abreviatura invariante. Catálogo en `src/i18n/catalog.ts`, 768 claves (M10).

### 6.1 Cadenas del artboard que ya existen (sin cambio)

| Texto canvas | Clave | es | en |
|---|---|---|---|
| Alertas | `alerts.title` | Alertas | (existe) |
| 2 nuevas | `alerts.newMany` / `alerts.newOne` | `{{count}} nuevas` / `1 nueva` | (existe) |
| Hoy / Esta semana | `alerts.sectionToday` / `alerts.sectionThisWeek` | Hoy / Esta semana | (existe) |
| Salió de la zona / Batería baja | `alerts.typeGeofenceExit` / `alerts.typeBatteryLow` | — | — |
| Marcar leída | `alerts.ack` | Marcar leída | Mark as read |
| Resuelta / Leída / Sin leer | `alerts.statusClosed` / `alerts.statusAcked` / `alerts.statusOpen` | — | Unread (open) |
| Hace 5 min / Hace 2 h | `alerts.minutesAgo` / `alerts.hoursAgo` | `Hace {{minutes}} min` / `Hace {{hours}} h` | `{{minutes}} min ago` |
| Alerta | `alerts.detailTitle` | Alerta | — |
| Detectada el … | `alerts.openedAt` | `Detectada el {{date}}` | `Detected {{date}}` |
| A 85 m de Casa | `alerts.distanceFromZone` | `A {{distance}} de {{zone}}` | `{{distance}} from {{zone}}` |
| Ver en el mapa | `alerts.viewOnMap` | Ver en el mapa | View on map |

### 6.2 Diferencias y cadenas nuevas (no aprobadas; propuesta con voz de Pingo, carta §7)

| # | Canvas | Hoy | Propuesta | Candados |
|---|---|---|---|---|
| C1 | «Hace 3 días» | `alerts.daysAgo` = `Hace {{days}} d` / `{{days}} d ago` | Opción a: dejar «d» (invariante, sin plurales). Opción b: `Hace {{days}} días` + clave singular `alerts.dayAgo` = `Hace 1 día` / `1 day ago` (sin plurales hay que ramificar en `fmtOpenedAt`) | `language-provider.test.tsx` · `['alerts.daysAgo', '{{days}} d ago', 'Hace {{days}} d']`; con b: `+1` en longitud, fila en `R12_ALERTS` |
| C2 | «Rocky · Hace 5 min» en una línea | dos `Text` (`${rowId}-pet`, `${rowId}-time`) sin clave común | Opción a: sin clave nueva, `Text` padre con dos `Text` hijos y un « · » literal entre ellos (precedente de separador en valor: `reminders.dueInDays: '· en {{days}} días'`). Opción b: clave `alerts.rowMeta` = `{{pet}} · {{time}}` / `{{pet}} · {{time}}` | Opción b: `R12_ALERTS` +1, longitud +1, sección nueva en `specs/mobile-ui-language/design.md` (`#78 R3`). Opción a: el escáner `wholeLiterals` de `ui-language.test.ts` compara por **igualdad** con valores fijos del catálogo (`'no deja ningún valor fijo del catálogo como literal entero en las pantallas'`); «·» no es valor de ninguna clave, así que no choca |
| C3 | `aria-label` «Ubicación al salir de la zona Casa» | sin etiqueta | Clave `alerts.mapLabel` = `Ubicación al salir de la zona {{zone}}` / `Location when leaving {{zone}}` (la voz de Pingo no aplica a etiquetas de lector de pantalla: descriptiva y neutra) | `R13_ALERT_DETAIL` `toHaveLength(11 - 3 + 2)` → `+1`; `language-provider` longitud `+1`; `SCREEN_FILES` sin cambio (fichero ya registrado) |
| C4 | Fecha «6 oct 2026, 16:42» | `toLocaleString(locale)` | Sin clave nueva; cambia el formateo (D9) | regex de `'formatea la apertura en $language…'` |
| C5 | — (botón atrás accesible) | back nativo | Solo con cabecera propia: no existe `common.back` (`grep -c "'common.back'" src/i18n/catalog.ts` → 0); clave nueva `common.back` = `Volver` / `Back`. **#172 R2 la crea** (`accessibilityLabel={t('common.back')}` en `BackButton`, §7): reutilizarla, no duplicarla | ninguno propio si #172 mergea antes |

## §7 Solapes con #171 / #172 / #173

### #173 `mobile-tab-screens-canvas-fidelity` (spec **sin firmar**, `status: draft`)

Verificado con `git show origin/feature/173-mobile-tab-screens-canvas-fidelity:specs/mobile-tab-screens-canvas-fidelity/requirements.md`:
- **R1** `assets/fonts/Inter-ExtraBold.ttf` + `useFonts` en `src/app/_layout.tsx` + `--font-extrabold: 'Inter-ExtraBold';`
  en `@theme` (medida M31 `grep -cF -- "--font-extrabold: 'Inter-ExtraBold';" src/theme/global.css` 0→1).
- **R2** `--radius-hero: 28px`, `--radius-tile: 18px`. **R2.2** uso solo donde la spec indica; el candado de
  `profile-canvas-fidelity.test.ts` compara la lista de ficheros que casan `/\brounded-hero\b/` y `/\brounded-tile\b/`
  (hoy: `components/card.tsx` + `screens/profile/index.tsx`; `rounded-tile` solo Perfil).
- **R3** `Card` con variantes `hero` (`'rounded-hero bg-surface-secondary p-4.5'`) y `flat`
  (`'rounded-card border border-border bg-surface px-3.5 py-1'`), sin sombra. **R3.3** `variant="hero"` exactamente 1
  y `variant="flat"` exactamente 2, todo en Perfil.
- **R12** `HomeEntrance` en Perfil (precedente de reutilizarla fuera de Home, como A16/D16).
- **R14** enmienda la carta §12 (cinco radios) y §13 «Sin labio» (añade tonales); `#166 R2` pasa de 19 a 18 primarios.

Mapa de reutilización (cada candidato con el candado de #173 que movería):

| Pieza de #173 | Uso en #174 | Candado de #173 que se mueve |
|---|---|---|
| `font-extrabold` (R1) | A4, A5, A10, A13, D6, botones 800 | Ninguno conocido: R1 mide el token en `global.css`, no inventaría usos (no verificado que no haya un candado de uso en `profile-canvas-fidelity.test.ts`) |
| `rounded-hero` (R2) | D3 héroe, D17 esqueleto | **R2.2**: la lista de ficheros añade `screens/alert-detail/index.tsx` (si el esqueleto o el héroe nombran la clase; con `variant="hero"` solo la nombra `card.tsx` y la lista no cambia) |
| `variant="hero"` (R3) | D3 | **R3.3**: `variant="hero"` 1→2 y deja de ser «solo Perfil»; además hay que pisar `bg-surface-secondary` por `CATEGORY_SLOTS.rose.surface` vía `twMerge` |
| `variant="flat"` (R3) | A6 fila | **R3.3**: `variant="flat"` 2→3 (una ocurrencia de fuente en `renderItem`); pisar `py-1` |
| `HomeEntrance` (R12) | A16, D16 | Ninguno (no hay candado de exclusividad conocido) |
| Carta §12/§13 (R14) | D10 radio, A12/D14 «Sin labio» | Edición del mismo párrafo de `docs/ui-guidelines.md`: conflicto textual si se ramifica en paralelo |
| `#166 R2` 19→18 | D14 | Cifra final: 18+1 = 19 si #173 mergea antes; 19+1 = 20 si #174 antes (y #173 rebasa a 19) |

**Depende de la firma de #173** (P-Q17): si sus tokens cambian o se rechazan, D3/D6/D7/A10 vuelven a `rounded-card`
/ `font-black` / `font-bold`.

### #172 `mobile-account-screens-polish` (`status: spec_ready`, solo spec en la branch)

- **R2 `BackButton`** en `src/components/back-button.tsx` (props `testID`, `fallback: Href`; `Pressable`
  `size-11 items-center justify-center rounded-full`, `ChevronLeft size={24}` en `foreground`,
  `accessibilityLabel={t('common.back')}`, `router.back()` o `router.replace(fallback)`). Es exactamente el chevron
  44/24 del artboard: si se elige la cabecera propia (P-Q1, opción pesada), reutilizar `BackButton` en vez de
  `ChevronLeft` suelto, y #174 pasa a depender del merge de #172.
- Su B16 mide la última sección de `specs/mobile-ui-language/design.md` en `§2.26` (#170): misma base que #174.
- No toca ficheros de alertas (`git diff --name-only origin/main...origin/feature/172-mobile-account-screens-polish`
  → solo `feature_list.json` y `specs/mobile-account-screens-polish/*`).

### #171 (branch desfasada, merge-base `d2b8b0ae`)

- Reintroduce `MOTION_POP_SPRING` con `dampingRatio 0.5` en `src/theme/motion.ts`; main tiene `0.6` (#167 R2):
  conflicto al mergear, ajeno a #174 pero en el fichero cuyos tokens reutiliza #174 (A4, D5).
- Añade `MOTION_POP_SCALE = 0.6` (el `pop` del contador del artboard parte de `.6`: reutilizable en A4 si llega antes;
  `PopIn` de main parte de `MOTION_ENTRANCE_SCALE 0.9`).
- Añade `CONFETTI_FILLS` en `src/utils/category-palette.ts`: #174 no necesita tocar ese fichero si usa `CATEGORY_SLOTS`.
- Añade flotación a `EmptyState` (`src/components/empty-state.tsx`): el vacío de Alertas (A19) la hereda; ningún
  candado de #174 la contradice (no verificado si #171 exige un `testID` `alerts-empty-float` en el test de Alertas).
- Toca `catalog.ts` y `language-provider.test.tsx` (longitud): conflicto en la línea de la suma; la cifra final de
  #174 es base al arrancar + delta (memoria «Constantes congeladas en specs»).
- Sección de `specs/mobile-ui-language/design.md`: #171 tomará `§2.27` según el leader; #174 tomaría `§2.28`
  «la siguiente libre en el momento del handoff».

## §8 Preguntas abiertas para el humano

La directiva («el diseño final debe de quedar como el artifac») cierra el *qué*; estas preguntas son sobre el *cómo*
cuando el artboard choca con la carta, con tokens globales o con copy no aprobada. Entre corchetes, la opción que el
explorer ve más barata; **no es decisión**.

- **P-Q1 Cabecera.** ¿Título 26/900 con la cabecera nativa ajustada por ruta (`headerTitleStyle` Inter-Black 26,
  `headerTitleAlign: 'left'`, píldora en `headerRight`) o cabecera propia en pantalla (`headerShown: false` +
  `BackButton` de #172 + título)? La nativa no admite `letterSpacing -0.02em` ni el `pop` dentro de `headerRight` está
  probado (no verificado). [nativa ajustada: conserva #114 R5/R6 y el gesto atrás]. Aplica a Alertas y Detalle a la vez.
- **P-Q2 Márgenes.** El artboard usa 20 px laterales y gap 12/14; toda la app usa 24/16 (`docs/conventions.md`,
  patrón Home, memoria «Dimensiones uniformes»). ¿Se rompe la uniformidad solo en alertas? [sí, por la directiva;
  o pedir que el artboard pase a 24].
- **P-Q3 Sección «Anteriores».** No sale en el artboard; #170 R3 la creó. ¿Se conserva? [sí: sin ella las alertas de
  más de 7 días quedan sin cabecera].
- **P-Q4 Tamaños de letra fuera de escala.** 13, 15, 22 y 26 px no existen en la escala sin corchetes (C8 los veta).
  ¿Redondear (13→12 `text-xs`, 15→16 `text-base` o 14, 22→24 `text-2xl`, 26→30 `text-3xl` o 24) o añadir tokens
  `--text-*` en `@theme` (precedente `--text-2xs`)? [tokens si se quiere el píxel exacto; redondeo si no].
- **P-Q5 Iconos.** El artboard dibuja un pin con guion y una batería propios; la app usa `LocationSlash` / `BatteryLow`
  de reicon. ¿Valen los de reicon? [sí].
- **P-Q6 Rojo y ámbar de severidad.** `--danger` claro `#D92D20` frente a `#EF4444`, y `--warning` `#B54708` frente a
  `--warning-strong` `#92610A`. Cambiarlos es global (toda la app). ¿Se cambian, en otra feature, o se acepta la
  diferencia? [aceptar en #174; abrir feature de tokens si se quiere].
- **P-Q7 Radios 24 y 28.** Mapa a 24 px no está en la escala; héroe a 28 px es `rounded-hero` de #173. ¿Mapa a
  `rounded-card` (20) o `rounded-hero` (28)? Si #173 no firma, ¿héroe a `rounded-card`? [mapa `rounded-card`].
- **P-Q8 Botones.** Radios 16 (CTA, primario) y 10 (ack de fila) y alto 34 del ack de fila frente al radio único
  `rounded-xl` de la carta §12 / #62 R1 y al mínimo táctil 44. [radio `rounded-xl`; ack de fila con alto visual 34 +
  `TOUCH_SLOP`, o `min-h-11`].
- **P-Q9 Detalle de batería.** No dibujado. ¿Héroe ámbar (`CATEGORY_SLOTS.amber`, círculo `warning-strong`) sin mapa?
  ¿Se pinta `batteryPct` del payload? [ámbar sin mapa, sin `batteryPct`].
- **P-Q10 Detalle leída/resuelta.** No dibujado. ¿Héroe rosa sin ping y chip gris/verde, o héroe neutro? ¿Dónde va
  `alert-detail-action-error` respecto al primario anclado? [rosa sin ping; error encima del primario].
- **P-Q11 Cristal.** `--glass` 0.86 + blur 12 frente a `--glass-surface` 0.60 sin blur (lo usa la barra flotante).
  ¿Token nuevo, subir el existente (cambia la barra) o aceptar 0.60? ¿Se admite `expo-blur`? [aceptar 0.60, sin blur].
- **P-Q12 Ritmo del movimiento.** `ping` 1.8 s frente a `MOTION_PING_TIMING` 2400 ms; paso 70 ms frente a
  `MOTION_STAGGER_MS` 60; desplazamiento 14 frente a 12. ¿Tokens existentes o nuevos? [existentes].
- **P-Q13 Carta §13.** «Sin labio … (reintentos, confirmar alerta)» se contradice con el artboard (ack con labio en
  fila y en detalle). ¿Se enmienda la carta quitando «confirmar alerta»? [sí; `#166 R4` no se rompe].
- **P-Q14 Línea «Rocky · Hace 5 min».** ¿Composición sin clave nueva (dos `Text` y « · ») o clave
  `alerts.rowMeta` = `{{pet}} · {{time}}`? [composición].
- **P-Q15 «Hace 3 días».** El i18n no tiene plurales. ¿Mantener «Hace 3 d» o añadir `alerts.dayAgo` («Hace 1 día» /
  «1 day ago») y cambiar `alerts.daysAgo` a «Hace {{days}} días» / «{{days}} days ago»? [cambiar: es el texto del
  artboard; dos claves].
- **P-Q16 Etiqueta del mapa.** Copy nueva no aprobada: `alerts.mapLabel` = «Ubicación al salir de la zona {{zone}}» /
  «Location when leaving {{zone}}». ¿Se aprueba? (literal del artboard en es; en, propuesta).
- **P-Q17 Depende de la firma de #173.** `font-extrabold`, `rounded-hero` y `Card variant="hero"/"flat"` son
  propuestas de una spec en borrador. ¿#174 espera a que #173 mergee (y reutiliza, moviendo R2.2/R3.3), o #174 no
  reutiliza y usa `font-black` / `rounded-card`? Lo mismo con `BackButton` de #172 si P-Q1 elige cabecera propia.
  [esperar a #173; sin #172 con la cabecera nativa].
- **P-Q18 Sombra de la fila.** El artboard no tiene sombra en filas (solo borde). ¿Se quita `shadow-sm` de la fila
  (y del héroe, que tampoco la lleva)? [sí].
- **P-Q19 Una o dos features.** Ver §9.

### Riesgos

- **R-1** Entrada escalonada en `FlatList` paginada: `entering` se dispara también en filas de páginas siguientes y
  al reciclar; limitar el escalonado a los primeros N índices o solo a la primera carga (no verificado el
  comportamiento con `HomeEntrance` en listas; Home no es lista).
- **R-2** Ping infinito en el héroe: bucle `withRepeat` continuo en una pantalla de detalle; debe pararse con reduce
  motion y al dejar de estar `open` (tras «Marcar leída»).
- **R-3** Trampa del inventario `#166 R3` con `testID` de plantilla (A12, §4.2).
- **R-4** `#170 R15` (`within(child)`) con la distancia dentro del mapa: el test de orden se reescribe, no se ajusta.
- **R-5** Cifras agregadas (`#62 R1`, `#166 R2/R3`, longitud del catálogo, `R13_ALERT_DETAIL`) dependen del orden de
  merge con #171 y #173: la spec debe fijar «base medida en H0 + delta», no cifras absolutas.

## §9 Propuesta de partición (clusters R-id)

Propuesta, no decisión. Clusters por pantalla y por tipo de candado, en orden de dependencia.

| Cluster | Contenido (filas) | Candados que mueve | Depende de |
|---|---|---|---|
| **K0 Carta y tokens** | Enmienda §13 «Sin labio» (P-Q13); tokens de texto si P-Q4 elige tokens; nada de `--danger`/`--warning` (P-Q6 fuera) | `#166 R4` (no se rompe), `#62 R1` texto §12 solo si radio propio | — |
| **K1 Marco y cabecera** | A1, A2, A3, A4 (posición), D1, D2 | `#114 R6`, `#170 R4`, métricas A11 del detalle; `#114 R5` solo con cabecera propia | P-Q1, P-Q2 |
| **K2 Filas de Alertas** | A5, A6, A7, A8, A9, A10, A11, A13, A14 y la sombra de A6 (P-Q18) | `#78 R6`, `#170 R3`, tabla `surface` de `alert-meta` (compartida con el detalle) | #173 (`font-extrabold`, `variant="flat"`) o fallback |
| **K3 Ack de fila** | A12 | `#166 R3` (filas, inventario con `testID` de plantilla, `4 + 1` → `+1`) | K0 |
| **K4 Héroe del detalle** | D3, D4, D5 (sin animación), D6, D7, D8, D9, D17, D18, D19 | `#100 R3`, `#100 R4`, `#170 R6`, fecha `'formatea la apertura…'`; con #173, `R2.2`/`R3.3` | #173 (`rounded-hero`, `variant="hero"`) |
| **K5 Mapa y acciones del detalle** | D10, D11, D12, D13, D14, D15 | `#170 R8`, `#170 R10`, `#170 R15`, `#62 R1`, `#166 R2`, `R13_ALERT_DETAIL`, longitud de catálogo | K0, P-Q16 |
| **K6 Movimiento** | A4 `pop`, A16, D5 ping, D16 | ninguno existente (M8 = 0); nuevos `toHaveAnimatedStyle` con `shouldMatchAllProps` (memoria) | K1, K2, K4 |
| **K7 Copy** | C1, C2, C3 (§6) + sección `§2.28` de `specs/mobile-ui-language/design.md` | `R12_ALERTS`, `R13_ALERT_DETAIL`, `language-provider`, `#78 R3` | P-Q14, P-Q15, P-Q16 |

**¿Una o dos features?** El explorer ve dos opciones; decide el leader/humano (P-Q19):

- **Dos features** (preferida por tamaño): **#174a Alertas** = K0 + K1 (solo Alertas) + K2 + K3 + K6 (filas y `pop`) +
  K7 (C1, C2); **#174b Detalle** = K1 (solo Detalle) + K4 + K5 + K6 (héroe, mapa, ping) + K7 (C3). Razones: 40 filas
  de hueco y ~25 candados reescritos; las dos pantallas tienen ficheros de test separados; #174b depende de #173
  (`rounded-hero`, `variant="hero"`) y #174a apenas (solo `font-extrabold`/`flat`, con fallback). Coste: P-Q1 y
  `alert-meta.ts` se comparten; la decisión de cabecera y el cambio de `surface` del disco van en #174a y #174b los
  hereda (el test del detalle `['geofence_exit', 'LocationSlash', 'bg-danger-soft', …]` se rompe ya en #174a si el
  detalle sigue leyendo `meta.surface`: o #174a lo actualiza, o el detalle deja de usar `meta.surface` antes).
- **Una feature con dos bloques** (como #170, que llevó lista y detalle juntos): menos gates y un solo handoff,
  pero una cadena de Codex larga (memorias de #168/#171: paradas por cifras encadenadas) y bloqueada entera por la
  firma de #173.

