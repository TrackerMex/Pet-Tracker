---
feature: "localstack-presigned-url-lan-host"
status: approved  # draft | approved
tags: [harness, spec, backend]
---

# Diseño — [[localstack-presigned-url-lan-host]]

> Ver [[requirements]] para los requisitos que este diseño implementa.
> Capas de `docs/architecture.md`: todo el cambio de producción vive en
> `src/aws/aws-clients.ts` (infraestructura compartida). Domain y application
> no se tocan; el puerto `PhotoStorage` y su adaptador quedan intactos.
>
> Toda afirmación sobre el código se verificó el 2026-09-01 leyendo el
> fuente, no la memoria: `S3_CLIENT` tiene un único inyector
> (`PhotoStorageS3Adapter`) y solo firma — `getSignedUrl` es SigV4 en
> memoria, sin red. El script de provisioning construye su propio cliente
> vía `resolveAwsConfigFromEnv`.

## Decisiones técnicas

### D1 — Variable nueva `AWS_PRESIGN_ENDPOINT_URL`, leída solo en la vía ConfigService y solo en modo local (R1–R3)

`AwsRuntimeConfig` gana un campo **opcional**:

```ts
export interface AwsRuntimeConfig {
  mode: AwsMode;
  endpoint: string;
  /**
   * Solo modo local (#57): endpoint con el que se FIRMAN las URLs
   * prefirmadas de S3, con un host que el cliente de la URL resuelva
   * (IP LAN de la máquina, o 10.0.2.2 desde el emulador Android).
   * Ausente => se firma con `endpoint` (localhost), comportamiento previo.
   */
  presignEndpoint?: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}
```

Opcional a propósito: los literales `AwsRuntimeConfig` que ya existen en
tests (`aws-mode.spec.ts`, etc.) siguen compilando sin tocarlos — la
allowlist de R5 depende de eso.

`resolveAwsConfigFromConfigService` lo puebla así (única lectura de la
variable en todo el repo):

```ts
const presignEndpoint = (
  config.get<string>('AWS_PRESIGN_ENDPOINT_URL') ?? ''
).trim();

return {
  mode,
  endpoint: mode === 'aws' ? assertNoEndpoint(endpoint) : endpoint,
  ...(mode === 'local' && presignEndpoint !== '' ? { presignEndpoint } : {}),
  region: ...,        // sin cambios
  accessKeyId: ...,   // sin cambios
  secretAccessKey: ..., // sin cambios
};
```

`resolveAwsConfigFromEnv` **no cambia ni una línea**: el script de
provisioning habla con LocalStack él mismo y nunca entrega URLs a un
dispositivo (R2). Si algún día un script standalone necesitara firmar para
terceros, ese día se decide — no antes.

### D2 — El override vive en `createS3Client`, rama local, y en ningún otro sitio (R1, R4)

```ts
export function createS3Client(config: AwsRuntimeConfig): S3Client {
  return new S3Client({
    ...resolveAwsClientOptions(config),
    ...(config.mode === 'local'
      ? {
          forcePathStyle: true,
          ...(config.presignEndpoint ? { endpoint: config.presignEndpoint } : {}),
        }
      : {}),
  });
}
```

- `resolveAwsClientOptions` queda intacto: sirve a los 4 clientes y solo el
  S3 firma URLs para terceros. SQS/DynamoDB/EventBridge siguen en
  `AWS_ENDPOINT_URL` (localhost): su tráfico es backend→LocalStack y debe
  seguir funcionando aunque la máquina cambie de red u opere offline.
- En modo `aws` la rama no se evalúa y `presignEndpoint` ni siquiera se
  puebla (D1), doble cierre para R3.
- **Techo aceptado** (ponytail): si mañana el backend hace llamadas S3 de
  red con `S3_CLIENT` (p. ej. `DeleteObject`) y la variable está puesta,
  irán a la IP LAN — que es la propia máquina, así que funcionan en LAN pero
  fallarían offline. Si eso llega a doler, la mejora es un
  `S3_PRESIGN_CLIENT` separado; hoy sería un segundo cliente y un token DI
  para un consumidor que no existe.

### D3 — Firmar ya con el host correcto es la única salida (R4)

`X-Amz-SignedHeaders=host`: el header `Host` forma parte del string-to-sign
de SigV4, así que cualquier reescritura posterior (proxy, interceptor,
string-replace) produce `SignatureDoesNotMatch`. R4 lo deja **asserteado**
(`X-Amz-SignedHeaders` contiene `host`) para que la razón del diseño viva en
un test ejecutable y no solo en prosa. LocalStack acepta la URL firmada con
host LAN porque el `Host` de la request del teléfono coincide con el firmado.

### D4 — Por qué el nombre queda fuera del namespace del SDK (R3)

El AWS SDK v3 lee `AWS_ENDPOINT_URL` y `AWS_ENDPOINT_URL_<SERVICE>` (p. ej.
`AWS_ENDPOINT_URL_S3`) de `process.env` por su cuenta, en ambos modos. Usar
`AWS_ENDPOINT_URL_S3` habría sido "gratis" (cero código) pero:

- en modo `aws` apuntaría el cliente real a LocalStack **sin pasar por el
  guard de #21**, que solo cubre `AWS_ENDPOINT_URL`;
- el SDK la aplicaría a las llamadas de red, no solo a la firma.

`AWS_PRESIGN_ENDPOINT_URL` no significa nada para el SDK: solo nuestro código
la lee, así que en modo `aws` basta ignorarla (D6) — no hay fuga que guardar.

### D5 — Dos archivos de test nuevos, R-ids sin sufijo (R1–R4)

| Archivo | Cubre | Por qué nuevo |
|---|---|---|
| `src/aws/presign-endpoint.spec.ts` | R1, R2, R3 | patrón del repo: archivo por-feature junto a `aws-endpoint-guard.spec.ts` y `media-bucket-aws-mode.spec.ts`, con `buildConfigServiceMock` local como el de `aws-clients.spec.ts` |
| `src/modules/media/infrastructure/photo-storage.presign-host.spec.ts` | R4 | `photo-storage.s3.adapter.spec.ts` mockea `@aws-sdk/s3-request-presigner` a **nivel de módulo** (`jest.mock`), y R4 necesita el presigner **real** para observar el host firmado. Desactivar el mock dentro del mismo archivo sería un segundo mecanismo conviviendo con el primero |

Los describes usan `R1:`–`R4:` a secas: la regla H5 del review de #44
(sufijo `(<feature>)`) aplica cuando un R-id **aterriza en un archivo de test
compartido**, y aquí ambos archivos son nuevos y de esta feature — mismo
criterio con el que `media-bucket-aws-mode.spec.ts` convive con
`aws-endpoint-guard.spec.ts` reutilizando `R1..Rn`. Por lo mismo,
`photo-storage.s3.adapter.spec.ts` **no se toca**.

Un solo commit de producción pone verde R1–R4 (es el mismo diff); el
historial rojo→verde se preserva commiteando **ambos** archivos de test en
rojo antes del fix (ver [[tasks]]).

### D6 — Modo `aws` ignora la variable, no aborta (R3)

Precedente directo: `media-bucket-aws-mode` R4 ("modo local ignora
`MEDIA_BUCKET_NAME`"). Abortar (estilo `UnexpectedAwsEndpointError`) se
justifica para `AWS_ENDPOINT_URL` porque el SDK la lee por su cuenta y el
riesgo es hablar con LocalStack creyendo hablar con AWS; aquí no existe ese
canal (D4), así que abortar solo añadiría fricción al alternar de modo (la
línea puede quedarse en el `.env` comentada o no). R3(c) verifica el
resultado observable: cliente sin endpoint custom.

### D7 — Textos literales de configuración y docs (R5)

Bloque para `.env.example` (línea **comentada**, patrón `MEDIA_BUCKET_NAME`:
sin default sensato — la IP es de cada máquina — y sin disparar el drift
warning de #23):

```
# Host con el que se FIRMAN las URLs prefirmadas de S3 en modo local (#57).
# Sin ella se firma con AWS_ENDPOINT_URL (localhost) y un telefono fisico no
# las resuelve: localhost es el propio telefono (ConnectException en logcat).
# La firma SigV4 cubre el header Host, asi que hay que firmar YA con un host
# que el cliente de la URL resuelva: la IP LAN de esta maquina (la misma que
# EXPO_PUBLIC_API_URL en mobile-pet-tracker/.env) o 10.0.2.2 para el emulador
# Android. Solo modo local; en AWS_MODE=aws se ignora. Comentada por defecto:
# el valor depende de cada maquina/red (docs/verification.md, feature 57).
# AWS_PRESIGN_ENDPOINT_URL=http://192.168.x.x:4566
```

Fila para `docs/conventions.md` §Variables de entorno:

| Variable | Para qué | Estado |
|---|---|---|
| `AWS_PRESIGN_ENDPOINT_URL` | Endpoint con el que se **firman** las URLs prefirmadas de S3 en modo local (`http://<IP LAN>:4566`; `http://10.0.2.2:4566` para el emulador Android). Solo la lee `resolveAwsConfigFromConfigService` y solo aplica al `S3Client` — el único que firma URLs para terceros; ausente o vacía ⇒ se firma con `AWS_ENDPOINT_URL` (comportamiento previo); con `AWS_MODE=aws` se ignora. El valor depende de la IP LAN de cada máquina, igual que `EXPO_PUBLIC_API_URL` | comentada en `.env.example` — consumida desde `localstack-presigned-url-lan-host` (#57): `src/aws/aws-clients.ts` vía `ConfigService` |

La sección `### Feature 57 — localstack-presigned-url-lan-host` de
`docs/verification.md` transcribe el runbook de [[requirements]] R6 (pasos
1–4 más troubleshooting: LocalStack publica `4566:4566` en `0.0.0.0`, pero el
firewall de Windows debe permitir entrada al 4566 igual que ya la permite al
3000 de la API; al cambiar de red cambian la IP y **ambos** `.env`, el raíz y
el móvil).

## Archivos afectados

| Archivo | Capa | Qué cambia |
|---|---|---|
| `backend-pet-tracker/src/aws/aws-clients.ts` | infraestructura compartida | campo opcional `presignEndpoint` en `AwsRuntimeConfig` + lectura en `resolveAwsConfigFromConfigService` + override en `createS3Client` (D1, D2). `resolveAwsConfigFromEnv`, `resolveAwsClientOptions`, guards y errores: intactos |
| `backend-pet-tracker/src/aws/presign-endpoint.spec.ts` | test (nuevo) | R1–R3 |
| `backend-pet-tracker/src/modules/media/infrastructure/photo-storage.presign-host.spec.ts` | test (nuevo) | R4, presigner real |
| `.env.example` | config | bloque comentado de D7 |
| `docs/conventions.md` | docs | fila de D7 en §Variables de entorno |
| `docs/verification.md` | docs | sección Feature 57 con el runbook de R6 |

**Sin cambios** (lista negativa completa en [[requirements]] R5):
`photo-storage.s3.adapter.ts` — el fix viaja por el cliente inyectado, el
adaptador no sabe nada nuevo —, su spec, `aws.module.ts`, provisioning,
`docker-compose.yml` y toda la app móvil.

Rama y PR: `feature/57-localstack-presigned-url-lan-host`, sacada de `main`.

## Alternativas descartadas

- **`AWS_ENDPOINT_URL=http://<IP LAN>:4566`** (cero código): funciona hoy —
  el backend alcanza su propia IP LAN — pero acopla los 4 clientes y el
  provisioning a una IP por-red; con IP obsoleta u offline se cae toda la
  cadena backend↔LocalStack, no solo las fotos del teléfono. Una variable
  dedicada limita el radio de fallo de una IP vieja a exactamente el síntoma
  que arregla.
- **Reescribir el host tras firmar**: `SignatureDoesNotMatch` (D3).
- **`AWS_ENDPOINT_URL_S3`**: puentea el guard de #21 en modo aws (D4).
- **Segundo cliente `S3_PRESIGN_CLIENT`**: más superficie (token DI, factory,
  módulo) para un problema que hoy no existe — `S3_CLIENT` solo firma (D2).
- **`LOCALSTACK_HOST`/`HOSTNAME_EXTERNAL` en LocalStack**: gobiernan URLs que
  LocalStack devuelve en respuestas; la URL defectuosa la genera el SDK
  client-side antes de tocar la red.
- **Autodetectar la IP** con `os.networkInterfaces()`: elige mal con VPN,
  Docker, WSL o varias interfaces; y el repo ya asume config explícita por
  máquina para este mismo dato (`EXPO_PUBLIC_API_URL`).
- **Abortar en modo aws si la variable está definida**: fricción sin riesgo
  que mitigar (D6).
