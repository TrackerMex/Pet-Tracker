---
feature: "mobile-reminders-alerts-state-reset"
status: approved   # aprobada por humano en da957174 (gate de requirements.md)
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-reminders-alerts-state-reset]]

> Ver [[requirements]] para los requisitos que este diseño implementa,
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI móvil y
> [[../../docs/architecture|architecture]] para las capas.
>
> Todo lo que sigue se verificó **contra el árbol en `0e4aa810`**, no contra el
> enunciado ni contra la spec de #63. Las derivas están en
> [[requirements]] §Hechos del enunciado.

## Skills cargadas

`expo:expo-overview` → `expo:expo-router` (el disparador de todo es el foco de
navegación) y `docs/ui-guidelines.md` §Skills. Versión del SDK leída del árbol,
no de memoria: `expo` y `expo-router` en **57.0.14** (`package.json` declara
`~57.0.14` y `node_modules` resuelve `57.0.14` en los dos), así que la
documentación que aplica es `https://docs.expo.dev/versions/v57.0.0/` y nada de
`latest`. El
handoff a Codex debe pedirle las mismas (plugin `expo`, ya instalado).

---

## D1 — Mismo mecanismo que #63: reset en el cleanup de `useFocusEffect`

**Sirve a**: R1, R2, R4 (y da el sitio donde viven R3, R5, R6 por omisión).

El criterio de aceptación 5 de #97 pide o el mecanismo de #63 o una
justificación de por qué no. **Se usa el de #63**, sin variantes: el reset vive
en la función de limpieza que devuelve el callback de `useFocusEffect`. Los
cinco argumentos de #63 D1 valen aquí sin cambios (el Stack arrastra guard,
provider, `paddingBottom: insets.bottom + 96` y cabeceras; `unmountOnBlur` no
existe en `BottomTabNavigationOptions`; `freezeOnBlur` conserva el estado), y
además:

- **Es el único punto por el que pasan todas las salidas.** De `reminders` y
  `alerts` se sale por la barra flotante, por el botón atrás de Android y —desde
  `add-reminder`— por un `Redirect`. Limpiar en el submit o en el `onClose` del
  sheet arreglaría un camino y dejaría los otros.
- **Limpiar en el blur y no en el focus** deja la pantalla limpia *mientras*
  está fuera, así que no hay ni un fotograma con el valor viejo al volver. En R1
  eso importa: es la diferencia entre "el diálogo de borrado no está" y "el
  diálogo de borrado parpadea y se va".

### Un detalle que #63 no tenía: en `reminders` el hook **ya existe**

`RemindersScreen` ya monta un `useFocusEffect` (`:65-69`) cuyo callback llama a
`refetchReminders()`. El reset se añade **como cleanup de ese mismo hook**, no
como un segundo `useFocusEffect`. Dos razones, las dos verificadas:

1. Es el diff más corto: un `return () => {…}` dentro del callback que ya está.
2. **Un segundo hook rompería un test existente.** El `it` *"refetches when the
   screen recovers focus"* (`src/screens/reminders/index.test.tsx:374-388`) coge
   el callback con `mockUseFocusEffect.mock.calls.at(-1)?.[0]`; si el hook nuevo
   se registrara después, `.at(-1)` devolvería el del reset y el test dejaría de
   probar el refetch. Con un solo hook sigue habiendo una sola llamada.

Ese `it` tampoco se rompe por el `return`: hace `focusCallback?.();` como
sentencia y descarta el valor devuelto.

### Por qué las deps `[refetchReminders]` / `[refetchAlerts]` son seguras

Un cleanup que corre en cada re-suscripción cerraría el sheet de R1 sola. No
pasa: `refetch` se crea **una vez por observador** y el observador vive en un
`useState(() => new Observer(...))`
(`node_modules/@tanstack/react-query/build/modern/useBaseQuery.js:27`), y el
método va ligado en el constructor
(`node_modules/@tanstack/query-core/build/modern/queryObserver.js:33`,
`this.refetch = this.refetch.bind(this)`). Su identidad es estable mientras la
pantalla vive, así que el callback no cambia y el cleanup solo corre al perder
el foco.

---

## D2 — Inventario exhaustivo del estado de las dos pantallas

El enunciado avisa de que miró `useState` y un `useRef` y no descarta más. Se
auditó lo demás; **no hay más**.

| Pantalla | Mecanismo | Resultado |
|---|---|---|
| ambas | `useState` | 3 en `reminders` (`:61-63`), 3 en `alerts` (`:63,64,66`) |
| ambas | `useRef` | **1**, `ackingIdRef` en `alerts:65`. `reminders` no importa `useRef` |
| ambas | `useReducer` | **0** — ninguno de los dos ficheros lo importa |
| ambas | `createContext` local | **0** |
| `reminders` | hooks propios | `usePetSelection` (`src/hooks/use-pet-selection.ts`): un `useEffect` y ningún estado propio; `useSelectedPet`, `useAuth`, `useLocale`, `useTranslate` son lecturas de providers compartidos |
| `alerts` | hooks propios | `useThemeColors` (`src/theme/use-theme-colors.ts`): sin estado propio |
| ambas | componentes hijos | `Card` y `PetSwitcher` no declaran estado. El `BottomSheet` de `@expo/ui/community/*` es controlado: su apertura es `deleteCandidate`, no estado suyo |
| `alerts` | `FlatList` | Guarda scroll y ventana de render. **Sobrevive y debe sobrevivir** ([[requirements]] §Estado que SÍ debe sobrevivir, 3) |
| ambas | TanStack Query | Caché compartida; no es estado de pantalla |

Comando que lo cierra (y que el reviewer puede repetir):
`grep -n "useState\|useRef\|useReducer\|createContext" src/screens/reminders/index.tsx src/screens/alerts/index.tsx`.

---

## D3 — `acked`: por qué **no** se resetea y qué lo mantiene honesto

**Sirve a**: R6, R8. Es la decisión central de esta spec y la que la separa de
#63.

### Por qué el D1 de #63 no se copia tal cual

En #63 las siete piezas reseteadas eran basura de formulario: valores que el
usuario había tecleado y abandonado, sin promesa de borrador y sin affordance de
recuperación. Aquí `acked` es otra cosa: es **la única representación en la app
del hecho de que el ack ya ocurrió**. El ack no escribe en la caché (#78 E5
prohíbe `setQueryData` con motivo) y la lista no se recarga (#78 R8: *"sin
volver a llamar a `listAlerts`"*). Vaciar `acked` en el blur, por tanto, **borra
información que no está en ningún otro sitio**: al volver, la alerta se pinta
otra vez "abierta", con su botón de Atender, hasta que una respuesta de red
diga lo contrario. Eso no es limpiar un formulario, es deshacer lo que el
usuario acaba de hacer.

### Por qué tampoco vale dejarlo como está

El overlay gana **siempre** hoy (`acked[a.id] ?? a`). Y el ciclo de vida del
backend permite que una alerta ya `acked` pase a `closed`: el motor cierra
filtrando `status IN ('open','acked')`
(`backend-pet-tracker/src/workers/alerts-engine/alerts-engine.drizzle.store.ts:99-102`,
#13 R23/D1). Con el overlay eterno, esa alerta se seguiría pintando "Atendida"
en vez de "Cerrada" durante toda la vida del proceso. Es la desincronización
indefinida que el criterio 4 obliga a cerrar.

### La vía elegida: el overlay caduca solo, sin tocar la caché

R8 acota **cuándo se consulta** el overlay en vez de **cuándo se borra**. La
regla observable: el overlay solo se aplica mientras la alerta descargada siga
siendo `open`. En la composición de #78 D3 eso es una condición en la tercera
línea, dejando las dos primeras intactas:

```
const fetched = …;                                              // sin cambios
const ordered = [...open, ...noOpen];                           // sin cambios (#78 R7)
// R8: el overlay solo cubre lo que la API sigue dando por abierto
const rows = ordered.map((alert) =>
  alert.status === 'open' ? acked[alert.id] ?? alert : alert,
);
```

Qué pasa en cada caso, uno por uno:

| Situación | Antes | Con R8 |
|---|---|---|
| Ack `ok`, sin refetch todavía | fila "Atendida" | **igual** (la descargada sigue `open`) |
| Ack `already-closed`, sin refetch | fila "Cerrada" | **igual** |
| Refetch que trae la alerta `acked` | fila "Atendida" (por el overlay) | **igual**, pero pintada con el dato del servidor, que trae `ackedAt` real |
| Refetch que trae la alerta `closed` | fila "Atendida" — **mentira indefinida** | fila "Cerrada" |
| Alerta que el ack nunca tocó | dato descargado | igual |

Y no puede resucitar nada: el backend solo va `open → acked → closed`
(`ack-alert.use-case.ts:24-25`) y nunca vuelve a `open`, así que una entrada
vieja del overlay o coincide con el servidor o ya no se mira. El `Record` sigue
creciendo mientras la pantalla vive; son objetos pequeños y una sola sesión, y
podarlo costaría más código que el que ahorra — si alguna vez molestara, se poda
en el mismo sitio donde R8 decide.

### Alternativa que se descarta aquí y no en §Alternativas, por ser la trampa obvia

**Borrar `acked` y refrescar la lista tras el ack** (lo que hace `reminders` con
el borrado, `:88`) suena a "la respuesta correcta es que `acked` no exista". No
lo es: revierte por completo dos requisitos aprobados de #78 —R8, cuyo test
asierta `expect(mockListAlerts).toHaveBeenCalledTimes(1)` después del ack, y R7,
cuya partición se congela precisamente para que la fila **no salte de grupo bajo
el dedo**—, empeora la sensación de la pantalla (la fila se queda "abierta"
durante un GET entero) y abre la ventana para un segundo ack sobre una alerta ya
atendida. Revertir spec ajena pide su propio gate; no se hace de paso.

---

## D4 — `alerts` gana el `refetch` por foco

**Sirve a**: R7, y hace alcanzable el candado de R8.

`AlertsScreen` es hoy la única pantalla de lista del grupo `(tabs)` sin
`useFocusEffect`: `reminders:65`, `home` y `pairing` ya refrescan al ganar el
foco. Y es la pantalla cuyos datos los produce un **worker**, no el usuario: es
la que más probable es que haya cambiado mientras el usuario estaba en otra
pestaña.

Sin este refetch, dentro de una sesión la lista no se vuelve a descargar nunca
(`refetchOnWindowFocus: false`, `refetchOnReconnect: false`,
`src/providers/query-provider.tsx:28-36`; la pantalla nunca se desmonta, así que
`refetchOnMount` no llega a dispararse; el único `refetch` es `alerts-retry`, que
solo existe en la rama de error). Es decir: **el candado de R8 no lo alcanzaría
ningún camino de la app** y el criterio 4 quedaría contestado solo sobre el
papel.

Tres consecuencias declaradas, para que nadie las lea como defecto:

1. **No contradice #78 R8.** R8 prohíbe que **el ack** recargue la lista; R7
   recarga al **entrar**. Los `it` de #78 que cuentan llamadas a `listAlerts`
   siguen en verde porque `useFocusEffect` estará mockeado como `jest.fn()` y
   ninguno de ellos ejecuta el callback de foco. El implementador debe
   comprobarlo, no suponerlo.
2. **Reagrupa.** Al volver, una alerta atendida antes ya no sale en el grupo de
   abiertas. Es #78 R7 funcionando: la partición es sobre el `status`
   descargado, y ahora hay uno nuevo.
3. **Cuesta una petición por página cargada.** El refetch de una infinite query
   recorre las páginas ya cargadas
   (`node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.js:51-58`);
   con una sola página, una petición. No hay parpadeo de Skeleton: `isPending`
   solo es cierto sin datos.

---

## D5 — Mecánica, fichero por fichero

Dos ficheros de producción y ninguno más.

**`src/screens/reminders/index.tsx`** — se añade un cleanup al
`useFocusEffect` que ya existe (`:65-69`). El callback sigue llamando a
`refetchReminders()`; el cleanup pone `deleteCandidate` y `actionError` a
`null`. **`deletingId` no se toca** (R3). No hay imports nuevos: `useCallback`,
`useState` y `useFocusEffect` ya están.

**`src/screens/alerts/index.tsx`** — se añade:

- `const refetchAlerts = alerts.refetch;` justo después del `useInfiniteQuery`
  (mismo patrón que `reminders:60`).
- un `useFocusEffect(useCallback(() => { void refetchAlerts(); return () =>
  setActionError(null); }, [refetchAlerts]))` (R4, R7). **`ackingId`,
  `ackingIdRef` y `acked` no aparecen en ese bloque** (R5, R6).
- la condición de R8 en la línea de `rows` (`:85`).
- imports: `useCallback` de `react` (el fichero importa hoy `useRef` y
  `useState`) y `useFocusEffect` de `expo-router` (import nuevo en este
  fichero).

Colocación: el `useFocusEffect` va **después** de la declaración de `alerts`,
porque necesita `alerts.refetch`. `void` delante del `refetch` porque devuelve
una promesa y el callback de `useFocusEffect` debe devolver el cleanup o nada.

---

## D6 — Cómo se observa "perder el foco" en los tests

Ninguna suite móvil monta un `NavigationContainer`; el patrón vigente del repo
es mockear `useFocusEffect` como `jest.fn()` y ejecutar el callback a mano
(`reminders/index.test.tsx:64-67,81,374-388`, `home`, `profile`, `pairing`).

**Intención del helper** (no se copia de ninguna suite: los dos ficheros parten
de mocks distintos y uno de ellos ni siquiera mockea `expo-router` — ver la
tabla de abajo):

- Recorrer **todas** las llamadas de `mockUseFocusEffect.mock.calls`, ejecutar
  cada callback, guardar los cleanups que devuelvan y ejecutarlos. Recorrerlas
  todas, y no `calls[0]`, hace el helper inmune al orden y al número de hooks.
- Separar **ganar foco** (ejecutar callbacks) de **perder foco** (ejecutar
  cleanups): R7 necesita lo primero, R1/R2/R4 lo segundo, y R6 necesita los dos
  seguidos.
- Envolver en `act(...)` y afirmar después con `await waitFor(...)`: el callback
  de foco dispara un `refetch` en las dos pantallas, y el `waitFor` es lo que
  evita un warning de act por su resolución.
- **Debe tolerar cero llamadas y cleanups `undefined`.** Es lo que hace legítimo
  el rojo de C4: en el commit rojo la producción todavía no registra el hook (o
  no devuelve cleanup), `mock.calls` está vacío, el helper no hace nada y el test
  falla **por su aserción** —"se esperaba `null`, se recibió el sheet"—, no por
  un `TypeError`. Un rojo por excepción no demuestra que el candado esté vivo
  (C4, cuarto punto).

### Qué hay que añadir a cada fichero de test

| Fichero de test | Mock de `expo-router` hoy | Qué añadir |
|---|---|---|
| `src/screens/reminders/index.test.tsx` | **ya trae** `{ router, useFocusEffect: jest.fn(), useIsFocused }` (`:64-67`), ya declara `mockUseFocusEffect` (`:81`) y ya importa `act` | **nada en el mock**; solo el helper y los `describe` nuevos |
| `src/screens/alerts/index.test.tsx` | **ninguno**: `AlertsScreen` no importa hoy nada de `expo-router` | `jest.mock('expo-router', () => ({ useFocusEffect: jest.fn() }))` —y **solo** eso: la pantalla no usa `router`, `Redirect` ni `useIsFocused`, así que copiar el mock de `reminders` metería tres símbolos muertos—, importar `useFocusEffect` y declarar `mockUseFocusEffect`. `act` ya está importado |

Ningún otro módulo del árbol de render de `alerts` importa `expo-router`
(comprobado sobre `card.tsx`, `language-provider.tsx`, `auth-provider.tsx`,
`use-theme-colors.ts`, `render-with-providers.tsx` y `api/alerts.ts`), así que
mockear el módulo entero no deja a nadie sin su import.

### Cómo se afirma cada cosa, por lo que el usuario ve

- `deleteCandidate` → `screen.queryByTestId('community-bottom-sheet')` es `null`
  (el doble del sheet devuelve `null` cuando `index < 0`,
  `reminders/index.test.tsx:46-60`), y `queryByTestId('reminders-delete-sheet')`
  también.
- `actionError` (las dos pantallas) → `queryByTestId('reminders-action-error')` /
  `queryByTestId('alerts-action-error')` son `null`.
- `deletingId` / `ackingId` → `accessibilityState.disabled` del botón
  correspondiente, patrón ya usado en *"disables only the row being deleted…"* y
  en *"deshabilita durante el vuelo y corta dos pulsaciones seguidas"*.
- `acked` → `alert-row-alert-1-status` con `es['alerts.statusAcked']` y
  `queryByTestId('alert-row-alert-1-ack')` a `null`.
- R7 → `expect(mockListAlerts).toHaveBeenCalledTimes(2)` tras ejecutar el
  callback de foco con una sola página cargada.
- R8 → `alert-row-alert-1-status` con `es['alerts.statusClosed']`.

---

## D7 — El ref, y su zona ciega declarada

**Sirve a**: R5. El enunciado avisa de que es fácil inventariar solo los
`useState`; aquí está tratado aparte.

`ackingIdRef` (`alerts:65`) es la mitad síncrona de un guarda de dos piezas:

- `ackingIdRef.current !== null` corta la **reentrada inmediata** de `handleAck`
  (`:100`), en la ventana entre la primera pulsación y el re-render. Ese es el
  hueco que el `isDisabled={ackingId !== null}` (`:248`) todavía no cubre, y es
  justo lo que prueba el `it` de #78 *"deshabilita durante el vuelo y corta dos
  pulsaciones seguidas"*.
- `ackingId` cierra el botón de **todas** las filas mientras vuela un ack.

Las dos se apagan en el mismo `finally` (`:137-138`) y las dos **sobreviven** al
blur, por el mismo motivo que `deletingId`: un componente que no se desmonta no
reinicia sus refs, y aquí eso es lo correcto — resetear el ref mientras la
petición vuela abriría la puerta a un segundo POST sobre el mismo ack.

**Zona ciega, declarada y cerrada** (memoria del repo: la mutación se planta
donde el candado podría no mirar): mutar **solo** el ref no pone roja ninguna
aserción de comportamiento, porque mientras `ackingId` siga puesto el botón
está deshabilitado y RNTL no dispara `press` sobre un elemento deshabilitado —
no existe camino de usuario que llegue a `handleAck` con el ref abierto y el
estado puesto. Por eso R5 se cierra con **dos** `it`: el de comportamiento
(cubre `ackingId`) y uno que lee el fuente de `AlertsScreen`, extrae el bloque
que va desde `useFocusEffect(` hasta la declaración de `handleAck` y afirma que
ahí no aparecen ni `AckingId` ni `ackingIdRef`. Leer el fuente no es exótico en
este repo: `src/app/(tabs)/__tests__/alerts.test.tsx:36-55` ya lo hace con
`floating-tab-bar.tsx` y `_layout.tsx`.

---

## Archivos afectados

Capa: **infrastructure / UI móvil**. Ninguna capa `domain` ni `application` del
backend se toca; `docs/architecture.md` no tiene nada que decir más allá de que
esto vive entero en la app Expo.

**Producción (2 ficheros, en `mobile-pet-tracker/`):**

- `src/screens/reminders/index.tsx` — cleanup en el `useFocusEffect` existente
  (R1, R2); `deletingId` intacto (R3).
- `src/screens/alerts/index.tsx` — `refetchAlerts`, `useFocusEffect` nuevo con
  su cleanup (R4, R7), condición del overlay en `rows` (R8); `ackingId`,
  `ackingIdRef` y `acked` intactos (R5, R6).

**Tests (2 ficheros):** `src/screens/reminders/index.test.tsx` y
`src/screens/alerts/index.test.tsx`.

**Documentación (1 fichero, fuera de `mobile-pet-tracker/`):**
`specs/mobile-alerts-center/requirements.md` — bloque §E9 que registra la
enmienda de R8, con su casilla de aprobación sin marcar.

**No se toca**: `src/app/(tabs)/_layout.tsx`, `src/app/(tabs)/reminders.tsx`,
`src/app/(tabs)/alerts.tsx`, `src/components/`, `src/theme/`, `src/i18n/`,
`src/api/`, `src/providers/`, ni ningún fichero de `src/__tests__/`.

---

## Alternativas descartadas

- **Resetear `acked` en el blur, como #63 hace con todo lo demás** — regresión
  visible en cada vuelta a la pantalla: la alerta atendida reaparece sin atender
  hasta que llegue una respuesta de red. Es el caso que el criterio 5 de #63
  obligaba a nombrar.
- **Resetear `acked` en el blur y refrescar al ganar el foco** — el mismo
  parpadeo, solo que más corto: al volver se pinta primero la caché vieja
  (`open`) y después la respuesta. Peor que no hacer nada.
- **Limpiar `acked` cuando resuelva el refetch (`refetch().then(…)`)** —
  equivalente a R8 cuando la red va bien, y roto cuando falla: dejaría caer el
  overlay aunque la lista siga trayendo la alerta como `open`.
- **Borrar `acked` y recargar la lista tras el ack** — revierte #78 R7 y R8.
  Ver D3.
- **`setQueryData` / `invalidateQueries` / `useMutation` sobre `alertKeys.list()`**
  — prohibidos por #78 E5 y E6 con motivo escrito (mover la fila de grupo bajo el
  dedo; acoplar dos pantallas). Esta spec no los revive.
- **Resetear `deletingId`, `ackingId` o `ackingIdRef`** — abre un segundo DELETE
  o un segundo POST sobre una petición viva; #63 R7 ya lo prohibió para la misma
  clase de guardas. Ver [[requirements]] §Divergencia del enunciado.
- **Un segundo `useFocusEffect` en `reminders` solo para el reset** — rompe el
  `it` que coge el callback con `.at(-1)`. Ver D1.
- **Un hook `useResetOnBlur` compartido** — una sola forma de uso sobre un
  one-liner, en dos pantallas más las cinco de #63 que ya lo escriben a mano.
  Mismo argumento de #63 D1.
- **Sacar las dos pantallas a un Stack** — la vía de fondo, ya pospuesta por #63
  D1 y anotada como deuda `mobile-detail-screens-to-stack`.

---

## Si #72 entra antes que esta feature

`mobile-add-pet-photo-test-flake` (#72) arregla, entre otros, el `it` *"pinta y
reintenta cada error de la primera página"* de `#78 R4` en
`src/screens/alerts/index.test.tsx` — hoy un `waitFor` sobre
`queryClient.getQueryData(alertKeys.list())` seguido de un `getByTestId`
síncrono. Qué habría que reapuntar de esta spec:

| Parte de esta spec | Si #72 entra antes |
|---|---|
| R1-R8 y todas las decisiones | **nada**: no dependen de ese `it` ni de su forma |
| Referencias a `alerts/index.test.tsx` | **nada que reapuntar**: esta spec lo referencia por título de `describe`, nunca por número de línea, precisamente por esto |
| El `jest.mock('expo-router', …)` que D6 manda añadir | comprobar que #72 no lo añadió ya; si lo hizo, no duplicarlo |
| §Reglas para los tests nuevos de `alerts` | siguen vigentes: son sobre los `it` **nuevos**, que #72 no escribe |
| Baseline `0e4aa810` | se reapunta al merge de #72 y se vuelve a medir el delta desde ahí |

Y al revés, si #97 entra antes: esta feature **no toca** ese `it`, así que #72 lo
encuentra igual que hoy. Lo único que cambia para #72 es que el fichero tendrá
un `jest.mock('expo-router', …)` en la cabecera y tres `describe` más.
