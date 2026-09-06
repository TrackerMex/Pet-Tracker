# Handoff a Codex CLI — feature #66 pets-list-response-enrichment

Feature: pets-list-response-enrichment (#66), branch: `feature/66-pets-list-response-enrichment` (ya existe y está sincronizada con `main`; parte de ahí, NO trabajes en `main`)
Spec aprobada: `specs/pets-list-response-enrichment/requirements.md` (status: approved, firmada el 2026-09-05 con OD-1..OD-4 confirmadas)
Lee también: `specs/pets-list-response-enrichment/design.md` y `tasks.md`

Alcance: backend NestJS en `backend-pet-tracker/`, módulo `pets`. `GET /v1/pets`
devuelve hoy `photoUrl: null` para todas las mascotas; tiene que devolver la
URL prefirmada de S3 de cada mascota con `photoKey`, sin una llamada por
mascota desde el cliente:

- R1: `ListPetsUseCase.execute(userId)` resuelve `photoUrl` por item vía el
  puerto `PET_PHOTO_URL_RESOLVER` ya existente, reutilizando la constante
  `PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS` importada de `get-pet.use-case.ts`
  (no la dupliques ni la muevas, D3). Mascota sin `photoKey` ⇒ `photoUrl: null`.
- R2: el contrato HTTP de `GET /v1/pets` no cambia de forma: el mapper
  `pet-profile-response.mapper.ts` no se toca; el controller pasa el
  `photoUrl` resuelto.
- R3: e2e contra LocalStack: usuario con membresía activa y mascota con foto
  recibe `photoUrl` firmada en el listado; mascota sin foto recibe `null`.
- R4: `device` NO se enriquece en el listado (OD-3): guarda de fuente que
  congela que `ListPetsUseCase` no llama a `findActiveDevice`.

Archivos a crear/modificar (detalle y líneas en `design.md` §Archivos afectados):

- `src/modules/pets/application/use-cases/list-pets.use-case.ts` (inyecta el resolver)
- `src/modules/pets/infrastructure/pets.controller.ts` (`list()` pasa `photoUrl`)
- `src/modules/pets/application/use-cases/list-pets.use-case.spec.ts` (R1, R4; los dos `it` del describe `R7:` de #5 en `:33-63` se editan de forma mínima, tal como `design.md` declara)
- `src/modules/pets/infrastructure/pets.controller.spec.ts` (R2, describe nuevo; `:110-128` NO se edita)
- `test/pets.e2e-spec.ts` (R3, describe nuevo; los existentes no se tocan)
- `specs/pets-list-response-enrichment/traceability.md` (tras cada commit)

NO tocar: `pet-profile-response.mapper.ts`, `get-pet.use-case.ts`,
`pet.repository.ts`, `src/modules/media/**`, `pets.module.ts` (la inyección ya
resuelve), ni nada bajo `mobile-pet-tracker/` (el cliente ya tipa
`photoUrl: string | null` y ya lo renderiza; `git diff` vacío ahí es criterio
de aceptación).

Reglas críticas:

- Clean Architecture de `docs/architecture.md` y convenciones de
  `docs/conventions.md` (alias `@/…`, tokens Symbol, errores tipados).
- TDD por requisito: COMMIT del test rojo ANTES del verde por cada R-id
  (C1–C7 de `CHECKPOINTS.md`; un solo commit con todo incumple C4). Mínimo
  8 commits: rojo y verde por R1..R4. Cada test nombra su R-id en el
  `describe`: `R1 (pets-list-response-enrichment #66): …`.
- Cero dependencias nuevas. No crear recursos AWS reales ni correr `cdk deploy`.
- Antes de lanzar `./init.sh` comprueba que no hay otro corriendo desde otro
  worktree: `for p in $(pgrep -f 'bash ./init.sh'); do echo "$p $(readlink /proc/$p/cwd)"; done`.
  Los e2e de todos los worktrees comparten el mismo Postgres y dos corridas
  a la vez dan rojos falsos (`insert into "pet_users"` fallando, conteos a
  cero). Si lo ves, espera y repite una sola corrida limpia.
- Tras tocar código: `graphify update .` desde la raíz del repo.

Criterios de aceptación: R1–R4 de `requirements.md`, cada uno con test que
nombra su R-id (unitarios de use case y controller; e2e R3 si LocalStack
responde, si no documenta el skip con el motivo).

Al terminar: `./init.sh` exit 0 y escribir el resultado en
`progress/impl_pets-list-response-enrichment.md` (archivos tocados, commits
en orden rojo→verde, salida decisiva de los tests, lo que quedó fuera).
