---
feature: "media-bucket-aws-mode"
status: draft        # draft | approved
tags: [harness, spec, backend]
---

# Diseño — [[media-bucket-aws-mode]]

> Ver [[requirements]] (R1–R5) y `docs/architecture.md`. Todo el cambio de
> producción vive en UN archivo de la capa compartida:
> `backend-pet-tracker/src/aws/resource-names.ts`.

## Decisiones técnicas

### D1 — `MEDIA_BUCKET_NAME` se lee en los resolvers de resource-names (R1)

El nombre real del bucket (`pet-tracker-media-dev-<accountId>`) contiene el
account id, desconocido en build del backend: solo puede llegar por entorno.
La lectura va en `resolveResourceNamesFromEnv` (desde
`env.MEDIA_BUCKET_NAME`) y `resolveResourceNamesFromConfigService` (desde
`config.get<string>('MEDIA_BUCKET_NAME')`), el **único** punto donde hoy se
decide `mediaBucket`. Con eso:

- el provider `AWS_RESOURCE_NAMES` de `aws.module.ts` recibe el override
  gratis (ya llama a `resolveResourceNamesFromConfigService`) — el
  bootstrap de Nest aborta solo si el guard lanza;
- `PhotoStorageS3Adapter` no cambia: ya firma contra
  `this.names.mediaBucket` inyectado;
- los e2e reales que usan `resolveResourceNamesFromEnv(process.env)`
  (patrón `aws-real-ingest.e2e-spec.ts:34`) reciben el override gratis.

Forma concreta (alto nivel, sin código): ambos resolvers calculan el modo
con `resolveAwsMode` (ya importado en `resource-names.ts`) y, si es
`'aws'`, sustituyen `mediaBucket` en el objeto devuelto por
`buildResourceNames('')` por el valor validado de `MEDIA_BUCKET_NAME`
(helper interno compartido por ambos, que aplica el guard de D2/D3).
`buildResourceNames` y `resolveResourceSuffix` quedan intactos (D5).

### D2 — Guard `MissingMediaBucketNameError` (R2)

Clase exportada de `resource-names.ts`, espejo del patrón
`MissingAwsEndpointError` / `UnexpectedAwsEndpointError` de
`aws-clients.ts` (#21): `extends Error`, constructor sin argumentos,
`this.name` fijado, mensaje autoexplicativo en español que diga:

- `AWS_MODE=aws` requiere `MEDIA_BUCKET_NAME` con el nombre real del
  bucket del stack `PetTrackerDev` (`pet-tracker-media-dev-<accountId>`);
- cómo obtenerlo: `aws s3 ls | grep pet-tracker-media`;
- por qué se aborta: sin él, las URLs prefirmadas de media apuntarían a
  `pet-tracker-media-local`, que no existe en AWS real
  (`docs/verification.md`, feature 51).

Se lanza con valor ausente, vacío o solo espacios (tras `.trim()`), antes
de construir `AwsResourceNames`.

### D3 — Guard `LocalMediaBucketNameError` (R3)

Segunda clase exportada, mismo patrón. Rechaza en modo aws un valor que
(tras trim) sea exactamente `pet-tracker-media-local` o empiece por
`pet-tracker-media-local-`. Razón: el namespace de S3 es **global** — el
nombre local en la cuenta real es un bucket inexistente o, peor,
registrable por un tercero (bucket squatting); firmar PUTs de fotos de
mascotas contra un bucket ajeno es un problema de seguridad, no solo un
404. El check son dos comparaciones de string con literales; no se
importa `BUCKET_MEDIA` extra (ya está importado en `resource-names.ts`,
que es archivo permitido por `resource-names-guard.spec.ts`).

### D4 — Modo local ignora `MEDIA_BUCKET_NAME` (R4)

Con `AWS_MODE` ≠ `aws` la variable no se lee: `mediaBucket` sigue saliendo
de `buildResourceNames(suffix)` como hoy. No se aborta si está definida —
en local el cliente S3 apunta a LocalStack (`AWS_ENDPOINT_URL`), donde un
nombre equivocado falla de forma visible e inocua; abortar añadiría
fricción sin riesgo que mitigar (contrastar con `AWS_ENDPOINT_URL` en modo
aws, que sí es peligroso y por eso #21 aborta). Además `.env.example` la
trae comentada (D6), así que el caso normal ni existe.

### D5 — `buildResourceNames` intacta; tests nuevos sin importar constantes

`buildResourceNames(suffix)` sigue pura y con la misma firma: la usan
`run-provisioning.ts`, 10+ specs y el guard de aislamiento; cambiarle la
firma es churn sin ganancia. El override vive solo en los dos resolvers.
Los tests nuevos (`media-bucket-aws-mode.spec.ts`,
`aws-real-media.e2e-spec.ts`) usan literales (`'pet-tracker-media-local'`,
`'pet-tracker-media-dev-123456789012'`) en vez de importar `BUCKET_MEDIA`,
para no ampliar `ALLOWED_FILES` en `resource-names-guard.spec.ts`.

### D6 — `.env.example`: bloque comentado, cero deriva (R4)

Debajo del bloque AWS existente (líneas 20–32) se añade un comentario que
documenta `MEDIA_BUCKET_NAME` (solo modo aws, formato
`pet-tracker-media-dev-<accountId>`, cómo obtenerlo, referencia a
`docs/verification.md` feature 51) con la línea de ejemplo **comentada**:
`# MEDIA_BUCKET_NAME=pet-tracker-media-dev-<accountId>`. Comentada no es
clave para `env-drift.mjs`, así que ningún `.env` humano existente genera
la advertencia de deriva de #23. Mismo trato que ya reciben las
credenciales estáticas que el modo aws exige comentar.

### D7 — Smoke: e2e gated a nivel adapter + curl a nivel app (R5)

`test/aws-real-media.e2e-spec.ts` sigue el patrón exacto de
`aws-real-smoke.e2e-spec.ts`: `loadDotenv({ path: '../.env' })`, gate
`runSmoke ? describe : describe.skip` sobre `AWS_MODE=aws`, guard de
credenciales estáticas ausentes. El cuerpo construye
`PhotoStorageS3Adapter` a mano con
`createS3Client(resolveAwsConfigFromEnv(process.env))` y
`resolveResourceNamesFromEnv(process.env)` (sin Nest, sin Postgres):
`createUploadUrl` → `fetch` PUT de bytes → `createDownloadUrl` → `fetch`
GET compara bytes → `DeleteObjectCommand` de limpieza bajo una key
`smoke/<timestamp>` que no colisiona con datos reales. Así el smoke prueba
firma+bucket reales con una sola suite reproducible.

El flujo a nivel app (`POST /v1/pets/:petId/photo-upload-url` → `PUT` →
`GET /v1/pets/:petId` → descargar `photoUrl`) no se automatiza: requiere
Postgres con usuario/mascota reales y arrancar la app en modo aws — queda
como pasos curl en `docs/verification.md` §Feature 51, que el humano corre
una vez (mismo trato que Features 19–21). La sección la escribe el
implementer; el resultado lo registra el humano.

## Archivos afectados

- `backend-pet-tracker/src/aws/resource-names.ts` — capa compartida
  (infraestructura): override de `mediaBucket` en modo aws + 2 clases de
  error. **Único archivo de producción tocado.**
- `backend-pet-tracker/src/aws/media-bucket-aws-mode.spec.ts` — NUEVO,
  tests unitarios R1–R4.
- `backend-pet-tracker/src/aws/resource-names.spec.ts` — solo los dos
  `it` de §R3 que hoy asserta el bug (líneas 100–118).
- `backend-pet-tracker/test/aws-real-media.e2e-spec.ts` — NUEVO, suite
  gated R5.
- `.env.example` — bloque comentado `MEDIA_BUCKET_NAME` (D6).
- `docs/verification.md` — sección `Feature 51 — media-bucket-aws-mode`.
- Harness: `specs/media-bucket-aws-mode/`, `progress/`,
  `feature_list.json`.

## Alternativas descartadas

- **Leer ConfigService dentro de `PhotoStorageS3Adapter`**: esparce la
  lógica de modo fuera del punto único de resolución de nombres, duplica
  el guard en cada consumidor futuro de `mediaBucket` y rompe la simetría
  FromEnv/FromConfigService que los e2e reales ya explotan.
- **`CfnOutput` en el stack + lectura automática**: exige credenciales
  CloudFormation en el arranque del backend y toca `infra/`; el humano
  obtiene el nombre una vez con `aws s3 ls` y lo fija en su entorno.
- **Derivar el nombre con STS `GetCallerIdentity` (`pet-tracker-media-dev-`
  + accountId)**: llamada de red en el arranque, acopla el backend al
  esquema de nombres del stack y falla igual si cambia — la env var es
  explícita y trivial de verificar.
- **Abortar si `MEDIA_BUCKET_NAME` está definida en modo local**
  (simetría con `UnexpectedAwsEndpointError`): en local no hay riesgo —
  el endpoint es LocalStack — y el error de #21 existe porque el SDK lee
  `AWS_ENDPOINT_URL` por su cuenta, cosa que no ocurre aquí (D4).
- **Cambiar `BUCKET_MEDIA`/`buildResourceNames` para aceptar override**:
  10+ call sites entre specs, provisioning y guard de aislamiento; churn
  sin ganancia (D5).
