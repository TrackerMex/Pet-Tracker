# review: mobile-no-collar-states-pingo (#159)
Fecha: 2026-10-09
Veredicto: RECHAZADO

Bloqueante: **B1**. No hay candado que exija que el rol del botón de emparejar salga del
detalle y no del listado (R3.1, R4.1-R4.3, D2). El código de producción es correcto; lo
que falta es un test. Todo lo demás está verde.

## Contexto
- Worktree: `/home/claude/sites/Pet-Tracker-wt-159`, branch `feature/159-mobile-no-collar-states-pingo`.
- H0 = `f9fb79ed`. HEAD = `664b95a7`, confirmado con `git rev-parse` al revisar. Hay 18 commits en `f9fb79ed..HEAD`.
- Spec firmada en `b304538f` (`docs(specs): firma de la spec de #159 aprobada vía Notion`).
- Reproducción de rojos y sondas: en un worktree temporal propio en scratchpad (detached), con jest por fichero. Cada sonda se revirtió con `git checkout HEAD --` y quedó con `diff --quiet` = 0. El worktree de la feature no se tocó.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress. `feature_list.json` tiene 1 `in_progress`: id 159.
- [x] `progress/current.md` actualizado. Nombra #159, el worktree, la branch, la firma, el handoff y H0.

## Checklist C3 — Arquitectura (móvil)
- [x] La pantalla consume las queries existentes (`detail`, `last`). No hay query nueva, como dice D2.
- [x] `canPairCollar` lee rol y collar del mismo `detail.data` (`kind === 'ok' && pet.myRole === 'owner' && pet.device === null`). Coincide literal con D2.
- [x] `EmptyState` se reutiliza sin cambios (`empty-state.tsx` sin diff respecto a H0).
- [x] N/A backend: no hay cambios en `backend-pet-tracker/`.

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra. Desde R1 hasta R9 hay un `describe('#159 Rn: …')`. R7 y R8 se nombran en `empty-state.test.tsx`; los `it` preexistentes de editor y home solo cambiaron literales, como prescribe tasks.md (ver O5). R10 es la prueba de humo humana.
- [x] Historial test-primero: cada `test(` toca solo tests y es ancestro estricto de su `feat(`. Los `feat(` solo tocan tests para los K-candados que prescribe design.md (K1-K7).
- [x] Rojos reproducidos por mí:

| R | Commit rojo | Rojos | Motivo | ¿Cuadra con la spec? |
|---|---|---|---|---|
| R1 | 6906af80 | 13 | aserción | sí |
| R2 | 56918113 | map 3 + componente 2 | consulta y aserción | sí (ver O2) |
| R3 | f346baf3 | 2 | consulta | sí |
| R4 | 9506bd88 | 8 | aserción | sí |
| R5 | 14e76905 | 3 | 1 aserción de className, 2 consulta | sí |
| R7 | c3312097 | 4 (editor 2, language-provider 1, componente 1) | aserción | sí |
| R8 | c6430e68 | 5 (home 3, componente 2) | aserción | sí |

R6 y R9 son candados de comportamiento ya verde (`cc53c018`, `1c54b04d`). Su rojo se demuestra con las sondas S6a-b y S9a-b, que reejecuté (ver §Sondas).

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas "pendiente" salvo R10. R10 es el gate humano de humo en dev build de Android, y así lo prevé la spec (§Aprobación, casilla 3 sin marcar).
- [x] Pares rojo→verde con `git merge-base --is-ancestor`, todos exit 0:
  - f9fb79ed→6906af80
  - 6906af80→b77f23ff
  - 56918113→00755951
  - f346baf3→9b89f6c8
  - 9506bd88→f4f48736
  - 14e76905→176d9d45
  - c3312097→92d9a59b
  - c6430e68→1e45b478
  - cc53c018 y 1c54b04d son ancestros de HEAD.
- [x] Los 14 nombres de test citados en traceability.md existen en los ficheros indicados (grep -F, ninguno falta).
- [x] Formato de commits: `test(mobile-no-collar-states): #159 Rn …` / `feat(mobile-no-collar-states): #159 Rn …`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved`, con las casillas 1 y 2 marcadas (2026-10-09). La casilla 3 (humo R10) sigue abierta, como corresponde.

## Checklist C7 — Sin código huérfano
- [x] Se borró `map.trackingNeedsCollar` de `en` y de `es`, y está retirada en `specs/mobile-ui-language/design.md` §2.23 con la fila exacta de R2.4.
- [x] La Card del 402 de Zonas seguras se sustituyó por `EmptyState`. Se borró su test `pinta el 402 sin Reintentar` de `geofences/index.test.tsx`, y R5 lo cubre.
- [x] Copy obsoleto: grep de las 8 cadenas en `mobile-pet-tracker/`, `docs/` y `specs/`.
  - `mobile-pet-tracker/`: solo los candados negativos y la fila de retirada en `empty-state.test.tsx:304-313`.
  - `docs/`: 0.
  - `specs/`: solo texto histórico de specs ya cerradas (`mobile-map-live`, `mobile-device-pairing`, `mobile-geofences`, `mobile-home-dashboard`, `mobile-home-weight-without-collar`, `mobile-home-stats-strip`, `mobile-geofence-editor`) y del inventario de `mobile-ui-language` (filas 229/265 y §2 de #41, que es historial), más el texto de la propia spec #159. No queda código vivo.

## Checklist C8 — Carta de UI
- [x] En los ficheros de producción (`map/index.tsx`, `geofences/index.tsx`, `catalog.ts`), las líneas añadidas no traen hex, `StyleSheet`, clases arbitrarias `[...]`, `Animated`/`withTiming`/`withSpring`/`entering`/`exiting`/`LayoutAnimation` ni `expo-linear-gradient` (grep exit 1).
- [x] El copy de L1-L4, L6 y L7 está en `en` y `es` y coincide literal con la tabla de literales. L5 reutiliza `home.pairCollar`.
- [x] `specs/mobile-ui-language/design.md` tiene `### §2.23 — Añadidos por #159 — Pingo sin collar` entre §2.21 y §3, con 4 filas añadidas, la de retirada (4 columnas) y las cambiadas de R7 y R8.
- [x] `docs/verification.md` paso 5: la frase de R2.5 está en una sola línea.
- [x] Las poses son `collar` en `map-no-tracking` y en `geofences-no-tracking`. `map-no-pets` conserva `talk`.
- [x] Estos ficheros no tienen diff respecto a H0: `package.json`, `bun.lock`, `app.json`, `src/components/empty-state.tsx`, `src/screens/geofence-editor/index.tsx`, `src/screens/home/index.tsx`, `src/theme`, `assets/` (`git diff --quiet` exit 0).
- [x] Lista cerrada: `git diff --name-only f9fb79ed HEAD` da exactamente los 15 ficheros del handoff.
- [x] Las skills que cargó Codex (según el impl report) coinciden con el catálogo de Codex del handoff.

## Sondas (en HEAD 664b95a7)

Declaradas por la spec, reejecutadas por mí:

| Sonda | Rojos | Cuáles | ¿Como se declara? |
|---|---|---|---|
| S4a | 1 | R4.4 | sí |
| S4b | 3 | filas de rol de R4 | sí |
| S4c | 4 | error, unreachable, missing-config, pending | sí |
| S6a | 1 | owner | sí |
| S6b | 4 | family, walker, vet, detalle error | sí |
| S7 | 1 | `it` de la Card de R7 | sí |
| S8a | 2 | declaración y voz de R8 | sí |
| S8b | 1 | summary-note | sí |
| S9a | 5 | filas de map | sí |
| S9b | 5 | filas de geofences | sí |

Zonas ciegas, mías:

| Sonda | Mutación | Resultado |
|---|---|---|
| **Z1** | en `canPairCollar` de `src/screens/map/index.tsx`, `detail.data.pet.myRole === 'owner' &&` cambia a `selectedPet?.myRole === 'owner' &&` | **sobrevive: 109/109 verdes. B1** |
| Z2 | quitar `kind === 'ok'` y usar `detail.data?.pet?.…` | sobrevive. Mutante equivalente (O1) |
| Z3 | pose `talk` en map-no-tracking | 1 rojo (pose de R2) |
| Z4 | título en el body (map) | 10 rojos |
| Z5 | map-no-tracking sin testID | 13 rojos por consulta |
| Z6 | push a otra ruta | 1 rojo (R3.2) |
| Z7 | doble push | 1 rojo (R3.2) |
| Z8 | otra etiqueta en la acción | 1 rojo (R3.1) |
| Z9 | hermano extra junto a EmptyState (map) | 1 rojo (sitio de R2) |
| Z10b | acción de emparejar con clave válida en geofences | 5 rojos, todos en R6 (incluye owner y detalle error) |
| Z11 | pose distinta en geofences | 1 rojo |
| Z12 | título en el body (geofences) | 2 rojos |
| Z13 | `geofences-add` sin comprobar `kind` | 5 rojos (incluye sitio de R5) |
| Z14 | EmptyState de geofences envuelto en View | 1 rojo (sitio de R5) |
| Z15 | geofences-no-tracking sin testID | 9 rojos |
| Z16 | solo `// Animated` en geofences | 1 rojo (fila `\bAnimated\b` de R9) |
| Z17 | `// <EmptyState` en el editor | 2 rojos (#155 R10 y #159 R7) |

## Observaciones

### B1 (bloqueante): el origen del rol del botón de emparejar no tiene candado
- **Qué dice la spec.**
  - R3.1: "WHEN el detalle de la mascota seleccionada … resuelve `ok` con `pet.myRole === 'owner'` AND `pet.device === null`".
  - R4.1-R4.3: "el detalle resuelve `ok` con `myRole` family / walker / vet", y cada caso "con su propio candado".
  - D2 (design.md:44-45): "El rol y el collar salen **del mismo detalle**: … sin cruzar listado y detalle".
- **Qué pasa.** Si `canPairCollar` lee el rol del listado (`selectedPet?.myRole`) en vez del detalle (sonda Z1), los 109 tests de `src/screens/map/index.test.tsx` siguen verdes.
- **Causa.** En todos los tests de R3 y R4, el rol del listado y el del detalle son el mismo, como prescribe tasks.md T3/T4:
  - `#159 R3` usa `pets: [makePet()]` y `pet: makePet()`, owner en los dos.
  - `#159 R4` (`it.each(['family','walker','vet'])`) usa `pets: [makePet({ myRole: role })]` y `pet: makePet({ myRole: role })`.
- **Asimetría.** El collar sí tiene candado contra el listado: en R4.4 el listado lleva `device: null` y el detalle `device: online`. Al rol le falta el candado equivalente.
- **No es culpa del implementador.** El hueco nace en tasks.md. Hay que enmendar T3/T4 (solo tests; requirements.md y D2 ya dicen lo correcto) y reabrir el gate solo para esa enmienda.
- **Qué hace falta.** Dos candados en `src/screens/map/index.test.tsx`, en el bloque `map-no-tracking`:
  1. En `#159 R4`, un `it.each(['family','walker','vet'])` con listado `[makePet()]` (owner) y detalle `makePet({ myRole: role })`. Espera título y cuerpo visibles y `queryByTestId('map-no-tracking-action')` = null. Cubre R4.1-R4.3 cada uno con su candado.
  2. En `#159 R3`, la inversa: listado `[makePet({ myRole: 'family' })]` y detalle `makePet()` (owner, `device: null`). Espera `map-no-tracking-action` visible con `Vincular collar`.
- **Cómo verificarlo.** Los dos nacen verdes, así que su rojo se demuestra con sondas que la enmienda debe declarar:
  - Z1 (sustituir) → 4 rojos: 3 del caso 1 y 1 del caso 2.
  - OR (`selectedPet?.myRole === 'owner' || detail…myRole === 'owner'`) → 3 rojos del caso 1.
  - AND (`selectedPet?.myRole === 'owner' && detail…`) → 1 rojo del caso 2.

### No bloqueantes
- **O1.** Z2 es un mutante equivalente. Las variantes de `PetState` que no son `ok` (unauthorized, error, unreachable, missing-config) no tienen `pet`, así que `detail.data?.pet?.myRole` se comporta igual sin la guarda de `kind`. No es un hueco.
- **O2.** Flake de carga. Al reproducir el rojo de R2 con map y componente a la vez salió un 6.º rojo: `#72 R2 selects the first pet and loads its first position`, un `waitFor` sobre un contador de mock en un test preexistente que no se tocó. Repetido solo, tras borrar `/tmp/jest_*`, dio los 3 declarados. Ese test usa `waitFor` sobre un contador de mock, en contra de conventions §Esperas; es deuda previa y no es de #159.
- **O3.** Cosmético: hay dobles líneas en blanco antes de `const noCollarRows` y antes del `describe` R2 en `empty-state.test.tsx`, y donde estaba el `it` borrado en `geofences/index.test.tsx`. El lint pasa.
- **O4.** La sonda Z10 original (`t('geofences.add')`, una clave inexistente) rompe con `TypeError` en `language-provider.tsx:73` y arrastra 4 rojos ajenos. Es comportamiento previo de `t()`, no de #159. Z10b, con una clave válida, da los 5 rojos limpios de R6.
- **O5.** Los `it` de editor (R7) y de home (R8) conservan sus nombres preexistentes sin R-id, porque tasks.md solo prescribe cambiar sus literales. R7 y R8 se nombran en `empty-state.test.tsx`.
- **O6.** R10 está pendiente: es el gate humano. Los pasos de R10 en `progress/impl_mobile-no-collar-states-pingo.md` cuadran con R10.1: dev build de Android, `bunx expo start --dev-client` y los 5 pasos.

## Output de ./init.sh
El leader lo corrió en HEAD 664b95a7. Log en `scratchpad/159-init.log`, con mtime 18:38:11, posterior al commit HEAD (18:30). Exit 0 según el leader. Resumen:
```
✅ Build exitoso
Test Suites: 187 passed, 187 total
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 97 passed, 97 total
Tests:       2415 passed, 2415 total
✅ Tests pasados
✅ Esquema y recursos e2e listos
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
Los recuentos coinciden con la tabla del leader.

---

# Ronda 2 — Enmienda E1

Fecha: 2026-10-09
HEAD revisado: `340967ba` (branch `feature/159-mobile-no-collar-states-pingo`, worktree `Pet-Tracker-wt-159`)
H0E1: `c8064d03`. Commits de la ronda: `3224d502` (rojo) → `203ea96e` (verde) → `340967ba` (trazabilidad).
Veredicto: RECHAZADO (1 bloqueante: B2)

## Comprobaciones

### Producción idéntica a 664b95a7
- `git diff --quiet 664b95a7 HEAD -- mobile-pet-tracker/src/screens/map/index.tsx` → `exit=0`. [x]

### Lista cerrada desde H0E1
- `git diff --name-only c8064d03 HEAD` → exactamente `mobile-pet-tracker/src/screens/map/index.test.tsx`, `progress/impl_mobile-no-collar-states-pingo.md`, `specs/mobile-no-collar-states-pingo/traceability.md`. [x]
- `git log --oneline c8064d03..HEAD` → los tres commits esperados, en orden e1-1, e1-2, e1-3. [x]
- El diff de `index.test.tsx` contra `664b95a7` tiene 0 líneas borradas: ningún `it` existente cambia. [x]

### C6 — Spec y enmienda firmadas
- `requirements.md`: `status: approved`; casillas 1 y 2 marcadas; §Enmienda E1 con su casilla marcada (2026-10-09, vía Notion). [x]

### Gate init.sh (corrido por el leader, no por el reviewer)
- `init-159-e1.log.head`: HEAD `340967bad55b169519b88ed70b51f4d7fd9f00c5`, `exit=0`. Coincide con el HEAD revisado. [x]
- Log: backend unit 187 suites / 1474 tests; 2 suites / 14 tests; móvil `Test Suites: 97 passed, 97 total` y `Tests: 2420 passed, 2420 total` (2415 + 5); e2e `30 passed, 3 skipped` suites y `468 passed, 8 skipped`; `✅ Lint sin errores`, `✅ Typecheck sin errores`, `✅ Todo verde`. Sin líneas `FAIL `. [x]
- `git status --short` limpio al arrancar la revisión (el `eslint --fix` de init.sh no dejó cambios). [x]

### C4 — Rojo → verde
- `3224d502` (rojo) toca `index.test.tsx` (+27: dos `it` al final de `#159 R3`, un `it.each(['family','walker','vet'])` al final de `#159 R4`) **y** `src/screens/map/index.tsx`: las dos últimas líneas de `canPairCollar` pasan de `detail.data.pet.myRole === 'owner' &&` / `detail.data.pet.device === null;` a `selectedPet?.myRole === 'owner' &&` / `selectedPet?.device === null;`. Es la mutación de producción que prescribe E1; ningún doble (`mockListPets`, `mockGetPet`, `makePet`, `noTrackingAfterDetail`) cambia. [x]
- `203ea96e` (verde) toca solo `src/screens/map/index.tsx` y revierte exactamente esas dos líneas (blob `11d85fa3` → `31b4e3d5`, el de `664b95a7`). [x]
- El test no cambia después del rojo: `git diff --stat 3224d502 HEAD -- …/index.test.tsx` vacío. [x]
- Rojo según el impl (`## Reanudación 2`, `159-e1-r.txt`): `Tests: 6 failed, 108 passed, 114 total`. Los dos de R3 caen por consulta (`Unable to find an element with testID: map-no-tracking-action`); R4.4 y las tres filas del `it.each` caen por aserción (`expect(received).toBeNull()` y el `Received` es el botón `Vincular collar`). Coincide con la tabla de tasks.md §Enmienda E1. [x]
- Los commits siguen `test(…)`/`fix(…)`/`docs(…)` con el id `#159 E1`. [x]

## Sondas del reviewer (en HEAD 340967ba, sin commit)

Todas en `const canPairCollar =` de `src/screens/map/index.tsx`. Cada una: `uptime`, `FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > <scratchpad>/probe159-<id>.txt 2>&1; echo "exit=$?"` sin pipe, restaurada con `git checkout HEAD -- mobile-pet-tracker/src/screens/map/index.tsx`. `limpio` es `git diff --quiet HEAD -- mobile-pet-tracker` (el único fichero sucio del worktree es este review).

| Id | Mutación | Carga (1 min) | Resultado | exit | limpio | Qué cae |
|---|---|---|---|---|---|---|
| P1 | rol del listado: `detail.data.pet.myRole === 'owner' &&` → `selectedPet?.myRole === 'owner' &&` (= Z1 / E1a) | 4.37 | `4 failed, 110 passed, 114 total` | 1 | 0 | R3 «…diga otro rol…»; R4 «no pinta el botón a family/walker/vet aunque el listado diga owner» |
| P2 | collar del listado: `detail.data.pet.device === null;` → `selectedPet?.device === null;` (= E1d) | 5.02 | `2 failed, 112 passed, 114 total` | 1 | 0 | R3 «…traiga collar…»; R4 «no pinta el botón al dueño de una mascota con collar» |
| P3 | los dos (= mutación del rojo) | 5.41 | `6 failed, 108 passed, 114 total` | 1 | 0 | las 6 de la tabla del rojo |
| P4 | zona ciega fuera de E1a-E1e (las cinco conservan la guarda `detail.data?.kind === 'ok'`): las tres líneas pasan a `(detail.data?.kind === 'ok' ? detail.data.pet : selectedPet)?.myRole === 'owner' &&` / `(…)?.device === null;`, el listado de respaldo mientras el detalle no es `ok` | 6.41 | `4 failed, 110 passed, 114 total` | 1 | 0 | R4 «no pinta el botón si el detalle resuelve error/unreachable/missing-config» y «…mientras el detalle carga» (preexistentes, aserción) |
| P5 | zona ciega fuera de E1a-E1e (E1b es el OR del rol; nadie prueba el OR del collar): `detail.data.pet.device === null;` → `(selectedPet?.device === null \|\| detail.data.pet.device === null);` | 7.03 | `1 failed, 113 passed, 114 total` | 1 | 0 | R4 «no pinta el botón al dueño de una mascota con collar» (preexistente, aserción) |
| P6 | zona ciega de la inversa del rol en R3 (el listado solo dice `family`): `detail.data.pet.myRole === 'owner' &&` → `selectedPet?.myRole !== 'walker' && detail.data.pet.myRole === 'owner' &&` | 7.31 | **`114 passed, 114 total` — sobrevive** | 0 | 0 | ninguno |
| P6b | igual que P6 con `'vet'` | 4.56 | **`114 passed, 114 total` — sobrevive** | 0 | 0 | ninguno |
| P6c | control de P6 con `'family'` | 5.65 | `1 failed, 113 passed, 114 total` | 1 | 0 | R3 «pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle» (consulta) |

Tipo de rojo (grep sobre cada salida): P1 1 consulta + 3 aserción; P2 1 + 1; P3 2 + 4; P4 0 + 4; P5 0 + 1; P6c 1 + 0. Ningún `ReferenceError`/`TypeError`. El flake de #72 R2 no salió en ninguna de las 8 corridas. Árbol final: `git status --short` → solo ` M progress/review_mobile-no-collar-states-pingo.md`.

Las sondas E1a-E1e de Codex (impl, `### Sonda E1a`…`E1e`) dan 4/3/1/2/1 failed sobre 114, con `limpio=0`, como la tabla de tasks.md. P1 y P2 las reproducen.

## Cobertura de las cláusulas de E1

| Cláusula | Ramas | Candado | Estado |
|---|---|---|---|
| R3.1 inversa del rol: «aunque el listado diga **otro rol**» → hay botón | listado `family`, `walker`, `vet` con detalle owner | solo `family` (`it` «…diga otro rol…») | **`walker` y `vet` ciegas (P6, P6b): B2** |
| R3.1 inversa del collar: «aunque el listado traiga collar» → hay botón | listado con collar / sin collar (la rama de producción es `device === null`, binaria) | `makeDevice('online')` en el listado | [x] (P2, P3; E1d, E1e) |
| R4.1-R4.3 contra el listado: detalle `family`/`walker`/`vet`, listado owner → sin botón | las tres | `it.each(['family','walker','vet'])` | [x] (P1 tumba las tres filas) |
| R4.4 collar del detalle contra listado sin collar | AND y OR | R4.4 preexistente | [x] (P2, P5) |
| D2: rol y collar del mismo detalle, sin caer al listado | detalle cargando / error / unreachable / missing-config | `it` preexistentes de R4 | [x] (P4) |

## C5 — Trazabilidad
- Fila R3: añade los dos `it` nuevos de E1 y `E1: 3224d502 … → 203ea96e …` con sus mensajes. [x]
- Fila R4: añade `no pinta el botón a %s aunque el listado diga owner`, `sondas E1a-E1e` y los mismos hashes. [x]
- Los nombres citados existen literalmente en `index.test.tsx` y nombran su R-id vía el `describe('#159 R3: …')` / `describe('#159 R4: …')`. [x]
- Única fila `pendiente`: R10, el humo humano en dev build de Android (§Aprobación, casilla 3), igual que en la ronda 1. [x]

## C2 / C3 / C7 / C8
- C2: `feature_list.json` con una sola feature `in_progress` (#159); `progress/current.md` registra la enmienda E1 y su firma. [x]
- C3 y C8: ronda solo de tests; producción idéntica a `664b95a7`, ya revisada en la ronda 1. [x]
- C7: N/A, E1 no reemplaza nada.

## Observaciones

### B2 (bloqueante): la inversa del rol de R3 solo vigila el listado `family`; con `walker` o `vet` el botón aún puede obedecer al listado

B1 pedía un candado que exigiera que el rol del botón salga del detalle. E1 lo cierra en un sentido para los tres roles (R4, `it.each`), pero en el otro sentido (listado no-owner, detalle owner → hay botón) solo con `makePet({ myRole: 'family' })`. El `it` dice «aunque el listado diga **otro rol**», que son tres valores.

- P6: `selectedPet?.myRole !== 'walker' && detail.data.pet.myRole === 'owner' &&` en `canPairCollar` → `114 passed, 114 total`, `exit=0`.
- P6b: lo mismo con `'vet'` → `114 passed, 114 total`, `exit=0`.
- P6c (control): con `'family'` cae el `it` de E1 (1 failed, por consulta). El candado funciona, pero solo en esa rama.

En las dos mutaciones supervivientes el botón lee el rol **del listado** (justo lo que D2 prohíbe y B1 denunciaba), y ningún test de `src/screens/map/index.test.tsx` lo ve. Ningún otro `it` del fichero monta listado `walker`/`vet` con detalle owner y estado `no-tracking`: los `it` de R4 con `walker`/`vet` usan el mismo rol en listado y detalle, y ahí la rama del detalle ya oculta el botón.

El hueco nace en la spec: requirements.md §Enmienda E1 y tasks.md §Enmienda E1 prescriben un solo listado, `family`. Codex cumplió el texto al pie de la letra. Para cerrarlo hace falta enmendar la spec (cláusula «otro rol» = `family`, `walker` y `vet` en el listado con detalle owner, cada una con su candado) y otra ronda solo de tests con el mismo patrón (mutación de producción versionada en el rojo y revertida en el verde). Hay que repetir P6 y P6b como sondas de esa ronda.

### No bloqueantes

- **O1. PARADA de Codex en el cierre (`### Medida: 159-e1-final.txt` → `PARADA: Medida /tmp/159-e1-final.txt distinta de la esperada` → `### Corrección del registro auxiliar de BASE`). No es bloqueante.** La medida real cumplía la regla de CIERRE del handoff: `exit=0`, `Test Suites: 10 passed, 10 total`, `Tests: 754 passed, 754 total` (impl, justo tras el comando BASE). La regla de parada del handoff («Si exit no es 0, anota los `●` y PARA») no se disparó. El falso positivo vino de su comprobador auxiliar en `/tmp/`, que tomó los encabezados `● Console` por fallos. Codex no tocó código, no repitió Jest y dejó la corrección por escrito. ALL (`97 passed`, `2420 passed`) y el `init.sh` del leader en `340967ba` lo corroboran. Como proceso es una desviación: escribió una PARADA y siguió sin reanudación humana. Una parada escrita debería ser terminal; si no, el registro deja de distinguir una parada legítima de una auto-anulada. Además, el impl arrastra ~7.400 líneas de volcado `console.info` de HeroUI entre esa medida y la PARADA, lo que obliga a leerlo con grep.
- **O2. Eslabón laxo de la cadena e1-1 (error del leader en el handoff).** `grep -cF 'detail.data.pet.device' = 0` contaba 2 (`deviceConnectionState(detail.data.pet.device)` y `?.batteryPct`). Codex paró bien (impl, `PARADA: Falló …` y `### Diagnóstico del eslabón fallido de e1-1`). La reanudación cambió solo ese eslabón por `'detail.data.pet.device === null'`. El fichero del handoff conserva el texto viejo, como estaba previsto.
- **O3. Flake de #72 R2 (deuda, fuera de alcance).** Salió en la base de Codex (impl, `## Base del Mapa E1 — PARADA`: `R4: map resuelve la mascota seleccionada › selects the first pet and loads its first position (#72 R2)`, `Number of calls: 0`) con carga ~4-5 en 4 CPU. No salió en ninguna de mis 8 corridas (carga 4.4-7.3). Sigue como deuda de #72.
- **O4. Inversa del collar.** Solo se prueba con el listado `makeDevice('online')`. La rama de producción es binaria (`device === null`) y P2, P3, E1d y E1e la tumban, así que no la cuento como cláusula abierta. Solo una mutación que lea un campo concreto del collar del listado (p. ej. `connectivity`) escaparía, y eso ya no es «leer el collar del listado» sino introducir lógica nueva.
- **O5.** R10 sigue pendiente: es el humo humano, igual que en la ronda 1.

## Veredicto ronda 2

**RECHAZADO** — 1 bloqueante (B2). Lo demás está verificado: producción idéntica a `664b95a7`; lista cerrada exacta; rojo→verde con mutación de producción y rojos del tipo declarado; P1-P5 caen como se esperaba; trazabilidad R3/R4 correcta; `init.sh` exit=0 en `340967ba`.

## Output de ./init.sh (corrido por el leader en 340967ba; extracto por grep)
```
340967bad55b169519b88ed70b51f4d7fd9f00c5
exit=0
✅ node disponible (/usr/bin/node)
✅ pnpm disponible (/home/claude/.npm-global/bin/pnpm)
✅ bun disponible (/home/claude/.npm-global/bin/bun)
✅ .env encontrado
✅   DATABASE_URL definida
✅ Dependencias instaladas
✅ Archivos del harness presentes
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso
Test Suites: 187 passed, 187 total
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 97 passed, 97 total
Tests:       2420 passed, 2420 total
✅ Tests pasados
✅ Esquema y recursos e2e listos
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

## Barrido de la Enmienda E2

Fecha: 2026-10-09. Sobre el borrador sin commitear de requirements.md §Enmienda E2 y tasks.md §Enmienda E2, en HEAD `039e6195`. Sondas en producción como en la ronda 2 (restauradas, `git diff --quiet HEAD -- mobile-pet-tracker` → `limpio=0` tras cada una). El test de E2 no existe aún: lo que depende de él va como «no medido».

1. **OK. ¿Cierra B2?** Las filas `walker` y `vet` del `it.each` montan listado `walker`/`vet` sin collar y detalle owner sin collar, y esperan el botón. P6 (`!== 'walker'`) y P6b (`!== 'vet'`) ocultan el botón justo ahí y caerían por consulta, cada una en su fila; P6c en la fila `family`. No medido con el test de E2: es deducción determinista, porque en `340967ba` P6, P6b y P6c dejan intactos todos los demás `it` (114/114, 114/114 y solo el `family` de E1).
2. **CORREGIR. Queda una mutación que lee rol y collar del listado y sobrevive con E2.**
   - **X1:** `detail.data.pet.myRole === 'owner' &&` → `(selectedPet?.myRole === 'owner' || selectedPet?.device === null) && detail.data.pet.myRole === 'owner' &&`. Medida en HEAD `039e6195`: `Tests: 114 passed, 114 total`, `exit=0`, `limpio=0`. Con E2 seguiría verde (no medido): sus tres filas montan el listado con `device: null`, así que el OR es cierto y el botón sale.
   - El hueco tiene una forma concreta. Con el detalle owner sin collar, el botón debe salir para los 8 listados posibles: `myRole` ∈ {owner, family, walker, vet} × `device` ∈ {null, con collar}. Son los dos atributos que decide `canPairCollar`. Tras E2 hay test para 5 de esos listados: owner/null (R3 base), owner/online (E1 collar), y family, walker y vet con null (E2). Faltan family/online, walker/online y vet/online, los tres «no-owner y con collar». X1 es la única función de los dos predicados del botón, con su misma polaridad, que es cierta en los 5 casos medidos y falsa en los 3 que faltan. Las variantes por rol, como `selectedPet?.myRole !== 'walker' || selectedPet?.device === null`, caen en el mismo hueco.
   - **Corrección:** el `it.each` de E2 debe cubrir los 3 roles × {sin collar, con collar} en el listado, por ejemplo con `makePet({ myRole: role, device })` y `device` ∈ {`null`, `makeDevice('online')`}, siempre con el detalle `makePet()`. X1 debe entrar como sonda (E2d). Recuentos derivados con 6 filas: 114 − 1 + 6 = **119**. El rojo de tres líneas da `4 failed, 115 passed, 119 total` (walker y vet, con y sin collar). El verde da 119. E2a, E2b y E2c dan `2 failed, 117 passed` cada una. E2d (X1) da `3 failed, 116 passed` (las tres filas con collar, por consulta). BASE da 759 y ALL 2422 + 3 = **2425**.
3. **OK. Dirección contraria (sin botón): la cubren los `it` existentes.** Para que una mutación natural (OR con un predicado del listado en la polaridad del botón) muestre el botón por error, el predicado tendría que ser cierto en algún listado con `device: null`. Ahí la cazan R4 (listado = detalle por rol), R4 E1 (listado owner/null), R4.4 y los cuatro `it` de detalle no-`ok`. Solo escaparía un predicado cierto únicamente con collar en el listado (`device !== null`), que invierte la condición de D2. No lo cuento como «leer el collar del listado».
4. **OK. Los campos del collar fuera de `device === null`** (`connectivity`, `batteryPct`…) siguen fuera, igual que O4 de la ronda 2: `canPairCollar` no decide sobre ellos.
5. **OK. D2, que el detalle no `ok` no caiga al listado:** P4 en la ronda 2, 4 rojos preexistentes. E2 no lo toca.
6. **OK. Recuentos de E2 tal como están escritos:**
   - el rojo da `2 failed, 114 passed, 116 total`;
   - el verde da 116;
   - E2a, E2b y E2c dan `1 failed, 115 passed, 116 total` cada una;
   - BASE da 756 = 754 + 2 y ALL da 2422 = 2420 + 2, con 97 suites.

   Cuadran entre sí y con la base de 114. Si se aplica la corrección 2, pasan a los derivados de arriba.
7. **OK. La mutación roja de tres líneas compila, pasa lint y no arrastra rojos.** En HEAD `039e6195` (`selectedPet?.myRole !== 'walker' &&`, `selectedPet?.myRole !== 'vet' &&` y la línea original): `bun run typecheck` exit=0, `bunx expo lint --no-cache` exit=0, `jest src/screens/map/index.test.tsx` → `114 passed, 114 total`, exit=0, `limpio=0`. Sin el test de E2 no cae ningún `it`, así que con E2 solo pueden caer las filas nuevas.
8. **OK. Lista cerrada, commits y trazabilidad.**
   - Los mensajes `test(…)`, `fix(…)` y `docs(…)` con `#159 E2` siguen el patrón de E1.
   - El verde restaura desde `664b95a7` y las sondas desde `HEAD`, que es lo correcto (memoria del índice tras checkout).
   - La fila R3 de traceability renombra el `it` de E1 y añade `E2: <rojo> → <verde>`.
   - «E2 solo toca `index.test.tsx`» vale para `mobile-pet-tracker/`. Desde H0E2 la lista completa serán `index.test.tsx`, el impl y `traceability.md`, como en E1.
   - Si se aplica la corrección 2, el título del `it.each` debe nombrar el collar (p. ej. filas `[role, etiqueta, device]` y dos `%s` en el título). Si no, las filas con y sin collar del mismo rol salen con el mismo título y la traza no las distingue.
9. **OK, notas para el handoff (no son de la spec).** En «Antes» no hay `git merge-base --is-ancestor 039e6195 HEAD` (E1 sí lo tenía con `664b95a7`); la base de 114 lo suple. La regla de una sola repetición por el flake de #72 R2 (`Number of calls: 0`) debe ir en el handoff, porque tasks.md dice «cualquier otro `it` rojo… para».

Resultado del barrido: **CORREGIR**, 1 corrección (la 2; sus efectos sobre los recuentos y el título van dentro de ella).

---

# Ronda 3 — Enmienda E2

Fecha: 2026-10-10. HEAD `a8681b51` (branch `feature/159-mobile-no-collar-states-pingo`). H0E2 `48363132`. Enmienda E2 firmada en `4146ac24`.

Veredicto: RECHAZADO (1 bloqueante: B3, la inversa de R4 contra el listado solo vigila listados owner/sin collar y del mismo rol; M7, M8 y M9 leen el listado y sobreviven 119/119)

## Comprobaciones

### Producción idéntica a 664b95a7
- `git diff --stat 664b95a7 HEAD -- mobile-pet-tracker/src/screens/map/index.tsx` → vacío. También `git diff --quiet 664b95a7 15fa23e4 -- …/index.tsx` → 0 y `git diff --quiet 664b95a7 48363132 -- …/index.tsx` → 0.

### Lista cerrada desde H0E2
- `git diff --name-only 48363132 a8681b51` → exactamente `mobile-pet-tracker/src/screens/map/index.test.tsx`, `progress/impl_mobile-no-collar-states-pingo.md`, `specs/mobile-no-collar-states-pingo/traceability.md`. OK.
- `git log --oneline 48363132..HEAD` → `43e712b3` (rojo), `15fa23e4` (verde), `a8681b51` (trazabilidad). Mensajes literales de tasks.md §Enmienda E2.

### C6 — Spec y enmienda firmadas
- requirements.md §Aprobación de la Enmienda E2: `- [x] Enmienda E2 aprobada por humano (fecha: 2026-10-09, vía Notion)`, firma en `4146ac24`.

### Gate init.sh (corrido por el leader, no por el reviewer)
- Log `scratchpad/init-159-e2.log`, última línea `exit=0`, `✅ Todo verde`. Backend `Tests: 1474 passed, 1474 total`; móvil `Test Suites: 97 passed, 97 total` / `Tests: 2425 passed, 2425 total` (= 2420 + 5, lo que prescribe tasks.md §Cierre); e2e `Tests: 8 skipped, 468 passed, 476 total`; lint y typecheck sin errores.
- El log no imprime el hash. Lo ato a HEAD así: su mtime (2026-10-10 06:13 local) es posterior al commit `a8681b51` (2026-10-09 23:11 UTC), el árbol está limpio salvo este fichero de review, y 2425 solo cuadra con las 6 filas de E2 dentro.

### C4 — Rojo → verde
- `43e712b3` (rojo): el `it` de E1 pasa a `it.each` de 6 filas, con el cuerpo literal de tasks.md §Enmienda E2 (diff revisado línea a línea), más la mutación de producción de tres líneas (`selectedPet?.myRole !== 'walker' &&`, `selectedPet?.myRole !== 'vet' &&`, `detail.data.pet.myRole === 'owner' &&`). El test no muta dobles: el rojo sale de producción.
- `15fa23e4` (verde): solo revierte esas dos líneas de `index.tsx`; el test no cambia después del rojo (`git diff --quiet 43e712b3 HEAD -- …/index.test.tsx` → 0).
- Rojo reproducido por mí (producción de `43e712b3` con el test de HEAD): `Tests: 4 failed, 115 passed, 119 total`, los cuatro por consulta (`Unable to find an element with testID: map-no-tracking-action` ×4), walker y vet con y sin collar; las dos filas `family` verdes. Ningún `ReferenceError`/`TypeError`. Coincide con tasks.md.
- Verde en HEAD: `Tests: 119 passed, 119 total`, `exit=0`.

## Sondas del reviewer (en HEAD a8681b51, sin commit)

Cada sonda: mutación en `const canPairCollar =` de `mobile-pet-tracker/src/screens/map/index.tsx`, `FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/map/index.test.tsx`, restauración con `git checkout HEAD -- <ruta>` y `git diff --quiet HEAD -- mobile-pet-tracker specs && git diff --cached --quiet` → `limpio=0` tras cada una. `uptime` antes: carga 0,68-0,89. `.expo/types/router.d.ts` ausente.

### Sondas de tasks.md y de la ronda 2

E2a es literalmente P6, E2b es P6b y E2d es X1 (mismo texto de mutación), así que cada corrida vale para las dos.

| Sonda | Mutación | Esperado | Medido | Qué cae (todo por consulta) |
|---|---|---|---|---|
| BASE | ninguna | 119 passed | `119 passed, 119 total`, exit=0 | — |
| ROJO | producción de `43e712b3` | `4 failed, 115 passed, 119 total` | igual | walker sin/con, vet sin/con |
| E2a = P6 | `selectedPet?.myRole !== 'walker' && detail.data.pet.myRole === 'owner' &&` | `2 failed, 117 passed` | igual | walker sin collar, walker con collar |
| E2b = P6b | igual con `'vet'` | `2 failed, 117 passed` | igual | vet sin collar, vet con collar |
| E2c | igual con `'family'` | `2 failed, 117 passed` | igual | family sin collar, family con collar |
| E2d = X1 | `(selectedPet?.myRole === 'owner' \|\| selectedPet?.device === null) && detail.data.pet.myRole === 'owner' &&` | `3 failed, 116 passed` | igual | family/walker/vet con collar |

P6 y P6b, verdes en `340967ba`, ahora caen. B2 queda cerrado.

### Barrido adicional (mutaciones que leen rol o collar de `selectedPet` por otra vía)

Ids M para no chocar con los bloqueantes B1-B3. Sustituyen la línea del rol (`detail.data.pet.myRole === 'owner' &&`), la del collar (`detail.data.pet.device === null;`) o las tres líneas del predicado (M5).

| Id | Mutación | Medido | Qué cae | Lado |
|---|---|---|---|---|
| M1 `??` | `(selectedPet?.myRole ?? detail.data.pet.myRole) === 'owner' &&` | `9 failed, 110 passed` | las 6 filas de E2 (consulta) + R4 «no pinta el botón a family/walker/vet aunque el listado diga owner» (aserción `toBeNull`) | R3 + R4 |
| M2 `\|\|` rol | `(selectedPet?.myRole === 'owner' \|\| detail.data.pet.myRole === 'owner') &&` | `3 failed, 116 passed` | R4 «… aunque el listado diga owner» ×3 | R4 |
| M3 collar del listado | `selectedPet?.device === null;` | `5 failed, 114 passed` | E2 con collar ×3, E1 «… traiga collar», R4.4 | R3 + R4 |
| M4 `\|\|` collar | `(selectedPet?.device === null \|\| detail.data.pet.device === null);` | `1 failed, 118 passed` | R4.4 «no pinta el botón al dueño de una mascota con collar» | R4 |
| M5 rama por kind | si el detalle no es `ok`, cae al listado: `detail.data?.kind === 'ok' ? <detalle> : selectedPet?.myRole === 'owner' && selectedPet?.device === null;` | `4 failed, 115 passed` | R4.5-R4.8 (error, unreachable, missing-config, cargando) | R4 |
| M6 rama por conectividad | `(selectedPet?.device?.connectivity === 'online' ? selectedPet.myRole === 'owner' : true) && detail… &&` | `3 failed, 116 passed` | E2 con collar ×3 | R3 |
| **M7** | `(detail.data.pet.myRole === 'owner' \|\| Boolean(selectedPet?.device)) &&` | **`119 passed, 119 total` — sobrevive** | ninguno | **R4.1-R4.3** |
| **M8** | `(detail.data.pet.device === null \|\| selectedPet?.myRole !== 'owner');` | **`119 passed, 119 total` — sobrevive** | ninguno | **R4.4** |
| **M9** | `(detail.data.pet.myRole === 'owner' \|\| (selectedPet?.myRole !== 'owner' && selectedPet?.myRole !== detail.data.pet.myRole)) &&` | **`119 passed, 119 total` — sobrevive** | ninguno | **R4.1-R4.3** |
| M10 | `!selectedPet?.lostMode && detail.data.pet.myRole === 'owner' &&` | `119 passed` — sobrevive | ninguno | fuera de dominio (ver N/B) |
| M11 | `selectedPet?.device?.connectivity !== 'offline' && detail.data.pet.myRole === 'owner' &&` | `119 passed` — sobrevive | ninguno | fuera de dominio (ver N/B) |

`limpio=0` tras cada sonda. Ningún `ReferenceError`/`TypeError`. El flake de #72 R2 no salió en ninguna de las 17 corridas.

**M7, M8 y M9 pasan los gates estáticos:** con M7+M8 aplicadas a la vez, `bun run typecheck` → `exit=0` y `bunx expo lint --no-cache src/screens/map/index.tsx` → `exit=0`; con M9, igual (`exit=0` y `exit=0`). Restaurado y `limpio=0` después.

**Prueba de que violan R4 (contraejemplo medido, no deducido).** Sondas de test, sin commit, restauradas con `git checkout HEAD -- <prod> <test>` y `limpio=0`:

| Contraejemplo (solo cambia el listado del `it` de R4) | HEAD (producción correcta) | Con la mutación |
|---|---|---|
| CX7: en «no pinta el botón a %s», listado `makePet({ myRole: role, device: makeDevice('online') })` | `119 passed` | M7: `3 failed, 116 passed` — «no pinta el botón a family/walker/vet», aserción `toBeNull` |
| CX8: en «no pinta el botón al dueño de una mascota con collar», listado `makePet({ myRole: 'family' })` | `119 passed` | M8: `1 failed, 118 passed` — ese `it` |
| CX9: en «no pinta el botón a %s», listado `makePet({ myRole: role === 'family' ? 'walker' : 'family' })` | `119 passed` | M9: `3 failed, 116 passed` — «no pinta el botón a family/walker/vet» |

Es decir: con M7 un familiar/paseador/veterinario ve «Vincular collar» si el listado trae collar; con M8 el dueño de una mascota con collar lo ve si el listado dice otro rol; con M9 lo ve un no-dueño si el listado dice otro rol no-owner. Las tres leen del listado, justo lo que D2 prohíbe.

## Cobertura de la cláusula tras E2

| Cláusula | Dominio (detalle × listado) | Casos con test | Estado |
|---|---|---|---|
| R3.1 (detalle owner, sin collar → botón, «sea cual sea el listado») | 1 × {owner, family, walker, vet} × {sin, con collar} = 8 | 8: owner/sin (R3 base), owner/con (E1), y las 6 filas de E2 | **cerrada** (M1, M3, M6, E2a-E2d, P6, P6b, X1 caen) |
| R4.1-R4.3 (detalle family/walker/vet sin collar → sin botón) | 3 × 8 = 24 | 6: cada rol con listado del mismo rol sin collar y con listado owner sin collar | **18 sin test; M7 y M9 sobreviven** |
| R4.4 (detalle owner con collar → sin botón) | 1 × 8 = 8 | 1: listado owner sin collar | **7 sin test; M8 sobrevive** |
| R4.5-R4.8 (detalle no `ok` o pendiente) | `detail.data?.kind === 'ok' &&` corta antes de mirar nada; el listado de los 4 `it` es owner/sin collar, el más favorable para un respaldo al listado | 4 | M5 cae; sin hueco medido |

## C5 — Trazabilidad
- Fila R3 de `traceability.md` en `a8681b51`: el `it` de E1 pasa a `pinta Vincular collar aunque el listado diga $role $collar: manda el rol y el collar del detalle (family, walker y vet, con y sin collar; sondas E2a-E2d)`, literal de tasks.md §Enmienda E2 (3). La columna de commits añade `E2: 43e712b3 test(…): #159 E2 red pair action obeys list role except family → 15fa23e4 fix(…): #159 E2 revert list role probe, pair action locked to detail role`. [x]
- `git merge-base --is-ancestor <h> HEAD` → 0 para `f346baf3`, `9b89f6c8`, `3224d502`, `203ea96e`, `43e712b3`, `15fa23e4`. [x]
- Única fila `pendiente`: R10, el humo humano (§Aprobación, casilla 3), como en las rondas 1 y 2. [x]
- Mensajes `test(…)/fix(…)/docs(…)` con el formato y el número de feature. [x]

## C2 / C3 / C4 / C6 / C7 / C8
- C2: `feature_list.json` → una sola `in_progress` (#159). `progress/current.md` registra E2, su firma `4146ac24` y el handoff. [x]
- C3: la ronda no toca producción (`git diff --stat 48363132 HEAD -- mobile-pet-tracker` → solo `index.test.tsx`, 9+/2−). [x]
- C4: el `it.each` nombra su R-id por el `describe('#159 R3: …')`; rojo con mutación de producción versionada (`43e712b3`) y revertida (`15fa23e4`), medido por mí en 4/115/119. [x] — pero el candado de R4 contra el listado no vigila su cláusula entera (B3). [ ]
- C6: Enmienda E2 firmada (`4146ac24`, casilla marcada). [x]
- C7: el `it` de E1 se reemplazó en su sitio; su título viejo no queda (`grep -c "manda el rol del detalle'"` → 0). [x]
- C8: sin cambios de UI en esta ronda. N/A.

## Observaciones

### B3 (bloqueante): la inversa de R4 contra el listado solo vigila listados owner sin collar o del mismo rol
- R4 dice «el detalle resuelve…» y D2 fija que rol y collar salen del detalle, nunca del listado. Para que el botón **no** salga sea cual sea el listado, cada estado de detalle de R4.1-R4.4 tiene el mismo dominio de 8 listados que E2 cerró para R3: `myRole` ∈ {owner, family, walker, vet} × `device` ∈ {null, con collar}. Hoy hay test para 7 de las 32 combinaciones (tabla de cobertura).
- M7, M8 y M9 leen del listado, pasan typecheck y lint, dejan el fichero en `119 passed, 119 total` y los contraejemplos CX7-CX9 demuestran que pintan el botón donde R4 lo prohíbe.
- Es el espejo exacto de B2/X1: E2 cerró el producto cartesiano del lado R3 (el botón debe salir), pero no el del lado R4 (el botón no debe salir). Mi barrido previo a la firma de E2 (§Barrido de la Enmienda E2) solo miró el lado R3; el hueco nace en la spec y en ese barrido, no en Codex, que cumplió tasks.md al pie de la letra.
- Lo que hace falta: una enmienda que dé a R4.1-R4.4 su producto cartesiano contra el listado (4 estados de detalle × 8 listados = 32 casos, cada uno con su fila, frente a los 7 de hoy), con rojo por mutación de producción versionada y M7, M8 y M9 como sondas que deben caer.

### No bloqueantes
- **N1. M10 y M11, fuera del dominio de la spec.** Leen del listado atributos que `canPairCollar` no lee: `lostMode` y `device.connectivity` (dentro de «con collar», distingue `offline` de `online`). Sobreviven 119/119 y violan la letra de R3.1 («sea cual sea el listado»). No los cuento como bloqueantes: la spec fija el dominio en rol × collar nulo/no nulo, y fuera de él el espacio no es finito (cualquier campo de `PetProfile` o cualquier cadena de `connectivity`), así que ningún candado finito lo cierra. Si el leader o el humano quieren ensanchar el dominio (por ejemplo, filas con `makeDevice('offline')`), es una decisión de alcance de la siguiente enmienda.
- **N2.** Codex declara «Ninguna skill cargada» en el impl de la ronda 3. La ronda es solo de tests y no toca UI, así que no tiene efecto aquí.
- **N3.** El log de init.sh no imprime el hash de HEAD; lo até por mtime, árbol limpio y el recuento 2425. Si se quiere evitar esa inferencia, que init.sh (o el leader) imprima `git rev-parse HEAD` en la cabecera del log.

## Veredicto ronda 3
RECHAZADO por B3. B2 queda cerrado: E2a-E2d, P6, P6b y X1 caen con los recuentos de tasks.md, el rojo se reproduce en 4/115/119 y la producción es idéntica a `664b95a7`.

## Output de ./init.sh (corrido por el leader en a8681b51; extracto por grep)
```
Test Suites: 187 passed, 187 total
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 97 passed, 97 total
Tests:       2425 passed, 2425 total
Snapshots:   1 passed, 1 total
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
exit=0
```
