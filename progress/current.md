# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #63 `mobile-detail-screens-state-reset` (P2)

- **Sesion**: Frontend, worktree `/home/claude/sites/Pet-Tracker`.
- **Branch**: `feature/63-mobile-detail-screens-state-reset`, desde `origin/main` `66a9d52b`
  (tras mergear #127 y #128).
- **Estado**: `pending` → `spec_author` lanzado. Sin `explorer`: el enunciado de
  `feature_list.json` ya trae la exploracion (causa raiz, lineas y el detalle del
  mock de `useFocusEffect` en `pairing/index.test.tsx`).
- **Baseline**: `./init.sh` VERDE, exit 0, medido sin pipe sobre `66a9d52b` (el commit
  del que sale la branch; el unico commit encima, `2c516932`, solo toca este archivo).
  Sin concurrencia con la sesion Backend (`pgrep` limpio antes de lanzarlo).

  | Bloque | Suites | Tests |
  |---|---|---|
  | backend | 166 | 1277 |
  | infra | 2 | 14 |
  | movil | 73 | 1265 |
  | e2e | 26 de 29 (3 skipped) | 365 passed de 373 (8 skipped) |

  Estas cifras son el punto de comparacion para el **delta** de #63. No las copies
  como constante en la spec: se miden de nuevo contra este commit al cerrar.

### Decision que la spec tiene que cerrar

Criterio 3 del enunciado: **Stack vs reset local**. Sacar las pantallas de detalle
del Tabs arregla de raiz el remount y ademas cierra el teleport sin transicion (M3 de
`progress/audit_animations_mobile.md`) y la cabecera a mano; el reset local es menos
codigo pero deja las dos cosas abiertas. `/pairing` es caso aparte: es pestaña por la
decision D4 de #42 y su arreglo ya esta prescrito (reset de `code`, `actionError`,
`phase` y `readyDevice`).

### Pendiente tras la spec

1. Gate humano de la spec (firma en branch, `main` protegida).
2. Handoff a Codex CLI.
3. `reviewer`.
4. Gate humano final: smoke en **dev build de Android**, crear dos recordatorios
   seguidos.
