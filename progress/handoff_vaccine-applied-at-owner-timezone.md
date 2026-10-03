# Handoff a Codex CLI — feature #88 vaccine-applied-at-owner-timezone

Feature: vaccine-applied-at-owner-timezone (#88), branch: `feature/88-vaccine-applied-at-owner-timezone`
Worktree: `/home/claude/sites/Pet-Tracker-wt-backend` — trabaja SOLO ahí. NO uses
`/home/claude/sites/Pet-Tracker` (otra sesión trabaja #87 en ese árbol) ni `main`.
Spec aprobada: `specs/vaccine-applied-at-owner-timezone/requirements.md` (status: approved,
firmada por el humano en bf94ec1 con las tres casillas: gate, R5/R6 como verificación,
decisiones D1-D9 ratificadas)
Lee también: `specs/vaccine-applied-at-owner-timezone/design.md` (D1-D10, §Archivos
afectados: once) y `tasks.md` (T0, R1→R6, plan de DIEZ commits). La spec de #82
(`specs/vaccine-due-today-inclusive/`) es el precedente del patrón de zona del owner.

Alcance: backend NestJS en `backend-pet-tracker/`, módulos `health` y `pets`.
Exactamente los ONCE archivos de design.md §Archivos afectados. Cero archivos bajo
`mobile-pet-tracker/`, `infra/`, `src/modules/activity/`; `iso-date.ts`, `weight.dto.ts`
y `create-pet.dto.ts` NO se tocan (fuera de alcance por escrito). Cero dependencias nuevas.

- R1: `CreateVaccineUseCase.execute(petId, dto, userId, now)` compara `dto.appliedAt`
  con el día civil del owner (`ownerLocalDay(pets, petId, now)`, helper nuevo en
  `src/modules/pets/application/owner-local-day.ts`); `appliedAt > día` lanza
  `VaccineAppliedInFutureError` (nuevo en `health/domain/errors/vaccine.errors.ts`).
  Es la PRIMERA operación del `execute` (precedencia 400/404 de design.md). El
  controller construye un solo `new Date()` por request.
- R2: `UpdateVaccineUseCase` gana `PET_REPOSITORY` como segundo parámetro del
  constructor `(vaccines, pets, audit)` y `execute(petId, id, dto, userId, now)`; valida
  solo si el body trae `appliedAt`; sin `appliedAt` no consulta la zona. El `it`
  posicional de #14 R12 se adapta (design.md D3), no se borra.
- R3: `ownerLocalDay` degrada a `'UTC'` con un `Logger.warn({ petId, timezone })` propio
  del helper (scope `'owner-local-day'`) cuando la zona es `null` o no IANA
  (`isSupportedTimeZone` de `src/pipeline/local-day.ts`). `GetPetUseCase` pasa a usar
  el helper en el commit 7 (refactor): `get-pet.use-case.spec.ts` queda verde SIN diff.
- R4: e2e en `test/health-vaccines.e2e-spec.ts` con el par Kiritimati/Pago_Pago
  (`seedUser(label, timezone)` ya existe desde #82): POST y PATCH con `appliedAt =
  localDayOf(Date.now(), zona)` → 2xx; con `shiftDay(today, 1)` → 400 con la forma de
  zod byte a byte (`Validation failed`, `errors[{ path: 'appliedAt', message: 'Applied
  date cannot be in the future' }]`) vía `vaccine-error.mapper.ts`. El `refine` UTC sale
  de `vaccine.dto.ts` en el commit 9, no antes (tabla de rojos de design.md D8).
- R5: verificación — `git diff --name-only f3e3280...HEAD -- backend-pet-tracker/` = los
  once archivos; `test/pets.e2e-spec.ts`, `health-weights.e2e-spec.ts` y
  `get-pet.use-case.spec.ts` sin diff; suite unitaria y e2e completas verdes; `init.sh`.
- R6: dos mutaciones NO versionadas, una a la vez, sobre el árbol verde: M1 helper
  devolviendo `now.toISOString().slice(0, 10)` (día UTC) y M2 `<=` → `<`. Bloques
  `Expected/Received` al reporte; `git checkout -- <archivo>` después de cada una.

Reglas críticas:

- TDD por requisito: los DIEZ commits de design.md D10 en ese orden, cada rojo
  commiteado ANTES de su verde y nombrando su R-id. Cada rojo falla POR ASERCIÓN sobre
  comportamiento de producción ausente (o por la firma de producción que el propio
  requisito crea), nunca por `ReferenceError` de un helper de test ni mutando un mock.
- Verde mínimo por commit: el commit 2 crea el helper SIN IANA ni warn (`zona ?? 'UTC'`);
  IANA + warn llegan en el commit 6 con su rojo (commit 5). No adelantes.
- Tests heredados que cambian: reescribe, no borres. Todo lo listado en traceability.
- Regla dura de tasks.md: si para poner verde hace falta tocar un archivo fuera de los
  once, PARA y repórtalo en `progress/impl_vaccine-applied-at-owner-timezone.md`. Antes
  de empezar, ejecuta `grep -rn "CreateVaccineUseCase\|UpdateVaccineUseCase" src test`
  y confirma que todos los constructores/llamadores que cambian de firma están en el
  inventario; si falta alguno, PARA antes del commit 1.
- Postgres compartido: antes de CADA e2e o init.sh, `pgrep -af 'init\.sh'` y
  `pgrep -af 'test:e2e'` deben salir vacíos (ignora tu propio pgrep de 0 s). Otro
  reviewer/Codex corre init.sh en `/home/claude/sites/Pet-Tracker` para #87: si hay
  algo vivo, espera, no lo mates. Un e2e rojo con filas que no existen o conteos a
  cero es contención: repite una vez limpia antes de concluir.
- `FORCE_COLOR` rompe `init.sh` (bug #75): siempre `env -u FORCE_COLOR bash ./init.sh`.
- Flake móvil #72 (`add-pet/index.test.tsx`, "uploads a chosen preview only after
  createPet succeeds") puede tumbar `init.sh` sin relación con esta feature: si es ese
  único fallo, una segunda corrida limpia vale; anótalo en el reporte.
- `feature_list.json`: no lo toques. Si hubiera que editarlo, por línea, nunca
  reescribiendo el JSON entero.
- Convenciones de `docs/conventions.md` y capas de `docs/architecture.md`. Lint y
  formato limpios (los mismos comandos que corre `init.sh`).
- Al final: `git push -u origin feature/88-vaccine-applied-at-owner-timezone`. NO abras
  PR: lo abre el leader tras el veredicto del reviewer.
- No crear recursos AWS reales ni correr `cdk deploy`.

Criterios de aceptación: R1-R6 de `requirements.md`. R1-R4 con test que nombra su R-id;
R5 y R6 son de verificación y cierran con evidencia en el reporte.

Al terminar: `env -u FORCE_COLOR bash ./init.sh` exit 0 sin el aviso «se saltan los
e2e», push, y resultado en `progress/impl_vaccine-applied-at-owner-timezone.md` con las
secciones `## T0`, `## Rojo/verde por commit`, `## Regresión (R5)` y `## Mutación (R6)`.
