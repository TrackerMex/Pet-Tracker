# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #96 — harness-e2e-nunca-corre-en-ci

- **Sesion**: Frontend (leader). Arbol principal `/home/claude/sites/Pet-Tracker`.
- **Rama**: `feature/96-harness-e2e-nunca-corre-en-ci`, creada desde `origin/main` en 48e4130d.
- **Estado**: `spec_author` escribiendo la spec. Pendiente el gate humano de aprobacion.

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
