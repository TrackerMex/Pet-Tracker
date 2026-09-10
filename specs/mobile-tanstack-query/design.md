---
feature: "mobile-tanstack-query"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-tanstack-query]]

> Decisiones técnicas de alto nivel. Los requisitos verificables están en
> [[requirements]]; el orden de trabajo en [[tasks]].
> Rutas relativas a `mobile-pet-tracker/` salvo indicación expresa.

---

## 1. El problema, en una frase

Diez pantallas orquestan su fetching con un hook de 50 líneas que guarda el estado
en el `useState` de cada instancia. Eso significa: siete copias independientes de
la lista de mascotas, ninguna deduplicación, ninguna invalidación cruzada, y una
pantalla nueva con paginación por cursor (#78) que tendría que inventarse a mano
la acumulación de páginas. Se cambia el **orquestador**, no la capa de red.

## 2. Qué se añade al árbol

| Fichero | Qué contiene | Requisito |
|---|---|---|
| `src/providers/query-provider.tsx` | `createQueryClient()` + `<QueryProvider>` + el interceptor de `unauthorized` + el vaciado al cerrar sesión | R2, R4, R5, R6 |
| `src/api/query-keys.ts` | las diez factorías de claves; único sitio con literales de query key | R7 |
| `test/render-with-providers.tsx` | helper de render que monta `QueryClientProvider` y devuelve su `queryClient` | R3 |
| `src/providers/__tests__/query-provider.test.tsx` | tests de R2, R5, R6 | — |
| `src/api/__tests__/query-keys.test.ts` | tests de R7 | — |
| `test/__tests__/render-with-providers.test.tsx` | tests de R3 | — |

Y se **borran** `src/hooks/use-api.ts` y `src/hooks/__tests__/use-api.test.tsx`
(R19, C7).

Ningún fichero de `src/api/`, `src/components/`, `src/theme/` ni `src/i18n/` cambia.

## 3. Por qué el `signOut` de lectura va en `QueryCache.onSuccess`

Tres candidatos, y el criterio es el criterio 4 de la feature: *un solo sitio, no
repetido por pantalla*.

| Candidato | Por qué no / por qué sí |
|---|---|
| Un hook envoltorio `useApiQuery(key, fn)` que hiciera el `signOut` en un `useEffect` | Un sitio en el código, pero **N ejecuciones**: Home tiene cuatro queries y llamaría cuatro veces. Además sería una abstracción con una sola implementación que a #78 no le sirve (`useInfiniteQuery` no pasa por ahí) |
| Un `useEffect` suelto en `_layout.tsx` suscrito a `queryClient.getQueryCache().subscribe(...)` | Funciona, pero duplica el estado de suscripción y hay que desuscribir a mano. Es la versión artesanal de lo que la librería ya ofrece |
| **`new QueryCache({ onSuccess })` pasado al `QueryClient`** ✅ | Es el punto que la librería expone justo para esto: una callback global que corre **una vez por resolución de query**, sea cual sea la pantalla. Se escribe una vez, dentro de `createQueryClient`, y ninguna pantalla sabe que existe |

Nota importante sobre "exactamente una vez": hoy `use-api.ts` también dispara
`signOut` **una vez por hook que reciba un `unauthorized`** — Home con cuatro
queries expiradas llama cuatro veces. `QueryCache.onSuccess` reproduce eso mismo
(una por resolución) y **no** lo empeora. "Una vez" significa *un `signOut` por
resultado `unauthorized`, desde un único punto del código*, que es como está
redactado R5 y como lo mide su test.

Se usa `onSuccess` y **no** `onError` porque, por **D1** de [[requirements]] §0.2,
el `unauthorized` llega como valor resuelto, nunca como rechazo.

## 4. De golpe o pantalla a pantalla — decisión y mecanismo

**Decisión: pantalla a pantalla, en una sola branch y un solo PR, con las dos vías
conviviendo durante diez commits rojo→verde.**

Motivos, en orden de peso:

1. **C4 lo exige.** "El historial de commits de la feature muestra el patrón
   test-primero, no todo en un commit". Diez pantallas en un commit es exactamente
   lo que se le reprochó a #19. Pantalla a pantalla da diez rojos legítimos.
2. **Es bisectable.** Si el smoke del humano encuentra que el mapa parpadea, hay
   un commit que solo toca el mapa.
3. **El riesgo es asimétrico.** `docs` tiene 2 queries y 160 líneas de test; `map`
   tiene 4 queries, un intervalo de 15 s y el fichero de test más delicado. Migrar
   en orden de dificultad creciente significa que los problemas de infraestructura
   (helper, claves, `enabled`) salen en la pantalla barata.

**Qué pasa mientras conviven.** Nada, y esto es lo que hay que verificar antes de
empezar, porque es la única pieza que las une:

- `useApi` y `useQuery` no comparten estado. Una pantalla en el mundo viejo y otra
  en el nuevo no se ven.
- El **único** punto de contacto es `usePetSelection`, que siete pantallas
  comparten y que hoy tipa su parámetro como `ApiResult<PetsState>`
  (**D3**, [[requirements]] §0.4).
- Por eso **R8 va antes que las diez pantallas**: cambia ese parámetro al tipo
  estructural mínimo `{ data: PetsState | undefined; isRefreshing: boolean }`.
  A partir de ahí:
  - una pantalla **sin migrar** pasa su variable `pets: ApiResult<PetsState>` y
    **compila**, porque TypeScript solo aplica la comprobación de propiedades
    sobrantes a literales recién escritos, no a variables (el `refetch` de más no
    molesta);
  - una pantalla **migrada** pasa el literal
    `{ data: pets.data, isRefreshing: pets.isRefetching }`, que encaja exacto.
- El `QueryProvider` (R4) puede montarse en el commit 4 aunque nadie use `useQuery`
  todavía: un proveedor sin consumidores no hace nada.

Alternativa descartada: cambiar `usePetSelection` al final y hacer que cada
pantalla migrada construya un adaptador `{data, isRefreshing: q.isRefetching,
refetch: q.refetch}`. Es lo mismo con una línea más por pantalla y un objeto
temporal que luego hay que quitar de diez sitios.

## 5. Los tres deltas de conducta, razonados

La tabla vive en [[requirements]] §Deltas. Aquí el porqué de aceptarlos en vez de
neutralizarlos.

**D-1, el esqueleto que ya no parpadea.** Con `gcTime: 5 min`, una pantalla de pila
(`weight-log`, `meal-schedule`, `docs`) que se cierra y se reabre encuentra su dato
en la caché y lo pinta de inmediato, refrescando por detrás, en vez de mostrar el
esqueleto. Neutralizarlo exigiría `gcTime: 0`, que **desactiva la caché entera** y
deja la feature sin propósito. Es una mejora perceptible, pero es un cambio, así
que se declara y lo firma el humano. Las pantallas de **pestaña** no lo notan:
React Navigation las mantiene montadas, así que hoy tampoco vuelven a mostrar el
esqueleto.

**D-2, la deduplicación.** Siete pantallas piden `listPets`. Con varias pestañas
montadas eso son hoy hasta siete peticiones idénticas simultáneas; con una clave
común, una. Esto **no depende de `staleTime`** — la deduplicación de peticiones en
vuelo es independiente de la frescura —, y por eso `staleTime: 0` da la ganancia
sin tocar la política de refresco (R2).

**D-3, la propagación.** Cuando Perfil recupera el foco y refresca
`['pets','list']`, Home —montada en otra pestaña— ve el dato nuevo. Hoy no. Es
exactamente la "estado compartido entre dos pantallas" que la entrada de #87 cita
como motivo de la feature y que #78 necesita para su punto rojo.

Los tres cambian **cuándo** ocurre un estado, nunca **qué** se pinta en él. Por eso
ningún test existente se cae: todos aserta sobre "dado este `kind`, esto se ve".

**Por qué `structuralSharing` se deja en su valor por defecto (`true`).** Con
`structuralSharing`, un refetch que devuelve datos idénticos conserva la misma
referencia de objeto, así que el `useEffect` de `usePetSelection` —cuyas
dependencias incluyen `pets.data`— no se re-ejecuta. Se revisó qué hace ese efecto
si se re-ejecuta con datos idénticos: nada — la selección ya existe en la lista y
el hook sale sin llamar a `selectPet` (`use-pet-selection.ts:17-20`). Luego no hay
diferencia observable y no hay motivo para desactivarlo.

## 6. Qué se hace con los candados que la migración toca

Todo lo de esta sección está expresado como **delta contra `main` @ `5666b85`**.
Ningún recuento absoluto — es la regla que ya paró el trabajo tres veces en este
repo.

### 6.1 Los seis contratos de `use-api.test.tsx`, re-alojados

El fichero se borra (R19). Sus seis `it` no se pierden:

| `it` de `use-api.test.tsx` | Contrato | Dónde vive después |
|---|---|---|
| `:34` "exposes undefined while loading…" | dato `undefined` mientras carga | Lo garantiza la librería y lo candan **las diez** aserciones de esqueleto/loading citadas una por una en R9–R18 |
| `:47` "keeps the previous data and flags refreshing during refetch" | stale-while-revalidate | **R20**: los tres `it` reescritos dependen literalmente de que `isRefetching` sea `true` con el dato viejo aún montado |
| `:68` "clears previous data while a new fn identity is loading" | cambiar de recurso **no** enseña el dato del anterior | La clave cambia con `petId`, y R2 lo blinda prohibiendo `placeholderData: keepPreviousData`, con un `it` que afirma que es `undefined` |
| `:92` "discards an old response when fn changes identity" | carrera entre recurso viejo y nuevo | Idem: en React Query cada clave tiene su propia entrada de caché, así que la respuesta vieja no puede aterrizar en la nueva. Cubierto por el mismo `it` de R2 |
| `:112` "does not execute while fn is null" | `fn === null` ⇒ no se pide | Los `enabled` de R12–R18, candados por las aserciones de "el plan no arranca antes de haber mascota" (`food.test.tsx:284`) |
| `:119` "signs out after an unauthorized result" | `unauthorized` ⇒ `signOut` | **R5** (a), literalmente el mismo `toHaveBeenCalledTimes(1)` |

Delta: **−6 `it` en `src/hooks/__tests__/use-api.test.tsx`** (el fichero entero) y
**+ al menos 7 `it`** repartidos entre `query-provider.test.tsx` (R2, R5, R6) y
`query-keys.test.ts` (R7), más las reescrituras de R20. Ningún contrato queda sin
dueño.

### 6.2 `weekly-activity-chart.test.tsx:505` se conserva

`expect(source).not.toContain('use-api')` afirma que el componente de gráfica no
conoce la red. Tras el borrado la aserción es trivialmente cierta para siempre.
Se conserva por dos razones: quitarla sería relajar una aserción existente, y el
`describe` que la contiene (`:497-509`) es una lista de cinco negativas
(`api/activity`, `use-api`, `fetch(`, `expo-router`) cuyo valor está en el
conjunto, no en cada línea. **No se re-apunta a `@tanstack/react-query`**: la
gráfica no debe importar *ninguna* librería de datos y la línea que lo dice de
verdad es `expect(source).not.toContain('fetch(')`; añadir una negativa nueva sería
alcance que nadie pidió. Delta: **0 líneas** en ese fichero.

### 6.3 Los `signOut` de mutación: recuento por fichero, como delta

R5 (d) barre los diez ficheros migrados buscando `signOut` en el camino de lectura.
Para que ese barrido no dé falsos positivos con las mutaciones, éste es el
inventario contra `5666b85`, y el delta esperado es **0 en todos**:

| Fichero migrado | `signOut` de mutación en `5666b85` | Delta esperado |
|---|---|---|
| `app/(tabs)/meal-schedule.tsx` | 1 (`:100`) | 0 |
| `app/(tabs)/weight-log.tsx` | 1 (`:107`) | 0 |
| `screens/pairing/index.tsx` | 2 (`:150`, `:198`) | 0 |
| `screens/profile/index.tsx` | 2 (`:159` mutación, `:387` botón) | 0 |
| `screens/reminders/index.tsx` | 1 (`:100`) | 0 |
| `app/(tabs)/food.tsx`, `health.tsx`, `map.tsx`, `screens/docs/index.tsx`, `screens/home/index.tsx` | 0 | 0 |

Los `signOut` de `screens/add-pet/index.tsx` (2) y `screens/add-reminder/index.tsx`
(1) están fuera de los diez y **no se tocan**.

### 6.4 Candados numéricos del repo: delta esperado **cero en todos**

Verificado uno por uno en [[requirements]] §0.6. La migración no toca ni un
`className`, ni un `style`, ni una clave de copy, ni un `TextInput`.

| Candado | Cifra en `5666b85` | Delta esperado |
|---|---|---|
| `providers/__tests__/language-provider.test.tsx:41` (longitud del catálogo) | `260 + 16 + 1 + 4 + 7` | **0** |
| `__tests__/consistency-classnames.test.ts:102,215,231,232,306,327,360,447` | varias | **0** |
| `__tests__/legibility-classnames.test.ts:132` | por fichero | **0** |
| `__tests__/design-drift.test.ts:135-146` (dependencias) | lista blanca por nombre, no recuento | **0** (se le **añade** un `describe` nuevo por R1 y R19, que no toca los `it` existentes) |
| `screens/home/weekly-activity-chart.test.tsx:434-444` (`transformIgnorePatterns`) | `toContain`, no recuento | **0** |
| `app/(tabs)/__tests__/map.test.tsx:731-733` (sondeo) | ya escrito como delta `initialX + 1` | **0** |

Si al implementar alguno de estos se moviera, es señal de que la migración se salió
de su carril: **parar** y anotarlo, no ajustar la cifra.

## 7. Fichero por fichero: qué cambia en cada uno de los diez

Resumen de mando. El detalle por query está en R9–R18.

| Orden | Fichero | Símbolo | Queries | `enabled` | `useFocusEffect` | Su test |
|---|---|---|---|---|---|---|
| 1 | `screens/docs/index.tsx` | `DocsScreen` | 2 | — | — | `screens/docs/index.test.tsx` |
| 2 | `app/(tabs)/weight-log.tsx` | `WeightLogContent` | 1 | — | — | `app/(tabs)/__tests__/weight-log.test.tsx` |
| 3 | `app/(tabs)/meal-schedule.tsx` | `MealScheduleContent` | 2 | — | — | `app/(tabs)/__tests__/meal-schedule.test.tsx` |
| 4 | `app/(tabs)/food.tsx` | `FoodScreen` | 2 | 1 | — | `app/(tabs)/__tests__/food.test.tsx` |
| 5 | `app/(tabs)/health.tsx` | `HealthScreen` | 3 | 2 | — | `app/(tabs)/__tests__/health.test.tsx` |
| 6 | `screens/reminders/index.tsx` | `RemindersScreen` | 2 | 1 | 1 | `screens/reminders/index.test.tsx` |
| 7 | `screens/pairing/index.tsx` | `PairingScreen` | 2 | 1 (triple condición) | **2** | `screens/pairing/index.test.tsx` |
| 8 | `screens/profile/index.tsx` | `ProfileScreen` | 3 | 1 | 1 | `screens/profile/index.test.tsx`, `app/(tabs)/__tests__/profile.test.tsx`, `app/(tabs)/__tests__/screens.test.tsx` |
| 9 | `screens/home/index.tsx` | `HomeScreen` | 4 | 3 | 1 | `screens/home/index.test.tsx` |
| 10 | `app/(tabs)/map.tsx` | `MapScreen` | 4 | 3 | 1 + `setInterval` 15 s | `app/(tabs)/__tests__/map.test.tsx` |

Total: **25 llamadas a `useApi`** en `5666b85` → **25 `useQuery`**. Delta neto de
llamadas a la API por pantalla: **0**.

**Ficheros de test que deben pasar a `renderWithProviders`** (lista verificada en
`5666b85`, no candado): los diez de la columna derecha más
`app/(tabs)/__tests__/screens.test.tsx` y `app/(tabs)/__tests__/profile.test.tsx`.
Si al correr la suite algún otro fichero lanzase
`No QueryClient set, use QueryClientProvider to set one`, se envuelve igual y se
anota — la lista es la verificada hoy, no un recuento que haya que defender.

## 8. Alternativas descartadas

**A1 — mover las cinco rutas gordas de `(tabs)/` a `src/screens/` dentro de esta
feature.** Descartada. Es cierto que `food.tsx` (323 líneas), `health.tsx` (279),
`map.tsx` (391), `meal-schedule.tsx` (322) y `weight-log.tsx` (313) violan
`docs/conventions.md` §Estructura Expo oficial. Pero: (a) la propia convención dice
"Las pantallas anteriores a #39 NO se migran en frío: se mueven a este patrón solo
cuando una feature las toque **de fondo**", y cambiar el motor de fetching de tres
líneas por query no es tocarlas de fondo; (b) el candado que vigila el route
delgado (`design-drift.test.ts:112-133`) cubre **cuatro** rutas y ninguna es de
éstas, así que no hay regresión que reparar, hay deuda conocida; (c) mover 1 628
líneas más sus cuatro ficheros de test haría el diff de #87 ilegible justo en la
feature que toca diez pantallas de producción. **Se declara feature aparte** y su
enunciado queda redactado en `progress/spec_mobile-tanstack-query.md`.
Condición que la reviviría dentro de #87: que alguna pantalla necesitara **partirse**
para migrar, cosa que ninguna necesita.

**A2 — loaders de Expo Router (`useLoaderData`).** Descartada: son web-only y
exigen `web.output: "server"|"static"` más dos flags `unstable_*` (skill
`expo-data-fetching`, `references/expo-router-loaders.md`). El runtime de esta app
es el dev build de Android. Condición que la revive: que el proyecto añada salida
web servida.

**A3 — puente `AppState → focusManager` para que `refetchOnWindowFocus` funcione
de verdad.** Descartada: añade refetches al volver del segundo plano que hoy no
existen, y el criterio 5 prohíbe cambiar conducta. Es un candidato razonable para
después, con su propio smoke. Condición que la revive: que el humano pida
"refrescar al volver a la app".

**A4 — `@react-native-community/netinfo` + `onlineManager` para
`refetchOnReconnect`.** Descartada: dependencia nueva no autorizada por la entrada
de #87, y misma objeción de conducta que A3.

**A5 — meter el token en las catorce query keys** para que un cambio de sesión
invalide todo. Descartada frente a R6 (`queryClient.clear()` al pasar a
`unauthenticated`): el `clear()` son tres líneas en un sitio y cubre los catorce
recursos; el token en la clave lo filtraría a las catorce factorías, ensuciaría
todas las claves de #78 en adelante, y dejaría el dato viejo vivo en memoria
(inaccesible pero presente) hasta el `gcTime`.

**A6 — `refetchInterval: 15000` en las queries del mapa** en vez de conservar el
`setInterval` dentro del `useFocusEffect`. Descartada: `refetchInterval` sondea
mientras el componente está **montado**, y en el navegador de pestañas el tab de
mapa sigue montado al cambiar de pestaña — la app pediría posiciones cada 15 s con
el mapa invisible. El `useFocusEffect` actual para el sondeo al perder el foco, que
es la conducta correcta y la que su test candó en `map.test.tsx:731-733`.

**A7 — un hook envoltorio `useApiQuery(key, fn)`.** Descartada: interfaz con una
sola implementación que no añade conducta (el `enabled` y el `queryFn` los tiene
que escribir la pantalla igual), no le sirve a #78 (`useInfiniteQuery` no pasa por
ahí) y esconde el motor detrás de un nombre propio del repo, que es justo lo que
esta feature viene a quitar. Lo único genuinamente compartido —los literales de
clave— sí se extrae, y vive en `src/api/query-keys.ts` (R7).

**A8 — migrar las diez pantallas en un solo commit.** Descartada: §4.

## 9. Qué hereda #78 `mobile-alerts-center`

#78 está `spec_ready` y espera a ésta por decisión del humano. Cuando #87 cierre,
hay que enmendar **R1, R8, R9 y R11** de `specs/mobile-alerts-center/`. Esto es lo
que #87 le deja hecho y con qué forma exacta:

1. **La convención de claves (R7) admite `alerts` sin cambiarla.**
   `alertKeys.list(filters)` → `['alerts','list',{ status }]`, siguiendo
   `[dominio, recurso, ...ids, filtros?]`. Se añade la factoría a
   `src/api/query-keys.ts` en #78, no en #87 (el módulo `src/api/alerts.ts` aún no
   existe).
2. **La granularidad que su R8 necesita ya está garantizada.** Su R8 exige que el
   *ack* actualice la fila **sin volver a llamar a `listAlerts`**, y a la vez que
   el punto rojo de Home se entere. Con esta convención son **dos claves
   distintas** —`['alerts','list',{status:undefined}]` (el feed) y
   `['alerts','list',{status:'open'}]` (la campana)—, así que el patrón es:
   `queryClient.setQueryData` sobre el feed para parchear la fila en sitio, e
   `invalidateQueries({ queryKey: alertKeys.list({status:'open'}) })` para la
   campana. `['alerts']` sigue disponible para invalidar el dominio entero.
   **Aviso para la enmienda**: `invalidateQueries({queryKey:['alerts']})` a secas
   recargaría también el feed y rompería su R8; hay que invalidar la clave con el
   filtro.
3. **`useInfiniteQuery` para su R9.** `getNextPageParam: (lastPage) =>
   lastPage.kind === 'ok' ? (lastPage.nextCursor ?? undefined) : undefined`
   — devolver `undefined` es lo que apaga `hasNextPage`, y por eso el `null` del
   backend se traduce a `undefined`. `fetchNextPage()` en `onEndReached` cubre
   sola las tres condiciones que su R9 pide a mano (una llamada por final de lista,
   ninguna si no hay cursor, ninguna si ya hay una en vuelo: `isFetchingNextPage`).
   Y su nota sobre "si una página falla, lo ya cargado se queda" es el
   comportamiento por defecto de `useInfiniteQuery`.
4. **Su R11 deja de necesitar el `refetch` por foco.** Hoy su R11 mete
   `refetchAlerts` en el `useFocusEffect` de Home. Con #87 la campana es un
   `useQuery` sobre `alertKeys.list({status:'open'})` y se apaga por invalidación
   desde el ack, que es más inmediato y no depende de volver a Home. La enmienda
   debe **quitar** esa línea del `useFocusEffect`, no añadir una segunda vía.
5. **`renderWithProviders` (R3) es el helper que usarán sus tests de pantalla**, y
   su `queryClient` expuesto es lo que le permite sembrar páginas en tests de
   paginación.
6. **Su R1 no cambia de fondo**: `src/api/alerts.ts` sigue devolviendo la unión por
   `kind` y sigue sin lanzar. Lo que cambia es quién la llama.
7. **El `signOut` de su R8** (el ack que devuelve `unauthorized`) es una
   **mutación** y se queda en su punto de llamada, como las nueve llamadas de
   mutación (en siete ficheros) que inventaría [[requirements]] §0.3. El
   interceptor de R5 solo cubre lecturas.

Ninguna de estas siete obliga a tocar #87 después: la convención se eligió mirando
lo que #78 pide.

## 10. Arquitectura

`docs/architecture.md` describe la Clean Architecture del **backend**. La app móvil
no tiene capas domain/application/infrastructure; su regla equivalente, que esta
feature respeta y que conviene dejar escrita:

- `src/api/` es el **único** sitio que habla HTTP y el único que conoce el contrato
  del backend. **No cambia.**
- `src/providers/` guarda estado transversal de la app (auth, idioma, mascota
  seleccionada). El `QueryClient` es exactamente eso, y por eso `query-provider.tsx`
  vive ahí y no en `src/hooks/`.
- `src/api/query-keys.ts` vive junto a `src/api/` porque nombra **recursos de la
  API**, no pantallas: una clave es el identificador estable de una llamada, y su
  vecindad natural es el módulo que la hace.
- Las pantallas (`src/screens/`, `src/app/`) orquestan; no conocen `fetch` ni
  cabeceras. Antes y después.

Gate **C8** (`docs/ui-guidelines.md`): la feature no toca visual. Grep-clean sin
cambios, dimensiones sin cambios, componentes compartidos sin cambios, animaciones
sin cambios. Se verifica igualmente en la revisión, con delta esperado **0** en las
cifras de §6.4.
