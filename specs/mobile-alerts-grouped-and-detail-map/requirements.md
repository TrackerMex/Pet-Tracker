---
feature: "mobile-alerts-grouped-and-detail-map"
status: approved     # draft | approved
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
| Esquinas continuas en todo el repo (E1) | `src/__tests__/consistency-classnames.test.ts` · `describe('#98 R10: los candados que esta feature no mueve'` · `expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1); // #41 R9: geofences-link` | `32` | `31 + 1 + 1` (R16, Enmienda E1) |
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
  - (Enmienda E1) en `#98 R10` de `consistency-classnames`, el recuento
    global de esquinas continuas a
    `expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1 + 1); // #41 R9: geofences-link, #170 R8: alert-detail-map`;
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

## Enmienda E1 — el recuento global de esquinas continuas de `#98 R10`

Codex paró en c16 (T8 verde) el 2026-10-12. Con el mini-mapa montado,
`src/__tests__/consistency-classnames.test.ts` ›
`#98 R10: los candados que esta feature no mueve` ›
`deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` dio
`Expected: 32` / `Received: 33` (evidencia en
`progress/impl_mobile-alerts-grouped-and-detail-map.md`, §Parada en c16). Ese
`it` suma los `style={CONTINUOUS_CORNER}` de todos los ficheros de `src/`, y la
tabla de candados agregados de esta spec solo recogía el inventario por fichero
de `#62 R14`. El `View` `alert-detail-map` de R8 es el único uso nuevo de la
feature: R15 va sin `style`, y P15 del cierre del handoff espera `1` en el
detalle.

El leader barrió contra el árbol en `fd7a129f` los demás recuentos globales de
producción que esta feature podría mover. Ninguno cambia:

- `bg-accent-soft` (`#98 R10` y `conserva los usos de bg-accent-soft que sí son acento`);
- `rounded-xl bg-accent` (`#98 R10` y `#166 R2`);
- `border-b-4` y `border-black/25` (`#166 R2`);
- los radios fuera de escala (`#62 R4` y `#98 R10`);
- los ficheros con `<EmptyState` (`empty-state.test.tsx`);
- las coordenadas por defecto (`#146 R17` de `design-drift`): la sonda S8.1 las
  planta, pero no se commitea.

**THE SYSTEM SHALL**, en el commit verde de T8, cambiar esa línea a:

```
    expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1 + 1); // #41 R9: geofences-link, #170 R8: alert-detail-map
```

El cambio va en el verde y no en el rojo porque el rojo de T8 (`fd7a129f`) ya
está commiteado. El rojo de este candado es la medida de la parada: 32 contra
33 con el mapa montado. Ningún otro requisito cambia: R16 gana esta línea, y la
tabla de candados agregados gana su fila.

## Enmienda E2 — el doble de `pet-map` en el test de navegación de `#100 R8`

Codex paró en el ALL del cierre (Reanudación 5) el 2026-10-12, con
`Test Suites: 4 failed, 96 passed, 100 total` y
`Tests: 4 failed, 2888 passed, 2892 total` (evidencia en
`progress/impl_mobile-alerts-grouped-and-detail-map.md`, §Reanudación 5). Hubo
dos causas distintas:

- Cuatro `Exceeded timeout of 30000 ms`: uno en Alertas, dos en Mapa y uno en
  Home. Se deben a la carga del VPS, que tenía tres sesiones de Codex corriendo
  jest a la vez. No son defectos del árbol.
- La suite `src/app/__tests__/alert-detail.navigation.test.tsx` no arrancó por
  `Cannot find native module 'ExpoMaps'`. El stack pasa por
  `src/app/alerts/[alertId].tsx`, luego `src/screens/alert-detail/index.tsx`, y
  termina en `src/components/pet-map.tsx`. Ese test (el ida y vuelta de
  `#100 R8`) monta la ruta real del detalle, que desde R8 importa el mini-mapa.
  Esta spec no lo listaba entre los tests tocados. Por eso salen 2892 y no 2893:
  la suite no llega a ejecutar su único test.

El leader barrió contra el árbol en `0331642b` los tests que importan la
pantalla o la ruta del detalle:

- `alert-detail.notification.test.tsx` sustituye `alerts/[alertId]` por un stub.
- `detail-stack.test.tsx`, `ui-language`, `design-drift` y los de
  `src/api/` solo leen el fichero como texto o no lo importan.
- `src/screens/alert-detail/index.test.tsx` ya lleva el doble.

Solo falla el de navegación. Ningún candado lee ese fichero ni cuenta
`pet-map-double`.

Spike del leader, fuera del árbol y ya borrado: con el doble insertado justo
debajo del mock de `floating-tab-bar`, la suite da `Tests: 1 passed, 1 total`
con exit 0. `makeAlert` lleva `geofenceId: null`, así que la consulta de la
geocerca no se activa y no hace falta otro doble.

**THE SYSTEM SHALL**, en un commit propio
`test(mobile-alerts-grouped-and-detail-map): #170 E2 pet-map double in the alert detail navigation test`,
insertar en `src/app/__tests__/alert-detail.navigation.test.tsx`, justo después
de la línea
`jest.mock('../../components/floating-tab-bar', () => ({ FloatingTabBar: () => null }));`,
estas cinco líneas. Son literales e iguales a las de
`src/screens/alert-detail/index.test.tsx`:

```
jest.mock('../../components/pet-map', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { PetMap: (props: Record<string, unknown>) => React.createElement(View, { ...props, testID: 'pet-map-double' }) };
});
```

No hay rojo previo: el rojo es la medida de la parada (la suite no arranca).
Ningún otro requisito cambia y ningún recuento de producción se mueve. El ALL
del cierre pasa a esperar 100 suites y 2893 tests, sin cambios respecto al
recuento ya prescrito. La lista cerrada gana este fichero: son 17 bajo
`mobile-pet-tracker/` y 20 en total.

## Enmienda E3 — candados que la revisión encontró ciegos

El reviewer rechazó la ronda 1 el 2026-10-12 sobre `3719eb75`
(`progress/review_mobile-alerts-grouped-and-detail-map.md`). El hallazgo 1, la
columna de tests de traceability.md, es de documentación y lo corrigió el
leader en `003fa449`. Los hallazgos 2, 3 y 4 y las observaciones 2, 3 y 5 son
sondas de mutación que el reviewer dejó en verde. El código de producción ya
hace lo que dice la spec. Lo que falla es que ningún test lo distingue de una
versión rota. Esta enmienda no cambia producción ni ningún requisito: añade o
endurece tests en dos ficheros que ya están en la lista cerrada.

Spike del leader en un worktree desechable sobre `003fa449`, con los seis
cambios de abajo:

- `src/screens/alert-detail/index.test.tsx` y `src/screens/alerts/index.test.tsx`
  dan `Tests: 152 passed, 152 total`. Antes eran 78 + 68 = 146.
- `tsc --noEmit` y `eslint` sobre los dos ficheros dan exit 0.
- Cada mutación de la tabla de sondas, plantada sola, da exactamente los
  rojos que se indican.

### E3.1 — R8: «no llama a `listGeofences`» sin posición (hallazgo 2, sonda F)

Las diez filas «no» de R8 usaban `makeAlert({ payload })`, que trae
`geofenceId: null`. Con eso la consulta está deshabilitada por R11, así que
`expect(mockListGeofences).not.toHaveBeenCalled()` se cumplía con cualquier
código. **THE SYSTEM SHALL**, en `#170 R8` › `'$fila: sin mapa'`, sustituir la
primera línea del cuerpo por estas dos:

```
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ geofenceId: 'zone-1', payload })], nextCursor: null });
    mockListGeofences.mockResolvedValue({ kind: 'ok', geofences: [ZONE] });
```

Las filas «sí» (`'$fila: con mapa'`) no cambian.

### E3.2 — R10: la consulta usa la mascota de la alerta (hallazgo 3, sonda C)

La alerta por defecto es de `pet-1` y la mascota seleccionada también, así que
una consulta por `selectedPetId` pasaba igual. `listAlerts` no filtra por
mascota, de modo que el detalle puede abrir la alerta de otra mascota.
**THE SYSTEM SHALL**, en `#170 R10`:

1. Añadir, justo después del `it` `'pinta el círculo, el encuadre y «A 85 m de Casa»'`:

   ```
     it('consulta las zonas de la mascota de la alerta, no de la seleccionada', async () => {
       mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ petId: 'pet-7', geofenceId: 'zone-1', payload: REAL_PAYLOAD })], nextCursor: null });
       mockListGeofences.mockResolvedValue({ kind: 'ok', geofences: [{ ...ZONE, petId: 'pet-7' }] });
       await renderDetail();
       expect(await screen.findByTestId('alert-detail-distance')).toHaveTextContent('A 85 m de Casa');
       expect(mockListGeofences).toHaveBeenCalledWith('http://example.test/v1', 'token-1', 'pet-7');
       expect(mockListGeofences).not.toHaveBeenCalledWith('http://example.test/v1', 'token-1', 'pet-1');
     });
   ```

2. En `'lee la zona de la caché compartida de geofenceKeys.list'`, sustituir la
   línea
   `    queryClient.setQueryData(geofenceKeys.list('pet-1'), { kind: 'ok', geofences: [ZONE] });`
   por estas dos:

   ```
       mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ petId: 'pet-7', geofenceId: 'zone-1', payload: REAL_PAYLOAD })], nextCursor: null });
       queryClient.setQueryData(geofenceKeys.list('pet-7'), { kind: 'ok', geofences: [{ ...ZONE, petId: 'pet-7' }] });
   ```

La mascota seleccionada sigue siendo `pet-1`, la del `beforeEach` de nivel
superior.

### E3.3 — R3.2: la cabecera va antes de su primera fila (hallazgo 4, sonda A)

`'envuelve cada cabecera con la primera fila de su sección en un View gap-4'`
solo comprobaba el `className` del padre y que la fila estuviera dentro.
Con la cabecera debajo de su fila seguía en verde. **THE SYSTEM SHALL**, en
`#170 R3`, dentro del `for` de ese `it` y justo después de
`expect(within(parent).getByTestId('alert-row-' + id)).toBeVisible();`, añadir:

```
      expect(elementChild(parent, 0).props.testID).toBe('alerts-section-' + section);
      const first = elementChild(parent, 1);
      expect(first.props.testID === 'alert-row-' + id || within(first).queryByTestId('alert-row-' + id) !== null).toBe(true);
```

El segundo hijo es «o contiene» la fila porque R3.2 solo exige que el
envoltorio sea ancestro de la fila, y `within` no mira la raíz.

### E3.4 — R5 y R6: el ack local quita el borde (observación 2, sondas Bl y Bd)

La notación dice que «abierta» se lee **tras** el solapamiento local de la
marca de leída. Ningún test marcaba leída y miraba el borde después, así que
un borde calculado desde el `status` del servidor pasaba. Hay un candado por
pantalla y uno por cada rama de `settleAlertAck` que deja la alerta sin abrir
(`ok` da `acked` y `already-closed` da `closed`). **THE SYSTEM SHALL** añadir:

- al final de `#170 R5`, en `src/screens/alerts/index.test.tsx`:

  ```
    it.each(['ok', 'already-closed'] as const)('marcada leída en local (%s): pierde el borde de severidad', async (rama) => {
      mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
      mockAckAlert.mockResolvedValue(rama === 'ok' ? { kind: 'ok', alert: makeAlert({ status: 'acked' }) } : { kind: 'already-closed' });
      await renderAlerts();
      await fireEvent.press(await screen.findByTestId('alert-row-alert-1-ack'));
      await waitFor(() => expect(screen.getByTestId('alert-row-alert-1-status')).toHaveTextContent(rama === 'ok' ? es['alerts.statusAcked'] : es['alerts.statusClosed']));
      const classes = screen.getByTestId('alert-row-alert-1').props.className.split(' ');
      expect(classes).toContain('border');
      expect(classes).toContain('border-border');
      expect(classes).not.toContain('border-2');
      expect(classes).not.toContain('border-danger');
    });
  ```

- al final de `#170 R6`, en `src/screens/alert-detail/index.test.tsx`:

  ```
    it.each(['ok', 'already-closed'] as const)('marcada leída en local (%s): pierde el borde de severidad', async (rama) => {
      mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert()], nextCursor: null });
      mockAckAlert.mockResolvedValue(rama === 'ok' ? { kind: 'ok', alert: makeAlert({ status: 'acked' }) } : { kind: 'already-closed' });
      await renderDetail();
      await fireEvent.press(await screen.findByTestId('alert-detail-ack'));
      await waitFor(() => expect(screen.getByTestId('alert-detail-status')).toHaveTextContent(rama === 'ok' ? 'Leída' : 'Resuelta'));
      expect(screen.getByTestId('alert-detail-card').props.className).toBe('rounded-card border border-border bg-surface p-4 shadow-sm min-h-44 gap-3');
    });
  ```

### E3.5 — R10 y R14: el umbral redondea al metro (observación 3, sonda D)

R14 fija `0` y `0,41 m`, que quedan por debajo de `1` con o sin
`Math.round`. Falta una fila entre `0,5` y `1 m`. A `lat 19.4335057` la
distancia al borde es `0,709 m` (medida con `distanceMeters` de R7):
`Math.round` da `1` y `formatDistance` da `1 m`. **THE SYSTEM SHALL** añadir
en `#170 R10`, justo antes del `it` `'usa la zona aunque esté inactiva'`:

```
  it('redondea al metro: a 0,71 m del borde dice «A 1 m de Casa»', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [makeAlert({ geofenceId: 'zone-1', payload: { ...REAL_PAYLOAD, position: { lat: 19.4335057, lng: -99.1332 } } })], nextCursor: null });
    await renderDetail();
    expect(await screen.findByTestId('alert-detail-distance')).toHaveTextContent('A 1 m de Casa');
  });
```

`listGeofences` ya resuelve con `ZONE` en el `beforeEach` de `#170 R10`.

### E3.6 — R15: el CTA mide `min-h-11` (observación 5)

R15 prescribe el `className` exacto, y `#166 R3` solo comprueba la receta del
secundario con `toContain`, no el alto. **THE SYSTEM SHALL**, en `#170 R15` ›
`'lo pinta en %s'`, añadir justo después de
`expect(button.props.accessibilityRole).toBe('button');`:

```
    expect(button.props.className.split(' ')).toContain('min-h-11');
```

### Sondas

Cada sonda se planta sobre el commit que la nombra, se mide solo en su
fichero y se revierte. Ninguna se commitea. «Detalle» es
`src/screens/alert-detail/index.tsx` y «lista» es `src/screens/alerts/index.tsx`.

| Sonda | Commit | Mutación | Rojos esperados |
|---|---|---|---|
| SE3.1 (F) | E3.1 | detalle: tras `const position = …`, una `useQuery` de zonas habilitada con `geofenceId` y sin posición | las 10 filas `'$fila: sin mapa'` |
| SE3.2 (C) | E3.2 | detalle: la consulta de zonas usa `useSelectedPet().selectedPetId ?? alert.petId` | `consulta las zonas de la mascota…` y `lee la zona de la caché…` |
| SE3.3 (A) | E3.3 | lista: `{card}` antes de la cabecera dentro del `View gap-4` | `envuelve cada cabecera…` |
| SE3.4 (Bl) | E3.4 | lista: el borde sale de `ordered[index].status` | las 2 filas de `#170 R5` › `marcada leída en local` |
| SE3.5 (Bd) | E3.4 | detalle: el borde sale de `found?.status` | las 2 filas de `#170 R6` › `marcada leída en local` |
| SE3.6 (D) | E3.5 | detalle: umbral `d - zone.radiusM >= 1` sin `Math.round` | `redondea al metro…` |
| SE3.7 (X) | E3.6 | detalle: el CTA pierde `min-h-11` | las 3 filas de `'lo pinta en %s'` |

Los comandos literales de cada mutación, con sus líneas `Tests:`, están en el
handoff (corrección 16).

### Lo que no entra

- Observación 1: R16 se nombra en comentarios `// #170 R16`, como prescribe
  tasks.md T16 y como hicieron los candados agregados anteriores.
- Observación 4: el candado del registro de R1 es el que la spec prescribió.
- Observación 6: `new Date(alerts.dataUpdatedAt)` y `new Date()` solo se
  distinguen si la lista sigue montada sin recargar al cruzar el límite de
  una sección. Haría falta un escenario de timers solo para eso.
- Observación 7: el comentario `// #134 R6` de `ui-language.test.ts` lo
  sustituyó la corrección 2 del handoff a propósito. Cambiarlo ahora rompe el
  ancla `grep -cF 'toHaveLength(11 - 3 + 2); // #170 R16'` de tasks.md T16 y
  toca una línea que #167 también mueve.
- Observación 5, la parte de `Button.Label` sin `className`: es una ausencia
  en el código fuente. El inventario de `#166 R3` ya lee el tag del CTA.
- Observación 8: ya cubierta por `#78 R7` y `#78 R9`.

### Recuentos

- `alert-detail/index.test.tsx` pasa de 78 a 82 tests (+1 en E3.2, +2 en
  E3.4 y +1 en E3.5). `alerts/index.test.tsx` pasa de 68 a 70 (+2 en E3.4).
- El FINAL del cierre pasa de 427 a 433 tests y el ALL de 2893 a 2899, con
  100 suites en los dos casos.
- Ningún recuento agregado de R16 se mueve: no hay `testID`, clase, `style`
  ni copy nuevos en producción.
- La lista cerrada sigue en 20 ficheros.
- traceability.md suma los commits de E3 a la columna «Commit» de R3, R5, R6,
  R8, R10 y R15.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-12) ← gate obligatorio antes de implementar
- [x] Enmienda E1 aprobada por humano (fecha: 2026-10-12)
- [x] Enmienda E2 aprobada por humano (fecha: 2026-10-12)
- [x] Enmienda E3 aprobada por humano (fecha: 2026-10-12)

## Smoke R17

- [X] Smoke R17 en dev build de Android verificado por humano (fecha: 2026-10-13, build: OnePlus Nord 5, tema claro X oscuro X)
