---
feature: "mobile-alert-detail-screen"
status: draft     # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-alert-detail-screen]] (#100)

> El molde es `specs/mobile-reminders-alerts-to-stack/` (#114): mismo formato
> de sondas, de inventario de aserciones heredadas y de delta por fichero.
> Todo lo que sigue se verificó contra el árbol en `a9965ee3` (base de
> [[requirements]]); las citas son por contenido o por commit, nunca por número
> de línea. Rutas relativas a `mobile-pet-tracker/` salvo `docs/` y `specs/`.
> Las decisiones de producto son P1–P7 de [[requirements]]; aquí D-n son
> decisiones técnicas.

## Skills y documentación

- **Codex** (plugin `expo@openai-curated` v1.0.2): cargar `building-native-ui`
  (pantalla, `ScrollView`, métricas, `Text selectable`) y
  `native-data-fetching` (TanStack Query). **Codex no tiene skill de router**:
  todo lo que necesita de `expo-router` está escrito en D1, D3 y D5, y no hay
  que buscarlo en otra parte. No pedir skills por otros nombres (deuda B5).
- **Sesiones Claude** (reviewer): `expo:expo-overview`, `expo:expo-native-ui`,
  `expo:expo-router`, `expo:expo-data-fetching`.
- Carta: `docs/ui-guidelines.md` (C8). Convenciones: `docs/conventions.md`
  §Prefijo de feature, §Filtros de jest, §Tests (regla `waitFor` de TanStack).

## Entorno (verificado, no supuesto)

| Pieza | Versión / hecho | Dónde |
|---|---|---|
| Expo SDK | 57 | `package.json` |
| `expo-router` | 57.0.14, `typedRoutes` activo | `package.json`, `app.json` |
| `react-native-screens` | 4.26.2 | `package.json` |
| `@tanstack/react-query` | 5.102.8 | `package.json` |
| `@testing-library/react-native` | 14.0.1 (árbol solo de host) | `package.json` |
| `react-native` | 0.86.2 | `package.json` |
| `uniwind` / `heroui-native` | 1.11.0 / 1.0.8; `className` llega al nodo host, también al de un `Pressable` (precedente: la campana `home-alerts-bell` de `src/screens/home/index.tsx`, con `className` y opacidad 0.8 aseverados en su test) | `package.json`, `src/screens/home/index.test.tsx` |
| `createQueryClient` | `staleTime: 0`, `retry: false`, sin recarga por foco de ventana ni reconexión; firma `(onUnauthorized = () => undefined, gcTime = 5 * 60 * 1000)` | `src/providers/query-provider.tsx` |
| `renderWithProviders` | asíncrono, `gcTime: 0`, devuelve `{ ...result, queryClient }` | `test/render-with-providers.tsx` |
| Claves | `alertKeys.list()` = `['alerts', 'list']`; `alertKeys.open()` = `['alerts', 'list', { status: 'open' }]` (Home) | `src/api/query-keys.ts` |
| Listado del backend | 50 por página, orden `openedAt` desc, `id` desc; **no hay** `GET` por id | `backend-pet-tracker/` (`ALERTS_PAGE_SIZE`) |
| Payload de push | alertas `data: { petId, alertId }`; recordatorios `data: { petId, reminderId }` | notifier, prueba de humo de #79 |
| `useLocale()` | `es` → `es-MX`, `en` → `en-US` | `src/providers/language-provider.tsx` |
| Zona horaria de jest | sin `TZ` en la config; las fechas de R3 están a mediodía UTC para no cambiar de día en ninguna zona de −11 a +11 | clave `"jest"` de `package.json`, sonda S5 |
| `.expo/types/router.d.ts` | no existe (gitignorado); `tsc` pasa sin él | base |

## §0 Errata del enunciado

| # | El enunciado dice | Verificado | Consecuencia |
|---|---|---|---|
| E1 | "si el detalle necesita un GET por id en el backend o basta con lo que ya devuelve el listado" | El listado trae todo lo que pinta el detalle (`Alert` de `src/api/types.ts`: `id`, `petId`, `petName`, `type`, `status`, `openedAt`…). Una alerta recién notificada es la más reciente: está en la primera página. | Sin endpoint (P2, D2). La feature de backend queda como deuda sin id. |
| E2 | "si la pantalla vive en (tabs) o en un Stack, que enlaza con #95" | Cerrado por #114: `alerts` ya es hija del `Stack.Protected` raíz. | El detalle nace ahí (D1). |
| E3 | "#79 R10 fija router.push('/alerts')" | Cierto y aprobado. | Enmienda A16. |
| E4 | "#78 cerró explícitamente en su Fuera de alcance que la fila no navega" | Cierto (decisión 8, y 11 y 12 fijan el literal de la columna). | Enmienda A17. |
| E5 | `files_affected`: dos ficheros | Son 25, más esta spec ([[#Archivos afectados]]). | Se amplía en `feature_list.json`. |
| E6 | "el id de la feature de backend que lo habilita" | No hace falta endpoint. | No se asigna id. |
| E7 | (no lo dice) | El reset de `actionError` de #97 R4 en el centro no tenía camino desde #114 (su Fuera de alcance lo anticipó). | Con R6, salir al detalle y volver lo ejercita otra vez. Sin test nuevo: el de #97 sigue cubriéndolo. |

## §1 Sondas ejecutadas (ficheros de sonda borrados; `git status` limpio al terminar)

Logs en el scratchpad de la sesión del spec_author, no versionados.

| Sonda | Árbol | Resultado | Sostiene |
|---|---|---|---|
| S1 (`probe100s.log`) | `renderRouter` con `alerts/[alertId]` hijo del Stack raíz, tres variantes de `dangerouslySingular` | `true`: primer `alert-2` → pila `[index, alerts/[alertId]{alert-2}]`, 1 montaje; mismo id otra vez → pila igual, 1 montaje; `alert-3` → apila, ruta `/alerts/alert-3`, 2 montajes. Función: igual que `true`. Sin la prop: el mismo id **duplica** (2 montajes) y `alert-3` añade una tercera entrada. | D1, P3, R7 |
| S2 (`probe2.log`) | Idem con `(tabs)` debajo | A1: el parámetro `"a/1 x"` hace ida y vuelta. A2: `dismissTo('/alerts')` sin centro debajo **reemplaza** → `[home, alerts]`. A3: push desde el centro → `[home, alerts, detalle b-2]`. A4: `dismissTo` con el centro debajo **desapila** hasta él. A5–A6: sin singular, duplica (5 montajes de detalle). | D3, R4, R8 |
| S3 (`probe100cd.log`) | `_layout` real y centro real | `onEndReached`, push del detalle de `alert-2` (segunda página), el servidor lo marca, atrás → `alert-row-alert-2-status` aparece. Llamadas a `listAlerts`: 2, 4, 6. Variante d (`useFocusEffect` convertido en no-op): **falla**. | D2 (sin invalidar), R8 |
| S4 (`obs1-m7-noflush.log`, `obs1-m7-flush.log`, `obs1-flush-green.log`) | `#114 R3` con M7 | Sin vaciar temporizadores, M7 **no** pone roja la aserción de pila; con `jest.runOnlyPendingTimers` dentro de `act`, sí; con el vaciado y sin M7, verde. | R9 |
| S5 | `node` | `new Date('2026-12-31T12:00:00.000Z').toLocaleString('es-MX')` → `31/12/2026, 12:00:00 p.m.`; `new Date('2027-01-02T12:00:00.000Z').toLocaleString('en-US')` → `1/2/2027, 12:00:00 PM` (en `es-MX`, `2/1/2027`). | R3 |

## D1 — Ruta, pila y navegación (guía de router para Codex)

- **Fichero**: `src/app/alerts/[alertId].tsx`, route delgado (convención de
  #39). `src/app/alerts.tsx` **se queda** donde está: expo-router admite a la
  vez `alerts.tsx` y la carpeta `alerts/` (S1). **No** se crea
  `src/app/alerts/_layout.tsx`.
- **Declaración** en `src/app/_layout.tsx`, dentro del `Stack.Protected` de
  `RootStack`, justo después del `Stack.Screen` cuyo `name` es `"alerts"`:

  ```tsx
  <Stack.Screen
    name="alerts/[alertId]"
    dangerouslySingular
    options={{ ...headerOptions, title: t('alerts.detailTitle') }}
  />
  ```

  `headerOptions` y `t` ya existen en ese componente (los usa `alerts`).
- **Singular por parámetros**: expo-router compara la ruta **con sus
  parámetros**; mismo `alertId` → no apila ni remonta; otro `alertId` → apila
  (S1). Es lo que pide P3.
- **Href del detalle**: siempre objeto,
  `{ pathname: '/alerts/[alertId]', params: { alertId } }`. Nunca plantilla de
  cadena (`` `/alerts/${id}` ``): el objeto codifica el parámetro (S2, A1).
- **Salida**: `router.dismissTo('/alerts')`. Con el centro debajo, desapila
  hasta él; sin él (toque en frío o en caliente desde otra pantalla), reemplaza
  el detalle por el centro (S2, A2 y A4). Nunca `router.replace` ni
  `<Redirect>` (apilaría un segundo centro si ya había uno debajo).
- **Lectura del parámetro**: `useLocalSearchParams<{ alertId: string }>()` en
  el route; la pantalla recibe `alertId` por prop y no importa nada de
  `expo-router` salvo `router`.
- **Tipos**: con `typedRoutes` y sin `router.d.ts`, `Href` acepta el objeto. Si
  `router.d.ts` aparece en el árbol, Codex no lo borra: lo pide al humano
  (lección `expo-router-types-obsoletos`).

## D2 — Datos: la caché del listado, sin endpoint

- `src/hooks/use-alerts-list.ts` exporta `useAlertsList()`: mueve **tal cual**
  la `useInfiniteQuery` del centro (`queryKey: alertKeys.list()`,
  `queryFn: ({ pageParam }) => listAlerts(baseUrl, token ?? '', undefined, pageParam)`,
  `initialPageParam: undefined as string | undefined`, y el
  `getNextPageParam` que devuelve `nextCursor` solo con página `ok`), leyendo
  `baseUrl = process.env.EXPO_PUBLIC_API_URL` y `token` de `useAuth()` dentro
  del hook. El centro sustituye su bloque por `const alerts = useAlertsList();`
  y conserva `const refetchAlerts = alerts.refetch;` y su `useFocusEffect(`
  antes de `async function handleAck`.
- El detalle busca así (sin `queryKey: [` literal en su fichero):

  ```ts
  const found = alerts.data?.pages
    .flatMap((page) => (page.kind === 'ok' ? page.items : []))
    .find((alert) => alert.id === alertId);
  ```

  y aplica el overlay de esta visita solo si la alerta está abierta:
  `const alert = found?.status === 'open' ? (acked ?? found) : found;` con
  `const [acked, setAcked] = useState<Alert | null>(null)`.
- **Sin recarga de foco** en el detalle y **sin invalidar ni escribir** la caché
  al marcar: el centro recarga al recuperar el foco (#97 R7) y Home recarga
  `alertKeys.open()` al recuperar el suyo. S3 prueba que basta, y que quitar el
  `useFocusEffect` del centro lo rompe (evidencia de mutación de R8 para el
  reviewer).
- **Techo** (P2): el detalle no pide páginas siguientes. Si la alerta no está
  en lo cargado, sale al centro (D3).

## D3 — Precedencia de pintado y salida sin la alerta

Dentro del `ScrollView` raíz, **un solo** bloque según este orden:

1. `alert` definido → tarjeta (R3) y, debajo, botón y error de acción (R5).
2. `alerts.isPending || alerts.isFetching` → `Skeleton`
   `testID="alert-detail-loading"` `className="h-44 w-full rounded-card"`
   (misma altura mínima y radio que la tarjeta).
3. `firstPage?.kind` en `error`, `unreachable` o `missing-config` →
   `<Text selectable testID="alert-detail-error" className="text-danger">` con
   `t('common.somethingWentWrong')` y
   `<Button testID="alert-detail-retry" className="min-h-11" onPress={() => void alerts.refetch()}>`
   con `<Button.Label>{t('common.retry')}</Button.Label>`.
4. En cualquier otro caso (incluida `unauthorized`), nada.

`firstPage = alerts.data?.pages[0]`. Salida: un efecto con guarda por `ref`
llama **una sola vez** a `router.dismissTo('/alerts')` cuando
`found === undefined && firstPage?.kind === 'ok' && !alerts.isFetching`
(todas las páginas cargadas son `ok` en la práctica: el listado solo pide la
segunda si la primera fue `ok`).

Raíz: `ScrollView` `testID="screen-alert-detail"`,
`className="flex-1 bg-background"`, `contentInsetAdjustmentBehavior="automatic"`,
`contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}`
(`insets` de `useSafeAreaInsets()`): la excepción A11 de #95 para pantallas bajo
cabecera nativa, que A15 amplía a `alerts/[alertId]`.

Tarjeta: `<Card testID="alert-detail-card" className="min-h-44 gap-3">`; con la
variante `surface` de `src/components/card.tsx`, la clase final en el host es
`'rounded-card border border-border bg-surface p-4 shadow-sm min-h-44 gap-3'`.
Hijos, en orden: `alert-detail-header`, `alert-detail-pet`,
`alert-detail-opened-at`, `alert-detail-status` (clases en [[requirements]]
R3). La tinta del icono se resuelve como en el centro:
`useThemeColors(['danger', 'warning-strong', 'muted'])` y
`{ danger, 'warning-strong': warningStrong, muted }[meta.ink]`.

`src/utils/alert-meta.ts` exporta `ALERT_TYPE_META`, `UNKNOWN_ALERT_META`
(movidos **literales** del centro, con sus `labelKey:` y el `as const`) y
`alertTypeMeta(type: string)`, que devuelve la entrada de `ALERT_TYPE_META` si
`type in ALERT_TYPE_META` y `UNKNOWN_ALERT_META` si no. El centro usa
`alertTypeMeta(item.type)` en lugar de su ternario.

## D4 — Marcar leída en el detalle

Mismo esquema que `handleAck` del centro, con estas diferencias y nada más:
guarda de doble pulsación con `ackingRef` (booleano) y estado `acking` que da
`isDisabled` al botón; `not-found` → `dismissTo('/alerts')` (una vez, la misma
guarda que D3) **sin** texto. El `switch` queda así para cuadrar con la tabla
de copy (D7):

- `case 'ok':` → `setAcked(result.alert)`.
- `case 'already-closed':` → `setAcked({ ...alert, status: 'closed' })`.
- `case 'not-found':` → salida.
- `case 'unreachable':` → `setActionError(t('common.cannotReachServer'))`.
- `case 'unauthorized':` → `await signOut()`, **única** llamada a `signOut(` del
  fichero (mapa de `design-drift.test.ts`).
- `case 'error': case 'missing-config':` → **una** llamada
  `setActionError(t('common.somethingWentWrong'))` para las dos.
- `catch` → `setActionError(t('common.somethingWentWrong'))`.
- `finally` → libera la guarda.

`setActionError(null)` al empezar. El botón:
`<Button testID="alert-detail-ack" accessibilityRole="button" className="min-h-11" isDisabled={acking} onPress={() => void handleAck()}>`
con `<Button.Label>{t('alerts.ack')}</Button.Label>`, solo si
`alert.status === 'open'`. El error:
`<Text selectable testID="alert-detail-action-error" className="text-danger">`.

## D5 — El toque de la notificación

En `src/hooks/use-push-registration.ts`:

```ts
import type { NotificationResponse } from 'expo-notifications';
import { router, usePathname, type Href } from 'expo-router';

function notificationHref(response: NotificationResponse): Href {
  const alertId = response.notification?.request.content.data?.alertId;
  return typeof alertId === 'string' && alertId.length > 0
    ? { pathname: '/alerts/[alertId]', params: { alertId } }
    : '/alerts';
}
```

El listener pasa a `(response) => { router.push(notificationHref(response)); }`
y el camino en frío a `if (response) router.push(notificationHref(response));`.
El `?.` tras `notification` es necesario: los tests heredados de R10 pasan
`{} as Notifications.NotificationResponse` y deben seguir verdes con
`'/alerts'`. `import type` se borra al compilar, así que `R15` (importar el
módulo no toca `expo-notifications`) sigue verde.

## D6 — La fila del centro enlaza al detalle

En `src/screens/alerts/index.tsx`, el `View` con
`className="min-w-0 flex-1 gap-1"` pasa a:

```tsx
<Pressable
  testID={`${rowId}-link`}
  accessibilityRole="button"
  className="min-h-11 min-w-0 flex-1 gap-1"
  style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
  onPress={() =>
    router.push({ pathname: '/alerts/[alertId]', params: { alertId: item.id } })
  }
>
```

con los mismos tres `Text` dentro. `Pressable` se añade al import de
`react-native` y `router` al de `expo-router`. Nada más cambia en la fila:
icono a la izquierda, botón o píldora a la derecha, tarjeta sin `onPress`.

## D7 — Copy: catálogo, spec de idioma y tabla de uso

- **Catálogo** (R1): tres claves tras `'alerts.daysAgo'` en `en` y en `es`. El
  candado pasa de 306 a 309 con `+ 3` visible.
- **`specs/mobile-ui-language/design.md`**: sección
  `### §2.14 — Añadidos por #100 — Detalle de alerta` antes de
  `## 3. La infraestructura`, con las tres filas. El `it` de R1 las busca con la
  misma expresión regular que `#98 R3`, cambiando `#98 \\(R3\\)` por
  `#100 \\(R1\\)`.
- **`src/__tests__/ui-copy-table.ts`**: bloque nuevo `R13_ALERT_DETAIL`, con
  exactamente estas filas (una por ocurrencia, que es lo que cuenta
  `checkUses` con igualdad exacta):

  | Fichero | Clave | Ocurrencias |
  |---|---|---:|
  | `src/app/_layout.tsx` | `alerts.detailTitle` | 1 |
  | `src/screens/alert-detail/index.tsx` | `alerts.openedAt` | 1 |
  | `src/screens/alert-detail/index.tsx` | `alerts.statusOpen` | 1 |
  | `src/screens/alert-detail/index.tsx` | `alerts.statusAcked` | 1 |
  | `src/screens/alert-detail/index.tsx` | `alerts.statusClosed` | 1 |
  | `src/screens/alert-detail/index.tsx` | `alerts.ack` | 1 |
  | `src/screens/alert-detail/index.tsx` | `common.somethingWentWrong` | 3 |
  | `src/screens/alert-detail/index.tsx` | `common.cannotReachServer` | 1 |
  | `src/screens/alert-detail/index.tsx` | `common.retry` | 1 |

  Las tres de `somethingWentWrong` son: el texto de error de D3, el
  `case 'error': case 'missing-config':` y el `catch` de D4. La píldora hace
  **tres** llamadas `t(` literales (una por estado, en un ternario). Las
  etiquetas de tipo **no** se cuentan en el detalle: salen de
  `alert-meta.ts` por `t(meta.labelKey)`, como en el centro.
  `R13_ALERT_DETAIL` entra en `ALL_USES` y en el array de bloques del
  `it('cuadra ALL_USES con la suma de los doce bloques')` (el título del `it`
  no cambia).
- **Mudanza de las tres etiquetas de tipo** (verde de R3): sus filas de
  `R12_ALERTS` cambian el fichero de `src/screens/alerts/index.tsx` a
  `src/utils/alert-meta.ts`; el predicado del `it('registra cada ocurrencia de la pantalla')`
  de `#78 R12` gana `|| file === 'src/utils/alert-meta.ts' // #100 R3`, y
  `expect(SCREEN_FILES).toHaveLength(19 + 2 + 1 + 1); // #95 R4` gana
  `+ 1 // #100 R3`. En el rojo de R10 gana otro `+ 1 // #100 R10` (el detalle).

## D8 — Plan de tests por fichero

Reglas comunes: `describe` nuevos con prefijo `#100 R<n>:`; mocks **por
intención**, comprobados contra el fichero destino (no calcados a ciegas); en
los ficheros con `renderRouter`, un solo `it`, `afterEach(() => jest.useRealTimers())`
y `jest.mock('standard-navigation', () => ({}))`; esperar con `waitFor` y no
con `act` suelto tras cambios de TanStack (`docs/conventions.md` §Tests).

**`src/screens/alert-detail/index.test.tsx` (nuevo, 25 tests).** Dobles por
intención: `expo-router` → `{ router: { dismissTo: jest.fn(), push: jest.fn() } }`
(observar la navegación sin navegador); `../../api/alerts` →
`{ ackAlert: jest.fn(), listAlerts: jest.fn() }`;
`../../providers/auth-provider` → `useAuth` con `{ token: 'token-1', signOut }`;
`react-native-safe-area-context` → insets `top: 40`, `bottom: 24`;
`reicon-react-native` → cada icono como `View` con prop `iconName` (saber qué
icono es); `../../theme/use-theme-colors` → `` `--color-${token}` ``.
`heroui-native` **real** bajo `HeroUINativeProvider`, con
`LanguageProvider initial={language}` (por defecto `'es'`), vía
`renderWithProviders`. `process.env.EXPO_PUBLIC_API_URL` se fija en
`beforeEach` como en `src/screens/alerts/index.test.tsx`. Fixture
`makeAlert(overrides)` con los mismos valores por defecto que la del centro.

- `#100 R3` (9): `it.each` de tipos (`geofence_exit`, `battery_low` y un tipo
  desconocido: `iconName`, `size` 20, `color`, clase exacta del disco, texto
  del tipo, mascota `selectable`, cuatro hijos en orden por `testID`); `it.each`
  de estados (`open` → "Sin leer", `acked` → "Leída", `closed` → "Resuelta", con
  la clase exacta de la píldora); `it.each` de fechas (tabla de [[requirements]]
  R3, `selectable`); y métricas (`contentInsetAdjustmentBehavior`,
  `contentContainerStyle` `{ padding: 24, gap: 16, paddingBottom: 48 }`, clase
  de la raíz y de la tarjeta).
- `#100 R4` (7): esqueleto con `listAlerts` pendiente (sin tarjeta, sin error,
  sin salida); `it.each` de `error`, `unreachable` y `missing-config` (texto
  `selectable`, Reintentar con `min-h-11`, pulsarlo vuelve a llamar a
  `listAlerts` y, con `ok`, aparece la tarjeta); `unauthorized` (nada pintado,
  `dismissTo` sin llamar); salida una vez (lista `ok` sin la alerta →
  `dismissTo('/alerts')` una vez; tras `queryClient.refetchQueries()` sigue en
  una); caché vieja (se monta **sin** `renderWithProviders`: un
  `QueryClientProvider` con `createQueryClient(jest.fn(), 60_000)` y
  `setQueryData(alertKeys.list(), { pages: [<página ok sin la alerta>], pageParams: [undefined] })`
  antes de pintar; con `listAlerts` pendiente → esqueleto y sin salida;
  resuelta con la alerta → tarjeta y sin salida).
- `#100 R5` (9): `ok` (llamada con `(apiUrl, 'token-1', 'alert-1')`, rol
  `button` y `min-h-11` en el botón, píldora "Leída", botón fuera); 
  `already-closed` ("Resuelta", botón fuera); `not-found` (`dismissTo` una
  vez); `it.each` de `error`, `missing-config`, `unreachable` y promesa
  rechazada (texto de error `selectable` con su mensaje); `unauthorized`
  (`signOut` una vez, sin texto); doble pulsación con la llamada pendiente
  (`ackAlert` una vez).

**`src/screens/alerts/index.test.tsx` (+3).** El doble de `expo-router` gana
`router: { push: jest.fn() }` en el rojo de R6 (campo que producción aún no
usa: no es un doble mutado). `#100 R6`: ids cruzados (pulsar el enlace de
`alert-2` y luego el de `alert-1` → `toHaveBeenNthCalledWith` con cada
`params`); rol, clase exacta y opacidad (`1` en reposo; `0.8` tras
`await fireEvent(link, 'responderGrant', { nativeEvent: {}, persist: () => undefined })`,
patrón de `#122 R2` en `src/screens/home/index.test.tsx`); "Marcar leída" no
navega (`ackAlert` llamado, `router.push` no).

**`src/hooks/use-push-registration.test.tsx` (+10).** `#100 R7`: `it.each` de
cinco `data` × dos modos. Respuesta:
`{ notification: { request: { content: { data } } } } as unknown as Notifications.NotificationResponse`.
Modo caliente: calcado de `it('navega una vez al recibir un tap con sesión')`
(`responseListener?.(response)`); modo frío: calcado de
`it('navega una sola vez desde una respuesta de cold start')`
(`mockGetLastResponse.mockResolvedValue(response)`). Filas:
`{ alertId: 'alert-9' }` → objeto; `{ alertId: '' }`, `{ alertId: 42 }`,
`null` y `{ reminderId: 'r-1' }` → `'/alerts'`. Cada test asevera
`mockRouterPush` llamado **una** vez con el href exacto.

**`src/app/__tests__/alert-detail.notification.test.tsx` (nuevo, 1).**
Andamiaje copiado de `reminders-alerts-stack.notification.test.tsx` (mocks,
`routes()`, `rootStack(app)`, `tap = mockAddResponseListener.mock.calls.at(-1)?.[0]`),
con una rama más en `routes()` para la clave que termina en
`alerts/[alertId]`: un `DetailStub` que cuenta `mockDetailMounts`. Secuencia,
**vaciando temporizadores** (`await act(async () => { jest.runOnlyPendingTimers(); })`)
tras cada toque antes de aseverar:
1. Frío con `alert-1` → `app.getPathname()` `/alerts/alert-1`, pila
   `['(tabs)', 'alerts/[alertId]']`.
2. `router.back()` → `/home`, `router.canGoBack()` `false`.
3. `router.push('/add-reminder')`; toque en caliente con `alert-2` → pila
   `['(tabs)', 'add-reminder', 'alerts/[alertId]']`.
4. Mismo `alert-2` → pila igual y `mockDetailMounts` igual.
5. `alert-3` → `/alerts/alert-3`, un montaje más.
6. Toque con `{}` → `/alerts`.

**`src/app/__tests__/alert-detail.navigation.test.tsx` (nuevo, 1).**
`renderRouter` con `AlertsRoute` **real** (`src/app/alerts.tsx`) y el route
real del detalle; `heroui-native` por intención (`Button` como `Pressable` que
pasa `testID`, `onPress`, `isDisabled` y `accessibilityRole`; `Button.Label`
como `Text`; `Skeleton` como `View`), porque el proveedor real no monta bajo
`renderRouter`. `listAlerts` devuelve dos páginas (`alert-1` en la primera,
`alert-2` en la segunda, `nextCursor` en la primera). Secuencia:
`onEndReached` de `alerts-list`; pulsar `alert-row-alert-2-link`; en el detalle
"Marcar leída" con `ackAlert` → `ok` y el servidor ya devolviendo `alert-2`
como `acked`; píldora "Leída"; `router.back()`;
`alert-row-alert-2-status` dice "Leída" y no hay `alert-row-alert-2-ack`.
Después, `router.push({ pathname: '/alerts/[alertId]', params: { alertId: 'alert-404' } })`
→ `/alerts` y la pila con **una** entrada `alerts`. Rojo por la ruta (b):
mutación "`found` busca solo en `pages[0]`". Evidencia de mutación para el
reviewer: borrar `void refetchAlerts();` del `useFocusEffect` del centro lo
pone rojo (S3, variante d).

**`src/app/__tests__/reminders-alerts-stack.notification.test.tsx` (Δ 0).**
R9: una línea nueva (D10).

**`src/app/__tests__/layout.test.tsx` (+2)** y
**`src/app/__tests__/detail-stack.test.tsx` (+1)**: [[requirements]] R2. El
segundo `it` de layout asevera las `options` con `toEqual`:
`{ headerShown: true, title: 't:alerts.detailTitle', headerStyle: { backgroundColor: 'token:background' }, headerTintColor: 'token:foreground', headerTitleStyle: { fontFamily: 'Inter-Bold' }, headerShadowVisible: false }`
(los dobles de `t` y de tokens de ese fichero, igual que `#114 R4`).

**`src/providers/__tests__/language-provider.test.tsx` (+1)**,
**`src/__tests__/ui-language.test.ts` (+1)**,
**`src/__tests__/design-drift.test.ts` (Δ 0)**: R1, R10 y R5.

| Fichero | Base | Cierre | Δ |
|---|---:|---:|---:|
| `src/providers/__tests__/language-provider.test.tsx` | 9 | 10 | +1 |
| `src/app/__tests__/detail-stack.test.tsx` | 14 | 15 | +1 |
| `src/app/__tests__/layout.test.tsx` | 18 | 20 | +2 |
| `src/screens/alert-detail/index.test.tsx` (nuevo) | — | 25 | +25 |
| `src/screens/alerts/index.test.tsx` | 33 | 36 | +3 |
| `src/hooks/use-push-registration.test.tsx` | 41 | 51 | +10 |
| `src/app/__tests__/alert-detail.notification.test.tsx` (nuevo) | — | 1 | +1 |
| `src/app/__tests__/alert-detail.navigation.test.tsx` (nuevo) | — | 1 | +1 |
| `src/__tests__/ui-language.test.ts` | 25 | 26 | +1 |
| `src/__tests__/design-drift.test.ts` | — | — | 0 |
| `src/app/__tests__/reminders-alerts-stack.notification.test.tsx` | — | — | 0 |
| **Total** | 83 suites / 1545 | 86 suites / 1590 | +3 / +45 |

## D9 — Inventario de aserciones heredadas que cambian

| # | Fichero › describe › it | Spec dueña | Cambio | R |
|---|---|---|---|---|
| 1 | `language-provider.test.tsx` › `#65 R12: …` › `'mantiene la base más las claves de #68 …'` | #65 | `+ 3` y comentario | R1 |
| 2 | `layout.test.tsx` › `#114 R1: …` › `'declara ocho rutas protegidas y alerts singular'` | #114 | `toHaveLength(8)` → `toHaveLength(8 + 1) // #100 R2`; `children.slice(6)` → `children.slice(6, 8)` | R2 |
| 3 | `ui-copy-table.ts` › `R12_ALERTS` | #78 | tres filas de tipo: fichero → `src/utils/alert-meta.ts` | R3 |
| 4 | `ui-language.test.ts` › `#78 R12: …` › `'registra cada ocurrencia de la pantalla'` | #78 | predicado `|| file === 'src/utils/alert-meta.ts' // #100 R3` | R3 |
| 5 | `ui-language.test.ts` › `#65 R18: …` › `'no deja ningún valor fijo del catálogo como literal entero en las pantallas'` | #65 | `SCREEN_FILES` `+ 1 // #100 R3` y `+ 1 // #100 R10` | R3, R10 |
| 6 | `ui-copy-table.ts` › `ALL_USES` y `'cuadra ALL_USES con la suma de los doce bloques'` | #65 | añade `R13_ALERT_DETAIL` | R10 |
| 7 | `design-drift.test.ts` › mapa `screenSignOutCalls` | #108 | `'screens/alert-detail/index.tsx': 1` | R5 |
| 8 | `alerts/index.test.tsx` › `#78 R6: …` › `'canda las doce decisiones para $type'` | #78 (A17) | `'min-w-0 flex-1 gap-1'` → `'min-h-11 min-w-0 flex-1 gap-1'` | R6 |
| 9 | `alerts/index.test.tsx` › `#78 R6: …` › `'alterna el tercer hijo entre ack y la píldora traducida'` | #78 (A17) | el mismo literal | R6 |
| 10 | `alerts/index.test.tsx` › doble de `expo-router` | #78 | gana `router: { push: jest.fn() }` | R6 |
| 11 | `reminders-alerts-stack.notification.test.tsx` › `#114 R3: …` | #114 | vaciado de temporizadores tras el segundo toque | R9 |

**Verificado que no cambian**: `src/screens/home/index.test.tsx` (su
`appRoutes()` solo usa `toContain`, y una ruta más no lo rompe);
`use-push-registration.test.tsx` `R10` (respuesta `{}` → `'/alerts'`) y `R15`
(`import type` se borra); `#78 R6` sigue viendo el rol solo en el ack **de la
fila** porque el enlace es otro nodo con su `testID`; `#97` (reset de
`actionError` al perder el foco) no se toca.

**Medición pendiente M-P1** (no medida en verde): los `routes()` propios de
`detail-stack.navigation.test.tsx`, `detail-stack.guard.test.tsx` y
`reminders-alerts-stack.navigation.test.tsx` ven `alerts/[alertId]` desde el
verde de R2. Comando y regla en [[requirements]] §Verificación.

## D10 — Observación 1 de #114 (R9)

En el `it` de `#114 R3`, tras la línea
`await act(async () => tap({} as Notifications.NotificationResponse));` del
**segundo** toque (la que va justo después de `const mounts = mockAlertsMounts;`)
se inserta `await act(async () => { jest.runOnlyPendingTimers(); });`. Nada
más. M7 (quitar `dangerouslySingular` del `Stack.Screen name="alerts"`) solo
vive en el commit rojo y pone rojas también las aserciones de `#114 R1` de
`layout.test.tsx` (declarado en [[requirements]] R9).

## Archivos afectados

**Producción** (`mobile-pet-tracker/`): `src/app/alerts/[alertId].tsx` (nuevo),
`src/app/_layout.tsx`, `src/screens/alert-detail/index.tsx` (nuevo),
`src/screens/alerts/index.tsx`, `src/utils/alert-meta.ts` (nuevo),
`src/hooks/use-alerts-list.ts` (nuevo), `src/hooks/use-push-registration.ts`,
`src/i18n/catalog.ts`.

**Tests**: `src/screens/alert-detail/index.test.tsx` (nuevo),
`src/screens/alerts/index.test.tsx`, `src/hooks/use-push-registration.test.tsx`,
`src/app/__tests__/alert-detail.notification.test.tsx` (nuevo),
`src/app/__tests__/alert-detail.navigation.test.tsx` (nuevo),
`src/app/__tests__/layout.test.tsx`, `src/app/__tests__/detail-stack.test.tsx`,
`src/app/__tests__/reminders-alerts-stack.notification.test.tsx`,
`src/providers/__tests__/language-provider.test.tsx`,
`src/__tests__/ui-copy-table.ts`, `src/__tests__/ui-language.test.ts`,
`src/__tests__/design-drift.test.ts`.

**Docs y specs** (raíz): `docs/conventions.md`, `docs/ui-guidelines.md` (A15),
`specs/mobile-push-registration/requirements.md` (A16),
`specs/mobile-alerts-center/requirements.md` (A17),
`specs/mobile-ui-language/design.md` (R1), y esta spec (trazabilidad).

**No se toca**: `backend-pet-tracker/`, `infra/`, `init.sh`, CI,
`mobile-pet-tracker/package.json`, `mobile-pet-tracker/app.json`,
`src/app/alerts.tsx`, `src/components/card.tsx`, `src/api/`.

## Coordinación con otras sesiones

Ver [[requirements]] §Coordinación: #115–#118 mueven el candado del catálogo
y `SCREEN_FILES`; quien mergee segundo recuenta conservando la suma visible.
#118 toca `src/app/_layout.tsx`: si mergea antes, el noveno `Stack.Screen` de
R2 va tras los que haya añadido, y el literal `toHaveLength(8 + 1)` se recuenta
igual. Sin solape con #74.

## Alternativas descartadas

- **Endpoint `GET /v1/alerts/:id`**: resolvería el techo de páginas pero es
  otra feature (backend) y ninguna alerta recién notificada lo necesita (E1).
- **`alerts` y detalle en un `alerts/_layout.tsx` con su propio Stack**: añade
  un navegador anidado sin ganancia; `dangerouslySingular` y `dismissTo` ya
  resuelven la pila en el raíz (S1, S2).
- **Tarjeta entera pulsable con el botón dentro**: dos objetivos táctiles
  anidados; el botón necesitaría parar la propagación y el lector de pantalla
  anunciaría uno dentro de otro.
- **Invalidar `alertKeys.list()` al marcar en el detalle**: redundante con la
  recarga de foco del centro (S3) y abriría una carrera con ella.
- **Pasar la alerta entera por parámetros**: no sobrevive al toque en frío y
  mete JSON en la URL.
- **Importar la tabla de tipos desde `src/screens/alerts`**: una pantalla no
  importa de otra (convención de #39); por eso `alert-meta.ts`.
