# review: backend-pg-pool-error-listener
Fecha: 2026-11-04T04:10Z
Veredicto: APROBADO (estático; queda pendiente el `./init.sh` del leader sobre `96ba7455`)

Alcance: worktree `/home/claude/sites/Pet-Tracker-wt-238`, rama `feature/238-backend-pg-pool-error-listener`,
HEAD revisado `96ba7455`, H0 `a39a25b8` (firma de E1). Diff `git diff a39a25b8..96ba7455`: 4 rutas, exactamente
la lista cerrada:

- `backend-pet-tracker/src/db/drizzle.module.ts` (+8/−1);
- `backend-pet-tracker/src/db/drizzle.module.spec.ts` (+44/−1);
- `progress/impl_backend-pg-pool-error-listener.md` (+403/−0);
- `specs/backend-pg-pool-error-listener/traceability.md` (+2/−2).

Sin ficheros de más. La revisión es estática: este reviewer no corrió `./init.sh`, jest, e2e ni installs, porque el
leader lo prohibió. Sí corrió `tsc`, `eslint` y `prettier --check` (§Verificación propia). No leyó `.env`.

## Checklist C2 — Estado coherente
- [x] No hay features `in_progress` en `feature_list.json` (0). #238 está `spec_ready`.
- [x] `progress/current.md` describe la sesión activa: el plan de arreglos del smoke del 2026-11-03, donde vive #238
      (`progress/plan_mejoras-smoke-2026-11-03.md` §2). No nombra #238 en concreto (O1).
- [x] Árbol limpio: `git status --short` vacío. El marcador `progress/impl_backend-pg-pool-error-listener.done`
      existe y lo ignora `.gitignore:27` (`progress/impl_*.done`).

## Checklist C3 — Arquitectura
- [x] domain no cambia (cero diff en `src/modules/**`).
- [x] Los repositorios y contratos de domain no cambian.
- [x] application no cambia.
- [x] infrastructure sin lógica de negocio. El único cambio de producción está en infraestructura compartida
      (`src/db/drizzle.module.ts:14` el logger de módulo, `:32-38` el factory de `PG_POOL`): loguea y devuelve el
      pool, sin reintentos ni cambios de config (D3). `PG_POOL` sigue sin exportarse (`:49`, D5).

## Checklist C4 — TDD
- [x] R1 tiene su it, que lo nombra: `drizzle.module.spec.ts:39` es
      `describe('#238: PG_POOL logs idle client errors instead of crashing'`, y el it es
      `#238 R1: an error emitted by PG_POOL is logged with Logger.error and does not throw`. Los dos nombres
      coinciden literalmente con requirements.md R1.
- [x] R2 es de alcance. La spec lo verifica con comandos de `git` y `grep` (requirements.md R2, tasks.md §R2), y en
      traceability.md lo respalda el it de R4, que ya existía (O3).
- [x] El historial es test-primero, en commits separados (`git show --stat`):
  - `51c72df3` (03:49:09): `test(...)`, solo `drizzle.module.spec.ts` (+44/−1);
  - `eb45daf8` (03:50:50): `fix(...)`, solo `drizzle.module.ts` (+8/−1);
  - `96ba7455` (03:54:08): `docs(...)`, solo el reporte y traceability.md.
- [x] Rojo real y por aserción, verificado leyendo el código:
  - En `a39a25b8:backend-pet-tracker/src/db/drizzle.module.ts` el factory hace `return new Pool({...})`, sin
    listener.
  - `pg-pool@3.14.0/index.js` no engancha ningún `'error'` en el propio pool: solo en los clientes (`:56`, `:270`,
    `:385`). Emite en `:62` (`pool.emit('error', err, client)`).
  - Sin listener, `EventEmitter.emit('error')` lanza, así que falla la primera aserción del it,
    `expect(() => pool.emit('error', error)).not.toThrow()`.
  - Lo que trae el log según el reporte (`impl_…md:386-398`) es lo que pide E1, con cuenta `1` en cada literal:
    `expect(received).not.toThrow()` y `Error message: "Unhandled error.`.
  - El commit rojo compila: `PG_POOL` ya existe en `drizzle.constants.ts` en H0, y `Pool` se importa como `type`
    desde `pg`. No hay `ReferenceError` posible.
  - Producción es idéntica a H0 en el commit rojo, así que tampoco es un rojo por mutación de un doble.
- [x] El test no es tautológico:
  - el mensaje esperado es un literal escrito a mano (`drizzle.module.spec.ts:70-73`), no importado ni montado
    con el prefijo de producción;
  - el `stack` sale del `Error` que crea el propio test (`:63-65`);
  - el spy va en `Logger.prototype.error` y se restaura en `finally` (`:61`, `:75-77`);
  - `toHaveBeenCalledWith` con dos argumentos exactos cumple la cláusula «exactly two arguments» de R1.
- [x] Mutaciones M1 y M2 documentadas, con restauración `git diff --quiet` → `exit=0`:
  - **M1** (`impl_…md:486-535`): `exit=1`, `Tests: 1 failed, 1 passed, 2 total`, `grep -cF "on('error'"` = `0`, y
    los dos literales de E1 con `1` cada uno;
  - **M2** (`impl_…md:537-577`): `exit=1`, mismo `Tests:`, y cae en `toHaveBeenCalledTimes(1)` con
    `Received number of calls: 0`.

  Este reviewer no pudo repetirlas (jest prohibido). Corrobora M2 el log que quedó en `/tmp/impl-238-file.log`
  (mtime 03:51:23, posterior al verde): `Tests: 1 failed, 1 passed, 2 total` y `Received number of calls: 0` con
  cuenta `1`.

## Checklist C5 — Trazabilidad
- [x] traceability.md no tiene filas «pendiente». La única aparición es la regla del pie, `traceability.md:16`.
- [x] Cada fila tiene su test o verificación, y hashes reales: `51c72df3e0d94551d491535af079c8a834c14539` y
      `eb45daf82910795e608283a462a5a9ec2d6748e6` coinciden con `git rev-parse`.
- [x] Los mensajes de los tres commits son los literales de tasks.md y llevan sus R-ids: (R1), (R1) y (R1,R2). La
      convención `test|fix|docs` la fija la propia spec (`traceability.md:17`) en lugar del `feat(...)` genérico de
      C5.
- [x] Cada commit lleva el trailer de sesión `Codex-Session: 01a1a416-3ff8-7e40-b5d2-de8f6f78adc7`, comprobado con
      `%(trailers:key=Codex-Session)`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved`. La casilla humana está marcada (2026-11-04, 00:38 UTC) y la de la
      enmienda E1 también (2026-11-04, 03:47 UTC, firma `a39a25b8`).
- [x] Ningún requisito cambió después de la firma de E1: requirements.md no aparece en el diff H0..HEAD.

## Checklist C7 — Sin código huérfano
- [ ] N/A — esta feature no reemplaza nada existente.

## Verificación propia (desde el árbol, HEAD `96ba7455`)

- **Cuentas de R1** con `grep -cF` sobre `src/db/drizzle.module.ts`. Las 11 coinciden con requirements.md:
  - `new Pool(` 1;
  - `on('error'` 1;
  - `pool.on('error', (error) => {` 1;
  - `const poolLogger = new Logger('PgPool');` 1;
  - `` poolLogger.error(`Idle client error: ${error.message}`, error.stack); `` 1;
  - `return pool;` 1;
  - `throw` 0;
  - `provide: PG_POOL,` 1;
  - `connectionString: config.get<string>('DATABASE_URL'),` 1;
  - `await this.pool.end();` 1;
  - `exports: [DRIZZLE],` 1.
- **Cuentas de R1** sobre `drizzle.module.spec.ts`: el `describe('#238: …'` 1, el `it('#238 R1: …'` 1 y `#238` 2.
- **R2:**
  - `git diff --name-only origin/dev...HEAD -- backend-pet-tracker/` lista exactamente `drizzle.module.spec.ts` y
    `drizzle.module.ts`;
  - `git diff --quiet origin/dev...HEAD -- backend-pet-tracker/scripts backend-pet-tracker/test backend-pet-tracker/src/db/migrations backend-pet-tracker/package.json backend-pet-tracker/pnpm-lock.yaml`
    da `exit=0`;
  - las anclas de R4 dan `1` y `1`;
  - el bloque `describe('R4: …')` es idéntico byte a byte al de H0 (`diff` = 0).
- **Herramientas**, desde `backend-pet-tracker/`:
  - `pnpm exec tsc --noEmit -p tsconfig.json`: `exit=0`;
  - `pnpm exec eslint src/db/drizzle.module.ts src/db/drizzle.module.spec.ts`: `exit=0`;
  - `prettier --check` de los dos ficheros: `exit=0`;
  - `git diff --check a39a25b8..96ba7455`: `exit=0`.
- **Suite unitaria.** No la corrió este reviewer. El reporte da `198 passed`, `1651 passed` y `exit=0` dos veces,
  tras `espera=1`. Lo corrobora `/tmp/impl-238-unit.log` (mtime 03:52:10): `Tests: 1651 passed, 1651 total`, en
  `Time: 14.149 s`, coherente con los tiempos de los commits.

## Observaciones (ninguna bloquea)

- **O1.** `progress/current.md` no nombra #238. Es fichero del leader, fuera de la lista cerrada de Codex. Registrar
  #238 al cerrar.
- **O2.** `origin/dev` avanzó de `fd6244a2` (merge-base) a `3dffbb0c`, pero ninguno de esos commits toca
  `backend-pet-tracker/src/db/` (`git diff --name-only fd6244a2 origin/dev -- backend-pet-tracker/src/db/` sale
  vacío). La PR contra `dev` no debería tener conflicto en estos ficheros.
- **O3.** El test que cita traceability.md para R2 (`resolves a drizzle-orm/node-postgres client under DRIZZLE`) no
  nombra R2: es el it de R4 de una feature anterior. R2 es un requisito de alcance y la spec lo cierra por comandos
  (requirements.md R2 §Verificación), con el mismo criterio con que se aceptaron R4 y R5 en
  `review_backend-vaccine-catalog-migration.md`. No exige un it propio.
- **O4.** Quedan sin borrar `/tmp/impl-238-file.log` y `/tmp/impl-238-unit.log`. Los borra el leader, según el
  handoff.

## Output de ./init.sh

```
Pendiente: lo corre el leader sobre HEAD 96ba7455 (al reviewer se lo deniega el clasificador).
Este veredicto pasa a definitivo solo si ese init.sh sale con exit 0.
```

Leader, 2026-11-04, sobre HEAD `96ba7455`, medido sin pipe (`./init.sh > log 2>&1; echo "init=$?"`):

- **Corrida 1 (03:58–04:08 UTC): `init=1`.** El backend salió verde: 1651/1651 unitarios y 14/14 e2e. Cayeron 12
  tests móviles en 5 ficheros (`home`, `food`, `map`, `register` y `celebration`). Fueron 14 `Exceeded timeout`
  más dos «Unable to find an element» en `home`. La carga media llegó a 27,8 con 4 CPU, y era el primer jest
  móvil del worktree después del `bun install` que hizo init.sh. La rama no toca `mobile-pet-tracker/`
  (`git diff --quiet origin/dev...HEAD -- mobile-pet-tracker` da exit 0). El log entero está en el scratchpad del
  leader, en `init-238-red1.log`.
- **Corrida 2 (04:09–04:17 UTC), con `/tmp/jest_ru/perf-cache-*` borrado antes para que el sequencer no adelante
  los ficheros rojos: `init=0`.**
  - backend unitario: `Tests: 1651 passed, 1651 total`;
  - backend e2e: `Tests: 14 passed, 14 total`;
  - móvil: `Test Suites: 180 passed, 180 total`, `Tests: 6646 passed, 6646 total`;
  - `Tests: 8 skipped, 599 passed, 607 total` (33 de 36 suites).

El veredicto queda **aprobado**. Los 12 rojos móviles de la corrida 1 son de carga, en código que esta rama no
toca. No son deuda de #238.
