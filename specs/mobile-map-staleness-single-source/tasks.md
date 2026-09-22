---
feature: "mobile-map-staleness-single-source"
status: approved           # draft | spec_ready | approved
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
>
> ⚠️ **Lee §Enmienda E1 (R9) y §Enmienda E2 (R10), al final de este fichero,
> antes de empezar.** E2 añade **R10** tras el rechazo de la ronda 1 y fija el
> baseline vigente (5 suites, **136** tests en `5a5f7fd3`).
>
> ⚠️ **Lee §Enmienda E1 (R9), al final de este fichero, antes de empezar.**
> Precisa las tareas de **R1**, **R2** y **R6** —la tabla se escribe con
> `{ labelKey }`, y el delta de `ui-copy-table.ts` viaja dentro de sus commits
> verdes— y añade la tarea **R9**. Sin eso, R2 y R6 dejan rojo el candado de
> copy de #65 y ningún commit vuelve a verde.

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

---

## Enmienda E1 — R9 y las precisiones a R1, R2 y R6

> Añadida el 2026-09-21 sobre la spec aprobada. Contexto completo, inventario
> fila a fila y casilla de firma en [[requirements]] §Enmienda E1; la decisión
> de forma, en [[design]] §D8. **Prevalece sobre el cuerpo aprobado de R1, R2 y
> R6 en lo que aquí se precisa, y en nada más.**

### Baseline corregido (sustituye al de §Antes de empezar)

Son **5 suites**, no 3 — el de arriba se dejaba fuera los dos ficheros del
candado de #65:

```bash
cd mobile-pet-tracker
bunx jest --runTestsByPath \
  'src/app/(tabs)/__tests__/map.test.tsx' \
  'src/utils/device-connectivity.test.ts' \
  'src/__tests__/design-drift.test.ts' \
  'src/__tests__/ui-language.test.ts' \
  'src/__tests__/ui-copy-table.ts'
```

Esperado en `914905b8`: **5 suites, 120 tests, verde, exit 0**. Comprueba el
**5**: `(tabs)` sin escapar salta ficheros en silencio con exit 0. Usa este
comando en cada paso rojo/verde de aquí en adelante, no el de 3 suites.

### Precisión a R1 — la tabla se escribe con `{ labelKey }`

En **R1 paso (1)**, las cinco aserciones llevan `.labelKey`:
`MAP_CONNECTION_LABEL_KEY[deviceConnectionState(makeDevice('online'))].labelKey`
→ `'map.live'`, y así las demás. La de exhaustividad
(`Object.keys(...).sort()`) **no cambia**.

En **R1 paso (2)**, el tipo es
`Record<DeviceConnectionState, { labelKey: TranslationKey }>` y los valores son
`{ labelKey: 'map.live' }`, `{ labelKey: 'map.stale' }` y
`{ labelKey: 'map.noSignal' }` (este último dos veces: `none` y `unknown`).
Es la misma anatomía que `DEVICE_CONNECTIVITY_META` ya tiene en `:6-12` de ese
fichero — colócala al lado y no inventes otra.

R1 **sigue quedando verde por sí solo**: añadir `labelKey: 'map.live'` en un
fichero que aún no tiene fila en la tabla no rompe nada, porque `checkUses`
solo recorre las filas que existen; nunca busca usos sin registrar.

### Precisión a R2 — el delta de `R4_MAP` viaja en su commit verde

En **R2 paso (2)**, en cuanto se borren los `t('map.live')`, `t('map.stale')` y
`t('map.noSignal')` de `map.tsx`, el candado de #65 se pone rojo por sus tres
filas. **Ese rojo es legítimo y esperado**, pero no puede sobrevivir al commit:
en el **mismo commit verde de R2** se aplica el delta de la tabla, así que:

- `src/__tests__/ui-copy-table.ts:103`, `:104` y `:105` — **se borran** las tres
  filas de `map.tsx`.
- `src/__tests__/ui-copy-table.ts`, al final de `R10_PAIRING` (tras `:377`) —
  se añaden **cuatro** filas de `src/utils/device-connectivity.ts`:
  `map.live` ×1, `map.stale` ×1, `map.noSignal` **×2**.
- `src/__tests__/ui-language.test.ts:126` — `toHaveLength(20)` → **`(17)`**; el
  título de `:125` pasa a `'resuelve las 17 ocurrencias normativas'`.
- `src/__tests__/ui-language.test.ts:168` — `toHaveLength(42 + 2 + 1)` →
  **`(42 + 2 + 1 + 4)`**, con el comentario
  `// +4 #94 E1: la tabla del Mapa comparte el util`. Término nombrado, nunca
  una cifra recalculada a mano.

En **R2 paso (3)**, las **5** suites en verde.

### Precisión a R6 — la sustitución de fila viaja en su commit verde

En **R6 paso (2)**, al cambiar `t('map.gps')` por `t('pairing.connection')` en
`map.tsx:352`, la fila `map.gps` de `ui-copy-table.ts:119` caduca. En el mismo
commit verde se **sustituye 1:1** por
`{ file: 'src/app/(tabs)/map.tsx', key: 'pairing.connection' }`.

Sustitución 1:1 ⇒ **`R4_MAP` se queda en 17 y el `toHaveLength(17)` de
`ui-language.test.ts:126` NO se vuelve a tocar.** La fila de
`pairing.connection` que ya existe para `pairing/index.tsx`
(`ui-copy-table.ts:366`) **no se toca**: `checkUses` indexa por par (fichero,
clave) y son filas distintas.

Si D2 se hubiera rechazado, esta precisión decaería con R6; **está firmada**
(`[[design]]:102`), así que se aplica.

### R9 — El candado de copy de #65 sigue verde con la tabla al día

*Sujeto*: R2 y R6 ya dejaron `map.tsx` y `device-connectivity.ts` en su forma
final; sin ellos no hay nada que inventariar. Por eso R9 va **después de R6**.

> **Requisito de verificación con rojo real, no por mutación** (a diferencia de
> R5): su test ya existe desde #65 y su rojo lo produce el código de producción
> de R2 y R6. No hace falta plantar nada.

- [ ] **(1) Rojo observado, no fabricado.** Antes de aplicar los deltas de las
      precisiones de arriba, corre las 5 suites y **guarda la salida roja** de
      `ui-language.test.ts` en los cuatro pares (fichero, clave) afectados:
      `map.live`, `map.stale`, `map.noSignal` y `map.gps`, todos con
      `uses: 0` frente a `uses: 1` esperado. Es la evidencia de que el candado
      estaba vivo y de que esta feature lo habría roto en silencio.
- [ ] **(2) Verde.** Aplicar el inventario completo de [[requirements]]
      §Enmienda E1 (las dos tablas). Recuento final: `R4_MAP` **17** filas,
      `R10_PAIRING` **49**, `ALL_USES` se recalcula solo.
- [ ] **(3) Refactor con tests verdes.** Las 5 suites en verde. Comprueba
      **una por una** que estas tres líneas siguen **sin tocar**:
      `ui-language.test.ts:438` (`SCREEN_FILES`, `19 + 2 + 1`),
      `ui-copy-table.ts:449-451` (suma de los doce bloques) y
      `src/i18n/catalog.ts` (delta de i18n **cero**). Si te descubres editando
      cualquiera de las tres, **para**: algo se desvió de la enmienda.

### Cierre — adenda de E1

Al §Cierre se le suma: `git diff --stat` contra `origin/main` no debe tocar
`src/i18n/catalog.ts` ni `src/providers/__tests__/language-provider.test.tsx`
(son de #98), y sí debe tocar `src/__tests__/ui-copy-table.ts` y
`src/__tests__/ui-language.test.ts` (no son de #98).

---

## Enmienda E2 — R10: el inventario de lecturas de `staleSeconds`

> Añadida el 2026-09-21 tras el **RECHAZO** de la primera revisión. Contexto,
> tabla declarada, prueba de fuego y casilla de firma en [[requirements]]
> §Enmienda E2; la decisión de forma, en [[design]] §D9. **No modifica ninguna
> tarea anterior**: R1-R9 quedan tal cual, y R5 conserva sus dos aserciones.

### Antes: dos cosas que NO son de esta tarea

1. **H1 lo arregla Codex aparte.** Revertir `design-drift.test.ts:33-35` a
   `return /\.tsx?$/.test(entry.name) ? [path] : [];` es la corrección del
   bloqueante y va en su propio commit. R10 **no depende de ella ni la
   sustituye**.
2. **H3 no se corrige**, solo se anota: `map.test.tsx:238` pasó de `await
   renderWithProviders(…)` a `return renderWithProviders(…)`. El reviewer lo
   midió equivalente.

### Baseline vigente (sustituye al de E1)

Medido sobre la punta de la ronda 1 (`5a5f7fd3`), sin pipe:

```bash
cd mobile-pet-tracker
bunx jest --runTestsByPath \
  'src/app/(tabs)/__tests__/map.test.tsx' \
  'src/utils/device-connectivity.test.ts' \
  'src/__tests__/design-drift.test.ts' \
  'src/__tests__/ui-language.test.ts' \
  'src/__tests__/ui-copy-table.ts'
```

→ **5 suites, 136 tests, verde, exit 0**. `design-drift.test.ts` sola: **39**.
Tras R10: **137** y **40**. Comprueba el **5** de suites en cada corrida.

### R10 — La antigüedad de la posición se lee en un solo sitio

*Sujeto*: `map.tsx` ya está en su forma final desde R2 y R4 (una sola lectura,
la de `fmtAgo`), así que hay un inventario real que declarar. R10 va **después
de R9** y es lo último automático antes del gate humano de R8.

> **Requisito de verificación, vía (b) de C4**: el candado se añade sobre código
> **ya correcto** —el hueco es la ausencia de test, no un defecto—, así que el
> rojo legítimo es la **mutación de producción**, versionada en el commit rojo y
> revertida en el verde. Mutar un doble de test no vale.

- [ ] **(1) Rojo por mutación — la prueba de fuego literal de H2.** Escribir en
      `mobile-pet-tracker/src/__tests__/design-drift.test.ts`, **después** del
      `describe` de `#94 R5` (`:488-500`) y **sin tocarlo**:
      `describe('#94 R10: la antigüedad de la posición se lee en un solo sitio', ...)`
      con **un** `it` que:
      - declare la tabla junto al `describe`, con el idioma que el fichero ya usa
        en `:409` (`const screenSignOutCalls: Record<string, number>`):
        `{ 'api/types.ts': 1, 'app/(tabs)/map.tsx': 1 }`;
      - construya el observado **escaneando todos los fuentes de producción**,
        no solo los declarados: `allTypeScriptFiles(sourceRoot)` (`:39-49`,
        **reutilizado sin tocarlo**) + un `.filter()` **local** que descarte las
        carpetas `__tests__/` y los `*.test.ts(x)` colocados;
      - cuente con `(contents.match(/\bstaleSeconds\b/g) ?? []).length` —con
        frontera de palabra, a diferencia del `split` de `:480`— y se quede solo
        con los ficheros de recuento ≥ 1;
      - compare con `toEqual(…)` contra la tabla.

      En el **mismo commit rojo**, versionar la mutación de H2 en
      `src/app/(tabs)/map.tsx`, junto a `const updated = …` (`:207`):

      ```ts
      const positionAge = position?.staleSeconds ?? 0;
      const isFresh = positionAge <= 120;
      ```

      y guardar la salida de

      ```bash
      cd mobile-pet-tracker
      bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts'
      ```

      **sin pipe**. Tiene que salir **roja por la aserción de `#94 R10`**, con
      `'app/(tabs)/map.tsx'` en **2** frente al **1** declarado — y **no** por
      ninguna aserción de `#94 R5`, que con esta mutación sigue verde: esa
      diferencia **es** el hallazgo H2 y hay que dejarla por escrito.
- [ ] **(1-bis) Segunda mutación, zona ciega.** Revertir la de `map.tsx` y mudar
      el umbral a un fichero que la tabla **no nombra** —por ejemplo
      `src/utils/device-connectivity.ts`, con un
      `const FRESH_LIMIT = (s: number) => s <= 120;` que lea `staleSeconds`—.
      Tiene que salir roja por **clave inesperada**, no por recuento. Guardar la
      salida: demuestra que el inventario caza la mudanza, no solo el alias.
- [ ] **(2) Verde.** Revertir las dos mutaciones. `git diff` vacío respecto del
      estado tras R9, `design-drift.test.ts` en **40** y las 5 suites en
      **137**, verde.
- [ ] **(3) Refactor con tests verdes.** Comprobar **una por una** que estas
      líneas siguen **sin tocar**: `design-drift.test.ts:25-37` (`sourceFiles`,
      el helper compartido de H1 — si te descubres editándolo, **para**, es el
      motivo exacto del rechazo de la ronda 1), `:39-49`
      (`allTypeScriptFiles`), `:488-500` (`#94 R5` y sus dos aserciones) y
      `src/api/types.ts` (se **nombra** en la tabla, no se edita: es de #98).
      Escribir las dos salidas rojas y el `git diff` vacío en
      `progress/impl_mobile-map-staleness-single-source.md`.
