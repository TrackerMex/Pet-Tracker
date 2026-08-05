---
feature: "pet-photos-s3"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[pet-photos-s3]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.

## Decisiones técnicas

- **Módulo nuevo `src/modules/media/`, Clean Architecture completa** (R1,
  R2, R5): sigue exactamente la estructura domain/application/infrastructure
  de `docs/architecture.md`, mismo patrón que `pets/` y `devices/`. No se
  añade el código dentro de `pets/` porque el bucket S3 es infraestructura
  distinta del CRUD de la ficha (separación ya sugerida por
  `files_affected` de `feature_list.json` id 6).

- **Puerto nuevo en el dominio de `pets`: `PET_PHOTO_URL_RESOLVER`** (R6,
  R7), en `pets/domain/ports/pet-photo-url-resolver.ts` — mismo patrón
  exacto que `PET_DEVICE_READER` (`pets/domain/ports/pet-device-reader.ts`,
  #7): "pets es dueño de su necesidad, la implementación vive en otro
  módulo". `GetPetUseCase` lo inyecta igual que ya inyecta
  `PET_DEVICE_READER`, y solo lo invoca cuando `pet.photoKey !== null`
  (evita una llamada de firma innecesaria cuando no hay foto).

- **Sub-módulo hoja `PetPhotoReadModule`** en `media/pet-photo-read.module.ts`
  (R6) para romper el ciclo `MediaModule ↔ PetsModule`, mismo mecanismo que
  `PetDeviceReadModule` rompe `DevicesModule ↔ PetsModule` (#7 design.md):
  provee `PET_PHOTO_URL_RESOLVER` y `PHOTO_STORAGE` dependiendo únicamente de
  `S3_CLIENT` (`@Global()`, de `AwsModule`) — NUNCA importa `PetsModule` ni
  `MediaModule`. Grafo resultante: `MediaModule -> PetsModule ->
  PetPhotoReadModule` (leaf) y `MediaModule -> PetPhotoReadModule`
  directamente; sin ciclos.

- **Puerto propio de `media`: `PHOTO_STORAGE`** (R1, R6), en
  `media/domain/ports/photo-storage.ts` — abstrae `createUploadUrl(key,
  expiresInSeconds)` y `createDownloadUrl(key, expiresInSeconds)`. La
  implementación (`media/infrastructure/photo-storage.s3.adapter.ts`) usa
  `S3_CLIENT` (inyectado, token ya existente en `src/aws/aws.constants.ts`)
  + `getSignedUrl` de `@aws-sdk/s3-request-presigner` contra
  `BUCKET_MEDIA` (`pet-tracker-media-local`, constante ya existente en
  `src/aws/constants.ts` — se reutiliza, no se redefine). `PetPhotoUrlResolver`
  (impl. del puerto de `pets`) es un wrapper delgado sobre
  `PHOTO_STORAGE.createDownloadUrl`.

- **`buildPhotoKey(petId, now)` como función pura** (R1), en
  `media/domain/photo-key.ts` — `pets/<petId>/photo-<now.getTime()>`. Fuera
  del puerto `PHOTO_STORAGE` (que sí necesita I/O real contra S3 para
  firmar) para que el formato de la clave se pueda testear con un test
  unitario puro, sin mocks, mismo estilo que `calculateAgeMonths` de
  `pets/domain/entities/pet.entity.ts`. El caso de uso recibe `now` como
  parámetro con default `() => new Date()` — mismo patrón de reloj
  inyectable/testeable que el resto del proyecto (`now` explícito en
  `pet-profile-response.mapper.ts`, `SIM_SEED` del simulador Wialon).

- **`RequestPhotoUploadUrlUseCase` reutiliza `PET_REPOSITORY.update()`
  existente** (R1): se añade `photoKey?: string` a la interfaz
  `PetFieldChanges` (`pets/domain/repositories/pet.repository.ts`). La
  implementación Drizzle (`pet.drizzle.repository.ts`) no necesita ningún
  cambio — su `update()` ya hace `.set({ ...rest, ... })` genérico sobre
  `changes`, y `photoKey` ya es una columna real del schema (`photo_key`,
  creada por #5). Cero migración nueva.

- **Endpoint de subida sin endpoint de confirmación** (R1): `photo_key` se
  persiste en el mismo request que emite la `uploadUrl`, no tras verificar
  que el `PUT` ocurrió. Es la lectura más simple compatible con la
  descripción de la feature (que solo menciona el endpoint de solicitud de
  URL) y con `acceptance_criteria` (que no pide un paso de confirmación).
  Ver "Fuera de alcance" de requirements.md.

- **Nueva dependencia `@aws-sdk/s3-request-presigner`** (R1, R6): no está en
  `package.json` — debe agregarse en la misma familia de versión que el resto
  de `@aws-sdk/*` (`^3.1098.0`). `getSignedUrl` firma localmente (SigV4, sin
  round-trip a S3), así que invocar el puerto en cada `GET /v1/pets/:petId`
  es barato.

- **Respuesta del POST**: `{ uploadUrl, expiresInSeconds }`. No se devuelve
  la clave S3 generada — el cliente no la necesita: la siguiente lectura del
  perfil (`GET /v1/pets/:petId`, R6) ya resuelve `photoUrl` a partir de la
  clave persistida.

## Archivos afectados

### Nuevos — `src/modules/media/` (domain / application / infrastructure)

- `media/domain/photo-key.ts` — función pura `buildPhotoKey` (domain).
- `media/domain/ports/photo-storage.ts` — interfaz `PhotoStorage` + token
  `PHOTO_STORAGE` (domain).
- `media/application/dto/request-photo-upload-url.dto.ts` — schema zod
  `contentType` (application).
- `media/application/use-cases/request-photo-upload-url.use-case.ts` —
  orquesta R1/R2/R5 (application).
- `media/infrastructure/media.controller.ts` — `POST
  /v1/pets/:petId/photo-upload-url`, `@UseGuards(PetAccessGuard)
  @RequirePetRole('owner')` (infrastructure).
- `media/infrastructure/photo-storage.s3.adapter.ts` — implementa
  `PhotoStorage` con `S3_CLIENT` + `getSignedUrl` (infrastructure).
- `media/infrastructure/pet-photo-url.resolver.ts` — implementa
  `PetPhotoUrlResolver` (puerto de `pets`) delegando en `PHOTO_STORAGE`
  (infrastructure).
- `media/pet-photo-read.module.ts` — sub-módulo hoja, provee
  `PET_PHOTO_URL_RESOLVER` + `PHOTO_STORAGE` (infrastructure/wiring).
- `media/media.module.ts` — importa `PetsModule` + `PetPhotoReadModule`,
  registra controller + use case (infrastructure/wiring).

### Nuevos — dominio de `pets`

- `pets/domain/ports/pet-photo-url-resolver.ts` — interfaz
  `PetPhotoUrlResolver` + token `PET_PHOTO_URL_RESOLVER` (domain de `pets`,
  mismo patrón que `pet-device-reader.ts`).

### Modificados

- `pets/domain/repositories/pet.repository.ts` — `PetFieldChanges` gana
  `photoKey?: string` (domain).
- `pets/application/use-cases/get-pet.use-case.ts` — inyecta
  `PET_PHOTO_URL_RESOLVER`; `PetProfile` gana `photoUrl: string | null`;
  resuelve solo si `pet.photoKey !== null` (application).
- `pets/infrastructure/mappers/pet-profile-response.mapper.ts` —
  `toPetProfileResponse` gana un parámetro `photoUrl: string | null = null`
  (mismo patrón que el parámetro `device` ya existente); dejar de
  hardcodear `photoUrl: null` (infrastructure).
- `pets/infrastructure/pets.controller.ts` — `detail()` pasa el
  `photoUrl` resuelto por `GetPetUseCase` al mapper; `create`/`list`/`update`
  no cambian (mantienen `photoUrl: null` por el default del mapper, alcance
  de D2).
- `pets/pets.module.ts` — agrega `PetPhotoReadModule` a `imports` (junto a
  `PetDeviceReadModule` ya existente).
- `src/app.module.ts` — registra `MediaModule`.
- `backend-pet-tracker/package.json` — agrega `@aws-sdk/s3-request-presigner`.

### Tests (implementer, TDD)

- `media/domain/photo-key.spec.ts` — R1 (unitario puro).
- `media/application/use-cases/request-photo-upload-url.use-case.spec.ts` —
  R1, R2, R5 (unitario, `PET_REPOSITORY`/`PHOTO_STORAGE`/`AUDIT_LOGGER`
  mockeados).
- `pets/application/use-cases/get-pet.use-case.spec.ts` — casos R6/R7
  añadidos al spec existente.
- `test/media.e2e-spec.ts` — R1, R2, R3, R4, R5, R8, R9 contra LocalStack
  real (mismo patrón que `test/devices.e2e-spec.ts` /
  `test/localstack-provisioning.e2e-spec.ts`).

## Alternativas descartadas

- **Endpoint de confirmación tras el `PUT`** (persistir `photo_key` solo
  cuando el cliente confirma el éxito de la subida): más robusto contra
  "URL pedida pero nunca usada", pero no está en `acceptance_criteria` de #6
  y añade un endpoint no pedido (YAGNI). Descartado; ver "Fuera de alcance".
- **Firmar el `PutObjectCommand` con `ContentType`** para que S3 rechace un
  `PUT` con un tipo distinto al declarado: se descartó por fragilidad e2e
  (el test debe reproducir el header exacto) y porque la validación de
  entrada (R2) ya cubre el caso de uso real (rechazar un `contentType`
  no-imagen antes de emitir la URL). Ver D3 en requirements.md — abierto a
  reconsiderar en el gate.
- **Repositorio con método dedicado `updatePhotoKey()`** en vez de extender
  `PetFieldChanges`: se descartó porque `PetRepository.update()` ya es
  genérico (`.set({...changes})` en la implementación Drizzle) — añadir un
  método nuevo hubiera sido una abstracción redundante para el mismo camino
  de código.
- **Resolver `photoUrl` en `GET /v1/pets` (listado) también**: técnicamente
  barato (firma local), pero fuera del alcance mínimo que pide
  `acceptance_criteria` de #6 y rompe la simetría ya aceptada con `device`
  (#7, que tampoco se resuelve en el listado). Ver D2 — abierto a
  reconsiderar en el gate.
