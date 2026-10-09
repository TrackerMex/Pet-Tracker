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
