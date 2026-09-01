---
feature: "localstack-presigned-url-lan-host"
status: draft     # draft | approved
tags: [harness, spec, backend]
---

# Requisitos — [[localstack-presigned-url-lan-host]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D7). Aplican `docs/conventions.md` (tests que
> nombran su R-id, commit `fix(<scope>): <desc> (R<n>)`, §Variables de
> entorno) y `docs/architecture.md`: el cambio vive entero en
> `backend-pet-tracker/src/aws/` (infraestructura compartida) — domain y
> application no se tocan. Feature de **backend puro**: nada de
> `mobile-pet-tracker/`, ni `docs/ui-guidelines.md`, ni skills expo.
>
> Feature **pequeña**: una variable de entorno nueva, ~6 líneas en un archivo
> de producción, dos archivos de test nuevos y docs. Si la implementación
> crece más allá de eso, está mal.

## Contexto fijo (no reabrir)

### El defecto

Las URLs prefirmadas de S3 salen con host `localhost`: en un teléfono físico
`localhost` es el propio teléfono, así que las fotos de mascota nunca cargan.
Visto en adb logcat durante el smoke de #54 (2026-09-01):

```
E ExpoImage: java.net.ConnectException(Failed to connect to localhost/127.0.0.1:4566)
```

La cadena completa del defecto, verificada en código el 2026-09-01:

1. `backend-pet-tracker/src/aws/aws-clients.ts:103` —
   `resolveAwsConfigFromConfigService` lee `AWS_ENDPOINT_URL`
   (`http://localhost:4566` en local, LocalStack).
2. `aws-clients.ts:148-155` — `createS3Client` construye el `S3Client` con ese
   `endpoint` (y `forcePathStyle: true` en local).
3. `src/aws/aws.module.ts` expone ese cliente bajo el token `S3_CLIENT`.
4. `src/modules/media/infrastructure/photo-storage.s3.adapter.ts:30` y `:38`
   firman con `getSignedUrl` de `@aws-sdk/s3-request-presigner`, que hereda el
   endpoint del cliente → URL con host `localhost:4566`.

**Dato clave que habilita el diseño**: `PhotoStorageS3Adapter` es el **único**
inyector de `S3_CLIENT` en todo el backend, y solo lo usa para firmar —
`getSignedUrl` es cómputo local (SigV4), sin round-trip de red. El script de
provisioning usa su propio cliente vía `resolveAwsConfigFromEnv`. Cambiar el
endpoint del `S3_CLIENT` en modo local cambia **solo** el host de las URLs
firmadas, no el tráfico del backend.

### Por qué NO se puede reescribir el host después de firmar

La firma SigV4 de una URL prefirmada cubre el header `Host`: la propia URL lo
declara en su query (`X-Amz-SignedHeaders=host`). Cambiar el host después de
firmar — proxy, interceptor en el móvil, string-replace en el resolver —
produce `SignatureDoesNotMatch`. La única salida es **firmar ya** con un host
que el cliente de la URL resuelva. R4 deja este hecho asserteado en un test
(`X-Amz-SignedHeaders` contiene `host`).

### La decisión

Nueva variable de entorno **`AWS_PRESIGN_ENDPOINT_URL`** (ej.
`http://192.168.1.50:4566`, la IP LAN de la máquina de desarrollo — la misma
que ya usa `EXPO_PUBLIC_API_URL` en `mobile-pet-tracker/.env`, ver
`docs/verification.md` §Feature 54; para el emulador Android vale
`http://10.0.2.2:4566`):

- Solo la lee `resolveAwsConfigFromConfigService`, solo aplica en modo `local`
  y solo al `S3Client` (el único cliente que firma URLs para terceros).
- Ausente o vacía ⇒ **todo queda exactamente como hoy** (se firma con
  `AWS_ENDPOINT_URL`, host `localhost`): el default no cambia para quien no
  prueba en dispositivo físico.
- En `AWS_MODE=aws` se **ignora** (patrón `MEDIA_BUCKET_NAME` R4 de #51): el
  guard `assertNoEndpoint` (`aws-clients.ts:55`) sigue intacto y las URLs
  firmadas contra AWS real siguen saliendo con el dominio de S3.

### Por qué el nombre NO es `AWS_ENDPOINT_URL_S3`

El AWS SDK v3 lee `AWS_ENDPOINT_URL_S3` de `process.env` **por su cuenta y en
ambos modos**: en modo `aws` apuntaría el cliente real a LocalStack sin pasar
por el guard de #21 (que solo cubre `AWS_ENDPOINT_URL`). El nombre elegido
queda fuera del namespace que el SDK lee: **solo nuestro código la consume**,
así que en modo `aws` no existe vía de fuga que hubiera que guardar.

## Requisitos funcionales

- **R1**: WHEN `AWS_MODE` resuelve a `local` AND `ConfigService` devuelve un
  valor no vacío (tras `trim()`) para `AWS_PRESIGN_ENDPOINT_URL` THE SYSTEM
  SHALL construir el `S3Client` de `createS3Client` con `endpoint` igual a ese
  valor, manteniendo `forcePathStyle: true`, la región y el par estático de
  credenciales de siempre, AND los otros tres clientes (`createSqsClient`,
  `createDynamoDbClient`, `createEventBridgeClient`) SHALL seguir
  construyéndose con `AWS_ENDPOINT_URL` sin cambio alguno.
  *Test: `backend-pet-tracker/src/aws/presign-endpoint.spec.ts` →
  `describe('R1: modo local firma S3 con AWS_PRESIGN_ENDPOINT_URL', ...)` —
  archivo nuevo por-feature con R-ids sin sufijo, mismo patrón que
  `media-bucket-aws-mode.spec.ts` ([[design]] §D5). Técnica de aserción: la
  que ya usa `aws-clients.spec.ts` — `await client.config.endpoint()` y
  comprobar `hostname`/`port`/`protocol`:*

  ```ts
  const resolved = await s3.config.endpoint!();
  expect(resolved.hostname).toBe('192.168.7.42');
  expect(resolved.port).toBe(4566);
  expect(s3.config.forcePathStyle).toBe(true);
  // y SQS/DynamoDB/EventBridge siguen resolviendo hostname 'localhost'
  ```

  *ROJO primero: hoy `presignEndpoint` no existe en `AwsRuntimeConfig`, así
  que la suite ni compila; con el tipo añadido pero sin el override, el
  hostname sigue siendo `localhost`.*

- **R2**: WHEN `AWS_MODE` resuelve a `local` AND `AWS_PRESIGN_ENDPOINT_URL`
  está ausente, vacía o en blanco THE SYSTEM SHALL construir el `S3Client`
  exactamente como hoy (endpoint `AWS_ENDPOINT_URL`, host `localhost:4566`),
  AND `resolveAwsConfigFromEnv` SHALL seguir **sin leer** la variable —
  `presignEndpoint` queda `undefined` en su resultado incluso con la variable
  presente en el env — de modo que el script de provisioning
  (`scripts/provision-local.ts`) queda fuera del alcance de esta feature: ese
  script habla con LocalStack él mismo y nunca firma URLs para dispositivos.
  *Test: `presign-endpoint.spec.ts` →
  `describe('R2: sin AWS_PRESIGN_ENDPOINT_URL el comportamiento actual no cambia', ...)`.
  Es en parte un pin de no-regresión: sus aserciones sobre el comportamiento
  actual nacerían verdes, pero el archivo entero está ROJO antes del fix
  porque R1/R3 (mismo archivo) referencian `presignEndpoint`, que aún no
  compila.*

- **R3**: WHILE `AWS_MODE=aws` THE SYSTEM SHALL (a) seguir abortando con
  `UnexpectedAwsEndpointError` si `AWS_ENDPOINT_URL` está definida — el guard
  `assertNoEndpoint` (`aws-clients.ts:55`) no se toca —, AND (b) IF
  `AWS_PRESIGN_ENDPOINT_URL` está definida THEN THE SYSTEM SHALL ignorarla sin
  abortar (`presignEndpoint` sin valor en el config resuelto), AND (c) THE
  SYSTEM SHALL construir el `S3Client` sin endpoint custom
  (`client.config.endpoint === undefined`, misma aserción que
  `aws-mode.spec.ts` R3), de modo que las URLs firmadas contra AWS real siguen
  saliendo con el dominio de S3.
  *Test: `presign-endpoint.spec.ts` →
  `describe('R3: modo aws sigue intacto e ignora AWS_PRESIGN_ENDPOINT_URL', ...)`.
  Ignorar y no abortar es deliberado ([[design]] §D6): la variable solo la lee
  nuestro código, no hay fuga posible hacia el SDK.*

- **R4**: WHEN `PhotoStorageS3Adapter` firma una URL de subida
  (`createUploadUrl`) o de descarga (`createDownloadUrl`) usando un `S3Client`
  construido por `createS3Client` en modo `local` con
  `presignEndpoint: 'http://192.168.7.42:4566'` THE SYSTEM SHALL devolver una
  URL cuyo host es `192.168.7.42:4566`, con path path-style
  `/pet-tracker-media-local/<key>`, AND cuya query SigV4 incluye
  `X-Amz-Signature` y un `X-Amz-SignedHeaders` que contiene `host` — la
  prueba ejecutable de que la firma **nace** con el host LAN y de que
  reescribirlo a posteriori la invalidaría.
  *Test: archivo **nuevo**
  `backend-pet-tracker/src/modules/media/infrastructure/photo-storage.presign-host.spec.ts`
  → `describe('R4: la URL prefirmada nace firmada con el host LAN', ...)`,
  con el presigner **real** (sin `jest.mock`): `getSignedUrl` es cómputo
  local, no necesita red ni LocalStack. Va en archivo propio porque
  `photo-storage.s3.adapter.spec.ts` mockea `@aws-sdk/s3-request-presigner` a
  nivel de módulo y ahí el host es inobservable ([[design]] §D5):*

  ```ts
  const url = new URL(await storage.createDownloadUrl('pets/photo.jpg', 300));
  expect(url.host).toBe('192.168.7.42:4566');
  expect(url.pathname).toBe('/pet-tracker-media-local/pets/photo.jpg');
  expect(url.searchParams.get('X-Amz-Signature')).toBeTruthy();
  expect(url.searchParams.get('X-Amz-SignedHeaders')).toContain('host');
  ```

  *El adaptador se instancia como en su spec existente
  (`new PhotoStorageS3Adapter(s3, buildResourceNames(''))` —
  `mediaBucket = 'pet-tracker-media-local'`). ROJO primero: antes del fix el
  literal `presignEndpoint` no compila; tras añadir solo el tipo, el host
  sería `localhost:4566`.*

- **R5**: WHEN se cierra la parte automatizable THE SYSTEM SHALL dejar el
  cierre documental y contenido:
  - `.env.example` SHALL ganar el bloque de `AWS_PRESIGN_ENDPOINT_URL` con la
    línea **comentada** (`# AWS_PRESIGN_ENDPOINT_URL=http://192.168.x.x:4566`,
    patrón `MEDIA_BUCKET_NAME`: el valor depende de la IP LAN de cada máquina
    y una línea activa introduciría deriva y el warning de drift de #23). El
    texto literal está en [[design]] §D7.
  - `docs/conventions.md` §Variables de entorno SHALL ganar la fila de
    `AWS_PRESIGN_ENDPOINT_URL` (mismo cierre, no "después" — AGENTS.md §4);
    texto literal en [[design]] §D7.
  - `docs/verification.md` SHALL ganar la sección
    `### Feature 57 — localstack-presigned-url-lan-host` (tras la de Feature
    54, antes de "Notas para el implementer") con el runbook literal del smoke
    R6.
  - **Allowlist**: el diff de la branch SHALL tocar SOLO
    `backend-pet-tracker/src/aws/aws-clients.ts`,
    `backend-pet-tracker/src/aws/presign-endpoint.spec.ts` (nuevo),
    `backend-pet-tracker/src/modules/media/infrastructure/photo-storage.presign-host.spec.ts`
    (nuevo), `.env.example`, `docs/conventions.md` (solo la fila nueva),
    `docs/verification.md` (solo la sección nueva),
    `specs/localstack-presigned-url-lan-host/**`,
    `progress/impl_localstack-presigned-url-lan-host.md` y
    `feature_list.json`. AND
    `photo-storage.s3.adapter.ts` (**cero líneas de diff** — el fix viaja por
    el cliente inyectado), `photo-storage.s3.adapter.spec.ts`,
    `src/aws/aws.module.ts`, `src/aws/provisioning.ts`,
    `src/aws/run-provisioning.ts`, `scripts/provision-local.ts`, el resto de
    `src/aws/*.spec.ts` existentes, `docker-compose.yml`,
    `mobile-pet-tracker/**`, `infra/**` y `progress/current.md` SHALL quedar
    sin cambios. Dentro de `aws-clients.ts`, `resolveAwsConfigFromEnv`,
    `resolveAwsClientOptions`, `assertEndpoint`, `assertNoEndpoint` y los dos
    errores nombrados SHALL quedar textualmente intactos.
  - WHEN se ejecutan `pnpm --filter backend-pet-tracker test` y `./init.sh`
    THE SYSTEM SHALL salir con exit 0 y todas las suites previas verdes, sin
    borrar ni desactivar ningún test existente.
  *Sin test propio (mismo criterio que #55 R2): el implementer registra
  comandos y salida en `progress/impl_localstack-presigned-url-lan-host.md`;
  el reviewer los re-ejecuta y valida `git diff --stat` contra la allowlist.*

## Prueba de humo del humano

- **R6**: WHEN el humano, con LocalStack y el backend local arriba,
  `AWS_PRESIGN_ENDPOINT_URL=http://<IP LAN>:4566` en el `.env` raíz (backend
  reiniciado) y un dispositivo Android físico en la misma LAN con el dev build
  y `EXPO_PUBLIC_API_URL` apuntando a esa misma IP, abre la app THE SYSTEM
  SHALL mostrar la foto de la mascota cargada, AND `adb logcat` SHALL NOT
  contener `ConnectException` hacia `localhost/127.0.0.1:4566`.

  Confirmación **explícita y por separado** (runbook literal en
  `docs/verification.md` §Feature 57, que R5 añade):
  1. La URL de foto que devuelve la API tiene host `<IP LAN>:4566`, no
     `localhost`.
  2. `curl -fsS "<url firmada>" -o /dev/null` desde la máquina de desarrollo
     sale con exit 0 (la firma vale con el host LAN y LocalStack responde en
     esa interfaz).
  3. En el dispositivo: subir una foto de mascota desde la app (la URL PUT
     también sale ya con host LAN) y verla cargar después.
  4. `adb logcat` sin `ConnectException ... localhost/127.0.0.1:4566` de
     `ExpoImage`.

  **Ningún test de Jest cubre esto**: R4 prueba la firma en memoria, no que
  LocalStack escuche en la interfaz LAN, ni el firewall, ni la app real.
  **Este requisito SOLO lo cierra el humano** (requiere dispositivo real y
  LocalStack corriendo). Registra el resultado en
  `progress/impl_localstack-presigned-url-lan-host.md` y marca la segunda
  casilla de §Aprobación.

## Fuera de alcance

- **Cambiar `AWS_ENDPOINT_URL` a la IP LAN** como solución oficial (el
  workaround de cero código): acoplaría los 4 clientes **y** el script de
  provisioning a una IP que cambia por red — una IP obsoleta rompería toda la
  cadena backend↔LocalStack (incluso offline), no solo las fotos en el
  teléfono. Ver [[design]] §Alternativas.
- **Reescribir el host después de firmar** (proxy, interceptor, resolver):
  invalida SigV4 (§Contexto). No se reabre.
- **`AWS_ENDPOINT_URL_S3`** como nombre de la variable (§Contexto): el SDK la
  lee por su cuenta en ambos modos, fuera del guard de #21.
- **Un segundo `S3Client` / token `S3_PRESIGN_CLIENT`** dedicado a firmar:
  innecesario mientras `S3_CLIENT` no haga tráfico de red backend (hoy no lo
  hace; [[design]] §D2 anota el techo).
- **`LOCALSTACK_HOST` / `HOSTNAME_EXTERNAL`** en el contenedor de LocalStack:
  afectan a URLs que LocalStack **devuelve**, no a la firma client-side del
  SDK, que es donde nace el defecto.
- **Autodetección de la IP LAN** (`os.networkInterfaces()`): frágil con
  múltiples interfaces, VPN o WSL; la config explícita por máquina ya es el
  patrón del repo (`EXPO_PUBLIC_API_URL`).
- **Tocar `mobile-pet-tracker/`**: la app ya consume las URLs que le da la
  API; no hay cambio móvil.
- **Modo `aws`, CDK o infra real**: R3 es exactamente "nada cambia".
- **Presigners de otros servicios**: no existen en el repo.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-01) ← gate obligatorio antes de implementar
- [ ] R6 smoke en dispositivo físico: foto de mascota carga con
      `AWS_PRESIGN_ENDPOINT_URL` puesta y logcat sin `ConnectException`
      (fecha: ____) ← gate obligatorio antes de `done`
