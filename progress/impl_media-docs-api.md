---
feature: "media-docs-api"
issue: 49
branch: "feature/49-media-docs-api"
date: 2026-08-25
status: implementation_complete
---

# Implementación — media-docs-api (#49)

## Resultado

- **R1 cerrado:** `GET /v1/pets/:petId/media` devuelve el array JSON plano
  consumido por móvil, con `{id, type, name, date, vet, key}`, orden
  `date DESC, id DESC`, `[]` sin filas y acceso para cualquier membresía
  activa. No-miembro, mascota inexistente e id malformado conservan el 404
  opaco de `PetAccessGuard`.
- **R2 cerrado:** `POST /v1/pets/:petId/media` es owner-only, valida con Zod,
  genera UUIDv7 y `pets/<petId>/docs/<id>`, persiste `pet_documents`, firma el
  PUT por 600 s con `PHOTO_STORAGE` y registra `pet.document_add` tras éxito.
  Los caminos 400/403/404 no crean documentos; 400/404 tampoco auditan.
- **R3 cerrado:** el e2e real completa POST → PUT de bytes sin
  `Authorization` → GET y verifica con `S3_CLIENT` que el objeto es legible
  bajo la misma key en el bucket aislado de tests de LocalStack.
- **R4 cerrado:** build, lint, unitarios, e2e, `init.sh` y contención del diff
  quedaron verdes. La feature se mantiene `in_progress` hasta la review; no
  se abrió PR, según el handoff.

## TDD y commits

| R-id | Rojo | Verde / verificación |
|---|---|---|
| R1 | `033286a` — unitario sin use case y e2e sin schema fallaron | `0c9c06a` — listado por capas, migración y contrato HTTP verdes |
| R2 | `5380036` — DTO/key/use case ausentes y POST 404 | `efa0864` — DTO, persistencia, firma, auditoría y POST verdes |
| R3 | Baseline compartido `5380036` — el POST requerido aún devolvía 404 | `2a4b356` — test específico verde en primera ejecución sobre R1+R2 |
| R4 | N/A: requisito de regresión/contención | Verificación completa documentada en este archivo |

Los pares y nombres exactos de test están en
`specs/media-docs-api/traceability.md`.

## Comandos ejecutados

| Comando | Exit | Resultado relevante |
|---|---:|---|
| `git pull --ff-only` | 0 | Rama remota ya actualizada |
| `./init.sh` (baseline) | 0 | Todo verde antes de modificar código |
| `docker compose up -d` | 0 | Postgres y LocalStack running |
| `pnpm exec jest --runInBand src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts` (rojo R1) | 1 esperado | Use case inexistente |
| `pnpm exec jest --config ./test/jest-e2e.json --runInBand test/media-docs.e2e-spec.ts` (rojo R1) | 1 esperado | Schema inexistente |
| `pnpm run db:generate` (en backend) | 0 | Generó `0014_late_lord_tyger.sql` + snapshot/journal |
| `pnpm run build` (en backend, tras R1 y R2) | 0 | Build Nest/TypeScript verde en ambas corridas |
| `pnpm exec jest --runInBand src/modules/media` (tras R1) | 0 | 5 suites, 15 tests |
| `pnpm exec jest --config ./test/jest-e2e.json --runInBand test/media-docs.e2e-spec.ts` (tras R1) | 0 | 1 suite, 4 tests |
| Unitarios R2 dirigidos (DTO + key + use case), rojo | 1 esperado | Tres módulos todavía ausentes |
| E2E media-docs R2, rojo | 1 esperado | 201/400/403 esperados recibían 404 |
| Unitarios R2 dirigidos, verde | 0 | 3 suites, 11 tests |
| `pnpm exec jest --runInBand src/modules/media` (tras R2) | 0 | 8 suites, 26 tests |
| E2E media-docs tras R2 | 0 | 1 suite, 8 tests |
| E2E media-docs con R3 | 0 | 1 suite, 9 tests |
| `pnpm -C backend-pet-tracker run lint` | 0 | Sin errores ni reescrituras |
| `pnpm -C backend-pet-tracker test` | 0 | 149 suites, 1126 tests |
| `pnpm -C backend-pet-tracker run test:e2e` | 0 | 21 suites pass de 23; 336 pass, 6 skips condicionados existentes |
| `./init.sh` (final) | 0 | Build, backend, infra, móvil, e2e, lint y typecheck verdes |
| Contención con `git diff --name-only main...HEAD` y allowlist R4 | 0, salida vacía | Ninguna ruta fuera del alcance permitido |
| Diff de archivos prohibidos contra `62c39d3` | 0, salida vacía | MediaController, PetPhotoReadModule, `src/aws/` y móvil intactos |

La migración generada se aplicó solo al Postgres local mediante `psql` para
ejecutar las e2e; no se creó ni desplegó ningún recurso AWS real.

## Contención y regresión

- `src/db/schema/index.ts` tiene exactamente un cambio: el re-export de
  `./media.schema`.
- Los specs unitarios y `test/media-docs.e2e-spec.ts` son archivos nuevos;
  ningún test preexistente fue modificado.
- `MediaController` de `photo-upload-url`, `PetPhotoReadModule`, el adapter S3
  existente, `src/aws/` y `mobile-pet-tracker/` conservan diff cero.
- No se añadieron variables de entorno, `console.log`, TODOs ni FIXMEs.
- El comando literal de la spec basado en `git diff --stat | grep -v` imprime
  rutas abreviadas con `.../` y la línea resumen en esta terminal. Se usó el
  equivalente preservando rutas, `git diff --name-only ...` + allowlist, que
  terminó 0 con salida vacía tanto contra `main` como contra el inicio de la
  sesión.

## Desviaciones / notas

1. **R3 quedó verde en su primera ejecución específica.** No se fabricó un
   fallo artificial: `tasks.md` anticipa expresamente que normalmente ya está
   verde tras R1+R2. El baseline rojo compartido y el commit del test específico
   quedan explícitos en trazabilidad.
2. La spec usa los nombres conceptuales `caregiver`/`viewer`; el modelo vigente
   de `pet_users` usa `family`/`vet`. Los e2e nombran la equivalencia y prueban
   ambos, mientras el GET permite cualquier rol activo y el POST exige `owner`.
3. `init.sh` avisa que `STATUS.md` declara 43/50 frente a 43/51 real. La deriva
   ya existía al iniciar y `STATUS.md` está fuera del diff R4, por lo que se
   preservó; el script final igualmente terminó con exit 0.

No hubo desviaciones funcionales del contrato D1–D7.
