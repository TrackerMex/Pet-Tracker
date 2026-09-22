# review: mobile-flaky-waits (#111)

Fecha: 2026-09-22 UTC
Worktree: `/home/claude/sites/Pet-Tracker-wt-ui` · branch `feature/111-mobile-flaky-waits`
Rango revisado: `5251e10c` (handoff) → `5c2ac3d5` (HEAD). Base de rama: `73f14d5e`
Reporte revisado: `progress/impl_mobile-flaky-waits.md`

**Veredicto: RECHAZADO**

Dos hallazgos bloqueantes. Ninguno de los dos es un rojo de la suite: el gate
numérico está entero y verde, medido por mí. El primero es evidencia C4 que la
spec aprobada exige y que **no existe porque no puede existir** (lo medí con dos
vigas distintas): necesita enmienda firmada por humano, no código. El segundo sí
es código: una aserción que desapareció en S4, contra la regla dura de §R2.

`./init.sh` **no se ejecutó**, por mandato de `requirements.md` §Fuera de alcance
y `design.md` §Protocolo V (#111 no toca `backend-pet-tracker/` ni `infra/`, y los
puertos son de la sesión vecina). El gate real de esta feature es jest + `tsc`.

---

## Hallazgos bloqueantes

### B1 — C4 vía (b) de R2 incompleta en S2: el par rojo/verde no es obtenible

`tasks.md` §R2(1) y `requirements.md` §C4 exigen, **por sitio**, el par
viejo-falla / nuevo-pasa con la viga de §Protocolo M. Para **S2**
(`health/index.test.tsx` › `keeps API order and selects the first pet by default`)
ese par **no está** en el reporte, y Codex lo declara como desviación.

Lo verifiqué yo, y **Codex tiene razón**, con una medida que él no hizo:

| Medida (mía, sin pipe) | Viga | Cuerpo | Resultado |
|---|---|---|---|
| Codex (reportado) | 200 ms y 800 ms en `mockListVaccines`/`mockListWeights` | viejo | exit 0 (pasa) |
| **mía** | **200 ms en `mockListPets`** — la fuente que **sí** abre la puerta a esas llamadas | viejo (`5251e10c`) | **exit 0, `27 skipped, 1 passed`** |

Salida: `/tmp/rev-s2-probe.txt`. Retrasar la fuente tardía no sirve
(`toHaveBeenCalledWith` registra en la **invocación**, no en la resolución) y
retrasar la fuente que **habilita** las queries tampoco: las llamadas se disparan
en el efecto del **mismo commit** que pinta el chip seleccionado, que es lo que el
`waitFor` ya esperaba. **No hay ventana**, y por tanto no hay mutación de ventana
que dé rojo.

Consecuencia que el `reviewer` no puede resolver solo: si no hay ventana, S2
tampoco cumple el criterio F4 de la propia spec («la observación que termina la
espera **puede ser cierta mientras una aserción posterior es falsa**»). El cambio
aplicado es inocuo y no debilita nada, pero **la vía (b) firmada por el humano el
2026-09-22 no se cumple en ese sitio**, y C4 no se puede marcar.

**Qué lo cierra** (ninguna de las dos es trabajo del implementer):
enmienda firmada de `requirements.md` §C4 + `design.md` §Protocolo M que reconozca
S2 como sitio sin rojo posible —o que lo saque de R2—, reabriendo el gate **solo
para la enmienda**. El propio reporte de Codex pide exactamente esto y deja la
feature en `in_progress`; coincido con él.

### B2 — S4 asevera menos que antes: `map-view` visible se perdió (regla dura de §R2)

Commit `9051eb77`, hunk `@@ -527,7 +529,9 @@` de
`mobile-pet-tracker/src/screens/map/index.test.tsx`, test
`R3 (android-map-never-ready): pasa un array vacío para un día sin viajes`
(HEAD `:523-536`).

| | Conjunto de aserciones |
|---|---|
| Base `73f14d5e` | `expect(screen.getByTestId('map-view')).toBeVisible()` · `polylines` `toEqual([])` |
| HEAD | `expect(screen.getByTestId('stat-distance')).toHaveTextContent('0.0 km')` · `polylines` `toEqual([])` |

`toBeVisible()` sobre `map-view` **no se movió: se eliminó**. §R2 es literal: «En
los siete sitios (R1 + S2..S7) el conjunto de aserciones final es **el mismo
conjunto**, solo cambia dónde se evalúa», y «ninguna corrección puede aseverar
menos de lo que asevera hoy». Es el único sitio de los siete donde el conjunto
cambia; en **S3**, el test gemelo del mismo `describe`, Codex sí conservó
`map-view` visible dentro del nuevo `waitFor`, así que la propia rama contradice
su criterio.

Atenuante, medido contra la fuente y por eso lo llamo de una línea: `map-view` y
el bloque de stats se pintan bajo **el mismo gate**
(`petsReady && last.data?.kind === 'ok'`, `src/screens/map/index.tsx:269`), y el
`screen.getByTestId('map-view')` de `:535` es síncrono y lanza, así que la
**existencia** sigue cerrada. Lo que se pierde es el matcher de visibilidad.

**Qué lo cierra**: añadir `expect(screen.getByTestId('map-view')).toBeVisible();`
detrás del ancla, sin tocar nada más. Delta de tests: cero.

---

## R-id por R-id

| R-id | Veredicto | Qué medí |
|---|---|---|
| **R1** | **CUMPLE** | Rojo real verificado por mí: `git checkout 60cf0534 -- <health test>` → `exit 1`, **`Unable to find an element with testID: weight-current`** en `src/screens/health/index.test.tsx:472`, `1 failed, 27 passed, 28 total`. Firma idéntica a `progress/logs-111/pre1.txt`. **No** es `ReferenceError` ni módulo sin resolver (el único ruido son `console.warn` de uniwind, preexistentes). El commit `60cf0534` toca **un solo fichero** y mete **solo** la viga de 200 ms: la espera de `:465` queda intacta. Verde en `a054f085`: `exit 0`, `28 passed`. Las 4 aserciones se conservan (`weight-card` visible, `Peso`, `weight-current` `12.4 kg`, `weight-variation` `+0.4 kg`) más la pulsación de `weight-log-link`. La viga **se queda** |
| **R2** | **NO CUMPLE** | S3, S5, S6, S7: conjunto de aserciones idéntico, solo cambia dónde se evalúa (verificado hunk a hunk). S2: cambio correcto pero **sin evidencia C4 posible** → **B1**. S4: **falta una aserción** → **B2**. Zona ciega de S4 **re-medida por mí**: con viga de 200 ms en `mockGetDayRoute` y `trips: [makeTrip()]`, el cuerpo **corregido falla** (`Expected: 0.0 km / Received: 0.8 km`, exit 1) y el cuerpo **viejo pasa** (exit 0, `57 skipped, 1 passed`). La justificación de Codex aquí es **verdadera** |
| **R3** | **CUMPLE** | Bloque protegido `:284-299` (`selects the first pet and loads its first position (#72 R2)`) **idéntico byte a byte** entre `73f14d5e` y HEAD: 393 bytes contra 393, comparación de cadenas `True`, y ni siquiera se desplazó de línea. El título **no aparece** en `git diff 73f14d5e..HEAD -- map/index.test.tsx` (121 líneas, `grep -c` = 0) |
| **R4** | **CUMPLE** | `git diff origin/main..HEAD -- mobile-pet-tracker/package.json` **vacío**. Sin `testTimeout`, sin `maxWorkers`, sin `asyncUtilTimeout`. `bun.lock` sin cambios: **cero dependencias nuevas** |
| **R5** | **CUMPLE** | `git diff --name-only origin/main..HEAD -- mobile-pet-tracker/ ':!*.test.tsx'` **vacío**, y también contra la base real de la rama (`73f14d5e`). **0 ficheros de producción tocados**. El delta de la rama sobre `mobile-pet-tracker/` son exactamente los dos ficheros de test |
| **R6** | **CUMPLE** | Abajo, §Gate numérico. Delta cero en las tres cifras, `N == S`, 5/5 verdes |

**Vigas supervivientes** (§C4, regla dura): `+1` línea con `setTimeout` en el diff
de health —la de R1, dentro de `shows the current weight and opens the weight log`—
y **`0`** en el de map. Ninguna viga de R2 sobrevivió.

---

## Gate numérico (medido por mí, sin pipe, `bun`/`bunx`)

`rm -f mobile-pet-tracker/.expo/types/router.d.ts` antes de medir.

```text
V0  exit=0   bunx jest --listTests → S = 77
tsc exit=0   bunx tsc --noEmit → salida vacía (0 bytes)
health exit=0   Test Suites: 1 passed, 1 total   Tests: 28 passed, 28 total
map    exit=0   Test Suites: 1 passed, 1 total   Tests: 58 passed, 58 total
V1     exit=0   Test Suites: 2 passed, 2 total   Tests: 86 passed, 86 total
run 1 exit=0   Test Suites: 77 passed, 77 total   Tests: 1396 passed, 1396 total
run 2 exit=0   Test Suites: 77 passed, 77 total   Tests: 1396 passed, 1396 total
run 3 exit=0   Test Suites: 77 passed, 77 total   Tests: 1396 passed, 1396 total
run 4 exit=0   Test Suites: 77 passed, 77 total   Tests: 1396 passed, 1396 total
run 5 exit=0   Test Suites: 77 passed, 77 total   Tests: 1396 passed, 1396 total
```

- **Delta cero** contra la base: `77 / 1396` y `28 / 58` por fichero, idéntico al
  gate declarado. Esta feature no añadió ni quitó ningún `it`.
- **Consistencia interna (§R6.3)**: `N = 77 total` en las cinco corridas y
  `S = 77` rutas de `--listTests` → **`N == S`**. Ningún fichero saltado en
  silencio.
- `perf-cache-*` borrado antes de cada corrida (el sequencer de jest reordena el
  fichero rojo al frente, y eso haría de la corrida 2 el control más favorable).
- **Las cinco corridas no prueban ausencia de flake** y esta review no las usa
  como si lo probaran: la ventana de #111 ya sobrevivió doce verdes seguidas. Son
  control de regresión de esta feature, nada más.

Logs: `…/scratchpad/{v0,tsc,health,map,v1,v2-run-1..5}` y
`/tmp/rev-r1-red.txt`, `/tmp/rev-r1-green.txt`, `/tmp/rev-s4-blind-{old,new}.txt`,
`/tmp/rev-s2-probe.txt`.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#111; `grep -c` = 1)
- [x] `progress/current.md` describe la sesión activa de #111
- [ ] N/A `progress/history.md`: la sesión no está cerrada todavía

## Checklist C3 — Arquitectura

- [x] N/A justificado: la feature no toca `backend-pet-tracker/` ni `infra/`, y
      `docs/architecture.md` (domain/application/infrastructure) no aplica a
      `mobile-pet-tracker/`. Verificado: el delta de la rama sobre la app son dos
      ficheros `.test.tsx` y nada más

## Checklist C4 — TDD

- [x] Historial test-primero real en R1: rojo `60cf0534` → verde `a054f085`, no
      todo junto. Cada commit toca su fichero de test + `traceability.md`
- [ ] **Vía declarada respetada en todos los sitios** → **NO**: falta el par de
      S2 (**B1**), imposible de obtener; medido con dos vigas distintas
- [ ] Ningún test nombra los R-ids **de #111** (`R1`…`R6`). Los títulos siguen
      siendo los de las features que los crearon (`#72 R2`, `#94 R2`). El mapa
      R-id → test vive solo en `traceability.md`. **No lo cuento como bloqueante**
      —la spec firmada define el cierre de cada R-id por `git diff` y por
      protocolo, no por título— pero queda anotado: el precedente del repo (#72,
      #94) sí etiquetaba el título del test que tocaba, y hacerlo aquí sería delta
      cero en las seis titulaciones editables (en R3 está **prohibido**)
- [x] Ningún commit rojo falla por `ReferenceError` ni por mutación de un doble:
      el rojo de R1 es el defecto reproducido sobre el cuerpo intacto

## Checklist C5 — Trazabilidad

- [x] `specs/mobile-flaky-waits/traceability.md` sin ninguna fila "pendiente"
- [x] Los seis hashes citados son ancestros de HEAD (`git merge-base
      --is-ancestor` OK en los seis): la tabla no caducó por rebase
- [x] Formato de commit conforme (`test(mobile-flaky-waits): … (R1)` /
      `(R2)`). Nit no bloqueante: `5c2ac3d5 docs(mobile-flaky-waits): finalize
      traceability` no lleva R-ids

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved`
- [x] Casilla «Aprobado por humano (fecha: 2026-09-22)» marcada, firmada vía
      Notion en `a04e893e`
- [x] Casilla propia de §C4 «Vía (b) de R2..R6 firmada» marcada
- [x] Ningún requisito modificado después de la aprobación: los commits
      posteriores a `a04e893e` no tocan `specs/mobile-flaky-waits/requirements.md`

## Checklist C7 — Sin código huérfano

- [ ] N/A — #111 no reemplaza ni deprecia nada; es cero cambio de producción

## Checklist C8 — UI móvil

- [x] N/A justificado y verificado: no se toca ningún componente, estilo, token,
      dimensión, animación ni `testID`. El delta son dos ficheros de test, así que
      el grep-clean y los criterios de dimensiones, skeleton, reutilización y
      touch target se mantienen sin cambio de estado

---

## Hallazgos no bloqueantes

1. **La zona ciega de `stat-speed` en S6 no es demostrable, y la culpa es de la
   spec.** §C4 pide «el corregido falla» para esa aserción, pero §Fuera de alcance
   dice de la misma aserción que «moverlas **no las fortalece** y la spec no
   pretende lo contrario». Las dos frases se contradicen; Codex midió lo honesto
   (viejo pasa / corregido pasa). **No exige código**: va en la misma enmienda de
   B1.
2. **Titulación sin `(#111 R<n>)`** — ver C4 arriba.
3. **`5c2ac3d5` sin R-ids** en el mensaje.
4. El reporte de Codex es fiel en todo lo que re-medí: la firma del rojo de R1, el
   `0.8 km` de la zona ciega de S4, las 121 líneas del diff de map, los diffs
   vacíos de R4/R5 y las cifras del Protocolo V coinciden con mis medidas. La
   única corrección de fondo es que su explicación de S2 se queda corta: también
   falla la viga sobre `mockListPets`, que es el lever que sí habría tenido
   sentido probar.

## Qué falta para aprobar

1. **B2** — una línea en `map/index.test.tsx` (restaurar `toBeVisible()` de
   `map-view` detrás del ancla de S4). Trabajo de implementer.
2. **B1** — enmienda firmada por el humano en §C4 / §Protocolo M sobre S2 (sin
   rojo posible), y de paso la contradicción de la zona ciega de `stat-speed`.
   **No es trabajo de implementer**: es gate.

Con esas dos cosas, y re-corriendo el gate numérico tras B2, esto se aprueba.
