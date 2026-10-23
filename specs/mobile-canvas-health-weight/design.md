---
feature: "mobile-canvas-health-weight"
status: approved
tags: [mobile, ui, spec, canvas-parity]
---

# Diseño — [[mobile-canvas-health-weight]]

## Premisas contrastadas

Verificadas contra el árbol `origin/dev` 71ff81a1 con `grep` y lectura, no
heredadas de otra spec.

| Premisa | Dónde | Consecuencia |
|---|---|---|
| `PetSwitcher` ya tiene `variant?: 'default' \| 'avatars' \| 'glass'`; la de avatares pinta `pet-chip-${id}` y `pet-avatar-fallback-${id}` con `text-sm font-extrabold` | `components/pet-switcher.tsx` | R13 solo elige la variante (D5) |
| `fmtDate(date: string, locale)` parte `YYYY-MM-DD` con `split('-')` y construye la fecha local | `screens/home/format.ts` | Los helpers nuevos copian el patrón: sin desfase por zona horaria |
| `SCREEN_FILES` se deriva de `ALL_USES` sin repetidos | `__tests__/ui-language.test.ts` | Al mover la única fila de `src/app/_layout.tsx`, `SCREEN_FILES` baja en 1 (R25) |
| `WeightChart` no tiene `variant`; sus testIDs son `weight-chart`, `weight-chart-empty` y `weight-chart-points`; usa `LinearGradient` de `react-native-svg` y `MOTION_FILL_TIMING` | `components/weight-chart.tsx` | R5 y R6 conservan los tres testIDs |
| LG `#61 R4` enumera `inkSites` por fichero y suma el total; `#61 R5` enumera `warningSites` | `__tests__/legibility-classnames.test.ts` | Filas health y weight-log enmendadas (§Candados) |
| La carta lista los radios fuera de escala en frases exactas por feature dentro de la regla 12, y DD comprueba cada frase con `split(...)` de longitud 2 | `docs/ui-guidelines.md`, DD `#179 R2` | La Enmienda #199 añade frases nuevas; no edita las de otras features |
| CC fija el literal `'size-8 shrink-0 items-center justify-center rounded-xl ${tileClassName}'` | `__tests__/consistency-classnames.test.ts` | R10 conserva el nombre `tileClassName` y solo cambia `size-8` → `size-9` |
| WL envuelve el render de `#148 R7` en `HeaderHeightContext.Provider value={91}` y espera 291 | `screens/weight-log/index.test.tsx` | Con offset 0 la cifra pasa a 200 (R2) |
| `--color-tab-pill` es `rgba(23,130,85,0.14)`, el `--pill` del canvas; `bg-surface-secondary` es el `--surface2` | `theme/global.css` | Área y tarjetas sin color nuevo |
| No existe `--text-34`; sí `--text-11/13/15/17/22/24/26/28` | `theme/global.css` | Token nuevo (D22) |
| El `circle` del canvas es `r="5" fill="var(--accent-strong)"`; `@keyframes pop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08);opacity:1}` | `canvas/Peso.dc.html` | R5.7: pico al 60 % (240 ms) y asiento en 160 ms |
| `ScreenHeader`, `useShadows`, `MOTION_RISE_*` y `leading-body` no están en la base | `test ! -e src/components/screen-header.tsx` | D25: la implementación espera a #197 |

## Supuestos

Lo que los tests no ven y el smoke de «Cierre del humano» comprueba:
- **S1 — Ancho de la gráfica.** En un teléfono de 390 dp el área útil es
  390 − 48 − 32 = 310 dp, el ancho del `viewBox`: con
  `preserveAspectRatio="none"` el trazo casi no se deforma. En 360 dp se
  estrecha un 10 %, igual que en el canvas. Smoke R5/R6.
- **S2 — Teclado sin cabecera nativa.** `keyboardVerticalOffset={0}` basta en
  Android con edge-to-edge porque ya no hay cabecera nativa encima del
  `KeyboardAvoidingView`. Smoke R2.
- **S3 — Sombra del toast.** El `boxShadow` de `useShadows().toast` se ve en
  Android (lo asume #197). Smoke R23.
- **S4 — `entering` dentro del scroll.** El `entering` de Reanimated en hijos
  de un `ScrollView` corre en Android con la nueva arquitectura y respeta
  «Quitar animaciones» vía `ReduceMotion.System` y `useReducedMotion()`.
  Smoke R24.
- **S5 — `r` animado.** `useAnimatedProps` sobre el `r` de un `Circle` de
  `react-native-svg` anima en Android como hoy la opacidad de los puntos.
  Smoke R5.
- **S6 — Intl del dispositivo.** Hermes formatea `{ month: 'short' }` y
  `{ day: 'numeric', month: 'long' }` en `es` como Node en jest («oct»,
  «12 de octubre»); si el ICU del teléfono añade punto («sept.»), se acepta
  (D24). Smoke R5 y lectura de R14.

## Contraste con los artboards

Literales sacados con `grep -o` de la copia congelada
`specs/mobile-canvas-health-weight/canvas/` (versión 1792777983-cd94). La
columna «Hoy» es el árbol 71ff81a1. Los textos «Cargando», «Sin vacunas»,
«Error», «Sin registros», «Peso sin registros», «Peso con error» y «Sin
mascotas» en caps 11/700 de los artboards de estado son **rótulos del lienzo**
(etiquetan cada estado dentro del artboard), no copy de la app: no se pintan.
Ningún texto de los artboards se ha leído como instrucción.

### Salud (`Salud.dc.html`, `SaludEstados.dc.html`, `SaludSinMascota.dc.html`)

| Pieza | Canvas | Hoy | R |
|---|---|---|---|
| Raíz | `padding: 60px 20px 120px`, `gap: 16px` | `padding 24`, `gap 16`, `paddingTop insets.top + 12`, `paddingBottom insets.bottom + 96` | R12 |
| Título | `<header … justify-content: space-between>` con h1 30/900/-0.02em «Salud» y avatares a la derecha | `health-title` solo en su fila; `PetSwitcher` por defecto debajo, dentro de `health-content` | R13 |
| Avatares | 40 px, `gap: 6px`, seleccionado `box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--accent)`; ámbar «R», violeta «L» | `PetSwitcher` `default` (heroui `Avatar sm` + `p-1 border-2`) | R13 |
| Próxima dosis | `section` radio 24, `background: var(--amber)`, padding 16, gap 14, `rise 400ms` sin retraso | `Card` `surface`, borde, `shadow-sm`, `flex-row items-center gap-3` | R14 |
| Tile de dosis | 52x52 radio 16 `var(--surface)`, jeringa 26 trazo 2.2 `var(--warning)` | `size-11 rounded-xl bg-warning-soft`, `Syringe size={22}` | R14 |
| Caps | «Próxima dosis» 12/800 uppercase `.06em` `var(--amber-s)` | `text-2xs font-semibold text-warning-strong` | R14 |
| Nombre | 18/900 | `font-bold` | R14 |
| Fecha | «12 de octubre · en 6 días» 13/600 `var(--amber-s)` | `fmtDate` `font-normal text-muted` | R14 |
| Cuenta | «6d» 28/900 `var(--amber-s)` | `text-lg font-black text-warning-strong` | R14 |
| h2 | «Vacunas» 18/800, `margin: 4px 0 0` | `HeartPulse 20` + caps `text-xs font-semibold uppercase tracking-widest text-muted` | R15 |
| Lista | `gap: 10px` | `gap-3` del `vaccines-section` | R15 |
| Fila | `article` radio 20, `surface`, `border: 1px solid var(--border)`, padding 14, gap 12, `rise` 80/140/200 | `Card` (`p-4`, `shadow-sm`) `flex-row items-center gap-3` | R16 |
| Tile de fila | 40x40 radio 12; verde `var(--green)`/`var(--green-s)` + check, ámbar `var(--amber)`/`var(--amber-s)` + reloj; icono 20 trazo 2.4 | `size-10 rounded-xl` + `CATEGORY_SLOTS[slot].surface`, `Check`/`Clock` 20 | R16 |
| Nombre de fila | 15/800 | `font-bold` | R16 |
| Subtítulo | una línea 12 muted «Aplicada 3 mar 2026 · Próxima 3 mar 2027» | dos líneas `font-normal` con ISO crudo | R17 |
| Tarjeta de peso | `section` radio 24, `var(--surface2)`, padding 16, gap 12, `rise 400ms ease-out 260ms`, sin borde ni sombra | `Card` `weight-card` `gap-3` | R18 |
| Cabecera de peso | `align-items: flex-end; justify-content: space-between`; columna gap 2 con «Peso» 13/700 muted y «12.4 kg» 30/900; píldora `padding: 4px 10px; border-radius: 999px; background: var(--rose); color: var(--rose-s); font-size: 13px; font-weight: 800` «+0.3 kg» | «Peso» `text-base font-bold`, cifra `text-xl font-black text-accent-strong`, variación en otra fila `font-normal text-muted` | R18 |
| Gráfico mini | `height="56" viewBox="0 0 310 56" preserveAspectRatio="none"`, línea `var(--accent-strong)` trazo 3 round, `stroke-dasharray="400"`, `draw 1200ms ease-out 300ms`, `circle … r="5"` sin `pop`; sin área ni rejilla | `WeightChart` completo (viewBox 100x40, alto 120, área, puntos) | R6 |
| Enlace | `padding: 12px 14px; border-radius: 14px; background: var(--surface)`, 15/700 `var(--fg)`, chevron 18 trazo 2.4 | `rounded-xl bg-default px-3 py-2`, `font-semibold`, `ChevronRight size={20}` | R18 |
| Carga de vacunas | fila esqueleto: radio 20, `surface`, borde, padding 14, gap 12; tile 40x40 radio 12 `var(--default)`; barras 35 % x 14 radio 7 y 70 % x 10 radio 5, gap 6; `pulse 1.4s` | `Skeleton` `h-24 w-full rounded-card` | R19 |
| Vacunas vacías | `p` 15 `line-height: 1.4` muted «Aún no hay vacunas» | `vaccines-empty` `font-normal text-muted` | R19 |
| Error de vacunas | `p role="alert"` 15/1.4 `var(--danger)` «No se pudieron cargar las vacunas»; botón 44 alto, `padding: 0 20px`, radio 14, `accent`, `box-shadow: 0 4px 0 var(--lip)`, 800 15 «Reintentar» | `Text text-danger` + `Button` heroui por defecto | R19 |
| Peso vacío / error | misma `section` `surface2` radio 24 padding 16 gap 12, «Peso» 13/700 muted, `p` 15/1.4 muted «Aún no hay registros de peso» o `var(--danger)` «No se pudo cargar el peso», y el enlace | dentro de la `Card` | R20 |
| Carga de mascotas | dos círculos 40 `var(--default)` `pulse`, gap 10 | `Skeleton` `h-12 w-full rounded-card` | R21 |
| Error de mascotas | `p` 15/1.4 `var(--danger)` «Algo salió mal» + mismo botón «Reintentar» | `Text text-danger` + `Button` | R21 |
| Sin mascotas | `EmptyState` de Pingo (160, «Aún no tienes mascotas», cuerpo, «Añadir mascota» 56/16 labio 4) con `rise 400ms` | `EmptyState` `health-empty` | R21 (se conserva) |

### Peso (`Peso.dc.html`, `PesoEstados.dc.html`, `PesoRegistrado.dc.html`)

| Pieza | Canvas | Hoy | R |
|---|---|---|---|
| Raíz | `padding: 56px 20px 32px`, `gap: 14px` | `padding 24`, `gap 16`, `paddingBottom insets.bottom + 24`, cabecera nativa | R2 |
| Cabecera | volver 44 `margin-left: -10px`, chevron 24 trazo 2.4; h1 24/900/-0.02em «Registro de peso» en la misma fila | título nativo `t('weightLog.weightLog')` en `_layout.tsx` | R1 |
| Tarjeta del gráfico | `section` radio 24, `var(--surface2)`, padding 16, gap 8, `rise 400ms ease-out both` | `Card` `weight-chart-card` `gap-4` | R3 |
| Cifra y delta | `align-items: baseline; gap: 8px`; «12.4 kg» 34/900; «+0.3 kg este mes» 14/800 `var(--danger)` sin icono | `weight-current` `text-3xl font-black`; delta con icono 15 + `text-sm font-semibold` | R4 |
| Gráfico completo | `height="110" viewBox="0 0 310 110" preserveAspectRatio="none"`; rejilla `stroke="var(--border)" stroke-width="1"` `M0 20H310M0 55H310M0 90H310`; área `fill="var(--pill)"`; línea trazo 3 `stroke-dasharray="420"` `draw 1200ms ease-out 200ms`; `circle … r="5"` con `pop 400ms ease-out 1300ms` | viewBox 100x40, alto 120, degradado, puntos r3 en cada dato | R5 |
| Meses | fila `justify-content: space-between; font-size: 11px; font-weight: 700; color: var(--muted)`: `may jun jul ago sep oct` | ausente | R5 |
| Formulario | UNA `form` radio 24, `surface`, borde 1, padding 14, gap 10, `rise 400ms ease-out 80ms`; rejilla 2 columnas gap 10 (Peso, Fecha), Condición a ancho completo | `Card gap-4` con 3 campos apilados | R7 |
| Labels | 13/800, gap 6: «Peso», «Fecha de medición», «Condición corporal» | `Label` heroui con `className` inerte | R7 |
| Inputs | alto 48, radio 12, `var(--default)`, `border: 2px solid transparent`, `padding: 0 12px`, `font: 600 15px` | `Input className="rounded-xl bg-default"` | R7 |
| Enviar | alto 52, radio 14, `accent`, `box-shadow: 0 4px 0 var(--lip)`, `font: 800 16px` «Registrar peso» | `h-14 rounded-16` + `chunkyLip.primary`, `text-17` | R8 |
| Historial | h2 17/800 `margin: 0 0 4px` «Historial» | ausente | R9 |
| Fila | `border-top: 1px solid var(--border)`, `padding: 10px 0`, gap 12, `rise` 140/200/260 | `HeroUICard` con borde, `shadow-sm`, radio 12 | R9 |
| Tile de fila | 36x36 radio 12, icono 18 trazo 2.4; sube `var(--rose)` + `var(--danger)`; baja `var(--green)` + `var(--accent-strong)`; igual `var(--default)` + `var(--muted)` | `size-8` + `bg-danger-soft`/`bg-success-soft`/`bg-default`, icono 15 | R10 |
| Textos de fila | «12.4 kg » 15/800 con delta inline 13 (`--danger` / `--accent-strong` / `--muted`); «CC 5/9» 12 muted; fecha «1 oct» 13/600 muted | `font-bold`; delta `text-xs font-semibold text-success`; fecha ISO cruda `text-xs` | R10, R11 |
| Carga | 3 filas esqueleto: tile 36 radio 12, barras 40 % x 14 radio 7 y 22 % x 10 radio 5, fecha 38 x 12 radio 6; `rise` 0/60/120 | `Skeleton` `h-40 w-full rounded-card` sobre todo el contenido | R22 |
| Vacío | `p` 15/1.4 muted «Aún no hay registros de peso» bajo el formulario (sin tarjeta de gráfico) | `weight-log-empty` `text-muted` | R22 |
| Error | `p role="alert"` 15/1.4 `var(--danger)` «Algo salió mal» + botón 44/20/14 con labio | `Text text-danger` + `Button` | R22 |
| Toast | `position: absolute; top: 98px`, `fade 300ms ease-out 400ms`; píldora `padding: 10px 16px; border-radius: 999px; background: var(--surface); border: 1px solid var(--border); box-shadow: 0 2px 8px rgba(13,17,23,0.10); font-size: 14px; font-weight: 600`; check 16 trazo 2.6 `var(--accent-strong)`; «Anotado. Ya lo puse en la gráfica.» | `absolute top-4`, `shadow-sm`, `Check` en `success`, «Peso registrado» | R23 |

## Dependencias y precondiciones

- **#197 mergeada en `dev`** (D25): aporta `ScreenHeader`, `useShadows()`,
  `MOTION_RISE_TIMING`, `MOTION_RISE_OFFSET_Y`, `leading-body`,
  `tracking-title` y F197. Tras mergearla, el implementador re-mide las anclas
  marcadas `(#197: …)` en requirements §Base medida y la firma de
  `ScreenHeader` (`testID`, `backFallback`, `title`, `size`); si difiere, para.
- **#198 en paralelo** (Inicio): puede tocar `screens/home/format.ts`,
  `theme/global.css`, `i18n/catalog.ts` y `ui-copy-table.ts`. Esta feature
  solo **añade** en esos ficheros; si #198 mergea antes con `--text-34`, la
  línea es idéntica y queda una (D22).
- **#196** (Perfil) ya dejó `variant="avatars"` en `PetSwitcher`: no se toca.
- Worktree con `.env` copiado y `bun install --frozen-lockfile`; nada de
  dependencias nuevas (`expo-linear-gradient` vetado), ni coste ni AWS.

## Decisiones técnicas

1. **Una entrada, un componente.** `RiseIn` envuelve cada tarjeta o fila; no
   se reutiliza `HomeEntrance` porque usa muelle y el canvas pide `rise`
   (400 ms, curva fija). Sin `RiseIn` anidados.
2. **Una gráfica, dos variantes.** `WeightChart` calcula puntos con una sola
   función parametrizada por la geometría de la variante
   (`{ height, top, span, flat }`: completa `110, 80, 40, 60`; mini
   `56, 44, 26, 31`). La longitud del trazo se calcula sumando
   `Math.hypot` de cada tramo.
3. **Tonos en un solo sitio por pantalla.** Peso declara una constante
   `DELTA_TONE` con `up`, `down` y `flat`, cada una con `tile`
   (`CATEGORY_SLOTS.rose.surface`, `CATEGORY_SLOTS.green.surface`,
   `'bg-default'`), `text` (`'text-danger'`, `'text-accent-strong'`,
   `'text-muted'`) y el token del icono; el delta del mes y el de cada fila la
   comparten, así `text-accent-strong` sale una vez (LG `#61 R4`). Salud
   declara `VARIATION_TONE` con `CATEGORY_SLOTS.rose`, `CATEGORY_SLOTS.green`
   y `{ surface: 'bg-default', ink: 'text-muted' }`.
4. **Fechas.** `fmtDayMonth`, `fmtDayMonthLong` y `fmtMonthShort` viven junto a
   `fmtDate` en `screens/home/format.ts` y parten la cadena como ella.
   `chartMonths` vive en `components/weight-chart.tsx` porque es geometría de
   la gráfica, no formato.
5. **Enmienda #199 de la carta.** Texto literal que el implementador copia a
   `docs/ui-guidelines.md`: el bloque con título al final del documento; las
   dos frases marcadas «regla 2» y «regla 12» al final de esas reglas (antes
   de `3.` y de `13. **Botón con cuerpo**`). CF comprueba cada frase.

```markdown
## Enmienda #199: Salud y Peso al canvas (2026-10-23)

- **`rise` en Salud y Peso (#199).** `RiseIn` (`components/rise-in.tsx`) aplica `MOTION_RISE_TIMING` y `MOTION_RISE_OFFSET_Y` a tarjetas y filas con los retrasos del canvas: Salud 0 (próxima dosis), `80 + 60 · min(i, 2)` (vacunas) y 260 (peso); Peso 0 (gráfica), 80 (formulario), `140 + 60 · min(i, 2)` (historial) y `60 · i` (esqueletos). Con reduce motion no hay entrada.
- **`draw` y `pop` de la gráfica de peso (#199).** La línea se dibuja con `MOTION_DRAW_TIMING` (1200 ms, `Easing.bezier(0, 0, 0.58, 1)`) tras `MOTION_DRAW_DELAY_FULL_MS` (200) en Peso o `MOTION_DRAW_DELAY_MINI_MS` (300) en Salud; el último punto de Peso hace `pop` (0.6 → 1.08 → 1 en `MOTION_POINT_POP_MS`, 400) a los `MOTION_POINT_POP_DELAY_MS` (1300). Con reduce motion salen completos.
- **Fundido del toast de Peso (#199).** `FadeIn` de `MOTION_TOAST_FADE_MS` (300) tras `MOTION_TOAST_DELAY_MS` (400), con la sombra `useShadows().toast`.
```

Regla 2: `Tamaños fuera de la escala, por fidelidad al canvas (#199): \`--text-34\` (34 px), cifra de Peso.`

Regla 12: `Fuera de la escala, por fidelidad al canvas (#199): \`rounded-24\` (24 px), tarjeta de la gráfica de Peso, panel de la próxima dosis y tarjeta de peso de Salud, que son \`View\` con \`CONTINUOUS_CORNER\`; \`rounded-16\` (16 px), tile del panel de la próxima dosis; \`rounded-14\` (14 px), enlace al registro de peso de Salud.`

## Archivos afectados

Solo capa de presentación de `mobile-pet-tracker/`; ni dominio, ni
aplicación, ni infraestructura, ni backend.

| Fichero | Cambio | R |
|---|---|---|
| `src/components/rise-in.tsx` (nuevo) | `RiseIn` | R24 |
| `src/components/__tests__/rise-in.test.tsx` (nuevo) | RI | R24 |
| `src/components/weight-chart.tsx` | `variant`, geometría 310, `chartMonths`, `draw`, `pop`, meses | R5, R6 |
| `src/components/__tests__/weight-chart.test.tsx` | WC | R5, R6 |
| `src/screens/weight-log/index.tsx` | cabecera, métricas, tarjeta, formulario, historial, estados, toast | R1–R4, R7–R11, R22, R23 |
| `src/screens/weight-log/index.test.tsx` | WL | ídem |
| `src/screens/health/index.tsx` | cabecera, panel, vacunas, peso, estados | R12–R21 |
| `src/screens/health/index.test.tsx` | HE | ídem |
| `src/screens/home/format.ts` | `fmtDayMonth`, `fmtDayMonthLong`, `fmtMonthShort` | R5, R11, R14 |
| `src/screens/home/__tests__/format-dates.test.ts` (nuevo) | DT | R5, R11, R14 |
| `src/app/_layout.tsx` | `weight-log` con `headerShown: false` | R1 |
| `src/app/__tests__/layout.test.tsx`, `src/app/__tests__/detail-stack.test.tsx` (si rojo) | filas de weight-log | R1 |
| `src/theme/global.css`, `src/theme/motion.ts` | `--text-34`, siete constantes | R27 |
| `src/i18n/catalog.ts`, `src/__tests__/ui-copy-table.ts` | siete claves, filas | R25 |
| `src/__tests__/health-weight-canvas-fidelity.test.ts` (nuevo) | CF | R24–R27 |
| DD, CC, LG, PCF, UL, F197, CTA (si rojo) | filas de §Candados | — |
| `docs/ui-guidelines.md` | Enmienda #199 | R24 |

No se tocan `components/pet-switcher.tsx`, `components/card.tsx`,
`components/screen-header.tsx` ni `screens/home/index.tsx`.

## Alternativas descartadas

- **Reutilizar `HomeEntrance`**: muelle en vez de `rise`; cambiar su curva
  movería Inicio (#198).
- **Un `MiniWeightChart` aparte**: duplica la normalización y el trazo; una
  prop cuesta menos.
- **Mantener el degradado**: el canvas rellena con `--pill` plano.
- **Cabecera nativa con título** (D2): el canvas pone volver y título en una
  fila del contenido, y #197 ya da la pieza.
- **Formulario como `View` `rounded-24`** (D11) y **envío 52/14** (D3):
  revierten más candados de los que ganan en fidelidad.
- **Píldora de variación con `Chip` de heroui**: `cn()` expulsa `text-13`.
- **Tabla propia de meses** (D24): doce claves por idioma para cambiar «sept»
  por «sep».

## Riesgos

- **Firma de `ScreenHeader` distinta al mergear #197**: R1 se re-mide antes de
  empezar (D25).
- **Conflictos con #198** en `format.ts`, `global.css`, `catalog.ts` y
  `ui-copy-table.ts`: solo añadidos; se resuelven conservando ambos.
- **Zona horaria ciega en jest**: `process.env.TZ` no cambia `Date` en jest;
  los helpers son seguros por construcción (parten la cadena) y DT cruza mes
  y año.
- **Ventanas de timers**: los `it` de R5, R6 y R22 miden en el ms anterior al
  arranque y tras duración + retraso completos, nunca a mitad de curva salvo
  el pico del `pop`, que se mide al final de su tramo (1540 ms).
- **Recuentos agregados** (CC `#62 R14`/`#62 R15`, PCF `text-13`): se re-miden
  al terminar (tasks §Cuentas), no se copian de esta spec.
- **RNTL 14**: `fireEvent` y `act` asíncronos; cada `await` cuenta para no
  contaminar el `it` siguiente.
