# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #96 — harness-e2e-nunca-corre-en-ci

- **Sesion**: Codex (implementer). Arbol principal `/home/claude/sites/Pet-Tracker`.
- **Rama**: `feature/96-harness-e2e-nunca-corre-en-ci`, creada desde `origin/main` en 48e4130d.
- **Estado**: implementacion TDD de R1-R9 terminada. G1/G2 y el veredicto del
  reviewer siguen pendientes; la feature permanece `in_progress`. Spec
  aprobada por humano en `0f47c176`; feature marcada `in_progress` en
  `80d3f9a4`.

### Inicio de implementacion — 2026-09-15

- Baseline: `./init.sh` termino con exit 0 tras aplicar `db:migrate` y
  `provision:local`; E2E: 3 suites `aws-real-*` saltadas y 26/29 verdes.
- Plan: implementar en el orden de `tasks.md` (R1, R2, R3, R4, R5, R6, R8,
  R9, R7), con commit rojo y commit verde separados por requisito.
- Contencion: no repetir gates pesados mientras otro `init.sh`/E2E este activo;
  5433 y 4566 son compartidos.

### Cierre de implementacion — 2026-09-15

- 18 commits TDD: un rojo y un verde por cada R1-R9, sin rebase; hashes en
  `specs/harness-e2e-nunca-corre-en-ci/traceability.md`.
- Suite dirigida: 9 suites y 15 tests verdes.
- `./init.sh` directo: exit 0; build, tests, setup E2E, lint y typecheck verdes.
  E2E: 3 suites `aws-real-*` saltadas, 26/29 verdes y 367 tests pasados.
- Reporte: `progress/impl_harness-e2e-nunca-corre-en-ci.md`.
- Pendiente humano: G1 y G2. No se abrio PR ni se marco la feature `done`.

### Por que esta feature

Los 29 e2e de `backend-pet-tracker/test/` no se ejecutan nunca en CI, asi que
todo PR se mergea sin verificarlos. Dos causas encadenadas, ambas verificadas
el 2026-09-15: `ci.yml` no declara `services`, e `init.sh:226-245` salta los
e2e con un `warn` en vez de fallar cuando la infra no responde.

### Coordinacion con la sesion Backend

`init.sh`, `init.config.sh` y `ci.yml` los comparten los dos worktrees, asi que
#96 toca a la sesion Backend de lleno. Se le aviso antes de escribir la spec y
se le hicieron cuatro preguntas cuyas respuestas entran en la spec:

1. Si los 29 e2e pasan hoy en verde en su worktree (si alguno esta rojo en
   local, CI se pondra rojo el dia que esto aterrice).
2. El `DATABASE_URL` y la variable del endpoint de LocalStack literales de
   wt-backend, para que la derivacion de puertos cubra los dos arboles.
3. Si tiene PRs abiertos que se vean afectados cuando CI corra e2e de verdad.
4. Si corre `init.sh` a proposito con la infra abajo — de ser asi, convertir el
   salto en fallo duro habria que limitarlo a CI.

Esta sesion no toca `backend-pet-tracker/` en ningun momento.

### Cerrado justo antes

PR #132 (bookkeeping de #63 y tercer avistamiento de #72) mergeado en 48e4130d.
Su CI fallo una vez por el flake de `alerts/index.test.tsx` y paso limpio al
reintentar el mismo commit — evidencia registrada en #72.
