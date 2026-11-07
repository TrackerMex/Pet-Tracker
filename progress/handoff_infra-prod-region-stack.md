Worktree: /home/claude/sites/Pet-Tracker-wt-246

NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

# Handoff #246 infra-prod-region-stack

Implementador: Codex CLI.

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-246 && pwd && git branch --show-current && git log --oneline -3`.
Confirma en el reporte la ruta y la branch `feature/246-infra-prod-region-stack`. Los commits,
de arriba abajo:

1. este handoff (`docs(handoff): infra-prod-region-stack (#246) handoff to Codex`);
2. la firma `c281df0e`;
3. la spec `3cc9c49c`.

## Base

- Feature: infra-prod-region-stack (#246). Integra en `dev`, no en `main`.
- H0, la base del diff final y el «HEAD del handoff» que nombra tasks.md, es el commit de este
  handoff: el primero de `git log`.
- Precondición, ya hecha por el leader: `infra/node_modules` instalado con
  `pnpm install --frozen-lockfile`. **No corras `pnpm install`.**
- Esta feature no usa Postgres, LocalStack ni `.env`. No abras, no leas y no imprimas ningún
  `.env`.
- NO hagas `git fetch`, `git merge`, `git rebase`, `git commit --amend` ni `git push`.

## Anclas de partida

Las midió el leader en `c281df0e`; el commit del handoff no toca código. Mídelas otra vez
desde `infra/`, antes del primer commit, y anótalas:

| Orden | Da |
|---|---|
| `FORCE_COLOR=0 pnpm exec jest > /tmp/impl-246-base.log 2>&1; echo "exit=$?"` | `exit=0` |
| líneas `Test Suites:` y `Tests:` de ese log | `Test Suites: 2 passed, 2 total` y `Tests:       14 passed, 14 total` |
| `pnpm exec tsc --noEmit -p tsconfig.json; echo "tsc=$?"` | `tsc=0` |
| `pnpm run lint > /tmp/impl-246-lint-base.log 2>&1; echo "lint=$?"` | `lint=0` |
| `ls lib` | `pet-tracker-dev-stack.ts` |
| `ls test` | `no-duplicated-literals.test.ts` y `pet-tracker-dev-stack.test.ts` |
| `test -e test/fixtures; echo "$?"` | `1` |
| `grep -cF 'Junto con `.env.example` es el único sitio del repo con el literal del modelo' ../docs/conventions.md` | `1` |

Si una no da la suya, PARA.

## Spec

- Aprobada con la firma delegada del leader (`c281df0e`). Lee enteros
  `specs/infra-prod-region-stack/requirements.md`, `design.md`, `tasks.md` y
  `traceability.md`.
- tasks.md manda en el orden, los mensajes de commit, los helpers, los stubs de cada rojo, las
  cuentas de tests y el §Cierre. design.md manda en las firmas, los ids de construct, las props
  de prueba y la lista de ficheros (§Archivos afectados).
- Sin decisiones abiertas. El parámetro de rol `primary`/`standby` **no** es de esta feature:
  pasó a #249. Si encuentras una contradicción, PARA y anótala en el reporte; no adaptes la
  spec por tu cuenta.
- El `status` del frontmatter y la casilla de aprobación no son tuyos.

## Orden y commits

Test primero, con historial rojo y después verde (C4 de CHECKPOINTS.md). **Nada de un commit
único con todo**, ni de juntar el rojo y el verde de un requisito.

- Los 40 commits de requisitos (R1 a R20, un rojo `test(...)` y un verde `feat(...)` por
  requisito, en ese orden) y los 2 commits `docs(...)` de §Cierre. Sin commits de refactor. Al
  terminar, `git rev-list --count <H0>..HEAD` da `42`.
- Un rojo cae **solo por aserción** y solo en los `it` de su requisito: aplica las tres
  comprobaciones de tasks.md §Rojo por aserción, nunca por ausencia, tras cada rojo. Anota en
  el reporte los `●` que caen y su línea decisiva.
- Cada verde deja la suite entera en verde con el total de tasks.md §Cuentas de tests.
- `tsc` y `eslint` salen 0 en **todos** los commits, rojos incluidos.

Por cada commit, en este orden y desde `infra/`:

1. `pnpm exec tsc --noEmit -p tsconfig.json && pnpm exec eslint <ficheros .ts tocados>; echo "exit=$?"`,
   que da `exit=0`. `infra/` no tiene prettier: no lo corras.
2. la suite de infra completa de tasks.md §Comandos, con el log en
   `/tmp/impl-246-<R>-<red|green>.log`;
3. `git add` con rutas explícitas (nunca `git add -A` ni `git add .`) y `git commit`.

Tras cada commit, `git status --short -- . ../docs ../specs ../progress` no lista ningún fichero
de esta feature.

### Puntos de la cadena que piden atención

- **R1**: `bin/app.ts` pasa a `buildApp(new App())`. El stack dev y su test no cambian (Cierre
  4 lo comprueba con `git diff --exit-code <H0>`).
- **R3, rojo**: entra `test/fixtures/backend-image/Dockerfile` con `FROM scratch`. Ningún
  comando construye esa imagen: los tests solo leen el manifiesto de assets.
- **R9**: `dockerImageSources` lee los `AssetManifestArtifact` del ensamblado; no corras
  `docker` para comprobarlo.
- **R10, R14 y R16**: el helper `secretsReadBy` etiqueta con su `JSON.stringify` toda
  `Resource` que no sea un secreto conocido de una sentencia con `secretsmanager:GetSecretValue`.
  No la descartes: es lo que hace caer un comodín (mutación 15).
- **Literales**: los tests usan los literales de requirements.md; `bin/` y `lib/` importan de
  `@backend/aws/constants` los valores de tasks.md §Reglas de los tests, porque
  `no-duplicated-literals.test.ts` los veta entre comillas.
- **Avisos esperados**: los `W3010` y las dos líneas de deprecación por cada `TableV2` de tasks.md
  §Comandos no son errores. No los «arregles».
- **Cierre 5**: las 15 mutaciones son tuyas en esta feature (no las del reviewer). Revierte
  cada una con `git checkout HEAD -- <fichero>` antes de la siguiente.

## Archivos

Lista cerrada: la de design.md §Archivos afectados. Además:

- `specs/infra-prod-region-stack/traceability.md` (Cierre 7);
- `docs/conventions.md`, solo la frase de la fila `ANTHROPIC_MODEL` (Cierre 6);
- `progress/impl_infra-prod-region-stack.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar:

- `infra/lib/pet-tracker-dev-stack.ts`, `infra/test/pet-tracker-dev-stack.test.ts`,
  `infra/test/no-duplicated-literals.test.ts`, `infra/cdk.json`, `infra/package.json`,
  `infra/pnpm-lock.yaml`, `infra/tsconfig.json`, `infra/jest.config.js`,
  `infra/eslint.config.mjs`;
- `backend-pet-tracker/`, `mobile-pet-tracker/`, `init.sh` ni `feature_list.json`;
- el resto de `docs/`, de `specs/` y de `progress/`, incluido este handoff.

## Comandos

Todos desde `infra/`, después de este `cd` literal:
`cd /home/claude/sites/Pet-Tracker-wt-246/infra && pwd`.

- La suite, los tipos y el lint: los de tasks.md §Comandos.
- Tras cada log: `grep -E '^(Test Suites|Tests):' <log>`.
- El synth de Cierre 3, tal cual lo da tasks.md, con `CDK_DISABLE_CLI_TELEMETRY=true` y sin
  credenciales.

Mide los códigos de salida sin pipe. De cada log pega en el reporte el `exit=`, la línea
`Test Suites:` y la línea `Tests:`.

Prohibido:

- `pnpm run <script> -- …`, porque el `--` llega a jest;
- `pnpm install`, `docker` en cualquier forma, `psql`;
- `cdk deploy`, `cdk bootstrap`, `cdk diff`, `cdk destroy`, la CLI de `aws` y cualquier llamada
  de red. El único `cdk` permitido es el synth de Cierre 3;
- matar procesos ajenos.

## Esperas

- Esta feature no comparte base ni LocalStack: **no esperes a `init.sh`** ni a los jest de otros
  worktrees. Ahora mismo hay otro Codex en `/home/claude/sites/Pet-Tracker-wt-247` y puede haber
  un `init.sh` del leader en `/home/claude/sites/Pet-Tracker-wt-245`. Cargan la CPU, nada más.
- No esperes a ningún contador ni sondeo: cada orden de jest termina sola.
- Un timeout aislado se repite tal cual antes de tocar nada. Si se repite, PARA.
- El aviso final de jest sobre un worker que no salió (`force exited`) no es motivo para parar
  si el `exit=` es `0`.

## Reglas críticas

- Si una cifra, ancla o salida no coincide con la que dan tasks.md o este handoff, PARA y anota
  la diferencia. No ajustes la cifra.
- Un `ENOENT` o un `Cannot find module` justo después de crear algo suele ser un error de
  invocación (una ruta mal escrita, un `cd` que falta). Revisa el comando antes de tocar código.
- Prefijo `#246 R<n>:` en todo `describe`/`it` nuevo.
- Sin dependencias nuevas y sin secretos: los secretos se nombran
  (`pet-tracker/prod/<nombre>`), nunca llevan valor.
- Sin rayas largas (em dash) en nombres ni descripciones de recursos AWS: usa guiones.
- **Árbol limpio, acotado.** Al terminar,
  `git status --short -- infra docs specs` tiene que salir vacío. `infra/cdk.out` está
  ignorado; compruébalo con `git check-ignore -q cdk.out/; echo "$?"` (da `0`).
- **No borres los logs de `/tmp`.** Los borra el leader.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

Va en `progress/impl_infra-prod-region-stack.md`, dentro del último commit de §Cierre. Lleva lo
que pide tasks.md §Cierre 7 y además:

- la salida del primer comando y las anclas de partida;
- cada commit con su hash, la línea `Tests:` y el `exit=`. En cada rojo, los `●` que caen y su
  línea decisiva;
- los `exit=` de Cierre 1 a 4 y la evidencia de las 15 mutaciones;
- `git rev-list --count <H0>..HEAD`;
- cualquier PARA.

Última acción: crear `progress/impl_infra-prod-region-stack.done` con una sola línea, la ruta del
reporte. Es el marcador que vigila el leader; no lo commitees. Devuelve solo esa ruta.
