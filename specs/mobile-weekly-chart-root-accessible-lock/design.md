---
feature: "mobile-weekly-chart-root-accessible-lock"
status: spec_ready       # draft | spec_ready | approved
tags: [spec, mobile, a11y, deuda]
---

# Diseño — [[mobile-weekly-chart-root-accessible-lock]] (#132)

> Ver [[requirements]] para los requisitos y [[../../docs/architecture|architecture]]
> para las capas. Esta feature solo añade un test a la capa de presentación
> móvil (`src/screens/home/`): no hay dominio, aplicación ni infraestructura
> implicados.

## Decisiones técnicas

- **R1 comprueba que la tarjeta es la raíz host con un centinela del test.**
  El test monta la gráfica dentro de un host propio,
  `<View testID="chart-parent">`, y asevera con `toBe` que
  `getByTestId('weekly-activity-card').parent?.props.testID` es
  `'chart-parent'`. Es el patrón de `#130 R2` (`row.parent?.props.testID`,
  `grep -n "row.parent" src/screens/home/weekly-activity-chart.test.tsx`)
  aplicado un nivel más arriba. El `TestInstance` de `test-renderer` 1.2.0, que
  es lo que devuelven las consultas de RNTL v14, solo tiene nodos host:
  - un `<>` alrededor de la tarjeta no crea nodo y el candado sigue verde
    (sonda `fragment`). No es un hueco, porque un fragmento no llega a TalkBack;
  - cualquier host entre el centinela y la tarjeta, sea `View accessible`,
    `Pressable` o un `View` sin marcar, cambia el padre y pone el candado en
    rojo por `toBe` (sondas `wrapcard`, `presscard` y `wrapplain`);
  - si el envoltorio oculta su subárbol (`no-hide-descendants`), la tarjeta
    deja de encontrarse y el rojo es **por consulta** (sonda `hidewrap`).
- **Por qué un centinela y no el padre que ya tiene la tarjeta.** Dentro de
  `renderChart`, el padre host de la tarjeta es `RNCSafeAreaProvider`, que
  llega con `HeroUINativeProvider` desde `ChartWrapper`, y su padre es el
  contenedor raíz del render. Aseverar sobre ese nodo ataría el candado a la
  implementación de una librería de terceros: una subida de `heroui-native` o
  de `react-native-safe-area-context` lo pondría en rojo sin que la gráfica
  cambiara. El centinela es del test, lleva un literal del test y no depende de
  nadie.
- **El `View` del centinela sale de `jest.requireActual`**, con la misma
  forma que ya usan las factorías de los mocks del test
  (`grep -n "jest.requireActual<typeof import('react-native')>" src/screens/home/weekly-activity-chart.test.tsx`).
  El test importa hoy de `react-native` solo `Platform`. Así el diff es un
  bloque añadido al final del fichero, sin tocar la cabecera de imports, lo que
  deja un solo hunk y hace medible que ningún `describe` anterior cambia
  ([[requirements]] R2.3). `bunx tsc --noEmit` y `bunx eslint` del test lo
  aceptan (medido).
- **El `it` renderiza sin `renderChart`.** `renderChart` no deja meter un nodo
  entre `ChartWrapper` y la gráfica, y cambiar su firma tocaría un helper que el
  resto de `describe` usa. R1 monta `ChartWrapper`, el centinela y la gráfica a
  mano, con `language="es"` y `NO_COMPARISON`, que son los valores por defecto
  de `renderChart`. No dispara el `layout`: nada de la raíz depende del ancho
  medido del gráfico, y la tarjeta y su padre existen desde el primer render.
- **Un solo escenario, la semana entera medida**
  (`makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70])`), el mismo de
  `#130`. La gráfica tiene un único `return (`, con la tarjeta como raíz, y el
  estado vacío pinta dentro de esa misma tarjeta
  (`grep -c '<Card testID="weekly-activity-card"' src/screens/home/weekly-activity-chart.tsx`
  da 1).
- **El rojo es una mutación de producción versionada** (C4, vía **b**),
  porque la base ya cumple: `wrapcard`, un `<View accessible>` alrededor de la
  tarjeta, que es justo el caso de la observación 1 del veredicto de #130. El
  verde la revierte con `git checkout HEAD~1 --`, y la gráfica acaba en su blob
  de base.
- **El rojo de la suite no es único, y está medido.** Todo host alrededor de la
  tarjeta la saca de `home-content.children`, y eso lo ven ya cuatro `it` de
  orden de la Home en `src/screens/home/index.test.tsx`, por `toEqual`
  ([[requirements]] §Premisas). El rojo versionado da por tanto **5 rojos en 2
  suites**: R1 y esos cuatro, que ya son rojos hoy con la misma mutación. En
  #130 el rojo era único porque sus mutaciones no movían la tarjeta. Aquí no
  existe una mutación que ponga rojo R1 sin mover la tarjeta, porque eso es
  justo lo que R1 comprueba.
- **Las sondas se miden con la gráfica y la Home en la misma corrida**
  (`bunx jest --runTestsByPath` con los dos ficheros, `Test Suites: 2`). Medir
  solo la gráfica es lo que dejó a #130 creyendo que no había candado. Las tres
  suites que leen la gráfica como texto se midieron también y no ven ninguna
  sonda de la gráfica, así que no hace falta repetirlas en cada sonda.
- **Un `describe` con el prefijo `#132 R1:`**, al final del test, después
  del de `#130 R2`. El `#` va siempre seguido de un espacio y `R<n>`: es la
  excepción de `HEX_LITERAL` (`#(?!\d{2,3} R\d)…`) en
  `src/__tests__/design-drift.test.ts`, y un `#132` suelto rompe `#68 R18`
  (medido, sonda `hexbare`).
- **Los literales, del test.** `'chart-parent'` y `'weekly-activity-card'` se
  escriben a mano. `chart-parent` no existe hoy en `src/`
  (`grep -rn "chart-parent" src` vacío), así que no choca con ningún `testID`
  de producción.

## Qué cierra cada candado tras #132

| Tramo | Candado |
|---|---|
| El host que monta la gráfica → la tarjeta | `#132 R1` (`parent`) |
| Las props de la tarjeta | `#74 R2` (lista cerrada de claves) |
| La tarjeta → la fila | `#130 R2` (`row.parent`) |
| Las props de la fila | `#130 R1` (lista cerrada de claves) |
| La fila → las siete columnas | `#130 R2` (`row.children`) |
| Cada columna | `#68 R9` y `#68 R8` |

Los otros hijos de la tarjeta (la cabecera, el selector y el gráfico) quedan
sin candado de estructura: es la **(F)** de [[requirements]] §Fuera de alcance.

## Archivos afectados

- `mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`
  (presentación, tests): un `describe` nuevo al final. Pasa de 43 a 44 tests.
- `mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`
  (presentación): **solo** en el commit rojo, con la mutación que el verde
  revierte. Diff acumulado vacío.
- `progress/impl_mobile-weekly-chart-root-accessible-lock.md` y
  `specs/mobile-weekly-chart-root-accessible-lock/traceability.md`: la
  evidencia.

## Coordinación

- **#131 `mobile-weekly-day-row-layout-lock`** (`pending`, sin branch en
  `origin`) toca el mismo test. Su alcance es la forma (`flex-row`) y el
  `padding` de la fila, y #132 no los mira ni los fija, así que no lo impide.
  Las dos añaden su bloque al final del fichero: quien mergee segunda resuelve
  un conflicto trivial al final, conservando los dos bloques, y vuelve a medir.
  Si #131 mergea antes de que Codex arranque, el blob de base del test cambia y
  [[tasks]] §Antes de tocar nada lo para.
- **#100 `mobile-alert-detail-screen` (sesión Backend, en `wt-backend`)** no
  toca ninguno de los dos ficheros ni nada bajo `src/screens/home/` (medido
  contra su `HEAD` local, `c5a54b94`). Sí toca `src/__tests__/design-drift.test.ts`
  y añade suites de alertas, así que si mergea antes, la suite de base tiene
  otras cifras: el delta exigido sigue siendo +1 test y +0 suites sobre lo
  medido.
- **La Home no se toca.** Los cuatro `it` de orden de `index.test.tsx` que
  también ven la mutación siguen como están ([[requirements]] §Fuera de
  alcance).

## Alternativas descartadas

- **No hacer nada y cerrar #132 como (N)**, porque la Home ya lo ve. Es la
  alternativa seria, y la decide el humano en el gate ([[requirements]] §Qué
  firma, punto 1). Esta propuesta la descarta por tres motivos:
  - el tema de esos cuatro `it` es el orden de las secciones de la Home, no la
    accesibilidad de la gráfica, y la ven solo de rebote;
  - si la Home cambia cómo monta la gráfica (con un envoltorio de sección, como
    `reminders-section` en #70), esos `it` se reescriben contra el envoltorio
    nuevo y la raíz de la gráfica pierde su único candado sin que nadie lo note;
  - las sondas de la gráfica se miden con `--runTestsByPath` sobre su propio
    test, y así es como el `reviewer` de #130 concluyó que no había candado.
- **Aseverar sobre el padre real de la tarjeta en `renderChart`**
  (`RNCSafeAreaProvider`). Frágil ante una subida de terceros (§Decisiones).
- **Una lista de props prohibidas en los ancestros de la tarjeta** (ninguno
  con `accessible`, `aria-*`, `role`…). Es una lista abierta: la prop que no se
  lista pasa, y un `Pressable` sin marcar, que es accesible por defecto,
  obligaría a enumerar cómo lo es. La estructura cerrada es más estricta y más
  corta.
- **Añadir un parámetro a `renderChart`** para meter el centinela. Toca un
  helper compartido por los `describe` de #68, #74 y #130, que el encargo quiere
  intactos.
- **Importar `View` en la cabecera del test.** Funciona igual, pero abre un
  segundo hunk en la cabecera y hace menos directa la prueba de que el diff es
  solo un bloque añadido.
- **Candar también los otros hijos de la tarjeta** (la cabecera, el selector y
  el gráfico). Es otro hueco, con otro candado, y queda como **(F)**.
- **Un gate de TalkBack.** El árbol de producción acaba idéntico al de
  `origin/main`: no hay nada nuevo que oír en un dispositivo.
