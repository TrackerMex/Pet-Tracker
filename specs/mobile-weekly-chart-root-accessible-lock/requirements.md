---
feature: "mobile-weekly-chart-root-accessible-lock"
status: spec_ready       # draft | spec_ready | approved
tags: [spec, mobile, a11y, deuda]
---

# Requisitos — [[mobile-weekly-chart-root-accessible-lock]] (#132)

> Notación EARS. Cada requisito lleva su id `R<n>`, inmutable una vez aprobado.
> Ver [[design]] para las decisiones y las alternativas descartadas, [[tasks]]
> para el orden TDD, los literales, los blobs y las sondas, y [[traceability]]
> para el cierre.
>
> Origen: la observación 1 del veredicto de #130
> (`progress/review_mobile-weekly-day-row-accessible-lock.md`, sonda `wrapcard`),
> registrada como #132 al cerrar #130.
>
> **Base medida: `035be7fe`**, que es `origin/main` (merge de la PR #171 de
> #130) y el `HEAD` de esta branch. **Los números de línea no son anclas**, ni
> los de esta spec ni los de la entrada de `feature_list.json`: todo se localiza
> con los `grep` que se citan, y las cuentas se vuelven a medir al arrancar
> ([[tasks]] §Antes de tocar nada).

## Contexto mínimo para implementar sin más contexto

La feature toca **un fichero**, `mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`
(«el test», 43 tests hoy). El fichero de producción
`mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx` («la gráfica»)
**solo se toca en el commit rojo**, para versionar una mutación que el commit
verde siguiente revierte. El diff acumulado de la gráfica contra `origin/main`
es **vacío**.

`WeeklyActivityChart` tiene un solo `return (`, y lo primero que devuelve es
`<Card testID="weekly-activity-card" className="gap-2">`. Lo que pinta, en host
(lo que ven las consultas de RNTL v14), con al menos un día medido y montado
dentro del centinela que añade esta feature:

```
View testID="chart-parent"                   (el centinela: del test, no de la gráfica)
└─ View testID="weekly-activity-card"        (el Card compartido, sin onPress)
   ├─ View testID="weekly-activity-header"
   ├─ View testID="weekly-activity-metric"      (el selector, #74)
   ├─ View testID="weekly-activity-chart-layout" (el gráfico, con onLayout)
   └─ View testID="weekly-activity-day-row"     (la fila, #130)
      └─ siete columnas, una por día (#68 R9)
```

En el test, `renderChart(days, weekComparison?, language?)` pinta la gráfica
dentro de `ChartWrapper`, que monta `HeroUINativeProvider` y `LanguageProvider`.
Ahí el padre host de la tarjeta es `RNCSafeAreaProvider`, un nodo de
`HeroUINativeProvider`, no de la gráfica. En la Home, la tarjeta cuelga
directamente de `View testID="home-content"`. El último `describe` del test es
`describe('#130 R2: entre la tarjeta y cada columna no hay otro nodo'`.

Por qué importa: en Android, un `View` con `accessible` (o un `Pressable`, que
lo es por defecto) se vuelve **un solo nodo de TalkBack con todo su subárbol
dentro**. Un envoltorio así alrededor de la tarjeta funde el selector, el
gráfico y las siete columnas en una sola parada.

## Premisas de la entrada, verificadas contra el árbol

«La gráfica» es el comando canónico de la gráfica, «la Home» es
`bunx jest --runTestsByPath src/screens/home/index.test.tsx` y «suite» es
`bunx jest`, todo sin pipe ([[tasks]] §Antes de tocar nada).

| Premisa (`feature_list.json` #132 y el encargo del `leader`) | Veredicto | Evidencia |
|---|---|---|
| Con un `<View accessible>` alrededor de `weekly-activity-card`, dentro de `WeeklyActivityChart`, la gráfica sigue en 43/43 | **cierta, re-medida** | sonda `wrapcard`, blob `cec8a26e4f276f0a0615702a03626d2b0f3acfcc` (el mismo de la entrada): la gráfica, 43/43, `exit=0` |
| No lo ven `#130 R1`, `#130 R2` ni `#74 R2` | **cierta** | es la misma medida: los tres están en esos 43 verdes. Las claves de la fila y de la tarjeta no cambian, y `row.parent` sigue siendo la tarjeta |
| La tarjeta es hoy la raíz host de lo que pinta la gráfica | **cierta, medida** | en `renderChart`, el padre host de la tarjeta es `RNCSafeAreaProvider`, de `HeroUINativeProvider`. En la Home, la tarjeta es hija directa de `home-content` (lo asevera la fila siguiente) |
| **Y no tiene candado** | **falsa en la suite; cierta en la gráfica** | con `wrapcard`, la Home da `exit=1`: **4 rojos**, todos por `expect(received).toEqual(expected)`, porque la tarjeta sale de `home-content.children`. Son `R14: la Home monta la actividad semanal sin pedir nada nuevo › queda entre el resumen y la última posición en el árbol`, `#69 R1: … › coloca la tira sobre la tarjeta del collar`, `#71 R1: … › coloca la rejilla entre el collar y la actividad semanal` y `#70 R1: … › #70 R14: posición y condición de la sección › coloca la sección entre la actividad semanal y la última posición`. El `reviewer` de #130 midió solo la gráfica. Lo que cambia para esta feature está en §Qué firma, punto 1 |
| Un `Pressable` alrededor de la tarjeta, igual | **cierta en la gráfica; la Home ya lo ve** | sonda `presscard` (`330939c5`): la gráfica, 43/43. La Home, los mismos 4 rojos por `toEqual`. Un `<View>` sin marcar (`wrapplain`, `06303036`) da lo mismo |
| `accessible` o `onPress` directamente en la tarjeta ya tienen candado | **cierta, re-medida** | `#74 R2 › la tarjeta que lo envuelve tampoco se vuelve un nodo accesible`: las sondas `cardacc` (`8fc10f1c`) y `cardpress` (`2a460368`) dan rojo 1 en la gráfica, por `toEqual`, y la Home sigue verde. Son los blobs que midieron #74 y #130: la gráfica no ha cambiado desde entonces |
| Un `<>` alrededor de la tarjeta no es un hueco | **cierta, medida** | sonda `fragment` (`e3248830`): verde en la gráfica, en la Home y en las tres suites que leen la gráfica como texto. Un fragmento no crea nodo host ni llega a TalkBack |
| El `#` en los títulos nuevos no dispara los guards de hex | **cierta con ` R<n>` detrás, medida** | con el bloque nuevo, la suite da `exit=0`. Con un `#132` suelto en su comentario (sonda `hexbare`, blob del test `378edd757c0d8de04d60ef07d7687ebb579df5a4`), `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts` da `exit=1`, 1 failed de 55: `#68 R18: la actividad semanal no mete drift de estilo › keeps arbitrary text, hex colors, and StyleSheet out of feature sources` |
| `files_affected` es solo el test | **cierta** | ningún requisito necesita otro fichero. La gráfica entra y sale en el rojo |
| #131 toca el mismo test | **cierta** | su `files_affected` es el mismo fichero. Está `pending` y no tiene branch en `origin`. Su alcance (la forma y el `padding` de la fila) no se cruza con este ([[design]] §Coordinación) |
| La sesión Backend (#100, en `wt-backend`) no toca estos ficheros | **cierta** | su `HEAD` local (`c5a54b94`) no cambia nada bajo `src/screens/home/` contra `origin/main`. Sí toca `src/__tests__/design-drift.test.ts` y añade suites de alertas, así que **si mergea antes, la cifra de la suite cambia** |
| Suite de base | **medida sin pipe** | la gráfica, 43/43, `exit=0`. La Home, 159/159, `exit=0`. La suite, 83 suites / 1552 tests / 1 snapshot, `exit=0`, con 30 bloques `● Console` de ruido. `bunx tsc --noEmit` y `bunx eslint` de los dos ficheros, `exit=0` |
| Blobs de base | **medidos** | la gráfica `c258abedde92d2be981be8507d3d898f13c612cb` y el test `24a5c572d5f7f10f1a65dfd7ffd04a181bc47140`. Iguales en `HEAD` y en `origin/main` |
| Entorno | **verificado** | `test ! -e .expo/types/router.d.ts` da `exit=0`. No hay hooks de git ni prettier en `mobile-pet-tracker/` |

## Requisitos funcionales

- **R1**: WHILE `WeeklyActivityChart` pinte al menos un día medido, THE SYSTEM
  SHALL mantener el `View` con `testID="weekly-activity-card"` como **raíz host
  de lo que pinta la gráfica**: su padre host es el host que monta la gráfica.
  Se comprueba montando la gráfica dentro de un host del test,
  `<View testID="chart-parent">`:

  `#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica › entre el nodo que monta la gráfica y la tarjeta no hay ningún otro`

  asevera, con `toBe` y literales del test, que
  `getByTestId('weekly-activity-card').parent?.props.testID` es
  `'chart-parent'`.

  IF se mete un host entre la raíz de la gráfica y la tarjeta, sea un
  `<View accessible>`, un `<Pressable>` o un `<View>` sin marcar, THEN ese `it`
  SHALL fallar **por aserción** (`expect(received).toBe(expected)`). IF el
  envoltorio oculta su subárbol (`importantForAccessibility="no-hide-descendants"`),
  THEN SHALL fallar **por consulta** (`Unable to find an element with testID:
  weekly-activity-card`), junto con los 37 rojos que ese caso ya da hoy en la
  gráfica. IF la tarjeta se envuelve en un `<>`, THEN SHALL seguir verde.

  El rojo es una mutación de producción versionada (C4, vía **b**):
  `wrapcard`. Con ella, la suite SHALL dar **exactamente 5 rojos en 2 suites**:
  el `it` de R1, por `toBe`, y los 4 de la Home de §Premisas, por `toEqual`, que
  ya son rojos hoy con la misma mutación (medido: 5 failed de 1553; 2 suites
  failed de 83).

- **R2**: THE SYSTEM SHALL cerrar con:

  1. **El delta declarado**: +0 suites y +1 test. La gráfica pasa de 43 a 44, y
     la suite, de 83 / 1552 / 1 a 83 / 1553 / 1, medida sin pipe. Si la base
     medida al arrancar es otra (por ejemplo, porque #100 mergeó antes), el
     delta exigido sigue siendo +1 test y +0 suites sobre lo medido.
  2. **Diff de producción vacío**: `git diff --exit-code origin/main...HEAD --
     mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx` da 0, y la
     gráfica acaba en su blob de base.
  3. **Ningún `describe` de #68, #74 ni #130 editado**, y todos verdes: el diff
     acumulado del test es un solo bloque añadido al final, sin ninguna línea
     borrada (`--numstat` con 0 borradas y un solo hunk, [[tasks]] §R2).
  4. **Ninguna cifra de candado se mueve**, con los `grep` de [[tasks]] §R2.
  5. `bunx tsc --noEmit` con `exit=0` tras `test ! -e .expo/types/router.d.ts`,
     y `bunx eslint` de los dos ficheros con `exit=0`.
  6. **Ninguna dependencia nueva** ni copy nueva.
  7. La tabla de sondas de [[tasks]] §Sondas, re-medida sobre el árbol final,
     en `progress/impl_mobile-weekly-chart-root-accessible-lock.md`.

  No tiene test propio: es una propiedad del diff y de la suite. Lo cierra el
  `reviewer` por inspección.

## Tabla de sondas, resumen

Las sondas, con el blob exacto de cada mutación y los `it` que fallan, están en
[[tasks]] §Sondas. Se miden con la gráfica **y** la Home en la misma corrida,
porque la Home también pinta la tarjeta. «Hoy» es la mutación sobre la base (43
+ 159 tests), y «tras #132», sobre el árbol final (44 + 159). Las tres suites
que leen la gráfica como texto (`design-drift`, `consistency-classnames` y
`ui-language`) siguen verdes con todas las sondas de la gráfica (medido).

| Clase | Sondas | Hoy (base) | Tras #132 |
|---|---|---|---|
| Un host entre la raíz y la tarjeta | `wrapcard`, `presscard`, `wrapplain` | gráfica **verde**; Home, rojo 4 por `toEqual` | **rojo 5**: R1 por `toBe` y los mismos 4 |
| Un envoltorio que oculta la tarjeta | `hidewrap` | rojo 46: 37 de la gráfica y 9 de la Home | **rojo 47**: los mismos y R1, **por consulta** |
| Un fragmento, o un hermano de la tarjeta | `fragment`, `sibling` | verde | **verde**: `fragment` no es hueco, `sibling` es **(D)** |
| La tarjeta se vuelve un nodo | `cardacc`, `cardpress` | rojo 1: `#74 R2 › la tarjeta…` | igual |
| Un nodo entre la tarjeta y la fila | `wrapinner` | rojo 1: `#130 R2`, por `toBe` | igual |
| Un nodo alrededor del selector | `wrapmetric` | verde | **verde**: hueco declarado, **(F)** |

## Qué firma el humano al aprobar esta spec

1. **La premisa «no tiene candado» es falsa en la suite, y aun así esta spec
   propone hacer #132.** Cuatro `it` de orden de la Home ya se ponen en rojo con
   `wrapcard`, `presscard` y `wrapplain`, porque la tarjeta sale de
   `home-content.children` (§Premisas). El hueco solo existe si se mira la
   gráfica sola, que es lo que midió el `reviewer` de #130. R1 aporta que el
   candado viva en el test de la gráfica y que su tema sea la raíz de la
   gráfica, no el orden de la Home: si la Home cambia cómo monta la gráfica, esos
   cuatro `it` se reescriben y la raíz se queda sin candado sin que nadie lo
   note. Cuesta 1 test. **La alternativa es cerrar #132 como (N)** sin cambiar
   nada ([[design]] §Alternativas descartadas). Aprobar esta spec es elegir R1.
2. **El candado es estructural y cerrado.** Cualquier host nuevo entre la raíz
   de la gráfica y la tarjeta pone R1 en rojo, sea accesible o no: el `View` sin
   marcar entra en el alcance (sonda `wrapplain`). Su coste: un envoltorio
   legítimo obliga a tocar el candado a sabiendas. Es el mismo trato que firmó
   `#130 R2` para la fila.
3. **El centinela es del test.** El padre real de la tarjeta en `renderChart` es
   un nodo de `HeroUINativeProvider` (`RNCSafeAreaProvider`), y aseverar sobre
   él ataría el candado a una librería de terceros. R1 monta la gráfica dentro
   de un `<View testID="chart-parent">` propio y asevera contra ese literal.
4. **La mutación versionada da 5 rojos, no 1**: R1 y los 4 de la Home, que ya
   eran rojos con ella. En #130 el rojo era único. Aquí no puede serlo, porque
   todo host alrededor de la tarjeta la saca también de `home-content`. La
   mutación toca un solo fichero de producción, la gráfica, y el verde la
   revierte con `git checkout HEAD~1 --`. La historia toca la gráfica en dos
   commits, pero el diff acumulado es vacío (R2.2).
5. **El delta es +0 suites y +1 test**: 83 / 1552 / 1 antes, 83 / 1553 / 1
   después, sobre esta base. Ninguna cifra de candado se mueve (R2.4).
6. **Sin gate de TalkBack.** El árbol de producción acaba idéntico al de
   `origin/main`: en un dispositivo no hay nada nuevo que oír. El único gate
   humano es la casilla de §Aprobación.
7. **Requisitos sin test propio**: R2, que es una propiedad del diff y de la
   suite. Lo cierra el `reviewer` por inspección, y queda declarado aquí antes
   del handoff, como pide C4.
8. **Los otros hijos de la tarjeta quedan fuera** como **(F)**: un
   `<View accessible>` alrededor del selector funde sus tres opciones y toda la
   suite sigue verde (sonda `wrapmetric`, §Fuera de alcance).

## Cobertura de los criterios de aceptación de `feature_list.json` #132

| Criterio | Cubierto por |
|---|---|
| 1. Con un `View accessible` (o un `Pressable`) envolviendo `weekly-activity-card` dentro de `WeeklyActivityChart`, un `it` de la gráfica falla | R1: sondas `wrapcard` y `presscard`, rojas por `toBe` en la gráfica. Además `wrapplain` y `hidewrap` |
| 2. Los esperados son literales del test, nunca importados de producción | R1: `'chart-parent'` y `'weekly-activity-card'` se escriben en el test. De la gráfica solo se importa el componente que se prueba, como ya hace el test |
| 3. Los `describe` de #68, #74 y #130 siguen verdes y sin cambios | R2.3: un solo bloque añadido al final, 0 líneas borradas, y la gráfica en 44/44 |
| 4. Cero cambio en producción; suite verde medida sin pipe; delta declarado | R2.1 y R2.2, con el rojo por mutación versionada y revertida (punto 4) |

## Fuera de alcance

Cada viñeta está clasificada: **(D)** delimitación de esta feature,
**(F)** hallazgo candidato a registrarse como otra feature (sin id: lo asigna
el `leader` contra `origin/main`) y **(N)** premisa verificada y descartada.

- **(D)** No se miran ni se tocan los ancestros de la tarjeta en la Home
  (`src/screens/home/index.tsx`). R1 fija solo lo que pinta
  `WeeklyActivityChart`. Los 4 `it` de orden de `index.test.tsx` que también ven
  la mutación siguen como están, con su propio tema.
- **(D)** Los hermanos de la tarjeta en la raíz de la gráfica. Con un `<>` que
  pone un `<View accessible />` al lado de la tarjeta (sonda `sibling`,
  `27969c05`), toda la suite sigue verde, pero la tarjeta no se funde con nada:
  el hueco de #132 es un nodo que la **contenga**. Cerrarlo fijaría la lista de
  hijos del centinela, que es otra decisión.
- **(D)** Un solo escenario, la semana entera medida. La gráfica tiene un único
  `return (`, con la tarjeta como raíz, y el estado vacío pinta dentro de esa
  misma tarjeta. La condición de render del contenido la fijan ya los `it` de
  `R13`.
- **(D)** No se vuelven a candar las props de la tarjeta (`#74 R2`, sondas
  `cardacc` y `cardpress`), ni la fila ni sus columnas (`#130 R1`, `#130 R2` y
  `#68 R9`, sonda `wrapinner`).
- **(D)** La forma (`flex-row` frente a `flex-col`) y el `padding` de la fila
  son de **#131** (`mobile-weekly-day-row-layout-lock`). #132 no los mira ni los
  fija, así que no impide ningún candado de #131. Las dos añaden su bloque al
  final del mismo test, y quien mergee segunda resuelve un conflicto trivial al
  final del fichero, conservando los dos.
- **(D)** No se toca `src/components/card.tsx`. Si algún día el `Card` metiera
  un envoltorio por encima de su `View`, R1 también se pondría en rojo: es
  intencionado, porque también fundiría la tarjeta.
- **(D)** No se toca ningún `describe` de #68, #74 ni #130, ni se añade copy:
  no se tocan `src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx`
  ni `src/__tests__/ui-copy-table.ts`. No se instala nada.
- **(F)** *Los hijos de la tarjeta que no son la fila no tienen candado de
  estructura.* Medido: con un `<View accessible>` alrededor de `<MetricSelector`
  (sonda `wrapmetric`, blob `d053148a654bb15abf0e75c2d056d94bea7b930a`), la
  gráfica da 43/43 hoy y 44/44 tras esta feature, y la Home y las tres suites
  que leen la gráfica siguen verdes. En Android funde en un solo nodo de
  TalkBack las tres opciones del selector que `#74` separó. `#74 R2` cierra las
  props del contenedor del selector, no su padre. Es el mismo remedio que
  `#130 R2`: fijar los hijos host de la tarjeta por `children`.
- **(N)** *Que `importantForAccessibility="no-hide-descendants"` alrededor de
  la tarjeta sea un hueco.* Hoy ya lo paran 37 tests de la gráfica y 9 de la
  Home (sonda `hidewrap`).
- **(N)** *Que un `<>` o un componente sin host alrededor de la tarjeta sea un
  hueco.* No crean nodo host ni llegan a TalkBack (sonda `fragment`, verde).

---

## Aprobación

- [ ] **Aprobado por humano** (fecha: ____) ← gate obligatorio antes de
      implementar. Al marcar esta casilla, el humano firma también los ocho
      puntos de §Qué firma el humano al aprobar esta spec, y el primero en
      particular: hacer R1 en vez de cerrar #132 como (N).

> **Esta feature tiene una sola casilla**: esta. No hay gate de TalkBack
> (§Qué firma el humano, punto 6).
