# Handoff a Codex CLI — feature #89 dto-dates-owner-timezone

Feature: dto-dates-owner-timezone (#89), branch: `feature/89-dto-dates-owner-timezone`
Worktree: `/home/claude/sites/Pet-Tracker-wt-backend` — trabaja SOLO ahí. NO uses
`/home/claude/sites/Pet-Tracker` (otro Codex implementa #78 en ese árbol) ni `main`.
Spec aprobada: `specs/dto-dates-owner-timezone/requirements.md` (status: approved,
firmada por el humano en 62992e82 con las tres casillas: gate, R7/R8 como verificación,
decisiones D1-D13 ratificadas sin enmiendas).
Lee también: `specs/dto-dates-owner-timezone/design.md` (D1-D13, §Archivos afectados:
veintidós) y `tasks.md` (T0, R1→R8, plan de TRECE commits de D12 con sus mensajes
literales). Precedente del patrón: `specs/vaccine-applied-at-owner-timezone/` (#88) y
`progress/impl_vaccine-applied-at-owner-timezone.md`.

Alcance: backend NestJS en `backend-pet-tracker/`, módulos `health` y `pets`.
Exactamente los VEINTIDÓS archivos de design.md §Archivos afectados. Cero archivos bajo
`mobile-pet-tracker/`, `infra/`, `src/modules/activity/`, `src/pipeline/`,
`src/modules/auth/`. Cero dependencias nuevas.

- R1: `CreateWeightUseCase(weights, pets, audit)` gana `PET_REPOSITORY`;
  `execute(petId, dto, userId, now)` compara `dto.measuredAt` con
  `ownerLocalDay(this.pets, petId, now)` como PRIMERA operación; `>` lanza
  `WeightMeasuredInFutureError` (nuevo en `health/domain/errors/weight.errors.ts`,
  mensaje `'measuredAt is too far in the future'` byte a byte). `WeightsController.create`
  construye un solo `new Date()` tras el `parseBody`. Los dos `it` de #15 R10 se adaptan,
  no se borran. Commits 1 y 2.
- R2: `CreatePetUseCase(pets, users, auditLogger)` gana `USER_REPOSITORY`;
  `execute(dto, userId, now)` compara `dto.birthDate` (solo si viene) con
  `requesterLocalDay(this.users, userId, now)` (nuevo en
  `pets/application/requester-local-day.ts`, MÍNIMO: `user?.timezone ?? 'UTC'`, sin IANA
  ni warn todavía); `>` lanza `PetBirthDateInFutureError` (en `pet.errors.ts`).
  `PetsModule` importa `AuthModule` primero. `pets.controller.spec.ts:89-92` gana
  `expect.any(Date)`. Commits 3 y 4.
- R3: `requesterLocalDay` degrada a `'UTC'` con `Logger.warn` cuando el usuario no existe
  o su zona no es IANA, extrayendo `localDayInZone(raw, now, context)` en
  `owner-local-day.ts` (única copia de IANA + warn); `ownerLocalDay` pasa a delegar.
  `owner-local-day.spec.ts`, `get-pet.use-case.spec.ts` y
  `vaccine-mutations.use-cases.spec.ts` quedan verdes SIN diff. Commits 5 y 6.
- R4: `UpdatePetUseCase.execute(petId, userId, dto, now)` compara `dto.birthDate` (solo
  si viene) con `ownerLocalDay`; `PetsController.update` iza `now` dentro del `try`.
  `pets.controller.spec.ts:291-293` gana `expect.any(Date)`. Commits 7 y 8.
- R5: e2e `test/health-weights.e2e-spec.ts` con `seedUser(label, timezone = 'UTC')` y el
  par Kiritimati/Pago_Pago: `measuredAt = localDayOf(Date.now(), zona)` → 201;
  `shiftDay(today, 1)` → 400 con la forma de zod byte a byte vía `validationError` del
  propio controller. El `refine` UTC+1, `MEASURED_AT_MAX_FUTURE_DAYS`,
  `maxMeasuredAtIsoDate` y `todayIsoDateUtc` de `iso-date.ts` salen en el commit 10, no
  antes. Commits 9 y 10.
- R6: e2e `test/pets.e2e-spec.ts`: POST con zona del requester, PATCH con zona del
  owner, mismo par; el `refine` UTC y la copia local de `todayIsoDateUtc` salen de
  `create-pet.dto.ts` en el commit 12; `mapPetError` gana la rama de D5; filas
  `create-pet.dto.spec.ts:56` y `update-pet.dto.spec.ts:16` se retiran. Commits 11 y 12.
- R7: verificación — `git diff --name-only 381d1e36...HEAD -- backend-pet-tracker/` =
  los veintidós; diff de `mobile-pet-tracker/` vacío; los cuatro `grep` del barrido
  (`todayIsoDateUtc` en `src test` vacío); archivos de (d)/(e) sin diff; e2e y suite
  completa verdes; `init.sh`.
- R8: TRES mutaciones NO versionadas, una a la vez, sobre el árbol verde: M1 margen
  `shiftDay(today, 1)` en `create-weight.use-case.ts`; M2 `now.toISOString().slice(0,
  10)` en `create-pet.use-case.ts`; M3 `localDayInZone` devolviendo el día UTC. Bloques
  `Expected/Received` con `date -u` al reporte; `git checkout -- <archivo>` después de
  cada una; `git status --short` limpio.

Reglas críticas:

- T0 antes de tocar nada: branch y `merge-base` correctos, docker arriba, los dos
  `node -e` de Intl imprimen lo que dice tasks.md (si no, PARA), corridas de referencia
  verdes en 381d1e36 con sus líneas `Tests:` en el reporte.
- Antes del commit 1: `grep -rn "CreateWeightUseCase\|CreatePetUseCase\|UpdatePetUseCase"
  src test` y confirma que todo constructor o llamador que cambia de firma está en los
  veintidós (design.md D11). Si falta alguno, PARA y repórtalo.
- TDD por requisito: los TRECE commits de design.md D12 en ese orden, con los mensajes
  literales de tasks.md, cada rojo commiteado ANTES de su verde y nombrando su R-id.
  Cada rojo falla POR ASERCIÓN sobre comportamiento de producción ausente (o por la
  firma que el propio requisito crea), nunca por `ReferenceError` de un helper de test
  ni mutando un mock. Copia los `Expected/Received` de cada rojo al reporte.
- Verde mínimo por commit: el commit 4 crea `requesterLocalDay` SIN IANA ni warn; IANA
  + warn + `localDayInZone` llegan en el commit 6 con su rojo (commit 5). Los `try/catch`
  de los controllers llegan en los commits 10 y 12, no antes. No adelantes.
- Tests heredados que cambian de firma: reescribe, no borres. Nombres y aserciones
  intactos. Todo lo listado en traceability.
- Regla dura: si para poner verde hace falta tocar un archivo fuera de los veintidós,
  PARA y repórtalo en `progress/impl_dto-dates-owner-timezone.md`.
- Postgres compartido: antes de CADA e2e o init.sh, `pgrep -af 'init\.sh'` y
  `pgrep -af 'test:e2e'` deben salir vacíos (ignora tu propio pgrep). Otro Codex corre
  init.sh en `/home/claude/sites/Pet-Tracker` para #78: si hay algo vivo, espera, no lo
  mates. Un e2e rojo con filas que no existen o conteos a cero es contención: repite una
  vez limpia antes de concluir.
- `FORCE_COLOR` rompe `init.sh` (bug #75): siempre `env -u FORCE_COLOR bash ./init.sh`.
- Flake móvil #72 (`add-pet/index.test.tsx`, "uploads a chosen preview only after
  createPet succeeds") puede tumbar `init.sh` sin relación con esta feature: si es ese
  único fallo, una segunda corrida limpia vale; anótalo en el reporte.
- `feature_list.json`: no lo toques.
- Convenciones de `docs/conventions.md` y capas de `docs/architecture.md`. Lint y
  formato limpios (los mismos comandos que corre `init.sh`).
- Al final: `git push -u origin feature/89-dto-dates-owner-timezone`. NO abras PR: lo
  abre el leader tras el veredicto del reviewer.
- No crear recursos AWS reales ni correr `cdk deploy`.

Criterios de aceptación: R1-R8 de `requirements.md`. R1-R6 con test que nombra su R-id;
R7 y R8 son de verificación y cierran con evidencia en el reporte.

Al terminar: `env -u FORCE_COLOR bash ./init.sh` exit 0 sin el aviso «se saltan los
e2e», push, y resultado en `progress/impl_dto-dates-owner-timezone.md` con las secciones
`## T0`, `## Rojo/verde por commit`, `## Regresión (R7)` y `## Mutación (R8)`.
