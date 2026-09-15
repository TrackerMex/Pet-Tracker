# review: device-telemetry-reset-on-reassign (#92)
Fecha: 2026-09-14 18:49 UTC
Veredicto: APROBADO

Árbol: `/home/claude/sites/Pet-Tracker-wt-backend`, branch
`feature/92-device-telemetry-reset-on-reassign`, HEAD `b980d6ed` (= origin),
merge-base con `origin/main` = `66a9d52b`. Commits validados
(`e753b19d..HEAD`): `4160f514` test R1 → `f1f44880` feat R1 → `3328c0dc`
docs R1 → `b980d6ed` docs R2,R3. Nada de esto se fía del impl report: cada
punto de abajo se comprobó contra el árbol y con corridas propias.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` (`grep -c '"status": "in_progress"' feature_list.json` = 1, #92)
- [x] `progress/current.md` describe la sesión activa de #92 (worktree, branch, baseline, pendientes)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: `grep -rn "infrastructure|drizzle|@nestjs" src/modules/devices/domain/` → solo un comentario que dice "Sin imports de @nestjs/common"; `device.repository.ts` importa únicamente `../entities/device.entity`
- [x] `DeviceRepository` sigue siendo interface pura; el único cambio es la firma `claim(): Promise<Device>` + doc (D3)
- [x] `ClaimDeviceUseCase` depende de `DEVICE_REPOSITORY` + `import type { DeviceRepository }` (domain); devuelve `claimed` (lo que resolvió el puerto), no el snapshot de `findByIdentifier`
- [x] infrastructure sin lógica de negocio: `DeviceDrizzleRepository.claim` añade `batteryPct: null, lastMessageAt: null` al mismo `set` del UPDATE dentro del `db.transaction` existente, `.returning()` y `return toDomain(row)`; sigue dentro del `try` que traduce el 23505. `release()` intacto (diff contra `origin/main` del fichero solo toca `claim`)

## Checklist C4 — TDD
- [x] Cada R<n> tiene test que lo nombra:
  - R1 e2e: `test/devices.e2e-spec.ts` `describe('#92 R1: el claim deja battery_pct y last_message_at en NULL y el 201 refleja la fila persistida')`, `it` (a) y (b)
  - R1 unit: `claim-device.use-case.spec.ts` `describe('#92 R1: execute devuelve la entidad que claim() persistió, no el snapshot previo')`
  - R2: requisito de verificación declarado en la spec antes del handoff (vía (b)); aserción nombrada en la cola del `it` (a) + sonda de mutación (abajo)
  - R3: requisito de verificación declarado; cierre = `./init.sh` + `diff --stat` (abajo)
- [x] Historial test-primero: `git diff 4160f514~1 4160f514 --stat` toca `claim-device.use-case.spec.ts` (+25/-1), `test/devices.e2e-spec.ts` (+132) y el esqueleto de `progress/impl_*.md` (+7, tasks.md §0) — cero código de producción. `git diff 4160f514 f1f44880 --stat` toca solo `claim-device.use-case.ts`, `device.repository.ts`, `device.drizzle.repository.ts` (+ impl/traceability). `3328c0dc` solo comentarios (`device.entity.ts`, `devices.schema.ts`) y `docs/data-model.md`
- [x] Rojo legítimo (no ReferenceError, no mutación de doble): todos los símbolos del rojo existen en `66a9d52b` (`INGESTION_STORE`/`IngestionStore` en `src/workers/ingestion-store.ts`, `seedDevice(label, overrides)` en el e2e); el rojo cae por valores (`37`/`63` en el 201, snapshot en el unit). La sonda 2 reproduce exactamente ese modo de fallo sobre el árbol actual
- [x] Verificación de R1 leída en el código: los tres `null` en el 201 (`toEqual(resetDevice)` con `CLAIM_KEYS`), fila Postgres `batteryPct`/`lastMessageAt` null y `status 'assigned'`, `GET /v1/pets/:petId/device` (a y b), `device` del perfil `GET /v1/pets/:petId` (b), `pets.last_position`/`last_communication_at` de petA iguales antes y después (b)

### Sonda de mutación R2 (repetida por el reviewer, no versionada)
Mutación: en `src/workers/ingestion.drizzle.store.ts` se sustituyó
`or(isNull(devices.lastMessageAt), lt(...))` por solo `lt(...)`.
`cd backend-pet-tracker && pnpm test:e2e -- devices.e2e-spec` → exit 1:
```
● Devices claim (e2e) › #92 R1: … › (a) limpia telemetría sembrada y acepta el primer mensaje nuevo
    Expected: 80
    Received: null
    > 1077 |       expect(afterFirstMessageBody.batteryPct).toBe(80);
Test Suites: 1 failed, 1 total
Tests:       1 failed, 28 passed, 29 total
```
Cae **por la aserción de R2**, no antes. Restaurado con
`git checkout -- src/workers/ingestion.drizzle.store.ts`; `git diff --exit-code` → 0.

### Sonda adicional de zona ciega (reset de battery_pct)
Mutación: se eliminó solo la línea `batteryPct: null,` del `set` de `claim()`.
Misma suite → exit 1:
```
● … › (a) limpia telemetría sembrada y acepta el primer mensaje nuevo
    -   "batteryPct": null,
    +   "batteryPct": 37,
    > 1046 |       expect(response.body).toEqual(resetDevice);
● … › (b) limpia la telemetría del dueño anterior al reasignar
    -   "batteryPct": null,
    +   "batteryPct": 63,
    > 1127 |       expect(response.body).toEqual(resetDevice);
Tests:       2 failed, 27 passed, 29 total
```
(a) cae en el 201 con `37` y (b) en el 201 con `63`: el candado ve la
columna en los dos caminos. Restaurado igual; `git diff --exit-code` → 0;
`git status --short` limpio.

Logs completos: `scratchpad/probe1-isnull.log`, `scratchpad/probe2-batterypct.log`.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" (la única aparición de la palabra es la regla del pie)
- [x] Hashes existen y son ancestros de HEAD: `4160f514`, `f1f44880`, `3328c0dc` (y `e753b19d`, `901d815f`, `e0cf0bf9`) → `git cat-file -t` = commit, `merge-base --is-ancestor` = sí
- [x] Commits siguen `test|feat|docs(device-telemetry-reset-on-reassign): <desc> (Rn)`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` frontmatter `status: approved`; casilla `[X] Aprobado por humano (fecha: 2026-09-14)`
- [x] Firma humana en `901d815f` (AlexisSM377, solo `requirements.md`); leader pasó los 4 frontmatters a `approved` en `e753b19d`
- [x] `git diff e753b19d HEAD -- requirements.md design.md tasks.md` vacío: ningún requisito tocado tras la aprobación

## Checklist C7 — Sin código huérfano
- [ ] N/A — esta feature no reemplaza nada existente (solo extiende `claim()`; `release()`, store, consumer, mappers, controllers y reader intactos)

## Alcance (R3)
`git diff --stat origin/main HEAD` = 16 ficheros: los 10 de `design.md`
§Archivos afectados + los 6 de spec/handoff que ya estaban en la branch
antes de Codex (`feature_list.json`, `progress/current.md`, handoff, specs
×4). `git diff e753b19d HEAD --stat` = exactamente los 10 de design.md.
Diff contra `origin/main` **vacío** en: `ingestion.drizzle.store.ts`,
`ingestion-store.ts`, `positions-consumer.service.ts`,
`infrastructure/mappers/`, `devices.controller.ts` (y todo `*.controller.ts`),
`pet-device.drizzle.reader.ts`, `src/db/migrations/`,
`test/device-subscriptions.e2e-spec.ts`, `test/device-connectivity.e2e-spec.ts`,
`test/ingestion.e2e-spec.ts`, `mobile-pet-tracker/`. `devices.schema.ts`
cambia solo un comentario (sin migración nueva).
Único delta en tests de features anteriores: `claim-device.use-case.spec.ts:64`
(`mockResolvedValue(undefined)` → `mockResolvedValue(buildDevice({ status: 'assigned' }))`,
el declarado en §Candados); el resto del fichero solo añade el `describe` nuevo.

## Observaciones
Ninguna bloqueante. Notas menores, sin acción:
- El commit rojo `4160f514` incluye también el esqueleto de
  `progress/impl_*.md` (7 líneas, tasks.md §0). No es código; no afecta a C4.
- Labels de `seedDevice` en mayúscula (`'R1-92A'`/`'R1-92B'`) frente a
  `'R1-92a'`/`'R1-92b'` de la spec: cosmético, es solo el prefijo del helper.
- Warnings de `init.sh` preexistentes y ajenos: `.env` sin `RESEND_*`/`RESET_LINK_HOST`;
  `harness-init-force-color` (done) sin spec.

## Output de ./init.sh
Corrido por el reviewer desde la raíz del worktree, en primer plano, sin pipe
(`./init.sh > scratchpad/init-review-92.log 2>&1; echo EXIT=$?`).
Precondición `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep` → vacío.
Inicio 18:45:26 UTC, fin 18:49:26 UTC. **EXIT=0**.
```
✅ Build exitoso
Test Suites: 166 passed, 166 total
Tests:       1278 passed, 1278 total          (backend unit)
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total              (infra)
Test Suites: 73 passed, 73 total
Tests:       1265 passed, 1265 total          (móvil)
✅ Tests pasados
Test Suites: 3 skipped, 26 passed, 26 of 29 total
Tests:       8 skipped, 367 passed, 375 total (e2e)
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
Delta contra el baseline de `progress/current.md` (66a9d52b): backend
1277 → **1278** (+1 unit, el `it` de `#92 R1`); e2e 365/373 → **367/375**
(+2, los `it` (a) y (b)); suites e2e 26 de 29 con 3 skipped sin cambio;
infra y móvil sin cambio. Delta esperado por el leader: +1 unit, +2 e2e — coincide.
