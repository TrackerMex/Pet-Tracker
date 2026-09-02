---
feature: "auth-email-delivery"
status: draft        # draft | approved
tags: [harness, spec, backend, security]
---

# Requisitos — [[auth-email-delivery]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D14) para las decisiones técnicas y
> `docs/architecture.md` para las reglas de capas.
>
> Fuente: `feature_list.json` id 55 (description + acceptance_criteria).
> Cierra **DA1** de `specs/auth-forgot-password/requirements.md`
> (§Decisiones abiertas). Feature de **backend puro** (NestJS + pnpm). No toca
> `mobile-pet-tracker/` — C8 de `CHECKPOINTS.md` no aplica.
>
> Rama: `feature/58-auth-email-delivery`, creada desde
> `origin/feature/44-auth-forgot-password` (PR #93, aprobada por el reviewer,
> **aún sin mergear a `main`**). Los diffs de contención de R12 se calculan
> contra `origin/feature/44-auth-forgot-password`, **no** contra `origin/main`.
>
> Aplican `docs/conventions.md`: `ConfigService` en vez de `process.env`,
> alias `@/...` para cruces de capa, toda variable de entorno nueva a la tabla
> de `docs/conventions.md` y a `.env.example` en el mismo commit, tests que
> nombran su R-id.
>
> Contratos verificados contra el código real de esta rama el 2026-08-29
> (`src/modules/auth/**`, `src/workers/notifier/**`, `infra/lib/pet-tracker-dev-stack.ts`,
> `backend-pet-tracker/package.json`, `.env.example`, `env-drift.mjs`,
> `test/auth-forgot-password.e2e-spec.ts`).

## Contexto fijo (no reabrir)

Todo lo de esta sección está verificado en el código o contra documentación
citada, y está **cerrado**. Codex no tiene acceso a la conversación que
originó esta spec: nada de aquí se renegocia durante la implementación.

### La costura que ya existe

- **Dos** puertos de dominio, no uno, cada uno con un único método
  `send(message): Promise<void>`:
  - `src/modules/auth/domain/ports/password-reset-sender.ts` — token
    `PASSWORD_RESET_SENDER` (`Symbol`), interface `PasswordResetSender`,
    mensaje `PasswordResetMessage`.
  - `src/modules/auth/domain/ports/email-verification-sender.ts` — token
    `EMAIL_VERIFICATION_SENDER`, interface `EmailVerificationSender`,
    mensaje `EmailVerificationMessage`.
- **Los dos mensajes son estructuralmente idénticos**: `{ userId: string;
  email: string; token: string; expiresAt: Date }`. Consecuencia dura: **una
  sola clase no puede implementar los dos puertos** — tendría un único
  `send()` incapaz de distinguir un reset de una verificación. Van **dos
  adaptadores** sobre **un transporte compartido** ([[design]] §D4).
- Adaptadores actuales, que **no se borran ni se modifican**:
  `infrastructure/email/console-password-reset-sender.ts` (evento
  `auth.password_reset.issued`) y `console-email-verification-sender.ts`
  (evento `auth.email_verification.issued`).
- Cableado actual en `auth.module.ts:51-58`: dos entradas `useClass` a los
  adaptadores de consola.
- Consumidores: `RegisterUserUseCase.issueVerificationToken`
  (`register-user.use-case.ts:85`) y `RequestPasswordResetUseCase.execute`
  (`request-password-reset.use-case.ts:52`), ambos con `await sender.send(...)`
  **en línea, dentro del request**. Ninguno de los dos se toca: `domain` y
  `application` quedan intactos (criterio de aceptación #1).

### El precedente exacto de esta feature: `PUSH_ENABLED` (#13)

`src/workers/notifier/notifier.module.ts:26-33` es el patrón canónico de
selección de adaptador por entorno en este repo, y esta feature lo copia:

```ts
{
  provide: PUSH_SENDER,
  inject: [ConfigService],
  useFactory: (config: ConfigService): PushSender =>
    config.get<string>('PUSH_ENABLED') === 'true'
      ? new ExpoPushSender()
      : new ConsolePushSender(),
}
```

La rama vive **solo** en el `useFactory` del módulo; ni el caso de uso ni el
consumer saben qué adaptador tienen inyectado. `EMAIL_ENABLED` pasa a jugar
exactamente ese papel para los dos puertos de auth (R3, [[design]] §D3).

### Qué hace hoy `EMAIL_ENABLED` y qué pasa a hacer

- Hoy (`console-*-sender.ts:15-19` y `:20-24`): `EMAIL_ENABLED === 'true'`
  solo emite un `logger.warn` diciendo que no hay proveedor cableado, y
  loguea el token igualmente. **No selecciona adaptador.**
- Desde esta feature: `EMAIL_ENABLED === 'true'` selecciona los adaptadores
  Resend para **los dos** puertos; cualquier otro valor (incluida la
  ausencia) deja los de consola. El `logger.warn` de los adaptadores de
  consola queda **muerto por construcción** y se elimina de los dos ficheros
  ([[design]] §D3): con Resend cableado, la rama `EMAIL_ENABLED=true` ya no
  puede alcanzar el adaptador de consola.

### Relación con R1/R2/R10 de #44 (requisitos heredados que NO se pueden romper)

- **R1/R2 de #44**: `POST /v1/auth/forgot-password` responde `200
  { requested: true }` **idéntico** exista o no la cuenta. Un `await` sobre
  una llamada HTTP saliente rompe esto por dos vías: (a) cientos de ms de
  diferencia entre la rama con cuenta y la rama sin cuenta — enumeración por
  timing; (b) si Resend falla, el `await` lanza y el endpoint responde `500`
  **solo** para cuentas que existen, que es un oráculo exacto de una sola
  petición. R5 y R6 cierran las dos vías.
- **R10 de #44** dice: *«WHILE no exista proveedor de correo cableado, el
  único lugar donde el token en claro es observable SHALL ser el log
  estructurado»*. Es un requisito con cláusula `WHILE`: al cablear Resend la
  condición deja de cumplirse y R10 **no queda violado, queda fuera de su
  guarda**. Esta feature no toca ese requisito ni sus tests; R7 fija el
  comportamiento del régimen nuevo.
- **Canal de timing preexistente**: la rama "cuenta existe" hace `UPDATE` +
  `INSERT` + `INSERT` de auditoría, y la rama "no existe" no hace nada. #44
  lo dejó **fuera de alcance** con justificación (`design.md` §D3). Esta
  feature **no lo cierra y no afirma cerrarlo**: solo garantiza no
  empeorarlo con cientos de ms de HTTP saliente.

### Infraestructura del humano (confirmada 2026-08-29)

- Dominio propio en **Hostinger**, con panel DNS y hosting web incluido.
- Plan de correo "Free Business Email" de Hostinger: es un **buzón para
  humanos**, no una API de envío. **Queda descartado como emisor** — límite
  de envío bajo, las credenciales SMTP son la contraseña real del buzón y no
  hay webhooks de rebote. La spec **no propone SMTP** en ningún punto.
- El dominio raíz ya tiene MX y un `v=spf1` de Hostinger. Los MX **no se
  tocan**: Resend solo envía.

### Hechos verificados sobre Resend (fuentes citadas, 2026-08-29)

| Hecho | Fuente |
|---|---|
| Envío = `POST https://api.resend.com/emails`, headers `Authorization: Bearer re_…` y `Content-Type: application/json` | `resend.com/docs/api-reference/emails/send-email` |
| Body mínimo: `from`, `to`, `subject`, y `html` **o** `text` | ídem |
| Éxito `200` con body `{ "id": "<uuid>" }` | ídem |
| Errores: `401 missing_api_key`, `403 validation_error` (dominio no verificado), `429 rate_limit_exceeded` / `daily_quota_exceeded` / `monthly_quota_exceeded`, `400 validation_error`, `422 missing_required_field`, `500`, `503` | `resend.com/docs/api-reference/errors` |
| Plan Free: **3.000 emails/mes**, **100/día**, 3 dominios. Primer plan de pago: Pro, 20 USD/mes, 50.000/mes | `resend.com/pricing` |
| «Every domain or subdomain can only have one SPF policy, and policies on the root/apex domain are not applied to subdomains» | KB de Resend sobre SPF / return path |
| Resend **recomienda** enviar desde un subdominio, no desde la raíz, «to isolate your sending reputation» | `resend.com/docs/dashboard/domains/introduction` |
| Registros que Resend pide en Hostinger: `MX` en host `send` → `feedback-smtp.<region>.amazonses.com` prio 10; `TXT` en host `send` → `v=spf1 include:amazonses.com ~all`; `TXT` en host `resend._domainkey` → `p=…`. «Omit your domain from the record values» | `resend.com/docs/knowledge-base/hostinger` |
| AWS Secrets Manager: **0,40 USD por secreto y mes** + 0,05 USD por 10.000 llamadas | `aws.amazon.com/secrets-manager/pricing` |

**Incertidumbres declaradas (no inventar valores):**

1. El valor exacto del `MX` (`feedback-smtp.<region>.amazonses.com`), la
   región y el `p=` del DKIM **los genera el panel de Resend por dominio**.
   La spec **no los fija**: el humano copia literalmente lo que el panel
   muestre (gate G1).
2. La documentación de Hostinger consultada muestra el DKIM como `TXT` en
   `resend._domainkey`; otras guías de Resend usan `CNAME` según proveedor.
   **Se usa lo que muestre el panel**, no lo que diga esta spec.
3. El límite de peticiones por segundo de la API de Resend no aparece
   cuantificado en la doc consultada (solo el código `429
   rate_limit_exceeded`). El diseño trata el `429` como un fallo más,
   contenido por R5, y no asume ningún número.

### Estado del despliegue (decisivo para el secreto)

Verificado en `infra/lib/pet-tracker-dev-stack.ts` (115 líneas):
`PetTrackerDevStack` provisiona **solo** colas SQS, una tabla DynamoDB, un
bucket S3 y un EventBus. **No hay Lambda, ni API Gateway, ni ninguna compute
desplegada** que lea variables de entorno de CloudFormation. Consecuencia
cerrada: el mecanismo de Secrets Manager se **documenta** (D11) pero **no se
implementa en esta feature** — no hay dónde inyectarlo. Ver §Fuera de alcance.

### Contrato HTTP: qué cambia y qué no

| Endpoint | Antes | Después |
|---|---|---|
| `POST /v1/auth/forgot-password` | `200 { requested: true }` / `400` payload inválido | **igual**, más `429` cuando se supera el límite por email (R8) |
| `POST /v1/auth/register` | `201` / `400` / `409` | **igual**, más `429` cuando se supera el límite por IP (R9) |
| `POST /v1/auth/reset-password`, `verify-email`, `login` | — | **sin cambios**: no disparan correo, no se limitan |

## Requisitos funcionales

### Emisor real por Resend

- **R1**: WHEN el sistema corre con `EMAIL_ENABLED=true` y
  `RequestPasswordResetUseCase` invoca `PasswordResetSender.send(message)`,
  THE SYSTEM SHALL enviar una petición `POST https://api.resend.com/emails`
  con cabeceras `Authorization: Bearer <RESEND_API_KEY>` y
  `Content-Type: application/json`, y body JSON con exactamente los campos
  `from` (valor de `RESEND_FROM`), `to` (`message.email`), `subject`
  (constante exportada `PASSWORD_RESET_SUBJECT`) y `text`, donde `text`
  contiene `message.token` en claro y `message.expiresAt` en ISO 8601; AND
  SHALL no incluir ningún campo `html` ni ninguna URL ([[design]] §D8: el
  enlace es la feature #59).
  *Tests (ROJO primero):*
  - `src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts`
    → `describe('R1: el emisor de reset publica el token en POST https://api.resend.com/emails', ...)`
    — con un doble de `fetch` que captura URL, método, cabeceras y body.

- **R2**: WHEN el sistema corre con `EMAIL_ENABLED=true` y
  `RegisterUserUseCase` invoca `EmailVerificationSender.send(message)`, THE
  SYSTEM SHALL enviar la misma petición que R1 con `subject` igual a la
  constante exportada `EMAIL_VERIFICATION_SUBJECT` y un `text` propio que
  contiene el token de verificación. Este requisito existe por separado a
  propósito: si solo se cablea el emisor de reset, **el alta de usuarios
  sigue entregando su token por log** y la feature no cumple su criterio de
  aceptación #1.
  *Tests (ROJO primero):*
  - `src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts`
    → `describe('R2: el emisor de verificacion publica su token en POST https://api.resend.com/emails', ...)`

- **R3**: WHILE `EMAIL_ENABLED === 'true'`, THE SYSTEM SHALL resolver
  `PASSWORD_RESET_SENDER` como `ResendPasswordResetSender` y
  `EMAIL_VERIFICATION_SENDER` como `ResendEmailVerificationSender`; WHILE
  `EMAIL_ENABLED` tenga cualquier otro valor o esté ausente, THE SYSTEM
  SHALL resolverlos como `ConsolePasswordResetSender` y
  `ConsoleEmailVerificationSender`. La rama SHALL vivir **únicamente** en dos
  `useFactory` de `auth.module.ts`: ningún caso de uso, controller ni
  adaptador SHALL leer `EMAIL_ENABLED` (tras esta feature, `grep -rn
  "EMAIL_ENABLED" backend-pet-tracker/src/` devuelve exactamente dos
  aciertos, ambos en `auth.module.ts`).
  *Tests (ROJO primero):*
  - `src/modules/auth/auth.module.spec.ts`
    → `describe('R3 (auth-email-delivery): EMAIL_ENABLED selecciona los adaptadores Resend para los dos puertos', ...)`
    — compila `AuthModule` dos veces (con y sin `EMAIL_ENABLED=true`) y
    asserta `moduleRef.get(PASSWORD_RESET_SENDER)` y
    `moduleRef.get(EMAIL_VERIFICATION_SENDER)` con `toBeInstanceOf` de las
    cuatro clases. Fichero **compartido** (ya tiene un `it('R5: …')` de
    `auth-login-me`) ⇒ sufijo obligatorio.

- **R4**: IF `EMAIL_ENABLED === 'true'` y `RESEND_API_KEY` o `RESEND_FROM`
  están ausentes o vacíos THEN THE SYSTEM SHALL lanzar
  `MissingResendConfigError` durante la construcción del módulo (arranque
  fallido, ruidoso), AND SHALL **no** caer de vuelta al adaptador de consola.
  Un fallback silencioso reintroduciría el token en claro en CloudWatch
  creyendo que el correo se está entregando, que es exactamente el riesgo
  que esta feature cierra.
  *Tests (ROJO primero):*
  - `src/modules/auth/auth.module.spec.ts`
    → `describe('R4 (auth-email-delivery): EMAIL_ENABLED=true sin RESEND_API_KEY aborta el arranque', ...)`
    — dos casos: falta la clave, falta el `from`; ambos con
    `await expect(Test.createTestingModule({...}).compile()).rejects.toThrow()`.

### Contención del fallo y salida del camino del request

- **R5**: THE SYSTEM SHALL garantizar que la promesa devuelta por
  `PasswordResetSender.send` y por `EmailVerificationSender.send` en los
  adaptadores Resend **resuelve sin esperar a la respuesta HTTP del
  proveedor**, AND SHALL nunca rechazar ni lanzar: IF la llamada a Resend
  lanza (red caída, DNS, `AbortSignal.timeout` de `RESEND_TIMEOUT_MS`) o
  devuelve un status distinto de 2xx (`401`, `403`, `429`, `500`, `503`)
  THEN THE SYSTEM SHALL registrar un `logger.error` con `scope`, `event`,
  `userId` y el status/mensaje devuelto por el proveedor, y la promesa de
  `send` SHALL seguir resolviendo. No hay reintento: [[design]] §D5 lo
  justifica.
  *Tests (ROJO primero):*
  - `src/modules/auth/infrastructure/email/resend-client.spec.ts`
    → `describe('R5: deliver resuelve antes que la respuesta del proveedor y contiene cualquier fallo', ...)`
    — tres casos: (a) `deliver()` resuelve mientras el doble de `fetch` sigue
    pendiente (se comprueba con un promise que no se resuelve nunca y
    `Promise.race` contra un tick); (b) `fetch` que rechaza → `deliver()`
    resuelve y hay un `logger.error`; (c) `fetch` que devuelve `403` →
    ídem. El seam `whenIdle()` ([[design]] §D6) permite esperar la entrega
    detached de forma determinista, sin temporizadores.

- **R6**: WHEN `POST /v1/auth/forgot-password` recibe un email que
  **sí** corresponde a una cuenta y el emisor de correo falla, THE SYSTEM
  SHALL responder `200` con body exactamente `{ "requested": true }` —
  estructuralmente idéntico a la respuesta de un email inexistente (R2 de
  #44) — AND SHALL no propagar ninguna excepción al controller. Este es el
  requisito que impide que un fallo de Resend se convierta en un oráculo de
  enumeración de cuentas de una sola petición.
  *Tests (ROJO primero):*
  - `src/modules/auth/infrastructure/auth.controller.spec.ts`
    → `describe('R6 (auth-email-delivery): forgot-password responde 200 identico aunque el emisor falle', ...)`
    — fichero **compartido** (ya tiene `R1..R10` de `auth-registration` y de
    `auth-forgot-password`) ⇒ sufijo obligatorio. El test compara `status` y
    `body` del caso "cuenta existente + emisor que lanza" contra el caso
    "cuenta inexistente" con igualdad estructural, no contra dos literales.
  - `test/auth-email-delivery.e2e-spec.ts`
    → `describe('R6: con el emisor lanzando, forgot-password sigue devolviendo 200 requested true', ...)`
    — sobreescribe `PASSWORD_RESET_SENDER` con un doble cuyo `send` lanza,
    igual que `test/auth-forgot-password.e2e-spec.ts` sobreescribe los dos
    senders con dobles.

### No exposición del token con el emisor real activo

- **R7**: WHILE los adaptadores Resend están activos, THE SYSTEM SHALL no
  escribir en ningún log el token en claro, ni el `text` del correo (que lo
  contiene), ni el valor de `RESEND_API_KEY`: los logs de los adaptadores y
  del cliente SHALL contener únicamente `scope`, `event`, `userId`, el
  `id` que Resend devuelve en el éxito, y en el fallo el status y el
  `message` del proveedor.
  *Tests (ROJO primero):*
  - `src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts`
    → `describe('R7: el emisor de reset no escribe el token ni la API key en ningun log', ...)`
  - `src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts`
    → `describe('R7: el emisor de verificacion no escribe el token ni la API key en ningun log', ...)`
    — ambos espían `Logger.prototype.log/warn/error` y assertan que
    `JSON.stringify` de **todos** los argumentos capturados no contiene ni el
    token ni la clave, en el camino de éxito y en el de fallo.

### Rate limiting de los endpoints públicos que disparan correo

- **R8**: WHEN `POST /v1/auth/forgot-password` recibe más de
  `FORGOT_PASSWORD_MAX_PER_EMAIL` (**3**) peticiones con el mismo email
  normalizado (`normalizeEmail`) dentro de una ventana de
  `EMAIL_RATE_LIMIT_WINDOW_MS` (**3.600.000 ms**, una hora), THE SYSTEM
  SHALL responder `429` a la petición sobrante **sin** ejecutar
  `RequestPasswordResetUseCase` — sin emitir token, sin invalidar los
  anteriores, sin auditar y sin llamar al emisor.
  *Tests (ROJO primero):*
  - `src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts`
    → `describe('R8: el cuarto forgot-password del mismo email en una hora responde 429', ...)`
    — incluye el caso de que la ventana expira (`jest.useFakeTimers()`, avance
    de `EMAIL_RATE_LIMIT_WINDOW_MS + 1`) y la cuarta petición vuelve a pasar.
  - `test/auth-email-delivery.e2e-spec.ts`
    → `describe('R8: forgot-password devuelve 429 tras agotar el cupo del email', ...)`

- **R9**: WHEN `POST /v1/auth/register` recibe más de
  `REGISTER_MAX_PER_IP` (**10**) peticiones desde la misma IP
  (`request.ip`) dentro de `EMAIL_RATE_LIMIT_WINDOW_MS`, THE SYSTEM SHALL
  responder `429` sin ejecutar `RegisterUserUseCase` — sin crear usuario, sin
  emitir token de verificación y sin llamar al emisor. La clave es la IP y no
  el email porque en `register` cada email es nuevo por definición: limitar
  por email no frenaría el bucle que quema la cuota de 100 correos/día del
  plan Free.
  *Test (ROJO primero):*
  - `src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts`
    → `describe('R9: la undecima alta desde la misma IP en una hora responde 429', ...)`
  - **Este requisito NO lleva test e2e**, deliberadamente: agotar el cupo por
    IP dentro del proceso e2e envenenaría el presupuesto de `register` del
    resto del fichero durante una hora ([[design]] §D10). El cableado del
    guard sobre el handler se cubre en `auth.controller.spec.ts` (R10).

- **R10**: THE SYSTEM SHALL emitir el `429` de R8 en función **exclusiva**
  del ritmo de peticiones, nunca de si la cuenta existe: WHEN se agota el
  cupo de un email registrado y el de un email no registrado, THE SYSTEM
  SHALL responder en ambos casos con el mismo status (`429`) y el mismo body,
  AND para peticiones dentro del cupo SHALL seguir respondiendo `200
  { requested: true }` en los dos casos. IF el body no trae un `email` de
  tipo `string` THEN el guard SHALL dejar pasar la petición sin contarla,
  para que el `400` de zod (R3 de #44) siga siendo la única respuesta a un
  payload malformado.
  *Tests (ROJO primero):*
  - `src/modules/auth/infrastructure/auth.controller.spec.ts`
    → `describe('R10 (auth-email-delivery): el 429 del rate limit no revela si la cuenta existe', ...)`
    — fichero compartido ⇒ sufijo obligatorio. Cubre además que
    `EmailRateLimitGuard` está aplicado sobre `register` y sobre
    `forgotPassword` y **no** sobre `login`, `verifyEmail` ni
    `resetPassword`, leyendo la metadata de `@UseGuards` con
    `Reflect.getMetadata('__guards__', AuthController.prototype.<handler>)`.

### Higiene del secreto

- **R11**: THE SYSTEM SHALL leer `RESEND_API_KEY` y `RESEND_FROM`
  únicamente vía `ConfigService`, AND SHALL no contener en ningún fichero
  versionado un valor real de ninguna de las dos: `.env.example` SHALL
  declarar `RESEND_API_KEY=` y `RESEND_FROM=` **vacías** (solo el nombre),
  AND `docs/conventions.md` SHALL documentar ambas en su tabla de variables
  de entorno, AND ningún fichero de `backend-pet-tracker/src/` ni de
  `backend-pet-tracker/test/` SHALL contener la subcadena `re_` como
  literal de clave ni `process.env.RESEND`.
  *Test (ROJO primero):*
  - `src/modules/auth/infrastructure/email/resend-client.spec.ts`
    → `describe('R11: RESEND_API_KEY vive solo en el entorno, nunca en el repo', ...)`
    — lee `path.resolve(process.cwd(), '../.env.example')` (el `.env` vive en
    la raíz del repo, `docs/conventions.md` §Variables de entorno; el `cwd`
    de jest es `backend-pet-tracker/`) y asserta que contiene las líneas
    `RESEND_API_KEY=` y `RESEND_FROM=` con valor vacío.
  *Verificación adicional (implementer y reviewer, fuera de jest):*
  ```bash
  git grep -nE "re_[A-Za-z0-9]{8,}|process\.env\.RESEND" -- backend-pet-tracker infra docs specs
  ```
  debe salir **vacío**.

### Regresión y contención

- **R12**: WHEN se ejecutan `pnpm -C backend-pet-tracker run lint`,
  `pnpm -C backend-pet-tracker exec tsc --noEmit`,
  `pnpm -C backend-pet-tracker test`,
  `pnpm -C backend-pet-tracker run test:e2e` (con `docker compose up -d`) y
  `./init.sh` tras los cambios, THE SYSTEM SHALL salir con exit 0 y sin
  ninguna regresión en las suites existentes — en particular
  `test/auth-forgot-password.e2e-spec.ts` (R1–R13 de #44) SHALL seguir en
  verde sin editar ninguna de sus aserciones; AND el diff de la feature SHALL
  tocar **solo** los ficheros de esta allowlist:

  **Nuevos**
  1. `backend-pet-tracker/src/modules/auth/infrastructure/email/resend-client.ts`
  2. `backend-pet-tracker/src/modules/auth/infrastructure/email/resend-client.spec.ts`
  3. `backend-pet-tracker/src/modules/auth/infrastructure/email/resend-password-reset-sender.ts`
  4. `backend-pet-tracker/src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts`
  5. `backend-pet-tracker/src/modules/auth/infrastructure/email/resend-email-verification-sender.ts`
  6. `backend-pet-tracker/src/modules/auth/infrastructure/email/resend-email-verification-sender.spec.ts`
  7. `backend-pet-tracker/src/modules/auth/infrastructure/guards/email-rate-limit.guard.ts`
  8. `backend-pet-tracker/src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts`
  9. `backend-pet-tracker/test/auth-email-delivery.e2e-spec.ts`

  **Modificados (y solo en lo que dice [[design]] §D14)**
  10. `backend-pet-tracker/src/modules/auth/auth.module.ts` — los dos
      `useClass` de los senders pasan a `useFactory`; nada más
  11. `backend-pet-tracker/src/modules/auth/auth.module.spec.ts` — describes
      nuevos de R3 y R4; el `it` existente no se toca
  12. `backend-pet-tracker/src/modules/auth/infrastructure/auth.controller.ts`
      — solo `@UseGuards(EmailRateLimitGuard)` sobre `register` y
      `forgotPassword` y su import
  13. `backend-pet-tracker/src/modules/auth/infrastructure/auth.controller.spec.ts`
      — describes nuevos de R6 y R10; los existentes no se tocan
  14. `backend-pet-tracker/src/modules/auth/infrastructure/email/console-password-reset-sender.ts`
      — **solo** se borra la rama muerta `if (this.isEmailEnabled())` con su
      `logger.warn`, el helper `isEmailEnabled` y la dependencia
      `ConfigService` del constructor (D3)
  15. `backend-pet-tracker/src/modules/auth/infrastructure/email/console-email-verification-sender.ts`
      — ídem
  16. `backend-pet-tracker/src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts`
      — se elimina el describe de la rama `EMAIL_ENABLED=true` que acaba de
      dejar de existir; el describe de la rama `false` no se toca
  17. `backend-pet-tracker/src/modules/auth/infrastructure/email/console-email-verification-sender.spec.ts`
      — ídem
  18. `.env.example` — dos claves nuevas vacías con su comentario
  19. `docs/conventions.md` — dos filas nuevas en la tabla de variables y
      actualización de la fila `EMAIL_ENABLED`
  20. `docs/verification.md` — sección `Feature 55 — auth-email-delivery`

  **Harness** (siempre permitido): `specs/auth-email-delivery/**`,
  `progress/**`, `feature_list.json`, `STATUS.md`.

  AND el diff SHALL **no** tocar: `backend-pet-tracker/package.json` ni
  `pnpm-lock.yaml` (**esta feature no añade ninguna dependencia**, D7),
  `mobile-pet-tracker/`, `infra/`, `src/modules/auth/domain/`,
  `src/modules/auth/application/`, `src/db/`, `src/workers/`,
  `test/auth-forgot-password.e2e-spec.ts`, `auth.guard.ts` ni `main.ts`.
  *Test (ROJO primero):* `test/auth-email-delivery.e2e-spec.ts`
  → `describe('R12: con EMAIL_ENABLED por defecto los flujos de #44 siguen intactos', ...)`
  — con la configuración por defecto (`EMAIL_ENABLED=false`) registra un
  usuario, verifica su email, pide un reset y lo completa, comprobando que la
  entrega sigue siendo por consola y que el guard nuevo no interfiere.
  *Verificación de contención:* el implementer la anota en
  `progress/impl_auth-email-delivery.md`; el reviewer la re-ejecuta con
  ```bash
  git diff --name-only origin/feature/44-auth-forgot-password...HEAD | grep -vE \
    'infrastructure/email/|infrastructure/guards/email-rate-limit|auth\.module|auth\.controller|auth-email-delivery|^\.env\.example$|docs/conventions\.md|docs/verification\.md|^specs/|^progress/|feature_list\.json|STATUS\.md'
  ```
  que debe salir **vacío**.

## Fuera de alcance

- **El enlace del correo, la plantilla HTML y la pantalla de reset en la
  app.** Es la feature **#59 `auth-reset-deep-link`**, ya registrada como
  `pending` y dependiente de esta. Esta spec **no fija la forma de la URL**
  porque el emisor no la necesita: el correo lleva el token pelado, que es
  exactamente lo que `docs/verification.md` hace copiar hoy a mano. Cuando
  #59 aterrice, el único cambio es el `text` (o `html`) de los dos
  adaptadores.
- **Webhooks de rebote y de quejas de Resend** (`email.bounced`,
  `email.complained`). Requieren un endpoint público, verificación de firma
  y una tabla de supresión. Feature propia; ver §Deuda.
- **El SDK oficial `resend`**. Se usa `fetch` global (D7).
- **Secrets Manager en la stack**. `PetTrackerDevStack` no tiene compute que
  consuma el secreto (§Contexto fijo). El mecanismo queda escrito en
  [[design]] §D11 para cuando exista, con su coste; crearlo hoy sería pagar
  0,40 USD/mes por un secreto que nadie lee.
- **Revocar los `access_token` ya emitidos tras un reset.** Deuda anotada de
  #44 (ventana de hasta 24 h), sin cambios.
- **Cerrar el canal de timing preexistente** de `forgot-password` ni el
  oráculo de enumeración de `POST /v1/auth/register` (`409` vs `201`). Ambos
  siguen fuera de alcance con la justificación de #44.
- **Rate limiting de `login`** (fuerza bruta), de `reset-password` o de
  `verify-email`. Ninguno dispara correo; el criterio de aceptación acota a
  los que sí. Sigue en la deuda de #44.
- **Rate limiting distribuido o persistente.** El limitador es en memoria y
  por proceso (D9): se reinicia con el proceso y no coordina entre
  instancias. Es el mismo techo que el almacén por defecto de
  `@nestjs/throttler`, así que la dependencia no habría comprado nada.
- **DMARC** (`_dmarc`) y política de alineación. No hace falta para entregar
  con SPF+DKIM verificados y el volumen del MVP está muy por debajo de los
  umbrales de remitente masivo. Anotado en §Deuda.
- **Notificar por correo que la contraseña cambió**, reenvío del token de
  verificación, y cualquier otro correo transaccional nuevo. Esta feature
  cablea los dos correos que ya existen, no inventa un tercero.
- **Retirar el `logger.warn` de `ConsolePushSender`** o tocar el notifier.
  Otro módulo, otra variable.

## Decisiones abiertas (las cierra el humano, no una IA)

- **DA1 — Subdominio emisor concreto.** [[design]] §D1 decide **enviar desde
  un subdominio dedicado** y no desde la raíz; el nombre exacto
  (`mail.<dominio>`, `notificaciones.<dominio>`, …) y el buzón del `from`
  (`no-reply@…`) los elige el humano al crear el dominio en Resend. No entra
  al repo: viaja en `RESEND_FROM`.
- **DA2 — Plan de Resend.** El plan Free (100 correos/día) basta para el MVP
  y para el gate G3. Si el uso real lo supera, el salto es Pro a 20 USD/mes.
  Decisión de coste ⇒ humano.

## Gates humanos (no delegables a ninguna IA)

Ninguno de estos pasos lo ejecuta Codex ni ningún subagente: crean recursos
externos, tocan DNS de producción o envían correo real.

- **G1 — Dominio verificado en Resend.** Crear la cuenta, dar de alta el
  subdominio de DA1, copiar **literalmente** al panel DNS de Hostinger los
  tres registros que Resend muestre (MX en `send`, TXT SPF en `send`, TXT
  DKIM en `resend._domainkey`), **sin tocar ni el MX ni el TXT `v=spf1` de
  la raíz**, y esperar a que Resend marque el dominio como verificado.
- **G2 — API key.** Crear la clave en Resend y ponerla en el `.env` de la
  raíz del repo (gitignoreado). Nunca en `.env.example`, nunca en un commit.
- **G3 — Envío real de extremo a extremo.** Con `EMAIL_ENABLED=true`: (a)
  `POST /v1/auth/forgot-password` con una dirección propia, confirmar que el
  correo llega a la bandeja de entrada (no a spam) y que su token completa
  `POST /v1/auth/reset-password`; (b) `POST /v1/auth/register` con otra
  dirección propia y confirmar que su token completa
  `POST /v1/auth/verify-email`. Los dos flujos, no solo el de reset.
- **G4 — Comprobación de que el buzón humano sigue vivo.** Tras tocar el
  DNS: enviar y recibir un correo con el buzón de Hostinger del dominio. Es
  el control de que G1 no degradó el correo existente.

El reviewer **no aprueba** la feature hasta que el humano confirme G1–G4 por
escrito en `progress/`.

## Deuda que esta feature deja anotada (para el backlog del leader)

1. **`request.ip` detrás de proxy.** El limitador de R9 usa `request.ip`, que
   con Express y `trust proxy` desactivado (el default, y lo que hay hoy en
   `main.ts`) es la IP del socket. Si algún día el backend queda detrás de un
   ALB, CloudFront o Nginx, **todas** las peticiones compartirían la IP del
   proxy y `register` quedaría limitado a 10/hora **globalmente**. Precondición
   de despliegue: `app.set('trust proxy', 1)` en `main.ts` en el mismo cambio
   que introduzca el proxy. No se hace ahora porque hoy no hay proxy y activarlo
   sin uno delante permite falsificar `X-Forwarded-For`.
2. **DoS de baja intensidad sobre el reset ajeno.** Con R8, un tercero puede
   quemar los 3 intentos por hora del email de una víctima y dejarla sin
   recuperar contraseña durante esa ventana. Aceptado: la víctima puede seguir
   entrando con su contraseña actual y la ventana es corta. Cerrarlo del todo
   exige captcha o prueba de trabajo, que es otra feature.
3. **Webhooks de rebote/queja de Resend + lista de supresión.** Sin ellos, un
   correo a una dirección muerta se reintenta a mano indefinidamente y los
   rebotes cuentan contra la reputación del subdominio.
4. **DMARC** en `_dmarc.<subdominio>` con `p=none` para empezar a recibir
   informes de alineación.
5. **Secrets Manager** cuando exista compute desplegada (D11), con su coste de
   0,40 USD por secreto y mes.
6. **Rate limiting distribuido** (almacén compartido o plan de uso de API
   Gateway) cuando haya más de un proceso sirviendo la API.
7. Sigue viva toda la deuda de #44 no cerrada aquí: revocación de sesiones,
   timing de `forgot-password`, oráculo del `409` de `register`, y
   `mobile-forgot-password`.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
- [ ] DA1 (subdominio emisor) y DA2 (plan de Resend) cerradas (fecha: ____)
