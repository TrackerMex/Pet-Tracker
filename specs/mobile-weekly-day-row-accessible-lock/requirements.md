---
feature: "mobile-weekly-day-row-accessible-lock"
status: spec_ready       # draft | spec_ready | approved
tags: [spec, mobile, a11y, deuda]
---

# Requisitos — [[mobile-weekly-day-row-accessible-lock]] (#130)

> Notación EARS. Cada requisito lleva su id `R<n>`, inmutable una vez aprobado.
> Ver [[design]] para las decisiones y las alternativas descartadas, [[tasks]]
> para el orden TDD, los literales, los blobs y las sondas, y [[traceability]]
> para el cierre.
>
> Origen: el hallazgo **(F)** de `specs/mobile-metric-selector-a11y/requirements.md`
> §Fuera de alcance, «`#68 R9` sobre la fila de las siete columnas deja pasar
> `accessible`», registrado como #130 al cerrar #74.
>
> **Base medida: `7f35ab6c`**, que es `origin/main` (`3cf09ca5`, merge de la
> PR #170 de #74) más `progress/current.md`. **Los números de línea no son
> anclas**, ni los de esta spec ni los de la entrada de `feature_list.json`:
> todo se localiza con los `grep` que se citan, y las cuentas se vuelven a medir
> al arrancar ([[tasks]] §Antes de tocar nada).

## Contexto mínimo para implementar sin más contexto

La feature toca **un fichero**, `mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`
(«el test», 41 tests hoy). El fichero de producción
`mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx` («la gráfica»)
**solo se toca en los dos commits rojos**, para versionar una mutación que el
commit verde siguiente revierte. El diff acumulado de la gráfica contra
`origin/main` es **vacío**.

Lo que pinta la gráfica, en host (lo que ven las consultas de RNTL v14), con al
menos un día medido:

```
View testID="weekly-activity-card"          (el Card compartido, sin onPress)
├─ View testID="weekly-activity-header"
├─ View testID="weekly-activity-metric"      (el selector, #74)
├─ View testID="weekly-activity-chart-layout" (el gráfico, con onLayout)
└─ View testID="weekly-activity-day-row"     (la fila: className="flex-row", style con paddingLeft y paddingRight)
   ├─ View testID="weekly-activity-day-<fecha>"   (Pressable: accessible, role button, label propio)
   └─ ... siete en total, una por día, en orden de fecha
```

El `<>` que envuelve selector, gráfico y fila no crea nodo host: **la fila
cuelga directamente de la tarjeta**, y `weekly-activity-chart-layout` es su
hermana, no su ancestro. En el test, `renderChart(days, weekComparison?, language?)`
pinta el componente real, y `makeWeek(from, minutes)` construye la semana. El
último `describe` del test es
`describe('#74 R3: el ajuste y el suelo de las etiquetas del selector, por plataforma'`.

Por qué importa: en Android, un `View` con `accessible` (o un `Pressable`, que
lo es por defecto) se vuelve **un solo nodo de TalkBack con todo su subárbol
dentro**. Si eso le pasa a la fila, o a un nodo nuevo entre la tarjeta y las
columnas, las siete columnas dejan de ser siete paradas y se leen de golpe.

## Premisas de la entrada, verificadas contra el árbol

Todas las medidas son de la gráfica con el comando canónico de [[tasks]]
§Antes de tocar nada, salvo donde dice «suite».

| Premisa (`feature_list.json` #130 y el encargo del `leader`) | Veredicto | Evidencia |
|---|---|---|
| La única aserción sobre la fila es la de `#68 R9 › anuncia los huecos sin colapsar las siete columnas`, que solo mira `accessibilityLabel` `toBeUndefined()` | **cierta** | `grep -c "weekly-activity-day-row" src/screens/home/weekly-activity-chart.test.tsx` da 1, y es esa línea |
| Con `accessible` en la fila, la gráfica sigue verde | **cierta, re-medida**; caducan la cifra y el blob de la entrada | hoy la gráfica da **41/41** con el blob `7e1055207b4c675fc00bc60081ec83a08e75de8a` (sonda `accessible`). El 36/36 y el blob `4ed672f1` de la entrada eran de la base de #74, que tenía 5 tests menos |
| Con `aria-label`, `importantForAccessibility` o un `Pressable` en la fila, también verde | **cierta en parte** | verdes (41/41): `aria-label`, `importantForAccessibility="no"`, `accessibilityRole="button"`, `role="button"` y la fila cambiada por un `Pressable` con `onPress`. **No** es hueco `importantForAccessibility="no-hide-descendants"`: hoy ya da 9 rojos de #68, 7 por consulta y 2 por aserción ([[tasks]] §Sondas, `hide`) |
| Con `accessibilityLabel` en la fila, verde | **falsa** | ya es rojo hoy: 1, `#68 R9 › anuncia los huecos…`, por `toBeUndefined` (sonda `label`). Es la parte del criterio 1 que la base ya cumple |
| La cadena de ancestros entre la tarjeta y la fila | **vacía, medida** | con una prueba de medida en el worktree de sondas, `getByTestId('weekly-activity-day-row').parent` es el `View` de `weekly-activity-card`, y los hijos host de la tarjeta son `header`, `metric`, `chart-layout` y `day-row`, en ese orden (con `makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70])` y sin comparación) |
| Las claves de props del host de la fila | **medidas** | `['children', 'className', 'style', 'testID']`, ordenadas. Las mismas que la tarjeta en `#74 R2` |
| Un nodo nuevo entre la tarjeta y las columnas, o un hijo más en la fila, pasa hoy | **cierta** | verdes (41/41): un `<View accessible>` alrededor de la fila (sonda `wrapout`), uno alrededor de las siete columnas dentro de la fila (`wrapin`) y un `<Text>` suelto antes de las columnas (`extra`). Ninguna lista de props lo ve, porque las claves de la fila y de la tarjeta no cambian. `R13` cuenta columnas por `testID` en todo el árbol, no por `children` |
| La tarjeta ya está candada | **cierta, re-medida** | `#74 R2 › la tarjeta que lo envuelve tampoco se vuelve un nodo accesible`: las sondas `cardacc` (`8fc10f1c`) y `cardpress` (`2a460368`) dan rojo 1, por `toEqual`. Son los mismos blobs que midió #74, porque la base es su árbol final |
| Las siete columnas ya están candadas por `#68 R9` | **cierta en lo accesible, medida** | `accessible={false}` en la columna (`colnoacc`) y la columna sin `accessibilityRole="button"` (`colnorole`) dan rojo 1 cada una: `#68 R9 › anuncia el día medido en español e inglés con un botón de 44 pt`, por `toBe`. Sin `accessibilityState` (`colnostate`), rojo 1: `#68 R8 › abre tooltip y panel…`, por `toEqual`. La etiqueta y `min-h-11` los asevera el mismo `it` de R9 |
| La forma y la alineación de la fila tienen candado | **falsa** | verdes (41/41, y 43/43 tras esta feature): `className="flex-col"` en vez de `flex-row` (`flexcol`, `99ec492b`) y `paddingLeft: 0` (`nopad`, `9cb81179`). No es de accesibilidad: queda como **(F)** en §Fuera de alcance |
| El `#` en los títulos nuevos no dispara los guards de hex | **cierta con ` R<n>` detrás, medida** | la suite entera con los dos bloques nuevos da `exit=0`. Con un `#130` suelto en el comentario de R1 (blob del test `658a4ee1b7f56e8b0596eb24b24995548bfdd011`), `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts` da `exit=1`, 1 failed de 55: `#68 R18: la actividad semanal no mete drift de estilo › keeps arbitrary text, hex colors, and StyleSheet out of feature sources`. El patrón es `HEX_LITERAL` (`grep -n "const HEX_LITERAL" src/__tests__/design-drift.test.ts`), y #108, que le añadió la excepción ` R<n>`, ya está en `origin/main` |
| `files_affected` es solo el test | **cierta** | ningún requisito necesita otro fichero. La gráfica entra y sale en los rojos |
| La sesión Backend (#100) no toca estos ficheros | **cierta** | su `files_affected` no incluye ninguno de los dos, y su branch `feature/100-mobile-alert-detail-screen` (en `7f626812`) no tiene cambios bajo `mobile-pet-tracker/` contra `origin/main`. Sí toca `src/__tests__/design-drift.test.ts` (con Δ 0 tests) y añade tests en otras suites, así que **si mergea antes, la cifra de la suite cambia** ([[design]] §Coordinación) |
| Suite de base | **medida sin pipe** | la gráfica, 41/41, `exit=0`. La suite, 83 suites / 1550 tests / 1 snapshot, `exit=0`, con 30 bloques `● Console` de ruido. `bunx tsc --noEmit` y `bunx eslint` de los dos ficheros, `exit=0` |
| Blobs de base | **medidos** | la gráfica `c258abedde92d2be981be8507d3d898f13c612cb` y el test `d9687b162d20a2905b20f3c06158c619cb440d7a`. Iguales en `HEAD` y en `origin/main` |
| Entorno | **verificado** | `test ! -e .expo/types/router.d.ts` da `exit=0`. No hay hooks de git (`core.hooksPath` sin valor y ningún hook sin `.sample`) ni prettier en `mobile-pet-tracker/` |

## Requisitos funcionales

- **R1**: WHILE `WeeklyActivityChart` pinte la fila de columnas (al menos un día
  medido), THE SYSTEM SHALL mantener el `View` con
  `testID="weekly-activity-day-row"` **fuera del árbol de accesibilidad como
  nodo propio**. Se comprueba con una lista cerrada de las props del host,
  ordenadas, como `#74 R2`:

  `#130 R1: la fila de las siete columnas no se vuelve un nodo accesible › la fila solo lleva su testID, su clase, su estilo y sus hijos`

  asevera que `Object.keys(getByTestId('weekly-activity-day-row').props).sort()`
  es exactamente `['children', 'className', 'style', 'testID']`, con
  `toEqual` y un literal del test.

  IF la fila recibe `accessible`, `accessibilityLabel`, `aria-label`,
  `importantForAccessibility="no"`, `accessibilityRole`, `role` o cualquier otra
  prop, o se cambia por un `Pressable`, THEN ese `it` SHALL fallar **por
  aserción** (`expect(received).toEqual`). IF la fila recibe
  `importantForAccessibility="no-hide-descendants"` o `aria-hidden`, THEN el
  `it` SHALL fallar **por consulta** (`Unable to find an element with testID:
  weekly-activity-day-row`), junto con los 9 rojos de #68 que ya da la base.

  El rojo es una mutación de producción versionada (C4, vía **b**): `accessible`
  en la fila. Con ella, el `it` de R1 SHALL ser el **único** rojo de la suite
  (medido: 1 failed de 1551).

- **R2**: WHILE `WeeklyActivityChart` pinte la fila de columnas, THE SYSTEM
  SHALL mantener **las siete columnas como hijas host directas de la fila, en
  orden de fecha y sin ningún otro hijo**, y **la fila como hija host directa de
  la tarjeta**, para que ningún nodo nuevo, accesible o no, se interponga entre
  la tarjeta y las columnas:

  `#130 R2: entre la tarjeta y cada columna no hay otro nodo › las siete columnas cuelgan de la fila, y la fila, de la tarjeta`

  asevera, con literales del test:

  1. con `toEqual`, que los `testID` de `row.children` son exactamente
     `weekly-activity-day-2026-09-02` … `weekly-activity-day-2026-09-08`, los
     siete en ese orden. Fija a la vez identidad, orden y cardinalidad por
     `children`, no por recuento de `testID` (`docs/ui-guidelines.md`
     §Enmienda #70, «Estructurales, del contenedor»);
  2. con `toBe`, que `row.parent?.props.testID` es `'weekly-activity-card'`.

  IF se mete un envoltorio entre la fila y las columnas, o un hijo más en la
  fila, THEN el `it` SHALL fallar por `toEqual`. IF se mete un envoltorio entre
  la tarjeta y la fila, THEN SHALL fallar por `toBe`. El rojo es una mutación de
  producción versionada (vía **b**): un `<View accessible>` alrededor de las
  siete columnas. Con ella, el `it` de R2 SHALL ser el **único** rojo de la
  suite (medido: 1 failed de 1552).

- **R3**: THE SYSTEM SHALL cerrar con:

  1. **El delta declarado**: +0 suites y +2 tests. La gráfica pasa de 41 a 43, y
     la suite, de 83 / 1550 / 1 a 83 / 1552 / 1, medida sin pipe. Si la base
     medida al arrancar es otra (por ejemplo, porque #100 mergeó antes), el
     delta exigido sigue siendo +2 tests y +0 suites sobre lo medido.
  2. **Diff de producción vacío**: `git diff --exit-code origin/main...HEAD --
     mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx` da 0, y la
     gráfica acaba en su blob de base.
  3. **Los `it` de `R9: cada columna se anuncia por separado`, verdes**, sin
     tocar (criterio 3 de la entrada), y ningún `describe` de #68 ni de #74
     editado.
  4. **Ninguna cifra de candado se mueve**, con los `grep` de [[tasks]] §R3.
  5. `bunx tsc --noEmit` con `exit=0` tras `test ! -e .expo/types/router.d.ts`,
     y `bunx eslint` de los dos ficheros con `exit=0`.
  6. **Ninguna dependencia nueva** ni copy nueva.
  7. La tabla de sondas de [[tasks]] §Sondas, re-medida sobre el árbol final, en
     `progress/impl_mobile-weekly-day-row-accessible-lock.md`.

  No tiene test propio: es una propiedad del diff y de la suite. Lo cierra el
  `reviewer` por inspección.

## Tabla de sondas, resumen

Las sondas, con el blob exacto de cada mutación y el `it` que falla, están en
[[tasks]] §Sondas. «Hoy» es la mutación sobre la base (el test en 41), y «tras
#130», sobre el árbol final (43). Todas se midieron en la gráfica; las de los
rojos de R1 y R2, además, en toda la suite.

| Clase | Sondas | Hoy (base) | Tras #130 |
|---|---|---|---|
| La fila se vuelve un nodo | `accessible`, `arialabel`, `ifano`, `role`, `rolealias`, `rowpress` | **verde** | **rojo 1**: R1, por `toEqual` |
| La fila se vuelve un nodo con etiqueta | `collapse` (`accessible` + `accessibilityLabel`), `label` | rojo 1: `#68 R9 › anuncia los huecos…`, por `toBeUndefined` | **rojo 2**: ese y R1 |
| La fila oculta su subárbol | `hide` (`no-hide-descendants`), `ariahidden` | rojo 9 de #68: 7 por consulta, 2 por aserción | **rojo 11**: los mismos 9 y R1 y R2, **por consulta** |
| Un nodo entre la tarjeta y las columnas | `wrapout` (alrededor de la fila), `wrapin` (dentro, alrededor de las columnas), `extra` (un hijo más) | **verde** | **rojo 1**: R2, por `toBe` con `wrapout` y por `toEqual` con los otros dos |
| La tarjeta se vuelve un nodo | `cardacc`, `cardpress` | rojo 1: `#74 R2 › la tarjeta…` | igual |
| Una columna pierde su accesibilidad | `colnoacc`, `colnorole`, `colnostate` | rojo 1: `#68 R9` (o `R8` con `colnostate`) | igual |
| Forma y alineación de la fila | `flexcol`, `nopad` | verde | **verde**: hueco declarado, **(F)** |

## Qué firma el humano al aprobar esta spec

1. **El candado cubre dos cosas, no una.** El criterio 1 pide que falle un `it`
   con props de accesibilidad en la fila, y eso es R1. Pero la fila no es el
   único sitio desde donde se funden las columnas: un `<View accessible>` nuevo
   alrededor de la fila o de las columnas hace lo mismo, y hoy la suite no lo ve
   (sondas `wrapout` y `wrapin`, §Premisas). R2 lo cierra fijando la cadena
   tarjeta → fila → siete columnas. Su coste: cualquier envoltorio nuevo y
   legítimo, aunque no sea accesible, obliga a tocar el candado a sabiendas.
2. **Una lista cerrada, y no el patrón de `#68 R9`.** Es el mismo remedio que
   `#74 R2`: `accessibilityLabel` `toBeUndefined()` deja pasar `accessible`,
   `aria-label` y el resto (medido). Cualquier prop nueva en la fila, aunque sea
   legítima, pone R1 en rojo.
3. **`importantForAccessibility` se cierra de dos maneras.** Con `"no"`, R1
   falla por aserción. Con `"no-hide-descendants"` (o `aria-hidden`), R1 y R2
   fallan **por consulta**, porque RNTL ya no encuentra la fila; ese caso lo
   paraban ya 9 tests de #68. Los dos cumplen el criterio 1.
4. **Las mutaciones versionadas**: `accessible` en la fila en el rojo de R1 y un
   `<View accessible>` alrededor de las columnas en el de R2. Cada una toca un
   solo fichero de producción, la gráfica, y el verde la revierte con
   `git checkout HEAD~1 --`. La historia toca la gráfica en cuatro commits,
   pero el diff acumulado es vacío (R3.2), que es lo que pide el criterio 4.
5. **El delta es +0 suites y +2 tests**: 83 / 1550 / 1 antes, 83 / 1552 / 1
   después, sobre esta base. Ninguna cifra de candado se mueve (R3.4).
6. **Sin gate de TalkBack.** La feature no cambia nada que se pinte ni que se
   anuncie: el árbol de producción acaba idéntico al de `origin/main`, así que
   en un dispositivo no hay nada nuevo que oír. El único gate humano es la
   casilla de §Aprobación.
7. **Requisitos sin test propio**: R3, que es una propiedad del diff y de la
   suite. Lo cierra el `reviewer` por inspección, y queda declarado aquí antes
   del handoff, como pide C4.
8. **La forma y la alineación de la fila quedan fuera** como **(F)**: con
   `flex-col` o sin `paddingLeft`, la suite sigue verde. No es de accesibilidad,
   y cerrarlo fijaría como literales del test valores de geometría del gráfico
   (§Fuera de alcance).

## Cobertura de los criterios de aceptación de `feature_list.json` #130

| Criterio | Cubierto por |
|---|---|
| 1. Con `accessible`, `accessibilityLabel`, `aria-label` o `importantForAccessibility` en la fila, un `it` falla | R1: sondas `accessible`, `label`, `collapse`, `arialabel`, `ifano`, `hide` y `ariahidden`. Además R2 para los envoltorios (punto 1) |
| 2. Los esperados son literales del test | R1 y R2: las claves, los siete `testID` y el de la tarjeta se escriben en el test. Ninguno se importa de la gráfica |
| 3. Los `it` de `R9: cada columna se anuncia por separado` siguen verdes | R3.3; los dos bloques nuevos no los tocan, y el árbol final da 43/43 |
| 4. Cero cambio en producción; suite verde medida sin pipe; delta declarado | R3.1 y R3.2, con los rojos por mutación versionada y revertida (punto 4) |

## Fuera de alcance

Cada viñeta está clasificada: **(D)** delimitación de esta feature,
**(F)** hallazgo candidato a registrarse como otra feature (sin id: lo asigna
el `leader` contra `origin/main`) y **(N)** premisa verificada y descartada.

- **(D)** No se vuelven a candar las decisiones de cada columna. La
  accesibilidad (`accessible`, rol `button`, etiqueta, `min-h-11`) ya la cierra
  `#68 R9 › anuncia el día medido en español e inglés con un botón de 44 pt`, y
  el estado `selected`, `#68 R8 › abre tooltip y panel…` (sondas `colnoacc`,
  `colnorole` y `colnostate`, todas rojas hoy). No se inventarían aquí las
  decisiones visuales del contenido de cada columna.
- **(D)** No se toca la tarjeta ni su candado. `#74 R2` ya la cierra (sondas
  `cardacc` y `cardpress`, rojas hoy).
- **(D)** No se miran los ancestros de la tarjeta en la Home
  (`src/screens/home/index.tsx`). La gráfica es la raíz de lo que pinta este
  test, y la Home no es de esta feature.
- **(D)** Los dos bloques nuevos usan un solo escenario, la semana entera
  medida. Las props de la fila no dependen de los datos ni de la selección (son
  literales en la gráfica). La condición de render del bloque la fijan ya los
  `it` de `R13` (en el estado vacío, sin selector y sin columnas).
- **(D)** No se toca ningún `describe` de #68 ni de #74, ni se añade copy: no se
  tocan `src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx`
  ni `src/__tests__/ui-copy-table.ts`. No se instala nada.
- **(F)** *La forma y la alineación de la fila no tienen candado.* Medido: con
  `className="flex-col"` en la fila (blob `99ec492be5163fe00494ebc247a84535b68cbb66`)
  o con `paddingLeft: 0` (blob `9cb811796c2424dd25296505a589950d16bf0436`), la
  gráfica da 41/41 hoy y 43/43 tras esta feature. Son las decisiones 10 y 11 de
  `docs/ui-guidelines.md` §Enmienda #70 para la fila. El `padding` alinea cada
  columna con su barra, así que el candado honesto es relacional (el `padding`
  de la fila frente al del gráfico), no un literal `40.4`.
- **(N)** *Que el `<>` de la gráfica o `weekly-activity-chart-layout` sean
  ancestros de la fila.* El fragmento no crea nodo host, y el `layout` es
  hermano de la fila (§Premisas). Por eso R2 fija el padre de la fila y no una
  cadena más larga.
- **(N)** *Que `importantForAccessibility="no-hide-descendants"` en la fila sea
  un hueco.* Hoy ya lo paran 9 tests de #68 (sonda `hide`).

---

## Aprobación

- [ ] **Aprobado por humano** (fecha: ____) ← gate obligatorio antes de
      implementar. Al marcar esta casilla, el humano firma también los ocho
      puntos de §Qué firma el humano al aprobar esta spec.

> **Esta feature tiene una sola casilla**: esta. No hay gate de TalkBack
> (§Qué firma el humano, punto 6).
