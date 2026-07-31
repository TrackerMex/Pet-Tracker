---
feature: "auth-login-me"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[auth-login-me]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.

## Setup previo (no ligado a un único requisito)

No es TDD de un requisito puntual, pero bloquea a todos los R1-R15:

- [ ] Agregar dependencia `jsonwebtoken` (+ `@types/jsonwebtoken`) a
  `package.json` (`backend-pet-tracker/`)
- [ ] Agregar `JWT_SECRET` a `.env.example` (raíz del repo) y su fila
  correspondiente en la tabla de variables de entorno de
  `docs/conventions.md`, en el mismo commit que introduce el código que la
  consume (regla dura `AGENTS.md` §4)
- [ ] Extender `modules/auth/domain/ports/password-hasher.ts` con
  `verify(plainPassword, hash): Promise<boolean>` e implementarlo en
  `Argon2PasswordHasher`
- [ ] Crear `modules/auth/domain/ports/token-service.ts` (interface
  `TokenService` + token de inyección) e implementar
  `infrastructure/security/jwt-token-service.ts`
- [ ] Extender `modules/auth/domain/repositories/user.repository.ts` con
  `findByEmail`, `findById`, `updateProfile`, e implementarlos en
  `UserDrizzleRepository`
- [ ] `auth.module.ts`: registrar `{ provide: APP_GUARD, useClass:
  AuthGuard }`, exportar `USER_REPOSITORY`, registrar el provider de
  `TokenService`
- [ ] Crear `modules/auth/infrastructure/decorators/public.decorator.ts` y
  `current-user.decorator.ts`
- [ ] Crear `modules/auth/infrastructure/guards/auth.guard.ts`
- [ ] Crear el módulo `modules/users/` (estructura de capas de
  [[design]]) e importarlo en `app.module.ts`

## R1 — Login válido responde 200 con access_token

- [ ] (1) Escribir test que falla para R1
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R2 — Credenciales inválidas (email inexistente o password incorrecto) responden 401 genérico

- [ ] (1) Escribir test que falla para R2
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — Payload de login inválido (schema zod) responde 400

- [ ] (1) Escribir test que falla para R3
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — JWT firmado con claims sub/email y expiración de 24 h

- [ ] (1) Escribir test que falla para R4
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — Ruta protegida sin Authorization responde 401

- [ ] (1) Escribir test que falla para R5
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — Ruta protegida con token inválido o expirado responde 401

- [ ] (1) Escribir test que falla para R6
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — Rutas @Public() no exigen token (incluye regresión de /v1/health)

- [ ] (1) Escribir test que falla para R7
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — @CurrentUser() expone id/email del token en rutas protegidas

- [ ] (1) Escribir test que falla para R8
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — GET /v1/me responde 200 con el perfil sin password_hash

- [ ] (1) Escribir test que falla para R9
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — PATCH /v1/me parcial actualiza solo los campos provistos

- [ ] (1) Escribir test que falla para R10
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R11 — timezone inválida en PATCH /v1/me responde 400 sin persistir cambios

- [ ] (1) Escribir test que falla para R11
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R12 — country inválido en PATCH /v1/me responde 400 sin persistir cambios

- [ ] (1) Escribir test que falla para R12
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R13 — PATCH /v1/me con body vacío es no-op (200, sin auditoría)

- [ ] (1) Escribir test que falla para R13
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R14 — PATCH /v1/me exitoso audita 'user.update' con los campos modificados

- [ ] (1) Escribir test que falla para R14
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R15 — Ninguna respuesta de login/me expone password_hash

- [ ] (1) Escribir test que falla para R15
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes
