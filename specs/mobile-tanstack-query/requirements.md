---
feature: "mobile-tanstack-query"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-tanstack-query]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Trabajo **solo de cliente móvil**. Cero cambios en `backend-pet-tracker/`, cero
> migraciones, **una** dependencia nueva (autorizada por la entrada de #87 en
> `feature_list.json`). Rige `docs/ui-guidelines.md` (carta de UI, gate C8 de
> `CHECKPOINTS.md`).
>
> Todas las rutas son relativas a `mobile-pet-tracker/` salvo indicación expresa.

---

## §0. Verificación de premisas contra el árbol (obligatoria antes de leer los requisitos)

Todo lo que sigue se comprobó leyendo el código en la branch
`feature/87-mobile-tanstack-query` (base `main` @ `5666b85`), no la descripción de
la feature. **Cuatro premisas del enunciado son falsas o imprecisas** y esta spec
las corrige.

### §0.1 Premisas confirmadas

| Premisa del enunciado | Veredicto | Evidencia leída |
|---|---|---|
| `src/hooks/use-api.ts` son 50 líneas y hace stale-while-revalidate de UN recurso con `useState<{fn,tick,value}>` y un `refetch` que incrementa `tick` | **cierta** | `use-api.ts:1-50`, literalmente eso y nada más |
| El único efecto lateral del hook es que `kind: 'unauthorized'` dispara `signOut` | **cierta para el hook** | `use-api.ts:29` `if (result.kind === 'unauthorized') void signOut();` — pero ver **D2**: no es el único sitio del repo |
| No hay caché compartida, ni dedup, ni acumulación de páginas, ni invalidación cruzada, ni reintentos | **cierta** | el estado vive en el `useState` de cada instancia del hook; no hay store |
| Los consumidores de producción son **exactamente diez** | **cierta** | `grep -rn "from '.*hooks/use-api'" src/` → `app/(tabs)/{food,health,map,meal-schedule,weight-log}.tsx` y `screens/{docs,home,pairing,profile,reminders}/index.tsx`. Ni uno más |
| `@tanstack/react-query` no está instalado | **cierta** | `package.json` no lo lista; no hay ninguna librería de data-fetching |
| Compatibilidad con react 19.2.3 / RN 0.86.2 / expo ~57.0.14 | **cierta** | `npm view @tanstack/react-query` → última v5 = **5.102.8**, `peerDependencies: { react: '^18 \|\| ^19' }`. Es JS puro: **sin código nativo, sin config plugin, sin prebuild**, luego RN 0.86.2 y expo ~57 no entran en la ecuación |
| Cinco de los diez consumidores son archivos de ruta bajo `src/app/(tabs)/` que llaman a `useApi` directamente y chocan con route-delgado + `src/screens/` | **cierta** | `food.tsx` 323 líneas, `health.tsx` 279, `map.tsx` 391, `meal-schedule.tsx` 322, `weight-log.tsx` 313 |
| El contrato de la capa de red es una unión discriminada por `kind` | **cierta** | los 14 módulos de `src/api/` devuelven `{kind: …}`; ver **D1** para la consecuencia |

### §0.2 Discrepancia **D1** — la capa de red **nunca rechaza**, luego `retry` es configuración muerta

El enunciado y el criterio de aceptación 1 piden justificar `retry`. Lo verificado
cambia la respuesta:

- `grep -rn "throw" src/api/*.ts` → **cero resultados**.
- `src/api/http.ts` envuelve `fetchFn` en `try/catch` en las tres funciones
  (`getJson:15-26`, `postJson:36-52`, `deleteJson:61-73`) y convierte cualquier
  excepción en `{ kind: 'unreachable', message }`.
- `readJson:76-82` traga el fallo de `response.json()` y devuelve `undefined`.

Consecuencia: la promesa de un `queryFn` construido sobre `src/api/` **siempre
resuelve**. Un fallo de red es un *valor resuelto* (`kind: 'unreachable'`), no un
rechazo. Por tanto, en TanStack Query:

- `error` / `isError` son **siempre** `false`;
- `retry` **nunca se dispara**, sea cual sea su valor;
- el "estado de error" de cada pantalla es una propiedad de `data.kind`, no del
  query.

Esto lo cierra **R2**: `retry: false` escrito explícitamente, no por gusto sino
para que el siguiente lector no crea que hay reintentos. Cambiar el contrato para
que `queryFn` lance está **fuera de alcance** (la entrada de #87 lo prohíbe:
"no se cambia la capa de red, solo quien la orquesta").

### §0.3 Discrepancia **D2** — el `signOut` ante `unauthorized` **no** vive solo en `use-api.ts`

El encargo pide verificar que "el `signOut` ante `kind: 'unauthorized'` vive solo
ahí". **Es falso tal como está enunciado.**

Reproducible:
`grep -rln "signOut" src/ --include=*.ts --include=*.tsx | grep -vE "\.test\.|__tests__|i18n/|ui-copy-table"`
devuelve **nueve** ficheros de producción. Uno de ellos,
`src/providers/auth-provider.tsx`, es donde `signOut` **se define**
(`:19,64,70,71`), no donde se llama. Los otros **ocho** lo consumen, y en los ocho
el disparador es `kind === 'unauthorized'`:

| Fichero:línea | Origen del `unauthorized` | ¿Lo toca #87? |
|---|---|---|
| `src/hooks/use-api.ts:29` | **lectura** (cualquiera de los 25 `useApi`) | **sí** — es lo que esta feature reubica |
| `src/app/(tabs)/meal-schedule.tsx:100` | mutación `generateNutritionPlan` | no |
| `src/app/(tabs)/weight-log.tsx:107` | mutación `createWeight` | no |
| `src/screens/add-pet/index.tsx:136,201` | mutaciones `requestPhotoUploadUrl`, `createPet` | no |
| `src/screens/add-reminder/index.tsx:101` | mutación `createReminder` | no |
| `src/screens/pairing/index.tsx:150,198` | mutaciones `claimDevice`, `releaseDevice` | no |
| `src/screens/profile/index.tsx:159` | mutación `requestPhotoUploadUrl` | no |
| `src/screens/reminders/index.tsx:100` | mutación `deleteReminder` | no |

En números, para que el `reviewer` los pueda reproducir: **8 ficheros** consumidores,
**10 llamadas** disparadas por `unauthorized` — la de lectura (`use-api.ts:29`) más
**9 de mutación** repartidas en **7 ficheros** (`weight-log:107`,
`meal-schedule:100`, `add-pet:136` y `:201`, `pairing:150` y `:198`,
`profile:159`, `reminders:100`, `add-reminder:101`). Aparte queda
`profile/index.tsx:387`, que es el botón de "cerrar sesión" que pulsa el usuario y
no tiene nada que ver con el 401.

La premisa **verdadera y más estrecha**, que es la que esta spec preserva:

> **En el camino de lectura**, el `signOut` ante `unauthorized` vive hoy en
> exactamente un sitio (`use-api.ts:29`) y tras la migración tiene que seguir
> viviendo en exactamente un sitio, no repetido por pantalla.

Las mutaciones conservan su manejo por punto de llamada, **sin cambios**: no se
cablea `MutationCache`, no se introduce `useMutation`. Está en §Fuera de alcance.

### §0.4 Discrepancia **D3** — hay un **undécimo** importador de `use-api` en producción

El criterio de aceptación 3 dice "ningún archivo de `src/` los importa". Además de
los diez consumidores, `src/hooks/use-pet-selection.ts:6` importa **el tipo**:

```ts
import type { ApiResult } from './use-api';
export function usePetSelection(pets: ApiResult<PetsState>): void
```

No llama a `useApi` (por eso no sale en la lista de diez), pero **borrar
`use-api.ts` sin tocarlo rompe el typecheck**. Lo cierra **R8**, y por eso R8 va
**antes** que cualquier pantalla: es lo que permite que las dos vías convivan
(ver [[design]] §4).

### §0.5 Discrepancia **D4** — los ficheros de test que **importan** `use-api` son **cinco**, no cuatro

El enunciado lista cuatro. Hay un quinto importador y, además, un sexto fichero que
lo **menciona sin importarlo** — distinción que importa porque solo los cinco
primeros dejan de compilar al borrar el módulo.

Reproducible, en dos pasos:

```
# los que lo importan  → 5 ficheros de test (y 11 de producción, ver D3)
grep -rln "from '.*use-api'" src/ --include=*.ts --include=*.tsx
# los que solo lo nombran → 1
comm -23 <(grep -rln "use-api" src/ --include=*.ts --include=*.tsx | sort) \
         <(grep -rln "from '.*use-api'" src/ --include=*.ts --include=*.tsx | sort)
```

| Fichero | Qué hace con `use-api` | ¿Lo importa? | Destino |
|---|---|---|---|
| `src/hooks/__tests__/use-api.test.tsx` | testea el hook (6 `it`) | **sí** | **se borra** (R19); sus seis contratos se re-alojan, tabla en [[design]] §6.1 |
| `src/app/(tabs)/__tests__/food.test.tsx:15,16,462` | `jest.spyOn(apiHooks,'useApi')` + `type ApiResult` | **sí** | **se reescribe** (R20) |
| `src/app/(tabs)/__tests__/health.test.tsx:20,21,545` | ídem | **sí** | **se reescribe** (R20) |
| `src/screens/home/index.test.tsx:21,22,845` | ídem | **sí** | **se reescribe** (R20) |
| `src/hooks/use-pet-selection.test.tsx:10` | `import type { ApiResult }` | **sí** | **se reescribe** (R8) |
| `src/screens/home/weekly-activity-chart.test.tsx:505` | `expect(source).not.toContain('use-api')` — el literal aparece **dentro de una aserción**, no en un `import` ni en un `jest.mock` | **no** | **se conserva tal cual** (R19); ver [[design]] §6.2 |

Consecuencia práctica: **cinco** ficheros de test hay que tocar; el sexto se queda
quieto y su aserción sigue siendo cierta tras el borrado.

### §0.6 Otras premisas verificadas que la spec necesita cerrar

| Qué | Verificado |
|---|---|
| Refresco al recuperar el foco | **no lo tienen las diez pantallas, solo cinco**: `useFocusEffect` aparece en `map.tsx:149`, `home/index.tsx:221`, `pairing/index.tsx:103,109`, `profile/index.tsx:123`, `reminders/index.tsx:68`. `food`, `health`, `meal-schedule`, `weight-log` y `docs` **no refrescan al foco hoy** y **no deben empezar a hacerlo** |
| `useIsFocused` | solo en `src/hooks/use-pet-selection.ts:9` |
| Candado del route delgado | `src/__tests__/design-drift.test.ts:112-133` cubre **cuatro** rutas: `home.tsx`, `profile.tsx`, `pets/add.tsx`, `pets/[petId]/docs.tsx`, con `< 10` líneas. Las cinco rutas gordas de `(tabs)/` **no están en ese candado** — la desviación es conocida y no vigilada (ver **A1** en [[design]] §8) |
| Candado de dependencias | `src/__tests__/design-drift.test.ts:135-146` es una **lista blanca por nombre** (`blobatar`, `expo-image-picker`, `@gorhom/bottom-sheet`, `react-native-chart-kit`, y `@blobatar/react` ausente). **No es un recuento**: añadir una dependencia no lo rompe |
| Candado de `transformIgnorePatterns` | `src/screens/home/weekly-activity-chart.test.tsx:434-444` usa `toContain` sobre el patrón. Añadir algo al patrón no lo rompería; **pero no hace falta**: `@tanstack/react-query` publica build CJS y jest lo resuelve sin transformar |
| Candado de longitud del catálogo | `src/providers/__tests__/language-provider.test.tsx:41` `expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7)`. **#87 no añade ni una clave de copy** — no hay texto nuevo visible para el usuario. Ese candado **no se toca**. Si alguna tarea parece necesitar copy nueva, es señal de que se salió del alcance: **parar y volver al gate** |
| Recuentos absolutos en otros candados | `consistency-classnames.test.ts:102,215,231,232,306,327,360,447` y `legibility-classnames.test.ts:132` cuentan `className`s, `TextInput`s y `style={…}`. La migración **no toca ni un `className` ni un `style`**: solo imports, llamadas a hooks y tipos. Δ esperado = **0** |
| `test/` entra en el typecheck | `tsconfig.json` `include: ["**/*.ts","**/*.tsx", …]`, sin `exclude`. Un helper en `test/` se typechequea, y **no** lo recorren los escáneres de fuente de producción (`productionSourceFiles(sourceRoot)` en `use-pet-selection.test.tsx:35-47` y los de `src/__tests__/`), que arrancan en `src/` |
| Cómo se instalan las dependencias móviles | `init.config.sh:INSTALL_CMD` → `bun install --cwd mobile-pet-tracker`. La isla es de **bun** (`bun.lock`, 362 KB) |
| Loaders de Expo Router (`useLoaderData`) | **no aplican**: son *web-only* y exigen `web.output: "server"\|"static"` más los flags `unstable_useServerDataLoaders`/`unstable_useServerRendering` (skill `expo-data-fetching`, `references/expo-router-loaders.md`). Esta app no tiene salida web servida y su runtime de humo es el **dev build de Android**. Descartado, **A2** en [[design]] §8 |
| `@react-native-community/netinfo` | **no está instalado**. Sin él, el `onlineManager` de React Query nunca observa una reconexión en RN — consecuencia directa sobre `refetchOnReconnect` (R2) |

---

## Requisitos funcionales

> Convención de tests: cada `describe` nombra su R-id, p. ej.
> `describe('#87 R1: la dependencia queda declarada y fijada', …)`
> (`docs/conventions.md` §Tests, C4 de `CHECKPOINTS.md`).
>
> **Regla de oro de esta feature — qué se puede y qué no se puede tocar en un
> test existente.** El criterio 5 dice "sin relajar aserciones". Para que no haya
> interpretación:
>
> - **Permitido**: envolver una aserción existente en `await waitFor(() => …)` o
>   cambiar `getByTestId` por `await findByTestId`, **conservando literalmente el
>   valor esperado**. El cambio de motor introduce un tick asíncrono más en
>   algunos puntos; esperar por el mismo resultado no es relajar.
> - **Prohibido**: cambiar un valor esperado, borrar una aserción, cambiar
>   `toHaveBeenCalledTimes(n)` por `toHaveBeenCalled()`, cambiar `getBy` por
>   `queryBy` + `toBeTruthy`, o añadir `try/catch` alrededor de una aserción.
> - Si una aserción **de verdad** ya no aplica, **no se toca**: se para y se
>   escribe por qué en `progress/impl_mobile-tanstack-query.md`, y decide el
>   humano en la revisión.

### R1 — la dependencia queda declarada y fijada

**WHEN** se ejecuta la suite móvil
**THE SYSTEM SHALL** encontrar en `mobile-pet-tracker/package.json` la
dependencia `"@tanstack/react-query": "5.102.8"` — **versión exacta, sin `^` ni
`~`** — en `dependencies`, y `bun.lock` actualizado en el mismo commit.

**AND** `jest.transformIgnorePatterns[0]` de `package.json` seguirá **sin
mencionar** `@tanstack`: el paquete publica CJS y jest lo resuelve sin
transformar. Si al correr la suite apareciese un `SyntaxError: Cannot use import
statement outside a module` proveniente de `@tanstack/query-core`, la corrección
autorizada es añadir `|@tanstack/.*` al patrón **en ese mismo commit** y anotarlo
en `progress/impl_mobile-tanstack-query.md`; ninguna otra.

**AND** la instalación se hará desde `mobile-pet-tracker/` con
`bunx expo install @tanstack/react-query` (Expo CLI detecta `bun.lock` y delega en
bun, que es como `init.config.sh` instala esta isla). Si `expo install` escribe un
rango, se corrige a `5.102.8` a mano y se re-ejecuta `bun install`.

Motivo del pin exacto: diez pantallas de producción dependen de los **valores por
defecto** de la librería (`staleTime`, `structuralSharing`, `refetchOnMount`); un
bump menor los cambiaría en silencio. Es el mismo criterio ya aplicado a
`react-native-chart-kit: 7.0.4`, cuyo candado explica el pin con la misma frase
("la geometría depende de sus constantes").

**Test**: `src/__tests__/design-drift.test.ts::#87 R1: la dependencia queda
declarada y fijada` — `describe` nuevo al final del fichero, leyendo
`package.json` con el mismo `readFileSync(join(projectRoot,'package.json'))` que
ya usa `:136-139`. Tres `it`: (a) `dependencies['@tanstack/react-query']` es
exactamente `'5.102.8'`; (b) no empieza por `^` ni por `~`; (c)
`jest.transformIgnorePatterns[0]` **no** contiene `'@tanstack'`.

### R2 — configuración del `QueryClient`, con los cinco mandos cerrados

**WHEN** se invoca `createQueryClient()` exportado por
`src/providers/query-provider.tsx`
**THE SYSTEM SHALL** devolver un `QueryClient` cuyo
`getDefaultOptions().queries` contenga **exactamente** estos valores:

| Opción | Valor | ¿Se escribe en código? | Motivo |
|---|---|---|---|
| `staleTime` | `0` | **sí**, explícito | Hoy toda instancia de `useApi` pide al montar y `refetch()` pide siempre. Cualquier `staleTime > 0` **suprimiría en silencio** una petición que hoy sí ocurre, y eso es cambio de conducta (criterio 5). El `0` explícito además documenta que la ganancia buscada es la **deduplicación de peticiones en vuelo** —que funciona con `staleTime: 0`— y no el ahorro por frescura |
| `gcTime` | `5 * 60 * 1000` | **sí**, explícito | Es el valor por defecto de v5, pero se escribe porque es **el parámetro del que depende la delta D-1** ([[design]] §5): cuánto tiempo una pantalla desmontada conserva sus datos para repintarlos sin esqueleto al volver. Dejarlo implícito escondería la decisión |
| `retry` | `false` | **sí**, explícito | Ver **D1** (§0.2): `queryFn` nunca rechaza, luego el `retry: 3` por defecto es configuración muerta. Y si algún día un `queryFn` rechazara por un bug, con `retry: 3` el fallo tardaría ~7 s en aparecer en vez de aparecer al instante |
| `refetchOnWindowFocus` | `false` | **sí**, explícito | En React Native no existe `visibilitychange`, así que el `true` por defecto **nunca se dispara**: es una promesa que la app no puede cumplir. Sustituirlo por un puente `AppState → focusManager` **añadiría** refetches al volver del segundo plano que hoy no existen: cambio de conducta prohibido por el criterio 5. El refresco al recuperar el foco **de pantalla** —que es otra cosa— se queda donde está hoy: los `useFocusEffect` de las cinco pantallas que lo tienen (§0.6). Candidato a feature aparte, **A3** en [[design]] §8 |
| `refetchOnReconnect` | `false` | **sí**, explícito | Sin `@react-native-community/netinfo` (§0.6) el `onlineManager` de React Query no observa reconexiones en RN, luego el `true` por defecto tampoco se dispara nunca. Instalar NetInfo es una dependencia que la entrada de #87 no autoriza. **A4** en [[design]] §8 |

**AND** `createQueryClient()` **no** declarará `placeholderData`,
`keepPreviousData`, `structuralSharing`, `notifyOnChangeProps`, `suspense` ni
`throwOnError`: los valores por defecto de v5 son los correctos y escribirlos
sería ruido. En particular `placeholderData: keepPreviousData` está
**prohibido** — pintaría los datos de la mascota anterior al cambiar de mascota,
que es justo lo que el `useApi` de hoy evita a propósito (`use-api.ts:42-46`) y lo
que R13 vuelve a candar.

**Test**: `src/providers/__tests__/query-provider.test.tsx::#87 R2: el
QueryClient fija sus cinco mandos` — un `it` por fila de la tabla leyendo
`createQueryClient().getDefaultOptions().queries`, más un `it` que afirma que
`queries.placeholderData` es `undefined`.

### R3 — helper de render con proveedores

**WHEN** un test invoca `renderWithProviders(ui, options?)` desde
`test/render-with-providers.tsx`
**THE SYSTEM SHALL** renderizar `ui` envuelto en `QueryClientProvider` con un
`QueryClient` **nuevo por llamada**, y devolver el `RenderResult` de
`@testing-library/react-native` **más** la propiedad `queryClient` con ese mismo
cliente.

**AND** el cliente de test se construirá con
`defaultOptions: { queries: { retry: false, gcTime: 0 } }`:
`retry: false` iguala la producción (R2) y `gcTime: 0` evita que el temporizador
de recolección de 5 minutos sobreviva al test y dispare el detector de handles
abiertos de jest.

**AND** `options.wrapper` seguirá siendo respetado: si el test pasa su propio
wrapper (todos los ficheros de pantalla tienen uno con
`HeroUINativeProvider` + `LanguageProvider` + `SelectedPetProvider`), el
`QueryClientProvider` quedará **por fuera** de él.

**AND** el helper vive en `test/`, **no** en `src/`, y el motivo es verificable:
los escáneres de fuente de producción (`productionSourceFiles(sourceRoot)` de
`src/hooks/use-pet-selection.test.tsx:35-47`, y los homólogos de
`src/__tests__/consistency-classnames.test.ts:41` y `:403`) arrancan en `src/` y
solo excluyen `__tests__/` y `*.test.*`; un helper en `src/test-utils/` entraría
en esos barridos como si fuera producción.

**Test**: `test/__tests__/render-with-providers.test.tsx::#87 R3: el helper monta
el QueryClientProvider y devuelve su cliente` — tres `it` con un componente sonda
`function Probe() { const q = useQuery({queryKey:['probe'], queryFn: async () => 'ok'}); return <Text testID="probe">{q.data ?? '…'}</Text>; }`:
(a) `await screen.findByTestId('probe')` acaba con texto `'ok'`;
(b) `result.queryClient` es la misma instancia que ve el árbol
(`result.queryClient.getQueryData(['probe'])` es `'ok'`);
(c) dos llamadas seguidas devuelven clientes **distintos** y la segunda no ve el
dato de la primera.

### R4 — el proveedor envuelve la app

**WHEN** se monta `RootLayout` de `src/app/_layout.tsx`
**THE SYSTEM SHALL** renderizar el árbol
`GestureHandlerRootView > HeroUINativeProvider > LanguageProvider > AuthProvider > QueryProvider > Stack`,
donde `QueryProvider` es el componente exportado por
`src/providers/query-provider.tsx`.

**AND** `QueryProvider` estará **por dentro** de `AuthProvider` y **por fuera**
de `Stack`, y el motivo es forzoso: R5 y R6 necesitan leer `useAuth()` para
construir el cliente, y `useAuth` lanza fuera de su proveedor
(`auth-provider.tsx:80-82`).

**AND** `QueryProvider` creará su cliente **una sola vez** por montaje, con
`useState(() => createQueryClient())`, no en el cuerpo del render: un cliente
nuevo por render tiraría la caché en cada re-render.

**Test**: `src/app/__tests__/layout.test.tsx::#87 R4: QueryProvider envuelve la
app dentro de AuthProvider` — `describe` nuevo al final. Dos `it`: (a) el fuente
de `src/app/_layout.tsx` contiene `<QueryProvider>` y su cierre, y el índice de
`'<AuthProvider>'` en el fuente es **menor** que el de `'<QueryProvider>'`, que a
su vez es **menor** que el de `'<Stack '`; (b) un componente sonda con `useQuery`
montado bajo `RootLayout` resuelve sin lanzar `No QueryClient set`.

### R5 — un único sitio para el `signOut` ante `unauthorized` de lectura

**WHEN** cualquier query registrada en el `QueryClient` resuelve con un valor
cuyo `kind` es `'unauthorized'`
**THE SYSTEM SHALL** invocar `signOut()` de `useAuth()` **una vez por resolución**,
desde **un único** punto del código: la callback `onSuccess` del `QueryCache`
construido dentro de `createQueryClient`, en
`src/providers/query-provider.tsx`.

**AND** ninguna de las diez pantallas migradas contendrá la cadena `signOut` en
su camino de **lectura**. Las llamadas de **mutación** enumeradas en §0.3 se
quedan exactamente donde están, sin tocar.

**AND** el `signOut` se leerá a través de una `useRef` actualizada en cada render
(`signOutRef.current = signOut`), no capturado en el `useState` inicializador. Se
verificó que `signOut` de `auth-provider.tsx:64-67` es hoy estable
(`useCallback(…, [])`), así que capturarlo funcionaría; la `ref` cuesta dos líneas
y evita que una futura dependencia en ese `useCallback` produzca un cierre rancio
silencioso.

**AND** la detección será por forma, no por tipo:
`(data): boolean => typeof data === 'object' && data !== null && (data as {kind?: unknown}).kind === 'unauthorized'`,
porque `QueryCache.onSuccess` recibe `unknown`.

**Test**: `src/providers/__tests__/query-provider.test.tsx::#87 R5: unauthorized
expulsa desde un único sitio` — tres `it`, con `useAuth` mockeado y
`render` de una sonda `useQuery` bajo `QueryProvider`:
(a) una query que resuelve `{kind:'unauthorized'}` deja
`expect(mockSignOut).toHaveBeenCalledTimes(1)`;
(b) una que resuelve `{kind:'ok'}` deja `expect(mockSignOut).not.toHaveBeenCalled()`;
(c) una que resuelve `{kind:'unreachable', message:'x'}` tampoco llama.

> El barrido de fuente «ninguna de las diez pantallas llama a `signOut` en su
> camino de lectura» **no vive aquí**: en el momento de R5 las diez siguen en
> `useApi` y la aserción nacería verde. Vive en **R19**, con el recuento por
> fichero declarado como delta en [[design]] §6.3. Mismo motivo que el barrido de
> claves de R7: sujeto ausente.

### R6 — la caché se vacía al cerrar sesión

**WHEN** el `status` de `useAuth()` pasa a `'unauthenticated'`
**THE SYSTEM SHALL** invocar `queryClient.clear()` desde `QueryProvider`, en un
`useEffect` cuyas dependencias son `[status, queryClient]`.

Motivo (esto **no** es alcance añadido por gusto, es un agujero que **abre** la
migración): hoy no existe caché entre sesiones, porque cada `useApi` muere con su
pantalla y el token forma parte de la identidad de `fn`
(`useCallback([baseUrl, token])`). Con una caché de proceso y claves que **no**
incluyen el token, los datos del usuario A sobrevivirían a un `signOut` y se
pintarían al usuario B que inicie sesión después en el mismo arranque de la app.
Vaciar la caché es de tres líneas; meter el token en las catorce claves lo
filtraría a todas ellas. Alternativa descartada **A5** en [[design]] §8.

**Test**: `src/providers/__tests__/query-provider.test.tsx::#87 R6: cerrar sesión
vacía la caché` — dos `it`: (a) con `status: 'authenticated'` se siembra
`queryClient.setQueryData(['probe'], 'v1')`, se re-renderiza con
`status: 'unauthenticated'` y `queryClient.getQueryData(['probe'])` queda
`undefined`; (b) pasar de `'loading'` a `'authenticated'` **no** vacía un dato
sembrado.

### R7 — convención de query keys y las catorce claves del repo

**WHEN** una pantalla necesita nombrar un recurso de la API
**THE SYSTEM SHALL** obtener su clave de `src/api/query-keys.ts`, único fichero
del repo donde se escriben literales de query key, con esta forma:

```
[<dominio>, <recurso>, ...<identificadores>, <filtros>?]
```

- `<dominio>` es el nombre del módulo de `src/api/` sin extensión (`'pets'`,
  `'nutrition'`, `'health'`, `'positions'`, `'trips'`, `'activity'`,
  `'reminders'`, `'devices'`, `'users'`, `'media'`);
- `<recurso>` distingue operaciones dentro del módulo (`'list'`, `'detail'`,
  `'plan'`, …);
- los identificadores van **de más general a más específico**, de modo que
  `invalidateQueries({ queryKey: ['pets'] })` alcance todo el dominio y
  `['pets','detail',petId]` alcance una sola entrada;
- `<filtros>` es un **objeto** al final y solo aparece cuando el recurso admite
  parámetros que cambian la respuesta.

Las catorce claves, con su consumidor y su función de API:

| # | Factory | Clave | Función de `src/api/` | Consumidores |
|---|---|---|---|---|
| 1 | `petKeys.list()` | `['pets','list']` | `listPets` | food, health, map, home, pairing, profile, reminders (**7**) |
| 2 | `petKeys.detail(petId)` | `['pets','detail',petId]` | `getPet` | docs, home, profile (**3**) |
| 3 | `nutritionKeys.plan(petId)` | `['nutrition','plan',petId]` | `getNutritionPlan` | food, meal-schedule (**2**) |
| 4 | `nutritionKeys.profile(petId)` | `['nutrition','profile',petId]` | `getNutritionProfile` | meal-schedule |
| 5 | `healthKeys.vaccines(petId)` | `['health','vaccines',petId]` | `listVaccines` | health |
| 6 | `healthKeys.weights(petId, limit)` | `['health','weights',petId,{limit}]` | `listWeights` | health (`limit: 1`), weight-log (`limit: undefined`) |
| 7 | `positionKeys.last(petId)` | `['positions','last',petId]` | `getLastPosition` | map |
| 8 | `positionKeys.list(petId)` | `['positions','list',petId]` | `listPositions` | map |
| 9 | `tripKeys.dayRoute(petId)` | `['trips','day-route',petId]` | `getDayRoute` | map |
| 10 | `activityKeys.daily(petId)` | `['activity','daily',petId]` | `getDailyActivity` | home |
| 11 | `reminderKeys.list(petId)` | `['reminders','list',petId]` | `listReminders` | home, reminders (**2**) |
| 12 | `deviceKeys.tracking(petId)` | `['devices','tracking',petId]` | `getPetTracking` | pairing |
| 13 | `userKeys.me()` | `['users','me']` | `getMe` | profile |
| 14 | `mediaKeys.petDocs(petId)` | `['media','pet-docs',petId]` | `listPetDocs` | docs |

**AND** la clave **6 lleva el `limit` obligatoriamente**, y esto no es cosmético:
`health.tsx:63` pide `listWeights(baseUrl, token, petId, fetch, 1)` y
`weight-log.tsx:66` pide `listWeights(baseUrl, token, petId)` sin límite
(`health-records.ts:67-78`: `limit === undefined ⇒ sin '?limit='`). Con una clave
común, abrir el log de peso desde Salud haría que la tarjeta de Salud pintara la
lista completa, o al revés. Es el único choque de argumentos del repo y se cierra
aquí.

**AND** cuando el identificador puede ser `null` (todas las pantallas con
`selectedPetId`), la pantalla pasará `selectedPetId ?? ''` a la factory y
desactivará la query con `enabled`. Una clave con `''` nunca se ejecuta y no puede
colisionar con un `petId` real.

**AND** ninguna pantalla escribirá un array literal como `queryKey`.

**Herencia para #78** (`mobile-alerts-center`, `spec_ready`, esperando a ésta):
`alertKeys.list(filters)` → `['alerts','list',{status}]` encaja en esta convención
sin cambiarla, y da exactamente la granularidad que #78 necesita: la lista sin
filtro (`{status: undefined}`) y la del punto rojo (`{status: 'open'}`) son claves
**distintas**, así que el `ack` de R8 de #78 puede invalidar solo la del punto rojo
sin recargar la lista abierta en pantalla —que es justo lo que su R8 exige— y
`['alerts']` sigue disponible para invalidar todo. Detalle completo en
[[design]] §9.

**Test**: `src/api/__tests__/query-keys.test.ts::#87 R7: las claves siguen la
convención y no colisionan` — tres `it`: (a) `it.each` con las catorce filas de
la tabla afirmando la igualdad exacta del array devuelto; (b)
`healthKeys.weights('p1',1)` **no** es igual a `healthKeys.weights('p1',undefined)`;
(c) toda clave empieza por su dominio y `['pets','detail','p1']` empieza por
`['pets']` (prefijo, comprobado con `slice`).

> El barrido "ningún literal de clave fuera de este fichero" **no vive aquí**: en
> el momento de R7 las diez pantallas todavía no tienen ninguna `queryKey`, así
> que la aserción nacería verde y no candaría nada. Vive en **R19**, cuando las
> diez ya están migradas. Es el mismo error de sujeto ausente que paró #70 y #85.

### R8 — `usePetSelection` deja de depender de `ApiResult`

**WHEN** se invoca `usePetSelection(pets)` desde
`src/hooks/use-pet-selection.ts`
**THE SYSTEM SHALL** aceptar como parámetro el tipo estructural mínimo que el hook
consume de verdad:

```ts
export interface PetSelectionSource {
  data: PetsState | undefined;
  isRefreshing: boolean;
}
export function usePetSelection(pets: PetSelectionSource): void
```

y **no** importar nada de `./use-api`.

**AND** su conducta observable no cambia: sigue sin seleccionar cuando la pantalla
no tiene el foco, cuando `isRefreshing` es `true`, y cuando la selección ya existe
en la lista; y sigue seleccionando la primera mascota cuando no existe.

**AND** este requisito va **antes que las diez pantallas a propósito**: es lo que
hace que las dos vías convivan. Una pantalla **sin migrar** sigue pasando su
`ApiResult<PetsState>` y compila, porque TypeScript solo aplica la comprobación de
propiedades sobrantes a literales de objeto recién creados, no a variables; una
pantalla **migrada** pasa el literal
`{ data: pets.data, isRefreshing: pets.isRefetching }`, que encaja exactamente.
Ver [[design]] §4.

**Test**: `src/hooks/use-pet-selection.test.tsx::#87 R8: usePetSelection acepta la
forma mínima y no conoce use-api` — el `describe('R10: …')` existente se conserva
íntegro con sus cuatro `it` y solo cambia su helper `petsResult` para devolver
`PetSelectionSource` (sin `refetch`); se añade un `describe` nuevo con dos `it`:
(a) el fuente de `src/hooks/use-pet-selection.ts` no contiene `'use-api'`;
(b) `usePetSelection({data: {kind:'ok',pets:[…]}, isRefreshing: true})` no llama a
`selectPet` — la misma aserción de siempre, ahora sobre el tipo nuevo.

---

## R9–R18 — las diez pantallas

> Los diez requisitos comparten la **misma plantilla**, así que la parte común se
> escribe una vez aquí y cada requisito solo aporta su tabla.
>
> **WHEN** la pantalla se monta
> **THE SYSTEM SHALL** obtener cada uno de sus recursos con `useQuery` de
> `@tanstack/react-query`, con la `queryKey` que le asigna R7, un `queryFn` que
> devuelve exactamente la misma llamada a `src/api/` que hoy devuelve su `fn`, y
> el `enabled` de la tabla;
> **AND** dejará de importar `../../hooks/use-api`;
> **AND** mapeará el resultado así, sin excepción:
> `data` → `query.data`; `refetch` → `query.refetch`; `isRefreshing` →
> `query.isRefetching`;
> **AND** conservará **sin tocar** sus `useFocusEffect`, sus intervalos, sus
> manejadores de mutación y todo su JSX;
> **AND** sus tests existentes seguirán pasando bajo la regla de oro de arriba.
>
> ### Cómo se pone en rojo cada uno de estos diez requisitos
>
> Los tests existentes de cada pantalla pasan **antes y después** de la migración
> —ése es justamente el objetivo—, así que no sirven como rojo. El rojo de R9–R18
> es una aserción **nueva y de conducta**, no un grep, y es la misma en los diez:
>
> ```ts
> describe('#87 R<n>: <pantalla> lee por TanStack Query', () => {
>   it('deja cada recurso en la caché bajo su clave', async () => {
>     // …mocks resueltos como en el resto del fichero…
>     const { queryClient } = await renderWithProviders(<X />, { wrapper: XWrapper });
>     await screen.findByTestId('<algo del estado cargado>');
>
>     expect(queryClient.getQueryData(<clave 1>)).toEqual(<estado 1>);
>     // …una línea por query de la tabla del requisito…
>   });
> });
> ```
>
> **Rojo antes**: con `useApi`, la caché está vacía y `getQueryData` devuelve
> `undefined`. **Verde después**: la pantalla escribe en la caché bajo esa clave y
> no bajo otra. Esta aserción cierra a la vez las tres cosas que el requisito
> promete —que la pantalla lee por TanStack Query (criterio 2), que usa **su**
> clave de R7, y que el `queryFn` devuelve el mismo estado que devolvía el `fn`—
> y **no** es un `ReferenceError` ni una mutación de un doble (C4, cuarto y quinto
> punto).
>
> La aserción de "ya no importa `use-api`" **no** se escribe por pantalla: la hace
> R19 de una vez para las diez. Repetirla diez veces sería ruido.

### R9 — `src/screens/docs/index.tsx` (`DocsScreen`)

| Hoy | Mañana |
|---|---|
| `petFn = useCallback(() => getPet(baseUrl, token ?? '', petId), [...])`; `pet = useApi(petFn)` (`:52-60`) | `pet = useQuery({ queryKey: petKeys.detail(petId), queryFn: () => getPet(baseUrl, token ?? '', petId) })` |
| `docsFn = useCallback(() => listPetDocs(baseUrl, token ?? '', petId), [...])`; `docs = useApi(docsFn)` (`:56-61`) | `docs = useQuery({ queryKey: mediaKeys.petDocs(petId), queryFn: () => listPetDocs(baseUrl, token ?? '', petId) })` |

`enabled`: ninguno — `petId` es un prop obligatorio. Sin `useFocusEffect`, sin
`usePetSelection`. **La pantalla más simple: va primera.**

**Test que la protege**: `src/screens/docs/index.test.tsx`.
**Aserción que se rompería si la migración cambiara su estado de carga**:
`:96-97` `expect(screen.getByTestId('docs-header-skeleton')).toBeVisible()` y
`docs-list-skeleton` con `getPet`/`listPetDocs` colgados en `pending()` — si
`useQuery` expusiera datos donde hoy hay `undefined`, los esqueletos no se
pintarían. **Del estado de error**: `:146` `docs-error` visible y `:149`
`expect(mockListPetDocs).toHaveBeenCalledTimes(2)` tras pulsar `docs-retry` — si
`refetch()` no pidiera (por ejemplo con un `staleTime > 0`), el recuento se
quedaría en 1.

### R10 — `src/app/(tabs)/weight-log.tsx` (`WeightLogContent`)

| Hoy | Mañana |
|---|---|
| `weightsFn = useMemo(() => () => listWeights(baseUrl, token ?? '', petId), [...])`; `weights = useApi(weightsFn)` (`:65-69`) | `weights = useQuery({ queryKey: healthKeys.weights(petId, undefined), queryFn: () => listWeights(baseUrl, token ?? '', petId) })` |

`enabled`: ninguno (`petId` es prop). Sin foco. `handleSubmit` llama
`weights.refetch()` tras crear un peso — **se conserva**, y su `signOut` de la
rama `unauthorized` (`:107`) es de **mutación**: no se toca (§0.3).

**Test**: `src/app/(tabs)/__tests__/weight-log.test.tsx`.
**Carga**: `:142` `weight-log-loading` visible; `:173` su `className` contiene la
altura reservada. **Error**: `:236` `weight-log-error` con su texto y `:244`
`expect(mockListWeights).toHaveBeenCalledTimes(2)` tras `weight-log-retry`.
**Refresco tras mutación**: `:344`
`await waitFor(() => expect(mockListWeights).toHaveBeenCalledTimes(2))`.

### R11 — `src/app/(tabs)/meal-schedule.tsx` (`MealScheduleContent`)

| Hoy | Mañana |
|---|---|
| `planFn`/`plan = useApi(planFn)` (`:44-52`) | `plan = useQuery({ queryKey: nutritionKeys.plan(petId), queryFn: () => getNutritionPlan(baseUrl, token ?? '', petId) })` |
| `profileFn`/`profile = useApi(profileFn)` (`:48-53`) | `profile = useQuery({ queryKey: nutritionKeys.profile(petId), queryFn: () => getNutritionProfile(baseUrl, token ?? '', petId) })` |

`enabled`: ninguno. `retryAll()` (`:64-67`) y el `plan.refetch()` de
`handleGenerate` (`:81`) se conservan literalmente. `signOut` de `:100` es de
mutación: no se toca.

**Test**: `src/app/(tabs)/__tests__/meal-schedule.test.tsx`.
**Carga**: `:188-201`, `meal-schedule-loading` más los cuatro esqueletos con su
`toHaveProp`. **Error**: `:305` `meal-schedule-error`, y `:314-315`
`expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2)` **y**
`expect(mockGetNutritionProfile).toHaveBeenCalledTimes(2)` tras
`meal-schedule-retry` — esta pareja es la que rompería si `retryAll` dejara de
refrescar las dos.

### R12 — `src/app/(tabs)/food.tsx` (`FoodScreen`)

| Hoy | Mañana |
|---|---|
| `petsFn`/`pets = useApi(petsFn)` (`:41-46`) | `pets = useQuery({ queryKey: petKeys.list(), queryFn: () => listPets(baseUrl, token ?? '') })` |
| `usePetSelection(pets)` (`:47`) | `usePetSelection({ data: pets.data, isRefreshing: pets.isRefetching })` |
| `planFn` condicionado a `selectedPetId`; `plan = useApi(planFn)` (`:48-55`) | `plan = useQuery({ queryKey: nutritionKeys.plan(selectedPetId ?? ''), queryFn: () => getNutritionPlan(baseUrl, token ?? '', selectedPetId!), enabled: selectedPetId !== null })` |

Sin foco. **La primera con `usePetSelection`: es donde R8 se estrena de verdad.**

**Atención — el bloque de `jest.spyOn(apiHooks,'useApi')` de
`food.test.tsx:440-482` se reescribe en esta misma tarea, no después.** En cuanto
`FoodScreen` deja de llamar a `useApi`, ese espía deja de interceptar nada y el
`it` se cae. El mecanismo de reescritura lo fija **R20**; aquí solo se aplica.
Lo mismo vale para R13 (`health.test.tsx:525-566`) y R17
(`home/index.test.tsx:821-869`).

**Test**: `src/app/(tabs)/__tests__/food.test.tsx`.
**Carga**: `:162` `food-loading` visible y `:163-171` los tres esqueletos con
`toHaveProp`; `:272-284` el esqueleto de plan mientras el plan cuelga, con
`expect(screen.queryByTestId('food-schedule-skeleton')).toBeNull()` — esta última
es la que se rompería si `enabled` estuviera mal puesto y el plan arrancara antes
de haber mascota. **Error**: `:194-198`, `food-error` visible y
`expect(mockListPets).toHaveBeenCalledTimes(2)` tras `food-retry`; `:392-396`
`food-plan-error` + `food-plan-retry`.

### R13 — `src/app/(tabs)/health.tsx` (`HealthScreen`)

| Hoy | Mañana |
|---|---|
| `petsFn`/`pets = useApi(petsFn)` (`:46-51`) | `pets = useQuery({ queryKey: petKeys.list(), queryFn: () => listPets(baseUrl, token ?? '') })` |
| `usePetSelection(pets)` (`:52`) | `usePetSelection({ data: pets.data, isRefreshing: pets.isRefetching })` |
| `vaccinesFn` condicionado; `vaccines = useApi(vaccinesFn)` (`:53-67`) | `useQuery({ queryKey: healthKeys.vaccines(selectedPetId ?? ''), queryFn: () => listVaccines(baseUrl, token ?? '', selectedPetId!), enabled: selectedPetId !== null })` |
| `weightFn` condicionado, **con `limit: 1`**; `weight = useApi(weightFn)` (`:60-68`) | `useQuery({ queryKey: healthKeys.weights(selectedPetId ?? '', 1), queryFn: () => listWeights(baseUrl, token ?? '', selectedPetId!, fetch, 1), enabled: selectedPetId !== null })` |

Sin foco. **Es la pantalla del choque de claves**: su `limit: 1` frente al
`undefined` de R10. Si las dos compartieran clave, la tarjeta de peso de Salud
pintaría la lista completa del log.

**Test**: `src/app/(tabs)/__tests__/health.test.tsx`.
**Carga**: `:193` `health-loading` visible; `:214` su `className` contiene `h-12`.
**Error**: `:227-232` `health-error` + `expect(mockListPets).toHaveBeenCalledTimes(2)`;
`:431-438` `vaccines-error` + `expect(mockListVaccines).toHaveBeenCalledTimes(2)`;
`:513` `weight-card-error`.
**Aserción específica del choque de claves**: además de las existentes, R13 añade
un `it` a `src/api/__tests__/query-keys.test.ts` (ya cubierto por R7 (b)).

### R14 — `src/screens/reminders/index.tsx` (`RemindersScreen`)

| Hoy | Mañana |
|---|---|
| `petsFn`/`pets = useApi(petsFn)` (`:48-53`) | `pets = useQuery({ queryKey: petKeys.list(), … })` |
| `usePetSelection(pets)` (`:54`) | `usePetSelection({ data: pets.data, isRefreshing: pets.isRefetching })` |
| `remindersFn` condicionado; `reminders = useApi(remindersFn)` (`:55-62`) | `useQuery({ queryKey: reminderKeys.list(selectedPetId ?? ''), queryFn: () => listReminders(baseUrl, token ?? '', selectedPetId!), enabled: selectedPetId !== null })` |

`useFocusEffect(useCallback(() => { refetchReminders(); }, [refetchReminders]))`
(`:68-70`) **se conserva palabra por palabra**, con `refetchReminders =
reminders.refetch`. `signOut` de `:100` es de mutación (borrar recordatorio): no
se toca.

**Test**: `src/screens/reminders/index.test.tsx`.
**Carga**: `:202-203` `reminders-loading` visible y
`expect(screen.getAllByTestId(/^reminder-row-skeleton-/)).toHaveLength(3)`.
**Error**: `:245-252` `reminders-error` + `toHaveBeenCalledTimes(2)` tras
`reminders-retry`.
**Refresco al foco**: `:376-385` — invoca
`mockUseFocusEffect.mock.calls.at(-1)?.[0]` y afirma que `listReminders` pasa de
1 a 2 llamadas. **Ésta es la aserción exacta que se rompería si el refetch por
foco se perdiera en la migración.**

### R15 — `src/screens/pairing/index.tsx` (`PairingScreen`)

| Hoy | Mañana |
|---|---|
| `petsFn`/`pets = useApi(petsFn)` (`:72-76`) | `pets = useQuery({ queryKey: petKeys.list(), … })` |
| `usePetSelection(pets)` (`:77`) | `usePetSelection({ data: pets.data, isRefreshing: pets.isRefetching })` |
| `trackingFn` condicionado a **tres** cosas: `phase === 'idle' && selectedPetId && hasSelectedDevice` (`:92-99`) | `useQuery({ queryKey: deviceKeys.tracking(selectedPetId ?? ''), queryFn: () => getPetTracking(baseUrl, token ?? '', selectedPetId!), enabled: phase === 'idle' && selectedPetId !== null && hasSelectedDevice })` |

**Los dos `useFocusEffect` separados (`:103-107` y `:109-113`) se conservan como
dos**, no se fusionan: son dos efectos con dependencias distintas y fusionarlos
cambiaría cuándo se re-suscribe cada uno. `signOut` de `:150` y `:198` es de
mutación (claim/release): no se toca.

**Test**: `src/screens/pairing/index.test.tsx`.
**Carga**: `:153-154` `pairing-skeleton` visible y
`expect(screen.getAllByTestId(/^pairing-content-skeleton-/)).toHaveLength(3)`.
**Error**: `:178-186` `pairing-error-pets` + `toHaveBeenCalledTimes(2)`.
**Refresco al foco**: `:222-231` — `listPets` de 1 a 2 tras invocar la callback
de foco.
**`signOut` de mutación intacto**: `:411` y `:783`
`await waitFor(() => expect(signOut).toHaveBeenCalledTimes(1))` — si alguien
"limpiara" el `signOut` de las mutaciones creyendo que R5 lo centraliza, estas dos
se romperían. Son la red que protege D2.

### R16 — `src/screens/profile/index.tsx` (`ProfileScreen`)

| Hoy | Mañana |
|---|---|
| `meFn`/`me = useApi(meFn)` (`:101-116`) | `me = useQuery({ queryKey: userKeys.me(), queryFn: () => getMe(baseUrl, token ?? '') })` |
| `petsFn`/`pets = useApi(petsFn)` (`:105-117`) | `pets = useQuery({ queryKey: petKeys.list(), … })` |
| `usePetSelection(pets)` (`:118`) | `usePetSelection({ data: pets.data, isRefreshing: pets.isRefetching })` |
| `detailFn` condicionado; `detail = useApi(detailFn)` (`:109-119`) | `useQuery({ queryKey: petKeys.detail(selectedPetId ?? ''), queryFn: () => getPet(baseUrl, token ?? '', selectedPetId!), enabled: selectedPetId !== null })` |

`useFocusEffect` con `refetchPets()` + `refetchDetail()` (`:123-128`) se conserva.
`signOut` de `:159` (subida de foto) y el botón de `:387` son de mutación /
acción del usuario: **no se tocan**.

**Test**: `src/screens/profile/index.test.tsx`, más
`src/app/(tabs)/__tests__/profile.test.tsx` y
`src/app/(tabs)/__tests__/screens.test.tsx`, que montan la ruta.
**Carga**: `:353-354` `profile-hero-skeleton` y `pet-info-skeleton` visibles.
**Refresco tras mutación**: `:574` `expect(mockGetPet).toHaveBeenCalledTimes(2)`
tras subir la foto.
**Refresco al foco**: `:640-641` — `getPet` en 1, se invoca
`mockUseFocusEffect.mock.calls.at(-1)?.[0]`, y sube.
**`signOut` del botón intacto**: `:322` `expect(mockSignOut).toHaveBeenCalledTimes(1)`.

### R17 — `src/screens/home/index.tsx` (`HomeScreen`)

| Hoy | Mañana |
|---|---|
| `petsFn`/`pets = useApi(petsFn)` (`:152-156`) | `pets = useQuery({ queryKey: petKeys.list(), … })` |
| `usePetSelection(pets)` (`:157`) | `usePetSelection({ data: pets.data, isRefreshing: pets.isRefetching })` |
| `detailFn` condicionado; `detail = useApi(detailFn)` (`:158-179`) | `useQuery({ queryKey: petKeys.detail(selectedPetId ?? ''), …, enabled: selectedPetId !== null })` |
| `activityFn` condicionado; `activity = useApi(activityFn)` (`:165-180`) | `useQuery({ queryKey: activityKeys.daily(selectedPetId ?? ''), …, enabled: selectedPetId !== null })` |
| `remindersFn` condicionado; `reminders = useApi(remindersFn)` (`:172-181`) | `useQuery({ queryKey: reminderKeys.list(selectedPetId ?? ''), …, enabled: selectedPetId !== null })` |

`useFocusEffect` con `refetchPets()` + `refetchDetail()` (`:221-226`) se conserva
**con esas dos y solo esas dos**: `activity` y `reminders` **no** refrescan al
foco hoy y no deben empezar.

**Test**: `src/screens/home/index.test.tsx` (3157 líneas — el fichero de test más
grande del repo y, por volumen de aserciones, la mejor red de seguridad de esta
feature). Su `describe('R10: preserva la mascota durante el refetch')` de `:821`
es uno de los tres que R20 reescribe.

### R18 — `src/app/(tabs)/map.tsx` (`MapScreen`)

| Hoy | Mañana |
|---|---|
| `petsFn`/`pets = useApi(petsFn)` (`:85-89`) | `pets = useQuery({ queryKey: petKeys.list(), … })` |
| `usePetSelection(pets)` (`:90`) | `usePetSelection({ data: pets.data, isRefreshing: pets.isRefetching })` |
| `lastFn` condicionado; `last = useApi(lastFn)` (`:93-114`) | `useQuery({ queryKey: positionKeys.last(selectedPetId ?? ''), …, enabled: selectedPetId !== null })` |
| `positionsFn` condicionado; `positions = useApi(positionsFn)` (`:100-115`) | `useQuery({ queryKey: positionKeys.list(selectedPetId ?? ''), …, enabled: selectedPetId !== null })` |
| `routeFn` condicionado; `route = useApi(routeFn)` (`:107-116`) | `useQuery({ queryKey: tripKeys.dayRoute(selectedPetId ?? ''), …, enabled: selectedPetId !== null })` |

**El `useFocusEffect` de `:149-167` se conserva íntegro**, incluido su
`setInterval(…, POLL_MS)` de 15 s, su guarda
`if (!selectedPetId || lastKind === 'no-tracking') return;` y su
`return () => clearInterval(intervalId)`. **Prohibido sustituirlo por
`refetchInterval`**: `refetchInterval` sondea mientras el componente está montado,
y en un navegador de pestañas el tab de mapa sigue montado al cambiar de pestaña,
así que la app pasaría a pedir posiciones cada 15 s con el mapa invisible.
Alternativa descartada **A6** en [[design]] §8.

`handleLostMode` (`:126-146`) llama `refetchPets()` en la rama `ok`: se conserva.

**Test**: `src/app/(tabs)/__tests__/map.test.tsx` — **la pantalla de más riesgo**.
**Carga**: `:245` y `:271` `map-loading` visible; `:253` su `className` contiene
`flex-1`. **Error**: `:313-318` `map-error` + `toHaveBeenCalledTimes(2)`.
**Sondeo de 15 s**: `:731-733`
`expect(mockGetLastPosition).toHaveBeenCalledTimes(initialLastCalls + 1)`,
`mockListPositions` igual, y `expect(mockGetDayRoute).toHaveBeenCalledTimes(initialRouteCalls)`
**sin sumar** — o sea: el tick refresca posición y posiciones pero **no** la ruta.
Esa tercera línea es la que se rompería si alguien metiera las tres queries en un
`refetchInterval` común. (Nótese que este candado ya está escrito como **delta**,
`initialX + 1`; es el patrón que el resto de esta spec sigue.)

---

### R19 — `use-api` desaparece del árbol

**WHEN** se ejecuta la suite móvil
**THE SYSTEM SHALL** encontrar que `src/hooks/use-api.ts` y
`src/hooks/__tests__/use-api.test.tsx` **no existen**, y que ningún fichero bajo
`mobile-pet-tracker/src/` ni bajo `mobile-pet-tracker/test/` contiene la
subcadena `use-api` ni el identificador `useApi`.

**AND** el `expect(source).not.toContain('use-api')` de
`src/screens/home/weekly-activity-chart.test.tsx:505` **se conserva sin tocar**:
sigue siendo cierto, cuesta cero, y borrarlo sería relajar una aserción existente
(§0.5, y [[design]] §6.2 explica por qué no se re-apunta).

**AND** los seis contratos que hoy prueba `use-api.test.tsx` quedan re-alojados
según la tabla de [[design]] §6.1 — ninguno se pierde en el borrado. Esto es C7 de
`CHECKPOINTS.md`.

**AND** ninguno de los diez ficheros de pantalla contendrá un literal de query key:
la única forma de nombrar un recurso es una factoría de `src/api/query-keys.ts`
(R7). Este barrido vive aquí y no en R7 porque en R7 no había sujeto sobre el que
aseverar.

**Test**: `src/__tests__/design-drift.test.ts::#87 R19: use-api no deja huella` —
cuatro `it`: (a) `existsSync(join(sourceRoot,'hooks','use-api.ts'))` es `false`;
(b) ídem para `hooks/__tests__/use-api.test.tsx`; (c) recorriendo **todos** los
`.ts`/`.tsx` bajo `src/` y bajo `test/` (incluidos los `*.test.*`, al contrario que
`productionSourceFiles`), la lista de ficheros que contienen `use-api` o `useApi`
es igual a `['screens/home/weekly-activity-chart.test.tsx']` — el único
superviviente legítimo, que es el candado de la línea 505; (d) leyendo los diez
ficheros de pantalla, ninguno casa con `/queryKey:\s*\[/` — es decir, cero
literales de clave fuera de `src/api/query-keys.ts`; (e) el recuento de
**llamadas** `signOut(` — con el paréntesis, para que la línea de desestructuración
`const { signOut, token } = useAuth()` no cuente — en cada uno de los diez ficheros
es **exactamente** el de la tabla de [[design]] §6.3, que está escrita como delta
contra `5666b85`: ni una más (ninguna pantalla se copió el `signOut` de lectura) ni
una menos (nadie borró el de una mutación creyendo que R5 lo centralizaba).

### R20 — los tres candados de `usePetSelection` siguen vivos tras la reescritura

**WHEN** se ejecuta la suite móvil
**THE SYSTEM SHALL** contener, en `src/app/(tabs)/__tests__/food.test.tsx`,
`src/app/(tabs)/__tests__/health.test.tsx` y `src/screens/home/index.test.tsx`, un
`it('does not replace a new selection while the stale pet list refreshes', …)` que
afirma `expect(selectPet).not.toHaveBeenCalled()` **sin** usar
`jest.spyOn(apiHooks, 'useApi')`.

**AND** el mecanismo de sustitución será el mismo en los tres, y es **más fuerte**
que el que reemplaza:

1. `mockListPets` resuelve `[existingPet]`; se renderiza con
   `renderWithProviders` y se espera a que la lista esté pintada;
2. `jest.spyOn(selectedPetHooks,'useSelectedPet')` devuelve `selectedPetId:
   'pet-new'` (igual que hoy);
3. `mockListPets.mockReturnValue(pending())` y
   `act(() => { void queryClient.refetchQueries({ queryKey: petKeys.list() }); })`
   deja la query en `isRefetching: true` **con el dato viejo aún en pantalla**;
4. `expect(selectPet).not.toHaveBeenCalled()`;
5. se resuelve la lista con `[existingPet, createdPet]` y se vuelve a afirmar que
   `selectPet` no se llamó.

Esto elimina el truco de `hookCall++ % 4`/`% 3`/`% 2`, que codificaba **cuántas**
llamadas a `useApi` tenía cada pantalla y se habría roto en silencio al añadir una
query. No es una relajación: es la misma aserción sobre estado real del motor en
vez de sobre un doble.

**Requisito de verificación (C4, cuarto y quinto punto).** R20 asevera una
propiedad de tests que R12, R13 y R17 ya dejaron en el árbol, así que **no tiene
rojo natural** y se cierra por la vía **(b) de C4: prueba de mutación**. La
mutación se planta **en producción, no en el doble**, y es exactamente ésta:

> en `src/hooks/use-pet-selection.ts`, borrar la línea
> `if (pets.isRefreshing) return;`

Con esa línea fuera, los tres `it` deben ponerse **rojos por su propia aserción**
(`selectPet` llamado con `'pet-old'`), igual que el `it` homólogo de
`src/hooks/use-pet-selection.test.tsx:94-100`. La mutación se versiona en el
commit rojo y se revierte en el verde, y la evidencia (los tres nombres de test y
el mensaje de fallo) se escribe en `progress/impl_mobile-tanstack-query.md` para
que el `reviewer` la recoja.

**Aviso de zona ciega** (memoria de sesión, #65): plantar la mutación **solo** en
`use-pet-selection.ts` no basta para demostrar que los tres candados de pantalla
miran. Si al plantarla alguno de los tres se quedara **verde**, ese candado está
muerto y hay que arreglarlo antes de seguir — no se justifica con "los otros dos
sí fallan".

---

## Cobertura de los criterios de aceptación

Los nueve criterios de la entrada de #87 en `feature_list.json`, con el R-id que
cierra cada uno. **Dos criterios quedaron desmentidos por §0** y su fila lo dice:
lo que se implementa es la versión corregida, no la literal.

| # | Criterio (resumido) | R-ids |
|---|---|---|
| 1 | `@tanstack/react-query` en `package.json`, `QueryClientProvider` envuelve la app en `_layout.tsx`, y la configuración del `QueryClient` (`staleTime`, `retry`, `refetchOnWindowFocus`) justificada por escrito | **R1**, **R2**, **R4**. Justificación: tabla de R2 (los cinco mandos, no tres) y [[design]] §3 y §5 |
| 2 | «los **diez** consumidores de producción que `useApi` tiene en 5666b85 leen sus datos por TanStack Query; ninguno importa `use-api`» — **corregido por D3 (§0.4): son ONCE.** Los diez llamadores más `src/hooks/use-pet-selection.ts:6`, que importa el **tipo** `ApiResult` sin llamar al hook y que rompería el `typecheck` al borrar el módulo | **R9**–**R18** (los diez llamadores) + **R8** (el undécimo, el importador de tipo) + **R19** (nadie lo importa) |
| 3 | `use-api.ts` y `use-api.test.tsx` borrados, y ningún archivo de `src/` los importa | **R19**. La parte "ningún archivo lo importa" solo es alcanzable gracias a **R8**; ver también D4 (§0.5): el `weekly-activity-chart.test.tsx` **menciona** la cadena sin importarla y se conserva |
| 4 | «el `kind: 'unauthorized'` sigue disparando `signOut` exactamente una vez y desde un único sitio, **no repetido por pantalla**; un test lo fija» — **inaplicable tal cual por D2 (§0.3).** Hoy ya está repetido: 8 ficheros consumidores y 10 llamadas disparadas por `unauthorized`. El requisito real que se implementa es el de **R5**: *un único sitio para el `signOut` del camino de **lectura***, que hoy es `use-api.ts:29` y mañana es `QueryCache.onSuccess`. Las **9 llamadas de mutación repartidas en 7 ficheros** quedan **fuera de alcance** (§Fuera de alcance 1) y no se tocan | **R5** (el sitio único de lectura, con su test) + **R19** (e) (barrido que canda las 9 de mutación como delta contra `5666b85`: ni una más ni una menos) |
| 5 | el comportamiento visible no cambia: carga, error y refresco al foco se conservan por pantalla, y los tests existentes pasan sin relajar aserciones | **R9**–**R18** — cada uno nombra el fichero de test y la **aserción concreta** que se rompería — más **R20** (prueba de mutación de los tres candados reescritos), la «regla de oro» de §Requisitos funcionales, y §Deltas de conducta aceptados, donde se declaran los tres cambios de *cuándo* (nunca de *qué*) que la caché compartida introduce |
| 6 | los candados que la migración mueva se declaran como delta contra 5666b85, nunca como recuento absoluto | **R19** (e) para los `signOut(` por fichero; [[design]] §6.4 para los seis candados numéricos del repo, con delta esperado **0** en los seis, y §6.1 para el saldo de `it` (−6 / +≥7). Verificación de cierre en [[tasks]] §F con `git diff 5666b85` |
| 7 | test por cada R-id que nombre su id, rojo antes que verde (C4) | [[tasks]]: un commit `test(...)` por requisito. R9–R18 tienen rojo real (la aserción de caché); **R20** se declara **requisito de verificación** y se cierra por la vía **(b)** de C4, con la mutación exacta escrita |
| 8 | suite móvil verde, typecheck verde e `init.sh` verde desde la raíz | [[tasks]] §F, con `env -u FORCE_COLOR` (bug #75) y el `pgrep` previo |
| 9 | gate humano: smoke en dev build de Android por las pantallas migradas | §Gate humano, con guion de cinco puntos. **No delegable a IA** |

---

## Fuera de alcance

Cada punto lleva su motivo; ninguno es "no dio tiempo".

1. **Mutaciones (`useMutation`, `MutationCache`).** Las **nueve llamadas de
   mutación repartidas en siete ficheros** que enumera §0.3 se quedan tal cual.
   Meterlas en React Query multiplicaría la superficie de cambio sobre `add-pet` y
   `add-reminder`, que **no** son consumidores de `useApi` y que esta feature no
   debe tocar.
2. **Mover las cinco rutas gordas de `src/app/(tabs)/` a `src/screens/`.**
   Decisión razonada en [[design]] §8 **A1**: es un movimiento de ~1 600 líneas
   ortogonal al cambio de motor, sus tests viven en `src/app/(tabs)/__tests__/` y
   habría que moverlos también, y mezclarlo con la migración haría imposible leer
   el diff de esta feature. **Se declara feature aparte**, con su enunciado ya
   redactado en `progress/spec_mobile-tanstack-query.md` §Seguimiento para que el
   humano lo dé de alta si quiere. Esta feature **no** los mueve **y tampoco los
   empeora**: el `useQuery` se escribe en el mismo sitio donde hoy está el
   `useApi`.
3. **`refetchOnWindowFocus` real vía `AppState` + `focusManager`.** Añadiría
   peticiones que hoy no existen (criterio 5). **A3**.
4. **`refetchOnReconnect` real vía `@react-native-community/netinfo`.**
   Dependencia no autorizada por la entrada de #87. **A4**.
5. **Persistencia de caché en disco** (`@tanstack/query-async-storage-persister`,
   offline-first). Dependencia nueva, y ninguna pantalla la pide.
6. **React Query Devtools.** Paquete aparte y sin utilidad en un dev build.
7. **`suspense` / `throwOnError` / Error Boundaries.** El contrato de kinds hace
   que no haya errores que lanzar (**D1**).
8. **Loaders de Expo Router (`useLoaderData`).** Web-only (§0.6). **A2**.
9. **Cambiar `src/api/`.** La entrada de #87 lo prohíbe explícitamente.
10. **Copy nueva.** #87 no añade ni una clave a `src/i18n/catalog.ts`; el candado
    de longitud de `language-provider.test.tsx:41` no se toca (§0.6).
11. **`src/api/alerts.ts` y la pantalla de alertas.** Son de #78.

---

## Deltas de conducta aceptados

> El criterio 5 dice "el comportamiento visible no cambia". Es **casi** cierto y
> esta spec no va a fingir que lo es del todo: una caché compartida, que es
> literalmente el motivo de la feature, cambia **cuándo** ocurren los estados,
> aunque no **qué** se pinta en cada estado. Los tres deltas están razonados en
> [[design]] §5 y **son parte de lo que el humano firma en el gate**.

| Id | Qué cambia | Dónde se nota | ¿Rompe algún test? |
|---|---|---|---|
| **D-1** | Una pantalla que se desmonta y se vuelve a montar dentro de `gcTime` (5 min) pinta el dato cacheado en vez de su esqueleto, y refresca por detrás | Pantallas de pila: `weight-log`, `meal-schedule`, `docs` al volver a entrar | **No**: cada test recibe un `QueryClient` nuevo (R3) |
| **D-2** | Las 7 pantallas que piden `listPets` comparten una sola petición en vuelo en vez de hacer 7 | Arranque con varias pestañas montadas: menos peticiones | **No**: cada test monta una sola pantalla |
| **D-3** | Un `refetch()` de `['pets','list']` en una pantalla actualiza también las demás pantallas montadas que leen esa clave | Home y Profile, que refrescan `pets` al foco | **No**: mismo motivo |

Ninguno de los tres cambia el JSX, ni un `testID`, ni un `className`, ni el estado
que se pinta para un `kind` dado. Los tres son la razón de ser de #87 y la razón
por la que #78 espera.

---

## Gate humano (no delegable a IA)

Prueba de humo en **dev build de Android** (no Expo Go: `expo-maps` no existe
allí, y el runtime de humo de este repo es el dev build desde 2026-08-27),
recorriendo las ocho pantallas migradas con navegación: **home → mapa → salud →
comida → perfil → recordatorios → docs → pairing**, y además abriendo
**weight-log** y **meal-schedule** desde sus enlaces. Por cada una:

1. los datos cargan (esqueleto → contenido);
2. al salir y volver, se refrescan las que hoy lo hacen (home, mapa, pairing,
   perfil, recordatorios) y **no** aparece un parpadeo de esqueleto donde antes no
   lo había;
3. el mapa sigue moviendo la posición cada ~15 s con la pestaña abierta, y deja de
   hacerlo al cambiar de pestaña;
4. cerrar sesión y volver a entrar **no** muestra datos de la sesión anterior
   (R6);
5. confirmar los tres deltas de la tabla de arriba como aceptables, o rechazarlos.

---

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-10) ← gate obligatorio antes de implementar
