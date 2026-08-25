---
feature: "media-docs-api"
status: draft        # draft | approved
tags: [harness, spec, backend]
---

# Tareas — [[media-docs-api]]

> Disciplina TDD (C4): test ROJO commiteado antes de la implementación de
> cada requisito; nunca test + implementación + docs en un solo commit.
> Esta feature DESBLOQUEA el smoke de la pantalla Docs de #40
> (mobile-pets-profile): debe quedar `done` (reviewer aprobado + merge)
> antes de ese smoke.

## R1 — GET /pets/:petId/media (listado por capas)

- [ ] (1) Escribir test que falla para R1 (list-pet-documents.use-case.spec.ts + casos e2e en media-docs.e2e-spec.ts)
- [ ] (2) Implementación mínima que lo pasa (schema pet_documents + migración, entity, repo domain+drizzle, use case, PetMediaController @Get, mapper, module)
- [ ] (3) Refactor con tests verdes

## R2 — POST /pets/:petId/media (persistencia + URL prefirmada)

- [ ] (1) Escribir test que falla para R2 (create-pet-document.dto.spec.ts, document-key.spec.ts, create-pet-document.use-case.spec.ts + casos e2e)
- [ ] (2) Implementación mínima que lo pasa (dto zod, buildDocumentKey, create en repo, use case con audit, @Post 201, module)
- [ ] (3) Refactor con tests verdes

## R3 — Flujo end-to-end POST → PUT → GET contra LocalStack

- [ ] (1) Escribir test que falla para R3 (caso e2e de flujo completo con PUT crudo sin token)
- [ ] (2) Implementación mínima que lo pasa (normalmente ya verde tras R1+R2; corregir lo que falte)
- [ ] (3) Refactor con tests verdes

## R4 — Regresión y contención

- [ ] (1) Ejecutar lint, test, test:e2e y ./init.sh
- [ ] (2) Corregir lo que falle sin tocar fuera del alcance (cero cambios a tests existentes; photo-upload-url intacto)
- [ ] (3) Anotar resultados en progress/impl_media-docs-api.md
