# review: geofence-alert-consistency (#145)
Fecha: 2026-10-01
Veredicto: APROBADO

Worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch `feature/145-geofence-alert-consistency`.
HEAD revisado: `6a46f677202b3a2371eaf4480521fe9c2abc8391`. El árbol estaba limpio al empezar y sigue limpio al terminar
(`git diff --exit-code` 0, `git diff --cached --exit-code` 0, `git status --short` vacío).
Handoff H0: `321300f9`. Base contra `origin/main`: `3db47fb0`.

## Hallazgos bloqueantes

Ninguno.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` tiene solo `(145, 'geofence-alert-consistency', 'in_progress')`, e init.sh lo confirma («Feature en progreso: geofence-alert-consistency»).
- [x] `progress/current.md` actualizado: tiene la sección #145, con la branch, la base de tests 171/1307 · 2/14 · 86/1634 · e2e 27 (+3) / 389 (+8), H0 y el handoff.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: `GeofenceRepository` sigue siendo una interfaz pura. Solo cambia la firma de `update(id, changes, options: { resetEvaluation: boolean })` y su JSDoc.
- [x] Los contratos del dominio son interfaces puras: no hay clases ni implementaciones en el puerto.
- [x] application depende de interfaces: `update-geofence.use-case.ts` usa el token del puerto. `resetsEvaluation` es una función pura del módulo sobre `Geofence` y `UpdateGeofenceDto`.
- [x] infrastructure sin lógica de negocio: el repositorio Drizzle ejecuta lo que le pide la opción `resetEvaluation`. El cierre de alertas vive en `closeOpenAlerts`, que importa `alertEvents` (de infra a infra). La única llamada a `update` es la del caso de uso, y no hay dobles del puerto que se rompan.
- [x] Contrato de requirements.md. `closeOpenAlerts(db: Pick<NodePgDatabase, 'update'>, geofenceId, closedAt)` hace `.set({ status: 'closed', closedAt })` con `and(eq(alertEvents.geofenceId, geofenceId), ne(alertEvents.status, 'closed'))`. `this.db.transaction(` aparece 2 veces (en `update` y en `delete`). `delete` cierra antes de `tx.delete(geofences)`, y `this.db.delete` ya no aparece.

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra. Los cinco `describe` son `#145 R1:` … `#145 R5:`, todos dentro de `describe('#145: consistencia entre geocercas y alertas'`. Los ocho helpers (SEEDED_STATE, HISTORY_CLOSED_AT, seedAlert, alertById, seedState, storedState, deleteZone, patchZone) son literales a requirements.md y están en el orden de §Arnés. Lo comprobé con un script que compara el texto. No se borró ni editó ningún `it` ni `describe` existente: ningún commit tiene líneas `-` en el e2e.
- [x] El historial muestra test primero. Hay 12 commits desde H0, con asuntos idénticos a la lista del handoff (diff exit=0). Cada verde va precedido de su rojo:
  - b4dd456f (R1, rojo), 7f6f48db (R2, rojo), e4b8d13a (R1, R2, verde)
  - c266f82d (R3, rojo), a4b73c56 (R3, verde)
  - 0ab86634 (R4, rojo), 00069504 (R4, verde)
  - 618bed21 (R5, rojo con MV), fd23e4a2 (R5, verde)
  - 66a2a627 refactor, 63f53428 docs, 6a46f677 trazabilidad
- [x] Alcance por commit:
  - Los rojos tocan solo `test/geofences.e2e-spec.ts`. La excepción es 618bed21, que además lleva la MV en `update-geofence.use-case.ts` (añade `'name'` a la lista).
  - Los verdes tocan solo producción.
  - El refactor toca solo los tres ficheros de comentarios.
  - El commit de docs toca solo `docs/data-model.md`.
- [x] El verde de R5 deja U igual que el verde de R4: `git diff 00069504 fd23e4a2 -- U` y `git diff 00069504 HEAD -- U` salen vacíos.
- [x] Rojos comprobados por checkout temporal. Después restauré con `git checkout feature/145-geofence-alert-consistency`, y quedaron HEAD = 6a46f677 y el árbol limpio.
  - `b4dd456f`: 1 fallo de 21, `#145 R1 … responde 204 las dos veces`. Es un fallo de aserción: `toEqual([204, 204])` recibe `[204, 500]`.
  - `618bed21`: 2 fallos de 30, en las dos filas de R5. Es un fallo de aserción: `toMatchObject` espera `outside` / `2026-10-01T10:00:00.000Z` y recibe `unknown` / `null`.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas «pendiente». La única aparición de la palabra es la prosa de la línea 22, que cita la regla C5.
- [x] Todos los hashes de la tabla tienen 40 caracteres y son ancestros de HEAD (`git merge-base --is-ancestor`). La fila Refactor cita 66a2a627 y la fila Docs cita 63f53428. Las dos son correctas: cada una apunta al commit que hizo ese trabajo.
- [x] Los commits siguen `tipo(scope): desc (R-ids)`, con el texto literal del handoff.

## Checklist C6 — Spec aprobada
- [x] `specs/geofence-alert-consistency/requirements.md`: `status: approved` y `[x] Spec aprobada por humano (fecha: 2026-10-01)`.

## Checklist C7 — Sin código huérfano
- [ ] Componentes/módulos reemplazados por esta feature fueron eliminados
- [ ] Sus tests también fueron eliminados
- [x] N/A: esta feature no reemplaza nada. Cambia la firma de `update` y endurece `delete`. El `this.db.delete` directo desapareció en favor de la transacción, sin dejar restos.

## Código contra tasks.md y design.md
- Los bloques de producción de R, U y el puerto, y los cuatro comentarios del refactor, coinciden literalmente con tasks.md. Afecta a `delete-geofence.use-case.ts`, `alerts-engine-store.ts`, el puerto y el repositorio.
- Greps de §Cierre, medidos en HEAD:
  - `this.db.transaction(` = 2, `closeOpenAlerts(` = 3, `ne(alertEvents.status, 'closed')` = 1, `geofenceState` condicional = 1
  - `tx.delete` = 1, `this.db.delete` = 0, `options` en R = 1, firma en el puerto = 1
  - `resetEvaluation` en U = 1, lista de claves en U = 1, `'name'` en U = 0
  - «referencia todavia» = vacío, «se deja intacto» = 0
- Las tres sustituciones de `docs/data-model.md` están aplicadas. Los greps `WHERE status='open'`, `WHERE status <> 'closed'`, `que se deja intacto` y `#145` dan 0 / 1 / 0 / 2, como pide la spec.

## Alcance
- `git diff --stat origin/main...HEAD -- backend-pet-tracker` da exactamente 6 ficheros: puerto, repositorio, U, `delete-geofence.use-case.ts`, `alerts-engine-store.ts` y `test/geofences.e2e-spec.ts`.
- `git diff --name-only 321300f9 HEAD` da exactamente los 9 ficheros del handoff: los 6 anteriores más `docs/data-model.md`, `specs/geofence-alert-consistency/traceability.md` y `progress/impl_geofence-alert-consistency.md`.

## Verificación independiente sobre el árbol final (6a46f677)
Cada comando se ejecutó de uno en uno, sin pipe, con la salida en un fichero:
- `pgrep`/`ps` antes del e2e: solo aparecía mi propio wrapper de bash, sin ningún init.sh, test:e2e ni jest-e2e real en curso.
- `pnpm -C backend-pet-tracker exec jest --config ./test/jest-e2e.json test/geofences.e2e-spec.ts`: exit=0, 1 suite, 30 de 30 tests.
- `pnpm -C backend-pet-tracker exec tsc --noEmit`: exit=0, sin salida.
- `pnpm -C backend-pet-tracker test`: exit=0, 171 suites y 1307 tests, igual que la base.
- `pnpm -C backend-pet-tracker exec eslint "{src,apps,libs,test}/**/*.ts"` (sin `--fix`): exit=0, sin salida.

## Sondas (tasks.md §Sondas), repetidas sobre el árbol final
Las apliqué una cada vez con un reemplazo exacto, comprobando que el ancla aparecía exactamente 1 vez. Después de cada una restauré con `git checkout HEAD -- <ruta>` y comprobé `diff` / `cached` / `status` = 0 / 0 / vacío.

Todos los rojos son fallos de aserción. Solo se pusieron rojos `it` de #145; ningún `it` base falló.

| Sonda | Mutación | Rojos esperados | Rojos medidos | Matcher |
|---|---|---|---|---|
| M1 | Borra `await closeOpenAlerts(tx, id, new Date());` en `delete` | 3: R1 y 2 filas de R2 | 3 de 30: R1, R2-open, R2-acked | `toEqual([204, 204])`; `toMatchObject({status:'closed', geofenceId:null})` |
| M3 | `ne(…,'closed')` cambiado a `eq(…,'open')` | 4: R2-acked y 3 filas de R4 | 4 de 30: R2-acked, R4 centerLat / centerLng / radiusM | `toMatchObject` |
| M9 | En U, quita `&& dto[key] !== existing[key]` | 1: R5 «name con la misma geometría y el mismo active…» | 1 de 30: esa fila de R5 | `toMatchObject` (línea 952) |
| M10 | En U, añade `&& dto[key] !== true` | 1: R3 «reactivar una zona inactiva…» | 1 de 30: esa fila de R3 | `toMatchObject` (línea 871) |
| M12 | `geofenceState` reset cambiado a `{}` | 5: 2 de R3 y 3 de R4 | 5 de 30: R3 desactivar, R3 reactivar, R4 ×3 | `toMatchObject` (líneas 844, 871, 904) |
| M14 | `.set({ status: 'closed', closedAt })` cambiado a `.set({ status: 'closed' })` | 6: 2 de R2, R3 desactivar y 3 de R4 | 6 de 30: esas mismas filas | `toBeGreaterThanOrEqual` recibe `0` en los 6 casos |

## Observaciones no bloqueantes
1. Codex cambió la prosa de traceability.md:
   - «Recuentos al cierre (base `a8c8e449`)» pasó a «Recuentos medidos al cierre (base H0 `321300f9…`)».
   - La línea backend unit pasó de «+0» a «171 suites / 1307 tests → 171 / 1307».
   No afecta a ninguna fila de la tabla y los recuentos son correctos, así que es inocuo.
2. Falta una línea en blanco entre el `});` de R15 y el nuevo `describe('#145: …'` en `test/geofences.e2e-spec.ts`. Es cosmético y eslint pasa.
3. `progress/impl_geofence-alert-consistency.md` cita el commit 12 como «HEAD», porque un fichero no puede citar el hash del commit que lo contiene. Es inevitable, y traceability no depende de eso.
4. El log de init.sh no imprime líneas PASS por suite e2e, así que de ahí solo se deduce el +10 (389 a 399). Mi corrida directa del e2e de geofences da 30 de 30, lo que lo confirma.
5. Avisos de init.sh que tocan al leader:
   - A `.env` le faltan `RESEND_API_KEY`, `RESEND_FROM` y `RESET_LINK_HOST`.
   - STATUS.md está desactualizado (dice 130/144 y son 130/146).
   - Hay 3 features done sin spec.
   - Jest móvil avisa de que un worker no salió limpio, un aviso que ya existía.
   Nada de esto lo introduce #145.
6. En `progress/current.md`, la línea «Siguiente:» todavía describe el paso de Codex. Le toca al leader actualizarla al cerrar.

## Output de ./init.sh
No lo ejecuté yo: el leader lo prohibió porque LocalStack y Postgres se comparten con la sesión de #60. Esta es la corrida del leader en `Pet-Tracker-wt-backend`, posterior al commit HEAD (17:43:48). Fichero de exit: `exit=0`.
Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/be83ee02-f6ed-40e5-bcdd-18a6451c2267/scratchpad/init145.log`. Extracto, sin códigos ANSI:
```
⚠️  .env desactualizado: faltan 3 claves de .env.example
⚠️    configuración ausente: RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST
✅ Dependencias instaladas
✅ Archivos del harness presentes
⚠️  Feature en progreso: geofence-alert-consistency
⚠️  STATUS.md desactualizado (130/144 declarado vs 130/146 real) — actualízalo antes de cerrar la sesión
✅ Build exitoso
Test Suites: 171 passed, 171 total
Tests:       1307 passed, 1307 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
# pass 28 / # fail 0
# pass 5 / # fail 0
# pass 15 / # fail 0
Test Suites: 86 passed, 86 total
Tests:       1634 passed, 1634 total
✅ Tests pasados
✅ Esquema y recursos e2e listos
Test Suites: 3 skipped, 27 passed, 27 of 30 total
Tests:       8 skipped, 399 passed, 407 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
exit=0
```
Comparado con la base de current.md, solo cambian los e2e: +10 tests (389 a 399), los 10 `it` nuevos de #145. Todo lo demás queda +0.
