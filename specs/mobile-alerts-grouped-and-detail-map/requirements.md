---
feature: "mobile-alerts-grouped-and-detail-map"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-alerts-grouped-and-detail-map]]

> Feature #170. Primera parte de la fila 4 «Collar y seguridad» del canvas
> aprobado el 2026-10-06 (artboards «Alertas» y «Detalle de alerta»).
> Base congelada: `origin/main` en `89fe2009`, re-medida el 2026-10-12 sobre
> `c865f856` (merge de `origin/main` en `d2b8b0ae`, que trae #166
> `mobile-chunky-cta`): B1–B19 y los candados de la tabla dan lo mismo, y lo
> que #166 añade está en la fila «Secundarios neutros», en R15 y en R16. Rutas
> de código relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.

## Contexto y base medida

Cada constante de esta spec se midió en `89fe2009` con el comando que la
acompaña. Ningún ancla es un número de línea.

| # | Hecho | Comando (desde la raíz del repo) | Salida en `89fe2009` |
|---|---|---|---|
| B1 | El móvil ya recibe `geofenceId` en cada alerta | `grep -c 'geofenceId: string . null;' mobile-pet-tracker/src/api/types.ts` | `1` |
| B2 | El backend lo sirve en la respuesta | `grep -cF 'geofenceId: alert.geofenceId' backend-pet-tracker/src/modules/alerts/infrastructure/mappers/alert-response.mapper.ts` | `1` |
| B3 | Borrar la zona deja `geofenceId` en null | `grep -cF "onDelete: 'set null'" backend-pet-tracker/src/db/schema/alerts.schema.ts` | `1` |
| B4 | El cliente no tiene get-by-id de zonas: solo lista por mascota | `grep -c '^export async function getGeofence' mobile-pet-tracker/src/api/geofences.ts` | `0` |
| B5 | Tope de zonas por mascota | `grep -cF 'GEOFENCE_MAX_PER_PET = 5' mobile-pet-tracker/src/api/geofences.ts` | `1` |
| B6 | Página de alertas del backend | `grep -cF 'ALERTS_PAGE_SIZE = 50' backend-pet-tracker/src/modules/alerts/alerts.constants.ts` | `1` |
| B7 | La lista ordena abiertas primero sobre todo lo cargado | `grep -cF "fetched.filter((alert) => alert.status === 'open')" mobile-pet-tracker/src/screens/alerts/index.tsx` | `1` |
| B8 | El «ahora» de la lista es la hora de la última carga | `grep -cF 'const now = new Date(alerts.dataUpdatedAt);' mobile-pet-tracker/src/screens/alerts/index.tsx` | `1` |
| B9 | El tipo desconocido ya se pinta como «Aviso» con campana | `grep -cF "'alerts.typeUnknown': 'Aviso'" mobile-pet-tracker/src/i18n/catalog.ts` | `1` |
| B10 | «Sin leer» y «Detectada el …» ya existen | `grep -cF -e "'alerts.statusOpen': 'Sin leer'" -e "'alerts.openedAt': 'Detectada el {{date}}'" mobile-pet-tracker/src/i18n/catalog.ts` | `2` |
| B11 | `PetMap` no expone encuadre por límites, nombre accesible ni apagado de gestos; su `uiSettings` es fijo | `grep -c -e fitBounds -e accessibilityLabel -e scrollGesturesEnabled mobile-pet-tracker/src/components/pet-map.tsx` y `grep -cF 'uiSettings: { zoomControlsEnabled: false },' mobile-pet-tracker/src/components/pet-map.tsx` | `0` y `1` |
| B12 | Encuadre de un radio ya resuelto en el repo | `grep -cF 'export function zoomForRadius(radiusM: number): number' mobile-pet-tracker/src/utils/zoom-for-radius.ts` | `1` |
| B13 | La raíz del detalle declara fondo opaco hoy | `grep -cF 'className="flex-1 bg-background"' mobile-pet-tracker/src/screens/alert-detail/index.tsx` (la única aparición es la raíz `screen-alert-detail`) | `1` |
| B14 | El stack nativo ya pinta `colors.background` bajo cada pantalla `card`, también bajo el editor de zona, cuyo mapa funciona en dev build | `grep -c 'backgroundColor: colors.background' mobile-pet-tracker/node_modules/expo-router/build/react-navigation/native-stack/views/NativeStackView.native.js` | `2` |
| B15 | Llevar al Mapa desde una pantalla del stack raíz: precedente | `grep -cF "router.dismissTo('/map');" mobile-pet-tracker/src/screens/pairing/index.tsx` | `1` |
| B16 | La caché de zonas es compartida | `grep -c 'geofenceKeys.list(' mobile-pet-tracker/src/screens/map/index.tsx` | `≥ 1` |
| B17 | La tarjeta del detalle hoy, candada con `toBe` exacto | `grep -cF "'rounded-card border border-border bg-surface p-4 shadow-sm min-h-44 gap-3'" mobile-pet-tracker/src/screens/alert-detail/index.test.tsx` | `1` |
| B18 | Las opciones del detalle en el layout, candadas con `toEqual` | `grep -cF "title: 't:alerts.detailTitle'," mobile-pet-tracker/src/app/__tests__/layout.test.tsx` | `1` |
| B19 | Salida de `twMerge` sobre la base de `Card` (medida con `node -e` en `mobile-pet-tracker/`) | `node -e "const {twMerge}=require('tailwind-merge');console.log(twMerge('rounded-card border border-border bg-surface p-4 shadow-sm','min-h-44 gap-3 border-2 border-danger'))"` | `rounded-card bg-surface p-4 shadow-sm min-h-44 gap-3 border-2 border-danger` |

Candados agregados que esta feature mueve (valores en `89fe2009`; se vuelven a
medir al arrancar, §Medir al arrancar):

| Candado | Fichero · patrón grepeable | Valor en `89fe2009` | Cambio de #170 |
|---|---|---|---|
| Longitud del catálogo | `src/providers/__tests__/language-provider.test.tsx` · `expect(englishKeys).toHaveLength(` | expresión que suma `386` | `+ 7 // #170 R1` |
| Filas de la pantalla de alertas | `src/__tests__/ui-copy-table.ts` · `export const R12_ALERTS` | `20` filas (`awk '/^export const R12_ALERTS/,/^];/{ if (/\{ file/) n++ } END { print n }' mobile-pet-tracker/src/__tests__/ui-copy-table.ts`) | `+ 5` filas (R16) |
| Filas del detalle | `src/__tests__/ui-language.test.ts` · `expect(R13_ALERT_DETAIL).toHaveLength(11 - 3)` | `8` | `11 - 3 + 2 // #170 R16` |
| `SCREEN_FILES` | `src/__tests__/ui-language.test.ts` · `expect(SCREEN_FILES).toHaveLength(` | sin cambio | `0`: los dos ficheros ya están en la tabla |
| Cifras tabulares | `src/__tests__/consistency-classnames.test.ts` · `describe('#62 R15: todo contador usa cifras tabulares'` | sin fila para `alerts` ni `alert-detail` | `+2` filas de `1` y `+ 2` en la suma de `#69 R10` (R16) |
| Esquinas continuas | `src/__tests__/consistency-classnames.test.ts` · `describe('#62 R14: toda esquina no-cápsula que dibuja el repo es continua'` | sin fila para `alert-detail` | `+1` fila de `1` y `+ 1` en la suma (R16) |
| `signOut(` por pantalla | `src/__tests__/design-drift.test.ts` · `'screens/alert-detail/index.tsx': 0,` | `0` y `0` en `alerts` | sin cambio: la consulta de zonas no llama a `signOut` |
| Claves de consulta literales | `src/__tests__/design-drift.test.ts` · `it('keeps literal query keys out of every migrated screen'` | `[]` | sin cambio: se usa `geofenceKeys.list(petId)` |
| Primarios sólidos | `src/__tests__/consistency-classnames.test.ts` · `describe('#62 R1:` y `describe('#166 R2:` (cuentan `rounded-xl bg-accent`) | `19` en `c865f856` | sin cambio: el CTA de R15 es secundario |
| Secundarios neutros | `src/__tests__/consistency-classnames.test.ts` · `describe('#166 R3: el secundario neutro lleva el labio gris'` | `4` filas en `rows`, `4` testIDs en el inventario y `toBe(4)` en los recuentos de `border-lip-gray` y `border-b-6`, en `c865f856` | `+1` fila, `+1` testID y los dos recuentos a `4 + 1` (R16) |

**Copy en paralelo.** #167, #168, #169 y #171 también añaden claves y filas a
los mismos candados. Las cuatro y esta se integran con **merge** de
`origin/main`, nunca con rebase; en el conflicto se suman los deltas de cada
feature, no se elige uno.

## Copy nuevo (propuesta, pendiente de aprobación humana)

Las siete claves son etiquetas de interfaz (§Dirección de arte punto 6), no
frases de Pingo: ninguna va en boca de la mascota. Los valores son una
**propuesta**: el canvas no aprobó copy (§Preguntas abiertas, P1).

| Clave | `es` | `en` | Dónde |
|---|---|---|---|
| `alerts.newOne` | `1 nueva` | `1 new` | contador de la lista, n = 1 (R4) |
| `alerts.newMany` | `{{count}} nuevas` | `{{count}} new` | contador de la lista, n ≥ 2 (R4) |
| `alerts.sectionToday` | `Hoy` | `Today` | cabecera de sección (R3) |
| `alerts.sectionThisWeek` | `Esta semana` | `This week` | cabecera de sección (R3) |
| `alerts.sectionEarlier` | `Anteriores` | `Earlier` | cabecera de sección (R3) |
| `alerts.distanceFromZone` | `A {{distance}} de {{zone}}` | `{{distance}} from {{zone}}` | línea de distancia del detalle (R10) |
| `alerts.viewOnMap` | `Ver en el mapa` | `View on map` | CTA del detalle (R15) |

`{{distance}}` es la cadena de `formatDistance` (R7): `85 m`, `1.2 km`.
`{{zone}}` es `Geofence.name` tal cual llega del servidor.

## Requisitos funcionales

Notación: «abierta» = `status === 'open'` **tras** el solapamiento local de la
marca de leída (`acked`) de la pantalla de alertas. «Posición válida» la define
R7.

### Lista de alertas (`src/screens/alerts/index.tsx`)

- **R1 — Catálogo.** THE SYSTEM SHALL traer en `src/i18n/catalog.ts` las siete
  claves de §Copy nuevo con esos valores exactos en `es` y en `en`, y cada una
  registrada en `specs/mobile-ui-language/design.md` en una sección nueva
  `### §2.N — Añadidos por #170 — Alertas agrupadas y mini-mapa` (N = siguiente
  libre al arrancar; `§2.24` en `89fe2009`) con una fila
  `| — | \`<clave>\` | \`<en>\` | \`<es>\` | ← añadida por #170 (R1) |`; y la
  expresión de longitud del catálogo SHALL sumar `+ 7 // #170 R1`.

- **R2 — Sección por hora local.** THE SYSTEM SHALL exportar
  `alertSection(openedAt: string, now: Date): 'today' | 'week' | 'earlier'`
  desde `src/utils/alert-sections.ts`, donde, en la zona horaria del
  dispositivo:
  - `startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())`
    (medianoche local de hoy);
  - `startWeek` = medianoche local de hace 6 días naturales
    (`new Date(año, mes, día - 6)`, nunca `startToday - 6 × 86 400 000`);
  - WHEN `Date.parse(openedAt) >= startToday` (incluye alertas con hora futura
    por desfase de reloj) THEN `'today'`;
  - WHEN `startWeek <= Date.parse(openedAt) < startToday` THEN `'week'`;
  - IF `Date.parse(openedAt) < startWeek` o es `NaN` THEN `'earlier'`.

  «Esta semana» es una ventana **móvil** de 7 días naturales que incluye hoy;
  no es la semana de calendario (sin dependencia del primer día de semana del
  locale).

- **R3 — Secciones en la lista.** WHEN la lista tiene filas THE SYSTEM SHALL:
  1. ordenarlas por sección (`today`, `week`, `earlier`, con
     `alertSection(alert.openedAt, new Date(alerts.dataUpdatedAt))`) y, dentro
     de cada sección, abiertas primero y el resto después, conservando el
     orden del servidor en cada grupo. El orden se calcula sobre el `status`
     del servidor (como hoy B7): marcar leída no reordena. `props.data` del
     `FlatList` `alerts-list` sigue siendo `Alert[]` en ese orden;
  2. pintar antes de la primera fila de cada sección no vacía, y solo ahí, una
     cabecera `Text` con `testID` `alerts-section-today` |
     `alerts-section-week` | `alerts-section-earlier`,
     `accessibilityRole="header"`, `className` exacto
     `text-xs font-bold uppercase text-muted` y el texto de
     `alerts.sectionToday` | `alerts.sectionThisWeek` |
     `alerts.sectionEarlier`. La cabecera y la primera fila de su sección
     comparten un envoltorio `View` con `className` exacto `gap-4`, que es el
     padre de la cabecera y ancestro de la fila `alert-row-<id>`;
  3. IF una sección queda vacía THEN no pinta su cabecera;
  4. calcular las secciones sobre todas las páginas cargadas: WHEN llega la
     página siguiente con filas de una sección que ya tiene cabecera THEN esa
     cabecera sigue saliendo una sola vez.

- **R4 — Contador «N nuevas».** THE SYSTEM SHALL contar las filas abiertas de
  todas las páginas cargadas (tras el solapamiento de `acked`) y:
  - IF el recuento es 0 (incluye carga, error y lista vacía) THEN no pinta
    `alerts-new-count`;
  - WHEN es 1 THEN pinta `alerts-new-count` con el texto de `alerts.newOne`;
  - WHEN es n ≥ 2 THEN lo pinta con `alerts.newMany` y `count = n`;
  - WHEN el usuario marca leída una fila abierta THEN el recuento baja en uno
    sin recargar, y al llegar a 0 el contador desaparece.

  Anatomía: `View` `testID="alerts-new-count"` con `className` exacto
  `mx-6 mt-6 self-start rounded-full bg-danger px-3 py-1`, hijo directo de
  `screen-alerts` y hermano anterior de `alerts-list` (no va en
  `ListHeaderComponent`, que `#114 R5` exige `null` sin error); dentro, un
  único `Text` `testID="alerts-new-count-text"` con `className` exacto
  `text-xs font-bold text-danger-foreground` y `style={TABULAR_NUMS}`.

- **R5 — Severidad en la fila.** THE SYSTEM SHALL añadir a `ALERT_TYPE_META`
  y a `UNKNOWN_ALERT_META` (`src/utils/alert-meta.ts`) un campo `border`:
  `geofence_exit` → `border-danger`, `battery_low` → `border-warning-strong`,
  desconocido → `border-muted`; y la `Card` de cada fila `alert-row-<id>`:
  - WHEN la fila está abierta THEN su `className` contiene `border-2` y el
    `border` de su tipo, y no contiene `border-border` (un candado por tipo:
    `geofence_exit`, `battery_low`, `mystery_type`);
  - WHEN la fila está `acked` o `closed` THEN contiene `border` y
    `border-border` y no contiene `border-2` ni el `border` de su tipo (un
    candado por estado);
  - en las tres ramas de tipo, el icono (`iconName` del doble de reicon), la
    tinta, el fondo del círculo y la clave de la etiqueta son los de
    `alertTypeMeta(type)`: `LocationSlash`/`danger`/`bg-danger-soft`/
    `alerts.typeGeofenceExit`, `BatteryLow`/`warning-strong`/
    `bg-warning-soft`/`alerts.typeBatteryLow`, `Bell`/`muted`/`bg-default`/
    `alerts.typeUnknown`. Severidad = color + icono + texto, nunca solo color.

### Detalle de alerta (`src/screens/alert-detail/index.tsx`)

- **R6 — Severidad en el detalle.** WHEN la alerta está abierta THE SYSTEM
  SHALL dar a `alert-detail-card` `border-2` y el `border` de su tipo (un
  candado por tipo, tres); WHEN está `acked` o `closed` THEN su `className`
  sigue siendo exactamente
  `rounded-card border border-border bg-surface p-4 shadow-sm min-h-44 gap-3`
  (un candado por estado). La aserción exacta de `#100 R3` ›
  `'respeta las métricas A11 bajo cabecera nativa'` (alerta abierta
  `geofence_exit`) pasa a esperar
  `rounded-card bg-surface p-4 shadow-sm min-h-44 gap-3 border-2 border-danger`
  (B19).

- **R7 — Posición, distancia y formato.** THE SYSTEM SHALL exportar desde
  `src/utils/alert-location.ts`:
  - `alertPosition(payload: Record<string, unknown>): MapCoordinates | null`
    (tipo de `src/components/pet-map.tsx`): devuelve
    `{ latitude: lat, longitude: lng }` IF `payload.position` es un objeto no
    nulo con `lat` y `lng` de tipo `number`, ambos finitos, con
    `-90 <= lat <= 90` y `-180 <= lng <= 180`; en cualquier otro caso `null`.
    Una fila de test por rama de la tabla de R8;
  - `distanceMeters(a: MapCoordinates, b: MapCoordinates): number`:
    haversine con radio `6_371_000` m;
  - `formatDistance(meters: number): string`: IF `Math.round(meters) < 1000`
    THEN `` `${Math.round(meters)} m` `` ELSE
    `` `${(meters / 1000).toFixed(1)} km` `` (punto decimal en los dos
    idiomas, como `fmtKm` de `src/screens/home/format.ts`).

- **R8 — Mini-mapa.** WHEN la alerta está cargada y `alertPosition(payload)`
  no es `null` THE SYSTEM SHALL pintar, entre `alert-detail-card` y el CTA de
  R15, un `View` `testID="alert-detail-map"` con `className` exacto
  `h-52 overflow-hidden rounded-card` y `style={CONTINUOUS_CORNER}`, cuyo único
  hijo es `PetMap` (sin modificar) con `center` = `marker` = esa posición,
  `polylines={[]}` y `colorScheme` = `'dark'` IF `useUniwind().theme ===
  'dark'` ELSE `'light'`. IF `alertPosition(payload)` es `null` THEN no pinta
  `alert-detail-map`, ni `alert-detail-distance`, y no llama a
  `listGeofences`. Tabla de ramas, un candado cada una:

  | Fila | `payload` | ¿Mapa? |
  |---|---|---|
  | vacío | `{}` | no |
  | batería real | `{ batteryPct: 12 }` | no |
  | posición nula | `{ position: null }` | no |
  | posición no objeto | `{ position: 'x' }` | no |
  | `lat` texto | `{ position: { lat: '19.4', lng: -99.1 } }` | no |
  | falta `lng` | `{ position: { lat: 19.4 } }` | no |
  | `lat` NaN | `{ position: { lat: NaN, lng: -99.1 } }` | no |
  | `lng` infinito | `{ position: { lat: 19.4, lng: Infinity } }` | no |
  | `lat` fuera | `{ position: { lat: 90.0001, lng: 0 } }` | no |
  | `lng` fuera | `{ position: { lat: 0, lng: -180.0001 } }` | no |
  | borde válido | `{ position: { lat: 90, lng: -180 } }` | sí |
  | real del motor | `{ position: { lat: 19.4342637, lng: -99.1332, ts: '2026-09-11T10:00:00.000Z', flags: [] }, geofenceName: 'Casa' }` | sí |

- **R9 — Mapa sin fondo encima (regla 10).** WHEN el detalle pinta
  `alert-detail-map` THE SYSTEM SHALL dejar la raíz `screen-alert-detail` con
  `className` exacto `flex-1`, y ningún ancestro del `PetMap` hasta la raíz
  inclusive declarará `bg-` en `className` ni `backgroundColor` en su `style`
  aplanado. WHEN no lo pinta (carga, error, payload sin posición válida) THEN
  la raíz conserva `flex-1 bg-background` (como hoy, B13). Y THE SYSTEM SHALL
  añadir a las opciones de `alerts/[alertId]` en `src/app/_layout.tsx`
  `contentStyle: { backgroundColor: background }` (el mismo `background` de
  `headerStyle`), para que los huecos entre bloques pinten el token del tema y
  no el gris del tema por defecto de navegación (B14).

- **R10 — Distancia a la zona.** WHEN la posición es válida, `geofenceId` no
  es `null`, `listGeofences(baseUrl, token, alert.petId)` (consulta con clave
  `geofenceKeys.list(alert.petId)`) responde `ok` y su lista contiene una zona
  con `id === alert.geofenceId`, y `Math.round(d - radiusM) >= 1` con
  `d = distanceMeters(posición, centro)`, THE SYSTEM SHALL:
  - pasar a `PetMap` `circles=[{ id: zona.id, center: { latitude: centerLat,
    longitude: centerLng }, radius: radiusM }]` y
    `zoom = zoomForRadius(d + radiusM)` (encuadra la zona entera alrededor
    del marcador);
  - pintar bajo `alert-detail-map` un `Text` `testID="alert-detail-distance"`
    con `className` exacto `text-sm font-semibold text-foreground`,
    `style={TABULAR_NUMS}` y el texto de `alerts.distanceFromZone` con
    `distance = formatDistance(d - radiusM)` (distancia al **borde**) y
    `zone = zona.name`.

  La zona se usa aunque `active` sea `false`: la alerta ocurrió cuando lo
  estaba.

- **R11 — Rama: alerta sin zona.** IF `geofenceId` es `null` (zona borrada
  tras la alerta, B3, o tipo sin zona como `battery_low`) y la posición es
  válida THEN THE SYSTEM SHALL pintar el mapa con `circles=[]` y sin `zoom`
  (queda el de `PetMap`), no pintar `alert-detail-distance` y no llamar a
  `listGeofences`. Un candado por tipo: `geofence_exit` y `battery_low`.

- **R12 — Rama: zona que ya no está.** IF `listGeofences` responde `ok` y
  ninguna zona tiene `id === geofenceId` (lista vacía, o solo otras zonas)
  THEN THE SYSTEM SHALL pintar el mapa con `circles=[]` y sin `zoom`, y no
  pintar `alert-detail-distance`. Nunca se empareja por `geofenceName`. Un
  candado por variante: lista vacía y lista con otra zona llamada igual
  (`name: 'Casa'`, otro `id`).

- **R13 — Rama: la consulta de zonas no da `ok`.** WHILE la consulta de zonas
  está pendiente, o IF responde `no-tracking`, `error`, `unreachable`,
  `missing-config` o `unauthorized`, THEN THE SYSTEM SHALL pintar el mapa con
  `circles=[]` y sin `zoom`, no pintar `alert-detail-distance`, y no pintar
  ningún estado de error ni reintento propio de la zona (`alert-detail-error`
  sigue ausente y `alert-detail-card` presente). Un candado por estado (seis).
  El `unauthorized` lo resuelve el `QueryClient` global; el fichero sigue sin
  `signOut(` (design-drift).

- **R14 — Rama: posición dentro o en el borde de la zona.** IF la zona está y
  `Math.round(d - radiusM) < 1` THEN THE SYSTEM SHALL pintar el círculo y el
  `zoom` de R10 y no pintar `alert-detail-distance`. Un candado por variante:
  posición en el centro (`d = 0`) y a `0,41 m` del borde.

- **R15 — CTA «Ver en el mapa».** WHEN la alerta está cargada (cualquier tipo
  y estado, con o sin mapa) THE SYSTEM SHALL pintar, después del mini-mapa y
  de la distancia y antes de `alert-detail-ack`, un `Button`
  `testID="alert-detail-view-map"` con `variant="secondary"`,
  `accessibilityRole="button"`,
  `className="min-h-11 rounded-xl border-2 border-b-6 border-lip-gray bg-surface"`
  (la receta del secundario neutro de `docs/ui-guidelines.md` punto 13, de
  #166, más el alto mínimo del ack vecino), sin prop `style` (`#62 R14` cuenta
  una sola esquina continua en el detalle, la del mapa) y la etiqueta
  `Button.Label`, sin `className`, con `alerts.viewOnMap`. El `testID` va como
  literal de cadena: el inventario de `#166 R3` lo lee del tag de apertura.
  WHEN se pulsa
  THEN llama una vez a `selectPet(alert.petId)` de `useSelectedPet()` y
  después una vez a `router.dismissTo('/map')` (B15): destino = pestaña Mapa,
  mascota = la de la alerta, centro = el que el Mapa ya da a esa mascota (su
  última posición). WHILE carga o con error THEN no se pinta.

- **R16 — Candados agregados.** THE SYSTEM SHALL registrar:
  - en `R12_ALERTS` de `src/__tests__/ui-copy-table.ts` cinco filas de
    `src/screens/alerts/index.tsx`: `alerts.sectionToday`,
    `alerts.sectionThisWeek`, `alerts.sectionEarlier`, `alerts.newOne`,
    `alerts.newMany` (una ocurrencia cada una);
  - en `R13_ALERT_DETAIL` dos filas de `src/screens/alert-detail/index.tsx`:
    `alerts.distanceFromZone`, `alerts.viewOnMap`; y la longitud a
    `11 - 3 + 2 // #170 R16`;
  - en `#62 R15` de `consistency-classnames` las filas
    `[join('screens', 'alerts', 'index.tsx'), 1]` y
    `[join('screens', 'alert-detail', 'index.tsx'), 1]` y `+ 2` en la suma de
    `#69 R10`;
  - en `#62 R14` la fila `[join('screens', 'alert-detail', 'index.tsx'), 1]` y
    `+ 1` en la suma;
  - en `#166 R3` de `consistency-classnames` la fila
    `[join('screens', 'alert-detail', 'index.tsx'), 'alert-detail-view-map', 'secondary']`
    al final de `rows`; `'alert-detail-view-map'` en la lista ordenada del
    inventario, en primera posición (ordena antes que `'docs-upload-cancel'`);
    y los dos recuentos, `count(/border-lip-gray/g)` y
    `count(/\bborder-b-6\b/g)`, a `toBe(4 + 1); // #170 R16`. El nombre del
    `it` «inventaría los cuatro secundarios neutros de toda la app» **no se
    cambia**: lo cita la trazabilidad cerrada de #166
    (`specs/mobile-chunky-cta/traceability.md`).

  Las claves de sección se resuelven con `t('…')` literal o con objetos
  `labelKey: '…'`: son las dos formas que cuenta `checkUses`; un mapa
  `{ today: 'alerts.sectionToday' }` sin `labelKey:` cuenta 0 y deja la fila en
  rojo.

- **R17 — Smoke humano en dev build de Android.** WHEN el humano abre la app en
  el **dev build de Android** (no Expo Go: `expo-maps` no corre ahí) con
  alertas reales o sembradas THE SYSTEM SHALL mostrar:
  1. en Alertas, las cabeceras Hoy / Esta semana / Anteriores en hora local y
     el contador «N nuevas» que baja al marcar leída;
  2. filas abiertas con borde de color por tipo; leídas y resueltas sin él;
  3. en el detalle de una salida de zona con la zona aún existente: mapa con
     teselas (calles y etiquetas visibles, no solo el fondo), marcador, círculo
     de la zona y la línea «A … de <zona>»; en tema oscuro y claro;
  4. arrastrar fuera del mapa hace scroll de la pantalla;
  5. «Ver en el mapa» lleva a la pestaña Mapa con la mascota de la alerta
     seleccionada.

  Casilla propia de firma en §Smoke R17, distinta de §Aprobación.

## Medir al arrancar

El handoff a Codex no empieza hasta cerrar M1 y medir M2–M6 en el HEAD del
handoff. Lo que se desplaza no es ancla: se grepea por contenido.

- **M1 — #166 mergeada.** `python3 -c "import json;print([f['status'] for f in json.load(open('feature_list.json')) if f['id']==166])"`
  → `['done']`. Si no, **parar**.
- **M2 — Receta del secundario tras #166.** Cerrada el 2026-10-12 en
  `c865f856`: la receta está congelada en R15 y el inventario en R16. Al
  arrancar se comprueba que nadie lo movió después, desde la raíz:
  - `` grep -cF '`rounded-xl border-2 border-b-6 border-lip-gray bg-surface`' docs/ui-guidelines.md `` → `1`;
  - `grep -cF "const recipe = 'rounded-xl border-2 border-b-6 border-lip-gray bg-surface';" mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` → `1`;
  - `grep -cF 'expect(count(/border-lip-gray/g)).toBe(4);' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` → `1`;
  - `grep -cF 'expect(count(/\bborder-b-6\b/g)).toBe(4);' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` → `1`.

  Si un recuento da `0`, otra feature movió el inventario antes: #170 suma
  `+ 1` a la expresión que haya, no a `4`. Si cambia la receta, **parar**.
- **M3 — Expresión del catálogo.** `grep -A12 'expect(englishKeys).toHaveLength(' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`;
  #170 añade su línea `+ 7 // #170 R1` sobre lo que haya.
- **M4 — Sumas de `consistency-classnames`.** `grep -n -A2 -e "it('#69 R10" -e 'directUses.reduce' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`;
  #170 suma `+ 2` (tabulares) y `+ 1` (esquinas) a lo que haya.
- **M5 — Sección libre del registro de idioma.** `grep -n '^### §2\.2[3-9]' specs/mobile-ui-language/design.md`
  (en `89fe2009` la última es `§2.23`, de #159); #170 toma
  la siguiente libre.
- **M6 — Tipos de expo-router.** `test ! -e mobile-pet-tracker/.expo/types/router.d.ts`
  antes del primer typecheck.

## Fuera de alcance

Delimitaciones (no son features pendientes):

- La fila «Aviso» del canvas como tipo nuevo de backend. El tipo desconocido ya
  se pinta como «Aviso» con `Bell` (B9) y R5 solo le da borde.
- El ping del marcador (parte de Mapa de la fila 2).
- Zonas, Editor de zona, Vincular collar y Nueva mascota (siguientes partes de
  la fila 4).
- Cualquier cambio de backend: la distancia se deriva en el cliente.
- Cualquier cambio de `src/components/pet-map.tsx` (dueño: fila 2, Mapa).
- Que el Mapa se centre en la posición de la alerta: el Mapa enseña la última
  posición de la mascota seleccionada.
- Del canvas, no se adopta: la línea combinada «mascota · hora» de la fila, la
  animación de aparición del contador, la cabecera teñida con icono de 72 px
  del detalle, la píldora de vidrio sobre el mapa y el icono del CTA.
- Si la zona se editó después de la alerta, la distancia se mide contra su
  geometría actual.
- El contador cuenta lo cargado (páginas de 50, B6), no el total del servidor.

## Preguntas abiertas

- **P1 — Copy.** Las siete claves de §Copy nuevo son propuesta del spec_author
  (el canvas no aprobó copy). Ninguna está en boca de Pingo, así que rige el
  punto 6 y no la voz B del punto 7. Si el humano prefiere que la distancia
  hable Pingo, la alternativa con su voz sería `Está a {{distance}} de
  {{zone}}.` / `{{petName}} is {{distance}} from {{zone}}.`, que cambia los
  marcadores y la clave.
- **P2 — Distancia al borde o al centro.** La spec mide al **borde**
  (`d - radiusM`), porque «A 85 m de Casa» se lee como «fuera de Casa por
  85 m». Medir al centro quitaría R14 pero diría 185 m en el mismo caso.
- **P3 — Encuadre.** `zoomForRadius(d + radiusM)` (B12) se calibró para el
  editor, más alto que los 208 px de `h-52`; el smoke R17.3 dirá si el círculo
  se corta. Si se corta, el arreglo es un ajuste de zoom en el detalle, no
  tocar `PetMap`.
- **P4 — API de `PetMap`.** Basta para centro, marcador, círculo, zoom y tema.
  No tiene apagado de gestos ni nombre accesible (B11): el mini-mapa es
  interactivo dentro de un `ScrollView`. Si R17.4 falla, la salida pide una
  prop nueva a `PetMap` y es trabajo de la fila 2 o una feature aparte, no de
  #170.
- **P5 — Premisa de `feature_list.json` refutada.** La descripción de #170 dice
  que «el payload de la alerta solo trae geofenceName» y que haría falta
  emparejar por nombre o un cambio de backend. B1 y B2 lo refutan: `Alert`
  ya trae `geofenceId` en el móvil y el backend lo sirve.
- **P6 — Premisa de la fila «Aviso».** La descripción dice que «no tiene tipo
  de backend y queda fuera». Es verdad para el backend, pero el móvil ya pinta
  los tipos desconocidos como «Aviso» (B9). Queda fuera el rediseño, no la
  rama: R5 y R6 la candan.
- **P7 — Fondo bajo el mapa.** R9 se apoya en que el stack nativo ya pone
  `colors.background` bajo cada pantalla, también bajo el editor de zona, cuyo
  mapa se ve en dev build (B14). Si R17.3 muestra el mapa en blanco, la
  hipótesis cae y hay que volver a `specs/android-map-never-ready/` antes de
  tocar nada.
- **P8 — Vuelta desde el Mapa.** `dismissTo('/map')` saca la pila de alertas:
  «atrás» desde el Mapa no vuelve al detalle. Con `push('/map')` volvería, pero
  apilaría otra instancia de `(tabs)`. Elegido `dismissTo` por precedente (B15).

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar

## Smoke R17

- [ ] Smoke R17 en dev build de Android verificado por humano (fecha: ____, build: ____, tema claro ☐ oscuro ☐)
