# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #87 — mobile-tanstack-query (activa)

- **Branch**: `feature/87-mobile-tanstack-query` (rebasado sobre `main` @ 7f298f2)
- **Inicio**: 2026-09-10
- **Estado**: `in_progress` — spec **aprobada** por el humano el 2026-09-10, handoff a Codex CLI entregado
- **Prioridad**: P2

Migracion del fetching movil de `src/hooks/use-api.ts` a TanStack Query.
Decidida por el humano el 2026-09-10 al revisar la spec de #78.

Spec: `specs/mobile-tanstack-query/` — 20 requisitos, los cuatro ficheros en
`approved`. Implementa **Codex CLI**, no un subagente. Mientras Codex trabaja,
esta sesion no toca `mobile-pet-tracker/`: solo `docs/`, `specs/`, `progress/`
y `feature_list.json`.

Rebase hecho sobre `main` @ 7f298f2 (merge de #76 / PR #118).

## Feature #78 — mobile-alerts-center (en espera, NO abandonada)

- **Branch**: `feature/78-mobile-alerts-center`, pusheado (`99f5f2d`, `1e4af3a`)
- **Estado**: `spec_ready`, frontmatter en `draft`, pendiente del gate humano
- **Espera a #87 por decision del humano**, para que la pantalla de alertas se
  escriba una sola vez sobre el patron final en vez de con acumulacion manual de
  paginas que #87 reescribiria.
- Cuando #87 cierre hay que **enmendar R1, R8, R9 y R11** de
  `specs/mobile-alerts-center/`: pasan de acumulacion manual + refetch por foco a
  `useInfiniteQuery` + `invalidateQueries`. `design.md` y `tasks.md` con ellos.
- Las cinco decisiones que el humano tenia que firmar siguen abiertas y se firman
  con la spec ya enmendada, no antes.

### Por que dos features en vuelo

No se viola "una sola in_progress": #78 esta `spec_ready`, no `in_progress`, y su
branch queda quieto. El guard de `init.sh` cuenta por arbol de trabajo, asi que
tampoco choca con la sesion Backend que lleva #76 en su propio worktree.

### Incidencia del entorno (2026-09-10)

`init.sh` aborta en este VPS con `❌ Más de 1 feature en in_progress (0)` habiendo
**cero**. Es el bug **#75 `harness-init-force-color`**, todavia `pending`: el
entorno tiene `FORCE_COLOR=3`, Node imprime el numero coloreado y la comparacion
por cadena de `init.sh:138` no matchea `"0"`. **Todo gate de esta sesion tiene que
lanzarlo como `env -u FORCE_COLOR bash ./init.sh`.**

### Coordinacion con la sesion Backend

Lleva #76 en `/home/claude/sites/Pet-Tracker-wt-backend`. Comparten el Postgres de
docker: `pgrep` y aviso mutuo antes de cada `init.sh`. Id #87 reservado y avisado.
