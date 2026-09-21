# review: mobile-map-staleness-single-source (#94)

Fecha: 2026-09-21
Worktree: `/home/claude/sites/Pet-Tracker-wt-ui`
Branch: `feature/94-mobile-map-staleness-single-source`
Punta revisada: `c558fca0` (base `7eb66357`, 16 commits de Codex)

**Veredicto: RECHAZADO**

Hallazgos: **3** (1 bloqueante, 2 no bloqueantes).

El grueso del trabajo es correcto y está verificado dato a dato más abajo: la
enmienda E1 se aplicó exactamente como la firmó el humano, el historial
rojo→verde es real en los siete requisitos automáticos, y las tres mutaciones
en zona ciega que el leader pidió se cazan. El rechazo se apoya en un solo
punto: `design-drift.test.ts` modifica un helper **compartido** por los
candados de otras features, fuera del delta declarado en `design.md`, y con
una justificación escrita que he medido falsa.

---

## Hallazgos

### H1 (BLOQUEANTE) — `sourceFiles()` compartido: candados ajenos debilitados fuera del delta declarado

**Ruta:línea**: `mobile-pet-tracker/src/__tests__/design-drift.test.ts:33-35`

```ts
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
      ? [path]
      : [];
```

`sourceFiles()` (`:25`) es el helper del que cuelgan `filesContaining()` (`:51`)
y `filesMatching()` (`:57`), y por ellos **los 14 describes preexistentes** del
fichero (`C8: la UI no usa clases arbitrarias`, `R3: Card compartido…`,
`#87 R19: use-api no deja huella`, etc.). Al excluir los `*.test.tsx?`
colocados, **todos** esos candados —no solo `#94 R5` (`:488`)— dejan de mirar
los tests colocados bajo `src/` (`src/utils/*.test.ts`,
`src/hooks/*.test.tsx`, `src/screens/**/index.test.tsx`, …).

`specs/mobile-map-staleness-single-source/design.md` declara para este fichero,
literalmente:

> **`mobile-pet-tracker/src/__tests__/design-drift.test.ts`** — añade
> `describe('#94 R5: ...')` al final. Los describes existentes (`C8: ...`,
> `R3: ...`, `R4: ...`, `R9: ...`, `R11 (mobile-device-pairing): ...`) no se
> tocan.

Cambiar el helper **sí los toca**: no cambia su texto, cambia su entrada.

**Y la justificación del reporte no se sostiene.** `progress/impl_…md`
§Supuestos de la spec que resultaron falsos, punto 2, dice que hubo que añadir
el filtro «antes de evaluar el umbral». Lo he medido restaurando el helper a su
forma pre-#94 **dejando los dos `it` de `#94 R5` en su sitio**:

```bash
cd /home/claude/sites/Pet-Tracker-wt-ui/mobile-pet-tracker
# sustituir :33-35 por la forma vieja:  return /\.tsx?$/.test(entry.name) ? [path] : [];
bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts'   # sin pipe
```

→ **exit 0, 39 passed, 39 total.** Con el helper viejo `#94 R5` pasa igual,
porque hoy ningún test colocado declara `STALE_SECONDS` ni compara
`staleSeconds`. El filtro no era necesario para cerrar R5.

**Qué tiene que corregir Codex** (una sola edición, sin tocar nada más):

1. Revertir `design-drift.test.ts:33-35` a su forma de `7eb66357`:
   `return /\.tsx?$/.test(entry.name) ? [path] : [];`
2. Si se quiere conservar la letra de R5 («excluyendo `__tests__/` y los
   `*.test.*` colocados»), darle a `#94 R5` **su propia** lista filtrada —un
   helper local junto al `describe` de `:488`, o un `.filter()` sobre el
   resultado de `filesMatching`— sin alterar `sourceFiles()`.
3. Volver a medir, sin pipe, que las 5 suites del gate dirigido siguen verdes.

No es un rojo: es cobertura preexistente perdida en silencio, que es justo lo
que C4/C7 existen para no dejar pasar.

---

### H2 (no bloqueante) — el candado de comparación de R5 se evade renombrando

**Ruta:línea**: `mobile-pet-tracker/src/__tests__/design-drift.test.ts:494-499`

La segunda aserción de `#94 R5` casa
`/\bstaleSeconds\s*(?:<=|>=|<|>)|(?:<=|>=|<|>)\s*\bstaleSeconds\b/`. Un umbral
local que pase por un alias **no la dispara**. Mutación plantada en
`src/app/(tabs)/map.tsx`, junto a `const updated = …` (`:208`):

```ts
const positionAge = position?.staleSeconds ?? 0;
const isFresh = positionAge <= 120;
```

```bash
bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts'
```

→ **exit 0, 39 passed.** El umbral vuelve al móvil y el candado no lo ve.

**No bloquea** porque R5 está redactado con esa letra exacta en
`requirements.md` («declare un identificador `STALE_SECONDS`, o compare
`staleSeconds` con cualquier operando mediante `<`, `<=`, `>` o `>=`») y la
implementación la cumple al pie. Queda anotado para que el leader decida si
vale una feature propia; no es deuda que Codex deba saldar bajo esta spec.

---

### H3 (no bloqueante) — andamiaje no declarado en `map.test.tsx`

**Ruta:línea**: `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx:238`

`renderMap()` pasa de `await renderWithProviders(<MapScreen />, {…})` a
`return renderWithProviders(<MapScreen />, {…})`. No figura en la tabla
§Andamiaje de `design.md`. Es **equivalente en conducta** —los llamantes siguen
haciendo `await renderMap()`— y la suite lo confirma. Se anota para que conste
en el delta, no para corregirlo.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress`: `feature_list.json` → `94
  mobile-map-staleness-single-source` y ninguna otra (#98 sigue `pending`).
- [x] `#94` **no** está marcada `done` (correcto: R8 sigue abierto).
- [x] `progress/current.md` actualizado, con el reparto de ficheros pactado con
  la sesión #98 y el motivo de diferir `init.sh`.
- [ ] Observación menor (no imputable a Codex): `current.md` cita los gates
  `cf55f1ed` y `0142417b` pero no menciona la firma de E1 `ce652eae`. Lo cierra
  el leader.

## Checklist C3 — Arquitectura

Feature 100 % móvil; no toca `backend-pet-tracker/` ni un fichero (verificado:
`git diff --name-only 7eb66357..HEAD -- backend-pet-tracker/` vacío). Las capas
de `docs/architecture.md` no aplican. Lo que sí aplica —dónde vive la decisión—
se cumple:

- [x] La decisión de estado del collar vive **una sola vez**, en
  `src/utils/device-connectivity.ts:14-22` (`MAP_CONNECTION_LABEL_KEY`), junto a
  `DEVICE_CONNECTIVITY_META` y con su misma anatomía `{ labelKey }`.
- [x] `src/app/(tabs)/map.tsx:208-215` **consume** la tabla, no la duplica, y ya
  no lee `position.staleSeconds` para decidir el badge.
- [x] El reparto es exhaustivo y correcto: `online → map.live`,
  `offline → map.stale`, `none → map.noSignal`, `unknown → map.noSignal`.

## Checklist C4 — TDD (historial rojo→verde comprobado por muestreo)

No me he fiado de la tabla del reporte. He hecho **checkout de los 7 commits
rojos y de sus verdes** y he corrido el test dirigido en cada uno (sin pipe,
rutas entre comillas, comprobando el número de suites impreso). Resultado:

| Par | Commit rojo | exit | Rojo por | Commit verde | exit |
|---|---|---|---|---|---|
| R1 | `d4f2b77f` | **1** | 5 × `#94 R1` | `039ed167` | 0 (13/13) |
| R2 | `2dcebb2a` | **1** | 4 × `#94 R2` + `#87 R18` (quinta clave) | `a83aae5c` | 0 (53/53) |
| R3 | `7f4709bc` | **1** | 2 × `#94 R3` | `2ea2ff9c` | 0 |
| R4 | `feeabb27` | **1** | `#94 R4` + 4 de `R8: stats…` | `83e6d554` | 0 |
| R5 (sitio 1, `map.tsx`) | `cb6084e7` | **1** | las **dos** aserciones `#94 R5` | — | — |
| R5 (sitio 2, `device-connectivity.ts`) | `d6f28bec` | **1** | `#94 R5 › no declara el identificador` | `bcdd65fa` | 0 (39/39) |
| R6 | `8986802d` | **1** | `#94 R6` + `#61 R11` (rótulo del tile) | `8ca103e4` | 0 (81/81) |
| R7 | `d0ea8cb0` | **1** | `#94 R7` | `9bc67e53` | 0 (58/58) |

- [x] Cada `R<n>` tiene al menos un test que lo nombra, prefijado `#94 R<n>`
  según `docs/conventions.md` §Prefijo de feature.
- [x] El historial es test-primero de verdad: **ningún** commit rojo estaba
  verde. No se repite el patrón de #19.
- [x] R5 se cierra por la **vía (b)** que exigía la spec: mutación de producción
  en los **dos** sitios, versionada en rojo y revertida en verde, y el rojo sale
  por la aserción de `#94 R5`, no por `ReferenceError` ni por el rojo de otro
  test.
- [x] Recuentos coincidentes con el delta neto declarado en `design.md`:
  `map.test.tsx` 49 → **58**, `device-connectivity.test.ts` 8 → **13**,
  `design-drift.test.ts` +**2**.

## Checklist C5 — Trazabilidad

- [x] Ninguna fila sin rellenar. La única fila abierta es **R8**, que es el gate
  humano declarado y no delegable (ver §R8).
- [x] Los **15** hashes de `traceability.md` existen y **todos** son ancestros
  de `c558fca0` (`git merge-base --is-ancestor <h> HEAD` → 15/15 OK). La rama no
  se ha rebasado tras rellenar la tabla.
- [x] Cada hash corresponde al requisito que dice (verificado al hacer checkout:
  el rojo de cada par falla por el `#94 R<n>` de su fila).
- [x] Commits en formato `feat(mobile-map-staleness): <desc> (R-ids)` en los 16.
- [x] R9 registra **los dos** hashes (`a83aae5c` y `8ca103e4`) como exige la
  adenda de E1.

## Checklist C6 — Spec aprobada (y enmienda E1)

- [x] `requirements.md` con `status: approved` y casilla `[X] Aprobado por
  humano (2026-09-21)`.
- [x] `[X] Enmienda E1 aprobada por humano (2026-09-21)`.
- [x] Las tres firmas están en el árbol y son ancestros de HEAD, todas del
  humano (`AlexisSM377 <al222111377@gmail.com>`, 2026-09-21):
  `cf55f1ed` "Approve mobile map staleness specification",
  `0142417b` "Approve Map Staleness Design Decisions",
  `ce652eae` "Approve E1 requirements amendment".

### E1 verificada dato a dato

| Qué exige E1 | Medido | OK |
|---|---|---|
| `R4_MAP` en **17** filas | 17 (contadas en `ui-copy-table.ts:99-116`) | ✅ |
| fuera `map.live`, `map.stale`, `map.noSignal` de `R4_MAP` | las tres eliminadas | ✅ |
| `map.gps` sustituida **1:1** por `pairing.connection` | `ui-copy-table.ts:116` | ✅ |
| `R10_PAIRING` gana 4 filas de `device-connectivity.ts` | `map.live` ×1, `map.stale` ×1, `map.noSignal` ×**2** (`:375-378`) | ✅ |
| `expect(R4_MAP).toHaveLength(17)` | `ui-language.test.ts:126` | ✅ |
| título del `it` acorde | `'resuelve las 17 ocurrencias normativas'` (`:125`) | ✅ |
| `expect(R10_PAIRING).toHaveLength(42 + 2 + 1 + 4)` con su comentario | `:168`, comentario `// +4 #94 E1: la tabla del Mapa comparte el util` | ✅ |
| `expect(SCREEN_FILES).toHaveLength(19 + 2 + 1)` **sin cambio** | `:438`, intacta | ✅ |
| ninguna otra cifra de candado movida | `git diff 7eb66357..HEAD -- src/__tests__/ui-language.test.ts` = **exactamente 2 hunks**, los dos declarados | ✅ |

## Checklist C7 — Sin código huérfano

- [x] `STALE_SECONDS` desaparece de `map.tsx` y de todo
  `mobile-pet-tracker/src/` de producción (lo garantiza `#94 R5`).
- [x] El cálculo viejo del badge (`position.staleSeconds <= STALE_SECONDS`) se
  elimina, no se deja muerto al lado.
- [x] `map.gps` se queda en el catálogo sin consumidor: **declarado y aceptado**
  por la spec (R6 paso 3) precisamente para no mover el candado de longitud del
  catálogo, que es de #98.
- [x] No se crea ningún componente nuevo ni se forkea ninguno; `Card` y `PetMap`
  intactos.

## Checklist C8 — Carta de UI (`docs/ui-guidelines.md`)

- [x] Grep-clean sin regresión: `design-drift.test.ts` y
  `consistency-classnames.test.ts` verdes en la suite completa.
- [x] Geometría intacta: las dos aserciones `bottom: 120`
  (`map.test.tsx:595` y `:1199`) **no aparecen en el diff**.
- [x] `#62 R15` (ausencia de `tabular-nums` en `stat-gps`) **no aparece en el
  diff**; tampoco `rounded-xl`/`CONTINUOUS_CORNER` del tile.
- [x] `Skeleton` de pantalla completa sin cambios; R3 resuelve la ausencia del
  detalle con `'—'`, no con un spinner.
- [x] Cero dependencias nuevas: `package.json` y `bun.lock` **no aparecen** en
  `git diff --name-only 7eb66357..HEAD`.
- [x] Delta de i18n **cero**: `src/i18n/catalog.ts` intacto.

## Límites de la ronda (reparto con #98)

`git diff --name-only 7eb66357..HEAD` devuelve exactamente:

```
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx
mobile-pet-tracker/src/app/(tabs)/map.tsx
mobile-pet-tracker/src/utils/device-connectivity.test.ts
mobile-pet-tracker/src/utils/device-connectivity.ts
progress/impl_mobile-map-staleness-single-source.md
specs/mobile-map-staleness-single-source/traceability.md
```

- [x] **Cero** ficheros de #98 tocados (`src/screens/home/`, `(tabs)/food.tsx`,
  `api/types.ts`, `api/nutrition.ts`, `i18n/catalog.ts`,
  `providers/__tests__/language-provider.test.tsx`, `docs/ui-guidelines.md`).
- [x] Cero ficheros de `backend-pet-tracker/`.
- [x] Cero dependencias nuevas.

## Mutación en zona ciega

Las tres que pidió el leader, más dos de control. **Todas revertidas**; el árbol
quedó limpio en `c558fca0` (`git status --porcelain` vacío tras cada una).

| # | Mutación | Dónde | Resultado |
|---|---|---|---|
| A | invertir `online`/`offline` en la tabla compartida | `src/utils/device-connectivity.ts:20-21` | **CAZADA** — exit 1, 8 rojos: `#94 R1` ×2, `#94 R2` ×3, `#94 R4`, `#94 R7`, `R8: stats…`. El badge se pone rojo. |
| B1 | revertir **una sola** fila de E1, sin mover la longitud: `pairing.connection` → `map.gps` | `src/__tests__/ui-copy-table.ts:116` | **CAZADA** — exit 1, `#65 R4` y `#65 R18` rojos (`uses: 0`, esperado 1). El candado es de contenido, no solo de longitud. |
| B2 | borrar una de las dos filas duplicadas `map.noSignal` | `src/__tests__/ui-copy-table.ts:377-378` | **CAZADA** — exit 1, `#65 R10` y `#65 R18` rojos. La dimensión `×2` de E1 está viva. |
| C1 | umbral local con **nombre nuevo**: `const FRESHNESS_LIMIT = 120;` + `position.staleSeconds <= FRESHNESS_LIMIT` | `src/app/(tabs)/map.tsx` | **CAZADA** — exit 1, `#94 R5 › no compara staleSeconds con ningún umbral`. |
| C2 | umbral local **vía alias**: `const positionAge = position?.staleSeconds ?? 0; positionAge <= 120` | `src/app/(tabs)/map.tsx` | **ESCAPA** — exit 0, 39/39 verdes → **H2**. |
| C3 | `const STALE_SECONDS = 120;` en el segundo sitio (el que el candado no tiene por qué mirar) | `src/utils/device-connectivity.ts` | **CAZADA** — exit 1, `#94 R5 › no declara el identificador`. |
| D | restaurar `sourceFiles()` a su forma pre-#94 | `src/__tests__/design-drift.test.ts:33-35` | **VERDE** (39/39) → prueba que el cambio de helper era innecesario: **H1**. |

Estado final verificado: `git rev-parse HEAD` = `c558fca06cb276a54d6230ba5d4b12bff050b9c8`,
branch `feature/94-mobile-map-staleness-single-source`, `git status --porcelain`
vacío salvo este propio fichero de review.

## R8 — gate humano, no cerrado aquí

- [x] Nadie lo ha dado por cerrado: la fila de `traceability.md` dice
  `pendiente`, el reporte de Codex lo declara pendiente, y `#94` sigue
  `in_progress` en `feature_list.json`.
- [x] La implementación lo deja **verificable**: el Mapa y la píldora del hero de
  la Home derivan ya del mismo `deviceConnectionState(device)`
  (`src/utils/device-connectivity.ts`), que es lo que el smoke tiene que
  observar moviéndose a la vez en las dos pantallas.
- Pendiente del humano: dev build de **Android** (nunca Expo Go: `expo-maps` no
  existe ahí), poller de posiciones parado, y confirmar además el caso firmado
  en D3 (collar `online` con fix viejo → `En vivo` + `hace N min`).

## Gate ejecutado

`./init.sh` **no se ha ejecutado**, por instrucción expresa del leader: LocalStack
y Postgres se comparten con la sesión que lleva #98 y dos `init.sh` a la vez dan
e2e rojos falsos (lección del 2026-09-06 y 2026-09-17).

**No es imprescindible para esta ronda**: la feature no toca un solo fichero de
`backend-pet-tracker/` (verificado arriba), así que el gate real es jest móvil +
typecheck. Los he corrido yo, en primer plano, sin pipe y sin `Monitor`:

```bash
cd /home/claude/sites/Pet-Tracker-wt-ui/mobile-pet-tracker
bunx jest > <fichero>; echo $?     # sin pipe: el exit es de jest, no de tail
bunx tsc --noEmit; echo $?
```

```
Test Suites: 77 passed, 77 total
Tests:       1366 passed, 1366 total
Snapshots:   1 passed, 1 total
Time:        42.908 s
Ran all test suites.
JEST_EXIT=0

TSC_EXIT=0
```

Sin regresiones: 77 suites verdes, ninguna saltada. (El reporte de Codex declara
los mismos 1366 tests; coincide con mi medición independiente.)

---

## Qué falta para aprobar

Solo **H1**. Es una edición de una línea más, si se quiere, un filtro local para
`#94 R5`:

1. `design-drift.test.ts:33-35` vuelve a
   `return /\.tsx?$/.test(entry.name) ? [path] : [];`
2. El filtro de `*.test.*` que pide la letra de R5, si se conserva, vive dentro
   del `describe('#94 R5…')` de `:488`, no en `sourceFiles()`.
3. Re-medir sin pipe las 5 suites del gate dirigido y la suite completa.

H2 y H3 **no** hay que tocarlos en esta ronda: H2 es conforme a la letra de R5
firmada y, si el leader lo quiere cerrar, es feature propia; H3 es equivalente
en conducta y solo queda anotado.

Nada más de la feature necesita cambios: E1 está aplicada exactamente como se
firmó, el historial rojo→verde es real en los 7 requisitos automáticos, los
límites del reparto con #98 se respetan al 100 % y la suite móvil está verde.
