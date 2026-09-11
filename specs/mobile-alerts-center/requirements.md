---
feature: "mobile-alerts-center"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-alerts-center]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Trabajo **solo de cliente móvil**. Cero cambios en `backend-pet-tracker/`,
> cero migraciones, cero dependencias nuevas. Rige `docs/ui-guidelines.md`
> (carta de UI, gate C8 de `CHECKPOINTS.md`).

---

## §0. Verificación de premisas contra el árbol (obligatoria antes de leer los requisitos)

Todo lo que sigue se comprobó leyendo el código en la branch
`feature/78-mobile-alerts-center` (base `main` @ `5666b85`), no la descripción de
la feature. Tres premisas del enunciado de #78 **son falsas o imprecisas** y esta
spec las corrige.

### §0.1 Premisas confirmadas

| Premisa | Veredicto | Evidencia leída |
|---|---|---|
| No existe `mobile-pet-tracker/src/api/alerts.ts` | **cierta** | `ls src/api/` → `activity, auth, devices, health-records, http, media, nutrition, pets, positions, reminders, subscriptions, trips, types, users`. No hay `alerts.ts` |
| No existe ninguna ruta de alertas bajo `src/app/` | **cierta** | `find src/app -type f`: 16 rutas `.tsx`, ninguna `alerts` |
| Rutas del backend | **cierta** | `alerts.controller.ts:34` `@Controller('alerts')`; `:41 @Get()`; `:64 @Post(':id/ack')` con `@HttpCode(HttpStatus.OK)` ⇒ el ack responde **200**, no 201 |
| Forma de la respuesta | **cierta** | `alert-response.mapper.ts:5-21`: `{id, petId, petName, type, status, geofenceId, payload, openedAt, ackedAt, closedAt}` y `{items, nextCursor}` — **exactamente** esas diez claves; instantes en ISO-8601, `nextCursor: string \| null` |
| `ListAlertsQuerySchema` es `strictObject` sin `limit` | **cierta** | `list-alerts.dto.ts:9-12`: `z.strictObject({ status: z.enum(['open','acked','closed']).optional(), cursor: z.string().min(1).optional() })` |
| `?limit=` responde 400 | **cierta** | `alerts.controller.ts:79-93` `parseQuery` → `safeParse` fallido ⇒ `BadRequestException {statusCode:400, message:'Validation failed', errors:[{path,message}]}`. Un `strictObject` rechaza la clave desconocida |
| `alert_events_type_check` solo admite `geofence_exit` y `battery_low` | **cierta** | `alerts.schema.ts:48-51` |
| Los recordatorios nunca entran en `/alerts` | **cierta** | el mismo CHECK; los recordatorios viven en `reminders` y los despacha el scheduler |
| El *ack* es el "leído" | **cierta** | `ack-alert.use-case.ts:23-26`: `open+ack→acked` (200), `acked+ack→acked` idempotente (200), `closed+ack→409` |
| Patrón `kind` de `src/api/activity.ts` | **cierta** | `activity.ts:4-10` unión discriminada por `kind`; `:36` mapea `402 → {kind:'no-tracking'}` |

### §0.2 Discrepancia **D1** — `/v1/alerts` **NO** devuelve 402 (la premisa del enunciado es falsa)

El enunciado de #78 dice: *"el 402 como kind 'no-tracking' porque las lecturas de
alerts están tras el gate de suscripción del dispositivo"*. **Es falso.** Lo
comprobado:

- `alerts.controller.ts` no tiene **ningún** `@UseGuards`. Su comentario de
  cabecera (`:27-33`) declara explícitamente que **no** usa `PetAccessGuard`
  porque leería `request.params.petId`, que en estas rutas no existe.
- `alerts.module.ts:14-21` no importa `SubscriptionsModule`, que es quien exporta
  `PetTrackingGuard`.
- `PetTrackingGuard` —el único emisor de 402 por suscripción
  (`pet-tracking.guard.ts:34-41`)— se aplica en exactamente cuatro controllers y
  **ninguno es el de alertas**: `positions.controller.ts:34`,
  `geofences.controller.ts:42`, `activity.controller.ts:26`,
  `trips.controller.ts:32`.
- `mapAlertError` (`alert-error.mapper.ts:14-39`) solo produce **404**
  (`ALERT_NOT_FOUND`), **409** (`ALERT_ALREADY_CLOSED`) y **400** (`INVALID_CURSOR`).
  No hay rama de 402.

**Qué hace de verdad el gate de suscripción en alertas**: es un filtro de filas
dentro de la consulta, no un guard. `alert.drizzle.repository.ts:76-89` hace
`INNER JOIN pet_devices` (con `released_at IS NULL`) e `INNER JOIN
device_subscriptions` con `entitledDeviceSubscription()`. Consecuencia observable:
**las alertas de una mascota sin suscripción vigente sencillamente no se
devuelven** — la lista sale vacía (o más corta), con `200`, nunca con `402`.

**Cómo lo resuelve esta spec**: el criterio de aceptación 6 del enunciado
("402 → estado vacío con texto, sin crash y sin campana rota") se cumple por su
**resultado observable**, no por su mecanismo inventado: R5 pinta el estado vacío
con copy vía `t()` cuando `items` está vacío —que es justo lo que produce una
mascota sin suscripción— y R11 exige que la campana no pinte punto ni rompa
cuando el estado no es `ok`. **No se añade un `kind: 'no-tracking'` a
`src/api/alerts.ts`**: sería una rama muerta por un status que el endpoint no
emite (alternativa descartada A3 en [[design]], con la condición exacta que la
revivriría).

### §0.3 Discrepancia **D2** — el número de alertas abiertas SÍ es derivable, hasta 50

El enunciado dice que *"el punto rojo es derivable de la lista pero el NÚMERO
exacto no"*. Es impreciso. `ALERTS_PAGE_SIZE = 50` (`alerts.constants.ts:6`) y la
primera página de `GET /v1/alerts?status=open` trae hasta 50 items: con ≤50
alertas abiertas el número **sí** es exacto (`items.length` con
`nextCursor === null`); a partir de 51 solo se sabe "50 y hay más".

La conclusión del enunciado —**punto, no contador**— **se confirma igualmente**, y
con un motivo más fuerte que el que da: un contador que se congela en 50 miente
sin avisar, y evitarlo obliga a decidir una segunda cosa ("¿pinto `50+`?") que
esta feature no necesita. Un contador honesto exige backend nuevo
(`GET /v1/alerts/count` o un `unreadCount` en la respuesta de la lista), que es
feature aparte. **Decisión cerrada: punto rojo, sin número** (R11).

### §0.4 Otras premisas verificadas que la spec necesita cerrar

| Qué | Verificado |
|---|---|
| Orden del feed | `alert.drizzle.repository.ts:93`: `ORDER BY opened_at DESC, id DESC`. Sin `?status=` llegan **las tres** situaciones mezcladas, más nuevas primero |
| Cursor | `cursor.ts:23-33` sobre `(openedAtMs, id)`, base64url, versión 1. Un cursor emitido con otro `?status=` es **400** (`list-alerts.use-case.ts:80-82`): un cursor **nunca** se reusa entre filtros distintos |
| Autorización | `INNER JOIN pet_users … status='active'` en las dos consultas: `/v1/alerts` es **del usuario**, no de una mascota. No existe `?petId=` y pedirlo sería 400 por `strictObject` |
| TanStack Query | **no está instalado**. `mobile-pet-tracker/package.json` no tiene `@tanstack/react-query` ni ninguna librería de data-fetching. El repo usa el hook propio `src/hooks/use-api.ts` (`useApi(fn)` → `{data, isRefreshing, refetch}`) más `useFocusEffect`. **No hay query keys que invalidar** (ver D3 en [[design]]) |
| Mecanismo "no es pestaña" | `floating-tab-bar.tsx:49-55` define un `const TABS` de módulo con exactamente cinco entradas (`home, map, health, food, profile`) y **solo itera sobre ese array** (`:155`), buscando cada nombre en `state.routes` y devolviendo `null` si no lo encuentra (`:156-162`). Una ruta de `(tabs)/` que no esté en `TABS` **no puede** pintar píldora. Además `tabWidth = (containerWidth - 16) / TABS.length` (`:77`): tocar `TABS` recolocaría las cinco pestañas. `(tabs)/_layout.tsx:26-30` declara los mismos cinco `<Tabs.Screen>`. Precedente vivo: `reminders.tsx`, `pairing.tsx`, `add-reminder.tsx`, `weight-log.tsx`, `meal-schedule.tsx`, `pets/add.tsx` y `pets/[petId]/docs.tsx` existen bajo `(tabs)/`, no están en `TABS` ni en `_layout.tsx`, y no son pestañas |
| Iconos disponibles | `reicon-react-native` exporta `Bell`, `BatteryLow` (`index.d.ts:255`), `LocationSlash` (`:1415`) y `CheckCircle`. No hay que instalar nada |
| Tokens `*-soft` de severidad | `bg-danger-soft`, `bg-warning-soft` y `text-warning-strong` existen (`node_modules/heroui-native/src/styles/theme.css:87,91` y `src/theme/global.css:20`) y ya se usan en `screens/reminders/index.tsx:298,329` |

---

## Requisitos funcionales

> Convención de tests: cada `describe` nombra su R-id, p. ej.
> `describe('#78 R1: listAlerts mapea la respuesta por kind', …)`
> (`docs/conventions.md` §Tests, C4 de `CHECKPOINTS.md`).
> Todas las rutas son relativas a `mobile-pet-tracker/`.

### R1 — cliente de listado

**WHEN** se invoca
`listAlerts(baseUrl, token, status?, cursor?, fetchFn = fetch)` desde
`src/api/alerts.ts`
**THE SYSTEM SHALL** pedir `GET {baseUrl}/alerts` con
`headers: { Authorization: 'Bearer {token}' }` vía `getJson` de `src/api/http.ts`,
añadiendo `?status={status}` cuando `status` esté definido, `?cursor={cursor}`
cuando `cursor` esté definido y `?status=…&cursor=…` cuando lo estén los dos (en
ese orden), sin ningún otro parámetro, y devolver una unión discriminada por
`kind`:

| Situación | Resultado |
|---|---|
| `baseUrl` es `undefined` o `''` | `{ kind: 'missing-config' }` — **sin** llamar a `fetchFn` |
| `getJson` devuelve `{kind:'unreachable'}` | ese mismo objeto, tal cual |
| `status === 401` | `{ kind: 'unauthorized' }` |
| `status === 200` y el cuerpo es un objeto con `items` array | `{ kind: 'ok', items, nextCursor }`, donde `nextCursor` es `body.nextCursor` si es `string`, y `null` en cualquier otro caso (ausente, `null`, no-string) |
| `status === 200` con cuerpo no parseable o sin `items` array | `{ kind: 'error' }` |
| cualquier otro status (400, 402, 403, 404, 500…) | `{ kind: 'error' }` |

Tipos exportados desde `src/api/alerts.ts`:

```ts
export type AlertsState =
  | { kind: 'ok'; items: Alert[]; nextCursor: string | null }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };
```

y en `src/api/types.ts` (al final del archivo, junto a `Reminder`):

```ts
export type AlertType = 'geofence_exit' | 'battery_low';
export type AlertStatus = 'open' | 'acked' | 'closed';

export interface Alert {
  id: string;
  petId: string;
  petName: string;
  /** `string`, no `AlertType`: el CHECK del backend puede ampliarse
   *  (`alerts.schema.ts:15-21`) y el cliente no debe romper por un tipo nuevo. */
  type: string;
  status: string;
  geofenceId: string | null;
  payload: Record<string, unknown>;
  openedAt: string;
  ackedAt: string | null;
  closedAt: string | null;
}
```

El orden de los items **se conserva tal cual llega**: `src/api/alerts.ts` no
ordena, no filtra y no agrupa.

**Test**: `src/api/__tests__/alerts.test.ts::#78 R1: listAlerts mapea la
respuesta por kind` — mismo andamiaje que `src/api/__tests__/activity.test.ts:1-18`
(helpers `response(status, body)` e `invalidJsonResponse(status)`, `baseUrl =
'http://example.test/v1/'`). Un `it` por fila de la tabla, más uno que afirma la
URL exacta con los dos parámetros (`http://example.test/v1/alerts?status=open&cursor=abc`)
y otro que afirma que con `baseUrl` vacío `fetchFn` no se llamó.

### R2 — cliente de ack

**WHEN** se invoca `ackAlert(baseUrl, token, alertId, fetchFn = fetch)` desde
`src/api/alerts.ts`
**THE SYSTEM SHALL** pedir `POST {baseUrl}/alerts/{alertId}/ack` vía `postJson`
de `src/api/http.ts` con cuerpo `{}` y devolver:

| Situación | Resultado |
|---|---|
| `baseUrl` ausente | `{ kind: 'missing-config' }` — sin llamar a `fetchFn` |
| `getJson`/`postJson` devuelve `unreachable` | ese mismo objeto |
| `status === 200` con cuerpo objeto | `{ kind: 'ok', alert }` con el cuerpo como `Alert` |
| `status === 200` con cuerpo no parseable o no-objeto | `{ kind: 'error' }` |
| `status === 401` | `{ kind: 'unauthorized' }` |
| `status === 404` | `{ kind: 'not-found' }` |
| `status === 409` | `{ kind: 'already-closed' }` |
| cualquier otro status | `{ kind: 'error' }` |

```ts
export type AckAlertState =
  | { kind: 'ok'; alert: Alert }
  | { kind: 'not-found' }
  | { kind: 'already-closed' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };
```

El **200** (no 201) está verificado en `alerts.controller.ts:65`
(`@HttpCode(HttpStatus.OK)`), y el 409 en `ack-alert.use-case.ts:52-54`.

**Test**: `src/api/__tests__/alerts.test.ts::#78 R2: ackAlert mapea la respuesta
por kind` — un `it` por fila, más uno que afirma
`fetchFn` llamado con `('http://example.test/v1/alerts/alert-1/ack', {method:'POST',
headers:{Authorization:'Bearer jwt-token','Content-Type':'application/json'},
body:'{}'})`.

### R3 — catálogo: las catorce claves nuevas, en los dos idiomas

**WHEN** se ejecuta la suite móvil
**THE SYSTEM SHALL** encontrar en `src/i18n/catalog.ts` estas **14 claves nuevas**,
presentes en `en` y en `es` con los mismos marcadores `{{…}}`:

| clave | `en` | `es` |
|---|---|---|
| `alerts.title` | `Alerts` | `Alertas` |
| `alerts.empty` | `No alerts` | `No hay alertas` |
| `alerts.ack` | `Mark as read` | `Marcar leída` |
| `alerts.typeGeofenceExit` | `Left the safe zone` | `Salió de la zona` |
| `alerts.typeBatteryLow` | `Low battery` | `Batería baja` |
| `alerts.typeUnknown` | `Notice` | `Aviso` |
| `alerts.statusAcked` | `Read` | `Leída` |
| `alerts.statusClosed` | `Resolved` | `Resuelta` |
| `alerts.justNow` | `Just now` | `Ahora mismo` |
| `alerts.minutesAgo` **(param)** | `{{minutes}} min ago` | `Hace {{minutes}} min` |
| `alerts.hoursAgo` **(param)** | `{{hours}} h ago` | `Hace {{hours}} h` |
| `alerts.daysAgo` **(param)** | `{{days}} d ago` | `Hace {{days}} d` |
| `home.alertsBell` | `Alerts` | `Alertas` |
| `home.alertsBellUnread` | `Unread alerts` | `Alertas sin leer` |

Y **THE SYSTEM SHALL** registrar las 14 filas en
`specs/mobile-ui-language/design.md` §2, con el formato exacto que ya usan las
demás (`design.md:312-317`):

```
| — | `alerts.title` | `Alerts` | `Alertas` | ← añadida por #78 (R3)
```

**Candado que se mueve (delta declarado, nunca recuento absoluto)**:
`src/providers/__tests__/language-provider.test.tsx:41` dice hoy
`expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7);`. Pasa a
`expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7 + 14);` — **se añade el
sumando `+ 14`, no se reescribe el total**, y el comentario de la línea 36 gana
`+ 14 de #78`. Cualquier otra cifra que esta feature mueva se declara igual: como
un sumando nuevo al final de la suma existente. Un recuento absoluto ha parado el
trabajo tres veces en este repo y aquí está prohibido.

**Test**: `src/providers/__tests__/language-provider.test.tsx::#78 R3: el
catálogo trae las claves del centro de alertas` — `describe` nuevo **al final del
archivo** con un `it` que recorre el array literal de las 14 claves y afirma, por
cada una, `expect(en[key]).toBe('<valor en>')` y `expect(es[key]).toBe('<valor es>')`.
Rojo antes (las claves no existen: `en[key]` es `undefined`), verde después. El
`+ 14` de la línea 41 se aplica en el paso de implementación, en el mismo commit
verde.

### R4 — pantalla: cuerpo, dimensiones y estados

**WHEN** se renderiza `AlertsScreen` desde `src/screens/alerts/index.tsx`
**THE SYSTEM SHALL** pintar un `FlatList` con `testID="screen-alerts"` cuyo
`contentContainerStyle` sea **exactamente**
`{ padding: 24, gap: 16, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96 }`
con `insets` de `useSafeAreaInsets()` (`docs/conventions.md` §Dimensiones; sin la
excepción A9, porque esta pantalla **no** lleva cabecera a sangre), `className="flex-1 bg-background"`,
`contentInsetAdjustmentBehavior="automatic"`, y:

1. `ListHeaderComponent` con un `<Text className="text-2xl font-black text-foreground">{t('alerts.title')}</Text>`,
   igual que `screens/reminders/index.tsx:143-145`. **Sin botón de volver** y sin
   `PetSwitcher`: la lista es del usuario, no de una mascota (R7).
2. `testID="alerts-list"` en el propio `FlatList`, `keyExtractor` por `item.id`.
3. **Cargando** (aún no ha resuelto la primera página): `ListEmptyComponent`
   pinta `testID="alerts-loading"` con **tres** `Skeleton` de heroui
   `testID={"alert-row-skeleton-" + n}` (n = 1..3) y `className="h-20 w-full rounded-card"`
   — dimensionados como la fila real, nunca un spinner suelto (carta §7).
4. **Error** (`kind` ∈ `error | unreachable | missing-config`): un
   `<View className="items-start gap-3">` con
   `<Text testID="alerts-error" className="text-danger">{t('common.somethingWentWrong')}</Text>`
   y un `<Button testID="alerts-retry">` cuyo label es `t('common.retry')` y cuyo
   `onPress` reintenta la primera página.
5. **Vacío** (`kind === 'ok'` e `items.length === 0`):
   `<Text testID="alerts-empty" className="font-normal text-muted">{t('alerts.empty')}</Text>`.
   Esta rama es también la que ve un usuario cuyas mascotas no tienen suscripción
   vigente (§0.2 D1).
6. **Cargada**: una fila por item, con `testID={"alert-row-" + item.id}`.
7. `kind === 'unauthorized'` no pinta nada propio: `useApi` ya llama a `signOut()`
   (`src/hooks/use-api.ts:29`).

Los tres estados son **excluyentes**: en cualquier render hay como mucho uno de
`alerts-loading` / `alerts-error` / `alerts-empty`, y ninguno cuando hay filas.

**Test**: `src/screens/alerts/index.test.tsx::#78 R4: la pantalla pinta su
esqueleto, su error, su vacío y sus filas` — cinco `it` (cargando / error /
vacío / cargada / excluyentes), y uno más que afirma el `contentContainerStyle`
completo con `useSafeAreaInsets` mockeado a `{top: 40, right: 0, bottom: 24, left: 0}`
como en `src/screens/home/index.test.tsx:85-88`, es decir
`{padding: 24, gap: 16, paddingTop: 52, paddingBottom: 120}`.

### R5 — ruta delgada que no es pestaña

**WHEN** existe `src/app/(tabs)/alerts.tsx`
**THE SYSTEM SHALL** contener **solo** la ruta, con este cuerpo exacto (patrón
`docs/conventions.md` §Estructura Expo oficial, idéntico a
`src/app/(tabs)/reminders.tsx`):

```tsx
import { AlertsScreen } from '../../screens/alerts';

export default function AlertsRoute() {
  return <AlertsScreen />;
}
```

**AND** la ruta **NO** aparecerá como pestaña, por el mecanismo verificado en
§0.4: `src/components/floating-tab-bar.tsx` conserva su `const TABS` con
**exactamente** las cinco entradas actuales y `src/app/(tabs)/_layout.tsx`
conserva sus **cinco** `<Tabs.Screen>`. Ni `'alerts'` ni `/alerts` se añaden a
ninguno de los dos.

**Test**: `src/app/(tabs)/__tests__/alerts.test.tsx::#78 R5: la ruta delega en la
pantalla y no es pestaña` — tres `it`:
(a) renderiza `AlertsRoute` con `AlertsScreen` mockeado y afirma que se montó
    una sola vez;
(b) lee `src/components/floating-tab-bar.tsx` con `readFileSync` y afirma
    `expect(source.match(/name: '[a-z]+'/g)).toHaveLength(5)` y
    `expect(source).not.toContain("'alerts'")`;
(c) lee `src/app/(tabs)/_layout.tsx` y afirma
    `expect(source.match(/<Tabs\.Screen /g)).toHaveLength(5)` y
    `expect(source).not.toContain('alerts')`.

### R6 — anatomía de la fila (elemento repetido: todas sus decisiones, candadas)

**WHILE** la pantalla tiene items cargados
**THE SYSTEM SHALL** pintar cada alerta como un `Card` de `src/components/card.tsx`
con `testID={"alert-row-" + id}` y **exactamente tres hijos, en este orden**:

| # | Hijo | `className` exacta |
|---|---|---|
| 0 | contenedor del icono | `size-11 items-center justify-center rounded-full ${slot.surface}` |
| 1 | columna de textos | `min-w-0 flex-1 gap-1` |
| 2 | botón de ack **o** píldora de estado | ver decisión 9 |

y el `Card` mismo con `className="min-h-20 flex-row items-center gap-3"` **en las
dos ramas** (alerta abierta y no abierta) — la anatomía no cambia con el estado.

Las **doce decisiones** de la carta §Enmienda #70, todas con su `expect`
(`within(row)`, y el recuento por `children.length`, nunca por prefijo de `testID`):

1. **Dato que muestra**: tipo traducido, `petName`, `openedAt` relativo, y la
   etiqueta de estado solo si no está `open`.
2. **Componente de icono**: `LocationSlash` para `geofence_exit`, `BatteryLow`
   para `battery_low`, `Bell` para cualquier otro `type` (el CHECK del backend es
   ampliable). `testID={"alert-row-" + id + "-icon"}`.
3. **Etiqueta visible / clave de copy**: `alerts.typeGeofenceExit` /
   `alerts.typeBatteryLow` / `alerts.typeUnknown`, resueltas por
   `labelKey` de un mapa de módulo (ver [[design]] D5).
4. **Nombre accesible**: el botón de ack lleva `accessibilityRole="button"` y su
   nombre accesible es su propio texto `t('alerts.ack')`; se verifica con
   `within(row).getByTestId(...)` y el texto, no con una aserción global.
5. **Hueco de fondo del icono**: `bg-danger-soft` (`geofence_exit`),
   `bg-warning-soft` (`battery_low`), `bg-default` (desconocido). **No** se usa la
   paleta categórica: una alerta es severidad, no categoría (ver [[design]] D6), y
   `bg-category-*` solo puede nombrarse en `src/utils/category-palette.ts`
   (candado `#64 R9`, `src/__tests__/consistency-classnames.test.ts:388-437`).
6. **Tinta del icono**: `danger` / `warning-strong` / `muted`, resueltas con
   `useThemeColors(['danger','warning-strong','muted'])`. En test, `icon.props.color`
   vale `'--color-danger'`, `'--color-warning-strong'` y `'--color-muted'`.
7. **Color y receta tipográfica de cada texto**, uno por uno:
   - tipo: `text-sm font-bold text-foreground`, `testID={row+"-type"}`
   - `petName`: `text-xs font-semibold text-muted`, `testID={row+"-pet"}`
   - tiempo relativo: `text-xs font-normal text-muted`, `testID={row+"-time"}`
   - píldora de estado: `rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted`
8. **Destino de navegación**: **ninguno**. La fila no es pulsable — no existe
   pantalla de detalle de alerta ni ruta de geocerca a la que llevar. Se verifica
   afirmando que el `Card` no recibe `onPress`
   (`expect(row.props.onPress).toBeUndefined()`).
9. **Condición de render del tercer hijo**: `status === 'open'` ⇒ botón de ack
   (`testID={row+"-ack"}`); `status !== 'open'` ⇒ píldora con
   `t('alerts.statusAcked')` si `acked`, `t('alerts.statusClosed')` si `closed`
   (`testID={row+"-status"}`). Nunca los dos. La cardinalidad se comprueba en
   **dos escenarios distintos** (lista de solo `open`; lista mixta open+acked+closed).
10. **Forma del contenedor**: `min-h-20 flex-row items-center gap-3`, afirmada en
    **ambas** ramas.
11. **Envoltorios de agrupación**: `row.children[1].props.className` es
    `'min-w-0 flex-1 gap-1'`.
12. **Orden de los hijos**: `expect(row.children).toHaveLength(3)` más
    `expect(row.children[0].props.className).toContain('size-11')` y
    `expect(row.children[1].props.className).toBe('min-w-0 flex-1 gap-1')` —
    `getByTestId` es agnóstico al orden y por sí solo no cierra nada.

**Invariantes compartidos, cada uno con su `expect`** (inventariar no es candar,
carta §Enmienda #70):

- **tamaño de icono**: `expect(icon.props.size).toBe(20)` dentro de cada fila —
  el mismo candado que #85 tuvo que añadir a posteriori
  (`src/screens/home/index.test.tsx:2210`).
- **objetivo táctil**: el botón de ack lleva `className` con `min-h-11`.
- **radio**: el icono es cápsula (`rounded-full`) y el `Card` aporta
  `rounded-card` y `CONTINUOUS_CORNER` por sí mismo — la pantalla **no** declara
  ningún `style={CONTINUOUS_CORNER}` propio (ver R13).
- **agrupación accesible**: `accessibilityRole="button"` solo en el ack.
- **sitio de render**: toda fila cuelga de `alerts-list`.
- **feedback de pulsado**: lo aporta el `Button` de heroui-native.

Y el **recuento del contenedor**: con N items,
`expect(screen.getAllByTestId(/^alert-row-[^-]+$/)).toHaveLength(N)` **no** basta;
se cierra con la longitud del `data` renderizado, afirmando además que cada fila
tiene sus 3 hijos.

**Test**: `src/screens/alerts/index.test.tsx::#78 R6: cada fila de alerta trae su
icono, su hueco, su tinta y sus tres hijos en orden`.

### R7 — orden: las abiertas primero, congelado en el momento de la carga

**WHEN** la pantalla ha cargado una o más páginas
**THE SYSTEM SHALL** renderizar primero **todas** las alertas cuyo `status`
**tal como llegó de la API** sea `'open'`, y después el resto, conservando dentro
de cada grupo el orden en que la API las devolvió (`opened_at DESC, id DESC`,
verificado en `alert.drizzle.repository.ts:93`).

**AND** el orden **no cambiará** cuando un ack convierta una fila `open` en
`acked`: la partición se calcula sobre los items **tal como se descargaron**, y
el ack solo cambia la apariencia de la fila, no su posición. Una fila que salta
bajo el dedo justo al pulsarla es peor que una fila fuera de grupo.

**AND** el listado **no** filtrará por la mascota seleccionada: se listan las
alertas de **todas** las mascotas del usuario y cada fila lleva su `petName`
(decisión cerrada, motivo en [[design]] D4: `/v1/alerts` es del usuario, no
existe `?petId=` y filtrar en cliente rompería la paginación por cursor).

**Test**: `src/screens/alerts/index.test.tsx::#78 R7: pinta las abiertas primero
y conserva la posición tras el ack` — dos `it`: (a) una página con
`[acked, open, closed, open]` produce el orden de `testID`
`[open1, open2, acked, closed]`; (b) tras pulsar el ack de `open1`, el orden de
`testID` sigue siendo el mismo.

### R8 — ack sin recargar la pantalla

**WHEN** el usuario pulsa `alert-row-{id}-ack` de una alerta `open`
**THE SYSTEM SHALL** llamar `ackAlert(baseUrl, token, id)` **una sola vez**, y:

| Resultado de `ackAlert` | Efecto observable |
|---|---|
| `{kind:'ok', alert}` | esa fila pasa a pintar la píldora `t('alerts.statusAcked')` y deja de tener botón de ack, **sin** volver a llamar a `listAlerts` y sin desmontar la lista |
| `{kind:'already-closed'}` | esa fila pasa a pintar `t('alerts.statusClosed')`, sin refetch |
| `{kind:'not-found'}` | la fila se queda como estaba y se pinta `alerts-action-error` con `t('common.somethingWentWrong')` |
| `{kind:'unreachable'}` | `alerts-action-error` con `t('common.cannotReachServer')` |
| `{kind:'unauthorized'}` | `signOut()` de `useAuth`, sin mensaje |
| `{kind:'error'}` / `{kind:'missing-config'}` | `alerts-action-error` con `t('common.somethingWentWrong')` |

**AND** mientras la petición está en vuelo el botón de esa fila estará
`isDisabled`, de modo que dos pulsaciones seguidas producen **una** llamada.

**AND** el mensaje de error vive en
`<Text testID="alerts-action-error" className="text-danger">` bajo la cabecera de
la lista, y se limpia al iniciar el siguiente ack — mismo patrón que
`screens/reminders/index.tsx:66,195-199`.

**Cómo se entera la campana** (la pregunta que el enunciado planteaba como
"invalidación de TanStack Query"): **no hay TanStack Query en este repo** (§0.4).
El punto rojo de Home se recalcula porque Home reejecuta su `useFocusEffect` al
recuperar el foco, y R11 mete el refetch de alertas dentro de ese mismo callback.
No hay ninguna query key que nombrar; el mecanismo exacto es
`useApi(alertsFn).refetch` invocado desde el `useFocusEffect` de
`src/screens/home/index.tsx:221-226`.

**Test**: `src/screens/alerts/index.test.tsx::#78 R8: el ack cambia la fila sin
recargar la lista` — un `it` por fila de la tabla, más uno que afirma
`expect(mockListAlerts).toHaveBeenCalledTimes(1)` después del ack y otro que
afirma que dos `fireEvent.press` seguidos dejan
`expect(mockAckAlert).toHaveBeenCalledTimes(1)`.

### R9 — paginación por `nextCursor`

**WHEN** el `FlatList` `alerts-list` emite `onEndReached`
**THE SYSTEM SHALL**:

- si el último `nextCursor` conocido es un `string`: llamar
  `listAlerts(baseUrl, token, undefined, nextCursor)` **una sola vez** y añadir
  `items` al final de lo ya cargado, sustituyendo el `nextCursor` por el de la
  respuesta nueva;
- si el último `nextCursor` conocido es `null`: **no** llamar a `listAlerts`;
- si ya hay una página en vuelo: **no** lanzar una segunda.

**AND** el `?status=` de las páginas siguientes será el mismo que el de la
primera (aquí: ninguno), porque un cursor emitido bajo otro filtro es un **400**
(`list-alerts.use-case.ts:80-82`).

**AND** si una página siguiente falla (`error`/`unreachable`), lo ya cargado se
queda en pantalla y se pinta `alerts-action-error`; nunca se vacía la lista.

**Test**: `src/screens/alerts/index.test.tsx::#78 R9: pagina por nextCursor y se
para cuando no hay` — cuatro `it`, disparando el evento como ya hace este repo
con props compuestas (`src/screens/add-pet/index.test.tsx:127`):
`await fireEvent(screen.getByTestId('alerts-list'), 'onEndReached');`
(a) con `nextCursor: 'c1'` se pide la segunda página con ese cursor y las filas
    de ambas quedan montadas;
(b) con `nextCursor: null` no hay segunda llamada;
(c) dos `onEndReached` seguidos con una página en vuelo producen una sola llamada;
(d) una segunda página que falla conserva las filas de la primera y pinta el error.

> **Aviso para la implementación**: en jest, `FlatList` monta solo
> `initialNumToRender` (10) elementos. Las fixturas de test usan 2 o 3 items por
> página; no se escriben tests con 50.

### R10 — campana en el hero de Home

**WHEN** Home tiene al menos una mascota (`hasPets === true`, la misma condición
que ya monta el hero en `src/screens/home/index.tsx:243`)
**THE SYSTEM SHALL** pintar dentro del slot de `PetHeroHeader` un contenedor
`testID="home-hero-actions"` con `className="flex-row items-center gap-3"` y
**exactamente dos hijos, en este orden**:

0. `<View className="flex-1">` que envuelve al `PetSwitcher` compartido (necesario
   porque `PetSwitcher` es un `ScrollView` horizontal,
   `src/components/pet-switcher.tsx:18`);
1. `<Pressable testID="home-alerts-bell">` con
   `accessibilityRole="button"`,
   `className="size-11 items-center justify-center rounded-full"`
   (objetivo táctil ≥ 44pt, cápsula ⇒ sin `CONTINUOUS_CORNER`),
   `style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}` (feedback de
   pulsado, mismo patrón que `home/index.tsx:556`), un `<Bell size={24} color={muted} />`
   y `onPress={() => router.push('/alerts')}` — sin `as Href`.

**AND** `PetHeroHeader` **no se modifica**: la campana se compone desde Home
dentro del slot que el hero ya expone (`pet-hero-header.tsx:36-37`, «el hero NO
conoce a su contenido»). Profile, que usa el mismo componente, no cambia.

**AND** cuando `hasPets === false` no hay hero, luego no hay campana: sin
mascotas no puede haber alertas.

**Test**: `src/screens/home/index.test.tsx::#78 R10: la campana vive en el hero y
lleva al centro de alertas` — cuatro `it`: (a) `home-hero-actions` tiene 2 hijos y
el primero es el envoltorio `flex-1` del switcher; (b) pulsar la campana llama
`router.push` **una vez** con `'/alerts'`; (c)
`expect(appRoutes(join(process.cwd(), 'src/app/(tabs)'))).toContain('/alerts')`
—el helper ya existe en `index.test.tsx:46-62`— y el fuente **no** contiene
`"'/alerts' as Href"`; (d) sin mascotas no hay `home-alerts-bell`.

### R11 — punto rojo derivado de las alertas abiertas

**WHEN** Home resuelve `listAlerts(baseUrl, token, 'open')`
**THE SYSTEM SHALL**:

| Estado | Punto | Nombre accesible de la campana |
|---|---|---|
| `{kind:'ok'}` con `items.length > 0` | se pinta `testID="home-alerts-dot"` | `t('home.alertsBellUnread')` |
| `{kind:'ok'}` con `items.length === 0` | **no** se pinta | `t('home.alertsBell')` |
| aún sin resolver (`data === undefined`) | **no** se pinta | `t('home.alertsBell')` |
| `unauthorized` / `error` / `unreachable` / `missing-config` | **no** se pinta, **sin crash**, y la campana sigue navegando | `t('home.alertsBell')` |

El punto es un `<View testID="home-alerts-dot" className="absolute right-1 top-1 size-2.5 rounded-full bg-danger" />`
dentro del `Pressable` de la campana. **Sin número**: ver §0.3 D2.

**AND** la petición se hará con `useApi` y una `alertsFn` memoizada con
`useCallback([baseUrl, token])`, igual que `petsFn`
(`src/screens/home/index.tsx:152-155`), y su `refetch` se añadirá al
`useFocusEffect` que ya existe en `:221-226`, junto a `refetchPets` y
`refetchDetail`. Ése —y no otro— es el mecanismo por el que el punto se apaga
tras un ack: el usuario vuelve de `/alerts`, Home recupera el foco, refetch,
`items.length === 0`, punto fuera.

**Test**: `src/screens/home/index.test.tsx::#78 R11: el punto rojo sigue a las
alertas abiertas` — un `it` por fila de la tabla (con
`mockListAlerts` devolviendo cada `kind`), más uno que invoca el callback de
`mockUseFocusEffect.mock.calls.at(-1)?.[0]` —patrón ya usado en `:806-816`— y
afirma que `listAlerts` se llamó **dos** veces y que, devolviendo `items: []` la
segunda, el punto desaparece.

### R12 — la copia registrada en la tabla normativa

**WHEN** se ejecuta `src/__tests__/ui-language.test.ts`
**THE SYSTEM SHALL** encontrar en `src/__tests__/ui-copy-table.ts` un bloque
nuevo `export const R12_ALERTS: UseRow[]` con **una fila por ocurrencia real** de
`t()` (y de `labelKey:`) en `src/screens/alerts/index.tsx`, incluido en
`ALL_USES` y en el array `blocks` del test interno de ese mismo archivo
(`ui-copy-table.ts:415-418`, que hoy enumera once bloques a mano).

> El nombre `R12_ALERTS` continúa la numeración de bloques de **#65**; no es un
> R-id de #78.

**AND** las cifras que esto mueve se declaran como **delta**, nunca como total:

| Candado | Hoy | Pasa a |
|---|---|---|
| `ui-language.test.ts:391` `SCREEN_FILES` | `toHaveLength(19 + 2)` | `toHaveLength(19 + 2 + 1)` — el único fichero nuevo con copy es `src/screens/alerts/index.tsx`; `src/screens/home/index.tsx` ya estaba en la lista |
| `ui-language.test.ts:83` `R3_HOME` | `toHaveLength(21 + 15 + 1 + 4 + 7)` | `toHaveLength(21 + 15 + 1 + 4 + 7 + 2)` — las dos claves nuevas de la campana, una ocurrencia cada una |
| `language-provider.test.tsx:41` | ver R3 | `+ 14` |

**AND** el bloque `R12_ALERTS` **no** lleva su propia longitud congelada en un
`toHaveLength(n)` con número escrito a mano: se cierra con `checkUses(R12_ALERTS)`
y con la suma interna de `ALL_USES`, que es el criterio que la enmienda (3) de
#65 ya adoptó tras tres cifras envejecidas.

**AND** no quedará **ningún literal en inglés (ni en español) en pantalla ni en
los tests**: todo el copy visible sale de `t()`, y los tests comparan contra
`t()`/el catálogo o contra claves, nunca contra una cadena escrita a mano.

**Test**: `src/__tests__/ui-language.test.ts::#78 R12: el centro de alertas
resuelve su copy por clave` — un `describe` nuevo con
`expect(R12_ALERTS.every(({file}) => file === 'src/screens/alerts/index.tsx')).toBe(true)`,
`checkUses(R12_ALERTS)`, y la comprobación de que las 14 claves de R3 aparecen en
`specs/mobile-ui-language/design.md` con el sufijo `← añadida por #78 (R3)`
(mismo regex que `ui-language.test.ts:105-113`).

### R13 — conformidad con la carta y candados que **no** se mueven

**WHEN** se ejecuta la suite móvil completa (`bun run test` desde
`mobile-pet-tracker/`)
**THE SYSTEM SHALL** terminar verde **sin tocar** ninguno de estos candados, lo
que es a la vez el criterio de diseño de la pantalla:

| Candado | Cifra que **no** cambia | Cómo se respeta |
|---|---|---|
| `consistency-classnames.test.ts:102` `rounded-xl bg-accent` | 13 | la pantalla no tiene botón primario sólido; el `retry` usa el `Button` de heroui sin `className` de acento, como `reminders-retry` (`reminders/index.tsx:182`) |
| `consistency-classnames.test.ts:290-331` `CONTINUOUS_CORNER` (lista por fichero + total `33 + 1 + 1`) | sin sumandos nuevos | la pantalla no dibuja ninguna esquina no-cápsula por su cuenta: las filas son `Card` (que ya funde la esquina) y los iconos son `rounded-full` |
| `consistency-classnames.test.ts:344-386` `TABULAR_NUMS` | sin sumandos nuevos | no hay ningún número en pantalla — el punto no lleva contador (D2) y el tiempo relativo es texto |
| `consistency-classnames.test.ts:446` `bg-accent-soft` | 16 | la campana no lleva fondo: va sobre la banda opaca del slot del hero |
| `consistency-classnames.test.ts:388-437` clases `category-*` | solo en `utils/category-palette.ts` | la pantalla usa severidad (`danger-soft`/`warning-soft`/`default`), no la paleta categórica |
| `legibility-classnames.test.ts:117-140` `text-accent-strong` (lista + total `13 + 1`) | sin sumandos nuevos | ni la pantalla ni la campana usan `text-accent-strong` |
| `design-drift.test.ts:141-145` versiones de dependencias | sin cambios | **cero dependencias nuevas** |

**AND** cumplirá el grep-clean de la carta §Decisiones fijas 3 y C8: cero hex
fuera de `src/theme/`, cero clases arbitrarias `[...]`, cero `StyleSheet.create`,
cero `shadow`/`elevation` legacy, cero `rounded-2xl|lg|md|sm`.

**AND** `./init.sh` desde la raíz terminará con exit 0. **No se escribe en la
spec ningún recuento absoluto de tests o de suites**: el criterio es exit 0 y
"ninguna suite que estaba verde queda roja" (lección de las tres cifras
congeladas que ya pararon el trabajo).

**Test**: los candados citados son tests **ya existentes**; R13 es un
**requisito de verificación** en el sentido de C4 (solo asevera propiedades de lo
que R4–R12 dejaron en el árbol). Se cierra por la vía **(b)**: prueba de mutación
documentada en `progress/impl_mobile-alerts-center.md` §R13 — cambiar en
producción `bg-danger-soft` por `bg-accent-soft` en la fila, ver rojo
`consistency-classnames.test.ts` por su aserción de 16, y restaurar con
`git diff` vacío. Sin sonda vista en rojo no hay candado (carta §Enmienda #70,
método).

### R14 — gate humano: prueba de humo con una alerta real

**WHEN** la implementación esté completa y `init.sh` verde
**THE SYSTEM SHALL** quedar pendiente de una prueba de humo que ejecuta **un
humano**, **no delegable a ninguna IA**, en un **dev build de Android** (nunca
Expo Go: el runtime de smoke de este repo es el dev build desde 2026-08-27,
carta §Animación), con una alerta `open` real —salida de geocerca con collar, o
fila insertada a mano en `alert_events` respetando
`alert_events_type_check`— y comprobando, en este orden:

1. Home muestra el punto rojo en la campana.
2. Tocar la campana abre el centro de alertas y **no** hay una sexta pestaña en
   la barra flotante.
3. La alerta aparece arriba, con el nombre de la mascota, el tipo en español y el
   tiempo relativo.
4. "Marcar leída" cambia la fila a *Leída* sin que la pantalla parpadee ni se
   recargue, y la fila **no** cambia de sitio.
5. Volver a Home apaga el punto rojo.
6. Todo el texto en español, sin una sola palabra en inglés.

El resultado se anota en `progress/impl_mobile-alerts-center.md` §R14. Hasta que
el humano lo firme, la feature **no** pasa a `done` aunque el `reviewer` haya
aprobado el resto.

---

## Cobertura de los criterios de aceptación de `feature_list.json`

| # | Criterio (resumido) | R-ids |
|---|---|---|
| 1 | Punto rojo con ≥1 alerta `open`, fuera cuando no hay | R11 (+ R1) |
| 2 | La campana navega; la ruta existe bajo `(tabs)/` y **no** es pestaña | R5, R10 |
| 3 | `open` primero, con `petName`, tipo traducido y `openedAt` relativo; acked/closed distinguibles | R6, R7 |
| 4 | Ack → `POST …/ack`, pasa a `acked` sin recargar, y el punto se actualiza | R8, R11 |
| 5 | Paginación por `nextCursor`; sin cursor no pide más | R9 |
| 6 | Mascota sin suscripción → estado vacío con texto, sin crash ni campana rota | R4 (rama vacía) y R11 (campana intacta) — **con la corrección D1 de §0.2: no hay 402** |
| 7 | Vacío y error con copy vía `t()`, cero literales en inglés | R3, R4, R12 |
| 8 | Tests unitarios de la API y de la pantalla; suite verde; ninguna cifra de candado sin delta | R1, R2, R3, R12, R13 |
| 9 | Gate humano: smoke en dev build de Android con alerta `open` real | R14 |

---

## Fuera de alcance

- **Cualquier cambio en `backend-pet-tracker/`.** Ni `GET /v1/alerts/count`, ni
  `unreadCount` en la respuesta, ni `?petId=`, ni ampliar
  `alert_events_type_check`. Todo eso son features de backend propias.
- **Contador numérico en la campana** — §0.3 D2: exige backend nuevo para ser
  honesto por encima de 50.
- **Fusionar recordatorios en el centro de alertas.** Decisión cerrada: el centro
  muestra **solo alertas**. Los recordatorios los despacha el scheduler y no
  entran en `/alerts` (`alert_events_type_check`, §0.1). Fusionar dos fuentes en
  cliente daría dos paginaciones, dos relojes y dos semánticas de "leído".
- **Filtros de estado en la UI** (chips *Abiertas / Leídas / Resueltas*). El
  backend los soporta (`?status=`) pero cada filtro es su propio flujo de cursor
  y multiplica los estados de la pantalla. La v1 lista todo con las abiertas
  arriba (R7).
- **Detalle de una alerta, y navegar de una alerta a su geocerca o a su mascota.**
  No existe pantalla de geocercas en la app (`src/api/geofences.ts` tampoco
  existe) y `payload` no está tipado. La fila no navega (R6, decisión 8).
- **Cerrar (`closed`) una alerta desde la app.** El backend no expone ningún
  endpoint para cerrarla: `closed` lo escribe el motor de #12.
- **Pull-to-refresh** en el centro de alertas. `useFocusEffect` ya recarga al
  entrar; el `RefreshControl` no lo usa ninguna otra pantalla del repo y añadiría
  un patrón nuevo sin pedirlo nadie.
- **Push / notificaciones del sistema.** Es #79, y esta feature no depende de
  ella: sin push el usuario ve sus alertas al abrir la app.
- **Modificar `src/components/pet-hero-header.tsx`, `pet-switcher.tsx`,
  `floating-tab-bar.tsx` o `(tabs)/_layout.tsx`.** La campana se compone desde
  Home (R10); la barra no se toca (R5).
- **Animación de entrada de las filas o del punto rojo.** El backlog de
  animación vive en `progress/audit_animations_mobile.md` y esta feature no abre
  ese frente.
- **Dependencias nuevas.** Cero: `FlatList` es de React Native, y `LocationSlash`
  / `BatteryLow` / `Bell` ya vienen en `reicon-react-native`.

---

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-10) ← gate obligatorio antes de implementar

Al aprobar, el humano ratifica además **cuatro decisiones que corrigen o cierran
el enunciado de #78**, y que Codex no podrá reabrir porque no verá esta
conversación:

1. **D1 (§0.2)**: `/v1/alerts` **no** devuelve 402 y no se añade un `kind:
   'no-tracking'`. El criterio de aceptación 6 se cumple por la rama de lista
   vacía. Si en el futuro alguien pone `PetTrackingGuard` sobre las rutas de
   alertas, esta decisión caduca y hay que revisarla.
2. **D2 (§0.3)**: campana con **punto**, no contador — confirmado, con el motivo
   corregido (el número sí es derivable hasta 50; un contador que se congela ahí
   miente).
3. **D4 (R7)**: el centro lista **todas** las mascotas con `petName`, sin filtrar
   por la mascota seleccionada.
4. **§0.4**: no hay TanStack Query en este repo; el refresco del punto rojo es
   `useApi().refetch` dentro del `useFocusEffect` de Home, y no hay ninguna query
   key que invalidar.
