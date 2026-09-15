# explore: mobile-add-pet-photo-test-flake (#72)

Fecha: 2026-09-15
Rama: `feature/72-mobile-add-pet-photo-test-flake` (HEAD `7c1dc5c9`, base `origin/main` = `9c3dcab6`)
Autor: subagente `explorer`. **Solo lectura**: no se ha tocado ni una línea de
`mobile-pet-tracker/`. Salidas crudas en
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker-mobile-pet-tracker/f91fbbe2-d34d-48eb-b00c-50e3e768878d/scratchpad/72/`
(`SUMMARY.txt`, `plain-*.log`, `w4-*.log`, `band-*.log`, `more-*.log`,
`probe-mock-semantics.out`, `criterio4-scan.txt`).

> Convención de este documento: **[HECHO]** = verificado con fichero:línea o con
> comando + salida guardada. **[REC]** = recomendación, no verificada.
> **[ABIERTO]** = no resuelto.

---

## 0. Resumen en cinco líneas

1. **[HECHO]** El flake B (alerts) **está reproducido en esta rama** y su causa es
   exacta y demostrable: el test espera a la caché de TanStack Query y luego
   asserta el DOM de forma síncrona, y la caché se escribe **una macrotarea antes**
   del re-render.
2. **[HECHO]** El flake A (add-pet) **no** lo causa una cola de `mockResolvedValueOnce`:
   en el árbol exacto que falló no existía ninguna cola del picker. La hipótesis
   central de la entrada de la feature queda **falsada**.
3. **[HECHO]** `undefined.canceled` es la firma exacta de un mock **sin
   implementación** (probado contra `jest-mock` 29.7.0), pero el `beforeEach` raíz
   la rearma síncronamente antes de cada test. Esa contradicción **sigue abierta**.
4. **[HECHO]** "Muerde en la primera pasada y la segunda sale verde" es, al menos
   en parte, un **artefacto del sequencer de jest**: un fichero que falla se
   programa el primero en la corrida siguiente. Eso invalida el criterio 5 tal y
   como está escrito.
5. **[HECHO]** El patrón B afecta a **7 sitios** en 5 ficheros; además
   `profile/index.test.tsx` arrastra el mismo agujero de higiene del picker que
   add-pet ya cerró en 43183c4a.

---

## 1. El entorno de medida

**[HECHO]** Suite móvil en HEAD: **73 suites / 1284 tests**. (El dato de 1275 que
circula es de un commit anterior; sirve igual como detector de ficheros saltados,
pero hoy el número correcto es 1284.)

**[HECHO]** Coste de una corrida completa de la suite móvil sola
(`bunx jest`, 4 núcleos, workers por defecto = 3):

| modo | duración |
|---|---|
| por defecto | 30-39 s (mediana ~33 s) |
| `--maxWorkers=4` | 30-35 s |
| `--runInBand` | ~75 s |

No se ejecutó `./init.sh` (colisiona con la sesión Backend en Postgres/LocalStack);
la suite móvil es jest puro y no toca ninguno de los dos.

**[HECHO]** Configuración de jest: bloque `"jest"` en
`mobile-pet-tracker/package.json` (preset `jest-expo` 57.0.4, jest 29.7.0,
RNTL 14.0.1, react 19.2.3).
- **No hay `resetMocks`, `restoreMocks` ni `clearMocks`** ni en el proyecto ni en
  el preset: verificado con
  `node -e "const p=require('jest-expo/jest-preset'); console.log(p.resetMocks, p.restoreMocks, p.clearMocks)"` → todo `undefined`.
- `setupFilesAfterEach` = solo `test/jest-setup.js`, que mockea
  `react-native-worklets` y llama `setUpTests()` de reanimated. **Ningún hook de
  ciclo de vida de mocks.**
- **[HECHO]** No existe ni un `jest.resetModules()`, `jest.isolateModules` ni
  `jest.doMock` en `src/` ni en `test/` (grep). Lo único que hay es
  `jest.clearAllMocks()` y 16 `jest.restoreAllMocks()`.

→ Los cuatro candidatos "de configuración" que planteaba el encargo quedan
**descartados**.

---

## 2. Flake B — alerts: REPRODUCIDO, causa cerrada

### 2.1 Reproducción

**[HECHO]** Tasa observada: **1 de 32** corridas completas en esta rama. La roja fue
`plain-07`:

```
plain #7 exit=1 | Test Suites: 1 failed, 72 passed | Tests: 1 failed, 1283 passed
```

`scratchpad/72/plain-07.log:6197` → `FAIL src/screens/alerts/index.test.tsx`;
`:6684` → `● #78 R4 … › pinta y reintenta cada error de la primera página` con
`Unable to find an element with testID: alerts-error` y el árbol impreso mostrando
`alerts-loading` con sus tres `alert-row-skeleton-*`. Frame final:
`at getByTestId (src/screens/alerts/index.test.tsx:206:21)`.

Es **la misma firma** que el avistamiento de CI (PR #132) y la del cierre de #63.

### 2.2 Estado ACTUAL del fichero tras #97 (verificado contra HEAD, no contra el histórico)

| dato | histórico (#132) | HEAD `7c1dc5c9` |
|---|---|---|
| línea del `it` | 149 | **190** |
| nombre del test | igual | `'pinta y reintenta cada error de la primera página'` (sin cambios) |
| `waitFor` a la caché | — | **199-205** |
| aserción de DOM síncrona | — | **206** |

**[HECHO]** La forma del bucle **no cambió** con #97 (que añadió los describes de
las líneas 971 y 1002); solo se desplazó 41 líneas. El patrón sigue ahí:

```ts
for (const [index, error] of errors.entries()) {
  await waitFor(() =>                                   // 199
    expect(rendered.queryClient.getQueryData(alertKeys.list())).toEqual(  // 202
      expect.objectContaining({ pages: [error] }),
    ),
  );
  expect(screen.getByTestId('alerts-error')).toHaveTextContent(  // 206  ← síncrono
```

### 2.3 Mecanismo, a nivel de fuente

**[HECHO]** Los tres eslabones:

1. `src/screens/alerts/index.tsx:68` usa `useInfiniteQuery`; `:156` pinta
   `alerts.isPending ? <View testID="alerts-loading">` y `:168` el
   `<Text testID="alerts-error">`. El estado visible depende de que **React
   re-renderice**, no de la caché.
2. `node_modules/@tanstack/query-core/build/modern/notifyManager.js:1-3`:
   `const defaultScheduler = systemSetTimeoutZero;` — query-core escribe
   `query.state.data` **síncronamente** al resolver, pero notifica a los
   suscriptores (→ React) a través de `scheduleFn`, que por defecto es
   `setTimeout(cb, 0)`. Es decir: **una macrotarea de retraso, siempre**.
3. `waitFor` de RNTL sondea su callback; en cuanto el callback deja de lanzar,
   resuelve. Su callback mira la caché (paso 1 ya cumplido) y no el DOM (paso 2
   todavía pendiente). Si el sondeo cae en esa ventana, `getByTestId` de la línea
   206 encuentra la pantalla en `alerts-loading`.

**Esto no es un test "lento": es un test que espera a la señal equivocada.** La
ventana existe siempre; la carga solo cambia la probabilidad de caer dentro.

### 2.4 Por qué "meterlo dentro del waitFor" NO es subir el timeout (criterio 3)

**[REC, con el argumento por escrito que pide la feature]:**

- Subir el timeout alarga **cuánto tiempo** se espera al **mismo predicado**. Aquí
  eso no puede funcionar: en el momento del fallo el predicado actual
  (*"la caché tiene el error"*) **ya está satisfecho**. Esperar más al predicado
  que ya se cumplió no cambia nada. Un timeout más largo es inerte frente a este
  fallo, y por eso mismo su prohibición no está en juego.
- Meter la aserción en el `waitFor` (o usar `await screen.findByTestId('alerts-error')`)
  **no toca el timeout** — el de RNTL sigue siendo el mismo por defecto — sino que
  cambia **cuál** es la condición de parada: de "la caché" a "lo que el test afirma
  de verdad, que es lo que ve el usuario". Es la corrección de una aserción mal
  escrita, no una concesión de tiempo.
- Diferencia operativa comprobable: con el timeout subido, el test seguiría siendo
  capaz de fallar (la ventana es de ordenación, no de duración); con la aserción
  correcta deja de haber ventana.
- **[REC]** La aserción de caché **no debe desaparecer**: es contrato de #78 R4.
  Se conservan las dos; la del DOM pasa a ser la que manda la espera.

---

## 3. Flake A — add-pet: la hipótesis de la entrada está FALSADA, la causa sigue abierta

### 3.1 El árbol que realmente falló

**[HECHO]** Los dos logs rojos que existen
(`…/023e81fc…/scratchpad/init-cierre-92.log`, 2026-09-14 18:53, y
`…/init-review-93.log`, 2026-09-15 03:15) corresponden a
`main@961b330a` (2026-09-14 03:25). Prueba de identificación, no suposición:

- el stack dice `src/screens/add-pet/index.tsx:115:16` → en `961b330a` la línea 115
  es exactamente `if (picked.canceled || !picked.assets[0]) return;`
- el segundo error dice `index.test.tsx:248` → en `961b330a` la 248 es
  `await waitFor(() => expect(screen.getByTestId('pet-avatar').props.photoUrl)…)`
- el fichero de test tiene ahí **386 líneas**; en HEAD tiene 494.

**[HECHO]** Las **dos** coincidencias de `reading 'canceled'` por log son **el mismo
test contado dos veces**: el bloque inline del `FAIL` y el resumen final
(`init-cierre-92.log:10942` y `:14862`, con `FAIL … add-pet` en `:10699` y `:14859`).
Un solo test roto: `R7: foto opcional tras alta › uploads a chosen preview only
after createPet succeeds`, con dos errores encadenados (el `TypeError` y, como
consecuencia, el `photoUrl` que se queda en `null`).

### 3.2 En ese árbol NO había ninguna cola de `mockResolvedValueOnce` del picker

**[HECHO]** En `961b330a`, todas las apariciones de `mockLaunchImageLibrary` en el
fichero son: la captura (`:58`), el `beforeEach` raíz (`:81` `mockReset()`,
`:82` `mockResolvedValue({canceled:true, assets:null})`), el armado propio de R7
(`:228`, `mockResolvedValue` **persistente**) y el test de higiene R1 (`:277`, `:281`).
**Cero `mockResolvedValueOnce`.**

**[HECHO]** El primer `mockResolvedValueOnce` del picker lo introdujo `eb931f7e`
(2026-09-14 18:49, describe R2 de `detail-state-reset`), que llegó a `main` el
2026-09-15 en el PR #130 (`507c3396`) — **después** de los tres avistamientos de A.

→ **"lo que se agota es la cola de un `mockResolvedValueOnce` consumida por un test
anterior" es falso para los dos casos de los que hay log.** La spec no debe partir
de ahí.

### 3.3 Qué significa exactamente `undefined.canceled` (probado)

**[HECHO]** `scratchpad/72/probe-mock-semantics.js` contra el `jest-mock` 29.7.0
instalado (salida en `probe-mock-semantics.out`):

| operación | resultado |
|---|---|
| `mockResolvedValueOnce×2` → `mockReset()` → `mockResolvedValue(d)` | `['d','d','d']` — la cola se borra, la implementación vuelve |
| `mockResolvedValue(g)` → `clearAllMocks()` | `'g'` — **la implementación sobrevive** |
| `mockResolvedValue(k)` → `restoreAllMocks()` | `'k'` — no afecta a un `jest.fn()` |
| `mockResolvedValue(h)` → `resetAllMocks()` | **`undefined` crudo** |

→ `await <mock>()` dando `undefined` **solo** ocurre con el mock **sin
implementación**. Es la firma de un `mockReset`/`resetAllMocks`, no de una cola
agotada (una cola agotada cae al `mockResolvedValue` por defecto y devuelve
`{canceled:true}`, que el componente maneja bien).

### 3.4 La contradicción, y lo que queda descartado

`add-pet/index.test.tsx` en HEAD (idéntico en la parte relevante a `961b330a`):

- `:93-94` `beforeEach` raíz: `mockReset()` **y acto seguido** `mockResolvedValue({canceled:true,…})`
- `:323` `beforeEach` de R7: `jest.clearAllMocks()` — **conserva la implementación** (§3.3)
- `:336` el propio test arma `mockResolvedValue({canceled:false, assets:[…]})`
- `:355` `await fireEvent.press(screen.getByTestId('add-pet-photo'))`
- componente: `src/screens/add-pet/index.tsx:133` llama y `:137` lee `.canceled`

Descartes **[HECHO]**:

- **Identidad del módulo**: el `jest.mock('expo-image-picker', factory, {virtual:true})`
  de `:20-22` **no** parte la identidad. `node_modules/jest-resolve/build/resolver.js:463`
  (`getModulePath` devuelve el propio `moduleName` cuando no empieza por `.`) y
  `:614` (`_getVirtualMockPath` consulta `_virtualMocks` con esa clave) hacen que el
  mock virtual se registre bajo el especificador desnudo `'expo-image-picker'`,
  global para todo el registry del fichero. El `import * as ImagePicker` del
  componente (`index.tsx:4`) obtiene el mismo `jest.fn` que el test arma.
- **Referencia capturada**: el componente **no** captura la función en el import;
  lee la propiedad en la llamada (`ImagePicker.launchImageLibraryAsync(…)`,
  `index.tsx:133`). No hay dos instancias.
- **Configuración de jest**: §1, no hay `resetMocks`/`restoreMocks`/`clearMocks`.
- **`resetModules` / `isolateModules` en otro fichero**: no existen (§1).
- **Otro fichero mockeando el picker**: `src/app/(tabs)/__tests__/screens.test.tsx:25-27`
  y `src/screens/profile/index.test.tsx:58-60` lo mockean, pero cada fichero de test
  tiene su propio registry y su propio `ModuleMocker`; no hay canal entre ellos.
- **`jest.restoreAllMocks()` de `:478`**: está en el `afterEach` del describe de la
  línea 460 (#62 R12), que corre **después** de R7, y de todos modos no afecta a un
  `jest.fn()` (§3.3).

**[ABIERTO]** Con todo eso descartado, para que la llamada devuelva `undefined` el
mock tuvo que estar sin implementación **en el instante de la llamada**, y el único
código que la quita es el `mockReset()` de `:93`, que la repone en la línea
siguiente, síncronamente. Además la llamada al picker es **síncrona** dentro del
`press` (el `await` está después: `index.tsx:133`), así que no puede colarse entre
las dos líneas. **No he encontrado una explicación compatible con el código, y no
voy a inventar una.**

### 3.5 Lo que NO se ha reproducido

**[HECHO]** A **no se reprodujo en 32 corridas completas** de la suite móvil en esta
rama (73 suites cada una, ~18 minutos de CPU en total). Detalle de intentos (todos en
`/home/claude/sites/Pet-Tracker/mobile-pet-tracker`, tally en `SUMMARY.txt`):

| lote | corridas | flags | resultado |
|---|---|---|---|
| `run01` + `plain-01..08` | 9 | por defecto | 8 verdes, **1 roja — pero de alerts (B)**, no de add-pet |
| `w4-01..10` | 10 | `--maxWorkers=4` (sobre-suscripción) | 10 verdes |
| `band-01..03` | 3 | `--runInBand` | verdes |
| `more-01..10` | 10 | por defecto | 10 verdes |

**[HECHO]** La posición de add-pet en esas corridas (orden de finalización) fue
**7-14 de 73**, el mismo régimen en el que falló en los logs rojos (14ª y 15ª), así
que los intentos no cayeron fuera de la zona sospechosa: simplemente no mordió.

**[HECHO]** Nada arregló A entre el último avistamiento y HEAD:
`git diff 961b330a HEAD -- mobile-pet-tracker/src/screens/add-pet/index.tsx`
no toca ni `handlePickPhoto` ni la llamada al picker (solo añade el reset de foco
de R2). El mecanismo, sea cual sea, sigue vivo.

---

## 4. ¿Una causa o dos?

**Respuesta razonada: DOS causas distintas.** Evidencia, no intuición:

1. **[HECHO]** Firmas incompatibles. B falla con la caché ya escrita y el DOM
   atrasado: es una carrera **dentro de un test**, entre dos observadores del mismo
   hecho. A falla con un mock **sin implementación**, que según §3.3 solo puede
   producirlo un `reset`. Una ventana de render no borra la implementación de un
   `jest.fn()`; un `reset` no deja la caché de Query por delante del DOM.
2. **[HECHO]** Poblaciones disjuntas. En los ocho logs de `wt-backend` hay 2 rojos
   de A y **cero** coincidencias de `alerts-error`. En mis 32 corridas del árbol
   principal hay 1 rojo de B y **cero** de A. Si fueran la misma causa, esperaríamos
   verlas mezclarse; en 40 corridas registradas no se han cruzado ni una vez.
3. **[HECHO]** Ficheros y librerías distintas: B depende de `@tanstack/react-query`
   (que `add-pet` **no usa**: el formulario no monta ninguna query) y A del
   `ModuleMocker` de jest.

**Lo único común [HECHO]** es el *contexto* de corrida completa, y eso ya tiene
explicación propia sin necesidad de una causa raíz compartida (§5).

---

## 5. El sequencer: por qué "la primera pasada muerde y la segunda sale verde"

**[HECHO]** `node_modules/@jest/test-sequencer/build/index.js`:
- `:92-93` `const FAIL = 0; const SUCCESS = 1;`
- `:269` guarda `[estado, duración]` por fichero
- `:280` `hasFailed()` → los ficheros que **fallaron en la corrida anterior se
  programan los primeros**; el resto por duración descendente; sin datos, por tamaño.
- La caché es `/tmp/jest_ru/perf-cache-*` (una por proyecto, compartida por usuario
  entre worktrees). Verificado: entradas del tipo `add-pet/index.test.tsx [1, 2580]`.

**[HECHO]** Confirmación empírica en mis propias corridas: en `plain-07` (roja),
alerts terminó **7º**; en `plain-08`, inmediatamente después, alerts se programó
**1º** y pasó. Exactamente el mismo salto que muestran los logs de la sesión
Backend: add-pet **14º/15º** en las rojas → **3º** en las dos verdes de repetición.

Consecuencias, que la spec tiene que tragar:

- **[HECHO]** La "segunda corrida verde" **no es una absolución**: es el fichero
  corriendo en una posición distinta, mucho más temprana, en un worker recién
  arrancado. Es el peor control posible, no el mejor.
- **[HECHO]** El **criterio de aceptación 5** ("suite móvil verde en tres
  ejecuciones consecutivas de `./init.sh`") es, tal y como está, un gate
  autoengañoso: basta un rojo para que las dos siguientes se ejecuten en la
  configuración más favorable.
- **[REC]** La spec debería fijar el orden en las repeticiones de verificación:
  borrar `/tmp/jest_ru/perf-cache-*` entre corridas, o usar `--runInBand`, o
  ejecutar la suite móvil sola (33 s, no hace falta `init.sh` entero) un número
  alto de veces. A 33 s la corrida, **30 repeticiones cuestan ~17 minutos**: es un
  número realista para un criterio 5 que signifique algo. Tres corridas de
  `init.sh` no lo son.

---

## 6. Criterio 4 — inventario de ficheros con el mismo patrón

### 6.1 Patrón B: `waitFor` sobre algo que no es el DOM, seguido de aserción de DOM síncrona

Barrido con `scratchpad/72/scan.py` (salida en `criterio4-scan.txt`) y revisión
manual de cada hit. **[HECHO]**, 7 sitios en 5 ficheros:

| fichero:línea del `waitFor` | qué espera | línea de la aserción síncrona | gravedad |
|---|---|---|---|
| `src/screens/alerts/index.test.tsx:199` | `queryClient.getQueryData(alertKeys.list())` | `:206` `getByTestId('alerts-error')` | **el reproducido** |
| `src/screens/alerts/index.test.tsx:693` | `mockAckAlert` llamado 1 vez | `:694` `getByTestId('alert-row-alert-1-ack')` `toBeDisabled()` | alta: afirma un estado de render tras un contador de mock |
| `src/screens/alerts/index.test.tsx:648` | `mockSignOut` llamado 1 vez | `:649` `queryByTestId('alerts-action-error')` `toBeNull()` | media: falla al revés (puede **pasar** con el render atrasado) |
| `src/screens/pairing/index.test.tsx:562` | `signOut` llamado 1 vez | `:563` `queryByTestId('pairing-error')` `toBeNull()` | media, mismo sentido |
| `src/screens/pairing/index.test.tsx:947` | `signOut` llamado 1 vez | `:948` `queryByTestId('pairing-error')` `toBeNull()` | media, mismo sentido |
| `src/app/(tabs)/__tests__/map.test.tsx:272` | `mockGetLastPosition` llamado con… | `:279` `getByTestId('map-loading')` `toBeVisible()` | alta |
| `src/app/(tabs)/__tests__/weight-log.test.tsx:401` | `mockListWeights` llamado 2 veces | `:402-` `getByTestId('weight-input').props.value` | alta: lee el valor pintado tras un refetch |

**[HECHO]** `alerts:199` es el **único** de los siete que espera a `getQueryData`.
Los otros seis esperan a contadores de mocks, que es el mismo error de fondo:
*el efecto observado no es el efecto afirmado*.

Aviso operativo **[HECHO]**: `src/app/(tabs)/…` lleva paréntesis. En cualquier
comando o spec, `(tabs)` **debe ir escapado** (`\(tabs\)`) porque jest trata el
argumento como regex; sin escapar el fichero se salta en silencio con exit 0.

### 6.2 Patrón A: ficheros que mockean `expo-image-picker` o resetean módulos

**[HECHO]**, barrido completo de `mobile-pet-tracker/src`:

| fichero | qué hace | estado |
|---|---|---|
| `src/screens/add-pet/index.test.tsx:20-22` | `jest.mock('expo-image-picker', …, {virtual:true})`; `:93-94` `mockReset()` + rearme **por test** | higiene correcta (43183c4a) — y aun así falló |
| `src/screens/profile/index.test.tsx:58-60` | mockea el picker, lo captura en `:135` y lo arma con `mockResolvedValue` **persistente** en `:533`, `:546`, `:579` | **No tiene ni un `mockReset` del picker.** Solo `jest.clearAllMocks()`, que conserva la implementación (§3.3): el picker queda armado con el valor del último test que lo tocó para todos los siguientes. **Es el mismo defecto que add-pet cerró en 43183c4a, sin cerrar.** |
| `src/app/(tabs)/__tests__/screens.test.tsx:25-27` | mockea el picker y **nunca lo arma ni lo usa** | inerte hoy; si algún día ese fichero renderiza una pantalla que llame al picker, dará exactamente `undefined.canceled` |
| `src/__tests__/design-drift.test.ts:155` | solo fija la versión `~57.0.13` | sin relación |

**[HECHO]** `jest.resetModules()` / `jest.isolateModules` / `jest.doMock`: **cero
apariciones** en todo `src/` y `test/`.

---

## 7. Las dos preguntas abiertas más importantes para la spec

**P1 — ¿Cómo se cierra A si no se puede explicar leyendo el código?**
Todos los caminos que producirían `undefined` están descartados con fuente (§3.4),
y A no se reprodujo en 32 corridas (§3.5). La spec tiene que decidir entre:
(a) exigir reproducción antes de arreglar —con el riesgo de bloquear la feature
indefinidamente—, o (b) aceptar un **endurecimiento diagnóstico**: que el próximo
avistamiento diga *qué invariante se rompió* en vez de `undefined.canceled`.
Mi recomendación es (b), y está desarrollada en §8.2. Sea cual sea, la spec debe
escribir explícitamente que la hipótesis de la cola agotada está falsada, para que
Codex no la reimplemente.

**P2 — ¿Qué gate sustituye al criterio 5?**
Tres `./init.sh` verdes no prueban nada mientras el sequencer premie al fichero que
acaba de fallar (§5). La spec tiene que fijar **número de repeticiones y orden**
(caché de sequencer borrada, o `--runInBand`, o suite móvil sola ×N), y decir
cuántos rojos en cuántas corridas se consideran "arreglado". Sin ese número, el
criterio 2 ("un número de veces que la spec fija") queda sin rellenar y el gate
vuelve a mentir.

---

## 8. Recomendaciones

### 8.1 Causa B (alerts) — **[REC]**, con base en §2.3 (HECHO)

- Mover la aserción de DOM dentro del `waitFor`, o sustituir
  `expect(screen.getByTestId('alerts-error'))` por
  `expect(await screen.findByTestId('alerts-error'))` en
  `src/screens/alerts/index.test.tsx:206`. **Conservar** la aserción de caché de
  `:199-205`: es contrato de #78 R4.
- Justificación escrita de por qué esto no incumple el criterio 3: §2.4.
- Aplicar el mismo criterio a los otros seis sitios de §6.1. Los dos
  `queryBy…toBeNull()` de `pairing` y el de `alerts:649` conviene convertirlos en
  `await waitFor(() => expect(…).toBeNull())` **acompañados de una espera positiva**
  (algo que sí aparezca), porque una aserción de ausencia contra un render atrasado
  pasa por el motivo equivocado.
- **[REC] No** tocar `alerts/index.tsx`. El componente se comporta bien; el
  defecto está en el test.

### 8.2 Causa A (add-pet) — **[REC]**, sin causa raíz probada; dígase así en la spec

1. **Cerrar el agujero de higiene que sí está probado**: dar a
   `src/screens/profile/index.test.tsx` el mismo `beforeEach` raíz que add-pet tiene
   desde 43183c4a (`mockReset()` + rearme por defecto del picker). Es un defecto
   real, demostrado (§6.2), independiente de si explica A o no.
2. **Hacer diagnosticable el próximo avistamiento** en lugar de adivinar: que la
   R7 falle nombrando el invariante roto en vez de reventar con
   `undefined.canceled`. Dos formas, ambas compatibles con el criterio 3 (ni
   reintento, ni timeout, ni skip):
   - afirmar el armado del mock inmediatamente antes del `press`, o
   - hacer que la factoría del mock (`index.test.tsx:20-22`) lance un error con
     nombre cuando se la llama sin implementación, en vez de devolver `undefined`.
   Con eso, el siguiente rojo en CI dice si el mock llegó desarmado al `press` o si
   la llamada vino de otro sitio, que es justo la bifurcación que hoy no podemos
   resolver.
3. **[REC] Quitar el `{virtual: true}`** de `index.test.tsx:22`. `expo-image-picker`
   es una dependencia real (fijada en `design-drift.test.ts:155`), así que el flag
   no aporta nada y sí quita la resolución del módulo real: el mock puede divergir
   de la API de verdad sin que nadie se entere. Es reducción de superficie, **no es
   el arreglo del flake** y no debe venderse como tal.
4. **[REC] Rechazar** la "solución" de poner `resetMocks: true` en la config de
   jest. Es precisamente el estado que produce la firma `undefined` (§3.3): dejaría
   a toda la suite sin implementaciones de mock entre tests y convertiría un flake
   en una regresión masiva.

### 8.3 Sobre el gate — **[REC]**

- Medir la suite móvil sola (33 s) para las repeticiones del criterio 5, no
  `./init.sh` entero.
- Borrar `/tmp/jest_ru/perf-cache-*` (o fijar el orden) entre repeticiones, y
  decirlo en la spec, o el gate mide otra cosa.
- **[HECHO, aviso]** `./init.sh | tail` devuelve el código de `tail`: medir sin
  pipe antes de declarar verde.

---

## 9. Lo que NO se hizo

- No se ejecutó `./init.sh` (colisión con la sesión Backend en el Postgres/LocalStack
  compartidos). Todas las mediciones son de la suite móvil aislada, que no toca
  ninguno de los dos.
- No se comparó `node_modules` ni `.expo/types/router.d.ts` entre worktrees: el
  coordinador retiró esa hipótesis al aparecer 2 rojos y 6 verdes **en el mismo
  entorno** (`wt-backend`). Dato incidental verificado antes de retirarla:
  `mobile-pet-tracker/.expo/types/` en el árbol principal está **vacío** hoy, así
  que la diferencia que se sospechaba ni siquiera existe ahora mismo.
- No se tocó ni un fichero de `mobile-pet-tracker/`.
