---
feature: "mobile-tanstack-query"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-tanstack-query]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Commits test-primero, obligatorio** (C4 de `CHECKPOINTS.md`): el (1) de cada
> tarea es su propio commit `test(mobile-tanstack-query): … (Rn)` y se empuja en
> **rojo**; el (2) es el commit `feat(...)`/`refactor(...)` que lo pone verde. Un
> solo commit con test + implementación + docs incumple C4 — pasó en #19.
>
> **Cada tarea lleva un bloque `Sujeto`** que dice sobre qué artefacto asevera su
> test y quién lo creó. Ninguna tarea asevera sobre algo que su propio orden no
> haya creado todavía: eso paró #70 y #85. La revisión del orden está al final.
>
> Todas las rutas son relativas a `mobile-pet-tracker/` salvo indicación expresa.

---

## §0 — Antes de la primera tarea

- [ ] Cargar las skills de Expo que la carta exige (`docs/ui-guidelines.md`
      §Skills): **`expo-overview` primero** y, derivada de ella,
      **`expo-data-fetching`** (es el tema exacto de esta feature: React Query,
      caché, y por qué los loaders de Expo Router no aplican). **No** hacen falta
      `expo-native-ui`, `expo-ui` ni `appllama-app-design-skill`: esta feature no
      dibuja nada — no toca un `className`, un `style`, un `testID` ni una clave
      de copy.
- [ ] Leer `docs/ui-guidelines.md` entero de todos modos (gate C8), y
      `docs/conventions.md` §Convenciones de la app móvil.
- [ ] Leer [[requirements]] §0 completo. Cuatro premisas del enunciado de #87 son
      falsas o imprecisas (**D1**–**D4**) y la spec depende de las correcciones.
- [ ] Si existe `mobile-pet-tracker/.expo/types/router.d.ts`, **borrarlo** antes de
      tocar código: está gitignorado, se queda obsoleto y rompe el `typecheck` con
      rutas fantasma. Se regenera solo.
- [ ] Comprobar con `pgrep -af init.sh` que **no hay otro `init.sh` corriendo en
      otro worktree**: comparten el Postgres de docker y se pisan (e2e rojos
      falsos, 2026-09-06).
- [ ] `env -u FORCE_COLOR bash ./init.sh` **verde desde la raíz** antes de
      empezar, para tener la línea base. El `env -u FORCE_COLOR` es obligatorio en
      este VPS mientras el bug **#75** siga abierto.
- [ ] Anotar en `progress/impl_mobile-tanstack-query.md` la línea base: salida de
      `bun run --cwd mobile-pet-tracker test 2>&1 | tail -5` (suites y tests que
      pasan hoy). Se usará al cierre como **delta**, no como recuento absoluto.

---

## R1 — la dependencia queda declarada y fijada

- [ ] (1) Escribir test que falla para R1 — `describe` nuevo **al final** de
      `src/__tests__/design-drift.test.ts`,
      `describe('#87 R1: la dependencia queda declarada y fijada', …)` con los tres
      `it` de R1. Rojo porque `dependencies['@tanstack/react-query']` es
      `undefined`.
- [ ] (2) Implementación mínima que lo pasa — desde `mobile-pet-tracker/`:
      `bunx expo install @tanstack/react-query`; si escribe un rango, corregir a
      `"@tanstack/react-query": "5.102.8"` a mano y re-ejecutar `bun install`.
      Commitear `package.json` **y** `bun.lock`.
- [ ] (3) Refactor con tests verdes. Correr la suite móvil entera: debe seguir
      igual que la línea base de §0 (delta 0).

> **Sujeto**: `package.json`, que ya existe en el árbol. El `describe` se añade a
> un fichero de test que ya existe y no toca ninguno de sus `it` previos.

## R2 — configuración del `QueryClient`

- [ ] (1) Escribir test que falla para R2 — `src/providers/__tests__/query-provider.test.tsx`
      (fichero nuevo), `describe('#87 R2: el QueryClient fija sus cinco mandos', …)`.
      **Antes** de escribirlo, crear `src/providers/query-provider.tsx` exportando
      `export function createQueryClient(): QueryClient { return new QueryClient(); }`
      — sin opciones. Así el rojo es de las aserciones y **no** un `ReferenceError`
      por módulo inexistente (C4, cuarto punto).
- [ ] (2) Implementación mínima que lo pasa — `defaultOptions.queries` con los
      cinco valores exactos de la tabla de R2, y nada más.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: `src/providers/query-provider.tsx`, que esta misma tarea crea en el
> paso (1) como esqueleto. Depende solo de R1 (la librería instalada).

## R3 — helper `renderWithProviders`

- [ ] (1) Escribir test que falla para R3 — `test/__tests__/render-with-providers.test.tsx`
      (fichero nuevo), `describe('#87 R3: el helper monta el QueryClientProvider y
      devuelve su cliente', …)` con los tres `it` de R3 y el componente sonda.
      **Antes**, crear `test/render-with-providers.tsx` exportando un
      `renderWithProviders` que sea un **paso directo** a `render` de
      `@testing-library/react-native`, sin proveedor y sin devolver `queryClient`.
      El rojo es entonces el `No QueryClient set, use QueryClientProvider to set
      one` que lanza `useQuery` al renderizar la sonda, más el `undefined` de
      `result.queryClient` — no un símbolo que falta.
- [ ] (2) Implementación mínima que lo pasa — el helper crea
      `new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })`
      por llamada, envuelve `ui` en `QueryClientProvider` **por fuera** de
      `options.wrapper`, y devuelve `{ ...renderResult, queryClient }`.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: `test/render-with-providers.tsx`, que esta tarea crea como
> pasarela en (1). Va **antes** de R5 a propósito: R5 y R6 necesitan poder
> renderizar una sonda con query, y las diez pantallas necesitan el helper para
> montarse. Depende solo de R1.

## R4 — el proveedor envuelve la app

- [ ] (1) Escribir test que falla para R4 — `describe` nuevo al final de
      `src/app/__tests__/layout.test.tsx`, con los dos `it` de R4. Rojo porque
      `_layout.tsx` todavía no menciona `QueryProvider`.
- [ ] (2) Implementación mínima que lo pasa — exportar `QueryProvider` desde
      `src/providers/query-provider.tsx` con
      `const [client] = useState(() => createQueryClient())`, y montarlo en
      `src/app/_layout.tsx` entre `<AuthProvider>` y `<Stack>`.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: `src/app/_layout.tsx` (existe) y `QueryProvider` de
> `src/providers/query-provider.tsx` (fichero creado en R2; el componente lo añade
> esta tarea). Un proveedor sin consumidores es inocuo: las diez pantallas siguen
> en `useApi` y no lo notan.

## R5 — un único sitio para el `signOut` ante `unauthorized` de lectura

- [ ] (1) Escribir test que falla para R5 — mismo fichero que R2,
      `describe('#87 R5: unauthorized expulsa desde un único sitio', …)`, con
      `useAuth` mockeado y una sonda `useQuery` bajo `<QueryProvider>`. Rojo porque
      `signOut` no se llama.
- [ ] (2) Implementación mínima que lo pasa — `createQueryClient` acepta un
      `onUnauthorized: () => void` y construye
      `new QueryCache({ onSuccess: (data) => { if (isUnauthorized(data)) onUnauthorized(); } })`;
      `QueryProvider` le pasa `() => void signOutRef.current()` con
      `signOutRef` actualizada en cada render.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: `src/providers/query-provider.tsx` (R2) y su `QueryProvider` (R4).
> El `it` (d) —el barrido de los diez ficheros de pantalla— **no se escribe aquí**:
> en este punto las diez siguen en `useApi` y la aserción nacería verde. Se escribe
> en **R19**, con el resto del barrido.

## R6 — la caché se vacía al cerrar sesión

- [ ] (1) Escribir test que falla para R6 — mismo fichero,
      `describe('#87 R6: cerrar sesión vacía la caché', …)`, con los dos `it`.
      Rojo porque el dato sembrado sobrevive al cambio de `status`.
- [ ] (2) Implementación mínima que lo pasa — en `QueryProvider`,
      `useEffect(() => { if (status === 'unauthenticated') client.clear(); }, [status, client])`.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: `QueryProvider` (R4). El test siembra el dato él mismo con
> `setQueryData`, así que no depende de ninguna pantalla migrada.

## R7 — convención de query keys y las catorce claves

- [ ] (1) Escribir test que falla para R7 — `src/api/__tests__/query-keys.test.ts`
      (fichero nuevo), `describe('#87 R7: las claves siguen la convención y no
      colisionan', …)` con los **tres** `it`. **Antes**, crear
      `src/api/query-keys.ts` exportando las diez factorías con
      `throw new Error('not implemented')` en el cuerpo, para que el rojo sea de
      las aserciones (C4, cuarto punto).
- [ ] (2) Implementación mínima que lo pasa — las catorce claves de la tabla de R7,
      `as const` en cada array.
- [ ] (3) Refactor con tests verdes.

> **Sujeto**: `src/api/query-keys.ts`, que esta tarea crea en (1). **El barrido
> "ningún literal de clave en las pantallas" NO va aquí**: en este momento ninguna
> pantalla tiene `queryKey`, así que nacería verde y no candaría nada. Va en R19.

## R8 — `usePetSelection` deja de depender de `ApiResult`

- [ ] (1) Escribir test que falla para R8 — en `src/hooks/use-pet-selection.test.tsx`,
      `describe('#87 R8: usePetSelection acepta la forma mínima y no conoce
      use-api', …)` con sus dos `it`. Rojo por el (a): el fuente del hook **sí**
      contiene `use-api`.
- [ ] (2) Implementación mínima que lo pasa — exportar `PetSelectionSource` desde
      `src/hooks/use-pet-selection.ts`, cambiar la firma, borrar el
      `import type { ApiResult }`. En el **mismo** commit, cambiar el helper
      `petsResult` del propio fichero de test (`:65-74`) para que devuelva
      `PetSelectionSource` en vez de `ApiResult<PetsState>`, y borrar su
      `import type { ApiResult } from './use-api'` (`:10`). Los cuatro `it` del
      `describe('R10: …')` existente **no se tocan**.
- [ ] (3) Refactor con tests verdes. Correr `bun run --cwd mobile-pet-tracker typecheck`:
      las diez pantallas sin migrar deben seguir compilando (pasan variables, no
      literales — [[design]] §4).

> **Sujeto**: `src/hooks/use-pet-selection.ts`, que ya existe. **Va antes que las
> diez pantallas a propósito**: es lo que permite que las dos vías convivan. Si se
> hiciera al final, cada pantalla migrada necesitaría un objeto adaptador temporal
> que luego habría que quitar de diez sitios.

---

## R9–R18 — las diez pantallas, en orden de dificultad creciente

> **Los tres sub-items son idénticos en las diez.** Se escriben una vez aquí y
> cada tarea solo dice qué pantalla es y qué tiene de particular.
>
> - **(1)** `describe('#87 R<n>: <pantalla> lee por TanStack Query', …)` en el
>   fichero de test de la pantalla, con el `it` de caché de [[requirements]]
>   §R9–R18 «Cómo se pone en rojo»: una línea `expect(queryClient.getQueryData(<clave>)).toEqual(<estado>)`
>   por query. **Rojo** porque con `useApi` la caché está vacía. En el mismo
>   commit, cambiar el `render(...)` de **ese `it` nuevo** a `renderWithProviders`.
> - **(2)** Migrar la pantalla: `useApi(fn)` → `useQuery({queryKey, queryFn, enabled?})`
>   según la tabla de su requisito; `usePetSelection(pets)` →
>   `usePetSelection({data: pets.data, isRefreshing: pets.isRefetching})` donde
>   aplique; borrar el `import { useApi }`. En el **mismo** commit, cambiar **todos**
>   los `render(...)` del fichero de test a `renderWithProviders(...)` — sin
>   `QueryClientProvider` el fichero entero lanza `No QueryClient set`.
> - **(3)** Refactor con tests verdes, y correr el fichero de test completo de la
>   pantalla. **Aquí es donde se aplica la regla de oro** de [[requirements]]:
>   si una aserción existente necesita `await waitFor(...)`, se envuelve
>   conservando el valor esperado; si necesitara **cambiar** el valor esperado, se
>   **para** y se anota en `progress/impl_mobile-tanstack-query.md`.

- [ ] **R9 — `screens/docs/index.tsx`.** 2 queries, sin `enabled`, sin foco, sin
      `usePetSelection`. Es la más simple **a propósito**: es donde se descubre si
      el helper, las claves y el proveedor funcionan, con el fichero de test más
      corto del lote (`screens/docs/index.test.tsx`).
- [ ] **R10 — `app/(tabs)/weight-log.tsx`.** 1 query. Ojo a la clave: `limit`
      **`undefined`**. `handleSubmit` conserva su `weights.refetch()` y su
      `signOut` de mutación (`:107`) **no se toca**.
- [ ] **R11 — `app/(tabs)/meal-schedule.tsx`.** 2 queries. `retryAll()` y el
      `plan.refetch()` de `handleGenerate` se conservan literalmente. `signOut` de
      `:100` es de mutación: no se toca.
- [ ] **R12 — `app/(tabs)/food.tsx`.** Primera con `usePetSelection` y primera con
      `enabled`. **Además**: reescribir el `it` de `food.test.tsx:443-482`
      (`does not replace a new selection while the stale pet list refreshes`)
      según el mecanismo de R20, y **borrar** los imports
      `import * as apiHooks from '../../../hooks/use-api'` (`:15`) y
      `import type { ApiResult } …` (`:16`). Sin eso el fichero se cae en cuanto
      `FoodScreen` deja de llamar a `useApi`.
- [ ] **R13 — `app/(tabs)/health.tsx`.** 3 queries. **La del choque de claves**:
      `healthKeys.weights(petId, 1)`, distinta de la de R10. Reescribir también su
      `it` de `health.test.tsx:526-566` y borrar sus dos imports de `use-api`
      (`:20-21`).
- [ ] **R14 — `screens/reminders/index.tsx`.** Primera con `useFocusEffect`. El
      efecto de `:68-70` se conserva **palabra por palabra**. `signOut` de `:100`
      es de mutación.
- [ ] **R15 — `screens/pairing/index.tsx`.** `enabled` de triple condición
      (`phase === 'idle' && selectedPetId !== null && hasSelectedDevice`). **Los dos
      `useFocusEffect` siguen siendo dos**, no se fusionan. Los `signOut` de `:150`
      y `:198` son de mutación y sus tests (`:411`, `:783`) los vigilan.
- [ ] **R16 — `screens/profile/index.tsx`.** 3 queries. **Tres** ficheros de test
      la montan: `screens/profile/index.test.tsx`,
      `app/(tabs)/__tests__/profile.test.tsx` y
      `app/(tabs)/__tests__/screens.test.tsx` — los tres necesitan
      `renderWithProviders`.
- [ ] **R17 — `screens/home/index.tsx`.** 4 queries. Su fichero de test tiene 3 157
      líneas: es la mejor red de seguridad de la feature y también el que más
      `render(...)` hay que convertir. **Además**: reescribir el `it` de
      `home/index.test.tsx:826-869` según R20 y borrar sus dos imports de
      `use-api` (`:21-22`). El `useFocusEffect` conserva `refetchPets` +
      `refetchDetail` y **solo** esos dos: `activity` y `reminders` no refrescan al
      foco hoy.
- [ ] **R18 — `app/(tabs)/map.tsx`.** 4 queries y la de más riesgo. El
      `useFocusEffect` con `setInterval(POLL_MS)` se conserva **íntegro**;
      `refetchInterval` está **prohibido** (A6 de [[design]] §8). Su
      `map.test.tsx:731-733` es el candado del sondeo y ya está escrito como delta
      (`initialX + 1`) — **no** convertirlo en absoluto.

> **Sujeto (las diez)**: cada tarea asevera sobre **su propia pantalla**, que ya
> existe en el árbol, y sobre tres artefactos creados antes en este mismo orden:
> `test/render-with-providers.tsx` (R3), `QueryProvider` montado (R4) y
> `src/api/query-keys.ts` (R7). Las siete que usan `usePetSelection` dependen
> además de R8. Ninguna depende de una pantalla posterior: **no comparten estado
> entre sí**, solo el `QueryClient`, que a estas alturas ya existe.

---

## R19 — `use-api` desaparece del árbol

- [ ] (1) Escribir test que falla para R19 — `describe` nuevo al final de
      `src/__tests__/design-drift.test.ts`,
      `describe('#87 R19: use-api no deja huella', …)` con los cuatro `it`. Rojo
      porque los dos ficheros existen y porque la lista de ficheros que mencionan
      `use-api` todavía tiene más de un elemento.
- [ ] (2) Implementación mínima que lo pasa — `git rm src/hooks/use-api.ts
      src/hooks/__tests__/use-api.test.tsx`.
- [ ] (3) Refactor con tests verdes. **No tocar**
      `src/screens/home/weekly-activity-chart.test.tsx:505`: su
      `expect(source).not.toContain('use-api')` se conserva ([[design]] §6.2).

> **Sujeto**: los diez ficheros de pantalla, ya migrados por R9–R18, y los dos
> ficheros a borrar, que existen desde antes de la feature. El `it` (d) —cero
> literales de `queryKey:` en las pantallas— **necesita** que las diez estén
> migradas, y por eso vive aquí y no en R7.

## R20 — los tres candados de `usePetSelection` siguen vivos

- [ ] (1) **Requisito de verificación** — no tiene rojo natural: los tres `it` ya
      los dejaron verdes R12, R13 y R17. Se cierra por la **vía (b) de C4, prueba
      de mutación**. Commit rojo: borrar la línea
      `if (pets.isRefreshing) return;` de `src/hooks/use-pet-selection.ts` y
      versionar esa mutación. Deben ponerse rojos **los tres** `it`
      (`food.test.tsx`, `health.test.tsx`, `home/index.test.tsx`) **por su propia
      aserción** (`selectPet` llamado con `'pet-old'`), más el `it` homólogo de
      `use-pet-selection.test.tsx:94-100`.
- [ ] (2) Commit verde: revertir la mutación. `git diff` sobre
      `src/hooks/use-pet-selection.ts` queda **vacío** respecto al estado tras R8.
- [ ] (3) Escribir la evidencia en `progress/impl_mobile-tanstack-query.md`: los
      cuatro nombres de test, el mensaje de fallo de cada uno y el hash de los dos
      commits. El `reviewer` la recoge en `progress/review_mobile-tanstack-query.md`.

> **Sujeto**: los tres `it` reescritos por R12, R13 y R17, y el hook de R8. Todos
> existen ya cuando esta tarea corre. **Es la última tarea del cuerpo a
> propósito.**
>
> **Zona ciega** (memoria de sesión, #65): si al plantar la mutación **alguno** de
> los tres se quedara verde, ese candado está muerto. Se arregla ahí mismo; no
> vale justificarlo con "los otros dos sí fallan".

---

## §F — Cierre

- [ ] `bun run --cwd mobile-pet-tracker typecheck` verde.
- [ ] `bun run --cwd mobile-pet-tracker lint` verde.
- [ ] `bun run --cwd mobile-pet-tracker test` verde. Comparar con la línea base de
      §0 y anotar el **delta** de suites y tests (`+N` / `−M`), nunca el absoluto.
- [ ] `pgrep -af init.sh` sin resultados de otro worktree, y luego
      `env -u FORCE_COLOR bash ./init.sh` **verde desde la raíz**.
- [ ] Revisar la tabla de [[design]] §6.4: `git diff 5666b85 --stat` sobre los seis
      ficheros de candado listados debe ser **vacío en sus líneas numéricas**. Si
      alguna cifra se movió, **parar** y anotarlo: significa que la migración se
      salió de su carril.
- [ ] `specs/mobile-tanstack-query/traceability.md` sin filas `pendiente`.
- [ ] `progress/impl_mobile-tanstack-query.md` cerrado, con: la evidencia de
      mutación de R20, el delta de tests, cualquier aserción existente que hubo que
      envolver en `waitFor` (con su fichero y línea), y cualquier cosa que la spec
      no previera.
- [ ] **Parar y avisar al humano** para el smoke de [[requirements]] §Gate humano.
      No delegable a IA.

---

## Revisión final del orden (obligatoria antes del handoff)

Recorrido de las veinte tareas comprobando que ninguna asevera sobre algo que su
propio orden no haya creado todavía:

| Tarea | Asevera sobre | Creado en | ¿Antes? |
|---|---|---|---|
| R1 | `package.json` | pre-existente | ✅ |
| R2 | `createQueryClient` | esqueleto en R2 (1) | ✅ |
| R3 | `renderWithProviders` | pasarela en R3 (1) | ✅ |
| R4 | `_layout.tsx` + `QueryProvider` | pre-existente + R2/R4 | ✅ |
| R5 | `QueryProvider` + sonda propia | R4 | ✅ |
| R6 | `QueryProvider` + dato sembrado por el test | R4 | ✅ |
| R7 | `query-keys.ts` | esqueleto en R7 (1) | ✅ |
| R8 | `use-pet-selection.ts` | pre-existente | ✅ |
| R9–R18 | cada pantalla + helper + claves + provider | pre-existentes + R3, R4, R7, R8 | ✅ |
| R19 | los diez ficheros migrados + los dos a borrar | R9–R18 + pre-existentes | ✅ |
| R20 | los tres `it` reescritos + el hook | R12, R13, R17 + R8 | ✅ |

**Los dos sujetos que se movieron al escribir esta spec, y por qué** — quedan
anotados para que nadie los "arregle" de vuelta:

1. El barrido «ningún literal de `queryKey` en las pantallas» **no** está en R7,
   donde nacería verde porque ninguna pantalla tiene claves todavía. Está en R19.
2. El barrido «ninguna pantalla llama a `signOut` en su camino de lectura»
   **no** está en R5, por el mismo motivo. Está en R19.
