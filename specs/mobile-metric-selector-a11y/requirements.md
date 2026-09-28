---
feature: "mobile-metric-selector-a11y"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, a11y, deuda]
---

# Requisitos — [[mobile-metric-selector-a11y]] (#74)

> Notación EARS. Cada requisito lleva su id `R<n>`, inmutable una vez aprobado.
> Ver [[design]] para las decisiones y las alternativas descartadas, [[tasks]]
> para el orden TDD, los literales, los blobs y las sondas, y [[traceability]]
> para el cierre.
>
> Origen: las tres observaciones no bloqueantes del tercer veredicto de #68
> (`progress/review_mobile-home-weekly-activity.md`, observaciones 1, 2 y 4,
> con el análisis en su §3). Las tres ya tenían un handoff escrito para la
> branch de #68 (`progress/handoff_mobile-home-weekly-activity_a11y.md`), que
> nunca se ejecutó. **Esta spec lo sustituye**: su formato de commit
> (`fix(mobile-home-weekly-activity): … (R6) / (R9)`), su branch y su
> `./init.sh` final eran los de #68.
>
> **Base medida: `912d11dc`**, que es `origin/main` (`c06b9749`, merge de #120)
> más `progress/current.md`. **Los números de línea no son anclas**, ni los de
> esta spec ni los de la entrada de `feature_list.json`: todo se localiza con
> los `grep` que se citan, y las cuentas se vuelven a medir al arrancar
> ([[tasks]] §Antes de tocar nada).

## Contexto mínimo para implementar sin más contexto

La feature toca **dos ficheros**, los dos bajo `mobile-pet-tracker/src/screens/home/`:

- `weekly-activity-chart.tsx` (producción). El selector de métrica es la
  función `MetricSelector` (`grep -n "function MetricSelector"`). Su contenedor
  es el único `View` con `testID="weekly-activity-metric"`
  (`grep -c 'testID="weekly-activity-metric"'` da 1). Dentro hay tres
  `Pressable`, uno por cada valor de `WEEKLY_METRICS`
  (`['activeMinutes', 'distanceM', 'walkCount']`). Cada uno lleva `accessible`,
  `accessibilityLabel={label}`, `accessibilityRole="radio"` y
  `accessibilityState={{ selected }}`. Cada etiqueta es un `Text` con
  `testID={`weekly-activity-metric-label-${metric}`}`, `numberOfLines={1}`,
  `adjustsFontSizeToFit`, `minimumFontScale={METRIC_LABEL_MIN_FONT_SCALE}`
  (0.85) y `maxFontSizeMultiplier={METRIC_LABEL_MAX_FONT_SIZE_MULTIPLIER}`
  (1.2). El selector solo se pinta si hay al menos un día medido
  (`{hasMeasuredDay ? (`). Todo va dentro de
  `<Card testID="weekly-activity-card" className="gap-2">`.
- `weekly-activity-chart.test.tsx` (tests, 36 hoy). Pinta el componente real
  con `renderChart(days, weekComparison?, language?)` y
  `makeWeek(from, minutes)`. El último `describe` del fichero es
  `describe('R8: tocar un día abre su detalle'`.

`src/components/card.tsx` es el componente compartido `Card`
(`docs/ui-guidelines.md` §Decisiones fijas 4). Sin `onPress`, pinta un `View`
con `{...rest}`, `className` y `style`. Con `onPress`, pinta un `Pressable`
con `accessibilityRole="button"`, que en TalkBack es un solo nodo con todo el
subárbol dentro. Esta feature **no lo modifica**.

## Premisas de la entrada, verificadas contra el árbol

| Premisa (`feature_list.json` #74 y el encargo del `leader`) | Veredicto | Evidencia |
|---|---|---|
| El contenedor de las tres opciones no declara `accessibilityRole="radiogroup"` | **cierta** | `grep -c 'accessibilityRole="radiogroup"' src/screens/home/weekly-activity-chart.tsx` da 0 |
| El contenedor está en `weekly-activity-chart.tsx:325-328` | **caducada** | hoy el `testID` está en otra línea. Se ancla por `testID="weekly-activity-metric"`, que es único |
| Cada `Pressable` tiene su rol `radio` y su `accessibilityState.selected` | **cierta**, y ya con candado | `#68 R6 › ofrece tres opciones accesibles y mantiene cada etiqueta en una línea` asevera el rol (`within(selector).getAllByRole('radio')`), las etiquetas y los estados |
| Con `accessible` + `accessibilityLabel` en el contenedor, la suite sigue verde | **cierta, re-medida en toda la suite** | blob `5277567681cbaa61818f4854afe676fafe19c117` del `.tsx`: el fichero de la gráfica da 36/36, y la suite, 83 / 1532 / 1, `exit=0` |
| Sin `radiogroup`, «TalkBack no anuncia "1 de 3"»; con él, sí lo anunciaría | **falsa la segunda mitad** | en RN 0.86.2 el rol `radiogroup` solo pone una `roleDescription`: `grep -n "AccessibilityRole.RADIOGROUP ->" node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/uimanager/ReactAccessibilityDelegate.kt`. En español es «Grupo de botones de opción» (`grep -n radiogroup_description node_modules/react-native/ReactAndroid/src/main/res/views/uimanager/values-es/strings.xml`). La posición «x de y» sale de `CollectionInfo`, y el único que la escribe es el `ScrollView`: `grep -rln "CollectionInfo" node_modules/react-native/ReactAndroid/src/main/java` devuelve solo `ReactScrollViewAccessibilityDelegate.kt`. Así que R1 fija el rol, y el gate R6 anota literalmente lo que se oye |
| El candado debe copiar «el patrón que R9 ya usa» para las siete columnas | **cierta la cita, insuficiente el patrón** | `#68 R9 › anuncia los huecos sin colapsar las siete columnas` asevera solo `accessibilityLabel` `toBeUndefined()` en `weekly-activity-day-row`. Con `accessible` solo en esa fila, la suite de la gráfica da 36/36 (blob `4ed672f12e64205efb0cb3c78157fcdd574db1c0`). Y un `aria-label` llega al host como `aria-label`, no como `accessibilityLabel` (sonda `arialabel` de [[tasks]] §Sondas). R2 usa una lista cerrada de props ([[design]] §R2) |
| `minimumFontScale={0.85}` es inerte en Android porque el runtime lee `minimumFontSize` y `<Text>` no lo expone | **cierta** | `grep -n "minimumFontScale\|minimumFontSize" node_modules/react-native/Libraries/Text/TextNativeComponent.js` da solo `minimumFontScale: true`. Android lee solo `PA_KEY_MINIMUM_FONT_SIZE` (`grep -rn "PA_KEY_MINIMUM_FONT_SIZE" node_modules/react-native/ReactAndroid/src/main/java`: `TextLayoutManager.kt` y `ReactTextViewManager.kt`). La constante `MINIMUM_FONT_SCALE` de `ViewProps.kt` no tiene consumidor |
| El suelo real en Android es 4 dp | **cierta** | `grep -n "Minimum font size is 4pts" node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/views/text/TextLayoutManager.kt`, y justo debajo el `4.dpToPx()` de respaldo |
| `adjustsFontSizeToFit` sí actúa en Android | **cierta** | §3 del veredicto de #68, re-verificada: la rama `adjustSpannableFontToFit` de `TextLayoutManager.kt` |
| La carta fija 10 px como tamaño mínimo (§3 y obs. 2 del veredicto de #68) | **falsa** | `docs/ui-guidelines.md` §Decisiones fijas 2 lista `--text-2xs: 10px` entre los tokens existentes. Ninguna regla lo fija como mínimo: `grep -n -i "mínim\|minimo\|minimum" docs/ui-guidelines.md` no devuelve nada, y `grep -n "2xs" docs/ui-guidelines.md` solo da la lista de tokens. Las etiquetas usan `text-xs` (12 px); con 0.85 el suelo en iOS es 10.2 px |
| El `jest.mock('uniwind')` está muerto | **cierta, medida dos veces** | quitarlo deja la gráfica en 36/36 (blob del test `0d83e5797d3bbfecddcf31b3f3ef3ef2845aaf2e`). Con `useUniwind` cambiado por un `throw`, también 36/36 (blob `a30697035570341fa3b92b5595801a6c4611e976`): nadie lo llama. `mockTheme` **no** está muerto, porque lo usa el mock de `../../theme/use-theme-colors` |
| El mock está en `weekly-activity-chart.test.tsx:53-56` | **cierta hoy, no es ancla** | se ancla por `jest.mock('uniwind', () => ({` |
| `files_affected` son los dos ficheros de la gráfica | **cierta** | ningún requisito toca otro fichero de `mobile-pet-tracker/` |
| #77 no toca los ficheros de esta feature | **cierta** | `git diff --name-only origin/main...origin/feature/77-mobile-home-weight-without-collar` (en `9f0e94ad`) no incluye ninguno de los dos. Sí comparte `feature_list.json` y `progress/current.md` ([[design]] §Coordinación) |
| Suite de base | **medida sin pipe** | la gráfica, 36/36, `exit=0`. La suite, 83 suites / 1532 tests / 1 snapshot, `exit=0`. `bunx tsc --noEmit` y `bunx eslint` de los dos ficheros, `exit=0` |
| Blobs de base | **medidos** | `weekly-activity-chart.tsx` `128c09bd9a6e5aa55bdcbedbd4a67e23f956044b` y `weekly-activity-chart.test.tsx` `bc8e8fd93da7f4ec8a70291963ba7dfda97fe164`. Iguales en `HEAD` y en `origin/main` |
| Entorno | **verificado** | `test ! -e .expo/types/router.d.ts` da `exit=0`. No hay hooks de git (ni `core.hooksPath` ni hooks sin `.sample`) ni prettier en `mobile-pet-tracker/` |

## Requisitos funcionales

- **R1**: WHEN `WeeklyActivityChart` se pinta con al menos un día medido, THE
  SYSTEM SHALL declarar `accessibilityRole="radiogroup"` en el `View` con
  `testID="weekly-activity-metric"`. El test lee la prop del host, porque
  `getByRole` no ve un `View` que no es `accessible`:

  `#74 R1: el contenedor del selector se anuncia como grupo de opciones › declara el rol radiogroup en el contenedor de las tres opciones`

  asevera `toBe('radiogroup')`. Hoy es un rojo natural por `toBe`, y es el
  **único** rojo de la suite (medido: 1 failed de 1533).

- **R2**: WHILE el selector esté en pantalla, THE SYSTEM SHALL mantener el
  contenedor y la tarjeta que lo envuelve **fuera del árbol de accesibilidad
  como nodos propios**, para que TalkBack no funda las tres opciones en uno.
  Se comprueba con dos listas cerradas de props del host, ordenadas:

  1. `#74 R2: el grupo del selector no colapsa sus tres opciones › el contenedor solo lleva su rol, su testID, su clase y sus hijos`:
     las claves de `weekly-activity-metric` son exactamente
     `['accessibilityRole', 'children', 'className', 'testID']`.
  2. `#74 R2: el grupo del selector no colapsa sus tres opciones › la tarjeta que lo envuelve tampoco se vuelve un nodo accesible`:
     las claves de `weekly-activity-card` son exactamente
     `['children', 'className', 'style', 'testID']`.

  IF el contenedor recibe `accessible`, `accessibilityLabel`, `aria-label`,
  `importantForAccessibility` o cualquier otra prop, o la tarjeta recibe
  `accessible` u `onPress`, THEN el `it` correspondiente SHALL fallar por
  `toEqual`. Los literales esperados son del test, y ninguno se importa de
  producción. Con la mutación `P2red` versionada en el rojo (C4, vía **b**),
  los dos `it` SHALL ser los **únicos** rojos de la suite (medido: 2 failed de
  1535).

- **R3**: WHEN se pintan las etiquetas del selector, THE SYSTEM SHALL darles, en
  las tres (`weekly-activity-metric-label-<metric>` para cada valor de
  `WEEKLY_METRICS`), `minimumFontScale` 0.85 y `maxFontSizeMultiplier` 1.2
  en Android y en iOS. El valor de `adjustsFontSizeToFit` depende de la opción
  que firme el humano (§Qué firma el humano, punto 1):

  | | iOS | Android |
  |---|---|---|
  | **Opción A** (recomendada) | `true` | `true`: encoge, con suelo real de 4 dp |
  | **Opción B** | `true` | `false`: no encoge, y lo que no cabe se recorta con «…» |

  THE SYSTEM SHALL llevar, justo encima de
  `const METRIC_LABEL_MIN_FONT_SCALE = 0.85;`, el comentario en inglés de dos
  líneas de [[tasks]] §R3 para la opción elegida. Dice que Android ignora
  `minimumFontScale` y por qué, y qué pasa allí en su lugar. El comentario no
  tiene test: el `reviewer` lo verifica con el `grep` de [[tasks]] §R3.

  El test es un `it.each` de dos filas, `android` y `ios`, que fija
  `Platform.OS` con `Object.defineProperty` y lo restaura en `afterEach`, como
  ya hace `src/utils/date-picker-value.test.ts` (#123):

  `#74 R3: el ajuste y el suelo de las etiquetas del selector, por plataforma › %s: ajuste %s, escala mínima 0.85 y tope 1.2 en las tres etiquetas`

  Asevera con `toEqual` la tabla `[adjustsFontSizeToFit, minimumFontScale, maxFontSizeMultiplier]`
  de las tres etiquetas, con literales del test.

  - **Con A**, el rojo es la mutación `P3redA` versionada (C4, vía **b**):
    quitar la línea `minimumFontScale={METRIC_LABEL_MIN_FONT_SCALE}`. Rojas las
    dos filas, y solo ellas en la suite (medido: 2 failed de 1537). El verde
    revierte con `git checkout HEAD~1 --` y añade el comentario.
  - **Con B**, el rojo es natural: la fila `android` pide `false` y hoy es
    `true`. Es el único rojo de la suite (medido: 1 failed de 1537). El verde
    añade `Platform` al import de `react-native`, cambia `adjustsFontSizeToFit`
    por `adjustsFontSizeToFit={Platform.OS !== 'android'}` y añade el
    comentario.

- **R4**: THE SYSTEM SHALL borrar de `weekly-activity-chart.test.tsx` el bloque
  `jest.mock('uniwind', () => ({` … `}));` (cuatro líneas) y la línea en
  blanco que lo sigue, y nada más. Al acabar:
  - `grep -c "jest.mock('uniwind'"` da 0;
  - `grep -c "useUniwind"` da 0;
  - `grep -c "mockTheme"` pasa de 6 a 5. Se quedan la declaración, el mock de
    `../../theme/use-theme-colors`, el reinicio a `'light'` del `beforeEach`
    y los dos usos de `R9: el selector sigue el tema de la app`;
  - el fichero de la gráfica sigue en 41/41.

  No tiene test propio: es borrar andamiaje. La evidencia de que estaba muerto
  es la sonda del `throw` de §Premisas.

- **R5**: THE SYSTEM SHALL cerrar con:

  1. **El delta declarado**: +0 suites y +5 tests. La gráfica pasa de 36 a 41 y
     la suite, de 83 / 1532 / 1 a 83 / 1537 / 1, medida sin pipe. El delta es
     el mismo con A y con B.
  2. **Ninguna cifra de candado se mueve**, con los `grep` de [[tasks]] §R5:
     - `style={CONTINUOUS_CORNER}` sigue en 1 en `weekly-activity-chart.tsx`
       (`#62 R14`);
     - `style={TABULAR_NUMS}` sigue en 4 (`#62 R15`);
     - `#68 R18` (sin `text-[10px]`, hex ni `StyleSheet` en los dos ficheros);
     - `#87 R19`, con `weekly-activity-chart.test.tsx` como única huella de
       `use-api`;
     - el catálogo de `src/i18n/catalog.ts` y su candado de longitud en
       `src/providers/__tests__/language-provider.test.tsx`, sin tocar;
     - `src/__tests__/ui-copy-table.ts`, sin tocar.
  3. `bunx tsc --noEmit` con `exit=0` tras `test ! -e .expo/types/router.d.ts`,
     y `bunx eslint` de los dos ficheros con `exit=0`.
  4. **Ninguna dependencia nueva**: `package.json` y `bun.lock` sin tocar.
  5. `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista solo los
     dos ficheros de la gráfica, con los blobs finales de [[tasks]] §R5.
  6. La tabla de sondas de [[tasks]] §Sondas, re-medida sobre el árbol final,
     en `progress/impl_mobile-metric-selector-a11y.md`.

- **R6**: WHEN el humano recorre el selector con TalkBack en un dev build de
  Android con el JS de esta branch, THE SYSTEM SHALL anunciar **tres paradas
  separadas**, una por opción. Cada una SHALL decir su etiqueta y su rol de
  botón de opción, y la seleccionada SHALL decir que lo está. Ninguna parada
  SHALL leer las tres etiquetas juntas, y la tarjeta entera no SHALL ser una
  parada. Si se anuncia «Grupo de botones de opción» o «1 de 3», el humano lo
  anota literalmente, pero **no es condición de paso** (§Premisas). Es un gate
  humano, no delegable a IA, con su casilla propia en §Prueba de humo del
  humano.

## Tabla de sondas, resumen

Las sondas, con el blob exacto de cada mutación y el `it` que falla, están en
[[tasks]] §Sondas. Por clase, sobre el árbol final. La columna «hoy» es la
misma mutación sobre la base `912d11dc`: «verde» es la gráfica en 36/36, y
`collapse` y `nomfs` se midieron además en toda la suite (83 / 1532 / 1,
`exit=0`).

| Clase | Sondas | Hoy (base) | Tras #74 |
|---|---|---|---|
| Colapso del grupo | `collapse` (`accessible` + `accessibilityLabel`), `accessible` solo, `arialabel` | verde | **rojo**: solo `el contenedor solo lleva…` |
| Rol perdido o cambiado | `noRole`, `rolealias` (`role=` en vez de `accessibilityRole=`) | no aplica: la base no tiene rol | **rojo**: R1 y `el contenedor solo lleva…` |
| Subárbol oculto | `hide` (`importantForAccessibility="no-hide-descendants"`) | rojo, 6 de #68 | **rojo**: 10, los mismos 6 de #68 más 4 de #74 |
| Tarjeta que se vuelve un nodo | `cardacc` (`accessible`), `cardpress` (`onPress`) | verde | **rojo**: solo `la tarjeta que lo envuelve…` |
| Suelo o tope de fuente | `nomfs`, `mfs05` (0.5), `nomaxm` | verde | **rojo**: las dos filas de R3 |
| Rama de plataforma | A: `branch` (plantar la rama de B). B: `nobranch`, `inverted` | no aplica | **rojo**: la fila `android` (y con `inverted`, también `ios` y `#68 R6`) |

## Qué firma el humano al aprobar esta spec

1. **La pregunta de R3: ¿A o B?** La consecuencia para el usuario es distinta,
   así que decide el humano. **Recomendación: A.**

   | | **A — conservar el encogimiento y documentar el suelo** | **B — no encoger en Android** |
   |---|---|---|
   | Qué ve el usuario en Android con la pantalla más estrecha y la fuente al máximo | la etiqueta **siempre entera**, pero puede encoger por debajo de los 10.2 px de iOS, hasta 4 dp en el extremo. Cada etiqueta encoge por su cuenta, así que pueden quedar de tamaños distintos | las tres **del mismo tamaño** (12 px por 1.2 como mucho), y la que no cabe se corta con «…». TalkBack sigue leyendo la etiqueta entera, porque sale de `accessibilityLabel` |
   | iOS | igual que hoy | igual que hoy |
   | Código | un comentario de dos líneas | un import de `Platform`, una rama y el comentario |
   | Frente a #68 | conserva su decisión de producto: «una línea, sin elipsis» | la revierte en Android |
   | Frente a la carta | no la contradice: la carta no fija un mínimo (§Premisas) | tampoco |

   La recomendación es A porque el caso extremo necesita a la vez el ancho más
   estrecho y la fuente al máximo, que ya está topada en 1.2. En ese caso, una
   etiqueta entera y pequeña se entiende mejor que «Minutos ac…». Si en el gate
   R6 el humano ve una etiqueta ilegible, es la señal para pasar a B (§Fuera de
   alcance).

   **El humano escribe la opción en la casilla de §Aprobación.** Sin ella, no
   hay handoff.

2. **El criterio 1 se redefine.** «TalkBack anuncia el conjunto» no lo
   garantiza RN 0.86.2 (§Premisas): el rol `radiogroup` pone una descripción de
   rol, pero no la posición «1 de 3». R1 fija el rol en el código, y R6 anota
   literalmente qué se oye, sin hacerlo condición de paso. Añadir la posición a
   las etiquetas necesita claves de copy nuevas y movería el candado de
   longitud del catálogo, que el criterio 5 prohíbe. Queda como **(F)**.
3. **Una lista cerrada de props, y no el patrón de `#68 R9`.** El criterio 2
   pide copiar ese patrón, pero `accessibilityLabel` `toBeUndefined()` deja
   pasar `accessible` solo y `aria-label` (medido, §Premisas). La lista cerrada
   los para, y también `importantForAccessibility`. Su coste: cualquier prop
   nueva y legítima en el contenedor obliga a tocar el candado a sabiendas.
4. **La tarjeta entra en el candado.** El criterio 2 solo habla del
   contenedor, pero un `onPress` en la `Card` la vuelve un `Pressable` con rol
   `button` que funde todo el gráfico en un solo nodo. Hoy la suite no lo ve
   (sondas `cardacc` y `cardpress` sobre la base: la gráfica da 36/36).
5. **Las mutaciones versionadas**: `P2red` en el rojo de R2 y, con A,
   `P3redA` en el rojo de R3. Cada una toca un solo fichero de producción,
   `weekly-activity-chart.tsx`, y el verde la revierte con
   `git checkout HEAD~1 --`. R1, y R3 con B, son rojos naturales.
6. **El delta es +0 suites y +5 tests**: 83 / 1532 / 1 antes, 83 / 1537 / 1
   después, sobre esta base, con cualquiera de las dos opciones. Ninguna cifra
   de candado se mueve (R5.2).
7. **Requisitos sin test propio**: el comentario de R3, R4 y R5. El comentario
   se verifica con un `grep`, R4 es borrar andamiaje y R5 es una propiedad del
   diff. Los cierra el `reviewer` por inspección, y queda declarado aquí antes
   del handoff, como pide C4. R6 es del humano.
8. **La opción B usa `Platform.OS` y no `process.env.EXPO_OS`**, aunque la
   skill de Expo prefiere lo segundo. `babel-preset-expo` sustituye
   `process.env.EXPO_OS` por una constante al transformar, así que un test no
   puede cambiarlo fila a fila. `Platform.OS` sí se puede, y es el precedente
   de #123 en `src/utils/date-picker-value.ts` ([[design]] §R3).
9. **El gate R6** es una casilla propia en §Prueba de humo del humano, aparte
   de la de §Aprobación. La feature no cierra sin las dos.

## Prueba de humo del humano (no delegable a IA) — R6

**Entorno:**

- **Dev build de Android**, nunca Expo Go. No hace falta regenerarlo, porque la
  feature no tiene cambios nativos: basta el JS de esta branch desde Metro
  (`bunx expo start --dev-client`, desde `mobile-pet-tracker/`).
- Una sesión con una mascota que tenga **al menos un día medido en los últimos
  7 días**. Sin eso, la tarjeta «Actividad semanal» muestra «Aún no hay
  actividad registrada» y no hay selector: **parar y avisar**.
- `adb` conectado. Con dos transportes Wi-Fi, usar siempre
  `adb -s <ip:puerto>` (en Windows, `adb devices -l` y filtrar con `findstr`).
- TalkBack se activa en **Ajustes → Accesibilidad → TalkBack**. No usar
  `adb shell settings`: ColorOS puede denegarlo. Opcional, pero ayuda a anotar
  literalmente: en los ajustes de TalkBack, **Configuración avanzada → Opciones
  de desarrollador → Mostrar salida de voz**, que pinta en pantalla lo que dice.

**Pasos:**

1. Con TalkBack apagado, abrir la app en la **Home** y desplazarse hasta la
   tarjeta **«Actividad semanal»**. Ver las tres opciones: «Minutos activos»,
   «Distancia» y «Paseos», con la primera seleccionada.
2. Activar TalkBack. Tocar una vez **«Minutos activos»**. Anotar literalmente
   lo que dice. Se espera la etiqueta, el rol de botón de opción y que está
   seleccionada. Si antes dice «Grupo de botones de opción» o «1 de 3»,
   anotarlo también.
3. Deslizar **a la derecha** una vez: la parada es **«Distancia»**, sola, con
   su rol y sin decir que está seleccionada. Otra vez: **«Paseos»**, igual.
   **Ninguna parada lee las tres etiquetas juntas**, y ninguna lee la tarjeta
   entera.
4. Con el foco en «Distancia», **tocar dos veces**. La gráfica cambia a
   distancia. Deslizar a la izquierda hasta «Minutos activos» y volver: ahora
   la seleccionada es «Distancia» y «Minutos activos» ya no lo dice.
5. Deslizar a la izquierda desde «Minutos activos»: la parada anterior es un
   texto de la cabecera de la tarjeta (el promedio o «últimos 7 días»), no un
   nodo que lea el selector entero.
6. Apagar TalkBack. En **Ajustes → Pantalla**, poner el **tamaño de fuente** y
   el **tamaño de visualización** al máximo. Volver a la Home. Mirar las tres
   etiquetas:
   - **con A**: las tres enteras, en una línea. Anotar si alguna se ve
     claramente más pequeña que las otras o ilegible;
   - **con B**: las tres del mismo tamaño. Anotar cuáles acaban en «…».

   Captura:
   `adb -s <ip:puerto> shell screencap -p /sdcard/s74.png` y
   `adb -s <ip:puerto> pull /sdcard/s74.png`. Devolver el tamaño de fuente y
   de visualización a su valor.

**Criterio de paso**: los pasos 2 a 5 se cumplen tal como están escritos. Lo que
se oiga del grupo o de la posición, y lo que se vea en el paso 6, se anota, pero
no bloquea: si el paso 6 da una etiqueta ilegible con A, se abre la (F) de
§Fuera de alcance.

- [ ] Prueba de humo de R6 superada por el humano (fecha: ____, dispositivo: ____, Android: ____, opción de R3: ____)
  - Paso 2, dicho literalmente: ____
  - ¿Se oyó «Grupo de botones de opción»? ____ ¿Y «1 de 3»? ____
  - Paso 6: ____

---

## Cobertura de los criterios de aceptación de `feature_list.json` #74

| Criterio | Cubierto por |
|---|---|
| 1. El contenedor declara `radiogroup` y TalkBack anuncia el conjunto | R1 (el rol, con candado); R6 pasos 2 y 3 (tres paradas separadas, con lo que se oiga del grupo anotado). Redefinido en §Qué firma el humano, punto 2 |
| 2. Candado que falla si el contenedor recibe `accessible` o `accessibilityLabel` | R2, con lista cerrada en vez del patrón de `#68 R9` (punto 3), más la tarjeta (punto 4). Sondas `collapse`, `accessible`, `arialabel`, `cardacc` y `cardpress` |
| 3. El suelo de fuente en Android, resuelto por una vía que actúa o documentado | R3: con A, documentado en el código y fijado en las dos plataformas; con B, resuelto sin encogimiento en Android. Sondas `nomfs`, `mfs05`, `nomaxm` y la rama |
| 4. El `jest.mock('uniwind')` muerto, borrado | R4, con la sonda del `throw` como evidencia |
| 5. Suite verde; ninguna cifra de candado se mueve | R5: +5 tests declarados y los `grep` de los candados |
| 6. Gate humano de TalkBack en dev build de Android | R6, con su casilla |

---

## Fuera de alcance

Cada viñeta está clasificada: **(D)** delimitación de esta feature,
**(F)** hallazgo candidato a registrarse como otra feature (sin id: lo asigna
el `leader` contra `origin/main`) y **(N)** premisa verificada y descartada.

- **(D)** No se tocan `src/screens/home/index.tsx` ni `index.test.tsx`: la
  sesión Backend trabaja #77 ahí. Ningún requisito lo necesita.
- **(D)** No se toca `src/components/card.tsx`. R2 vigila la instancia de la
  gráfica, no el componente.
- **(D)** No se vuelven a candar las decisiones propias de cada opción
  (etiqueta, estado, `h-11`, `flexGrow`, `numberOfLines`). Ya las cierra
  `#68 R6 › ofrece tres opciones accesibles y mantiene cada etiqueta en una línea`.
- **(D)** No se añade ninguna clave de copy: no se tocan `src/i18n/catalog.ts`,
  `src/providers/__tests__/language-provider.test.tsx` ni
  `src/__tests__/ui-copy-table.ts`.
- **(D)** No se instala ninguna dependencia. `Platform`, con B, ya es de
  `react-native`.
- **(D)** Sin gate de VoiceOver: no hay iPhone en el circuito. La fila `ios` de
  R3 corre en jest, que ya usa `Platform.OS = 'ios'`.
- **(F)** *La posición «1 de 3».* RN 0.86.2 no la produce para un `View`. Se
  podría añadir a cada `accessibilityLabel` con claves de copy nuevas, lo que
  mueve el candado del catálogo. Candidata si el gate R6 muestra que se echa
  en falta.
- **(F)** *`#68 R9` sobre la fila de las siete columnas deja pasar
  `accessible`.* Medido: con `accessible` en `weekly-activity-day-row`, la
  gráfica da 36/36 (blob `4ed672f12e64205efb0cb3c78157fcdd574db1c0`). La misma
  lista cerrada de R2 lo cerraría.
- **(F)** *`selected` frente a `checked` en los radios.* TalkBack puede leer el
  estado de un botón de opción como «marcado» o «no marcado», que sale de
  `checked`, y no de `selected`. Candidata solo si el paso 2 del gate da un
  estado incorrecto o ninguno.
- **(F)** *Pasar de A a B.* Solo si el paso 6 del gate, con A, da una etiqueta
  ilegible.
- **(N)** *Los dos `describe` que se titulan «R9» en la gráfica*
  (`grep -n "^describe('R9" src/screens/home/weekly-activity-chart.test.tsx`
  da 2: «el selector sigue el tema» y «cada columna se anuncia por separado»).
  El primero hereda un R-id ajeno (§3 del veredicto de #68), pero renombrarlo
  no es de esta feature, y ninguna spec lo cita por título.
- **(N)** *Un prop `minimumFontSize` en `<Text>` como suelo real.* El C++ lo
  parsea, pero no está en los `validAttributes` de `TextNativeComponent.js`, así
  que el JS no lo envía, y tampoco está tipado ([[design]] §Alternativas).

## Aprobación

- [x] **Aprobado por humano** (fecha: 2026-09-28, opción de R3: A) ← gate
      obligatorio antes de implementar. Al marcar esta casilla, el humano
      firma también los nueve puntos de §Qué firma el humano al aprobar esta
      spec.

> **Esta feature tiene dos casillas.** Esta, antes del handoff, y la de R6 en
> §Prueba de humo del humano, después del veredicto del `reviewer`. La feature
> no se marca `done` sin las dos.
