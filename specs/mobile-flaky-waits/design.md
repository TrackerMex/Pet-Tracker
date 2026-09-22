---
feature: "mobile-flaky-waits"
status: draft        # draft | approved
tags: [harness, spec, mobile, tests]
---

# Diseño — [[mobile-flaky-waits]] (#111)

> Ver [[requirements]] para los requisitos y [[tasks]] para el orden TDD.
>
> **Capas**: esta feature no toca `backend-pet-tracker/` ni `infra/`, así que
> `docs/architecture.md` (domain / application / infrastructure) **no aplica**.
> Todo el trabajo vive en **dos ficheros de test** de `mobile-pet-tracker/`. No se
> escribe ni se modifica código de producción, ni de forma permanente ni
> transitoria (a diferencia de #72, cuyas mutaciones sí eran de producción).
>
> **Precedente que se calca**: [[../mobile-add-pet-photo-test-flake/design|#72 §D2]].
> Las formas de corrección **no se inventan aquí**.

---

## Tabla fichero → cambio → R-ids

| Fichero | Cambio | R-ids |
|---|---|---|
| `mobile-pet-tracker/src/screens/health/index.test.tsx` | Viga de 200 ms **permanente** en `shows the current weight and opens the weight log` + la espera pasa a terminar en `weight-current` | R1 |
| `mobile-pet-tracker/src/screens/health/index.test.tsx` | S2: tres aserciones de llamada se mueven dentro del `waitFor` de `keeps API order and selects the first pet by default` | R2 |
| `mobile-pet-tracker/src/screens/map/index.test.tsx` | S3, S5, S6: aserciones de `polylines` y de tiles se mueven dentro de su `waitFor` | R2 |
| `mobile-pet-tracker/src/screens/map/index.test.tsx` | S4: ancla positiva `stat-distance = '0.0 km'` antes de la aserción de `polylines` vacías | R2 |
| `mobile-pet-tracker/src/screens/map/index.test.tsx` | S7: la espera pasa del contador de `mockSetLostMode` al `disabled: true` del botón; la aserción de contador queda detrás | R2 |
| `mobile-pet-tracker/src/screens/map/index.test.tsx` | **Sin cambios** en `:284-299` (`selects the first pet and loads its first position (#72 R2)`) | R3 |
| `mobile-pet-tracker/package.json` | **Sin cambios.** La entrada #111 lo listaba en `files_affected`; el diseño lo saca, con la razón en R4 | R4 |
| `mobile-pet-tracker/src/screens/health/index.tsx`, `src/screens/map/index.tsx` y todo lo demás bajo `mobile-pet-tracker/` | **Sin cambios** | R5 |
| `progress/impl_mobile-flaky-waits.md` | Reporte con la evidencia del §Protocolo M y del §Protocolo V | R2, R6 |

---

## D1 — El mapa de fuentes asíncronas, que es lo que decide cada sitio

Un sitio es defecto solo si la espera y la aserción leen **fuentes que resuelven
por separado** ([[requirements]] §F4). Este es el mapa, verificado contra la fuente
en HEAD `69a763f3`.

### `HealthScreen` (`src/screens/health/index.tsx`)

| Nodo | Condición de render | Fuente |
|---|---|---|
| `weight-card`, `weight-card-title` (`Peso`), `weight-log-link` | `selectedPetId` a secas (`:215-218`) | query **`pets`** |
| `weight-current`, `weight-variation` | `weight.data?.kind === 'ok' && weight.data.weights.length > 0` (`:226-229`, `:236-239`) | query **`weights`** |
| `weight-card-empty` | `kind === 'ok' && length === 0` (`:250-254`) | query **`weights`** |
| `weight-card-error` | `kind === 'error' \|\| 'unreachable'` (`:256-260`) | query **`weights`** |

De aquí sale R1: `weight-card` es **estrictamente más débil** que `weight-current`,
y el puente entre los dos es una query distinta.

### `MapScreen` (`src/screens/map/index.tsx`) — cinco queries, cuatro tiles

| Nodo / prop | De dónde sale | Valor **mientras la fuente está pendiente** |
|---|---|---|
| `map-view` (existe), `map-stats` (existe) | gate `petsReady && last.data?.kind === 'ok'` (`:269`) | no se pintan |
| `map-view.props.cameraPosition`, `.markers` | `last` (`:180-188`) | — (es el gate) |
| `map-view.props.polylines` | **`route`** (`:189-198`) | **`[]`** ← indistinguible del caso "sin viajes" y del caso "ruta en error" |
| `map-view.props.colorScheme` | `useUniwind()` | síncrono, mismo commit |
| `stat-speed` | **`positions`** (`:199-202`) | `'—'` ← indistinguible de `items: []` |
| `stat-distance` | **`route`** (`:203-206`) | `'—'`; con `route` `ok` y `trips: []` → **`'0.0 km'`** |
| `stat-updated` | `last` (`:207`) | — (es el gate) |
| `stat-gps` | **`detail`** (`getPet`, `:208-214`) | `'—'` |

Dos consecuencias que gobiernan toda la tabla de R2:

1. **`stat-distance = '0.0 km'` es el único indicador positivo de que `route`
   resolvió `ok`.** Por eso es el ancla de S4.
2. **`polylines = []`, `stat-speed = '—'` y `stat-gps = '—'` son valores de
   "pendiente".** Aseverarlos sin ancla es aseverar algo que ya es cierto antes de
   que pase nada: pasa por el motivo equivocado. Es el mismo defecto que la
   convención nombra para las aserciones de ausencia, aplicado a un valor por
   defecto en vez de a un nodo que falta.

---

## D2 — Las tres formas de corrección (calcadas de #72 §D2)

No se inventa ninguna forma nueva. Son estas tres, y cada sitio de R2 dice cuál usa:

- **(F-a) Mover la aserción dentro del `waitFor`.** Para aserciones **positivas**
  cuyo valor esperado **no** coincide con el valor de "pendiente". `waitFor`
  reintenta el bloque entero, así que el conjunto de aserciones no se debilita: solo
  se evalúa en un punto en el que ya puede ser cierto. Sitios: S2, S3, S5, S6.
- **(F-b) Ancla positiva + aserción detrás.** Para aserciones cuyo valor esperado
  **sí** coincide con el de "pendiente" (ausencia, `[]`, `'—'`). El ancla es una
  espera sobre un nodo que **distingue de verdad** el estado final. Sitio: S4.
- **(F-c) La condición de parada pasa del mock al árbol, y la aserción de contador
  queda detrás.** Para el sub-patrón de #72 R2. La aserción de contador es monótona
  y es contrato, así que detrás de la espera de árbol no se debilita (#72 §D2,
  literal). Sitio: S7.

**Lo que no se usa, y por qué:**

- **`findByTestId` en lugar de mover la aserción.** #72 §D2 lo admite como
  equivalente de (F-a), pero solo cierra *la aparición del nodo*, no *su contenido*.
  En los seis sitios de R2 lo que puede ir tarde es el **contenido** (`'12.3 km/h'`,
  `polylines`, `'0.0 km'`), no la existencia del nodo. `findByTestId` no cerraría el
  hueco. Se descarta explícitamente para que nadie lo "simplifique" después.
- **Cambiar los fixtures** para que una fuente resuelva y así el árbol distinga.
  Cambia lo que el test prueba. Prohibido por la regla dura de R2.
- **`act()` extra, `await Promise.resolve()`, `flushPromises`.** Alargan el camino
  sin cambiar cuál es la condición de parada: es la misma clase de tapadera que
  subir un plazo.

---

## D3 — Inventario completo de los dos ficheros, con veredicto por sitio

Este es el inventario del criterio "no arregles solo el que falló". Se listan
**todos** los sitios donde una aserción sigue a un `waitFor` fuera de él. Veredicto
**CAMBIA** o **NO** con su razón. El `reviewer` puede recorrerlo entero.

### `src/screens/health/index.test.tsx` (28 tests)

| `it` (L HEAD `69a763f3`) | Espera → aserción posterior | Veredicto |
|---|---|---|
| `:457` `shows the current weight and opens the weight log` | `weight-card` (`pets`) → `weight-current`, `weight-variation` (`weights`) | **CAMBIA — R1**. El defecto reproducido |
| `:248` `keeps API order and selects the first pet by default` | `pet-chip-*` seleccionado → llamadas a `listVaccines`/`listWeights` | **CAMBIA — S2**. El render esperado es el que **habilita** esas queries: las llamadas son posteriores |
| `:218` `shows and retries a $kind pet-list error` | `health-empty` → `mockListPets` 2 veces | **NO**. `health-empty` solo se pinta tras resolver la **segunda** llamada: está causalmente implicada |
| `:276` `selects a pressed pet and reloads its health records` | — | **NO**. Árbol y contadores ya están **dentro** del mismo `waitFor` (`:286-299`). Es la forma correcta, y sirve de precedente en el fichero para S2 |
| `:316` `shows a skeleton while vaccines are pending` | skeleton → `vaccines-section`, texto `Vacunas` | **NO**. Las aserciones son **más débiles** (el contenedor del nodo esperado) |
| `:328` `highlights the nearest future dose and keeps row order` | `next-vaccine-card` → hijos de ese nodo y `vaccine-row-*` | **NO**. Mismo commit, misma query `vaccines` |
| `:355` `re-resolves the syringe token when a mounted tab changes theme` | `next-vaccine-card` → estilo de los iconos | **NO**. Mismo commit; el segundo bloque va tras un `rerender` explícito |
| `:378` `omits the next card when every dose is past or null` | `vaccine-row-vaccine-1` → `next-vaccine-card` es `null` | **NO**. Ausencia **ya anclada** a una espera positiva del mismo escenario |
| `:395` `marks an overdue next-dose date with the danger token` | `vaccine-row-vaccine-1` → `className` del texto | **NO**. Mismo commit |
| `:422` `shows and retries a $kind vaccine error` | `vaccines-empty` → `mockListVaccines` 2 veces | **NO**. Implicada, como `:218` |
| `:475` `formats variation %p as %s` | — | **NO**. La aserción **es** la condición de parada. Ya correcto |
| `:492` `shows the empty state and keeps the log link` | `weight-card-empty` (`weights`) → `weight-log-link` | **NO**. `weight-log-link` es hermano dentro de la misma `Card` y su condición es **más débil** (`pets`): si el hijo está, el enlace está |
| `:505` `shows a $kind weight error and keeps the log link` | `weight-card-error` → `weight-log-link` | **NO**. Igual que `:492` |
| `:538` `does not replace a new selection while the stale pet list refreshes` | `queryClient.isFetching(...)` → `pet-chip-pet-old` visible | **NO en #111** — es el sub-patrón **estrecho** de #72, pero la aserción es de **persistencia** de un nodo ya anclado en `:553` con `findByTestId`. Anotado en §Fuera de alcance |
| `:605` `la fila de enlace al weight log llega a 44 pt…` | `weight-log-link` → `hitSlop` del **mismo nodo** | **NO** |
| `:638`, `:648` | sin `waitFor` (usan `findByTestId` o leen la caché tras `await`) | **NO** |

### `src/screens/map/index.test.tsx` (58 tests)

| `it` (L HEAD `69a763f3`) | Espera → aserción posterior | Veredicto |
|---|---|---|
| `:483` `pasa una polyline mapeada por cada viaje` | `map-view` (`last`) → `polylines` (`route`) | **CAMBIA — S3** (F-a) |
| `:521` `pasa un array vacío para un día sin viajes` | `map-view` (`last`) → `polylines` `[]` (`route`) | **CAMBIA — S4** (F-b). `[]` es el valor de pendiente |
| `:564` `uses the latest speed, trip total, fresh age, and live GPS` | `stat-speed` (`positions`) → `stat-distance` (`route`), `stat-gps` (`detail`) | **CAMBIA — S5** (F-a) |
| `:601` `#94 R2: la antigüedad de la posición ya no mueve el tile de conexión` | `stat-gps` (`detail`) → `stat-distance` `'0.0 km'` (`route`) | **CAMBIA — S6** (F-a) |
| `:821` `posts the inverse, disables in flight, and refetches the new label` | contador de `mockSetLostMode` → `disabled: true` del botón | **CAMBIA — S7** (F-c) |
| `:284` `selects the first pet and loads its first position (#72 R2)` | contador de `mockGetLastPosition`, **sin** aserción posterior | **NO — R3**, decidido y firmado en #72 S6 |
| `:534` `conserva marker y stats con ruta $kind` | `map-view` → `polylines` `[]` y `stat-distance` `'—'` | **NO**. **Candado tautológico**: no existe nodo que distinga ruta-en-error de ruta-pendiente. §Fuera de alcance |
| `:316`, `:350`, `:1062`, `:1087`, `:1436` | positivo → aserciones de **ausencia** | **NO**. Ya ancladas, que es la forma que la convención exige |
| `:330`, `:975`, `:1037`, `:1484` | árbol → contador de mock ≥ N | **NO**. El cambio de árbol esperado **es** el efecto de esas llamadas: implicadas |
| `:373`, `:387`, `:413`, `:434`, `:457`, `:464`, `:909`, `:959`, `:994`, `:1111` | nodo → `props`/`className` del **mismo** nodo | **NO**. Mismo commit |
| `:800`, `:888` | `lost-mode-button` visible → texto y estado del mismo nodo (query `pets`) | **NO**. Misma fuente |
| `:678`, `:1415` | `stat-gps` (`detail`) → `stat-updated` (`last`) | **NO**. `last` es el **gate** de `map-stats`: ya resolvió antes de que el tile exista |
| `:1158`, `:1178` | `stat-speed` visible → los otros tiles **visibles** y sus rótulos | **NO**. Visibilidad y rótulos son del mismo commit; no se asevera contenido de otra query |
| `:1314` `muestra En vivo aunque después falte la posición` | `stat-updated` `'—'` → `stat-gps` `'En vivo'` | **NO**. `'En vivo'` ya se esperó en `:1322`; la aserción es de **persistencia** tras el `setQueryData` |
| `:1391` `muestra el guion mientras el detalle está pendiente` | `stat-speed` visible → `stat-gps` `'—'` | **NO en #111**. Asevera el valor de pendiente a propósito. Anotado como aserción débil en §Fuera de alcance |
| `:731` `polls position APIs every 15 seconds…` | `map-view.props.markers` → contadores tras avanzar timers | **NO**. Los contadores **son** el sujeto del test, y el avance de timers es explícito |
| `:1012` `comparte la rama de error y dispara el signOut` | `map-last-error` → `signOut` llamado | **NO**. El `signOut` lo dispara el mismo `onUnauthorized` que produce el estado de error esperado |

---

## Protocolo M — cómo se demuestra que el arreglo arregla (C4)

Esto es lo que Codex tiene que **hacer y commitear**. La forma es la viga de #72
§D1, trasladada: allí se ensanchaba la ventana **retrasando la notificación** de
query-core; aquí se ensancha **retrasando la resolución de la fuente tardía**, que
es donde vive el hueco de #111.

**Forma de la viga** (intención, no literal — se adapta al `beforeEach` de cada
describe, que es lo que arma cada mock; ver la advertencia al final):

> sustituir el `mockResolvedValue(X)` de **la fuente tardía** del sitio por un
> `mockImplementation` que devuelve una promesa que resuelve `X` a los **200 ms**
> con el `setTimeout` del runtime.

Por qué **200 ms** y no otro número: se deriva de las constantes reales de RNTL
—`DEFAULT_INTERVAL = 50` ms (`dist/wait-for.js`) y `asyncUtilTimeout = 1000` ms
(`dist/config.js:15`)— con **`50 < 200 < 1000`**: el primer sondeo cae mucho antes
de la resolución (rojo determinista con el código actual) y la espera corregida
conserva 5× de holgura (verde determinista). **Si con 200 ms un sitio no diera
rojo, se amplía la ventana y se anota el valor; nunca se relaja la aserción.**

**Ninguno de los dos ficheros usa fake timers en los describes afectados**
(verificado: `health/index.test.tsx` no tiene **ninguna** llamada a
`useFakeTimers`, y las únicas de `map/index.test.tsx` están en `:706` y `:1452`,
dentro de los dos describes de polling —`R9: polling con foco` en `:704` y
`#94 R7: el poll refresca también el detalle` en `:1450`, ambos con
`jest.useRealTimers()` en su `afterEach`—, y **ninguno de los siete sitios cae
ahí**).
La viga es de reloj real y no hay que avanzar nada.

| Sitio | Fuente tardía a la que se pone la viga | Rojo esperado **sin** la corrección | Verde esperado **con** la corrección |
|---|---|---|---|
| **R1** | `mockListWeights` | `Unable to find an element with testID: weight-current` en la línea de la aserción | pasa |
| **S2** | `mockListVaccines` y `mockListWeights` | `Number of calls: 0` en la primera aserción de llamada | pasa |
| **S3** | `mockGetDayRoute` | `polylines` recibido `[]` contra el array esperado | pasa |
| **S5** | `mockGetDayRoute` | `stat-distance` recibido `'—'` contra `'2.0 km'` | pasa |
| **S6** | `mockGetDayRoute` | `stat-distance` recibido `'—'` contra `'0.0 km'` | pasa |
| **S7** | (no hace falta viga: basta quitar el `await` de la resolución) — ver abajo | — | — |

**S4 y la prueba de zona ciega.** S4 no tiene rojo por retraso: su aserción
(`polylines` `[]`) **pasa igual** con la fuente pendiente, que es justo el defecto.
Se demuestra al revés, y es lo que hay que registrar:

1. Viga de 200 ms en `mockGetDayRoute` **y** su payload cambiado a
   `trips: [makeTrip()]` (una ruta **no vacía**).
2. Con eso, el test **actual** —`waitFor(map-view)` y luego `polylines` `[]`—
   **pasa**. Ese paso es la prueba de que el candado está **ciego**: afirma un
   array vacío leyendo antes de que llegue uno lleno.
3. El test **corregido** —anclado a `stat-distance = '0.0 km'`— **falla** con ese
   mismo payload, porque la distancia ya no es cero. El candado ve lo que antes no
   veía.
4. Se revierten payload y viga; con el payload real (`trips: []`) el test corregido
   pasa.

Las dos mitades, con su salida literal, van a
`progress/impl_mobile-flaky-waits.md`. Es el mismo método de "zona ciega" que #72
usó para S3/S4/S5.

**S7** no necesita viga: hoy el test hace `fireEvent.press(...)` **sin `await`**
(`:842`) y espera al contador; la demostración es que, con la corrección, la
condición de parada pasa a ser el `disabled: true`, que es lo que el test dice
probar ("disables in flight"). Se registra la corrida del fichero antes y después.

### Qué commitea Codex, exactamente

- **Commit rojo de R1** (vía C4 **(a)**): **solo la viga** en
  `shows the current weight and opens the weight log`, el cuerpo del test intacto.
  Tiene que quedar rojo en el historial, y rojo **por su propia aserción**, no por
  un `ReferenceError`.
- **Commit verde de R1**: la corrección de la espera. **La viga se queda.**
- **Commits de R2**: un commit por sitio o uno por fichero, a elección, pero
  **ninguna viga de R2 sobrevive**. Las vigas de R2 se ponen y se quitan **en el
  working tree**, no en la historia; lo que se commitea es la corrección. Su
  evidencia es el reporte.
- **Commit de docs**: `progress/impl_mobile-flaky-waits.md` con las salidas del
  Protocolo M y del Protocolo V, y `specs/mobile-flaky-waits/traceability.md`
  relleno.

Formato de mensaje (`docs/conventions.md` §Commits), con scope `mobile-flaky-waits`:
`test(mobile-flaky-waits): <desc> (R1)`.

**Advertencia sobre prescribir mocks al pie de la letra** (lección ya pagada en
#73): la forma de arriba es **intención**. Antes de escribirla, Codex verifica cómo
arma ese mock el `beforeEach` del describe concreto —`jest.clearAllMocks()` **no**
borra implementaciones, así que un `mockImplementation` puede filtrarse al test
siguiente si ese test no rearma con `mockResolvedValue`—. En los siete sitios cada
test rearma su propio mock, pero **se comprueba, no se supone**.

---

## Protocolo V — la verificación de R6

Todo desde `/home/claude/sites/Pet-Tracker-wt-ui/mobile-pet-tracker`, con **`bun` /
`bunx`, nunca `npx` ni `npm i -g`**.

**Ningún comando de medida lleva pipe.** `cmd | tail` devuelve el código de `tail`:
se redirige a fichero y se lee `$?` a continuación.

**Antes de tocar código**: `rm -f .expo/types/router.d.ts` — ese fichero está
gitignorado y rompe el typecheck con rutas fantasma.

**V0 — consistencia interna del recuento** (en lugar de fiarlo todo a una cifra que
caduca):

```
bunx jest --listTests > /tmp/v0-listtests.txt; echo "exit=$?"
wc -l < /tmp/v0-listtests.txt      # = S
```

En cada corrida de V2 la línea `Test Suites: … N total` debe cumplir **`N == S`**.
Es el detector de ficheros saltados en silencio.

**V1 — los dos ficheros aislados, antes y después**:

```
bunx jest --runTestsByPath src/screens/health/index.test.tsx src/screens/map/index.test.tsx > /tmp/v1.txt 2>&1; echo "exit=$?"
```

Medido en este árbol el 2026-09-22 (base `73f14d5e` + `69a763f3`), exit 0:
`Test Suites: 2 passed` · `Tests: 86 passed` — es decir **28 de health + 58 de
map**, que es la cifra por fichero del gate. **Tiene que seguir siendo 86 después.**

`--runTestsByPath` trata sus argumentos como **rutas**, así que aquí no hay nada que
escapar. Si en algún momento se filtra **posicionalmente** un fichero bajo
`src/app/(tabs)/`, eso **es una regex**: hay que escribir `'src/app/\(tabs\)/…'` o
el fichero se salta **en silencio con exit 0**
(`docs/conventions.md` §Filtros de jest con rutas que llevan paréntesis).

**V2 — suite móvil completa, cinco corridas consecutivas, sin pipe**:

```
for i in 1 2 3 4 5; do
  rm -rf /tmp/jest_ru/perf-cache-*
  bun run --cwd /home/claude/sites/Pet-Tracker-wt-ui/mobile-pet-tracker test > /tmp/v2-run-$i.log 2>&1
  echo "run $i exit=$?"
done
```

Se borra `perf-cache-*` antes de cada corrida a propósito: el sequencer de jest
programa **primero** el fichero que falló en la corrida anterior, y eso convierte la
segunda corrida en el control más favorable posible en vez de en una repetición
independiente (lección de #72 §F3).

**Criterio de "arreglado"** (los cuatro a la vez):

1. **5 de 5** corridas con exit 0.
2. En las cinco, `Test Suites: … N total` con **`N == S`** (V0).
3. **`Test Suites: 77 passed` · `Tests: 1396 passed`**, idéntico a la base
   `73f14d5e`. Si la rama se rebasara sobre un `main` posterior, las cifras
   absolutas cambian y lo que se comprueba es el **delta cero** contra el commit
   base de la rama.
4. V1 sigue dando **86**.

**Criterio de "no arreglado"**: **un solo rojo** en cualquiera de las cinco corridas
o en V1. Se guarda el log **entero** —con el orden de ficheros, no solo la línea del
error— junto a `progress/logs-111/`, y la feature **no cierra**.

**Qué prueba V2 y qué no, sin adornos**: cinco corridas detectan con ~95 % de
probabilidad un flake cuya tasa por corrida sea ≥ 45 %. La ventana de #111 ya
sobrevivió **doce** corridas verdes seguidas, así que cinco **no** prueban nada
sobre ella. V2 es el candado contra **regresiones que esta feature pudiera
introducir**, no una prueba de ausencia de flake. Lo determinista es R1.

**`./init.sh` no se lanza** (R5, §Fuera de alcance): #111 no toca
`backend-pet-tracker/`, y lanzarlo colisionaría en el Postgres/LocalStack
compartidos con la otra sesión.

---

## Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| **Fijar `testTimeout: 15000`** en el bloque `jest` | No gobierna el plazo que venció: el que agotó en las cuatro corridas rojas fue el `asyncUtilTimeout` de RNTL, **1000 ms** ([[requirements]] §F2). Sería un número nuevo que no toca el mecanismo del fallo y alarga cada rojo legítimo de la suite |
| **Subir `asyncUtilTimeout`** | Es el plazo correcto, y por eso mismo subirlo **esconde** la carrera. Prohibido por el §Fuera de alcance de #72, aprobado el 2026-09-17. Y es **inerte** frente a este fallo: en el momento del rojo el predicado esperado (`weight-card` visible) **ya estaba satisfecho** |
| **Fijar `maxWorkers: 2`** | Reduce contención, no la ventana de ordenación. Cuatro de las doce corridas verdes se hicieron con los cuatro núcleos saturados: la saturación no está demostrada como causa. Y penaliza cada corrida de CI |
| **Reescribir `map:284` para esperar al árbol** | Ningún nodo distingue el estado final en ese fixture (R3, punto 2), y #72 S6 ya decidió lo contrario con el mismo argumento. Sería un segundo arreglo para el mismo sitio |
| **Un test estático que grepee el patrón en los ficheros de test** | Descartado por #72 por falsos positivos, con la misma razón aquí: el patrón solo es defecto si las fuentes son independientes, y eso no se ve grepeando. Lo sustituye la regla ya escrita en `docs/conventions.md` |
| **`jest.retryTimes` o `--runInBand`** | Esconden el fallo o cambian el entorno; ninguna de las dos arregla una condición de parada equivocada |
| **Barrer el sub-patrón en los demás ficheros de test móviles** | Fuera del alcance acordado de #111 (dos ficheros). Los candidatos quedan nombrados en §Fuera de alcance, sin afirmar que tengan el defecto |
