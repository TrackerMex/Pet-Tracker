---
feature: "backend-pg-pool-error-listener"
status: draft        # draft | approved
tags: [harness, spec, backend, db, resiliencia]
---

# Tareas — [[backend-pg-pool-error-listener]]

> Disciplina TDD (CHECKPOINTS C4). Cada requisito de [[requirements]] tiene sus
> tres pasos: (1) test rojo, (2) implementación mínima y (3) refactor. La forma
> exacta del listener, del test y de las mutaciones está en [[design]]. Las
> rutas son relativas a `backend-pet-tracker/`, salvo los documentos y los
> comandos marcados «desde la raíz».

## Reglas de la cadena

- **Antes de empezar.**
  - La casilla de aprobación de [[requirements]] y la de su enmienda E1 tienen
    que estar marcadas.
  - Worktree: `/home/claude/sites/Pet-Tracker-wt-238`, branch
    `feature/238-backend-pg-pool-error-listener`.
  - `backend-pet-tracker/node_modules` no existe. Antes del primer comando:
    `cd /home/claude/sites/Pet-Tracker-wt-238/backend-pet-tracker && pnpm install --frozen-lockfile`.
  - Los tests de esta feature no necesitan Postgres ni `.env`.
- **Commits test-primero, separados.** Cada commit lleva el mensaje literal de su
  bloque. El rojo de R1 va en su propio commit, antes del arreglo.
- **El rojo falla por aserción** (`expect(received).not.toThrow()`, enmienda E1),
  nunca por `ReferenceError`, un import que falta o un error de tipos.
- **Cada commit compila.** `tsc` y `eslint` de los dos ficheros salen con 0
  (§Comandos).
- **Formato.** `pnpm exec prettier --write src/db/drizzle.module.ts src/db/drizzle.module.spec.ts`
  antes de cada commit que toque código.
- **Prohibido:**
  - `./init.sh` (lo corre el leader);
  - `pnpm run test:e2e` y cualquier e2e;
  - `psql` o cualquier `docker exec` contra Postgres;
  - `pnpm run db:migrate`;
  - `git fetch`, merge y rebase;
  - tocar `scripts/`, `test/`, las migraciones, `package.json` o `pnpm-lock.yaml`;
  - tocar AWS.
- **Trazabilidad.** No se toca [[traceability]] durante la cadena. Al final, un
  único commit rellena todas las filas (§Cierre).
- **Mensajes de commit.** Todos terminan con el trailer de la sesión que commitea.

## Comandos

Desde `backend-pet-tracker/`. El código de salida se mide sin pipe:

```sh
cd /home/claude/sites/Pet-Tracker-wt-238/backend-pet-tracker
FORCE_COLOR=0 pnpm exec jest --config package.json src/db/drizzle.module.spec.ts > /tmp/impl-238-file.log 2>&1; echo "exit=$?"
grep -E '^Tests:' /tmp/impl-238-file.log
FORCE_COLOR=0 pnpm exec jest --config package.json > /tmp/impl-238-unit.log 2>&1; echo "exit=$?"
grep -E '^Tests:' /tmp/impl-238-unit.log
pnpm exec tsc --noEmit -p tsconfig.json; echo "exit=$?"
pnpm exec eslint src/db/drizzle.module.ts src/db/drizzle.module.spec.ts; echo "exit=$?"
```

Nunca `pnpm run test -- …`: el `--` llega a jest (memoria
`pnpm-dobleguion-llega-a-jest`).

## R1 — Un error del pool se loguea y no tumba el proceso

- [ ] (1) **Rojo.** En `src/db/drizzle.module.spec.ts`, detrás del
  `describe('R4: …')`, sin tocarlo:
  - los imports de [[design]] §El test;
  - `describe('#238: PG_POOL logs idle client errors instead of crashing', ...)`
    con su `beforeAll`, su `afterAll` y el it
    `#238 R1: an error emitted by PG_POOL is logged with Logger.error and does not throw`
    ([[design]] §El test, pasos 1 a 5).

  No se toca `src/db/drizzle.module.ts`.

  Esperado (fichero):
  - `exit` distinto de 0;
  - `Tests: 1 failed, 1 passed, 2 total`;
  - cae solo el it de R1;
  - `grep -cF 'expect(received).not.toThrow()' /tmp/impl-238-file.log` da `1`;
  - `grep -cF 'Error message: "Unhandled error.' /tmp/impl-238-file.log` da `1`;
  - `tsc` y `eslint` con `exit=0`.

  Commit: `test(backend-pg-pool-error-listener): PG_POOL error is logged and does not throw (R1)`.
- [ ] (2) **Verde.** En `src/db/drizzle.module.ts`, el import de `Logger`,
  `const poolLogger = new Logger('PgPool');` y el factory de tres sentencias
  ([[design]] §El listener). No se cambia nada más.

  Esperado:
  - fichero: `exit=0`, `Tests: 2 passed, 2 total`;
  - suite unitaria completa: `exit=0`;
  - `tsc` y `eslint` con `exit=0`;
  - las cuentas `grep -cF` de [[requirements]] R1, las dos tablas, una línea
    por literal.

  Commit: `fix(backend-pg-pool-error-listener): log idle client errors on PG_POOL instead of crashing (R1)`.
- [ ] (3) **Refactor.** No se espera ninguno. Si hiciera falta, va en un commit
  `refactor(backend-pg-pool-error-listener): …` aparte, con
  `Tests: 2 passed, 2 total` en el fichero.
- [ ] (4) **Mutaciones M1 y M2** ([[design]] §Mutaciones), sobre el HEAD de
  (2) o (3). Por cada una:
  - plantar;
  - correr el fichero;
  - anotar `exit`, la línea `Tests:` y el mensaje del it de R1 (y, en M1,
    `grep -cF "on('error'" src/db/drizzle.module.ts`, esperado `0`);
  - restaurar con `git checkout HEAD -- src/db/drizzle.module.ts`;
  - comprobar `git diff --quiet HEAD -- src/db/drizzle.module.ts; echo "exit=$?"`
    → `exit=0`.

  No se commitea nada de las mutaciones.

## R2 — Alcance: solo el módulo de drizzle y su test

- [ ] (1) **Verificación, desde la raíz** (`/home/claude/sites/Pet-Tracker-wt-238`):
  - `git diff --name-only origin/dev...HEAD -- backend-pet-tracker/` lista
    exactamente `backend-pet-tracker/src/db/drizzle.module.spec.ts` y
    `backend-pet-tracker/src/db/drizzle.module.ts`;
  - `git diff --quiet origin/dev...HEAD -- backend-pet-tracker/scripts backend-pet-tracker/test backend-pet-tracker/src/db/migrations backend-pet-tracker/package.json backend-pet-tracker/pnpm-lock.yaml; echo "exit=$?"`
    → `exit=0`;
  - las dos cuentas `grep -cF` del `describe('R4: …')` y de su it de
    [[requirements]] R2 → `1` y `1`.
- [ ] (2) **Suite unitaria, `tsc` y `eslint`** (§Comandos): `exit=0` en los
  tres. Ninguna implementación nueva: R2 es de alcance.
- [ ] (3) Sin refactor.

## Cierre

- [ ] Escribir `progress/impl_backend-pg-pool-error-listener.md` con:
  - los hashes de la cadena;
  - la línea `Tests:` y el `exit` de cada paso;
  - la evidencia de M1 y M2;
  - las cuentas de R1;
  - los comandos y salidas de R2.
- [ ] Rellenar [[traceability]]: cada fila con su test (`archivo::nombre`) o su
  verificación, y el hash más el mensaje.
- [ ] Commit único: `docs(backend-pg-pool-error-listener): mutation evidence and traceability (R1,R2)`.
