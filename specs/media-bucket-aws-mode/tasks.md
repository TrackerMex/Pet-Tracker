---
feature: "media-bucket-aws-mode"
status: draft        # draft | approved
tags: [harness, spec, backend]
---

# Tareas — [[media-bucket-aws-mode]]

> Disciplina TDD (CHECKPOINTS C4): cada requisito con commit rojo→verde
> explícito — el test rojo se commitea ANTES que la implementación que lo
> pasa. Ver [[requirements]] para el detalle de cada R y [[design]] para
> las decisiones D1–D7.

## R1 — Modo aws resuelve `mediaBucket` desde `MEDIA_BUCKET_NAME`

- [x] (1) Escribir test que falla para R1
      (`src/aws/media-bucket-aws-mode.spec.ts` §R1: FromEnv,
      FromConfigService y provider `AWS_RESOURCE_NAMES`; ajustar los dos
      `it` de `resource-names.spec.ts` §R3 al contrato nuevo — quedan
      rojos también)
- [x] (2) Implementación mínima que lo pasa (override en los dos
      resolvers de `resource-names.ts`, [[design]] §D1)
- [x] (3) Refactor con tests verdes

## R2 — Modo aws sin `MEDIA_BUCKET_NAME` aborta el arranque

- [x] (1) Escribir test que falla para R2 (§R2: ausente/vacía/espacios
      lanza `MissingMediaBucketNameError` en ambos resolvers y en
      `compile()` del módulo)
- [x] (2) Implementación mínima que lo pasa (clase + guard, [[design]] §D2)
- [x] (3) Refactor con tests verdes

## R3 — Modo aws rechaza el nombre del bucket local

- [x] (1) Escribir test que falla para R3 (§R3:
      `'pet-tracker-media-local'` y `'pet-tracker-media-local-test'`
      lanzan `LocalMediaBucketNameError`; un nombre real no lanza)
- [x] (2) Implementación mínima que lo pasa ([[design]] §D3)
- [x] (3) Refactor con tests verdes

## R4 — Modo local intacto + regresión + contención

- [ ] (1) Escribir test que falla para R4 (§R4: `MEDIA_BUCKET_NAME`
      definida en modo local se ignora sin lanzar; casos con/sin
      variable y con/sin `NODE_ENV=test`)
- [ ] (2) Implementación mínima que lo pasa (normalmente ya verde tras
      R1–R3 si el override solo aplica en modo aws — confirmar)
- [ ] (3) Refactor con tests verdes + `.env.example` bloque comentado
      ([[design]] §D6) + `lint`/`test`/`test:e2e`/`./init.sh` exit 0 +
      verificación de contención del diff (comando grep en
      [[requirements]] R4) anotada en
      `progress/impl_media-bucket-aws-mode.md`

## R5 — Smoke real de media (gated, cierre humano)

- [ ] (1) Escribir la suite gated `test/aws-real-media.e2e-spec.ts`
      ([[design]] §D7) y verificar que en modo local aparece **skipped**
      (ese es el "rojo" verificable por IA: la suite existe, está gated
      y no toca red)
- [ ] (2) Escribir `docs/verification.md` §`Feature 51 —
      media-bucket-aws-mode`: prerrequisitos (los de Features 19/21 +
      `MEDIA_BUCKET_NAME` obtenida con `aws s3 ls | grep
      pet-tracker-media`), comando de la suite gated y pasos curl del
      flujo app (`POST photo-upload-url` → `PUT` → `GET
      /v1/pets/:petId` → descargar `photoUrl`)
- [ ] (3) **HUMANO**: ejecutar la suite gated y el flujo curl contra la
      cuenta real, registrar el resultado en
      `progress/impl_media-bucket-aws-mode.md` y marcar la casilla R5 de
      [[requirements]] §Aprobación — sin esto la feature NO pasa a `done`
