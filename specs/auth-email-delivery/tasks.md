---
feature: "auth-email-delivery"
status: draft        # draft | approved
tags: [harness, spec, backend, security]
---

# Tareas — [[auth-email-delivery]]

> Disciplina TDD (C4 de `CHECKPOINTS.md`). Cada tarea corresponde a un
> requisito de [[requirements]] y tiene siempre los mismos 3 sub-items, en
> este orden. **Un commit por sub-item (1) y otro por el (2)**: el rojo tiene
> que quedar en el historial antes que su verde. Formato de commit:
> `feat(auth-email-delivery): <desc> (R<n>)`.
>
> Rama: `feature/58-auth-email-delivery`. **Nada de `main`.**
>
> Orden recomendado: R5 → R1 → R2 → R7 → R3 → R4 → R6 → R8 → R9 → R10 → R11
> → R12. El transporte (R5) va primero porque los dos adaptadores se apoyan
> en él; los requisitos de rate limiting son independientes y pueden ir en
> paralelo si conviene.

## R1 — El emisor Resend publica el token de reset por `POST /emails`

- [ ] (1) Test rojo: `src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts`
      → `describe('R1: el emisor de reset publica el token en POST https://api.resend.com/emails', ...)`.
      Doble de `fetch` que captura URL, método, cabeceras y body; asserta
      `RESEND_ENDPOINT`, `Authorization: Bearer <key>`,
      `Content-Type: application/json`, y un body con `from`, `to`, `subject`
      = `PASSWORD_RESET_SUBJECT` y `text` conteniendo el token y el
      `expiresAt` ISO. Asserta además que **no** hay campo `html` ni `http`
      en el `text`.
- [ ] (2) Implementación mínima: `resend-password-reset-sender.ts` con
      `ResendPasswordResetSender implements PasswordResetSender`, que compone
      el `ResendDelivery` y llama a `ResendClient.deliver`.
- [ ] (3) Refactor con tests verdes.

## R2 — El mismo emisor real para el segundo puerto (verificación de email)

- [ ] (1) Test rojo: `src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts`
      → `describe('R2: el emisor de verificacion publica su token en POST https://api.resend.com/emails', ...)`.
      Mismo esqueleto que R1 con `EMAIL_VERIFICATION_SUBJECT`.
- [ ] (2) Implementación mínima: `resend-email-verification-sender.ts` con
      `ResendEmailVerificationSender implements EmailVerificationSender`.
- [ ] (3) Refactor: extraer a `resend-client.ts` cualquier duplicación entre
      los dos adaptadores que no sea la composición del copy.

## R3 — `EMAIL_ENABLED` selecciona los adaptadores de los DOS puertos

- [ ] (1) Test rojo: `src/modules/auth/auth.module.spec.ts`
      → `describe('R3 (auth-email-delivery): EMAIL_ENABLED selecciona los adaptadores Resend para los dos puertos', ...)`.
      Compila `AuthModule` dos veces y asserta las cuatro clases con
      `toBeInstanceOf` sobre `moduleRef.get(PASSWORD_RESET_SENDER)` y
      `moduleRef.get(EMAIL_VERIFICATION_SENDER)`. **Sufijo obligatorio**: el
      fichero ya tiene un `it('R5: …')` de `auth-login-me`.
- [ ] (2) Implementación mínima: los dos `useClass` de `auth.module.ts` pasan
      a `useFactory` con `inject: [ConfigService]`, copiando el patrón de
      `notifier.module.ts:26-33`.
- [ ] (3) Refactor: borrar la rama muerta `if (this.isEmailEnabled())` de los
      dos adaptadores de consola, su helper y el `ConfigService` del
      constructor, y eliminar los describes de esa rama en sus dos spec (D3).
      Comprobar `grep -rn "EMAIL_ENABLED" backend-pet-tracker/src/` = 2
      aciertos, ambos en `auth.module.ts`.

## R4 — Falta de configuración: el arranque falla, no cae a consola

- [ ] (1) Test rojo: `src/modules/auth/auth.module.spec.ts`
      → `describe('R4 (auth-email-delivery): EMAIL_ENABLED=true sin RESEND_API_KEY aborta el arranque', ...)`,
      dos casos (falta la clave / falta el `from`) con
      `await expect(...compile()).rejects.toThrow(MissingResendConfigError)`.
- [ ] (2) Implementación mínima: `MissingResendConfigError` en
      `resend-client.ts` y la validación en el constructor de `ResendClient`.
- [ ] (3) Refactor con tests verdes.

## R5 — Contención del fallo y salida del camino del request

- [ ] (1) Test rojo: `src/modules/auth/infrastructure/email/resend-client.spec.ts`
      → `describe('R5: deliver resuelve antes que la respuesta del proveedor y contiene cualquier fallo', ...)`.
      Tres casos: (a) `deliver()` resuelve mientras el doble de `fetch` sigue
      pendiente; (b) `fetch` que rechaza → `deliver()` resuelve y hay
      `logger.error`; (c) `fetch` que devuelve `403` → ídem. Usa
      `await client.whenIdle()` para esperar la entrega detached; **prohibido
      `setTimeout`**.
- [ ] (2) Implementación mínima: `ResendClient.deliver` arranca el `fetch` con
      `AbortSignal.timeout(RESEND_TIMEOUT_MS)`, engancha el `.catch()` **en el
      momento de crear la promesa**, la acumula en el encadenado que
      `whenIdle()` devuelve, y retorna `Promise.resolve()`.
- [ ] (3) Refactor con tests verdes.

## R6 — Un fallo del proveedor no cambia el código ni la forma de la respuesta

- [ ] (1) Test rojo: `src/modules/auth/infrastructure/auth.controller.spec.ts`
      → `describe('R6 (auth-email-delivery): forgot-password responde 200 identico aunque el emisor falle', ...)`
      (**sufijo obligatorio**, fichero compartido) y
      `test/auth-email-delivery.e2e-spec.ts`
      → `describe('R6: con el emisor lanzando, forgot-password sigue devolviendo 200 requested true', ...)`.
      La comparación es de igualdad estructural entre el caso "cuenta
      existente + emisor que lanza" y el caso "cuenta inexistente", no contra
      dos literales escritos a mano.
- [ ] (2) Implementación mínima: ya cubierta por R5 si el adaptador está bien
      hecho — si este test pasa sin tocar producción, **anotarlo en
      `progress/impl_auth-email-delivery.md`** y dejar el test como red de
      seguridad. Si falla, el arreglo va en el adaptador, nunca en el caso de
      uso ni en el controller.
- [ ] (3) Refactor con tests verdes.

## R7 — Ningún log con el token en claro ni con la API key

- [ ] (1) Test rojo: en los dos spec de adaptador,
      `describe('R7: el emisor de reset no escribe el token ni la API key en ningun log', ...)`
      y su gemelo de verificación. Espían `Logger.prototype.log/warn/error`,
      y assertan que `JSON.stringify` de **todos** los argumentos capturados
      no contiene el token ni la clave, en el camino de éxito y en el de fallo.
- [ ] (2) Implementación mínima: los logs llevan solo `scope`, `event`,
      `userId`, el `id` de Resend en el éxito, y status + `message` del
      proveedor en el fallo. El `text` del correo no se loguea nunca.
- [ ] (3) Refactor con tests verdes.

## R8 — Rate limit por email en `forgot-password`

- [ ] (1) Test rojo: `src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts`
      → `describe('R8: el cuarto forgot-password del mismo email en una hora responde 429', ...)`,
      con el caso de expiración de ventana usando `jest.useFakeTimers()`. Más
      `test/auth-email-delivery.e2e-spec.ts`
      → `describe('R8: forgot-password devuelve 429 tras agotar el cupo del email', ...)`.
- [ ] (2) Implementación mínima: `EmailRateLimitGuard` con ventana fija en un
      `Map`, poda de entradas vencidas y tope `MAX_TRACKED_KEYS`;
      `@UseGuards(EmailRateLimitGuard)` sobre `forgotPassword`.
- [ ] (3) Refactor con tests verdes.

## R9 — Rate limit por IP en `register`

- [ ] (1) Test rojo: `src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts`
      → `describe('R9: la undecima alta desde la misma IP en una hora responde 429', ...)`.
      **Sin e2e, a propósito** (D10): agotar el cupo por IP envenenaría el
      resto del fichero.
- [ ] (2) Implementación mínima: la segunda rama del `switch` del guard
      (`register:${request.ip}`) y `@UseGuards(EmailRateLimitGuard)` sobre
      `register`.
- [ ] (3) Refactor con tests verdes.

## R10 — El `429` no revela si la cuenta existe

- [ ] (1) Test rojo: `src/modules/auth/infrastructure/auth.controller.spec.ts`
      → `describe('R10 (auth-email-delivery): el 429 del rate limit no revela si la cuenta existe', ...)`
      (**sufijo obligatorio**). Cubre además que el guard está sobre
      `register` y `forgotPassword` y **no** sobre `login`, `verifyEmail` ni
      `resetPassword`, leyendo `Reflect.getMetadata('__guards__', …)`, y que
      un body sin `email` string pasa sin contarse.
- [ ] (2) Implementación mínima: el guard resuelve antes de tocar la base y su
      clave sale del body, no de la existencia de la cuenta.
- [ ] (3) Refactor con tests verdes.

## R11 — `RESEND_API_KEY` fuera del repo

- [ ] (1) Test rojo: `src/modules/auth/infrastructure/email/resend-client.spec.ts`
      → `describe('R11: RESEND_API_KEY vive solo en el entorno, nunca en el repo', ...)`,
      que lee `path.resolve(process.cwd(), '../.env.example')` y asserta las
      dos claves con valor vacío.
- [ ] (2) Implementación mínima: añadir `RESEND_API_KEY=` y `RESEND_FROM=` a
      `.env.example` con su comentario, y las dos filas a la tabla de
      `docs/conventions.md` (más la actualización de la fila `EMAIL_ENABLED`).
- [ ] (3) Refactor: ejecutar
      `git grep -nE "re_[A-Za-z0-9]{8,}|process\.env\.RESEND" -- backend-pet-tracker infra docs specs`
      y dejar la salida (vacía) anotada en el reporte.

## R12 — Regresión, contención y guía de verificación

- [ ] (1) Test rojo: `test/auth-email-delivery.e2e-spec.ts`
      → `describe('R12: con EMAIL_ENABLED por defecto los flujos de #44 siguen intactos', ...)`
      — alta, verificación de email, solicitud de reset y reset completo con
      entrega por consola y el guard nuevo activo.
- [ ] (2) Implementación mínima: lo que haga falta para que pase sin editar
      ninguna aserción de `test/auth-forgot-password.e2e-spec.ts`.
- [ ] (3) Refactor y cierre:
      - `docker compose up -d`
      - `pnpm -C backend-pet-tracker run lint`
      - `pnpm -C backend-pet-tracker exec tsc --noEmit`
      - `pnpm -C backend-pet-tracker test`
      - `pnpm -C backend-pet-tracker run test:e2e`
      - `./init.sh`
      - el `git diff --name-only origin/feature/44-auth-forgot-password...HEAD | grep -vE …`
        de R12, con salida vacía
      - sección `Feature 55 — auth-email-delivery` en `docs/verification.md`
        con los pasos de G1–G4
      - `progress/impl_auth-email-delivery.md` con la tabla de trazabilidad
        rellenada y la salida literal de cada comando

## Lo que NO hace el implementer

- No toca `domain/` ni `application/` del módulo auth.
- No añade dependencias: `package.json` y `pnpm-lock.yaml` fuera del diff.
- No toca `infra/`, `src/db/`, `src/workers/`, `mobile-pet-tracker/` ni
  `main.ts`.
- No edita `test/auth-forgot-password.e2e-spec.ts`.
- **No crea el dominio en Resend, no toca DNS y no envía ni un correo real**:
  eso es G1–G4 y lo hace el humano.
- No marca la feature como `done` en `feature_list.json`.
