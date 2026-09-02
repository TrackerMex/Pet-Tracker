---
feature: "auth-email-delivery"
status: draft        # draft | approved
tags: [harness, spec, backend, security]
---

# Diseño — [[auth-email-delivery]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> `docs/architecture.md` para las reglas de capas. Todas las decisiones de
> aquí están **cerradas**: Codex las aplica, no las reabre.

## Decisiones técnicas

### D1 — Subdominio dedicado, no fusionar el SPF de la raíz (riesgo #1)

**Decisión: enviar desde un subdominio dedicado** (`<sub>.<dominio>`, nombre
concreto en DA1), verificado como dominio propio en Resend. El `from` queda
`no-reply@<sub>.<dominio>`.

**Por qué.** La regla verificada es: *«Every domain or subdomain can only have
one SPF policy, and policies on the root/apex domain are not applied to
subdomains»*. Con un subdominio dedicado:

- Los tres registros de Resend cuelgan de él (`send.<sub>.<dominio>` para MX y
  TXT SPF, `resend._domainkey.<sub>.<dominio>` para DKIM). **En la raíz no se
  crea ni se edita nada**, así que el `v=spf1` y los MX de Hostinger que dan
  servicio al buzón humano quedan literalmente intactos. El fallo de dos SPF
  en la raíz (`permerror`, que degrada la entrega **también** del buzón
  existente) pasa de "hay que tener cuidado" a **estructuralmente imposible**.
- La reputación de envío transaccional queda aislada de la del dominio raíz:
  si el subdominio se quema por rebotes, se puede quarantinar sin arrastrar el
  correo humano. Es la recomendación explícita de Resend.
- Coste: el `from` es visiblemente un subdominio. Aceptado.

**Alternativa descartada — fusionar `include:amazonses.com` en el `v=spf1` de
la raíz.** Es un edit destructivo sobre un registro que hoy sirve al correo del
humano; un error de sintaxis en esa línea rompe la entrega de su buzón, no la
de esta feature. Además, según los registros que Resend genera, **ni siquiera
haría falta**: su SPF vive en el host `send`, no en el ápex — pero verificar la
raíz deja la puerta abierta a tocarla en el futuro. El subdominio la cierra.

**Los MX no se tocan.** Resend solo envía; el MX que pide en `send.*` es para
recibir los rebotes de Amazon SES, y no compite con el MX del buzón.

**Gate.** G1 y G4 de [[requirements]]. Ningún agente toca DNS.

### D2 — Resend, y no SES ni el SMTP de Hostinger

- **SMTP de "Free Business Email" de Hostinger: descartado.** Es un buzón para
  humanos: límite de envío bajo, sin webhooks de rebote, y sus credenciales
  SMTP **son la contraseña real del buzón** — meter eso en un `.env` de
  aplicación convierte un incidente de configuración en la pérdida del correo
  del dueño del dominio.
- **SES: descartado para esta feature.** LocalStack Community no lo emula
  (`docs/architecture.md` §Adaptación local), así que no habría paridad local,
  y la cuenta nueva arranca en sandbox (solo direcciones verificadas) con una
  salida a producción que es un trámite manual con AWS.
- **Resend: elegido.** API HTTP de un solo `POST`, plan Free suficiente para el
  MVP (3.000/mes, 100/día), verificación de dominio por DNS, y funciona igual
  en local que desplegado porque es HTTPS saliente y no depende de LocalStack.

### D3 — `EMAIL_ENABLED` pasa a seleccionar adaptador (riesgo #5, parte)

Hoy `EMAIL_ENABLED` solo enciende un `logger.warn` en los adaptadores de
consola; no selecciona nada. **Decisión: le damos el papel que ya tiene
`PUSH_ENABLED` en `NotifierModule`** — la rama vive en el `useFactory` del
módulo y en ningún otro sitio (R3). Es el patrón que el repo ya usa, ya
documentado en `docs/conventions.md`, y evita inventar una sexta variable
`*_ENABLED`.

Consecuencia obligatoria: el `if (this.isEmailEnabled()) { logger.warn(...) }`
de los dos adaptadores de consola queda **inalcanzable** (con
`EMAIL_ENABLED=true` ya no se instancian) y **se borra**, junto con el helper
`isEmailEnabled` y el `ConfigService` del constructor. Dejar código muerto que
afirma que «no hay proveedor real cableado» cuando sí lo hay es peor que
borrarlo. Sus tests de esa rama se eliminan con él (allowlist 16 y 17 de R12);
el resto de `console-*-sender.spec.ts` no se toca.

### D4 — Dos adaptadores sobre un transporte compartido (riesgo #6, parte)

`PasswordResetMessage` y `EmailVerificationMessage` son **estructuralmente
idénticos**, así que una sola clase con un único `send()` no podría saber si le
toca componer un correo de reset o uno de verificación. Estructura:

```
infrastructure/email/
├── resend-client.ts                      ← transporte: fetch, timeout, contención, logs
├── resend-password-reset-sender.ts       ← implements PasswordResetSender
├── resend-email-verification-sender.ts   ← implements EmailVerificationSender
├── console-password-reset-sender.ts      ← se queda (default local)
└── console-email-verification-sender.ts  ← se queda (default local)
```

`ResendClient` es una clase plana de infraestructura, **sin token de DI**: la
instancian los dos `useFactory` de `auth.module.ts`. Dos instancias de un
envoltorio sin estado compartido son inocuas y evitan un provider más.

Contrato exacto (Codex no lo reinventa):

```ts
// resend-client.ts
export const RESEND_ENDPOINT = 'https://api.resend.com/emails';
export const RESEND_TIMEOUT_MS = 10_000;
export const RESEND_SCOPE = 'auth-email-delivery';
export const PASSWORD_RESET_SUBJECT = 'Restablece tu contraseña de Pet Tracker';
export const EMAIL_VERIFICATION_SUBJECT = 'Verifica tu email de Pet Tracker';

export class MissingResendConfigError extends Error {}

export interface ResendDelivery {
  event: string;   // 'auth.password_reset.issued' | 'auth.email_verification.issued'
  userId: string;
  to: string;
  subject: string;
  text: string;    // contiene el token en claro: JAMAS se loguea
}

export class ResendClient {
  constructor(apiKey: string, from: string, fetchImpl?: typeof fetch);
  /** Resuelve YA. La entrega sale detached y nunca rechaza (R5). */
  deliver(delivery: ResendDelivery): Promise<void>;
  /** Seam de test: resuelve cuando no queda entrega en vuelo (D6). */
  whenIdle(): Promise<void>;
}
```

El seam `fetchImpl?: typeof fetch` copia literalmente el de `ExpoPushSender`
(`constructor(private client: ExpoPushClient | null = null)`): existe porque
sin él no hay forma de probar R1/R2/R5/R7 con un doble.

### D5 — Fire-and-forget contenido en el adaptador, **no** SQS (riesgo #2)

**Decisión: el envío sale del camino del request quedándose en el proceso**:
`deliver()` arranca el `fetch` y devuelve una promesa ya resuelta; el fallo se
captura dentro y se registra. `send()` de los dos adaptadores no espera a la
respuesta HTTP y **nunca rechaza** (R5). Los `await this.resetSender.send(...)`
de la capa `application` siguen exactamente como están.

**Por qué no SQS, teniendo el patrón en casa.** Se evaluó reusar la cadena de
`NotifierConsumerService` (cola + DLQ + consumer + scheduler + gate de
entorno + provisioning en `src/aws/` y en `infra/`):

1. **Mete el token en claro en una cola.** Es el argumento que decide. Encolar
   significa persistir la credencial de reset fuera del proceso durante la
   retención de la cola, replicada en la DLQ cuando falle, legible por
   cualquiera con permiso de lectura sobre SQS. Eso es una regresión frontal
   del riesgo #4 — el que esta feature viene a cerrar — solo que cambiando
   CloudWatch por SQS. Cerrarlo obligaría a cifrar la cola con KMS y a acotar
   la retención, es decir, más infraestructura para proteger algo que hoy no
   necesita salir de la memoria del proceso.
2. **Coste desproporcionado.** ~10 ficheros nuevos, una cola y una DLQ nuevas
   en `PetTrackerDevStack` (⇒ `cdk deploy`, que es gate humano y cuesta
   dinero) y un worker más que mantener, para mover un `POST` de 200 ms.
3. **Lo que SQS compra —reintento y durabilidad— aquí vale poco.** Un correo
   de reset perdido no es pérdida de datos: el token sigue vivo en
   `password_reset_tokens` y el usuario vuelve a pulsar "he olvidado mi
   contraseña". Reintentar un correo transaccional caducable tiene además el
   efecto contrario al deseado: entregar 40 minutos tarde un token que expira
   en 60.

**Sin reintento, a propósito.** Un solo intento con timeout de
`RESEND_TIMEOUT_MS`. Si falla, queda un `logger.error` y el usuario reintenta.

**Techo declarado**: si el proceso muere entre el `return` y la respuesta de
Resend, el correo se pierde en silencio (con su `logger.error` ausente). Es la
contrapartida aceptada; la vía de mejora, si algún día importa, es una tabla
`outbox` con el **hash** del token y un reintento acotado, nunca el token en
claro en una cola.

### D6 — `whenIdle()`: el seam que hace determinista una entrega detached

Una promesa detached no se puede esperar desde un test sin `setTimeout`, y los
tests con temporizadores reales son la fuente clásica de suites intermitentes.
`ResendClient` mantiene internamente la última promesa en vuelo encadenada;
`whenIdle()` la devuelve. Los tests hacen `await client.whenIdle()` y
assertan. En producción nadie la llama.

Efecto secundario que el implementer debe respetar: el `.catch()` se engancha
**en el momento de crear** la promesa, no dentro de `whenIdle()`, para que un
fallo nunca sea un `unhandledRejection` aunque nadie espere.

### D7 — `fetch` global, sin SDK y sin dependencia nueva (riesgo #6)

**Decisión: `fetch` global de Node.** El repo corre Node 20 (`node --version`
= v20.20.2), donde `fetch` y `AbortSignal.timeout` son estándar. La API que
esta feature usa es **un** `POST` con dos cabeceras y cuatro campos: el SDK
`resend` no aporta nada sobre eso.

Lo único que el SDK simplificaría son los **webhooks de rebote**, que están
explícitamente fuera de alcance ([[requirements]] §Fuera de alcance). Cuando
se hagan, la decisión se revisa entonces: hoy sería una dependencia comprada a
crédito.

Consecuencia dura: `backend-pet-tracker/package.json` y `pnpm-lock.yaml`
**no aparecen en el diff** (R12).

### D8 — Correo de texto plano con el token pelado, sin URL (frontera con #59)

El `text` del correo lleva el token en claro y su caducidad, sin enlace y sin
`html`. Es exactamente lo que `docs/verification.md` hace copiar hoy a mano
desde el log, solo que ahora llega al buzón.

**Esta spec no fija la forma de ninguna URL** porque el emisor no la necesita:
la fija #59 `auth-reset-deep-link`, que además tiene que conservar la
propiedad de que ningún `GET` consume el token. Cuando #59 aterrice, el cambio
es el cuerpo del correo en dos ficheros; el transporte, la selección de
adaptador y el rate limiting no se tocan.

Copy fijado (el humano puede reescribirlo sin romper tests: los tests assertan
la constante exportada y la presencia del token, no un literal):

```
Tu código para restablecer la contraseña de Pet Tracker es:

<token>

Caduca el <expiresAt ISO 8601>. Si no has pedido este cambio, ignora este correo.
```

### D9 — Limitador en memoria propio, sin `@nestjs/throttler` (riesgo #3)

**Decisión: un `EmailRateLimitGuard` propio** en
`infrastructure/guards/email-rate-limit.guard.ts`, ventana fija en un `Map`.

**Por qué no `@nestjs/throttler`.** Su almacén por defecto es exactamente lo
mismo: un mapa en memoria del proceso. No compra ni distribución ni
persistencia — el techo es idéntico (D9, §Techo) — y sí trae dos costes:
una dependencia más y el riesgo de registrarlo como `APP_GUARD` (el repo ya
tiene uno, `AuthGuard`), lo que aplicaría throttling a **todos** los endpoints
de la app y tocaría todas las suites e2e. El guard propio se aplica con
`@UseGuards` sobre **dos** handlers y su radio de explosión termina ahí.

Forma:

```ts
export const EMAIL_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;   // 1 h
export const FORGOT_PASSWORD_MAX_PER_EMAIL = 3;
export const REGISTER_MAX_PER_IP = 10;
export const MAX_TRACKED_KEYS = 10_000;
```

- Clave de `forgot-password`: `forgot:${normalizeEmail(body.email)}`. Clave de
  `register`: `register:${request.ip}`. El guard decide por la ruta del
  handler, no por metadata configurable: dos casos, un `switch`.
- **El guard corre antes del caso de uso y no consulta la base**, así que su
  `429` no puede depender de si la cuenta existe (R10).
- **Body sin `email` string ⇒ no cuenta y deja pasar**, para que el `400` de
  zod siga siendo la única respuesta a un payload malformado (R3 de #44).
- **Poda**: en cada petición se descartan las entradas cuya ventana venció. Si
  aun así el mapa supera `MAX_TRACKED_KEYS`, se elimina la entrada más
  antigua. Sin esto, un bucle con emails aleatorios distintos hace crecer el
  mapa sin techo — el limitador sería él mismo el vector de DoS.
- `normalizeEmail` se importa de `@/modules/auth/domain/entities/user.entity`:
  dependencia hacia adentro (infrastructure → domain), permitida.

**Techo declarado**: memoria del proceso. Se reinicia con el proceso y no
coordina entre instancias. Vía de mejora cuando haya más de un proceso:
almacén compartido o plan de uso de API Gateway (§Deuda de [[requirements]]).

### D10 — Los números (3 y 10) y por qué R9 no lleva e2e

- **3 por email y hora en `forgot-password`.** El máximo que hace hoy la suite
  existente sobre un mismo email es **2**
  (`test/auth-forgot-password.e2e-spec.ts`, describe de R4: dos
  `requestResetToken(user.email)` seguidos). 3 deja margen de 1 y frena en
  seco el bombardeo de un buzón ajeno.
- **10 por IP y hora en `register`.** La suite e2e entera hace **una** llamada
  HTTP a `/v1/auth/register` (describe de R13 de #44); el resto de ficheros
  siembra usuarios directamente en la base. 10 no molesta a nadie y corta el
  bucle que quemaría los 100 correos/día del plan Free.
- **Si un test existente empieza a devolver `429`, no se sube el límite**: es
  señal de que algo cambió y se reporta en `progress/impl_auth-email-delivery.md`.
- **R9 no lleva e2e a propósito.** Probarlo por HTTP exigiría 11 altas en el
  mismo proceso, que dejaría el cupo por IP de `register` agotado durante una
  hora para el resto del fichero — el propio test envenenaría a sus vecinos.
  Se prueba en el spec del guard (exacto, con `jest.useFakeTimers()`) y el
  cableado sobre el handler se prueba leyendo la metadata de `@UseGuards` en
  `auth.controller.spec.ts` (R10).

### D11 — `RESEND_API_KEY`: entorno hoy, Secrets Manager cuando haya dónde (riesgo #5)

- **Local y en cualquier ejecución actual**: `.env` de la raíz del repo
  (gitignoreado), leída con `ConfigService`. `.env.example` lleva **solo el
  nombre con valor vacío** (R11); `env-drift.mjs` avisará al humano de que su
  `.env` no la tiene, que es justo el comportamiento deseado.
- **Cuando exista compute desplegada**: la clave se guarda en AWS Secrets
  Manager y la plantilla la resuelve **en tiempo de despliegue** con
  `{{resolve:secretsmanager:pet-tracker/resend:SecretString:apiKey}}`, de modo
  que el valor nunca entra en el contexto de ninguna IA ni en el repo.
  **Prohibido** `aws secretsmanager get-secret-value` / `batch-get-secret-value`
  en cualquier script o documento de este proyecto.
- **Coste**: 0,40 USD por secreto y mes, más 0,05 USD por cada 10.000 llamadas
  a la API.
- **No se implementa ahora.** `infra/lib/pet-tracker-dev-stack.ts` provisiona
  colas, una tabla, un bucket y un bus: **no hay Lambda ni API Gateway** que
  consuma el secreto. Crearlo hoy es pagar por un secreto que nadie lee. Queda
  como deuda 5 de [[requirements]] y `infra/` no aparece en el diff (R12).

### D12 — `RESEND_FROM` como variable, no como constante

El remitente depende del subdominio que el humano verifique (DA1), que no
tiene por qué entrar al repositorio. Va en `RESEND_FROM` (formato admitido por
Resend: `"Pet Tracker <no-reply@sub.dominio.tld>"`). Beneficio lateral: el
dominio del humano no queda escrito en un repositorio público.

### D13 — Falta de configuración: fallo ruidoso, nunca fallback

`EMAIL_ENABLED=true` con `RESEND_API_KEY` o `RESEND_FROM` vacías ⇒
`MissingResendConfigError` en el `useFactory`, es decir, **la app no arranca**
(R4). La alternativa —caer al adaptador de consola con un `warn`— es
precisamente el peor de los mundos: el operador cree que hay correo real, no
lo hay, y el token en claro vuelve a CloudWatch como credencial en texto
plano. Fallar en el arranque es visible en el primer segundo.

### D14 — Qué cambia exactamente en cada fichero

| Fichero | Capa | Cambio |
|---|---|---|
| `infrastructure/email/resend-client.ts` | infrastructure | **nuevo**: transporte `fetch`, timeout, contención, logs sin token (R1, R2, R5, R7) |
| `infrastructure/email/resend-password-reset-sender.ts` | infrastructure | **nuevo**: `implements PasswordResetSender`, compone el correo de reset (R1, R7) |
| `infrastructure/email/resend-email-verification-sender.ts` | infrastructure | **nuevo**: `implements EmailVerificationSender` (R2, R7) |
| `infrastructure/guards/email-rate-limit.guard.ts` | infrastructure | **nuevo**: `CanActivate` con ventana fija en memoria (R8, R9, R10) |
| `auth.module.ts` | módulo | los dos `useClass` de senders → `useFactory` con `inject: [ConfigService]`; se registra `EmailRateLimitGuard` como provider normal (**no** `APP_GUARD`) |
| `infrastructure/auth.controller.ts` | infrastructure | `@UseGuards(EmailRateLimitGuard)` sobre `register` y `forgotPassword`, más su import. Ni un cambio más |
| `infrastructure/email/console-*-sender.ts` (×2) | infrastructure | se borra la rama muerta de `EMAIL_ENABLED` y el `ConfigService` del constructor (D3) |
| `.env.example` | config | `RESEND_API_KEY=` y `RESEND_FROM=` vacías, con comentario |
| `docs/conventions.md` | docs | dos filas nuevas en la tabla de variables; la fila de `EMAIL_ENABLED` pasa a describir la selección de adaptador |
| `docs/verification.md` | docs | sección `Feature 55 — auth-email-delivery` con los gates G1–G4 paso a paso |

**Ni `domain/` ni `application/` se tocan.** Es el criterio de aceptación #1 y
es también la prueba de que la costura de puertos de #44 estaba bien puesta:
añadir un proveedor real es cambiar dos `useClass` por dos `useFactory`.

## Archivos afectados

- `backend-pet-tracker/src/modules/auth/infrastructure/email/` — infrastructure
  (3 ficheros nuevos + 3 spec nuevos, 2 adaptadores de consola podados)
- `backend-pet-tracker/src/modules/auth/infrastructure/guards/` — infrastructure
  (guard nuevo + su spec)
- `backend-pet-tracker/src/modules/auth/infrastructure/auth.controller.ts` —
  infrastructure (dos decoradores)
- `backend-pet-tracker/src/modules/auth/auth.module.ts` — composición
- `backend-pet-tracker/test/auth-email-delivery.e2e-spec.ts` — e2e nuevo
- `.env.example`, `docs/conventions.md`, `docs/verification.md` — config y docs

Lista cerrada y exhaustiva en [[requirements]] R12.

## Alternativas descartadas

- **Fusionar `include:amazonses.com` en el `v=spf1` de la raíz** (D1): edit
  destructivo sobre el registro del que depende el buzón humano.
- **SMTP del plan "Free Business Email" de Hostinger** (D2): credenciales =
  contraseña real del buzón, cuota baja, sin webhooks.
- **Amazon SES** (D2): sin emulación en LocalStack Community, y cuenta nueva en
  sandbox.
- **SDK `resend`** (D7): una dependencia para un `POST` con dos cabeceras.
- **Cola SQS para el envío** (D5): mete el token en claro en una cola y su DLQ,
  exige `cdk deploy` (gate humano, con coste) y ~10 ficheros, para comprar un
  reintento que en un token caducable vale poco.
- **`@nestjs/throttler`** (D9): mismo techo que 40 líneas propias, más una
  dependencia y el riesgo de un segundo `APP_GUARD` global.
- **Fallback silencioso al adaptador de consola si falta la clave** (D13):
  reintroduce el token en claro en el log creyendo que hay correo real.
- **Reintentos con backoff dentro del adaptador**: sin durabilidad, un
  reintento en memoria solo alarga la vida del token en RAM y puede entregar el
  correo después de que el token haya expirado.
- **Plantilla HTML y enlace en el correo**: es la feature #59, que depende de
  esta (D8).
