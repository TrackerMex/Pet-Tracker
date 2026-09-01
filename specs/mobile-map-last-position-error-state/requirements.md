---
feature: "mobile-map-last-position-error-state"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-map-last-position-error-state]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D6). Aplican `docs/conventions.md`
> §Convenciones de la app móvil (isla bun, jest-expo, tests que nombran su
> R-id) y `docs/ui-guidelines.md` (carta de UI, gate C8) — en especial §10:
> los estados sin mapa declaran su propio fondo y ningún ancestro de `PetMap`
> gana `bg-*`. Feature de **UI móvil pura**: solo
> `mobile-pet-tracker/src/app/(tabs)/map.tsx` y su test. Cero backend, cero
> dependencias nuevas, cero cambios nativos (solo-JS).
>
> Feature **pequeña**: un helper exhaustivo, una rama JSX nueva, tres gates
> de exclusión y ~7 tests. Si la implementación crece más allá de eso, está
> mal.

## Contexto fijo (no reabrir)

### El defecto

`src/app/(tabs)/map.tsx` no tiene rama para `last.data.kind === 'error'` ni
`'unauthorized'`. `LastPositionState` declara **seis** kinds
(`src/api/positions.ts:4`): `ok`, `no-tracking`, `unauthorized`, `error`,
`unreachable`, `missing-config`. Con `pets` resuelto `ok` con ≥1 mascota y
`getLastPosition` devolviendo `error` (un 500 de
`GET /pets/:id/positions/last`), **ninguna** rama renderiza: pantalla vacía,
blanca incluso en tema oscuro — el vacío se pinta sobre el contenedor de
escena de React Navigation, que usa `DefaultTheme` claro porque la app no
envuelve nada en `ThemeProvider`. Detectado por el reviewer en la
observación 1 de `progress/review_android-map-never-ready_fix1.md`.

### Tres hechos verificados en código (2026-09-01) que cierran las decisiones

1. **El flujo de sesión expirada ya está cableado para Map.**
   `src/hooks/use-api.ts:29` ejecuta `void signOut()` ante **cualquier**
   resultado `kind === 'unauthorized'`, y `src/app/(tabs)/_layout.tsx`
   renderiza `<Redirect href="/login" />` cuando `status` pasa a
   `unauthenticated`. Map usa `useApi` para pets/last/positions/route, así
   que el enrutado a login ya ocurre sin tocar nada. Lo único sin resolver
   son los **píxeles** durante los frames en que `signOut` (async: espera a
   `SecureStore.deleteItemAsync`) aún no volteó el status — y el caso borde
   en que `deleteItemAsync` lanza y el redirect nunca llega. Decisión D1:
   `unauthorized` **comparte la rama de error** (pinta algo en ambos casos,
   cero código de navegación nuevo).
2. **El "rebote" de `unreachable`/`missing-config` vía la rama de pets NO es
   estanco.** `missing-config` sí (mismo `baseUrl` constante para ambos
   fetches), pero `unreachable` puede golpear solo a `last`: pets resuelto
   `ok` en t0, la red se cae, y el poll de 15s (`map.tsx`, `POLL_MS`)
   refetchea `last` → `unreachable` con `pets.data` aún `ok` → hoy, pantalla
   en blanco. Decisión D2: la rama de error de last cubre los **cuatro**
   kinds no renderizables (`error`, `unauthorized`, `unreachable`,
   `missing-config`) — cuesta cero código extra porque el switch exhaustivo
   los tiene que asignar de todos modos.
3. **`tsconfig.json` del móvil tiene `strict: true`**, así que un `switch`
   sin `default` en una función con retorno anotado `: boolean` produce
   error de compilación (TS2366, "Function lacks ending return statement")
   si `LastPositionState` gana un kind nuevo. Ese error ES el mecanismo que
   obliga a decidir la rama de todo kind futuro (D3) — no un comentario, no
   un test que habría que acordarse de ampliar.

### Tabla de ramas (contrato de la pantalla tras esta feature)

Con `petsReady = pets.data?.kind === 'ok' && pets.data.pets.length > 0`:

| # | Rama (testID ancla) | Condición exacta |
|---|---|---|
| B1 | `map-loading` | `pets.data === undefined \|\| (petsReady && last.data === undefined)` |
| B2 | `map-error` (pets) | `pets.data && isPetsError(pets.data)` |
| B3 | `map-no-pets` | `pets.data?.kind === 'ok' && pets.data.pets.length === 0` |
| B4 | `map-no-tracking` | `petsReady && last.data?.kind === 'no-tracking'` |
| B5 | `map-last-error-state` (**nueva**) | `petsReady && last.data && isLastError(last.data)` |
| B6 | mapa (`map-view`) | `petsReady && last.data?.kind === 'ok'` |

**Mutuamente excluyentes** (B2 vs B4/B5/B6 hoy pueden coexistir apiladas si
pets cae con `last.data` retenido — el gate `petsReady` en B4/B5/B6 lo
elimina) y **totales**: todo par (`PetsState` resuelto, `LastPositionState`
resuelto o pendiente) renderiza exactamente una rama. `isLastError` reparte
los seis kinds de `LastPositionState` de forma exhaustiva:
`ok`/`no-tracking` → falso (B6/B4), los otros cuatro → verdadero (B5).

## Requisitos funcionales

- **R1**: WHEN `pets` resuelve `ok` con ≥1 mascota AND `getLastPosition`
  resuelve `{ kind: 'error' }` THE SYSTEM SHALL renderizar la rama B5 — una
  `View` `testID="map-last-error-state"` con clases exactas
  `flex-1 items-center justify-center gap-3 p-6 bg-background`, que contiene
  un `Text` `testID="map-last-error"` `selectable` con clase `text-danger` y
  texto `Something went wrong`, y un `Button` de heroui-native
  `testID="map-last-retry"` con label `Retry` cuyo `onPress` es
  `refetchLast` — AND SHALL NOT montar `PetMap`
  (`queryByTestId('map-view')` nulo) ni la rama de error de pets
  (`queryByTestId('map-error')` nulo), AND WHEN el usuario pulsa
  `map-last-retry` con el siguiente `getLastPosition` resolviendo `ok` THE
  SYSTEM SHALL volver a montar el mapa (`map-view` visible) tras ≥2 llamadas
  a `getLastPosition`. Patrón, textos y jerarquía: los mismos de la rama de
  error de pets (`map.tsx:180-189`); el `selectable` viene de la micro-regla
  de la carta ("`<Text selectable />` en mensajes de error").
  *Tests (los tres en `src/app/(tabs)/__tests__/map.test.tsx`, archivo
  COMPARTIDO → describe con sufijo de feature, regla H5 del review de #44):*
  - `R1 (mobile-map-last-position-error-state): rama de error de last` →
    `muestra mensaje y Retry cuando last devuelve error`
  - `... → Retry llama al refetch de last y recupera el mapa`
    (`mockGetLastPosition.mockResolvedValueOnce({ kind: 'error' })
    .mockResolvedValue({ kind: 'ok', position: makeLastPosition() })`)
  - `... → la rama pinta bg-background y screen-map sigue sin fondo`
    (`getByTestId('map-last-error-state').props.className` contiene
    `bg-background`; `getByTestId('screen-map').props.className` NO contiene
    `bg-` — pin de `docs/ui-guidelines.md` §10, regla que cerró #54)

- **R2**: WHEN `getLastPosition` resuelve `{ kind: 'unauthorized' }` con
  `pets` resuelto `ok` con ≥1 mascota THE SYSTEM SHALL renderizar la misma
  rama B5 (`map-last-error` visible) AND el flujo de sesión expirada
  existente SHALL dispararse sin código nuevo en `map.tsx`: el `signOut` de
  `useAuth` es invocado (por `use-api.ts:29`, ya existente) y en producción
  `(tabs)/_layout.tsx` redirige a `/login`. La rama es lo que se pinta
  durante los frames del sign-out en vuelo — y lo que queda visible (con
  Retry) si `SecureStore.deleteItemAsync` fallara y el redirect no llegara.
  *Test: describe
  `R2 (mobile-map-last-position-error-state): unauthorized de last` → it
  `comparte la rama de error y dispara el signOut de sesión expirada` — se
  captura un `signOut = jest.fn()` propio vía `mockUseAuth.mockReturnValue`
  y se assertea `map-last-error` visible AND `signOut` llamado.*

- **R3**: THE SYSTEM SHALL garantizar cobertura total y exclusión mutua de
  las ramas B1–B6:
  - (a) `map.tsx` SHALL contener un helper `isLastError(state:
    LastPositionState): boolean` implementado como `switch (state.kind)` SIN
    `default` y con retorno anotado `: boolean`, con los seis kinds
    asignados (`ok`, `no-tracking` → `false`; `error`, `unauthorized`,
    `unreachable`, `missing-config` → `true`), de modo que añadir un kind a
    `LastPositionState` rompa `bun run typecheck` (TS2366) hasta decidir su
    rama. *Sin test de runtime posible: lo verifica el reviewer leyendo
    `map.tsx` (switch sin `default`, retorno anotado) + `bun run typecheck`
    verde.*
  - (b) WHEN `getLastPosition` resuelve `unreachable` o `missing-config` con
    pets `ok` y ≥1 mascota THE SYSTEM SHALL renderizar B5 con el mismo
    Retry funcional. *Test: it.each sobre
    `[{ kind: 'unreachable', message: 'network down' },
    { kind: 'missing-config' }]` → `muestra la rama de error y reintenta con
    $kind` (tras Retry con `ok`, `map-view` visible).*
  - (c) WHILE `pets.data` es un kind de error AND `last.data` retiene un
    valor resuelto (p. ej. `ok`) THE SYSTEM SHALL renderizar SOLO la rama de
    error de pets: `map-error` visible, `map-view` nulo, `map-last-error`
    nulo — gates `petsReady` en B4, B5 y B6. *Test: it `solo la rama de
    error de pets renderiza cuando pets cae con last resuelto` — secuencia:
    `mockListPets.mockResolvedValueOnce({ kind: 'ok', pets: [makePet()] })
    .mockResolvedValue({ kind: 'unreachable', message: 'network down' })`,
    last `ok`, `setLostMode` resuelve `ok`; render → `map-view` visible →
    press `lost-mode-button` (su handler llama `refetchPets`) → esperar
    `map-error` visible → assertear `map-view` y `map-last-error` nulos.*

- **R4**: WHEN `listPets` resuelve `{ kind: 'unauthorized' }` THE SYSTEM
  SHALL renderizar la rama de error de pets B2 (`map-error` + `map-retry`
  visibles) AND `signOut` SHALL ser invocado (mismo flujo que R2) AND
  `getLastPosition` SHALL NOT ser llamado (sin selección de mascota no hay
  fetch de last). Es el mismo defecto una línea al lado: hoy
  `isPetsError` (`map.tsx:18-20`) excluye `unauthorized` y ese kind de pets
  también deja la pantalla en blanco hasta el redirect. `isPetsError` pasa
  al mismo patrón de switch exhaustivo de R3(a) sobre `PetsState`
  (`src/api/pets.ts:4`: `ok` → `false`; `unauthorized`, `error`,
  `unreachable`, `missing-config` → `true`).
  *Test: describe
  `R4 (mobile-map-last-position-error-state): unauthorized de pets` → it
  `renderiza la rama de error de pets y dispara signOut`.*

- **R5**: WHEN se cierra la feature THE SYSTEM SHALL dejar la contención
  verificable:
  - **Allowlist**: el diff de la branch SHALL tocar SOLO
    `mobile-pet-tracker/src/app/(tabs)/map.tsx`,
    `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx`,
    `specs/mobile-map-last-position-error-state/**` (solo `traceability.md`
    y las casillas de `tasks.md`),
    `progress/impl_mobile-map-last-position-error-state.md` (nuevo) y
    `feature_list.json`. AND `src/components/pet-map.tsx`,
    `src/hooks/use-api.ts`, `src/providers/auth-provider.tsx`,
    `src/app/(tabs)/_layout.tsx`, `src/api/positions.ts`, `src/api/pets.ts`,
    `progress/current.md`, `package.json` y `bun.lock` SHALL quedar con
    **cero líneas de diff**.
  - En `map.test.tsx` SHALL haber solo **adiciones**: ningún test existente
    modificado ni borrado (la suite pasa de 32 a ~39 tests).
  - Grep-clean de la carta (§Decisiones fijas 3): cero hex, cero clases
    arbitrarias `[...]`, cero `StyleSheet.create` en el diff.
  - WHEN se ejecutan `bun run test -- 'src/app/(tabs)/__tests__/map.test.tsx'
    --runInBand`, `bun run typecheck` y `bun run lint` (desde
    `mobile-pet-tracker/`) y `./init.sh` (desde la raíz) THE SYSTEM SHALL
    salir con exit 0 y todas las suites previas verdes.
  *Sin test propio (patrón R5 de #57): el implementer registra comandos,
  salidas y `git diff --stat main...HEAD` en
  `progress/impl_mobile-map-last-position-error-state.md`; el reviewer los
  re-ejecuta y valida la allowlist.*

## Verificación humana en dispositivo

**No hay gate de smoke humano en esta feature.** Justificación: el cambio es
solo-JS; la rama nueva es una `View` plana con `bg-background`, el mismo
patrón que las tres ramas sin mapa ya verificadas en dispositivo en #54; y
los kinds se fuerzan con mocks de Jest — reproducir un 500 de
`/positions/last` en dispositivo exige manipular el backend.

Chequeo manual **opcional** (si el humano quiere verlo): con el **dev build
de Android** ya instalado (nunca Expo Go; Fast Refresh basta, sin prebuild),
mapa en pantalla, matar el backend local y esperar el poll de 15s → debe
aparecer "Something went wrong" + Retry **pintado sobre fondo del tema**
(no blanco en tema oscuro); levantar el backend y pulsar Retry → el mapa
vuelve. No condiciona el cierre.

## Fuera de alcance

- **Envolver la app en `ThemeProvider` / tematizar el contenedor de escena
  de React Navigation**: arreglaría el *color* del vacío, no el vacío. El
  patrón del repo (§10 de la carta) es el contrario: cada estado sin mapa
  pinta su propio fondo. Si algún día se tematiza el contenedor, es otra
  feature.
- **UX dedicada de sesión expirada** (pantalla propia, toast, mensaje
  "Session expired"): el enrutado ya lo hace `useApi` + `Redirect`; una UI
  dedicada añadiría código para unos frames. Ver [[design]] §Alternativas.
- **Tocar `use-api.ts`, `auth-provider.tsx`, `(tabs)/_layout.tsx`,
  `pet-map.tsx` o la capa `src/api/`**: el fix vive entero en la pantalla.
- **Reintento automático adicional** (backoff, spinner de reintento): el
  poll de 15s con foco ya reintenta `last` solo; Retry es el camino manual.
- **Replicar B5 en otras pantallas**: home/health/etc. ya renderizan sus
  estados de error; el agujero era exclusivo de Map (más el `unauthorized`
  de pets que R4 cierra en esta misma pantalla).
- **Cambiar kinds o mensajes de la capa API** (`positions.ts`, `pets.ts`):
  los seis kinds quedan como están; la pantalla decide, la API no cambia.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
