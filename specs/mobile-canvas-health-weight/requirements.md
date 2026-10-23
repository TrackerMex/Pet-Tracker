---
feature: "mobile-canvas-health-weight"
status: approved       # draft | spec_ready | approved
tags: [mobile, ui, spec, canvas-parity]
---

# Requisitos — [[mobile-canvas-health-weight]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.

**Alcance.** Salud (`src/screens/health/index.tsx`), Peso
(`src/screens/weight-log/index.tsx`) y la gráfica compartida
(`src/components/weight-chart.tsx`) quedan iguales a los artboards Salud,
SaludEstados, SaludSinMascota, Peso, PesoEstados y PesoRegistrado de la
versión 1792777983-cd94, congelados en `specs/mobile-canvas-health-weight/canvas/`.
Precedencia: el canvas manda en lo visual y el movimiento; el copy sigue la
Voz B de Pingo (`docs/ui-guidelines.md`); lo que el canvas no dibuja se
conserva (decisión del humano del 2026-10-21: X01-X17 y los estados se
quedan). La feature **consume** los cimientos de #197
(`ScreenHeader`, `useShadows().toast`, `RiseIn`, `MOTION_RISE_TIMING`,
`MOTION_RISE_OFFSET_Y`, `leading-body`) y no los redefine. Rutas de código
relativas a `mobile-pet-tracker/src/` salvo que se diga otra cosa.

Abreviaturas de test: **WL** `screens/weight-log/index.test.tsx`, **HE**
`screens/health/index.test.tsx`, **WC** `components/__tests__/weight-chart.test.tsx`,
**DT** `screens/home/__tests__/format-dates.test.ts` (nuevo), **CF**
`__tests__/health-weight-canvas-fidelity.test.ts` (nuevo), **LY**
`app/__tests__/layout.test.tsx`, **UL** `__tests__/ui-language.test.ts`,
**DD** `__tests__/design-drift.test.ts`, **CC**
`__tests__/consistency-classnames.test.ts`, **LG**
`__tests__/legibility-classnames.test.ts`, **CTA**
`__tests__/chunky-cta-canvas-fidelity.test.ts`, **PCF**
`__tests__/profile-canvas-fidelity.test.ts`, **TH**
`__tests__/tab-headers-canvas.test.ts`, **F197**
`__tests__/canvas-foundations.test.ts` (llega con #197).

Convenciones (las de #197): cada `describe` nuevo se titula
`#199 R<n>: …` y cada `it` nuevo empieza por `#199 R<n>`; un `it` existente que
cambia conserva su título y añade el sufijo ` (enmendado por #199 R<n>)`. Un
`it` que se ponga rojo y **no** figure en §Candados que esta feature revierte
hace parar al implementador, que lo anota en
`progress/impl_mobile-canvas-health-weight.md` y no lo «arregla».

## Decisiones con defecto

Ninguna queda abierta. El leader firma o cambia el defecto; la columna «Si
cambia» dice qué requisitos y candados se mueven.

| Id | Decisión | Defecto | Por qué | Si cambia |
|---|---|---|---|---|
| D1 | Margen lateral (el canvas usa 20) | **24** en Salud y en Peso | `docs/conventions.md` «Dimensiones de pantalla uniformes»; la excepción de margen 20 no se extiende a estas pantallas; mismo criterio que #195 D1 | A 20: R2 y R12 cambian `paddingHorizontal`; se re-miden HE `#168 R2` y WL `R7` |
| D2 | Cabecera de Peso | `ScreenHeader` de #197 (`size={24}`, `backFallback="/health"`, `title={t('weightLog.weightLog')}`) como primer hijo del scroll; la ruta `weight-log` pasa a `options={{ headerShown: false }}`; el `KeyboardAvoidingView` deja `HeaderHeightContext` y usa `keyboardVerticalOffset={0}` | Punto 7 de la Enmienda #197 (quien adopta `ScreenHeader` apaga la cabecera nativa); sin cabecera nativa no hay alto que compensar | Conservar la nativa: R1 sale, R2 conserva `paddingTop` ausente y WL `#148 R7` sigue en 291 |
| D3 | Botón «Registrar peso» (canvas 52/14/16) | Conserva la receta canónica: `h-14 rounded-16 bg-accent` + `chunkyLip.primary` + `Text` 17/800 | Regla de radio único de los primarios sólidos (CC `#62 R1`, #177 R10) que comparten ocho formularios | A 52/14: se revierten CTA `#177 R3.1`/`R3.2`, CC `#62 R1`, CC `#166 R2` y DD `#179 R13` |
| D4 | «Reintentar» (canvas 44/14 con labio) | Conserva el `Button` actual en las tres ramas de error | CTA `#177 R8.4: destructivos, tonales y reintentos no reciben labio` fija lo contrario al canvas | Con labio: enmendar CTA `#177 R8.4` y la carta |
| D5 | Avatares de Salud | `PetSwitcher variant="avatars"` sin tocar (aro `border-2 border-accent p-0.75`, letra `text-sm`) | La variante la comparte Perfil (#196); su geometría (40 + 3 + 2 = 50) es la del aro del canvas | Con `useShadows().ring` y letra 16: tocar `components/pet-switcher.tsx` y sus tests, coordinar con #196 |
| D6 | API de `WeightChart` | Prop `variant?: 'full' \| 'mini'`, defecto `'full'` | Dos consumidores; el defecto deja a los tests de WC probando la completa | Prop obligatoria: tocar las dos llamadas y cada render de WC |
| D7 | Ventana de la gráfica completa | `full` pinta solo los registros de los **6 meses civiles** que acaban en el mes del registro más reciente (`entries[0].measuredAt`, la API los da en orden descendente) y rotula esos 6 meses; `mini` pinta el historial entero | El canvas rotula «Peso de los últimos 6 meses» y seis meses; la tarjeta de Salud no rotula nada | Sin ventana: R5 pierde el filtro y su `accessibilityLabel` |
| D8 | Longitud del trazo | `strokeDasharray` = longitud real de la polilínea (como #169 R1), no los literales `420`/`400` | Con datos reales 420 no cubre la línea | — |
| D9 | Eje x | Equiespaciado por índice (como hoy) | El canvas también equiespacia | — |
| D10 | Esqueletos | `Skeleton` de heroui-native con su animación propia (no `pulse 1.4s`) | Sin timing nuevo | Timing propio: entra en la Enmienda #199 |
| D11 | Formulario de Peso (canvas radio 24) | `Card variant="flat"` con `className="gap-2.5 py-3.5"` (radio 20) | DD `%s importa el Card compartido` exige `Card` en weight-log, y la fila del historial deja de ser `Card` | `View` con `rounded-24`: se revierte la fila `weight-log` de ese `it.each` |
| D12 | Inputs de Peso (canvas `600 15px`, borde 2 transparente) | `className="h-12 rounded-xl bg-default"`; la tipografía y el borde los pone heroui | `cn()` de heroui-native descarta `text-15` ante un color (#187 R1) | — |
| D13 | Labels de Peso (13/800) | `<Label>` con un `Text` de `react-native` hijo, `className="text-13 font-extrabold text-foreground"` | Receta «Text plano» de #187 R5; el `className` de `Label` es inerte | — |
| D14 | Iconos del historial (canvas: flechas diagonales) | Se quedan `TrendUp`/`TrendDown`/`Minus` de hoy, a 18 px | Sin icono nuevo ni candado de imports | Flechas: R10 cambia los imports de reicon |
| D15 | «6d» de la próxima dosis | `home.nextVaccineDays` (`'{{days}} d'`) no cambia: se lee «6 d» | Clave compartida con Inicio (#198 en paralelo) | «6d»: tocar la clave en `i18n/catalog.ts` y los tests de Inicio |
| D16 | Línea de la próxima dosis | `fmtDayMonthLong(fecha)` + ` · ` + `health.nextDoseToday` (0 días), `health.nextDoseTomorrow` (1) o `health.nextDoseInDays` (2 o más) | El canvas dice «12 de octubre · en 6 días»; «en 1 días» sería falta | — |
| D17 | Tono del delta | Sube: rosa + `danger`; baja: verde + `accent-strong`; igual o nulo: `default` + `muted`; los fondos y tintas pastel salen de `CATEGORY_SLOTS` | El canvas dibuja «sube» (rosa) y «baja» (verde); CC `centraliza las diez clases completas` prohíbe escribir `bg-category-*` fuera de su módulo | — |
| D18 | Retrasos de entrada | Salud: dosis 0, filas `80 + 60 · min(i, 2)`, peso 260. Peso: gráfica 0, formulario 80, filas `140 + 60 · min(i, 2)`, esqueletos `60 · i` | Literales del canvas; tope en el tercer hijo para listas largas | — |
| D19 | Entrada `rise` | `RiseIn` de #197 R24 (`components/rise-in.tsx`) sobre `MOTION_RISE_TIMING`/`MOTION_RISE_OFFSET_Y` de #197, y Enmienda #199 de la carta | Punto 4 de la Enmienda #197: otro elemento solo usa el timing de `rise` con enmienda | — |
| D20 | `draw`, `pop` y `fade` | Constantes nuevas en `theme/motion.ts` (R5, R23); el `pop` reutiliza `MOTION_POP_SCALE` (0.6) y `MOTION_CELEBRATION_POP_PEAK` (1.08) | Literales del canvas | — |
| D21 | Posición del toast (canvas `top: 98px`) | `top: insets.top + 42` (98 − 56 del `padding-top` del artboard) | Queda bajo la fila de cabecera, como en el canvas | — |
| D22 | Cifra de 34 px | Token nuevo `--text-34: 34px` en `theme/global.css` | Regla de nombres por valor (`--text-<px>`) | Si #198 lo añade antes, la línea es idéntica y se conserva una |
| D23 | «Historial» y tarjeta de la gráfica en Peso | Solo con 1 registro o más; carga, vacío y error no los pintan | PesoEstados no los dibuja | — |
| D24 | Fechas cortas | `toLocaleDateString` del dispositivo (como `fmtDate`); en `es` septiembre sale «sept» | Sin tabla propia de meses ni copy nuevo | Tabla propia: 12 claves nuevas |
| D25 | Dependencia de #197 | La implementación arranca con #197 mergeada en `dev`; las anclas que #197 mueve llevan `(#197: antes → después)` | Base congelada en `origin/dev` 71ff81a1, sin #197 | — |

## Base medida

Medida en `origin/dev` 71ff81a1 (sin #197). Cada ancla es `grep -cF` o
`test -e`; ninguna es número de línea. Las que #197 mueve llevan
`(#197: antes → después)`; el implementador las re-mide tras mergear #197
(D25) y, si la cifra no es la anotada, para.

```bash
cd mobile-pet-tracker
# Peso
grep -cF 'HeaderHeightContext' src/screens/weight-log/index.tsx                # 2 (sale entera: R2)
grep -cF 'keyboardVerticalOffset' src/screens/weight-log/index.tsx             # 1
grep -cF 'ScreenHeader' src/screens/weight-log/index.tsx                       # 0 (R1: >= 1)
grep -cF 'useShadows' src/screens/weight-log/index.tsx                         # 0 (R23: >= 1)
grep -cF 'HeroUICard' src/screens/weight-log/index.tsx                         # 3 (R9, R22: 0)
grep -cF '<Card' src/screens/weight-log/index.tsx                              # 2 (R3: el de la gráfica sale; R7 conserva el del formulario)
grep -cF 'h-40 w-full rounded-card' src/screens/weight-log/index.tsx           # 1 (R22: 0)
grep -cF 'absolute top-4' src/screens/weight-log/index.tsx                     # 1 (R23: 0)
grep -cF 'size-8 shrink-0' src/screens/weight-log/index.tsx                    # 1 (R10: 0)
grep -cF 'h-14 rounded-16 bg-accent' src/screens/weight-log/index.tsx          # 1 (R8: 1, no cambia)
grep -cF 'text-17' src/screens/weight-log/index.tsx                            # 1 (R9: 2)
grep -cF 'text-accent-strong' src/screens/weight-log/index.tsx                 # 0 (R4: 1)
grep -cF 'weight-month-delta' src/screens/weight-log/index.tsx                 # 2 (R4: 1, solo weight-month-delta-text)
grep -cF -- '-date`' src/screens/weight-log/index.tsx                          # 0 (R11: 1)
grep -cF "t('weightLog.history')" src/screens/weight-log/index.tsx             # 0 (R9: 1)
# Salud
grep -cF 'tracking-tight' src/screens/health/index.tsx                         # 1 (#197: 1 → 0)
grep -cF 'HeartPulse' src/screens/health/index.tsx                             # 2 (R15: 0)
grep -cF 'variant="avatars"' src/screens/health/index.tsx                      # 0 (R13: 1)
grep -cF 'rounded-14' src/screens/health/index.tsx                             # 0 (R18: 1)
grep -cF 'text-accent-strong' src/screens/health/index.tsx                     # 1 (R18: 0)
grep -cF 'text-warning-strong' src/screens/health/index.tsx                    # 2 (R14: 0)
grep -cF 'h-24 w-full rounded-card' src/screens/health/index.tsx               # 1 (R19: 0)
grep -cF 'h-12 w-full rounded-card' src/screens/health/index.tsx               # 1 (R21: 0)
grep -cF 'rounded-xl bg-default px-3 py-2' src/screens/health/index.tsx        # 1 (R18: 0)
grep -cF 'vaccines-title' src/screens/health/index.tsx                         # 0 (R15: 1)
grep -cF 'CATEGORY_SLOTS' src/screens/health/index.tsx                         # 2
# Gráfica
grep -cF 'viewBox="0 0 100 40"' src/components/weight-chart.tsx                # 1 (R5: 0)
grep -cF 'LinearGradient' src/components/weight-chart.tsx                      # 3 (R5: 0)
grep -cF 'variant' src/components/weight-chart.tsx                             # 0 (R6: >= 1)
# Raíz, tema y copy
grep -cF 'headerShown' src/app/_layout.tsx                                     # 2 (#197: 2 → 2; R1: 3)
grep -cF "t('weightLog.weightLog')" src/app/_layout.tsx                        # 1 (R1: 0)
grep -cF -- '--text-34' src/theme/global.css                                   # 0 (R27: 1)
grep -cF 'MOTION_DRAW' src/theme/motion.ts                                     # 0 (R27: 3)
grep -cF 'MOTION_RISE' src/theme/motion.ts                                     # 0 (#197: 0 → 2)
grep -cF "'weightLog.history'" src/i18n/catalog.ts                             # 0 (R25: 2)
grep -cF "'health.appliedOn'" src/i18n/catalog.ts                              # 0 (R25: 2)
grep -cF "file: 'src/app/_layout.tsx'" src/__tests__/ui-copy-table.ts          # 1 (R25: 0)
grep -cF "'src/screens/health/index.tsx'" src/__tests__/ui-copy-table.ts       # 18 (R25: 23)
grep -cF "'src/screens/weight-log/index.tsx'" src/__tests__/ui-copy-table.ts   # 19 (R25: 21)
grep -cF "'src/components/weight-chart.tsx'" src/__tests__/ui-copy-table.ts    # 1 (R25: 2)
grep -cF 'HeaderHeightContext.Provider value={91}' src/screens/weight-log/index.test.tsx  # 1 (R2: 0)
grep -cF 'export function fmtDay' src/screens/home/format.ts                   # 0 (R11, R14: 2)
test ! -e src/components/rise-in.tsx                                           # ausente (#197: ausente → presente, #197 R24)
test ! -e src/components/screen-header.tsx                                     # ausente (#197 lo crea)
test ! -e src/__tests__/canvas-foundations.test.ts                             # ausente (#197 lo crea)
test ! -e src/__tests__/health-weight-canvas-fidelity.test.ts                  # ausente (R26 lo crea)
test ! -e src/screens/home/__tests__                                           # ausente (DT lo crea)
ls ../specs/mobile-canvas-health-weight/canvas | wc -l                         # 6
```

## TestIDs

Se conservan todos los de hoy salvo `weight-month-delta` (R4: sale el
envoltorio, queda `weight-month-delta-text`) y `weight-chart-card`, que
cambia de `Card` a `View` con el mismo testID. Nuevos, contrastados con los
selectores por regex de HE (`/^pet-chip-/`, `/^vaccine-row-/`) y de WL
(`/^weight-row-weight-\d+$/`, `/^weight-(summary|chart)$/`,
`/^weight-(log-form|toast)$/`): ninguno casa con ellos.

| testID | Pantalla | R | Casa con un selector por regex |
|---|---|---|---|
| `weight-log-header`, `weight-log-header-back`, `weight-log-header-title` | Peso | R1 | no (`weight-log-form` va anclado con `$`) |
| `weight-form` | Peso | R7 | no |
| `weight-history-title` | Peso | R9 | no |
| `weight-row-${id}-date` | Peso | R11 | no (`/^weight-row-weight-\d+$/` va anclado con `$`) |
| `weight-log-skeleton-row-0..2` | Peso | R22 | no |
| `weight-chart-months` | gráfica | R5 | no (`/^weight-(summary\|chart)$/` va anclado con `$`) |
| `weight-chart-grid` | gráfica | R5 | no (anclado con `$`) |
| `health-header` | Salud | R12 | no |
| `vaccines-title` | Salud | R15 | no |
| `vaccine-dates-${id}` | Salud | R17 | no (no empieza por `vaccine-row-`) |
| `vaccines-skeleton-tile` | Salud | R19 | no |
| `health-loading-0`, `health-loading-1` | Salud | R21 | no |

## Requisitos funcionales

**Cómo leen los tests el retraso de `RiseIn`.** En HE y WL, un doble del
módulo `components/rise-in` (`jest.mock`) sustituye `RiseIn` por un `View`
host que conserva `testID`, `className` y los hijos y expone `delayMs` como
prop del host (un solo nivel, igual que el `Animated.View` real). El helper de
test `riseDelayOf(node)` sube por `.parent` hasta el primer host con esa prop y
la devuelve; `undefined` si no hay ninguno. El `RiseIn` real lo prueba #197 R24 (`components/__tests__/rise-in.test.tsx`).

### Cableado de cimientos (#197)

**R1 — Peso dibuja su propia cabecera.** WHEN se monta Peso, THE SYSTEM SHALL
pintar como primer hijo del scroll `weight-log-form` un `ScreenHeader` con
`testID="weight-log-header"`, `size={24}`, `backFallback="/health"` y
`title={t('weightLog.weightLog')}` (es «Registro de peso», en «Weight log»), y
la pantalla `weight-log` de `app/_layout.tsx` SHALL declarar
`options={{ headerShown: false }}` sin `title`.
- WL `#199 R1: Peso dibuja su propia cabecera` › `#199 R1 pinta weight-log-header como primer hijo del scroll con el título de weightLog.weightLog`
  (afirma `weight-log-header-title` con `es['weightLog.weightLog']` y que
  `weight-log-header-back` existe).
- WL `#199 R1: Peso dibuja su propia cabecera` › `#199 R1 sin historial la vuelta lleva a /health` (con `router.canGoBack()` falso, pulsar
  `weight-log-header-back` llama a la navegación de reemplazo con `/health`;
  usa el mismo doble de `expo-router` que el test de `ScreenHeader` de #197).
- LY `#95 R4` › `#194 R4: %s usa exactamente las opciones de cabecera acordadas`:
  la fila `['weight-log', 't:weightLog.weightLog']` pasa a afirmar
  `headerShown: false` sin título, con la forma que el `it.each` use para las
  rutas que ya apagan su cabecera (sufijo `(enmendado por #199 R1)`).

**R2 — Métricas del scroll de Peso.** WHILE Peso está montada, THE SYSTEM SHALL
dar a `weight-log-form` `contentContainerStyle`
`{ paddingHorizontal: 24, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32, gap: 14 }`
(D1, D2), y el `KeyboardAvoidingView` SHALL usar `keyboardVerticalOffset={0}`
sin importar `HeaderHeightContext`.
- WL `#199 R2: métricas del scroll de Peso` › `#199 R2 el scroll usa margen 24, inset superior + 8, inferior + 32 y gap 14`
  (`toEqual` exacto, calculado con los insets del doble del fichero).
- WL `#148 R7` › `el host screen-weight-log añade paddingBottom 291 al abrir el teclado`
  pasa a 200 (700 − 500 + 0) sin `HeaderHeightContext.Provider`, con sufijo
  `(enmendado por #199 R2)`; el título conserva «291» por la regla de
  títulos, y el cuerpo afirma 200.

### Peso

Orden de los hijos de `weight-log-form` con registros: `weight-log-header`,
gráfica (R3), formulario (R7), historial (R9). Sin registros, en carga o con
error: `weight-log-header`, formulario, nodo de estado (R22).

**R3 — Tarjeta de la gráfica.** WHEN hay 1 registro o más, THE SYSTEM SHALL
pintar `weight-chart-card` como `View` de `react-native` con
`className="gap-2 rounded-24 bg-surface-secondary p-4"` y `style`
`CONTINUOUS_CORNER`, sin borde ni sombra, dentro de un `RiseIn` con
`delayMs={0}`, conteniendo `weight-summary` (R4) y `WeightChart` con
`variant="full"` implícito (sin prop).
- WL `#199 R3: tarjeta de la gráfica de Peso` › `#199 R3 weight-chart-card es un View rounded-24 bg-surface-secondary p-4 gap-2 con esquina continua`.
- WL `#199 R3: tarjeta de la gráfica de Peso` › `#199 R3 con registros el scroll ordena cabecera, gráfica, formulario e historial`.
- WL `#199 R3: tarjeta de la gráfica de Peso` › `#199 R3 la tarjeta entra con RiseIn sin retraso` (`riseDelayOf` = 0).

**R4 — Cifra y delta del mes.** WHEN hay 1 registro o más, THE SYSTEM SHALL
pintar `weight-summary` con `className="flex-row items-baseline gap-2"`,
`weight-current` (`Text` de `react-native`) con
`className="text-34 font-black text-foreground"` y `TABULAR_NUMS`, y
`weight-month-delta-text` (`Text` de `react-native`, sin icono ni envoltorio
`weight-month-delta`) con `className` `text-sm font-extrabold ${tono}` y
`TABULAR_NUMS` (como hoy), donde
el tono es `text-danger` si el delta es > 0, `text-accent-strong` si es < 0 y
`text-muted` si es 0 (D17). La rama sin delta del mes conserva lo que fija
hoy `#169 R7`.
- WL `#199 R4: cifra y delta del mes` › `#199 R4 la cifra usa text-34 font-black text-foreground`.
- WL `#199 R4: cifra y delta del mes` › `#199 R4 delta %s pinta %s sin icono` — `it.each` con tres filas
  (sube `text-danger`, baja `text-accent-strong`, igual `text-muted`); cada
  fila afirma la clase exacta y que `weight-month-delta` no existe.

**R7 — Un solo formulario en dos columnas.** WHILE Peso está montada, THE
SYSTEM SHALL pintar el formulario como
`Card variant="flat" className="gap-2.5 py-3.5"` con `testID="weight-form"`
dentro de un `RiseIn` con `delayMs={80}` (D11), cuyo primer hijo es un `View`
`flex-row gap-2.5` con dos columnas `flex-1 gap-1.5` (peso, fecha), seguido de
la columna `gap-1.5` de condición corporal a ancho completo y del botón (R8).
Cada etiqueta es `<Label>` con un `Text` de `react-native` hijo
`className="text-13 font-extrabold text-foreground"` (D13) y los literales
«Peso» (`weightLog.weight`), «Fecha de medición» (`weightLog.measuredAt`) y
«Condición corporal» (`weightLog.bodyCondition`); cada `Input` lleva
`className="h-12 rounded-xl bg-default"` (D12). Placeholders, validación y
`testID` de los campos no cambian.
- WL `#199 R7: formulario de Peso` › `#199 R7 weight-form es un Card flat con gap-2.5 py-3.5 y entra a los 80 ms`.
- WL `#199 R7: formulario de Peso` › `#199 R7 peso y fecha comparten la primera fila y la condición va debajo`.
- WL `#199 R7: formulario de Peso` › `#199 R7 las tres etiquetas pintan text-13 font-extrabold con su literal`.
- WL `#199 R7: formulario de Peso` › `#199 R7 los tres inputs llevan h-12 rounded-xl bg-default`.

**R8 — Envío sin cambios de receta.** WHILE Peso está montada, THE SYSTEM SHALL
pintar el botón de envío como último hijo de `weight-form`, con su receta de
hoy (`h-14 rounded-16 bg-accent`, `chunkyLip.primary`, `Text` 17/800, D3).
- WL `#199 R8: envío de Peso` › `#199 R8 el envío es el último hijo de weight-form y conserva h-14 rounded-16 bg-accent`.

**R9 — Historial.** WHEN hay 1 registro o más, THE SYSTEM SHALL pintar tras el
formulario un `Text` de `react-native` `weight-history-title`
(`accessibilityRole="header"`, `className="mb-1 text-17 font-extrabold text-foreground"`,
«Historial», `t('weightLog.history')`) seguido de una fila por registro en el
orden de la API; cada `weight-row-${id}` SHALL ser un `View` con
`className="flex-row items-center gap-3 border-t border-border py-2.5"` (sin
`HeroUICard`, sin sombra) dentro de un `RiseIn` con
`delayMs={140 + 60 * Math.min(index, 2)}` (D18). Con 0 registros no se pinta
`weight-history-title` (D23).
- WL `#199 R9: historial de Peso` › `#199 R9 pinta Historial con text-17 font-extrabold antes de las filas`.
- WL `#199 R9: historial de Peso` › `#199 R9 cada fila es un View con borde superior y py-2.5`.
- WL `#199 R9: historial de Peso` › `#199 R9 la fila %i entra a los %i ms` — `it.each` con
  cuatro filas: índice 0 → 140, 1 → 200, 2 → 260, 3 → 260.
- WL `#199 R9: historial de Peso` › `#199 R9 sin registros no pinta Historial`.

**R10 — Tile, cifra y delta de cada fila.** WHEN se pinta una fila, THE SYSTEM
SHALL pintar `weight-row-${id}-tone` con
`` className={`size-9 shrink-0 items-center justify-center rounded-xl ${tileClassName}`} ``
donde `tileClassName` es `CATEGORY_SLOTS.rose.surface` si el delta es > 0,
`CATEGORY_SLOTS.green.surface` si es < 0 y `bg-default` si es 0 o no hay
registro anterior, con `TrendUp`/`TrendDown`/`Minus` a 18 px en
`danger`/`accent-strong`/`muted` (D14, D17); a su derecha una columna con un
`Text` de `react-native` `className="text-15 font-extrabold text-foreground"`
que dice «{kg} kg » y anida `weight-row-${id}-delta` con `text-13 ${tono}`
(`text-danger`, `text-accent-strong`, `text-muted`) tomado de la misma
constante `DELTA_TONE` que R4 (design §Decisiones técnicas 3), de modo que
`text-accent-strong` sale una sola vez en el fichero, y debajo «CC n/9»
(`weightLog.bodyConditionValue`) en `text-xs text-muted` cuando hay condición
corporal.
- WL `#169 R8` › `fila %s con su tono, icono y texto` pasa a las clases nuevas
  con sufijo `(enmendado por #199 R10)`; conserva sus tres filas (sube, baja,
  primera/igual), una por rama.
- WL `#199 R10: fila del historial` › `#199 R10 la cifra pinta text-15 font-extrabold y anida el delta en text-13`.
- WL `#199 R10: fila del historial` › `#199 R10 sin condición corporal no pinta la línea CC`.

**R11 — Fecha corta de la fila.** WHEN se pinta una fila, THE SYSTEM SHALL
pintar a la derecha `weight-row-${id}-date` (`Text` de `react-native`,
`className="text-13 font-semibold text-muted"`) con
`fmtDayMonth(entry.measuredAt, locale)` de `screens/home/format.ts`, que parte
la fecha `YYYY-MM-DD` como `fmtDate` y formatea con
`{ day: 'numeric', month: 'short' }`.
- DT `#199 R11: fmtDayMonth` › `#199 R11 %s en %s se lee %s` — `it.each` que cruza mes y año:
  `('2025-12-31', 'es') → '31 dic'`, `('2026-01-01', 'es') → '1 ene'`,
  `('2026-10-01', 'es') → '1 oct'`, `('2026-01-01', 'en') → 'Jan 1'`.
- WL `#199 R11: fecha corta del historial` › `#199 R11 cada fila pinta su fecha corta en text-13 font-semibold text-muted`
  (registros `2025-12-31` y `2026-01-01`: «31 dic» y «1 ene»).

### WeightChart

`WeightChart` gana `variant?: 'full' | 'mini'` (D6, defecto `'full'`). Ambas
variantes conservan `testID="weight-chart"` en su raíz, `weight-chart-points`
en el grupo de puntos y el aviso `weight-chart-empty`
(`weightChart.notEnoughDataYet`) con menos de 2 puntos (WC `R8`). Los tonos
salen de los tokens de tema que la gráfica ya resuelve hoy (sin pedir
`'accent'`, LG `#61 R4`). Ninguna de las dos usa `LinearGradient`.

**R5 — Gráfica completa.** WHEN `WeightChart` se pinta sin `variant` o con
`'full'` y la ventana tiene 2 registros o más, THE SYSTEM SHALL:
1. Ventana (D7): tomar solo los registros cuyo `measuredAt` cae en los 6 meses
   civiles que acaban en el mes de `entries[0].measuredAt`, calculados por
   `chartMonths(latestIso: string): string[]` (exportada de
   `components/weight-chart.tsx`, devuelve seis `YYYY-MM-01` ascendentes).
2. Pintar un `Svg` de alto 110 y ancho `'100%'` con `viewBox="0 0 310 110"` y
   `preserveAspectRatio="none"`, con `accessibilityRole="image"` y
   `accessibilityLabel={t('weightChart.lastSixMonths')}` (es «Peso de los
   últimos 6 meses», en «Weight over the last 6 months»).
3. Rejilla `weight-chart-grid`: un `Path` `d="M0 20H310M0 55H310M0 90H310"`,
   trazo `border`, ancho 1.
4. Puntos en orden ascendente, `x = i / (n − 1) · 310` (D9) e
   `y = 80 − ((w − min) / (max − min)) · 40`, o `y = 60` si `max = min`.
5. Área: `Path` `` `${línea} L310 110 L0 110 Z` `` con relleno `tab-pill`
   (`--color-tab-pill`), quieta.
6. Línea: `Path` sin relleno, trazo `accent-strong`, ancho 3,
   `strokeLinecap="round"`, `strokeLinejoin="round"`,
   `strokeDasharray` = longitud real de la polilínea (D8) y `strokeDashoffset`
   animado de esa longitud a 0 con
   `withDelay(MOTION_DRAW_DELAY_FULL_MS, withTiming(0, MOTION_DRAW_TIMING))`
   (200 ms + 1200 ms, `Easing.bezier(0, 0, 0.58, 1)`).
7. Un único `Circle` en `weight-chart-points`, en el último punto, relleno
   `accent-strong`, radio base 5, con `pop` desde `MOTION_POINT_POP_DELAY_MS`
   (1300 ms): opacidad 0 → 1 en 240 ms y escala 0.6 → 1.08 en 240 ms y
   1.08 → 1 en 160 ms (`MOTION_POINT_POP_MS` = 400, pico al 60 %,
   `MOTION_POP_SCALE` y `MOTION_CELEBRATION_POP_PEAK`, curva
   `MOTION_CELEBRATION_EASE_OUT`); la escala se aplica como `r = 5 · escala`.
8. Bajo la `Svg`, `weight-chart-months`: `View` `flex-row justify-between` con
   seis `Text` de `react-native` `className="text-11 font-bold text-muted"`,
   uno por mes de `chartMonths`, con `fmtMonthShort(iso, locale)` de
   `screens/home/format.ts` (`{ month: 'short' }`, partiendo `YYYY-MM-DD` como
   `fmtDate`).
9. WHILE `useReducedMotion()` es verdadero, la línea sale con
   `strokeDashoffset` 0 y el punto con radio 5 y opacidad 1 desde el primer
   frame.
- WC `#199 R5: gráfica completa` › `#199 R5 pinta viewBox 0 0 310 110 a 110 de alto sin degradado`.
- WC `#199 R5: gráfica completa` › `#199 R5 pinta la rejilla de tres líneas en border`.
- WC `#199 R5: gráfica completa` › `#199 R5 normaliza 10, 12 y 11 kg a (0,80), (155,40) y (310,60)`.
- WC `#199 R5: gráfica completa` › `#199 R5 con pesos iguales la línea va a y 60`.
- WC `#199 R5: gráfica completa` › `#199 R5 strokeDasharray mide la polilínea real` ((0,80)→(310,40): `Math.hypot(310, 40)`).
- WC `#199 R5: gráfica completa` › `#199 R5 la línea sigue entera a los 199 ms y llega a 0 a los 1400 ms`.
- WC `#199 R5: gráfica completa` › `#199 R5 un solo Circle en el último punto con radio 5`.
- WC `#199 R5: gráfica completa` › `#199 R5 el punto sigue oculto a los 1299 ms, llega a radio 5.4 a los 1540 y a 5 a los 1700`.
- WC `#199 R5: gráfica completa` › `#199 R5 rotula los seis meses de la ventana` (más reciente `2026-03-10`, es: «oct nov dic ene feb mar»).
- WC `#199 R5: gráfica completa` › `#199 R5 deja fuera el registro del 2025-09-30 y conserva el del 2025-10-01`.
- WC `#199 R5: gráfica completa` › `#199 R5 se anuncia como Peso de los últimos 6 meses`.
- WC `#199 R5: gráfica completa` › `#199 R5 chartMonths de %s es %j` — `it.each`: `'2026-03-10'` →
  `2025-10-01 … 2026-03-01`; `'2026-06-30'` → `2026-01-01 … 2026-06-01`.
- WC `#199 R5: gráfica completa` › `#199 R5 bajo reduce motion la línea y el punto salen completos`.
- DT `#199 R5: fmtMonthShort` › `#199 R5 %s en %s se lee %s` — `it.each`:
  `('2025-12-01', 'es') → 'dic'`, `('2026-01-01', 'es') → 'ene'`,
  `('2026-05-01', 'en') → 'May'`.

**R6 — Gráfica mini.** WHEN `WeightChart` se pinta con `variant="mini"` y hay
2 registros o más, THE SYSTEM SHALL pintar el historial entero (sin ventana)
en un `Svg` de alto 56 con `viewBox="0 0 310 56"` y
`preserveAspectRatio="none"`, con `y = 44 − ((w − min) / (max − min)) · 26`
(o 31 si `max = min`), la misma línea de R5.6 pero con
`MOTION_DRAW_DELAY_MINI_MS` (300 ms), un único `Circle` final de radio 5 y
relleno `accent-strong` sin animación, y sin rejilla, área ni
`weight-chart-months`; la raíz SHALL quedar oculta a la accesibilidad
(`accessibilityElementsHidden` e
`importantForAccessibility="no-hide-descendants"`), porque la tarjeta ya dice
la cifra.
- WC `#199 R6: gráfica mini` › `#199 R6 pinta viewBox 0 0 310 56 a 56 de alto sin rejilla, área ni meses`.
- WC `#199 R6: gráfica mini` › `#199 R6 normaliza 10 y 12 kg a y 44 y 18, y pesos iguales a 31`.
- WC `#199 R6: gráfica mini` › `#199 R6 la línea sigue entera a los 299 ms y llega a 0 a los 1500 ms`.
- WC `#199 R6: gráfica mini` › `#199 R6 el punto final sale con radio 5 y opacidad 1 en el primer frame`.
- WC `#199 R6: gráfica mini` › `#199 R6 pinta registros de hace más de seis meses`.
- WC `#199 R6: gráfica mini` › `#199 R6 queda oculta a la accesibilidad`.

### Salud

Orden de los hijos del scroll de Salud: `health-header` y, detrás,
`health-content` (con mascotas) o `health-states` (carga, error o sin
mascotas). Hijos de `health-content`: `next-vaccine-card` (si hay próxima
dosis), `vaccines-section`, `weight-card`. Las métricas del scroll y el `gap`
de `health-content` no cambian (`#168 R2 aplica las métricas estándar…`).

**R12 — Cabecera de Salud.** WHILE Salud está montada, THE SYSTEM SHALL pintar
como primer hijo del scroll un `View` `health-header` con
`className="flex-row items-center justify-between"` cuyo primer hijo es
`health-title` (clase de #197, sin cambios de esta feature).
- HE `#199 R12: cabecera de Salud` › `#199 R12 con mascotas, health-header y health-content son los únicos hijos del scroll`.
- HE `#199 R12: cabecera de Salud` › `#199 R12 health-header es una fila justify-between que empieza por health-title`.
- HE `#168 R2` › `con mascotas, health-title y health-content son los únicos hijos del scroll, en ese orden`,
  `pone el PetSwitcher como primer hijo de health-content` y
  `sin contenido ($name), health-title precede a health-states` pasan a
  `health-header` (sufijo `(enmendado por #199 R12)`); el tercero conserva sus
  cinco ramas.

**R13 — Avatares en la cabecera.** WHEN la cuenta tiene mascotas, THE SYSTEM
SHALL pintar `PetSwitcher` con `variant="avatars"` como segundo hijo de
`health-header` (D5), con los mismos `selectedPetId` y `onSelect` de hoy.
- HE `#199 R13: avatares de Salud` › `#199 R13 el selector va en health-header tras health-title en su variante avatars`
  (afirma `pet-avatar-fallback-${id}` con `text-sm font-extrabold` y que
  `health-content` no contiene `pet-chip-*`).
- HE `#168 R2` › `cambia vacunas y peso al pulsar otra mascota` toma el selector
  de `health-header` en vez de `health-content`, con sufijo `(enmendado por #199 R13)`.

**R14 — Panel de la próxima dosis.** WHEN hay una próxima dosis, THE SYSTEM
SHALL pintar `next-vaccine-card` como `View` de `react-native` con
`` className={`flex-row items-center gap-3.5 rounded-24 p-4 ${CATEGORY_SLOTS.amber.surface}`} ``
y `style` `CONTINUOUS_CORNER`, sin borde ni sombra, dentro de un `RiseIn` con
`delayMs={0}`, con:
1. tile `View` `className="size-13 items-center justify-center rounded-16 bg-surface"`
   con `Syringe` a 26 px, `strokeWidth={2.2}`, color `warning`;
2. columna `flex-1`: caps `Text`
   `` `text-xs font-extrabold uppercase tracking-caps ${CATEGORY_SLOTS.amber.ink}` ``
   «Próxima dosis» (`health.nextDue`); nombre `Text`
   `className="text-lg font-black text-foreground"`; `next-vaccine-date`
   `Text` `` `text-13 font-semibold ${CATEGORY_SLOTS.amber.ink}` `` con
   `` `${fmtDayMonthLong(nextDoseAt, locale)} · ${relativo}` ``, donde
   `relativo` es `t('health.nextDoseToday')` («hoy») con 0 días,
   `t('health.nextDoseTomorrow')` («mañana») con 1 y
   `t('health.nextDoseInDays', { days })` («en {{days}} días») con 2 o más
   (D16), contando los días como hoy cuenta `next-vaccine-days`;
3. `next-vaccine-days` `Text`
   `` `text-28 font-black ${CATEGORY_SLOTS.amber.ink}` `` con `TABULAR_NUMS` y el
   copy de hoy (`home.nextVaccineDays` «6 d», `home.nextVaccineToday`, D15).
`fmtDayMonthLong(date, locale)` vive en `screens/home/format.ts`, parte
`YYYY-MM-DD` como `fmtDate` y formatea con `{ day: 'numeric', month: 'long' }`.
- HE `#199 R14: panel de la próxima dosis` › `#199 R14 next-vaccine-card es un View rounded-24 sobre el pastel ámbar con esquina continua`.
- HE `#199 R14: panel de la próxima dosis` › `#199 R14 el tile es size-13 rounded-16 bg-surface con la jeringa a 26 en warning`.
- HE `#199 R14: panel de la próxima dosis` › `#199 R14 caps, nombre y fecha llevan sus clases exactas`.
- HE `#199 R14: panel de la próxima dosis` › `#199 R14 la fecha dice %s` — `it.each` con una fila por rama, fechas que
  cruzan mes y año: hoy 2025-12-31 y dosis 2025-12-31 → «31 de diciembre · hoy»;
  hoy 2025-12-31 y dosis 2026-01-01 → «1 de enero · mañana»; hoy 2026-10-06 y
  dosis 2026-10-12 → «12 de octubre · en 6 días».
- HE `#199 R14: panel de la próxima dosis` › `#199 R14 entra con RiseIn sin retraso`.
- HE `#115 R6` › `ordena la card en icono, columna y días, con la fecha en la columna ($branch)`
  y `pinta los días con la receta exacta ($branch)`: sufijo
  `(enmendado por #199 R14)`, receta `text-28 font-black` + tinta ámbar.
- DT `#199 R14: fmtDayMonthLong` › `#199 R14 %s en %s se lee %s` — `it.each`:
  `('2025-12-31', 'es') → '31 de diciembre'`, `('2026-01-01', 'es') → '1 de enero'`,
  `('2026-10-12', 'en') → 'October 12'`.

**R15 — Título de Vacunas.** WHEN hay mascota seleccionada, THE SYSTEM SHALL
pintar como primer hijo de `vaccines-section` un `Text` de `react-native`
`vaccines-title` con `accessibilityRole="header"`,
`className="mt-1 text-lg font-extrabold text-foreground"` y «Vacunas»
(`health.vaccines`), sin `HeartPulse` ni caps, y `vaccines-section` SHALL
llevar `gap-2.5`.
- HE `#199 R15: título de Vacunas` › `#199 R15 Vacunas es un h2 de text-lg font-extrabold sin icono`.
- HE `#199 R15: título de Vacunas` › `#199 R15 vaccines-section separa sus hijos con gap-2.5`.

**R16 — Filas de vacunas.** WHEN se pinta una vacuna, THE SYSTEM SHALL pintar
`vaccine-row-${id}` como `Card variant="flat"` con
`className="flex-row items-center gap-3 py-3.5"` dentro de un `RiseIn` con
`delayMs={80 + 60 * Math.min(index, 2)}`, con el tile de hoy (`size-10
rounded-xl` + `CATEGORY_SLOTS`, `Check`/`Clock` a 20) y el nombre en un `Text`
de `react-native` `className="text-15 font-extrabold text-foreground"`; la
columna `vaccine-text-${id}` conserva `flex-1 gap-1` y tiene dos hijos, el
nombre y `vaccine-dates-${id}` (R17).
- HE `#199 R16: filas de vacunas` › `#199 R16 cada vacuna es un Card flat con py-3.5 y nombre text-15 font-extrabold`.
- HE `#199 R16: filas de vacunas` › `#199 R16 la fila %i entra a los %i ms` — `it.each`: 0 → 80, 1 → 140, 2 → 200, 3 → 200.
- HE `#168 R3` › `pinta el estado de $id con su icono y textos`: el tile no
  cambia; la columna pasa a nombre y `vaccine-dates-${id}`, con sufijo
  `(enmendado por #199 R16)` (§Candados).

**R17 — Subtítulo de una línea.** WHEN se pinta una vacuna, THE SYSTEM SHALL
pintar `vaccine-dates-${id}` como un único `Text` de `react-native`
`className="text-xs text-muted"` con
`t('health.appliedOn', { date: fmtDate(appliedAt, locale) })` («Aplicada
{{date}}») y, IF hay `nextDoseAt`, ` · ` seguido de un `Text` anidado con
`t('health.nextOn', { date: fmtDate(nextDoseAt, locale) })` («Próxima
{{date}}»); IF esa dosis ya venció, THEN el `Text` anidado SHALL llevar
`className="text-danger"`.
- HE `#199 R17: subtítulo de vacunas` › `#199 R17 dice Aplicada y Próxima en una línea` (aplicada 2025-12-31, próxima 2026-01-01: «Aplicada 31 dic 2025 · Próxima 1 ene 2026»).
- HE `#199 R17: subtítulo de vacunas` › `#199 R17 una dosis vencida pinta Próxima en text-danger`.
- HE `#199 R17: subtítulo de vacunas` › `#199 R17 una dosis vigente no pinta text-danger`.
- HE `#199 R17: subtítulo de vacunas` › `#199 R17 sin próxima dosis solo dice Aplicada`.

**R18 — Tarjeta de peso.** WHEN el historial de peso tiene 1 registro o más,
THE SYSTEM SHALL pintar `weight-card` como `View` de `react-native` con
`className="gap-3 rounded-24 bg-surface-secondary p-4"` y `style`
`CONTINUOUS_CORNER`, sin borde ni sombra, dentro de un `RiseIn` con
`delayMs={260}`, con:
1. fila `View` `className="flex-row items-end justify-between"`: columna
   `gap-0.5` con `weight-card-title` (`Text`,
   `className="text-13 font-bold text-muted"`, «Peso», `health.weight`) y
   `weight-current` (`Text`, `className="text-3xl font-black text-foreground"`,
   `TABULAR_NUMS`); a la derecha `weight-variation`, `View`
   `` `rounded-full px-2.5 py-1 ${superficie}` `` con un `Text`
   `` `text-13 font-extrabold ${tinta}` `` y `fmtVariation`: sube →
   `CATEGORY_SLOTS.rose.surface`/`.ink`; baja → `CATEGORY_SLOTS.green.surface`/`.ink`;
   igual o sin anterior → `bg-default`/`text-muted`;
2. `WeightChart` con `variant="mini"` y el historial entero;
3. `weight-log-link`: `Pressable` con `hitSlop` de hoy y
   `className="flex-row items-center justify-between rounded-14 bg-surface px-3.5 py-3"`,
   `Text` `className="text-15 font-bold text-foreground"` «Registro de peso»
   (`health.weightLog`) y `ChevronRight` a 18 px.
- HE `#199 R18: tarjeta de peso` › `#199 R18 weight-card es un View rounded-24 bg-surface-secondary sin borde con esquina continua`.
- HE `#199 R18: tarjeta de peso` › `#199 R18 la cabecera pone Peso y la cifra a la izquierda y la píldora a la derecha`.
- HE `#199 R18: tarjeta de peso` › `#199 R18 la píldora %s pinta %s` — `it.each`: sube, baja e igual, una fila por rama.
- HE `#199 R18: tarjeta de peso` › `#199 R18 pasa variant mini y el historial entero a WeightChart`.
- HE `#199 R18: tarjeta de peso` › `#199 R18 el enlace es rounded-14 bg-surface px-3.5 py-3 con texto text-15 font-bold`.
- HE `#199 R18: tarjeta de peso` › `#199 R18 entra a los 260 ms`.
- HE `#115 R5` › `con un registro, muestra el aviso de datos insuficientes de WeightChart`:
  3 hijos y el aviso en el índice 1, con sufijo `(enmendado por #199 R18)`.

### Estados

Cada artboard de estado es un requisito con test. Los testIDs de estado de hoy
(`vaccines-skeleton`, `vaccines-empty`, `vaccines-error`, `health-loading`,
`health-error`, `health-empty`, `weight-log-loading`, `weight-log-empty`,
`weight-log-error` y los del vacío y error de la tarjeta de peso) se
conservan; si alguno no existe con ese nombre, el implementador usa el de hoy
y lo anota. Los «Reintentar» no cambian (D4). El copy de los mensajes es el de
hoy.

**R19 — Vacunas: carga, vacío y error (SaludEstados).** WHILE las vacunas
cargan, THE SYSTEM SHALL pintar `vaccines-skeleton` como
`Card variant="flat" className="flex-row items-center gap-3 py-3.5"` con un
`Skeleton` `vaccines-skeleton-tile` `className="size-10 rounded-xl"` y una
columna `flex-1 gap-1.5` con `Skeleton` `className="h-3.5 w-1/3 rounded-full"`
y `Skeleton` `className="h-2.5 w-2/3 rounded-full"`; WHEN no hay vacunas,
`vaccines-empty` SHALL ser un `Text` `className="text-15 leading-body text-muted"`;
IF la consulta falla, THEN `vaccines-error` SHALL ser un `Text`
`className="text-15 leading-body text-danger"` con
`accessibilityRole="alert"`, seguido del `Button` de reintento de hoy.
- HE `#199 R19: estados de vacunas` › `#199 R19 la carga pinta una fila flat con tile y dos barras`.
- HE `#199 R19: estados de vacunas` › `#199 R19 sin vacunas pinta el aviso en text-15 leading-body text-muted`.
- HE `#199 R19: estados de vacunas` › `#199 R19 con error pinta el aviso en text-danger con role alert y conserva Reintentar`.
- HE `#127 R2` › `pinta vaccines-skeleton con la clase exacta, rounded-card incluido, …`:
  sufijo `(enmendado por #199 R19)`, clase resultante de `Card` flat con
  `flex-row items-center gap-3 py-3.5` (`rounded-card` sigue dentro).

**R20 — Peso de Salud: vacío y error (SaludEstados).** WHEN el historial de
peso está vacío, o IF su consulta falla, THE SYSTEM SHALL pintar `weight-card`
con el mismo envoltorio de R18 (clases, `CONTINUOUS_CORNER`, `RiseIn` 260),
`weight-card-title` «Peso», un `Text` `className="text-15 leading-body text-muted"`
con «Aún no hay registros de peso» (`health.noWeightEntriesYet`) o, con error,
`className="text-15 leading-body text-danger"` y `accessibilityRole="alert"`
con «No se pudo cargar el peso» (`health.couldNotLoadWeight`), y
`weight-log-link`; sin `weight-current`, `weight-variation` ni gráfica.
WHILE el peso carga, la tarjeta conserva lo que pinta hoy dentro del
envoltorio nuevo.
- HE `#199 R20: peso vacío y con error` › `#199 R20 sin registros conserva envoltorio, Peso, aviso y enlace`.
- HE `#199 R20: peso vacío y con error` › `#199 R20 con error pinta el aviso en text-danger con role alert dentro de la tarjeta`.
- HE `#115 R5` › `mientras el peso carga, no pinta gráfica` sigue verde sin cambios.

**R21 — Mascotas: carga y error (SaludEstados, SaludSinMascota).** WHILE las
mascotas cargan, THE SYSTEM SHALL pintar en `health-states` un `View`
`health-loading` con `className="flex-row gap-2.5"` y dos `Skeleton`
(`health-loading-0`, `health-loading-1`) con `className="size-10 rounded-full"`;
IF la consulta de mascotas falla, THEN el aviso de `health-error` SHALL ser un
`Text` `className="text-15 leading-body text-danger"` con
`accessibilityRole="alert"`, seguido del reintento de hoy; WHEN la cuenta no
tiene mascotas, `health-empty` (el `EmptyState` de Pingo de #155) no cambia.
- HE `#199 R21: estados de mascotas` › `#199 R21 la carga pinta dos círculos de 40 en fila`.
- HE `#199 R21: estados de mascotas` › `#199 R21 el error pinta el aviso en text-15 leading-body text-danger con role alert`.
- HE `R4` › `R8 (mobile-design-drift): reserva la altura del loading con Skeleton`:
  sufijo `(enmendado por #199 R21)`, afirma los dos círculos.
- HE `#155 R4` › sus tres `it` siguen verdes sin cambios.

**R22 — Peso: carga, vacío y error (PesoEstados).** WHILE el historial carga,
THE SYSTEM SHALL pintar `weight-log-header`, el formulario (R7) y
`weight-log-loading` con tres filas `weight-log-skeleton-row-${i}` (i = 0, 1, 2)
`className="flex-row items-center gap-3 border-t border-border py-2.5"`, cada
una en un `RiseIn` con `delayMs={60 * i}`, con `Skeleton`
`className="size-9 rounded-xl"`, una columna `flex-1 gap-1.5` con `Skeleton`
`h-3.5 w-2/5 rounded-full` y `h-2.5 w-1/5 rounded-full`, y a la derecha
`Skeleton` `h-3 w-9.5 rounded-full`; WHEN no hay registros,
`weight-log-empty` SHALL ser un `Text`
`className="text-15 leading-body text-muted"` bajo el formulario; IF la
consulta falla, THEN `weight-log-error` SHALL ser un `Text`
`className="text-15 leading-body text-danger"` con `accessibilityRole="alert"`
bajo el formulario, seguido del reintento de hoy. En los tres casos no se
pintan `weight-chart-card` ni `weight-history-title` (D23).
- WL `#199 R22: estados de Peso` › `#199 R22 en carga pinta cabecera, formulario y tres filas esqueleto`.
- WL `#199 R22: estados de Peso` › `#199 R22 cada fila esqueleto lleva tile y tres barras con sus clases`.
- WL `#199 R22: estados de Peso` › `#199 R22 la fila esqueleto %i entra a los %i ms` — `it.each`: 0 → 0, 1 → 60, 2 → 120.
- WL `#199 R22: estados de Peso` › `#199 R22 sin registros pinta el aviso bajo el formulario sin tarjeta ni Historial`.
- WL `#199 R22: estados de Peso` › `#199 R22 con error pinta el aviso con role alert y Reintentar bajo el formulario`.

**R23 — Toast de registro (PesoRegistrado).** WHEN el alta de peso termina
bien, THE SYSTEM SHALL pintar `weight-toast` como `Animated.View` con
`className="absolute flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5"`,
`style` `[{ top: insets.top + 42 }, shadows.toast]` con
`const shadows = useShadows()` (D21), un `Check` a 16 px con
`strokeWidth={2.6}` en `accent-strong`, un `Text`
`className="text-sm font-semibold text-foreground"` con «Anotado. Ya lo puse en
la gráfica.» (`weightLog.weightLogged`, sin cambio de copy),
`entering={FadeIn.duration(MOTION_TOAST_FADE_MS).delay(MOTION_TOAST_DELAY_MS)}`
(300 ms tras 400 ms) y la salida y la duración en pantalla de hoy.
- WL `#199 R23: toast de registro` › `#199 R23 el toast es una píldora con borde, sombra toast y top inset + 42`.
- WL `#199 R23: toast de registro` › `#199 R23 el check es de 16 en accent-strong y el texto es el de weightLog.weightLogged`.
- WL `#199 R23: toast de registro` › `#199 R23 el fuente declara FadeIn.duration(MOTION_TOAST_FADE_MS).delay(MOTION_TOAST_DELAY_MS)`.
- WL `#169 R13` › `el fuente declara el fundido sin ReduceMotion.Never` pasa a
  afirmar el `entering` nuevo, con sufijo `(enmendado por #199 R23)`;
  `el toast lleva FadeIn y FadeOut` sigue verde.
- WL `#169 R10` › `muestra el toast y el háptico solo tras resolver el alta`:
  `className` de R23 y check en `accent-strong`, con sufijo `(enmendado por #199 R23)`.

### Copy, guardas y fidelidad

**R24 — Enmienda #199.** #199 consume `RiseIn` de `components/rise-in.tsx`
(#197 R24) sin modificarlo. `docs/ui-guidelines.md` SHALL llevar el texto de la
Enmienda #199 de design §Decisiones técnicas, literal, al final del documento.
- CF `#199 R24: Enmienda #199` › `#199 R24 la carta lleva la Enmienda #199 una sola vez con sus frases` (`split(heading)` de longitud 2 y cada frase con `toContain`).
- CF `#199 R24: Enmienda #199` › `#199 R24 la spec lleva la casilla de la enmienda` (regex tolerante `/- \[[ xX]\] Enmienda #199 aprobada por humano/` sobre `specs/mobile-canvas-health-weight/requirements.md`).

**R25 — Copy nuevo y su tabla.** THE SYSTEM SHALL tener en `i18n/catalog.ts`,
en `es` y en `en`:

| Clave | es | en | Usa | R |
|---|---|---|---|---|
| `weightLog.history` | `'Historial'` | `'History'` | `screens/weight-log/index.tsx` | R9 |
| `health.appliedOn` | `'Aplicada {{date}}'` | `'Given {{date}}'` | `screens/health/index.tsx` | R17 |
| `health.nextOn` | `'Próxima {{date}}'` | `'Next {{date}}'` | `screens/health/index.tsx` | R17 |
| `health.nextDoseToday` | `'hoy'` | `'today'` | `screens/health/index.tsx` | R14 |
| `health.nextDoseTomorrow` | `'mañana'` | `'tomorrow'` | `screens/health/index.tsx` | R14 |
| `health.nextDoseInDays` | `'en {{days}} días'` | `'in {{days}} days'` | `screens/health/index.tsx` | R14 |
| `weightChart.lastSixMonths` | `'Peso de los últimos 6 meses'` | `'Weight over the last 6 months'` | `components/weight-chart.tsx` | R5 |

y `src/__tests__/ui-copy-table.ts` SHALL, dentro de `R5_HEALTH`: añadir una
fila `{ file, key }` por cada fila de la tabla, con comentario `// #199 R<n>`;
sustituir `{ file: 'src/app/_layout.tsx', key: 'weightLog.weightLog' }` por
`{ file: 'src/screens/weight-log/index.tsx', key: 'weightLog.weightLog' }` con
`// #199 R1`; y añadir `{ file: 'src/screens/weight-log/index.tsx', key: 'weightLog.weight' }`
solo si la base no la tiene (R7). Efectos: `SCREEN_FILES` pierde
`src/app/_layout.tsx` (era su única fila): base − 1; `R3_HOME` no cambia.
Una clave que deje de usarse en un fichero pierde su fila de ese fichero y se
queda en el catálogo. El copy de hoy no cambia (D15; `weightLog.weightLogged`
ya es Voz B).
- CF `#199 R25: copy nuevo` › `#199 R25 %s dice %s en es y %s en en` — `it.each` con las siete filas.
- UL: los `it` que recorren `ALL_USES` siguen verdes con las filas nuevas; `#194 R5` cambia (ver §Candados).

**R26 — Fidelidad al canvas.** THE SYSTEM SHALL tener CF, que lee cada
artboard con
`readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-health-weight/canvas/<Artboard>.dc.html'), 'utf8')`
y, por fila, afirma el literal del canvas **y** el valor de producción (nunca
uno calculado desde el otro):

| Fila | Canvas (`toContain`) | Producción |
|---|---|---|
| viewBox completo | `Peso`: `viewBox="0 0 310 110"` | fuente de `weight-chart.tsx` contiene `viewBox="0 0 310 110"` |
| viewBox mini | `Salud`: `height="56" viewBox="0 0 310 56"` | fuente contiene `viewBox="0 0 310 56"` |
| rejilla | `Peso`: `M0 20H310M0 55H310M0 90H310` | fuente contiene el mismo `d` |
| draw completo | `Peso`: `draw 1200ms ease-out 200ms` | `MOTION_DRAW_TIMING.duration` 1200 y `MOTION_DRAW_DELAY_FULL_MS` 200 |
| draw mini | `Salud`: `draw 1200ms ease-out 300ms` | `MOTION_DRAW_DELAY_MINI_MS` 300 |
| pop | `Peso`: `pop 400ms ease-out 1300ms` y `0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08)` | `MOTION_POINT_POP_MS` 400, `MOTION_POINT_POP_DELAY_MS` 1300, `MOTION_POP_SCALE` 0.6, `MOTION_CELEBRATION_POP_PEAK` 1.08 |
| fade del toast | `PesoRegistrado`: `fade 300ms ease-out 400ms` | `MOTION_TOAST_FADE_MS` 300, `MOTION_TOAST_DELAY_MS` 400 |
| top del toast | `PesoRegistrado`: `top: 98px` y `Peso`: `padding: 56px 20px 32px` | fuente de `weight-log/index.tsx` contiene `insets.top + 42` (98 − 56) |
| cifra 34 | `Peso`: `font-size: 34px` | `theme/global.css` contiene `--text-34: 34px` |
| rise de Salud | `Salud`: `rise 400ms ease-out 80ms`, `140ms`, `200ms` y `260ms` | fuente de `health/index.tsx` contiene `80 + 60 * Math.min(` y `delayMs={260}` |
| rise de Peso | `Peso`: `rise 400ms ease-out 80ms` y `rise 400ms ease-out 140ms` | fuente de `weight-log/index.tsx` contiene `delayMs={80}` y `140 + 60 * Math.min(` |
| etiqueta de la gráfica | `Peso`: `aria-label="Peso de los últimos 6 meses"` | `es['weightChart.lastSixMonths']` |
| Historial | `Peso`: `>Historial<` | `es['weightLog.history']` |
| fecha de dosis | `Salud`: `12 de octubre · en 6 días` | `fmtDayMonthLong('2026-10-12', 'es') + ' · ' + es['health.nextDoseInDays']` con `days` 6 |
| subtítulo | `Salud`: `Aplicada 3 mar 2026 · Próxima 3 mar 2027` | `es['health.appliedOn']` y `es['health.nextOn']` con `fmtDate` |
| toast | `PesoRegistrado`: `Anotado. Ya lo puse en la gráfica.` | `es['weightLog.weightLogged']` |
| meses | `Peso`: seis rótulos de mes en la fila de meses | `chartMonths('2026-10-01')` tiene longitud 6 |
- CF `#199 R26: fidelidad de Salud y Peso al canvas` › `#199 R26 %s` — `it.each` con las 17 filas.

**R27 — Tokens, constantes y guardas.** THE SYSTEM SHALL:
1. añadir `--text-34: 34px;` al `@theme` de `theme/global.css` (D22);
2. añadir a `theme/motion.ts` `MOTION_DRAW_TIMING`
   (`{ duration: 1200, easing: Easing.bezier(0, 0, 0.58, 1), reduceMotion: ReduceMotion.System }`),
   `MOTION_DRAW_DELAY_FULL_MS` (200), `MOTION_DRAW_DELAY_MINI_MS` (300),
   `MOTION_POINT_POP_MS` (400), `MOTION_POINT_POP_DELAY_MS` (1300),
   `MOTION_TOAST_FADE_MS` (300) y `MOTION_TOAST_DELAY_MS` (400), sin tocar las
   que existen;
3. dejar en `screens/health/index.tsx`, `screens/weight-log/index.tsx` y
   `components/weight-chart.tsx` cero clases con corchetes (`-[`), cero
   `StyleSheet.create` y cero `text-accent` suelto (`components/rise-in.tsx` lo
   vigila #197 R22), y en sus tests (HE, WL, WC, DT, CF) cero
   `StyleSheet.create`;
4. escribir `#` + número en comentarios solo como `#199 R<n>` (DD
   `HEX_LITERAL` exime solo esa forma);
5. dar `CONTINUOUS_CORNER` a toda esquina no cápsula nueva que pinte un `View`
   o `Pressable` propio (`rounded-24`, `rounded-16`, `rounded-14`,
   `rounded-xl` de tiles); las cápsulas (`rounded-full`) no lo llevan;
6. usar `Text` de `react-native` (nunca `Label` ni `Text` de heroui con
   `className`) para toda clase `text-13`, `text-15` y `text-17` nueva
   (#187: `twMerge` las toma por color y las expulsa).
- CF `#199 R27: guardas` › `#199 R27 global.css declara --text-34: 34px`.
- CF `#199 R27: guardas` › `#199 R27 motion.ts exporta las siete constantes con sus valores` (importa de `theme/motion`; los valores se cruzan con el canvas en R26).
- CF `#199 R27: guardas` › `#199 R27 %s no usa corchetes, StyleSheet.create ni text-accent suelto` — `it.each` con los tres ficheros de producción.
- CF `#199 R27: guardas` › `#199 R27 %s no usa StyleSheet.create` — `it.each` con los cinco ficheros de test.
- CF `#199 R27: guardas` › `#199 R27 %s no pasa text-13, text-15 ni text-17 a Label` — `it.each` con health y weight-log (regex sobre `<Label[^>]*className="[^"]*text-1[357]`).

## Candados que esta feature revierte

Inventario cerrado. Cada fila cambia con el sufijo `(enmendado por #199 R<n>)`
en el `it` (o un comentario `// #199 R<n>` en la fila del `it.each`). Las
filas marcadas «si rojo» dependen de lo que el `it` lea hoy: si se pone rojo,
se enmienda como dice la fila; si sigue verde, no se toca. Cualquier otro rojo
hace parar.

**Enmienda mecánica permitida**: si un `it` no inventariado se pone rojo solo porque compara contra el literal exacto que el R-id quita o sustituye (directo o vía constante/helper del test), el implementador lo enmienda en el commit rojo de ese R con el sufijo y lo apunta en la tabla «Enmiendas mecánicas» de su informe. Cualquier otro rojo no inventariado sigue siendo motivo de parada.

Inventario hecho por literal (`git grep -nF '<literal viejo>'` sobre los tests
de `origin/dev` 71ff81a1), siguiendo helpers, constantes e `it.each` hasta
cada `it`. Cambios de estructura revisados: `weight-chart-card` pasa del
`Card` al `View` de R3 con el mismo testID (los `findByTestId` siguen
valiendo); `health-loading` sigue siendo el contenedor (R21); `health-title`
conserva la clase de #197; el mock `HeartPulse` de HE queda sin uso y ningún
`it` lo afirma; los `Skeleton` de heroui-native traen su animación propia
(D10), así que `RiseIn` envuelve la fila y nunca se pasa `entering` al
`Skeleton`.

| Fichero › describe › it | Hoy afirma | Pasa a afirmar | R |
|---|---|---|---|
| WL › `R7: weight log lista el historial` › `shows loading and the metrics under the native header (#95 R6)` | `{ padding: 24, gap: 16, paddingBottom: 48 }` y carga `h-40` | métricas de R2 y carga de R22 | R2, R22 |
| WL › `R7…` › `R5 (mobile-design-drift, enmendado por #95 R6): el inset superior lo consume la cabecera nativa` | sin `paddingTop` | `paddingTop: insets.top + 8` | R2 |
| WL › `R7…` › `R8 (mobile-design-drift): reserva la altura del loading con Skeleton` | `h-40` | tres filas esqueleto | R22 |
| WL › `R7…` › `keeps API order and renders each weight detail` | `newest.getByText('2026-08-21')` (fecha ISO) | fecha corta de R11 (`fmtDayMonth`) | R9, R11 |
| WL › `#62 R9: la gráfica de peso vive dentro de una card` › `envuelve weight-chart con la superficie compartida` | `rounded-card` | `rounded-24 bg-surface-secondary` | R3 |
| WL › `#95 R5: la pantalla no dibuja cabecera propia` › `retira el botón y el título del cuerpo` | sin vuelta ni título en el cuerpo | `weight-log-back` sigue ausente; vuelta y título en `weight-log-header` | R1 |
| WL › `#148 R7` › `el host screen-weight-log añade paddingBottom 291 al abrir el teclado` | 291 con `HeaderHeightContext.Provider value={91}` | 200 sin el `Provider` | R2 |
| WL › `#169 R8: chip de delta por entrada` › `fila %s con su tono, icono y texto` | `size-8`, `bg-*-soft`, icono 15, `text-xs font-semibold` | clases de R10 | R10 |
| WL › `#169 R6: resumen del peso en la card de la gráfica` › `en %s pinta el peso actual y el delta del día civil` (`it.each`) | `weight-current` `text-3xl font-black text-foreground`; `weight-month-delta` `flex-row items-center gap-1.5` | `weight-current` `text-34 font-black text-foreground`; `weight-month-delta` ausente en las dos ramas; los dos `TABULAR_NUMS` no cambian (R4) | R4 |
| WL › `#169 R6…` › `no pinta el resumen sin entradas` | con 0 registros espera `weight-chart-empty` («Aún no hay datos suficientes») | con 0 registros no hay tarjeta (D23): espera `weight-log-empty` (R22); `weight-chart-empty` y `weight-summary` ausentes | R3, R22 |
| WL › `#169 R7: tono del delta del mes` › `it.each` | tono con icono | tres tonos sin icono | R4 |
| WL › `#169 R13: movimiento del toast` › `el fuente declara el fundido sin ReduceMotion.Never` | `toContain('entering={FadeIn.duration(MOTION_TRANSITION_MS)}')` | `toContain('entering={FadeIn.duration(MOTION_TOAST_FADE_MS).delay(MOTION_TOAST_DELAY_MS)}')`; el `exiting` y el 0 de `ReduceMotion.Never` no cambian. El otro `it` del describe (`el toast lleva FadeIn y FadeOut`, `toBeInstanceOf`) sigue verde | R23 |
| WL › `#169 R10: toast y háptico tras un alta correcta` › `muestra el toast y el háptico solo tras resolver el alta` | `className` `absolute top-4 … shadow-sm`; `icon-check` con `style.color` `'green'` (`success` en el mock de WL) | `className` exacto de R23 (sin `top-4` ni `shadow-sm`); `style.color` `'blue'` (`accent-strong` en el mock de WL); el resto del `it` no cambia | R23 |
| WL › helper `renderWeightLog` (lo usan todos los `it` de WL) | envuelve en `HeaderHeightContext.Provider value={91}` | sin el `Provider` ni su import; ningún otro `it` cambia por ello | R2 |
| WC › `R8: la gráfica degrada con <2 puntos` › `reverses descending API entries and normalizes each point` | coordenadas en 100 x 40 | 310 x 110 | R5 |
| WC › `R8…` › `centers equal weights without dividing by zero` | centro de 40 | y 60 | R5 |
| WC › `#169 R1: la línea se dibuja al montarse` › los `it` que leen `MOTION_FILL_TIMING` o la longitud, `con dos pesos iguales la longitud es 100` incluido | `MOTION_FILL_TIMING` sin retraso, longitud 100 | `MOTION_DRAW_TIMING` tras 200 ms, longitud 310 | R5 |
| WC › `#169 R4: cuándo se vuelve a dibujar` › `R4a`, `R4b` y `R4c` | `strokeDasharray` 104.9952 y `[100, 100]`; `mockWithTiming` 1, 1 y 2 veces | longitudes en 310 x 110; recuentos 1, 1 y 2 contando solo las llamadas con `MOTION_DRAW_TIMING` (el `pop` añade las suyas). Si el `Path` real no expone `testID` ni `strokeDasharray` en el host, el mock de `react-native-svg` de WC suma un `Path` como el `Polyline` de hoy | R5 |
| WC › `#169 R2: los puntos aparecen con el mismo progreso` › sus cuatro `it` | un `Circle` por entrada al ritmo de la línea | un solo `Circle` con `pop` (R5.7) | R5 |
| WC › `#169 R3: bajo reduce motion la gráfica sale completa` › sus dos `it` (si rojo) | línea completa | línea y punto completos | R5 |
| HE › `R4` › `R8 (mobile-design-drift): reserva la altura del loading con Skeleton` | `h-12 w-full rounded-card` | dos círculos `size-10 rounded-full` | R21 |
| HE › `R5` › `highlights the nearest future dose and keeps row order` | `nextCard.getByText('1 may 2099')` | la fecha de R14 (`fmtDayMonthLong` + relativo); si lee subtítulos de fila, los de R17 | R14, R17 |
| HE › `R5` › `marks an overdue next-dose date with the danger token` | fecha vencida en su propia línea | `Text` anidado en `text-danger` | R17 |
| HE › `#62 R5` › `aplica la receta canónica a Peso` | `text-base font-bold` | `text-13 font-bold text-muted` | R18 |
| HE › `#127 R2` › `pinta vaccines-skeleton con la clase exacta, rounded-card incluido, …` | `h-24 w-full rounded-card` | fila `Card` flat | R19 |
| HE › `#115 R5` › `con dos o más registros, pasa el historial entero y en orden entre la variación y el enlace` | `WeightChart` sin `variant` | `variant="mini"`, orden fila, gráfica, enlace | R18 |
| HE › `#115 R5` › `con un registro, muestra el aviso de datos insuficientes de WeightChart` | `card.children` 4; `weight-chart-empty` en el índice 2 | 3 hijos (fila, gráfica, enlace); `weight-chart-empty` en el índice 1 | R18 |
| HE › `#115 R6` › `ordena la card en icono, columna y días, con la fecha en la columna ($branch)` | tile 44, `fmtDate` | tile 52, `fmtDayMonthLong` + relativo | R14 |
| HE › `#115 R6` › `pinta los días con la receta exacta ($branch)` | `text-lg font-black text-warning-strong` | `text-28 font-black` + `CATEGORY_SLOTS.amber.ink` | R14 |
| HE › `#168 R2` › `con mascotas, health-title y health-content son los únicos hijos del scroll, en ese orden` | `health-title`, `health-content` | `health-header`, `health-content` | R12 |
| HE › `#168 R2` › `pone el PetSwitcher como primer hijo de health-content` | selector en `health-content` | selector en `health-header` | R12, R13 |
| HE › `#168 R2` › `sin contenido ($name), health-title precede a health-states` | `health-title` antes | `health-header` antes | R12 |
| HE › `#168 R2` › `cambia vacunas y peso al pulsar otra mascota` | selector = primer hijo de `health-content` | selector = segundo hijo de `health-header` (R13); el resto del `it` no cambia | R13 |
| HE › `#168 R3: cada vacuna lleva su tile pastel` › `pinta el estado de $id con su icono y textos` (`it.each`, 4 filas) | columna con 3 o 2 `Text`: nombre `font-bold text-foreground`, fechas ISO crudas en `font-normal text-muted` o `dateClass` | columna con 2 hijos: nombre `text-15 font-extrabold text-foreground` y `vaccine-dates-${id}` (R17: fechas por `fmtDate`, vencida en `Text` anidado `text-danger`); tile, icono y `flex-1 gap-1` no cambian | R16, R17 |
| LY › `#95 R4` › `#194 R4: %s usa exactamente las opciones de cabecera acordadas` | `['weight-log', 't:weightLog.weightLog']` | `headerShown: false` sin título | R1 |
| `app/__tests__/detail-stack.test.tsx` › `it.each` con `['weight-log', 0]` (si rojo) | 0 | el valor que dé la ruta sin cabecera nativa | R1 |
| F197 › `describe('#197 R20: cimientos sin cablear')` › `nadie monta todavía los cimientos %s` (4 casos: `toggle-switch`, `screen-header`, `shadows`, `rise-in`) y `el layout raíz no cambia` | cero importadores de producción de los cuatro módulos y `headerShown` ×2 en `app/_layout.tsx` | el `describe` se borra entero, con sus dos `it`, sin sufijo y sin sustituto: es un candado temporal de #197 que la ola 2 retira, y el borrado es idéntico en todas las features de la ola 2 para que git lo mezcle sin conflicto. Va en el primer commit rojo de #199 que monte un cimiento (`ScreenHeader`, `useShadows` o `RiseIn`) o toque `_layout.tsx` (R1) | R1, R3, R14, R23 |
| DD › `#179 R13` › `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto (enmendado por #177 R10)` | health fuera de las listas de `rounded-14` y `rounded-16` | health con 1 `rounded-14` y 1 `rounded-16` | R14, R18 |
| CC › `#62 R2: cada skeleton tiene la forma del contenido que sustituye` | `vaccines-skeleton` `h-24 w-full rounded-card` (única fila del `it.each`) | receta de R19 en la etiqueta de apertura de `vaccines-skeleton` | R19 |
| CC › `lleva los tres tiles restantes a rounded-xl (enmendado por #177 R10)` | `'size-8 shrink-0 items-center justify-center rounded-xl ${tileClassName}'` | `size-9` | R10 |
| CC › `#62 R14: toda esquina no-cápsula que dibuja el repo es continua` | health `2 + 1`, weight-log su base | recuento re-medido con R27.5 | R3, R14, R18, R27 |
| CC › `#62 R15: todo contador usa cifras tabulares` | health `2 + 1`, weight-log `2 + 2` | recuento re-medido | R4, R10, R14, R18 |
| LG › `#61 R4` › `%s pinta con text-accent-strong (%i)` y `suma las trece ocurrencias que enumera la spec` | health 1, weight-log sin fila | health 0 (`// #199 R18`), fila weight-log 1 (`// #199 R4`): R4 y R10 leen el tono de la misma `DELTA_TONE` (R10), así que el literal sale una vez; suma `+ 1 - 1` | R4, R10, R18 |
| LG › `#61 R5` › `%s pinta su texto con text-warning-strong` | fila health | la fila health sale (`// #199 R14`) | R14 |
| PCF › `limita text-13 a Perfil y a las pantallas de cuenta de #172 (E8) (enmendado por #189 R6)` | inventario sin health ni weight-log | + health y weight-log con sus recuentos | R7, R10, R11, R14, R18 |
| PCF › `Perfil es el único consumidor de Card flat y lo usa dos veces` | `filesMatching(/variant="flat"/)` = `['screens/meal-schedule/index.tsx', 'screens/profile/index.tsx']` | `['screens/health/index.tsx', 'screens/meal-schedule/index.tsx', 'screens/profile/index.tsx', 'screens/weight-log/index.tsx']`; el recuento de Perfil no cambia | R7, R16, R19 |
| CTA › `#177 R6.2: recuentos de etiquetas (enmendado por #189 R7) (enmendado por #189 R13)` | `count(/text-17/g)` `8 + 15 + 1 + 1 + 1 + 1`; `count(/text-17 font-extrabold text-foreground/g)` `3 + 3` | las dos `+ 1` (`// #199 R9`) por `weight-history-title` | R9 |
| UL › `#194 R5` (longitud de `SCREEN_FILES`) | base | base − 1 | R25 |

## Desviaciones conscientes del canvas

| Canvas | App | Por qué | Decisión |
|---|---|---|---|
| Margen lateral 20 | 24 | Dimensiones uniformes de `docs/conventions.md` | D1 |
| Enviar 52 de alto, radio 14, 800 16 px | `h-14 rounded-16`, `Text` 17/800 | Radio único de los primarios sólidos | D3 |
| «Reintentar» 44/14 con labio | `Button` de hoy, sin labio | CTA `#177 R8.4` | D4 |
| Aro del avatar con `box-shadow` doble; letra 16 | `PetSwitcher variant="avatars"` (aro `border-2` + `p-0.75`, letra 14) | Variante compartida con Perfil; misma huella de 50 px | D5 |
| `stroke-dasharray` 420 y 400 | Longitud real de la polilínea | 420 no cubre todas las líneas reales | D8 |
| `pulse 1.4s` en esqueletos | Animación propia de `Skeleton` | Sin timing nuevo | D10 |
| Formulario de radio 24 | `Card` flat, radio 20 | DD `%s importa el Card compartido` | D11 |
| Inputs `600 15px` con borde 2 transparente | Tipografía y borde de heroui | `cn()` expulsa `text-15` | D12 |
| Flechas diagonales en el historial | `TrendUp`/`TrendDown`/`Minus` | Sin icono nuevo | D14 |
| «6d» | «6 d» | Clave compartida con Inicio | D15 |
| `sep` en la fila de meses | `sept` en `es` (Intl del dispositivo) | Sin tabla propia de meses | D24 |
| Barras de esqueleto al 35 % y al 22 % | `w-1/3` (33 %) y `w-1/5` (20 %) | Sin clases con corchetes | — |
| Toast a `top: 98px` fijo | `insets.top + 42` | El inset real varía por teléfono | D21 |

## Fuera de alcance

Cada viñeta dice qué es y dónde vive, si vive en algún sitio.
- **Barra de pestañas** de Salud: feature #206 (plan de paridad).
- **Inicio** y su `home.nextVaccineDays`: feature #198, en paralelo; esta
  feature no toca `screens/home/index.tsx` (sí `screens/home/format.ts`, solo
  para añadir helpers).
- **`components/pet-switcher.tsx`** y sus tests: los fija #196; aquí solo se
  elige la variante (D5).
- **Canon de CTA** (C13 del plan del canvas): el envío y los reintentos
  conservan su receta (D3, D4). No es deuda de esta feature.
- **Copy de los mensajes de estado** («Algo salió mal», «Aún no hay vacunas»,
  etc.): no cambia; solo entran las siete claves de R25.
- **Datos y red**: claves de TanStack Query, API y tipos de `measuredAt` no
  cambian (HE `#87 R13`).
- **Eje x por fecha** en la gráfica: no se hará (D9).
- **Limpieza del catálogo** de claves que dejen de usarse: no se hará aquí;
  si una queda huérfana, el reviewer la anota como deuda.

## Cierre del humano

Supuestos que los tests no ven (design §Supuestos). Smoke en dev build Android
en el PC del humano, no en Expo Go ni en la VPS:
1. **R1**: la flecha de `weight-log-header` vuelve a Salud; abriendo Peso por
   deep link en frío, vuelve a `/health`. El título no queda bajo la barra de
   estado.
2. **R2**: con el teclado abierto en «Peso», «Fecha de medición» y
   «Condición corporal», el campo con foco y el botón «Registrar peso» quedan
   visibles (`keyboardVerticalOffset={0}` sin cabecera nativa).
3. **R5 y R6**: la línea se dibuja (200 ms en Peso, 300 ms en Salud) y el
   último punto de Peso hace `pop` hacia los 1,3 s; con 7 meses de registros,
   Peso rotula seis meses y Salud pinta la línea entera.
4. **R13**: los avatares quedan alineados con «Salud» en la misma fila.
5. **R23**: el toast aparece bajo la cabecera tras ~400 ms, con sombra visible
   en Android.
6. **R24**: las tarjetas y filas entran escalonadas; con «Quitar animaciones»
   activado en Ajustes de Android, todo sale quieto y completo.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-23)
  Firma delegada en el leader por mandato del humano del 2026-10-23
  (`progress/plan_canvas-parity-2026-10-23.md` §4, checklist de firma pasada: 47 anclas de Base medida
  verdes, 27 R con test nombrado y fila de trazabilidad, inventario de candados auditado por literal en
  2fc0f6dd). Aceptadas las decisiones con defecto D1–D25. `RiseIn` viene de #197 R24 (Reanudación 2 de #197, commit b2f73327). El handoff espera a que #197 esté en `dev`.
- [x] Enmienda #199 aprobada por humano (fecha: 2026-10-23) — texto literal en design §Decisiones técnicas
  Firma delegada en el leader por el mismo mandato. Se copia a `docs/ui-guidelines.md` después de la
  enmienda de #197, que se mergea antes.
- [ ] Smoke de R1 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
- [ ] Smoke de R2 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
- [ ] Smoke de R5 y R6 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
- [ ] Smoke de R13 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
- [ ] Smoke de R23 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
- [ ] Smoke de R24 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
