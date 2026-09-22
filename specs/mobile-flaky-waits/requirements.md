---
feature: "mobile-flaky-waits"
status: draft        # draft | approved
tags: [harness, spec, mobile, tests]
---

# Requisitos — [[mobile-flaky-waits]] (#111)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden TDD y
> [[../../docs/conventions|conventions]] §*Esperas sobre el árbol renderizado*,
> que es la norma que esta feature hace cumplir.
>
> **Líneas y símbolos verificados contra `feature/111-mobile-flaky-waits`
> HEAD `69a763f3`** (base `origin/main` = `73f14d5e`). Las líneas se desplazan en
> cuanto se aplica la primera edición: cada sitio se identifica **además** por el
> título del `it`, que es el ancla que no caduca.
>
> Precedente obligatorio: [[../mobile-add-pet-photo-test-flake/requirements|#72]]
> y su [[../mobile-add-pet-photo-test-flake/design|design]]. Esta spec **calca**
> sus formas (§D2) en vez de inventar un enfoque nuevo.

---

## 0. Qué justifica esta feature, y qué NO la justifica

**Esto no es "arreglar una suite rota" y la spec no promete eliminar ningún
flake.** Lo que justifica #111 es una **violación objetiva de una convención
escrita del repo**, y eso es un defecto **se reproduzca o no**.

### F1 — La evidencia de la ventana roja es débil y así queda escrito

Hubo **cuatro corridas rojas reales**, con log versionado, más una quinta que
reportó Codex al pararse:

| log | árbol | test que cayó | firma |
|---|---|---|---|
| `progress/logs-111/pre1.txt` | `3a52028b` (main antes de #102) | `R6: weight card enlaza al log › shows the current weight and opens the weight log` | `Unable to find an element with testID: weight-current` |
| `progress/logs-111/pre2.txt` | `3a52028b` | el mismo | la misma |
| `progress/logs-111/full2.txt` | árbol de #108 (`9055466d`) | `R4: map resuelve la mascota seleccionada › selects the first pet and loads its first position (#72 R2)` | `Number of calls: 0` |
| `progress/logs-111/full3.txt` | árbol de #108 | el mismo | la misma |

**Aviso de ruta, para que la siguiente ventana roja no persiga un fantasma:**
`pre1.txt`/`pre2.txt` rotulan el fichero como
`src/app/(tabs)/__tests__/health.test.tsx`, que **ya no existe**. En `3a52028b`
esa era la ruta real del fichero; `95ee54fc` (`refactor(mobile): mueve health a
src/screens/health`) lo movió a `src/screens/health/index.test.tsx` **sin tocar el
cuerpo del test** — verificado: `git show
'3a52028b:mobile-pet-tracker/src/app/(tabs)/__tests__/health.test.tsx'` en las
líneas 457-473 es **idéntico** al `src/screens/health/index.test.tsx:457-473` de
hoy, línea a línea. Los recuentos también cambian por eso: `pre*` son
`1385 passed / 1386 total`, `full*` son `1395 passed / 1396 total`.

**Ninguna de las cuatro es reproducible.** Después salieron **doce corridas verdes
seguidas**, con caché fría (`--clearCache`), con caché caliente y con los cuatro
núcleos saturados. **La causa de esa ventana sigue sin identificar y esta feature
no la resuelve.** Si mañana vuelve una ventana roja, quien la lea tiene que saber
que **#111 no prometía resolverla**: lo primero que debe hacer es comparar su log
entero contra los cuatro de `progress/logs-111/`, no re-descubrirlos.

Dato secundario que queda anotado sin explicación: `pre1.txt` y `full3.txt`
contienen `A worker process has failed to exit gracefully and has been force
exited`; `pre2.txt` y `full2.txt` no. No se investiga en #111.

### F2 — La premisa de los 5000 ms de la entrada #111 es FALSA

La entrada de `feature_list.json` dice que los dos tests corren "contra el
`waitFor` por defecto de 5000 ms". **No.** Verificado en el árbol:

- `waitFor` de RNTL agota a los **1000 ms**: `asyncUtilTimeout: 1000` en
  `node_modules/@testing-library/react-native/dist/config.js:15`, con
  `DEFAULT_INTERVAL = 50` ms en `.../dist/wait-for.js`.
- `test/jest-setup.js` **no** llama a `configure(...)`: no hay override.
- Los 5000 ms son el `testTimeout` de jest, que acota el **test entero**, no la
  espera.

Consecuencia directa: en las cuatro corridas rojas **el plazo que venció fue el de
RNTL, no el de jest**, y por tanto **subir `testTimeout` no habría salvado ninguna
de ellas**. De ahí sale R4.

### F3 — #72 codificó la regla pero su inventario barrió solo media regla

`docs/conventions.md` §*Esperas sobre el árbol renderizado* la escribió #72
(`28b4934e docs(add-pet-photo-test-flake): codify rendered-tree wait rule (R2)`).
Su R2 inventarió **siete sitios en cinco ficheros** y se declaró completo, pero su
patrón era el **sub-patrón estrecho**: *esperar a una señal que no es el árbol*
(la caché de Query o el contador de un mock) *y aseverar el árbol después*.

La frase que quedó en `conventions.md` es más ancha que ese barrido:

> «La condición que termina una espera debe ser la misma observación que hacen las
> aserciones posteriores.»

#111 cierra **el otro sub-patrón**, el que #72 no barrió: **la espera termina en el
árbol, pero en un nodo más débil que el que se asevera después**, y el hueco entre
los dos lo salva una fuente asíncrona **distinta e independiente**. Ese es
exactamente el defecto de `health/index.test.tsx:465-468`, y es el que `pre1`/`pre2`
reprodujeron.

**Ninguno de los dos tests de #111 quedó "pendiente" en #72:**

- `map/index.test.tsx:284` **sí** fue inventariado por #72 (su sitio **S6**, entonces
  en `src/app/(tabs)/__tests__/map.test.tsx:279`). #72 borró de él una aserción
  vacua y **decidió por escrito conservar la espera sobre el mock**. Esa decisión
  está firmada por el humano el 2026-09-17. Ver R3.
- `health/index.test.tsx:457` **no** aparece en ningún sitio de #72: es un **fallo
  del inventario** de aquella feature, no deuda que aplazara. El sitio ya existía
  entonces, con ese cuerpo.

### F4 — Criterio que decide qué es defecto y qué no (se aplica sitio a sitio)

Un sitio es defecto **si y solo si** la observación que termina la espera **puede
ser cierta mientras una aserción posterior es falsa**. En estos dos ficheros eso
ocurre cuando la espera y la aserción leen **fuentes asíncronas independientes**.
Las cinco fuentes de `MapScreen` y las tres de `HealthScreen` están mapeadas en
[[design]] §D1. **No** son defecto, y por tanto **no se tocan**:

- aserciones sobre el **mismo nodo** que se esperó (`props` de `map-view`);
- aserciones **más débiles** que la esperada (el contenedor de un nodo ya visto);
- aserciones **causalmente implicadas** por el estado esperado (un contador de mock
  cuyo efecto es justo el render que se esperó);
- aserciones de **ausencia ya ancladas** a una espera positiva del mismo escenario,
  que es la forma que la propia convención exige.

---

## Requisitos funcionales

### R1 — El sitio reproducido espera y asevera la misma observación

**WHILE** la resolución de `listWeights` esté retrasada 200 ms en el test
`src/screens/health/index.test.tsx` ›
`R6: weight card enlaza al log` › `shows the current weight and opens the weight
log`, **THE SYSTEM SHALL** terminar la espera del test **en la aparición del texto
de `weight-current`**, y pasar de forma determinista, **conservando las cuatro
aserciones que el test hace hoy** (`weight-card` visible, el texto `Peso`,
`weight-current` = `12.4 kg`, `weight-variation` = `+0.4 kg`) y su pulsación de
`weight-log-link` con `router.push('/weight-log')`.

**Sitio exacto** (HEAD `69a763f3`): `it` en `:457`; espera al **contenedor** en
`:465`; aserciones en `:466-468`.

**Por qué es defecto, con la fuente delante:**
`weight-card` se pinta con `selectedPetId` a secas
(`src/screens/health/index.tsx:215-218`, la query `pets`), mientras que
`weight-current` existe solo si
`weight.data?.kind === 'ok' && weight.data.weights.length > 0`
(`:226-229`, la query `weights`). Dos queries independientes: la espera puede
terminar una resolución antes que la aserción, y entonces el `getByTestId` de
`:467` —que es **síncrono y lanza**— explota. **Es la firma literal de `pre1`/`pre2`:**
`Unable to find an element with testID: weight-current`.

**Cómo se observa que está cerrado** (vía C4 **(a)**, rojo real — ver §C4):

- Con la viga de 200 ms puesta y el cuerpo del test intacto, falla **siempre**, en
  `:467`, con esa misma firma.
- Con la espera corregida y **la misma viga puesta**, pasa **siempre**.
- La viga **se queda** en el árbol final: revertir la corrección vuelve a poner el
  test rojo al **100 %**, en vez de en una ventana que nadie ha sabido reproducir.

Los 200 ms no se eligen a ojo, se derivan de las constantes reales (F2):
`DEFAULT_INTERVAL = 50` ms y `asyncUtilTimeout = 1000` ms, con `50 < 200 < 1000`.
El primer sondeo ocurre mucho antes de la resolución (rojo determinista con el
código actual) y la espera corregida conserva 5× de holgura (verde determinista).
**Si con 200 ms no diera rojo, se amplía la ventana hasta que lo dé y se anota el
valor — nunca se relaja la aserción.**

### R2 — Los seis sitios restantes del mismo patrón, uno por uno

**WHEN** un test de `src/screens/health/index.test.tsx` o de
`src/screens/map/index.test.tsx` termine su espera en una observación que **puede
ser cierta mientras una aserción posterior del mismo test es falsa** (F4),
**THE SYSTEM SHALL** hacer que la condición de parada de esa espera **incluya esa
aserción**; **IF** la aserción es de **ausencia** o su valor esperado coincide con
el valor que el nodo muestra **mientras la fuente sigue pendiente**, **THEN THE
SYSTEM SHALL** anclarla primero a una **espera positiva sobre un nodo que sí
distingue el estado final** en ese escenario, y dejar la aserción después.

Aplica **exactamente** a estos seis sitios. El inventario completo de los dos
ficheros —los que se tocan y los que no, con su razón— está en [[design]] §D2 y
§D3; aquí van solo los que cambian.

| id | Sitio (HEAD `69a763f3`) | `it` | Espera actual | Aserción que la sigue | Decisión |
|---|---|---|---|---|---|
| S2 | `health/index.test.tsx:256-272` | `keeps API order and selects the first pet by default` | `waitFor` al orden y al `accessibilityState` de los `pet-chip-*` | `:265-272`: `mockListPets`, `mockListVaccines` y `mockListWeights` llamados con `'pet-1'` | **Mover las tres aserciones de llamada DENTRO del `waitFor` de `:256`.** El render que se espera es el que **habilita** las queries de vacunas y peso (`enabled: selectedPetId !== null`): las llamadas son **posteriores** al estado esperado, no anteriores. Forma ya usada en el propio fichero, `:286-299` |
| S3 | `map/index.test.tsx:500-520` | `R3 (android-map-never-ready): pasa una polyline mapeada por cada viaje` | `waitFor` a `map-view` visible | `:501-520`: `map-view.props.polylines` con dos polilíneas | **Mover la aserción de `polylines` dentro del `waitFor`.** `map-view` se pinta con `last` (`map/index.tsx:269`), pero `polylines` sale de `route` (`:189-198`): fuentes distintas |
| S4 | `map/index.test.tsx:530-531` | `R3 (android-map-never-ready): pasa un array vacío para un día sin viajes` | `waitFor` a `map-view` visible | `:531`: `polylines` `toEqual([])` | **Ancla positiva + aserción.** `polylines` es `[]` **también mientras `route` está pendiente** (`map/index.tsx:189-198`): hoy la aserción pasa por el motivo equivocado. Anclar con `await waitFor(() => expect(screen.getByTestId('stat-distance')).toHaveTextContent('0.0 km'))`, que **solo** es cierto con `route` resuelta a `ok` (`distanceM` es `null` → `'—'` mientras esté pendiente o en error, `map/index.tsx:203-206`), y dejar la aserción de `polylines` detrás |
| S5 | `map/index.test.tsx:585-590` | `uses the latest speed, trip total, fresh age, and live GPS` | `waitFor` a `stat-speed` = `'12.3 km/h'` (query `positions`) | `:588-590`: `stat-distance` (query `route`), `stat-updated` (query `last`), `stat-gps` (query `detail`) | **Mover las tres aserciones de tile dentro del `waitFor`.** Tres fuentes independientes de la esperada. La aserción de `map-stats.props.style` (`:591-598`) **se queda fuera**: es layout estático del mismo commit |
| S6 | `map/index.test.tsx:619-624` | `#94 R2: la antigüedad de la posición ya no mueve el tile de conexión` | `waitFor` a `stat-gps` = `'En vivo'` (query `detail`) | `:622-624`: `stat-speed` `'—'`, `stat-distance` `'0.0 km'`, `stat-updated` `'hace 2 min'` | **Mover las tres aserciones de tile dentro del `waitFor`.** `stat-distance` es el defecto real: con `route` pendiente vale `'—'` y la aserción **falla**. `stat-speed` `'—'` es además una aserción débil (§Fuera de alcance): moverla no la fortalece, y **no** se cambia su valor esperado |
| S7 | `map/index.test.tsx:844-854` | `posts the inverse, disables in flight, and refetches the new label` | `waitFor` al **contador de `mockSetLostMode`** (`:844-851`) | `:852-854`: `lost-mode-button` con `accessibilityState.disabled === true` | **Que la espera termine en el árbol** (`disabled: true`) y **conservar** `expect(mockSetLostMode).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1', true)` **detrás**. Es el sub-patrón **de #72 R2** —esperar a un mock y aseverar el DOM— en un fichero que #72 inventarió y aquí se le escapó. La aserción de contador es monótona y contrato (#72 §D2), así que detrás de la espera de árbol **no se debilita** |

**Regla dura de esta tabla, y del requisito**: ninguna corrección puede aseverar
menos de lo que asevera hoy. Un test que espera mejor y asevera menos **no es un
arreglo, es un candado debilitado**. En los siete sitios (R1 + S2..S7) el conjunto
de aserciones final es **el mismo conjunto**, solo cambia dónde se evalúa.

### R3 — La espera sobre el mock de `map:284` se conserva, y la spec dice por qué

**WHEN** se implemente esta feature, **THE SYSTEM SHALL** dejar el test
`src/screens/map/index.test.tsx` ›
`R4: map resuelve la mascota seleccionada` ›
`selects the first pet and loads its first position (#72 R2)` (`:284-299`)
**byte a byte como está**, incluida su espera sobre `mockGetLastPosition`.

Este requisito existe para **impedir** que se "arregle". Justificación, que es lo
que pide el criterio de aceptación 2 de la entrada #111:

1. **No incumple la convención.** La regla exige que la condición que termina la
   espera sea la misma observación que hacen **las aserciones posteriores**. En
   este test **no hay aserciones posteriores**: el cuerpo entero es
   `await renderMap()` y un único `waitFor` cuya **única** aserción es la llamada.
   Condición de parada y aserción son literalmente la misma expresión.
2. **El árbol no puede sustituirla, comprobado contra la fuente.** En este test
   `getLastPosition` devuelve una promesa que **nunca resuelve**
   (`beforeEach`, `:258`), y `map/index.tsx:174-176` define
   `isLoading = pets.data === undefined || (petsReady && last.data === undefined)`,
   que es **cierto tanto antes como después** de que la lista de mascotas resuelva.
   `MapScreen` **no pinta ningún pet-chip**. Es decir: **ningún nodo del árbol
   distingue el estado final del inicial** en este escenario. Cambiar el fixture
   para que sí lo distinguiera cambiaría lo que el test prueba —pasaría a probar un
   render en vez del id con el que se pide la posición—, y el nombre del test
   (`loads its first position`) dejaría de ser cierto.
3. **Ya está decidido y firmado.** Es el sitio **S6** de
   [[../mobile-add-pet-photo-test-flake/requirements|#72]] §R2, con el mismo
   argumento de invariancia, aprobado por el humano el 2026-09-17: *«La espera se
   conserva tal cual: lo que asevera es la llamada, no el árbol, así que no cae bajo
   esta regla»*. Dos arreglos distintos para el mismo sitio en el mismo repo sería
   deuda nueva.
4. **Qué lo hace robusto, sin tocarlo**: el plazo que venció en `full2`/`full3` fue
   el de RNTL (1000 ms, F2), no el de jest, y el único lever sería
   `asyncUtilTimeout` — prohibido por el §Fuera de alcance **de #72**, que sigue
   vivo. El control disponible es el §Protocolo V de [[design]], y la spec dice sin
   adornos que **no prueba ausencia de flake**.

**Comprobación exacta que lo cierra:**
`git diff origin/main..HEAD -- mobile-pet-tracker/src/screens/map/index.test.tsx`
no muestra **ninguna** línea modificada entre `:284` y `:299` (anclas: el `it` con
el título de arriba y el `});` que lo cierra).

### R4 — La configuración de jest no se toca, y la spec dice por qué

**WHEN** se implemente esta feature, **THE SYSTEM SHALL** dejar
`mobile-pet-tracker/package.json` **sin modificar**: **no** se añade `testTimeout`,
**no** se añade `maxWorkers`, y **no** se toca `asyncUtilTimeout` en ningún sitio.

Decisión razonada (criterio de aceptación 3 de la entrada #111):

- **`testTimeout` no se fija.** No gobierna el plazo que venció. En las cuatro
  corridas rojas el que agotó fue el `waitFor` de RNTL a los **1000 ms** (F2);
  `testTimeout` acota el test entero a 5000 ms y **nunca fue la restricción
  activa**. Subirlo no habría cambiado ni una de las cuatro. Fijarlo sería cargo
  cult: un número nuevo en la config que no toca el mecanismo del fallo, y que a
  cambio **alarga** cada rojo legítimo de toda la suite móvil.
- **`asyncUtilTimeout` tampoco**, que es el plazo que sí gobierna. Subirlo es
  exactamente «esconder la carrera en vez de arreglarla», y está **prohibido por el
  §Fuera de alcance de #72**, aprobado el 2026-09-17: *«nada de subir
  `asyncUtilTimeout`»*. El argumento de #72 se aplica igual aquí: subir el plazo
  alarga *cuánto* se espera al **mismo** predicado, y en el momento del fallo el
  predicado actual (`weight-card` visible) **ya estaba satisfecho** — un plazo más
  largo es **inerte** frente a este fallo. Corregir la espera no toca ningún plazo:
  cambia **cuál** es la condición de parada.
- **`maxWorkers` no se fija.** Reduciría la contención de CPU, no la ventana de
  ordenación: es el mismo tipo de tapadera, y además penaliza cada corrida de CI y
  de `./init.sh`. Y la premisa tampoco aguanta: cuatro de las doce corridas verdes
  se hicieron **con los cuatro núcleos saturados**, así que la saturación por sí
  sola no está demostrada como causa. Queda como perilla disponible si vuelve una
  ventana roja; el primer movimiento en ese caso es comparar contra
  `progress/logs-111/`, no tocar la config.

**Comprobación exacta que lo cierra:**
`git diff origin/main..HEAD -- mobile-pet-tracker/package.json` sale **vacío**.

### R5 — Cero cambio de producción

**IF** durante la implementación apareciera cualquier necesidad de editar un
fichero que no sea de test, **THEN THE SYSTEM SHALL** **parar** y anotarlo en
`progress/impl_mobile-flaky-waits.md` como decisión abierta para el humano, en vez
de editarlo.

Los **únicos** ficheros que esta feature puede modificar son:

- `mobile-pet-tracker/src/screens/health/index.test.tsx`
- `mobile-pet-tracker/src/screens/map/index.test.tsx`
- `specs/mobile-flaky-waits/*`, `progress/*`, `feature_list.json`, `STATUS.md`

**Comprobación exacta que lo cierra** (sin pipe, exit code propio):

```
git diff --name-only origin/main..HEAD -- mobile-pet-tracker/ ':!*.test.tsx'
```

sale **vacío**. En particular `mobile-pet-tracker/src/screens/health/index.tsx`,
`mobile-pet-tracker/src/screens/map/index.tsx` y
`mobile-pet-tracker/package.json` salen intactos.

### R6 — El recuento no se mueve y la suite aguanta cinco corridas

**WHEN** termine la implementación, **THE SYSTEM SHALL** dejar la suite móvil con
**exactamente el mismo número de suites y de tests** que la base, y pasar **cinco
corridas consecutivas de la suite completa en verde**, todas medidas **sin pipe**.

**Forma durable del recuento** — se comprueban las **tres** cosas, porque una cifra
absoluta caduca en cuanto se rebasa la rama:

1. **Delta cero contra la base de la rama** (`origin/main` = `73f14d5e`): el número
   de suites y de tests **no cambia**. Esta feature no añade ni quita ningún `it`;
   solo cambia **dónde** se evalúan aserciones que ya existen.
2. **Cifras absolutas medidas en este árbol**, válidas mientras la rama no se
   rebase: `Test Suites: 77 passed`, `Tests: 1396 passed`;
   `src/screens/health/index.test.tsx` **28**, `src/screens/map/index.test.tsx`
   **58**.
3. **Consistencia interna** (detector de ficheros saltados en silencio):
   `bunx jest --listTests` devuelve `S` rutas, y la línea `Test Suites: … N total`
   de cada corrida cumple **`N == S`**.

Si el implementador concluyera que su diseño **necesita** añadir o quitar algún
`it`, **para**: es una enmienda a esta spec y vuelve al gate. Ninguna de las siete
correcciones de R1/R2 lo necesita.

**Las cinco corridas no prueban ausencia de flake, y esta spec lo dice sin
adornos.** No se conoce el denominador real de las cuatro corridas rojas —no hay registro
de cuántas corridas verdes hubo intercaladas antes de que se guardaran los logs—,
así que **no se puede estimar una tasa**, y sin tasa cinco corridas no cierran nada
estadísticamente. Lo único medido es que la ventana sobrevivió **doce** corridas
verdes seguidas. Son el control que tenemos contra
**regresiones que esta misma feature pudiera introducir**, no una prueba de que la
ventana no vuelva. Lo que sí es determinista es R1: con la viga puesta, el defecto
falla al 100 % y la corrección pasa al 100 %.

Comandos exactos, plazos y criterio de "arreglado": [[design]] §Protocolo V.

---

## Cómo se demuestra el rojo de cada R-id (C4)

**No hay comportamiento nuevo.** R3, R4 y R5 son requisitos de **no-cambio** y R6
es de verificación: ninguno puede tener un rojo "natural", y un test que ya pasa
**no se puede poner rojo quitándole la espera sin más**. Cada R-id declara aquí su
vía **antes del handoff**, como exige `CHECKPOINTS.md` C4, y el `reviewer` la
comprueba en el historial:

| R-id | Vía C4 | Rojo exacto, determinista |
|---|---|---|
| **R1** | **(a) rojo real, sin sustituto** | El commit rojo mete **solo la viga de 200 ms** sobre el test intacto. Falla **siempre** en `:467` con `Unable to find an element with testID: weight-current`, que es **el propio defecto reproducido a voluntad** y la firma literal de `pre1`/`pre2`. El verde mete la corrección. **La viga se queda en el árbol** |
| **R2** | **(b) verificación, probada por mutación de ventana** | Una viga por sitio (§Protocolo M de [[design]]), **transitoria**: se pone, se mide el par viejo-falla / nuevo-pasa, y se quita. Para S4 y para la aserción débil de S6 se registra además la **prueba de zona ciega**: con la viga puesta, el test **actual pasa** (por el motivo equivocado) y el **corregido falla**, que es justo el hueco que la corrección cierra. Evidencia entera en `progress/impl_mobile-flaky-waits.md` |
| **R3** | **(b)**, y su prueba es un `git diff` | El `git diff` de §R3 debe salir sin líneas modificadas en `:284-299`. No hay mutación que valga: el requisito **es** la no-edición |
| **R4** | **(b)**, y su prueba es un `git diff` | `git diff origin/main..HEAD -- mobile-pet-tracker/package.json` **vacío** |
| **R5** | **(b)**, y su prueba es un `git diff` | El `git diff --name-only` de §R5 **vacío** |
| **R6** | **(b)**, y su prueba es el §Protocolo V | Las cinco corridas con exit 0, `N == S` en las cinco y delta de recuento **cero** |

**Regla dura sobre las vigas de R2: son transitorias.** El commit que cierra R2
deja los dos ficheros de test **sin ninguna viga** (la de R1 vive en el test de R1 y
es la única que sobrevive). Comprobación del `reviewer`:

```
git diff origin/main..HEAD -- mobile-pet-tracker/src/screens/map/index.test.tsx | grep -c setTimeout
```

debe dar **0** líneas añadidas con `setTimeout` en el fichero de map.

- [ ] **Vía (b) de R2..R6 aprobada por humano** (fecha: ____) ← casilla propia,
      distinta de la de §Aprobación. `CHECKPOINTS.md` C4 exige que la spec declare
      la vía **por escrito antes del handoff** y que un humano la firme.

---

## Fuera de alcance

Clasificado viñeta a viñeta: **[D]** = delimitación de esta feature;
**[H]** = hallazgo del inventario que queda registrado y **no** se toca.

- **[D] La causa de la ventana roja.** No se identifica y no se promete. Si vuelve,
  se compara el log **entero** contra `progress/logs-111/` y se abre feature nueva.
- **[D] Cualquier cambio de producción** (R5). Si el inventario destapara un bug de
  producción, se anota y se para. **A día de hoy el inventario no ha destapado
  ninguno**: los cinco orígenes de datos de `MapScreen` y los tres de `HealthScreen`
  se comportan como sus tests esperan; lo que está mal es **cuándo** los tests
  miran.
- **[D] Otros ficheros de test.** El barrido de #111 son **exactamente dos
  ficheros**. El sub-patrón de F3 (espera al árbol más débil que la aserción) muy
  probablemente exista en otros; **no se buscan aquí**. Los ficheros de test móviles
  con el mismo tipo de pantalla —`src/screens/alerts/`, `src/screens/pairing/`,
  `src/screens/home/`, `src/screens/profile/`, `src/screens/weight-log/`— quedan
  **nombrados como candidatos no barridos**, sin afirmar que tengan el defecto:
  nadie lo ha comprobado.
- **[H] `map/index.test.tsx:544-554`** (`R3 (android-map-never-ready): conserva
  marker y stats con ruta $kind`): sus dos aserciones de ruta —`polylines`
  `toEqual([])` y `stat-distance` `'—'`— valen **exactamente lo mismo con `route`
  en error que con `route` pendiente** (`map/index.tsx:189-198` y `:203-206`), y
  **no existe ningún nodo del árbol que distinga los dos estados**: la pantalla no
  pinta nada para el error de ruta. Es un **candado tautológico**: hoy pasa sin
  poder fallar por lo que dice probar. **No se toca en #111** porque arreglarlo
  exige o bien cambiar lo que el test prueba, o bien un nodo nuevo en producción —
  las dos cosas están fuera. Queda escrito para que se abra con su propia feature.
- **[H] `map/index.test.tsx:622`** (`stat-speed` `'—'` en S6) y
  **`map/index.test.tsx:1399-1400`** (`muestra el guion mientras el detalle está
  pendiente`): aseveran el valor que el tile muestra **mientras su fuente está
  pendiente**, así que pasan igual sin que la fuente resuelva. Se mueven o se dejan
  según R2 **sin cambiar su valor esperado**; moverlas **no las fortalece** y la
  spec no pretende lo contrario.
- **[H] `health/index.test.tsx:566-576`** (`does not replace a new selection while
  the stale pet list refreshes`): espera sobre
  `queryClient.isFetching({ queryKey: petKeys.list() })` —**la caché de Query**— y
  asevera el árbol (`pet-chip-pet-old` visible) detrás. Es el sub-patrón **estrecho**
  de #72 R2, en un fichero que #72 no inventarió. **No se toca en #111**: la
  aserción es de **persistencia** de un nodo que un `findByTestId` anterior (`:553`)
  ya ancló, así que no hay carrera en la dirección dañina. Queda escrito como el
  segundo sitio que el inventario de #72 se dejó.
- **[D] `docs/conventions.md` no se toca.** La regla que #111 hace cumplir ya está
  escrita ahí desde `28b4934e`; esta feature **no la cambia ni la amplía**. (Y hay
  razón operativa: #109 acaba de añadir una subsección nueva a ese fichero en
  `origin/main` = `e4c9ea99`, y esta rama está cortada de `73f14d5e` a propósito.)
- **[D] Dependencias nuevas: cero.** Las vigas usan `setTimeout` del runtime y los
  `jest.fn` que los dos ficheros ya tienen. No se instala nada.
- **[D] `resetMocks` / `restoreMocks` / `clearMocks` en el bloque `jest`**: mismo
  veto que #72 §Fuera de alcance, por la misma razón (dejaría toda la suite sin
  implementaciones de mock entre tests).
- **[D] Reintentos, `jest.retryTimes`, `it.skip`, `it.failing`, `--runInBand`**:
  nada de eso es un arreglo.
- **[D] `./init.sh` no se lanza.** #111 no toca `backend-pet-tracker/` ni `infra/`.
  El `init.sh` de este repo emite además `warn` (no `fail`) por `RESEND_API_KEY`,
  `RESEND_FROM` y `RESET_LINK_HOST` ausentes del `.env`: **no es de esta feature** y
  no se investiga.
- **[D] Copy y catálogo**: esta feature **no añade ni cambia ninguna clave de
  copy**, así que `src/providers/__tests__/language-provider.test.tsx` —el candado
  que cierra la longitud del catálogo— **no entra** en los ficheros de esta spec.
  Queda dicho explícitamente: si durante la implementación apareciera una clave
  nueva, ese fichero pasa a ser candado obligatorio y la spec se enmienda.
- **[D] C8 (carta de UI, `docs/ui-guidelines.md`)**: no se toca ningún componente,
  estilo, token, dimensión de pantalla ni animación, y no se añade ni se quita
  ningún `testID`. El grep-clean se mantiene trivialmente y ningún criterio de C8
  cambia de estado. Se declara aquí para que el `reviewer` lo marque sin buscar.

---

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
- [ ] Vía (b) de R2..R6 firmada (§C4) ← casilla propia, se firma junto con la spec
