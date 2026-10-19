---
feature: "mobile-home-empty-canvas-fidelity"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-home-empty-canvas-fidelity]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.

## Premisas contrastadas

Leídas con `git show origin/main:<ruta>` en origin/main cbd964da (2026-10-19, con #177 y #181 mergeadas), no en la worktree de otra feature. Se anclan por contenido, no por número de línea. No se toman tal cual del explore ni de la descripción de #176:

- Composición: la rama sin mascota de `src/screens/home/index.tsx` (`if (pets.data?.kind === 'ok' && pets.data.pets.length === 0)`) pinta `<View testID="home-no-pets-screen" className="flex-1 items-center justify-center p-6 bg-background">` con un único hijo `EmptyState testID="home-empty" pose="talk"`. Falta el padding lateral de 20 px (R3). La condición real no es `selectedPetId` null: el estado sin mascota sale de la lista de mascotas vacía. `selectedPetId` existe (`useSelectedPet()`) pero no decide esta rama.
- Test que fija ese contenedor: `src/screens/home/index.test.tsx` («#181 R3.2») afirma la clase exacta `'flex-1 items-center justify-center p-6 bg-background'` y los hijos `['home-empty']`. R3 lo rompe a propósito; se enmienda (tasks.md §Tests enmendados).
- Pose: `EmptyState` (`src/components/empty-state.tsx`) la dibuja con `Image testID={`${testID}-pose`}` a 160×160 dentro de `Animated.View testID={`${testID}-float`}` con `MOTION_FLOAT_OFFSET_Y` y `MOTION_FLOAT_TIMING` (4 px, 1200 ms), compartidos con la bienvenida (#153). Falta 190 px (R4) y PingoFloat (R6).
- Título: `text-center text-lg font-bold text-foreground`. Cuerpo: `text-center font-normal text-muted`. Contenedor: `items-center gap-3 py-8`. Faltan 26/900/tracking (R8) y 15 px/290 px (R9). Hijos directos de la raíz en la variante `default`: `[-float, -title, -body, -action]`, fijados por tests de #155 R3/#171 R10 que la variante `default` debe seguir cumpliendo.
- CTA, receta de #177 ya mergeada (PR #231): `<Button testID={`${testID}-action`} className="h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={action.onPress}>` con hijo `<Text className="text-17 font-extrabold text-accent-foreground">`. `chunkyLip` sale de `useChunkyLip()` (`src/theme/chunky-lip.ts`, devuelve `{primary, primaryCompact, neutral}` como `boxShadow` con el labio de 4 px por fuera del cuerpo de 56 px). Altura 56, radio 16, tipografía 17/800 y sombra son de #177; la etiqueta es `Text` de react-native y no `Button.Label`/`Label.Text` (Enmienda #187: HeroUI descarta `text-11/13/15/17/22/26` con tailwind-merge).
- Colisiones de R12 con la receta de #177, verificadas: el `Button` raíz de HeroUI es `flex-direction: row; align-items: center; justify-content: center`, sin `gap`, sin `alignSelf` y sin margen. #177 no fija ancho ni margen, así que `w-full` y `mt-2.5` no chocan con la receta por valor. Sí chocan con sus candados: los tests de `empty-state.test.tsx` fijan el literal de la etiqueta de apertura de `<Button` (una sola ocurrencia, sin `size` ni `variant`) y el inventario de `chunky-cta-canvas-fidelity.test.ts` fija las clases de cada botón. Por eso `w-full mt-2.5` van en un `View` envoltorio y el `Button` conserva su `className` literal.
- Icono: el `Button` no tiene `gap`; la separación icono-etiqueta es `marginRight` del propio icono. `Plus` existe en `reicon-react-native` (props `size`, `color`); lo usan Perfil y Recordatorios con `color` de `useThemeColors(['accent-foreground'])`. `react-native-svg` está instalado y se usa para las huellas (D3). No hay dependencia nueva.
- PingoFloat (#172) en `src/components/pingo-float.tsx`: `PingoFloat({ testID, children })`, `Animated.View testID` con `translateY` de 0 a `-MOTION_PINGO_FLOAT_OFFSET_Y` (10 px) con `withRepeat(withTiming(..., MOTION_PINGO_FLOAT_TIMING), -1, true)`; con `useReducedMotion()` no arranca. Su test usa `mockUseReducedMotion`. Lo usan register, forgot y reset-password; Inicio no.
- Tokens de movimiento en `src/theme/motion.ts`: `MOTION_STAGGER_MS = 60`, `MOTION_ENTRANCE_OFFSET_Y = 12`, `MOTION_FADE_TIMING` (con `reduceMotion: ReduceMotion.Never`, así que reduce motion se resuelve a mano con `useReducedMotion()`), `MOTION_PINGO_FLOAT_OFFSET_Y = 10`, `MOTION_PINGO_FLOAT_TIMING` (1500 ms, `ease-in-out`). `motion.test.ts` fija la lista exacta de exports de `motion.ts`: esta spec no añade ninguno.
- Tokens de texto: `text-26`, `text-15`, `text-17` y `tracking-title` existen en `src/theme/global.css`; `font-black` es la utilidad estándar de Tailwind v4. Los tamaños de la escala (`text-26`, `text-15`) no se pasan a componentes HeroUI: título y cuerpo son `Text` de react-native.
- La descripción de #176 dice «igual al canvas salvo el botón». El código no coincide: título, pose, cuerpo y CTA difieren. Esta spec sigue el código, no la descripción.
- `EmptyState` lo usan ocho pantallas (Inicio y siete más). Aún no tiene `variant`.
- testIDs actuales de Inicio vacío: `home-no-pets-screen`, `home-empty`, `home-empty-float`, `home-empty-pose`, `home-empty-title`, `home-empty-body`, `home-empty-action`. Rutas: el CTA hace `router.push('/pets/add')`.

## Supuestos no verificados

Siguen sin confirmarse y el implementer los confirma antes del test rojo que los usa:

- Artboard vigente del canvas. La lectura directa del canvas devolvió instrucciones de tipo, no el artboard; lo único legible es la copia de #155 (`specs/mobile-empty-states-pingo/design-src/inicio-vacio.dc.html`, versión `1791473009-3376`, leída el 2026-10-08). R3-R14 se contrastan con esa copia (sección siguiente). Que el canvas vigente no haya cambiado desde entonces es un supuesto. Ver Q3.
- `docs/architecture.md`: la afirmación de que el cambio es solo de presentación sale de las rutas de archivo. El reviewer la valida contra ese documento.

Confirmados el 2026-10-19 y retirados de esta lista: API de `PingoFloat` (acepta `testID`), signo del desplazamiento (`translateY` hacia `-10`), mock de reduce motion de `pingo-float.test.tsx`, nombre `selectedPetId` y rutas reales de los tests.

## Contraste con la copia del artboard

Valores leídos de `specs/mobile-empty-states-pingo/design-src/inicio-vacio.dc.html` (anclados por contenido) y su traducción:

| Artboard | Valor | Spec |
|---|---|---|
| Contenedor | `padding: 60px 24px 120px`, centrado, `gap: 14px` | R3 (`px-5 py-6`, enmienda de fidelidad: margen lateral 20) y R14 (`gap-3.5` = 14) |
| Escenario | 280×260, centrado | R5 `h-65 w-70` |
| Disco | 240 px, `--surface2` | R5 `size-60 rounded-full bg-surface-secondary` (`--surface-secondary` = `#F0FBF6` en claro y `#12231B` en oscuro, igual que `--surface2`) |
| Huellas | SVG 280×260, `fill: --accent`, `opacity .18`, tres grupos | R5, geometría en D3 |
| Mascota | `width: 190px` | R4 |
| Flotación | `float 3s ease-in-out infinite`, 0 a -10 px | R6: `PingoFloat` (1500 ms por tramo, 10 px) coincide |
| Sombra | 120×14, `bottom: 18px`, `rgba(13,17,23,0.10)` | R5 |
| Título | 26 px, 900, `-0.02em` | R8 (`text-26 font-black tracking-title`) |
| Cuerpo | 15 px, `line-height 1.5`, `max-width 290`, `--muted` | R9 |
| CTA | `margin-top 10`, ancho completo, 56 px, radio 16, labio 4 px, `gap 8`, 17 px/800, icono 20 px trazo 2.8 | R12 + receta de #177 (`h-14 rounded-16`, labio 4, `text-17 font-extrabold`); `mt-2.5`, `marginRight: 8`, `Plus` 20 |
| Entrada | `rise 400ms ease-out`: título 100 ms, cuerpo 160 ms, CTA 220 ms, desde 14 px; el escenario no entra | R13 (ver Q4) |

Divergencias que la spec mantiene y que el humano confirma en el gate (Q4): (1) la entrada: R13 anima cuatro bloques con 0/60/120/180 ms, 12 px y las curvas de `homeEntering`, frente a los tres bloques del artboard con 100/160/220 ms, 14 px y 400 ms (los tokens `MOTION_*` no tienen 100 ms de base ni 400 ms de curva); (2) el trazo del `+`: el artboard dibuja 2.8 y `Plus` de reicon usa el trazo de la librería; (3) la mascota del artboard es una imagen provisional (`/_blob/...`), no `pingo-talk.webp`; (4) el copy del artboard no se adopta (voz B de #155).

## Dependencias y precondiciones

Dependencias por feature:

- #181 (done): dueña de `home-no-pets-screen` (centrado, sin tarjeta de error). Cumplida en origin/main.
- #177 (done, PR #231 mergeada): receta global del CTA chunky (56 px, radio 16, `--lip`). Cumplida en origin/main. R12 hereda `h-14 rounded-16 bg-accent` + `style={chunkyLip.primary}` + `Text` `text-17 font-extrabold text-accent-foreground` y no los redefine.
- #172 (done): `PingoFloat` en `src/components/pingo-float.tsx`, sin cambios. Su enmienda dice que ninguna otra pantalla usa PingoFloat sin enmienda propia: R6 necesita la Enmienda #176.
- #187 (done): tamaños de texto de HeroUI. La etiqueta del CTA es `Text` de react-native, como ya lo deja #177; no se usa `Label.Text` ni `Button.Label` con tamaños de la escala (tailwind-merge los descarta).
- #155 (done): copy voz B y `EmptyState` original (R1, R10).
- #153 (done): `MOTION_FLOAT_*` compartido con la bienvenida. No se toca.
- #166 (done): receta anterior del CTA, ya sustituida por #177.
- #171 (done): celebraciones. Fuera de alcance (E4).

Precondiciones de implementación:

- P1. Enmienda #176 aprobada por humano en `docs/ui-guidelines.md` antes de la fase (2) de R6 y R7. Texto propuesto: «El estado sin mascota de Inicio (variante `hero` de `EmptyState`) usa PingoFloat con `MOTION_PINGO_FLOAT_OFFSET_Y` (10 px) y `MOTION_PINGO_FLOAT_TIMING` (1500 ms por tramo). Con reduce motion no arranca. Esta enmienda no autoriza PingoFloat en ninguna otra pantalla.»
- P2. Cerrada: #177 está mergeada en origin/main (PR #231). Ya no hay precondición sobre R12.
- P3. La enmienda de fidelidad de 2026-10-13 cubre el padding lateral de 20 px y el gap del artboard (14 px, R14) para pantallas aprobadas contra canvas. No hace falta enmienda nueva para R3 ni R14.

## Decisiones técnicas

- **D1. Variante `hero` (R1, R2).** `EmptyState` gana `variant?: 'default' | 'hero'`, con `default` por defecto. Inicio pasa `hero`. La variante `default` no cambia, así que las siete pantallas restantes conservan su contrato y sus pruebas. Una variante evita un componente duplicado.
- **D2. Flotación con PingoFloat (R6, R7).** La variante `hero` envuelve la pose en `PingoFloat testID={`${testID}-float`}`, usando su API tal como está, y NO arranca el bucle `MOTION_FLOAT_*` propio de `EmptyState` (si no, la pose subiría dos veces: 4 px + 10 px). El efecto de flotación de `default` se condiciona a `variant === 'default'`; los hooks se siguen llamando siempre. `MOTION_FLOAT_*` no cambia: la bienvenida sigue en 4 px (resuelve el riesgo 3 del explore). Con reduce motion, PingoFloat no arranca.
- **D3. Escenario (R5, R11).** `View` `home-empty-stage` (280×260) con disco, huellas, pose flotante y sombra, en ese orden (la sombra va después de la pose, como en el artboard). Las huellas son un `Svg` de `react-native-svg` (ya instalado y usado en `celebration.tsx`; es ilustración, no icono de interfaz, así que no choca con D-I) con `viewBox="0 0 280 260"` y tres grupos con el relleno del token `accent` (`useThemeColors(['accent'])`): `translate(30 40) rotate(-20)` y `translate(232 70) rotate(18)` con círculos r=5 en (0,0), (10,-6), (20,0) y elipse (10,12) rx=9 ry=7; `translate(220 210) rotate(-8)` con círculos r=4 en (0,0), (8,-5), (16,0) y elipse (8,10) rx=7 ry=6. La opacidad se aplica al `Svg` (`style={{ opacity: PINGO_STAGE_PAW_OPACITY }}`, `testID` `home-empty-stage-paw`). El color `rgba(13,17,23,0.10)` y la opacidad 0.18 viven en `src/theme/pingo-stage.ts` (archivo nuevo: `PINGO_STAGE_SHADOW_COLOR`, `PINGO_STAGE_PAW_OPACITY`), el único sitio con literales de color de los ficheros tocados. Así R11 se cumple. Ningún test enumera los ficheros de `src/theme/`, así que el archivo nuevo no choca con un candado.
- **D4. Tipografía (R8, R9).** Título `text-26 font-black tracking-title text-center text-foreground`. Cuerpo `text-15 text-center text-muted` con `style={{ maxWidth: 290 }}`. El ancho en píxeles va en `style` numérico, como ya hace el archivo con `style={{ width: 160, height: 160 }}`. Descartado un token `--container-copy` (ver alternativas).
- **D5. CTA (R12).** Hay un único elemento `<Button testID={`${testID}-action`} className="h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={action.onPress}>` en el fichero (lo exigen los candados de #155 R3 y de #177) y lo comparten las dos variantes. En `hero` va dentro de `<View testID={`${testID}-action-wrap`} className="w-full mt-2.5">` (el `Button` stretch dentro de un envoltorio de ancho completo; `mt-2.5` son 10 px de la escala de Tailwind) y lleva `<Plus size={20} color={accentForeground} style={{ marginRight: 8 }} testID={`${testID}-action-icon`} />` como primer hijo, antes del `Text` existente. En `default` el `Button` sigue siendo hijo directo de la raíz, sin icono. El `Text` no cambia (Enmienda #187).
- **D6. Entrada escalonada (R13, R7).** Escenario, título, cuerpo y CTA (el envoltorio de R12) usan `withDelay` con retraso índice × `MOTION_STAGGER_MS` (0, 60, 120 y 180 ms). La opacidad usa `withTiming(1, MOTION_FADE_TIMING)` y el desplazamiento vertical `withSpring(0, MOTION_SETTLE_SPRING)` desde `MOTION_ENTRANCE_OFFSET_Y` (12 px): las mismas curvas que `homeEntering` en `src/screens/home/home-entrance.tsx`, que la spec mira y no importa (ver alternativas). Los cuatro bloques son `Animated.View` con `className`/`style` animado (el patrón ya existe en `celebration.tsx`): `${testID}-stage`, `${testID}-title-enter`, `${testID}-body-enter` y el envoltorio de R12 (`${testID}-action-wrap`, que es a la vez el `Animated.View` animado y el contenedor `w-full mt-2.5`). `MOTION_FADE_TIMING` lleva `reduceMotion: Never`, así que el componente decide con `useReducedMotion()`: con reduce motion el valor compartido nace en su estado final y no se anima. No se usa `entering=`/`exiting=` ni `LayoutAnimation` (candado de #155 R11). No se añade ningún export a `motion.ts` (candado de `motion.test.ts`).
- **D7. Copy (R10).** Sin cambios. Decisión humana: voz B de #155, según la descripción de #176.
- **D8. Padding (R3).** `home-no-pets-screen` pasa de `p-6` a `px-5 py-6` (clase final `flex-1 items-center justify-center px-5 py-6 bg-background`). Es el único cambio sobre el contenedor de #181 y viene de la enmienda de fidelidad. El test de #181 R3.2 que fija la clase exacta se enmienda en esta feature; el resto de sus aserciones (hijos `['home-empty']`, sin `screen-home`) se conservan.
- **D9. Raíz y gap (R14).** La raíz de `hero` es `w-full items-center gap-3.5`: sin `w-full` el CTA mediría lo que el contenido más ancho (290 px del cuerpo) y no el ancho útil; el gap del artboard es 14 px (la propuesta anterior de 16 px era un supuesto sin artboard y queda sustituida). Con el `mt-2.5` del CTA, la separación efectiva cuerpo-CTA es 24 px, como en el artboard.

## Archivos afectados

Rutas relativas a `mobile-pet-tracker/`. Todo es capa de presentación; no hay cambios en dominio ni en aplicación.

- `src/components/empty-state.tsx` — prop `variant`; render `hero` (escenario, PingoFloat, título, cuerpo, CTA con icono dentro de envoltorio, entrada escalonada); render `default` sin cambios. Cubre R1 y R4–R13. Imports nuevos: `Plus` de `reicon-react-native`, `Svg`, `G`, `Circle`, `Ellipse` de `react-native-svg`, `PingoFloat`, `withDelay`/`withSpring` de Reanimated, `useThemeColors`, `../theme/pingo-stage` y `MOTION_ENTRANCE_OFFSET_Y`, `MOTION_FADE_TIMING`, `MOTION_SETTLE_SPRING`, `MOTION_STAGGER_MS` de `../theme/motion`.
- `src/components/__tests__/empty-state-hero.test.tsx` — archivo nuevo: pruebas de la variante `hero` (R4–R9, R12, R13) y de R1. Los tests de `hero` van aparte para no engrosar `empty-state.test.tsx`.
- `src/components/__tests__/empty-state.test.tsx` — solo enmiendas marcadas «(enmendado por #176 R<n>)» a las dos pruebas de #155 R11 que fijan la lista de imports (se amplía la lista de especificadores admitidos y el listado exacto de `^import`). El `require(` se mantiene en 6. El resto queda intacto: es la caracterización de `default`.
- `src/screens/home/index.tsx` — `variant="hero"` en el `EmptyState` de Inicio (R2) y `px-5 py-6` en `home-no-pets-screen` (R3).
- `src/screens/home/index.test.tsx` — pruebas de R2, R3 y R10 dentro de Inicio, y enmienda de «#181 R3.2» (clase exacta con `px-5 py-6`).
- `src/theme/pingo-stage.ts` — archivo nuevo: `PINGO_STAGE_SHADOW_COLOR` y `PINGO_STAGE_PAW_OPACITY` (R5, R11).
- `src/components/pingo-float.tsx` — sin cambios; se reutiliza (R6).
- `src/theme/motion.ts` — sin cambios; se reutilizan `MOTION_PINGO_FLOAT_*`, `MOTION_STAGGER_MS`, `MOTION_FADE_TIMING` y `MOTION_ENTRANCE_OFFSET_Y`.
- `src/theme/chunky-lip.ts`, `src/theme/global.css` — sin cambios.
- `docs/ui-guidelines.md` — Enmienda #176 (P1). La redacta el humano o el leader; no la escribe esta spec.
- Las siete pantallas restantes que usan `EmptyState` — sin cambios. Sus pruebas deben seguir en verde sin editarse.

Candados de otras features que el cambio toca y que se enmiendan (la lista exacta con el cambio de cada uno está en [[tasks]] §Tests enmendados): `src/__tests__/profile-canvas-fidelity.test.ts` (inventario de `text-26`), `src/__tests__/alerts-canvas-fidelity.test.ts` (inventarios de `text-15` y `tracking-title`) y, si el implementer los encuentra rojos, los inventarios de `design-drift.test.ts` por tamaño de texto. Los candados que no se tocan y que la implementación debe respetar: `chunky-cta-canvas-fidelity.test.ts` (un solo `<Button` con su `className` literal), `motion.test.ts` (sin exports nuevos) y `consistency-classnames.test.ts` (sin `CONTINUOUS_CORNER` directo).

## Alternativas descartadas

- Cambiar `EmptyState` para las ocho pantallas: cambia el contrato de siete pantallas y exige una enmienda por pantalla para PingoFloat. Descartada; queda como Q1.
- Cambiar `MOTION_FLOAT_*` a 10 px y 1500 ms: rompe la bienvenida (4 px) y la variante `default`.
- Componente nuevo `HeroEmptyState` duplicado: duplica código; la variante cuesta menos.
- Clases arbitrarias (`h-[190px]`, `max-w-[290px]`) o color literal en el componente: prohibido por ui-guidelines §3 (R11).
- Definir la receta del CTA aquí: duplicaría #177 y chocaría con él.
- Reutilizar `HomeEntrance`/`homeEntering` de `src/screens/home/home-entrance.tsx` para R13: descartado. Usa `entering=` (que el candado de #155 R11 prohíbe en `empty-state.tsx`), es una pieza de `screens/home` y `components/` no importa de `screens/`, y el listado de imports de `empty-state.tsx` está fijado por tests. Se replica la receta (misma curva y misma pareja de tokens) con valores compartidos.
- Icono `+` dibujado a mano en SVG: descartado en favor de `Plus` de `reicon-react-native`, ya en el proyecto (D-I). Si el humano quiere el trazo 2.8 exacto, se reabre en Q4.
- Huellas con el glifo `Paw` de `reicon-react-native`: descartado, no reproduce las tres huellas del artboard (círculos y elipse con su giro).
- `w-full` y `mt-2.5` en el `className` del `Button`: descartado, rompe los candados que fijan el literal de la etiqueta de apertura (#155 R3, #177). Van en un envoltorio.
- `Button.Label`/`Label.Text` para la etiqueta: descartado por la Enmienda #187; se conserva el `Text` de #177.
- Token CSS `--container-copy` para 290 px: una variable para una sola medida. El valor va inline, como el resto del archivo.

## Preguntas abiertas

- **Q1. Alcance.** Propuesta: variante `hero` solo en Inicio. Alternativa: extenderla a las siete pantallas restantes, con una enmienda por pantalla.
- **Q2. Orden con #177.** Cerrada: #177 mergeó antes (PR #231). R12 hereda su receta; ver D5.
- **Q3. Artboard vigente y enmienda (decisión humana, sigue abierta).** La spec se contrastó con la copia del artboard de #155 (versión `1791473009-3376`), no con el canvas vigente, que no se pudo leer. El humano confirma que el canvas no cambió desde entonces o indica qué cambió. Aprobar la Enmienda #176 (P1). Confirmar si el padding lateral de R3 se aplica al contenedor de #181 (propuesta: sí, R3).
- **Q4. Divergencias con el artboard (decisión humana).** Propuesta por defecto: mantener R13 (cuatro bloques, 0/60/120/180 ms, 12 px, curvas de `homeEntering`), `Plus` de reicon y la mascota `pingo-talk.webp`. Alternativas: (a) entrada literal del artboard (título 100 ms, cuerpo 160 ms, CTA 220 ms, 14 px, 400 ms ease-out, escenario sin entrada), que exige constantes nuevas; (b) `+` dibujado en SVG con trazo 2.8.
