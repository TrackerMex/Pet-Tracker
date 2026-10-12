---
feature: "mobile-alerts-grouped-and-detail-map"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-alerts-grouped-and-detail-map]]

> Disciplina TDD: cada tarea de R1 a R15 hace (1) test rojo, (2) implementación
> mínima y (3) refactor, en ese orden. Rutas de código relativas a
> `mobile-pet-tracker/` salvo que se diga otra cosa. Las constantes de la base
> están en requirements.md §Contexto y base medida, y las que caducan, en
> §Medir al arrancar.

## Reglas de todas las tareas

- **Rutas.** Los comandos se lanzan desde la raíz del repo; los de jest
  entran antes en `mobile-pet-tracker/`. Ninguna ruta de esta feature lleva
  paréntesis. Si alguna vez hay que pasar `src/app/(tabs)/…` a jest, se
  escapa como `src/app/\(tabs\)/…`, porque jest lo lee como regex y, sin
  escapar, se salta el fichero en silencio con `exit=0`.
- **Cómo medir.** Mide cada paso con el fichero concreto y **sin pipe**, para
  que el código de salida sea el de jest, y comprueba que `Tests:` cuenta más
  de 0:

  ```bash
  cd mobile-pet-tracker && bunx jest src/utils/alert-sections.test.ts; echo "exit=$?"
  ```

- **Antes de cada commit verde** corre, sin pipe,
  `cd mobile-pet-tracker && bunx tsc --noEmit; echo "exit=$?"` y
  `cd mobile-pet-tracker && bunx expo lint --no-cache; echo "exit=$?"`.
  Los dos tienen que dar `exit=0`.
- **Gestor de paquetes.** Usa `bun` y `bunx`, nunca `npm` ni `npx`. Esta
  feature no instala nada.
- **Commits test-primero.** De R1 a R15, cada tarea deja como mínimo **dos
  commits**, con la descripción en inglés:
  1. `test(mobile-alerts-grouped-and-detail-map): #170 R<n> red <what>`: solo
     tests (y las filas de candados agregados que diga la tarea), medido en
     rojo antes de commitear. El rojo es el que dice la tabla de cada tarea:
     por **consulta** (el nodo no existe y falla `getBy*`/`findBy*`), por
     **módulo** (`Cannot find module`) o por **aserción** (el nodo o el valor
     existe pero no cuadra).
  2. `feat(mobile-alerts-grouped-and-detail-map): #170 R<n> <what>`: la
     implementación, medida en verde.

  Un commit que mezcle tests e implementación incumple C4 de
  `CHECKPOINTS.md`. El refactor, si lo hay, va en un tercer commit
  `refactor(mobile-alerts-grouped-and-detail-map): …`.
- **Lo que nace en verde.** Algunos `it` nacen verdes porque afirman una
  ausencia o una rama que ya cumple una R anterior. Cada tarea dice cuáles y
  con qué **sonda** se demuestra que muerden (ver «Sondas»).
- **RNTL 14.** `fireEvent` es asíncrono: siempre
  `await fireEvent.press(…)` y `await fireEvent(lista, 'onEndReached')`. El
  render se espera como hacen los `it` vecinos del mismo fichero
  (`await renderDetail()`, `await renderAlerts()`, `await render(…)`). Si
  algún test usa `renderRouter`, también va con `await`.
- **Esperas.** Rige `docs/conventions.md` §Esperas sobre el árbol renderizado:
  se espera con `findByTestId` o `waitFor` sobre el nodo o sus props, **nunca
  sobre el contador de un mock**. Toda aserción de ausencia se ancla antes a
  la aparición de un nodo positivo del mismo escenario. `not.toHaveBeenCalled`
  se afirma al final, tras ese ancla, nunca como espera.
- **Zona horaria.** Los tests que dependen de la hora local la fijan con
  `const hostProcess = process.getBuiltinModule('process');` y
  `hostProcess.env.TZ = '<zona>'`, guardando el valor previo y
  restaurándolo en un `finally` o en el `afterEach` (borrándolo si era
  `undefined`), como `src/screens/meal-schedule/index.test.tsx`. Jest copia
  `process.env`: `process.env.TZ` **no** cambia la zona de `Date`.
- **Reloj de la lista.** La lista calcula `now` con `alerts.dataUpdatedAt`
  (B8). Para fijarlo, `jest.spyOn(Date, 'now').mockReturnValue(<ms>)` en el
  `beforeEach` y `jest.restoreAllMocks()` en el `afterEach`, como el
  `describe('#78 R6: …')` del mismo fichero.
- **Dobles por intención.** Cada doble se describe por lo que tiene que hacer;
  antes de escribirlo, comprueba contra el fichero real qué exporta y qué
  importa la pantalla. Los nuevos de esta feature (todos en
  `src/screens/alert-detail/index.test.tsx`, a nivel de módulo):
  - `../../components/pet-map`: `PetMap` es un componente host (`View` de
    `react-native` obtenido con `jest.requireActual`) que recibe **todas** las
    props de `PetMap` y lleva `testID="pet-map-double"`. Sin
    `jest.requireActual('../../components/pet-map')`: arrastraría
    `expo-maps`. La pantalla solo importa de ese módulo `PetMap` y tipos.
  - `../../api/geofences`: `jest.requireActual` del módulo más
    `listGeofences: jest.fn()`. En el `beforeEach` de nivel superior del
    fichero, por defecto devuelve una promesa que nunca resuelve.
  - `uniwind`: `jest.requireActual('uniwind')` más un `useUniwind` que
    devuelve `{ theme: mockTheme, hasAdaptiveThemes: false }`, con
    `let mockTheme: 'light' | 'dark'` reiniciado a `'light'` en el
    `beforeEach` de nivel superior (precedente:
    `src/screens/geofence-editor/index.test.tsx`).
  - `../../providers/selected-pet-provider`: `useSelectedPet: jest.fn()`
    (precedente: `src/screens/add-pet/index.test.tsx`). Su valor,
    `{ selectedPetId: 'pet-1', selectPet: mockSelectPet }`, se fija en el
    `beforeEach` de nivel superior, porque desde R15 el CTA lo usa en todos
    los `it` que cargan una alerta.
- **Caché sembrada.** Donde la tarea lo pide, el `it` monta su propio cliente
  como el `it` `'espera una recarga de caché vieja antes de salir y luego
  pinta la alerta'`: `createQueryClient(jest.fn(), 60_000)`,
  `queryClient.setQueryData(geofenceKeys.list('pet-1'), <estado>)`,
  `QueryClientProvider` + `DetailWrapper`, `listAlerts` resuelve la página con
  la alerta y `listGeofences` queda pendiente. Así el estado de la zona está
  en el primer render y las ausencias se pueden afirmar tras ver el mapa.
- **Literales.** Los literales de copy, de clases, de coordenadas y de rutas
  se copian byte a byte de requirements.md y de esta página. **Ningún test
  importa el valor que comprueba**: nada de `TABULAR_NUMS`,
  `CONTINUOUS_CORNER`, `ALERT_TYPE_META` ni `zoomForRadius` en las
  aserciones. Los valores son `{ fontVariant: ['tabular-nums'] }` y
  `{ borderCurve: 'continuous' }`.
- **Estilos en los tests.** Ningún test nuevo usa `StyleSheet`, hex ni clases
  arbitrarias: design-drift también recorre los tests. Para «aplanar» un
  `style`, `[node.props.style].flat(Infinity)` y revisar cada objeto.
- **«Es o contiene».** `within(nodo)` no mira el propio nodo. Donde la tarea
  pide «el hijo que es o contiene `X`», la comprobación es
  `hijo.props.testID === 'X' || within(hijo).queryByTestId('X') !== null`.
- **Its previos.** Solo se reescriben los dos que se nombran: la clase exacta
  de `#100 R3` › `'respeta las métricas A11 bajo cabecera nativa'` (T6, B17)
  y el `toEqual` de `#100 R2` ›
  `'le da la cabecera nativa de #95 R4 con el título del detalle'` (T9, B18).
  Si otro `it` previo pasa a rojo, **para** y escríbelo en el progress.
- **Comentarios.** En código de producción, toda cita a la feature se escribe
  `#170 R<n>`, nunca `#170` suelto.
- **Sondas.** Se hacen con el árbol limpio, justo después del commit que
  nombra la tarea, y solo se mide el fichero de test que nombra la sonda.
  - Se planta la mutación en el código de producción, se mide (tiene que dar
    rojo en los `it` que dice la tarea) y se revierte con
    `git checkout HEAD -- <fichero>`.
  - Comprueba con `git diff --cached --quiet && git diff --quiet; echo "limpio=$?"`,
    que tiene que dar `limpio=0`.
  - Nunca uses `git checkout <commit> -- <fichero>`: deja el cambio en el
    índice.
  - Apunta cada sonda y su resultado en
    `progress/impl_mobile-alerts-grouped-and-detail-map.md`.
- **Trazabilidad.** Tras el commit verde de cada tarea, rellena su fila en
  `specs/mobile-alerts-grouped-and-detail-map/traceability.md`.
- **Lista cerrada.** Solo se tocan los ficheros de design.md §Archivos
  afectados, más `traceability.md` y el progress de arriba.
- **Si algo no cuadra con la spec, para.** Escríbelo en el progress y no
  improvises.

## T0 — Arranque

- [ ] Rama `feature/170-mobile-alerts-grouped-and-detail-map`, con
  `origin/main` integrado por **merge** (nunca rebase: #167, #168, #169 y #171
  tocan los mismos candados agregados).
- [ ] M1: #166 en `done`. Si no, **para**.
- [ ] M2 a M6 de requirements.md §Medir al arrancar, con su salida apuntada en
  el progress.
- [ ] Mide en verde, sin pipe, y apunta el `Tests:` de cada uno:
  `src/screens/alerts/index.test.tsx`,
  `src/screens/alert-detail/index.test.tsx`,
  `src/app/__tests__/layout.test.tsx`,
  `src/providers/__tests__/language-provider.test.tsx`,
  `src/__tests__/ui-language.test.ts`,
  `src/__tests__/consistency-classnames.test.ts`,
  `src/__tests__/design-drift.test.ts`.

## Orden

T1 (catálogo) → T2 y T7 (funciones puras) → T3, T4, T5 (lista) → T6, T8, T9,
T10 (detalle) → T11 a T14 (ramas, nacen verdes tras T10) → T15 (CTA) → T16
(comprobación de candados) → T17 (humano). T7 puede ir justo después de T2. Ningún
`it` afirma un nodo que crea una tarea posterior: el orden completo del detalle
con el CTA se comprueba en T15, no en T8.

## T1 — R1: las siete claves existen en los dos idiomas

- [ ] (1) Test rojo — `src/providers/__tests__/language-provider.test.tsx`:
  - `describe('#170 R1: claves de alertas agrupadas y mini-mapa')` ›
    `it('#170 R1: declara los 7 pares exactos y su registro')`, con la forma
    de `#158 R1` del mismo fichero: tabla `[clave, en, es]` con las siete
    filas de requirements.md §Copy nuevo; por fila, `en[clave]` y
    `es[clave]` exactos y, en `specs/mobile-ui-language/design.md`, una fila
    que case
    `` new RegExp('\\| — \\| `' + clave + '`[^\\n]*← añadida por #170 \\(R1\\)') ``.
  - En la expresión de `expect(englishKeys).toHaveLength(`, una línea
    `+ 7 // #170 R1` bajo la última que haya (M3).
  - Rojo esperado: por aserción (`toBe` sobre `undefined`, la regex sin
    casar y la longitud 7 por debajo).
- [ ] (2) `src/i18n/catalog.ts`: las siete claves en `en` y en `es`.
  `specs/mobile-ui-language/design.md`: sección
  `### §2.N — Añadidos por #170 — Alertas agrupadas y mini-mapa` (N de M5)
  con las siete filas.
- [ ] (3) Refactor: ninguno previsto.

## T2 — R2: `alertSection` en hora local

- [ ] (1) Test rojo — `src/utils/alert-sections.test.ts` (nuevo):
  - `describe('#170 R2: alertSection en hora local')` ›
    `it.each(tabla)('$id: $tz, ahora $now, abierta $openedAt → $expected')`.
    En cada fila, dentro del `it`, se fija `TZ` con `hostProcess`, se llama a
    `alertSection(openedAt, new Date(now))` y se restaura en el `finally`.
  - Tabla (verificada con node; «mutante» = la implementación errónea que esa
    fila tumba):

    | id | `tz` | `now` | `openedAt` | `expected` | Mutante que tumba |
    |---|---|---|---|---|---|
    | A1 | `America/Mexico_City` | `2027-01-01T05:30:00.000Z` | `2027-01-01T05:00:00.000Z` | `today` | — (base) |
    | A2 | `America/Mexico_City` | `2027-01-01T05:30:00.000Z` | `2026-12-31T06:30:00.000Z` | `today` | medianoche en UTC |
    | A3 | `America/Mexico_City` | `2027-01-01T05:30:00.000Z` | `2026-12-31T05:59:59.999Z` | `week` | mes fijo |
    | A4 | `America/Mexico_City` | `2027-01-01T05:30:00.000Z` | `2026-12-25T06:00:00.000Z` | `week` | UTC, `día - 5` |
    | A5 | `America/Mexico_City` | `2027-01-01T05:30:00.000Z` | `2026-12-25T05:59:59.999Z` | `earlier` | ventana de 7 días (`día - 7`) |
    | B1 | `America/Mexico_City` | `2027-01-02T16:00:00.000Z` | `2027-01-02T06:00:00.000Z` | `today` | — (borde de hoy) |
    | B2 | `America/Mexico_City` | `2027-01-02T16:00:00.000Z` | `2027-01-02T05:59:59.999Z` | `week` | UTC, año fijo |
    | B3 | `America/Mexico_City` | `2027-01-02T16:00:00.000Z` | `2026-12-27T06:00:00.000Z` | `week` | año fijo |
    | B4 | `America/Mexico_City` | `2027-01-02T16:00:00.000Z` | `2026-12-27T05:59:59.999Z` | `earlier` | UTC, año fijo, `día - 7` |
    | C1 | `America/Mexico_City` | `2026-03-03T16:00:00.000Z` | `2026-02-25T06:00:00.000Z` | `week` | mes fijo |
    | C2 | `America/Mexico_City` | `2026-03-03T16:00:00.000Z` | `2026-02-25T05:59:59.999Z` | `earlier` | UTC, mes fijo, `día - 7` |
    | D1 | `America/New_York` | `2026-03-10T14:00:00.000Z` | `2026-03-04T04:30:00.000Z` | `earlier` | `startToday - 6 × 86 400 000` (DST), UTC |
    | D2 | `America/New_York` | `2026-03-10T14:00:00.000Z` | `2026-03-04T05:00:00.000Z` | `week` | — (borde con DST) |
    | F1 | `America/Mexico_City` | `2026-03-03T16:00:00.000Z` | `2026-03-03T18:00:00.000Z` | `today` | «futuro = anteriores» |
    | N1 | `America/Mexico_City` | `2026-03-03T16:00:00.000Z` | `no-es-fecha` | `earlier` | `NaN` sin tratar |

  - Rojo esperado: por módulo (`Cannot find module './alert-sections'`).
- [ ] (2) `src/utils/alert-sections.ts`: `export type AlertSection = 'today' |
  'week' | 'earlier'` y `export function alertSection(openedAt: string, now:
  Date): AlertSection`, según R2.
- [ ] (3) Refactor: ninguno previsto.

## T3 — R3: la lista se agrupa por sección

- [ ] (1) Test rojo — `src/screens/alerts/index.test.tsx`:
  - `describe('#170 R3: agrupa la lista en Hoy, Esta semana y Anteriores')`.
    `beforeEach`: `TZ = 'America/Mexico_City'` con `hostProcess` (guardando
    el previo), `Date.now` fijado a `Date.parse('2027-01-02T16:00:00.000Z')`
    (sábado 2 de enero de 2027, 10:00 local) y `useAuth` como en
    `#78 R7`. `afterEach`: restaura `TZ` y `jest.restoreAllMocks()`.
  - Fixture `S`, en este orden de servidor:
    `earlier-closed` (`closed`, `2026-12-26T12:00:00.000Z`),
    `today-acked` (`acked`, `2027-01-02T15:00:00.000Z`),
    `earlier-open` (`open`, `2026-12-20T12:00:00.000Z`),
    `week-open` (`open`, `2027-01-01T12:00:00.000Z`),
    `today-open` (`open`, `2027-01-02T07:00:00.000Z`).
  - `it('ordena por sección y, dentro, abiertas primero en el orden del servidor')`:
    `props.data` de `alerts-list`, mapeado a `id`, es
    `['today-open', 'today-acked', 'week-open', 'earlier-open', 'earlier-closed']`.
    Rojo por aserción (hoy sale
    `['earlier-open', 'week-open', 'today-open', 'earlier-closed', 'today-acked']`).
  - `it('pinta una cabecera por sección con su copy en español')`: cada
    `alerts-section-today|week|earlier` aparece **una** vez
    (`getAllByTestId(…)` de longitud 1), con texto `Hoy` / `Esta semana` /
    `Anteriores`, `accessibilityRole` `'header'` y `className` exacto
    `text-xs font-bold uppercase text-muted`. Rojo por consulta.
  - `it('pinta las cabeceras en inglés')`, con `renderAlertsInEnglish`:
    `Today` / `This week` / `Earlier`. Rojo por consulta.
  - `it('envuelve cada cabecera con la primera fila de su sección en un View gap-4')`:
    para las tres secciones, el padre de la cabecera tiene `className` exacto
    `gap-4` y `within(padre)` encuentra `alert-row-today-open`,
    `alert-row-week-open` y `alert-row-earlier-open` respectivamente. Rojo
    por consulta.
  - `it.each([['today', …], ['week', …], ['earlier', …]])('omite la cabecera de %s cuando la sección queda vacía', …)`:
    tres fixtures, cada una sin filas de esa sección; ancla positiva = la
    primera fila visible; luego `queryByTestId('alerts-section-<sección>')`
    es `null`. **Nace verde** (hoy no hay cabeceras).
  - `it('pinta cada cabecera una sola vez al cargar la página siguiente')`:
    página 1 = `today-1` (`open`, `2027-01-02T14:00:00.000Z`) y `week-1`
    (`open`, `2026-12-30T12:00:00.000Z`), `nextCursor: 'c1'`; página 2 =
    `week-2` (`acked`, `2026-12-29T12:00:00.000Z`) y `earlier-1` (`open`,
    `2026-12-01T12:00:00.000Z`). `await fireEvent(lista, 'onEndReached')`
    como `#78 R9`, espera a que `props.data` tenga 4 filas y afirma el orden
    `['today-1', 'week-1', 'week-2', 'earlier-1']` y
    `getAllByTestId('alerts-section-week')` de longitud 1. Rojo por consulta.
  - `it('no reordena al marcar leída una fila abierta')`: con `S`,
    `ackAlert` resuelve el `ok` que usan los `it` de `#78 R8`;
    `await fireEvent.press(getByTestId('alert-row-today-open-ack'))`, espera
    a `alert-row-today-open-status` y afirma que `props.data` sigue en el
    orden del primer `it`. Rojo por aserción (orden de hoy).
  - Candado agregado (R16) en este mismo commit: tres filas en `R12_ALERTS`
    de `src/__tests__/ui-copy-table.ts`,
    `{ file: 'src/screens/alerts/index.tsx', key: 'alerts.sectionToday' }`
    y las de `alerts.sectionThisWeek` y `alerts.sectionEarlier`, con
    `// #170 R16`. Rojo por aserción en `ui-language.test.ts` ›
    `'registra cada ocurrencia de la pantalla'` (0 ocurrencias).
- [ ] (2) `src/screens/alerts/index.tsx` según design.md D2: orden por sección
  sobre `fetched`, cabecera en `renderItem` para la primera fila de cada
  sección, `t('alerts.sectionToday')`, `t('alerts.sectionThisWeek')` y
  `t('alerts.sectionEarlier')` literales.
- [ ] (3) Refactor: ninguno previsto.
- [ ] Sonda T3-a: en la pantalla, pinta siempre las tres cabeceras (aunque la
  sección esté vacía). Rojo esperado: las tres filas de `'omite la cabecera
  de %s …'`.

## T4 — R4: el contador «N nuevas»

- [ ] (1) Test rojo — `src/screens/alerts/index.test.tsx`:
  - `describe('#170 R4: cuenta las alertas nuevas')`, con `useAuth` y
    `EXPO_PUBLIC_API_URL` como `#78 R7`.
  - `it.each` `'no pinta el contador con 0 nuevas: %s'`, cuatro filas, cada
    una con su ancla positiva: `carga` (`listAlerts` pendiente, ancla
    `alerts-loading`), `error` (`{ kind: 'error' }`, ancla `alerts-error`),
    `vacía` (`items: []`, ancla `alerts-empty`), `todas leídas` (una `acked`
    y una `closed`, ancla su fila). Después, `queryByTestId('alerts-new-count')`
    es `null`. **Nacen verdes.**
  - `it('pinta «1 nueva» con una abierta')`: texto de
    `alerts-new-count-text` = `1 nueva`. Rojo por consulta.
  - `it('pinta «1 new» en inglés')`. Rojo por consulta.
  - `it('suma las abiertas de todas las páginas cargadas')`: página 1 con dos
    `open` y una `acked`, `nextCursor: 'c1'`; espera `2 nuevas`;
    `await fireEvent(lista, 'onEndReached')` con página 2 de una `open`;
    espera `3 nuevas`. Rojo por consulta.
  - `it('pinta «2 new» en inglés')`. Rojo por consulta.
  - `it('baja al marcar leída y desaparece en 0')`: dos `open` (`a`, `b`);
    `ackAlert` resuelve `ok`; ack de `a` → espera `1 nueva`; ack de `b` →
    espera `alert-row-b-status` y afirma `queryByTestId('alerts-new-count')`
    `null`. Rojo por consulta.
  - `it('pinta el contador como hermano anterior de la lista con su anatomía')`:
    los dos primeros hijos de `screen-alerts` son `alerts-new-count` y
    `alerts-list`, en ese orden; `alerts-new-count` tiene `className` exacto
    `mx-6 mt-6 self-start rounded-full bg-danger px-3 py-1` y un único hijo,
    `alerts-new-count-text`, con `className` exacto
    `text-xs font-bold text-danger-foreground` y `style` igual a
    `{ fontVariant: ['tabular-nums'] }`. Rojo por consulta.
  - Candados agregados (R16) en este commit:
    - `R12_ALERTS`: filas de `alerts.newOne` y `alerts.newMany` en
      `src/screens/alerts/index.tsx`. Rojo por aserción (0 ocurrencias).
    - `consistency-classnames` `#62 R15`: fila
      `[join('screens', 'alerts', 'index.tsx'), 1]` y `+ 1` en la suma de
      `#69 R10` (M4). Rojo por aserción en el `it.each` de la fila (falta el
      `import` de `TABULAR_NUMS`).
- [ ] (2) Pantalla según design.md D3: recuento sobre `rows`, `View` antes
  del `FlatList`, `t('alerts.newOne')` y `t('alerts.newMany', { count })`
  literales en dos ramas.
- [ ] (3) Refactor: ninguno previsto.
- [ ] Sonda T4-a: pinta siempre el contador con el recuento, también con 0.
  Rojo esperado: las cuatro filas de `'no pinta el contador con 0 nuevas'`.

## T5 — R5: el borde de severidad en la fila

- [ ] (1) Test rojo — `src/screens/alerts/index.test.tsx`:
  - `describe('#170 R5: la fila abierta lleva el borde de su tipo')`.
  - `it.each` `'abierta $type: border-2 y $border, con $iconName y $labelKey'`,
    tres filas: `geofence_exit`/`border-danger`/`LocationSlash`/
    `alerts.typeGeofenceExit`/`bg-danger-soft`;
    `battery_low`/`border-warning-strong`/`BatteryLow`/`alerts.typeBatteryLow`/
    `bg-warning-soft`; `mystery_type`/`border-muted`/`Bell`/
    `alerts.typeUnknown`/`bg-default`. Las clases de `alert-row-<id>`
    (partidas por espacios) contienen `border-2` y `$border` y no contienen
    `border-border`; icono, tinta, fondo y etiqueta se comprueban con el mismo
    idioma que el `it.each` de `#78 R6`. Rojo por aserción (`border-2`).
  - `it.each` `'%s: sin borde de severidad'`, dos filas (`acked`, `closed`,
    tipo `geofence_exit`): contienen `border` y `border-border`, no contienen
    `border-2` ni `border-danger`. **Nacen verdes.**
- [ ] (2) `src/utils/alert-meta.ts`: campo `border` (design.md D4). Pantalla:
  añade `` ` border-2 ${meta.border}` `` a la `Card` de la fila solo cuando la
  fila mostrada está abierta.
- [ ] (3) Refactor: ninguno previsto.
- [ ] Sonda T5-a: aplica el borde de tipo también a las filas no abiertas.
  Rojo esperado: las dos filas de `'%s: sin borde de severidad'`.

## T6 — R6: el borde de severidad en el detalle

- [ ] (1) Test rojo — `src/screens/alert-detail/index.test.tsx`:
  - `describe('#170 R6: la tarjeta abierta lleva el borde de su tipo')`.
  - `it.each` `'abierta $type: $className'`, `className` exacto de
    `alert-detail-card` (medido con `twMerge`, B19):
    `geofence_exit` → `rounded-card bg-surface p-4 shadow-sm min-h-44 gap-3 border-2 border-danger`;
    `battery_low` → `rounded-card bg-surface p-4 shadow-sm min-h-44 gap-3 border-2 border-warning-strong`;
    `mystery_type` → `rounded-card bg-surface p-4 shadow-sm min-h-44 gap-3 border-2 border-muted`.
    Rojo por aserción.
  - `it.each` `'%s: conserva la tarjeta sin borde de severidad'`, `acked` y
    `closed`: exacto
    `rounded-card border border-border bg-surface p-4 shadow-sm min-h-44 gap-3`.
    **Nacen verdes.**
  - Reescritura nombrada: en `#100 R3` ›
    `'respeta las métricas A11 bajo cabecera nativa'`, la cadena de B17 pasa
    a `rounded-card bg-surface p-4 shadow-sm min-h-44 gap-3 border-2 border-danger`.
    Rojo por aserción.
- [ ] (2) Pantalla: añade `` ` border-2 ${meta.border}` `` a la clase de la
  `Card` del detalle cuando `alert.status === 'open'`.
- [ ] (3) Refactor: ninguno previsto.
- [ ] Sonda T6-a: aplica el borde siempre. Rojo esperado: las dos filas de
  `'%s: conserva la tarjeta …'`.

## T7 — R7: posición, distancia y formato

- [ ] (1) Test rojo — `src/utils/alert-location.test.ts` (nuevo):
  - `describe('#170 R7: alertPosition valida la posición del payload')` ›
    `it.each` con las doce filas de la tabla de R8. `alertPosition(payload)`
    es `null` en las diez filas «no»; en `borde válido` es
    `{ latitude: 90, longitude: -180 }` y en `real del motor` es
    `{ latitude: 19.4342637, longitude: -99.1332 }` (`toEqual`: sin `ts` ni
    `flags`).
  - `describe('#170 R7: distanceMeters')` › `it.each`, con
    `toBeCloseTo(valor, 3)`:
    `(0, 0)→(0, 0.001)` = `111.1949`; `(0, 0)→(1, 0)` = `111194.9266`;
    `(60, 0)→(60, 0.002)` = `111.1949` (tumba la falta del coseno);
    `(19.4326, -99.1332)→(19.4326, -99.1332)` = `0`.
  - `describe('#170 R7: formatDistance')` › `it.each`:
    `0` → `0 m`; `0.4` → `0 m`; `84.6` → `85 m`; `999.4` → `999 m`;
    `999.5` → `1.0 km`; `1238.46` → `1.2 km`; `1250` → `1.3 km`;
    `12345.6` → `12.3 km`.
  - Rojo esperado: por módulo (`Cannot find module './alert-location'`).
- [ ] (2) `src/utils/alert-location.ts` según R7 y design.md D5. Importa solo
  el tipo `MapCoordinates` de `../components/pet-map` (`import type`).
- [ ] (3) Refactor: ninguno previsto.

## T8 — R8: el mini-mapa

- [ ] (1) Test rojo — `src/screens/alert-detail/index.test.tsx`. En este
  commit entran los cuatro dobles de «Dobles por intención» y sus
  `beforeEach` de nivel superior. Constantes del fichero:
  `POS_OUT = { lat: 19.4342637, lng: -99.1332 }` y el payload real
  `{ position: { ...POS_OUT, ts: '2026-09-11T10:00:00.000Z', flags: [] }, geofenceName: 'Casa' }`.
  - `describe('#170 R8: pinta el mini-mapa con la posición de la alerta')`.
  - `it.each` `'$fila: sin mapa'`, las diez filas «no» de la tabla de R8:
    ancla `alert-detail-card`; después `alert-detail-map` y
    `alert-detail-distance` ausentes y `listGeofences` sin llamar. **Nacen
    verdes.**
  - `it.each` `'$fila: con mapa'`, las dos filas «sí»: `alert-detail-map`
    con `className` exacto `h-52 overflow-hidden rounded-card`, `style` igual
    a `{ borderCurve: 'continuous' }` y un único hijo, `pet-map-double`, con
    `center` y `marker` iguales a la posición esperada (`toEqual`),
    `polylines` igual a `[]` y `colorScheme` `'light'`. Rojo por consulta.
  - `it('pasa colorScheme dark con el tema oscuro')`: `mockTheme = 'dark'`,
    payload real → `colorScheme` `'dark'`. Rojo por consulta.
  - `it('pinta el mapa tras la tarjeta y antes del ack')`: alerta abierta con
    payload real; entre los hijos del contenedor (`alert-detail-card` →
    padre), índice del que es `alert-detail-card` < índice del que es
    `alert-detail-map` < índice del que es o contiene `alert-detail-ack`
    (regla «Es o contiene»). Rojo por consulta.
  - Candado agregado (R16): `consistency-classnames` `#62 R14`, fila
    `[join('screens', 'alert-detail', 'index.tsx'), 1]` y `+ 1` en la suma
    (M4). Rojo por aserción (falta el `import` de `CONTINUOUS_CORNER`).
- [ ] (2) Pantalla: `alertPosition(alert.payload)`; si no es `null`, monta
  `AlertDetailMap({ alert, position })` (design.md D6/D7) tras `{card}`, con
  `PetMap` dentro del `View` `alert-detail-map`, `circles={[]}` y sin `zoom`
  por ahora.
- [ ] (3) Refactor: ninguno previsto.
- [ ] Sonda T8-a: pinta el mapa siempre, con `DEFAULT_CENTER` cuando no hay
  posición. Rojo esperado: las diez filas `'$fila: sin mapa'`.

## T9 — R9: ningún fondo encima del mapa

- [ ] (1) Test rojo:
  - `src/screens/alert-detail/index.test.tsx` ›
    `describe('#170 R9: ningún fondo encima del mapa')`:
    - `it('con mapa, la raíz es flex-1 y ningún ancestro del mapa declara fondo')`:
      payload real; `screen-alert-detail` con `className` exacto `flex-1`; se
      sube por `.parent` desde `pet-map-double` hasta `screen-alert-detail`
      inclusive y ningún nodo tiene `className` con `bg-` ni un objeto de
      `[style].flat(Infinity)` con `backgroundColor`. Rojo por aserción
      (`flex-1 bg-background`).
    - `it.each` `'sin mapa (%s), la raíz conserva flex-1 bg-background'`:
      `carga` (ancla `alert-detail-loading`), `error` (ancla
      `alert-detail-error`), `payload sin posición` (ancla
      `alert-detail-card`). **Nacen verdes.**
  - `src/app/__tests__/layout.test.tsx`:
    - En `#100 R2`, nuevo
      `it('#170 R9: pinta el fondo del tema bajo el detalle de alerta')`: las
      opciones del hijo 8 del grupo protegido (mismo acceso que el `it`
      vecino) tienen `contentStyle` igual a
      `{ backgroundColor: 'token:background' }`. Rojo por aserción.
    - Reescritura nombrada: el `toEqual` de
      `'le da la cabecera nativa de #95 R4 con el título del detalle'` suma
      `contentStyle: { backgroundColor: 'token:background' }`. Rojo por
      aserción.
- [ ] (2) Pantalla: la raíz usa `flex-1` cuando hay posición válida y
  `flex-1 bg-background` en otro caso. `src/app/_layout.tsx`: en las opciones
  de `alerts/[alertId]`, `contentStyle: { backgroundColor: background }`.
- [ ] (3) Refactor: ninguno previsto.
- [ ] Sonda T9-a: raíz siempre `flex-1`. Rojo esperado: las tres filas de
  `'sin mapa (%s) …'`.

## T10 — R10: la distancia a la zona

- [ ] (1) Test rojo — `src/screens/alert-detail/index.test.tsx`. Constantes:
  `ZONE`, un `Geofence` completo según la interfaz de
  `src/api/geofences.ts` (comprueba los campos contra el fichero), con
  `id: 'zone-1'`, `petId: 'pet-1'`, `name: 'Casa'`, `centerLat: 19.4326`,
  `centerLng: -99.1332`, `radiusM: 100`, `active: true`;
  `POS_FAR = { lat: 19.4446371, lng: -99.1332 }`. Alerta: `geofenceId:
  'zone-1'` y payload con la posición del caso.
  - `describe('#170 R10: pinta la zona y la distancia a su borde')`.
  - `it('pinta el círculo, el encuadre y «A 85 m de Casa»')`:
    `listGeofences` resuelve `{ kind: 'ok', geofences: [ZONE] }`; espera
    `alert-detail-distance` con texto `A 85 m de Casa`, `className` exacto
    `text-sm font-semibold text-foreground` y `style` igual a
    `{ fontVariant: ['tabular-nums'] }`; `pet-map-double` con `circles` igual
    a `[{ id: 'zone-1', center: { latitude: 19.4326, longitude: -99.1332 }, radius: 100 }]`
    y `zoom` `toBeCloseTo(16.0740, 3)`; `listGeofences` llamada con
    `('http://example.test/v1', 'token-1', 'pet-1')`. Rojo por consulta.
  - `it('dice «85 m from Casa» en inglés')`. Rojo por consulta.
  - `it('pasa a km desde 1000 m: «A 1.2 km de Casa»')`: `POS_FAR`; `zoom`
    `toBeCloseTo(13.7385, 3)`. Rojo por consulta.
  - `it('usa la zona aunque esté inactiva')`: `{ ...ZONE, active: false }` →
    círculo y `A 85 m de Casa`. Rojo por consulta.
  - `it('lee la zona de la caché compartida de geofenceKeys.list')`: caché
    sembrada con `{ kind: 'ok', geofences: [ZONE] }` y `listGeofences`
    pendiente → `A 85 m de Casa`. Rojo por consulta.
  - `it('pinta la distancia bajo el mapa')`: el hijo del contenedor que es
    `alert-detail-distance` va justo después del que es `alert-detail-map`.
    Rojo por consulta.
  - Candados agregados (R16):
    - `R13_ALERT_DETAIL`: fila
      `{ file: 'src/screens/alert-detail/index.tsx', key: 'alerts.distanceFromZone' }`
      y longitud `11 - 3 + 1 // #170 R16`. Rojo por aserción.
    - `#62 R15`: fila `[join('screens', 'alert-detail', 'index.tsx'), 1]` y
      `+ 1` en la suma de `#69 R10`. Rojo por aserción.
- [ ] (2) `AlertDetailMap` con la consulta de design.md D6 y el cálculo de R10.
- [ ] (3) Refactor: ninguno previsto.

## T11 — R11: alerta sin zona

- [ ] (1) Test — `describe('#170 R11: sin geofenceId pinta el mapa sin zona')`
  › `it.each` `'%s sin geofenceId: mapa sin círculo ni distancia, sin consulta'`,
  con `geofence_exit` y `battery_low`, `geofenceId: null` y payload real:
  ancla `pet-map-double`; `circles` igual a `[]`, `zoom` `undefined`,
  `alert-detail-distance` ausente y `listGeofences` sin llamar. **Nacen
  verdes tras T10.**
- [ ] (2) Sin implementación si nace verde.
- [ ] Sonda T11-a: quita el `enabled` de la consulta. Rojo esperado: las dos
  filas (`listGeofences` llamada).
- [ ] Sonda T11-b: pasa `zoom={MAP_ZOOM}` cuando no hay zona. Rojo esperado:
  las dos filas, y también las de T12 y T13.

## T12 — R12: la zona ya no está

- [ ] (1) Test — `describe('#170 R12: sin la zona de la alerta no pinta zona')`
  › `it.each` con caché sembrada, `geofenceId: 'zone-1'` y payload real:
  `lista vacía` (`geofences: []`) y `otra zona llamada Casa`
  (`[{ ...ZONE, id: 'zone-2' }]`). Ancla `pet-map-double`; `circles` igual a
  `[]`, `zoom` `undefined`, `alert-detail-distance` ausente. **Nacen verdes
  tras T10.**
- [ ] (2) Sin implementación si nace verde.
- [ ] Sonda T12-a: empareja por `zona.name === alert.payload.geofenceName`.
  Rojo esperado: `otra zona llamada Casa`.
- [ ] Sonda T12-b: si no hay coincidencia, usa la primera zona. Rojo
  esperado: `otra zona llamada Casa`.

## T13 — R13: la consulta de zonas no da `ok`

- [ ] (1) Test — `describe('#170 R13: si la consulta de zonas no da ok, mapa sin zona y sin error')`
  › `it.each` de seis filas, `geofenceId: 'zone-1'` y payload real:
  `pendiente` (`listGeofences` pendiente, sin sembrar) y, con caché sembrada,
  `{ kind: 'no-tracking' }`, `{ kind: 'error' }`, `{ kind: 'unreachable' }`,
  `{ kind: 'missing-config' }` y `{ kind: 'unauthorized' }`. Ancla
  `pet-map-double`; `circles` igual a `[]`, `zoom` `undefined`,
  `alert-detail-distance` ausente, `alert-detail-error` ausente y
  `alert-detail-card` presente. **Nacen verdes tras T10.**
- [ ] (2) Sin implementación si nace verde.
- [ ] Sonda T13-a: pinta `alert-detail-error` cuando la consulta de zonas no
  da `ok`. Rojo esperado: las cinco filas sembradas.

## T14 — R14: posición dentro o en el borde

- [ ] (1) Test — `describe('#170 R14: dentro o en el borde no dice distancia')`
  › `it.each`, `listGeofences` resuelve `{ kind: 'ok', geofences: [ZONE] }`:
  `en el centro` (`lat: 19.4326, lng: -99.1332`, `zoom`
  `toBeCloseTo(17.5850, 3)`) y `a 0,41 m del borde` (`lat: 19.43350305,
  lng: -99.1332`, `zoom` `toBeCloseTo(16.5820, 3)`). Espera a que
  `pet-map-double` tenga `circles` de longitud 1 (props del nodo, no el
  mock); después `circles` igual al de T10, el `zoom` de la fila y
  `alert-detail-distance` ausente. **Nacen verdes tras T10.**
- [ ] (2) Sin implementación si nace verde.
- [ ] Sonda T14-a: cambia el umbral a `d - radiusM > 0`. Rojo esperado:
  `a 0,41 m del borde` (pinta `A 0 m de Casa`).
- [ ] Sonda T14-b: no pintes zona si la posición está dentro. Rojo esperado:
  las dos filas (`circles` vacío).

## T15 — R15: «Ver en el mapa»

- [ ] (1) Test rojo — `src/screens/alert-detail/index.test.tsx`:
  - `describe('#170 R15: Ver en el mapa lleva al Mapa con la mascota de la alerta')`.
  - `it.each` `'lo pinta en %s'`, tres filas: `abierta geofence_exit con
    mapa`, `acked battery_low sin mapa` y `closed mystery_type sin mapa`:
    `alert-detail-view-map` con `accessibilityRole` `'button'` y texto
    `Ver en el mapa`. Rojo por consulta.
  - `it('dice «View on map» en inglés')`. Rojo por consulta.
  - `it('no lo pinta mientras carga')` (ancla `alert-detail-loading`) e
    `it('no lo pinta con error')` (ancla `alert-detail-error`). **Nacen
    verdes.**
  - `it('ordena tarjeta, mapa, distancia, CTA y ack')`: alerta abierta, zona
    encontrada (`A 85 m de Casa`); con la regla «Es o contiene», los índices
    entre los hijos del contenedor de `alert-detail-card`,
    `alert-detail-map`, `alert-detail-distance`, `alert-detail-view-map` y
    `alert-detail-ack` son estrictamente crecientes. Rojo por consulta.
  - `it('selecciona la mascota de la alerta y después vuelve al Mapa')`:
    alerta con `petId: 'pet-7'`;
    `await fireEvent.press(getByTestId('alert-detail-view-map'))`;
    `mockSelectPet` llamada una vez con `'pet-7'`, `router.dismissTo` una
    vez con `'/map'`, y
    `mockSelectPet.mock.invocationCallOrder[0] < mockDismissTo.mock.invocationCallOrder[0]`.
    Rojo por consulta.
  - Candados agregados (R16): `R13_ALERT_DETAIL`, fila de
    `alerts.viewOnMap` y longitud `11 - 3 + 2 // #170 R16`; y en `#166 R3`
    de `consistency-classnames` la fila de `rows`, el testID del inventario y
    los dos recuentos a `4 + 1`, tal como los da R16. Rojo por aserción: la
    fila nueva del `it.each` falla en `openingTagWithTestId` (ancla ausente) y
    el inventario en el `toEqual` de testIDs.
- [ ] (2) Pantalla: `Button` según R15, entre el mapa (o la
  tarjeta, si no hay mapa) y el ack.
- [ ] (3) Refactor: ninguno previsto.
- [ ] Sonda T15-a: llama a `router.dismissTo('/map')` antes que a
  `selectPet`. Rojo esperado: `'selecciona la mascota de la alerta y después
  vuelve al Mapa'`.
- [ ] Sonda T15-b: pinta el CTA también en carga y en error. Rojo esperado:
  `'no lo pinta mientras carga'` y `'no lo pinta con error'`.
- [ ] Sonda T15-c: quita `border-lip-gray` del `className` del CTA. Rojo
  esperado: `consistency-classnames.test.ts` › `#166 R3` › la fila de
  `alert-detail-view-map` del `it.each` y `'inventaría los cuatro secundarios
  neutros de toda la app'` (recuento `4` contra `5`).

## T16 — R16: comprobación de los candados agregados

Las filas entraron en los commits rojos de T3, T4, T8, T10 y T15. Esta tarea
no añade tests ni código, solo comprueba:

- [ ] `awk '/^export const R12_ALERTS/,/^];/{ if (/\{ file/) n++ } END { print n }' mobile-pet-tracker/src/__tests__/ui-copy-table.ts`
  → base de M-arranque `+ 5`.
- [ ] `grep -cF 'toHaveLength(11 - 3 + 2); // #170 R16' mobile-pet-tracker/src/__tests__/ui-language.test.ts`
  → `1` (si #167–#171 cambiaron la expresión antes, la suya más `+ 2`).
- [ ] `grep -n -A2 -e "it('#69 R10" -e 'directUses.reduce' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`
  → las dos sumas de M4 con `+ 2` (tabulares) y `+ 1` (esquinas).
- [ ] `grep -cF "'alert-detail-view-map'" mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`
  → `2` (fila de `rows` y lista del inventario).
- [ ] `grep -cF 'toBe(4 + 1); // #170 R16' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`
  → `2` (si otra feature movió antes los recuentos, su expresión más `+ 1`).
- [ ] `grep -c "t('alerts\.section" mobile-pet-tracker/src/screens/alerts/index.tsx`
  → `3`.
- [ ] Sonda T16-a: borra `t('alerts.viewOnMap')` del detalle (deja la etiqueta
  vacía). Rojo esperado: `ui-language.test.ts` ›
  `'registra cada ocurrencia del detalle'`.
- [ ] Suite completa en verde, sin pipe:
  `cd mobile-pet-tracker && bunx jest; echo "exit=$?"`.

## T17 — R17: smoke humano en dev build de Android

No lo hace ninguna IA. El humano instala el **dev build de Android** (no Expo
Go), recorre los cinco puntos de R17 en tema claro y en tema oscuro y firma
la casilla `## Smoke R17` de requirements.md. Codex deja la fila de R17 de
traceability.md en `pendiente (humano)`.
