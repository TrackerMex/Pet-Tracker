---
feature: "media-docs-api"
issue: 49
branch: "feature/49-media-docs-api"
head: efe585e
date: 2026-08-25
reviewer: claude-reviewer
---

# review: media-docs-api
Fecha: 2026-08-25 (UTC)
Veredicto: APROBADO

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`#49 media-docs-api` en `feature_list.json`)
- [x] `progress/current.md` describe la sesión activa (incluye nota de colisión de sesiones A/B)
- [x] `progress/history.md` con entradas de sesiones cerradas (#40, #50)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (`pet-document.entity.ts` sin imports; `document-key.ts` función pura; `pet-document.repository.ts` solo importa la entity)
- [x] `PetDocumentRepository` es interfaz pura con token `PET_DOCUMENT_REPOSITORY` (Symbol)
- [x] application depende de interfaces vía `@Inject(PET_DOCUMENT_REPOSITORY)` / `PHOTO_STORAGE` / `AUDIT_LOGGER`, nunca de implementaciones
- [x] infrastructure implementa (`PetDocumentDrizzleRepository implements PetDocumentRepository`); controller y mapper sin lógica de negocio

## Checklist C4 — TDD
- [x] Cada R<n> tiene tests que lo nombran (verificado con grep sobre los specs y lectura del e2e):
  - R1: `list-pet-documents.use-case.spec.ts` + describe `R1:` en `test/media-docs.e2e-spec.ts`
  - R2: `create-pet-document.dto.spec.ts`, `document-key.spec.ts`, `create-pet-document.use-case.spec.ts` + describe `R2:` e2e
  - R3: describe `R3: flujo end-to-end POST → PUT → GET contra LocalStack` e2e
  - R4: requisito de regresión/contención, verificado por comandos (abajo)
- [x] Historial test-primero verificado commit a commit (`git show --name-status` y `git ls-tree` en cada commit rojo):
  - `033286a` (R1 rojo) añade SOLO 2 specs; en ese commit no existen use case, schema ni controller (ls-tree vacío para ellos)
  - `0c9c06a` (R1 verde) añade la implementación completa por capas + migración
  - `5380036` (R2 rojo) añade SOLO 3 specs + casos e2e; dto/document-key/use case no existen en ese commit (ls-tree vacío)
  - `efa0864` (R2 verde) añade dto, key, use case, repo.create, @Post
  - `2a4b356` (R3) toca solo el e2e; verde en primera ejecución — desviación legítima, `tasks.md` R3(2) lo anticipa expresamente ("normalmente ya verde tras R1+R2") y quedó documentado en trazabilidad
  - `5631d30` (R4) solo `progress/impl_media-docs-api.md`

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" (4 filas R1–R4 completas)
- [x] Tests citados existen con los nombres EXACTOS de los describe (verificados contra el código)
- [x] Hashes válidos y presentes en la branch (033286a, 0c9c06a, 5380036, efa0864, 2a4b356, 5631d30, todos entre 62c39d3 y efe585e)
- [x] Commits siguen `tipo(media-docs-api): <desc> (R<n>)`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` y casilla humana marcada (fecha 2026-08-25)
- [x] Aprobación humana en `338c035` (autor AlexisSM377, commit propio del humano, SOLO marca la casilla) — ANTERIOR al primer commit de implementación (033286a)
- [x] `git diff 338c035..HEAD -- specs/media-docs-api/requirements.md` toca EXACTAMENTE una línea: `status: draft` → `status: approved` (corrección de frontmatter del leader en 9e84b17, previa al handoff 62c39d3). Ningún requisito modificado tras la aprobación.

## Checklist C7 — Sin código huérfano
- [ ] N/A — esta feature extiende el módulo media, no reemplaza nada. `MediaController` (photo-upload-url), `PetPhotoReadModule`, `photo-storage.s3.adapter.ts` y `src/aws/` con diff CERO contra main.

## C8 — N/A (feature 100% backend)
- `git diff main HEAD -- mobile-pet-tracker/` = 0 bytes. Cero archivos móviles en el diff.

## R4 — Contención del diff (verificación propia)
- `git diff --name-only main...HEAD`: 29 archivos, TODOS dentro del allowlist
  (`src/modules/media/`, `src/db/schema/media.schema.ts`, re-export de 1 línea
  en `src/db/schema/index.ts`, `src/db/migrations/` ×3, `test/media-docs.e2e-spec.ts`,
  `specs/`, `progress/`, `feature_list.json`). Cero tests existentes modificados.
- El comando literal de la spec (`git diff --stat | grep -v ...`) imprime líneas
  residuales SOLO porque `--stat` trunca rutas largas con `.../` — todas son
  archivos de `modules/media`. El equivalente con `--name-only` + allowlist da vacío.
  Coincide con lo que reportó el implementer.

## Contrato móvil (D1)
- `mobile-pet-tracker/src/api/media.ts::listPetDocs` exige: 200 con array JSON
  en la raíz, cada elemento `{id, type, name, date}` strings (`isPetDocument`),
  extras tolerados. `PetMediaController.list()` devuelve `PetDocumentResponse[]`
  plano con `{id, type, name, date, vet, key}`; `date` es pg `date` leído como
  string `YYYY-MM-DD` (asertado con regex en el e2e R1). Cumple tal cual.

## Verificación independiente
- `./init.sh` — **run 1: exit 1** por 1 test móvil flaky (`src/screens/add-pet/index.test.tsx`,
  "R7: foto opcional tras alta" — mock de `launchImageLibraryAsync` devolvió undefined).
  NO atribuible a esta feature: el árbol móvil es byte-idéntico a main y la suite
  pasa 5/5 en aislamiento. **Run 2: exit 0, todo verde** (output abajo).
- Re-ejecución dirigida de las suites e2e de media (regresión R4):
  `jest --config ./test/jest-e2e.json --runInBand test/media-docs.e2e-spec.ts test/media.e2e-spec.ts`
  → **2 suites, 21 tests, todos verdes** (9 nuevos + 12 de la suite existente intacta).

## Observaciones
Ninguna bloqueante. Para el leader (fuera del alcance de #49):
1. **Test flaky preexistente**: `mobile-pet-tracker/src/screens/add-pet/index.test.tsx`
   ("R7: foto opcional tras alta") falla intermitentemente en la suite completa
   (mock de expo-image-picker devuelve undefined); pasa 5/5 en aislamiento.
   Registrarlo — puede tumbar cualquier init.sh futuro sin relación con la feature en curso.
2. `init.sh` avisa STATUS.md desactualizado (43/50 vs 43/51) — deriva preexistente,
   corregir al cierre de sesión como indica el propio script.

## Output de ./init.sh (run 2, exit 0 — resumen)
```
✅ Dependencias instaladas
⚠️  Feature en progreso: media-docs-api
⚠️  STATUS.md desactualizado (43/50 declarado vs 43/51 real)
✅ Build exitoso
→ Ejecutando tests...
  backend: Test Suites: 149 passed, 149 total / Tests: 1126 passed
  infra:   Test Suites: 2 passed, 2 total / Tests: 14 passed
  móvil:   Test Suites: 47 passed, 47 total / Tests: 532 passed
✅ Tests pasados
→ Tests e2e...
  Test Suites: 2 skipped, 21 passed, 21 of 23 total
  Tests:       6 skipped, 336 passed, 342 total   (skips condicionados preexistentes)
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
