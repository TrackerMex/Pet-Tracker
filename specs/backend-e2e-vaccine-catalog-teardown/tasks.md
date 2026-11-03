---
feature: "backend-e2e-vaccine-catalog-teardown"
status: draft        # draft | approved
tags: [harness, spec, backend, e2e, flake]
---

# Tareas — [[backend-e2e-vaccine-catalog-teardown]]

> Disciplina TDD (CHECKPOINTS C4). Cada requisito de [[requirements]] tiene sus
> tres pasos: (1) test rojo, (2) implementación mínima y (3) refactor. La forma
> de `dropDatabase`, los its y la mutación están en [[design]]. Las rutas son
> relativas a `backend-pet-tracker/`, salvo los documentos y los comandos
> marcados «desde la raíz».
>
> En esta feature, la «implementación» también es código de test: el arreglo
> vive en el `afterAll` del e2e.

## Reglas de la cadena

- **Antes de empezar.**
  - La casilla de aprobación de [[requirements]] tiene que estar marcada.
  - Worktree: `/home/claude/sites/Pet-Tracker-wt-237`, branch
    `feature/237-backend-e2e-vaccine-catalog-teardown`.
  - El `.env` de la raíz ya existe.
  - `backend-pet-tracker/node_modules` no existe. Antes del primer comando:
    `cd /home/claude/sites/Pet-Tracker-wt-237/backend-pet-tracker && pnpm install --frozen-lockfile`.
- **Commits test-primero, separados.** Cada commit lleva el mensaje literal de su
  bloque. El rojo de R1 va en su propio commit, antes del arreglo.
- **El rojo falla por aserción**, nunca por `Unhandled error`, `ReferenceError`
  ni un error de tipos. Por eso la sonda `pool.on('error', …)` del it se engancha
  antes del primer `query` ([[design]] §Los its nuevos).
- **Cada commit compila.** `tsc` y `eslint` del fichero salen con 0 (§Comandos).
- **Formato.** `pnpm exec prettier --write test/vaccine-catalog-migration.e2e-spec.ts`
  antes de cada commit que toque el e2e.
- **Prohibido:**
  - `./init.sh` (lo corre el leader);
  - `psql` o cualquier `docker exec` contra Postgres;
  - `pnpm run db:migrate`;
  - `git fetch`, merge y rebase;
  - tocar `src/`, las migraciones, `package.json` o `pnpm-lock.yaml`;
  - tocar AWS.
- **Trazabilidad.** No se toca [[traceability]] durante la cadena. Al final, un
  único commit rellena todas las filas (§Cierre).
- **Mensajes de commit.** Todos terminan con el trailer de la sesión que commitea.

## Comandos

Desde `backend-pet-tracker/`. El código de salida se mide sin pipe:

```sh
cd /home/claude/sites/Pet-Tracker-wt-237/backend-pet-tracker
FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json test/vaccine-catalog-migration.e2e-spec.ts > /tmp/impl-237-e2e.log 2>&1; echo "exit=$?"
grep -E '^Tests:' /tmp/impl-237-e2e.log
FORCE_COLOR=0 pnpm exec jest --config package.json > /tmp/impl-237-unit.log 2>&1; echo "exit=$?"
pnpm exec tsc --noEmit -p tsconfig.json; echo "exit=$?"
pnpm exec eslint test/vaccine-catalog-migration.e2e-spec.ts; echo "exit=$?"
```

Nunca `pnpm run test:e2e -- …`: el `--` llega a jest (memoria
`pnpm-dobleguion-llega-a-jest`). El e2e necesita el Postgres del `DATABASE_URL`
del `.env`, con permiso `CREATEDB`, el mismo que ya usa #226.

## R1 — Con una sesión viva, el borrado falla con nombre y no mata a nadie

- [ ] (1) **Rojo.** En `test/vaccine-catalog-migration.e2e-spec.ts`:
  - añadir `async function dropDatabase(name: string): Promise<void>` dentro del
    `describe` externo, **todavía con** el SQL de hoy:
    `DROP DATABASE IF EXISTS "<name>" WITH (FORCE)`;
  - cambiar las dos funciones del `DROP` del `cleanup` por
    `if (createdA) await dropDatabase(databaseA);` y
    `if (createdB) await dropDatabase(databaseB);` ([[design]] §El `afterAll`);
  - añadir `describe('#237: dropDatabase no termina sesiones ajenas', ...)` detrás
    del `describe` de `#226 R3`, con el it
    `#237 R1: con una sesion viva, dropDatabase rechaza con 55006, no borra la base y la sesion no recibe 57P01`
    ([[design]] §Los its nuevos, «R1, sesión viva»).

  Esperado:
  - `exit` distinto de 0;
  - `Tests: 1 failed, 7 passed, 8 total`;
  - el it de R1 falla con `Received promise resolved instead of rejected`;
  - `grep -cF 'WITH (FORCE)'` sobre el e2e devuelve `1`;
  - `grep -cF 'DROP DATABASE IF EXISTS'` devuelve `1`.

  Commit: `test(backend-e2e-vaccine-catalog-teardown): a live session survives dropDatabase (R1)`.
- [ ] (2) **Verde.** Quitar ` WITH (FORCE)` del SQL de `dropDatabase`. No se
  cambia nada más.

  Esperado:
  - `exit=0`;
  - `Tests: 8 passed, 8 total`;
  - `grep -cF 'WITH (FORCE)'` devuelve `0`.

  Commit: `fix(backend-e2e-vaccine-catalog-teardown): drop test databases without FORCE (R1,R3)`.
- [ ] (3) **Refactor.** No se espera ninguno. Si hiciera falta, va en un commit
  `refactor(backend-e2e-vaccine-catalog-teardown): …` aparte, con `Tests: 8 passed, 8 total`.

## R2 — Justo después de `pool.end()`, el borrado funciona y nadie recibe error

- [ ] (1) **Test, que nace verde.** Añadir al `describe` de `#237` el it
  `#237 R2: justo despues de pool.end(), dropDatabase borra la base y el pool no recibe ningun error`
  ([[design]] §Los its nuevos, «R2, sesión recién cerrada»).
  - Entre `await pool.end()` y `dropDatabase` no va nada.
  - Nace verde tras R1 (2), por la justificación de [[requirements]] R2.

  Esperado:
  - `exit=0`;
  - `Tests: 9 passed, 9 total`.

  Commit: `test(backend-e2e-vaccine-catalog-teardown): dropDatabase right after pool.end() (R2, nace verde)`.
- [ ] (2) **Implementación.** Ninguna: ya la cubre R1 (2).
- [ ] (3) **Refactor.** Ninguno.

## R3 — El `afterAll` borra A y B solo con `dropDatabase` y sin `FORCE`

- [ ] (1) **Verificación, sin test nuevo.** Las cuentas de la tabla de
  [[requirements]] R3, medidas con `grep -cF` sobre
  `test/vaccine-catalog-migration.e2e-spec.ts`, una línea por literal. Cada
  cifra se copia al reporte junto a la esperada.
- [ ] (2) **Mutación M1** ([[design]] §Mutaciones), sobre el HEAD de R2:
  - plantar ` WITH (FORCE)` en `dropDatabase`;
  - correr el e2e;
  - anotar `exit`, la línea `Tests:`, el mensaje del it de R1 y
    `grep -cF 'WITH (FORCE)'` (esperado: `1`);
  - restaurar con `git checkout HEAD -- test/vaccine-catalog-migration.e2e-spec.ts`;
  - comprobar `git diff --quiet HEAD -- test/vaccine-catalog-migration.e2e-spec.ts; echo "exit=$?"`
    (esperado: `exit=0`).

  No se commitea nada de la mutación.
- [ ] (3) **Orden del `cleanup`.** Anotar en el reporte el
  `git diff 5c7c9547 -- test/vaccine-catalog-migration.e2e-spec.ts` del array
  `cleanup`. Solo cambian las dos funciones del `DROP`.

## R4 — Alcance: solo el e2e

- [ ] (1) **Verificación, desde la raíz:**
  - `git diff --name-only 5c7c9547...HEAD -- backend-pet-tracker/` lista
    exactamente `backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts`;
  - `git diff --quiet 5c7c9547...HEAD -- backend-pet-tracker/src backend-pet-tracker/package.json backend-pet-tracker/pnpm-lock.yaml; echo "exit=$?"`
    da `exit=0`.
- [ ] (2) **Suite unitaria, `tsc` y `eslint`** (§Comandos): `exit=0` en los tres.
- [ ] (3) Sin refactor.

## Cierre

- [ ] Escribir `progress/impl_backend-e2e-vaccine-catalog-teardown.md` con:
  - los hashes de la cadena;
  - la línea `Tests:` y el `exit` de cada paso;
  - la evidencia de M1;
  - las cuentas de R3;
  - los comandos de R4.
- [ ] Rellenar [[traceability]]: cada fila con su test (`archivo::nombre`) o su
  verificación, y el hash más el mensaje.
- [ ] Commit único: `docs(backend-e2e-vaccine-catalog-teardown): mutation evidence and traceability (R1,R2,R3,R4)`.
