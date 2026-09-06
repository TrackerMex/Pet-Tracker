# review: pets-list-response-enrichment (#66)
Fecha: 2026-09-06 21:15 UTC
Branch: `feature/66-pets-list-response-enrichment` — HEAD `f6cb5a5`
Implementado por: Codex CLI (reporte `progress/impl_pets-list-response-enrichment.md`)
Veredicto: **APROBADO**

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` en `feature_list.json` (#66; 60 done, 10 pending, 1 spec_ready)
- [x] `progress/current.md` describe la sesión activa (bloque "#66 pets-list-response-enrichment", inicio y fin de Codex con recuentos)
- [x] `progress/history.md` existe con entradas de sesiones cerradas (no aplica cierre aún: #66 sigue `in_progress` hasta este veredicto)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure — `domain/ports/pet-photo-url-resolver.ts` es `Symbol` + interfaz pura, sin cambios
- [x] repositories/contratos en domain son interfaces puras — `PetRepository`/`PetWithRole` intactos (R4)
- [x] application depende de interfaces, no implementaciones — `list-pets.use-case.ts:2-9` importa solo `@/modules/pets/domain/ports/...`, `@/modules/pets/domain/repositories/...` y `./get-pet.use-case` (misma capa, permitido por `docs/conventions.md` §Imports)
- [x] infrastructure sin lógica de negocio — `pets.controller.ts:76-77` solo propaga `photoUrl` al mapper; la condición `photoKey !== null` vive en application (`list-pets.use-case.ts:39`)
- [x] Ningún módulo tocado: `pets.module.ts:24` ya importaba `PetPhotoReadModule`; DI resuelto (e2e verde)

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra:
  - R1 → `list-pets.use-case.spec.ts:86` `describe('R1 (pets-list-response-enrichment #66): ...')`, 2 `it`
  - R2 → `pets.controller.spec.ts:130` `describe('R2 (pets-list-response-enrichment #66): ...')`, 2 `it`
  - R3 → `test/pets.e2e-spec.ts:647` `describe('R3 (pets-list-response-enrichment #66): ...')`, 1 `it`
  - R4 → `list-pets.use-case.spec.ts:153` `describe('R4 (pets-list-response-enrichment #66): ...')`, 2 `it`
- [x] Historial test-primero, verificado con `git show --stat`:
  - `56a58a1 test(...) (R1)` — solo `list-pets.use-case.spec.ts` (+1 línea de bitácora en `progress/current.md`, no código)
  - `f147e27 test(...) (R4)` — solo `list-pets.use-case.spec.ts`
  - `558b75c test(...) (R2)` — solo `pets.controller.spec.ts`
  - `9c387b2 test(...) (R3)` — solo `test/pets.e2e-spec.ts`
  - `9722580 feat(...) (R1,R4)` — `list-pets.use-case.ts` (+30/-2, forma exacta de design §D2) + edición **declarada** de los dos `it` de `R7:` de #5 (constructor con resolver stub, `toEqual(memberships.map(m => ({...m, photoUrl: null})))`) + reformateo Prettier de R1/R4 sin cambiar ninguna aserción
  - `bbed5e8 style(...) (R3)` — formateo puro del `db.update(...)` (verificado con `git show -w`: misma expresión en una línea)
  - `e93149f feat(...) (R2,R3)` — `pets.controller.ts` 3+/3-: `memberships`→`items`, destructura `photoUrl`, pasa `toPetProfileResponse(pet, role, now, null, photoUrl)`
- [x] **Rojo verificado de forma independiente** (worktree temporal en `9c387b2`, node_modules enlazado, sin código productivo):
  - `pnpm test -- list-pets.use-case pets.controller` → `Test Suites: 2 failed, 2 total · Tests: 4 failed, 19 passed, 23 total`, exit 1. Fallos por aserción: R1(a) `photoUrl` esperado vs recibido; R4(a) falta clave `photoUrl` en `Object.keys(item)`; R4(b) fuente sin `PET_PHOTO_URL_RESOLVER`; R2(a) `Expected "https://signed.example/a", Received null`
  - `pnpm exec tsc --noEmit` → exit 2: `list-pets.use-case.spec.ts(106,47) TS2554`, `(111,38) TS2339 photoUrl does not exist on PetWithRole`, `(140,47) TS2554`, `(180,47) TS2554`
  - `pnpm run test:e2e -- pets.e2e-spec` contra Postgres+LocalStack → `Test Suites: 1 failed, 1 total · Tests: 1 failed, 20 passed, 21 total`, exit 1. Fallo R3: `expect(typeof withPhoto?.photoUrl).toBe('string')` → `Expected: "string", Received: "object"` (el listado devolvía `null`)
- [x] Ningún rojo por `ReferenceError` de helper inexistente: los 5 fallos son aserciones
- [x] Tests nacidos verdes: R2(b) declarado por adelantado en `traceability.md` §Excepciones (guarda de regresión de 24 claves). R1(b) (listado vacío) nació verde en **jest** porque ts-jest transpila sin diagnósticos, pero rojo en **typecheck** (TS2554 en `:140`) que es parte de `./init.sh`; Codex lo reportó en el impl report §Discrepancia sin fabricar fallo, conforme a la regla "para y reporta" de `tasks.md`. Aceptado: el pipeline del proyecto estaba rojo en ese commit y el `it` no es de verificación (asevera comportamiento del constructor nuevo)

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" (la única aparición de la palabra es la regla, línea 18)
- [x] Cada R tiene test + archivo + commits rojo→verde con hash y mensaje (R1, R2, R3, R4)
- [x] Commits siguen `test|feat|style|docs(pets-list-response-enrichment): <desc> (R-ids)` — los 10 commits de la feature llevan R-ids

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved`
- [x] Casilla `[X] Aprobado por humano (fecha: 2026-09-05)` y OD-1/OD-2/OD-3/OD-4 marcadas; commit de firma `36d89f7` autor AlexisSM377 (humano)
- [x] Ningún requisito modificado tras la firma: `git diff 36d89f7..HEAD -- requirements.md` = solo frontmatter `draft → approved` (1 línea, commit del leader `b3a344a`)
- [x] Spec de #6 (`specs/pet-photos-s3/`) no editada, como exige el §Contexto

## Checklist C7 — Sin código huérfano
- [ ] Componentes/módulos reemplazados fueron eliminados
- [ ] Sus tests también fueron eliminados
- [x] N/A — la feature supersede la **decisión** D2 de #6 (alcance), no reemplaza ningún componente, endpoint ni use case; `ListPetsUseCase` existente se extiende, no se duplica

## Verificaciones explícitas pedidas por el leader

| Punto | Resultado |
|---|---|
| OD-1 firmar siempre | `list-pets.use-case.ts:38-44`: firma para toda mascota con `photoKey !== null`, sin `?include`, sin caché. R1(a) asevera 2 llamadas para 2 fotos de 3 mascotas |
| OD-2 TTL 3600 s compartido | `list-pets.use-case.ts:9` importa `PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS` de `./get-pet.use-case`; `grep "PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS ="` → una sola definición, `get-pet.use-case.ts:20 = 3600`. R1(a) asevera `3600`; R3 asevera `X-Amz-Expires === '3600'` |
| OD-3 `device` fuera | `pets.controller.ts:77` pasa `null` literal como 4.º argumento; use case sin `PET_DEVICE_READER`/`PET_VACCINE_READER` (guarda R4(b) `list-pets.use-case.spec.ts:198-201`) |
| R4 sin N+1 | Una sola llamada `findAllByMember` (`:32`); `Promise.all` sobre `resolveDownloadUrl` → `PetPhotoUrlResolverImpl` → `PhotoStorageS3Adapter.createDownloadUrl` = `getSignedUrl` SigV4 local (`photo-storage.s3.adapter.ts:33-39`), sin round-trip ni consulta por mascota. Ningún repositorio de device/vacuna inyectado |
| Contrato del listado | 24 claves en R2(b) (`pets.controller.spec.ts`), idénticas al `pet-profile-response.mapper.spec.ts` y a `PROFILE_KEYS` del e2e (24). Mapper y `PetProfileResponse` sin cambios. `mobile-pet-tracker/src/api/types.ts:66` ya tipa `photoUrl: string | null`; la spec (§Fuera de alcance, design §D5) lo deja explícitamente fuera y `git diff origin/main...HEAD -- mobile-pet-tracker/` está vacío |
| Deriva de código | `git diff origin/main...HEAD --stat` (origin/main `185d42b`, merge-base `e119a74`): exactamente los 5 archivos declarados en backend (`list-pets.use-case.ts`, `.spec.ts`, `pets.controller.ts`, `.spec.ts`, `test/pets.e2e-spec.ts`) + `specs/pets-list-response-enrichment/*` (4), `progress/current.md`, `progress/impl_*.md`, `progress/handoff_*.md`, `feature_list.json` (`pending → in_progress`). Los dos últimos vienen del commit del leader `b3a344a`, no de Codex. Nada en `media/`, `db/`, mapper, repositorio, `pets.module.ts` |
| Tests existentes sin editar | `pets.controller.spec.ts` y `test/pets.e2e-spec.ts`: solo adiciones vs origin/main (0 líneas borradas); R7 de #5 en el controller (`:110-128`) intacto |

## Observaciones
Ninguna bloqueante. Notas menores, sin acción requerida:
- `56a58a1` (test R1) incluye una línea de bitácora en `progress/current.md`; no es código de aplicación.
- `9722580` reformatea con Prettier tres bloques de R1/R4 escritos en el commit rojo; ninguna aserción cambia.
- Warnings preexistentes de `init.sh` ajenos a la feature: `.env` sin `RESEND_API_KEY`, `RESEND_FROM`, `RESET_LINK_HOST`; `STATUS.md` desactualizado (58/63 vs 60/72). Log `DrizzleQueryError ... insert into "pet_users"` y `cycle skipped ... ECONNREFUSED 4566` son ruido esperado de tests que provocan fallos a propósito; las suites pasaron.
- Recuentos vs base declarada por Codex antes de implementar: unitarios backend 1237 → 1243 (+6 = R1×2, R4×2, R2×2), e2e 353 → 354 (+1 = R3), móvil 891 → 891. Coherente.

## Output de ./init.sh
Ejecutado por el reviewer desde `/home/claude/sites/Pet-Tracker` (HEAD `f6cb5a5`), 2026-09-06 21:08:26Z → 21:13:21Z, tras confirmar con `pgrep -af 'bash ./init.sh'` que no había otro en marcha. Log completo en el scratchpad de la sesión.

```
✅ Build exitoso                        (backend build + infra synth)
Backend unit:  Test Suites: 163 passed, 163 total · Tests: 1243 passed, 1243 total
Infra:         Test Suites: 2 passed, 2 total     · Tests: 14 passed, 14 total
Harness env-drift (node --test): 28 pass, 0 fail
Mobile (bun/jest-expo): Test Suites: 59 passed, 59 total · Tests: 891 passed, 891 total · Snapshots: 1 passed
✅ Tests pasados
E2E:           Test Suites: 3 skipped, 25 passed, 25 of 28 total · Tests: 8 skipped, 354 passed, 362 total
✅ Tests e2e pasados                   (3 suites / 8 tests omitidos por gates preexistentes, p. ej. aws-real-*)
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
init exit: 0
```
