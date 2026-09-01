---
feature: "localstack-presigned-url-lan-host"
status: draft     # draft | approved
tags: [harness, spec, backend]
---

# Tareas — [[localstack-presigned-url-lan-host]]

> Disciplina TDD. **El historial de commits tiene que mostrar rojo antes que
> verde** (C4): los dos archivos de test se commitean en rojo ANTES del único
> commit de producción que pone verde R1–R4 (es el mismo diff de
> `aws-clients.ts` para los cuatro — [[design]] §D5). Meter test +
> implementación + docs en un solo commit es motivo de rechazo del reviewer.
>
> Feature de backend puro: sin skills expo, sin `mobile-pet-tracker/`.
> Antes de empezar: leer [[requirements]] §Contexto fijo y [[design]] D1–D7 —
> no hay decisiones abiertas.
>
> Rama: `feature/57-localstack-presigned-url-lan-host`, sacada de `main`.

## R1–R3 — Factory y resolución de config (test rojo conjunto)

- [ ] (1) Escribir `backend-pet-tracker/src/aws/presign-endpoint.spec.ts` con
      los tres describes (`R1:`, `R2:`, `R3:` — sin sufijo, archivo nuevo
      por-feature, [[design]] §D5), usando un `buildConfigServiceMock` local
      (patrón de `aws-clients.spec.ts`) y la aserción
      `await client.config.endpoint()` → `hostname`/`port`/`protocol`.
      **ROJO**: `presignEndpoint` no existe todavía en `AwsRuntimeConfig`, la
      suite no compila. Registrar la salida roja en
      `progress/impl_localstack-presigned-url-lan-host.md`.
      Commit: `test(aws): require presign endpoint LAN en modo local (R1-R3)`
      — sin una sola línea de producción

## R4 — Firma end-to-end con presigner real (test rojo)

- [ ] (1) Escribir
      `backend-pet-tracker/src/modules/media/infrastructure/photo-storage.presign-host.spec.ts`
      con `describe('R4: la URL prefirmada nace firmada con el host LAN', ...)`:
      presigner **real** (sin `jest.mock`), `createS3Client` con
      `presignEndpoint: 'http://192.168.7.42:4566'`,
      `new PhotoStorageS3Adapter(s3, buildResourceNames(''))`, aserciones de
      [[requirements]] R4 (host, pathname path-style, `X-Amz-Signature`,
      `X-Amz-SignedHeaders` contiene `host`) para `createUploadUrl` y
      `createDownloadUrl`, y `s3.destroy()` al terminar.
      **No tocar `photo-storage.s3.adapter.spec.ts`.**
      **ROJO**: mismo motivo de compilación que R1–R3.
      Commit: `test(media): URL prefirmada firmada con host LAN (R4)`

## R1–R4 — Implementación mínima (un solo diff de producción)

- [ ] (2) En `backend-pet-tracker/src/aws/aws-clients.ts`, exactamente los
      tres cambios de [[design]] D1–D2: campo opcional `presignEndpoint` en
      `AwsRuntimeConfig`, lectura con `trim()` en
      `resolveAwsConfigFromConfigService` (spread condicional, solo modo
      local), override de `endpoint` en la rama local de `createS3Client`.
      `resolveAwsConfigFromEnv`, `resolveAwsClientOptions`, guards y errores:
      **cero líneas de diff**.
      Commit: `fix(aws): firma URLs prefirmadas de S3 con AWS_PRESIGN_ENDPOINT_URL (R1-R4)`
      — los 4 describes en verde, todas las suites previas verdes
- [ ] (3) Refactor con tests verdes — se espera que **no haya nada que
      refactorizar**; si aparece, es señal de que (2) creció de más

## R5 — Cierre documental y contención

- [ ] (1) `.env.example`: añadir el bloque literal de [[design]] §D7 (línea
      comentada) tras el bloque de `MEDIA_BUCKET_NAME`
- [ ] (2) `docs/conventions.md` §Variables de entorno: añadir la fila literal
      de [[design]] §D7. `docs/verification.md`: añadir
      `### Feature 57 — localstack-presigned-url-lan-host` (tras Feature 54,
      antes de "Notas para el implementer") con el runbook de
      [[requirements]] R6 y el troubleshooting de D7 (firewall 4566, IP que
      cambia con la red).
      Commit: `docs(aws): document AWS_PRESIGN_ENDPOINT_URL y smoke #57 (R5)`
- [ ] (3) Ejecutar y registrar salida en
      `progress/impl_localstack-presigned-url-lan-host.md`:
      `pnpm --filter backend-pet-tracker test`, `./init.sh` en la raíz,
      `git diff --stat main...HEAD` contra la allowlist de [[requirements]]
      R5; confirmar **cero líneas** de diff en
      `photo-storage.s3.adapter.ts`, su spec, `aws.module.ts`, provisioning,
      `mobile-pet-tracker/**` y `progress/current.md`

## R6 — Smoke humano en dispositivo físico (NO delegable a ninguna IA)

- [ ] (1) Avisar al leader de que la parte automatizable está cerrada y la
      feature queda a la espera del humano
- [ ] (2) El humano sigue el runbook de `docs/verification.md` §Feature 57:
      `AWS_PRESIGN_ENDPOINT_URL=http://<IP LAN>:4566` en el `.env` raíz,
      backend reiniciado, LocalStack arriba; confirma **por separado**:
      (a) la URL de la API lleva host `<IP LAN>:4566`, (b) `curl` de esa URL
      sale 0 desde la máquina de desarrollo, (c) sube una foto desde la app y
      la ve cargar en el dispositivo, (d) logcat sin
      `ConnectException ... localhost/127.0.0.1:4566`
- [ ] (3) El humano registra el resultado en
      `progress/impl_localstack-presigned-url-lan-host.md` y marca la segunda
      casilla de [[requirements]] §Aprobación. **Un R4 verde no cierra R6**:
      la firma se probó en memoria, no contra LocalStack en la interfaz LAN
