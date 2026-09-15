# review: harness-e2e-nunca-corre-en-ci

Fecha: 2026-09-15
Revisor: subagente `reviewer` (no editó ni una línea de código)
Rama: `feature/96-harness-e2e-nunca-corre-en-ci` — HEAD `33a1d80c`, árbol limpio
antes y después del gate.
Commit base de toda medición: `48e4130d`.

**Veredicto: APROBADO para R1-R9.**

**La feature NO puede pasar a `done`.** G1 y G2 son gates humanos y siguen
pendientes: el criterio de aceptación 2 exige un rojo real observado en una
corrida de CI, no una inspección del YAML. Ninguna IA los firma, y este veredicto
tampoco. La feature pasa a `done` solo cuando el humano aporte las dos URLs y la
línea de fallo del probe, y las anote en
`progress/impl_harness-e2e-nunca-corre-en-ci.md` y en `traceability.md`.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` — `feature_list.json:1855`, la #96; es la
      única ocurrencia de `"status": "in_progress"` en el fichero.
- [x] `progress/current.md` actualizado — sesión #96 abierta, apertura y cierre
      de la implementación, contención de infraestructura y G1/G2 declarados
      pendientes.
- [x] El reporte del implementador **no** da G1/G2 por cumplidos: los declara
      "pendiente" en su tabla y en su sección final.

## Checklist C3 — Arquitectura

Esta feature es harness y CI: **cero código de aplicación**, como declara la
spec. `git diff --name-status 48e4130d..HEAD` no toca ningún fichero bajo
`backend-pet-tracker/`, `infra/` ni `mobile-pet-tracker/`, así que las capas de
`docs/architecture.md` no entran en juego.

- [x] `domain` sin imports de `infrastructure` — N/A, no se tocó `src/`
- [x] contratos de `domain` como interfaces puras — N/A
- [x] `application` depende de interfaces — N/A
- [x] `infrastructure` sin lógica de negocio — N/A
- [x] C8 (UI móvil) — N/A, `mobile-pet-tracker/` intacto

## Checklist C4 — TDD

- [x] Cada R1-R9 tiene al menos un test que lo nombra: los nueve `describe` de
      `init-e2e-gate.test.mjs` empiezan por `R<n> (harness-e2e-nunca-corre-en-ci
      #96): …`. 9 suites, 15 tests.
- [x] **El historial rojo→verde es real, verificado ejecutándolo.** No me fié del
      reporte: extraje el árbol de los 18 commits (`git archive` a un directorio
      temporal, sin tocar el repo) y corrí `node --test init-e2e-gate.test.mjs`
      en cada uno. Los nueve rojos fallan **y solo falla la suite de su propio
      R-id**; los nueve verdes pasan sin romper nada de lo anterior:

| R | rojo | resultado en el rojo | verde | resultado en el verde |
|---|---|---|---|---|
| R1 | `ae21880a` | exit 1 — `not ok: R1 …` | `64a0ecc0` | exit 0 — 1 pass |
| R2 | `ba934c99` | exit 1 — `not ok: R2 …` | `a306d2e3` | exit 0 — 2 pass |
| R3 | `4a13f00a` | exit 1 — `not ok: R3 …` | `c33995e7` | exit 0 — 4 pass |
| R4 | `cc5f2936` | exit 1 — `not ok: R4 …` | `18188a7e` | exit 0 — 7 pass |
| R5 | `fd380f3c` | exit 1 — `not ok: R5 …` | `cb618641` | exit 0 — 8 pass |
| R6 | `9fa459fe` | exit 1 — `not ok: R6 …` | `437557a4` | exit 0 — 11 pass |
| R7 | `8d8eacfb` | exit 1 — `not ok: R7 …` | `b75e4602` | exit 0 — 15 pass |
| R8 | `1ea1fbd1` | exit 1 — `not ok: R8 …` | `719b539a` | exit 0 — 12 pass |
| R9 | `f6d82df7` | exit 1 — `not ok: R9 …` | `9c6a813e` | exit 0 — 13 pass |

      (el conteo acumulado no es monótono entre R7 y R8 porque `tasks.md` ordena
      R8, R9 antes de R7; el orden de commits coincide con ese plan)

- [x] Un commit por fase, nunca implementación y test juntos: los 18 commits
      alternan `test(ci-e2e): … (Rn)` y `feat(ci-e2e): … (Rn)`.

## Checklist C5 — Trazabilidad

- [x] Los **18 hashes** de `traceability.md` existen y son ancestros de HEAD
      (`git merge-base --is-ancestor` uno a uno: 18/18 OK). La rama no se
      rebaseó.
- [x] Ninguna fila "pendiente" salvo G1 y G2, que son gates humanos y así lo
      declara la propia tabla.
- [x] Formato de commits: `feat(ci-e2e): <desc> (R<n>)` / `test(ci-e2e): <desc>
      (R<n>)`, tal como fija la convención de la spec.

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` y la casilla humana marcada:
      `- [X] Aprobado por humano (fecha: 2026-09-14)`.
- [x] Firma real del humano: `0f47c176` *"Approve CI E2E harness
      specification"*, autor `AlexisSM377 <al222111377@gmail.com>`, que cambia
      exactamente esa casilla.
- [x] **Sin drift tras la firma.** `git diff 0f47c176..HEAD -- requirements.md`
      devuelve **una sola** hunk: `status: spec_ready` → `status: approved`,
      introducida por `80d3f9a4` (el leader, propagando el gate). `design.md` y
      `tasks.md`: mismo cambio de frontmatter y nada más. `traceability.md` solo
      recibe el relleno de la tabla, que es su función.

## Checklist C7 — Sin código huérfano

- [x] `E2E_REQUIRED_PORTS` eliminada del harness vivo: no queda ninguna
      referencia en `init.sh`, `init.config.sh` ni `.github/workflows/ci.yml`.
      Las apariciones que quedan en `STATUS.md`, `feature_list.json` y specs
      antiguas (`e2e-audit-log-order-assert`, `aws-cdk-dev-stack`,
      `mobile-app-scaffold`) son registro histórico fechado, no código.
- [x] La rama del `warn` silencioso desapareció por completo (`E2E_MISSING_PORT`
      ya no existe); el comentario de `ci.yml:36` (*"…anadir services aqui"*)
      también.
- [x] No se eliminó ningún test — no había tests de la conducta reemplazada.
- [x] `port_open` quedó con una única definición (`init.sh:31`) y una única
      llamada (`init.sh:254`), ya con dos argumentos.

## Ficheros tocados vs. lista declarada

`git diff --name-status 48e4130d..HEAD` da 13 ficheros y **ninguno sin
declarar**:

| Fichero | Declarado en |
|---|---|
| `.github/workflows/ci.yml`, `init.sh`, `init.config.sh`, `docs/verification.md` | `design.md` §Archivos y `feature_list.json` |
| `init-e2e-gate.test.mjs` (nuevo), `AGENTS.md` | `design.md` §Archivos, con justificación |
| `feature_list.json`, `progress/current.md`, `progress/impl_*.md`, `specs/…/*.md` | bookkeeping del flujo, declarado en el reporte |

- [x] **`.env.example` NO se tocó**, así que el candado `assert.equal(keys.length,
      24)` de `env-drift.test.mjs` sigue siendo cierto — comprobado: el fichero
      tiene 24 claves y ninguno de los dos ficheros aparece en el diff.

---

## Verificación de los 9 R-ids contra el código real

No me basté con el título del test: leí cada aserción y, donde la aserción
admitía duda, ejecuté el bash real del bloque de `init.sh` (rebanado entre los
marcadores `# >>> bloque e2e (#96) >>>`) con los helpers stubbeados.

- **R1 — cumple.** `ci.yml` trae `- name: Infra e2e (Postgres + LocalStack)` /
  `run: docker compose up -d --wait --wait-timeout 120` inmediatamente tras
  `actions/checkout@v4`, es decir **antes** del paso `bash ./init.sh`, y usa el
  `docker-compose.yml` versionado. El YAML no repite ninguna etiqueta de imagen
  ni ningún número de puerto. El test compara índices (`indexOf`) y prohíbe
  `localstack/localstack|postgres:17`; mover el paso detrás de `init.sh` lo pone
  en rojo (mutación comprobada).
- **R2 — cumple.** `env: AWS_MODE: local` a nivel de job, con el comentario que
  explica por qué no se toca. No hay `configure-aws-credentials` ni
  `secrets.AWS_*` en ningún sitio. Las tres `aws-real-*` se guardan con
  `(process.env.AWS_MODE ?? '').trim().toLowerCase() === 'aws'`
  (`aws-real-smoke`, `aws-real-media`, `aws-real-ingest`), así que con `local` no
  se pega a la cuenta real. **El verde medido es 26 de 29 — el correcto**; un
  29/29 habría sido la alarma y no aparece. Ver la observación 1 sobre la
  fortaleza del candado.
- **R3 — cumple, y lo ejecuté contra los dos árboles.** `init.config.sh` declara
  `E2E_PORT_SOURCES=("DATABASE_URL" "AWS_ENDPOINT_URL")` y ya no contiene
  `E2E_REQUIRED_PORTS` ni ningún literal de puerto. Corrí el bloque real con
  cuatro `.env` distintos y el stub de `port_open` imprimiendo su destino:

  | `.env` usado | destinos sondeados | exit |
  |---|---|---|
  | árbol principal (`…@localhost:5433/pet_tracker`) | `localhost:5433`, `localhost:4566` | 0 |
  | `/home/claude/sites/Pet-Tracker-wt-backend/.env` (`…/pet_tracker_wt`) | `localhost:5433`, `localhost:4566` | 0 |
  | `.env.example` tal cual (forma de CI) | `localhost:5432`, `localhost:4566` | 0 |
  | `postgresql://u:p@ss@localhost:5433/db` (`@` en la contraseña) | `localhost:5433`, `localhost:4566` | 0 |
  | `postgresql://pet_tracker@dbhost/pet_tracker` (sin puerto) | — | 1, con el `fail` de "no se pudo derivar" |

  La tabla de `design.md` §D6 queda cubierta caso por caso, incluido el ceiling
  declarado (URL sin puerto ⇒ aborta, no inventa un default).
- **R4 — cumple.** El bucle de la guarda va **antes** de `E2E_SETUP_CMD` y de
  `E2E_CMD`, y usa `|| fail "…"`; `fail` (`init.sh:26`) hace `exit 1` explícito,
  no depende de `set -e`. Medido con `execFileSync` y `err.status`, **sin
  tubería**: `status === 1` y la salida no contiene `SETUP`, `E2E` ni `FIN`, en
  los dos casos (puerto caído y clave ausente en `.env`). El bloque no contiene
  ninguna rama por `$CI` (D3 respetado).
- **R5 — cumple.** El mensaje real es `Infra e2e caída: localhost:5433 no
  responde (derivado de DATABASE_URL en .env). Levántala con: docker compose up
  -d` — nombra las tres cosas exigidas (host, puerto y clave de origen). El
  segundo mensaje, el de derivación imposible, también nombra la clave.
- **R6 — cumple, y se observó en vivo.** `E2E_SETUP_CMD="pnpm -C
  backend-pet-tracker run db:migrate && pnpm -C backend-pet-tracker run
  provision:local"`, sin `psql` en ninguna parte del fichero. En mi corrida de
  `./init.sh` el log muestra, en este orden: `→ Tests e2e...` → `drizzle-kit
  migrate` → `migrations applied successfully!` → `provision-local.ts` → `✅
  Esquema y recursos e2e listos` → la suite de Jest. La rama de fallo del setup
  también corta antes de `E2E_CMD` (test dedicado con `exit 7`; aborta por
  `set -e`, que basta para lo que R6 pide).
- **R7 — cumple.** `TEST_CMD` suma `node --test init-e2e-gate.test.mjs`
  conservando `env-drift.test.mjs` e `init-color.test.mjs`, y `AGENTS.md` trae su
  fila en la tabla de mapa, en orden alfabético junto a `env-drift.mjs`.
- **R8 — cumple.** `init.sh` ya no contiene `"pasa de largo sin verificar nada"`
  (ni el bloque `E2E_MISSING_PORT`); el comentario nuevo describe el
  comportamiento vigente y menciona `docker compose up -d`. El comentario
  *"Cuando existan tests e2e … anadir services aqui"* desapareció de `ci.yml`,
  sustituido por uno que remite a la spec.
- **R9 — cumple.** `docs/verification.md` trae `### Feature 96 —
  harness-e2e-nunca-corre-en-ci` con las tres cosas: (a) que `./init.sh` ya
  exige `docker compose up -d` y termina con error si la infra no responde, (b)
  los seis pasos de G1 y los seis de G2, incluida la distinción del flake móvil,
  y (c) que las tres `aws-real-*` se saltan por diseño, que el verde correcto es
  "todas menos esas tres" y la igualdad dinámica en vez de un número congelado.

### Prueba de mutación (zona ciega)

Sobre una copia del árbol en el scratchpad, nunca sobre el repo. 15 mutaciones;
11 detectadas por el candado, 4 no:

| Mutación | ¿La caza el candado? |
|---|---|
| paso de infra movido detrás de `init.sh` | sí (R1) |
| `AWS_MODE: aws` sustituyendo a `local` | sí (R2) |
| `AWS_MODE: "aws"` sustituyendo a `local` | sí (R2, por la aserción positiva) |
| `fail` → `warn` en la guarda | sí (R4 y R5) |
| setup movido detrás de `E2E_CMD` | sí (R6) |
| `E2E_SETUP_CMD` con `psql` crudo | sí (R6) |
| vuelve `E2E_REQUIRED_PORTS=(5432 4566)` | sí (R3) |
| suite fuera de `TEST_CMD` | sí (R7) |
| fila borrada de `AGENTS.md` | sí (R7) |
| comentario del agujero de vuelta | sí (R8) |
| `### Feature 96 …` roto | sí (R9) |
| `run: AWS_MODE=aws bash ./init.sh` | **no** (observación 1) |
| segundo `AWS_MODE: "aws"` conservando el `local` | **no** (observación 1) |
| `--wait-timeout 120` → `5` | **no** (observación 2) |
| número de puerto en un comentario del YAML | **no** (observación 2) |

---

## Observaciones (ninguna bloqueante)

1. **El candado de R2 tiene dos formas ciegas, y una es la cara de dinero.** La
   aserción `doesNotMatch(workflow, /AWS_MODE:\s*aws\b/)` cubre la forma YAML sin
   comillas; **no** cubre `run: AWS_MODE=aws bash ./init.sh` (forma de shell,
   YAML perfectamente válido) ni un segundo `AWS_MODE: "aws"` añadido dejando el
   `local` en su sitio. Verificado con las dos mutaciones: la suite sigue verde.
   **No es motivo de rechazo**: el implementador escribió exactamente las cuatro
   aserciones que `design.md` §D7 fija, y esa spec la firmó el humano; el
   workflow de hoy cumple R2 y el gasto está además cortado aguas abajo por
   `AWS_MODE === 'aws'` en las tres `aws-real-*`. Pero el hueco existe y conviene
   cerrarlo en una enmienda de una línea, p. ej.
   `assert.doesNotMatch(workflow, /AWS_MODE\s*[:=]\s*["']?aws\b/i)` más una
   comprobación de que `AWS_MODE` aparece una sola vez en el fichero.
2. **R1 no congela `--wait-timeout 120` ni prohíbe puertos en el YAML.** El
   fichero real cumple las dos cosas; el test solo busca
   `docker compose up -d --wait` y prohíbe las etiquetas de imagen. Coincide con
   lo que pedía `design.md` §D7, así que tampoco es rechazo; queda anotado por si
   alguien baja el timeout sin darse cuenta.
3. **R6 aborta por `set -e`, no por un `exit` explícito.** R4 sí exigía el `exit`
   explícito y lo tiene (`fail`); R6 solo exige "abortar sin ejecutar `E2E_CMD`"
   y `set -e` (`init.sh:4`) lo consigue, con el `eval` en el cuerpo de un `if`,
   fuera de toda posición de condición. Comprobado con un setup que sale 7.
4. **Cosmético**: la implementación del bloque omitió los comentarios internos de
   `env_value` y `url_host_port` que `design.md` §D6 traía en su bash de
   ejemplo (el del CRLF y el del `##` greedy). El código es idéntico en
   comportamiento; solo se pierde la explicación del porqué.

---

## Contención de infraestructura

Antes de arrancar comprobé con `pgrep -af 'init\.sh|test:e2e|jest-e2e'` que no
había otro gate en marcha: ninguno. Los puertos 5433 (Postgres) y 4566
(LocalStack), compartidos con `/home/claude/sites/Pet-Tracker-wt-backend`,
estaban reservados para esta revisión. Ningún rojo raro de infra durante la
corrida.

## Output de `./init.sh`

Ejecutado por mí, en la raíz del repo, **sin tubería** (`./init.sh > log 2>&1;
echo $? > exit`), no con `| tail`, que habría devuelto el código de `tail`.

```
→ Verificando entorno...
→ Verificando variables de entorno...
→ Instalando dependencias...
→ Verificando coherencia del harness...
→ Build...
→ Ejecutando tests...
Test Suites: 166 passed, 166 total          (backend)
Tests:       1279 passed, 1279 total
Test Suites: 2 passed, 2 total              (infra)
Tests:       14 passed, 14 total
Test Suites: 73 passed, 73 total            (mobile)
Tests:       1275 passed, 1275 total
→ Tests e2e...
  > db:migrate → drizzle-kit migrate → [✓] migrations applied successfully!
  > provision:local → scripts/provision-local.ts
✅ Esquema y recursos e2e listos
Test Suites: 3 skipped, 26 passed, 26 of 29 total
Tests:       8 skipped, 367 passed, 375 total
→ Lint...
✅ Lint sin errores
→ Typecheck...
✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

EXIT CODE = 0   (leído de $?, sin tubería de por medio)
```

Suite dirigida, también medida sin tubería:

```
$ node --test init-e2e-gate.test.mjs
# tests 15
# suites 9
# pass 15
# fail 0
EXIT CODE = 0
```

**Delta contra `48e4130d`**: ninguna suite pasa de verde a roja; no se modificó
ni se borró ningún `*.spec.ts`, `*.e2e-spec.ts` ni `*.test.tsx` (el diff no toca
un solo fichero de test de la aplicación), así que ningún `it(` existente
desapareció ni cambió de nombre. Los e2e siguen en 26 de 29 con 367 tests, el
mismo número que la evidencia fechada de la spec sobre el commit base; la
igualdad del criterio 1 se cumple hoy en el árbol: 29 ficheros
`test/*.e2e-spec.ts` − 3 `test/aws-real-*.e2e-spec.ts` = 26 ejecutadas, distinto
de cero. **Eso es medición local, no cierra G1**, que exige verlo en una corrida
de CI.

---

## Qué falta para `done`

1. **G1** — corrida verde del job `verify` en el PR, con la sección
   `→ Tests e2e...` y la línea `Test Suites: …` visibles en el log, el recuento
   recontado sobre el commit del PR y la URL anotada.
2. **G2** — rojo deliberado desde `test/96-ci-red-probe` (`.expect(401)` →
   `.expect(418)` en `app.e2e-spec.ts`), con las tres comprobaciones: check en
   rojo, paso `Harness verification (init.sh)` fallando **dentro** de
   `→ Tests e2e...`, y la línea del fallo nombrando `app.e2e-spec.ts` y
   `expected 418` — no `add-pet` ni `alerts`, que serían el flake de móvil y no
   demostrarían nada. PR cerrado sin mergear y rama borrada.
3. Con las dos evidencias en `progress/impl_harness-e2e-nunca-corre-en-ci.md` y
   las filas G1/G2 de `traceability.md` ya sin "pendiente", el leader puede
   marcar la #96 `done`. Antes no.

---

# Enmienda E1

Fecha: 2026-09-15 16:03 UTC
Commit revisado: `73a1d6b0`
Alcance: **solo el delta `33a1d80c..HEAD`**. El veredicto de R1-R9 sobre
`33a1d80c` sigue en pie tal cual está escrito arriba; esta sección no lo
reabre.
Veredicto: **APROBADO**

## Qué entró en el delta

```
73a1d6b0 Merge (Claude)
470e42a9 docs(ci-e2e): record AWS_MODE amendment evidence (R2)   — reporte + trazabilidad
1d93e860 Merge (AlexisSM377)
1701b489 Record E2E CI gate evidence URLs                        — humano, URLs G1/G2
abc0ac32 test(ci-e2e): cover all AWS_MODE forms (R2)             — ÚNICO cambio de código
ea5e62bb spec(...): E1 firmada en dbeb6b92                       — estado de E1 a aprobada
dbeb6b92 Approve E2E CI harness design                           — firma humana de E1
967e3c66 spec(...): enmienda E1, candado de AWS_MODE
946d2727 docs(ci-e2e): ruido esperado vs fallo de la guarda en G1
941f5842 chore(harness): veredicto del reviewer para #96
```

`git diff --stat 33a1d80c..HEAD` toca 6 ficheros: `init-e2e-gate.test.mjs`
(+6/−3), `docs/verification.md`, los dos de `specs/`, y los dos de `progress/`.
Ningún fichero de `backend-pet-tracker/` ni de `mobile-pet-tracker/`.

## 1. Las mutaciones ponen la suite en rojo (medido, no aceptado del reporte)

Copias desechables del árbol en el scratchpad (`init-e2e-gate.test.mjs`,
`init.sh`, `init.config.sh`, `AGENTS.md`, `.github/workflows/ci.yml`,
`docs/verification.md`), una por mutación, `node --test
init-e2e-gate.test.mjs` sin tubería. **Ni el repo ni ningún fichero versionado
se tocaron.**

| # | Mutación sobre `ci.yml` | Exit | Resultado | Aserción que la caza |
|---|---|---|---|---|
| control | ninguna (árbol real copiado) | **0** | 15/15, 9 suites | — |
| M1 | `run: AWS_MODE=aws bash ./init.sh` | **1** | 14/15, falla R2 | `doesNotMatch(/^\s*(?:-\s*)?run\s*:[^\n]*\bAWS_MODE\s*=/m)` |
| M2 | segundo `AWS_MODE: "aws"`, conservando el `AWS_MODE: local` | **1** | 14/15, falla R2 | `equal(awsModeLines.length, 1)` → `2 !== 1` |
| **M3** (mía) | **segundo `AWS_MODE: "local"`** | **1** | 14/15, falla R2 | `equal(awsModeLines.length, 1)` → `2 !== 1` |
| M4 (mía) | única ocurrencia, valor `"aws"` entrecomillado | **1** | 14/15, falla R2 | `match(/^\s*AWS_MODE\s*:\s*(["']?)local\1\s*$/)` |

M1 y M2 son las dos que E1 prescribe: rojas, como reporta Codex. El reporte del
implementer es exacto en exit codes y en recuentos.

**M3 es la prueba que pedía el gate.** E1 avisa de que una regex de valor tipo
`/AWS_MODE\s*[:=]\s*["']?aws\b/i` no detectaría un segundo `AWS_MODE: "local"`.
La implementación no usa esa regex: cuenta con
`workflow.match(/^\s*AWS_MODE\s*:[^\n]*$/gm)` y **después** comprueba el valor
de la única línea encontrada. M3 muere en el recuento (`2 !== 1`), no en el
valor. **La condición 1 está implementada por recuento, como E1 exige.** M4
confirma que el segundo tramo (el valor) tampoco es decorativo.

En las cuatro mutaciones falla exactamente un test, siempre el de R2
(`not ok 1 - declara una sola vez AWS_MODE local y nunca lo reasigna desde
run`); las otras 8 suites quedan verdes, así que las mutaciones no contaminan
el resto del candado.

## 2. El alcance fue el declarado

- `git diff 33a1d80c..HEAD -- .github/workflows/ci.yml` → **vacío**. El
  workflow no cambió; la afirmación de Codex de que ya cumplía las dos
  condiciones es cierta (`grep -n AWS_MODE ci.yml`: línea 14 comentario, línea
  17 `AWS_MODE: local`, y ningún `run:` con `AWS_MODE=`). Por eso no hay commit
  `feat` para E1: no había nada que arreglar aguas abajo del candado.
- `git diff 33a1d80c..HEAD -- init-e2e-gate.test.mjs` cabe en una pantalla y
  **solo sustituye el cuerpo del `it` de la suite R2**. Las otras 8 suites
  (R1, R3-R9) llegan byte a byte iguales a como las aprobé en `33a1d80c`. Las
  dos aserciones viejas de R2 se eliminaron, no quedaron colgando junto a las
  nuevas (C7 a escala de aserción).

## 3. Sin regresión

`node --test init-e2e-gate.test.mjs` en el árbol real, sin tubería:

```
EXIT CODE = 0
# tests 15
# suites 9
# pass 15
# fail 0
```

Las 9 suites en verde, los mismos 15 tests que antes de la enmienda (el `it` de
R2 se reescribió, no se duplicó ni se partió).

**No ejecuté `./init.sh`**: el delta es un fichero de test que no levanta nada,
y el 4566 y el 5433 los comparte otro worktree. La única evidencia de `init.sh`
completo sobre este árbol es la que reporta Codex (exit 0, 26/29 suites e2e,
367/375 tests, 3 suites `aws-real-*` omitidas), que **no verifiqué**.

## 4. Trazabilidad

- `traceability.md` gana la sección "Enmienda E1" con dos filas, R2/E1-a y
  R2/E1-b, ambas citando `abc0ac32`. Ninguna dice "pendiente".
- Los **20 hashes** citados en `traceability.md` existen y son ancestros de
  `HEAD` (`git merge-base --is-ancestor` en verde para todos). **La rama no se
  rebaseó**: los hashes de R1-R9 son los mismos que en mi revisión anterior.
- `abc0ac32` sigue la convención (`test(ci-e2e): <desc> (R2)`) y nombra su
  R-id. El test dentro sigue nombrando `R2 (harness-e2e-nunca-corre-en-ci #96)`
  en el `describe` (C4).

**Sobre C4 y el ciclo rojo→verde**: `abc0ac32` es un commit `test` que nace
verde sobre el árbol real, y no le sigue ningún `feat`. No es un incumplimiento
de C4 aquí: E1 no pide cambiar producción — el `ci.yml` ya cumplía — sino
endurecer el candado, y la propia enmienda prescribe la mutación sobre copias
como método de verificación del rojo. El rojo existe y lo reproduje yo en las
cuatro copias de arriba.

## 5. Drift en la spec

`git diff dbeb6b92..HEAD -- specs/` trae dos cosas, ambas legítimas:

1. `design.md`: el cambio de estado de E1 a "aprobada por humano en
   `dbeb6b92`", hecho por el leader en `ea5e62bb`. Es lo esperado.
2. `traceability.md`: las dos filas de E1, añadidas por Codex en `470e42a9`.
   **No estaba en la lista de cambios previstos por el leader**, pero es
   exactamente lo que C5 exige de un implementer: dejar la trazabilidad de lo
   que implementó. No toca ninguna fila anterior ni el texto normativo. No lo
   cuento como drift.

Ni una línea de `requirements.md` cambió. R2 sigue redactado como se aprobó, que
es el punto de E1: lo corto era el candado, no el requisito. El bloque
"Aprobación de E1" tiene la casilla `[X]` y la firma cae en `dbeb6b92`, commit
del humano (`AlexisSM377`), anterior a `abc0ac32` — se implementó **después** de
la firma, no antes.

## 6. Gates humanos G1 y G2 — dato objetivo, no los cierro

Siguen siendo del humano. Pero el dato que se pidió para el informe:

```
gh run view 34990504701
  headSha:    ea5e62bb8ca9c6cae80435fbc5482f8d0a1f8d48
  conclusion: success
  createdAt:  2026-09-15T15:44:54Z
```

`ea5e62bb` es **anterior** a `abc0ac32` (`git merge-base --is-ancestor
ea5e62bb abc0ac32` en verde). **La corrida verde anotada para G1 no cubre el
HEAD actual**: se ejecutó sobre el árbol previo a la enmienda, sin el candado
nuevo. Hace falta una corrida verde posterior para que G1 valga sobre lo que se
va a mergear.

```
gh run view 34992040777
  headSha:    73a1d6b0698f182b1010b4c2ae0f1b5959a9bda1   (= HEAD)
  status:     in_progress
```

Esa sí cubriría el HEAD. Estaba corriendo al escribir esto; su resultado lo
valora el humano, no yo. Las filas G1 y G2 de `traceability.md` siguen en
"pendiente" y **bloquean el `done` de la feature**, no esta enmienda.

## Checklist de la enmienda

- [x] **C2** — el delta no toca `feature_list.json` ni abre otra feature; el
      working tree está limpio y en `feature/96-harness-e2e-nunca-corre-en-ci`
- [x] **C3** — N/A por capas: el delta vive en el harness (`init-e2e-gate.test.mjs`),
      no en `backend-pet-tracker/`
- [x] **C4** — el test nombra su R-id; el rojo se demuestra por mutación, que es
      el método que la propia E1 prescribe (ver §4)
- [x] **C5** — filas de E1 con hash, ninguna "pendiente" en la sección de E1;
      los 20 hashes son ancestros de HEAD, sin rebase
- [x] **C6** — E1 firmada por el humano en `dbeb6b92`, casilla `[X]`, antes de
      implementar
- [x] **C7** — las dos aserciones viejas de R2 se borraron al sustituirlas; no
      queda candado huérfano

## Observaciones

Ninguna bloquea. Una sola, para que quede escrita:

- **Queda una forma de `AWS_MODE` que el candado no ve: el mapping de flujo
  YAML.** Probé una quinta mutación propia, `env: { AWS_MODE: aws }` en el paso
  `Harness verification (init.sh)`: la suite pasa **verde**, exit 0, 15/15. El
  recuento usa `^\s*AWS_MODE\s*:` y la clave en flujo no arranca línea, y el
  `doesNotMatch` de `run:` no la ve porque va en la línea de `env:`, no en la de
  `run:`.
  **No es motivo de rechazo**: E1 dice literalmente "basta con que las dos
  mutaciones de arriba pongan la suite en rojo; el implementador elige el
  parseo", y las dos están rojas. Además, un recuento textual crudo sobre el
  fichero es inviable tal cual, porque la línea 14 de `ci.yml` menciona
  `AWS_MODE` en un comentario. Si se quiere cerrar también esa forma, el parseo
  tendría que ser YAML de verdad (o `js-yaml` sobre el workflow), y eso es una
  enmienda nueva con su firma, no algo que se cuele en esta revisión.

## Comandos de verificación independientes

```
git diff 33a1d80c..HEAD -- .github/workflows/ci.yml        # vacío
git diff 33a1d80c..HEAD -- init-e2e-gate.test.mjs          # solo el it de R2
git merge-base --is-ancestor <20 hashes de traceability> HEAD   # todos OK
git merge-base --is-ancestor ea5e62bb abc0ac32             # OK (G1 es anterior)
node --test init-e2e-gate.test.mjs                         # EXIT 0, 15/15, 9 suites
node --test init-e2e-gate.test.mjs  (M1..M4, copias)       # EXIT 1, 14/15, falla R2
node --test init-e2e-gate.test.mjs  (M5, copia)            # EXIT 0 — ver Observaciones
gh run view 34990504701 / 34992040777
```
