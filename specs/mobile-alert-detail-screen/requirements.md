---
feature: "mobile-alert-detail-screen"
status: approved    # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-alert-detail-screen]] (#100)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (D1–D10), las sondas que las
> sostienen (§1), la errata del enunciado (§0) y el inventario de aserciones
> heredadas que cambian (D9), y [[../../docs/ui-guidelines|ui-guidelines]] para
> la carta de UI móvil (gate C8).
>
> **Commit base de toda medición**: `a9965ee3` (HEAD de
> `feature/100-mobile-alert-detail-screen`: `origin/main` `a07b67c4`, merge de
> PR #169, más un commit de harness que no toca `mobile-pet-tracker/`). En esa
> base, medido por el spec_author el 2026-09-28 desde `mobile-pet-tracker/` y
> sin pipe (`bunx jest --silent > f 2>&1; echo exit=$?`): **83 suites, 1545
> tests, 1 snapshot, `exit=0`**. `bunx tsc --noEmit` y `bunx expo lint`:
> `exit=0` y **salida de 0 bytes**. `.expo/types/router.d.ts` **no existe**.
> Ningún requisito congela recuentos absolutos: se declara el **delta** contra
> la base (§Verificación). Si la base se mueve, manda el delta.
>
> **Todo `describe` nuevo lleva el prefijo `#100 R<n>:`** (`docs/conventions.md`
> §Prefijo de feature). La cita es siempre `#100 R<n>`, nunca `#100` suelto
> (contrato con `src/__tests__/design-drift.test.ts`, #108).
>
> Todas las rutas de fichero de este documento son relativas a
> `mobile-pet-tracker/` salvo las que empiezan por `docs/` o `specs/`, que son
> relativas a la raíz del repo. Todo ancla es **por contenido** (un literal que
> se puede buscar con `grep -F`), nunca por número de línea.

## Contexto en una línea

El toque de una notificación push lleva al centro de alertas (#79 R10,
`router.push('/alerts')`) aunque el payload trae `data.alertId`, y la fila del
centro no navega (#78, decisión 8): no existe pantalla de detalle. Esta feature
la crea como ruta `alerts/[alertId]` del `Stack.Protected` raíz que dejaron #95
y #114, la alimenta **de la caché del listado que ya existe** (sin endpoint
nuevo, [[design]] §0 E1), hace que la columna de texto de cada fila la abra, y
que el toque de la notificación abra **esa** alerta. De paso cierra la
Observación 1 del reviewer de #114 (R9).

## Qué firma además el humano al aprobar esta spec

Las decisiones de producto de esta spec van numeradas **P-n** (en
[[design]], D-n son las decisiones técnicas) y cada una lleva la
recomendación del spec_author. Firmar la spec (§Aprobación) es firmar las
siete tal como están escritas; si el humano quiere otra opción en alguna, la
spec se reescribe antes de aprobarla.

1. **P1 — La fila conserva su botón "Marcar leída" y su columna de texto pasa
   a ser el enlace al detalle.** La tarjeta sigue sin `onPress` y la fila sin
   rol; el enlace es la columna (tipo, mascota, hace cuánto), de 44 pt de alto
   mínimo, con opacidad 0.8 al pulsar. *Recomendación: sí.* Alternativa
   descartada: toda la tarjeta pulsable con el botón dentro (dos objetivos
   táctiles anidados, [[design]] §Alternativas).
2. **P2 — Sin endpoint nuevo: el detalle busca la alerta en las páginas del
   listado que ya están en caché** (`alertKeys.list()`), y **si no la encuentra
   tras cargar vuelve al centro** con `router.dismissTo('/alerts')`, sin error
   visible. Techo conocido: una alerta que no está en las páginas cargadas (el
   backend devuelve 50 por página, las más recientes primero) no abre su
   detalle desde una notificación en frío; cae al centro, que es el
   comportamiento de hoy. *Recomendación: sí.* Si el humano quiere abrir
   **cualquier** alerta por id, eso es una feature de **backend** aparte
   (`GET /v1/alerts/:id`), **sin id asignado** por esta spec, y #100 no depende
   de ella (§Fuera de alcance, deuda).
3. **P3 — El detalle es `dangerouslySingular`**: tocar dos veces la misma
   notificación no apila dos detalles ni remonta la pantalla; una notificación
   de **otra** alerta sí apila su detalle encima (sondas S1 y S2 de [[design]]
   §1). *Recomendación: sí.*
4. **P4 — Copy nuevo, tres claves**: título de cabecera "Alerta" / "Alert",
   píldora de estado abierto "Sin leer" / "Unread", y línea de apertura
   "Detectada el {{date}}" / "Detected {{date}}", con la fecha en el formato
   local del idioma de la app (`es-MX` o `en-US`, fecha y hora). "Alert" en
   inglés coincide con `addReminder.alert`; en español `addReminder.alert` es
   "Aviso" y aquí se usa "Alerta" porque es el nombre de la pantalla (el centro
   se titula "Alertas"). *Recomendación: tal cual.*
5. **P5 — Tres enmiendas a texto normativo ajeno**, cada una con su casilla:
   A15 (lista de la excepción A11 de métricas en `docs/conventions.md` y
   `docs/ui-guidelines.md`), A16 (`specs/mobile-push-registration`, R10 de
   #79: el toque ya no va siempre a `/alerts`) y A17
   (`specs/mobile-alerts-center`, #78: la fila navega). *Recomendación:
   aprobar las tres; sin ellas R2, R6 y R7 contradicen specs aprobadas.*
6. **P6 — El 401 del listado infinito no llega a `onUnauthorized`** hoy
   (deuda previa del centro, no de esta feature). El detalle hereda el mismo
   comportamiento: con la primera página `unauthorized` no pinta nada y no
   navega (R4). *Recomendación: no arreglarlo aquí; queda como deuda.*
7. **P7 — Se extraen dos piezas del centro para compartirlas** sin importar
   una pantalla desde otra: la tabla de tipos a `src/utils/alert-meta.ts` y la
   consulta infinita a `src/hooks/use-alerts-list.ts`. Ninguna lleva test
   propio colocado (precedente: `src/utils/reminder-meta.ts`); las cubren los
   tests de las dos pantallas. *Recomendación: sí.*

## Requisitos funcionales

### R1 — Tres claves de copy nuevas

- **R1**: THE SYSTEM SHALL añadir a `src/i18n/catalog.ts`, en los dos idiomas y
  justo después de la entrada `'alerts.daysAgo'` de cada uno, **exactamente**
  estas tres claves:

  | Clave | `en` | `es` |
  |---|---|---|
  | `alerts.detailTitle` | `Alert` | `Alerta` |
  | `alerts.statusOpen` | `Unread` | `Sin leer` |
  | `alerts.openedAt` | `Detected {{date}}` | `Detectada el {{date}}` |

  SHALL registrarlas en `specs/mobile-ui-language/design.md` en una sección
  nueva `### §2.14 — Añadidos por #100 — Detalle de alerta`, insertada justo
  antes de la línea `## 3. La infraestructura`, con una fila por clave con la
  forma `` | — | `<clave>` | `<en>` | `<es>` | ← añadida por #100 (R1) `` (la de
  `alerts.openedAt` añade `**(param)**` tras la marca); y el candado de longitud
  del catálogo SHALL crecer en `+ 3` **visible** como último sumando.

  *Tests*: `src/providers/__tests__/language-provider.test.tsx`,
  `describe('#100 R1: el catálogo trae las tres claves del detalle de alerta')`,
  `it('registra las tres claves en los dos idiomas y en la tabla de la spec de idioma')`,
  calcado del `describe('#98 R3: …')` del mismo fichero. Y el candado heredado:
  en el `it('mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas')`
  del `describe('#65 R12: …')`, la expresión que termina en `- 6 + 1 + 2,`
  pasa a terminar en `- 6 + 1 + 2 + 3,` y el comentario que empieza por
  `// 259 en` se amplía con `+ 3 de #100 R1 (alerts.detailTitle, alerts.statusOpen, alerts.openedAt)`.
  Rojo real en `a9965ee3`: las claves no existen y el catálogo tiene 306.

### R2 — Ruta `alerts/[alertId]` en el Stack raíz, singular y con cabecera nativa

- **R2**: THE SYSTEM SHALL tener el route delgado
  `src/app/alerts/[alertId].tsx`, que lee `alertId` con
  `useLocalSearchParams<{ alertId: string }>()` y devuelve
  `<AlertDetailScreen alertId={alertId} />` importado de
  `'../../screens/alert-detail'`, sin más lógica; y SHALL declarar en el
  `Stack.Protected guard={status === 'authenticated'}` de `RootStack`
  (`src/app/_layout.tsx`) **nueve** `Stack.Screen`: los ocho de #114 en su orden
  y sin cambios, y por último `name="alerts/[alertId]"` con la prop
  `dangerouslySingular` (valor `true`) y
  `options={{ ...headerOptions, title: t('alerts.detailTitle') }}`.

  *Tests*: `src/app/__tests__/detail-stack.test.tsx`,
  `describe('#100 R2: el detalle de alerta vive en src/app/alerts/[alertId].tsx')`,
  `it('es un route delgado que importa la pantalla de src/screens/alert-detail')`;
  y `src/app/__tests__/layout.test.tsx`,
  `describe('#100 R2: la guarda de RootStack declara el detalle de alerta tras alerts')`,
  con `it('declara alerts/[alertId] como noveno hijo y singular')` y
  `it('le da la cabecera nativa de #95 con el título del detalle')`. El `it`
  heredado `'declara ocho rutas protegidas y alerts singular'` se ajusta
  ([[design]] D9). Rojo real en `a9965ee3`: el fichero no existe y la guarda
  tiene ocho hijos.

### R3 — El detalle pinta la alerta desde la caché del listado

- **R3**: WHEN `AlertDetailScreen` (`src/screens/alert-detail/index.tsx`)
  recibe un `alertId` que está en alguna página `kind: 'ok'` de la consulta
  `alertKeys.list()` THE SYSTEM SHALL pintar, dentro de un `ScrollView`
  `testID="screen-alert-detail"` con `className="flex-1 bg-background"`,
  `contentInsetAdjustmentBehavior="automatic"` y
  `contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}`,
  una `Card` `testID="alert-detail-card"` con `className="min-h-44 gap-3"` y
  **cuatro hijos en este orden**:
  1. `alert-detail-header` (`flex-row items-center gap-3`): un disco
     `size-11 items-center justify-center rounded-full <surface>` con el icono
     `alert-detail-icon` de tamaño 20 en el color de la tinta, y el texto
     `alert-detail-type` (`text-lg font-bold text-foreground`) con la etiqueta
     del tipo. Icono, `surface`, tinta y etiqueta salen de `alertTypeMeta(type)`
     (`src/utils/alert-meta.ts`): `geofence_exit` → `LocationSlash`,
     `bg-danger-soft`, `danger`, "Salió de la zona"; `battery_low` →
     `BatteryLow`, `bg-warning-soft`, `warning-strong`, "Batería baja";
     cualquier otro → `Bell`, `bg-default`, `muted`, "Aviso".
  2. `alert-detail-pet`: `Text selectable`, `text-sm font-semibold text-muted`,
     con `petName`.
  3. `alert-detail-opened-at`: `Text selectable`,
     `text-sm font-normal text-muted`, con
     `t('alerts.openedAt', { date: new Date(openedAt).toLocaleString(locale) })`
     y `locale = useLocale()`.
  4. `alert-detail-status`: `Text` con
     `self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted`
     y "Leída" si `status === 'acked'`, "Resuelta" si `status === 'closed'` y
     "Sin leer" en otro caso.

  La consulta la da `useAlertsList()` (`src/hooks/use-alerts-list.ts`), la
  **misma** `useInfiniteQuery` que hoy declara el centro (misma clave, mismo
  `queryFn`, mismo `getNextPageParam`), y el centro pasa a usarla; la tabla de
  tipos sale del centro a `src/utils/alert-meta.ts` y el centro usa
  `alertTypeMeta`. El centro no cambia de conducta.

  *Test*: `src/screens/alert-detail/index.test.tsx`,
  `describe('#100 R3: el detalle pinta la alerta de la caché de la lista')`, con
  `it.each` de tipos `'pinta icono, disco, tinta y etiqueta de $type'` (3
  filas), `it.each` de estados `'pinta la píldora de $status'` (3 filas),
  `it.each` de fechas `'formatea la apertura en $language con el locale del idioma'`
  (2 filas, que cruzan mes **y** año: `es` con `2026-12-31T12:00:00.000Z` →
  `/^Detectada el 31\/12\/2026,/`; `en` con `2027-01-02T12:00:00.000Z` →
  `/^Detected 1\/2\/2027,/`, que en `es-MX` sería `2/1/2027`) e
  `it('respeta las métricas A11 bajo cabecera nativa')`. Rojo real: el stub de
  R2 devuelve `null`.

### R4 — Carga, error y salida sin la alerta

- **R4**: WHILE la alerta no está en la caché y la consulta está pendiente o
  recargando THE SYSTEM SHALL pintar **solo** un `Skeleton`
  `testID="alert-detail-loading"` con `className="h-44 w-full rounded-card"`;
  IF la alerta no está y la primera página es `error`, `unreachable` o
  `missing-config` THEN THE SYSTEM SHALL pintar `Text selectable`
  `testID="alert-detail-error"` (`text-danger`) con "Algo salió mal" y un
  `Button` `testID="alert-detail-retry"` (`min-h-11`) "Reintentar" que vuelve a
  pedir la lista; IF la primera página es `unauthorized` THEN THE SYSTEM SHALL
  no pintar tarjeta, esqueleto ni error, y no navegar; IF todas las páginas
  son `ok`, no hay recarga en vuelo y la alerta no está THEN THE SYSTEM SHALL
  llamar **una sola vez** a `router.dismissTo('/alerts')`, también si después
  la lista se vuelve a pedir; y WHILE una caché vieja sin la alerta se está
  recargando THE SYSTEM SHALL pintar el esqueleto sin navegar y, WHEN la recarga
  trae la alerta, pintar la tarjeta sin haber navegado.

  *Test*: `src/screens/alert-detail/index.test.tsx`,
  `describe('#100 R4: el detalle pinta carga, error y salida sin la alerta')`,
  7 tests ([[design]] D8). **Declarado**: el `it` de `unauthorized` puede estar
  verde en el commit rojo (el verde de R3 ya pinta `null` sin la alerta y aún no
  navega); su rojo lo aporta el reviewer como prueba de mutación (quitar
  `firstPage?.kind === 'ok'` de la condición de salida lo pone rojo). Los otros
  seis: rojo real sobre el verde de R3.

### R5 — Marcar leída desde el detalle

- **R5**: WHILE la alerta está `open` y no se ha marcado en esta visita THE
  SYSTEM SHALL pintar bajo la tarjeta un `Button` `testID="alert-detail-ack"`
  con `accessibilityRole="button"`, `className="min-h-11"` y "Marcar leída";
  WHEN se pulsa THE SYSTEM SHALL llamar **una vez** a
  `ackAlert(baseUrl, token ?? '', alertId)` aunque se pulse dos veces con la
  llamada en vuelo, y según el resultado: `ok` → la píldora pasa a "Leída" y el
  botón desaparece; `already-closed` → la píldora pasa a "Resuelta" y el botón
  desaparece; `not-found` → `router.dismissTo('/alerts')` una vez;
  `unreachable` → `Text selectable` `testID="alert-detail-action-error"`
  (`text-danger`) con "No se pudo conectar con el servidor"; `error`,
  `missing-config` o promesa rechazada → el mismo texto con "Algo salió mal";
  `unauthorized` → `signOut()` una vez y ningún texto de error. THE SYSTEM
  SHALL NOT invalidar ni escribir la caché de `alertKeys.list()` al marcar: el
  centro lo refleja con su recarga al recuperar el foco (#97 R7, R8).

  *Tests*: `src/screens/alert-detail/index.test.tsx`,
  `describe('#100 R5: el detalle marca leída la alerta')`, 9 tests ([[design]]
  D8); y `src/__tests__/design-drift.test.ts`, el mapa `screenSignOutCalls`
  gana `'screens/alert-detail/index.tsx': 1` en el commit rojo, lo que pone
  rojo el `it('preserves every mutation sign-out with zero delta')`. Rojo real
  sobre el verde de R4: no hay botón ni llamada a `signOut`.

### R6 — La columna de texto de cada fila abre su detalle

- **R6**: THE SYSTEM SHALL convertir la columna de texto de cada fila del
  centro (`src/screens/alerts/index.tsx`, hoy
  `<View className="min-w-0 flex-1 gap-1">`) en un `Pressable`
  `testID={`${rowId}-link`}` con `accessibilityRole="button"`,
  `className="min-h-11 min-w-0 flex-1 gap-1"` y
  `style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}`, con los mismos
  tres hijos; WHEN se pulsa THE SYSTEM SHALL llamar una vez a
  `router.push({ pathname: '/alerts/[alertId]', params: { alertId: item.id } })`
  con el id de **esa** fila; y SHALL conservar el botón "Marcar leída" y la
  píldora como tercer hijo de la fila, la tarjeta sin `onPress` y la fila sin
  rol. Pulsar "Marcar leída" no navega.

  *Test*: `src/screens/alerts/index.test.tsx`,
  `describe('#100 R6: la columna de texto de cada fila abre su detalle')`, 3
  tests; y los dos literales heredados `'min-w-0 flex-1 gap-1'` del
  `describe('#78 R6: …')` pasan a `'min-h-11 min-w-0 flex-1 gap-1'` ([[design]]
  D9). Rojo real en la base: la columna es un `View` sin `testID`.

### R7 — El toque de la notificación abre su alerta

- **R7**: WHEN llega una respuesta de notificación, en caliente (listener de
  `addNotificationResponseReceivedListener`) o en frío
  (`getLastNotificationResponseAsync`), y
  `response.notification.request.content.data.alertId` es un `string` no vacío
  THE SYSTEM SHALL llamar a
  `router.push({ pathname: '/alerts/[alertId]', params: { alertId } })`; IF
  `alertId` falta, es vacío, no es `string` o `data` es `null` THEN THE SYSTEM
  SHALL llamar a `router.push('/alerts')`, como hoy. Con el router real: en
  frío la pila raíz termina en `["(tabs)", "alerts/[alertId]"]` y volver lleva a
  `/home` con `router.canGoBack()` `false`; en caliente el detalle se apila
  encima de la pantalla actual; un segundo toque de la **misma** alerta no
  cambia la pila ni remonta el detalle; uno de **otra** alerta apila su detalle
  y deja la ruta en `/alerts/<id>`; y uno sin `alertId` lleva a `/alerts`.

  *Tests*: `src/hooks/use-push-registration.test.tsx`,
  `describe('#100 R7: el toque abre el detalle de su alerta')`, `it.each` de 5
  payloads × {caliente, frío} = 10 tests; y
  `src/app/__tests__/alert-detail.notification.test.tsx` (nuevo),
  `describe('#100 R7: el toque apila el detalle de su alerta una sola vez')`,
  **un solo `it`**
  `'abre el detalle en frío y en caliente, sin duplicarlo, y cae al centro sin id'`.
  Rojo real en la base: el hook empuja `'/alerts'` siempre. **Declarado**: de
  los 10 del hook solo fallan en el rojo las 2 filas con `alertId` válido; las
  otras 8 esperan `'/alerts'` y salen verdes (son el candado de que el caso sin
  id no cambia).

### R8 — Ida y vuelta entre el centro y el detalle, con las pantallas reales

- **R8**: WHEN el usuario abre desde el centro una alerta de la **segunda**
  página del listado, la marca leída en el detalle y vuelve atrás THE SYSTEM
  SHALL mostrar esa fila con la píldora "Leída" y sin botón, gracias a la
  recarga de foco del centro; y WHEN se abre el detalle de un id que no está en
  el listado THE SYSTEM SHALL volver a `/alerts` dejando **una sola** entrada
  `alerts` en la pila.

  *Test*: `src/app/__tests__/alert-detail.navigation.test.tsx` (nuevo),
  `describe('#100 R8: fila, detalle y vuelta al centro con la alerta leída')`,
  **un solo `it`** `'abre la fila de la segunda página, la marca leída y la ve leída al volver'`.
  Rojo **por la ruta (b) de C4**: la conducta ya existe tras R6, así que el
  commit rojo planta en producción la mutación "`found` busca solo en
  `pages[0]`" y el verde la revierte ([[design]] D8).

### R9 — El candado de #114 R3 vacía los temporizadores (Observación 1 de #114)

- **R9**: WHILE `alerts` ya está en la pila, WHEN llega un segundo toque sin
  `alertId` THE SYSTEM SHALL no apilar otra `alerts` ni remontarla; y el `it`
  de `src/app/__tests__/reminders-alerts-stack.notification.test.tsx`
  `describe('#114 R3: el toque de notificación apila alerts una sola vez')`
  SHALL vaciar los temporizadores con
  `await act(async () => { jest.runOnlyPendingTimers(); });` justo después del
  segundo `await act(async () => tap({} as Notifications.NotificationResponse));`
  y antes de `expect(rootStack(app)).toEqual(['(tabs)', 'add-reminder', 'alerts']);`,
  de modo que **esas dos aserciones** (pila y montajes) sean las que se ponen
  rojas si `alerts` pierde `dangerouslySingular`, y no solo el `back` posterior.

  *Test*: el mismo `it` heredado, sin `describe` nuevo (Δ 0). Rojo **por la
  ruta (b)**: el commit rojo añade el vaciado y planta la mutación M7 (quitar
  `dangerouslySingular` del `Stack.Screen name="alerts"` en
  `src/app/_layout.tsx`); el verde revierte M7. **Declarado**: M7 también pone
  rojo el `it` de `#114 R1` de `layout.test.tsx`, que asevera esa prop. Sonda
  S4 de [[design]] §1: sin vaciado, M7 no pone roja la aserción de pila; con
  vaciado, sí; con vaciado y sin M7, verde.

### R10 — El detalle resuelve su copy por clave

- **R10**: THE SYSTEM SHALL resolver todo el copy del detalle y su título por
  clave literal, con exactamente las ocurrencias de la tabla `R13_ALERT_DETAIL`
  de `src/__tests__/ui-copy-table.ts` (11 filas, [[design]] D7): `_layout`
  `alerts.detailTitle`; en `src/screens/alert-detail/index.tsx`
  `alerts.openedAt`, `alerts.statusOpen`, `alerts.statusAcked`,
  `alerts.statusClosed`, `alerts.ack`, `common.somethingWentWrong` ×3,
  `common.cannotReachServer` y `common.retry`.

  *Test*: `src/__tests__/ui-language.test.ts`,
  `describe('#100 R10: el detalle de alerta resuelve su copy por clave')`,
  `it('registra cada ocurrencia del detalle')`. Rojo **por la ruta (b)**: el
  copy ya está escrito así tras R5; el commit rojo planta
  `const retryKey = 'common.retry' as const;` + `t(retryKey)` en el detalle y el
  verde lo revierte. **Declarado**: la mutación también pone rojo el `it`
  heredado `'resuelve cada ocurrencia de la tabla contra la clave exacta'` del
  `describe('#65 R18: …')`.

## Enmiendas a docs y a specs ajenas (gates propios)

Codex las aplica **después** de la firma de su casilla y **antes** del primer
commit rojo, en un commit propio
`docs(specs): apply amendments A15-A17 of #100`, con `<fecha>` = fecha del
commit que firma la casilla.

- **A15 — lista de A11 en los docs.** En `docs/conventions.md` y en
  `docs/ui-guidelines.md` Codex sustituye **literal** el fragmento

  ```
  `meal-schedule`, `pairing`, `reminders` y `alerts` (estas dos por la enmienda A13 de #114, 2026-09-23)—
  ```

  por

  ```
  `meal-schedule`, `pairing`, `reminders`, `alerts` (estas dos por la enmienda A13 de #114, 2026-09-23) y `alerts/[alertId]` (por la enmienda A15 de #100, <fecha>)—
  ```

  Comprobación: `grep -c 'enmienda A15 de #100' docs/conventions.md docs/ui-guidelines.md`
  → `1` en cada uno, y `src/__tests__/hero-header-amendments.test.ts` sigue
  verde.

- **A16 — `specs/mobile-push-registration/requirements.md` (#79 R10).**
  Codex inserta, justo antes de la línea `## Aprobación`:

  ```
  ## Enmienda externa A16 — la escribe #100 (<fecha>)

  `mobile-alert-detail-screen` (#100) abre el detalle de la alerta tocada. **R10
  cambia solo en el destino del toque**: en caliente y en frío, el hook llama a
  `router.push(notificationHref(response))`, que da
  `{ pathname: '/alerts/[alertId]', params: { alertId } }` cuando
  `response.notification.request.content.data.alertId` es un `string` no vacío
  y `'/alerts'` en cualquier otro caso. El banner en primer plano no cambia. Su
  test sigue en `src/hooks/use-push-registration.test.tsx`; el caso con
  `alertId` lo cubre `#100 R7`. Firma: casilla A16 de
  `specs/mobile-alert-detail-screen/requirements.md` §Aprobación.
  ```

- **A17 — `specs/mobile-alerts-center/requirements.md` (#78).** Codex
  inserta, justo antes de la línea `## Aprobación` (y por tanto después de la
  enmienda A14 de #114):

  ```
  ## Enmienda externa A17 — la escribe #100 (<fecha>)

  `mobile-alert-detail-screen` (#100) crea el detalle de alerta. (1)
  **Decisión 8**: la columna de texto de cada fila es un `Pressable`
  `alert-row-<id>-link` con `accessibilityRole="button"` que hace
  `router.push({ pathname: '/alerts/[alertId]', params: { alertId } })`; la
  tarjeta sigue sin `onPress` y la fila sin rol. (2) **Decisiones 11 y 12**: la
  clase de esa columna es `'min-h-11 min-w-0 flex-1 gap-1'`. (3) **Invariante
  de rol**: `accessibilityRole="button"` lo llevan el botón "Marcar leída" y el
  enlace de la columna, nada más. (4) **Fuera de alcance**: el detalle ya existe
  (`src/app/alerts/[alertId].tsx`); navegar a la geocerca o a la mascota sigue
  fuera. (5) La tabla de tipos vive en `src/utils/alert-meta.ts` y la consulta
  infinita en `src/hooks/use-alerts-list.ts`, compartidas con el detalle.
  Firma: casilla A17 de `specs/mobile-alert-detail-screen/requirements.md`
  §Aprobación.
  ```

  Comprobación de A16 y A17:
  `grep -c 'Enmienda externa A1[67] — la escribe #100' specs/mobile-push-registration/requirements.md specs/mobile-alerts-center/requirements.md`
  → `1` en cada uno.

## Fuera de alcance

Clasificado viñeta a viñeta, con su premisa verificada contra `a9965ee3`.

**Delimitaciones — no son features, no se registran:**

- **`payload`, `ackedAt`, `closedAt` y `geofenceId`** no se pintan: el
  enunciado pide tipo, mascota, apertura, estado y la acción.
- **El detalle no recarga al recuperar el foco** (no hay `useFocusEffect`):
  se alimenta de la caché que deja el centro o de su propia carga al montar
  (`staleTime: 0`).
- **El toque de un recordatorio** (`data.reminderId`, sin `alertId`) sigue
  yendo al centro de alertas, como hoy (R7, fila `{ reminderId }`).
- **Una notificación `alert_resolved`** con `alertId` abre el detalle en estado
  "Resuelta"; no hay pantalla aparte.
- **El techo de páginas** (P2): el detalle no pide páginas siguientes.
- **Cambios en `backend-pet-tracker/`, `infra/`, `init.sh`, CI, `app.json` o
  `package.json`**: ninguno. Cero dependencias nuevas; no se regenera el dev
  build (todo es JS de `expo-router 57.0.14` y `@tanstack/react-query 5.102.8`,
  ya en el bundle).
- **`src/app/alerts/_layout.tsx`**: no se crea; el detalle es hijo directo del
  `Stack.Protected` raíz (sonda S1).
- **Navegar desde el detalle a la geocerca o a la mascota**: no.
- **`CONTINUOUS_CORNER` en el `Skeleton`**: no; el esqueleto del centro tampoco
  lo lleva.

**Deuda candidata para el leader (sin id reservado):**

- **Endpoint `GET /v1/alerts/:id`** en backend, solo si el humano quiere abrir
  alertas fuera de las páginas cargadas (P2). Sería feature de backend aparte;
  #100 no depende de ella.
- **El `switch` de `ackAlert` duplicado** entre el centro y el detalle (difieren
  en `not-found`). Unificarlo exige un hook con dos políticas; no se hace aquí.
- **`routes()` y `rootStack()` copiados** en un quinto fichero de
  `src/app/__tests__/` (ya lo registró #114).
- **El 401 del listado infinito no llega a `onUnauthorized`** (P6).
- **`alerts-error` del centro no es `selectable`**; el del detalle sí.

## Coordinación con otras sesiones — candado del catálogo

#115, #116, #117 y #118 también añaden claves al catálogo (y #118 toca
`src/app/_layout.tsx`). Todas mueven la misma expresión del candado
(`expect(englishKeys).toHaveLength(…)` en
`src/providers/__tests__/language-provider.test.tsx`) y, las que añaden
pantallas, `SCREEN_FILES` en `src/__tests__/ui-language.test.ts`. Quien mergee
**segundo** recuenta sobre `main` conservando la suma visible y los sumandos
con su comentario de cada feature. #74 (sesión Frontend) no comparte ficheros
con esta spec.

## Verificación

- Comandos dirigidos **desde `mobile-pet-tracker/`** con `--runTestsByPath` y
  las rutas con corchetes o paréntesis **entre comillas simples**
  (`docs/conventions.md` §Filtros de jest); la lista exacta vive en [[tasks]].
  Comprobar siempre que el número de suites que imprime jest coincide con el de
  ficheros pedidos.
- **Delta de cierre contra `a9965ee3`**: `+3` suites
  (`src/screens/alert-detail/index.test.tsx` y los dos ficheros nuevos de
  `src/app/__tests__/`) y `+45` tests, con el reparto por fichero de
  [[design]] D8. Ninguna suite pasa de verde a roja.
- **Medición pendiente explícita (M-P1)**: tras el verde de R2, los tres
  ficheros que recorren `src/app/` con su propio `routes()`
  (`src/app/__tests__/detail-stack.navigation.test.tsx`,
  `src/app/__tests__/detail-stack.guard.test.tsx`,
  `src/app/__tests__/reminders-alerts-stack.navigation.test.tsx`) verán la
  ruta nueva. No está medido. Comando:
  `bunx jest --runTestsByPath 'src/app/__tests__/detail-stack.navigation.test.tsx' 'src/app/__tests__/detail-stack.guard.test.tsx' 'src/app/__tests__/reminders-alerts-stack.navigation.test.tsx' > /tmp/m-p1.log 2>&1; echo "exit=$?"`
  → `exit=0`, 3 suites. Si alguno sale rojo **porque su `routes()` no sabe
  pintar `alerts/[alertId]`**, se añade a ese `routes()` la misma rama de stub
  que ya da a las rutas que no ejercita, en el commit verde de R2, y se anota
  en `progress/impl_mobile-alert-detail-screen.md` y en [[design]] D9 (Δ tests
  0). Cualquier otro rojo: Codex para y lo reporta.
- `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit` y `bunx expo lint`
  con **`exit=0` y salida vacía**. Si `router.d.ts` existe, Codex **no** lo
  borra: pide al humano que lo borre.
- C8 (`CHECKPOINTS.md`): cero hex fuera de `src/theme/`, cero clases
  arbitrarias, cero `StyleSheet.create`, cero sombras legacy; métricas vía A11.
- `git grep -n "queryKey: \[" -- mobile-pet-tracker/src/screens/alert-detail`
  vacío (la clave sale de `alertKeys`), y
  `git grep -n "useFocusEffect" -- mobile-pet-tracker/src/screens/alert-detail`
  vacío.
- `git diff a9965ee3 -- backend-pet-tracker infra mobile-pet-tracker/package.json mobile-pet-tracker/app.json`
  vacío.

## Prueba de humo del humano (no delegable a IA)

Runtime: **dev build de Android**, nunca Expo Go. **No se regenera**: no entra
ningún módulo nativo. App en español salvo el paso 7.

**Precondiciones**

- Metro sirviendo el branch de #100 al dev build del teléfono.
  `google-services.json` es **por máquina**: la que sirve Metro tiene que
  tenerlo, como en #79 y #114.
- Backend de tu LAN con `PUSH_ENABLED=true` y `NOTIFIER_ENABLED=true`, como en
  la prueba de humo de #79. LocalStack usa las credenciales `test`/`test`.
- Un `alertId` real **abierto** de tu cuenta y su `petId`: haz
  `POST /v1/auth/login` para obtener `<jwt>` y luego
  `curl -H "Authorization: Bearer <jwt>" "$EXPO_PUBLIC_API_URL/v1/alerts"` (la URL base de la app) y toma
  el `id` y el `petId` del primer elemento con `"status":"open"`. Si no hay
  ninguna abierta, genera una antes de empezar: los pasos 1 a 6 la necesitan.
- Cada "disparar una notificación" es la **ruta alternativa determinista** de
  #79 (paso 5 de su prueba de humo), en la máquina del backend:

  ```bash
  aws --endpoint-url http://localhost:4566 sqs send-message \
    --queue-url "$(aws --endpoint-url http://localhost:4566 sqs get-queue-url \
                     --queue-name notifications --query QueueUrl --output text)" \
    --message-body '{"version":1,"kind":"alert","alertId":"<uuid>","petId":"<petId>","title":"Smoke 100","body":"Prueba de detalle","data":{"petId":"<petId>","alertId":"<uuid>"}}'
  ```

- `adb`: el teléfono sale **dos veces** en `adb devices -l` (IP y mDNS). En
  Windows, `adb devices -l | findstr 192.168` da la línea de la IP; usa
  **siempre** `adb -s <ip:puerto>` con ese valor.

**Pasos**

- [X] 1. Home → campana → Alertas → tocar el **texto** de una fila (tipo,
      mascota u hora): entra "Alerta" con cabecera nativa y flecha, sin barra
      flotante. La tarjeta muestra icono, tipo, mascota, "Detectada el …" con
      fecha y hora, y la píldora "Sin leer"; debajo, "Marcar leída". Al pulsar
      el texto de la fila baja su opacidad.
- [X] 2. "Marcar leída" en el detalle: la píldora pasa a "Leída" y el botón
      desaparece. Flecha atrás: en Alertas esa fila ya dice "Leída" y no tiene
      botón.
- [X] 3. "Marcar leída" **en la fila** de otra alerta abierta: se marca sin
      navegar al detalle.
- [X] 4. **Toque en caliente con `alertId`**: desde Home, disparar la
      notificación con el `alertId` real y tocar el banner → se abre el
      detalle de **esa** alerta. Atrás → Home.
- [X] 5. **Misma notificación otra vez**: con ese detalle abierto, disparar la
      misma y tocarla → sigue en el mismo detalle; **un** atrás sale a Home.
- [X] 6. **Toque en frío**:
      `adb -s <ip:puerto> shell am force-stop com.trackermex.pettracker`;
      disparar la notificación y tocarla en la bandeja → la app abre en el
      detalle de esa alerta. Atrás → Home **con** la barra; un segundo atrás
      sale de la app.
- [X] 7. **Alerta que no existe**: disparar con un `alertId` inventado (un uuid
      cualquiera) y tocarla → acaba en Alertas, sin mensaje de error. Tema
      oscuro (Profile) e inglés: el detalle toma fondo y texto del tema y su
      título es "Alert".
- [X] 8. Métricas: en el detalle no queda hueco entre la cabecera y la tarjeta,
      y el contenido termina ~24 px sobre la barra del sistema.

- [X] Prueba de humo superada (fecha: 2026-09-29)

## Aprobación

> Cinco casillas, cinco gates (lección `gate-humano-sin-casilla-donde-firmar`).
> A15, A16 y A17 autorizan cambiar texto normativo ajeno; la de la spec
> autoriza implementar y firma P1–P7; la de §Prueba de humo cierra la feature.

### Enmienda A15 — lista de A11 en `docs/conventions.md` y `docs/ui-guidelines.md`

- [x] Enmienda A15 aprobada por humano (fecha: 2026-09-28)

### Enmienda A16 — `mobile-push-registration` R10

- [x] Enmienda A16 aprobada por humano (fecha: 2026-09-28)

### Enmienda A17 — `mobile-alerts-center` decisiones 8, 11 y 12, invariante de rol y Fuera de alcance

- [x] Enmienda A17 aprobada por humano (fecha: 2026-09-28)

### Aprobación de la spec

- [x] Aprobado por humano (fecha: 2026-09-28) ← gate obligatorio antes de implementar
