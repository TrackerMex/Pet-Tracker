# Handoff a Codex CLI — #92 `device-telemetry-reset-on-reassign`

Feature: `device-telemetry-reset-on-reassign` (#92), branch:
`feature/92-device-telemetry-reset-on-reassign`.
Worktree: `/home/claude/sites/Pet-Tracker-wt-backend` (base `origin/main` 66a9d52b).
Trabaja SOLO ahí. El tree principal `/home/claude/sites/Pet-Tracker` lo usa otra
sesión (#63) — no lo toques. Antes de empezar: `git pull` y
`git branch --show-current` = `feature/92-device-telemetry-reset-on-reassign`.

Spec aprobada: `specs/device-telemetry-reset-on-reassign/requirements.md`
(status: approved, firma humana en `901d815f`). Lee también `design.md`,
`tasks.md` y `traceability.md`. No hay explore propio: el contexto está en
`requirements.md` §0 (premisas verificadas y corregidas) y en
`progress/explore_pet-online-pill.md` §1-§2.

Feature backend pura. Sin móvil, sin migración, sin env nuevas, sin
dependencias nuevas, sin cambio de contrato HTTP (solo cambian valores).

Decisiones cerradas (no reabrir): D1 reset en `claim`, `release()` intacto;
D2 `battery_pct` y `last_message_at` a NULL, `connectivity` no se toca;
D3 `DeviceRepository.claim` devuelve `Promise<Device>` vía `.returning()`
dentro de la misma transacción y `ClaimDeviceUseCase.execute` devuelve esa
entidad; D4 `ingestion.drizzle.store.ts` no se toca; D5 sin código para el
mensaje tardío del dueño anterior.

Archivos a crear/modificar: exactamente los de `design.md` §Archivos afectados:
- `backend-pet-tracker/src/modules/devices/infrastructure/repositories/device.drizzle.repository.ts` (`claim()` solo)
- `backend-pet-tracker/src/modules/devices/domain/repositories/device.repository.ts`
- `backend-pet-tracker/src/modules/devices/application/use-cases/claim-device.use-case.ts`
- `backend-pet-tracker/src/modules/devices/application/use-cases/claim-device.use-case.spec.ts`
- `backend-pet-tracker/test/devices.e2e-spec.ts`
- comentarios en `device.entity.ts`, `devices.schema.ts` y fila `devices` de `docs/data-model.md`
- `progress/impl_device-telemetry-reset-on-reassign.md`, `specs/device-telemetry-reset-on-reassign/traceability.md`
Lo que NO se toca está en `design.md` §Archivos afectados "No se tocan"
(`release()`, `ingestion.drizzle.store.ts`, consumer, mappers, controllers,
reader, schema, `test/device-subscriptions.e2e-spec.ts`,
`test/device-connectivity.e2e-spec.ts`, `test/ingestion.e2e-spec.ts`, móvil).

Reglas críticas:
- Seguir `docs/architecture.md` y `docs/conventions.md`.
- TDD en el orden de `tasks.md`: R1 con rojo real de aserciones (el e2e (a)
  recibe `37` donde espera `null`; el unit recibe el snapshot previo). **UN
  COMMIT POR REQUISITO COMO MÍNIMO, test rojo antes que su implementación**:
  `test(device-telemetry-reset-on-reassign): … (R1)` en rojo, luego
  `feat(device-telemetry-reset-on-reassign): … (R1)` en verde, luego
  `docs(device-telemetry-reset-on-reassign): … (R1)`. Un único commit con
  todo incumple C4 de `CHECKPOINTS.md`.
- R2 y R3 son requisitos de verificación (C4 vía (b)): no tienen rojo propio.
  R2 exige la **sonda de mutación** de `tasks.md` §R2 (quitar el brazo
  `isNull` de `ingestion.drizzle.store.ts:104` → el `it` (a) cae en
  `batteryPct === 80` → restaurar con `git diff` vacío); evidencia literal
  (comando + línea de fallo) en el impl §R2. No se versiona la mutación.
- Único candado que se mueve: `claim-device.use-case.spec.ts:64` (delta de
  `requirements.md` §Candados). Si cualquier otro test de la tabla "Siguen
  verdes" se pone rojo, la implementación está mal: no ajustes candados que
  la spec no declara; PARA y anótalo en el impl.
- Suites: `pnpm test`, `pnpm test:e2e -- devices.e2e-spec`, `pnpm lint`,
  `pnpm build` desde `backend-pet-tracker/`. Antes de cada `pnpm test:e2e` o
  `./init.sh`: `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep` debe
  estar vacío (el Postgres de docker se comparte con la sesión #63; si hay
  otro vivo, espera y repite una sola corrida limpia).
- Actualizar `specs/device-telemetry-reset-on-reassign/traceability.md` tras
  cada commit (hash rojo, verde y docs de R1; evidencias de R2 y R3). No
  rebasear la branch después.
- No crear recursos AWS reales ni correr `cdk deploy`.
- **Push** de la branch al terminar: `git push origin feature/92-device-telemetry-reset-on-reassign`.
  El humano y el reviewer leen desde el remoto.

Criterios de aceptación: R1, R2, R3 de `requirements.md`.

Al terminar: `./init.sh` verde desde la raíz del worktree (pgrep antes, exit
code medido sin pipe), `git diff --stat origin/main` limitado a los ficheros
de arriba, todo en `progress/impl_device-telemetry-reset-on-reassign.md` (una
sección por R con evidencias), push, y para. No abras el PR: lo abre el leader
tras el veredicto del reviewer.
