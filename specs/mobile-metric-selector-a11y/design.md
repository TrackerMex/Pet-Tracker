---
feature: "mobile-metric-selector-a11y"
status: spec_ready         # draft | spec_ready | approved
tags: [spec, mobile, a11y, deuda]
---

# Diseño — [[mobile-metric-selector-a11y]] (#74)

> Decisiones de alto nivel. Los literales exactos, los blobs y los comandos
> están en [[tasks]]. Las premisas, verificadas con su comando, están en
> [[requirements]] §Premisas.

## Qué hace hoy el selector en TalkBack

Cada una de las tres opciones es un `Pressable` con `accessible`, su etiqueta y
el rol `radio`. TalkBack ya las recorre como tres paradas. Lo que falta es el
contexto: el contenedor es un `View` sin rol, así que nada dice que las tres
forman un grupo. El riesgo que señaló el veredicto de #68 es el contrario: que
alguien añada `accessible` o `accessibilityLabel` al contenedor para que «se
anuncie el grupo». Eso **funde** las tres opciones en un solo nodo, y hoy la
suite no lo ve (sonda `collapse`, verde en toda la suite).

## Decisiones

### R1: `radiogroup` en el contenedor, sin hacerlo `accessible`

`accessibilityRole="radiogroup"` es un rol tipado en RN 0.86.2
(`grep -n "radiogroup" node_modules/react-native/Libraries/Components/View/ViewAccessibility.d.ts`).
En Android pone la descripción de rol «Grupo de botones de opción» en el nodo
del contenedor, sin convertirlo en una parada que se trague a los hijos. No da
la posición «1 de 3», porque esta sale de `CollectionInfo` y solo la escribe el
`ScrollView` ([[requirements]] §Premisas).

La prop se inserta justo después de `testID="weekly-activity-metric"`, que es
único en el fichero. El test lee `props.accessibilityRole` del host, porque
`getByRole('radiogroup')` de RNTL no encuentra un `View` que no es
`accessible`. Precisamente por eso el test no puede buscar por rol.

### R2: una lista cerrada de props, no el patrón de `#68 R9`

El criterio 2 pide copiar el patrón de `#68 R9 › anuncia los huecos sin colapsar
las siete columnas`, que asevera `accessibilityLabel` `toBeUndefined()` en la
fila. Medido sobre el árbol de hoy, ese patrón deja pasar:

- `accessible` solo, sin etiqueta: con él en `weekly-activity-day-row`, la
  gráfica da 36/36 (blob `4ed672f12e64205efb0cb3c78157fcdd574db1c0`). Un nodo
  `accessible` sin etiqueta también funde a sus hijos en TalkBack;
- `aria-label`: llega al host con esa clave y no como `accessibilityLabel`
  (sonda `arialabel`, donde el `toEqual` enseña la clave `aria-label`);
- `importantForAccessibility="no-hide-descendants"`, que esconde las tres
  opciones. Esta sí la ven hoy seis tests de #68 (sonda `hide`).

La lista cerrada `Object.keys(props).sort()` contra un literal del test los
cierra todos, y cualquier prop futura. El literal es del test: no se importa
nada de producción, así que el candado no puede volverse tautológico.

Su coste es que una prop nueva y legítima en el contenedor obliga a actualizar
el literal. Es un coste querido: quien toque ese nodo tiene que pensar en
TalkBack.

**La tarjeta entra también.** `Card` sin `onPress` pinta un `View` con
`{...rest}`. Con `onPress` pinta un `Pressable` con `accessibilityRole="button"`,
que funde toda la gráfica, selector incluido, en un nodo. Las sondas `cardacc`
y `cardpress` son verdes hoy. Las claves de la tarjeta en el host son
`['children', 'className', 'style', 'testID']`: `style` lo pone la propia `Card`
(`StyleSheet.flatten([CONTINUOUS_CORNER, style])` en `src/components/card.tsx`),
no la gráfica.

**Sin test sobre las opciones.** Lo que cada `Pressable` declara ya lo cierra
`#68 R6 › ofrece tres opciones accesibles y mantiene cada etiqueta en una línea`.
Repetirlo sería un candado duplicado.

**El rojo es de vía b.** Sobre el árbol con R1, las dos listas ya se cumplen,
así que no hay rojo natural. El commit rojo versiona la mutación `P2red`, que
añade `accessible` y `accessibilityLabel="Metrica"` al contenedor y
`accessible` a la tarjeta, y el verde la revierte con
`git checkout HEAD~1 -- <tsx>`. `"Metrica"` va sin tilde y en un solo commit
rojo: nunca llega al árbol final.

### R3: el suelo de fuente en Android

**El hecho**: `minimumFontScale` es una prop de iOS. En Android, el encogimiento
de `adjustsFontSizeToFit` sí actúa, pero su suelo sale de `minimumFontSize`, que
`<Text>` no expone. Sin él, el suelo es 4 dp. El 0.85 de #68 solo actúa en iOS,
donde el suelo es 12 × 0.85 = 10.2 px.

**Por qué el test tiene dos filas, `android` e `ios`.** Jest corre con
`Platform.OS === 'ios'`. Una fila `android` que fija `Platform.OS` con
`Object.defineProperty` y lo restaura en `afterEach` es el precedente de #123
(`src/utils/date-picker-value.test.ts`). En A, las dos filas esperan lo mismo, y
la fila `android` sirve para dejar escrito que el valor también se envía en
Android, aunque no actúe allí. En B, las dos filas difieren, y la fila `android`
es la que prueba la rama.

**Por qué el test fija también `minimumFontScale` y `maxFontSizeMultiplier`.**
Son las dos decisiones que acompañan al ajuste, y quitarlas pasa hoy en toda
la suite (sonda `nomfs`: 83 / 1532 / 1 verde; `nomaxm`: la gráfica en verde).
Los literales 0.85 y 1.2 son del test; no se importan las constantes de
producción, que además no se exportan.

**A (recomendada): conservar el encogimiento y documentar el suelo.** Un
comentario en inglés de dos líneas sobre `METRIC_LABEL_MIN_FONT_SCALE` dice que
Android ignora la prop y que allí el suelo es 4 dp. No hay cambio de
comportamiento. El rojo es de vía b: la mutación `P3redA` quita la línea
`minimumFontScale={METRIC_LABEL_MIN_FONT_SCALE}`, y así es una prop que el test
nuevo vigila y que hoy nadie vigila.

**B: no encoger en Android.** `adjustsFontSizeToFit={Platform.OS !== 'android'}`.
En Android, `numberOfLines={1}` recorta con «…» lo que no cabe, y las tres
etiquetas quedan del mismo tamaño. El rojo es natural: la fila `android` espera
`false`.

**`Platform.OS` y no `process.env.EXPO_OS`.** La skill de Expo prefiere lo
segundo. Pero `babel-preset-expo` sustituye `process.env.EXPO_OS` por un literal
al transformar el fichero, así que el test no puede cambiarlo fila a fila y la
fila `android` no podría existir. `Platform.OS` se lee en tiempo de ejecución, y
el repo ya lo usa así en `src/utils/date-picker-value.ts` (#123). Solo aplica a
B: A no añade ninguna rama.

El comentario no tiene test. Candarlo sería asertar sobre un comentario, algo
que un `grep` del `reviewer` hace mejor ([[tasks]] §R3). Su texto no lleva `#`
seguido de tres o más caracteres hex, ni la palabra `StyleSheet` en ningún
caso (§Los guards).

### R4: el `jest.mock('uniwind')` muerto

La gráfica no importa `uniwind`: el tema le llega por `useThemeColors`, que el
test ya mockea aparte con `mockTheme`. Las dos sondas de [[requirements]]
§Premisas (quitarlo, y cambiarlo por un `throw`) dejan la gráfica en 36/36. Se
borra el bloque de cuatro líneas y la línea en blanco que lo sigue. `mockTheme`
se queda, porque lo usan el otro mock y `R9: el selector sigue el tema de la
app`.

Va en su propio commit `test(mobile): …`, después de R3, para que ningún rojo de
R1–R3 dependa de él.

### Orden

R1, R2, R3 y R4, en ese orden y cada uno en sus commits. R2 necesita R1, porque
su literal incluye `accessibilityRole`. R3 no depende de R2, pero va detrás para
que cada rojo sea el único de la suite. El delta de tests es +1, +2, +2 y +0.

## Los guards

- `#68 R18: la actividad semanal no mete drift de estilo` lee los **dos**
  ficheros de la gráfica con `FEATURE_STYLE_ESCAPES`
  (`grep -n "FEATURE_STYLE_ESCAPES = new RegExp" -A3 src/__tests__/design-drift.test.ts`),
  que es `text-\[10px\]|<HEX_LITERAL>|StyleSheet` con la bandera `i`.
  `HEX_LITERAL` es `#(?!\d{2,3} R\d)[\da-f]{3,8}\b`. Así que en los dos ficheros,
  comentarios incluidos:
  - `#74 R1`, `#74 R3` y `#68 R6` son seguros, porque llevan dígitos, un espacio
    y `R<n>`;
  - `#123`, `#120` o `#add` no lo son, y `stylesheet` tampoco, en ningún caso;
  - el literal `text-[10px]` tampoco.
- `#87 R19: use-api no deja huella` espera que `weekly-activity-chart.test.tsx`
  sea la única huella de `use-api`. Su línea
  `not.toContain('use-api')` se queda como está, y los bloques nuevos no
  escriben `use-api` ni `useApi`.
- `#62 R14` y `#62 R15` cuentan `style={CONTINUOUS_CORNER}` (1) y
  `style={TABULAR_NUMS}` (4) en `weekly-activity-chart.tsx`
  (`grep -n "weekly-activity-chart.tsx'), [0-9]" src/__tests__/consistency-classnames.test.ts`).
  Ninguna de las dos opciones las toca.
- `#65 R3` cuenta los usos de `t('…')` por fichero (`R3_HOME` en
  `src/__tests__/ui-language.test.ts`) y `src/__tests__/ui-copy-table.ts` lista
  las claves de la gráfica. No se añade ni se quita ninguna llamada a `t`.
- El candado de longitud del catálogo
  (`src/providers/__tests__/language-provider.test.tsx`) no se mueve, porque no
  hay claves nuevas.

## Coordinación

- **La sesión Backend trabaja #77** (`feature/77-mobile-home-weight-without-collar`)
  en `src/screens/home/index.tsx` e `index.test.tsx`.
  `git diff --name-only origin/main...origin/feature/77-mobile-home-weight-without-collar`
  no incluye ningún fichero de esta feature. `home/index.tsx` importa la
  gráfica, pero ningún test de `home/index.test.tsx` lee las props que esta
  feature cambia: la suite completa sale verde con los dos borradores finales.
- **Los dos puntos de choque son de harness**: `feature_list.json` y
  `progress/current.md`, que #77 también cambia. Quien mergee segundo resuelve
  el conflicto a mano, entrada por entrada. No hay choque en código.
- Las mutaciones versionadas (`P2red` y, con A, `P3redA`) tocan solo
  `weekly-activity-chart.tsx` y se revierten en el commit siguiente.

## Archivos afectados, por capa

Solo capa de presentación. No hay dominio, aplicación ni infraestructura, ni
cambios nativos: el dev build instalado sirve para el gate R6.

| Fichero | Cambio |
|---|---|
| `mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx` | R1: `accessibilityRole="radiogroup"` en el contenedor. R3: el comentario de dos líneas y, solo con B, `Platform` en el import y la rama en `adjustsFontSizeToFit`. En los commits rojos, además, las mutaciones versionadas, que el verde revierte |
| `mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx` | Cuatro `describe` nuevos al final (R1, R2 y R3, con 1 + 2 + 2 tests), `import { Platform } from 'react-native';` (R3) y el `jest.mock('uniwind')` fuera (R4) |
| `progress/impl_mobile-metric-selector-a11y.md` | El informe de Codex, con la tabla de sondas re-medida (R5) |
| `specs/mobile-metric-selector-a11y/traceability.md` | Los hashes, en un solo commit final de docs |

## Alternativas descartadas

- **Pasar `minimumFontSize` a `<Text>`.** El C++ lo parsea
  (`grep -rln "minimumFontSize" node_modules/react-native/ReactCommon/react/renderer/components/text`),
  pero no está en los `validAttributes` de `TextNativeComponent.js`, así que el
  JS no lo envía al nativo. Tampoco está en los tipos. Sería una prop sin efecto
  y sin tipo: el mismo problema que se quiere cerrar.
- **Acortar las etiquetas.** Cambia claves del catálogo y mueve su candado de
  longitud y `ui-copy-table.ts`, que el criterio 5 prohíbe. Y es una decisión de
  copy, no de accesibilidad.
- **Bajar `maxFontSizeMultiplier` para que no haga falta encoger.** Penaliza a
  quien sube el tamaño de fuente del sistema, que es justo el usuario de esta
  feature.
- **Medir con `onTextLayout` y reducir la fuente a mano.** Es mucho código de
  estado y de layout para un caso extremo, y duplica lo que ya hace
  `adjustsFontSizeToFit`.
- **Un `fontSize` explícito con `flexShrink`.** `flexShrink` no encoge el texto,
  solo la caja, así que no da ningún suelo.
- **Añadir «1 de 3» a cada `accessibilityLabel`.** Necesita claves de copy
  nuevas por posición o una plantilla, lo que mueve el catálogo. Queda como (F)
  en [[requirements]] §Fuera de alcance, pendiente de lo que muestre el gate R6.
- **Envolver el selector en un `ScrollView` horizontal para heredar
  `CollectionInfo`.** Cambia el layout, que es de #68, y mete un scroll en un
  control que no debe desplazarse.
- **Copiar el patrón de `#68 R9` tal cual.** Descartado en §R2 por los tres
  huecos medidos.
- **Endurecer también `#68 R9` sobre la fila de columnas.** Es el mismo hueco,
  pero en otro nodo y otro requisito. Queda como (F), para no ensanchar el
  alcance.
