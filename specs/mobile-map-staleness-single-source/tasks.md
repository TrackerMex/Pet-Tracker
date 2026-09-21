---
feature: "mobile-map-staleness-single-source"
status: spec_ready        # draft | spec_ready | approved
tags: [harness, spec, mobile, ui]
---

# Tareas — [[mobile-map-staleness-single-source]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Commits test-primero, obligatorio.** El historial tiene que enseñar
> rojo → verde por requisito. Un commit con implementación + tests + docs
> incumple C4 de `CHECKPOINTS.md` y el reviewer lo rechaza. Formato:
> `feat(mobile-map-staleness): <desc> (R2)`.
>
> **Este orden tiene sujeto presente**: ningún R-id asevera sobre nodos, mocks
> o estados que su propio orden no haya creado ya. Léelo de arriba abajo y no
> lo reordenes.

## Antes de empezar (una vez)

- [ ] Borrar `mobile-pet-tracker/.expo/types/router.d.ts` si existe (gitignorado,
      rompe el typecheck con rutas fantasma).
- [ ] Cargar las skills de Expo: `expo-overview` → `expo-data-fetching` (la query
      nueva de TanStack Query) y `expo-native-ui` (el tile). Obligatorio por
      `docs/ui-guidelines.md` §Skills.
- [ ] Leer [[design]] §D7 antes de tocar `map.test.tsx`: su `jest.mock` de
      `'../../../api/pets'` es una factory exhaustiva y romperla tumba las 49
      pruebas del fichero, no solo las del badge.
- [ ] Baseline verde, **sin pipe**, y comprobando que jest imprime **3 suites**:

  ```bash
  cd mobile-pet-tracker
  bunx jest --runTestsByPath \
    'src/app/(tabs)/__tests__/map.test.tsx' \
    'src/utils/device-connectivity.test.ts' \
    'src/__tests__/design-drift.test.ts'
  ```

  Esperado en `914905b8`: 3 suites, 94 tests, verde.

---

## R1 — La etiqueta del tile del Mapa sale de la función compartida

*Sujeto*: ninguno previo. Esta tarea **crea** `MAP_CONNECTION_LABEL_KEY`, que es
lo único sobre lo que asevera.

- [ ] **(1) Test rojo.** En
      `mobile-pet-tracker/src/utils/device-connectivity.test.ts`, añadir
      `describe('#94 R1: el tile de conexión del Mapa se decide en un solo sitio', ...)`
      con estas aserciones, **todas conducidas a través de
      `deviceConnectionState(...)`** y ninguna escribiendo un estado literal
      (esa es la propiedad que cierra la discrepancia con la Home):
      - `MAP_CONNECTION_LABEL_KEY[deviceConnectionState(makeDevice('online'))]` → `'map.live'`
      - `MAP_CONNECTION_LABEL_KEY[deviceConnectionState(makeDevice('offline'))]` → `'map.stale'`
      - `MAP_CONNECTION_LABEL_KEY[deviceConnectionState(makeDevice(null))]` → `'map.noSignal'`
      - `MAP_CONNECTION_LABEL_KEY[deviceConnectionState(makeDevice('LTE'))]` → `'map.noSignal'`
        (valor de proveedor desconocido: cae en `unknown`, no inventa estado)
      - `MAP_CONNECTION_LABEL_KEY[deviceConnectionState(null)]` → `'map.noSignal'`
        (sin collar)
      - exhaustividad: `Object.keys(MAP_CONNECTION_LABEL_KEY).sort()` →
        `['none', 'offline', 'online', 'unknown']`
      Reutiliza el `makeDevice` que ese fichero **ya tiene** en `:7-15`; no
      escribas uno nuevo. No toques los dos describes existentes (`R16: ...` y
      `#73 R6: ...`).
      **El rojo legítimo aquí es que falta el export de producción** (la tabla
      no existe todavía). Eso es TDD normal: la prohibición de C4 es sobre
      *helpers de test* ausentes, no sobre el símbolo de producción que la tarea
      va a escribir.
- [ ] **(2) Implementación mínima.** En
      `mobile-pet-tracker/src/utils/device-connectivity.ts`, añadir
      `export const MAP_CONNECTION_LABEL_KEY: Record<DeviceConnectionState, TranslationKey>`
      con el reparto de R1. **No** modificar `deviceConnectionState`,
      `connectivityLabelKey` ni `DEVICE_CONNECTIVITY_META`.
- [ ] **(3) Refactor con tests verdes.** `device-connectivity.test.ts` debe
      pasar de 8 a 13 tests, todos verdes, y los 8 viejos sin editar.

---

## R2 — El badge del Mapa lee `device.connectivity`, no `staleSeconds`

*Sujeto*: `MAP_CONNECTION_LABEL_KEY` ya existe (R1). Esta tarea crea el mock de
`getPet`, el factory `makeDevice` local y la query del detalle **antes** de
aseverar sobre `stat-gps`.

- [ ] **(1) Test rojo.** En
      `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx`, en este orden:
      1. **Andamiaje** (sin esto el fichero entero revienta — [[design]] §D7):
         import de `getPet` y `type PetState` (`:11-16`), import de
         `type DeviceStatus` (`:29-34`), `getPet: jest.fn()` en la factory
         (`:47-50`), `const mockGetPet = jest.mocked(getPet);` (`:108-115`),
         factory local `makeDevice(connectivity: string | null): DeviceStatus`
         junto a `makePet`, que ocupa `:117-145`, con la forma real de
         `src/api/types.ts:44-50`), y en el `beforeEach` (`:229-244`) el defecto
         `mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet({ device: makeDevice('online') }) })`.
      2. **Deltas de casos existentes**, exactamente como los declara [[design]]
         §Delta de `map.test.tsx`: `:581` retitulado
         `'#94 R2: la antigüedad de la posición ya no mueve el tile de conexión'`,
         `:600-601` con el valor nuevo `'En vivo'`; `:660` retitulado
         `'#94 R2: sin collar el tile de conexión dice Sin señal'` con
         `mockGetPet` resolviendo `device: null` y conservando `'Sin señal'`
         en `:676` y `'—'` en `:678`; `:1235` con su quinta aserción de clave y
         el título `'deja sus cinco recursos en las claves canónicas'`.
      3. **Casos nuevos**, `describe('#94 R2: el tile de conexión sigue al collar', ...)`,
         los cuatro con el **mismo** `makeLastPosition({ staleSeconds: 15 })`
         para que la antigüedad no pueda explicar la diferencia:
         `makeDevice('online')` → `'En vivo'`; `makeDevice('offline')` →
         `'Desactualizado'`; `makeDevice(null)` → `'Sin señal'`;
         `device: null` con una posición presente → `'Sin señal'`.
         Añade el caso que hoy es imposible: `position: null` con
         `makeDevice('online')` → `stat-gps` `'En vivo'` y `stat-updated` `'—'`.
      **Esperas**: ancla el `waitFor` al mismo nodo que luego aseveras
      (`screen.getByTestId('stat-gps')`), nunca a la caché de Query ni a un
      contador de mock — `docs/conventions.md` §Esperas sobre el árbol
      renderizado.
- [ ] **(2) Implementación mínima.** En
      `mobile-pet-tracker/src/app/(tabs)/map.tsx`: importar `getPet`,
      `deviceConnectionState` y `MAP_CONNECTION_LABEL_KEY`; añadir el `useQuery`
      con `queryKey: petKeys.detail(selectedPetId ?? '')`,
      `queryFn: () => getPet(baseUrl, token ?? '', selectedPetId!)` y
      `enabled: selectedPetId !== null`; reescribir `const gps` (`:192-197`)
      para que salga del detalle; **borrar `const STALE_SECONDS = 120;` de
      `:76`** y su uso en `:195`. `POLL_MS` (`:77`) se queda: es cadencia, no
      umbral. `:191` (`updated`) **no se toca**.
- [ ] **(3) Refactor con tests verdes.** Los 3 ficheros de test del baseline en
      verde. Confirma que `map.test.tsx` no perdió ningún caso.

---

## R3 — Sin detalle resuelto, el tile dice `'—'`

*Sujeto*: la query del detalle y el `const gps` nuevo ya existen (R2).

- [ ] **(1) Test rojo.** En `map.test.tsx`,
      `describe('#94 R3: sin detalle el tile de conexión cae al guion', ...)`:
      - detalle **pendiente** (`mockGetPet.mockReturnValue(pending<PetState>())`,
        reutilizando el helper `pending` que el fichero ya tiene en `:195-197`)
        → `stat-gps` con `'—'`, y `stat-speed`/`stat-distance` visibles para
        anclar la espera a un nodo positivo del mismo escenario.
      - detalle **en error** (`mockGetPet.mockResolvedValue({ kind: 'error' })`)
        → `stat-gps` con `'—'`.
- [ ] **(2) Implementación mínima.** La caída a `'—'` en `const gps` de
      `map.tsx`, con el mismo guion literal que la pantalla ya usa en
      `fmtKm`/`fmtSpeed` (`map.tsx:53-59`).
- [ ] **(3) Refactor con tests verdes.**

---

## R4 — La antigüedad sigue siendo la antigüedad

*Sujeto*: el badge ya sale del detalle (R2) y el tile de antigüedad nunca se
tocó. Esta tarea asevera que **los dos conviven diciendo cosas distintas**.

- [ ] **(1) Test rojo.** En `map.test.tsx`,
      `describe('#94 R4: la antigüedad y la conexión son datos independientes', ...)`:
      un solo caso con `makeDevice('online')` y
      `makeLastPosition({ staleSeconds: 121 })` que asevera **en la misma
      prueba** `stat-gps` → `'En vivo'` **y** `stat-updated` → `'hace 2 min'`.
      Es el caso del hecho 4: collar hablando, fix viejo.
      Si tras R2 este caso ya saliera verde de entrada, **no lo declares
      cerrado**: trátalo como candado sobre código correcto y ciérralo por
      mutación de producción igual que R5 — cambia en `map.tsx` el `updated`
      para que salga del detalle, comprueba el rojo por esta aserción,
      revierte, y escribe la evidencia.
- [ ] **(2) Implementación mínima.** Normalmente ninguna: R2 ya dejó `:191`
      intacto. Si hace falta, la mínima para que la prueba pase.
- [ ] **(3) Refactor con tests verdes.**

---

## R5 — Ninguna constante de umbral sobrevive en el móvil

> **Requisito de verificación declarado** ([[requirements]] §Requisito de
> verificación, vía **(b)**). Solo asevera una propiedad de lo que R2 ya dejó en
> el árbol, así que su cierre se prueba por **mutación de producción**,
> versionada en el commit rojo y revertida en el verde. Mutar un doble de test
> no vale (C4, quinto punto).

*Sujeto*: `STALE_SECONDS` ya está borrado (R2), así que el grep tiene algo que
verificar.

- [ ] **(1) Rojo por mutación, sitio 1.** Añadir en
      `mobile-pet-tracker/src/__tests__/design-drift.test.ts` el
      `describe('#94 R5: el umbral de frescura no vive en el móvil', ...)` usando
      el helper `filesMatching` que el fichero ya tiene en `:55-59` (solo mira
      fuentes de producción: excluye `__tests__/` y los `*.test.*` colocados).
      Asevera `[]` para un patrón que cace **las tres formas**: el identificador
      `STALE_SECONDS`, `staleSeconds <op> algo` y `algo <op> staleSeconds`, con
      `<op>` en `< <= > >=`. Cuidado: `fmtAgo(position.staleSeconds, t)` debe
      seguir permitido — el candado prohíbe **comparar**, no leer.
      En el **mismo commit rojo**, versionar la mutación en
      `mobile-pet-tracker/src/app/(tabs)/map.tsx`: reintroducir
      `const STALE_SECONDS = 120;` y una comparación
      `position.staleSeconds <= STALE_SECONDS`. Guardar la salida roja: tiene
      que fallar **por la aserción de `#94 R5`**, no por otro test.
- [ ] **(1-bis) Rojo por mutación, sitio 2 — zona ciega.** Revertir la mutación
      de `map.tsx` y plantar **solo** `const STALE_SECONDS = 120;` en
      `mobile-pet-tracker/src/utils/device-connectivity.ts`, un fichero que el
      candado no tiene por qué estar mirando. Guardar la segunda salida roja.
      Un candado que solo falla donde nació no es un candado.
- [ ] **(2) Verde.** Revertir las dos mutaciones. `git diff` vacío respecto del
      estado tras R4, y los 3 ficheros del baseline en verde.
- [ ] **(3) Refactor con tests verdes.** Escribir las dos salidas rojas y el
      `git diff` vacío en
      `progress/impl_mobile-map-staleness-single-source.md`. Sin esa evidencia
      el reviewer no puede cerrar C4.

---

## R6 — El tile se rotula "Conexión", no "GPS"

> **Solo si D2 se firmó** ([[design]] §Decisiones abiertas). Si el humano la
> rechazó, salta esta tarea entera y marca la fila R6 de [[traceability]] como
> "retirada por D2 rechazada".

*Sujeto*: el tile ya reporta la conexión (R2), así que el rótulo tiene algo que
describir.

- [ ] **(1) Test rojo.** En `map.test.tsx`,
      `describe('#94 R6: el tile de conexión se rotula como en Pairing', ...)`:
      `screen.getByText('Conexión')` visible y `screen.queryByText('GPS')` nulo,
      anclando primero la aserción de ausencia a la aparición del nodo positivo
      (`docs/conventions.md` §Esperas). En el mismo commit, el delta de
      `:1172`: `screen.getByText('GPS')` → `screen.getByText('Conexión')`. Las
      otras tres etiquetas (`'Velocidad'`, `'Distancia'`, `'Actualizado'`) y el
      recuento de cuatro tiles **no se tocan**.
- [ ] **(2) Implementación mínima.** En `map.tsx:352`, `t('map.gps')` →
      `t('pairing.connection')`. **No se añade ninguna clave al catálogo**:
      `pairing.connection` ya existe en los dos idiomas
      (`src/i18n/catalog.ts:288` y `:598`). Si te descubres editando
      `src/i18n/catalog.ts`, **para**: algo se desvió de la spec.
- [ ] **(3) Refactor con tests verdes.** Deja `'map.gps'` en el catálogo aunque
      quede sin uso: borrarla es un delta de catálogo y lo lleva #98.

---

## R7 — El detalle se refresca con el poll que ya existe

*Sujeto*: la query del detalle existe (R2), y el `useFocusEffect` con
`POLL_MS` existe desde antes.

- [ ] **(1) Test rojo.** En `map.test.tsx`,
      `describe('#94 R7: el poll refresca también el detalle', ...)`, siguiendo
      el patrón de temporizadores falsos que el propio fichero ya usa en
      `describe('R9: polling con foco')` (`:682`) — léelo antes de escribir el
      tuyo, no lo calques de otra suite. Asevera que tras avanzar `POLL_MS`,
      `mockGetPet` se ha llamado de nuevo con `(apiUrl, 'jwt-token', 'pet-1')`,
      y que **el badge cambia en pantalla** cuando la segunda resolución trae
      `makeDevice('offline')`: ancla el `waitFor` al texto de `stat-gps`, no al
      contador del mock.
- [ ] **(2) Implementación mínima.** Añadir `refetchDetail()` dentro del
      `setInterval(..., POLL_MS)` de `map.tsx:140-158`, junto a `refetchLast()`
      y `refetchPositions()`, y sumar `refetchDetail` a las dependencias del
      `useCallback`. **No** crear un segundo temporizador ni añadir
      `refetchInterval` a la query ([[design]] §D6). El guardarraíl
      `if (!selectedPetId || lastKind === 'no-tracking') return;` se conserva.
- [ ] **(3) Refactor con tests verdes.**

---

## R8 — Gate humano: smoke en dev build de Android

> **No delegable a ninguna IA.** Ni Claude ni Codex corren esto. El humano lo
> ejecuta y firma la casilla de [[requirements]] §Aprobación.

- [ ] **(1)** Instalar la rama en un **dev build de Android**. **Nunca Expo Go**:
      `expo-maps` no existe ahí (`docs/ui-guidelines.md` §Animación), así que el
      Mapa ni siquiera arranca.
- [ ] **(2)** Con el **poller de posiciones parado** (para que `staleSeconds`
      crezca sin que llegue posición nueva): abrir la Home con una mascota con
      collar, anotar el texto de la píldora del hero; pasar a la pestaña Mapa,
      anotar el texto del tile de conexión. Esperar a que el collar cruce los
      120 s de silencio y comprobar que **las dos pantallas cambian de estado a
      la vez**, sin recargar la app.
- [ ] **(3)** Comprobar de paso el caso que D3 hace visible: con el collar
      hablando y el fix viejo, el Mapa dice "En vivo" en el tile de conexión y
      "hace N min" en el de antigüedad. Es lo esperado, no un defecto.
- [ ] **(4)** Firmar la casilla "Aprobado por humano" y anotar el resultado en
      `progress/impl_mobile-map-staleness-single-source.md`.

---

## Cierre

- [ ] `bunx jest` completo en `mobile-pet-tracker/` verde (no solo los 3
      ficheros dirigidos). `bunx tsc --noEmit` verde.
- [ ] `./init.sh` verde **sin pipe** — y solo cuando ninguna otra sesión lo esté
      corriendo: LocalStack y Postgres son compartidos entre worktrees.
- [ ] `specs/mobile-map-staleness-single-source/traceability.md` sin ninguna fila
      "pendiente".
- [ ] `git diff --stat` contra `origin/main`: cero ficheros bajo
      `backend-pet-tracker/`, y ninguno de la lista de [[requirements]]
      §Ficheros que esta feature NO toca.
