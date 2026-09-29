---
feature: "mobile-quick-actions-pressed-feedback"
status: approved           # draft | spec_ready | approved
tags: [spec, mobile, ui, deuda]
---

# Requisitos — [[mobile-quick-actions-pressed-feedback]] (#136)

> Notación EARS. Cada requisito lleva su id `R<n>`, que no cambia una vez
> aprobado. Ver [[design]] para las decisiones y las alternativas descartadas,
> [[tasks]] para el orden TDD, los literales, los blobs y las sondas, y
> [[traceability]] para el cierre.
>
> Origen: hallazgo **(F)** de la spec de #81, registrado como #136 por decisión
> del humano al cerrar #81 (2026-09-29). Antes solo existía como «Deuda
> transversal detectada en #71, sin id» en `progress/history.md`
> (`grep -n "Deuda transversal detectada en #71" progress/history.md`).
>
> **Base medida: `073fa6cb`**, que es `origin/main` (merge de la PR #174 de
> #81). **Los números de línea no son anclas**, ni los de esta spec ni los de
> la entrada de `feature_list.json`. Todo se localiza con los `grep` que se
> citan, y las cuentas se vuelven a medir al arrancar ([[tasks]] §Antes de
> tocar nada).

## Contexto mínimo para implementar sin más contexto

La feature toca **tres ficheros**, todos bajo `mobile-pet-tracker/`:

| Fichero | Qué cambia |
|---|---|
| `src/screens/home/index.tsx` («la Home») | **una prop**: el `style` del `Pressable` de cada tile de accesos rápidos pasa de `style={CONTINUOUS_CORNER}` a una función de estado pulsado que conserva la esquina |
| `src/screens/home/index.test.tsx` («el test») | **un `it` nuevo** (`#136 R1`) y **un literal enmendado** en `#81 R3` |
| `src/__tests__/consistency-classnames.test.ts` («el test de consistencia») | **tres literales enmendados**: la fila de la Home en `#62 R14`, la suma de `#62 R14` y dos cifras de `#98 R10` |

La rejilla es hija directa de `home-content` y solo se pinta con una mascota
seleccionada. Los tres tiles salen de **un solo** `{QUICK_ACTIONS.map(`: el
fuente escribe la receta una vez, y el render la reparte a los tres. Así se
ven hoy en el árbol de RNTL v14, en nodos host:

```
View testID="quick-actions-row"        className="flex-row gap-3"
├─ View testID="quick-action-weight"   (Pressable, accessibilityRole="button",
│                                       className="min-h-11 flex-1 items-center gap-1.5 rounded-xl py-3 bg-category-violet",
│                                       style={ borderCurve: 'continuous' })
├─ View testID="quick-action-reminder" (igual, bg-category-amber)
└─ View testID="quick-action-documents"(igual, bg-category-blue)
```

Tras #136, el `style` del host de cada tile es `{ borderCurve: 'continuous',
opacity: 1 }` en reposo y `{ borderCurve: 'continuous', opacity: 0.8 }`
mientras se pulsa. Es la receta que ya usan la campana y «Ver todos» de la
Home (`opacity: pressed ? 0.8 : 1`), con la esquina continua esparcida dentro.

**Cómo se pulsa en jest** (medido sobre RN 0.86.2, [[design]] §D3):
`fireEvent(tile, 'responderGrant', …)` deja el `Pressable` pulsado, como en
`#122 R2`. `fireEvent(tile, 'responderTerminate', …)` termina la pulsación por
el mismo camino `pressOut` que una suelta, sin llamar a `onPress`, y el estado
pulsado se limpia **130 ms después** (la duración mínima de pulsación de
`Pressability`). `responderRelease` no sirve: sin un objetivo nativo,
`Pressability` lo ignora y el tile se queda pulsado.

## Premisas de la entrada, verificadas contra el árbol

Medidas con `bunx jest` desde `mobile-pet-tracker/`, sin pipe. Las sondas sobre
la Home se midieron con **copias temporales** de la Home y del test (la copia
del test importa la copia de la Home y lee su fuente), borradas después; la
Home no se tocó. Las copias y sus blobs están en [[tasks]] §Sondas.

| Premisa (`feature_list.json` #136) | Veredicto | Evidencia |
|---|---|---|
| Los tres tiles son `Pressable` con `style={CONTINUOUS_CORNER}` y sin estado pulsado | **cierta** | el `style` del tile es el objeto constante `CONTINUOUS_CORNER` (`grep -cxF '                    style={CONTINUOUS_CORNER}' src/screens/home/index.tsx` da 1), así que no depende de `pressed`. Con la Home de base, el `it` de R1 falla en reposo por `toEqual`: el host da `{ borderCurve: 'continuous' }`, sin opacidad |
| Receta ya usada: campana y «Ver todos» de la Home, filas del centro de alertas, `meal-toggle` de Nutrición; el selector de métrica la combina en una función que devuelve un array | **cierta** | `grep -cF "opacity: pressed ? 0.8 : 1" src/screens/home/index.tsx` da 2 (campana y «Ver todos»). `src/app/(tabs)/food.tsx` la escribe en varias líneas. `src/screens/home/weekly-activity-chart.tsx` devuelve `[{ flexBasis: 0, flexGrow: …, opacity: pressed ? 0.8 : 1 }]`. La forma de array se descarta para los tiles ([[design]] §Alternativas) |
| El tile tiene que conservar la esquina continua | **cierta** | Decisión fija 12 de `docs/ui-guidelines.md` y `#81 R3`. La receta literal de la entrada, `({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })`, **la perdería**: por eso esta spec esparce `CONTINUOUS_CORNER` dentro de la función ([[design]] §D1) |
| La carta pide la forma de la receta | **cierta** | §Micro-reglas de pulido: «Feedback pressed en TODO elemento tappable (Pressable style function o componente heroui que ya lo trae)». El corolario de la Decisión fija 12 dice que la esquina «declara `style={CONTINUOUS_CORNER}`», pero el repo ya la compone en dos sitios sin esa forma literal: el `Card` compartido (`StyleSheet.flatten([CONTINUOUS_CORNER, style])` en `src/components/card.tsx`) y el tooltip del gráfico semanal (`style={[` con `CONTINUOUS_CORNER,` dentro, en `src/screens/home/weekly-activity-chart.tsx`). El tile será el tercero |
| Choca con `#81 R3`, que asevera `toEqual({ borderCurve: 'continuous' })` | **cierta, medida** | con el test enmendado y la Home de base, rojo 2 en el test: `#81 R3` y `#136 R1`, los dos por `expect(received).toEqual(expected)` |
| `#62 R14` y `#98 R10` vigilan las 2 esquinas de la Home en el fuente; hay que medir cuáles se mueven | **cierta; se mueven tres cifras** | tras el cambio, `style={CONTINUOUS_CORNER}` da 1 en la Home (queda `collar-pair-link`) y 32 en todo `src/` sin tests (hoy 2 y 33). Se mueven: la fila de la Home en `#62 R14` (2 → 1), la suma de `#62 R14` (`33 + 1 + 1` → `33 + 1 + 1 - 1`) y dos cifras de `#98 R10` (Home 2 → 1, repo 33 → 32). Con esas enmiendas y la Home de base, el test de consistencia da rojo 2 de 53, por `toHaveLength`. La suma queda verde en los dos estados: es aritmética sobre la tabla |
| El candado va en render, con el patrón de `#122 R2` (`responderGrant` y `toHaveStyle({ opacity: 0.8 })`) | **en parte** | `responderGrant`, sí. `toHaveStyle` no alcanza: compara un subconjunto y deja pasar una clave de más o la esquina perdida. `#136 R1` asevera el `style` entero con `toEqual` ([[design]] §D2) |
| `files_affected`: la Home y el test | **en parte** | falta `src/__tests__/consistency-classnames.test.ts`, que lleva las tres enmiendas de R3 |
| Suite de base | **medida** | el `leader` la midió con `./init.sh` sobre `073fa6cb`: 86 suites / 1608 tests / 1 snapshot, `exit=0`. Esta spec midió los dos tests que toca, juntos: 219 de 219 (166 el test y 53 el de consistencia), `exit=0`. `bunx tsc --noEmit` y `bunx eslint`, con la Home ya cambiada en la copia temporal, dan `exit=0` |
| Blobs de base | **medidos** | la Home `ff591a1f567e00c0aee57db29ca1706b3a925cad`, el test `f91c8971e21198c4a65eebf0e40aaf35f0ac6472` y el de consistencia `07cc45b4da0ce1fe0f7397e323188ae2aec1c73b`. Iguales en `HEAD` y en `origin/main` |
| Entorno | **verificado** | `test ! -e .expo/types/router.d.ts` da `exit=0` |

## Qué decisiones del tile toca esta feature

El inventario completo del tile está en
`specs/mobile-quick-actions-typography-lock/requirements.md` §Inventario. Su
fila «feedback de pulsado: no existe» es la única que cambia:

| Decisión | Antes | Tras #136 | Candado |
|---|---|---|---|
| estado pulsado, por tile | ninguno | opacidad 0.8 mientras se pulsa, 1 en reposo, cambio instantáneo | **#136 R1** |
| forma del `style` del tile | objeto `CONTINUOUS_CORNER` | función de `pressed` que devuelve un **objeto** con la esquina y la opacidad | **#136 R1** (pulsado y suelto) y **#81 R3** enmendado (reposo) |
| esquina continua | en el `style` fijo, vigilada en el fuente por `#62 R14` y `#98 R10` | dentro de la función; el fuente ya no la ve en el tile | en render, **#136 R1** y **#81 R3** |
| radio (`rounded-xl` único), icono, etiqueta, fondo, tinta, destino, objetivo táctil, rol, nombre accesible, anatomía, orden, condición de render | — | sin cambio | `#71 R1` y `#81 R1` a `R6`, intactos salvo el literal de `#81 R3` |

## Requisitos funcionales

El `it` nuevo vive en
`describe('#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado'`
(«el `describe` de #81»), justo después de `#81 R3`, y reutiliza su
`beforeEach`. Recorre los tres tiles con una tabla literal del test:
`quick-action-weight`, `quick-action-reminder` y `quick-action-documents`. El
código exacto está en [[tasks]].

- **R1**: WHEN el usuario pulse un tile de accesos rápidos, THE SYSTEM SHALL
  pintar el host de **ese** tile con `style` igual a
  `{ borderCurve: 'continuous', opacity: 0.8 }` mientras dure la pulsación, y
  dejar los otros dos en `{ borderCurve: 'continuous', opacity: 1 }`. WHEN la
  pulsación termine, THE SYSTEM SHALL devolver el tile a
  `{ borderCurve: 'continuous', opacity: 1 }`. Vale para **cada uno de los
  tres tiles**.

  `#136 R1: cada tile baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua`
  asevera, por tile y en este orden:

  1. en reposo, `tile.props.style` `toEqual({ borderCurve: 'continuous', opacity: 1 })`;
  2. tras `fireEvent(tile, 'responderGrant', …)`, `tile.props.style`
     `toEqual({ borderCurve: 'continuous', opacity: 0.8 })`, y el de cada uno
     de los otros dos, `toEqual({ borderCurve: 'continuous', opacity: 1 })`;
  3. tras `fireEvent(tile, 'responderTerminate', …)`, dentro de un `waitFor`,
     `tile.props.style` `toEqual({ borderCurve: 'continuous', opacity: 1 })`.

  Los esperados son **literales**: el test no importa `CONTINUOUS_CORNER` ni
  nada de la Home. El rojo es **natural**: con la Home de base el `it` falla
  en el paso 1 del primer tile, por `toEqual`.

  IF un solo tile pierde la receta (su `style` vuelve a `CONTINUOUS_CORNER`, o
  su pulsado no baja de 1), o el valor pulsado o el de reposo cambian, o el
  `style` gana una clave, pierde la esquina o pasa a ser un array, THEN el
  `it` SHALL fallar **por aserción** (`toEqual`). IF el estado pulsado es
  compartido por la fila, THEN SHALL fallar por aserción en el paso 2. IF el
  tile se queda pulsado al terminar, THEN SHALL fallar por aserción en el
  `waitFor` del paso 3. Ninguna de esas mutaciones falla por consulta.

- **R2**: WHILE ningún tile esté pulsado, THE SYSTEM SHALL dar a **cada tile**
  `rounded-xl` como **único** token de radio y `style` igual a
  `{ borderCurve: 'continuous', opacity: 1 }`.

  Lo prueba `#81 R3: cada tile lleva rounded-xl como único radio y la esquina continua`,
  **enmendado**: su `toEqual({ borderCurve: 'continuous' })` pasa a
  `toEqual({ borderCurve: 'continuous', opacity: 1 })`, con un comentario que
  cita `#136 R2`. El título y la aseveración del radio no cambian.

  IF un tile pierde la opacidad de reposo, la esquina, o gana una clave, THEN
  `#81 R3` SHALL fallar **por aserción** (`toEqual`). El rojo es **natural**:
  con la Home de base, `#81 R3` enmendado falla.

- **R3**: THE SYSTEM SHALL dejar en la Home **exactamente un**
  `style={CONTINUOUS_CORNER}`, el de `collar-pair-link`, y **32** en todo
  `src/` sin tests. La esquina de los tiles viaja dentro de su función de
  `style` como `...CONTINUOUS_CORNER`.

  Lo prueban tres `it` del test de consistencia, **enmendados**:

  1. `#62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/home/index.tsx importa y aplica sus 1 esquinas`
     (la fila de la Home en `directUses` pasa de 2 a 1, y con ella el título
     que genera `it.each`);
  2. `#62 R14: … › fusiona la esquina una vez y la entrega a las dos ramas de Card`
     (la suma pasa de `33 + 1 + 1` a `33 + 1 + 1 - 1`);
  3. `#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`
     (la Home pasa de 2 a 1 y el repo, de 33 a 32).

  Cada enmienda lleva un comentario que cita `#136 R3`. El rojo es
  **natural** para el 1 y el 3: con la Home de base fallan por `toHaveLength`.
  El 2 queda verde antes y después, porque suma la tabla y no lee el fuente;
  se enmienda para que la tabla y la suma sigan cuadrando.

  IF la receta se aplica también a `collar-pair-link`, o el fuente del tile
  conserva la línea `style={CONTINUOUS_CORNER}` (la Home de base), THEN el 1 y
  el 3 SHALL fallar **por aserción** (`toHaveLength`). Una mutación que no
  cambia esa cuenta de fuente (un tile condicionado con `index === N`, por
  ejemplo) no la ven: la cierran R1 y R2 en render.

- **R4**: THE SYSTEM SHALL cerrar con:

  1. **El delta declarado**: +0 suites y +1 test. El test pasa de 166 a 167,
     el de consistencia se queda en 53, y la suite, de 86 / 1608 a
     86 / **1609**, medida sin pipe. Si la base medida al arrancar es otra, el
     delta exigido sigue siendo +1 test y +0 suites sobre lo medido.
  2. **Los candados enmendados son exactamente los de R2 y R3**: `#81 R3` y
     los tres `it` de R3. Ninguna otra cifra de candado se mueve, con los
     `grep` de [[tasks]] §R4.
  3. **Diff de producción mínimo**: `git diff origin/main...HEAD --
     mobile-pet-tracker/src/` toca solo la Home y los dos tests, y el de la
     Home cambia **una** línea por cuatro, dentro de `{QUICK_ACTIONS.map(`.
  4. `bunx tsc --noEmit` con `exit=0` tras `test ! -e .expo/types/router.d.ts`,
     y `bunx eslint` de los tres ficheros con `exit=0`.
  5. **Ninguna dependencia ni copy nuevas**: no cambian `package.json`,
     `bun.lock`, `src/i18n/catalog.ts` ni
     `src/providers/__tests__/language-provider.test.tsx`, que cierra la
     longitud del catálogo.
  6. **La tabla de sondas** de [[tasks]] §Sondas, re-medida sobre el árbol
     final, en `progress/impl_mobile-quick-actions-pressed-feedback.md`.

  No tiene test propio, porque es una propiedad del diff y de la suite. Lo
  cierra el `reviewer` por inspección.

- **R5**: WHEN el humano pulse cada tile en un **dev build de Android**, THE
  SYSTEM SHALL atenuarlo de forma visible mientras el dedo esté encima,
  devolverlo a su opacidad al soltar, seguir navegando a su destino y
  conservar la esquina redondeada. Lo cierra el humano en §Prueba de humo del
  humano, con su propia casilla.

## Tabla de sondas, resumen

Cada sonda, con su mutación literal y su blob, está en [[tasks]] §Sondas.
«Medido» es sobre la copia temporal de la Home final con la copia del test
final (167 tests), solo el test. Las sondas no mueven el fuente que leen
`#62 R14` y `#98 R10`, salvo `collar`, así que el test de consistencia queda
verde con todas las demás.

| Sonda | Mutación | Medido en el test | Test de consistencia |
|---|---|---|---|
| `t0`, `t1`, `t2` | un solo tile (índice 0, 1 o 2) vuelve a `CONTINUOUS_CORNER` | rojo 2: `#136 R1` y `#81 R3`, por aserción | verde (deducido) |
| `nopress_t0`, `nopress_t1`, `nopress_t2` | un solo tile no baja de 1 al pulsarlo | rojo 1: `#136 R1`, por aserción | verde (deducido) |
| `pressed07` | valor pulsado 0.7 en los tres | rojo 1: `#136 R1`, por aserción | verde (deducido) |
| `pressed07_t1` | valor pulsado 0.7 solo en el tile 1 | rojo 1: `#136 R1`, por aserción | verde (deducido) |
| `rest09` | opacidad de reposo 0.9 | rojo 2: `#136 R1` y `#81 R3`, por aserción | verde (deducido) |
| `stray` | una clave de más (`overflow: 'hidden'`) | rojo 2: `#136 R1` y `#81 R3`, por aserción | verde (deducido) |
| `nocorner` | la función pierde `...CONTINUOUS_CORNER` | rojo 2: `#136 R1` y `#81 R3`, por aserción | verde (deducido) |
| `nostyle` | el tile pierde el `style` entero | rojo 2: `#136 R1` y `#81 R3`, por aserción | verde (deducido) |
| `array` | `[CONTINUOUS_CORNER, { opacity: … }]` | rojo 2: `#136 R1` y `#81 R3`, por aserción | verde (deducido) |
| `shared` | un estado pulsado compartido por la fila | rojo 1: `#136 R1`, por aserción en el paso 2 | verde (deducido) |
| `sticky` | el tile se queda pulsado al terminar | rojo 1: `#136 R1`, por aserción en el `waitFor` | verde (deducido) |
| `collar` | la receta también en `collar-pair-link` | **verde** 167 de 167 | rojo 2: `#62 R14 › … sus 1 esquinas` y `#98 R10`, por `toHaveLength` (deducido) |
| `android_only` | el pulsado solo fuera de Android (`Platform.OS !== 'android'`) | **verde** 167 de 167: jest corre como iOS | verde (deducido). **Punto ciego declarado**: lo cubre R5 |

La base de hoy, con el test y el de consistencia ya enmendados, es el estado
del último rojo de [[tasks]]: rojo 2 en el test y rojo 2 en el de consistencia,
todos medidos. La columna «deducido» la mide el implementer corriendo los dos
tests juntos, 220 tests ([[tasks]] §Sondas).

## Qué firma el humano al aprobar esta spec

1. **Cambio instantáneo, sin animación.** La carta dice «150ms feedback» en
   §Animación, pero esa sección rige animaciones. Los cinco sitios del repo
   que ya tienen feedback de pulsado (campana, «Ver todos», filas de alertas,
   `meal-toggle` y el selector de métrica) cambian la opacidad al instante con
   la función de `style` que nombra la carta (§Micro-reglas de pulido), y
   ninguno anima. Los tiles siguen el mismo patrón. La
   versión animada queda descartada en [[design]] §Alternativas, incluida la
   receta de la skill `animate-expo` de `.agents/skills/` (escala 0.97 con
   transición CSS en 100 a 150 ms), que Codex puede leer.
2. **La forma del `style` queda fijada**: una función que devuelve un
   **objeto** con la esquina y la opacidad. `#136 R1` y `#81 R3` comparan el
   objeto entero con `toEqual`, así que un array visualmente idéntico
   (`[CONTINUOUS_CORNER, { opacity }]`) da rojo. Es a propósito: el test no
   puede usar `StyleSheet.flatten`, que la guarda de `design-drift` prohíbe en
   el test, y `toHaveStyle` dejaría pasar claves de más.
3. **Candados enmendados a propósito**: `#81 R3` (un literal) y, en el test de
   consistencia, la fila de la Home y la suma de `#62 R14` y dos cifras de
   `#98 R10`. **Medidos sin moverse**: todos los demás, con los `grep` de
   [[tasks]] §R4. No se mueve ninguna otra cifra.
4. **El fuente deja de vigilar la esquina de los tiles.** `#62 R14` y `#98 R10`
   cuentan `style={CONTINUOUS_CORNER}`, y los tiles ya no lo escriben así. La
   vigilancia pasa al render: `#81 R3` en reposo y `#136 R1` pulsado y suelto.
   El control de `rounded-full` de `#62 R14` tampoco mira ya el tile; lo cubre
   el «`rounded-xl` único» de `#81 R3`. El tile deja de cumplir la **letra**
   del corolario de la Decisión fija 12 («declara `style={CONTINUOUS_CORNER}`»)
   y cumple su intención, como ya hacen el `Card` y el tooltip del gráfico
   (§Premisas). La carta no se enmienda.
5. **La suelta se prueba con `responderTerminate`**, no con
   `responderRelease` ([[design]] §D3). El camino de `onPress` ya lo cierra
   `#71 R1 › lleva cada tile a su ruta existente`, que no cambia.
6. **El delta es +0 suites y +1 test**: 86 / 1608 antes y 86 / 1609 después,
   sobre la base del `leader`.
7. **Punto ciego de plataforma**: jest corre como iOS, así que una receta que
   solo falle en Android da verde (sonda `android_only`, medida). La prueba de
   humo de R5 lo cubre.
8. **Sin háptica.** La tabla de la carta (§Animación, expo-haptics) no
   incluye un toque de navegación, y la háptica nunca puede ser el único
   feedback.
9. **Las siete preguntas de la Home** (Dirección de arte 3): esta feature no
   responde ninguna ni deja de responder ninguna. Es feedback de interacción
   sobre una rejilla de accesos, sin datos.
10. **Requisitos sin test propio**: R4, una propiedad del diff y de la suite,
    que cierra el `reviewer` por inspección, y R5, que cierra el humano.
    Queda declarado antes del handoff, como pide C4.

## Prueba de humo del humano (no delegable a IA) — R5

**Entorno:**

- **Dev build de Android**, nunca Expo Go. No hace falta regenerarlo, porque la
  feature no tiene cambios nativos: basta el JS de esta branch desde Metro
  (`bunx expo start --dev-client`, desde `mobile-pet-tracker/`).
- Una sesión con **una mascota seleccionada**. Sin mascota no se pinta la
  rejilla: **parar y avisar**.
- `adb` conectado. Con dos transportes Wi-Fi, usar siempre
  `adb -s <ip:puerto>` (en Windows, `adb devices -l` y filtrar con `findstr`).

**Pasos:**

1. Abrir la app en la **Home** y desplazarse hasta **«Accesos rápidos»**. Ver
   los tres tiles: «Peso», «Recordatorio» y «Documentos».
2. **Mantener pulsado «Peso»** un segundo, sin mover el dedo. El tile se ve
   **claramente más tenue** mientras el dedo sigue encima; los otros dos no
   cambian. Sin levantar el dedo, **arrastrarlo fuera del tile** y soltar: el
   tile vuelve a su opacidad y **no navega**.
3. **Tocar «Peso»** de forma normal: se atenúa un instante y abre el registro
   de peso. Volver atrás.
4. Repetir los pasos 2 y 3 con **«Recordatorio»** (abre la pantalla de nuevo
   recordatorio) y con **«Documentos»** (abre los documentos de la mascota).
5. En reposo y pulsados, las **esquinas** de los tres tiles se ven igual que
   antes: redondeadas y suaves, sin picos ni recortes.

   Captura con un tile pulsado (paso 2), si se puede:
   `adb -s <ip:puerto> shell screencap -p /sdcard/s136.png` y
   `adb -s <ip:puerto> pull /sdcard/s136.png`.

**Criterio de paso**: los pasos 2 a 5 se cumplen tal como están escritos para
los tres tiles.

- [ ] Prueba de humo de R5 superada por el humano (fecha: ____, dispositivo: ____, Android: ____)

---

## Cobertura de los criterios de aceptación de `feature_list.json` #136

| Criterio | Cubierto por |
|---|---|
| 1. Pulsar cada tile pone su opacidad en 0.8 y soltarlo la devuelve a 1, medido en el árbol renderizado | R1: pasos 1 a 3 por tile, en render. La suelta es `responderTerminate` más `waitFor` ([[design]] §D3) |
| 2. Cada tile conserva `borderCurve` continuous en reposo y pulsado, y `rounded-xl` como único radio | R1 (pulsado y suelto, `toEqual` con la esquina) y R2 (reposo y radio, `#81 R3` enmendado) |
| 3. Quitar la receta de pulsado de un solo tile pone la suite roja | R1. Sondas `t0`, `t1`, `t2` y `nopress_t0`, `nopress_t1`, `nopress_t2`, medidas en rojo |
| 4. La spec declara qué candados enmienda (#81 R3 como mínimo) y mide si se mueven #62 R14 y #98 R10; ninguna otra cifra se mueve | §Premisas (medido: se mueven tres cifras), R2, R3 y R4.2. §Qué firma el humano, punto 3 |
| 5. Suite móvil completa verde, sin pipe; tsc y lint `exit=0` | R4.1 y R4.4 |
| 6. Smoke en dev build de Android: los tres tiles dan feedback visible | R5 y su casilla |

## Fuera de alcance

Cada viñeta lleva su clase: **(D)** es un límite de esta feature, **(F)** es un
hallazgo que podría registrarse como otra feature (sin id: lo asigna el
`leader` contra `origin/main`) y **(N)** es una premisa verificada y
descartada.

- **(D)** Feedback animado (Reanimated, 150 ms), escala o sombra al pulsar:
  descartados en [[design]] §Alternativas. El cambio es instantáneo, como en
  el resto del repo.
- **(D)** Háptica al pulsar un tile (§Qué firma el humano, punto 8).
- **(D)** Ningún otro `Pressable` de la app. La entrada se limita a los tres
  tiles y no audita los demás.
- **(D)** La variante `active:opacity-80` de uniwind: jest no resuelve
  `className`, así que no se podría candar en render ([[design]]
  §Alternativas).
- **(D)** No se vuelve a candar lo que ya tiene candado y no cambia: destino
  (`#71 R1 › lleva cada tile a su ruta existente`), objetivo táctil, rol,
  nombre accesible, anatomía, orden, radio y condición de render (`#71 R1` y
  `#81 R1` a `R6`).
- **(D)** No hay copy nueva ni dependencias. No se tocan `src/i18n/catalog.ts`,
  `src/providers/__tests__/language-provider.test.tsx`,
  `src/__tests__/ui-copy-table.ts`, `package.json` ni `bun.lock`.
- **(D)** `docs/ui-guidelines.md` no se enmienda: la regla («Feedback pressed
  en TODO elemento tappable») ya está escrita.
- **(F)** *`collar-pair-link` tampoco tiene feedback de pulsado.* Es el otro
  `Pressable` de la Home con `style={CONTINUOUS_CORNER}`
  (`grep -n 'testID="collar-pair-link"' src/screens/home/index.tsx`), en la
  tarjeta del collar cuando la mascota no tiene dispositivo. Mismo hueco, mismo
  arreglo, pero moverlo cambiaría otra vez `#62 R14` y `#98 R10`. Sin id.
- **(N)** *«Hay un solo sitio resuelto en todo el repo»*, de la deuda de #71 en
  `progress/history.md`. Caducó: hoy son cinco (§Qué firma el humano,
  punto 1). No afecta a esta feature.

---

## Aprobación

- [x] **Aprobado por humano** (fecha: 2026-09-29) ← gate obligatorio antes de
      implementar. Al marcar esta casilla, el humano firma también los diez
      puntos de §Qué firma el humano al aprobar esta spec.

> **Esta feature tiene dos casillas.** Esta, antes del handoff, y la de R5 en
> §Prueba de humo del humano, después del veredicto del `reviewer`. La feature
> no se marca `done` sin las dos.
