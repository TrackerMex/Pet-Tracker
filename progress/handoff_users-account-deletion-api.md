Worktree: /home/claude/sites/Pet-Tracker-wt-247

NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

# Handoff #247 users-account-deletion-api

Implementador: Codex CLI.

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-247 && pwd && git branch --show-current && git log --oneline -3`.
Confirma en el reporte la ruta y la branch `feature/247-users-account-deletion-api`. Los commits,
de arriba abajo:

1. este handoff (`docs(handoff): users-account-deletion-api (#247) handoff to Codex`);
2. la firma `bf45e5fc`;
3. la spec `f2a90722`.

## Base

- Feature: users-account-deletion-api (#247). Integra en `dev`, no en `main`.
- H0, la base del diff final, es el commit de este handoff: el primero de `git log`.
- Precondiciones, ya hechas por el leader:
  - `backend-pet-tracker/node_modules` instalado;
  - el `.env` de la raíz del worktree, que apunta a la base propia `pet_tracker_wt247`
    (Postgres en 5433);
  - esa base, migrada: 24 filas en `drizzle.__drizzle_migrations`, igual que las 24 entradas de
    `src/db/migrations/meta/_journal.json`.

  **No corras `pnpm install`.** La única migración permitida es la de R1 (ver §Comandos).
- No abras, no leas y no imprimas el `.env`: lo cargan drizzle-kit y los e2e con `dotenv`.
- NO hagas `git fetch`, `git merge`, `git rebase`, `git commit --amend` ni `git push`.

## Anclas de partida

Las midió el leader en `bf45e5fc`; el commit del handoff no toca código. Son las de
requirements.md §Contexto fijo (40 filas, todas cuadran) y las 9 con pipe de tasks.md
(todas dan `0`). Mídelas otra vez desde la raíz del worktree, con `B=backend-pet-tracker`, antes
del primer commit, y anótalas (regla 7 de tasks.md). Las cinco que más importan:

| Orden | Da |
|---|---|
| `grep -cF '"tag"' backend-pet-tracker/src/db/migrations/meta/_journal.json` | `24` |
| `ls backend-pet-tracker/src/db/migrations \| grep -c '^0024_'` | `0` |
| `grep -cF "new AuthGuard(reflector, buildTokenService" backend-pet-tracker/src/modules/auth/infrastructure/guards/auth.guard.spec.ts` | `8` |
| `grep -rlF "PET_DATA_PURGER" backend-pet-tracker/src backend-pet-tracker/test \| wc -l` | `0` |
| `ls backend-pet-tracker/test \| grep -c '^users'` | `0` |

Si una no da la suya, PARA.

## Spec

- Aprobada con la firma delegada del leader (`bf45e5fc`). Lee enteros
  `specs/users-account-deletion-api/requirements.md`, `design.md`, `tasks.md` y
  `traceability.md`.
- tasks.md manda en el orden, los mensajes de commit literales, los stubs de cada rojo y los
  «nace verde» declarados. design.md manda en las firmas, los nombres de símbolo y la lista de
  ficheros (§Archivos afectados).
- Sin decisiones abiertas: las seis preguntas del spec_author están cerradas en design.md
  §Preguntas cerradas por el leader. Ninguna cambia requisitos ni tests. Si encuentras una
  contradicción, PARA y anótala en el reporte; no adaptes la spec por tu cuenta.
- El `status` del frontmatter y la casilla de aprobación no son tuyos.

## Orden y commits

Test primero, con historial rojo y después verde (C4 de CHECKPOINTS.md). **Nada de un commit
único con todo**, ni de juntar el rojo y el verde de un requisito.

- Los 13 commits de tasks.md §Tabla de commits, en ese orden y con esos mensajes literales.
- **Sin commits de refactor**: tasks.md los deja como opcionales; este handoff los quita para que
  la cuenta sea fija. Al terminar, `git rev-list --count <H0>..HEAD` da `13`.
- Un rojo cae **solo por aserción** (regla 2 de tasks.md): tras cada rojo,
  `grep -cE "ReferenceError|Cannot find module|error TS|TypeError|Nest can't resolve" <log del rojo>`
  da `0`. Anota en el reporte el `it` que cae y la línea decisiva.
- Los «nace verde» de la tabla pasan ya en su commit rojo: decláralos así en el reporte.
- `tsc` y `eslint` salen 0 en **todos** los commits, rojos incluidos.

Por cada commit, en este orden y desde `backend-pet-tracker/`:

1. `pnpm exec prettier --write <ficheros .ts tocados>`;
2. `pnpm exec prettier --check <ficheros .ts tocados> && pnpm exec eslint <ficheros .ts tocados> && pnpm exec tsc --noEmit -p tsconfig.json; echo "exit=$?"`, que da `exit=0`;
3. el jest del paso;
4. `git add` con rutas explícitas (nunca `git add -A` ni `git add .`) y `git commit`.

Tras cada commit, `git status --short -- . ../docs ../specs` no lista ningún fichero de esta
feature.

### Puntos de la cadena que piden atención

- **R1, commit 2**: el SQL y el snapshot los genera drizzle-kit (orden en §Comandos). No los
  edites a mano. Si drizzle-kit genera algo que el test de R1 no acepta, PARA. Tras
  `db:migrate`, la base tiene 25 filas en el journal; anótalo.
- **R2, commit 3**: el stub del guard cambia `canActivate` a `Promise<boolean>` sin `async`. Los
  8 `it` existentes del guard (E4) nacen verdes con el ctor nuevo.
- **R15 y R13**: los literales `PET_PURGE_FAILED store=… petId=… target=… reason=…`, `pets/p1/`
  y `PET#p1` van escritos en el test tal cual los da tasks.md, nunca importados de producción.
- **R3–R14, commits 11 y 12**: un solo par rojo/verde para todo el endpoint. El e2e de R14 espía
  `S3_CLIENT.send` y `Logger.prototype.error`; restaura ambos en `finally`.

## Archivos

Lista cerrada: la de design.md §Archivos afectados, los tests y fixtures que nombra tasks.md
(`created-by-set-null.schema.spec.ts`, las specs de esquema de E1–E3, `auth.guard.spec.ts`,
`delete-pet.use-case.spec.ts`, `pet-data-purger.aws.adapter.spec.ts`, los spec de
`users.controller`, `delete-account.use-case` y `account-deletion.drizzle.repository`,
`test/fixtures/pet-stores.ts`, `test/users.e2e-spec.ts`, `test/pets.e2e-spec.ts` y
`test/vaccine-catalog-migration.e2e-spec.ts`), `docs/data-model.md` (R1) y
`specs/auth-login-me/requirements.md` (nota de D2). Además:

- `specs/users-account-deletion-api/traceability.md`;
- `progress/impl_users-account-deletion-api.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar:

- `pnpm-lock.yaml`, `package.json`, `drizzle.config.ts`, `test/jest-e2e.json`, `tsconfig*.json`;
- las migraciones existentes `0000`–`0023`;
- `.env`, `mobile-pet-tracker/`, `infra/`, `init.sh` ni `feature_list.json`;
- el resto de `docs/`, de `specs/` y de `progress/`, incluido este handoff.

## Comandos

Todos desde `backend-pet-tracker/`, después de este `cd` literal:
`cd /home/claude/sites/Pet-Tracker-wt-247/backend-pet-tracker && pwd`.

- unitario de un fichero: `FORCE_COLOR=0 pnpm exec jest --config package.json <ruta-del-spec> > /tmp/impl-247-<R>-<red|green>.log 2>&1; echo "exit=$?"`.
- unitario parcial (regla 6): `FORCE_COLOR=0 pnpm exec jest --config package.json src/db/schema src/modules/auth src/modules/devices src/modules/pets src/modules/users > /tmp/impl-247-<R>-unit.log 2>&1; echo "exit=$?"`.
- e2e de la feature (regla 6): `FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json pets.e2e users.e2e vaccine-catalog-migration.e2e > /tmp/impl-247-<R>-e2e.log 2>&1; echo "exit=$?"`.
- suite unitaria completa (§Cierre): `FORCE_COLOR=0 pnpm exec jest --config package.json --testTimeout=30000 > /tmp/impl-247-unit-all.log 2>&1; echo "exit=$?"`.
  El `--testTimeout=30000` lo añade este handoff: la máquina va cargada con jest de otros
  worktrees y el flag solo absorbe esa carga. Los specs de un fichero no lo llevan.
- R1, solo en el commit 2 y en este orden:
  1. `pnpm db:generate --name created_by_set_null; echo "exit=$?"`;
  2. `test -z "${DATABASE_URL:-}"; echo "$?"`, que da `0`;
  3. `pnpm db:migrate; echo "exit=$?"`.
- Tras cada log: `grep -E '^(Test Suites|Tests):' <log>`.

Mide los códigos de salida sin pipe. De cada log pega en el reporte el `exit=`, la línea
`Test Suites:` y la línea `Tests:`.

Prohibido:

- `pnpm run <script> -- …`, porque el `--` llega a jest;
- `pnpm run lint`, porque lleva `--fix` sobre todo el árbol;
- `pnpm install`, `psql`, `docker` en cualquier forma, y `drizzle-kit` o `db:migrate` fuera del
  commit 2;
- `cdk`, la CLI de `aws` y cualquier llamada de red: los e2e hablan con LocalStack en local;
- matar procesos ajenos o borrar bases ajenas.

## Esperas

Antes de **cada** corrida de jest, unitaria o e2e, y antes de `db:migrate`, corre estos dos
comandos por separado.

1. Que no haya un `DATABASE_URL` exportado que pise al `.env`:
   `test -z "${DATABASE_URL:-}"; echo "$?"`. Tiene que dar `0`; si da `1`, PARA.
2. Que no corra ningún `init.sh`, porque comparte Postgres y LocalStack con los e2e:
   `for i in $(seq 1 90); do pgrep -f '[i]nit\.sh' > /dev/null || break; sleep 60; done; pgrep -f '[i]nit\.sh'; echo "espera=$?"`.
   - Tiene que dar `espera=1`.
   - Si da `espera=0` tras los 90 minutos, anótalo y vuelve a correr la misma orden.
   - Nunca mates esos procesos.

Otras reglas de espera:

- Los jest de otros worktrees no se esperan: cargan la CPU, pero no comparten tu base. Ahora
  mismo hay otro Codex en `/home/claude/sites/Pet-Tracker-wt-245` con su propia base.
- Un timeout aislado se repite tal cual, con la espera vacía, antes de tocar nada. Si se repite,
  PARA.
- Si Postgres no está arriba (`ECONNREFUSED` contra `5433`) o LocalStack no responde, PARA y
  anótalo.
- El aviso final de jest sobre un worker que no salió (`force exited`) es preexistente: no
  pares por él si el `exit=` es `0`.

## Reglas críticas

- Si una cifra, ancla o salida no coincide con la que dan tasks.md o este handoff, PARA y anota
  la diferencia. No ajustes la cifra.
- Un `ENOENT` o un `Cannot find module` justo después de crear algo suele ser un error de
  invocación (una ruta mal escrita, un `cd` que falta). Revisa el comando antes de tocar código.
- Literales a mano: los nombres de los `it`, los mensajes de error, el body del `403`
  (`{ statusCode: 403, message: 'Invalid password', error: 'Forbidden' }`) y las líneas de log
  van escritos en el test como los da tasks.md.
- Prefijo `#247 R<n>:` en todo `describe`/`it` nuevo; los `it` existentes de E1–E8 conservan su
  título, salvo el retítulo de E7.
- Sin dependencias nuevas: `@aws-sdk/client-s3` y `@aws-sdk/client-dynamodb` ya están en
  `package.json`.
- **Árbol limpio, acotado.** Al terminar,
  `git status --short -- backend-pet-tracker specs docs` tiene que salir vacío.
- **No borres los logs de `/tmp`.** El sandbox deniega `rm -f`; los borra el leader.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

Va en `progress/impl_users-account-deletion-api.md`, dentro del commit 13. Lleva lo que pide
tasks.md §Cierre y además:

- la salida del primer comando y las anclas de partida;
- cada commit con su hash, la línea `Tests:` y el `exit=`. En cada rojo, el `it` que cae y su
  línea decisiva;
- las filas del journal antes y después de `db:migrate`;
- la suite unitaria completa y el e2e de la feature;
- `git rev-list --count <H0>..HEAD`;
- cualquier PARA.

Las mutaciones de tasks.md §Mutaciones para el reviewer son del `reviewer`: no las corras.

Última acción: crear `progress/impl_users-account-deletion-api.done` con una sola línea, la
ruta del reporte. Es el marcador que vigila el leader; no lo commitees. Devuelve solo esa ruta.
