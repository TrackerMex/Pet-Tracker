# review: init-env-drift-warning (#23)
Fecha: 2026-08-16
Branch revisada: `feature/23-init-env-drift-warning` (HEAD `6b256d9`)
Veredicto: APROBADO

El reviewer no se fió del reporte de Codex: corrió `./init.sh` él mismo, rehízo
el diff de R9(b) desde cero contra el `init.sh` de `main`, y verificó el rojo de
cada commit `test(...)` en un worktree desechable fuera del working tree.

---

## Checklist C1 — Harness
- [ ] N/A — no es la primera feature del proyecto. `./init.sh` termina en 0 (ver §Output).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress`: `23:init-env-drift-warning` (verificado sobre
      `feature_list.json`; 24 done de 30)
- [x] `progress/current.md` describe la sesión activa (#23, branch, rol, plan)
- [x] `progress/history.md` tiene entrada de cada sesión cerrada (última: #27)
- [x] Working tree limpio al terminar la revisión: los mismos tres untracked que
      al inicio (`.agents/`, `.codex/`, `skills-lock.json`). El worktree
      desechable se eliminó con `git worktree remove --force` y `prune`.

## Checklist C3 — Arquitectura
- [ ] N/A — feature de harness pura. No hay capas domain / application /
      infrastructure implicadas, tal y como declara `requirements.md` §encabezado.
      Confirmado por el diff: ni un archivo bajo `backend-pet-tracker/` ni `infra/`.
- [x] Sustituto aplicable — **portabilidad**, que es la restricción arquitectónica
      real de esta feature:
  - `env-drift.mjs` importa **exclusivamente** `node:fs` (`readFileSync`). Cero
    dependencias, cero paquetes, solo stdlib.
  - El bloque nuevo de `init.sh` (líneas 76-87) no usa `comm`, `sort`, `awk`,
    `sed`, `grep -f`, `python`, `jq`, `nc` ni `lsof` (R7d). Solo `[ -f ]`,
    `node`, `warn()` y un here-string.
  - CRLF/BOM verificado **funcionalmente**, no solo leyendo el regex:
    `.env.example` es CRLF (`file`: `with CRLF line terminators`), `.env` es LF.
    En la corrida real reporta **8** claves faltantes, no 21 — si el parser
    tropezara con el `\r` reportaría las 21. Cross-test adicional del reviewer:
    `.env` con BOM + LF contra `.env.example` con CRLF y las mismas 3 claves ⇒
    stdout vacío, rc=0; y quitando 2 claves ⇒ las 2 detectadas, gate aparte.

## Checklist C4 — TDD
- [x] Cada R1..R11 tiene al menos un test que lo nombra. Los 11 `describe` siguen
      el patrón exacto `R<n> (init-env-drift-warning #23): ...` y salen impresos
      en la corrida de `init.sh` vía `TEST_CMD` (28 tests, 11 suites, 0 fail).
      R12 es procedimiento manual declarado como tal en la spec — verificado a
      mano más abajo.
- [x] **Historial test-primero verificado de verdad, no por el mensaje del commit.**
      Este es el checkpoint que falló en #19; se comprobó ejecutando la suite en
      cada commit `test(...)` dentro de un worktree detached en el scratchpad
      (sin `git stash`, sin mover el HEAD de la branch):

      | R-id | commit rojo | resultado real | commit verde | resultado real |
      |---|---|---|---|---|
      | R1  | `d7e5295` | exit 1, fail 1 | `2a1a94c` | verde |
      | R2  | `8c0d84e` | exit 1, fail 3 | `5f9c1a5` | verde |
      | R3  | `0c6aacb` | exit 1, fail 4 | `7f85092` | verde |
      | R4  | `1e60bfb` | exit 1, fail 1 | `15e188b` | verde |
      | R5  | `ba75bdc` | exit 1, fail 3 | `aeef03d` | verde |
      | R6  | `e09c1ed` | exit 1, fail 1 | `2ba4ccc` | exit 0, pass 20 |
      | R7  | `d85dc9a` | exit 1, fail 1 | `4f738d5` | verde |
      | R8  | `e5ec8ba` | exit 1, fail 2 | `4f738d5` | verde |
      | R9  | `ee356a2` | exit 1, fail 3 | `4f738d5` | exit 0, pass 24 |
      | R10 | `4235ed7` | exit 1, fail 1 | `cdd1343` | exit 0, pass 25 |
      | R11 | `45087f1` | exit 1, fail 2 | `9a1c23d` | exit 0, pass 28 |

      **Los 11 commits `test(...)` fallan de verdad en su propio commit.** Ninguno
      era un "rojo" que ya pasaba en verde.

      Dos R-ids auditados a fondo, los de mayor riesgo de rojo falso (inspección
      estática, que es fácil que pase por accidente):
      - **R6** — en `e09c1ed` el TAP nombra el test que rompe:
        `not ok 2 - solo importa readFileSync para acceder al filesystem`. El
        `git diff aeef03d 2ba4ccc -- env-drift.mjs` enseña el cambio que lo pone
        verde: `import { readFile } from 'node:fs/promises'` + `await Promise.all`
        pasa a `import { readFileSync } from 'node:fs'` + dos lecturas síncronas.
        Rojo→verde causal, no decorativo.
      - **R10** — en `4235ed7` falla porque `init.config.sh` aún no contenía
        `node --test env-drift.test.mjs`; `cdd1343` (la línea única de `TEST_CMD`)
        lo pone verde. Idéntico patrón en R9 (`ee356a2` rojo porque `init.sh` aún
        no tenía el bloque) y R11 (`45087f1` rojo por `docs/verification.md`).
- [x] Ningún commit `test(...)` cuela implementación: los 11 tocan solo
      `env-drift.test.mjs` más bookkeeping (`traceability.md`, `progress/`).
      Verificado con `git show --name-only`.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente". La única aparición de la palabra es
      la línea 28 del boilerplate ("Regla: el reviewer no aprueba si alguna fila
      queda 'pendiente'"), no una fila de la tabla.
- [x] Cada R1..R12 tiene test y commit registrados, con **rojo y verde por
      separado** en cada fila. Los 22 hashes citados existen en la branch y su
      mensaje coincide con el registrado.
- [x] Commits siguen `feat(<scope>): <desc> (R-ids)`. Los 8 `feat(...)` llevan sus
      R-ids; R11 y R12 cierran con `docs(...)` porque son requisitos de
      documentación, lo cual es correcto.
- [x] La tabla "Archivos que deben quedar SIN cambios" se cumple entera:
      `backend-pet-tracker/**`, `infra/**`, `.env.example` y `docs/conventions.md`
      no aparecen en `git diff main...HEAD --stat`.

## Checklist C6 — Spec aprobada
- [x] `specs/init-env-drift-warning/requirements.md` con `status: approved` en el
      frontmatter
- [x] Casilla `[X] Aprobado por humano (fecha: 26-08-16)` marcada
- [x] Ningún requisito modificado después de la aprobación:
      `git log f24e1c6..HEAD -- specs/init-env-drift-warning/requirements.md`
      sale vacío. El gate no se movió por debajo de la implementación.

## Checklist C7 — Sin código huérfano
- [x] N/A — esta feature no reemplaza nada. R10 lo exige explícitamente: el
      chequeo nuevo **convive** con `REQUIRED_ENV_VARS` y `check_env()`.
      Verificado en `init.sh`: `REQUIRED_ENV_VARS=("DATABASE_URL")` intacto en
      `init.config.sh:12`, `check_env()` intacta con su
      `grep -q "^${var}=" .env` (líneas 62-69), y el `cp .env.example .env`
      (línea 53) sigue ahí. El diff de `init.sh` es **puramente aditivo**:
      13 líneas insertadas entre la 74 y la antigua 76, cero suprimidas.
      `init.config.sh` cambia exactamente **una** línea (`TEST_CMD`).

---

## Verificación explícita de los 9 puntos exigidos

**1. `./init.sh` corrido por el reviewer** — verde, exit 0. 993 unitarios backend
+ 14 infra + **28 de la suite nueva vía `TEST_CMD`**, e2e reales (17 suites
pasadas, 2 skipped — pre-existentes, no regresión). LocalStack estaba caliente:
no hizo falta reprovisionar. Ver §Output.

**2. C4 test-primero** — auditado commit a commit. Ver tabla arriba. Cumple.

**3. R6 + R12 — `init.sh` nunca escribe `.env`.** El test de R6 no es una
assertion de conveniencia: tiene dos `it`, y el primero es **conductual** —
monta un fixture en tmpdir con deriva real, invoca la CLI con `execFileSync` y
asevera que `readFileSync(envPath)` y `statSync(envPath).mtimeMs` son idénticos
después. El segundo es inspección de fuente (patrón ya usado en el repo). La
evidencia manual de R12 en el reporte de Codex incluye `stat -c '%Y %s' .env`
antes y después (`1786743239 895` las dos veces) y el `echo $?` = `0`.
**Reproducido por el reviewer**: mi propio `stat` antes de correr `init.sh` dio
`1786743239 895` y después `1786743239 895` — mismo mtime y mismo tamaño que
registró Codex, o sea que el `.env` no se ha tocado ni siquiera entre las dos
sesiones. `.env` sigue sin aparecer en `git status`.

**4. Alcance** — `git diff main...HEAD --name-only` devuelve 14 archivos, todos
de harness/docs/spec/progress. **Cero** bajo `backend-pet-tracker/` o `infra/`.

**5. El `.env` del humano no fue modificado** — `.env` no está trackeado
(`git ls-files --error-unmatch .env` ⇒ pathspec no coincide), no aparece en
`git log main..HEAD -- .env` (vacío) ni en el diff. R9(4)/R12.4 se resolvió con
copia temporal (`mktemp -d` + `cp .env.example "$tmp_dir/.env"`), tal y como
documenta `docs/verification.md`. Las credenciales de Wialon siguen intactas.

**6. Portabilidad** — ver C3. Bloque de `init.sh` sin herramientas prohibidas,
`env-drift.mjs` solo `node:fs`, CRLF y BOM verificados funcionalmente.

**7. R10 — no rompió lo existente** — ver C7. Diff aditivo, `check_env()` y
`REQUIRED_ENV_VARS` intactos y funcionando (`✅   DATABASE_URL definida` sigue
imprimiéndose en la corrida real).

**8. Traceability** — sin filas pendientes, cada R-id con su `describe` nombrado
`R<n> (init-env-drift-warning #23): ...` y su commit rojo + verde.

**9. R4/R9 — el output no cambia sin deriva.** No me fié del diff vacío que pegó
Codex: **lo rehíce desde cero**. Monté dos directorios en el scratchpad, uno con
el `init.sh`/`init.config.sh` de `main` (sin la feature) y otro con los de HEAD
más `env-drift.mjs`, los dos con `.env` = copia de `.env.example` (sin deriva),
extraje la §2 de cada uno con el `sed` de R9(b) y comparé:

```text
$ diff env-section-antes.txt env-section-despues.txt
diff exit=0
```

Sección idéntica en los dos casos:

```text
→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida

→ Instalando dependencias...
```

Con `.env` completo la §2 queda **byte a byte idéntica** a la de antes de la
feature: ni una línea nueva, ninguna `✅` de confirmación. R9 cumplido de forma
reproducible e independiente.

---

## R12 — verificación manual repetida por el reviewer

| Paso | Qué exige R12 | Resultado del reviewer |
|---|---|---|
| R12.1 | Las 4 líneas literales de R3 con `⚠️  `, 4 gates + 4 de configuración | **verde** — salida idéntica carácter a carácter a la de R3 §Contexto (ver §Output) |
| R12.2 | `.env` sin modificar (`stat` y `git status`) | **verde** — `1786743239 895` antes y después; `.env` no trackeado ni en `git status` |
| R12.3 | `./init.sh; echo $?` ⇒ `0` | **verde** — `EXIT=0` |
| R12.4 / R9(b) | Con `.env` completo, sin líneas de aviso y `diff` vacío | **verde** — rehecho desde cero, `diff exit=0` |

---

## Observaciones
Ninguna bloqueante. Dos nits cosméticos para que el leader decida si merecen un
commit de limpieza o si se dejan estar:

1. **Comentario con número de línea desfasado** — `init.sh:78` dice "init.sh lo
   usa desde la linea 115", pero tras insertar las 13 líneas del bloque el primer
   `node -e` quedó en la **128**. El texto viene literal de la spec (R7 lo dictó
   verbatim), así que Codex hizo lo correcto al copiarlo; el desfase lo introdujo
   la propia inserción. Es un comentario, no afecta al comportamiento.

2. **`progress/current.md` desactualizado** — su §Siguiente paso todavía dice
   "Esperar la aprobación humana de requirements.md", cuando la spec ya está
   aprobada y Codex ya terminó. Es bookkeeping del leader, no del implementer, y
   se resuelve solo en el cierre de sesión.

Fuera de eso: la spec era autosuficiente y la implementación la sigue al pie de
la letra —rutas, nombres de símbolos, literales de salida y ubicación del bloque
coinciden exactamente con lo escrito—, sin añadir nada que la spec no pidiera.

---

## Output de ./init.sh

Corrido por el reviewer desde la raíz, con Git Bash, sobre
`feature/23-init-env-drift-warning`:

```text
══════════════════════════════════════════
  INIT — pet-tracker (Harness SDD)
══════════════════════════════════════════

→ Verificando entorno...
✅ node disponible (/c/Program Files/nodejs/node)
✅ pnpm disponible (/c/Users/alex/AppData/Local/pnpm/pnpm)

→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
⚠️  .env desactualizado: faltan 8 claves de .env.example
⚠️    gates ausentes (apagan features enteras en silencio): ACTIVITY_AGGREGATOR_ENABLED, ALERTS_ENGINE_ENABLED, EMAIL_ENABLED, PUSH_ENABLED
⚠️    configuración ausente: AWS_MODE, SIM_HOME_LAT, SIM_HOME_LNG, SIM_SEED
⚠️    init.sh no modifica .env — añade a mano las que necesites desde .env.example

→ Instalando dependencias...
...[recorte: install, build, synth]...

→ Tests...
Test Suites: 134 passed, 134 total
Tests:       993 passed, 993 total

> pet-tracker-infra@0.0.1 test
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total

▶ R1 (init-env-drift-warning #23): parseEnvKeys aplica las reglas de parseo
✔ R1 (init-env-drift-warning #23): parseEnvKeys aplica las reglas de parseo (3.141ms)
▶ R2 (init-env-drift-warning #23): missingKeys solo reporta example → env
✔ R2 (init-env-drift-warning #23): missingKeys solo reporta example → env (1.5702ms)
▶ R3 (init-env-drift-warning #23): formatDriftLines separa gates de configuración
✔ R3 (init-env-drift-warning #23): formatDriftLines separa gates de configuración (0.7313ms)
▶ R4 (init-env-drift-warning #23): sin deriva no hay salida
✔ R4 (init-env-drift-warning #23): sin deriva no hay salida (55.8648ms)
▶ R5 (init-env-drift-warning #23): sin .env.example el script calla y sale 0
✔ R5 (init-env-drift-warning #23): sin .env.example el script calla y sale 0 (154.2904ms)
▶ R6 (init-env-drift-warning #23): el script nunca escribe en disco
✔ R6 (init-env-drift-warning #23): el script nunca escribe en disco (57.5858ms)
▶ R7 (init-env-drift-warning #23): init.sh invoca el chequeo con warn()
✔ R7 (init-env-drift-warning #23): init.sh invoca el chequeo con warn() (0.478ms)
▶ R8 (init-env-drift-warning #23): el aviso no aborta
✔ R8 (init-env-drift-warning #23): el aviso no aborta (103.7721ms)
▶ R9 (init-env-drift-warning #23): sin deriva la seccion 2 no cambia
✔ R9 (init-env-drift-warning #23): sin deriva la seccion 2 no cambia (0.6453ms)
▶ R10 (init-env-drift-warning #23): init.config.sh mantiene REQUIRED_ENV_VARS y ejecuta la suite
✔ R10 (init-env-drift-warning #23): init.config.sh mantiene REQUIRED_ENV_VARS y ejecuta la suite (0.4744ms)
▶ R11 (init-env-drift-warning #23): documentacion y cero variables nuevas
✔ R11 (init-env-drift-warning #23): documentacion y cero variables nuevas (0.977ms)
ℹ tests 28
ℹ suites 11
ℹ pass 28
ℹ fail 0
✅ Tests pasados

→ Tests e2e...
Test Suites: 2 skipped, 17 passed, 17 of 19 total
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 24/30 completadas | 5 pendientes

  Próxima feature:
  [#25] device-subscriptions (P2)

EXIT=0
```

Los 2 e2e skipped son pre-existentes (mismo conteo que la sesión de #27) y no
tienen relación con esta feature. Los `ERROR [PollerService] cycle skipped,
cannot resolve queue url` que aparecen en el log de jest son salida esperada de
tests que ejercitan el camino de error del poller — las 134 suites pasan.
