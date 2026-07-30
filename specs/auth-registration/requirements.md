---
feature: "auth-registration"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[auth-registration]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` id 3 (description + acceptance_criteria),
> `docs/brief.md` §6 (Alta de usuario), `docs/data-model.md` fila `users`,
> `docs/architecture.md` (adaptación local SES → `EMAIL_ENABLED=false`).
>
> Endpoints cubiertos: `POST /v1/auth/register`, `POST /v1/auth/verify-email`.
> Ninguno de los dos requiere autenticación previa (son `@Public()`).

## Requisitos funcionales

### Registro

- **R1**: WHEN se envía `POST /v1/auth/register` con `firstName`, `lastName`,
  `email`, `phone`, `password`, `passwordConfirmation` igual a `password`,
  `country`, `termsAccepted=true` (con o sin `timezone`) y el `email` no
  existe previamente en `users`, THE SYSTEM SHALL responder `201` con un
  body que incluye `id` en formato UUIDv7, crear una fila en `users` con
  `password_hash` (nunca el password en claro), `phone`, `country`,
  `timezone` (el valor recibido o `'UTC'` si se omitió),
  `terms_accepted_at` seteado a la hora de la petición y
  `email_verified_at = NULL`.

- **R2**: IF el `email` del payload ya existe en `users` (comparación
  case-insensitive) THEN THE SYSTEM SHALL responder `409` sin modificar
  ninguna fila existente ni crear una nueva.

- **R3**: IF `passwordConfirmation` del payload no es idéntico a `password`
  THEN THE SYSTEM SHALL responder `400` y no crear ninguna fila en `users`.

- **R4**: IF `termsAccepted` está ausente o es `false` THEN THE SYSTEM SHALL
  responder `400` y no crear ninguna fila en `users`.

- **R5**: IF el payload de registro no valida contra el schema zod (`email`
  con formato inválido, `password` de menos de 8 caracteres, o cualquier
  campo requerido de `firstName`, `lastName`, `email`, `phone`, `password`,
  `passwordConfirmation`, `country`, `termsAccepted` ausente) THEN THE
  SYSTEM SHALL responder `400` con el detalle de validación mapeado desde
  `ZodError`, sin crear ninguna fila en `users`.

### Verificación de email

- **R6**: WHEN el registro definido en R1 se completa con éxito, THE SYSTEM
  SHALL generar un token de verificación de un solo uso asociado al usuario
  creado, con una expiración futura registrada, y loguearlo en un log
  estructurado (`EMAIL_ENABLED=false`, ver [[design]]) en vez de enviarlo
  por email real.

- **R7**: WHEN se completa el registro definido en R1, THE SYSTEM SHALL
  omitir el token de verificación del body de la respuesta HTTP — el token
  solo es observable en el log estructurado del servidor, nunca en la
  respuesta al cliente.

- **R8**: WHEN se envía `POST /v1/auth/verify-email` con un `token` que
  existe, no expiró y no fue usado previamente, THE SYSTEM SHALL responder
  `200`, setear `users.email_verified_at` a la hora de la petición para el
  usuario asociado al token, y marcar ese token como usado (no reutilizable
  en una petición posterior).

- **R9**: IF el `token` enviado a `POST /v1/auth/verify-email` no existe (no
  corresponde a ningún token emitido) THEN THE SYSTEM SHALL responder `400`
  sin modificar `email_verified_at` de ningún usuario.

- **R10**: IF el `token` enviado a `POST /v1/auth/verify-email` existe pero
  su expiración ya pasó THEN THE SYSTEM SHALL responder `410` sin setear
  `email_verified_at`.

- **R11**: IF el `token` enviado a `POST /v1/auth/verify-email` ya fue usado
  en una verificación anterior (exitosa) THEN THE SYSTEM SHALL responder
  `400` sin volver a setear `email_verified_at` ni generar una segunda
  entrada de auditoría `user.email_verified`.

### Auditoría

- **R12**: WHEN el registro definido en R1 se completa con éxito, THE SYSTEM
  SHALL insertar una fila en `audit_log` con `action = 'user.register'`,
  `entity = 'user'`, `entity_id` igual al `id` del usuario creado y
  `user_id` igual a ese mismo `id`.

- **R13**: WHEN la verificación definida en R8 se completa con éxito, THE
  SYSTEM SHALL insertar una fila en `audit_log` con
  `action = 'user.email_verified'`, `entity = 'user'`, `entity_id` y
  `user_id` iguales al `id` del usuario verificado.

### No exposición de datos sensibles

- **R14**: WHEN el sistema construye la respuesta HTTP de `POST
  /v1/auth/register` o de cualquier otro endpoint futuro de este módulo que
  serialice un usuario, THE SYSTEM SHALL excluir `password_hash` de dicha
  respuesta — la serialización usa una lista explícita de campos permitidos,
  no la entidad completa.

- **R15**: THE SYSTEM SHALL no persistir en ninguna tabla el valor recibido
  en `passwordConfirmation` — no existe columna para ese campo (ver
  `docs/data-model.md`, fila `users`), es exclusivamente de validación en el
  borde HTTP.

## Fuera de alcance

- Login (`POST /v1/auth/login`), emisión de JWT, `AuthGuard` global,
  decoradores `@Public()` / `@CurrentUser()` — corresponden a la feature
  `auth-login-me` (#4, aún `pending`). Esta spec sólo asume que los dos
  endpoints que define (`register`, `verify-email`) son públicos; no define
  el mecanismo de "público" en sí.
- Reenvío de un nuevo token de verificación (`resend`) para un usuario que
  perdió o dejó expirar el suyo — no está en `acceptance_criteria` de esta
  feature. El diseño de la tabla de tokens (ver [[design]]) no lo bloquea,
  pero el endpoint no se implementa aquí.
- Recuperación/reseteo de contraseña ("forgot password") — no mencionado en
  `docs/brief.md` §6 ni en los `acceptance_criteria` de esta feature.
- Verificación de teléfono — el brief §6 sólo pide verificación de correo.
- Rate limiting / throttling sobre `register` o `verify-email` contra abuso
  o fuerza bruta — no está en los `acceptance_criteria`; se deja como mejora
  futura.
- Envío real de email (SES) — local corre con `EMAIL_ENABLED=false` (log
  estructurado); la integración real queda para el deploy AWS del plan
  original (`docs/architecture.md`).
- Autenticación por número telefónico mencionada en brief §6 ("La
  autenticación debe utilizar correo electrónico o número telefónico") — el
  login (no esta feature) decide con qué identificador se autentica.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
