---
feature: "mobile-alerts-center"
status: approved     # draft | approved  (enmendado por E1-E8 de [[requirements]])
tags: [harness, spec]
---

# Diseño — [[mobile-alerts-center]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Toda decisión visual se valida contra `docs/ui-guidelines.md`.
>
> **Capa**: cliente móvil íntegro. La Clean Architecture de
> `docs/architecture.md` gobierna `backend-pet-tracker/`, que aquí no se toca.
> En `mobile-pet-tracker/` la separación equivalente es la que ya usa el repo:
> `src/api/` (acceso a red, sin JSX) → `src/screens/` (pantalla) → `src/app/`
> (ruta delgada). Ningún `fetch` fuera de `src/api/`.

---

## Decisiones técnicas

### D1 — El 402 no existe en `/v1/alerts`: no se implementa la rama

**Sirve a**: R1, R4, §0.2 de [[requirements]].

El enunciado pedía copiar el `kind: 'no-tracking'` de `src/api/activity.ts:36`.
`/v1/alerts` no está detrás de `PetTrackingGuard` —lo están `positions`,
`geofences`, `activity` y `trips`, y ninguno más— y `mapAlertError` solo emite
404, 409 y 400. El gate de suscripción existe, pero como `INNER JOIN` con
`entitledDeviceSubscription()` dentro de la consulta
(`alert.drizzle.repository.ts:76-89`): filtra filas, devuelve 200 y una lista
más corta. Añadir un `kind` para un status que el endpoint no puede emitir es
código muerto con un test que solo prueba su propio mock. El 402, si algún día
llegara, cae en la rama genérica `{kind:'error'}` — que ya pinta mensaje y
reintento, sin crash.

**Condición exacta que revive esta decisión**: que alguien anote
`@UseGuards(…, PetTrackingGuard)` en `alerts.controller.ts`. Entonces el `kind`
`no-tracking` vuelve a tener sentido y hay que abrir enmienda.

### D2 — Punto, no contador

**Sirve a**: R11, §0.3.

`ALERTS_PAGE_SIZE = 50` y `ListAlertsQuerySchema` es `strictObject` sin `limit`:
`?limit=1` es 400. Con ≤50 abiertas el número es exacto; a partir de ahí no. Un
badge que se queda clavado en `50` miente, y uno que ponga `50+` obliga a
decidir un formato para un caso que hoy no ocurre. El punto responde la pregunta
del brief ("¿hay alguna alerta?") con la información que el backend sí garantiza.
La puerta al contador es una feature de backend (`GET /v1/alerts/count` o
`unreadCount` en la lista), no un apaño de cliente.

### D3 — Datos: `useInfiniteQuery` para las páginas, overlay local para el ack

**Sirve a**: R4, R8, R9, R11.
**Reescrito el 2026-09-11 por las enmiendas E1, E3, E5 y E6** de
[[requirements]]: la versión original de esta decisión se apoyaba en
`src/hooks/use-api.ts`, que #87 borró al migrar el repo a TanStack Query
(`@tanstack/react-query` 5.102.8, `main` @ `cea72945`). La **mitad del overlay
sobrevive intacta**; la mitad del fetching se sustituye.

- **Home**: `useQuery` con `alertKeys.open()` (E2) y
  `queryFn: () => listAlerts(baseUrl, token ?? '', 'open')`. El punto rojo es
  `data?.kind === 'ok' && data.items.length > 0`, y `refetch` entra en el
  `useFocusEffect` que Home ya tiene. Home **no** llama a `signOut`: lo hace el
  `QueryCache` del `QueryProvider` para toda la app.
- **Centro de alertas**: `useInfiniteQuery` con `alertKeys.list()` resuelve
  **todas** las páginas (ver el bloque exacto en R9), y la pantalla conserva
  **una sola** pieza de estado local, la que la librería no puede dar:

  ```ts
  const [acked, setAcked] = useState<Record<string, Alert>>({}); // overlay del ack
  ```

  y el render se compone así, **en este orden y no otro**:

  ```ts
  const fetched  = alerts.data?.pages.flatMap(p => p.kind === 'ok' ? p.items : []) ?? [];
  const ordered  = [...fetched.filter(a => a.status === 'open'),
                    ...fetched.filter(a => a.status !== 'open')];   // R7, sobre el status DESCARGADO
  const rows     = ordered.map(a => acked[a.id] ?? a);              // R8, solo apariencia
  ```

  Ordenar antes de aplicar el overlay es lo que congela la posición de una fila
  al pulsar su ack (R7). El overlay es lo que hace literal el "sin recargar la
  pantalla" (R8): no hay refetch, no hay remonta, no hay parpadeo.

  **Por qué el overlay y no `setQueryData`** (la pregunta que ahora se hace
  sola): parchear el `status` dentro de la caché infinita recalcularía la
  partición de R7 y la fila saltaría de grupo bajo el dedo — la alternativa A9,
  ya descartada. La caché guarda lo que dijo el servidor; el overlay guarda lo
  que el usuario acaba de hacer.

**Alternativa que se descarta aquí y no en §Alternativas** por ser la trampa
obvia: sembrar un `useState` con los items de las páginas mediante un
`useEffect`. Es la fuente clásica de estado desincronizado y obliga a un guard de
"solo la primera vez". Con `useInfiniteQuery` ya no hay ni tentación: la caché es
la única fuente de las filas descargadas, y el overlay —que no sincroniza nada—
es la única fuente de la apariencia del ack.

### D4 — Una sola lista, de todas las mascotas, con `petName`

**Sirve a**: R7.

`GET /v1/alerts` es **del usuario**: la autorización es el
`INNER JOIN pet_users … status='active'` (`alert.drizzle.repository.ts:68-75`).
No existe `?petId=` y pedirlo sería 400 por `strictObject`. Filtrar en cliente
por la mascota seleccionada rompería la paginación: una página de 50 puede
quedarse en 0 filas visibles con un `nextCursor` no nulo, y la pantalla se vería
vacía "pero con más". Por eso cada fila lleva su `petName` —que la API ya
devuelve, resuelto en el propio SELECT— y no hay `PetSwitcher` en esta pantalla.
Efecto lateral deseado: la campana de Home tampoco depende de la mascota
seleccionada, que es lo que el criterio de aceptación 1 describe.

### D5 — El tipo de alerta se resuelve por un mapa de módulo, con respaldo

**Sirve a**: R6.

```ts
const ALERT_TYPE_META = {
  geofence_exit: { Icon: LocationSlash, labelKey: 'alerts.typeGeofenceExit',
                   surface: 'bg-danger-soft',  ink: 'danger' },
  battery_low:   { Icon: BatteryLow,    labelKey: 'alerts.typeBatteryLow',
                   surface: 'bg-warning-soft', ink: 'warning-strong' },
} as const;

const UNKNOWN_ALERT_META = { Icon: Bell, labelKey: 'alerts.typeUnknown',
                             surface: 'bg-default', ink: 'muted' } as const;
```

Dos motivos para el respaldo: `Alert.type` se tipa como `string` porque el CHECK
del backend está declarado ampliable (`alerts.schema.ts:15-21`), y la carta
§Dirección de arte 4 prohíbe enseñar jerga técnica — pintar `geofence_exit`
crudo sería exactamente eso. La forma `labelKey:` no es estética: es la que
`checkUses` de `src/__tests__/ui-language.test.ts:50-53` sabe contar, igual que
`QUICK_ACTIONS` en Home.

### D6 — Severidad, no categoría

**Sirve a**: R6, R13.

La paleta pastel de la carta reparte **categorías** (tipos de recordatorio, tipos
de documento) y su tabla de seis huecos es cerrada; usarla para alertas obligaría
a enmendar la carta. Pero una alerta no es una categoría: es una severidad. El
repo ya tiene tokens para eso —`bg-danger-soft`/`danger` y
`bg-warning-soft`/`warning-strong`, usados en `screens/reminders/index.tsx:298,329`—
y leen bien: salir de la zona segura es peligro, la batería baja es aviso. Ventaja
mecánica: no se toca `src/utils/category-palette.ts`, así que el candado #64 R9
(que exige que `bg-category-*` solo se nombre allí) sigue en pie sin sumandos.

### D7 — `FlatList`, y por qué no un `ScrollView` como el resto de pantallas

**Sirve a**: R4, R9.

La carta §Decisiones fijas 5 lo fija: *"listas de datos de longitud desconocida:
FlatList/FlashList"*. El feed de alertas es paginado y sin techo, luego es
exactamente ese caso; y `onEndReached` es la pieza nativa que responde el
criterio "al llegar al final carga la siguiente página" sin escribir aritmética
de scroll. `FlatList` admite `contentContainerStyle`, así que las dimensiones de
`docs/conventions.md` §Dimensiones se cumplen igual, y `ListHeaderComponent` /
`ListEmptyComponent` cubren título y estados.

Sería la primera `FlatList` del repo (hoy no hay ninguna), así que la spec deja
escritos los dos detalles que muerden en jest: el evento se dispara con
`await fireEvent(screen.getByTestId('alerts-list'), 'onEndReached')` —forma que
este repo ya usa para props compuestas en `src/screens/add-pet/index.test.tsx:127`—
y solo se montan `initialNumToRender` (10) filas, por lo que las fixturas llevan
2 o 3 items.

### D8 — La campana se compone desde Home, el hero no se toca

**Sirve a**: R10.

`PetHeroHeader` declara por contrato que no conoce su slot
(`pet-hero-header.tsx:36-37`); el slot ya lo rellena Home con `PetSwitcher`.
Añadir una prop `onBellPress` al hero lo acoplaría a una pantalla y arrastraría a
Profile, que usa el mismo componente y no quiere campana. La composición es un
`View flex-row` dentro del slot con el switcher en `flex-1` (obligatorio: el
switcher es un `ScrollView` horizontal) y la campana a su derecha. Cero cambios
en componentes compartidos, cero riesgo para las cinco pantallas que los usan.

### D9 — Tiempo relativo: función de módulo, no fichero nuevo

**Sirve a**: R6.

`fmtOpenedAt(iso: string, now: Date, t): string` vive en
`src/screens/alerts/index.tsx` como función de módulo, igual que `dueCountdown`
en `src/screens/home/index.tsx:110-128`. Cuatro tramos: `<1 min` →
`alerts.justNow`; `<60 min` → `alerts.minutesAgo`; `<24 h` → `alerts.hoursAgo`;
resto → `alerts.daysAgo`.

Tres razones para no crear `src/screens/alerts/format.ts`: un fichero que llame a
`t()` entra en `ALL_USES` y suma **otro** sumando a `SCREEN_FILES`; `Intl.RelativeTimeFormat`
no está garantizado en el Hermes de este proyecto y la carta no autoriza una
dependencia para esto; y el `now` entra por parámetro, así que los tests fabrican
`openedAt` como `new Date(Date.now() - 5 * 60_000).toISOString()` y no necesitan
`jest.useFakeTimers()`.

### D10 — Cero cifras absolutas nuevas en esta spec

**Sirve a**: R3, R12, R13.

Tres veces ha parado el trabajo un recuento absoluto que envejeció. Aquí todo lo
que se mueve se mueve **como sumando**: `260 + 16 + 1 + 4 + 7` → `… + 14`;
`19 + 2` → `19 + 2 + 1`; `21 + 15 + 1 + 4 + 7` → `… + 2`. Y lo que se puede
cerrar por consistencia interna se cierra así, no con un número: la longitud de
`R12_ALERTS` la valida `checkUses` y la suma de bloques de `ALL_USES`, y el
criterio de `init.sh` es "exit 0", no un número de tests.

---

## Archivos afectados

### Nuevos

| Ruta (desde `mobile-pet-tracker/`) | Qué contiene | R |
|---|---|---|
| `src/api/alerts.ts` | `listAlerts`, `ackAlert`, `AlertsState`, `AckAlertState`. Sin JSX, sin estado, sin orden | R1, R2 |
| `src/api/__tests__/alerts.test.ts` | tabla de status → `kind`, URL y cabeceras exactas | R1, R2 |
| `src/screens/alerts/index.tsx` | `AlertsScreen`: `FlatList`, estados, filas, ack, paginación, `fmtOpenedAt`, `ALERT_TYPE_META` | R4, R6-R9 |
| `src/screens/alerts/index.test.tsx` | R4, R6, R7, R8, R9 | |
| `src/app/(tabs)/alerts.tsx` | ruta delgada, 5 líneas | R5 |
| `src/app/(tabs)/__tests__/alerts.test.tsx` | delega en la pantalla; no es pestaña | R5 |

### Modificados

| Ruta | Qué cambia | R |
|---|---|---|
| `src/api/types.ts` | `AlertType`, `AlertStatus`, `interface Alert` al final, junto a `Reminder` | R1 |
| `src/i18n/catalog.ts` | +14 claves en `en` y en `es` | R3 |
| `src/providers/__tests__/language-provider.test.tsx` | `+ 14` en la suma de la línea 41 y `describe` nuevo al final | R3 |
| `src/screens/home/index.tsx` | `useQuery` de alertas con `alertKeys.open()`, su `refetch` en el `useFocusEffect` existente, `home-hero-actions` con switcher + campana + punto. **Cero `signOut`, cero `queryKey` literal** (candados de #87 R19) | R10, R11 |
| `src/api/query-keys.ts` | `alertKeys` con `list()` y `open()` (enmienda E2) | R1, R9, R11 |
| `src/api/__tests__/query-keys.test.ts` | dos filas nuevas en el array `cases`, dominio `'alerts'` | R1 |
| `src/__tests__/design-drift.test.ts` | una fila en el mapa `screenSignOutCalls`: `'screens/alerts/index.tsx': 1` (enmienda E8) | R8, R13 |
| `src/screens/home/index.test.tsx` | `jest.mock('../../api/alerts')` y los `describe` de R10 y R11 | R10, R11 |
| `src/__tests__/ui-copy-table.ts` | `R12_ALERTS`, en `ALL_USES` y en el array `blocks` de su test interno; +2 filas en `R3_HOME` | R12 |
| `src/__tests__/ui-language.test.ts` | `19 + 2 + 1`, `21 + 15 + 1 + 4 + 7 + 2`, `describe` de #78 R12 | R12 |
| `../specs/mobile-ui-language/design.md` | 14 filas `← añadida por #78 (R3)` en §2 | R3, R12 |

### Explícitamente **no** modificados

`src/components/pet-hero-header.tsx`, `src/components/pet-switcher.tsx`,
`src/components/floating-tab-bar.tsx`, `src/app/(tabs)/_layout.tsx`,
`src/utils/category-palette.ts`, `src/providers/query-provider.tsx`,
`test/render-with-providers.tsx`, `src/theme/global.css`, `package.json` (**cero
dependencias nuevas**: `@tanstack/react-query` ya está instalada y fijada por
#87) y **todo** `backend-pet-tracker/`.

---

## Contrato del backend, tal como está hoy (referencia para la implementación)

Leído en la branch, no copiado del enunciado. Módulo
`backend-pet-tracker/src/modules/alerts/`, spec de origen
`specs/alerts-center-notifier/` (R16-R22).

```
GET /v1/alerts?status=open|acked|closed&cursor=<base64url>
  200 → { items: AlertResponse[], nextCursor: string | null }
  400 → cursor ilegible / de otro filtro (code INVALID_CURSOR),
        o cualquier parámetro desconocido (?limit= incluido): 'Validation failed'
  401 → sin JWT válido (AuthGuard global de #4)
  Página fija de 50 (ALERTS_PAGE_SIZE). Orden: opened_at DESC, id DESC.
  Solo alertas de mascotas con membresía activa Y dispositivo con suscripción
  vigente (INNER JOIN, no 402).

POST /v1/alerts/:id/ack
  200 → AlertResponse (open→acked; acked→acked idempotente)
  404 → id no-uuid, alerta inexistente o sin membresía (mismo camino, code ALERT_NOT_FOUND)
  409 → la alerta ya está closed (code ALERT_ALREADY_CLOSED)
  401 → sin JWT válido

AlertResponse = { id, petId, petName, type, status, geofenceId, payload,
                  openedAt, ackedAt, closedAt }   // exactamente estas 10 claves
```

---

## Alternativas descartadas

- **A1 — Contador en la campana.** Descartada: por encima de 50 abiertas mentiría
  sin avisar (D2), y hacerla honesta exige backend nuevo. Cuando exista
  `GET /v1/alerts/count`, se reabre.
- **A2 — Fusionar recordatorios y alertas en un solo centro.** Descartada: son dos
  fuentes con dos paginaciones, dos relojes y dos nociones de "leído"; el CHECK
  del backend garantiza que un recordatorio nunca llega por `/alerts`. La
  campana quedaría respondiendo dos preguntas distintas del brief con un solo
  punto.
- **A3 — `kind: 'no-tracking'` para el 402.** Descartada por D1: el endpoint no
  emite 402. Se documenta la condición exacta que la revive.
- **A4 — Filtrar el listado por la mascota seleccionada.** Descartada por D4:
  rompe la paginación por cursor y contradice la semántica del endpoint.
- **A5 — Chips de filtro `open|acked|closed` en la pantalla.** Descartada para la
  v1: cada filtro es su propio flujo de cursor (un cursor de otro filtro es 400)
  y triplica los estados. "Abiertas primero" resuelve el 90% con una línea.
- **A6 — Botón "Cargar más" en lugar de `onEndReached`.** Descartada: la carta
  manda `FlatList` para listas de longitud desconocida y el criterio de
  aceptación dice "al llegar al final", no "al pulsar".
- **A7 — Prop `onBellPress` en `PetHeroHeader`.** Descartada por D8: acoplaría un
  componente compartido a una pantalla y arrastraría a Profile.
- **A8 — Fila pulsable que navegue al mapa o a la geocerca.** Descartada: no hay
  pantalla de geocercas ni cliente de geocercas en la app, y el mapa no sabe
  centrar en una alerta pasada. Un destino inventado es peor que ninguno — el
  mismo argumento con el que #67 dejó fuera esta campana.
- **A9 — Reordenar la lista después de aplicar el ack.** Descartada por R7: la
  fila saltaría bajo el dedo justo al pulsarla.
- **A10 — Instalar `@tanstack/react-query` para resolver caché e invalidación.**
  Descartada **en su día y por el motivo correcto** —era un cambio de
  arquitectura transversal, no parte de esta feature— y **resuelta por la vía
  larga**: el humano abrió #87 para hacer esa migración entera y la mergeó el
  2026-09-11 (`cea72945`). Esta feature ya no instala nada: **consume** lo que
  #87 dejó. Ver E1-E6 de [[requirements]].
- **A11 — `invalidateQueries` tras el ack para apagar el punto rojo.**
  Descartada por E6: `staleTime: 0` + `refetchOnMount` y el `refetch` por foco de
  Home ya lo cubren sin una línea nueva, y adoptarla metería el primer
  `useQueryClient` de producción del repo para acoplar dos pantallas. La
  condición exacta que la revive está escrita en E6.
- **A12 — `useMutation` para el ack.** Descartada por E5: tras #87 el repo tiene
  cero `useMutation`; las mutaciones son llamadas planas más `refetch`. El ack no
  necesita reintentos ni estado global, y su efecto en pantalla es el overlay.
