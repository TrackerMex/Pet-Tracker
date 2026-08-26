---
feature: "media-bucket-aws-mode"
status: draft        # draft | approved
tags: [harness, spec, backend]
---

# Trazabilidad — [[media-bucket-aws-mode]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/aws/media-bucket-aws-mode.spec.ts::R1: modo aws resuelve mediaBucket desde MEDIA_BUCKET_NAME`; `src/aws/resource-names.spec.ts::R3: AWS_MODE=aws fuerza sufijo vacio` (dos casos autorizados FromEnv/FromConfigService) | `64af37a test(media-bucket-aws-mode): define AWS bucket override in red (R1)` → `b3db47e feat(media-bucket-aws-mode): resolve AWS media bucket override (R1)` |
| R2 | `src/aws/media-bucket-aws-mode.spec.ts::R2: modo aws sin MEDIA_BUCKET_NAME aborta` | `452efc2 test(media-bucket-aws-mode): define missing bucket guard in red (R2)` → `8b801f2 feat(media-bucket-aws-mode): abort without AWS bucket name (R2)` |
| R3 | `src/aws/media-bucket-aws-mode.spec.ts::R3: modo aws rechaza el nombre del bucket local` | `bfb6be3 test(media-bucket-aws-mode): define local bucket rejection in red (R3)` → `62f5171 feat(media-bucket-aws-mode): reject local bucket names in AWS (R3)` |
| R4 | pendiente | pendiente |
| R5 | pendiente (skip local verificable por IA; round-trip real solo humano) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" — para R5 la
fila del implementer cubre la suite gated y su skip en modo local; el
round-trip real lo registra el humano en
`progress/impl_media-bucket-aws-mode.md` antes de que la feature pase a
`done` (ver [[requirements]] §Aprobación, segunda casilla).
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
