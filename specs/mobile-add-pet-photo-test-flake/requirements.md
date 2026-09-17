---
feature: "mobile-add-pet-photo-test-flake"
status: draft        # draft | approved
tags: [harness, spec, mobile, tests]
---

# Requisitos — [[mobile-add-pet-photo-test-flake]] (#72)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden TDD y
> [[../../docs/conventions|conventions]] §Tests para las convenciones de test.
>
> **Líneas y símbolos verificados contra `feature/72-mobile-add-pet-photo-test-flake`
> HEAD `d5f2fcb4`** (base `origin/main` = `9c3dcab6`). Las líneas se desplazan en
> cuanto se aplica la primera edición: cada sitio se identifica **además** por el
> título del test, que es el ancla que no caduca.
>
> Investigación de base: `progress/explore_mobile-add-pet-photo-test-flake.md`
> (informe del `explorer`, etiquetado [HECHO]/[REC]/[ABIERTO]).

---

## 0. Hechos que esta spec da por establecidos (y uno que da por FALSADO)

**F1 — La hipótesis de la cola de `mockResolvedValueOnce` está FALSADA. No se
implementa nada basado en ella.** Los dos únicos logs rojos que existen del fallo
de add-pet (`init-cierre-92.log`, 2026-09-14, e `init-review-93.log`, 2026-09-15)
corresponden a `main@961b330a`, y en ese árbol `src/screens/add-pet/index.test.tsx`
tenía 386 líneas y **cero** `mockResolvedValueOnce` del picker (el primero lo
introdujo `eb931f7e`, que llegó a `main` en el PR #130 / `507c3396`, *después* de
los tres avistamientos). Quien implemente esta spec **no debe** buscar "qué test
consume la cola antes": esa cola no existía cuando falló.

**F2 — Son dos causas distintas, no una de aislamiento entre suites.**
Firmas incompatibles (mock sin implementación contra carrera caché-vs-render),
poblaciones disjuntas en 40 corridas registradas, y `add-pet` no monta ninguna
query de TanStack.

- **Causa B (alerts)** — *reproducida*, causa cerrada a nivel de fuente:
  `@tanstack/query-core` escribe la caché de forma **síncrona** al resolver, pero
  notifica a React a través de `notifyManager` con `scheduleFn = systemSetTimeoutZero`
  (`node_modules/@tanstack/query-core/build/modern/notifyManager.js:1-3`), es decir
  **una macrotarea de retraso, siempre**. Un `waitFor` que espera a
  `queryClient.getQueryData(...)` es cierto una macrotarea antes de que el DOM
  cambie; la aserción síncrona que va detrás encuentra la pantalla en su estado
  anterior. No es lentitud: es esperar a la señal equivocada.
- **Causa A (add-pet)** — *no reproducida* en 32 corridas completas, y los cinco
  caminos que producirían `undefined` están descartados con fuente (§3.4 del
  informe). `undefined.canceled` es la firma exacta de un mock **sin
  implementación** — verificado contra el `jest-mock` que usa el runtime
  (`node_modules/jest-runtime/node_modules/jest-mock`, **29.7.0**, no el 30.4.1
  hoisted): `mockResolvedValue` deja implementación, `clearAllMocks` la conserva,
  `mockReset`/`resetAllMocks` la borran y la llamada devuelve `undefined` crudo.
  El arreglo obvio ya se aplicó el 2026-09-03 en `43183c4a` (el `mockReset` +
  rearme por test) y **no bastó**.

**F3 — "Muerde en la primera pasada y la segunda sale verde" es, en parte, un
artefacto del sequencer.** `@jest/test-sequencer` programa **primero** el fichero
que falló en la corrida anterior (`hasFailed`, caché en `/tmp/jest_ru/perf-cache-*`).
La segunda corrida verde es el **control más favorable posible**, no una
absolución. Por eso el criterio de aceptación 5 de la entrada #72
("verde en tres ejecuciones consecutivas de `./init.sh`") no mide nada y se
sustituye (ver §Decisiones, D-B, y §Protocolo V).

**F4 — Agujero de higiene probado e independiente de A.**
`src/screens/profile/index.test.tsx` mockea el picker (`:58-60`), lo captura
(`:135`) y lo arma con `mockResolvedValue` **persistente** en `:533`, `:546` y
`:579`, y **no tiene ni un `mockReset`**: solo `jest.clearAllMocks()`, que conserva
la implementación. Tras el describe `R7: cambiar foto` (`:516-595`) el picker queda
armado con `{ canceled: false, assets: [{ uri: 'file:///luna.webp', … }] }` para
todos los tests que vengan detrás. Es el mismo defecto que `add-pet` cerró en
`43183c4a`, todavía abierto.

---

## Requisitos funcionales

### R1 — La espera del sitio reproducido termina en el árbol, no en la caché

**WHILE** el planificador de notificaciones de `@tanstack/query-core` esté
retrasado 200 ms en el test
`src/screens/alerts/index.test.tsx` ›
`#78 R4: la pantalla pinta su esqueleto, su error, su vacío y sus filas` ›
`pinta y reintenta cada error de la primera página`,
**THE SYSTEM SHALL** hacer que cada vuelta del bucle termine su espera en la
**aparición del nodo `alerts-error` en el árbol renderizado**, y pasar el test de
forma determinista, **conservando** la aserción de caché
`expect(rendered.queryClient.getQueryData(alertKeys.list())).toEqual(...)` que es
contrato de **#78 R4**.

Sitio exacto (HEAD `d5f2fcb4`): `it` en `:190`, `waitFor` a la caché en `:201-205`,
aserción síncrona que falla en `:206`
(`expect(screen.getByTestId('alerts-error')).toHaveTextContent(...)`).

Cómo se observa:

- Con la viga de 200 ms puesta y la aserción síncrona intacta, el test falla
  **siempre** con `Unable to find an element with testID: alerts-error` en la
  línea de la aserción — la firma exacta del rojo de CI del PR #132.
- Con la espera corregida, el test pasa **siempre**, con la viga puesta.
- La viga **se queda** en el árbol final: revertir la corrección vuelve a poner el
  test rojo al 100 %, no 1 de cada 32.

Los 200 ms se derivan de constantes reales, no se eligen a ojo:
`DEFAULT_INTERVAL = 50` ms de `waitFor`
(`node_modules/@testing-library/react-native/dist/wait-for.js:16`) y
`asyncUtilTimeout = 1000` ms (`.../dist/config.js:15`). La ventana cumple
`50 < 200 < 1000`: el primer sondeo que ve la caché ocurre mucho antes de la
notificación (rojo determinista con el código actual), y la espera corregida tiene
5× de holgura sobre el retraso (verde determinista). **Si con 200 ms la corrida no
diera rojo, se amplía la ventana hasta que lo dé y se anota el valor — nunca se
relaja la aserción.**

### R2 — El resto de sitios con el mismo patrón, uno por uno

**WHEN** un test espera con `waitFor` a una señal que **no** es el árbol
renderizado (la caché de TanStack Query o el contador de llamadas de un mock) y a
continuación **asevera el árbol renderizado**, **THE SYSTEM SHALL** hacer que la
condición de parada de esa espera sea **la propia aserción de árbol**;
**IF** la aserción de árbol es de **ausencia** (`queryByTestId(...)).toBeNull()`),
**THEN THE SYSTEM SHALL** anclarla primero a una **espera positiva** sobre un nodo
que sí aparece en ese escenario, porque una aserción de ausencia contra un render
atrasado **pasa por el motivo equivocado**.

Aplica exactamente a estos seis sitios — el inventario completo del criterio 4 de
la feature son estos seis más el de R1, **siete en total, en cinco ficheros**:

| id | Sitio (HEAD `d5f2fcb4`) | Test | Espera actual | Aserción que la sigue | Decisión |
|---|---|---|---|---|---|
| S2 | `src/screens/alerts/index.test.tsx:693-694` | `#78 R8 …` › `deshabilita durante el vuelo y corta dos pulsaciones seguidas` | `waitFor(mockAckAlert 1 vez)` | `getByTestId('alert-row-alert-1-ack')).toBeDisabled()` | **Convertir**: `await waitFor(() => expect(screen.getByTestId('alert-row-alert-1-ack')).toBeDisabled())`, conservando `expect(mockAckAlert).toHaveBeenCalledTimes(1)` (contrato: la segunda pulsación no llama). Honestidad: en este sitio **no se demostró carrera** (el `await fireEvent.press` ya vacía el `act` y `setAckingId` es síncrono antes del `await`); se convierte por uniformidad de forma, para que el patrón no sobreviva en el fichero y se copie |
| S3 | `src/screens/alerts/index.test.tsx:648-649` | `#78 R8 …` › `cierra sesión en unauthorized sin pintar error` | `waitFor(mockSignOut 1 vez)` | `queryByTestId('alerts-action-error')).toBeNull()` | **Ancla positiva + ausencia**: `await waitFor(() => expect(screen.getByTestId('alert-row-alert-1-ack')).not.toBeDisabled())` (prueba que el `setAckingId(null)` del `finally` de `handleAck` ya re-renderizó) y **después** la aserción de ausencia |
| S4 | `src/screens/pairing/index.test.tsx:562-563` | `signs out for unauthorized without showing an error message` | `waitFor(signOut 1 vez)` | `queryByTestId('pairing-error')).toBeNull()` | **Ancla positiva + ausencia**: `await waitFor(() => expect(screen.getByTestId('pairing-submit')).not.toBeDisabled())`. Verificado que el ancla es alcanzable: `pairing/index.tsx:407` es `isDisabled={code.trim() === '' || claiming}`, el `finally` de `handleClaim` hace `setClaiming(false)` y el código `'ACT-001'` sigue en el input |
| S5 | `src/screens/pairing/index.test.tsx:947-948` | `signs out for unauthorized without showing a local error` | `waitFor(signOut 1 vez)` | `queryByTestId('pairing-error')).toBeNull()` | **Ancla positiva + ausencia**: `await waitFor(() => expect(screen.getByTestId('device-unpair')).not.toBeDisabled())` (`pairing/index.tsx:498` `isDisabled={releasing}`, `finally` de `handleRelease`) |
| S6 | `src/app/(tabs)/__tests__/map.test.tsx:279` | `R4: map resuelve la mascota seleccionada` › `selects the first pet and loads its first position` | `waitFor(mockGetLastPosition llamado con …)` en `:272-278` | `getByTestId('map-loading')).toBeVisible()` | **Borrar la línea 279.** Es **vacua**, no racy: en ese test `getLastPosition` está pendiente (`beforeEach`, `:241`), y `map.tsx:161-162` define `isLoading = pets.data === undefined \|\| (petsReady && last.data === undefined)`, que es **cierto tanto antes como después** de que la lista de mascotas resuelva; la aserción no distingue los dos estados. El contrato de carga ya está candado en `map.test.tsx:247-254` y `:256-262`. **La espera de `:272-278` se conserva tal cual**: lo que asevera *es la llamada*, no el árbol, así que no cae bajo esta regla |
| S7 | `src/app/(tabs)/__tests__/weight-log.test.tsx:401-407` | `submits all fields, clears them, and refetches the list` | `waitFor(mockListWeights 2 veces)` | `getByTestId('weight-input').props.value` y 3 aserciones más, incl. `queryByTestId('weight-form-error')).toBeNull()` | **Que la espera termine en el DOM**: `await waitFor(() => expect(screen.getByTestId('weight-input').props.value).toBe(''))` y **después** el resto de aserciones (incluida `expect(mockListWeights).toHaveBeenCalledTimes(2)`, que es monótona y ya está satisfecha) |

**Regla derivada, que se escribe en `docs/conventions.md` §Tests** (parte de R2):
*la condición que termina una espera tiene que ser la misma observación que hacen
las aserciones que la siguen; si lo que se asevera es el árbol, la espera termina
en el árbol. Esperar a un contador de mock o a la caché de Query y aseverar el DOM
a continuación es una carrera, y si la aserción es de ausencia, es además una que
pasa por el motivo equivocado.*

### R3 — El mock del picker no se hereda entre tests de profile

**WHEN** empieza cualquier test de `src/screens/profile/index.test.tsx`,
**THE SYSTEM SHALL** entregar `ImagePicker.launchImageLibraryAsync` **reseteado y
rearmado** con `{ canceled: true, assets: null }`, sin heredar la implementación
que armó un test anterior.

Forma exacta (la misma que `add-pet` tiene desde `43183c4a`): un `beforeEach` de
raíz (nivel de fichero, después de la captura de `:135`) con
`mockLaunchImageLibrary.mockReset()` y acto seguido
`mockLaunchImageLibrary.mockResolvedValue({ canceled: true, assets: null })`.

Test que lo nombra: un `describe('#72 R3: …')` nuevo **declarado después** del
describe `R7: cambiar foto` (que termina en `:595`) — el orden importa: jest ejecuta
los describes en orden de declaración y el sujeto del rojo es justamente la
implementación que `:579` deja armada.

### R4 — El próximo rojo de add-pet nombra el invariante roto

**IF** `launchImageLibraryAsync` llega **sin implementación** al momento de pulsar
`add-pet-photo` en `src/screens/add-pet/index.test.tsx`, **THEN THE SYSTEM SHALL**
fallar el test con un error que **nombra el invariante roto** (mensaje que contiene
`PICKER_MOCK_UNARMED`) **antes** de que el componente llegue a leer `.canceled`, en
vez de propagar `TypeError: Cannot read properties of undefined (reading 'canceled')`
desde `src/screens/add-pet/index.tsx:137`.

Forma: un helper local en ese mismo fichero de test,

```
async function pressPickPhoto(): Promise<void>
```

que (1) comprueba `mockLaunchImageLibrary.getMockImplementation() !== undefined` y
lanza `new Error('PICKER_MOCK_UNARMED: …')` si no lo está, y (2) hace
`await fireEvent.press(screen.getByTestId('add-pet-photo'))`. Las tres pulsaciones
del picker del fichero pasan por el helper: `:144`, `:150` (describe `R2:`) y `:355`
(describe `R7: foto opcional tras alta` › `uploads a chosen preview only after
createPet succeeds`, que es **el test del flake**).

Por qué `getMockImplementation()` es el invariante correcto, verificado contra
`jest-mock` 29.7.0 (el que usa el runtime):

| operación | `getMockImplementation()` |
|---|---|
| `jest.fn()` recién creado | `undefined` |
| tras `mockResolvedValue(v)` | función |
| tras añadir `mockResolvedValueOnce(w)` encima | función (la cola *once* no borra la implementación) |
| tras `mockReset()` | `undefined` |

Es decir: el `beforeEach` raíz de `:92-95` garantiza implementación persistente, y
las colas `mockResolvedValueOnce` de `:109` **no** la anulan — el invariante no da
falsos positivos en los tests que usan colas.

El mensaje de error debe ser accionable, no decorativo. Contenido mínimo:
`PICKER_MOCK_UNARMED`, el nombre del símbolo (`launchImageLibraryAsync`), y el
puntero al rearme que debería estar vigente (`add-pet/index.test.tsx` `beforeEach`
raíz).

---

## Decisiones que firma el humano en el gate

> **Estas dos decisiones modifican los criterios de aceptación 1, 2 y 5 que hoy
> están escritos en la entrada #72 de `feature_list.json`.** No se implementan ni
> se dan por buenas hasta que el humano las firme junto con la spec. Si el humano
> rechaza una, la spec vuelve al `spec_author` antes del handoff.

### D-A — Cerrar la mitad add-pet con endurecimiento diagnóstico, no con causa raíz

**Qué se relaja:** el criterio 1 ("la spec identifica la causa raíz con evidencia")
deja de exigirse **para la causa A (add-pet)**. Para la causa B (alerts) el criterio
1 se cumple entero: la causa está cerrada a nivel de fuente y reproducida.

**Por qué:** A no se reprodujo en 32 corridas completas y los cinco caminos que
producirían `undefined` están descartados con fuente; el arreglo obvio (el
`mockReset` por test) ya se aplicó el 2026-09-03 y no bastó. Inventar una causa
sería peor que no tenerla.

**Qué se entrega a cambio, exactamente:**

1. **R4** — el invariante nombrado en el camino de la pulsación, con su self-test.
2. **R3** — el cierre del único agujero de higiene del picker **probado** que queda
   abierto (profile), independiente de si explica A.
3. **F1 escrito** — la hipótesis de la cola queda falsada por escrito para que
   nadie la vuelva a implementar.

**Cómo se sabrá si sirvió** (esto es lo que compra la decisión): en el próximo
avistamiento en CI o en `./init.sh`, el log dirá **una de dos cosas**, y son
ramas excluyentes:

- `PICKER_MOCK_UNARMED: …` → el mock llegó **desarmado** a la pulsación. Queda
  probado que algo lo resetea entre el `beforeEach` raíz y el `press`, y la
  búsqueda se acota a *quién*: se bisecta con `--runTestsByPath` reproduciendo el
  orden de ficheros del log rojo.
- Sigue apareciendo `TypeError … reading 'canceled'` en `add-pet/index.tsx:137` →
  el mock **estaba armado** al pulsar y se desarmó *durante* la pulsación, o la
  llamada no salió del `jest.fn` que el test arma. Eso descarta la rama anterior y
  abre una hipótesis nueva y mucho más estrecha.

**Qué NO se entrega:** la causa raíz de A. La contradicción de §3.4 del informe del
`explorer` sigue **abierta** y así queda escrita. Si A vuelve a morder, se abre una
feature nueva que arranca del mensaje diagnóstico, no de cero.

- [X] **D-A aprobada por humano** (fecha: 2026-09-17)

### D-B — El criterio 5 se sustituye por el Protocolo V

**Qué se sustituye:** el criterio 5 ("Suite móvil completa verde en tres ejecuciones
consecutivas de `./init.sh`") **se elimina** y pasa a ser el §Protocolo V de abajo.
El número que el criterio 2 dejaba a la spec ("un número de veces que la spec fija")
queda fijado también ahí: **5 corridas por fichero aislado y 20 corridas de la suite
completa**.

**Por qué:** tres `./init.sh` consecutivos no miden nada mientras el sequencer
programe primero el fichero que acaba de fallar (F3), y `./init.sh` entero es
mucho más caro que la suite móvil (~33 s de mediana) y además colisiona con la otra
sesión en el Postgres/LocalStack compartidos.

- [X] **D-B aprobada por humano** (fecha: 2026-09-17)

---

## Protocolo V — la verificación que sustituye al criterio 5

Todo desde `/home/claude/sites/Pet-Tracker/mobile-pet-tracker` salvo donde se diga.
**Ningún comando de medida lleva pipe**: `./init.sh | tail` devuelve el código de
`tail`, no el de `init.sh`.

**V0 — Consistencia interna del recuento de suites** (en lugar de una cifra
congelada, que caduca):

```
bunx jest --listTests | wc -l      # = S, el nº de suites que jest va a correr
```

En cada corrida de V2, la línea `Test Suites: … N total` debe cumplir **N == S**.
Es el detector de ficheros saltados en silencio — el modo en que un filtro mal
escrito da exit 0 habiendo corrido de menos.

**V1 — Ficheros aislados, 5 corridas cada uno** (rellena el criterio 2, mitad
"fichero suelto"):

```
bunx jest --runTestsByPath src/screens/alerts/index.test.tsx
bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx
bunx jest --runTestsByPath src/screens/profile/index.test.tsx
bunx jest --runTestsByPath src/screens/pairing/index.test.tsx
bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/map.test.tsx' 'src/app/(tabs)/__tests__/weight-log.test.tsx'
```

`--runTestsByPath` trata sus argumentos como **rutas**, así que aquí `(tabs)` NO se
escapa. En cambio un filtro **posicional** de jest es una **regex**: allí hay que
escribir `'src/app/\(tabs\)/__tests__/map'` o el fichero se salta **en silencio con
exit 0** (`docs/conventions.md` §Filtros de jest con rutas que llevan paréntesis).

**V2 — Suite móvil completa, 20 corridas, en los dos órdenes** (rellena el criterio
2, mitad "dentro de la suite completa", y sustituye al criterio 5):

```
for i in $(seq 1 20); do
  if [ "$i" -le 10 ]; then rm -rf /tmp/jest_ru/perf-cache-*; fi
  bun run --cwd /home/claude/sites/Pet-Tracker/mobile-pet-tracker test > /tmp/v2-run-$i.log 2>&1
  echo "run $i exit=$?"
done
```

- Las **10 primeras** corren en frío: borrar `/tmp/jest_ru/perf-cache-*` impide que
  el sequencer adelante el fichero que falló antes (F3), que es lo que convertía la
  "segunda corrida verde" en el control más favorable posible.
- Las **10 siguientes** corren en caliente, con la caché tal como el sequencer la
  deje: es el orden real de una sesión encadenada.
- La redirección `>` **no** es un pipe: `$?` es el código de jest.

**Criterio de "arreglado"** (los tres a la vez):

1. **20 de 20** corridas con exit 0.
2. En las 20, `Test Suites: … N total` con **N == S** (V0).
3. Cero fallos en los cinco ficheros tocados, en V1 y en V2.

**Criterio de "no arreglado"**: **un solo rojo** en cualquiera de las 20 corridas o
de las de V1 en alguno de los cinco ficheros. Se guarda el log **entero** (con el
orden de ficheros, no solo la línea del error) y la feature no cierra.

**Qué prueba y qué no prueba V2, dicho sin adornos:** 20 corridas detectan con ~95 %
de probabilidad un flake cuya tasa por corrida sea ≥ 14 % (`1-(1-p)^20 = 0.95`). El
flake de alerts se observó a ~3 % (1 de 32): **20 corridas no bastarían para
cerrarlo estadísticamente**, y por eso B no se cierra con estadística sino con el
determinismo de R1 (con la viga puesta, el defecto falla al 100 % y el arreglo pasa
al 100 %). El de add-pet no se cierra con ninguna N razonable, y por eso existe D-A.
V2 es el candado contra **regresiones que esta feature pudiera introducir** y contra
flakes gruesos, no una prueba de ausencia.

**V3 — `./init.sh` una vez, al final**, desde `/home/claude/sites/Pet-Tracker`:

```
pgrep -af "init.sh" ; pgrep -af "jest"     # comprobar que no hay otra sesión corriendo un gate
./init.sh ; echo "init exit=$?"
```

`init.sh` comparte Postgres/LocalStack con la otra sesión: si `pgrep` encuentra otro
gate en vuelo, se espera. Sin pipes.

**Coste**: V2 ≈ 20 × 33 s ≈ 11-13 min; V1 ≈ 5 × 5 × pocos segundos; V3, una corrida.

---

## Cómo se demuestra el rojo de cada R-id (C4) — el matiz del flake

El "rojo" de un flake no se puede provocar a voluntad, así que **ningún R-id de esta
spec depende del azar para su rojo**. Cada uno declara aquí su vía, y el `reviewer`
la comprueba en el historial:

| R-id | Vía | Rojo exacto, determinista |
|---|---|---|
| **R1** | Rojo real, sin mutación | El commit rojo mete **solo la viga de 200 ms** sobre el test intacto. Falla siempre en la aserción de `alerts-error` con `Unable to find an element with testID: alerts-error`: **es el propio defecto, reproducido a voluntad**, no un sustituto |
| **R2** | C4 vía (b): **mutación de producción**, versionada en el commit rojo y **revertida** en el verde | Una por sitio (tabla de §Mutaciones en [[design]]). Para S3, S4 y S5 se registra además la **prueba de zona ciega**: con la misma mutación, el test **actual pasa** y el **corregido falla** — que es exactamente el defecto que R2 arregla. S6 no lleva mutación: es el borrado de una línea vacua y su evidencia es el argumento de invariancia de la tabla de R2 |
| **R3** | Rojo real, sin mutación | El test nuevo, **declarado después** del describe `R7: cambiar foto`, hoy hereda `{ canceled: false, assets: [{ uri: 'file:///luna.webp' … }] }` de `profile/index.test.tsx:579` y falla por su propia aserción |
| **R4** | Rojo real, sin mutación | El commit rojo incluye el helper `pressPickPhoto` **sin** la comprobación de invariante (para que el rojo **no** sea un `ReferenceError`, que C4 prohíbe expresamente) y el self-test; el self-test falla por su propia aserción: `rejects.toThrow(/PICKER_MOCK_UNARMED/)` recibe una promesa **resuelta** |

Regla dura sobre las mutaciones de R2: son **transitorias**. El commit verde deja
los ficheros de producción **byte a byte** como estaban. Comprobación del reviewer:

```
git diff origin/main..HEAD -- mobile-pet-tracker/src/screens/alerts/index.tsx \
  mobile-pet-tracker/src/screens/pairing/index.tsx \
  'mobile-pet-tracker/src/app/(tabs)/weight-log.tsx'
```

debe salir **vacío**.

---

## Fuera de alcance

- **Arreglar la causa A de add-pet.** D-A lo sustituye por R4. Ninguna tarea de esta
  spec puede "explicar" A: si aparece una explicación, se escribe en
  `progress/impl_mobile-add-pet-photo-test-flake.md` y se para.
- **Tocar de forma permanente `src/screens/alerts/index.tsx`,
  `src/screens/add-pet/index.tsx` ni ningún otro fichero de producción.** El defecto
  está en los tests. Las mutaciones de R2 son la mitad roja de un par rojo→verde y se
  revierten en el mismo par (comando de comprobación arriba). Si alguien concluye que
  hace falta tocar producción de verdad, **para** y lo escribe como decisión abierta
  para el humano; no lo hace.
- **`resetMocks: true`** (ni `restoreMocks`, ni `clearMocks`) en el bloque `jest` de
  `mobile-pet-tracker/package.json`. Es justo el estado que produce la firma
  `undefined` de A: dejaría a toda la suite sin implementaciones de mock entre tests
  y convertiría un flake en una regresión masiva.
- **Reintentar, subir timeouts o saltar tests**: nada de `jest.retryTimes`, nada de
  subir `asyncUtilTimeout`, nada de `it.skip`/`it.failing`, y `--runInBand` no es un
  arreglo. Por qué meter la aserción en la espera **no** es subir un timeout: subir el
  timeout alarga *cuánto* se espera al **mismo** predicado, y en el momento del fallo
  el predicado actual (*la caché ya tiene el error*) **ya está satisfecho** — un
  timeout más largo es inerte frente a este fallo. Corregir la espera no toca ningún
  timeout: cambia **cuál** es la condición de parada, de la caché a lo que el test
  afirma de verdad. Diferencia comprobable: con el timeout subido el test sigue
  pudiendo fallar (la ventana es de ordenación, no de duración); con la condición
  correcta deja de haber ventana.
- **Buscar "quién consume la cola del `mockResolvedValueOnce`"** (F1: falsado).
- **Un `testSequencer` propio o un aleatorizador del orden de ficheros.** El orden se
  controla en V2 borrando la caché de perf, que es gratis.
- **Un detector estático del patrón de R2** (un test que grepee los fuentes de test):
  descartado por falsos positivos; lo sustituye la regla escrita en
  `docs/conventions.md` §Tests, que es donde este repo codifica los defectos que se
  repiten.
- **Copy/catálogo**: esta feature **no añade ni cambia ninguna clave de copy**, así
  que `src/providers/__tests__/language-provider.test.tsx` (el candado que cierra la
  longitud del catálogo) **no entra** en los ficheros de esta spec. Queda dicho
  explícitamente para cerrarlo: si durante la implementación apareciera una clave
  nueva, ese fichero pasa a ser candado obligatorio y la spec tendría que enmendarse.
- **C8 (carta de UI)**: no se toca ningún componente, estilo, token ni animación, así
  que el grep-clean se mantiene trivialmente. El único fichero de producción que se
  toca —transitoriamente— es el de las mutaciones de R2, y el verde lo devuelve
  idéntico.

---

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-17) ← gate obligatorio antes de implementar
- [X] D-A aprobada (§Decisiones)
- [X] D-B aprobada (§Decisiones)

> Al firmar D-A y D-B, el `leader` reescribe los criterios de aceptación 1, 2 y 5 de
> la entrada #72 de `feature_list.json` para que digan lo que esta spec fija.
