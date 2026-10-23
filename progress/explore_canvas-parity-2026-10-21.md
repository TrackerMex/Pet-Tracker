# explore: canvas-parity-2026-10-21
Fecha: 2026-10-21

Base: `main` = `origin/main` = `c0a35a68` (árbol limpio). Worktrees `Pet-Tracker-wt-189` y `Pet-Tracker-wt-194` leídos en solo lectura.
Fuente de diseño: los 24 artboards `*.dc.html` + `canvas.json` del canvas aprobado «Pet Tracker: propuesta de UI».
Sustituye a `progress/explore_canvas-parity-2026-10-16.md` (base `44acd74b`, obsoleto). Ese informe solo me sirvió de lista de huecos a re-verificar; **no heredo ninguno de sus veredictos**, en particular los «paridad» de Salud, Nutrición y Peso.

## 0. Criterio, método y correcciones al brief

**Criterio.** Directiva del humano (2026-10-13), confirmada hoy: la app debe quedar IGUAL al canvas. Toda diferencia visual o de movimiento es un **hueco** a cerrar; ninguna es «decisión del humano». Única excepción: el COPY (frases de Pingo, «[NOMBRE]», recomendaciones) sigue la Voz B del catálogo; comparo estructura, no literales. Lo que existe en la app y no en el canvas va en §5 «Sobrantes vs canvas», con la pregunta cerrada «se quitan o se quedan» (esa sí es del humano).

**Veredictos.**
- **paridad**: no medí ninguna diferencia propia de la pantalla.
- **parcial**: el esqueleto coincide y hay al menos una diferencia medida de valor, de elemento o de movimiento.
- **falta**: faltan o están compuestos de otra forma tres o más bloques estructurales del artboard.
- En las 17 pantallas de verificación rápida (§3) «sospecha» significa «parcial» medido solo en lo que se cita, sin análisis largo.

**Método.** Lectura del HTML de cada artboard contra el código de producción de `mobile-pet-tracker/src/`. Anclas por **contenido** (ruta + patrón literal; cuenta con `grep -c` cuando la medí), nunca por número de línea. Cada fila de las siete pantallas profundas lleva un identificador (`Z01`, `E01`, `W01`, `S01`, `M01`, `N01`, `I01`) para poder contarlas y citarlas.

**Correcciones al brief (el árbol manda).**
- El padding lateral del canvas no es uniforme de 20: Inicio y Bienvenida usan 16; InicioVacío y Celebración 24; Salud, Nutrición y Perfil 20 con arriba 60; NuevaContraseña arriba 100; el Mapa no tiene padding.
- El hero de Inicio no es una foto: es un **disco de 68** en una tarjeta `surface2` de radio 28. El resumen de Inicio no son «4 tiles sueltos»: es **una sección contenedora (radio 20, borde, sombra)** con 4 celdas de icono pastel 36/12, sin título ni separadores.
- Los CTA no son todos 56/16: ver §4d.
- Los avatares de Salud y Nutrición van **en la fila del título** (40 px), no debajo.
- Los inputs de Registro miden 50, no 56. El tile del Editor y los botones del Editor miden 54.
- Ya existe `components/back-button.tsx` (`BackButton`, `size-11`, `ChevronLeft size={24}`, `router.canGoBack() ? router.back() : router.replace(fallback)`): lo usan Login, Registro y Recuperar. Es la pieza reutilizable para el «volver en contenido» del canvas. No hace falta spike del gesto de volver en Android (el volver del sistema funciona con la cabecera oculta); solo el `margin-left: -10`.
- La spec firmada de #189 cubre más de lo que supuse al principio: píldora de título y pista de cristal sobre el mapa, hoja con agarradero, solapa de 26, métricas de la hoja, etiquetas y bloque de radio. Los huecos reales de #189 están en §2.1 y §2.2.

## 1. Resumen de los 24

Recuento: **paridad 4 / parcial 14 / falta 6** (suma 24). Las 7 pantallas que el humano dio por no conformes son 6 «falta» + Mapa «parcial».

| # | Artboard | Código | Veredicto | Profundidad | Dueño |
|---|---|---|---|---|---|
| 1 | Bienvenida | `screens/welcome` | parcial | rápida | C17 |
| 2 | Login | `screens/login` | parcial | rápida | C17 |
| 3 | Registro | `screens/register` | parcial | rápida | C17 |
| 4 | Recuperar | `screens/forgot` | parcial | rápida | C17 |
| 5 | NuevaContraseña | `screens/reset-password` | parcial | rápida | C17 |
| 6 | **Inicio** | `screens/home` + `components/pet-hero-header.tsx` | **falta** | profunda §2.7 | C12, C13, C14 |
| 7 | **Mapa** | `screens/map` + `components/pet-map.tsx` | **parcial** | profunda §2.5 | C15; marcador y ping en #192 |
| 8 | **Salud** | `screens/health` | **falta** | profunda §2.4 | C09 |
| 9 | **Nutrición** | `app/(tabs)/food.tsx` | **falta** | profunda §2.6 | C10, C11 |
| 10 | Perfil | `screens/profile` | parcial | rápida | C18 (+C02, C04) |
| 11 | Recordatorios | `screens/reminders` | parcial | rápida | C18 (+C03) |
| 12 | NuevoRecordatorio | `screens/add-reminder` | parcial | rápida | C03 |
| 13 | **Peso** | `screens/weight-log` + `components/weight-chart.tsx` | **falta** | profunda §2.3 | C08 (+C06) |
| 14 | HorarioComidas | `screens/meal-schedule` | parcial | rápida | C03 |
| 15 | HistorialComidas | `screens/meals-history` | paridad | rápida | — |
| 16 | Documentos | `screens/docs` | paridad | rápida | — |
| 17 | Alertas | `screens/alerts` | parcial | rápida | C03 (cuidado con #165) |
| 18 | DetalleAlerta | `screens/alert-detail` | parcial | rápida | C06 y C15 (props de mapa) |
| 19 | Vincular | `screens/pairing` | paridad | rápida | — |
| 20 | **Zonas** | `screens/geofences` | **falta** | profunda §2.1 | #189 + enmienda A-189 |
| 21 | **EditorZona** | `screens/geofence-editor` | **falta** | profunda §2.2 | #189 + enmienda A-189; breathe en #192 |
| 22 | NuevaMascota | `screens/add-pet` | parcial | rápida | C17 |
| 23 | InicioVacío | `components/empty-state.tsx` + ramas `no-pets` | paridad | rápida | — |
| 24 | Celebración | `components/celebration.tsx` | parcial | rápida | C02 |

Zonas y Editor son «falta» **hoy** porque la app actual no dibuja contador, barra, tile, hoja ni píldoras; #189 los cierra en lo estático y deja los huecos de §2.1 y §2.2.

## 2. Las siete pantallas, a fondo

Convención de la columna «acción»: `cubierto #189 R<n>` = ya está en la spec firmada; `hueco #189` = la spec lo omite o difiere (para una enmienda, no feature nueva); `C<nn>` = candidata de §7; `#192` = marcador/ping/breathe; `sobrante` = va a §5; `ok` = coincide.

### 2.1 Zonas seguras

Artboard `Zonas.dc.html` · app `screens/geofences/index.tsx` · spec `specs/mobile-geofences-canvas-fidelity` (wt-189) · tests `screens/geofences/index.test.tsx`, `app/__tests__/layout.test.tsx`.

| ID | Elemento | Artboard (valor exacto) | App hoy (ancla medida) | Acción |
|---|---|---|---|---|
| Z01 | Raíz | padding `56 20 40`, gap 12, columna | `contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}` | cubierto #189 R3 (`paddingHorizontal 20, paddingTop 24, paddingBottom insets.bottom+40, gap 12, flexGrow 1`). El 56 superior no es alcanzable bajo cabecera nativa: ver Z02 |
| Z02 | Cabecera | volver 44x44, `margin-left -10`, chevron 24 trazo 2.4; h1 26/900/-0.02em `flex:1`; contador «5/5» 14/800 muted; gap 8 | título nativo: `title: t('geofences.title')` en `app/_layout.tsx` (1 de 3); sin contador | título y contador: cubierto #189 R1.1-R1.3 (`text-26 font-black tracking-title`, `text-sm font-extrabold text-muted`, `gap-2`). **Hueco #189**: el volver sigue nativo (D2) y el contenido nunca arranca a 56. Reutilizar `BackButton` con C06 |
| Z03 | Barra de progreso | rejilla de 5 columnas, gap 4, segmentos alto 6 radio 3 `accent` | ausente | cubierto #189 R2 (`h-1.5 flex-1 rounded-full bg-accent`; vacío `bg-default`, D9) |
| Z04 | Fila | radio 20, `surface`, borde 1 `--border`, padding 12/14, gap 12, sin sombra | `Card` `flex-row items-center gap-3` (`p-4 shadow-sm`) | cubierto #189 R5.1 (`px-3.5 py-3 shadow-none`). El borde usa `--border` .07 vs canvas .08: C01 |
| Z05 | Tile | 44x44 radio 14, pastel por posición verde/azul/ámbar/violeta/rosa, icono con el color `-s` | sin tile | cubierto #189 R4 y R5.3 (`size-11 rounded-14`, `zoneCategory`) |
| Z06 | Icono del tile | 22 px, trazo 2.2: círculo r9 `stroke-dasharray 3 3` + círculo central r2.5 | (spec) `Map` fijo de reicon, justificado en D1 como «no existe como glifo verificado» | **Hueco #189**: dibujarlo con `react-native-svg` (ya instalado), exacto; o verificar un glifo reicon (existen `Target`, `Crosshairs`, `Radar*`, `Gps`, `Location*`, pero ninguno verificado como éste). Enmendar D1/R5.3 |
| Z07 | Textos | nombre 16/800; «Radio de N m» 12 muted; columna sin gap | hoy `font-bold` y `text-sm font-normal text-muted` | cubierto #189 R5.4 (`text-base font-extrabold`, `text-xs font-normal text-muted`) |
| Z08 | Interruptor | 48x28, pulgar círculo 22 blanco a 3 px, off = `--lip-gray`, on = `accent` | `<Switch` de heroui por defecto: raíz 48x24, pulgar 28x20 en pastilla, off = `default` (`heroui-native/src/styles/components/switch.css`) | **Hueco #189**: R5.5 y R12 lo dejan «sin cambios». Receta común en C04 (afecta además a Editor y Perfil) |
| Z09 | Entrada | `rise` 14 px, 400 ms, ease-out, retraso 60·i (filas 0..240, aviso 300) | sin animación | cubierto en parte (D7: `HomeEntrance`, escalón 60 ms). **Hueco #189**: `HomeEntrance` hace fade 250 ms + `withSpring` con 12 px, no 14 px/400 ms ease-out: C05 |
| Z10 | Aviso | sección radio 18, fondo ámbar, padding 12/14, gap 10, `align-items:flex-start` | `geofences-limit` en `text-sm font-normal text-muted` | cubierto #189 R6 (`rounded-tile px-3.5 py-3 gap-2.5` + `CATEGORY_SLOTS.amber`) |
| Z11 | Icono del aviso | 20 px trazo 2.2, **triángulo** con exclamación (path de alerta) | (spec) `AlertCircle` | **Hueco #189**: reicon trae `AlertTriangle` y `AlertTriangle2`; la sonda P11 de la spec comprueba `AlertCircle`. Enmendar R6 y P11 |
| Z12 | Color del icono | `--warning` = #B54708 (oscuro #FBBF24) | `theme/global.css` bloque claro: `--warning: #F59E0B` y `--color-warning: #F59E0B` (spec usa `useThemeColors(['warning'])`) | **Hueco #189** por token: C01 (contraste sobre blanco medido 2.15 vs 5.43) |
| Z13 | Texto del aviso | 13 px, `line-height 1.45`, color `amber-s` | (spec) `text-13 <amber.ink>`; `global.css` define 0 `--text-*--line-height` | **Hueco #189**: sin interlineado (en la spec `leading` = 0 apariciones). C02 |
| Z14 | «Añadir zona» (5/5) | `margin-top:auto`, alto 56, radio 16, fondo `default`, color muted, 17/800, sin labio | `geofences-add` `h-14 rounded-16 bg-accent` + `chunkyLip.primary`, colocado antes de `geofences-limit` | cubierto #189 R7.2 y D10 |
| Z15 | Borrar por fila | no existe en el artboard | `Button variant="danger-soft" size="sm" className="min-h-11 rounded-xl bg-danger-soft"` «Eliminar» | #189 D4 lo conserva como papelera 44x44. **Sobrante** §5 (decisión ya abierta en #189) |
| Z16 | Contador y barra | solo dibuja 5/5 | — | cubierto D8/D9 |

**Feature candidata para Zonas:** ninguna nueva. Enmienda **A-189** (filas Z02, Z06, Z08, Z09, Z11, Z12, Z13) apoyada en C01, C02, C04, C05 y C06.

### 2.2 Editor de zona

Artboard `EditorZona.dc.html` · app `screens/geofence-editor/index.tsx` · `components/pet-map.tsx` · spec #189 · tests `screens/geofence-editor/index.test.tsx`, `app/__tests__/layout.test.tsx`.

| ID | Elemento | Artboard (valor exacto) | App hoy (ancla medida) | Acción |
|---|---|---|---|---|
| E01 | Mapa | 390x430 a sangrado total, sin cabecera nativa | `View flex-1` con `PetMap` bajo cabecera nativa | cubierto #189 R9.1 en estructura. **Hueco #189**: bajo cabecera nativa el mapa no llega al borde superior (consecuencia de E02) |
| E02 | Volver | círculo 44, `--glass` .86 + blur 16 + `--shadow`, chevron 22 trazo 2.4, `top 52 left 16` | cabecera nativa con volver (`title: ''` tras R1.1) | **Hueco #189**: D3 lo pierde a propósito. C06 + C07 |
| E03 | Píldora de título | «Zona segura», padding 10/16, radio 999, glass + blur 16 + `--shadow`, 16/800, a 10 px del volver, `top 52` | título nativo: `title: t('geofenceEditor.title')` | cubierto #189 R8.2 (`BlurView intensity={48}`, `bg-glass-surface-strong px-4 py-2.5 text-base font-extrabold`). **Hueco #189**: posición (a la derecha del volver de cristal, no `left-4 top-3`) y `--shadow` |
| E04 | Pista | «Toca el mapa…» 12/700, padding 6/12, glass + blur 12, `top 368` (a ≈36 del borde inferior del mapa), centrada, `nowrap` | `geofence-editor-map-hint` en `text-sm font-normal text-muted` dentro del formulario | cubierto #189 R9.1 (`bottom-9 self-center`, `px-3 py-1.5 text-xs font-bold`) |
| E05 | Círculo de la zona | relleno `rgba(23,130,85,.16)`, borde #107148 trazo 3 | `PetMap`: `color: circleFill` (token `tab-pill` .14 claro / .22 oscuro), `lineColor: polylineColor`, `lineWidth: 2` | **Hueco #189**: R9.1 dice «`PetMap` sin cambios de props». `PetMap` necesita parámetros por pantalla (Editor .16/3; Mapa .12/2): C15 |
| E06 | Punto central | r9, relleno #107148, borde blanco 3 | `marker={null}` | **Hueco #189**: marcador personalizado en `GoogleMaps`; mismo spike que #192 |
| E07 | Asa de radio | r10 blanca, borde accent-strong 3, en el borde este del círculo | ausente | **Hueco #189**: mismo spike que E06 (el artboard no dibuja gesto, solo la asa) |
| E08 | Respiración | círculo `breathe` 2.4 s, escala 1 a 1.03 | ausente | **#192** (declarado fuera de #189) |
| E09 | Hoja | radios 28/28/0/0, `surface`, padding 12/20/36, gap 14, `top 404` (440 de alto), sombra `0 -8px 24px rgba(13,17,23,.10)`, `rise` 400 ms | `ScrollView className="bg-background"`, `style={{flexGrow:0, flexShrink:1}}`, `padding: 24, gap: 16, paddingBottom: insets.bottom + 24` | cubierto #189 R9.2 (`-mt-6.5 rounded-t-hero bg-surface`; `{paddingHorizontal 20, paddingTop 12, gap 14, paddingBottom insets.bottom+36}`; la solapa 26 = 430-404). **Huecos #189**: sombra (D3, sin token, C07); entrada `rise` (D3 «no anima la hoja», C05); altura fija de 440 con las acciones en `margin-top:auto` frente a hoja que se ajusta al contenido (no verificable sin dispositivo) |
| E10 | Agarradero | 40x5, radio 3, `--lip-gray` | ausente | cubierto #189 R9.3 (`h-1.25 w-10 ... bg-lip-gray`) |
| E11 | Campo Nombre | label 14/800, gap 6; input alto 50, radio 12, fondo `default`, borde 2 transparente, padding 0 14, valor 16/600 | `<Label className="text-xs font-semibold text-foreground">` (1 en el fichero, className **inerte** en el `Label` de heroui; 0 `Label.Text`); `Input className="rounded-xl bg-default"` | cubierto #189 R10 (`Label.Text text-sm font-extrabold`, `h-12.5 rounded-xl bg-default px-3.5`). **Hueco #189**: peso/tamaño del valor 16/600 (el `Input` de heroui es `font-normal`; la spec no fija el texto). Foco con borde 2: no verificable |
| E12 | Bloque Radio | gap 8; label 14/800 + valor «Radio de N m» `accent-strong`; rango 20-2000 `accent-color accent`; min/max 11/600 muted | `geofence-editor-radius-value` `font-bold text-foreground`; `Slider` por defecto | cubierto #189 R11 (`text-sm font-extrabold text-accent-strong`, `text-11 font-semibold`). Pista y pulgar del `Slider` en `accent`: la spec no los fija; no verificable sin dispositivo |
| E13 | Fila «Activa» | 15/700 + interruptor 48x28 | `font-semibold` + `Switch` por defecto | cubierto #189 R12 (`text-15 font-bold`). **Hueco**: receta del interruptor (Z08), C04 |
| E14 | Acciones | rejilla `1fr 2fr` gap 10; Eliminar alto **54** radio 16, `surface`, borde 2 `lip-gray`, labio 4 `lip-gray`, 16/800 `--danger`; Guardar alto **54** radio 16, `accent`, labio 4 `lip`, 17/800 | Guardar `h-14 rounded-16 bg-accent` + `chunkyLip.primary` ancho completo y PRIMERO; Eliminar `variant="danger-soft" rounded-xl bg-danger-soft` después | cubierto #189 R13 (orden, `flex-1`/`flex-2`, neutro con labio, `gap-2.5`). **Hueco #189**: D5 fija 56 frente a 54 del artboard; con la directiva se enmienda a `h-13.5` y se enmiendan #166/#177 |
| E15 | Color de «Eliminar» | `--danger` #D92D20 | `--danger: #EF4444` (claro) | **Hueco** por token: C01 (contraste 3.76 vs 4.83) |
| E16 | Nota de reinicio y error | no dibujados | `geofence-editor-reset-note` (`text-sm font-normal text-muted`), `geofence-editor-error` | estados que el canvas no dibuja; #189 R14 los conserva (§5) |

**Feature candidata para el Editor:** ninguna nueva. Enmienda **A-189** (E01, E02, E03 posición, E05, E09 sombra/rise, E11 valor, E14 altura), dependencias C01, C04, C05, C06, C07; E06 y E07 al spike de #192 (ampliar su alcance, ver §7).

### 2.3 Registro de peso

Artboard `Peso.dc.html` · app `screens/weight-log/index.tsx` (401 líneas) + `components/weight-chart.tsx` · tests `screens/weight-log/index.test.tsx`, `app/__tests__/layout.test.tsx`, `components/__tests__`.

| ID | Elemento | Artboard (valor exacto) | App hoy (ancla medida) | Acción |
|---|---|---|---|---|
| W01 | Raíz | padding `56 20 32`, gap 14 | `contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}` | C08 |
| W02 | Cabecera | volver 44 (`-10`) + h1 «Registro de peso» 24/900/-0.02em | título **nativo**: `title: t('weightLog.weightLog')` en `app/_layout.tsx` (1 de 3, el único sin feature) | C08 + C06 |
| W03 | Tarjeta del gráfico | radio 24, fondo `surface2`, padding 16, gap 8, sin borde ni sombra, `rise` 400 ms | `Card testID="weight-chart-card" className="gap-4"` (`surface`, borde, `shadow-sm`, radio 20, `p-4`) | C08 |
| W04 | Cifra y delta | «12.4 kg» 34/900 y «+0.3 kg este mes» 14/800 `--danger`, misma línea base, gap 8 | `weight-current` `text-3xl font-black text-foreground` (30/900; **es la cifra, no el título**); delta en columna con icono 15 + `text-sm font-semibold` (14/600) | C08 |
| W05 | SVG | alto 110, `viewBox 310x110`, `none`; 3 rejillas a y 20/55/90, trazo `--border` 1 | `WeightChart`: `viewBox="0 0 100 40"`, `preserveAspectRatio="none"`, alto 120, sin rejilla | C08 |
| W06 | Área | plana `--pill` | degradado 0.2 a 0 | C08 |
| W07 | Línea | `accent-strong`, trazo 3 round; `draw` 1200 ms ease-out, retraso 200 | `strokeWidth 2.5` bajo escala no uniforme (≈x3.18 en X y x3 en Y): trazo efectivo ≈7.5-8 px (calculado, no verificable); `MOTION_FILL_TIMING` 250 ms | C08 (si el trazo sale grueso, pasar a `viewBox` en px) |
| W08 | Puntos | solo el último, r5, `pop` 400 ms con retraso 1300 | punto `r=3` en CADA dato, con fade | C08 |
| W09 | Meses | `may jun jul ago sep oct`, 11/700 muted, `space-between` | ausentes | C08 |
| W10 | Formulario | UNA tarjeta radio 24, `surface`, borde 1, padding 14, gap 10, `rise` retraso 80; rejilla de 2 columnas (Peso, Fecha) gap 10; Condición a ancho completo | `Card className="gap-4"` aparte con 3 campos apilados | C08 |
| W11 | Labels | 13/800, gap 6 | `<Label className="text-2xs font-semibold text-foreground">` x3 (el `className` del `Label` de heroui es **inerte**; efectivo 16/500) | C08 (usar `Label.Text`, como ya hace `screens/docs-upload-form`) |
| W12 | Inputs | alto 48, radio 12, `default`, borde 2 transparente, padding 0 12, valor 15/600 | `Input className="rounded-xl bg-default"` (heroui: `min-height 48`, padding 12, `font-normal`, tamaño sin fijar) | C08 |
| W13 | Enviar | alto **52**, radio **14**, `accent`, labio 4 `lip`, 16/800 | `h-14 rounded-16 bg-accent` + `chunkyLip.primary`, `text-17 font-extrabold` | C08 (+ C03: no todos los CTA son 56/16) |
| W14 | «Historial» | h2 17/800, `margin 0 0 4` | ausente: `grep -c "weightLog.history" src/i18n/catalog.ts` = 0 y `weightLog.historial` = 0 | C08 (clave nueva; copy Voz B) |
| W15 | Filas | planas: `border-top 1px --border`, padding 10/0, gap 12, `rise` 140/200/260 | `HeroUICard ... rounded-xl border border-border bg-surface px-3.5 py-3 shadow-sm` | C08 |
| W16 | Tile de fila | 36x36 radio 12, icono 18 trazo 2.4; sube = `rose` + `--danger`; baja = `green` + `accent-strong`; igual = `default` + muted | `size-8` (32) `rounded-xl`; `TrendUp/TrendDown/Minus` de 15; `bg-danger-soft`, `bg-success-soft`, `bg-default` | C08 |
| W17 | Textos de fila | nombre 15/800 con delta inline 13 (`--danger` / `accent-strong` / muted); «CC 5/9» 12 muted; fecha «1 oct» 13/600 muted | nombre `font-bold`; delta `text-xs font-semibold` con `text-success` (en el canvas es `accent-strong`); fecha `text-xs font-normal` en ISO crudo (`entry.measuredAt`) | C08 (el catálogo ya trae `weightLog.bodyConditionValue` «CC {{value}}/9» y `weightLog.monthDelta`) |
| W18 | Movimiento | `rise` 400 ms (tarjetas 0 y 80; filas 140/200/260), `draw`, `pop` | ninguno (solo fade de puntos) | C05 + C08 |
| W19 | Toast | no existe | `absolute top-4 ... shadow-sm` | sobrante §5 |

**Feature candidata:** **C08** (Peso). Incluye el gráfico compartido: `WeightChart` debe admitir una variante completa (rejilla, área plana, meses, último punto) y una mini (sin área, sin rejilla; la usa Salud, S17).

### 2.4 Salud

Artboard `Salud.dc.html` · app `screens/health/index.tsx` (335 líneas) · tests `screens/health/index.test.tsx` (cita además el hex claro de los tokens), `app/(tabs)/__tests__/screens.test.tsx`, `__tests__/tab-headers-canvas.test.ts`.

| ID | Elemento | Artboard (valor exacto) | App hoy (ancla medida) | Acción |
|---|---|---|---|---|
| S01 | Raíz | padding `60 20 120`, gap 16 | `padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96` | C09 |
| S02 | Fila del título | h1 «Salud» 30/900/-0.02em + avatares R y L a la derecha (`justify-between`, gap 6) | `health-title` `text-3xl font-black tracking-tight` solo en su fila (30 coincide; `tracking-tight` = -0.025em frente a -0.02em); `PetSwitcher` por defecto debajo | C09 + C02 |
| S03 | Avatares | círculos 40; seleccionado con `box-shadow 0 0 0 3px bg, 0 0 0 5px accent` (aro externo 50); letras 800; ámbar y violeta | `PetSwitcher` por defecto: `Avatar size="sm"` (40) + `p-1` + `border-2` ≈ 52 externo, `bg-accent-soft`/`bg-default`. La variante `variant="avatars"` ya tiene la geometría 50 (`size-10` + `p-0.75 border-2`) y solo la usa Perfil (1 uso) | C09 |
| S04 | Próxima dosis | panel radio **24**, `amber`, padding 16, gap 14, `rise` 400 ms | `next-vaccine-card`: `Card` `surface` (radio 20, `p-4`, `shadow-sm`, borde) `flex-row items-center gap-3` | C09 |
| S05 | Tile de la dosis | 52x52 radio 16, fondo `surface`, jeringa 26 trazo 2.2 color `--warning` | `size-11 rounded-xl bg-warning-soft` (44/12); `Syringe size={22}` color `warning` (#F59E0B claro) | C09 + C01 |
| S06 | Caps | «Próxima dosis» 12/800 `uppercase` .06em, color `amber-s` | `text-2xs font-semibold text-warning-strong` (10/600; `--warning-strong` #92610A frente a `amber-s` #A55E07, que ya existe como `category-amber-strong`) | C09 |
| S07 | Nombre | 18/900 | `font-bold` (16/700) | C09 |
| S08 | Fecha | «12 de octubre · en 6 días» 13/600 `amber-s` | `fmtDate` en `font-normal text-muted` | C09 |
| S09 | Cuenta atrás | «6d» 28/900 `amber-s` | `text-lg font-black text-warning-strong` (18) | C09 |
| S10 | Encabezado de lista | h2 «Vacunas» 18/800, `margin 4 0 0` | `vaccines-section` `gap-3` con cabecera de caps: `HeartPulse size={20}` + `text-xs font-semibold uppercase tracking-widest text-muted` | C09 |
| S11 | Fila de vacuna | `article` radio 20, `surface`, borde 1, padding **14**, gap 12, `rise` 80/140/200; lista gap 10 | `Card className="flex-row items-center gap-3"` (`p-4` = 16, `shadow-sm`) | C09 |
| S12 | Tile de fila | 40x40 radio 12; verde + check (aplicada) o ámbar + reloj (próxima); icono 20 trazo 2.4 | `size-10 rounded-xl` + `CATEGORY_SLOTS[slot].surface` con `Check`/`Clock` de 20; ranura rose para vencida, amber para la próxima, green el resto (el canvas solo dibuja verde y ámbar) | C09 |
| S13 | Nombre | 15/800 | `font-bold` (16/700) | C09 |
| S14 | Subtítulo | UNA línea 12 muted «Aplicada … · Próxima …» formateada | dos líneas `font-normal` (16/400) con fecha ISO cruda (`vaccine.appliedAt`, `vaccine.nextDoseAt`); vencida con `text-danger` | C09 (formateo de fecha; copy Voz B) |
| S15 | Tarjeta de peso | radio 24, `surface2`, padding 16, gap 12, `rise` 260; **sin borde ni sombra** | `weight-card` `Card className="gap-3"` (`surface`, borde, `shadow-sm`, radio 20, `p-4`) | C09 |
| S16 | Cabecera de la tarjeta | columna «Peso» 13/700 muted sobre «12.4 kg» 30/900 `--fg`; a la derecha píldora `rose` «+0.3 kg» (padding 4/10, radio 999, `rose-s`, 13/800), `align-items:flex-end` | «Peso» `text-base font-bold` + cifra `text-xl font-black text-accent-strong` (20/900, acento) en una fila; variación en texto plano `font-normal text-muted` alineada a la derecha en otra fila | C09 |
| S17 | Gráfico | alto **56**, `viewBox 310x56`, `none`; línea `accent-strong` trazo 3 round; `draw` 1200 ms, retraso 300; último punto r5; **sin área y sin rejilla** | `WeightChart`: viewBox 100x40 `none`, alto 120, área degradada, puntos en cada dato, 250 ms | C09 (usa la variante mini de C08) |
| S18 | Enlace | «Registro de peso» padding 12/14, radio 14, `surface`, `--fg`, 15/700, chevron 18 trazo 2.4 | `weight-log-link`: `rounded-xl bg-default px-3 py-2`, `font-semibold` (16/600), `ChevronRight size={20}` | C09 |
| S19 | Movimiento | `rise` 80/140/200/260 y `draw` retraso 300 | ninguno | C05 + C09 |
| S20 | Estados fuera del canvas | no dibuja | `vaccines-skeleton` (`h-24 rounded-card`), `vaccines-empty`, `vaccines-error` + `vaccines-retry`, `weight-card-empty`, `weight-card-error`, `health-states` | se conservan como estados; los esqueletos deben adoptar las formas nuevas (§5) |

**Feature candidata:** **C09** (Salud). Depende de C08 (gráfico mini), C01 (`--warning`), C05 (`rise`) y se apoya en `PetSwitcher variant="avatars"`.

### 2.5 Mapa

Artboard `Mapa.dc.html` · app `screens/map/index.tsx` (487 líneas) + `components/pet-map.tsx` · tests `screens/map/index.test.tsx`; la pendiente #151 (`mobile-map-pill-name-locks`) toca los candados de la píldora.

| ID | Elemento | Artboard (valor exacto) | App hoy (ancla medida) | Acción |
|---|---|---|---|---|
| M01 | Pila inferior | `left 16 right 16 bottom 104`, gap 10, `rise` 400 ms | `map-stats` `bottom: insets.bottom + 96`, `left/right 16`, `className="gap-2"` (8) | C15 (el `bottom` depende de la barra de pestañas: no verificable sin dispositivo) |
| M02 | Píldora de mascota | `self-start`, padding `6 14 6 6`, radio 999, glass .86 + blur 20, `--shadow`, borde 1 | `map-pet-pill`: `flex-row items-center gap-2 self-start rounded-full border border-border bg-surface px-3 py-2 shadow-sm` (opaca, sin blur) | C15 |
| M03 | Avatar | 28 con la **letra** inicial 12/800 | `PetAvatar size={24}` (foto) | C15 |
| M04 | Nombre | 15/800 | `text-xs font-bold` (12/700) | C15 |
| M05 | Estado | punto 7 `accent` + «GPS activo» 12/700 `accent-strong` | punto `size-2` (8) con clase de `gpsTone.dot` (`STATUS_TONE_CLASSES`: success/warning/muted); texto `text-2xs font-semibold` (10/600) | C15 |
| M06 | Tarjeta | radio **24**, `surface`, sombra `0 12px 32px rgba(13,17,23,.14)`, sin borde, padding 12, gap 10 | `Card className="p-3"` (variante `surface`: radio 20, borde, `shadow-sm`); interior `gap-2` con dos filas `flex-row gap-2` | C15 + C07 |
| M07 | Tiles de datos | rejilla de 2 columnas gap 8; radio **14**, `default`, padding 10/12, gap 2, **alineados a la izquierda** | `flex-1 items-center rounded-xl bg-default p-3` (radio 12, padding 12, **centrados**) | C15 |
| M08 | Etiqueta y valor | etiqueta 11/600 muted **encima**; valor 20/900 | valor `text-base font-black` (16/900) **encima** de la etiqueta `mt-1 text-2xs font-normal text-muted` (10/400) | C15 |
| M09 | Color de valores | Velocidad `accent-strong`; Distancia `--fg`; Actualizado 16/700 muted «hace 5 min»; Batería `accent-strong` | Velocidad y Distancia `accent-strong`; Actualizado muted; Batería `batteryTone.text` (umbral por tono) | C15 (el umbral de batería baja es un estado que el canvas no dibuja; en estado normal debe ser `accent-strong`) |
| M10 | Orden | Velocidad, Distancia, Actualizado, Batería | igual | ok |
| M11 | Modo perdido | alto **50**, radio **14**, fondo `rose`, color `rose-s`, 16/800, icono triángulo 18 trazo 2.2 + gap 8, sin labio | `lost-mode-button`: `Button variant="danger-soft"` con `rounded-xl border border-danger/20 bg-danger-soft`, `Button.Label font-bold text-danger` (16/700), sin icono, alto por defecto de heroui | C15 |
| M12 | Marcador | 44x44 en (236,452): disco ámbar, borde blanco 3, sombra `0 4px 12px rgba(13,17,23,.25)`, letra «R» 16/800 `amber-s` | marcador por defecto `last-position` de `GoogleMaps` (`markers` solo con `id: 'last-position'`) | **#192** si cubre el disco; si su spec solo trae el ping, ampliar su alcance |
| M13 | Ping | capa `inset -18`, `rgba(23,130,85,.25)`, 2 s ease-out infinito, escala .55 a 1.5 | ausente. `grep -c "useReducedMotion"` + `ReduceMotion` en `screens/map/index.tsx` = 0 y en `components/pet-map.tsx` = 0 | **#192** (necesita spike) |
| M14 | Etiqueta «Casa» | píldora padding 4/10, blanca, #107148, 12/700, sombra `0 2px 8px rgba(13,17,23,.12)` | ausente | #192 (mismo spike: texto sobre el mapa) |
| M15 | Círculo de la geovalla | relleno `rgba(23,130,85,.12)`, borde #107148 trazo 2 | relleno `tab-pill` (.14/.22), `lineWidth: 2` | C15 (props por pantalla de `PetMap`) |
| M16 | Ruta | trazo 5 round #107148 + punto de inicio r6 blanco con borde 3 | `polylines` desde `route.data` con solo `color` (ancho sin fijar); sin punto de inicio | C15 |
| M17 | Movimiento | pila con `rise` 400 ms | ausente | C05 + C15 |
| M18 | Estados fuera del canvas | no dibuja | `map-loading`, `map-error` + reintentar, `map-no-pets`, `map-no-tracking`, `map-last-error-state`, `map-empty-overlay`, `lost-mode-error` | se conservan (§5) |

**Feature candidata:** **C15** (Mapa visual) para M01-M09, M11, M15-M17; **#192** para M12-M14.

### 2.6 Nutrición

Artboard `Nutricion.dc.html` · app `app/(tabs)/food.tsx` (468 líneas, **única ruta gruesa** de `src/app/**`) · test `app/(tabs)/__tests__/food.test.tsx` (1510 líneas), `__tests__/tab-headers-canvas.test.ts`.

| ID | Elemento | Artboard (valor exacto) | App hoy (ancla medida) | Acción |
|---|---|---|---|---|
| N01 | Raíz | padding `60 20 120`, gap 14 | `padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96` | C11 |
| N02 | Fila del título | h1 «Nutrición» 30/900/-0.02em + avatares 40 con el mismo aro que Salud, gap 6 | `food-title` `text-3xl font-black tracking-tight` (30; -0.025em) y `PetSwitcher` por defecto debajo | C11 + C02 |
| N03 | Héroe del plan | radio **28**, `accent`, texto blanco, padding **18**, gap 16, `align-items:center`, `box-shadow 0 6px 0 var(--lip)` (labio, no sombra suave), `rise` 400 ms | `food-plan-card`: `Card variant="accent"` (`rounded-card` 20, `bg-accent`, `p-5` = 20, `shadow-sm`), `gap-4` | C11 (el labio de 6 px no existe en `theme/chunky-lip.ts`: C03) |
| N04 | Anillo | 104x104; círculos `cx/cy 52`, r44, trazo 12; pista `rgba(255,255,255,.22)`; relleno blanco, cap round, `dasharray 276.5`, `rotate(-90)` | `size-26` (104) con `Svg` 104, r44, `strokeWidth` 12 (**coincide**); pista `stroke={accentForeground} strokeOpacity={0.2}` | C11 (.2 frente a .22) |
| N05 | Animación del anillo | `ring` 1100 ms ease-out, retraso 200 | `KCAL_BAR_TIMING` 250 ms con `Easing.bezier(0.77,0,0.175,1)` y `ReduceMotion.System` | C11 |
| N06 | Centro del anillo | «53%» 24/900 y «640 kcal» 11/700 opacidad .85 | porcentaje `text-lg font-black` (18/900); kcal `text-xs font-normal` (12/400) | C11 |
| N07 | Columna del héroe | gap 4: caps «Objetivo diario» 12/800 .06em opacidad .85; «1200 kcal / día» 24/900; «300 g / día» 14/600 opacidad .9 | caps `text-xs font-semibold uppercase tracking-widest` (12/600/.1em); `food-plan-kcal` `text-3xl font-black` (30); gramos `font-semibold` (16/600) | C11 |
| N08 | Tarjeta «Comidas hoy» | radio 24, `surface`, borde 1, padding 14, gap 8, sin sombra, `rise` 80 | `food-meals-section` `Card className="gap-3"` (radio 20, `p-4`, `shadow-sm`) | C11 |
| N09 | Cabecera | h2 17/800 + «2/3» 15/900 `accent-strong` | título `text-base font-bold` (16/700); progreso `text-xs font-semibold text-muted` | C11 |
| N10 | Filas | lista plana: padding 8/0, gap 12, primera sin borde, resto `border-top 1px --border` | cada comida es un bloque `rounded-xl bg-surface-secondary` o `bg-default` con `p-3` (bloques tintados) | C11 |
| N11 | Tile de fila | 36x36 radio **12** (squircle): servida = `green` + check 18 trazo 2.6; pendiente = `default` + reloj 18 trazo 2.4 | `size-9 rounded-full bg-surface` (círculo) con `Clock size={17}` en **ambos** estados | C11 |
| N12 | Hora y ración | «08:00» 15/800 + « · 100 g» 600 muted en la misma línea | hora `font-bold` (16/700); `{portionGrams} g` en segunda línea `text-xs font-normal text-muted` | C11 |
| N13 | Marca «Servido» | píldora padding 4/10, radio 999, `green`, `green-s`, 12/800 | `rounded-full bg-surface px-2 py-1 text-2xs font-bold text-accent-strong` (10/700 sobre `surface`) | C11 |
| N14 | Acción pendiente | botón alto 32, padding 0 12, radio 999, `accent`, texto blanco, `box-shadow 0 3px 0 var(--lip)`, 12/800 «Marcar servido» | píldora de texto `text-muted` dentro de `Pressable min-h-11` (no es un botón de acento) | C11 (+ C03: labio 3 px en píldora) |
| N15 | Recomendación IA | radio 20, fondo `violet`, padding 14, gap 12, sin borde, `rise` 140; icono 22 trazo 2.2 `violet-s`; título 14/800 `violet-s`; cuerpo 13 / interlineado 1.4 `--fg` | `food-ai-card`: `Card variant="secondary"` (`bg-surface-secondary`, borde, radio 20, `p-4`); `Sparkles size={18}` en `accent`; título `text-base font-bold text-foreground`; cuerpo `text-sm font-normal leading-5 text-muted` | C11 (+ C02 para el interlineado 1.4) |
| N16 | Enlaces | dos filas (gap 8, `rise` 200): padding 12/14, radio 16, `default`, gap 12; título 15/800 + subtítulo 12 muted; chevron 18 trazo 2.4 | `meal-schedule-link` y `meals-history-link`: `Card` `surface` `flex-row items-center justify-between` (radio 20, `p-4`, `shadow-sm`, borde); título `text-base font-bold`; `ChevronRight size={20}` | C11 |
| N17 | Movimiento | `rise` en tarjetas 0/80/140/200 | ninguno | C05 + C11 |
| N18 | Estructura del código | el artboard no la define | `app/(tabs)/food.tsx` = 468 líneas con todo dentro (`toggleMeal`, anillo animado). El resto de rutas de `src/app/**` tiene ≤ 8 líneas (`_layout.tsx` 114, `(tabs)/_layout.tsx` 31) | C10 (previa a C11; convención «route delgado + `src/screens/`») |
| N19 | `warning-card-*` | no existe | `Card bg-default` con `text-sm font-medium` | sobrante §5 |

**Feature candidata:** **C10** (ruta delgada, sin cambio visual) y **C11** (visual de Nutrición).

### 2.7 Inicio

Artboard `Inicio.dc.html` · app `screens/home/index.tsx` (922 líneas), `components/pet-hero-header.tsx`, `screens/home/weekly-activity-chart.tsx` (735 líneas), `screens/home/collar-battery-bar.tsx`, `screens/home/home-entrance.tsx` · tests `screens/home/index.test.tsx` y los de la lista de candados de más abajo.

| ID | Elemento | Artboard (valor exacto) | App hoy (ancla medida) | Acción |
|---|---|---|---|---|
| I01 | Raíz | padding `56 16 0`, gap 14, columna | `ScrollView contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 96 }}`; `home-content style={{ paddingHorizontal: 24, gap: 16 }}` | C12 |
| I02 | Fila 1: avatares | círculos **44**, borde 2 `accent` (seleccionado) o transparente, fondo `amber` o `default`, gap 8, letra 16/800 | `PetSwitcher` por defecto dentro de `home-hero-actions` (`Avatar size="sm"` + `p-1 border-2` ≈ 52 externo, `bg-accent-soft`/`bg-default`) | C12 |
| I03 | Campana | círculo 44 `default`, `Bell` 22 trazo 2; punto 9x9 `--danger` con borde 2 `default` en `top 9 right 10` | campana `size-11` sin fondo, `Bell size={24}` muted; punto `absolute right-1 top-1 size-2.5 rounded-full bg-danger` (10, sin anillo) | C12 |
| I04 | Tarjeta del hero | radio **28**, `surface2`, padding `18 18 16`, `overflow:hidden`, `rise` retraso 60 | `PetHeroHeader variant="bleed"`: foto a sangrado total (`PET_HERO_MEDIA_HEIGHT = 260`) con degradados `PET_HERO_FADE_HEIGHT = 64`; no hay tarjeta | C12 (revierte #67, A8 y A9: ver lista de candados) |
| I05 | Avatar | **disco 68x68** `amber`, color `amber-s`, borde 3 `surface`, huella 30 trazo 1.8 (no foto) | foto de mascota a 260 de alto | C12 |
| I06 | Insignia «En línea» | `self-start`, gap 6, padding 3/10, radio 999, `surface`, `accent-strong` 12/700; punto 8 `accent` + anillo `ping` 1.6 s | píldora `rounded-full px-2.5 py-0.5` + punto `size-1.5` (6) con pulso de opacidad (`STATUS_DOT_PULSE` aparece 3 veces en `pet-hero-header.tsx`); texto `text-2xs font-semibold` (10/600) | C12 |
| I07 | Nombre | 30/34/900, `letter-spacing -0.5px` | `text-3xl font-black` (30, interlineado por defecto) | C12 |
| I08 | Raza | 14 muted | `font-normal text-muted` (16) | C12 |
| I09 | Paseos | columna a la derecha: «1» 28/32/900 `accent-strong` + «Paseos» 12/600 muted | valor `text-3xl font-black` (30, color `foreground`) + etiqueta `text-xs font-medium` (12/500) | C12 |
| I10 | Pingo dentro del hero | `margin-top 14`, gap 10, alineado al final: burbuja `flex:1`, `surface`, radios 18/18/4/18, padding 12/14, 15/21/600, sombra `--shadow`, `pop` 400 ms con retraso 450; Pingo 64 con `float` 3 s | fila aparte `home-pingo-phrase` `flex-row items-end gap-2.5` **fuera** del hero con `HomeEntrance index={0}`. Burbuja `rounded-tile rounded-br-4 bg-surface px-3.5 py-3 shadow-sm`, texto `text-15 font-semibold leading-5.25`: tamaño, interlineado y radios **coinciden**; `PingoFloat` (10 px, 3 s) **coincide** | C12: mover dentro del hero y animar con `pop` (copy en Voz B) |
| I11 | Resumen: contenedor | sin título; sección radio 20, `surface`, borde 1, `--shadow`, padding `14 8`, rejilla de 4 columnas gap 4, `rise` 120 | `Card testID="summary-card" className="gap-4"` con título `summary-card-title` (`text-base font-bold`) | C13 (revierte los candados de `summary-card`) |
| I12 | Resumen: celdas | columna centrada gap 6; tile **36x36 radio 12 pastel** (violeta Peso, verde Actividad, azul Descanso, ámbar Distancia), icono 18 trazo 2; valor 16/800 (`rise` 300/340/380/420); etiqueta 11/600 muted; **sin separadores** | iconos `Weight`, `Walk`, `Moon`, `Map` con `size={20}` en muted y sin tile; separadores `border-r border-border`; valores `text-sm font-bold` (14/700); etiquetas `text-2xs font-normal text-muted` (10/400) | C13 |
| I13 | Collar | radio 20, `default`, padding 12/14, gap 12, `rise` 180: círculo 40 `--pill` con wifi 20 `accent-strong` | `Card testID="collar-card" className="gap-3 bg-default"` (con borde y `shadow-sm`); icono `size-9 rounded-full bg-accent-soft` (36) | C13 |
| I14 | Collar: textos y barra | columna gap 6: «Collar en línea» 15/700 + barra alto 8, radio 999, fondo `--bg`, relleno `accent` 72 % con `fill` 900 ms `cubic-bezier(.23,1,.32,1)` y retraso 400; a la derecha «72%» 15/800 `accent-strong`. **Una sola fila** | estado `collar-status` `text-base font-bold` (16/700); batería en **segunda fila**: `Battery size={18}` + `collar-battery` (`font-semibold text-success` o `text-warning-strong`) + `CollarBatteryBar` (`h-1.5` = 6, pista `bg-surface`, relleno `bg-success`/`bg-warning-strong`, `MOTION_FILL_TIMING` 250 ms, respeta reduce-motion) | C13 (solape con #154) |
| I15 | Collar: enlace | no existe | `collar-pair-link`: `min-h-11 ... rounded-xl bg-accent-soft` | sobrante §5 |
| I16 | Encabezado de accesos | «ACCESOS RÁPIDOS» 12/700, `letter-spacing 1.5px`, `uppercase`, muted, `rise` 240 | `quick-actions` título `text-xs font-semibold uppercase tracking-widest text-muted` (12/600; `tracking-widest` = .1em ≈ 1.2 px; no hay token de 1.5 px) | C13 + C02 |
| I17 | Accesos: tiles | rejilla de 3 columnas gap 10; alto **92**, radio **20**, pastel violeta/ámbar/azul con color `-s`; `box-shadow inset 0 -4px 0 rgba(...,.16-.18)`; columna centrada gap 8; icono 26 trazo 2; etiqueta 13/700 (Peso, Recordatorio, Documentos) | fila `flex-row gap-3`; tiles `min-h-11 flex-1 items-center gap-1.5 rounded-xl py-3` + `CATEGORY_SLOTS[slot].surface`; icono `size={24}`; etiqueta `text-2xs font-semibold text-foreground` (10/600) | C13 (+ C03: el labio interior `inset` no existe en `chunky-lip.ts`) |
| I18 | Actividad semanal: contenedor | radio 20, `surface`, borde 1, `--shadow`, padding `14 16`, `rise` 300; título 16/800 + «últimos 7 días» 12 muted en la misma línea base | `Card testID="weekly-activity-card" className="gap-2"`; título `text-base font-bold`; `weeklyActivity.lastSevenDays` en `text-2xs text-muted` | C14 |
| I19 | Actividad semanal: barras | 7 barras en alto 70, `margin-top 12`, gap 10, radio 6, `accent` a opacidad .35 (la última 1), alturas 45/70/55/90/60/40/80 % | `WeeklyActivityChart`: `CHART_PLOT_HEIGHT = 160`, márgenes 40.4/14/18/34, `BAR_ENTRY_DURATION_MS = 250`, `BAR_ENTRY_STAGGER_MS = 40`, `BAR_MIN_HEIGHT = 3`, ejes con letra de 10, selector de métrica, tooltip, comparación semanal, detalle de día | C14; lo que el canvas no dibuja va a §5 |
| I20 | Movimiento global | `rise` 14 px/400 ms por sección (0, 60, 120, 180, 240, 300), `pop` de la burbuja, `ping` de la insignia, `float`, `fill` del collar 900 ms | `HomeEntrance` índices 0-6 (escalón 60 ms, 12 px con spring); `summary-reveal` usa `homeEntering(0, 0)`; sin `pop`; pulso de opacidad en vez de `ping`; relleno del collar 250 ms | C05 + C12-C14 |
| I21 | Secciones del app | no existen | `reminders-section`, `last-position-card`, `weekly-activity-day-map` «Ver en el mapa» | sobrantes §5 |
| I22 | Estados | InicioVacío dibuja otro artboard | `home-states` (sin mascotas): `home-loading` (`Skeleton`), `home-error` + `home-retry` | se conservan |

**Candados y reglas de la carta que habría que revertir (todo «el artboard manda», directiva 2026-10-13).**

- **Carta `docs/ui-guidelines.md`.** «Excepción nombrada, enmienda A9 de #67» (§Dimensiones, punto 6); «Enmendado por #67 (A8)»; la sección «Enmienda #67 — cabecera fotográfica compartida» (con su casilla); los ejemplos de la Enmienda #70 que citan el hero fotográfico.
- **Componente.** `components/pet-hero-header.tsx` (`variant?: 'bleed' | 'card'`): Inicio deja de usar `bleed`; Perfil usa `card` y se conserva.
- **Tests.** `components/__tests__/pet-hero-header.test.tsx` (13 apariciones de `variant="bleed"`); `screens/home/index.test.tsx` (cuentas medidas: `summary-card` 9, `pet-hero-` 47, `collar-card` 15, `quick-actions` 26, `weekly-activity-card` 7, `reminders-section` 41, `last-position-card` 13); `__tests__/hero-header-amendments.test.ts` (R10 y #168 R11); `__tests__/consistency-classnames.test.ts` (la prueba del esqueleto de la Enmienda #67 y los inventarios de `pet-hero-header.tsx` y `home/index.tsx`, «enmendado por #190 R13»); `__tests__/design-drift.test.ts`; `__tests__/legibility-classnames.test.ts`; `__tests__/tab-headers-canvas.test.ts` («conserva PetHeroHeader solo en Inicio»); `__tests__/home-pingo-phrase.test.ts`.
- **Specs que cargan los candados.** `specs/mobile-pet-hero-header` (#67), `mobile-home-stats-strip` (#69), `mobile-home-quick-actions` (#71, orden R10), `mobile-home-dashboard`, `mobile-no-collar-states-pingo`, `mobile-home-weight-without-collar`, `mobile-home-motion-foundations` (#152), `mobile-home-weekly-activity`, `mobile-home-reminders-section`, `mobile-home-pingo-phrase` (#190).
- **Candados de `summary-card`.** `summary-card` aparece 2 veces en `screens/home/index.tsx` y 9 en su test; los caza el inventario de `consistency-classnames.test.ts` y la regla de #69 (tira de cuatro cifras en una sola `Card` con separadores).
- **Pendientes que se solapan.** #144 (candados del gráfico semanal) y #154 (carrera del test de la barra de batería): coordinar antes de abrir C13 y C14.

**Feature candidata:** **C12** (cabecera y hero), **C13** (resumen, collar y accesos), **C14** (actividad semanal y movimiento). Se parte en tres por el tamaño de los candados.

## 3. Las otras 17: verificación rápida

| ID | Artboard | Código | Veredicto | Lo medido | Dueño |
|---|---|---|---|---|---|
| Q01 | Bienvenida | `screens/welcome` | sospecha | padding 24 frente a 16; marca `text-3xl font-bold` frente a 34/40/900/-0.5px; Pingo 200 frente a 220; sin elipse de sombra; burbuja dentro del flujo de `Card` frente a absoluta arriba a la derecha con radios 16/16/4/16; escena `Card variant="secondary"` frente a alto 380 radio 32; `MOTION_FLOAT_OFFSET_Y = 4` frente a `float` de 10 | C17 |
| Q02 | Login | `screens/login` | sospecha | título `text-3xl` sin `-0.5px`; padding 24 frente a 20; burbuja con radio uniforme | C17 |
| Q03 | Registro | `screens/register` | sospecha | inputs `h-13` (52) frente a 50; padding 24; tracking del título | C17 |
| Q04 | Recuperar | `screens/forgot` | sospecha | tile del candado `size-13` con `chunkyLip.primary` frente a 52/16 sin labio sobre un fondo `surface2` de 168x150 radio 40; título; `forgot-resend` extra; padding 24 | C17 |
| Q05 | NuevaContraseña | `screens/reset-password` | sospecha | título `text-3xl` frente a 28/32; padding superior `insets + 12` frente a 100; `padding: 24` (3 apariciones) | C17 |
| Q06 | Perfil | `screens/profile` | sospecha leve | ver §6; el resto (tarjeta de 28, chips, enlaces 18/12, fila de identidad 34, textos) coincide con el artboard | C18 + C02 + C04 |
| Q07 | Recordatorios | `screens/reminders` | sospecha | hoja de confirmación de borrado sin receta chunky; `rounded-xl bg-accent`/`bg-danger(-soft)` x3 en el fichero | C18 + C03 |
| Q08 | NuevoRecordatorio | `screens/add-reminder` | sospecha | `SELECTED_CHIP` con `border-b-3 border-black/25` heredado | C03 |
| Q09 | HorarioComidas | `screens/meal-schedule` | sospecha | 3 `border-b-N` heredados: héroe `border-b-5 border-black/25`, «Editar» `border-b-5 border-lip-gray`, «Añadir comida» `border-b-6 border-lip-gray` | C03 |
| Q10 | HistorialComidas | `screens/meals-history` | paridad | sin diferencia medida | — |
| Q11 | Documentos | `screens/docs` | paridad | sin diferencia medida | — |
| Q12 | Alertas | `screens/alerts` | sospecha | `h-8.5 rounded-10 border-2 border-b-5 border-lip-gray` del confirmar; #165 toca la misma pantalla | C03 / #165 |
| Q13 | DetalleAlerta | `screens/alert-detail` | sospecha leve | ver §6 | C15 + C06 |
| Q14 | Vincular | `screens/pairing` | paridad | estado previo al vínculo coincide; el estado vinculado (`device-status-card`, `device-unpair`) es sobrante | — |
| Q15 | NuevaMascota | `screens/add-pet` | sospecha | CTA dentro del `ScrollView`; título de sección `text-lg font-bold`; chips extra en el paso 2 | C17 |
| Q16 | InicioVacío | `components/empty-state.tsx` + ramas `no-pets` | paridad | sin diferencia medida | — |
| Q17 | Celebración | `components/celebration.tsx` | sospecha | `tracking-tight` (-0.025em) frente a -0.02em; 30/900 | C02 |

## 4. Transversales

### (a) Barra de pestañas flotante con píldora deslizante
Artboard (`nav` de Perfil): `left 16 right 16 bottom 28`, alto 64, padding 6, gap 4, borde 1, `--glass` .86 + blur 20, sombra `0 10px 30px rgba(13,17,23,.12)`, ítems alto 52 con píldora `--pill`, etiqueta 10/600 gap 2, icono 24 con trazo 2.4 al estar seleccionado (2 si no).
App (`components/floating-tab-bar.tsx`): `absolute overflow-hidden rounded-full border border-border shadow-lg`, `bottom: insets.bottom + 12, left: 16, right: 16`; fila `px-2 py-3`; píldora `left: 8, bottom: 6`; etiquetas `text-2xs font-semibold`; velo `bg-glass-surface` (alfa .60) sobre `BlurView intensity={80}`. **Medible**: el canvas usa .86, que existe como `glass-surface-strong`. **No verificable sin dispositivo**: bottom (12 + inset frente a 28), alturas efectivas de los ítems, sombra, blur, cambio de trazo del icono activo. Dueño: C16.

### (b) Título en contenido frente a cabecera nativa (D-H)
`app/_layout.tsx` declara `headerShown: true` con `headerOptions` (`headerStyle: { backgroundColor: background }`, `headerTitleStyle: { fontFamily: 'Inter-Bold' }`, `headerShadowVisible: false`). Tres pantallas aún pintan **título nativo**: `weight-log` (`t('weightLog.weightLog')`, sin feature), `pets/[petId]/geofences` y `pets/[petId]/geofence-editor` (ambas las deja en `title: ''` #189 R1.1). El resto declara `title: ''`: la cabecera nativa solo aporta el volver y **el título cae una fila más abajo**, mientras el canvas pone volver (44x44, `margin-left -10`, chevron 24/2.4) y título en la **misma fila** (Zonas, Peso, DetalleAlerta, etc.). Bajo la directiva es un hueco en todas las pantallas empujadas. Cierre: componente de cabecera en contenido que reutilice `components/back-button.tsx` (C06), `headerShown: false` en esas `Stack.Screen`, enmienda de la carta (A11, lista de excepciones de cabecera nativa, y D-H) y de `app/__tests__/layout.test.tsx`. El Editor es el caso aparte: volver de cristal 44 sobre el mapa.

### (c) Modo oscuro: tokens de `src/theme/` frente al canvas
- **Oscuro: paridad completa** en los 20 tokens comparados: `--background` #0D1117, `--foreground` #F7F8FA, `--surface` #161B22, `--surface-secondary` #12231B, `--default` #1F242B, `--muted` #9CA3AF, `--border` .08, `--accent-strong` #2AB87C, `--lip` #0B4D31, `--lip-gray` #0A0D12, `--danger` #F87171, `--warning` #FBBF24, `--tab-pill` .22, `--glass-surface-strong` .86 y las diez entradas `--color-category-*` (blue/amber/green/violet/rose y sus `-strong`).
- **Claro: tres diferencias**: `--border` y `--separator` rgba(13,17,23,**0.07**) frente a **.08**; `--danger` / `--color-danger` **#EF4444** frente a **#D92D20**; `--warning` / `--color-warning` **#F59E0B** frente a **#B54708**. Contraste sobre blanco, medido: #EF4444 = 3.76, #D92D20 = 4.83; #F59E0B = 2.15, #B54708 = 5.43.
- `--lip` #0E5E3C y `--lip-gray` #E4E7EC (claro) y todas las pastel claras **coinciden**.
- Sin equivalente en el canvas: `--warning-strong` (#92610A claro; el canvas usa `amber-s` #A55E07 = `category-amber-strong`) y `--success` (#0F9B5A / #34D399; el canvas usa `accent-strong` para «mejora»).
- No existe token `--shadow` (el app usa `shadow-sm` y `shadow-lg`); el canvas define `0 1px 2px rgba(13,17,23,.04), 0 8px 24px rgba(13,17,23,.06)` claro y `0 1px 2px rgba(0,0,0,.4)` oscuro: C07, no verificable sin dispositivo.
- Los tests que citan el hex claro y habría que tocar con C01: `theme/__tests__/global-css.test.ts`, `theme/__tests__/use-theme-colors.test.tsx`, `screens/health/index.test.tsx`.

### (d) Receta de botón «chunky» (56 / radio 16 / 17-800 / `--lip`)
- `h-14 rounded-16` + `chunkyLip` es la receta canónica y está en 17 ficheros consumidores de `useChunkyLip` (18 con su definición). **Pero el canvas no usa una sola**: 56/16/4 (mayoría), 54/16/4 (Editor), 52/16/4 (DetalleAlerta «Ver en el mapa», neutro), 52/14/4 (Peso), 50/14 sin labio (Mapa, modo perdido), 40/12/3, 38/píldora/3, 36/10/3, 34/10/3, 32/píldora/3 (Nutrición «Marcar servido»); además los tiles de Inicio llevan labio **interior** `inset 0 -4px 0` y el héroe de Nutrición `0 6px 0 var(--lip)` con radio 28.
- `ChunkyLip` (`theme/chunky-lip.ts`) es `Record<'primary' | 'primaryCompact' | 'neutral', ViewStyle>` (4 px primario, 3 px compacto, 4 px neutro `lip-gray`). No tiene neutro de 3 px, 5-6 px ni interior.
- **Restos del patrón viejo** `border-b-N` en producción: `screens/add-reminder/index.tsx` x1 (`SELECTED_CHIP`, `border-b-3 border-black/25`); `screens/alerts/index.tsx` x1 (`border-b-5 border-lip-gray`); `screens/meal-schedule/index.tsx` x3 (`border-b-5 border-black/25` en el héroe, `border-b-5` en «Editar», `border-b-6` en «Añadir comida»). Tests que los mencionan: `__tests__/alert-detail-canvas-fidelity.test.ts`, `alerts-canvas-fidelity.test.ts`, `chunky-cta-canvas-fidelity.test.ts`, `consistency-classnames.test.ts`, `design-drift.test.ts`, `screens/add-reminder/index.test.tsx`, `screens/alerts/index.test.tsx`, `screens/meal-schedule/index.test.tsx`, `screens/welcome/index.test.tsx`.
- **`rounded-xl bg-accent` / `bg-danger(-soft)`** en 9 sitios: `screens/reminders/index.tsx` x3; `screens/geofence-editor/index.tsx` x1 (Eliminar) y `screens/geofences/index.tsx` x1 (ambos desaparecen con #189); `screens/home/index.tsx` x1 (`collar-pair-link`); `screens/map/index.tsx` x1 (modo perdido); `screens/pairing/index.tsx` x1; `screens/profile/index.tsx` x1 (cerrar sesión, sobrante).
- Dueño: C03.

### (e) Reduce-motion por animación

| Animación del canvas | Hoy en la app | ¿Respeta reduce-motion? |
|---|---|---|
| `float` 10 px / 3 s | `PingoFloat` (`MOTION_PINGO_FLOAT_OFFSET_Y = 10`, inversión de 1500 ms = 3 s) coincide; Bienvenida usa `MOTION_FLOAT_OFFSET_Y = 4` | sí |
| `ping` (2.4 s base; 1.6 insignia; 1.8 alerta; 2.0 marcador del Mapa; 2.2 Celebración) | `PingRing` (2400), `MOTION_ALERT_PING_MS` 1800, `MOTION_CELEBRATION_PING_MS` 2200; Mapa y Inicio sin `ping` | sí donde existe; Mapa: 0 usos (#192) |
| `rise` 14 px / 400 ms ease-out | `HomeEntrance` (60 ms de escalón, 12 px, spring 250 ms) | desplazamiento a 0, pero el fade usa `MOTION_FADE_TIMING` con `ReduceMotion.Never` a propósito; el canvas apaga toda animación (`*{animation:none!important}`), así que el fade que sigue corriendo es un hueco menor |
| `fill` 900 ms (Inicio) | `CollarBatteryBar` 250 ms | sí (`useReducedMotion`) |
| `pop` .6 a 1.08 a 1 | `components/pop-in.tsx` | sí; no se usa en la burbuja de Inicio ni en el último punto de Peso |
| `draw` 1200 ms | `WeightChart` usa fade de 250 ms | sí |
| `ring` 1100 ms | `KCAL_BAR_TIMING` 250 ms | `ReduceMotion.System` |
| `fall` | `components/celebration.tsx` | sí |
| `breathe` 2.4 s | ausente | #192 |

Pantallas **sin movimiento alguno** hoy: Salud, Peso, Zonas, Editor, Mapa. Cuando C05 y C08/C09 les añadan `rise` y `draw`, el reduce-motion debe nacer en el helper común, no pantalla a pantalla.

### (f) Rutas gruesas que deberían ser delgadas
Solo `app/(tabs)/food.tsx` (468 líneas). El resto de `src/app/**` tiene ≤ 8 líneas, salvo `_layout.tsx` (114) y `(tabs)/_layout.tsx` (31), que son configuración. Dueño: C10.

## 5. Sobrantes vs canvas (pregunta cerrada: «se quitan o se quedan», decide el humano)

| ID | Dónde | Sobrante | ¿Se quita o se queda? |
|---|---|---|---|
| X01 | Inicio | `reminders-section` (lista, «Ver todo», `reminders-next-vaccine`, `reminders-meals`, `reminders-none-upcoming`, `reminders-item-*`) | se quita / se queda |
| X02 | Inicio | `last-position-card` | se quita / se queda |
| X03 | Inicio | `weekly-activity-day-map` «Ver en el mapa» | se quita / se queda |
| X04 | Inicio | selector de métrica, tooltip, comparación semanal y detalle de día del gráfico semanal | se quitan / se quedan |
| X05 | Inicio | `collar-pair-link` | se quita / se queda |
| X06 | Inicio | título `summary-card-title` | se quita / se queda (el canvas no lo dibuja) |
| X07 | Perfil | `profile-sign-out` | se quita / se queda |
| X08 | Perfil | `notifications-blocked-notice` | se quita / se queda |
| X09 | Perfil | `PetSwitcher variant="avatars"` | se quita / se queda |
| X10 | Nutrición | `warning-card-*` | se quita / se queda |
| X11 | Recordatorios | borrar por fila y `PetSwitcher` | se quitan / se quedan |
| X12 | Zonas | papelera por fila (#189 D4, decisión ya abierta) | se quita / se queda |
| X13 | Peso | toast `absolute top-4` | se quita / se queda |
| X14 | Vincular | estado vinculado (`device-status-card`, `device-unpair`) | se quita / se queda |
| X15 | Recuperar | `forgot-resend` | se quita / se queda |
| X16 | NuevaMascota | chips extra del paso 2 | se quitan / se quedan |
| X17 | Editor | `geofence-editor-reset-note`, `geofence-editor-error`, rama de solo lectura | se quitan / se quedan |

**Estados que el canvas no dibuja** (carga, vacío, error con reintentar, `no-tracking`, deshabilitado): no son sobrantes de diseño sino comportamiento. Los listo para que el humano confirme una sola vez que **se quedan** y que adoptan las formas nuevas: Salud (`vaccines-empty`, `vaccines-error`, `weight-card-empty`, `weight-card-error`, `health-states`), Mapa (`map-loading`, `map-error`, `map-no-pets`, `map-no-tracking`, `map-last-error-state`, `map-empty-overlay`, `lost-mode-error`), Inicio (`home-states`), Editor (R14 de #189).

## 6. Re-verificación puntual pedida

- **Inicio**: «falta». Ver §2.7. Lo que el humano ve como tarjeta fotográfica es `PetHeroHeader variant="bleed"` (260 de alto con degradados); el artboard pone un disco de 68. El resumen son 4 celdas en una `Card` con separadores; el artboard son 4 celdas con tile pastel 36/12 sin separadores y sin título.
- **Mapa, ping**: el ping (2 s, capa `inset -18`, .25) **no existe**; tampoco el marcador en el que vive (disco ámbar 44 con borde blanco 3, sombra y letra). 0 usos de reduce-motion en `screens/map/index.tsx` y en `components/pet-map.tsx`. Dueño **#192**; verificar que su spec incluya el marcador personalizado y la etiqueta «Casa» y no solo el ping, y que cubra los puntos del Editor (E06, E07). El resto del Mapa (pila, píldora, tarjeta, tiles, botón) no tiene dueño: C15.
- **Peso, `text-3xl`**: `weight-current` lleva `text-3xl font-black` y es la **cifra** (30/900; el canvas dice 34/900). El **título** no es `text-3xl`: es el título nativo de `_layout.tsx` (`t('weightLog.weightLog')`), y el canvas lo quiere en contenido, 24/900/-0.02em, junto al volver.
- **Detalle de alerta**: casi igualado (hay candado `__tests__/alert-detail-canvas-fidelity.test.ts`). Coinciden: mapa `h-52.5` (210) radio 24, píldora de cristal «A N m de Casa», hero `Card variant="hero"` con `px-4.5 py-5.5` (18/22) y `gap-2`, disco `size-18` (72), `AlertPingRing` 1800 ms, tipo `text-22 font-black`, mascota `text-15 font-bold`, fecha `text-13`, «Ver en el mapa» `h-13` radio 16 neutro con labio, «Marcar leída» `h-14 rounded-16` con labio y `flex-1` de separación, paddings 20 / 40 / gap 14. Diferencias: `PetMap` con `polylines={[]}` (el artboard dibuja la ruta de salida en `--danger` trazo 4 y el punto r11 `--danger` con borde 3), círculo con trazo discontinuo `6 5` (el app lo dibuja continuo), título con volver nativo (transversal b), `rise` 0/80 (C05). El mapa de teselas no puede igualar al SVG dibujado; se compara solo lo superpuesto.
- **Nutrición**: «falta». Ver §2.6.
- **Perfil**: casi igualado (`__tests__/profile-canvas-fidelity.test.ts`). Diferencias: `profile-title` `text-3xl font-black tracking-tight` (-0.025em) frente a 30/900/-0.02em (C02); `theme-toggle` es un `Switch` de heroui y el artboard dibuja una casilla de 20 px con `accent-color` (hueco por la directiva; el humano puede preferir el interruptor, pero esa elección es del humano solo si decide desviarse del canvas); avatar del disco con `--shadow` (C07); `rise` (C05); `padding: 20` y `paddingTop: insets.top + 12` frente a 60 (no verificable). Sobrantes en §5 (X07-X09).

## 7. Candidatas nuevas (una PR cada una; los ids se asignan contra `origin/main` al redactar la spec)

Revisadas contra `feature_list.json` por título y descripción: ninguna está ya cubierta. Pendientes móviles que rozan: #60 `mobile-ios-support`, #129 `mobile-selected-pet-query-wait-race` (toca la mascota seleccionada que usan Salud/Nutrición/Inicio, sin solape de ficheros UI previsto), #144 `mobile-weekly-day-selected-position-lock`, #150 `mobile-source-locks-strip-comments` (afecta a todo candado de fuente que se enmiende), #151 `mobile-map-pill-name-locks`, #154 `mobile-home-battery-bar-test-race`, #165 `mobile-alert-ack-retry-guard-leaving-locks`, #189, #192, y #194 `mobile-edit-profile` (`spec_ready`, solo en wt-194).

| Código | Nombre sugerido | Alcance | Ficheros dueños | Solapes y dependencias |
|---|---|---|---|---|
| C01 | tokens de color claros | `--danger` #D92D20, `--warning` #B54708, `--border`/`--separator` .08; decidir qué hacer con `--warning-strong` y `--success` | `theme/global.css`; tests `theme/__tests__/global-css.test.ts`, `theme/__tests__/use-theme-colors.test.tsx`, `screens/health/index.test.tsx` | Primero: lo consumen Z12, E15, S05, M09. Mejora el contraste (3.76 a 4.83 y 2.15 a 5.43) |
| C02 | tipografía: tracking e interlineado | tokens de interlineado (13/1.45, 13/1.4, 15/21), token para 1.5 px y -0.5 px; barrer `tracking-tight` (-0.025em) a `tracking-title` (4 ficheros de producción: `app/(tabs)/food.tsx`, `components/celebration.tsx`, `screens/health/index.tsx`, `screens/profile/index.tsx`, más 5 tests) | `theme/global.css`, esos 4 ficheros y tests | Debe respetar la Enmienda #187 (`text-<n>` a medida nunca sobre componentes de heroui) |
| C03 | variantes de labio y migración | `theme/chunky-lip.ts` con neutro de 3 px, 5-6 px, interior `inset` y 6 px de héroe; migrar los 5 `border-b-N`; alturas de CTA del canvas (§4d) | `theme/chunky-lip.ts`, `screens/add-reminder`, `screens/alerts`, `screens/meal-schedule`, tests listados en §4d | #165 toca `screens/alerts`; coordinar |
| C04 | interruptor del canvas | 48x28, pulgar 22 círculo blanco a 3 px, off `--lip-gray`, on `accent`; envoltorio o tema de `Switch` | `components/` (nuevo), los 3 usos: `screens/profile`, `screens/geofences`, `screens/geofence-editor` | Enmienda de #189 (R5.5, R12) |
| C05 | movimiento `rise` común | `rise` 14 px / 400 ms ease-out en `theme/motion.ts` y `home-entrance.tsx`, con reduce-motion apagando también el fade | `theme/motion.ts`, `screens/home/home-entrance.tsx`, `screens/home/home-entrance.test.tsx` | Primero de los de movimiento; #189 D7 lo usa |
| C06 | cabecera en contenido | componente de cabecera (volver `BackButton` + h1 + accesorio) y `headerShown: false` en las pushed; enmienda de la carta (A11, D-H) | `components/back-button.tsx`, componente nuevo, `app/_layout.tsx`, `app/__tests__/layout.test.tsx`, `docs/ui-guidelines.md` | #189 R1.1 declara `title: ''`; hay que reconciliar antes de implementarla |
| C07 | sombras del canvas | `--shadow` y las del canvas (tarjeta del Mapa, hoja del Editor, barra de pestañas, burbuja) como estilos `boxShadow` o equivalente | `theme/` (nuevo) | No verificable sin dispositivo |
| C08 | Peso | W01-W19; `WeightChart` con variante completa y mini | `screens/weight-log/index.tsx`, `components/weight-chart.tsx`, `i18n/catalog.ts`, tests | Depende de C05, C06; alimenta a C09 |
| C09 | Salud | S01-S20 | `screens/health/index.tsx`, `components/pet-switcher.tsx` (variante), tests | Depende de C01, C05, C08 |
| C10 | Nutrición: ruta delgada | mover `app/(tabs)/food.tsx` a `src/screens/food/`; sin cambio visual | `app/(tabs)/food.tsx`, `screens/food/` (nuevo), `app/(tabs)/__tests__/food.test.tsx` | Previa a C11 |
| C11 | Nutrición: visual | N01-N17 | `screens/food/`, tests | Depende de C02, C03, C05, C10 |
| C12 | Inicio 1: cabecera y hero | I01-I10 y revertir #67/A8/A9 | `screens/home/index.tsx`, `components/pet-hero-header.tsx`, `components/pet-switcher.tsx`, carta, tests | Las pruebas de `pet-hero-header` y de `home/index` se reescriben |
| C13 | Inicio 2: resumen, collar, accesos | I11-I17 y revertir los candados de `summary-card` | `screens/home/index.tsx`, `screens/home/collar-battery-bar.tsx`, tests | Solape #154; depende de C03, C05 |
| C14 | Inicio 3: actividad semanal | I18-I20 | `screens/home/weekly-activity-chart.tsx`, tests | Solape #144 |
| C15 | Mapa: visual | M01-M09, M11, M15-M17; props por pantalla en `PetMap` | `screens/map/index.tsx`, `components/pet-map.tsx`, tests | Solape #151 y #192 (`pet-map.tsx`); depende de C07 |
| C16 | Barra de pestañas | velo `glass-surface-strong`, geometría y trazo del icono activo | `components/floating-tab-bar.tsx`, tests | Depende de C07; gran parte no verificable sin dispositivo |
| C17 | Auth y Bienvenida | padding 24 a 20, tracking `-0.5px`, tamaños de título, Registro a 50, Recuperar, NuevaContraseña, escena de Bienvenida, NuevaMascota | `screens/{welcome,login,register,forgot,reset-password,add-pet}` | Depende de C02; partible en dos PR |
| C18 | Perfil, Recordatorios y Celebración | casilla de 20 px o decisión sobre el `Switch`, receta de la hoja de borrado, `tracking-tight` | `screens/profile`, `screens/reminders`, `components/celebration.tsx` | Depende de C02, C03, C04 |

**Enmiendas (no features):**
- **A-189**: Z02, Z06, Z08, Z09, Z11, Z12, Z13 y E01, E02, E03, E05, E06, E07, E09, E11, E14 (cada una cita la fila de §2.1 y §2.2). Reabrir el gate solo para las enmiendas, no para el resto de la spec.
- **A-192**: ampliar el spike a marcador personalizado (disco ámbar con borde y letra), etiqueta «Casa», punto central y asa del Editor (M12, M14, E06, E07), además del ping y el breathe.

## 8. Orden sugerido

1. **Bases, en paralelo y sin tocar pantallas con candado vigente**: C01, C02, C03, C05, C04, C07. En paralelo, el **spike de #192** (solo toca ficheros de mapa).
2. **C06** (cabecera en contenido) y luego la **enmienda A-189** y su implementación: así #189 nace con el volver, el interruptor y el `rise` del canvas.
3. **Peso (C08)**, después **Salud (C09)**, después **Nutrición (C10 y C11)**: Salud usa el gráfico mini de Peso; Nutrición exige la ruta delgada primero.
4. **Inicio (C12, C13, C14)**, el último: revierte la mayor cantidad de candados y se solapa con #144 y #154.
5. **Mapa (C15)** tras el resultado del spike de #192 y la cola de #151.
6. **C16, C17, C18** como barrido final.

## 9. Límites

Auditoría de **código contra el HTML del artboard**. No hay captura en dispositivo en esta VPS; la verdad de píxel es el smoke del humano en el dev build de Android. Comparo contra el marco de 390x844 del artboard; los layouts flexibles escalan en dispositivos reales.

**No verificable sin dispositivo** (no lo doy por igual ni por distinto salvo la medida de token que cito): sombras (`--shadow`, `0 12px 32px`, `0 -8px 24px`, `0 10px 30px`), tipografía efectiva (interlineado real, ajuste de líneas, `text-wrap: pretty`), áreas seguras (el 56/60/100 superior del artboard frente a `insets.top + 12`), hojas dependientes de librería (altura real de la hoja del Editor con teclado), alturas efectivas de los ítems de la barra de pestañas, `blur` de `expo-blur`, grosor efectivo del trazo del gráfico de peso (W07, calculado ≈7.5-8 px por la escala no uniforme del `viewBox`), el trazo de los iconos de `reicon-react-native` (2.2 / 2.4 del canvas), el comportamiento de `expo-maps` (marcadores personalizados, trazo discontinuo, ping) y el `Slider` / `Input` internos de heroui.

El mapa de teselas de Google no puede igualar al SVG dibujado de los artboards; solo se comparan los elementos superpuestos (círculo, ruta, marcadores, etiquetas).

Cada arreglo de clase toca su test, porque los tests fijan los `className` literales (por eso cada candidata lista sus tests).

## 10. Notas finales

- **#194 `mobile-edit-profile`** (`spec_ready` en wt-194): **el canvas NO tiene artboard de edición de perfil**. No hay objetivo de paridad que medir para esa pantalla; su aspecto lo decide su spec. Al implementarla debe reutilizar los patrones de Perfil que sí están en el canvas (tarjeta de radio 20, filas de 14, `Label.Text`, receta de botón, `BackButton`).
- **#189 y #192** figuran aquí como cubiertos o dueños, no como huecos nuevos: #189 cubre Zonas y Editor en lo estático sin el breathe (spec firmada el 2026-10-19, con los huecos de §2.1 y §2.2 para una enmienda); #192 cubre el ping del marcador del Mapa y el breathe del Editor y necesita un spike.
- **Alturas de CTA**: no existe un 56/16 único (§4d). Cualquier spec que cite «la receta de la carta» debe contrastar con el artboard de su pantalla.
- **Premisa heredada por contenido, no por línea**: las cifras de este informe (apariciones de `summary-card`, `STATUS_DOT_PULSE`, `variant="bleed"` y similares) caducan al mergear; reanclar por contenido en la spec.

## 11. Decisión del humano (2026-10-21) sobre §5 y los estados sin dibujo

«Dibuja los que faltan, todo se queda.» Los 17 sobrantes (X01-X17) y los estados que el canvas no dibujaba **se quedan en la app**; la respuesta fue ampliar el canvas (artifact v86), no recortar la app. Las filas «sobrante» de este informe y el candidato C12 (sustituido por #195/#196) quedan superados.

Artboards editados: Inicio (resumen con título, actividad semanal completa, «Ver en el mapa», recordatorios, última posición), Perfil (selector de mascotas), Recordatorios (selector y borrar por fila), Recuperar y NuevaMascota (enlaces al estado siguiente), Zonas (papelera por fila), EditorZona (nota de restablecer) y Peso (desborde de la fila Peso/Fecha corregido).

Artboards nuevos (31), por fila desde y=6320 del canvas: Inicio (InicioCarga, InicioError, InicioSinCollar, InicioActividad, InicioRecordatorios); Perfil y Nutrición (PerfilNotificaciones, PerfilCuenta, NutricionAvisos); Salud y Peso (SaludEstados, SaludSinMascota, PesoEstados, PesoRegistrado); Zonas (ZonasEliminar, ZonasVacio, ZonasSinCollar, ZonasSoloLectura, ZonasEstados); Editor (EditorZonaEstados, EditorZonaSoloLectura, EditorZonaNueva, EditorZonaError); Mapa (MapaCarga, MapaError, MapaSinMascotas, MapaSinRastreo, MapaSinUbicacion, MapaModoPerdidoError); Collar y cuenta (VincularVinculado, VincularDesvincular, RecuperarEnviado, NuevaMascota2).

Sin dibujar, por depender de decisiones abiertas o por no existir en la app: `pet-hero-error` y mascota sin foto (decisión abierta de #195); "guardando" del Editor (R13 de #189: no cambia el aspecto); cuenta atrás de `forgot-resend` (la app no la tiene); variantes «Hoy» y «Vencida» del recordatorio y otras métricas del selector del gráfico semanal; variante «Meses aprox.» del paso 2 de NuevaMascota; error `pairing.errorForbiddenRelease`.

Desvíos a revisar: confirmaciones de borrar zona y desvincular son `Alert.alert` nativo en la app y hoja inferior en el canvas; copy de `InicioError` en Voz B fuera del catálogo («No pude cargar a tus mascotas», «Revisa tu conexión y vuelve a intentarlo»); `MapaCarga` usa un keyframe local `pulse`; el aviso de notificaciones bloqueadas de Perfil va bajo el hero y no sobre el selector; los skeletons del canvas tienen la forma del contenido final y los de la app son bloques.
