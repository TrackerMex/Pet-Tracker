# impl: pet-photos-s3
Fecha: 2026-08-05T16:38:45Z

## Archivos creados

- `backend-pet-tracker/src/modules/media/domain/photo-key.ts` — funcion pura `buildPhotoKey(petId, now)` -> `pets/<petId>/photo-<epoch-ms>`.
- `backend-pet-tracker/src/modules/media/domain/photo-key.spec.ts` — R1.
- `backend-pet-tracker/src/modules/media/domain/ports/photo-storage.ts` — interfaz `PhotoStorage` + token `PHOTO_STORAGE` (createUploadUrl/createDownloadUrl).
- `backend-pet-tracker/src/modules/media/application/dto/request-photo-upload-url.dto.ts` — `RequestPhotoUploadUrlSchema` (zod): `contentType` en `{image/jpeg,image/png,image/webp}`.
- `backend-pet-tracker/src/modules/media/application/dto/request-photo-upload-url.dto.spec.ts` — R1 (aceptados), R2 (rechazados).
- `backend-pet-tracker/src/modules/media/application/use-cases/request-photo-upload-url.use-case.ts` — `RequestPhotoUploadUrlUseCase`: genera la clave, persiste `photoKey` via `PET_REPOSITORY.update`, pide el PUT prefirmado (600s) a `PHOTO_STORAGE`, audita `pet.photo_update` solo tras exito.
- `backend-pet-tracker/src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts` — R1, R5.
- `backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts` — implementa `PHOTO_STORAGE` con `S3_CLIENT` + `getSignedUrl` (`@aws-sdk/s3-request-presigner`) contra `BUCKET_MEDIA`.
- `backend-pet-tracker/src/modules/media/infrastructure/pet-photo-url.resolver.ts` — implementa el puerto `PetPhotoUrlResolver` de `pets` delegando en `PHOTO_STORAGE`.
- `backend-pet-tracker/src/modules/media/infrastructure/media.controller.ts` — `POST /v1/pets/:petId/photo-upload-url`, `PetAccessGuard` + `@RequirePetRole('owner')` (D1), responde `200` (no el 201 default de Nest).
- `backend-pet-tracker/src/modules/media/pet-photo-read.module.ts` — submodulo hoja (mismo mecanismo que `PetDeviceReadModule`): provee `PHOTO_STORAGE` + `PET_PHOTO_URL_RESOLVER` dependiendo solo de `S3_CLIENT` (`@Global`), sin importar `PetsModule`/`MediaModule` — rompe el ciclo.
- `backend-pet-tracker/src/modules/media/media.module.ts` — importa `PetsModule` + `PetPhotoReadModule`, registra `MediaController` + `RequestPhotoUploadUrlUseCase`.
- `backend-pet-tracker/src/modules/pets/domain/ports/pet-photo-url-resolver.ts` — interfaz `PetPhotoUrlResolver` + token `PET_PHOTO_URL_RESOLVER` (puerto de `pets`, mismo patron que `pet-device-reader.ts`).
- `backend-pet-tracker/test/media.e2e-spec.ts` — e2e contra Postgres + LocalStack reales (R1,R2,R3,R4,R5,R8,R9).

## Archivos modificados

- `backend-pet-tracker/src/modules/pets/domain/repositories/pet.repository.ts` — `PetFieldChanges` gana `photoKey?: string`.
- `backend-pet-tracker/src/modules/pets/application/use-cases/get-pet.use-case.ts` — inyecta `PET_PHOTO_URL_RESOLVER`; `PetProfile` gana `photoUrl: string | null`; solo invoca el resolver si `pet.photoKey !== null` (evita firma innecesaria). Constante `PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS = 3600`.
- `backend-pet-tracker/src/modules/pets/application/use-cases/get-pet.use-case.spec.ts` — casos R6/R7 agregados.
- `backend-pet-tracker/src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.ts` — `toPetProfileResponse` gana el parametro `photoUrl: string | null = null` (mismo patron que `device`); dejo de hardcodear `photoUrl: null`.
- `backend-pet-tracker/src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.spec.ts` — caso R6 agregado; el comentario del caso ya existente que mencionaba "#6 pendiente" se actualizo.
- `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts` — `detail()` pasa el `photoUrl` de `GetPetUseCase` al mapper. `create`/`list`/`update` sin cambios (siguen con `photoUrl: null` por el default, alcance de D2).
- `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.spec.ts` — casos R6 agregados.
- `backend-pet-tracker/src/modules/pets/pets.module.ts` — agrega `PetPhotoReadModule` a `imports` (junto a `PetDeviceReadModule`).
- `backend-pet-tracker/src/app.module.ts` — registra `MediaModule`.
- `backend-pet-tracker/package.json` / `pnpm-lock.yaml` — agrega `@aws-sdk/s3-request-presigner` (misma familia `^3.1098.0` que el resto de `@aws-sdk/*`; pnpm resolvio `3.1103.0`).

## Requisitos cubiertos

- R1: tests `photo-key.spec.ts`, `request-photo-upload-url.use-case.spec.ts`, `media.e2e-spec.ts`; commits `801e3cf`, `d3295cb`, `919a844` (fix a 200), `066d67f` (e2e).
- R2: tests `request-photo-upload-url.dto.spec.ts`, `media.e2e-spec.ts`; commits `656b4cd`, `066d67f`.
- R3: test `media.e2e-spec.ts`; commits `919a844`, `066d67f`.
- R4: test `media.e2e-spec.ts`; commits `919a844`, `066d67f`.
- R5: tests `request-photo-upload-url.use-case.spec.ts`, `media.e2e-spec.ts`; commits `d3295cb`, `066d67f`.
- R6: tests `get-pet.use-case.spec.ts`, `pet-profile-response.mapper.spec.ts`, `pets.controller.spec.ts`, cobertura e2e implicita en el flujo R9; commit `4aed47a`.
- R7: test `get-pet.use-case.spec.ts`; commit `4aed47a`.
- R8: test `media.e2e-spec.ts` (escrito, en ROJO en este entorno — ver hallazgo abajo); commit `066d67f`.
- R9: test `media.e2e-spec.ts`; commit `066d67f`.

`specs/pet-photos-s3/traceability.md` sin filas "pendiente" — las 9 filas tienen test + commit real. La fila R8 documenta explicitamente el hallazgo de entorno en vez de afirmar un passing falso.

## Decisiones de diseño

- **200, no 201, en `POST /v1/pets/:petId/photo-upload-url`**: R1 pide literalmente `200`. El default de Nest para `@Post()` es `201 Created`; agregado `@HttpCode(HttpStatus.OK)` explicito. Descubierto por el e2e (rojo real antes del fix), no era obvio de la spec/design leyendolos solos.
- **El use case no recibe `contentType`**: D3 ya establece que la validacion de `contentType` (R2) es solo del body del POST, nunca se fija en la firma S3. Como el use case no necesita el valor para nada, `RequestPhotoUploadUrlUseCase.execute(petId, userId, now?)` no toma `dto` — mas simple que cargar un parametro sin uso (controller solo llama `RequestPhotoUploadUrlSchema.safeParse` para validar y descarta el resultado tipado).
- **`PetPhotoUrlResolver.resolveDownloadUrl(photoKey, expiresInSeconds)`**: `expiresInSeconds` viaja como parametro explicito en vez de fijo en la implementacion, para que `GetPetUseCase` (capa application de `pets`) sea quien decide la politica de vigencia (3600s, R6) sin que el puerto la esconda — mismo espiritu que el resto del proyecto evita constantes magicas ocultas en infrastructure.

## Output de build

```
> backend-pet-tracker@0.0.1 build
> nest build && tsc-alias -p tsconfig.build.json

(sin errores)
```

## Output de tests

`./init.sh` — verde completo (build, 91 suites / 623 tests unitarios, lint, typecheck):

```
✅ Build exitoso
✅ Tests pasados (Test Suites: 91 passed, 91 total · Tests: 623 passed, 623 total)
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

`pnpm run test:e2e -- media.e2e-spec.ts` contra Postgres + LocalStack reales (`docker compose up -d`, ambos contenedores healthy en esta sesion):

```
Test Suites: 1 failed, 1 total
Tests:       1 failed, 10 passed, 11 total
```

10/11 en verde (R1, R2, R3×3 roles, R4×2, R5×2, R9). El unico rojo es R8 — ver hallazgo abajo. El resto de la suite e2e del repo (`pnpm run test:e2e`, todas las specs) no se corrio completa en esta sesion; solo `media.e2e-spec.ts` fue el alcance de esta feature.

## Hallazgo R8 (para el reviewer / humano)

`R8` pide: `GET` directo y sin firmar sobre el objeto S3 responde `403` porque el
`PutPublicAccessBlock` que `localstack-provisioning` (#2) aplica sobre
`pet-tracker-media-local` rechaza el acceso publico.

Verificado experimentalmente contra el LocalStack Community 4.14 real de este
repo (`docker-compose.yml`, sin flags extra):

1. Un `GET` anonimo sobre un objeto **existente** de `pet-tracker-media-local`
   (subido primero via el mismo `PUT` prefirmado que usa R9) responde `200`
   con el contenido, no `403`.
2. Descartado que sea un problema de `PutPublicAccessBlock` mal aplicado:
   probado tambien con una **bucket policy explicita `Deny` a
   `s3:GetObject` para `Principal: "*"`** sobre un bucket descartable aparte
   — tampoco se aplico; el `GET` anonimo siguio devolviendo `200`.
3. Probado tambien con `S3_SKIP_SIGNATURE_VALIDATION=0` en un contenedor
   LocalStack aislado — mismo resultado.

Conclusion: LocalStack Community no hace cumplir ACLs/bucket policies/
Block-Public-Access en el plano de datos de S3 — solo los persiste como
metadata (por eso `localstack-provisioning` R13, que solo llama
`GetPublicAccessBlockCommand` y verifica los 4 flags en `true`, si pasa: esa
llamada es a la API de configuracion, no al plano de datos). El enforcement
de IAM/ACL es funcionalidad de LocalStack Pro.

Esto **no es un defecto de esta feature**: el codigo de `pet-photos-s3` nunca
emite una URL sin firmar — el unico puerto de acceso (`PHOTO_STORAGE`) solo
expone `createUploadUrl`/`createDownloadUrl`, ambos siempre firmados. El test
`R8` de `test/media.e2e-spec.ts` esta escrito exactamente como pide la spec
(`expect(response.status).toBe(403)`), documenta el hallazgo en un comentario
extenso, y queda en rojo de forma honesta en vez de debilitarse para pasar
falsamente.

**Pendiente de decision humana**: aceptar esto como limitacion documentada
del entorno local (mismo precedente que el aviso de Docker socket en
`test/localstack-provisioning.e2e-spec.ts`) o reabrir R8 para redefinir su
verificacion en local (p.ej. verificar solo que `GetPublicAccessBlockCommand`
siga en `true`, como ya hace #2 R13, y dejar la garantia real de "nunca
publico" a nivel de codigo/revision en vez de e2e).

## Notas para el reviewer

- Todas las capas respetan `docs/architecture.md`: `media/domain` sin imports
  de framework/AWS SDK; `media/application` depende solo de las interfaces
  `PhotoStorage`/`PetRepository`/`AuditLogger`; `media/infrastructure` es la
  unica capa que conoce `@aws-sdk/client-s3` / `@aws-sdk/s3-request-presigner`.
- `PetPhotoReadModule` replica el mecanismo anti-ciclo de `PetDeviceReadModule`
  exacto: no importa `PetsModule` ni `MediaModule`, solo depende de
  `S3_CLIENT` (`@Global`).
- Cero migracion nueva — `pets.photo_key` ya existia (creada por #5); el
  repositorio Drizzle no cambio (su `update()` ya era generico sobre
  `changes`).
- El fix de `200` vs `201` en el controller (`@HttpCode(HttpStatus.OK)`) solo
  se detecto corriendo el e2e real — vale la pena que el reviewer confirme
  que el codigo de estado coincide literalmente con R1.
- Revisar especialmente el hallazgo R8 de arriba antes de aprobar — es el
  unico punto no cerrado al 100%.
