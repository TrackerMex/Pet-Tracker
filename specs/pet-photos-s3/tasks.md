---
feature: "pet-photos-s3"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[pet-photos-s3]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.

## R1 — POST photo-upload-url: camino feliz (owner + contentType válido → 200, key persistida, PUT prefirmado 10 min)

- [ ] (1) Escribir test que falla para R1: unitario de `buildPhotoKey`
      (formato `pets/<petId>/photo-<ts>`); unitario de
      `RequestPhotoUploadUrlUseCase` (persiste `photoKey` vía
      `PET_REPOSITORY.update`, pide URL a `PHOTO_STORAGE` con
      `expiresInSeconds = 600`); e2e contra LocalStack: `POST` con
      `contentType: 'image/jpeg'` como owner → `200` con `uploadUrl` y
      `expiresInSeconds: 600`, y `pets.photo_key` queda seteado en DB.
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R2 — POST photo-upload-url: contentType inválido → 400, sin persistir

- [ ] (1) Escribir test que falla para R2: unitario del DTO zod (rechaza
      ausente, vacío, y valores fuera de `{'image/jpeg','image/png',
      'image/webp'}`, ej. `'application/pdf'`, `'image/gif'`); e2e: `400` y
      `pets.photo_key` permanece sin cambios tras el intento.
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — POST photo-upload-url: rol insuficiente → 403, sin persistir

- [ ] (1) Escribir test que falla para R3: e2e con usuario `family`/`walker`/
      `vet` sobre mascota con membresía activa → `403`, `pets.photo_key` sin
      cambios.
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — POST photo-upload-url: mascota ajena/inexistente/malformada → 404

- [ ] (1) Escribir test que falla para R4: e2e con usuario B sobre mascota de
      A → `404`; `:petId` no-UUID → `404` sin tocar la base.
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — Auditoría: pet.photo_update en éxito, nada en error

- [ ] (1) Escribir test que falla para R5: unitario del use case
      (`AuditLogger.record` mockeado, verificar `action`, `entity`,
      `entityId`, `userId`, `meta.key`) en el camino feliz; verificar que NO
      se llama en los caminos 400/403/404.
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — GET /v1/pets/:petId con photo_key no nulo → photoUrl presignado GET 1 h

- [ ] (1) Escribir test que falla para R6: unitario de `GetPetUseCase`
      (`PET_PHOTO_URL_RESOLVER` mockeado, se invoca solo si `photoKey !==
      null`, con `expiresInSeconds = 3600`); unitario del mapper
      (`toPetProfileResponse` con `photoUrl` no nulo lo incluye tal cual); e2e
      contra LocalStack: tras un `POST` exitoso de R1, `GET
      /v1/pets/:petId` devuelve `photoUrl` con forma de URL prefirmada
      (contiene parámetros de firma SigV4).
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — GET /v1/pets/:petId con photo_key nulo → photoUrl: null

- [ ] (1) Escribir test que falla para R7: unitario de `GetPetUseCase`
      (`PET_PHOTO_URL_RESOLVER` NO se invoca cuando `photoKey === null`); e2e:
      mascota recién creada → `GET /v1/pets/:petId` responde `photoUrl:
      null`.
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — Bucket nunca público: solo URLs prefirmadas

- [ ] (1) Escribir test que falla para R8: e2e contra LocalStack — `GET`
      directo sobre la URL del objeto sin parámetros de firma responde
      `403`.
- [ ] (2) Implementación mínima que lo pasa (verificar que
      `provisionMediaBucket` de #2 sigue aplicado; esta feature no debe
      requerir tocarlo)
- [ ] (3) Refactor con tests verdes

## R9 — Flujo end-to-end: pedir URL, subir con PUT, leer photoUrl descargable

- [ ] (1) Escribir test que falla para R9: e2e contra LocalStack — `POST`
      photo-upload-url → `PUT` de bytes reales de una imagen fija (fixture)
      contra `uploadUrl` → `GET /v1/pets/:petId` → `GET` directo sobre el
      `photoUrl` devuelto → `200` con bytes idénticos a los subidos
      (comparación de buffer).
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes
