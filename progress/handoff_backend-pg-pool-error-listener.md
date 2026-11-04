Worktree: /home/claude/sites/Pet-Tracker-wt-238

NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

# Handoff #238 backend-pg-pool-error-listener

Implementador: Codex CLI.

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-238 && pwd && git branch --show-current && git log --oneline -4`.
Confirma en el reporte la ruta y la branch `feature/238-backend-pg-pool-error-listener`.
Los commits, de arriba abajo:

1. la firma de la enmienda (`chore(spec): sign #238 E1 (approved by the human 2026-11-04)`);
2. la enmienda E1 (`docs(spec): #238 E1 red message is jest 30's`), que también reescribe este
   handoff;
3. el handoff original `3298a0a9`;
4. la firma `f5093b22`.

## Base

- Feature: backend-pg-pool-error-listener (#238). Integra en `dev`, no en `main`.
- H0, la base del diff final, es la firma de la enmienda: el primero de `git log`.
- El leader ya corrió `pnpm install --frozen-lockfile` en `backend-pet-tracker/`. **No corras
  `pnpm install`**: el paso «Antes de empezar» de tasks.md ya está hecho.
- Los tests de esta feature no necesitan Postgres ni `.env`. No abras, no leas y no imprimas el
  `.env`.
- NO hagas `git fetch`, `git merge`, `git rebase` ni `git push`.
- Anclas de partida. Las midió el leader en `f5093b22`; la enmienda E1 no toca código, así que
  siguen valiendo. Se miden desde `backend-pet-tracker/`. Cada una
  es un `grep -cF '<literal>'` sobre el fichero de su fila:

  | Fichero | Literal | Da |
  |---|---|---|
  | `src/db/drizzle.module.ts` | `new Pool(` | `1` |
  | ídem | `on('error'` | `0` |
  | ídem | `Logger` | `0` |
  | ídem | `throw` | `0` |
  | ídem | `provide: PG_POOL,` | `1` |
  | ídem | `connectionString: config.get<string>('DATABASE_URL'),` | `1` |
  | ídem | `await this.pool.end();` | `1` |
  | ídem | `exports: [DRIZZLE],` | `1` |
  | `src/db/drizzle.module.spec.ts` | `describe('R4: DrizzleModule exposes a Drizzle client under the DRIZZLE token'` | `1` |
  | ídem | `it('resolves a drizzle-orm/node-postgres client under DRIZZLE'` | `1` |
  | ídem | `#238` | `0` |
  | ídem | `PG_POOL` | `0` |
  | ídem | `Logger` | `0` |

  Mídelas otra vez antes del primer commit y anótalas. Si una no da la suya, PARA.

## Spec

- Aprobada: el humano aprobó la firma de forma explícita y el leader la firmó (`f5093b22`). La
  enmienda E1 (requirements.md §Aprobación) también lleva la aprobación del humano. Lee
  enteros `specs/backend-pg-pool-error-listener/requirements.md`, `design.md`, `tasks.md` y
  `traceability.md`.
- tasks.md manda en el orden, los mensajes de commit literales y los «Esperado» de cada paso.
  design.md manda en la forma del listener, del `describe`, del it y de las mutaciones M1 y M2.
- Sin decisiones abiertas. Si encuentras una contradicción, PARA y anótala en el reporte; no
  adaptes la spec por tu cuenta.
- El `status` del frontmatter y la casilla de aprobación no son tuyos.

## Orden y commits

Test primero, con historial rojo y después verde (C4 de CHECKPOINTS.md). Tres commits, con los
mensajes literales de tasks.md y en este orden. Nada de un commit único con todo.

1. **T0**, sin commit. Antes de tocar nada, corre el fichero de test una vez sobre H0.
   Esperado: `exit=0` y `Tests: 1 passed, 1 total`. Si no, PARA.
2. **Rojo de R1**: `test(backend-pg-pool-error-listener): PG_POOL error is logged and does not throw (R1)`.
   - Solo `src/db/drizzle.module.spec.ts`; no se toca `src/db/drizzle.module.ts`.
   - Esperado (fichero): `exit` distinto de 0 y `Tests: 1 failed, 1 passed, 2 total`.
   - Cae solo el it de R1. Con jest 30 el log trae `expect(received).not.toThrow()` y
     `Error message: "Unhandled error.`. Mide los dos con `grep -cF` sobre `/tmp/impl-238-file.log`;
     cada uno da `1` (enmienda E1).
   - El rojo tiene que ser por aserción, nunca por `ReferenceError`, un import que falta o tipos.
   - Anota la aserción y su recibido.
3. **Verde de R1**: `fix(backend-pg-pool-error-listener): log idle client errors on PG_POOL instead of crashing (R1)`.
   - Solo `src/db/drizzle.module.ts`.
   - Esperado (fichero): `exit=0` y `Tests: 2 passed, 2 total`.
   - Suite unitaria completa: `exit=0`.
   - Las cuentas `grep -cF` de las dos tablas de requirements.md R1, una línea por literal,
     junto a la esperada.
4. **Refactor**: no se espera ninguno. Si hiciera falta, PARA y anótalo antes de commitear.
5. **M1 y M2**, sin commit (design.md §Mutaciones), sobre el HEAD del verde.
   - Por cada una: plantar, correr el fichero, anotar el `exit`, la línea `Tests:` y el mensaje
     del it de R1. En M1, además, `grep -cF "on('error'" src/db/drizzle.module.ts` (esperado `0`)
     y los dos `grep -cF` del rojo sobre el log (esperado `1` cada uno).
   - Si el it de R1 no cae con una de las dos plantada, PARA.
   - Restaura con `git checkout HEAD -- src/db/drizzle.module.ts` y comprueba
     `git diff --quiet HEAD -- src/db/drizzle.module.ts; echo "exit=$?"`, que da `exit=0`.
6. **R2**, sin commit: las órdenes de tasks.md §R2 (1), desde la raíz del worktree, y la suite
   unitaria, `tsc` y `eslint` (§Comandos de abajo).
7. **Cierre**: `docs(backend-pg-pool-error-listener): mutation evidence and traceability (R1,R2)`.
   - Solo `specs/backend-pg-pool-error-listener/traceability.md` y
     `progress/impl_backend-pg-pool-error-listener.md`.
   - Cada fila lleva su test (`archivo::nombre`) o su verificación, y el hash y el mensaje de su
     commit.
   - No rebasees después.

Por cada commit que toque código, en este orden y desde `backend-pet-tracker/`:

1. `pnpm exec prettier --write src/db/drizzle.module.ts src/db/drizzle.module.spec.ts`;
2. `pnpm exec prettier --check src/db/drizzle.module.ts src/db/drizzle.module.spec.ts && pnpm exec eslint src/db/drizzle.module.ts src/db/drizzle.module.spec.ts && pnpm exec tsc --noEmit -p tsconfig.json; echo "exit=$?"`, que da `exit=0`;
3. el fichero de test.

## Archivos

Lista cerrada, desde la raíz:

- `backend-pet-tracker/src/db/drizzle.module.ts`;
- `backend-pet-tracker/src/db/drizzle.module.spec.ts`;
- `specs/backend-pg-pool-error-listener/traceability.md`;
- `progress/impl_backend-pg-pool-error-listener.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar:

- el resto de `backend-pet-tracker/`: `scripts/`, `test/`, las migraciones, `package.json` ni
  `pnpm-lock.yaml`;
- `.env`, `mobile-pet-tracker/`, `init.sh`, `feature_list.json` ni `docs/`;
- el resto de `specs/` y de `progress/`, incluido este handoff.

## Comandos

Todos desde `backend-pet-tracker/`, después de este `cd` literal:
`cd /home/claude/sites/Pet-Tracker-wt-238/backend-pet-tracker && pwd`.

- fichero: `FORCE_COLOR=0 pnpm exec jest --config package.json src/db/drizzle.module.spec.ts > /tmp/impl-238-file.log 2>&1; echo "exit=$?"`.
  Luego `grep -E '^(Test Suites|Tests):' /tmp/impl-238-file.log`.
- unitarios: `FORCE_COLOR=0 pnpm exec jest --config package.json --testTimeout=30000 > /tmp/impl-238-unit.log 2>&1; echo "exit=$?"`.
  Luego `grep -E '^(Test Suites|Tests):' /tmp/impl-238-unit.log`. El `--testTimeout=30000` lo
  añade este handoff a la orden de tasks.md: la máquina va cargada con jest de otros worktrees y
  el flag solo absorbe esa carga.
- tipos: `pnpm exec tsc --noEmit -p tsconfig.json; echo "exit=$?"`.
- lint: `pnpm exec eslint src/db/drizzle.module.ts src/db/drizzle.module.spec.ts; echo "exit=$?"`.

Mide los códigos de salida sin pipe. De cada log pega en el reporte el `exit=`, la línea
`Test Suites:` y la línea `Tests:`.

Prohibido:

- `pnpm run test -- …`, porque el `--` llega a jest;
- `pnpm run lint`, porque lleva `--fix` sobre todo el árbol;
- `pnpm run test:e2e` y cualquier e2e;
- `psql`, `docker exec`, `pnpm run db:migrate` y `drizzle-kit migrate`;
- tocar AWS o matar procesos ajenos.

## Esperas

Antes de **cada** corrida de la suite unitaria completa (no del fichero suelto), espera a que no
corra ningún `init.sh`: la suite completa carga la CPU que el `init.sh` del leader o de Frontend
necesita.

- `for i in $(seq 1 90); do pgrep -f '[i]nit\.sh' > /dev/null || break; sleep 60; done; pgrep -f '[i]nit\.sh'; echo "espera=$?"`.
- Tiene que dar `espera=1`. Si da `espera=0` tras los 90 minutos, anótalo y vuelve a correr la
  misma orden. Nunca mates esos procesos.

Otras reglas de espera:

- El fichero suelto (`src/db/drizzle.module.spec.ts`) no espera: son dos tests sin Postgres.
- Un timeout aislado se repite tal cual, con la espera vacía, antes de tocar nada. Si se repite,
  PARA.

## Reglas críticas

- Si una cifra, ancla o salida no coincide con la que dan tasks.md o este handoff, PARA y anota
  la diferencia. No ajustes la cifra.
- Un `ENOENT` o un `Cannot find module` justo después de crear algo suele ser un error de
  invocación (una ruta mal escrita, un `cd` que falta). Revisa el comando antes de tocar código.
- Literales a mano: el mensaje esperado del log y el del `Error` van escritos en el test, nunca
  importados ni construidos con el prefijo de producción.
- `#238` en los títulos va como en design.md. No inventes otros.
- **Árbol limpio, acotado.** Al terminar, `git status --short -- backend-pet-tracker specs` tiene
  que salir vacío.
- **No borres los logs de `/tmp`.** El sandbox deniega `rm -f`; los borra el leader.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reanudación tras la parada del 2026-11-04

- La primera sesión paró en el rojo de R1 por el literal de jest 29 y al borrar `/tmp`. Su
  reporte está commiteado en la enmienda E1. No lo borres: añade al final una sección
  `## Sesión 2 (tras la enmienda E1)` y escribe ahí todo lo de esta sesión.
- El diff del test que conserva ese reporte es el que pide design.md. Puedes reaplicarlo tal
  cual; vuelve a medir T0 y las anclas antes.
- El leader borró el marcador `.done` de la primera sesión.

## Reporte

Va en `progress/impl_backend-pg-pool-error-listener.md`, dentro del commit de cierre. Lleva:

- la salida del primer comando y las anclas de partida;
- T0;
- cada commit con su hash, la línea `Tests:` y el `exit`. En el rojo, el it que cae y la
  aserción con su recibido;
- M1 y M2 con su orden, su salida y la restauración;
- las cuentas de R1 junto a las esperadas;
- las órdenes de R2 con su salida;
- unitarios, `tsc` y `eslint`;
- cualquier PARA.

Última acción: crear `progress/impl_backend-pg-pool-error-listener.done` con una sola línea, la
ruta del reporte. Es el marcador que vigila el leader; no lo commitees. Devuelve solo esa ruta.
