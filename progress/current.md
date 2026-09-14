# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #93 `drop-devices-connectivity-column` (P3)

- **Sesion**: Backend, worktree `/home/claude/sites/Pet-Tracker-wt-backend`.
- **Branch**: `feature/93-drop-devices-connectivity-column`, desde `origin/main` `d8e8a49c`
  (merge de #92, PR #129).
- **Inicio**: 2026-09-14, en paralelo con #63 (sesion Frontend, tree principal, solo movil).
- **Estado**: `pending` → `spec_author` lanzado. Sin `explorer`: el inventario de referencias
  a `connectivity` cabe en un grep y el enunciado ya lo trae.
- **Baseline**: el `init.sh` de cierre de #92 (exit 0, sin pipe) sobre el contenido que
  mergeo `d8e8a49c`: backend 166 suites / 1278 tests; infra 2 / 14; movil 73 / 1265;
  e2e 26 de 29 suites (3 skipped), 367 de 375 tests (8 skipped).
- **Premisa falsa detectada antes de especificar**: el criterio 1 dice "aplicada por
  init.sh sin intervencion manual", pero `init.sh` no corre migraciones; se aplican a mano
  con `pnpm db:migrate` (`docs/conventions.md:216`). La spec debe corregirlo en §0.2.
- **Riesgo de Postgres compartido**: `DROP COLUMN` aplicado en la DB de docker rompe los e2e
  de cualquier sesion cuyo codigo aun declare `devices.connectivity` en el schema (la
  sesion Frontend en `origin/main` pre-#93). Con Drizzle, los e2e de #93 pasan con o sin la
  migracion aplicada (solo selecciona columnas declaradas), asi que `db:migrate` en la DB
  compartida se difiere hasta que #63 cierre sus gates o #93 se mergee.

### Pendiente

1. Spec (`spec_author`) → gate humano.
2. Handoff a Codex CLI (sin `db:migrate` en la DB compartida hasta coordinar con Frontend).
3. `reviewer` (avisar a Frontend antes de su `init.sh`).
4. PR; el humano mergea.
