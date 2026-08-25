# Handoff a Codex CLI — feature #49 media-docs-api

Copia el bloque siguiente como prompt de Codex CLI (terminal aparte, working
tree en branch `feature/49-media-docs-api`, ya pusheado).

```
Feature: media-docs-api (#49), branch: feature/49-media-docs-api (ya existe, haz pull)
Spec aprobada: specs/media-docs-api/requirements.md (status: approved)
Lee también: specs/media-docs-api/design.md (D1-D7) y tasks.md — el contrato
del GET ya está consumido por el móvil y NO se renegocia: array JSON plano
con {id, type, name, date} obligatorios (design.md §D1 campo a campo).

Archivos a crear/modificar (R4 fija este diff como el ÚNICO permitido):
  - backend-pet-tracker/src/modules/media/  (domain/application/infrastructure nuevos, media.module.ts)
  - backend-pet-tracker/src/db/schema/media.schema.ts (nuevo, + spec opcional)
  - backend-pet-tracker/src/db/schema/index.ts (re-export de una línea)
  - backend-pet-tracker/src/db/migrations/ (generada con pnpm run db:generate)
  - backend-pet-tracker/test/media-docs.e2e-spec.ts (nuevo)
  - specs/media-docs-api/traceability.md (tras cada commit)
Prohibido tocar: MediaController existente (photo-upload-url), PetPhotoReadModule,
src/aws/, mobile-pet-tracker/, y CUALQUIER test existente (R4: cero
modificaciones, solo archivos nuevos).

Reglas críticas:
  - Arquitectura docs/architecture.md y convenciones docs/conventions.md
    (kebab-case con sufijos, alias @/..., DTOs zod, errores de dominio tipados)
  - TDD por requisito: test rojo que nombra su R-id → verde → refactor
    (orden en specs/media-docs-api/tasks.md)
  - UN COMMIT POR REQUISITO como mínimo, test rojo commiteado ANTES que su
    implementación — commits test-primero explícitos; un único commit con
    todo incumple C4 de CHECKPOINTS.md
  - Formato de commit: tipo(media-docs-api): <desc> (R<n>)
  - Actualizar specs/media-docs-api/traceability.md tras cada commit
    (archivo::nombre de test + par de hashes rojo→verde)
  - e2e requieren docker compose up -d (Postgres + LocalStack), como el resto
  - No crear recursos AWS reales ni correr cdk deploy: todo contra LocalStack
    (S3_CLIENT ya inyectado, bucket pet-tracker-media-local ya provisionado)
  - Sin variables de entorno nuevas

Criterios de aceptación: R1 (GET listado, 404 no-miembro vía PetAccessGuard,
orden date desc + id desc), R2 (POST 201 owner-only con uploadUrl prefirmada
600s, fila persistida al emitir, auditoría pet.document_add, 400/403/404),
R3 (e2e POST → PUT bytes a LocalStack → GET con el mismo documento y objeto
legible bajo la key), R4 (lint + test + test:e2e + ./init.sh exit 0, suites
existentes intactas, diff contenido).

Al terminar: escribir resultado en progress/impl_media-docs-api.md
(qué R-ids cerraste, comandos ejecutados y su exit, desviaciones de la spec
si las hubo) y push del branch. No abras PR — eso viene tras la review.
```
