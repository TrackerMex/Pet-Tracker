---
feature: "device-telemetry-reset-on-reassign"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[device-telemetry-reset-on-reassign]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Commits test-primero, obligatorio** (C4 de `CHECKPOINTS.md`): el (1) de
> cada tarea es su propio commit `test(device-telemetry-reset-on-reassign): … (Rn)`
> y se empuja en **rojo**; el (2) es el commit `feat(...)` que lo pone verde.
> Un solo commit con test + implementación + docs incumple C4 (pasó en #19).
> "Rojo por símbolo inexistente no vale como rojo": aquí ningún test importa
> nada que no exista ya (todos los símbolos que nombran están en el árbol
> base `66a9d52b`; el único cambio de firma, `claim(): Promise<Device>`, se
> hace en el verde y los dobles del rojo ya compilan contra la firma vieja
> porque van con `as unknown as DeviceRepository`).
>
> **Suites**: `pnpm test` (unit) y `pnpm test:e2e` (Postgres + LocalStack)
> desde `backend-pet-tracker/`; para un solo fichero,
> `pnpm test:e2e -- devices.e2e-spec` / `pnpm test -- claim-device`.
> `./init.sh` desde la raíz corre todo y es la línea base y el cierre.
>
> **Sujeto presente**: cada test nombra solo helpers, símbolos y rutas que
> existen en el árbol base (verificado en [[requirements]] §0.1 P12) o que el
> propio commit rojo crea.

---

## §0 — Antes de la primera tarea

- [ ] Verificar la branch y el worktree: `git branch --show-current` =
      `feature/92-device-telemetry-reset-on-reassign` en
      `/home/claude/sites/Pet-Tracker-wt-backend` (HEAD `66a9d52b` o hijo).
      **No** tocar `/home/claude/sites/Pet-Tracker` (otra sesión, #63).
- [ ] `pgrep -f init.sh` limpio (los worktrees comparten el Postgres de
      docker); luego `./init.sh` verde desde la raíz **antes** de empezar,
      exit code medido sin pipe.
- [ ] Leer [[requirements]] §0 (premisas corregidas: el reset va en `claim`,
      no en `release`; `connectivity` no se toca) y [[design]] D1-D6.
- [ ] Crear `progress/impl_device-telemetry-reset-on-reassign.md` con
      secciones R1, R2, R3 vacías.

---

## R1 — el claim deja `battery_pct`/`last_message_at` en NULL y el 201 refleja la fila persistida

- [ ] (1) Escribir test que falla para R1 — un solo commit
      `test(device-telemetry-reset-on-reassign): claim clears inherited telemetry (R1)`:
      - `backend-pet-tracker/test/devices.e2e-spec.ts`: añadir
        `import { INGESTION_STORE } from '@/workers/ingestion-store';` y
        `import type { IngestionStore } from '@/workers/ingestion-store';`
        (patrón de `test/ingestion.e2e-spec.ts:25-26`), y al final del
        `describe('Devices claim (e2e)')` (tras R15) el
        `describe('#92 R1: el claim deja battery_pct y last_message_at en NULL y el 201 refleja la fila persistida')`
        con los `it` (a) y (b) literales de [[requirements]] R1, incluida la
        **cola de R2** al final de (a). Helpers: `seedUser`, `createPetViaApi`,
        `seedDevice(label, overrides)`, `claim`, `api`, `CLAIM_KEYS`, `db`,
        `devices`/`pets` (ya importados `:10-11`). Fechas: `new Date(Date.now() - 60_000)`
        para la telemetría vieja de (a), `new Date(Date.now() - 30_000)` para
        la de A en (b), `const firstMessageAt = new Date()` fija para la cola
        de R2. Rojo esperado en `pnpm test:e2e -- devices.e2e-spec`: (a) cae
        en `expect(body).toEqual({ … batteryPct: null … })` (recibe `37`);
        (b) cae en el 201 de `petB` (recibe `63`). Todo lo demás de la suite
        sigue verde.
      - `backend-pet-tracker/src/modules/devices/application/use-cases/claim-device.use-case.spec.ts`:
        `:64` → `const claim = jest.fn().mockResolvedValue(buildDevice({ status: 'assigned' }));`
        (delta declarado) y, al final del fichero,
        `describe('#92 R1: execute devuelve la entidad que claim() persistió, no el snapshot previo')`
        con el `it` de [[requirements]] R1 (`deps.findByIdentifier.mockResolvedValue(buildDevice({ batteryPct: 37, lastMessageAt: … }))`,
        `const claimed = buildDevice({ status: 'assigned', ingestWatermark: … }); deps.claim.mockResolvedValue(claimed);`
        `await expect(useCase.execute(DTO, USER_ID)).resolves.toBe(claimed)`).
        Rojo esperado en `pnpm test -- claim-device`: ese `it` (recibe el
        snapshot de `findByIdentifier`); #7 R3 `:104-131` sigue verde
        (asevera solo `device.id`).
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(device-telemetry-reset-on-reassign): reset device telemetry on claim and return persisted row (R1)`:
      - `src/modules/devices/domain/repositories/device.repository.ts:38-44`:
        firma `claim(...): Promise<Device>` + doc de [[design]] D3.
      - `src/modules/devices/infrastructure/repositories/device.drizzle.repository.ts:74-100`:
        `set({ status: 'assigned', ingestWatermark, batteryPct: null, lastMessageAt: null, updatedAt: new Date() })`
        + `.returning()` + `return toDomain(row)` desde la callback;
        `return await this.db.transaction(...)` dentro del `try`. Comentario
        `:80-81` añade "(#92 R1) battery_pct/last_message_at vuelven a NULL:
        la telemetria cacheada es de la asignacion, no del collar".
      - `src/modules/devices/application/use-cases/claim-device.use-case.ts:91,102`:
        `const claimed = await this.devices.claim(...)`; auditoría igual;
        `return claimed;`.
      Verde: `pnpm test` y `pnpm test:e2e -- devices.e2e-spec`; luego
      `pnpm lint` y `pnpm build` (el cambio de firma debe compilar en todos
      los llamadores: solo hay uno, `:91`).
- [ ] (3) Refactor con tests verdes — commit
      `docs(device-telemetry-reset-on-reassign): note telemetry reset on claim (R1)`:
      comentarios `device.entity.ts:17-22` y `devices.schema.ts:22-24`
      ("… y vuelven a NULL en cada claim (#92)"), `docs/data-model.md:53`
      (fila `devices`, misma frase). Fila R1 de [[traceability]].

## R2 — el primer mensaje tras el reset entra por el WHERE (verificación, C4 vía (b))

- [ ] (1) Escribir test que falla para R2 — **no hay rojo propio** (requisito
      de verificación declarado en [[requirements]] R2): la aserción vive en
      la cola del `it` (a) de R1 y es verde desde el verde de R1. En su lugar,
      **sonda de mutación** (no se versiona): en
      `src/workers/ingestion.drizzle.store.ts:103-106` sustituir el `or(...)`
      por solo `lt(devices.lastMessageAt, update.lastMessageAt)` → correr
      `pnpm test:e2e -- devices.e2e-spec` → el `it` (a) de `#92 R1` cae **en
      la aserción `batteryPct === 80`** (la fila sigue `null`); pegar el
      fragmento de salida en `progress/impl_device-telemetry-reset-on-reassign.md`
      §R2 → `git checkout -- src/workers/ingestion.drizzle.store.ts` → verde
      de nuevo. Sin commit de código.
- [ ] (2) Implementación mínima que lo pasa — ninguna (D4). Registrar en
      §R2 del impl la cita `ingestion.drizzle.store.ts:104` y el candado
      hermano `test/ingestion.e2e-spec.ts:220`.
- [ ] (3) Refactor con tests verdes — ninguno. Fila R2 de [[traceability]]
      apunta al `it` (a) de R1 + §R2 del impl.

## R3 — candados verdes y deltas declarados (verificación, C4 vía (b))

- [ ] (1) Escribir test que falla para R3 — no aplica (verificación).
      Comprobar que `git diff --stat origin/main` lista **solo** los ficheros
      de [[design]] §Archivos afectados; en particular **cero** cambios en
      `test/device-subscriptions.e2e-spec.ts`, `test/device-connectivity.e2e-spec.ts`,
      `test/ingestion.e2e-spec.ts`, `release()`, `ingestion.drizzle.store.ts`
      y `mobile-pet-tracker/`. Único test de feature anterior editado:
      `claim-device.use-case.spec.ts:64` (delta de [[requirements]] §Candados).
- [ ] (2) Implementación mínima que lo pasa — `pgrep -f init.sh` limpio →
      `./init.sh` desde la raíz, exit code **sin pipe** → pegar las últimas
      líneas y el `diff --stat` en §R3 del impl.
- [ ] (3) Refactor con tests verdes — `git log --oneline origin/main..HEAD`
      muestra el patrón rojo → verde → docs de R1; fila R3 de [[traceability]].

---

## Cierre

- [ ] [[traceability]] sin filas "pendiente"; `feature_list.json` #92 sigue
      `in_progress` (lo pasa a `done` el leader con el veredicto del reviewer).
- [ ] `progress/impl_device-telemetry-reset-on-reassign.md` completo (R1
      hashes, R2 sonda, R3 `init.sh` + `diff --stat`).
- [ ] Push de la branch y `gh pr create` hacia `main`; el humano mergea.
