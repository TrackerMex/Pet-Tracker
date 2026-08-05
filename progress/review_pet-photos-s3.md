# review: pet-photos-s3
Fecha: 2026-08-05T11:00:00Z
Veredicto: APROBADO CONDICIONAL — sujeto a decisión humana explícita sobre R8 (ver abajo)

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: pet-photos-s3 id 6, único `in_progress`)
- [x] progress/current.md actualizado (sesión activa describe feature 6, spec approved, D1/D2/D3 resueltos)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure — `media/domain/photo-key.ts` y `media/domain/ports/photo-storage.ts` no importan `@nestjs/*` ni `@aws-sdk/*`
- [x] repositories/contratos en domain son interfaces puras — `PhotoStorage` (media) y `PetPhotoUrlResolver` (pets/domain/ports) son interfaces sin implementación
- [x] application depende de interfaces, no implementaciones — `RequestPhotoUploadUrlUseCase` inyecta `PET_REPOSITORY`, `PHOTO_STORAGE`, `AUDIT_LOGGER` por token; `GetPetUseCase` inyecta `PET_PHOTO_URL_RESOLVER`
- [x] infrastructure sin lógica de negocio — `photo-storage.s3.adapter.ts` solo firma (`PutObjectCommand`/`GetObjectCommand` + `getSignedUrl`); `media.controller.ts` solo valida body y delega
- Nota adicional: `PetPhotoReadModule` replica correctamente el mecanismo anti-ciclo de `PetDeviceReadModule` (no importa `PetsModule` ni `MediaModule`, solo `S3_CLIENT` `@Global`), evitando el ciclo `MediaModule → PetsModule → PetPhotoReadModule`

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra explícitamente — verificado en código real, no solo en el reporte:
  - R1: `photo-key.spec.ts`, `request-photo-upload-url.use-case.spec.ts`, `media.e2e-spec.ts`
  - R2: `request-photo-upload-url.dto.spec.ts`, `media.e2e-spec.ts`
  - R3, R4: `media.e2e-spec.ts`
  - R5: `request-photo-upload-url.use-case.spec.ts`, `media.e2e-spec.ts`
  - R6: `get-pet.use-case.spec.ts`, `pet-profile-response.mapper.spec.ts`, `pets.controller.spec.ts`
  - R7: `get-pet.use-case.spec.ts`
  - R8: `media.e2e-spec.ts` (nombrado, en rojo — ver hallazgo)
  - R9: `media.e2e-spec.ts`
- [x] Historial de commits muestra test-primero: `801e3cf` (key builder R1) → `656b4cd` (validación R1,R2) → `d3295cb` (use case R1,R2,R5) → `919a844` (adapter/endpoint/wiring R1,R3,R4, incluye el fix de 200) → `4aed47a` (photoUrl en detalle R6,R7) → `066d67f` (e2e). Progresión incremental por requisito, no un commit monolítico.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" — las 9 filas (R1-R9) tienen test + commit; la fila R8 documenta el hallazgo en vez de mentir sobre un passing falso
- [x] Cada requisito tiene su test y su commit registrados y verificados contra el código real
- [x] Commits siguen el formato `feat(<scope>): <desc> (R-ids)` — confirmado con `git log`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` en frontmatter
- [x] Casilla "Aprobado por humano" marcada con fecha (2026-08-05), D1 ('owner'), D2 (solo detalle), D3 (sin Content-Type en la firma) resueltos explícitamente

## Checklist C7 — Sin código huérfano
- [ ] N/A — esta feature no reemplaza nada existente (extiende `GetPetUseCase` y el mapper agregando un parámetro con default `null`, mismo patrón que `device` en #7; ningún módulo/endpoint anterior fue reemplazado ni eliminado)

## Verificación puntual adicional

- **Status code POST /v1/pets/:petId/photo-upload-url**: confirmado `200`, no el `201` default de Nest. `media.controller.ts` usa `@HttpCode(HttpStatus.OK)` explícito (línea 39), con comentario justificándolo. El e2e `R1` (`test/media.e2e-spec.ts`) hace `.expect(200)` y pasó en la corrida independiente.

## Hallazgo R8 — pronunciamiento explícito

Reproduje el e2e yo mismo (`pnpm run test:e2e -- media.e2e-spec.ts` contra los contenedores reales `pet-tracker-localstack` y `pet-tracker-postgres`, ambos healthy):

```
Tests: 1 failed, 10 passed, 11 total
● R8: el bucket nunca es publico — GET directo sin firma responde 403
  Expected: 403
  Received: 200
```

Coincide exactamente con lo reportado por el implementer. Evaluación:

1. **No es un defecto de código.** `PHOTO_STORAGE` (`media/domain/ports/photo-storage.ts`) es el único puerto de acceso al bucket y expone exclusivamente `createUploadUrl`/`createDownloadUrl`, ambos firmados vía `getSignedUrl`. No existe ninguna ruta en el código de esta feature que emita una URL sin firmar. `photo-storage.s3.adapter.ts` no tiene lógica condicional que pudiera saltarse la firma.
2. **La causa es una limitación real de LocalStack Community**, no una mala verificación del test. Confirmé el precedente citado: `test/localstack-provisioning.e2e-spec.ts` R13 (línea 233-244) efectivamente solo llama `GetPublicAccessBlockCommand` y verifica los 4 flags en `true` — es decir, ya existe un precedente aceptado en este repo de verificar la configuración de bloqueo público en vez de su efecto en el plano de datos, precisamente porque LocalStack Community no aplica ese enforcement (es funcionalidad Pro).
3. El implementer investigó más allá de lo mínimo: probó una bucket policy `Deny` explícita sobre un bucket descartable aparte y `S3_SKIP_SIGNATURE_VALIDATION=0` en un contenedor aislado — ambos con el mismo resultado (200). Esto descarta que sea un error de configuración del bucket de la feature.
4. El test **no se debilitó** para pasar falsamente: quedó escrito literalmente como pide R8 (`expect(response.status).toBe(403)`), en rojo, con el hallazgo documentado tanto en el código (comentario extenso en `media.e2e-spec.ts` líneas 275-294) como en `traceability.md` y en `progress/impl_pet-photos-s3.md`.

**Conclusión del reviewer**: esto es una limitación de entorno aceptable, no un defecto real de la feature — bajo la condición de que la garantía de "nunca URL sin firmar" ya está satisfecha a nivel de código/arquitectura (único puerto, siempre firmado) y de revisión (este reviewer la confirmó leyendo el adapter). Sin embargo, **no me corresponde a mí, como reviewer automatizado, cerrar unilateralmente un criterio de aceptación (`acceptance_criteria` #6: "Bucket jamás público") que el propio `feature_list.json` lista como explícito**, cuando el test end-to-end que lo verifica está en rojo. Esta es exactamente la clase de decisión que el implementer correctamente escaló.

**Se requiere que un humano elija una de estas dos opciones antes de cerrar la feature como `done`:**
- (a) Aceptar la limitación documentada del entorno local (mismo precedente que R13 de #2) y dejar R8 en rojo en este entorno, con la garantía real sostenida a nivel de código/arquitectura; o
- (b) Reabrir R8 para redefinir su verificación local (p. ej., verificar `GetPublicAccessBlockCommand` como hace #2 R13, en vez de un GET real sin firmar).

## Output de ./init.sh

```
══════════════════════════════════════════
  INIT — pet-tracker (Harness SDD)
══════════════════════════════════════════

→ Verificando entorno...
✅ node disponible (/c/Program Files/nodejs/node)
✅ pnpm disponible (/c/Users/alex/AppData/Local/pnpm/pnpm)

→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida

→ Instalando dependencias...
Lockfile is up to date, resolution step is skipped
Already up to date
✅ Dependencias instaladas

→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: pet-photos-s3
✅ STATUS.md sincronizado con feature_list.json

→ Build...
✅ Build exitoso

→ Ejecutando tests...
Test Suites: 91 passed, 91 total
Tests:       623 passed, 623 total
✅ Tests pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 9/18 completadas | 8 pendientes

  Próxima feature:
  [#11] geofences-crud (P2)
```

`init.sh` no corre el e2e (solo tests unitarios vía jest). El e2e de esta feature (`pnpm run test:e2e -- media.e2e-spec.ts`) lo corrí yo mismo por separado, de forma independiente al reporte del implementer, contra los contenedores Docker reales (`pet-tracker-localstack`, `pet-tracker-postgres`, ambos healthy):

```
Test Suites: 1 failed, 1 total
Tests:       1 failed, 10 passed, 11 total
```

El único rojo es R8, por el motivo documentado arriba. R1-R7 y R9 en verde, confirmados independientemente.

## Observaciones

Ninguna otra. El código, los tests, la trazabilidad y los commits son consistentes entre sí y con lo reportado por el implementer. El único punto abierto es la decisión humana sobre R8 descrita arriba — no hay ninguna otra fila de `traceability.md` en estado inconsistente ni ningún checkpoint C2-C7 incumplido.
