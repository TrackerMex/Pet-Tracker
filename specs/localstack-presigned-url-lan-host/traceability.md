---
feature: "localstack-presigned-url-lan-host"
status: approved  # draft | approved
tags: [harness, spec, backend]
---

# Trazabilidad — [[localstack-presigned-url-lan-host]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/aws/presign-endpoint.spec.ts::R1: modo local firma S3 con AWS_PRESIGN_ENDPOINT_URL` | pendiente |
| R2 | `src/aws/presign-endpoint.spec.ts::R2: sin AWS_PRESIGN_ENDPOINT_URL el comportamiento actual no cambia` | pendiente |
| R3 | `src/aws/presign-endpoint.spec.ts::R3: modo aws sigue intacto e ignora AWS_PRESIGN_ENDPOINT_URL` | pendiente |
| R4 | `src/modules/media/infrastructure/photo-storage.presign-host.spec.ts::R4: la URL prefirmada nace firmada con el host LAN` | pendiente |
| R5 | sin test propio — `progress/impl_localstack-presigned-url-lan-host.md::Verificación R5` (test backend, `./init.sh`, allowlist de `git diff --stat`) + `.env.example` + `docs/conventions.md::§Variables de entorno` + `docs/verification.md::### Feature 57 — localstack-presigned-url-lan-host` | pendiente |
| R6 | sin test — smoke humano en dispositivo físico: foto de mascota carga con `AWS_PRESIGN_ENDPOINT_URL` puesta y `adb logcat` sin `ConnectException` hacia `localhost:4566`, registrado en `progress/impl_localstack-presigned-url-lan-host.md::Resultado del smoke R6` y con la casilla marcada en [[requirements]] §Aprobación | pendiente |

Rutas relativas a `backend-pet-tracker/` salvo las que empiezan por `docs/`,
`specs/`, `progress/` o son `.env.example`.

Regla: el reviewer no aprueba si alguna fila queda "pendiente". Para R5 la
fila registra los comandos ejecutados y las secciones escritas; **R6 la
cierra solo el humano** — ninguna IA puede poner un dispositivo físico en la
LAN con LocalStack corriendo. Ojo: R4 pasa verde sin red (firma en memoria),
así que una tabla completa sin R6 marcado **no** significa que la foto cargue
en un teléfono real.

Convención de commit: `test(aws): … (R1-R3)` y `test(media): … (R4)` en rojo
→ `fix(aws): … (R1-R4)` en verde → `docs(aws): … (R5)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida al
aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
