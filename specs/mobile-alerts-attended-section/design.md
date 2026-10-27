---
feature: "mobile-alerts-attended-section"
status: draft
tags: [mobile, ui, design]
---

# Diseño — [[mobile-alerts-attended-section]] (#223)

Decisiones de alto nivel. Los requisitos viven en [[requirements]]; aquí se
fija el *cómo* sin bajar a código. Rutas relativas a
`mobile-pet-tracker/src/` salvo que se diga otra cosa.

## Decisiones

### D1. Una sola consulta sin filtro, drenada por el hook

El plan pedía dos consultas (`open` y `acked,closed`) con cursores separados.
El backend lo impide: `GET /v1/alerts` acepta **un** `status`, pagina por keyset
de 50 y el cursor no es válido entre filtros; `?status=acked,closed` queda fuera
de alcance. Se decide:

- Se conserva **una** consulta infinita bajo la clave existente
  `['alerts','list']` (`alertKeys.list()`), sin filtro de `status`.
- `useAlertsList({ drain = false } = {})`: con `drain: true`, un `useEffect`
  pide la página siguiente mientras `hasNextPage && !isFetching && !isError`.
  Una página con `kind !== 'ok'` no tiene cursor siguiente (el `getNextPageParam`
  actual ya devuelve `undefined`), así que el drenado se detiene solo (R3).
- Solo la pantalla de Alertas pasa `drain: true`. `alert-detail` sigue con
  `useAlertsList()` y una página (R2).
- Con el drenado completo, el cliente conoce **todas** las alertas del usuario:
  de ahí el contador exacto de abiertas (R5) y el total de atendidas (R7), sin
  tocar el backend. Ambos, y la sección, se muestran solo cuando la lista está
  *asentada* (hay datos y no quedan páginas); las filas abiertas se pintan según
  llegan.
- Orden: el servidor ya devuelve `opened_at DESC, id DESC`; el cliente **no
  reordena** (las atendidas salen en ese orden, R8).
- `alertKeys.open()` es de Inicio y no se toca; el ack sigue usando
  `settleAlertAck` y las invalidaciones existentes de `alertKeys.list()`, que
  cubren la lista drenada (mismo prefijo).

Techo conocido (anotado, no bloqueante): ~1 petición por cada 50 alertas del
usuario al abrir la pantalla, y el refetch al enfocar vuelve a pedir todas las
páginas cargadas. Si un usuario acumulara miles de alertas, la salida es el
`openCount` + `?status=acked,closed` del backend (otra feature).

### D2. Estado de la pantalla

- `draining = data !== undefined && hasNextPage && !isError`;
  `settled = data !== undefined && !draining`.
- Insignia, sección «Atendidas» y estados calma/vacío dependen de `settled`.
- Sin abiertas descargadas mientras drena: esqueleto `alerts-loading` (R13).
- Fallo de una página tardía: se asienta con lo descargado y se muestra
  `alerts-action-error` (R14); no se reintenta solo.
- `onEndReached` desaparece (R15): ya nadie pagina por scroll.

### D3. Qué lleva el `FlatList` y qué el pie

- `data` del `FlatList` son **solo las abiertas** (con el overlay del ack ya
  aplicado), agrupadas por `alertSection`. La sección «Atendidas» va en
  `ListFooterComponent`, de modo que una sola lista virtualizada sigue siendo
  el contenedor y no hay `ScrollView` anidado.
- El overlay del ack se conserva: la fila marcada leída **no se mueve** (candado
  #78), la insignia baja, y recién tras el siguiente refetch pasa a «Atendidas».
  Consecuencia asumida: si se marca leída la última abierta, la tarjeta de calma
  aparece tras ese refetch (el mismo comportamiento que tiene hoy una fila
  leída respecto a su sección).

### D4. Un solo `StatusPill` local

La píldora «Leída»/«Resuelta» se usa en la fila abierta con overlay y en la fila
atendida. Para no duplicar los literales `t('alerts.statusAcked')` /
`t('alerts.statusClosed')` (que `checkUses` cuenta una vez por clave y fichero),
ambos usan un componente local `StatusPill` dentro de `screens/alerts/index.tsx`.
Las clases de la píldora no cambian.

### D5. Todo inline en `screens/alerts/index.tsx`

Ningún fichero nuevo de pantalla: el delta de `SCREEN_FILES` en
`ui-language.test.ts` es 0. Componentes locales: `StatusPill`, la fila atendida
y la sección. Hay un solo consumidor, así que no se extraen a `components/`
(la extracción es refactor futuro si otra pantalla los necesita).

### D6. Estado calma

- Es el `ListEmptyComponent` (encabezado `alerts-open-heading` + `Card
  variant="secondary"`) cuando asentada, `open === 0` y `attended > 0`.
- Sin ninguna alerta se conserva el `EmptyState` `alerts-empty` (R12).
- El `{{petName}}` sale de la atendida más reciente (primera en orden de
  servidor): es determinista y no exige un modelo de «mascota actual».

### D7. Fila atendida

`View` con `style={CONTINUOUS_CORNER}` y `rounded-16`, **no** un `Card`,
porque `twMerge` no reemplaza `rounded-card` por un radio con nombre de valor.
Esto introduce `rounded-16` fuera de la escala de la carta: entra por R19 (gate
G4). «Ver más» es un `Button variant="secondary"` con `rounded-14`; por eso se
enmiendan los candados chunky-cta y design-drift (tabla de enmiendas).

### D8. Copy

Seis claves nuevas (tabla de requisitos). El plan decía «se reescribe el copy
de sección»: se interpreta como **claves nuevas**, sin tocar las existentes
(`alerts.sectionToday/ThisWeek/Earlier` siguen igual).

## Archivos afectados por capa

Dominio / aplicación: ninguno (no hay cambios de dominio; `utils/alert-sections.ts`
y `utils/alert-meta.ts` se **reutilizan**: `alertSection(openedAt, now)`,
`alertTypeMeta`).

Infraestructura de datos (móvil):
- `hooks/use-alerts-list.ts`: opción `drain` y efecto de drenado.
- `hooks/use-alerts-list.test.tsx` (nuevo).

Presentación:
- `screens/alerts/index.tsx`: partición, sección, calma, `StatusPill`.
- `i18n/catalog.ts`: seis claves.
- Sin cambios: `screens/alerts/rise-delays.ts` (`ALERT_ROW_RISE_DELAYS`, las
  cinco primeras abiertas), `components/card.tsx`, `theme/chunky-lip.ts`,
  `api/alerts.ts`, `api/query-keys.ts`, `screens/alert-detail/index.tsx`,
  `screens/home/index.tsx`.

Tests y candados:
- `screens/alerts/index.test.tsx` (enmiendas + `#223`).
- `__tests__/alerts-attended-canvas-fidelity.test.ts` (nuevo).
- `__tests__/ui-copy-table.ts` (`R12_ALERTS` +6 filas).
- Guards enmendados: ver tabla en [[requirements]] §Tabla de enmiendas.

Docs (G4): `docs/ui-guidelines.md` regla 12, una línea nueva (R19).

Backend: ninguno.

## Alternativas descartadas

- **Dos consultas por `status` con cursores separados** (el plan): imposible sin
  `?status=acked,closed` y sin `openCount`; ambos son cambios de backend fuera
  de alcance.
- **Tres consultas (`open`, `acked`, `closed`) y fusión por `openedAt`**: tres
  cursores y una fusión por orden en cliente; más peticiones y más estado que
  drenar una sola. Las atendidas pierden orden estable si una consulta va por
  detrás.
- **`openCount` en el backend**: da el contador sin drenar, pero toca backend,
  contrato y tests; separable en una feature posterior.
- **`SectionList`**: obligaría a reestructurar las secciones de tiempo y el
  candado de `RiseIn`; el pie del `FlatList` cubre «Atendidas» sin rehacer nada.
- **`FlashList`**: dependencia nueva sin necesidad medida.
- **Fichero de pantalla aparte para «Atendidas»**: movería `SCREEN_FILES` y los
  inventarios de copy sin beneficio con un solo consumidor.
- **`Card` para la fila atendida**: `twMerge` no sustituye `rounded-card` por un
  radio con nombre; ver D7.
- **Paginar atendidas en el servidor al pulsar «Ver más»**: el cursor no vale
  entre filtros; con el drenado ya están descargadas.

## Riesgos y mitigaciones

- Fixtures con `nextCursor` constante ciclan con el drenado: R-convención de
  cadenas terminadas en `null`; las enmiendas de `index.test.tsx` lo corrigen.
- Carrera entre drenado y refetch al enfocar: el efecto solo pide con
  `!isFetching`; un refetch reinicia desde la primera página (comportamiento de
  `useInfiniteQuery`) y el drenado vuelve a empezar.
- Flakes conocidos bajo carga en Salud/Inicio/Nutrición no tocan esta feature;
  si aparecen, rerun y deuda (no enmendar).
