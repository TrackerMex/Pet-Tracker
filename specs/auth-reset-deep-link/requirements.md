---
feature: "auth-reset-deep-link"
status: approved   # draft | spec_ready | approved
tags: [harness, spec, backend, mobile, security]
---

# Requisitos — [[auth-reset-deep-link]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D12) para las decisiones técnicas,
> `docs/architecture.md` para las capas del backend y `docs/ui-guidelines.md`
> para la carta de UI móvil (aplica entera: grep-clean, heroui-native,
> estructura route delgado + screen).
>
> Fuente: `feature_list.json` id 59 (description + acceptance_criteria).
> Cierra la DA2 de `specs/auth-forgot-password/requirements.md` (#44) y la
> frontera declarada en `specs/auth-email-delivery/design.md` §D8 (#58).
> Contratos verificados contra el código real el 2026-09-02
> (`backend-pet-tracker/src/modules/auth/**`, `mobile-pet-tracker/app.json`,
> `app.config.ts`, `src/app/**`, `src/api/auth.ts`, `.env.example` raíz y
> móvil, `infra/lib/`).
>
> Aplican `docs/conventions.md`: backend NestJS + pnpm (zod en el borde,
> `ConfigService`, tests con R-id); móvil = isla bun + jest-expo, route
> delgado en `src/app/` + pantalla en `src/screens/<x>/index.tsx`.

## Contexto fijo (no reabrir)

Todo lo de esta sección está verificado en el código y **cerrado**. Codex no
tiene acceso a la conversación que originó esta spec: nada de aquí se
renegocia durante la implementación.

### Contrato del token (#44) — esta feature NO lo toca

- El token de reset es opaco, 256 bits base64url, TTL 1 h
  (`PASSWORD_RESET_TOKEN_TTL_MS`), un solo uso, solo su SHA-256 en base.
- **Solo `POST /v1/auth/reset-password` lo consume**
  (`backend-pet-tracker/src/modules/auth/infrastructure/auth.controller.ts`,
  handlers en líneas 142–173; ambos `@Public()`, prefijo global `v1`).
  Mapeo HTTP existente: `400` token inexistente/usado, `410` expirado,
  `400` con `errors[]` si el payload no valida (zod). `200 { "reset": true }`
  en éxito. Payload: `{ token, password, passwordConfirmation }`.
- **Propiedad de seguridad innegociable**: el token viaja en la URL del
  correo y los clientes de correo hacen *prefetch* de enlaces GET. Por tanto
  **ningún GET puede consumir ni invalidar el token** — ni en el backend, ni
  en la página web, ni en la app al abrirse. Abrir el enlace N veces sigue
  permitiendo completar el reset exactamente una vez (R11).
- Ni `domain/` ni `application/` del backend se tocan. No hay endpoint nuevo,
  ni migración, ni cambio de rate limiting (#58 R8–R10 quedan como están).

### Frontera con #58 (mergeada) — qué fija esta spec

- Hoy el correo de reset es **texto plano con el token pelado, sin URL y sin
  `html`** (`specs/auth-email-delivery/design.md` §D8). #58 no fijó la forma
  de la URL a propósito: **la fija esta spec** (D1).
- El cambio de cuerpo toca exactamente
  `src/modules/auth/infrastructure/email/resend-password-reset-sender.ts` y
  `console-password-reset-sender.ts` (más sus specs y el `useFactory` de
  `PASSWORD_RESET_SENDER` en `auth.module.ts`). El transporte
  (`resend-client.ts`), la selección de adaptador y el rate limiting **no se
  tocan**.
- Restricción heredada de `resend-client.ts` (verificada, línea 140): el
  método privado `sanitize` extrae el secreto a redactar como **el segundo
  párrafo** del `text` (`text.split(/\r?\n\r?\n/)[1]`). Consecuencia dura
  para el copy: **el token pelado sigue siendo el segundo párrafo del
  correo**; la URL se añade en un párrafo posterior (D4). Reordenar los
  párrafos rompería la redacción de logs de #58 R7.
- Los tests de #58 assertan la constante exportada del subject y la
  *presencia* del token, no un literal del copy. El único assert de #58 que
  esta feature invalida a propósito es
  `expect(body.text).not.toEqual(expect.stringContaining('http'))` del
  describe R1 de `resend-password-reset-sender.spec.ts` — era exactamente la
  frontera #58↔#59 y se elimina (allowlist R12, [[design]] §D4).
- El describe `R3 (auth-email-delivery)` de `auth.module.spec.ts` construye
  el módulo con `EMAIL_ENABLED=true`; al añadir la validación de R3 de esta
  spec necesita `RESET_LINK_HOST` en su doble de config (una línea,
  allowlist R12). `test/auth-email-delivery.e2e-spec.ts` corre con
  `EMAIL_ENABLED` por defecto (consola) y no se ve afectado.

### Estado móvil verificado

- `mobile-pet-tracker/app.json` declara `scheme: "mobilepettracker"` y
  `android.package: "com.trackermex.pettracker"`. **No hay `intentFilters`**
  ni App Links. Expo SDK 57, Expo Router (`src/app/`), typedRoutes.
- `src/app/(auth)/forgot.tsx` es el stub deshabilitado de `specs/mobile-auth`
  R9 — **sigue siéndolo** (§Fuera de alcance). No existe ninguna ruta que
  reciba el token.
- `src/app/(auth)/_layout.tsx` hace `<Redirect href="/home" />` si hay
  sesión, y `src/app/index.tsx` redirige por estado de auth. Por eso la ruta
  nueva vive en el **nivel raíz** de `src/app/`, fuera de `(auth)` y de
  `(tabs)` (D6): un deep link debe funcionar con y sin sesión.
- Precedente de config dinámica: `GOOGLE_MAPS_API_KEY_ANDROID` se inyecta en
  build time vía `mobile-pet-tracker/app.config.ts` (sin prefijo
  `EXPO_PUBLIC_`, con warn si falta) y se prueba en `app.config.test.ts`.
  R4 replica ese patrón exacto para los intent filters.
- Cliente HTTP: `src/api/auth.ts` expone `login`/`register` como funciones
  `(baseUrl, body, fetchFn = fetch)` que devuelven uniones discriminadas por
  `kind`; las pantallas leen `process.env.EXPO_PUBLIC_API_URL`. R7 replica el
  patrón para `resetPassword`.

### No hay API pública ni frontend web (decisivo para la página fallback)

- Verificado en `infra/lib/`: el stack provisiona colas, tabla, bucket y bus —
  **no hay Lambda ni API Gateway**. El backend solo corre en local/docker.
  Una página web que hiciera `fetch` a la API no tendría a qué llamar (D5):
  la página fallback es **estática pura, sin ninguna petición de red**.
- El hosting web de Hostinger del dominio propio está disponible (confirmado
  por el humano 2026-08-29). Servir ficheros estáticos (incluido
  `/.well-known/assetlinks.json`) es todo lo que esta feature le pide.

### La URL canónica del enlace (contrato fijado)

```
https://<RESET_LINK_HOST>/reset-password?token=<token>
```

- `RESET_LINK_HOST` es una variable de entorno nueva: host pelado, sin
  esquema, sin path, sin slash final (ej. `app.midominio.tld`). Vive en el
  `.env` de la raíz (backend, correo) y en `mobile-pet-tracker/.env` (build
  Android, intent filters). El dominio real del humano **no entra al
  repositorio** (mismo criterio que `RESEND_FROM`, #58 D12).
- El esquema es siempre `https` (App Links no verifican otra cosa) y el path
  es la constante exportada `PASSWORD_RESET_PATH = '/reset-password'` (D1).
- El token va en query param, no en el path (D1): la página fallback puede
  ser un único `index.html` estático y la ruta Expo un fichero estático
  (`reset-password.tsx` + `useLocalSearchParams`), sin ruta dinámica.

### Gates humanos (bloquean el cierre, no delegables a IA)

Ver la tabla de [[traceability]] (G1–G4): fingerprint SHA-256 del
certificado de firma del **dev build de Android** (lo aporta el humano; en el
repo queda el placeholder `REPLACE_WITH_DEV_BUILD_SHA256`), subida de
`hosting/` a Hostinger, variables `RESET_LINK_HOST` en los dos `.env`, y
smoke final en dev build de Android (nunca Expo Go) abriendo el enlace real
desde el correo.

## Requisitos funcionales

### Backend — el correo lleva el enlace

- **R1**: WHEN `EMAIL_ENABLED=true` y se emite un correo de reset, THE
  SYSTEM SHALL incluir en el `text` del correo la URL
  `https://<RESET_LINK_HOST>/reset-password?token=<token>` compuesta por
  `buildPasswordResetUrl(host, token)` (fichero nuevo
  `src/modules/auth/infrastructure/email/password-reset-link.ts`, que
  exporta también `PASSWORD_RESET_PATH = '/reset-password'`), con el token
  pasado por `encodeURIComponent` y el host normalizado sin slash final;
  AND SHALL conservar el token pelado como **segundo párrafo** del correo
  (restricción de `sanitize`, §Contexto fijo), el subject
  `PASSWORD_RESET_SUBJECT` y el formato texto plano **sin campo `html`**.
  *Tests (ROJO primero):*
  - `src/modules/auth/infrastructure/email/password-reset-link.spec.ts`
    → `describe('R1: buildPasswordResetUrl compone https://<host>/reset-password?token=<token>', ...)`
    (host con y sin slash final; token con caracteres que exigen encoding)
  - `src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts`
    → `describe('R1 (auth-reset-deep-link): el correo de reset incluye la URL del enlace ademas del token', ...)`
    (asserta `stringContaining(buildPasswordResetUrl(host, message.token))`,
    que el token sigue siendo el segundo párrafo y que `html` sigue ausente)

- **R2**: WHILE `EMAIL_ENABLED` no es `true` (adaptador de consola), IF
  `RESET_LINK_HOST` está configurada THEN `ConsolePasswordResetSender` SHALL
  añadir al log estructurado de `auth.password_reset.issued` un campo
  `resetUrl` con la misma URL de R1, conservando intactos los cinco campos
  existentes (`event`, `userId`, `email`, `token`, `expiresAt`); AND IF
  `RESET_LINK_HOST` está ausente o vacía THEN el log SHALL ser exactamente
  el de #44 (sin `resetUrl`), sin warn y sin fallo — el default local
  (`.env.example` con la variable vacía) sigue funcionando out-of-the-box.
  *Tests (ROJO primero):*
  `src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts`
  → `describe('R2 (auth-reset-deep-link): con RESET_LINK_HOST el log incluye resetUrl', ...)`
  y `describe('R2 (auth-reset-deep-link): sin RESET_LINK_HOST el log queda como en #44', ...)`

- **R3**: IF `EMAIL_ENABLED=true` AND `RESET_LINK_HOST` está ausente o vacía
  THEN THE SYSTEM SHALL abortar el arranque lanzando
  `MissingResendConfigError(['RESET_LINK_HOST'])` desde el constructor de
  `ResendPasswordResetSender` (mismo patrón fail-fast que #58 D13/R4: un
  correo real con enlace roto o sin enlace es peor que no arrancar). El
  `useFactory` de `PASSWORD_RESET_SENDER` en `auth.module.ts` SHALL pasar
  `config.get<string>('RESET_LINK_HOST') ?? ''` al adaptador Resend y
  `... ?? null` al de consola; el resto del factory no cambia.
  *Test (ROJO primero):* `src/modules/auth/auth.module.spec.ts`
  → `describe('R3 (auth-reset-deep-link): EMAIL_ENABLED=true sin RESET_LINK_HOST aborta el arranque', ...)`

### Móvil — App Links y pantalla de reset

- **R4**: WHEN la config de Expo se resuelve con la variable de entorno
  `RESET_LINK_HOST` definida y no vacía (build time, sin prefijo
  `EXPO_PUBLIC_`), `mobile-pet-tracker/app.config.ts` SHALL declarar en
  `android.intentFilters` exactamente un filtro
  `{ autoVerify: true, action: 'VIEW', data: [{ scheme: 'https', host: <RESET_LINK_HOST>, pathPrefix: '/reset-password' }], category: ['BROWSABLE', 'DEFAULT'] }`
  preservando el resto de la config de `app.json`; AND IF la variable está
  ausente, vacía o solo espacios THEN SHALL emitir un único `console.warn`
  que nombre `RESET_LINK_HOST` y `docs/verification.md`, no declarar
  `intentFilters` y no lanzar (patrón `GOOGLE_MAPS_API_KEY_ANDROID`).
  `app.json` no se modifica.
  *Tests (ROJO primero):* `mobile-pet-tracker/app.config.test.ts`
  → `describe('R4 (auth-reset-deep-link): RESET_LINK_HOST declara el intent filter de App Links', ...)`
  y `describe('R4 (auth-reset-deep-link): sin RESET_LINK_HOST avisa y no declara intent filters', ...)`

- **R5**: WHEN el sistema operativo entrega a la app una URL cuyo path es
  `/reset-password` (App Link `https://` verificado o scheme
  `mobilepettracker://reset-password`), THE SYSTEM SHALL renderizar la
  pantalla de reset — ruta delgada nueva `src/app/reset-password.tsx` en el
  **nivel raíz** de `src/app/` (fuera de `(auth)` y `(tabs)`, D6) que
  renderiza `ResetPasswordScreen` de
  `src/screens/reset-password/index.tsx`, la cual lee el token con
  `useLocalSearchParams<{ token?: string }>()` — mostrando el formulario de
  contraseña nueva (inputs `reset-password` y `reset-password-confirm`,
  botón `reset-submit`); AND IF el parámetro `token` está ausente o vacío
  THEN SHALL mostrar el estado de error `reset-missing-token` (texto
  `This reset link is incomplete. Open the link from your email again.`)
  con un `LinkButton` `link-login` hacia `/login`, sin crashear y sin
  petición de red. La pantalla cumple la carta de UI: heroui-native, tokens,
  grep-clean, mensajes `selectable`.
  *Tests (ROJO primero):* `src/screens/reset-password/index.test.tsx`
  → `describe('R5: la ruta /reset-password recibe el token del deep link', ...)`
  (mockea `expo-router` con `useLocalSearchParams`, como los tests de
  `(auth)` mockean `router`)

- **R6**: WHILE la pantalla de reset está montada con un token, THE SYSTEM
  SHALL no realizar **ninguna** petición de red hasta que el usuario pulse
  `reset-submit`: montar, re-renderizar o abandonar la pantalla no llama a
  `resetPassword` ni a ningún otro fetch. Es la mitad móvil de la propiedad
  de R11: abrir el enlace (una o N veces) no consume nada.
  *Test (ROJO primero):* `src/screens/reset-password/index.test.tsx`
  → `describe('R6: abrir la pantalla no dispara ninguna peticion', ...)`
  (renderiza con token, asserta que el mock de `resetPassword` no fue
  llamado; tras pulsar submit, exactamente una vez)

- **R7**: WHEN se invoca `resetPassword(baseUrl, body, fetchFn)` — función
  nueva en `src/api/auth.ts` con `ResetPasswordRequest`
  `{ token, password, passwordConfirmation }` en `src/api/types.ts` — THE
  SYSTEM SHALL hacer `POST <baseUrl>/auth/reset-password` con JSON y mapear
  la respuesta a `ResetPasswordState`:
  `{ kind: 'ok' }` si status 200; `{ kind: 'expired' }` si 410;
  `{ kind: 'validation', errors }` si 400 con `errors[]` de zod;
  `{ kind: 'invalid-token' }` si 400 sin `errors[]` (token inexistente o ya
  usado); `{ kind: 'unreachable', message }` si el fetch lanza;
  `{ kind: 'missing-config' }` sin `baseUrl`; `{ kind: 'error' }` en
  cualquier otro caso (patrón exacto de `login`/`register`).
  *Test (ROJO primero):* `src/api/__tests__/auth.test.ts`
  → `describe('R7 (auth-reset-deep-link): resetPassword mapea la respuesta por kind', ...)`

- **R8**: WHEN el usuario pulsa `reset-submit` con los dos campos rellenos,
  THE SYSTEM SHALL llamar `resetPassword(process.env.EXPO_PUBLIC_API_URL,
  { token, password, passwordConfirmation })` deshabilitando el botón
  mientras la petición está en vuelo, y SHALL reaccionar por `kind`:
  `ok` → estado de éxito `reset-success` (texto `Password updated`) con
  `LinkButton` `link-login` hacia `/login` y el formulario retirado;
  `invalid-token` → error `Reset link is invalid or already used. Request a new one.`;
  `expired` → error `Reset link expired. Request a new one.`;
  `validation` → los `message` de los errores unidos por salto de línea;
  `unreachable` → `Cannot reach server`; `error`/`missing-config` →
  `Something went wrong`. Los errores se muestran en `reset-error`
  (`<Text selectable>`), el formulario permanece y se puede reintentar.
  *Tests (ROJO primero):* `src/screens/reset-password/index.test.tsx`
  → `describe('R8: el submit completa el reset y mapea los errores', ...)`

### Web estática — assetlinks y página fallback

- **R9**: THE SYSTEM SHALL versionar en el directorio nuevo `hosting/` (con
  `hosting/README.md` explicando qué subir a Hostinger y a dónde) el fichero
  `hosting/.well-known/assetlinks.json` con exactamente un statement:
  `relation: ["delegate_permission/common.handle_all_urls"]`, `target` con
  `namespace: "android_app"`, `package_name: "com.trackermex.pettracker"`
  (igual a `android.package` de `app.json`) y `sha256_cert_fingerprints`
  con una única entrada, el placeholder literal
  `REPLACE_WITH_DEV_BUILD_SHA256` hasta que el humano lo sustituya por el
  fingerprint real de su dev build (gate G1).
  *Test (ROJO primero):* `mobile-pet-tracker/src/__tests__/hosting-artifacts.test.ts`
  → `describe('R9: assetlinks.json delega el dominio en el paquete Android de la app', ...)`
  (lee `../../hosting/.well-known/assetlinks.json` y `app.json` del disco;
  asserta la igualdad de `package_name` y que cada fingerprint es el
  placeholder o matchea `/^([0-9A-F]{2}:){31}[0-9A-F]{2}$/`)

- **R10**: THE SYSTEM SHALL versionar `hosting/reset-password/index.html`,
  la página fallback servida en `https://<RESET_LINK_HOST>/reset-password`
  cuando la app no está instalada: HTML autocontenido (CSS inline, sin
  assets externos, en español) que (a) lee el token **solo en el cliente**
  con `URLSearchParams` sobre `location.search`, (b) ofrece un botón
  «Abrir en la app» cuyo href construye
  `mobilepettracker://reset-password?token=<token>` (fallback manual si la
  verificación de App Links falla), (c) muestra el token en un bloque
  copiable con su aviso de caducidad de 1 hora e instrucciones de instalar
  la app, y (d) **no realiza ninguna petición de red ni envía el token a
  ninguna parte**: sin `fetch`, sin `XMLHttpRequest`, sin `sendBeacon`, sin
  `<form>` con `action` remota, sin `<img>`/`<script>`/`<link>` a otros
  hosts. Cargar la página N veces no consume nada (R11).
  *Test (ROJO primero):* `mobile-pet-tracker/src/__tests__/hosting-artifacts.test.ts`
  → `describe('R10: la pagina fallback no consume el token y ofrece abrir la app', ...)`
  (lee el HTML del disco; asserta la presencia de
  `mobilepettracker://reset-password` y `URLSearchParams`, y la ausencia de
  `fetch(`, `XMLHttpRequest`, `sendBeacon` y de URLs `http` externas al
  propio documento)

### Propiedad transversal — ningún GET consume el token

- **R11**: THE SYSTEM SHALL mantener `POST /v1/auth/reset-password` como el
  **único** consumidor del token: el backend SHALL no exponer ningún handler
  GET bajo `/v1/auth/reset-password` (un GET responde `404`), AND WHEN un
  token emitido recibe N aperturas del enlace (simuladas como GETs al path
  del enlace y como montajes de la pantalla, R6) THE SYSTEM SHALL seguir
  aceptando después exactamente un `POST /v1/auth/reset-password` con ese
  token (`200`) y rechazar el segundo (`400`).
  *Test (ROJO primero):* `backend-pet-tracker/test/auth-reset-deep-link.e2e-spec.ts`
  → `describe('R11: ningun GET consume el token; solo POST reset-password lo canjea una vez', ...)`
  (obtiene el token por el mismo mecanismo que
  `test/auth-forgot-password.e2e-spec.ts`; hace varios
  `GET /v1/auth/reset-password?token=<token>` → `404`, luego `POST` → `200`,
  segundo `POST` → `400`)

### Regresión y contención

- **R12**: WHEN se ejecutan `pnpm -C backend-pet-tracker run lint`,
  `pnpm -C backend-pet-tracker exec tsc --noEmit`,
  `pnpm -C backend-pet-tracker test`,
  `pnpm -C backend-pet-tracker run test:e2e` (con `docker compose up -d`),
  `bun run lint`, `bun run typecheck` y `bun run test` (los tres en
  `mobile-pet-tracker/`) y `./init.sh` tras los cambios, THE SYSTEM SHALL
  salir con exit 0 sin regresiones; AND el grep-clean de
  `docs/ui-guidelines.md` §3 SHALL seguir limpio (cero hex fuera de
  `src/theme/`, cero clases arbitrarias, cero `StyleSheet.create` en el
  código nuevo de `mobile-pet-tracker/src/`); AND el diff SHALL tocar
  **solo** esta allowlist:

  **Nuevos**
  1. `backend-pet-tracker/src/modules/auth/infrastructure/email/password-reset-link.ts`
  2. `backend-pet-tracker/src/modules/auth/infrastructure/email/password-reset-link.spec.ts`
  3. `backend-pet-tracker/test/auth-reset-deep-link.e2e-spec.ts`
  4. `hosting/.well-known/assetlinks.json`
  5. `hosting/reset-password/index.html`
  6. `hosting/README.md`
  7. `mobile-pet-tracker/src/app/reset-password.tsx`
  8. `mobile-pet-tracker/src/screens/reset-password/index.tsx`
  9. `mobile-pet-tracker/src/screens/reset-password/index.test.tsx`
  10. `mobile-pet-tracker/src/__tests__/hosting-artifacts.test.ts`

  **Modificados (y solo en lo que dice [[design]])**
  11. `backend-pet-tracker/src/modules/auth/infrastructure/email/resend-password-reset-sender.ts` — ctor con `resetLinkHost` + URL en el cuerpo (R1, R3)
  12. `backend-pet-tracker/src/modules/auth/infrastructure/email/resend-password-reset-sender.spec.ts` — describe nuevo de R1; en el describe R1 de #58 solo se elimina la línea `expect(body.text).not.toEqual(expect.stringContaining('http'))` y se pasa el ctor nuevo
  13. `backend-pet-tracker/src/modules/auth/infrastructure/email/console-password-reset-sender.ts` — param opcional `resetLinkHost` + campo `resetUrl` (R2)
  14. `backend-pet-tracker/src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts` — describes de R2
  15. `backend-pet-tracker/src/modules/auth/auth.module.ts` — solo el `useFactory` de `PASSWORD_RESET_SENDER` (R3)
  16. `backend-pet-tracker/src/modules/auth/auth.module.spec.ts` — describe de R3 + `RESET_LINK_HOST` en el config del describe R3 de #58
  17. `mobile-pet-tracker/app.config.ts` — intent filters (R4)
  18. `mobile-pet-tracker/app.config.test.ts` — describes de R4
  19. `mobile-pet-tracker/src/api/auth.ts` — `resetPassword` (R7)
  20. `mobile-pet-tracker/src/api/types.ts` — `ResetPasswordRequest`
  21. `mobile-pet-tracker/src/api/__tests__/auth.test.ts` — describes de R7
  22. `.env.example` — `RESET_LINK_HOST=` con comentario
  23. `mobile-pet-tracker/.env.example` — `RESET_LINK_HOST=` con comentario
  24. `docs/conventions.md` — fila `RESET_LINK_HOST` en la tabla de variables
  25. `docs/verification.md` — sección `Feature 59 — auth-reset-deep-link` (gates G1–G4 paso a paso)
  26. `AGENTS.md` — fila `hosting/` en la tabla-mapa de §archivos

  **Harness** (siempre permitido): `specs/auth-reset-deep-link/**`,
  `progress/**`, `feature_list.json`, `STATUS.md`.

  AND el diff SHALL **no** tocar `resend-client.ts`, ningún fichero de
  `domain/` o `application/` del backend, `auth.controller.ts`,
  `email-rate-limit.guard.ts`, los adaptadores de verificación
  (`*email-verification*`), `app.json`, `src/app/(auth)/forgot.tsx`, ni
  `infra/`.
  *Verificación de contención:* el implementer la anota en
  `progress/impl_auth-reset-deep-link.md`; el reviewer re-ejecuta
  ```bash
  git diff --name-only main...HEAD | grep -vE \
    'password-reset-link|auth-reset-deep-link|resend-password-reset-sender|console-password-reset-sender|auth\.module|^hosting/|app\.config\.(ts|test\.ts)|src/app/reset-password|screens/reset-password|__tests__/hosting-artifacts|src/api/(auth\.ts|types\.ts|__tests__/auth\.test\.ts)|\.env\.example|docs/conventions\.md|docs/verification\.md|^AGENTS\.md|^specs/|^progress/|feature_list\.json|STATUS\.md'
  ```
  que debe salir **vacío**.

## Fuera de alcance

- **Activar el stub `forgot.tsx`** (pedir el correo desde la app). Sigue
  siendo la deuda `mobile-forgot-password` anotada por #44; esta feature
  entrega la mitad *receptora* del flujo. Para el smoke, el correo se
  dispara con `curl POST /v1/auth/forgot-password` (docs/verification.md).
- **iOS (Universal Links / `associatedDomains` / AASA).** El smoke de este
  repo es dev build de **Android** (decisión 2026-08-27, en memoria y en
  `docs/ui-guidelines.md`); no existe build ni credenciales iOS. Cuando
  exista, es una feature propia: fichero
  `/.well-known/apple-app-site-association`, entitlement y su propio smoke.
  El diseño no lo bloquea: la URL y la página fallback sirven igual.
- **Que la página fallback complete el reset contra la API.** No hay API
  pública que llamar (§Contexto fijo). Cuando el backend esté desplegado,
  la mejora es un formulario con `fetch` + CORS acotado; queda anotada en
  §Deuda y en [[design]] §D5.
- **Plantilla HTML del correo.** Sigue texto plano; los clientes de correo
  autoenlazan URLs. Un `html` bonito es cosmética que reabriría los asserts
  de #58 sin cambiar comportamiento.
- **Deploy a Hostinger, DNS y fingerprint.** El contenido de los ficheros lo
  fija esta spec; subirlos y aportar el fingerprint es del humano (G1–G2),
  igual que en #58 lo fueron los registros DNS de Resend.
- **Rate limiting, revocación de sesiones, oráculo del 409 de `register`**:
  deuda ya anotada por #44/#58, sin cambios aquí.
- **Expiración/purga física de tokens** y todo lo demás listado fuera de
  alcance en #44.

## Deuda que esta feature deja anotada (para el backlog del leader)

1. **`mobile-forgot-password`**: activar el stub `forgot.tsx` contra
   `POST /v1/auth/forgot-password` (ya estaba; sigue pendiente).
2. **Página fallback con formulario real** cuando exista API pública
   (deploy del backend): `fetch` a `POST /v1/auth/reset-password` + CORS
   acotado al origen del dominio propio.
3. **Universal Links iOS** cuando exista build iOS.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-02) ← gate obligatorio antes de implementar
- [X] Decisión D5 (página estática sin API) revisada y aceptada por el humano
