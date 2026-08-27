---
feature: "media-bucket-aws-mode"
status: approved        # draft | approved
tags: [harness, spec, backend]
---

# Requisitos — [[media-bucket-aws-mode]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D7) y `docs/architecture.md` (esta feature
> vive entera en la capa compartida `backend-pet-tracker/src/aws/`).
> Aplican `docs/conventions.md`: errores tipados, tests que nombran su
> R-id, nunca `process.env` directo dentro del runtime Nest (solo
> ConfigService; la excepción documentada son los helpers `...FromEnv`
> para scripts/e2e). Contratos verificados contra el código real el
> 2026-08-26 (`src/aws/resource-names.ts`, `src/aws/constants.ts`,
> `src/aws/aws-clients.ts`, `src/aws/aws.module.ts`,
> `infra/lib/pet-tracker-dev-stack.ts`,
> `src/modules/media/infrastructure/photo-storage.s3.adapter.ts`).

## Contexto fijo (no reabrir)

- **El bug**: con `AWS_MODE=aws`, `resolveResourceSuffix` devuelve `''`
  (`src/aws/resource-names.ts:55`) y `mediaBucket` resuelve a
  `BUCKET_MEDIA = 'pet-tracker-media-local'` (`src/aws/constants.ts:42`),
  pero el bucket real creado por el stack CDK `PetTrackerDev` (#20) es
  `pet-tracker-media-dev-<accountId>` (`bucketSuffix` compone
  `dev-` + `Aws.ACCOUNT_ID` en `infra/lib/pet-tracker-dev-stack.ts:92-96`).
  Toda URL prefirmada de media (foto de perfil #6, documentos #49) apunta
  en modo aws a un bucket inexistente.
- **Solo el bucket diverge**: el stack usa `ENV_SUFFIX = ''` para colas,
  tabla y bus — esos nombres ya coinciden con el modo aws del runtime y NO
  se tocan. El bucket lleva sufijo `dev-<accountId>` porque el namespace
  S3 es global; el `accountId` no se conoce en tiempo de build del
  backend, así que el nombre real solo puede llegar por configuración.
- **Decisión cerrada** ([[design]] §D1): nueva variable de entorno
  `MEDIA_BUCKET_NAME`, leída por los dos resolvers de
  `src/aws/resource-names.ts` (`resolveResourceNamesFromEnv` desde
  `env.MEDIA_BUCKET_NAME`, `resolveResourceNamesFromConfigService` desde
  `config.get<string>('MEDIA_BUCKET_NAME')`). `PhotoStorageS3Adapter`,
  `AwsModule` y `buildResourceNames` quedan **intactos**: el adapter ya
  firma contra `names.mediaBucket` inyectado vía `AWS_RESOURCE_NAMES`.
- El patrón de guard de arranque es el de `src/aws/aws-clients.ts`
  (feature #21): clase de error tipada con mensaje autoexplicativo
  (`MissingAwsEndpointError` / `UnexpectedAwsEndpointError`), lanzada
  antes de construir nada.
- `resource-names.spec.ts` §`R3: AWS_MODE=aws fuerza sufijo vacio` hoy
  **asserta el comportamiento buggy** (`mediaBucket:
  'pet-tracker-media-local'` en aws) en sus dos casos `resuelve nombres
  desnudos desde process.env` / `desde ConfigService`
  (`src/aws/resource-names.spec.ts:100-118`). Esos DOS `it` son la única
  modificación permitida a tests existentes (R4).
- `resource-names-guard.spec.ts` restringe qué archivos pueden importar
  `BUCKET_MEDIA` y compañía desde `constants.ts` — los tests nuevos usan
  literales de string (`'pet-tracker-media-local'`), no imports de esos
  símbolos ([[design]] §D5).
- El smoke real de #19–#21 cubrió ingest (SQS/DynamoDB/EventBridge), no
  media. La creación de recursos AWS reales y todo comando contra la
  cuenta real siguen siendo del humano (CLAUDE.md §Excepciones).

## Requisitos funcionales

### Resolución del bucket en modo aws

- **R1**: WHILE `AWS_MODE=aws` (según `resolveAwsMode`: trim +
  case-insensitive) y `MEDIA_BUCKET_NAME` tiene un valor válido, WHEN se
  resuelven los nombres de recursos vía `resolveResourceNamesFromEnv` o
  `resolveResourceNamesFromConfigService` THE SYSTEM SHALL devolver
  `mediaBucket` = valor de `MEDIA_BUCKET_NAME` (con `.trim()`) AND los
  otros nueve nombres de `AwsResourceNames` sin ningún cambio (sufijo
  `''`, `NODE_ENV=test` ignorado como hoy); AND el provider
  `AWS_RESOURCE_NAMES` de `AwsModule` SHALL exponer ese mismo
  `mediaBucket`, de modo que `PhotoStorageS3Adapter.createUploadUrl` /
  `createDownloadUrl` firmen contra el bucket real sin cambios en el
  adapter.
  *Tests: `src/aws/media-bucket-aws-mode.spec.ts` (nuevo) →
  `describe('R1: modo aws resuelve mediaBucket desde MEDIA_BUCKET_NAME', ...)`
  — casos FromEnv, FromConfigService (mock `{get}` como en
  `resource-names.spec.ts:106-117`) y `AWS_RESOURCE_NAMES` vía
  `Test.createTestingModule` + `overrideProvider(ConfigService)` (patrón
  `aws.module.spec.ts:50-83`, con `AWS_MODE: 'aws'` y sin
  `AWS_ENDPOINT_URL`); además ajuste de los dos `it` existentes de
  `resource-names.spec.ts` §R3 (añadir `MEDIA_BUCKET_NAME` y esperar el
  override). ROJO primero.*

### Guard de arranque

- **R2**: IF `AWS_MODE=aws` AND `MEDIA_BUCKET_NAME` está ausente, vacía o
  solo espacios THEN THE SYSTEM SHALL lanzar
  `MissingMediaBucketNameError` (nueva clase exportada de
  `src/aws/resource-names.ts`, mensaje según [[design]] §D2) desde ambos
  resolvers, ANTES de construir `AwsResourceNames` — con lo que el
  bootstrap de Nest aborta al construir el provider `AWS_RESOURCE_NAMES`
  y ninguna URL prefirmada llega a firmarse contra
  `pet-tracker-media-local`.
  *Tests: `src/aws/media-bucket-aws-mode.spec.ts` →
  `describe('R2: modo aws sin MEDIA_BUCKET_NAME aborta', ...)` — FromEnv
  y FromConfigService lanzan con ausente/`''`/`'  '`; y
  `Test.createTestingModule` con `AWS_MODE: 'aws'` sin la variable:
  `compile()` rechaza con `MissingMediaBucketNameError`. ROJO primero.*

- **R3**: IF `AWS_MODE=aws` AND `MEDIA_BUCKET_NAME` (tras trim) es
  exactamente `pet-tracker-media-local` o empieza por
  `pet-tracker-media-local-` THEN THE SYSTEM SHALL lanzar
  `LocalMediaBucketNameError` (nueva clase exportada de
  `src/aws/resource-names.ts`, mensaje según [[design]] §D3) desde ambos
  resolvers — el namespace S3 es global y firmar contra el nombre local
  en AWS real significaría firmar contra un bucket inexistente o ajeno.
  *Tests: `src/aws/media-bucket-aws-mode.spec.ts` →
  `describe('R3: modo aws rechaza el nombre del bucket local', ...)` —
  `'pet-tracker-media-local'` y `'pet-tracker-media-local-test'` lanzan;
  un nombre real (`'pet-tracker-media-dev-123456789012'`) no lanza.
  ROJO primero.*

### Regresión y contención

- **R4**: WHILE `AWS_MODE=local` (o cualquier valor distinto de `aws`,
  incluida ausente) THE SYSTEM SHALL ignorar `MEDIA_BUCKET_NAME` por
  completo — definida o no, `mediaBucket` sigue siendo
  `pet-tracker-media-local` (y `pet-tracker-media-local-test` con
  `NODE_ENV=test`), sin lanzar ningún error; AND WHEN se ejecutan
  `pnpm -C backend-pet-tracker run lint`, `test` y `test:e2e` (con
  `docker compose up -d`) y `./init.sh` tras los cambios THE SYSTEM SHALL
  salir con exit 0 y las suites existentes intactas — en particular
  `test/media.e2e-spec.ts`, `test/media-docs.e2e-spec.ts`,
  `test/resource-isolation.e2e-spec.ts`, `src/aws/resource-names.spec.ts`
  (solo los dos `it` autorizados en R1 cambian),
  `src/aws/resource-names-guard.spec.ts` y `src/aws/aws.module.spec.ts`;
  AND `.env.example` SHALL documentar `MEDIA_BUCKET_NAME` **comentada**
  (bloque según [[design]] §D6) sin introducir claves nuevas en la
  comparación de `node env-drift.mjs` (#23: cero líneas de deriva
  nuevas); AND el diff SHALL tocar SOLO
  `backend-pet-tracker/src/aws/resource-names.ts`,
  `backend-pet-tracker/src/aws/resource-names.spec.ts` (dos `it`),
  `backend-pet-tracker/src/aws/media-bucket-aws-mode.spec.ts` (nuevo),
  `backend-pet-tracker/test/aws-real-media.e2e-spec.ts` (nuevo),
  `.env.example`, `docs/verification.md`, más `specs/`, `progress/` y
  `feature_list.json` (harness).
  *Tests: `src/aws/media-bucket-aws-mode.spec.ts` →
  `describe('R4: modo local ignora MEDIA_BUCKET_NAME', ...)` (con y sin
  variable, con `NODE_ENV=test` y sin él). ROJO primero para el caso
  "definida en local no lanza". Verificación de contención: implementer
  lo anota en `progress/impl_media-bucket-aws-mode.md`; reviewer
  re-ejecuta y corre `git diff --stat main...HEAD | grep -v
  "src/aws/resource-names\|media-bucket-aws-mode.spec\|aws-real-media\|.env.example\|verification\|specs/\|progress/\|feature_list"`
  (vacío).*

### Smoke real (cierre humano)

- **R5**: WHEN el humano ejecuta la suite gated
  `test/aws-real-media.e2e-spec.ts` con `AWS_MODE=aws` y
  `MEDIA_BUCKET_NAME=<bucket real>` (sesión `aws login`, credenciales
  estáticas y `AWS_ENDPOINT_URL` comentadas — mismos prerrequisitos que
  Features 19 y 21 en `docs/verification.md`) THE SYSTEM SHALL completar
  el round-trip contra la cuenta real: URL PUT prefirmada de
  `PhotoStorageS3Adapter.createUploadUrl` → `PUT` de bytes → URL GET
  prefirmada de `createDownloadUrl` → `GET` devuelve los mismos bytes →
  borrado del objeto de prueba (`DeleteObjectCommand`); AND WHILE
  `AWS_MODE` ≠ `aws` la suite SHALL aparecer como skipped (patrón
  `runSmoke ? describe : describe.skip` de
  `test/aws-real-smoke.e2e-spec.ts:20`), sin tocar red; AND el flujo a
  nivel app (`POST /v1/pets/:petId/photo-upload-url` + `PUT` + `GET
  /v1/pets/:petId` con `photoUrl` descargable) queda documentado paso a
  paso en `docs/verification.md` §`Feature 51 — media-bucket-aws-mode`
  ([[design]] §D7) para que el humano lo corra con curl.
  **Este requisito SOLO lo cierra el humano** — crea tráfico contra la
  cuenta AWS real; Codex/Claude solo verifican que la suite queda
  skipped en modo local. El humano registra el resultado en
  `progress/impl_media-bucket-aws-mode.md`.
  *Test: `test/aws-real-media.e2e-spec.ts` (nuevo) →
  `describe('R5: round-trip PUT/GET contra el bucket real de media', ...)`.
  Verificable por IA solo el skip en modo local.*

## Fuera de alcance

- **Tocar `infra/`**: el stack ya crea el bucket correcto; no se añade
  `CfnOutput` — el humano obtiene el nombre con
  `aws s3 ls | grep pet-tracker-media` (queda en la sección de
  verification). `cdk deploy`/`bootstrap` siguen siendo humanos.
- Cambiar `buildResourceNames`, `resolveResourceSuffix`, `BUCKET_MEDIA`,
  el provisioning de LocalStack (`provisioning.ts`,
  `run-provisioning.ts`) o cualquier comportamiento del modo local.
- Variables análogas para colas/tabla/bus (YAGNI: sus nombres reales ya
  coinciden con el modo aws, `ENV_SUFFIX = ''` en el stack).
- Tocar `PhotoStorageS3Adapter`, `src/modules/media/`, `AwsModule`,
  `aws-clients.ts` o `mobile-pet-tracker/`.
- Validar existencia real del bucket en el arranque (llamada `HeadBucket`
  a AWS): el guard es de configuración, no de red — el smoke R5 cubre la
  existencia.
- Rotación/limpieza de objetos del bucket real más allá del objeto de
  prueba de R5.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-26) ← gate obligatorio antes de implementar
- [X] R5 smoke real ejecutado por humano (fecha: 2026-08-26) ← gate obligatorio antes de `done`
