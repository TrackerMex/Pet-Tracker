Worktree: /home/claude/sites/Pet-Tracker-wt-245

NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

# Handoff #245 backend-container-image

Implementador: Codex CLI.

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-245 && pwd && git branch --show-current && git log --oneline -3`.
Confirma en el reporte la ruta y la branch `feature/245-backend-container-image`. Los commits,
de arriba abajo:

1. este handoff (`docs(handoff): backend-container-image (#245) handoff to Codex`);
2. la firma `2650406e`;
3. la enmienda `790666ac`.

## Base

- Feature: backend-container-image (#245). Integra en `dev`, no en `main`.
- H0, la base del diff final, es el commit de este handoff: el primero de `git log`.
- Precondiciones de tasks.md §Dónde y con qué, ya hechas por el leader:
  - `backend-pet-tracker/node_modules` instalado con `pnpm install --frozen-lockfile`;
  - el `.env` de la raíz del worktree, que apunta a la base propia `pet_tracker_wt245`
    (Postgres en 5433);
  - esa base, migrada: 24 filas en `drizzle.__drizzle_migrations`, igual que las 24 entradas de
    `src/db/migrations/meta/_journal.json`.

  **No corras `pnpm install` ni migres.**
- No abras, no leas y no imprimas el `.env`: lo cargan los e2e con `dotenv`.
- NO hagas `git fetch`, `git merge`, `git rebase`, `git commit --amend` ni `git push`.

## Anclas de partida

Las midió el leader en `2650406e`. El commit del handoff no toca código, así que siguen
valiendo. Se miden desde `backend-pet-tracker/`:

| Orden | Da |
|---|---|
| `grep -rn "new [A-Za-z]*SchedulerService(" src test \| wc -l` | `5` |
| `grep -cF dotenv scripts/provision-device.ts` | `1` |
| `grep -cF dotenv scripts/set-device-subscription.ts` | `1` |
| `grep -cF 'connectionString: process.env.DATABASE_URL' scripts/provision-device.ts` | `1` |
| `grep -cF 'connectionString: process.env.DATABASE_URL' scripts/set-device-subscription.ts` | `1` |
| `grep -cF onModuleDestroy src/db/drizzle.module.ts` | `1` |
| `node -p "require('./package.json').scripts['start:prod']"` | `node dist/main` |
| `node -p "JSON.stringify(require('./tsconfig.build.json').exclude)"` | `["node_modules","test","dist","**/*spec.ts"]` |
| `test ! -e Dockerfile && test ! -e .dockerignore && test ! -e certs; echo "$?"` | `0` |
| `test ! -e src/db/pool-config.ts && test ! -e src/db/migrate.ts && test ! -e src/lifecycle && test ! -e src/app-setup.ts; echo "$?"` | `0` |
| `test -e test/provision-device.e2e-spec.ts; echo "$?"` | `0` |

Mídelas otra vez antes del primer commit y anótalas. Si una no da la suya, PARA.

## Spec

- Aprobada con la firma delegada del leader (`2650406e`). Lee enteros
  `specs/backend-container-image/requirements.md`, `design.md`, `tasks.md` y `traceability.md`.
- tasks.md manda en el orden, los mensajes de commit literales, los stubs de cada rojo, los
  «Esperado» de cada paso y las mutaciones. design.md manda en las firmas, los nombres de símbolo
  y la lista de ficheros (§Archivos afectados).
- Sin decisiones abiertas. Si encuentras una contradicción, PARA y anótala en el reporte; no
  adaptes la spec por tu cuenta.
- El `status` del frontmatter y la casilla de aprobación no son tuyos.

## Orden y commits

Test primero, con historial rojo y después verde (C4 de CHECKPOINTS.md). **Nada de un commit
único con todo**, ni de juntar el rojo y el verde de un requisito.

- R1 a R23 en el orden de tasks.md. Cada requisito lleva su commit `test(...)` rojo y su commit
  `feat(...)` verde, salvo R15 y R23 (vía (b): un solo commit `test(...)` y la mutación sin
  commit).
- Al final, el commit `docs(backend-container-image): fill traceability`.
- Son **45 commits** sobre H0, con los mensajes literales de tasks.md. Al terminar,
  `git rev-list --count <H0>..HEAD` da `45`.
- Un rojo cae **solo por aserción**: tras cada rojo,
  `grep -cE "ReferenceError|Cannot find module|error TS|TypeError" /tmp/impl-245-<R>-red.log`
  da `0`. Anota en el reporte el `it` que cae y la línea decisiva.
- `tsc` y `eslint` salen 0 en **todos** los commits, rojos incluidos.

Por cada commit, en este orden y desde `backend-pet-tracker/`:

1. `pnpm exec prettier --write <ficheros .ts tocados>`;
2. `pnpm exec prettier --check <ficheros .ts tocados> && pnpm exec eslint <ficheros .ts tocados> && pnpm exec tsc --noEmit -p tsconfig.json; echo "exit=$?"`, que da `exit=0`;
3. el jest del paso;
4. `git add` con rutas explícitas (nunca `git add -A` ni `git add .`) y `git commit`.

Tras cada commit, `git status --short -- . ../docs ../.env.example` no lista ningún fichero de
esta feature.

### Puntos de la cadena que piden atención

- **R7**: la orden de `grep` de las anclas da `5` antes del rojo; los `describe` nuevos de R7
  añaden las suyas. Anota la cifra tras el rojo.
- **R15**: el e2e corre `runMigrations` contra `pet_tracker_wt245`, que ya está migrada: no
  debe aplicar nada. Si añade filas al journal, PARA.
- **R17**: el `curl` del verde es la **única** descarga de red de toda la cadena. Si sale
  `curl exit=` distinto de `0`, o si el `it` del bundle queda en rojo por falta de `us-east-2` o
  `mx-central-1`, PARA como dice tasks.md. No escribas el PEM a mano ni lo sustituyas.
- **R21**: tras el verde, corre también el e2e de `test/provision-device.e2e-spec.ts`
  (orden en tasks.md R21 (2)).
- **R22**: los dos `it` lanzan los scripts con `ts-node` y un `WIALON_BASE_URL` a `127.0.0.1:1`;
  ninguna llamada sale de la máquina.
- **Docker**: no corras `docker build` ni `docker run`. El gate de imagen lo corre el leader
  después (tasks.md §Gate del leader). Tus tests de R16 a R19 leen el `Dockerfile` y el
  `.dockerignore` como texto.

## Archivos

Lista cerrada: la de design.md §Archivos afectados, rutas relativas a `backend-pet-tracker/`
salvo las de docs. Además:

- `specs/backend-container-image/traceability.md`;
- `progress/impl_backend-container-image.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar:

- las migraciones (`src/db/migrations/`), `pnpm-lock.yaml`, `drizzle.config.ts`,
  `test/jest-e2e.json`, `tsconfig.json` ni `tsconfig.build.json` (R23 solo los lee; la mutación
  se revierte);
- `.env`, `mobile-pet-tracker/`, `infra/`, `init.sh` ni `feature_list.json`;
- el resto de `docs/`, de `specs/` y de `progress/`, incluido este handoff.

## Comandos

Todos desde `backend-pet-tracker/`, después de este `cd` literal:
`cd /home/claude/sites/Pet-Tracker-wt-245/backend-pet-tracker && pwd`.

- unitario de un fichero: `FORCE_COLOR=0 pnpm exec jest --config package.json <ruta-del-spec> > /tmp/impl-245-<R>-<red|green>.log 2>&1; echo "exit=$?"`.
- e2e de un fichero: `FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json <ruta-del-e2e> > /tmp/impl-245-<R>-e2e.log 2>&1; echo "exit=$?"`.
- suite unitaria completa (§Cierre 1): `FORCE_COLOR=0 pnpm exec jest --config package.json --testTimeout=30000 > /tmp/impl-245-unit-all.log 2>&1; echo "exit=$?"`.
  El `--testTimeout=30000` lo añade este handoff a la orden de tasks.md: la máquina va cargada
  con jest de otros worktrees y el flag solo absorbe esa carga. Los specs de un fichero no lo
  llevan.
- e2e de la feature (§Cierre 2): la orden literal de tasks.md.
- Tras cada log: `grep -E '^(Test Suites|Tests):' <log>`.

Mide los códigos de salida sin pipe. De cada log pega en el reporte el `exit=`, la línea
`Test Suites:` y la línea `Tests:`.

Prohibido:

- `pnpm run <script> -- …`, porque el `--` llega a jest;
- `pnpm run lint`, porque lleva `--fix` sobre todo el árbol;
- `pnpm install`, `pnpm db:migrate`, `drizzle-kit`, `psql` y `docker` en cualquier forma;
- `cdk`, la CLI de `aws` y cualquier otra llamada de red salvo el `curl` de R17;
- matar procesos ajenos o borrar bases ajenas.

## Esperas

Antes de **cada** corrida de jest, unitaria o e2e, corre estos dos comandos por separado.

1. Que no haya un `DATABASE_URL` exportado que pise al `.env`:
   `test -z "${DATABASE_URL:-}"; echo "$?"`. Tiene que dar `0`; si da `1`, PARA.
2. Que no corra ningún `init.sh`, porque comparte Postgres y LocalStack con los e2e:
   `for i in $(seq 1 90); do pgrep -f '[i]nit\.sh' > /dev/null || break; sleep 60; done; pgrep -f '[i]nit\.sh'; echo "espera=$?"`.
   - Tiene que dar `espera=1`.
   - Si da `espera=0` tras los 90 minutos, anótalo y vuelve a correr la misma orden.
   - Nunca mates esos procesos.

Otras reglas de espera:

- Los jest de otros worktrees no se esperan: cargan la CPU, pero no comparten tu base.
- Un timeout aislado se repite tal cual, con la espera vacía, antes de tocar nada. Si se repite,
  PARA.
- Si Postgres no está arriba (`ECONNREFUSED` contra `5433`), PARA y anótalo. Ojo: el
  `ECONNREFUSED` contra `127.0.0.1:1` del rojo de R22 es el esperado.
- El aviso final de jest sobre un worker que no salió (`force exited`) es preexistente: no
  pares por él si el `exit=` es `0`.

## Reglas críticas

- Si una cifra, ancla o salida no coincide con la que dan tasks.md o este handoff, PARA y anota
  la diferencia. No ajustes la cifra.
- Un `ENOENT` o un `Cannot find module` justo después de crear algo suele ser un error de
  invocación (una ruta mal escrita, un `cd` que falta). Revisa el comando antes de tocar código.
- Literales a mano: los nombres de los `it`, los mensajes de error y las líneas del `Dockerfile`
  van escritos en el test como los da tasks.md.
- Sin dependencias nuevas: todo lo necesario ya está en `package.json`.
- **Árbol limpio, acotado.** Al terminar,
  `git status --short -- backend-pet-tracker specs docs .env.example` tiene que salir vacío.
- **No borres los logs de `/tmp`.** El sandbox deniega `rm -f`; los borra el leader.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

Va en `progress/impl_backend-container-image.md`, dentro del commit de cierre. Lleva lo que pide
tasks.md §Cierre 5 y además:

- la salida del primer comando y las anclas de partida;
- cada commit con su hash, la línea `Tests:` y el `exit=`. En cada rojo, el `it` que cae y su
  línea decisiva;
- las ocho mutaciones con su orden, el `it` en rojo y la restauración;
- la suite unitaria completa y el e2e de la feature;
- `git rev-list --count <H0>..HEAD`;
- cualquier PARA.

Última acción: crear `progress/impl_backend-container-image.done` con una sola línea, la ruta
del reporte. Es el marcador que vigila el leader; no lo commitees. Devuelve solo esa ruta.
