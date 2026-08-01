---
feature: "auth-login-me"
status: approved        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[auth-login-me]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` id 4 (description + acceptance_criteria),
> `docs/brief.md` §6 (Alta de usuario — autenticación), `docs/data-model.md`
> fila `users`, `docs/architecture.md` (adaptación local Cognito → JWT propio,
> el guard conserva el contrato `@CurrentUser()`/`@Public()`).
>
> Depende de la tabla `users` creada por `auth-registration` (#3,
> `done`) y de su `UserRepository`/`PasswordHasher` (`modules/auth/domain/`).
>
> Endpoints cubiertos: `POST /v1/auth/login`, `GET /v1/me`, `PATCH /v1/me`.
> `login` es `@Public()`; `GET/PATCH /v1/me` requieren token. Esta spec
> también introduce el `AuthGuard` global y los decoradores `@Public()` /
> `@CurrentUser()` que protegen **todas** las rutas futuras del backend.

## Requisitos funcionales

### Login

- **R1**: WHEN se envía `POST /v1/auth/login` con `email` y `password` que
  corresponden a un usuario existente en `users` (comparación de email
  case-insensitive) y `password` verifica contra el `password_hash`
  almacenado, THE SYSTEM SHALL responder `200` con un body que incluye
  `access_token` (JWT firmado, ver R4).

- **R2**: IF el `email` del payload no corresponde a ningún usuario en
  `users`, o corresponde a un usuario pero `password` no verifica contra su
  `password_hash`, THEN THE SYSTEM SHALL responder `401` con el mismo cuerpo
  de error genérico en ambos casos — la respuesta no debe permitir
  distinguir si el email existe o no.

- **R3**: IF el payload de `POST /v1/auth/login` no valida contra el schema
  zod (`email` con formato inválido, `password` ausente o vacío) THEN THE
  SYSTEM SHALL responder `400` con el detalle de validación mapeado desde
  `ZodError`, sin intentar ninguna verificación de credenciales.

- **R4**: WHEN el login definido en R1 emite un `access_token`, THE SYSTEM
  SHALL firmarlo como JWT (HS256) con `JWT_SECRET` (ver [[design]]),
  incluir como claims `sub` (igual al `id` del usuario) y `email`, y fijar
  su expiración a 24 horas desde la emisión — verificable decodificando el
  token devuelto en R1 y comprobando `exp - iat = 86400`.

### Guard global de autenticación

- **R5**: IF una petición a cualquier ruta del backend que no está marcada
  con el decorador `@Public()` llega sin header `Authorization: Bearer
  <token>` THEN THE SYSTEM SHALL responder `401` antes de invocar el
  handler de la ruta.

- **R6**: IF una petición a una ruta no marcada `@Public()` llega con un
  `Authorization: Bearer <token>` cuyo JWT no verifica (firma inválida) o
  cuyo `exp` ya pasó THEN THE SYSTEM SHALL responder `401` antes de invocar
  el handler de la ruta.

- **R7**: WHEN una petición llega a una ruta marcada con el decorador
  `@Public()` (`GET /v1/health`, `POST /v1/auth/register`, `POST
  /v1/auth/verify-email`, `POST /v1/auth/login`), THE SYSTEM SHALL invocar
  el handler sin exigir `Authorization` — con o sin token presente, la
  ausencia o invalidez de un token no produce `401` en estas rutas.

- **R8**: WHEN una petición a una ruta protegida llega con un JWT
  válido y vigente, THE SYSTEM SHALL exponer la identidad del usuario
  autenticado (`id`, `email`, extraídos de los claims `sub`/`email` del
  token) a través del decorador de parámetro `@CurrentUser()` en el handler
  — sin una consulta adicional a `users` por parte del guard.

### Perfil — lectura

- **R9**: WHEN se envía `GET /v1/me` con un JWT válido y vigente, THE SYSTEM
  SHALL responder `200` con el perfil del usuario autenticado (`id`,
  `email`, `firstName`, `lastName`, `phone`, `country`, `timezone`,
  `createdAt`, `updatedAt`), excluyendo `password_hash`.

### Perfil — actualización

- **R10**: WHEN se envía `PATCH /v1/me` con un JWT válido y un body que
  contiene cualquier subconjunto no vacío de `firstName`, `lastName`,
  `phone`, `country`, `timezone` con valores que validan, THE SYSTEM SHALL
  actualizar en `users` únicamente los campos presentes en el body, dejar
  los campos ausentes sin cambios, y responder `200` con el perfil
  actualizado (mismo shape que R9).

- **R11**: IF `PATCH /v1/me` incluye `timezone` y el valor no está en el
  conjunto devuelto por `Intl.supportedValuesOf('timeZone')` THEN THE
  SYSTEM SHALL responder `400` sin persistir ningún cambio (incluyendo los
  demás campos válidos del mismo body — la actualización es atómica).

- **R12**: IF `PATCH /v1/me` incluye `country` y el valor no valida como
  código ISO 3166-1 alpha-2 en mayúsculas (mismo formato que
  `auth-registration` R-equivalente) THEN THE SYSTEM SHALL responder `400`
  sin persistir ningún cambio.

- **R13**: IF `PATCH /v1/me` se envía con body vacío o sin ninguno de los
  campos reconocidos (`firstName`, `lastName`, `phone`, `country`,
  `timezone`) THEN THE SYSTEM SHALL responder `200` con el perfil sin
  cambios (no-op), sin escribir en `audit_log`.

- **R14**: WHEN la actualización definida en R10 se completa con éxito, THE
  SYSTEM SHALL insertar una fila en `audit_log` con `action =
  'user.update'`, `entity = 'user'`, `entity_id` y `user_id` iguales al
  `id` del usuario autenticado, y `meta` conteniendo la lista de nombres de
  campo modificados (nunca los valores anteriores o nuevos, para no
  duplicar PII fuera de `users`).

### No exposición de datos sensibles

- **R15**: WHEN el sistema construye la respuesta HTTP de `POST
  /v1/auth/login`, `GET /v1/me` o `PATCH /v1/me`, THE SYSTEM SHALL excluir
  `password_hash` de dicha respuesta — la serialización usa una lista
  explícita de campos permitidos, no la entidad completa (mismo principio
  que R14 de `auth-registration`).

## Fuera de alcance

- **Refresh tokens / logout / revocación**: el `access_token` es un JWT
  stateless que expira solo por tiempo (R4); no hay tabla de sesiones,
  blacklist ni endpoint `POST /v1/auth/logout`. Revisar cuando el flujo de
  refresh se priorice.
- **2FA**: no mencionado en `acceptance_criteria` de esta feature.
- **Login por número telefónico**: `docs/brief.md` §6 permite "correo
  electrónico o número telefónico"; esta feature solo implementa login por
  `email` porque los `acceptance_criteria` de #4 solo hablan de
  "credenciales" sin especificar teléfono, y `auth-registration` (#3) ya
  dejó explícitamente pendiente esa decisión. Login por teléfono queda para
  una spec futura si se prioriza.
- **Bloqueo de login para email no verificado**: `email_verified_at NULL`
  no impide el login — no está en `acceptance_criteria` y añadirlo sería un
  requisito no pedido. Documentado como decisión deliberada, no omisión.
- **Rate limiting / throttling** sobre `login` contra fuerza bruta o
  credential stuffing — no está en `acceptance_criteria`; mejora futura.
- **Password reset / "forgot password"** — no mencionado en esta feature
  (tampoco lo estaba en `auth-registration`).
- **Cambio de password vía `PATCH /v1/me`** — el endpoint solo actualiza
  datos de perfil (`firstName`, `lastName`, `phone`, `country`,
  `timezone`); `email` y `password` no son editables por este endpoint (no
  están en `acceptance_criteria` de #4; cambiarlos implica flujos propios
  de re-verificación fuera de alcance aquí).
- **`@RequirePetRole` / autorización sobre mascotas** — corresponde a
  `pets-crud-permissions` (#5, `pending`); el `AuthGuard` de esta spec solo
  resuelve *autenticación* (quién es el usuario), no *autorización* sobre
  recursos de negocio.
- **Migración real a Cognito** — esta spec solo preserva el contrato
  (`@CurrentUser()`, `@Public()`) para que el swap futuro sea un cambio de
  infraestructura, no de casos de uso; no se implementa integración con
  Cognito.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-07-31) ← gate obligatorio antes de implementar
