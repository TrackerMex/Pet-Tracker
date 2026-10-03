# Handoff a Codex CLI — #93 `drop-devices-connectivity-column`

Feature: `drop-devices-connectivity-column` (#93), branch:
`feature/93-drop-devices-connectivity-column`.
Worktree: `/home/claude/sites/Pet-Tracker-wt-backend` (base `origin/main` d8e8a49c).
Trabaja SOLO ahí. El tree principal `/home/claude/sites/Pet-Tracker` lo usa otra
sesión (#63) — no lo toques. Antes de empezar: `git pull` y
`git branch --show-current` = `feature/93-drop-devices-connectivity-column`.

Spec aprobada: `specs/drop-devices-connectivity-column/requirements.md`
(status: approved, firma humana en `0cfeae40`). Lee también `design.md`,
`tasks.md` y `traceability.md`. No hay explore propio: el contexto está en
`requirements.md` §0 (premisas corregidas C1-C3) y §Inventario.

Feature backend pura. Sin móvil, sin env nuevas, sin dependencias nuevas, sin
cambio de contrato HTTP (la clave `connectivity` del body sigue derivada).
Una migración nueva, `0016_drop_devices_connectivity.sql`, con una sola sentencia.

Base de datos: este worktree tiene su PROPIA base, `pet_tracker_wt`
(`DATABASE_URL` del `.env` raíz, puerto 5433). Verifica en `tasks.md` §0 que
el journal está en `16|1787957375434` antes de tocar nada. `pnpm db:migrate`
y `pnpm db:generate` corren solo contra esa base. La base compartida
`pet_tracker` NO se toca (D4): su journal está desfasado y el DROP rompería a
la otra sesión; eso lo hace el leader tras el merge de #63.

Decisiones cerradas (no reabrir): D1 una migración, una sentencia
(`ALTER TABLE "devices" DROP COLUMN "connectivity";`; si `db:generate` emite
otra cosa, PARA y repórtalo); D2 inventario (a)/(b) de `requirements.md`
§Inventario, nada fuera de él; D3 Codex migra `pet_tracker_wt` sin gate;
D5 sin e2e permanente contra `information_schema`; D6 sin tipos nuevos ni
propiedades opcionales; D7 el comentario de `ingestion-store.ts:47-48` se
borra.

Archivos a crear/modificar: exactamente los de `design.md` §Archivos
afectados (schema + su spec, migración 0016 + snapshot + `_journal.json`,
entidad `Device`, puerto `ActivePetDeviceStatus`, reader, `toDomain` del
repositorio, comentario de `ingestion-store.ts`, fixtures de 3 use-case specs
+ `get-pet.use-case.spec.ts` + `pets.controller.spec.ts`, una línea en 4 e2e,
`docs/data-model.md:53`, impl y traceability). Lo que NO se toca está en la
misma sección: `connectivity.ts` y su spec, mapper y su spec, controllers,
use cases, store, consumer, scripts, migraciones 0000-0015,
`test/devices.e2e-spec.ts`, `test/device-subscriptions.e2e-spec.ts`,
`test/device-connectivity.e2e-spec.ts`, `init.sh`, `docs/conventions.md`,
móvil.

Reglas críticas:
- Seguir `docs/architecture.md` y `docs/conventions.md`.
- TDD en el orden de `tasks.md`. R1 con rojo real de aserciones: el candado de
  columnas de `devices.schema.spec.ts` sin `'connectivity'` (lista de 14) y el
  `describe('#93 R1')` que lee el `.sql`; el rojo de tipos no cuenta. **UN
  COMMIT POR REQUISITO COMO MÍNIMO, test rojo antes que su implementación**:
  `test(drop-devices-connectivity-column): … (R1)` en rojo, luego
  `feat(drop-devices-connectivity-column): … (R1)` en verde, luego
  `docs(drop-devices-connectivity-column): … (R1)`. Un único commit con todo
  incumple C4 de `CHECKPOINTS.md`.
- R2 y R3 son requisitos de verificación (C4 vía (b)), sin rojo propio: R2 =
  suites verdes SIN aplicar la migración + los tres greps de cierre de
  §Inventario a 0 líneas + `diff --stat`; R3 = las salidas a-g de `tasks.md`
  §R3 contra `pet_tracker_wt` (journal 17, columna ausente, segunda corrida
  idempotente, `db:generate` no-op), e2e verde después e `init.sh`. Pega cada
  salida literal en el impl.
- Candados que se mueven: solo los de la tabla "Se mueven" de
  `requirements.md` §Candados. Si cualquier otro de la tabla "Siguen verdes"
  se pone rojo, la implementación está mal: PARA y anótalo en el impl.
- Suites: `pnpm test`, `pnpm test:e2e`, `pnpm lint`, `pnpm build` desde
  `backend-pet-tracker/`. Postgres ya no se comparte, pero LocalStack sí (14
  de 29 suites e2e lo tocan): antes de cada `pnpm test:e2e` o `./init.sh`,
  `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep` debe estar vacío;
  si hay otro vivo, espera y repite una sola corrida limpia.
- Actualizar `specs/drop-devices-connectivity-column/traceability.md` tras
  cada commit (hash rojo, verde y docs de R1; evidencias de R2 y R3). No
  rebasear la branch después.
- No crear recursos AWS reales ni correr `cdk deploy`.
- **Push** de la branch al terminar: `git push origin feature/93-drop-devices-connectivity-column`.

Criterios de aceptación: R1, R2, R3 de `requirements.md`.

Al terminar: `./init.sh` verde desde la raíz del worktree (pgrep antes, exit
code medido sin pipe), `git diff --stat origin/main` limitado a los ficheros
de arriba, todo en `progress/impl_drop-devices-connectivity-column.md` (una
sección por R con evidencias), push, y para. No abras el PR: lo abre el leader
tras el veredicto del reviewer.
