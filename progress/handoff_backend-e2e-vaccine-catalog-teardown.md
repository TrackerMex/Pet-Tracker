Worktree: /home/claude/sites/Pet-Tracker-wt-237

NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

# Handoff #237 backend-e2e-vaccine-catalog-teardown

Implementador: Codex CLI.

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-237 && pwd && git branch --show-current && git log --oneline -4`.
Confirma en el reporte la ruta y la branch `feature/237-backend-e2e-vaccine-catalog-teardown`.
Los commits, de arriba abajo:

1. este handoff (`docs(progress): #237 codex handoff`);
2. la firma `d5065fa8`;
3. el merge de `origin/dev` `2fb499b4`;
4. `9f1e6824`.

## Base

- Feature: backend-e2e-vaccine-catalog-teardown (#237). Integra en `dev`, no en `main`.
- H0, la base del diff final, es el commit de este handoff: el primero de `git log`.
- El worktree ya tiene el `.env` de la raíz y `backend-pet-tracker/node_modules`; el leader corrió
  `pnpm install --frozen-lockfile`. **No corras `pnpm install`**: el paso «Antes de empezar» de
  tasks.md ya está hecho.
- No abras, no leas y no imprimas el `.env`: lo cargan el e2e y `dotenv` solos.
- NO hagas `git fetch`, `git merge`, `git rebase` ni `git push`.
- Anclas de partida. Las mide el leader en `d5065fa8`, desde `backend-pet-tracker/`, sobre
  `test/vaccine-catalog-migration.e2e-spec.ts`. Cada una es un `grep -cF '<literal>'` sobre ese
  fichero:

  | Literal | Da |
  |---|---|
  | `WITH (FORCE)` | `2` |
  | `DROP DATABASE IF EXISTS` | `2` |
  | `dropDatabase` | `0` |
  | `on('error'` | `0` |
  | `it('#226` | `7` |
  | `describe('#226` | `4` |
  | `it('#237` | `0` |
  | `pet_tracker_237` | `0` |

  Mídelas otra vez antes del primer commit y anótalas. Si una no da la suya, PARA.

## Spec

- Aprobada: el humano aprobó la firma de forma explícita y el leader la firmó (`d5065fa8`). Lee
  enteros `specs/backend-e2e-vaccine-catalog-teardown/requirements.md`, `design.md`, `tasks.md`
  y `traceability.md`.
- tasks.md manda en el orden, los mensajes de commit literales, los «Esperado» de cada paso y la
  mutación M1. design.md manda en la forma de `dropDatabase`, del `afterAll` y de los dos `it`
  nuevos.
- Sin decisiones abiertas. Si encuentras una contradicción, PARA y anótala en el reporte; no
  adaptes la spec por tu cuenta.
- El `status` del frontmatter y la casilla de aprobación no son tuyos.

## Orden y commits

Test primero, con historial rojo y después verde (C4 de CHECKPOINTS.md). Cuatro commits, con
los mensajes literales de tasks.md y en este orden. Nada de un commit único con todo.

1. **T0**, sin commit. Antes de tocar nada, corre el e2e una vez sobre H0. Esperado: `exit=0` y
   `Tests: 7 passed, 7 total`. Si cae con `Unhandled error` y `57P01` (el flake que arregla esta
   feature), repítelo una vez y anota las dos corridas. Si cae por otra cosa, PARA.
2. **Rojo de R1**: `test(backend-e2e-vaccine-catalog-teardown): a live session survives dropDatabase (R1)`.
   - Esperado: `exit` distinto de 0 y `Tests: 1 failed, 7 passed, 8 total`.
   - Cae solo el `it` de R1, con `Received promise resolved instead of rejected`.
   - El rojo tiene que ser por aserción, nunca por `Unhandled error`, `ReferenceError` ni tipos.
     La sonda `pool.on('error', …)` se engancha antes del primer `query`.
   - Anota la aserción y su recibido.
3. **Verde de R1**: `fix(backend-e2e-vaccine-catalog-teardown): drop test databases without FORCE (R1,R3)`.
   - Esperado: `exit=0` y `Tests: 8 passed, 8 total`.
   - Solo quita ` WITH (FORCE)` del SQL de `dropDatabase`.
4. **R2, nace verde**: `test(backend-e2e-vaccine-catalog-teardown): dropDatabase right after pool.end() (R2, nace verde)`.
   - Esperado: `exit=0` y `Tests: 9 passed, 9 total`.
   - Entre `await pool.end()` y `dropDatabase` no va nada.
5. **R3 y M1**, sin commit (tasks.md R3).
   - Mide las cuentas de R3 y anota cada una junto a la esperada.
   - Planta M1, corre el e2e y anota el `exit`, la línea `Tests:`, el mensaje del `it` de R1 y el
     `grep -cF 'WITH (FORCE)'` (esperado `1`).
   - Si el `it` de R1 no cae con M1 plantada, PARA.
   - Restaura con `git checkout HEAD -- test/vaccine-catalog-migration.e2e-spec.ts` y comprueba
     `git diff --quiet HEAD -- test/vaccine-catalog-migration.e2e-spec.ts; echo "exit=$?"`, que da
     `exit=0`.
   - Anota el diff del array `cleanup` contra `5c7c9547` (tasks.md R3 (3)).
6. **R4**, sin commit: las dos órdenes de tasks.md R4 (1), y la suite unitaria, `tsc` y `eslint`
   (§Comandos de abajo).
7. **Cierre**: `docs(backend-e2e-vaccine-catalog-teardown): mutation evidence and traceability (R1,R2,R3,R4)`.
   - Solo `specs/backend-e2e-vaccine-catalog-teardown/traceability.md` y
     `progress/impl_backend-e2e-vaccine-catalog-teardown.md`.
   - Cada fila lleva su test (`archivo::nombre`) o su verificación, y el hash y el mensaje de su
     commit.
   - No rebasees después.

Por cada commit que toque el e2e, en este orden y desde `backend-pet-tracker/`:

1. `pnpm exec prettier --write test/vaccine-catalog-migration.e2e-spec.ts`;
2. `pnpm exec prettier --check test/vaccine-catalog-migration.e2e-spec.ts && pnpm exec eslint test/vaccine-catalog-migration.e2e-spec.ts && pnpm exec tsc --noEmit -p tsconfig.json; echo "exit=$?"`, que da `exit=0`;
3. el e2e.

## Archivos

Lista cerrada, desde la raíz:

- `backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts`;
- `specs/backend-e2e-vaccine-catalog-teardown/traceability.md`;
- `progress/impl_backend-e2e-vaccine-catalog-teardown.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar:

- `backend-pet-tracker/src/`, las migraciones, `package.json`, `pnpm-lock.yaml`,
  `test/jest-e2e.json` ni ningún otro fichero de `test/`;
- `.env`, `mobile-pet-tracker/`, `init.sh`, `feature_list.json` ni `docs/`;
- el resto de `specs/` y de `progress/`, incluido este handoff.

## Comandos

Todos desde `backend-pet-tracker/`, después de este `cd` literal:
`cd /home/claude/sites/Pet-Tracker-wt-237/backend-pet-tracker && pwd`.

- e2e: `FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json test/vaccine-catalog-migration.e2e-spec.ts > /tmp/impl-237-e2e.log 2>&1; echo "exit=$?"`.
  Luego `grep -E '^(Test Suites|Tests):' /tmp/impl-237-e2e.log`.
- unitarios: `FORCE_COLOR=0 pnpm exec jest --config package.json --testTimeout=30000 > /tmp/impl-237-unit.log 2>&1; echo "exit=$?"`.
  El `--testTimeout=30000` lo añade este handoff a la orden de tasks.md: la máquina va cargada con
  jest de otros worktrees y el flag solo absorbe esa carga. El e2e no lo lleva, porque ya fija
  `jest.setTimeout(180_000)`.
- tipos: `pnpm exec tsc --noEmit -p tsconfig.json; echo "exit=$?"`.
- lint: `pnpm exec eslint test/vaccine-catalog-migration.e2e-spec.ts; echo "exit=$?"`.

Mide los códigos de salida sin pipe. De cada log pega en el reporte el `exit=`, la línea
`Test Suites:` y la línea `Tests:`.

Prohibido:

- `pnpm run test -- …` y `pnpm run test:e2e -- …`, porque el `--` llega a jest;
- `pnpm run lint`, porque lleva `--fix` sobre todo el árbol;
- `psql`, `docker exec`, `pnpm run db:migrate` y `drizzle-kit migrate`;
- tocar AWS, matar procesos ajenos o borrar bases ajenas. El e2e solo crea y borra las suyas.

## Esperas

Antes de **cada** corrida de jest, sea e2e o unitaria, corre estos dos comandos por separado.

1. Que no haya un `DATABASE_URL` exportado que pise al `.env`:
   `test -z "${DATABASE_URL:-}"; echo "$?"`. Tiene que dar `0`; si da `1`, PARA.
2. Que no corra ningún `init.sh`, porque comparte Postgres con el e2e:
   `for i in $(seq 1 90); do pgrep -f '[i]nit\.sh' > /dev/null || break; sleep 60; done; pgrep -f '[i]nit\.sh'; echo "espera=$?"`.
   - Tiene que dar `espera=1`.
   - Si da `espera=0` tras los 90 minutos, anótalo y vuelve a correr la misma orden.
   - Nunca mates esos procesos.

Otras reglas de espera:

- Ahora mismo el leader corre `init.sh` en otro worktree, así que es normal que T0 espere.
- Los jest de otros worktrees (móvil) no se esperan: cargan la CPU, pero no comparten Postgres.
- Un timeout aislado se repite tal cual, con la espera vacía, antes de tocar nada. Si se repite,
  PARA.
- Si Postgres no está arriba (`ECONNREFUSED`), PARA y anótalo: sin Postgres no hay rojo ni verde
  que medir.

## Reglas críticas

- Si una cifra, ancla o salida no coincide con la que dan tasks.md o este handoff, PARA y anota
  la diferencia. No ajustes la cifra.
- Un `ENOENT` o un `Cannot find module` justo después de crear algo suele ser un error de
  invocación (una ruta mal escrita, un `cd` que falta). Revisa el comando antes de tocar código.
- Literales a mano: nombres de los `it`, códigos (`55006`, `57P01`) y SQL van escritos en el test,
  nunca importados.
- `#237` en el código y en los títulos va como en design.md. No inventes otros.
- **Árbol limpio, acotado.** Al terminar, `git status --short -- backend-pet-tracker specs` tiene
  que salir vacío.
- Borra `/tmp/impl-237-e2e.log` y `/tmp/impl-237-unit.log` antes de terminar.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

Va en `progress/impl_backend-e2e-vaccine-catalog-teardown.md`, dentro del commit de cierre. Lleva:

- la salida del primer comando y las anclas de partida;
- T0;
- cada commit con su hash, la línea `Tests:` y el `exit`. En el rojo, el `it` que cae y la
  aserción con su recibido;
- M1 con su orden, su salida y la restauración;
- las cuentas de R3 junto a las esperadas;
- las órdenes de R4 con su salida;
- unitarios, `tsc` y `eslint`;
- cualquier PARA.

Última acción: crear `progress/impl_backend-e2e-vaccine-catalog-teardown.done` con una sola
línea, la ruta del reporte. Es el marcador que vigila el leader; no lo commitees. Devuelve solo
esa ruta.
