# Handoff a Codex CLI — feature #82 vaccine-due-today-inclusive

Feature: vaccine-due-today-inclusive (#82), branch: `feature/82-vaccine-due-today-inclusive`
Worktree: `/home/claude/sites/Pet-Tracker-wt-backend` — trabaja SOLO ahí. NO uses
`/home/claude/sites/Pet-Tracker` (otro Codex implementa #87 en ese árbol) ni `main`.
Spec aprobada: `specs/vaccine-due-today-inclusive/requirements.md` (status: approved,
firmada por el humano en 7d87e93 con las tres casillas: gate, R6/R7 como verificación,
decisiones D1-D9 ratificadas)
Lee también: `specs/vaccine-due-today-inclusive/design.md` (D1-D11, §Archivos afectados)
y `tasks.md` (T0, R1→R7, plan de siete commits). La exploración
`progress/explore_vaccine-due-today-inclusive.md` es contexto, no norma: manda la spec.

Alcance: backend NestJS en `backend-pet-tracker/`, módulos `pets` y `health`.
Exactamente los NUEVE archivos de design.md §Archivos afectados. Cero archivos bajo
`mobile-pet-tracker/`, `infra/` o `src/modules/activity/`. Cero dependencias nuevas.

- R1: `GetPetUseCase.execute(petId, now)`; `PetRepository.findOwnerTimezone(petId)`
  (interface + implementación Drizzle: primer owner activo por `created_at asc`,
  columna cruda, `null` sin owner); día civil con `localDayOf(now.getTime(), zona)`
  de `src/pipeline/local-day.ts`; el controller `detail` construye UN solo
  `new Date()` para `execute` y `toPetProfileResponse`.
- R2: zona `null` o no IANA (`isSupportedTimeZone`) → `'UTC'` + un `Logger.warn`
  con `{ petId, timezone }`; nunca `InvalidTimeZoneError`, nunca 5xx.
- R3-R5: `gte` en `pet-vaccine.drizzle-reader.ts`, rename `after` → `from` en el
  puerto y su implementación (solo esos dos archivos), `seedUser(label, timezone =
  'UTC')` en `test/health-vaccines.e2e-spec.ts`, describe nuevo con los tres `it`
  (par Kiritimati/Pago_Pago, family en otra zona, owner con `'Not/A/Zone'`).
  `today` se calcula UNA vez antes de sembrar.
- R6: verificación — contrato `nextVaccine` y claves del perfil intactos,
  `test/pets.e2e-spec.ts` y `list-pets.use-case.spec.ts` sin tocar,
  `git diff --name-only 7f298f2...HEAD -- backend-pet-tracker/` = los nueve archivos.
- R7: dos mutaciones NO versionadas, una a la vez, sobre el árbol verde: M1 `gte→gt`
  (rojo por aserción en R3/R4/R5) y M2 `findOwnerTimezone` devolviendo `null` sin
  consultar (unitarios siguen verdes; e2e R3 rojo en al menos una zona; R5 verde).
  Bloques `Expected/Received` al reporte, `git checkout -- <archivo>` después.

Reglas críticas:

- TDD por requisito, commits test-primero: los SIETE commits de design.md D11 en ese
  orden, cada test rojo commiteado ANTES de su verde y nombrando su R-id. Un solo
  commit con todo incumple C4 de CHECKPOINTS.md. Los rojos de R1-R5 deben serlo por
  aserción o por firma de producción que el propio requisito crea (spec R1 lo detalla),
  nunca por `ReferenceError` de un helper de test.
- Tests heredados que cambian: reescribe, no borres. `get-pet.use-case.spec.ts`
  describe R13 de #14 → describe R1 de #82; seis llamadas del spec pasan `NOW`;
  `pets.controller.spec.ts:204` → `expect.any(Date)`. Todo listado en traceability.
- Regla dura de tasks.md: si para poner verde hace falta tocar un archivo fuera de
  los nueve, o el rename de `from` obliga a un tercer archivo, PARA y repórtalo.
- Postgres compartido: antes de CADA e2e o init.sh, `pgrep -af 'init\.sh'` y
  `pgrep -af 'test:e2e'` deben salir vacíos (ignora tu propio pgrep de 0 s). Otro
  Codex corre init.sh en `/home/claude/sites/Pet-Tracker` para #87: si hay algo vivo,
  espera, no lo mates. Un e2e rojo con filas que no existen o conteos a cero es
  contención, no bug: repite una vez limpia antes de concluir.
- `FORCE_COLOR` rompe `init.sh` (bug #75): siempre `env -u FORCE_COLOR bash ./init.sh`.
- T0: verifica con el Node que usa `init.sh` que `Intl.supportedValuesOf('timeZone')`
  incluye `Pacific/Kiritimati` y `Pacific/Pago_Pago` y que
  `localDayOf(Date.parse('2026-08-10T03:00:00.000Z'), 'America/Mexico_City')` da
  `2026-08-09`. Anótalo en el reporte.
- Convenciones de `docs/conventions.md` y capas de `docs/architecture.md`
  (puerto en domain, Drizzle en infrastructure). Lint y formato limpios.
- `feature_list.json`: no lo toques. Si por algún motivo hubiera que editarlo, por
  línea, nunca reescribiendo el JSON entero.
- Al final: `git push -u origin feature/82-vaccine-due-today-inclusive`. NO abras PR:
  lo abre el leader tras el veredicto del reviewer.
- No crear recursos AWS reales ni correr `cdk deploy`.

Criterios de aceptación: R1-R7 de `requirements.md`. R1-R5 con test que nombra su
R-id; R6 y R7 son de verificación y cierran con evidencia en el reporte.

Al terminar: `env -u FORCE_COLOR bash ./init.sh` exit 0 sin el aviso «se saltan los
e2e», push, y resultado en `progress/impl_vaccine-due-today-inclusive.md` con las
secciones `## T0`, `## Rojo/verde por commit`, `## Regresión (R6)` y `## Mutación (R7)`.
