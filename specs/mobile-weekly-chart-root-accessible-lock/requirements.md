---
feature: "mobile-weekly-chart-root-accessible-lock"
status: approved         # draft | spec_ready | approved
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
>
> **Enmienda 1 (R1 y R2, 2026-09-29, pendiente de firma):** tras el rechazo de
> la ronda 1 (`progress/review_mobile-weekly-chart-root-accessible-lock.md`,
> obs. 1), R1 pasa a cubrir también el estado **tras el layout**, el de **un
> día seleccionado** y el de **otra métrica seleccionada**, con tres `it`
> nuevos. Todo lo de la enmienda está en §Enmienda 1, que es lo que vale tras su
> firma; lo que cambia fuera de ella lleva la marca **Enmienda 1**. Su base
> medida es `02128a12` (el merge de `origin/main` `4efb6c81` en esta branch).
> El frontmatter sigue en `approved`,
> como en el precedente de #77 (`specs/mobile-home-weight-without-collar/`):
> la enmienda no rige hasta que se marque su casilla propia (§Enmienda 1 ›
> Firma de la Enmienda 1).

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

  > **Enmienda 1**: R1 se amplía a cuatro estados (antes de medir, tras el
  > layout, con un día seleccionado y con otra métrica seleccionada) y a cuatro
  > `it`. El texto que rige tras la firma es el de §Enmienda 1 › R1 enmendado. El `it` de arriba se queda tal
  > cual, y sus hashes de ronda 1 también.

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

  > **Enmienda 1**: las cifras del cierre (delta, `numstat`, `grep` y tabla de
  > sondas) se re-miden y se sustituyen por las de §Enmienda 1 › R2 enmendado.

## Tabla de sondas, resumen

> **Enmienda 1**: esta tabla es la de ronda 1. La que rige tras la firma, con
> las sondas de estado y las de los huecos declarados, es la de §Enmienda 1 ›
> Sondas.

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
   **Enmienda 1**: este punto era falso tal como estaba escrito. R1 solo miraba
   el primer render, y un host que aparece tras el layout (`layoutwrap`) o con
   un día seleccionado (`selwrap`) dejaba la suite entera en verde. Uno que
   aparece con otra métrica seleccionada (`metricwrap`) solo lo veía `R6`, de
   rebote. Se reescribe en §Enmienda 1 › Punto 2 reescrito.
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
   **Enmienda 1**: la enmienda tiene su propia casilla (§Enmienda 1 › Firma de
   la Enmienda 1), que firma la spec enmendada y no es un gate de TalkBack.
7. **Requisitos sin test propio**: R2, que es una propiedad del diff y de la
   suite. Lo cierra el `reviewer` por inspección, y queda declarado aquí antes
   del handoff, como pide C4.
8. **Los otros hijos de la tarjeta quedan fuera** como **(F)**: un
   `<View accessible>` alrededor del selector funde sus tres opciones y toda la
   suite sigue verde (sonda `wrapmetric`, §Fuera de alcance).

## Cobertura de los criterios de aceptación de `feature_list.json` #132

| Criterio | Cubierto por |
|---|---|
| 1. Con un `View accessible` (o un `Pressable`) envolviendo `weekly-activity-card` dentro de `WeeklyActivityChart`, un `it` de la gráfica falla | R1: sondas `wrapcard` y `presscard`, rojas por `toBe` en la gráfica. Además `wrapplain` y `hidewrap`. **Enmienda 1**: también cuando el envoltorio solo aparece tras el layout (`layoutwrap`), con un día seleccionado (`selwrap`) o con otra métrica seleccionada (`metricwrap`) |
| 2. Los esperados son literales del test, nunca importados de producción | R1: `'chart-parent'` y `'weekly-activity-card'` se escriben en el test. De la gráfica solo se importa el componente que se prueba, como ya hace el test |
| 3. Los `describe` de #68, #74 y #130 siguen verdes y sin cambios | R2.3: un solo bloque añadido al final, 0 líneas borradas, y la gráfica en 44/44. **Enmienda 1**: la gráfica en 47/47, y `97 0` en un hunk contra `40e40dfe` (§Enmienda 1 › R2 enmendado) |
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
  **Enmienda 1**: esta viñeta delimitaba datos, no estados, y se apoyaba en el
  único `return (`, que es justo lo que `layoutwrap` y `selwrap` rompen sin que
  R1 lo viera. Tras la enmienda sigue habiendo un solo juego de datos, pero R1
  monta cuatro estados. Lo que R1 sigue sin variar está inventariado, y
  declarado como (D), en §Enmienda 1 › Zona ciega.
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

## Enmienda 1 — R1: tras el layout, con un día seleccionado y con otra métrica

> Abierta el 2026-09-29 tras el veredicto rechazado de la ronda 1
> (`progress/review_mobile-weekly-chart-root-accessible-lock.md`, obs. 1,
> bloqueante). El humano la eligió con estas palabras: «Enmendar R1: R1 pasa a
> cubrir también el estado tras el layout y el de un día seleccionado;
> layoutwrap y selwrap serían rojos exigidos». Enmienda a una spec ya firmada:
> **necesita su propia firma** (§Firma de la Enmienda 1). Sin esa casilla, R1 y
> R2 siguen como arriba y Codex no toca nada.
>
> La primera redacción de la enmienda (`c1876aae`) dejó tres decisiones
> abiertas. El humano las contestó el 2026-09-29, en la sesión del `leader`:
>
> - **La métrica**: «4.º it». R1 cubre también el cambio de métrica, el tercer
>   estado propio de la gráfica, y `metricwrap` pasa a rojo exigido.
> - **Un candado sobre el texto del componente**: «No». Se acepta el punto 2
>   reescrito con sus huecos (D).
> - **Los recuentos de la ronda 1**: «Aceptar».
>
> Esta es la segunda redacción, que incorpora las tres respuestas.
>
> Todo lo de esta sección se **midió** en un `git worktree` temporal del
> spec_author. La segunda redacción lo volvió a medir entero, en un worktree
> nuevo desacoplado en `87bebb89`, cuyo código es el de `02128a12`. Las medidas
> se hicieron sin pipe, con `--runTestsByPath` y comprobando `Test Suites: N`,
> sin `init.sh` ni e2e, y con una caché de jest propia del scratchpad
> (`--cacheDirectory`). Comandos y logs:
> `progress/spec_e1_mobile-weekly-chart-root-accessible-lock.md`.

### Qué falló en la ronda 1

R1 montaba la gráfica una vez y aseveraba en el primer render, antes de que el
gráfico se midiera. Dos mutaciones del `reviewer` condicionan la raíz a un
estado que ese render no alcanza. Las dos cambian `  return (`, justo encima de
la línea de la tarjeta, por `  const card = (`, y añaden detrás del `  );` que
cierra la tarjeta:

- `layoutwrap`: `  return chartWidth > 0 ? <View accessible>{card}</View> : card;`
- `selwrap`: `  return selection !== null ? <Pressable onPress={() => setSelection(null)}>{card}</Pressable> : card;`

Con cualquiera de las dos, la suite entera seguía en verde (1553 de 1553 sobre
`035be7fe`, medido por el `reviewer`). En Android las dos funden la tarjeta
entera en un solo nodo de TalkBack, y `selwrap` es el patrón corriente de
«tocar fuera para cerrar el tooltip». La decisión que lo dejó pasar es la de
[[design]] «No dispara el `layout`», que la Enmienda 1 sustituye.

La primera redacción de la enmienda encontró una tercera de la misma clase,
`metricwrap`: `  return selectedMetricIndex !== 0 ? <View accessible>{card}</View> : card;`.
Ningún candado de la raíz la veía. Solo caía `R6`, de rebote (§Zona ciega).

### Premisas re-medidas sobre `02128a12`

| Premisa | Veredicto | Evidencia |
|---|---|---|
| El código de la branch es el de `02128a12` | **cierta** | los tres commits que siguen (`6faa86c1`, `c1876aae` y `87bebb89`, el `HEAD` de la segunda redacción) solo tocan `progress/` y `specs/`: `git diff --stat 02128a12 87bebb89 -- mobile-pet-tracker` sale vacío |
| Blobs de partida | **medidos** | la gráfica `c258abedde92d2be981be8507d3d898f13c612cb` (el de `origin/main` y el de base de la ronda 1) y el test `326aa48242b28195849d4e9fe8179004162623d2` (el final de la ronda 1) |
| En `mobile-pet-tracker/`, `origin/main` (`4efb6c81`) solo difiere de la branch en el `it` de la ronda 1 | **cierta** | `git diff --stat 4efb6c81 02128a12 -- mobile-pet-tracker` lista solo el test, con 24 inserciones |
| Base | **medida sin pipe, dos veces** | en las dos redacciones: la gráfica, 44/44 con `Test Suites: 1`, `exit=0`. La gráfica y la Home, 203/203 con `Test Suites: 2`, `exit=0`. La suite, 86 suites / 1598 tests / 1 snapshot, `exit=0`, con 33 bloques `● Console` de ruido. `test ! -e .expo/types/router.d.ts` da `exit=0`, y `bunx tsc --noEmit` y `bunx eslint` de los dos ficheros dan `exit=0` |
| `origin/main` sin la ronda 1: 86 / 1597 / 1 | **derivada, no medida** | 1598 menos el `it` de la ronda 1 (fila de arriba) |
| La Home no ve un envoltorio que solo aparece tras el layout, con un día seleccionado o con otra métrica | **cierta, medida** | con `layoutwrap`, con `selwrap` y con `metricwrap`, los 159 de la Home siguen verdes sobre el árbol final (§Sondas). La Home pulsa `weekly-activity-metric-distanceM` en un `it` y aun así no ve `metricwrap` |
| `WeeklyActivityChart` tiene un solo `return (` y ningún `return` temprano | **cierta** | `grep -c '^  return ($'` da 4 en la gráfica: los de `ActivityBar`, `DetailMetric`, `MetricSelector` y `WeeklyActivityChart`. El de `WeeklyActivityChart` es la línea justo encima de la línea de la tarjeta. El único `return;` dentro del componente es `if (day === undefined) return;`, en el handler `selectDay`, que no pinta nada |
| El estado propio de la gráfica son tres `useState` | **cierta** | `grep -c 'useState'` da 5 en la gráfica: el import, `const [layouts, setLayouts] = useState<`, que es de `MetricSelector` y vive debajo de la tarjeta, y los tres de `WeeklyActivityChart`: `const [chartWidth, setChartWidth] = useState(0);`, `const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);` y `const [selection, setSelection] = useState<DaySelection \| null>(null);`. Aparte de sus props, `WeeklyActivityChart` solo lee `useLocale()`, `useTranslate()` y `useThemeColors([` |
| `weekly-activity-bar-chart` solo existe tras medir | **cierta** | la gráfica monta `BarChart` solo dentro de `{chartWidth > 0 ? (`, y el mock del test le pone ese `testID`. `R11 › reserva la altura y no monta el gráfico antes de medir` ya lo asevera |
| `weekly-activity-tooltip` solo existe con un día seleccionado | **cierta** | va dentro del primer `{selectedDay ? (` |
| Pulsar `weekly-activity-day-2026-09-02` selecciona un día | **cierta, medida** | es la primera columna de `makeWeek('2026-09-02', …)`. Su `onPress` llama a `handleColumnPress`, y el tercer `it` ve el tooltip en pantalla |
| Pulsar `weekly-activity-metric-distanceM` selecciona la segunda métrica | **cierta, medida** | es el índice 1 de `WEEKLY_METRICS` (`activeMinutes`, `distanceM`, `walkCount`, lo fija `R2 › expone la API acordada y monta la tarjeta con datos recibidos`). `R6 › repinta distancia desde la opción pulsada con los mismos datos` la pulsa y asevera después su `accessibilityState` en `{ selected: true }`. El cuarto `it` hace lo mismo y pasa |
| Ningún `it` de la gráfica pulsa la tercera métrica | **cierta** | `grep -c "weekly-activity-metric-walkCount"` da 0 en el test. Las tres pulsaciones de métrica del test (`R6 › repinta distancia…`, `R6 › desliza una única píldora…` y `R12 › cambia la tendencia al delta de la métrica seleccionada`) son sobre `distanceM`, y la de la Home también |

### R1 enmendado

- **R1**: WHILE `WeeklyActivityChart` pinte al menos un día medido, THE SYSTEM
  SHALL mantener el `View` con `testID="weekly-activity-card"` como **raíz host
  de lo que pinta la gráfica** en cada uno de estos cuatro estados. En los
  cuatro, la gráfica se monta dentro de `<View testID="chart-parent">`, con
  `makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70])` y `NO_COMPARISON`:

  1. **Primer render, antes de medir**:
     `#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica › entre el nodo que monta la gráfica y la tarjeta no hay ningún otro`.
     Es el `it` de la ronda 1, que no se toca.
  2. **Tras el layout** de `weekly-activity-chart-layout` a 295 px de ancho,
     con `weekly-activity-bar-chart` en pantalla:
     `#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica › tras medir el gráfico, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro`.
  3. **Con un día seleccionado**, tras ese mismo layout y un `press` sobre
     `weekly-activity-day-2026-09-02`, con `weekly-activity-tooltip` en
     pantalla:
     `#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica › con un día seleccionado, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro`.
  4. **Con otra métrica seleccionada**, tras ese mismo layout y un `press` sobre
     `weekly-activity-metric-distanceM`, con esa opción en
     `accessibilityState` `{ selected: true }`:
     `#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica › con otra métrica seleccionada, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro`.

  Cada `it` asevera, con `toBe` y literales del test, que
  `getByTestId('weekly-activity-card').parent?.props.testID` es
  `'chart-parent'`. Los `it` 2, 3 y 4 aseveran antes que han llegado a su
  estado: el 2 y el 3 con `toBeOnTheScreen`, y el 4 con `toEqual` sobre el
  `accessibilityState` de la opción pulsada.

  IF existe un host entre la raíz de la gráfica y la tarjeta en alguno de esos
  estados, sea un `<View accessible>`, un `<Pressable>` o un `<View>` sin
  marcar, THEN SHALL fallar **por aserción** (`expect(received).toBe(expected)`)
  cada `it` cuyo estado lo contenga. Eso incluye el host que solo aparece tras
  medir (`layoutwrap`: caen los `it` 2, 3 y 4), el que solo aparece con un día
  seleccionado (`selwrap`: cae el `it` 3) y el que solo aparece con otra
  métrica seleccionada (`metricwrap`: cae el `it` 4). IF el envoltorio oculta
  su subárbol (`hidewrap`), THEN los cuatro SHALL fallar **por consulta**. IF la
  tarjeta se envuelve en un `<>`, THEN los cuatro SHALL seguir verdes.

  Cada `it` nuevo tiene su rojo, que es una mutación de producción versionada
  en su propio commit (C4, vía **b**): `layoutwrap` para el `it` 2, `selwrap`
  para el 3 y `metricwrap` para el 4.

  - Con `layoutwrap` y con `selwrap`, la suite SHALL dar **exactamente 1 rojo
    en 1 suite**: el `it` nuevo de ese commit, por `toBe`. Medido: con
    `layoutwrap`, 1 failed de 1599; con `selwrap`, 1 failed de 1600; en los
    dos, 1 suite failed de 86.
  - Con `metricwrap`, la suite SHALL dar **exactamente 2 rojos en 1 suite**: el
    `it` 4, por `toBe`, y
    `R6: el selector cambia de métrica sin volver a pedir nada › desliza una única píldora entre las medidas reales de las pestañas`,
    por `toHaveBeenNthCalledWith`. `R6` ya cae con esa mutación antes del `it`
    4: el envoltorio que aparece al cambiar de métrica cambia el tipo del
    elemento raíz, React remonta la tarjeta entera y `MetricSelector` pierde
    las medidas de sus pestañas. Medido: 2 failed y 1599 passed de 1601;
    1 suite failed de 86.

### R2 enmendado

- **R2**: THE SYSTEM SHALL cerrar con los siete puntos de R2, con estas cifras:

  1. **Delta**: +0 suites y +3 tests sobre la base de §Premisas re-medidas.
     La suite pasa de 86 / 1598 / 1 a 86 / 1601 / 1. La gráfica, de 44 a 47. La
     gráfica y la Home, de 203 a 206. La Home sigue en 159. El acumulado contra
     `origin/main` (86 / 1597 / 1, derivado) es +0 suites y +4 tests. Si la base
     medida al arrancar es otra, el delta exigido sigue siendo +3 tests y +0
     suites sobre lo medido.
  2. **Diff de producción vacío**, como en R2.2: la gráfica acaba en
     `c258abedde92d2be981be8507d3d898f13c612cb`.
  3. **Un solo bloque añadido**. Contra `origin/main`, el test da `121 0` en
     `--numstat` y un solo hunk. Contra el commit de evidencia de la ronda 1
     (`40e40dfe`), da `97 0` y un solo hunk: el `it` de la ronda 1 y los
     `describe` de #68, #74 y #130 no cambian.
  4. **Cifras de candado**: las de [[tasks]] §E1 — Cierre.
  5. `tsc` y `eslint`, como en R2.5.
  6. **Ninguna dependencia nueva** ni copy nueva.
  7. **Tabla de sondas**: la de §Sondas de esta enmienda, re-medida sobre el
     árbol final, en una sección nueva `## Enmienda 1` al final de
     `progress/impl_mobile-weekly-chart-root-accessible-lock.md`.

  No tiene test propio. Lo cierra el `reviewer` por inspección.

### Zona ciega: inventario de las ramas de la gráfica

El hueco de la ronda 1 no es una mutación suelta. Es una clase: **una raíz
condicionada a algo que R1 no varía**. Para acotarla se inventariaron **todas**
las ramas condicionales de la gráfica (blob `c258abed`): ternarios, `&&`, `||`,
`??`, `?.()` e `if` con `return` temprano. El encadenamiento opcional que solo
lee una propiedad (`selectedDatum?.value`, `selectedLayout?.x`,
`bar.raw?.date`) no cuenta como rama: no elige qué se pinta. Cada rama se
localiza con `grep -cF '<ancla>' src/screens/home/weekly-activity-chart.tsx`, que da 1 salvo
donde se indica otra cifra. Una rama solo puede meter un host entre la raíz y
la tarjeta si decide **qué devuelve la raíz**. Hoy ninguna lo hace: la raíz es
la tarjeta, sin condición.

| Grupo | Ramas (ancla) | N | Clase | Por qué |
|---|---|---|---|---|
| A. `ActivityBar` (`function ActivityBar({`) | `useSharedValue(reduceMotion ? 1 : 0)`; `average === null \|\| bar.value === 0`; `if (reduceMotion) {`; `{drawAverage && averageY !== null ? (`; `{reduceMotion ? (` | 5 | no aplica | pinta cada barra dentro de `BarChart`, que está dentro de la tarjeta. En el test, además, `BarChart` está mockeado |
| B. Helpers de texto | `formatMetricValue`: `if (metric === 'distanceM') return fmtKm(value);` y `if (metric === 'walkCount') return fmtCount(value);`. `dayAccessibilityLabel`: `if (day.source === 'missing') {`, `if (metric === 'distanceM') {`, `if (metric === 'walkCount') {` y `value: value ?? '—',`. `formatTrendPercent`: `locale.startsWith('es') ? formatted.replace('.', ',') : formatted` | 7 | no aplica | devuelven una cadena y no pintan nodos |
| C. `MetricSelector` (`function MetricSelector({`) | `WEEKLY_METRICS[selectedIndex] ?? WEEKLY_METRICS[0]`; `if (selectedX === undefined \|\| selectedWidth === undefined) return;`; `lastPositionedMetric.current === selectedMetric \|\|`; `if (width <= 0) return;`; `if (previous?.x === x && previous.width === width) return current;`; `{selectedLayout ? (`; `labels[index] ?? ''`; `opacity: pressed ? 0.8 : 1,`; `{selected ? (`; `? 'shrink text-xs font-semibold text-accent-strong'` | 10 | no aplica | el selector es hijo de la tarjeta, así que todo lo que decide queda debajo de ella. Su padre es la (F) `wrapmetric` |
| D. `WeeklyActivityChart`, antes del `return` | `WEEKLY_METRICS[selectedMetricIndex] ?? WEEKLY_METRICS[0]`; `metricLabels[selectedMetricIndex] ?? metricLabels[0]`; `day.source === 'missing' ? null : metricValue(day, selectedMetric)`; `day.source !== 'missing' && typeof value === 'number' ? [value] : []`; `const average = hasPositiveValue`; `day.source !== 'missing' && typeof value === 'number' && value > 0`; `selection === null ? undefined : days[selection.dataIndex]`; `selection === null ? undefined : chartData[selection.dataIndex]`; el ternario `selection === null` de `const tooltipLeft =`; `selection !== null && typeof selectedDatum?.value === 'number'` | 10 | hoy no deciden la raíz | calculan valores que se pintan dentro de la tarjeta. Si alguien condicionara la raíz a uno de ellos, cuenta qué valores monta R1: es la tabla siguiente |
| E. Handlers | `if (day === undefined) return;`; `onSelectDay?.(day);`; `days.length === 0 ? 0 : plotWidth / days.length` | 3 | no aplica | cambian `selection` o llaman a la prop, y no pintan. `selection` y `onSelectDay` están en la tabla siguiente |
| F. El `return` de `WeeklyActivityChart` | `{average !== null ? (`; `{hasMeasuredDay ? (`; `{trend !== null ? (`; `{trend > 0 ? (`; `{trend < 0 ? (`; `{chartWidth > 0 ? (`; `{selectedDay ? (` (da 2: tooltip y detalle); `selectedDay.source === 'missing'` (da 2: el texto del tooltip y `{selectedDay.source === 'missing' ? (`, del detalle); `selection?.dataIndex === dataIndex` (da 2: `className` y `accessibilityState`); `{day.source === 'missing' ? (` | 13 | no aplica | todas están dentro de la tarjeta. `<Card testID="weekly-activity-card"` es lo primero que devuelve el único `return (`, y `    </Card>` es lo último antes de `  );` |

Son 48 ramas, y ninguna decide hoy la raíz. La tabla siguiente recoge las
entradas de las que podría colgar una raíz condicionada: el estado propio de la
gráfica (sus tres `useState`) y las entradas externas (props, contexto, tema,
movimiento reducido y plataforma). Para cada una da qué valor monta R1 y qué
pasa con una sonda que condiciona la raíz a ella. Todas las sondas tienen la
forma de [[tasks]] §E1 — Sondas («condicionar la raíz»), envuelven la tarjeta
en `<View accessible>`, salvo `selwrap`, y se midieron sobre el árbol final
(206 tests).

| Entrada | Dónde la lee hoy la gráfica | R1 la monta con | Sonda: condición del envoltorio | Medido (206) | Clase |
|---|---|---|---|---|---|
| `chartWidth` (estado propio) | `{chartWidth > 0 ? (` y `const tooltipLeft =` | 0 (`it` 1) y 295 (`it` 2, 3 y 4) | `layoutwrap`: `chartWidth > 0`. `layoutwrapctl`: `chartWidth === 0` | `layoutwrap`: rojo 3, 1 suite (los `it` 2, 3 y 4). `layoutwrapctl`: rojo 5, 2 suites (el `it` 1 y los 4 de orden) | **cubierta**, a los dos lados del único umbral que usa la gráfica |
| `chartWidth`, otro umbral | ningún sitio | 0 y 295 | `widewrap`: `chartWidth > 400` | verde, 206/206 | **hueco (D)**, de muestra: el ancho es un continuo y R1 toma dos muestras |
| `selection` (estado propio) | grupo D y `{selectedDay ? (` | `null` (`it` 1, 2 y 4) y el día 0 (`it` 3) | `selwrap`: `selection !== null`, con `<Pressable onPress={() => setSelection(null)}>`. `selwrapctl`: `selection === null` | `selwrap`: rojo 1, 1 suite (el `it` 3). `selwrapctl`: rojo 7, 2 suites (los `it` 1, 2 y 4 y los 4 de orden) | **cubierta**, a los dos lados de `null` |
| El índice seleccionado | `selection?.dataIndex === dataIndex` | solo el 0 | `selidxwrap`: `selection?.dataIndex === 6` | verde, 206/206 | **hueco (D)**, de muestra: R1 monta un día de siete |
| `selectedMetricIndex` (estado propio) | las dos anclas `?? …[0]` del grupo D | 0 (`it` 1, 2 y 3) y 1, `distanceM` (`it` 4) | `metricwrap`: `selectedMetricIndex !== 0`. `metricwrapctl`: `selectedMetricIndex === 0` | `metricwrap`: rojo 2, 1 suite (el `it` 4 y, de rebote, `R6 › desliza una única píldora…`). `metricwrapctl`: rojo 8, 2 suites (los `it` 1, 2 y 3, los 4 de orden y, de rebote, `R6 › desliza una única píldora…`) | **cubierta**, a los dos lados del 0, el índice por defecto de las dos anclas |
| La tercera métrica | las mismas anclas | 0 y 1 | `metricidxwrap`: `selectedMetricIndex === 2` | verde, 206/206 | **hueco (D)**, de muestra: R1 monta dos métricas de tres, y ningún `it` de la gráfica pulsa `walkCount` |
| Un día sin dato | grupo D | ninguno | `missingwrap`: `days.some((day) => day.source === 'missing')` | verde, 206/206 | **hueco (D)**, entrada externa (`days`) |
| El día seleccionado, sin dato | `selectedDay.source === 'missing'` | no | `selmissingwrap`: `selectedDay?.source === 'missing'` | verde, 206/206 | **hueco (D)**, entrada externa (`days`) |
| Ningún valor positivo | `const average = hasPositiveValue` y `{average !== null ? (` | no (los siete son > 0) | `zerowrap`: `average === null` | verde, 206/206 | **hueco (D)**, entrada externa (`days`) |
| Ningún día medido | `{hasMeasuredDay ? (` | no | `emptywrap`: sin día medido | verde, 206/206 | **fuera del WHILE** de R1: es el estado vacío, (D) de la ronda 1 |
| La comparación | `const trend = weekComparison[selectedMetric];` y `{trend !== null ? (` | `NO_COMPARISON` (todo `null`) | `trendwrap`: `trend !== null` | rojo 4, 1 suite: los 4 de orden de la Home; la gráfica, verde | **hueco (D)**, entrada externa (`weekComparison`). La Home lo ve de rebote, como veía `wrapcard` antes de #132 |
| `onSelectDay` | `onSelectDay?.(day);` | sin la prop | `callbackwrap`: `onSelectDay !== undefined` | rojo 4, 1 suite: los 4 de orden de la Home; la gráfica, verde | **hueco (D)**, entrada externa (`onSelectDay`), y la Home de rebote |
| El idioma | `const locale = useLocale();` | `es` | `localewrap`: la raíz envuelve si el idioma no es `es` | verde, 206/206 | **hueco (D)**, entrada externa (contexto) |
| El tema | `const [accentStrong, muted, border, foreground, surface] = useThemeColors([` | el claro: el `beforeEach` deja `mockTheme = 'light'`, y solo `R9: el selector sigue el tema de la app` lo pone en `'dark'` | `themewrap`: `accentStrong.startsWith('dark')`, que con el mock del test es el tema oscuro | verde, 206/206 | **hueco (D)**, entrada externa (tema) |
| Movimiento reducido | la raíz no lo lee: `useReducedMotion()` da 1, y es de `ActivityBar` | `true`, el valor por defecto del mock | `motionwrap`: lo lee en la raíz y envuelve si es `false` | rojo 4, 1 suite: los 4 de orden de la Home; la gráfica, verde | **hueco (D)**, entrada externa (sistema), y la Home de rebote |
| La plataforma | la gráfica no la lee: `Platform` da 0 y `EXPO_OS` da 0 | la del preset de jest | `oswrap`: `process.env.EXPO_OS === 'android'` | verde, 206/206 | **hueco (D)**, entrada externa (plataforma) |

**Conclusión.** R1 enmendado cierra **todo el estado propio de la gráfica** en
su escenario: los tres `useState` de `WeeklyActivityChart` (`chartWidth`,
`selection` y `selectedMetricIndex`), cada uno a los dos lados del único umbral
que la gráfica usa con él (`chartWidth > 0`, `selection === null` y el índice
0 de `WEEKLY_METRICS[selectedMetricIndex] ?? WEEKLY_METRICS[0]`). Los controles
`layoutwrapctl`, `selwrapctl` y `metricwrapctl` prueban el otro lado. El estado
de `MetricSelector` (`layouts`) vive debajo de la tarjeta y no puede decidir la
raíz. Lo que R1 no cierra son las 12 filas «hueco (D)», de dos clases:

- **Entradas externas** que R1 no varía (9 filas): los datos (tres filas), la
  comparación, `onSelectDay`, el idioma, el tema, el movimiento reducido y la
  plataforma.
- **Muestras** del estado propio (3 filas): R1 toma dos anchos de un continuo,
  un día de siete y dos métricas de tres. Un umbral puesto en un valor que no
  monta no lo ve.

Hoy no existe ninguna raíz así. Cerrar la clase entera pediría un candado sobre
el texto del componente, y el humano lo descartó el 2026-09-29 («No»,
[[design]] §Enmienda 1 › Alternativas descartadas en la Enmienda 1).

### Punto 2 reescrito

El punto 2 de §Qué firma el humano al aprobar esta spec queda sustituido por
este:

> 2. **El candado es estructural, y cerrado sobre todo el estado propio de la
>    gráfica.** Cualquier host nuevo entre la raíz de la gráfica y la tarjeta
>    pone R1 en rojo, sea accesible o no, si existe en alguno de los cuatro
>    estados que monta R1: antes de medir, tras medir a 295 px, con el primer
>    día seleccionado y con la segunda métrica (`distanceM`). Esos cuatro
>    estados ponen cada uno de los tres `useState` de `WeeklyActivityChart`
>    (`chartWidth`, `selection` y `selectedMetricIndex`) a los dos lados de su
>    umbral. El `View` sin marcar también entra (sonda `wrapplain`). R1 no ve
>    dos clases de host, que son los huecos (D) de §Enmienda 1 › Zona ciega:
>    - el que depende de una **entrada externa** que R1 no varía. R1 monta la
>      semana entera medida, `NO_COMPARISON`, en español, sin `onSelectDay`,
>      con el tema claro y el movimiento reducido del mock, y en la plataforma
>      del preset de jest;
>    - el que depende de un valor de su estado propio que R1 **no muestrea**:
>      un ancho que no sea 0 ni 295, un día que no sea el primero o la tercera
>      métrica.
>
>    Hoy la raíz no depende de ninguna de esas entradas. No hay candado sobre
>    el texto del componente: el humano lo descartó el 2026-09-29. Su coste: un
>    envoltorio legítimo obliga a tocar el candado a sabiendas. Es el mismo
>    trato que firmó `#130 R2` para la fila.

### Sondas

La tabla completa, con el blob de cada mutación, está en [[tasks]] §E1 —
Sondas. Ninguna sonda de la ronda 1 cambia de veredicto. Cambian tres
recuentos, porque los tres `it` nuevos también ven las mutaciones. El humano
aceptó que subieran («Aceptar», 2026-09-29) sobre las cifras de la primera
redacción, que tenía dos `it` nuevos (rojo 7 y rojo 49). Con el cuarto `it`
suben un paso más:

| Sonda de la ronda 1 | Exigido en la ronda 1 (203) | Exigido tras la Enmienda 1 (206) | Por qué cambia |
|---|---|---|---|
| `wrapcard`, `presscard`, `wrapplain` | rojo 5: R1, por `toBe`, y los 4 de orden | **rojo 8**: los cuatro `it` de R1, por `toBe`, y los 4 de orden | el envoltorio existe en los cuatro estados |
| `hidewrap` | rojo 47 | **rojo 50**: 41 de la gráfica (33 por consulta y 8 por aserción) y los 9 de la Home | los tres `it` nuevos caen **por consulta** en su primera consulta, `weekly-activity-chart-layout` |
| `hexbare` | rojo 1 de 55 en `design-drift`, blob del test `378edd75` | igual, con blob del test `4fb93a34` | el test mutado ya lleva los tres `it` nuevos |
| `fragment`, `sibling`, `cardacc`, `cardpress`, `wrapinner`, `wrapmetric` | como en §Tabla de sondas | igual, sobre 206 | no cambia nada |

Entran además seis sondas exigidas de estado (`layoutwrap`, `layoutwrapctl`,
`selwrap`, `selwrapctl`, `metricwrap` y `metricwrapctl`) y las doce de los
huecos declarados, más `emptywrap`, con el veredicto de la tabla de §Zona
ciega.

### Fuera de alcance de la Enmienda 1

- **(D)** Las 12 filas «hueco (D)» de §Zona ciega: una raíz condicionada a otro
  ancho, a otro día seleccionado, a la tercera métrica, a datos que R1 no
  monta, a la comparación, a `onSelectDay`, al idioma, al tema, al movimiento
  reducido o a la plataforma. Premisa verificada: ninguna de esas entradas
  decide hoy la raíz, porque hay un solo `return (` y ningún `return`
  temprano.
- **(D)** Un candado sobre el texto del componente, que cerraría esas 12 filas.
  El humano contestó «No» el 2026-09-29.
- **(D)** Extraer un helper con el montaje de los cuatro `it`. Tocaría el `it`
  de la ronda 1 y rompería el `97 0` de R2 enmendado, punto 3.
- Siguen como estaban el (D) `sibling`, la (F) `wrapmetric` y las dos (N) de
  §Fuera de alcance.

### Qué firma el humano con esta enmienda

1. **R1 pasa de un `it` a cuatro**, en el mismo `describe`. El `it` de la ronda
   1 no se toca. Cuesta +3 tests.
2. **El punto 2 de §Qué firma queda sustituido** por el de §Punto 2 reescrito:
   el candado es cerrado sobre todo el estado propio de la gráfica, no sobre
   todas sus entradas. Las 12 filas «hueco (D)» de §Zona ciega quedan fuera a
   sabiendas: 9 entradas externas y 3 muestras. La Home ve tres de ellas de
   rebote (la comparación, `onSelectDay` y el movimiento reducido). El tema es
   una fila que la primera redacción no inventariaba.
3. **Los rojos versionados de la enmienda**: los de E1.1 y E1.2 son únicos, 1
   rojo en 1 suite cada uno, porque la Home no los ve. El de E1.3 son **2 rojos
   en 1 suite**: R1·4 y `R6 › desliza una única píldora…`, que cae de rebote
   con la misma mutación. No puede ser único: cualquier envoltorio que solo
   aparezca con otra métrica remonta el selector al cambiarla. En la ronda 1
   eran 5 en 2 suites.
4. **Tres recuentos de la ronda 1 cambian sin cambiar su veredicto**:
   `wrapcard`, `presscard` y `wrapplain` pasan de rojo 5 a rojo 8, `hidewrap`
   pasa de 47 a 50 y `hexbare` cambia de blob. Es un paso más que las cifras
   de la primera redacción que el humano aceptó (7 y 49).
5. **La historia de la ronda 1 se queda** (`4fb4481c`, `99629c30` y
   `40e40dfe`), sin rebase. La ronda 2 añade encima 7 commits: 6 de código y 1
   de evidencia. En [[traceability]], las filas de la ronda 1 conservan sus
   hashes y entran 4 filas nuevas.
6. **Sin gate de TalkBack**, igual que en la ronda 1: el árbol de producción
   acaba idéntico al de `origin/main`.
7. **El frontmatter sigue en `approved`**, como en #77. Hasta que se marque la
   casilla de abajo, la enmienda no existe para Codex.

### Firma de la Enmienda 1

- [ ] **Enmienda 1 (R1 y R2) aprobada por humano** (fecha: ____). Casilla
      propia. Al marcarla, el humano firma también los siete puntos de §Qué
      firma el humano con esta enmienda. Sin ella, Codex no toca nada y la
      ronda 1 sigue rechazada.

---

## Aprobación

- [x] **Aprobado por humano** (fecha: 2026-09-28) ← gate obligatorio antes de
      implementar. Al marcar esta casilla, el humano firma también los ocho
      puntos de §Qué firma el humano al aprobar esta spec, y el primero en
      particular: hacer R1 en vez de cerrar #132 como (N).

> **Esta feature tiene dos casillas**: esta, de la spec de la ronda 1, y la de
> §Enmienda 1 › Firma de la Enmienda 1, que esta no cubre. No hay gate de
> TalkBack (§Qué firma el humano, punto 6).
