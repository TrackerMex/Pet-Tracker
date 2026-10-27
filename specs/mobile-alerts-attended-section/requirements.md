---
feature: "mobile-alerts-attended-section"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-alerts-attended-section]] (#223)

> Notación EARS. Capa: móvil (`mobile-pet-tracker/`) más una enmienda de docs
> con casilla humana propia (R19). El backend ya existe y **no cambia**.
> Diseño, archivos y alternativas en [[design]]; plan TDD en [[tasks]];
> trazabilidad en [[traceability]].

## Contexto

El centro de alertas pinta hoy todas las alertas en una sola lista: las
abiertas primero dentro de cada sección de tiempo y, mezcladas con ellas, las
leídas y resueltas. Con el uso, el historial entierra lo que sigue pendiente.

Esta feature separa las dos cosas:

- Las **abiertas** quedan siempre arriba, agrupadas en Hoy / Esta semana /
  Anteriores como hoy, y la insignia «N nuevas» cuenta **todas** las abiertas.
- Las **atendidas** (`acked`, píldora «Leída», y `closed`, píldora «Resuelta»)
  van debajo, en una sección **colapsada por defecto** llamada «Atendidas», con
  contador. Al abrirla se ven 10 filas compactas, y «Ver más» suma 10 por
  toque con el pie «Mostrando N de M».
- Sin abiertas, una tarjeta «Todo en calma» sustituye a la lista de abiertas.

### Desviación respecto al plan (decisión cerrada, no abierta)

`progress/plan_ui-2026-10-26.md` §2 #223 pide «dos consultas por status:
`open` y `acked,closed` como dos cursores». **No es implementable sin tocar el
backend**: `GET /v1/alerts` acepta **un solo** `status` y un cursor no vale
entre filtros (evidencia abajo), y el plan mismo deja `?status=acked,closed`
fuera de alcance. La spec cumple la intención del plan («contador exacto de
abiertas», «orden por `openedAt` descendente», «el cursor no mezcla») con **una
sola consulta sin filtro que el hook drena hasta el último cursor**. Ver
[[design]] §D1 y las alternativas descartadas.

## Fuentes

- **Canvas congelado** en `specs/mobile-alerts-attended-section/canvas/`: tres
  artboards del canvas v153, aprobados en G1 el 2026-10-27
  (`progress/design_ola0-ui-2026-10-27.md`, decisiones 5 y 6 «tal cual»).
  - `AlertasAtendidasColapsada.dc.html`: sha256 empieza por `0b52bc03`
  - `AlertasAtendidasExpandida.dc.html`: `d2483d4d`
  - `AlertasSinAbiertas.dc.html`: `c142fb62`
- `progress/plan_ui-2026-10-26.md` §2 «223» y §4 (checklist de firma).
- `progress/explore_ui-alertas-actividad-ia-2026-10-26.md` (sus premisas se
  re-midieron contra el árbol; mandan las cuentas de esta spec).
- `docs/ui-guidelines.md` (rige toda la UI móvil) y `docs/conventions.md`.
- Backend, solo lectura:
  `backend-pet-tracker/src/modules/alerts/application/use-cases/list-alerts.use-case.ts`,
  `.../domain/cursor.ts`, `.../alerts.constants.ts`.

## Evidencia (medida en la base `73922b10`)

Todas las cuentas se miden con `grep -cF "<literal>" <ruta>` desde la raíz del
worktree; la ruta móvil es relativa a `mobile-pet-tracker/src/`.

Backend (sin cambios):
- `GET /v1/alerts` pagina por keyset con tamaño de página **50**
  (`ALERTS_PAGE_SIZE = 50`), orden `opened_at DESC, id DESC`, acepta **un**
  `status`, y no devuelve total. El cursor se invalida si cambia el filtro.
- El orden del servidor ya es el que pide el plan (`openedAt` descendente): el
  cliente **no reordena** las atendidas.

Móvil (antes del cambio):
- `grep -cF "queryKey: alertKeys.list()" hooks/use-alerts-list.ts` → **1**.
  `alertKeys.list()` es `['alerts','list']`; `alertKeys.open()` es
  `['alerts','list',{status:'open'}]` y es de Inicio (`screens/home/index.tsx`).
- `grep -cF "useAlertsList()" screens/alert-detail/index.tsx` → **1**
  (el detalle usa el hook sin opciones; no debe cambiar).
- `grep -cF "onEndReached" screens/alerts/index.tsx` → **1**;
  en `screens/alerts/index.test.tsx` → **11**;
  `grep -cF "nextCursor: 'c1'" screens/alerts/index.test.tsx` → **5**
  (fixtures con cursor constante: con drenado **ciclarían**; ver R14 y la
  tabla de enmiendas).
- `grep -cF "t('alerts.statusAcked')" screens/alerts/index.tsx` → **1**;
  `grep -cF "t('alerts.statusClosed')" screens/alerts/index.tsx` → **1**.
- `grep -cF "alerts.attended" i18n/catalog.ts` → **0**;
  `grep -cF "alerts.calmTitle" i18n/catalog.ts` → **0**.
- `grep -cF "style={chunkyLip.neutralCompact}" screens/alerts/index.tsx` → **1**.
- `grep -cF "text-13" screens/alerts/index.tsx` → **2**.

## Convenciones de esta spec

- Rutas relativas a `mobile-pet-tracker/src/` salvo que se diga otra cosa.
- Cada test nombrado empieza por `#223 R<n>`.
- **Copy literal.** Cada R-id que pinta texto fija sus literales es/en.
  Codex no inventa copy. Los textos en español son los del canvas aprobado en
  G1; **las cadenas en inglés no vienen del canvas** y las fija esta spec
  (traducción directa, Voz B).
- **Términos**: «abierta» = `status === 'open'` en la página descargada;
  «atendida» = `status` `acked` o `closed`; «asentada» (*settled*) = ya hay
  datos y no queda página por pedir; «drenando» = hay datos y quedan páginas.
- `data` = la prop `data` del `FlatList` `alerts-list`
  (`screen.getByTestId('alerts-list').props.data`).
- **Fecha fija** en los tests que miran subtítulos: `jest.spyOn(Date, 'now')`
  y `TZ` como en `#170 R3` de `screens/alerts/index.test.tsx` (con
  `process.getBuiltinModule('process')`, no `process.env.TZ` directo).
- Los `fireEvent`, `act` y `renderWithProviders` van con `await`
  (RNTL 14).
- Ningún fixture de test devuelve un `nextCursor` no nulo constante: con
  drenado cicla. Toda cadena de páginas termina en `nextCursor: null`.
- Corre jest con rutas por prefijo sin paréntesis
  (`src/screens/alerts`, `src/hooks`, `src/__tests__`).

## Copy nuevo (es / en)

Seis claves nuevas en `i18n/catalog.ts` (en `es` **y** en `en`; mismos
conjuntos de claves) y una fila cada una en `R12_ALERTS` de
`__tests__/ui-copy-table.ts`, con `file: 'src/screens/alerts/index.tsx'`.
Cada clave se invoca desde **un solo** `t('<clave>'...)` del fichero
(`checkUses` cuenta ocurrencias literales; ver R16).

| Clave | es | en |
|---|---|---|
| `alerts.sectionOpen` | `Abiertas` | `Open` |
| `alerts.attended` | `Atendidas` | `Attended` |
| `alerts.attendedMore` | `Ver más` | `Show more` |
| `alerts.attendedShowing` | `Mostrando {{shown}} de {{total}}` | `Showing {{shown}} of {{total}}` |
| `alerts.calmTitle` | `Todo en calma` | `All calm` |
| `alerts.calmBody` | `No tienes alertas abiertas. {{petName}} está tranquilo.` | `You have no open alerts. {{petName}} is calm.` |

Claves **existentes que se reutilizan sin cambio**: `alerts.title`,
`alerts.sectionToday` (Hoy), `alerts.sectionThisWeek` (Esta semana),
`alerts.sectionEarlier` (Anteriores), `alerts.newOne`, `alerts.newMany`,
`alerts.ack` (Marcar leída), `alerts.statusAcked` (Leída / Read),
`alerts.statusClosed` (Resuelta / Resolved), `alerts.typeUnknown`
(Aviso / Notice), `alerts.empty`, `alerts.emptyBody`, `alerts.justNow`,
`alerts.minutesAgo`, `alerts.hoursAgo`, `alerts.dayAgo`, `alerts.daysAgo`,
`common.retry`, `common.somethingWentWrong`.

## Requisitos funcionales

### Capa de datos

- **R1**: WHEN `useAlertsList({ drain: true })` tiene una página cargada con
  `kind: 'ok'` y `nextCursor` no nulo Y no hay petición en vuelo, THE SYSTEM
  SHALL pedir la página siguiente con `listAlerts(baseUrl, token, undefined,
  <ese nextCursor>)`, de una en una, hasta recibir una página con
  `nextCursor: null`.
  - Test: `hooks/use-alerts-list.test.tsx::#223 R1: con drain pide cada página con su cursor, de una en una, hasta nextCursor null`.
  - Fixture: tres páginas (`c1`, `c2`, `null`) con promesas diferidas. Aserta
    las llamadas en orden `(…, undefined, undefined)`, `(…, undefined, 'c1')`,
    `(…, undefined, 'c2')`; que la segunda **no** se emite antes de resolver la
    primera (ni la tercera antes de la segunda); 3 llamadas en total y
    `data.pages` con 3 elementos.

- **R2**: WHEN el hook se invoca sin opciones o con `{ drain: false }`, THE
  SYSTEM SHALL pedir solo la primera página y conservar la clave de caché
  `['alerts','list']`.
  - Test: `hooks/use-alerts-list.test.tsx::#223 R2: sin drain pide una sola página aunque haya nextCursor y usa la clave ['alerts','list']`.
  - Aserta 1 llamada con `nextCursor: 'c1'` en la primera página, tras dejar
    correr los temporizadores; y
    `queryClient.getQueryData(['alerts','list'])` (array **literal**, no
    `alertKeys.list()`) definido. Candado de ancla:
    `grep -cF "useAlertsList()" screens/alert-detail/index.tsx` sigue en **1**.

- **R3**: IF una página drenada llega con `kind` distinto de `ok`
  (`error`, `unreachable`, `missing-config`, `unauthorized`) THEN THE SYSTEM
  SHALL dejar de pedir páginas, conservar las ya descargadas y no emitir más
  llamadas aunque el hook se vuelva a renderizar.
  - Test: `hooks/use-alerts-list.test.tsx::#223 R3: %s corta el drenado y conserva las páginas previas` (`it.each` sobre los cuatro `kind`).
  - Fixture: página 1 ok con `nextCursor: 'c1'`, página 2 con ese `kind`.
    Aserta exactamente 2 llamadas tras `waitFor` y un re-render, y
    `data.pages` de longitud 2.

### Pantalla: abiertas y contador

- **R4**: WHEN la pantalla de Alertas pinta alertas descargadas, THE SYSTEM
  SHALL poner en `data` **solo** las abiertas (con el overlay del ack
  aplicado), agrupadas en `today`, `week`, `earlier` por `alertSection` y, dentro
  de cada grupo, en el orden del servidor, con la cabecera de cada sección una
  sola vez; y SHALL NOT incluir ninguna atendida en `data`.
  - Test: `screens/alerts/index.test.tsx::#223 R4: data contiene solo las abiertas, por sección y en el orden del servidor`.
  - Fixture: el arreglo `S` de `#170 R3` (3 abiertas, 1 leída, 1 resuelta,
    desordenadas a propósito). Aserta
    `data.map(id)` = `['today-open','week-open','earlier-open']`; que las tres
    cabeceras `alerts-section-today|week|earlier` existen una vez cada una; y
    que `alert-row-today-acked` y `alert-row-earlier-closed` no existen con la
    sección colapsada.

- **R5**: WHILE la lista está drenando, THE SYSTEM SHALL NOT pintar la insignia
  `alerts-new-count`; WHEN queda asentada, THE SYSTEM SHALL pintarla con el
  número de abiertas **de todas las páginas** (tras aplicar el overlay), con el
  copy existente (`alerts.newOne` / `alerts.newMany`) y sin pintarla con 0.
  - Test: `screens/alerts/index.test.tsx::#223 R5: la insignia espera al último cursor y suma las abiertas de todas las páginas`.
  - Fixture: página 1 `[a, b abiertas; c leída]` con `nextCursor: 'c1'`; página
    2 diferida `[d abierta]`, `nextCursor: null`. Aserta que mientras la
    página 2 está pendiente `queryByTestId('alerts-new-count')` es `null` y
    `data` ya contiene `a` y `b` (las filas aparecen según llegan); al
    resolverla, `alerts-new-count-text` dice `3 nuevas` (es) / `3 new` (en).

- **R6**: WHEN el owner marca leída una fila abierta, THE SYSTEM SHALL
  conservar esa fila en su posición de `data` con la píldora «Leída» y bajar la
  insignia en 1 (candado #78 «el ack no mueve la fila»); y WHEN el siguiente
  refetch devuelve esa alerta como `acked` o `closed`, THE SYSTEM SHALL sacarla
  de `data` y sumarla a «Atendidas».
  - Test: `screens/alerts/index.test.tsx::#223 R6: la fila marcada leída conserva su sitio y pasa a Atendidas en el siguiente refetch`.
  - Aserta el `data` completo **antes y después** del ack (mismos ids, mismo
    orden); `alert-row-<id>-status` = «Leída»; la insignia pasa de `2 nuevas` a
    `1 nueva`; el contador `alerts-attended-count` no cambia con el ack; tras
    `focusScreen()` con el refetch devolviendo la alerta como `acked`, `data`
    ya no la contiene y el contador de atendidas sube en 1.

### Pantalla: sección «Atendidas»

- **R7**: WHEN la lista está asentada y hay al menos una atendida, THE SYSTEM
  SHALL pintar debajo de las abiertas la sección `alerts-attended` con un
  encabezado pulsable `alerts-attended-toggle` **colapsado por defecto**, que
  muestra la etiqueta `alerts.attended` (`alerts-attended-label`), el contador
  `alerts-attended-count` con el **total** de atendidas descargadas, y un
  chevron `alerts-attended-chevron` (`ChevronDown` colapsado); y WHILE está
  colapsada SHALL NOT montar ninguna fila atendida.
  - IF no hay atendidas, o la lista sigue drenando, THEN THE SYSTEM SHALL NOT
    pintar `alerts-attended`.
  - Test: `screens/alerts/index.test.tsx::#223 R7: pinta «Atendidas» colapsada con su contador solo asentada y con atendidas`.
  - Aserta: copy `Atendidas` / `Attended`; contador = `2` con un fixture de
    1 leída + 1 resuelta; `accessibilityState.expanded === false`;
    `chevron.props.iconName === 'ChevronDown'`; ninguna
    `alert-row-<id>` atendida montada; ausencia con 0 atendidas y con una
    página 2 pendiente.

- **R8**: WHEN el owner pulsa `alerts-attended-toggle`, THE SYSTEM SHALL
  alternar la sección entre colapsada y expandida; expandida SHALL pintar en
  `alerts-attended-list` las primeras 10 atendidas en el orden del servidor
  (`openedAt` descendente), con el chevron `ChevronUp` y
  `accessibilityState.expanded === true`; y SHALL conservar cuántas filas
  estaban visibles al colapsar y volver a abrir mientras la pantalla siga
  montada.
  - Test: `screens/alerts/index.test.tsx::#223 R8: el encabezado alterna la sección y recuerda cuántas filas había`.
  - Fixture: 14 atendidas (ids `h01`…`h14`, `openedAt` descendente, mezcla de
    `acked` y `closed`). Aserta: 10 ids `h01`…`h10` en orden dentro de
    `alerts-attended-list`; colapsar los quita; reexpandir tras un «Ver más»
    (R10) vuelve a mostrar 14.

- **R9**: WHEN una atendida se pinta en la sección, THE SYSTEM SHALL pintarla
  como fila compacta con los testIDs `alert-row-<id>`, `-icon`, `-link`,
  `-type`, `-subtitle`, `-pet`, `-time` y `-status`, con el icono y la tinta de
  su tipo (`alertTypeMeta`), la píldora «Leída» (`acked`) o «Resuelta»
  (`closed`) con las **mismas clases** que hoy, **sin** botón `-ack`, **sin**
  borde de severidad y **sin** envoltorio `RiseIn`; y WHEN se pulsa `-link`,
  SHALL navegar a `/alerts/[alertId]` con el `alertId` de la fila.
  - Test: `screens/alerts/index.test.tsx::#223 R9: la fila atendida es compacta, sin ack y abre su detalle`.
  - Aserta: el icono con `size === 18`, el disco `size-9 …` (clases exactas en
    R17); el texto de la píldora y su `className` literal (los dos literales
    de `#174 R9`); `queryByTestId('alert-row-<id>-ack')` es `null`;
    `queryByTestId('alert-row-<id>-entrance')` es `null`;
    `router.push` llamado con `{ pathname: '/alerts/[alertId]', params: { alertId } }`.

- **R10**: WHILE la sección está expandida, THE SYSTEM SHALL mostrar el botón
  `alerts-attended-more` («Ver más») solo si hay más atendidas que filas
  visibles, y WHEN se pulsa SHALL sumar 10 filas visibles (sin pasar del
  total); y SHALL mostrar el pie `alerts-attended-footer` («Mostrando N de M»,
  N = visibles, M = total) solo si el total supera 10, incluido cuando ya se
  ven todas.
  - Test: `screens/alerts/index.test.tsx::#223 R10: «Ver más» suma 10 y el pie cuenta N de M`.
  - Casos (`it.each` sobre el total): 10 → sin botón y sin pie; 11 → botón, pie
    `Mostrando 10 de 11`, tras pulsar 11 filas, sin botón y pie
    `Mostrando 11 de 11`; 23 → `10 de 23`, `20 de 23`, `23 de 23`. En inglés,
    `Showing 10 of 23` y `Show more`.

### Pantalla: estados

- **R11**: WHEN la lista está asentada, no hay abiertas y hay al menos una
  atendida, THE SYSTEM SHALL pintar en lugar de las filas abiertas el
  encabezado `alerts-open-heading` («Abiertas»), la tarjeta `alerts-calm` con
  el icono `alerts-calm-icon` (`Check`), el título `alerts-calm-title`
  («Todo en calma») y el cuerpo `alerts-calm-body`; SHALL NOT pintar
  `alerts-new-count` ni `alerts-empty`; y SHALL pintar «Atendidas» debajo
  (colapsada por defecto).
  - El `{{petName}}` del cuerpo es el `petName` de la atendida **más reciente**
    (la primera de la lista de atendidas en el orden del servidor).
  - Test: `screens/alerts/index.test.tsx::#223 R11: sin abiertas pinta «Todo en calma» con el nombre de la mascota más reciente`.
  - Fixture: 2 atendidas, la primera con `petName: 'Rocky'` y la segunda con
    `petName: 'Luna'`. Aserta es `No tienes alertas abiertas. Rocky está tranquilo.`
    y en `You have no open alerts. Rocky is calm.`; `alerts-open-heading` =
    `Abiertas` / `Open`; ausencia de `alerts-empty` y de `alerts-new-count`;
    presencia de `alerts-attended-toggle`.

- **R12**: WHEN la lista está asentada y no hay ninguna alerta, THE SYSTEM
  SHALL pintar el `EmptyState` `alerts-empty` de hoy y SHALL NOT pintar
  «Atendidas», `alerts-calm` ni `alerts-open-heading`; y IF la primera página
  falla THEN THE SYSTEM SHALL pintar `alerts-error` y `alerts-retry` como hoy.
  - Test: `screens/alerts/index.test.tsx::#223 R12: sin alertas conserva el vacío de Pingo y el error de la primera página conserva el reintento`.
  - Aserta, con `{ items: [], nextCursor: null }`, `alerts-empty` presente y
    `alerts-attended`, `alerts-calm`, `alerts-open-heading` ausentes; con
    `{ kind: 'error' }`, `alerts-error` y `alerts-retry`, y `alerts-attended`
    ausente. El inventario de `empty-state.test.tsx` no cambia (el
    `EmptyState` de Alertas sigue siendo **uno**).

- **R13**: WHILE la lista está drenando y todavía no hay ninguna abierta
  descargada, THE SYSTEM SHALL pintar el esqueleto `alerts-loading` (los tres
  `alert-row-skeleton-<n>` de hoy) en lugar del vacío; y WHEN llega la primera
  abierta, SHALL sustituirlo por las filas.
  - Test: `screens/alerts/index.test.tsx::#223 R13: mientras drena sin abiertas pinta el esqueleto, no el vacío ni la tarjeta de calma`.
  - Fixture: página 1 con solo atendidas y `nextCursor: 'c1'`; página 2
    diferida. Aserta `alerts-loading` presente, `alerts-calm` y
    `alerts-empty` ausentes; al resolver la página 2 con una abierta,
    `alert-row-<id>` presente y `alerts-loading` ausente.

- **R14**: IF una página posterior a la primera falla durante el drenado THEN
  THE SYSTEM SHALL conservar lo descargado, pintar `alerts-action-error` con
  `common.somethingWentWrong`, asentar la lista con los datos parciales (la
  sección «Atendidas» y la insignia salen de lo descargado) y no pedir más
  páginas.
  - Test: `screens/alerts/index.test.tsx::#223 R14: si falla la segunda página conserva lo descargado, muestra el error y no pide más`.
  - Fixture: página 1 `[p1a abierta, p1b leída]`, `nextCursor: 'c1'`; página 2
    `{ kind: 'error' }`. Aserta `data` = `['p1a']`, `alerts-action-error` =
    `Algo salió mal`, insignia `1 nueva`, `alerts-attended-count` = `1`, y
    `mockListAlerts` llamado exactamente 2 veces tras `waitFor`.

- **R15**: THE SYSTEM SHALL NOT pedir páginas desde el scroll de la lista: el
  `FlatList` `alerts-list` no declara `onEndReached`; las páginas las pide
  solo el drenado (R1).
  - Test: `screens/alerts/index.test.tsx::#223 R15: la lista no declara onEndReached y el drenado pide las páginas`.
  - Aserta `screen.getByTestId('alerts-list').props.onEndReached` es
    `undefined` con 2 páginas (`c1`, `null`) y que ambas se pidieron sin
    ningún evento de scroll. Ancla:
    `grep -cF "onEndReached" screens/alerts/index.tsx` → **0**.

### Copy, fidelidad y candados

- **R16**: THE SYSTEM SHALL resolver todo el copy nuevo por clave del catálogo
  (tabla «Copy nuevo»): las seis claves existen en `es` y en `en` con los
  literales de la tabla, cada una tiene su fila en `R12_ALERTS`, y cada clave
  se invoca desde exactamente un `t('<clave>'` de `screens/alerts/index.tsx`;
  las píldoras `alerts.statusAcked` y `alerts.statusClosed` siguen invocándose
  **una vez** cada una (la fila abierta con overlay y la atendida comparten el
  mismo componente local `StatusPill`, ver [[design]] §D4).
  - Test: `__tests__/alerts-attended-canvas-fidelity.test.ts::#223 R16: las seis claves existen en es y en con el literal fijado y una sola invocación cada una` (lee `es` y `en` de `../i18n/catalog` y compara contra **literales escritos en el test**, no contra el símbolo de producción).
  - Verdes que deben seguir verdes sin tocarlos: `ui-language.test.ts`
    (`mantiene el catálogo consistente entre los dos idiomas`,
    `#194 R5: no deja ningún valor fijo…` con **`SCREEN_FILES` sin delta**:
    `screens/alerts/index.tsx` ya cuenta y no nace ningún fichero con copy),
    `#78 R12: el centro de alertas resuelve su copy por clave`
    (`checkUses(R12_ALERTS)`) y `#194 R5: cuadra ALL_USES…` (autoconsistente;
    no hay cifra fija de `R12_ALERTS`).
  - **Fe de erratas E1 del leader (2026-10-27):** `providers/__tests__/language-provider.test.tsx`
    (`#194 R1: mantiene la base más las claves de #68…`) lleva un recuento manual
    de claves del catálogo (`toHaveLength` con suma `+ 26, // #208 R19`). Las seis
    claves lo ponen en rojo (+6): ese `it` SÍ se toca, solo para añadir al final de la
    suma `+ 6 // #223 R16` y el sufijo ` (enmendado por #223 R16)` al título. Va en un
    paso rojo propio antes del verde que añade las claves. Descubierto en #222 (misma
    clase de candado). Si #222 llegó antes a `dev`, suma sobre su `+ 1, // #222 R8`.
  - **Fe de erratas E1b del leader (2026-10-27):** con #222 y #214 en `dev`, la suma
    de `#194 R1` termina en `+ 1 // #222 R8` y `+ 51, // #214 R22`, y el título en
    `(enmendado por #222 R8) (enmendado por #214 R22)`. Las líneas `+ <n> // #223 R16` se
    añaden DESPUÉS de la de #214 (la coma solo en la última) y el sufijo
    `(enmendado por #223 R16)` va al final del título.
  - **Fe de erratas E2 del leader (2026-10-27):** cuatro candados de
    `consistency-classnames.test.ts` que la tabla de enmiendas no lista se ponen rojos
    con la fila atendida y «Ver más»; se enmiendan con el sufijo `(enmendado por #223 R18)`:
    (E2a) `#98 R10`: la suma de `count(/style=\{CONTINUOUS_CORNER\}/g)` gana `+ 1 // #223 R9`;
    (E2b) `#62 R14`: `directUses` gana la fila `[join('screens', 'alerts', 'index.tsx'), 1]`
    (+1 `it`) y la suma de `fusiona la esquina una vez…` gana `+ 1 // #223 R9`;
    (E2c) `#166 R3`: la lista ordenada de `testIds` gana `'alerts-attended-more'` tras
    `'alert-detail-view-map'`; (E2d) `#166 R3`: `count(/border-lip-gray/g)` gana
    `+ 1 // #223 R10`. Descubierto al medir el handoff sobre `dev` con #214.
    (E3, hallada por Codex en C6) `screens/alerts/index.test.tsx`
    `#203 R8: sin nuevas la cabecera no lleva accesorio`: sus dos alertas son
    atendidas (`acked`, `closed`), así que con R4 no hay fila `alert-row-a` en
    `data` y su espera falla. Se enmienda en el commit de R4 (C6) cambiando solo
    esa espera por `await waitFor(() => expect(screen.getByTestId('alerts-list')).toBeVisible())`,
    con el sufijo `(enmendado por #223 R18)`; las aserciones de cabecera sin
    accesorio no cambian.

- **R17**: THE SYSTEM SHALL pintar los elementos nuevos con las clases fijadas
  por el canvas (tabla abajo), sin hex, sin corchetes en `className`, sin
  emoji ni `StyleSheet.create`, y con dianas táctiles de al menos 44 pt.
  - Test: `__tests__/alerts-attended-canvas-fidelity.test.ts::#223 R17: …`
    (varios `it`, ver [[tasks]]): cada fila de la tabla es una aserción
    `toContain` sobre el fuente con el literal de la columna «Clases»; la
    aserción de grep-limpio replica la de `#174 R12` sobre los literales
    nuevos; las dianas se miden por clase (`h-10` + `hitSlop={TOUCH_SLOP}` en
    el encabezado = 40 + 12 = 52; `min-h-11` en el enlace de fila = 44; `h-11`
    en «Ver más» = 44).

  | Elemento (testID) | Clases / props | Canvas |
  |---|---|---|
  | Fila atendida (`alert-row-<id>`), `View` con `style={CONTINUOUS_CORNER}` | `flex-row items-center gap-3 rounded-16 border border-border bg-surface px-3.5 py-2.5` | radio 16, padding 10/14, gap 12 |
  | Disco del icono | `size-9 items-center justify-center rounded-full ${meta.disc}`; icono `size={18}` | 36 px, icono 18 |
  | Enlace (`-link`) | `min-h-11 min-w-0 flex-1 justify-center gap-px` | columna con gap 1 |
  | Título (`-type`) | `text-sm font-extrabold text-foreground` | 14/800 |
  | Subtítulo (`-subtitle`) | `text-xs font-normal text-muted` (igual que la abierta) | 12/400 |
  | Píldora (`-status`) | **sin cambio**: `rounded-full bg-default px-2.5 py-1 text-xs font-bold text-muted` (leída) y `rounded-full ${CATEGORY_SLOTS.green.surface} px-2.5 py-1 text-xs font-extrabold ${CATEGORY_SLOTS.green.ink}` (resuelta) | 4/10, 12/800 |
  | Lista (`alerts-attended-list`) | `gap-1.5` | gap 6 |
  | Encabezado (`alerts-attended-toggle`), `Pressable` | `mt-1.5 h-10 w-full flex-row items-center gap-2`, `hitSlop={TOUCH_SLOP}`, `accessibilityRole="button"`, `accessibilityState={{ expanded }}` | margen 6, alto 40, gap 8 |
  | Etiqueta (`alerts-attended-label`) | `text-13 font-extrabold uppercase tracking-caps text-muted` | 13/800, 0.06em |
  | Contador (`alerts-attended-count`) | `rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted` | 2/8, 12/800 |
  | Disco del chevron (`alerts-attended-chevron` es el icono) | disco `size-8 items-center justify-center rounded-full bg-default`; icono `ChevronDown`/`ChevronUp` `size={18}` `color={muted}` | 32 px, icono 18 |
  | Encabezado «Abiertas» (`alerts-open-heading`) | `mt-1.5 text-13 font-extrabold uppercase tracking-caps text-muted`, `accessibilityRole="header"` | 13/800 |
  | Tarjeta de calma (`alerts-calm`), `Card variant="secondary"` | `flex-row items-center gap-3.5 border-0 px-4 py-4.5` | fondo `surface2`, radio 20, 18/16, gap 14 |
  | Disco de calma | `size-11 items-center justify-center rounded-full bg-surface`; icono `Check` `size={22}` `strokeWidth={2.2}` en `category-green-strong` | 44 px, icono 22 |
  | Título de calma | `text-base font-extrabold text-foreground` | 16/800 |
  | Cuerpo de calma | `text-13 text-muted` | 13/18 |
  | «Ver más» (`alerts-attended-more`), `Button variant="secondary"` | `h-11 rounded-14 border-2 border-lip-gray bg-surface px-5.5`, `style={chunkyLip.neutralCompact}`; etiqueta `Button.Label` `text-sm font-extrabold text-foreground` | alto 44, radio 14, padding 22, labio 3 |
  | Pie (`alerts-attended-footer`) | `text-xs text-muted` | 12 |

  Contenedor de «Ver más» y pie: `View` `items-center gap-1.5 pt-1.5`, solo
  presente si el total supera 10.

### Enmiendas de candados y de docs

- **R18**: THE SYSTEM SHALL mantener en verde todos los candados existentes
  enmendando **solo** los listados en «Tabla de enmiendas» (cada uno con su
  ruta y el título de su `it`), cada uno con el sufijo
  `(enmendado por #223 R18)` y sin debilitar su intención.
  - Test: la suite completa de `mobile-pet-tracker/` en verde (`./init.sh`),
    más `__tests__/alerts-attended-canvas-fidelity.test.ts::#223 R18: los candados enmendados nombran su enmienda` que comprueba, por lectura de fuente,
    que cada título de la tabla lleva el sufijo.

- **R19** *(gate G4: casilla humana propia, ver «Aprobación»)*: WHERE la
  enmienda de `docs/ui-guidelines.md` está firmada por el humano, THE SYSTEM
  SHALL añadir a la regla 12 («Escala de radios») una línea nueva, con sangría
  de 4 espacios, justo después de la línea que contiene
  ``por fidelidad al canvas (#199): `rounded-24` `` (hoy la última de la regla;
  mide `grep -cF` → 1), con este texto exacto (sin la sangría del bloque):
  ````text
  Fuera de la escala, por fidelidad al canvas (#223): `rounded-16` (16 px), fila atendida de Alertas, que es un `View` y no un `Card` porque `twMerge` no sustituye `rounded-card` por un radio con nombre de valor; `rounded-14` (14 px), «Ver más» de la sección Atendidas.
  ````
  - Test: `__tests__/alerts-attended-canvas-fidelity.test.ts::#223 R19: la carta declara los radios de la sección Atendidas` (lee `docs/ui-guidelines.md`, cuenta la línea exacta **una vez** y comprueba que su índice es el siguiente al de la línea del #199).
  - **Orden**: R19 se implementa **solo después** de que el humano marque la
    casilla G4. Hasta entonces ni el test ni la línea de docs entran en la
    rama (nada de `it.skip`) y R19 queda `pendiente` en la trazabilidad; el
    resto de requisitos no dependen de ella (ningún guard existente exige esa
    línea).

## Tabla de enmiendas

Medida contra el árbol `73922b10`; los títulos se citan por contenido (prefijo
del `it` o `describe`). Las cifras de los guards se **recomputan en T0**
(corriendo las suites antes de tocar producción) y se enmiendan con el delta
exacto; la columna «Cambio» es la intención, no un valor congelado.

Ficheros de producción (relativos a `mobile-pet-tracker/src/`):

| Fichero | Cambio |
|---|---|
| `hooks/use-alerts-list.ts` | opción `{ drain }` y efecto de drenado (R1-R3) |
| `screens/alerts/index.tsx` | partición, sección, calma, componente local `StatusPill`, sin `onEndReached` (R4-R17) |
| `i18n/catalog.ts` | seis claves en `es` y `en` (R16) |
| `providers/__tests__/language-provider.test.tsx` | solo el recuento de claves `+ 6` (R16, fe de erratas E1) |

Candados en `screens/alerts/index.test.tsx` (el mock de
`reicon-react-native` suma `Check`, `ChevronDown` y `ChevronUp`):

| `describe` / `it` | Enmienda |
|---|---|
| `#78 R6` · `alterna el tercer hijo entre ack y la píldora traducida` | la fila abierta conserva su `-ack`; las filas `acked` y `closed` se aserta **tras expandir la sección** y con la anatomía de R9/R17 (View, `size-9`, icono 18, sin ack); los literales de la píldora no cambian |
| `#78 R7` · `particiona por el status descargado y conserva el orden de cada grupo` | `data` = `['alert-row-open1','alert-row-open2']`; el orden de las atendidas se aserta dentro de `alerts-attended-list` (`acked`, `closed`) tras expandir |
| `#78 R7` · `no mueve la fila abierta al pulsar su ack` | `expectedOrder` solo abiertas; **mantiene** la aserción de que el orden no cambia tras el ack |
| `#78 R9` · `pide el cursor siguiente y conserva las filas de ambas páginas` | sin `fireEvent(…, 'onEndReached')`; `waitFor` de `p1a,p1b,p2a,p2b` y la 2.ª llamada con `'c1'` |
| `#78 R9` · `no pide otra página cuando nextCursor es null` | sin evento de scroll; 1 llamada |
| `#78 R9` · `corta el segundo onEndReached mientras la página está en vuelo` | se renombra `no pide otra página mientras la anterior está en vuelo`: con la 2.ª diferida, 2 llamadas y no una tercera |
| `#78 R9` · `conserva la primera página y muestra error si falla la segunda` | sin evento de scroll; exactamente 2 llamadas (R14 lo cubre además) |
| `#97 R8` · `da prioridad al status cerrado descargado en el siguiente foco` | la fila cerrada ya no está en `data`: tras el foco espera `alerts-attended-count` = `1`, pulsa el encabezado y aserta `alert-row-alert-1-status` = «Resuelta» |
| `#170 R3` · `ordena por sección y, dentro, abiertas primero en el orden del servidor` | `data` = `['today-open','week-open','earlier-open']`; se renombra `ordena las abiertas por sección y en el orden del servidor` |
| `#170 R3` · `omite la cabecera de %s cuando la sección queda vacía` | espera la primera **abierta** del fixture (la primera fila de `items` es atendida y no se monta colapsada) |
| `#170 R3` · `pinta cada cabecera una sola vez al cargar la página siguiente` | sin `onEndReached`; `data` = `['today-1','week-1','earlier-1']` (`week-2` es leída y va a «Atendidas»); una sola cabecera `week` |
| `#170 R3` · `no reordena al marcar leída una fila abierta` | `data` = `['today-open','week-open','earlier-open']` antes y después |
| `#170 R4` · `no pinta el contador con 0 nuevas: %s` | el estado `todas leídas` espera `alerts-calm` (las filas `a`, `b` no se montan colapsadas); se conservan las aserciones de hijos de `alerts` y del árbol raíz |
| `#170 R4` · `suma las abiertas de todas las páginas cargadas` | sin `onEndReached`; la insignia aparece ya con `3 nuevas` (R5 lo desarrolla) |
| `#170 R5` · `%s: sin borde de severidad` (`acked`, `closed`) | expande la sección y aserta el `className` de la fila atendida (R17) sin `border-2` |

**Regla de cierre.** En T0 Codex corre `src/screens/alerts`, `src/hooks` y
`src/__tests__`. Cada `it` que falle **solo** porque (a) las atendidas ya no
están en `data`, (b) están colapsadas, o (c) `onEndReached` desapareció, se
enmienda igual que los de la tabla (misma intención, mismo sufijo) y se anota
en `progress/impl_mobile-alerts-attended-section.md` con ruta y título. Un rojo
en un fichero **fuera** de estas tres rutas, o cuya causa sea otra, **se
reporta y no se toca**.

Candados de guards (relativos a `mobile-pet-tracker/src/__tests__/`, medidos
por lectura; se recomputan en T0):

| Fichero · `it` (prefijo) | Enmienda |
|---|---|
| `chunky-cta-canvas-fidelity.test.ts` · `#177 R7.5` | `inventory(/style=\{chunkyLip\.neutralCompact\}/g)` → `screens/alerts/index.tsx: 2` |
| `chunky-cta-canvas-fidelity.test.ts` · `#177 R7.1` | `count(/border-lip-gray/g)`: la expresión real es `10 + 1 + 1 + 2 + 1 + 4` → `+ 1` |
| `chunky-cta-canvas-fidelity.test.ts` · `#177 R7.3` | el mapa `radii` suma `'screens/alerts/index.tsx': 1` y el total de `rounded-16` suma 1 |
| `chunky-cta-canvas-fidelity.test.ts` · `#177 R4.3` (y el `neutralInventory`) | suma el id `alerts-attended-more`, en su posición ordenada (entre `alert-detail-view-map` y `docs-upload-cancel`) |
| `chunky-cta-canvas-fidelity.test.ts` · `#177 R6.2` | `count(/<Button\.Label/g)` +1 y `count(/Button\.Label/g)` +2 |
| `chunky-cta-canvas-fidelity.test.ts` · `#177 R8.3` | suma la fila `['screens/alerts/index.tsx', 'h-11 rounded-14 border-2 border-lip-gray bg-surface px-5.5']` |
| `design-drift.test.ts` · `reserva los radios 14, 16 y 22 a Recordatorios…` | el mapa `rounded16` suma `'screens/alerts/index.tsx': 1`; `outsideReminders(/\brounded-14\b/)` suma `join('screens','alerts','index.tsx')` entre `components/segmented-control.tsx` y `screens/geofences/index.tsx` |
| `alerts-canvas-fidelity.test.ts` · `cada tracking-* va con su text-*` | `toHaveLength(1)` → `toHaveLength(3)` (cabecera de sección, «Abiertas» y «Atendidas») |
| `consistency-classnames.test.ts` · `aplica TABULAR_NUMS a sus %i valores` | **sin cambio**: la spec no añade `TABULAR_NUMS` (el conteo de alertas sigue en 1) |

Candados que **no** cambian y que la implementación debe respetar (anclas
vigentes): `#134 R6` y `#134 R7` (`screens/alerts/index.tsx` sin `case '`,
`signOut(`, `alertKeys|invalidateQueries|setQueryData|useQueryClient|queryClient`;
`settleAlertAck(` y `ackAlert(baseUrl` una vez cada uno), `#197 R10` y
`#197 R22` (`const chunkyLip = useChunkyLip();`, grep-limpio), `#174 R12`
(inventarios de `rounded-10`, `tracking-caps`, `text-15`; grep-limpio),
`#177 R7.4` (consumidores de `useChunkyLip`), `#155 R5`
(`EmptyState` en el sitio del vacío), `#203 R9` (RiseIn de las **cinco
primeras filas abiertas** y la sexta sin envoltorio).

> **Fe de erratas E4 del leader (2026-10-27, hallada por Codex en la corrida completa C27).**
> `src/app/__tests__/alert-detail.navigation.test.tsx` (`#100 R8: fila, detalle y vuelta al
> centro con la alerta leída`) conservaba el flujo antiguo: con R1/R4 la pantalla drena las dos
> páginas sola y `alert-2`, ya leída, vive en «Atendidas» (colapsada). Se enmienda ese `it`, y solo
> ese fichero de `app/`, con el sufijo `(enmendado por #223 R18)`: (1) se elimina el
> `fireEvent(..., 'onEndReached')` y la espera `toHaveLength(1)` pasa a `toHaveLength(2)`
> (`alert-1` y `alert-2` abiertas); (2) tras volver del detalle, antes de leer
> `alert-row-alert-2-status`, se pulsa `alerts-attended-toggle` para expandir «Atendidas»;
> (3) un `await` delante del `renderRouter` solo si el test lo necesita para no filtrar al
> siguiente `it`. Las demás aserciones no cambian.

## Fuera de alcance

- Cambios de backend: el contador `openCount` y el filtro `?status=acked,closed`
  del plan §2 #223 son otra feature.
- `FlashList` o cualquier lista virtualizada nueva (sin dependencias nuevas).
- Un formateador en semanas: el canvas dibuja «Hace 1 semana» y «Hace 8 días»,
  pero la app conserva `fmtOpenedAt` (sin clave de semanas): «Hace 7 días».
  Es una diferencia conocida del dato de ejemplo, no un requisito.
- Animación de entrada de las filas atendidas y de la tarjeta de calma (el
  canvas anima con `rise`; esta spec no la pide).
- Acciones sobre atendidas (reabrir, borrar), ordenar, filtrar o buscar.
- Cambiar el tipo de la insignia o el título de la pantalla.
- Cambios en Inicio (`alertKeys.open()` y su tarjeta no se tocan).
- El smoke en dispositivo (G2) y las enmiendas de `docs/conventions.md`.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-27, firma delegada del leader: mandato 2026-10-23 ampliado 2026-10-26; G1 aprobado por el humano sobre canvas v153)
  (firma delegada del leader con la checklist de
  `progress/plan_canvas-parity-2026-10-23.md` §4 y los tres puntos del §4 de
  `progress/plan_ui-2026-10-26.md`; mandato del 2026-10-26)
- [ ] **G4**: aprobada la enmienda de `docs/ui-guidelines.md` de R19 (casilla
  humana propia, **no delegada**) (fecha: ____) ← sin esta casilla R19 no se
  implementa
- [ ] **G2**: smoke en el dev build de Android (colapsada, expandida con
  «Ver más», sin abiertas, tema claro y oscuro) (fecha: ____) ← gate humano,
  por lote al final de la ola; lo registra `progress/smoke_ui.md`
- Base congelada: `73922b10` (`origin/dev`).
