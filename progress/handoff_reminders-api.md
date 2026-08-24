# Handoff a Codex CLI — feature #47 reminders-api

Feature: reminders-api (#47), branch: `feature/47-reminders-api` (ya existe, parte de ahí; NO trabajes en main)
Spec aprobada: `specs/reminders-api/requirements.md` (status: approved)
Lee también: `specs/reminders-api/design.md` y `tasks.md`

Alcance: backend NestJS en `backend-pet-tracker/`, módulo `reminders`:

- `GET /pets/:petId/reminders` — listado ordenado por `dueAt` asc, todos
  los status, tras `PetAccessGuard`, sin exigir rol (R1)
- `DELETE /pets/:petId/reminders/:id` — 204, solo rol `owner` (403 si no),
  404 si no existe o no es del pet (R2)
- Regresión: los endpoints existentes del módulo no cambian (R3)

Reglas críticas:

- Clean Architecture de `docs/architecture.md`: use case + puerto en
  domain/application, repo Drizzle en infrastructure, tokens Symbol
  (patrón exacto del módulo `vaccines` que cita design.md)
- Convenciones de `docs/conventions.md`: kebab-case, zod para DTOs,
  errores de dominio tipados mapeados en el controller, alias `@/…`
- TDD por requisito: COMMIT del test rojo ANTES del verde por cada R-id
  (C1–C7 de CHECKPOINTS.md; un solo commit con todo incumple C4)
- Actualizar `specs/reminders-api/traceability.md` tras cada commit
- Cero dependencias nuevas. NO tocar `mobile-pet-tracker/`, `infra/`,
  ni otros módulos del backend más allá de lo que R3 exige verificar
- No crear recursos AWS reales ni correr `cdk deploy`

Criterios de aceptación: R1–R3 de `requirements.md`, cada uno con test
que nombra su R-id (unitarios de use case + e2e si LocalStack responde;
si no, documenta el skip).

Al terminar: `./init.sh` exit 0 y escribir el resultado en
`progress/impl_reminders-api.md`.
