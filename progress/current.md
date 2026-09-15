# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #93 `drop-devices-connectivity-column` (P3)

- **Sesion**: Backend, worktree `/home/claude/sites/Pet-Tracker-wt-backend`.
- **Branch**: `feature/93-drop-devices-connectivity-column`, desde `origin/main` `d8e8a49c`
  (merge de #92, PR #129).
- **Inicio**: 2026-09-14, en paralelo con #63 (sesion Frontend, tree principal, solo movil).
- **Estado**: `in_progress`. Spec de `spec_author` (`659b365a`, enmendada para la base propia
  `pet_tracker_wt`), firmada por el humano (`0cfeae40`, 2026-09-14), frontmatter de los 4
  ficheros en `approved`. Handoff a Codex CLI en
  `progress/handoff_drop-devices-connectivity-column.md`; el humano lo corre en su terminal.
  Mientras, este leader no toca `backend-pet-tracker/`.
- **Base propia**: `pet_tracker_wt` (creada y migrada el 2026-09-14, e2e validado 26/367).
  Codex migra ahi; la compartida `pet_tracker` (journal en 0013) se repara y migra tras el
  merge de #63 (design.md §Aplicacion en el Postgres compartido).
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

1. Codex implementa R1-R3 (en curso, terminal del humano).
2. `reviewer` (avisar a Frontend antes de su `init.sh` por LocalStack).
3. PR; el humano mergea.
4. Tras el merge de #63: reparar journal de `pet_tracker` + `db:migrate` (leader/humano).
