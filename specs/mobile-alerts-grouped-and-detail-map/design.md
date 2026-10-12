---
feature: "mobile-alerts-grouped-and-detail-map"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-alerts-grouped-and-detail-map]]

> Ver [[requirements]] para los requisitos y [[../../docs/architecture|architecture]]
> para las capas. En el móvil, `src/utils/` hace de dominio (funciones puras,
> sin React ni red), `src/api/` de infraestructura y `src/screens/` +
> `src/app/` de presentación. Rutas relativas a `mobile-pet-tracker/` salvo
> que se diga otra cosa. Base: `origin/main` en `89fe2009`, re-medida sobre
> `c865f856` (con #166).

## Decisiones técnicas

- **D1 — Sección como función pura (R2).** `alertSection(openedAt, now)` vive
  en `src/utils/alert-sections.ts`, sin React, y recibe `now` como argumento
  para que el test fije el reloj sin espiar `Date.now`. Las medianoches se
  construyen con el constructor local `new Date(año, mes, día)` (y
  `día - 6`), que respeta DST y cruza mes y año por sí solo; la aritmética de
  `86 400 000` ms queda prohibida porque falla el día del cambio de hora
  (escenario D de la tabla de R2). «Esta semana» es ventana móvil de 7 días
  naturales, no semana de calendario: no depende del primer día de semana del
  locale.

- **D2 — Secciones dentro del `FlatList` existente (R3).** El orden se
  calcula sobre `fetched` (todas las páginas cargadas) y el `status` del
  servidor, como hoy (B7): para cada sección en orden `today`, `week`,
  `earlier`, primero sus abiertas y luego el resto, cada grupo en el orden del
  servidor. `rows` sigue aplicando el solapamiento de `acked` después de
  ordenar, así que marcar leída no mueve la fila (`#78 R7` sigue en verde).
  La cabecera se pinta en `renderItem` cuando la fila es la primera de su
  sección en `rows` (índice 0 o sección distinta de la fila anterior), dentro
  de un `View` `gap-4` que envuelve cabecera + `Card`; el resto de filas
  devuelven la `Card` sola, como hoy. `now` es el `new Date(alerts.dataUpdatedAt)`
  que la pantalla ya calcula (B8): las secciones solo cambian al recargar.
  Las tres claves de sección se escriben como `t('alerts.sectionToday')`,
  `t('alerts.sectionThisWeek')` y `t('alerts.sectionEarlier')` literales (o
  como objetos `labelKey: '…'` en el mismo fichero), porque `checkUses` solo
  cuenta esas dos formas (R16).

- **D3 — Contador fuera de la lista (R4).** El `View` `alerts-new-count` es
  hermano anterior de `alerts-list` dentro de `screen-alerts`.
  `ListHeaderComponent` queda como está: `#114 R5` exige `null` sin error de
  acción. El recuento se calcula sobre `rows` (ya con `acked` aplicado), así
  que baja al marcar leída sin recargar. Las dos claves van como
  `t('alerts.newOne')` y `t('alerts.newMany', { count })` literales en dos
  ramas: un `t(n === 1 ? … : …)` deja `checkUses` en 0 (R16).

- **D4 — Severidad como dato del tipo (R5, R6).** `AlertTypeMeta` gana
  `border: 'border-danger' | 'border-warning-strong' | 'border-muted'` y la
  tabla `ALERT_TYPE_META` / `UNKNOWN_ALERT_META` lo rellena; las pantallas no
  deciden colores. La fila abierta añade ` border-2 ${meta.border}` a su
  `className`; `Card` ya pasa por `tailwind-merge`, que retira `border` y
  `border-border` de su base (B19), así que no hace falta tocar `Card`. Lo
  mismo en `alert-detail-card`. Severidad = borde + icono + etiqueta: el
  color nunca va solo.

- **D5 — Posición y distancia como funciones puras (R7).**
  `src/utils/alert-location.ts` exporta `alertPosition`, `distanceMeters` y
  `formatDistance`. `alertPosition` es la frontera de confianza con el
  `payload` (`Record<string, unknown>` del servidor): valida tipo, finitud y
  rango, y devuelve el tipo `MapCoordinates` de `PetMap` para pasarlo sin
  conversión. Haversine con `R = 6 371 000` m basta a escala de barrio (error
  < 0,5 %); no hace falta librería.

- **D6 — Consulta de zonas: lista por mascota y emparejado por id (R10–R13).**
  No hay get-by-id en el cliente (B4) y añadirlo es backend (fuera de
  alcance). La lista tiene como mucho 5 zonas (B5) y su clave
  `geofenceKeys.list(petId)` es la misma que usan Mapa, Zonas y el editor
  (B16): la consulta suele salir de caché y la invalidan las mismas
  mutaciones. Se empareja por `id === alert.geofenceId`, nunca por
  `geofenceName` (los nombres se repiten y se renombran). La consulta vive en
  un componente hijo no exportado de `src/screens/alert-detail/index.tsx`,
  `AlertDetailMap({ alert, position })`, que solo se monta cuando
  `alertPosition(alert.payload)` no es `null`; dentro,
  `useQuery({ queryKey: geofenceKeys.list(alert.petId), queryFn: () =>
  listGeofences(baseUrl, token ?? '', alert.petId), enabled: alert.geofenceId
  !== null })`, con el mismo `baseUrl` (`process.env.EXPO_PUBLIC_API_URL`) y
  `token` de `useAuth()` que ya usa la pantalla. Cualquier estado que no sea
  `ok` con la zona encontrada degrada a «mapa con marcador y sin círculo»: la
  zona es contexto, no el contenido de la pantalla, y no merece un error
  propio. `unauthorized` lo atiende el `QueryClient` global
  (`src/providers/query-provider.tsx`), sin `signOut(` en la pantalla.

- **D7 — Mini-mapa con `PetMap` sin modificar (R8, R10, R14).**
  `alert-detail-map` es un `View` `h-52 overflow-hidden rounded-card` con
  `style={CONTINUOUS_CORNER}` (esquina no-cápsula: `#62 R14`) y un único hijo
  `PetMap`. `center` = `marker` = la posición; `polylines={[]}`;
  `circles` = la zona (R10, R14) o `[]` (R11–R13); `zoom` =
  `zoomForRadius(d + radiusM)` solo cuando hay zona, que encuadra la zona
  entera alrededor del marcador con la utilidad ya probada (B12); sin zona, el
  `MAP_ZOOM` por defecto de `PetMap`. `colorScheme` sale de `useUniwind().theme`
  como en Mapa y en el editor. Los huecos de `PetMap` (sin encuadre por
  límites, sin nombre accesible, gestos fijos: B11) quedan en Preguntas
  abiertas P3 y P4, no se parchean aquí.

- **D8 — Regla 10 sin perder el fondo (R9).** Con mapa, la raíz
  `screen-alert-detail` pasa a `flex-1` (sin `bg-`), y el fondo de la pantalla
  lo pinta el `contentStyle` del stack nativo con el token `background` del
  tema, igual que la cabecera. Es el mismo montaje que ya funciona en el
  editor de zona en dev build (B14). Sin mapa, la raíz conserva
  `flex-1 bg-background`: carga, error y alertas sin posición no cambian. El
  riesgo residual (que el stack pinte un gris distinto del token) es P7 y lo
  cierra el smoke R17.3.

- **D9 — Distancia al borde (R10, R14).** La línea dice cuánto se alejó la
  mascota de la zona, que es lo que la alerta comunica: `d - radiusM`, no `d`.
  Por debajo de 1 m redondeado (dentro o en el borde: el GPS ya volvió o la
  alerta llegó tarde) no se pinta: «A 0 m de Casa» confunde. `formatDistance`
  usa `m` hasta 999 y `km` con un decimal desde 1 000 (redondeo previo), con
  punto decimal en los dos idiomas como `fmtKm` de Inicio.

- **D10 — «Ver en el mapa» (R15).** El detalle vive en el stack raíz; la
  pestaña Mapa en `(tabs)`. `router.dismissTo('/map')` cierra el detalle y
  enfoca la pestaña, como ya hace Vincular (B15); `router.push('/map')`
  apilaría un segundo Mapa sobre el detalle. Antes se llama a
  `selectPet(alert.petId)` (el proveedor está montado en `src/app/_layout.tsx`
  sobre todo el stack), porque Mapa centra en la última posición de la mascota
  seleccionada. La receta visual es la del secundario neutro de #166
  (`docs/ui-guidelines.md` punto 13), congelada en R15 tras medir M2.

- **D11 — Copy y candados en paralelo.** Siete claves nuevas en `alerts.*`,
  aunque `home.viewOnMap`, `reminders.thisWeek` y `home.nextVaccineToday`
  digan lo mismo: el catálogo ya duplica por namespace, y compartir una clave
  entre pantallas acopla su copy. #167, #168, #169 y #171 mueven los mismos
  candados agregados (longitud del catálogo, `R13_ALERT_DETAIL`, sumas de
  `consistency-classnames`, `§2.N` del registro de idioma): se integra con
  `git merge origin/main`, nunca rebase, y en el conflicto se **suman** las
  líneas de cada feature.

## Archivos afectados

Dominio (funciones puras):
- `src/utils/alert-sections.ts` — **nuevo**: `alertSection` (R2).
- `src/utils/alert-location.ts` — **nuevo**: `alertPosition`,
  `distanceMeters`, `formatDistance` (R7).
- `src/utils/alert-meta.ts` — campo `border` en `AlertTypeMeta`,
  `ALERT_TYPE_META` y `UNKNOWN_ALERT_META` (R5).

Presentación:
- `src/screens/alerts/index.tsx` — orden por sección, cabeceras, contador,
  borde de severidad (R3, R4, R5).
- `src/screens/alert-detail/index.tsx` — borde de severidad, `AlertDetailMap`,
  distancia, raíz condicional, CTA (R6, R8–R15).
- `src/app/_layout.tsx` — `contentStyle` de `alerts/[alertId]` (R9).

i18n:
- `src/i18n/catalog.ts` — siete claves en `en` y `es` (R1).

Tests:
- `src/utils/alert-sections.test.ts` — **nuevo** (R2).
- `src/utils/alert-location.test.ts` — **nuevo** (R7).
- `src/screens/alerts/index.test.tsx` (R3, R4, R5).
- `src/screens/alert-detail/index.test.tsx` (R6, R8–R15; cambia la aserción
  exacta de `#100 R3` A11, B17/B19).
- `src/app/__tests__/layout.test.tsx` (R9; cambia el `toEqual` de `#100 R2`,
  B18).
- `src/providers/__tests__/language-provider.test.tsx` (R1).
- `src/app/__tests__/alert-detail.navigation.test.tsx` (Enmienda E2: doble de
  `pet-map`, porque la ruta del detalle ya importa el mini-mapa).
- `src/__tests__/ui-copy-table.ts`, `src/__tests__/ui-language.test.ts`,
  `src/__tests__/consistency-classnames.test.ts` (R16).

Docs:
- `specs/mobile-ui-language/design.md` — sección `§2.N` de #170 (R1).

No se tocan: `src/components/pet-map.tsx`, `src/components/card.tsx`,
`src/api/*`, `backend-pet-tracker/`.

## Alternativas descartadas

- **`SectionList`** para las secciones: cambia la forma de `data` (los seis
  candados de `props.data` de `#78 R7`/`R9` pasan a rojo), y obliga a
  reescribir paginación y vacío. El `FlatList` con cabecera en la primera
  celda da lo mismo sin mover candados.
- **Semana de calendario** (lunes o domingo): depende del locale y deja
  «Esta semana» casi vacía los lunes.
- **Contador en `ListHeaderComponent`**: rompe `#114 R5`. **En `headerRight`**:
  fuera del artboard y sin precedente en el repo.
- **Endpoint `GET /pets/:petId/geofences/:id`**: backend, fuera de alcance; la
  lista acotada a 5 y en caché cubre el caso.
- **Emparejar por `payload.geofenceName`**: ambiguo con nombres repetidos y
  falso tras un renombrado; R12 lo prohíbe con un candado.
- **Distancia calculada en el backend o guardada en el `payload`**: backend,
  y las alertas ya guardadas no la tendrían.
- **Distancia al centro de la zona**: mide algo que el usuario no ve en el
  mapa (P2).
- **Píldora de cristal superpuesta al mapa con la distancia**: un `bg-` sobre
  el mapa choca con la regla 10 y `PetMap` no expone capa propia (P4).
- **Modificar `PetMap`** (encuadre por límites, gestos, nombre accesible):
  vetado por el alcance; queda en P3 y P4 para otra feature.
- **`router.push('/map')`**: apila un segundo Mapa sobre el detalle.
