---
feature: "auth-forgot-password"
status: approved     # draft | approved
tags: [harness, spec, backend]
---

# Tareas — [[auth-forgot-password]]

> Disciplina TDD (`docs/verification.md` §Disciplina TDD). Cada tarea
> corresponde a un requisito de [[requirements]] y tiene siempre los mismos 3
> sub-items, en este orden: **rojo → verde → refactor**.
>
> **Un commit por bloque de requisitos, nunca todo en uno.** El historial
> debe mostrar el patrón test-primero (C4 de `CHECKPOINTS.md`): en #19 Codex
> metió implementación + tests + docs en un solo commit y eso incumple C4.
> Formato: `feat(auth-forgot-password): <desc> (R1,R2)`.
>
> `traceability.md` se actualiza **en cada commit**, no al final.

## T0 — Andamiaje (sin requisito propio, es prerrequisito de R1)

No es TDD porque no aporta comportamiento observable; es el esqueleto que los
tests de R1 necesitan para compilar. Se commitea junto al rojo de R12.

- [ ] `src/db/schema/password-reset-tokens.schema.ts` ([[design]] §D5)
- [ ] `export *` en `src/db/schema/index.ts`
- [ ] `pnpm -C backend-pet-tracker run db:generate`; renombrar el `.sql`
      generado a `0015_auth_password_reset_tokens.sql` y ajustar el `tag` de
      la entrada `idx: 15` en `migrations/meta/_journal.json`
- [ ] Aplicar la migración contra el Postgres local y confirmar que la tabla
      y el índice existen

## R12 — La migración 0015 crea `password_reset_tokens` con FK indexada

- [ ] (1) Test rojo: `src/db/schema/password-reset-tokens.schema.spec.ts` →
      `describe('R12: password_reset_tokens espeja el patron de email_verification_tokens', ...)`
      (columnas, tipos, nullability, UNIQUE de `token_hash`, índice
      `password_reset_tokens_user_id_idx`, y el SQL de `0015_*` leído del
      disco — patrón de `push-tokens.schema.spec.ts`)
- [ ] (2) Implementación mínima: T0
- [ ] (3) Refactor: fila nueva en el catálogo de `docs/data-model.md`
      ([[design]] §D5), tests verdes

> Commit: `feat(auth-forgot-password): password_reset_tokens table and 0015 migration (R12)`

## R1 — Solicitud con cuenta existente emite token hasheado con TTL de 1 h

- [ ] (1) Test rojo: `request-password-reset.use-case.spec.ts` →
      `describe('R1: la solicitud con cuenta existente emite un token hasheado con expiracion de una hora', ...)`
      + `auth.controller.spec.ts` →
      `describe('R1: POST /v1/auth/forgot-password responde 200 con requested true', ...)`
- [ ] (2) Implementación mínima: entidad, errores, puerto, interface de
      repositorio, `PASSWORD_RESET_TOKEN_TTL_MS`, `ForgotPasswordSchema`,
      `RequestPasswordResetUseCase`, repositorio Drizzle,
      `ConsolePasswordResetSender`, handler `forgotPassword` y providers en
      `auth.module.ts`
- [ ] (3) Refactor con tests verdes

## R2 — Respuesta idéntica exista o no la cuenta

- [ ] (1) Test rojo: `request-password-reset.use-case.spec.ts` →
      `describe('R2: la solicitud con email inexistente no emite token ni revela la ausencia de cuenta', ...)`
      + `auth.controller.spec.ts` →
      `describe('R2: POST /v1/auth/forgot-password responde igual exista o no la cuenta', ...)`
      (compara `status` y `body` de ambos casos, no dos literales)
- [ ] (2) Implementación mínima: `return` silencioso cuando `findByEmail`
      devuelve `null`
- [ ] (3) Refactor con tests verdes

## R3 — Payload inválido de `forgot-password` → 400

- [ ] (1) Test rojo: `auth.controller.spec.ts` →
      `describe('R3: POST /v1/auth/forgot-password con payload invalido responde 400', ...)`
- [ ] (2) Implementación mínima: `parseBody(ForgotPasswordSchema, body)` en
      el handler
- [ ] (3) Refactor con tests verdes

## R4 — Emitir un token invalida los tokens de reset anteriores del usuario

- [ ] (1) Test rojo: `request-password-reset.use-case.spec.ts` →
      `describe('R4: una nueva solicitud invalida los tokens de reset anteriores del usuario', ...)`
      (verifica también el **orden**: `invalidateAllForUser` antes de `create`)
- [ ] (2) Implementación mínima: `invalidateAllForUser` en repositorio y use
      case ([[design]] §D8)
- [ ] (3) Refactor con tests verdes

> Commit: `feat(auth-forgot-password): POST /v1/auth/forgot-password with uniform response (R1,R2,R3,R4)`

## R5 — Token vigente cambia el password y consume todos los tokens del usuario

- [ ] (1) Test rojo: `reset-password.use-case.spec.ts` →
      `describe('R5: el token vigente cambia el password y consume todos los tokens del usuario', ...)`
      + `auth.controller.spec.ts` →
      `describe('R5: POST /v1/auth/reset-password con token valido responde 200', ...)`
- [ ] (2) Implementación mínima: `ResetPasswordSchema`,
      `ResetPasswordUseCase`, `updatePasswordHash` en `UserRepository` y
      `UserDrizzleRepository`, handler `resetPassword`, provider del use case.
      **Añadir `updatePasswordHash: jest.fn()` a los cuatro dobles de
      `UserRepository`** listados en [[design]] §D9 — sin tocar sus
      aserciones
- [ ] (3) Refactor con tests verdes

## R6 — Token inexistente o ya consumido → 400

- [ ] (1) Test rojo: `reset-password.use-case.spec.ts` →
      `describe('R6: un token inexistente o ya consumido no cambia ningun password', ...)`
      + `auth.controller.spec.ts` →
      `describe('R6: POST /v1/auth/reset-password con token invalido o usado responde 400', ...)`
- [ ] (2) Implementación mínima: `InvalidPasswordResetTokenError` →
      `BadRequestException`
- [ ] (3) Refactor con tests verdes

## R7 — Token expirado → 410

- [ ] (1) Test rojo: `reset-password.use-case.spec.ts` →
      `describe('R7: un token expirado no cambia el password', ...)`
      + `auth.controller.spec.ts` →
      `describe('R7: POST /v1/auth/reset-password con token expirado responde 410', ...)`
- [ ] (2) Implementación mínima: `PasswordResetTokenExpiredError` →
      `GoneException`
- [ ] (3) Refactor con tests verdes

## R8 — Payload inválido de `reset-password` → 400

- [ ] (1) Test rojo: `auth.controller.spec.ts` →
      `describe('R8: POST /v1/auth/reset-password con payload invalido responde 400', ...)`
      (password corto, confirmación distinta, token vacío)
- [ ] (2) Implementación mínima: `parseBody(ResetPasswordSchema, body)` antes
      de invocar el use case
- [ ] (3) Refactor con tests verdes

> Commit: `feat(auth-forgot-password): POST /v1/auth/reset-password single-use token flow (R5,R6,R7,R8)`

## R10 — El token nunca sale en la respuesta ni se persiste en claro

- [ ] (1) Test rojo: `console-password-reset-sender.spec.ts` →
      `describe('R10: con EMAIL_ENABLED=false el token de reset se loguea en vez de enviarse', ...)`
      y `describe('R10: con EMAIL_ENABLED=true avisa de que no hay proveedor real cableado', ...)`
      + `auth.controller.spec.ts` →
      `describe('R10: la respuesta de forgot-password nunca incluye el token', ...)`
- [ ] (2) Implementación mínima: `ConsolePasswordResetSender` con
      `event: 'auth.password_reset.issued'` y el `logger.warn`
- [ ] (3) Refactor con tests verdes

## R11 — Auditoría de solicitud y de reset

- [ ] (1) Test rojo: `request-password-reset.use-case.spec.ts` →
      `describe('R11: la solicitud con cuenta existente audita user.password_reset_requested y la inexistente no audita nada', ...)`
      + `reset-password.use-case.spec.ts` →
      `describe('R11: el reset exitoso audita user.password_reset', ...)`
- [ ] (2) Implementación mínima: `auditLogger.record` en ambos use cases
      ([[design]] §D10)
- [ ] (3) Refactor con tests verdes

> Commit: `feat(auth-forgot-password): structured-log delivery and audit trail (R10,R11)`

## R9 — Tras el reset, el login viejo falla y el nuevo funciona (e2e)

- [ ] (1) Test rojo: `test/auth-forgot-password.e2e-spec.ts` →
      `describe('R9: tras el reset el login viejo falla y el nuevo funciona', ...)`
      (contra Postgres real, `docker compose up -d`)
- [ ] (2) Implementación mínima: ya cubierta por R5; el rojo aquí prueba el
      cableado extremo a extremo
- [ ] (3) Refactor con tests verdes

## R13 — Regresión y contención

- [ ] (1) Test rojo: `test/auth-forgot-password.e2e-spec.ts` →
      `describe('R13: el flujo de verify-email sigue intacto tras anadir el reset', ...)`
      (un token de `email_verification_tokens` no sirve como token de reset y
      viceversa) + los e2e restantes del fichero para R2, R4, R5 y R10
- [ ] (2) Implementación mínima: nada nuevo — si falla, el fallo está en el
      código de R1–R12
- [ ] (3) Verificación de contención: correr `lint`, `tsc --noEmit`, `test`,
      `test:e2e` e `init.sh` (todo exit 0) y el `git diff --name-only` filtrado
      de [[requirements]] R13, que debe salir **vacío**. Anotar la salida en
      `progress/impl_auth-forgot-password.md`
- [ ] (4) Sección `Feature 44 — auth-forgot-password` en `docs/verification.md`

> Commit: `test(auth-forgot-password): e2e flow, login round-trip and containment (R9,R13)`

## Cierre

- [ ] `traceability.md` sin ninguna fila "pendiente"
- [ ] `progress/impl_auth-forgot-password.md` con: comandos ejecutados, salida
      de la verificación de contención, y **cualquier decisión que haya
      quedado abierta** (DA1/DA2 de [[requirements]] no las cierra el
      implementer)
- [ ] `./init.sh` verde
